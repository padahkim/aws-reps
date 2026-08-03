/**
 * 진도 저장소 픽스처 (#214) — 저장된 값을 읽어 고치는 규칙(`repair*`)과 채점 사실을 얹는
 * 규칙(`applyAttempt`)이 실제로 그렇게 동작하는지 확인한다.
 *
 * 실행: `npm run progress:test`. 하나라도 어긋나면 종료 코드 1.
 * (`scripts/validate-content.test.ts` 와 같은 방식 — 러너를 들이지 않고 node 가 직접 실행한다.)
 *
 * **여기서 지키는 것**: 이 저장소는 학습 이력의 영속 계층이라 틀린 값이 조용히 저장되고 그 위에
 * 다음 채점이 누적된다. 타입도 화면도 멀쩡한 채 값만 틀리는 결함(PR #202 에서 반복해 나온
 * 종류)은 typecheck·validate·브라우저 확인 어느 것도 잡지 못한다 — 그 자리를 이 파일이 맡는다.
 *
 * 비교는 **저장되는 모양**으로 한다(`show`) — 이 저장소의 진실은 `JSON.stringify` 를 통과한
 * 뒤의 값이고, 값이 `undefined` 인 키는 거기서 사라진다.
 */
import {
  applyAttempt,
  isCount,
  isIsoInstant,
  repair,
  repairChapter,
  repairQuestion,
  V,
  type Progress,
} from "./records-core.ts";
import { globalQuestionKey, stableQuestionId } from "./keys.ts";

let failures = 0;

function pass(label: string, note = ""): void {
  console.log(`  ✓ ${label}${note ? ` → ${note}` : ""}`);
}

function fail(label: string, detail: string): void {
  failures++;
  console.error(`  ✗ ${label}: ${detail}`);
}

/** 저장되는 모양의 정규 문자열 — 키 순서를 정렬하고 값이 `undefined` 인 키는 떨군다. */
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

const GK = "1-1:q1";          // 검사 대상 문항
const NEIGHBOR = "1-1:q2";    // 같은 저장소의 멀쩡한 이웃 — 버림의 단위를 확인하는 대조군
const AT = "2026-08-03T09:00:00.000Z";
const AT2 = "2026-08-03T10:30:00.000Z";

/** 말이 되는 **다회 시도** 기록. 필드를 덮어써 케이스를 만든다. */
function rec(over: Record<string, unknown> = {}): Record<string, unknown> {
  return { attempts: 2, correct: 1, lastResult: "pass", lastAt: AT, firstResult: "fail", ...over };
}

/** 말이 되는 **1회 시도** 기록 — 시도가 1회일 때만 걸리는 규칙을 홀로 깨뜨리기 위한 바탕. */
function rec1(over: Record<string, unknown> = {}): Record<string, unknown> {
  return { attempts: 1, correct: 1, lastResult: "pass", lastAt: AT, firstResult: "pass", ...over };
}

/** 저장소 원본 한 벌 (localStorage 에서 파싱해 나온 모양). */
function store(
  questions: Record<string, unknown> = {},
  over: Record<string, unknown> = {},
): Record<string, unknown> {
  return { v: 1, chapters: {}, questions, ...over };
}

/** `repair` 를 통과한 진도 — 쓰기 케이스의 적법한 출발점이다(applyAttempt 의 전제). */
function progress(
  questions: Record<string, unknown> = {},
  over: Record<string, unknown> = {},
): Progress {
  return repair(store(questions, over));
}

/** 이 기록은 살아남고, 고쳐진 결과가 `expected` 와 정확히 같다. */
function expectKept(label: string, record: Record<string, unknown>, expected: Record<string, unknown>): void {
  const out = repair(store({ [GK]: record })).questions[GK];
  if (!out) {
    fail(label, "살아남아야 하는데 버려졌다");
    return;
  }
  if (show(out) !== show(expected)) {
    fail(label, `기대 ${show(expected)} · 실제 ${show(out)}`);
    return;
  }
  pass(label, show(out));
}

/** 이 기록은 버려지고, **이웃 문항은 그대로 살아남는다** (버리는 단위 = 문항 하나). */
function expectDropped(label: string, record: unknown): void {
  const out = repair(store({ [GK]: record, [NEIGHBOR]: rec() })).questions;
  if (GK in out) {
    fail(label, `버려야 하는데 살아남았다: ${show(out[GK])}`);
    return;
  }
  if (!(NEIGHBOR in out)) {
    fail(label, "이웃 기록까지 함께 사라졌다 — 버리는 단위는 문항 하나다");
    return;
  }
  pass(label, "버림 · 이웃 생존");
}

// ── 1. 살아남아야 하는 기록 ────────────────────────────────────────────────

console.log("── 살아남아야 하는 문항 기록 ──");

expectKept("정상 기록 + 미지 필드(box)", rec({ box: 9 }), {
  attempts: 2, correct: 1, lastResult: "pass", lastAt: AT, firstResult: "fail", box: 9,
});

// firstResult 가 생기기 전에 저장된 기록의 이행 경로 — 시도가 1회면 첫 결과 = 마지막 결과다
expectKept("시도 1회 · firstResult 없음 → lastResult 로 채움", { attempts: 1, correct: 1, lastResult: "pass", lastAt: AT }, {
  attempts: 1, correct: 1, lastResult: "pass", lastAt: AT, firstResult: "pass",
});
expectKept("시도 1회 · 오답 → firstResult=fail", { attempts: 1, correct: 0, lastResult: "fail", lastAt: AT }, {
  attempts: 1, correct: 0, lastResult: "fail", lastAt: AT, firstResult: "fail",
});

// 다회 시도는 **채우지 않는다** — 나중 시도를 첫 시도로 적으면 숙달 판정(#86)이 뒤집힌다
expectKept("시도 3회 · firstResult 없음 → 없는 채로", { attempts: 3, correct: 2, lastResult: "pass", lastAt: AT }, {
  attempts: 3, correct: 2, lastResult: "pass", lastAt: AT,
});

// 횟수 경계 — 여기는 적법하다
expectKept("correct = attempts (전부 정답)", rec({ correct: 2 }), {
  attempts: 2, correct: 2, lastResult: "pass", lastAt: AT, firstResult: "fail",
});
expectKept("correct = 0 (전부 오답)", rec({ correct: 0, lastResult: "fail" }), {
  attempts: 2, correct: 0, lastResult: "fail", lastAt: AT, firstResult: "fail",
});
expectKept("시도 1회 · firstResult = lastResult", rec1(), {
  attempts: 1, correct: 1, lastResult: "pass", lastAt: AT, firstResult: "pass",
});
// 윤년 2월 29일 — 실재하는 날짜이므로 통과해야 한다 (달력 검증이 과하게 잡지 않는지)
expectKept("lastAt = 윤년 2/29", rec({ lastAt: "2024-02-29T00:00:00.000Z" }), {
  attempts: 2, correct: 1, lastResult: "pass", lastAt: "2024-02-29T00:00:00.000Z", firstResult: "fail",
});

// ── 2. 버려야 하는 기록 (이웃은 생존) ──────────────────────────────────────

console.log("\n── 버려야 하는 문항 기록 (이웃은 생존) ──");

// 맞힘이 응시보다 많다
expectDropped("correct > attempts (1회에 3맞힘)", rec1({ correct: 3 }));
expectDropped("correct > attempts (2회에 3맞힘)", rec({ correct: 3 }));

// attempts 가 횟수가 아니다
expectDropped("attempts = 0", rec({ attempts: 0, correct: 0 }));
expectDropped("attempts = -1", rec({ attempts: -1, correct: 0 }));
expectDropped("attempts = 1.5", rec({ attempts: 1.5, correct: 1 }));
expectDropped("attempts = 문자열 \"2\"", rec({ attempts: "2" }));
expectDropped("attempts = null", rec({ attempts: null }));
expectDropped("attempts 없음", { correct: 0, lastResult: "pass", lastAt: AT });

// correct 가 횟수가 아니다
expectDropped("correct = -1", rec({ correct: -1 }));
expectDropped("correct = 1.5", rec({ correct: 1.5 }));
expectDropped("correct = 문자열 \"1\"", rec({ correct: "1" }));
expectDropped("correct 없음", { attempts: 2, lastResult: "pass", lastAt: AT });

// lastAt 이 정규 ISO 순간이 아니다 (왕복 동일성)
expectDropped("lastAt = \"망가짐\"", rec({ lastAt: "망가짐" }));
expectDropped("lastAt = \"0\" (Date.parse 는 통과시킨다)", rec({ lastAt: "0" }));
expectDropped("lastAt = 없는 날짜 2024-02-30", rec({ lastAt: "2024-02-30T00:00:00.000Z" }));
expectDropped("lastAt = 밀리초 없는 Z 형식", rec({ lastAt: "2026-08-03T09:00:00Z" }));
expectDropped("lastAt = +00:00 오프셋 표기", rec({ lastAt: "2026-08-03T09:00:00.000+00:00" }));
expectDropped("lastAt = 날짜만", rec({ lastAt: "2026-08-03" }));
expectDropped("lastAt = 에폭 숫자", rec({ lastAt: 1754211600000 }));
expectDropped("lastAt 없음", { attempts: 2, correct: 1, lastResult: "pass" });

// 결과값이 규약 밖이다
expectDropped("lastResult = \"PASS\"", rec({ lastResult: "PASS" }));
expectDropped("lastResult = true", rec({ lastResult: true }));
expectDropped("lastResult 없음", { attempts: 2, correct: 1, lastAt: AT });
expectDropped("firstResult = \"maybe\"", rec({ firstResult: "maybe" }));
expectDropped("firstResult = null", rec({ firstResult: null }));

// 시도 1회가 두 결과를 가질 수 없다
expectDropped("시도 1회 · first≠last", rec1({ correct: 0, lastResult: "fail", firstResult: "pass" }));

// 기록이 아니다
expectDropped("항목이 문자열", "그냥 문자열");
expectDropped("항목이 배열", [1, 2]);
expectDropped("항목이 null", null);
expectDropped("항목이 숫자", 3);

// ── 3. 최상위 구조 ────────────────────────────────────────────────────────

console.log("\n── 최상위 구조 ──");

expectSame("빈 저장소", repair({}), { v: V, chapters: {}, questions: {} });

// 모르는 상위 버전을 1로 되찍으면 구버전 탭이 신버전 마이그레이션을 되돌린다
expectSame("v 가 이 빌드보다 높음 + 최상위 미지 필드", repair(store({}, { v: 5, mystery: "그대로" })), {
  v: 5, chapters: {}, questions: {}, mystery: "그대로",
});
expectSame("v 없음 → V", repair({ questions: {} }), { v: V, chapters: {}, questions: {} });
expectSame("v = 0 → V", repair(store({}, { v: 0 })), { v: V, chapters: {}, questions: {} });
expectSame("v = 문자열 → V", repair(store({}, { v: "9" })), { v: V, chapters: {}, questions: {} });
expectSame("v = 1.5 → V", repair(store({}, { v: 1.5 })), { v: V, chapters: {}, questions: {} });

expectSame("questions 가 배열", repair({ questions: [] }), { v: V, chapters: {}, questions: {} });
expectSame("questions 가 문자열", repair({ questions: "x" }), { v: V, chapters: {}, questions: {} });
expectSame("chapters 가 배열", repair({ chapters: [] }), { v: V, chapters: {}, questions: {} });

{
  const before = store({ [GK]: rec({ box: 9 }) }, { mystery: 1 });
  const snapshot = show(before);
  repair(before);
  expectTrue("repair 는 입력 원본을 바꾸지 않는다", show(before) === snapshot, `원본이 ${show(before)} 로 변했다`);
}

{
  const once = repair(store({ [GK]: { attempts: 1, correct: 1, lastResult: "pass", lastAt: AT } }));
  const twice = repair(once as unknown as Record<string, unknown>);
  expectSame("repair 는 멱등이다 (두 번 돌려도 같다)", twice, once);
}

// ── 4. 챕터 기록 ──────────────────────────────────────────────────────────

console.log("\n── 챕터 기록 ──");

expectSame("visitedAt + 미지 필드 보존", repairChapter({ visitedAt: AT, note: "메모" }), {
  visitedAt: AT, note: "메모",
});
expectSame("completedAt 보존", repairChapter({ visitedAt: AT, completedAt: AT2 }), {
  visitedAt: AT, completedAt: AT2,
});
expectSame("completedAt 이 비문자열 → 떨구고 기록은 생존", repairChapter({ visitedAt: AT, completedAt: 5 }), {
  visitedAt: AT,
});
expectTrue("visitedAt 없음 → 버림", repairChapter({ completedAt: AT }) === undefined);
expectTrue("visitedAt 이 비문자열 → 버림", repairChapter({ visitedAt: 5 }) === undefined);
expectTrue("항목이 문자열 → 버림", repairChapter("x") === undefined);

expectSame(
  "망가진 챕터만 버리고 이웃 챕터는 생존",
  Object.keys(repair({ chapters: { "1-1": { visitedAt: AT }, "1-2": { note: "시각 없음" } } }).chapters),
  ["1-1"],
);

// ── 5. 형식 술어 ──────────────────────────────────────────────────────────

console.log("\n── 형식 술어 ──");

expectTrue("isIsoInstant: toISOString 형식", isIsoInstant(AT));
expectTrue("isIsoInstant: 새로 만든 시각", isIsoInstant(new Date(0).toISOString()));
for (const bad of ["0", "2024-02-30T00:00:00.000Z", "2026-08-03T09:00:00Z", "2026-08-03", "", "망가짐"]) {
  expectTrue(`isIsoInstant: ${JSON.stringify(bad)} 는 거짓`, !isIsoInstant(bad));
}
expectTrue("isIsoInstant: 숫자는 거짓", !isIsoInstant(0));
expectTrue("isIsoInstant: null 은 거짓", !isIsoInstant(null));

/** 라벨용 표기 — 문자열 `"1"` 과 숫자 `1` 이 같은 줄로 보이지 않게 따옴표를 남긴다. */
function label(value: unknown): string {
  return typeof value === "string" ? JSON.stringify(value) : String(value);
}

for (const good of [0, 1, 42]) expectTrue(`isCount: ${good} 은 참`, isCount(good));
for (const bad of [-1, 1.5, NaN, Infinity, "1", null, undefined, true]) {
  expectTrue(`isCount: ${label(bad)} 은 거짓`, !isCount(bad));
}

// ── 6. 쓰기 (applyAttempt) ────────────────────────────────────────────────

console.log("\n── 쓰기 (applyAttempt) ──");

expectSame("처음 채점 (정답)", applyAttempt(progress(), GK, true, AT).questions[GK], {
  attempts: 1, correct: 1, lastResult: "pass", lastAt: AT, firstResult: "pass",
});
expectSame("처음 채점 (오답)", applyAttempt(progress(), GK, false, AT).questions[GK], {
  attempts: 1, correct: 0, lastResult: "fail", lastAt: AT, firstResult: "fail",
});

// 재응시: 횟수는 누적, 마지막 결과는 갱신, **첫 결과는 불변**
expectSame(
  "재응시 (fail → pass): firstResult 불변",
  applyAttempt(progress({ [GK]: { attempts: 1, correct: 0, lastResult: "fail", lastAt: AT } }), GK, true, AT2)
    .questions[GK],
  { attempts: 2, correct: 1, lastResult: "pass", lastAt: AT2, firstResult: "fail" },
);
expectSame(
  "재응시 (pass → fail): correct 는 안 오른다",
  applyAttempt(progress({ [GK]: rec1() }), GK, false, AT2).questions[GK],
  { attempts: 2, correct: 1, lastResult: "fail", lastAt: AT2, firstResult: "pass" },
);

// firstResult 를 모르는 기록은 **모르는 채로 둔다** — 나중 시도를 첫 시도로 적지 않는다
expectSame(
  "firstResult 없는 다회 기록에 재응시 → 여전히 없음",
  applyAttempt(progress({ [GK]: { attempts: 3, correct: 2, lastResult: "pass", lastAt: AT } }), GK, false, AT2)
    .questions[GK],
  { attempts: 4, correct: 2, lastResult: "fail", lastAt: AT2 },
);

expectSame(
  "재응시가 미지 필드를 지우지 않는다",
  applyAttempt(progress({ [GK]: rec({ box: 9 }) }), GK, true, AT2).questions[GK],
  { attempts: 3, correct: 2, lastResult: "pass", lastAt: AT2, firstResult: "fail", box: 9 },
);

// 버려진 기록이 있는 상태에서 **다른 문항**을 채점한다
{
  const after = applyAttempt(progress({ [GK]: rec({ correct: 9 }), [NEIGHBOR]: rec() }), "1-1:q3", true, AT2);
  expectSame("버려진 것만 사라지고 나머지는 그대로", Object.keys(after.questions).sort(), [NEIGHBOR, "1-1:q3"]);
  expectSame("이웃 기록의 값은 손대지 않는다", after.questions[NEIGHBOR], {
    attempts: 2, correct: 1, lastResult: "pass", lastAt: AT, firstResult: "fail",
  });
}

// 최상위(모르는 상위 v·미지 필드)는 쓰기가 건드리지 않는다
{
  const after = applyAttempt(progress({}, { v: 5, mystery: "그대로" }), GK, true, AT);
  expectSame("쓰기가 최상위 v·미지 필드를 보존한다", { v: after.v, mystery: after.mystery }, { v: 5, mystery: "그대로" });
}

{
  const before = progress({ [NEIGHBOR]: rec() });
  const snapshot = show(before);
  applyAttempt(before, GK, true, AT);
  expectTrue("applyAttempt 는 인자를 바꾸지 않는다", show(before) === snapshot, `인자가 ${show(before)} 로 변했다`);
}

// ── 7. 쓰기 ↔ 읽기 불변식 ────────────────────────────────────────────────

console.log("\n── 쓰기 ↔ 읽기 불변식 ──");

// applyAttempt 가 만든 기록은 **반드시 다음 로드를 통과해야 한다**. 여기가 깨지면 방금 저장한
// 채점이 새로고침 한 번에 사라진다 — 화면상으로는 "가끔 진도가 없어진다"로만 보인다.
{
  const sequences: boolean[][] = [[true], [false], [true, false], [false, true], [true, true, false, true]];
  for (const seq of sequences) {
    let data = progress();
    seq.forEach((ok, i) => {
      data = applyAttempt(data, GK, ok, i === 0 ? AT : AT2);
    });
    const reloaded = repair(data as unknown as Record<string, unknown>);
    expectSame(`채점 ${seq.map((s) => (s ? "O" : "X")).join("")} 후 재로드가 같다`, reloaded, data);
  }
}

// ── 8. 전역 문항 키 ──────────────────────────────────────────────────────

console.log("\n── 전역 문항 키 (keys.ts) ──");

// slug 우선 — drills.ts 는 생성물이라 id(q1, q2…)가 위치에 따라 밀린다 (#69 → PR #202)
expectSame("slug 가 있으면 slug", stableQuestionId({ id: "q1", slug: "iam-role-vs-user" }), "iam-role-vs-user");
expectSame("slug 가 없으면 id", stableQuestionId({ id: "q1" }), "q1");
expectSame("전역 키 = 챕터:안정 id", globalQuestionKey("1-1", "iam-role-vs-user"), "1-1:iam-role-vs-user");

// ── 결과 ─────────────────────────────────────────────────────────────────

console.log("");
if (failures === 0) {
  console.log("✓ 진도 저장소 픽스처 전부 통과");
} else {
  console.error(`✗ 진도 저장소 픽스처 ${failures}건 실패`);
  process.exit(1);
}
