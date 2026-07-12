//opus 4.8 high
import React, { useState, useMemo, useEffect } from "react";

/* ============================================================
   시각 학습 가이드 — 재사용 템플릿 v1.0 (프리미티브 + 앱 셸)
   이 파일의 규칙: ① 프리미티브·CSS·앱 셸은 수정 금지 ② [교체 영역]만 주제에 맞게 교체
   ============================================================ */

const C = {
  bg: "#0B1220",
  panel: "#111B30",
  panel2: "#0D1626",
  line: "#233150",
  line2: "#1B2740",
  ink: "#E9EEF9",
  mut: "#94A2BC",
  dim: "#67758F",
  or: "#FC8B32",
  pk: "#F06BA8",
  gr: "#45C486",
  vi: "#9D8CFF",
  bl: "#5CA8FF",
  rd: "#F26969",
  te: "#43C6D8",
  ye: "#F2C94C",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;700&family=IBM+Plex+Mono:wght@400;600&display=swap');
:root{
  --bg:${C.bg}; --panel:${C.panel}; --panel2:${C.panel2}; --line:${C.line}; --line2:${C.line2};
  --ink:${C.ink}; --mut:${C.mut}; --dim:${C.dim};
  --or:${C.or}; --pk:${C.pk}; --gr:${C.gr}; --vi:${C.vi}; --bl:${C.bl}; --rd:${C.rd}; --te:${C.te}; --ye:${C.ye};
  --sans:'IBM Plex Sans KR',Pretendard,-apple-system,'Apple SD Gothic Neo','Noto Sans KR','Malgun Gothic',sans-serif;
  --mono:'IBM Plex Mono','JetBrains Mono',ui-monospace,'SF Mono',Consolas,monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body,#root{height:100%}
body{background:var(--bg)}
.app{font-family:var(--sans);background:
  radial-gradient(1200px 500px at 85% -10%, rgba(252,139,50,.07), transparent 60%),
  radial-gradient(900px 600px at -10% 110%, rgba(92,168,255,.05), transparent 60%),
  var(--bg);
  color:var(--ink);min-height:100vh;display:flex;line-height:1.7;
  -webkit-font-smoothing:antialiased}
::selection{background:rgba(252,139,50,.35)}
.side{width:306px;position:fixed;top:0;bottom:0;left:0;background:var(--panel2);
  border-right:1px solid var(--line2);overflow-y:auto;z-index:40;
  scrollbar-width:thin;scrollbar-color:var(--line) transparent;transition:transform .25s ease}
.side::-webkit-scrollbar{width:8px}
.side::-webkit-scrollbar-thumb{background:var(--line);border-radius:4px}
.brand{padding:22px 20px 16px;border-bottom:1px solid var(--line2);cursor:pointer}
.brand .lam{display:flex;align-items:center;gap:11px}
.brand .glyph{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#FC8B32,#E85D04);
  display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-weight:600;
  font-size:21px;color:#12100b;box-shadow:0 0 22px rgba(252,139,50,.35)}
.brand h1{font-size:15.5px;font-weight:700;letter-spacing:-.01em}
.brand .sub{font-family:var(--mono);font-size:10px;color:var(--dim);letter-spacing:.14em;margin-top:2px}
.search{margin:14px 16px 6px;position:relative}
.search input{width:100%;background:var(--panel);border:1px solid var(--line2);border-radius:9px;
  padding:9px 12px 9px 34px;color:var(--ink);font-family:var(--sans);font-size:13px;outline:none}
.search input:focus{border-color:rgba(252,139,50,.6);box-shadow:0 0 0 3px rgba(252,139,50,.12)}
.search .ic{position:absolute;left:11px;top:9px;color:var(--dim);font-size:13px}
.cat{margin:16px 0 4px}
.cat .ch{display:flex;align-items:center;gap:8px;padding:4px 20px;font-family:var(--mono);
  font-size:10px;letter-spacing:.16em;color:var(--dim)}
.cat .dot{width:7px;height:7px;border-radius:2px}
.nav-item{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:none;border:0;
  padding:8px 14px 8px 20px;cursor:pointer;color:var(--mut);font-family:var(--sans);font-size:13.2px;
  border-left:2px solid transparent;transition:background .12s,color .12s}
.nav-item:hover{background:rgba(255,255,255,.03);color:var(--ink)}
.nav-item.on{background:rgba(252,139,50,.09);color:var(--ink);border-left-color:var(--or)}
.nav-item .idx{font-family:var(--mono);font-size:10px;color:var(--dim);width:26px;flex-shrink:0}
.nav-item.on .idx{color:var(--or)}
.nav-item .tt{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bars{display:flex;gap:2.5px;flex-shrink:0}
.bars i{width:4px;border-radius:1px;background:var(--line)}
.bars i.f{background:currentColor}
.main{margin-left:306px;flex:1;min-width:0}
.wrap{max-width:900px;margin:0 auto;padding:52px 44px 110px}
.crumb{font-family:var(--mono);font-size:11px;letter-spacing:.12em;color:var(--dim);
  display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.crumb .cd2{color:var(--mut)}
.crumb .sep{color:var(--line)}
h2.title{font-size:clamp(28px,4vw,38px);font-weight:700;letter-spacing:-.035em;line-height:1.22;
  margin:10px 0 6px}
.entitle{font-family:var(--mono);font-size:12px;color:var(--dim);letter-spacing:.04em}
.meta{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin:20px 0 8px;padding:14px 16px;
  background:var(--panel);border:1px solid var(--line2);border-radius:12px}
.freq{display:flex;align-items:center;gap:9px}
.freq .lb{font-family:var(--mono);font-size:10px;letter-spacing:.14em;color:var(--dim)}
.freq .bars i{width:6px}
.freq .tx{font-size:12.5px;font-weight:700}
.tags{display:flex;gap:6px;flex-wrap:wrap;margin-left:auto}
.tag{font-family:var(--mono);font-size:10.5px;color:var(--mut);background:var(--panel2);
  border:1px solid var(--line2);border-radius:999px;padding:3px 10px}
h3.sec{font-size:19px;font-weight:700;letter-spacing:-.02em;margin:44px 0 4px;
  display:flex;align-items:baseline;gap:10px}
h3.sec .no{font-family:var(--mono);font-size:12px;color:var(--or);font-weight:600}
h3.sec:after{content:"";flex:1;height:1px;background:var(--line2);align-self:center}
.p{font-size:14.5px;color:#C7D1E4;margin:12px 0}
.p b,.hl{color:var(--ink);font-weight:700}
.mark{color:var(--or);font-weight:700}
.ul{margin:10px 0 14px;padding-left:2px;list-style:none}
.ul li{font-size:14.2px;color:#C7D1E4;padding:4.5px 0 4.5px 20px;position:relative}
.ul li:before{content:"—";position:absolute;left:0;color:var(--or);font-family:var(--mono);font-size:12px;top:7px}
.cd{font-family:var(--mono);font-size:.86em;background:rgba(92,168,255,.1);color:#A9CDFF;
  border:1px solid rgba(92,168,255,.18);border-radius:5px;padding:1px 6px;white-space:nowrap}
.callout{border-radius:12px;padding:15px 17px;margin:18px 0;border:1px solid;position:relative}
.callout .cl{font-family:var(--mono);font-size:10px;letter-spacing:.16em;font-weight:600;
  display:flex;align-items:center;gap:7px;margin-bottom:7px}
.callout .cb{font-size:13.8px;color:#D3DCEC}
.callout.exam{background:rgba(252,139,50,.07);border-color:rgba(252,139,50,.35)}
.callout.exam .cl{color:var(--or)}
.callout.warn{background:rgba(242,105,105,.07);border-color:rgba(242,105,105,.35)}
.callout.warn .cl{color:var(--rd)}
.callout.tip{background:rgba(67,198,216,.06);border-color:rgba(67,198,216,.3)}
.callout.tip .cl{color:var(--te)}
.fig{margin:22px 0;border:1px solid var(--line2);border-radius:14px;overflow:hidden;background:var(--panel)}
.figbar{display:flex;align-items:center;gap:12px;padding:9px 15px;border-bottom:1px solid var(--line2);
  background:rgba(255,255,255,.015)}
.figbar .fn{font-family:var(--mono);font-size:10.5px;letter-spacing:.12em;color:var(--or);font-weight:600}
.figbar .ft{font-size:12.5px;color:var(--mut);font-weight:500}
.figbody{padding:16px 14px 10px}
.fignote{padding:0 16px 13px;font-size:12px;color:var(--dim)}
.flowline{animation:dashmove 1.1s linear infinite}
@keyframes dashmove{to{stroke-dashoffset:-24}}
@media (prefers-reduced-motion:reduce){.flowline{animation:none}}
.tblwrap{margin:18px 0;border:1px solid var(--line2);border-radius:12px;overflow:auto;background:var(--panel)}
table.tbl{width:100%;border-collapse:collapse;font-size:13.2px;min-width:520px}
.tbl th{font-family:var(--mono);font-size:10px;letter-spacing:.12em;color:var(--dim);text-align:left;
  padding:11px 14px;border-bottom:1px solid var(--line);background:rgba(255,255,255,.015);white-space:nowrap}
.tbl td{padding:10px 14px;border-bottom:1px solid var(--line2);color:#C7D1E4;vertical-align:top}
.tbl tr:last-child td{border-bottom:0}
.tbl td:first-child{color:var(--ink);font-weight:600;white-space:nowrap}
.codebox{margin:18px 0;border:1px solid var(--line2);border-radius:12px;overflow:hidden;background:#0A121F}
.codebox .cbh{display:flex;gap:8px;align-items:center;padding:8px 14px;border-bottom:1px solid var(--line2);
  font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;color:var(--dim)}
.codebox pre{padding:14px 16px;overflow-x:auto;font-family:var(--mono);font-size:12.3px;line-height:1.75;color:#B9CCE8}
.grid{display:grid;gap:12px;margin:18px 0}
.gcard{background:var(--panel);border:1px solid var(--line2);border-radius:12px;padding:15px 16px}
.gcard .gt{font-size:13.5px;font-weight:700;display:flex;align-items:center;gap:8px}
.gcard .gd{font-size:12.8px;color:var(--mut);margin-top:5px}
.stat{background:var(--panel);border:1px solid var(--line2);border-radius:12px;padding:16px;text-align:left}
.stat .sv{font-family:var(--mono);font-size:24px;font-weight:600;letter-spacing:-.02em}
.stat .sl{font-size:11.5px;color:var(--mut);margin-top:3px}
.pillrow{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}
.pill{font-family:var(--mono);font-size:11px;padding:5px 11px;border-radius:999px;border:1px solid var(--line);color:var(--mut)}
.navft{display:flex;gap:12px;margin-top:64px}
.navbtn{flex:1;background:var(--panel);border:1px solid var(--line2);border-radius:12px;padding:14px 16px;
  cursor:pointer;color:var(--ink);text-align:left;font-family:var(--sans);transition:border-color .15s,transform .15s}
.navbtn:hover{border-color:rgba(252,139,50,.5);transform:translateY(-1px)}
.navbtn .nd{font-family:var(--mono);font-size:10px;letter-spacing:.14em;color:var(--dim)}
.navbtn .nt{font-size:14px;font-weight:700;margin-top:3px}
.navbtn.nx{text-align:right}
.hero{padding:8px 0 6px}
.hero .eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.22em;color:var(--or)}
.hero h2{font-size:clamp(34px,5.5vw,54px);font-weight:700;letter-spacing:-.04em;line-height:1.14;margin:14px 0 12px}
.hero .lead{font-size:15.5px;color:var(--mut);max-width:640px}
.menu-btn{display:none;position:fixed;top:14px;left:14px;z-index:60;background:var(--panel);
  border:1px solid var(--line);color:var(--ink);border-radius:10px;padding:8px 12px;cursor:pointer;
  font-family:var(--mono);font-size:12px}
.scrim{display:none}
@media (max-width:980px){
  .side{transform:translateX(-100%)}
  .side.open{transform:translateX(0);box-shadow:0 0 60px rgba(0,0,0,.6)}
  .main{margin-left:0}
  .wrap{padding:70px 20px 90px}
  .menu-btn{display:block}
  .scrim.show{display:block;position:fixed;inset:0;background:rgba(5,9,18,.6);z-index:35}
  .tags{margin-left:0;width:100%}
}
button:focus-visible,input:focus-visible,.nav-item:focus-visible{outline:2px solid var(--or);outline-offset:2px}
`;

/* ---------------- SVG 프리미티브 ---------------- */
const MK = {
  or: C.or,
  pk: C.pk,
  gr: C.gr,
  vi: C.vi,
  bl: C.bl,
  rd: C.rd,
  te: C.te,
  ye: C.ye,
  mu: "#8B9AB6",
};

function Defs() {
  return (
    <defs>
      {Object.entries(MK).map(([k, col]) => (
        <marker
          key={k}
          id={"ah-" + k}
          viewBox="0 0 10 10"
          refX="8.6"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0,0.6 L9,5 L0,9.4 Z" fill={col} />
        </marker>
      ))}
      <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
        <circle cx="1.5" cy="1.5" r="1.1" fill="#1D2A45" />
      </pattern>
    </defs>
  );
}

function Fig({ n, title, h = 320, note, children }) {
  return (
    <figure className="fig">
      <div className="figbar">
        <span className="fn">FIG.{n}</span>
        <span className="ft">{title}</span>
      </div>
      <div className="figbody">
        <svg
          viewBox={"0 0 760 " + h}
          width="100%"
          role="img"
          aria-label={title}
          style={{ display: "block", fontFamily: "var(--sans)" }}
        >
          <Defs />
          <rect width="760" height={h} fill="url(#dots)" opacity="0.55" />
          {children}
        </svg>
      </div>
      {note && <figcaption className="fignote">{note}</figcaption>}
    </figure>
  );
}

/* 서비스 노드 칩 */
function Node({ x, y, w = 128, h = 52, c = C.or, t, s, dash, tSize = 13.5 }) {
  const lines = Array.isArray(t) ? t : [t];
  const baseY = y + h / 2 - (lines.length - 1) * 8 + (s ? -4 : 5);
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="12"
        fill={c + "20"}
        stroke={c}
        strokeWidth="1.4"
        strokeDasharray={dash ? "5 4" : "none"}
      />
      {lines.map((ln, i) => (
        <text
          key={i}
          x={x + w / 2}
          y={baseY + i * 16}
          textAnchor="middle"
          fill={C.ink}
          fontSize={tSize}
          fontWeight="700"
        >
          {ln}
        </text>
      ))}
      {s && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 15}
          textAnchor="middle"
          fill={C.mut}
          fontSize="10"
          fontFamily="var(--mono)"
        >
          {s}
        </text>
      )}
    </g>
  );
}

/* 화살표 (anim: 흐르는 점선) */
function Flow({
  d,
  c = "#8B9AB6",
  m = "mu",
  anim,
  dash,
  label,
  lx,
  ly,
  lc,
  w = 1.6,
  noHead,
  fs = 11,
}) {
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={c}
        strokeWidth={w}
        strokeDasharray={anim ? "6 6" : dash ? "5 5" : "none"}
        className={anim ? "flowline" : ""}
        markerEnd={noHead ? undefined : "url(#ah-" + m + ")"}
      />
      {label &&
        (Array.isArray(label) ? label : [label]).map((ln, i) => (
          <text
            key={i}
            x={lx}
            y={ly + i * 14}
            textAnchor="middle"
            fill={lc || c}
            fontSize={fs}
            fontFamily="var(--mono)"
          >
            {ln}
          </text>
        ))}
    </g>
  );
}

function Lbl({
  x,
  y,
  t,
  c = C.mut,
  fs = 11,
  anchor = "middle",
  mono = true,
  w = 400,
}) {
  const lines = Array.isArray(t) ? t : [t];
  return (
    <g>
      {lines.map((ln, i) => (
        <text
          key={i}
          x={x}
          y={y + i * 15}
          textAnchor={anchor}
          fill={c}
          fontSize={fs}
          fontWeight={w}
          fontFamily={mono ? "var(--mono)" : "var(--sans)"}
        >
          {ln}
        </text>
      ))}
    </g>
  );
}

/* 영역 프레임 (VPC, 서브넷 등) */
function Zone({ x, y, w, h, c = C.vi, t, dash = true }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="14"
        fill={c + "0C"}
        stroke={c + "88"}
        strokeWidth="1.2"
        strokeDasharray={dash ? "7 5" : "none"}
      />
      <text
        x={x + 13}
        y={y + 20}
        fill={c}
        fontSize="10.5"
        fontWeight="600"
        fontFamily="var(--mono)"
        letterSpacing=".08em"
      >
        {t}
      </text>
    </g>
  );
}

/* ---------------- 콘텐츠 프리미티브 ---------------- */
const P = ({ children }) => <p className="p">{children}</p>;
const B = ({ children }) => <b>{children}</b>;
const M = ({ children }) => <span className="mark">{children}</span>;
const Cd = ({ children }) => <code className="cd">{children}</code>;
const UL = ({ items }) => (
  <ul className="ul">
    {items.map((it, i) => (
      <li key={i}>{it}</li>
    ))}
  </ul>
);

const Callout = ({ kind, label, children }) => (
  <div className={"callout " + kind}>
    <div className="cl">{label}</div>
    <div className="cb">{children}</div>
  </div>
);
const Exam = ({ children }) => (
  <Callout kind="exam" label="⚑ 시험 포인트">
    {children}
  </Callout>
);
const Warn = ({ children }) => (
  <Callout kind="warn" label="⚠ 함정 주의">
    {children}
  </Callout>
);
const Tip = ({ children }) => (
  <Callout kind="tip" label="◈ 참고">
    {children}
  </Callout>
);

const H3 = ({ no, children }) => (
  <h3 className="sec">
    <span className="no">{no}</span>
    {children}
  </h3>
);

const Tbl = ({ head, rows }) => (
  <div className="tblwrap">
    <table className="tbl">
      <thead>
        <tr>
          {head.map((h, i) => (
            <th key={i}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td key={j}>{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Code = ({ title = "code", children }) => (
  <div className="codebox">
    <div className="cbh">
      <span style={{ display: "inline-flex", gap: 5 }}>
        <i
          style={{
            width: 8,
            height: 8,
            borderRadius: 99,
            background: "#F26969",
            display: "inline-block",
          }}
        />
        <i
          style={{
            width: 8,
            height: 8,
            borderRadius: 99,
            background: "#F2C94C",
            display: "inline-block",
          }}
        />
        <i
          style={{
            width: 8,
            height: 8,
            borderRadius: 99,
            background: "#45C486",
            display: "inline-block",
          }}
        />
      </span>
      {title}
    </div>
    <pre>{children}</pre>
  </div>
);

const Grid = ({ cols = 2, children }) => (
  <div
    className="grid"
    style={{
      gridTemplateColumns: `repeat(auto-fit,minmax(${cols === 3 ? 180 : 230}px,1fr))`,
    }}
  >
    {children}
  </div>
);
const GCard = ({ c = C.or, t, d }) => (
  <div className="gcard" style={{ borderTop: `2px solid ${c}` }}>
    <div className="gt">{t}</div>
    <div className="gd">{d}</div>
  </div>
);
const Stat = ({ v, l, c = C.or }) => (
  <div className="stat">
    <div className="sv" style={{ color: c }}>
      {v}
    </div>
    <div className="sl">{l}</div>
  </div>
);

const FREQ = {
  3: { t: "매우 빈출", c: C.or },
  2: { t: "빈출", c: C.te },
  1: { t: "가끔 출제", c: "#8B9AB6" },
};
function Bars({ n, size = 6, hMax = 14 }) {
  const col = FREQ[n].c;
  return (
    <span
      className="bars"
      style={{ color: col, alignItems: "flex-end", display: "inline-flex" }}
    >
      {[1, 2, 3].map((i) => (
        <i
          key={i}
          className={i <= n ? "f" : ""}
          style={{ height: hMax - (3 - i) * 3.5, width: size }}
        />
      ))}
    </span>
  );
}
function Freq({ n }) {
  return (
    <span className="freq">
      <span className="lb">빈출도</span>
      <Bars n={n} />
      <span className="tx" style={{ color: FREQ[n].c }}>
        {FREQ[n].t}
      </span>
    </span>
  );
}

/* ╔══════════════════════════════════════════════════════════╗
   ║  [교체 영역 1/3] META — 주제(시험 섹션)마다 이 블록만 수정   ║
   ╚══════════════════════════════════════════════════════════╝ */

const META = {
  eyebrow: "AWS CERTIFIED DEVELOPER — ASSOCIATE · DVA-C02",
  titleLines: ["통합 & 메시징", "SQS · SNS · Kinesis"],
  lead: "애플리케이션을 느슨하게 결합(decoupling)하는 세 축 — 큐(SQS), 발행/구독(SNS), 실시간 스트리밍(Kinesis)을 다이어그램 중심으로 정리했습니다. 실습과 퀴즈는 제외하고 시험에 나오는 개념·숫자·함정만 담았습니다.",
  glyph: "≋",
  brandTitle: "통합 & 메시징 가이드",
  brandSub: "DVA-C02",
  footNote: "빈출도 = 추정치 · 실습/퀴즈 제외 · 강의 216~236",
  pills: [
    "SQS 메시지 최대 256KB",
    "SQS 보존 기본 4일 (60초~14일)",
    "가시성 타임아웃 기본 30초 (0초~12시간)",
    "지연 큐 최대 15분 (900초)",
    "롱 폴링 대기 1~20초",
    "배치 API 최대 10건",
    "FIFO 300 msg/s (배치 3,000)",
    "FIFO 중복 제거 창 5분",
    "SNS 구독 최대 1,250만/토픽",
    "Kinesis 보존 기본 24시간 (최대 365일)",
    "Kinesis 샤드 쓰기 1MB/s · 1,000건/s",
    "Kinesis 샤드 읽기 2MB/s",
    "Kinesis 레코드 최대 1MB",
  ],
};

const CATS = [
  { name: "기초", c: "#8B9AB6" },
  { name: "SQS 표준 큐", c: C.pk },
  { name: "SQS 큐 옵션", c: C.ye },
  { name: "SQS FIFO", c: C.or },
  { name: "SNS · 팬아웃", c: C.vi },
  { name: "Kinesis 스트리밍", c: C.bl },
  { name: "종합 비교", c: C.te },
];

/* ── 다이어그램 (D_*) : 760 캔버스 · 좌→우 흐름 · 서비스 계열색 ── */

function D_Decouple() {
  return (
    <Fig
      n="01"
      title="동기 강결합 vs 비동기 디커플링(SQS)"
      h={300}
      note="디커플링 = 생산자와 소비자가 서로의 가용성·처리 속도에 영향받지 않음. 시험의 'decouple / 버퍼' 지문 신호는 대부분 SQS를 가리킨다."
    >
      <Lbl
        x={40}
        y={40}
        t="① 동기 호출 — 강결합"
        c={C.mut}
        fs={12}
        anchor="start"
      />
      <Node x={70} y={56} w={150} h={52} c="#8B9AB6" t="생산자" />
      <Node x={540} y={56} w={150} h={52} c="#8B9AB6" t="소비자" />
      <Flow
        d="M220,82 L540,82"
        c="#8B9AB6"
        m="mu"
        label={["직접 호출 — 대상이 다운되면", "요청 실패 · 확장 어려움"]}
        lx={380}
        ly={64}
      />
      <Lbl
        x={40}
        y={172}
        t="② 비동기 — SQS 디커플링"
        c={C.mut}
        fs={12}
        anchor="start"
      />
      <Node x={40} y={196} w={140} h={52} c="#8B9AB6" t="생산자" />
      <Node x={305} y={196} w={150} h={52} c={C.pk} t="SQS 큐" s="버퍼 역할" />
      <Node
        x={575}
        y={196}
        w={145}
        h={52}
        c={C.or}
        t="소비자"
        s="EC2 / Lambda"
      />
      <Flow
        d="M180,222 L305,222"
        c={C.pk}
        m="pk"
        anim
        label="전송"
        lx={242}
        ly={212}
      />
      <Flow
        d="M455,222 L575,222"
        c={C.or}
        m="or"
        label="폴링 후 삭제"
        lx={515}
        ly={212}
      />
    </Fig>
  );
}

function D_SQS() {
  return (
    <Fig
      n="02"
      title="표준 큐 — 생산자·큐·소비자의 기본 흐름"
      h={310}
      note="표준 큐 = 무제한 처리량, 최소 1회 전달(중복 가능), 최선 순서(순서 뒤바뀔 수 있음). 보존 기본 4일(최대 14일), 메시지 최대 256KB. 소비자는 처리 후 반드시 DeleteMessage."
    >
      <Node x={36} y={62} w={150} h={48} c="#8B9AB6" t="생산자 A" />
      <Node x={36} y={198} w={150} h={48} c="#8B9AB6" t="생산자 B" />
      <Node
        x={300}
        y={118}
        w={170}
        h={76}
        c={C.pk}
        t={["SQS", "표준 큐"]}
        s="무제한 처리량"
      />
      <Node x={574} y={62} w={150} h={48} c={C.or} t="소비자 1" />
      <Node x={574} y={198} w={150} h={48} c={C.or} t="소비자 2" />
      <Flow
        d="M186,86 C250,86 250,150 300,150"
        c={C.pk}
        m="pk"
        anim
        label="전송"
        lx={243}
        ly={104}
      />
      <Flow d="M186,222 C250,222 250,166 300,166" c={C.pk} m="pk" />
      <Flow
        d="M470,150 C524,150 524,86 574,86"
        c={C.or}
        m="or"
        label="폴링·삭제"
        lx={540}
        ly={128}
      />
      <Flow d="M470,166 C524,166 524,222 574,222" c={C.or} m="or" />
      <Lbl
        x={385}
        y={232}
        t="at-least-once · best-effort 순서"
        c={C.dim}
        fs={10.5}
      />
    </Fig>
  );
}

function D_Policy() {
  return (
    <Fig
      n="03"
      title="큐 액세스 정책 — 누가 이 큐에 쓸 수 있나"
      h={300}
      note="SQS 액세스 정책 = S3 버킷 정책과 유사한 리소스 기반(JSON) 정책. 교차 계정 접근, 그리고 S3·SNS 같은 다른 서비스가 큐에 쓰도록 허용할 때 사용한다."
    >
      <Zone x={468} y={58} w={258} h={188} c={C.pk} t="내 계정 / 리전" />
      <Node
        x={512}
        y={120}
        w={170}
        h={64}
        c={C.pk}
        t="SQS 큐"
        s="리소스 정책 부착"
      />
      <Node x={40} y={72} w={150} h={52} c={C.gr} t="S3 버킷" s="이벤트 알림" />
      <Node x={40} y={190} w={150} h={52} c="#8B9AB6" t={["다른 계정", "앱"]} />
      <Flow
        d="M190,98 C330,98 380,150 512,150"
        c={C.gr}
        m="gr"
        label={["S3→SQS 쓰기", "정책 필요"]}
        lx={330}
        ly={112}
      />
      <Flow
        d="M190,216 C330,216 380,166 512,166"
        c="#8B9AB6"
        m="mu"
        dash
        label={["교차 계정", "정책 필요"]}
        lx={332}
        ly={232}
      />
    </Fig>
  );
}

function D_Visibility() {
  return (
    <Fig
      n="04"
      title="가시성 타임아웃 — 받은 메시지가 잠시 숨는 창"
      h={320}
      note="메시지를 받으면 가시성 타임아웃 동안 다른 소비자에게 보이지 않는다. 이 안에 DeleteMessage를 못 하면 큐로 돌아와 재처리(중복)된다. 처리 지연 시 ChangeMessageVisibility로 연장."
    >
      <Lbl x={40} y={38} t="시간 →" c={C.dim} fs={11} anchor="start" />
      <Node x={40} y={128} w={150} h={56} c={C.pk} t="① 수신(폴링)" />
      <Zone
        x={222}
        y={116}
        w={288}
        h={80}
        c={C.pk}
        t="비가시 구간 · 기본 30초"
        dash={true}
      />
      <Node
        x={556}
        y={56}
        w={168}
        h={52}
        c={C.gr}
        t="② DeleteMessage"
        s="처리 완료"
      />
      <Node
        x={556}
        y={200}
        w={168}
        h={56}
        c={C.rd}
        t={["타임아웃 만료", "→ 큐로 복귀"]}
        s="중복 처리 위험"
        tSize={12.5}
      />
      <Flow d="M190,156 L222,156" c={C.pk} m="pk" />
      <Flow
        d="M510,144 C536,124 536,84 556,84"
        c={C.gr}
        m="gr"
        label="시간 내 삭제"
        lx={534}
        ly={116}
      />
      <Flow
        d="M510,168 C536,196 536,226 556,226"
        c={C.rd}
        m="rd"
        dash
        label="삭제 못하면"
        lx={534}
        ly={250}
      />
    </Fig>
  );
}

function D_DLQ() {
  return (
    <Fig
      n="05"
      title="배달 못한 편지 큐 — 반복 실패 메시지 격리"
      h={320}
      note="지정한 maxReceiveCount만큼 처리에 실패하면 메시지를 DLQ로 격리한다. FIFO 큐의 DLQ는 FIFO, 표준 큐의 DLQ는 표준이어야 하며, DLQ 보존 기간은 길게(예: 14일) 두는 것이 정석."
    >
      <Node x={30} y={120} w={130} h={52} c="#8B9AB6" t="생산자" />
      <Node
        x={235}
        y={120}
        w={150}
        h={56}
        c={C.pk}
        t="소스 큐"
        s="maxReceiveCount"
      />
      <Node x={465} y={120} w={150} h={56} c={C.or} t="소비자" s="처리 실패" />
      <Node x={465} y={242} w={150} h={54} c={C.rd} t="DLQ" s="격리 · 분석" />
      <Flow
        d="M160,148 L235,148"
        c={C.pk}
        m="pk"
        anim
        label="전송"
        lx={197}
        ly={138}
      />
      <Flow
        d="M385,148 L465,148"
        c={C.or}
        m="or"
        label="수신 시도"
        lx={425}
        ly={138}
      />
      <Flow
        d="M465,162 C400,200 330,200 330,178"
        c="#8B9AB6"
        m="mu"
        dash
        label="실패 → 재전달"
        lx={378}
        ly={214}
      />
      <Flow
        d="M310,176 C310,269 380,269 465,269"
        c={C.rd}
        m="rd"
        label="수신 횟수 초과"
        lx={388}
        ly={259}
      />
    </Fig>
  );
}

function D_Poll() {
  return (
    <Fig
      n="06"
      title="숏 폴링 vs 롱 폴링"
      h={320}
      note="롱 폴링은 큐가 비었을 때 최대 WaitTimeSeconds(1~20초)까지 기다렸다 응답 → 빈 수신과 API 호출을 줄여 비용·지연을 낮춘다. '빈 응답/폴링 비용 절감' 지문 = 롱 폴링."
    >
      <Lbl
        x={40}
        y={38}
        t="① 숏 폴링 (WaitTimeSeconds = 0, 기본)"
        c={C.mut}
        fs={12}
        anchor="start"
      />
      <Node x={40} y={56} w={150} h={48} c={C.or} t="소비자" />
      <Node x={300} y={56} w={150} h={48} c={C.pk} t="SQS 큐" />
      <Flow
        d="M190,80 L300,80"
        c={C.or}
        m="or"
        label="즉시 응답 요청"
        lx={245}
        ly={70}
      />
      <Flow
        d="M300,96 C245,138 245,138 190,96"
        c="#8B9AB6"
        m="mu"
        dash
        label="빈 응답 반복 → 호출·비용↑"
        lx={245}
        ly={150}
      />
      <Lbl
        x={40}
        y={202}
        t="② 롱 폴링 (WaitTimeSeconds 1~20초)"
        c={C.mut}
        fs={12}
        anchor="start"
      />
      <Node x={40} y={220} w={150} h={48} c={C.or} t="소비자" />
      <Node x={300} y={220} w={150} h={48} c={C.pk} t="SQS 큐" />
      <Flow
        d="M190,244 L300,244"
        c={C.or}
        m="or"
        label="최대 20초 대기 요청"
        lx={245}
        ly={234}
      />
      <Flow
        d="M300,260 C245,302 245,302 190,260"
        c={C.gr}
        m="gr"
        label="메시지 생기면 반환 → 호출↓ 지연↓"
        lx={252}
        ly={314}
      />
    </Fig>
  );
}

function D_FIFO() {
  return (
    <Fig
      n="07"
      title="FIFO 큐 — 순서 보장 + 중복 제거"
      h={280}
      note="FIFO = 순서 보장 + 정확히 한 번 처리(중복 제거). 큐 이름은 .fifo로 끝나야 하며 처리량은 초당 300건(배치 시 3,000건). '순서가 중요/중복 불가' 지문 = FIFO."
    >
      <Node
        x={40}
        y={108}
        w={150}
        h={58}
        c="#8B9AB6"
        t="생산자"
        s="1 → 2 → 3 전송"
      />
      <Node
        x={300}
        y={98}
        w={160}
        h={78}
        c={C.pk}
        t="SQS FIFO"
        s="이름은 .fifo"
      />
      <Node
        x={570}
        y={108}
        w={150}
        h={58}
        c={C.or}
        t="소비자"
        s="1 → 2 → 3 수신"
      />
      <Flow
        d="M190,137 L300,137"
        c={C.pk}
        m="pk"
        anim
        label="순서대로"
        lx={245}
        ly={127}
      />
      <Flow
        d="M460,137 L570,137"
        c={C.or}
        m="or"
        label="순서 보존"
        lx={515}
        ly={127}
      />
      <Lbl
        x={380}
        y={220}
        t={["순서 보장 · 중복 제거(exactly-once)", "300 msg/s (배치 3,000)"]}
        c={C.mut}
        fs={11}
      />
    </Fig>
  );
}

function D_FIFOGroup() {
  return (
    <Fig
      n="08"
      title="MessageGroupId — 그룹별 순서 + 병렬 처리"
      h={310}
      note="MessageGroupId가 같은 메시지는 순서대로, 다른 그룹은 병렬로 처리 → 순서를 지키면서 확장. 중복 제거는 콘텐츠 해시(SHA-256) 또는 MessageDeduplicationId로, 제거 창은 5분."
    >
      <Node
        x={40}
        y={118}
        w={160}
        h={72}
        c={C.pk}
        t="SQS FIFO"
        s="MessageGroupId"
      />
      <Node
        x={318}
        y={58}
        w={186}
        h={52}
        c={C.pk}
        t="그룹 A (순서 보장)"
        tSize={12.5}
      />
      <Node
        x={318}
        y={196}
        w={186}
        h={52}
        c={C.pk}
        t="그룹 B (순서 보장)"
        tSize={12.5}
      />
      <Node x={560} y={58} w={150} h={52} c={C.or} t="소비자 1" />
      <Node x={560} y={196} w={150} h={52} c={C.or} t="소비자 2" />
      <Flow
        d="M200,148 C262,148 262,84 318,84"
        c={C.pk}
        m="pk"
        label="groupId=A"
        lx={268}
        ly={108}
      />
      <Flow
        d="M200,160 C262,160 262,222 318,222"
        c={C.pk}
        m="pk"
        label="groupId=B"
        lx={268}
        ly={240}
      />
      <Flow d="M504,84 L560,84" c={C.or} m="or" />
      <Flow d="M504,222 L560,222" c={C.or} m="or" />
    </Fig>
  );
}

function D_SNS() {
  return (
    <Fig
      n="09"
      title="SNS — 토픽에 1회 게시, 구독자로 푸시"
      h={320}
      note="SNS는 발행/구독 — 게시자가 토픽에 1회 게시하면 모든 구독자에게 푸시. 구독자: SQS, Lambda, HTTP/S, 이메일, SMS, 모바일 푸시, Firehose. 토픽당 구독 최대 1,250만, 계정당 토픽 10만. 필터 정책으로 선별 수신 가능."
    >
      <Node x={40} y={132} w={150} h={56} c="#8B9AB6" t="게시자" s="1회 게시" />
      <Node x={288} y={132} w={160} h={56} c={C.pk} t="SNS 토픽" s="Pub/Sub" />
      <Node x={558} y={48} w={166} h={46} c={C.pk} t="SQS 큐" />
      <Node x={558} y={138} w={166} h={46} c={C.or} t="Lambda" />
      <Node
        x={558}
        y={228}
        w={166}
        h={50}
        c={C.vi}
        t={["HTTP/S · 이메일", "SMS · 모바일 푸시"]}
        tSize={11}
      />
      <Flow
        d="M190,160 L288,160"
        c={C.pk}
        m="pk"
        anim
        label="게시"
        lx={239}
        ly={150}
      />
      <Flow d="M448,152 C510,152 510,72 558,72" c={C.pk} m="pk" />
      <Flow d="M448,160 L558,161" c={C.or} m="or" />
      <Flow d="M448,168 C510,168 510,250 558,250" c={C.vi} m="vi" />
    </Fig>
  );
}

function D_Fanout() {
  return (
    <Fig
      n="10"
      title="SNS + SQS 팬아웃 — 한 번 게시, 여러 큐로"
      h={320}
      note="팬아웃: 메시지를 SNS에 1회 게시하면 여러 SQS 큐로 복제 전달. 각 SQS가 영속성·재시도를 제공해 데이터 손실이 없다. 각 SQS 큐 정책이 SNS 쓰기를 허용해야 하며, S3는 이벤트당 대상이 1개라 팬아웃하려면 SNS를 경유한다."
    >
      <Node
        x={40}
        y={148}
        w={140}
        h={54}
        c="#8B9AB6"
        t="게시자"
        s="예: S3 이벤트"
      />
      <Node x={268} y={148} w={150} h={54} c={C.pk} t="SNS 토픽" />
      <Node x={470} y={70} w={124} h={48} c={C.pk} t="SQS A" />
      <Node x={470} y={214} w={124} h={48} c={C.pk} t="SQS B" />
      <Node x={612} y={70} w={112} h={48} c={C.or} t="소비자" tSize={12} />
      <Node x={612} y={214} w={112} h={48} c={C.or} t="소비자" tSize={12} />
      <Flow
        d="M180,175 L268,175"
        c={C.pk}
        m="pk"
        anim
        label="게시"
        lx={224}
        ly={165}
      />
      <Flow d="M418,164 C446,164 446,94 470,94" c={C.pk} m="pk" />
      <Flow d="M418,186 C446,186 446,238 470,238" c={C.pk} m="pk" />
      <Flow d="M594,94 L612,94" c={C.or} m="or" />
      <Flow d="M594,238 L612,238" c={C.or} m="or" />
    </Fig>
  );
}

function D_Kinesis() {
  return (
    <Fig
      n="11"
      title="Kinesis Data Streams — 파티션 키·샤드·순서"
      h={320}
      note="Data Streams = 실시간 스트리밍. 파티션 키로 레코드를 샤드에 분배하고 샤드 안에서 순서를 보장. 보존 기본 24시간(최대 365일), 데이터 불변이라 여러 소비자가 재생·재처리 가능. 샤드당 쓰기 1MB/s·1,000건/s, 읽기 2MB/s(향상된 팬아웃은 소비자별 2MB/s), 레코드 최대 1MB."
    >
      <Node
        x={30}
        y={128}
        w={140}
        h={58}
        c="#8B9AB6"
        t={["생산자", "(파티션 키)"]}
        tSize={12}
      />
      <Zone
        x={248}
        y={58}
        w={252}
        h={216}
        c={C.bl}
        t="Kinesis Data Stream"
        dash={true}
      />
      <Node
        x={280}
        y={98}
        w={188}
        h={50}
        c={C.bl}
        t="샤드 1"
        s="샤드 내 순서 보장"
      />
      <Node
        x={280}
        y={186}
        w={188}
        h={50}
        c={C.bl}
        t="샤드 2"
        s="샤드 내 순서 보장"
      />
      <Node x={560} y={98} w={150} h={50} c={C.or} t="소비자 A" />
      <Node x={560} y={186} w={150} h={50} c={C.or} t="소비자 B" />
      <Flow
        d="M170,150 C218,150 218,123 280,123"
        c={C.bl}
        m="bl"
        anim
        label="키 해시"
        lx={222}
        ly={138}
      />
      <Flow d="M170,166 C218,166 218,211 280,211" c={C.bl} m="bl" />
      <Flow d="M468,123 L560,123" c={C.or} m="or" />
      <Flow d="M468,211 L560,211" c={C.or} m="or" />
    </Fig>
  );
}

function D_Firehose() {
  return (
    <Fig
      n="12"
      title="Kinesis Data Firehose — 준실시간 적재"
      h={300}
      note="Firehose = 완전 관리형 준실시간 적재(서버리스). 버퍼 크기(MB) 또는 버퍼 시간(초) 중 먼저 도달하면 대상에 flush. 대상: S3·Redshift·OpenSearch·3rd party(Splunk 등)·HTTP. 저장(보존)은 하지 않으며 Lambda로 변환 가능."
    >
      <Node
        x={26}
        y={116}
        w={150}
        h={58}
        c={C.bl}
        t={["생산자 /", "Data Streams"]}
        tSize={11.5}
      />
      <Node
        x={244}
        y={112}
        w={168}
        h={66}
        c={C.bl}
        t="Data Firehose"
        s="버퍼(크기·시간)"
      />
      <Node
        x={266}
        y={222}
        w={132}
        h={44}
        c={C.or}
        t="Lambda 변환"
        dash
        tSize={11.5}
      />
      <Node x={520} y={54} w={186} h={44} c={C.gr} t="S3" />
      <Node x={520} y={126} w={186} h={44} c={C.bl} t="Redshift" />
      <Node
        x={520}
        y={198}
        w={186}
        h={46}
        c={C.vi}
        t={["OpenSearch", "· 3rd party"]}
        tSize={11}
      />
      <Flow
        d="M176,145 L244,145"
        c={C.bl}
        m="bl"
        anim
        label="스트림"
        lx={210}
        ly={135}
      />
      <Flow d="M412,138 C476,138 476,76 520,76" c={C.gr} m="gr" />
      <Flow d="M412,148 L520,148" c={C.bl} m="bl" />
      <Flow d="M412,158 C476,158 476,220 520,220" c={C.vi} m="vi" />
      <Flow d="M332,178 L332,222" c={C.or} m="or" dash noHead />
    </Fig>
  );
}

function D_Compare() {
  return (
    <Fig
      n="13"
      title="언제 무엇을 쓰나 — 결정 신호"
      h={320}
      note="SQS=소비 후 삭제되는 작업 큐(디커플링), SNS=푸시 기반 발행/구독(팬아웃), Kinesis=순서·재생·다중 소비가 필요한 실시간 스트리밍/분석. '디커플링/버퍼'→SQS, '팬아웃/다수 구독'→SNS, '실시간 스트리밍/재생/분석'→Kinesis."
    >
      <Node
        x={300}
        y={40}
        w={160}
        h={52}
        c={C.ye}
        t="무엇이 필요한가?"
        tSize={12.5}
      />
      <Node
        x={40}
        y={214}
        w={200}
        h={66}
        c={C.pk}
        t="SQS"
        s="큐 · 소비 후 삭제"
      />
      <Node
        x={280}
        y={214}
        w={200}
        h={66}
        c={C.pk}
        t="SNS"
        s="Pub/Sub · 팬아웃"
      />
      <Node
        x={520}
        y={214}
        w={200}
        h={66}
        c={C.bl}
        t="Kinesis"
        s="실시간 스트리밍"
      />
      <Flow
        d="M340,92 C250,150 200,168 140,214"
        c={C.pk}
        m="pk"
        label={["작업 분산 ·", "디커플링"]}
        lx={190}
        ly={150}
      />
      <Flow
        d="M380,92 L380,214"
        c={C.pk}
        m="pk"
        label={["동일 메시지를", "여러 시스템에"]}
        lx={380}
        ly={150}
      />
      <Flow
        d="M420,92 C520,150 580,168 620,214"
        c={C.bl}
        m="bl"
        label={["실시간 · 재생 ·", "다중 소비 · 분석"]}
        lx={598}
        ly={150}
      />
    </Fig>
  );
}

/* ── SECTIONS: 강의 순번(216~236) 유지, 실습/퀴즈 제외 ── */

const SECTIONS = [
  {
    id: "s216",
    no: "216",
    cat: "기초",
    freq: 1,
    title: "통합 & 메시징 — 섹션 소개",
    en: "Section Intro — Integration & Messaging",
    time: "1분",
    tags: ["오리엔테이션", "강의 216"],
    body: (
      <>
        <P>
          이 섹션은 애플리케이션을 <B>느슨하게 결합(decoupling)</B>하는 AWS
          통합·메시징 서비스를 다룹니다. 핵심 3인방은 <M>SQS</M>(큐), <M>SNS</M>
          (발행/구독), <M>Kinesis</M>(실시간 스트리밍)입니다.
        </P>
        <UL
          items={[
            <>
              <B>SQS</B> — 소비자가 메시지를 꺼내 처리 후 삭제하는 <B>큐</B>.
              표준/FIFO 두 종류.
            </>,
            <>
              <B>SNS</B> — 게시자가 토픽에 올리면 구독자로 <B>푸시</B>되는
              발행/구독.
            </>,
            <>
              <B>Kinesis</B> — 순서·재생이 가능한 <B>실시간 데이터 스트리밍</B>.
            </>,
          ]}
        />
        <Tip>
          세 서비스의 목적이 겹쳐 보여도 시험은 '언제 무엇을 쓰나'로 구분을
          묻습니다. 마지막 <B>236번 비교</B> 토픽을 기준표로 삼으세요.
        </Tip>
        <Exam>
          지문에 <M>디커플링·버퍼</M>가 보이면 SQS, <M>팬아웃·다수 구독</M>이면
          SNS, <M>실시간 스트리밍·재생·분석</M>이면 Kinesis가 정답 방향.
        </Exam>
      </>
    ),
  },
  {
    id: "s217",
    no: "217",
    cat: "기초",
    freq: 2,
    title: "메시징 소개",
    en: "Intro to Messaging",
    time: "3분",
    tags: ["디커플링", "동기/비동기", "강의 217"],
    body: (
      <>
        <P>
          메시징은 서비스 사이에 <B>중간 계층</B>을 두어 생산자와 소비자를
          분리합니다. 동기 직접 호출은 대상이 죽으면 함께 실패하지만, 큐나
          토픽을 끼우면 서로의 <M>가용성·처리 속도</M>에 영향을 덜 받습니다.
        </P>
        <D_Decouple />
        <H3 no="A">동기 vs 비동기</H3>
        <Tbl
          head={["", "동기 직접 호출", "비동기 메시징"]}
          rows={[
            ["결합도", "강결합", <B>느슨한 결합</B>],
            ["장애 전파", "대상 장애가 전파됨", "격리됨(버퍼가 흡수)"],
            ["확장", "동시 부하에 취약", "소비자 수평 확장 용이"],
          ]}
        />
        <H3 no="B">두 가지 기본 패턴</H3>
        <UL
          items={[
            <>
              <B>큐 모델</B> — 한 메시지를 <B>한 소비자</B>가 처리(작업 분산).
              AWS에서는 <M>SQS</M>.
            </>,
            <>
              <B>발행/구독 모델</B> — 한 메시지를 <B>여러 구독자</B>가
              받음(팬아웃). AWS에서는 <M>SNS</M>.
            </>,
          ]}
        />
        <Tip>
          Kinesis는 여기에 더해 <B>재생 가능한 스트림</B>이라는 축을
          추가합니다(동일 데이터를 여러 소비자가 반복 소비).
        </Tip>
        <Exam>
          '주문 폭주에도 뒤 단계가 밀리지 않게 버퍼링' → <M>큐(SQS)</M>. '한
          이벤트를 여러 시스템이 동시에 처리' → <M>발행/구독(SNS)</M>.
        </Exam>
      </>
    ),
  },
  {
    id: "s218",
    no: "218",
    cat: "SQS 표준 큐",
    freq: 3,
    title: "Amazon SQS — 표준 큐 개요",
    en: "Amazon SQS — Standard Queues",
    time: "11분",
    tags: ["표준 큐", "at-least-once", "핵심"],
    body: (
      <>
        <P>
          <B>SQS 표준 큐</B>는 생산자가 보낸 메시지를 저장했다가 소비자가{" "}
          <M>폴링</M>해 처리하는 완전관리형 큐입니다. 처리량이 <B>무제한</B>이고
          지연이 낮아(일반적으로 10ms 미만) 서비스 간 버퍼로 널리 쓰입니다.
        </P>
        <D_SQS />
        <H3 no="A">외워야 할 숫자</H3>
        <Grid cols={3}>
          <Stat v="256KB" l="메시지 최대 크기" c={C.pk} />
          <Stat v="4일" l="보존 기본값 (60초~14일)" c={C.te} />
          <Stat v="무제한" l="처리량 · 큐 내 메시지 수" c={C.or} />
        </Grid>
        <H3 no="B">동작 특성</H3>
        <UL
          items={[
            <>
              <B>최소 1회 전달(at-least-once)</B> — 같은 메시지가 <M>중복</M>
              으로 올 수 있음.
            </>,
            <>
              <B>최선 순서(best-effort)</B> — 순서가 뒤바뀔 수 있음. 엄격한
              순서가 필요하면 FIFO.
            </>,
            <>
              소비자는 처리 후 <Cd>DeleteMessage</Cd>로 <B>직접 삭제</B>해야
              함(안 하면 재등장).
            </>,
            <>
              소비자를 여러 개 두어 <B>수평 확장</B> 가능.
            </>,
          ]}
        />
        <Warn>
          표준 큐는 <M>중복·순서 뒤바뀜</M>이 정상 동작입니다. 소비 로직을{" "}
          <B>멱등(idempotent)</B>하게 짜야 하며, '순서 보장/중복 불가'가
          요구되면 표준 큐는 오답이고 <M>FIFO</M>가 정답입니다.
        </Warn>
        <Exam>
          '높은 처리량 · 순서 무관 · 시스템 디커플링' 지문 → <M>표준 SQS</M>.
          소비자가 메시지를 <B>삭제하지 않으면</B> 가시성 타임아웃 후 다시
          처리된다는 점(→ 221번)이 함께 출제됩니다.
        </Exam>
      </>
    ),
  },
  {
    id: "s220",
    no: "220",
    cat: "SQS 표준 큐",
    freq: 2,
    title: "SQS 큐 액세스 정책",
    en: "SQS — Queue Access Policies",
    time: "7분",
    tags: ["리소스 정책", "교차 계정", "S3→SQS"],
    body: (
      <>
        <P>
          SQS <B>액세스 정책</B>은 S3 버킷 정책과 비슷한{" "}
          <M>리소스 기반(JSON) 정책</M>으로, "누가 이 큐에 대해 어떤 동작을 할
          수 있는가"를 큐 자체에 부착합니다. IAM 정책(주체 기준)과 달리{" "}
          <B>리소스 쪽</B>에서 허용을 정의합니다.
        </P>
        <D_Policy />
        <H3 no="A">언제 필요한가</H3>
        <UL
          items={[
            <>
              <B>교차 계정 접근</B> — 다른 AWS 계정이 내 큐에 메시지를 보내야 할
              때.
            </>,
            <>
              <B>다른 서비스의 쓰기 허용</B> — <M>S3 이벤트 알림</M>이나{" "}
              <M>SNS</M>가 큐로 메시지를 보내려면 큐 정책에서 해당 서비스를
              허용해야 함.
            </>,
          ]}
        />
        <Code title="큐 리소스 정책 (예시)">{`{
  "Effect": "Allow",
  "Principal": { "Service": "s3.amazonaws.com" },
  "Action": "SQS:SendMessage",
  "Resource": "arn:aws:sqs:us-east-1:123456789012:my-queue"
}`}</Code>
        <Tip>
          SNS→SQS 팬아웃(→ 229번)이 실패하는 흔한 원인이 바로{" "}
          <B>큐 정책에서 SNS 쓰기를 허용하지 않아서</B>입니다.
        </Tip>
        <Exam>
          'S3 이벤트를 SQS로 받고 싶다 / 다른 계정이 큐에 써야 한다' → 답은
          IAM이 아니라 <M>SQS 큐 액세스 정책(리소스 기반)</M>.
        </Exam>
      </>
    ),
  },
  {
    id: "s221",
    no: "221",
    cat: "SQS 표준 큐",
    freq: 3,
    title: "SQS — 메시지 가시성 시간 초과",
    en: "SQS — Message Visibility Timeout",
    time: "5분",
    tags: ["가시성 타임아웃", "중복 처리", "핵심"],
    body: (
      <>
        <P>
          메시지를 폴링해 받으면, 그 메시지는 <B>가시성 타임아웃</B> 동안 다른
          소비자에게 <M>보이지 않게</M> 됩니다. 소비자가 이 시간 안에 처리하고
          삭제하면 끝, 못 하면 메시지가 <M>큐로 돌아와 다시 처리</M>됩니다.
        </P>
        <D_Visibility />
        <H3 no="A">기본값과 범위</H3>
        <Grid cols={3}>
          <Stat v="30초" l="기본 가시성 타임아웃" c={C.or} />
          <Stat v="12시간" l="최대 설정 값" c={C.pk} />
          <Stat v="0초" l="최소 설정 값" c={C.te} />
        </Grid>
        <H3 no="B">잘못 잡으면 생기는 문제</H3>
        <UL
          items={[
            <>
              <B>너무 짧으면</B> — 처리 도중 타임아웃 → 같은 메시지가 다시 나와{" "}
              <M>중복 처리</M>.
            </>,
            <>
              <B>너무 길면</B> — 소비자가 죽어도 그만큼 재처리가 늦어져{" "}
              <M>지연</M> 발생.
            </>,
            <>
              처리가 오래 걸릴 때는 <Cd>ChangeMessageVisibility</Cd>로
              타임아웃을 <B>연장</B>.
            </>,
          ]}
        />
        <Warn>
          '메시지를 처리 중인데 다른 소비자가 같은 메시지를 또 받았다'면 원인은
          대개 <M>가시성 타임아웃이 처리 시간보다 짧아서</M>입니다. 삭제 지연이
          예상되면 타임아웃을 늘리거나 <Cd>ChangeMessageVisibility</Cd>를
          호출하세요.
        </Warn>
        <Exam>
          '메시지가 사라졌다 다시 나타난다 / 두 번 처리된다' 지문 →{" "}
          <M>가시성 타임아웃</M>. 처리가 길어지는 경우의 정답 API는{" "}
          <M>ChangeMessageVisibility</M>.
        </Exam>
      </>
    ),
  },
  {
    id: "s222",
    no: "222",
    cat: "SQS 큐 옵션",
    freq: 2,
    title: "SQS — 배달 못한 편지 큐(DLQ)",
    en: "SQS — Dead Letter Queues",
    time: "3분",
    tags: ["DLQ", "maxReceiveCount", "재시도"],
    body: (
      <>
        <P>
          <B>DLQ(Dead Letter Queue)</B>는 여러 번 처리에 실패한 메시지를{" "}
          <M>따로 격리</M>하는 큐입니다. 정상 큐를 계속 막지 않고, 문제 메시지를
          모아 원인을 분석할 수 있게 합니다.
        </P>
        <D_DLQ />
        <H3 no="A">동작 방식</H3>
        <P>
          소스 큐에 <Cd>maxReceiveCount</Cd>를 설정하면, 한 메시지가 그 횟수만큼
          수신되고도 삭제되지 않을 때 <B>DLQ로 이동</B>합니다.
        </P>
        <H3 no="B">규칙과 정석</H3>
        <UL
          items={[
            <>
              <B>큐 종류 일치</B> — FIFO 큐의 DLQ는 <M>FIFO</M>, 표준 큐의 DLQ는{" "}
              <M>표준</M>이어야 함.
            </>,
            <>
              <B>DLQ 보존은 길게</B> — 분석 시간을 벌기 위해 보존 기간을
              최대(14일)에 가깝게.
            </>,
            <>
              <B>Redrive</B> — 원인 수정 후 DLQ의 메시지를 소스 큐로 되돌려
              재처리 가능.
            </>,
          ]}
        />
        <Tip>
          DLQ는 별도의 새로운 큐 타입이 아니라 <B>보통의 SQS 큐</B>를 "실패
          메시지 목적지"로 지정하는 것뿐입니다.
        </Tip>
        <Exam>
          '반복 실패하는 메시지를 격리·디버깅하고 싶다' →{" "}
          <M>DLQ + maxReceiveCount</M>. 수정 후 다시 처리 → <M>redrive</M>.
        </Exam>
      </>
    ),
  },
  {
    id: "s224",
    no: "224",
    cat: "SQS 큐 옵션",
    freq: 1,
    title: "SQS — 지연 큐(Delay Queue)",
    en: "SQS — Delay Queues",
    time: "2분",
    tags: ["지연 큐", "DelaySeconds"],
    body: (
      <>
        <P>
          <B>지연 큐</B>는 보낸 메시지를 지정한 시간 동안{" "}
          <M>소비자에게 숨겼다가</M> 그 후에 보이게 합니다. 후속 처리를 잠시
          미루고 싶을 때 사용합니다.
        </P>
        <Grid cols={2}>
          <Stat v="15분" l="최대 지연 (900초)" c={C.ye} />
          <Stat v="0초" l="기본 지연 값" c={C.te} />
        </Grid>
        <UL
          items={[
            <>
              큐 단위 기본 지연 외에, 메시지별로 <Cd>DelaySeconds</Cd>(메시지
              타이머)로 개별 지정 가능(표준 큐).
            </>,
            <>
              <B>FIFO 큐</B>는 메시지별 지연을 지원하지 않고 <M>큐 단위 지연</M>
              만 적용됨.
            </>,
          ]}
        />
        <Tip>
          지연 큐(전송 후 잠깐 숨김)와 가시성 타임아웃(수신 후 숨김)은 시점이
          다릅니다. 헷갈리지 마세요.
        </Tip>
        <Exam>
          '메시지를 보내되 N초 뒤부터 처리되게' → <M>지연 큐 / DelaySeconds</M>.
          최대 <M>15분</M>.
        </Exam>
      </>
    ),
  },
  {
    id: "s225",
    no: "225",
    cat: "SQS 표준 큐",
    freq: 3,
    title: "SQS — 공인 개발자 개념",
    en: "SQS — Developer Concepts",
    time: "6분",
    tags: ["롱 폴링", "배치", "확장 클라이언트", "핵심"],
    body: (
      <>
        <P>
          시험에 자주 나오는 SQS 개발자 실무 개념을 모았습니다. 핵심은{" "}
          <M>폴링 방식</M>, <M>메시지 크기 한도</M>, <M>배치 API</M>입니다.
        </P>
        <D_Poll />
        <H3 no="A">숏 폴링 vs 롱 폴링</H3>
        <Tbl
          head={["", "숏 폴링", "롱 폴링"]}
          rows={[
            ["WaitTimeSeconds", "0 (기본)", <B>1 ~ 20초</B>],
            ["빈 응답", "자주 발생", "거의 없음"],
            ["API 호출·비용", "높음", <B>낮음(권장)</B>],
          ]}
        />
        <P>
          롱 폴링은 큐가 비어 있으면 최대 <Cd>WaitTimeSeconds</Cd>까지
          기다렸다가 메시지가 생기면 즉시 응답합니다.
        </P>
        <H3 no="B">크기·배치</H3>
        <Grid cols={3}>
          <Stat v="256KB" l="메시지 최대 크기" c={C.pk} />
          <Stat v="10건" l="배치 API 1회 최대" c={C.or} />
          <Stat v="20초" l="롱 폴링 최대 대기" c={C.te} />
        </Grid>
        <UL
          items={[
            <>
              256KB를 넘는 페이로드는 <B>SQS 확장 클라이언트 라이브러리</B>로
              본문을 <M>S3</M>에 저장하고 큐에는 참조만 보냄(Java).
            </>,
            <>
              <Cd>SendMessageBatch</Cd> / <Cd>DeleteMessageBatch</Cd> 등{" "}
              <B>배치 API</B>로 호출 수와 비용을 절감.
            </>,
          ]}
        />
        <Code title="롱 폴링 수신 (CLI)">{`aws sqs receive-message \\
  --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/my-queue \\
  --wait-time-seconds 20 \\
  --max-number-of-messages 10`}</Code>
        <Warn>
          메시지가 256KB를 넘으면 그냥 보낼 수 없습니다 →{" "}
          <M>확장 클라이언트(S3 오프로딩)</M>가 정답. 또 폴링 비용/빈 응답이
          문제라면 <M>롱 폴링</M>으로 전환.
        </Warn>
        <Exam>
          '빈 수신이 많고 API 비용이 높다' → <M>롱 폴링</M>. '메시지 본문이
          256KB보다 크다' → <M>SQS 확장 클라이언트 + S3</M>.
        </Exam>
      </>
    ),
  },
  {
    id: "s226",
    no: "226",
    cat: "SQS FIFO",
    freq: 3,
    title: "SQS — FIFO 큐",
    en: "SQS — FIFO Queues",
    time: "4분",
    tags: ["FIFO", "순서 보장", "exactly-once", "핵심"],
    body: (
      <>
        <P>
          <B>FIFO 큐</B>는 메시지의 <M>순서를 보장</M>하고{" "}
          <M>중복을 제거(정확히 한 번 처리)</M>합니다. 순서가 중요한 결제·주문
          처리 같은 시나리오의 정답입니다.
        </P>
        <D_FIFO />
        <H3 no="A">두 가지 보장</H3>
        <UL
          items={[
            <>
              <B>순서 보장</B> — 보낸 순서대로 소비됨(First-In-First-Out).
            </>,
            <>
              <B>중복 제거</B> — 중복 제거 창(5분) 안의 동일 메시지는 한 번만
              처리.
            </>,
          ]}
        />
        <H3 no="B">한도·규칙</H3>
        <Grid cols={3}>
          <Stat v="300" l="msg/s (배치 미사용)" c={C.or} />
          <Stat v="3,000" l="msg/s (배치 사용)" c={C.pk} />
          <Stat v=".fifo" l="큐 이름 접미사 필수" c={C.te} />
        </Grid>
        <Warn>
          FIFO는 처리량이 제한(300 msg/s, 배치 시 3,000)됩니다.{" "}
          <B>초고속 대량 처리 + 순서 무관</B>이면 오히려 표준 큐가 정답. 또 큐
          이름은 반드시 <Cd>.fifo</Cd>로 끝나야 하고, 표준↔FIFO는{" "}
          <M>서로 전환 불가</M>(새로 생성).
        </Warn>
        <Exam>
          '메시지 순서 보장이 필요 / 중복 처리를 막아야 한다' → <M>SQS FIFO</M>.
          반대로 순서가 상관없고 처리량이 최우선이면 표준.
        </Exam>
      </>
    ),
  },
  {
    id: "s227",
    no: "227",
    cat: "SQS FIFO",
    freq: 2,
    title: "SQS — FIFO 큐 고급",
    en: "SQS — FIFO Advanced",
    time: "5분",
    tags: ["MessageGroupId", "중복 제거", "병렬"],
    body: (
      <>
        <P>
          FIFO의 순서 보장을 유지하면서 <M>병렬 처리량</M>을 늘리고, 중복을
          어떻게 판별하는지 다룹니다.
        </P>
        <D_FIFOGroup />
        <H3 no="A">중복 제거 방식</H3>
        <UL
          items={[
            <>
              <B>콘텐츠 기반 중복 제거</B> — 메시지 본문의 <M>SHA-256 해시</M>를
              자동으로 중복 판별 키로 사용.
            </>,
            <>
              <B>명시적 ID</B> — <Cd>MessageDeduplicationId</Cd>를 직접 지정.
            </>,
            <>
              중복 제거 창은 <B>5분</B> — 이 시간 안의 동일 키 메시지는 한 번만
              수용.
            </>,
          ]}
        />
        <H3 no="B">메시지 그룹으로 병렬화</H3>
        <P>
          <Cd>MessageGroupId</Cd>가 <B>같은</B> 메시지는 서로 순서가 보장되고,{" "}
          <B>다른</B> 그룹끼리는 <M>병렬</M>로 처리됩니다. 즉 그룹 단위로 순서를
          지키며 확장할 수 있습니다.
        </P>
        <Code title="FIFO 전송 (CLI)">{`aws sqs send-message \\
  --queue-url .../orders.fifo \\
  --message-body "order-42" \\
  --message-group-id customerA \\
  --message-deduplication-id order-42-v1`}</Code>
        <Tip>
          한 메시지 그룹은 동시에 <B>한 소비자</B>만 처리합니다(그룹 내 순서
          보장을 위해). 그룹 수를 늘리면 병렬성이 커집니다.
        </Tip>
        <Exam>
          '순서는 지키되 처리량을 높이고 싶다' →{" "}
          <M>MessageGroupId로 그룹 분리</M>. '중복 자동 판별' →{" "}
          <M>콘텐츠 기반 중복 제거(해시)</M>.
        </Exam>
      </>
    ),
  },
  {
    id: "s228",
    no: "228",
    cat: "SNS · 팬아웃",
    freq: 2,
    title: "Amazon SNS",
    en: "Amazon SNS",
    time: "4분",
    tags: ["Pub/Sub", "토픽", "구독"],
    body: (
      <>
        <P>
          <B>SNS(Simple Notification Service)</B>는 <M>발행/구독(Pub/Sub)</M>{" "}
          서비스입니다. 게시자가 <B>토픽</B>에 한 번 게시하면, 그 토픽을 구독한
          모든 대상에게 메시지가 <M>푸시</M>됩니다.
        </P>
        <D_SNS />
        <H3 no="A">구독자 유형</H3>
        <UL
          items={[
            <>
              <B>SQS</B> · <B>Lambda</B> · <B>Kinesis Data Firehose</B> (AWS
              서비스)
            </>,
            <>
              <B>HTTP/S 엔드포인트</B> · <B>이메일</B> · <B>SMS</B> ·{" "}
              <B>모바일 푸시</B>
            </>,
          ]}
        />
        <H3 no="B">한도와 필터</H3>
        <Grid cols={2}>
          <Stat v="1,250만" l="토픽당 최대 구독 수" c={C.vi} />
          <Stat v="10만" l="계정당 최대 토픽 수" c={C.pk} />
        </Grid>
        <UL
          items={[
            <>
              <B>메시지 필터링</B> — 구독별 <M>필터 정책(JSON)</M>으로 특정
              속성의 메시지만 선별 수신.
            </>,
            <>
              SNS 자체는 메시지를 <M>저장하지 않음</M> — 지속성이 필요하면 SQS와
              결합(→ 229번).
            </>,
          ]}
        />
        <Tip>
          SNS는 <B>푸시</B>(구독자에게 보냄), SQS는 <B>풀</B>(소비자가
          꺼냄)이라는 방향 차이를 꼭 기억하세요.
        </Tip>
        <Exam>
          '한 메시지를 여러 유형의 구독자에게 동시에 알림' → <M>SNS</M>. '조건에
          맞는 구독자만 받게' → <M>SNS 메시지 필터링</M>.
        </Exam>
      </>
    ),
  },
  {
    id: "s229",
    no: "229",
    cat: "SNS · 팬아웃",
    freq: 3,
    title: "SNS + SQS — 팬아웃 패턴",
    en: "SNS + SQS — Fan-Out Pattern",
    time: "6분",
    tags: ["팬아웃", "SNS→SQS", "손실 없음", "핵심"],
    body: (
      <>
        <P>
          <B>팬아웃 패턴</B>은 SNS 토픽에 메시지를 <M>1회 게시</M>하면 여러{" "}
          <M>SQS 큐</M>로 복제 전달되는 구조입니다. 각 SQS가 지속성과 재시도를
          제공하므로 <B>데이터 손실이 없습니다</B>.
        </P>
        <D_Fanout />
        <H3 no="A">왜 SQS를 붙이나</H3>
        <UL
          items={[
            <>
              <B>지속성</B> — SNS는 저장하지 않지만 SQS는 메시지를 <M>보관</M>
              (소비자가 늦어도 안전).
            </>,
            <>
              <B>재시도·DLQ</B> — 각 큐가 독립적으로 재처리·격리 가능.
            </>,
            <>
              <B>독립 소비</B> — 시스템마다 자기 큐를 가지고 자기 속도로 소비.
            </>,
          ]}
        />
        <H3 no="B">요구 조건과 활용</H3>
        <UL
          items={[
            <>
              각 <B>SQS 큐 정책</B>이 SNS의 쓰기를 허용해야 함(→ 220번).
            </>,
            <>
              <B>S3 이벤트 팬아웃</B> — S3는 이벤트당 대상이 하나이므로, 여러
              곳에 보내려면 S3→SNS→여러 SQS 구조를 씀.
            </>,
            <>
              SNS→SQS는 <B>교차 리전</B> 전달도 가능.
            </>,
          ]}
        />
        <Warn>
          팬아웃이 동작하지 않는 대표 원인은{" "}
          <M>SQS 큐 액세스 정책이 SNS 쓰기를 허용하지 않아서</M>입니다. 또 S3는
          같은 이벤트를 여러 대상에 직접 못 보내므로 <B>반드시 SNS를 경유</B>
          해야 합니다.
        </Warn>
        <Exam>
          '동일 이벤트를 여러 시스템에, 손실 없이, 각자 속도로 처리' →{" "}
          <M>SNS + SQS 팬아웃</M>. 'S3 이벤트를 여러 대상에' →{" "}
          <M>S3→SNS→다수 SQS</M>.
        </Exam>
      </>
    ),
  },
  {
    id: "s231",
    no: "231",
    cat: "Kinesis 스트리밍",
    freq: 3,
    title: "Kinesis Data Streams 개요",
    en: "Kinesis Data Streams",
    time: "4분",
    tags: ["샤드", "파티션 키", "순서", "재생", "핵심"],
    body: (
      <>
        <P>
          <B>Kinesis Data Streams</B>는 대용량 데이터를 <M>실시간</M>으로
          수집·처리하는 스트리밍 서비스입니다. SQS와 달리 데이터가 <M>불변</M>
          으로 보존되어 여러 소비자가 <B>재생·재처리</B>할 수 있습니다.
        </P>
        <D_Kinesis />
        <H3 no="A">샤드와 순서</H3>
        <UL
          items={[
            <>
              스트림은 여러 <B>샤드</B>로 나뉘고, 각 레코드는{" "}
              <Cd>PartitionKey</Cd> 해시에 따라 특정 샤드로 라우팅됨.
            </>,
            <>
              순서는 <B>샤드 단위</B>로 보장(같은 파티션 키 → 같은 샤드 → 순서
              유지).
            </>,
            <>
              데이터는 <M>삭제 불가(불변)</M> — 보존 기간 동안 반복 소비 가능.
            </>,
          ]}
        />
        <H3 no="B">용량·보존</H3>
        <Grid cols={3}>
          <Stat v="24시간" l="보존 기본 (최대 365일)" c={C.bl} />
          <Stat v="1MB/s" l="샤드 쓰기 (1,000건/s)" c={C.or} />
          <Stat v="2MB/s" l="샤드 읽기 (공유)" c={C.te} />
        </Grid>
        <UL
          items={[
            <>
              <B>프로비저닝드 모드</B> — 샤드 수를 직접 관리 /{" "}
              <B>온디맨드 모드</B> — 자동 확장.
            </>,
            <>
              <B>향상된 팬아웃</B> — 소비자마다 <M>2MB/s</M> 전용 대역(공유
              한도와 별개).
            </>,
            <>
              레코드 최대 크기 <B>1MB</B>.
            </>,
          ]}
        />
        <Warn>
          샤드당 처리 한도(쓰기 1MB/s·1,000건/s, 읽기 2MB/s)를 넘으면{" "}
          <Cd>ProvisionedThroughputExceeded</Cd> 오류가 납니다. 처리량을
          늘리려면 <M>샤드를 추가</M>하거나 온디맨드를 사용하세요.
        </Warn>
        <Exam>
          '실시간 스트리밍 + 순서 + 데이터 재생/다중 소비/분석' →{" "}
          <M>Kinesis Data Streams</M>. 큐처럼 소비 후 삭제되는 SQS와는 성격이
          다릅니다.
        </Exam>
      </>
    ),
  },
  {
    id: "s233",
    no: "233",
    cat: "Kinesis 스트리밍",
    freq: 2,
    title: "Kinesis Data Firehose 개요",
    en: "Kinesis Data Firehose",
    time: "4분",
    tags: ["준실시간", "서버리스", "적재"],
    body: (
      <>
        <P>
          <B>Kinesis Data Firehose</B>는 스트리밍 데이터를 <M>준실시간</M>으로
          목적지에 <M>적재(load)</M>하는 완전관리형 서비스입니다. 서버리스라
          인프라 관리가 없고, 데이터를 <B>저장하지 않고 흘려보냅니다</B>.
        </P>
        <D_Firehose />
        <H3 no="A">특성</H3>
        <UL
          items={[
            <>
              <B>완전관리형·서버리스</B> — 자동 확장, 관리 부담 없음.
            </>,
            <>
              <B>준실시간</B> — 버퍼가 차거나 시간이 되면 배치로 전송(Data
              Streams처럼 밀리초 단위는 아님).
            </>,
            <>
              <B>무저장</B> — 자체 보존이 없어 지나간 데이터를 재생할 수
              없음(재생이 필요하면 Data Streams).
            </>,
          ]}
        />
        <H3 no="B">Data Streams vs Firehose</H3>
        <Tbl
          head={["", "Data Streams", "Firehose"]}
          rows={[
            ["지연", "실시간", <B>준실시간</B>],
            ["저장·재생", "보존(재생 가능)", "없음"],
            ["관리", "직접(샤드·소비자)", <B>완전관리형</B>],
            ["대상", "커스텀 소비자", "S3·Redshift·OpenSearch·3rd party"],
          ]}
        />
        <Tip>
          전송 전 <B>Lambda로 변환</B>하거나 압축·암호화할 수 있고, 버퍼는{" "}
          <M>크기(MB)</M>와 <M>시간(초)</M> 중 먼저 도달하는 조건으로
          flush됩니다.
        </Tip>
        <Exam>
          '코드 없이 스트림을 S3/Redshift/OpenSearch로 준실시간 적재' →{" "}
          <M>Firehose</M>. '저지연 + 재생 + 커스텀 처리' → <M>Data Streams</M>.
        </Exam>
      </>
    ),
  },
  {
    id: "s235",
    no: "235",
    cat: "Kinesis 스트리밍",
    freq: 1,
    title: "Managed Service for Apache Flink",
    en: "Managed Service for Apache Flink",
    time: "2분",
    tags: ["실시간 분석", "Flink", "MSK"],
    body: (
      <>
        <P>
          <B>Amazon Managed Service for Apache Flink</B>(구 Kinesis Data
          Analytics for Apache Flink)는 스트림 데이터에 대해 <M>실시간 분석</M>
          을 수행합니다. Flink 애플리케이션(Java/Scala/Python) 또는 SQL로
          집계·필터·조인을 처리합니다.
        </P>
        <UL
          items={[
            <>
              소스: <M>Kinesis Data Streams</M>와{" "}
              <M>Amazon MSK(Managed Kafka)</M>.
            </>,
            <>
              실시간 윈도우 집계, 이상 탐지 등 <B>스트림 분석</B>에 사용.
            </>,
          ]}
        />
        <Warn>
          자주 나오는 함정: Flink의 소스는 <M>Data Streams / MSK</M>입니다.{" "}
          <B>Firehose는 Flink의 소스가 아닙니다</B> — 이 조합을 정답처럼
          제시하는 오답 선택지에 주의하세요.
        </Warn>
        <Exam>
          '스트림 데이터를 실시간 SQL/집계 분석' →{" "}
          <M>Managed Service for Apache Flink</M>. 단순 적재만이면 Firehose.
        </Exam>
      </>
    ),
  },
  {
    id: "s236",
    no: "236",
    cat: "종합 비교",
    freq: 3,
    title: "SQS 대 SNS 대 Kinesis",
    en: "SQS vs SNS vs Kinesis",
    time: "3분",
    tags: ["비교", "결정 트리", "핵심"],
    body: (
      <>
        <P>
          세 서비스를 <M>한 장</M>으로 구분하는 토픽입니다. 시험은 지문 신호를
          주고 "무엇을 쓸까"를 묻습니다.
        </P>
        <D_Compare />
        <H3 no="A">핵심 비교표</H3>
        <Tbl
          head={["", "SQS", "SNS", "Kinesis"]}
          rows={[
            ["모델", "큐(소비자 폴링)", "발행/구독(푸시)", "스트리밍"],
            [
              "소비 후",
              "삭제됨",
              "구독자에 푸시(비저장)",
              <B>보존·재생 가능</B>,
            ],
            ["순서", "FIFO만", "없음", "샤드 단위"],
            [
              "다중 소비",
              "큐당 1회 처리",
              "구독자 모두",
              <B>여러 소비자 재생</B>,
            ],
            [
              "대표 용도",
              "작업 분산·디커플링",
              "팬아웃·알림",
              "실시간 분석·로그",
            ],
          ]}
        />
        <H3 no="B">지문 신호 → 정답</H3>
        <UL
          items={[
            <>
              <M>디커플링 · 버퍼 · 작업 큐 · 소비 후 삭제</M> → <B>SQS</B>
            </>,
            <>
              <M>동일 메시지를 여러 시스템에 · 푸시 · 팬아웃 · 알림</M> →{" "}
              <B>SNS</B>
            </>,
            <>
              <M>실시간 · 순서 · 재생 · 다중 소비 · 스트림 분석</M> →{" "}
              <B>Kinesis</B>
            </>,
          ]}
        />
        <Warn>
          흔한 혼동: <B>SNS 자체는 메시지를 저장하지 않아</B> 손실 방지가
          필요하면 SQS와 결합(팬아웃)해야 하고,{" "}
          <B>Firehose도 저장하지 않으므로</B> 데이터 재생이 필요하면 Kinesis
          Data Streams를 골라야 합니다.
        </Warn>
        <Exam>
          지문 한 줄로 판별: '디커플링'→SQS · '팬아웃/알림'→SNS · '실시간
          스트리밍·재생·분석'→Kinesis. 이 세 신호가 이 섹션 전체의 결론입니다.
        </Exam>
      </>
    ),
  },
];

/* ╔══════════════════════════════════════════════════════════╗
   ║  이하 앱 셸 — 수정 금지 (META·CATS·SECTIONS를 자동 반영)     ║
   ╚══════════════════════════════════════════════════════════╝ */

function Home({ go }) {
  const n3 = SECTIONS.filter((s) => s.freq === 3).length;
  return (
    <div>
      <div className="hero">
        <div className="eyebrow">{META.eyebrow}</div>
        <h2>
          {META.titleLines.map((l, i) => (
            <React.Fragment key={i}>
              {l}
              {i < META.titleLines.length - 1 ? <br /> : null}
            </React.Fragment>
          ))}
        </h2>
        <p className="lead">{META.lead}</p>
      </div>

      <Grid cols={3}>
        <Stat v={String(SECTIONS.length)} l="이론 토픽 (전체 커버)" c={C.or} />
        <Stat v={String(CATS.length)} l="카테고리" c={C.te} />
        <Stat v={String(n3)} l="매우 빈출(★★★) 토픽" c={C.rd} />
      </Grid>

      <H3 no="A">빈출도 읽는 법</H3>
      <div
        style={{
          display: "flex",
          gap: 22,
          flexWrap: "wrap",
          alignItems: "center",
          margin: "14px 0 8px",
        }}
      >
        {[3, 2, 1].map((n) => (
          <span key={n} className="freq">
            <Bars n={n} />
            <span className="tx" style={{ color: FREQ[n].c }}>
              {FREQ[n].t}
            </span>
          </span>
        ))}
      </div>
      <P>
        <span style={{ fontSize: 12.5, color: C.dim }}>
          * 빈출도는 공식 통계가 아니라{" "}
          <B>강의 비중 · 시험 가이드 · 응시 후기</B>를 종합한 추정치입니다. ★가
          낮아도 출제 범위이므로 전부 학습하는 것을 권장합니다.
        </span>
      </P>

      <H3 no="B">카테고리별 목차</H3>
      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))" }}
      >
        {CATS.map((cat) => {
          const list = SECTIONS.filter((s) => s.cat === cat.name);
          if (!list.length) return null;
          return (
            <div key={cat.name} className="gcard">
              <div className="gt">
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: cat.c,
                    display: "inline-block",
                  }}
                />
                {cat.name}
              </div>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {list.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => go(s.id)}
                    className="nav-item"
                    style={{ padding: "5px 4px", borderLeft: 0 }}
                  >
                    <span className="idx">{s.no}</span>
                    <span className="tt">{s.title}</span>
                    <Bars n={s.freq} />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <H3 no="C">시험 전 30초 — 핵심 숫자</H3>
      <div className="pillrow">
        {META.pills.map((t) => (
          <span key={t} className="pill">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionView({ sec, go }) {
  const i = SECTIONS.findIndex((s) => s.id === sec.id);
  const prev = SECTIONS[i - 1];
  const next = SECTIONS[i + 1];
  const catColor = (CATS.find((c) => c.name === sec.cat) || {}).c || C.or;
  return (
    <div>
      <div className="crumb">
        <span style={{ color: catColor }}>■</span>
        <span>{sec.cat}</span>
        <span className="sep">/</span>
        <span className="cd2">{sec.en}</span>
        <span className="sep">/</span>
        <span>강의 {sec.time}</span>
      </div>
      <h2 className="title">
        {sec.no}. {sec.title}
      </h2>
      <div className="meta">
        <Freq n={sec.freq} />
        <div className="tags">
          {sec.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      </div>
      {sec.body}
      <div className="navft">
        {prev ? (
          <button className="navbtn" onClick={() => go(prev.id)}>
            <div className="nd">← PREV · {prev.no}</div>
            <div className="nt">{prev.title}</div>
          </button>
        ) : (
          <button className="navbtn" onClick={() => go(null)}>
            <div className="nd">← HOME</div>
            <div className="nt">대시보드</div>
          </button>
        )}
        {next ? (
          <button className="navbtn nx" onClick={() => go(next.id)}>
            <div className="nd">NEXT · {next.no} →</div>
            <div className="nt">{next.title}</div>
          </button>
        ) : (
          <button className="navbtn nx" onClick={() => go(null)}>
            <div className="nd">완주! →</div>
            <div className="nt">홈으로 돌아가기</div>
          </button>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [activeId, setActiveId] = useState(null);
  const [query, setQuery] = useState("");
  const [navOpen, setNavOpen] = useState(false);

  const go = (id) => {
    setActiveId(id);
    setNavOpen(false);
  };

  useEffect(() => {
    const el = document.getElementById("guide-main");
    if (el) el.scrollIntoView({ block: "start" });
    window.scrollTo({ top: 0 });
  }, [activeId]);

  const q = query.trim().toLowerCase();
  const match = (s) =>
    !q ||
    s.title.toLowerCase().includes(q) ||
    s.en.toLowerCase().includes(q) ||
    s.tags.join(" ").toLowerCase().includes(q);

  const active = SECTIONS.find((s) => s.id === activeId) || null;

  return (
    <div className="app">
      <style>{CSS}</style>
      <button className="menu-btn" onClick={() => setNavOpen(!navOpen)}>
        ≡ 목차
      </button>
      <div
        className={"scrim" + (navOpen ? " show" : "")}
        onClick={() => setNavOpen(false)}
      />

      <aside className={"side" + (navOpen ? " open" : "")}>
        <div className="brand" onClick={() => go(null)}>
          <div className="lam">
            <div className="glyph">{META.glyph}</div>
            <div>
              <h1>{META.brandTitle}</h1>
              <div className="sub">
                {META.brandSub} · {SECTIONS.length} TOPICS
              </div>
            </div>
          </div>
        </div>
        <div className="search">
          <span className="ic">⌕</span>
          <input
            placeholder="토픽 · 태그 검색…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {CATS.map((cat) => {
          const list = SECTIONS.filter((s) => s.cat === cat.name && match(s));
          if (!list.length) return null;
          return (
            <div className="cat" key={cat.name}>
              <div className="ch">
                <span className="dot" style={{ background: cat.c }} />
                {cat.name}
              </div>
              {list.map((s) => (
                <button
                  key={s.id}
                  className={"nav-item" + (activeId === s.id ? " on" : "")}
                  onClick={() => go(s.id)}
                >
                  <span className="idx">{s.no}</span>
                  <span className="tt">{s.title}</span>
                  <Bars n={s.freq} />
                </button>
              ))}
            </div>
          );
        })}
        <div
          style={{
            padding: "18px 20px 26px",
            fontSize: 10.5,
            color: C.dim,
            fontFamily: "var(--mono)",
            letterSpacing: ".06em",
          }}
        >
          {META.footNote}
        </div>
      </aside>

      <main className="main" id="guide-main">
        <div className="wrap">
          {active ? <SectionView sec={active} go={go} /> : <Home go={go} />}
        </div>
      </main>
    </div>
  );
}
