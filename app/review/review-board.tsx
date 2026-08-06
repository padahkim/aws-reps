"use client";

import Link from "next/link";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { loadReview, useReview } from "@/lib/progress/review";
import {
  dueList,
  practiceList,
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

/**
 * 출제 모드의 무작위 순서 (#236) — 연습 시작 시점에 한 번 섞어 얼린다(렌더마다 섞으면 푸는
 * 사이에 목록이 흔들린다 — QuizItem 이 선택지 배치를 마운트 때 고정하는 것과 같은 이유).
 * 여기서 섞어도 되는 근거도 같다: 이 목록은 localStorage 를 읽어야 나오므로 비교할 선렌더
 * HTML 이 없다 (위 규칙 2).
 */
function shuffled<T>(list: T[]): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** 채점 직후 상태 — due 뷰와 출제 모드가 각자 한 벌씩 갖는다 (세션이 서로 독립이므로). */
type GradedMap = Record<string, { passed: boolean; before: ReviewEntry["item"] }>;

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
  const [graded, setGraded] = useState<GradedMap>({});

  /**
   * 출제 모드 (#236) — due 뷰가 "지금 해야 하는 복습"이라면 이건 "내가 고른 범위의 자유 연습"
   * 이다. 켜져 있는 동안 due 뷰를 통째로 대체한다: 두 목록을 같이 그리면 같은 문항이 화면에
   * 두 번 나와 서로 다른 채점 상태를 갖게 된다. 목록은 시작 시점에 섞어 얼린다 (위 규칙 1).
   */
  const [practice, setPractice] = useState<{ label: string; entries: ReviewEntry[] } | null>(null);
  const [practiceGraded, setPracticeGraded] = useState<GradedMap>({});

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

  // 출제 모드 모집단 (#236) — 오답 노트 전부(졸업 포함), 콘텐츠에 실재하는 것만
  const pool = practiceList(review, new Set(byKey.keys()));
  // 범위 버튼용 챕터 색인 — 항목이 있는 챕터만, 콘텐츠 순서(bank 가 챕터 순이다)
  const practiceChapters: { id: string; title: string; count: number }[] = [];
  for (const entry of pool) {
    const bankEntry = byKey.get(entry.gk);
    if (!bankEntry) continue;
    const slot = practiceChapters.find((c) => c.id === bankEntry.chapterId);
    if (slot) slot.count++;
    else practiceChapters.push({ id: bankEntry.chapterId, title: bankEntry.chapterTitle, count: 1 });
  }
  practiceChapters.sort((a, b) => (a.id < b.id ? -1 : 1));

  function startPractice(chapterId: string | null, label: string) {
    const scoped =
      chapterId === null ? pool : pool.filter((e) => byKey.get(e.gk)?.chapterId === chapterId);
    setPractice({ label, entries: shuffled(scoped) });
    setPracticeGraded({});
  }

  function exitPractice() {
    setPractice(null);
    setPracticeGraded({});
    // due 목록 재동결 — 연습 채점으로 상자·기한이 움직였으므로, 얼린 목록을 그대로 두면
    // 방금 연습에서 승급한 문항이 due 로 남아 "맞혔는데 왜 또 나오지"가 된다. 나가는 순간이
    // 이 화면의 새 진입이다 (위 규칙 1의 "진입 시점"을 다시 잡는 셈).
    const now = new Date().toISOString();
    setSession({ now, due: dueList(loadReview(), now, new Set(bank.map((e) => e.gk))) });
    setGraded({});
  }

  /** 문항 카드 하나 — due 뷰와 출제 모드가 같은 모양을 쓴다. `late` 는 due 뷰만 넘긴다. */
  function renderEntry(
    entry: ReviewEntry,
    i: number,
    gradedMap: GradedMap,
    setGradedMap: Dispatch<SetStateAction<GradedMap>>,
    late?: number,
  ) {
    const bankEntry = byKey.get(entry.gk);
    if (!bankEntry) return null;
    // 상자 배지는 **지금 저장된 값**이다 — 얼린 값을 쓰면 채점 뒤 "상자 1 → 2" 라고
    // 알려 놓고 배지는 "상자 1 · 약점"으로 남는다. 연체 표기는 반대로 얼린 값을 쓴다:
    // 그건 "이 문항이 왜 이 목록에 있는가"의 설명이라 진입 시점이 정본이다.
    const current = review.items[entry.gk] ?? entry.item;
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
          {late !== undefined && late > 0 && (
            <Badge text={`${late}일 연체`} bg={PAL.redSoft} fg={PAL.red} />
          )}
        </div>
        <QuizItem
          index={i}
          chapterId={bankEntry.chapterId}
          question={bankEntry.question}
          shuffle
          onGraded={(passed) => {
            const before = review.items[entry.gk] ?? entry.item;
            setGradedMap((prev) => ({ ...prev, [entry.gk]: { passed, before } }));
            // 이 채점이 그 챕터의 완료 조건을 넘겼을 수 있다 (#224)
            captureChapterCompletion(
              bankEntry.chapterId,
              chapterKeys[bankEntry.chapterId]?.final ?? [],
            );
            refresh();
          }}
        />
        {gradedMap[entry.gk] && (
          <Outcome
            before={gradedMap[entry.gk].before}
            after={review.items[entry.gk]}
            passed={gradedMap[entry.gk].passed}
          />
        )}
      </article>
    );
  }

  // 출제 모드 화면 — due 뷰를 통째로 대체한다 (state 주석 참조)
  if (practice !== null) {
    const allGraded =
      practice.entries.length > 0 && practice.entries.every((e) => practiceGraded[e.gk]);
    return (
      <>
        <Header />
        <section>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "baseline", flexWrap: "wrap" }}>
            <h2 style={{ fontSize: "1.05rem", fontWeight: 900 }}>
              출제 모드 · {practice.label} {practice.entries.length}문항
            </h2>
            <button
              type="button"
              onClick={exitPractice}
              style={{
                font: "inherit",
                fontSize: "0.83rem",
                fontWeight: 700,
                marginLeft: "auto",
                padding: "0.35rem 0.9rem",
                borderRadius: 99,
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--muted)",
                cursor: "pointer",
              }}
            >
              연습 종료
            </button>
          </div>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: 4 }}>
            무작위 순서로 나옵니다. 채점 규칙은 평소와 같습니다 — 틀리면 상자 1로, 기한 전
            정답은 승급하지 않습니다.
          </p>
          {practice.entries.map((entry, i) =>
            renderEntry(entry, i, practiceGraded, setPracticeGraded),
          )}
          {allGraded && (
            <SessionDone
              heading={`연습 끝 — ${practice.entries.length}문항 중 ${
                practice.entries.filter((e) => practiceGraded[e.gk]?.passed).length
              }개 맞혔습니다`}
              states={practice.entries.map((e) => review.items[e.gk] ?? e.item)}
            />
          )}
        </section>
      </>
    );
  }

  return (
    <>
      <Header />

      {/* 출제 모드 진입 (#236) — 항목이 하나라도 있어야 낼 것이 있다 */}
      {pool.length > 0 && (
        <section
          style={{
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "0.9rem 1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ fontWeight: 900, fontSize: "0.95rem" }}>출제 모드 — 자유 연습</div>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", margin: "0.3rem 0 0.7rem" }}>
            기한과 무관하게, 오답 노트에 모인 문항(졸업 포함)을 범위를 골라 무작위 순서로 다시
            풉니다 — 시험 전 훑기에 씁니다. 채점은 평소처럼 상자에 반영됩니다.
          </p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <ScopeButton
              label={`전체 ${pool.length}문항`}
              primary
              onClick={() => startPractice(null, "전체")}
            />
            {practiceChapters.map((c) => (
              <ScopeButton
                key={c.id}
                label={`${c.title} ${c.count}`}
                onClick={() => startPractice(c.id, c.title)}
              />
            ))}
          </div>
        </section>
      )}

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
          {playable.map((entry, i) =>
            renderEntry(entry, i, graded, setGraded, overdueDays(entry.item.dueAt, session.now)),
          )}
          {playable.every((entry) => graded[entry.gk]) && (
            <SessionDone
              heading={`오늘 복습 끝 — ${playable.length}문항 중 ${
                playable.filter((entry) => graded[entry.gk]?.passed).length
              }개 맞혔습니다`}
              states={playable.map((entry) => review.items[entry.gk] ?? entry.item)}
            />
          )}
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

/**
 * 세션 마무리 블록 (#239) — 얼린 목록(위 규칙 1)의 **전 문항이 채점되면** 리스트 끝에
 * 나타난다. 목록이 얼어 있어 채점해도 문항이 사라지지 않으므로, 이 블록이 없으면 due 가
 * 1개인 날(매일 조금씩 복습하는 최빈 상태)은 채점 후 화면이 막다른 골목이 된다 — 끝났다는
 * 확인도 다음 행동도 없다 (2026-08-06 사용자 피드백).
 *
 * 형태는 due 0 진입의 빈 상태 문구와 같은 틀(점선 상자)이다 — "할 일 없음"을 말하는 두
 * 화면이 다른 물건으로 보이지 않게. 요약 수치는 `graded` 의 이번 세션 채점만 센다:
 * 저장소 누계(`attempts`·`correct`)를 세면 "오늘 복습"의 결과가 아니게 된다.
 *
 * **다음 일정 안내는 채점 정오가 아니라 저장된 상자 상태에서 파생한다** (PR #240 Codex P2):
 * "맞혔다 = 상자가 올랐다"가 아니다 — 상자 3 정답은 졸업이라 다시 나오지 않고, "다시 풀기"
 * 정답은 조기 정답(D2)이라 상자 1 그대로 내일 나온다. 정오 플래그로 문구를 지으면 그 두
 * 경로에서 거짓말이 된다. 상자 1 = 내일(간격 1일), 상자 2·3 = 다음 기한, 졸업 = 안 나옴.
 *
 * 출제 모드(#236)도 이 블록을 쓴다 — 세션의 정의(얼린 목록 전 문항 채점)와 다음 일정 파생
 * 규칙이 같아서, 다른 것은 머리글 문구뿐이다. 그래서 `heading` 만 호출부가 짓는다.
 */
function SessionDone({
  heading,
  states,
}: {
  heading: string;
  states: ReviewEntry["item"][];
}) {
  const graduated = states.filter((item) => item.graduatedAt !== undefined).length;
  const tomorrow = states.filter((item) => item.graduatedAt === undefined && item.box === 1).length;
  const later = states.length - graduated - tomorrow;
  const parts = [
    tomorrow > 0 && `${tomorrow}문항은 상자 1 — 내일 다시 나옵니다`,
    // "상자가 올라"라고 말하지 않는다 — due 뷰에서는 참이지만(기한 도달 정답만 이 상자에
    // 온다), 출제 모드(#236)에서는 기한 전 정답이 상자 2·3 에 그대로 머물러 거짓이 된다
    later > 0 && `${later}문항은 상자 2·3 — 다음 기한에 다시 나옵니다`,
    graduated > 0 && `${graduated}문항은 졸업 — 더 나오지 않습니다`,
  ].filter(Boolean);
  return (
    <div
      style={{
        marginTop: "2rem",
        padding: "1.5rem 1rem",
        textAlign: "center",
        border: "1px dashed var(--border)",
        borderRadius: 8,
      }}
    >
      <p style={{ fontWeight: 900 }}>{heading}</p>
      {parts.length > 0 && (
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginTop: 4 }}>
          {parts.join(" · ")}
        </p>
      )}
      <p style={{ marginTop: "0.8rem" }}>
        <Link href="/">홈으로 돌아가기</Link>
      </p>
    </div>
  );
}

/** 출제 모드 범위 버튼 (#236) — 전체(primary) 하나와 챕터별 하나씩. */
function ScopeButton({
  label,
  onClick,
  primary = false,
}: {
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        font: "inherit",
        fontSize: "0.83rem",
        fontWeight: 700,
        padding: "0.35rem 0.9rem",
        borderRadius: 99,
        cursor: "pointer",
        border: primary ? "none" : "1px solid var(--border)",
        background: primary ? "var(--accent)" : "transparent",
        color: primary ? "#fff" : "var(--fg)",
      }}
    >
      {label}
    </button>
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
