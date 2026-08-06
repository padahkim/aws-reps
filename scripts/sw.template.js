// 서비스 워커 원본 (#234). 손으로 쓰는 건 이 파일이고, 배포되는 out/sw.js 는 생성물이다 —
// scripts/gen-sw.mjs 가 아래 두 자리표시자(VERSION·PRECACHE)를 채워 굽는다 (postbuild).
// 자리표시자 이름은 여기 말고 다른 데 적지 않는다: 생성기가 전부 치환해 버려 주석이 깨진다.
//
// 전략: 콘텐츠는 배포 시에만 바뀌는 정적 사이트(output: "export")라 **cache-first** 다.
// 캐시 이름에 빌드 해시가 들어가므로, 새 배포는 새 캐시를 채우고 activate 에서 옛 캐시를 지운다.
//
// 갱신은 자동이 아니다: install 에서 skipWaiting() 을 부르지 않는다. 새 워커는 대기 상태로
// 머물고, 화면의 갱신 배너(app/service-worker.tsx)가 사용자의 클릭을 받아 SKIP_WAITING 을
// 보냈을 때 비로소 넘어간다 — 학습 중에 보던 내용이 발밑에서 바뀌지 않게 하는 것이 목적이다.

const VERSION = "__VERSION__";
const CACHE = `aws-reps-${VERSION}`;
const PRECACHE = __PRECACHE__;

/** 한 번에 던지는 요청 수 — 650개를 동시에 열면 모바일 네트워크가 버티지 못한다. */
const BATCH = 24;

self.addEventListener("install", (event) => {
  event.waitUntil(precache());
});

async function precache() {
  const cache = await caches.open(CACHE);
  const failed = [];

  for (let i = 0; i < PRECACHE.length; i += BATCH) {
    await Promise.all(
      PRECACHE.slice(i, i + BATCH).map(async (path) => {
        try {
          // cache: "reload" — 브라우저 HTTP 캐시의 옛 사본을 그대로 담지 않게.
          const res = await fetch(path, { cache: "reload" });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          await cache.put(path, res);
        } catch {
          failed.push(path);
        }
      }),
    );
  }

  // 일부 실패로 설치를 통째로 실패시키지 않는다: 오프라인이 부분적으로 되는 편이
  // 아예 안 되는 편보다 낫다. 대신 무엇이 빠졌는지는 남긴다.
  if (failed.length) {
    console.warn(`[sw] 프리캐시 ${failed.length}/${PRECACHE.length}건 실패`, failed.slice(0, 10));
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

/**
 * 캐시 조회 키가 요청 URL 과 다를 수 있다: 정적 호스트는 /chapters/ch0-1/1 요청에
 * chapters/ch0-1/1.html 파일을 내주지만, 프리캐시 목록에는 **파일 경로** 가 들어 있다.
 * 그래서 문서 요청은 확장자를 붙여 가며 찾는다.
 */
function cacheKeys(pathname, isDocument) {
  if (!isDocument) return [pathname];
  const base = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  if (base === "") return ["/index.html"];
  return [pathname, `${base}.html`, `${base}/index.html`];
}

async function respond(req, url) {
  const isDocument = req.mode === "navigate";
  const cache = await caches.open(CACHE);

  for (const key of cacheKeys(url.pathname, isDocument)) {
    // 키를 문자열로 넘긴다 = 쿼리스트링 무시. Next 의 RSC 요청(?_rsc=...)이
    // 같은 파일을 가리키면서도 매번 다른 키가 되는 것을 막는다.
    const hit = await cache.match(key);
    if (hit) return hit;
  }

  try {
    const res = await fetch(req);
    // 배포 뒤 새로 등장한 자산(해시 청크 등)은 만나는 김에 담아 둔다.
    // 실패해도 응답을 돌려주는 데는 지장이 없으므로 삼킨다 (await 하지 않는다).
    if (res.ok && res.type === "basic") cache.put(url.pathname, res.clone()).catch(() => {});
    return res;
  } catch (err) {
    if (isDocument) {
      const shell = await cache.match("/index.html");
      if (shell) return shell;
    }
    throw err;
  }
}
