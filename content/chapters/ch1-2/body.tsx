"use client";

import type { ReactNode } from "react";
import {
  C,
  Checklist,
  Code,
  ExamLi,
  ExamPoint,
  Fig,
  Note,
  P,
  Sec,
  SubTitle,
  Table,
} from "../ui";

const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

/** 코드/CLI 예시 블록 — 잉크 배경 카드 (전역 셀렉터 없이 인라인 스타일만). */
function CodeBlock({ title, children }: { title?: string; children: string }) {
  return (
    <div style={{ margin: "1rem 0" }}>
      {title && (
        <div
          style={{
            fontFamily: MONO,
            fontSize: "0.72rem",
            fontWeight: 700,
            color: C.inkSoft,
            marginBottom: 4,
            letterSpacing: "0.04em",
          }}
        >
          {title}
        </div>
      )}
      <pre
        style={{
          fontFamily: MONO,
          fontSize: "0.8rem",
          lineHeight: 1.7,
          background: C.ink,
          color: "#D5E0EC",
          borderRadius: 11,
          padding: "1rem 1.15rem",
          overflowX: "auto",
          margin: 0,
        }}
      >
        {children}
      </pre>
    </div>
  );
}

/** 주의(함정) 콜아웃 — 레드 왼쪽 보더. */
function WarnBox({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: C.redSoft,
        color: C.ink,
        borderLeft: `5px solid ${C.red}`,
        borderRadius: "0 12px 12px 0",
        padding: "0.85rem 1.15rem",
        margin: "1.25rem 0",
        fontSize: "0.93rem",
      }}
    >
      <b style={{ color: C.red }}>⚠ 함정 </b>
      {children}
    </div>
  );
}

export default function Ch12Body() {
  return (
    <>
      <P>
        Lambda는 DVA-C02 Domain 1의 심장입니다. <b>호출 3유형(동기/비동기/이벤트 소스 매핑)의
        구분과 각각의 오류 처리</b>, <b>동시성·콜드 스타트</b>, <b>버전·별칭·트래픽 전환</b>,
        그리고 <b>수치 한도</b>가 반복 출제됩니다. 이 챕터는 S3 챕터(ch1-1)의 이벤트 알림을
        트리거 관점에서 다시 사용합니다.
      </P>

      <OverviewSection />
      <SyncSection />
      <AsyncSection />
      <EsmSection />
      <EventCtxSection />
      <DestSection />
      <PermSection />
      <EnvSection />
      <MonSection />
      <EdgeSection />
      <VpcSection />
      <PerfSection />
      <ConcSection />
      <LayersSection />
      <DeploySection />
      <VersionsSection />
      <CodeDeploySection />
      <FurlSection />
      <SupplementSection />
      <LimitsSection />

      <Checklist
        title="체크리스트 — 이 문장이 술술 나오면 통과"
        items={[
          {
            text: "S3·SNS·EventBridge → 비동기(푸시), Kinesis·DynamoDB Streams·SQS → 이벤트 소스 매핑(폴링·동기)",
            freq: "★★★",
          },
          {
            text: "비동기 실패 = 총 3회 시도(1분·2분 간격) 후 DLQ/Destination — 처리 로직은 멱등해야 한다",
            freq: "★★★",
          },
          {
            text: "나가는 권한 = 실행 역할, 들어오는 호출 권한 = 리소스 기반 정책 (ESM 폴링은 실행 역할)",
            freq: "★★★",
          },
          {
            text: "메모리 128MB~10,240MB(1MB 단위), 약 1,769MB ≈ 1 vCPU — CPU가 필요하면 메모리를 올린다",
            freq: "★★★",
          },
          {
            text: "타임아웃 기본 3초·최대 900초(15분), zip 50MB/해제 250MB/컨테이너 10GB, /tmp 512MB~10GB, 환경 변수 4KB, 레이어 5개",
            freq: "★★★",
          },
          {
            text: "동시성 계정 기본 1,000 — 초과 시 동기 429, 비동기는 최대 6시간 재시도. Reserved=격리, Provisioned=콜드 스타트 제거",
            freq: "★★★",
          },
          {
            text: "버전은 불변, 별칭은 가변 포인터 — 가중치는 버전 2개까지, 별칭이 별칭을 가리킬 수 없고 $LATEST에는 가중치·PC 설정 불가",
            freq: "★★★",
          },
          {
            text: "VPC Lambda는 퍼블릭 서브넷에서도 공인 IP가 없다 — 인터넷은 프라이빗 서브넷 + NAT",
            freq: "★★★",
          },
        ]}
      />
    </>
  );
}

/* ── 01 서버리스 & Lambda 개요 ────────────────────────────────────── */

function OverviewSection() {
  return (
    <Sec
      num="01"
      title="서버리스와 Lambda 개요"
      sub="EC2와의 차이, 과금 모델, 런타임"
      freq="mid"
      freqLabel="빈출 ★★☆ · 전제 개념"
    >
      <P>
        서버리스는 &ldquo;서버가 없다&rdquo;가 아니라 <b>서버를 관리·프로비저닝하지 않는다</b>는
        뜻입니다. Lambda에서 개척되어 지금은 관리형 전반(DynamoDB, S3, API Gateway, Cognito, SQS,
        Step Functions, Fargate 등)을 포괄합니다. 표준 서버리스 웹앱 = CloudFront+S3(정적) ·
        Cognito(인증) · API Gateway → Lambda → DynamoDB(API).
      </P>
      <Table
        head={["Amazon EC2", "AWS Lambda"]}
        rows={[
          ["클라우드의 가상 서버", "가상 함수 — 관리할 서버 없음"],
          ["메모리·CPU를 직접 프로비저닝", "실행 시간에 맞춰 자동 프로비저닝"],
          [
            "계속 실행 (실행 중 항상 과금)",
            <>
              실행 시간이 짧음 — <b>최대 15분</b>
            </>,
          ],
          ["확장에 개입 필요 (ASG 구성)", "온디맨드 실행 · 스케일링 완전 자동"],
        ]}
      />
      <P>
        과금 = <b>요청 수 + 컴퓨팅 시간(GB-초 = RAM×초)</b>. 프리 티어 월 100만 요청 + 40만 GB-초,
        초과 시 요청 $0.20/100만 건. 함수당 최대 10GB RAM이며 <b>RAM을 늘리면 CPU·네트워크
        성능도 함께 향상</b>됩니다(시험 단골). 런타임: Node.js, Python, Java, .NET, Ruby + Custom
        Runtime API(Rust, Go 등).
      </P>
      <WarnBox>
        Lambda 컨테이너 이미지는 반드시 <b>Lambda Runtime API를 구현</b>해야 한다. &ldquo;임의의
        Docker 이미지를 실행&rdquo;하고 싶다면 정답은 <b>ECS/Fargate</b>다(빈출 함정).
      </WarnBox>
    </Sec>
  );
}

/* ── 02 동기식 호출 ───────────────────────────────────────────────── */

function InvocationSvg() {
  return (
    <svg viewBox="0 0 700 210" style={{ width: "100%", height: "auto" }} role="img">
      <rect x="15" y="20" width="210" height="52" rx="10" fill={C.blueSoft} stroke={C.blue} strokeWidth="1.5" />
      <text x="120" y="42" textAnchor="middle" fontSize="11.5" fontWeight="800" fill={C.blue}>
        ① 동기 (sync)
      </text>
      <text x="120" y="60" textAnchor="middle" fontSize="9.5" fill={C.inkSoft}>
        CLI/SDK · API Gateway · ALB
      </text>
      <rect x="15" y="82" width="210" height="52" rx="10" fill={C.amberSoft} stroke={C.amber} strokeWidth="1.5" />
      <text x="120" y="104" textAnchor="middle" fontSize="11.5" fontWeight="800" fill={C.amberText}>
        ② 비동기 (async · push)
      </text>
      <text x="120" y="122" textAnchor="middle" fontSize="9.5" fill={C.inkSoft}>
        S3 · SNS · EventBridge
      </text>
      <rect x="15" y="144" width="210" height="52" rx="10" fill={C.tealSoft} stroke={C.teal} strokeWidth="1.5" />
      <text x="120" y="166" textAnchor="middle" fontSize="11.5" fontWeight="800" fill={C.teal}>
        ③ 이벤트 소스 매핑 (poll)
      </text>
      <text x="120" y="184" textAnchor="middle" fontSize="9.5" fill={C.inkSoft}>
        Kinesis · DDB Streams · SQS
      </text>
      <rect x="410" y="82" width="150" height="52" rx="10" fill={C.card} stroke={C.ink} strokeWidth="1.6" />
      <text x="485" y="112" textAnchor="middle" fontSize="13" fontWeight="800" fill={C.ink}>
        Lambda
      </text>
      <line x1="225" y1="46" x2="410" y2="98" stroke={C.blue} strokeWidth="1.6" />
      <line x1="225" y1="108" x2="410" y2="108" stroke={C.amber} strokeWidth="1.6" />
      <line x1="410" y1="122" x2="225" y2="170" stroke={C.teal} strokeWidth="1.6" />
      <text x="318" y="60" fontSize="9.5" fill={C.blue} fontWeight="700">
        결과 즉시 반환
      </text>
      <text x="318" y="100" fontSize="9.5" fill={C.amberText} fontWeight="700">
        202 반환 · 이벤트 큐
      </text>
      <text x="300" y="162" fontSize="9.5" fill={C.teal} fontWeight="700">
        Lambda가 폴링 → 동기 호출
      </text>
      <text x="575" y="100" fontSize="9.5" fill={C.inkSoft}>
        오류 처리·재시도가
      </text>
      <text x="575" y="116" fontSize="9.5" fill={C.inkSoft}>
        유형마다 다름 = 시험 핵심
      </text>
    </svg>
  );
}

function SyncSection() {
  return (
    <Sec
      num="02"
      title="호출 ① 동기식 (+ ALB 통합)"
      sub="결과를 기다린다 — 오류 처리는 호출자 책임"
      freq="hi"
      freqLabel="최빈출 ★★★ · 호출 3유형 구분"
    >
      <Fig caption="호출 3유형 — 푸시(동기/비동기)와 폴링(ESM)의 구분 자체가 가장 자주 출제된다.">
        <InvocationSvg />
      </Fig>
      <P>
        <b>동기식</b>은 호출 후 결과를 기다렸다가 즉시 응답을 받습니다. CLI/SDK, API Gateway,
        ALB, CloudFront(Lambda@Edge), S3 Batch, Cognito, Step Functions 등이 동기 호출입니다.
        오류 처리는 <b>클라이언트 측 책임</b> — 재시도·지수 백오프를 호출자가 수행합니다.
      </P>
      <CodeBlock title="CLI — 동기식 호출">{`aws lambda invoke \\
  --function-name demo-lambda \\
  --cli-binary-format raw-in-base64-out \\
  --payload '{"key1": "value1"}' \\
  response.json`}</CodeBlock>

      <SubTitle>ALB 통합</SubTitle>
      <P>
        Lambda를 HTTP(S) 엔드포인트로 노출하려면 API Gateway 또는 <b>ALB</b>를 씁니다. ALB는
        함수를 <b>대상 그룹(Target Group)</b>에 등록하고, HTTP 요청을 <b>JSON 문서로 변환</b>해
        동기 호출한 뒤 함수의 JSON 응답(<Code>statusCode</Code>, <Code>headers</Code>,{" "}
        <Code>body</Code>, <Code>isBase64Encoded</Code>)을 다시 HTTP로 변환합니다.
      </P>
      <P>
        ALB에서 <b>Multi-Value Headers</b>를 활성화하면 같은 이름의 쿼리 스트링·헤더가{" "}
        <b>배열</b>로 변환됩니다 — <Code>?name=foo&amp;name=bar</Code> →{" "}
        <Code>{'"name": ["foo","bar"]'}</Code>.
      </P>
      <ExamPoint>
        <ExamLi>&ldquo;동기식 호출 실패 시 누가 재시도?&rdquo; → 클라이언트.</ExamLi>
        <ExamLi>ALB + Lambda = 대상 그룹 등록 · HTTP↔JSON 상호 변환 · Multi-Value Headers는 배열.</ExamLi>
      </ExamPoint>
    </Sec>
  );
}

/* ── 03 비동기식 호출 & DLQ ───────────────────────────────────────── */

function AsyncSection() {
  return (
    <Sec
      num="03"
      title="호출 ② 비동기식 & DLQ"
      sub="이벤트 큐 · 재시도 3회 · S3/EventBridge 트리거"
      freq="hi"
      freqLabel="최빈출 ★★★ · 재시도 정책 암기 필수"
    >
      <P>
        <b>비동기식</b>은 결과를 기다리지 않습니다. 이벤트는 Lambda 내부 <b>이벤트 큐</b>에
        쌓이고 호출자는 즉시 <Code>202 Accepted</Code>만 받습니다. S3·SNS·EventBridge·
        CodePipeline·SES·CloudWatch Logs(구독) 등이 비동기로 호출합니다.
      </P>
      <Table
        head={["항목", "동작"]}
        rows={[
          [
            "재시도 정책",
            <>
              오류 시 <b>총 3회 시도</b> — 최초 시도 후 <b>1분 대기 → 재시도</b>, 다시{" "}
              <b>2분 대기 → 재시도</b>
            </>,
          ],
          [
            "멱등성",
            <>
              재시도 때문에 처리 로직은 <b>멱등(idempotent)</b>해야 하고, CloudWatch Logs에 중복
              로그가 보일 수 있다
            </>,
          ],
          [
            "DLQ",
            <>
              최종 실패 이벤트를 <b>SNS 토픽 또는 SQS 큐</b>로 — 이때{" "}
              <b>실행 역할에 SQS/SNS 쓰기 권한</b> 필요(권한 함정 출제)
            </>,
          ],
        ]}
      />

      <SubTitle>대표 트리거 패턴</SubTitle>
      <P>
        <b>S3 이벤트 알림</b>: <Code>s3:ObjectCreated:*</Code> 등 → Lambda(비동기). 새 객체
        업로드 → 메타데이터 추출 → DynamoDB 기록 패턴이 자주 출제됩니다.{" "}
        <b>EventBridge</b>: ① 스케줄(CRON/Rate) 규칙 → 서버리스 크론 ② 서비스 이벤트(예:
        CodePipeline 상태 변경) → 규칙 매칭 → Lambda.
      </P>
      <WarnBox>
        버저닝이 꺼진 버킷에서 같은 객체에 동시에 두 번 쓰기가 일어나면 S3 이벤트 알림이{" "}
        <b>1건 유실</b>될 수 있다 — 빠짐없이 받으려면 <b>버전 관리 활성화</b>(그대로 출제).
      </WarnBox>
      <ExamPoint>
        <ExamLi>&ldquo;S3 이벤트가 실패하면?&rdquo; → 재시도 3회 후 DLQ가 정답 흐름.</ExamLi>
        <ExamLi>&ldquo;X분마다 Lambda 실행&rdquo; → EventBridge 스케줄 규칙 (EC2 크론은 오답).</ExamLi>
      </ExamPoint>
    </Sec>
  );
}

/* ── 04 이벤트 소스 매핑 ──────────────────────────────────────────── */

function EsmSection() {
  return (
    <Sec
      num="04"
      title="호출 ③ 이벤트 소스 매핑 (ESM)"
      sub="Kinesis · DynamoDB Streams · SQS — Lambda가 폴링한다"
      freq="hi"
      freqLabel="최빈출 ★★★ · 오류 처리와 스케일링"
    >
      <P>
        <b>이벤트 소스 매핑</b>은 Lambda가 <b>직접 폴링</b>해서 레코드를 가져오는 방식으로,
        대상은 딱 3가지 — <b>Kinesis Data Streams, DynamoDB Streams, SQS(+FIFO)</b>. 폴러가
        배치를 구성해 함수를 <b>동기식으로 호출</b>합니다.
      </P>

      <SubTitle>유형 ① 스트림 (Kinesis & DynamoDB Streams)</SubTitle>
      <P>
        샤드마다 iterator를 만들어 <b>샤드 수준 순서 보장</b>으로 처리합니다. 읽기 시작 위치는 새
        항목만 / 처음부터(TRIM_HORIZON) / 특정 타임스탬프. 처리된 항목은 스트림에서 삭제되지
        않으며, 처리량을 높이려면 <b>샤드당 최대 10개 배치 병렬 처리</b>(ParallelizationFactor,
        파티션 키 수준 순서 유지)가 가능합니다.
      </P>
      <WarnBox>
        스트림 오류 기본 동작: <b>성공하거나 항목이 만료될 때까지 배치 전체 재시도</b> — 그동안{" "}
        <b>해당 샤드 처리가 중지</b>된다(순서 보장 때문). 대응 설정: discard old events ·
        restrict retries · <b>split(bisect) batch on error</b>. 폐기된 이벤트는 Destination으로.
      </WarnBox>

      <SubTitle>유형 ② 큐 (SQS & SQS FIFO)</SubTitle>
      <P>
        롱 폴링으로 큐를 읽으며 배치 크기 1~10. <b>가시성 타임아웃은 함수 타임아웃의 6배</b>{" "}
        권장(계산 문제 출제). 성공 항목은 Lambda가 큐에서 삭제하고, 실패 배치는 개별 항목 단위로
        큐에 복귀 — 이미 성공한 항목이 다시 올 수 있으니 <b>멱등</b> 처리해야 합니다.
      </P>
      <WarnBox>
        실패 메시지 DLQ는 <b>SQS 큐 자체에</b> 설정한다 — <b>Lambda의 DLQ 설정은 비동기 호출
        전용</b>이라 ESM에서는 동작하지 않음(핵심 함정). 대안은 Lambda Destination.
      </WarnBox>

      <SubTitle>스케일링 요약</SubTitle>
      <Table
        head={["소스", "동시성 / 스케일링", "순서 보장"]}
        rows={[
          [
            "Kinesis / DDB Streams",
            <>
              샤드당 호출 1개 · 병렬화 시 <b>샤드당 최대 10개 배치</b>
            </>,
            "샤드(병렬화 시 파티션 키) 수준",
          ],
          [
            "SQS Standard",
            <>
              <b>5개 동시 호출로 시작 → 분당 최대 300개 추가 → 최대 1,250 동시 호출</b> (Standard
              모드 기준)
            </>,
            "없음",
          ],
          [
            "SQS FIFO",
            <>
              <b>활성 메시지 그룹(GroupID) 수</b>만큼 스케일링
            </>,
            "메시지 그룹 ID 수준",
          ],
        ]}
      />
      <Note>
        SQS Standard의 &ldquo;분당 60개 추가·최대 1,000&rdquo;은 구버전 규칙 — 현행 공식 문서는 5
        시작·+300/분·최대 1,250이다.
      </Note>
      <ExamPoint>
        <ExamLi>
          구분법: <b>S3·SNS·EventBridge = 비동기(푸시)</b> vs <b>Kinesis·DDB Streams·SQS =
          ESM(폴링·동기)</b> — 이 구분 자체가 최다 빈출.
        </ExamLi>
        <ExamLi>&ldquo;불량 레코드가 샤드를 막는다&rdquo; → bisect batch on error + 재시도 제한 + 실패 대상 지정.</ExamLi>
      </ExamPoint>
    </Sec>
  );
}

/* ── 05 이벤트 & 컨텍스트 객체 ────────────────────────────────────── */

function EventCtxSection() {
  return (
    <Sec
      num="05"
      title="이벤트 & 컨텍스트 객체"
      sub="handler(event, context) — 데이터 vs 메타데이터"
      freq="lo"
      freqLabel="보통 ★☆☆ · 구분 문제"
    >
      <P>
        핸들러는 <b>이벤트 객체</b>(호출 서비스가 보낸 <b>데이터</b> — Records, source, 요청
        본문)와 <b>컨텍스트 객체</b>(호출·런타임 <b>메타데이터</b> — <Code>aws_request_id</Code>,{" "}
        <Code>function_name</Code>, <Code>memory_limit_in_mb</Code>, 로그 그룹/스트림)를 받습니다.
      </P>
      <P>
        <Code>context.get_remaining_time_in_millis()</Code>로 <b>남은 실행 시간</b>을 확인해
        타임아웃 직전 정리 작업을 구현할 수 있습니다(시험 포인트).
      </P>
      <CodeBlock title="Python — 두 객체 사용 예">{`def lambda_handler(event, context):
    print("Event:", event)                      # 서비스가 보낸 데이터
    print("Request ID:", context.aws_request_id)
    print("남은 시간(ms):", context.get_remaining_time_in_millis())
    return {"statusCode": 200}`}</CodeBlock>
    </Sec>
  );
}

/* ── 06 Destinations ─────────────────────────────────────────────── */

function DestSection() {
  return (
    <Sec
      num="06"
      title="Lambda Destinations"
      sub="성공/실패 결과 라우팅 — DLQ와의 비교"
      freq="mid"
      freqLabel="빈출 ★★☆ · DLQ 비교 단골"
    >
      <P>
        <b>Destinations</b>는 호출 결과를 다른 서비스로 보냅니다. ① <b>비동기 호출</b>:
        성공/실패 각각에 <b>SQS · SNS · Lambda · EventBridge</b>(4종) 지정 ② <b>이벤트 소스
        매핑</b>: 처리 불가로 폐기된 배치를 SQS/SNS로.
      </P>
      <Table
        head={["항목", "DLQ", "Destinations"]}
        rows={[
          ["적용 범위", "비동기 호출의 '실패'만", "비동기 성공+실패 모두 + ESM 폐기 배치"],
          ["대상", "SQS · SNS (2종)", "SQS · SNS · Lambda · EventBridge (4종)"],
          ["전송 정보", "이벤트 본문 위주", "호출 컨텍스트·응답 등 더 풍부"],
          [
            "위상",
            "먼저 나온 기능",
            <>
              공식 문서상 DLQ의 <b>대안</b> — 성공/실패 모두 지원 + 풍부한 컨텍스트가 이점
            </>,
          ],
        ]}
      />
      <ExamPoint>
        <ExamLi>&ldquo;실패 이벤트를 더 많은 컨텍스트와 함께 라우팅&rdquo; → Destinations.</ExamLi>
        <ExamLi>&ldquo;성공 결과도 라우팅하려면?&rdquo; → Destinations (DLQ는 불가).</ExamLi>
      </ExamPoint>
    </Sec>
  );
}

/* ── 07 권한 ─────────────────────────────────────────────────────── */

function PermissionSvg() {
  return (
    <svg viewBox="0 0 700 190" style={{ width: "100%", height: "auto" }} role="img">
      <rect x="30" y="25" width="150" height="50" rx="10" fill={C.card} stroke={C.amber} strokeWidth="1.6" />
      <text x="105" y="55" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.amberText}>
        Lambda 함수
      </text>
      <rect x="470" y="25" width="200" height="50" rx="10" fill={C.blueSoft} stroke={C.blue} strokeWidth="1.5" />
      <text x="570" y="48" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={C.ink}>
        S3 · DynamoDB · SQS …
      </text>
      <text x="570" y="65" textAnchor="middle" fontSize="9.5" fill={C.inkSoft}>
        읽기/쓰기 (나가는 방향)
      </text>
      <line x1="180" y1="50" x2="470" y2="50" stroke={C.amber} strokeWidth="2" />
      <text x="325" y="40" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.amberText}>
        실행 역할 (Execution Role)
      </text>
      <rect x="30" y="115" width="200" height="50" rx="10" fill={C.tealSoft} stroke={C.teal} strokeWidth="1.5" />
      <text x="130" y="138" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={C.ink}>
        다른 서비스 · 다른 계정
      </text>
      <text x="130" y="155" textAnchor="middle" fontSize="9.5" fill={C.inkSoft}>
        S3 이벤트, ALB, 계정 B …
      </text>
      <rect x="520" y="115" width="150" height="50" rx="10" fill={C.card} stroke={C.amber} strokeWidth="1.6" />
      <text x="595" y="145" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.amberText}>
        함수 호출
      </text>
      <line x1="230" y1="140" x2="520" y2="140" stroke={C.teal} strokeWidth="2" />
      <text x="375" y="130" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.teal}>
        리소스 기반 정책 (들어오는 방향)
      </text>
    </svg>
  );
}

function PermSection() {
  return (
    <Sec
      num="07"
      title="권한 — 실행 역할 vs 리소스 기반 정책"
      sub="권한이 나가느냐, 들어오느냐"
      freq="hi"
      freqLabel="최빈출 ★★★ · 방향 구분이 정답 키"
    >
      <Fig caption="나가는 권한 = 실행 역할, 들어오는 호출 권한 = 리소스 기반 정책.">
        <PermissionSvg />
      </Fig>
      <P>
        함수에는 <b>반드시 하나의 IAM 실행 역할</b>을 연결합니다. <b>이벤트 소스 매핑</b>을 쓰는
        경우 폴링 주체가 Lambda이므로 <b>소스를 읽는 권한도 실행 역할</b>에 있어야 합니다. 반대로
        S3 이벤트 알림처럼 서비스가 함수를 <b>직접 호출(푸시)</b>하는 경우는 <b>리소스 기반
        정책</b>이 필요합니다. 동일 계정에서는 IAM 정책 또는 리소스 정책 중 하나만 허용해도 호출
        가능합니다.
      </P>
      <P>
        자주 쓰는 관리형 정책: <Code>AWSLambdaBasicExecutionRole</Code>(CloudWatch Logs),{" "}
        <Code>AWSLambdaKinesisExecutionRole</Code>, <Code>AWSLambdaDynamoDBExecutionRole</Code>,{" "}
        <Code>AWSLambdaSQSQueueExecutionRole</Code>, <Code>AWSLambdaVPCAccessExecutionRole</Code>,{" "}
        <Code>AWSXRayDaemonWriteAccess</Code>.
      </P>
      <ExamPoint>
        <ExamLi>서비스가 함수를 직접 호출(푸시) → 리소스 기반 정책. Lambda가 폴링(ESM) → 실행 역할. 이 한 줄이 권한 문제의 정답 키.</ExamLi>
        <ExamLi>&ldquo;S3 이벤트가 함수를 못 부른다&rdquo; → 리소스 기반 정책 부재.</ExamLi>
      </ExamPoint>
    </Sec>
  );
}

/* ── 08 환경 변수 ─────────────────────────────────────────────────── */

function EnvSection() {
  return (
    <Sec
      num="08"
      title="환경 변수"
      sub="4KB 한도 · KMS 암호화"
      freq="lo"
      freqLabel="보통 ★☆☆ · 설정 관리"
    >
      <P>
        환경 변수는 문자열 키/값으로, <b>코드를 재배포하지 않고</b> 함수 동작을 조정합니다. 총
        용량 <b>4KB</b>. 비밀 값은 <b>KMS 암호화</b>(Lambda 서비스 키 또는 고객 관리형 키)하거나{" "}
        <b>Secrets Manager / SSM Parameter Store</b>를 참조합니다.
      </P>
      <ExamPoint>
        <ExamLi>&ldquo;환경별(dev/prod) 설정을 코드 수정 없이&rdquo; → 환경 변수.</ExamLi>
        <ExamLi>&ldquo;환경 변수에 DB 비밀번호&rdquo; → KMS 암호화 / Secrets Manager.</ExamLi>
      </ExamPoint>
    </Sec>
  );
}

/* ── 09 모니터링 & X-Ray ─────────────────────────────────────────── */

function MonSection() {
  return (
    <Sec
      num="09"
      title="모니터링 & X-Ray 추적"
      sub="CloudWatch 지표와 X-Ray 환경 변수"
      freq="mid"
      freqLabel="빈출 ★★☆ · 환경 변수 그대로 출제"
    >
      <P>
        실행 로그는 <b>CloudWatch Logs에 자동 저장</b>됩니다 — 단, 실행 역할에 로그 쓰기
        권한(<Code>AWSLambdaBasicExecutionRole</Code>)이 있어야 합니다. 주요 지표: Invocations,
        Duration, Concurrent Executions, Errors, Throttles, DeadLetterErrors,{" "}
        <b>IteratorAge</b>(스트림 처리 지연 확인).
      </P>
      <P>
        <b>X-Ray</b>: 구성에서 <b>Active Tracing</b>을 켜면 Lambda가 X-Ray 데몬을 대신 실행하고,
        코드에서는 X-Ray SDK만 사용합니다. 실행 역할에 <Code>AWSXRayDaemonWriteAccess</Code> 필요.
      </P>
      <Table
        head={["X-Ray 환경 변수", "의미"]}
        rows={[
          [<Code>_X_AMZN_TRACE_ID</Code>, "추적 헤더(트레이스 ID)"],
          [
            <Code>AWS_XRAY_CONTEXT_MISSING</Code>,
            <>
              컨텍스트 누락 시 동작 — 기본값 <Code>LOG_ERROR</Code>
            </>,
          ],
          [<Code>AWS_XRAY_DAEMON_ADDRESS</Code>, "X-Ray 데몬의 IP:PORT"],
        ]}
      />
      <Note>
        보완: <b>CodeGuru Profiler</b>(지원 언어 Java·Python)를 콘솔에서 활성화하면 Profiler
        Group 생성 + 레이어·환경 변수 자동 추가 + 실행 역할에{" "}
        <Code>AmazonCodeGuruProfilerAgentAccess</Code> 부여로 런타임 성능 인사이트를 얻는다.
      </Note>
    </Sec>
  );
}

/* ── 10 Lambda@Edge & CloudFront Functions ───────────────────────── */

function EdgeSection() {
  return (
    <Sec
      num="10"
      title="Lambda@Edge & CloudFront Functions"
      sub="엣지에서 요청/응답 변형 — 비교표 암기"
      freq="mid"
      freqLabel="빈출 ★★☆ · 선택 기준 문제"
    >
      <P>
        CloudFront의 4개 후크 지점 — ① Viewer Request ② Origin Request ③ Origin Response ④
        Viewer Response. <b>CloudFront Functions는 ①④(Viewer 쪽)만</b>, <b>Lambda@Edge는 ①~④
        전부</b>에 개입합니다.
      </P>
      <Table
        head={["항목", "CloudFront Functions", "Lambda@Edge"]}
        rows={[
          ["런타임", "JavaScript 전용", "Node.js, Python"],
          ["규모", "초당 수백만 요청", "리전당 초당 최대 10,000 요청"],
          ["트리거", "Viewer Request/Response만", "4개 지점 전부"],
          ["최대 실행 시간", "1ms 미만", <>최대 <b>30초</b> (viewer·origin 공통 — 과거 viewer 5초 제한 폐지)</>],
          ["메모리", "2MB", "viewer 128MB 고정 / origin 최대 10,240MB"],
          ["코드 크기", "10KB", <><b>50MB</b> (viewer·origin 공통 — 과거 viewer 1MB 제한 폐지)</>],
          ["네트워크·파일시스템·바디 접근", "불가", "가능"],
          ["가격", "무료 티어 있음 · @Edge 대비 약 1/6", "무료 티어 없음"],
        ]}
      />
      <P>
        <b>Lambda@Edge는 us-east-1에서 작성</b>하면 CloudFront가 전 세계 엣지로 복제합니다. 사용
        사례 — CloudFront Functions: 캐시 키 정규화·헤더 조작·URL 재작성·초경량 인증(JWT).
        Lambda@Edge: 수 ms 이상 로직, 외부 서비스·파일시스템·바디 접근, 서드파티 라이브러리.
      </P>
      <ExamPoint>
        <ExamLi>&ldquo;1ms 미만·뷰어 단계·초경량&rdquo; → CloudFront Functions. &ldquo;오리진 단계·네트워크/바디 필요&rdquo; → Lambda@Edge.</ExamLi>
        <ExamLi>Lambda@Edge = us-east-1 작성 → 엣지 복제.</ExamLi>
      </ExamPoint>
    </Sec>
  );
}

/* ── 11 VPC의 Lambda ─────────────────────────────────────────────── */

function VpcSection() {
  return (
    <Sec
      num="11"
      title="VPC의 Lambda"
      sub="ENI · 퍼블릭 서브넷 함정 · NAT"
      freq="hi"
      freqLabel="최빈출 ★★★ · 초빈출 함정 포함"
    >
      <P>
        기본적으로 Lambda는 <b>AWS 소유 VPC(내 VPC 밖)</b>에서 실행됩니다 — 퍼블릭 인터넷·퍼블릭
        API·DynamoDB에는 접근되지만, <b>내 VPC 안의 리소스(RDS, ElastiCache, 내부 ELB)에는 접근
        불가</b>. VPC ID·서브넷·보안 그룹을 지정하면 Lambda가 서브넷에 <b>ENI</b>를 생성해 VPC
        리소스에 접근하며, 실행 역할에 <Code>AWSLambdaVPCAccessExecutionRole</Code>이 필요합니다.
      </P>
      <WarnBox>
        <b>퍼블릭 서브넷에 배치해도 Lambda는 공인 IP를 갖지 못하며 인터넷에 접근할 수 없다</b> —
        EC2와 다른 점이자 가장 유명한 시험 함정. 인터넷이 필요하면 <b>프라이빗 서브넷 + NAT
        Gateway/Instance</b>.
      </WarnBox>
      <P>
        AWS 서비스에는 NAT 없이 <b>VPC 엔드포인트</b>로 프라이빗 접근할 수 있습니다(예: DynamoDB
        Gateway Endpoint). <b>CloudWatch Logs 전송은 NAT·엔드포인트 없이도 동작</b>합니다.
      </P>
    </Sec>
  );
}

/* ── 12 함수 성능 ─────────────────────────────────────────────────── */

function PerfSection() {
  return (
    <Sec
      num="12"
      title="함수 성능 — 메모리·타임아웃·실행 컨텍스트"
      sub="RAM↑ = vCPU↑ · 1,769MB = 1 vCPU"
      freq="hi"
      freqLabel="최빈출 ★★★ · 수치와 코드 패턴"
    >
      <P>
        RAM은 <b>128MB~10,240MB, 1MB 단위</b>. CPU는 직접 설정할 수 없고 <b>RAM에 비례해
        할당</b>됩니다 — 약 <b>1,769MB에서 1 vCPU 상당</b>에 도달하고, 그 이상은{" "}
        <b>멀티스레딩 코드를 작성해야 활용</b>됩니다. &ldquo;CPU 바운드 작업이 느리면 → RAM을
        늘려라&rdquo;가 정답 패턴입니다.
      </P>
      <Note>과거 자료의 &ldquo;1,792MB&rdquo;는 오기 — 공식 문서 기준 1,769MB.</Note>
      <P>
        타임아웃: 기본 <b>3초</b>, 최대 <b>900초(15분)</b>. 15분 초과 작업은 Lambda 부적합 —
        Fargate/ECS/Batch 또는 Step Functions 분할이 정답입니다.
      </P>

      <SubTitle>실행 컨텍스트 재사용 (코드 문제 단골)</SubTitle>
      <P>
        실행 컨텍스트는 일정 시간 유지되어 다음 호출에서 재사용됩니다. DB 연결·SDK 클라이언트 등
        무거운 초기화는 <b>핸들러 밖</b>에 둡니다.
      </P>
      <CodeBlock title="✗ BAD — 매 호출마다 연결 생성">{`def get_user_handler(event, context):
    db = db_connect()          # 호출될 때마다 연결 생성 → 느림
    return db.get(event["id"])`}</CodeBlock>
      <CodeBlock title="✓ GOOD — 핸들러 밖 1회 초기화, 컨텍스트 재사용">{`db = db_connect()              # INIT에서 1회 실행, 웜 호출에서 재사용

def get_user_handler(event, context):
    return db.get(event["id"])`}</CodeBlock>
      <P>
        <b>/tmp</b>: 임시 디스크 <b>512MB~10GB</b>. 실행 컨텍스트가 유지되는 동안 내용이 남아
        캐시처럼 쓸 수 있지만 영구 저장은 S3로. /tmp 암호화가 필요하면 KMS Data Key를 직접
        생성합니다.
      </P>
    </Sec>
  );
}

/* ── 13 동시성 & 콜드 스타트 ─────────────────────────────────────── */

function ConcSection() {
  return (
    <Sec
      num="13"
      title="동시성 & 콜드 스타트"
      sub="Reserved vs Provisioned · 스로틀 동작"
      freq="hi"
      freqLabel="최빈출 ★★★ · 시나리오 단골"
    >
      <P>
        계정(리전)당 동시 실행 기본 한도 <b>1,000</b>(상향 요청 가능). 함수별{" "}
        <b>예약 동시성(Reserved Concurrency)</b>은 그 함수의 동시 실행 상한을 지정해 격리합니다 —
        무료. 한 함수가 폭주해 계정 풀 1,000을 다 쓰면 <b>같은 계정의 다른 모든 함수가
        스로틀</b>됩니다(예약 동시성이 필요한 이유이자 시험 시나리오 단골).
      </P>
      <Table
        head={["상황", "동작"]}
        rows={[
          ["동기 호출 스로틀", <>즉시 <b>429 ThrottleError</b> 반환 — 재시도는 호출자 책임</>],
          [
            "비동기 호출 스로틀·시스템 오류",
            <>
              이벤트를 큐로 되돌려 <b>최대 6시간</b> 재시도 — 지수 백오프 1초→최대 5분
            </>,
          ],
        ]}
      />
      <P>
        <b>콜드 스타트</b>: 새 실행 환경 기동 시 코드 로드 + 핸들러 밖 초기화(INIT)가 실행되어 첫
        요청이 지연됩니다 — 지연 폭은 런타임·초기화 코드·패키지 크기에 따라 가변(통상 수백 ms~수
        초). <b>프로비저닝된 동시성(Provisioned Concurrency)</b>은 호출 전에 실행 환경을 미리
        초기화해 콜드 스타트를 제거하며(유료), <b>Application Auto Scaling</b>의 스케줄/사용률
        기반 관리와 결합합니다. 게시된 <b>버전/별칭에만</b> 설정할 수 있습니다($LATEST 불가).
      </P>
      <Note>
        보완: <b>SnapStart</b>는 초기화 완료 스냅샷에서 실행 환경을 복원해 콜드 스타트를 줄인다 —
        Java 11+ 외에 Python 3.12+, .NET 8+도 현행 지원.
      </Note>
      <ExamPoint>
        <ExamLi>&ldquo;한 함수 폭주가 다른 함수를 스로틀&rdquo; → Reserved Concurrency로 격리.</ExamLi>
        <ExamLi>&ldquo;예측 가능한 피크의 콜드 스타트 제거&rdquo; → Provisioned Concurrency + AAS 스케줄.</ExamLi>
        <ExamLi>Reserved = 한도 보장(무료), Provisioned = 미리 데워둠(유료) — 역할 구분.</ExamLi>
      </ExamPoint>
    </Sec>
  );
}

/* ── 14 레이어 & 스토리지 옵션 ────────────────────────────────────── */

function LayersSection() {
  return (
    <Sec
      num="14"
      title="레이어 & 스토리지 옵션 (EFS 포함)"
      sub="종속성 재사용과 4가지 스토리지 비교"
      freq="mid"
      freqLabel="빈출 ★★☆ · 비교표 통째로 출제"
    >
      <P>
        <b>레이어(Layers)</b>의 용도: ① 커스텀 런타임(C++, Rust) ② <b>종속성 재사용</b> — 무거운
        라이브러리를 분리해 함수 패키지를 가볍게 하고 여러 함수가 공유. 한도:{" "}
        <b>함수당 최대 5개</b>, 함수+레이어 압축 해제 합산 <b>250MB</b>.
      </P>
      <P>
        <b>EFS 마운트</b>: VPC 안에서 실행될 때 같은 VPC의 EFS를 로컬 경로에 마운트 —{" "}
        <b>EFS Access Point 필수</b>. 함수 인스턴스 하나가 연결 1개를 쓰므로 동시성 폭증 시 EFS
        연결·버스트 한도에 주의.
      </P>
      <Table
        head={["항목", "/tmp", "레이어", "S3", "EFS"]}
        rows={[
          ["최대 크기", "10,240MB", "5개 · 총 250MB", "무제한", "무제한"],
          ["지속성", "임시", "불변", "영구", "영구"],
          ["함수 간 공유", "불가", "가능", "가능(API)", "가능(파일시스템)"],
          ["접근 방식", "파일시스템", "런타임 포함", "AWS SDK", "VPC + Access Point"],
        ]}
      />
    </Sec>
  );
}

/* ── 15 배포 — 종속성 · CloudFormation · 컨테이너 ─────────────────── */

function DeploySection() {
  return (
    <Sec
      num="15"
      title="배포 — 종속성 · CloudFormation · 컨테이너 이미지"
      sub="zip 50MB · S3ObjectVersion 함정 · Runtime API"
      freq="mid"
      freqLabel="빈출 ★★☆ · CFN 함정 주의"
    >
      <SubTitle>외부 종속성 패키징</SubTitle>
      <P>
        외부 라이브러리는 코드와 함께 zip으로 패키징합니다. zip <b>50MB 미만</b>이면 직접 업로드,
        초과하면 <b>S3에 올린 뒤 참조</b>. 네이티브 라이브러리는 Amazon Linux에서 컴파일해야
        하고, <b>AWS SDK는 기본 포함</b>이라 별도 패키징이 불필요합니다(시험 포인트).
      </P>

      <SubTitle>CloudFormation 배포 2방식</SubTitle>
      <P>
        ① <b>인라인</b>(<Code>Code.ZipFile</Code>): 간단한 함수용 — <b>외부 종속성 포함
        불가</b>. ② <b>S3 참조</b>: <Code>S3Bucket</Code>·<Code>S3Key</Code>·
        <Code>S3ObjectVersion</Code>.
      </P>
      <WarnBox>
        S3의 코드만 새로 올리고 템플릿의 버킷/키/버전을 안 바꾸면 <b>CloudFormation은 함수를
        업데이트하지 않는다</b> — 버킷 버저닝 활성화 + <b>S3ObjectVersion을 매번 갱신</b>이 정답.
        다중 계정 배포는 S3 버킷 정책(다른 계정 허용) + 각 계정 CFN 실행 역할의 S3 읽기 권한
        둘 다 필요.
      </WarnBox>

      <SubTitle>컨테이너 이미지</SubTitle>
      <P>
        함수를 컨테이너 이미지로 배포 — 최대 <b>10GB</b>, 이미지는 <b>ECR</b>에 저장. 이미지는
        반드시 <b>Lambda Runtime API를 구현</b>해야 하며(AWS 제공 베이스 이미지 사용 권장),{" "}
        <b>Lambda Runtime Interface Emulator(RIE)</b>로 로컬 테스트가 가능합니다. 모범 사례:
        멀티 스테이지 빌드, 안정적인 레이어 → 자주 바뀌는 레이어 순 배치.
      </P>
    </Sec>
  );
}

/* ── 16 버전 & Alias ─────────────────────────────────────────────── */

function VersionsSection() {
  return (
    <Sec
      num="16"
      title="버전 & Alias"
      sub="불변 버전 · 가변 별칭 · 가중치 카나리"
      freq="hi"
      freqLabel="최빈출 ★★★ · 그대로 암기"
    >
      <P>
        작업 중인 함수는 <Code>$LATEST</Code> — <b>가변</b>. <b>게시(publish)</b>하면 V1, V2 …
        버전이 생성되며 <b>불변</b>입니다(코드+구성이 고정, 고유 ARN). <b>Alias</b>는 버전을
        가리키는 <b>가변 포인터</b>로 dev/test/prod처럼 운영하며, 사용자에게 안정적인 ARN을
        제공한 채 뒤의 버전만 교체(블루/그린)합니다.
      </P>
      <Table
        head={["규칙", "내용"]}
        rows={[
          [
            "가중치 라우팅",
            <>
              예: V1 95% / V2 5% 카나리 — <b>최대 2개 버전</b> 사이에서만 분배
            </>,
          ],
          ["별칭 → 별칭", <><b>불가</b> — 별칭은 버전만 가리킨다(문장 그대로 출제)</>],
          [
            "$LATEST 제약",
            <>
              가중치 트래픽·Provisioned Concurrency는 <b>게시된 버전/별칭에만</b> — $LATEST 불가
            </>,
          ],
        ]}
      />
      <ExamPoint>
        <ExamLi>&ldquo;안전한 점진 배포&rdquo; → 버전 게시 + 별칭 가중치 + CodeDeploy.</ExamLi>
      </ExamPoint>
    </Sec>
  );
}

/* ── 17 CodeDeploy ───────────────────────────────────────────────── */

function CodeDeploySection() {
  return (
    <Sec
      num="17"
      title="CodeDeploy 트래픽 전환"
      sub="Linear · Canary · AllAtOnce + 자동 롤백"
      freq="mid"
      freqLabel="빈출 ★★☆ · 전략 이름 구분"
    >
      <P>
        CodeDeploy는 Lambda <b>Alias의 트래픽 전환을 자동화</b>합니다(SAM 프레임워크 통합).
      </P>
      <Table
        head={["전략", "동작", "예시"]}
        rows={[
          [
            "Linear",
            "N분마다 일정 비율씩 증가",
            <>
              <Code>Linear10PercentEvery3Minutes</Code>
            </>,
          ],
          [
            "Canary",
            "X%로 시험 후 → 한 번에 100%",
            <>
              <Code>Canary10Percent5Minutes</Code>
            </>,
          ],
          ["AllAtOnce", "즉시 100% 전환 (가장 빠르고 위험)", "—"],
        ]}
      />
      <P>
        <b>Pre/Post Traffic Hook</b>(Lambda 함수)으로 배포 전후를 검증하고, <b>CloudWatch
        Alarm</b>이 울리면 <b>자동 롤백</b>합니다. AppSpec 필수 4필드:{" "}
        <b>Name · Alias · CurrentVersion · TargetVersion</b>.
      </P>
    </Sec>
  );
}

/* ── 18 함수 URL ─────────────────────────────────────────────────── */

function FurlSection() {
  return (
    <Sec
      num="18"
      title="Lambda 함수 URL"
      sub="게이트웨이 없이 전용 HTTPS 엔드포인트"
      freq="lo"
      freqLabel="보통 ★☆☆ · AuthType 구분"
    >
      <P>
        API Gateway·ALB 없이 Lambda에 전용 HTTPS 엔드포인트를 부여합니다 —{" "}
        <Code>https://&#123;url-id&#125;.lambda-url.&#123;region&#125;.on.aws</Code> (고유·불변,
        IPv4·IPv6). <b>alias 또는 $LATEST</b>에만 설정 가능(특정 버전 불가). CORS 설정을
        지원하고, 접근 제어는 <b>리소스 기반 정책</b>(계정·IP CIDR), 트래픽 제한은 Reserved
        Concurrency로 합니다. 퍼블릭 인터넷을 통한 접근용 기능입니다.
      </P>
      <Table
        head={["AuthType", "동작"]}
        rows={[
          ["NONE", "인증 없이 퍼블릭 — 단, 리소스 기반 정책이 허용을 명시해야 함"],
          [
            "AWS_IAM",
            "IAM으로 인증·인가. 동일 계정: IAM 정책 또는 리소스 정책 중 하나면 허용. 교차 계정: 둘 다 필요한 것으로 알려짐",
          ],
        ]}
      />
      <Note>
        부기(미검증): &ldquo;PrivateLink(VPC 전용 접근) 미지원&rdquo;과 교차 계정 AND 조건은 현행
        공식 문서에서 명시 스니펫이 확인되지 않았다(축2 리포트) — 시험 대비로는 &ldquo;함수 URL =
        퍼블릭 엔드포인트&rdquo; 수준으로 기억.
      </Note>
    </Sec>
  );
}

/* ── 19 보충 — 익스텐션 · 테스트 · 스트리밍 변환 ──────────────────── */

function SupplementSection() {
  return (
    <Sec
      num="19"
      title="익스텐션 · 테스트 · 준실시간 변환 (보충)"
      sub="원본 미커버 항목 — Task 1.2 키워드 보강"
      freq="lo"
      freqLabel="보통 ★☆☆ · 커버리지 보강"
    >
      <SubTitle>Lambda 익스텐션 (Extensions API)</SubTitle>
      <P>
        모니터링·관측성·보안 에이전트를 함수 실행 환경에 통합하는 방법입니다. <b>내부
        익스텐션</b>은 런타임 프로세스 안에서, <b>외부 익스텐션</b>은 별도 프로세스로 실행 환경
        수명 주기(INIT → INVOKE → SHUTDOWN)에 후크되어 함수 코드와 독립적으로 동작합니다 —
        APM 에이전트·시크릿 캐싱·로그 전송이 대표 사례입니다.
      </P>
      <SubTitle>테스트 — SAM 로컬 & 단위 테스트</SubTitle>
      <P>
        <b>SAM CLI</b>로 로컬 테스트: <Code>sam local invoke</Code>(이벤트 파일로 1회 호출),{" "}
        <Code>sam local start-api</Code>(로컬 API Gateway 에뮬레이션). 컨테이너 이미지는{" "}
        <b>RIE</b>로 로컬 실행. 단위 테스트는 비즈니스 로직을 핸들러에서 분리해 순수 함수로 두고
        핸들러는 얇게 유지하는 것이 정석입니다.
      </P>
      <SubTitle>Kinesis Data Firehose 준실시간 변환</SubTitle>
      <P>
        Firehose는 버퍼링한 레코드 배치를 Lambda로 보내 <b>변환(포맷 변경·필터링·보강)</b> 후
        전달할 수 있습니다. 함수는 각 레코드에 대해 <Code>recordId</Code>, 처리 결과(
        <Code>Ok</Code> / <Code>Dropped</Code> / <Code>ProcessingFailed</Code>), 변환된{" "}
        <Code>data</Code>를 반환합니다 — &ldquo;준실시간(near real-time) 데이터 변환&rdquo;
        키워드의 정답 패턴.
      </P>
    </Sec>
  );
}

/* ── 20 한도 총정리 & 시나리오 패턴 ──────────────────────────────── */

function LimitsSection() {
  return (
    <Sec
      num="20"
      title="한도 총정리 & 시나리오 → 정답 패턴"
      sub="숫자 암기표 — 리전당 적용"
      freq="hi"
      freqLabel="최빈출 ★★★ · 숫자 그대로 출제"
    >
      <Table
        head={["항목", "값", "시험에서의 활용"]}
        rows={[
          ["메모리", "128MB ~ 10,240MB (1MB 단위)", "RAM↑=vCPU↑ · 1,769MB ≈ 1 vCPU"],
          ["실행 시간", "기본 3초 · 최대 900초(15분)", "초과 → Step Functions / ECS·Fargate·Batch"],
          ["/tmp", "512MB ~ 10,240MB", "임시 파일 — 웜 호출 간 유지될 수 있으나 영속 아님"],
          ["환경 변수", "총 4KB", "큰 설정·비밀 → SSM / Secrets Manager"],
          [
            "배포 패키지",
            "zip 50MB / 해제 250MB / 컨테이너 10GB",
            "초과 → S3 경유·레이어·컨테이너 이미지",
          ],
          ["동시성", "계정·리전당 1,000 (소프트)", "초과 = 429 스로틀 · 상향 요청 가능"],
          ["레이어", "함수당 최대 5개", "해제 250MB 합산에 포함"],
          [
            "페이로드",
            <>
              동기 <b>6MB</b>(요청·응답 각각) / 비동기 <b>1MB</b> / 스트리밍 응답 200MB
            </>,
            "큰 데이터는 S3에 두고 참조 전달",
          ],
          ["비동기 재시도", "2회 (총 3회 시도)", "멱등성 설계 + DLQ/Destinations"],
          ["별칭 가중치", "버전 2개까지", "카나리 배포"],
        ]}
      />
      <Note>
        &ldquo;비동기 페이로드 256KB&rdquo;는 SQS 메시지 한도와 혼동한 구식 수치 — 현행 공식
        문서는 비동기 1MB.
      </Note>

      <SubTitle>자주 나오는 시나리오 → 정답 패턴</SubTitle>
      <Table
        head={["시나리오", "정답 패턴"]}
        rows={[
          ["콜드 스타트로 API 지연", "Provisioned Concurrency (버전/별칭에 설정)"],
          ["한 함수 폭주가 다른 함수 스로틀 유발", "Reserved Concurrency로 격리"],
          ["비동기 실패 이벤트 분석 필요", "Lambda Destinations (성공/실패 모두 + 풍부한 컨텍스트)"],
          ["S3 이벤트가 함수를 못 부름", "리소스 기반 정책 부재"],
          ["VPC 함수가 인터넷 접근 불가", "프라이빗 서브넷 + NAT Gateway"],
          ["Kinesis 불량 레코드가 샤드 블로킹", "Bisect batch on error + 재시도 제한 + 실패 대상 지정"],
          ["안전한 점진 배포", "가중치 별칭 + CodeDeploy (Canary/Linear)"],
          ["DB 연결이 호출마다 생성돼 느림", "핸들러 밖(전역) 초기화 / RDS Proxy"],
          ["시크릿을 코드에 하드코딩", "Secrets Manager 또는 SSM Parameter Store + KMS"],
        ]}
      />
      <WarnBox>
        <b>재귀 호출 금지</b>: Lambda가 자기 자신을 직접·간접 호출하는 설계는 호출이 눈덩이처럼
        불어나 비용 폭탄이 된다 — 항상 오답 선택지.
      </WarnBox>
      <ExamPoint>
        <ExamLi>&ldquo;30분 배치&rdquo; → 15분 초과, Lambda ✗. &ldquo;3GB 임시 파일&rdquo; → /tmp(10GB) ✓. &ldquo;300MB 종속성&rdquo; → 컨테이너(10GB)/EFS.</ExamLi>
      </ExamPoint>
    </Sec>
  );
}
