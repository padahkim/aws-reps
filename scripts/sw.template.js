// 서비스 워커 원본 (#234). 손으로 쓰는 건 이 파일이고, 배포되는 public/sw.js 는 생성물이다 —
// scripts/gen-sw.ts 가 아래 자리표시자(VERSION·ROUTES·PAYLOADS·ASSETS)를 채워 굽는다.
// 자리표시자 이름은 여기 말고 다른 데 적지 않는다: 생성기가 전부 치환해 버려 주석이 깨진다.
//
// 전략: 콘텐츠는 배포 시에만 바뀌는 정적 사이트(output: "export")라 **cache-first** 다.
// 캐시 이름에 빌드 해시가 들어가므로, 새 배포는 새 캐시를 채우고 activate 에서 옛 캐시를 지운다.
//
// 프리캐시 목록이 왜 두 갈래인가:
//   ROUTES·PAYLOADS·ASSETS — 빌드 **전에** 아는 것. URL 이 콘텐츠 레지스트리에서 나온다.
//   /_next/static/…       — 해시가 박혀 빌드 전에는 이름을 모른다. 그래서 설치 시점에
//                           방금 캐시한 HTML 을 읽어 **거기 적힌 것만** 담는다.
//   이 파일이 public/ 에 있어야(=빌드 전에 존재해야) 배포에 실리기 때문에 이렇게 나뉜다 —
//   빌드 뒤에 out/ 로 써 넣은 파일은 호스트가 서빙하지 않는다 (실측).
//
// 갱신은 자동이 아니다: install 에서 skipWaiting() 을 부르지 않는다. 새 워커는 대기 상태로
// 머물고, 화면의 갱신 배너(app/service-worker.tsx)가 사용자의 클릭을 받아 SKIP_WAITING 을
// 보냈을 때 비로소 넘어간다 — 학습 중에 보던 내용이 발밑에서 바뀌지 않게 하는 것이 목적이다.

const VERSION = "__VERSION__";
const CACHE = `aws-reps-${VERSION}`;
const ROUTES = __ROUTES__;
const PAYLOADS = __PAYLOADS__;
const ASSETS = __ASSETS__;

/** 한 번에 던지는 요청 수 — 수십 개를 동시에 열면 모바일 네트워크가 버티지 못한다. */
const BATCH = 12;

/** HTML 안에 적힌 빌드 자산 경로. 따옴표·역슬래시에서 자연히 끊긴다. */
const ASSET_IN_HTML = /\/_next\/static\/[A-Za-z0-9._\/-]+/g;

self.addEventListener("install", (event) => {
  event.waitUntil(precache());
});

/**
 * 프리캐시는 **전부 아니면 전무**다 (Codex P1, PR #238).
 *
 * 처음에는 일부 실패를 눈감고 설치를 마치게 했었다 — "부분적으로라도 오프라인이 되는 편이
 * 낫다"는 생각이었는데, 갱신 경로에서 그게 뒤집힌다: activate 가 옛 캐시를 지우므로,
 * 흔들리는 네트워크에서 갱신을 한 번 수락하면 **멀쩡히 되던 오프라인 페이지가 사라진다**.
 * 그래서 하나라도 실패하면 이번 캐시를 버리고 설치를 실패시킨다. 그러면 새 워커가 대기
 * 상태로 가지 않아 배너도 안 뜨고, 쓰던 캐시는 그대로 남는다. 브라우저가 나중에 다시 시도한다.
 *
 * 대가는 첫 설치가 실패하면 오프라인이 아예 없다는 것인데, 그건 다음 방문에 다시 시도된다.
 * 덕분에 "aws-reps-<버전> 캐시는 언제나 완전하다"가 불변식이 되고, activate 의 청소가
 * 항상 안전해진다.
 */
async function precache() {
  const cache = await caches.open(CACHE);

  try {
    // 1) 문서 — 캐시하면서 본문에 적힌 빌드 자산 경로를 함께 걷는다.
    const assets = new Set(ASSETS);
    await eachBatch(ROUTES, async (path) => {
      const html = await store(cache, path, true);
      for (const m of html.match(ASSET_IN_HTML) ?? []) assets.add(m);
    });

    // 2) RSC 페이로드 — 오프라인에서 <Link> 이동이 살아 있으려면 필요하다.
    await eachBatch(PAYLOADS, (path) => store(cache, path, false));

    // 3) 1)에서 찾아낸 청크·CSS. 문서를 담은 뒤라야 목록이 완성된다.
    await eachBatch([...assets], (path) => store(cache, path, false));

    console.info(`[sw] 프리캐시 완료 — 문서 ${ROUTES.length}, 자산 ${assets.size}`);
  } catch (err) {
    // 반쯤 찬 캐시를 남기지 않는다 — 다음 설치가 그걸 완전한 것으로 오인한다.
    await caches.delete(CACHE);
    console.warn("[sw] 프리캐시 실패 — 설치를 중단한다 (쓰던 캐시는 그대로 둔다)", err);
    throw err;
  }
}

async function eachBatch(items, run) {
  for (let i = 0; i < items.length; i += BATCH) {
    await Promise.all(items.slice(i, i + BATCH).map(run));
  }
}

/**
 * 받아서 캐시에 넣는다. wantText 면 본문을 문자열로 돌려준다(자산 수집용).
 * 실패하면 한 번 더 시도한다 — 전부 아니면 전무로 바꾼 만큼, 순간적인 실패 하나로
 * 오프라인을 통째로 포기하지 않게 한다.
 */
async function store(cache, path, wantText, retry = true) {
  try {
    // cache: "reload" — 브라우저 HTTP 캐시의 옛 사본을 그대로 담지 않게.
    const res = await fetch(path, { cache: "reload" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = wantText ? await res.clone().text() : "";
    await cache.put(path, res);
    return text;
  } catch (err) {
    if (retry) return store(cache, path, wantText, false);
    throw new Error(`프리캐시 실패: ${path} (${err.message})`);
  }
}

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.filter((n) => n.startsWith("aws-reps-") && n !== CACHE).map((n) => caches.delete(n)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(respond(req, url));
});

async function respond(req, url) {
  const isDocument = req.mode === "navigate";
  const cache = await caches.open(CACHE);

  // 키를 문자열(경로)로 넘긴다 = 쿼리스트링 무시. Next 의 RSC 요청(?_rsc=…)과 Vercel 이
  // 자산에 붙이는 ?dpl=… 이 같은 파일을 가리키면서 매번 다른 키가 되는 것을 막는다.
  for (const key of cacheKeys(url.pathname)) {
    const hit = await cache.match(key);
    if (hit) return hit;
  }

  try {
    const res = await fetch(req);
    // 배포 뒤 새로 등장한 자산은 만나는 김에 담아 둔다. 실패해도 응답에는 지장이 없다.
    if (res.ok && res.type === "basic") cache.put(url.pathname, res.clone()).catch(() => {});
    return res;
  } catch (err) {
    // 캐시에 없는 주소를 오프라인에서 열었을 때 — 홈이라도 띄워 준다.
    if (isDocument) {
      const shell = await cache.match("/");
      if (shell) return shell;
    }
    throw err;
  }
}

function cacheKeys(pathname) {
  if (pathname !== "/" && pathname.endsWith("/")) return [pathname, pathname.slice(0, -1)];
  return [pathname];
}
