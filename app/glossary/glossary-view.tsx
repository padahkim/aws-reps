"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
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
  teal: "#0E7C7B",
  tealSoft: "#DCF0EF",
  red: "#B9432C",
  redSoft: "#F8E4DF",
  amberText: "#9A5B06",
  ink: "#171E26",
} as const;

const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

/** soft 배경 위 accent 글자는 4.24~4.40:1 로 4.5:1에 못 미친다 — 85%로 낮춰 5.5:1대
 *  (content/chapters/interactive.tsx outlineBtn 과 같은 처리, PR #147 Codex 지적의 재적용). */
const onSoft = (accent: string) => `color-mix(in srgb, ${accent} 85%, #000)`;

/** 페이지 배경 위 상태 강조색 — 다크 배경(#111113)에서 원색 teal/red 는 3.5~3.8:1 로 부족해
 *  밝은 변형으로 갈아탄다 (PR #242 라운드 2 지적). `light-dark()` 는 globals.css 의
 *  `html { color-scheme: light dark }` 덕에 그대로 동작한다 (soft 배경 위 글자는 배경이
 *  고정 밝음이라 해당 없음 — onSoft 가 맡는다). 다크 변형은 6:1대. */
const okFg = `light-dark(${PAL.teal}, #17A2A0)`;
const badFg = `light-dark(${PAL.red}, #E8735A)`;

/**
 * soft 채움 아웃라인 버튼 — `.widget-btn`(globals.css #144)의 CSS 변수 계약을 채운다.
 * 변수를 빠뜨리면 호버가 죽고 포커스 링(`--btn-ring`)이 안 그려진다 (PR #242 Codex 지적).
 * 자기채점 쌍은 같은 무게의 아웃라인 — 한쪽만 채우면 선택된 것처럼 읽힌다 (#144 규칙).
 */
const softBtn = (accent: string, soft: string) =>
  ({
    "--btn-bg": soft,
    "--btn-fg": onSoft(accent),
    "--btn-hover-bg": `color-mix(in srgb, ${soft} 90%, #000)`,
    "--btn-ring": accent,
    borderColor: accent,
  }) as CSSProperties;

/** 채움 버튼 — interactive.tsx fillBtn 과 같은 변수 채움 (링은 한 단계 어둡게, PR #147). */
const fillBtn = (accent: string) =>
  ({
    "--btn-bg": accent,
    "--btn-fg": "#fff",
    "--btn-hover-bg": `color-mix(in srgb, ${accent} 86%, #000)`,
    "--btn-ring": `color-mix(in srgb, ${accent} 70%, #000)`,
  }) as CSSProperties;

/** 중립 동작(종료·목록으로) — 테마 변수로 그린다: 고정 ink 는 다크 배경(#111113)에서
 *  사실상 안 보인다 (PR #242 Codex 지적). review-board ScopeButton 과 같은 문법. */
const neutralBtnStyle: CSSProperties = {
  font: "inherit",
  fontSize: "0.83rem",
  fontWeight: 700,
  padding: "0.35rem 0.9rem",
  borderRadius: 99,
  border: "1px solid var(--border)",
  background: "transparent",
  color: "var(--fg)",
  cursor: "pointer",
};

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
        color: onSoft(known ? PAL.teal : PAL.red),
      }}
    >
      {known ? "안다 ✓" : "모른다 ✗"}
    </span>
  );
}

export function GlossaryView({ terms }: { terms: GlossaryTerm[] }) {
  const { marks, refresh } = useGlossaryMarks();

  // 이번에 돌 덱 — null 이면 목록 모드. 시작 시점에 섞어 얼린다 (파일 머리 주석).
  const [deck, setDeck] = useState<GlossaryTerm[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const [tally, setTally] = useState({ known: 0, unknown: 0 });

  /**
   * 카드 전환마다 포커스를 옮긴다 (PR #242 Codex 지적) — 뒤집기·채점이 포커스된 버튼을
   * 언마운트하므로, 그대로 두면 포커스가 body 로 떨어져 키보드 사용자는 카드마다 페이지
   * 처음부터 탭해 와야 한다. 뜻이 열리면 정답 영역으로, 다음 카드로 넘어가면 "뜻 확인하기"로,
   * 다 돌면 결과 영역으로 보낸다.
   */
  const revealRef = useRef<HTMLButtonElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (deck === null) return;
    if (idx >= deck.length) doneRef.current?.focus();
    else if (open) answerRef.current?.focus();
    else revealRef.current?.focus();
  }, [deck, idx, open]);

  const startDrill = () => {
    setDeck(shuffled(terms));
    setIdx(0);
    setOpen(false);
    setTally({ known: 0, unknown: 0 });
  };
  const exitDrill = () => setDeck(null);

  // 요약·배지는 **현재 콘텐츠에 실재하는 용어**만 센다 (PR #242 Codex 지적) — 콘텐츠 개정으로
  // 사라진 id 의 기록이 기기에 남아 있으면, 전체 키를 세는 요약이 목록보다 큰 수를 말하게 된다.
  const counted = terms.filter((t) => marks[t.id] !== undefined);
  const knownCount = counted.filter((t) => marks[t.id].known).length;
  const unknownCount = counted.length - knownCount;

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
            style={{ ...neutralBtnStyle, marginLeft: "auto" }}
          >
            암기 종료
          </button>
        </div>

        {done ? (
          <div
            ref={doneRef}
            tabIndex={-1}
            style={{
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "2rem 1rem",
              marginTop: "1rem",
              textAlign: "center",
              outline: "none",
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: "2rem", fontWeight: 700, color: okFg }}>
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
                style={{ ...softBtn(PAL.teal, PAL.tealSoft), padding: "10px 18px" }}
              >
                다시 섞어서 한 번 더
              </button>
              <button
                type="button"
                onClick={exitDrill}
                style={{ ...neutralBtnStyle, padding: "10px 18px", borderRadius: 10 }}
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
                  안다 <b style={{ color: okFg }}>{tally.known}</b> · 모른다{" "}
                  <b style={{ color: badFg }}>{tally.unknown}</b>
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
                  ref={revealRef}
                  type="button"
                  onClick={() => setOpen(true)}
                  className="widget-btn"
                  style={{ ...fillBtn(PAL.amberText), padding: "10px 18px" }}
                >
                  뜻 확인하기
                </button>
              ) : (
                <div ref={answerRef} tabIndex={-1} style={{ outline: "none" }}>
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
                      <div style={{ fontSize: "0.8rem", color: onSoft(PAL.teal), fontWeight: 700, marginBottom: 4 }}>
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
                      style={{ ...softBtn(PAL.teal, PAL.tealSoft), flex: 1, padding: "10px" }}
                    >
                      안다 ✓
                    </button>
                    <button
                      type="button"
                      onClick={() => grade(false)}
                      className="widget-btn"
                      style={{ ...softBtn(PAL.red, PAL.redSoft), flex: 1, padding: "10px" }}
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
          {counted.length > 0 && (
            <>
              {" "}
              지금까지 <b style={{ color: okFg }}>안다 {knownCount}</b> ·{" "}
              <b style={{ color: badFg }}>모른다 {unknownCount}</b>.
            </>
          )}
        </p>
        <button
          type="button"
          onClick={startDrill}
          className="widget-btn"
          style={{ ...softBtn(PAL.teal, PAL.tealSoft), padding: "0.5rem 1.1rem" }}
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
