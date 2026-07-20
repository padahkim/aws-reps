import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// output: "export" — 서버 런타임 없는 순수 정적 사이트 (호스트 비종속 배포).
// Route Handler·DB 등 서버 기능이 필요해지면 이 옵션만 제거한다.
const nextConfig: NextConfig = {
  output: "export",
};

// MDX (규약 v3, #40) — 본문 .mdx import 용. remark/rehype 플러그인 금지:
// Next 16 + Turbopack에서 플러그인 지원이 불안정하다 (#15 결정 코멘트 참조).
const withMDX = createMDX({});

export default withMDX(nextConfig);
