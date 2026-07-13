import React, { useState } from "react";

/* ─────────────────────────────────────────────────────────────
   AWS DVA-C02 · 모니터링 & 감사 (CloudWatch / EventBridge / X-Ray / CloudTrail)
   강의 237–265 전체 개념 정리 (실습 제외) + 빈출도 표시
   색상 언어(모든 다이어그램 공통):
   지표=앰버 · 로그=하늘색 · 이벤트=핑크 · 트레이싱=보라 · 감사=청록 · 경보=로즈
   ───────────────────────────────────────────────────────────── */

const C = {
  bg: "#0E1526",
  panel: "#151F35",
  panel2: "#0A101E",
  line: "#2A3752",
  text: "#E9EEF8",
  body: "#C6D0E2",
  mut: "#8B99B3",
  orange: "#FF9900",
  metric: "#FFB020",
  log: "#4CC2FF",
  alarm: "#FF6B81",
  trace: "#B18CFF",
  audit: "#39D0B8",
  event: "#FF7AC8",
  green: "#4ADE80",
  gray: "#7C8AA5",
};
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

const FREQ = {
  1: { t: "낮음", c: "#8B99B3" },
  2: { t: "보통", c: C.log },
  3: { t: "높음", c: C.metric },
  4: { t: "매우 높음", c: C.alarm },
};

/* ── 공통 UI 컴포넌트 ─────────────────────────────────────── */

const Freq = ({ n, small }) => (
  <span
    className="inline-flex items-center gap-1.5 rounded-full font-bold"
    style={{
      background: FREQ[n].c + "16",
      color: FREQ[n].c,
      border: `1px solid ${FREQ[n].c}55`,
      padding: small ? "2px 8px" : "3px 10px",
      fontSize: small ? 10.5 : 12,
    }}
  >
    <span className="flex items-end" style={{ gap: 2 }}>
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          style={{
            width: 3,
            height: 3 + i * 2.5,
            borderRadius: 1,
            background: i <= n ? FREQ[n].c : "#33405C",
          }}
        />
      ))}
    </span>
    빈출 {FREQ[n].t}
  </span>
);

const SecHead = ({ no, t, sub, f, c = C.orange }) => (
  <div className="mb-3">
    <div className="mb-2 flex flex-wrap items-center gap-2">
      <span
        className="rounded px-2 py-0.5 text-[10.5px] font-bold tracking-widest"
        style={{ color: c, border: `1px solid ${c}55`, background: c + "10", fontFamily: MONO }}
      >
        {no}
      </span>
      {f && <Freq n={f} />}
    </div>
    <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: C.text }}>
      {t}
    </h1>
    {sub && (
      <p className="mt-1 text-sm" style={{ color: C.mut }}>
        {sub}
      </p>
    )}
  </div>
);

const H3 = ({ c = C.orange, children }) => (
  <h3 className="mb-1 mt-7 flex items-center gap-2 text-[16px] font-bold" style={{ color: C.text }}>
    <span className="inline-block h-4 w-1 rounded" style={{ background: c }} />
    {children}
  </h3>
);

const P = ({ children }) => (
  <p className="my-3 text-[14.5px] leading-7" style={{ color: C.body }}>
    {children}
  </p>
);

const B = ({ c = C.text, children }) => (
  <strong style={{ color: c, fontWeight: 700 }}>{children}</strong>
);

const K = ({ children }) => (
  <code
    className="rounded px-1.5 py-0.5 text-[12.5px]"
    style={{ background: "#0A0F1C", border: `1px solid ${C.line}`, color: "#9FE8FF", fontFamily: MONO }}
  >
    {children}
  </code>
);

const Ul = ({ items, c = C.orange }) => (
  <ul className="my-3 space-y-2">
    {items.map((it, i) => (
      <li key={i} className="flex gap-2.5 text-[14.5px] leading-7" style={{ color: C.body }}>
        <span style={{ color: c, marginTop: 1 }}>▸</span>
        <span className="min-w-0">{it}</span>
      </li>
    ))}
  </ul>
);

const Tip = ({ title = "시험 포인트", children }) => (
  <div
    className="my-5 rounded-xl p-4"
    style={{ background: "#221B10", border: `1px solid ${C.orange}44`, borderLeft: `4px solid ${C.orange}` }}
  >
    <div className="mb-1.5 flex items-center gap-2 text-[13px] font-extrabold" style={{ color: C.orange }}>
      <span
        className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px]"
        style={{ background: C.orange, color: "#1A1206" }}
      >
        ✓
      </span>
      {title}
    </div>
    <div className="text-[13.5px] leading-7" style={{ color: "#E4D9C4" }}>
      {children}
    </div>
  </div>
);

const Code = ({ children }) => (
  <pre
    className="my-3 overflow-x-auto rounded-lg p-3.5 text-[12.5px] leading-6"
    style={{ background: "#080D18", border: `1px solid ${C.line}`, color: "#B7E7FF", fontFamily: MONO }}
  >
    {children}
  </pre>
);

const Tbl = ({ head, rows }) => (
  <div className="my-4 overflow-x-auto rounded-xl" style={{ border: `1px solid ${C.line}` }}>
    <table className="w-full text-left text-[13px]" style={{ minWidth: 520 }}>
      <thead>
        <tr style={{ background: "#1B2540" }}>
          {head.map((h, i) => (
            <th key={i} className="px-3 py-2.5 font-bold" style={{ color: C.text, whiteSpace: "nowrap" }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} style={{ borderTop: `1px solid ${C.line}`, background: i % 2 ? "#111A2E" : "transparent" }}>
            {r.map((cell, j) => (
              <td key={j} className="px-3 py-2.5 align-top leading-6" style={{ color: C.body }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Chip = ({ c = C.log, children }) => (
  <span
    className="mb-1.5 mr-1.5 inline-block rounded-md px-2 py-1 text-[12px] font-semibold"
    style={{ background: c + "12", border: `1px solid ${c}50`, color: c }}
  >
    {children}
  </span>
);

const Card = ({ c = C.log, title, children }) => (
  <div className="rounded-xl p-4" style={{ background: C.panel, border: `1px solid ${C.line}`, borderTop: `3px solid ${c}` }}>
    <div className="mb-1.5 text-[14px] font-extrabold" style={{ color: c }}>
      {title}
    </div>
    <div className="text-[13.5px] leading-7" style={{ color: C.body }}>
      {children}
    </div>
  </div>
);

/* ── SVG 다이어그램 헬퍼 ──────────────────────────────────── */

const Defs = () => (
  <defs>
    {[
      ["ah", "#8FA0BC"],
      ["ahO", C.orange],
      ["ahB", C.log],
      ["ahR", C.alarm],
      ["ahG", C.green],
      ["ahP", C.trace],
      ["ahT", C.audit],
      ["ahM", C.metric],
      ["ahE", C.event],
    ].map(([id, c]) => (
      <marker key={id} id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill={c} />
      </marker>
    ))}
  </defs>
);

const Dgm = ({ vw = 760, vh, cap, minW = 580, children }) => (
  <div className="my-4 rounded-xl p-3" style={{ background: C.panel2, border: `1px solid ${C.line}` }}>
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${vw} ${vh}`} className="w-full" style={{ minWidth: minW, display: "block" }}>
        <Defs />
        {children}
      </svg>
    </div>
    {cap && (
      <div className="mt-2 px-1 text-[12px] leading-5" style={{ color: C.mut }}>
        {cap}
      </div>
    )}
  </div>
);

const Box = ({ x, y, w, h, c = C.orange, t, s, s2, fs = 12.5, dash, fill }) => {
  const lines = [t, s, s2].filter((v) => v !== undefined && v !== null);
  const lh = 14;
  const y0 = y + h / 2 - ((lines.length - 1) * lh) / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="9" fill={fill ?? c + "12"} stroke={c} strokeWidth="1.4" strokeDasharray={dash ? "6 4" : "none"} />
      {lines.map((ln, i) => (
        <text
          key={i}
          x={x + w / 2}
          y={y0 + i * lh}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={i === 0 ? fs : fs - 2}
          fontWeight={i === 0 ? 700 : 500}
          fill={i === 0 ? C.text : "#9AA7BF"}
        >
          {ln}
        </text>
      ))}
    </g>
  );
};

const Arw = ({ x1, y1, x2, y2, c = "#8FA0BC", m = "ah", t, tx, ty, dash, fs = 10.5 }) => (
  <g>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth="1.6" markerEnd={`url(#${m})`} strokeDasharray={dash ? "5 4" : "none"} />
    {t && (
      <text x={tx ?? (x1 + x2) / 2} y={ty ?? (y1 + y2) / 2 - 7} textAnchor="middle" fontSize={fs} fill="#AFBBD2" fontWeight="600">
        {t}
      </text>
    )}
  </g>
);

const Grp = ({ x, y, w, h, c = "#5A6B8C", t }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx="12" fill={c + "08"} stroke={c} strokeWidth="1.2" strokeDasharray="6 5" />
    {t && (
      <text x={x + 12} y={y + 18} fontSize="11" fontWeight="700" fill={c} fontFamily={MONO}>
        {t}
      </text>
    )}
  </g>
);

const T = ({ x, y, c = C.mut, fs = 11, w = 500, a = "middle", mono, children }) => (
  <text x={x} y={y} fill={c} fontSize={fs} fontWeight={w} textAnchor={a} fontFamily={mono ? MONO : "inherit"}>
    {children}
  </text>
);

/* ── 내비게이션 데이터 ────────────────────────────────────── */

const NAV = [
  { g: "INTRO", c: "#8FA0BC", items: [{ id: "overview", t: "AWS 모니터링 개요", n: "237–238" }] },
  {
    g: "CLOUDWATCH",
    c: C.metric,
    items: [
      { id: "metrics", t: "지표 (Metrics)", n: "239", f: 3 },
      { id: "custom", t: "사용자 지정 지표", n: "240", f: 3 },
      { id: "logs", t: "로그 (Logs)", n: "241·243", f: 4 },
      { id: "agent", t: "에이전트", n: "244", f: 3 },
      { id: "filters", t: "메트릭 필터", n: "245", f: 3 },
      { id: "alarms", t: "경보 (Alarms)", n: "247", f: 4 },
      { id: "synthetics", t: "Synthetics 카나리", n: "249", f: 1 },
    ],
  },
  { g: "EVENTBRIDGE", c: C.event, items: [{ id: "eventbridge", t: "Amazon EventBridge", n: "250·252", f: 3 }] },
  {
    g: "X-RAY",
    c: C.trace,
    items: [
      { id: "xray", t: "X-Ray 개요", n: "253", f: 4 },
      { id: "xray2", t: "계측 · 개념 · 주석", n: "255", f: 4 },
      { id: "xray3", t: "샘플링 & API", n: "256–257", f: 3 },
      { id: "xray4", t: "Beanstalk · ECS · ADOT", n: "258–260", f: 2 },
    ],
  },
  { g: "CLOUDTRAIL", c: C.audit, items: [{ id: "cloudtrail", t: "CloudTrail", n: "261·263", f: 3 }] },
  { g: "WRAP-UP", c: C.orange, items: [{ id: "compare", t: "3종 비교 & 총정리", n: "264–265", f: 4 }] },
];

/* ═════════════════════════════════════════════════════════════
   SECTION 1 · 모니터링 개요 (237–238)
   ═════════════════════════════════════════════════════════════ */

function SOverview() {
  const domains = [
    { t: "도메인 1 · AWS 서비스 기반 개발", p: 32, on: false },
    { t: "도메인 2 · 보안", p: 26, on: false },
    { t: "도메인 3 · 배포", p: 24, on: false },
    { t: "도메인 4 · 트러블슈팅 & 최적화", p: 18, on: true },
  ];
  return (
    <div>
      <SecHead no="SECTION 237–238" t="AWS 모니터링 — 왜, 무엇으로?" sub="사용자는 내부 구조가 아니라 '앱이 잘 되는가'만 본다" c="#8FA0BC" />
      <P>
        사용자가 신경 쓰는 것은 코드도 아키텍처도 아닌 <B>“애플리케이션이 잘 동작하는가”</B>뿐입니다. 그래서 우리는{" "}
        <B>지연 시간(latency)</B>이 늘어나지 않는지, <B>장애(outage)</B>가 나지 않는지, 사용자가 문제를 겪기 <B>전에</B> 내부적으로
        먼저 알아챌 수 있는지, 그리고 <B>비용 절감·확장 패턴·병목</B>을 파악할 수 있는지를 상시 확인해야 합니다.
      </P>
      <P>AWS에서 모니터링은 다섯 개의 기둥으로 나뉘고, 이 색상 언어가 이 가이드의 모든 다이어그램에 그대로 쓰입니다.</P>

      <Dgm vw={780} vh={286} cap="다섯 기둥 요약 — 지표(얼마나?), 로그(무슨 일이?), 이벤트(반응·자동화), 트레이싱(어디가 느린가?), 감사(누가 호출했나?)">
        <Box x={240} y={18} w={300} h={54} c="#8FA0BC" t="여러분의 애플리케이션" s="EC2 · Lambda · ECS · Beanstalk …" />
        {[
          { x: 12, c: C.metric, t: "지표", s: "CloudWatch", s2: "Metrics", cap: "성능을 숫자로" },
          { x: 168, c: C.log, t: "로그", s: "CloudWatch", s2: "Logs", cap: "무슨 일이 있었나" },
          { x: 324, c: C.event, t: "이벤트", s: "EventBridge", s2: "(구 CW Events)", cap: "반응하고 자동화" },
          { x: 480, c: C.trace, t: "트레이싱", s: "X-Ray", s2: "분산 추적", cap: "요청이 어디서 느린가" },
          { x: 636, c: C.audit, t: "감사", s: "CloudTrail", s2: "API 기록", cap: "누가 무엇을 했나" },
        ].map((b, i) => (
          <g key={i}>
            <Arw x1={390} y1={72} x2={b.x + 66} y2={148} c={b.c} m={["ahM", "ahB", "ahE", "ahP", "ahT"][i]} />
            <Box x={b.x} y={152} w={132} h={72} c={b.c} t={b.t} s={b.s} s2={b.s2} />
            <T x={b.x + 66} y={246} fs={10.5}>{b.cap}</T>
          </g>
        ))}
        <T x={390} y={274} fs={11} c="#7f8db0">여기에 더해 경보(Alarms, 로즈색)가 지표 위에서 자동 조치를 트리거합니다</T>
      </Dgm>

      <H3 c="#8FA0BC">이 섹션이 시험에서 차지하는 비중</H3>
      <P>
        모니터링·감사는 DVA-C02 공식 도메인 중 <B c={C.alarm}>도메인 4 “Troubleshooting and Optimization(18%)”</B>의 핵심이며,
        다른 도메인 문제에도 X-Ray·CloudWatch가 보기(선택지)로 계속 등장합니다. 65문항 기준 대략 <B>10문항 안팎</B>이 이 섹션
        지식으로 풀립니다.
      </P>
      <div className="my-4 space-y-2.5">
        {domains.map((d, i) => (
          <div key={i}>
            <div className="mb-1 flex items-baseline justify-between text-[12.5px]">
              <span style={{ color: d.on ? C.text : C.mut, fontWeight: d.on ? 800 : 500 }}>{d.t}</span>
              <span style={{ color: d.on ? C.orange : C.mut, fontFamily: MONO, fontWeight: 700 }}>{d.p}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ background: "#1B2540" }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${d.p * 3.05}%`, background: d.on ? `linear-gradient(90deg, ${C.orange}, ${C.alarm})` : "#3A4A6E" }}
              />
            </div>
          </div>
        ))}
      </div>

      <Tip title="빈출도 표기 기준">
        각 페이지의 <B c={C.orange}>“빈출 낮음/보통/높음/매우 높음”</B> 배지는 AWS가 공개한 문항 배점이 아니라, DVA-C02 도메인
        비중(도메인 4 = 18%)과 다수 수험 후기·문제은행 경향을 바탕으로 한 <B c={C.orange}>추정치</B>입니다. 우선순위 배분용으로만
        참고하세요. 이 섹션의 최빈출 4대장: <B c={C.orange}>X-Ray(주석 vs 메타데이터 · 활성화 조건) · CloudWatch 경보 · CloudWatch
        로그(구독 vs 내보내기) · 3종 서비스 비교</B>.
      </Tip>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   SECTION 2 · CloudWatch 지표 (239)
   ═════════════════════════════════════════════════════════════ */

function SMetrics() {
  return (
    <div>
      <SecHead no="SECTION 239 · CLOUDWATCH" t="CloudWatch 지표 (Metrics)" sub="AWS의 모든 서비스가 성능을 '숫자'로 보고하는 곳" f={3} c={C.metric} />
      <P>
        CloudWatch는 <B>AWS 내 모든 서비스의 지표</B>를 제공합니다. <B>지표(Metric)</B>란 모니터링할 변수 —{" "}
        <K>CPUUtilization</K>, <K>NetworkIn</K>, S3 버킷 크기, 청구 금액 등 — 이며 시간에 따른 <B>데이터 포인트의 시계열</B>입니다.
      </P>
      <Ul
        c={C.metric}
        items={[
          <>지표는 <B>네임스페이스(namespace)</B>에 속합니다. 서비스당 하나의 네임스페이스(예: <K>AWS/EC2</K>, <K>AWS/Lambda</K>).</>,
          <><B>디멘션(dimension)</B> = 지표의 속성(예: 인스턴스 ID, 환경 이름). <B c={C.metric}>지표당 최대 30개</B>까지 붙일 수 있습니다.</>,
          <>모든 지표에는 <B>타임스탬프</B>가 있고, 지표들을 모아 <B>CloudWatch 대시보드</B>를 만들 수 있습니다.</>,
          <>커스텀 지표(예: EC2 메모리)도 밀어 넣을 수 있습니다 → 다음 페이지에서 상세히.</>,
        ]}
      />

      <Dgm vw={780} vh={252} cap="네임스페이스 = 서비스별 폴더, 지표 = 시계열 변수, 디멘션 = 지표를 쪼개 보는 속성(지표당 최대 30개)">
        <Grp x={12} y={16} w={240} h={196} c={C.metric} t="NAMESPACE: AWS/EC2" />
        <Box x={30} y={46} w={204} h={44} c={C.metric} t="CPUUtilization" s="5분(기본) 간격 데이터 포인트" fs={12} />
        <Box x={30} y={100} w={204} h={36} c={C.metric} t="NetworkIn / NetworkOut" fs={11.5} />
        <Box x={30} y={146} w={98} h={30} c="#8FA0BC" t="InstanceId=…" fs={9.5} dash />
        <Box x={136} y={146} w={98} h={30} c="#8FA0BC" t="Env=prod" fs={9.5} dash />
        <T x={132} y={198} fs={9.5}>↑ 디멘션 (지표당 ≤ 30개)</T>

        <Grp x={272} y={16} w={240} h={196} c={C.metric} t="NAMESPACE: AWS/Lambda" />
        <Box x={290} y={46} w={204} h={36} c={C.metric} t="Invocations" fs={11.5} />
        <Box x={290} y={92} w={204} h={36} c={C.metric} t="Errors / Throttles" fs={11.5} />
        <Box x={290} y={138} w={204} h={36} c={C.metric} t="Duration" fs={11.5} />

        <Grp x={532} y={16} w={236} h={196} c={C.orange} t="NAMESPACE: MyApp (커스텀)" />
        <Box x={550} y={46} w={200} h={36} c={C.orange} t="MemoryUsage" fs={11.5} />
        <Box x={550} y={92} w={200} h={36} c={C.orange} t="ActiveUsers" fs={11.5} />
        <T x={650} y={158} fs={10}>PutMetricData API로 직접 푸시</T>
        <T x={390} y={240} fs={11} c="#7f8db0">같은 지표라도 디멘션 조합(인스턴스별 · 환경별 · 전체)마다 별도의 시계열로 조회됩니다</T>
      </Dgm>

      <H3 c={C.metric}>EC2 모니터링 간격 — 기본 vs 상세</H3>
      <Ul
        c={C.metric}
        items={[
          <>EC2 인스턴스 지표는 <B>기본 5분 간격</B>으로 수집됩니다 (무료).</>,
          <><B>상세 모니터링(Detailed Monitoring)</B>을 켜면(유료) <B c={C.metric}>1분 간격</B> — <B>ASG(Auto Scaling Group)가 변화에 더 빨리 반응</B>해 스케일링할 수 있습니다.</>,
          <>프리 티어로도 상세 모니터링 지표 10개까지는 무료로 사용할 수 있습니다.</>,
        ]}
      />

      <Dgm vw={780} vh={196} cap="같은 10분 구간 — 기본 모니터링은 3개, 상세 모니터링은 11개의 데이터 포인트. ASG가 급증을 감지하는 속도가 달라집니다.">
        <T x={16} y={44} a="start" fs={12} w={700} c={C.text}>기본 모니터링</T>
        <T x={16} y={60} a="start" fs={10}>5분 간격 · 무료</T>
        <line x1={170} y1={52} x2={750} y2={52} stroke="#3A4A6E" strokeWidth="2" />
        {[0, 5, 10].map((m) => (
          <g key={m}>
            <circle cx={170 + m * 58} cy={52} r={6} fill={C.metric} />
            <T x={170 + m * 58} y={78} fs={9.5}>{m}분</T>
          </g>
        ))}
        <T x={16} y={126} a="start" fs={12} w={700} c={C.text}>상세 모니터링</T>
        <T x={16} y={142} a="start" fs={10}>1분 간격 · 유료</T>
        <line x1={170} y1={134} x2={750} y2={134} stroke="#3A4A6E" strokeWidth="2" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((m) => (
          <circle key={m} cx={170 + m * 58} cy={134} r={4.5} fill={C.orange} />
        ))}
        <T x={460} y={168} fs={10.5} c={C.orange}>→ ASG 스케일링 판단이 최대 4분 빨라짐</T>
      </Dgm>

      <Tip>
        <B c={C.orange}>EC2 메모리(RAM) 사용량은 기본 지표에 없습니다!</B> 시험 단골 함정. 메모리·디스크 상세·프로세스 지표가
        필요하면 인스턴스 <B c={C.orange}>내부에서 커스텀 지표로 직접 푸시</B>해야 합니다(통합 CloudWatch 에이전트 또는{" "}
        <K>PutMetricData</K>). “ASG가 더 빨리 스케일링하게 하려면?” → <B c={C.orange}>상세 모니터링(1분)</B> 활성화.
      </Tip>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   SECTION 3 · 사용자 지정 지표 (240)
   ═════════════════════════════════════════════════════════════ */

function SCustom() {
  return (
    <div>
      <SecHead no="SECTION 240 · CLOUDWATCH" t="사용자 지정 지표 (Custom Metrics)" sub="내가 정의한 숫자를 CloudWatch로 밀어 넣기" f={3} c={C.metric} />
      <P>
        AWS가 자동으로 주지 않는 값 — <B>메모리 사용량, 디스크 공간, 동시 로그인 사용자 수</B> 같은 것 — 은{" "}
        <B c={C.metric}>내가 직접 정의</B>해서 <K>PutMetricData</K> API로 CloudWatch에 보냅니다.
      </P>

      <Dgm vw={780} vh={132} cap="애플리케이션·스크립트·에이전트가 PutMetricData API 호출로 커스텀 네임스페이스에 지표를 적재">
        <Box x={20} y={34} w={230} h={64} c="#8FA0BC" t="애플리케이션 / 스크립트" s="EC2 · 온프레미스 · 어디서든" />
        <Arw x1={250} y1={66} x2={470} y2={66} c={C.metric} m="ahM" t="PutMetricData API" />
        <Box x={474} y={34} w={286} h={64} c={C.metric} t="CloudWatch 커스텀 지표" s="네임스페이스: MyApp · 지표: MemoryUsage" />
      </Dgm>

      <Ul
        c={C.metric}
        items={[
          <><B>디멘션</B>으로 지표를 세분화할 수 있습니다 — 예: <K>Instance.id</K>, <K>Environment.name</K>.</>,
          <><B>StorageResolution</B> 파라미터로 해상도를 결정: <B>표준(Standard) = 1분</B>(기본) / <B c={C.metric}>고해상도(High Resolution) = 1 · 5 · 10 · 30초</B> — 비용이 더 높습니다.</>,
          <>고해상도 지표에 경보를 걸 때는 경보 주기가 <B>10초 또는 30초</B>만 가능합니다.</>,
        ]}
      />

      <Dgm vw={780} vh={168} cap="StorageResolution — 표준 1분 vs 고해상도(최소 1초). 촘촘할수록 빠르게 반응하지만 비용 증가.">
        <T x={16} y={46} a="start" fs={12} w={700} c={C.text}>표준 (Standard)</T>
        <T x={16} y={62} a="start" fs={10}>1분 해상도 · 기본</T>
        <line x1={190} y1={54} x2={750} y2={54} stroke="#3A4A6E" strokeWidth="2" />
        {[0, 1, 2].map((m) => (
          <circle key={m} cx={210 + m * 260} cy={54} r={6} fill={C.metric} />
        ))}
        <T x={16} y={116} a="start" fs={12} w={700} c={C.text}>고해상도 (High Res)</T>
        <T x={16} y={132} a="start" fs={10}>1 / 5 / 10 / 30초</T>
        <line x1={190} y1={124} x2={750} y2={124} stroke="#3A4A6E" strokeWidth="2" />
        {Array.from({ length: 27 }).map((_, i) => (
          <circle key={i} cx={210 + i * 20} cy={124} r={3.5} fill={C.orange} />
        ))}
        <T x={470} y={156} fs={10.5} c={C.orange}>더 세밀한 관찰 · 더 높은 비용 · 경보 주기 10/30초</T>
      </Dgm>

      <H3 c={C.metric}>타임스탬프 허용 범위 — 과거 2주 ~ 미래 2시간</H3>
      <P>
        <K>PutMetricData</K>는 <B c={C.metric}>과거 2주</B>까지, <B c={C.metric}>미래 2시간</B>까지의 타임스탬프가 붙은 데이터
        포인트를 받아줍니다. 그 밖의 시각이면 데이터가 수용되지 않습니다.
      </P>
      <Dgm vw={780} vh={130} cap="허용 창(초록) 밖의 타임스탬프는 적재 실패 — 인스턴스 시계가 틀어져 있으면 그래프에 데이터가 '사라진 것처럼' 보입니다">
        <line x1={30} y1={64} x2={750} y2={64} stroke="#3A4A6E" strokeWidth="2" />
        <rect x={120} y={48} width={480} height={32} rx={8} fill={C.green + "18"} stroke={C.green} />
        <rect x={30} y={52} width={80} height={24} rx={6} fill={C.alarm + "14"} stroke={C.alarm} strokeDasharray="4 3" />
        <rect x={660} y={52} width={90} height={24} rx={6} fill={C.alarm + "14"} stroke={C.alarm} strokeDasharray="4 3" />
        <line x1={540} y1={38} x2={540} y2={90} stroke={C.orange} strokeWidth="2" />
        <T x={540} y={28} fs={11} w={800} c={C.orange}>현재</T>
        <T x={130} y={104} fs={10.5} a="start" c={C.green}>← 과거 2주까지 OK</T>
        <T x={598} y={104} fs={10.5} a="end" c={C.green}>미래 2시간까지 OK →</T>
        <T x={70} y={104} fs={10} c={C.alarm}>거부</T>
        <T x={705} y={104} fs={10} c={C.alarm}>거부</T>
      </Dgm>

      <Tip>
        “커스텀 지표를 보내는데 오류도 없고 그래프에도 안 보인다?” → <B c={C.orange}>EC2 인스턴스의 시간(타임스탬프) 동기화</B>를
        의심하세요. 시각이 틀어지면 데이터가 엉뚱한 시간대에 들어가거나 허용 창을 벗어납니다. 그리고{" "}
        <B c={C.orange}>“1분보다 촘촘한 지표” = StorageResolution 고해상도(1s)</B> 키워드를 기억하세요.
      </Tip>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   SECTION 4 · CloudWatch 로그 (241 · 243)
   ═════════════════════════════════════════════════════════════ */

function SLogs() {
  return (
    <div>
      <SecHead no="SECTION 241 · 243 · CLOUDWATCH" t="CloudWatch 로그 (Logs)" sub="AWS에서 로그를 저장하기 가장 좋은 곳 — 저장 · 검색 · 내보내기 · 실시간 스트리밍" f={4} c={C.log} />
      <Ul
        c={C.log}
        items={[
          <><B>로그 그룹(Log Group)</B> — 임의의 이름, 보통 애플리케이션 단위. / <B>로그 스트림(Log Stream)</B> — 그룹 내부의 스트림, 인스턴스·로그 파일·컨테이너 단위.</>,
          <><B>보존(만료) 정책</B>은 로그 그룹 수준에서 설정: <B c={C.log}>만료 없음 ~ 1일 · 10년 사이</B> 선택.</>,
          <>로그는 <B>KMS 키로 암호화</B>할 수 있습니다 (보안 강화).</>,
        ]}
      />
      <H3 c={C.log}>로그를 보낼 수 있는 소스</H3>
      <div className="my-2">
        <Chip c={C.log}>SDK (직접 전송)</Chip>
        <Chip c={C.log}>CloudWatch Logs Agent (구형)</Chip>
        <Chip c={C.log}>CloudWatch 통합 에이전트</Chip>
        <Chip c={C.log}>Elastic Beanstalk (앱 로그 수집)</Chip>
        <Chip c={C.log}>ECS (컨테이너 로그)</Chip>
        <Chip c={C.log}>Lambda (함수 로그)</Chip>
        <Chip c={C.log}>VPC Flow Logs (네트워크 트래픽)</Chip>
        <Chip c={C.log}>API Gateway (요청 로그)</Chip>
        <Chip c={C.log}>CloudTrail (필터 기반 전송)</Chip>
        <Chip c={C.log}>Route53 (DNS 쿼리 로그)</Chip>
      </div>

      <Dgm vw={860} vh={368} minW={680} cap="핵심 흐름 — S3 내보내기는 배치(최대 12시간, 실시간 아님), 구독 필터는 실시간. Kinesis Data Streams → Firehose → S3 경로로 다중 계정·리전 로그를 준실시간 집계하는 패턴이 시험에 나옵니다.">
        <Grp x={12} y={16} w={188} h={330} c="#5A6B8C" t="소스" />
        {["SDK / 앱 직접 전송", "통합 에이전트 (EC2)", "Lambda", "VPC Flow Logs", "API Gateway", "CloudTrail", "Route53 DNS 쿼리"].map((s, i) => (
          <Box key={i} x={26} y={40 + i * 42} w={160} h={32} c="#8FA0BC" t={s} fs={10.5} />
        ))}
        <Arw x1={200} y1={182} x2={248} y2={182} c={C.log} m="ahB" />
        <Grp x={252} y={92} w={216} h={186} c={C.log} t="LOG GROUP: /my-app" />
        {["로그 스트림: i-0abc12…", "로그 스트림: i-0def34…", "로그 스트림: container-7…"].map((s, i) => (
          <Box key={i} x={266} y={120 + i * 44} w={188} h={34} c={C.log} t={s} fs={10.5} />
        ))}
        <T x={360} y={296} fs={9.5}>보존: 없음 ~ 1일–10년 · KMS 암호화 가능</T>

        <Arw x1={468} y1={126} x2={664} y2={62} c={C.audit} m="ahT" t="CreateExportTask" tx={556} ty={72} />
        <T x={556} y={86} fs={9.5} c={C.audit}>배치 · 최대 12시간 · 실시간 ✕</T>
        <Box x={668} y={36} w={178} h={48} c={C.audit} t="Amazon S3" s="장기 보관 · Athena 분석" />

        <Arw x1={468} y1={210} x2={512} y2={210} c={C.log} m="ahB" />
        <Box x={516} y={186} w={122} h={48} c={C.event} t="구독 필터" s="실시간 · 패턴 선별" fs={11.5} />
        <Arw x1={638} y1={198} x2={664} y2={148} c={C.log} m="ahB" />
        <Arw x1={638} y1={210} x2={664} y2={216} c={C.log} m="ahB" />
        <Arw x1={638} y1={222} x2={664} y2={284} c={C.log} m="ahB" />
        <Box x={668} y={124} w={178} h={44} c={C.log} t="Kinesis Data Streams" s="→ 다중 계정·리전 집계" fs={11} />
        <Box x={668} y={194} w={178} h={44} c={C.log} t="Kinesis Data Firehose" s="→ S3 준실시간 · OpenSearch" fs={11} />
        <Box x={668} y={264} w={178} h={44} c={C.log} t="AWS Lambda" s="→ 커스텀 처리 · 타 서비스" fs={11} />
        <T x={430} y={352} fs={10.5} c="#7f8db0" w={600}>실시간(real time)이 필요하면 무조건 구독(Subscription) — Export Task가 아님!</T>
      </Dgm>

      <H3 c={C.log}>CloudWatch Logs Insights — 로그 검색·분석 엔진</H3>
      <Ul
        c={C.log}
        items={[
          <>전용 <B>쿼리 언어</B>로 로그를 검색·집계·시각화 — 예: 특정 IP 포함 로그 찾기, “ERROR” 발생 수 세기.</>,
          <>자동 필드 발견, 필터·집계·정렬·상위 N개 이벤트 조회, 결과를 <B>대시보드에 추가</B> 가능.</>,
          <><B>여러 로그 그룹</B>을 <B c={C.log}>다른 계정·다른 리전에 걸쳐</B> 한 번에 쿼리할 수 있습니다.</>,
          <><B c={C.log}>실시간 엔진이 아닙니다</B> — 쿼리 실행 시점에 저장된 데이터를 조회하는 “쿼리 엔진”입니다.</>,
        ]}
      />
      <Code>{`fields @timestamp, @message
| filter @message like /ERROR/
| sort @timestamp desc
| limit 20`}</Code>

      <H3 c={C.log}>Live Tail (강의 243)</H3>
      <P>
        콘솔에서 로그 이벤트를 <B>실시간 스트리밍으로 지켜보는 디버깅 기능</B>입니다. 필터를 걸어 원하는 이벤트만 하이라이트하며
        볼 수 있고, 개발 중 “로그가 지금 들어오는지” 즉시 확인할 때 씁니다 (사용 시간에 따라 과금).
      </P>

      <H3 c={C.log}>내보내기 vs 구독 vs Insights — 언제 무엇을?</H3>
      <Tbl
        head={["방법", "실시간성", "대상", "대표 사용처"]}
        rows={[
          [<B>S3 내보내기 (Export Task)</B>, <span style={{ color: C.alarm }}>✕ 배치 (최대 12시간)</span>, "S3", "장기 보관, Athena 배치 분석"],
          [<B>구독 필터 (Subscription)</B>, <span style={{ color: C.green }}>◎ 실시간</span>, "Kinesis Data Streams · Firehose · Lambda", "실시간 처리, OpenSearch 적재, 집계"],
          [<B>Logs Insights</B>, "쿼리 시점 조회", "콘솔 · 대시보드", "검색·분석·시각화 (다중 계정/리전)"],
          [<B>Live Tail</B>, <span style={{ color: C.green }}>◎ 실시간 (뷰만)</span>, "콘솔 화면", "개발 중 즉석 디버깅"],
        ]}
      />

      <H3 c={C.log}>교차 계정 구독 (Cross-Account Subscription)</H3>
      <Dgm vw={780} vh={196} cap="보내는 계정의 구독 필터 → 받는 계정의 '구독 대상(Destination)'. 받는 쪽엔 ① 대상 접근 정책(리소스 정책)으로 발신 계정 허용 + ② Kinesis에 쓸 수 있는 IAM 역할이 필요합니다.">
        <Grp x={14} y={22} w={330} h={150} c="#5A6B8C" t="계정 A (발신자 · 111111111111)" />
        <Box x={30} y={54} w={140} h={46} c={C.log} t="로그 그룹" s="/my-app" />
        <Arw x1={170} y1={77} x2={208} y2={77} c={C.log} m="ahB" />
        <Box x={212} y={54} w={116} h={46} c={C.event} t="구독 필터" fs={11.5} />
        <Arw x1={344} y1={77} x2={432} y2={77} c={C.orange} m="ahO" t="교차 계정 전송" />
        <Grp x={436} y={22} w={330} h={150} c="#5A6B8C" t="계정 B (수신자 · 999999999999)" />
        <Box x={452} y={54} w={150} h={46} c={C.orange} t="구독 대상" s="Destination" fs={11.5} />
        <Arw x1={602} y1={77} x2={632} y2={77} c={C.log} m="ahB" />
        <Box x={636} y={54} w={116} h={46} c={C.log} t="Kinesis" s="Data Streams" fs={11.5} />
        <Box x={452} y={116} w={146} h={30} c={C.audit} t="대상 접근 정책" fs={10} dash />
        <Box x={606} y={116} w={146} h={30} c={C.audit} t="IAM 역할 (KDS 쓰기)" fs={10} dash />
      </Dgm>

      <Tip>
        시험 키워드 매핑 — <B c={C.orange}>“실시간으로 로그를 처리/전달”</B> → 구독 필터(대상: KDS·Firehose·Lambda 3가지 암기).{" "}
        <B c={C.orange}>“S3로 로그 내보내기”</B> → <K>CreateExportTask</K>, 최대 12시간 소요, 실시간 아님.{" "}
        <B c={C.orange}>“여러 계정·리전의 로그를 한곳에 모아 준실시간 분석”</B> → 구독 → Kinesis Data Streams → Firehose → S3/OpenSearch.
        교차 계정 구독은 <B c={C.orange}>Destination + 리소스 정책 + IAM 역할</B> 세트로 기억하세요.
      </Tip>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   SECTION 5 · CloudWatch 에이전트 (244)
   ═════════════════════════════════════════════════════════════ */

function SAgent() {
  return (
    <div>
      <SecHead no="SECTION 244 · CLOUDWATCH" t="CloudWatch 에이전트 & Logs 에이전트" sub="EC2의 로그와 시스템 내부 지표는 저절로 올라가지 않는다" f={3} c={C.log} />
      <Ul
        c={C.log}
        items={[
          <><B c={C.log}>기본적으로 EC2 인스턴스의 로그는 CloudWatch로 가지 않습니다.</B> 인스턴스에 <B>에이전트</B>를 설치·실행해야 합니다.</>,
          <>에이전트가 CloudWatch에 쓰려면 <B>IAM 권한(인스턴스 역할)</B>이 올바르게 설정되어야 합니다 — 안 보이면 IAM부터 확인!</>,
          <>에이전트는 <B>온프레미스 서버</B>에도 설치할 수 있습니다 (하이브리드 모니터링).</>,
        ]}
      />

      <Dgm vw={780} vh={228} cap="통합 에이전트 하나가 로그(파란색)와 시스템 수준 지표(앰버색)를 동시에 전송. 구성은 SSM Parameter Store로 중앙 관리 가능.">
        <Grp x={14} y={18} w={360} h={192} c="#5A6B8C" t="EC2 인스턴스 (또는 온프레미스 서버)" />
        <Box x={32} y={50} w={150} h={52} c="#8FA0BC" t="애플리케이션" s="app.log 파일 기록" />
        <Box x={210} y={50} w={148} h={110} c={C.orange} t="통합 CloudWatch" s="에이전트" s2="(Unified Agent)" />
        <Arw x1={182} y1={76} x2={206} y2={76} c="#8FA0BC" />
        <Box x={32} y={122} w={150} h={38} c={C.audit} t="IAM 인스턴스 역할" fs={11} dash />
        <Arw x1={182} y1={141} x2={206} y2={130} c={C.audit} m="ahT" dash />
        <T x={194} y={196} fs={9.5}>구성: SSM Parameter Store 중앙 관리</T>
        <Arw x1={358} y1={82} x2={560} y2={62} c={C.log} m="ahB" t="로그" tx={462} ty={58} />
        <Arw x1={358} y1={128} x2={560} y2={148} c={C.metric} m="ahM" t="시스템 지표" tx={462} ty={128} />
        <Box x={564} y={36} w={196} h={48} c={C.log} t="CloudWatch Logs" />
        <Box x={564} y={124} w={196} h={48} c={C.metric} t="CloudWatch Metrics" s="RAM · 디스크 · 프로세스 …" />
      </Dgm>

      <H3 c={C.log}>Logs 에이전트(구형) vs 통합 에이전트</H3>
      <Tbl
        head={["", "CloudWatch Logs 에이전트 (구형)", "통합 에이전트 (권장)"]}
        rows={[
          ["로그 전송", "○ (로그만 가능)", "○"],
          ["시스템 수준 지표", <span style={{ color: C.alarm }}>✕</span>, <span style={{ color: C.green }}>◎ 세분화된 지표 수집</span>],
          ["중앙 집중 구성", "✕", "○ SSM Parameter Store"],
          ["상태", "레거시", "신규 프로젝트 표준"],
        ]}
      />

      <H3 c={C.metric}>통합 에이전트가 수집하는 시스템 지표</H3>
      <div className="my-2">
        <Chip c={C.metric}>CPU (active · guest · idle · system · user · steal)</Chip>
        <Chip c={C.metric}>디스크 (free · used · total / 디스크 IO)</Chip>
        <Chip c={C.metric}>RAM (free · inactive · used · total · cached)</Chip>
        <Chip c={C.metric}>넷스탯 (TCP/UDP 연결 수 · 패킷 · 바이트)</Chip>
        <Chip c={C.metric}>프로세스 (total · dead · sleeping · running …)</Chip>
        <Chip c={C.metric}>스왑 (used · free · used %)</Chip>
      </div>
      <P>
        여기에 <B>procstat 플러그인</B>을 쓰면 <B>개별 프로세스</B>(예: 특정 자바 프로세스의 CPU·메모리·실행 시간)까지 모니터링할
        수 있습니다. procstat이 수집한 지표는 <B c={C.metric}><K>procstat_</K> 접두어</B>로 시작합니다 — 예:{" "}
        <K>procstat_cpu_time</K>, <K>procstat_cpu_usage</K>.
      </P>

      <Tip>
        “EC2의 <B c={C.orange}>메모리·스왑·디스크·프로세스 수준</B>의 세밀한 지표가 필요하다” → <B c={C.orange}>통합 CloudWatch
        에이전트</B>. 기본 EC2 지표는 하이퍼바이저 레벨(CPU·네트워크·디스크 IO 일부)까지만 보입니다. “특정 프로세스 하나를
        추적” → <B c={C.orange}>procstat 플러그인 (procstat_ 접두어)</B>. 그리고 에이전트가 데이터를 못 보내는 1순위 원인은{" "}
        <B c={C.orange}>IAM 권한 누락</B>입니다.
      </Tip>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   SECTION 6 · 메트릭 필터 (245)
   ═════════════════════════════════════════════════════════════ */

function SFilters() {
  return (
    <div>
      <SecHead no="SECTION 245 · CLOUDWATCH" t="Logs 메트릭 필터 (Metric Filters)" sub="로그 속 패턴을 '숫자(지표)'로 바꿔 경보까지 연결" f={3} c={C.log} />
      <P>
        로그에서 특정 패턴 — “ERROR”라는 단어, 특정 IP — 이 나타나는 횟수를 세어 <B c={C.metric}>CloudWatch 지표로 변환</B>하는
        기능입니다. 이렇게 만든 지표에 <B c={C.alarm}>경보</B>를 걸고 <B c={C.green}>SNS 알림</B>까지 잇는 파이프라인이 시험의
        단골 정답 흐름입니다.
      </P>

      <Dgm vw={840} vh={150} minW={660} cap="시험 최빈출 파이프라인: 로그 → 메트릭 필터 → 지표 → 경보 → SNS(이메일·온콜·Lambda)">
        <Box x={14} y={44} w={150} h={62} c={C.log} t="CW Logs" s='"… ERROR …" 이벤트' />
        <Arw x1={164} y1={75} x2={196} y2={75} c={C.log} m="ahB" />
        <Box x={200} y={44} w={140} h={62} c={C.event} t="메트릭 필터" s='패턴: "ERROR"' />
        <Arw x1={340} y1={75} x2={372} y2={75} c={C.metric} m="ahM" />
        <Box x={376} y={44} w={140} h={62} c={C.metric} t="지표" s="ErrorCount" />
        <Arw x1={516} y1={75} x2={548} y2={75} c={C.alarm} m="ahR" />
        <Box x={552} y={44} w={130} h={62} c={C.alarm} t="경보" s="5분에 10회 초과" />
        <Arw x1={682} y1={75} x2={710} y2={75} c={C.green} m="ahG" />
        <Box x={714} y={44} w={112} h={62} c={C.green} t="SNS" s="알림 · 자동화" />
      </Dgm>

      <Ul
        c={C.log}
        items={[
          <>사용 예: <B>ERROR 발생 횟수 세기</B>, 특정 <B>IP</B>의 등장 횟수 세기, 특정 사용자 활동 카운트 등.</>,
          <><B c={C.alarm}>메트릭 필터는 소급 적용되지 않습니다</B> — 필터를 <B>만든 이후</B>에 들어오는 로그부터만 지표로 집계됩니다. 과거 데이터는 채워지지 않습니다.</>,
          <>필터로 만드는 지표에는 <B>최대 3개의 디멘션</B>을 지정할 수 있습니다 (선택 사항).</>,
        ]}
      />

      <Tip>
        “애플리케이션 로그의 <B c={C.orange}>ERROR가 임계치를 넘으면 알림</B>을 받고 싶다” → 정답은 언제나{" "}
        <B c={C.orange}>메트릭 필터 → 지표 → CloudWatch 경보 → SNS</B>. 함정 두 가지: ① 필터 생성 <B c={C.orange}>이전</B> 로그는
        집계 안 됨, ② Logs Insights 쿼리로는 경보를 만들 수 없음(경보는 지표 기반) — 그래서 메트릭 필터가 필요합니다.
      </Tip>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   SECTION 7 · CloudWatch 경보 (247)
   ═════════════════════════════════════════════════════════════ */

function SAlarms() {
  return (
    <div>
      <SecHead no="SECTION 247 · CLOUDWATCH" t="CloudWatch 경보 (Alarms)" sub="지표가 임계치를 넘으면 알리고 · 조치하고 · 복구한다" f={4} c={C.alarm} />
      <Ul
        c={C.alarm}
        items={[
          <>경보는 <B>어떤 지표 하나</B>에 대해 알림·조치를 트리거합니다 (샘플링, %, 최대/최소 등 다양한 통계 옵션).</>,
          <><B>Period</B> = 지표를 평가하는 시간 간격. <B c={C.alarm}>고해상도 커스텀 지표는 10초 또는 30초</B> 주기만 가능.</>,
          <>경보 상태는 딱 3가지: <K>OK</K> · <K>INSUFFICIENT_DATA</K> · <K>ALARM</K>.</>,
        ]}
      />

      <Dgm vw={780} vh={214} cap="경보의 3가지 상태 — 임계치 위반 시 ALARM, 정상 복귀 시 OK, 판단할 데이터가 부족하면 INSUFFICIENT_DATA">
        <Box x={60} y={120} w={180} h={60} c={C.green} t="OK" s="임계치 안 — 정상" />
        <Box x={540} y={120} w={180} h={60} c={C.alarm} t="ALARM" s="임계치 위반 → 조치 실행" />
        <Box x={300} y={26} w={180} h={60} c="#8FA0BC" t="INSUFFICIENT_DATA" s="평가할 데이터 부족" fs={11.5} />
        <Arw x1={240} y1={138} x2={536} y2={138} c={C.alarm} m="ahR" t="임계치 위반 (N번의 평가 기간)" />
        <Arw x1={536} y1={166} x2={240} y2={166} c={C.green} m="ahG" t="정상 복귀" ty={184} />
        <Arw x1={330} y1={90} x2={190} y2={116} c="#8FA0BC" dash />
        <Arw x1={450} y1={90} x2={590} y2={116} c="#8FA0BC" dash />
      </Dgm>

      <H3 c={C.alarm}>경보가 트리거할 수 있는 3대 대상</H3>
      <Dgm vw={780} vh={240} cap="시험은 이 3가지 대상을 정확히 물어봅니다 — EC2 작업 / Auto Scaling / SNS(→ 무엇이든)">
        <Box x={300} y={20} w={180} h={56} c={C.alarm} t="CloudWatch 경보" s="상태: ALARM" />
        <Arw x1={340} y1={76} x2={130} y2={128} c={C.alarm} m="ahR" />
        <Arw x1={390} y1={76} x2={390} y2={128} c={C.alarm} m="ahR" />
        <Arw x1={440} y1={76} x2={650} y2={128} c={C.alarm} m="ahR" />
        <Box x={30} y={132} w={210} h={70} c={C.metric} t="EC2 인스턴스 작업" s="중지 · 종료 · 재부팅" s2="· 복구(Recover)" />
        <Box x={290} y={132} w={200} h={70} c={C.trace} t="Auto Scaling" s="스케일 아웃 / 스케일 인" />
        <Box x={540} y={132} w={220} h={70} c={C.green} t="SNS 알림" s="→ 이메일 · Lambda · 무엇이든" />
        <T x={390} y={226} fs={10.5} c="#7f8db0">SNS 뒤에 Lambda를 붙이면 사실상 어떤 자동화든 가능</T>
      </Dgm>

      <H3 c={C.alarm}>복합 경보 (Composite Alarms)</H3>
      <P>
        일반 경보는 <B>지표 하나</B>만 봅니다. <B c={C.alarm}>복합 경보</B>는 여러 경보의 상태를 <B>AND / OR</B>로 묶어서 판단해{" "}
        <B>경보 노이즈를 줄입니다</B>.
      </P>
      <Dgm vw={780} vh={168} cap="예: 'CPU가 높다' AND '네트워크도 높다'일 때만 알림 → CPU만 튀는 일시적 스파이크는 무시">
        <Box x={20} y={26} w={190} h={48} c={C.metric} t="경보 A" s="CPU 사용률 > 90%" />
        <Box x={20} y={94} w={190} h={48} c={C.metric} t="경보 B" s="NetworkIn 높음" />
        <Arw x1={210} y1={50} x2={286} y2={74} c={C.metric} m="ahM" />
        <Arw x1={210} y1={118} x2={286} y2={94} c={C.metric} m="ahM" />
        <Box x={290} y={60} w={110} h={48} c={C.event} t="AND / OR" />
        <Arw x1={400} y1={84} x2={452} y2={84} c={C.alarm} m="ahR" />
        <Box x={456} y={60} w={160} h={48} c={C.alarm} t="복합 경보" s="둘 다 참일 때만 ALARM" />
        <Arw x1={616} y1={84} x2={664} y2={84} c={C.green} m="ahG" />
        <Box x={668} y={60} w={96} h={48} c={C.green} t="SNS" />
      </Dgm>

      <H3 c={C.alarm}>EC2 인스턴스 복구 (Instance Recovery)</H3>
      <Dgm vw={780} vh={118} cap="시스템 상태 검사 실패 → 경보 → 복구: 다른 호스트로 옮겨도 프라이빗/퍼블릭/탄력적 IP · 메타데이터 · 배치 그룹이 그대로 유지">
        <Box x={16} y={34} w={230} h={56} c={C.metric} t="StatusCheckFailed_System" s="상태 검사: 인스턴스 · 시스템" fs={11.5} />
        <Arw x1={246} y1={62} x2={294} y2={62} c={C.alarm} m="ahR" />
        <Box x={298} y={34} w={130} h={56} c={C.alarm} t="경보" s="ALARM" />
        <Arw x1={428} y1={62} x2={476} y2={62} c={C.green} m="ahG" t="복구 작업" />
        <Box x={480} y={34} w={284} h={56} c={C.green} t="EC2 복구 + SNS 알림" s="IP · 메타데이터 · 배치 그룹 유지" fs={12} />
      </Dgm>

      <H3 c={C.alarm}>알아둘 것 & 테스트 방법</H3>
      <Ul
        c={C.alarm}
        items={[
          <>경보는 <B>메트릭 필터가 만든 지표</B> 위에도 걸 수 있습니다 (로그 기반 경보의 정석 경로).</>,
          <>경보를 테스트하려고 실제 부하를 만들 필요가 없습니다 — <B>CLI로 경보 상태를 강제 설정</B>할 수 있습니다:</>,
        ]}
      />
      <Code>{`aws cloudwatch set-alarm-state \\
  --alarm-name "my-alarm" \\
  --state-value ALARM \\
  --state-reason "testing"`}</Code>

      <Tip>
        암기 3종: ① 상태는 <B c={C.orange}>OK / INSUFFICIENT_DATA / ALARM</B> 뿐. ② 대상은{" "}
        <B c={C.orange}>EC2 작업(중지·종료·재부팅·복구) / ASG / SNS</B>. ③ “여러 조건이 <B c={C.orange}>동시에</B> 만족될 때만
        알림(노이즈 감소)” → <B c={C.orange}>복합 경보</B>. 그리고 “하드웨어 장애 시 인스턴스를 자동으로 살리되 IP를 유지” →{" "}
        <B c={C.orange}>경보의 EC2 복구(Recover) 작업</B>.
      </Tip>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   SECTION 8 · CloudWatch Synthetics (249)
   ═════════════════════════════════════════════════════════════ */

function SSynthetics() {
  return (
    <div>
      <SecHead no="SECTION 249 · CLOUDWATCH" t="CloudWatch Synthetics (카나리)" sub="고객이 겪기 전에 스크립트가 먼저 우리 서비스를 '사용'해 본다" f={1} c={C.metric} />
      <Ul
        c={C.metric}
        items={[
          <><B>카나리(Canary)</B> = API·URL·웹사이트를 주기적으로 호출하며 <B>고객의 행동을 재현하는 구성 가능한 스크립트</B>.</>,
          <>고객이 문제를 겪기 <B>전에</B> 프로그램적으로 이슈를 재현·감지 → 엔드포인트 가용성·지연 시간 확인, 스크린샷으로 UI 확인까지.</>,
          <>스크립트는 <B>Node.js 또는 Python</B>으로 작성, 내부적으로 <B>헤드리스 Google Chrome 브라우저</B>에 접근.</>,
          <><B>1회 실행</B> 또는 <B>정기 스케줄</B>로 실행. CloudWatch 경보와 통합됩니다.</>,
        ]}
      />

      <Dgm vw={820} vh={272} minW={640} cap="대표 아키텍처 — 카나리가 장애를 감지하면 경보 → Lambda → Route53 DNS를 백업 인스턴스로 전환(장애 조치)">
        <Box x={20} y={28} w={190} h={64} c={C.metric} t="카나리 스크립트" s="Node.js / Python" s2="헤드리스 크롬" />
        <Arw x1={210} y1={60} x2={430} y2={60} c={C.metric} m="ahM" t="스케줄 실행 · API/URL 호출" />
        <Box x={434} y={28} w={170} h={64} c="#8FA0BC" t="주 EC2 인스턴스" s="모니터링 대상" />
        <Arw x1={110} y1={92} x2={110} y2={140} c={C.alarm} m="ahR" t="실패 감지" tx={162} ty={120} />
        <Box x={20} y={144} w={180} h={54} c={C.alarm} t="CloudWatch 경보" />
        <Arw x1={200} y1={171} x2={248} y2={171} c={C.alarm} m="ahR" />
        <Box x={252} y={144} w={140} h={54} c={C.trace} t="Lambda 함수" />
        <Arw x1={392} y1={171} x2={440} y2={171} c={C.trace} m="ahP" t="DNS 레코드 갱신" />
        <Box x={444} y={144} w={150} h={54} c={C.event} t="Route53" />
        <Arw x1={594} y1={171} x2={646} y2={171} c={C.green} m="ahG" />
        <Box x={650} y={144} w={150} h={54} c={C.green} t="백업 EC2" s="트래픽 전환" />
        <T x={410} y={244} fs={10.5} c="#7f8db0">사용자보다 먼저 발견하고, 사용자가 눈치채기 전에 우회시킨다</T>
      </Dgm>

      <H3 c={C.metric}>블루프린트 (제공되는 템플릿)</H3>
      <Tbl
        head={["블루프린트", "하는 일"]}
        rows={[
          [<B>Heartbeat Monitor</B>, "URL 로드, 스크린샷 저장, HTTP 아카이브(HAR) 수집"],
          [<B>API Canary</B>, "REST API의 읽기·쓰기 기본 기능 테스트"],
          [<B>Broken Link Checker</B>, "테스트한 URL 내부의 모든 링크가 살아있는지 검사"],
          [<B>Visual Monitoring</B>, "카나리가 찍은 스크린샷을 기준(베이스라인) 스크린샷과 비교"],
          [<B>Canary Recorder</B>, "CloudWatch Synthetics Recorder로 웹사이트 조작을 녹화 → 스크립트 자동 생성"],
          [<B>GUI Workflow Builder</B>, "로그인 폼 제출 등 웹페이지에서의 동작 흐름이 정상인지 확인"],
        ]}
      />

      <Tip>
        빈출도는 낮지만 나오면 한 줄 정답: “<B c={C.orange}>사용자가 겪기 전에</B> 웹사이트/API/UI 플로우 문제를 스크립트로{" "}
        <B c={C.orange}>주기적으로 재현·감지</B>하고 싶다” → CloudWatch Synthetics 카나리. “화면이 달라졌는지 비교” → Visual
        Monitoring, “조작을 녹화해 스크립트 생성” → Canary Recorder.
      </Tip>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   SECTION 9 · Amazon EventBridge (250 · 252)
   ═════════════════════════════════════════════════════════════ */

function SEventBridge() {
  return (
    <div>
      <SecHead no="SECTION 250 · 252 · EVENTBRIDGE" t="Amazon EventBridge" sub="구 CloudWatch Events — AWS의 이벤트 중추: 스케줄 · 반응 · 통합" f={3} c={C.event} />
      <P>
        EventBridge는 두 가지 방식으로 씁니다. ① <B>스케줄</B>: 크론(cron)처럼 정해진 시각·간격에 이벤트 발생, ②{" "}
        <B>이벤트 패턴</B>: 서비스에서 일어나는 일에 반응하는 규칙 (예: IAM 루트 사용자 로그인 → SNS로 알림).
      </P>
      <Code>{`# 스케줄 표현식 예시
rate(1 hour)              # 1시간마다
cron(0 8 * * ? *)         # 매일 08:00 UTC
cron(0/15 * ? * MON-FRI *) # 평일 15분마다`}</Code>

      <Dgm vw={860} vh={344} minW={680} cap="소스(스케줄·AWS 서비스·SaaS 파트너·커스텀 앱) → 이벤트 버스 → 규칙(필터·변환) → 다양한 대상. 이벤트는 JSON 문서로 전달됩니다.">
        <Grp x={12} y={16} w={200} h={306} c="#5A6B8C" t="소스" />
        <Box x={26} y={42} w={172} h={50} c={C.event} t="스케줄 (cron/rate)" fs={11.5} />
        <Box x={26} y={104} w={172} h={62} c={C.event} t="AWS 서비스 이벤트" s="EC2 상태 변경 · S3 업로드" s2="· CodeBuild 실패 · 로그인 …" fs={11} />
        <Box x={26} y={178} w={172} h={50} c={C.event} t="SaaS 파트너" s="Zendesk · Datadog …" fs={11.5} />
        <Box x={26} y={240} w={172} h={50} c={C.event} t="커스텀 앱" s="PutEvents API" fs={11.5} />

        <Arw x1={212} y1={168} x2={258} y2={168} c={C.event} m="ahE" />
        <Grp x={262} y={60} w={190} h={230} c={C.event} t="이벤트 버스" />
        <Box x={276} y={88} w={162} h={44} c={C.event} t="default" s="AWS 서비스 이벤트" fs={11} />
        <Box x={276} y={142} w={162} h={44} c={C.event} t="partner" s="SaaS 파트너 이벤트" fs={11} />
        <Box x={276} y={196} w={162} h={44} c={C.event} t="custom" s="내 애플리케이션 이벤트" fs={11} />
        <T x={357} y={266} fs={9.5}>리소스 기반 정책 → 교차 계정 허용</T>

        <Arw x1={452} y1={168} x2={498} y2={168} c={C.event} m="ahE" />
        <Box x={502} y={138} w={140} h={60} c={C.orange} t="규칙 (Rule)" s="JSON 패턴 필터" s2="+ 입력 변환" fs={12} />
        <Arw x1={642} y1={150} x2={688} y2={70} c={C.orange} m="ahO" />
        <Arw x1={642} y1={168} x2={688} y2={168} c={C.orange} m="ahO" />
        <Arw x1={642} y1={186} x2={688} y2={266} c={C.orange} m="ahO" />
        <Box x={692} y={44} w={156} h={52} c={C.trace} t="컴퓨팅" s="Lambda · ECS Task · Batch" fs={11} />
        <Box x={692} y={142} w={156} h={52} c={C.log} t="통합/메시징" s="SQS · SNS · Kinesis" fs={11} />
        <Box x={692} y={240} w={156} h={52} c={C.audit} t="오케스트레이션 등" s="Step Functions · CodePipeline" fs={10.5} />
        <T x={430} y={332} fs={10.5} c="#7f8db0" w={600}>그 밖의 대상: CodeBuild · SSM · EC2 작업(시작/중지) 등 — “거의 모든 것”에 연결</T>
      </Dgm>

      <H3 c={C.event}>이벤트는 JSON 문서</H3>
      <Code>{`{
  "source": "aws.ec2",
  "detail-type": "EC2 Instance State-change Notification",
  "detail": { "instance-id": "i-0abcd1234", "state": "terminated" },
  "time": "2026-07-13T09:00:00Z", "region": "ap-northeast-1"
}`}</Code>

      <H3 c={C.event}>알아둬야 할 부가 기능</H3>
      <Ul
        c={C.event}
        items={[
          <><B>이벤트 버스 3종</B>: default(AWS 서비스) · partner(SaaS) · custom(내 앱). <B>리소스 기반 정책</B>으로 다른 계정·리전의 접근을 허용/거부합니다.</>,
          <><B>아카이브 & 리플레이</B>: 버스로 들어온 이벤트를 (전부 또는 필터링해) 보관하고, 무기한 또는 기간을 정해 저장 → 나중에 <B>다시 재생(재처리)</B> 가능. 버그 수정 후 재처리 시나리오의 정답.</>,
          <><B>스키마 레지스트리</B>: 버스의 이벤트를 분석해 <B>스키마를 추론</B>, 스키마 버전 관리, 앱에서 쓸 <B>코드 바인딩을 생성</B> — “이벤트 구조를 미리 알고 코딩”할 수 있게 해 줍니다.</>,
          <>샌드박스: 규칙을 만들기 전에 샘플 이벤트로 <B>패턴을 테스트</B>할 수 있습니다.</>,
        ]}
      />

      <H3 c={C.event}>다중 계정 이벤트 통합 (강의 252)</H3>
      <Dgm vw={780} vh={206} cap="여러 계정의 이벤트를 중앙 계정의 이벤트 버스로 모으는 패턴 — 중앙 버스의 리소스 기반 정책이 각 계정(또는 조직 전체)을 허용해야 합니다">
        {["계정 A", "계정 B", "계정 C"].map((a, i) => (
          <g key={a}>
            <Grp x={20} y={20 + i * 60} w={200} h={50} c="#5A6B8C" t={a} />
            <Box x={34} y={32 + i * 60} w={172} h={28} c={C.event} t="규칙 → 중앙 버스로 전송" fs={10} />
            <Arw x1={220} y1={45 + i * 60} x2={330} y2={102} c={C.event} m="ahE" />
          </g>
        ))}
        <Grp x={334} y={44} w={420} h={120} c={C.orange} t="중앙 계정" />
        <Box x={352} y={72} w={180} h={64} c={C.event} t="중앙 이벤트 버스" s="리소스 기반 정책으로" s2="계정/조직(OU) 허용" fs={11.5} />
        <Arw x1={532} y1={104} x2={576} y2={104} c={C.orange} m="ahO" />
        <Box x={580} y={72} w={156} h={64} c={C.orange} t="규칙 → 대상" s="모니터링 · 보안 감사" fs={11.5} />
      </Dgm>

      <Tip>
        키워드 매핑 — “<B c={C.orange}>매일/매시간 Lambda 실행</B>” → EventBridge 스케줄(cron). “<B c={C.orange}>루트 계정
        로그인·인스턴스 종료 같은 사건에 반응</B>” → 이벤트 패턴 규칙. “<B c={C.orange}>다른 계정에서 이벤트 수신</B>” →
        이벤트 버스의 <B c={C.orange}>리소스 기반 정책</B>. “<B c={C.orange}>지난 이벤트를 다시 처리</B>” → 아카이브 & 리플레이.
        “<B c={C.orange}>이벤트 JSON 구조로 코드 생성</B>” → 스키마 레지스트리.
      </Tip>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   SECTION 10 · X-Ray 개요 (253)
   ═════════════════════════════════════════════════════════════ */

function SXray() {
  return (
    <div>
      <SecHead no="SECTION 253 · X-RAY" t="AWS X-Ray 개요" sub="분산 시스템의 요청을 끝까지 따라가는 '시각적' 트레이싱" f={4} c={C.trace} />
      <P>
        기존 디버깅은 로컬에서 테스트하고, 여기저기 로그를 심고, 프로덕션에 재배포하는 식이었습니다. 하지만 마이크로서비스에서는
        로그 형식이 서비스마다 다르고, 로그 분석만으로는 <B>전체 그림</B>이 안 보입니다. <B c={C.trace}>X-Ray</B>는 요청이
        아키텍처를 통과하는 전 과정을 추적해 <B>시각적으로(서비스 맵)</B> 분석하게 해 줍니다.
      </P>

      <H3 c={C.trace}>X-Ray로 얻는 것</H3>
      <Ul
        c={C.trace}
        items={[
          <>성능 <B>병목 지점</B> 파악 · 마이크로서비스 간 <B>종속성 그래프</B> 이해</>,
          <>어떤 <B>서비스에서 문제/오류</B>가 나는지 정확히 짚기 · 특정 <B>요청 단위</B>의 동작 추적</>,
          <>에러와 예외 찾기 · <B>SLA(시간 목표) 충족 여부</B> 확인 · 어떤 사용자가 영향을 받는지 파악</>,
        ]}
      />

      <H3 c={C.trace}>호환성</H3>
      <div className="my-2">
        <Chip c={C.trace}>AWS Lambda</Chip>
        <Chip c={C.trace}>Elastic Beanstalk</Chip>
        <Chip c={C.trace}>ECS</Chip>
        <Chip c={C.trace}>ELB</Chip>
        <Chip c={C.trace}>API Gateway</Chip>
        <Chip c={C.trace}>EC2 인스턴스</Chip>
        <Chip c={C.trace}>온프레미스 서버</Chip>
      </div>

      <Dgm vw={840} vh={314} minW={660} cap="각 구간의 세그먼트가 X-Ray 데몬(UDP 2000)으로 모이고, 데몬이 배치로 X-Ray API에 전송 → 콘솔의 서비스 맵으로 시각화">
        <Box x={16} y={40} w={110} h={52} c="#8FA0BC" t="클라이언트" />
        <Arw x1={126} y1={66} x2={168} y2={66} c="#8FA0BC" />
        <Box x={172} y={40} w={140} h={52} c={C.event} t="API Gateway" />
        <Arw x1={312} y1={66} x2={354} y2={66} c="#8FA0BC" />
        <Box x={358} y={40} w={130} h={52} c={C.trace} t="Lambda" s="SDK 계측" />
        <Arw x1={488} y1={66} x2={530} y2={66} c="#8FA0BC" />
        <Box x={534} y={40} w={150} h={72} c={C.metric} t="EC2 (앱)" s="X-Ray SDK +" s2="X-Ray 데몬 실행" />
        <Arw x1={684} y1={66} x2={716} y2={66} c="#8FA0BC" />
        <Box x={720} y={40} w={106} h={52} c={C.audit} t="DynamoDB" fs={11.5} />
        <Arw x1={242} y1={92} x2={380} y2={186} c={C.trace} m="ahP" dash />
        <Arw x1={423} y1={92} x2={410} y2={186} c={C.trace} m="ahP" dash />
        <Arw x1={609} y1={112} x2={450} y2={190} c={C.trace} m="ahP" dash t="세그먼트 (UDP 2000)" tx={560} ty={160} />
        <Box x={300} y={190} w={240} h={54} c={C.trace} t="X-Ray 데몬 / 통합" s="배치로 모아 X-Ray API에 전송" />
        <Arw x1={420} y1={244} x2={420} y2={268} c={C.trace} m="ahP" />
        <Box x={260} y={272} w={320} h={36} c={C.trace} t="X-Ray 콘솔 — 서비스 맵 · 트레이스 시각화" fs={11.5} />
      </Dgm>

      <H3 c={C.trace}>트레이싱이 되게 하려면 (2가지 필수)</H3>
      <div className="my-3 grid gap-3 md:grid-cols-2">
        <Card c={C.trace} title="① 코드 계측 (Instrumentation)">
          애플리케이션 코드에 <B>X-Ray SDK</B>를 적용해야 합니다 — Java · Python · Go · Node.js · .NET 지원. SDK가 AWS SDK
          호출·HTTP 호출·DB 쿼리·SQS 등을 자동 캡처하도록 코드를 약간만 수정하면 됩니다.
        </Card>
        <Card c={C.trace} title="② X-Ray 데몬 or 서비스 통합">
          EC2·온프레미스는 <B>X-Ray 데몬</B>(저수준 UDP 인터셉터, Linux/Windows/Mac)을 설치·실행. Lambda 등 통합이 내장된
          서비스는 데몬을 대신 실행해 줍니다. 각 앱·서비스에는 <B>X-Ray에 쓸 IAM 권한</B>이 반드시 필요합니다.
        </Card>
      </div>

      <H3 c={C.alarm}>트러블슈팅 — “X-Ray에 트레이스가 안 보여요” (시험 최다 빈출)</H3>
      <div className="my-3 grid gap-3 md:grid-cols-2">
        <Card c={C.metric} title="EC2에서 안 보일 때">
          ① 인스턴스에 올바른 <B>IAM 역할</B>이 있는지 확인 → ② 인스턴스에서 <B>X-Ray 데몬이 실행 중</B>인지 확인. (둘 중 하나라도
          없으면 세그먼트가 전송되지 않습니다.)
        </Card>
        <Card c={C.trace} title="Lambda에서 안 보일 때">
          ① 실행 역할에 <B>IAM 정책(AWSXRayDaemonWriteAccess)</B>이 있는지 → ② 함수에 <B>Active Tracing(활성 추적)</B>이 켜져
          있는지 → ③ 코드에 <B>X-Ray SDK를 임포트·계측</B>했는지.
        </Card>
      </div>

      <Tip>
        “트레이스가 안 나온다”류 문제의 정답 후보는 항상 <B c={C.orange}>IAM 권한 → 데몬 실행 여부 → SDK 계측 → (Lambda라면)
        Active Tracing</B> 순서입니다. 코드가 아니라 <B c={C.orange}>권한/데몬</B>이 정답인 경우가 압도적으로 많습니다.
      </Tip>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   SECTION 11 · X-Ray 계측 · 개념 (255)
   ═════════════════════════════════════════════════════════════ */

function SXray2() {
  return (
    <div>
      <SecHead no="SECTION 255 · X-RAY" t="X-Ray 계측과 핵심 개념" sub="세그먼트 · 서브세그먼트 · 트레이스 · 주석 vs 메타데이터" f={4} c={C.trace} />
      <P>
        <B>계측(instrumentation)</B>이란 제품의 성능을 측정하고 오류를 진단할 수 있도록 <B>코드에 측정 장치를 심는 것</B>입니다.
        X-Ray SDK를 임포트하고 몇 줄만 추가하면 됩니다 (Node.js/Express 예):
      </P>
      <Code>{`const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk')); // AWS SDK 호출 캡처

app.use(AWSXRay.express.openSegment('MyApp'));  // 요청 시작
app.get('/', (req, res) => res.send('hello'));
app.use(AWSXRay.express.closeSegment());        // 요청 종료`}</Code>
      <P>
        SDK 기본 기능만으로도 충분하지만, <B>샘플링 규칙 수정, 주석/메타데이터 추가, 서브세그먼트 수동 생성</B> 등으로 더 깊이
        커스터마이즈할 수 있습니다.
      </P>

      <H3 c={C.trace}>핵심 용어 — 트레이스의 해부도</H3>
      <Ul
        c={C.trace}
        items={[
          <><B>세그먼트(Segment)</B>: 각 애플리케이션/서비스가 보내는 단위 기록.</>,
          <><B>서브세그먼트(Subsegment)</B>: 세그먼트 안의 더 세밀한 구간 (예: DynamoDB 호출, 외부 HTTP 호출).</>,
          <><B>트레이스(Trace)</B>: 세그먼트들이 모여 만들어지는 <B>요청의 end-to-end 기록</B>.</>,
          <><B>샘플링(Sampling)</B>: 비용 절감을 위해 요청의 일부만 기록하는 것 (다음 페이지).</>,
        ]}
      />

      <Dgm vw={780} vh={236} cap="하나의 트레이스 = 요청 전체. 그 안에 서비스별 세그먼트, 세그먼트 안에 세부 작업의 서브세그먼트가 계층으로 쌓입니다.">
        <T x={20} y={48} a="start" fs={11} c={C.trace} w={700} mono>TRACE</T>
        <rect x={130} y={30} width={620} height={28} rx={7} fill={C.trace + "18"} stroke={C.trace} strokeWidth="1.6" />
        <T x={440} y={48} fs={11} c={C.text} w={700}>요청 end-to-end (트레이스 ID 하나)</T>
        <T x={20} y={92} a="start" fs={11} c={C.event} w={700} mono>SEGMENT</T>
        <rect x={130} y={74} width={260} height={28} rx={7} fill={C.event + "14"} stroke={C.event} />
        <T x={260} y={92} fs={10.5} c={C.text}>API Gateway</T>
        <rect x={370} y={112} width={380} height={28} rx={7} fill={C.event + "14"} stroke={C.event} />
        <T x={560} y={130} fs={10.5} c={C.text}>Lambda 함수 (세그먼트)</T>
        <T x={20} y={168} a="start" fs={11} c={C.log} w={700} mono>SUBSEG</T>
        <rect x={400} y={150} width={150} height={26} rx={6} fill={C.log + "14"} stroke={C.log} />
        <T x={475} y={167} fs={10} c={C.text}>DynamoDB 호출</T>
        <rect x={570} y={150} width={150} height={26} rx={6} fill={C.log + "14"} stroke={C.log} />
        <T x={645} y={167} fs={10} c={C.text}>외부 HTTP 호출</T>
        <T x={390} y={214} fs={10.5} c="#7f8db0">가로축 = 시간 → 어느 구간이 오래 걸렸는지 폭으로 바로 보입니다</T>
      </Dgm>

      <H3 c={C.trace}>주석(Annotations) vs 메타데이터(Metadata) — 최빈출!</H3>
      <div className="my-3 grid gap-3 md:grid-cols-2">
        <Card c={C.orange} title="주석 (Annotations)">
          Key-Value 쌍이며 <B c={C.orange}>인덱싱됩니다</B> → 콘솔에서 <B>검색·필터·그룹 표현식</B>에 사용 가능. 예:{" "}
          <K>user_id</K>, <K>game_id</K>, 주문 상태처럼 <B>나중에 찾아볼 값</B>은 주석으로.
        </Card>
        <Card c="#8FA0BC" title="메타데이터 (Metadata)">
          Key-Value 쌍이지만 <B>인덱싱되지 않아 검색에 쓸 수 없습니다</B>. 트레이스에 그냥 “함께 저장해 두고 싶은” 부가
          정보(디버깅용 상세 데이터 등)에 사용.
        </Card>
      </div>

      <H3 c={C.trace}>X-Ray 데몬/에이전트의 교차 계정 전송</H3>
      <P>
        데몬은 <B>다른 계정으로 트레이스를 전송하도록 설정</B>할 수 있습니다(올바른 IAM 권한 필요). 여러 계정의 애플리케이션을{" "}
        <B c={C.trace}>중앙 계정 하나</B>에서 모아 보는 중앙 집중식 트레이싱이 가능합니다.
      </P>

      <Tip>
        한 줄 암기: <B c={C.orange}>“검색/필터가 필요하면 Annotations(인덱싱 O), 아니면 Metadata(인덱싱 X)”</B>. “특정 사용자
        ID로 트레이스를 필터링하고 싶다” → 주석. 이 구분은 DVA에서 거의 반드시 출제됩니다.
      </Tip>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   SECTION 12 · X-Ray 샘플링 & API (256–257)
   ═════════════════════════════════════════════════════════════ */

function SXray3() {
  return (
    <div>
      <SecHead no="SECTION 256–257 · X-RAY" t="X-Ray 샘플링 규칙 & API" sub="얼마나 기록할지(비용) · 데몬과 콘솔이 쓰는 API" f={3} c={C.trace} />
      <P>
        샘플링 규칙으로 <B>기록할 요청의 양</B>을 제어해 비용을 아낍니다. <B c={C.trace}>기본 규칙</B>: 매초{" "}
        <B>첫 번째 요청은 무조건 기록(reservoir = 1)</B>하고, <B>나머지의 5%(rate)</B>를 추가로 샘플링합니다.
      </P>

      <Dgm vw={780} vh={190} cap="예: 초당 100 요청이면 기록되는 트레이스 ≈ 1(reservoir) + 99 × 5%(rate) ≈ 6개/초">
        <T x={20} y={40} a="start" fs={11.5} c={C.text} w={700}>1초 동안 들어온 요청들</T>
        {Array.from({ length: 20 }).map((_, i) => {
          const first = i === 0;
          const sampled = i === 7;
          const fill = first ? C.orange : sampled ? C.log : "#3A4A6E";
          return <rect key={i} x={20 + i * 37} y={56} width={26} height={26} rx={6} fill={fill + (first || sampled ? "" : "")} stroke={first ? C.orange : sampled ? C.log : "#4A5A80"} fillOpacity={first || sampled ? 0.9 : 0.35} />;
        })}
        <T x={33} y={110} fs={9.5} c={C.orange}>reservoir</T>
        <T x={33} y={122} fs={9.5} c={C.orange}>초당 1개 보장</T>
        <T x={20 + 7 * 37 + 13} y={110} fs={9.5} c={C.log}>rate 5%</T>
        <T x={20 + 7 * 37 + 13} y={122} fs={9.5} c={C.log}>나머지 중 5%</T>
        <T x={390} y={158} fs={12} c={C.text} w={700}>초당 트레이스 수 ≈ reservoir + (초당 요청 − reservoir) × rate</T>
        <T x={390} y={178} fs={10.5} c="#7f8db0">reservoir = 최소 보장량 · rate = 초과분에 적용되는 비율</T>
      </Dgm>

      <Ul
        c={C.trace}
        items={[
          <><B>커스텀 샘플링 규칙</B>을 만들어 reservoir와 rate를 원하는 값으로 조정할 수 있습니다 — 예: reservoir 50, rate 10%. 더 많이(전부) 기록하거나 더 적게 기록하도록.</>,
          <><B c={C.trace}>규칙을 바꿔도 코드 수정·재배포가 필요 없습니다.</B> 데몬이 주기적으로 X-Ray 서비스에서 규칙을 가져와(<K>GetSamplingRules</K>) 적용하기 때문입니다.</>,
        ]}
      />

      <H3 c={C.trace}>X-Ray API — 쓰기(데몬이 사용)</H3>
      <Tbl
        head={["API", "역할"]}
        rows={[
          [<K>PutTraceSegments</K>, "세그먼트 문서를 X-Ray에 업로드"],
          [<K>PutTelemetryRecords</K>, "데몬 자체의 텔레메트리(수신/거부된 세그먼트 수, 백엔드 연결 오류 등) 전송"],
          [<K>GetSamplingRules</K>, "적용할 샘플링 규칙을 가져옴 (+ GetSamplingTargets · GetSamplingStatisticSummaries)"],
        ]}
      />
      <P>
        데몬에 필요한 IAM 관리형 정책: <B c={C.trace}><K>AWSXRayDaemonWriteAccess</K></B> (쓰기 + 샘플링 규칙 조회 권한 포함).
      </P>

      <H3 c={C.trace}>X-Ray API — 읽기(콘솔·조회가 사용)</H3>
      <Tbl
        head={["API", "역할"]}
        rows={[
          [<K>GetServiceGraph</K>, "콘솔의 서비스 맵(그래프) 데이터 — “시각화 그래프” 키워드와 매칭"],
          [<K>BatchGetTraces</K>, "트레이스 ID 목록으로 전체 트레이스(세그먼트 문서 포함) 조회"],
          [<K>GetTraceSummaries</K>, "지정 기간의 트레이스 ID와 주석(annotations) 요약 조회 — 전체가 아니라 요약!"],
          [<K>GetTraceGraph</K>, "특정 트레이스 ID들에 대한 서비스 그래프 조회"],
        ]}
      />

      <Tip>
        API 매칭 문제 대비: “<B c={C.orange}>세그먼트 업로드</B>” = PutTraceSegments · “<B c={C.orange}>데몬 상태 전송</B>” =
        PutTelemetryRecords · “<B c={C.orange}>콘솔 서비스 맵</B>” = GetServiceGraph · “<B c={C.orange}>트레이스 ID + 주석만
        가져오기</B>” = GetTraceSummaries · “<B c={C.orange}>ID로 전체 트레이스</B>” = BatchGetTraces. 그리고 “샘플링 변경에
        재배포 불필요”가 정답 지문으로 자주 나옵니다.
      </Tip>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   SECTION 13 · X-Ray 배포 환경: Beanstalk · ECS · ADOT (258–260)
   ═════════════════════════════════════════════════════════════ */

function SXray4() {
  return (
    <div>
      <SecHead no="SECTION 258–260 · X-RAY" t="Beanstalk · ECS에서의 X-Ray + ADOT" sub="환경별로 '데몬을 어떻게 띄우는가'가 포인트" f={2} c={C.trace} />

      <H3 c={C.trace}>Elastic Beanstalk에서 X-Ray (258)</H3>
      <Ul
        c={C.trace}
        items={[
          <>Beanstalk 플랫폼에는 X-Ray 데몬이 포함되어 있어 <B>설정으로 실행</B>만 하면 됩니다.</>,
          <>방법 ①: <B>콘솔</B>에서 환경 구성 → X-Ray 데몬 활성화. 방법 ②: <K>.ebextensions</K> 구성 파일:</>,
        ]}
      />
      <Code>{`# .ebextensions/xray-daemon.config
option_settings:
  aws:elasticbeanstalk:xray:
    XRayEnabled: true`}</Code>
      <Ul
        c={C.trace}
        items={[
          <>인스턴스 프로파일(IAM 역할)에 X-Ray 쓰기 권한이 있어야 하고, 애플리케이션 코드는 <B>X-Ray SDK로 계측</B>되어 있어야 합니다.</>,
          <><B c={C.alarm}>주의</B>: X-Ray 데몬은 <B>Multicontainer Docker(ECS 기반) 플랫폼에는 제공되지 않습니다</B> → 그 경우 ECS 방식으로 직접 구성.</>,
        ]}
      />

      <H3 c={C.trace}>ECS에서 X-Ray — 3가지 배포 패턴 (259)</H3>
      <Dgm vw={820} vh={300} minW={660} cap="①: EC2 인스턴스마다 데몬 컨테이너 1개 ②: 태스크마다 '사이드카' 컨테이너 ③: Fargate는 인스턴스 접근이 없으므로 사이드카 패턴만 가능">
        <Grp x={12} y={18} w={256} h={228} c={C.metric} t="① ECS on EC2 · 데몬 컨테이너" />
        <Grp x={26} y={44} w={228} h={188} c="#5A6B8C" t="EC2 인스턴스" />
        <Box x={40} y={72} w={96} h={44} c="#8FA0BC" t="앱 태스크" fs={10.5} />
        <Box x={146} y={72} w={96} h={44} c="#8FA0BC" t="앱 태스크" fs={10.5} />
        <Box x={40} y={128} w={202} h={44} c={C.trace} t="X-Ray 데몬 컨테이너" s="인스턴스당 1개" fs={10.5} />
        <Arw x1={88} y1={116} x2={110} y2={126} c={C.trace} m="ahP" />
        <Arw x1={194} y1={116} x2={172} y2={126} c={C.trace} m="ahP" />
        <T x={140} y={214} fs={9.5}>여러 태스크가 데몬 하나 공유</T>

        <Grp x={282} y={18} w={256} h={228} c={C.log} t="② ECS on EC2 · 사이드카" />
        <Grp x={296} y={44} w={228} h={188} c="#5A6B8C" t="EC2 인스턴스" />
        <Grp x={308} y={68} w={204} h={72} c={C.log} t="태스크 1" />
        <Box x={318} y={92} w={88} h={38} c="#8FA0BC" t="앱" fs={10.5} />
        <Box x={414} y={92} w={90} h={38} c={C.trace} t="X-Ray 사이드카" fs={9.5} />
        <Grp x={308} y={150} w={204} h={72} c={C.log} t="태스크 2" />
        <Box x={318} y={174} w={88} h={38} c="#8FA0BC" t="앱" fs={10.5} />
        <Box x={414} y={174} w={90} h={38} c={C.trace} t="X-Ray 사이드카" fs={9.5} />

        <Grp x={552} y={18} w={256} h={228} c={C.trace} t="③ Fargate · 사이드카만 가능" />
        <Grp x={566} y={44} w={228} h={188} c="#5A6B8C" t="Fargate 태스크" />
        <Box x={580} y={80} w={200} h={50} c="#8FA0BC" t="앱 컨테이너" fs={11} />
        <Box x={580} y={144} w={200} h={50} c={C.trace} t="X-Ray 데몬 사이드카" s="포트 2000/udp 매핑" fs={11} />
        <T x={680} y={216} fs={9.5}>인스턴스 제어 불가 → 태스크 안에 동봉</T>
      </Dgm>
      <P>
        태스크 정의에서 데몬 컨테이너의 <B>2000/udp 포트 매핑</B>과, 앱 컨테이너의 환경 변수{" "}
        <B c={C.trace}><K>AWS_XRAY_DAEMON_ADDRESS</K></B>(예: <K>xray-daemon:2000</K>)를 지정합니다. Fargate에서는 태스크
        역할(Task Role)에 X-Ray 쓰기 권한을 부여합니다.
      </P>
      <Code>{`{ "name": "AWS_XRAY_DAEMON_ADDRESS", "value": "xray-daemon:2000" }
// 데몬 컨테이너: portMappings → containerPort 2000, protocol "udp"`}</Code>

      <H3 c={C.trace}>AWS Distro for OpenTelemetry — ADOT (260)</H3>
      <Ul
        c={C.trace}
        items={[
          <><B>OpenTelemetry</B>의 AWS 지원 안전한 배포판 — 오픈소스 표준으로 <B>트레이스와 지표</B>를 수집합니다.</>,
          <>앱(자동 계측 에이전트로 <B>코드 변경 없이</B> 가능) 및 AWS 리소스에서 수집 → <B>X-Ray · CloudWatch · Amazon Managed Prometheus · 파트너 솔루션</B> 등 여러 백엔드로 전송.</>,
          <>지원 환경: EC2 · ECS · EKS · Fargate · Lambda · 온프레미스.</>,
        ]}
      />
      <Dgm vw={780} vh={186} cap="ADOT Collector가 가운데에서 수집·라우팅 — 표준화 + 다중 백엔드가 키워드">
        <Box x={16} y={36} w={190} h={54} c="#8FA0BC" t="애플리케이션" s="자동 계측 · SDK" />
        <Box x={16} y={104} w={190} h={46} c="#8FA0BC" t="AWS 리소스" fs={11.5} />
        <Arw x1={206} y1={63} x2={286} y2={86} c={C.trace} m="ahP" />
        <Arw x1={206} y1={127} x2={286} y2={102} c={C.trace} m="ahP" />
        <Box x={290} y={66} w={190} h={58} c={C.trace} t="ADOT Collector" s="트레이스 + 지표 수집" />
        <Arw x1={480} y1={80} x2={556} y2={46} c={C.trace} m="ahP" />
        <Arw x1={480} y1={95} x2={556} y2={95} c={C.metric} m="ahM" />
        <Arw x1={480} y1={110} x2={556} y2={148} c={C.green} m="ahG" />
        <Box x={560} y={26} w={204} h={38} c={C.trace} t="AWS X-Ray" fs={11.5} />
        <Box x={560} y={76} w={204} h={38} c={C.metric} t="CloudWatch · AMP(Prometheus)" fs={10.5} />
        <Box x={560} y={130} w={204} h={38} c={C.green} t="파트너 모니터링 솔루션" fs={10.5} />
      </Dgm>

      <Tip>
        “<B c={C.orange}>오픈소스 표준</B>으로 계측하고 싶다 / 트레이스를 <B c={C.orange}>여러 백엔드(X-Ray + 서드파티)</B>로
        보내고 싶다” → ADOT가 정답. Fargate 문제에서 “인스턴스에 데몬 설치”가 보기로 나오면 오답 —{" "}
        <B c={C.orange}>Fargate는 사이드카 패턴만</B> 가능합니다.
      </Tip>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   SECTION 14 · CloudTrail (261 · 263)
   ═════════════════════════════════════════════════════════════ */

function SCloudTrail() {
  return (
    <div>
      <SecHead no="SECTION 261 · 263 · CLOUDTRAIL" t="AWS CloudTrail" sub="계정 안에서 '누가, 언제, 무슨 API를' 호출했는지 — 거버넌스 · 컴플라이언스 · 감사" f={3} c={C.audit} />
      <Ul
        c={C.audit}
        items={[
          <><B c={C.audit}>기본으로 활성화</B>되어 있으며, 콘솔 · SDK · CLI · AWS 서비스가 일으킨 <B>모든 API 호출/이벤트의 기록</B>을 남깁니다.</>,
          <>로그를 <B>CloudWatch Logs 또는 S3</B>로 보낼 수 있습니다 (장기 보관은 S3).</>,
          <>트레일은 <B>모든 리전(기본, 권장)</B> 또는 단일 리전에 적용할 수 있습니다.</>,
          <><B c={C.audit}>“리소스가 갑자기 사라졌다? → CloudTrail부터 확인!”</B></>,
        ]}
      />

      <Dgm vw={800} vh={216} minW={640} cap="모든 주체의 API 호출이 CloudTrail에 쌓이고 → 검사(콘솔 90일 이벤트 히스토리) · CloudWatch Logs · S3(장기 보관, Athena 분석)로 흐릅니다">
        <Grp x={14} y={18} w={170} h={180} c="#5A6B8C" t="호출 주체" />
        {["콘솔 사용자", "SDK / CLI", "AWS 서비스"].map((s, i) => (
          <Box key={i} x={28} y={44 + i * 50} w={142} h={38} c="#8FA0BC" t={s} fs={11} />
        ))}
        <Arw x1={184} y1={108} x2={252} y2={108} c={C.audit} m="ahT" t="API 호출" />
        <Box x={256} y={76} w={200} h={64} c={C.audit} t="CloudTrail" s="누가 · 언제 · 무엇을" s2="(기본 활성화)" />
        <Arw x1={456} y1={92} x2={556} y2={48} c={C.audit} m="ahT" />
        <Arw x1={456} y1={108} x2={556} y2={112} c={C.log} m="ahB" />
        <Arw x1={456} y1={124} x2={556} y2={176} c={C.audit} m="ahT" />
        <Box x={560} y={26} w={220} h={40} c={C.audit} t="콘솔 이벤트 히스토리 (90일)" fs={10.5} />
        <Box x={560} y={92} w={220} h={40} c={C.log} t="CloudWatch Logs" fs={11} />
        <Box x={560} y={158} w={220} h={40} c={C.audit} t="S3 (장기 보관 → Athena 분석)" fs={10.5} />
      </Dgm>

      <H3 c={C.audit}>이벤트 3종류</H3>
      <div className="my-3 grid gap-3 md:grid-cols-3">
        <Card c={C.audit} title="관리 이벤트">
          리소스에 <B>수행되는 작업</B>(보안 구성, 라우팅 규칙, 로깅 설정 등). <B c={C.green}>기본으로 기록됨</B>. 읽기
          이벤트(Read)와 쓰기 이벤트(Write)를 분리해 볼 수 있습니다.
        </Card>
        <Card c={C.log} title="데이터 이벤트">
          <B c={C.alarm}>기본으로 기록되지 않음</B> (대용량이라). 예: <B>S3 객체 수준 활동</B>(GetObject · PutObject ·
          DeleteObject), <B>Lambda 함수 실행(Invoke)</B>.
        </Card>
        <Card c={C.event} title="Insights 이벤트">
          유료 옵션. 정상 관리 활동의 <B>기준선을 학습</B>한 뒤 <B>비정상 패턴</B>(리소스 과다 프로비저닝, 서비스 한도 도달,
          IAM 작업 버스트, 유지보수 누락 등)을 탐지. 결과는 콘솔·S3·<B>EventBridge 이벤트</B>로.
        </Card>
      </div>

      <H3 c={C.audit}>보존 (Retention)</H3>
      <Ul
        c={C.audit}
        items={[
          <>이벤트는 CloudTrail <B>이벤트 히스토리에 90일</B> 보관됩니다.</>,
          <>더 오래 보관하려면 <B>S3로 내보내고 Athena로 분석</B>하는 것이 정석 패턴.</>,
        ]}
      />

      <H3 c={C.event}>CloudTrail + EventBridge 통합 (263)</H3>
      <P>
        <B>모든 API 호출은 CloudTrail에 기록</B>되므로, 이를 EventBridge와 연결하면 <B>어떤 API 호출에도 반응</B>할 수 있습니다.
        예: 누가 DynamoDB 테이블을 삭제하면 즉시 SNS로 알림.
      </P>
      <Dgm vw={800} vh={128} minW={640} cap="사용자의 API 호출 → CloudTrail 기록 → EventBridge 이벤트 → SNS 알림 (어떤 API든 이 패턴으로 감시 가능)">
        <Box x={14} y={38} w={120} h={52} c="#8FA0BC" t="사용자" />
        <Arw x1={134} y1={64} x2={196} y2={64} c="#8FA0BC" t="DeleteTable" />
        <Box x={200} y={38} w={130} h={52} c={C.metric} t="DynamoDB" fs={11.5} />
        <Arw x1={330} y1={64} x2={392} y2={64} c={C.audit} m="ahT" t="API 호출 기록" />
        <Box x={396} y={38} w={130} h={52} c={C.audit} t="CloudTrail" />
        <Arw x1={526} y1={64} x2={576} y2={64} c={C.event} m="ahE" t="이벤트" />
        <Box x={580} y={38} w={110} h={52} c={C.event} t="EventBridge" fs={11.5} />
        <Arw x1={690} y1={64} x2={716} y2={64} c={C.green} m="ahG" />
        <Box x={720} y={38} w={66} h={52} c={C.green} t="SNS" fs={11.5} />
      </Dgm>

      <Tip>
        키워드 매핑 — “<B c={C.orange}>누가 리소스를 삭제/변경했나</B>” → CloudTrail. “<B c={C.orange}>S3 객체 수준
        (GetObject 등) 감사</B>” → 데이터 이벤트(기본 꺼져 있음, 직접 활성화). “<B c={C.orange}>비정상적인 계정 활동 자동
        탐지</B>” → CloudTrail Insights. “<B c={C.orange}>특정 API 호출 시 알림</B>” → CloudTrail + EventBridge(+SNS). 90일
        넘게 보관 → S3 + Athena.
      </Tip>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   SECTION 15 · 3종 비교 & 총정리 (264–265)
   ═════════════════════════════════════════════════════════════ */

function SCompare() {
  return (
    <div>
      <SecHead no="SECTION 264–265 · 정리" t="CloudTrail vs CloudWatch vs X-Ray + 총정리" sub="시험 전 마지막 점검 — 이 페이지만 다시 봐도 된다" f={4} c={C.orange} />

      <div className="my-4 grid gap-3 md:grid-cols-3">
        <Card c={C.audit} title="CloudTrail — 감사">
          <B>“누가 무엇을 했나?”</B> 콘솔·SDK·CLI·서비스의 <B>API 호출 감사</B>. 리소스·사용자에 대한 무단 호출·변경 원인
          추적. 기본 활성화, 90일 히스토리.
        </Card>
        <Card c={C.metric} title="CloudWatch — 상태">
          <B>“지금 어떻게 동작 중인가?”</B> <B>지표</B>로 성능 추적(+대시보드), <B>로그</B>로 애플리케이션 로그 저장·분석,{" "}
          <B>경보</B>로 임계치 초과 시 알림·조치.
        </Card>
        <Card c={C.trace} title="X-Ray — 추적">
          <B>“요청이 어디서 느려지고 실패했나?”</B> 자동화된 트레이스 분석, 마이크로서비스 <B>분산 트레이싱</B>, 요청
          단위의 지연·오류 시각화.
        </Card>
      </div>

      <H3 c={C.orange}>시나리오 → 정답 서비스 빠른 매핑</H3>
      <Tbl
        head={["시험 시나리오", "정답", ""]}
        rows={[
          ["“누가 이 테이블을 삭제했지?”", <B c={C.audit}>CloudTrail</B>, "API 감사"],
          ["“어느 마이크로서비스가 병목인지 시각적으로 보고 싶다”", <B c={C.trace}>X-Ray (서비스 맵)</B>, "분산 트레이싱"],
          ["“CPU가 90% 넘으면 알림 + 자동 조치”", <B c={C.alarm}>CloudWatch 경보</B>, "지표 기반"],
          ["“로그에서 ERROR 횟수를 세서 경보”", <B c={C.log}>메트릭 필터 → 지표 → 경보</B>, "소급 적용 ✕"],
          ["“매일 밤 Lambda를 실행”", <B c={C.event}>EventBridge 스케줄 (cron)</B>, ""],
          ["“로그를 실시간으로 Kinesis/Lambda에 전달”", <B c={C.log}>Logs 구독 필터</B>, "Export는 배치"],
          ["“사용자가 겪기 전에 웹사이트 플로우 감시”", <B c={C.metric}>Synthetics 카나리</B>, ""],
          ["“EC2 메모리 사용률 모니터링”", <B c={C.metric}>통합 에이전트 / 커스텀 지표</B>, "기본 지표에 없음"],
          ["“특정 API 호출이 일어나면 알림”", <B c={C.audit}>CloudTrail + EventBridge</B>, ""],
          ["“트레이스에 태그를 달아 검색하고 싶다”", <B c={C.trace}>X-Ray 주석(Annotations)</B>, "메타데이터는 검색 ✕"],
        ]}
      />

      <H3 c={C.orange}>최종 암기 카드 — 숫자와 한 줄들</H3>
      <Ul
        c={C.orange}
        items={[
          <>EC2 지표: 기본 <B>5분</B> / 상세 모니터링 <B>1분</B>(유료) — 메모리는 없음.</>,
          <>커스텀 지표: 표준 <B>1분</B> / 고해상도 <B>1·5·10·30초</B> — 타임스탬프 <B>과거 2주 ~ 미래 2시간</B>.</>,
          <>지표 디멘션 최대 <B>30개</B>, 메트릭 필터 디멘션 최대 <B>3개</B>, 필터는 <B>소급 적용 ✕</B>.</>,
          <>로그 보존 <B>1일~10년 또는 무제한</B> · S3 내보내기 최대 <B>12시간</B>(배치) · 실시간은 <B>구독</B>(KDS · Firehose · Lambda).</>,
          <>경보 상태 <B>OK / INSUFFICIENT_DATA / ALARM</B> · 대상 <B>EC2 작업 / ASG / SNS</B> · 복합 경보 = AND/OR로 노이즈 감소.</>,
          <>경보 테스트: <K>aws cloudwatch set-alarm-state</K>.</>,
          <>EventBridge: 스케줄 + 이벤트 패턴 · 버스 3종(default/partner/custom) · 교차 계정 = <B>리소스 기반 정책</B> · 아카이브&리플레이 · 스키마 레지스트리.</>,
          <>X-Ray 샘플링 기본: <B>초당 1개 + 5%</B> (reservoir/rate) — 변경에 재배포 불필요.</>,
          <>X-Ray: <B>주석 = 인덱싱·검색 O / 메타데이터 = ✕</B> · 데몬 UDP <B>2000</B> · Fargate는 <B>사이드카만</B>.</>,
          <>X-Ray 활성화 = <B>SDK 계측 + 데몬(또는 통합) + IAM 권한</B> (Lambda는 + Active Tracing).</>,
          <>Beanstalk: <K>.ebextensions/xray-daemon.config</K> → <K>XRayEnabled: true</K>.</>,
          <>CloudTrail: 관리 이벤트 <B>기본 O</B> / 데이터 이벤트(S3 객체·Lambda Invoke) <B>기본 ✕</B> / Insights = 비정상 탐지 · 히스토리 <B>90일</B> → 이후 S3+Athena.</>,
        ]}
      />

      <Tip title="마지막 한마디">
        이 섹션에서 시험이 가장 사랑하는 문제 유형은 <B c={C.orange}>① X-Ray가 “안 보일 때” 체크리스트, ② 주석 vs 메타데이터,
        ③ 로그 실시간(구독) vs 배치(내보내기), ④ 메트릭 필터 → 경보 → SNS 파이프라인, ⑤ 3종 서비스 용도 구분</B>입니다. 이 다섯
        가지만 완벽하면 모니터링 문항 대부분은 확보됩니다. 화이팅! 🎯
      </Tip>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   앱 셸 — 내비게이션 + 레이아웃
   ═════════════════════════════════════════════════════════════ */

const SECTIONS = {
  overview: SOverview,
  metrics: SMetrics,
  custom: SCustom,
  logs: SLogs,
  agent: SAgent,
  filters: SFilters,
  alarms: SAlarms,
  synthetics: SSynthetics,
  eventbridge: SEventBridge,
  xray: SXray,
  xray2: SXray2,
  xray3: SXray3,
  xray4: SXray4,
  cloudtrail: SCloudTrail,
  compare: SCompare,
};

export default function App() {
  const [cur, setCur] = useState("overview");
  const flat = NAV.flatMap((g) => g.items);
  const idx = flat.findIndex((i) => i.id === cur);
  const prev = flat[idx - 1];
  const next = flat[idx + 1];
  const Cur = SECTIONS[cur] || SOverview;
  const go = (id) => {
    setCur(id);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: C.bg,
        color: C.text,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans KR", "Apple SD Gothic Neo", sans-serif',
      }}
    >
      {/* 헤더 */}
      <header style={{ borderBottom: `1px solid ${C.line}`, background: "linear-gradient(180deg, #111C33, #0E1526)" }}>
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="text-[10.5px] font-bold tracking-widest" style={{ color: C.orange, fontFamily: MONO }}>
            AWS CERTIFIED DEVELOPER – ASSOCIATE (DVA-C02)
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">모니터링 & 감사 완전 정리</h1>
            <svg width="132" height="30" viewBox="0 0 132 30" aria-hidden="true">
              <polyline
                points="0,15 22,15 30,15 36,5 44,25 52,8 58,15 84,15 92,15 98,7 104,22 110,15 132,15"
                fill="none"
                stroke={C.orange}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="mt-1.5 text-[13px]" style={{ color: C.mut }}>
            CloudWatch · EventBridge · X-Ray · CloudTrail — 강의 237–265의 모든 개념 (실습 제외) · 빈출도 표시
          </p>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-4 pb-20 pt-6">
        {/* 데스크톱 사이드바 */}
        <nav className="sticky top-4 hidden w-60 shrink-0 self-start md:block" style={{ maxHeight: "92vh", overflowY: "auto" }}>
          {NAV.map((g) => (
            <div key={g.g} className="mb-4">
              <div className="mb-1.5 px-2 text-[10px] font-bold tracking-widest" style={{ color: g.c, fontFamily: MONO }}>
                {g.g}
              </div>
              {g.items.map((it) => {
                const on = cur === it.id;
                return (
                  <button
                    key={it.id}
                    onClick={() => go(it.id)}
                    className="mb-0.5 flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-[13px]"
                    style={{
                      background: on ? "#1E2A48" : "transparent",
                      color: on ? C.text : "#9AA7BF",
                      border: on ? `1px solid ${C.line}` : "1px solid transparent",
                      fontWeight: on ? 700 : 500,
                      cursor: "pointer",
                    }}
                  >
                    <span className="min-w-0 truncate">{it.t}</span>
                    {it.f ? (
                      <span className="flex shrink-0 items-end" style={{ gap: 1.5 }}>
                        {[1, 2, 3, 4].map((i) => (
                          <span key={i} style={{ width: 2.5, height: 2 + i * 2, borderRadius: 1, background: i <= it.f ? FREQ[it.f].c : "#33405C" }} />
                        ))}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* 메인 */}
        <main className="min-w-0 flex-1">
          {/* 모바일 칩 내비 */}
          <div className="-mx-4 mb-4 overflow-x-auto px-4 md:hidden">
            <div className="flex gap-1.5" style={{ width: "max-content" }}>
              {flat.map((it) => {
                const on = cur === it.id;
                return (
                  <button
                    key={it.id}
                    onClick={() => go(it.id)}
                    className="rounded-full px-3 py-1.5 text-[12px] font-semibold"
                    style={{
                      background: on ? C.orange : "#1B2540",
                      color: on ? "#1A1206" : "#9AA7BF",
                      border: `1px solid ${on ? C.orange : C.line}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {it.t}
                  </button>
                );
              })}
            </div>
          </div>

          <Cur />

          {/* 이전/다음 */}
          <div className="mt-10 flex items-stretch justify-between gap-3 border-t pt-5" style={{ borderColor: C.line }}>
            {prev ? (
              <button
                onClick={() => go(prev.id)}
                className="rounded-xl px-4 py-3 text-left text-[13px]"
                style={{ background: C.panel, border: `1px solid ${C.line}`, color: C.body, cursor: "pointer" }}
              >
                <span className="block text-[10.5px]" style={{ color: C.mut }}>← 이전</span>
                <span className="font-bold" style={{ color: C.text }}>{prev.t}</span>
              </button>
            ) : (
              <span />
            )}
            {next ? (
              <button
                onClick={() => go(next.id)}
                className="rounded-xl px-4 py-3 text-right text-[13px]"
                style={{ background: C.panel, border: `1px solid ${C.orange}55`, color: C.body, cursor: "pointer" }}
              >
                <span className="block text-[10.5px]" style={{ color: C.orange }}>다음 →</span>
                <span className="font-bold" style={{ color: C.text }}>{next.t}</span>
              </button>
            ) : (
              <span />
            )}
          </div>

          <p className="mt-6 text-center text-[11px] leading-5" style={{ color: "#5F6E8C" }}>
            빈출도는 DVA-C02 도메인 비중과 수험 후기 기반 추정치입니다 · 강의 237–265 (실습 242 · 246 · 248 · 251 · 254 · 262 제외, 해당 이론은 본문에 포함)
          </p>
        </main>
      </div>
    </div>
  );
}
