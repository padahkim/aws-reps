/**
 * 전역 문항 키 — 진도·오답노트가 문항을 가리키는 유일한 형식 `"{chapterId}:{안정 문항 id}"`.
 *
 * 설계 정본: docs/design/LEARNING_LOOP_DRAFT.md §4-2 — 이 키가 저장 데이터의 **유일한
 * 하드 의존**이다(규약이 바뀌어도 여기만 지키면 진도는 살아남는다). 그래서 합성 규칙을
 * 한 곳에만 둔다. 검증기(scripts/validate-content.ts)도 이 파일을 import 해서 같은 규칙으로
 * 유일성을 강제한다 — 규칙이 두 벌이 되면 게이트가 실물과 어긋난다.
 *
 * 왜 lib/content.ts 가 아니라 여기인가 (#66): 그 파일은 서버 전용이다 — 챕터 본문 전체를
 * 끌어오는 content/registry 를 **값으로 import** 하고, node:fs 를 쓰는 lib/reading-time.ts 의
 * `estimateChapter` 를 값으로 re-export 한다. 클라이언트 컴포넌트가 거기서 값을 하나라도
 * 가져오면 번들이 깨지거나 챕터 콘텐츠가 통째로 실려 온다. 그런데 채점 기록은 클라이언트
 * 컴포넌트(chapter-quiz.tsx)가 한다 — 그래서 의존이 0인 이 파일에 정본을 둔다.
 */

/** 키를 만드는 데 필요한 최소 형태. content/schema.ts 의 Question 이 이 형태를 만족한다. */
export interface QuestionIdentity {
  id: string;
  slug?: string;
}

/**
 * 문항의 **안정 식별자**. `slug` 가 있으면 그것을 쓰고, 없을 때만 챕터-로컬 id 로 떨어진다.
 *
 * id 를 쓰지 않는 이유 (PR #202 리뷰 → 사용자 결정): `content/chapters/*／drills.ts` 는
 * 생성물이고 `scripts/import-drills.ts` 가 id 를 `q${i + 1}` 로 **위치에 따라** 발급한다.
 * 원본 JSON 에 문항 하나가 끼어들면 그 뒤 문항의 id 가 전부 한 칸씩 밀리고, 진도는 조용히
 * 엉뚱한 문항에 붙는다 — 화면에는 아무 이상이 없어서 알아챌 방법도 없다. 리포는 이미 같은
 * 이유로 문항 선별에 slug 를 쓰기로 정했다(#69, content/schema.ts 의 Question.slug 주석).
 * 설계 §4-2 는 gk 를 `quiz[].id` 로 적었지만 그 문서는 이 결정(#69) 이전이다.
 *
 * slug 가 optional 이라 손작성 문항은 id 로 폴백한다 — 그 경우 "재정렬되지 않는다"는 보장은
 * 사람이 지킨다(생성물이 아니므로 위치 발급 자체가 없다).
 */
export function stableQuestionId(question: QuestionIdentity): string {
  return question.slug ?? question.id;
}

/**
 * 전역 문항 키. 두 번째 인자는 **이미 안정 식별자로 푼 값**이다 — 원시 `q.id` 를 그대로
 * 넘기지 않도록 `stableQuestionId` 를 거쳐서 부른다 (채점 경로는 recordQuestionAttempt 가
 * 문항 객체를 받아 대신 해 준다).
 */
export function globalQuestionKey(chapterId: string, stableId: string): string {
  return `${chapterId}:${stableId}`;
}
