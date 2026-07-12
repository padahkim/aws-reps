//opus 4.8 high
import React, { useState } from "react";
import {
  Shield, ShieldCheck, ShieldAlert, User, Users, KeyRound, FileText,
  Lock, ArrowRight, ArrowDown, Check, X, Server, Building2, Cloud,
  Fingerprint, Timer, RefreshCw, ScrollText, Layers, GitBranch,
  Globe, CircleDollarSign, AlertTriangle, Boxes, Network
} from "lucide-react";

/* ============================ DESIGN TOKENS ============================ */
const C = {
  bg: "#E7EDF3",
  grid: "#D6DFE8",
  panel: "#FFFFFF",
  ink: "#16202D",
  inkSoft: "#51637A",
  inkFaint: "#8798AC",
  line: "#D2DBE4",
  lineStrong: "#A9B8C7",
  blue: "#2563C9",   // identity / authentication / structure
  blueBg: "#E9F0FB",
  green: "#12946A",  // allow
  greenBg: "#E4F4EE",
  red: "#D63B3B",    // deny
  redBg: "#FBE8E8",
  gold: "#B9770E",   // roles / temporary credentials / keys
  goldBg: "#F7EEDD",
  violet: "#7A3FD6", // policy
  violetBg: "#F0E9FB",
  teal: "#0E8B8B",   // service
  tealBg: "#E1F1F1",
};

const NAV = [
  { id: "overview", n: "00", label: "IAM 개요", icon: Shield },
  { id: "components", n: "01", label: "핵심 구성요소", icon: Boxes },
  { id: "authn", n: "02", label: "인증 vs 인가", icon: Fingerprint },
  { id: "policy", n: "03", label: "정책 구조 (JSON)", icon: FileText },
  { id: "types", n: "04", label: "정책 유형", icon: Layers },
  { id: "eval", n: "05", label: "정책 평가 로직", icon: GitBranch },
  { id: "roles", n: "06", label: "Role & STS", icon: KeyRound },
  { id: "creds", n: "07", label: "자격 증명 & 보안", icon: Lock },
  { id: "exam", n: "08", label: "DVA 시험 핵심", icon: ScrollText },
];

/* ============================ STYLE INJECTION ============================ */
function Styles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
      * { box-sizing: border-box; }
      .iam-root { font-family: 'Inter','Pretendard',system-ui,sans-serif; }
      .iam-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
      .iam-disp { font-family: 'Space Grotesk', 'Inter', sans-serif; }
      .navbtn { transition: all .15s ease; }
      .navbtn:hover { background:${C.blueBg} !important; }
      .toggle-row { transition: background .15s ease; }
      .toggle-row:hover { background:#F4F7FA; }
      .card-hov { transition: transform .18s ease, box-shadow .18s ease; }
      .card-hov:hover { transform: translateY(-3px); box-shadow: 0 10px 26px rgba(22,32,45,.10); }
      .fade-in { animation: fadeIn .35s ease both; }
      @keyframes fadeIn { from{opacity:0; transform:translateY(8px);} to{opacity:1; transform:none;} }
      .pulse-node { animation: pulseN 1.4s ease-in-out infinite; }
      @keyframes pulseN { 0%,100%{opacity:1;} 50%{opacity:.55;} }
      .sw { width:44px; height:24px; border-radius:20px; position:relative; cursor:pointer; transition:background .2s; flex:none; }
      .sw-knob { position:absolute; top:2px; width:20px; height:20px; border-radius:50%; background:#fff; transition:left .2s; box-shadow:0 1px 3px rgba(0,0,0,.25);}
      .sec-scroll::-webkit-scrollbar{ height:6px; }
      .sec-scroll::-webkit-scrollbar-thumb{ background:${C.lineStrong}; border-radius:6px;}
      @media (max-width: 900px){ .iam-shell{ flex-direction:column !important; } .iam-nav{ position:static !important; width:100% !important; height:auto !important; } .iam-navlist{ flex-direction:row !important; overflow-x:auto; } .navbtn{ white-space:nowrap; } }
      @media (prefers-reduced-motion: reduce){ *{ animation:none !important; transition:none !important; } }
    `}</style>
  );
}

/* ============================ SMALL PRIMITIVES ============================ */
const Eyebrow = ({ children, color = C.blue }) => (
  <div className="iam-mono" style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, color, textTransform: "uppercase", marginBottom: 8 }}>
    {children}
  </div>
);

const H2 = ({ children }) => (
  <h2 className="iam-disp" style={{ fontSize: 27, fontWeight: 700, color: C.ink, margin: "0 0 14px", lineHeight: 1.15 }}>{children}</h2>
);

const P = ({ children }) => (
  <p style={{ fontSize: 15, lineHeight: 1.7, color: C.inkSoft, margin: "0 0 14px" }}>{children}</p>
);

const Card = ({ children, style, hov }) => (
  <div className={hov ? "card-hov" : ""} style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 6, padding: 20, ...style }}>
    {children}
  </div>
);

const Note = ({ children, tone = "blue", title = "DVA 포인트" }) => {
  const map = { blue: [C.blue, C.blueBg], gold: [C.gold, C.goldBg], red: [C.red, C.redBg], green: [C.green, C.greenBg], violet: [C.violet, C.violetBg] };
  const [c, bg] = map[tone];
  return (
    <div style={{ background: bg, borderLeft: `4px solid ${c}`, borderRadius: 4, padding: "12px 16px", margin: "16px 0" }}>
      <div className="iam-mono" style={{ fontSize: 11, fontWeight: 700, color: c, letterSpacing: 1, marginBottom: 4 }}>▸ {title}</div>
      <div style={{ fontSize: 14, lineHeight: 1.6, color: C.ink }}>{children}</div>
    </div>
  );
};

const Chip = ({ color, bg, children }) => (
  <span className="iam-mono" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color, background: bg, padding: "3px 9px", borderRadius: 20 }}>{children}</span>
);

const Switch = ({ on, onClick, colorOn = C.green }) => (
  <div className="sw" onClick={onClick} style={{ background: on ? colorOn : C.lineStrong }}>
    <div className="sw-knob" style={{ left: on ? 22 : 2 }} />
  </div>
);

/* ============================ SVG DIAGRAM HELPERS ============================ */
const box = (x, y, w, h, r = 6) => `M${x + r},${y} h${w - 2 * r} a${r},${r} 0 0 1 ${r},${r} v${h - 2 * r} a${r},${r} 0 0 1 -${r},${r} h-${w - 2 * r} a${r},${r} 0 0 1 -${r},-${r} v-${h - 2 * r} a${r},${r} 0 0 1 ${r},-${r} z`;

/* ---------- Diagram 00: IAM as the gate to AWS ---------- */
function DiagOverview() {
  return (
    <svg viewBox="0 0 800 300" style={{ width: "100%", height: "auto" }} role="img" aria-label="IAM은 AWS 계정의 관문">
      {/* actors */}
      <g className="iam-mono" fontSize="12">
        {[["개발자", 40], ["애플리케이션", 105], ["AWS 서비스", 170]].map(([t, y], i) => (
          <g key={i}>
            <rect x="20" y={y} width="120" height="46" rx="6" fill={C.blueBg} stroke={C.blue} />
            <text x="80" y={y + 28} textAnchor="middle" fill={C.blue} fontWeight="600">{t}</text>
            <line x1="140" y1={y + 23} x2="250" y2="150" stroke={C.lineStrong} strokeWidth="1.5" strokeDasharray="4 3" />
          </g>
        ))}
      </g>
      {/* IAM gate */}
      <path d={box(250, 90, 130, 120)} fill="#fff" stroke={C.ink} strokeWidth="2" />
      <text x="315" y="118" textAnchor="middle" className="iam-disp" fontSize="18" fontWeight="700" fill={C.ink}>IAM</text>
      <text x="315" y="140" textAnchor="middle" className="iam-mono" fontSize="10" fill={C.inkSoft}>인증 + 인가</text>
      <g transform="translate(292,152)">
        <rect width="46" height="40" rx="4" fill="none" stroke={C.gold} strokeWidth="2" />
        <path d="M12 40 v-14 a11 11 0 0 1 22 0 v14" fill="none" stroke={C.gold} strokeWidth="2" />
      </g>
      {/* arrow to AWS */}
      <path d="M380 150 h70" stroke={C.green} strokeWidth="2" markerEnd="url(#agreen)" />
      <text x="415" y="142" textAnchor="middle" className="iam-mono" fontSize="10" fill={C.green}>허용 시</text>
      {/* AWS resources */}
      <path d={box(460, 60, 320, 180)} fill={C.tealBg} stroke={C.teal} strokeDasharray="5 4" />
      <text x="620" y="82" textAnchor="middle" className="iam-mono" fontSize="11" fontWeight="700" fill={C.teal}>AWS 계정 리소스</text>
      <g className="iam-mono" fontSize="11" fill={C.ink}>
        {[["S3", 480], ["EC2", 560], ["DynamoDB", 640], ["Lambda", 720]].map(([t, x], i) => (
          <g key={i}>
            <rect x={x} y="105" width="70" height="44" rx="5" fill="#fff" stroke={C.teal} />
            <text x={x + 35} y="131" textAnchor="middle" fontWeight="600">{t}</text>
          </g>
        ))}
        {[["IAM", 480], ["SNS", 560], ["RDS", 640], ["SQS", 720]].map(([t, x], i) => (
          <g key={i}>
            <rect x={x} y="165" width="70" height="44" rx="5" fill="#fff" stroke={C.teal} />
            <text x={x + 35} y="191" textAnchor="middle" fontWeight="600">{t}</text>
          </g>
        ))}
      </g>
      <defs>
        <marker id="agreen" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill={C.green} /></marker>
      </defs>
    </svg>
  );
}

/* ---------- Diagram 01: Users / Groups / Roles / Policies ---------- */
function DiagComponents() {
  return (
    <svg viewBox="0 0 800 360" style={{ width: "100%", height: "auto" }} role="img" aria-label="IAM 구성요소 관계도">
      {/* Group */}
      <path d={box(30, 40, 250, 220)} fill={C.blueBg} stroke={C.blue} strokeDasharray="5 4" />
      <text x="45" y="62" className="iam-mono" fontSize="12" fontWeight="700" fill={C.blue}>GROUP: Developers</text>
      {/* users */}
      {[[60, 90], [170, 90], [60, 175], [170, 175]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width="90" height="60" rx="6" fill="#fff" stroke={C.blue} />
          <circle cx={x + 45} cy={y + 22} r="9" fill="none" stroke={C.blue} strokeWidth="1.6" />
          <path d={`M${x + 30} ${y + 46} a15 15 0 0 1 30 0`} fill="none" stroke={C.blue} strokeWidth="1.6" />
          <text x={x + 45} y={y + 55} textAnchor="middle" className="iam-mono" fontSize="9" fill={C.inkSoft}>User</text>
        </g>
      ))}
      {/* policy attached to group */}
      <path d="M280 150 h60" stroke={C.violet} strokeWidth="2" markerEnd="url(#aviolet)" />
      <text x="310" y="142" textAnchor="middle" className="iam-mono" fontSize="9" fill={C.violet}>연결</text>
      {/* Policy */}
      <g>
        <path d={box(345, 110, 130, 80)} fill={C.violetBg} stroke={C.violet} />
        <path d="M362 128 h96 M362 145 h96 M362 162 h70" stroke={C.violet} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <text x="410" y="182" textAnchor="middle" className="iam-mono" fontSize="10" fontWeight="700" fill={C.violet}>Policy (권한)</text>
      </g>
      {/* Role */}
      <g>
        <path d={box(520, 40, 250, 130)} fill={C.goldBg} stroke={C.gold} />
        <text x="535" y="62" className="iam-mono" fontSize="12" fontWeight="700" fill={C.gold}>ROLE (임시 권한)</text>
        <g transform="translate(540,80)">
          <circle cx="14" cy="14" r="13" fill="none" stroke={C.gold} strokeWidth="2" />
          <path d="M20 14 h20 M40 14 l-5 -5 M40 14 l-5 5" stroke={C.gold} strokeWidth="2" fill="none" />
        </g>
        <text x="595" y="98" className="iam-mono" fontSize="10" fill={C.ink}>AssumeRole로</text>
        <text x="595" y="114" className="iam-mono" fontSize="10" fill={C.ink}>일시적으로 위임</text>
        <text x="535" y="150" className="iam-mono" fontSize="9" fill={C.inkSoft}>EC2 · Lambda · 교차계정 · 페더레이션</text>
      </g>
      {/* Role also has policy */}
      <path d="M520 150 C 500 150, 490 155, 475 155" stroke={C.violet} strokeWidth="2" fill="none" markerEnd="url(#aviolet)" />
      {/* who assumes role */}
      <path d={box(520, 210, 250, 120)} fill="#fff" stroke={C.gold} strokeDasharray="5 4" />
      <text x="535" y="232" className="iam-mono" fontSize="11" fontWeight="700" fill={C.gold}>역할을 맡는 주체(Trust)</text>
      {[["EC2 / Lambda", 260], ["다른 AWS 계정", 285], ["Google/SAML 등 외부 ID", 310]].map(([t, y], i) => (
        <text key={i} x="545" y={y} className="iam-mono" fontSize="10" fill={C.ink}>• {t}</text>
      ))}
      <path d="M520 270 C 490 270, 660 210, 645 210" stroke={C.gold} strokeWidth="1.5" fill="none" strokeDasharray="4 3" markerEnd="url(#agold)" />
      <defs>
        <marker id="aviolet" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill={C.violet} /></marker>
        <marker id="agold" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill={C.gold} /></marker>
      </defs>
    </svg>
  );
}

/* ---------- Diagram 02: AuthN vs AuthZ ---------- */
function DiagAuthN() {
  return (
    <svg viewBox="0 0 800 200" style={{ width: "100%", height: "auto" }} role="img" aria-label="인증과 인가 흐름">
      <g className="iam-mono" fontSize="11">
        <rect x="20" y="70" width="110" height="56" rx="6" fill={C.blueBg} stroke={C.blue} />
        <text x="75" y="94" textAnchor="middle" fontWeight="700" fill={C.blue}>요청자</text>
        <text x="75" y="112" textAnchor="middle" fontSize="9" fill={C.inkSoft}>User/Role/App</text>

        <path d="M130 98 h55" stroke={C.ink} strokeWidth="2" markerEnd="url(#ak)" />

        <rect x="185" y="55" width="150" height="88" rx="6" fill="#fff" stroke={C.blue} strokeWidth="2" />
        <text x="260" y="80" textAnchor="middle" fontWeight="700" fill={C.blue} fontSize="13">① 인증 (AuthN)</text>
        <text x="260" y="100" textAnchor="middle" fontSize="10" fill={C.ink}>"너 누구야?"</text>
        <text x="260" y="118" textAnchor="middle" fontSize="9" fill={C.inkSoft}>비밀번호 · Access Key</text>
        <text x="260" y="132" textAnchor="middle" fontSize="9" fill={C.inkSoft}>· MFA</text>

        <path d="M335 98 h55" stroke={C.ink} strokeWidth="2" markerEnd="url(#ak)" />

        <rect x="390" y="55" width="150" height="88" rx="6" fill="#fff" stroke={C.violet} strokeWidth="2" />
        <text x="465" y="80" textAnchor="middle" fontWeight="700" fill={C.violet} fontSize="13">② 인가 (AuthZ)</text>
        <text x="465" y="100" textAnchor="middle" fontSize="10" fill={C.ink}>"뭐 할 수 있어?"</text>
        <text x="465" y="118" textAnchor="middle" fontSize="9" fill={C.inkSoft}>Policy 평가</text>
        <text x="465" y="132" textAnchor="middle" fontSize="9" fill={C.inkSoft}>Allow / Deny 판정</text>

        <path d="M540 98 h50" stroke={C.ink} strokeWidth="2" />
        <path d="M590 80 h60" stroke={C.green} strokeWidth="2" markerEnd="url(#ag2)" />
        <path d="M590 116 h60" stroke={C.red} strokeWidth="2" markerEnd="url(#ar2)" />
        <rect x="650" y="62" width="130" height="34" rx="6" fill={C.greenBg} stroke={C.green} />
        <text x="715" y="84" textAnchor="middle" fontWeight="700" fill={C.green}>리소스 접근 허용</text>
        <rect x="650" y="100" width="130" height="34" rx="6" fill={C.redBg} stroke={C.red} />
        <text x="715" y="122" textAnchor="middle" fontWeight="700" fill={C.red}>AccessDenied</text>
      </g>
      <defs>
        <marker id="ak" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill={C.ink} /></marker>
        <marker id="ag2" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill={C.green} /></marker>
        <marker id="ar2" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill={C.red} /></marker>
      </defs>
    </svg>
  );
}

/* ---------- Diagram 03: Policy JSON anatomy (annotated) ---------- */
function DiagPolicyJSON() {
  const rows = [
    { t: `{`, k: "" },
    { t: `  "Version": "2012-10-17",`, k: "Version", c: C.inkFaint, note: "정책 언어 버전 (거의 항상 이 값)" },
    { t: `  "Statement": [{`, k: "Statement", c: C.blue, note: "권한 규칙의 배열 — 핵심 블록" },
    { t: `    "Sid": "AllowS3Read",`, k: "Sid", c: C.inkFaint, note: "선택 식별자 (설명용)" },
    { t: `    "Effect": "Allow",`, k: "Effect", c: C.green, note: "Allow 또는 Deny" },
    { t: `    "Action": ["s3:GetObject"],`, k: "Action", c: C.violet, note: "허용/거부할 API 동작" },
    { t: `    "Resource": "arn:aws:s3:::my-bucket/*",`, k: "Resource", c: C.gold, note: "대상 리소스의 ARN" },
    { t: `    "Condition": {`, k: "Condition", c: C.teal, note: "조건 (IP, MFA, 태그 등) — 선택" },
    { t: `      "IpAddress": {"aws:SourceIp": "10.0.0.0/16"}` , k: "" },
    { t: `    }` , k: "" },
    { t: `  }]`, k: "" },
    { t: `}`, k: "" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)", gap: 16 }}>
      <Card style={{ background: "#0F1824", border: "none", padding: 18, overflowX: "auto" }}>
        <pre className="iam-mono" style={{ margin: 0, fontSize: 12.5, lineHeight: 1.85 }}>
          {rows.map((r, i) => (
            <div key={i}>
              {r.k ? (
                <span>
                  <span style={{ color: "#7D8FA6" }}>{r.t.split(/"/)[0]}</span>
                  <span style={{ color: r.c }}>"{r.k}"</span>
                  <span style={{ color: "#C7D2E0" }}>{r.t.split(r.k)[1]?.replace(/^"/, "")}</span>
                </span>
              ) : (
                <span style={{ color: "#7D8FA6" }}>{r.t}</span>
              )}
            </div>
          ))}
        </pre>
      </Card>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.filter(r => r.note).map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 10px", background: C.panel, border: `1px solid ${C.line}`, borderRadius: 5 }}>
            <span className="iam-mono" style={{ fontSize: 11, fontWeight: 700, color: r.c, background: "#fff", border: `1px solid ${r.c}`, padding: "1px 7px", borderRadius: 4, whiteSpace: "nowrap" }}>{r.k}</span>
            <span style={{ fontSize: 12.5, color: C.inkSoft, lineHeight: 1.5 }}>{r.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Diagram 04: Policy types boundary (effective permissions) ---------- */
function DiagPolicyTypes() {
  return (
    <svg viewBox="0 0 760 340" style={{ width: "100%", height: "auto" }} role="img" aria-label="정책 유형 경계와 유효 권한">
      {/* SCP outer */}
      <circle cx="230" cy="170" r="150" fill="none" stroke={C.red} strokeWidth="2" strokeDasharray="6 5" />
      <text x="230" y="45" textAnchor="middle" className="iam-mono" fontSize="12" fontWeight="700" fill={C.red}>SCP (조직 최대 한계)</text>
      {/* permission boundary */}
      <circle cx="200" cy="185" r="105" fill="none" stroke={C.gold} strokeWidth="2" />
      <text x="150" y="105" textAnchor="middle" className="iam-mono" fontSize="11" fontWeight="700" fill={C.gold}>Permission</text>
      <text x="150" y="120" textAnchor="middle" className="iam-mono" fontSize="11" fontWeight="700" fill={C.gold}>Boundary</text>
      {/* identity policy */}
      <circle cx="255" cy="200" r="80" fill={C.violetBg} stroke={C.violet} strokeWidth="2" />
      <text x="300" y="150" textAnchor="middle" className="iam-mono" fontSize="11" fontWeight="700" fill={C.violet}>Identity</text>
      <text x="300" y="165" textAnchor="middle" className="iam-mono" fontSize="11" fontWeight="700" fill={C.violet}>Policy</text>
      {/* effective */}
      <circle cx="225" cy="200" r="34" fill={C.green} opacity="0.85" />
      <text x="225" y="197" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" className="iam-mono">유효</text>
      <text x="225" y="211" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" className="iam-mono">권한</text>

      {/* legend / explanation */}
      <g transform="translate(470,60)">
        <text x="0" y="0" className="iam-mono" fontSize="12" fontWeight="700" fill={C.ink}>유효 권한 = 교집합</text>
        {[
          [C.red, "SCP", "조직(Organizations) 전체가 허용하는 최대치. 여기 없으면 무조건 불가."],
          [C.gold, "Permission Boundary", "IAM 엔티티 개인의 권한 상한선."],
          [C.violet, "Identity Policy", "실제로 부여한 허용 권한."],
          [C.green, "유효 권한", "위 모든 경계 안에서 겹치는 부분만 실제 허용."],
        ].map(([col, t, d], i) => (
          <g key={i} transform={`translate(0,${24 + i * 52})`}>
            <rect x="0" y="-10" width="14" height="14" rx="3" fill={col === C.green ? col : "none"} stroke={col} strokeWidth="2" />
            <text x="24" y="2" className="iam-mono" fontSize="12" fontWeight="700" fill={col}>{t}</text>
            <text x="24" y="20" fontSize="11" fill={C.inkSoft}>{d.length > 34 ? d.slice(0, 34) : d}</text>
            {d.length > 34 && <text x="24" y="35" fontSize="11" fill={C.inkSoft}>{d.slice(34)}</text>}
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ---------- Diagram 06: AssumeRole / STS sequence ---------- */
function DiagSTS() {
  const lanes = [
    ["EC2 / Lambda / User", 90, C.blue],
    ["STS", 400, C.gold],
    ["대상 리소스 (예: S3)", 690, C.teal],
  ];
  return (
    <svg viewBox="0 0 800 320" style={{ width: "100%", height: "auto" }} role="img" aria-label="STS AssumeRole 시퀀스">
      {lanes.map(([t, x, col], i) => (
        <g key={i}>
          <rect x={Number(x) - 80} y="20" width="160" height="34" rx="6" fill="#fff" stroke={col} strokeWidth="2" />
          <text x={x} y="42" textAnchor="middle" className="iam-mono" fontSize="11" fontWeight="700" fill={col}>{t}</text>
          <line x1={x} y1="54" x2={x} y2="300" stroke={C.line} strokeWidth="1.5" strokeDasharray="4 4" />
        </g>
      ))}
      {/* step 1 */}
      <path d="M90 95 H400" stroke={C.gold} strokeWidth="2" markerEnd="url(#sg)" />
      <text x="245" y="88" textAnchor="middle" className="iam-mono" fontSize="10.5" fill={C.ink}>① AssumeRole 요청 (역할 ARN)</text>
      {/* step 2 */}
      <path d="M400 150 H90" stroke={C.gold} strokeWidth="2" markerEnd="url(#sg)" />
      <text x="245" y="143" textAnchor="middle" className="iam-mono" fontSize="10.5" fill={C.gold}>② 임시 자격증명 발급</text>
      <text x="245" y="167" textAnchor="middle" className="iam-mono" fontSize="9.5" fill={C.inkSoft}>AccessKeyId · SecretKey · SessionToken (만료O)</text>
      {/* step 3 */}
      <path d="M90 220 H690" stroke={C.teal} strokeWidth="2" markerEnd="url(#st)" />
      <text x="390" y="213" textAnchor="middle" className="iam-mono" fontSize="10.5" fill={C.ink}>③ 임시 자격으로 API 호출 (s3:GetObject)</text>
      {/* step 4 */}
      <path d="M690 270 H90" stroke={C.green} strokeWidth="2" markerEnd="url(#sgr)" />
      <text x="390" y="263" textAnchor="middle" className="iam-mono" fontSize="10.5" fill={C.green}>④ 데이터 반환 (권한 있으면)</text>
      <defs>
        <marker id="sg" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill={C.gold} /></marker>
        <marker id="st" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill={C.teal} /></marker>
        <marker id="sgr" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill={C.green} /></marker>
      </defs>
    </svg>
  );
}

/* ============================ INTERACTIVE: EVALUATION ENGINE ============================ */
function EvalEngine() {
  const [explicitDeny, setDeny] = useState(false);
  const [scp, setScp] = useState(true);
  const [pb, setPb] = useState(true);
  const [allow, setAllow] = useState(true);

  // AWS 평가 순서(단순화): 명시적 Deny > SCP > Permission Boundary > 명시적 Allow > else 암묵적 Deny
  let stop = null, result = "ALLOW";
  if (explicitDeny) { stop = "deny"; result = "DENY"; }
  else if (!scp) { stop = "scp"; result = "DENY"; }
  else if (!pb) { stop = "pb"; result = "DENY"; }
  else if (!allow) { stop = "allow"; result = "DENY"; }

  const reason = explicitDeny ? "명시적 Deny는 그 무엇도 이깁니다 → 즉시 거부"
    : !scp ? "SCP(조직 경계)가 허용하지 않음 → 거부"
    : !pb ? "Permission Boundary 상한 밖 → 거부"
    : !allow ? "어떤 정책도 명시적으로 Allow하지 않음 → 암묵적 거부"
    : "모든 경계를 통과하고 명시적 Allow 존재 → 허용";

  const steps = [
    { id: "start", label: "요청 도착", sub: "기본값 = 암묵적 거부", color: C.inkSoft },
    { id: "deny", label: "명시적 Deny 있음?", sub: "어디든 Deny 하나라도 있으면", color: C.red, active: explicitDeny },
    { id: "scp", label: "SCP가 허용?", sub: "조직 계정일 때 최대 한계", color: C.gold, active: !scp },
    { id: "pb", label: "Permission Boundary 통과?", sub: "엔티티 권한 상한", color: C.gold, active: !pb },
    { id: "allow", label: "명시적 Allow 있음?", sub: "Identity/Resource 정책", color: C.blue, active: !allow },
  ];

  const toggles = [
    ["명시적 Deny 존재", explicitDeny, () => setDeny(!explicitDeny), C.red],
    ["SCP가 허용", scp, () => setScp(!scp), C.green],
    ["Permission Boundary 통과", pb, () => setPb(!pb), C.green],
    ["명시적 Allow 존재", allow, () => setAllow(!allow), C.green],
  ];

  return (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ background: "#0F1824", padding: "12px 18px", display: "flex", alignItems: "center", gap: 8 }}>
        <GitBranch size={16} color="#7FA8E8" />
        <span className="iam-mono" style={{ color: "#DCE6F2", fontSize: 13, fontWeight: 600 }}>정책 평가 시뮬레이터 — 토글을 바꿔보세요</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.1fr)", gap: 0 }}>
        {/* controls */}
        <div style={{ padding: 18, borderRight: `1px solid ${C.line}` }}>
          <div className="iam-mono" style={{ fontSize: 11, color: C.inkFaint, marginBottom: 10, letterSpacing: 1 }}>INPUT — 요청 조건</div>
          {toggles.map(([label, on, fn, col], i) => (
            <div key={i} className="toggle-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 8px", borderRadius: 6 }}>
              <span style={{ fontSize: 13.5, color: C.ink, fontWeight: 500 }}>{label}</span>
              <Switch on={on} onClick={fn} colorOn={col} />
            </div>
          ))}
          <div style={{ marginTop: 16, padding: 14, borderRadius: 8, background: result === "ALLOW" ? C.greenBg : C.redBg, border: `1px solid ${result === "ALLOW" ? C.green : C.red}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {result === "ALLOW" ? <ShieldCheck size={22} color={C.green} /> : <ShieldAlert size={22} color={C.red} />}
              <span className="iam-disp" style={{ fontSize: 22, fontWeight: 700, color: result === "ALLOW" ? C.green : C.red }}>{result}</span>
            </div>
            <div style={{ fontSize: 12.5, color: C.ink, marginTop: 8, lineHeight: 1.5 }}>{reason}</div>
          </div>
        </div>
        {/* flow */}
        <div style={{ padding: 18 }}>
          <div className="iam-mono" style={{ fontSize: 11, color: C.inkFaint, marginBottom: 10, letterSpacing: 1 }}>DECISION FLOW — 평가 순서</div>
          {steps.map((s, i) => {
            const isStop = stop === s.id;
            return (
              <div key={s.id}>
                <div className={isStop ? "pulse-node" : ""} style={{
                  display: "flex", gap: 10, alignItems: "center", padding: "9px 12px", borderRadius: 6,
                  border: `1.5px solid ${isStop ? C.red : C.line}`,
                  background: isStop ? C.redBg : "#fff",
                }}>
                  <span className="iam-mono" style={{ fontSize: 10, fontWeight: 700, color: isStop ? C.red : C.inkFaint, minWidth: 16 }}>{i}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: isStop ? C.red : C.ink }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: C.inkFaint }}>{s.sub}</div>
                  </div>
                  {isStop && <X size={16} color={C.red} />}
                </div>
                {i < steps.length - 1 && <div style={{ height: 12, marginLeft: 20, borderLeft: `2px solid ${C.line}` }} />}
              </div>
            );
          })}
          {!stop && (
            <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center", padding: "9px 12px", borderRadius: 6, background: C.greenBg, border: `1.5px solid ${C.green}` }}>
              <Check size={16} color={C.green} />
              <span style={{ fontSize: 13, fontWeight: 700, color: C.green }}>모든 게이트 통과 → 최종 허용</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

/* ============================ SECTIONS ============================ */
function TwoCol({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 14, margin: "16px 0" }}>{children}</div>;
}

function Sections({ active }) {
  const S = {
    /* ---------- 00 OVERVIEW ---------- */
    overview: (
      <div className="fade-in">
        <Eyebrow>// 00 · IDENTITY AND ACCESS MANAGEMENT</Eyebrow>
        <H2>IAM은 AWS 계정의 "관문"입니다</H2>
        <P>IAM(Identity and Access Management)은 <b>누가(인증)</b> AWS에 접근할 수 있고, 각자 <b>무엇을(인가)</b> 할 수 있는지를 통제하는 서비스입니다. 모든 AWS API 요청은 IAM을 거쳐 허용/거부가 결정됩니다.</P>
        <Card style={{ margin: "16px 0" }}><DiagOverview /></Card>
        <TwoCol>
          <Card hov><Chip color={C.blue} bg={C.blueBg}><Globe size={13} />글로벌 서비스</Chip><p style={{ fontSize: 13.5, color: C.inkSoft, marginTop: 10, lineHeight: 1.6 }}>리전에 종속되지 않습니다. 유저·역할·정책은 계정 전체에 걸쳐 동일합니다.</p></Card>
          <Card hov><Chip color={C.green} bg={C.greenBg}><CircleDollarSign size={13} />무료</Chip><p style={{ fontSize: 13.5, color: C.inkSoft, marginTop: 10, lineHeight: 1.6 }}>IAM 자체는 추가 비용이 없습니다. 사용하는 리소스에만 과금됩니다.</p></Card>
          <Card hov><Chip color={C.gold} bg={C.goldBg}><Fingerprint size={13} />최소 권한</Chip><p style={{ fontSize: 13.5, color: C.inkSoft, marginTop: 10, lineHeight: 1.6 }}>기본은 전부 거부. 필요한 권한만 명시적으로 부여하는 것이 원칙입니다.</p></Card>
        </TwoCol>
        <Note tone="blue">DVA에서 IAM은 거의 모든 서비스 문제의 배경입니다. "Lambda가 S3를 못 읽어요", "EC2가 DynamoDB 접근 실패" 유형은 <b>대부분 IAM Role/정책 문제</b>입니다.</Note>
      </div>
    ),

    /* ---------- 01 COMPONENTS ---------- */
    components: (
      <div className="fade-in">
        <Eyebrow color={C.violet}>// 01 · CORE BUILDING BLOCKS</Eyebrow>
        <H2>4가지 핵심 구성요소</H2>
        <P>IAM은 <b>User · Group · Role · Policy</b> 네 요소의 조합입니다. 권한은 항상 <b>Policy</b>로 정의하고, 그것을 User·Group·Role에 <b>연결(attach)</b>합니다.</P>
        <Card style={{ margin: "16px 0" }}><DiagComponents /></Card>
        <TwoCol>
          <Card hov><div style={{ display: "flex", gap: 8, alignItems: "center" }}><User size={18} color={C.blue} /><b style={{ color: C.blue }}>User (사용자)</b></div><p style={{ fontSize: 13, color: C.inkSoft, marginTop: 8, lineHeight: 1.6 }}>사람 또는 앱에 대응하는 <b>영구</b> 자격 증명. 비밀번호(콘솔) 또는 Access Key(프로그래밍)를 가집니다.</p></Card>
          <Card hov><div style={{ display: "flex", gap: 8, alignItems: "center" }}><Users size={18} color={C.blue} /><b style={{ color: C.blue }}>Group (그룹)</b></div><p style={{ fontSize: 13, color: C.inkSoft, marginTop: 8, lineHeight: 1.6 }}>User의 모음. 정책을 그룹에 붙여 <b>한 번에 관리</b>. 그룹은 로그인할 수 없고, <b>그룹 안에 그룹은 불가</b>.</p></Card>
          <Card hov><div style={{ display: "flex", gap: 8, alignItems: "center" }}><KeyRound size={18} color={C.gold} /><b style={{ color: C.gold }}>Role (역할)</b></div><p style={{ fontSize: 13, color: C.inkSoft, marginTop: 8, lineHeight: 1.6 }}>맡을 수 있는(assume) <b>임시</b> 신원. EC2·Lambda·교차계정에 권한을 줄 때 사용. 자격 증명이 자동 순환됩니다.</p></Card>
          <Card hov><div style={{ display: "flex", gap: 8, alignItems: "center" }}><FileText size={18} color={C.violet} /><b style={{ color: C.violet }}>Policy (정책)</b></div><p style={{ fontSize: 13, color: C.inkSoft, marginTop: 8, lineHeight: 1.6 }}>권한을 정의한 <b>JSON 문서</b>. Allow/Deny + Action + Resource로 구성. 나머지 셋에 연결해 효력이 생깁니다.</p></Card>
        </TwoCol>
        <Note tone="gold" title="Root vs IAM User">계정 생성 시 만들어지는 <b>Root 사용자</b>는 모든 권한을 가지므로 일상 작업에 쓰면 안 됩니다. MFA를 걸고 잠가둔 뒤, 실제 작업은 권한을 제한한 <b>IAM 사용자/역할</b>로 하세요.</Note>
      </div>
    ),

    /* ---------- 02 AUTHN ---------- */
    authn: (
      <div className="fade-in">
        <Eyebrow>// 02 · AUTHENTICATION vs AUTHORIZATION</Eyebrow>
        <H2>인증(누구냐) 다음에 인가(뭘 하냐)</H2>
        <P>두 단계는 순서가 있습니다. 먼저 <b>인증(Authentication)</b>으로 신원을 확인하고, 그 다음 <b>인가(Authorization)</b>로 정책을 평가해 그 요청을 허용할지 결정합니다.</P>
        <Card style={{ margin: "16px 0" }}><DiagAuthN /></Card>
        <TwoCol>
          <Card><Chip color={C.blue} bg={C.blueBg}>① 인증 · AuthN</Chip><ul style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.7, margin: "10px 0 0", paddingLeft: 18 }}><li>콘솔: 사용자명 + 비밀번호 (+MFA)</li><li>CLI/SDK: Access Key ID + Secret Access Key</li><li>역할: STS가 발급한 임시 토큰</li></ul></Card>
          <Card><Chip color={C.violet} bg={C.violetBg}>② 인가 · AuthZ</Chip><ul style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.7, margin: "10px 0 0", paddingLeft: 18 }}><li>요청과 관련된 모든 정책을 수집</li><li>Deny 우선 규칙으로 평가</li><li>결과: 허용 또는 <b>AccessDenied</b> 오류</li></ul></Card>
        </TwoCol>
        <Note tone="red" title="흔한 오해">유효한 Access Key가 있어도(=인증 성공) 정책이 없으면 아무것도 못 합니다(=인가 실패). "로그인은 되는데 작업이 안 되는" 상황의 원인입니다.</Note>
      </div>
    ),

    /* ---------- 03 POLICY JSON ---------- */
    policy: (
      <div className="fade-in">
        <Eyebrow color={C.violet}>// 03 · POLICY DOCUMENT ANATOMY</Eyebrow>
        <H2>정책은 JSON 문서입니다</H2>
        <P>모든 권한은 이 구조로 표현됩니다. 시험에서 정책을 읽고 "이 요청이 허용되는가?"를 판단하는 문제가 자주 나오므로 각 필드를 확실히 익혀두세요.</P>
        <div style={{ margin: "16px 0" }}><DiagPolicyJSON /></div>
        <TwoCol>
          <Card><b className="iam-mono" style={{ color: C.green, fontSize: 13 }}>Effect</b><p style={{ fontSize: 13, color: C.inkSoft, marginTop: 6, lineHeight: 1.6 }}><code>Allow</code> 또는 <code>Deny</code>. Deny는 언제나 Allow보다 우선합니다.</p></Card>
          <Card><b className="iam-mono" style={{ color: C.violet, fontSize: 13 }}>Action</b><p style={{ fontSize: 13, color: C.inkSoft, marginTop: 6, lineHeight: 1.6 }}><code>service:Operation</code> 형식. <code>s3:*</code>, <code>dynamodb:GetItem</code> 등. 와일드카드 <code>*</code> 사용 가능.</p></Card>
          <Card><b className="iam-mono" style={{ color: C.gold, fontSize: 13 }}>Resource</b><p style={{ fontSize: 13, color: C.inkSoft, marginTop: 6, lineHeight: 1.6 }}>대상의 <b>ARN</b>. 예: <code>arn:aws:s3:::bucket/*</code>. 버킷과 객체는 다른 ARN임에 주의.</p></Card>
          <Card><b className="iam-mono" style={{ color: C.teal, fontSize: 13 }}>Condition</b><p style={{ fontSize: 13, color: C.inkSoft, marginTop: 6, lineHeight: 1.6 }}>조건부 적용. <code>aws:SourceIp</code>, <code>aws:MultiFactorAuthPresent</code>, 태그 기반 등.</p></Card>
        </TwoCol>
        <Note tone="violet">ARN 형식을 기억하세요: <code className="iam-mono">arn:aws:service:region:account-id:resource</code>. S3처럼 글로벌한 리소스는 region/account가 비어 있습니다.</Note>
      </div>
    ),

    /* ---------- 04 TYPES ---------- */
    types: (
      <div className="fade-in">
        <Eyebrow color={C.gold}>// 04 · POLICY TYPES</Eyebrow>
        <H2>정책 유형과 "유효 권한"</H2>
        <P>정책은 여러 종류가 있고, 실제 허용되는 권한은 이들의 <b>교집합</b>입니다. 어느 하나라도 막으면 그 동작은 불가능합니다.</P>
        <Card style={{ margin: "16px 0" }}><DiagPolicyTypes /></Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "16px 0" }}>
          {[
            [C.violet, "Identity-based", "User·Group·Role에 붙이는 정책. '이 신원이 무엇을 할 수 있는가'. 가장 흔함."],
            [C.teal, "Resource-based", "리소스에 직접 붙임 (S3 버킷 정책, SQS/SNS/Lambda 정책). Principal로 '누가' 접근 가능한지 명시. 교차계정에 유용."],
            [C.gold, "Permission Boundary", "IAM 엔티티가 가질 수 있는 권한의 상한선. 권한을 부여하지 않고 '한계'만 설정."],
            [C.red, "SCP (Service Control Policy)", "AWS Organizations에서 계정/OU 전체에 적용하는 최대 권한 경계. 여기 없으면 어떤 정책도 소용 없음."],
            [C.blue, "Session Policy", "AssumeRole 시 인라인으로 넘기는 임시 정책. 해당 세션에만 한정."],
          ].map(([col, t, d], i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "12px 14px", background: C.panel, border: `1px solid ${C.line}`, borderRadius: 6, borderLeft: `4px solid ${col}` }}>
              <b className="iam-mono" style={{ color: col, fontSize: 13, minWidth: 150, flex: "none" }}>{t}</b>
              <span style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.55 }}>{d}</span>
            </div>
          ))}
        </div>
        <Note tone="gold" title="Managed vs Inline">
          <b>Managed 정책</b>은 독립적으로 존재하며 여러 엔티티에 재사용(AWS관리형/고객관리형). <b>Inline 정책</b>은 특정 엔티티에 1:1로 박혀 있어 삭제하면 같이 사라집니다. 재사용성·감사 편의 때문에 보통 Managed를 권장합니다.
        </Note>
      </div>
    ),

    /* ---------- 05 EVAL ---------- */
    eval: (
      <div className="fade-in">
        <Eyebrow color={C.red}>// 05 · POLICY EVALUATION LOGIC ★</Eyebrow>
        <H2>평가 로직 — DVA 최다 출제 지점</H2>
        <P>여러 정책이 겹칠 때 AWS가 허용/거부를 결정하는 규칙입니다. 핵심 한 줄: <b style={{ color: C.red }}>명시적 Deny &gt; 명시적 Allow &gt; 암묵적 Deny(기본값)</b>. 아래에서 토글을 직접 바꿔 결과를 확인해 보세요.</P>
        <div style={{ margin: "16px 0" }}><EvalEngine /></div>
        <TwoCol>
          <Card><Chip color={C.red} bg={C.redBg}><X size={13} />명시적 Deny</Chip><p style={{ fontSize: 13, color: C.inkSoft, marginTop: 8, lineHeight: 1.6 }}>어디에든 하나라도 있으면 <b>무조건 거부</b>. 다른 모든 Allow를 무효화합니다.</p></Card>
          <Card><Chip color={C.green} bg={C.greenBg}><Check size={13} />명시적 Allow</Chip><p style={{ fontSize: 13, color: C.inkSoft, marginTop: 8, lineHeight: 1.6 }}>Deny가 없고 관련 경계를 통과하면 허용됩니다.</p></Card>
          <Card><Chip color={C.inkFaint} bg="#EEF1F5"><Lock size={13} />암묵적 Deny</Chip><p style={{ fontSize: 13, color: C.inkSoft, marginTop: 8, lineHeight: 1.6 }}>기본값. 아무 정책도 허용하지 않으면 자동으로 거부됩니다.</p></Card>
        </TwoCol>
        <Note tone="red" title="시험 함정">"관리자 정책(Allow *)이 붙어 있는데도 특정 버킷 접근이 막힌다" → 어딘가에 <b>명시적 Deny</b>(예: SCP나 버킷 정책)가 있기 때문. Allow를 아무리 더해도 Deny를 못 이깁니다.</Note>
      </div>
    ),

    /* ---------- 06 ROLES / STS ---------- */
    roles: (
      <div className="fade-in">
        <Eyebrow color={C.gold}>// 06 · IAM ROLE & STS</Eyebrow>
        <H2>Role은 "빌려 쓰는 임시 신원"</H2>
        <P>Access Key를 코드에 하드코딩하는 대신, <b>Role</b>을 부여하면 AWS가 <b>STS(Security Token Service)</b>를 통해 자동으로 <b>만료되는 임시 자격 증명</b>을 발급합니다. 이것이 AWS의 권장 방식입니다.</P>
        <Card style={{ margin: "16px 0" }}><DiagSTS /></Card>
        <TwoCol>
          <Card><b style={{ color: C.gold, fontSize: 13.5 }}>Trust Policy (신뢰 정책)</b><p style={{ fontSize: 13, color: C.inkSoft, marginTop: 6, lineHeight: 1.6 }}>"<b>누가</b> 이 역할을 맡을 수 있나"를 정의(Principal). EC2 서비스, 특정 계정, 외부 IdP 등.</p></Card>
          <Card><b style={{ color: C.violet, fontSize: 13.5 }}>Permission Policy (권한 정책)</b><p style={{ fontSize: 13, color: C.inkSoft, marginTop: 6, lineHeight: 1.6 }}>"역할을 맡으면 <b>무엇을</b> 할 수 있나"를 정의. 일반 Identity 정책과 동일한 구조.</p></Card>
        </TwoCol>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "16px 0" }}>
          {[
            [Server, "EC2 인스턴스 프로파일", "EC2에 역할을 붙이면 인스턴스 안 앱이 키 없이 AWS API 호출. 자격증명은 메타데이터로 자동 제공·순환."],
            [Cloud, "Lambda 실행 역할", "Lambda 함수가 다른 서비스(S3, DynamoDB 등)에 접근할 때 사용하는 역할."],
            [Building2, "교차 계정 접근", "A계정 사용자가 B계정의 역할을 AssumeRole. 키 공유 없이 안전하게 위임."],
            [Network, "Web Identity / SAML 페더레이션", "Google·Cognito·기업 SSO 로그인 사용자에게 임시 AWS 권한 부여(AssumeRoleWithWebIdentity 등)."],
          ].map(([Ic, t, d], i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", background: C.panel, border: `1px solid ${C.line}`, borderRadius: 6 }}>
              <Ic size={18} color={C.gold} style={{ marginTop: 2, flex: "none" }} />
              <div><b style={{ color: C.ink, fontSize: 13.5 }}>{t}</b><p style={{ fontSize: 13, color: C.inkSoft, margin: "3px 0 0", lineHeight: 1.55 }}>{d}</p></div>
            </div>
          ))}
        </div>
        <Note tone="gold" title="STS 주요 API">
          <b>AssumeRole</b>(같은/다른 AWS 계정), <b>AssumeRoleWithWebIdentity</b>(Cognito/OIDC 등 웹 ID), <b>AssumeRoleWithSAML</b>(기업 SAML). 반환값엔 항상 <b>SessionToken</b>이 포함되고 만료 시간이 있습니다.
        </Note>
      </div>
    ),

    /* ---------- 07 CREDS ---------- */
    creds: (
      <div className="fade-in">
        <Eyebrow>// 07 · CREDENTIALS & SECURITY</Eyebrow>
        <H2>자격 증명과 보안 모범 사례</H2>
        <P>어떤 방식으로 인증하느냐에 따라 자격 증명의 종류가 다릅니다. 그리고 개발자로서 지켜야 할 몇 가지 원칙이 있습니다.</P>
        <TwoCol>
          <Card hov><Chip color={C.blue} bg={C.blueBg}><User size={13} />콘솔 접근</Chip><p style={{ fontSize: 13, color: C.inkSoft, marginTop: 8, lineHeight: 1.6 }}>사용자명 + <b>비밀번호</b>. 계정 단위 <b>암호 정책</b>(길이·복잡도·만료) 설정 가능. MFA 강력 권장.</p></Card>
          <Card hov><Chip color={C.gold} bg={C.goldBg}><KeyRound size={13} />프로그래밍 접근</Chip><p style={{ fontSize: 13, color: C.inkSoft, marginTop: 8, lineHeight: 1.6 }}><b>Access Key ID + Secret Access Key</b>. CLI/SDK용. Secret은 생성 시 한 번만 표시.</p></Card>
          <Card hov><Chip color={C.green} bg={C.greenBg}><Timer size={13} />임시 자격 증명</Chip><p style={{ fontSize: 13, color: C.inkSoft, marginTop: 8, lineHeight: 1.6 }}>STS 발급. Key + Secret + <b>SessionToken</b> + 만료. 역할 기반 접근에 사용.</p></Card>
        </TwoCol>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "16px 0" }}>
          {[
            [ShieldCheck, C.green, "최소 권한 원칙", "필요한 최소한의 권한만 부여. 넓게 주고 좁히지 말고, 좁게 시작해서 넓히기."],
            [Fingerprint, C.blue, "MFA 활성화", "특히 Root와 권한 큰 사용자. Condition으로 MFA 없으면 Deny도 가능."],
            [RefreshCw, C.gold, "키 대신 역할 사용", "EC2/Lambda에는 Access Key 하드코딩 금지 → IAM Role 사용. 키가 필요하면 정기적으로 순환(rotate)."],
            [AlertTriangle, C.red, "Root 사용 최소화", "Root는 계정 설정 등 극히 일부 작업에만. 나머지는 IAM 사용자/역할로."],
          ].map(([Ic, col, t, d], i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", background: C.panel, border: `1px solid ${C.line}`, borderRadius: 6, borderLeft: `4px solid ${col}` }}>
              <Ic size={18} color={col} style={{ marginTop: 2, flex: "none" }} />
              <div><b style={{ color: C.ink, fontSize: 13.5 }}>{t}</b><p style={{ fontSize: 13, color: C.inkSoft, margin: "3px 0 0", lineHeight: 1.55 }}>{d}</p></div>
            </div>
          ))}
        </div>
        <Note tone="green" title="점검 도구">IAM <b>Credential Report</b>(계정 전체 자격증명 상태 CSV)와 <b>Access Analyzer</b>(외부 공유 리소스 탐지), <b>IAM Policy Simulator</b>(정책 사전 테스트)를 기억해 두세요.</Note>
      </div>
    ),

    /* ---------- 08 EXAM ---------- */
    exam: (
      <div className="fade-in">
        <Eyebrow color={C.teal}>// 08 · DVA EXAM CHEAT SHEET</Eyebrow>
        <H2>시험 직전 핵심 정리</H2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "12px 0" }}>
          {[
            ["평가 규칙", "명시적 Deny > 명시적 Allow > 암묵적 Deny. Deny는 절대 못 이긴다.", C.red],
            ["EC2/Lambda 접근 오류", "거의 항상 IAM Role/실행 역할 문제. 키 하드코딩 대신 역할을 붙였는지 확인.", C.gold],
            ["교차 계정", "Resource-based 정책 또는 AssumeRole. 키를 공유하지 않는다.", C.blue],
            ["임시 자격 증명", "STS가 발급, 반드시 만료 O, SessionToken 포함. AssumeRole 계열 API 이름 암기.", C.green],
            ["글로벌 & 무료", "IAM은 리전 무관, 비용 없음.", C.violet],
            ["User vs Role", "User=영구 자격, Role=임시로 맡는 신원(자동 순환).", C.teal],
            ["ARN 형식", "arn:aws:service:region:account:resource — S3는 region/account 비움.", C.gold],
            ["Boundary/SCP", "권한을 '부여'하지 않고 '상한'만 설정. 유효권한 = 교집합.", C.red],
          ].map(([t, d, col], i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "13px 15px", background: C.panel, border: `1px solid ${C.line}`, borderRadius: 6 }}>
              <span className="iam-mono" style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: col, padding: "3px 8px", borderRadius: 4, whiteSpace: "nowrap", flex: "none", marginTop: 1 }}>{String(i + 1).padStart(2, "0")}</span>
              <div><b style={{ color: C.ink, fontSize: 14 }}>{t}</b><p style={{ fontSize: 13, color: C.inkSoft, margin: "3px 0 0", lineHeight: 1.55 }}>{d}</p></div>
            </div>
          ))}
        </div>
        <Note tone="blue" title="한 문장 요약">IAM = 인증(누구) + 인가(무엇). 권한은 JSON 정책으로 정의하고 User·Group·Role에 연결하며, 겹칠 땐 <b>Deny 우선</b>으로 판정한다. 앱/서비스에는 키 대신 <b>Role</b>을 준다.</Note>
      </div>
    ),
  };
  return S[active];
}

/* ============================ APP SHELL ============================ */
export default function App() {
  const [active, setActive] = useState("overview");
  return (
    <div className="iam-root" style={{ background: C.bg, minHeight: "100vh", backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`, backgroundSize: "28px 28px", color: C.ink }}>
      <Styles />
      {/* header */}
      <header style={{ background: "#0F1824", color: "#fff", padding: "22px 26px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ width: 46, height: 46, borderRadius: 8, background: C.gold, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
          <Shield size={26} color="#0F1824" />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div className="iam-disp" style={{ fontSize: 25, fontWeight: 700, lineHeight: 1 }}>AWS IAM 완전 정복</div>
          <div className="iam-mono" style={{ fontSize: 12, color: "#8FA6C2", marginTop: 6, letterSpacing: 1 }}>DEVELOPER ASSOCIATE (DVA) · 다이어그램으로 배우는 신원·접근 관리</div>
        </div>
        <div className="iam-mono" style={{ fontSize: 11, color: "#6E86A3", textAlign: "right" }}>Identity &amp;<br />Access Management</div>
      </header>

      <div className="iam-shell" style={{ display: "flex", alignItems: "flex-start", maxWidth: 1180, margin: "0 auto" }}>
        {/* nav */}
        <nav className="iam-nav" style={{ position: "sticky", top: 0, width: 234, flex: "none", padding: "18px 14px", alignSelf: "flex-start" }}>
          <div className="iam-navlist sec-scroll" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV.map((it) => {
              const on = active === it.id;
              const Ic = it.icon;
              return (
                <button key={it.id} className="navbtn" onClick={() => setActive(it.id)} style={{
                  display: "flex", alignItems: "center", gap: 10, textAlign: "left", cursor: "pointer",
                  background: on ? "#0F1824" : "transparent", color: on ? "#fff" : C.inkSoft,
                  border: `1px solid ${on ? "#0F1824" : "transparent"}`, borderRadius: 7, padding: "10px 12px", fontFamily: "inherit",
                }}>
                  <Ic size={16} color={on ? C.gold : C.inkFaint} style={{ flex: "none" }} />
                  <span className="iam-mono" style={{ fontSize: 10, opacity: 0.7, flex: "none" }}>{it.n}</span>
                  <span style={{ fontSize: 13.5, fontWeight: on ? 600 : 500 }}>{it.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* content */}
        <main style={{ flex: 1, minWidth: 0, padding: "26px 26px 60px" }}>
          <Sections active={active} />
        </main>
      </div>

      <footer style={{ borderTop: `1px solid ${C.line}`, padding: "18px 26px", textAlign: "center" }}>
        <span className="iam-mono" style={{ fontSize: 11, color: C.inkFaint }}>학습용 요약 자료 · 정확한 최신 스펙은 AWS 공식 문서를 확인하세요</span>
      </footer>
    </div>
  );
}
