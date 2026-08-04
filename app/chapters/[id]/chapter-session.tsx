"use client";

import { useEffect, useState } from "react";
import type { MixedPoolItem, Question, SessionDiagram } from "@/lib/content";
import ChapterQuiz from "./chapter-quiz";

/**
 * 세션 마무리 페이지 (#59) — session 이 있는 챕터의 마지막 페이지. 기존 챕터 퀴즈 페이지를
 * 대체한다 (라우팅은 [sec]/page.tsx, 규칙은 lib/content.ts sectionCount).
 * 원본 UI: content/dva-chapter-template.jsx (ProgressRail·FlowDiagram·MixedCard) — 템플릿
 * 자체 토큰·고정 폭은 버리고 사이트 팔레트/레이아웃으로 다시 썼다 (section-concepts.tsx 전례).
 *
 * 스테이션 = 도식 재현(이중부호화) → 실전(자기설명 게이트) → 혼합 복습(교차학습).
 * 데이터가 있는 스테이션만 렌더한다 — 도식 없는 챕터(ch0-1류)·풀이 빈 챕터에서 해당
 * 스테이션과 레일 항목이 함께 사라진다. 개념 카드는 여기 없다 — 각 섹션 페이지 하단이
 * 제자리다 (#58).
 *
 * 세션 화면 상태(도식 공개·혼합 카드 열림·진행률 레일)는 전부 비저장(useState) — 세션은
 * 한 자리 완주 설계다 (#54). 예외는 실전 스테이션의 **채점 결과**로, 이건 세션 화면이 아니라
 * 학습 진도라서 `dva.progress.v1` 에 남는다 (#66 — 기록은 <ChapterQuiz> 안에서 한다).
 */

// 콘텐츠 공용 팔레트(content/chapters/ui.tsx)와 같은 값 — 앱은 content/를 lib/content.ts로만
// 소비하므로 ui.tsx를 직접 import 하지 않고 값을 복제한다 (chapter-quiz.tsx와 같은 방식).
const PAL = {
  ink: "#171E26",
  teal: "#0E7C7B",
  tealSoft: "#DCF0EF",
  amber: "#E8830C",
  amberSoft: "#FDEBD3",
  amberText: "#9A5B06",
} as const;

const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

/** 혼합 스테이션 샘플 크기 — 풀이 이보다 작으면 전부 낸다. */
const MIXED_SAMPLE = 8;

/* ── 진행률 레일 — 존재하는 스테이션만 (#54 결정) ─────────────────────── */

interface Station {
  label: string;
  done: number;
  total: number;
  // 점 채움용 진행률 오버라이드 — 없으면 done/total. 도식처럼 "표시 단위(도식 1장)"와
  // "진행 단위(노드 4개)"가 다른 스테이션이 숫자는 1/1로 세면서 점은 노드 비율로 차게 한다.
  frac?: number;
}

function ProgressRail({ stations }: { stations: Station[] }) {
  return (
    <div style={{ margin: "1.4rem 0 0.4rem" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {stations.map((s, i) => {
          const frac = s.frac ?? (s.total > 0 ? s.done / s.total : 0);
          return (
            <div
              key={s.label}
              style={{
                display: "flex",
                alignItems: "center",
                flex: i === 0 ? "0 0 auto" : "1 1 0",
              }}
            >
              {i > 0 && (
                <div
                  style={{
                    height: 3,
                    flex: 1,
                    background: frac > 0 ? "var(--accent)" : "var(--border)",
                    transition: "background .3s",
                  }}
                />
              )}
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  border: `3px solid ${frac >= 1 ? "var(--accent)" : "var(--border)"}`,
                  background: frac >= 1 ? "var(--accent)" : frac > 0 ? PAL.amberSoft : "transparent",
                  transition: "all .3s",
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 7 }}>
        {stations.map((s) => (
          <span
            key={s.label}
            style={{
              fontFamily: MONO,
              fontSize: "0.72rem",
              fontVariantNumeric: "tabular-nums",
              color: s.total > 0 && s.done >= s.total ? "var(--accent)" : "var(--muted)",
            }}
          >
            {s.label} {s.done}/{s.total}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── 스테이션 공통 헤더 ────────────────────────────────────────────────── */

function StationHeader({ num, title, sub }: { num: number; title: string; sub: string }) {
  return (
    <>
      <h2
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          fontSize: "1.1rem",
          fontWeight: 900,
          margin: 0,
        }}
      >
        <span
          aria-hidden
          style={{
            width: 26,
            height: 26,
            minWidth: 26,
            borderRadius: "50%",
            background: "var(--accent)",
            color: "#fff",
            fontFamily: MONO,
            fontSize: "0.85rem",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {num}
        </span>
        {title}
      </h2>
      <p style={{ color: "var(--muted)", fontSize: "0.85rem", margin: "0.35rem 0 0" }}>{sub}</p>
    </>
  );
}

/* ── ① 도식 재현 — 역할만 보고 서비스명을 인출한다 (선형 체인) ──────────── */

function DiagramStation({
  num,
  diagram,
  revealed,
  onToggle,
  onSetAll,
}: {
  num: number;
  diagram: SessionDiagram;
  revealed: Set<number>;
  onToggle: (i: number) => void;
  onSetAll: (open: boolean) => void;
}) {
  const NODE_H = 58;
  const GAP = 42;
  const W = 340;
  const nodes = diagram.nodes;
  const totalH = 16 + nodes.length * NODE_H + (nodes.length - 1) * GAP + 16;
  const allOpen = nodes.every((_, i) => revealed.has(i));

  return (
    <section style={{ marginTop: "2.2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
      <StationHeader num={num} title="도식 재현" sub={diagram.prompt} />
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: "0.6rem 0.4rem 0.2rem",
          marginTop: "0.9rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 0.5rem 0.25rem" }}>
          <button
            type="button"
            onClick={() => onSetAll(!allOpen)}
            style={{
              font: "inherit",
              fontFamily: MONO,
              fontSize: "0.72rem",
              color: "var(--muted)",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: 99,
              padding: "0.3rem 0.75rem",
              cursor: "pointer",
            }}
          >
            {allOpen ? "다시 숨기기 ↺" : "모두 공개"}
          </button>
        </div>
        <svg
          viewBox={`0 0 ${W} ${totalH}`}
          style={{ width: "100%", maxWidth: 420, display: "block", margin: "0 auto" }}
        >
          <defs>
            <marker
              id="session-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={PAL.amber} />
            </marker>
          </defs>
          {nodes.map((node, i) => {
            const y = 16 + i * (NODE_H + GAP);
            const open = revealed.has(i);
            return (
              <g key={i}>
                {i > 0 && (
                  <>
                    <line
                      x1={W / 2}
                      y1={y - GAP + 4}
                      x2={W / 2}
                      y2={y - 6}
                      stroke={PAL.amber}
                      strokeWidth="2"
                      markerEnd="url(#session-arrow)"
                    />
                    <text
                      x={W / 2 + 12}
                      y={y - GAP / 2 + 3}
                      fontSize="10"
                      fontFamily={MONO}
                      fill="var(--muted)"
                    >
                      {diagram.edges[i - 1]}
                    </text>
                  </>
                )}
                {/* SVG 안이라 native button 을 못 쓴다 — tabIndex + Enter/Space 로 버튼 시맨틱을
                    채운다 (PR #184 Codex P2: "모두 공개"는 노드별 인출 과제의 대체가 아니다) */}
                <g
                  onClick={() => onToggle(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onToggle(i);
                    }
                  }}
                  tabIndex={0}
                  style={{ cursor: "pointer" }}
                  role="button"
                  aria-expanded={open}
                  aria-label={`${node.role} — ${open ? `답: ${node.name}` : "탭해서 이름 인출"}`}
                >
                  <rect
                    x={10}
                    y={y}
                    width={W - 20}
                    height={NODE_H}
                    rx={12}
                    fill={open ? PAL.amberSoft : "transparent"}
                    stroke={open ? PAL.amber : "var(--border)"}
                    strokeWidth="1.5"
                  />
                  <text x={24} y={y + 22} fontSize="11" fill={open ? PAL.amberText : "var(--muted)"}>
                    {node.role}
                  </text>
                  {open ? (
                    <text
                      x={24}
                      y={y + 44}
                      fontSize="15"
                      fontWeight="700"
                      fill={PAL.amberText}
                      fontFamily={MONO}
                    >
                      {node.name}
                    </text>
                  ) : (
                    <text x={24} y={y + 44} fontSize="12" fill="var(--accent)" fontFamily={MONO}>
                      ? 탭해서 이름 인출
                    </text>
                  )}
                </g>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}

/* ── ③ 혼합 복습 — 상황만 보고 서비스를 고른다 (교차학습) ──────────────── */

function MixedCard({
  item,
  opened,
  onOpen,
}: {
  item: MixedPoolItem;
  opened: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-expanded={opened}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        font: "inherit",
        background: "transparent",
        color: "var(--fg)",
        border: `1px solid ${opened ? PAL.teal : "var(--border)"}`,
        borderRadius: 14,
        padding: "0.95rem 1.05rem",
        margin: "0.7rem 0",
        cursor: "pointer",
        transition: "border-color .25s",
      }}
    >
      <div style={{ fontSize: "0.93rem", fontWeight: 700, lineHeight: 1.6 }}>
        {item.scenario} <span style={{ color: "var(--muted)", fontWeight: 400 }}>— 어떤 것?</span>
      </div>
      {!opened ? (
        <div style={{ marginTop: 8, fontSize: "0.8rem", color: "var(--muted)" }}>
          답을 정한 뒤 탭
        </div>
      ) : (
        <div style={{ marginTop: 10 }}>
          <div
            style={{
              display: "inline-block",
              fontFamily: MONO,
              fontSize: "0.92rem",
              fontWeight: 800,
              background: PAL.tealSoft,
              color: PAL.teal,
              borderRadius: 8,
              padding: "2px 10px",
              marginBottom: 6,
            }}
          >
            {item.service}
          </div>
          <p style={{ fontSize: "0.85rem", lineHeight: 1.65, margin: "0 0 6px" }}>{item.why}</p>
          <p style={{ fontSize: "0.82rem", lineHeight: 1.6, color: "var(--muted)", margin: 0 }}>
            구분 포인트 · {item.contrast}
          </p>
        </div>
      )}
    </button>
  );
}

/* ── 메인 ─────────────────────────────────────────────────────────────── */

export default function ChapterSession({
  chapterId,
  diagram,
  quiz,
  finalKeys = [],
  pool,
}: {
  chapterId: string;              // 실전 스테이션의 채점 기록용 (#66) — <ChapterQuiz> 로 그대로 넘긴다
  diagram?: SessionDiagram;
  quiz: Question[];
  finalKeys?: string[];           // 완료 판정의 finalQ 분모 (#224) — 역시 그대로 넘긴다
  pool: MixedPoolItem[];
}) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [explainedIds, setExplainedIds] = useState<Set<string>>(new Set());
  const [openedMixed, setOpenedMixed] = useState<Set<string>>(new Set());

  // 혼합 풀 셔플·샘플은 클라이언트에서만 (SSG/hydration 결정성 — #54 결정).
  // 첫 렌더(서버와 동일)는 풀 순서 그대로의 앞 K개, 마운트 후 한 번 섞는다.
  const [mixedItems, setMixedItems] = useState<MixedPoolItem[]>(() => pool.slice(0, MIXED_SAMPLE));
  useEffect(() => {
    const arr = [...pool];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setMixedItems(arr.slice(0, MIXED_SAMPLE));
  }, [pool]);

  const hasDiagram = diagram !== undefined;
  const hasQuiz = quiz.length > 0;
  const hasMixed = pool.length > 0;

  // 도식은 한 장이므로 숫자는 1/1로 센다 (2026-07-28 사용자 피드백 — "도식 4/4"는 도식이
  // 4개인 것처럼 읽힌다). 노드 단위 진행감은 frac 으로 점 채움에만 반영한다.
  const stations: Station[] = [
    ...(hasDiagram
      ? [
          {
            label: "도식",
            done: revealed.size === diagram.nodes.length ? 1 : 0,
            total: 1,
            frac: revealed.size / diagram.nodes.length,
          },
        ]
      : []),
    ...(hasQuiz ? [{ label: "실전", done: explainedIds.size, total: quiz.length }] : []),
    ...(hasMixed ? [{ label: "혼합", done: openedMixed.size, total: mixedItems.length }] : []),
  ];
  // 스테이션 번호는 존재하는 것만 이어 붙인다 (도식 없는 챕터에서 실전이 1번)
  const diagramNum = 1;
  const quizNum = (hasDiagram ? 1 : 0) + 1;
  const mixedNum = (hasDiagram ? 1 : 0) + (hasQuiz ? 1 : 0) + 1;

  // 안내 문구도 존재하는 스테이션만 말한다 — 없는 스테이션을 예고하면 빈 약속이 된다
  const stationIntro = [
    hasDiagram ? "도식 재현" : null,
    hasQuiz ? "실전 문제" : null,
    hasMixed ? "혼합 복습" : null,
  ]
    .filter(Boolean)
    .join(" → ");

  return (
    <section style={{ marginTop: "1rem" }}>
      <h1 style={{ fontSize: "1.35rem", fontWeight: 900, margin: 0 }}>마무리 세션</h1>
      <p style={{ color: "var(--muted)", fontSize: "0.88rem", margin: "0.4rem 0 0", lineHeight: 1.7 }}>
        본문을 덮고 이 챕터를 꺼내 봅니다.{" "}
        {stations.length > 1
          ? `${stationIntro} 순서로 돌면 이 챕터가 한 번에 마무리됩니다.`
          : `${stationIntro}로 이 챕터를 마무리합니다.`}
      </p>
      {stations.length > 1 && <ProgressRail stations={stations} />}

      {hasDiagram && (
        <DiagramStation
          num={diagramNum}
          diagram={diagram}
          revealed={revealed}
          onToggle={(i) =>
            setRevealed((prev) => {
              const next = new Set(prev);
              if (next.has(i)) next.delete(i);
              else next.add(i);
              return next;
            })
          }
          onSetAll={(open) =>
            setRevealed(open ? new Set(diagram.nodes.map((_, i) => i)) : new Set())
          }
        />
      )}

      {hasQuiz && (
        <ChapterQuiz
          chapterId={chapterId}
          quiz={quiz}
          finalKeys={finalKeys}
          gated
          header={
            <StationHeader
              num={quizNum}
              title="실전"
              sub={`${quiz.length}문항 · 답을 고르면 정오만 먼저 나옵니다 — 오답 선택지를 스스로 설명한 뒤 해설을 여세요. 문항 간 이동은 자유입니다.`}
            />
          }
          onExplainedChange={(id, explained) =>
            setExplainedIds((prev) => {
              const next = new Set(prev);
              if (explained) next.add(id);
              else next.delete(id);
              return next;
            })
          }
        />
      )}

      {hasMixed && (
        <section
          style={{ marginTop: "2.2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}
        >
          <StationHeader
            num={mixedNum}
            title="혼합 복습"
            sub={`${mixedItems.length}장 · 지금까지 배운 것들 사이에서 헷갈리는 이웃을 상황으로 구분합니다. 답을 정한 뒤 여세요.`}
          />
          <div style={{ marginTop: "0.5rem" }}>
            {mixedItems.map((item) => (
              <MixedCard
                key={item.key}
                item={item}
                opened={openedMixed.has(item.key)}
                onOpen={() =>
                  setOpenedMixed((prev) => {
                    const next = new Set(prev);
                    if (next.has(item.key)) next.delete(item.key);
                    else next.add(item.key);
                    return next;
                  })
                }
              />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
