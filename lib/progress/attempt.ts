"use client";

import { globalQuestionKey, stableQuestionId, type QuestionIdentity } from "./keys";
import { loadProgress, saveProgress } from "./records";
import { applyAttempt } from "./records-core";
import { recordReviewResult } from "./review";

/**
 * 채점이 통과하는 **앱 전체의 유일한 지점** (#219) — `<QuizItem>` 의 `grade()`, 곧 챕터 퀴즈와
 * 오답 노트 양쪽이 여기로 모인다.
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
  // 문항 객체를 받아 여기서 안정 식별자로 푼다 — 호출부가 실수로 원시 q.id 를 넘길 자리를
  // 아예 없앤다 (positional id 로 저장하면 원본 재정렬 때 진도가 조용히 엉뚱한 문항에 붙는다)
  const gk = globalQuestionKey(chapterId, stableQuestionId(question));
  const at = new Date().toISOString();
  // **이번 채점 직전의** 진도를 한 번만 읽어 둘 다에 쓴다. 오답 노트는 이 키가 생기기 전의
  // 오답을 이 스냅샷에서 메우므로(`seedFromHistory`), 저장된 진도를 다시 읽게 두면 이번 결과가
  // 이미 반영된 값을 보고 메움을 건너뛴다 — 그러면 승급이 사라진다 (review.ts 주석 참조).
  const before = loadProgress();
  // 얹고 → 저장한다. 말이 안 되는 이웃 기록은 read-repair 가 이미 버렸으므로 이 저장이 그
  // 삭제까지 반영한다 (repairQuestion 참조).
  saveProgress(applyAttempt(before, gk, passed, at));
  recordReviewResult(gk, passed, at, before.questions);
}
