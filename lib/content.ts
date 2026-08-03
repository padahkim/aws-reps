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

/**
 * 섹션 페이지 총수 = 본문 섹션 + 마무리 페이지 1 (있는 경우).
 * 마무리 페이지 규칙 (#59): session 이 있는 챕터는 마지막 페이지가 세션 마무리 페이지
 * (도식·실전·혼합 — 실전이 quiz 를 그대로 소비한다), session 없는 챕터는 기존 챕터 퀴즈
 * 페이지 (quiz 있을 때만) — 점진 이행이라 두 형태가 공존한다.
 */
export function sectionCount(entry: ChapterEntry): number {
  return (
    entry.data.sections.length +
    (hasSessionFinale(entry) || entry.data.quiz.length > 0 ? 1 : 0)
  );
}

/**
 * 마지막 페이지가 세션 마무리 페이지인가 (#59 — sectionCount 의 규칙과 같은 판별).
 * session 의 존재만이 아니라 **렌더 가능한 스테이션이 하나라도 있는지**를 본다 (PR #184
 * Codex P2) — 검증기는 빈 session(concepts·mixed 다 빈 배열)도 적법으로 받으므로, 존재만
 * 보면 스테이션 0개짜리 빈 마무리 페이지가 생긴다. 그 경우 기존 퀴즈 페이지 규칙으로
 * 넘어간다 (quiz 도 비면 마무리 페이지 자체가 없다).
 */
export function hasSessionFinale(entry: ChapterEntry): boolean {
  const { quiz, session } = entry.data;
  if (session === undefined) return false;
  return session.diagram !== undefined || quiz.length > 0 || mixedPool(entry).length > 0;
}

/** 혼합 누적 풀의 항목 — id 는 챕터-로컬이라 풀에서는 챕터 id 를 합성한 key 를 쓴다. */
export interface MixedPoolItem extends SessionMixedItem {
  key: string;                    // "ch1-2:m1" — 풀 전역 유일 (React key·중복 방지)
}

/**
 * 혼합 스테이션의 누적 풀 (#54 결정 → #59): 자기 mixed + registry 순서상 "앞" 챕터들의
 * session.mixed 합산. 뒤 챕터를 미리 끌어오지 않는 이유 — 아직 안 배운 서비스와의 대조는
 * 인출이 아니라 첫 노출이 된다. 셔플·샘플은 여기서 하지 않는다 (SSG 결정성 — 클라이언트 몫).
 * 풀이 비면 빈 배열 — 호출부가 스테이션 자체를 렌더하지 않는다 (ch0-1).
 */
export function mixedPool(entry: ChapterEntry): MixedPoolItem[] {
  const idx = registry.findIndex((e) => e.data.chapterMeta.id === entry.data.chapterMeta.id);
  if (idx < 0) return [];
  return registry.slice(0, idx + 1).flatMap(
    (e) =>
      e.data.session?.mixed.map((m) => ({
        ...m,
        key: `${e.data.chapterMeta.id}:${m.id}`,
      })) ?? []
  );
}

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
