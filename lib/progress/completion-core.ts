/**
 * 챕터 완료 판정의 **순수 층** (#224) — "이 챕터를 끝냈는가"를 내는 계산만 있다.
 * 설계 정본: docs/design/LEARNING_LOOP_DRAFT.md §2-3(조건식·D7 80%)·§2-4(D5 배지 유지)·D4.
 *
 * `records-core.ts`·`review-core.ts` 와 같은 이유로 순수하다 (#214): 여기 결함은 화면에
 * 안 보인다. 통과선이 한 문항 어긋나거나 "전 문항 시도" 조건이 빠져도 그 순간의 화면은
 * 멀쩡하고, **완료가 아닌 챕터에 완료 배지가 붙은 채로** 진행률·커버리지(§3)까지 그 위에
 * 쌓인다. 그래서 `window` 를 모르는 함수만 여기 모아 `completion-core.test.ts`
 * (`npm run progress:test`)가 CI 에서 돌린다.
 *
 * **이 파일은 두 저장소를 조인한다 — 조인은 읽는 쪽이 한다** (#219 `seedFromHistory` 의 선례).
 * 열람은 `aws-reps.read.v1`(read.ts), 채점 사실은 `dva.progress.v1`(records-core.ts),
 * finalQ 목록은 콘텐츠(lib/question-bank.ts)에서 온다. 셋 다 **인자로 받는다** — 어느 것도
 * 이 파일이 직접 읽지 않으므로 node 가 실행할 수 있다.
 *
 * **저장하는 것은 `completedAt` 하나뿐이다**(§4-1 "파생 가능한 값은 저장하지 않는다"):
 * - 열람은 읽음 진도에서 파생한다 — `chapters.visitedAt` 을 새로 쓰지 않는다 [사용자 결정 2026-08-04].
 * - "열람 완료"(D4)도 파생이다 — 열람 ∧ finalQ 가 빈 챕터라는 콘텐츠 모양의 함수다.
 * - 반면 **finalQ 조건을 처음 충족한 순간**은 파생되지 않는다. 그 뒤 오답이 하나 생기면
 *   조건은 깨지지만 배지는 유지돼야 하므로(D5), 그 사실을 기억할 곳이 필요하다.
 */
import type { QuestionRecord } from "./records-core.ts";

/**
 * 챕터 하나의 판정값. "열람 완료"는 정식 "완료"와 **구분되는 등급**이다 (D4) — 퀴즈가 없는
 * 챕터를 완료 불가로 두면 #29 로 레거시가 들어오는 내내 진행률이 눌리고, 반대로 정식 완료와
 * 같게 그리면 퀴즈를 통과한 챕터와 구분이 사라진다.
 */
export type ChapterStatus = "미완료" | "열람 완료" | "완료";

/**
 * finalQuiz 통과선 (D7, §2-3) — 백분율 **정수**로 둔다. `ratio >= 0.8` 로 쓰면 부동소수
 * 나눗셈이 경계에서 흔들릴 수 있어(4/5 는 안전하지만 분모가 커지면 보장이 없다), 아래
 * `finalQuizOutcome` 은 나누지 않고 `passed * 100 >= total * PASS_PERCENT` 로 비교한다.
 */
export const PASS_PERCENT = 80;

/** 그 챕터 finalQ 의 현재 집계 — 판정의 재료이자 화면의 보조 표기("퀴즈 9/11")가 쓰는 값. */
export interface FinalQuizOutcome {
  total: number;       // finalQ 문항 수 (= 완료 판정의 분모)
  attempted: number;   // 그중 한 번이라도 채점된 문항 수
  passed: number;      // 그중 **마지막 시도가 정답**인 문항 수
  cleared: boolean;    // 전 문항 시도됨 ∧ passed 비율 ≥ PASS_PERCENT
}

/**
 * finalQ 집계 (§2-3). 기준이 **마지막 시도**(`lastResult`)인 것이 요점이다 — 숙달(Leitner
 * 졸업)로 걸면 오답 1개가 배지를 최소 11일(1+3+7) 지연시켜 진도 동기를 죽인다. 틀렸던 문항의
 * 장기 정착은 배지와 무관하게 복습 루프가 따로 책임진다(§2-4).
 *
 * **분모는 푼 문항이 아니라 finalQ 전체다** — 목차의 점수 배지(`ScoreBadge`)와 다른 점이고,
 * 달라야 한다: 저쪽은 "푼 것 중 몇 개 맞았나"를 보여주는 성적표라 안 푼 문항을 오답처럼
 * 보이게 하면 안 되고, 이쪽은 "챕터를 끝냈나"라 안 푼 문항은 끝나지 않은 것이다.
 * 그래서 `attempted === total` 을 따로 요구한다 — 11문항 중 1개만 풀어 맞힌 상태가 100% 로
 * 통과하지 않게 한다.
 */
export function finalQuizOutcome(
  finalKeys: readonly string[],
  questions: Record<string, QuestionRecord>,
): FinalQuizOutcome {
  let attempted = 0;
  let passed = 0;
  for (const gk of finalKeys) {
    const record = questions[gk];
    if (!record) continue;
    attempted += 1;
    if (record.lastResult === "pass") passed += 1;
  }
  const total = finalKeys.length;
  return {
    total,
    attempted,
    passed,
    cleared: total > 0 && attempted === total && passed * 100 >= total * PASS_PERCENT,
  };
}

/** 판정의 입력 — 읽은 섹션·그 챕터의 finalQ 키·문항 기록, 그리고 저장된 완료 스냅샷. */
export interface ChapterCompletionInput {
  /** `aws-reps.read.v1` 의 그 챕터 값. **하나라도 있으면 열람**이다 (§2-3: 열람 = 방문). */
  readSections: readonly number[];
  /** 그 챕터 quiz 중 `scope === "final"` 문항의 전역 키 (§4-2 — 콘텐츠에서 런타임 조인). */
  finalKeys: readonly string[];
  /** `dva.progress.v1` 의 문항 기록 전체. 이 챕터 것만 걸러 오지 않아도 된다(키로 짚는다). */
  questions: Record<string, QuestionRecord>;
  /** 저장된 완료 스냅샷 (`chapters[id].completedAt`). 있으면 배지는 회수되지 않는다 (D5). */
  completedAt?: string;
}

/**
 * **지금** 정식 완료 조건을 충족하는가 — 저장된 스냅샷과 무관한 순수 조건식이다 (§2-3).
 * 쓰기 경로가 이 값을 보고 `completedAt` 을 남긴다(= "처음 충족한 시각").
 *
 * 열람을 함께 요구하는 이유: 오답 노트(`/review`)에서만 그 챕터 문항을 전부 맞히는 경로가
 * 실재한다 — 챕터를 한 번도 열지 않고 완료가 되면 배지가 "본편을 마쳤다"는 뜻을 잃는다.
 */
export function earnsCompletion(input: ChapterCompletionInput): boolean {
  return (
    input.readSections.length > 0 && finalQuizOutcome(input.finalKeys, input.questions).cleared
  );
}

/**
 * 화면이 그리는 판정값 — 홈 챕터 목록과 챕터 목차가 **같은 이 함수**를 쓴다 (두 화면이 어긋난
 * #219 의 전례를 되풀이하지 않기 위해).
 *
 * 순서에 의미가 있다:
 * 1. **저장된 스냅샷이 먼저다** — 한 번 딴 배지는 회수하지 않는다 (D5). 완료 뒤에 그 챕터
 *    문항을 다시 틀리면 조건식은 깨지지만, 그때 배지를 강등하면 진행률이 오르내려 완주
 *    동기를 해친다. 망각은 배지가 아니라 "복습 n" 병기와 복습 루프가 맡는다 (§2-4).
 * 2. 열람이 없으면 무엇도 아니다 — 완료는 "본편을 마쳤다"는 스냅샷이다.
 * 3. finalQ 가 없는 챕터는 열람만으로 **"열람 완료"** (D4).
 * 4. 나머지는 조건식 그대로.
 */
export function chapterStatus(input: ChapterCompletionInput): ChapterStatus {
  if (input.completedAt !== undefined) return "완료";
  if (input.readSections.length === 0) return "미완료";
  if (input.finalKeys.length === 0) return "열람 완료";
  return earnsCompletion(input) ? "완료" : "미완료";
}
