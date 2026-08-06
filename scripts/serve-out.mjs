// out/ 정적 서버 (#234) — 빌드 산출물을 "정적 호스트처럼" 띄운다.
//
// 왜 필요한가: 서비스 워커는 next dev 로는 확인할 수 없다. sw.js 도 프리캐시 목록도 빌드
// 산출물이라 out/ 에만 있기 때문이다. 그렇다고 아무 정적 서버나 쓰면 /chapters/ch0-1/1 을
// 404 로 돌려준다 — 실제 파일명은 1.html 이고, 확장자를 지워 주는 건 호스트(Vercel)의 몫이다.
// 그 한 가지 동작을 흉내 내서 오프라인 확인이 실제 배포와 같은 조건에서 되게 한다.
//
// 실행: `npm run serve:out` (npm run build 뒤에). 오프라인 확인은 이 서버를 끄면 된다.
import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";
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

/** 요청 경로 → 실제 파일. 호스트의 확장자 생략 규칙을 흉내 낸다. */
function resolve(pathname) {
  const clean = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  const base = clean === "/" ? "/index" : clean.replace(/\/$/, "");
  for (const candidate of [clean, `${base}.html`, join(base, "index.html")]) {
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
    const notFound = resolve("/404.html");
    res.writeHead(404, { "Content-Type": TYPES[".html"] });
    if (notFound) return createReadStream(notFound).pipe(res);
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
