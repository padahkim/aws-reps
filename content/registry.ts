import type { ComponentType } from "react";
import type { ChapterData } from "./schema";

/**
 * 챕터 레지스트리 — 앱이 소비하는 챕터의 유일한 목록.
 * 챕터 변환 세션이 content/chapters/{id}/ 를 만들 때 여기에 항목을 추가한다:
 *
 *   import { chapterMeta as ch01Meta, quiz as ch01Quiz } from "./chapters/ch0-1/meta";
 *   // ...
 *   export const registry: ChapterEntry[] = [
 *     { data: { chapterMeta: ch01Meta, quiz: ch01Quiz }, loadBody: () => import("./chapters/ch0-1/body") },
 *   ];
 *
 * 배열 순서 = 커리큘럼 학습 순서 (목록 페이지가 이 순서를 그대로 따른다).
 */
export interface ChapterEntry {
  data: ChapterData;
  loadBody: () => Promise<{ default: ComponentType }>;
}

// .ts 확장자 명시: 검증기가 이 파일을 Node 네이티브 TS(strip-types)로 직접 로드하기 때문.
import { chapterMeta as ch01Meta, quiz as ch01Quiz } from "./chapters/ch0-1/meta.ts";
import { chapterMeta as ch02Meta, quiz as ch02Quiz } from "./chapters/ch0-2/meta.ts";

export const registry: ChapterEntry[] = [
  {
    data: { chapterMeta: ch01Meta, quiz: ch01Quiz },
    loadBody: () => import("./chapters/ch0-1/body"),
  },
  {
    data: { chapterMeta: ch02Meta, quiz: ch02Quiz },
    loadBody: () => import("./chapters/ch0-2/body"),
  },
];
