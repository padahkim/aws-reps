//opus 4.8 max
import React, { useState, useEffect, useRef } from "react";
import {
  Database, KeyRound, Gauge, Braces, ShieldCheck, Layers, Code2, Lock,
  Zap, Activity, Timer, TerminalSquare, ArrowLeftRight, Users, Shuffle,
  PenLine, Boxes, Wrench, Shield, GraduationCap, Menu, X, ChevronRight,
  AlertTriangle, Lightbulb, Info, CheckCircle2, Signal,
} from "lucide-react";

/* ============================================================
   Design tokens & stylesheet
   Subject: AWS Developer Associate — DynamoDB study reference
   Look: "midnight developer console" — dark index rail + light
   blueprint content. Space Grotesk for Latin/technical display,
   Noto Sans KR for Korean, JetBrains Mono for API/keys/formulas.
   ============================================================ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;700;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

:root{
  --bg:#EBEEF4; --panel:#0C1322; --panel-2:#151F35; --panel-line:#22304F;
  --card:#FFFFFF; --ink:#0C1322; --ink-soft:#33405A; --muted:#6A7690;
  --line:#E1E6F0; --line-2:#EDF0F6;
  --brand:#4F46E5; --brand-2:#7C79F2; --brand-soft:#EEF0FF;
  --cyan:#0891B2; --cyan-soft:#E0F7FC; --cyan-2:#22B8D6;
  --rose:#E11D48; --rose-soft:#FEE7EC;
  --orange:#F97316; --amber:#F59E0B; --amber-soft:#FEF3E0;
  --sky:#0EA5E9; --slate:#64748B; --emerald:#0F9D6C; --emerald-soft:#E4F6EF;
  --font-display:'Space Grotesk','Noto Sans KR',sans-serif;
  --font-body:'Noto Sans KR','Space Grotesk',sans-serif;
  --font-mono:'JetBrains Mono',monospace;
}
*{box-sizing:border-box}
.ddb-root{background:var(--bg);color:var(--ink);font-family:var(--font-body);
  line-height:1.6;-webkit-font-smoothing:antialiased;min-height:100vh}
.ddb-root ::selection{background:var(--brand);color:#fff}

/* ---- layout ---- */
.app{display:flex;min-height:100vh}
.sidebar{width:288px;flex-shrink:0;background:var(--panel);color:#C6CFE0;
  height:100vh;position:fixed;left:0;top:0;overflow-y:auto;z-index:40;
  border-right:1px solid var(--panel-line)}
.sidebar::-webkit-scrollbar{width:8px}
.sidebar::-webkit-scrollbar-thumb{background:#25324F;border-radius:8px}
.content{margin-left:288px;flex:1;min-width:0}
.container{max-width:920px;margin:0 auto;padding:56px 40px 120px}

/* ---- brand ---- */
.brand{display:flex;align-items:center;gap:12px;padding:22px 22px 18px}
.brand-mark{width:40px;height:40px;border-radius:11px;flex-shrink:0;
  background:linear-gradient(150deg,var(--brand) 0%,var(--cyan-2) 100%);
  display:grid;place-items:center;color:#fff;
  box-shadow:0 6px 18px -6px rgba(79,70,229,.7)}
.brand-t1{font-family:var(--font-display);font-weight:700;font-size:16px;
  letter-spacing:-.01em;color:#fff;line-height:1.15}
.brand-t2{font-size:11px;color:#7F8CAB;font-weight:500;letter-spacing:.02em}

/* ---- nav ---- */
.nav{padding:6px 12px 30px}
.nav-group{margin-top:18px}
.nav-glabel{font-family:var(--font-display);font-size:10.5px;font-weight:600;
  letter-spacing:.14em;text-transform:uppercase;color:#59688A;
  padding:6px 12px 8px}
.nav-item{display:flex;align-items:center;gap:11px;width:100%;text-align:left;
  padding:9px 12px;border-radius:9px;border:none;background:transparent;
  color:#AEB8CE;cursor:pointer;font-family:var(--font-body);font-size:13.5px;
  transition:background .16s,color .16s;position:relative}
.nav-item:hover{background:var(--panel-2);color:#EAEFF8}
.nav-item.active{background:var(--panel-2);color:#fff}
.nav-item.active::before{content:"";position:absolute;left:0;top:8px;bottom:8px;
  width:3px;border-radius:3px;background:linear-gradient(var(--brand-2),var(--cyan-2))}
.nav-ic{flex-shrink:0;opacity:.85}
.nav-item.active .nav-ic{opacity:1}
.nav-tx{flex:1;min-width:0}
.nav-fq{display:flex;gap:2px;align-items:center}
.nav-fq i{width:3px;height:9px;border-radius:2px;background:#33415F;display:block}
.nav-fq i.on{background:var(--fqc,#7C79F2)}

/* ---- topbar (mobile) ---- */
.topbar{display:none;position:sticky;top:0;z-index:30;background:rgba(12,19,34,.94);
  backdrop-filter:blur(8px);color:#fff;align-items:center;gap:12px;
  padding:12px 16px;border-bottom:1px solid var(--panel-line)}
.topbar b{font-family:var(--font-display);font-weight:600;font-size:14px}
.iconbtn{width:38px;height:38px;border-radius:9px;border:1px solid var(--panel-line);
  background:var(--panel-2);color:#fff;display:grid;place-items:center;cursor:pointer}
.backdrop{display:none}

/* ---- headings ---- */
.eyebrow{display:inline-flex;align-items:center;gap:8px;font-family:var(--font-display);
  font-size:11.5px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;
  color:var(--brand);background:var(--brand-soft);padding:5px 11px;border-radius:20px}
.h1{font-family:var(--font-display);font-weight:700;font-size:38px;letter-spacing:-.02em;
  line-height:1.12;margin:18px 0 0}
.lead{font-size:16.5px;color:var(--ink-soft);margin:16px 0 0;max-width:70ch}
.h2{font-family:var(--font-display);font-weight:600;font-size:22px;letter-spacing:-.01em;
  margin:48px 0 4px;display:flex;align-items:center;gap:10px}
.h2 .bar{width:7px;height:22px;border-radius:3px;
  background:linear-gradient(var(--brand),var(--cyan))}
.h3{font-family:var(--font-display);font-weight:600;font-size:16px;margin:26px 0 8px;
  color:var(--ink)}
.p{margin:12px 0;color:var(--ink-soft);font-size:15px}
.p strong,.li strong{color:var(--ink);font-weight:700}
.ul{margin:12px 0;padding:0;list-style:none}
.li{position:relative;padding:5px 0 5px 22px;color:var(--ink-soft);font-size:15px}
.li::before{content:"";position:absolute;left:2px;top:13px;width:6px;height:6px;
  border-radius:2px;background:var(--brand)}
.li.c::before{background:var(--cyan)}

/* ---- code tokens ---- */
.kbd{font-family:var(--font-mono);font-size:.86em;background:#0C1322;color:#C7D0FF;
  padding:2px 7px;border-radius:6px;font-weight:500;white-space:nowrap}
.kbd.g{background:var(--emerald-soft);color:#0A7A54}
.kbd.a{background:var(--amber-soft);color:#B4690E}
.kbd.r{background:var(--rose-soft);color:#BE123C}
.mono-block{font-family:var(--font-mono);font-size:13px;background:#0C1322;color:#D7DEFB;
  border-radius:12px;padding:16px 18px;margin:14px 0;overflow-x:auto;line-height:1.7;
  border:1px solid #1B2740}
.mono-block .cm{color:#6E7BA6}
.mono-block .kw{color:#7CC0FF}
.mono-block .st{color:#8DE0B8}
.mono-block .fn{color:#F5B36B}

/* ---- cards & grids ---- */
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;
  padding:22px 24px;box-shadow:0 1px 2px rgba(16,24,40,.04)}
.grid{display:grid;gap:16px;margin:18px 0}
.g2{grid-template-columns:1fr 1fr}
.g3{grid-template-columns:1fr 1fr 1fr}
.mini{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px 20px}
.mini h4{font-family:var(--font-display);font-weight:600;font-size:14.5px;margin:0 0 6px;
  display:flex;align-items:center;gap:8px}
.mini p{margin:0;font-size:13.5px;color:var(--muted);line-height:1.55}

/* ---- callouts ---- */
.call{border-radius:14px;padding:16px 18px 16px 18px;margin:18px 0;
  display:flex;gap:13px;font-size:14.5px;line-height:1.6;border:1px solid}
.call .ci{flex-shrink:0;margin-top:1px}
.call .ct{flex:1;color:var(--ink-soft)}
.call .ct b{color:var(--ink)}
.call-tag{font-family:var(--font-display);font-weight:700;font-size:12px;
  letter-spacing:.04em;display:block;margin-bottom:3px}
.call.exam{background:var(--rose-soft);border-color:#F7C7D2}
.call.exam .ci,.call.exam .call-tag{color:var(--rose)}
.call.tip{background:var(--emerald-soft);border-color:#BDE9D6}
.call.tip .ci,.call.tip .call-tag{color:var(--emerald)}
.call.warn{background:var(--amber-soft);border-color:#F6DDA8}
.call.warn .ci,.call.warn .call-tag{color:#B4690E}
.call.key{background:var(--brand-soft);border-color:#D3D6FB}
.call.key .ci,.call.key .call-tag{color:var(--brand)}

/* ---- frequency banner ---- */
.freq{display:flex;align-items:center;gap:16px;margin:22px 0 6px;padding:14px 18px;
  border-radius:14px;background:#fff;border:1px solid var(--line)}
.freq-meter{display:flex;gap:4px;align-items:center}
.freq-meter i{width:8px;height:22px;border-radius:3px;background:#E6EAF2;display:block}
.freq-meter i.on{background:var(--fc)}
.freq-txt{display:flex;flex-direction:column}
.freq-lv{font-family:var(--font-display);font-weight:700;font-size:15px;color:var(--fc)}
.freq-sub{font-size:12px;color:var(--muted)}
.freq-note{font-size:13px;color:var(--ink-soft);border-left:1px solid var(--line);
  padding-left:16px;flex:1}

/* ---- comparison table ---- */
.tbl{width:100%;border-collapse:separate;border-spacing:0;margin:18px 0;font-size:13.5px;
  border:1px solid var(--line);border-radius:14px;overflow:hidden}
.tbl th{background:#0C1322;color:#EAEEF9;font-family:var(--font-display);font-weight:600;
  text-align:left;padding:12px 15px;font-size:13px}
.tbl th:first-child{background:#111A2D}
.tbl td{padding:12px 15px;border-top:1px solid var(--line);color:var(--ink-soft);
  vertical-align:top}
.tbl tr td:first-child{font-weight:600;color:var(--ink);background:#FAFBFE;
  font-size:13px}
.tbl .yes{color:var(--emerald);font-weight:700}
.tbl .no{color:var(--rose);font-weight:700}

/* ---- diagram frame ---- */
.dia{background:linear-gradient(180deg,#FBFCFE,#F4F6FB);border:1px solid var(--line);
  border-radius:16px;padding:20px;margin:20px 0}
.dia svg{width:100%;height:auto;display:block}
.dia-cap{font-size:12.5px;color:var(--muted);text-align:center;margin-top:12px;
  font-family:var(--font-display);letter-spacing:.01em}
.dia-cap b{color:var(--ink-soft)}
.flow{stroke-dasharray:5 5;animation:dash 1s linear infinite}
@keyframes dash{to{stroke-dashoffset:-20}}

/* section transition */
.enter{animation:fade .4s ease both}
@keyframes fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}

@media(max-width:900px){
  .sidebar{transform:translateX(-100%);transition:transform .28s cubic-bezier(.4,0,.2,1)}
  .sidebar.open{transform:none}
  .content{margin-left:0}
  .topbar{display:flex}
  .container{padding:28px 20px 90px}
  .h1{font-size:30px}
  .g2,.g3{grid-template-columns:1fr}
  .backdrop.show{display:block;position:fixed;inset:0;background:rgba(6,10,20,.5);z-index:35}
  .freq{flex-wrap:wrap}.freq-note{border-left:none;padding-left:0;flex-basis:100%}
}
`;

/* ============================================================
   Small presentational helpers
   ============================================================ */
const Tok = ({ children, t }) => <span className={`kbd ${t || ""}`}>{children}</span>;

function Callout({ type = "key", tag, children }) {
  const Icon = { exam: AlertTriangle, tip: CheckCircle2, warn: Lightbulb, key: Info }[type];
  const label = tag || { exam: "시험 포인트", tip: "핵심 정리", warn: "주의", key: "참고" }[type];
  return (
    <div className={`call ${type}`}>
      <Icon className="ci" size={19} />
      <div className="ct"><span className="call-tag">{label}</span>{children}</div>
    </div>
  );
}

const FQ = { 5: "#E11D48", 4: "#F97316", 3: "#F59E0B", 2: "#0EA5E9", 1: "#64748B" };
const FQL = { 5: "매우 높음", 4: "높음", 3: "보통", 2: "낮음", 1: "매우 낮음" };

function FreqBanner({ level, note }) {
  return (
    <div className="freq" style={{ "--fc": FQ[level] }}>
      <div className="freq-meter">
        {[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= level ? "on" : ""} />)}
      </div>
      <div className="freq-txt">
        <span className="freq-lv">빈출 {FQL[level]}</span>
        <span className="freq-sub">DVA-C02 출제 빈도 · 5단계</span>
      </div>
      <div className="freq-note">{note}</div>
    </div>
  );
}

const Dia = ({ children, cap }) => (
  <div className="dia">{children}{cap && <div className="dia-cap">{cap}</div>}</div>
);

/* small arrow head helper (avoids marker id collisions) */
function Arrow({ x1, y1, x2, y2, color = "#4F46E5", w = 2, flow, dashed }) {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const hx = x2 - 9 * Math.cos(ang), hy = y2 - 9 * Math.sin(ang);
  const s = 5;
  const p = `${x2},${y2} ${hx - s * Math.cos(ang - Math.PI / 2)},${hy - s * Math.sin(ang - Math.PI / 2)} ${hx - s * Math.cos(ang + Math.PI / 2)},${hy - s * Math.sin(ang + Math.PI / 2)}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={hx} y2={hy} stroke={color} strokeWidth={w}
        className={flow ? "flow" : ""} strokeDasharray={dashed && !flow ? "5 4" : undefined} />
      <polygon points={p} fill={color} />
    </g>
  );
}

/* ============================================================
   DIAGRAMS
   ============================================================ */

function DiaStructure() {
  return (
    <Dia cap={<>DynamoDB 테이블 구조 — <b>Table</b> ⟶ <b>Item</b>(행) ⟶ <b>Attribute</b>(속성)</>}>
      <svg viewBox="0 0 700 320">
        <rect x="18" y="14" width="664" height="292" rx="14" fill="#fff" stroke="#4F46E5" strokeWidth="2" />
        <text x="34" y="42" fontFamily="var(--font-mono)" fontSize="13" fontWeight="700" fill="#4F46E5">Table: Users</text>
        {/* header row */}
        <g fontFamily="var(--font-mono)" fontSize="11.5">
          <rect x="34" y="56" width="140" height="30" rx="6" fill="#EEF0FF" stroke="#C9CDF7" />
          <text x="46" y="75" fill="#4F46E5" fontWeight="700">user_id (PK)</text>
          <rect x="182" y="56" width="120" height="30" rx="6" fill="#E0F7FC" stroke="#B6E9F2" />
          <text x="194" y="75" fill="#0E7490" fontWeight="700">game (SK)</text>
          <rect x="310" y="56" width="110" height="30" rx="6" fill="#F5F7FB" stroke="#E1E6F0" />
          <text x="322" y="75" fill="#6A7690">score</text>
          <rect x="428" y="56" width="110" height="30" rx="6" fill="#F5F7FB" stroke="#E1E6F0" />
          <text x="440" y="75" fill="#6A7690">country</text>
          <rect x="546" y="56" width="120" height="30" rx="6" fill="#F5F7FB" stroke="#E1E6F0" />
          <text x="558" y="75" fill="#6A7690">level (선택)</text>
        </g>
        {/* item rows */}
        {[["u#100", "chess", "1420", "KR", "gold"], ["u#100", "poker", "980", "KR", "—"], ["u#205", "chess", "1610", "US", "plat"]].map((r, i) => (
          <g key={i} fontFamily="var(--font-mono)" fontSize="11.5" fill="#33405A">
            <rect x="34" y={98 + i * 40} width="632" height="34" rx="7"
              fill={i === 0 ? "#FBFBFF" : "#fff"} stroke="#EAEDF6" />
            <text x="46" y={119 + i * 40} fontWeight="600" fill="#4F46E5">{r[0]}</text>
            <text x="194" y={119 + i * 40} fontWeight="600" fill="#0E7490">{r[1]}</text>
            <text x="322" y={119 + i * 40}>{r[2]}</text>
            <text x="440" y={119 + i * 40}>{r[3]}</text>
            <text x="558" y={119 + i * 40}>{r[4]}</text>
          </g>
        ))}
        {/* labels */}
        <g fontFamily="var(--font-display)" fontSize="11.5" fontWeight="600">
          <line x1="670" y1="115" x2="690" y2="115" stroke="#94A3B8" strokeWidth="1.5" />
          <text x="0" y="0" fill="#6A7690" transform="translate(510,275)">↑ 각 행 = Item (JSON 문서, 최대 400KB)</text>
          <text x="34" y="275" fill="#6A7690">↑ 각 열 = Attribute · 항목마다 달라도 됨 (스키마리스)</text>
        </g>
      </svg>
    </Dia>
  );
}

function DiaKeys() {
  return (
    <Dia cap={<>기본 키(Primary Key) 두 가지 형태 — <b>단순 키</b> vs <b>복합 키</b></>}>
      <svg viewBox="0 0 700 300">
        {/* simple */}
        <text x="20" y="26" fontFamily="var(--font-display)" fontSize="13" fontWeight="700" fill="#0C1322">① 파티션 키만 (Simple)</text>
        <rect x="20" y="38" width="300" height="40" rx="9" fill="#EEF0FF" stroke="#4F46E5" strokeWidth="1.5" />
        <text x="40" y="63" fontFamily="var(--font-mono)" fontSize="12.5" fontWeight="700" fill="#4F46E5">Partition Key (HASH)</text>
        <text x="20" y="98" fontFamily="var(--font-body)" fontSize="11.5" fill="#6A7690">값이 고유해야 함 · 예: user_id</text>

        {/* composite */}
        <text x="20" y="140" fontFamily="var(--font-display)" fontSize="13" fontWeight="700" fill="#0C1322">② 파티션 키 + 정렬 키 (Composite)</text>
        <rect x="20" y="152" width="185" height="40" rx="9" fill="#EEF0FF" stroke="#4F46E5" strokeWidth="1.5" />
        <text x="38" y="177" fontFamily="var(--font-mono)" fontSize="12" fontWeight="700" fill="#4F46E5">Partition (HASH)</text>
        <rect x="213" y="152" width="160" height="40" rx="9" fill="#E0F7FC" stroke="#0891B2" strokeWidth="1.5" />
        <text x="231" y="177" fontFamily="var(--font-mono)" fontSize="12" fontWeight="700" fill="#0E7490">Sort (RANGE)</text>
        <text x="20" y="212" fontFamily="var(--font-body)" fontSize="11.5" fill="#6A7690">두 값의 조합이 고유 · 같은 파티션 키 안에서 정렬 저장 · 예: user_id + timestamp</text>

        {/* partitioning visual */}
        <g transform="translate(420,30)">
          <text x="0" y="0" fontFamily="var(--font-display)" fontSize="12.5" fontWeight="700" fill="#0C1322">파티션 분산</text>
          <rect x="0" y="14" width="120" height="34" rx="8" fill="#fff" stroke="#E1E6F0" />
          <text x="14" y="36" fontFamily="var(--font-mono)" fontSize="11" fill="#33405A">user_id = "u#7"</text>
          <text x="42" y="76" fontFamily="var(--font-mono)" fontSize="11" fill="#4F46E5" fontWeight="700">hash( )</text>
          <rect x="0" y="52" width="120" height="34" rx="8" fill="#F5F7FB" stroke="#E1E6F0" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={i * 90} y="110" width="76" height="130" rx="10" fill="#0C1322" />
              <text x={i * 90 + 38} y="130" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="#7C79F2" fontWeight="700">P{i + 1}</text>
              <rect x={i * 90 + 10} y="140" width="56" height="18" rx="4" fill="#1B2740" />
              <rect x={i * 90 + 10} y="164" width="56" height="18" rx="4" fill="#1B2740" />
              <rect x={i * 90 + 10} y="188" width="56" height="18" rx="4" fill="#1B2740" />
              <text x={i * 90 + 38} y="228" textAnchor="middle" fontFamily="var(--font-body)" fontSize="8.5" fill="#6A7690">≤10GB</text>
            </g>
          ))}
          <Arrow x1={38} y1={92} x2={110} y2={108} color="#4F46E5" w={1.6} />
        </g>
      </svg>
    </Dia>
  );
}

function DiaWCU() {
  const Ex = ({ q, calc, res }) => (
    <div style={{ background: "#fff", border: "1px solid #EDF0F6", borderRadius: 10, padding: "12px 14px" }}>
      <div style={{ fontSize: 12.5, color: "#33405A", marginBottom: 6 }}>{q}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "#0C1322" }}>{calc}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#4F46E5", fontWeight: 700, marginTop: 4 }}>= {res}</div>
    </div>
  );
  return (
    <Dia cap={<><b>WCU</b> 공식과 계산 예시 — 쓰기 용량 단위</>}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
        <div style={{ background: "linear-gradient(135deg,#4F46E5,#6D67E8)", borderRadius: 12, padding: "16px 18px", color: "#fff" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, letterSpacing: ".04em", opacity: .9 }}>1 WCU</div>
          <div style={{ fontSize: 15, marginTop: 4 }}>= <b>1 KB 이하</b> 항목을 <b>초당 1회</b> 쓰기</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 13.5, marginTop: 10, background: "rgba(255,255,255,.15)", padding: "8px 12px", borderRadius: 8 }}>
            WCU = (쓰기/초) × ⌈항목 KB⌉
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <Ex q="1KB 항목, 10회/초" calc="10 × ⌈1⌉" res="10 WCU" />
          <Ex q="2KB 항목, 10회/초" calc="10 × ⌈2⌉" res="20 WCU" />
          <Ex q="4.5KB 항목, 6회/초" calc="6 × ⌈4.5⌉ = 6×5" res="30 WCU" />
        </div>
      </div>
    </Dia>
  );
}

function DiaRCU() {
  const Ex = ({ q, calc, res, c }) => (
    <div style={{ background: "#fff", border: "1px solid #EDF0F6", borderRadius: 10, padding: "12px 14px" }}>
      <div style={{ fontSize: 12.5, color: "#33405A", marginBottom: 6 }}>{q}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "#0C1322" }}>{calc}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: c, fontWeight: 700, marginTop: 4 }}>= {res}</div>
    </div>
  );
  return (
    <Dia cap={<><b>RCU</b> 공식 — 강력한 일관성 읽기와 최종 일관성 읽기 비용 차이</>}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: "linear-gradient(135deg,#0891B2,#22B8D6)", borderRadius: 12, padding: "16px 18px", color: "#fff" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700 }}>강력한 일관성</div>
          <div style={{ fontSize: 14, marginTop: 4 }}>1 RCU = 4KB 이하 <b>초당 1회</b></div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, marginTop: 8, background: "rgba(255,255,255,.15)", padding: "7px 10px", borderRadius: 8 }}>(읽기/초) × ⌈KB/4⌉</div>
        </div>
        <div style={{ background: "linear-gradient(135deg,#0F9D6C,#2BB98A)", borderRadius: 12, padding: "16px 18px", color: "#fff" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700 }}>최종 일관성 (기본)</div>
          <div style={{ fontSize: 14, marginTop: 4 }}>1 RCU = 4KB 이하 <b>초당 2회</b></div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, marginTop: 8, background: "rgba(255,255,255,.15)", padding: "7px 10px", borderRadius: 8 }}>(읽기/초 ÷ 2) × ⌈KB/4⌉</div>
        </div>
        <Ex q="4KB, 강력 10회/초" calc="10 × ⌈4/4⌉" res="10 RCU" c="#0891B2" />
        <Ex q="4KB, 최종 10회/초" calc="(10÷2) × 1" res="5 RCU" c="#0F9D6C" />
        <Ex q="6KB, 강력 10회/초" calc="10 × ⌈6/4⌉ = 10×2" res="20 RCU" c="#0891B2" />
        <Ex q="6KB, 최종 10회/초" calc="(10÷2) × ⌈6/4⌉ = 5×2" res="10 RCU" c="#0F9D6C" />
      </div>
    </Dia>
  );
}

function DiaConsistency() {
  return (
    <Dia cap={<>쓰기 후 3개 복제본에 전파 — <b>최종 일관성</b>은 오래된 값을 읽을 수 있음</>}>
      <svg viewBox="0 0 700 250">
        <rect x="20" y="100" width="90" height="44" rx="10" fill="#4F46E5" />
        <text x="65" y="120" textAnchor="middle" fontFamily="var(--font-display)" fontSize="11.5" fill="#fff" fontWeight="600">Client</text>
        <text x="65" y="136" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9.5" fill="#C9CDF7">write X=5</text>
        {/* replicas */}
        {[["복제본 1", 40, "X=5", "#0F9D6C"], ["복제본 2", 100, "X=5", "#0F9D6C"], ["복제본 3", 160, "X=4", "#E11D48"]].map((r, i) => (
          <g key={i}>
            <rect x="330" y={r[1]} width="150" height="46" rx="10" fill="#fff" stroke={r[3]} strokeWidth="1.6" />
            <text x="348" y={r[1] + 21} fontFamily="var(--font-display)" fontSize="11.5" fill="#0C1322" fontWeight="600">{r[0]}</text>
            <text x="348" y={r[1] + 37} fontFamily="var(--font-mono)" fontSize="11" fill={r[3]} fontWeight="700">{r[2]}</text>
          </g>
        ))}
        <Arrow x1={112} y1={118} x2={328} y2={62} color="#94A3B8" w={1.5} />
        <Arrow x1={112} y1={122} x2={328} y2={122} color="#94A3B8" w={1.5} />
        <Arrow x1={112} y1={126} x2={328} y2={182} color="#94A3B8" w={1.5} dashed />
        <text x="470" y="30" fontFamily="var(--font-body)" fontSize="10.5" fill="#0F9D6C">복제 완료</text>
        <text x="490" y="230" fontFamily="var(--font-body)" fontSize="10.5" fill="#E11D48">아직 전파 안됨 (지연)</text>
        {/* legend */}
        <g transform="translate(500,110)">
          <rect x="0" y="0" width="180" height="30" rx="8" fill="#E4F6EF" stroke="#BDE9D6" />
          <text x="12" y="13" fontFamily="var(--font-body)" fontSize="9.5" fill="#0A7A54" fontWeight="700">강력한 일관성</text>
          <text x="12" y="24" fontFamily="var(--font-body)" fontSize="8.5" fill="#0A7A54">모든 복제본 반영 후 읽기 · 2× RCU</text>
          <rect x="0" y="36" width="180" height="30" rx="8" fill="#FEE7EC" stroke="#F7C7D2" />
          <text x="12" y="49" fontFamily="var(--font-body)" fontSize="9.5" fill="#BE123C" fontWeight="700">최종 일관성 (기본값)</text>
          <text x="12" y="60" fontFamily="var(--font-body)" fontSize="8.5" fill="#BE123C">아무 복제본 · 오래된 값 가능 · 저렴</text>
        </g>
      </svg>
    </Dia>
  );
}

function DiaQueryScan() {
  return (
    <Dia cap={<><b>Query</b>(파티션 지정, 효율) vs <b>Scan</b>(전체 읽기, 비쌈)</>}>
      <svg viewBox="0 0 700 210">
        {/* query */}
        <text x="20" y="22" fontFamily="var(--font-display)" fontSize="13" fontWeight="700" fill="#0F9D6C">Query — 파티션 키 지정</text>
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={20 + i * 44} y="36" width="38" height="120" rx="8"
            fill={i === 1 ? "#E4F6EF" : "#F5F7FB"} stroke={i === 1 ? "#0F9D6C" : "#E1E6F0"} strokeWidth={i === 1 ? 2 : 1} />
        ))}
        <text x="83" y="102" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="#0F9D6C" fontWeight="700">HIT</text>
        <text x="20" y="178" fontFamily="var(--font-body)" fontSize="11" fill="#6A7690">해당 파티션만 접근 → 빠르고 저렴</text>
        {/* scan */}
        <text x="380" y="22" fontFamily="var(--font-display)" fontSize="13" fontWeight="700" fill="#E11D48">Scan — 전체 테이블</text>
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={380 + i * 44} y="36" width="38" height="120" rx="8"
            fill="#FEE7EC" stroke="#E11D48" strokeWidth="1.6" />
        ))}
        <text x="446" y="102" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="#E11D48" fontWeight="700">ALL</text>
        <text x="380" y="178" fontFamily="var(--font-body)" fontSize="11" fill="#6A7690">모든 파티션 읽음 → RCU 대량 소모</text>
        <line x1="350" y1="20" x2="350" y2="170" stroke="#E1E6F0" strokeDasharray="4 4" />
      </svg>
    </Dia>
  );
}

function DiaIndex() {
  return (
    <Dia cap={<><b>LSI</b>(정렬 키만 변경, 생성 시 고정) vs <b>GSI</b>(파티션 키까지 변경, 언제든 추가)</>}>
      <svg viewBox="0 0 700 320">
        {/* base table */}
        <rect x="250" y="14" width="200" height="70" rx="12" fill="#0C1322" />
        <text x="350" y="40" textAnchor="middle" fontFamily="var(--font-display)" fontSize="13" fill="#fff" fontWeight="600">기본 테이블</text>
        <text x="350" y="60" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10.5" fill="#7C79F2">PK: user_id · SK: date</text>
        {/* LSI */}
        <rect x="40" y="150" width="260" height="150" rx="12" fill="#fff" stroke="#0891B2" strokeWidth="1.8" />
        <text x="58" y="176" fontFamily="var(--font-display)" fontSize="14" fill="#0891B2" fontWeight="700">LSI (로컬)</text>
        <g fontFamily="var(--font-body)" fontSize="11" fill="#33405A">
          <text x="58" y="200">· PK 동일 · <tspan fill="#0891B2" fontWeight="700">SK만 다르게</tspan></text>
          <text x="58" y="220">· 테이블 <tspan fill="#E11D48" fontWeight="700">생성 시에만</tspan> 정의 (최대 5개)</text>
          <text x="58" y="240">· 테이블 RCU/WCU <tspan fontWeight="700">공유</tspan></text>
          <text x="58" y="260">· <tspan fill="#0F9D6C" fontWeight="700">강력한 일관성 읽기 가능</tspan></text>
          <text x="58" y="280" fontFamily="var(--font-mono)" fontSize="10">SK → score</text>
        </g>
        {/* GSI */}
        <rect x="400" y="150" width="260" height="150" rx="12" fill="#fff" stroke="#4F46E5" strokeWidth="1.8" />
        <text x="418" y="176" fontFamily="var(--font-display)" fontSize="14" fill="#4F46E5" fontWeight="700">GSI (글로벌)</text>
        <g fontFamily="var(--font-body)" fontSize="11" fill="#33405A">
          <text x="418" y="200">· <tspan fill="#4F46E5" fontWeight="700">PK + SK 새로 지정</tspan></text>
          <text x="418" y="220">· <tspan fill="#0F9D6C" fontWeight="700">언제든 추가/삭제</tspan> 가능</text>
          <text x="418" y="240">· <tspan fontWeight="700">독립된 RCU/WCU</tspan> 보유</text>
          <text x="418" y="260">· 최종 일관성 읽기만</text>
          <text x="418" y="280" fontFamily="var(--font-mono)" fontSize="10">PK → country, SK → score</text>
        </g>
        <Arrow x1={280} y1={86} x2={170} y2={148} color="#0891B2" w={1.6} />
        <Arrow x1={420} y1={86} x2={530} y2={148} color="#4F46E5" w={1.6} />
      </svg>
    </Dia>
  );
}

function DiaOptLock() {
  return (
    <Dia cap={<>낙관적 잠금 — <b>version</b> 속성 + 조건부 쓰기로 동시 수정 충돌 방지</>}>
      <svg viewBox="0 0 700 260">
        {["Client A", "Client B"].map((c, i) => (
          <g key={i}>
            <rect x={i === 0 ? 20 : 540} y="20" width="140" height="34" rx="9" fill={i === 0 ? "#4F46E5" : "#0891B2"} />
            <text x={i === 0 ? 90 : 610} y="42" textAnchor="middle" fontFamily="var(--font-display)" fontSize="12" fill="#fff" fontWeight="600">{c}</text>
            <line x1={i === 0 ? 90 : 610} y1="54" x2={i === 0 ? 90 : 610} y2="240" stroke="#CBD3E4" strokeWidth="1.5" />
          </g>
        ))}
        <rect x="300" y="20" width="100" height="34" rx="9" fill="#0C1322" />
        <text x="350" y="42" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="#7C79F2" fontWeight="700">item v=1</text>
        <line x1="350" y1="54" x2="350" y2="240" stroke="#CBD3E4" strokeWidth="1.5" />

        <Arrow x1={92} y1={80} x2={348} y2={80} color="#4F46E5" w={1.5} />
        <text x="140" y="74" fontFamily="var(--font-mono)" fontSize="9.5" fill="#4F46E5">read (v=1)</text>
        <Arrow x1={608} y1={110} x2={352} y2={110} color="#0891B2" w={1.5} />
        <text x="440" y="104" fontFamily="var(--font-mono)" fontSize="9.5" fill="#0891B2">read (v=1)</text>

        <Arrow x1={92} y1={150} x2={348} y2={150} color="#4F46E5" w={2} />
        <text x="120" y="144" fontFamily="var(--font-mono)" fontSize="9.5" fill="#0F9D6C">update if v=1 → v=2 ✓</text>

        <Arrow x1={608} y1={195} x2={352} y2={195} color="#E11D48" w={2} />
        <text x="415" y="189" fontFamily="var(--font-mono)" fontSize="9.5" fill="#E11D48">update if v=1 → 실패 ✗</text>
        <text x="415" y="222" fontFamily="var(--font-body)" fontSize="10" fill="#E11D48">현재 v=2 이므로 조건 불일치</text>
      </svg>
    </Dia>
  );
}

function DiaDAX() {
  return (
    <Dia cap={<><b>DAX</b> — 애플리케이션과 DynamoDB 사이의 인메모리 캐시 (마이크로초 지연)</>}>
      <svg viewBox="0 0 700 200">
        <rect x="20" y="70" width="120" height="60" rx="12" fill="#4F46E5" />
        <text x="80" y="96" textAnchor="middle" fontFamily="var(--font-display)" fontSize="12.5" fill="#fff" fontWeight="600">애플리케이션</text>
        <text x="80" y="114" textAnchor="middle" fontFamily="var(--font-body)" fontSize="9.5" fill="#C9CDF7">코드 변경 최소</text>

        <rect x="280" y="50" width="150" height="100" rx="14" fill="#E0F7FC" stroke="#0891B2" strokeWidth="2" />
        <text x="355" y="80" textAnchor="middle" fontFamily="var(--font-display)" fontSize="14" fill="#0E7490" fontWeight="700">DAX 클러스터</text>
        <text x="355" y="100" textAnchor="middle" fontFamily="var(--font-body)" fontSize="10" fill="#0E7490">인메모리 캐시</text>
        <text x="355" y="118" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9.5" fill="#0891B2">기본 TTL 5분</text>
        <text x="355" y="134" textAnchor="middle" fontFamily="var(--font-body)" fontSize="9" fill="#0891B2">멀티 AZ · 최대 10노드</text>

        <rect x="560" y="70" width="120" height="60" rx="12" fill="#0C1322" />
        <text x="620" y="96" textAnchor="middle" fontFamily="var(--font-display)" fontSize="12.5" fill="#fff" fontWeight="600">DynamoDB</text>
        <text x="620" y="114" textAnchor="middle" fontFamily="var(--font-body)" fontSize="9.5" fill="#7C79F2">테이블</text>

        <Arrow x1={142} y1={100} x2={278} y2={100} color="#4F46E5" w={2} flow />
        <text x="165" y="90" fontFamily="var(--font-mono)" fontSize="9.5" fill="#0F9D6C">캐시 적중 → μs</text>
        <Arrow x1={432} y1={100} x2={558} y2={100} color="#0891B2" w={1.6} dashed />
        <text x="452" y="90" fontFamily="var(--font-mono)" fontSize="9.5" fill="#0891B2">미스 시에만</text>
      </svg>
    </Dia>
  );
}

function DiaStreams() {
  return (
    <Dia cap={<><b>DynamoDB Streams</b> — 항목 변경(생성/수정/삭제)을 24시간 보관하는 순서 스트림</>}>
      <svg viewBox="0 0 700 230">
        <rect x="20" y="80" width="120" height="60" rx="12" fill="#0C1322" />
        <text x="80" y="106" textAnchor="middle" fontFamily="var(--font-display)" fontSize="12" fill="#fff" fontWeight="600">DynamoDB</text>
        <text x="80" y="123" textAnchor="middle" fontFamily="var(--font-body)" fontSize="9" fill="#7C79F2">CRUD 발생</text>

        <rect x="230" y="70" width="150" height="80" rx="12" fill="#EEF0FF" stroke="#4F46E5" strokeWidth="2" />
        <text x="305" y="98" textAnchor="middle" fontFamily="var(--font-display)" fontSize="13" fill="#4F46E5" fontWeight="700">Stream</text>
        <text x="305" y="116" textAnchor="middle" fontFamily="var(--font-body)" fontSize="9.5" fill="#4F46E5">샤드로 구성 · 24h 보관</text>
        <text x="305" y="132" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8.5" fill="#7C79F2">활성화 이후 변경만</text>

        <g fontFamily="var(--font-display)" fontSize="11">
          <rect x="470" y="30" width="210" height="34" rx="9" fill="#fff" stroke="#0891B2" strokeWidth="1.5" />
          <text x="484" y="51" fill="#0E7490" fontWeight="600">Lambda (이벤트 소스 매핑)</text>
          <rect x="470" y="74" width="210" height="34" rx="9" fill="#fff" stroke="#E1E6F0" />
          <text x="484" y="95" fill="#33405A" fontWeight="600">Kinesis 어댑터 + KCL</text>
          <rect x="470" y="118" width="210" height="34" rx="9" fill="#fff" stroke="#E1E6F0" />
          <text x="484" y="139" fill="#33405A" fontWeight="600">교차 리전 복제 · 검색 색인</text>
        </g>
        <Arrow x1={142} y1={110} x2={228} y2={110} color="#4F46E5" w={2} flow />
        <Arrow x1={382} y1={100} x2={468} y2={47} color="#0891B2" w={1.6} />
        <Arrow x1={382} y1={110} x2={468} y2={91} color="#94A3B8" w={1.4} />
        <Arrow x1={382} y1={120} x2={468} y2={135} color="#94A3B8" w={1.4} />

        <g transform="translate(20,168)">
          <text x="0" y="0" fontFamily="var(--font-display)" fontSize="11" fontWeight="700" fill="#0C1322">보기 유형(View type)</text>
          {[["KEYS_ONLY", "#64748B"], ["NEW_IMAGE", "#0F9D6C"], ["OLD_IMAGE", "#F97316"], ["NEW_AND_OLD_IMAGES", "#4F46E5"]].map((v, i) => (
            <g key={i}>
              <rect x={i * 165} y="10" width="155" height="26" rx="7" fill="#fff" stroke={v[1]} strokeWidth="1.3" />
              <text x={i * 165 + 78} y="27" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9.5" fill={v[1]} fontWeight="700">{v[0]}</text>
            </g>
          ))}
        </g>
      </svg>
    </Dia>
  );
}

function DiaTTL() {
  return (
    <Dia cap={<><b>TTL</b> — 만료 시각(epoch) 속성을 두면 만료 후 48시간 내 자동 삭제 (WCU 무료)</>}>
      <svg viewBox="0 0 700 170">
        <rect x="20" y="55" width="170" height="60" rx="12" fill="#fff" stroke="#E1E6F0" />
        <text x="36" y="80" fontFamily="var(--font-mono)" fontSize="11" fill="#33405A">session#42</text>
        <text x="36" y="100" fontFamily="var(--font-mono)" fontSize="10.5" fill="#4F46E5" fontWeight="700">ttl = 1717000000</text>

        <rect x="270" y="45" width="160" height="80" rx="12" fill="#FEF3E0" stroke="#F59E0B" strokeWidth="1.8" />
        <text x="350" y="72" textAnchor="middle" fontFamily="var(--font-display)" fontSize="12.5" fill="#B4690E" fontWeight="700">만료 시각 경과</text>
        <text x="350" y="90" textAnchor="middle" fontFamily="var(--font-body)" fontSize="9.5" fill="#B4690E">읽기엔 아직 보일 수 있음</text>
        <text x="350" y="106" textAnchor="middle" fontFamily="var(--font-body)" fontSize="9" fill="#B4690E">→ 클라이언트가 필터링</text>

        <rect x="510" y="55" width="170" height="60" rx="12" fill="#E4F6EF" stroke="#0F9D6C" strokeWidth="1.8" />
        <text x="595" y="80" textAnchor="middle" fontFamily="var(--font-display)" fontSize="12" fill="#0A7A54" fontWeight="700">백그라운드 삭제</text>
        <text x="595" y="98" textAnchor="middle" fontFamily="var(--font-body)" fontSize="9.5" fill="#0A7A54">48h 이내 · 무료 · →Streams</text>

        <Arrow x1={192} y1={85} x2={268} y2={85} color="#F59E0B" w={1.8} />
        <Arrow x1={432} y1={85} x2={508} y2={85} color="#0F9D6C" w={1.8} />
      </svg>
    </Dia>
  );
}

function DiaTxn() {
  return (
    <Dia cap={<><b>트랜잭션</b> — 여러 항목/테이블을 all-or-nothing(ACID)으로 처리 · 용량 2배 소모</>}>
      <svg viewBox="0 0 700 190">
        <rect x="180" y="14" width="340" height="30" rx="8" fill="#4F46E5" />
        <text x="350" y="34" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="12" fill="#fff" fontWeight="600">TransactWriteItems</text>
        <rect x="40" y="65" width="180" height="55" rx="11" fill="#fff" stroke="#0F9D6C" strokeWidth="1.5" />
        <text x="130" y="88" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="#0A7A54">계좌 A − 100</text>
        <text x="130" y="106" textAnchor="middle" fontFamily="var(--font-body)" fontSize="9" fill="#0A7A54">성공</text>
        <rect x="260" y="65" width="180" height="55" rx="11" fill="#fff" stroke="#0F9D6C" strokeWidth="1.5" />
        <text x="350" y="88" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="#0A7A54">계좌 B + 100</text>
        <text x="350" y="106" textAnchor="middle" fontFamily="var(--font-body)" fontSize="9" fill="#0A7A54">성공</text>
        <rect x="480" y="65" width="180" height="55" rx="11" fill="#fff" stroke="#E11D48" strokeWidth="1.5" />
        <text x="570" y="88" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="#BE123C">로그 기록</text>
        <text x="570" y="106" textAnchor="middle" fontFamily="var(--font-body)" fontSize="9" fill="#BE123C">실패!</text>
        <Arrow x1={280} y1={44} x2={130} y2={63} color="#94A3B8" w={1.4} />
        <Arrow x1={350} y1={44} x2={350} y2={63} color="#94A3B8" w={1.4} />
        <Arrow x1={420} y1={44} x2={570} y2={63} color="#94A3B8" w={1.4} />
        <rect x="180" y="145" width="340" height="34" rx="9" fill="#FEE7EC" stroke="#E11D48" strokeWidth="1.5" />
        <text x="350" y="167" textAnchor="middle" fontFamily="var(--font-display)" fontSize="12" fill="#BE123C" fontWeight="700">하나라도 실패 → 전체 롤백 (아무것도 반영 안됨)</text>
        <Arrow x1={130} y1={120} x2={280} y2={143} color="#E11D48" w={1.3} dashed />
        <Arrow x1={350} y1={120} x2={350} y2={143} color="#E11D48" w={1.3} dashed />
        <Arrow x1={570} y1={120} x2={420} y2={143} color="#E11D48" w={1.6} />
      </svg>
    </Dia>
  );
}

function DiaSession() {
  return (
    <Dia cap={<>여러 웹 서버가 <b>공유 세션 저장소</b>로 DynamoDB 사용 (서버리스·확장성)</>}>
      <svg viewBox="0 0 700 190">
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={40 + i * 90} y="20" width="76" height="44" rx="10" fill="#4F46E5" />
            <text x={78 + i * 90} y="47" textAnchor="middle" fontFamily="var(--font-display)" fontSize="11" fill="#fff" fontWeight="600">Web {i + 1}</text>
            <Arrow x1={78 + i * 90} y1={64} x2={350} y2={110} color="#94A3B8" w={1.4} />
          </g>
        ))}
        <rect x="250" y="115" width="200" height="55" rx="12" fill="#0C1322" />
        <text x="350" y="140" textAnchor="middle" fontFamily="var(--font-display)" fontSize="13" fill="#fff" fontWeight="600">DynamoDB</text>
        <text x="350" y="158" textAnchor="middle" fontFamily="var(--font-body)" fontSize="9.5" fill="#7C79F2">세션 상태 저장 (TTL로 만료)</text>
        <g fontFamily="var(--font-body)" fontSize="10" fill="#6A7690">
          <text x="490" y="34" fontWeight="700" fill="#0C1322">비교 대안</text>
          <text x="490" y="54">· ElastiCache — 인메모리, 초저지연</text>
          <text x="490" y="72">· EFS — 공유 파일시스템(EC2)</text>
          <text x="490" y="90">· 인스턴스 메모리 — 공유 안됨 ✗</text>
          <text x="490" y="108">· S3 — 지연 큼, 소형 상태엔 부적합</text>
        </g>
      </svg>
    </Dia>
  );
}

function DiaSharding() {
  return (
    <Dia cap={<>쓰기 샤딩 — 카디널리티 낮은 파티션 키에 <b>접미사</b>를 붙여 핫 파티션 분산</>}>
      <svg viewBox="0 0 700 200">
        <text x="20" y="24" fontFamily="var(--font-display)" fontSize="12.5" fontWeight="700" fill="#E11D48">문제: 핫 파티션</text>
        <rect x="20" y="34" width="150" height="120" rx="12" fill="#FEE7EC" stroke="#E11D48" strokeWidth="2" />
        <text x="95" y="58" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10.5" fill="#BE123C" fontWeight="700">key = "cand#1"</text>
        {[0, 1, 2, 3].map((i) => <rect key={i} x="35" y={70 + i * 18} width="120" height="12" rx="3" fill="#F5A9BA" />)}
        <text x="95" y="172" textAnchor="middle" fontFamily="var(--font-body)" fontSize="9.5" fill="#BE123C">쓰기 몰림 → 스로틀</text>

        <Arrow x1={185} y1={95} x2={265} y2={95} color="#4F46E5" w={2} />
        <text x="200" y="86" fontFamily="var(--font-body)" fontSize="9" fill="#4F46E5">접미사 추가</text>

        <text x="290" y="24" fontFamily="var(--font-display)" fontSize="12.5" fontWeight="700" fill="#0F9D6C">해결: 샤딩</text>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={290 + i * 100} y="34" width="90" height="120" rx="11" fill="#E4F6EF" stroke="#0F9D6C" strokeWidth="1.5" />
            <text x={335 + i * 100} y="58" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9.5" fill="#0A7A54" fontWeight="700">cand#1_{i + 1}</text>
            <rect x={302 + i * 100} y="72" width="66" height="12" rx="3" fill="#9DDBC1" />
            <rect x={302 + i * 100} y="92" width="66" height="12" rx="3" fill="#9DDBC1" />
          </g>
        ))}
        <text x="490" y="172" textAnchor="middle" fontFamily="var(--font-body)" fontSize="9.5" fill="#0A7A54">쓰기 고르게 분산 (랜덤/계산 접미사)</text>
      </svg>
    </Dia>
  );
}

function DiaS3() {
  return (
    <Dia cap={<>S3 패턴 — ① 대용량 객체는 S3, DynamoDB엔 메타데이터+포인터 · ② S3 색인</>}>
      <svg viewBox="0 0 700 240">
        <text x="20" y="22" fontFamily="var(--font-display)" fontSize="12.5" fontWeight="700" fill="#0C1322">① 대용량 객체 패턴 (400KB 한도 우회)</text>
        <rect x="20" y="34" width="150" height="50" rx="11" fill="#0C1322" />
        <text x="95" y="55" textAnchor="middle" fontFamily="var(--font-display)" fontSize="11" fill="#fff" fontWeight="600">DynamoDB</text>
        <text x="95" y="72" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8.5" fill="#7C79F2">메타데이터 + s3_url</text>
        <rect x="280" y="34" width="150" height="50" rx="11" fill="#E4F6EF" stroke="#0F9D6C" strokeWidth="1.6" />
        <text x="355" y="55" textAnchor="middle" fontFamily="var(--font-display)" fontSize="11" fill="#0A7A54" fontWeight="700">S3</text>
        <text x="355" y="72" textAnchor="middle" fontFamily="var(--font-body)" fontSize="9" fill="#0A7A54">이미지·동영상·대용량 파일</text>
        <Arrow x1={172} y1={59} x2={278} y2={59} color="#0F9D6C" w={1.6} dashed />
        <text x="185" y="49" fontFamily="var(--font-body)" fontSize="9" fill="#0F9D6C">URL 참조</text>

        <line x1="20" y1="115" x2="680" y2="115" stroke="#E1E6F0" strokeDasharray="4 4" />

        <text x="20" y="146" fontFamily="var(--font-display)" fontSize="12.5" fontWeight="700" fill="#0C1322">② S3 객체 색인 패턴 (S3는 쿼리 불가 → 메타 검색)</text>
        <rect x="20" y="160" width="130" height="50" rx="11" fill="#E4F6EF" stroke="#0F9D6C" strokeWidth="1.6" />
        <text x="85" y="188" textAnchor="middle" fontFamily="var(--font-display)" fontSize="12" fill="#0A7A54" fontWeight="700">S3 업로드</text>
        <rect x="250" y="160" width="130" height="50" rx="11" fill="#FEF3E0" stroke="#F59E0B" strokeWidth="1.6" />
        <text x="315" y="188" textAnchor="middle" fontFamily="var(--font-display)" fontSize="12" fill="#B4690E" fontWeight="700">Lambda</text>
        <rect x="480" y="160" width="130" height="50" rx="11" fill="#0C1322" />
        <text x="545" y="182" textAnchor="middle" fontFamily="var(--font-display)" fontSize="11" fill="#fff" fontWeight="600">DynamoDB</text>
        <text x="545" y="199" textAnchor="middle" fontFamily="var(--font-body)" fontSize="8.5" fill="#7C79F2">날짜·이름으로 쿼리</text>
        <Arrow x1={152} y1={185} x2={248} y2={185} color="#F59E0B" w={1.6} />
        <text x="165" y="176" fontFamily="var(--font-body)" fontSize="8.5" fill="#F59E0B">이벤트</text>
        <Arrow x1={382} y1={185} x2={478} y2={185} color="#4F46E5" w={1.6} />
        <text x="395" y="176" fontFamily="var(--font-body)" fontSize="8.5" fill="#4F46E5">메타 기록</text>
      </svg>
    </Dia>
  );
}

/* ============================================================
   SECTION CONTENT
   ============================================================ */

const S_overview = () => (
  <>
    <FreqBanner level={3} note="DynamoDB는 DVA 시험에서 가장 비중 큰 서비스 중 하나. 개요 자체는 개념 이해용이지만, RDBMS와의 차이·완전관리형 특성은 상황형 문제 판단의 기반이 됩니다." />
    <p className="p">
      <strong>Amazon DynamoDB</strong>는 AWS가 제공하는 <strong>완전관리형(Serverless) NoSQL 키-값 및 문서 데이터베이스</strong>입니다.
      서버 프로비저닝 없이 사용하며, 대규모 트래픽에서도 한 자릿수 밀리초(single-digit millisecond) 지연을 제공하도록 설계됐습니다.
    </p>
    <DiaStructure />
    <h2 className="h2"><span className="bar" />핵심 특징</h2>
    <div className="grid g2">
      <div className="mini"><h4><CheckCircle2 size={16} color="#0F9D6C" />완전관리형·서버리스</h4><p>패치·확장·복제를 AWS가 처리. 수백만 TPS, 수백 TB, 초당 수조 회 요청까지 확장.</p></div>
      <div className="mini"><h4><CheckCircle2 size={16} color="#0F9D6C" />고가용성 다중 AZ</h4><p>데이터는 3개 AZ에 자동 복제되어 내구성과 가용성 확보.</p></div>
      <div className="mini"><h4><CheckCircle2 size={16} color="#0F9D6C" />스키마리스</h4><p>기본 키만 정의하면 항목마다 속성이 달라도 됨. 유연한 문서 저장.</p></div>
      <div className="mini"><h4><CheckCircle2 size={16} color="#0F9D6C" />IAM 통합·보안</h4><p>세밀한 접근 제어, 저장 시 암호화(KMS), VPC 엔드포인트 지원.</p></div>
    </div>
    <h2 className="h2"><span className="bar" />용어 매핑 (RDBMS ↔ DynamoDB)</h2>
    <table className="tbl">
      <thead><tr><th>RDBMS</th><th>DynamoDB</th><th>설명</th></tr></thead>
      <tbody>
        <tr><td>Table</td><td>Table</td><td>기본 키를 반드시 정의</td></tr>
        <tr><td>Row (행)</td><td>Item (항목)</td><td>JSON 문서 · <Tok t="a">최대 400KB</Tok></td></tr>
        <tr><td>Column (열)</td><td>Attribute (속성)</td><td>항목마다 존재/개수 달라도 됨</td></tr>
        <tr><td>Primary Key</td><td>Partition Key (+ Sort Key)</td><td>데이터 분산·정렬의 기준</td></tr>
      </tbody>
    </table>
    <Callout type="key">
      DynamoDB는 <b>수평 확장(파티션 분산)</b>에 최적화되어 있습니다. 관계형 JOIN·복잡한 트랜잭션 대신,
      <b> 접근 패턴을 먼저 정하고 그에 맞춰 테이블/키/인덱스를 설계</b>하는 것이 핵심 철학입니다.
    </Callout>
  </>
);

const S_keys = () => (
  <>
    <FreqBanner level={4} note="파티션 키 선택·핫 파티션·항목 크기 한도는 단골 주제. '어떤 키를 골라야 고르게 분산되는가'를 묻는 문제가 자주 나옵니다." />
    <p className="p">
      DynamoDB에서 <strong>기본 키(Primary Key)</strong>는 데이터를 어떻게 저장·분산·정렬할지 결정하는 가장 중요한 설계 요소입니다. 두 가지 형태가 있습니다.
    </p>
    <DiaKeys />
    <h2 className="h2"><span className="bar" />파티션 키 설계 원칙</h2>
    <ul className="ul">
      <li className="li"><strong>높은 카디널리티(다양한 값)</strong>를 가진 속성을 선택해야 트래픽이 여러 파티션에 고르게 분산됩니다.</li>
      <li className="li c">값이 소수에 집중되면 <strong>핫 파티션</strong>이 생겨 스로틀링이 발생합니다. (예: <Tok t="r">country=KR</Tok>처럼 편중된 키는 나쁨)</li>
      <li className="li">정렬 키를 쓰면 같은 파티션 키 내부에서 <Tok>begins_with</Tok>, <Tok>between</Tok> 등 범위 쿼리가 가능합니다.</li>
    </ul>
    <h2 className="h2"><span className="bar" />내부 파티션의 한계</h2>
    <table className="tbl">
      <thead><tr><th>항목</th><th>한도</th></tr></thead>
      <tbody>
        <tr><td>항목(Item) 크기</td><td><Tok t="a">최대 400KB</Tok></td></tr>
        <tr><td>파티션당 저장 용량</td><td>약 10GB</td></tr>
        <tr><td>파티션당 처리량</td><td>최대 3,000 RCU / 1,000 WCU</td></tr>
      </tbody>
    </table>
    <Callout type="exam">
      데이터가 <b>400KB를 넘는 경우</b>(이미지·동영상 등)는 <b>S3에 저장하고 DynamoDB에는 메타데이터+S3 링크</b>만 저장하는 패턴이 정답으로 자주 출제됩니다.
    </Callout>
  </>
);

const S_throughput = () => (
  <>
    <FreqBanner level={5} note="시험에서 거의 반드시 나오는 계산 문제. WCU/RCU 공식과 '강력한 vs 최종 일관성' 비용 차이, 트랜잭션 2배 규칙을 반드시 암기하세요." />
    <p className="p">
      DynamoDB는 <strong>용량 단위(Capacity Unit)</strong>로 처리량을 측정합니다. 프로비저닝 모드에서는 초당 필요한 <strong>WCU(쓰기)</strong>와 <strong>RCU(읽기)</strong>를 미리 지정합니다.
    </p>
    <DiaWCU />
    <DiaRCU />
    <Callout type="tip">
      계산 요령 — <b>WCU</b>: 항목 크기를 <b>1KB 단위로 올림</b> 후 초당 쓰기 수를 곱함. <b>RCU</b>: 항목 크기를 <b>4KB 단위로 올림</b>,
      강력한 일관성은 그대로, 최종 일관성은 <b>÷2</b>. <b>트랜잭션은 읽기·쓰기 모두 2배</b>.
    </Callout>

    <h2 className="h2"><span className="bar" />읽기 일관성 (Read Consistency)</h2>
    <DiaConsistency />
    <div className="grid g2">
      <div className="mini"><h4><Signal size={16} color="#0F9D6C" />최종 일관성 (기본값)</h4><p>방금 쓴 값이 아직 반영 안 된 복제본을 읽을 수 있음. 저렴(1 RCU=초당 2회). GetItem·Query·Scan의 기본 동작.</p></div>
      <div className="mini"><h4><Signal size={16} color="#0891B2" />강력한 일관성</h4><p>항상 최신 값을 읽음. 요청 시 <Tok>ConsistentRead=true</Tok> 지정. 비용 2배(1 RCU=초당 1회), 지연 약간 증가.</p></div>
    </div>

    <h2 className="h2"><span className="bar" />용량 모드 (Capacity Mode)</h2>
    <table className="tbl">
      <thead><tr><th>구분</th><th>프로비저닝 (Provisioned)</th><th>온디맨드 (On-Demand)</th></tr></thead>
      <tbody>
        <tr><td>용량 계획</td><td>RCU/WCU 미리 지정 (Auto Scaling 가능)</td><td>계획 불필요 · 자동</td></tr>
        <tr><td>과금</td><td>프로비저닝한 용량에 과금 (저렴)</td><td>요청당 과금(WRU/RRU) · 상대적으로 비쌈</td></tr>
        <tr><td>적합한 상황</td><td>예측 가능·꾸준한 트래픽</td><td>급변·예측 불가·신규 서비스</td></tr>
        <tr><td>스로틀</td><td>초과 시 발생 (버스트 용량 존재)</td><td>기본적으로 스로틀 없음</td></tr>
      </tbody>
    </table>
    <Callout type="warn">
      두 모드는 <b>24시간에 1회</b> 전환할 수 있습니다. 트래픽이 갑자기 튀는 이벤트라면 온디맨드가 안전, 꾸준하면 프로비저닝+Auto Scaling이 비용 효율적입니다.
    </Callout>

    <h2 className="h2"><span className="bar" />스로틀링 (Throttling)</h2>
    <p className="p">프로비저닝 용량을 초과하면 <Tok t="r">ProvisionedThroughputExceededException</Tok>이 발생합니다.</p>
    <ul className="ul">
      <li className="li"><strong>원인</strong>: 핫 파티션, 프로비저닝 용량 초과, 지나치게 큰 항목.</li>
      <li className="li c"><strong>해결</strong>: <Tok>지수 백오프(Exponential Backoff)</Tok> 재시도(SDK 기본 내장), 파티션 키 분산, 읽기 스로틀은 <Tok>DAX</Tok>로 완화.</li>
    </ul>
  </>
);

const S_api = () => (
  <>
    <FreqBanner level={4} note="Query와 Scan의 차이, GetItem의 ProjectionExpression, BatchWriteItem 한도 등이 자주 출제. 특히 'Scan은 비싸다'는 포인트가 정답 근거로 자주 쓰입니다." />
    <p className="p">DynamoDB의 데이터 조작 API는 크게 <strong>쓰기·읽기·배치·조회(Query/Scan)</strong>로 나뉩니다.</p>
    <h2 className="h2"><span className="bar" />쓰기 API</h2>
    <div className="grid g2">
      <div className="mini"><h4><PenLine size={16} color="#4F46E5" />PutItem</h4><p>항목 생성 또는 <b>완전 교체</b>. 같은 키가 있으면 덮어씀.</p></div>
      <div className="mini"><h4><PenLine size={16} color="#4F46E5" />UpdateItem</h4><p>일부 속성 수정 · <b>원자적 카운터</b>(SET x = x + 1)에 사용.</p></div>
      <div className="mini"><h4><PenLine size={16} color="#4F46E5" />DeleteItem</h4><p>단일 항목 삭제 · 조건부 삭제 가능.</p></div>
      <div className="mini"><h4><PenLine size={16} color="#4F46E5" />BatchWriteItem</h4><p>최대 <Tok t="a">25개</Tok> Put/Delete · 최대 16MB · <b>Update·트랜잭션 아님</b>.</p></div>
    </div>
    <h2 className="h2"><span className="bar" />읽기 API</h2>
    <div className="grid g2">
      <div className="mini"><h4><Database size={16} color="#0891B2" />GetItem</h4><p>기본 키로 단일 항목 조회 · 기본 최종 일관성 · <Tok>ProjectionExpression</Tok>으로 일부 속성만.</p></div>
      <div className="mini"><h4><Database size={16} color="#0891B2" />BatchGetItem</h4><p>여러 테이블에서 최대 <Tok t="a">100개</Tok>·16MB 병렬 조회.</p></div>
    </div>

    <h2 className="h2"><span className="bar" />Query vs Scan</h2>
    <DiaQueryScan />
    <table className="tbl">
      <thead><tr><th>구분</th><th>Query</th><th>Scan</th></tr></thead>
      <tbody>
        <tr><td>동작</td><td>파티션 키(=) 지정 + 정렬 키 조건</td><td>테이블 전체를 읽음</td></tr>
        <tr><td>정렬 키 연산</td><td>=, &lt;, &gt;, ≤, ≥, between, begins_with</td><td>해당 없음</td></tr>
        <tr><td>효율</td><td className="yes">효율적 · 저렴</td><td className="no">비효율 · RCU 대량</td></tr>
        <tr><td>반환 한도</td><td>1회 최대 1MB (페이지네이션)</td><td>1회 최대 1MB · Parallel Scan 가능</td></tr>
        <tr><td>필터</td><td colSpan={2}><Tok>FilterExpression</Tok>은 <b>읽은 뒤</b> 적용 → RCU 절약 안 됨</td></tr>
      </tbody>
    </table>
    <Callout type="exam">
      "테이블이 커서 Scan이 느리고 비싸다" → 답은 보통 <b>적절한 파티션 키로 Query</b>, 혹은 다른 접근 패턴을 위한 <b>GSI 생성</b>입니다.
      <b> FilterExpression은 소비 RCU를 줄이지 못한다</b>는 점도 함정으로 자주 나옵니다.
    </Callout>
  </>
);

const S_cond = () => (
  <>
    <FreqBanner level={3} note="조건부 쓰기 자체보다는 '동시 쓰기 충돌 방지'·'덮어쓰기 방지'·'낙관적 잠금'의 기반 개념으로 연결되어 출제됩니다." />
    <p className="p">
      <strong>조건부 쓰기(Conditional Write)</strong>는 지정한 조건이 <strong>참일 때만</strong> Put/Update/Delete를 수행합니다.
      조건이 거짓이면 쓰기가 거부되며, <strong>읽기 용량은 소모하지 않습니다</strong>.
    </p>
    <div className="mono-block">
<span className="cm"># 아이템이 아직 없을 때만 생성 (덮어쓰기 방지)</span>{"\n"}
<span className="kw">PutItem</span> ... <span className="fn">ConditionExpression</span>=<span className="st">"attribute_not_exists(user_id)"</span>{"\n\n"}
<span className="cm"># 재고가 0보다 클 때만 차감</span>{"\n"}
<span className="kw">UpdateItem</span> SET stock = stock - <span className="st">1</span>{"\n"}
  <span className="fn">ConditionExpression</span>=<span className="st">"stock &gt; :zero"</span>
    </div>
    <h2 className="h2"><span className="bar" />주요 조건 함수</h2>
    <div className="grid g2">
      <div className="mini"><h4><Braces size={16} color="#4F46E5" />존재 여부</h4><p><Tok>attribute_exists</Tok> · <Tok>attribute_not_exists</Tok></p></div>
      <div className="mini"><h4><Braces size={16} color="#4F46E5" />값 검사</h4><p><Tok>attribute_type</Tok> · <Tok>contains</Tok> · <Tok>begins_with</Tok> · <Tok>size</Tok></p></div>
      <div className="mini"><h4><Braces size={16} color="#4F46E5" />비교</h4><p><Tok>=</Tok> <Tok>&lt;</Tok> <Tok>&gt;</Tok> <Tok>between</Tok> <Tok>in</Tok></p></div>
      <div className="mini"><h4><Braces size={16} color="#4F46E5" />활용</h4><p>덮어쓰기 방지 · 원자적 재고 관리 · 낙관적 잠금(version)</p></div>
    </div>
    <Callout type="key">
      조건부 쓰기는 <b>동시성 제어의 기본 도구</b>입니다. 여러 클라이언트가 같은 항목을 동시에 수정하려 할 때, 조건을 걸어 <b>의도치 않은 덮어쓰기를 막습니다</b>.
      이것을 버전 번호와 결합한 것이 뒤에 나오는 <b>낙관적 잠금</b>입니다.
    </Callout>
  </>
);

const S_index = () => (
  <>
    <FreqBanner level={5} note="GSI vs LSI는 DynamoDB 최다 빈출 주제 중 하나. '나중에 추가 가능한가', '독립 처리량인가', '강력한 일관성 가능한가'를 정확히 구분해야 합니다." />
    <p className="p">
      기본 키가 아닌 다른 속성으로 효율적인 쿼리를 하려면 <strong>보조 인덱스(Secondary Index)</strong>가 필요합니다.
      두 종류가 있으며, 시험에서 그 차이를 집요하게 묻습니다.
    </p>
    <DiaIndex />
    <table className="tbl">
      <thead><tr><th>구분</th><th>LSI (로컬 보조 인덱스)</th><th>GSI (글로벌 보조 인덱스)</th></tr></thead>
      <tbody>
        <tr><td>키 구성</td><td>PK 동일 + <b>다른 정렬 키</b></td><td><b>새 파티션 키 + 정렬 키</b></td></tr>
        <tr><td>생성 시점</td><td className="no">테이블 생성 시에만 (변경 불가)</td><td className="yes">언제든 추가·삭제</td></tr>
        <tr><td>개수 제한</td><td>테이블당 최대 5개</td><td>테이블당 최대 20개(기본)</td></tr>
        <tr><td>처리량(RCU/WCU)</td><td>테이블과 <b>공유</b></td><td><b>독립적으로 프로비저닝</b></td></tr>
        <tr><td>읽기 일관성</td><td className="yes">강력한 일관성 가능</td><td className="no">최종 일관성만</td></tr>
      </tbody>
    </table>
    <Callout type="exam">
      가장 자주 나오는 함정 두 가지 —<br />
      ① <b>LSI는 테이블 생성 시에만</b> 만들 수 있습니다. 나중에 필요하면 <b>GSI</b>를 쓰거나 테이블을 다시 만들어야 합니다.<br />
      ② <b>GSI의 쓰기가 스로틀되면 기본 테이블의 쓰기도 스로틀</b>됩니다 → GSI의 WCU를 충분히 프로비저닝해야 합니다.
    </Callout>
    <h2 className="h2"><span className="bar" />속성 프로젝션 (Projection)</h2>
    <ul className="ul">
      <li className="li"><Tok>KEYS_ONLY</Tok> — 키만 인덱스에 복사 (가장 작음)</li>
      <li className="li c"><Tok>INCLUDE</Tok> — 키 + 지정한 일부 속성</li>
      <li className="li"><Tok>ALL</Tok> — 모든 속성 복사 (조회 빠르지만 저장·쓰기 비용↑)</li>
    </ul>
  </>
);

const S_partiql = () => (
  <>
    <FreqBanner level={2} note="비교적 낮은 빈도. 'SQL 문법으로 DynamoDB를 다루고 싶다'는 시나리오에서 정답으로 등장합니다." />
    <p className="p">
      <strong>PartiQL</strong>은 DynamoDB를 <strong>SQL과 유사한 문법</strong>으로 다루게 해주는 쿼리 언어입니다.
      기존 SQL에 익숙한 개발자가 API 대신 친숙한 구문을 쓸 수 있습니다.
    </p>
    <div className="mono-block">
<span className="kw">SELECT</span> * <span className="kw">FROM</span> Users <span className="kw">WHERE</span> user_id = <span className="st">'u#100'</span>{"\n"}
<span className="kw">INSERT INTO</span> Users <span className="kw">VALUE</span> {"{"} <span className="st">'user_id'</span>: <span className="st">'u#200'</span> {"}"}{"\n"}
<span className="kw">UPDATE</span> Users <span className="kw">SET</span> score = <span className="st">100</span> <span className="kw">WHERE</span> user_id = <span className="st">'u#100'</span>{"\n"}
<span className="kw">DELETE FROM</span> Users <span className="kw">WHERE</span> user_id = <span className="st">'u#100'</span>
    </div>
    <div className="grid g2">
      <div className="mini"><h4><Code2 size={16} color="#0F9D6C" />지원</h4><p>SELECT · INSERT · UPDATE · DELETE · 일부 배치 작업. 콘솔·CLI·API·SDK에서 사용.</p></div>
      <div className="mini"><h4><Code2 size={16} color="#E11D48" />제한</h4><p><b>JOIN 불가</b> · 여러 테이블 동시 쿼리 아님 · 내부적으로는 결국 Query/Scan으로 동작.</p></div>
    </div>
    <Callout type="key">PartiQL은 <b>문법의 편의</b>일 뿐, DynamoDB의 성능 특성(파티션 키 기반 조회가 유리, Scan은 비쌈)은 그대로 적용됩니다.</Callout>
  </>
);

const S_optlock = () => (
  <>
    <FreqBanner level={3} note="'동시 수정으로 데이터가 덮어써지는 것을 막으려면?' → 낙관적 잠금(버전 번호 + 조건부 쓰기)이 정답으로 나옵니다." />
    <p className="p">
      <strong>낙관적 잠금(Optimistic Locking)</strong>은 항목에 <strong>버전 번호(version) 속성</strong>을 두고,
      <strong>조건부 쓰기</strong>로 "내가 읽은 이후 아무도 바꾸지 않았을 때만" 갱신하도록 하는 동시성 제어 기법입니다.
    </p>
    <DiaOptLock />
    <ul className="ul">
      <li className="li">항목을 읽을 때 현재 <Tok>version</Tok> 값을 함께 가져옵니다.</li>
      <li className="li c">갱신 시 <Tok>ConditionExpression="version = :v"</Tok>를 걸고 동시에 version을 +1 합니다.</li>
      <li className="li">다른 클라이언트가 먼저 갱신해 version이 바뀌었다면 <strong>조건 불일치로 실패</strong> → 재시도합니다.</li>
    </ul>
    <Callout type="tip">
      AWS SDK의 DynamoDB Mapper에서는 <Tok>@DynamoDBVersionAttribute</Tok>로 이 동작을 자동화합니다.
      "여러 사용자가 같은 항목을 동시에 수정할 때 무결성 보장" 시나리오의 표준 답입니다.
    </Callout>
  </>
);

const S_dax = () => (
  <>
    <FreqBanner level={4} note="DAX vs ElastiCache 구분은 단골. '코드 변경 최소로 DynamoDB 읽기를 캐시' → DAX가 정답입니다." />
    <p className="p">
      <strong>DAX(DynamoDB Accelerator)</strong>는 DynamoDB 전용 <strong>완전관리형 인메모리 캐시</strong>입니다.
      캐시된 읽기는 <strong>마이크로초(microsecond)</strong> 지연으로 응답하며, 애플리케이션 코드를 거의 바꾸지 않아도 됩니다.
    </p>
    <DiaDAX />
    <div className="grid g2">
      <div className="mini"><h4><Zap size={16} color="#0891B2" />특징</h4><p>DynamoDB 호환 API라 코드 변경 최소 · 기본 캐시 TTL 5분 · 멀티 AZ(최대 10노드) · 암호화·VPC·IAM 지원.</p></div>
      <div className="mini"><h4><Zap size={16} color="#0891B2" />해결하는 문제</h4><p>핫 키로 인한 읽기 스로틀 · 반복 조회 부하 · 개별 객체 및 Query/Scan 결과 캐싱.</p></div>
    </div>
    <h2 className="h2"><span className="bar" />DAX vs ElastiCache</h2>
    <table className="tbl">
      <thead><tr><th>구분</th><th>DAX</th><th>ElastiCache</th></tr></thead>
      <tbody>
        <tr><td>대상</td><td>DynamoDB 전용</td><td>범용 캐시 (모든 소스)</td></tr>
        <tr><td>캐싱 단위</td><td>개별 항목 + Query/Scan 결과</td><td>집계·계산 결과 등 자유</td></tr>
        <tr><td>코드 변경</td><td className="yes">거의 없음</td><td className="no">애플리케이션 캐시 로직 필요</td></tr>
      </tbody>
    </table>
    <Callout type="exam">
      키워드로 구분: <b>"DynamoDB 읽기를 최소한의 코드 변경으로 가속"</b> → DAX. <b>"집계 결과·다른 소스까지 캐시"</b> → ElastiCache.
    </Callout>
  </>
);

const S_streams = () => (
  <>
    <FreqBanner level={4} note="Streams + Lambda로 '항목 변경에 반응'하는 아키텍처는 자주 출제. 보관 기간 24시간과 보기 유형(view type)을 기억하세요." />
    <p className="p">
      <strong>DynamoDB Streams</strong>는 테이블의 <strong>항목 수준 변경(생성·수정·삭제)을 순서대로 기록</strong>하는 스트림입니다.
      변경에 실시간으로 반응하는 이벤트 기반 아키텍처의 핵심입니다.
    </p>
    <DiaStreams />
    <h2 className="h2"><span className="bar" />핵심 사양</h2>
    <ul className="ul">
      <li className="li">보관 기간 <Tok t="a">24시간</Tok> · 내부적으로 샤드로 구성(자동 관리)</li>
      <li className="li c"><strong>활성화 이후 발생한 변경만</strong> 스트림에 들어감 (과거 데이터는 소급 안 됨)</li>
      <li className="li"><strong>소비자</strong>: Lambda(이벤트 소스 매핑) · Kinesis 어댑터 + KCL</li>
      <li className="li c"><strong>활용</strong>: 변경 반응(알림·집계), 교차 리전 복제, 검색 색인(OpenSearch), 파생 테이블</li>
    </ul>
    <h2 className="h2"><span className="bar" />스트림 보기 유형 (StreamViewType)</h2>
    <table className="tbl">
      <thead><tr><th>유형</th><th>스트림에 담기는 내용</th></tr></thead>
      <tbody>
        <tr><td><Tok>KEYS_ONLY</Tok></td><td>변경된 항목의 키만</td></tr>
        <tr><td><Tok>NEW_IMAGE</Tok></td><td>변경 후 항목 전체</td></tr>
        <tr><td><Tok>OLD_IMAGE</Tok></td><td>변경 전 항목 전체</td></tr>
        <tr><td><Tok>NEW_AND_OLD_IMAGES</Tok></td><td>변경 전·후 모두</td></tr>
      </tbody>
    </table>
    <Callout type="key">
      Kinesis Data Streams for DynamoDB(별도 통합)를 쓰면 <b>최대 1년</b> 보관과 대규모 스트리밍 처리가 가능합니다. 기본 Streams(24h)와 구분하세요.
    </Callout>
  </>
);

const S_ttl = () => (
  <>
    <FreqBanner level={3} note="세션·임시 데이터 자동 만료 시나리오에 등장. '48시간 이내 삭제', '삭제에 WCU 무료', '만료돼도 잠시 조회됨'이 함정 포인트." />
    <p className="p">
      <strong>TTL(Time To Live)</strong>은 항목에 <strong>만료 시각(Unix epoch 초)</strong>을 담은 속성을 지정하면,
      만료 후 DynamoDB가 <strong>자동으로 항목을 삭제</strong>하는 기능입니다.
    </p>
    <DiaTTL />
    <ul className="ul">
      <li className="li">삭제는 만료 시각 이후 <Tok t="a">48시간 이내</Tok> 백그라운드로 수행 (정확한 즉시 삭제 아님)</li>
      <li className="li c"><strong>삭제에 쓰기 용량(WCU)이 들지 않음 → 무료</strong></li>
      <li className="li">만료됐지만 아직 삭제 안 된 항목은 <strong>Query·Scan·GetItem에 여전히 보일 수 있음</strong> → 애플리케이션에서 필터링 필요</li>
      <li className="li c">TTL 삭제도 <strong>Streams로 전달</strong>되어 후처리(아카이빙 등) 가능</li>
    </ul>
    <Callout type="exam">
      "오래된 세션/로그를 자동 정리" → TTL. 단, <b>정확한 만료 시각 즉시 삭제를 보장하지 않으므로</b>, 만료 항목이 조회에 노출되면 안 되는 경우엔 <b>필터 조건을 반드시 추가</b>해야 합니다.
    </Callout>
  </>
);

const S_cli = () => (
  <>
    <FreqBanner level={2} note="CLI 자체 빈도는 낮지만 페이지네이션 옵션(--page-size vs --max-items) 차이가 가끔 출제됩니다." />
    <p className="p">DynamoDB CLI에서 알아두면 좋은 옵션들입니다. 특히 <strong>페이지네이션</strong> 관련 옵션 차이가 시험 포인트입니다.</p>
    <table className="tbl">
      <thead><tr><th>옵션</th><th>역할</th></tr></thead>
      <tbody>
        <tr><td><Tok>--projection-expression</Tok></td><td>반환할 속성만 지정</td></tr>
        <tr><td><Tok>--filter-expression</Tok></td><td>읽은 뒤 필터링(용량 절약 X)</td></tr>
        <tr><td><Tok>--page-size</Tok></td><td>전체를 다 가져오되 API 호출당 항목 수를 줄임 → <b>스로틀 방지</b></td></tr>
        <tr><td><Tok>--max-items</Tok></td><td>반환 항목 총 개수 제한 · <Tok>NextToken</Tok> 반환</td></tr>
        <tr><td><Tok>--starting-token</Tok></td><td>이전 <Tok>NextToken</Tok>부터 이어서 조회</td></tr>
      </tbody>
    </table>
    <Callout type="tip">
      <Tok>--page-size</Tok>는 <b>결과 양은 동일</b>하지만 내부적으로 여러 번 나눠 호출해 대량 요청으로 인한 스로틀을 피합니다.
      <Tok>--max-items</Tok>는 <b>실제 반환 개수</b>를 제한합니다. 이 둘의 차이가 함정입니다.
    </Callout>
  </>
);

const S_txn = () => (
  <>
    <FreqBanner level={3} note="'여러 항목/테이블을 원자적으로(all-or-nothing) 갱신' 시나리오에 등장. 용량 2배 소모가 계산 함정으로 나옵니다." />
    <p className="p">
      DynamoDB <strong>트랜잭션</strong>은 <strong>여러 항목·여러 테이블에 걸친 작업을 ACID(원자성)로</strong> 처리합니다.
      하나라도 실패하면 전부 롤백되어 <strong>부분 적용이 없습니다</strong>.
    </p>
    <DiaTxn />
    <div className="grid g2">
      <div className="mini"><h4><ArrowLeftRight size={16} color="#4F46E5" />TransactWriteItems</h4><p>Put·Update·Delete·ConditionCheck를 묶어 원자적으로 실행.</p></div>
      <div className="mini"><h4><ArrowLeftRight size={16} color="#0891B2" />TransactGetItems</h4><p>여러 항목을 일관된 스냅샷으로 읽음.</p></div>
    </div>
    <ul className="ul">
      <li className="li"><strong>용량 소모 2배</strong> — 트랜잭션 쓰기는 2×WCU, 읽기는 2×RCU (준비/커밋 단계).</li>
      <li className="li c">최대 <Tok t="a">100개 항목</Tok> 또는 4MB까지 한 트랜잭션에 포함.</li>
      <li className="li"><strong>활용</strong>: 금융 이체, 주문+재고 동시 갱신 등 <strong>여러 데이터가 함께 성공/실패해야 하는</strong> 경우.</li>
    </ul>
    <Callout type="exam">계산 문제에서 트랜잭션이 언급되면 <b>필요 용량을 2배로</b> 계산해야 합니다. 이 규칙을 놓치면 정확히 절반 값의 오답을 고르게 됩니다.</Callout>
  </>
);

const S_session = () => (
  <>
    <FreqBanner level={3} note="'상태 비저장 웹 서버들의 세션을 어디에 저장?' 유형에서 DynamoDB·ElastiCache·EFS를 구분하는 문제로 출제됩니다." />
    <p className="p">
      DynamoDB는 <strong>웹 애플리케이션의 세션 상태 저장소</strong>로 널리 쓰입니다.
      서버리스라 확장이 쉽고, TTL로 만료된 세션을 자동 정리할 수 있습니다.
    </p>
    <DiaSession />
    <table className="tbl">
      <thead><tr><th>저장소</th><th>특징</th><th>적합성</th></tr></thead>
      <tbody>
        <tr><td>DynamoDB</td><td>서버리스·확장성·TTL 만료·지속성</td><td className="yes">범용 세션 저장에 적합</td></tr>
        <tr><td>ElastiCache</td><td>인메모리·초저지연(sub-ms)</td><td className="yes">속도가 최우선일 때</td></tr>
        <tr><td>EFS</td><td>네트워크 공유 파일시스템(EC2 마운트)</td><td>파일 공유용 · 세션엔 드묾</td></tr>
        <tr><td>인스턴스 메모리</td><td>서버 로컬 저장</td><td className="no">여러 서버 간 공유 불가</td></tr>
        <tr><td>S3</td><td>객체 저장 · 지연 큼</td><td className="no">소형 세션엔 부적합</td></tr>
      </tbody>
    </table>
    <Callout type="key">시험 구분법: <b>초저지연이면 ElastiCache</b>, <b>서버리스·자동확장·TTL이면 DynamoDB</b>, <b>EC2 간 파일 공유면 EFS</b>.</Callout>
  </>
);

const S_shard = () => (
  <>
    <FreqBanner level={3} note="핫 파티션 해결책으로 '쓰기 샤딩(파티션 키에 접미사 추가)'이 정답으로 나옵니다. 대표 예시가 선거 후보 투표 집계입니다." />
    <p className="p">
      파티션 키의 <strong>카디널리티가 낮으면</strong>(값 종류가 적으면) 특정 파티션에 트래픽이 몰려 <strong>핫 파티션·스로틀링</strong>이 발생합니다.
      해결책은 <strong>쓰기 샤딩(Write Sharding)</strong>입니다.
    </p>
    <DiaSharding />
    <ul className="ul">
      <li className="li"><strong>랜덤 접미사</strong> — 파티션 키에 <Tok>_1</Tok>~<Tok>_N</Tok> 같은 무작위 숫자를 붙여 여러 파티션에 분산.</li>
      <li className="li c"><strong>계산된 접미사</strong> — 다른 속성을 해싱해 접미사를 결정(조회 시 재현 가능).</li>
      <li className="li">대표 예: 선거에서 후보가 몇 명뿐이라 <Tok t="r">candidate_id</Tok>로만 키를 잡으면 몰림 → 후보ID + 샤드번호로 분산.</li>
    </ul>
    <Callout type="tip">랜덤 접미사는 쓰기 분산엔 좋지만 <b>특정 항목을 다시 읽을 때 어느 샤드인지 알아야</b> 하므로, 조회 요구사항에 따라 랜덤/계산 방식을 선택합니다.</Callout>
  </>
);

const S_writes = () => (
  <>
    <FreqBanner level={3} note="쓰기 유형 4가지(동시·조건부·원자적·배치)를 구분하는 개념 정리 문제로 나옵니다." />
    <p className="p">DynamoDB의 쓰기 방식은 목적에 따라 네 가지로 정리됩니다.</p>
    <div className="grid g2">
      <div className="mini"><h4><PenLine size={16} color="#64748B" />동시 쓰기 (Concurrent)</h4><p>제어 없이 여러 쓰기가 동시에 오면 <b>마지막 쓰기가 이김</b>(last writer wins). 충돌 방지 장치 없음.</p></div>
      <div className="mini"><h4><ShieldCheck size={16} color="#4F46E5" />조건부 쓰기 (Conditional)</h4><p>조건이 참일 때만 수행. 덮어쓰기·중복 생성 방지.</p></div>
      <div className="mini"><h4><Zap size={16} color="#0891B2" />원자적 쓰기 (Atomic)</h4><p><Tok>UpdateItem</Tok>으로 <b>증가/감소</b>(SET x = x + 5). 동시 요청도 안전하게 누적.</p></div>
      <div className="mini"><h4><Boxes size={16} color="#0F9D6C" />배치 쓰기 (Batch)</h4><p><Tok>BatchWriteItem</Tok>으로 다수 Put/Delete를 한 번에(트랜잭션 아님).</p></div>
    </div>
    <Callout type="exam">
      <b>원자적 카운터</b>(조회수·재고 등)는 읽고-계산하고-쓰는 대신 <Tok>UpdateItem</Tok>의 증감을 쓰면 <b>경쟁 상태 없이</b> 처리됩니다.
      "동시 갱신에도 정확히 카운트" → 원자적 쓰기가 정답입니다.
    </Callout>
  </>
);

const S_s3 = () => (
  <>
    <FreqBanner level={3} note="대용량 객체(400KB 초과) 패턴은 자주 출제되는 정답. S3 색인 패턴도 서버리스 아키텍처 문제에서 등장합니다." />
    <p className="p">DynamoDB와 S3를 결합하는 대표 패턴 두 가지입니다.</p>
    <DiaS3 />
    <div className="grid g2">
      <div className="mini"><h4><Boxes size={16} color="#0F9D6C" />① 대용량 객체 패턴</h4><p>항목 한도 <b>400KB</b>를 넘는 파일은 S3에 저장하고, DynamoDB엔 메타데이터와 <b>S3 객체 URL</b>만 저장. 비용↓·성능↑.</p></div>
      <div className="mini"><h4><Boxes size={16} color="#0F9D6C" />② S3 객체 색인 패턴</h4><p>S3 자체는 풍부한 쿼리가 안 됨. 업로드 시 <b>S3 이벤트 → Lambda → DynamoDB에 메타 기록</b>해 날짜·이름 등으로 검색 가능하게.</p></div>
    </div>
    <Callout type="key">두 패턴 모두 핵심은 <b>"큰 것/원본은 S3, 검색 가능한 메타데이터는 DynamoDB"</b>라는 역할 분리입니다.</Callout>
  </>
);

const S_ops = () => (
  <>
    <FreqBanner level={2} note="테이블 복사·정리·백업 방식 선택 문제. 특히 백업(PITR vs 온디맨드)과 S3 내보내기가 가끔 출제됩니다." />
    <h2 className="h2"><span className="bar" />테이블 정리 (Cleanup)</h2>
    <table className="tbl">
      <thead><tr><th>방법</th><th>특징</th></tr></thead>
      <tbody>
        <tr><td>Scan + DeleteItem</td><td className="no">느리고 비쌈 · RCU/WCU 소모</td></tr>
        <tr><td>테이블 삭제 후 재생성</td><td className="yes">빠르고 저렴 (권장)</td></tr>
      </tbody>
    </table>
    <h2 className="h2"><span className="bar" />테이블 복사 (Copy)</h2>
    <ul className="ul">
      <li className="li"><strong>AWS Data Pipeline</strong> — EMR 기반으로 테이블 복사(전통적 방법).</li>
      <li className="li c"><strong>백업 후 새 테이블로 복원</strong> — 간단하고 성능 영향 없음.</li>
      <li className="li"><strong>Scan + PutItem</strong> — 직접 코드로 읽어 쓰기(세밀한 제어 필요 시).</li>
    </ul>
    <h2 className="h2"><span className="bar" />백업 & 내보내기</h2>
    <div className="grid g2">
      <div className="mini"><h4><Wrench size={16} color="#4F46E5" />PITR (지정 시점 복구)</h4><p>연속 백업 · 최근 <b>35일</b> 내 임의 시점으로 복구.</p></div>
      <div className="mini"><h4><Wrench size={16} color="#4F46E5" />온디맨드 백업</h4><p>전체 백업 · 삭제 전까지 보관 · <b>성능 영향 없음</b>.</p></div>
      <div className="mini"><h4><Wrench size={16} color="#0F9D6C" />S3로 내보내기</h4><p>PITR 기반 · <b>RCU 소모 없음</b> · Athena로 분석 가능.</p></div>
      <div className="mini"><h4><Wrench size={16} color="#0F9D6C" />S3에서 가져오기</h4><p>CSV/DynamoDB JSON 등 · <b>WCU 소모 없음</b>.</p></div>
    </div>
    <Callout type="tip">"운영 중인 테이블에 영향 없이 백업/분석" → 온디맨드 백업 또는 S3 내보내기(RCU 미소모)가 정답 근거입니다.</Callout>
  </>
);

const S_sec = () => (
  <>
    <FreqBanner level={3} note="IAM 세밀 접근제어(LeadingKeys)·저장 시 암호화·글로벌 테이블(Streams 필요)이 보안/멀티리전 문제로 출제됩니다." />
    <h2 className="h2"><span className="bar" />접근 제어 & 암호화</h2>
    <ul className="ul">
      <li className="li"><strong>IAM 세밀 접근 제어</strong> — <Tok>dynamodb:LeadingKeys</Tok>로 <b>파티션 키가 사용자 ID인 항목만</b> 접근 허용, <Tok>dynamodb:Attributes</Tok>로 <b>특정 속성만</b> 노출. Cognito/웹 자격 증명과 결합.</li>
      <li className="li c"><strong>저장 시 암호화</strong> — 기본 KMS 암호화. <strong>전송 중</strong>은 HTTPS.</li>
      <li className="li"><strong>VPC 엔드포인트</strong>(게이트웨이형) — 인터넷 없이 VPC 내부에서 DynamoDB 접근.</li>
    </ul>
    <h2 className="h2"><span className="bar" />글로벌 테이블 (Global Tables)</h2>
    <div className="grid g2">
      <div className="mini"><h4><Shield size={16} color="#4F46E5" />멀티 리전·멀티 액티브</h4><p>여러 리전에 양방향 복제 · 리전별 저지연 읽기/쓰기.</p></div>
      <div className="mini"><h4><AlertTriangle size={16} color="#F59E0B" />전제 조건</h4><p><b>DynamoDB Streams 활성화 필요</b> — 복제가 스트림 기반으로 동작.</p></div>
    </div>
    <h2 className="h2"><span className="bar" />개발·분석 통합</h2>
    <ul className="ul">
      <li className="li"><strong>DynamoDB Local</strong> — 로컬 개발·테스트용 오프라인 실행.</li>
      <li className="li c"><strong>분석/검색</strong> — S3 내보내기 후 Athena, Streams로 OpenSearch 색인, EMR·Glue·Redshift 연동.</li>
      <li className="li"><strong>모니터링</strong> — CloudWatch 지표, Contributor Insights로 핫 키 탐지.</li>
    </ul>
    <Callout type="exam">
      두 가지를 꼭 기억: ① <b>사용자별로 자기 데이터만 접근</b> → IAM <Tok>LeadingKeys</Tok> 조건.
      ② <b>멀티 리전 활성-활성 복제(글로벌 테이블)</b>에는 <b>Streams가 필요</b>합니다.
    </Callout>
  </>
);

const S_cheat = () => (
  <>
    <FreqBanner level={5} note="아래는 DVA 시험에서 반복 출제되는 DynamoDB 핵심을 압축한 요약입니다. 시험 직전 이 표만 훑어도 큰 도움이 됩니다." />
    <p className="p">지금까지 개념을 <strong>시험 관점에서 다시 압축</strong>했습니다. 가장 자주 정답 근거가 되는 사실들입니다.</p>
    <table className="tbl">
      <thead><tr><th>주제</th><th>반드시 기억할 것</th></tr></thead>
      <tbody>
        <tr><td>WCU</td><td>(쓰기/초) × ⌈KB⌉ · <b>1KB 단위 올림</b></td></tr>
        <tr><td>RCU</td><td>강력=（읽기/초)×⌈KB/4⌉ · 최종=그것의 <b>절반</b> · <b>4KB 단위 올림</b></td></tr>
        <tr><td>트랜잭션</td><td>읽기·쓰기 용량 <b>2배</b> 소모</td></tr>
        <tr><td>기본 읽기</td><td><b>최종 일관성</b>이 기본 · 강력한 일관성은 요청 시 지정(2× RCU)</td></tr>
        <tr><td>LSI</td><td><b>테이블 생성 시에만</b> · 정렬 키만 변경 · 처리량 공유 · 강력 일관성 가능</td></tr>
        <tr><td>GSI</td><td><b>언제든 추가</b> · PK+SK 새로 · <b>독립 처리량</b> · 최종 일관성만 · 스로틀 시 <b>본 테이블 쓰기도 스로틀</b></td></tr>
        <tr><td>Scan</td><td>전체 읽어 비쌈 · FilterExpression은 RCU 절약 안 함</td></tr>
        <tr><td>DAX</td><td>DynamoDB 읽기 캐시 · <b>코드 변경 최소</b> · μs 지연 (vs ElastiCache=범용)</td></tr>
        <tr><td>Streams</td><td>변경 스트림 · <b>24h 보관</b> · view type 4종 · Lambda 트리거</td></tr>
        <tr><td>TTL</td><td>만료 후 <b>48h 내 삭제</b> · <b>WCU 무료</b> · 만료 항목 잠시 조회됨(필터 필요)</td></tr>
        <tr><td>낙관적 잠금</td><td>version 속성 + <b>조건부 쓰기</b>로 동시 수정 충돌 방지</td></tr>
        <tr><td>대용량 객체</td><td>400KB 초과 → <b>S3 저장 + DynamoDB 메타/포인터</b></td></tr>
        <tr><td>세션 저장</td><td>서버리스·TTL=DynamoDB / 초저지연=ElastiCache / EC2 공유=EFS</td></tr>
        <tr><td>핫 파티션</td><td>고카디널리티 키 · 또는 <b>쓰기 샤딩(접미사)</b></td></tr>
        <tr><td>IAM</td><td><Tok>dynamodb:LeadingKeys</Tok>로 사용자별 항목 제한</td></tr>
        <tr><td>글로벌 테이블</td><td>멀티 리전 활성-활성 · <b>Streams 필요</b></td></tr>
        <tr><td>용량 모드</td><td>예측 가능=프로비저닝 / 급변=온디맨드 · <b>전환 24h 1회</b></td></tr>
      </tbody>
    </table>
    <Callout type="tip">
      계산 문제 3단계: ① 항목 크기를 단위(쓰기 1KB·읽기 4KB)로 <b>올림</b> → ② 초당 횟수 곱하기 → ③ 최종 일관성이면 <b>÷2</b>, 트랜잭션이면 <b>×2</b>. 순서대로 적용하면 실수하지 않습니다.
    </Callout>
  </>
);

/* ============================================================
   NAV STRUCTURE
   ============================================================ */
const GROUPS = [
  {
    group: "기초", items: [
      { id: "overview", title: "DynamoDB 개요", icon: Database, level: 3, C: S_overview },
      { id: "keys", title: "키 · 파티션 구조", icon: KeyRound, level: 4, C: S_keys },
    ],
  },
  {
    group: "처리량 & API", items: [
      { id: "throughput", title: "WCU · RCU 처리량", icon: Gauge, level: 5, C: S_throughput },
      { id: "api", title: "기본 API · Query/Scan", icon: Braces, level: 4, C: S_api },
      { id: "cond", title: "조건부 쓰기", icon: ShieldCheck, level: 3, C: S_cond },
    ],
  },
  {
    group: "인덱스 & 쿼리", items: [
      { id: "index", title: "인덱스 GSI + LSI", icon: Layers, level: 5, C: S_index },
      { id: "partiql", title: "PartiQL", icon: Code2, level: 2, C: S_partiql },
    ],
  },
  {
    group: "동시성 & 성능", items: [
      { id: "optlock", title: "낙관적 잠금", icon: Lock, level: 3, C: S_optlock },
      { id: "dax", title: "DAX 캐시", icon: Zap, level: 4, C: S_dax },
    ],
  },
  {
    group: "이벤트 & 수명주기", items: [
      { id: "streams", title: "DynamoDB Streams", icon: Activity, level: 4, C: S_streams },
      { id: "ttl", title: "TTL 자동 만료", icon: Timer, level: 3, C: S_ttl },
    ],
  },
  {
    group: "고급 작업", items: [
      { id: "cli", title: "CLI 옵션", icon: TerminalSquare, level: 2, C: S_cli },
      { id: "txn", title: "트랜잭션", icon: ArrowLeftRight, level: 3, C: S_txn },
    ],
  },
  {
    group: "아키텍처 패턴", items: [
      { id: "session", title: "세션 상태 저장", icon: Users, level: 3, C: S_session },
      { id: "shard", title: "파티셔닝 전략", icon: Shuffle, level: 3, C: S_shard },
      { id: "writes", title: "쓰기 유형 정리", icon: PenLine, level: 3, C: S_writes },
      { id: "s3", title: "S3 결합 패턴", icon: Boxes, level: 3, C: S_s3 },
    ],
  },
  {
    group: "운영 & 보안", items: [
      { id: "ops", title: "운영 작업", icon: Wrench, level: 2, C: S_ops },
      { id: "sec", title: "보안 & 기타", icon: Shield, level: 3, C: S_sec },
    ],
  },
  {
    group: "마무리", items: [
      { id: "cheat", title: "시험 요약 치트시트", icon: GraduationCap, level: 5, C: S_cheat },
    ],
  },
];
const ALL = GROUPS.flatMap((g) => g.items);

/* ============================================================
   APP
   ============================================================ */
export default function App() {
  const [active, setActive] = useState("overview");
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);

  const item = ALL.find((i) => i.id === active) || ALL[0];
  const idx = ALL.findIndex((i) => i.id === active);
  const Body = item.C;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [active]);

  const go = (id) => { setActive(id); setOpen(false); };

  return (
    <div className="ddb-root">
      <style>{CSS}</style>
      <div className="app">
        {/* ---------- Sidebar ---------- */}
        <aside className={`sidebar ${open ? "open" : ""}`}>
          <div className="brand">
            <div className="brand-mark"><Database size={21} /></div>
            <div>
              <div className="brand-t1">DynamoDB 마스터</div>
              <div className="brand-t2">AWS 개발자 어소시에이트 · DVA-C02</div>
            </div>
          </div>
          <nav className="nav">
            {GROUPS.map((g) => (
              <div className="nav-group" key={g.group}>
                <div className="nav-glabel">{g.group}</div>
                {g.items.map((it) => {
                  const Ic = it.icon;
                  return (
                    <button key={it.id} className={`nav-item ${active === it.id ? "active" : ""}`}
                      onClick={() => go(it.id)} style={{ "--fqc": FQ[it.level] }}>
                      <Ic className="nav-ic" size={17} />
                      <span className="nav-tx">{it.title}</span>
                      <span className="nav-fq">
                        {[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= it.level ? "on" : ""} />)}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>
        <div className={`backdrop ${open ? "show" : ""}`} onClick={() => setOpen(false)} />

        {/* ---------- Content ---------- */}
        <div className="content" ref={scrollRef}>
          <div className="topbar">
            <button className="iconbtn" onClick={() => setOpen((v) => !v)} aria-label="메뉴">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
            <b>{item.title}</b>
          </div>

          <main className="container">
            <div className="enter" key={active}>
              <span className="eyebrow"><item.icon size={13} />{GROUPS.find((g) => g.items.includes(item)).group}</span>
              <h1 className="h1">{item.title}</h1>
              <Body />

              {/* prev / next */}
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 56, flexWrap: "wrap" }}>
                {idx > 0 ? (
                  <button onClick={() => go(ALL[idx - 1].id)} style={navBtn}>
                    <ChevronRight size={16} style={{ transform: "rotate(180deg)" }} />
                    <span style={{ textAlign: "left" }}><span style={navBtnL}>이전</span><br /><b>{ALL[idx - 1].title}</b></span>
                  </button>
                ) : <span />}
                {idx < ALL.length - 1 ? (
                  <button onClick={() => go(ALL[idx + 1].id)} style={{ ...navBtn, marginLeft: "auto" }}>
                    <span style={{ textAlign: "right" }}><span style={navBtnL}>다음</span><br /><b>{ALL[idx + 1].title}</b></span>
                    <ChevronRight size={16} />
                  </button>
                ) : <span />}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

const navBtn = {
  display: "flex", alignItems: "center", gap: 10, background: "#fff",
  border: "1px solid var(--line)", borderRadius: 12, padding: "12px 18px",
  cursor: "pointer", color: "var(--ink)", fontFamily: "var(--font-body)",
  fontSize: 14, maxWidth: 260,
};
const navBtnL = { fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-display)", letterSpacing: ".05em" };
