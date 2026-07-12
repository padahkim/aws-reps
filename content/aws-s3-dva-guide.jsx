//opus 4.8 max
import React, { useState, useEffect, useRef } from "react";
import {
  Database,
  Shield,
  Lock,
  Globe,
  History,
  Copy,
  Layers,
  Recycle,
  Bell,
  Gauge,
  Tag,
  KeyRound,
  ScrollText,
  Link as LinkIcon,
  Network,
  Cpu,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Info,
  Lightbulb,
  Target,
  ShieldCheck,
  HardDrive,
} from "lucide-react";

/* ================================================================
   AWS S3 — DVA 시험 대비 필드 매뉴얼
   컨셉: 기술 스펙 시트 / 회로 설계도(schematic) 스타일
   ================================================================ */

const C = {
  bg: "#EDF1F6",
  surface: "#FFFFFF",
  panel: "#F5F8FB",
  ink: "#132030",
  ink2: "#516278",
  ink3: "#8595A8",
  line: "#DBE3EC",
  lineSoft: "#EAF0F6",
  teal: "#0E7490",
  tealSoft: "#D6EEF3",
  tealDeep: "#0B5563",
  amber: "#D97706",
  amberSoft: "#FBEBCE",
  green: "#3E7C3A",
  greenSoft: "#DEEBDB",
  red: "#C2410C",
  redSoft: "#F7DFD3",
  purple: "#6D46C7",
  purpleSoft: "#E7DEFA",
  slate: "#64748B",
};

const FREQ = {
  5: { c: "#C2410C", label: "매우 높음" },
  4: { c: "#EA580C", label: "높음" },
  3: { c: "#F59E0B", label: "중간" },
  2: { c: "#64748B", label: "낮음" },
  1: { c: "#94A3B8", label: "드묾" },
};

/* ------------------------------- STYLE ------------------------------- */
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');

*{box-sizing:border-box}
.s3root{
  --ink:${C.ink};--ink2:${C.ink2};--ink3:${C.ink3};--line:${C.line};
  font-family:'Pretendard Variable',Pretendard,-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Segoe UI','Malgun Gothic',system-ui,sans-serif;
  color:${C.ink};background:${C.bg};min-height:100vh;line-height:1.65;
  -webkit-font-smoothing:antialiased;
}
.mono{font-family:'JetBrains Mono',ui-monospace,'SF Mono',Menlo,monospace}

/* layout */
.s3grid{display:grid;grid-template-columns:312px 1fr;min-height:100vh}
.s3main{min-width:0}
.s3wrap{max-width:920px;margin:0 auto;padding:44px 40px 120px}

/* header */
.s3top{position:sticky;top:0;z-index:40;background:${C.ink};color:#fff;
  border-bottom:1px solid #24374d}
.s3top-in{display:flex;align-items:center;gap:16px;padding:14px 24px}
.s3badge{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:12px;
  letter-spacing:.14em;background:${C.amber};color:#22150a;padding:5px 9px;border-radius:5px}
.s3top h1{font-size:15.5px;font-weight:700;margin:0;letter-spacing:-.01em}
.s3top .sub{font-size:12px;color:#9fb1c6;font-family:'JetBrains Mono',monospace}
.s3legend{margin-left:auto;display:flex;align-items:center;gap:14px;font-size:11px;color:#b6c5d6;
  font-family:'JetBrains Mono',monospace}
.s3legend .lg{display:flex;align-items:center;gap:5px}
.s3legend i{width:9px;height:9px;border-radius:2px;display:inline-block}
.hamb{display:none;background:transparent;border:1px solid #3a4d63;color:#fff;
  width:34px;height:34px;border-radius:7px;cursor:pointer;align-items:center;justify-content:center}

/* sidebar */
.s3side{background:${C.surface};border-right:1px solid ${C.line};
  position:sticky;top:0;height:100vh;overflow-y:auto}
.s3side-h{padding:18px 20px 10px;border-bottom:1px solid ${C.lineSoft}}
.s3side-h .t{font-size:12px;font-weight:700;letter-spacing:.16em;color:${C.ink3};
  font-family:'JetBrains Mono',monospace}
.s3grp{padding:14px 12px 4px}
.s3grp-l{display:flex;align-items:center;gap:8px;padding:6px 10px;font-size:11px;
  font-weight:700;letter-spacing:.13em;color:${C.ink3};text-transform:uppercase;
  font-family:'JetBrains Mono',monospace}
.s3grp-l .ln{flex:1;height:1px;background:${C.lineSoft}}
.navitem{display:flex;align-items:center;gap:11px;width:100%;text-align:left;
  padding:9px 10px;border-radius:9px;border:1px solid transparent;background:transparent;
  cursor:pointer;color:${C.ink2};transition:all .13s;margin-bottom:1px}
.navitem:hover{background:${C.panel};color:${C.ink}}
.navitem.on{background:${C.tealSoft};border-color:${C.teal}33;color:${C.tealDeep}}
.navitem .ic{width:30px;height:30px;border-radius:7px;background:${C.panel};
  display:flex;align-items:center;justify-content:center;flex-shrink:0;color:${C.ink2}}
.navitem.on .ic{background:#fff;color:${C.teal}}
.navitem .tx{flex:1;min-width:0}
.navitem .code{font-family:'JetBrains Mono',monospace;font-size:9.5px;font-weight:700;
  letter-spacing:.06em;color:${C.ink3};display:block}
.navitem.on .code{color:${C.teal}}
.navitem .ttl{font-size:12.5px;font-weight:600;display:block;white-space:nowrap;
  overflow:hidden;text-overflow:ellipsis}
.mini{display:flex;gap:2px;flex-shrink:0}
.mini i{width:4px;height:13px;border-radius:1px;background:${C.line}}

/* content head */
.mod-eyebrow{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.mod-eyebrow .code{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;
  letter-spacing:.1em;color:${C.teal};background:${C.tealSoft};padding:4px 9px;border-radius:5px}
.mod-eyebrow .grp{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.13em;
  color:${C.ink3};text-transform:uppercase;font-weight:700}
.mod-h1{font-size:30px;font-weight:800;letter-spacing:-.02em;margin:0 0 4px;line-height:1.15}
.mod-en{font-family:'JetBrains Mono',monospace;font-size:13px;color:${C.ink3};margin-bottom:20px;font-weight:500}

.freqbar{display:flex;align-items:center;gap:14px;padding:14px 18px;background:${C.surface};
  border:1px solid ${C.line};border-radius:12px;margin-bottom:28px}
.freqbar .lab{font-size:11px;font-weight:700;letter-spacing:.12em;color:${C.ink3};
  font-family:'JetBrains Mono',monospace}
.meter{display:flex;gap:4px}
.meter i{width:26px;height:16px;border-radius:3px;background:${C.line}}
.freqbar .val{font-weight:800;font-size:14px;margin-left:2px}
.freqbar .note{margin-left:auto;font-size:12.5px;color:${C.ink2}}

/* content blocks */
.lead{font-size:16.5px;line-height:1.72;color:${C.ink};margin:0 0 26px;font-weight:450}
.lead b{font-weight:700}
.h2{font-size:19px;font-weight:800;letter-spacing:-.01em;margin:38px 0 14px;
  display:flex;align-items:center;gap:9px}
.h2 .bar{width:4px;height:19px;border-radius:2px;background:${C.teal}}
.p{font-size:14.5px;line-height:1.72;color:${C.ink};margin:0 0 14px}
.p b{font-weight:700}
.p .k{font-family:'JetBrains Mono',monospace;font-size:13px;background:${C.panel};
  border:1px solid ${C.line};padding:1px 6px;border-radius:5px;color:${C.tealDeep};font-weight:500}

/* fact cards */
.facts{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:6px 0 20px}
.fact{background:${C.surface};border:1px solid ${C.line};border-radius:11px;padding:15px 17px}
.fact .ft{font-size:12px;font-weight:700;color:${C.teal};letter-spacing:.02em;margin-bottom:5px;
  display:flex;align-items:center;gap:7px}
.fact .fb{font-size:13.5px;color:${C.ink};line-height:1.6}
.fact .fb b{font-weight:700}
.fact .fb .k{font-family:'JetBrains Mono',monospace;font-size:12px;background:${C.panel};
  padding:1px 5px;border-radius:4px;border:1px solid ${C.line};color:${C.tealDeep}}

/* callouts */
.call{border-radius:12px;padding:15px 18px;margin:20px 0;border:1px solid;display:flex;gap:13px}
.call .ci{flex-shrink:0;width:30px;height:30px;border-radius:8px;display:flex;
  align-items:center;justify-content:center}
.call .ct{font-weight:800;font-size:13px;letter-spacing:.02em;margin-bottom:4px}
.call .cb{font-size:13.5px;line-height:1.65}
.call .cb b{font-weight:700}
.call .cb .k{font-family:'JetBrains Mono',monospace;font-size:12.5px;padding:1px 5px;
  border-radius:4px;font-weight:500}
.call.exam{background:${C.amberSoft}66;border-color:${C.amber}44}
.call.exam .ci{background:${C.amber};color:#fff}
.call.exam .ct{color:${C.amber}}
.call.exam .cb .k{background:#fff;border:1px solid ${C.amber}55;color:${C.amber}}
.call.warn{background:${C.redSoft}66;border-color:${C.red}44}
.call.warn .ci{background:${C.red};color:#fff}
.call.warn .ct{color:${C.red}}
.call.warn .cb .k{background:#fff;border:1px solid ${C.red}55;color:${C.red}}
.call.tip{background:${C.tealSoft}66;border-color:${C.teal}44}
.call.tip .ci{background:${C.teal};color:#fff}
.call.tip .ct{color:${C.tealDeep}}
.call.tip .cb .k{background:#fff;border:1px solid ${C.teal}55;color:${C.tealDeep}}

/* diagram frame */
.dgm{background:${C.surface};border:1px solid ${C.line};border-radius:14px;
  padding:20px 20px 16px;margin:20px 0 24px}
.dgm .cap{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.09em;
  color:${C.ink3};font-weight:700;text-transform:uppercase;margin-bottom:14px;
  display:flex;align-items:center;gap:8px}
.dgm .cap .dot{width:7px;height:7px;border-radius:2px;background:${C.teal}}
.dgm svg{display:block;width:100%;height:auto}

/* code block */
.code-b{background:${C.ink};border-radius:11px;padding:16px 18px;margin:16px 0 22px;overflow-x:auto}
.code-b pre{margin:0;font-family:'JetBrains Mono',monospace;font-size:12.5px;line-height:1.7;
  color:#d5e0ec;white-space:pre}
.code-b .cm{color:#7e93a8}
.code-b .st{color:#f0b366}
.code-b .kw{color:#79c7d6}

/* pill list */
.plist{list-style:none;padding:0;margin:6px 0 20px}
.plist li{display:flex;gap:11px;padding:8px 0;border-bottom:1px solid ${C.lineSoft};
  font-size:14px;line-height:1.6}
.plist li:last-child{border-bottom:none}
.plist li .n{flex-shrink:0;width:22px;height:22px;border-radius:6px;background:${C.tealSoft};
  color:${C.tealDeep};font-family:'JetBrains Mono',monospace;font-weight:700;font-size:11px;
  display:flex;align-items:center;justify-content:center;margin-top:1px}
.plist li b{font-weight:700}
.plist li .k{font-family:'JetBrains Mono',monospace;font-size:12.5px;background:${C.panel};
  padding:1px 5px;border-radius:4px;border:1px solid ${C.line};color:${C.tealDeep}}

/* nav footer */
.pgnav{display:flex;gap:12px;margin-top:52px;padding-top:24px;border-top:1px solid ${C.line}}
.pgbtn{flex:1;display:flex;align-items:center;gap:12px;padding:15px 18px;border-radius:12px;
  background:${C.surface};border:1px solid ${C.line};cursor:pointer;text-align:left;
  transition:all .14s;color:${C.ink}}
.pgbtn:hover{border-color:${C.teal};background:${C.tealSoft}44}
.pgbtn:disabled{opacity:.4;cursor:default}
.pgbtn.nx{flex-direction:row-reverse;text-align:right}
.pgbtn .d{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.1em;
  color:${C.ink3};font-weight:700}
.pgbtn .t{font-size:13.5px;font-weight:700}

.overlay{display:none}

@media(max-width:900px){
  .s3grid{grid-template-columns:1fr}
  .s3side{position:fixed;top:0;left:0;width:288px;z-index:60;transform:translateX(-100%);
    transition:transform .22s;box-shadow:0 0 40px rgba(0,0,0,.18)}
  .s3side.open{transform:translateX(0)}
  .hamb{display:flex}
  .s3legend{display:none}
  .overlay.show{display:block;position:fixed;inset:0;background:rgba(10,18,28,.4);z-index:55}
  .s3wrap{padding:28px 20px 100px}
  .facts{grid-template-columns:1fr}
  .mod-h1{font-size:24px}
  .pgnav{flex-direction:column}
}
`;

/* --------------------------- UI PRIMITIVES --------------------------- */
const Meter = ({ level, size = "lg" }) => {
  const col = FREQ[level].c;
  if (size === "mini")
    return (
      <span className="mini">
        {[1, 2, 3, 4, 5].map((i) => (
          <i key={i} style={{ background: i <= level ? col : undefined }} />
        ))}
      </span>
    );
  return (
    <span className="meter">
      {[1, 2, 3, 4, 5].map((i) => (
        <i key={i} style={{ background: i <= level ? col : undefined }} />
      ))}
    </span>
  );
};

const Fact = ({ title, icon, children }) => (
  <div className="fact">
    <div className="ft">
      {icon}
      {title}
    </div>
    <div className="fb">{children}</div>
  </div>
);

const Call = ({ type = "exam", title, children }) => {
  const icons = {
    exam: <Target size={16} />,
    warn: <Info size={16} />,
    tip: <Lightbulb size={16} />,
  };
  const titles = { exam: "시험 포인트", warn: "주의", tip: "핵심 팁" };
  return (
    <div className={`call ${type}`}>
      <div className="ci">{icons[type]}</div>
      <div>
        <div className="ct">{title || titles[type]}</div>
        <div className="cb">{children}</div>
      </div>
    </div>
  );
};

const K = ({ children }) => <span className="k">{children}</span>;

/* ------------------------------ DIAGRAMS ------------------------------ */
// 공통 화살표 마커
const Defs = () => (
  <defs>
    <marker
      id="ar"
      viewBox="0 0 10 10"
      refX="8"
      refY="5"
      markerWidth="7"
      markerHeight="7"
      orient="auto-start-reverse"
    >
      <path d="M0 0 L10 5 L0 10 z" fill={C.ink2} />
    </marker>
    <marker
      id="art"
      viewBox="0 0 10 10"
      refX="8"
      refY="5"
      markerWidth="7"
      markerHeight="7"
      orient="auto-start-reverse"
    >
      <path d="M0 0 L10 5 L0 10 z" fill={C.teal} />
    </marker>
  </defs>
);
const bucket = (x, y, label, sub, col = C.teal) => (
  <g>
    <rect
      x={x}
      y={y}
      width="150"
      height="66"
      rx="10"
      fill="#fff"
      stroke={col}
      strokeWidth="1.6"
    />
    <rect x={x} y={y} width="150" height="22" rx="10" fill={col} />
    <rect x={x} y={y + 12} width="150" height="10" fill={col} />
    <text
      x={x + 12}
      y={y + 15}
      fill="#fff"
      fontSize="11"
      fontFamily="monospace"
      fontWeight="700"
    >
      🪣 S3 Bucket
    </text>
    <text
      x={x + 12}
      y={y + 40}
      fill={C.ink}
      fontSize="12.5"
      fontWeight="700"
      fontFamily="monospace"
    >
      {label}
    </text>
    {sub && (
      <text
        x={x + 12}
        y={y + 56}
        fill={C.ink3}
        fontSize="10.5"
        fontFamily="monospace"
      >
        {sub}
      </text>
    )}
  </g>
);

const D_Overview = () => (
  <svg viewBox="0 0 700 250">
    <Defs />
    <rect
      x="30"
      y="30"
      width="250"
      height="190"
      rx="14"
      fill={C.tealSoft}
      stroke={C.teal}
      strokeWidth="1.4"
    />
    <rect x="30" y="30" width="250" height="30" rx="14" fill={C.teal} />
    <rect x="30" y="46" width="250" height="14" fill={C.teal} />
    <text
      x="48"
      y="50"
      fill="#fff"
      fontSize="12.5"
      fontWeight="700"
      fontFamily="monospace"
    >
      🪣 Bucket · my-app-bucket
    </text>
    <text x="48" y="76" fill={C.tealDeep} fontSize="10" fontFamily="monospace">
      전역 고유 이름 · 리전에 종속
    </text>
    {["images/logo.png", "images/2024/a.jpg", "data/report.csv"].map((k, i) => (
      <g key={i}>
        <rect
          x="48"
          y={90 + i * 38}
          width="214"
          height="30"
          rx="7"
          fill="#fff"
          stroke={C.line}
        />
        <text
          x="60"
          y={109 + i * 38}
          fill={C.ink}
          fontSize="11"
          fontFamily="monospace"
          fontWeight="600"
        >
          {k}
        </text>
      </g>
    ))}
    {/* key breakdown */}
    <line
      x1="290"
      y1="105"
      x2="360"
      y2="105"
      stroke={C.teal}
      strokeWidth="1.6"
      markerEnd="url(#art)"
    />
    <rect
      x="368"
      y="46"
      width="300"
      height="158"
      rx="12"
      fill="#fff"
      stroke={C.line}
      strokeWidth="1.4"
    />
    <text x="384" y="70" fill={C.ink} fontSize="12" fontWeight="800">
      객체(Object) = Key + Value
    </text>
    <text x="384" y="94" fill={C.ink2} fontSize="11" fontFamily="monospace">
      s3://my-app-bucket/images/logo.png
    </text>
    <rect x="454" y="102" width="66" height="18" rx="4" fill={C.amberSoft} />
    <text
      x="459"
      y="115"
      fill={C.amber}
      fontSize="9.5"
      fontFamily="monospace"
      fontWeight="700"
    >
      prefix
    </text>
    <rect x="521" y="102" width="70" height="18" rx="4" fill={C.greenSoft} />
    <text
      x="526"
      y="115"
      fill={C.green}
      fontSize="9.5"
      fontFamily="monospace"
      fontWeight="700"
    >
      object name
    </text>
    <text x="384" y="138" fill={C.ink2} fontSize="10.5">
      Key = prefix + object name (전체 경로)
    </text>
    <text x="384" y="156" fill={C.ink2} fontSize="10.5">
      실제 폴더는 없음 — "/"로 계층처럼 보일 뿐
    </text>
    <text x="384" y="174" fill={C.ink2} fontSize="10.5">
      Value(본문) 최대{" "}
      <tspan fontWeight="700" fill={C.red}>
        5TB
      </tspan>{" "}
      · 5GB↑ 멀티파트 필수
    </text>
    <text x="384" y="192" fill={C.ink2} fontSize="10.5">
      메타데이터 · 태그 · 버전 ID 포함
    </text>
  </svg>
);

const D_Security = () => (
  <svg viewBox="0 0 700 270">
    <Defs />
    {/* principal */}
    <circle
      cx="70"
      cy="90"
      r="26"
      fill={C.panel}
      stroke={C.line}
      strokeWidth="1.4"
    />
    <text x="70" y="86" textAnchor="middle" fontSize="18">
      👤
    </text>
    <text
      x="70"
      y="102"
      textAnchor="middle"
      fontSize="8.5"
      fontFamily="monospace"
    >
      IAM User
    </text>
    <text
      x="70"
      y="140"
      textAnchor="middle"
      fontSize="10"
      fill={C.ink2}
      fontWeight="700"
    >
      요청
    </text>
    {/* two paths */}
    <rect
      x="150"
      y="26"
      width="220"
      height="90"
      rx="11"
      fill={C.tealSoft}
      stroke={C.teal}
      strokeWidth="1.4"
    />
    <text x="164" y="48" fill={C.tealDeep} fontSize="11.5" fontWeight="800">
      ① 사용자 기반 · IAM Policy
    </text>
    <text x="164" y="68" fill={C.ink2} fontSize="10.5">
      IAM 사용자/역할에 부여
    </text>
    <text x="164" y="85" fill={C.ink2} fontSize="10.5">
      "이 사용자가 무엇을 할 수 있나"
    </text>
    <text x="164" y="104" fill={C.ink3} fontSize="10" fontFamily="monospace">
      Action / Resource / Effect
    </text>

    <rect
      x="150"
      y="150"
      width="220"
      height="98"
      rx="11"
      fill={C.amberSoft}
      stroke={C.amber}
      strokeWidth="1.4"
    />
    <text x="164" y="172" fill={C.amber} fontSize="11.5" fontWeight="800">
      ② 리소스 기반 · Bucket Policy
    </text>
    <text x="164" y="192" fill={C.ink2} fontSize="10.5">
      버킷에 직접 부착(JSON)
    </text>
    <text x="164" y="209" fill={C.ink2} fontSize="10.5">
      <tspan fontWeight="700">크로스 계정</tspan> 접근 / 공개 설정
    </text>
    <text x="164" y="228" fill={C.ink3} fontSize="10" fontFamily="monospace">
      Principal 필드 포함
    </text>

    <line
      x1="96"
      y1="82"
      x2="146"
      y2="66"
      stroke={C.ink2}
      strokeWidth="1.4"
      markerEnd="url(#ar)"
    />
    <line
      x1="96"
      y1="98"
      x2="146"
      y2="185"
      stroke={C.ink2}
      strokeWidth="1.4"
      markerEnd="url(#ar)"
    />

    {/* evaluation */}
    <rect
      x="410"
      y="70"
      width="258"
      height="130"
      rx="12"
      fill="#fff"
      stroke={C.line}
      strokeWidth="1.5"
    />
    <text x="426" y="94" fill={C.ink} fontSize="12" fontWeight="800">
      접근 허용 판정
    </text>
    <text x="426" y="118" fill={C.ink2} fontSize="11">
      ✅ IAM 정책 <b>또는</b> 버킷 정책이 허용
    </text>
    <text x="426" y="140" fill={C.ink2} fontSize="11" fontFamily="sans-serif">
      {" "}
      (둘 중 하나만 허용해도 통과)
    </text>
    <text x="426" y="164" fill={C.red} fontSize="11" fontWeight="700">
      🚫 명시적 Deny가 있으면 무조건 차단
    </text>
    <text x="426" y="186" fill={C.ink3} fontSize="10">
      Block Public Access는 최우선 적용
    </text>
    <line
      x1="372"
      y1="75"
      x2="406"
      y2="120"
      stroke={C.teal}
      strokeWidth="1.5"
      markerEnd="url(#art)"
    />
    <line
      x1="372"
      y1="199"
      x2="406"
      y2="150"
      stroke={C.amber}
      strokeWidth="1.5"
      markerEnd="url(#ar)"
    />
  </svg>
);

const D_Versioning = () => (
  <svg viewBox="0 0 700 230">
    <Defs />
    <text x="30" y="30" fill={C.ink} fontSize="12" fontWeight="800">
      Key: photo.jpg (버전 스택)
    </text>
    {[
      { v: "v3  (최신)", c: C.teal, y: 46, cur: true },
      { v: "v2", c: C.ink3, y: 82 },
      { v: "v1", c: C.ink3, y: 118 },
      { v: "null  (버전관리 활성화 前)", c: C.slate, y: 154 },
    ].map((r, i) => (
      <g key={i}>
        <rect
          x="30"
          y={r.y}
          width="300"
          height="30"
          rx="7"
          fill={r.cur ? C.tealSoft : "#fff"}
          stroke={r.c}
          strokeWidth={r.cur ? 1.6 : 1.2}
        />
        <text
          x="44"
          y={r.y + 19}
          fill={r.cur ? C.tealDeep : C.ink2}
          fontSize="11"
          fontFamily="monospace"
          fontWeight={r.cur ? 700 : 500}
        >
          {r.v}
        </text>
        <text
          x="250"
          y={r.y + 19}
          fill={C.ink3}
          fontSize="9.5"
          fontFamily="monospace"
        >
          ver-id
        </text>
      </g>
    ))}
    {/* delete marker */}
    <line
      x1="345"
      y1="120"
      x2="395"
      y2="120"
      stroke={C.red}
      strokeWidth="1.5"
      markerEnd="url(#ar)"
    />
    <rect
      x="405"
      y="60"
      width="270"
      height="130"
      rx="12"
      fill={C.redSoft}
      stroke={C.red}
      strokeWidth="1.3"
    />
    <text x="421" y="84" fill={C.red} fontSize="12" fontWeight="800">
      🗑️ DELETE 요청 시
    </text>
    <text x="421" y="108" fill={C.ink} fontSize="11">
      → 실제 삭제가 아니라 <tspan fontWeight="700">Delete Marker</tspan> 추가
    </text>
    <text x="421" y="128" fill={C.ink2} fontSize="11">
      → 조회 시 "없음"으로 보임(가려짐)
    </text>
    <text x="421" y="150" fill={C.ink2} fontSize="11">
      → Delete Marker 삭제 ={" "}
      <tspan fontWeight="700" fill={C.green}>
        복구
      </tspan>
    </text>
    <text x="421" y="172" fill={C.ink3} fontSize="10">
      버전 ID 지정 삭제만 영구 삭제
    </text>
  </svg>
);

const D_Replication = () => (
  <svg viewBox="0 0 700 250">
    <Defs />
    {bucket(40, 60, "source-bucket", "us-east-1", C.teal)}
    <text
      x="40"
      y="140"
      fill={C.green}
      fontSize="10"
      fontFamily="monospace"
      fontWeight="700"
    >
      ✔ Versioning ON
    </text>
    {bucket(470, 60, "replica-bucket", "eu-west-1", C.purple)}
    <text
      x="470"
      y="140"
      fill={C.green}
      fontSize="10"
      fontFamily="monospace"
      fontWeight="700"
    >
      ✔ Versioning ON
    </text>
    <line
      x1="192"
      y1="93"
      x2="466"
      y2="93"
      stroke={C.teal}
      strokeWidth="2"
      markerEnd="url(#art)"
    />
    <text
      x="330"
      y="82"
      textAnchor="middle"
      fill={C.tealDeep}
      fontSize="11"
      fontWeight="700"
    >
      비동기 복제
    </text>
    <rect x="248" y="100" width="164" height="20" rx="5" fill={C.tealSoft} />
    <text
      x="330"
      y="114"
      textAnchor="middle"
      fill={C.tealDeep}
      fontSize="9.5"
      fontFamily="monospace"
    >
      CRR: 다른 리전 / SRR: 같은 리전
    </text>
    {/* iam */}
    <rect
      x="280"
      y="150"
      width="140"
      height="26"
      rx="7"
      fill={C.amberSoft}
      stroke={C.amber}
    />
    <text
      x="350"
      y="167"
      textAnchor="middle"
      fill={C.amber}
      fontSize="10"
      fontFamily="monospace"
      fontWeight="700"
    >
      IAM Role 권한 필요
    </text>
    {/* notes */}
    <rect
      x="40"
      y="192"
      width="620"
      height="42"
      rx="9"
      fill={C.redSoft}
      stroke={C.red}
      strokeWidth="1.1"
    />
    <text x="56" y="210" fill={C.red} fontSize="11" fontWeight="700">
      ⚠ 활성화 이후 객체만 복제 · 기존 객체는 S3 Batch Replication 사용 · 체이닝
      불가(1→2, 2→3 이어도 1→3 X)
    </text>
    <text x="56" y="226" fill={C.ink2} fontSize="10.5">
      Delete Marker 복제는 선택 옵션 · 버전 ID 지정 영구삭제는 복제되지 않음
    </text>
  </svg>
);

const D_Storage = () => {
  const rows = [
    ["S3 Standard", "99.99%", "즉시(ms)", "—", "자주 접근", C.teal],
    ["Standard-IA", "99.9%", "즉시(ms)", "30일", "가끔·백업/DR", C.teal],
    ["One Zone-IA", "99.5%", "즉시(ms)", "30일", "재생성 가능 데이터", C.amber],
    [
      "Intelligent-Tiering",
      "99.9%",
      "즉시(ms)",
      "—",
      "패턴 불명·자동",
      C.purple,
    ],
    ["Glacier Instant", "99.9%", "즉시(ms)", "90일", "분기 1회 접근", C.slate],
    ["Glacier Flexible", "99.99%", "1분~12시간", "90일", "아카이브", C.slate],
    [
      "Glacier Deep Archive",
      "99.99%",
      "12~48시간",
      "180일",
      "장기·최저가",
      C.slate,
    ],
  ];
  return (
    <svg viewBox="0 0 700 320">
      <text x="30" y="24" fill={C.green} fontSize="11" fontWeight="800">
        🛡 내구성(Durability)은 모든 클래스 동일 = 99.999999999% (11 nines)
      </text>
      {["스토리지 클래스", "가용성", "검색 속도", "최소기간", "용도"].map(
        (h, i) => (
          <text
            key={i}
            x={[36, 216, 300, 400, 486][i]}
            y="52"
            fill={C.ink3}
            fontSize="10"
            fontFamily="monospace"
            fontWeight="700"
          >
            {h}
          </text>
        ),
      )}
      <line x1="30" y1="60" x2="670" y2="60" stroke={C.line} />
      {rows.map((r, i) => {
        const y = 78 + i * 34;
        return (
          <g key={i}>
            <rect
              x="30"
              y={y - 16}
              width="640"
              height="30"
              rx="6"
              fill={i % 2 ? C.panel : "#fff"}
            />
            <rect x="30" y={y - 12} width="4" height="22" rx="2" fill={r[5]} />
            <text
              x="44"
              y={y + 3}
              fill={C.ink}
              fontSize="11.5"
              fontWeight="700"
            >
              {r[0]}
            </text>
            <text
              x="216"
              y={y + 3}
              fill={C.ink2}
              fontSize="11"
              fontFamily="monospace"
            >
              {r[1]}
            </text>
            <text x="300" y={y + 3} fill={C.ink2} fontSize="11">
              {r[2]}
            </text>
            <text x="400" y={y + 3} fill={C.ink2} fontSize="11">
              {r[3]}
            </text>
            <text x="486" y={y + 3} fill={C.ink2} fontSize="11">
              {r[4]}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const D_Lifecycle = () => (
  <svg viewBox="0 0 700 190">
    <Defs />
    <line x1="40" y1="70" x2="660" y2="70" stroke={C.line} strokeWidth="2" />
    {[
      { x: 40, t: "0일", l: "S3 Standard", c: C.teal, s: "업로드" },
      { x: 210, t: "30일", l: "Standard-IA", c: C.teal, s: "Transition" },
      { x: 380, t: "90일", l: "Glacier", c: C.slate, s: "Transition" },
      { x: 550, t: "365일", l: "삭제(Expire)", c: C.red, s: "Expiration" },
    ].map((n, i) => (
      <g key={i}>
        <circle cx={n.x + 55} cy="70" r="8" fill={n.c} />
        <text
          x={n.x + 55}
          y="48"
          textAnchor="middle"
          fill={C.ink2}
          fontSize="10.5"
          fontFamily="monospace"
          fontWeight="700"
        >
          {n.t}
        </text>
        <rect
          x={n.x}
          y="88"
          width="112"
          height="42"
          rx="9"
          fill="#fff"
          stroke={n.c}
          strokeWidth="1.4"
        />
        <text
          x={n.x + 56}
          y="107"
          textAnchor="middle"
          fill={n.c}
          fontSize="11.5"
          fontWeight="700"
        >
          {n.l}
        </text>
        <text
          x={n.x + 56}
          y="122"
          textAnchor="middle"
          fill={C.ink3}
          fontSize="9"
          fontFamily="monospace"
        >
          {n.s}
        </text>
      </g>
    ))}
    <text x="40" y="160" fill={C.ink2} fontSize="11">
      Transition Action = 클래스 자동 이동 · Expiration Action = 자동
      삭제(오래된 버전·미완료 멀티파트 포함)
    </text>
    <text x="40" y="178" fill={C.amber} fontSize="10.5" fontWeight="700">
      규칙은 prefix / object tag 로 범위 지정 가능
    </text>
  </svg>
);

const D_Event = () => (
  <svg viewBox="0 0 700 250">
    <Defs />
    {bucket(40, 90, "my-bucket", "이벤트 발생원", C.teal)}
    <text x="40" y="172" fill={C.ink2} fontSize="9.5" fontFamily="monospace">
      ObjectCreated / Removed …
    </text>
    {[
      { y: 30, n: "SNS", d: "Access Policy", c: C.amber },
      { y: 100, n: "SQS", d: "Access Policy", c: C.green },
      { y: 170, n: "Lambda", d: "Resource Policy", c: C.purple },
    ].map((t, i) => (
      <g key={i}>
        <line
          x1="192"
          y1="123"
          x2="356"
          y2={t.y + 22}
          stroke={C.ink2}
          strokeWidth="1.4"
          markerEnd="url(#ar)"
        />
        <rect
          x="360"
          y={t.y}
          width="150"
          height="44"
          rx="9"
          fill="#fff"
          stroke={t.c}
          strokeWidth="1.5"
        />
        <text x="374" y={t.y + 21} fill={t.c} fontSize="12.5" fontWeight="800">
          {t.n}
        </text>
        <text
          x="374"
          y={t.y + 37}
          fill={C.ink3}
          fontSize="9"
          fontFamily="monospace"
        >
          {t.d} 필요
        </text>
      </g>
    ))}
    <rect
      x="540"
      y="88"
      width="130"
      height="70"
      rx="10"
      fill={C.tealSoft}
      stroke={C.teal}
      strokeWidth="1.5"
    />
    <text
      x="605"
      y="112"
      textAnchor="middle"
      fill={C.tealDeep}
      fontSize="12"
      fontWeight="800"
    >
      EventBridge
    </text>
    <text x="605" y="130" textAnchor="middle" fill={C.ink2} fontSize="9">
      고급 필터·18개+ 대상
    </text>
    <text x="605" y="145" textAnchor="middle" fill={C.ink2} fontSize="9">
      아카이브·재전송
    </text>
    <line
      x1="192"
      y1="123"
      x2="536"
      y2="123"
      stroke={C.teal}
      strokeWidth="1.6"
      markerEnd="url(#art)"
    />
    <text x="440" y="210" fill={C.ink3} fontSize="10">
      대상은 IAM Role이 아니라 각 서비스의 리소스 정책으로 S3에 권한 부여
    </text>
  </svg>
);

const D_Perf = () => (
  <svg viewBox="0 0 700 260">
    <Defs />
    {/* baseline */}
    <rect
      x="30"
      y="24"
      width="640"
      height="46"
      rx="10"
      fill={C.panel}
      stroke={C.line}
    />
    <text x="46" y="44" fill={C.ink} fontSize="11.5" fontWeight="800">
      기본 성능 (prefix 당)
    </text>
    <text x="46" y="61" fill={C.ink2} fontSize="11">
      PUT/COPY/POST/DELETE{" "}
      <tspan fontWeight="700" fill={C.teal}>
        3,500/s
      </tspan>{" "}
      · GET/HEAD{" "}
      <tspan fontWeight="700" fill={C.teal}>
        5,500/s
      </tspan>{" "}
      · prefix 수 제한 없음 → 분산으로 확장
    </text>
    {/* multipart */}
    <rect
      x="30"
      y="86"
      width="200"
      height="150"
      rx="11"
      fill="#fff"
      stroke={C.teal}
      strokeWidth="1.4"
    />
    <text x="46" y="110" fill={C.tealDeep} fontSize="12" fontWeight="800">
      Multipart Upload
    </text>
    {[0, 1, 2].map((i) => (
      <rect
        key={i}
        x={46 + i * 40}
        y="122"
        width="30"
        height="22"
        rx="4"
        fill={C.tealSoft}
        stroke={C.teal}
      />
    ))}
    <text x="46" y="164" fill={C.ink2} fontSize="10.5">
      파일 분할 → 병렬 업로드
    </text>
    <text x="46" y="182" fill={C.ink2} fontSize="10.5">
      100MB↑ 권장 · <tspan fontWeight="700">5GB↑ 필수</tspan>
    </text>
    <text x="46" y="200" fill={C.ink2} fontSize="10.5">
      처리량 극대화
    </text>
    {/* transfer accel */}
    <rect
      x="248"
      y="86"
      width="200"
      height="150"
      rx="11"
      fill="#fff"
      stroke={C.amber}
      strokeWidth="1.4"
    />
    <text x="264" y="110" fill={C.amber} fontSize="12" fontWeight="800">
      Transfer Acceleration
    </text>
    <circle cx="284" cy="140" r="12" fill={C.amberSoft} stroke={C.amber} />
    <text x="284" y="144" textAnchor="middle" fontSize="10">
      📁
    </text>
    <text x="304" y="144" fill={C.ink3} fontSize="9">
      →
    </text>
    <rect x="316" y="128" width="52" height="24" rx="5" fill={C.amberSoft} />
    <text
      x="342"
      y="144"
      textAnchor="middle"
      fontSize="8.5"
      fontFamily="monospace"
      fontWeight="700"
    >
      Edge
    </text>
    <text x="372" y="144" fill={C.ink3} fontSize="9">
      →
    </text>
    <circle cx="396" cy="140" r="12" fill={C.tealSoft} stroke={C.teal} />
    <text x="396" y="144" textAnchor="middle" fontSize="9">
      🪣
    </text>
    <text x="264" y="178" fill={C.ink2} fontSize="10.5">
      엣지 로케이션 경유 후
    </text>
    <text x="264" y="196" fill={C.ink2} fontSize="10.5">
      AWS 백본으로 버킷 전송
    </text>
    <text x="264" y="214" fill={C.ink2} fontSize="10.5">
      멀티파트와 병행 가능
    </text>
    {/* byte range */}
    <rect
      x="466"
      y="86"
      width="204"
      height="150"
      rx="11"
      fill="#fff"
      stroke={C.purple}
      strokeWidth="1.4"
    />
    <text x="482" y="110" fill={C.purple} fontSize="12" fontWeight="800">
      Byte-Range Fetch
    </text>
    <rect
      x="482"
      y="122"
      width="172"
      height="20"
      rx="4"
      fill={C.panel}
      stroke={C.line}
    />
    {[0, 1, 2, 3].map((i) => (
      <rect
        key={i}
        x={484 + i * 43}
        y="124"
        width="40"
        height="16"
        rx="2"
        fill={i === 0 ? C.purpleSoft : "#fff"}
        stroke={C.purple}
        strokeWidth=".8"
      />
    ))}
    <text x="482" y="164" fill={C.ink2} fontSize="10.5">
      특정 바이트 범위만 요청
    </text>
    <text x="482" y="182" fill={C.ink2} fontSize="10.5">
      병렬 다운로드 가속
    </text>
    <text x="482" y="200" fill={C.ink2} fontSize="10.5">
      헤더 등 부분 검색 가능
    </text>
  </svg>
);

const D_Encryption = () => {
  const cards = [
    {
      t: "SSE-S3",
      who: "AWS 소유·관리 키",
      where: "S3 서버",
      note: "AES-256 · 기본값",
      hdr: "AES256",
      c: C.teal,
    },
    {
      t: "SSE-KMS",
      who: "KMS 관리 키",
      where: "S3 서버",
      note: "CloudTrail 감사·제어",
      hdr: "aws:kms",
      c: C.amber,
    },
    {
      t: "SSE-C",
      who: "고객 제공 키",
      where: "S3 서버",
      note: "HTTPS 필수·키 미저장",
      hdr: "고객 키 헤더",
      c: C.purple,
    },
    {
      t: "Client-Side",
      who: "고객 관리 키",
      where: "클라이언트",
      note: "업로드 前 암호화",
      hdr: "SDK 라이브러리",
      c: C.green,
    },
  ];
  return (
    <svg viewBox="0 0 700 230">
      {cards.map((c, i) => {
        const x = 24 + i * 168;
        return (
          <g key={i}>
            <rect
              x={x}
              y="24"
              width="152"
              height="150"
              rx="11"
              fill="#fff"
              stroke={c.c}
              strokeWidth="1.5"
            />
            <rect x={x} y="24" width="152" height="30" rx="11" fill={c.c} />
            <rect x={x} y="40" width="152" height="14" fill={c.c} />
            <text
              x={x + 76}
              y="44"
              textAnchor="middle"
              fill="#fff"
              fontSize="12.5"
              fontWeight="800"
            >
              {c.t}
            </text>
            <text
              x={x + 12}
              y="76"
              fill={C.ink3}
              fontSize="9"
              fontFamily="monospace"
              fontWeight="700"
            >
              키 소유
            </text>
            <text x={x + 12} y="92" fill={C.ink} fontSize="10.5">
              {c.who}
            </text>
            <text
              x={x + 12}
              y="114"
              fill={C.ink3}
              fontSize="9"
              fontFamily="monospace"
              fontWeight="700"
            >
              암호화 위치
            </text>
            <text
              x={x + 12}
              y="130"
              fill={C.ink}
              fontSize="10.5"
              fontWeight="700"
            >
              {c.where}
            </text>
            <line
              x1={x + 12}
              y1="140"
              x2={x + 140}
              y2="140"
              stroke={C.lineSoft}
            />
            <text x={x + 12} y="158" fill={C.ink2} fontSize="9.5">
              {c.note}
            </text>
          </g>
        );
      })}
      <text x="24" y="200" fill={C.ink2} fontSize="11">
        전송 중 암호화(In-transit): HTTPS 엔드포인트 · 버킷 정책{" "}
        <tspan fontFamily="monospace" fontWeight="700" fill={C.teal}>
          aws:SecureTransport
        </tspan>{" "}
        로 HTTPS 강제
      </text>
      <text x="24" y="220" fill={C.ink3} fontSize="10.5">
        DSSE-KMS = KMS 이중 계층 암호화(2023) · S3 Bucket Key = SSE-KMS 호출
        비용/스로틀 절감
      </text>
    </svg>
  );
};

const D_CORS = () => (
  <svg viewBox="0 0 700 220">
    <Defs />
    <rect
      x="30"
      y="70"
      width="180"
      height="80"
      rx="11"
      fill={C.tealSoft}
      stroke={C.teal}
      strokeWidth="1.4"
    />
    <text
      x="120"
      y="98"
      textAnchor="middle"
      fill={C.tealDeep}
      fontSize="12"
      fontWeight="800"
    >
      🌐 Web Browser
    </text>
    <text
      x="120"
      y="118"
      textAnchor="middle"
      fill={C.ink2}
      fontSize="10"
      fontFamily="monospace"
    >
      origin: site-a.com
    </text>
    <text x="120" y="134" textAnchor="middle" fill={C.ink3} fontSize="9">
      이미지·폰트 요청
    </text>

    <rect
      x="490"
      y="70"
      width="180"
      height="80"
      rx="11"
      fill="#fff"
      stroke={C.amber}
      strokeWidth="1.4"
    />
    <text
      x="580"
      y="98"
      textAnchor="middle"
      fill={C.amber}
      fontSize="12"
      fontWeight="800"
    >
      🪣 S3 (bucket-b)
    </text>
    <text
      x="580"
      y="118"
      textAnchor="middle"
      fill={C.ink2}
      fontSize="10"
      fontFamily="monospace"
    >
      CORS 규칙 설정
    </text>
    <text x="580" y="134" textAnchor="middle" fill={C.ink3} fontSize="9">
      다른 origin
    </text>

    <line
      x1="212"
      y1="92"
      x2="488"
      y2="92"
      stroke={C.ink2}
      strokeWidth="1.4"
      markerEnd="url(#ar)"
    />
    <text
      x="350"
      y="84"
      textAnchor="middle"
      fill={C.ink2}
      fontSize="9.5"
      fontFamily="monospace"
    >
      ① Preflight: OPTIONS + Origin
    </text>
    <line
      x1="488"
      y1="128"
      x2="212"
      y2="128"
      stroke={C.teal}
      strokeWidth="1.6"
      markerEnd="url(#art)"
    />
    <text
      x="350"
      y="148"
      textAnchor="middle"
      fill={C.tealDeep}
      fontSize="9.5"
      fontFamily="monospace"
    >
      ② Access-Control-Allow-Origin/Methods 응답
    </text>

    <text x="30" y="188" fill={C.ink2} fontSize="11">
      Origin = scheme + host + port. 요청 origin이 S3의 허용 목록에 있어야
      브라우저가 응답 사용을 허가
    </text>
    <text x="30" y="207" fill={C.amber} fontSize="10.5" fontWeight="700">
      시험 단골: 웹사이트가 다른 S3 버킷의 리소스를 부를 때 → 대상 버킷에 CORS
      헤더 설정 필요
    </text>
  </svg>
);

const D_Presigned = () => (
  <svg viewBox="0 0 700 220">
    <Defs />
    <circle
      cx="80"
      cy="70"
      r="26"
      fill={C.tealSoft}
      stroke={C.teal}
      strokeWidth="1.4"
    />
    <text x="80" y="66" textAnchor="middle" fontSize="17">
      🔑
    </text>
    <text x="80" y="84" textAnchor="middle" fontSize="8" fontFamily="monospace">
      Owner/App
    </text>
    <text
      x="80"
      y="118"
      textAnchor="middle"
      fill={C.ink2}
      fontSize="10"
      fontWeight="700"
    >
      권한 보유
    </text>

    <rect
      x="160"
      y="44"
      width="200"
      height="52"
      rx="10"
      fill="#fff"
      stroke={C.teal}
      strokeWidth="1.4"
    />
    <text x="176" y="66" fill={C.tealDeep} fontSize="11" fontWeight="800">
      Presigned URL 생성
    </text>
    <text x="176" y="84" fill={C.ink3} fontSize="9.5" fontFamily="monospace">
      SDK/CLI/콘솔 · 만료시간 지정
    </text>
    <line
      x1="108"
      y1="66"
      x2="156"
      y2="66"
      stroke={C.teal}
      strokeWidth="1.4"
      markerEnd="url(#art)"
    />

    <circle
      cx="80"
      cy="165"
      r="26"
      fill={C.panel}
      stroke={C.line}
      strokeWidth="1.4"
    />
    <text x="80" y="161" textAnchor="middle" fontSize="17">
      👤
    </text>
    <text
      x="80"
      y="179"
      textAnchor="middle"
      fontSize="8"
      fontFamily="monospace"
    >
      일반 사용자
    </text>

    <line
      x1="260"
      y1="98"
      x2="120"
      y2="150"
      stroke={C.ink3}
      strokeWidth="1.2"
      strokeDasharray="4 3"
      markerEnd="url(#ar)"
    />
    <text x="250" y="128" fill={C.ink3} fontSize="9">
      URL 전달
    </text>

    <rect
      x="410"
      y="120"
      width="260"
      height="86"
      rx="11"
      fill={C.amberSoft}
      stroke={C.amber}
      strokeWidth="1.3"
    />
    <text x="426" y="144" fill={C.amber} fontSize="11.5" fontWeight="800">
      임시 접근 (권한 상속)
    </text>
    <text x="426" y="164" fill={C.ink2} fontSize="10.5">
      생성자의 권한을 그대로 물려받음
    </text>
    <text x="426" y="182" fill={C.ink2} fontSize="10.5">
      GET=다운로드 · PUT=업로드 허용
    </text>
    <text x="426" y="199" fill={C.ink3} fontSize="9.5">
      만료: SDK 기본 3600s · CLI 최대 7일
    </text>
    <line
      x1="120"
      y1="178"
      x2="406"
      y2="170"
      stroke={C.amber}
      strokeWidth="1.4"
      markerEnd="url(#ar)"
    />

    {bucket(410, 24, "premium-bucket", "비공개 객체", C.teal)}
    <line
      x1="540"
      y1="118"
      x2="540"
      y2="90"
      stroke={C.ink3}
      strokeWidth="1.2"
      strokeDasharray="3 3"
      markerEnd="url(#ar)"
    />
  </svg>
);

const D_AccessPoint = () => (
  <svg viewBox="0 0 700 250">
    <Defs />
    {bucket(270, 100, "big-shared-bucket", "수많은 prefix", C.teal)}
    {[
      { y: 24, n: "finance-ap", d: "/finance R/W", c: C.amber },
      { y: 180, n: "sales-ap", d: "/sales  Read", c: C.green },
    ].map((a, i) => (
      <g key={i}>
        <rect
          x="40"
          y={a.y}
          width="170"
          height="46"
          rx="10"
          fill="#fff"
          stroke={a.c}
          strokeWidth="1.5"
        />
        <text x="56" y={a.y + 20} fill={a.c} fontSize="12" fontWeight="800">
          🔌 {a.n}
        </text>
        <text
          x="56"
          y={a.y + 37}
          fill={C.ink3}
          fontSize="9.5"
          fontFamily="monospace"
        >
          {a.d} · 고유 DNS + 정책
        </text>
        <line
          x1="212"
          y1={a.y + 23}
          x2="266"
          y2={i === 0 ? 118 : 148}
          stroke={a.c}
          strokeWidth="1.5"
          markerEnd="url(#ar)"
        />
      </g>
    ))}
    <rect
      x="490"
      y="90"
      width="180"
      height="86"
      rx="11"
      fill={C.purpleSoft}
      stroke={C.purple}
      strokeWidth="1.3"
    />
    <text x="506" y="114" fill={C.purple} fontSize="11.5" fontWeight="800">
      VPC Origin (선택)
    </text>
    <text x="506" y="134" fill={C.ink2} fontSize="10">
      인터넷 미노출 · VPC 내부 전용
    </text>
    <text x="506" y="152" fill={C.ink2} fontSize="10">
      VPC Endpoint 필요
    </text>
    <text x="506" y="168" fill={C.ink3} fontSize="9">
      엔드포인트 정책으로 AP+버킷 허용
    </text>
    <line
      x1="428"
      y1="133"
      x2="486"
      y2="133"
      stroke={C.purple}
      strokeWidth="1.4"
      markerEnd="url(#ar)"
    />
    <text x="40" y="238" fill={C.ink2} fontSize="11">
      각 액세스 포인트는 자체 정책을 가져 대규모 버킷의 접근 관리를 분리·단순화
    </text>
  </svg>
);

const D_ObjectLambda = () => (
  <svg viewBox="0 0 700 190">
    <Defs />
    {[
      { x: 20, n: "S3 Bucket", s: "원본 객체", c: C.teal, e: "🪣" },
      { x: 190, n: "Access Point", s: "지원 AP", c: C.amber, e: "🔌" },
      { x: 360, n: "Object Lambda AP", s: "변환 트리거", c: C.purple, e: "⚡" },
      { x: 540, n: "애플리케이션", s: "변환된 결과 수신", c: C.green, e: "📱" },
    ].map((n, i) => (
      <g key={i}>
        <rect
          x={n.x}
          y="50"
          width="140"
          height="60"
          rx="11"
          fill="#fff"
          stroke={n.c}
          strokeWidth="1.5"
        />
        <text x={n.x + 70} y="74" textAnchor="middle" fontSize="16">
          {n.e}
        </text>
        <text
          x={n.x + 70}
          y="94"
          textAnchor="middle"
          fill={n.c}
          fontSize="11.5"
          fontWeight="800"
        >
          {n.n}
        </text>
        <text
          x={n.x + 70}
          y="108"
          textAnchor="middle"
          fill={C.ink3}
          fontSize="8.5"
        >
          {n.s}
        </text>
        {i < 3 && (
          <line
            x1={n.x + 140}
            y1="80"
            x2={n.x + 188}
            y2="80"
            stroke={C.ink2}
            strokeWidth="1.5"
            markerEnd="url(#ar)"
          />
        )}
      </g>
    ))}
    <text
      x="360"
      y="40"
      textAnchor="middle"
      fill={C.purple}
      fontSize="10"
      fontFamily="monospace"
      fontWeight="700"
    >
      Lambda가 GET 응답을 실시간 가공
    </text>
    <text x="20" y="150" fill={C.ink2} fontSize="11">
      용도: PII 마스킹(분석 뷰) · 형식 변환(XML→행) · 이미지 리사이즈/워터마크 ·
      데이터 보강
    </text>
    <text x="20" y="170" fill={C.ink3} fontSize="10.5">
      원본은 하나로 유지하면서, 애플리케이션마다 다른 형태로 객체를 반환
    </text>
  </svg>
);

const D_Website = () => (
  <svg viewBox="0 0 700 170">
    <Defs />
    <rect
      x="30"
      y="50"
      width="170"
      height="66"
      rx="11"
      fill={C.tealSoft}
      stroke={C.teal}
      strokeWidth="1.4"
    />
    <text
      x="115"
      y="78"
      textAnchor="middle"
      fill={C.tealDeep}
      fontSize="12"
      fontWeight="800"
    >
      🌐 방문자
    </text>
    <text x="115" y="98" textAnchor="middle" fill={C.ink3} fontSize="9.5">
      브라우저 접속
    </text>
    <line
      x1="202"
      y1="83"
      x2="288"
      y2="83"
      stroke={C.teal}
      strokeWidth="1.5"
      markerEnd="url(#art)"
    />
    {bucket(300, 50, "static-site", "정적 호스팅 ON", C.teal)}
    <text x="300" y="132" fill={C.ink2} fontSize="9" fontFamily="monospace">
      index.html / error.html
    </text>
    <rect
      x="470"
      y="44"
      width="200"
      height="80"
      rx="11"
      fill={C.redSoft}
      stroke={C.red}
      strokeWidth="1.3"
    />
    <text x="486" y="68" fill={C.red} fontSize="11.5" fontWeight="800">
      403 Forbidden 이면?
    </text>
    <text x="486" y="88" fill={C.ink2} fontSize="10.5">
      → 버킷 정책으로 퍼블릭
    </text>
    <text x="486" y="104" fill={C.ink2} fontSize="10.5">
      {" "}
      읽기(s3:GetObject) 허용
    </text>
    <text x="486" y="119" fill={C.ink3} fontSize="9">
      + Block Public Access 해제
    </text>
    <text x="30" y="150" fill={C.ink3} fontSize="10" fontFamily="monospace">
      URL: http://bucket-name.s3-website-{"{region}"}.amazonaws.com
    </text>
  </svg>
);

/* ------------------------------ MODULES ------------------------------ */
const MODULES = [
  /* ---------- GROUP 1: 핵심 개념 ---------- */
  {
    group: "핵심 개념",
    code: "S3-01",
    icon: <Database size={16} />,
    title: "S3 개요",
    en: "Buckets, Objects & Keys",
    freq: 4,
    freqNote: "키/prefix 구조, 객체 크기 한도, 버킷 네이밍이 자주 출제됩니다.",
    body: () => (
      <>
        <p className="lead">
          Amazon S3는 <b>무한히 확장되는 객체 스토리지(object storage)</b>
          입니다. "인터넷을 위한 저장소"로 불리며, 백업·아카이브·재해
          복구·데이터 레이크·정적 웹사이트 호스팅 등 AWS 전반의 기반이 됩니다.
        </p>

        <h2 className="h2">
          <span className="bar" />
          버킷(Bucket)과 객체(Object)
        </h2>
        <p className="p">
          데이터는 <b>버킷</b>이라는 최상위 컨테이너에 <b>객체</b>(파일)로
          저장됩니다. 버킷 이름은 <b>전역적으로 고유</b>해야 하며(모든 AWS
          계정을 통틀어), 버킷은 특정 <b>리전</b>에 생성됩니다.
        </p>
        <div className="dgm">
          <div className="cap">
            <span className="dot" />
            Bucket · Object · Key 구조
          </div>
          <D_Overview />
        </div>

        <div className="facts">
          <Fact title="버킷 네이밍 규칙" icon={<Database size={14} />}>
            3~63자 · 소문자/숫자/하이픈만 · <b>대문자·언더스코어 불가</b> · IP
            형식 불가 · 소문자/숫자로 시작
          </Fact>
          <Fact title="객체 = Key + Value" icon={<HardDrive size={14} />}>
            <b>Key</b> = <span className="k">prefix + object name</span> (전체
            경로) · <b>Value</b> = 본문
          </Fact>
          <Fact title="크기 한도" icon={<Layers size={14} />}>
            객체 최대 <b>5TB</b> · 단일 PUT 최대 5GB →{" "}
            <b>5GB 초과 시 멀티파트 업로드 필수</b>
          </Fact>
          <Fact title="폴더는 환상" icon={<Info size={14} />}>
            S3에 실제 디렉터리는 없음. Key에 <span className="k">/</span>가
            들어가 폴더처럼 보일 뿐
          </Fact>
        </div>

        <Call type="exam">
          <b>Key vs prefix</b> 구분은 단골 문제입니다.{" "}
          <span className="k">s3://bucket/folder1/file.txt</span>에서
          <b>
            Key는 <span className="k">folder1/file.txt</span> 전체
          </b>
          이고, <span className="k">folder1/</span>가 prefix입니다. 또한 "5TB
          객체를 한 번에 PUT" 같은 함정 → <b>5GB 초과는 멀티파트 필수</b>임을
          기억하세요.
        </Call>
      </>
    ),
  },
  {
    group: "핵심 개념",
    code: "S3-02",
    icon: <History size={16} />,
    title: "S3 버전 관리",
    en: "Versioning",
    freq: 4,
    freqNote: "Delete Marker 동작과 'null' 버전 개념이 자주 나옵니다.",
    body: () => (
      <>
        <p className="lead">
          <b>버전 관리(Versioning)</b>를 켜면 같은 키로 업로드할 때마다 새{" "}
          <b>버전</b>이 쌓입니다. 실수로 인한 삭제·덮어쓰기로부터 데이터를
          보호하고, 언제든 이전 상태로 롤백할 수 있습니다.
        </p>

        <div className="dgm">
          <div className="cap">
            <span className="dot" />
            버전 스택 · Delete Marker
          </div>
          <D_Versioning />
        </div>

        <ul className="plist">
          <li>
            <span className="n">1</span>
            <span>
              <b>버킷 수준</b>에서 활성화합니다. 같은 키를 다시 올리면 버전 ID가
              부여된 새 버전이 생성됩니다.
            </span>
          </li>
          <li>
            <span className="n">2</span>
            <span>
              버전 관리 <b>활성화 이전</b>에 있던 객체의 버전 ID는{" "}
              <span className="k">null</span>입니다.
            </span>
          </li>
          <li>
            <span className="n">3</span>
            <span>
              객체를 삭제하면 실제로 지워지지 않고 <b>Delete Marker</b>가
              추가되어 "없는 것처럼" 보입니다.
            </span>
          </li>
          <li>
            <span className="n">4</span>
            <span>
              Delete Marker를 삭제하면 <b>복구</b>됩니다. 특정 버전 ID를 지정해
              삭제해야 <b>영구 삭제</b>됩니다.
            </span>
          </li>
          <li>
            <span className="n">5</span>
            <span>
              버전 관리를 <b>중지(suspend)</b>해도 기존 버전은 그대로
              유지됩니다.
            </span>
          </li>
        </ul>

        <Call type="exam">
          "실수로 삭제된 객체 복구" → <b>Delete Marker 제거</b>. "버전 관리 끄면
          기존 버전 사라지나?" → <b>아니오, 보존됨</b>. 버전 관리는{" "}
          <b>MFA Delete·복제(Replication)의 전제 조건</b>이라는 점도 함께
          출제됩니다.
        </Call>
      </>
    ),
  },
  {
    group: "핵심 개념",
    code: "S3-03",
    icon: <Globe size={16} />,
    title: "S3 정적 웹사이트",
    en: "Static Website Hosting",
    freq: 3,
    freqNote: "403 오류 → 버킷 정책/퍼블릭 액세스 연계가 포인트입니다.",
    body: () => (
      <>
        <p className="lead">
          S3는 HTML·CSS·JS·이미지 같은 <b>정적 콘텐츠</b>를 그대로 웹사이트로
          호스팅할 수 있습니다. 서버가 필요 없고, 트래픽에 맞춰 자동 확장됩니다.
        </p>
        <div className="dgm">
          <div className="cap">
            <span className="dot" />
            정적 호스팅 흐름과 403 처리
          </div>
          <D_Website />
        </div>
        <div className="facts">
          <Fact title="웹사이트 URL 형식" icon={<Globe size={14} />}>
            <span className="k">
              bucket.s3-website-{"{region}"}.amazonaws.com
            </span>{" "}
            또는
            <span className="k">
              bucket.s3-website.{"{region}"}.amazonaws.com
            </span>
          </Fact>
          <Fact title="403 Forbidden 원인" icon={<Lock size={14} />}>
            버킷이 비공개 상태.{" "}
            <b>
              버킷 정책으로 퍼블릭 읽기(<span className="k">s3:GetObject</span>)
              허용
            </b>{" "}
            필요
          </Fact>
        </div>
        <Call type="warn">
          웹사이트 활성화 후 <b>403 오류</b>가 나면, ① 계정/버킷의{" "}
          <b>퍼블릭 액세스 차단 해제</b> ②
          <b>
            버킷 정책으로 <span className="k">s3:GetObject</span>를{" "}
            <span className="k">"*"</span>에게 허용
          </b>{" "}
          — 이 두 가지를 확인하세요.
        </Call>
      </>
    ),
  },

  /* ---------- GROUP 2: 보안 ---------- */
  {
    group: "보안",
    code: "S3-04",
    icon: <Shield size={16} />,
    title: "S3 보안 · 버킷 정책",
    en: "IAM & Bucket Policies",
    freq: 5,
    freqNote:
      "가장 빈출되는 영역 중 하나. 정책 평가 로직과 크로스 계정이 핵심.",
    body: () => (
      <>
        <p className="lead">
          S3 접근 제어는 <b>사용자 기반(IAM 정책)</b>과{" "}
          <b>리소스 기반(버킷 정책/ACL)</b>으로 나뉩니다. 둘을 함께 이해하고{" "}
          <b>평가 순서</b>를 아는 것이 DVA에서 특히 중요합니다.
        </p>
        <div className="dgm">
          <div className="cap">
            <span className="dot" />
            접근 제어 계층과 허용 판정
          </div>
          <D_Security />
        </div>

        <h2 className="h2">
          <span className="bar" />
          버킷 정책의 구조
        </h2>
        <p className="p">
          버킷 정책은 JSON이며, <b>크로스 계정 접근</b>이나{" "}
          <b>버킷 공개/암호화 강제</b>에 사용됩니다.
          <span className="k">Principal</span> 필드가 있는 것이 IAM 정책과의 큰
          차이입니다.
        </p>
        <div className="code-b">
          <pre>{`{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicRead",
    "Effect": "Allow",
    "Principal": "*",
    "Action": ["s3:GetObject"],
    "Resource": ["arn:aws:s3:::my-bucket/*"]
  }]
}`}</pre>
        </div>

        <div className="facts">
          <Fact title="IAM 정책" icon={<Shield size={14} />}>
            IAM 사용자·역할에 부착. "이 <b>주체</b>가 무엇을 할 수 있나"를 정의
          </Fact>
          <Fact title="버킷 정책" icon={<ShieldCheck size={14} />}>
            버킷에 부착. <b>크로스 계정</b>·공개·강제 암호화.{" "}
            <span className="k">Principal</span> 포함
          </Fact>
          <Fact title="허용 판정" icon={<Target size={14} />}>
            IAM <b>또는</b> 리소스 정책이 허용하면 통과 (합집합)
          </Fact>
          <Fact title="명시적 Deny" icon={<Lock size={14} />}>
            <b>Deny는 항상 최우선</b>. 하나라도 Deny면 무조건 차단
          </Fact>
        </div>

        <Call type="tip">
          <b>Block Public Access(퍼블릭 액세스 차단)</b>는 계정/버킷 수준의
          안전장치로, 정책과 무관하게 공개를 막습니다. "회사 데이터가 절대
          공개되면 안 된다" → <b>계정 수준에서 4개 설정 모두 켜기</b>가 정답
          패턴입니다.
        </Call>
      </>
    ),
  },
  {
    group: "보안",
    code: "S3-05",
    icon: <KeyRound size={16} />,
    title: "S3 암호화",
    en: "Encryption (SSE / Client-Side)",
    freq: 5,
    freqNote: "4가지 방식 구분과 SSE-C의 HTTPS 필수, KMS 스로틀이 최다 빈출.",
    body: () => (
      <>
        <p className="lead">
          S3는 저장 데이터를 여러 방식으로 암호화합니다.{" "}
          <b>누가 키를 소유하고, 어디서 암호화가 일어나는지</b>로 구분하면
          헷갈리지 않습니다.
        </p>
        <div className="dgm">
          <div className="cap">
            <span className="dot" />
            암호화 4종 · 키 소유 vs 암호화 위치
          </div>
          <D_Encryption />
        </div>

        <ul className="plist">
          <li>
            <span className="n">1</span>
            <span>
              <b>SSE-S3</b> — AWS가 키를 소유·관리(AES-256). 헤더{" "}
              <span className="k">
                "x-amz-server-side-encryption": "AES256"
              </span>
              . <b>현재 기본값</b>.
            </span>
          </li>
          <li>
            <span className="n">2</span>
            <span>
              <b>SSE-KMS</b> — AWS KMS로 키 관리. <b>CloudTrail 감사</b>와
              세밀한 접근 제어. 헤더 <span className="k">"aws:kms"</span>.
            </span>
          </li>
          <li>
            <span className="n">3</span>
            <span>
              <b>SSE-C</b> — 고객이 키를 제공하고 S3는 <b>키를 저장하지 않음</b>
              . <b>반드시 HTTPS</b>로, 매 요청 헤더에 키 전달.
            </span>
          </li>
          <li>
            <span className="n">4</span>
            <span>
              <b>Client-Side</b> — 클라이언트가 <b>업로드 전 암호화</b>,
              복호화도 클라이언트. (S3 Client-Side Encryption Library)
            </span>
          </li>
        </ul>

        <Call type="warn">
          <b>SSE-KMS의 함정</b>: 객체를 읽고 쓸 때마다 KMS의{" "}
          <span className="k">GenerateDataKey</span>·
          <span className="k">Decrypt</span>가 호출되어
          <b>KMS 초당 요청 한도에 걸려 스로틀(ThrottlingException)</b>이 날 수
          있습니다. 해결책은 <b>S3 Bucket Key</b>(KMS 호출 대폭 감소) 또는{" "}
          <b>한도 증설</b>입니다.
        </Call>
        <Call type="exam">
          "키를 AWS에 맡기기 싫고 직접 관리 + S3가 키를 저장하지 않게" →{" "}
          <b>SSE-C</b>(HTTPS 필수). "규정상 키 사용 내역 감사 필요" →{" "}
          <b>SSE-KMS</b>. <b>DSSE-KMS</b>는 KMS <b>이중 계층</b>{" "}
          암호화(2023)입니다.
        </Call>
      </>
    ),
  },
  {
    group: "보안",
    code: "S3-06",
    icon: <Lock size={16} />,
    title: "S3 기본 암호화",
    en: "Default Encryption",
    freq: 3,
    freqNote: "정책이 기본 암호화보다 먼저 평가된다는 점이 포인트.",
    body: () => (
      <>
        <p className="lead">
          2023년 1월부터 <b>모든 새 객체는 자동으로 SSE-S3로 암호화</b>됩니다.
          필요하면 버킷 기본값을 <b>SSE-KMS</b>로 바꿀 수 있습니다.
        </p>
        <div className="facts">
          <Fact title="기본 동작" icon={<Lock size={14} />}>
            새 객체는 별도 설정 없이 <b>SSE-S3</b> 적용. 버킷마다 기본 암호화
            방식 지정 가능
          </Fact>
          <Fact title="암호화 강제" icon={<ShieldCheck size={14} />}>
            버킷 정책으로 <b>암호화 헤더 없는 PUT을 Deny</b>하여 강제 가능
          </Fact>
        </div>
        <Call type="exam">
          <b>"기본 암호화" vs "버킷 정책 강제"</b>의 평가 순서가 시험
          포인트입니다.
          <b>버킷 정책이 기본 암호화보다 먼저 평가</b>되므로, 특정 암호화를
          강제하려면 정책에서 다른 방식의 PUT을 명시적으로 거부합니다.
        </Call>
      </>
    ),
  },
  {
    group: "보안",
    code: "S3-07",
    icon: <Network size={16} />,
    title: "S3 CORS",
    en: "Cross-Origin Resource Sharing",
    freq: 4,
    freqNote:
      "Preflight와 'Allow-Origin' 헤더, 다른 버킷 참조 시나리오가 빈출.",
    body: () => (
      <>
        <p className="lead">
          <b>CORS</b>는 한 <b>오리진(origin)</b>의 웹페이지가 <b>다른 오리진</b>
          의 리소스를 요청하도록 허용하는 브라우저 보안 메커니즘입니다. S3가
          올바른 CORS 헤더를 반환해야 브라우저가 응답을 사용합니다.
        </p>
        <div className="dgm">
          <div className="cap">
            <span className="dot" />
            Preflight 요청과 CORS 응답
          </div>
          <D_CORS />
        </div>
        <div className="facts">
          <Fact title="Origin의 정의" icon={<Globe size={14} />}>
            <b>scheme + host + port</b>. 하나라도 다르면 "다른 오리진"
          </Fact>
          <Fact title="Preflight" icon={<Network size={14} />}>
            브라우저가 <span className="k">OPTIONS</span> +{" "}
            <span className="k">Origin</span> 헤더로 사전 확인 → S3가 허용 응답
          </Fact>
        </div>
        <Call type="exam">
          가장 흔한 문제:{" "}
          <b>웹사이트(오리진 A)가 다른 S3 버킷(오리진 B)의 파일을 참조</b>할 때
          이미지·폰트가 안 뜬다 →<b>대상 버킷 B에 CORS 규칙을 설정</b>하고{" "}
          <span className="k">Access-Control-Allow-Origin</span>에 A의 오리진을
          넣습니다.
        </Call>
      </>
    ),
  },
  {
    group: "보안",
    code: "S3-08",
    icon: <LinkIcon size={16} />,
    title: "S3 사전 서명 URL",
    en: "Presigned URLs",
    freq: 4,
    freqNote: "권한 상속과 만료 시간, 업로드/다운로드 용도가 빈출.",
    body: () => (
      <>
        <p className="lead">
          <b>Presigned URL</b>은 <b>일시적으로</b> S3 객체에 접근할 수 있는
          서명된 링크입니다. 비공개 객체를 특정 사용자에게 한시적으로 열어줄 때
          사용합니다.
        </p>
        <div className="dgm">
          <div className="cap">
            <span className="dot" />
            생성 · 전달 · 임시 접근
          </div>
          <D_Presigned />
        </div>
        <div className="facts">
          <Fact title="권한 상속" icon={<KeyRound size={14} />}>
            URL을 <b>생성한 주체의 권한</b>을 그대로 물려받음.{" "}
            <b>GET=다운로드, PUT=업로드</b> 모두 가능
          </Fact>
          <Fact title="만료 시간" icon={<History size={14} />}>
            SDK 기본 <b>3600초</b> · 콘솔 최대 12시간 · CLI{" "}
            <span className="k">--expires-in</span> 최대 <b>7일(168h)</b>
          </Fact>
        </div>
        <Call type="exam">
          "로그인한 사용자만 프리미엄 파일 다운로드" 또는 "특정 사용자가{" "}
          <b>내 버킷에 업로드</b>하도록 임시 허용" →<b>Presigned URL</b>이
          정답입니다. IAM 사용자를 새로 만들 필요가 없다는 점이 핵심 이점입니다.
        </Call>
      </>
    ),
  },
  {
    group: "보안",
    code: "S3-09",
    icon: <ShieldCheck size={16} />,
    title: "S3 MFA 삭제",
    en: "MFA Delete",
    freq: 3,
    freqNote: "버전 관리 전제·루트 계정 전용·CLI 전용이 포인트.",
    body: () => (
      <>
        <p className="lead">
          <b>MFA Delete</b>는 위험한 삭제 작업에 <b>다중 인증(MFA)</b>을 요구해
          실수·악의적 삭제를 막습니다.
        </p>
        <div className="facts">
          <Fact title="전제 조건" icon={<History size={14} />}>
            <b>버전 관리가 반드시 활성화</b>되어 있어야 함
          </Fact>
          <Fact title="MFA 필요 작업" icon={<Lock size={14} />}>
            <b>객체 버전 영구 삭제</b> · <b>버전 관리 중지(suspend)</b>
          </Fact>
          <Fact title="MFA 불필요" icon={<Info size={14} />}>
            버전 관리 활성화 · 버전 목록 조회는 MFA 없이 가능
          </Fact>
          <Fact title="설정 권한" icon={<KeyRound size={14} />}>
            <b>루트 계정만</b> 켜고 끌 수 있고, <b>CLI로만</b> 설정 가능
          </Fact>
        </div>
        <Call type="exam">
          "MFA Delete를 활성화하려면?" → <b>루트 사용자 + CLI + 버전 관리 ON</b>
          . 콘솔로는 설정할 수 없다는 함정에 주의하세요.
        </Call>
      </>
    ),
  },
  {
    group: "보안",
    code: "S3-10",
    icon: <ScrollText size={16} />,
    title: "S3 액세스 로그",
    en: "Access Logs",
    freq: 2,
    freqNote: "로깅 대상 버킷 순환(무한 루프) 함정이 자주 나옵니다.",
    body: () => (
      <>
        <p className="lead">
          감사·규정 준수를 위해 버킷에 대한 <b>모든 요청(승인·거부 포함)</b>을{" "}
          <b>다른 S3 버킷</b>에 로그로 기록할 수 있습니다.
        </p>
        <div className="facts">
          <Fact title="무엇을 기록하나" icon={<ScrollText size={14} />}>
            요청자·시간·작업·응답 코드 등 모든 접근 기록을 별도 버킷에 저장
          </Fact>
          <Fact title="분석" icon={<Info size={14} />}>
            로그를 Amazon Athena 등으로 분석 가능
          </Fact>
        </div>
        <Call type="warn">
          <b>절대 하면 안 되는 것</b>: 로그를{" "}
          <b>모니터링 대상 버킷 자기 자신</b>에 저장하지 마세요. 로그 기록이 또
          로그를 만드는 <b>무한 루프</b>가 되어 버킷이 기하급수적으로 커집니다.{" "}
          <b>반드시 별도 버킷</b>을 사용합니다.
        </Call>
      </>
    ),
  },

  /* ---------- GROUP 3: 스토리지 관리 ---------- */
  {
    group: "스토리지 관리",
    code: "S3-11",
    icon: <HardDrive size={16} />,
    title: "S3 스토리지 클래스",
    en: "Storage Classes",
    freq: 5,
    freqNote: "클래스별 용도·검색 속도·최소 저장 기간이 매우 자주 출제됩니다.",
    body: () => (
      <>
        <p className="lead">
          S3는 접근 빈도·비용에 따라 여러 <b>스토리지 클래스</b>를 제공합니다.
          <b>내구성은 모두 동일(11 nines)</b>하지만 <b>가용성·검색 속도·비용</b>
          이 다릅니다.
        </p>
        <div className="dgm">
          <div className="cap">
            <span className="dot" />
            클래스별 특성 비교
          </div>
          <D_Storage />
        </div>
        <ul className="plist">
          <li>
            <span className="n">1</span>
            <span>
              <b>Standard</b> — 자주 접근, 낮은 지연/높은 처리량. 일반 용도.
            </span>
          </li>
          <li>
            <span className="n">2</span>
            <span>
              <b>Standard-IA</b> — 가끔 접근하지만 필요 시 즉시.{" "}
              <b>백업·재해 복구</b>. 검색 비용 발생.
            </span>
          </li>
          <li>
            <span className="n">3</span>
            <span>
              <b>One Zone-IA</b> — <b>단일 AZ</b>에만 저장(AZ 손실 시 데이터
              손실). <b>재생성 가능한 데이터</b>에 적합.
            </span>
          </li>
          <li>
            <span className="n">4</span>
            <span>
              <b>Intelligent-Tiering</b> — 접근 패턴에 따라{" "}
              <b>자동 계층 이동</b>. 소액 모니터링 비용, <b>검색 비용 없음</b>.
            </span>
          </li>
          <li>
            <span className="n">5</span>
            <span>
              <b>Glacier Instant Retrieval</b> — 밀리초 검색, 분기 1회 접근,
              최소 <b>90일</b>.
            </span>
          </li>
          <li>
            <span className="n">6</span>
            <span>
              <b>Glacier Flexible Retrieval</b> —
              Expedited(1–5분)/Standard(3–5h)/Bulk(5–12h·무료), 최소 <b>90일</b>
              .
            </span>
          </li>
          <li>
            <span className="n">7</span>
            <span>
              <b>Glacier Deep Archive</b> — Standard(12h)/Bulk(48h), 최소{" "}
              <b>180일</b>. <b>장기 보관 최저가</b>.
            </span>
          </li>
        </ul>
        <Call type="exam">
          시나리오 매칭이 핵심입니다. <b>"손실돼도 재생성 가능"→One Zone-IA</b>,
          <b>"접근 패턴을 모름·자동 최적화"→Intelligent-Tiering</b>,
          <b>"7년 규정 보관·거의 안 봄"→Glacier Deep Archive</b>. 최소 저장
          기간(30/90/180일)도 자주 물어봅니다.
        </Call>
      </>
    ),
  },
  {
    group: "스토리지 관리",
    code: "S3-12",
    icon: <Recycle size={16} />,
    title: "S3 수명 주기 규칙",
    en: "Lifecycle Rules & Analytics",
    freq: 4,
    freqNote: "Transition/Expiration 구분과 S3 Analytics의 적용 범위가 포인트.",
    body: () => (
      <>
        <p className="lead">
          <b>수명 주기 규칙(Lifecycle Rules)</b>으로 객체를{" "}
          <b>자동으로 저렴한 클래스로 이동</b>하거나 <b>일정 기간 후 삭제</b>해
          비용을 최적화합니다.
        </p>
        <div className="dgm">
          <div className="cap">
            <span className="dot" />
            시간에 따른 전환과 만료
          </div>
          <D_Lifecycle />
        </div>
        <div className="facts">
          <Fact title="Transition Action" icon={<Recycle size={14} />}>
            일정 기간 후 <b>다른 클래스로 이동</b> (예: 30일→IA, 90일→Glacier)
          </Fact>
          <Fact title="Expiration Action" icon={<Layers size={14} />}>
            <b>자동 삭제</b> — 오래된 버전, <b>미완료 멀티파트 업로드</b> 정리
            포함
          </Fact>
          <Fact title="범위 지정" icon={<Tag size={14} />}>
            <b>prefix</b>나 <b>object tag</b>로 특정 객체에만 규칙 적용
          </Fact>
          <Fact title="S3 Analytics" icon={<Info size={14} />}>
            <b>Standard ↔ Standard-IA</b> 최적 전환 시점 추천(CSV).{" "}
            <b>Glacier 미지원</b>
          </Fact>
        </div>
        <Call type="exam">
          <b>S3 Analytics는 Glacier로의 전환은 추천하지 못합니다</b> —
          Standard/Standard-IA 사이만 분석합니다. 또한 "미완료 멀티파트 업로드로
          저장 비용이 샌다" → <b>수명 주기 규칙으로 자동 정리</b>가 정답입니다.
        </Call>
      </>
    ),
  },
  {
    group: "스토리지 관리",
    code: "S3-13",
    icon: <Copy size={16} />,
    title: "S3 복제",
    en: "Replication (CRR / SRR)",
    freq: 4,
    freqNote:
      "버전 관리 전제, 기존 객체 미복제(Batch), 체이닝 불가가 최다 함정.",
    body: () => (
      <>
        <p className="lead">
          <b>복제(Replication)</b>는 한 버킷의 객체를 다른 버킷으로{" "}
          <b>비동기 자동 복사</b>합니다.
          <b>CRR</b>(다른 리전)과 <b>SRR</b>(같은 리전)이 있습니다.
        </p>
        <div className="dgm">
          <div className="cap">
            <span className="dot" />
            복제 흐름과 핵심 제약
          </div>
          <D_Replication />
        </div>
        <div className="facts">
          <Fact title="전제 조건" icon={<History size={14} />}>
            <b>원본·대상 버킷 모두 버전 관리 ON</b> + S3에 <b>IAM 권한</b> 부여
          </Fact>
          <Fact title="CRR 용도" icon={<Globe size={14} />}>
            규정 준수·지연 감소·<b>계정 간</b> 복제 (다른 리전)
          </Fact>
          <Fact title="SRR 용도" icon={<Copy size={14} />}>
            <b>로그 집계</b>·prod↔test 동기화 (같은 리전)
          </Fact>
          <Fact title="복제 방식" icon={<Info size={14} />}>
            <b>비동기</b> 복제
          </Fact>
        </div>
        <Call type="warn">
          <b>복제의 3대 함정</b>: ① 복제 설정 <b>이후</b>의 객체만 복제됨 —{" "}
          <b>기존 객체는 S3 Batch Replication</b> 사용. ② <b>체이닝 불가</b> —
          1→2, 2→3을 설정해도 1→3은 자동 복제되지 않음. ③ Delete Marker 복제는{" "}
          <b>선택 옵션</b>이고, <b>버전 ID 지정 영구 삭제는 복제되지 않음</b>.
        </Call>
      </>
    ),
  },

  /* ---------- GROUP 4: 통합 & 성능 ---------- */
  {
    group: "통합 & 성능",
    code: "S3-14",
    icon: <Bell size={16} />,
    title: "S3 이벤트 알림",
    en: "Event Notifications",
    freq: 4,
    freqNote: "대상(SNS/SQS/Lambda)의 리소스 정책과 EventBridge 통합이 빈출.",
    body: () => (
      <>
        <p className="lead">
          객체 생성·삭제·복원 같은 사건이 발생하면 <b>이벤트 알림</b>을 보내
          후속 워크플로를 자동화합니다. (예: 이미지 업로드 → 썸네일 생성)
        </p>
        <div className="dgm">
          <div className="cap">
            <span className="dot" />
            이벤트 대상과 EventBridge
          </div>
          <D_Event />
        </div>
        <div className="facts">
          <Fact title="이벤트 종류" icon={<Bell size={14} />}>
            <span className="k">s3:ObjectCreated:*</span> ·{" "}
            <span className="k">s3:ObjectRemoved:*</span> · Restore ·
            Replication 등
          </Fact>
          <Fact title="대상 3종" icon={<Network size={14} />}>
            <b>SNS · SQS · Lambda</b>
          </Fact>
          <Fact title="권한 방식" icon={<Lock size={14} />}>
            IAM Role이 아니라 <b>각 대상의 리소스 정책</b>(SNS/SQS Access
            Policy, Lambda Resource Policy)
          </Fact>
          <Fact title="EventBridge" icon={<Info size={14} />}>
            모든 이벤트 → <b>18개+ 대상</b>, 고급 JSON 필터, 아카이브·재전송
          </Fact>
        </div>
        <Call type="exam">
          "S3가 SQS로 알림을 못 보낸다" → 대개{" "}
          <b>SQS 큐의 리소스 정책에서 S3를 허용하지 않아서</b>입니다(IAM Role
          아님). "여러 대상에 동시에 보내고 고급 필터링" →{" "}
          <b>Amazon EventBridge</b>가 정답입니다.
        </Call>
      </>
    ),
  },
  {
    group: "통합 & 성능",
    code: "S3-15",
    icon: <Gauge size={16} />,
    title: "S3 퍼포먼스",
    en: "Performance",
    freq: 4,
    freqNote:
      "prefix당 처리량 수치, 멀티파트·Transfer Acceleration·Byte-Range 빈출.",
    body: () => (
      <>
        <p className="lead">
          S3는 자동으로 높은 성능을 내지만,{" "}
          <b>prefix 분산·멀티파트·전송 가속·바이트 범위</b> 기법으로 처리량을 더
          끌어올릴 수 있습니다.
        </p>
        <div className="dgm">
          <div className="cap">
            <span className="dot" />
            기본 성능과 최적화 기법
          </div>
          <D_Perf />
        </div>
        <ul className="plist">
          <li>
            <span className="n">1</span>
            <span>
              <b>기본 성능</b> — prefix당 초당 <b>3,500 PUT/COPY/POST/DELETE</b>
              , <b>5,500 GET/HEAD</b>. prefix 수 제한 없음 → 분산으로 확장.
            </span>
          </li>
          <li>
            <span className="n">2</span>
            <span>
              <b>Multipart Upload</b> — 100MB↑ 권장, <b>5GB↑ 필수</b>. 병렬
              업로드로 처리량 향상.
            </span>
          </li>
          <li>
            <span className="n">3</span>
            <span>
              <b>Transfer Acceleration</b> — <b>엣지 로케이션</b> 경유 후 AWS
              백본으로 버킷 전송. 멀티파트와 병행 가능.
            </span>
          </li>
          <li>
            <span className="n">4</span>
            <span>
              <b>Byte-Range Fetch</b> — 파일의 <b>특정 바이트 범위</b>를 병렬로
              가져와 다운로드 가속·부분 검색.
            </span>
          </li>
        </ul>
        <Call type="exam">
          "지리적으로 먼 사용자의 <b>업로드</b>가 느리다" →{" "}
          <b>Transfer Acceleration</b>. "대용량 파일 다운로드 가속" →{" "}
          <b>Byte-Range Fetch(병렬)</b>. 처리량 수치(3,500 / 5,500)를 그대로
          묻는 문제도 있으니 암기하세요.
        </Call>
      </>
    ),
  },
  {
    group: "통합 & 성능",
    code: "S3-16",
    icon: <Tag size={16} />,
    title: "S3 객체 태그 & 메타데이터",
    en: "Object Tags & Metadata",
    freq: 2,
    freqNote: "메타데이터/태그로 직접 검색 불가라는 점이 함정으로 나옵니다.",
    body: () => (
      <>
        <p className="lead">
          객체에는 <b>메타데이터</b>(키-값)와 <b>태그</b>를 붙여 분류·수명
          주기·보안·비용 관리에 활용할 수 있습니다.
        </p>
        <div className="facts">
          <Fact title="사용자 정의 메타데이터" icon={<Info size={14} />}>
            <span className="k">x-amz-meta-</span> 접두사로 지정. 객체와 함께
            반환됨
          </Fact>
          <Fact title="객체 태그" icon={<Tag size={14} />}>
            보안·수명 주기 규칙·비용 배분에 활용하는 키-값 라벨
          </Fact>
        </div>
        <Call type="exam">
          <b>메타데이터·태그로는 객체를 직접 검색할 수 없습니다.</b> "태그로
          객체를 찾고 싶다" 같은 문제에서는 별도 <b>인덱스(예: DynamoDB)</b>를
          만들어 검색하는 것이 정석 패턴입니다.
        </Call>
      </>
    ),
  },

  /* ---------- GROUP 5: 고급 액세스 ---------- */
  {
    group: "고급 액세스",
    code: "S3-17",
    icon: <Network size={16} />,
    title: "S3 액세스 포인트",
    en: "Access Points",
    freq: 3,
    freqNote: "대규모 접근 관리 단순화와 VPC Origin이 포인트.",
    body: () => (
      <>
        <p className="lead">
          하나의 큰 버킷에 여러 팀·앱이 접근할 때,{" "}
          <b>액세스 포인트(Access Points)</b>로 접근 규칙을 <b>분리·단순화</b>
          합니다. 각 액세스 포인트는 <b>고유 DNS 이름과 자체 정책</b>을
          가집니다.
        </p>
        <div className="dgm">
          <div className="cap">
            <span className="dot" />
            버킷당 다중 액세스 포인트
          </div>
          <D_AccessPoint />
        </div>
        <div className="facts">
          <Fact title="분리된 정책" icon={<Shield size={14} />}>
            예: <span className="k">/finance</span> 읽기·쓰기 AP,{" "}
            <span className="k">/sales</span> 읽기 전용 AP
          </Fact>
          <Fact title="VPC Origin" icon={<Network size={14} />}>
            인터넷에 노출하지 않고 <b>VPC 내부에서만</b> 접근(VPC Endpoint 필요)
          </Fact>
        </div>
        <Call type="tip">
          거대한 버킷 정책 하나가 관리 불가능해질 때,{" "}
          <b>액세스 포인트별로 정책을 나누면</b> 팀·앱 단위로 접근 관리를
          깔끔하게 위임할 수 있습니다.
        </Call>
      </>
    ),
  },
  {
    group: "고급 액세스",
    code: "S3-18",
    icon: <Cpu size={16} />,
    title: "S3 객체 Lambda",
    en: "Object Lambda",
    freq: 3,
    freqNote: "'반환 직전 변환'과 액세스 포인트 기반 구성이 포인트.",
    body: () => (
      <>
        <p className="lead">
          <b>S3 Object Lambda</b>는 액세스 포인트와 Lambda를 결합해, 객체를{" "}
          <b>애플리케이션에 반환하기 직전에 실시간 변환</b>합니다. 원본은 하나로
          유지하면서 앱마다 다른 형태를 제공합니다.
        </p>
        <div className="dgm">
          <div className="cap">
            <span className="dot" />
            Object Lambda 파이프라인
          </div>
          <D_ObjectLambda />
        </div>
        <ul className="plist">
          <li>
            <span className="n">1</span>
            <span>
              <b>PII 마스킹</b> — 분석용 뷰에서 민감 정보를 가림
            </span>
          </li>
          <li>
            <span className="n">2</span>
            <span>
              <b>형식 변환</b> — XML → 행 형식 등으로 즉석 변환
            </span>
          </li>
          <li>
            <span className="n">3</span>
            <span>
              <b>이미지 가공</b> — 리사이즈·워터마크 추가
            </span>
          </li>
          <li>
            <span className="n">4</span>
            <span>
              <b>데이터 보강</b> — 다른 소스 정보를 합쳐 반환
            </span>
          </li>
        </ul>
        <Call type="exam">
          구성 순서를 묻습니다:{" "}
          <b>
            S3 버킷 → (지원) Access Point → Object Lambda Access Point → Lambda
            → 애플리케이션
          </b>
          . "원본을 복제하지 않고 앱마다 다른 형태로 데이터를 제공" →{" "}
          <b>S3 Object Lambda</b>가 정답입니다.
        </Call>
      </>
    ),
  },
];

/* ------------------------------ APP SHELL ------------------------------ */
const GROUPS = [
  "핵심 개념",
  "보안",
  "스토리지 관리",
  "통합 & 성능",
  "고급 액세스",
];
const GROUP_ICON = {
  "핵심 개념": <Database size={13} />,
  보안: <Shield size={13} />,
  "스토리지 관리": <HardDrive size={13} />,
  "통합 & 성능": <Gauge size={13} />,
  "고급 액세스": <Network size={13} />,
};

export default function App() {
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const mainRef = useRef(null);
  const M = MODULES[idx];

  useEffect(() => {
    if (mainRef.current)
      mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [idx]);

  const go = (i) => {
    setIdx(i);
    setOpen(false);
  };

  return (
    <div className="s3root">
      <style>{STYLE}</style>

      {/* top bar */}
      <div className="s3top">
        <div className="s3top-in">
          <button
            className="hamb"
            onClick={() => setOpen(true)}
            aria-label="메뉴 열기"
          >
            <Menu size={18} />
          </button>
          <span className="s3badge">AWS DVA</span>
          <div>
            <h1>Amazon S3 — 시험 대비 필드 매뉴얼</h1>
            <div className="sub">
              Developer Associate · 18 modules · 실습 제외
            </div>
          </div>
          <div className="s3legend">
            <span className="lg" style={{ color: "#e6edf5", fontWeight: 700 }}>
              빈출도
            </span>
            {[5, 4, 3, 2].map((l) => (
              <span className="lg" key={l}>
                <i style={{ background: FREQ[l].c }} />
                {FREQ[l].label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="s3grid">
        {/* sidebar */}
        <div
          className={`overlay ${open ? "show" : ""}`}
          onClick={() => setOpen(false)}
        />
        <aside className={`s3side ${open ? "open" : ""}`}>
          <div className="s3side-h">
            <div
              className="t"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>목차 · CONTENTS</span>
              <button
                className="hamb"
                style={{ display: open ? "flex" : "none" }}
                onClick={() => setOpen(false)}
              >
                <X size={16} />
              </button>
            </div>
          </div>
          {GROUPS.map((g) => (
            <div className="s3grp" key={g}>
              <div className="s3grp-l">
                {GROUP_ICON[g]}
                <span>{g}</span>
                <span className="ln" />
              </div>
              {MODULES.map(
                (m, i) =>
                  m.group === g && (
                    <button
                      key={i}
                      className={`navitem ${i === idx ? "on" : ""}`}
                      onClick={() => go(i)}
                    >
                      <span className="ic">{m.icon}</span>
                      <span className="tx">
                        <span className="code">{m.code}</span>
                        <span className="ttl">{m.title}</span>
                      </span>
                      <Meter level={m.freq} size="mini" />
                    </button>
                  ),
              )}
            </div>
          ))}
          <div
            style={{
              padding: "8px 20px 28px",
              fontSize: 10.5,
              color: C.ink3,
              fontFamily: "'JetBrains Mono',monospace",
              lineHeight: 1.6,
            }}
          >
            빈출도는 DVA-C02 출제 경향 기반 상대 지표입니다.
          </div>
        </aside>

        {/* main */}
        <main className="s3main" ref={mainRef}>
          <div className="s3wrap">
            <div className="mod-eyebrow">
              <span className="code">{M.code}</span>
              <span className="grp">{M.group}</span>
            </div>
            <h1 className="mod-h1">{M.title}</h1>
            <div className="mod-en">{M.en}</div>

            <div className="freqbar">
              <span className="lab">빈출도</span>
              <Meter level={M.freq} />
              <span className="val" style={{ color: FREQ[M.freq].c }}>
                {FREQ[M.freq].label}
              </span>
              <span className="note">{M.freqNote}</span>
            </div>

            <M.body />

            {/* footer nav */}
            <div className="pgnav">
              <button
                className="pgbtn"
                disabled={idx === 0}
                onClick={() => idx > 0 && go(idx - 1)}
              >
                <ChevronLeft size={20} color={C.ink3} />
                <span>
                  <span className="d">이전</span>
                  <span className="t">
                    {idx > 0 ? MODULES[idx - 1].title : "—"}
                  </span>
                </span>
              </button>
              <button
                className="pgbtn nx"
                disabled={idx === MODULES.length - 1}
                onClick={() => idx < MODULES.length - 1 && go(idx + 1)}
              >
                <ChevronRight size={20} color={C.ink3} />
                <span>
                  <span className="d">다음</span>
                  <span className="t">
                    {idx < MODULES.length - 1 ? MODULES[idx + 1].title : "—"}
                  </span>
                </span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
