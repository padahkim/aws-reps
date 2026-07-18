import Script from "next/script";

// dev 검수 도구가 쓰는 두 CDN. /_source 의 각 페이지가 직접 포함한다 (제품 `/` 엔 절대 없음):
//  1) Tailwind Play CDN — content/ 원본 중 다수가 Tailwind 유틸 클래스를 쓰는데 앱엔 Tailwind
//     빌드가 없다. Play CDN 은 MutationObserver 로 클라이언트 렌더된 DOM 까지 스캔하므로
//     Babel 이 나중에 주입하는 원본 클래스에도 스타일이 붙는다.
//  2) Babel standalone — 날것 .jsx 를 브라우저에서 변환하기 위함 (BabelRender.tsx 참조).
//
// 왜 nested layout.tsx 가 아니라 페이지마다 포함하나:
//   %5F 로 이스케이프한 폴더에 layout.tsx 를 두면 Next 의 dev 타입 생성기는 "/%5Fsource",
//   build 생성기는 "/_source" 로 LayoutRoutes 를 만들어 둘이 공존할 때 `tsc` 가 깨진다.
//   레이아웃을 없애면 이 불일치가 사라진다.
export default function SourceHead() {
  return (
    <>
      <Script src="https://cdn.tailwindcss.com" strategy="afterInteractive" />
      <Script
        src="https://unpkg.com/@babel/standalone/babel.min.js"
        strategy="afterInteractive"
      />
    </>
  );
}
