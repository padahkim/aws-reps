import type { Metadata, Viewport } from "next";
import "./globals.css";
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
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <main>{children}</main>
        <ServiceWorker />
      </body>
    </html>
  );
}
