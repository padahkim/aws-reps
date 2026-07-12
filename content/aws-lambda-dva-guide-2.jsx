//fable 5 high
import { useState } from "react";

// ─── Design tokens (AWS "Squid Ink" console theme) ───
const C = {
  bg: "#131A22",
  panel: "#1B2530",
  panelDeep: "#151E28",
  border: "#2C3A49",
  orange: "#FF9900",
  orangeSoft: "#FFB84D",
  sync: "#4DA3FF",
  async: "#B48CFF",
  poll: "#3DDBD9",
  ok: "#6BCB77",
  err: "#FF6B6B",
  text: "#E8EDF2",
  muted: "#8CA0B3",
  faint: "#5C7186",
};

const mono = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";

// ─── Small building blocks ───
const Tag = ({ color, children }) => (
  <span
    style={{
      color,
      border: `1px solid ${color}55`,
      background: `${color}14`,
      fontFamily: mono,
      fontSize: 11,
      padding: "2px 8px",
      borderRadius: 4,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </span>
);

const Card = ({ title, accent = C.orange, children }) => (
  <div
    style={{
      background: C.panel,
      border: `1px solid ${C.border}`,
      borderRadius: 10,
      padding: "18px 20px",
      marginBottom: 16,
    }}
  >
    {title && (
      <div
        style={{
          fontFamily: mono,
          fontSize: 12,
          letterSpacing: 1.5,
          color: accent,
          marginBottom: 12,
          textTransform: "uppercase",
        }}
      >
        ▸ {title}
      </div>
    )}
    {children}
  </div>
);

const P = ({ children }) => (
  <p style={{ color: C.text, fontSize: 14, lineHeight: 1.75, margin: "8px 0" }}>
    {children}
  </p>
);

const Hint = ({ children }) => (
  <div
    style={{
      borderLeft: `3px solid ${C.orange}`,
      background: `${C.orange}0D`,
      padding: "10px 14px",
      borderRadius: "0 8px 8px 0",
      margin: "12px 0",
      fontSize: 13.5,
      lineHeight: 1.7,
      color: C.text,
    }}
  >
    <span
      style={{
        color: C.orange,
        fontWeight: 700,
        fontFamily: mono,
        fontSize: 12,
      }}
    >
      DVA 시험 포인트{" "}
    </span>
    — {children}
  </div>
);

// SVG helpers
const Box = ({ x, y, w, h, label, sub, color = C.orange, dashed = false }) => (
  <g>
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={8}
      fill={`${color}14`}
      stroke={color}
      strokeWidth={1.5}
      strokeDasharray={dashed ? "5 4" : "none"}
    />
    <text
      x={x + w / 2}
      y={y + (sub ? h / 2 - 5 : h / 2 + 1)}
      textAnchor="middle"
      dominantBaseline="middle"
      fill={C.text}
      fontSize={13}
      fontWeight={600}
    >
      {label}
    </text>
    {sub && (
      <text
        x={x + w / 2}
        y={y + h / 2 + 13}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={C.muted}
        fontSize={10.5}
        fontFamily={mono}
      >
        {sub}
      </text>
    )}
  </g>
);

const Arrow = ({
  d,
  color = C.muted,
  label,
  lx,
  ly,
  dash = false,
  animate = false,
}) => (
  <g>
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeDasharray={dash ? "6 5" : "none"}
      markerEnd="url(#arr)"
      opacity={0.85}
    />
    {animate && (
      <circle r={4} fill={color}>
        <animateMotion dur="2.2s" repeatCount="indefinite" path={d} />
      </circle>
    )}
    {label && (
      <text
        x={lx}
        y={ly}
        textAnchor="middle"
        fill={color}
        fontSize={11}
        fontFamily={mono}
      >
        {label}
      </text>
    )}
  </g>
);

const Svg = ({ vb, h, children }) => (
  <div style={{ overflowX: "auto" }}>
    <svg
      viewBox={vb}
      style={{ width: "100%", minWidth: 560, height: "auto", display: "block" }}
    >
      <defs>
        <marker
          id="arr"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="context-stroke" />
        </marker>
      </defs>
      {children}
    </svg>
  </div>
);

// ═══════════════ TAB 1: 개요 ═══════════════
function TabOverview() {
  return (
    <>
      <Card title="AWS Lambda란?">
        <P>
          Lambda는 <b style={{ color: C.orange }}>서버리스(Serverless)</b>{" "}
          컴퓨팅 서비스입니다. 서버 프로비저닝·패치·확장을 전혀 신경 쓰지 않고,{" "}
          <b>이벤트가 발생했을 때만</b> 코드를 실행하며,{" "}
          <b>실행 시간(ms 단위)과 메모리</b>에 대해서만 과금됩니다.
        </P>
        <div
          style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}
        >
          <Tag color={C.orange}>이벤트 기반 (Event-driven)</Tag>
          <Tag color={C.poll}>자동 확장 (Auto-scaling)</Tag>
          <Tag color={C.async}>사용한 만큼 과금</Tag>
          <Tag color={C.ok}>서버 관리 불필요</Tag>
        </div>
      </Card>

      <Card title="전체 그림 — 이벤트 소스 → Lambda → 대상">
        <Svg vb="0 0 720 280">
          {/* sources */}
          <Box
            x={20}
            y={20}
            w={140}
            h={44}
            label="API Gateway"
            sub="HTTP 요청"
            color={C.sync}
          />
          <Box
            x={20}
            y={78}
            w={140}
            h={44}
            label="S3"
            sub="객체 업로드"
            color={C.async}
          />
          <Box
            x={20}
            y={136}
            w={140}
            h={44}
            label="SQS / Kinesis"
            sub="큐 · 스트림"
            color={C.poll}
          />
          <Box
            x={20}
            y={194}
            w={140}
            h={44}
            label="EventBridge"
            sub="스케줄 · 규칙"
            color={C.async}
          />
          {/* lambda */}
          <Box
            x={290}
            y={92}
            w={160}
            h={90}
            label="λ Lambda"
            sub="함수 코드 실행"
            color={C.orange}
          />
          {/* targets */}
          <Box
            x={560}
            y={40}
            w={140}
            h={44}
            label="DynamoDB"
            sub="데이터 저장"
            color={C.ok}
          />
          <Box
            x={560}
            y={116}
            w={140}
            h={44}
            label="SNS / SQS"
            sub="후속 처리"
            color={C.ok}
          />
          <Box
            x={560}
            y={192}
            w={140}
            h={44}
            label="CloudWatch"
            sub="로그 · 지표"
            color={C.ok}
          />
          <Arrow d="M160,42 C230,42 240,110 290,115" color={C.sync} animate />
          <Arrow
            d="M160,100 C220,100 230,120 290,128"
            color={C.async}
            animate
          />
          <Arrow d="M160,158 C220,158 230,145 290,145" color={C.poll} animate />
          <Arrow d="M160,216 C230,216 240,170 290,160" color={C.async} />
          <Arrow d="M450,115 C510,110 510,65 560,62" color={C.ok} />
          <Arrow d="M450,137 L560,138" color={C.ok} animate />
          <Arrow d="M450,160 C510,165 510,212 560,214" color={C.ok} />
        </Svg>
        <P>
          왼쪽의 <b>이벤트 소스</b>가 트리거가 되어 Lambda가 실행되고, 함수는{" "}
          <b>실행 역할(Execution Role)</b> 권한으로 오른쪽 AWS 서비스에
          접근합니다. 화살표 색은 호출 방식을 뜻합니다 —{" "}
          <span style={{ color: C.sync }}>파랑=동기</span>,{" "}
          <span style={{ color: C.async }}>보라=비동기</span>,{" "}
          <span style={{ color: C.poll }}>청록=폴링(ESM)</span>. 이 3가지 호출
          방식이 DVA 시험의 핵심입니다.
        </P>
      </Card>

      <Card title="핵심 수치 한눈에 보기" accent={C.poll}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 10,
          }}
        >
          {[
            ["최대 실행 시간", "900초 (15분)", "기본값 3초"],
            ["메모리", "128MB ~ 10,240MB", "CPU는 메모리에 비례"],
            ["/tmp 스토리지", "512MB ~ 10GB", "임시 파일 공간"],
            ["환경 변수", "총 4KB", "전체 합산 크기"],
            ["배포 패키지", "50MB(zip) / 250MB(압축 해제)", "컨테이너는 10GB"],
            ["동시성 기본값", "계정당 1,000", "리전 단위, 상향 요청 가능"],
          ].map(([k, v, s]) => (
            <div
              key={k}
              style={{
                background: C.panelDeep,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "12px 14px",
              }}
            >
              <div
                style={{
                  color: C.muted,
                  fontSize: 11,
                  fontFamily: mono,
                  marginBottom: 4,
                }}
              >
                {k}
              </div>
              <div
                style={{ color: C.orangeSoft, fontSize: 14, fontWeight: 700 }}
              >
                {v}
              </div>
              <div style={{ color: C.faint, fontSize: 11, marginTop: 2 }}>
                {s}
              </div>
            </div>
          ))}
        </div>
        <Hint>
          수치 암기 문제가 자주 나옵니다. 특히 <b>15분 제한</b>은 "장시간 배치
          작업 → Lambda 대신 ECS/Batch/Step Functions" 유형의 정답 근거로
          쓰입니다.
        </Hint>
      </Card>
    </>
  );
}

// ═══════════════ TAB 2: 실행 환경 & 콜드스타트 ═══════════════
function TabLifecycle() {
  return (
    <>
      <Card title="실행 환경 수명주기 (Execution Environment Lifecycle)">
        <Svg vb="0 0 720 190">
          <Box
            x={20}
            y={30}
            w={200}
            h={70}
            label="INIT (초기화)"
            sub="런타임 시작 + 핸들러 밖 코드"
            color={C.err}
          />
          <Box
            x={260}
            y={30}
            w={200}
            h={70}
            label="INVOKE (호출)"
            sub="handler() 실행"
            color={C.orange}
          />
          <Box
            x={500}
            y={30}
            w={200}
            h={70}
            label="SHUTDOWN"
            sub="환경 종료"
            color={C.faint}
          />
          <Arrow d="M220,65 L260,65" color={C.muted} />
          <Arrow d="M460,65 L500,65" color={C.muted} />
          <Arrow
            d="M360,100 C360,150 360,150 360,105"
            color={C.ok}
            dash
            label="웜 상태면 INVOKE만 반복"
            lx={360}
            ly={165}
          />
          <text
            x={120}
            y={130}
            textAnchor="middle"
            fill={C.err}
            fontSize={11}
            fontFamily={mono}
          >
            콜드 스타트 구간 (최대 10초)
          </text>
        </Svg>
        <P>
          <b style={{ color: C.err }}>콜드 스타트(Cold Start)</b>: 새 실행
          환경이 필요할 때 코드 다운로드 → 런타임 기동 →{" "}
          <b>핸들러 밖(전역) 초기화 코드 실행</b>이 일어나 지연이 발생합니다.
          이후 같은 환경이 재사용되면(<b style={{ color: C.ok }}>웜 스타트</b>)
          INVOKE만 실행되어 빠릅니다.
        </P>
        <P>
          그래서{" "}
          <b>DB 연결, SDK 클라이언트 생성 등 무거운 초기화는 핸들러 밖</b>에
          두는 것이 모범 사례입니다 — 웜 호출에서 재사용되기 때문입니다.
        </P>
      </Card>

      <Card title="콜드 vs 웜 — 시간축 비교" accent={C.err}>
        <Svg vb="0 0 720 150">
          <text x={20} y={35} fill={C.err} fontSize={12} fontFamily={mono}>
            COLD
          </text>
          <rect
            x={80}
            y={20}
            width={180}
            height={26}
            rx={5}
            fill={`${C.err}33`}
            stroke={C.err}
          />
          <text x={170} y={37} textAnchor="middle" fill={C.text} fontSize={11}>
            Init (전역 코드)
          </text>
          <rect
            x={262}
            y={20}
            width={340}
            height={26}
            rx={5}
            fill={`${C.orange}33`}
            stroke={C.orange}
          />
          <text x={432} y={37} textAnchor="middle" fill={C.text} fontSize={11}>
            Invoke (handler)
          </text>
          <text x={20} y={95} fill={C.ok} fontSize={12} fontFamily={mono}>
            WARM
          </text>
          <rect
            x={80}
            y={80}
            width={340}
            height={26}
            rx={5}
            fill={`${C.orange}33`}
            stroke={C.orange}
          />
          <text x={250} y={97} textAnchor="middle" fill={C.text} fontSize={11}>
            Invoke (handler)
          </text>
          <line
            x1={80}
            y1={125}
            x2={700}
            y2={125}
            stroke={C.faint}
            strokeWidth={1}
            markerEnd="url(#arr)"
          />
          <text
            x={690}
            y={140}
            textAnchor="end"
            fill={C.faint}
            fontSize={10}
            fontFamily={mono}
          >
            time →
          </text>
        </Svg>
        <P>콜드 스타트 완화 방법:</P>
        <P>
          ① <b style={{ color: C.orange }}>프로비저닝된 동시성</b> — 환경을 미리
          데워둠(가장 확실, 유료) ② <b style={{ color: C.poll }}>SnapStart</b> —
          Java 등에서 초기화 완료 스냅샷을 복원 ③ 패키지 경량화, 초기화 코드
          최소화.
        </P>
        <Hint>
          "지연 시간에 민감한 API의 콜드 스타트를 없애려면?" →{" "}
          <b>Provisioned Concurrency</b>가 정답인 경우가 많습니다. (별칭/버전에
          설정, $LATEST에는 불가)
        </Hint>
      </Card>
    </>
  );
}

// ═══════════════ TAB 3: 호출 방식 (시그니처 인터랙티브) ═══════════════
function TabInvocation() {
  const [mode, setMode] = useState("sync");
  const modes = [
    { id: "sync", label: "동기 (Synchronous)", color: C.sync },
    { id: "async", label: "비동기 (Asynchronous)", color: C.async },
    { id: "poll", label: "이벤트 소스 매핑 (Polling)", color: C.poll },
  ];

  return (
    <>
      <Card title="호출 방식 선택 — 클릭해서 흐름을 비교해 보세요">
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                cursor: "pointer",
                fontFamily: mono,
                fontSize: 13,
                padding: "8px 16px",
                borderRadius: 8,
                border: `1.5px solid ${mode === m.id ? m.color : C.border}`,
                background: mode === m.id ? `${m.color}22` : "transparent",
                color: mode === m.id ? m.color : C.muted,
                fontWeight: mode === m.id ? 700 : 400,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === "sync" && (
          <>
            <Svg vb="0 0 720 200">
              <Box
                x={30}
                y={70}
                w={150}
                h={60}
                label="클라이언트"
                sub="API Gateway · ALB · CLI"
                color={C.sync}
              />
              <Box
                x={290}
                y={70}
                w={150}
                h={60}
                label="λ Lambda"
                color={C.orange}
              />
              <Box
                x={550}
                y={70}
                w={140}
                h={60}
                label="응답 대기"
                sub="결과·에러 즉시 반환"
                color={C.sync}
                dashed
              />
              <Arrow
                d="M180,90 L290,90"
                color={C.sync}
                label="요청 (대기함)"
                lx={235}
                ly={80}
                animate
              />
              <Arrow
                d="M290,110 L180,110"
                color={C.ok}
                label="응답 / 에러"
                lx={235}
                ly={128}
                animate
              />
              <Arrow d="M440,100 L550,100" color={C.faint} dash />
              <text
                x={360}
                y={175}
                textAnchor="middle"
                fill={C.muted}
                fontSize={12}
              >
                재시도 없음 — 에러 처리는 클라이언트 책임
              </text>
            </Svg>
            <P>
              호출자가 <b>결과를 기다립니다</b>. 에러가 나면 그대로 돌려받으며,
              Lambda는 재시도하지 않습니다. 대표 트리거:{" "}
              <Tag color={C.sync}>API Gateway</Tag>{" "}
              <Tag color={C.sync}>ALB</Tag> <Tag color={C.sync}>Cognito</Tag>{" "}
              <Tag color={C.sync}>CLI --invocation-type RequestResponse</Tag>
            </P>
          </>
        )}

        {mode === "async" && (
          <>
            <Svg vb="0 0 720 260">
              <Box
                x={20}
                y={30}
                w={140}
                h={56}
                label="S3 · SNS"
                sub="EventBridge 등"
                color={C.async}
              />
              <Box
                x={230}
                y={30}
                w={160}
                h={56}
                label="내부 이벤트 큐"
                sub="Lambda가 관리"
                color={C.async}
                dashed
              />
              <Box
                x={460}
                y={30}
                w={150}
                h={56}
                label="λ Lambda"
                color={C.orange}
              />
              <Box
                x={230}
                y={160}
                w={170}
                h={56}
                label="실패 대상"
                sub="DLQ 또는 Destination"
                color={C.err}
              />
              <Box
                x={470}
                y={160}
                w={170}
                h={56}
                label="성공 대상"
                sub="Destination (SQS·SNS·λ·EB)"
                color={C.ok}
              />
              <Arrow
                d="M160,58 L230,58"
                color={C.async}
                label="202 즉시 반환"
                lx={195}
                ly={48}
                animate
              />
              <Arrow d="M390,58 L460,58" color={C.async} animate />
              <Arrow
                d="M500,86 C480,130 420,150 400,160"
                color={C.err}
                label="3회 실패 후"
                lx={430}
                ly={128}
                dash
              />
              <Arrow
                d="M545,86 L552,160"
                color={C.ok}
                label="성공 시"
                lx={585}
                ly={128}
                dash
              />
              <text
                x={360}
                y={245}
                textAnchor="middle"
                fill={C.muted}
                fontSize={12}
              >
                기본 재시도 2회 (총 3회 시도) → 그래도 실패하면
                DLQ/Destination으로
              </text>
            </Svg>
            <P>
              이벤트가 <b>내부 큐에 적재되고 호출자는 즉시 202를 받습니다</b>.
              실패 시 Lambda가{" "}
              <b style={{ color: C.async }}>자동으로 2회 재시도</b>(총
              3회)하므로 함수는 <b>멱등(idempotent)</b>하게 설계해야 합니다.
            </P>
            <Hint>
              DLQ는 실패 이벤트만 SQS/SNS로 보내지만, <b>Destinations</b>는
              성공/실패 모두 지원하고 더 풍부한 컨텍스트를 담아{" "}
              <b>AWS가 권장</b>합니다. "비동기 실패 이벤트 처리" 문제의 단골
              정답.
            </Hint>
          </>
        )}

        {mode === "poll" && (
          <>
            <Svg vb="0 0 720 230">
              <Box
                x={20}
                y={60}
                w={160}
                h={64}
                label="SQS · Kinesis"
                sub="DynamoDB Streams"
                color={C.poll}
              />
              <Box
                x={280}
                y={60}
                w={180}
                h={64}
                label="Event Source Mapping"
                sub="Lambda가 대신 폴링"
                color={C.poll}
                dashed
              />
              <Box
                x={540}
                y={60}
                w={150}
                h={64}
                label="λ Lambda"
                sub="배치 단위 동기 호출"
                color={C.orange}
              />
              <Arrow
                d="M280,80 L180,80"
                color={C.poll}
                label="poll"
                lx={230}
                ly={70}
                animate
              />
              <Arrow
                d="M180,105 L280,105"
                color={C.poll}
                label="배치(레코드 묶음)"
                lx={230}
                ly={125}
                animate
              />
              <Arrow d="M460,92 L540,92" color={C.orange} animate />
              <text
                x={360}
                y={185}
                textAnchor="middle"
                fill={C.muted}
                fontSize={12}
              >
                SQS: 성공한 메시지 삭제 · Kinesis/DDB Streams: 샤드 순서 보장,
                성공할 때까지 재시도
              </text>
            </Svg>
            <P>
              큐/스트림은 Lambda를 직접 호출하지 못하므로,{" "}
              <b>ESM(Event Source Mapping)</b>이 Lambda 서비스 쪽에서{" "}
              <b>폴링</b>해 레코드를 배치로 가져와 함수를 동기 호출합니다. 이때
              실행 역할에 <b>소스를 읽을 권한</b>(예: sqs:ReceiveMessage)이
              필요합니다.
            </P>
            <P>
              Kinesis/DynamoDB Streams는 <b>샤드당 순서가 보장</b>되고, 에러
              레코드가 있으면 <b>배치가 성공하거나 만료될 때까지 재시도</b>되어
              해당 샤드가 막힐 수 있습니다 → 해결책:{" "}
              <Tag color={C.poll}>Bisect batch on error</Tag>{" "}
              <Tag color={C.poll}>최대 재시도 횟수 제한</Tag>{" "}
              <Tag color={C.poll}>실패 시 SQS/SNS로 보내기</Tag>
            </P>
          </>
        )}
      </Card>

      <Card title="세 방식 비교표" accent={C.orangeSoft}>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
              minWidth: 560,
            }}
          >
            <thead>
              <tr>
                {["구분", "동기", "비동기", "폴링 (ESM)"].map((h, i) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "8px 10px",
                      color: [C.muted, C.sync, C.async, C.poll][i],
                      borderBottom: `2px solid ${C.border}`,
                      fontFamily: mono,
                      fontSize: 12,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "대표 소스",
                  "API GW, ALB, Cognito",
                  "S3, SNS, EventBridge",
                  "SQS, Kinesis, DDB Streams",
                ],
                [
                  "재시도",
                  "없음 (호출자 책임)",
                  "2회 자동 재시도",
                  "소스 유형별 (스트림은 만료까지)",
                ],
                [
                  "에러 처리",
                  "즉시 에러 반환",
                  "DLQ / Destinations",
                  "Bisect, DLQ, 재시도 제한",
                ],
                ["응답", "결과 반환", "202 Accepted", "배치 처리 결과"],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (
                    <td
                      key={i}
                      style={{
                        padding: "9px 10px",
                        color: i === 0 ? C.muted : C.text,
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

// ═══════════════ TAB 4: 동시성 ═══════════════
function TabConcurrency() {
  const [reserved, setReserved] = useState(200);
  const total = 1000;
  const otherPool = total - reserved;

  return (
    <>
      <Card title="동시성(Concurrency) 기본 개념">
        <P>
          동시성 = <b>같은 순간에 실행 중인 실행 환경의 개수</b>. 요청이 몰리면
          Lambda는 환경을 여러 개 띄워 자동 확장합니다. 리전당 계정 전체 기본
          한도는 <b style={{ color: C.orange }}>1,000</b>(소프트 리밋)이며,
          한도를 넘으면 <b style={{ color: C.err }}>스로틀(Throttle)</b>이
          발생합니다.
        </P>
        <P>
          스로틀 시 — 동기 호출:{" "}
          <Tag color={C.err}>429 TooManyRequestsException</Tag> 반환, 비동기
          호출: 최대 <b>6시간</b> 동안 자동 재시도.
        </P>
      </Card>

      <Card title="예약된 동시성 — 슬라이더로 풀 나눠보기" accent={C.poll}>
        <P>
          <b>Reserved Concurrency</b>: 특정 함수에 동시성을 떼어 놓습니다. 이
          값은 <b>보장(최소)이자 상한(최대)</b> 역할을 동시에 하며, 무료입니다.
        </P>
        <input
          type="range"
          min={0}
          max={900}
          step={50}
          value={reserved}
          onChange={(e) => setReserved(Number(e.target.value))}
          style={{ width: "100%", accentColor: C.orange }}
        />
        <div
          style={{
            display: "flex",
            height: 54,
            borderRadius: 8,
            overflow: "hidden",
            border: `1px solid ${C.border}`,
            marginTop: 10,
          }}
        >
          <div
            style={{
              width: `${(reserved / total) * 100}%`,
              background: `${C.orange}33`,
              borderRight: `2px solid ${C.orange}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 0,
              transition: "width .2s",
            }}
          >
            <span
              style={{
                fontFamily: mono,
                fontSize: 12,
                color: C.orange,
                whiteSpace: "nowrap",
              }}
            >
              중요 함수 A: {reserved}
            </span>
          </div>
          <div
            style={{
              flex: 1,
              background: `${C.poll}18`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontFamily: mono, fontSize: 12, color: C.poll }}>
              나머지 모든 함수 공유 풀: {otherPool}
            </span>
          </div>
        </div>
        <P>
          함수 A는 트래픽이 폭주해도{" "}
          <b style={{ color: C.orange }}>{reserved}</b>을 넘지 못하고(상한),
          다른 함수들이 아무리 바빠도{" "}
          <b style={{ color: C.orange }}>{reserved}</b>은 A를 위해 남아
          있습니다(보장). 반대로 나머지 함수 전체는 {otherPool}을 나눠 씁니다.
        </P>
        <Hint>
          "한 함수의 폭주가 다른 함수를 스로틀시킨다" 시나리오 → 예약된
          동시성으로 격리하는 것이 정답 패턴입니다.
        </Hint>
      </Card>

      <Card title="Reserved vs Provisioned" accent={C.async}>
        <Svg vb="0 0 720 170">
          <Box x={30} y={30} w={310} h={110} label="" color={C.orange} dashed />
          <text
            x={185}
            y={55}
            textAnchor="middle"
            fill={C.orange}
            fontSize={13}
            fontWeight={700}
          >
            Reserved Concurrency
          </text>
          <text
            x={185}
            y={80}
            textAnchor="middle"
            fill={C.text}
            fontSize={11.5}
          >
            동시성 "몫"을 확보/제한
          </text>
          <text
            x={185}
            y={100}
            textAnchor="middle"
            fill={C.muted}
            fontSize={11.5}
          >
            콜드 스타트는 그대로 발생
          </text>
          <text
            x={185}
            y={120}
            textAnchor="middle"
            fill={C.ok}
            fontSize={11.5}
            fontFamily={mono}
          >
            무료
          </text>
          <Box x={380} y={30} w={310} h={110} label="" color={C.async} dashed />
          <text
            x={535}
            y={55}
            textAnchor="middle"
            fill={C.async}
            fontSize={13}
            fontWeight={700}
          >
            Provisioned Concurrency
          </text>
          <text
            x={535}
            y={80}
            textAnchor="middle"
            fill={C.text}
            fontSize={11.5}
          >
            환경을 미리 초기화(웜 상태 유지)
          </text>
          <text
            x={535}
            y={100}
            textAnchor="middle"
            fill={C.muted}
            fontSize={11.5}
          >
            콜드 스타트 제거 · Application Auto Scaling 연동
          </text>
          <text
            x={535}
            y={120}
            textAnchor="middle"
            fill={C.err}
            fontSize={11.5}
            fontFamily={mono}
          >
            유료 · 버전/별칭에만 설정
          </text>
        </Svg>
      </Card>
    </>
  );
}

// ═══════════════ TAB 5: 배포 (버전/별칭/레이어) ═══════════════
function TabDeploy() {
  const [weight, setWeight] = useState(10);
  return (
    <>
      <Card title="버전(Version)과 별칭(Alias)">
        <P>
          <b>버전</b>: 코드+설정의 <b>불변(immutable) 스냅샷</b>. 게시하면 v1,
          v2… 번호가 붙고 고유 ARN을 가집니다.{" "}
          <Tag color={C.orange}>$LATEST</Tag>만 수정 가능한 최신 코드입니다.{" "}
          <b>별칭</b>: 특정 버전을 가리키는 <b>이동 가능한 포인터</b>(prod, dev
          등). 별칭이 별칭을 가리킬 수는 없습니다.
        </P>
      </Card>

      <Card
        title="가중치 별칭으로 카나리 배포 — 직접 조절해 보세요"
        accent={C.ok}
      >
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          style={{ width: "100%", accentColor: C.ok }}
        />
        <Svg vb="0 0 720 210">
          <Box
            x={30}
            y={75}
            w={150}
            h={60}
            label='별칭 "prod"'
            sub="트래픽 분배"
            color={C.orange}
          />
          <Box
            x={470}
            y={20}
            w={200}
            h={60}
            label="버전 1 (기존)"
            sub={`${100 - weight}% 트래픽`}
            color={C.sync}
          />
          <Box
            x={470}
            y={130}
            w={200}
            h={60}
            label="버전 2 (신규)"
            sub={`${weight}% 트래픽`}
            color={C.ok}
          />
          <Arrow
            d="M180,95 C330,90 340,55 470,50"
            color={C.sync}
            animate={weight < 100}
          />
          <Arrow
            d="M180,115 C330,120 340,155 470,160"
            color={C.ok}
            animate={weight > 0}
          />
          <text
            x={310}
            y={60}
            textAnchor="middle"
            fill={C.sync}
            fontSize={13}
            fontFamily={mono}
            fontWeight={700}
          >
            {100 - weight}%
          </text>
          <text
            x={310}
            y={155}
            textAnchor="middle"
            fill={C.ok}
            fontSize={13}
            fontFamily={mono}
            fontWeight={700}
          >
            {weight}%
          </text>
        </Svg>
        <P>
          새 버전에 트래픽 일부만 흘려 검증하는 <b>카나리(Canary) 배포</b>{" "}
          패턴입니다. 가중치는 <b>최대 2개 버전</b> 사이에서만 나눌 수 있으며,
          CodeDeploy와 연동하면 <Tag color={C.ok}>Canary</Tag>{" "}
          <Tag color={C.ok}>Linear</Tag> <Tag color={C.ok}>All-at-once</Tag>{" "}
          방식의 자동 트래픽 전환 + 자동 롤백이 가능합니다.
        </P>
        <Hint>
          "$LATEST에 가중치/프로비저닝 동시성 설정" 은 함정 — 게시된{" "}
          <b>버전 또는 별칭</b>에만 가능합니다.
        </Hint>
      </Card>

      <Card title="레이어(Layers)와 패키지 한도" accent={C.async}>
        <Svg vb="0 0 720 190">
          <rect
            x={230}
            y={20}
            width={260}
            height={40}
            rx={8}
            fill={`${C.orange}22`}
            stroke={C.orange}
          />
          <text
            x={360}
            y={45}
            textAnchor="middle"
            fill={C.text}
            fontSize={12.5}
          >
            함수 코드 (비즈니스 로직)
          </text>
          <rect
            x={230}
            y={68}
            width={260}
            height={36}
            rx={8}
            fill={`${C.async}22`}
            stroke={C.async}
          />
          <text
            x={360}
            y={91}
            textAnchor="middle"
            fill={C.text}
            fontSize={12.5}
          >
            Layer 1 — 공통 라이브러리
          </text>
          <rect
            x={230}
            y={112}
            width={260}
            height={36}
            rx={8}
            fill={`${C.async}22`}
            stroke={C.async}
          />
          <text
            x={360}
            y={135}
            textAnchor="middle"
            fill={C.text}
            fontSize={12.5}
          >
            Layer 2 — 커스텀 런타임 등
          </text>
          <text
            x={360}
            y={172}
            textAnchor="middle"
            fill={C.muted}
            fontSize={11.5}
            fontFamily={mono}
          >
            최대 5개 레이어 · 함수+레이어 합산 250MB(압축 해제)
          </text>
        </Svg>
        <P>
          레이어는 <b>여러 함수가 공유하는 코드/의존성</b>을 분리해 배포
          패키지를 줄이고 재사용성을 높입니다. 더 큰 이미지가 필요하면{" "}
          <b>컨테이너 이미지(최대 10GB)</b>로 배포합니다.
        </P>
      </Card>
    </>
  );
}

// ═══════════════ TAB 6: 권한 & 통합 ═══════════════
function TabSecurity() {
  return (
    <>
      <Card title="두 방향의 권한 — 가장 많이 출제되는 개념">
        <Svg vb="0 0 720 240">
          <Box
            x={280}
            y={85}
            w={160}
            h={70}
            label="λ Lambda"
            color={C.orange}
          />
          <Box
            x={30}
            y={90}
            w={150}
            h={60}
            label="S3 · SNS 등"
            sub="호출하는 쪽"
            color={C.async}
          />
          <Box
            x={540}
            y={90}
            w={150}
            h={60}
            label="DynamoDB 등"
            sub="접근당하는 쪽"
            color={C.ok}
          />
          <Arrow d="M180,120 L280,120" color={C.async} animate />
          <Arrow d="M440,120 L540,120" color={C.ok} animate />
          <text
            x={228}
            y={95}
            textAnchor="middle"
            fill={C.async}
            fontSize={11.5}
            fontFamily={mono}
            fontWeight={700}
          >
            리소스 기반 정책
          </text>
          <text
            x={228}
            y={160}
            textAnchor="middle"
            fill={C.muted}
            fontSize={10.5}
          >
            "누가 나를 호출할 수 있나"
          </text>
          <text
            x={492}
            y={95}
            textAnchor="middle"
            fill={C.ok}
            fontSize={11.5}
            fontFamily={mono}
            fontWeight={700}
          >
            실행 역할 (IAM Role)
          </text>
          <text
            x={492}
            y={160}
            textAnchor="middle"
            fill={C.muted}
            fontSize={10.5}
          >
            "내가 무엇에 접근할 수 있나"
          </text>
          <text
            x={360}
            y={215}
            textAnchor="middle"
            fill={C.faint}
            fontSize={11.5}
          >
            화살표 방향으로 기억하세요: 들어오는 권한 = 리소스 정책, 나가는 권한
            = 실행 역할
          </text>
        </Svg>
        <P>
          <b style={{ color: C.ok }}>실행 역할(Execution Role)</b>: 함수가
          CloudWatch Logs에 쓰고 DynamoDB를 읽는 등 <b>나가는 방향</b>의 권한.{" "}
          <b style={{ color: C.async }}>
            리소스 기반 정책(Resource-based Policy)
          </b>
          : S3나 다른 계정이 이 함수를 <b>호출할 수 있게 허용</b>하는 들어오는
          방향의 권한(교차 계정 호출 포함).
        </P>
        <Hint>
          "S3 이벤트로 Lambda가 호출되지 않는다" → 리소스 기반 정책 확인.
          "Lambda가 DynamoDB에 쓰지 못한다" → 실행 역할 확인. 단,{" "}
          <b>폴링(SQS 등)은 예외적으로 실행 역할에 읽기 권한</b>이 필요합니다.
        </Hint>
      </Card>

      <Card title="VPC 연결" accent={C.poll}>
        <Svg vb="0 0 720 210">
          <rect
            x={30}
            y={20}
            width={480}
            height={170}
            rx={10}
            fill="none"
            stroke={C.poll}
            strokeDasharray="6 5"
          />
          <text x={50} y={45} fill={C.poll} fontSize={12} fontFamily={mono}>
            VPC (프라이빗 서브넷)
          </text>
          <Box
            x={60}
            y={70}
            w={150}
            h={60}
            label="λ + ENI"
            sub="탄력적 네트워크 인터페이스"
            color={C.orange}
          />
          <Box
            x={300}
            y={70}
            w={170}
            h={60}
            label="RDS (프라이빗)"
            color={C.ok}
          />
          <Box
            x={560}
            y={40}
            w={130}
            h={54}
            label="인터넷"
            color={C.err}
            dashed
          />
          <Box
            x={560}
            y={130}
            w={130}
            h={54}
            label="NAT GW 경유"
            sub="인터넷 필요 시"
            color={C.poll}
          />
          <Arrow d="M210,100 L300,100" color={C.ok} animate />
          <Arrow d="M210,120 C420,175 480,157 560,157" color={C.poll} dash />
          <line
            x1={510}
            y1={67}
            x2={560}
            y2={67}
            stroke={C.err}
            strokeWidth={1.8}
            strokeDasharray="3 4"
          />
          <text
            x={533}
            y={58}
            textAnchor="middle"
            fill={C.err}
            fontSize={14}
            fontWeight={700}
          >
            ✕
          </text>
        </Svg>
        <P>
          VPC 내 RDS 등에 접근하려면 함수를 VPC에 연결합니다(ENI 생성 →{" "}
          <Tag color={C.poll}>AWSLambdaVPCAccessExecutionRole</Tag> 필요). 이때{" "}
          <b style={{ color: C.err }}>기본적으로 인터넷 접근이 사라지므로</b>,
          필요하면 프라이빗 서브넷 + <b>NAT Gateway</b>를 사용하거나 AWS
          서비스는 VPC 엔드포인트로 접근합니다.
        </P>
      </Card>

      <Card title="모니터링 · 추적" accent={C.orangeSoft}>
        <P>
          <b>CloudWatch Logs</b>: 실행 역할에 로그 권한(
          <Tag color={C.orange}>AWSLambdaBasicExecutionRole</Tag>)이 있어야
          로그가 남습니다. <b>X-Ray</b>: Active Tracing 활성화 시 분산 추적 가능
          — 환경 변수 <Tag color={C.poll}>_X_AMZN_TRACE_ID</Tag>{" "}
          <Tag color={C.poll}>AWS_XRAY_DAEMON_ADDRESS</Tag>가 시험에 등장합니다.
          환경 변수 암호화는 <b>KMS</b>, 시크릿 관리는{" "}
          <b>Secrets Manager / SSM Parameter Store</b>를 사용합니다.
        </P>
      </Card>
    </>
  );
}

// ═══════════════ TAB 7: 시험 핵심 요약 ═══════════════
function TabExam() {
  const rows = [
    [
      "실행 시간",
      "최대 900초(15분), 기본 3초",
      "장기 작업 → Step Functions/ECS",
    ],
    ["메모리", "128MB~10,240MB, CPU 비례", "성능 개선 = 메모리 증가"],
    ["1,769MB", "vCPU 1개와 동등", "CPU 바운드 작업 기준점"],
    ["/tmp", "512MB 기본, 최대 10GB", "임시 파일, 웜 환경에서 유지될 수 있음"],
    ["환경 변수", "합산 4KB", "큰 설정 → SSM/Secrets Manager"],
    [
      "패키지",
      "zip 50MB / 해제 250MB / 이미지 10GB",
      "초과 시 레이어·컨테이너·S3 업로드",
    ],
    ["동시성", "계정·리전당 1,000 (소프트)", "초과 시 429 스로틀"],
    ["비동기 재시도", "2회 (총 3회 시도)", "멱등성 설계 + Destinations"],
    ["별칭 가중치", "버전 2개까지 분배", "카나리 배포"],
    ["레이어", "함수당 최대 5개", "공통 의존성 재사용"],
  ];
  return (
    <>
      <Card title="숫자 암기표">
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
              minWidth: 560,
            }}
          >
            <thead>
              <tr>
                {["항목", "값", "시험에서의 활용"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "8px 10px",
                      color: C.orange,
                      borderBottom: `2px solid ${C.border}`,
                      fontFamily: mono,
                      fontSize: 12,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r[0]}>
                  <td
                    style={{
                      padding: "9px 10px",
                      color: C.orangeSoft,
                      fontFamily: mono,
                      fontSize: 12.5,
                      borderBottom: `1px solid ${C.border}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r[0]}
                  </td>
                  <td
                    style={{
                      padding: "9px 10px",
                      color: C.text,
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    {r[1]}
                  </td>
                  <td
                    style={{
                      padding: "9px 10px",
                      color: C.muted,
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    {r[2]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="자주 나오는 시나리오 → 정답 패턴" accent={C.ok}>
        {[
          [
            "콜드 스타트로 API 지연",
            "Provisioned Concurrency (버전/별칭에 설정)",
          ],
          [
            "한 함수 폭주가 다른 함수 스로틀 유발",
            "Reserved Concurrency로 격리",
          ],
          [
            "비동기 실패 이벤트 분석 필요",
            "Lambda Destinations (DLQ보다 권장)",
          ],
          ["S3 이벤트가 함수를 못 부름", "리소스 기반 정책 부재"],
          ["VPC 함수가 인터넷 접근 불가", "프라이빗 서브넷 + NAT Gateway"],
          [
            "Kinesis 처리 중 불량 레코드가 샤드 블로킹",
            "Bisect batch on error + 재시도 제한 + 실패 대상 지정",
          ],
          ["안전한 점진 배포", "가중치 별칭 + CodeDeploy (Canary/Linear)"],
          [
            "DB 연결이 호출마다 생성돼 느림",
            "핸들러 밖(전역)에서 연결 초기화 / RDS Proxy",
          ],
          [
            "시크릿을 코드에 하드코딩",
            "Secrets Manager 또는 SSM Parameter Store + KMS",
          ],
        ].map(([q, a]) => (
          <div
            key={q}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "baseline",
              padding: "9px 0",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <span
              style={{ color: C.muted, fontSize: 13, flex: 1.3, minWidth: 180 }}
            >
              {q}
            </span>
            <span style={{ color: C.faint }}>→</span>
            <span
              style={{ color: C.ok, fontSize: 13, fontWeight: 600, flex: 1 }}
            >
              {a}
            </span>
          </div>
        ))}
      </Card>
    </>
  );
}

// ═══════════════ Root ═══════════════
export default function LambdaDVAGuide() {
  const tabs = [
    { id: "overview", label: "1. 개요", comp: <TabOverview /> },
    {
      id: "lifecycle",
      label: "2. 실행환경·콜드스타트",
      comp: <TabLifecycle />,
    },
    { id: "invoke", label: "3. 호출 방식 ★", comp: <TabInvocation /> },
    { id: "concurrency", label: "4. 동시성", comp: <TabConcurrency /> },
    { id: "deploy", label: "5. 버전·별칭·배포", comp: <TabDeploy /> },
    { id: "security", label: "6. 권한·VPC·모니터링", comp: <TabSecurity /> },
    { id: "exam", label: "7. 시험 핵심 요약", comp: <TabExam /> },
  ];
  const [tab, setTab] = useState("overview");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        padding: "28px 16px 60px",
        fontFamily:
          "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <header style={{ marginBottom: 24 }}>
          <div
            style={{
              fontFamily: mono,
              fontSize: 12,
              color: C.poll,
              letterSpacing: 2,
            }}
          >
            AWS CERTIFIED DEVELOPER — ASSOCIATE (DVA-C02)
          </div>
          <h1
            style={{
              color: C.text,
              fontSize: 30,
              margin: "8px 0 6px",
              fontWeight: 800,
            }}
          >
            <span style={{ color: C.orange, fontFamily: mono }}>λ</span> AWS
            Lambda 완전 정복
          </h1>
          <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>
            다이어그램으로 이해하는 서버리스 핵심 — 탭을 눌러 주제별로
            탐색하세요.
          </p>
        </header>

        <nav
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            marginBottom: 22,
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                cursor: "pointer",
                fontSize: 12.5,
                fontFamily: mono,
                padding: "8px 13px",
                borderRadius: 999,
                border: `1.5px solid ${tab === t.id ? C.orange : C.border}`,
                background: tab === t.id ? `${C.orange}1E` : "transparent",
                color: tab === t.id ? C.orange : C.muted,
                fontWeight: tab === t.id ? 700 : 400,
              }}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tabs.find((t) => t.id === tab).comp}

        <footer
          style={{
            color: C.faint,
            fontSize: 11.5,
            fontFamily: mono,
            marginTop: 30,
            textAlign: "center",
          }}
        >
          λ 수치·한도는 시험(DVA-C02) 기준 대표값입니다 — 최신 값은 AWS 공식
          문서로 확인하세요.
        </footer>
      </div>
    </div>
  );
}
