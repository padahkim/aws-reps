/**
 * 서비스 워커 프리캐시 목록 회귀 테스트 (#234).
 *
 * 고정하는 것 셋:
 *   1. `/_source` 가 목록에 절대 들어가지 않는다. dev 검수 도구의 날것 원본 9MB 이고,
 *      Vercel preview 빌드에는 실제로 존재한다 (gen-source-routes.mjs 의 --build 분기).
 *   2. 목록은 **배포된 URL 형태**다 — 파일 경로(.html)가 아니라 깨끗한 라우트.
 *      실측: 호스트는 /index.html 을 404 로 돌려준다. 이걸 담으면 캐시가 통째로 빈다.
 *   3. 자리표시자가 하나도 남지 않는다 — 남으면 조용히 빈 캐시로 배포된다.
 *
 * 실행: `npm run sw:test`. 하나라도 어긋나면 종료 코드 1.
 */
import { payloadPath, siteRoutes } from "../lib/chapter-routes.ts";
import { buildSw } from "./gen-sw.ts";

let failures = 0;

function check(label: string, actual: unknown, expected: unknown) {
  const ok = Object.is(actual, expected);
  if (!ok) failures++;
  console.log(`${ok ? "✓" : "✗"} ${label}${ok ? "" : ` — 기대 ${String(expected)}, 실제 ${String(actual)}`}`);
}

const routes = siteRoutes();

console.log("── siteRoutes ──");
check("비어 있지 않다", routes.length > 0, true);
check("_source 없음", routes.some((r) => r.includes("_source")), false);
check(".html 파일 경로 없음", routes.some((r) => r.endsWith(".html")), false);
check("전부 / 로 시작", routes.every((r) => r.startsWith("/")), true);
check("중복 없음", new Set(routes).size, routes.length);
check("홈 포함", routes.includes("/"), true);
check("용어집 포함", routes.includes("/glossary"), true);
check("오답 노트 포함", routes.includes("/review"), true);
check("챕터 목차 포함", routes.includes("/chapters/ch0-1"), true);
check("섹션 1 포함", routes.includes("/chapters/ch0-1/1"), true);
// 섹션 번호는 1-based 연속이어야 한다 — 0 이나 구멍이 있으면 라우터와 어긋난 것이다
check("섹션 0 없음", routes.some((r) => /\/\d+$/.test(r) && r.endsWith("/0")), false);

console.log("\n── payloadPath ──");
check("루트는 /index.txt", payloadPath("/"), "/index.txt");
check("일반 라우트는 .txt 를 붙인다", payloadPath("/chapters/ch0-1/1"), "/chapters/ch0-1/1.txt");
check("용어집", payloadPath("/glossary"), "/glossary.txt");

console.log("\n── buildSw ──");
const built = buildSw("v=__VERSION__ r=__ROUTES__ p=__PAYLOADS__ a=__ASSETS__", {
  version: "abc123",
  routes: ["/", "/glossary"],
  payloads: ["/index.txt", "/glossary.txt"],
  assets: ["/icon.svg"],
});
check("버전 치환", built.includes("v=abc123"), true);
check("라우트 치환", built.includes('r=["/","/glossary"]'), true);
check("페이로드 치환", built.includes('p=["/index.txt","/glossary.txt"]'), true);
check("자산 치환", built.includes('a=["/icon.svg"]'), true);
check("자리표시자 잔여 없음", /__[A-Z]+__/.test(built), false);

/** 던지면 true. buildSw 의 fail-fast 두 방향을 각각 확인한다. */
function throws(template: string): boolean {
  try {
    buildSw(template, { version: "x", routes: [], payloads: [], assets: [] });
    return false;
  } catch {
    return true;
  }
}

const full = "__VERSION__ __ROUTES__ __PAYLOADS__ __ASSETS__";
check("정상 템플릿은 안 던진다", throws(full), false);
// 자리표시자가 지워지거나 오타 난 경우 — replaceAll 이 아무 일도 안 하고, "남은 게 없다"는
// 사후 검사도 통과해 버린다. 치환 전에 실재를 확인해야 잡힌다.
check("자리표시자가 아예 없으면 던진다", throws("__VERSION__ __ROUTES__ __PAYLOADS__"), true);
check("오타 난 자리표시자는 던진다", throws("__VERSION__ __ROUTE__ __PAYLOADS__ __ASSETS__"), true);
// 이름이 바뀌어 채우지 못하고 남은 경우 — 사후 검사가 잡는다.
check("모르는 자리표시자가 남으면 던진다", throws(`${full} __EXTRA__`), true);

console.log("");
if (failures === 0) {
  console.log("✓ 모든 케이스 통과");
} else {
  console.error(`✗ ${failures}건 실패`);
  process.exit(1);
}
