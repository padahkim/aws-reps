//fable 5 max

import React, { useState } from "react";

/* ── AWS DVA · CloudFormation 개념 총정리 (강의 198–215, 실습 제외) ── */

const css = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;700&family=IBM+Plex+Mono:wght@400;600&display=swap');
:root{
  --ink:#22303C; --ink-deep:#1B242D; --sub:#5A6874; --faint:#8A97A3;
  --paper:#F4F6F5; --panel:#FFFFFF; --line:#E1E6E4; --soft:#EEF2F0;
  --mag:#CF2F6E; --mag-deep:#A81E55; --mag-tint:#FBEDF3; --mag-line:#F2CBDB;
  --code-bg:#202A33; --code-tx:#E9EEF2;
  --mono:'IBM Plex Mono',ui-monospace,SFMono-Regular,Consolas,monospace;
}
*{margin:0;padding:0;box-sizing:border-box}
.page{font-family:'IBM Plex Sans KR',-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;background:var(--paper);color:var(--ink);line-height:1.68;font-size:15.5px;min-height:100vh;-webkit-text-size-adjust:100%}
.page a:focus-visible,.page input:focus-visible{outline:2px solid var(--mag);outline-offset:2px;border-radius:6px}
.wrap{max-width:880px;margin:0 auto;padding:0 20px 64px}
/* hero */
.hero{background:var(--ink-deep);color:#fff;position:relative;overflow:hidden}
.hero::after{content:"AWS::CloudFormation::Stack";position:absolute;right:-30px;bottom:-14px;font-family:var(--mono);font-weight:600;font-size:56px;letter-spacing:-.02em;color:rgba(255,255,255,.05);white-space:nowrap;pointer-events:none}
.hero-in{max-width:880px;margin:0 auto;padding:44px 20px 40px;position:relative;display:flex;gap:28px;align-items:center;justify-content:space-between;flex-wrap:wrap}
.eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.14em;color:#EE8FB4;text-transform:uppercase;margin-bottom:12px}
.hero h1{font-size:clamp(26px,4.6vw,38px);font-weight:700;letter-spacing:-.015em;line-height:1.25}
.hero p{margin-top:12px;color:#B8C4CC;font-size:14.5px;max-width:560px}
.stack-glyph{flex:0 0 auto;display:flex;flex-direction:column;align-items:center;gap:7px;padding-right:8px}
.stack-glyph span{display:block;height:15px;border-radius:5px;background:#3A4956;opacity:0;transform:translateY(14px);animation:rise .6s ease forwards}
.stack-glyph span:nth-child(1){width:76px;background:var(--mag);animation-delay:.55s}
.stack-glyph span:nth-child(2){width:104px;animation-delay:.35s}
.stack-glyph span:nth-child(3){width:132px;animation-delay:.15s}
@keyframes rise{to{opacity:1;transform:translateY(0)}}
@media (prefers-reduced-motion:reduce){.stack-glyph span{animation:none;opacity:1;transform:none}}
/* legend & toc */
.legend{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px 18px;margin:24px 0 14px;display:flex;gap:18px;flex-wrap:wrap;align-items:center}
.legend .fx{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--sub)}
.legend small{flex-basis:100%;color:var(--faint);font-size:12.5px;line-height:1.55}
.toc{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 30px}
.toc a{font-family:var(--mono);font-size:12px;border:1px solid var(--line);background:var(--panel);padding:6px 11px;border-radius:999px;color:var(--ink);text-decoration:none;transition:border-color .15s,color .15s}
.toc a:hover{border-color:var(--mag);color:var(--mag)}
/* sections */
section.card{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:24px 24px 20px;margin:0 0 22px;scroll-margin-top:16px}
.shead{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--soft)}
.lect{font-family:var(--mono);font-size:11px;letter-spacing:.08em;background:var(--soft);color:var(--sub);padding:4px 9px;border-radius:7px;white-space:nowrap}
.shead h2{font-size:19.5px;font-weight:700;letter-spacing:-.01em}
.freq{margin-left:auto;display:flex;align-items:center;gap:9px}
.freq.bare{margin:0}
.bars{display:flex;flex-direction:column-reverse;align-items:center;gap:2px}
.bars i{display:block;height:5px;border-radius:2px;background:#E0E6E4}
.bars i:nth-child(1){width:22px}.bars i:nth-child(2){width:17px}.bars i:nth-child(3){width:12px}
.freq[data-l="1"] i:nth-child(-n+1),.freq[data-l="2"] i:nth-child(-n+2),.freq[data-l="3"] i:nth-child(-n+3){background:var(--mag)}
.freq em{font-style:normal;font-family:var(--mono);font-size:11.5px;color:var(--sub);white-space:nowrap}
h3{font-size:15px;font-weight:700;margin:18px 0 8px;color:var(--ink)}
ul.pts{list-style:none;margin:8px 0}
ul.pts li{position:relative;padding-left:19px;margin:7px 0;font-size:14.8px}
ul.pts li::before{content:"";position:absolute;left:0;top:.66em;width:9px;height:3px;border-radius:2px;background:var(--mag)}
ul.pts li ul{list-style:none;margin:5px 0 2px}
ul.pts li ul li{font-size:14px;color:var(--sub)}
ul.pts li ul li::before{background:#C7D0D6;width:7px}
code.i{font-family:var(--mono);font-size:.86em;background:var(--soft);border:1px solid var(--line);padding:1px 6px;border-radius:5px;white-space:nowrap}
.exam{background:var(--mag-tint);border:1px solid var(--mag-line);border-left:4px solid var(--mag);border-radius:11px;padding:12px 15px;margin:16px 0 6px;font-size:14.3px}
.exam .tag{display:block;font-family:var(--mono);font-size:10.5px;letter-spacing:.12em;color:var(--mag);margin-bottom:5px}
.note{background:var(--soft);border:1px solid var(--line);border-radius:11px;padding:11px 14px;font-size:13.8px;color:var(--sub);margin:14px 0 6px}
pre.code{font-family:var(--mono);background:var(--code-bg);color:var(--code-tx);border-radius:12px;padding:14px 17px;overflow-x:auto;font-size:13px;line-height:1.62;margin:14px 0}
pre.code .k{color:#8FC1F2}pre.code .fn{color:#F2A7C6;font-weight:600}pre.code .c{color:#8A97A3}pre.code .s{color:#BFE3A6}
table.tbl{width:100%;border-collapse:collapse;font-size:14px;margin:14px 0 8px}
.tbl th{background:var(--soft);text-align:left;padding:8px 11px;font-size:12.3px;letter-spacing:.03em;color:var(--sub);border-bottom:1px solid var(--line)}
.tbl td{border-bottom:1px solid var(--soft);padding:9px 11px;vertical-align:top}
.tbl td:first-child{white-space:nowrap}
figure.fig{margin:18px auto 10px;text-align:center}
.fig svg{width:100%;max-width:480px;height:auto}
.fig figcaption{font-family:var(--mono);font-size:11px;color:var(--faint);margin-top:8px;letter-spacing:.04em}
/* template anatomy */
.file{border:1px solid var(--line);border-radius:12px;overflow:hidden;margin:14px 0;max-width:560px}
.file-tab{background:var(--code-bg);color:#C9D4DC;font-family:var(--mono);font-size:12px;padding:8px 14px}
.file-row{display:flex;gap:12px;align-items:baseline;padding:10px 14px;border-top:1px solid var(--soft);font-size:13.8px}
.file-row:first-of-type{border-top:none}
.file-row .fname{font-family:var(--mono);font-size:12.8px;font-weight:600;flex:0 0 168px;color:var(--ink)}
.file-row .fdesc{color:var(--sub);flex:1;min-width:140px}
.file-row .fb{font-family:var(--mono);font-size:10px;letter-spacing:.08em;padding:2px 7px;border-radius:5px;background:var(--soft);color:var(--faint);white-space:nowrap}
.file-row.req{background:var(--mag-tint)}
.file-row.req .fname{color:var(--mag-deep)}
.file-row.req .fb{background:var(--mag);color:#fff}
/* checklist */
.progress{font-family:var(--mono);font-size:12.5px;color:var(--sub);margin:4px 0 10px}
ul.check{list-style:none;margin:10px 0}
ul.check li{margin:9px 0;font-size:14.6px}
ul.check label{display:flex;gap:10px;align-items:flex-start;cursor:pointer}
ul.check input{accent-color:var(--mag);width:15px;height:15px;margin-top:4px;flex:0 0 auto;cursor:pointer}
ul.check label.on span{color:var(--faint);text-decoration:line-through}
footer{color:var(--faint);font-size:12.5px;text-align:center;padding:8px 0 0;font-family:var(--mono)}
@media (max-width:620px){
  section.card{padding:18px 16px 16px}
  .shead h2{font-size:17.5px}
  .file-row{flex-wrap:wrap}.file-row .fname{flex-basis:100%}
  .tbl{font-size:13px}
  .hero::after{font-size:34px}
}
`;

/* ── mini YAML/JSON highlighter ── */
const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const hi = (s) => {
  let t = esc(s.trim());
  t = t.replace(
    /^([ \t]*(?:- )?)([A-Za-z][\w.:]*?)(:)(?=\s|$)/gm,
    '$1<span class="k">$2$3</span>',
  );
  t = t.replace(
    /&quot;[^&\n]*?&quot;/g,
    (m) => '<span class="s">' + m + "</span>",
  );
  t = t.replace(/'[^'\n]*'/g, (m) => '<span class="s">' + m + "</span>");
  t = t.replace(
    /(^|[ \t])(#[^\n]*)/gm,
    (m, a, b) => a + '<span class="c">' + b + "</span>",
  );
  t = t.replace(/(![A-Za-z][\w:]*)/g, '<span class="fn">$1</span>');
  return t;
};
const Code = ({ t }) => (
  <pre className="code" dangerouslySetInnerHTML={{ __html: hi(t) }} />
);

/* ── small building blocks ── */
const Freq = ({ l, label, bare }) => (
  <span className={"freq" + (bare ? " bare" : "")} data-l={l}>
    <span className="bars">
      <i />
      <i />
      <i />
    </span>
    {!bare && <em>빈출 {label}</em>}
  </span>
);

const Sec = ({ id, lect, title, l, label, children }) => (
  <section className="card" id={id}>
    <div className="shead">
      <span className="lect">강의 {lect}</span>
      <h2>{title}</h2>
      <Freq l={l} label={label} />
    </div>
    {children}
  </section>
);

const Exam = ({ children }) => (
  <div className="exam">
    <span className="tag">EXAM POINT · 시험에서 이렇게 나온다</span>
    {children}
  </div>
);
const Note = ({ children }) => <div className="note">{children}</div>;

/* ── SVG 공통 팔레트 ── */
const F = "'IBM Plex Sans KR',sans-serif";
const M = "'IBM Plex Mono',monospace";
const INK = "#22303C",
  SUB = "#5A6874",
  LN = "#2A3947",
  MAG = "#CF2F6E",
  MAGD = "#A81E55",
  TINT = "#FBEDF3",
  TLN = "#F2CBDB",
  DASH = "#8FA0AA";

const Fig = ({ cap, children }) => (
  <figure className="fig">
    {children}
    <figcaption>{cap}</figcaption>
  </figure>
);

/* ── FIG 1 · CloudFormation 작동 방식 ── */
const FigWorkflow = () => (
  <Fig cap="템플릿 → CloudFormation → 스택 생성 흐름">
    <svg
      viewBox="0 0 440 426"
      role="img"
      aria-label="CloudFormation 작동 방식 다이어그램"
    >
      <defs>
        <marker
          id="aw"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10z" fill={LN} />
        </marker>
      </defs>
      <rect
        x="100"
        y="10"
        width="240"
        height="66"
        rx="10"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.6"
      />
      <text x="116" y="30" fontFamily={M} fontSize="10.5" fill={SUB}>
        template.yaml
      </text>
      <text
        x="220"
        y="56"
        textAnchor="middle"
        fontFamily={F}
        fontSize="15"
        fontWeight="700"
        fill={INK}
      >
        템플릿 (YAML / JSON)
      </text>
      <line
        x1="220"
        y1="76"
        x2="220"
        y2="106"
        stroke={LN}
        strokeWidth="1.6"
        markerEnd="url(#aw)"
      />
      <text x="232" y="95" fontFamily={M} fontSize="11.5" fill={SUB}>
        S3에 업로드
      </text>
      <rect
        x="100"
        y="108"
        width="240"
        height="70"
        rx="10"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.6"
      />
      <text
        x="220"
        y="136"
        textAnchor="middle"
        fontFamily={F}
        fontSize="15"
        fontWeight="700"
        fill={INK}
      >
        CloudFormation
      </text>
      <text
        x="220"
        y="158"
        textAnchor="middle"
        fontFamily={F}
        fontSize="12"
        fill={SUB}
      >
        의존 관계 파악 → 생성 순서 결정
      </text>
      <line
        x1="220"
        y1="178"
        x2="220"
        y2="208"
        stroke={LN}
        strokeWidth="1.6"
        markerEnd="url(#aw)"
      />
      <text x="232" y="197" fontFamily={F} fontSize="11.5" fill={SUB}>
        올바른 순서로 자동 생성
      </text>
      <rect
        x="32"
        y="210"
        width="376"
        height="200"
        rx="12"
        fill="#FAFBFA"
        stroke={DASH}
        strokeWidth="1.4"
        strokeDasharray="6 5"
      />
      <text
        x="52"
        y="240"
        fontFamily={F}
        fontSize="14"
        fontWeight="700"
        fill={INK}
      >
        스택 (Stack)
      </text>
      <text
        x="388"
        y="239"
        textAnchor="end"
        fontFamily={M}
        fontSize="10.5"
        fill={SUB}
      >
        하나의 단위로 관리
      </text>
      <rect
        x="52"
        y="256"
        width="70"
        height="38"
        rx="8"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.3"
      />
      <text
        x="87"
        y="280"
        textAnchor="middle"
        fontFamily={F}
        fontSize="13"
        fill={INK}
      >
        VPC
      </text>
      <rect
        x="134"
        y="256"
        width="104"
        height="38"
        rx="8"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.3"
      />
      <text
        x="186"
        y="280"
        textAnchor="middle"
        fontFamily={F}
        fontSize="13"
        fill={INK}
      >
        보안 그룹
      </text>
      <rect
        x="250"
        y="256"
        width="70"
        height="38"
        rx="8"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.3"
      />
      <text
        x="285"
        y="280"
        textAnchor="middle"
        fontFamily={F}
        fontSize="13"
        fill={INK}
      >
        EC2
      </text>
      <rect
        x="52"
        y="306"
        width="70"
        height="38"
        rx="8"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.3"
      />
      <text
        x="87"
        y="330"
        textAnchor="middle"
        fontFamily={F}
        fontSize="13"
        fill={INK}
      >
        ELB
      </text>
      <rect
        x="134"
        y="306"
        width="70"
        height="38"
        rx="8"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.3"
      />
      <text
        x="169"
        y="330"
        textAnchor="middle"
        fontFamily={F}
        fontSize="13"
        fill={INK}
      >
        RDS
      </text>
      <rect
        x="216"
        y="306"
        width="112"
        height="38"
        rx="8"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.3"
      />
      <text
        x="272"
        y="330"
        textAnchor="middle"
        fontFamily={F}
        fontSize="13"
        fill={INK}
      >
        Elastic IP
      </text>
      <rect x="52" y="364" width="10" height="3" rx="1.5" fill={MAG} />
      <text x="70" y="370" fontFamily={F} fontSize="12" fill="#4A5764">
        삭제 시 스택 안 모든 리소스가 함께 삭제됨
      </text>
    </svg>
  </Fig>
);

/* ── FIG 3 · Parameters vs Mappings ── */
const FigParamVsMap = () => (
  <Fig cap="Parameters와 Mappings 중 무엇을 쓸까?">
    <svg
      viewBox="0 0 440 302"
      role="img"
      aria-label="Parameters와 Mappings 선택 기준"
    >
      <defs>
        <marker
          id="pm"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10z" fill={LN} />
        </marker>
      </defs>
      <rect x="70" y="10" width="300" height="52" rx="12" fill="#22303C" />
      <text
        x="220"
        y="42"
        textAnchor="middle"
        fontFamily={F}
        fontSize="14.5"
        fontWeight="700"
        fill="#fff"
      >
        값을 배포 전에 미리 알 수 있나?
      </text>
      <line
        x1="158"
        y1="62"
        x2="114"
        y2="112"
        stroke={LN}
        strokeWidth="1.6"
        markerEnd="url(#pm)"
      />
      <line
        x1="282"
        y1="62"
        x2="326"
        y2="112"
        stroke={LN}
        strokeWidth="1.6"
        markerEnd="url(#pm)"
      />
      <text x="14" y="92" fontFamily={F} fontSize="11.5" fill={SUB}>
        아니오 · 매번 다름
      </text>
      <text
        x="426"
        y="92"
        textAnchor="end"
        fontFamily={F}
        fontSize="11.5"
        fill={SUB}
      >
        예 · 리전/환경별 고정
      </text>
      <rect
        x="14"
        y="116"
        width="198"
        height="172"
        rx="12"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.6"
      />
      <text
        x="113"
        y="146"
        textAnchor="middle"
        fontFamily={F}
        fontSize="15"
        fontWeight="700"
        fill={MAG}
      >
        Parameters
      </text>
      <line
        x1="32"
        y1="158"
        x2="194"
        y2="158"
        stroke="#EDF1EF"
        strokeWidth="1.5"
      />
      <text
        x="113"
        y="184"
        textAnchor="middle"
        fontFamily={F}
        fontSize="13"
        fill={INK}
      >
        사용자 입력으로 결정
      </text>
      <text
        x="113"
        y="210"
        textAnchor="middle"
        fontFamily={M}
        fontSize="12.5"
        fill={MAGD}
      >
        !Ref 로 참조
      </text>
      <text
        x="113"
        y="238"
        textAnchor="middle"
        fontFamily={F}
        fontSize="12"
        fill={SUB}
      >
        예: 인스턴스 타입,
      </text>
      <text
        x="113"
        y="256"
        textAnchor="middle"
        fontFamily={F}
        fontSize="12"
        fill={SUB}
      >
        KeyPair 이름
      </text>
      <rect
        x="228"
        y="116"
        width="198"
        height="172"
        rx="12"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.6"
      />
      <text
        x="327"
        y="146"
        textAnchor="middle"
        fontFamily={F}
        fontSize="15"
        fontWeight="700"
        fill={MAG}
      >
        Mappings
      </text>
      <line
        x1="246"
        y1="158"
        x2="408"
        y2="158"
        stroke="#EDF1EF"
        strokeWidth="1.5"
      />
      <text
        x="327"
        y="184"
        textAnchor="middle"
        fontFamily={F}
        fontSize="13"
        fill={INK}
      >
        템플릿에 하드코딩
      </text>
      <text
        x="327"
        y="210"
        textAnchor="middle"
        fontFamily={M}
        fontSize="12.5"
        fill={MAGD}
      >
        !FindInMap 참조
      </text>
      <text
        x="327"
        y="238"
        textAnchor="middle"
        fontFamily={F}
        fontSize="12"
        fill={SUB}
      >
        예: 리전별 AMI ID,
      </text>
      <text
        x="327"
        y="256"
        textAnchor="middle"
        fontFamily={F}
        fontSize="12"
        fill={SUB}
      >
        dev / prod 설정
      </text>
    </svg>
  </Fig>
);

/* ── FIG 4 · 크로스 스택 참조 ── */
const FigCrossStack = () => (
  <Fig cap="Outputs Export → !ImportValue 크로스 스택 참조">
    <svg
      viewBox="0 0 440 300"
      role="img"
      aria-label="크로스 스택 참조 다이어그램"
    >
      <defs>
        <marker
          id="cs"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10z" fill={MAG} />
        </marker>
      </defs>
      <rect
        x="40"
        y="10"
        width="360"
        height="118"
        rx="12"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.6"
      />
      <text
        x="60"
        y="38"
        fontFamily={F}
        fontSize="15"
        fontWeight="700"
        fill={INK}
      >
        네트워크 스택
      </text>
      <text
        x="380"
        y="36"
        textAnchor="end"
        fontFamily={M}
        fontSize="10.5"
        fill={SUB}
      >
        Stack A
      </text>
      <rect
        x="60"
        y="52"
        width="320"
        height="58"
        rx="8"
        fill={TINT}
        stroke={TLN}
        strokeWidth="1.3"
      />
      <text x="76" y="74" fontFamily={M} fontSize="11" fill={MAGD}>
        Outputs · Export
      </text>
      <text x="76" y="96" fontFamily={M} fontSize="12.5" fill={INK}>
        SSHSecurityGroup = sg-0a1b2c
      </text>
      <line
        x1="220"
        y1="128"
        x2="220"
        y2="186"
        stroke={MAG}
        strokeWidth="1.8"
        markerEnd="url(#cs)"
      />
      <text
        x="234"
        y="152"
        fontFamily={M}
        fontSize="12.5"
        fontWeight="600"
        fill={MAG}
      >
        !ImportValue
      </text>
      <text x="234" y="170" fontFamily={M} fontSize="11.5" fill={SUB}>
        SSHSecurityGroup
      </text>
      <rect
        x="40"
        y="188"
        width="360"
        height="94"
        rx="12"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.6"
      />
      <text
        x="60"
        y="216"
        fontFamily={F}
        fontSize="15"
        fontWeight="700"
        fill={INK}
      >
        애플리케이션 스택
      </text>
      <text
        x="380"
        y="214"
        textAnchor="end"
        fontFamily={M}
        fontSize="10.5"
        fill={SUB}
      >
        Stack B
      </text>
      <text x="60" y="244" fontFamily={F} fontSize="13" fill={INK}>
        EC2 인스턴스 · SecurityGroups
      </text>
      <text x="60" y="266" fontFamily={F} fontSize="12" fill={SUB}>
        → 가져온 SG를 그대로 사용
      </text>
    </svg>
  </Fig>
);

/* ── FIG 5a · 스택 생성 실패 ── */
const FigCreateFail = () => (
  <Fig cap="스택 생성 실패 시 동작">
    <svg
      viewBox="0 0 440 316"
      role="img"
      aria-label="스택 생성 실패 시 롤백 동작"
    >
      <defs>
        <marker
          id="cf"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10z" fill={LN} />
        </marker>
      </defs>
      <rect x="110" y="10" width="220" height="56" rx="10" fill="#22303C" />
      <text
        x="220"
        y="34"
        textAnchor="middle"
        fontFamily={F}
        fontSize="14"
        fontWeight="700"
        fill="#fff"
      >
        스택 생성 실패
      </text>
      <text
        x="220"
        y="52"
        textAnchor="middle"
        fontFamily={M}
        fontSize="10.5"
        fill="#AEBAC4"
      >
        CREATE_FAILED
      </text>
      <line
        x1="168"
        y1="66"
        x2="116"
        y2="110"
        stroke={LN}
        strokeWidth="1.6"
        markerEnd="url(#cf)"
      />
      <line
        x1="272"
        y1="66"
        x2="324"
        y2="110"
        stroke={LN}
        strokeWidth="1.6"
        markerEnd="url(#cf)"
      />
      <rect
        x="14"
        y="114"
        width="198"
        height="116"
        rx="12"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.6"
      />
      <text
        x="113"
        y="142"
        textAnchor="middle"
        fontFamily={F}
        fontSize="13.5"
        fontWeight="700"
        fill={INK}
      >
        기본: 전부 롤백
      </text>
      <text
        x="113"
        y="166"
        textAnchor="middle"
        fontFamily={F}
        fontSize="12"
        fill={SUB}
      >
        생성된 리소스 모두 삭제
      </text>
      <text
        x="113"
        y="188"
        textAnchor="middle"
        fontFamily={M}
        fontSize="11"
        fill={SUB}
      >
        → ROLLBACK_COMPLETE
      </text>
      <rect
        x="228"
        y="114"
        width="198"
        height="116"
        rx="12"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.6"
      />
      <text
        x="327"
        y="142"
        textAnchor="middle"
        fontFamily={F}
        fontSize="13.5"
        fontWeight="700"
        fill={INK}
      >
        옵션: 롤백 비활성화
      </text>
      <text
        x="327"
        y="166"
        textAnchor="middle"
        fontFamily={F}
        fontSize="12"
        fill={SUB}
      >
        성공한 리소스 보존
      </text>
      <text
        x="327"
        y="188"
        textAnchor="middle"
        fontFamily={F}
        fontSize="12"
        fill={SUB}
      >
        로그로 원인 분석
      </text>
      <rect
        x="14"
        y="246"
        width="412"
        height="58"
        rx="10"
        fill={TINT}
        stroke={TLN}
        strokeWidth="1.3"
      />
      <text
        x="28"
        y="270"
        fontFamily={M}
        fontSize="12"
        fontWeight="600"
        fill={MAGD}
      >
        ROLLBACK_COMPLETE 상태 = 업데이트 불가
      </text>
      <text x="28" y="290" fontFamily={F} fontSize="12" fill={SUB}>
        재사용하려면 스택 삭제 후 재생성
      </text>
    </svg>
  </Fig>
);

/* ── FIG 5b · 스택 업데이트 실패 ── */
const FigUpdateFail = () => (
  <Fig cap="스택 업데이트 실패 → 자동 롤백 → 롤백 실패 시 대응">
    <svg
      viewBox="0 0 440 342"
      role="img"
      aria-label="스택 업데이트 실패 시 롤백 흐름"
    >
      <defs>
        <marker
          id="uf"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10z" fill={LN} />
        </marker>
      </defs>
      <rect x="80" y="10" width="280" height="48" rx="10" fill="#22303C" />
      <text
        x="220"
        y="39"
        textAnchor="middle"
        fontFamily={F}
        fontSize="14"
        fontWeight="700"
        fill="#fff"
      >
        스택 업데이트 실패
      </text>
      <line
        x1="220"
        y1="58"
        x2="220"
        y2="90"
        stroke={LN}
        strokeWidth="1.6"
        markerEnd="url(#uf)"
      />
      <rect
        x="80"
        y="92"
        width="280"
        height="58"
        rx="10"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.6"
      />
      <text
        x="220"
        y="116"
        textAnchor="middle"
        fontFamily={F}
        fontSize="13.5"
        fontWeight="700"
        fill={INK}
      >
        마지막 정상 상태로 자동 롤백
      </text>
      <text
        x="220"
        y="138"
        textAnchor="middle"
        fontFamily={F}
        fontSize="11.5"
        fill={SUB}
      >
        로그에서 실패 원인 확인
      </text>
      <line
        x1="220"
        y1="150"
        x2="220"
        y2="182"
        stroke={LN}
        strokeWidth="1.6"
        markerEnd="url(#uf)"
      />
      <text x="232" y="171" fontFamily={F} fontSize="11.5" fill={SUB}>
        롤백도 실패하면
      </text>
      <rect
        x="80"
        y="184"
        width="280"
        height="58"
        rx="10"
        fill={TINT}
        stroke={TLN}
        strokeWidth="1.4"
      />
      <text
        x="220"
        y="208"
        textAnchor="middle"
        fontFamily={M}
        fontSize="13"
        fontWeight="600"
        fill={MAGD}
      >
        UPDATE_ROLLBACK_FAILED
      </text>
      <text
        x="220"
        y="230"
        textAnchor="middle"
        fontFamily={F}
        fontSize="11.5"
        fill={SUB}
      >
        CFN 밖에서 리소스가 변경된 경우 등
      </text>
      <line
        x1="220"
        y1="242"
        x2="220"
        y2="274"
        stroke={LN}
        strokeWidth="1.6"
        markerEnd="url(#uf)"
      />
      <text x="232" y="263" fontFamily={F} fontSize="11.5" fill={SUB}>
        리소스 수동 복구 후
      </text>
      <rect
        x="80"
        y="276"
        width="280"
        height="56"
        rx="10"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.6"
      />
      <text
        x="220"
        y="300"
        textAnchor="middle"
        fontFamily={M}
        fontSize="13"
        fontWeight="600"
        fill={INK}
      >
        ContinueUpdateRollback
      </text>
      <text
        x="220"
        y="320"
        textAnchor="middle"
        fontFamily={F}
        fontSize="11.5"
        fill={SUB}
      >
        콘솔 또는 CLI로 롤백 재개
      </text>
    </svg>
  </Fig>
);

/* ── FIG 6 · CloudFormation 서비스 역할 ── */
const FigServiceRole = () => (
  <Fig cap="서비스 역할 — 사용자 권한 대신 역할 권한으로 리소스 작업">
    <svg
      viewBox="0 0 440 372"
      role="img"
      aria-label="CloudFormation 서비스 역할 흐름"
    >
      <defs>
        <marker
          id="sr"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10z" fill={LN} />
        </marker>
      </defs>
      <rect
        x="90"
        y="10"
        width="260"
        height="88"
        rx="10"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.6"
      />
      <text
        x="220"
        y="34"
        textAnchor="middle"
        fontFamily={F}
        fontSize="14.5"
        fontWeight="700"
        fill={INK}
      >
        사용자 (개발자)
      </text>
      <text
        x="220"
        y="56"
        textAnchor="middle"
        fontFamily={M}
        fontSize="11.5"
        fill={INK}
      >
        cloudformation:* + iam:PassRole
      </text>
      <text
        x="220"
        y="76"
        textAnchor="middle"
        fontFamily={F}
        fontSize="11.5"
        fill={SUB}
      >
        리소스 직접 생성 권한 없음
      </text>
      <line
        x1="220"
        y1="98"
        x2="220"
        y2="130"
        stroke={LN}
        strokeWidth="1.6"
        markerEnd="url(#sr)"
      />
      <text x="232" y="119" fontFamily={F} fontSize="11.5" fill={SUB}>
        스택 작업 요청 + 역할 전달
      </text>
      <rect
        x="90"
        y="132"
        width="260"
        height="48"
        rx="10"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.6"
      />
      <text
        x="220"
        y="161"
        textAnchor="middle"
        fontFamily={F}
        fontSize="15"
        fontWeight="700"
        fill={INK}
      >
        CloudFormation
      </text>
      <line
        x1="220"
        y1="180"
        x2="220"
        y2="212"
        stroke={LN}
        strokeWidth="1.6"
        markerEnd="url(#sr)"
      />
      <text x="232" y="201" fontFamily={F} fontSize="11.5" fill={SUB}>
        서비스 역할을 위임받음
      </text>
      <rect
        x="90"
        y="214"
        width="260"
        height="72"
        rx="10"
        fill="#fff"
        stroke={MAG}
        strokeWidth="1.8"
      />
      <text
        x="220"
        y="240"
        textAnchor="middle"
        fontFamily={F}
        fontSize="14"
        fontWeight="700"
        fill={MAG}
      >
        CFN 서비스 역할
      </text>
      <text
        x="220"
        y="262"
        textAnchor="middle"
        fontFamily={M}
        fontSize="11.5"
        fill={INK}
      >
        s3:* 등 리소스 권한만 보유
      </text>
      <line
        x1="220"
        y1="286"
        x2="220"
        y2="318"
        stroke={LN}
        strokeWidth="1.6"
        markerEnd="url(#sr)"
      />
      <text x="232" y="307" fontFamily={F} fontSize="11.5" fill={SUB}>
        역할 권한으로 실행
      </text>
      <rect
        x="104"
        y="320"
        width="112"
        height="40"
        rx="8"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.3"
      />
      <text
        x="160"
        y="345"
        textAnchor="middle"
        fontFamily={F}
        fontSize="13"
        fill={INK}
      >
        S3 버킷 생성
      </text>
      <rect
        x="228"
        y="320"
        width="108"
        height="40"
        rx="8"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.3"
      />
      <text
        x="282"
        y="345"
        textAnchor="middle"
        fontFamily={F}
        fontSize="13"
        fill={INK}
      >
        리소스 구성
      </text>
    </svg>
  </Fig>
);

/* ── FIG 7 · 커스텀 리소스 (S3 버킷 비우기) ── */
const FigCustomResource = () => (
  <Fig cap="커스텀 리소스로 비어있지 않은 S3 버킷 삭제하기">
    <svg viewBox="0 0 440 382" role="img" aria-label="커스텀 리소스 동작 순서">
      <line x1="34" y1="33" x2="34" y2="345" stroke="#C7D0D6" strokeWidth="2" />
      <rect
        x="58"
        y="10"
        width="368"
        height="46"
        rx="10"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.5"
      />
      <text x="76" y="38" fontFamily={F} fontSize="13.5" fill={INK}>
        사용자가 스택 삭제 요청
      </text>
      <rect
        x="58"
        y="76"
        width="368"
        height="62"
        rx="10"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.5"
      />
      <text x="76" y="100" fontFamily={F} fontSize="13.5" fill={INK}>
        CFN → 커스텀 리소스에 Delete 이벤트
      </text>
      <text x="76" y="122" fontFamily={M} fontSize="11.5" fill={SUB}>
        ServiceToken = Lambda ARN (같은 리전)
      </text>
      <rect
        x="58"
        y="158"
        width="368"
        height="62"
        rx="10"
        fill={TINT}
        stroke={TLN}
        strokeWidth="1.4"
      />
      <text
        x="76"
        y="182"
        fontFamily={F}
        fontSize="13.5"
        fontWeight="700"
        fill={MAGD}
      >
        Lambda 실행: 버킷의 객체 전부 삭제
      </text>
      <text x="76" y="204" fontFamily={F} fontSize="11.5" fill={SUB}>
        → 버킷이 비워짐
      </text>
      <rect
        x="58"
        y="240"
        width="368"
        height="62"
        rx="10"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.5"
      />
      <text x="76" y="264" fontFamily={F} fontSize="13.5" fill={INK}>
        Lambda → CFN에 성공/실패 응답
      </text>
      <text x="76" y="286" fontFamily={M} fontSize="11.5" fill={SUB}>
        사전 서명된 S3 URL로 전송
      </text>
      <rect
        x="58"
        y="322"
        width="368"
        height="46"
        rx="10"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.5"
      />
      <text
        x="76"
        y="350"
        fontFamily={F}
        fontSize="13.5"
        fontWeight="700"
        fill={INK}
      >
        빈 버킷 삭제 성공 → 스택 삭제 완료
      </text>
      {[33, 107, 189, 271, 345].map((cy, i) => (
        <g key={i}>
          <circle cx="34" cy={cy} r="13" fill={MAG} />
          <text
            x="34"
            y={cy + 4.5}
            textAnchor="middle"
            fontFamily={M}
            fontSize="12.5"
            fontWeight="600"
            fill="#fff"
          >
            {i + 1}
          </text>
        </g>
      ))}
    </svg>
  </Fig>
);

/* ── FIG 8 · StackSets ── */
const FigStackSets = () => (
  <Fig cap="StackSets — 하나의 작업으로 여러 계정 × 여러 리전에 배포">
    <svg
      viewBox="0 0 440 318"
      role="img"
      aria-label="StackSets 다중 계정 배포 구조"
    >
      <defs>
        <marker
          id="ss"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10z" fill={LN} />
        </marker>
      </defs>
      <rect
        x="110"
        y="10"
        width="220"
        height="66"
        rx="10"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.6"
      />
      <text
        x="220"
        y="36"
        textAnchor="middle"
        fontFamily={F}
        fontSize="14"
        fontWeight="700"
        fill={INK}
      >
        관리자 계정
      </text>
      <text
        x="220"
        y="58"
        textAnchor="middle"
        fontFamily={M}
        fontSize="12"
        fontWeight="600"
        fill={MAG}
      >
        StackSet (템플릿 1개)
      </text>
      <line
        x1="172"
        y1="76"
        x2="120"
        y2="118"
        stroke={LN}
        strokeWidth="1.6"
        markerEnd="url(#ss)"
      />
      <line
        x1="268"
        y1="76"
        x2="320"
        y2="118"
        stroke={LN}
        strokeWidth="1.6"
        markerEnd="url(#ss)"
      />
      <rect
        x="16"
        y="122"
        width="196"
        height="116"
        rx="12"
        fill="#FAFBFA"
        stroke={DASH}
        strokeWidth="1.4"
        strokeDasharray="6 5"
      />
      <text
        x="32"
        y="146"
        fontFamily={F}
        fontSize="13"
        fontWeight="700"
        fill={INK}
      >
        대상 계정 A
      </text>
      <rect
        x="32"
        y="158"
        width="164"
        height="30"
        rx="7"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.3"
      />
      <text
        x="114"
        y="177"
        textAnchor="middle"
        fontFamily={M}
        fontSize="11.5"
        fill={INK}
      >
        us-east-1 스택
      </text>
      <rect
        x="32"
        y="196"
        width="164"
        height="30"
        rx="7"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.3"
      />
      <text
        x="114"
        y="215"
        textAnchor="middle"
        fontFamily={M}
        fontSize="11.5"
        fill={INK}
      >
        ap-northeast-2 스택
      </text>
      <rect
        x="228"
        y="122"
        width="196"
        height="116"
        rx="12"
        fill="#FAFBFA"
        stroke={DASH}
        strokeWidth="1.4"
        strokeDasharray="6 5"
      />
      <text
        x="244"
        y="146"
        fontFamily={F}
        fontSize="13"
        fontWeight="700"
        fill={INK}
      >
        대상 계정 B
      </text>
      <rect
        x="244"
        y="158"
        width="164"
        height="30"
        rx="7"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.3"
      />
      <text
        x="326"
        y="177"
        textAnchor="middle"
        fontFamily={M}
        fontSize="11.5"
        fill={INK}
      >
        us-east-1 스택
      </text>
      <rect
        x="244"
        y="196"
        width="164"
        height="30"
        rx="7"
        fill="#fff"
        stroke={LN}
        strokeWidth="1.3"
      />
      <text
        x="326"
        y="215"
        textAnchor="middle"
        fontFamily={M}
        fontSize="11.5"
        fill={INK}
      >
        ap-northeast-2 스택
      </text>
      <rect
        x="16"
        y="254"
        width="408"
        height="54"
        rx="10"
        fill={TINT}
        stroke={TLN}
        strokeWidth="1.3"
      />
      <text
        x="30"
        y="276"
        fontFamily={F}
        fontSize="12.5"
        fontWeight="700"
        fill={MAGD}
      >
        StackSet 업데이트 한 번 →
      </text>
      <text x="30" y="296" fontFamily={F} fontSize="12" fill={SUB}>
        모든 계정·리전의 스택 인스턴스에 반영
      </text>
    </svg>
  </Fig>
);

/* ── 목차 & 체크리스트 데이터 ── */
const TOC = [
  ["s198", "198 개요"],
  ["s200", "200 업데이트·삭제"],
  ["s201", "201 YAML"],
  ["s202", "202 Resources"],
  ["s203", "203 Parameters"],
  ["s204", "204 Mappings"],
  ["s205", "205 Outputs"],
  ["s206", "206 Conditions"],
  ["s207", "207 내장 함수"],
  ["s208", "208 롤백"],
  ["s209", "209 서비스 역할"],
  ["s210", "210 Capabilities"],
  ["s211", "211 삭제 정책"],
  ["s212", "212 스택 정책"],
  ["s213", "213 종료 방지"],
  ["s214", "214 커스텀 리소스"],
  ["s215", "215 StackSets"],
  ["final", "✓ 최종 체크리스트"],
];

const CHECKS = [
  "Resources는 템플릿에서 유일한 필수 섹션",
  "값이 바뀔 수 있으면 Parameters · 미리 아는 고정 분기값이면 Mappings(!FindInMap)",
  "비밀 매개변수 노출 방지 = NoEcho: true",
  "!Ref = 파라미터 값·리소스 물리 ID / !GetAtt = 리소스 속성 / !ImportValue = 다른 스택의 Export 값",
  "Export 이름은 리전 내에서 유일 · Import되는 동안 원본 스택 삭제 불가",
  "생성 실패 기본 동작 = 전부 롤백(삭제) · ROLLBACK_COMPLETE 스택은 업데이트 불가 → 삭제 후 재생성",
  "롤백 실패 = UPDATE_ROLLBACK_FAILED → 리소스 수동 복구 후 ContinueUpdateRollback",
  "IAM 리소스 포함 = CAPABILITY_IAM · 이름 지정 IAM = CAPABILITY_NAMED_IAM · 매크로/중첩 스택 = CAPABILITY_AUTO_EXPAND",
  "Capability 승인 누락 시 → InsufficientCapabilitiesException",
  "서비스 역할을 쓰려면 사용자에게 iam:PassRole 권한 필요",
  "DeletionPolicy: Retain(보존) · Snapshot(스냅샷 후 삭제) · Delete(기본값, 단 RDS DBCluster의 기본은 Snapshot)",
  "업데이트로부터 리소스 보호 = 스택 정책(설정 시 기본 전체 보호 · 바꿀 리소스만 명시적 Allow)",
  "비어있지 않은 S3 버킷 삭제 = 커스텀 리소스(Lambda) + ServiceToken",
  "여러 계정 × 여러 리전에 동일 스택 배포 = StackSets",
];

export default function CloudFormationGuide() {
  const [done, setDone] = useState({});
  const toggle = (i) => setDone((d) => ({ ...d, [i]: !d[i] }));
  const doneCount = Object.values(done).filter(Boolean).length;

  return (
    <div className="page">
      <style>{css}</style>

      <header className="hero">
        <div className="hero-in">
          <div>
            <div className="eyebrow">
              AWS Certified Developer — Associate (DVA-C02)
            </div>
            <h1>CloudFormation 개념 총정리</h1>
            <p>
              강의 198–215 전체 개념 정리 (실습 199 제외) · 다이어그램 · 시험
              포인트 · 체감 빈출도
            </p>
          </div>
          <div className="stack-glyph" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      </header>

      <main className="wrap">
        <div className="legend">
          <span className="fx">
            <Freq l={3} bare /> 빈출 상 — 거의 매 세트 등장
          </span>
          <span className="fx">
            <Freq l={2} bare /> 빈출 중 — 종종 등장
          </span>
          <span className="fx">
            <Freq l={1} bare /> 빈출 하 — 배경지식 수준
          </span>
          <small>
            AWS는 공식 출제 비중을 공개하지 않습니다. 위 빈출도는 강의에서의
            강조 정도와 DVA 수험 후기·연습문제 경향을 종합한 <b>체감 지표</b>
            이니 참고용으로만 활용하세요. CloudFormation 자체가 DVA
            배포(Deployment) 도메인의 핵심 서비스라 이 섹션 전체가 시험
            범위입니다.
          </small>
        </div>

        <nav className="toc" aria-label="목차">
          {TOC.map(([id, label]) => (
            <a key={id} href={"#" + id}>
              {label}
            </a>
          ))}
        </nav>

        {/* ───────── 198 개요 ───────── */}
        <Sec id="s198" lect="198" title="CloudFormation 개요" l={2} label="중">
          <ul className="pts">
            <li>
              <b>Infrastructure as Code(IaC)</b> — 원하는 AWS 리소스와 설정을
              템플릿(코드)에 <b>선언</b>하면, CloudFormation이{" "}
              <b>올바른 순서로 자동 생성</b>합니다. 순서와 오케스트레이션을 직접
              짤 필요가 없는
              <b> 선언형</b> 방식입니다.
            </li>
            <li>
              코드로 관리하는 장점 — 수동 생성 제거, Git 버전 관리, 코드 리뷰로
              인프라 변경 검토
            </li>
            <li>
              비용 — 스택의 각 리소스에 스택 식별자 태그가 붙어{" "}
              <b>스택 단위 비용 추적</b>이 쉽고, 템플릿으로 비용 견적도 가능.
              절약 전략: dev 환경을 퇴근 때 스택 삭제 → 출근 때 재생성
            </li>
            <li>
              생산성 — 클라우드에서 인프라를 온디맨드로 만들고 부수기 반복 가능,
              템플릿을 자동으로 다이어그램화(Infrastructure Composer)
            </li>
            <li>재사용 — 웹에 공개된 기존 템플릿과 풍부한 공식 문서 활용</li>
          </ul>
          <FigWorkflow />
          <ul className="pts">
            <li>
              템플릿은 <b>S3에 업로드</b>되어 CloudFormation이 참조합니다.
            </li>
            <li>
              템플릿을 고칠 때는 기존 파일을 직접 수정하는 게 아니라{" "}
              <b>새 버전을 업로드</b>합니다.
            </li>
            <li>
              스택을 삭제하면 그 스택이 만든 <b>모든 리소스가 함께 삭제</b>
              됩니다.
            </li>
            <li>
              배포 방법 — 수동(콘솔 + Infrastructure Composer) vs 자동(CLI·CI/CD
              파이프라인, 권장 플로우)
            </li>
          </ul>
        </Sec>

        {/* ───────── 200 업데이트·삭제 ───────── */}
        <Sec id="s200" lect="200" title="스택 업데이트 & 삭제" l={2} label="중">
          <ul className="pts">
            <li>
              업데이트 방법 2가지 — <b>직접 업데이트</b> vs{" "}
              <b>변경 세트(Change Set)</b>
            </li>
            <li>
              변경 세트: 적용 전에 <b>무엇이 바뀔지 미리보기</b>. 단, 업데이트가{" "}
              <b>성공할지는 알려주지 않음</b>
            </li>
          </ul>
          <table className="tbl">
            <thead>
              <tr>
                <th>업데이트 동작</th>
                <th>의미</th>
                <th>대표 예</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <b>중단 없음</b>
                </td>
                <td>가동 중단·물리 ID 변경 없음</td>
                <td>보안 그룹 규칙 변경</td>
              </tr>
              <tr>
                <td>
                  <b>일부 중단</b>
                </td>
                <td>잠시 중단, ID는 유지</td>
                <td>EBS 기반 EC2의 인스턴스 타입 변경(중지→시작)</td>
              </tr>
              <tr>
                <td>
                  <b>교체(Replacement)</b>
                </td>
                <td>
                  새 리소스 생성 후 기존 삭제 → <b>물리 ID 변경</b>
                </td>
                <td>EC2의 AMI(ImageId) 변경</td>
              </tr>
            </tbody>
          </table>
          <ul className="pts">
            <li>
              스택 삭제 시 기본적으로 <b>모든 리소스 제거</b> — 리소스별 예외는
              DeletionPolicy(강의 211)로 제어
            </li>
          </ul>
          <Exam>
            "적용하기 전에 어떤 변경이 일어날지 검토하려면?" → <b>변경 세트</b>.
            "업데이트 후 리소스 ID가 바뀌었다"는 시나리오 →{" "}
            <b>교체(Replacement)</b> 동작을 묻는 문제입니다.
          </Exam>
        </Sec>

        {/* ───────── 201 YAML ───────── */}
        <Sec id="s201" lect="201" title="YAML 단기집중과정" l={1} label="하">
          <ul className="pts">
            <li>
              CloudFormation은 <b>YAML과 JSON 모두 지원</b> — 가독성 때문에
              YAML이 사실상 표준
            </li>
            <li>
              핵심 문법: Key-Value 쌍 · <b>들여쓰기로 중첩</b> ·{" "}
              <code className="i">-</code>로 배열 ·<code className="i">|</code>
              로 여러 줄 문자열 · <code className="i">#</code> 주석
            </li>
          </ul>
          <Code
            t={`
# 주석은 # 으로
key: value
nested:              # 들여쓰기 = 중첩 객체
  child_key: 1
items:               # 배열
  - item1
  - key1: a
    key2: b
multiline: |         # 여러 줄 문자열
  첫째 줄
  둘째 줄
`}
          />
        </Sec>

        {/* ───────── 202 Resources ───────── */}
        <Sec id="s202" lect="202" title="Resources — 리소스" l={2} label="중">
          <p>먼저 템플릿 전체 구조 속에서 위치를 보면:</p>
          <div className="file">
            <div className="file-tab">template.yaml — 템플릿 구조</div>
            <div className="file-row">
              <span className="fname">AWSTemplateFormatVersion</span>
              <span className="fdesc">템플릿 형식 버전</span>
              <span className="fb">선택</span>
            </div>
            <div className="file-row">
              <span className="fname">Description</span>
              <span className="fdesc">템플릿 설명</span>
              <span className="fb">선택</span>
            </div>
            <div className="file-row">
              <span className="fname">Parameters</span>
              <span className="fdesc">실행 시 입력받는 동적 값</span>
              <span className="fb">선택</span>
            </div>
            <div className="file-row">
              <span className="fname">Mappings</span>
              <span className="fdesc">하드코딩된 고정 값</span>
              <span className="fb">선택</span>
            </div>
            <div className="file-row">
              <span className="fname">Conditions</span>
              <span className="fdesc">리소스 생성 조건</span>
              <span className="fb">선택</span>
            </div>
            <div className="file-row req">
              <span className="fname">Resources</span>
              <span className="fdesc">생성할 AWS 리소스 선언</span>
              <span className="fb">필수</span>
            </div>
            <div className="file-row">
              <span className="fname">Outputs</span>
              <span className="fdesc">내보낼 값 · 크로스 스택 참조</span>
              <span className="fb">선택</span>
            </div>
          </div>
          <ul className="pts">
            <li>
              <b>유일한 필수 섹션</b> — 선언된 리소스들을 CFN이 생성·설정하고
              서로 연결
            </li>
            <li>
              리소스 식별자 형식: <code className="i">AWS::서비스::타입</code>{" "}
              (예: <code className="i">AWS::EC2::Instance</code>)
            </li>
            <li>
              리소스끼리 <b>서로 참조</b> 가능(<code className="i">!Ref</code>{" "}
              등) · 각 타입의 Properties는 공식 문서에서 확인
            </li>
          </ul>
          <Code
            t={`
Resources:
  MyInstance:
    Type: AWS::EC2::Instance     # AWS::서비스::타입
    Properties:
      ImageId: ami-0abcd1234
      InstanceType: t2.micro
      SecurityGroups:
        - !Ref SSHSecurityGroup  # 리소스 간 참조
`}
          />
          <ul className="pts">
            <li>
              FAQ — 리소스 개수를 동적으로 만들 수 있나? <b>아니오.</b> 모든
              리소스는 템플릿에 선언되어야 함(Transform/매크로는 예외)
            </li>
            <li>
              FAQ — 모든 AWS 서비스가 지원되나? <b>거의 전부.</b> 지원 안 되는
              극소수는 <b>커스텀 리소스</b>로 우회(강의 214)
            </li>
          </ul>
        </Sec>

        {/* ───────── 203 Parameters ───────── */}
        <Sec
          id="s203"
          lect="203"
          title="Parameters — 매개변수"
          l={3}
          label="상"
        >
          <ul className="pts">
            <li>
              템플릿에 <b>입력값을 주입</b>하는 방법 — 템플릿을 <b>재사용</b>
              하게 해주고, 값만 바꿀 때 템플릿을 다시 업로드할 필요가 없어짐
            </li>
            <li>
              판단 기준: <b>"이 값은 나중에 바뀔 수 있는가?"</b> → 그렇다면
              Parameter로
            </li>
            <li>
              주요 설정 — <code className="i">Type</code> ·{" "}
              <code className="i">Default</code> ·
              <code className="i">AllowedValues</code> ·{" "}
              <code className="i">AllowedPattern</code> ·
              <code className="i">Min/MaxLength</code> ·{" "}
              <code className="i">Min/MaxValue</code> ·
              <code className="i">Description</code> ·{" "}
              <code className="i">ConstraintDescription</code> ·
              <code className="i">NoEcho</code>(비밀값 가리기)
            </li>
            <li>
              참조는 <code className="i">!Ref</code> — 템플릿 어디서든 사용 가능
            </li>
          </ul>
          <table className="tbl">
            <thead>
              <tr>
                <th>Type 분류</th>
                <th>예시</th>
                <th>특징</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>기본</td>
                <td>String · Number · CommaDelimitedList · {"List<Number>"}</td>
                <td>일반 입력값</td>
              </tr>
              <tr>
                <td>AWS 특화</td>
                <td>
                  AWS::EC2::KeyPair::KeyName · {"List<AWS::EC2::Subnet::Id>"}
                </td>
                <td>
                  계정에 <b>실제 존재하는 값</b>만 선택·검증
                </td>
              </tr>
              <tr>
                <td>SSM</td>
                <td>{"AWS::SSM::Parameter::Value<...>"}</td>
                <td>Parameter Store 값 참조 — 최신 AMI 등</td>
              </tr>
            </tbody>
          </table>
          <Code
            t={`
Parameters:
  InstanceType:
    Type: String
    Default: t2.micro
    AllowedValues: [t2.micro, t2.small, m5.large]
  DBPassword:
    Type: String
    NoEcho: true              # 콘솔·API에서 값 가리기
  LatestAmiId:                # SSM Parameter Store 참조
    Type: AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>
    Default: /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64

Resources:
  MyEC2:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: !Ref InstanceType
      ImageId: !Ref LatestAmiId
`}
          />
          <h3>의사 매개변수 (Pseudo Parameters) — 선언 없이 바로 사용</h3>
          <table className="tbl">
            <thead>
              <tr>
                <th>이름</th>
                <th>값</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code className="i">AWS::AccountId</code>
                </td>
                <td>현재 계정 ID</td>
              </tr>
              <tr>
                <td>
                  <code className="i">AWS::Region</code>
                </td>
                <td>현재 리전 (예: ap-northeast-2)</td>
              </tr>
              <tr>
                <td>
                  <code className="i">AWS::StackName</code> /{" "}
                  <code className="i">AWS::StackId</code>
                </td>
                <td>스택 이름 / 스택 ID(ARN)</td>
              </tr>
              <tr>
                <td>
                  <code className="i">AWS::NotificationARNs</code>
                </td>
                <td>스택 알림 SNS 토픽 목록</td>
              </tr>
              <tr>
                <td>
                  <code className="i">AWS::NoValue</code>
                </td>
                <td>Fn::If와 함께 써서 속성을 아예 제거</td>
              </tr>
            </tbody>
          </table>
          <Exam>
            "비밀번호가 콘솔에 노출되지 않게" → <b>NoEcho: true</b>. "항상 최신
            Amazon Linux AMI로 배포" →<b> SSM public parameter 타입</b>. "현재
            리전 값이 필요" → 의사 매개변수 <b>AWS::Region</b>.
          </Exam>
        </Sec>

        {/* ───────── 204 Mappings ───────── */}
        <Sec id="s204" lect="204" title="Mappings — 매핑" l={2} label="중">
          <ul className="pts">
            <li>
              템플릿 안에 <b>하드코딩된 고정 값</b> 모음 (맵의 맵 구조)
            </li>
            <li>
              값을 <b>미리 전부 알고 있고</b>, 리전·AZ·환경(dev/prod)·계정 같은
              축으로 갈리는 값에 적합
            </li>
            <li>
              조회는{" "}
              <code className="i">!FindInMap [맵이름, 최상위키, 하위키]</code>
            </li>
          </ul>
          <FigParamVsMap />
          <Code
            t={`
Mappings:
  RegionMap:
    us-east-1:
      HVM64: ami-0ff8a91507f77f867
    ap-northeast-2:
      HVM64: ami-0a10b2721688ce9d2

Resources:
  MyEC2:
    Type: AWS::EC2::Instance
    Properties:
      # 현재 리전에 맞는 AMI를 자동 선택
      ImageId: !FindInMap [RegionMap, !Ref "AWS::Region", HVM64]
`}
          />
          <Exam>
            "리전마다 다른 AMI를 하나의 템플릿으로" →{" "}
            <b>Mappings + !FindInMap + AWS::Region</b> 조합이 정답 패턴입니다.
            사용자 입력이 필요하면 Parameters, 미리 아는 분기값이면 Mappings.
          </Exam>
        </Sec>

        {/* ───────── 205 Outputs ───────── */}
        <Sec
          id="s205"
          lect="205"
          title="Outputs — 출력 & 크로스 스택"
          l={3}
          label="상"
        >
          <ul className="pts">
            <li>
              선택 섹션 — 스택의 값을 출력하고, <b>Export</b>하면{" "}
              <b>다른 스택에서 가져다 쓸 수 있음</b>
            </li>
            <li>
              협업 패턴: 네트워크 스택이 VPC ID·SG ID를 Export → 앱 스택이{" "}
              <code className="i">!ImportValue</code>로 사용
            </li>
          </ul>
          <FigCrossStack />
          <Code
            t={`
# ── 스택 A: 내보내기 ──
Outputs:
  SSHSecurityGroup:
    Description: 회사 공용 SSH 보안 그룹
    Value: !Ref MyCompanySSHSG
    Export:
      Name: SSHSecurityGroup   # 리전 내에서 유일해야 함

# ── 스택 B: 가져오기 ──
Resources:
  MyInstance:
    Type: AWS::EC2::Instance
    Properties:
      SecurityGroups:
        - !ImportValue SSHSecurityGroup
`}
          />
          <Exam>
            두 가지가 단골입니다. ① Export 이름은 <b>계정·리전 내에서 유일</b>
            해야 한다. ② 다른 스택이 Import하고 있는 동안에는{" "}
            <b>원본 스택을 삭제할 수 없다</b>.
          </Exam>
        </Sec>

        {/* ───────── 206 Conditions ───────── */}
        <Sec id="s206" lect="206" title="Conditions — 조건" l={2} label="중">
          <ul className="pts">
            <li>
              리소스·출력의 생성을 <b>조건에 따라 제어</b> (예: prod 환경일 때만
              생성)
            </li>
            <li>
              조건 정의에 쓰는 함수 — <code className="i">!And</code> ·{" "}
              <code className="i">!Equals</code> ·<code className="i">!If</code>{" "}
              · <code className="i">!Not</code> · <code className="i">!Or</code>
            </li>
            <li>
              리소스나 Outputs에 <code className="i">Condition:</code> 키로 적용
              (매개변수에는 적용 불가)
            </li>
          </ul>
          <Code
            t={`
Conditions:
  CreateProdResources: !Equals [!Ref EnvType, prod]

Resources:
  MountPoint:
    Type: AWS::EC2::VolumeAttachment
    Condition: CreateProdResources   # prod일 때만 생성
`}
          />
        </Sec>

        {/* ───────── 207 내장 함수 ───────── */}
        <Sec
          id="s207"
          lect="207"
          title="내장 함수 (Intrinsic Functions)"
          l={3}
          label="상"
        >
          <p>
            <b>CloudFormation 파트 최다 빈출.</b> 각 함수가 "무엇을
            반환하는지"를 정확히 구분하세요.
          </p>
          <table className="tbl">
            <thead>
              <tr>
                <th>함수</th>
                <th>역할</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code className="i">!Ref</code>
                </td>
                <td>
                  매개변수 → <b>입력값</b> 반환 · 리소스 → <b>물리 ID</b> 반환
                  (예: EC2 인스턴스 ID)
                </td>
              </tr>
              <tr>
                <td>
                  <code className="i">!GetAtt</code>
                </td>
                <td>
                  리소스의 <b>속성값</b> 반환 — 예:{" "}
                  <code className="i">!GetAtt MyEC2.AvailabilityZone</code>{" "}
                  (가능한 속성은 문서 확인)
                </td>
              </tr>
              <tr>
                <td>
                  <code className="i">!FindInMap</code>
                </td>
                <td>
                  Mappings에서 값 조회 —{" "}
                  <code className="i">
                    [RegionMap, !Ref "AWS::Region", HVM64]
                  </code>
                </td>
              </tr>
              <tr>
                <td>
                  <code className="i">!ImportValue</code>
                </td>
                <td>
                  <b>다른 스택이 Export한 값</b> 가져오기
                </td>
              </tr>
              <tr>
                <td>
                  <code className="i">!Sub</code>
                </td>
                <td>
                  문자열 치환 —{" "}
                  <code className="i">
                    {'!Sub "arn:aws:s3:::${MyBucket}/*"'}
                  </code>
                </td>
              </tr>
              <tr>
                <td>
                  <code className="i">!Join</code>
                </td>
                <td>
                  구분자로 결합 —{" "}
                  <code className="i">!Join [":", [a, b, c]]</code> → "a:b:c"
                </td>
              </tr>
              <tr>
                <td>
                  <code className="i">!Base64</code>
                </td>
                <td>문자열 인코딩 — EC2 UserData 스크립트에 사용</td>
              </tr>
              <tr>
                <td>조건 함수</td>
                <td>
                  <code className="i">!If</code> ·{" "}
                  <code className="i">!Equals</code> ·{" "}
                  <code className="i">!Not</code> ·{" "}
                  <code className="i">!And</code> ·{" "}
                  <code className="i">!Or</code>
                </td>
              </tr>
              <tr>
                <td>기타</td>
                <td>
                  <code className="i">!GetAZs</code> ·{" "}
                  <code className="i">!Select</code> ·{" "}
                  <code className="i">!Split</code> ·{" "}
                  <code className="i">!Cidr</code> 등
                </td>
              </tr>
            </tbody>
          </table>
          <Code
            t={`
# 자주 나오는 조합: UserData = Base64 + Sub
UserData:
  Fn::Base64: !Sub |
    #!/bin/bash
    echo "Hello from \${AWS::StackName}"
`}
          />
          <Exam>
            선택지 구분법 — 리소스의 <b>ID</b>가 필요하면 <b>!Ref</b>, ID가 아닌{" "}
            <b>속성</b>(DNS 이름, AZ, ARN 등)은 <b>!GetAtt</b>, <b>다른 스택</b>
            의 값은 <b>!ImportValue</b>, 문자열 안에 변수를 끼워 넣으면
            <b> !Sub</b>.
          </Exam>
        </Sec>

        {/* ───────── 208 롤백 ───────── */}
        <Sec id="s208" lect="208" title="롤백 (Rollbacks)" l={3} label="상">
          <ul className="pts">
            <li>
              <b>생성 실패</b> — 기본: 모든 것이 롤백(삭제)됨, 로그에서 원인
              확인. 옵션으로 <b>롤백 비활성화</b> 시 성공한 리소스를 보존해
              트러블슈팅 가능
            </li>
            <li>
              <b>업데이트 실패</b> — 마지막으로 정상 동작하던 상태로{" "}
              <b>자동 롤백</b>
            </li>
          </ul>
          <FigCreateFail />
          <FigUpdateFail />
          <Exam>
            ① 생성 실패 후 <b>ROLLBACK_COMPLETE</b> 상태의 스택은 업데이트가
            불가능 — <b>삭제하고 다시 생성</b>해야 합니다. ② 롤백 중 실패(
            <b>UPDATE_ROLLBACK_FAILED</b>) — CFN 밖에서 리소스를 수동 변경한
            경우 등에 발생하며, 리소스를 수동으로 고친 뒤{" "}
            <b>ContinueUpdateRollback</b>으로 롤백을 재개합니다.
          </Exam>
        </Sec>

        {/* ───────── 209 서비스 역할 ───────── */}
        <Sec id="s209" lect="209" title="사용자(서비스) 역할" l={2} label="중">
          <ul className="pts">
            <li>
              <b>CFN 서비스 역할</b> — CloudFormation이 스택 리소스를{" "}
              <b>사용자 대신</b> 생성·수정·삭제하도록 만든 전용 IAM 역할
            </li>
            <li>
              용도: 사용자에게 리소스 권한을 직접 주지 않으면서(최소 권한 원칙)
              스택 작업만 허용하고 싶을 때
            </li>
            <li>
              역할을 지정하면 CFN은 <b>사용자 권한이 아니라 역할 권한</b>으로
              동작
            </li>
          </ul>
          <FigServiceRole />
          <Exam>
            서비스 역할을 쓰려면 사용자에게 <b>iam:PassRole</b> 권한이 있어야
            합니다. "역할을 CFN에 넘길 권한" — 이 키워드가 정답 포인트로 자주
            등장합니다.
          </Exam>
        </Sec>

        {/* ───────── 210 Capabilities ───────── */}
        <Sec id="s210" lect="210" title="Capabilities" l={3} label="상">
          <table className="tbl">
            <thead>
              <tr>
                <th>Capability</th>
                <th>언제 필요한가</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code className="i">CAPABILITY_IAM</code>
                </td>
                <td>
                  템플릿이 IAM 리소스(User·Role·Policy·Group 등)를 생성/변경할
                  때
                </td>
              </tr>
              <tr>
                <td>
                  <code className="i">CAPABILITY_NAMED_IAM</code>
                </td>
                <td>
                  그 IAM 리소스에 <b>사용자 지정 이름</b>이 있을 때
                </td>
              </tr>
              <tr>
                <td>
                  <code className="i">CAPABILITY_AUTO_EXPAND</code>
                </td>
                <td>
                  템플릿에 <b>매크로(Transform)나 중첩 스택</b>이 있어 배포 전
                  템플릿이 동적으로 변형될 수 있음을 승인할 때
                </td>
              </tr>
            </tbody>
          </table>
          <ul className="pts">
            <li>
              CLI/API에서는{" "}
              <code className="i">--capabilities CAPABILITY_NAMED_IAM</code>{" "}
              플래그로 명시적 승인
            </li>
          </ul>
          <Exam>
            필요한 capability를 승인하지 않고 배포하면{" "}
            <b>InsufficientCapabilitiesException</b>이 발생합니다(보안 장치).
            예외 이름 자체가 답으로 나오는 단골 문제입니다.
          </Exam>
        </Sec>

        {/* ───────── 211 삭제 정책 ───────── */}
        <Sec
          id="s211"
          lect="211"
          title="DeletionPolicy — 삭제 정책"
          l={3}
          label="상"
        >
          <p>
            스택을 삭제하거나 템플릿에서 리소스를 제거할 때의 동작을{" "}
            <b>리소스 단위</b>로 제어합니다.
          </p>
          <table className="tbl">
            <thead>
              <tr>
                <th>정책</th>
                <th>동작</th>
                <th>비고</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code className="i">Delete</code>
                </td>
                <td>리소스 삭제 (기본값)</td>
                <td>
                  예외: <b>AWS::RDS::DBCluster</b>의 기본값은 Snapshot ·{" "}
                  <b>S3 버킷은 비어 있어야</b> 삭제 성공
                </td>
              </tr>
              <tr>
                <td>
                  <code className="i">Retain</code>
                </td>
                <td>
                  스택을 지워도 리소스 <b>보존</b>
                </td>
                <td>모든 리소스에 지정 가능</td>
              </tr>
              <tr>
                <td>
                  <code className="i">Snapshot</code>
                </td>
                <td>
                  삭제 전 <b>최종 스냅샷</b> 생성
                </td>
                <td>
                  지원: EBS Volume · ElastiCache Cluster/ReplicationGroup · RDS
                  DBInstance/DBCluster · Redshift · Neptune
                </td>
              </tr>
            </tbody>
          </table>
          <Code
            t={`
Resources:
  MyVolume:
    Type: AWS::EC2::Volume
    DeletionPolicy: Snapshot   # 삭제 전 스냅샷 생성
  MyBucket:
    Type: AWS::S3::Bucket
    DeletionPolicy: Retain     # 스택 삭제 후에도 보존
`}
          />
          <Exam>
            "스택은 지우되 데이터는 남기고 싶다" → <b>Retain</b>. "삭제 전 백업"
            → <b>Snapshot</b>(지원 리소스 목록 암기). "RDS DBCluster를 그냥
            지웠는데 스냅샷이 생겼다" → 기본값이 Snapshot이기 때문입니다.
          </Exam>
        </Sec>

        {/* ───────── 212 스택 정책 ───────── */}
        <Sec
          id="s212"
          lect="212"
          title="스택 정책 (Stack Policy)"
          l={2}
          label="중"
        >
          <ul className="pts">
            <li>
              <b>업데이트 중</b> 의도치 않은 리소스 변경을 막는 JSON 문서
            </li>
            <li>
              스택 정책을 설정하는 순간 <b>모든 리소스가 기본 보호</b>됨 →
              업데이트를 허용할 리소스만
              <b> 명시적으로 Allow</b>
            </li>
          </ul>
          <Code
            t={`
{
  "Statement": [
    { "Effect": "Allow", "Action": "Update:*",
      "Principal": "*", "Resource": "*" },
    { "Effect": "Deny", "Action": "Update:*",
      "Principal": "*",
      "Resource": "LogicalResourceId/ProductionDatabase" }
  ]
}
`}
          />
          <Exam>
            "업데이트로부터 프로덕션 DB를 보호"가 나오면 스택 정책. <b>삭제</b>
            로부터의 보호(종료 방지, DeletionPolicy)와 헷갈리게 출제됩니다 —
            스택 정책은 <b>업데이트</b> 보호입니다.
          </Exam>
        </Sec>

        {/* ───────── 213 종료 방지 ───────── */}
        <Sec
          id="s213"
          lect="213"
          title="종료 방지 (Termination Protection)"
          l={1}
          label="하"
        >
          <ul className="pts">
            <li>
              실수로 인한 <b>스택 삭제를 차단</b>하는 스위치 — 기본은 비활성화
            </li>
            <li>
              켜져 있으면 삭제 시도 자체가 거부됨 → 지우려면 먼저{" "}
              <b>종료 방지를 해제</b>해야 함
            </li>
          </ul>
        </Sec>

        {/* ───────── 214 커스텀 리소스 ───────── */}
        <Sec
          id="s214"
          lect="214"
          title="사용자 지정 리소스 (Custom Resources)"
          l={2}
          label="중"
        >
          <ul className="pts">
            <li>
              용도 ① CFN이 아직 지원하지 않는 리소스 ② AWS 밖의
              리소스(온프레미스·서드파티) ③ 생성/업데이트/삭제 시점에{" "}
              <b>커스텀 스크립트(Lambda) 실행</b>
            </li>
            <li>
              정의: <code className="i">Custom::리소스명</code> + 필수 속성{" "}
              <code className="i">ServiceToken</code>
              (Lambda ARN 또는 SNS ARN — <b>스택과 같은 리전</b>)
            </li>
            <li>
              CFN과 Lambda의 요청/응답은 <b>사전 서명된(pre-signed) S3 URL</b>로
              오감
            </li>
          </ul>
          <FigCustomResource />
          <Code
            t={`
Resources:
  EmptyBucketOnDelete:
    Type: Custom::EmptyS3Bucket
    Properties:
      ServiceToken: !GetAtt EmptyBucketLambda.Arn  # 필수
      BucketName: !Ref MyBucket
`}
          />
          <Exam>
            대표 시나리오 — "객체가 들어있는 S3 버킷 때문에 스택 삭제가
            실패한다. 어떻게 자동화할까?" →<b> 커스텀 리소스(Lambda)</b>가 삭제
            이벤트 때 버킷을 먼저 비우게 합니다. S3 버킷은 비어 있어야만
            삭제되기 때문입니다.
          </Exam>
        </Sec>

        {/* ───────── 215 StackSets ───────── */}
        <Sec id="s215" lect="215" title="StackSets" l={2} label="중">
          <ul className="pts">
            <li>
              <b>하나의 작업</b>으로 <b>여러 계정 × 여러 리전</b>에 스택을
              생성·업데이트·삭제
            </li>
            <li>
              <b>관리자 계정</b>이 StackSet을 만들고, 대상 계정들에 스택
              인스턴스를 배포
            </li>
            <li>
              StackSet을 업데이트하면 <b>모든 계정·리전의 모든 스택 인스턴스</b>
              가 업데이트됨
            </li>
            <li>
              권한 모델: Self-managed(IAM 역할 직접 구성) / Service-managed(AWS
              Organizations 연동 — 새 계정 자동 배포 가능)
            </li>
          </ul>
          <FigStackSets />
          <Exam>
            문제에 <b>"여러 리전"과 "여러 계정"</b>이 함께 등장하면 거의 항상
            StackSets가 정답입니다. 단일 계정·단일 리전이면 일반 스택으로
            충분합니다.
          </Exam>
        </Sec>

        {/* ───────── 최종 체크리스트 ───────── */}
        <section className="card" id="final">
          <div className="shead">
            <span className="lect">FINAL</span>
            <h2>시험 직전 최종 체크리스트</h2>
          </div>
          <p className="progress">
            {doneCount} / {CHECKS.length} 확인 완료
          </p>
          <ul className="check">
            {CHECKS.map((c, i) => (
              <li key={i}>
                <label className={done[i] ? "on" : ""}>
                  <input
                    type="checkbox"
                    checked={!!done[i]}
                    onChange={() => toggle(i)}
                  />
                  <span>{c}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>

        <footer>
          AWS DVA-C02 · CloudFormation (강의 198–215) · 빈출도는 체감 지표
        </footer>
      </main>
    </div>
  );
}
