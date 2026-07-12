//fable 5 high
import { useState } from "react";

/* ────────────────────────────────────────────────
   AWS DVA-C02 · Section: 통합 및 메시징 (SQS / SNS / Kinesis)
   실습(핸즈온) 강의 제외, 이론 전체 + 다이어그램 + 빈출도
──────────────────────────────────────────────── */

const P = {
  bg: "#0D1220", panel: "#161F33", soft: "#1D2A44", line: "#2B3A5C",
  text: "#E9EEF8", sub: "#9AAAC6", faint: "#6B7A99",
  orange: "#FF9900", sqs: "#FF4F8B", sns: "#E7157B", kin: "#A166FF",
  s3: "#7AA116", cmp: "#ED7100", green: "#3FB68B", red: "#F0556D",
  yellow: "#F2C744", blue: "#57A0FF", gray: "#8C9BB8",
};

const MK = {
  [P.gray]: "m1", [P.orange]: "m2", [P.sqs]: "m3", [P.green]: "m4",
  [P.red]: "m5", [P.blue]: "m6", [P.kin]: "m7", [P.yellow]: "m8",
  [P.sns]: "m9", [P.s3]: "m10", [P.cmp]: "m11",
};

const Defs = () => (
  <defs>
    {Object.entries(MK).map(([c, id]) => (
      <marker key={id} id={id} viewBox="0 0 10 10" refX="8.5" refY="5"
        markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill={c} />
      </marker>
    ))}
  </defs>
);

const Svg = ({ vb, title, children, maxW }) => (
  <div className="dgm" style={maxW ? { maxWidth: maxW } : null}>
    {title && <div className="dgm-title">{title}</div>}
    <svg viewBox={vb} style={{ width: "100%", height: "auto", display: "block" }}>
      <Defs />
      {children}
    </svg>
  </div>
);

const Node = ({ x, y, w = 120, h = 56, label, sub, c = P.gray, solid }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx="10"
      fill={solid ? c : c + "1E"} stroke={c} strokeWidth="1.6" />
    <text x={x + w / 2} y={y + h / 2 + (sub ? -3 : 5)} textAnchor="middle"
      fill={solid ? "#0D1220" : P.text} fontSize="13" fontWeight="700">{label}</text>
    {sub && <text x={x + w / 2} y={y + h / 2 + 15} textAnchor="middle"
      fill={solid ? "#0D1220" : P.sub} fontSize="10">{sub}</text>}
  </g>
);

const Arr = ({ d, x1, y1, x2, y2, c = P.gray, label, lx, ly, dash, w = 2, noHead }) => {
  const path = d || ("M" + x1 + "," + y1 + " L" + x2 + "," + y2);
  return (
    <g>
      <path d={path} fill="none" stroke={c} strokeWidth={w}
        strokeDasharray={dash ? "6 5" : "none"}
        markerEnd={noHead ? undefined : "url(#" + (MK[c] || "m1") + ")"} />
      {label && <text x={lx} y={ly} fontSize="11" fill={c}
        textAnchor="middle" fontWeight="600">{label}</text>}
    </g>
  );
};

const T = ({ x, y, children, c = P.sub, size = 11, w = 400, anchor = "middle", bold }) => (
  <text x={x} y={y} fontSize={size} fill={c} textAnchor={anchor}
    fontWeight={bold ? 700 : 500}>{children}</text>
);

/* ── UI 헬퍼 ── */

const Freq = ({ n }) => {
  const labels = ["", "낮음", "가끔 출제", "종종 출제", "자주 출제", "최빈출"];
  const cols = ["", P.faint, P.blue, P.green, P.yellow, P.orange];
  return (
    <span className="freq" style={{ color: cols[n], borderColor: cols[n] + "55" }}>
      <span className="stars">{"★".repeat(n)}<span style={{ opacity: 0.25 }}>{"★".repeat(5 - n)}</span></span>
      시험 빈출도 · {labels[n]}
    </span>
  );
};

const Callout = ({ type = "tip", title, children }) => {
  const map = {
    tip: { c: P.green, icon: "💡", t: "핵심 포인트" },
    exam: { c: P.orange, icon: "🎯", t: "시험 포인트" },
    warn: { c: P.red, icon: "⚠️", t: "주의" },
    info: { c: P.blue, icon: "ℹ️", t: "참고" },
  };
  const m = map[type];
  return (
    <div className="callout" style={{ borderColor: m.c + "66", background: m.c + "10" }}>
      <div className="callout-head" style={{ color: m.c }}>{m.icon} {title || m.t}</div>
      <div className="callout-body">{children}</div>
    </div>
  );
};

const KV = ({ rows }) => (
  <table className="kv">
    <tbody>
      {rows.map((r, i) => (
        <tr key={i}>
          <th>{r[0]}</th>
          <td>{r[1]}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const Cmp = ({ head, rows, colors }) => (
  <div className="cmp-wrap">
    <table className="cmp">
      <thead>
        <tr>{head.map((h, i) => (
          <th key={i} style={i > 0 && colors ? { color: colors[i - 1] } : null}>{h}</th>
        ))}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>{r.map((c, j) => j === 0 ? <th key={j}>{c}</th> : <td key={j}>{c}</td>)}</tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Code = ({ children }) => <code className="ic">{children}</code>;

const H3 = ({ children }) => <h3 className="h3">{children}</h3>;

/* ════════════════════════════════════════════════
   § 1. 메시징 소개
════════════════════════════════════════════════ */

const DgSyncAsync = () => (
  <Svg vb="0 0 760 300" title="동기(Synchronous) vs 비동기(Asynchronous) 통신">
    <T x={190} y={26} c={P.red} size={13} bold>① 동기 — 애플리케이션 간 직접 연결</T>
    <Node x={40} y={50} label="구매 서비스" c={P.blue} />
    <Node x={230} y={50} label="배송 서비스" c={P.blue} />
    <Arr x1={162} y1={78} x2={228} y2={78} c={P.red} label="직접 호출" lx={195} ly={70} />
    <T x={190} y={140} size={11} c={P.red}>트래픽 급증 시 수신 측이 과부하로</T>
    <T x={190} y={156} size={11} c={P.red}>함께 장애 발생 (강한 결합)</T>
    <T x={190} y={186} size={11} c={P.sub}>예) 평소 10건/s 인코딩 요청이</T>
    <T x={190} y={202} size={11} c={P.sub}>갑자기 1,000건/s로 폭증하면?</T>

    <line x1={400} y1={20} x2={400} y2={280} stroke={P.line} strokeDasharray="4 6" />

    <T x={580} y={26} c={P.green} size={13} bold>② 비동기 — 큐/토픽으로 분리(Decouple)</T>
    <Node x={430} y={50} w={100} label="구매 서비스" c={P.blue} />
    <Node x={560} y={50} w={90} h={56} label="SQS 큐" sub="버퍼" c={P.sqs} />
    <Node x={680} y={50} w={70} label="배송" c={P.blue} />
    <Arr x1={532} y1={78} x2={558} y2={78} c={P.green} />
    <Arr x1={652} y1={78} x2={678} y2={78} c={P.green} />
    <T x={590} y={140} size={11} c={P.green}>서비스가 서로를 기다리지 않음</T>
    <T x={590} y={156} size={11} c={P.green}>각자 독립적으로 확장 가능</T>
    <T x={590} y={186} size={11} c={P.sub}>급증한 요청은 큐에 쌓이고,</T>
    <T x={590} y={202} size={11} c={P.sub}>컨슈머는 자기 속도로 처리</T>
  </Svg>
);

const DgThreeServices = () => (
  <Svg vb="0 0 760 250" title="AWS의 3가지 메시징 패턴">
    <Node x={30} y={95} w={110} h={60} label="애플리케이션" c={P.blue} />

    <Node x={300} y={20} w={150} h={54} label="Amazon SQS" sub="큐(Queue) 모델" c={P.sqs} />
    <Node x={300} y={98} w={150} h={54} label="Amazon SNS" sub="Pub/Sub 모델" c={P.sns} />
    <Node x={300} y={176} w={150} h={54} label="Amazon Kinesis" sub="실시간 스트리밍" c={P.kin} />

    <Arr x1={142} y1={110} x2={296} y2={47} c={P.sqs} />
    <Arr x1={142} y1={125} x2={296} y2={125} c={P.sns} />
    <Arr x1={142} y1={140} x2={296} y2={203} c={P.kin} />

    <T x={600} y={40} size={12} c={P.sqs} bold>1:1 소비 · 컨슈머가 가져가서 삭제</T>
    <T x={600} y={58} size={11} c={P.sub}>워크로드 분리, 버퍼링</T>
    <T x={600} y={118} size={12} c={P.sns} bold>1:N 브로드캐스트 · 푸시 방식</T>
    <T x={600} y={136} size={11} c={P.sub}>이벤트 알림, 팬아웃</T>
    <T x={600} y={196} size={12} c={P.kin} bold>대용량 실시간 데이터 스트림</T>
    <T x={600} y={214} size={11} c={P.sub}>로그, 클릭스트림, IoT, 분석</T>
  </Svg>
);

const SecIntro = () => (
  <>
    <p className="lead">
      여러 애플리케이션을 배포하면 서로 정보를 주고받으며 통신해야 합니다.
      통신 방식은 크게 두 가지입니다 — <b>동기 통신</b>(앱 → 앱 직접 호출)과{" "}
      <b>비동기/이벤트 기반 통신</b>(앱 → 큐 → 앱).
    </p>
    <DgSyncAsync />
    <H3>왜 비동기(디커플링)인가?</H3>
    <ul className="ul">
      <li>동기 통신은 <b>갑작스러운 트래픽 스파이크</b>에 취약합니다. 예를 들어 평소 초당 10개의
        동영상 인코딩 요청이 갑자기 1,000개로 늘면, 인코딩 서비스가 그대로 과부하에 빠집니다.</li>
      <li>애플리케이션을 <b>분리(decouple)</b>하면 각 계층이 <b>독립적으로 확장</b>될 수 있고,
        한쪽 장애가 다른 쪽으로 전파되지 않습니다.</li>
      <li>큐/토픽/스트림이 중간에서 <b>버퍼</b> 역할을 하므로 급증한 요청도 유실 없이 처리됩니다.</li>
    </ul>
    <DgThreeServices />
    <Callout type="exam">
      시험에서 "애플리케이션 계층을 분리하고 싶다", "트래픽 급증을 버퍼링하고 싶다"라는
      문구가 나오면 거의 항상 <b>SQS</b>가 정답 후보입니다. "여러 대상에게 동일한 메시지를
      보내야 한다" → <b>SNS(팬아웃)</b>, "실시간 대용량 스트림 분석/리플레이" → <b>Kinesis</b>로 매핑하세요.
    </Callout>
  </>
);

/* ════════════════════════════════════════════════
   § 2. SQS 표준 큐 개요
════════════════════════════════════════════════ */

const DgSqsBasic = () => (
  <Svg vb="0 0 760 260" title="SQS 기본 구조 — 프로듀서 / 큐 / 컨슈머">
    <Node x={20} y={40} w={110} h={50} label="프로듀서 1" c={P.blue} />
    <Node x={20} y={110} w={110} h={50} label="프로듀서 2" c={P.blue} />
    <Node x={20} y={180} w={110} h={50} label="프로듀서 3" c={P.blue} />

    <rect x={230} y={70} width={280} height={120} rx="14" fill={P.sqs + "14"} stroke={P.sqs} strokeWidth="1.8" />
    <T x={370} y={95} c={P.sqs} size={13} bold>SQS 표준 큐</T>
    {[0, 1, 2, 3, 4].map(i => (
      <rect key={i} x={260 + i * 44} y={115} width={34} height={44} rx="6"
        fill={P.sqs + "35"} stroke={P.sqs} />
    ))}
    <T x={370} y={145} c={P.text} size={12} bold>메시지 (최대 256KB)</T>

    <Node x={600} y={40} w={130} h={50} label="컨슈머 1" sub="EC2 / Lambda" c={P.cmp} />
    <Node x={600} y={110} w={130} h={50} label="컨슈머 2" c={P.cmp} />
    <Node x={600} y={180} w={130} h={50} label="컨슈머 3" c={P.cmp} />

    <Arr x1={134} y1={65} x2={226} y2={100} c={P.sqs} label="SendMessage" lx={175} ly={62} />
    <Arr x1={134} y1={135} x2={226} y2={135} c={P.sqs} />
    <Arr x1={134} y1={205} x2={226} y2={170} c={P.sqs} />

    <Arr x1={514} y1={100} x2={596} y2={65} c={P.cmp} label="Poll (최대 10개)" lx={556} ly={60} />
    <Arr x1={514} y1={135} x2={596} y2={135} c={P.cmp} />
    <Arr x1={514} y1={170} x2={596} y2={205} c={P.cmp} label="처리 후 DeleteMessage" lx={545} ly={228} />
  </Svg>
);

const DgSqsScaling = () => (
  <Svg vb="0 0 760 260" title="패턴 ① SQS + Auto Scaling Group — 큐 길이에 따른 컨슈머 확장">
    <Node x={20} y={100} w={110} h={56} label="프로듀서" c={P.blue} />
    <Node x={190} y={100} w={130} h={56} label="SQS 큐" c={P.sqs} />
    <rect x={400} y={55} width={200} height={150} rx="14" fill={P.cmp + "10"} stroke={P.cmp} strokeDasharray="6 5" />
    <T x={500} y={78} c={P.cmp} size={12} bold>Auto Scaling Group</T>
    <Node x={420} y={92} w={72} h={40} label="EC2" c={P.cmp} />
    <Node x={508} y={92} w={72} h={40} label="EC2" c={P.cmp} />
    <Node x={420} y={148} w={72} h={40} label="EC2" c={P.cmp} />
    <Node x={508} y={148} w={72} h={40} label="EC2" c={P.cmp} />

    <Arr x1={134} y1={128} x2={186} y2={128} c={P.sqs} />
    <Arr x1={324} y1={128} x2={396} y2={128} c={P.cmp} label="Poll" lx={360} ly={120} />

    <Node x={230} y={200} w={230} h={44} label="CloudWatch 지표" sub="ApproximateNumberOfMessages" c={P.yellow} />
    <Arr d="M 255,158 C 255,180 265,195 285,200" c={P.yellow} dash />
    <Node x={550} y={215} w={180} h={40} label="CloudWatch 경보 → 스케일 아웃" c={P.red} />
    <Arr x1={464} y1={222} x2={546} y2={230} c={P.red} dash />
    <Arr d="M 640,213 C 650,190 630,180 605,175" c={P.red} dash />
  </Svg>
);

const DgSqsDecouple = () => (
  <Svg vb="0 0 760 240" title="패턴 ② 프론트/백엔드 분리 — 동영상 처리 예시">
    <T x={110} y={30} c={P.blue} size={12} bold>요청 수신 계층</T>
    <Node x={40} y={45} w={140} h={56} label="프론트엔드" sub="웹 앱 (ASG)" c={P.blue} />
    <Node x={290} y={45} w={150} h={56} label="SQS 큐" sub="작업 버퍼" c={P.sqs} />
    <T x={620} y={30} c={P.cmp} size={12} bold>무거운 처리 계층</T>
    <Node x={550} y={45} w={150} h={56} label="백엔드" sub="동영상 인코딩 (ASG)" c={P.cmp} />
    <Node x={550} y={150} w={150} h={52} label="Amazon S3" sub="결과 저장" c={P.s3} />

    <Arr x1={184} y1={73} x2={286} y2={73} c={P.sqs} label="작업 전송" lx={235} ly={65} />
    <Arr x1={444} y1={73} x2={546} y2={73} c={P.cmp} label="작업 폴링" lx={495} ly={65} />
    <Arr x1={625} y1={105} x2={625} y2={146} c={P.s3} />

    <T x={240} y={190} size={11} c={P.sub}>프론트엔드는 요청만 빠르게 접수하고 즉시 응답,</T>
    <T x={240} y={207} size={11} c={P.sub}>느린 인코딩 작업은 백엔드가 자기 속도로 처리.</T>
    <T x={240} y={224} size={11} c={P.sub}>두 계층은 서로 다른 인스턴스 타입·규모로 독립 확장 가능</T>
  </Svg>
);

const SecSqsOverview = () => (
  <>
    <p className="lead">
      Amazon SQS(Simple Queue Service)는 AWS에서 가장 오래된 서비스 중 하나(10년 이상)로,
      <b> 완전 관리형 메시지 큐</b>입니다. 애플리케이션 분리(decoupling)가 핵심 목적입니다.
    </p>
    <DgSqsBasic />
    <H3>표준 큐(Standard Queue)의 특성</H3>
    <KV rows={[
      ["처리량", "무제한 처리량, 큐에 담을 수 있는 메시지 수도 무제한"],
      ["메시지 보존", "기본 4일, 최소 1분 ~ 최대 14일"],
      ["메시지 크기", "메시지당 최대 256KB"],
      ["지연 시간", "매우 낮음 — 게시·수신 시 10ms 미만"],
      ["전달 보장", "최소 1회 전달(at-least-once) → 중복 메시지가 발생할 수 있음"],
      ["순서", "최선 노력 순서(best-effort ordering) → 순서가 어긋날 수 있음"],
    ]} />
    <Callout type="exam">
      표준 큐의 두 가지 "제약"은 시험 단골입니다 — <b>① 중복 가능(최소 1회 전달)</b>,
      <b> ② 순서 미보장(최선 노력)</b>. 이 두 가지가 문제 시나리오에서 요구되면
      정답은 <b>FIFO 큐</b>입니다.
    </Callout>
    <H3>메시지 생산과 소비</H3>
    <ul className="ul">
      <li><b>프로듀서</b>: <Code>SendMessage</Code> API(SDK)로 메시지를 큐에 전송.
        메시지는 삭제되기 전까지(또는 보존 기간 만료 전까지) 큐에 유지됩니다.
        예) 주문 처리 메시지 — 주문 ID, 고객 ID 등을 담아 전송.</li>
      <li><b>컨슈머</b>: EC2 인스턴스, 온프레미스 서버, 또는 AWS Lambda가 될 수 있습니다.
        큐를 <b>폴링</b>해서 한 번에 <b>최대 10개</b>의 메시지를 수신하고,
        처리(예: RDS에 삽입)가 끝나면 <Code>DeleteMessage</Code>로 큐에서 삭제합니다.</li>
      <li><b>다중 컨슈머</b>: 여러 컨슈머가 병렬로 폴링하며 서로 다른 메시지를 처리 →
        수평 확장으로 처리량을 높입니다.</li>
    </ul>
    <DgSqsScaling />
    <DgSqsDecouple />
    <H3>SQS 보안</H3>
    <ul className="ul">
      <li><b>전송 중 암호화</b>: HTTPS API 사용</li>
      <li><b>저장 시 암호화</b>: KMS 키 사용</li>
      <li><b>클라이언트 측 암호화</b>: 클라이언트가 직접 암호화/복호화를 수행하려는 경우</li>
      <li><b>액세스 제어</b>: IAM 정책으로 SQS API 접근 통제</li>
      <li><b>SQS 액세스 정책</b>(S3 버킷 정책과 유사): 교차 계정 액세스, 또는 다른 AWS 서비스(S3, SNS 등)가 큐에 쓰도록 허용할 때 유용</li>
    </ul>
  </>
);

/* ════════════════════════════════════════════════
   § 3. SQS 액세스 정책
════════════════════════════════════════════════ */

const DgCrossAccount = () => (
  <Svg vb="0 0 760 210" title="유스케이스 ① 교차 계정 액세스 (Cross-Account Access)">
    <rect x={30} y={40} width={280} height={140} rx="14" fill={P.blue + "0E"} stroke={P.blue} strokeDasharray="6 5" />
    <T x={170} y={64} c={P.blue} size={12} bold>계정 A (111122223333)</T>
    <Node x={90} y={85} w={160} h={62} label="SQS 큐" sub="+ 큐 액세스 정책" c={P.sqs} />

    <rect x={450} y={40} width={280} height={140} rx="14" fill={P.cmp + "0E"} stroke={P.cmp} strokeDasharray="6 5" />
    <T x={590} y={64} c={P.cmp} size={12} bold>계정 B (444455556666)</T>
    <Node x={520} y={85} w={140} h={62} label="EC2 인스턴스" c={P.cmp} />

    <Arr d="M 516,116 C 420,116 350,116 256,116" c={P.green} label="sqs:ReceiveMessage 허용" lx={385} ly={104} />
  </Svg>
);

const DgS3ToSqs = () => (
  <Svg vb="0 0 760 200" title="유스케이스 ② S3 이벤트 알림이 SQS에 메시지를 쓰도록 허용">
    <Node x={40} y={70} w={150} h={60} label="S3 버킷" sub="bucket1 (계정: 1234...)" c={P.s3} />
    <Node x={320} y={70} w={160} h={60} label="SQS 큐" sub="+ 액세스 정책 필요" c={P.sqs} />
    <Node x={590} y={70} w={130} h={60} label="컨슈머" c={P.cmp} />
    <Arr x1={194} y1={100} x2={316} y2={100} c={P.s3} label="이벤트 알림 (객체 업로드)" lx={255} ly={60} />
    <Arr x1={484} y1={100} x2={586} y2={100} c={P.cmp} label="Poll" lx={535} ly={92} />
    <T x={400} y={165} size={11} c={P.sub}>정책 조건: aws:SourceArn = 버킷 ARN, aws:SourceAccount = 버킷 소유 계정</T>
    <T x={400} y={182} size={11} c={P.sub}>→ 지정한 버킷만 이 큐에 SendMessage 가능</T>
  </Svg>
);

const SecAccessPolicy = () => (
  <>
    <p className="lead">
      SQS에 대한 접근 제어는 <b>IAM 정책</b>(자격 증명 기반)과 <b>SQS 액세스 정책</b>(리소스 기반,
      S3 버킷 정책과 유사)의 두 가지로 이뤄집니다. 액세스 정책이 특히 필요한 대표 상황 두 가지를 기억하세요.
    </p>
    <DgCrossAccount />
    <p>
      다른 계정의 EC2 인스턴스가 우리 큐를 폴링하게 하려면, 큐에 리소스 기반 정책을 붙여
      해당 계정(또는 역할)의 <Code>sqs:ReceiveMessage</Code> 등을 <b>Allow</b> 해야 합니다.
      정책의 <Code>Principal</Code>에 상대 계정 ID를 지정합니다.
    </p>
    <DgS3ToSqs />
    <p>
      S3 이벤트 알림을 SQS로 보내려면 <b>S3 서비스가 큐에 쓸 수 있도록</b> 큐 액세스 정책에서{" "}
      <Code>sqs:SendMessage</Code>를 허용해야 합니다. 이때{" "}
      <Code>aws:SourceArn</Code>(버킷 ARN)과 <Code>aws:SourceAccount</Code> 조건을 걸어
      아무 버킷이나 쓰지 못하게 제한합니다. 이 정책이 없으면 S3 이벤트 알림 설정 자체가 실패합니다.
    </p>
    <Callout type="exam">
      "S3 이벤트 알림 → SQS가 동작하지 않는다" 유형의 문제 → 정답은 대부분
      <b> SQS 액세스(리소스) 정책 누락</b>입니다. IAM 사용자 정책이 아니라
      <b> 큐에 붙는 리소스 기반 정책</b>이라는 점을 구분하세요.
    </Callout>
  </>
);

/* ════════════════════════════════════════════════
   § 4. 메시지 가시성 시간 초과
════════════════════════════════════════════════ */

const DgVisibility = () => (
  <Svg vb="0 0 760 300" title="가시성 시간 초과(Visibility Timeout) 타임라인 — 기본 30초">
    <line x1={60} y1={90} x2={720} y2={90} stroke={P.line} strokeWidth="2" />
    {[60, 240, 480, 720].map((x, i) => (
      <line key={i} x1={x} y1={82} x2={x} y2={98} stroke={P.gray} strokeWidth="2" />
    ))}
    <T x={60} y={118} size={11}>t=0</T>
    <T x={240} y={118} size={11}>ReceiveMessage</T>
    <T x={480} y={118} size={11}>+30초 (타임아웃)</T>
    <T x={720} y={118} size={11}>시간 →</T>

    <rect x={240} y={50} width={240} height={26} rx="6" fill={P.red + "28"} stroke={P.red} />
    <T x={360} y={67} c={P.red} size={12} bold>다른 컨슈머에게 보이지 않음 (invisible)</T>

    <rect x={60} y={50} width={178} height={26} rx="6" fill={P.green + "22"} stroke={P.green} />
    <T x={149} y={67} c={P.green} size={12} bold>보임 (visible)</T>
    <rect x={482} y={50} width={238} height={26} rx="6" fill={P.green + "22"} stroke={P.green} />
    <T x={601} y={67} c={P.green} size={12} bold>다시 보임 → 재수신 = 중복 처리 위험!</T>

    <Node x={90} y={160} w={220} h={54} label="컨슈머 A가 메시지 수신" sub="30초 내 처리 + 삭제해야 함" c={P.cmp} />
    <Arr d="M 240,128 C 230,140 215,150 200,158" c={P.gray} dash />

    <Node x={430} y={160} w={280} h={54} label="시간 내 삭제 못하면?" sub="메시지가 큐로 돌아와 다른 컨슈머가 또 수신" c={P.red} />
    <Arr d="M 490,128 C 500,140 520,150 540,158" c={P.red} dash />

    <Node x={90} y={238} w={340} h={48} label="ChangeMessageVisibility API" sub="처리에 시간이 더 필요하면 타임아웃 연장" c={P.blue} />
    <Arr d="M 260,236 C 260,228 260,222 260,216" c={P.blue} dash noHead />
  </Svg>
);

const SecVisibility = () => (
  <>
    <p className="lead">
      컨슈머가 메시지를 폴링하면, 그 메시지는 삭제되지 않았어도 <b>가시성 시간 초과</b>{" "}
      동안 다른 컨슈머에게 <b>보이지 않게</b> 됩니다. 기본값은 <b>30초</b>입니다.
    </p>
    <DgVisibility />
    <ul className="ul">
      <li>30초(설정값) 안에 처리 후 <Code>DeleteMessage</Code>를 호출하지 않으면 메시지가
        다시 "보이는" 상태가 되어 <b>두 번 처리될 수 있습니다</b>.</li>
      <li>처리에 시간이 더 걸린다면 컨슈머가 <Code>ChangeMessageVisibility</Code> API를 호출해
        타임아웃을 <b>연장</b>할 수 있습니다.</li>
      <li><b>값이 너무 크면</b>(예: 몇 시간): 컨슈머가 크래시했을 때 메시지가 다시 보이기까지
        오래 걸려 <b>재처리가 지연</b>됩니다.</li>
      <li><b>값이 너무 작으면</b>(예: 몇 초): 처리 중인데 다시 보이게 되어 <b>중복 처리</b>가 발생합니다.</li>
      <li>따라서 애플리케이션의 실제 처리 시간에 맞는 <b>적절한 값</b>을 설정해야 합니다.</li>
    </ul>
    <Callout type="exam">
      "메시지가 두 번 처리된다" → <b>가시성 시간 초과가 너무 짧다 / ChangeMessageVisibility로 연장</b>.
      "컨슈머 장애 후 메시지 재처리가 너무 늦다" → <b>가시성 시간 초과가 너무 길다</b>.
      DVA에서 가장 자주 나오는 SQS 주제 중 하나입니다.
    </Callout>
  </>
);

/* ════════════════════════════════════════════════
   § 5. 배달 못한 편지 큐 (DLQ)
════════════════════════════════════════════════ */

const DgDlq = () => (
  <Svg vb="0 0 760 280" title="Dead Letter Queue — 실패 메시지 격리">
    <Node x={30} y={60} w={110} h={56} label="프로듀서" c={P.blue} />
    <Node x={210} y={60} w={170} h={56} label="소스 큐" sub="MaximumReceives = 3" c={P.sqs} />
    <Node x={470} y={60} w={130} h={56} label="컨슈머" sub="처리 실패 반복" c={P.cmp} />
    <Arr x1={144} y1={88} x2={206} y2={88} c={P.sqs} />
    <Arr x1={384} y1={80} x2={466} y2={80} c={P.cmp} label="수신" lx={425} ly={70} />
    <Arr x1={466} y1={98} x2={384} y2={98} c={P.red} label="처리 실패 → 큐로 복귀" lx={425} ly={116} />

    <Node x={210} y={190} w={170} h={60} label="DLQ" sub="배달 못한 편지 큐" c={P.red} />
    <Arr d="M 295,120 L 295,186" c={P.red} label="3회 초과 시 이동" lx={368} ly={155} />

    <Node x={470} y={192} w={230} h={56} label="개발자가 나중에 분석" sub="디버깅 · 원인 파악" c={P.yellow} />
    <Arr x1={384} y1={220} x2={466} y2={220} c={P.yellow} dash />
  </Svg>
);

const DgRedrive = () => (
  <Svg vb="0 0 760 170" title="Redrive to Source — 코드 수정 후 메시지 재처리">
    <Node x={60} y={55} w={150} h={60} label="DLQ" sub="실패 메시지 보관" c={P.red} />
    <Node x={330} y={55} w={160} h={60} label="소스 큐" c={P.sqs} />
    <Node x={600} y={55} w={130} h={60} label="컨슈머" sub="수정된 코드" c={P.green} />
    <Arr x1={214} y1={85} x2={326} y2={85} c={P.green} label="Redrive (재구동)" lx={270} ly={45} />
    <Arr x1={494} y1={85} x2={596} y2={85} c={P.green} label="정상 재처리" lx={545} ly={45} />
  </Svg>
);

const SecDlq = () => (
  <>
    <p className="lead">
      컨슈머가 어떤 메시지를 계속 처리하지 못하면(예외 발생 등), 그 메시지는 가시성 시간 초과가
      끝날 때마다 큐로 되돌아오는 <b>무한 루프</b>에 빠질 수 있습니다. 이를 막기 위해
      <b> 재수신 횟수 임계값</b>을 두고, 초과한 메시지를 별도의 <b>DLQ</b>로 보냅니다.
    </p>
    <DgDlq />
    <ul className="ul">
      <li><b>MaximumReceives</b>(예: 3): 이 횟수를 초과해 다시 큐로 돌아온 메시지는 DLQ로 이동합니다.</li>
      <li>DLQ는 <b>디버깅에 유용</b> — 왜 실패했는지 나중에 분석할 수 있습니다.</li>
      <li><b>타입 일치 필수</b>: FIFO 큐의 DLQ는 FIFO 큐여야 하고, 표준 큐의 DLQ는 표준 큐여야 합니다.</li>
      <li>메시지가 만료되기 전에 처리할 수 있도록 DLQ의 <b>보존 기간을 충분히(예: 14일)</b> 설정하는 것이 좋습니다.</li>
    </ul>
    <DgRedrive />
    <p>
      <b>Redrive to Source</b>: DLQ에 쌓인 메시지를 검사·디버깅하고, 컨슈머 코드를 수정한 뒤
      DLQ의 메시지를 <b>소스 큐로 다시 보내</b> 재처리하는 기능입니다. 수동으로 메시지를
      옮기는 커스텀 코드를 짤 필요가 없습니다.
    </p>
    <Callout type="exam">
      "반복 실패하는 메시지를 격리하고 나중에 분석" → <b>DLQ + MaximumReceives</b>.
      "수정 후 실패 메시지 재처리" → <b>Redrive to Source</b>. FIFO ↔ FIFO, 표준 ↔ 표준 매칭도 출제됩니다.
    </Callout>
  </>
);

/* ════════════════════════════════════════════════
   § 6. 지연 큐 (Delay Queue)
════════════════════════════════════════════════ */

const DgDelay = () => (
  <Svg vb="0 0 760 190" title="지연 큐 — 메시지가 컨슈머에게 보이기까지 지연">
    <Node x={30} y={60} w={120} h={56} label="프로듀서" c={P.blue} />
    <rect x={230} y={45} width={300} height={90} rx="14" fill={P.sqs + "14"} stroke={P.sqs} strokeWidth="1.8" />
    <T x={380} y={70} c={P.sqs} size={13} bold>SQS 큐 (DelaySeconds = 60)</T>
    <rect x={260} y={82} width={110} height={38} rx="8" fill={P.faint + "30"} stroke={P.faint} />
    <T x={315} y={105} c={P.faint} size={11} bold>⏳ 숨김 60초</T>
    <rect x={395} y={82} width={110} height={38} rx="8" fill={P.green + "25"} stroke={P.green} />
    <T x={450} y={105} c={P.green} size={11} bold>✓ 보임</T>
    <Node x={610} y={60} w={120} h={56} label="컨슈머" c={P.cmp} />
    <Arr x1={154} y1={88} x2={226} y2={88} c={P.sqs} label="SendMessage" lx={190} ly={52} />
    <Arr x1={534} y1={88} x2={606} y2={88} c={P.cmp} label="60초 후 수신 가능" lx={570} ly={52} />
    <T x={380} y={165} size={11} c={P.sub}>기본 0초 · 최대 15분 | 큐 기본값 또는 메시지별 DelaySeconds 파라미터</T>
  </Svg>
);

const SecDelay = () => (
  <>
    <p className="lead">
      지연 큐는 메시지를 보낸 뒤 <b>일정 시간 동안 컨슈머에게 보이지 않게</b> 하는 기능입니다.
      최대 <b>15분</b>까지 지연할 수 있으며 기본값은 <b>0초</b>(즉시 수신 가능)입니다.
    </p>
    <DgDelay />
    <ul className="ul">
      <li><b>큐 수준 기본값</b>: 큐 설정으로 모든 메시지에 기본 지연을 적용할 수 있습니다.</li>
      <li><b>메시지 수준 재정의</b>: 전송 시 <Code>DelaySeconds</Code> 파라미터로 개별 메시지의 지연을 지정할 수 있습니다.</li>
    </ul>
    <Callout type="info">
      가시성 시간 초과와 혼동 주의 — <b>지연(Delay)은 수신 "전"</b> 숨김,
      <b> 가시성 시간 초과는 수신 "후"</b> 숨김입니다.
    </Callout>
  </>
);

/* ════════════════════════════════════════════════
   § 7. 개발자 개념 (Long Polling · Extended Client · API)
════════════════════════════════════════════════ */

const DgPolling = () => (
  <Svg vb="0 0 760 250" title="숏 폴링 vs 롱 폴링 (Long Polling)">
    <T x={190} y={28} c={P.red} size={13} bold>숏 폴링 (WaitTimeSeconds = 0)</T>
    <Node x={60} y={45} w={110} h={50} label="컨슈머" c={P.cmp} />
    <Node x={250} y={45} w={110} h={50} label="빈 큐" c={P.sqs} />
    <Arr x1={174} y1={62} x2={246} y2={62} c={P.red} label="요청" lx={210} ly={54} />
    <Arr x1={246} y1={82} x2={174} y2={82} c={P.red} label="빈 응답" lx={210} ly={98} />
    <T x={190} y={130} size={11} c={P.red}>즉시 빈 응답 → 무한 반복 폴링</T>
    <T x={190} y={148} size={11} c={P.red}>API 호출 ↑ = 비용 ↑, CPU 낭비</T>

    <line x1={395} y1={20} x2={395} y2={230} stroke={P.line} strokeDasharray="4 6" />

    <T x={580} y={28} c={P.green} size={13} bold>롱 폴링 (WaitTimeSeconds = 1~20초)</T>
    <Node x={440} y={45} w={110} h={50} label="컨슈머" c={P.cmp} />
    <Node x={630} y={45} w={110} h={50} label="빈 큐" c={P.sqs} />
    <Arr x1={554} y1={62} x2={626} y2={62} c={P.green} label="요청" lx={590} ly={54} />
    <Arr x1={626} y1={82} x2={554} y2={82} c={P.green} label="메시지 도착 시 응답" lx={590} ly={98} />
    <T x={590} y={130} size={11} c={P.green}>큐가 비면 최대 20초까지 "대기"</T>
    <T x={590} y={148} size={11} c={P.green}>API 호출 ↓ 지연 시간 ↓ 효율 ↑</T>
    <T x={590} y={176} size={11} c={P.sub}>권장: 20초 · 설정 방법 2가지 —</T>
    <T x={590} y={193} size={11} c={P.sub}>① 큐 속성 ReceiveMessageWaitTimeSeconds</T>
    <T x={590} y={210} size={11} c={P.sub}>② API 호출 시 WaitTimeSeconds 지정</T>
  </Svg>
);

const DgExtended = () => (
  <Svg vb="0 0 760 260" title="SQS Extended Client (Java) — 256KB 초과 대용량 메시지">
    <Node x={40} y={60} w={140} h={56} label="프로듀서" sub="Extended Client 사용" c={P.blue} />
    <Node x={320} y={40} w={160} h={56} label="SQS 큐" sub="작은 메타데이터 메시지" c={P.sqs} />
    <Node x={320} y={150} w={160} h={56} label="Amazon S3" sub="실제 대용량 페이로드 (1GB 등)" c={P.s3} />
    <Node x={600} y={60} w={130} h={56} label="컨슈머" sub="Extended Client 사용" c={P.cmp} />

    <Arr x1={184} y1={75} x2={316} y2={68} c={P.sqs} label="① 포인터(메타데이터) 전송" lx={250} ly={48} />
    <Arr d="M 184,100 C 240,130 260,160 316,175" c={P.s3} label="② 대용량 데이터 업로드" lx={215} ly={160} />
    <Arr x1={484} y1={68} x2={596} y2={75} c={P.cmp} label="③ 메타데이터 수신" lx={540} ly={48} />
    <Arr d="M 484,178 C 540,165 560,130 610,120" c={P.s3} label="④ S3에서 실제 데이터 조회" lx={585} ly={185} />
  </Svg>
);

const SecDevConcepts = () => (
  <>
    <p className="lead">
      DVA(개발자 자격증)에서 특히 강조되는 SQS 개발자 개념 3가지 — <b>롱 폴링</b>,
      <b> Extended Client</b>, 그리고 <b>필수 API</b>입니다.
    </p>
    <H3>1) 롱 폴링 (Long Polling)</H3>
    <DgPolling />
    <ul className="ul">
      <li>컨슈머가 큐에 메시지가 없을 때 <b>메시지 도착을 기다리는</b> 방식입니다.</li>
      <li>대기 시간은 <b>1초~20초</b>로 설정 가능하며 <b>20초가 권장</b>됩니다.</li>
      <li>효과: <b>API 호출 횟수 감소</b>(= 비용 절감) + 응답 <b>지연 시간 감소</b> → 애플리케이션 효율 향상.</li>
      <li>설정: 큐 수준(<Code>ReceiveMessageWaitTimeSeconds</Code>) 또는 API 호출 시{" "}
        <Code>WaitTimeSeconds</Code> 파라미터.</li>
    </ul>
    <H3>2) SQS Extended Client — 대용량 메시지</H3>
    <DgExtended />
    <p>
      메시지 최대 크기는 256KB인데, 1GB 같은 큰 파일을 보내야 한다면?{" "}
      <b>SQS Extended Client(Java 라이브러리)</b>를 사용합니다. 실제 페이로드는 <b>S3</b>에 저장하고,
      큐에는 S3 객체를 가리키는 <b>작은 메타데이터 메시지</b>만 보냅니다. 컨슈머는 메타데이터를 읽고
      S3에서 실제 데이터를 가져옵니다.
    </p>
    <H3>3) 반드시 알아야 할 SQS API</H3>
    <Cmp
      head={["API", "설명"]}
      rows={[
        [<Code>CreateQueue</Code>, "큐 생성 (MessageRetentionPeriod로 보존 기간 설정)"],
        [<Code>DeleteQueue</Code>, "큐 자체를 삭제 (안의 메시지 포함)"],
        [<Code>PurgeQueue</Code>, "큐는 유지하고 안의 모든 메시지만 삭제"],
        [<Code>SendMessage</Code>, "메시지 전송 (DelaySeconds로 개별 지연 지정 가능)"],
        [<Code>ReceiveMessage</Code>, "메시지 수신(폴링)"],
        [<Code>DeleteMessage</Code>, "처리 완료한 메시지 삭제"],
        [<Code>MaxNumberOfMessages</Code>, "ReceiveMessage 파라미터 — 한 번에 받을 메시지 수 (기본 1, 최대 10)"],
        [<Code>ReceiveMessageWaitTimeSeconds</Code>, "롱 폴링 대기 시간"],
        [<Code>ChangeMessageVisibility</Code>, "메시지 가시성 시간 초과 변경(연장)"],
      ]}
    />
    <Callout type="exam">
      <b>배치 API</b> — <Code>SendMessageBatch</Code>, <Code>DeleteMessageBatch</Code>,{" "}
      <Code>ChangeMessageVisibilityBatch</Code>는 API 호출 횟수를 줄여 <b>비용을 절감</b>합니다.
      "SQS 비용을 줄여라" 문제의 정답 조합은 보통 <b>롱 폴링 + 배치 API</b>입니다.
    </Callout>
  </>
);

/* ════════════════════════════════════════════════
   § 8. FIFO 큐
════════════════════════════════════════════════ */

const DgFifo = () => (
  <Svg vb="0 0 760 200" title="FIFO 큐 — First In First Out (선입선출)">
    <Node x={30} y={70} w={120} h={56} label="프로듀서" c={P.blue} />
    <rect x={220} y={55} width={320} height={86} rx="14" fill={P.sqs + "14"} stroke={P.sqs} strokeWidth="1.8" />
    <T x={380} y={78} c={P.sqs} size={13} bold>my-queue.fifo</T>
    {["4", "3", "2", "1"].map((n, i) => (
      <g key={n}>
        <rect x={250 + i * 66} y={90} width={50} height={38} rx="8" fill={P.sqs + "35"} stroke={P.sqs} />
        <text x={275 + i * 66} y={114} textAnchor="middle" fill={P.text} fontSize="14" fontWeight="700">{n}</text>
      </g>
    ))}
    <Node x={610} y={70} w={120} h={56} label="컨슈머" c={P.cmp} />
    <Arr x1={154} y1={98} x2={216} y2={98} c={P.sqs} label="1,2,3,4 전송" lx={185} ly={60} />
    <Arr x1={544} y1={98} x2={606} y2={98} c={P.cmp} label="1,2,3,4 순서대로 수신" lx={575} ly={60} />
    <T x={380} y={175} size={11} c={P.sub}>보낸 순서 그대로 처리 · 중복 없이 정확히 1회 전달</T>
  </Svg>
);

const SecFifo = () => (
  <>
    <p className="lead">
      FIFO 큐는 표준 큐보다 <b>순서 보장</b>이 강화된 큐입니다. 먼저 들어온 메시지가
      먼저 나가며(First In First Out), 컨슈머는 보낸 순서 그대로 메시지를 처리합니다.
    </p>
    <DgFifo />
    <KV rows={[
      ["순서", "메시지 순서 완전 보장"],
      ["전달", "정확히 1회 전달(exactly-once) — 중복 제거 기능 포함"],
      ["처리량", "초당 300개 메시지 (배치 사용 시 초당 3,000개) — 순서 보장의 대가로 처리량 제한"],
      ["이름 규칙", "큐 이름이 반드시 .fifo 로 끝나야 함 (예: orders.fifo)"],
      ["DLQ", "FIFO 큐의 DLQ도 FIFO 큐여야 함"],
    ]} />
    <Callout type="exam">
      키워드 매핑 — "순서가 중요하다 / 중복이 없어야 한다" → <b>FIFO</b>.
      "무제한 처리량이 필요하다" → <b>표준 큐</b>. 처리량 수치
      <b> 300 msg/s(배치 시 3,000 msg/s)</b>는 숫자 그대로 출제됩니다.
    </Callout>
  </>
);

/* ════════════════════════════════════════════════
   § 9. FIFO 고급 — 중복 제거 & 메시지 그룹화
════════════════════════════════════════════════ */

const DgDedup = () => (
  <Svg vb="0 0 760 240" title="FIFO 중복 제거 — 5분 간격(Deduplication Interval)">
    <Node x={40} y={40} w={130} h={54} label="프로듀서" c={P.blue} />
    <rect x={300} y={30} width={200} height={76} rx="14" fill={P.sqs + "14"} stroke={P.sqs} strokeWidth="1.8" />
    <T x={400} y={56} c={P.sqs} size={13} bold>FIFO 큐</T>
    <rect x={340} y={64} width={120} height={32} rx="8" fill={P.sqs + "35"} stroke={P.sqs} />
    <T x={400} y={84} c={P.text} size={11} bold>메시지 1건만 수락</T>
    <Arr x1={174} y1={58} x2={296} y2={58} c={P.sqs} label='전송 "m1"' lx={235} ly={48} />
    <Arr d="M 174,80 C 220,100 250,100 296,88" c={P.red} label='5분 내 동일 "m1" 재전송 → 거부' lx={280} ly={125} />

    <T x={200} y={170} size={12} c={P.green} bold anchor="start">방법 ① 콘텐츠 기반 중복 제거</T>
    <T x={200} y={190} size={11} c={P.sub} anchor="start">메시지 본문의 SHA-256 해시가 같으면 중복으로 판단</T>
    <T x={200} y={218} size={12} c={P.blue} bold anchor="start">방법 ② 명시적 Message Deduplication ID</T>
    <T x={200} y={238} size={11} c={P.sub} anchor="start">전송 시 MessageDeduplicationId 지정 — 같은 ID면 5분 내 중복 거부</T>
  </Svg>
);

const DgGroup = () => (
  <Svg vb="0 0 760 300" title="MessageGroupId — 그룹 단위 순서 보장 & 컨슈머 병렬화">
    <rect x={230} y={30} width={300} height={240} rx="14" fill={P.sqs + "10"} stroke={P.sqs} strokeWidth="1.8" />
    <T x={380} y={54} c={P.sqs} size={13} bold>FIFO 큐 (orders.fifo)</T>

    <rect x={255} y={70} width={250} height={52} rx="10" fill={P.blue + "18"} stroke={P.blue} />
    <T x={300} y={100} c={P.blue} size={12} bold>그룹 A</T>
    {["A3", "A2", "A1"].map((n, i) => (
      <g key={n}><rect x={340 + i * 52} y={80} width={42} height={32} rx="6" fill={P.blue + "30"} stroke={P.blue} />
      <text x={361 + i * 52} y={100} textAnchor="middle" fill={P.text} fontSize="11" fontWeight="700">{n}</text></g>
    ))}
    <rect x={255} y={135} width={250} height={52} rx="10" fill={P.green + "18"} stroke={P.green} />
    <T x={300} y={165} c={P.green} size={12} bold>그룹 B</T>
    {["B3", "B2", "B1"].map((n, i) => (
      <g key={n}><rect x={340 + i * 52} y={145} width={42} height={32} rx="6" fill={P.green + "30"} stroke={P.green} />
      <text x={361 + i * 52} y={165} textAnchor="middle" fill={P.text} fontSize="11" fontWeight="700">{n}</text></g>
    ))}
    <rect x={255} y={200} width={250} height={52} rx="10" fill={P.yellow + "18"} stroke={P.yellow} />
    <T x={300} y={230} c={P.yellow} size={12} bold>그룹 C</T>
    {["C3", "C2", "C1"].map((n, i) => (
      <g key={n}><rect x={340 + i * 52} y={210} width={42} height={32} rx="6" fill={P.yellow + "30"} stroke={P.yellow} />
      <text x={361 + i * 52} y={230} textAnchor="middle" fill={P.text} fontSize="11" fontWeight="700">{n}</text></g>
    ))}

    <Node x={600} y={70} w={130} h={48} label="컨슈머 1" c={P.blue} />
    <Node x={600} y={135} w={130} h={48} label="컨슈머 2" c={P.green} />
    <Node x={600} y={200} w={130} h={48} label="컨슈머 3" c={P.yellow} />
    <Arr x1={508} y1={96} x2={596} y2={94} c={P.blue} />
    <Arr x1={508} y1={161} x2={596} y2={159} c={P.green} />
    <Arr x1={508} y1={226} x2={596} y2={224} c={P.yellow} />

    <T x={110} y={90} size={11} c={P.sub}>같은 MessageGroupId</T>
    <T x={110} y={107} size={11} c={P.sub}>= 같은 그룹 = 순서 보장</T>
    <T x={110} y={150} size={11} c={P.sub}>그룹마다 컨슈머는</T>
    <T x={110} y={167} size={11} c={P.sub}>1개만 배정 가능</T>
    <T x={110} y={210} size={11} c={P.sub}>그룹 "간" 순서는</T>
    <T x={110} y={227} size={11} c={P.sub}>보장되지 않음</T>
  </Svg>
);

const SecFifoAdv = () => (
  <>
    <H3>중복 제거 (Deduplication)</H3>
    <p className="lead">
      FIFO 큐의 중복 제거 간격은 <b>5분</b>입니다 — 5분 안에 동일한 메시지를 두 번 보내면
      두 번째 메시지는 거부됩니다.
    </p>
    <DgDedup />
    <ul className="ul">
      <li><b>① 콘텐츠 기반 중복 제거</b>: 메시지 본문의 <b>SHA-256 해시</b>를 비교해 동일하면 중복으로 처리.</li>
      <li><b>② 명시적 ID</b>: 전송 시 <Code>MessageDeduplicationId</Code>를 직접 지정.
        같은 ID의 메시지가 5분 내 다시 오면 거부.</li>
    </ul>
    <H3>메시지 그룹화 (Message Grouping)</H3>
    <DgGroup />
    <ul className="ul">
      <li>FIFO 큐에서는 <Code>MessageGroupId</Code>가 <b>필수</b>입니다.</li>
      <li>모든 메시지에 <b>같은 그룹 ID</b>를 쓰면: 컨슈머 1개, 전체 메시지가 순서대로 처리됩니다.</li>
      <li><b>서로 다른 그룹 ID</b>(예: 사용자 ID별)를 쓰면: <b>그룹 내에서만 순서 보장</b>,
        그룹마다 별도의 컨슈머를 둘 수 있어 <b>병렬 처리(확장)</b>가 가능합니다.</li>
      <li>단, <b>그룹 사이의 순서는 보장되지 않습니다.</b></li>
    </ul>
    <Callout type="exam">
      "FIFO 순서는 유지하되 처리량을 늘리고 싶다" → <b>MessageGroupId를 세분화</b>해서
      컨슈머 수를 늘린다. "중복 전송을 막고 싶다" → <b>MessageDeduplicationId / 콘텐츠 기반 중복 제거(5분)</b>.
      두 파라미터 이름을 정확히 구분해서 외우세요.
    </Callout>
  </>
);

/* ════════════════════════════════════════════════
   § 10. Amazon SNS
════════════════════════════════════════════════ */

const DgSnsPubSub = () => (
  <Svg vb="0 0 760 320" title="SNS Pub/Sub — 1개 메시지를 여러 구독자에게 푸시">
    <Node x={30} y={130} w={140} h={60} label="구매 서비스" sub="게시자 (Publisher)" c={P.blue} />
    <Node x={280} y={125} w={170} h={70} label="SNS 토픽" sub="1개 토픽 = 최대 1,250만 구독" c={P.sns} />
    <Arr x1={174} y1={160} x2={276} y2={160} c={P.sns} label="Publish" lx={225} ly={150} />

    <Node x={560} y={20} w={170} h={44} label="SQS 큐" c={P.sqs} />
    <Node x={560} y={74} w={170} h={44} label="Lambda" c={P.cmp} />
    <Node x={560} y={128} w={170} h={44} label="Kinesis Data Firehose" c={P.kin} />
    <Node x={560} y={182} w={170} h={44} label="이메일 / SMS / 모바일 푸시" c={P.green} />
    <Node x={560} y={236} w={170} h={44} label="HTTP(S) 엔드포인트" c={P.blue} />

    <Arr x1={452} y1={140} x2={556} y2={44} c={P.gray} />
    <Arr x1={452} y1={150} x2={556} y2={96} c={P.gray} />
    <Arr x1={452} y1={160} x2={556} y2={150} c={P.gray} />
    <Arr x1={452} y1={170} x2={556} y2={204} c={P.gray} />
    <Arr x1={452} y1={180} x2={556} y2={258} c={P.gray} />
    <T x={380} y={300} size={11} c={P.sub}>구독자 전원이 같은 메시지를 수신 (푸시 방식) · Kinesis Data Streams는 구독 불가</T>
  </Svg>
);

const DgSnsSources = () => (
  <Svg vb="0 0 760 220" title="많은 AWS 서비스가 SNS로 직접 알림을 발행">
    <Node x={40} y={30} w={160} h={42} label="CloudWatch 경보" c={P.yellow} />
    <Node x={40} y={82} w={160} h={42} label="Auto Scaling Group" sub="알림" c={P.cmp} />
    <Node x={40} y={134} w={160} h={42} label="S3 이벤트 알림" c={P.s3} />
    <Node x={40} y={186} w={160} h={30} label="CloudFormation 등…" c={P.blue} />
    <Node x={320} y={85} w={160} h={64} label="SNS 토픽" c={P.sns} />
    <Node x={580} y={85} w={150} h={64} label="구독자들" sub="이메일 · SQS · Lambda…" c={P.green} />
    <Arr x1={204} y1={51} x2={316} y2={100} c={P.sns} />
    <Arr x1={204} y1={103} x2={316} y2={112} c={P.sns} />
    <Arr x1={204} y1={155} x2={316} y2={125} c={P.sns} />
    <Arr x1={204} y1={198} x2={316} y2={140} c={P.sns} />
    <Arr x1={484} y1={117} x2={576} y2={117} c={P.green} />
  </Svg>
);

const SecSns = () => (
  <>
    <p className="lead">
      "하나의 메시지를 여러 수신자에게" 보내고 싶다면? 각 수신자와 직접 통합하는 대신,
      <b> Pub/Sub 패턴</b>을 씁니다. 게시자는 <b>SNS 토픽</b>에 한 번만 메시지를 보내고,
      토픽을 <b>구독</b>한 모든 구독자가 메시지를 받습니다.
    </p>
    <DgSnsPubSub />
    <KV rows={[
      ["구독자 수", "토픽당 최대 12,500,000(1,250만) 구독"],
      ["토픽 수", "계정당 최대 100,000개 토픽"],
      ["구독자 유형", "SQS, Lambda, Kinesis Data Firehose, 이메일(JSON 포함), SMS, 모바일 푸시, HTTP(S) 엔드포인트"],
      ["전달 방식", "푸시(Push) — 구독자 전원이 메시지를 받음, 데이터는 보존되지 않음"],
    ]} />
    <Callout type="warn">
      SNS는 <b>Kinesis Data Firehose</b>에는 보낼 수 있지만{" "}
      <b>Kinesis Data Streams에는 직접 보낼 수 없습니다.</b> 자주 나오는 함정입니다.
    </Callout>
    <DgSnsSources />
    <H3>게시(Publish) 방법</H3>
    <ul className="ul">
      <li><b>토픽 게시(Topic Publish)</b> — SDK 사용: 토픽 생성 → 구독 생성 → 토픽에 게시.</li>
      <li><b>직접 게시(Direct Publish)</b> — 모바일 앱 SDK 전용: 플랫폼 애플리케이션 생성 →
        플랫폼 엔드포인트 생성 → 엔드포인트에 게시. Google GCM, Apple APNS, Amazon ADM 등과 연동.</li>
    </ul>
    <H3>SNS 보안 (SQS와 동일한 구조)</H3>
    <ul className="ul">
      <li>전송 중 암호화(HTTPS), 저장 시 암호화(KMS), 클라이언트 측 암호화</li>
      <li>IAM 정책으로 SNS API 접근 제어</li>
      <li><b>SNS 액세스 정책</b>(리소스 기반): 교차 계정 접근, S3 이벤트 등 다른 서비스가 토픽에 게시하도록 허용</li>
    </ul>
  </>
);

/* ════════════════════════════════════════════════
   § 11. SNS + SQS 팬아웃 패턴
════════════════════════════════════════════════ */

const DgFanout = () => (
  <Svg vb="0 0 760 300" title="팬아웃(Fan-out) — 한 번 게시, 여러 SQS 큐가 수신">
    <Node x={30} y={120} w={130} h={60} label="구매 서비스" c={P.blue} />
    <Node x={250} y={115} w={150} h={70} label="SNS 토픽" c={P.sns} />
    <Arr x1={164} y1={150} x2={246} y2={150} c={P.sns} label="1회 게시" lx={205} ly={140} />

    <Node x={520} y={30} w={140} h={52} label="SQS 큐 1" sub="주문 처리" c={P.sqs} />
    <Node x={520} y={122} w={140} h={52} label="SQS 큐 2" sub="사기 탐지" c={P.sqs} />
    <Node x={520} y={214} w={140} h={52} label="SQS 큐 3" sub="분석 파이프라인" c={P.sqs} />
    <Arr x1={404} y1={132} x2={516} y2={60} c={P.gray} />
    <Arr x1={404} y1={150} x2={516} y2={148} c={P.gray} />
    <Arr x1={404} y1={168} x2={516} y2={236} c={P.gray} />

    <Node x={690} y={122} w={54} h={52} label="컨슈머" c={P.cmp} />
    <Arr x1={664} y1={148} x2={686} y2={148} c={P.cmp} />
    <T x={380} y={285} size={11} c={P.sub}>완전한 데이터 분리 · 데이터 손실 없음 · 나중에 큐를 추가해도 됨 (구독만 하면 끝)</T>
  </Svg>
);

const DgS3Fanout = () => (
  <Svg vb="0 0 760 240" title="응용 ① S3 이벤트를 여러 대상으로 — S3 → SNS → 다수 SQS">
    <Node x={30} y={90} w={140} h={60} label="S3 버킷" sub="같은 이벤트 규칙은 1개만" c={P.s3} />
    <Node x={260} y={90} w={140} h={60} label="SNS 토픽" c={P.sns} />
    <Arr x1={174} y1={120} x2={256} y2={120} c={P.s3} label="이벤트" lx={215} ly={110} />
    <Node x={500} y={25} w={130} h={48} label="SQS 큐 A" c={P.sqs} />
    <Node x={500} y={96} w={130} h={48} label="SQS 큐 B" c={P.sqs} />
    <Node x={500} y={167} w={130} h={48} label="Lambda" c={P.cmp} />
    <Arr x1={404} y1={105} x2={496} y2={52} c={P.gray} />
    <Arr x1={404} y1={120} x2={496} y2={120} c={P.gray} />
    <Arr x1={404} y1={135} x2={496} y2={188} c={P.gray} />
    <T x={380} y={230} size={11} c={P.sub}>S3는 (버킷, 이벤트 유형) 조합당 이벤트 규칙 1개 제한 → SNS 팬아웃으로 다수 전달</T>
  </Svg>
);

const DgSnsFirehose = () => (
  <Svg vb="0 0 760 170" title="응용 ② SNS → Kinesis Data Firehose → S3 (데이터 보관)">
    <Node x={30} y={55} w={130} h={60} label="구매 서비스" c={P.blue} />
    <Node x={230} y={55} w={130} h={60} label="SNS 토픽" c={P.sns} />
    <Node x={430} y={55} w={150} h={60} label="Kinesis Firehose" c={P.kin} />
    <Node x={650} y={55} w={90} h={60} label="S3 / 기타" c={P.s3} />
    <Arr x1={164} y1={85} x2={226} y2={85} c={P.sns} />
    <Arr x1={364} y1={85} x2={426} y2={85} c={P.kin} />
    <Arr x1={584} y1={85} x2={646} y2={85} c={P.s3} />
  </Svg>
);

const DgFilter = () => (
  <Svg vb="0 0 760 300" title="SNS 메시지 필터링 — 필터 정책(JSON)으로 구독자별 선별 수신">
    <Node x={30} y={115} w={130} h={64} label="구매 서비스" sub='주문 상태 게시' c={P.blue} />
    <Node x={240} y={115} w={140} h={64} label="SNS 토픽" c={P.sns} />
    <Arr x1={164} y1={147} x2={236} y2={147} c={P.sns} label='State: "Placed"' lx={200} ly={105} />

    <Node x={520} y={25} w={210} h={50} label="SQS: 신규 주문 큐" sub='필터 {"State":["Placed"]}' c={P.sqs} />
    <Node x={520} y={95} w={210} h={50} label="SQS: 취소 주문 큐" sub='필터 {"State":["Cancelled"]}' c={P.sqs} />
    <Node x={520} y={165} w={210} h={50} label="이메일 구독" sub='필터 {"State":["Declined"]}' c={P.green} />
    <Node x={520} y={235} w={210} h={50} label="SQS: 전체 분석 큐" sub="필터 없음 → 모든 메시지 수신" c={P.yellow} />

    <Arr x1={384} y1={132} x2={516} y2={52} c={P.green} label="통과 ✓" lx={445} ly={70} />
    <Arr x1={384} y1={147} x2={516} y2={120} c={P.red} dash label="차단 ✕" lx={450} ly={122} />
    <Arr x1={384} y1={158} x2={516} y2={190} c={P.red} dash />
    <Arr x1={384} y1={170} x2={516} y2={258} c={P.green} label="통과 ✓" lx={445} ly={230} />
  </Svg>
);

const SecFanout = () => (
  <>
    <p className="lead">
      "메시지를 여러 SQS 큐에 보내고 싶다"면 각 큐에 개별 전송하지 마세요 —
      부분 실패, 데이터 손실 위험이 있습니다. 정답은 <b>팬아웃</b>:
      <b> SNS에 한 번 게시하면, 구독한 모든 SQS 큐가 수신</b>합니다.
    </p>
    <DgFanout />
    <ul className="ul">
      <li><b>완전 분리 + 데이터 손실 없음</b>: SQS가 뒤에 있으므로 재시도, 데이터 지속성, 지연 처리 가능.</li>
      <li>나중에 새 서비스가 필요하면 <b>SQS 큐를 토픽에 구독만 추가</b>하면 됩니다.</li>
      <li><b>필수 설정</b>: SQS <b>액세스 정책에서 SNS가 큐에 쓸 수 있도록 허용</b>해야 합니다.</li>
      <li>교차 리전 전달 가능 — 다른 리전의 SQS 큐로도 팬아웃할 수 있습니다.</li>
    </ul>
    <DgS3Fanout />
    <DgSnsFirehose />
    <H3>SNS FIFO 토픽</H3>
    <ul className="ul">
      <li>SQS FIFO와 같은 기능: <b>순서 보장(Message Group ID)</b>, <b>중복 제거(Deduplication ID / 콘텐츠 기반)</b>.</li>
      <li>구독자로 <b>SQS FIFO 큐(와 표준 큐)</b>를 둘 수 있습니다.</li>
      <li>처리량은 SQS FIFO와 동일한 수준으로 제한됩니다.</li>
      <li><b>팬아웃 + 순서 + 중복 제거</b>가 모두 필요하면 → <b>SNS FIFO + SQS FIFO</b> 조합.</li>
    </ul>
    <H3>SNS 메시지 필터링</H3>
    <DgFilter />
    <p>
      구독별로 <b>JSON 필터 정책</b>을 지정하면, 조건에 맞는 메시지만 그 구독자에게 전달됩니다.
      필터 정책이 없는 구독은 <b>모든 메시지</b>를 받습니다. 예: 주문 상태(Placed/Cancelled/Declined)에
      따라 서로 다른 큐로 라우팅.
    </p>
    <Callout type="exam">
      팬아웃은 DVA <b>최빈출 아키텍처 패턴</b>입니다. "동일 이벤트를 여러 시스템이 각자 처리" →
      <b> S3/앱 → SNS → 다수 SQS</b>. 그리고 "특정 유형 메시지만 받게" → <b>SNS 필터 정책</b>.
    </Callout>
  </>
);

/* ════════════════════════════════════════════════
   § 12. Kinesis Data Streams
════════════════════════════════════════════════ */

const DgKinesis = () => (
  <Svg vb="0 0 760 340" title="Kinesis Data Streams — 샤드 기반 실시간 스트리밍">
    <T x={95} y={30} c={P.blue} size={12} bold>프로듀서</T>
    <Node x={30} y={45} w={130} h={40} label="애플리케이션" sub="SDK, KPL" c={P.blue} />
    <Node x={30} y={95} w={130} h={40} label="클라이언트" sub="모바일 · 웹" c={P.blue} />
    <Node x={30} y={145} w={130} h={40} label="Kinesis Agent" sub="로그 수집" c={P.blue} />

    <rect x={260} y={35} width={230} height={230} rx="14" fill={P.kin + "10"} stroke={P.kin} strokeWidth="1.8" />
    <T x={375} y={60} c={P.kin} size={13} bold>Kinesis Data Streams</T>
    {[0, 1, 2].map(i => (
      <g key={i}>
        <rect x={285} y={75 + i * 58} width={180} height={44} rx="8" fill={P.kin + "26"} stroke={P.kin} />
        <text x={375} y={102 + i * 58} textAnchor="middle" fill={P.text} fontSize="12" fontWeight="700">샤드 {i + 1}</text>
      </g>
    ))}
    <T x={375} y={255} c={P.sub} size={10}>샤드 수 = 스트림 용량 (프로비저닝 모드)</T>

    <T x={655} y={30} c={P.green} size={12} bold>컨슈머</T>
    <Node x={580} y={45} w={160} h={40} label="앱 (KCL, SDK)" c={P.green} />
    <Node x={580} y={95} w={160} h={40} label="Lambda" c={P.cmp} />
    <Node x={580} y={145} w={160} h={40} label="Kinesis Data Firehose" c={P.kin} />
    <Node x={580} y={195} w={160} h={40} label="Managed Apache Flink" c={P.kin} />

    <Arr x1={164} y1={65} x2={256} y2={95} c={P.kin} label="레코드" lx={205} ly={62} />
    <Arr x1={164} y1={115} x2={256} y2={140} c={P.kin} />
    <Arr x1={164} y1={165} x2={256} y2={185} c={P.kin} />
    <Arr x1={494} y1={95} x2={576} y2={65} c={P.green} />
    <Arr x1={494} y1={120} x2={576} y2={115} c={P.green} />
    <Arr x1={494} y1={150} x2={576} y2={165} c={P.green} />
    <Arr x1={494} y1={180} x2={576} y2={212} c={P.green} />

    <rect x={30} y={288} width={700} height={40} rx="10" fill={P.soft} stroke={P.line} />
    <T x={380} y={306} size={11} c={P.text} bold>레코드 = 파티션 키 + 데이터 블롭(최대 1MB)</T>
    <T x={380} y={321} size={10} c={P.sub}>같은 파티션 키 → 항상 같은 샤드 → 키 기준 순서 보장</T>
  </Svg>
);

const DgKinesisThroughput = () => (
  <Svg vb="0 0 760 190" title="샤드당 처리량 & 소비 모드">
    <Node x={40} y={60} w={120} h={56} label="프로듀서" c={P.blue} />
    <Node x={310} y={60} w={140} h={56} label="샤드 1개" c={P.kin} />
    <Node x={590} y={60} w={130} h={56} label="컨슈머" c={P.green} />
    <Arr x1={164} y1={88} x2={306} y2={88} c={P.kin} label="쓰기: 1 MB/s 또는 1,000 msg/s" lx={235} ly={50} />
    <Arr x1={454} y1={88} x2={586} y2={88} c={P.green} label="읽기 ↓" lx={520} ly={50} />
    <T x={380} y={150} size={11} c={P.text} bold>공유(Shared) 팬아웃: 샤드당 2 MB/s를 모든 컨슈머가 나눠 씀</T>
    <T x={380} y={170} size={11} c={P.text} bold>향상된(Enhanced) 팬아웃: 샤드당 · 컨슈머당 각각 2 MB/s</T>
  </Svg>
);

const SecKinesis = () => (
  <>
    <p className="lead">
      Kinesis Data Streams는 <b>대용량 데이터를 실시간으로 수집·스트리밍</b>하는 서비스입니다.
      웹사이트 클릭스트림, 애플리케이션 로그, 지표, IoT 원격 측정 등이 대표 데이터입니다.
    </p>
    <DgKinesis />
    <KV rows={[
      ["보존 기간", "1일 ~ 최대 365일 — 기간 내 데이터 재처리(리플레이) 가능"],
      ["불변성", "일단 삽입된 데이터는 삭제 불가(immutability) — 만료로만 사라짐"],
      ["순서", "같은 파티션 키의 데이터는 같은 샤드로 → 키 단위 순서 보장"],
      ["프로듀서", "AWS SDK, KPL(Kinesis Producer Library), Kinesis Agent"],
      ["컨슈머", "직접 작성(KCL, SDK) 또는 관리형(Lambda, Data Firehose, Managed Flink)"],
    ]} />
    <DgKinesisThroughput />
    <H3>용량 모드 2가지</H3>
    <Cmp
      head={["", "프로비저닝 모드", "온디맨드 모드"]}
      colors={[P.blue, P.green]}
      rows={[
        ["샤드 관리", "샤드 수를 직접 선택, API로 수동 확장", "관리 불필요 — 자동 확장"],
        ["용량", "샤드당 IN 1MB/s(1,000msg/s), OUT 2MB/s", "기본 4MB/s(4,000msg/s), 지난 30일 피크 기반 자동 조정"],
        ["과금", "샤드당 시간당 과금", "스트림당 시간당 + 데이터 IN/OUT GB당 과금"],
        ["적합", "트래픽을 예측할 수 있을 때 (비용 최적화)", "트래픽 예측이 어려울 때"],
      ]}
    />
    <Callout type="exam">
      Kinesis 핵심 숫자 — 쓰기 <b>1MB/s·1,000msg/s/샤드</b>, 읽기 <b>2MB/s/샤드</b>(공유)
      또는 <b>컨슈머당 2MB/s</b>(향상된 팬아웃), 레코드 최대 <b>1MB</b>, 보존 <b>최대 365일</b>.
      "리플레이 가능한 실시간 스트림" = Kinesis라는 공식도 기억하세요.
      (참고: 핫 파티션/ProvisionedThroughputExceeded 대응 = 파티션 키 분산, 재시도/백오프, 샤드 분할)
    </Callout>
  </>
);

/* ════════════════════════════════════════════════
   § 13. Kinesis Data Firehose
════════════════════════════════════════════════ */

const DgFirehose = () => (
  <Svg vb="0 0 760 330" title="Kinesis Data Firehose — 스트림을 대상 저장소로 적재(ETL)">
    <T x={95} y={30} c={P.blue} size={12} bold>소스</T>
    <Node x={30} y={45} w={130} h={40} label="앱 / SDK / Agent" c={P.blue} />
    <Node x={30} y={95} w={130} h={40} label="Kinesis Data Streams" c={P.kin} />
    <Node x={30} y={145} w={130} h={40} label="CloudWatch Logs" sub="/ 이벤트" c={P.yellow} />
    <Node x={30} y={195} w={130} h={40} label="SNS" c={P.sns} />

    <rect x={250} y={60} width={240} height={170} rx="14" fill={P.kin + "10"} stroke={P.kin} strokeWidth="1.8" />
    <T x={370} y={86} c={P.kin} size={13} bold>Data Firehose</T>
    <rect x={275} y={100} width={190} height={36} rx="8" fill={P.cmp + "22"} stroke={P.cmp} />
    <T x={370} y={122} c={P.text} size={11} bold>Lambda로 데이터 변환 (선택)</T>
    <rect x={275} y={146} width={190} height={36} rx="8" fill={P.kin + "26"} stroke={P.kin} />
    <T x={370} y={168} c={P.text} size={11} bold>배치 쓰기 (버퍼: 크기/시간 기준)</T>
    <rect x={275} y={192} width={190} height={30} rx="8" fill={P.blue + "20"} stroke={P.blue} />
    <T x={370} y={211} c={P.text} size={11} bold>형식 변환 · 압축 (Parquet 등)</T>

    <T x={648} y={30} c={P.green} size={12} bold>대상 (Destinations)</T>
    <Node x={570} y={45} w={165} h={40} label="Amazon S3" c={P.s3} />
    <Node x={570} y={95} w={165} h={40} label="Amazon Redshift" sub="S3 경유 COPY" c={P.blue} />
    <Node x={570} y={145} w={165} h={40} label="Amazon OpenSearch" c={P.green} />
    <Node x={570} y={195} w={165} h={40} label="서드파티" sub="Datadog · Splunk · MongoDB…" c={P.yellow} />
    <Node x={570} y={245} w={165} h={40} label="커스텀 HTTP 엔드포인트" c={P.gray} />

    <Arr x1={164} y1={65} x2={246} y2={110} c={P.kin} />
    <Arr x1={164} y1={115} x2={246} y2={135} c={P.kin} />
    <Arr x1={164} y1={165} x2={246} y2={160} c={P.kin} />
    <Arr x1={164} y1={215} x2={246} y2={185} c={P.kin} />
    <Arr x1={494} y1={110} x2={566} y2={65} c={P.green} />
    <Arr x1={494} y1={130} x2={566} y2={112} c={P.green} />
    <Arr x1={494} y1={155} x2={566} y2={162} c={P.green} />
    <Arr x1={494} y1={180} x2={566} y2={212} c={P.green} />
    <Arr x1={494} y1={200} x2={566} y2={262} c={P.green} />

    <rect x={30} y={280} width={700} height={38} rx="10" fill={P.soft} stroke={P.line} />
    <T x={380} y={297} size={11} c={P.text} bold>모든 데이터 또는 실패 데이터를 백업 S3 버킷으로 보낼 수도 있음</T>
    <T x={380} y={312} size={10} c={P.sub}>완전 관리형 · 서버리스 · 자동 확장 · Firehose를 통과한 데이터만큼만 과금</T>
  </Svg>
);

const SecFirehose = () => (
  <>
    <p className="lead">
      Firehose는 소스에서 데이터를 받아 <b>대상 저장소에 적재(load)</b>하는 완전 관리형·서버리스
      서비스입니다. 관리할 인프라가 없고 자동으로 확장되며, <b>통과한 데이터량만큼만</b> 비용을 냅니다.
    </p>
    <DgFirehose />
    <ul className="ul">
      <li><b>Near real-time(준실시간)</b>: 버퍼(크기 또는 시간 기준)를 채워 <b>배치</b>로 쓰기 때문에
        완전한 실시간은 아닙니다.</li>
      <li><b>대상</b>: ① AWS — S3, Redshift(내부적으로 S3에 쓴 뒤 COPY), OpenSearch
        ② 서드파티 — Datadog, Splunk, New Relic, MongoDB ③ 커스텀 HTTP 엔드포인트.</li>
      <li><b>Lambda로 데이터 변환</b>(선택), 형식 변환(JSON → Parquet/ORC), 압축(gzip 등) 지원.</li>
      <li><b>데이터 저장/리플레이 불가</b> — Firehose는 데이터를 보관하지 않으므로 재처리가 안 됩니다.
        리플레이가 필요하면 앞단에 Kinesis Data Streams를 두세요.</li>
    </ul>
    <Cmp
      head={["", "Kinesis Data Streams", "Data Firehose"]}
      colors={[P.kin, P.green]}
      rows={[
        ["목적", "실시간 스트리밍 수집 · 소비", "스트림 데이터를 저장소로 적재"],
        ["지연", "실시간 (~200ms)", "준실시간 (버퍼링)"],
        ["관리", "샤드 관리 필요(프로비저닝) / 온디맨드", "완전 자동 · 서버리스"],
        ["저장", "1~365일 보존 → 리플레이 가능", "저장 안 함 → 리플레이 불가"],
        ["컨슈머 코드", "직접 작성 가능", "코드 없음 — 대상만 지정"],
      ]}
    />
    <Callout type="exam">
      "스트리밍 데이터를 <b>S3/Redshift/OpenSearch/Splunk에 최소 관리로 적재</b>" → <b>Firehose</b>.
      "<b>실시간 + 리플레이 + 커스텀 컨슈머</b>" → <b>Data Streams</b>. 이 구분이 이 섹션 시험 문제의 절반입니다.
    </Callout>
  </>
);

/* ════════════════════════════════════════════════
   § 14. Managed Service for Apache Flink
════════════════════════════════════════════════ */

const DgFlink = () => (
  <Svg vb="0 0 760 200" title="Managed Apache Flink — 스트림 실시간 분석/변환">
    <Node x={30} y={40} w={170} h={50} label="Kinesis Data Streams" c={P.kin} />
    <Node x={30} y={110} w={170} h={50} label="Amazon MSK" sub="관리형 Kafka" c={P.blue} />
    <Node x={300} y={65} w={200} h={70} label="Managed Apache Flink" sub="Flink 앱 (Java·Scala·SQL)" c={P.kin} />
    <Node x={590} y={65} w={150} h={70} label="싱크 / 출력" sub="S3 · Kinesis · 대시보드…" c={P.green} />
    <Arr x1={204} y1={65} x2={296} y2={90} c={P.kin} />
    <Arr x1={204} y1={135} x2={296} y2={110} c={P.blue} />
    <Arr x1={504} y1={100} x2={586} y2={100} c={P.green} label="실시간 쿼리·집계" lx={545} ly={55} />
    <T x={380} y={180} size={11} c={P.red} bold>주의: Firehose에서는 데이터를 읽을 수 없음</T>
  </Svg>
);

const SecFlink = () => (
  <>
    <p className="lead">
      과거 이름은 <b>Kinesis Data Analytics</b>. Apache Flink 프레임워크(Java, Scala, SQL)로
      <b> 스트리밍 데이터를 실시간 처리·분석</b>하는 관리형 서비스입니다.
    </p>
    <DgFlink />
    <ul className="ul">
      <li><b>소스</b>: Kinesis Data Streams, Amazon MSK(관리형 Kafka)에서 읽기.
        <b> Firehose에서는 읽을 수 없습니다.</b></li>
      <li>AWS가 관리하는 클러스터에서 Flink 애플리케이션 실행 — 컴퓨팅 자동 프로비저닝,
        병렬 처리, 자동 확장.</li>
      <li>애플리케이션 백업(체크포인트·스냅숏) 제공.</li>
      <li><b>유스케이스</b>: 시계열 분석, 실시간 대시보드, 실시간 지표(metrics).</li>
    </ul>
    <Callout type="exam">
      "스트리밍 데이터에 <b>SQL/Flink로 실시간 분석</b>" → Managed Flink.
      함정 포인트는 <b>Firehose를 소스로 못 쓴다</b>는 것 하나입니다. 출제 비중 자체는 낮은 편.
    </Callout>
  </>
);

/* ════════════════════════════════════════════════
   § 15. SQS vs SNS vs Kinesis
════════════════════════════════════════════════ */

const DgCompare = () => (
  <Svg vb="0 0 760 250" title="데이터 흐름으로 보는 3가지 모델">
    <T x={140} y={30} c={P.sqs} size={13} bold>SQS — 컨슈머가 Pull</T>
    <Node x={60} y={45} w={80} h={44} label="큐" c={P.sqs} />
    <Node x={60} y={110} w={80} h={44} label="컨슈머" c={P.cmp} />
    <Arr x1={100} y1={108} x2={100} y2={93} c={P.cmp} label="Pull" lx={130} ly={104} />
    <T x={140} y={190} size={10.5} c={P.sub}>읽은 후 삭제</T>
    <T x={140} y={206} size={10.5} c={P.sub}>컨슈머 수만큼 분산 처리</T>

    <line x1={265} y1={20} x2={265} y2={230} stroke={P.line} strokeDasharray="4 6" />

    <T x={385} y={30} c={P.sns} size={13} bold>SNS — 전원에게 Push</T>
    <Node x={340} y={45} w={90} h={44} label="토픽" c={P.sns} />
    <Node x={300} y={130} w={70} h={40} label="구독 A" c={P.green} />
    <Node x={400} y={130} w={70} h={40} label="구독 B" c={P.green} />
    <Arr x1={370} y1={92} x2={342} y2={126} c={P.sns} />
    <Arr x1={400} y1={92} x2={428} y2={126} c={P.sns} />
    <T x={385} y={196} size={10.5} c={P.sub}>데이터 미보존 (전달 실패 시 유실 가능)</T>
    <T x={385} y={212} size={10.5} c={P.sub}>팬아웃 = SNS + SQS</T>

    <line x1={505} y1={20} x2={505} y2={230} stroke={P.line} strokeDasharray="4 6" />

    <T x={630} y={30} c={P.kin} size={13} bold>Kinesis — 스트림 Pull</T>
    <rect x={550} y={45} width={160} height={70} rx="12" fill={P.kin + "14"} stroke={P.kin} />
    <T x={630} y={68} c={P.kin} size={11} bold>샤드 1 | 샤드 2 | 샤드 3</T>
    <T x={630} y={92} c={P.sub} size={10}>파티션 키 → 샤드 매핑</T>
    <Node x={590} y={140} w={90} h={40} label="컨슈머" c={P.green} />
    <Arr x1={633} y1={138} x2={633} y2={119} c={P.green} />
    <T x={630} y={200} size={10.5} c={P.sub}>데이터 보존 → 리플레이 가능</T>
    <T x={630} y={216} size={10.5} c={P.sub}>실시간 빅데이터 · 분석 · ETL</T>
  </Svg>
);

const SecCompare = () => (
  <>
    <p className="lead">
      섹션 마무리 — 세 서비스의 차이를 한 표로 정리합니다. 시험에서는
      "이 요구사항엔 어떤 서비스?"를 고르게 하므로 아래 표가 그대로 출제 포인트입니다.
    </p>
    <DgCompare />
    <Cmp
      head={["", "SQS", "SNS", "Kinesis"]}
      colors={[P.sqs, P.sns, P.kin]}
      rows={[
        ["모델", "큐 (Pull)", "Pub/Sub (Push)", "스트림 (Pull, 표준 2MB/s/샤드)"],
        ["데이터 보존", "처리 후 컨슈머가 삭제", "보존 안 함 — 미전달 시 유실", "1~365일 보존, 삭제 불가"],
        ["리플레이", "불가", "불가", "가능"],
        ["순서", "FIFO 큐에서만", "FIFO 토픽에서만", "파티션 키(샤드) 수준 보장"],
        ["수신자", "컨슈머끼리 메시지 분담", "구독자 전원 (최대 1,250만)", "여러 컨슈머가 같은 데이터 소비 가능"],
        ["처리량", "표준: 무제한 / FIFO: 300~3,000msg/s", "매우 높음", "샤드 수로 프로비저닝 또는 온디맨드"],
        ["확장/지연", "컨슈머 수 확장 · 개별 메시지 지연 가능", "구독자 추가", "샤드 분할/병합"],
        ["대표 용도", "작업 버퍼링 · 계층 분리", "알림 · 팬아웃 · 이벤트 브로드캐스트", "로그·클릭스트림 실시간 분석·ETL"],
      ]}
    />
    <Callout type="exam" title="시험 직전 3줄 요약">
      <b>디커플·버퍼·재시도 → SQS</b> ·{" "}
      <b>한 이벤트를 여럿에게 → SNS(+SQS 팬아웃)</b> ·{" "}
      <b>실시간 스트림·리플레이·분석 → Kinesis</b>
    </Callout>
  </>
);

/* ════════════════════════════════════════════════
   섹션 정의 + 빈출도 개요
════════════════════════════════════════════════ */

const SECTIONS = [
  { id: "intro",   no: "218", title: "메시징 소개", short: "메시징 소개", freq: 3, tag: "기초", C: SecIntro,
    note: "동기 vs 비동기 자체보다, 이후 모든 문제의 전제가 되는 개념" },
  { id: "sqs",     no: "220", title: "SQS 표준 큐 개요", short: "SQS 표준 큐", freq: 5, tag: "SQS", C: SecSqsOverview,
    note: "보존 4일/최대 14일, 256KB, at-least-once, best-effort 순서 — 수치·특성 암기 필수" },
  { id: "policy",  no: "224", title: "SQS 큐 액세스 정책", short: "액세스 정책", freq: 3, tag: "SQS", C: SecAccessPolicy,
    note: "S3 이벤트 → SQS 실패 원인 = 리소스 정책 누락 패턴" },
  { id: "vis",     no: "226", title: "메시지 가시성 시간 초과", short: "가시성 타임아웃", freq: 5, tag: "SQS", C: SecVisibility,
    note: "중복 처리 / ChangeMessageVisibility — DVA 단골 중의 단골" },
  { id: "dlq",     no: "228", title: "배달 못한 편지 큐 (DLQ)", short: "DLQ", freq: 4, tag: "SQS", C: SecDlq,
    note: "MaximumReceives, Redrive to Source, FIFO↔FIFO 매칭" },
  { id: "delay",   no: "232", title: "지연 큐 (Delay Queue)", short: "지연 큐", freq: 2, tag: "SQS", C: SecDelay,
    note: "최대 15분 · DelaySeconds — 짧지만 숫자 문제로 출제" },
  { id: "dev",     no: "234", title: "SQS 개발자 개념 (폴링·API)", short: "개발자 개념", freq: 5, tag: "SQS", C: SecDevConcepts,
    note: "롱 폴링(20초) + 배치 API = 비용 절감 콤보, Extended Client(S3)" },
  { id: "fifo",    no: "236", title: "FIFO 큐", short: "FIFO 큐", freq: 4, tag: "SQS", C: SecFifo,
    note: "순서·정확히 1회 · 300/3,000 msg/s · .fifo 접미사" },
  { id: "fifoadv", no: "238", title: "FIFO 고급 (중복 제거·그룹화)", short: "FIFO 고급", freq: 4, tag: "SQS", C: SecFifoAdv,
    note: "5분 중복 제거 간격, MessageGroupId로 순서+병렬화" },
  { id: "sns",     no: "240", title: "Amazon SNS", short: "SNS", freq: 3, tag: "SNS", C: SecSns,
    note: "Pub/Sub, 구독자 유형(Firehose ○ / Data Streams ✕)" },
  { id: "fanout",  no: "242", title: "SNS + SQS 팬아웃 패턴", short: "팬아웃", freq: 5, tag: "SNS", C: SecFanout,
    note: "최빈출 아키텍처 — S3→SNS→다수 SQS, 필터 정책, SNS FIFO" },
  { id: "kinesis", no: "246", title: "Kinesis Data Streams", short: "Kinesis Streams", freq: 4, tag: "Kinesis", C: SecKinesis,
    note: "샤드 처리량 숫자, 파티션 키 순서, 보존·리플레이, 용량 모드" },
  { id: "firehose",no: "250", title: "Kinesis Data Firehose", short: "Firehose", freq: 4, tag: "Kinesis", C: SecFirehose,
    note: "준실시간 적재, 대상 목록, Streams와의 차이 비교가 핵심" },
  { id: "flink",   no: "254", title: "Managed Apache Flink", short: "Flink", freq: 2, tag: "Kinesis", C: SecFlink,
    note: "실시간 SQL/Flink 분석 · Firehose는 소스 불가" },
  { id: "compare", no: "256", title: "SQS vs SNS vs Kinesis", short: "3사 비교", freq: 5, tag: "총정리", C: SecCompare,
    note: "서비스 선택 문제의 답안지 — 표 전체를 그대로 암기" },
];

const TAG_COLOR = { "기초": P.blue, "SQS": P.sqs, "SNS": P.sns, "Kinesis": P.kin, "총정리": P.orange };

const SecOverview = ({ go }) => (
  <>
    <p className="lead">
      Udemy AWS DVA-C02 강의 <b>"AWS 통합 및 메시징"</b> 섹션(218~256강)의 이론 전체를
      실습 강의만 제외하고 정리했습니다. 아래 빈출도는 DVA-C02 시험 가이드의 도메인 비중과
      수험 후기·강의에서 강조되는 정도를 바탕으로 한 <b>추정치</b>입니다 — 실제 문제 구성은 회차마다 다릅니다.
    </p>
    <Callout type="info" title="이 섹션의 시험 비중">
      메시징(SQS·SNS·Kinesis)은 DVA-C02에서 <b>Development with AWS Services 도메인(32%)</b>의
      핵심 축으로, 전체 65문항 중 통상 <b>5~8문항</b>가량이 이 섹션 범위에서 출제되는 편입니다.
      특히 <b>가시성 타임아웃, 롱 폴링, DLQ, 팬아웃, SQS vs SNS vs Kinesis 선택</b>이 반복 출제됩니다.
    </Callout>
    <div className="ov-grid">
      {SECTIONS.map(s => (
        <button key={s.id} className="ov-card" onClick={() => go(s.id)}
          style={{ borderColor: TAG_COLOR[s.tag] + "55" }}>
          <div className="ov-top">
            <span className="ov-tag" style={{ background: TAG_COLOR[s.tag] + "22", color: TAG_COLOR[s.tag] }}>{s.tag}</span>
            <span className="ov-no">#{s.no}</span>
          </div>
          <div className="ov-title">{s.title}</div>
          <div className="ov-stars" style={{ color: [null, P.faint, P.blue, P.green, P.yellow, P.orange][s.freq] }}>
            {"★".repeat(s.freq)}<span style={{ opacity: .22 }}>{"★".repeat(5 - s.freq)}</span>
          </div>
          <div className="ov-note">{s.note}</div>
        </button>
      ))}
    </div>
  </>
);

/* ════════════════════════════════════════════════
   앱 셸
════════════════════════════════════════════════ */

const CSS = `
  .app { min-height: 100vh; background: ${P.bg}; color: ${P.text};
    font-family: 'Pretendard', 'Noto Sans KR', -apple-system, 'Segoe UI', sans-serif;
    display: flex; flex-direction: column; }
  * { box-sizing: border-box; }

  .hdr { padding: 26px 28px 20px; border-bottom: 1px solid ${P.line};
    background: linear-gradient(135deg, #121A2E 0%, #0D1220 60%); }
  .hdr-eyebrow { font-size: 12px; letter-spacing: .16em; color: ${P.orange};
    font-weight: 700; text-transform: uppercase; }
  .hdr h1 { margin: 8px 0 6px; font-size: 26px; font-weight: 800; letter-spacing: -.01em; }
  .hdr h1 .accent { color: ${P.orange}; }
  .hdr-sub { color: ${P.sub}; font-size: 13.5px; margin: 0; }

  .body { display: flex; flex: 1; min-height: 0; }
  .nav { width: 250px; flex-shrink: 0; border-right: 1px solid ${P.line};
    padding: 14px 10px; overflow-y: auto; position: sticky; top: 0;
    max-height: 100vh; }
  .nav-group { font-size: 11px; letter-spacing: .12em; color: ${P.faint};
    font-weight: 700; margin: 14px 10px 6px; text-transform: uppercase; }
  .nav-item { display: flex; align-items: center; gap: 8px; width: 100%;
    text-align: left; background: none; border: none; color: ${P.sub};
    padding: 8px 10px; border-radius: 9px; cursor: pointer; font-size: 13.5px;
    font-family: inherit; line-height: 1.3; }
  .nav-item:hover { background: ${P.soft}; color: ${P.text}; }
  .nav-item.on { background: ${P.soft}; color: ${P.text}; font-weight: 700;
    box-shadow: inset 3px 0 0 var(--dot); }
  .nav-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .nav-stars { margin-left: auto; font-size: 10px; letter-spacing: -1px; opacity: .85; }

  .main { flex: 1; min-width: 0; padding: 26px clamp(16px, 4vw, 44px) 80px;
    max-width: 980px; }
  .crumb { font-size: 12px; color: ${P.faint}; margin-bottom: 6px; letter-spacing: .06em; }
  .sec-h { display: flex; flex-wrap: wrap; align-items: baseline; gap: 12px; margin-bottom: 4px; }
  .sec-h h2 { font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -.01em; }
  .freq { font-size: 12px; font-weight: 700; border: 1px solid; padding: 3px 10px;
    border-radius: 999px; display: inline-flex; gap: 7px; align-items: center; }
  .freq .stars { letter-spacing: 0; }
  .sec-note { color: ${P.faint}; font-size: 12.5px; margin: 4px 0 22px; }

  .lead { font-size: 15px; line-height: 1.75; color: ${P.text}; }
  p { font-size: 14px; line-height: 1.75; color: ${P.sub}; }
  p b, .ul b { color: ${P.text}; }
  .h3 { font-size: 17px; font-weight: 800; margin: 30px 0 10px; color: ${P.text};
    padding-left: 10px; border-left: 3px solid ${P.orange}; }
  .ul { padding-left: 20px; margin: 10px 0; }
  .ul li { font-size: 14px; line-height: 1.8; color: ${P.sub}; margin-bottom: 6px; }

  .dgm { background: ${P.panel}; border: 1px solid ${P.line}; border-radius: 16px;
    padding: 16px 14px 10px; margin: 18px 0; }
  .dgm-title { font-size: 12.5px; font-weight: 700; color: ${P.sub};
    margin: 0 4px 10px; letter-spacing: .02em; }
  .dgm-title::before { content: "◈ "; color: ${P.orange}; }

  .callout { border: 1px solid; border-radius: 14px; padding: 14px 16px; margin: 18px 0; }
  .callout-head { font-weight: 800; font-size: 13px; margin-bottom: 6px; }
  .callout-body { font-size: 13.5px; line-height: 1.75; color: ${P.text}; }
  .callout-body b { color: inherit; font-weight: 800; }

  .kv { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 13.5px; }
  .kv th { text-align: left; padding: 9px 12px; color: ${P.orange}; font-weight: 700;
    width: 130px; border-bottom: 1px solid ${P.line}; vertical-align: top; white-space: nowrap; }
  .kv td { padding: 9px 12px; color: ${P.sub}; border-bottom: 1px solid ${P.line}; line-height: 1.6; }

  .cmp-wrap { overflow-x: auto; margin: 16px 0; border: 1px solid ${P.line}; border-radius: 14px; }
  .cmp { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 560px; }
  .cmp thead th { background: ${P.soft}; padding: 10px 12px; text-align: left;
    font-weight: 800; color: ${P.text}; border-bottom: 1px solid ${P.line}; }
  .cmp tbody th { padding: 9px 12px; text-align: left; color: ${P.text};
    font-weight: 700; border-bottom: 1px solid ${P.line}; background: ${P.panel};
    white-space: nowrap; }
  .cmp tbody td { padding: 9px 12px; color: ${P.sub}; border-bottom: 1px solid ${P.line};
    line-height: 1.55; background: ${P.bg}; }
  .cmp tbody tr:last-child th, .cmp tbody tr:last-child td { border-bottom: none; }

  .ic { background: ${P.soft}; border: 1px solid ${P.line}; color: ${P.yellow};
    padding: 1px 7px; border-radius: 6px; font-size: 12.5px;
    font-family: 'SF Mono', 'Consolas', monospace; }

  .ov-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    gap: 12px; margin-top: 20px; }
  .ov-card { background: ${P.panel}; border: 1px solid; border-radius: 14px;
    padding: 14px 15px; text-align: left; cursor: pointer; color: inherit;
    font-family: inherit; transition: transform .12s ease, background .12s ease; }
  .ov-card:hover { transform: translateY(-2px); background: ${P.soft}; }
  .ov-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .ov-tag { font-size: 11px; font-weight: 800; padding: 2px 9px; border-radius: 999px; }
  .ov-no { font-size: 11px; color: ${P.faint}; font-weight: 700; }
  .ov-title { font-size: 14.5px; font-weight: 800; margin-bottom: 5px; }
  .ov-stars { font-size: 13px; margin-bottom: 7px; letter-spacing: 1px; }
  .ov-note { font-size: 12px; color: ${P.faint}; line-height: 1.55; }

  .pager { display: flex; justify-content: space-between; gap: 12px; margin-top: 40px;
    border-top: 1px solid ${P.line}; padding-top: 18px; }
  .pager button { background: ${P.panel}; border: 1px solid ${P.line}; color: ${P.text};
    padding: 10px 16px; border-radius: 11px; cursor: pointer; font-family: inherit;
    font-size: 13px; font-weight: 700; max-width: 48%; }
  .pager button:hover { border-color: ${P.orange}; color: ${P.orange}; }
  .pager .dir { display: block; font-size: 10.5px; color: ${P.faint}; font-weight: 600; margin-bottom: 2px; }

  button:focus-visible, .nav-item:focus-visible { outline: 2px solid ${P.orange}; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { .ov-card { transition: none; } }

  @media (max-width: 860px) {
    .body { flex-direction: column; }
    .nav { width: 100%; max-height: none; position: static; display: flex;
      overflow-x: auto; border-right: none; border-bottom: 1px solid ${P.line};
      padding: 10px 12px; gap: 6px; }
    .nav-group { display: none; }
    .nav-item { flex-shrink: 0; width: auto; border: 1px solid ${P.line}; border-radius: 999px;
      padding: 6px 12px; font-size: 12.5px; }
    .nav-item.on { box-shadow: none; border-color: var(--dot); }
    .nav-stars { display: none; }
    .hdr h1 { font-size: 21px; }
  }
`;

export default function App() {
  const [cur, setCur] = useState("overview");
  const idx = SECTIONS.findIndex(s => s.id === cur);
  const sec = idx >= 0 ? SECTIONS[idx] : null;
  const go = (id) => { setCur(id); if (typeof window !== "undefined") window.scrollTo({ top: 0 }); };

  const groups = [["기초", "SQS"], ["SNS"], ["Kinesis", "총정리"]];
  const groupLabel = ["큐 · Amazon SQS", "Pub/Sub · Amazon SNS", "스트리밍 · Kinesis & 총정리"];

  return (
    <div className="app">
      <style>{CSS}</style>
      <header className="hdr">
        <div className="hdr-eyebrow">AWS Certified Developer – Associate (DVA-C02)</div>
        <h1>AWS 통합 및 메시징 <span className="accent">SQS · SNS · Kinesis</span></h1>
        <p className="hdr-sub">강의 218~256 이론 전체 정리 (실습 제외) · 다이어그램 중심 · 시험 빈출도 표시</p>
      </header>
      <div className="body">
        <nav className="nav" aria-label="섹션 목차">
          <button className={"nav-item" + (cur === "overview" ? " on" : "")}
            style={{ "--dot": P.orange }} onClick={() => go("overview")}>
            <span className="nav-dot" style={{ background: P.orange }} />
            개요 · 빈출도 맵
          </button>
          {groups.map((tags, gi) => (
            <div key={gi}>
              <div className="nav-group">{groupLabel[gi]}</div>
              {SECTIONS.filter(s => tags.includes(s.tag)).map(s => (
                <button key={s.id} className={"nav-item" + (cur === s.id ? " on" : "")}
                  style={{ "--dot": TAG_COLOR[s.tag] }} onClick={() => go(s.id)}>
                  <span className="nav-dot" style={{ background: TAG_COLOR[s.tag] }} />
                  {s.short}
                  <span className="nav-stars" style={{ color: P.yellow }}>
                    {"★".repeat(s.freq)}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </nav>
        <main className="main">
          {cur === "overview" ? (
            <>
              <div className="crumb">OVERVIEW</div>
              <div className="sec-h"><h2>섹션 개요 & 빈출도 맵</h2></div>
              <SecOverview go={go} />
            </>
          ) : (
            <>
              <div className="crumb">강의 #{sec.no} · {sec.tag}</div>
              <div className="sec-h">
                <h2>{sec.title}</h2>
                <Freq n={sec.freq} />
              </div>
              <div className="sec-note">{sec.note}</div>
              <sec.C />
              <div className="pager">
                {idx > 0 ? (
                  <button onClick={() => go(SECTIONS[idx - 1].id)}>
                    <span className="dir">← 이전</span>{SECTIONS[idx - 1].short}
                  </button>
                ) : (
                  <button onClick={() => go("overview")}>
                    <span className="dir">← 처음</span>개요 · 빈출도 맵
                  </button>
                )}
                {idx < SECTIONS.length - 1 ? (
                  <button onClick={() => go(SECTIONS[idx + 1].id)} style={{ textAlign: "right" }}>
                    <span className="dir">다음 →</span>{SECTIONS[idx + 1].short}
                  </button>
                ) : (
                  <button onClick={() => go("overview")} style={{ textAlign: "right" }}>
                    <span className="dir">완료 🎉</span>개요로 돌아가기
                  </button>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
