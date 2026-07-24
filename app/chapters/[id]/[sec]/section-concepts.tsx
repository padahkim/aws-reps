"use client";

import { useState } from "react";
import type { SessionConcept } from "@/lib/content";

/**
 * 섹션 개념 인출 카드 (이슈 #58) — 섹션 본문 바로 아래에서 "덮고 떠올리기"를 시킨다.
 * 원본 UI: content/dva-chapter-template.jsx 의 ConceptCard — 템플릿 자체 토큰·고정 폭은
 * 버리고 사이트 팔레트/레이아웃으로 다시 썼다.
 *
 * 게이팅은 카드 내부만 (#54 결정): 기본은 질문만, 탭하면 답+정교화 질문이 열린다.
 * 섹션 이동은 막지 않는다. 열림 상태는 v1 비저장 — 세션은 한 자리 완주 설계.
 * 카드가 0개면 호출부(page.tsx)가 이 컴포넌트를 아예 렌더하지 않는다.
 */

// 콘텐츠 공용 팔레트(content/chapters/ui.tsx)와 같은 값 — 앱은 content/를 lib/content.ts로만
// 소비하므로 ui.tsx를 직접 import 하지 않고 값을 복제한다 (chapter-quiz.tsx와 같은 방식).
const PAL = {
  ink: "#171E26",
  amber: "#E8830C",
  amberSoft: "#FDEBD3",
  amberText: "#9A5B06",
} as const;

const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

function ConceptCard({ index, concept }: { index: number; concept: SessionConcept }) {
  const [opened, setOpened] = useState(false);
  // why 모범답(#89 ③)은 카드 답과 별개의 2차 게이트 — 정교화 질문을 먼저 스스로 답한 뒤
  // 열어야 학습 효과가 산다. why.a 가 없으면 게이트 없이 질문만 낸다.
  const [whyAnswerOpened, setWhyAnswerOpened] = useState(false);

  return (
    <div
      style={{
        border: `1px solid ${opened ? PAL.amber : "var(--border)"}`,
        borderRadius: 14,
        margin: "0.85rem 0",
        transition: "border-color .25s",
      }}
    >
      <button
        type="button"
        onClick={() => setOpened((v) => !v)}
        aria-expanded={opened}
        style={{
          display: "block",
          width: "100%",
          textAlign: "left",
          font: "inherit",
          background: "transparent",
          color: "var(--fg)",
          border: "none",
          borderRadius: 14,
          padding: "1rem 1.1rem",
          cursor: "pointer",
        }}
      >
        {/* 배경·글자색을 쌍으로 고정한다 (ui.tsx 원칙) — amberText 단독은 다크 배경에서
            3.48:1 로 AA(4.5:1) 미달이고, 테마별로 안전한 단일 색이 없다. */}
        <span
          style={{
            display: "inline-block",
            fontFamily: MONO,
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            background: PAL.amberSoft,
            color: PAL.amberText,
            borderRadius: 99,
            padding: "2px 9px",
          }}
        >
          인출 Q{index + 1}
        </span>
        <div style={{ fontSize: "0.98rem", fontWeight: 700, lineHeight: 1.6, marginTop: 6 }}>
          {concept.q}
        </div>
        {!opened && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginTop: 10,
              fontSize: "0.82rem",
              color: "var(--muted)",
            }}
          >
            <span
              aria-hidden
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: PAL.amber,
                flexShrink: 0,
              }}
            />
            먼저 속으로 답해 보세요 — 탭하면 답이 열립니다
          </div>
        )}
      </button>

      {opened && (
        <div style={{ padding: "0 1.1rem 1.1rem" }}>
          <p style={{ margin: 0, fontSize: "0.92rem", lineHeight: 1.75 }}>{concept.a}</p>
          {concept.why && (
            <div
              style={{
                marginTop: 12,
                background: PAL.amberSoft,
                color: PAL.ink,
                borderLeft: `4px solid ${PAL.amber}`,
                borderRadius: "0 10px 10px 0",
                padding: "0.7rem 0.9rem",
              }}
            >
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: PAL.amberText,
                }}
              >
                WHY — 정교화 질문
              </div>
              <p style={{ margin: "5px 0 0", fontSize: "0.87rem", lineHeight: 1.7 }}>
                {concept.why.q}
              </p>
              {concept.why.a && (
                <>
                  <button
                    type="button"
                    onClick={() => setWhyAnswerOpened((v) => !v)}
                    aria-expanded={whyAnswerOpened}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 10,
                      font: "inherit",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      color: PAL.amberText,
                      background: "transparent",
                      border: `1px solid ${PAL.amber}`,
                      borderRadius: 99,
                      padding: "3px 11px",
                      cursor: "pointer",
                    }}
                  >
                    {whyAnswerOpened ? "모범 답 닫기" : "먼저 스스로 답한 뒤 — 모범 답 열기"}
                  </button>
                  {whyAnswerOpened && (
                    <p
                      style={{
                        margin: "0.7rem 0 0",
                        paddingTop: "0.7rem",
                        borderTop: `1px dashed ${PAL.amber}`,
                        fontSize: "0.87rem",
                        lineHeight: 1.7,
                      }}
                    >
                      {concept.why.a}
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SectionConcepts({ concepts }: { concepts: SessionConcept[] }) {
  return (
    <section
      style={{ marginTop: "2.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}
    >
      <h2 style={{ fontSize: "1.1rem", fontWeight: 900 }}>인출 연습</h2>
      <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: 4 }}>
        {concepts.length}문항 · 방금 읽은 내용을 덮고 떠올려 보세요. 떠올린 뒤에 답을 열어야
        기억에 남습니다.
      </p>
      {concepts.map((c, i) => (
        <ConceptCard key={c.id} index={i} concept={c} />
      ))}
    </section>
  );
}
