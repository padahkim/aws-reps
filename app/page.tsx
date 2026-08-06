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
import { chapterQuestionKeys, questionKeys } from "@/lib/question-bank";
import { CompletionBadge } from "./completion-badge";
import { HomeDashboard } from "./home-dashboard";
import { ReviewLink } from "./review-link";

export default function Home() {
  const chapters = getAllChapters();
  // 챕터별 문항 키 (#224) — 완료 배지의 finalQ 분모와 "복습 n" 의 모집단. 키 문자열만 실으므로
  // 문항 본문은 클라이언트로 가지 않는다 (lib/question-bank.ts 주석 참조)
  const keys = chapterQuestionKeys();

  return (
    <>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem" }}>AWS DVA-C02 학습</h1>
        <p style={{ color: "var(--muted)" }}>
          챕터 {chapters.length}개 · <Link href="/glossary">용어집</Link> · <ReviewLink knownKeys={questionKeys()} />
        </p>
      </header>

      {/*
        진도 대시보드 (#235) — 챕터 목록 **위**에 둔다: "오늘의 복습"이 유일한 행동 유도
        지표(설계 §3-3)라 첫 화면에서 목록보다 먼저 읽혀야 한다. 별도 라우트를 두지 않은
        결정(2026-08-06)도 같은 이유다 — 사용자 1명인 앱에서 진입 단계 추가는 과설계다.
      */}
      {chapters.length > 0 && (
        <HomeDashboard
          chapters={chapters.map((entry) => ({
            id: entry.data.chapterMeta.id,
            title: entry.data.chapterMeta.title,
            domain: entry.data.chapterMeta.domain,
          }))}
          keys={keys}
        />
      )}

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
                      {/*
                        토막을 nowrap 으로 묶는다 (#245). 한국어는 음절 단위로 꺾이므로 묶지
                        않으면 "출제빈도 5/5" 가 "출제빈" / "도 5/5" 처럼 낱말 **중간에서**
                        갈린다 — 토막이 통째로 다음 줄로 내려가는 것과 달리 그건 고장으로
                        읽힌다. `·` 를 span 안에 넣어야 구분자가 앞 토막에 붙어 남지 않는다.
                      */}
                      {meta.domain}{" "}
                      <span style={{ whiteSpace: "nowrap" }}>· 출제빈도 {meta.examWeight}/5</span>
                    </span>
                    {/*
                      읽음 진도 (이슈 #7 확정: 진도 바 + % 병기) + 완료 배지 (#224).
                      나란히 두는 것이 요점이다 — 진도 바는 "본문을 어디까지 봤나", 배지는
                      "챕터를 끝냈나"라 서로 다른 사실이고, 붙어 있어야 그 차이가 읽힌다.
                    */}
                    <div
                      style={{
                        marginTop: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <HomeProgress chapterId={meta.id} total={sectionCount(entry)} />
                      {/*
                        예상 소요는 **콘텐츠 사실**이라 원래 위 메타 줄에 있었는데, 그 줄이
                        (링크 + 도메인 + 빈출 + 소요)로 가장 길고 이 줄이 가장 짧아 모바일에서
                        위만 넘쳤다 (#245). 아래로 내려도 읽히는 문장이 어긋나지 않는다 —
                        "0% (0/19) · 약 116분" = "19개 중 0개 읽음, 전체 약 116분".
                        제 줄로 빼지 않은 이유는 항목당 줄 수다: 목록이 28챕터로 늘면(#29)
                        한 줄 추가가 챕터 수만큼 곱해진다.
                      */}
                      {minutes !== undefined && (
                        <span
                          aria-label={`예상 소요 약 ${minutes}분`}
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--muted)",
                            fontVariantNumeric: "tabular-nums",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span aria-hidden>· 약 {minutes}분</span>
                        </span>
                      )}
                      <CompletionBadge
                        chapterId={meta.id}
                        sectionTotal={sectionCount(entry)}
                        finalKeys={keys[meta.id]?.final ?? []}
                        chapterKeys={keys[meta.id]?.all ?? []}
                      />
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
