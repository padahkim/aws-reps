/**
 * 앱 ↔ 콘텐츠 유일 통로. 앱 코드는 content/ 를 직접 import 하지 않고 이 파일만 본다.
 * 타입 정본은 content/schema.ts — 여기서는 re-export만 하고 평행 타입을 만들지 않는다.
 */
import { registry, type ChapterEntry } from "@/content/registry";
import { glossary } from "@/content/glossary";
import type { GlossaryTerm, SelfQuizEntry, SessionConcept, SessionMixedItem } from "@/content/schema";

export type {
  ChapterMeta,
  ChapterPart,
  Question,
  ChapterData,
  Domain,
  GlossaryTerm,
  SectionMeta,
  SelfQuizEntry,
  SessionData,
  SessionConcept,
  SessionDiagram,
  SessionDiagramNode,
  SessionMixedItem,
} from "@/content/schema";
export type { ChapterEntry };

// 예상 소요 (규약 v3.1, #161) — 서버 전용 모듈이다 (node:fs). 이 파일을 값으로 import 하는
// 곳은 서버 컴포넌트뿐이라 통로를 여기로 통일한다 (앱은 content/ 를 직접 안 본다는 원칙).
export { estimateChapter } from "./reading-time";
export type { ChapterEstimate } from "./reading-time";

// 셀프 퀴즈 렌더 컴포넌트 (#98) — 앱은 content/ 를 직접 import 하지 않는다는 이 파일의
// 원칙을 지키기 위한 통로 re-export ("use client" 경계는 원 모듈에 있어 그대로 보존된다).
export { SelfQuiz } from "@/content/chapters/interactive";

// 빈출 표기 근거 문구 (#185) — 같은 원칙의 통로 re-export. 문구 정본은 content/chapters/ui.tsx
// (본문 <Sec> 배지 툴팁과 한 곳을 공유해야 하므로 그쪽이 소유한다).
export { FREQ_EVIDENCE_NOTE } from "@/content/chapters/ui";

// 전역 용어집 (#57 결정 1) — 데이터 정본은 content/glossary.ts, 앱은 이 통로로만 본다.
// 배열 순서는 계약이 아니다 — /glossary 페이지(#192)가 표시 순서를 정한다.
export { glossary };

/** 용어집 단건 조회 — 팝오버(<Term>, #193)·앵커 검증용. 없는 id 는 undefined. */
export function glossaryTerm(id: string): GlossaryTerm | undefined {
  return glossary.find((t) => t.id === id);
}

export function getAllChapters(): ChapterEntry[] {
  return registry;
}

export function getChapter(id: string): ChapterEntry | undefined {
  return registry.find((entry) => entry.data.chapterMeta.id === id);
}

// 섹션 페이지 수 규칙 (#59) 과 그로부터 나오는 라우트 목록 — 이 파일이 소유하지 않는다.
// 서비스 워커의 프리캐시 목록을 빌드 전에 만들어야 해서 Node 가 직접 로드할 수 있는 순수
// 모듈로 내려 뒀다 (#234, lib/chapter-routes.ts 머리말). 앱은 계속 이 통로로만 본다.
export { hasSessionFinale, mixedPool, sectionCount } from "./chapter-routes";
export type { MixedPoolItem } from "./chapter-routes";

/**
 * 그 섹션에 붙을 개념 인출 카드 (규약: concepts[].section === sections[].num).
 * session 이 없는 챕터·카드가 없는 섹션은 빈 배열 — 호출부가 영역 자체를 렌더하지 않는다.
 */
export function conceptsForSection(entry: ChapterEntry, sectionNum: string): SessionConcept[] {
  return entry.data.session?.concepts.filter((c) => c.section === sectionNum) ?? [];
}

/**
 * 그 섹션에 붙을 셀프 퀴즈 문항 (#98 — 규약은 concepts 와 동일: section === sections[].num).
 * selfQuiz 가 없는 챕터·문항이 없는 섹션은 빈 배열 — 호출부가 덱 자체를 렌더하지 않는다.
 */
export function selfQuizForSection(entry: ChapterEntry, sectionNum: string): SelfQuizEntry[] {
  return entry.data.selfQuiz?.filter((e) => e.section === sectionNum) ?? [];
}

/**
 * 파트를 섹션 페이지 번호로 푼 형태 (규약 v3.1) — 목차 그룹핑과 섹션 페이지 컨텍스트가
 * 같은 계산을 두 번 하지 않게 여기서 한 번만 푼다. fromSec·toSec 은 URL 과 같은 1-based.
 */
export interface ResolvedPart {
  index: number;    // 1-based 파트 번호 ("파트 2 — …")
  title: string;
  fromSec: number;
  toSec: number;
}

/**
 * 챕터의 파트 목록. parts 가 없으면 빈 배열 — 호출부는 그 경우 그룹 없이 평평하게 렌더한다.
 * 실존하지 않는 섹션 num 을 가리키는 파트가 하나라도 있으면 전체를 포기한다 (부분적으로만
 * 그룹핑된 목차는 섹션이 사라진 것처럼 보인다). 그 상태는 검증기가 이미 빌드에서 막는다.
 */
export function chapterParts(entry: ChapterEntry): ResolvedPart[] {
  const { chapterMeta, sections } = entry.data;
  if (!chapterMeta.parts?.length) return [];

  const secOf = new Map(sections.map((s, i) => [s.num, i + 1]));
  const resolved: ResolvedPart[] = [];
  for (const [i, part] of chapterMeta.parts.entries()) {
    const fromSec = secOf.get(part.from);
    const toSec = secOf.get(part.to);
    if (fromSec === undefined || toSec === undefined || toSec < fromSec) return [];
    resolved.push({ index: i + 1, title: part.title, fromSec, toSec });
  }
  return resolved;
}

/** 그 섹션 페이지가 속한 파트. 파트가 없거나 퀴즈 섹션이면 undefined. */
export function partForSection(entry: ChapterEntry, sec: number): ResolvedPart | undefined {
  return chapterParts(entry).find((p) => sec >= p.fromSec && sec <= p.toSec);
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

// 전역 문항 키(`globalQuestionKey`)는 여기 없다 — 정본이 lib/progress/keys.ts 다 (#66).
// 이 파일은 서버 전용(node:fs·챕터 레지스트리)이라 채점을 하는 클라이언트 컴포넌트가 값으로
// import 할 수 없고, 서버 쪽 소비자는 현재 0건이라 통로 re-export 를 두지 않는다.
