"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { C } from "./ui";

/**
 * 챕터 본문 공용 인터랙티브 컴포넌트 (#97) — useState 를 쓰므로 ui.tsx(서버 안전)와
 * 분리해 파일 단위 "use client" 경계를 만든다. sections/*.mdx 가 직접 import 한다
 * (body.tsx 클라이언트 경계 안이라 무해 — ch1-2 figs 전례).
 *
 * SimFrame·SelfQuiz 는 ch1-2 figs.tsx(#82, lambda-dva-study.jsx ChQuiz 이식)에서
 * 로직·스타일 무변경으로 이동한 것이다.
 */

const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

/** 인터랙티브 공용 프레임 — ch0-2 EvalEngine 의 잉크 헤더 카드 관례. */
export function SimFrame({ title, icon = "🎛", children }: { title: string; icon?: string; children: ReactNode }) {
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.line}`,
        borderRadius: 14,
        overflow: "hidden",
        margin: "1.25rem 0",
        color: C.ink,
      }}
    >
      <div
        style={{
          background: C.ink,
          padding: "10px 16px",
          fontFamily: MONO,
          color: "#DCE6F2",
          fontSize: "0.82rem",
          fontWeight: 700,
        }}
      >
        {icon} {title}
      </div>
      <div style={{ padding: "1rem 1.1rem" }}>{children}</div>
    </div>
  );
}

/*
 * 위젯 버튼 색 주입(#144) — 호버·포커스 전환은 app/globals.css 의 `.widget-btn` 이 맡고
 * 여기서는 색만 넘긴다. 인라인 스타일에 :hover 를 걸 수 없어 나눈 구조이며, 팔레트 단일
 * 진실은 ui.tsx 의 C 로 유지된다. 폭·여백처럼 버튼마다 다른 값은 호출부에서 합친다.
 * 배경은 반드시 --btn-bg 로 넘긴다 — 인라인 background 는 :hover 규칙을 이겨 호버를 죽인다.
 */
/** 채움 버튼 — 호버 시 한 단계 어두워진다. accent 가 이미 어두우면 hover 로 밝은 쪽을 준다. */
const fillBtn = (accent: string, hover?: string) =>
  ({
    "--btn-accent": accent,
    "--btn-bg": accent,
    "--btn-hover-bg": hover ?? `color-mix(in srgb, ${accent} 86%, #000)`,
    color: "#fff",
  }) as CSSProperties;

/** 아웃라인 버튼 — 흰 배경이라 '아직 안 누른 선택지'로 읽힌다. 호버 시 soft 톤이 배경을 채운다. */
const outlineBtn = (accent: string, soft: string) =>
  ({
    "--btn-accent": accent,
    "--btn-bg": C.card,
    "--btn-hover-bg": soft,
    color: accent,
    borderColor: accent,
  }) as CSSProperties;

/** 셀프 퀴즈 문항 — 질문을 보고 스스로 답을 생성한 뒤 정답과 대조한다. */
export interface SelfQuizItem {
  q: string;
  a: string;
}

/**
 * 셀프 퀴즈 위젯 — 원본 lambda-dva-study.jsx ChQuiz 이식(#82). 상호작용 로직은 원본 유지:
 * 답 생성 게이트(정답을 열기 전에 스스로 답하기) → 정답 공개 → 맞음/틀림 자기채점 →
 * 점수 → 다시 풀기. 원본은 챕터 말미 10문항 일괄 덱이었으나 여기서는 해당 설명이 있는
 * 섹션 하단의 1~3문항 소형 덱으로 분산 배치(#82 사용자 결정) — 소형 덱에서 어색한 점수
 * UI만 조정: 결과 화면은 %(80% 기준) 대신 맞은 개수, 1문항 덱은 진행 헤더·진행바 생략.
 */
export function SelfQuiz({ items }: { items: SelfQuizItem[] }) {
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState({ o: 0, x: 0 });
  const [done, setDone] = useState(false);

  const grade = (ok: boolean) => {
    setScore((s) => ({ o: s.o + (ok ? 1 : 0), x: s.x + (ok ? 0 : 1) }));
    if (i + 1 >= items.length) setDone(true);
    else {
      setI(i + 1);
      setOpen(false);
    }
  };
  const reset = () => {
    setI(0);
    setOpen(false);
    setScore({ o: 0, x: 0 });
    setDone(false);
  };

  const multi = items.length > 1;

  if (done) {
    const allCorrect = score.o === items.length;
    return (
      <SimFrame icon="✍️" title="셀프 퀴즈 — 결과">
        <div style={{ textAlign: "center", padding: "0.5rem 0" }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: "2.2rem",
              fontWeight: 700,
              color: allCorrect ? C.teal : C.amberText,
            }}
          >
            {score.o} / {items.length}
          </div>
          <div style={{ fontSize: "0.85rem", color: C.inkSoft, margin: "4px 0 12px" }}>
            맞음 {score.o} · 틀림 {score.x}
          </div>
          <p style={{ maxWidth: 480, margin: "0 auto 14px", fontSize: "0.9rem", lineHeight: 1.7, color: C.inkSoft }}>
            {allCorrect
              ? "훌륭합니다. 이제 간격을 두고 반복하세요 — 내일, 3일 후, 일주일 후에 이 퀴즈만 다시 풀면 장기기억으로 굳어집니다(간격반복)."
              : "틀린 문항은 위 본문·도식을 다시 보고, 몇 시간 뒤 퀴즈만 재시도하세요. 틀린 직후의 재학습이 가장 효율이 높습니다."}
          </p>
          <button
            type="button"
            onClick={reset}
            className="widget-btn"
            style={{ ...fillBtn(C.ink, C.inkSoft), padding: "10px 20px" }}
          >
            다시 풀기
          </button>
        </div>
      </SimFrame>
    );
  }

  const cur = items[i];
  return (
    <SimFrame icon="✍️" title="셀프 퀴즈 — 답을 열기 전에 소리 내어/글로 답하기">
      <p style={{ fontSize: "0.82rem", color: C.inkSoft, margin: "0 0 12px", lineHeight: 1.6 }}>
        보기를 고르는 게 아니라 스스로 답을 <b style={{ color: C.ink }}>생성</b>하는 것이 인출연습의
        핵심입니다. 답을 떠올린 뒤에만 정답을 여세요.
      </p>

      {multi && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 10,
              fontSize: "0.78rem",
              color: C.inkSoft,
            }}
          >
            <span style={{ fontFamily: MONO }}>
              Q {i + 1} / {items.length}
            </span>
            <span>
              맞음 <b style={{ color: C.teal }}>{score.o}</b> · 틀림{" "}
              <b style={{ color: C.red }}>{score.x}</b>
            </span>
          </div>
          <div style={{ height: 4, background: C.line, borderRadius: 99, marginBottom: 14 }}>
            <div
              style={{
                height: 4,
                width: `${(i / items.length) * 100}%`,
                background: C.amber,
                borderRadius: 99,
                transition: "width .3s",
              }}
            />
          </div>
        </>
      )}

      <div style={{ fontSize: "0.95rem", fontWeight: 700, lineHeight: 1.65, marginBottom: 14, color: C.ink }}>
        {cur.q}
      </div>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="widget-btn"
          style={{ ...fillBtn(C.amber), padding: "10px 18px" }}
        >
          답 확인하기
        </button>
      ) : (
        <div>
          <div
            style={{
              background: C.tealSoft,
              borderRadius: 10,
              padding: "12px 14px",
              fontSize: "0.88rem",
              lineHeight: 1.7,
              marginBottom: 12,
              color: C.ink,
            }}
          >
            {cur.a}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {/* 자기채점 두 버튼은 같은 무게의 아웃라인이다 — 한쪽만 채우면 아직 누르지 않은
                선택지가 이미 선택된 것처럼 읽힌다(#144). 색은 정답/오답 의미로만 남긴다. */}
            <button
              type="button"
              onClick={() => grade(true)}
              className="widget-btn"
              style={{ ...outlineBtn(C.teal, C.tealSoft), flex: 1, padding: "10px" }}
            >
              맞혔다 ✓
            </button>
            <button
              type="button"
              onClick={() => grade(false)}
              className="widget-btn"
              style={{ ...outlineBtn(C.red, C.redSoft), flex: 1, padding: "10px" }}
            >
              틀렸다 ✗
            </button>
          </div>
        </div>
      )}
    </SimFrame>
  );
}
