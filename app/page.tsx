import Link from "next/link";
import {
  chapterParts,
  estimateChapter,
  FREQ_EVIDENCE_NOTE,
  getAllChapters,
  groupByPhase,
  mixedPool,
  sectionCount,
} from "@/lib/content";
import { HomeProgress } from "./home-progress";
import { ReviewLink } from "./review-link";

export default function Home() {
  const chapters = getAllChapters();

  return (
    <>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem" }}>AWS DVA-C02 학습</h1>
        <p style={{ color: "var(--muted)" }}>
          챕터 {chapters.length}개 · <Link href="/glossary">용어집</Link> · <ReviewLink />
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
                // 예상 소요 (#173) — 챕터 페이지 오리엔테이션과 **같은 값**이어야 하므로 부르는
                // 방식도 같다: parts 와 혼합 풀 크기(#59)를 똑같이 넘긴다. 어느 하나가 빠지면
                // 반올림 경로나 마무리 페이지 몫이 달라져 두 화면의 수치가 어긋난다.
                // 산출 실패면 그 토막만 빠진다 — 틀린 수치보다 없는 편이 낫다
                // (ChapterOrientation 의 minutes 와 같은 규칙).
                // objectives 게이트는 걸지 않는다: 소요는 MDX 분량에서 나오지 메타에서 나오지 않고,
                // 목록에서 어떤 줄만 시간이 없으면 그게 결손으로 읽힌다.
                const minutes = estimateChapter(entry, chapterParts(entry), mixedPool(entry).length)?.total;
                return (
                  <li key={meta.id}>
                    <Link href={`/chapters/${meta.id}`}>
                      {meta.id} · {meta.title}
                    </Link>{" "}
                    <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                      {meta.domain} · 출제빈도 {meta.examWeight}/5
                      {minutes !== undefined && ` · 약 ${minutes}분`}
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

      {/* 출제빈도 수치의 근거 (#185) — 챕터 목차의 빈출 별점과 같은 성질의 추정치라 같은 문구를 쓴다 */}
      {chapters.length > 0 && (
        <p style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{FREQ_EVIDENCE_NOTE}</p>
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
