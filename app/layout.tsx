import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppBar } from "./app-bar";
import { ServiceWorker } from "./service-worker";

export const metadata: Metadata = {
  title: "AWS DVA-C02 학습",
  description: "AWS Certified Developer – Associate 시험 대비 학습 사이트",
  // 아이콘 정본은 public/icon.svg, PNG 는 빌드 산출물이다 (scripts/gen-icons.mjs).
  // apple 항목이 따로 필요한 이유: iOS 는 홈 화면 아이콘으로 SVG 를 받지 않는다.
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  appleWebApp: { capable: true, title: "DVA 학습", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* FOUC 및 테마 색상 방지 인라인 스크립트 (#282) — 브라우저 렌더링 시작 전 localStorage 테마를 적용해 깜빡임 및 메타 색상 불일치 방지 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var theme=(t==="light"||t==="dark"||t==="system")?t:"system";document.documentElement.setAttribute("data-theme",theme);if(theme==="dark"||theme==="light"){var color=theme==="dark"?"#0d1117":"#ffffff";var metas=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<metas.length;i++){metas[i].setAttribute("content",color);}}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        {/* 전역 앱바 (#247) — 설치형 PWA 에는 브라우저 뒤로 버튼이 없다. 여기가 이 앱의
            유일한 되돌아오기 장치이므로 `<main>` 밖, 모든 화면 위에 온다. */}
        <AppBar />
        <main>{children}</main>
        <ServiceWorker />
      </body>
    </html>
  );
}
