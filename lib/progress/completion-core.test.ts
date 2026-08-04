/**
 * 챕터 완료 판정 픽스처 (#224) — 조건식(§2-3)·"열람 완료"(D4)·배지 유지(D5)가 설계대로
 * 동작하는지 확인한다. 설계 정본: docs/design/LEARNING_LOOP_DRAFT.md §2-3·§2-4.
 *
 * 실행: `npm run progress:test`. 하나라도 어긋나면 종료 코드 1.
 * (`records-core.test.ts`·`review-core.test.ts` 와 같은 방식 — 러너 없이 node 가 직접 실행한다.)
 *
 * **여기서 지키는 것**: 이 판정의 결함은 화면에 "고장"으로 안 보인다. 통과선이 한 문항
 * 어긋나거나 "전 문항 시도" 조건이 빠지면 **완료가 아닌 챕터에 완료 배지가 붙고**, 그 위에
 * 진행률·도메인 커버리지(§3)까지 쌓인다. 사용자는 자기가 끝냈다고 믿는 챕터를 다시 안 본다 —
 * 시험장에서야 드러나는 종류의 오류다.
 */
import {
  chapterStatus,
  earnsCompletion,
  finalQuizOutcome,
  PASS_PERCENT,
  type ChapterCompletionInput,
} from "./completion-core.ts";
import type { QuestionRecord } from "./records-core.ts";

let failures = 0;

function pass(label: string, note = ""): void {
  console.log(`  ✓ ${label}${note ? ` → ${note}` : ""}`);
}

function fail(label: string, detail: string): void {
  failures++;
  console.error(`  ✗ ${label}: ${detail}`);
}

function show(value: unknown): string {
  return JSON.stringify(value, (_key, v: unknown) =>
    v !== null && typeof v === "object" && !Array.isArray(v)
      ? Object.fromEntries(
          Object.entries(v as Record<string, unknown>).sort(([a], [b]) => (a < b ? -1 : 1)),
        )
      : v,
  );
}

function expectSame(label: string, actual: unknown, expected: unknown): void {
  if (show(actual) === show(expected)) pass(label);
  else fail(label, `기대 ${show(expected)} · 실제 ${show(actual)}`);
}

function expectTrue(label: string, ok: boolean, detail = "거짓이다"): void {
  if (ok) pass(label);
  else fail(label, detail);
}

// ── 픽스처 ────────────────────────────────────────────────────────────────

const CH = "ch1-1";
const AT = "2026-08-04T09:00:00.000Z";

/** 문항 기록 하나 — 완료 판정이 보는 것은 `lastResult` 뿐이라 나머지는 앞뒤만 맞춘다. */
function rec(last: "pass" | "fail", over: Partial<QuestionRecord> = {}): QuestionRecord {
  return { attempts: 1, correct: last === "pass" ? 1 : 0, lastResult: last, lastAt: AT, ...over };
}

/** `n` 문항짜리 챕터의 finalQ 키 목록. */
function keys(n: number): string[] {
  return Array.from({ length: n }, (_, i) => `${CH}:q${i + 1}`);
}

/**
 * 앞에서부터 `passed` 문항은 정답, 그다음 `failed` 문항은 오답, 나머지는 **미시도**인 기록.
 * 세 축(정답 수·시도 수·문항 수)을 따로 흔들 수 있어야 조건식의 각 항을 홀로 깰 수 있다.
 */
function records(passed: number, failed = 0): Record<string, QuestionRecord> {
  const out: Record<string, QuestionRecord> = {};
  for (let i = 0; i < passed; i++) out[`${CH}:q${i + 1}`] = rec("pass");
  for (let i = passed; i < passed + failed; i++) out[`${CH}:q${i + 1}`] = rec("fail");
  return out;
}

/** 판정 입력 한 벌 — 필드를 덮어써 케이스를 만든다. */
function input(over: Partial<ChapterCompletionInput> = {}): ChapterCompletionInput {
  return { readSections: [1], finalKeys: keys(5), questions: records(5), ...over };
}

// ── 1. finalQ 집계 (§2-3) ─────────────────────────────────────────────────

console.log("── finalQ 집계 ──");

expectSame("전 문항 시도 · 전부 정답", finalQuizOutcome(keys(5), records(5)), {
  total: 5, attempted: 5, passed: 5, cleared: true,
});
expectSame("한 문항도 안 풀었다", finalQuizOutcome(keys(5), {}), {
  total: 5, attempted: 0, passed: 0, cleared: false,
});
// 기록에 있는 다른 챕터·다른 문항은 이 챕터의 집계에 끼어들지 않는다 (키로만 짚는다)
expectSame("남의 문항 기록은 안 센다", finalQuizOutcome(keys(2), { ...records(2), "ch0-1:q9": rec("pass") }), {
  total: 2, attempted: 2, passed: 2, cleared: true,
});

// 마지막 시도 기준 (§2-3) — 숙달(졸업)이 아니라 lastResult 다. 재응시 정답이 그대로 반영되고,
// 첫 시도에 맞혔어도 마지막에 틀렸으면 안 센다
expectSame(
  "첫 오답 → 재응시 정답은 통과로 센다",
  finalQuizOutcome(keys(1), { [`${CH}:q1`]: rec("pass", { attempts: 2, correct: 1, firstResult: "fail" }) }).passed,
  1,
);
expectSame(
  "첫 정답 → 재응시 오답은 안 센다",
  finalQuizOutcome(keys(1), { [`${CH}:q1`]: rec("fail", { attempts: 2, correct: 1, firstResult: "pass" }) }).passed,
  0,
);

// ── 2. 통과선 80% 경계 (D7) ──────────────────────────────────────────────

console.log("\n── 통과선 80% 경계 ──");

expectSame("통과선은 80% 다", PASS_PERCENT, 80);
// 정확히 80% 는 통과다 ("이상"이 경계) — 5문항 중 4, 10문항 중 8
expectTrue("5문항 중 4정답 = 80% → 통과", finalQuizOutcome(keys(5), records(4, 1)).cleared);
expectTrue("10문항 중 8정답 = 80% → 통과", finalQuizOutcome(keys(10), records(8, 2)).cleared);
expectTrue("5문항 중 3정답 = 60% → 미통과", !finalQuizOutcome(keys(5), records(3, 2)).cleared);
// 나누어떨어지지 않는 분모 — 현행 챕터가 실제로 11·15문항이라 이 경계가 실물이다
expectTrue("11문항 중 9정답 = 81.8% → 통과", finalQuizOutcome(keys(11), records(9, 2)).cleared);
expectTrue("11문항 중 8정답 = 72.7% → 미통과", !finalQuizOutcome(keys(11), records(8, 3)).cleared);
expectTrue("15문항 중 12정답 = 80% → 통과", finalQuizOutcome(keys(15), records(12, 3)).cleared);
expectTrue("15문항 중 11정답 = 73.3% → 미통과", !finalQuizOutcome(keys(15), records(11, 4)).cleared);

// 전 문항 시도 조건 — 비율만 보면 통과지만 안 푼 문항이 남았다. 이 항이 빠지면 11문항 중
// 1개만 풀어 맞힌 상태가 100% 로 통과한다
expectTrue(
  "11문항 중 10문항만 시도(전부 정답) → 미통과",
  !finalQuizOutcome(keys(11), records(10)).cleared,
);
expectTrue("1문항만 풀어 맞힌 상태 → 미통과", !finalQuizOutcome(keys(11), records(1)).cleared);
// 0문항 중 0정답을 100% 로 읽으면 퀴즈 없는 챕터가 정식 "완료"가 된다 (D4 의 구분이 사라진다)
expectSame("finalQ 가 비면 통과가 아니다", finalQuizOutcome([], {}), {
  total: 0, attempted: 0, passed: 0, cleared: false,
});

// ── 3. 판정 (§2-3 · D4) ──────────────────────────────────────────────────

console.log("\n── 판정 ──");

expectSame("열람 ∧ finalQ 통과 → 완료", chapterStatus(input()), "완료");
expectSame("열람 ∧ finalQ 미통과 → 미완료", chapterStatus(input({ questions: records(3, 2) })), "미완료");
expectSame("열람 ∧ 미시도 → 미완료", chapterStatus(input({ questions: {} })), "미완료");

// 열람 조건 — 오답 노트에서만 그 챕터 문항을 다 맞히는 경로가 실재한다. 챕터를 한 번도 열지
// 않고 완료가 되면 배지가 "본편을 마쳤다"는 뜻을 잃는다
expectSame("열람 없이 finalQ 통과 → 미완료", chapterStatus(input({ readSections: [] })), "미완료");
// 열람의 정의는 "섹션 하나라도 읽음"이다 (§2-3: 열람 = 방문). 전 섹션 완독이 아니다
expectSame("섹션 하나만 읽어도 열람이다", chapterStatus(input({ readSections: [3] })), "완료");

// D4 — 퀴즈 없는 챕터. #29 로 들어올 레거시 다수가 여기 해당한다
expectSame("finalQ 없음 + 열람 → 열람 완료", chapterStatus(input({ finalKeys: [], questions: {} })), "열람 완료");
expectSame(
  "finalQ 없음 + 미열람 → 미완료",
  chapterStatus(input({ finalKeys: [], questions: {}, readSections: [] })),
  "미완료",
);

// ── 4. 배지 유지 (D5, §2-4) ──────────────────────────────────────────────

console.log("\n── 배지 유지 ──");

// 완료 후 그 챕터 문항을 다시 틀려도 배지는 그대로다. 강등하면 진행률이 오르내려 완주 동기를
// 해친다 — 망각은 "복습 n" 병기와 복습 루프가 맡는다
expectSame(
  "스냅샷이 있으면 지금 미통과여도 완료",
  chapterStatus(input({ questions: records(0, 5), completedAt: AT })),
  "완료",
);
expectSame(
  "스냅샷이 있으면 전 문항 미시도여도 완료",
  chapterStatus(input({ questions: {}, completedAt: AT })),
  "완료",
);
// 저장된 스냅샷은 지난 사실이고 읽음 진도는 지금 상태다 — 한쪽 키만 지워졌다고 딴 배지를
// 회수하지 않는다 (두 키는 따로 지워질 수 있다)
expectSame(
  "읽음 진도가 비어도 스냅샷은 배지를 지킨다",
  chapterStatus(input({ readSections: [], completedAt: AT })),
  "완료",
);
// 콘텐츠 개편으로 finalQ 가 사라진 챕터 — 통과했던 사실이 "열람 완료"로 강등되지 않는다
expectSame(
  "스냅샷 + finalQ 사라짐 → 여전히 완료",
  chapterStatus(input({ finalKeys: [], questions: {}, completedAt: AT })),
  "완료",
);

// ── 5. 스냅샷을 남길 순간 (earnsCompletion) ──────────────────────────────

console.log("\n── 스냅샷 조건 ──");

// 쓰기 경로가 보는 값이다. `chapterStatus` 와 달리 **저장된 스냅샷을 보지 않는다** — 조건식
// 그대로여야 "처음 충족한 시각"이 그 순간을 가리킨다
expectTrue("열람 ∧ 통과 → 남긴다", earnsCompletion(input()));
expectTrue("열람 없음 → 안 남긴다", !earnsCompletion(input({ readSections: [] })));
expectTrue("미통과 → 안 남긴다", !earnsCompletion(input({ questions: records(3, 2) })));
expectTrue("전 문항 시도 안 함 → 안 남긴다", !earnsCompletion(input({ questions: records(4) })));
// 퀴즈 없는 챕터는 스냅샷을 남기지 않는다: "열람 완료"는 열람에서 파생되므로 저장할 사실이
// 없다 (§4-1). 저장하면 나중에 그 챕터에 퀴즈가 생겼을 때 풀지도 않은 완료가 굳는다
expectTrue("finalQ 없음 → 안 남긴다", !earnsCompletion(input({ finalKeys: [], questions: {} })));
// 이미 스냅샷이 있어도 조건 자체는 그대로 참이다 (중복 저장은 쓰기 쪽이 막는다)
expectTrue("스냅샷이 있어도 조건은 조건이다", earnsCompletion(input({ completedAt: AT })));

// ── 결과 ─────────────────────────────────────────────────────────────────

console.log("");
if (failures === 0) {
  console.log("✓ 챕터 완료 판정 픽스처 전부 통과");
} else {
  console.error(`✗ 챕터 완료 판정 픽스처 ${failures}건 실패`);
  process.exit(1);
}
