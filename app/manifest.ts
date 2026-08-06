import type { MetadataRoute } from "next";

// output: "export" 에서 정적 파일로 떨어져야 하므로 명시한다 (out/manifest.webmanifest).
export const dynamic = "force-static";

/**
 * 웹 앱 매니페스트 (#234) — 홈 화면 설치 + 오프라인 학습.
 *
 * 아이콘 정본은 public/icon.svg 하나이고 PNG 는 빌드 산출물이다 (scripts/gen-icons.mjs).
 * PNG 를 함께 싣는 이유: iOS 는 apple-touch-icon 에 SVG 를 받지 않는다.
 * 배경이 꽉 찬 정사각이라 maskable 로도 쓸 수 있다 — 내용물은 안전 영역 안에 있다.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AWS DVA-C02 학습",
    short_name: "DVA 학습",
    description: "AWS Certified Developer – Associate 시험 대비 학습 사이트",
    lang: "ko",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
