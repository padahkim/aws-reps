//fable 5 最大
import React, { useState, useEffect } from "react";

/* ================================================================
   AWS Lambda 완전 정리 — DVA-C02 (실습 제외 이론 전 범위)
   디자인: AWS 콘솔 세계관(딥 네이비 + 오렌지) 기반 블루프린트 다이어그램
   ================================================================ */

const T = {
  ink: "#141B26",
  sub: "#33414F",
  faint: "#8494A5",
  paper: "#F2F4F7",
  line: "#DCE3EA",
  navy: "#131C2B",
  orange: "#E8710D",
  mono: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  sans: "'IBM Plex Sans KR', Pretendard, -apple-system, 'Noto Sans KR', 'Segoe UI', sans-serif",
};

const NODE_C = {
  orange: ["#E8710D", "#FFF4E8"],
  teal: ["#1F7A8C", "#E9F4F6"],
  purple: ["#6E56A6", "#F1EDF8"],
  slate: ["#44586F", "#EEF2F6"],
  red: ["#C0453B", "#FBEDEB"],
  green: ["#2F7D53", "#EAF4EE"],
};

const CSS = `
  .lam-root{display:flex;min-height:100vh;background:${"#F2F4F7"};font-family:'IBM Plex Sans KR',Pretendard,-apple-system,'Noto Sans KR',sans-serif;color:#141B26;-webkit-font-smoothing:antialiased;}
  .lam-sb{width:270px;flex-shrink:0;position:sticky;top:0;height:100vh;overflow-y:auto;background:#131C2B;padding:20px 12px 30px;scrollbar-width:thin;scrollbar-color:#2C3A52 transparent;}
  .lam-sb::-webkit-scrollbar{width:6px}
  .lam-sb::-webkit-scrollbar-thumb{background:#2C3A52;border-radius:3px}
  .lam-main{flex:1;min-width:0;padding:36px 46px 100px;max-width:1010px;}
  .lam-mobilebar{display:none;}
  .navlink{display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:7px;color:#93A1B5;font-size:12.5px;cursor:pointer;border:none;background:transparent;width:100%;text-align:left;font-family:inherit;line-height:1.45;}
  .navlink:hover{background:#1B2739;color:#D7DEE8;}
  .navlink.on{background:#22304A;color:#FFB456;font-weight:600;}
  .navlink:focus-visible{outline:2px solid #FFB456;outline-offset:1px;}
  section{scroll-margin-top:26px;}
  html{scroll-behavior:smooth;}
  @media (max-width:940px){
    .lam-sb{display:none}
    .lam-main{padding:80px 14px 80px}
    .lam-mobilebar{display:flex;position:fixed;top:0;left:0;right:0;z-index:60;background:#131C2B;padding:10px 14px;gap:10px;align-items:center;box-shadow:0 2px 10px rgba(0,0,0,.3)}
  }
  @media (prefers-reduced-motion:reduce){
    html{scroll-behavior:auto}
    *{animation:none !important;transition:none !important}
  }
`;

/* ---------------- 섹션 메타데이터 (빈출도 f: 1~5) ---------------- */
const META = {
  intro: { no: "01", t: "서버리스 소개", en: "WHAT IS SERVERLESS", f: 2 },
  overview: { no: "02", t: "AWS Lambda 개요", en: "LAMBDA OVERVIEW", f: 4 },
  sync: { no: "03", t: "동기식 호출", en: "SYNCHRONOUS INVOCATION", f: 5 },
  alb: {
    no: "04",
    t: "Lambda & Application Load Balancer",
    en: "LAMBDA + ALB",
    f: 3,
  },
  async: {
    no: "05",
    t: "비동기식 호출 & DLQ",
    en: "ASYNC INVOCATION + DLQ",
    f: 5,
  },
  eventbridge: {
    no: "06",
    t: "CloudWatch Events / EventBridge",
    en: "EVENTBRIDGE TRIGGER",
    f: 3,
  },
  s3: { no: "07", t: "S3 이벤트 알림", en: "S3 EVENT NOTIFICATIONS", f: 3 },
  esm: { no: "08", t: "이벤트 소스 매핑", en: "EVENT SOURCE MAPPING", f: 5 },
  eventctx: {
    no: "09",
    t: "이벤트 & 컨텍스트 객체",
    en: "EVENT & CONTEXT OBJECTS",
    f: 3,
  },
  dest: { no: "10", t: "Lambda 목적지", en: "LAMBDA DESTINATIONS", f: 4 },
  perm: {
    no: "11",
    t: "권한 — IAM 역할 & 리소스 정책",
    en: "IAM ROLES & RESOURCE POLICIES",
    f: 4,
  },
  env: { no: "12", t: "환경 변수", en: "ENVIRONMENT VARIABLES", f: 3 },
  mon: { no: "13", t: "모니터링 & X-Ray 추적", en: "MONITORING & X-RAY", f: 4 },
  edge: {
    no: "14",
    t: "Lambda@Edge & CloudFront Functions",
    en: "EDGE FUNCTIONS",
    f: 4,
  },
  vpc: { no: "15", t: "VPC의 Lambda", en: "LAMBDA IN VPC", f: 4 },
  perf: { no: "16", t: "함수 성능", en: "FUNCTION PERFORMANCE", f: 5 },
  layers: { no: "17", t: "Lambda 레이어", en: "LAMBDA LAYERS", f: 3 },
  fs: {
    no: "18",
    t: "파일 시스템 마운트 (EFS)",
    en: "FILE SYSTEM MOUNTING",
    f: 2,
  },
  conc: {
    no: "19",
    t: "동시성 & 콜드 스타트",
    en: "CONCURRENCY & COLD START",
    f: 5,
  },
  deps: { no: "20", t: "외부 종속성", en: "EXTERNAL DEPENDENCIES", f: 2 },
  cfn: {
    no: "21",
    t: "Lambda & CloudFormation",
    en: "LAMBDA + CLOUDFORMATION",
    f: 3,
  },
  container: {
    no: "22",
    t: "Lambda 컨테이너 이미지",
    en: "CONTAINER IMAGES",
    f: 3,
  },
  versions: { no: "23", t: "버전 & Alias", en: "VERSIONS & ALIASES", f: 5 },
  codedeploy: {
    no: "24",
    t: "Lambda & CodeDeploy",
    en: "TRAFFIC SHIFTING",
    f: 4,
  },
  furl: { no: "25", t: "Lambda 함수 URL", en: "FUNCTION URLS", f: 3 },
  codeguru: {
    no: "26",
    t: "CodeGuru 프로파일링 연동",
    en: "CODEGURU PROFILER",
    f: 1,
  },
  limits: { no: "27", t: "Lambda 제한 (한도)", en: "LAMBDA LIMITS", f: 5 },
  best: { no: "28", t: "모범 사례", en: "BEST PRACTICES", f: 3 },
};

const ORDER = [
  "intro",
  "overview",
  "sync",
  "alb",
  "async",
  "eventbridge",
  "s3",
  "esm",
  "eventctx",
  "dest",
  "perm",
  "env",
  "mon",
  "edge",
  "vpc",
  "perf",
  "layers",
  "fs",
  "conc",
  "deps",
  "cfn",
  "container",
  "versions",
  "codedeploy",
  "furl",
  "codeguru",
  "limits",
  "best",
];

const NAV = [
  { g: "기초", ids: ["intro", "overview"] },
  {
    g: "호출 방식",
    ids: [
      "sync",
      "alb",
      "async",
      "eventbridge",
      "s3",
      "esm",
      "eventctx",
      "dest",
    ],
  },
  { g: "보안 · 구성", ids: ["perm", "env"] },
  { g: "관측성", ids: ["mon"] },
  { g: "네트워크 · 엣지", ids: ["edge", "vpc"] },
  { g: "성능 · 확장", ids: ["perf", "layers", "fs", "conc", "deps"] },
  { g: "배포", ids: ["cfn", "container", "versions", "codedeploy", "furl"] },
  { g: "마무리", ids: ["codeguru", "limits", "best"] },
];

const FREQ_LABEL = ["", "참고", "낮음", "보통", "높음", "매우 높음"];
const freqColor = (n) =>
  n >= 5 ? "#E8710D" : n === 4 ? "#F09A3E" : n === 3 ? "#C2973A" : "#9AA7B4";

/* ---------------- 공용 프리미티브 ---------------- */

function Freq({ n, dark }) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}
    >
      <span
        style={{
          fontSize: 10,
          color: dark ? "#8FA0B5" : T.faint,
          fontWeight: 700,
          letterSpacing: 0.6,
        }}
      >
        시험 빈출도
      </span>
      <div style={{ display: "flex", gap: 3 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            style={{
              width: 14,
              height: 8,
              borderRadius: 2.5,
              background: i <= n ? freqColor(n) : dark ? "#2A3850" : "#E0E6ED",
            }}
          />
        ))}
      </div>
      <span
        style={{
          fontSize: 11.5,
          fontWeight: 800,
          color: freqColor(n),
          fontFamily: T.mono,
        }}
      >
        {FREQ_LABEL[n]}
      </span>
    </div>
  );
}

function Sec({ id, children }) {
  const m = META[id];
  return (
    <section id={id} style={{ margin: "0 0 66px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: T.mono,
            fontSize: 11,
            fontWeight: 700,
            color: T.orange,
            letterSpacing: 1,
          }}
        >
          {m.no}
        </span>
        <span
          style={{
            fontFamily: T.mono,
            fontSize: 10.5,
            color: T.faint,
            letterSpacing: 0.6,
          }}
        >
          {m.en}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
          flexWrap: "wrap",
          margin: "4px 0 6px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 23,
            fontWeight: 800,
            letterSpacing: "-0.01em",
            color: T.ink,
          }}
        >
          {m.t}
        </h2>
        <Freq n={m.f} />
      </div>
      <div
        style={{
          height: 3,
          width: 52,
          background: "linear-gradient(90deg,#E8710D,rgba(232,113,13,0))",
          borderRadius: 2,
          marginBottom: 16,
        }}
      />
      {children}
    </section>
  );
}

function H3({ children }) {
  return (
    <h3
      style={{
        fontSize: 15.5,
        fontWeight: 800,
        margin: "26px 0 8px",
        color: T.ink,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          background: T.orange,
          borderRadius: 2,
          display: "inline-block",
          transform: "rotate(45deg)",
          flexShrink: 0,
        }}
      />
      {children}
    </h3>
  );
}
function P({ children }) {
  return (
    <p
      style={{
        margin: "8px 0",
        fontSize: 13.5,
        lineHeight: 1.85,
        color: T.sub,
      }}
    >
      {children}
    </p>
  );
}
function UL({ items }) {
  return (
    <ul
      style={{
        margin: "8px 0",
        paddingLeft: 18,
        display: "flex",
        flexDirection: "column",
        gap: 5,
      }}
    >
      {items.map((x, i) => (
        <li key={i} style={{ fontSize: 13.5, lineHeight: 1.8, color: T.sub }}>
          {x}
        </li>
      ))}
    </ul>
  );
}
function B({ children }) {
  return <strong style={{ color: T.ink, fontWeight: 700 }}>{children}</strong>;
}
function M({ children }) {
  return (
    <code
      style={{
        fontFamily: T.mono,
        fontSize: "0.88em",
        background: "#EDF1F6",
        color: "#31435C",
        padding: "1px 6px",
        borderRadius: 5,
        border: "1px solid #DEE5ED",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </code>
  );
}
function OM({ children }) {
  return (
    <code
      style={{
        fontFamily: T.mono,
        fontSize: "0.88em",
        fontWeight: 700,
        background: "#FFF3E6",
        color: "#C25E07",
        padding: "1px 6px",
        borderRadius: 5,
        border: "1px solid #F5D9B8",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </code>
  );
}

/* 다이어그램 노드 */
function Node({ t, s, c = "slate", w = 128 }) {
  const [bar, bg] = NODE_C[c];
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid " + T.line,
        borderRadius: 10,
        minWidth: w,
        maxWidth: w + 60,
        boxShadow: "0 1px 2px rgba(20,27,38,.07)",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div style={{ height: 4, background: bar }} />
      <div style={{ padding: "8px 12px", background: bg + "55" }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: 12.5,
            color: T.ink,
            lineHeight: 1.35,
          }}
        >
          {t}
        </div>
        {s && (
          <div
            style={{
              fontFamily: T.mono,
              fontSize: 9.5,
              color: "#5E6E80",
              marginTop: 3,
              lineHeight: 1.45,
              wordBreak: "keep-all",
            }}
          >
            {s}
          </div>
        )}
      </div>
    </div>
  );
}

const arrLbl = {
  fontFamily: T.mono,
  fontSize: 9.5,
  color: "#5E6E80",
  textAlign: "center",
  lineHeight: 1.35,
  maxWidth: 150,
  wordBreak: "keep-all",
};

/* 가로 화살표 — l: 위 라벨(정방향), r: 아래 라벨(점선 반환 화살표), d: 점선, left: 왼쪽 방향, c: 색 */
function Arr({ l, r, d, w = 92, left, c = "#7E8FA3" }) {
  const headStyle = (side, col) => ({
    position: "absolute",
    top: -4.5,
    ...(side === "r" ? { right: -1 } : { left: -1 }),
    width: 0,
    height: 0,
    borderTop: "5px solid transparent",
    borderBottom: "5px solid transparent",
    ...(side === "r"
      ? { borderLeft: "7px solid " + col }
      : { borderRight: "7px solid " + col }),
  });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: w,
        flexShrink: 0,
        padding: "0 3px",
      }}
    >
      {l && <span style={{ ...arrLbl, marginBottom: 4 }}>{l}</span>}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 1,
          borderTop: "2px " + (d ? "dashed" : "solid") + " " + c,
        }}
      >
        <span style={headStyle(left ? "l" : "r", c)} />
      </div>
      {r && (
        <>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 1,
              borderTop: "2px dashed #AEBAC7",
              marginTop: 10,
            }}
          >
            <span style={headStyle(left ? "r" : "l", "#AEBAC7")} />
          </div>
          <span style={{ ...arrLbl, marginTop: 4 }}>{r}</span>
        </>
      )}
    </div>
  );
}

/* 세로(아래 방향) 화살표 */
function VArr({ l, h = 30, d, c = "#7E8FA3" }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "2px 0",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 0,
          height: h,
          borderLeft: "2px " + (d ? "dashed" : "solid") + " " + c,
          marginLeft: 30,
        }}
      >
        <span
          style={{
            position: "absolute",
            bottom: -1,
            left: -6,
            width: 0,
            height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: "7px solid " + c,
          }}
        />
      </div>
      {l && <span style={arrLbl}>{l}</span>}
    </div>
  );
}

function Flow({ children, gap = 6, wrap, style }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: wrap ? "wrap" : "nowrap",
        gap,
        rowGap: 14,
        width: "max-content",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
function Col({ children, gap = 12, style }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap, ...style }}>
      {children}
    </div>
  );
}

/* from 노드에서 여러 갈래로 분기 */
function Fan({ from, branches, gap = 14 }) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", width: "max-content" }}
    >
      <div style={{ flexShrink: 0 }}>{from}</div>
      <div style={{ display: "flex", flexDirection: "column", gap }}>
        {branches.map((b, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <Arr {...b[0]} />
            {b[1]}
          </div>
        ))}
      </div>
    </div>
  );
}

/* 점 그리드 배경의 다이어그램 패널 */
function Panel({ t, children, note, pad = 18 }) {
  return (
    <figure
      style={{
        margin: "14px 0",
        background: "#FBFCFE",
        border: "1px solid " + T.line,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {t && (
        <figcaption
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "8px 14px",
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: 0.8,
            color: "#4E5D6E",
            background: "#F1F4F8",
            borderBottom: "1px solid " + T.line,
            fontFamily: T.mono,
          }}
        >
          <span style={{ color: T.orange, fontSize: 9 }}>▶</span> {t}
        </figcaption>
      )}
      <div
        style={{
          padding: pad,
          overflowX: "auto",
          backgroundImage: "radial-gradient(#DEE5ED 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      >
        {children}
      </div>
      {note && (
        <div
          style={{
            padding: "8px 14px",
            fontSize: 11.5,
            lineHeight: 1.7,
            color: "#5E6E80",
            borderTop: "1px dashed " + T.line,
            background: "#fff",
          }}
        >
          {note}
        </div>
      )}
    </figure>
  );
}

/* 라벨 붙은 점선 그룹 박스 */
function GBox({ t, c = "slate", children, dashed = true, style }) {
  const [bar, bg] = NODE_C[c];
  return (
    <div
      style={{
        border: "1.5px " + (dashed ? "dashed" : "solid") + " " + bar + "66",
        background: bg + "55",
        borderRadius: 12,
        padding: "26px 14px 14px",
        position: "relative",
        width: "max-content",
        ...style,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 8,
          left: 13,
          fontSize: 9.5,
          fontWeight: 700,
          letterSpacing: 0.8,
          color: bar,
          fontFamily: T.mono,
        }}
      >
        {t}
      </span>
      {children}
    </div>
  );
}

function Chip({ children, c = "slate", mono }) {
  const [bar, bg] = NODE_C[c];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3.5px 10px",
        borderRadius: 999,
        background: bg,
        color: bar,
        fontSize: 11.5,
        fontWeight: 600,
        border: "1px solid " + bar + "33",
        lineHeight: 1.45,
        fontFamily: mono ? T.mono : "inherit",
      }}
    >
      {children}
    </span>
  );
}
function Chips({ items, c, mono }) {
  return (
    <div
      style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "10px 0" }}
    >
      {items.map((x, i) => (
        <Chip key={i} c={c} mono={mono}>
          {x}
        </Chip>
      ))}
    </div>
  );
}

const NOTE_K = {
  tip: { label: "시험 포인트", bar: "#E8710D", bg: "#FFF7EE" },
  warn: { label: "함정 주의", bar: "#C0453B", bg: "#FCF0EE" },
  mem: { label: "암기", bar: "#6E56A6", bg: "#F4F0FA" },
  info: { label: "참고", bar: "#44586F", bg: "#F0F3F7" },
};
function Note({ k = "tip", children }) {
  const m = NOTE_K[k];
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        margin: "12px 0",
        padding: "10px 14px",
        background: m.bg,
        borderLeft: "3px solid " + m.bar,
        borderRadius: "0 10px 10px 0",
        fontSize: 13,
        lineHeight: 1.8,
        color: T.ink,
      }}
    >
      <span
        style={{
          fontWeight: 800,
          fontSize: 11,
          color: m.bar,
          whiteSpace: "nowrap",
          marginTop: 3,
          letterSpacing: 0.5,
        }}
      >
        {m.label}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>{children}</span>
    </div>
  );
}

function Code({ t, children }) {
  return (
    <div
      style={{
        margin: "12px 0",
        borderRadius: 10,
        overflow: "hidden",
        border: "1px solid #223047",
      }}
    >
      {t && (
        <div
          style={{
            background: "#1A2638",
            color: "#8FA3BC",
            fontSize: 10.5,
            fontFamily: T.mono,
            padding: "6px 12px",
            borderBottom: "1px solid #223047",
            letterSpacing: 0.4,
          }}
        >
          {t}
        </div>
      )}
      <pre
        style={{
          margin: 0,
          background: "#131D2C",
          color: "#D5E0EE",
          fontSize: 12,
          fontFamily: T.mono,
          padding: "12px 14px",
          overflowX: "auto",
          lineHeight: 1.7,
        }}
      >
        {children}
      </pre>
    </div>
  );
}

function Tbl({ head, rows, minW = 520 }) {
  return (
    <div
      style={{
        overflowX: "auto",
        margin: "12px 0",
        border: "1px solid " + T.line,
        borderRadius: 10,
      }}
    >
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          fontSize: 12.5,
          background: "#fff",
          minWidth: minW,
        }}
      >
        <thead>
          <tr>
            {head.map((h, i) => (
              <th
                key={i}
                style={{
                  textAlign: "left",
                  padding: "9px 12px",
                  background: "#1C2A3F",
                  color: "#E7EDF5",
                  fontWeight: 600,
                  fontSize: 11.5,
                  whiteSpace: "nowrap",
                  borderRight:
                    i < head.length - 1 ? "1px solid #2C3B55" : "none",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} style={{ background: ri % 2 ? "#F7F9FB" : "#fff" }}>
              {r.map((c, ci) => (
                <td
                  key={ci}
                  style={{
                    padding: "9px 12px",
                    borderTop: "1px solid " + T.line,
                    color: ci === 0 ? T.ink : T.sub,
                    fontWeight: ci === 0 ? 700 : 400,
                    lineHeight: 1.65,
                    verticalAlign: "top",
                  }}
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

function KVGrid({ items }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
        gap: 10,
        margin: "12px 0",
      }}
    >
      {items.map((it, i) => (
        <div
          key={i}
          style={{
            background: "#fff",
            border: "1px solid " + T.line,
            borderRadius: 10,
            padding: "11px 13px",
          }}
        >
          <div style={{ fontSize: 11, color: T.faint, fontWeight: 700 }}>
            {it.k}
          </div>
          <div
            style={{
              fontFamily: T.mono,
              fontSize: 15.5,
              fontWeight: 700,
              color: T.orange,
              margin: "4px 0 3px",
              wordBreak: "keep-all",
            }}
          >
            {it.v}
          </div>
          {it.s && (
            <div style={{ fontSize: 10.5, color: T.faint, lineHeight: 1.55 }}>
              {it.s}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════ HERO & LEGEND ══════════════════════ */

function Hero({ onJump }) {
  const tops = ORDER.filter((id) => META[id].f === 5);
  return (
    <header
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
        background:
          "linear-gradient(135deg,#131C2B 0%,#1B2A44 60%,#23375A 100%)",
        padding: "34px 30px 28px",
        marginBottom: 42,
        border: "1px solid #26354E",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: -30,
          top: -68,
          fontSize: 300,
          fontWeight: 800,
          color: "#E8710D",
          opacity: 0.09,
          fontFamily: T.mono,
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        λ
      </div>
      <div style={{ position: "relative" }}>
        <div
          style={{
            fontFamily: T.mono,
            fontSize: 11,
            letterSpacing: 2.2,
            color: "#F09A3E",
            fontWeight: 700,
          }}
        >
          AWS CERTIFIED DEVELOPER — ASSOCIATE (DVA-C02)
        </div>
        <h1
          style={{
            margin: "10px 0 10px",
            fontSize: "clamp(26px,4vw,38px)",
            fontWeight: 800,
            color: "#F4F7FB",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          AWS Lambda <span style={{ color: "#F09A3E" }}>완전 정복</span> 이론
          노트
        </h1>
        <p
          style={{
            margin: 0,
            maxWidth: 700,
            fontSize: 13.5,
            lineHeight: 1.85,
            color: "#B9C6D8",
          }}
        >
          강의 커리큘럼의{" "}
          <strong style={{ color: "#F4F7FB", fontWeight: 700 }}>
            실습(Hands-on)을 제외한 모든 이론 토픽 28개
          </strong>
          를 다이어그램 중심으로 정리했습니다. 각 섹션 제목 옆의 게이지는 DVA
          시험 빈출도(5단계)입니다. 왼쪽 목차(모바일은 상단 메뉴)로 이동하세요.
        </p>
        <div style={{ marginTop: 20 }}>
          <div
            style={{
              fontSize: 10.5,
              fontFamily: T.mono,
              letterSpacing: 1.2,
              color: "#8FA0B5",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            ★ 최우선 학습 TOP — 빈출도 [매우 높음] 바로가기
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {tops.map((id) => (
              <button
                key={id}
                onClick={() => onJump(id)}
                style={{
                  cursor: "pointer",
                  border: "1px solid #E8710D",
                  background: "rgba(232,113,13,.14)",
                  color: "#FFBE85",
                  fontFamily: T.mono,
                  fontSize: 11.5,
                  fontWeight: 700,
                  padding: "6px 12px",
                  borderRadius: 999,
                }}
              >
                {META[id].no} {META[id].t}
              </button>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 22px",
            alignItems: "center",
            marginTop: 20,
            paddingTop: 14,
            borderTop: "1px dashed #2C3B55",
          }}
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <span
              key={n}
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <span
                style={{
                  width: 12,
                  height: 7,
                  borderRadius: 2,
                  background: freqColor(n),
                }}
              />
              <span
                style={{ fontSize: 10.5, color: "#8FA0B5", fontFamily: T.mono }}
              >
                {FREQ_LABEL[n]}
              </span>
            </span>
          ))}
          <span style={{ fontSize: 10.5, color: "#6E8098", lineHeight: 1.6 }}>
            ※ 빈출도는 공식 통계가 아닌, DVA-C02 시험 가이드 비중과 수험 후기
            기반의 추정치입니다.
          </span>
        </div>
      </div>
    </header>
  );
}

function Legend() {
  const rows = [
    ["teal", "이벤트 소스 · 클라이언트"],
    ["orange", "Lambda 함수"],
    ["purple", "대상(Destination) · 저장소"],
    ["slate", "AWS 관리 요소"],
  ];
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px 18px",
        alignItems: "center",
        margin: "-24px 0 40px",
        padding: "10px 14px",
        background: "#F4F7FA",
        border: "1px solid " + T.line,
        borderRadius: 10,
      }}
    >
      <span
        style={{
          fontSize: 10.5,
          fontWeight: 800,
          color: T.faint,
          fontFamily: T.mono,
          letterSpacing: 1,
        }}
      >
        다이어그램 범례
      </span>
      {rows.map(([c, t]) => (
        <span
          key={c}
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <span
            style={{
              width: 11,
              height: 11,
              borderRadius: 3,
              background: NODE_C[c][0],
            }}
          />
          <span style={{ fontSize: 11.5, color: T.sub }}>{t}</span>
        </span>
      ))}
      <span style={{ fontSize: 11.5, color: T.sub }}>
        실선 = 호출 · 전달&nbsp;&nbsp;|&nbsp;&nbsp;점선 = 응답 · 비동기 · 참조
      </span>
    </div>
  );
}

/* ══════════════════════ 01 서버리스 소개 ══════════════════════ */

function S_Intro() {
  return (
    <Sec id="intro">
      <P>
        <B>서버리스(Serverless)</B>는 개발자가 더 이상 서버를 직접
        관리(프로비저닝·패치·확장)하지 않는 새로운 패러다임입니다. 코드(함수)만
        배포하면 되기 때문에, 초기에는 <B>FaaS(Function as a Service)</B>와 같은
        의미로 쓰였습니다.
      </P>
      <UL
        items={[
          <>
            서버리스는 AWS Lambda에서 개척되었지만, 지금은{" "}
            <B>원격으로 관리되는 모든 것</B>(데이터베이스, 메시징, 스토리지
            등)을 포괄하는 개념으로 확장되었습니다.
          </>,
          <>
            핵심:{" "}
            <B>
              "서버가 없다"가 아니라, 우리가 서버를 관리·확인·프로비저닝하지
              않는다
            </B>
            는 뜻입니다. 서버는 여전히 존재하지만 AWS가 대신 운영합니다.
          </>,
        ]}
      />
      <H3>AWS의 대표 서버리스 서비스</H3>
      <Chips
        items={[
          "AWS Lambda",
          "DynamoDB",
          "AWS Cognito",
          "API Gateway",
          "Amazon S3",
          "SNS & SQS",
          "Kinesis Data Firehose",
          "Aurora Serverless",
          "Step Functions",
          "AWS Fargate",
        ]}
        c="teal"
      />
      <H3>전형적인 서버리스 웹 애플리케이션 구조</H3>
      <Panel
        t="SERVERLESS WEB APP — 이 다이어그램 구조가 시험 전반의 뼈대"
        note="정적 콘텐츠는 CloudFront + S3, 인증은 Cognito, REST API는 API Gateway → Lambda → DynamoDB 조합이 서버리스의 표준 패턴입니다."
      >
        <Col gap={20}>
          <Flow>
            <Node t="사용자" s="Browser / Mobile" c="teal" w={110} />
            <Arr l="정적 콘텐츠 요청" w={104} />
            <Node t="CloudFront" s="CDN" w={112} />
            <Arr l="원본 조회" w={86} />
            <Node t="Amazon S3" s="정적 웹사이트" c="purple" w={118} />
          </Flow>
          <Flow>
            <Node t="사용자" s="REST API 호출" c="teal" w={110} />
            <Arr l="HTTPS" w={104} />
            <Node t="API Gateway" s="REST API" w={112} />
            <Arr l="프록시 통합" w={86} />
            <Node t="Lambda" s="비즈니스 로직" c="orange" w={118} />
            <Arr l="읽기 / 쓰기" w={86} />
            <Node t="DynamoDB" s="NoSQL DB" c="purple" w={112} />
          </Flow>
          <Flow>
            <Node t="사용자" c="teal" w={110} />
            <Arr l="로그인 · 자격 증명" d w={104} />
            <Node t="Amazon Cognito" s="인증 (Authentication)" w={150} />
          </Flow>
        </Col>
      </Panel>
    </Sec>
  );
}

/* ══════════════════════ 02 Lambda 개요 ══════════════════════ */

function S_Overview() {
  return (
    <Sec id="overview">
      <H3>EC2 vs Lambda</H3>
      <Tbl
        head={["Amazon EC2", "Amazon Lambda"]}
        rows={[
          ["클라우드의 가상 서버", "가상 함수 — 관리할 서버가 없음"],
          [
            "메모리·CPU 크기를 직접 프로비저닝",
            "실행 시간에 맞춰 자동 프로비저닝",
          ],
          [
            "계속 실행됨 (실행 중이면 항상 과금)",
            <>
              실행 시간이 짧음 — <B>최대 15분</B>
            </>,
          ],
          [
            "확장하려면 개입 필요 (ASG 등 구성)",
            "온디맨드 실행 · 스케일링 완전 자동화",
          ],
        ]}
      />
      <H3>Lambda의 장점</H3>
      <UL
        items={[
          <>
            <B>간편한 요금 책정</B> — 요청 수와 컴퓨팅 시간에 대해서만 과금.
            프리 티어: <OM>월 1,000,000건 요청</OM> + <OM>400,000 GB-초</OM>{" "}
            컴퓨팅.
          </>,
          <>
            AWS 전체 서비스와 폭넓은 <B>통합</B>, 다양한 <B>프로그래밍 언어</B>{" "}
            지원.
          </>,
          <>
            <B>CloudWatch</B>를 통한 손쉬운 모니터링.
          </>,
          <>
            함수당 최대 <OM>10GB RAM</OM> —{" "}
            <B>RAM을 늘리면 CPU와 네트워크 성능도 함께 향상</B>됩니다(시험
            단골).
          </>,
        ]}
      />
      <H3>지원 언어 (Runtime)</H3>
      <Chips
        items={[
          "Node.js (JavaScript)",
          "Python",
          "Java",
          "C# (.NET Core) / Powershell",
          "Ruby",
          "Custom Runtime API (Rust, Golang 등)",
        ]}
        mono
      />
      <Note k="warn">
        <B>Lambda 컨테이너 이미지</B>는 반드시 <B>Lambda Runtime API를 구현</B>
        해야 합니다. 임의의 Docker 이미지를 그냥 실행하는 용도가 아닙니다 — 일반
        Docker 이미지는 <B>ECS / Fargate</B>에서 실행하는 것이 정답입니다(빈출
        함정).
      </Note>
      <H3>대표 통합 서비스</H3>
      <Chips
        items={[
          "API Gateway",
          "Kinesis",
          "DynamoDB",
          "S3",
          "CloudFront",
          "EventBridge (CW Events)",
          "CloudWatch Logs",
          "SNS",
          "SQS",
          "Cognito",
        ]}
        c="teal"
      />
      <H3>예시 1 — 서버리스 썸네일 생성</H3>
      <Panel t="S3 EVENT → LAMBDA → S3 & DYNAMODB">
        <Flow>
          <Node t="S3 버킷" s="새 이미지 업로드" c="teal" w={126} />
          <Arr l="S3 이벤트 알림" w={104} />
          <Fan
            from={<Node t="Lambda" s="썸네일 생성 함수" c="orange" w={132} />}
            branches={[
              [
                { l: "썸네일 저장", w: 100 },
                <Node t="S3 버킷" s="썸네일 push" c="purple" w={120} />,
              ],
              [
                { l: "메타데이터 기록", w: 100 },
                <Node
                  t="DynamoDB"
                  s="이름·크기·생성일 등"
                  c="purple"
                  w={140}
                />,
              ],
            ]}
          />
        </Flow>
      </Panel>
      <H3>예시 2 — 서버리스 CRON 작업</H3>
      <Panel
        t="EVENTBRIDGE RULE → LAMBDA"
        note="크론을 돌리기 위해 EC2를 상시 가동할 필요가 없습니다. 이 조합이 '서버리스 크론'의 정답 패턴입니다."
      >
        <Flow>
          <Node
            t="EventBridge 규칙"
            s="CRON — 1시간마다 트리거"
            c="teal"
            w={168}
          />
          <Arr l="스케줄 이벤트" w={110} />
          <Node t="Lambda" s="작업 수행 함수" c="orange" w={130} />
        </Flow>
      </Panel>
      <H3>요금 (참고 수치)</H3>
      <KVGrid
        items={[
          {
            k: "요청 요금",
            v: "$0.20 / 100만 건",
            s: "첫 1,000,000건은 매월 무료",
          },
          {
            k: "컴퓨팅 요금",
            v: "$1.00 / 600,000 GB-초",
            s: "400,000 GB-초 무료 후 과금",
          },
          {
            k: "GB-초란?",
            v: "RAM(GB) × 시간(초)",
            s: "예: 1GB RAM 함수 1초 실행 = 1 GB-초",
          },
        ]}
      />
      <P>
        Lambda는 매우 저렴해서 인기가 많으며, 정확한 단가보다{" "}
        <B>과금 모델(요청 + 실행 시간×메모리)</B>을 이해하는 것이 중요합니다.
      </P>
    </Sec>
  );
}

/* ══════════════════════ 03 동기식 호출 ══════════════════════ */

function S_Sync() {
  return (
    <Sec id="sync">
      <P>
        <B>동기식 호출(Synchronous Invocation)</B>은 호출 후{" "}
        <B>결과를 기다렸다가 즉시 응답</B>을 받는 방식입니다. CLI, SDK, API
        Gateway, ALB를 통한 호출이 대표적입니다.
      </P>
      <Panel
        t="SYNCHRONOUS INVOCATION — 결과를 기다린다"
        note="응답이 호출자에게 곧바로 돌아오므로, 오류가 나면 호출자가 직접 처리해야 합니다."
      >
        <Flow>
          <Node t="클라이언트" s="SDK / CLI" c="teal" w={116} />
          <Arr l="① invoke" r="④ 응답 반환" w={112} />
          <Node t="API Gateway" s="프록시" w={116} />
          <Arr l="② 호출" r="③ 결과" w={96} />
          <Node t="Lambda" s="함수 실행" c="orange" w={116} />
        </Flow>
      </Panel>
      <Note k="tip">
        동기식에서는 <B>오류 처리가 클라이언트 측 책임</B>입니다 — 재시도,{" "}
        <B>지수 백오프(exponential backoff)</B> 등을 클라이언트가 수행해야
        합니다. "동기식 호출 실패 시 누가 재시도?"가 나오면 답은{" "}
        <B>클라이언트</B>입니다.
      </Note>
      <Code t="CLI — 동기식 호출 예시">{`aws lambda invoke \\
  --function-name demo-lambda \\
  --cli-binary-format raw-in-base64-out \\
  --payload '{"key1": "value1"}' \\
  response.json`}</Code>
      <H3>동기식으로 호출하는 서비스 목록</H3>
      <Tbl
        head={["분류", "서비스", "비고"]}
        rows={[
          [
            "사용자 호출",
            "ELB (Application Load Balancer)",
            "HTTP 요청을 JSON으로 변환해 호출",
          ],
          ["", "API Gateway", "REST/HTTP API 백엔드"],
          ["", "CloudFront (Lambda@Edge)", "엣지에서 요청/응답 변형"],
          ["", "Amazon S3 Batch", "대량 객체 작업"],
          ["서비스 호출", "Amazon Cognito", "사용자 풀 트리거"],
          ["", "AWS Step Functions", "상태 머신의 Task"],
          ["기타", "Amazon Lex · Alexa · Kinesis Data Firehose", "동기식 통합"],
        ]}
        minW={560}
      />
    </Sec>
  );
}

/* ══════════════════════ 04 Lambda & ALB ══════════════════════ */

function S_ALB() {
  return (
    <Sec id="alb">
      <P>
        Lambda 함수를 <B>HTTP(S) 엔드포인트로 노출</B>하는 방법은 두 가지입니다
        — <B>Application Load Balancer</B>(또는 API Gateway). ALB를 쓰려면
        Lambda 함수를 <B>대상 그룹(Target Group)</B>에 등록해야 합니다.
      </P>
      <Panel
        t="ALB → LAMBDA (SYNC)"
        note="ALB는 HTTP 요청을 JSON 문서로 변환해 Lambda를 동기식으로 호출하고, Lambda의 JSON 응답을 다시 HTTP로 변환해 클라이언트에 돌려줍니다."
      >
        <Flow>
          <Node t="클라이언트" s="HTTP/HTTPS" c="teal" w={112} />
          <Arr l="HTTP 요청" r="HTTP 응답" w={100} />
          <GBox t="Target Group" c="slate">
            <Node t="ALB" s="Application LB" w={116} />
          </GBox>
          <Arr l="JSON 변환 → 동기 호출" r="JSON 응답" w={140} />
          <Node t="Lambda" s="함수" c="orange" w={110} />
        </Flow>
      </Panel>
      <H3>요청 변환 — HTTP → JSON</H3>
      <Code t="ALB가 Lambda에 전달하는 요청 페이로드">{`{
  "requestContext": {
    "elb": { "targetGroupArn": "arn:aws:elasticloadbalancing:..." }
  },
  "httpMethod": "GET",
  "path": "/lambda",
  "queryStringParameters": { "query": "1234ABCD" },
  "headers": {
    "host": "lambda-alb-123578498.us-east-2.elb.amazonaws.com",
    "user-agent": "...", "x-forwarded-port": "80", "x-forwarded-proto": "http"
  },
  "body": "",
  "isBase64Encoded": false
}`}</Code>
      <UL
        items={[
          <>
            <M>requestContext.elb</M> — 어떤 대상 그룹(ELB)에서 왔는지,
          </>,
          <>
            <B>메서드·경로</B>(<M>httpMethod</M>, <M>path</M>),{" "}
            <B>쿼리 스트링</B>은 키/값 형태,
          </>,
          <>
            <B>헤더</B>도 키/값, <B>바디</B>와 <M>isBase64Encoded</M>(바이너리
            여부)로 구성됩니다.
          </>,
        ]}
      />
      <H3>응답 변환 — JSON → HTTP</H3>
      <Code t="Lambda가 반환해야 하는 응답 형식">{`{
  "statusCode": 200,
  "statusDescription": "200 OK",
  "headers": { "Content-Type": "text/html; charset=utf-8" },
  "body": "<h1>Hello world!</h1>",
  "isBase64Encoded": false
}`}</Code>
      <H3>Multi-Header Values</H3>
      <P>
        ALB 설정에서 <B>다중 헤더 값(Multi-Value Headers)</B>을 활성화하면, 같은
        이름의 쿼리 스트링·헤더가 <B>배열</B>로 변환되어 전달됩니다.
      </P>
      <Panel t="MULTI-VALUE HEADERS 변환">
        <Flow>
          <Node t="HTTP 요청" s="?name=foo&name=bar" c="teal" w={190} />
          <Arr l="Multi-Header 활성화 시" w={140} />
          <Node
            t="Lambda 이벤트 JSON"
            s={'"name": ["foo","bar"]'}
            c="orange"
            w={190}
          />
        </Flow>
      </Panel>
      <Note k="mem">
        시험 포인트: ALB + Lambda 조합 = <B>대상 그룹 등록</B> ·{" "}
        <B>HTTP↔JSON 상호 변환</B> · <B>Multi-Value Headers는 배열 변환</B>. 이
        3가지만 확실히 기억하세요.
      </Note>
    </Sec>
  );
}

/* ══════════════════════ 05 비동기식 호출 & DLQ ══════════════════════ */

function S_Async() {
  return (
    <Sec id="async">
      <P>
        <B>비동기식 호출(Asynchronous Invocation)</B>은 결과를 기다리지
        않습니다. 이벤트는 Lambda 내부의 <B>이벤트 큐(Event Queue)</B>에 쌓이고,
        Lambda가 큐에서 읽어 처리합니다. 호출자는 즉시 <OM>202 (Accepted)</OM>{" "}
        응답만 받습니다.
      </P>
      <Panel
        t="ASYNC INVOCATION + RETRY + DLQ"
        note="처리 실패 시 Lambda가 자동으로 재시도하며, 그래도 실패하면 DLQ(SQS 또는 SNS)로 이벤트를 보냅니다."
      >
        <Flow>
          <Col gap={8}>
            <Node t="Amazon S3" s="이벤트 알림" c="teal" w={128} />
            <Node t="Amazon SNS" c="teal" w={128} />
            <Node t="EventBridge" c="teal" w={128} />
          </Col>
          <Arr l="이벤트 전송" w={96} />
          <GBox t="AWS Lambda Service" c="orange">
            <Flow>
              <Node t="이벤트 큐" s="Event Queue" w={112} />
              <Arr l="읽기" w={70} />
              <Node t="Lambda" s="함수 실행" c="orange" w={112} />
            </Flow>
          </GBox>
          <Arr l="총 3회 실패 시" d w={104} c="#C43D3D" />
          <Node t="DLQ" s="SQS 또는 SNS" c="purple" w={116} />
        </Flow>
      </Panel>
      <H3>자동 재시도 정책 (암기 필수)</H3>
      <UL
        items={[
          <>
            오류 발생 시 <B>총 3회 시도</B> — 최초 시도 후,{" "}
            <OM>1분 대기 → 재시도</OM>, 그다음 <OM>2분 대기 → 재시도</OM>.
          </>,
          <>
            재시도가 일어나므로 함수 처리는 <B>멱등(idempotent)</B>해야 합니다 —
            같은 이벤트를 여러 번 처리해도 결과가 동일해야 함.
          </>,
          <>
            재시도되면 CloudWatch Logs에 <B>중복 로그 항목</B>이 보입니다.
          </>,
        ]}
      />
      <H3>DLQ (Dead-Letter Queue)</H3>
      <UL
        items={[
          <>
            재시도 후에도 실패한 이벤트를 <B>SNS 토픽 또는 SQS 큐</B>로 보낼 수
            있습니다.
          </>,
          <>
            이때 Lambda의{" "}
            <B>실행 역할(Execution Role)에 SQS/SNS 쓰기 권한(IAM)</B>이 반드시
            필요합니다 — 권한 문제가 시험 함정으로 출제됩니다.
          </>,
          <>
            비동기 호출은 "처리 속도보다 빨리 이벤트가 몰려도" 큐에 쌓아두므로,
            결과가 즉시 필요 없는 대량 처리에 적합합니다.
          </>,
        ]}
      />
      <H3>비동기식으로 호출하는 서비스</H3>
      <Chips
        items={[
          "Amazon S3",
          "Amazon SNS",
          "EventBridge (CloudWatch Events)",
          "CodeCommit",
          "CodePipeline",
          "CloudWatch Logs (구독)",
          "Amazon SES",
          "CloudFormation",
          "AWS Config",
          "AWS IoT",
        ]}
        c="teal"
      />
      <Note k="tip">
        <B>S3 · SNS · EventBridge → Lambda = 비동기</B>라는 매핑을 기억하세요.
        "S3 이벤트가 실패하면 어디로?" → <B>재시도 3회 후 DLQ</B>가 정답
        흐름입니다.
      </Note>
    </Sec>
  );
}

/* ══════════════════════ 06 EventBridge ══════════════════════ */

function S_EventBridge() {
  return (
    <Sec id="eventbridge">
      <P>
        Lambda는 <B>EventBridge(구 CloudWatch Events)</B>와 결합해 두 가지 대표
        패턴을 만듭니다 — <B>서버리스 크론</B>과 <B>서비스 이벤트 반응</B>.
      </P>
      <H3>패턴 ① — 서버리스 CRON / Rate</H3>
      <Panel t="SCHEDULED RULE → LAMBDA">
        <Flow>
          <Node
            t="EventBridge 규칙"
            s="CRON 또는 Rate (예: 1시간마다)"
            c="teal"
            w={196}
          />
          <Arr l="스케줄 트리거" w={110} />
          <Node t="Lambda" s="정기 작업 수행" c="orange" w={130} />
        </Flow>
      </Panel>
      <H3>패턴 ② — 서비스 이벤트에 반응</H3>
      <Panel t="CODEPIPELINE STATE CHANGE → LAMBDA">
        <Flow>
          <Node t="CodePipeline" s="파이프라인 상태 변경" c="teal" w={160} />
          <Arr l="이벤트 발생" w={90} />
          <Node t="EventBridge 규칙" s="상태 변경 규칙 매칭" w={160} />
          <Arr l="비동기 호출" w={96} />
          <Node t="Lambda" s="알림·후속 작업" c="orange" w={126} />
        </Flow>
      </Panel>
      <Note k="tip">
        "X분/시간마다 Lambda를 실행하고 싶다" 유형의 문제 정답은 항상{" "}
        <B>EventBridge 스케줄 규칙</B>입니다. EC2 크론 서버는 오답입니다.
      </Note>
    </Sec>
  );
}

/* ══════════════════════ 07 S3 이벤트 알림 ══════════════════════ */

function S_S3() {
  return (
    <Sec id="s3">
      <P>
        <B>S3 이벤트 알림(Event Notifications)</B>은 버킷에서 일어난 일을
        Lambda(비동기), SNS, SQS로 전달합니다.
      </P>
      <UL
        items={[
          <>
            이벤트 종류: <M>S3:ObjectCreated</M>, <M>S3:ObjectRemoved</M>,{" "}
            <M>S3:ObjectRestore</M>, <M>S3:Replication</M> 등.
          </>,
          <>
            객체 이름 필터링 가능 — 예: <OM>*.jpg</OM>만 트리거.
          </>,
          <>
            이벤트는 보통 수 초 내 전달되지만 <B>1분 이상 걸릴 수도</B>{" "}
            있습니다.
          </>,
        ]}
      />
      <Panel
        t="S3 EVENT → LAMBDA → DYNAMODB (대표 시험 패턴)"
        note="새 객체가 업로드될 때마다 Lambda가 메타데이터를 추출해 DynamoDB 테이블(또는 RDS)에 기록하는 패턴이 자주 출제됩니다."
      >
        <Flow>
          <Node t="S3 버킷" s="새 파일 업로드 이벤트" c="teal" w={150} />
          <Arr l="이벤트 알림 (비동기)" w={128} />
          <Node t="Lambda" s="메타데이터 추출·가공" c="orange" w={150} />
          <Arr l="기록" w={72} />
          <Node t="DynamoDB" s="메타데이터 테이블" c="purple" w={140} />
        </Flow>
      </Panel>
      <Note k="warn">
        <B>버저닝이 꺼진 버킷</B>에서 같은 객체에 <B>동시에 두 번 쓰기</B>가
        일어나면 이벤트 알림이 <B>1건 유실</B>될 수 있습니다. 모든 이벤트를
        빠짐없이 받으려면 <B>버저닝(Versioning)을 활성화</B>하세요 — 그대로
        출제되는 포인트입니다.
      </Note>
    </Sec>
  );
}

/* ══════════════════════ 08 이벤트 소스 매핑 ══════════════════════ */

function S_ESM() {
  return (
    <Sec id="esm">
      <P>
        <B>이벤트 소스 매핑(Event Source Mapping)</B>은 Lambda가{" "}
        <B>직접 폴링(poll)</B>해서 레코드를 가져와야 하는 소스에 사용됩니다.
        대상은 딱 3가지 — <B>Kinesis Data Streams</B>, <B>DynamoDB Streams</B>,{" "}
        <B>SQS(+ SQS FIFO)</B>. 이때 함수는 <B>동기식으로 호출</B>됩니다.
      </P>
      <Panel
        t="EVENT SOURCE MAPPER — LAMBDA가 폴링한다"
        note="이벤트 소스 매퍼는 Lambda 서비스 내부 구성 요소로, 소스에서 배치(batch)를 만들어 함수를 동기 호출합니다."
      >
        <Flow>
          <Node
            t="Kinesis / DDB Streams / SQS"
            s="이벤트 소스"
            c="teal"
            w={196}
          />
          <Arr l="② 배치 반환" r="① 폴링 (poll)" w={120} left />
          <GBox t="Lambda Service" c="orange">
            <Flow>
              <Node t="Event Source Mapping" s="배치 구성" w={168} />
              <Arr l="③ 배치와 함께 동기 호출" w={150} />
              <Node t="Lambda" s="함수" c="orange" w={104} />
            </Flow>
          </GBox>
        </Flow>
      </Panel>

      <H3>유형 ① — 스트림 (Kinesis & DynamoDB Streams)</H3>
      <UL
        items={[
          <>
            <B>샤드(shard)마다 iterator</B>를 생성해 순서대로 처리 —{" "}
            <B>샤드 수준에서 순서 보장</B>.
          </>,
          <>
            읽기 시작 위치: <B>새 항목만</B> /{" "}
            <B>샤드 처음부터(TRIM_HORIZON)</B> / <B>특정 타임스탬프부터</B>.
          </>,
          <>
            처리된 항목은 <B>스트림에서 삭제되지 않음</B> — 다른 소비자도 같은
            데이터를 읽을 수 있습니다.
          </>,
          <>
            트래픽이 적으면 <B>배치 윈도우</B>로 레코드를 모아서 호출, 처리량을
            높이려면 <B>샤드당 최대 10개 배치를 병렬 처리</B>(파티션 키 수준
            순서는 유지).
          </>,
        ]}
      />
      <H3>스트림의 오류 처리 (초빈출)</H3>
      <UL
        items={[
          <>
            기본 동작: 오류 발생 시{" "}
            <B>성공하거나 항목이 만료될 때까지 배치 전체를 재처리</B> — 그동안{" "}
            <B>해당 샤드의 처리가 일시 중지</B>됩니다(순서 보장 때문).
          </>,
          <>
            이벤트 소스 매핑에서 설정 가능: <B>discard old events</B>(오래된
            이벤트 폐기) · <B>restrict retries</B>(재시도 횟수 제한) ·{" "}
            <B>split batch on error</B>(오류 시 배치 분할 — Lambda 타임아웃
            우회에 유용).
          </>,
          <>
            폐기된 이벤트는 <B>Destination</B>으로 보낼 수 있습니다.
          </>,
        ]}
      />

      <H3>유형 ② — 큐 (SQS & SQS FIFO)</H3>
      <UL
        items={[
          <>
            이벤트 소스 매핑이 <B>롱 폴링(Long Polling)</B>으로 SQS를 폴링하며,{" "}
            <B>배치 크기 1~10</B>을 지정합니다.
          </>,
          <>
            <B>가시성 타임아웃은 함수 타임아웃의 6배</B>로 설정 권장 — 그대로
            계산 문제가 나옵니다.
          </>,
          <>
            실패 메시지용 DLQ: <B>SQS 큐 자체에 DLQ를 설정</B>해야 합니다 —{" "}
            <B>Lambda의 DLQ는 비동기 호출 전용</B>이라 여기선 동작하지 않음(핵심
            함정). 또는 Lambda <B>Destination</B> 사용.
          </>,
        ]}
      />
      <Panel t="SQS + LAMBDA 실패 처리 — DLQ는 'SQS 쪽'에">
        <Flow>
          <Node
            t="SQS 큐"
            s="가시성 타임아웃 = 함수 타임아웃 × 6"
            c="teal"
            w={196}
          />
          <Arr l="폴링 → 배치 (1~10)" w={128} />
          <Node t="Lambda" s="동기 처리" c="orange" w={116} />
          <Arr l="반복 실패" d w={96} c="#C43D3D" />
          <Node t="SQS DLQ" s="큐에 설정된 DLQ" c="purple" w={136} />
        </Flow>
      </Panel>
      <H3>큐의 처리 특성</H3>
      <UL
        items={[
          <>
            <B>FIFO 큐</B>: 메시지{" "}
            <B>그룹 ID(GroupID)가 같은 메시지는 순서대로</B> 처리되며,{" "}
            <B>활성 메시지 그룹 수만큼</B> 함수가 스케일링됩니다.
          </>,
          <>
            <B>표준(Standard) 큐</B>: 순서 보장 없음, 최대한 빠르게 확장.
          </>,
          <>
            오류 시 배치는 <B>개별 항목 단위로 큐에 복귀</B>하며, 이미 성공한
            항목이 <B>다시 수신될 수 있음</B> → 처리 로직은 <B>멱등</B>해야
            합니다.
          </>,
          <>
            항목이 성공적으로 처리되면 <B>Lambda가 큐에서 항목을 삭제</B>합니다.
          </>,
        ]}
      />

      <H3>스케일링 요약 (표로 암기)</H3>
      <Tbl
        head={["소스", "동시성 / 스케일링", "순서 보장"]}
        rows={[
          [
            "Kinesis / DynamoDB Streams",
            <>
              샤드당 Lambda 호출 1개 · 병렬화 시 <B>샤드당 최대 10개 배치</B>
            </>,
            "샤드(병렬화 시 파티션 키) 수준",
          ],
          [
            "SQS Standard",
            <>
              <B>분당 60개씩 인스턴스 추가</B> · 최대{" "}
              <B>1,000개 배치 동시 처리</B>
            </>,
            "없음",
          ],
          [
            "SQS FIFO",
            <>
              <B>활성 메시지 그룹 수</B>만큼 스케일링
            </>,
            "메시지 그룹 ID 수준",
          ],
        ]}
        minW={620}
      />
      <Note k="mem">
        구분법 암기: <B>S3·SNS·EventBridge = 비동기(푸시)</B> vs{" "}
        <B>Kinesis·DDB Streams·SQS = 이벤트 소스 매핑(폴링, 동기)</B>. 이 구분
        자체가 가장 자주 출제됩니다.
      </Note>
    </Sec>
  );
}

/* ══════════════════════ 09 이벤트 & 컨텍스트 객체 ══════════════════════ */

function S_EventCtx() {
  return (
    <Sec id="eventctx">
      <P>
        Lambda 핸들러는 두 개의 인자를 받습니다 —{" "}
        <B>이벤트 객체(Event Object)</B>와 <B>컨텍스트 객체(Context Object)</B>.
        이 둘의 구분 문제가 종종 출제됩니다.
      </P>
      <Panel t="HANDLER(EVENT, CONTEXT)">
        <Flow>
          <Node t="호출 서비스" s="EventBridge, S3, SQS ..." c="teal" w={160} />
          <Arr l="이벤트 데이터 + 런타임 정보" w={160} />
          <Node
            t="lambda_handler(event, context)"
            s="함수 런타임이 두 객체를 주입"
            c="orange"
            w={230}
          />
        </Flow>
      </Panel>
      <Tbl
        head={["구분", "Event Object", "Context Object"]}
        rows={[
          [
            "내용",
            "호출한 서비스가 보낸 '데이터' (JSON)",
            "호출·런타임에 대한 '메타데이터'",
          ],
          [
            "예시",
            "호출 서비스, 리전, 레코드 목록, 요청 본문",
            "요청 ID, 함수 이름, 메모리, 로그 그룹/스트림",
          ],
          [
            "대표 필드",
            <M>Records, source, detail-type</M>,
            <M>aws_request_id, function_name, memory_limit_in_mb</M>,
          ],
        ]}
        minW={620}
      />
      <H3>컨텍스트 주요 속성 (Python 기준)</H3>
      <UL
        items={[
          <>
            <M>context.aws_request_id</M> — 호출 요청 ID,
          </>,
          <>
            <M>context.function_name</M> / <M>context.memory_limit_in_mb</M> —
            함수 이름·메모리,
          </>,
          <>
            <M>context.log_group_name</M> / <M>context.log_stream_name</M> —
            CloudWatch 로그 위치,
          </>,
          <>
            <M>context.get_remaining_time_in_millis()</M> —{" "}
            <B>남은 실행 시간(ms)</B> — 타임아웃 직전 정리 작업 구현에 사용(시험
            포인트).
          </>,
        ]}
      />
      <Code t="Python — 두 객체 사용 예">{`def lambda_handler(event, context):
    print("Event:", event)                      # 서비스가 보낸 데이터
    print("Request ID:", context.aws_request_id)
    print("남은 시간(ms):", context.get_remaining_time_in_millis())
    return {"statusCode": 200}`}</Code>
    </Sec>
  );
}

/* ══════════════════════ 10 Lambda 목적지 ══════════════════════ */

function S_Dest() {
  return (
    <Sec id="dest">
      <P>
        <B>목적지(Destinations, 2019년 11월+)</B>는 호출 결과(성공/실패)를 다른
        서비스로 보내는 기능입니다. 적용 대상은 두 가지 경우입니다.
      </P>
      <H3>① 비동기 호출 — 성공/실패 각각 지정</H3>
      <Panel
        t="ASYNC INVOCATION DESTINATIONS"
        note="성공과 실패에 서로 다른 목적지를 지정할 수 있으며, 대상은 SQS · SNS · Lambda · EventBridge 4종입니다."
      >
        <Fan
          from={<Node t="Lambda" s="비동기 호출 처리" c="orange" w={140} />}
          branches={[
            [
              { l: "✓ 성공 시", w: 104, c: "#2E7D4F" },
              <Node
                t="성공 목적지"
                s="SQS · SNS · Lambda · EventBridge"
                c="purple"
                w={220}
              />,
            ],
            [
              { l: "✗ 실패 시", w: 104, c: "#C43D3D" },
              <Node
                t="실패 목적지"
                s="SQS · SNS · Lambda · EventBridge"
                c="purple"
                w={220}
              />,
            ],
          ]}
        />
      </Panel>
      <H3>② 이벤트 소스 매핑 — 폐기된 배치</H3>
      <UL
        items={[
          <>
            처리 불가능하여 <B>폐기(discard)된 이벤트 배치</B>를{" "}
            <B>SQS 또는 SNS</B>로 전송할 수 있습니다.
          </>,
        ]}
      />
      <H3>DLQ vs Destinations (빈출 비교)</H3>
      <Tbl
        head={["항목", "DLQ", "Destinations"]}
        rows={[
          [
            "적용 범위",
            "비동기 호출의 '실패'만",
            "비동기 '성공+실패' 모두 + ESM 폐기 배치",
          ],
          ["대상", "SQS · SNS (2종)", "SQS · SNS · Lambda · EventBridge (4종)"],
          [
            "전송 정보",
            "이벤트 본문 위주",
            "호출 컨텍스트·응답 등 더 풍부한 정보",
          ],
          ["AWS 권장", "레거시", <B>Destinations 사용 권장</B>],
        ]}
        minW={600}
      />
      <Note k="tip">
        "실패한 비동기 이벤트를 더 많은 컨텍스트와 함께 다른 서비스로 보내려면?"
        → <B>Destinations</B>. "성공 결과도 라우팅하려면?" → 역시{" "}
        <B>Destinations</B>(DLQ는 불가).
      </Note>
    </Sec>
  );
}

/* ══════════════════════ 11 권한 — IAM 역할 & 리소스 정책 ══════════════════════ */

function S_Perm() {
  return (
    <Sec id="perm">
      <P>
        Lambda 권한은 방향이 다른 두 축으로 이해해야 합니다 —{" "}
        <B>실행 역할(함수가 밖으로)</B>과 <B>리소스 기반 정책(밖에서 함수로)</B>
        .
      </P>
      <Panel
        t="두 방향의 권한 — 반드시 구분"
        note="함수가 다른 서비스를 '읽고 쓰는' 권한은 실행 역할, 다른 서비스·계정이 함수를 '호출하는' 권한은 리소스 기반 정책입니다."
      >
        <Col gap={18}>
          <Flow>
            <Node t="Lambda 함수" c="orange" w={130} />
            <Arr l="실행 역할 (Execution Role)" w={168} />
            <Node
              t="AWS 서비스 접근"
              s="S3 · DynamoDB · SQS 등에 읽기/쓰기"
              c="purple"
              w={230}
            />
          </Flow>
          <Flow>
            <Node
              t="다른 서비스 · 다른 계정"
              s="S3, ALB, 계정 B ..."
              c="teal"
              w={180}
            />
            <Arr l="리소스 기반 정책 (Resource-Based Policy)" w={230} />
            <Node t="Lambda 함수 호출" c="orange" w={140} />
          </Flow>
        </Col>
      </Panel>
      <H3>① 실행 역할 (IAM Role)</H3>
      <UL
        items={[
          <>
            함수에 <B>반드시 하나의 IAM 역할</B>을 연결해야 하며, 이 역할이 AWS
            서비스·리소스 접근 권한을 부여합니다.
          </>,
          <>
            <B>이벤트 소스 매핑</B>을 쓰는 경우(Kinesis·DDB Streams·SQS),
            Lambda가 소스를 <B>읽어오는 권한도 실행 역할</B>에 있어야 합니다 —
            폴링 주체가 Lambda이기 때문입니다.
          </>,
        ]}
      />
      <H3>자주 쓰는 관리형 정책 (이름 눈에 익히기)</H3>
      <Chips
        items={[
          "AWSLambdaBasicExecutionRole (CW Logs 업로드)",
          "AWSLambdaKinesisExecutionRole",
          "AWSLambdaDynamoDBExecutionRole",
          "AWSLambdaSQSQueueExecutionRole",
          "AWSLambdaVPCAccessExecutionRole",
          "AWSXRayDaemonWriteAccess",
        ]}
        mono
      />
      <H3>② 리소스 기반 정책</H3>
      <UL
        items={[
          <>
            다른 계정·다른 AWS 서비스가 내 Lambda를 <B>호출(invoke)·조회</B>할
            수 있게 허용합니다.
          </>,
          <>
            접근 허용 조건: 호출 주체(principal)의 <B>IAM 정책이 허용</B>하거나{" "}
            <B>OR</B> 함수의 <B>리소스 기반 정책이 허용</B>하면 됩니다.
          </>,
          <>
            예: S3 버킷이 이벤트 알림으로 Lambda를 호출하려면{" "}
            <B>리소스 기반 정책</B>이 필요합니다.
          </>,
        ]}
      />
      <Note k="mem">
        정리: 서비스가 함수를 <B>직접 호출(비동기·동기 푸시)</B> →{" "}
        <B>리소스 기반 정책</B>. Lambda가 소스를 <B>폴링(ESM)</B> →{" "}
        <B>실행 역할</B>. 이 한 줄이 권한 문제의 정답 키입니다.
      </Note>
    </Sec>
  );
}

/* ══════════════════════ 12 환경 변수 ══════════════════════ */

function S_Env() {
  return (
    <Sec id="env">
      <UL
        items={[
          <>
            <B>환경 변수</B>는 <B>문자열 키/값</B> 쌍으로,{" "}
            <B>코드를 재배포하지 않고</B> 함수 동작을 조정할 수 있게 합니다.
          </>,
          <>Lambda 서비스 자체도 시스템 환경 변수를 추가합니다.</>,
          <>
            <B>비밀 값 저장 가능</B> — KMS로 암호화: <B>Lambda 서비스 키</B>{" "}
            또는 <B>고객 관리형 키(CMK)</B> 선택.
          </>,
          <>
            총 용량 제한: <OM>4KB</OM> (Limits 섹션과 함께 암기).
          </>,
        ]}
      />
      <Code t="Python — 환경 변수 읽기">{`import os

def lambda_handler(event, context):
    return os.environ.get("ENVIRONMENT_NAME")`}</Code>
      <Note k="tip">
        "환경별(dev/prod) 설정을 코드 수정 없이 바꾸고 싶다" → 환경 변수. "환경
        변수에 담긴 비밀을 보호하려면?" → <B>KMS 암호화</B>.
      </Note>
    </Sec>
  );
}

/* ══════════════════════ 13 모니터링 & X-Ray ══════════════════════ */

function S_Mon() {
  return (
    <Sec id="mon">
      <H3>CloudWatch Logs & Metrics</H3>
      <UL
        items={[
          <>
            Lambda <B>실행 로그는 CloudWatch Logs에 자동 저장</B> — 단, 실행
            역할에 <B>로그 쓰기 권한(IAM 정책)</B>이 있어야 합니다.{" "}
            <M>AWSLambdaBasicExecutionRole</M>이 기본 제공.
          </>,
          <>
            CloudWatch 지표:{" "}
            <B>Invocations, Durations, Concurrent Executions</B>(호출·시간·동시
            실행), <B>Error count, Success Rates, Throttles</B>
            (오류·성공률·스로틀), <B>Async Delivery Failures</B>
            (DeadLetterErrors), <B>Iterator Age</B>(Kinesis·DDB Streams 지연 —
            스트림 처리가 밀리는지 확인).
          </>,
        ]}
      />
      <H3>X-Ray 추적 활성화</H3>
      <Panel
        t="LAMBDA + X-RAY"
        note="Active Tracing을 켜면 Lambda가 X-Ray 데몬을 대신 실행해주고, 코드에서는 X-Ray SDK만 사용하면 됩니다."
      >
        <Flow>
          <Node t="Lambda" s="Active Tracing 활성화" c="orange" w={168} />
          <Arr l="X-Ray 데몬 자동 실행 → 세그먼트 전송" w={210} />
          <Node t="AWS X-Ray" s="트레이스 시각화" c="purple" w={140} />
        </Flow>
      </Panel>
      <UL
        items={[
          <>
            설정 방법: Lambda 구성에서 <B>Active Tracing</B> 활성화 + 코드에{" "}
            <B>X-Ray SDK</B> 사용.
          </>,
          <>
            IAM 실행 역할에 관리형 정책 <OM>AWSXRayDaemonWriteAccess</OM> 필요.
          </>,
        ]}
      />
      <H3>X-Ray 환경 변수 3종 (시험에 그대로 출제)</H3>
      <Tbl
        head={["환경 변수", "의미"]}
        rows={[
          [<M>_X_AMZN_TRACE_ID</M>, "추적 헤더(트레이스 ID) 포함"],
          [
            <M>AWS_XRAY_CONTEXT_MISSING</M>,
            <>
              컨텍스트 누락 시 동작 — 기본값 <OM>LOG_ERROR</OM>
            </>,
          ],
          [
            <M>AWS_XRAY_DAEMON_ADDRESS</M>,
            <>
              X-Ray 데몬의 <B>IP:PORT</B> 주소
            </>,
          ],
        ]}
        minW={540}
      />
    </Sec>
  );
}

/* ══════════════════════ 14 Lambda@Edge & CloudFront Functions ══════════════════════ */

function S_Edge() {
  return (
    <Sec id="edge">
      <P>
        CloudFront에서 실행하는 <B>엣지 함수(Edge Functions)</B>는 두 종류입니다
        — <B>CloudFront Functions</B>와 <B>Lambda@Edge</B>. 요청/응답을 엣지에서
        변형해 <B>지연 시간을 최소화</B>하며, 서버 관리가 없고 사용한 만큼만
        과금됩니다.
      </P>
      <H3>4가지 이벤트 지점 (그림으로 암기)</H3>
      <Panel
        t="CLOUDFRONT의 4개 후크 지점"
        note="CloudFront Functions는 ①④(Viewer 쪽)만, Lambda@Edge는 ①~④ 전부에 개입할 수 있습니다."
      >
        <Flow>
          <Node t="클라이언트" c="teal" w={104} />
          <Arr l="① Viewer Request" r="④ Viewer Response" w={136} />
          <Node t="CloudFront" s="엣지 로케이션" w={124} />
          <Arr l="② Origin Request" r="③ Origin Response" w={136} />
          <Node t="Origin" s="S3 / ALB / 서버" c="purple" w={116} />
        </Flow>
      </Panel>
      <H3>비교표 (빈출 — 숫자까지 기억)</H3>
      <Tbl
        head={["항목", "CloudFront Functions", "Lambda@Edge"]}
        rows={[
          ["런타임", "JavaScript 전용", "Node.js, Python"],
          ["규모", "초당 수백만 요청", "초당 수천 요청"],
          [
            "트리거",
            <>
              ①④ — <B>Viewer Request/Response만</B>
            </>,
            "①②③④ 전부",
          ],
          ["최대 실행 시간", <OM>{"1ms 미만"}</OM>, "5~10초"],
          ["메모리", "2MB", "128MB ~ 10GB"],
          ["코드 크기", "10KB", "1MB ~ 50MB"],
          ["네트워크·파일시스템 접근", "불가", "가능"],
          ["요청 바디(Body) 접근", "불가", "가능"],
          [
            "가격",
            <>
              무료 티어 있음 · <B>@Edge 대비 약 1/6 비용</B>
            </>,
            "무료 티어 없음",
          ],
        ]}
        minW={640}
      />
      <H3>사용 사례</H3>
      <UL
        items={[
          <>
            <B>CloudFront Functions</B> — 캐시 키 정규화, 헤더 조작, URL
            재작성/리디렉션, <B>요청 인증·인가(JWT 검사 같은 초경량 로직)</B>.
          </>,
          <>
            <B>Lambda@Edge</B> — 수 ms 이상 걸리는 로직,{" "}
            <B>외부 서비스·파일시스템·바디 접근</B>이 필요한 처리, 조정 가능한
            CPU/메모리, 써드파티 라이브러리 의존 코드.
          </>,
          <>
            Lambda@Edge 함수는 <B>us-east-1 리전에서 작성</B>하면 CloudFront가{" "}
            <B>전 세계 엣지로 복제</B>합니다.
          </>,
        ]}
      />
      <Note k="tip">
        선택 기준 한 줄:{" "}
        <B>"1ms 미만·뷰어 단계·초경량" → CloudFront Functions</B>,{" "}
        <B>"오리진 단계·네트워크/바디 필요·무거움" → Lambda@Edge</B>.
      </Note>
    </Sec>
  );
}

/* ══════════════════════ 15 VPC의 Lambda ══════════════════════ */

function S_VPC() {
  return (
    <Sec id="vpc">
      <P>
        기본적으로 Lambda는 <B>AWS 소유의 VPC(내 VPC 밖)</B>에서 실행됩니다.
        그래서 <B>퍼블릭 인터넷·퍼블릭 API·DynamoDB 등에는 접근</B>할 수 있지만,{" "}
        <B>
          내 VPC 안의 리소스(RDS, ElastiCache, 내부 ELB 등)에는 접근할 수
          없습니다.
        </B>
      </P>
      <H3>VPC에 Lambda 배치하기</H3>
      <UL
        items={[
          <>
            <B>VPC ID · 서브넷 · 보안 그룹</B>을 지정하면, Lambda가 서브넷에{" "}
            <B>ENI(Elastic Network Interface)</B>를 생성해 VPC 리소스에
            접근합니다.
          </>,
          <>
            ENI 생성을 위해 실행 역할에 <OM>AWSLambdaVPCAccessExecutionRole</OM>{" "}
            필요.
          </>,
        ]}
      />
      <Panel t="VPC 내 LAMBDA → RDS 접근">
        <Flow>
          <GBox t="VPC — Private Subnet" c="teal">
            <Flow>
              <Node t="Lambda" s="ENI 통해 연결" c="orange" w={128} />
              <Arr l="SG 허용" w={84} />
              <Node t="Amazon RDS" s="프라이빗 DB" c="purple" w={128} />
            </Flow>
          </GBox>
        </Flow>
      </Panel>
      <H3>VPC 내 Lambda의 인터넷 접근 (초빈출 함정)</H3>
      <Note k="warn">
        <B>
          퍼블릭 서브넷에 배치해도 Lambda는 공인 IP를 갖지 못하며 인터넷에
          접근할 수 없습니다
        </B>{" "}
        — EC2와 다른 점이자 가장 유명한 시험 함정. 인터넷이 필요하면{" "}
        <B>프라이빗 서브넷 + NAT Gateway/Instance</B>를 사용해야 합니다.
      </Note>
      <Panel
        t="VPC LAMBDA의 인터넷 경로"
        note="DynamoDB 등 AWS 서비스는 NAT 없이 'VPC 엔드포인트'로 프라이빗하게 접근할 수도 있습니다. CloudWatch Logs 전송은 NAT·엔드포인트 없이도 동작합니다."
      >
        <Flow>
          <GBox t="Private Subnet" c="teal">
            <Node t="Lambda + ENI" c="orange" w={124} />
          </GBox>
          <Arr l="아웃바운드" w={92} />
          <Node t="NAT Gateway" s="Public Subnet" w={126} />
          <Arr l="라우팅" w={78} />
          <Node t="IGW" s="Internet Gateway" w={112} />
          <Arr w={64} />
          <Node t="인터넷" c="purple" w={96} />
        </Flow>
      </Panel>
      <UL
        items={[
          <>
            AWS 서비스에 프라이빗 접근: <B>VPC 엔드포인트</B> 사용(NAT 불필요) —
            예: DynamoDB Gateway Endpoint.
          </>,
          <>
            <B>CloudWatch Logs</B>는 엔드포인트나 NAT가 없어도 정상 동작합니다.
          </>,
        ]}
      />
    </Sec>
  );
}

/* ══════════════════════ 16 함수 성능 ══════════════════════ */

function S_Perf() {
  return (
    <Sec id="perf">
      <H3>RAM과 vCPU의 관계 (초빈출)</H3>
      <UL
        items={[
          <>
            RAM: <OM>128MB ~ 10,240MB(10GB)</OM>, <B>1MB 단위</B>로 조정.
          </>,
          <>
            RAM을 늘리면 <B>vCPU가 비례해서 함께</B> 늘어납니다 — CPU는 직접
            설정 불가!
          </>,
          <>
            <OM>1,792MB</OM>에서 <B>1 vCPU 풀 성능</B>에 도달. 그 이상에서는
            vCPU가 2개 이상이 되므로 <B>멀티스레딩 코드를 작성해야 활용</B>{" "}
            가능.
          </>,
          <>
            <B>CPU 바운드(계산 위주) 작업이 느리면 → RAM을 늘려라</B>가 정답
            패턴입니다.
          </>,
        ]}
      />
      <Panel t="RAM ↑ = vCPU ↑ (비례 관계)">
        <svg
          viewBox="0 0 560 190"
          width="560"
          height="190"
          role="img"
          aria-label="RAM과 vCPU 비례 그래프"
        >
          <line
            x1="52"
            y1="150"
            x2="530"
            y2="150"
            stroke="#7E8FA3"
            strokeWidth="1.5"
          />
          <line
            x1="52"
            y1="150"
            x2="52"
            y2="20"
            stroke="#7E8FA3"
            strokeWidth="1.5"
          />
          <line
            x1="52"
            y1="150"
            x2="500"
            y2="34"
            stroke="#E8710D"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="128" cy="123" r="4.5" fill="#131C2B" />
          <text
            x="128"
            y="110"
            textAnchor="middle"
            fontSize="10.5"
            fontFamily="monospace"
            fill="#131C2B"
            fontWeight="700"
          >
            1,792MB = 1 vCPU
          </text>
          <circle cx="500" cy="34" r="4.5" fill="#E8710D" />
          <text
            x="470"
            y="24"
            textAnchor="middle"
            fontSize="10.5"
            fontFamily="monospace"
            fill="#C25E07"
            fontWeight="700"
          >
            10,240MB ≈ 6 vCPU
          </text>
          <text
            x="60"
            y="168"
            fontSize="10"
            fontFamily="monospace"
            fill="#5E6E80"
          >
            128MB
          </text>
          <text
            x="480"
            y="168"
            fontSize="10"
            fontFamily="monospace"
            fill="#5E6E80"
          >
            10,240MB
          </text>
          <text
            x="292"
            y="184"
            textAnchor="middle"
            fontSize="10.5"
            fontFamily="monospace"
            fill="#5E6E80"
            fontWeight="700"
          >
            RAM →
          </text>
          <text
            x="20"
            y="88"
            fontSize="10.5"
            fontFamily="monospace"
            fill="#5E6E80"
            fontWeight="700"
            transform="rotate(-90 20 88)"
          >
            vCPU →
          </text>
        </svg>
      </Panel>
      <H3>타임아웃</H3>
      <UL
        items={[
          <>
            기본 <OM>3초</OM>, 최대 <OM>900초 = 15분</OM>.
          </>,
          <>
            15분을 넘는 작업은 Lambda가 <B>부적합</B> →{" "}
            <B>Fargate·ECS·EC2, 또는 Step Functions로 분할</B>이 정답.
          </>,
        ]}
      />
      <H3>실행 컨텍스트(Execution Context) 재사용 — 코드 문제 단골</H3>
      <P>
        실행 컨텍스트는 <B>일정 시간 유지</B>되어 다음 호출에서 재사용됩니다.
        따라서 <B>DB 연결, SDK 클라이언트, HTTP 클라이언트</B> 등 무거운
        초기화는 <B>핸들러 밖</B>에 두어야 합니다.
      </P>
      <Code t="✗ BAD — 매 호출마다 DB 연결 생성">{`def get_user_handler(event, context):
    db = db_connect()          # 호출될 때마다 연결 생성 → 느림
    return db.get(event["id"])`}</Code>
      <Code t="✓ GOOD — 핸들러 밖에서 1회 초기화, 컨텍스트 재사용">{`db = db_connect()              # 초기화 시 1회 실행, 이후 호출에서 재사용

def get_user_handler(event, context):
    return db.get(event["id"])`}</Code>
      <H3>/tmp 공간</H3>
      <UL
        items={[
          <>
            임시 디스크: <OM>512MB ~ 10GB</OM>. 큰 파일 다운로드·디스크 작업용.
          </>,
          <>
            실행 컨텍스트가 유지되는 동안 <B>내용이 남아</B> 캐시처럼 쓸 수
            있음(체크포인트 등).
          </>,
          <>
            <B>영구 저장</B>이 필요하면 <B>S3</B>를 사용. /tmp 데이터 암호화는{" "}
            <B>KMS Data Key</B> 직접 생성으로.
          </>,
        ]}
      />
    </Sec>
  );
}

/* ══════════════════════ 17 레이어 ══════════════════════ */

function S_Layers() {
  return (
    <Sec id="layers">
      <P>
        <B>Lambda 레이어(Layers)</B>의 용도는 두 가지입니다.
      </P>
      <UL
        items={[
          <>
            <B>커스텀 런타임</B> 지원 — 예: C++, Rust.
          </>,
          <>
            <B>종속성(라이브러리) 재사용</B> — 무거운 라이브러리를 레이어로
            분리하면 함수 패키지가 가벼워지고,{" "}
            <B>여러 함수가 같은 레이어를 참조</B>할 수 있으며 라이브러리를 매번
            다시 패키징할 필요가 없습니다.
          </>,
        ]}
      />
      <Panel
        t="레이어 공유 구조"
        note="애플리케이션 코드(자주 바뀜)와 라이브러리(가끔 바뀜)를 분리하는 것이 핵심입니다."
      >
        <Flow>
          <Col gap={8}>
            <Node t="함수 A" s="앱 코드만 (가벼움)" c="orange" w={150} />
            <Node t="함수 B" s="앱 코드만 (가벼움)" c="orange" w={150} />
          </Col>
          <Arr l="공통 참조" d w={100} />
          <Node
            t="Layer 1 · Layer 2"
            s="무거운 라이브러리 · 커스텀 런타임"
            c="purple"
            w={210}
          />
        </Flow>
      </Panel>
      <Note k="mem">
        한도: 함수당 <B>최대 5개 레이어</B>, 함수+레이어 압축 해제 합계{" "}
        <B>250MB</B>까지.
      </Note>
    </Sec>
  );
}

/* ══════════════════════ 18 파일 시스템 마운트 (EFS) ══════════════════════ */

function S_FS() {
  return (
    <Sec id="fs">
      <UL
        items={[
          <>
            Lambda는 <B>VPC 안에서 실행될 때</B> 같은 VPC의{" "}
            <B>EFS 파일 시스템</B>을 로컬 경로에 마운트할 수 있습니다.
          </>,
          <>
            마운트에는 <B>EFS Access Point</B> 구성이 필수입니다.
          </>,
          <>
            주의: 함수 인스턴스 하나가 <B>연결 1개</B>를 사용 →{" "}
            <B>EFS 연결 한도·연결 버스트 한도</B>에 걸릴 수 있음(동시성 폭증
            시).
          </>,
        ]}
      />
      <Panel t="LAMBDA + EFS (VPC 필수)">
        <Flow>
          <GBox t="VPC" c="teal">
            <Flow>
              <Node t="Lambda" s="VPC 구성 필수" c="orange" w={128} />
              <Arr l="EFS Access Point" w={130} />
              <Node t="Amazon EFS" s="공유 파일 시스템" c="purple" w={140} />
            </Flow>
          </GBox>
        </Flow>
      </Panel>
      <H3>스토리지 옵션 비교 (표 통째로 출제)</H3>
      <Tbl
        head={["항목", "임시 /tmp", "Lambda Layers", "Amazon S3", "Amazon EFS"]}
        rows={[
          ["최대 크기", "10,240MB", "5개 · 총 250MB", "무제한", "무제한"],
          [
            "지속성",
            "임시(Ephemeral)",
            "불변(Durable)",
            "영구(Durable)",
            "영구(Durable)",
          ],
          [
            "콘텐츠",
            "동적 데이터",
            "정적 라이브러리",
            "동적 객체",
            "동적 파일",
          ],
          [
            "가격",
            "10GB까지 포함",
            "포함",
            "저장·요청·전송 과금",
            "저장·전송·IOPS 과금",
          ],
          ["함수 간 공유", "불가", "가능", "가능(API)", "가능(파일시스템)"],
          [
            "접근 방식",
            "파일시스템",
            "런타임 포함",
            "AWS SDK",
            "VPC + Access Point",
          ],
        ]}
        minW={680}
      />
    </Sec>
  );
}

/* ══════════════════════ 19 동시성 ══════════════════════ */

function S_Conc() {
  return (
    <Sec id="conc">
      <H3>동시성과 스로틀링</H3>
      <UL
        items={[
          <>
            계정(리전)당 동시 실행 기본 한도: <OM>1,000</OM> — 상향 요청
            가능(Support Ticket).
          </>,
          <>
            함수별 <B>예약 동시성(Reserved Concurrency)</B> = 그 함수의 동시
            실행 상한 지정.
          </>,
          <>
            한도 초과 시 <B>스로틀(Throttle)</B>:{" "}
            <B>동기 호출 → 429 ThrottleError 반환</B>(호출자가 재시도),{" "}
            <B>비동기 호출 → 자동 재시도 후 실패 시 DLQ</B>.
          </>,
        ]}
      />
      <Panel
        t="동시성 풀 — 예약하지 않으면 생기는 일"
        note="한 함수가 트래픽 폭증으로 1,000을 다 쓰면, 같은 계정의 '다른 모든 함수'가 스로틀됩니다. 이것이 예약 동시성이 필요한 이유이며 시험 시나리오 단골입니다."
      >
        <Flow>
          <Node t="함수 A (폭증)" s="동시 실행 1,000 독점" c="orange" w={168} />
          <Arr l="계정 풀 고갈" w={110} c="#C43D3D" />
          <Node t="함수 B · C · D" s="스로틀 발생 (429)" c="slate" w={160} />
        </Flow>
      </Panel>
      <H3>비동기 호출 + 스로틀 상세</H3>
      <UL
        items={[
          <>
            동시성 부족으로 스로틀되면(429) 또는 시스템 오류(5xx) 시, 이벤트를{" "}
            <B>큐로 되돌리고 최대 6시간 동안 재시도</B>.
          </>,
          <>
            재시도 간격은 <B>지수 백오프: 1초 → 최대 5분</B>까지 증가.
          </>,
        ]}
      />
      <H3>콜드 스타트 & 프로비저닝된 동시성</H3>
      <UL
        items={[
          <>
            <B>콜드 스타트</B>: 새 인스턴스 기동 시 코드 로드 + 핸들러 밖 초기화
            실행 → 첫 요청 지연(초기화가 무겁면 수 초).
          </>,
          <>
            <B>프로비저닝된 동시성(Provisioned Concurrency)</B>: 호출 전에
            인스턴스를 미리 할당 → <B>콜드 스타트 제거</B>, 낮은 지연 보장.{" "}
            <B>Application Auto Scaling</B>으로 스케줄/사용률 기반 관리 가능.
          </>,
          <>
            참고: VPC Lambda의 콜드 스타트는 2019년 10~11월 개선으로 크게 감소.
          </>,
        ]}
      />
      <Panel t="COLD START vs PROVISIONED CONCURRENCY">
        <Col gap={14} style={{ minWidth: 480 }}>
          <div>
            <div
              style={{
                fontFamily: T.mono,
                fontSize: 10.5,
                fontWeight: 700,
                color: "#5E6E80",
                marginBottom: 5,
              }}
            >
              온디맨드 (첫 호출)
            </div>
            <div
              style={{
                display: "flex",
                height: 30,
                borderRadius: 7,
                overflow: "hidden",
                width: 460,
                border: "1px solid " + T.line,
              }}
            >
              <div
                style={{
                  width: 170,
                  background: "#8B5CF6",
                  color: "#fff",
                  fontSize: 10.5,
                  fontFamily: T.mono,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                초기화 (콜드 스타트)
              </div>
              <div
                style={{
                  flex: 1,
                  background: "#E8710D",
                  color: "#fff",
                  fontSize: 10.5,
                  fontFamily: T.mono,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                핸들러 실행
              </div>
            </div>
          </div>
          <div>
            <div
              style={{
                fontFamily: T.mono,
                fontSize: 10.5,
                fontWeight: 700,
                color: "#5E6E80",
                marginBottom: 5,
              }}
            >
              프로비저닝된 동시성
            </div>
            <div
              style={{
                display: "flex",
                height: 30,
                borderRadius: 7,
                overflow: "hidden",
                width: 460,
                border: "1px solid " + T.line,
              }}
            >
              <div
                style={{
                  width: 170,
                  background: "#E5E9F0",
                  color: "#5E6E80",
                  fontSize: 10.5,
                  fontFamily: T.mono,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                미리 초기화 완료
              </div>
              <div
                style={{
                  flex: 1,
                  background: "#2E7D4F",
                  color: "#fff",
                  fontSize: 10.5,
                  fontFamily: T.mono,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                즉시 실행 (지연 ↓)
              </div>
            </div>
          </div>
        </Col>
      </Panel>
    </Sec>
  );
}

/* ══════════════════════ 20 외부 종속성 ══════════════════════ */

function S_Deps() {
  return (
    <Sec id="deps">
      <UL
        items={[
          <>
            외부 라이브러리(X-Ray SDK, DB 클라이언트 등)는{" "}
            <B>코드와 함께 패키징(zip)</B>해서 업로드합니다.
          </>,
          <>
            zip이 <OM>50MB 미만</OM>이면 Lambda에 직접 업로드, 초과하면{" "}
            <B>S3에 올린 뒤 참조</B>.
          </>,
          <>
            <B>네이티브 라이브러리</B>는 <B>Amazon Linux에서 컴파일</B>해야
            동작.
          </>,
          <>
            <B>AWS SDK는 기본적으로 모든 Lambda에 포함</B> — 별도 패키징
            불필요(시험 포인트).
          </>,
        ]}
      />
      <Code t="Node.js — 종속성 패키징 & 배포 흐름">{`npm install aws-xray-sdk        # 종속성 설치 (node_modules 생성)
zip -r function.zip .           # 코드 + node_modules 압축

aws lambda update-function-code \\
  --function-name demo \\
  --zip-file fileb://function.zip   # 50MB 미만 직접 업로드 / 초과 시 S3 경유`}</Code>
    </Sec>
  );
}

/* ══════════════════════ 21 CloudFormation ══════════════════════ */

function S_CFN() {
  return (
    <Sec id="cfn">
      <P>CloudFormation으로 Lambda를 배포하는 방법은 두 가지입니다.</P>
      <H3>① 인라인 (Inline)</H3>
      <UL
        items={[
          <>
            템플릿의 <M>Code.ZipFile</M> 속성에 코드를 직접 작성 — 아주 간단한
            함수용.
          </>,
          <>
            <B>외부 종속성을 포함할 수 없음</B>(핵심 제약).
          </>,
        ]}
      />
      <Code t="YAML — 인라인 함수">{`Resources:
  MyFunction:
    Type: AWS::Lambda::Function
    Properties:
      Runtime: python3.x
      Handler: index.handler
      Code:
        ZipFile: |
          def handler(event, context):
              return "hello"`}</Code>
      <H3>② S3를 통한 배포</H3>
      <UL
        items={[
          <>
            zip을 S3에 업로드하고 템플릿에서 <M>S3Bucket</M> · <M>S3Key</M>
            (경로) · <M>S3ObjectVersion</M>을 참조.
          </>,
          <>
            <B>함정:</B> S3의 코드만 새로 올리고 템플릿의 버킷/키/버전을 안
            바꾸면 <B>CloudFormation은 함수를 업데이트하지 않습니다!</B> →{" "}
            <B>버킷 버저닝 활성화 + S3ObjectVersion을 매번 갱신</B>이 정답.
          </>,
        ]}
      />
      <Code t="YAML — S3 참조 (버전까지 명시)">{`Resources:
  MyFunction:
    Type: AWS::Lambda::Function
    Properties:
      Runtime: nodejs
      Handler: index.handler
      Code:
        S3Bucket: my-code-bucket
        S3Key: function.zip
        S3ObjectVersion: "AbCdEf123..."   # 새 코드 반영의 핵심`}</Code>
      <H3>다중 계정 배포</H3>
      <Panel
        t="계정 1의 S3 → 계정 2·3의 CLOUDFORMATION"
        note="계정 간 배포에는 ① S3 버킷 정책으로 다른 계정 허용 + ② 각 계정 CloudFormation 실행 역할에 S3 읽기 권한, 두 가지가 모두 필요합니다."
      >
        <Flow>
          <Node
            t="계정 1 — S3 버킷"
            s="버킷 정책: 계정 2·3 허용"
            c="teal"
            w={196}
          />
          <Arr l="GetObject" w={96} />
          <Node
            t="계정 2 · 3 — CloudFormation"
            s="실행 역할에 S3 읽기 권한"
            c="orange"
            w={210}
          />
        </Flow>
      </Panel>
    </Sec>
  );
}

/* ══════════════════════ 22 컨테이너 이미지 ══════════════════════ */

function S_Container() {
  return (
    <Sec id="container">
      <UL
        items={[
          <>
            함수를 <B>컨테이너 이미지</B>로 배포 가능 — 최대 <OM>10GB</OM>,
            이미지는 <B>ECR</B>에 저장.
          </>,
          <>
            큰 종속성·대용량 파일을 이미지에 담을 수 있어 복잡한 워크로드에
            적합.
          </>,
          <>
            이미지는 반드시 <B>Lambda Runtime API를 구현</B>해야 함 — AWS 제공
            베이스 이미지 사용: <B>Python, Node.js, Java, .NET, Go, Ruby</B>.
          </>,
          <>
            <B>Lambda Runtime Interface Emulator(RIE)</B>로 로컬에서 이미지를
            테스트할 수 있음.
          </>,
          <>통합 파이프라인: 앱 코드 + 컨테이너를 동일한 방식으로 빌드·배포.</>,
        ]}
      />
      <Code t="Dockerfile — AWS 베이스 이미지 사용">{`# AWS 제공 베이스 이미지 (Lambda Runtime API 구현 완료)
FROM public.ecr.aws/lambda/nodejs:18

# 함수 코드와 의존성 복사
COPY app.js package*.json ./
RUN npm install

# 핸들러 지정
CMD ["app.lambdaHandler"]`}</Code>
      <H3>모범 사례</H3>
      <UL
        items={[
          <>
            <B>AWS 베이스 이미지 사용</B> — 안정적이고, 이미 캐시되어 있을
            확률이 높아 빌드가 빠름.
          </>,
          <>
            <B>멀티 스테이지 빌드</B>로 최종 이미지를 가볍게.
          </>,
          <>
            레이어 순서: <B>안정적인 것 → 자주 바뀌는 것</B> 순으로 배치해 캐시
            활용 극대화.
          </>,
          <>
            이미지가 크면 <B>단일 리포지토리에 레이어를 공유</B>하며 관리.
          </>,
        ]}
      />
      <Note k="tip">
        "임의의 Docker 이미지를 실행하고 싶다" → <B>ECS/Fargate</B>. "Lambda로
        컨테이너를 쓰고 싶다" → <B>Lambda Runtime API 구현 + ECR + 10GB 한도</B>
        .
      </Note>
    </Sec>
  );
}

/* ══════════════════════ 23 버전 & Alias ══════════════════════ */

function S_Versions() {
  return (
    <Sec id="versions">
      <H3>버전 (Versions)</H3>
      <UL
        items={[
          <>
            작업 중인 함수는 <OM>$LATEST</OM> — <B>가변(mutable)</B>.
          </>,
          <>
            <B>게시(publish)</B>하면 버전 생성: V1, V2 ... —{" "}
            <B>불변(immutable)</B>. <B>코드 + 구성(환경 변수 포함)</B>이 함께
            고정되며, 각 버전은 <B>고유 ARN</B>을 갖고 독립적으로 호출 가능.
          </>,
        ]}
      />
      <H3>Alias — 버전을 가리키는 '이름표'</H3>
      <UL
        items={[
          <>
            Alias는 버전을 가리키는 <B>포인터</B>이며 <B>가변</B> — dev / test /
            prod 등으로 운영.
          </>,
          <>
            사용자에게 <B>안정적인 엔드포인트(ARN)</B>를 제공하면서, 뒤에서
            가리키는 버전만 교체해 <B>블루/그린 전환</B>.
          </>,
          <>
            <B>가중치(weight) 라우팅</B> 지원 — 예: V1 95% / V2 5%{" "}
            <B>카나리 배포</B>.
          </>,
          <>
            <B>Alias는 Alias를 참조할 수 없음</B> — 문장 그대로 출제되는 암기
            포인트.
          </>,
        ]}
      />
      <Panel
        t="VERSIONS & ALIASES"
        note="prod alias가 가중치로 트래픽을 나누는 카나리 구조. 사용자는 alias ARN만 바라보므로 배포가 사용자에게 투명합니다."
      >
        <Flow>
          <Node t="사용자" c="teal" w={96} />
          <Arr l="안정된 ARN 호출" w={116} />
          <Fan
            from={
              <Node
                t="Alias: prod"
                s="가변 포인터 · 가중치"
                c="orange"
                w={140}
              />
            }
            branches={[
              [
                { l: "95%", w: 76 },
                <Node t="V1" s="불변 버전" c="purple" w={104} />,
              ],
              [
                { l: "5% (카나리)", w: 76 },
                <Node t="V2" s="불변 버전" c="purple" w={104} />,
              ],
              [
                { l: "dev alias는", d: true, w: 76 },
                <Node t="$LATEST" s="가변 · 개발 중" c="slate" w={110} />,
              ],
            ]}
          />
        </Flow>
      </Panel>
    </Sec>
  );
}

/* ══════════════════════ 24 CodeDeploy ══════════════════════ */

function S_CodeDeploy() {
  return (
    <Sec id="codedeploy">
      <P>
        <B>CodeDeploy</B>는 Lambda <B>Alias의 트래픽 전환을 자동화</B>합니다.{" "}
        <B>SAM 프레임워크에 통합</B>되어 있습니다.
      </P>
      <H3>전략 3종</H3>
      <Tbl
        head={["전략", "동작", "예시"]}
        rows={[
          [
            <B>Linear</B>,
            "N분마다 트래픽을 일정 비율씩 증가",
            <>
              <M>Linear10PercentEvery3Minutes</M>,{" "}
              <M>Linear10PercentEvery10Minutes</M>
            </>,
          ],
          [
            <B>Canary</B>,
            "X%로 시험 후 → 100% 전환",
            <>
              <M>Canary10Percent5Minutes</M>, <M>Canary10Percent30Minutes</M>
            </>,
          ],
          [<B>AllAtOnce</B>, "즉시 100% 전환 (가장 빠르고 위험)", "—"],
        ]}
        minW={600}
      />
      <Panel t="LINEAR vs CANARY — 트래픽 곡선">
        <svg
          viewBox="0 0 560 170"
          width="560"
          height="170"
          role="img"
          aria-label="Linear와 Canary 트래픽 전환 곡선"
        >
          <line
            x1="46"
            y1="136"
            x2="530"
            y2="136"
            stroke="#7E8FA3"
            strokeWidth="1.5"
          />
          <line
            x1="46"
            y1="136"
            x2="46"
            y2="18"
            stroke="#7E8FA3"
            strokeWidth="1.5"
          />
          <polyline
            points="46,136 106,136 106,112 166,112 166,88 226,88 226,64 286,64 286,40 346,40 346,28 530,28"
            fill="none"
            stroke="#E8710D"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <polyline
            points="46,136 46,112 286,112 286,28 530,28"
            fill="none"
            stroke="#2E7D4F"
            strokeWidth="3"
            strokeDasharray="7 5"
            strokeLinejoin="round"
          />
          <text
            x="150"
            y="150"
            fontSize="10.5"
            fontFamily="monospace"
            fill="#C25E07"
            fontWeight="700"
          >
            Linear: 10%씩 계단 상승
          </text>
          <text
            x="330"
            y="150"
            fontSize="10.5"
            fontFamily="monospace"
            fill="#2E7D4F"
            fontWeight="700"
          >
            Canary: 10% 유지 → 한 번에 100%
          </text>
          <text
            x="30"
            y="30"
            fontSize="10"
            fontFamily="monospace"
            fill="#5E6E80"
            textAnchor="end"
          >
            100%
          </text>
          <text
            x="30"
            y="118"
            fontSize="10"
            fontFamily="monospace"
            fill="#5E6E80"
            textAnchor="end"
          >
            10%
          </text>
          <text
            x="288"
            y="14"
            fontSize="10.5"
            fontFamily="monospace"
            fill="#5E6E80"
          >
            신규 버전 트래픽 비율 ↑ / 시간 →
          </text>
        </svg>
      </Panel>
      <H3>롤백 & 후크</H3>
      <UL
        items={[
          <>
            <B>Pre / Post Traffic Hook</B>(Lambda 함수)으로 배포 전후 상태를
            검증.
          </>,
          <>
            <B>CloudWatch Alarm</B>이 울리면 <B>자동 롤백</B> — 기존 버전으로
            트래픽 복귀.
          </>,
        ]}
      />
      <H3>AppSpec.yml 필수 파라미터 (그대로 암기)</H3>
      <Code t="appspec.yml">{`Resources:
  - myLambdaFunction:
      Type: AWS::Lambda::Function
      Properties:
        Name: myLambdaFunction        # 함수 이름 (필수)
        Alias: myLambdaFunctionAlias  # 전환 대상 Alias (필수)
        CurrentVersion: "1"           # 현재 트래픽 버전 (필수)
        TargetVersion: "2"            # 전환할 새 버전 (필수)`}</Code>
      <Note k="mem">
        필수 4필드: <B>Name · Alias · CurrentVersion · TargetVersion</B>. "Alias
        트래픽 전환 자동화 도구는?" → <B>CodeDeploy</B>.
      </Note>
    </Sec>
  );
}

/* ══════════════════════ 25 함수 URL ══════════════════════ */

function S_Furl() {
  return (
    <Sec id="furl">
      <P>
        <B>함수 URL(Function URL)</B>은 API Gateway·ALB 없이 Lambda에{" "}
        <B>전용 HTTPS 엔드포인트</B>를 부여합니다.
      </P>
      <UL
        items={[
          <>
            형식:{" "}
            <M>
              https://&#123;url-id&#125;.lambda-url.&#123;region&#125;.on.aws
            </M>{" "}
            — 고유하며 변경되지 않음, IPv4·IPv6 지원.
          </>,
          <>
            <B>퍼블릭 인터넷 전용</B> — PrivateLink(VPC 내부 전용 접근)는{" "}
            <B>지원하지 않음</B>(시험 포인트).
          </>,
          <>
            <B>alias 또는 $LATEST</B>에만 설정 가능 — <B>특정 버전에는 불가</B>.
          </>,
          <>
            CORS 설정 지원, <B>리소스 기반 정책</B>으로 접근 제어(계정·IP CIDR
            등).
          </>,
          <>
            트래픽 제한이 필요하면 <B>Reserved Concurrency</B>로 스로틀.
          </>,
        ]}
      />
      <H3>AuthType 2가지</H3>
      <Tbl
        head={["AuthType", "동작"]}
        rows={[
          [
            <M>NONE</M>,
            "인증 없이 퍼블릭 접근 — 단, 리소스 기반 정책은 항상 존재하며 허용을 명시해야 함",
          ],
          [
            <M>AWS_IAM</M>,
            <>
              IAM으로 인증·인가. <B>동일 계정</B>: IAM 정책 <B>또는(OR)</B>{" "}
              리소스 정책 중 하나면 허용. <B>교차 계정</B>: IAM 정책{" "}
              <B>그리고(AND)</B> 리소스 정책 <B>둘 다</B> 필요 — 빈출!
            </>,
          ],
        ]}
        minW={600}
      />
      <Panel t="FUNCTION URL — 게이트웨이 없이 직접 노출">
        <Flow>
          <Node t="클라이언트" s="브라우저 · curl" c="teal" w={120} />
          <Arr l="https://url-id.lambda-url..." w={190} />
          <Node
            t="Lambda 함수 URL"
            s="alias 또는 $LATEST만"
            c="orange"
            w={180}
          />
        </Flow>
      </Panel>
    </Sec>
  );
}

/* ══════════════════════ 26 CodeGuru 프로파일링 ══════════════════════ */

function S_CodeGuru() {
  return (
    <Sec id="codeguru">
      <UL
        items={[
          <>
            <B>CodeGuru Profiler</B>로 Lambda 함수의 <B>런타임 성능 인사이트</B>
            를 얻을 수 있음.
          </>,
          <>
            지원 언어: <B>Java, Python</B>.
          </>,
          <>
            Lambda 콘솔에서 활성화하면 함수용 <B>Profiler Group</B> 생성.
          </>,
          <>
            활성화 시 자동 반영: 함수에 <B>레이어 추가</B> +{" "}
            <B>환경 변수 추가</B> + 실행 역할에{" "}
            <OM>AmazonCodeGuruProfilerAgentAccess</OM> 정책 부여.
          </>,
        ]}
      />
    </Sec>
  );
}

/* ══════════════════════ 27 제한 (Limits) ══════════════════════ */

function S_Limits() {
  return (
    <Sec id="limits">
      <P>
        한도는 <B>리전당</B> 적용됩니다. 아래 숫자는 시나리오 문제("이 작업에
        Lambda가 적합한가?")의 판단 기준으로 그대로 출제됩니다.
      </P>
      <H3>실행(Execution) 한도</H3>
      <KVGrid
        items={[
          {
            k: "메모리 할당",
            v: "128MB ~ 10,240MB",
            s: "1MB 단위 · RAM↑ = vCPU↑",
          },
          {
            k: "최대 실행 시간",
            v: "900초 (15분)",
            s: "초과 → Fargate / Step Functions",
          },
          { k: "환경 변수", v: "4KB", s: "총 용량 기준" },
          {
            k: "임시 공간 /tmp",
            v: "512MB ~ 10GB",
            s: "대용량 임시 파일 처리",
          },
          {
            k: "동시 실행",
            v: "1,000 (계정)",
            s: "상향 요청 가능 · 예약 동시성 권장",
          },
        ]}
      />
      <H3>배포(Deployment) 한도</H3>
      <KVGrid
        items={[
          { k: "압축 zip 업로드", v: "50MB", s: "초과 시 S3 경유" },
          {
            k: "압축 해제 (코드+레이어)",
            v: "250MB",
            s: "그 이상은 /tmp 또는 컨테이너(10GB)",
          },
          { k: "환경 변수", v: "4KB", s: "배포 관점에서도 동일" },
        ]}
      />
      <Note k="tip">
        시나리오 판별 예: "30분 걸리는 배치" → 15분 초과이므로 Lambda ✗. "3GB
        파일을 임시 처리" → /tmp(최대 10GB)로 가능 ✓. "300MB 종속성 zip" → 250MB
        초과, 컨테이너 이미지(10GB) 고려.
      </Note>
    </Sec>
  );
}

/* ══════════════════════ 28 모범 사례 ══════════════════════ */

function S_Best() {
  return (
    <Sec id="best">
      <UL
        items={[
          <>
            <B>무거운 작업은 핸들러 밖에서</B> — DB 연결, SDK 초기화, 종속성
            로드는 함수 핸들러 외부에서 수행(실행 컨텍스트 재사용).
          </>,
          <>
            <B>환경 변수 활용</B> — DB 연결 문자열, S3 버킷명 등.{" "}
            <B>비밀번호 등 민감 값은 KMS 암호화</B>.
          </>,
          <>
            <B>배포 패키지를 런타임 필수 요소만으로 최소화</B> — 함수 한도를
            기억하고, 필요하면 <B>레이어</B>로 분리.
          </>,
          <>
            <B>Lambda가 자기 자신을 재귀 호출하게 하지 말 것</B> — 절대 금지!
          </>,
        ]}
      />
      <Note k="warn">
        <B>재귀 호출(recursive invocation)</B>은 호출이 눈덩이처럼 불어나 비용
        폭탄이 됩니다. "Lambda가 Lambda를 직접 호출하는 무한 루프 설계"는 항상
        오답 선택지입니다.
      </Note>
      <P>
        여기까지 28개 토픽이 DVA-C02 Lambda 파트의 전부입니다. 빈출도{" "}
        <B>[매우 높음]</B> 섹션(03·05·08·16·19·23·27)을 반복해서 복습하세요.
        수고하셨습니다! 🎉
      </P>
    </Sec>
  );
}

/* ══════════════════════ APP ══════════════════════ */

const SECTIONS = {
  intro: S_Intro,
  overview: S_Overview,
  sync: S_Sync,
  alb: S_ALB,
  async: S_Async,
  eventbridge: S_EventBridge,
  s3: S_S3,
  esm: S_ESM,
  eventctx: S_EventCtx,
  dest: S_Dest,
  perm: S_Perm,
  env: S_Env,
  mon: S_Mon,
  edge: S_Edge,
  vpc: S_VPC,
  perf: S_Perf,
  layers: S_Layers,
  fs: S_FS,
  conc: S_Conc,
  deps: S_Deps,
  cfn: S_CFN,
  container: S_Container,
  versions: S_Versions,
  codedeploy: S_CodeDeploy,
  furl: S_Furl,
  codeguru: S_CodeGuru,
  limits: S_Limits,
  best: S_Best,
};

export default function App() {
  const [active, setActive] = useState("intro");

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById("lam-fonts")) {
      const l = document.createElement("link");
      l.id = "lam-fonts";
      l.rel = "stylesheet";
      l.href =
        "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;700&family=IBM+Plex+Mono:wght@400;600;700&display=swap";
      document.head.appendChild(l);
    }
  }, []);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined"
    )
      return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-15% 0px -75% 0px" },
    );
    ORDER.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const jump = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  };

  return (
    <div className="lam-root">
      <style>{CSS}</style>

      {/* ── 사이드바 (데스크톱) ── */}
      <nav className="lam-sb" aria-label="목차">
        <div
          style={{
            padding: "4px 10px 16px",
            borderBottom: "1px solid #22304A",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontFamily: T.mono,
              fontSize: 9.5,
              letterSpacing: 2,
              color: "#F09A3E",
              fontWeight: 700,
            }}
          >
            DVA-C02 · STUDY NOTES
          </div>
          <div
            style={{
              fontSize: 16.5,
              fontWeight: 800,
              color: "#F4F7FB",
              marginTop: 4,
            }}
          >
            <span style={{ color: "#F09A3E", fontFamily: T.mono }}>λ</span> AWS
            Lambda
          </div>
          <div style={{ fontSize: 10.5, color: "#7E8FA3", marginTop: 3 }}>
            이론 28개 토픽 · 빈출도 표시
          </div>
        </div>
        {NAV.map((grp) => (
          <div key={grp.g} style={{ marginBottom: 14 }}>
            <div
              style={{
                fontSize: 9.5,
                fontWeight: 800,
                letterSpacing: 1.6,
                color: "#5E7089",
                padding: "0 10px 5px",
                fontFamily: T.mono,
              }}
            >
              {grp.g}
            </div>
            {grp.ids.map((id) => (
              <button
                key={id}
                className={"navlink" + (active === id ? " on" : "")}
                onClick={() => jump(id)}
              >
                <span
                  style={{
                    fontFamily: T.mono,
                    fontSize: 10,
                    opacity: 0.75,
                    width: 18,
                    flexShrink: 0,
                  }}
                >
                  {META[id].no}
                </span>
                <span style={{ flex: 1 }}>{META[id].t}</span>
                <span
                  title={"빈출도: " + FREQ_LABEL[META[id].f]}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: freqColor(META[id].f),
                    opacity: META[id].f >= 4 ? 1 : 0.55,
                  }}
                />
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* ── 모바일 상단 바 ── */}
      <div className="lam-mobilebar">
        <span
          style={{
            fontFamily: T.mono,
            fontWeight: 800,
            color: "#F09A3E",
            fontSize: 15,
          }}
        >
          λ
        </span>
        <span
          style={{
            color: "#F4F7FB",
            fontWeight: 700,
            fontSize: 13,
            flexShrink: 0,
          }}
        >
          AWS Lambda
        </span>
        <select
          value={active}
          onChange={(e) => jump(e.target.value)}
          aria-label="섹션 이동"
          style={{
            flex: 1,
            minWidth: 0,
            background: "#22304A",
            color: "#E7EDF5",
            border: "1px solid #35476B",
            borderRadius: 8,
            padding: "7px 8px",
            fontSize: 12.5,
            fontFamily: "inherit",
          }}
        >
          {ORDER.map((id) => (
            <option key={id} value={id}>
              {META[id].no}. {META[id].t} — {FREQ_LABEL[META[id].f]}
            </option>
          ))}
        </select>
      </div>

      {/* ── 본문 ── */}
      <main className="lam-main">
        <Hero onJump={jump} />
        <Legend />
        {ORDER.map((id) => {
          const C = SECTIONS[id];
          return <C key={id} />;
        })}
        <footer
          style={{
            marginTop: 30,
            paddingTop: 18,
            borderTop: "1px dashed " + T.line,
            fontSize: 11.5,
            color: T.faint,
            lineHeight: 1.8,
          }}
        >
          AWS Certified Developer — Associate (DVA-C02) 대비 Lambda 이론 정리 ·
          빈출도는 시험 가이드 비중과 수험 후기 기반 추정치이며 공식 통계가
          아닙니다.
        </footer>
      </main>
    </div>
  );
}
