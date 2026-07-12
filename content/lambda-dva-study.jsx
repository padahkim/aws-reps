//fable 5 high

import React, { useState, useEffect, useRef } from "react";

/* ============================================================
   AWS DVA — Lambda 챕터 인터랙티브 학습 콘솔
   교육 설계 근거:
   - 청킹(인지부하 이론): 6개 챕터로 분할
   - 이중부호화(Dual Coding): 모든 개념을 도식 + 텍스트로 병렬 제시
   - 인출연습(Retrieval Practice): 셀프 퀴즈로 마무리
   - 능동적 조작(Active Learning): 시뮬레이터로 파라미터를 직접 변경
   ============================================================ */

const T = {
  bg: "#F3F5F7",
  panel: "#FFFFFF",
  ink: "#182430",
  sub: "#5A6B7A",
  line: "#DDE4EA",
  orange: "#E8720C",
  orangeSoft: "#FDF0E3",
  sync: "#0B7A75",
  syncSoft: "#E3F3F2",
  async: "#6D4FC2",
  asyncSoft: "#EFEAFA",
  poll: "#1F66D0",
  pollSoft: "#E7EFFC",
  danger: "#C4361F",
  dangerSoft: "#FBE9E5",
  ok: "#1E8A4C",
  okSoft: "#E6F4EC",
};

const FONT = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
.ldx * { box-sizing: border-box; }
.ldx { font-family:'IBM Plex Sans KR', sans-serif; color:${T.ink}; background:${T.bg}; min-height:100vh; }
.ldx .mono { font-family:'IBM Plex Mono', monospace; }
.ldx button { font-family:inherit; cursor:pointer; }
.ldx .card { background:${T.panel}; border:1px solid ${T.line}; border-radius:12px; }
.ldx .navBtn { border:none; background:transparent; padding:9px 13px; border-radius:8px; font-size:13.5px; font-weight:600; color:${T.sub}; white-space:nowrap; }
.ldx .navBtn.on { background:${T.ink}; color:#fff; }
.ldx .navBtn:focus-visible, .ldx button:focus-visible { outline:2px solid ${T.orange}; outline-offset:2px; }
.ldx input[type=range] { accent-color:${T.orange}; width:100%; }
.ldx .tag { display:inline-block; font-size:11px; font-weight:700; letter-spacing:.06em; padding:3px 8px; border-radius:99px; }
.ldx .examTip { border-left:4px solid ${T.orange}; background:${T.orangeSoft}; padding:12px 14px; border-radius:0 10px 10px 0; font-size:13.5px; line-height:1.65; }
@media (prefers-reduced-motion: reduce){ .ldx * { animation:none !important; transition:none !important; } }
`;

/* ---------- 공용 소품 ---------- */
const H2 = ({ kicker, children }) => (
  <div style={{ marginBottom: 14 }}>
    {kicker && (
      <div
        className="mono"
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: ".12em",
          color: T.orange,
          marginBottom: 4,
        }}
      >
        {kicker}
      </div>
    )}
    <h2
      style={{
        margin: 0,
        fontSize: 21,
        fontWeight: 700,
        letterSpacing: "-0.01em",
      }}
    >
      {children}
    </h2>
  </div>
);

const P = ({ children, style }) => (
  <p
    style={{
      fontSize: 14,
      lineHeight: 1.75,
      color: T.ink,
      margin: "0 0 10px",
      ...style,
    }}
  >
    {children}
  </p>
);

const ExamTip = ({ children }) => (
  <div className="examTip" style={{ margin: "14px 0" }}>
    <span style={{ fontWeight: 700, color: T.orange }}>시험 포인트 · </span>
    {children}
  </div>
);

/* ---------- SVG 도식 공용 ---------- */
const Box = ({ x, y, w, h, fill, stroke, label, sub, mono }) => (
  <g>
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={9}
      fill={fill}
      stroke={stroke}
      strokeWidth={1.5}
    />
    <text
      x={x + w / 2}
      y={y + h / 2 + (sub ? -4 : 5)}
      textAnchor="middle"
      fontSize={12.5}
      fontWeight={700}
      fill={T.ink}
      fontFamily={
        mono ? "'IBM Plex Mono',monospace" : "'IBM Plex Sans KR',sans-serif"
      }
    >
      {label}
    </text>
    {sub && (
      <text
        x={x + w / 2}
        y={y + h / 2 + 13}
        textAnchor="middle"
        fontSize={10.5}
        fill={T.sub}
      >
        {sub}
      </text>
    )}
  </g>
);

const Arrow = ({
  x1,
  y1,
  x2,
  y2,
  color = T.sub,
  dashed,
  label,
  labelDy = -7,
  both,
}) => {
  const mx = (x1 + x2) / 2,
    my = (y1 + y2) / 2;
  const id = `ah-${color.replace("#", "")}${both ? "b" : ""}`;
  return (
    <g>
      <defs>
        <marker
          id={id}
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
        >
          <path
            d="M1,1 L7,4 L1,7"
            fill="none"
            stroke={color}
            strokeWidth="1.6"
          />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={1.8}
        strokeDasharray={dashed ? "5 4" : "none"}
        markerEnd={`url(#${id})`}
        markerStart={both ? `url(#${id})` : "none"}
      />
      {label && (
        <text
          x={mx}
          y={my + labelDy}
          textAnchor="middle"
          fontSize={10.5}
          fontWeight={600}
          fill={color}
        >
          {label}
        </text>
      )}
    </g>
  );
};

/* ============================================================
   CH 1. 개요 + 실행 환경 라이프사이클 (콜드/웜 스타트 시뮬레이터)
   ============================================================ */
const PHASES_COLD = [
  {
    key: "download",
    label: "코드 다운로드",
    desc: "S3/ECR에서 배포 패키지를 가져옴",
    color: T.poll,
    dur: 900,
  },
  {
    key: "env",
    label: "실행 환경 생성",
    desc: "마이크로VM(Firecracker) 부팅, 메모리/런타임 할당",
    color: T.poll,
    dur: 900,
  },
  {
    key: "init",
    label: "INIT (초기화)",
    desc: "핸들러 밖 코드 실행 — import, DB 커넥션, SDK 클라이언트",
    color: T.async,
    dur: 1100,
  },
  {
    key: "invoke",
    label: "INVOKE (핸들러 실행)",
    desc: "handler(event, context) 실행",
    color: T.ok,
    dur: 900,
  },
];
const PHASES_WARM = [
  {
    key: "invoke",
    label: "INVOKE (핸들러 실행)",
    desc: "기존 환경 재사용 — INIT 생략, /tmp·전역 변수 유지",
    color: T.ok,
    dur: 900,
  },
];

function LifecycleSim() {
  const [mode, setMode] = useState(null); // 'cold' | 'warm'
  const [step, setStep] = useState(-1);
  const timer = useRef(null);

  const run = (m) => {
    clearTimeout(timer.current);
    setMode(m);
    setStep(0);
  };
  useEffect(() => {
    if (mode === null || step < 0) return;
    const phases = mode === "cold" ? PHASES_COLD : PHASES_WARM;
    if (step >= phases.length) return;
    timer.current = setTimeout(() => setStep((s) => s + 1), phases[step].dur);
    return () => clearTimeout(timer.current);
  }, [mode, step]);

  const phases =
    mode === "cold" ? PHASES_COLD : mode === "warm" ? PHASES_WARM : [];
  const done = mode && step >= phases.length;

  return (
    <div className="card" style={{ padding: 18 }}>
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700 }}>
          호출 실행해 보기 →
        </span>
        <button
          onClick={() => run("cold")}
          style={{
            background: T.poll,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 14px",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          ❄️ 콜드 스타트 호출
        </button>
        <button
          onClick={() => run("warm")}
          style={{
            background: T.ok,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 14px",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          🔥 웜 호출
        </button>
      </div>

      {mode === null && (
        <P style={{ color: T.sub }}>
          버튼을 눌러 두 경로의 차이를 직접 비교해 보세요. 콜드 스타트는 4단계,
          웜 호출은 단 1단계입니다.
        </P>
      )}

      {mode && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {phases.map((ph, i) => {
            const state = i < step ? "done" : i === step ? "active" : "wait";
            return (
              <div
                key={ph.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 9,
                  border: `1.5px solid ${state === "wait" ? T.line : ph.color}`,
                  background:
                    state === "active"
                      ? ph.color
                      : state === "done"
                        ? "#fff"
                        : "#FAFBFC",
                  opacity: state === "wait" ? 0.45 : 1,
                  transition: "all .35s",
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: state === "active" ? "#fff" : ph.color,
                    minWidth: 20,
                  }}
                >
                  {state === "done" ? "✓" : `${i + 1}`}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: state === "active" ? "#fff" : T.ink,
                    }}
                  >
                    {ph.label}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color:
                        state === "active" ? "rgba(255,255,255,.85)" : T.sub,
                    }}
                  >
                    {ph.desc}
                  </div>
                </div>
              </div>
            );
          })}
          {done && (
            <div
              style={{
                background: mode === "cold" ? T.pollSoft : T.okSoft,
                borderRadius: 9,
                padding: "10px 14px",
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              {mode === "cold" ? (
                <>
                  콜드 스타트 완료 — 수백 ms에서 수 초까지 지연이 발생할 수
                  있습니다. 이 지연을 없애는 것이 <b>Provisioned Concurrency</b>
                  (미리 INIT까지 끝낸 환경을 대기)입니다.
                </>
              ) : (
                <>
                  웜 호출 완료 — 환경이 재사용되므로{" "}
                  <b>
                    핸들러 밖에서 초기화한 것(DB 커넥션, SDK 클라이언트, /tmp
                    캐시)
                  </b>
                  이 그대로 살아 있습니다. 무거운 초기화는 항상 핸들러 밖에 두는
                  것이 시험 단골 베스트 프랙티스입니다.
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChOverview() {
  return (
    <div>
      <H2 kicker="CHAPTER 1 / 6">Lambda란 무엇인가 & 실행 환경 라이프사이클</H2>
      <P>
        <b>AWS Lambda</b>는 서버를 프로비저닝하지 않고 코드를 실행하는
        서비스입니다. 이벤트가 발생하면 AWS가 실행 환경(경량 마이크로VM)을
        띄우고, 코드를 실행하고, 사용한 시간(ms 단위)과 메모리만큼 과금합니다.
        자동으로 수평 확장되며, 사용자는 코드와 설정만 책임집니다.
      </P>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 10,
          margin: "14px 0",
        }}
      >
        {[
          [
            "과금",
            "요청 수 + 실행시간(ms)×메모리(GB-초). 유휴 시간엔 과금 없음",
          ],
          ["확장", "요청이 늘면 실행 환경을 자동으로 추가 생성 (수평 확장)"],
          ["책임", "코드·설정은 사용자, 인프라·패치·가용성은 AWS"],
        ].map(([t, d]) => (
          <div key={t} className="card" style={{ padding: 14 }}>
            <div
              className="mono"
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: T.orange,
                letterSpacing: ".1em",
                marginBottom: 5,
              }}
            >
              {t.toUpperCase()}
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: T.ink }}>
              {d}
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, margin: "22px 0 8px" }}>
        실행 환경 라이프사이클 — 콜드 vs 웜
      </h3>
      <P>
        Lambda 성능 문제의 90%는 이 그림 하나로 설명됩니다. 첫 호출(또는 오랜
        유휴 후 호출)은 환경을 새로 만들어야 하는 <b>콜드 스타트</b>, 이미 살아
        있는 환경으로 들어가는 호출은 <b>웜 호출</b>입니다.
      </P>
      <LifecycleSim />

      <ExamTip>
        "콜드 스타트 지연을 줄이려면?" → <b>Provisioned Concurrency</b> (또는
        Java의 <b>SnapStart</b>). "DB 커넥션을 어디서 초기화?" →{" "}
        <b>핸들러 밖(INIT 단계)</b>. "호출 간 임시 데이터 캐시?" → <b>/tmp</b>{" "}
        (같은 환경이 재사용될 때만 유지됨, 영속 저장소 아님).
      </ExamTip>
    </div>
  );
}

/* ============================================================
   CH 2. 호출 모델 3가지 (핵심 도식)
   ============================================================ */
function SyncDiagram() {
  return (
    <svg
      viewBox="0 0 640 180"
      style={{ width: "100%", height: "auto" }}
      role="img"
      aria-label="동기 호출 흐름도"
    >
      <Box
        x={20}
        y={65}
        w={110}
        h={50}
        fill="#fff"
        stroke={T.line}
        label="클라이언트"
        sub="결과를 기다림"
      />
      <Box
        x={230}
        y={65}
        w={140}
        h={50}
        fill={T.syncSoft}
        stroke={T.sync}
        label="API Gateway / ALB"
        sub="SDK invoke도 동기"
      />
      <Box
        x={480}
        y={65}
        w={130}
        h={50}
        fill={T.orangeSoft}
        stroke={T.orange}
        label="λ Lambda"
        sub="즉시 실행"
      />
      <Arrow x1={130} y1={80} x2={228} y2={80} color={T.sync} label="① 요청" />
      <Arrow x1={370} y1={80} x2={478} y2={80} color={T.sync} label="② 호출" />
      <Arrow
        x1={478}
        y1={100}
        x2={370}
        y2={100}
        color={T.ink}
        label="③ 응답/에러"
        labelDy={14}
      />
      <Arrow
        x1={228}
        y1={100}
        x2={130}
        y2={100}
        color={T.ink}
        label="④ 그대로 반환"
        labelDy={14}
      />
      <text
        x={320}
        y={155}
        textAnchor="middle"
        fontSize={11.5}
        fill={T.danger}
        fontWeight={600}
      >
        에러가 나면? → 클라이언트가 직접 받고, 재시도도 클라이언트 책임
      </text>
    </svg>
  );
}

function AsyncDiagram() {
  return (
    <svg
      viewBox="0 0 640 250"
      style={{ width: "100%", height: "auto" }}
      role="img"
      aria-label="비동기 호출 흐름도"
    >
      <Box
        x={15}
        y={30}
        w={120}
        h={46}
        fill="#fff"
        stroke={T.line}
        label="S3 / SNS"
        sub="EventBridge…"
      />
      <Box
        x={210}
        y={30}
        w={150}
        h={46}
        fill={T.asyncSoft}
        stroke={T.async}
        label="내부 이벤트 큐"
        sub="Lambda가 관리"
      />
      <Box
        x={440}
        y={30}
        w={130}
        h={46}
        fill={T.orangeSoft}
        stroke={T.orange}
        label="λ Lambda"
        sub="큐에서 꺼내 실행"
      />
      <Arrow
        x1={135}
        y1={53}
        x2={208}
        y2={53}
        color={T.async}
        label="이벤트 (202 즉시 반환)"
      />
      <Arrow x1={360} y1={53} x2={438} y2={53} color={T.async} />
      {/* retry loop */}
      <path
        d="M 505 76 C 505 120, 420 120, 420 90"
        fill="none"
        stroke={T.danger}
        strokeWidth={1.8}
        strokeDasharray="5 4"
      />
      <text
        x={505}
        y={118}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill={T.danger}
      >
        실패 시 자동 재시도 ×2 (총 3회)
      </text>
      {/* failure destinations */}
      <Box
        x={80}
        y={175}
        w={190}
        h={50}
        fill={T.dangerSoft}
        stroke={T.danger}
        label="DLQ (SQS / SNS)"
        sub="최종 실패 이벤트 보관"
      />
      <Box
        x={370}
        y={175}
        w={230}
        h={50}
        fill={T.okSoft}
        stroke={T.ok}
        label="Destinations"
        sub="성공/실패 → SQS·SNS·Lambda·EventBridge"
      />
      <Arrow
        x1={430}
        y1={80}
        x2={220}
        y2={173}
        color={T.danger}
        dashed
        label="3회 모두 실패"
        labelDy={-10}
      />
      <Arrow
        x1={510}
        y1={80}
        x2={490}
        y2={173}
        color={T.ok}
        dashed
        label="onSuccess / onFailure"
        labelDy={-10}
      />
    </svg>
  );
}

function PollDiagram() {
  return (
    <svg
      viewBox="0 0 640 200"
      style={{ width: "100%", height: "auto" }}
      role="img"
      aria-label="이벤트 소스 매핑 흐름도"
    >
      <Box
        x={15}
        y={60}
        w={140}
        h={50}
        fill="#fff"
        stroke={T.line}
        label="SQS / Kinesis"
        sub="DynamoDB Streams"
      />
      <Box
        x={235}
        y={60}
        w={180}
        h={50}
        fill={T.pollSoft}
        stroke={T.poll}
        label="Event Source Mapping"
        sub="Lambda 서비스 내 폴러"
      />
      <Box
        x={490}
        y={60}
        w={130}
        h={50}
        fill={T.orangeSoft}
        stroke={T.orange}
        label="λ Lambda"
        sub="배치 단위로 실행"
      />
      <Arrow
        x1={233}
        y1={75}
        x2={157}
        y2={75}
        color={T.poll}
        label="① 폴링(Poll)"
      />
      <Arrow
        x1={157}
        y1={95}
        x2={233}
        y2={95}
        color={T.poll}
        label="② 레코드 배치"
        labelDy={14}
      />
      <Arrow
        x1={415}
        y1={85}
        x2={488}
        y2={85}
        color={T.poll}
        label="③ 동기 호출"
      />
      <text
        x={320}
        y={155}
        textAnchor="middle"
        fontSize={11.5}
        fill={T.sub}
        fontWeight={600}
      >
        Lambda가 소스를 "당겨오는" 모델 — BatchSize, Batch Window로 묶음 크기
        조절
      </text>
      <text
        x={320}
        y={175}
        textAnchor="middle"
        fontSize={11.5}
        fill={T.danger}
        fontWeight={600}
      >
        Kinesis/DynamoDB: 샤드당 순서 보장, 실패 시 배치 재처리
        (Bisect·MaxRetry로 제어)
      </text>
    </svg>
  );
}

const INVOKE_TABS = [
  {
    id: "sync",
    name: "동기 (Synchronous)",
    color: T.sync,
    soft: T.syncSoft,
    who: "API Gateway, ALB, Cognito, CLI/SDK (RequestResponse)",
    err: "호출자가 에러를 직접 수신 — 재시도는 클라이언트 책임",
    Diagram: SyncDiagram,
    detail:
      "요청을 보낸 쪽이 함수 실행이 끝날 때까지 기다렸다가 결과를 직접 돌려받는 모델입니다. 사용자가 응답을 기다리는 웹 API에 적합합니다.",
  },
  {
    id: "async",
    name: "비동기 (Asynchronous)",
    color: T.async,
    soft: T.asyncSoft,
    who: "S3, SNS, EventBridge, CodeCommit (Event 타입 호출)",
    err: "Lambda가 2회 자동 재시도(총 3회) → 최종 실패 시 DLQ 또는 Destinations",
    Diagram: AsyncDiagram,
    detail:
      "이벤트를 Lambda의 내부 큐에 넣고 202를 즉시 반환합니다. 호출자는 결과를 기다리지 않으며, 실패 처리는 Lambda가 담당합니다. Destinations가 DLQ보다 권장되는 최신 방식(성공 경로까지 지원)이라는 점이 자주 출제됩니다.",
  },
  {
    id: "poll",
    name: "폴링 (Event Source Mapping)",
    color: T.poll,
    soft: T.pollSoft,
    who: "SQS, Kinesis Data Streams, DynamoDB Streams, MSK/Kafka",
    err: "SQS: 실패 메시지는 큐로 복귀 후 재처리(DLQ는 SQS 큐에 설정). 스트림: 성공까지/만료까지 배치 재시도",
    Diagram: PollDiagram,
    detail:
      "소스가 Lambda를 부르는 게 아니라, Lambda 서비스의 폴러(Event Source Mapping)가 소스에서 레코드를 읽어 배치로 함수를 동기 호출합니다. '누가 누구를 호출하는가'의 방향이 반대라는 점이 핵심입니다.",
  },
];

function ChInvoke() {
  const [tab, setTab] = useState("sync");
  const cur = INVOKE_TABS.find((t) => t.id === tab);
  return (
    <div>
      <H2 kicker="CHAPTER 2 / 6">호출 모델 3가지 — DVA 최다 출제 영역</H2>
      <P>
        시험 문제의 절반은 "이 시나리오는 어떤 호출 모델이고, 에러는 누가
        처리하는가?"를 묻습니다. 아래 3개 탭의 도식을 <b>에러 처리 주체</b>{" "}
        중심으로 비교하며 보세요.
      </P>

      <div
        style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "14px 0" }}
      >
        {INVOKE_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              border: `1.5px solid ${tab === t.id ? t.color : T.line}`,
              background: tab === t.id ? t.color : "#fff",
              color: tab === t.id ? "#fff" : T.ink,
              borderRadius: 9,
              padding: "9px 14px",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div
        className="card"
        style={{ padding: 18, borderTop: `4px solid ${cur.color}` }}
      >
        <P>{cur.detail}</P>
        <cur.Diagram />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 10,
            marginTop: 12,
          }}
        >
          <div
            style={{
              background: cur.soft,
              borderRadius: 9,
              padding: "10px 14px",
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            <b>대표 트리거 · </b>
            {cur.who}
          </div>
          <div
            style={{
              background: T.dangerSoft,
              borderRadius: 9,
              padding: "10px 14px",
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            <b>에러 처리 · </b>
            {cur.err}
          </div>
        </div>
      </div>

      <ExamTip>
        암기 열쇠는 방향입니다 — 동기·비동기는 소스가 Lambda를 <b>push</b>,
        폴링은 Lambda(ESM)가 소스를 <b>pull</b>. "S3 이벤트 실패분을 놓치지
        않으려면?" → DLQ/Destinations(비동기). "SQS 메시지를 Lambda로?" → Event
        Source Mapping. "API 5xx를 사용자가 봤다" → 동기(클라이언트 재시도).
      </ExamTip>
    </div>
  );
}

/* ============================================================
   CH 3. 동시성 시뮬레이터
   ============================================================ */
function ChConcurrency() {
  const [req, setReq] = useState(600);
  const [reserved, setReserved] = useState(400);
  const accountLimit = 1000;
  const running = Math.min(req, reserved);
  const throttled = Math.max(0, req - reserved);
  const pct = (n) => `${Math.round((n / 1500) * 100)}%`;

  return (
    <div>
      <H2 kicker="CHAPTER 3 / 6">동시성(Concurrency)과 스로틀링</H2>
      <P>
        <b>동시성 = 같은 순간에 실행 중인 실행 환경의 수</b>입니다.
        계정당(리전별) 기본 한도는 1,000이며, 함수별로{" "}
        <b>Reserved Concurrency</b>를 지정하면 그 함수의 상한이자 전용 보장량이
        됩니다. 한도를 넘는 요청은 <b>스로틀(429 TooManyRequestsException)</b>
        됩니다.
      </P>

      <div className="card" style={{ padding: 18, margin: "14px 0" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <label style={{ fontSize: 13, fontWeight: 600 }}>
            초당 동시 요청 수:{" "}
            <span className="mono" style={{ color: T.poll }}>
              {req}
            </span>
            <input
              type="range"
              min={0}
              max={1500}
              step={50}
              value={req}
              onChange={(e) => setReq(+e.target.value)}
              aria-label="동시 요청 수"
            />
          </label>
          <label style={{ fontSize: 13, fontWeight: 600 }}>
            Reserved Concurrency:{" "}
            <span className="mono" style={{ color: T.orange }}>
              {reserved}
            </span>
            <input
              type="range"
              min={0}
              max={accountLimit}
              step={50}
              value={reserved}
              onChange={(e) => setReserved(+e.target.value)}
              aria-label="예약 동시성"
            />
          </label>
        </div>

        <div
          style={{
            position: "relative",
            height: 46,
            background: "#EEF1F4",
            borderRadius: 9,
            overflow: "hidden",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: pct(running),
              background: T.ok,
              transition: "width .25s",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: pct(running),
              top: 0,
              bottom: 0,
              width: pct(throttled),
              background: T.danger,
              transition: "all .25s",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: pct(reserved),
              top: 0,
              bottom: 0,
              width: 2,
              background: T.ink,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: pct(reserved),
              top: 2,
              fontSize: 10,
              fontWeight: 700,
              color: T.ink,
              transform: "translateX(4px)",
            }}
          >
            예약 한도
          </div>
        </div>
        <div
          style={{ display: "flex", gap: 18, fontSize: 13, flexWrap: "wrap" }}
        >
          <span>
            <span style={{ color: T.ok, fontWeight: 700 }}>■</span> 실행 중:{" "}
            <b className="mono">{running}</b>
          </span>
          <span>
            <span style={{ color: T.danger, fontWeight: 700 }}>■</span>{" "}
            스로틀(429): <b className="mono">{throttled}</b>
          </span>
        </div>
        {throttled > 0 && (
          <div
            style={{
              marginTop: 12,
              background: T.dangerSoft,
              borderRadius: 9,
              padding: "10px 14px",
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            {throttled}건이 스로틀되었습니다. 스로틀의 운명은 호출 모델에 따라
            다릅니다 — <b>동기: 429를 호출자에게 반환</b> /{" "}
            <b>비동기: 최대 6시간 자동 재시도 후 DLQ</b> /{" "}
            <b>ESM: 재시도(폴링 속도 조절)</b>.
          </div>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: 10,
        }}
      >
        <div
          className="card"
          style={{ padding: 16, borderTop: `4px solid ${T.orange}` }}
        >
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
            Reserved Concurrency
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.7, color: T.sub }}>
            함수 전용 동시성 <b style={{ color: T.ink }}>보장 + 상한</b>. 다른
            함수가 계정 한도를 잠식하는 것을 방지. 무료. 0으로 설정하면 함수
            실행을 차단하는 스위치로도 사용.
          </div>
        </div>
        <div
          className="card"
          style={{ padding: 16, borderTop: `4px solid ${T.poll}` }}
        >
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
            Provisioned Concurrency
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.7, color: T.sub }}>
            지정 개수만큼{" "}
            <b style={{ color: T.ink }}>INIT까지 끝낸 환경을 미리 대기</b> →
            콜드 스타트 제거. 유료. Application Auto Scaling으로 스케줄/지표
            기반 조절 가능. 버전·별칭에 설정($LATEST 불가).
          </div>
        </div>
      </div>

      <ExamTip>
        "일부 함수가 트래픽을 독점해 다른 함수가 스로틀된다" → Reserved. "매일
        오전 9시 트래픽 급증 시 지연 없이" → Provisioned(+Auto Scaling). 429의
        정체는 <b>스로틀</b>이라는 것, 그리고 비동기 스로틀은 자동 재시도된다는
        것을 기억하세요.
      </ExamTip>
    </div>
  );
}

/* ============================================================
   CH 4. 버전 & 별칭 (카나리 시뮬레이터)
   ============================================================ */
function ChVersions() {
  const [weight, setWeight] = useState(10);
  const dots = Array.from({ length: 100 }, (_, i) => i < weight);

  return (
    <div>
      <H2 kicker="CHAPTER 4 / 6">버전(Versions) & 별칭(Aliases)</H2>
      <div className="card" style={{ padding: 18, marginBottom: 14 }}>
        <svg
          viewBox="0 0 640 210"
          style={{ width: "100%", height: "auto" }}
          role="img"
          aria-label="버전과 별칭 구조도"
        >
          <Box
            x={20}
            y={20}
            w={130}
            h={48}
            fill={T.orangeSoft}
            stroke={T.orange}
            label="$LATEST"
            sub="수정 가능(mutable)"
            mono
          />
          <Box
            x={250}
            y={20}
            w={110}
            h={44}
            fill="#fff"
            stroke={T.line}
            label="Version 1"
            sub="불변(immutable)"
            mono
          />
          <Box
            x={250}
            y={80}
            w={110}
            h={44}
            fill="#fff"
            stroke={T.line}
            label="Version 2"
            sub="불변(immutable)"
            mono
          />
          <Arrow
            x1={150}
            y1={44}
            x2={248}
            y2={42}
            color={T.sub}
            label="publish"
          />
          <Arrow
            x1={150}
            y1={60}
            x2={248}
            y2={100}
            color={T.sub}
            dashed
            label="publish"
            labelDy={12}
          />
          <Box
            x={480}
            y={50}
            w={130}
            h={48}
            fill={T.syncSoft}
            stroke={T.sync}
            label='별칭 "PROD"'
            sub="버전을 가리키는 포인터"
          />
          <Arrow
            x1={478}
            y1={62}
            x2={362}
            y2={42}
            color={T.sync}
            label={`v1 · ${100 - weight}%`}
          />
          <Arrow
            x1={478}
            y1={88}
            x2={362}
            y2={100}
            color={T.sync}
            label={`v2 · ${weight}%`}
            labelDy={14}
          />
          <text
            x={320}
            y={175}
            textAnchor="middle"
            fontSize={11.5}
            fill={T.sub}
            fontWeight={600}
          >
            클라이언트/트리거는 별칭 ARN만 바라봄 → 배포 시 포인터만 이동, 코드
            호출부 변경 없음
          </text>
          <text
            x={320}
            y={195}
            textAnchor="middle"
            fontSize={11.5}
            fill={T.danger}
            fontWeight={600}
          >
            가중치 라우팅은 정확히 2개 버전까지 · 별칭은 다른 별칭을 가리킬 수
            없음 · $LATEST에는 가중치 불가
          </text>
        </svg>
      </div>

      <div className="card" style={{ padding: 18 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
          카나리 배포 시뮬레이터 — 별칭 가중치 조절
        </div>
        <label style={{ fontSize: 13, fontWeight: 600 }}>
          신규 버전(v2)으로 보낼 트래픽:{" "}
          <span className="mono" style={{ color: T.orange }}>
            {weight}%
          </span>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={weight}
            onChange={(e) => setWeight(+e.target.value)}
            aria-label="v2 트래픽 가중치"
          />
        </label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(20, 1fr)",
            gap: 4,
            margin: "12px 0",
          }}
        >
          {dots.map((isV2, i) => (
            <div
              key={i}
              title={isV2 ? "v2" : "v1"}
              style={{
                aspectRatio: "1",
                borderRadius: "50%",
                transition: "background .2s",
                background: isV2 ? T.orange : T.line,
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: 12.5, color: T.sub }}>
          요청 100건 기준:{" "}
          <b style={{ color: T.ink }}>{100 - weight}건 → v1(안정)</b>,{" "}
          <b style={{ color: T.orange }}>{weight}건 → v2(신규)</b>. 에러율을
          지켜보며 서서히 올리는 것이 카나리 배포이고, CodeDeploy가 이 과정을
          자동화(Linear/Canary/AllAtOnce + 알람 시 자동 롤백)합니다.
        </div>
      </div>

      <ExamTip>
        버전은 <b>코드+설정의 불변 스냅샷</b>, 별칭은{" "}
        <b>움직일 수 있는 포인터</b>. "무중단으로 신버전을 5%만 테스트" → 별칭
        가중치 라우팅. "환경(dev/prod)마다 다른 엔드포인트" → 별칭별 트리거
        연결. 환경 변수는 버전에 스냅샷으로 고정된다는 점도 출제됩니다.
      </ExamTip>
    </div>
  );
}

/* ============================================================
   CH 5. 권한 + 설정/한도
   ============================================================ */
function PermDiagram() {
  return (
    <svg
      viewBox="0 0 640 190"
      style={{ width: "100%", height: "auto" }}
      role="img"
      aria-label="Lambda 권한 모델 도식"
    >
      <Box
        x={20}
        y={70}
        w={130}
        h={50}
        fill="#fff"
        stroke={T.line}
        label="S3 / API GW"
        sub="호출하는 쪽"
      />
      <Box
        x={255}
        y={70}
        w={130}
        h={50}
        fill={T.orangeSoft}
        stroke={T.orange}
        label="λ Lambda"
      />
      <Box
        x={490}
        y={70}
        w={130}
        h={50}
        fill="#fff"
        stroke={T.line}
        label="DynamoDB / SQS"
        sub="호출받는 쪽"
      />
      <Arrow
        x1={150}
        y1={95}
        x2={253}
        y2={95}
        color={T.async}
        label="Resource-based Policy"
      />
      <text
        x={202}
        y={122}
        textAnchor="middle"
        fontSize={10.5}
        fill={T.async}
        fontWeight={600}
      >
        "누가 나를 호출해도 되는가"
      </text>
      <Arrow
        x1={385}
        y1={95}
        x2={488}
        y2={95}
        color={T.sync}
        label="Execution Role (IAM)"
      />
      <text
        x={437}
        y={122}
        textAnchor="middle"
        fontSize={10.5}
        fill={T.sync}
        fontWeight={600}
      >
        "내가 무엇에 접근해도 되는가"
      </text>
      <text
        x={320}
        y={165}
        textAnchor="middle"
        fontSize={11.5}
        fill={T.sub}
        fontWeight={600}
      >
        화살표 방향으로 암기: 들어오는 권한 = 리소스 정책, 나가는 권한 = 실행
        역할
      </text>
    </svg>
  );
}

const QUOTAS = [
  [
    "메모리",
    "128 MB ~ 10,240 MB",
    "CPU는 메모리에 비례 (~1,769MB ≈ 1 vCPU). 성능 튜닝 = 메모리 증설",
  ],
  [
    "타임아웃",
    "최대 900초 (15분)",
    "기본 3초. 15분 초과 작업은 Step Functions/ECS로",
  ],
  [
    "/tmp 스토리지",
    "512 MB ~ 10 GB",
    "임시 디스크. 웜 호출 간 재사용될 수 있으나 영속 아님",
  ],
  [
    "배포 패키지",
    "50 MB zip / 250 MB 압축해제",
    "초과 시 컨테이너 이미지(최대 10 GB) 또는 S3 업로드",
  ],
  [
    "환경 변수",
    "총 4 KB",
    "민감값은 KMS 암호화, 또는 SSM/Secrets Manager 참조",
  ],
  ["동시성", "계정당 1,000 (기본, 상향 가능)", "초과 = 스로틀 429"],
  [
    "레이어",
    "함수당 최대 5개",
    "공통 라이브러리/의존성 공유, 압축해제 250MB 합산에 포함",
  ],
  ["페이로드", "동기 6 MB / 비동기 256 KB", "큰 데이터는 S3에 두고 참조 전달"],
];

function ChConfig() {
  return (
    <div>
      <H2 kicker="CHAPTER 5 / 6">권한 모델 & 설정·한도 (숫자 암기 구간)</H2>
      <P>
        권한 문제는 딱 한 가지만 구분하면 됩니다 — 권한이{" "}
        <b>들어오느냐, 나가느냐</b>.
      </P>
      <div className="card" style={{ padding: 18, marginBottom: 18 }}>
        <PermDiagram />
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 10px" }}>
        핵심 한도 — 시험에 숫자 그대로 나옵니다
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: 10,
        }}
      >
        {QUOTAS.map(([name, val, note]) => (
          <div
            key={name}
            className="card"
            style={{
              padding: 14,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700 }}>{name}</span>
              <span
                className="mono"
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: T.orange,
                  textAlign: "right",
                }}
              >
                {val}
              </span>
            </div>
            <div style={{ fontSize: 12, lineHeight: 1.6, color: T.sub }}>
              {note}
            </div>
          </div>
        ))}
      </div>

      <ExamTip>
        가장 자주 나오는 함정: "CPU를 늘리고 싶다" → CPU 설정은 없고{" "}
        <b>메모리를 올린다</b>. "250MB 넘는 의존성" → <b>컨테이너 이미지</b>{" "}
        또는 EFS 마운트. "환경 변수에 DB 비밀번호" →{" "}
        <b>KMS 암호화 / Secrets Manager</b>.
      </ExamTip>
    </div>
  );
}

/* ============================================================
   CH 6. 인출연습 퀴즈 (셀프 채점 플래시카드)
   ============================================================ */
const QUIZ = [
  {
    q: "S3 이벤트로 트리거된 Lambda가 실패했다. 기본적으로 몇 번 재시도되며, 최종 실패 이벤트를 놓치지 않으려면?",
    a: "비동기 호출이므로 2회 자동 재시도(총 3회). 최종 실패 보관은 DLQ(SQS/SNS) 또는 Destinations(onFailure)로.",
  },
  {
    q: "SQS 큐의 메시지를 Lambda로 처리하려 한다. 어떤 호출 모델이며, 누가 누구를 호출하는가?",
    a: "Event Source Mapping(폴링). Lambda 서비스의 폴러가 SQS를 폴링해서 배치를 만들어 함수를 '동기' 호출한다.",
  },
  {
    q: "매일 오전 9시 트래픽 급증 시 콜드 스타트 지연을 없애려면?",
    a: "Provisioned Concurrency + Application Auto Scaling(스케줄 기반). Reserved는 한도 보장일 뿐 콜드 스타트를 없애지 못한다.",
  },
  {
    q: "호출자가 429 TooManyRequestsException을 받았다. 원인은?",
    a: "스로틀링 — 동시성 한도(계정 1,000 또는 함수 Reserved 한도) 초과. 동기 호출이라 에러가 호출자에게 직접 전달된 것.",
  },
  {
    q: "Lambda가 DynamoDB 테이블을 읽을 권한은 어디에 부여하는가? 반대로 API Gateway가 Lambda를 호출할 권한은?",
    a: "나가는 권한 = Execution Role(IAM 역할). 들어오는 권한 = Lambda의 Resource-based Policy.",
  },
  {
    q: "신규 코드 버전을 전체 트래픽의 10%에만 무중단으로 노출하려면?",
    a: "버전 2개를 발행하고 별칭(Alias) 가중치 라우팅으로 90:10 분배. CodeDeploy로 자동화 + 알람 롤백 가능.",
  },
  {
    q: "함수 실행이 CPU 부족으로 느리다. CPU를 늘리는 방법은?",
    a: "메모리 크기를 올린다 — CPU는 메모리에 비례해 할당된다 (약 1,769MB에서 1 vCPU).",
  },
  {
    q: "배포 패키지가 압축 해제 시 300MB라서 업로드가 거부된다. 해결책 2가지는?",
    a: "① 컨테이너 이미지로 배포(최대 10GB) ② 의존성을 EFS에 두고 마운트. (레이어를 써도 250MB 합산 한도는 동일)",
  },
  {
    q: "핸들러 밖에서 DB 커넥션을 초기화하라는 이유는?",
    a: "INIT 단계 코드는 콜드 스타트 시 1회만 실행되고 웜 호출에서 재사용되므로, 호출마다 커넥션을 새로 맺는 비용을 없앤다.",
  },
  {
    q: "Lambda 최대 실행 시간은? 그보다 긴 작업은?",
    a: "900초(15분). 초과 작업은 Step Functions로 분할 오케스트레이션하거나 ECS/Fargate·Batch로.",
  },
];

function ChQuiz() {
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState({ o: 0, x: 0 });
  const [done, setDone] = useState(false);

  const grade = (ok) => {
    setScore((s) => ({ o: s.o + (ok ? 1 : 0), x: s.x + (ok ? 0 : 1) }));
    if (i + 1 >= QUIZ.length) setDone(true);
    else {
      setI(i + 1);
      setOpen(false);
    }
  };
  const reset = () => {
    setI(0);
    setOpen(false);
    setScore({ o: 0, x: 0 });
    setDone(false);
  };

  if (done) {
    const pct = Math.round((score.o / QUIZ.length) * 100);
    return (
      <div>
        <H2 kicker="CHAPTER 6 / 6">인출연습 결과</H2>
        <div className="card" style={{ padding: 28, textAlign: "center" }}>
          <div
            className="mono"
            style={{
              fontSize: 44,
              fontWeight: 700,
              color: pct >= 80 ? T.ok : T.orange,
            }}
          >
            {pct}%
          </div>
          <div style={{ fontSize: 14, color: T.sub, margin: "6px 0 16px" }}>
            맞음 {score.o} · 틀림 {score.x} / 총 {QUIZ.length}문항
          </div>
          <P style={{ maxWidth: 520, margin: "0 auto 16px", color: T.sub }}>
            {pct >= 80
              ? "훌륭합니다. 이제 간격을 두고 반복하세요 — 내일, 3일 후, 일주일 후에 이 퀴즈만 다시 풀면 장기기억으로 굳어집니다(간격반복)."
              : "틀린 문항이 있는 챕터로 돌아가 도식을 다시 보고, 몇 시간 뒤 퀴즈만 재시도하세요. 틀린 직후의 재학습이 가장 효율이 높습니다."}
          </P>
          <button
            onClick={reset}
            style={{
              background: T.ink,
              color: "#fff",
              border: "none",
              borderRadius: 9,
              padding: "11px 22px",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            다시 풀기 (문제 순서 유지)
          </button>
        </div>
      </div>
    );
  }

  const cur = QUIZ[i];
  return (
    <div>
      <H2 kicker="CHAPTER 6 / 6">
        셀프 퀴즈 — 답을 보기 전에 반드시 소리 내어/글로 답하기
      </H2>
      <P style={{ color: T.sub }}>
        보기를 고르는 게 아니라 스스로 답을 <b style={{ color: T.ink }}>생성</b>
        하는 것이 인출연습의 핵심입니다. 답을 떠올린 뒤에만 정답을 여세요.
      </P>

      <div className="card" style={{ padding: 22, marginTop: 12 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 14,
            fontSize: 12.5,
            color: T.sub,
          }}
        >
          <span className="mono">
            Q {i + 1} / {QUIZ.length}
          </span>
          <span>
            맞음 <b style={{ color: T.ok }}>{score.o}</b> · 틀림{" "}
            <b style={{ color: T.danger }}>{score.x}</b>
          </span>
        </div>
        <div
          style={{
            height: 4,
            background: T.line,
            borderRadius: 99,
            marginBottom: 18,
          }}
        >
          <div
            style={{
              height: 4,
              width: `${(i / QUIZ.length) * 100}%`,
              background: T.orange,
              borderRadius: 99,
              transition: "width .3s",
            }}
          />
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            lineHeight: 1.65,
            marginBottom: 18,
          }}
        >
          {cur.q}
        </div>

        {!open ? (
          <button
            onClick={() => setOpen(true)}
            style={{
              background: T.orange,
              color: "#fff",
              border: "none",
              borderRadius: 9,
              padding: "11px 20px",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            답 확인하기
          </button>
        ) : (
          <div>
            <div
              style={{
                background: T.okSoft,
                borderRadius: 10,
                padding: "14px 16px",
                fontSize: 14,
                lineHeight: 1.7,
                marginBottom: 14,
              }}
            >
              {cur.a}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => grade(true)}
                style={{
                  flex: 1,
                  background: T.ok,
                  color: "#fff",
                  border: "none",
                  borderRadius: 9,
                  padding: "11px",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                맞혔다 ✓
              </button>
              <button
                onClick={() => grade(false)}
                style={{
                  flex: 1,
                  background: "#fff",
                  color: T.danger,
                  border: `1.5px solid ${T.danger}`,
                  borderRadius: 9,
                  padding: "11px",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                틀렸다 ✗
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   앱 셸
   ============================================================ */
const CHAPTERS = [
  { id: "ov", name: "1 · 개요 & 라이프사이클", C: ChOverview },
  { id: "inv", name: "2 · 호출 모델", C: ChInvoke },
  { id: "con", name: "3 · 동시성", C: ChConcurrency },
  { id: "ver", name: "4 · 버전 & 별칭", C: ChVersions },
  { id: "cfg", name: "5 · 권한 & 한도", C: ChConfig },
  { id: "qz", name: "6 · 셀프 퀴즈", C: ChQuiz },
];

export default function LambdaDvaStudy() {
  const [ch, setCh] = useState("ov");
  const Cur = CHAPTERS.find((c) => c.id === ch).C;

  return (
    <div className="ldx">
      <style>{FONT}</style>
      <header
        style={{ background: T.ink, color: "#fff", padding: "22px 20px 0" }}
      >
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: ".14em",
              color: T.orange,
              fontWeight: 600,
            }}
          >
            AWS CERTIFIED DEVELOPER — ASSOCIATE
          </div>
          <h1
            style={{
              margin: "6px 0 4px",
              fontSize: 25,
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            <span style={{ color: T.orange }}>λ</span> Lambda 학습 콘솔
          </h1>
          <p
            style={{
              margin: "0 0 16px",
              fontSize: 13,
              color: "rgba(255,255,255,.65)",
              lineHeight: 1.6,
            }}
          >
            도식으로 이해하고(이중부호화) → 시뮬레이터로 만져보고(능동학습) →
            퀴즈로 꺼내보기(인출연습)
          </p>
          <nav
            style={{
              display: "flex",
              gap: 4,
              overflowX: "auto",
              paddingBottom: 12,
            }}
            aria-label="챕터"
          >
            {CHAPTERS.map((c) => (
              <button
                key={c.id}
                className="navBtn"
                onClick={() => setCh(c.id)}
                style={
                  ch === c.id
                    ? { background: T.orange, color: "#fff" }
                    : { color: "rgba(255,255,255,.7)" }
                }
              >
                {c.name}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main
        style={{ maxWidth: 860, margin: "0 auto", padding: "26px 20px 60px" }}
      >
        <Cur />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 28,
          }}
        >
          {CHAPTERS.findIndex((c) => c.id === ch) > 0 ? (
            <button
              onClick={() =>
                setCh(CHAPTERS[CHAPTERS.findIndex((c) => c.id === ch) - 1].id)
              }
              style={{
                background: "#fff",
                border: `1.5px solid ${T.line}`,
                borderRadius: 9,
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              ← 이전 챕터
            </button>
          ) : (
            <span />
          )}
          {CHAPTERS.findIndex((c) => c.id === ch) < CHAPTERS.length - 1 && (
            <button
              onClick={() =>
                setCh(CHAPTERS[CHAPTERS.findIndex((c) => c.id === ch) + 1].id)
              }
              style={{
                background: T.ink,
                color: "#fff",
                border: "none",
                borderRadius: 9,
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              다음 챕터 →
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
