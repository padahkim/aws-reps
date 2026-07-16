import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AWS DVA-C02 학습",
  description: "AWS Certified Developer – Associate 시험 대비 학습 사이트",
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
      </body>
    </html>
  );
}
