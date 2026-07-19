import Link from "next/link";
import { getAllChapters, groupByPhase, sectionCount } from "@/lib/content";
import { HomeProgress } from "./home-progress";

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
              {entries.map((entry) => {
                const meta = entry.data.chapterMeta;
                return (
                  <li key={meta.id}>
                    <Link href={`/chapters/${meta.id}`}>
                      {meta.id} · {meta.title}
                    </Link>{" "}
                    <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                      {meta.domain} · 출제빈도 {meta.examWeight}/5
                    </span>
                    {/* 읽음 진도 (이슈 #7 확정: 진도 바 + % 병기) */}
                    <div style={{ marginTop: 2 }}>
                      <HomeProgress chapterId={meta.id} total={sectionCount(entry)} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}

      {/*
        원본 검수 도구(/_source) 진입점 — dev 와 Vercel preview 에서만.
        production 에서는 이 분기가 죽은 코드로 제거되고, prebuild 가 /_source 라우트 자체를
        지우므로 배포본엔 링크도 대상도 남지 않는다. NEXT_PUBLIC_VERCEL_ENV 는 Vercel 이
        빌드 때 주입한다 (System Environment Variables 노출이 켜져 있어야 함 — 기본값 on).
        next/link 가 아니라 <a> 인 이유: 빌드 시점엔 /_source 가 존재하지 않아 타입드 라우트가
        모르는 경로가 된다. 전체 새로고침이라 dev 검수 용도엔 충분하다.
      */}
      {(process.env.NODE_ENV === "development" ||
        process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") && (
        <footer
          style={{
            marginTop: "3rem",
            paddingTop: "1rem",
            borderTop: "1px dashed var(--border)",
            fontSize: "0.85rem",
            color: "var(--muted)",
          }}
        >
          <a href="/_source">원본 소스 검수 (/_source)</a> · dev·preview 전용
        </footer>
      )}
    </>
  );
}
