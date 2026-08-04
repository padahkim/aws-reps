"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadReview, useReview } from "@/lib/progress/review";
import {
  dueList,
  upcomingList,
  type Box,
  type ReviewEntry,
} from "@/lib/progress/review-core";
import type { BankEntry } from "@/lib/question-bank";
import { captureChapterCompletion } from "@/lib/progress/completion";
import { QuizItem } from "../chapters/[id]/chapter-quiz";

/**
 * 오답 노트 화면 (#219). 설계 §1-3(정렬·노출)·§1-4(셔플)의 구현이다.
 *
 * 규칙 세 가지가 화면을 결정한다:
 * 1. **목록은 진입 시점에 얼고, 상태는 살아 있다.** 채점하면 그 문항은 곧바로 due 가 아니게
 *    되는데(상자가 올라 기한이 미래로 간다) 목록에서 사라지면 해설을 읽던 중에 화면이 뜯긴다.
 *    그래서 "이번에 풀 목록"은 마운트 때 한 번 정하고, 상자·기한 표시만 채점 뒤 다시 읽는다.
 * 2. **셔플은 여기서만** — 이 목록은 localStorage 를 읽어야 나오므로 문항이 마운트 후에 처음
 *    렌더된다. 비교할 선렌더 HTML 이 없어 hydration 이 걸리지 않는다 (QuizItem 주석 참조).
 * 3. **채점 경로는 챕터 퀴즈와 같은 것** — `QuizItem` 을 그대로 쓰므로 `recordQuestionAttempt`
 *    가 진도와 상자를 함께 갱신한다. 여기서 틀리면 상자 1 로 강등되는 것도 그래서 공짜다.
 */

const BOX_LABEL: Record<Box, string> = {
  1: "상자 1 · 약점",
  2: "상자 2 · 학습중",
  3: "상자 3 · 안정",
};

const PAL = {
  ink: "#171E26",
  teal: "#0E7C7B",
  tealSoft: "#DCF0EF",
  red: "#B9432C",
  redSoft: "#F8E4DF",
  amberText: "#9A5B06",
  amberSoft: "#FDEBD3",
} as const;

const DAY_MS = 86_400_000;

function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
}

/** 며칠 연체인가 — 0이면 "오늘". 음수(예정)는 호출부가 부르지 않는다. */
function overdueDays(dueAt: string, now: string): number {
  return Math.floor((Date.parse(now) - Date.parse(dueAt)) / DAY_MS);
}

function Badge({ text, bg, fg }: { text: string; bg: string; fg: string }) {
  return (
    <span
      style={{
        fontSize: "0.72rem",
        fontWeight: 700,
        whiteSpace: "nowrap",
        borderRadius: 99,
        padding: "2px 10px",
        background: bg,
        color: fg,
      }}
    >
      {text}
    </span>
  );
}

/**
 * 채점 **뒤에만** 나오는 한 줄 — 상자가 어떻게 움직였는지 알려준다. 간격 반복이 눈에 보이는
 * 유일한 자리라 없으면 사용자는 자기 복습이 진행되는지 알 수 없다.
 *
 * 조기 정답(D2)일 때 그 사실을 말해주는 것이 특히 중요하다: 아무 말이 없으면 "맞혔는데 왜
 * 그대로지"로 읽히고, 규칙이 아니라 버그로 보인다.
 */
function Outcome({
  before,
  after,
  passed,
}: {
  before: ReviewEntry["item"];
  after?: ReviewEntry["item"];
  passed: boolean;
}) {
  if (!after) return null;
  const graduated = after.graduatedAt !== undefined;
  let text: string;
  if (!passed) {
    text =
      before.box > 1
        ? `상자 ${before.box} → 1 강등 · 내일 다시 나옵니다`
        : "상자 1 그대로 · 내일 다시 나옵니다";
  } else if (graduated) {
    text = "졸업 — 숙달로 넘어갔습니다. 다시 틀리면 상자 1로 돌아옵니다";
  } else if (after.box > before.box) {
    text = `상자 ${before.box} → ${after.box} · 다음 복습 ${formatDay(after.dueAt)}`;
  } else {
    text = `아직 기한 전이라 상자는 그대로입니다 (${formatDay(after.dueAt)} 예정) — 간격을 둔 정답만 승급합니다`;
  }
  return (
    <p
      style={{
        margin: "0.6rem 0 0",
        fontSize: "0.83rem",
        fontWeight: 700,
        color: graduated ? PAL.teal : passed ? "var(--fg)" : PAL.red,
      }}
    >
      {text}
    </p>
  );
}

export function ReviewBoard({
  bank,
  chapterKeys,
}: {
  bank: BankEntry[];
  /**
   * 챕터별 문항 키 색인 (#224) — 여기서 쓰는 것은 `final` 뿐이다. 오답 노트에서 마지막 오답을
   * 바로잡아 완료 조건을 넘기는 경로가 실재하므로, 그 순간을 이 화면도 잡아야 한다
   * (`completion.ts` 주석 — 넘겼다가 곧 다시 틀리면 배지가 영영 안 붙는다).
   */
  chapterKeys: Record<string, { final: string[] }>;
}) {
  const { review, refresh } = useReview();
  const byKey = new Map(bank.map((e) => [e.gk, e]));

  /**
   * 이번에 풀 목록 — 마운트 때 한 번만 정한다(위 규칙 1). `now` 도 함께 얼려 둔다: 렌더마다
   * 현재 시각을 새로 잡으면 페이지를 열어 둔 사이에 문항이 슬금슬금 들어와 목록이 흔들린다.
   */
  const [session, setSession] = useState<{ now: string; due: ReviewEntry[] } | null>(null);
  useEffect(() => {
    const now = new Date().toISOString();
    // 콘텐츠에 실재하는 문항으로 한정한다 — 홈 배지도 같은 집합을 세므로 두 화면이 어긋나지
    // 않는다 (lib/question-bank.ts 주석 참조)
    setSession({ now, due: dueList(loadReview(), now, new Set(bank.map((e) => e.gk))) });
  }, [bank]);

  /**
   * 방금 채점한 것 — 결과 한 줄은 **채점한 뒤에만** 나온다. (저장소에는 채점 전에도 상자
   * 상태가 있으므로 그것만 보고 그리면 풀기도 전에 결과가 새는 꼴이 된다 — 프리뷰에서 실제로
   * 그랬다.)
   *
   * `before` 를 **직전 채점 시점의 상태**로 잡는 이유: 진입 시점의 상태로 비교하면 "다시
   * 풀기"로 두 번째 채점을 했을 때 첫 채점의 승급 문구가 그대로 남아, 이번에는 안 올랐다는
   * 사실(조기 정답, D2)이 화면에서 사라진다. 이 자리의 `review` 는 아직 `refresh()` 전이라
   * 정확히 그 값이다.
   */
  const [graded, setGraded] = useState<Record<string, { passed: boolean; before: ReviewEntry["item"] }>>({});

  // SSG HTML 과 첫 클라이언트 렌더가 같아야 한다 — 저장소를 읽기 전에는 양쪽 다 이 화면이다
  if (session === null) {
    return (
      <>
        <Header />
        <p style={{ color: "var(--muted)" }}>복습 목록을 불러오는 중…</p>
      </>
    );
  }

  const dueSeen = new Set(session.due.map((e) => e.gk));
  const upcoming = upcomingList(review, session.now, new Set(byKey.keys())).filter(
    (e) => !dueSeen.has(e.gk),
  );
  // 저장소에는 있는데 콘텐츠에서 사라진 문항은 `dueList` 의 `known` 이 이미 걸렀다
  const playable = session.due;

  return (
    <>
      <Header />

      {playable.length === 0 && upcoming.length === 0 ? (
        <p
          style={{
            padding: "2.5rem 1rem",
            textAlign: "center",
            color: "var(--muted)",
            border: "1px dashed var(--border)",
            borderRadius: 8,
          }}
        >
          아직 복습할 문항이 없습니다. 챕터 퀴즈에서 <b>틀린 문항</b>이 여기 모이고, 하루 뒤부터
          다시 나옵니다.
        </p>
      ) : null}

      {playable.length > 0 && (
        <section>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 900 }}>
            지금 풀 문항 {playable.length}개
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: 4 }}>
            연체가 오래된 것부터, 같으면 약점(낮은 상자)부터 나옵니다. 선택지 순서는 매번
            섞입니다 — 자리로 답을 외우지 않게.
          </p>
          {playable.map((entry, i) => {
            const bankEntry = byKey.get(entry.gk);
            if (!bankEntry) return null;
            // 상자 배지는 **지금 저장된 값**이다 — 얼린 값을 쓰면 채점 뒤 "상자 1 → 2" 라고
            // 알려 놓고 배지는 "상자 1 · 약점"으로 남는다. 연체 표기는 반대로 얼린 값을 쓴다:
            // 그건 "이 문항이 왜 이 목록에 있는가"의 설명이라 진입 시점이 정본이다.
            const current = review.items[entry.gk] ?? entry.item;
            const late = overdueDays(entry.item.dueAt, session.now);
            return (
              <article key={entry.gk} style={{ marginTop: "1.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    flexWrap: "wrap",
                    fontSize: "0.8rem",
                    color: "var(--muted)",
                  }}
                >
                  <Link href={`/chapters/${bankEntry.chapterId}`}>{bankEntry.chapterTitle}</Link>
                  <Badge
                    text={current.graduatedAt !== undefined ? "졸업" : BOX_LABEL[current.box]}
                    bg={PAL.tealSoft}
                    fg={PAL.teal}
                  />
                  {late > 0 && <Badge text={`${late}일 연체`} bg={PAL.redSoft} fg={PAL.red} />}
                </div>
                <QuizItem
                  index={i}
                  chapterId={bankEntry.chapterId}
                  question={bankEntry.question}
                  shuffle
                  onGraded={(passed) => {
                    const before = review.items[entry.gk] ?? entry.item;
                    setGraded((prev) => ({ ...prev, [entry.gk]: { passed, before } }));
                    // 이 채점이 그 챕터의 완료 조건을 넘겼을 수 있다 (#224)
                    captureChapterCompletion(
                      bankEntry.chapterId,
                      chapterKeys[bankEntry.chapterId]?.final ?? [],
                    );
                    refresh();
                  }}
                />
                {graded[entry.gk] && (
                  <Outcome
                    before={graded[entry.gk].before}
                    after={review.items[entry.gk]}
                    passed={graded[entry.gk].passed}
                  />
                )}
              </article>
            );
          })}
        </section>
      )}

      {upcoming.length > 0 && (
        <details style={{ marginTop: "2rem" }}>
          <summary style={{ cursor: "pointer", fontWeight: 700 }}>
            예정 {upcoming.length}개 — 아직 기한이 아닙니다
          </summary>
          <ul style={{ listStyle: "none", padding: 0, margin: "0.8rem 0 0", display: "grid", gap: "0.4rem" }}>
            {upcoming.map((entry) => {
              const bankEntry = byKey.get(entry.gk);
              return (
                <li
                  key={entry.gk}
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    flexWrap: "wrap",
                    fontSize: "0.85rem",
                  }}
                >
                  <Badge text={BOX_LABEL[entry.item.box]} bg={PAL.amberSoft} fg={PAL.amberText} />
                  <span>{bankEntry?.question.title ?? bankEntry?.chapterTitle ?? entry.gk}</span>
                  <span style={{ color: "var(--muted)", marginLeft: "auto" }}>
                    {formatDay(entry.item.dueAt)}
                  </span>
                </li>
              );
            })}
          </ul>
        </details>
      )}
    </>
  );
}

function Header() {
  return (
    <header style={{ marginBottom: "1.5rem" }}>
      <h1 style={{ fontSize: "1.5rem" }}>오답 노트</h1>
      <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
        틀린 문항만 모아 <b>간격을 두고</b> 다시 냅니다 — 맞히면 다음 상자로 올라가 뜸하게(1일 →
        3일 → 7일), 틀리면 상자 1로 돌아와 매일. 상자 3에서 맞히면 졸업합니다.{" "}
        <Link href="/">홈</Link>
      </p>
    </header>
  );
}
