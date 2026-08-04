/**
 * 채점 기록 경로 픽스처 (#231) — `attempt.ts` 의 두 함수가 **어느 키에 쓰는지**를 지킨다.
 *
 * 실행: `npm run progress:test`. 하나라도 어긋나면 종료 코드 1.
 *
 * **왜 순수 층(`records-core.test.ts`)이 아니라 여기인가**: 이 파일이 지키는 사실은 값 계산이
 * 아니라 **호출 관계**다 — 셀프 퀴즈 채점이 오답 노트(`dva.review.v1`)를 건드리지 않는다는 것.
 * 그건 순수 함수 하나를 들여다봐서는 보이지 않고, 저장 계층까지 붙여 실제로 무엇이 쓰였는지
 * 봐야 나온다. 그래서 localStorage 를 흉내 낸 뒤 두 함수를 진짜로 부른다.
 *
 * 그 사실이 회귀 테스트를 받을 만한 이유 [사용자 결정 2026-08-05, #231]: 두 함수는 겉보기에
 * 거의 같아서, 나중에 누가 "중복"으로 보고 합치기 쉽다. 합치는 순간 셀프 퀴즈 오답이 상자에
 * 들어가고, 오답 노트 화면은 선택지가 없는 그 문항을 렌더하지 못한다 — 화면에는 아무 에러도
 * 안 나고 due 목록만 조용히 망가진다. 이 파일이 그 합침을 실패로 만든다.
 *
 * **import 보다 먼저** localStorage 를 심는다: `records.ts` 는 `typeof window` 로 갈라지므로
 * 심기 전에 부르면 두 함수 다 아무것도 하지 않고 조용히 통과해 버린다 (그러면 이 픽스처는
 * 무엇도 지키지 않는다).
 */

// 정적 import 가 하나도 없는 파일이라(위 이유로 import 가 전부 동적이다) TS 가 스크립트로 보고
// 최상위 await 를 거부한다. 이 빈 export 하나가 파일을 모듈로 만든다.
export {};

class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  clear(): void {
    this.store.clear();
  }
  has(key: string): boolean {
    return this.store.has(key);
  }
}

const storage = new MemoryStorage();
const win = globalThis as unknown as { window?: unknown; localStorage?: unknown };
win.window = { localStorage: storage, addEventListener() {}, removeEventListener() {} };
win.localStorage = storage;

const { recordQuestionAttempt, recordSelfQuizAttempt } = await import("./attempt.ts");
const { loadReview } = await import("./review.ts");

const PROGRESS_KEY = "dva.progress.v1";
const REVIEW_KEY = "dva.review.v1";

let failures = 0;

function pass(label: string, note = ""): void {
  console.log(`  ✓ ${label}${note ? ` → ${note}` : ""}`);
}

function fail(label: string, detail: string): void {
  failures++;
  console.error(`  ✗ ${label}: ${detail}`);
}

function expectSame(label: string, actual: unknown, expected: unknown): void {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) pass(label);
  else fail(label, `기대 ${e} · 실제 ${a}`);
}

function expectTrue(label: string, ok: boolean, detail = "거짓이다"): void {
  if (ok) pass(label);
  else fail(label, detail);
}

/** 저장된 진도에서 문항 기록 하나를 꺼낸다. 없으면 undefined. */
function questionRecord(gk: string): Record<string, unknown> | undefined {
  const raw = storage.getItem(PROGRESS_KEY);
  if (raw === null) return undefined;
  const parsed = JSON.parse(raw) as { questions?: Record<string, Record<string, unknown>> };
  return parsed.questions?.[gk];
}

// ── 1. 셀프 퀴즈 채점은 진도에만 쓴다 ────────────────────────────────────

console.log("\n── 셀프 퀴즈 채점 (recordSelfQuizAttempt) ──");

storage.clear();
recordSelfQuizAttempt("1-1", { slug: "sq-s3-folder-is-key-prefix" }, true);

const first = questionRecord("1-1:sq-s3-folder-is-key-prefix");
expectTrue("진도에 전역 키로 기록된다", first !== undefined, "해당 키가 저장되지 않았다");
expectSame("첫 채점 = 시도 1 · 정답 1", [first?.attempts, first?.correct], [1, 1]);
expectSame("마지막·첫 결과 둘 다 pass", [first?.lastResult, first?.firstResult], ["pass", "pass"]);

// 이 줄이 이 파일의 존재 이유다 (#231 결정 2).
expectTrue(
  "오답 노트 키는 만들어지지 않는다",
  !storage.has(REVIEW_KEY),
  `${REVIEW_KEY} 가 생겼다: ${storage.getItem(REVIEW_KEY)}`,
);

// 오답이어도 마찬가지 — 상자 강등이 없다는 것이 요점이므로 틀린 쪽을 따로 본다
storage.clear();
recordSelfQuizAttempt("1-1", { slug: "sq-s3-mfa-delete-root-cli-only" }, false);
expectSame("오답도 진도에는 남는다", questionRecord("1-1:sq-s3-mfa-delete-root-cli-only")?.lastResult, "fail");
expectTrue(
  "오답이어도 오답 노트 키는 만들어지지 않는다",
  !storage.has(REVIEW_KEY),
  `${REVIEW_KEY} 가 생겼다: ${storage.getItem(REVIEW_KEY)}`,
);

// ── 2. 다시 풀기 = 새 시도로 누적 ────────────────────────────────────────

console.log("\n── 재응시 누적 ──");

storage.clear();
recordSelfQuizAttempt("1-1", { slug: "sq-s3-bucket-key-kms-throttling" }, false);
recordSelfQuizAttempt("1-1", { slug: "sq-s3-bucket-key-kms-throttling" }, true);

const again = questionRecord("1-1:sq-s3-bucket-key-kms-throttling");
expectSame("시도 2 · 정답 1", [again?.attempts, again?.correct], [2, 1]);
expectSame("마지막은 pass", again?.lastResult, "pass");
// 숙달 판정(§2-1)이 "첫 시도 정답"이라 이 값은 재응시로 덮이면 안 된다
expectSame("첫 결과는 fail 그대로", again?.firstResult, "fail");

// ── 3. 우회로 — 오답 노트의 과거 메움이 셀프 퀴즈를 끌어들이지 않는다 ────

console.log("\n── 과거 메움 우회로 (seedFromHistory) ──");

/*
 * 프리뷰에서 실제로 터졌던 경로다 (#231 검증 중 발견): `recordSelfQuizAttempt` 가 오답 노트를
 * 안 써도, 셀프 퀴즈 오답이 진도에 쌓인 뒤 **챕터 퀴즈를 한 번 채점하면** `seedFromHistory` 가
 * 진도 맵 전체를 훑어 그 오답들을 상자에 통째로 들여놓았다. 위 1번 단언들은 이걸 못 잡는다 —
 * 거기서는 오답 노트를 읽는 쪽을 한 번도 부르지 않기 때문이다.
 */
storage.clear();
recordSelfQuizAttempt("1-1", { slug: "sq-s3-cors-on-target-bucket" }, false);
expectSame("메움을 거쳐도 셀프 퀴즈는 상자에 없다", Object.keys(loadReview().items), []);

// 챕터 퀴즈 채점이 오답 노트를 처음 만드는 순간이 실제 사고 지점이었다
recordQuestionAttempt("1-1", { id: "q1", slug: "s3-lifecycle-transition" }, false);
expectSame(
  "챕터 퀴즈 채점 뒤에도 상자에는 그 문항만",
  Object.keys(JSON.parse(storage.getItem(REVIEW_KEY) ?? "{}").items ?? {}),
  ["1-1:s3-lifecycle-transition"],
);

// ── 4. 대조군 — 객관식 채점은 오답 노트까지 쓴다 ─────────────────────────

console.log("\n── 대조군: 객관식 채점 (recordQuestionAttempt) ──");

// 위 단언들이 "오답 노트가 아예 안 굴러가서" 통과하는 것이 아님을 여기서 확인한다.
storage.clear();
recordQuestionAttempt("1-1", { id: "q1", slug: "s3-versioning-suspend" }, false);
expectTrue("객관식 오답은 오답 노트 키를 만든다", storage.has(REVIEW_KEY), "오답 노트가 비어 있다");
expectSame(
  "진도에도 같은 전역 키로 기록된다",
  questionRecord("1-1:s3-versioning-suspend")?.lastResult,
  "fail",
);

// ── 결과 ─────────────────────────────────────────────────────────────────

console.log("");
if (failures === 0) {
  console.log("✓ 채점 기록 경로 픽스처 전부 통과");
} else {
  console.error(`✗ 채점 기록 경로 픽스처 ${failures}건 실패`);
  process.exit(1);
}
