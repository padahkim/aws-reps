//opus 4.8 max
import React, { useState, useEffect, useRef } from "react";
import {
  Network,
  GitBranch,
  Split,
  Shuffle,
  FileCode2,
  Database,
  KeyRound,
  Activity,
  Globe,
  ShieldCheck,
  GitCompare,
  Radio,
  Building2,
  Lightbulb,
  AlertTriangle,
  Target,
  ChevronRight,
  ChevronLeft,
  Zap,
  Server,
  Cloud,
  Lock,
  Users,
  Boxes,
  Info,
  BookOpen,
  ArrowRight,
} from "lucide-react";

/* =========================================================================
   AWS API Gateway — DVA 개념 정리 (인터랙티브)
   단일 파일 React 아티팩트. 실습 제외, 모든 개념 포함.
   ========================================================================= */

const CSS = `
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css');
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root{
  --bg:#EEF2F7; --ink:#0F1D2B; --ink2:#16283B; --panel:#FFFFFF;
  --line:#D9E1EB; --line2:#E8EDF3; --text:#1E2A3A; --muted:#5E6E82; --faint:#8695A6;
  --amber:#ED8B2C; --amber-d:#C96E12; --amber-bg:#FCF1E3;
  --teal:#14938A; --teal-bg:#E1F2F0;
  --blue:#2C63E6; --blue-bg:#E7EEFD;
  --green:#2C9A56; --green-bg:#E4F3EA;
  --red:#DB4A34; --red-bg:#FBE7E2;
  --purple:#6E51F0; --purple-bg:#ECE8FD;
  --disp:'Space Grotesk','Pretendard',system-ui,sans-serif;
  --body:'Pretendard',system-ui,-apple-system,'Segoe UI',sans-serif;
  --mono:'JetBrains Mono',ui-monospace,'SFMono-Regular',monospace;
}

*{box-sizing:border-box}
.agw-root{
  font-family:var(--body); color:var(--text); background:var(--bg);
  min-height:100vh; line-height:1.6; -webkit-font-smoothing:antialiased;
}
.agw-root button{font-family:inherit}

/* ---------- Layout ---------- */
.shell{display:flex; max-width:1280px; margin:0 auto; min-height:100vh;
  background:var(--bg); position:relative;}
.sidebar{
  width:290px; flex:0 0 290px; background:var(--ink);
  position:sticky; top:0; height:100vh; overflow-y:auto;
  padding:26px 16px 40px; border-right:1px solid #21344a;
}
.main{flex:1 1 auto; min-width:0; padding:40px 46px 90px; max-width:900px;}

/* ---------- Sidebar brand ---------- */
.brand{padding:0 8px 20px; margin-bottom:12px; border-bottom:1px solid #22374f;}
.brand-tag{font-family:var(--mono); font-size:11px; letter-spacing:.18em;
  color:var(--amber); text-transform:uppercase; font-weight:600;}
.brand-h{color:#fff; font-family:var(--disp); font-weight:700; font-size:20px;
  letter-spacing:-.01em; margin:6px 0 4px;}
.brand-sub{color:#8ba0b8; font-size:12.5px;}

/* ---------- Nav ---------- */
.nav{display:flex; flex-direction:column; gap:2px; margin-top:8px;}
.nav-item{
  display:flex; align-items:center; gap:11px; width:100%; text-align:left;
  background:transparent; border:0; cursor:pointer; color:#B9C7D6;
  padding:9px 10px; border-radius:9px; transition:background .14s,color .14s;
}
.nav-item:hover{background:#1b2f45; color:#eaf1f8;}
.nav-item.active{background:var(--amber); color:#1a1207;}
.nav-item.active .nav-num{color:#5a3c10;}
.nav-item.active .ni-ico{color:#3d2807;}
.nav-num{font-family:var(--mono); font-size:11px; font-weight:600; color:#5f7386;
  width:20px; flex:0 0 20px;}
.ni-ico{flex:0 0 17px; color:#7d93aa;}
.nav-item.active .ni-ico{color:#3d2807;}
.nav-lbl{font-size:13.5px; font-weight:500; flex:1 1 auto;}
.nav-bars{display:flex; gap:2px; align-items:flex-end; height:12px;}
.nav-bars i{width:3px; border-radius:1px; background:#3a5069;}
.nav-item.active .nav-bars i{background:#7a5312;}

.legend{margin-top:22px; padding:14px 12px; background:#132539; border-radius:11px;}
.legend h4{margin:0 0 10px; color:#9fb2c6; font-size:11px; letter-spacing:.1em;
  text-transform:uppercase; font-family:var(--mono);}
.legend-row{display:flex; align-items:center; gap:9px; font-size:12px;
  color:#c3d0dd; padding:3px 0;}
.legend-dot{width:9px; height:9px; border-radius:3px; flex:0 0 9px;}

/* ---------- Section header ---------- */
.sec-head{margin-bottom:28px;}
.eyebrow{display:inline-flex; align-items:center; gap:8px; font-family:var(--mono);
  font-size:11.5px; letter-spacing:.16em; text-transform:uppercase;
  color:var(--amber-d); font-weight:600; margin-bottom:12px;}
.eyebrow .en{color:var(--faint);}
.sec-title{font-family:var(--disp); font-weight:700; font-size:32px;
  letter-spacing:-.02em; color:var(--ink); margin:0 0 6px; line-height:1.15;}
.sec-title .accent{color:var(--amber);}
.sec-lead{font-size:15.5px; color:var(--muted); max-width:62ch;}
.head-meta{display:flex; align-items:center; gap:14px; flex-wrap:wrap; margin-top:16px;}

/* ---------- Freq badge ---------- */
.freq{display:inline-flex; align-items:center; gap:9px; padding:6px 12px 6px 10px;
  border-radius:999px; font-size:12.5px; font-weight:600; border:1px solid;}
.freq .fbars{display:flex; gap:2.5px; align-items:flex-end; height:14px;}
.freq .fbars i{width:3.5px; border-radius:1px;}
.freq .flabel{font-family:var(--body);}
.freq .ftag{font-family:var(--mono); font-size:10.5px; opacity:.75; font-weight:500;}

/* ---------- Prose ---------- */
.main h2{font-family:var(--disp); font-size:20px; font-weight:600; color:var(--ink);
  letter-spacing:-.01em; margin:38px 0 14px; display:flex; align-items:center; gap:10px;}
.main h2 .h-ico{color:var(--amber); flex:0 0 auto;}
.main h3{font-size:15px; font-weight:700; color:var(--ink2); margin:24px 0 10px;}
.main p{margin:0 0 14px; font-size:15px;}
.main p.tight{margin-bottom:8px;}
strong{color:var(--ink2); font-weight:600;}
code, .k{font-family:var(--mono); font-size:.86em; background:var(--line2);
  color:var(--ink2); padding:1.5px 6px; border-radius:5px; font-weight:500;
  border:1px solid var(--line); white-space:nowrap;}

/* ---------- Lists ---------- */
.list{list-style:none; padding:0; margin:0 0 16px; display:flex; flex-direction:column; gap:9px;}
.list li{position:relative; padding-left:24px; font-size:14.5px;}
.list li::before{content:''; position:absolute; left:4px; top:9px; width:7px; height:7px;
  border-radius:2px; background:var(--amber); transform:rotate(45deg);}
.list.teal li::before{background:var(--teal);}
.list.blue li::before{background:var(--blue);}

/* ---------- Cards ---------- */
.cards{display:grid; grid-template-columns:repeat(auto-fit,minmax(215px,1fr));
  gap:14px; margin:6px 0 18px;}
.card{background:var(--panel); border:1px solid var(--line); border-radius:14px;
  padding:16px 17px;}
.card .c-ico{width:34px; height:34px; border-radius:9px; display:grid; place-items:center;
  margin-bottom:11px;}
.card h4{margin:0 0 5px; font-size:14.5px; font-weight:700; color:var(--ink2);}
.card p{margin:0; font-size:13px; color:var(--muted); line-height:1.55;}

/* ---------- Callout ---------- */
.callout{display:flex; gap:13px; padding:15px 17px; border-radius:13px;
  margin:16px 0; border:1px solid; font-size:14px;}
.callout .co-ico{flex:0 0 22px; margin-top:1px;}
.callout .co-body{flex:1 1 auto;}
.callout .co-title{font-weight:700; margin-bottom:3px; font-size:13.5px;
  letter-spacing:.01em; display:block;}
.callout p{margin:0; font-size:13.5px;}
.callout.key{background:var(--teal-bg); border-color:#bfe3df;}
.callout.key .co-ico,.callout.key .co-title{color:var(--teal);}
.callout.exam{background:var(--amber-bg); border-color:#f2d9b8;}
.callout.exam .co-ico,.callout.exam .co-title{color:var(--amber-d);}
.callout.warn{background:var(--red-bg); border-color:#f2c8bf;}
.callout.warn .co-ico,.callout.warn .co-title{color:var(--red);}

/* ---------- Diagram frame ---------- */
.diagram{background:
    linear-gradient(var(--panel),var(--panel)) padding-box,
    var(--panel);
  border:1px solid var(--line); border-radius:16px; padding:24px 22px 18px;
  margin:18px 0 22px;
  background-image:radial-gradient(var(--line2) 1px, transparent 1px);
  background-size:18px 18px; background-color:#FBFCFE;
}
.diagram .dg-cap{font-family:var(--mono); font-size:11px; letter-spacing:.06em;
  color:var(--faint); text-transform:uppercase; margin-top:14px; text-align:center;}

/* ---------- Flow / Node ---------- */
.flow{display:flex; align-items:stretch; justify-content:center; gap:0;
  flex-wrap:wrap;}
.flow.col{flex-direction:column; align-items:center;}
.node{background:#fff; border:1.5px solid var(--line); border-radius:12px;
  padding:12px 14px; min-width:120px; max-width:190px; text-align:center;
  display:flex; flex-direction:column; align-items:center; gap:6px;
  box-shadow:0 1px 2px rgba(15,29,43,.04);}
.node .n-ico{width:30px; height:30px; border-radius:8px; display:grid; place-items:center;}
.node .n-t{font-size:13px; font-weight:700; color:var(--ink2); line-height:1.25;}
.node .n-s{font-size:11px; color:var(--muted); line-height:1.35; font-family:var(--mono);}
.node.wide{max-width:260px;}
/* variants */
.v-client{border-color:#c9d3df;} .v-client .n-ico{background:#eef2f7;color:#5e6e82;}
.v-apigw{border-color:var(--amber);background:var(--amber-bg);} .v-apigw .n-ico{background:var(--amber);color:#fff;}
.v-lambda{border-color:#f2c8ba;} .v-lambda .n-ico{background:var(--amber-bg);color:var(--amber-d);}
.v-aws{border-color:#bcd0f5;} .v-aws .n-ico{background:var(--blue-bg);color:var(--blue);}
.v-http{border-color:#bfe3df;} .v-http .n-ico{background:var(--teal-bg);color:var(--teal);}
.v-cognito{border-color:#cabcf5;} .v-cognito .n-ico{background:var(--purple-bg);color:var(--purple);}
.v-cache{border-color:#c2e6cd;} .v-cache .n-ico{background:var(--green-bg);color:var(--green);}
.v-sec{border-color:#f2c8bf;} .v-sec .n-ico{background:var(--red-bg);color:var(--red);}
.v-db{border-color:#bcd0f5;} .v-db .n-ico{background:var(--blue-bg);color:var(--blue);}
.v-user{border-color:#c9d3df;} .v-user .n-ico{background:#eef2f7;color:#5e6e82;}

/* arrow */
.arrow{display:flex; flex-direction:column; align-items:center; justify-content:center;
  min-width:56px; padding:0 4px; align-self:center; position:relative;}
.arrow .a-lbl{font-family:var(--mono); font-size:10px; color:var(--muted);
  margin-bottom:3px; white-space:nowrap; background:#FBFCFE; padding:0 3px;}
.arrow .a-line{width:100%; height:0; border-top:2px solid var(--faint); position:relative;}
.arrow .a-line::after{content:''; position:absolute; right:-1px; top:-4px;
  border-left:7px solid var(--faint); border-top:4px solid transparent;
  border-bottom:4px solid transparent;}
.arrow.dashed .a-line{border-top-style:dashed;}
.arrow.amber .a-line{border-color:var(--amber);} .arrow.amber .a-line::after{border-left-color:var(--amber);}
.arrow.two .a-line::before{content:''; position:absolute; left:-1px; top:-4px;
  border-right:7px solid var(--faint); border-top:4px solid transparent; border-bottom:4px solid transparent;}

/* stack gap when wrapped vertical */
.flow.col .arrow{min-height:34px; width:56px;}
.flow.col .arrow .a-line{width:0; height:100%; border-top:0; border-left:2px solid var(--faint);}
.flow.col .arrow .a-line::after{right:auto; left:-4px; top:auto; bottom:-1px;
  border-left:4px solid transparent; border-right:4px solid transparent;
  border-top:7px solid var(--faint); border-bottom:0;}
.flow.col .arrow .a-lbl{margin-bottom:0; margin-left:8px; position:absolute; left:100%;
  white-space:nowrap;}

/* ---------- Pills / methods ---------- */
.pill{display:inline-flex; align-items:center; gap:6px; font-family:var(--mono);
  font-size:11.5px; font-weight:600; padding:3px 9px; border-radius:6px;
  border:1px solid;}
.m-GET{background:var(--green-bg);color:var(--green);border-color:#bfe3cb;}
.m-POST{background:var(--amber-bg);color:var(--amber-d);border-color:#f2d9b8;}
.m-PUT{background:var(--blue-bg);color:var(--blue);border-color:#bcd0f5;}
.m-DELETE{background:var(--red-bg);color:var(--red);border-color:#f2c8bf;}
.m-ANY{background:#eef2f7;color:#5e6e82;border-color:#d3dce6;}
.m-OPTIONS{background:var(--purple-bg);color:var(--purple);border-color:#cabcf5;}

/* ---------- Table ---------- */
.tbl-wrap{overflow-x:auto; margin:8px 0 20px; border:1px solid var(--line);
  border-radius:13px;}
table.cmp{border-collapse:collapse; width:100%; font-size:13.5px; min-width:460px;}
table.cmp th,table.cmp td{padding:11px 14px; text-align:left; border-bottom:1px solid var(--line2);}
table.cmp thead th{background:var(--ink); color:#fff; font-weight:600; font-size:12.5px;
  font-family:var(--disp);}
table.cmp thead th:first-child{border-top-left-radius:12px;}
table.cmp thead th:last-child{border-top-right-radius:12px;}
table.cmp tbody tr:last-child td{border-bottom:0;}
table.cmp td:first-child{font-weight:600; color:var(--ink2); background:#FAFBFD;}
table.cmp .yes{color:var(--green); font-weight:600;}
table.cmp .no{color:var(--red); font-weight:600;}
table.cmp tbody tr:hover{background:#FAFBFD;}

/* ---------- Split bar (canary/traffic) ---------- */
.tbar{display:flex; height:44px; border-radius:11px; overflow:hidden;
  border:1px solid var(--line); font-family:var(--disp); font-weight:600;}
.tbar .seg{display:grid; place-items:center; color:#fff; font-size:14px;}

/* ---------- Latency bars ---------- */
.lat{display:flex; flex-direction:column; gap:12px; margin:6px 0;}
.lat-row{display:flex; align-items:center; gap:12px;}
.lat-name{width:150px; flex:0 0 150px; font-size:13px; font-weight:600; color:var(--ink2);}
.lat-track{flex:1 1 auto; height:26px; background:var(--line2); border-radius:7px;
  position:relative; overflow:hidden;}
.lat-fill{position:absolute; top:0; left:0; height:100%; border-radius:7px;
  display:flex; align-items:center; padding-left:10px; font-size:11.5px;
  font-family:var(--mono); color:#fff; white-space:nowrap;}

/* ---------- Steps (numbered) ---------- */
.steps{counter-reset:s; display:flex; flex-direction:column; gap:12px; margin:8px 0 18px;}
.step{display:flex; gap:13px; align-items:flex-start;}
.step .s-num{counter-increment:s; flex:0 0 27px; width:27px; height:27px;
  border-radius:8px; background:var(--ink); color:#fff; display:grid; place-items:center;
  font-family:var(--mono); font-weight:600; font-size:13px;}
.step .s-num::before{content:counter(s);}
.step .s-txt{font-size:14px; padding-top:2px;}
.step .s-txt b{color:var(--ink2);}

/* ---------- Footer nav ---------- */
.pager{display:flex; justify-content:space-between; gap:12px; margin-top:46px;
  padding-top:22px; border-top:1px solid var(--line);}
.pg-btn{display:flex; align-items:center; gap:10px; background:var(--panel);
  border:1px solid var(--line); border-radius:12px; padding:12px 16px; cursor:pointer;
  text-align:left; max-width:48%; transition:border-color .14s, transform .1s;}
.pg-btn:hover{border-color:var(--amber);}
.pg-btn:active{transform:translateY(1px);}
.pg-btn.next{margin-left:auto; text-align:right;}
.pg-dir{font-family:var(--mono); font-size:10.5px; letter-spacing:.1em;
  text-transform:uppercase; color:var(--faint);}
.pg-t{font-size:14px; font-weight:700; color:var(--ink2);}
.pg-ico{color:var(--amber); flex:0 0 auto;}

/* mobile top-nav (hidden on desktop) */
.mtop{display:none;}

/* ---------- Focus ---------- */
.agw-root :focus-visible{outline:2.5px solid var(--amber); outline-offset:2px;
  border-radius:6px;}

/* ---------- Responsive ---------- */
@media (max-width:940px){
  .shell{flex-direction:column;}
  .sidebar{display:none;}
  .mtop{display:block; position:sticky; top:0; z-index:20; background:var(--ink);
    padding:12px 14px; border-bottom:1px solid #21344a;}
  .mtop-brand{color:#fff; font-family:var(--disp); font-weight:700; font-size:15px;
    margin-bottom:9px; display:flex; align-items:center; gap:8px;}
  .mtop-brand .en{color:var(--amber); font-family:var(--mono); font-size:11px;
    letter-spacing:.12em;}
  .mchips{display:flex; gap:7px; overflow-x:auto; padding-bottom:3px;
    scrollbar-width:none;}
  .mchips::-webkit-scrollbar{display:none;}
  .mchip{flex:0 0 auto; background:#1b2f45; color:#c3d0dd; border:0;
    padding:7px 12px; border-radius:8px; font-size:12.5px; font-weight:500;
    cursor:pointer; white-space:nowrap; font-family:var(--body);}
  .mchip.active{background:var(--amber); color:#1a1207; font-weight:600;}
  .main{padding:26px 18px 70px; max-width:100%;}
  .sec-title{font-size:26px;}
}
@media (max-width:640px){
  .flow{flex-direction:column; align-items:stretch;}
  .node{max-width:100%; width:100%;}
  .arrow{min-width:auto; width:100%; min-height:30px; padding:2px 0;}
  .arrow .a-line{width:0; height:100%; border-top:0; border-left:2px solid var(--faint);
    margin:0 auto;}
  .arrow .a-line::after{right:auto; left:-4px; top:auto; bottom:-1px;
    border-left:4px solid transparent; border-right:4px solid transparent;
    border-top:7px solid var(--faint); border-bottom:0;}
  .arrow.amber .a-line{border-left-color:var(--amber);}
  .arrow.amber .a-line::after{border-top-color:var(--amber);}
  .arrow .a-lbl{margin-bottom:0;}
  .lat-name{width:110px; flex-basis:110px; font-size:12px;}
  .pg-btn{max-width:100%;}
}
@media (prefers-reduced-motion:reduce){
  *{transition:none !important; animation:none !important;}
}
`;

/* ---------------------- Frequency config ---------------------- */
const FREQ = {
  4: {
    label: "매우 높음",
    tag: "CORE",
    color: "#DB4A34",
    bg: "#FBE7E2",
    bd: "#f2c8bf",
  },
  3: {
    label: "높음",
    tag: "HIGH",
    color: "#ED8B2C",
    bg: "#FCF1E3",
    bd: "#f2d9b8",
  },
  2: {
    label: "중간",
    tag: "MED",
    color: "#2C63E6",
    bg: "#E7EEFD",
    bd: "#bcd0f5",
  },
  1: {
    label: "낮음",
    tag: "LOW",
    color: "#5E6E82",
    bg: "#EEF2F7",
    bd: "#d3dce6",
  },
};

/* ---------------------- Small components ---------------------- */
function Bars({ level, height = 14, color }) {
  return (
    <span className="fbars" style={{ height }}>
      {[1, 2, 3, 4].map((i) => (
        <i
          key={i}
          style={{
            height: `${(i / 4) * 100}%`,
            background: i <= level ? color : "#00000018",
          }}
        />
      ))}
    </span>
  );
}

function Freq({ level }) {
  const f = FREQ[level];
  return (
    <span
      className="freq"
      style={{ background: f.bg, borderColor: f.bd, color: f.color }}
    >
      <Bars level={level} color={f.color} />
      <span className="flabel">빈출 {f.label}</span>
      <span className="ftag">{f.tag}</span>
    </span>
  );
}

const M = ({ m }) => <span className={`pill m-${m}`}>{m}</span>;

function Callout({ type = "key", title, children }) {
  const map = {
    key: { ic: <Lightbulb size={19} />, t: title || "핵심" },
    exam: { ic: <Target size={19} />, t: title || "시험 포인트" },
    warn: { ic: <AlertTriangle size={19} />, t: title || "주의 · 함정" },
  };
  const m = map[type];
  return (
    <div className={`callout ${type}`}>
      <span className="co-ico">{m.ic}</span>
      <div className="co-body">
        <span className="co-title">{m.t}</span>
        <div>{children}</div>
      </div>
    </div>
  );
}

function Node({ variant = "client", icon, t, s }) {
  return (
    <div className={`node v-${variant}`}>
      {icon && <div className="n-ico">{icon}</div>}
      <div className="n-t">{t}</div>
      {s && <div className="n-s">{s}</div>}
    </div>
  );
}

function Arrow({ label, style = "", cls = "" }) {
  return (
    <div className={`arrow ${cls}`}>
      {label && <span className="a-lbl">{label}</span>}
      <div className="a-line" />
    </div>
  );
}

function Diagram({ cap, children }) {
  return (
    <div className="diagram">
      <div className="flow">{children}</div>
      {cap && <div className="dg-cap">{cap}</div>}
    </div>
  );
}

function Card({ icon, tone = "amber", h, children }) {
  const tones = {
    amber: ["var(--amber-bg)", "var(--amber-d)"],
    teal: ["var(--teal-bg)", "var(--teal)"],
    blue: ["var(--blue-bg)", "var(--blue)"],
    green: ["var(--green-bg)", "var(--green)"],
    purple: ["var(--purple-bg)", "var(--purple)"],
    red: ["var(--red-bg)", "var(--red)"],
  };
  const [bg, fg] = tones[tone];
  return (
    <div className="card">
      {icon && (
        <div className="c-ico" style={{ background: bg, color: fg }}>
          {icon}
        </div>
      )}
      <h4>{h}</h4>
      <p>{children}</p>
    </div>
  );
}

/* =====================================================================
   SECTIONS
   ===================================================================== */

/* ---- 00 · 소개 ---- */
function Intro() {
  return (
    <>
      <p>
        Amazon <strong>API Gateway</strong>는 클라이언트의 HTTP/WebSocket 요청을
        받아 백엔드(주로 <strong>AWS Lambda</strong>)로 전달하는{" "}
        <strong>서버리스 · 완전관리형</strong>
        API 관문입니다. DVA 시험에서 Lambda 다음으로 비중이 큰 서버리스
        서비스이며, 특히 <strong>통합(Integration) 유형</strong>과{" "}
        <strong>인증/권한</strong>은 거의 매 회차 출제됩니다.
      </p>

      <Callout type="exam" title="이 자료의 빈출빈도(빈출 표시)에 대해">
        각 주제의 <b>빈출 표시</b>는 공식 AWS 발표 수치가 아니라, DVA 시험의
        일반적인 출제 경향을 바탕으로 한 <b>추정 지표</b>입니다. 상대적 학습
        우선순위를 잡는 용도로 참고하세요. 아래 표에서 전체 우선순위를 한눈에 볼
        수 있습니다.
      </Callout>

      <h2>
        <BookOpen className="h-ico" size={20} /> 주제별 학습 지도 & 우선순위
      </h2>
      <div className="tbl-wrap">
        <table className="cmp">
          <thead>
            <tr>
              <th>주제</th>
              <th>핵심 키워드</th>
              <th>빈출</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["개요 · 엔드포인트", "Edge/Regional/Private, 통합 대상", 3],
              ["단계(Stage) & 배포", "배포 필수, Stage 변수 → Lambda alias", 2],
              ["Canary 배포", "트래픽 % 분할, 승격(promote)", 2],
              ["통합 유형 & 매핑", "Proxy vs 비-Proxy, VTL 매핑 템플릿", 4],
              ["OpenAPI", "import/export, 요청 검증(validation)", 2],
              ["캐싱", "TTL 300s, Cache-Control 무효화", 3],
              ["사용 계획 & API 키", "throttle/quota, x-api-key, 429", 3],
              ["모니터링·로깅·추적", "IntegrationLatency vs Latency, X-Ray", 3],
              ["CORS", "OPTIONS preflight 헤더 3종", 3],
              [
                "인증 & 권한",
                "IAM/Cognito/Lambda Authorizer/Resource Policy",
                4,
              ],
              ["REST vs HTTP API", "기능 vs 가격·지연", 2],
              ["WebSocket API", "route selection, @connections 콜백", 2],
              ["아키텍처", "단일 진입점 + 마이크로서비스", 2],
            ].map((r, i) => {
              const f = FREQ[r[2]];
              return (
                <tr key={i}>
                  <td>{r[0]}</td>
                  <td style={{ color: "var(--muted)", fontSize: 12.5 }}>
                    {r[1]}
                  </td>
                  <td>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 7,
                      }}
                    >
                      <Bars level={r[2]} color={f.color} height={13} />
                      <span
                        style={{
                          color: f.color,
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                      >
                        {f.label}
                      </span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2>
        <Network className="h-ico" size={20} /> API Gateway가 하는 일 (한 장
        요약)
      </h2>
      <Diagram cap="클라이언트 → API Gateway → 백엔드 3종">
        <Node
          variant="client"
          icon={<Users size={17} />}
          t="클라이언트"
          s="Web / Mobile / SDK"
        />
        <Arrow label="HTTPS" cls="amber" />
        <Node
          variant="apigw"
          icon={<Network size={17} />}
          t="API Gateway"
          s="인증·throttle·캐시·변환"
        />
        <Arrow />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Node
            variant="lambda"
            icon={<Zap size={15} />}
            t="Lambda"
            s="가장 흔한 대상"
          />
          <Node
            variant="http"
            icon={<Server size={15} />}
            t="HTTP 백엔드"
            s="온프렘/EC2/ALB"
          />
          <Node
            variant="aws"
            icon={<Cloud size={15} />}
            t="AWS 서비스"
            s="SQS·SNS·DDB·StepFn"
          />
        </div>
      </Diagram>

      <div className="cards">
        <Card icon={<Zap size={18} />} tone="amber" h="서버리스 & 관리형">
          서버 관리 없이 스케일. Lambda와 결합해 완전 서버리스 API 구성.
        </Card>
        <Card icon={<GitBranch size={18} />} tone="blue" h="버전·환경">
          Stage로 dev/test/prod 분리, 배포 이력으로 롤백.
        </Card>
        <Card icon={<ShieldCheck size={18} />} tone="teal" h="보안·인증">
          IAM·Cognito·Lambda Authorizer·Resource Policy.
        </Card>
        <Card icon={<KeyRound size={18} />} tone="green" h="트래픽 제어">
          사용 계획·API 키로 throttle & quota 관리.
        </Card>
        <Card icon={<Shuffle size={18} />} tone="purple" h="요청/응답 변환">
          VTL 매핑 템플릿으로 body/헤더/포맷 변환.
        </Card>
        <Card icon={<Database size={18} />} tone="red" h="캐싱·모니터링">
          응답 캐시, CloudWatch 지표/로그, X-Ray 추적.
        </Card>
      </div>

      <Callout type="key" title="한 줄 정리">
        API Gateway는{" "}
        <b>“요청을 받아 백엔드로 넘기기 전/후에 필요한 모든 것”</b>
        (인증, 제한, 캐시, 변환, 검증, 모니터링)을 담당하는 <b>관문 레이어</b>
        입니다.
      </Callout>
    </>
  );
}

/* ---- 01 · 개요 & 엔드포인트 ---- */
function Overview() {
  return (
    <>
      <p>
        API Gateway는 크게 <strong>세 종류의 백엔드</strong>와 통합할 수 있고,
        API가 노출되는 <strong>엔드포인트 유형</strong>을 선택합니다. 엔드포인트
        유형은 시험에서 <em>“어디서 접근하는지 / 지연시간 최적화”</em> 형태로
        자주 물어봅니다.
      </p>

      <h2>
        <Cloud className="h-ico" size={20} /> 통합 대상 3종
      </h2>
      <div className="cards">
        <Card icon={<Zap size={18} />} tone="amber" h="Lambda 함수">
          가장 일반적. 서버리스 REST/HTTP API 구성. 매핑/프록시로 연결.
        </Card>
        <Card icon={<Server size={18} />} tone="teal" h="HTTP 엔드포인트">
          온프레미스, ALB, 외부 HTTP API 등에 프록시. Rate limiting·인증 추가.
        </Card>
        <Card icon={<Cloud size={18} />} tone="blue" h="AWS 서비스">
          Kinesis·SQS·SNS·DynamoDB·Step Functions를 API로 노출/제어.
        </Card>
      </div>

      <h2>
        <Globe className="h-ico" size={20} /> 엔드포인트 유형 (Endpoint Types)
      </h2>
      <Diagram cap="Edge-Optimized(기본) · Regional · Private">
        <Node
          variant="apigw"
          icon={<Globe size={16} />}
          t="Edge-Optimized"
          s="기본값 · CloudFront 경유"
        />
        <Node
          variant="aws"
          icon={<Server size={16} />}
          t="Regional"
          s="같은 리전 클라이언트"
        />
        <Node
          variant="sec"
          icon={<Lock size={16} />}
          t="Private"
          s="VPC 내부 전용"
        />
      </Diagram>
      <ul className="list">
        <li>
          <strong>Edge-Optimized(기본)</strong>: 요청이{" "}
          <strong>CloudFront 엣지 로케이션</strong>을 통해 라우팅. API Gateway
          자체는 특정 리전에 있지만 <strong>전 세계 클라이언트</strong>의 지연을
          줄임.
        </li>
        <li>
          <strong>Regional</strong>: 같은 리전 내 클라이언트용. 필요 시 자신의
          CloudFront 배포와 결합해 엣지 캐싱을 <strong>직접 제어</strong> 가능.
        </li>
        <li>
          <strong>Private</strong>: <strong>VPC 내부에서만</strong>{" "}
          ENI(인터페이스 VPC 엔드포인트)를 통해 접근. 접근 제어는{" "}
          <strong>Resource Policy</strong>로 정의.
        </li>
      </ul>

      <Callout type="exam">
        “전 세계 사용자 지연 최소화” → <b>Edge-Optimized</b>. “VPC 안에서만
        호출” →<b> Private + Resource Policy</b>. “엣지 캐싱을 내가 직접 관리” →{" "}
        <b>Regional + 직접 CloudFront</b>.
      </Callout>

      <h2>
        <Boxes className="h-ico" size={20} /> 함께 알아둘 특징
      </h2>
      <ul className="list teal">
        <li>
          커스텀 도메인 + <strong>ACM SSL 인증서</strong> 연결 가능 (Edge는{" "}
          <code>us-east-1</code> 인증서 필요, Regional은 해당 리전 인증서).
        </li>
        <li>Route 53으로 커스텀 도메인을 API Gateway에 매핑.</li>
        <li>
          <strong>WAF</strong> 연동으로 웹 공격 방어(REST API에서 지원).
        </li>
        <li>
          OpenAPI(Swagger)로 API 정의 <strong>가져오기/내보내기</strong>.
        </li>
      </ul>
    </>
  );
}

/* ---- 02 · 단계 & 배포 ---- */
function Stages() {
  return (
    <>
      <p>
        API Gateway에서 변경 사항은 <strong>즉시 반영되지 않습니다.</strong>{" "}
        반드시
        <strong> 배포(Deployment)</strong>를 해서 <strong>단계(Stage)</strong>로
        밀어 넣어야 실제로 적용됩니다. 이 “배포하지 않으면 적용 안 됨”은
        대표적인 함정 포인트입니다.
      </p>

      <Callout type="warn">
        메서드·통합을 수정하고 <b>배포를 안 하면</b> 클라이언트에는{" "}
        <b>예전 동작</b>이 그대로 보입니다. “변경했는데 반영이 안 된다” →{" "}
        <b>Deploy to stage</b>를 잊었는지 확인.
      </Callout>

      <h2>
        <GitBranch className="h-ico" size={20} /> 배포와 단계
      </h2>
      <Diagram cap="변경 → 배포 → 여러 Stage로 관리">
        <Node
          variant="user"
          icon={<FileCode2 size={16} />}
          t="API 변경"
          s="메서드·통합 수정"
        />
        <Arrow label="Deploy" cls="amber" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Node
            variant="http"
            icon={<GitBranch size={14} />}
            t="dev stage"
            s=".../dev"
          />
          <Node
            variant="aws"
            icon={<GitBranch size={14} />}
            t="test stage"
            s=".../test"
          />
          <Node
            variant="apigw"
            icon={<GitBranch size={14} />}
            t="prod stage"
            s=".../prod"
          />
        </div>
      </Diagram>
      <ul className="list">
        <li>
          각 <strong>Stage는 고유 URL</strong>을 가짐:{" "}
          <code>
            https://api-id.execute-api.region.amazonaws.com/<b>prod</b>
          </code>
        </li>
        <li>
          원하는 만큼 Stage 생성 가능(dev/test/prod 등), 각기{" "}
          <strong>독립 구성</strong>.
        </li>
        <li>
          Stage마다 <strong>배포 이력(deployment history)</strong>이 있어 이전
          배포로 <strong>롤백</strong> 가능.
        </li>
      </ul>

      <h2>
        <Shuffle className="h-ico" size={20} /> Stage 변수 (Stage Variables)
      </h2>
      <p>
        Stage 변수는 API Gateway의 <strong>환경 변수</strong>와 같습니다.
        Stage마다 다른 값을 주어{" "}
        <strong>Lambda ARN, HTTP 엔드포인트, 매핑 템플릿 파라미터</strong> 등을
        바꿀 수 있습니다.
      </p>
      <Diagram cap="Stage 변수로 Stage → Lambda alias 연결 (대표 패턴)">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Node
            variant="http"
            icon={<GitBranch size={14} />}
            t="dev stage"
            s="lambdaAlias=DEV"
          />
          <Node
            variant="apigw"
            icon={<GitBranch size={14} />}
            t="prod stage"
            s="lambdaAlias=PROD"
          />
        </div>
        <Arrow label="${stageVariables}" cls="amber" />
        <Node
          variant="lambda"
          icon={<Zap size={16} />}
          t="Lambda 함수"
          s="alias: DEV / PROD"
        />
      </Diagram>
      <ul className="list teal">
        <li>
          대표 활용: Stage 변수 → <strong>Lambda alias</strong> 지정.{" "}
          <code>dev</code> Stage는 DEV alias, <code>prod</code> Stage는 PROD
          alias 호출.
        </li>
        <li>
          Lambda로 전달되어{" "}
          <strong>
            이벤트의 <code>stageVariables</code>
          </strong>
          로 함수 안에서도 접근 가능.
        </li>
        <li>서드파티 HTTP 백엔드 URL을 Stage별로 다르게 지정할 때도 유용.</li>
      </ul>

      <Callout type="exam" title="자주 나오는 조합">
        <b>“하나의 API로 dev/prod 환경 분리 + 각기 다른 Lambda 버전 호출”</b> →
        Stage 변수 값을 Lambda <b>alias</b>에 매핑. 코드 변경 없이 환경별
        라우팅.
      </Callout>
    </>
  );
}

/* ---- 03 · Canary ---- */
function Canary() {
  return (
    <>
      <p>
        <strong>Canary 배포</strong>는 새 버전을{" "}
        <strong>일부 트래픽에만</strong> 먼저 노출해 안전하게 검증하는
        방식입니다. Stage에 <strong>Canary를 활성화</strong>하고 트래픽의 몇 %를
        Canary 채널로 보낼지 지정합니다.
      </p>

      <h2>
        <Split className="h-ico" size={20} /> 트래픽 분할
      </h2>
      <div className="diagram">
        <div className="tbar" style={{ maxWidth: 560, margin: "4px auto 0" }}>
          <div
            className="seg"
            style={{ flex: "0 0 90%", background: "var(--blue)" }}
          >
            기존 버전 · 90%
          </div>
          <div
            className="seg"
            style={{ flex: "0 0 10%", background: "var(--amber)" }}
          >
            Canary · 10%
          </div>
        </div>
        <div className="dg-cap">
          예: 트래픽의 10%만 새(Canary) 버전으로 라우팅
        </div>
      </div>

      <ul className="list">
        <li>
          Canary로 보낼 <strong>트래픽 비율(%)</strong>을 지정 (예: 5%, 10%).
        </li>
        <li>
          Canary는 <strong>지표·로그가 분리</strong>되어 새 버전만의 오류/지연을
          별도 관찰.
        </li>
        <li>
          <strong>Stage 변수를 Canary에서 override</strong> 가능 → 새 버전이
          다른 Lambda/설정을 쓰게 함.
        </li>
        <li>
          검증 후 <strong>승격(promote)</strong> → 모든 변경이 Stage 전체에
          반영, Canary 트래픽 100%로.
        </li>
      </ul>

      <Diagram cap="검증 → 승격(promote) 흐름">
        <Node
          variant="apigw"
          icon={<Split size={16} />}
          t="Canary 활성"
          s="10% 라우팅"
        />
        <Arrow label="지표 확인" />
        <Node
          variant="aws"
          icon={<Activity size={16} />}
          t="새 버전 검증"
          s="오류/지연 OK?"
        />
        <Arrow label="promote" cls="amber" />
        <Node
          variant="http"
          icon={<GitBranch size={16} />}
          t="Stage 전체 반영"
          s="100% 새 버전"
        />
      </Diagram>

      <Callout type="key">
        Canary는 API Gateway에서 <b>Blue/Green 스타일 점진적 배포</b>를 구현하는
        방법입니다. “새 API 버전을 소수 사용자에게만 먼저” →{" "}
        <b>Canary + 트래픽 %</b>.
      </Callout>
    </>
  );
}

/* ---- 04 · 통합 & 매핑 ---- */
function Integration() {
  return (
    <>
      <p>
        <strong>통합 유형(Integration Type)</strong>은 API Gateway와 백엔드를
        어떻게 연결할지 정합니다. 시험에서 가장 중요한 구분은{" "}
        <strong>Proxy vs 비(非)-Proxy</strong>입니다. 이 차이 하나가 여러 문제의
        핵심입니다.
      </p>

      <h2>
        <Shuffle className="h-ico" size={20} /> 통합 유형 4종
      </h2>
      <div className="cards">
        <Card icon={<Boxes size={18} />} tone="purple" h="MOCK">
          백엔드 없이 API Gateway가 <b>직접 응답</b> 반환. 테스트/스텁용.
        </Card>
        <Card
          icon={<Shuffle size={18} />}
          tone="blue"
          h="HTTP / AWS (비-Proxy)"
        >
          요청/응답을 <b>매핑 템플릿</b>으로 가공. 세밀한 변환 가능.
        </Card>
        <Card
          icon={<Zap size={18} />}
          tone="amber"
          h="AWS_PROXY (Lambda Proxy)"
        >
          요청을 <b>가공 없이</b> Lambda로. 응답은 <b>정해진 형식</b>으로 반환.
        </Card>
        <Card icon={<Server size={18} />} tone="teal" h="HTTP_PROXY">
          요청을 <b>그대로</b> HTTP 백엔드로 전달(패스스루).
        </Card>
      </div>

      <h2>
        <GitCompare className="h-ico" size={20} /> Lambda Proxy vs 비-Proxy
      </h2>
      <Diagram cap="위: Proxy(패스스루) · 아래: 비-Proxy(매핑 변환)">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            width: "100%",
          }}
        >
          <div className="flow" style={{ justifyContent: "center" }}>
            <Node variant="client" icon={<Users size={15} />} t="클라이언트" />
            <Arrow label="원본 요청" cls="amber" />
            <Node
              variant="apigw"
              icon={<Zap size={15} />}
              t="AWS_PROXY"
              s="변환 없음"
            />
            <Arrow label="event" />
            <Node
              variant="lambda"
              icon={<Zap size={15} />}
              t="Lambda"
              s="정해진 응답 형식"
            />
          </div>
          <div className="flow" style={{ justifyContent: "center" }}>
            <Node variant="client" icon={<Users size={15} />} t="클라이언트" />
            <Arrow label="요청" />
            <Node
              variant="apigw"
              icon={<Shuffle size={15} />}
              t="비-Proxy"
              s="매핑 템플릿(VTL)"
            />
            <Arrow label="변환 후" cls="amber" />
            <Node
              variant="lambda"
              icon={<Zap size={15} />}
              t="Lambda / HTTP"
              s="자유로운 형식"
            />
          </div>
        </div>
      </Diagram>

      <div className="tbl-wrap">
        <table className="cmp">
          <thead>
            <tr>
              <th>항목</th>
              <th>Lambda Proxy (AWS_PROXY)</th>
              <th>Lambda (비-Proxy)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>매핑 템플릿</td>
              <td className="no">없음(설정 불필요)</td>
              <td className="yes">요청·응답 모두 구성</td>
            </tr>
            <tr>
              <td>요청 전달</td>
              <td>event 객체로 그대로</td>
              <td>템플릿으로 가공</td>
            </tr>
            <tr>
              <td>응답 형식</td>
              <td>
                <b>고정 형식 필수</b> (statusCode/headers/body)
              </td>
              <td>자유(템플릿이 변환)</td>
            </tr>
            <tr>
              <td>구성 위치</td>
              <td>
                <b>Lambda 코드</b>에서 처리
              </td>
              <td>
                <b>API Gateway</b>에서 처리
              </td>
            </tr>
            <tr>
              <td>유연성 / 편의</td>
              <td>설정 간단, 코드 부담↑</td>
              <td>변환 강력, 설정 복잡</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout type="warn" title="Lambda Proxy 응답 형식">
        Proxy 통합에서 Lambda는 반드시 아래 형태로 반환해야 합니다. 이걸 안
        지키면
        <b> 502 Bad Gateway</b>가 납니다.
        <div style={{ marginTop: 8 }}>
          <code>
            {"{ statusCode, headers, body(문자열), isBase64Encoded }"}
          </code>
        </div>
      </Callout>

      <h2>
        <FileCode2 className="h-ico" size={20} /> 매핑 템플릿 (Mapping Templates
        · VTL)
      </h2>
      <p>
        비-Proxy 통합에서 <strong>매핑 템플릿</strong>은{" "}
        <strong>VTL(Velocity Template Language)</strong>로 요청/응답을
        재구성합니다. 파라미터 이름 변경, body 수정, 헤더 추가, 쿼리스트링 매핑,
        그리고 <strong>JSON ↔ XML(SOAP)</strong> 변환까지 가능합니다.
      </p>
      <Diagram cap="대표 사례: REST(JSON) ↔ 레거시 SOAP(XML) 변환">
        <Node
          variant="client"
          icon={<Users size={15} />}
          t="클라이언트"
          s="JSON REST"
        />
        <Arrow label="JSON" />
        <Node
          variant="apigw"
          icon={<Shuffle size={15} />}
          t="API Gateway"
          s="매핑 템플릿"
        />
        <Arrow label="→ XML" cls="amber" />
        <Node
          variant="http"
          icon={<Server size={15} />}
          t="SOAP 백엔드"
          s="XML"
        />
      </Diagram>
      <ul className="list blue">
        <li>
          Content-Type별로 템플릿 지정: <code>application/json</code>,{" "}
          <code>application/xml</code>.
        </li>
        <li>
          쿼리스트링/경로/헤더 파라미터를 백엔드가 원하는 형태로{" "}
          <strong>재배치</strong>.
        </li>
        <li>
          SOAP API 앞단에 두어 <strong>클라이언트에는 REST(JSON)로 노출</strong>
          , 백엔드에는 XML로 전달.
        </li>
      </ul>

      <Callout type="exam">
        “요청 body/파라미터를 <b>백엔드 전에 변형</b>” →{" "}
        <b>비-Proxy + 매핑 템플릿(VTL)</b>. “변형 없이 최대한 단순하게 Lambda로”
        → <b>Lambda Proxy</b>. “SOAP/XML 백엔드를 REST로 노출” →{" "}
        <b>매핑 템플릿</b>.
      </Callout>
    </>
  );
}

/* ---- 05 · OpenAPI ---- */
function OpenAPI() {
  return (
    <>
      <p>
        <strong>OpenAPI(구 Swagger) 3.0</strong> 사양으로 API를 코드처럼
        정의하고 API Gateway로 <strong>가져오거나(import)</strong>, 현재 API를{" "}
        <strong>내보낼(export)</strong> 수 있습니다. 문서화·형상관리·SDK 생성에
        유용합니다.
      </p>

      <h2>
        <FileCode2 className="h-ico" size={20} /> Import / Export
      </h2>
      <Diagram cap="OpenAPI 사양으로 API 정의를 왕복">
        <Node
          variant="user"
          icon={<FileCode2 size={16} />}
          t="OpenAPI 파일"
          s="YAML / JSON"
        />
        <div className="arrow two amber">
          <span className="a-lbl">import / export</span>
          <div className="a-line" />
        </div>
        <Node
          variant="apigw"
          icon={<Network size={16} />}
          t="API Gateway"
          s="메서드·통합 자동 생성"
        />
      </Diagram>
      <ul className="list">
        <li>
          <strong>Import</strong>: OpenAPI 사양으로 메서드·통합·모델을{" "}
          <strong>한 번에 생성</strong>.
        </li>
        <li>
          <strong>Export</strong>: 기존 API를 OpenAPI 사양으로 뽑아
          문서/버전관리.
        </li>
        <li>
          사양으로부터 <strong>클라이언트 SDK 생성</strong> 가능.
        </li>
      </ul>

      <h2>
        <ShieldCheck className="h-ico" size={20} /> 요청 검증 (Request
        Validation)
      </h2>
      <p>
        OpenAPI 사양에 검증 규칙을 넣으면 API Gateway가{" "}
        <strong>백엔드 호출 전에</strong>
        요청을 검사합니다. 잘못된 요청은 즉시 거절해{" "}
        <strong>불필요한 Lambda 호출/비용을 절감</strong>합니다.
      </p>
      <Diagram cap="검증 실패 시 백엔드까지 가지 않고 즉시 4xx">
        <Node variant="client" icon={<Users size={15} />} t="요청" />
        <Arrow />
        <Node
          variant="apigw"
          icon={<ShieldCheck size={15} />}
          t="요청 검증"
          s="필수 파라미터/스키마"
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="flow">
            <Arrow label="통과" cls="amber" />
            <Node variant="lambda" icon={<Zap size={14} />} t="Lambda" />
          </div>
          <div className="flow">
            <Arrow label="실패 → 400" />
            <Node
              variant="sec"
              icon={<AlertTriangle size={14} />}
              t="즉시 거절"
            />
          </div>
        </div>
      </Diagram>
      <ul className="list teal">
        <li>
          URI/쿼리스트링/헤더의 <strong>필수 파라미터</strong> 존재 여부 검사.
        </li>
        <li>
          요청 <strong>body가 모델(JSON Schema)</strong>에 맞는지 검사.
        </li>
        <li>
          검증 규칙은 OpenAPI 사양의 <strong>확장(extension)</strong>으로 정의
          가능.
        </li>
      </ul>

      <Callout type="exam">
        “필수 파라미터 누락 시 <b>Lambda를 호출하지 않고</b> 걸러내고 싶다” →
        <b> API Gateway 요청 검증(Request Validation)</b>.
      </Callout>
    </>
  );
}

/* ---- 06 · 캐싱 ---- */
function Caching() {
  return (
    <>
      <p>
        <strong>캐싱</strong>은 엔드포인트 응답을 저장해{" "}
        <strong>백엔드 호출 수를 줄이고 지연을 낮춥니다.</strong>
        숫자(기본 TTL, 범위)와 <strong>무효화(invalidation)</strong> 방식이 자주
        출제됩니다.
      </p>

      <h2>
        <Database className="h-ico" size={20} /> 캐시 동작
      </h2>
      <Diagram cap="캐시 히트 시 백엔드를 건너뜀">
        <Node variant="client" icon={<Users size={15} />} t="클라이언트" />
        <Arrow />
        <Node
          variant="cache"
          icon={<Database size={15} />}
          t="API GW 캐시"
          s="TTL 기본 300s"
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="flow">
            <Arrow label="Hit → 즉시" cls="amber" />
            <Node variant="client" icon={<Zap size={14} />} t="캐시 응답" />
          </div>
          <div className="flow">
            <Arrow label="Miss" />
            <Node
              variant="lambda"
              icon={<Server size={14} />}
              t="백엔드 호출"
            />
          </div>
        </div>
      </Diagram>

      <div className="cards">
        <Card icon={<Database size={18} />} tone="green" h="기본 TTL 300초">
          범위 <b>0 ~ 3600초</b>. <b>TTL=0 이면 캐시 안 함</b>.
        </Card>
        <Card icon={<GitBranch size={18} />} tone="blue" h="Stage 단위">
          캐시는 <b>Stage 수준</b>에서 정의. <b>메서드별 override</b> 가능.
        </Card>
        <Card icon={<Boxes size={18} />} tone="purple" h="용량 0.5GB~237GB">
          암호화 옵션 제공. 비용이 큼 → <b>주로 prod</b>에서 사용.
        </Card>
      </div>

      <h2>
        <AlertTriangle className="h-ico" size={20} /> 캐시 무효화 (Invalidation)
      </h2>
      <ul className="list">
        <li>
          콘솔/CLI로 <strong>전체 캐시 즉시 flush</strong> 가능.
        </li>
        <li>
          클라이언트는 헤더 <code>Cache-Control: max-age=0</code>로{" "}
          <strong>특정 항목 무효화</strong> 요청 가능.
        </li>
        <li>
          단, 이 무효화는{" "}
          <strong>
            IAM 권한(<code>InvalidateCache</code>)
          </strong>
          이 있어야 함.
        </li>
      </ul>

      <Callout type="warn" title="시험 단골 함정">
        무효화 정책을 <b>강제하지 않으면</b>, <b>아무 클라이언트나</b>{" "}
        <code>Cache-Control: max-age=0</code>로 캐시를 무력화할 수 있습니다.
        반드시 <b>InvalidateCache 권한을 요구</b>하도록 설정하세요.
      </Callout>

      <Callout type="key">
        “백엔드 부하/지연을 줄이는 가장 간단한 방법” →{" "}
        <b>Stage 캐싱 + 적절한 TTL</b>. “특정 응답만 즉시 갱신” →{" "}
        <b>Cache-Control: max-age=0 (권한 필요)</b> 또는 <b>flush</b>.
      </Callout>
    </>
  );
}

/* ---- 07 · 사용 계획 & API 키 ---- */
function Usage() {
  return (
    <>
      <p>
        API를 외부에 <strong>상품처럼 제공</strong>할 때,{" "}
        <strong>사용 계획(Usage Plan)</strong>과<strong> API 키</strong>로 “누가
        · 얼마나 · 얼마나 빨리” 호출할 수 있는지 제어합니다.
      </p>

      <h2>
        <KeyRound className="h-ico" size={20} /> 구성 요소
      </h2>
      <Diagram cap="사용 계획 = throttle + quota, API 키 = 고객 식별">
        <Node
          variant="user"
          icon={<Users size={15} />}
          t="고객"
          s="x-api-key 헤더"
        />
        <Arrow label="key 포함" cls="amber" />
        <Node variant="apigw" icon={<KeyRound size={15} />} t="API 키 확인" />
        <Arrow />
        <Node
          variant="http"
          icon={<Activity size={15} />}
          t="사용 계획"
          s="throttle · quota"
        />
        <Arrow />
        <Node variant="lambda" icon={<Zap size={15} />} t="백엔드" />
      </Diagram>

      <div className="cards">
        <Card icon={<Activity size={18} />} tone="blue" h="Throttle(속도)">
          초당 요청 수(rate)와 순간 버스트(burst) 제한.
        </Card>
        <Card icon={<Database size={18} />} tone="green" h="Quota(총량)">
          일/주/월 <b>총 호출 수</b> 상한.
        </Card>
        <Card icon={<KeyRound size={18} />} tone="amber" h="API 키">
          고객별 발급·배포. 계획·Stage에 연결해 개별 제한 적용.
        </Card>
      </div>

      <h3>설정 순서</h3>
      <div className="steps">
        <div className="step">
          <div className="s-num" />
          <div className="s-txt">
            API를 만들고 메서드가 <b>API 키를 요구</b>하도록 설정
          </div>
        </div>
        <div className="step">
          <div className="s-num" />
          <div className="s-txt">
            <b>사용 계획</b> 생성 → throttle · quota 한도 지정
          </div>
        </div>
        <div className="step">
          <div className="s-num" />
          <div className="s-txt">
            사용 계획에 <b>Stage와 API 키</b>를 연결
          </div>
        </div>
        <div className="step">
          <div className="s-num" />
          <div className="s-txt">
            고객은 요청 시 <M m="POST" /> 헤더 <code>x-api-key</code>에 키를
            담아 호출
          </div>
        </div>
      </div>

      <h2>
        <AlertTriangle className="h-ico" size={20} /> Throttling & 429
      </h2>
      <ul className="list">
        <li>
          계정 수준 기본 한도(soft): 약 <strong>10,000 rps</strong>, 버스트{" "}
          <strong>5,000</strong> (리전별, 상향 요청 가능).
        </li>
        <li>
          Stage/메서드 수준, 사용 계획(키별) 수준으로{" "}
          <strong>세분화 제한</strong>.
        </li>
        <li>
          한도 초과 시 <code>429 Too Many Requests</code> 반환.
        </li>
      </ul>

      <Callout type="exam">
        “고객마다 다른 <b>호출 한도/과금 티어</b>” → <b>Usage Plan + API 키</b>.
        “속도 초과 응답 코드” → <b>429</b>. API 키는 <b>x-api-key</b> 헤더로
        전달.
      </Callout>
    </>
  );
}

/* ---- 08 · 모니터링 ---- */
function Monitoring() {
  return (
    <>
      <p>
        운영 가시성은{" "}
        <strong>CloudWatch Logs · CloudWatch Metrics · X-Ray</strong> 세
        축입니다. 특히 <strong>IntegrationLatency vs Latency</strong> 구분은
        시험 단골입니다.
      </p>

      <h2>
        <Activity className="h-ico" size={20} /> 지연시간(Latency) 두 지표
      </h2>
      <div className="diagram">
        <div className="lat">
          <div className="lat-row">
            <div className="lat-name">IntegrationLatency</div>
            <div className="lat-track">
              <div
                className="lat-fill"
                style={{ width: "62%", background: "var(--blue)" }}
              >
                백엔드 처리 구간
              </div>
            </div>
          </div>
          <div className="lat-row">
            <div className="lat-name">Latency (전체)</div>
            <div className="lat-track">
              <div
                className="lat-fill"
                style={{ width: "100%", background: "var(--amber)" }}
              >
                클라이언트 요청 → 응답 전체
              </div>
            </div>
          </div>
        </div>
        <div className="dg-cap">
          Latency ⊃ IntegrationLatency (+ API Gateway 자체 오버헤드)
        </div>
      </div>
      <ul className="list">
        <li>
          <strong>IntegrationLatency</strong>: API Gateway가{" "}
          <strong>백엔드로 요청을 넘긴 뒤 응답을 받기까지</strong>. 즉{" "}
          <strong>백엔드 처리 시간</strong>.
        </li>
        <li>
          <strong>Latency</strong>: API Gateway가{" "}
          <strong>클라이언트 요청을 받고 응답을 돌려주기까지 전체</strong>.
          IntegrationLatency + 게이트웨이 오버헤드.
        </li>
      </ul>
      <Callout type="exam">
        “지연이 큰데 원인이 <b>백엔드인지 게이트웨이인지</b>?” → 두 지표를 비교.
        IntegrationLatency가 크면 <b>백엔드가 느린 것</b>, Latency만 크면{" "}
        <b>게이트웨이/네트워크 오버헤드</b>.
      </Callout>

      <h2>
        <Database className="h-ico" size={20} /> CloudWatch Metrics & Logs
      </h2>
      <div className="cards">
        <Card icon={<Activity size={18} />} tone="blue" h="주요 지표">
          Count, 4XXError, 5XXError, Latency, IntegrationLatency, CacheHitCount,
          CacheMissCount.
        </Card>
        <Card icon={<FileCode2 size={18} />} tone="green" h="CloudWatch Logs">
          Stage별 활성화(메서드별 override). 로그 레벨 ERROR/INFO/DEBUG,
          요청/응답 본문 로깅.
        </Card>
        <Card icon={<Network size={18} />} tone="purple" h="AWS X-Ray">
          요청 추적으로 병목 구간 시각화. API Gateway + Lambda 결합 시{" "}
          <b>전 구간 추적</b>.
        </Card>
      </div>
      <Diagram cap="X-Ray로 요청 전 구간 추적">
        <Node variant="client" icon={<Users size={15} />} t="클라이언트" />
        <Arrow />
        <Node
          variant="apigw"
          icon={<Network size={15} />}
          t="API Gateway"
          s="X-Ray 활성"
        />
        <Arrow />
        <Node
          variant="lambda"
          icon={<Zap size={15} />}
          t="Lambda"
          s="Active Tracing"
        />
        <Arrow />
        <Node variant="db" icon={<Database size={15} />} t="DynamoDB 등" />
      </Diagram>

      <Callout type="key">
        캐시 효율은 <b>CacheHitCount / CacheMissCount</b>로 판단. 오류율은{" "}
        <b>4XX(클라이언트) / 5XX(서버·백엔드)</b>로 구분.
      </Callout>
    </>
  );
}

/* ---- 09 · CORS ---- */
function Cors() {
  return (
    <>
      <p>
        <strong>CORS(Cross-Origin Resource Sharing)</strong>는{" "}
        <strong>다른 도메인(Origin)</strong>의 웹 페이지가 우리 API를 호출할 때
        필요한 브라우저 보안 메커니즘입니다. 프론트엔드가 API Gateway와 다른
        도메인에 있으면 <strong>반드시 활성화</strong>해야 합니다.
      </p>

      <h2>
        <Globe className="h-ico" size={20} /> Preflight(사전 요청) 흐름
      </h2>
      <Diagram cap="브라우저가 실제 요청 전 OPTIONS로 허용 여부 확인">
        <Node
          variant="client"
          icon={<Globe size={15} />}
          t="브라우저"
          s="다른 Origin"
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="flow">
            <Arrow label="① OPTIONS (preflight)" cls="amber" />
            <Node
              variant="apigw"
              icon={<ShieldCheck size={15} />}
              t="API Gateway"
              s="허용 헤더 응답"
            />
          </div>
          <div className="flow">
            <Arrow label="② 실제 요청 (GET/POST…)" />
            <Node
              variant="apigw"
              icon={<Network size={15} />}
              t="API Gateway"
            />
          </div>
        </div>
      </Diagram>

      <p>
        Preflight(
        <M m="OPTIONS" />) 응답에는 다음 <strong>3개 헤더</strong>가 포함되어야
        합니다:
      </p>
      <ul className="list teal">
        <li>
          <code>Access-Control-Allow-Origin</code> — 허용할 도메인 (예:{" "}
          <code>https://app.example.com</code>)
        </li>
        <li>
          <code>Access-Control-Allow-Methods</code> — 허용 메서드 (GET, POST …)
        </li>
        <li>
          <code>Access-Control-Allow-Headers</code> — 허용 요청 헤더
        </li>
      </ul>

      <Callout type="exam">
        “브라우저 콘솔에 <b>CORS 에러</b>, 다른 도메인 SPA에서 API 호출 실패” →
        API Gateway에서 <b>CORS 활성화</b>(OPTIONS 메서드 + 3개 Allow 헤더).
        콘솔에서 한 번에 설정 가능.
      </Callout>
    </>
  );
}

/* ---- 10 · 인증 & 권한 ---- */
function Auth() {
  return (
    <>
      <p>
        API Gateway 인증/권한은 <strong>4가지</strong>가 있습니다. “누가
        쓰는가(내부 IAM / 외부 사용자 / 서드파티 토큰)”에 따라 선택이 갈리며,
        DVA에서 <strong>가장 자주 나오는 비교</strong>입니다.
      </p>

      <h2>
        <ShieldCheck className="h-ico" size={20} /> 4가지 방식 한눈에
      </h2>
      <div className="cards">
        <Card icon={<Lock size={18} />} tone="blue" h="IAM 권한">
          SigV4 서명. <b>AWS 계정 내부</b> 사용자/역할·서비스 간 호출에 적합.
        </Card>
        <Card icon={<ShieldCheck size={18} />} tone="red" h="Resource Policy">
          API에 붙이는 정책. <b>교차 계정</b>·특정 <b>IP/VPC</b> 접근 제어.
        </Card>
        <Card icon={<Users size={18} />} tone="purple" h="Cognito User Pools">
          완전관리형 <b>사용자 풀</b>. 신원 검증 자동, <b>코드 불필요</b>.
        </Card>
        <Card icon={<KeyRound size={18} />} tone="amber" h="Lambda Authorizer">
          직접 만든 Lambda가 토큰 검증 → <b>IAM 정책 반환</b>. 서드파티 토큰용.
        </Card>
      </div>

      <h2>
        <Lock className="h-ico" size={20} /> ① IAM 권한 (+ Resource Policy)
      </h2>
      <Diagram cap="SigV4 서명으로 인증, Resource Policy로 교차계정/IP 제어">
        <Node
          variant="user"
          icon={<Users size={15} />}
          t="IAM User/Role"
          s="SigV4 서명"
        />
        <Arrow label="서명된 요청" cls="amber" />
        <Node
          variant="sec"
          icon={<ShieldCheck size={15} />}
          t="Resource Policy"
          s="계정/IP/VPC 검사"
        />
        <Arrow />
        <Node variant="apigw" icon={<Network size={15} />} t="API Gateway" />
      </Diagram>
      <ul className="list blue">
        <li>
          <strong>IAM</strong>: 자격증명을 요청 헤더에 서명(SigV4).{" "}
          <strong>내부 애플리케이션·AWS 서비스</strong>에 이상적.
        </li>
        <li>
          <strong>Resource Policy</strong>: Lambda 리소스 정책처럼 API에 부착.{" "}
          <strong>교차 계정</strong> 접근 허용, 특정{" "}
          <strong>소스 IP·VPC 엔드포인트</strong>로 제한. IAM 보안과{" "}
          <strong>결합</strong>해 사용.
        </li>
      </ul>

      <h2>
        <Users className="h-ico" size={20} /> ② Cognito User Pools
      </h2>
      <Diagram cap="사용자는 Cognito로 로그인 → 토큰 → API Gateway가 자동 검증">
        <Node variant="user" icon={<Users size={15} />} t="사용자" />
        <Arrow label="로그인" />
        <Node
          variant="cognito"
          icon={<Lock size={15} />}
          t="Cognito User Pool"
          s="토큰 발급"
        />
        <Arrow label="토큰 첨부" cls="amber" />
        <Node
          variant="apigw"
          icon={<ShieldCheck size={15} />}
          t="API Gateway"
          s="토큰 자동 검증"
        />
      </Diagram>
      <ul className="list purple">
        <li>
          Cognito가 <strong>사용자 수명주기</strong>(가입/로그인 등) 관리, API
          Gateway가 <strong>토큰을 자동 검증</strong>.
        </li>
        <li>
          <strong>커스텀 코드 불필요</strong>. 단, 이는{" "}
          <strong>인증(신원 확인)</strong>만 담당.
        </li>
        <li>
          <strong>권한(무엇을 할 수 있는가)은 백엔드에서</strong> 처리해야 함.
        </li>
      </ul>

      <h2>
        <KeyRound className="h-ico" size={20} /> ③ Lambda Authorizer (Custom)
      </h2>
      <Diagram cap="Lambda가 토큰 검증 후 IAM 정책 + principal 반환(결과 캐시)">
        <Node
          variant="user"
          icon={<Users size={15} />}
          t="클라이언트"
          s="Bearer 토큰"
        />
        <Arrow label="요청" />
        <Node
          variant="apigw"
          icon={<KeyRound size={15} />}
          t="Authorizer 호출"
        />
        <Arrow label="검증 위임" cls="amber" />
        <Node
          variant="lambda"
          icon={<ShieldCheck size={15} />}
          t="Authorizer Lambda"
          s="→ IAM 정책+principal"
        />
      </Diagram>
      <ul className="list">
        <li>
          <strong>토큰 기반(Token)</strong>: JWT/OAuth 토큰 검증.{" "}
          <strong>요청 기반(Request)</strong>: 헤더/쿼리/컨텍스트로 판단.
        </li>
        <li>
          Lambda가 <strong>IAM 정책 + principalId</strong>를 반환하면 API
          Gateway가 허용/거부.
        </li>
        <li>
          결과는 <strong>캐시</strong>되어 반복 호출 시 성능↑ (기본 TTL 존재).
        </li>
        <li>
          <strong>서드파티 인증(OAuth/SAML)·커스텀 로직</strong>에 적합.
        </li>
      </ul>

      <h2>
        <GitCompare className="h-ico" size={20} /> 선택 기준 요약
      </h2>
      <div className="tbl-wrap">
        <table className="cmp">
          <thead>
            <tr>
              <th>상황</th>
              <th>선택</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>내 AWS 계정의 사용자/역할·서비스 간 호출</td>
              <td className="yes">IAM 권한</td>
            </tr>
            <tr>
              <td>다른 AWS 계정에 접근 허용 / 특정 IP·VPC 제한</td>
              <td className="yes">Resource Policy (+IAM)</td>
            </tr>
            <tr>
              <td>앱 사용자 로그인, 관리 부담 최소·코드 없이</td>
              <td className="yes">Cognito User Pool</td>
            </tr>
            <tr>
              <td>서드파티 토큰(OAuth/SAML)·완전 커스텀 로직</td>
              <td className="yes">Lambda Authorizer</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout type="warn" title="가장 헷갈리는 포인트">
        <b>Cognito User Pool</b>은 “인증만” 해줍니다.{" "}
        <b>세밀한 권한(authorization)</b>이 필요하면 백엔드에서 처리하거나{" "}
        <b>Lambda Authorizer</b>를 고려하세요. “관리형 사용자 풀 + 코드 없음”
        키워드 → Cognito.
      </Callout>
    </>
  );
}

/* ---- 11 · REST vs HTTP ---- */
function RestVsHttp() {
  return (
    <>
      <p>
        API Gateway에는 <strong>REST API</strong>와 <strong>HTTP API</strong> 두
        종류가 있습니다. 핵심은{" "}
        <strong>“기능 풍부(REST)” vs “저지연·저비용(HTTP)”</strong>의
        트레이드오프입니다.
      </p>

      <h2>
        <GitCompare className="h-ico" size={20} /> 기능 비교
      </h2>
      <div className="tbl-wrap">
        <table className="cmp">
          <thead>
            <tr>
              <th>기능</th>
              <th>REST API</th>
              <th>HTTP API</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>비용 · 지연</td>
              <td>상대적 고가 · 높은 지연</td>
              <td className="yes">저렴 · 저지연</td>
            </tr>
            <tr>
              <td>사용 계획 · API 키</td>
              <td className="yes">지원</td>
              <td className="no">미지원</td>
            </tr>
            <tr>
              <td>캐싱</td>
              <td className="yes">지원</td>
              <td className="no">미지원</td>
            </tr>
            <tr>
              <td>요청 검증 / 매핑 템플릿</td>
              <td className="yes">지원</td>
              <td className="no">미지원</td>
            </tr>
            <tr>
              <td>WAF</td>
              <td className="yes">지원</td>
              <td className="no">미지원</td>
            </tr>
            <tr>
              <td>Private 엔드포인트</td>
              <td className="yes">지원</td>
              <td className="no">미지원</td>
            </tr>
            <tr>
              <td>인증</td>
              <td>IAM · Cognito · Lambda Authorizer · Resource Policy</td>
              <td>JWT · OIDC/OAuth2 · Cognito · Lambda</td>
            </tr>
            <tr>
              <td>CORS</td>
              <td>설정</td>
              <td className="yes">기본 내장 편의</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="cards">
        <Card icon={<ShieldCheck size={18} />} tone="blue" h="REST API 선택">
          API 키·캐싱·요청검증·WAF·Private 등 <b>풍부한 기능</b>이 필요할 때.
        </Card>
        <Card icon={<Zap size={18} />} tone="amber" h="HTTP API 선택">
          <b>단순 프록시</b>로 Lambda/HTTP 백엔드에 연결하며{" "}
          <b>비용·지연 최소화</b>가 목표일 때.
        </Card>
      </div>

      <Callout type="exam">
        “JWT/OIDC 인증 + <b>가장 저렴·저지연</b>의 단순 프록시” →{" "}
        <b>HTTP API</b>. “<b>API 키·캐싱·요청검증·WAF</b> 필요” →{" "}
        <b>REST API</b>.
      </Callout>
    </>
  );
}

/* ---- 12 · WebSocket ---- */
function WebSocket() {
  return (
    <>
      <p>
        <strong>WebSocket API</strong>는 <strong>양방향 실시간 통신</strong>을
        지원합니다. 서버가 클라이언트로 <strong>먼저 메시지를 push</strong>할 수
        있어 채팅, 멀티플레이어 게임, 실시간 대시보드에 사용됩니다. 연결 URL은{" "}
        <code>wss://</code>로 시작합니다.
      </p>

      <h2>
        <Radio className="h-ico" size={20} /> 라우트 & 라우트 선택식
      </h2>
      <Diagram cap="들어온 메시지를 route selection expression으로 라우팅">
        <Node
          variant="client"
          icon={<Users size={15} />}
          t="클라이언트"
          s="wss:// 연결"
        />
        <Arrow label="JSON 메시지" cls="amber" />
        <Node
          variant="apigw"
          icon={<Radio size={15} />}
          t="Route Selection"
          s="$request.body.action"
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <Node
            variant="lambda"
            icon={<Zap size={14} />}
            t="$connect"
            s="연결 시"
          />
          <Node
            variant="lambda"
            icon={<Zap size={14} />}
            t="$disconnect"
            s="종료 시"
          />
          <Node
            variant="lambda"
            icon={<Zap size={14} />}
            t="커스텀 route"
            s="예: sendMessage"
          />
          <Node
            variant="aws"
            icon={<Zap size={14} />}
            t="$default"
            s="매칭 없을 때"
          />
        </div>
      </Diagram>
      <ul className="list">
        <li>
          <strong>$connect / $disconnect</strong>: 연결 수립·종료 시 트리거되는
          특수 라우트.
        </li>
        <li>
          <strong>커스텀 라우트</strong>: 메시지의 특정 필드로 분기. 예:{" "}
          <code>$request.body.action</code>가 <code>"sendMessage"</code>면 해당
          라우트로.
        </li>
        <li>
          <strong>$default</strong>: 어떤 라우트에도 매칭되지 않을 때.
        </li>
      </ul>

      <h2>
        <ArrowRight className="h-ico" size={20} /> 서버 → 클라이언트 Push
        (@connections)
      </h2>
      <Diagram cap="connectionId로 콜백 URL(@connections)에 요청해 메시지 전송">
        <Node
          variant="lambda"
          icon={<Zap size={15} />}
          t="백엔드"
          s="connectionId 보관"
        />
        <Arrow label="POST @connections/{id}" cls="amber" />
        <Node
          variant="apigw"
          icon={<Radio size={15} />}
          t="Callback URL"
          s="execute-api:ManageConnections"
        />
        <Arrow label="push" />
        <Node variant="client" icon={<Users size={15} />} t="클라이언트" />
      </Diagram>
      <ul className="list teal">
        <li>
          각 연결은 고유 <strong>connectionId</strong>로 식별. 백엔드가 이를
          저장(예: DynamoDB).
        </li>
        <li>
          콜백 엔드포인트 <code>{"@connections/{connectionId}"}</code>로 요청:
          <span style={{ display: "inline-flex", gap: 6, marginLeft: 6 }}>
            <M m="POST" />{" "}
            <span style={{ fontSize: 12.5, color: "var(--muted)" }}>
              메시지 전송
            </span>
          </span>
        </li>
        <li>
          <M m="GET" /> 연결 상태 조회 · <M m="DELETE" /> 연결 강제 종료.
        </li>
        <li>
          이 작업에는 IAM 권한 <code>execute-api:ManageConnections</code> 필요.
        </li>
      </ul>

      <Callout type="exam">
        “서버가 클라이언트에 <b>실시간 push</b>” → <b>WebSocket API</b>. push
        방법은
        <b> @connections 콜백 URL + connectionId</b>(POST). 라우팅은{" "}
        <b>route selection expression</b>.
      </Callout>
    </>
  );
}

/* ---- 13 · 아키텍처 ---- */
function Architecture() {
  return (
    <>
      <p>
        전형적인 서버리스 아키텍처에서 API Gateway는{" "}
        <strong>단일 진입점</strong>이 되어 여러{" "}
        <strong>마이크로서비스(Lambda/HTTP)</strong>로 라우팅합니다. 앞단에
        CloudFront·WAF·인증, 뒷단에 캐시·모니터링을 붙여 완성합니다.
      </p>

      <h2>
        <Building2 className="h-ico" size={20} /> 레퍼런스 아키텍처
      </h2>
      <Diagram cap="Route 53 + 커스텀 도메인 → API Gateway → 다중 백엔드">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            alignItems: "center",
          }}
        >
          <Node variant="user" icon={<Users size={15} />} t="클라이언트" />
          <Node
            variant="cognito"
            icon={<Lock size={14} />}
            t="Cognito"
            s="인증"
          />
        </div>
        <Arrow label="HTTPS + 토큰" cls="amber" />
        <Node
          variant="apigw"
          icon={<Network size={16} />}
          t="API Gateway"
          s="Route53·ACM·WAF·캐시"
        />
        <Arrow />
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <Node
            variant="lambda"
            icon={<Zap size={14} />}
            t="주문 서비스"
            s="Lambda"
          />
          <Node
            variant="lambda"
            icon={<Zap size={14} />}
            t="사용자 서비스"
            s="Lambda"
          />
          <Node
            variant="http"
            icon={<Server size={14} />}
            t="결제 서비스"
            s="HTTP/ALB"
          />
          <Node
            variant="db"
            icon={<Database size={14} />}
            t="DynamoDB"
            s="AWS 통합"
          />
        </div>
      </Diagram>

      <div className="cards">
        <Card icon={<Globe size={18} />} tone="blue" h="단일 진입점">
          하나의 도메인/API로 여러 마이크로서비스를 라우팅·통합.
        </Card>
        <Card icon={<ShieldCheck size={18} />} tone="red" h="보안 계층">
          Cognito/IAM/Authorizer 인증 + WAF로 공격 방어.
        </Card>
        <Card icon={<Database size={18} />} tone="green" h="성능·운영">
          Stage 캐싱으로 지연↓, CloudWatch·X-Ray로 관측.
        </Card>
        <Card icon={<GitBranch size={18} />} tone="purple" h="배포 전략">
          Stage 분리 + Canary로 안전한 점진 배포.
        </Card>
      </div>

      <Callout type="key" title="전체 그림">
        API Gateway = <b>클라이언트와 서버리스 백엔드 사이의 단일 관문</b>.
        여기에
        <b>
          {" "}
          인증(Cognito/IAM) · 제한(Usage Plan) · 캐시 · 변환 · 검증 ·
          관측(X-Ray)
        </b>
        을 조립하면 완전한 프로덕션 API가 됩니다.
      </Callout>
    </>
  );
}

/* =====================================================================
   SECTION REGISTRY & APP
   ===================================================================== */
const SECTIONS = [
  {
    id: "intro",
    n: "00",
    short: "소개 · 지도",
    title: "API Gateway 소개",
    en: "Introduction",
    accent: "소개",
    icon: BookOpen,
    freq: null,
    Comp: Intro,
  },
  {
    id: "overview",
    n: "01",
    short: "개요 · 엔드포인트",
    title: "개요 & 엔드포인트",
    en: "Overview & Endpoints",
    accent: "개요",
    icon: Network,
    freq: 3,
    Comp: Overview,
  },
  {
    id: "stages",
    n: "02",
    short: "단계 & 배포",
    title: "단계 & 배포",
    en: "Stages & Deployment",
    accent: "단계",
    icon: GitBranch,
    freq: 2,
    Comp: Stages,
  },
  {
    id: "canary",
    n: "03",
    short: "Canary 배포",
    title: "Canary 배포",
    en: "Canary Deployment",
    accent: "Canary",
    icon: Split,
    freq: 2,
    Comp: Canary,
  },
  {
    id: "integration",
    n: "04",
    short: "통합 & 매핑",
    title: "통합 유형 & 매핑",
    en: "Integration & Mapping",
    accent: "통합",
    icon: Shuffle,
    freq: 4,
    Comp: Integration,
  },
  {
    id: "openapi",
    n: "05",
    short: "OpenAPI",
    title: "OpenAPI",
    en: "OpenAPI / Swagger",
    accent: "OpenAPI",
    icon: FileCode2,
    freq: 2,
    Comp: OpenAPI,
  },
  {
    id: "caching",
    n: "06",
    short: "캐싱",
    title: "캐싱",
    en: "Caching",
    accent: "캐싱",
    icon: Database,
    freq: 3,
    Comp: Caching,
  },
  {
    id: "usage",
    n: "07",
    short: "사용 계획 · API 키",
    title: "사용 계획 & API 키",
    en: "Usage Plans & API Keys",
    accent: "사용 계획",
    icon: KeyRound,
    freq: 3,
    Comp: Usage,
  },
  {
    id: "monitoring",
    n: "08",
    short: "모니터링·로깅·추적",
    title: "모니터링 · 로깅 · 추적",
    en: "Monitoring & Tracing",
    accent: "모니터링",
    icon: Activity,
    freq: 3,
    Comp: Monitoring,
  },
  {
    id: "cors",
    n: "09",
    short: "CORS",
    title: "CORS",
    en: "Cross-Origin",
    accent: "CORS",
    icon: Globe,
    freq: 3,
    Comp: Cors,
  },
  {
    id: "auth",
    n: "10",
    short: "인증 & 권한",
    title: "인증 & 권한",
    en: "Authentication & Authorization",
    accent: "인증",
    icon: ShieldCheck,
    freq: 4,
    Comp: Auth,
  },
  {
    id: "resttypes",
    n: "11",
    short: "REST vs HTTP",
    title: "REST API vs HTTP API",
    en: "API Types",
    accent: "REST API",
    icon: GitCompare,
    freq: 2,
    Comp: RestVsHttp,
  },
  {
    id: "websocket",
    n: "12",
    short: "WebSocket API",
    title: "WebSocket API",
    en: "WebSocket",
    accent: "WebSocket",
    icon: Radio,
    freq: 2,
    Comp: WebSocket,
  },
  {
    id: "architecture",
    n: "13",
    short: "아키텍처",
    title: "아키텍처",
    en: "Architecture",
    accent: "아키텍처",
    icon: Building2,
    freq: 2,
    Comp: Architecture,
  },
];

function NavBars({ level }) {
  if (!level) return null;
  const f = FREQ[level];
  return (
    <span className="nav-bars">
      {[1, 2, 3, 4].map((i) => (
        <i
          key={i}
          style={{
            height: `${(i / 4) * 100}%`,
            background: i <= level ? f.color : undefined,
          }}
        />
      ))}
    </span>
  );
}

export default function App() {
  const [active, setActive] = useState("intro");
  const mainRef = useRef(null);
  const idx = SECTIONS.findIndex((s) => s.id === active);
  const S = SECTIONS[idx];
  const prev = SECTIONS[idx - 1];
  const next = SECTIONS[idx + 1];

  useEffect(() => {
    if (mainRef.current)
      mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [active]);

  const go = (id) => setActive(id);

  return (
    <div className="agw-root">
      <style>{CSS}</style>
      <div className="shell">
        {/* ---- Desktop sidebar ---- */}
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-tag">AWS · DVA</div>
            <div className="brand-h">API Gateway</div>
            <div className="brand-sub">
              개념 완전 정리 · 다이어그램 & 빈출빈도
            </div>
          </div>
          <nav className="nav">
            {SECTIONS.map((s) => {
              const Ico = s.icon;
              return (
                <button
                  key={s.id}
                  className={`nav-item ${active === s.id ? "active" : ""}`}
                  onClick={() => go(s.id)}
                >
                  <span className="nav-num">{s.n}</span>
                  <Ico className="ni-ico" size={16} />
                  <span className="nav-lbl">{s.short}</span>
                  <NavBars level={s.freq} />
                </button>
              );
            })}
          </nav>
          <div className="legend">
            <h4>빈출빈도 범례</h4>
            {[4, 3, 2, 1].map((lv) => (
              <div className="legend-row" key={lv}>
                <span
                  className="legend-dot"
                  style={{ background: FREQ[lv].color }}
                />
                {FREQ[lv].label}{" "}
                <span
                  style={{
                    color: "#6f8398",
                    fontFamily: "var(--mono)",
                    fontSize: 10.5,
                  }}
                >
                  · {FREQ[lv].tag}
                </span>
              </div>
            ))}
            <div
              style={{
                marginTop: 10,
                fontSize: 11,
                color: "#7d93aa",
                lineHeight: 1.5,
              }}
            >
              일반적 출제 경향 기반 추정치 (공식 수치 아님)
            </div>
          </div>
        </aside>

        {/* ---- Mobile top nav ---- */}
        <div className="mtop">
          <div className="mtop-brand">
            <Network size={17} color="#ED8B2C" /> API Gateway{" "}
            <span className="en">DVA</span>
          </div>
          <div className="mchips">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                className={`mchip ${active === s.id ? "active" : ""}`}
                onClick={() => go(s.id)}
              >
                {s.n} · {s.short}
              </button>
            ))}
          </div>
        </div>

        {/* ---- Main ---- */}
        <main className="main" ref={mainRef}>
          <header className="sec-head">
            <div className="eyebrow">
              <span>SECTION {S.n}</span>
              <span className="en">/ {S.en}</span>
            </div>
            <h1 className="sec-title">
              {S.accent && S.title.startsWith(S.accent) ? (
                <>
                  <span className="accent">{S.accent}</span>
                  {S.title.slice(S.accent.length)}
                </>
              ) : (
                S.title
              )}
            </h1>
            <div className="head-meta">{S.freq && <Freq level={S.freq} />}</div>
          </header>

          <S.Comp />

          {/* ---- Pager ---- */}
          <div className="pager">
            {prev ? (
              <button className="pg-btn" onClick={() => go(prev.id)}>
                <ChevronLeft className="pg-ico" size={20} />
                <span>
                  <span className="pg-dir">이전</span>
                  <br />
                  <span className="pg-t">{prev.short}</span>
                </span>
              </button>
            ) : (
              <span />
            )}
            {next ? (
              <button className="pg-btn next" onClick={() => go(next.id)}>
                <span>
                  <span className="pg-dir">다음</span>
                  <br />
                  <span className="pg-t">{next.short}</span>
                </span>
                <ChevronRight className="pg-ico" size={20} />
              </button>
            ) : (
              <span />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
