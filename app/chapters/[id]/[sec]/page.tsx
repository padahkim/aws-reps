import Link from "next/link";
import { notFound } from "next/navigation";
import {
  SelfQuiz,
  conceptsForSection,
  getAllChapters,
  getChapter,
  partForSection,
  sectionCount,
  selfQuizForSection,
} from "@/lib/content";
import ChapterQuiz from "../chapter-quiz";
import MarkRead from "./mark-read";
import { PreviewQuestions } from "./preview-questions";
import SectionConcepts from "./section-concepts";

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

  // 개념 인출 카드 — 본문 섹션 페이지에만, 그 섹션(num)에 매핑된 카드가 있을 때만.
  // body 의 afterSection 슬롯으로 넘겨 본문과 아웃트로 "사이"에 놓는다 (규약 v3 섹션 규약).
  const concepts = isQuiz ? [] : conceptsForSection(entry, sections[n - 1].num);

  // 섹션 셀프 퀴즈 — 인출 카드 "위"에 자기채점 덱 (#105 결정, #98의 아래 배치를 뒤집음:
  // 짧은 판정형으로 핵심 사실 숙지를 먼저 확인하고 서술형 인출 연습으로 넘어가는
  // 쉬운 것→어려운 것 순서. 카드 = 서술·정교화, 셀프 퀴즈 = 판정형 — 층 분리는 유지).
  const selfQuizItems = isQuiz ? [] : selfQuizForSection(entry, sections[n - 1].num);
  const afterSection =
    concepts.length > 0 || selfQuizItems.length > 0 ? (
      <>
        {selfQuizItems.length > 0 && <SelfQuiz items={selfQuizItems} />}
        {concepts.length > 0 && <SectionConcepts concepts={concepts} />}
      </>
    ) : undefined;

  // 미리 보는 질문 (규약 v3.1) — 같은 셀프 퀴즈의 "질문만" 섹션 머리로 올린다. 응답은 안 받는다:
  // 위 selfQuizItems 가 하단에서 그대로 응답·채점을 담당하고, 여기는 예고 목록일 뿐이다.
  const beforeBody =
    selfQuizItems.length > 0 ? (
      <PreviewQuestions questions={selfQuizItems.map((item) => item.q)} />
    ) : undefined;

  // 파트 컨텍스트 (규약 v3.1) — 지금 어느 묶음의 어디쯤인지. parts 없는 챕터·퀴즈 섹션은 undefined
  const part = isQuiz ? undefined : partForSection(entry, n);

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

      {part && (
        <p
          style={{
            fontSize: "0.82rem",
            fontWeight: 700,
            color: "var(--muted)",
            paddingLeft: "0.7rem",
            borderLeft: "3px solid var(--border)",
          }}
        >
          파트 {part.index} — {part.title}
        </p>
      )}

      {isQuiz ? (
        <ChapterQuiz quiz={quiz} />
      ) : (
        <Body section={n - 1} afterSection={afterSection} beforeBody={beforeBody} />
      )}
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
