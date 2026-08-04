import { getAllChapters, type Question } from "@/lib/content";
import { globalQuestionKey, stableQuestionId } from "@/lib/progress/keys";

/**
 * 전 챕터의 문항을 **전역 문항 키로 색인한 목록** (#219). 서버 전용이다 (`lib/content.ts` 를
 * 값으로 import 한다) — 서버 컴포넌트가 불러 클라이언트로 넘긴다.
 *
 * 왜 필요한가: 진도·오답 노트는 문항을 전역 키로만 가리키고(설계 §4-2) 그 키가 어느 문항인지는
 * 콘텐츠에만 있다. 정적 배포(spike #30)라 "이 키들의 문항을 다오"라고 물을 서버가 없으므로,
 * 화면이 필요할 때 이 목록을 통째로 들고 간다.
 *
 * **홈도 이 목록을 쓴다** — 키만 쓰지만 같은 함수여야 한다: "복습 N" 배지가 세는 집합과 오답
 * 노트가 그리는 집합이 갈리면, 배지는 1인데 화면은 비어 있는 상태가 생긴다 (PR #221 리뷰 지적).
 */
export interface BankEntry {
  gk: string;
  chapterId: string;
  chapterTitle: string;
  question: Question;
}

export function questionBank(): BankEntry[] {
  return getAllChapters().flatMap((entry) => {
    const meta = entry.data.chapterMeta;
    return entry.data.quiz.map((question) => ({
      gk: globalQuestionKey(meta.id, stableQuestionId(question)),
      chapterId: meta.id,
      chapterTitle: meta.title,
      question,
    }));
  });
}

/** 위 목록의 키만 — 홈 배지처럼 문항 본문이 필요 없는 곳에서 쓴다(페이로드를 싣지 않는다). */
export function questionKeys(): string[] {
  return questionBank().map((entry) => entry.gk);
}
