import type { ComponentType, ReactNode } from "react";
import type { ChapterData } from "./schema";

/**
 * 챕터 레지스트리 — 앱이 소비하는 챕터의 유일한 목록.
 * 챕터 변환 세션이 content/chapters/{id}/ 를 만들 때 여기에 항목을 추가한다:
 *
 *   import { chapterMeta as ch01Meta, quiz as ch01Quiz, sections as ch01Sections } from "./chapters/ch0-1/meta";
 *   // ...
 *   export const registry: ChapterEntry[] = [
 *     { data: { chapterMeta: ch01Meta, quiz: ch01Quiz, sections: ch01Sections }, loadBody: () => import("./chapters/ch0-1/body") },
 *   ];
 *
 * 배열 순서 = 커리큘럼 학습 순서 (목록 페이지가 이 순서를 그대로 따른다).
 */
export interface ChapterEntry {
  data: ChapterData;
  // default = 섹션 렌더러 (규약 v2): section 인덱스(0-based) 하나만 렌더한다.
  // afterSection = 섹션 꼬리 슬롯 — 본문과 아웃트로 사이. 인출 개념 카드가 들어간다 (#58).
  loadBody: () => Promise<{
    default: ComponentType<{ section: number; afterSection?: ReactNode }>;
  }>;
}

// .ts 확장자 명시: 검증기가 이 파일을 Node 네이티브 TS(strip-types)로 직접 로드하기 때문.
import { chapterMeta as ch01Meta, quiz as ch01Quiz, sections as ch01Sections, session as ch01Session } from "./chapters/ch0-1/meta.ts";
import { chapterMeta as ch02Meta, quiz as ch02Quiz, sections as ch02Sections, session as ch02Session, selfQuiz as ch02SelfQuiz } from "./chapters/ch0-2/meta.ts";
import { chapterMeta as ch11Meta, quiz as ch11Quiz, sections as ch11Sections } from "./chapters/ch1-1/meta.ts";
import { chapterMeta as ch12Meta, quiz as ch12Quiz, sections as ch12Sections } from "./chapters/ch1-2/meta.ts";

export const registry: ChapterEntry[] = [
  {
    data: { chapterMeta: ch01Meta, quiz: ch01Quiz, sections: ch01Sections, session: ch01Session },
    loadBody: () => import("./chapters/ch0-1/body"),
  },
  {
    data: { chapterMeta: ch02Meta, quiz: ch02Quiz, sections: ch02Sections, session: ch02Session, selfQuiz: ch02SelfQuiz },
    loadBody: () => import("./chapters/ch0-2/body"),
  },
  {
    data: { chapterMeta: ch11Meta, quiz: ch11Quiz, sections: ch11Sections },
    loadBody: () => import("./chapters/ch1-1/body"),
  },
  {
    data: { chapterMeta: ch12Meta, quiz: ch12Quiz, sections: ch12Sections },
    loadBody: () => import("./chapters/ch1-2/body"),
  },
];
