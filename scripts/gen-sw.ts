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
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { payloadPath, siteRoutes } from "../lib/chapter-routes.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** 라우트가 아니면서 오프라인에 반드시 있어야 하는 것 — 전부 public/ 산 정적 파일이다. */
const ASSETS = ["/manifest.webmanifest", "/icon.svg", "/icon-192.png", "/icon-512.png"];

/**
 * 캐시 버전 = **git 이 추적하는 파일 전부**의 해시.
 *
 * 담을 것을 열거하지 않는 이유 (Codex P1, PR #238 1라운드): 열거하면 빠뜨린 파일이 화면을
 * 바꿔도 버전이 그대로다. 그러면 sw.js 가 바이트 단위로 같아 브라우저가 갱신을 감지하지
 * 못하고, cache-first 워커가 옛 HTML 을 **영원히** 내준다. 실제로 mdx-components.tsx(생성되는
 * MDX 마크업을 정한다)와 next.config.ts 가 목록 밖에 있었다.
 *
 * 그렇다고 디렉토리를 통째로 훑으면 반대쪽에서 샌다 (Codex P2, 2라운드): tsconfig.tsbuildinfo
 * 처럼 **gitignore 된 생성물**이 섞여 든다. 그 안에는 기계별 절대 경로와 증분 컴파일 상태가
 * 들어 있어서, 같은 소스인데도 typecheck 를 돌렸는지·어느 기계인지에 따라 버전이 달라진다 →
 * 사용자에게 가짜 갱신 배너가 뜨고 4.7MB 를 통째로 다시 받는다.
 *
 * 추적 파일 목록이 두 요구를 동시에 만족한다: 배포되는 소스와 정확히 같은 집합이고
 * (열거가 아니다), gitignore 된 생성물은 정의상 빠진다 — 이 스크립트의 산출물인
 * public/sw.js · icon-*.png 도 그래서 자동으로 제외된다(자기 해시 문제도 함께 사라진다).
 */
function hashInputs(): string {
  let listing: string;
  try {
    listing = execFileSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  } catch (err) {
    // 조용히 다른 방식으로 넘어가지 않는다 — 버전 산출 방식이 바뀌면 전 사용자가 갱신을 받는다.
    throw new Error(
      `캐시 버전을 낼 수 없습니다: git ls-files 실패 (${(err as Error).message}). ` +
        `이 스크립트는 git 체크아웃에서 실행되는 것을 전제로 합니다.`,
    );
  }

  const files = listing.split("\0").filter(Boolean).sort();
  if (files.length === 0) throw new Error("git 이 추적하는 파일이 없습니다 — 체크아웃을 확인하세요.");

  const digest = createHash("sha256");
  for (const rel of files) {
    digest.update(rel).update("\0").update(readFileSync(join(root, rel))).update("\0");
  }
  return digest.digest("hex").slice(0, 12);
}

/**
 * 자리표시자를 채운다. 양쪽에서 막는다 (Codex P2, PR #238):
 *   치환 **전** — 기대한 자리표시자가 템플릿에 실재하는가. 오타나 삭제로 사라지면 replaceAll
 *                 은 아무 일도 안 하고 "남은 게 없다"는 사후 검사도 통과해 버린다.
 *   치환 **후** — 남은 __NAME__ 이 없는가. 이름이 바뀐 자리표시자를 잡는다.
 */
export function buildSw(
  template: string,
  values: { version: string; routes: string[]; payloads: string[]; assets: string[] },
): string {
  const fill: Record<string, string> = {
    __VERSION__: values.version,
    __ROUTES__: JSON.stringify(values.routes),
    __PAYLOADS__: JSON.stringify(values.payloads),
    __ASSETS__: JSON.stringify(values.assets),
  };

  let sw = template;
  for (const [token, value] of Object.entries(fill)) {
    if (!sw.includes(token)) throw new Error(`sw.template.js 에 자리표시자 ${token} 가 없습니다.`);
    sw = sw.replaceAll(token, value);
  }

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
