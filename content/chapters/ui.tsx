import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

/**
 * 챕터 본문 공용 프리미티브 — 레거시 HTML/JSX 변환 시 여기 컴포넌트로 조립한다.
 *
 * 규약(schema.ts) 본문 네거티브 규정 준수 방식:
 *   - 전역 셀렉터 스타일 금지 → 인라인 스타일만 사용
 *   - 색이 있는 박스는 배경·글자색을 쌍으로 고정 → 앱 다크 모드와 무관하게 항상 읽힘
 *   - 박스 밖 일반 텍스트는 앱 CSS 변수(--fg, --muted)를 따라 테마에 순응
 */

/** 원본 콘텐츠 공통 팔레트 (aws-dva-stage0.html :root에서 추출). */
export const C = {
  ink: "#171E26",
  inkSoft: "#3D4B5C",
  card: "#FFFFFF",
  amber: "#E8830C",
  amberSoft: "#FDEBD3",
  amberText: "#9A5B06",
  teal: "#0E7C7B",
  tealSoft: "#DCF0EF",
  blue: "#2E5E8C",
  blueSoft: "#E3EDF6",
  red: "#B9432C",
  redSoft: "#F8E4DF",
  line: "#E2DFD8",
  codeFg: "#FFD9A0",
} as const;

/** 폰트 스택 — 챕터 figs.tsx는 복제하지 말고 여기서 가져다 쓴다 (#156). */
export const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";
export const SANS = "'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif";

/**
 * 빈출 표기의 근거 문구 (#185) — 값은 공식 수치가 아니라 검증 원천이 없는 추정치라서,
 * 그 사실 자체를 화면에 드러낸다. 목차 페이지의 고정 한 줄과 <Sec> 배지 툴팁이 같은
 * 문구를 쓴다 — 챕터별로 복붙하지 않는다.
 */
export const FREQ_EVIDENCE_NOTE =
  "빈출 표기는 공식 시험 청사진의 수치가 아니라 강의 강조도·수험 후기·도메인 비중을 종합한 추정치입니다. 실제 출제 구성은 회차마다 다를 수 있습니다.";

/** 섹션 빈출 배지 색상 (hi=★★★, mid=★★☆, lo=★☆☆). */
const FREQ_STYLE: Record<"hi" | "mid" | "lo", CSSProperties> = {
  hi: { background: C.redSoft, color: C.red },
  mid: { background: C.amberSoft, color: C.amberText },
  lo: { background: C.blueSoft, color: C.blue },
};

/** 본문 섹션 — 번호 배지 + 제목 + 부제 + 빈출 배지. */
export function Sec({
  num,
  title,
  sub,
  freq,
  freqLabel,
  children,
}: {
  num: string;
  title: string;
  sub: string;
  freq: "hi" | "mid" | "lo";
  freqLabel: string;
  children: ReactNode;
}) {
  return (
    <section style={{ padding: "2.5rem 0 0.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "0.85rem",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: "0.85rem",
            color: "#fff",
            background: C.ink,
            borderRadius: 8,
            padding: "4px 10px",
          }}
        >
          {num}
        </span>
        <div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 900, letterSpacing: "-0.01em" }}>
            {title}
          </h2>
          <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: 2 }}>{sub}</div>
        </div>
        {/* title 툴팁은 보조 수단이다 — 모바일에서는 목차 페이지의 고정 한 줄이 근거를 댄다 (#185) */}
        <span
          title={FREQ_EVIDENCE_NOTE}
          style={{
            marginLeft: "auto",
            fontSize: "0.8rem",
            fontWeight: 700,
            borderRadius: 99,
            padding: "4px 14px",
            whiteSpace: "nowrap",
            cursor: "help",
            ...FREQ_STYLE[freq],
          }}
        >
          {freqLabel}
        </span>
      </div>
      {children}
    </section>
  );
}

/**
 * 다른 챕터로의 인라인 상호 참조 — 아직 안 배운 개념이 먼저 등장할 때 상세 챕터로 잇는다.
 * (규약이 금지하는 "자체 내비게이션"은 목차·페이저류 UI — 본문 속 개념 링크는 해당 없음.)
 */
export function ChLink({ id, children }: { id: string; children: ReactNode }) {
  return (
    <Link
      href={`/chapters/${id}`}
      style={{ color: "var(--accent)", textDecoration: "underline", textUnderlineOffset: 3 }}
    >
      {children}
    </Link>
  );
}

/** 소제목 h3 — 앰버 왼쪽 보더. */
export function SubTitle({ children }: { children: ReactNode }) {
  return (
    <h3
      style={{
        fontSize: "1.05rem",
        fontWeight: 700,
        margin: "2rem 0 0.5rem",
        paddingLeft: 12,
        borderLeft: `4px solid ${C.amber}`,
      }}
    >
      {children}
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p style={{ margin: "0.65rem 0" }}>{children}</p>;
}

/** 보조 설명 문단 — 옅은 색. */
export function Note({ children }: { children: ReactNode }) {
  return <p style={{ margin: "0.65rem 0", color: "var(--muted)", fontSize: "0.92rem" }}>{children}</p>;
}

/** 인라인 코드 — 잉크 배경 + 앰버 글자 (테마 무관 고정). */
export function Code({ children }: { children: ReactNode }) {
  return (
    <code
      style={{
        fontFamily: MONO,
        fontSize: "0.86em",
        background: C.ink,
        color: C.codeFg,
        padding: "2px 7px",
        borderRadius: 5,
      }}
    >
      {children}
    </code>
  );
}

/**
 * 블록 코드 — 잉크 배경 카드. 내용은 \n 이스케이프 한 줄 템플릿으로 받는다(규약 v3).
 * title 은 파일명·명령 라벨용 선택 인자 (없으면 라벨 줄 자체가 안 나온다).
 */
export function CodeBlock({ title, children }: { title?: string; children: string }) {
  return (
    <div style={{ margin: "1rem 0" }}>
      {title && (
        <div
          style={{
            fontFamily: MONO,
            fontSize: "0.72rem",
            fontWeight: 700,
            color: C.inkSoft,
            marginBottom: 4,
            letterSpacing: "0.04em",
          }}
        >
          {title}
        </div>
      )}
      <pre
        style={{
          fontFamily: MONO,
          fontSize: "0.8rem",
          lineHeight: 1.7,
          background: C.ink,
          color: "#D5E0EC",
          borderRadius: 11,
          padding: "1rem 1.15rem",
          overflowX: "auto",
          margin: 0,
        }}
      >
        {children}
      </pre>
    </div>
  );
}

/** 도식 프레임 — 흰 카드에 SVG를 담고 캡션을 단다. */
export function Fig({ caption, children }: { caption: ReactNode; children: ReactNode }) {
  return (
    <figure
      style={{
        background: C.card,
        border: `1px solid ${C.line}`,
        borderRadius: 14,
        padding: "1.25rem 1.1rem 0.6rem",
        margin: "1.25rem 0",
      }}
    >
      {children}
      <figcaption
        style={{
          fontSize: "0.8rem",
          color: C.inkSoft,
          textAlign: "center",
          padding: "0.5rem 0.4rem",
          borderTop: `1px dashed ${C.line}`,
          marginTop: "0.75rem",
        }}
      >
        {caption}
      </figcaption>
    </figure>
  );
}

/**
 * 도식 모바일 전환 프레임 (#101) — 같은 도식의 가로형(wide)·세로형(narrow)을 둘 다 렌더하고
 * app/globals.css 의 .fig-wide/.fig-narrow 미디어쿼리(640px 기준)가 한쪽만 보여준다.
 * 인라인 스타일은 미디어쿼리를 못 쓰므로 이 전환만 앱 제공 클래스에 의존한다 (matchMedia 훅은
 * SSR 초기 렌더가 한쪽으로 고정돼 하이드레이션 깜빡임이 생기므로 기각 — 이슈 #101 결정).
 * 두 변형이 같은 SVG marker id를 쓰면 DOM id가 중복되니 narrow 쪽은 별도 id를 쓴다.
 */
export function FigSwitch({ wide, narrow }: { wide: ReactNode; narrow: ReactNode }) {
  return (
    <>
      <div className="fig-wide">{wide}</div>
      <div className="fig-narrow">{narrow}</div>
    </>
  );
}

/** 개념 표 — 첫 열은 용어(볼드·줄바꿈 없음). 셀에 ReactNode 허용. */
export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  const cell: CSSProperties = {
    padding: "10px 14px",
    borderTop: `1px solid ${C.line}`,
    verticalAlign: "top",
  };
  return (
    <div style={{ overflowX: "auto", margin: "1rem 0" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: 0,
          fontSize: "0.9rem",
          background: C.card,
          color: C.ink,
          borderRadius: 12,
          overflow: "hidden",
          border: `1px solid ${C.line}`,
        }}
      >
        <thead>
          <tr>
            {head.map((h) => (
              <th
                key={h}
                style={{
                  background: C.ink,
                  color: "#fff",
                  fontWeight: 700,
                  textAlign: "left",
                  padding: "10px 14px",
                  fontSize: "0.85rem",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((c, j) => (
                <td
                  key={j}
                  style={j === 0 ? { ...cell, fontWeight: 700, whiteSpace: "nowrap" } : cell}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** 시험 포인트 박스 — children으로 <li> 들을 받는다. */
export function ExamPoint({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: C.amberSoft,
        color: C.ink,
        borderLeft: `5px solid ${C.amber}`,
        borderRadius: "0 12px 12px 0",
        padding: "1rem 1.25rem",
        margin: "1.5rem 0",
      }}
    >
      <div
        style={{
          fontWeight: 900,
          fontSize: "0.85rem",
          color: C.amberText,
          letterSpacing: "0.06em",
          fontFamily: MONO,
        }}
      >
        EXAM POINT — DVA 시험에서는
      </div>
      <ul style={{ margin: "0.5rem 0 0 1.1rem", padding: 0 }}>{children}</ul>
    </div>
  );
}

export function ExamLi({ children }: { children: ReactNode }) {
  return <li style={{ margin: "6px 0", fontSize: "0.92rem" }}>{children}</li>;
}

/** 주의(함정) 콜아웃 — 레드 왼쪽 보더. */
export function WarnBox({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: C.redSoft,
        color: C.ink,
        borderLeft: `5px solid ${C.red}`,
        borderRadius: "0 12px 12px 0",
        padding: "0.85rem 1.15rem",
        margin: "1.25rem 0",
        fontSize: "0.93rem",
      }}
    >
      <b style={{ color: C.red }}>⚠ 함정 </b>
      {children}
    </div>
  );
}

/**
 * '더 알아보기' 접기 (#162) — 시험 비직결 심화를 접어 본문과 층을 나눈다 (본문 = 시험 직결,
 * 심화 = Fold — 분량 예산 규약은 schema.ts "섹션 분량 예산"). 상태 없는 네이티브 <details>라
 * JS 없이 동작하고, 검증기의 분량 계산은 <Fold …>…</Fold> 블록을 예산에서 제외한다.
 */
export function Fold({ topic, children }: { topic: string; children: ReactNode }) {
  return (
    <details
      style={{
        background: C.blueSoft,
        color: C.ink, // 배경·글자색 쌍 고정 — 다크 모드에서 상속 글자색(밝음)이 밝은 배경에 묻힌다
        border: `1px solid ${C.line}`,
        borderRadius: 12,
        margin: "1.25rem 0",
        padding: "0 1.15rem",
      }}
    >
      <summary
        style={{
          cursor: "pointer",
          fontWeight: 700,
          fontSize: "0.9rem",
          color: C.blue,
          padding: "0.75rem 0",
        }}
      >
        더 알아보기 — {topic}
      </summary>
      <div style={{ padding: "0.1rem 0 0.85rem", fontSize: "0.93rem" }}>{children}</div>
    </details>
  );
}

/** 챕터 말미 자기평가 체크리스트 — 잉크 배경 패널. */
export function Checklist({
  title,
  items,
}: {
  title: string;
  items: { text: ReactNode; freq: string }[];
}) {
  return (
    <div
      style={{
        background: C.ink,
        color: "#EDEBE6",
        borderRadius: 16,
        padding: "1.75rem 1.6rem",
        marginTop: "3rem",
      }}
    >
      <h2 style={{ color: "#fff", fontSize: "1.15rem", fontWeight: 900, marginBottom: "0.8rem" }}>
        {title}
      </h2>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {items.map((item, i) => (
          <li key={i} style={{ margin: "10px 0", paddingLeft: 30, position: "relative" }}>
            <span
              style={{ position: "absolute", left: 0, color: C.amber, fontWeight: 900 }}
              aria-hidden
            >
              ✓
            </span>
            {item.text}
            <span
              style={{ fontFamily: MONO, fontSize: "0.75rem", color: "#FFB55C", marginLeft: 8 }}
            >
              {item.freq}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
