/**
 * 챕터 미리 보기 색인 (#248) — 상호 참조 <ChLink> 시트가 "거기에 무엇이 있는가"를 보여 줄 때
 * 쓰는 얇은 메타. 제목·부제는 전부 기존 메타에서 끌어오고 새 요약문은 쓰지 않는다.
 *
 * registry 를 그대로 쓰지 않는 이유: <ChLink> 는 본문 안에 있어 **클라이언트 번들에 실린다**.
 * registry 의 ChapterEntry.data 는 퀴즈·인출 세션·셀프 퀴즈를 통째로 물고 있어서(4챕터 기준
 * 원본 170KB, 잔여 24챕터가 붙으면 그 몇 배) 미리 보기 두 줄 때문에 본문 페이지마다 그 전부를
 * 내려받게 된다. 그래서 chapterMeta·sections 에서 필요한 필드만 뽑은 색인을 따로 둔다.
 *
 * 대가는 목록이 registry 와 어긋날 수 있다는 것이다 — 챕터를 등록하고 여기 안 더하면 미리
 * 보기가 조용히 빈다. 그래서 검증기가 둘을 대조한다 (validate-content CHAPTER_INDEX_*).
 *
 * .ts 확장자 명시 = registry.ts 와 같은 이유 (검증기가 Node 네이티브 TS 로 직접 로드한다).
 */
import type { ChapterMeta, SectionMeta } from "./schema.ts";
import { chapterMeta as ch01Meta, sections as ch01Sections } from "./chapters/ch0-1/meta.ts";
import { chapterMeta as ch02Meta, sections as ch02Sections } from "./chapters/ch0-2/meta.ts";
import { chapterMeta as ch11Meta, sections as ch11Sections } from "./chapters/ch1-1/meta.ts";
import { chapterMeta as ch12Meta, sections as ch12Sections } from "./chapters/ch1-2/meta.ts";

/** 상호 참조 시트가 쓰는 챕터 한 건. sections 순서 = 섹션 페이지 URL 번호(1-based) 순서. */
export interface ChapterPreview {
  id: string;
  title: string;
  phase: string;
  /** "무엇이 들어 있는가" 한 줄 — 아래 preview() 참조. */
  summary: string;
  sections: { num: string; title: string; sub: string }[];
}

function preview(meta: ChapterMeta, sections: SectionMeta[]): ChapterPreview {
  // 요약은 새로 쓰지 않는다 (#248 완료 기준): 파트가 있으면 그 묶음 제목이 곧 챕터의 흐름이고,
  // 없으면(파트를 나눌 만큼 길지 않은 챕터) 섹션 제목이 같은 구실을 한다. 이음쇠가 " · " 가
  // 아니라 " → " 인 이유 — 파트 제목 자체가 " · " 를 품기도 한다("역할 · STS · 자격 증명 다루기").
  const flow = meta.parts?.length ? meta.parts.map((p) => p.title) : sections.map((s) => s.title);
  return {
    id: meta.id,
    title: meta.title,
    phase: meta.phase,
    summary: flow.join(" → "),
    sections: sections.map((s) => ({ num: s.num, title: s.title, sub: s.sub })),
  };
}

export const chapterIndex: ChapterPreview[] = [
  preview(ch01Meta, ch01Sections),
  preview(ch02Meta, ch02Sections),
  preview(ch11Meta, ch11Sections),
  preview(ch12Meta, ch12Sections),
];

/** 챕터 단건 조회 — 없는 id 는 undefined (검증기가 커밋 전에 잡는다). */
export function chapterPreview(id: string): ChapterPreview | undefined {
  return chapterIndex.find((c) => c.id === id);
}
