/**
 * 진도 저장소 규칙 픽스처 (#214) — 저장된 값을 읽어 다른 값으로 바꾸는 과정이 실제로
 * 기대한 값을 내는지 확인한다.
 *
 * 실행: `npm run progress:test`. 하나라도 어긋나면 종료 코드 1.
 * (`scripts/validate-content.test.ts` 와 같은 방식 — 러너 없이 node 가 직접 실행한다.)
 *
 * 왜 필요한가: 이 규칙의 결함은 타입이 맞고 화면도 멀쩡한데 **결과값만 틀린** 모양으로 나온다.
 * PR #202 에서 자동 리뷰가 같은 성격의 결함을 반복해서 냈고, 그때 손으로 쌓은 케이스 세트가
 * 코드로 남아 있지 않았다. 여기가 그 자리다 — 학습 이력은 조용히 누적되므로 회귀를 사람이
 * 알아채기 전에 CI 가 잡아야 한다.
 */
import {
  applyAttempt,
  repair,
  V,
  type Progress,
  type QuestionRecord,
} from "./repair.ts";

let failures = 0;

function check(label: string, ok: boolean, detail = ""): void {
  if (ok) {
    console.log(`  ✓ ${label}`);
  } else {
    failures++;
    console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

const T1 = "2026-08-03T00:00:00.000Z";
const T2 = "2026-08-04T09:30:00.000Z";

/** 앞뒤가 맞는 기록 — 버려질 이유가 없는 기준값. */
function ok(over: Record<string, unknown> = {}): Record<string, unknown> {
  return { attempts: 2, correct: 1, lastResult: "pass", lastAt: T1, firstResult: "fail", ...over };
}

/** `questions` 만 담은 저장소 원본. */
function raw(questions: Record<string, unknown>, over: Record<string, unknown> = {}) {
  return { v: V, chapters: {}, questions, ...over };
}

/**
 * 이 기록이 살아남는지 확인한다. `expect` 가 있으면 살아남은 값의 필드까지 대조한다
 * (버려지지 않은 것만으로는 "값이 그대로인지"를 못 본다).
 */
function kept(label: string, record: Record<string, unknown>, expect: Partial<QuestionRecord> = {}) {
  const out = repair(raw({ "ch:q": record })).questions["ch:q"];
  if (!out) return check(label, false, "버려졌다 (살아야 하는 입력)");
  const wrong = Object.entries(expect).filter(([k, v]) => out[k] !== v);
  check(
    label,
    wrong.length === 0,
    wrong.map(([k, v]) => `${k}: ${JSON.stringify(out[k])} ≠ ${JSON.stringify(v)}`).join(", "),
  );
}

/**
 * 이 기록이 버려지는지 확인한다 — **그 문항 하나만**. 성한 이웃을 같이 넣어, 저장소 전체가
 * 날아가는 회귀(한 글자 깨진 것 때문에 전 챕터 진도가 사라지는 것)를 함께 잠근다.
 */
function dropped(label: string, record: unknown) {
  const out = repair(raw({ "ch:bad": record as Record<string, unknown>, "ch:good": ok() })).questions;
  if (out["ch:bad"]) return check(label, false, "살아남았다 (버려야 하는 입력)");
  check(label, out["ch:good"]?.attempts === 2, "이웃 기록까지 사라졌다");
}

console.log("── 읽기: 살아야 하는 것 ──");

kept("정상 기록 — 값 그대로", ok(), {
  attempts: 2,
  correct: 1,
  lastResult: "pass",
  lastAt: T1,
  firstResult: "fail",
});
kept("알 수 없는 필드 보존", ok({ box: 9 }), { box: 9 });
kept("시도 1회에 firstResult 없음 → lastResult 로 채움", { attempts: 1, correct: 1, lastResult: "pass", lastAt: T1 }, {
  firstResult: "pass",
});
// 다회 시도는 첫 결과를 복원할 방법이 없다 — 채우면 #86 숙달 판정("첫 시도 정답")이 뒤집힌다
kept("다회 시도에 firstResult 없음 → 모르는 채로 둔다", { attempts: 3, correct: 2, lastResult: "pass", lastAt: T1 }, {
  firstResult: undefined,
});
kept("correct 0 · attempts 1", { attempts: 1, correct: 0, lastResult: "fail", lastAt: T1 }, {
  correct: 0,
  firstResult: "fail",
});

{
  const out = repair(raw({}, { v: 7, note: "신버전이 남긴 것" }));
  check("상위 v 를 낮추지 않는다", out.v === 7, `v=${out.v}`);
  check("최상위 미지 필드 보존", out.note === "신버전이 남긴 것");
}
{
  const out = repair({ questions: {}, chapters: {} });
  check("v 가 없으면 이 빌드 버전", out.v === V, `v=${out.v}`);
}
{
  const out = repair({ v: 0, questions: {}, chapters: {} });
  check("하위 v 는 이 빌드 버전으로 올린다", out.v === V, `v=${out.v}`);
}
{
  const out = repair({ chapters: { "ch0-1": { visitedAt: T1, note: "keep" } }, questions: {} });
  check("챕터 기록의 미지 필드 보존", out.chapters["ch0-1"]?.note === "keep");
}
{
  const out = repair({});
  check(
    "저장된 게 없으면 빈 저장소",
    out.v === V && Object.keys(out.questions).length === 0 && Object.keys(out.chapters).length === 0,
  );
}

console.log("");
console.log("── 읽기: 버려야 하는 것 (이웃은 생존) ──");

dropped("맞힘이 응시보다 많다", ok({ attempts: 1, correct: 3, firstResult: "pass" }));
dropped("attempts 0", ok({ attempts: 0, correct: 0 }));
dropped("attempts 음수", ok({ attempts: -1, correct: 0 }));
dropped("attempts 소수", ok({ attempts: 1.5, correct: 1 }));
dropped("attempts 비숫자", ok({ attempts: "2" }));
dropped("attempts 없음", { correct: 1, lastResult: "pass", lastAt: T1 });
dropped("lastAt 이 시각이 아니다", ok({ lastAt: "망가짐" }));
// Date.parse("0") 은 2000년으로 통과한다 — 유한성만 보면 못 잡는 값이다
dropped('lastAt 이 "0"', ok({ lastAt: "0" }));
// 존재하지 않는 날짜 — 규격 밖 문자열은 조용히 3월 1일이 되고 해석이 브라우저마다 다르다
dropped("lastAt 이 있지도 않은 날짜", ok({ lastAt: "2024-02-30T00:00:00.000Z" }));
dropped("lastAt 이 ISO 형식이 아니다", ok({ lastAt: "2026-08-03 00:00:00" }));
dropped("lastAt 없음", { attempts: 1, correct: 1, lastResult: "pass" });
dropped("lastResult 가 규약 밖", ok({ lastResult: "PASS" }));
dropped("lastResult 없음", { attempts: 1, correct: 1, lastAt: T1 });
dropped("firstResult 가 규약 밖", ok({ firstResult: "maybe" }));
dropped("시도 1회가 두 결과를 가진다", { attempts: 1, correct: 0, lastResult: "pass", firstResult: "fail", lastAt: T1 });
dropped("항목이 객체가 아니다 (문자열)", "기록 아님");
dropped("항목이 객체가 아니다 (배열)", [1, 2]);
dropped("항목이 null", null);

console.log("");
console.log("── 쓰기 ──");

{
  const empty: Progress = { v: V, chapters: {}, questions: {} };
  const first = applyAttempt(empty, "ch:q", true, T1);
  const r = first.questions["ch:q"];
  check(
    "처음 채점 — attempts 1, firstResult = 이번 결과",
    r.attempts === 1 && r.correct === 1 && r.lastResult === "pass" && r.firstResult === "pass" && r.lastAt === T1,
    JSON.stringify(r),
  );
  check("입력을 건드리지 않는다", Object.keys(empty.questions).length === 0);

  const again = applyAttempt(first, "ch:q", false, T2);
  const r2 = again.questions["ch:q"];
  check(
    "재응시 — attempts +1, lastResult 갱신, firstResult 불변",
    r2.attempts === 2 && r2.correct === 1 && r2.lastResult === "fail" && r2.firstResult === "pass" && r2.lastAt === T2,
    JSON.stringify(r2),
  );
}
{
  // firstResult 가 생기기 전에 저장된 다회 시도 기록 — repair 가 그 자리를 비워 둔 상태다
  const before = repair(raw({ "ch:q": { attempts: 3, correct: 2, lastResult: "pass", lastAt: T1 } }));
  const after = applyAttempt(before, "ch:q", true, T2);
  const r = after.questions["ch:q"];
  check(
    "firstResult 없는 다회 기록에 재응시 — 여전히 없음",
    r.firstResult === undefined && r.attempts === 4 && r.correct === 3,
    JSON.stringify(r),
  );
}
{
  const loaded = repair(raw({ "ch:bad": { attempts: 1, correct: 3, lastResult: "pass", lastAt: T1 }, "ch:good": ok() }));
  const after = applyAttempt(loaded, "ch:other", true, T2);
  check(
    "버려진 기록이 있는 채로 다른 문항 채점 — 버려진 것만 사라진다",
    after.questions["ch:bad"] === undefined &&
      after.questions["ch:good"]?.attempts === 2 &&
      after.questions["ch:other"]?.attempts === 1,
    JSON.stringify(Object.keys(after.questions)),
  );
}
{
  // 미지 필드는 쓰기에서도 살아야 한다 — 구버전 탭의 채점이 신버전 필드를 지우면 안 된다
  const loaded = repair(raw({ "ch:q": ok({ box: 9 }) }, { v: 7, note: "신버전" }));
  const after = applyAttempt(loaded, "ch:q", true, T2);
  check(
    "쓰기가 미지 필드를 지우지 않는다",
    after.questions["ch:q"].box === 9 && after.v === 7 && after.note === "신버전",
    JSON.stringify(after),
  );
}

console.log("");
if (failures === 0) {
  console.log("✓ 모든 픽스처 통과");
} else {
  console.error(`✗ 픽스처 ${failures}건 실패`);
  process.exit(1);
}
