import type { Metadata } from "next";
import { chapterQuestionKeys, questionBank } from "@/lib/question-bank";
import { ReviewBoard } from "./review-board";

export const metadata: Metadata = {
  title: "오답 노트 — AWS DVA-C02 학습",
  description: "틀린 문항을 간격을 두고 다시 푸는 복습 큐",
};

/**
 * 오답 노트 (#219 — 부모 에픽 #86). 어느 문항이 복습 대상인지는 **브라우저에만** 있으므로
 * (localStorage `dva.review.v1`) 이 서버 컴포넌트가 하는 일은 하나다: 전 챕터의 문항을
 * 전역 문항 키로 색인해 넘긴다. 화면은 그 색인에서 자기 저장소에 있는 것만 꺼내 그린다.
 *
 * **문항 전부를 실어 보내는 이유**: 정적 배포(`output: "export"`, spike #30)라 "이 키들의
 * 문항을 다오"라고 물어볼 서버가 없다. 지금 4챕터 52문항이라 이 방식이 가장 단순하고,
 * 챕터가 늘어 부담이 되면 그때 챕터별 청크로 쪼갠다 — 저장 구조는 그대로다.
 */
export default function ReviewPage() {
  // chapterKeys 는 챕터 완료 판정용 finalQ 색인 (#224) — 여기서 바로잡은 오답이 완료 조건을
  // 넘길 수 있어, 그 순간을 이 화면도 잡는다. 키 문자열뿐이라 페이로드는 무시할 만하다.
  return <ReviewBoard bank={questionBank()} chapterKeys={chapterQuestionKeys()} />;
}
