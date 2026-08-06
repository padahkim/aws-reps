/**
 * gen-sw 프리캐시 목록 필터 회귀 테스트 (#234).
 *
 * 고정하는 것은 하나다: `/_source` 가 프리캐시 목록에 절대 들어가지 않는다.
 * 이게 조용히 깨지는 경로가 실재한다 — Vercel preview 빌드에서는 out/_source/ 가 실제로
 * 존재하기 때문에(gen-source-routes.mjs 의 --build 분기), 필터가 느슨해지는 순간 날것 원본
 * 9MB 가 사용자 기기로 따라 내려간다. 로컬 빌드에는 그 폴더가 없어 눈으로는 안 잡힌다.
 *
 * 실행: `npm run sw:test`. 하나라도 어긋나면 종료 코드 1.
 */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { collect, shouldPrecache } from "./gen-sw.mjs";

let failures = 0;

function check(label, actual, expected) {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? "✓" : "✗"} ${label}${ok ? "" : ` — 기대 ${expected}, 실제 ${actual}`}`);
}

console.log("── shouldPrecache ──");
check("/_source 라우트 자체", shouldPrecache("_source"), false);
check("/_source 하위 HTML", shouldPrecache("_source/dynamodb-guide.html"), false);
check("/_source 깊은 하위", shouldPrecache("_source/a/b/c.txt"), false);
// 폴더 옆에 나란히 떨어지는 인덱스 라우트 — 실제로 여기서 2건이 샜다 (#234)
check("/_source 인덱스 HTML", shouldPrecache("_source.html"), false);
check("/_source 인덱스 RSC", shouldPrecache("_source.txt"), false);
check("서비스 워커 자기 자신", shouldPrecache("sw.js"), false);
check("숨김 파일", shouldPrecache(".DS_Store"), false);
check("숨김 폴더 하위", shouldPrecache("_next/.cache/x.js"), false);
// 이름이 비슷하다고 걸리면 안 되는 것들 — _next 는 앱 구동에 반드시 필요하다
check("_next 청크", shouldPrecache("_next/static/chunks/abc.js"), true);
check("_source 로 시작하는 다른 이름", shouldPrecache("_sourcemap/x.js"), true);
check("홈 HTML", shouldPrecache("index.html"), true);
check("섹션 HTML", shouldPrecache("chapters/ch0-1/1.html"), true);
check("RSC 페이로드", shouldPrecache("chapters/ch0-1/__next._tree.txt"), true);
check("매니페스트", shouldPrecache("manifest.webmanifest"), true);

console.log("\n── collect (preview 빌드 모사: out/_source 가 실재하는 트리) ──");
const dir = mkdtempSync(join(tmpdir(), "gen-sw-test-"));
try {
  mkdirSync(join(dir, "_source", "nested"), { recursive: true });
  mkdirSync(join(dir, "_next", "static"), { recursive: true });
  mkdirSync(join(dir, "chapters"), { recursive: true });
  writeFileSync(join(dir, "index.html"), "x");
  writeFileSync(join(dir, "sw.js"), "x");
  writeFileSync(join(dir, ".DS_Store"), "x");
  writeFileSync(join(dir, "_next", "static", "a.js"), "x");
  writeFileSync(join(dir, "chapters", "ch0-1.html"), "x");
  writeFileSync(join(dir, "_source", "raw.html"), "x");
  writeFileSync(join(dir, "_source", "nested", "raw.txt"), "x");
  writeFileSync(join(dir, "_source.html"), "x");
  writeFileSync(join(dir, "_source.txt"), "x");

  const files = collect(dir);
  check("_source 가 한 건도 없다", files.some((f) => f.includes("_source")), false);
  check("목록 내용", files.join("|"), "_next/static/a.js|chapters/ch0-1.html|index.html");
} finally {
  rmSync(dir, { recursive: true, force: true });
}

console.log("");
if (failures === 0) {
  console.log("✓ 모든 케이스 통과");
} else {
  console.error(`✗ ${failures}건 실패`);
  process.exit(1);
}
