import Link from "next/link";
import { notFound } from "next/navigation";
import {
  chapterParts,
  estimateChapter,
  getAllChapters,
  getChapter,
  hasSessionFinale,
  mixedPool,
} from "@/lib/content";
import { ChapterOrientation } from "./chapter-orientation";
import { SectionToc, type TocGroup, type TocItem } from "./section-toc";

// 레지스트리에 없는 id는 404. 단 output: "export"의 dev 서버는 미등록 param을 이 설정과
// 무관하게 자체 500으로 거부한다 (dev 전용 — 배포본은 정적 파일이 없어 호스트 404).
export const dynamicParams = false;

export function generateStaticParams() {
  const params = getAllChapters().map((entry) => ({
    id: entry.data.chapterMeta.id,
  }));
  // output: "export"는 빈 params를 "missing generateStaticParams"로 취급해 빌드를 거부한다.
  // 레지스트리가 빈 동안만 404로 떨어지는 자리표시자 1개를 반환한다 (첫 챕터 등록 시 소멸).
  return params.length > 0 ? params : [{ id: "__empty" }];
}

/** 챕터 첫 화면 = 섹션 목차 (이슈 #7). 본문은 /chapters/{id}/{n} 섹션 페이지로 이동했다. */
export default async function ChapterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = getChapter(id);
  if (!entry) notFound();

  const { chapterMeta: meta, sections, quiz } = entry.data;
  const items: TocItem[] = sections.map((s, i) => ({
    sec: i + 1,
    num: s.num,
    title: s.title,
    sub: s.sub,
    freq: s.freq,
  }));
  // 파트 그룹핑 (규약 v3.1) — parts 가 없는 챕터는 라벨 없는 묶음 하나 = 예전 평평한 목차.
  const parts = chapterParts(entry);
  const pool = mixedPool(entry);
  const estimate = estimateChapter(entry, parts, pool.length);
  // 챕터 인트로 (규약 v3.2, #174) — 예전에는 첫 섹션 페이지 상단이었는데, #161 의 파트
  // 컨텍스트가 그 위에 붙으면서 "파트 1 — …" 밑에 챕터 전체 소개가 오는 범주 오류가 됐다.
  // 여기가 "이 챕터가 무엇이고 지금 잡을 만한가"를 판단하는 화면이라 인트로의 제자리다.
  const Intro = entry.loadIntro ? (await entry.loadIntro()).default : undefined;

  // 마무리 페이지는 마지막 섹션 (규약 v2 → #59). 어느 파트에도 속하지 않으므로
  // 파트 그룹들 뒤에 라벨 없는 묶음으로 붙는다 — 그룹 헤더가 없어 소요는 이 줄의 sub 에 적는다.
  // 그래야 화면의 "파트별 분"을 다 더하면 오리엔테이션의 총합이 나온다 (estimateChapter 참조).
  // session 있는 챕터는 세션 페이지 (#59) — 존재하는 스테이션 이름을 sub 에 나열한다.
  const finale = hasSessionFinale(entry);
  const stationNames = finale
    ? [
        entry.data.session?.diagram ? "도식 재현" : null,
        quiz.length > 0 ? `실전 ${quiz.length}문항` : null,
        pool.length > 0 ? "혼합 복습" : null,
      ].filter(Boolean)
    : [];
  const quizItem: TocItem | undefined =
    finale || quiz.length > 0
      ? {
          sec: sections.length + 1,
          num: "Q",
          title: finale ? "마무리 세션" : "챕터 퀴즈",
          sub: [
            finale ? `${stationNames.join(" · ")} — 전 섹션 종합` : `${quiz.length}문항 · 전 섹션 종합`,
            parts.length > 0 && estimate ? `약 ${estimate.finale}분` : null,
          ]
            .filter(Boolean)
            .join(" · "),
        }
      : undefined;

  const groups: TocGroup[] =
    parts.length > 0
      ? [
          ...parts.map((part, i) => ({
            label: `파트 ${part.index} — ${part.title}`,
            minutes: estimate?.parts[i],
            items: items.slice(part.fromSec - 1, part.toSec),
          })),
          // 챕터 퀴즈는 어느 파트에도 속하지 않는다 — 파트들 뒤에 라벨 없이 붙인다
          ...(quizItem ? [{ items: [quizItem] }] : []),
        ]
      : [{ items: quizItem ? [...items, quizItem] : items }];

  return (
    <article>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/">← 챕터 목록</Link>
      </nav>
      <header
        style={{
          paddingBottom: "1rem",
          marginBottom: "1.5rem",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <h1 style={{ fontSize: "1.4rem" }}>
          {meta.id} · {meta.title}
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
          {meta.phase} · {meta.domain} · 출제빈도 {meta.examWeight}/5
          {meta.prerequisites.length > 0 && (
            <>
              {" · 선행: "}
              {meta.prerequisites.map((pre, i) => (
                <span key={pre}>
                  {i > 0 && ", "}
                  <Link href={`/chapters/${pre}`}>{pre}</Link>
                </span>
              ))}
            </>
          )}
        </p>
      </header>
      {/* 인트로 → 오리엔테이션 → 목차 순: "무엇인가" → "마치면 무엇을 할 수 있나" → "어떻게 구성되나" */}
      {Intro && (
        <section aria-label="챕터 소개" style={{ marginBottom: "1.5rem" }}>
          <Intro />
        </section>
      )}
      {/* 오리엔테이션은 objectives 가 있는 챕터에만 (규약 v3.1 — 점진 적용, 소급은 #163) */}
      {meta.objectives && (
        <ChapterOrientation
          objectives={meta.objectives}
          minutes={estimate?.total}
          sectionCount={sections.length}
          partCount={parts.length}
        />
      )}
      <SectionToc chapterId={meta.id} groups={groups} />
    </article>
  );
}
