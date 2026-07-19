import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllChapters, getChapter } from "@/lib/content";
import ChapterQuiz from "./chapter-quiz";

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

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = getChapter(id);
  if (!entry) notFound();

  const meta = entry.data.chapterMeta;
  const Body = (await entry.loadBody()).default;

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
      <Body />
      {/* 빈 quiz(ch0류)는 섹션 자체를 렌더하지 않는다 — schema.ts "빈 quiz 강건성" */}
      {entry.data.quiz.length > 0 && <ChapterQuiz quiz={entry.data.quiz} />}
    </article>
  );
}
