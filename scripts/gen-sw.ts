// 서비스 워커 빌드기 (#234) — scripts/sw.template.js → public/sw.js. prebuild 가 호출한다.
//
// **왜 public/ 이고 왜 빌드 전인가** (실측으로 정해진 것): 호스트는 빌드 산출물 디렉토리에
// 나중에 끼워 넣은 파일을 서빙하지 않는다. 프리뷰 배포에서 out/sw.js 는 404 였고, public/ 을
// 거친 아이콘·매니페스트만 200 이었다. 그래서 생성 시점이 빌드 **전**으로 고정되고,
// 프리캐시 목록은 빌드 전에 알 수 있는 것만 담는다 — 해시가 박힌 /_next/static/… 은
// 서비스 워커가 설치할 때 HTML 을 읽어 스스로 찾는다 (sw.template.js 머리말).
//
// 같은 실측에서 나온 또 하나: 배포된 사이트는 /index.html 같은 **파일 경로를 서빙하지 않는다**
// (404). 라우트 형태의 깨끗한 URL 만 200 이다. 목록이 lib/chapter-routes.ts 의 siteRoutes()
// 를 쓰는 이유가 이것이다 — 앱 라우터와 같은 재료·같은 규칙.
//
// 캐시 버전 = 사이트를 만들어 내는 소스 전부의 해시. 콘텐츠나 코드가 바뀌면 값이 바뀌고,
// 그 순간 새 캐시가 되며 사용자에게 갱신 배너가 뜬다. 아무것도 안 바뀌면 같은 값이라 조용하다.
import { readFileSync, readdirSync, writeFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { payloadPath, siteRoutes } from "../lib/chapter-routes.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** 라우트가 아니면서 오프라인에 반드시 있어야 하는 것 — 전부 public/ 산 정적 파일이다. */
const ASSETS = ["/manifest.webmanifest", "/icon.svg", "/icon-192.png", "/icon-512.png"];

/**
 * 캐시 버전의 재료 — 화면에 나타나는 것을 바꿀 수 있는 소스 전부.
 * app/%5Fsource 는 제외한다: gen-source-routes.mjs 의 생성물이고 preview 빌드에만 있어서,
 * 넣으면 같은 커밋이 배포 종류에 따라 다른 버전을 갖게 된다.
 */
const VERSION_INPUTS = ["app", "content", "lib", "scripts/sw.template.js", "public/icon.svg", "package-lock.json"];
const VERSION_EXCLUDE = new Set(["%5Fsource", "node_modules"]);

function hashInputs(): string {
  const digest = createHash("sha256");
  const walk = (abs: string) => {
    const rel = relative(root, abs).split(sep).join("/");
    const stat = statSync(abs);
    if (stat.isDirectory()) {
      for (const name of readdirSync(abs).sort()) {
        if (VERSION_EXCLUDE.has(name) || name.startsWith(".")) continue;
        walk(join(abs, name));
      }
      return;
    }
    digest.update(rel).update("\0").update(readFileSync(abs)).update("\0");
  };
  for (const input of VERSION_INPUTS) walk(join(root, input));
  return digest.digest("hex").slice(0, 12);
}

/** 자리표시자를 채운다. 채우지 못한 게 남으면 던진다 — 조용히 빈 캐시로 배포되는 것을 막는다. */
export function buildSw(
  template: string,
  values: { version: string; routes: string[]; payloads: string[]; assets: string[] },
): string {
  const sw = template
    .replaceAll("__VERSION__", values.version)
    .replaceAll("__ROUTES__", JSON.stringify(values.routes))
    .replaceAll("__PAYLOADS__", JSON.stringify(values.payloads))
    .replaceAll("__ASSETS__", JSON.stringify(values.assets));

  // 아는 이름만 확인하면 자리표시자 이름이 바뀐 경우를 놓친다 — 남은 __NAME__ 을 전부 잡는다.
  const leftover = /__[A-Z][A-Z0-9_]*__/.exec(sw);
  if (leftover) throw new Error(`sw.template.js 의 ${leftover[0]} 를 치환하지 못했습니다.`);
  return sw;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const routes = siteRoutes();
  const sw = buildSw(readFileSync(join(root, "scripts", "sw.template.js"), "utf8"), {
    version: hashInputs(),
    routes,
    payloads: routes.map(payloadPath),
    assets: ASSETS,
  });
  writeFileSync(join(root, "public", "sw.js"), sw, "utf8");
  console.log(`서비스 워커 생성 완료: public/sw.js — 문서 ${routes.length}개 + 페이로드 ${routes.length}개 + 자산 ${ASSETS.length}개`);
}
