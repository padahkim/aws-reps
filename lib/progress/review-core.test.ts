/**
 * 오답 노트 픽스처 (#219) — Leitner 상자 전이(`nextItem`·`applyResult`), 읽기 검사
 * (`repairItem`·`repairReview`), 화면이 쓰는 선별·정렬(`dueList`·`upcomingList`)이 설계대로
 * 동작하는지 확인한다. 설계 정본: docs/design/LEARNING_LOOP_DRAFT.md §1·§4-1.
 *
 * 실행: `npm run progress:test`. 하나라도 어긋나면 종료 코드 1.
 * (`records-core.test.ts` 와 같은 방식 — 러너를 들이지 않고 node 가 직접 실행한다.)
 *
 * **여기서 지키는 것**: 이 규칙의 결함은 화면에 안 보인다. 상자가 한 칸 더 오르거나, 조기
 * 정답이 승급을 통과하거나, 기한이 하루 어긋나도 그 순간의 화면은 멀쩡하고 며칠 뒤 복습 큐가
 * 이상해져서야 드러난다. 그때는 이미 그 위에 다음 채점들이 누적된 뒤다.
 */
import {
  addDays,
  applyResult,
  dueCount,
  dueList,
  INTERVAL_DAYS,
  isBox,
  nextItem,
  repairItem,
  repairReview,
  seedFromHistory,
  upcomingList,
  V,
  type Review,
  type ReviewItem,
} from "./review-core.ts";

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

const GK = "1-1:iam-role-vs-user";
const NEIGHBOR = "1-1:s3-bucket-policy";   // 버림의 단위를 확인하는 대조군
const T0 = "2026-08-04T09:00:00.000Z";
const T0_PLUS_1D = "2026-08-05T09:00:00.000Z";
const T0_PLUS_3D = "2026-08-07T09:00:00.000Z";
const T0_PLUS_7D = "2026-08-11T09:00:00.000Z";

/** 말이 되는 상자 항목. 필드를 덮어써 케이스를 만든다. */
function item(over: Record<string, unknown> = {}): Record<string, unknown> {
  return { box: 1, dueAt: T0_PLUS_1D, ...over };
}

/** 저장소 하나 — 대상 문항 + 멀쩡한 이웃. */
function store(target: Record<string, unknown>, over: Record<string, unknown> = {}): Record<string, unknown> {
  return { v: 1, items: { [GK]: target, [NEIGHBOR]: item({ box: 2, dueAt: T0_PLUS_3D }) }, ...over };
}

const EMPTY: Review = repairReview({});

// ── 1. 간격 상수와 시각 산술 ─────────────────────────────────────────────

console.log("\n── 간격·시각 산술 ──");

expectSame("상자 간격은 1·3·7일 (§1-2)", INTERVAL_DAYS, { 1: 1, 2: 3, 3: 7 });
expectSame("+1일", addDays(T0, 1), T0_PLUS_1D);
expectSame("+3일", addDays(T0, 3), T0_PLUS_3D);
expectSame("+7일", addDays(T0, 7), T0_PLUS_7D);
// 시각이 아닌 값에서 기한을 만들면 그 기한은 날조다 — 만들지 않는다
expectSame("시각이 아니면 기한도 없다", addDays("2026-08-04", 1), undefined);
expectSame("있지도 않은 날짜에서 기한을 만들지 않는다", addDays("2024-02-30T00:00:00.000Z", 1), undefined);
// 던지지 않고 undefined 를 돌려주는지 — 채점 클릭 한복판에서 던지면 화면이 죽는다
expectSame("일수가 NaN 이면 기한도 없다 (던지지 않는다)", addDays(T0, Number.NaN), undefined);
expectTrue("상자는 1·2·3 뿐", isBox(1) && isBox(2) && isBox(3));
expectTrue("0·4·문자열은 상자가 아니다", !isBox(0) && !isBox(4) && !isBox("1"));

// ── 2. 상자 전이 — 진입 (§1-2) ───────────────────────────────────────────

console.log("\n── 전이: 진입 ──");

expectSame(
  "한 번도 안 틀린 문항을 틀리면 상자 1 진입 · 기한 +1일",
  nextItem(undefined, false, T0),
  { box: 1, dueAt: T0_PLUS_1D },
);
// 오답 노트는 이름 그대로 오답만 담는다 — 첫 정답까지 넣으면 복습 큐가 전체 문항 수로 부푼다
expectSame("한 번도 안 틀린 문항을 맞히면 아무 일 없음", nextItem(undefined, true, T0), undefined);

// ── 3. 상자 전이 — 승급과 조기 정답 (D2) ─────────────────────────────────

console.log("\n── 전이: 승급 · 조기 정답 ──");

const box1Due: ReviewItem = { box: 1, dueAt: T0 };
expectSame(
  "상자 1 · due 정답 → 상자 2 · 기한 +3일",
  nextItem(box1Due, true, T0),
  { box: 2, dueAt: T0_PLUS_3D },
);
expectSame(
  "상자 2 · due 정답 → 상자 3 · 기한 +7일",
  nextItem({ box: 2, dueAt: T0 }, true, T0),
  { box: 3, dueAt: T0_PLUS_7D },
);
// 기한 도달의 경계는 "이상"이다 — 정확히 그 순간에 푼 것은 due 다
expectSame(
  "기한과 같은 순간의 정답도 승급이다",
  nextItem({ box: 1, dueAt: T0 }, true, T0),
  { box: 2, dueAt: T0_PLUS_3D },
);
// D2 — 이 한 줄이 없으면 같은 자리에서 연타해 상자를 통과할 수 있어 간격 반복이 무력화된다
expectSame(
  "조기 정답은 승급시키지 않는다 (D2)",
  nextItem({ box: 1, dueAt: T0_PLUS_1D }, true, T0),
  undefined,
);
expectSame(
  "기한 1밀리초 전의 정답도 조기 정답이다",
  nextItem({ box: 2, dueAt: T0_PLUS_1D }, true, "2026-08-05T08:59:59.999Z"),
  undefined,
);

// ── 4. 상자 전이 — 졸업과 강등 (§1-2 · §2-1) ─────────────────────────────

console.log("\n── 전이: 졸업 · 강등 ──");

expectSame(
  "상자 3 · due 정답 → 졸업",
  nextItem({ box: 3, dueAt: T0 }, true, T0),
  { box: 3, dueAt: T0_PLUS_7D, graduatedAt: T0 },
);
expectSame(
  "상자 3 · 조기 정답은 졸업도 아니다 (D2)",
  nextItem({ box: 3, dueAt: T0_PLUS_1D }, true, T0),
  undefined,
);
expectSame("졸업한 문항의 정답은 상태를 안 바꾼다", nextItem({ box: 3, dueAt: T0, graduatedAt: T0 }, true, T0_PLUS_7D), undefined);
// 망각 반영의 전부 — 졸업 문항도 다시 틀리면 상자 1로 돌아오고 졸업 표시가 지워진다
expectSame(
  "졸업한 문항을 틀리면 상자 1 재진입 · graduatedAt 삭제",
  nextItem({ box: 3, dueAt: T0_PLUS_7D, graduatedAt: T0 }, false, T0_PLUS_7D),
  { box: 1, dueAt: "2026-08-12T09:00:00.000Z" },
);
for (const box of [2, 3] as const) {
  expectSame(
    `상자 ${box} 에서 틀리면 상자 1 강등 · 기한 +1일`,
    nextItem({ box, dueAt: T0_PLUS_7D }, false, T0),
    { box: 1, dueAt: T0_PLUS_1D },
  );
}
// 오답은 due 여부와 무관하다 — 모르는 것은 언제 드러나든 사실이다
expectSame(
  "기한 전에 틀려도 강등이다",
  nextItem({ box: 3, dueAt: T0_PLUS_7D }, false, T0),
  { box: 1, dueAt: T0_PLUS_1D },
);
// 챕터 퀴즈에서 틀리든 오답 노트에서 틀리든 같은 함수를 지난다 — 그게 "강등은 어디서든"의 구현이다
expectSame(
  "시각이 시각이 아니면 전이하지 않는다",
  nextItem(box1Due, false, "2026-08-04"),
  undefined,
);

// ── 5. 미지 필드 보존 ────────────────────────────────────────────────────

console.log("\n── 미지 필드 ──");

const withExtra: ReviewItem = { box: 1, dueAt: T0, streak: 4 };
expectSame(
  "승급이 미지 필드를 지우지 않는다",
  nextItem(withExtra, true, T0),
  { box: 2, dueAt: T0_PLUS_3D, streak: 4 },
);
expectSame(
  "강등도 미지 필드를 지우지 않는다 (graduatedAt 만 지운다)",
  nextItem({ box: 3, dueAt: T0, graduatedAt: T0, streak: 4 }, false, T0),
  { box: 1, dueAt: T0_PLUS_1D, streak: 4 },
);
expectSame(
  "읽기가 미지 필드를 보존한다",
  repairItem({ box: 2, dueAt: T0, streak: 4 }),
  { box: 2, dueAt: T0, streak: 4 },
);
expectSame(
  "최상위 미지 필드도 보존한다",
  repairReview({ v: 1, items: {}, lastSeenAt: T0 }),
  { v: 1, items: {}, lastSeenAt: T0 },
);

// ── 6. 읽기 검사 — 버려야 하는 항목 (이웃은 생존) ────────────────────────

console.log("\n── 읽기: 버려야 하는 항목 ──");

const BAD: [string, Record<string, unknown>][] = [
  ["box 가 0", item({ box: 0 })],
  ["box 가 4", item({ box: 4 })],
  ["box 가 문자열", item({ box: "1" })],
  ["box 가 없다", { dueAt: T0 }],
  ["dueAt 이 날짜만", item({ dueAt: "2026-08-05" })],
  ["dueAt 이 밀리초 없는 Z", item({ dueAt: "2026-08-05T09:00:00Z" })],
  ["dueAt 이 오프셋 표기", item({ dueAt: "2026-08-05T09:00:00.000+00:00" })],
  ["dueAt 이 있지도 않은 날짜", item({ dueAt: "2024-02-30T00:00:00.000Z" })],
  ["dueAt 이 에폭 숫자", item({ dueAt: 1_754_298_000_000 })],
  ["dueAt 이 없다", { box: 1 }],
  ["graduatedAt 이 시각이 아니다", item({ graduatedAt: "어제" })],
  ["graduatedAt 이 null", item({ graduatedAt: null })],
];
for (const [label, bad] of BAD) {
  expectSame(`${label} → 버린다`, repairItem(bad), undefined);
  const loaded = repairReview(store(bad));
  expectTrue(`${label} → 저장소에서 그 항목만 사라진다`, loaded.items[GK] === undefined);
  expectTrue(`${label} → 이웃은 산다`, loaded.items[NEIGHBOR]?.box === 2, "이웃까지 사라졌다");
}
// 항목이 객체가 아닌 경우 (사람이 저장소를 손으로 고친 흔적)
for (const [label, bad] of [["문자열", "box1"], ["배열", [1, T0]], ["null", null], ["숫자", 1]] as const) {
  expectSame(`항목이 ${label} → 버린다`, repairItem(bad), undefined);
}
// items 자체가 망가진 경우 — 저장소가 통째로 날아가지 않고 "복습할 것 없음"이 된다
for (const [label, raw] of [["items 가 배열", { items: [] }], ["items 가 문자열", { items: "x" }], ["items 가 없다", {}]] as const) {
  expectSame(`${label} → 빈 목록`, repairReview(raw).items, {});
}

// ── 7. 버전 (§4-3) ───────────────────────────────────────────────────────

console.log("\n── 버전 ──");

expectSame("v 가 없으면 이 빌드 버전", repairReview({ items: {} }).v, V);
expectSame("하위 v 는 이 빌드 버전으로 올린다", repairReview({ v: 0, items: {} }).v, V);
// 신버전이 마이그레이션한 데이터를 구버전 탭이 되돌리지 않게 한다 (records-core 와 같은 규칙)
expectSame("상위 v 는 낮추지 않는다", repairReview({ v: 7, items: {} }).v, 7);

// ── 8. 쓰기 — applyResult ────────────────────────────────────────────────

console.log("\n── 쓰기 ──");

const base = repairReview(store(item({ box: 1, dueAt: T0 })));
const promoted = applyResult(base, GK, true, T0);
expectSame("승급이 저장소에 반영된다", promoted.items[GK], { box: 2, dueAt: T0_PLUS_3D });
expectSame("이웃은 그대로다", promoted.items[NEIGHBOR], { box: 2, dueAt: T0_PLUS_3D });
expectTrue("입력을 건드리지 않는다 (비파괴)", base.items[GK]?.box === 1, "원본의 상자가 바뀌었다");
expectTrue("바뀔 게 없으면 받은 것을 그대로 돌려준다", applyResult(base, GK, true, "2026-08-03T09:00:00.000Z") === base);
expectSame("모르는 문항의 오답은 새 항목이 된다", applyResult(EMPTY, GK, false, T0).items[GK], { box: 1, dueAt: T0_PLUS_1D });
expectSame("모르는 문항의 정답은 아무것도 안 만든다", applyResult(EMPTY, GK, true, T0).items, {});

// 채점을 이어 붙여도 저장·재로드가 값을 바꾸지 않는다 (왕복 안정성)
{
  let data = EMPTY;
  const at = ["2026-08-04T09:00:00.000Z", "2026-08-05T09:00:00.000Z", "2026-08-08T09:00:00.000Z"];
  [false, true, true].forEach((ok, i) => {
    data = applyResult(data, GK, ok, at[i]);
  });
  expectSame("오답 → due 정답 → due 정답 = 상자 3", data.items[GK]?.box, 3);
  expectSame("재로드가 같은 값을 낸다", repairReview(data as unknown as Record<string, unknown>), data);
}

// ── 9. 선별과 정렬 (§1-3) ────────────────────────────────────────────────

console.log("\n── 선별 · 정렬 ──");

const NOW = "2026-08-10T09:00:00.000Z";
const listData = repairReview({
  v: 1,
  items: {
    "a:연체 3일 · 상자 2": { box: 2, dueAt: "2026-08-07T09:00:00.000Z" },
    "b:연체 5일 · 상자 3": { box: 3, dueAt: "2026-08-05T09:00:00.000Z" },
    "c:연체 3일 · 상자 1": { box: 1, dueAt: "2026-08-07T09:00:00.000Z" },
    "d:예정": { box: 1, dueAt: "2026-08-12T09:00:00.000Z" },
    "e:예정 더 나중": { box: 2, dueAt: "2026-08-20T09:00:00.000Z" },
    "f:졸업": { box: 3, dueAt: "2026-08-01T09:00:00.000Z", graduatedAt: "2026-08-01T09:00:00.000Z" },
  },
});
// 연체 오래된 순 → 같으면 상자 낮은 순 (약점 우선)
expectSame(
  "due 는 연체 오래된 순 → 상자 낮은 순",
  dueList(listData, NOW).map((e) => e.gk),
  ["b:연체 5일 · 상자 3", "c:연체 3일 · 상자 1", "a:연체 3일 · 상자 2"],
);
expectSame("예정은 가까운 기한 순", upcomingList(listData, NOW).map((e) => e.gk), ["d:예정", "e:예정 더 나중"]);
// 졸업 문항은 양쪽 어디에도 안 나온다 — 그게 "복습 큐에서 빠진다"의 구현이다
expectTrue(
  "졸업 문항은 due 에도 예정에도 없다",
  ![...dueList(listData, NOW), ...upcomingList(listData, NOW)].some((e) => e.gk === "f:졸업"),
);
expectSame("복습 N 배지 = due 개수", dueCount(listData, NOW), 3);
// 기한과 같은 순간이면 due 다 (전이 규칙과 경계가 같아야 한다 — 어긋나면 "떴는데 승급 안 되는" 문항이 생긴다)
expectSame("기한과 같은 순간은 due", dueCount(repairReview({ items: { [GK]: { box: 1, dueAt: NOW } } }), NOW), 1);
expectSame("기한 1밀리초 뒤는 아직 예정", dueCount(repairReview({ items: { [GK]: { box: 1, dueAt: "2026-08-10T09:00:00.001Z" } } }), NOW), 0);
expectSame("빈 저장소의 배지는 0", dueCount(EMPTY, NOW), 0);

// ── 10. 콘텐츠에 없는 문항 걸러내기 (PR #221 리뷰 지적) ──────────────────

console.log("\n── 사라진 문항 ──");

// 챕터 개편으로 문항이 없어지거나 slug 가 바뀌면 저장소에 풀 수 없는 키가 남는다. 배지가 그걸
// 세면 "복습 1"인데 화면은 비어 있는 상태가 영구히 남는다 — 세는 쪽과 그리는 쪽이 같아야 한다
{
  const data = repairReview({
    items: { "1-1:살아있음": { box: 1, dueAt: T0 }, "1-1:사라짐": { box: 1, dueAt: T0 } },
  });
  const known = new Set(["1-1:살아있음"]);
  expectSame("known 밖의 문항은 due 목록에서 빠진다", dueList(data, NOW, known).map((e) => e.gk), ["1-1:살아있음"]);
  expectSame("배지도 같은 수를 센다", dueCount(data, NOW, known), 1);
  expectSame("known 을 안 주면 전부 센다 (기존 호출부 호환)", dueCount(data, NOW), 2);
  const future = repairReview({
    items: { "1-1:살아있음": { box: 1, dueAt: "2026-09-01T00:00:00.000Z" }, "1-1:사라짐": { box: 1, dueAt: "2026-09-01T00:00:00.000Z" } },
  });
  expectSame("예정 목록도 같은 필터를 쓴다", upcomingList(future, NOW, known).map((e) => e.gk), ["1-1:살아있음"]);
  // 저장값은 지우지 않는다 — 챕터가 잠시 빠졌다 돌아오는 경우에 이력까지 날리면 안 된다
  expectTrue("걸러도 저장값은 남아 있다", data.items["1-1:사라짐"] !== undefined);
}

// ── 11. 이 키가 생기기 전의 오답 메우기 (PR #221 리뷰 지적) ──────────────

console.log("\n── 과거 오답 이행 ──");

const HISTORY = {
  "1-1:틀린것": { lastResult: "fail" as const, lastAt: T0 },
  "1-1:맞힌것": { lastResult: "pass" as const, lastAt: T0 },
  "1-1:이미상자에있음": { lastResult: "fail" as const, lastAt: T0 },
  "1-1:졸업함": { lastResult: "fail" as const, lastAt: T0 },
  "1-1:시각이깨짐": { lastResult: "fail" as const, lastAt: "2026-08-04" },
};
{
  const existing = repairReview({
    items: {
      "1-1:이미상자에있음": { box: 3, dueAt: T0_PLUS_7D },
      "1-1:졸업함": { box: 3, dueAt: T0_PLUS_7D, graduatedAt: T0 },
    },
  });
  const seeded = seedFromHistory(existing, HISTORY);
  // 그때 이 규칙이 있었다면 만들어졌을 값 — nextItem(undefined, false, lastAt) 과 같다
  expectSame("마지막이 오답이면 상자 1 · 기한 +1일로 들어온다", seeded.items["1-1:틀린것"], { box: 1, dueAt: T0_PLUS_1D });
  // 마지막 시도가 정답인 문항은 스스로 교정된 것이라 되살릴 오답이 아니다 (§2-2 와 같은 취지)
  expectTrue("마지막이 정답이면 들이지 않는다", seeded.items["1-1:맞힌것"] === undefined);
  expectSame("이미 있는 항목은 건드리지 않는다", seeded.items["1-1:이미상자에있음"], { box: 3, dueAt: T0_PLUS_7D });
  expectSame("졸업한 것을 되살리지 않는다", seeded.items["1-1:졸업함"], { box: 3, dueAt: T0_PLUS_7D, graduatedAt: T0 });
  // 시각이 시각이 아니면 기한을 지어내는 수밖에 없다 — 지어내지 않는다
  expectTrue("시각이 깨진 기록은 들이지 않는다", seeded.items["1-1:시각이깨짐"] === undefined);
  expectTrue("입력을 건드리지 않는다 (비파괴)", existing.items["1-1:틀린것"] === undefined);
  // 두 번 돌려도 같다 — 저장하지 않고 읽을 때마다 계산하므로 이 성질이 필요하다
  expectSame("멱등하다", seedFromHistory(seeded, HISTORY), seeded);
  expectTrue("메울 게 없으면 받은 것을 그대로 돌려준다", seedFromHistory(seeded, {}) === seeded);
  expectSame("빈 저장소에도 메운다", seedFromHistory(EMPTY, HISTORY).items["1-1:틀린것"], { box: 1, dueAt: T0_PLUS_1D });
}

// ── 결과 ─────────────────────────────────────────────────────────────────

console.log("");
if (failures === 0) {
  console.log("✓ 오답 노트 픽스처 전부 통과");
} else {
  console.error(`✗ 오답 노트 픽스처 ${failures}건 실패`);
  process.exit(1);
}
