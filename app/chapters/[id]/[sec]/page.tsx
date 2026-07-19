import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllChapters, getChapter, sectionCount } from "@/lib/content";
import ChapterQuiz from "../chapter-quiz";
import MarkRead from "./mark-read";

// 미등록 param 거부 — 상위 [id]/page.tsx와 같은 정책 (output: "export" 정적 라우트).
export const dynamicParams = false;

/** 섹션 페이지 URL 번호는 1-based, quiz가 있으면 마지막 번호가 챕터 퀴즈 (규약 v2). */
export function generateStaticParams() {
  return getAllChapters().flatMap((entry) =>
    Array.from({ length: sectionCount(entry) }, (_, i) => ({
      id: entry.data.chapterMeta.id,
      sec: String(i + 1),
    }))
  );
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ id: string; sec: string }>;
}) {
  const { id, sec } = await params;
  const entry = getChapter(id);
  if (!entry) notFound();

  const { chapterMeta: meta, sections, quiz } = entry.data;
  const total = sectionCount(entry);
  const n = Number(sec);
  if (!Number.isInteger(n) || n < 1 || n > total) notFound();

  const isQuiz = quiz.length > 0 && n === total;
  const Body = (await entry.loadBody()).default;

  // 이전/다음 링크 라벨 — k는 1-based 섹션 번호
  const label = (k: number) =>
    k > sections.length ? "챕터 퀴즈" : `${sections[k - 1].num} ${sections[k - 1].title}`;

  return (
    <article>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <Link href={`/chapters/${id}`}>
          ← {meta.id} · {meta.title} 목차
        </Link>
        <span
          style={{
            color: "var(--muted)",
            fontSize: "0.85rem",
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
          }}
        >
          {n} / {total}
        </span>
      </nav>

      {isQuiz ? <ChapterQuiz quiz={quiz} /> : <Body section={n - 1} />}
      <MarkRead chapterId={id} sec={n} />

      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          marginTop: "2.5rem",
          paddingTop: "1rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        {n > 1 ? <Link href={`/chapters/${id}/${n - 1}`}>← {label(n - 1)}</Link> : <span />}
        {n < total ? (
          <Link href={`/chapters/${id}/${n + 1}`} style={{ textAlign: "right" }}>
            {label(n + 1)} →
          </Link>
        ) : (
          <Link href={`/chapters/${id}`} style={{ textAlign: "right" }}>
            목차로 →
          </Link>
        )}
      </nav>
    </article>
  );
}
