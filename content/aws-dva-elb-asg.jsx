//fable 5 high
import React, { useState, useEffect } from "react";

/* ================= 디자인 토큰 ================= */
const C = {
  bg: "#EDF1F4",
  panel: "#FFFFFF",
  ink: "#17222D",
  sub: "#5B6B7B",
  line: "#D9E0E7",
  teal: "#0F646B",
  tealSoft: "#E1EFF0",
  amber: "#C9691A",
  amberSoft: "#FBEFDF",
  violet: "#5B54BC",
  violetSoft: "#ECEAF9",
  green: "#2E8B57",
  greenSoft: "#E4F2EA",
  red: "#C24040",
  redSoft: "#FAE8E8",
  ecs: "#8A6D1F",
};
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const css = `
  .dva-root { font-family: 'Pretendard Variable', Pretendard, 'Noto Sans KR', -apple-system, 'Apple SD Gothic Neo', sans-serif; color:${C.ink}; background:${C.bg}; min-height:100vh; }
  .dva-layout { display:flex; max-width:1180px; margin:0 auto; gap:24px; padding:24px; align-items:flex-start; }
  .dva-side { width:250px; flex:none; position:sticky; top:16px; max-height:calc(100vh - 32px); overflow-y:auto; }
  .dva-main { flex:1; min-width:0; }
  .dva-navitem { display:flex; align-items:center; gap:8px; width:100%; text-align:left; border:0; background:transparent; padding:9px 12px; border-radius:8px; cursor:pointer; font-size:13.5px; color:${C.sub}; font-family:inherit; line-height:1.35; }
  .dva-navitem:hover { background:#E4EAEE; color:${C.ink}; }
  .dva-navitem.on { background:${C.teal}; color:#fff; }
  .dva-navitem.on .dots span { background:rgba(255,255,255,.35); }
  .dva-navitem.on .dots span.f { background:#F2B36B; }
  @media (max-width: 880px) {
    .dva-layout { flex-direction:column; padding:12px; gap:12px; }
    .dva-side { position:static; width:100%; max-height:none; }
    .dva-side .navlist { display:flex; overflow-x:auto; gap:6px; padding-bottom:6px; }
    .dva-navitem { white-space:nowrap; width:auto; }
    .dva-side .navnum { display:none; }
  }
  .dva-card { background:${C.panel}; border:1px solid ${C.line}; border-radius:14px; padding:26px 28px; }
  @media (max-width:880px){ .dva-card { padding:18px 16px; } }
  .diagram { border:1px solid ${C.line}; border-radius:12px; padding:14px 10px 6px; margin:16px 0;
    background-image: radial-gradient(#D7DFE6 1px, transparent 1px); background-size:18px 18px; background-color:#FBFCFD; }
  .diagram svg { width:100%; height:auto; display:block; }
  .dcap { font-size:12px; color:${C.sub}; text-align:center; padding:8px 6px 6px; }
  table.dt { width:100%; border-collapse:collapse; font-size:13.5px; margin:14px 0; }
  table.dt th { background:${C.tealSoft}; color:${C.teal}; text-align:left; padding:8px 10px; border:1px solid ${C.line}; font-weight:700; }
  table.dt td { padding:8px 10px; border:1px solid ${C.line}; vertical-align:top; line-height:1.55; }
  .dva-main ::selection { background:${C.amberSoft}; }
`;

/* ================= 공통 UI ================= */
const Freq = ({ n, compact }) => {
  const label = ["출제 거의 없음", "낮음", "보통", "높음"][n];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        background: n >= 3 ? C.amberSoft : "#EFF2F5",
        border: `1px solid ${n >= 3 ? "#EFD8B8" : C.line}`,
        borderRadius: 999,
        padding: "4px 12px",
        fontSize: 12.5,
        fontWeight: 700,
        color: n >= 3 ? C.amber : C.sub,
      }}
    >
      <span style={{ display: "inline-flex", gap: 3 }}>
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: 99,
              background: i <= n ? C.amber : "#C9D2DA",
            }}
          />
        ))}
      </span>
      {!compact && <>빈출도 · {label}</>}
    </span>
  );
};

const H3 = ({ children }) => (
  <h3
    style={{
      fontSize: 16.5,
      fontWeight: 800,
      margin: "26px 0 8px",
      display: "flex",
      alignItems: "center",
      gap: 8,
    }}
  >
    <span
      style={{
        width: 4,
        height: 16,
        borderRadius: 2,
        background: C.teal,
        flex: "none",
      }}
    />
    {children}
  </h3>
);

const P = ({ children }) => (
  <p
    style={{
      fontSize: 14.5,
      lineHeight: 1.75,
      margin: "8px 0",
      color: "#28323D",
    }}
  >
    {children}
  </p>
);

const Ul = ({ items }) => (
  <ul style={{ margin: "8px 0", paddingLeft: 4, listStyle: "none" }}>
    {items.map((it, i) => (
      <li
        key={i}
        style={{
          fontSize: 14.5,
          lineHeight: 1.7,
          margin: "6px 0",
          display: "flex",
          gap: 9,
        }}
      >
        <span
          style={{ color: C.teal, fontWeight: 800, flex: "none", marginTop: 1 }}
        >
          ›
        </span>
        <span>{it}</span>
      </li>
    ))}
  </ul>
);

const K = ({ children, c = C.teal, bg = C.tealSoft }) => (
  <code
    style={{
      fontFamily: MONO,
      fontSize: "0.9em",
      background: bg,
      color: c,
      padding: "1px 6px",
      borderRadius: 5,
      fontWeight: 600,
    }}
  >
    {children}
  </code>
);
const Ko = ({ children }) => (
  <K c={C.amber} bg={C.amberSoft}>
    {children}
  </K>
);
const B = ({ children }) => (
  <strong style={{ fontWeight: 800 }}>{children}</strong>
);

const Exam = ({ title = "시험 포인트", children }) => (
  <div
    style={{
      border: `1px solid #EFD3AC`,
      borderLeft: `4px solid ${C.amber}`,
      background: C.amberSoft,
      borderRadius: 10,
      padding: "12px 16px",
      margin: "14px 0",
    }}
  >
    <div
      style={{
        fontSize: 12.5,
        fontWeight: 800,
        color: C.amber,
        letterSpacing: ".04em",
        marginBottom: 4,
      }}
    >
      ★ {title}
    </div>
    <div style={{ fontSize: 13.8, lineHeight: 1.7 }}>{children}</div>
  </div>
);

const Note = ({ children }) => (
  <div
    style={{
      borderLeft: `3px solid ${C.line}`,
      padding: "4px 14px",
      margin: "12px 0",
      color: C.sub,
      fontSize: 13.5,
      lineHeight: 1.65,
    }}
  >
    {children}
  </div>
);

const Table = ({ head, rows }) => (
  <div style={{ overflowX: "auto" }}>
    <table className="dt">
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

const Diagram = ({ vb, cap, children }) => (
  <figure className="diagram" style={{ marginLeft: 0, marginRight: 0 }}>
    <svg viewBox={vb} xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
    {cap && <figcaption className="dcap">{cap}</figcaption>}
  </figure>
);

/* ================= SVG 프리미티브 ================= */
const Defs = ({
  id,
  colors = [C.sub, C.teal, C.amber, C.red, C.green, C.violet],
}) => (
  <defs>
    {colors.map((col, i) => (
      <marker
        key={i}
        id={`${id}-a${i}`}
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M0,0 L10,5 L0,10 z" fill={col} />
      </marker>
    ))}
  </defs>
);
// colors index: 0 sub / 1 teal / 2 amber / 3 red / 4 green / 5 violet
const AR = { sub: 0, teal: 1, amber: 2, red: 3, green: 4, violet: 5 };
const ARC = [C.sub, C.teal, C.amber, C.red, C.green, C.violet];

const Box = ({
  x,
  y,
  w,
  h,
  fill = "#fff",
  stroke = "#9AA8B5",
  sw = 1.4,
  r = 9,
  dash,
  title,
  sub2,
  tFill = C.ink,
  tSize = 13,
  mono,
}) => (
  <g>
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={r}
      fill={fill}
      stroke={stroke}
      strokeWidth={sw}
      strokeDasharray={dash}
    />
    {title && (
      <text
        x={x + w / 2}
        y={y + h / 2 + (sub2 ? -4 : 4.5)}
        textAnchor="middle"
        fontSize={tSize}
        fontWeight="700"
        fill={tFill}
        fontFamily={mono ? MONO : "inherit"}
      >
        {title}
      </text>
    )}
    {sub2 && (
      <text
        x={x + w / 2}
        y={y + h / 2 + 13}
        textAnchor="middle"
        fontSize={10.5}
        fill={C.sub}
        fontFamily={MONO}
      >
        {sub2}
      </text>
    )}
  </g>
);

const Arrow = ({
  d,
  x1,
  y1,
  x2,
  y2,
  mk,
  ci = 0,
  dash,
  w = 1.6,
  label,
  lx,
  ly,
  lFill,
  lSize = 11,
  mono = true,
}) => (
  <g>
    <path
      d={d || `M${x1},${y1} L${x2},${y2}`}
      fill="none"
      stroke={ARC[ci]}
      strokeWidth={w}
      strokeDasharray={dash}
      markerEnd={`url(#${mk}-a${ci})`}
    />
    {label && (
      <text
        x={lx ?? (x1 + x2) / 2}
        y={ly ?? (y1 + y2) / 2 - 7}
        textAnchor="middle"
        fontSize={lSize}
        fontWeight="700"
        fill={lFill || ARC[ci]}
        fontFamily={mono ? MONO : "inherit"}
      >
        {label}
      </text>
    )}
  </g>
);

const Label = ({
  x,
  y,
  t,
  fill = C.sub,
  size = 11,
  anchor = "middle",
  mono = true,
  weight = 700,
}) => (
  <text
    x={x}
    y={y}
    textAnchor={anchor}
    fontSize={size}
    fontWeight={weight}
    fill={fill}
    fontFamily={mono ? MONO : "inherit"}
  >
    {t}
  </text>
);

const User = ({ x, y, label, fill = C.sub }) => (
  <g>
    <circle
      cx={x}
      cy={y - 9}
      r={6.5}
      fill="none"
      stroke={fill}
      strokeWidth="1.6"
    />
    <path
      d={`M${x - 11},${y + 12} q11,-16 22,0`}
      fill="none"
      stroke={fill}
      strokeWidth="1.6"
    />
    {label && <Label x={x} y={y + 27} t={label} fill={fill} mono={false} />}
  </g>
);

const EC2 = ({ x, y, w = 74, h = 40, label = "EC2", state, sub2 }) => {
  const map = {
    ok: [C.green, C.greenSoft],
    bad: [C.red, C.redSoft],
    new: [C.violet, C.violetSoft],
    drain: [C.amber, C.amberSoft],
  };
  const [st, bg] = map[state] || ["#9AA8B5", "#fff"];
  return (
    <g>
      <Box
        x={x}
        y={y}
        w={w}
        h={h}
        fill={bg}
        stroke={st}
        title={label}
        sub2={sub2}
        tSize={12}
      />
      {state === "ok" && (
        <Label x={x + w - 11} y={y + 14} t="✓" fill={C.green} size={12} />
      )}
      {state === "bad" && (
        <Label x={x + w - 11} y={y + 14} t="✕" fill={C.red} size={12} />
      )}
    </g>
  );
};

const AZBound = ({ x, y, w, h, name }) => (
  <g>
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={12}
      fill="none"
      stroke="#B7C3CE"
      strokeWidth="1.3"
      strokeDasharray="6 5"
    />
    <Label
      x={x + 14}
      y={y + 18}
      t={name}
      fill="#8595A4"
      anchor="start"
      size={11}
    />
  </g>
);

/* ================= 다이어그램 ================= */

// 1. 수직 vs 수평 확장
const DScaling = () => (
  <Diagram
    vb="0 0 720 250"
    cap="수직 확장(Scale Up)은 인스턴스 자체를 키우고, 수평 확장(Scale Out)은 인스턴스 수를 늘립니다"
  >
    <Defs id="sc" />
    <Label
      x={180}
      y={26}
      t="수직 확장 (Scale Up / Down)"
      fill={C.teal}
      size={13}
      mono={false}
    />
    <Box
      x={120}
      y={150}
      w={70}
      h={50}
      fill={C.tealSoft}
      stroke={C.teal}
      title="EC2"
      sub2="t2.micro"
      tSize={12}
    />
    <Arrow mk="sc" ci={1} x1={205} y1={172} x2={255} y2={172} label="크기 ↑" />
    <Box
      x={262}
      y={115}
      w={95}
      h={85}
      fill={C.tealSoft}
      stroke={C.teal}
      title="EC2"
      sub2="u-12tb1.metal"
      tSize={13}
    />
    <Label
      x={180}
      y={228}
      t="예: DB(RDS·ElastiCache) 등 비분산 시스템 · 하드웨어 한계 존재"
      size={10.5}
      mono={false}
    />
    <line
      x1={400}
      y1={40}
      x2={400}
      y2={220}
      stroke={C.line}
      strokeWidth="1.5"
    />
    <Label
      x={555}
      y={26}
      t="수평 확장 (Scale Out / In)"
      fill={C.violet}
      size={13}
      mono={false}
    />
    <Box
      x={430}
      y={150}
      w={70}
      h={50}
      fill={C.violetSoft}
      stroke={C.violet}
      title="EC2"
      tSize={12}
    />
    <Arrow mk="sc" ci={5} x1={512} y1={172} x2={548} y2={172} label="개수 ↑" />
    <Box
      x={555}
      y={122}
      w={62}
      h={44}
      fill={C.violetSoft}
      stroke={C.violet}
      title="EC2"
      tSize={12}
    />
    <Box
      x={625}
      y={122}
      w={62}
      h={44}
      fill={C.violetSoft}
      stroke={C.violet}
      title="EC2"
      tSize={12}
    />
    <Box
      x={555}
      y={172}
      w={62}
      h={44}
      fill={C.violetSoft}
      stroke={C.violet}
      title="EC2"
      tSize={12}
    />
    <Box
      x={625}
      y={172}
      w={62}
      h={44}
      fill={C.violetSoft}
      stroke={C.violet}
      title="EC2"
      tSize={12}
    />
    <Label
      x={555}
      y={228}
      t="분산 시스템 · ASG + ELB로 구현"
      size={10.5}
      mono={false}
    />
  </Diagram>
);

// 1b. 고가용성 Multi-AZ
const DHA = () => (
  <Diagram
    vb="0 0 720 235"
    cap="고가용성: 최소 2개 이상의 가용 영역(AZ)에 걸쳐 애플리케이션을 실행 → 한 AZ(데이터센터)가 재해로 중단돼도 서비스 유지"
  >
    <Defs id="ha" />
    <User x={60} y={110} label="사용자" />
    <Box
      x={130}
      y={85}
      w={100}
      h={52}
      fill={C.tealSoft}
      stroke={C.teal}
      title="ELB"
      sub2="Multi-AZ"
    />
    <AZBound x={280} y={30} w={190} h={175} name="AZ-1 (ap-northeast-1a)" />
    <AZBound x={495} y={30} w={190} h={175} name="AZ-2 (ap-northeast-1c)" />
    <EC2 x={310} y={60} state="ok" />
    <EC2 x={310} y={115} state="ok" />
    <EC2 x={525} y={60} state="ok" />
    <EC2 x={525} y={115} state="ok" />
    <Arrow mk="ha" ci={1} x1={232} y1={100} x2={305} y2={82} />
    <Arrow mk="ha" ci={1} x1={232} y1={120} x2={520} y2={90} />
    <Arrow mk="ha" ci={0} x1={90} y1={110} x2={126} y2={110} />
    <Label x={375} y={192} t="AZ-1 장애 시" fill={C.red} size={11} />
    <Label x={590} y={192} t="AZ-2가 트래픽 처리" fill={C.green} size={11} />
  </Diagram>
);

// 2. ELB 개요 + 헬스체크
const DELB = () => (
  <Diagram
    vb="0 0 720 260"
    cap="ELB는 트래픽을 정상(healthy) 인스턴스에만 분산합니다. 헬스체크에 실패한 인스턴스로는 트래픽을 보내지 않습니다"
  >
    <Defs id="el" />
    <User x={52} y={70} label="사용자 1" />
    <User x={52} y={140} label="사용자 2" />
    <User x={52} y={210} label="사용자 3" />
    <Box
      x={150}
      y={95}
      w={130}
      h={80}
      fill={C.tealSoft}
      stroke={C.teal}
      title="Elastic Load"
      sub2="Balancer"
      tSize={13.5}
    />
    <Label
      x={215}
      y={90}
      t="단일 접근점 (고정 DNS)"
      fill={C.teal}
      size={10.5}
    />
    <Arrow mk="el" ci={0} x1={82} y1={65} x2={145} y2={105} />
    <Arrow mk="el" ci={0} x1={82} y1={140} x2={145} y2={137} />
    <Arrow mk="el" ci={0} x1={82} y1={210} x2={145} y2={165} />
    <EC2 x={440} y={40} state="ok" sub2="healthy" h={46} w={90} />
    <EC2 x={440} y={110} state="ok" sub2="healthy" h={46} w={90} />
    <EC2 x={440} y={185} state="bad" sub2="unhealthy" h={46} w={90} />
    <Arrow mk="el" ci={4} x1={285} y1={115} x2={435} y2={66} />
    <Arrow mk="el" ci={4} x1={285} y1={137} x2={435} y2={133} />
    <Arrow
      mk="el"
      ci={3}
      dash="5 4"
      x1={285}
      y1={160}
      x2={435}
      y2={205}
      label="트래픽 차단"
      lx={355}
      ly={200}
    />
    <Arrow
      mk="el"
      ci={2}
      d="M300,230 C360,255 400,245 436,222"
      x1={300}
      y1={230}
      x2={436}
      y2={222}
      dash="3 3"
      label="Health Check: GET /health :4567"
      lx={368}
      ly={252}
    />
    <Label
      x={648}
      y={62}
      t="200 OK ✓"
      fill={C.green}
      size={11}
      anchor="start"
    />
    <Label
      x={648}
      y={133}
      t="200 OK ✓"
      fill={C.green}
      size={11}
      anchor="start"
    />
    <Label
      x={648}
      y={208}
      t="응답 없음 ✕"
      fill={C.red}
      size={11}
      anchor="start"
    />
  </Diagram>
);

// 2b. 보안그룹 구성
const DSG = () => (
  <Diagram
    vb="0 0 720 190"
    cap="보안 그룹 모범 사례: EC2는 로드밸런서의 보안 그룹에서 오는 트래픽만 허용 (소스 = ELB의 SG)"
  >
    <Defs id="sg" />
    <User x={70} y={90} label="사용자" />
    <Arrow
      mk="sg"
      ci={0}
      x1={100}
      y1={88}
      x2={185}
      y2={88}
      label="HTTP/HTTPS"
      ly={78}
    />
    <Box
      x={190}
      y={55}
      w={140}
      h={66}
      fill={C.tealSoft}
      stroke={C.teal}
      title="ELB"
      sub2="SG: sg-elb"
    />
    <Label
      x={260}
      y={145}
      t="인바운드: 0.0.0.0/0 :80/:443"
      fill={C.teal}
      size={10.5}
    />
    <Arrow
      mk="sg"
      ci={1}
      x1={335}
      y1={88}
      x2={455}
      y2={88}
      label="HTTP"
      ly={78}
    />
    <Box
      x={460}
      y={55}
      w={150}
      h={66}
      fill="#fff"
      stroke="#9AA8B5"
      title="EC2"
      sub2="SG: sg-app"
    />
    <Label
      x={537}
      y={145}
      t="인바운드: 소스 = sg-elb 만"
      fill={C.amber}
      size={10.5}
    />
    <Label
      x={537}
      y={162}
      t="→ 사용자가 EC2로 직접 접근 불가"
      size={10.5}
      mono={false}
    />
  </Diagram>
);

// 4. ALB 라우팅
const DALB = () => (
  <Diagram
    vb="0 0 720 300"
    cap="ALB(L7)는 경로·호스트·쿼리스트링·헤더 기반으로 여러 대상 그룹에 라우팅 — 하나의 ALB로 여러 애플리케이션 처리"
  >
    <Defs id="al" />
    <User x={50} y={130} label="클라이언트" />
    <Box
      x={125}
      y={95}
      w={120}
      h={80}
      fill={C.tealSoft}
      stroke={C.teal}
      title="ALB"
      sub2="Layer 7 · HTTP"
      tSize={14}
    />
    <Arrow mk="al" ci={0} x1={80} y1={130} x2={120} y2={132} />
    <Box
      x={300}
      y={20}
      w={185}
      h={56}
      fill="#fff"
      stroke={C.teal}
      title="대상 그룹 1"
      sub2="/user/* → 사용자 앱"
      tSize={12}
    />
    <Box
      x={300}
      y={95}
      w={185}
      h={56}
      fill="#fff"
      stroke={C.teal}
      title="대상 그룹 2"
      sub2="/search/* → 검색 앱"
      tSize={12}
    />
    <Box
      x={300}
      y={170}
      w={185}
      h={56}
      fill="#fff"
      stroke={C.teal}
      title="대상 그룹 3"
      sub2="api.example.com (호스트)"
      tSize={12}
    />
    <Box
      x={300}
      y={245}
      w={185}
      h={50}
      fill="#fff"
      stroke={C.teal}
      title="대상 그룹 4"
      sub2="?Platform=Mobile (쿼리)"
      tSize={12}
    />
    <Arrow mk="al" ci={1} x1={248} y1={110} x2={295} y2={52} />
    <Arrow mk="al" ci={1} x1={248} y1={130} x2={295} y2={123} />
    <Arrow mk="al" ci={1} x1={248} y1={152} x2={295} y2={195} />
    <Arrow mk="al" ci={1} x1={248} y1={168} x2={295} y2={268} />
    <EC2 x={545} y={26} w={68} h={44} state="ok" />
    <EC2 x={623} y={26} w={68} h={44} state="ok" />
    <EC2 x={545} y={101} w={68} h={44} state="ok" />
    <Box
      x={545}
      y={176}
      w={146}
      h={44}
      fill="#F5EFDD"
      stroke={C.ecs}
      title="ECS Task"
      sub2="동적 포트"
      tSize={12}
    />
    <Box
      x={545}
      y={248}
      w={146}
      h={44}
      fill={C.violetSoft}
      stroke={C.violet}
      title="Lambda"
      tSize={12}
    />
    <Arrow mk="al" ci={0} x1={488} y1={48} x2={540} y2={48} />
    <Arrow mk="al" ci={0} x1={488} y1={123} x2={540} y2={123} />
    <Arrow mk="al" ci={0} x1={488} y1={198} x2={540} y2={198} />
    <Arrow mk="al" ci={0} x1={488} y1={270} x2={540} y2={270} />
  </Diagram>
);

// 4b. X-Forwarded-For
const DXFF = () => (
  <Diagram
    vb="0 0 720 180"
    cap="ALB가 연결을 종료(terminate)하므로 서버는 ALB의 사설 IP만 봅니다 → 실제 클라이언트 정보는 X-Forwarded-* 헤더로 전달"
  >
    <Defs id="xf" />
    <User x={65} y={85} label="클라이언트" />
    <Label x={65} y={135} t="12.34.56.78" fill={C.amber} size={11} />
    <Arrow
      mk="xf"
      ci={0}
      x1={100}
      y1={85}
      x2={230}
      y2={85}
      label="요청"
      mono={false}
    />
    <Box
      x={235}
      y={52}
      w={130}
      h={64}
      fill={C.tealSoft}
      stroke={C.teal}
      title="ALB"
      sub2="연결 종료"
    />
    <Arrow
      mk="xf"
      ci={2}
      x1={370}
      y1={85}
      x2={520}
      y2={85}
      label="새 연결 (ALB 사설 IP)"
      ly={73}
    />
    <Box
      x={525}
      y={52}
      w={120}
      h={64}
      fill="#fff"
      stroke="#9AA8B5"
      title="EC2"
      sub2="백엔드"
    />
    <Label
      x={445}
      y={125}
      t="X-Forwarded-For: 12.34.56.78"
      fill={C.amber}
      size={11.5}
    />
    <Label x={445} y={143} t="X-Forwarded-Port: 443" fill={C.sub} size={11} />
    <Label
      x={445}
      y={160}
      t="X-Forwarded-Proto: https"
      fill={C.sub}
      size={11}
    />
  </Diagram>
);

// 5. NLB
const DNLB = () => (
  <Diagram
    vb="0 0 720 235"
    cap="NLB(L4)는 AZ당 1개의 고정 IP(EIP 지정 가능)를 갖고, TCP/UDP 트래픽을 초저지연으로 처리"
  >
    <Defs id="nl" />
    <User x={55} y={110} label="클라이언트" />
    <Box
      x={140}
      y={75}
      w={140}
      h={72}
      fill={C.violetSoft}
      stroke={C.violet}
      title="NLB"
      sub2="Layer 4 · TCP/UDP"
      tSize={14}
    />
    <Label
      x={210}
      y={168}
      t="AZ당 고정 IP 1개 (EIP 가능)"
      fill={C.violet}
      size={10.5}
    />
    <Label x={210} y={185} t="수백만 req/s · ~100ms 지연" size={10.5} />
    <Arrow
      mk="nl"
      ci={0}
      x1={88}
      y1={110}
      x2={135}
      y2={111}
      label="TCP :443"
      ly={98}
    />
    <AZBound x={330} y={28} w={175} h={180} name="AZ-1" />
    <EC2 x={362} y={62} state="ok" sub2="EC2 대상" h={46} w={110} />
    <EC2 x={362} y={130} state="ok" sub2="사설 IP 대상" h={46} w={110} />
    <Arrow mk="nl" ci={5} x1={283} y1={95} x2={357} y2={85} />
    <Arrow mk="nl" ci={5} x1={283} y1={120} x2={357} y2={148} />
    <Box
      x={545}
      y={75}
      w={150}
      h={72}
      fill={C.tealSoft}
      stroke={C.teal}
      title="ALB"
      sub2="NLB → ALB 조합"
    />
    <Arrow
      mk="nl"
      ci={5}
      d="M283,138 C400,225 480,180 540,125"
      x1={283}
      y1={138}
      x2={540}
      y2={125}
      dash="5 4"
      label="고정 IP + L7 규칙 조합"
      lx={470}
      ly={215}
    />
  </Diagram>
);

// 6. GWLB
const DGWLB = () => (
  <Diagram
    vb="0 0 720 265"
    cap="GWLB(L3)는 모든 트래픽을 서드파티 보안 어플라이언스로 우회시킨 뒤, 통과한 트래픽만 애플리케이션에 전달 (GENEVE :6081)"
  >
    <Defs id="gw" />
    <User x={55} y={60} label="사용자" />
    <Arrow
      mk="gw"
      ci={0}
      x1={88}
      y1={58}
      x2={165}
      y2={58}
      label="① 트래픽"
      mono={false}
    />
    <Box
      x={170}
      y={30}
      w={150}
      h={56}
      fill={C.tealSoft}
      stroke={C.teal}
      title="GWLB"
      sub2="Layer 3 · IP 패킷"
      tSize={13}
    />
    <Box
      x={170}
      y={150}
      w={470}
      h={90}
      fill="#FBFCFD"
      stroke="#B7C3CE"
      dash="6 5"
      r={12}
    />
    <Label
      x={252}
      y={172}
      t="대상 그룹: 가상 어플라이언스"
      fill="#8595A4"
      anchor="middle"
      size={10.5}
    />
    <Box
      x={195}
      y={185}
      w={125}
      h={42}
      fill={C.redSoft}
      stroke={C.red}
      title="방화벽"
      tSize={12}
    />
    <Box
      x={335}
      y={185}
      w={125}
      h={42}
      fill={C.redSoft}
      stroke={C.red}
      title="IDS / IPS"
      tSize={12}
    />
    <Box
      x={475}
      y={185}
      w={140}
      h={42}
      fill={C.redSoft}
      stroke={C.red}
      title="패킷 검사(DPI)"
      tSize={12}
    />
    <Arrow
      mk="gw"
      ci={3}
      x1={230}
      y1={90}
      x2={230}
      y2={180}
      label="② GENEVE :6081"
      lx={310}
      ly={120}
    />
    <Arrow
      mk="gw"
      ci={4}
      x1={300}
      y1={180}
      x2={300}
      y2={92}
      label="③ 검사 통과"
      lx={368}
      ly={140}
      mono={false}
    />
    <Arrow
      mk="gw"
      ci={1}
      x1={325}
      y1={58}
      x2={545}
      y2={58}
      label="④ 정상 트래픽만 전달"
      mono={false}
    />
    <Box
      x={550}
      y={32}
      w={130}
      h={52}
      fill="#fff"
      stroke="#9AA8B5"
      title="애플리케이션"
      tSize={12.5}
    />
  </Diagram>
);

// 7. Sticky Sessions
const DSticky = () => (
  <Diagram
    vb="0 0 720 225"
    cap="스티키 세션: 쿠키를 가진 클라이언트는 항상 같은 인스턴스로 라우팅 → 세션 데이터 유지 (부하 불균형 가능)"
  >
    <Defs id="st" />
    <User x={55} y={70} label="클라이언트 A" fill={C.amber} />
    <User x={55} y={165} label="클라이언트 B" fill={C.violet} />
    <Label x={55} y={112} t="Cookie: AWSALB=aaa" fill={C.amber} size={10} />
    <Label x={55} y={207} t="Cookie: AWSALB=bbb" fill={C.violet} size={10} />
    <Box
      x={215}
      y={85}
      w={120}
      h={70}
      fill={C.tealSoft}
      stroke={C.teal}
      title="ALB"
      sub2="Sticky ON"
    />
    <Arrow mk="st" ci={2} x1={95} y1={68} x2={210} y2={100} />
    <Arrow mk="st" ci={5} x1={95} y1={163} x2={210} y2={140} />
    <EC2 x={470} y={45} state="ok" w={110} h={48} sub2="A 전용" />
    <EC2 x={470} y={140} state="ok" w={110} h={48} sub2="B 전용" />
    <Arrow
      mk="st"
      ci={2}
      x1={340}
      y1={105}
      x2={465}
      y2={72}
      label="항상 인스턴스 1"
      mono={false}
      lx={405}
      ly={70}
    />
    <Arrow
      mk="st"
      ci={5}
      x1={340}
      y1={135}
      x2={465}
      y2={162}
      label="항상 인스턴스 2"
      mono={false}
      lx={405}
      ly={178}
    />
  </Diagram>
);

// 8. Cross-Zone
const DCross = () => (
  <Diagram
    vb="0 0 720 320"
    cap="교차 영역 활성화: 전체 10개 인스턴스에 각 10%씩 균등 분산 · 비활성화: AZ 단위로 50%씩 분배(인스턴스별 불균형)"
  >
    <Defs id="cz" />
    <Label
      x={185}
      y={22}
      t="Cross-Zone ON"
      fill={C.green}
      size={13}
      mono={false}
    />
    <AZBound x={30} y={35} w={155} h={250} name="AZ-1" />
    <AZBound x={200} y={35} w={155} h={250} name="AZ-2" />
    <Box
      x={55}
      y={60}
      w={105}
      h={36}
      fill={C.tealSoft}
      stroke={C.teal}
      title="ELB"
      tSize={12}
    />
    <Box
      x={225}
      y={60}
      w={105}
      h={36}
      fill={C.tealSoft}
      stroke={C.teal}
      title="ELB"
      tSize={12}
    />
    <EC2 x={48} y={115} w={56} h={34} label="10%" state="ok" />
    <EC2 x={112} y={115} w={56} h={34} label="10%" state="ok" />
    <Arrow mk="cz" ci={4} x1={107} y1={100} x2={95} y2={112} />
    <Arrow
      mk="cz"
      ci={4}
      d="M160,98 C260,110 290,120 300,150"
      x1={160}
      y1={98}
      x2={300}
      y2={150}
      dash="4 3"
    />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
      <EC2
        key={i}
        x={218 + (i % 2) * 64}
        y={150 + Math.floor(i / 2) * 35}
        w={56}
        h={28}
        label="10%"
        state="ok"
      />
    ))}
    <Label
      x={107}
      y={175}
      t="AZ 경계를 넘어"
      fill={C.green}
      size={10.5}
      mono={false}
    />
    <Label
      x={107}
      y={191}
      t="10대 모두에"
      fill={C.green}
      size={10.5}
      mono={false}
    />
    <Label
      x={107}
      y={207}
      t="균등 분산 (각 10%)"
      fill={C.green}
      size={10.5}
      mono={false}
    />
    <line
      x1={375}
      y1={30}
      x2={375}
      y2={295}
      stroke={C.line}
      strokeWidth="1.5"
    />
    <Label
      x={545}
      y={22}
      t="Cross-Zone OFF"
      fill={C.red}
      size={13}
      mono={false}
    />
    <AZBound x={395} y={35} w={150} h={250} name="AZ-1" />
    <AZBound x={560} y={35} w={150} h={250} name="AZ-2" />
    <Box
      x={418}
      y={60}
      w={105}
      h={36}
      fill={C.tealSoft}
      stroke={C.teal}
      title="ELB · 50%"
      tSize={12}
    />
    <Box
      x={583}
      y={60}
      w={105}
      h={36}
      fill={C.tealSoft}
      stroke={C.teal}
      title="ELB · 50%"
      tSize={12}
    />
    <EC2 x={410} y={125} w={58} h={34} label="25%" state="drain" />
    <EC2 x={476} y={125} w={58} h={34} label="25%" state="drain" />
    <Arrow mk="cz" ci={2} x1={470} y1={100} x2={460} y2={122} />
    {[0, 1, 2, 3].map((i) => (
      <EC2
        key={i}
        x={578 + (i % 2) * 64}
        y={125 + Math.floor(i / 2) * 42}
        w={56}
        h={34}
        label="6.25%"
        state="ok"
      />
    ))}
    <EC2 x={578} y={209} w={56} h={34} label="6.25%" state="ok" />
    <EC2 x={642} y={209} w={56} h={34} label="6.25%" state="ok" />
    <EC2 x={578} y={251} w={56} h={34} label="6.25%" state="ok" />
    <EC2 x={642} y={251} w={56} h={34} label="6.25%" state="ok" />
    <Arrow mk="cz" ci={2} x1={635} y1={100} x2={625} y2={122} />
    <Label
      x={468}
      y={215}
      t="AZ-1의 2대가"
      fill={C.red}
      size={10}
      mono={false}
    />
    <Label
      x={468}
      y={230}
      t="각 25%씩 과부하"
      fill={C.red}
      size={10}
      mono={false}
    />
  </Diagram>
);

// 9. SNI
const DSNI = () => (
  <Diagram
    vb="0 0 720 240"
    cap="SNI: 클라이언트가 TLS 핸드셰이크에서 접속할 호스트명을 명시 → ALB가 해당하는 SSL 인증서를 골라 사용"
  >
    <Defs id="sn" />
    <User x={55} y={70} label="클라이언트 A" />
    <User x={55} y={170} label="클라이언트 B" />
    <Arrow
      mk="sn"
      ci={2}
      x1={95}
      y1={65}
      x2={230}
      y2={90}
      label="SNI: www.mycorp.com"
      lx={165}
      ly={52}
    />
    <Arrow
      mk="sn"
      ci={5}
      x1={95}
      y1={168}
      x2={230}
      y2={140}
      label="SNI: api.example.com"
      lx={165}
      ly={192}
    />
    <Box
      x={235}
      y={78}
      w={130}
      h={78}
      fill={C.tealSoft}
      stroke={C.teal}
      title="ALB"
      sub2="HTTPS :443"
      tSize={14}
    />
    <Box
      x={430}
      y={30}
      w={175}
      h={44}
      fill={C.amberSoft}
      stroke={C.amber}
      title="인증서 ①"
      sub2="www.mycorp.com"
      tSize={12}
    />
    <Box
      x={430}
      y={95}
      w={175}
      h={44}
      fill={C.violetSoft}
      stroke={C.violet}
      title="인증서 ②"
      sub2="api.example.com"
      tSize={12}
    />
    <Label
      x={517}
      y={165}
      t="여러 인증서를 한 리스너에 로드"
      size={10.5}
      mono={false}
    />
    <Arrow
      mk="sn"
      ci={2}
      x1={368}
      y1={100}
      x2={425}
      y2={58}
      label="①로 응답"
      mono={false}
      lx={415}
      ly={82}
    />
    <Arrow mk="sn" ci={5} x1={368} y1={125} x2={425} y2={117} label="" />
    <Label
      x={365}
      y={215}
      t="지원: ALB · NLB(신형) · CloudFront / 미지원: CLB"
      fill={C.amber}
      size={11.5}
    />
  </Diagram>
);

// 10. Connection Draining
const DDrain = () => (
  <Diagram
    vb="0 0 720 215"
    cap="등록 취소 지연: 제거 예정 인스턴스는 신규 요청을 받지 않되, 진행 중(in-flight) 요청은 완료할 시간을 확보"
  >
    <Defs id="dr" />
    <User x={55} y={65} label="기존 사용자" fill={C.amber} />
    <User x={55} y={160} label="신규 사용자" />
    <Box
      x={210}
      y={80}
      w={120}
      h={70}
      fill={C.tealSoft}
      stroke={C.teal}
      title="ELB"
    />
    <Arrow mk="dr" ci={2} x1={95} y1={62} x2={205} y2={95} />
    <Arrow mk="dr" ci={0} x1={95} y1={158} x2={205} y2={135} />
    <EC2
      x={480}
      y={35}
      state="drain"
      w={130}
      h={48}
      label="EC2 (draining)"
      sub2="종료 대기"
    />
    <EC2 x={480} y={145} state="ok" w={130} h={48} sub2="정상" />
    <Arrow
      mk="dr"
      ci={2}
      x1={335}
      y1={100}
      x2={475}
      y2={62}
      label="기존 연결만 완료 허용"
      mono={false}
      lx={405}
      ly={58}
    />
    <Arrow
      mk="dr"
      ci={3}
      dash="5 4"
      x1={335}
      y1={112}
      x2={455}
      y2={80}
      label="신규 요청 ✕"
      mono={false}
      lx={420}
      ly={112}
    />
    <Arrow
      mk="dr"
      ci={4}
      x1={335}
      y1={128}
      x2={475}
      y2={165}
      label="신규 요청은 정상 인스턴스로"
      mono={false}
      lx={400}
      ly={192}
    />
    <Label
      x={545}
      y={105}
      t="1~3600초 · 기본 300초 · 0=비활성"
      fill={C.amber}
      size={10.5}
    />
  </Diagram>
);

// 11. ASG
const DASG = () => (
  <Diagram
    vb="0 0 720 280"
    cap="ASG는 min/desired/max 범위 안에서 인스턴스 수를 자동 조절하고, 새 인스턴스를 ELB에 자동 등록합니다"
  >
    <Defs id="ag" />
    <User x={50} y={125} label="사용자" />
    <Box
      x={115}
      y={95}
      w={110}
      h={62}
      fill={C.tealSoft}
      stroke={C.teal}
      title="ELB"
      sub2="헬스체크 연동"
    />
    <Arrow mk="ag" ci={0} x1={80} y1={124} x2={110} y2={125} />
    <rect
      x={260}
      y={30}
      width={430}
      height={225}
      rx={14}
      fill="none"
      stroke={C.violet}
      strokeWidth="1.6"
      strokeDasharray="7 5"
    />
    <Label x={475} y={52} t="Auto Scaling Group" fill={C.violet} size={13} />
    <EC2 x={285} y={75} state="ok" w={80} h={46} sub2="최소" />
    <EC2 x={380} y={75} state="ok" w={80} h={46} sub2="최소" />
    <EC2 x={475} y={75} state="ok" w={80} h={46} sub2="희망" />
    <EC2
      x={570}
      y={75}
      state="new"
      w={80}
      h={46}
      label="EC2"
      sub2="스케일아웃"
    />
    <Arrow mk="ag" ci={1} x1={228} y1={115} x2={280} y2={100} />
    <Arrow mk="ag" ci={1} x1={228} y1={130} x2={375} y2={110} />
    <line
      x1={285}
      y1={155}
      x2={655}
      y2={155}
      stroke="#C9D2DA"
      strokeWidth="1.4"
    />
    <Label x={300} y={175} t="min: 2" fill={C.green} size={12} />
    <Label x={470} y={175} t="desired: 3" fill={C.teal} size={12} />
    <Label x={630} y={175} t="max: 4" fill={C.red} size={12} />
    <Box
      x={285}
      y={195}
      w={370}
      h={42}
      fill="#fff"
      stroke="#9AA8B5"
      title="시작 템플릿 (Launch Template)"
      sub2="AMI · 타입 · SG · 키페어 · IAM Role · User Data"
      tSize={12}
    />
    <Label
      x={510}
      y={252}
      t="CloudWatch 경보 → 스케일 인/아웃"
      fill={C.amber}
      size={11}
      anchor="start"
    />
  </Diagram>
);

// 12. Scaling Policy - Target Tracking
const DPolicy = () => (
  <Diagram
    vb="0 0 720 240"
    cap="대상 추적(Target Tracking) 예시: 평균 CPU 40%를 유지하도록 ASG가 자동으로 인스턴스를 추가/제거"
  >
    <Defs id="po" />
    <line x1={60} y1={30} x2={60} y2={190} stroke={C.sub} strokeWidth="1.4" />
    <line x1={60} y1={190} x2={440} y2={190} stroke={C.sub} strokeWidth="1.4" />
    <Label x={38} y={35} t="CPU" size={10.5} />
    <Label x={430} y={207} t="시간 →" size={10.5} mono={false} />
    <line
      x1={60}
      y1={110}
      x2={440}
      y2={110}
      stroke={C.amber}
      strokeWidth="1.4"
      strokeDasharray="6 4"
    />
    <Label x={490} y={114} t="목표: CPU 40%" fill={C.amber} size={11.5} />
    <path
      d="M60,170 C110,165 130,80 175,60 C205,48 225,70 255,100 C285,130 330,150 440,150"
      fill="none"
      stroke={C.teal}
      strokeWidth="2.2"
    />
    <circle cx={175} cy={60} r={5} fill={C.red} />
    <Label
      x={175}
      y={42}
      t="목표 초과 → 스케일아웃"
      fill={C.red}
      size={10.5}
      mono={false}
    />
    <circle cx={340} cy={148} r={5} fill={C.green} />
    <Label
      x={352}
      y={172}
      t="목표 미만 → 스케일인"
      fill={C.green}
      size={10.5}
      mono={false}
    />
    <Box
      x={480}
      y={135}
      w={200}
      h={80}
      fill={C.violetSoft}
      stroke={C.violet}
      r={12}
    />
    <Label
      x={580}
      y={160}
      t="CloudWatch 경보"
      fill={C.violet}
      size={12}
      mono={false}
    />
    <Label x={580} y={180} t="↓" fill={C.violet} size={12} />
    <Label x={580} y={200} t="ASG 인스턴스 +/-" fill={C.violet} size={12} />
  </Diagram>
);

// 13. Instance Refresh
const DRefresh = () => (
  <Diagram
    vb="0 0 720 205"
    cap="인스턴스 새로 고침: 새 시작 템플릿 적용 시, 최소 정상 비율(예: 60%)을 유지하며 구형 인스턴스를 점진적으로 교체"
  >
    <Defs id="rf" />
    <Box
      x={40}
      y={65}
      w={165}
      h={56}
      fill="#fff"
      stroke="#9AA8B5"
      title="새 시작 템플릿"
      sub2="새 AMI 버전"
      tSize={12.5}
    />
    <Arrow
      mk="rf"
      ci={5}
      x1={210}
      y1={93}
      x2={262}
      y2={93}
      label="StartInstanceRefresh"
      ly={80}
      lSize={10}
    />
    <rect
      x={268}
      y={25}
      width={420}
      height={155}
      rx={14}
      fill="none"
      stroke={C.violet}
      strokeWidth="1.5"
      strokeDasharray="7 5"
    />
    <Label x={478} y={47} t="ASG · Min Healthy 60%" fill={C.violet} size={12} />
    <EC2 x={290} y={65} w={80} h={44} label="구형" state="bad" sub2="교체 중" />
    <EC2 x={385} y={65} w={80} h={44} label="구형" state="ok" sub2="대기" />
    <EC2 x={480} y={65} w={80} h={44} label="구형" state="ok" sub2="대기" />
    <EC2
      x={575}
      y={65}
      w={80}
      h={44}
      label="신형 ✦"
      state="new"
      sub2="새 AMI"
    />
    <Label
      x={478}
      y={150}
      t="한 대씩 종료 → 새 템플릿으로 재생성 (Warm-up 시간 대기)"
      size={10.5}
      mono={false}
    />
  </Diagram>
);

/* ================= 섹션 콘텐츠 ================= */

const S_HA = () => (
  <>
    <P>
      <B>확장성(Scalability)</B>은 애플리케이션이 더 큰 부하를 감당하도록 적응할
      수 있는 능력이며, 두 가지 방식이 있습니다.
    </P>
    <DScaling />
    <Table
      head={["구분", "수직 확장 (Scalability)", "수평 확장 (Elasticity)"]}
      rows={[
        [
          "방법",
          <>
            인스턴스 <B>크기</B>를 키움 (Scale Up/Down)
          </>,
          <>
            인스턴스 <B>수</B>를 늘림 (Scale Out/In)
          </>,
        ],
        [
          "대상",
          "RDS, ElastiCache 같은 비분산 시스템",
          "분산 시스템 (현대적 웹 앱)",
        ],
        ["한계", "하드웨어 성능 한계 존재", "이론상 한계 없음"],
        [
          "AWS 구현",
          "인스턴스 타입 변경 (t2.micro → m5.large)",
          <>
            <B>ASG + ELB</B>
          </>,
        ],
      ]}
    />
    <H3>고가용성 (High Availability)</H3>
    <P>
      고가용성은 보통 수평 확장과 함께 사용되며, 애플리케이션을{" "}
      <B>최소 2개 이상의 가용 영역(AZ)</B>에서 실행하는 것을 의미합니다. 목표는
      데이터센터(AZ) 하나가 손실되는 재해 상황에서도 살아남는 것입니다.
    </P>
    <DHA />
    <Ul
      items={[
        <>수동적 고가용성: RDS Multi-AZ 등</>,
        <>능동적 고가용성: 수평 확장 (다중 AZ의 ASG + 다중 AZ의 ELB)</>,
      ]}
    />
    <Exam>
      용어 구분 문제가 나옵니다 — <B>Scalability</B>(확장성) vs{" "}
      <B>Elasticity</B>(수요에 따라 자동으로 늘었다 줄었다, 비용 최적화) vs{" "}
      <B>Agility</B>(민첩성, 확장성과 무관한 배포 속도 개념). Elasticity는
      클라우드의 종량제와 자동 확장을 의미합니다.
    </Exam>
  </>
);

const S_ELB = () => (
  <>
    <P>
      <B>로드 밸런서</B>는 트래픽을 여러 서버(예: EC2)로 전달해 주는 서버입니다.
      AWS의 <B>ELB(Elastic Load Balancing)</B>는 <B>관리형</B> 로드 밸런서로,
      AWS가 가용성을 보장하고 업그레이드·유지보수를 담당합니다.
    </P>
    <DELB />
    <H3>로드 밸런서를 쓰는 이유</H3>
    <Ul
      items={[
        <>
          여러 다운스트림 인스턴스로 <B>부하 분산</B>
        </>,
        <>
          애플리케이션에 대한 <B>단일 액세스 지점(고정 DNS 이름)</B> 제공
        </>,
        <>
          다운스트림 인스턴스 <B>장애를 원활하게 처리</B> (헬스체크로 정상
          인스턴스에만 라우팅)
        </>,
        <>
          HTTPS를 위한 <B>SSL 종료(termination)</B> 제공
        </>,
        <>
          쿠키로 <B>스티키 세션</B> 적용 가능
        </>,
        <>
          여러 가용 영역에 걸친 <B>고가용성</B>
        </>,
        <>퍼블릭 트래픽과 프라이빗 트래픽 분리</>,
      ]}
    />
    <H3>헬스 체크 (Health Checks)</H3>
    <P>
      로드 밸런서가 인스턴스의 정상 여부를 확인하는 핵심 기능입니다.{" "}
      <B>포트와 경로</B>(예: <K>:4567 /health</K>)로 확인하며, 응답이{" "}
      <Ko>200 OK</Ko>가 아니면 unhealthy로 판단하고{" "}
      <B>해당 인스턴스로 트래픽을 보내지 않습니다</B>.
    </P>
    <H3>ELB의 4가지 종류</H3>
    <Table
      head={["종류", "출시", "계층", "프로토콜", "비고"]}
      rows={[
        [
          <B>CLB</B>,
          "2009 (v1)",
          "L4 + L7",
          "HTTP, HTTPS, TCP, SSL",
          <span style={{ color: C.red }}>지원 종료 (레거시)</span>,
        ],
        [
          <B>ALB</B>,
          "2016 (v2)",
          "L7",
          "HTTP, HTTPS, WebSocket",
          "HTTP 라우팅에 특화",
        ],
        [<B>NLB</B>, "2017 (v2)", "L4", "TCP, TLS, UDP", "초고성능, 고정 IP"],
        [<B>GWLB</B>, "2020", "L3", "IP (GENEVE)", "보안 어플라이언스용"],
      ]}
    />
    <P>
      일부 로드 밸런서는 내부(private) 또는 외부(public)로 설정할 수 있으며,
      전반적으로 최신 세대(v2) 로드 밸런서 사용이 권장됩니다.
    </P>
    <H3>보안 그룹 구성 (중요)</H3>
    <DSG />
    <Ul
      items={[
        <>
          ELB 보안 그룹: <K>0.0.0.0/0</K>에서 <K>:80</K>/<K>:443</K> 허용
          (누구나 접근)
        </>,
        <>
          EC2 보안 그룹: 인바운드 <B>소스를 ELB의 보안 그룹으로 지정</B> → 로드
          밸런서를 거친 트래픽만 허용
        </>,
      ]}
    />
    <Exam>
      "EC2가 로드 밸런서에서 오는 트래픽만 받게 하려면?" →{" "}
      <B>EC2 보안 그룹의 소스에 ELB의 보안 그룹을 지정</B>한다. IP 범위가 아니라
      보안 그룹을 참조하는 것이 핵심입니다.
    </Exam>
  </>
);

const S_CLB = () => (
  <>
    <P>
      <B>클래식 로드 밸런서(CLB)</B>는 2009년에 출시된 1세대 로드 밸런서로,
      TCP(L4)와 HTTP/HTTPS(L7)를 지원했습니다.
    </P>
    <Ul
      items={[
        <>헬스체크는 TCP 또는 HTTP 기반</>,
        <>
          고정 호스트명 제공 (예: <K>XXX.region.elb.amazonaws.com</K>)
        </>,
        <>
          SSL 인증서를 <B>1개만</B> 지원 (SNI 미지원)
        </>,
      ]}
    />
    <P>
      AWS는 CLB에 대한 지원을 종료했으며(2023년 기준 콘솔에서 신규 생성 불가
      표시), 강의와 시험 모두에서 비중이 거의 없습니다. "레거시이므로 ALB/NLB로
      마이그레이션해야 한다" 정도만 기억하면 충분합니다.
    </P>
    <Note>
      시험에서 CLB가 등장한다면 대부분 "다중 SSL 인증서(SNI)가 필요하다 →
      CLB로는 불가능, ALB로 이전" 같은 오답 선택지나 마이그레이션 맥락입니다.
    </Note>
  </>
);

const S_ALB = () => (
  <>
    <P>
      <B>애플리케이션 로드 밸런서(ALB)</B>는 <B>7계층(HTTP)</B> 전용 로드
      밸런서입니다. DVA 시험에서 가장 중요한 로드 밸런서입니다.
    </P>
    <Ul
      items={[
        <>
          여러 머신에 걸친 <B>여러 HTTP 애플리케이션</B>(대상 그룹)으로 라우팅
        </>,
        <>
          같은 머신 위의 여러 애플리케이션으로 라우팅 (예: <B>컨테이너, ECS</B>)
        </>,
        <>HTTP/2, WebSocket 지원 · 리디렉션 지원 (HTTP → HTTPS)</>,
      ]}
    />
    <H3>라우팅 규칙 (Routing Rules)</H3>
    <Ul
      items={[
        <>
          URL <B>경로</B> 기반: <K>example.com/users</K> vs{" "}
          <K>example.com/posts</K>
        </>,
        <>
          <B>호스트명</B> 기반: <K>one.example.com</K> vs{" "}
          <K>other.example.com</K>
        </>,
        <>
          <B>쿼리 스트링·HTTP 헤더</B> 기반:{" "}
          <K>example.com/users?id=123&order=false</K>
        </>,
      ]}
    />
    <DALB />
    <H3>대상 그룹 (Target Groups)</H3>
    <Ul
      items={[
        <>
          <B>EC2 인스턴스</B> (ASG로 관리 가능) — HTTP
        </>,
        <>
          <B>ECS 태스크</B> — HTTP, <B>동적 호스트 포트 매핑</B> 지원
        </>,
        <>
          <B>Lambda 함수</B> — HTTP 요청이 JSON 이벤트로 변환됨
        </>,
        <>
          <B>사설 IP 주소</B> (예: 온프레미스 서버)
        </>,
      ]}
    />
    <P>
      헬스체크는 <B>대상 그룹 단위</B>로 수행되며, ALB 하나로 여러 대상 그룹에
      동시에 라우팅할 수 있습니다. 마이크로서비스·컨테이너 기반 앱에 최적입니다.
    </P>
    <H3>클라이언트 IP와 X-Forwarded 헤더 (빈출)</H3>
    <DXFF />
    <Ul
      items={[
        <>
          ALB는 고정 호스트명을 제공 (<K>XXX.region.elb.amazonaws.com</K>)
        </>,
        <>
          백엔드 서버는 클라이언트의 IP를 직접 보지 못함 — 연결이 ALB에서
          종료되고 ALB의 사설 IP로 새 연결이 만들어지기 때문
        </>,
        <>
          실제 클라이언트 IP: <Ko>X-Forwarded-For</Ko> 헤더
        </>,
        <>
          클라이언트 포트: <K>X-Forwarded-Port</K> / 프로토콜:{" "}
          <K>X-Forwarded-Proto</K>
        </>,
      ]}
    />
    <Exam>
      "백엔드 애플리케이션에서 클라이언트의 실제 IP를 알아내려면?" →{" "}
      <B>X-Forwarded-For 헤더</B>를 확인한다. DVA에서 매우 자주 나오는
      포인트입니다. ECS 동적 포트 매핑과 ALB의 조합도 자주 출제됩니다.
    </Exam>
  </>
);

const S_NLB = () => (
  <>
    <P>
      <B>네트워크 로드 밸런서(NLB)</B>는 <B>4계층(TCP/UDP)</B> 로드 밸런서로,
      극단적인 성능이 필요할 때 사용합니다.
    </P>
    <DNLB />
    <Ul
      items={[
        <>
          <B>TCP·UDP</B> 트래픽 처리 (L4)
        </>,
        <>
          초당 <B>수백만 건의 요청</B> 처리, 지연시간 <B>약 100ms</B> (ALB는 약
          400ms)
        </>,
        <>
          <B>AZ당 1개의 고정 IP</B>를 가지며 <B>탄력적 IP(EIP) 지정 가능</B>
        </>,
        <>프리 티어에 포함되지 않음</>,
      ]}
    />
    <H3>대상 그룹</H3>
    <Ul
      items={[
        <>EC2 인스턴스</>,
        <>사설 IP 주소 (자체 데이터센터 서버 등)</>,
        <>
          <B>ALB를 대상으로 지정 가능</B> → NLB의 고정 IP + ALB의 L7 라우팅
          규칙을 함께 사용
        </>,
        <>
          헬스체크는 <B>TCP · HTTP · HTTPS</B> 프로토콜 지원
        </>,
      ]}
    />
    <Exam>
      "애플리케이션 접근을 특정 <B>고정 IP</B>로 화이트리스트해야 한다" 또는
      "수백만 TPS의 <B>극한 성능</B>·TCP/UDP"가 나오면 답은 <B>NLB</B>입니다.
      고정 IP가 필요한데 HTTP 규칙도 필요하다면 <B>NLB → ALB</B> 조합입니다.
    </Exam>
  </>
);

const S_GWLB = () => (
  <>
    <P>
      <B>게이트웨이 로드 밸런서(GWLB)</B>는 서드파티{" "}
      <B>네트워크 가상 어플라이언스</B>(방화벽, 침입 탐지/방지 시스템 IDS/IPS,
      심층 패킷 검사 DPI)를 배포·확장·관리할 때 사용합니다.
    </P>
    <DGWLB />
    <Ul
      items={[
        <>
          <B>3계층(네트워크 계층)</B>에서 동작 — IP 패킷 수준
        </>,
        <>
          두 기능의 결합: <B>투명 네트워크 게이트웨이</B>(모든 트래픽의 단일
          출입구) + <B>로드 밸런서</B>(어플라이언스 간 부하 분산)
        </>,
        <>라우팅 테이블 수정으로 모든 트래픽이 GWLB를 먼저 통과하게 함</>,
        <>대상 그룹: EC2 인스턴스, 사설 IP</>,
      ]}
    />
    <Exam>
      키워드 매칭 문제입니다. <Ko>GENEVE 프로토콜</Ko> + <Ko>포트 6081</Ko>이
      보이면 무조건 <B>GWLB</B>. 반대로 "트래픽을 방화벽/침입 탐지 시스템으로
      먼저 통과시켜 검사"라는 시나리오가 나와도 GWLB입니다.
    </Exam>
  </>
);

const S_STICKY = () => (
  <>
    <P>
      <B>스티키 세션(세션 어피니티)</B>은 같은 클라이언트의 요청이 항상{" "}
      <B>같은 인스턴스</B>로 가도록 하는 기능입니다. CLB·ALB(쿠키 기반)와
      NLB(쿠키 없이 동작)에서 사용 가능합니다.
    </P>
    <DSticky />
    <Ul
      items={[
        <>
          사용 목적: 로그인 정보 등 <B>세션 데이터를 잃지 않기 위해</B>
        </>,
        <>
          부작용: 특정 인스턴스에 부하가 몰리는 <B>불균형</B> 발생 가능
        </>,
      ]}
    />
    <H3>쿠키의 두 가지 종류 (ALB)</H3>
    <Table
      head={["분류", "쿠키 이름", "생성 주체", "특징"]}
      rows={[
        [
          <>
            <B>Application-based</B>
            <br />
            (Custom cookie)
          </>,
          "앱이 지정 (대상 그룹별로 개별 지정)",
          "애플리케이션(대상)",
          <>
            앱에 필요한 속성 포함 가능. 단, <Ko>AWSALB</Ko> <Ko>AWSALBAPP</Ko>{" "}
            <Ko>AWSALBTG</Ko>는 <B>예약어라 사용 불가</B>
          </>,
        ],
        [
          <>
            <B>Application-based</B>
            <br />
            (Application cookie)
          </>,
          <K>AWSALBAPP</K>,
          "로드 밸런서",
          "LB가 자동 생성",
        ],
        [
          <>
            <B>Duration-based</B>
          </>,
          <>
            <K>AWSALB</K> (CLB는 <K>AWSELB</K>)
          </>,
          "로드 밸런서",
          <>
            지정한 <B>만료 기간</B>(1초~7일) 기준으로 유지
          </>,
        ],
      ]}
    />
    <Exam>
      커스텀 쿠키 이름으로 <B>AWSALB / AWSALBAPP / AWSALBTG를 쓸 수 없다</B>는
      점, 그리고 "사용자 세션이 자꾸 끊긴다 → 스티키 세션 활성화"라는 시나리오가
      출제됩니다.
    </Exam>
  </>
);

const S_CROSS = () => (
  <>
    <P>
      <B>교차 영역 로드 밸런싱(Cross-Zone Load Balancing)</B>이 켜져 있으면, 각
      로드 밸런서 노드가 <B>모든 AZ의 모든 인스턴스</B>에 트래픽을 균등하게
      분산합니다. 꺼져 있으면 각 노드는 <B>자기 AZ 안의 인스턴스</B>에만
      분배합니다.
    </P>
    <DCross />
    <P>
      위 예시(AZ-1에 2대, AZ-2에 8대): 활성화 시 10대 모두 각 10%씩 받지만,
      비활성화 시 AZ-1의 2대가 각 25%(50%÷2), AZ-2의 8대는 각 6.25%(50%÷8)를
      받아 불균형이 생깁니다.
    </P>
    <H3>로드 밸런서별 기본값과 비용 (빈출 표)</H3>
    <Table
      head={["로드 밸런서", "기본값", "AZ 간 데이터 전송 요금"]}
      rows={[
        [
          <B>ALB</B>,
          <>
            <span style={{ color: C.green, fontWeight: 800 }}>기본 활성화</span>{" "}
            (대상 그룹 수준에서 비활성화 가능)
          </>,
          <B>무료</B>,
        ],
        [
          <B>NLB · GWLB</B>,
          <span style={{ color: C.red, fontWeight: 800 }}>기본 비활성화</span>,
          <>
            활성화 시 <B>요금 부과</B>
          </>,
        ],
        ["CLB", "기본 비활성화", "활성화해도 무료"],
      ]}
    />
    <Exam>
      "ALB는 기본 ON + 무료, NLB는 기본 OFF + 켜면 과금" — 이 조합을 뒤섞은
      선택지가 나옵니다. 표를 통째로 암기하세요.
    </Exam>
  </>
);

const S_SSL = () => (
  <>
    <P>
      <B>SSL/TLS 인증서</B>는 클라이언트와 로드 밸런서 사이의 트래픽을{" "}
      <B>전송 중 암호화(in-flight encryption)</B>합니다. SSL은 구식 명칭, TLS가
      최신 버전이지만 관례상 SSL로 부릅니다.
    </P>
    <Ul
      items={[
        <>
          공인 인증 기관(CA)이 발급한 <B>X.509 인증서</B> 사용
        </>,
        <>
          AWS에서는 <Ko>ACM(AWS Certificate Manager)</Ko>으로 인증서를
          생성·관리하거나, 자체 인증서를 업로드 가능
        </>,
        <>
          HTTPS 리스너 설정: <B>기본 인증서</B> 지정 + 여러 도메인 지원을 위한{" "}
          <B>추가 인증서 목록</B> + 클라이언트가 HTTPS를 지원하지 않을 때 대비한
          보안 정책 지정
        </>,
      ]}
    />
    <H3>SNI (Server Name Indication) — 핵심 개념</H3>
    <P>
      하나의 웹 서버(로드 밸런서)에 <B>여러 SSL 인증서</B>를 로드해 여러
      웹사이트를 서비스하는 문제를 해결하는 프로토콜입니다. 클라이언트가{" "}
      <B>SSL 핸드셰이크 초기에 접속할 서버의 호스트명을 명시</B>하면, 서버가
      그에 맞는 인증서를 찾아 응답합니다.
    </P>
    <DSNI />
    <Table
      head={["로드 밸런서", "SSL 인증서 지원"]}
      rows={[
        [
          "CLB",
          <>
            인증서 <B>1개만</B> 지원. 여러 인증서가 필요하면 CLB를 여러 개
            사용해야 함
          </>,
        ],
        [
          <B>ALB (v2)</B>,
          <>
            다중 리스너 + <B>다중 인증서, SNI로 동작</B>
          </>,
        ],
        [
          <B>NLB (v2)</B>,
          <>
            다중 리스너 + <B>다중 인증서, SNI로 동작</B>
          </>,
        ],
        ["CloudFront", "SNI 지원"],
      ]}
    />
    <Exam>
      "하나의 로드 밸런서에서 여러 도메인을 각각 다른 SSL 인증서로
      서비스하려면?" → <B>SNI</B> (ALB·NLB·CloudFront에서만 동작, CLB 불가). DVA
      단골 문제입니다.
    </Exam>
  </>
);

const S_DRAIN = () => (
  <>
    <P>
      인스턴스가 등록 취소(또는 unhealthy 판정) 중일 때,{" "}
      <B>진행 중인 요청을 완료할 시간</B>을 주는 기능입니다.
    </P>
    <DDrain />
    <Ul
      items={[
        <>
          명칭: CLB에서는 <Ko>Connection Draining</Ko>, ALB·NLB(대상 그룹)에서는{" "}
          <Ko>Deregistration Delay</Ko>
        </>,
        <>
          드레이닝 중인 인스턴스로는 <B>새 요청을 보내지 않음</B> — 신규 요청은
          다른 정상 인스턴스로
        </>,
        <>
          설정 범위: <B>1~3600초</B>, 기본값 <B>300초</B>
        </>,
        <>
          <B>0으로 설정 시 비활성화</B> (기존 연결을 즉시 끊음)
        </>,
        <>요청이 짧은 애플리케이션이라면 값을 낮게 설정하는 것이 좋음</>,
      ]}
    />
    <Exam>
      "인스턴스를 제거할 때 사용자 요청이 끊기지 않게 하려면?" → Deregistration
      Delay(Connection Draining). 이름이 LB 종류에 따라 다르다는 점과 기본
      300초를 기억하세요.
    </Exam>
  </>
);

const S_ASG = () => (
  <>
    <P>
      실제 서비스의 부하는 시간에 따라 변합니다. <B>오토 스케일링 그룹(ASG)</B>
      의 목표는:
    </P>
    <Ul
      items={[
        <>
          부하 증가 시 <B>스케일 아웃</B>(EC2 인스턴스 추가), 감소 시{" "}
          <B>스케일 인</B>(제거)
        </>,
        <>
          실행 중인 인스턴스 수를 <B>최소/최대 범위 안에서 보장</B>
        </>,
        <>
          새 인스턴스를 <B>로드 밸런서에 자동 등록</B>
        </>,
        <>
          인스턴스가 종료·장애 시(예: ELB가 unhealthy 판정){" "}
          <B>자동으로 재생성(교체)</B>
        </>,
      ]}
    />
    <P>
      ASG 자체는 <B>무료</B>이며, 생성된 EC2 인스턴스 비용만 지불합니다.
    </P>
    <DASG />
    <H3>핵심 속성</H3>
    <Ul
      items={[
        <>
          <B>최소(min) / 희망(desired) / 최대(max) 용량</B> — 다이어그램의
          눈금처럼 이 범위 안에서 조절
        </>,
        <>
          <Ko>시작 템플릿(Launch Template)</Ko>에 새 인스턴스를 만드는 방법이
          담김: AMI + 인스턴스 타입, EBS 볼륨, 보안 그룹, 키 페어, IAM 역할,
          User Data, 서브넷 정보, 로드 밸런서(대상 그룹) 정보
        </>,
        <>
          과거의 <B>시작 구성(Launch Configuration)</B>은 구식이며 시작
          템플릿으로 대체됨
        </>,
      ]}
    />
    <H3>CloudWatch 및 ELB와의 연동</H3>
    <Ul
      items={[
        <>
          <B>CloudWatch 경보</B>를 기반으로 스케일 인/아웃 — 지표(예: 평균
          CPU)가 임계값을 넘으면 경보 발동 → ASG가 용량 조절
        </>,
        <>
          지표는 ASG 내 <B>전체 인스턴스의 평균</B>으로 계산됨
        </>,
        <>
          ASG의 헬스체크를 <B>ELB 헬스체크와 연동</B>하면, ELB가 unhealthy로
          판정한 인스턴스를 ASG가 종료하고 새로 만듦
        </>,
      ]}
    />
    <Exam>
      "unhealthy 인스턴스가 자동으로 교체되게 하려면?" → ASG +{" "}
      <B>ELB 헬스체크 연동</B>. "ASG가 스케일 아웃했는데 새 인스턴스가 트래픽을
      못 받는다" → 대상 그룹/헬스체크 설정 확인. min/desired/max의 의미도 자주
      확인합니다.
    </Exam>
  </>
);

const S_POLICY = () => (
  <>
    <P>
      ASG가 <B>언제, 얼마나</B> 확장/축소할지 결정하는 정책입니다. DVA에서 매우
      자주 출제됩니다.
    </P>
    <H3>① 동적 스케일링 (Dynamic Scaling)</H3>
    <Table
      head={["정책", "동작", "예시"]}
      rows={[
        [
          <B>대상 추적 (Target Tracking)</B>,
          <>
            가장 간단. 특정 지표를 <B>목표값에 맞춰 자동 유지</B>
          </>,
          "평균 CPU를 40%로 유지",
        ],
        [
          <B>단순/단계 (Simple / Step)</B>,
          <>
            CloudWatch <B>경보가 트리거될 때</B> 지정한 만큼 증감. Step은
            단계별로 다르게 증감
          </>,
          "CPU > 70% 경보 → 2대 추가 / CPU < 30% 경보 → 1대 제거",
        ],
      ]}
    />
    <DPolicy />
    <H3>② 예약 스케일링 (Scheduled Scaling)</H3>
    <P>
      사용 패턴을 미리 알 때, <B>시간을 지정해</B> 용량을 변경합니다. 예: "매주
      금요일 17:00에 최소 용량을 10으로 증가" (스포츠 이벤트, 정기 세일 등).
    </P>
    <H3>③ 예측 스케일링 (Predictive Scaling)</H3>
    <P>
      과거 부하를 <B>지속적으로 분석·예측</B>하여, 예상되는 부하에 맞춰 미리
      스케일링을 예약합니다. 주기적으로 반복되는 패턴에 적합합니다.
    </P>
    <H3>스케일링에 좋은 지표</H3>
    <Ul
      items={[
        <>
          <Ko>CPUUtilization</Ko> — 인스턴스 전체의 평균 CPU 사용률
        </>,
        <>
          <Ko>RequestCountPerTarget</Ko> — 대상(인스턴스)당 요청 수를 일정하게
          유지
        </>,
        <>
          <B>평균 네트워크 In/Out</B> — 네트워크 병목형 애플리케이션의 경우
        </>,
        <>
          <B>커스텀 지표</B> — CloudWatch에 직접 푸시한 지표
        </>,
      ]}
    />
    <H3>스케일링 휴지 기간 (Cooldown)</H3>
    <P>
      스케일링 활동 직후 <B>기본 300초</B>의 휴지 기간 동안에는 추가 스케일링을
      하지 않습니다(지표가 안정될 시간을 확보). 휴지 기간을 효과적으로 줄이려면{" "}
      <B>설정이 미리 구워진 즉시 사용 가능한 AMI</B>를 사용해 인스턴스 기동을
      빠르게 하는 것이 좋습니다.
    </P>
    <Exam>
      ① "지표를 특정 값으로 유지하는 가장 간단한 방법" → <B>대상 추적</B> ②
      "인스턴스당 요청 수 기준 스케일링" → <B>RequestCountPerTarget</B> ③
      "스케일링이 너무 자주 반복된다" → <B>Cooldown</B>(기본 300초) ④ "매주 특정
      시간 트래픽 급증이 예정됨" → <B>예약 스케일링</B>. 네 가지 모두 단골
      출제입니다.
    </Exam>
  </>
);

const S_REFRESH = () => (
  <>
    <P>
      <B>인스턴스 새로 고침(Instance Refresh)</B>은 시작 템플릿을 업데이트한
      뒤(예: 새 AMI), ASG의{" "}
      <B>모든 인스턴스를 점진적으로 새 템플릿 기반으로 재생성</B>하는
      기능입니다. 인스턴스를 하나하나 수동 종료할 필요가 없습니다.
    </P>
    <DRefresh />
    <Ul
      items={[
        <>
          <Ko>최소 정상 비율(Minimum Healthy Percentage)</Ko> 설정 — 예: 60%로
          지정하면 새로 고침 중에도 항상 60% 이상의 인스턴스가 서비스 가능
          상태로 유지됨
        </>,
        <>
          <B>워밍업 시간(Warm-up time)</B> — 새 인스턴스가 트래픽을 받을 준비가
          됐다고 간주하기까지 기다리는 시간
        </>,
      ]}
    />
    <Exam>
      "새 AMI를 ASG 전체에 무중단으로 배포하려면?" → 시작 템플릿 업데이트 +{" "}
      <B>Instance Refresh</B> (Min Healthy % 지정). 출제 빈도는 낮지만 개념
      문제로 가끔 등장합니다.
    </Exam>
  </>
);

const S_SUMMARY = () => (
  <>
    <P>
      퀴즈 4와 실제 시험 직전에 훑어볼 한 장 요약입니다. DVA에서 이 챕터는{" "}
      <B>단독 문제 + ECS/배포 문제의 배경지식</B>으로 두루 쓰입니다.
    </P>
    <H3>로드 밸런서 선택 기준</H3>
    <Table
      head={["시나리오 키워드", "정답"]}
      rows={[
        [
          "HTTP 라우팅 (경로·호스트·쿼리), 컨테이너/ECS, Lambda 대상",
          <B>ALB</B>,
        ],
        ["고정 IP / EIP 화이트리스트, TCP·UDP, 수백만 req/s", <B>NLB</B>],
        [
          <>
            방화벽·IDS/IPS 검사, <K>GENEVE :6081</K>
          </>,
          <B>GWLB</B>,
        ],
        ["레거시, SSL 인증서 1개 제한", "CLB (마이그레이션 대상)"],
      ]}
    />
    <H3>암기 카드</H3>
    <Table
      head={["항목", "핵심 값"]}
      rows={[
        ["클라이언트 실제 IP", <Ko>X-Forwarded-For</Ko>],
        [
          "스티키 세션 쿠키",
          <>
            Duration: <K>AWSALB</K> / App: <K>AWSALBAPP</K> / 예약어 3종 사용
            금지
          </>,
        ],
        ["교차 영역", "ALB 기본 ON·무료 / NLB·GWLB 기본 OFF·유료"],
        [
          "다중 SSL 인증서",
          <>
            <B>SNI</B> — ALB·NLB·CloudFront (CLB ✕)
          </>,
        ],
        ["등록 취소 지연", "1~3600초 · 기본 300초 · 0=비활성"],
        ["ASG 스케일링", "대상 추적(가장 간단) / 단순·단계 / 예약 / 예측"],
        [
          "좋은 지표",
          <>
            <K>CPUUtilization</K>, <K>RequestCountPerTarget</K>, 네트워크 I/O
          </>,
        ],
        ["Cooldown", "기본 300초 · 빠른 AMI로 단축 효과"],
        ["무중단 AMI 교체", "Instance Refresh + Min Healthy %"],
      ]}
    />
    <Note>
      빈출도 표기는 공식 통계가 아니라 일반적인 DVA 수험 후기·기출 경향에 근거한
      추정입니다. SAA(Solutions Architect)에서는 이 챕터의 비중이 더 높고,
      DVA에서는 ALB(X-Forwarded-For, ECS 연동)·SNI·ASG 정책이 특히 자주
      보입니다.
    </Note>
  </>
);

/* ================= 섹션 목록 & 앱 ================= */
const SECTIONS = [
  {
    id: "ha",
    no: "59",
    title: "고가용성 및 확장성",
    freq: 2,
    body: S_HA,
    tag: "기초",
  },
  { id: "elb", no: "60", title: "ELB 개요", freq: 3, body: S_ELB, tag: "ELB" },
  {
    id: "clb",
    no: "61",
    title: "클래식 로드 밸런서 (CLB)",
    freq: 1,
    body: S_CLB,
    tag: "ELB",
  },
  {
    id: "alb",
    no: "62",
    title: "애플리케이션 로드 밸런서 (ALB)",
    freq: 3,
    body: S_ALB,
    tag: "ELB",
  },
  {
    id: "nlb",
    no: "65",
    title: "네트워크 로드 밸런서 (NLB)",
    freq: 2,
    body: S_NLB,
    tag: "ELB",
  },
  {
    id: "gwlb",
    no: "67",
    title: "게이트웨이 로드 밸런서 (GWLB)",
    freq: 1,
    body: S_GWLB,
    tag: "ELB",
  },
  {
    id: "sticky",
    no: "68",
    title: "Sticky Sessions",
    freq: 2,
    body: S_STICKY,
    tag: "ELB",
  },
  {
    id: "cross",
    no: "69",
    title: "Cross-Zone Load Balancing",
    freq: 2,
    body: S_CROSS,
    tag: "ELB",
  },
  {
    id: "ssl",
    no: "70",
    title: "SSL 인증서 & SNI",
    freq: 3,
    body: S_SSL,
    tag: "ELB",
  },
  {
    id: "drain",
    no: "72",
    title: "연결 드레이닝",
    freq: 2,
    body: S_DRAIN,
    tag: "ELB",
  },
  {
    id: "asg",
    no: "73",
    title: "오토 스케일링 그룹 (ASG)",
    freq: 3,
    body: S_ASG,
    tag: "ASG",
  },
  {
    id: "policy",
    no: "75",
    title: "ASG 스케일링 정책",
    freq: 3,
    body: S_POLICY,
    tag: "ASG",
  },
  {
    id: "refresh",
    no: "77",
    title: "인스턴스 새로 고침",
    freq: 1,
    body: S_REFRESH,
    tag: "ASG",
  },
  {
    id: "sum",
    no: "★",
    title: "시험 직전 요약",
    freq: 3,
    body: S_SUMMARY,
    tag: "요약",
  },
];

export default function App() {
  const [cur, setCur] = useState("ha");
  const sec = SECTIONS.find((s) => s.id === cur);
  const idx = SECTIONS.indexOf(sec);
  const Body = sec.body;
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [cur]);

  const tagColor = {
    ELB: [C.teal, C.tealSoft],
    ASG: [C.violet, C.violetSoft],
    기초: [C.sub, "#EFF2F5"],
    요약: [C.amber, C.amberSoft],
  }[sec.tag];

  return (
    <div className="dva-root">
      <style>{css}</style>
      <header
        style={{ borderBottom: `1px solid ${C.line}`, background: C.panel }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "20px 24px",
            display: "flex",
            alignItems: "baseline",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              background: C.ink,
              padding: "4px 10px",
              borderRadius: 6,
              letterSpacing: ".06em",
            }}
          >
            AWS DVA-C02
          </span>
          <h1
            style={{
              fontSize: 21,
              fontWeight: 900,
              margin: 0,
              letterSpacing: "-.01em",
            }}
          >
            고가용성 및 확장성 — ELB + ASG
          </h1>
          <span style={{ fontSize: 12.5, color: C.sub }}>
            섹션 59–77 · 실습 제외 전체 개념 정리
          </span>
        </div>
      </header>

      <div className="dva-layout">
        <nav className="dva-side">
          <div className="navlist">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                className={`dva-navitem ${s.id === cur ? "on" : ""}`}
                onClick={() => setCur(s.id)}
              >
                <span
                  className="navnum"
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    opacity: 0.75,
                    width: 20,
                    flex: "none",
                  }}
                >
                  {s.no}
                </span>
                <span style={{ flex: 1 }}>{s.title}</span>
                <span
                  className="dots"
                  style={{ display: "inline-flex", gap: 2.5, flex: "none" }}
                >
                  {[1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className={i <= s.freq ? "f" : ""}
                      style={{
                        width: 5.5,
                        height: 5.5,
                        borderRadius: 99,
                        background: i <= s.freq ? C.amber : "#CBD4DC",
                      }}
                    />
                  ))}
                </span>
              </button>
            ))}
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "10px 12px",
              fontSize: 11.5,
              color: C.sub,
              lineHeight: 1.6,
              borderTop: `1px solid ${C.line}`,
            }}
          >
            ● 점 개수 = DVA 출제 빈도 (수험 경향 기반 추정)
          </div>
        </nav>

        <main className="dva-main">
          <article className="dva-card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 11.5,
                  fontWeight: 800,
                  color: tagColor[0],
                  background: tagColor[1],
                  padding: "3px 10px",
                  borderRadius: 999,
                }}
              >
                {sec.tag}
              </span>
              <Freq n={sec.freq} />
            </div>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 900,
                margin: "6px 0 4px",
                letterSpacing: "-.015em",
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  color: "#B4BFC9",
                  fontSize: 17,
                  marginRight: 8,
                }}
              >
                {sec.no}
              </span>
              {sec.title}
            </h2>
            <div
              style={{ height: 1, background: C.line, margin: "16px 0 4px" }}
            />
            <Body />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 30,
                paddingTop: 18,
                borderTop: `1px solid ${C.line}`,
                gap: 10,
              }}
            >
              <button
                onClick={() => idx > 0 && setCur(SECTIONS[idx - 1].id)}
                disabled={idx === 0}
                style={{
                  fontFamily: "inherit",
                  fontSize: 13.5,
                  fontWeight: 700,
                  padding: "10px 16px",
                  borderRadius: 9,
                  border: `1px solid ${C.line}`,
                  background: "#fff",
                  color: idx === 0 ? "#B9C3CC" : C.ink,
                  cursor: idx === 0 ? "default" : "pointer",
                }}
              >
                ← {idx > 0 ? SECTIONS[idx - 1].title : "이전"}
              </button>
              <button
                onClick={() =>
                  idx < SECTIONS.length - 1 && setCur(SECTIONS[idx + 1].id)
                }
                disabled={idx === SECTIONS.length - 1}
                style={{
                  fontFamily: "inherit",
                  fontSize: 13.5,
                  fontWeight: 700,
                  padding: "10px 16px",
                  borderRadius: 9,
                  border: 0,
                  background: idx === SECTIONS.length - 1 ? "#C9D2DA" : C.teal,
                  color: "#fff",
                  cursor: idx === SECTIONS.length - 1 ? "default" : "pointer",
                }}
              >
                {idx < SECTIONS.length - 1
                  ? `${SECTIONS[idx + 1].title} →`
                  : "완료"}
              </button>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
