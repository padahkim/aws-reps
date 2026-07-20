import type { MDXComponents } from "mdx/types";
import { Code, P } from "@/content/chapters/ui";

/**
 * MDX 기본 요소 → 챕터 UI 팔레트 매핑 (규약 v3, #40).
 * .mdx 본문의 마크다운 산문이 기존 TSX 본문(ui.tsx 프리미티브)과 같은 타이포그래피로
 * 렌더되게 한다. 매핑 근거: p→P(문단 마진), 인라인 코드→Code(잉크 배경 배지),
 * ul/li→기존 본문들이 쓰던 인라인 스타일 값 그대로.
 * 코드 펜스(```)는 여기 code 매핑을 타지 않게 사용 금지 — 블록 코드는 컴포넌트로.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    p: ({ children }) => <P>{children}</P>,
    code: ({ children }) => <Code>{children}</Code>,
    ul: ({ children }) => <ul style={{ margin: "0.5rem 0 0.5rem 1.25rem" }}>{children}</ul>,
    li: ({ children }) => <li style={{ margin: "6px 0" }}>{children}</li>,
    ...components,
  };
}
