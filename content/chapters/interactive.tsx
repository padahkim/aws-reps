"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { recordSelfQuizAttempt } from "@/lib/progress/attempt";
import { glossary } from "../glossary";
import { C, MONO } from "./ui";

/**
 * 챕터 본문 공용 인터랙티브 컴포넌트 (#97) — useState 를 쓰므로 ui.tsx(서버 안전)와
 * 분리해 파일 단위 "use client" 경계를 만든다. sections/*.mdx 가 직접 import 한다
 * (body.tsx 클라이언트 경계 안이라 무해 — ch1-2 figs 전례).
 *
 * SimFrame·SelfQuiz 는 ch1-2 figs.tsx(#82, lambda-dva-study.jsx ChQuiz 이식)에서
 * 로직·스타일 무변경으로 이동한 것이다.
 */

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
 * 상태에 따라 바뀌는 배경·글자색은 반드시 커스텀 속성으로 넘긴다 — 인라인 선언은 :hover
 * 규칙을 이겨 호버를 죽인다.
 */
/**
 * 채움 버튼 — 호버 시 한 단계 어두워진다. accent 가 이미 어두우면 hover 로 밝은 쪽을 준다.
 * 포커스 링은 채움색을 그대로 쓰지 않는다 — amber 는 흰 카드 위에서 2.73:1 이라 링이
 * 안 보인다(PR #147 Codex 지적). 한 단계 어둡게 해 3:1 을 넘긴다(amber 기준 5.16:1).
 */
export const fillBtn = (accent: string, hover?: string) =>
  ({
    "--btn-bg": accent,
    "--btn-fg": "#fff",
    "--btn-hover-bg": hover ?? `color-mix(in srgb, ${accent} 86%, #000)`,
    "--btn-ring": `color-mix(in srgb, ${accent} 70%, #000)`,
  }) as CSSProperties;

/**
 * 아웃라인 버튼 — 흰 배경이라 '아직 안 누른 선택지'로 읽힌다. 호버 시 soft 톤이 배경을 채운다.
 * 이때 글자도 함께 어두워진다: accent 를 그대로 두면 soft 배경 위에서 4.24~4.40:1 로
 * 본문 대비 기준 4.5:1 에 못 미친다(PR #147 Codex 지적). 85% 로 낮추면 5.5:1 대다.
 */
export const outlineBtn = (accent: string, soft: string) =>
  ({
    "--btn-bg": C.card,
    "--btn-fg": accent,
    "--btn-hover-bg": soft,
    "--btn-hover-fg": `color-mix(in srgb, ${accent} 85%, #000)`,
    "--btn-ring": accent,
    borderColor: accent,
  }) as CSSProperties;

/**
 * 선택 칩 — 신규 인터랙티브 4종의 "고르는" 컨트롤(#72). 선택 상태는 accent 아웃라인 +
 * soft 채움, 비선택은 흰 배경 + 회색 글자. 두 상태 모두 `.widget-btn` 위에 얹어 호버·
 * 포커스를 #144 체계에 맡긴다 — 비선택 칩의 호버 배경은 그 칩이 선택되면 갖게 될 soft
 * 톤이라, 호버가 곧 "누르면 이렇게 된다"의 예고가 된다.
 */
export const chipBtn = (active: boolean, accent: string, soft: string): CSSProperties =>
  active
    ? ({
        "--btn-bg": soft,
        "--btn-fg": `color-mix(in srgb, ${accent} 85%, #000)`,
        "--btn-hover-bg": soft,
        "--btn-ring": accent,
        borderColor: accent,
        fontWeight: 700,
      } as CSSProperties)
    : ({
        "--btn-bg": C.card,
        "--btn-fg": C.inkSoft,
        "--btn-hover-bg": soft,
        "--btn-hover-fg": `color-mix(in srgb, ${accent} 85%, #000)`,
        "--btn-ring": accent,
        borderColor: C.line,
        fontWeight: 400,
      } as CSSProperties);

/**
 * 토글 스위치 — ch0-2 EvalEngine 로컬 구현을 공용으로 승격(#72, 신규 인터랙티브 4종이 재사용).
 * 텍스트 버튼이 아니라 알약형 스위치라 `.widget-btn`(radius 9px·굵은 글자)을 씌우면 모양이
 * 깨진다 — 대신 같은 문법의 `.widget-switch`(globals.css)로 호버 밝기·포커스 링만 받는다.
 * 상태 자체는 색 전환 + 노브 이동으로 이미 드러나므로 호버는 조작 가능하다는 신호에 그친다.
 */
export function Switch({
  on,
  onClick,
  colorOn,
  label,
  disabled = false,
}: {
  on: boolean;
  onClick: () => void;
  colorOn: string;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="widget-switch"
      style={
        {
          width: 44,
          height: 24,
          borderRadius: 20,
          position: "relative",
          cursor: disabled ? "not-allowed" : "pointer",
          border: "none",
          padding: 0,
          flex: "none",
          // 켜진 채 비활성화되는 경우(VPC 보드에서 NAT 를 켠 뒤 VPC 연결을 끄면 그렇다)에도
          // 켜짐을 그대로 보여준다 — 노브만 off 로 밀면 화면은 꺼졌다고 하고 aria-checked 는
          // 켜졌다고 해서 서로 어긋나고, 다시 활성화됐을 때 값이 살아나는 것도 설명되지
          // 않는다 (PR #151 Codex 지적). 비활성은 색이 아니라 opacity 로만 표현한다.
          background: on ? colorOn : "#A9B4BF",
          opacity: disabled ? 0.45 : 1,
          transition: "background .2s, filter .15s",
          "--switch-ring": disabled ? "transparent" : colorOn,
        } as CSSProperties
      }
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: on ? 22 : 2,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#fff",
          transition: "left .2s",
          boxShadow: "0 1px 3px rgba(0,0,0,.25)",
        }}
      />
    </button>
  );
}

/**
 * 본문 용어 팝오버 (#193, 에픽 #56) — 용어 클릭 → 그 자리 팝오버(원문 확장 + 한 줄 설명)
 * + /glossary#<id> 딥링크. 읽던 흐름을 끊지 않는 것이 요점이라 자체 구현했다
 * (#57 결정: 본문이 max-width 48rem 단일 컬럼이라 포지셔닝 난도가 낮고, 리포는
 * 런타임 무의존 관례를 유지한다 — flip 등 정밀 포지셔닝은 하지 않는다).
 *
 * 사용: MDX 에서 Term 에 id(용어집 id)를 **리터럴 문자열로** 쓴다 — 검증기
 * (validate-content TERM_REF_*)가 소스를 정적 스캔해 실존 id 만 통과시키므로,
 * id={expr} 동적 표현은 위반으로 잡힌다. 표시 텍스트는 children(본문에 쓰인 표기),
 * 생략하면 용어집 표기(term)로 렌더된다.
 *
 * 팝오버 내부는 전부 span 이다 — 트리거가 MDX 문단(p) 안에 놓이므로 div/p 를 쓰면
 * HTML 중첩 위반으로 hydration 이 흔들린다. 카드 색은 배경·글자 쌍 고정(규약 색 박스
 * 규정 — C.card/C.ink), 트리거 자체는 본문 텍스트라 앱 테마에 순응(.term-trigger).
 *
 * 배치 제약 (PR #213 Codex 지적): 본문 프로즈 전용이다 — Table 셀처럼 overflow 를 가진
 * 조상 안에서는 absolute 팝오버가 잘린다. 포털로 탈출하는 건 "정밀 포지셔닝 없음" 전제를
 * 깨므로 하지 않는다 — 표 안 용어는 Term 없이 두고, 같은 용어의 프로즈 등장 지점에 건다
 * (#194 전면 적용 시 이 규칙을 따른다).
 */
export function Term({ id, children }: { id: string; children?: ReactNode }) {
  const t = glossary.find((g) => g.id === id);
  // 팝오버 배치(px, 래퍼 기준 left + 카드 폭) — 열 때 한 번 계산한다. null = 닫힘.
  const [pos, setPos] = useState<{ left: number; width: number } | null>(null);
  const open = pos !== null;
  const wrapRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // 배치: 용어 아래 왼쪽 정렬을 기본으로, 컬럼(main) 밖으로 나가는 만큼만 밀어 넣는다.
  // 계산은 **마운트 전에** 끝낸다 — 팝오버를 일단 left:0 으로 붙였다가 보정하면, 그 한 번의
  // 레이아웃에서 문서 폭이 뷰포트를 넘고(용어가 줄 오른쪽에 있을수록 크게), 모바일 브라우저는
  // 그 폭에 맞춰 페이지를 축소한다. 축소는 팝오버가 제자리로 돌아와도 되돌아오지 않아
  // 화면 전체가 작아진 채로 남는다 (#250 — 설치형 PWA/iOS Safari 에서 재현, useLayoutEffect
  // 로도 못 막는다: 축소를 부르는 건 페인트가 아니라 레이아웃이다).
  // 폭도 여기서 정한다 — CSS(min(320px, …))로 두면 clamp 계산이 폭을 알 수 없어 다시
  // 측정 → 보정 순서로 돌아간다.
  const openPopover = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const col = wrap.closest("main") ?? document.documentElement;
    const pad = 8;
    const wrapRect = wrap.getBoundingClientRect();
    const colRect = col.getBoundingClientRect();
    const width = Math.min(320, colRect.width - pad * 2);
    const left = Math.max(colRect.left + pad, Math.min(wrapRect.left, colRect.right - pad - width));
    setPos({ left: left - wrapRect.left, width });
  };

  // dismiss: 바깥 탭/클릭(document pointerdown — 리포 최초의 클릭아웃사이드) + Escape.
  // Escape 는 초점을 트리거로 되돌린다 — 팝오버 링크에 초점이 있던 채 닫히면 초점이 유실된다.
  // 리사이즈/회전도 닫는다 (PR #213 라운드 5) — 배치는 열 때 한 번 계산하므로 열린 채
  // 뷰포트가 바뀌면 낡은 클램프가 카드를 컬럼 밖으로 민다. 팝오버는 일시적 UI라
  // 재계산(리스너 + 재측정)보다 닫기가 단순하고, 다시 탭하면 새 뷰포트 기준으로 열린다.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setPos(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPos(null);
        btnRef.current?.focus();
      }
    };
    const onResize = () => setPos(null);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  // 없는 id — 검증기가 커밋 전에 잡지만, 런타임 방어로 본문 텍스트만 남긴다
  if (!t) return <>{children ?? id}</>;

  return (
    <span
      ref={wrapRef}
      style={{ position: "relative", display: "inline-block" }}
      // 키보드 초점이 밖으로 나가면 닫는다 (PR #213 Codex 지적) — Tab으로 옆 용어 트리거에
      // 옮겨 열면 pointerdown이 없어 이전 팝오버가 남아 겹친다. relatedTarget이 null인
      // focusout(팝오버 안 비초점 영역 클릭 등)은 닫지 않는다 — 바깥 클릭은 어차피
      // document pointerdown 리스너가 맡고 있고, 여기서 null까지 닫으면 팝오버 본문을
      // 클릭(텍스트 선택)하는 순간 닫혀 버린다.
      onBlur={(e) => {
        const to = e.relatedTarget as Node | null;
        if (to && !wrapRef.current?.contains(to)) setPos(null);
      }}
    >
      <button
        ref={btnRef}
        type="button"
        className="term-trigger"
        aria-expanded={open}
        onClick={() => (open ? setPos(null) : openPopover())}
      >
        {children ?? t.term}
      </button>
      {pos && (
        <span
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: pos.left,
            zIndex: 10,
            display: "block",
            width: pos.width,
            background: C.card,
            color: C.ink,
            border: `1px solid ${C.line}`,
            borderRadius: 10,
            boxShadow: "0 6px 20px rgba(23, 30, 38, 0.16)",
            padding: "10px 12px",
            // 트리거가 b/굵은 표 셀 안에 있어도 팝오버는 본문 톤을 유지한다
            fontSize: "0.82rem",
            fontWeight: 400,
            lineHeight: 1.65,
            textAlign: "left",
            whiteSpace: "normal",
          }}
        >
          <span style={{ display: "block", fontWeight: 700 }}>
            {t.term}
            {t.full && (
              <span style={{ marginLeft: 6, fontWeight: 400, fontSize: "0.78rem", color: C.inkSoft }}>
                {t.full}
              </span>
            )}
          </span>
          <span style={{ display: "block", margin: t.detail ? "4px 0 8px" : "4px 0 0" }}>{t.short}</span>
          {/* 링크는 detail 이 있는 용어에만 — 팝오버가 이미 term·full·short 전부를 보여주므로,
              detail 없는 항목은 용어집이 더 줄 게 없어 "자세히"가 과대 약속이 된다 (실기기 검수
              피드백). detail 이 채워지면(#215) 링크가 자동으로 살아난다.
              next/link 가 아니라 일반 a — Link 클라이언트 전환은 hash 만 바꾸고 브라우저의
              :target 상태를 갱신하지 않아, /glossary 의 대상 항목 하이라이트(#192,
              .glossary-item:target)가 켜지지 않는다. 실제 내비게이션이어야 :target 이 계산된다. */}
          {t.detail && (
            <a
              href={`/glossary#${t.id}`}
              style={{
                // 카드가 색 고정이므로 링크색도 고정 팔레트(C.blue) — var(--accent)는 다크에서 안 읽힌다
                color: C.blue,
                fontSize: "0.78rem",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              용어집에서 자세히 →
            </a>
          )}
        </span>
      )}
    </span>
  );
}

/**
 * 본문 약어 힌트 (#259) — 트리거에 커서를 올리거나(마우스) 탭하면(터치) 풀이름 + 한 줄
 * 설명이 뜬다. 대상은 "RW Allow" 처럼 **그 자리에서만 쓰는 약식 표기**다 — 용어집 표제어는
 * Term 이 맡으므로 여기 쓰지 않는다.
 *
 * Term 과 별개 구현인 이유는 놓이는 자리다: 이 힌트는 Table 셀에서 쓰이는데, Term 의
 * absolute 팝오버는 Table 의 overflow 에 잘린다(Term 주석의 배치 제약). 여기서는 fixed 로
 * 띄워 조상 overflow 를 벗어난다 — 대신 fixed 는 스크롤을 따라오지 못하므로 스크롤·리사이즈
 * 에 닫는다(표의 가로 스크롤도 capture 로 잡는다). Term 과 같은 이유로 배치 계산은 열기 전에
 * 끝내고(#250 모바일 축소), flip 같은 정밀 포지셔닝은 하지 않는다.
 *
 * 카드는 읽기 전용이라 pointerEvents 를 끈다 — 마우스가 카드로 들어가며 트리거의
 * pointerleave 가 떠 닫히는 깜빡임이 없어지고, 바깥 클릭 판정도 단순해진다.
 */
export function Abbr({ full, note, children }: { full: string; note: string; children: ReactNode }) {
  // 뷰포트 기준 배치(px) — 열 때 한 번 계산한다. null = 닫힘.
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const open = pos !== null;
  const wrapRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const hintId = useId();

  // 트리거 아래 왼쪽 정렬을 기본으로, 본문 컬럼(main) 밖으로 나가는 만큼만 밀어 넣는다.
  const openHint = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const col = wrap.closest("main") ?? document.documentElement;
    const pad = 8;
    const r = wrap.getBoundingClientRect();
    const colRect = col.getBoundingClientRect();
    const width = Math.min(300, colRect.width - pad * 2);
    const left = Math.max(colRect.left + pad, Math.min(r.left, colRect.right - pad - width));
    setPos({ top: r.bottom + 6, left, width });
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setPos(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPos(null);
        btnRef.current?.focus();
      }
    };
    const onShift = () => setPos(null);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onShift);
    // capture — 표 래퍼의 가로 스크롤처럼 버블링하지 않는 스크롤도 잡아야 한다
    window.addEventListener("scroll", onShift, true);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onShift);
      window.removeEventListener("scroll", onShift, true);
    };
  }, [open]);

  return (
    <span
      ref={wrapRef}
      style={{ position: "relative", display: "inline-block" }}
      onBlur={(e) => {
        const to = e.relatedTarget as Node | null;
        if (to && !wrapRef.current?.contains(to)) setPos(null);
      }}
    >
      <button
        ref={btnRef}
        type="button"
        className="term-trigger"
        aria-expanded={open}
        aria-describedby={open ? hintId : undefined}
        // 마우스는 올리면 열리고 벗어나면 닫힌다. 터치·펜은 hover 가 없으므로 탭(click)이
        // 토글이다 — pointerType 으로 갈라 두 입력이 서로를 방해하지 않게 한다.
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse" && !open) openHint();
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") setPos(null);
        }}
        // 키보드 초점에서만 연다 — 탭·클릭으로 들어온 초점에도 열면 뒤이어 오는 click 이
        // 토글로 곧장 닫아 버려(focus → click 순서) 터치에서 아무 일도 안 일어난다.
        onFocus={(e) => {
          if (!open && e.currentTarget.matches(":focus-visible")) openHint();
        }}
        onClick={() => (open ? setPos(null) : openHint())}
      >
        {children}
      </button>
      {pos && (
        <span
          id={hintId}
          role="tooltip"
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            zIndex: 30,
            display: "block",
            width: pos.width,
            pointerEvents: "none",
            background: C.card,
            color: C.ink,
            border: `1px solid ${C.line}`,
            borderRadius: 10,
            boxShadow: "0 6px 20px rgba(23, 30, 38, 0.16)",
            padding: "10px 12px",
            // 트리거가 굵은 표 셀 안에 있어도 카드는 본문 톤을 유지한다
            fontSize: "0.82rem",
            fontWeight: 400,
            lineHeight: 1.65,
            textAlign: "left",
            whiteSpace: "normal",
          }}
        >
          <span style={{ display: "block", fontWeight: 700 }}>{full}</span>
          <span style={{ display: "block", marginTop: 4 }}>{note}</span>
        </span>
      )}
    </span>
  );
}

/** 셀프 퀴즈 문항 — 질문을 보고 스스로 답을 생성한 뒤 정답과 대조한다. */
export interface SelfQuizItem {
  // 진도 저장의 안정 식별자 (#231) — content/schema.ts 의 SelfQuizEntry.slug 가 정본이다.
  slug: string;
  q: string;
  a: string;
  // 판정형(#150) — 값 = 정답 판정. 있으면 "답 확인하기" 대신 예/아니오 확답 게이트로 렌더.
  yn?: "예" | "아니오";
}

/**
 * 셀프 퀴즈 위젯 — 원본 lambda-dva-study.jsx ChQuiz 이식(#82). 상호작용 로직은 원본 유지:
 * 답 생성 게이트(정답을 열기 전에 스스로 답하기) → 정답 공개 → 맞음/틀림 자기채점 →
 * 점수 → 다시 풀기. 원본은 챕터 말미 10문항 일괄 덱이었으나 여기서는 해당 설명이 있는
 * 섹션 하단의 1~3문항 소형 덱으로 분산 배치(#82 사용자 결정) — 소형 덱에서 어색한 점수
 * UI만 조정: 결과 화면은 %(80% 기준) 대신 맞은 개수, 1문항 덱은 진행 헤더·진행바 생략.
 *
 * 채점 결과는 화면 상태(`score`)와 진도 저장소 양쪽에 남는다 (#231). `chapterId` 가 필수 prop
 * 인 이유가 그것이다 — 문항은 자기가 어느 챕터 것인지 모르는데(`SelfQuizEntry` 에 챕터가 없다)
 * 전역 문항 키는 챕터를 앞에 붙여야 만들어진다. 위젯을 쓰는 곳은 섹션 페이지 하나뿐이므로
 * optional 로 둘 이유가 없고, optional 이면 새 호출부가 조용히 기록을 빠뜨린다.
 */
export function SelfQuiz({ items, chapterId }: { items: SelfQuizItem[]; chapterId: string }) {
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState({ o: 0, x: 0 });
  const [done, setDone] = useState(false);
  // 판정형(#150) 전용 — 클릭한 예/아니오가 정답 판정과 일치했는지. 서술형 문항에서는 null.
  const [verdict, setVerdict] = useState<boolean | null>(null);

  const next = () => {
    if (i + 1 >= items.length) setDone(true);
    else {
      setI(i + 1);
      setOpen(false);
      setVerdict(null);
    }
  };
  // 서술형 문항의 자기채점. 판정형은 아래 judge 가 따로 기록한다 — 한 문항이 두 경로를
  // 거치는 일은 없다(판정형은 자기채점 버튼 자체가 렌더되지 않는다). "다시 풀기"로 같은
  // 문항을 또 풀면 새 시도로 누적되는 것이 맞다 (applyAttempt 기본 동작).
  const grade = (ok: boolean) => {
    recordSelfQuizAttempt(chapterId, items[i], ok);
    setScore((s) => ({ o: s.o + (ok ? 1 : 0), x: s.x + (ok ? 0 : 1) }));
    next();
  };
  const reset = () => {
    setI(0);
    setOpen(false);
    setScore({ o: 0, x: 0 });
    setDone(false);
    setVerdict(null);
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
  // 판정형(#150): 예/아니오 클릭 = 확답이자 정답 공개이자 채점. 자기채점 단계를 두지
  // 않는 건 한 문항에 채점 탭이 두 번 생기기 때문(2026-07-28 결정 변경 — #150 코멘트).
  // 근거·수치는 공개된 정답으로 읽히고, 서술 인출의 깊이는 인출 카드 몫이다(#98 역할 분담).
  const judge = (choice: "예" | "아니오") => {
    const ok = choice === cur.yn;
    recordSelfQuizAttempt(chapterId, cur, ok);
    setVerdict(ok);
    setOpen(true);
    setScore((s) => ({ o: s.o + (ok ? 1 : 0), x: s.x + (ok ? 0 : 1) }));
  };
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

      {/* 채움색은 amber(#E8830C)가 아니라 한 단계 어두운 amberText(#9A5B06)다 — 흰 글자 기준
          2.73:1 로 AA 본문 기준(4.5:1)에 못 미쳤다(#149). 내려서 5.42:1. 글자를 어둡게 하는
          대신 배경을 내린 건, 채움+흰 글자라는 '1차 동작' 신호를 유지하기 위해서다. */}
      {!open ? (
        cur.yn ? (
          <div>
            <p style={{ fontSize: "0.78rem", color: C.inkSoft, margin: "0 0 8px", lineHeight: 1.6 }}>
              판정을 정해 누르세요 — 클릭과 동시에 정답이 열리고 채점됩니다.
            </p>
            {/* 확답 두 버튼은 자기채점 쌍과 같은 등가 아웃라인(#144)이되, 색은 둘 다 중립
                blue 다 — teal/red 를 쓰면 정오 신호가 새어 판정을 유도한다. */}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => judge("예")}
                className="widget-btn"
                style={{ ...outlineBtn(C.blue, C.blueSoft), flex: 1, padding: "10px" }}
              >
                예
              </button>
              <button
                type="button"
                onClick={() => judge("아니오")}
                className="widget-btn"
                style={{ ...outlineBtn(C.blue, C.blueSoft), flex: 1, padding: "10px" }}
              >
                아니오
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="widget-btn"
            style={{ ...fillBtn(C.amberText), padding: "10px 18px" }}
          >
            답 확인하기
          </button>
        )
      ) : (
        <div>
          {cur.yn && (
            <div style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 8, color: verdict ? C.teal : C.red }}>
              {verdict ? "판정 정답 ✓ — 근거·수치까지 확인하고 넘어가세요." : `판정 오답 ✗ — 정답은 “${cur.yn}”. 근거를 확인하세요.`}
            </div>
          )}
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
          {cur.yn ? (
            // 판정형 — 클릭 시점에 이미 채점됐으므로 정오 무관하게 진행만 남는다.
            <button
              type="button"
              onClick={next}
              className="widget-btn"
              style={{ ...fillBtn(C.ink, C.inkSoft), padding: "10px 18px" }}
            >
              {i + 1 >= items.length ? "결과 보기" : "다음 문항"}
            </button>
          ) : (
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
          )}
        </div>
      )}
    </SimFrame>
  );
}
