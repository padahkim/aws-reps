import type { NextConfig } from "next";

// output: "export" — 서버 런타임 없는 순수 정적 사이트 (호스트 비종속 배포).
// Route Handler·DB 등 서버 기능이 필요해지면 이 옵션만 제거한다.
const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
