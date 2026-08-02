/**
 * 전역 문항 키 — 진도·오답노트가 문항을 가리키는 유일한 형식 `"{chapterId}:{questionId}"`.
 * 문항 id 는 챕터-로컬("q1")이라 그대로는 전역에서 충돌한다 (content/schema.ts Question.id).
 *
 * 설계 정본: docs/design/LEARNING_LOOP_DRAFT.md §4-2 — 이 키가 저장 데이터의 **유일한
 * 하드 의존**이다(규약이 바뀌어도 여기만 지키면 진도는 살아남는다). 그래서 합성 규칙을
 * 한 곳에만 둔다.
 *
 * 왜 lib/content.ts 가 아니라 여기인가 (#66): 그 파일은 서버 전용이다 — node:fs 를 쓰는
 * lib/reading-time.ts 와 챕터 본문 전체를 끌어오는 content/registry 를 값으로 re-export 한다.
 * 그런데 채점 기록은 클라이언트 컴포넌트(chapter-quiz.tsx)가 한다. 이 파일은 의존이 없어
 * 양쪽에서 안전하게 import 되고, lib/content.ts 는 "앱↔콘텐츠 유일 통로" 원칙대로
 * 여기를 통로 re-export 한다.
 */
export function globalQuestionKey(chapterId: string, questionId: string): string {
  return `${chapterId}:${questionId}`;
}
