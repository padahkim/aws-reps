/**
 * 앱 ↔ 콘텐츠 유일 통로. 앱 코드는 content/ 를 직접 import 하지 않고 이 파일만 본다.
 * 타입 정본은 content/schema.ts — 여기서는 re-export만 하고 평행 타입을 만들지 않는다.
 */
import { registry, type ChapterEntry } from "@/content/registry";
import type { SessionConcept } from "@/content/schema";

export type {
  ChapterMeta,
  Question,
  ChapterData,
  Domain,
  SectionMeta,
  SessionData,
  SessionConcept,
  SessionDiagram,
  SessionMixedItem,
} from "@/content/schema";
export type { ChapterEntry };

export function getAllChapters(): ChapterEntry[] {
  return registry;
}

export function getChapter(id: string): ChapterEntry | undefined {
  return registry.find((entry) => entry.data.chapterMeta.id === id);
}

/** 섹션 페이지 총수 = 본문 섹션 + (quiz 있으면) 챕터 퀴즈 1 (규약 v2 — 퀴즈는 마지막 섹션). */
export function sectionCount(entry: ChapterEntry): number {
  return entry.data.sections.length + (entry.data.quiz.length > 0 ? 1 : 0);
}

/**
 * 그 섹션에 붙을 개념 인출 카드 (규약: concepts[].section === sections[].num).
 * session 이 없는 챕터·카드가 없는 섹션은 빈 배열 — 호출부가 영역 자체를 렌더하지 않는다.
 */
export function conceptsForSection(entry: ChapterEntry, sectionNum: string): SessionConcept[] {
  return entry.data.session?.concepts.filter((c) => c.section === sectionNum) ?? [];
}

/** phase 라벨별 그룹핑 — 레지스트리(=커리큘럼) 순서 유지. */
export function groupByPhase(entries: ChapterEntry[]): [string, ChapterEntry[]][] {
  const groups = new Map<string, ChapterEntry[]>();
  for (const entry of entries) {
    const phase = entry.data.chapterMeta.phase;
    const group = groups.get(phase);
    if (group) group.push(entry);
    else groups.set(phase, [entry]);
  }
  return [...groups.entries()];
}

/** 문항 id는 챕터-로컬("q1") — 진도·오답노트용 전역 키는 앱이 합성한다 (schema.ts Question.id 참조). */
export function globalQuestionKey(chapterId: string, questionId: string): string {
  return `${chapterId}:${questionId}`;
}
