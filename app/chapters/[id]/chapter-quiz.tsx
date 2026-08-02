"use client";

import { useState, type ReactNode } from "react";
import type { Question } from "@/lib/content";
import { recordQuestionAttempt } from "@/lib/progress/store";

/**
 * 챕터 퀴즈 섹션 (이슈 #6) — 챕터 페이지 하단에 quiz 전체를 렌더한다.
 * 단일 정답: 선택지 클릭 즉시 채점. 복수 정답: 토글 선택 후 채점 버튼.
 * 채점 후: 정답/오답 배너 + 선택지별 해설(choiceExplanations) + 해설 본문 + 공식 문서 링크.
 * 빈 quiz는 호출부(page.tsx)가 섹션 자체를 렌더하지 않는다.
 *
 * 세션 모드 (#59 — gated): 세션 마무리 페이지의 실전 스테이션이 같은 quiz 를 소비하되,
 * 채점 후 해설(선택지별 why·본문·링크)을 "자기설명 체크포인트" 뒤로 미룬다 — 오답 선택지가
 * 왜 틀렸는지 스스로 설명한 뒤에 열어야 학습 효과가 산다 (#54 선결정). 정답/오답 배너는
 * 게이트 앞에 그대로 보인다 (입장은 이미 확정됐고, 미뤄지는 건 근거 해설이다).
 * 문항 간 이동은 게이팅하지 않는다 — 정답 여부와 무관하게 자유.
 *
 * 채점 결과 지속 (#66): 채점할 때마다 문항별 사실(시도·정오·시각)을 `dva.progress.v1` 에
 * 남긴다 (lib/progress/store.ts). 화면 상태(selected·submitted)는 예전대로 비저장이다 —
 * 되살려야 할 것은 "무엇을 골랐었나"가 아니라 "맞혔었나"고, 그건 목차 배지가 읽는다.
 */

// 콘텐츠 공용 팔레트(content/chapters/ui.tsx)와 같은 값 — 배경·글자색 쌍 고정으로 다크 모드에서도 읽힘.
// (앱은 content/를 lib/content.ts로만 소비하므로 ui.tsx를 직접 import 하지 않고 값을 복제한다.)
const PAL = {
  ink: "#171E26",
  teal: "#0E7C7B",
  tealSoft: "#DCF0EF",
  red: "#B9432C",
  redSoft: "#F8E4DF",
  amberText: "#9A5B06",
  amberSoft: "#FDEBD3",
} as const;

const DIFFICULTY_LABEL: Record<NonNullable<Question["difficulty"]>, string> = {
  easy: "하 ●○○",
  medium: "중 ●●○",
  hard: "상 ●●●",
};

function sameSet(a: number[], b: number[]): boolean {
  const sa = [...a].sort((x, y) => x - y);
  const sb = [...b].sort((x, y) => x - y);
  return sa.length === sb.length && sa.every((v, i) => v === sb[i]);
}

function QuizItem({
  index,
  chapterId,
  question: q,
  gated = false,
  onExplainedChange,
}: {
  index: number;
  chapterId: string;
  question: Question;
  gated?: boolean;
  onExplainedChange?: (id: string, explained: boolean) => void;
}) {
  const [selected, setSelected] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  // 자기설명 체크포인트 통과 여부 (#59) — 게이트 없는 기존 모드에서는 쓰이지 않는다
  const [explained, setExplained] = useState(false);
  const multi = q.answer.length > 1;
  const correct = submitted && sameSet(selected, q.answer);
  // 해설 공개 시점: 기존 모드 = 채점 즉시, 세션 모드 = 자기설명 체크포인트 통과 후
  const showExplanations = gated ? explained : submitted;

  /**
   * 채점 = 이 문항의 유일한 기록 지점 (#66). 단일 정답(선택지 클릭)과 복수 정답(채점 버튼)이
   * 여기로 모이므로, `<ChapterQuiz>` 를 소비하는 두 경로(세션 실전 스테이션 / 단독 퀴즈
   * 페이지) 모두에서 같은 기록이 남는다. 인자로 선택을 받는 이유: setState 는 비동기라
   * 같은 렌더의 `selected` 로는 방금 고른 값을 채점할 수 없다.
   */
  function grade(choice: number[]) {
    setSelected(choice);
    setSubmitted(true);
    // 문항 객체째 넘긴다 — 저장 키는 q.id 가 아니라 안정 식별자(slug)다 (lib/progress/keys.ts)
    recordQuestionAttempt(chapterId, q, sameSet(choice, q.answer));
  }

  function pick(idx: number) {
    if (submitted) return;
    if (!multi) {
      grade([idx]);
    } else {
      setSelected((prev) =>
        prev.includes(idx) ? prev.filter((v) => v !== idx) : [...prev, idx],
      );
    }
  }

  function passCheckpoint() {
    setExplained(true);
    onExplainedChange?.(q.id, true);
  }

  // 다시 풀기 — 화면만 되돌린다. 이미 남은 기록은 지우지 않고, 재채점이 시도를 하나 더
  // 쌓는다 (설계 §1-2: 즉시 재도전은 막지 않되 기록은 사실대로 남는다).
  function reset() {
    setSelected([]);
    setSubmitted(false);
    setExplained(false);
    onExplainedChange?.(q.id, false);
  }

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: "1.1rem 1.1rem 1rem",
        margin: "1.25rem 0",
      }}
    >
      {/* 문항 헤더: 번호 + 제목 + 난이도 */}
      <div style={{ display: "flex", gap: "0.6rem", alignItems: "baseline", flexWrap: "wrap" }}>
        <span style={{ fontWeight: 900, color: "var(--accent)" }}>Q{index + 1}</span>
        {q.title && <strong style={{ fontSize: "0.95rem" }}>{q.title}</strong>}
        {q.difficulty && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: "0.75rem",
              fontWeight: 700,
              whiteSpace: "nowrap",
              borderRadius: 99,
              padding: "2px 10px",
              background: PAL.amberSoft,
              color: PAL.amberText,
            }}
          >
            {DIFFICULTY_LABEL[q.difficulty]}
          </span>
        )}
      </div>

      <p style={{ margin: "0.7rem 0 0.9rem" }}>{q.scenario}</p>

      {/* 선택지 */}
      <div role={multi ? "group" : "radiogroup"} style={{ display: "grid", gap: "0.5rem" }}>
        {q.choices.map((choice, idx) => {
          const isAnswer = q.answer.includes(idx);
          const isSelected = selected.includes(idx);
          let bg = "transparent";
          let fg = "var(--fg)";
          let border = "1px solid var(--border)";
          if (submitted && isAnswer) {
            bg = PAL.tealSoft; fg = PAL.ink; border = `1px solid ${PAL.teal}`;
          } else if (submitted && isSelected && !isAnswer) {
            bg = PAL.redSoft; fg = PAL.ink; border = `1px solid ${PAL.red}`;
          } else if (!submitted && isSelected) {
            border = "1px solid var(--accent)";
          }
          return (
            <div key={idx}>
              <button
                type="button"
                onClick={() => pick(idx)}
                disabled={submitted}
                aria-pressed={isSelected}
                style={{
                  display: "flex",
                  gap: "0.55rem",
                  width: "100%",
                  textAlign: "left",
                  font: "inherit",
                  fontSize: "0.92rem",
                  lineHeight: 1.5,
                  padding: "0.6rem 0.75rem",
                  borderRadius: 10,
                  cursor: submitted ? "default" : "pointer",
                  background: bg,
                  color: fg,
                  border,
                }}
              >
                <span style={{ fontWeight: 700, flexShrink: 0 }}>
                  {submitted && isAnswer ? "✓" : submitted && isSelected ? "✗" : multi && isSelected ? "☑" : String.fromCharCode(65 + idx)}
                </span>
                <span>{choice}</span>
              </button>
              {/* 채점 후 선택지별 해설 — 세션 모드에서는 자기설명 체크포인트 뒤 */}
              {showExplanations && q.choiceExplanations?.[idx] && (
                <p
                  style={{
                    margin: "0.25rem 0 0.35rem",
                    padding: "0 0.75rem",
                    fontSize: "0.83rem",
                    color: submitted && isAnswer ? PAL.teal : "var(--muted)",
                  }}
                >
                  {q.choiceExplanations[idx]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* 복수 정답: 채점 버튼 */}
      {multi && !submitted && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.75rem" }}>
          <button
            type="button"
            onClick={() => grade(selected)}
            disabled={selected.length === 0}
            style={{
              font: "inherit",
              fontWeight: 700,
              fontSize: "0.9rem",
              padding: "0.45rem 1.2rem",
              borderRadius: 10,
              border: "none",
              cursor: selected.length === 0 ? "default" : "pointer",
              background: selected.length === 0 ? "var(--border)" : "var(--accent)",
              color: selected.length === 0 ? "var(--muted)" : "#fff",
            }}
          >
            채점하기
          </button>
          <span style={{ fontSize: "0.83rem", color: "var(--muted)" }}>
            정답 {q.answer.length}개 · {selected.length}개 선택됨
          </span>
        </div>
      )}

      {/* 채점 결과 + 해설 */}
      {submitted && (
        <div style={{ marginTop: "0.9rem" }}>
          <div
            style={{
              fontWeight: 900,
              fontSize: "0.95rem",
              borderRadius: 10,
              padding: "0.55rem 0.8rem",
              background: correct ? PAL.tealSoft : PAL.redSoft,
              color: correct ? PAL.teal : PAL.red,
            }}
          >
            {correct ? "정답입니다" : `오답입니다 — 정답: ${q.answer.map((a) => String.fromCharCode(65 + a)).join(", ")}`}
          </div>
          {/* 자기설명 체크포인트 (#59 세션 모드) — 해설을 열기 전에 스스로 설명하게 한다 */}
          {gated && !explained && (
            <div
              style={{
                marginTop: "0.7rem",
                borderLeft: "3px solid var(--accent)",
                borderRadius: "0 10px 10px 0",
                background: PAL.amberSoft,
                color: PAL.ink,
                padding: "0.7rem 0.9rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: PAL.amberText,
                }}
              >
                자기설명 체크포인트
              </div>
              <p style={{ margin: "0.4rem 0 0.6rem", fontSize: "0.87rem", lineHeight: 1.7 }}>
                잠깐 — 해설을 열기 전에, 나머지 선택지가 <b>왜 틀렸는지</b> 각각 한 문장으로
                설명해 보세요. 설명이 막히는 선택지가 오늘의 약점입니다.
              </p>
              <button
                type="button"
                onClick={passCheckpoint}
                style={{
                  font: "inherit",
                  fontSize: "0.83rem",
                  fontWeight: 700,
                  padding: "0.4rem 1rem",
                  borderRadius: 99,
                  border: "none",
                  background: "var(--accent)",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                설명했어요 — 해설 열기
              </button>
            </div>
          )}
          {showExplanations && (
            <div style={{ marginTop: "0.6rem", fontSize: "0.9rem" }}>
              {q.explanation.split("\n\n").map((para, i) => (
                <p key={i} style={{ margin: "0.5rem 0" }}>{para}</p>
              ))}
            </div>
          )}
          {showExplanations && q.references && q.references.length > 0 && (
            <ul style={{ margin: "0.5rem 0 0 1.1rem", padding: 0, fontSize: "0.83rem" }}>
              {q.references.map((ref) => (
                <li key={ref.url}>
                  <a href={ref.url} target="_blank" rel="noreferrer">{ref.title}</a>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              font: "inherit",
              fontSize: "0.83rem",
              marginTop: "0.7rem",
              padding: "0.35rem 0.9rem",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--muted)",
              cursor: "pointer",
            }}
          >
            다시 풀기
          </button>
        </div>
      )}
    </div>
  );
}

export default function ChapterQuiz({
  chapterId,
  quiz,
  gated = false,
  header,
  onExplainedChange,
}: {
  chapterId: string;              // 채점 기록의 전역 문항 키 접두 (#66) — 필수: 빠뜨린 경로는 조용히 기록을 잃는다
  quiz: Question[];
  // ── 세션 모드 (#59) — 실전 스테이션이 이 컴포넌트를 재사용할 때만 쓴다 ──
  gated?: boolean;                // 채점 후 해설을 자기설명 체크포인트 뒤로 미룬다
  header?: ReactNode;             // 기본 헤더(챕터 퀴즈 h2+안내)를 통째로 교체하는 슬롯
  onExplainedChange?: (id: string, explained: boolean) => void; // 진행률 레일용
}) {
  return (
    <section style={{ marginTop: "3rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
      {header ?? (
        <>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 900 }}>챕터 퀴즈</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginTop: 4 }}>
            {quiz.length}문항 · 선택지를 고르면 즉시 채점됩니다. 복수 정답 문항은 모두 고른 뒤
            채점하세요.
          </p>
        </>
      )}
      {quiz.map((q, i) => (
        <QuizItem
          key={q.id}
          index={i}
          chapterId={chapterId}
          question={q}
          gated={gated}
          onExplainedChange={onExplainedChange}
        />
      ))}
    </section>
  );
}
