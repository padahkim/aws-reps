/**
 * 진도·커버리지 집계 픽스처 (#235) — 진행률 분자("열람 완료" 포함, D4·D6)와 도메인 그룹핑
 * (§3-2: meta 값 그대로 귀속·첫 등장 순서·미판정=미완료)이 설계대로인지 확인한다.
 * 설계 정본: docs/design/LEARNING_LOOP_DRAFT.md §3-1·§3-2.
 *
 * 실행: `npm run progress:test`. 하나라도 어긋나면 종료 코드 1.
 * (`completion-core.test.ts` 와 같은 방식 — 러너 없이 node 가 직접 실행한다.)
 *
 * **여기서 지키는 것**: 이 집계의 결함은 그럴듯한 숫자로 나온다 — "열람 완료"가 분자에서
 * 빠져도, 도메인 하나가 사라져도 화면은 멀쩡하다. 사용자는 그 숫자로 어느 챕터를 다시 볼지
 * 정하므로, 조용히 틀린 진행률은 학습 계획을 틀리게 한다.
 */
import type { ChapterStatus } from "./completion-core.ts";
import { countsAsDone, domainCoverage } from "./coverage-core.ts";

let failures = 0;

function pass(label: string, note = ""): void {
  console.log(`  ✓ ${label}${note ? ` → ${note}` : ""}`);
}

function fail(label: string, detail: string): void {
  failures++;
  console.error(`  ✗ ${label}: ${detail}`);
}

function eq(label: string, actual: unknown, expected: unknown): void {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) pass(label, a);
  else fail(label, `기대 ${e} / 실제 ${a}`);
}

console.log("countsAsDone — 진행률 분자 (§3-1)");
{
  eq("정식 완료는 센다", countsAsDone("완료"), true);
  // D4·D6 의 요점 — 퀴즈 없는 챕터가 열람만으로 닫힌 것도 진행률에 들어가야
  // #29 레거시 유입 기간 내내 진행률이 눌리지 않는다
  eq('"열람 완료"도 센다 (D4·D6)', countsAsDone("열람 완료"), true);
  eq("미완료는 안 센다", countsAsDone("미완료"), false);
}

console.log("domainCoverage — 도메인별 집계 (§3-2)");
{
  // 현행 레지스트리 모양 그대로의 픽스처: foundation 2 + Development 2 (순서 = 커리큘럼)
  const chapters = [
    { id: "ch0-1", domain: "foundation" },
    { id: "ch0-2", domain: "foundation" },
    { id: "ch1-1", domain: "Development" },
    { id: "ch1-2", domain: "Development" },
  ];
  const status: Record<string, ChapterStatus> = {
    "ch0-1": "완료",
    "ch0-2": "열람 완료",
    "ch1-1": "미완료",
    // ch1-2 는 의도적으로 키 없음 — 미판정은 "미완료"로 센다 (분모에서 빼면 커버리지가 부푼다)
  };
  eq(
    "그룹핑·분자·분모 — 열람 완료 포함, 미판정은 분모에 남는다",
    domainCoverage(chapters, status),
    [
      { domain: "foundation", done: 2, total: 2 },
      { domain: "Development", done: 0, total: 2 },
    ],
  );
}

{
  // 순서 = 첫 등장 순서. 재분류·정렬하지 않는다 — 입력(레지스트리)이 곧 학습 순서다
  const chapters = [
    { id: "a", domain: "Security" },
    { id: "b", domain: "foundation" },
    { id: "c", domain: "Security" },
  ];
  eq(
    "첫 등장 순서 유지 + meta 값 그대로 귀속",
    domainCoverage(chapters, { a: "완료" }).map((s) => s.domain),
    ["Security", "foundation"],
  );
}

{
  eq("빈 레지스트리는 빈 목록", domainCoverage([], {}), []);
}

if (failures > 0) {
  console.error(`\n${failures}건 실패`);
  process.exit(1);
}
console.log("\ncoverage-core: 전부 통과");
