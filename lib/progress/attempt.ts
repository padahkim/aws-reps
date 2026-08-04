"use client";

import { globalQuestionKey, stableQuestionId, type QuestionIdentity } from "./keys.ts";
import { loadProgress, saveProgress, type Progress } from "./records.ts";
import { applyAttempt } from "./records-core.ts";
import { recordReviewResult } from "./review.ts";

/**
 * 진도 한 키에만 쓰는 공통 부분. **이번 채점 직전의** 진도를 돌려주는 것이 요점이다 —
 * 오답 노트까지 쓰는 쪽이 그 스냅샷을 필요로 한다 (아래 `recordQuestionAttempt` 주석).
 */
function writeProgress(
  chapterId: string,
  stableId: string,
  passed: boolean,
  at: string,
): { gk: string; before: Progress } {
  const gk = globalQuestionKey(chapterId, stableId);
  const before = loadProgress();
  // 얹고 → 저장한다. 말이 안 되는 이웃 기록은 read-repair 가 이미 버렸으므로 이 저장이 그
  // 삭제까지 반영한다 (repairQuestion 참조).
  saveProgress(applyAttempt(before, gk, passed, at));
  return { gk, before };
}

/**
 * 객관식 채점이 통과하는 **앱 전체의 유일한 지점** (#219) — `<QuizItem>` 의 `grade()`, 곧 챕터
 * 퀴즈와 오답 노트 양쪽이 여기로 모인다. 셀프 퀴즈는 아래 `recordSelfQuizAttempt` 로 갈라진다.
 *
 * **왜 저장소 파일이 아니라 별도 파일인가**: 채점 하나가 키 **둘**을 갱신하는데(진도 =
 * 시도·정오·시각, 오답 노트 = 상자·기한), 어느 한쪽 저장소 파일에 그 조합을 두면 두 파일이
 * 서로를 import 하는 순환이 된다 — 오답 노트는 이 키가 생기기 전의 오답을 메우느라
 * (`seedFromHistory`) 진도를 읽어야 하기 때문이다. 그래서 각 키의 입출력은 자기 파일이 갖고,
 * **조합만** 그 위에 있는 이 파일이 한다.
 *
 * **시각을 여기서 한 번만 잡는 것**이 이 함수의 핵심이다. 두 저장소가 서로 다른 순간에서
 * 계산되면 "방금 푼 문항인데 기한이 어제"처럼 앞뒤 안 맞는 상태가 만들어진다.
 *
 * 부수 효과가 곧 설계 요구다: 채점이 어느 화면에서 일어나든 이 함수만 부르면 상자 규칙이
 * 적용되므로, §1-2 의 "어디서 틀리든 상자 1 로 강등"이 문장이 아니라 구조로 성립한다.
 */
export function recordQuestionAttempt(
  chapterId: string,
  question: QuestionIdentity,
  passed: boolean,
): void {
  if (typeof window === "undefined") return;
  const at = new Date().toISOString();
  // 문항 객체를 받아 여기서 안정 식별자로 푼다 — 호출부가 실수로 원시 q.id 를 넘길 자리를
  // 아예 없앤다 (positional id 로 저장하면 원본 재정렬 때 진도가 조용히 엉뚱한 문항에 붙는다)
  //
  // **이번 채점 직전의** 진도를 한 번만 읽어 둘 다에 쓴다. 오답 노트는 이 키가 생기기 전의
  // 오답을 그 스냅샷에서 메우므로(`seedFromHistory`), 저장된 진도를 다시 읽게 두면 이번 결과가
  // 이미 반영된 값을 보고 메움을 건너뛴다 — 그러면 승급이 사라진다 (review.ts 주석 참조).
  const { gk, before } = writeProgress(chapterId, stableQuestionId(question), passed, at);
  recordReviewResult(gk, passed, at, before.questions);
}

/**
 * 섹션 셀프 퀴즈(`content/chapters/interactive.tsx` 의 `SelfQuiz`)의 채점 기록 (#231).
 * 진도 `dva.progress.v1` **한 키에만** 쓴다 — 이름이 위와 갈라져 있는 이유가 그 한 줄이다.
 *
 * **왜 오답 노트에 넣지 않나** [사용자 결정 2026-08-05, #231]: 오답 노트 화면
 * (`app/review/review-board.tsx`)은 `QuizItem` 재출제, 곧 **선택지가 있는 문항**을 전제로 만들어져
 * 있다. 셀프 퀴즈는 선택지가 없는 q/a 자기채점이라, 상자에 들어가면 기한은 돌아오는데 화면이
 * 렌더할 수 없는 문항이 쌓인다. 서술형 재출제 UI 가 생기기 전까지는 들어가지 않는 것이 맞다.
 *
 * 그래서 여기서 부르지 않는 `recordReviewResult` 가 이 함수의 **정의**다 — 두 함수를 "중복"으로
 * 보고 합치면 그 결정이 조용히 뒤집힌다. 회귀 테스트가 이 사실을 지킨다 (`attempt.test.ts`).
 *
 * 판정형(`yn`)은 예/아니오 확답의 정오라 객관 신호이고, 서술형은 학습자의 자기채점 신고값이다
 * (#86 코멘트 2026-07-27). 저장 시점에는 둘을 구분하지 않는다 — 어느 쪽이든 "이 문항을 맞다고
 * 판정했나"라는 같은 사실이고, 신뢰도 보정이 필요해지면 그건 읽는 쪽이 콘텐츠(`yn` 유무)와
 * 조인해서 낼 수 있다 (§4-1: 파생 가능한 값은 저장하지 않는다).
 */
export function recordSelfQuizAttempt(
  chapterId: string,
  // 문항 객체를 받아 slug 를 여기서 꺼낸다 — 위 함수와 같은 이유로, 호출부가 질문 텍스트 같은
  // 다른 문자열을 넘길 자리를 없앤다. 셀프 퀴즈에는 id/slug 이중성이 없어 slug 가 곧 식별자다.
  question: { slug: string },
  passed: boolean,
): void {
  if (typeof window === "undefined") return;
  writeProgress(chapterId, question.slug, passed, new Date().toISOString());
}
