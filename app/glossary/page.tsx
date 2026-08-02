import Link from "next/link";
import type { Metadata } from "next";
import { glossary } from "@/lib/content";

export const metadata: Metadata = {
  title: "용어집 — AWS DVA-C02 학습",
  description: "본문에 등장하는 AWS 고유 용어·약어 사전",
};

/**
 * 전역 용어집 페이지 (#192, spike #57 결정) — 단일 정적 페이지 + 항목별 id 앵커.
 * 데이터 정본은 content/glossary.ts, 소비는 lib/content.ts 통로로만.
 * 표시 순서는 여기서 정한다 (배열 순서는 계약이 아니다 — glossary.ts 머리말):
 * 사전이므로 가나다·알파벳 정렬. Intl.Collator 는 빌드 시 한 번 실행되는 결정적
 * 정렬이라 SSG(output: "export")와 충돌하지 않는다.
 */
const collator = new Intl.Collator("ko");

export default function GlossaryPage() {
  const terms = [...glossary].sort((a, b) => collator.compare(a.term, b.term));

  return (
    <>
      <nav style={{ marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        <Link href="/">← 홈</Link>
      </nav>

      <header style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem" }}>용어집</h1>
        <p style={{ color: "var(--muted)" }}>
          본문에 등장하는 AWS 고유 용어·약어 {terms.length}개 — 각 항목은{" "}
          <code>#용어id</code> 앵커로 바로 열 수 있습니다.
        </p>
      </header>

      <ul style={{ listStyle: "none", display: "grid", gap: "0.6rem" }}>
        {terms.map((t) => (
          <li
            key={t.id}
            id={t.id}
            className="glossary-item"
            style={{ padding: "0.85rem 1rem" }}
          >
            <h2 style={{ fontSize: "1rem", lineHeight: 1.4 }}>
              {/* 자기 앵커 링크 — 딥링크(/glossary#id)를 복사해 가는 통로 */}
              <a href={`#${t.id}`} style={{ color: "inherit" }}>
                {t.term}
              </a>
              {t.full && (
                <span
                  style={{
                    marginLeft: "0.45rem",
                    color: "var(--muted)",
                    fontWeight: 400,
                    fontSize: "0.85rem",
                  }}
                >
                  {t.full}
                </span>
              )}
            </h2>
            <p style={{ marginTop: "0.3rem" }}>{t.short}</p>
            {/* detail 은 /glossary 전용, "\n\n" = 문단 구분 (schema.ts GlossaryTerm) */}
            {t.detail?.split("\n\n").map((para, i) => (
              <p
                key={i}
                style={{ marginTop: "0.5rem", fontSize: "0.92rem", color: "var(--muted)" }}
              >
                {para}
              </p>
            ))}
            {/* chapterId 실존은 검증기가 빌드에서 보장한다 (GLOSSARY 검증) */}
            {t.chapterId && (
              <p style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
                <Link href={`/chapters/${t.chapterId}`}>
                  {t.chapterId} 챕터에서 자세히 →
                </Link>
              </p>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
