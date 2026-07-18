import Link from "next/link";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { SOURCES, slugOf } from "./manifest";
import SourceHead from "./SourceHead";

// dev 검수 도구 목차. content/ 날것 원본 28개를 나열한다 (제품 목차 `/` 와 완전 분리).
// 줄 수는 빌드/렌더 시점에 fs 로 직접 센다 (하드코딩 회피).
function lineCount(file: string): number {
  try {
    const raw = readFileSync(join(process.cwd(), "content", file), "utf8");
    return raw.split("\n").length;
  } catch {
    return 0;
  }
}

export default function SourceIndex() {
  const items = SOURCES.map((s) => ({ ...s, lines: lineCount(s.file) }));

  return (
    <div style={{ maxWidth: "820px", margin: "0 auto" }}>
      <SourceHead />
      <header style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem" }}>원본 소스 검수 (/_source)</h1>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
          content/ 최상위 날것 원본 {SOURCES.length}개 · dev 전용 검수 도구 (제품 목차는{" "}
          <Link href="/">/</Link>)
        </p>
      </header>

      <ul style={{ listStyle: "none", display: "grid", gap: "0.4rem", padding: 0 }}>
        {items.map((s) => (
          <li
            key={s.file}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "0.6rem",
              padding: "0.5rem 0.7rem",
              border: "1px solid var(--border)",
              borderRadius: "6px",
            }}
          >
            <Link
              href={`/_source/${slugOf(s.file)}`}
              style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.9rem" }}
            >
              {s.file}
            </Link>
            {s.isTemplate && (
              <span
                style={{
                  fontSize: "0.7rem",
                  padding: "0.1rem 0.4rem",
                  borderRadius: "999px",
                  background: "#fef9c3",
                  color: "#854d0e",
                }}
              >
                템플릿
              </span>
            )}
            {s.kind === "html" && (
              <span
                style={{
                  fontSize: "0.7rem",
                  padding: "0.1rem 0.4rem",
                  borderRadius: "999px",
                  background: "#dbeafe",
                  color: "#1e40af",
                }}
              >
                HTML · iframe
              </span>
            )}
            <span style={{ marginLeft: "auto", color: "var(--muted)", fontSize: "0.8rem" }}>
              ~{s.lines}줄
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
