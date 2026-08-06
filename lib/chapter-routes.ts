/**
 * 섹션 페이지 수 규칙 + 그로부터 나오는 사이트 라우트 목록.
 *
 * 왜 lib/content.ts 에서 떼어 놨나 (#234): 서비스 워커의 프리캐시 목록을 빌드 **전에**
 * 만들어야 하는데(생성물이 public/ 에 있어야 배포에 실린다), lib/content.ts 는 React
 * 컴포넌트를 통로 re-export 하고 있어 Node 스크립트가 로드할 수 없다. 규칙을 스크립트에
 * 베껴 쓰면 라우터와 조용히 어긋나므로, 규칙 자체를 순수 모듈로 내리고 양쪽이 이것만 본다.
 *   · 앱  → lib/content.ts 가 그대로 re-export (호출부는 바뀌지 않는다)
 *   · 빌드 → scripts/gen-sw.ts 가 이 파일을 직접 import
 *
 * 상대경로 + .ts 확장자: 이 파일이 Node 네이티브 TS(strip-types)로 직접 로드되기 때문이다
 * (content/registry.ts 머리말과 같은 이유).
 */
import { registry, type ChapterEntry } from "../content/registry.ts";
import type { SessionMixedItem } from "../content/schema.ts";

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
 * 사이트의 모든 문서 라우트 (배포된 URL 형태 그대로 — 확장자 없는 깨끗한 경로).
 *
 * app/ 의 generateStaticParams 와 **같은 재료·같은 규칙**을 쓴다. 여기가 라우터보다 적으면
 * 그 페이지는 오프라인에서 안 뜨고, 많으면 설치 때 404 를 부른다. 어긋남은
 * scripts/check-sw.mjs 가 빌드 산출물과 대조해 잡는다.
 */
export function siteRoutes(): string[] {
  const routes = ["/", "/glossary", "/review"];
  for (const entry of registry) {
    const id = entry.data.chapterMeta.id;
    routes.push(`/chapters/${id}`);
    for (let n = 1; n <= sectionCount(entry); n++) routes.push(`/chapters/${id}/${n}`);
  }
  return routes;
}

/**
 * 그 라우트의 RSC 페이로드 경로. 클라이언트 내비게이션(<Link>)이 이걸 받아 간다 —
 * 문서만 캐시하면 오프라인에서 링크 이동이 죽는다. 실측한 요청 형태는
 * `<라우트>.txt?_rsc=...` 이고, 루트만 /index.txt 로 떨어진다.
 */
export function payloadPath(route: string): string {
  return route === "/" ? "/index.txt" : `${route}.txt`;
}
