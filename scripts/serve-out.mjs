// out/ 정적 서버 (#234) — 빌드 산출물을 "배포된 사이트처럼" 띄운다.
//
// 왜 필요한가: 서비스 워커는 next dev 로 확인할 수 없다 (sw.js 는 빌드가 public/ 에서 퍼 간
// 뒤에야 out/ 에 있다). 그렇다고 아무 정적 서버나 쓰면 실제 배포와 다르게 굴어서, **로컬에서
// 통과하고 배포에서 깨지는** 검증이 된다. 실제로 그 사고가 났다 (#234 — out/ 서버가
// /index.html 을 200 으로 주는 바람에, 파일 경로로 짠 프리캐시 목록이 로컬에서만 통과했다).
//
// 그래서 두 가지를 실측대로 흉내 낸다 (프리뷰 배포에서 확인한 동작):
//   · /chapters/ch0-1/1 → chapters/ch0-1/1.html 을 준다 (확장자 생략은 호스트의 몫)
//   · /index.html · /404.html 같은 **파일 경로는 404** 다 — 라우트만 서빙된다
//
// 실행: `npm run serve:out` (npm run build 뒤에). 오프라인 확인은 이 서버를 끄면 된다.
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { join, extname, dirname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "out");
const port = Number(process.env.PORT) || 4000;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

/**
 * 요청 경로 → 실제 파일. 라우트만 서빙한다.
 *
 * `.html` 로 끝나는 요청은 파일이 실재해도 404 다 — 배포된 사이트가 그렇게 굴기 때문이고,
 * 이 서버의 존재 이유가 그 차이를 재현하는 것이다. 여기를 느슨하게 두면 서비스 워커가
 * 파일 경로를 캐시해도 로컬에서는 멀쩡해 보인다.
 */
function resolve(pathname) {
  const clean = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  if (clean.endsWith(".html")) return null;

  const base = clean === "/" ? "/index" : clean.replace(/\/$/, "");
  for (const candidate of [clean, `${base}.html`]) {
    const full = join(outDir, candidate);
    if (!full.startsWith(outDir)) continue; // 경로 탈출 차단
    try {
      if (statSync(full).isFile()) return full;
    } catch {
      /* 다음 후보 */
    }
  }
  return null;
}

createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://localhost:${port}`);
  const file = resolve(pathname);

  if (!file) {
    const notFound = join(outDir, "404.html"); // 라우트가 아니라 오류 페이지라 직접 읽는다
    res.writeHead(404, { "Content-Type": TYPES[".html"] });
    if (existsSync(notFound)) return createReadStream(notFound).pipe(res);
    return res.end("404");
  }

  res.writeHead(200, {
    "Content-Type": TYPES[extname(file)] ?? "application/octet-stream",
    // 브라우저 HTTP 캐시를 끼워 두면 "오프라인이라 뜬 건지 캐시라 뜬 건지"를 못 가린다.
    // 서비스 워커 캐시만 남기려고 끈다.
    "Cache-Control": "no-store",
  });
  createReadStream(file).pipe(res);
}).listen(port, () => {
  console.log(`out/ 서빙 중: http://localhost:${port}`);
});
