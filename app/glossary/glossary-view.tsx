"use client";

import Link from "next/link";
import { useState } from "react";
import type { GlossaryTerm } from "@/lib/content";
import { markGlossaryTerm, useGlossaryMarks } from "@/lib/progress/glossary";

/**
 * 용어집 화면 (#192 목록 + #210 암기 모드). 사전 목록이 기본이고, 암기 모드가 켜지면
 * 목록을 통째로 대체한다 (review-board 의 출제 모드와 같은 구조 — 두 뷰를 같이 그리면
 * 같은 항목이 화면에 두 번 나온다).
 *
 * 암기 카드의 상호작용은 기존 인출 카드 관례(SelfQuiz, content/chapters/interactive.tsx)를
 * 따른다: 답 생성 게이트(뜻을 열기 전에 스스로 떠올리기) → 뜻 공개 → 안다/모른다 자기채점.
 * 채점은 `dva.glossary.v1` 에 영속되고(#210), 목록의 항목 배지가 그 상태를 보여준다.
 *
 * 덱은 시작 시점에 섞어 얼린다 — 렌더마다 섞으면 푸는 사이에 순서가 흔들린다. 여기서 섞어도
 * hydration 이 안 걸리는 근거는 review-board 규칙 2와 같다: 카드 화면은 사용자가 마운트 후
 * 버튼을 눌러야 나오므로 비교할 선렌더 HTML 이 없다.
 */

// 콘텐츠 공용 팔레트(content/chapters/ui.tsx)와 같은 값 — 앱은 content/를 lib/content.ts로만
// 소비하므로 ui.tsx를 직접 import 하지 않고 값을 복제한다 (review-board.tsx와 같은 방식).
const PAL = {
  ink: "#171E26",
  teal: "#0E7C7B",
  tealSoft: "#DCF0EF",
  red: "#B9432C",
  redSoft: "#F8E4DF",
  amberText: "#9A5B06",
} as const;

const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

function shuffled<T>(list: T[]): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** 목록 항목 옆 상태 배지 — 마지막 셀프 채점. 체크한 적 없으면 안 그린다. */
function MarkBadge({ known }: { known: boolean }) {
  return (
    <span
      style={{
        fontSize: "0.72rem",
        fontWeight: 700,
        whiteSpace: "nowrap",
        verticalAlign: "middle",
        marginLeft: "0.5rem",
        borderRadius: 99,
        padding: "2px 10px",
        background: known ? PAL.tealSoft : PAL.redSoft,
        color: known ? PAL.teal : PAL.red,
      }}
    >
      {known ? "안다 ✓" : "모른다 ✗"}
    </span>
  );
}

/** 자기채점 쌍과 같은 등가 아웃라인 버튼 (#144 규칙 — 한쪽만 채우면 선택된 것처럼 읽힌다). */
function outlineBtn(accent: string, soft: string) {
  return {
    font: "inherit",
    fontSize: "0.9rem",
    fontWeight: 700,
    border: `1.5px solid ${accent}`,
    borderRadius: 10,
    background: soft,
    color: accent,
    cursor: "pointer",
  } as const;
}

export function GlossaryView({ terms }: { terms: GlossaryTerm[] }) {
  const { marks, refresh } = useGlossaryMarks();

  // 이번에 돌 덱 — null 이면 목록 모드. 시작 시점에 섞어 얼린다 (파일 머리 주석).
  const [deck, setDeck] = useState<GlossaryTerm[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const [tally, setTally] = useState({ known: 0, unknown: 0 });

  const startDrill = () => {
    setDeck(shuffled(terms));
    setIdx(0);
    setOpen(false);
    setTally({ known: 0, unknown: 0 });
  };
  const exitDrill = () => setDeck(null);

  const knownCount = Object.values(marks).filter((m) => m.known).length;
  const unknownCount = Object.keys(marks).length - knownCount;

  // ── 암기 모드 ──────────────────────────────────────────────────────────
  if (deck !== null) {
    const done = idx >= deck.length;
    const cur = done ? null : deck[idx];

    const grade = (known: boolean) => {
      if (!cur) return;
      markGlossaryTerm(cur.id, known, new Date().toISOString());
      refresh();
      setTally((t) => ({
        known: t.known + (known ? 1 : 0),
        unknown: t.unknown + (known ? 0 : 1),
      }));
      setIdx(idx + 1);
      setOpen(false);
    };

    return (
      <section>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "baseline", flexWrap: "wrap" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 900 }}>암기 모드 · {deck.length}개</h2>
          <button
            type="button"
            onClick={exitDrill}
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
            암기 종료
          </button>
        </div>

        {done ? (
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "2rem 1rem",
              marginTop: "1rem",
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: "2rem", fontWeight: 700, color: PAL.teal }}>
              {tally.known} / {deck.length}
            </div>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: "0.4rem 0 1rem" }}>
              안다 {tally.known} · 모른다 {tally.unknown} — 체크는 저장됐고, 목록에서 항목별로
              보입니다.
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={startDrill}
                className="widget-btn"
                style={{ ...outlineBtn(PAL.teal, PAL.tealSoft), padding: "10px 18px" }}
              >
                다시 섞어서 한 번 더
              </button>
              <button
                type="button"
                onClick={exitDrill}
                className="widget-btn"
                style={{ ...outlineBtn(PAL.ink, "transparent"), padding: "10px 18px" }}
              >
                목록으로
              </button>
            </div>
          </div>
        ) : (
          cur && (
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "1.2rem 1.1rem",
                marginTop: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 10,
                  fontSize: "0.78rem",
                  color: "var(--muted)",
                }}
              >
                <span style={{ fontFamily: MONO }}>
                  {idx + 1} / {deck.length}
                </span>
                <span>
                  안다 <b style={{ color: PAL.teal }}>{tally.known}</b> · 모른다{" "}
                  <b style={{ color: PAL.red }}>{tally.unknown}</b>
                </span>
              </div>

              <p style={{ fontSize: "0.82rem", color: "var(--muted)", margin: "0 0 12px", lineHeight: 1.6 }}>
                뜻을 스스로 떠올린 뒤에만 여세요 — 보고 끄덕이는 건 인출연습이 아닙니다.
              </p>

              {/* 카드 앞면은 용어만 — full(원어)은 뜻을 절반쯤 누설하므로 뒷면에 둔다 */}
              <div style={{ fontSize: "1.25rem", fontWeight: 700, lineHeight: 1.5, marginBottom: 14 }}>
                {cur.term}
              </div>

              {!open ? (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="widget-btn"
                  style={{
                    font: "inherit",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    border: "none",
                    borderRadius: 10,
                    background: PAL.amberText,
                    color: "#fff",
                    cursor: "pointer",
                    padding: "10px 18px",
                  }}
                >
                  뜻 확인하기
                </button>
              ) : (
                <div>
                  <div
                    style={{
                      background: PAL.tealSoft,
                      borderRadius: 10,
                      padding: "12px 14px",
                      fontSize: "0.9rem",
                      lineHeight: 1.7,
                      marginBottom: 12,
                      color: PAL.ink,
                    }}
                  >
                    {cur.full && (
                      <div style={{ fontSize: "0.8rem", color: PAL.teal, fontWeight: 700, marginBottom: 4 }}>
                        {cur.full}
                      </div>
                    )}
                    {cur.short}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => grade(true)}
                      className="widget-btn"
                      style={{ ...outlineBtn(PAL.teal, PAL.tealSoft), flex: 1, padding: "10px" }}
                    >
                      안다 ✓
                    </button>
                    <button
                      type="button"
                      onClick={() => grade(false)}
                      className="widget-btn"
                      style={{ ...outlineBtn(PAL.red, PAL.redSoft), flex: 1, padding: "10px" }}
                    >
                      모른다 ✗
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </section>
    );
  }

  // ── 목록 모드 (#192) ──────────────────────────────────────────────────
  return (
    <>
      {/* 암기 모드 진입 (#210) — review-board 출제 모드 카드와 같은 자리 문법 */}
      <section
        style={{
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "0.9rem 1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ fontWeight: 900, fontSize: "0.95rem" }}>암기 모드 — 용어 인출 카드</div>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", margin: "0.3rem 0 0.7rem" }}>
          용어를 보고 뜻을 떠올린 뒤 뒤집어 확인합니다. 안다/모른다 체크는 이 기기에
          저장되고, 아래 목록에 항목별로 표시됩니다.
          {Object.keys(marks).length > 0 && (
            <>
              {" "}
              지금까지 <b style={{ color: PAL.teal }}>안다 {knownCount}</b> ·{" "}
              <b style={{ color: PAL.red }}>모른다 {unknownCount}</b>.
            </>
          )}
        </p>
        <button
          type="button"
          onClick={startDrill}
          className="widget-btn"
          style={{ ...outlineBtn(PAL.teal, PAL.tealSoft), padding: "0.5rem 1.1rem" }}
        >
          전체 {terms.length}개 무작위로 시작
        </button>
      </section>

      <ul style={{ listStyle: "none", display: "grid", gap: "0.6rem" }}>
        {terms.map((t) => (
          <li
            key={t.id}
            id={t.id}
            className="glossary-item"
            style={{ padding: "0.85rem 1rem" }}
          >
            <h2 style={{ fontSize: "1rem", lineHeight: 1.4 }}>
              {/* 자기 앵커 링크 — 딥링크(/glossary#id)를 복사해 가는 통로 */}
              <a href={`#${t.id}`} style={{ color: "inherit" }}>
                {t.term}
              </a>
              {t.full && (
                <span
                  style={{
                    marginLeft: "0.45rem",
                    color: "var(--muted)",
                    fontWeight: 400,
                    fontSize: "0.85rem",
                  }}
                >
                  {t.full}
                </span>
              )}
              {/* 암기 체크 상태 (#210) — 마운트 후 localStorage 에서 채워진다 */}
              {marks[t.id] && <MarkBadge known={marks[t.id].known} />}
            </h2>
            <p style={{ marginTop: "0.3rem" }}>{t.short}</p>
            {/* detail 은 /glossary 전용, "\n\n" = 문단 구분 (schema.ts GlossaryTerm) */}
            {t.detail?.split("\n\n").map((para, i) => (
              <p
                key={i}
                style={{ marginTop: "0.5rem", fontSize: "0.92rem", color: "var(--muted)" }}
              >
                {para}
              </p>
            ))}
            {/* chapterId 실존은 검증기가 빌드에서 보장한다 (GLOSSARY 검증) */}
            {t.chapterId && (
              <p style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
                <Link href={`/chapters/${t.chapterId}`}>
                  {t.chapterId} 챕터에서 자세히 →
                </Link>
              </p>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
