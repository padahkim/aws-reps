import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllChapters, getChapter } from "@/lib/content";
import { SectionToc, type TocItem } from "./section-toc";

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
  const items: TocItem[] = [
    ...sections.map((s, i) => ({ sec: i + 1, num: s.num, title: s.title, sub: s.sub })),
    // 퀴즈는 마지막 섹션 (규약 v2 — 빈 quiz면 섹션 자체가 없다)
    ...(quiz.length > 0
      ? [
          {
            sec: sections.length + 1,
            num: "Q",
            title: "챕터 퀴즈",
            sub: `${quiz.length}문항 · 전 섹션 종합`,
          },
        ]
      : []),
  ];

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
      <SectionToc chapterId={meta.id} items={items} />
    </article>
  );
}
