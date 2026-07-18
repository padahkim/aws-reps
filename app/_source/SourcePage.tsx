import Link from "next/link";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getByFile } from "./manifest";
import BabelRender from "./BabelRender";
import SourceHead from "./SourceHead";

// 원본 1개를 보여주는 공용 서버 컴포넌트. 생성된 라우트(app/%5Fsource/<slug>/page.tsx)가 이걸 부른다.
//
// 왜 [file] 동적 라우트가 아니라 파일별 정적 라우트인가:
//   Next 16 은 %5F 로 이스케이프한 폴더(/_source) 아래의 동적 세그먼트에서 output:"export" 의
//   generateStaticParams 를 매칭하지 못한다 ("missing param" 500). 일반 폴더에서는 정상이라
//   %5F 이스케이프가 원인. 정적 라우트는 파라미터 맵을 안 타므로 이 버그를 피한다.
//   (원본은 문자열로만 읽으므로 라우트가 28개여도 번들러 그래프엔 아무 영향이 없다.)

// 원본을 "모듈로 import 하지 않고" 문자열로만 읽는다 — 날것 .jsx 를 번들러 그래프에 넣지 않기 위함.
function readSource(file: string): string {
  try {
    return readFileSync(join(process.cwd(), "content", file), "utf8");
  } catch {
    return "";
  }
}

export default function SourcePage({ file }: { file: string }) {
  const item = getByFile(file);
  const source = readSource(file);

  return (
    <div>
      <SourceHead />
      <nav style={{ marginBottom: "1rem" }}>
        <Link href="/_source">← 원본 목차</Link>
        <span
          style={{
            marginLeft: "0.8rem",
            fontFamily: "ui-monospace, monospace",
            color: "var(--muted)",
            fontSize: "0.85rem",
          }}
        >
          {file}
          {item?.isTemplate ? "  (템플릿)" : ""}
        </span>
      </nav>

      {!source ? (
        <p style={{ color: "#e11d48" }}>원본을 읽지 못했습니다: {file}</p>
      ) : item?.kind === "html" ? (
        // stage0.html 은 자체 <html>/<style>/<link> 를 가진 완전한 문서 → 컴포넌트가 아니라
        // 파일 내용을 그대로 iframe srcDoc 으로 격리 렌더한다.
        <iframe
          srcDoc={source}
          title={file}
          style={{
            width: "100%",
            height: "80vh",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            background: "#fff",
          }}
        />
      ) : (
        <BabelRender file={file} source={source} />
      )}
    </div>
  );
}
