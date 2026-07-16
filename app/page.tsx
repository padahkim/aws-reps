import Link from "next/link";
import { getAllChapters, groupByPhase } from "@/lib/content";

export default function Home() {
  const chapters = getAllChapters();

  return (
    <>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem" }}>AWS DVA-C02 학습</h1>
        <p style={{ color: "var(--muted)" }}>
          챕터 {chapters.length}개
        </p>
      </header>

      {chapters.length === 0 ? (
        <p
          style={{
            padding: "2.5rem 1rem",
            textAlign: "center",
            color: "var(--muted)",
            border: "1px dashed var(--border)",
            borderRadius: "8px",
          }}
        >
          아직 등록된 챕터가 없습니다. 챕터가 변환되면 여기에 표시됩니다.
        </p>
      ) : (
        groupByPhase(chapters).map(([phase, entries]) => (
          <section key={phase} style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.1rem",
                paddingBottom: "0.4rem",
                marginBottom: "0.8rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {phase}
            </h2>
            <ul style={{ listStyle: "none", display: "grid", gap: "0.5rem" }}>
              {entries.map(({ data: { chapterMeta: meta } }) => (
                <li key={meta.id}>
                  <Link href={`/chapters/${meta.id}`}>
                    {meta.id} · {meta.title}
                  </Link>{" "}
                  <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                    {meta.domain} · 출제빈도 {meta.examWeight}/5
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </>
  );
}
