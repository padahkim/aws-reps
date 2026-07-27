import type { SelfQuizEntry } from "../../schema";

/**
 * ch1-2 섹션 셀프 퀴즈 (이슈 #107) — 인출 카드 아래 자기채점 덱.
 * §03·04·07·12·13·15·16 문항은 #95의 인라인 <SelfQuiz> 블록에서 이관 (내용 유지).
 * 나머지 섹션은 신규 작성 — 문항 지침(#98): 짧은 시나리오/사실 큐 + 판정 가능한
 * 1~2문장 정답, 소재 1차 원천은 각 섹션 EXAM POINT.
 * ch1-2 인출 카드(session.ts)는 별도 이슈 몫 — 작성 시 문장 재탕 금지 규칙 적용.
 */
export const selfQuiz: SelfQuizEntry[] = [
  // ── 01 서버리스와 Lambda 개요 ─────────────────────────────────────────
  {
    section: "01",
    q: "“임의의 Docker 이미지를 그대로 Lambda에서 실행한다” — 성립하나?",
    a: "성립하지 않는다 — Lambda 컨테이너 이미지는 반드시 Lambda Runtime API를 구현해야 한다. 임의의 Docker 이미지를 실행하고 싶다면 정답은 ECS/Fargate(빈출 함정).",
    yn: "아니오",
  },
  {
    section: "01",
    q: "Lambda 과금을 결정하는 두 축은? 그리고 실행 시간·메모리의 상한은?",
    a: "요청 수 + 컴퓨팅 시간(GB-초 = RAM×초). 실행은 최대 15분, RAM은 함수당 최대 10GB — RAM을 늘리면 CPU·네트워크 성능도 함께 올라간다.",
  },

  // ── 02 호출 ① 동기식 (+ ALB 통합) ────────────────────────────────────
  {
    section: "02",
    q: "API Gateway가 동기 호출한 Lambda가 오류를 반환했다 — 재시도는 누구 책임인가?",
    a: "클라이언트(호출자) 책임 — 동기식은 결과를 즉시 돌려받으므로 재시도·지수 백오프를 호출자가 수행한다.",
  },
  {
    section: "02",
    q: "CLI로 함수를 비동기 호출하려면? 실행 없이 권한·파라미터만 검증하려면?",
    a: "--invocation-type Event(기본값 RequestResponse = 동기). 검증만은 DryRun.",
  },
  {
    section: "02",
    q: "ALB 뒤 Lambda에서 ?name=foo&name=bar 두 값을 모두 받으려면?",
    a: "ALB의 Multi-Value Headers 활성화 — 같은 이름의 쿼리 스트링·헤더가 배열(\"name\": [\"foo\",\"bar\"])로 변환된다.",
  },

  // ── 03 호출 ② 비동기식 & DLQ (인라인 이관) ────────────────────────────
  {
    section: "03",
    q: "S3 이벤트로 트리거된 Lambda가 실패했다. 기본적으로 몇 번 재시도되며, 최종 실패 이벤트를 놓치지 않으려면?",
    a: "비동기 호출이므로 2회 자동 재시도(총 3회). 최종 실패 보관은 DLQ(SQS/SNS) 또는 Destinations(onFailure)로.",
  },

  // ── 04 호출 ③ 이벤트 소스 매핑 (인라인 이관) ──────────────────────────
  {
    section: "04",
    q: "SQS 큐의 메시지를 Lambda로 처리하려 한다. 어떤 호출 모델이며, 누가 누구를 호출하는가?",
    a: "Event Source Mapping(폴링). Lambda 서비스의 폴러가 SQS를 폴링해서 배치를 만들어 함수를 '동기' 호출한다.",
  },

  // ── 05 이벤트 & 컨텍스트 객체 ─────────────────────────────────────────
  {
    section: "05",
    q: "타임아웃 직전에 정리 작업을 실행하고 싶다 — 남은 실행 시간은 어디서 얻나?",
    a: "컨텍스트 객체의 get_remaining_time_in_millis() — 호출·런타임 메타데이터는 컨텍스트 객체 소관이다.",
  },
  {
    section: "05",
    q: "S3가 보낸 Records 배열과 aws_request_id — 각각 event와 context 중 어디에 담기나?",
    a: "Records는 event(호출 서비스가 보낸 데이터), aws_request_id는 context(호출·런타임 메타데이터) — 데이터 vs 메타데이터 구분이 출제 축이다.",
  },

  // ── 06 Lambda Destinations ───────────────────────────────────────────
  {
    section: "06",
    q: "비동기 호출의 “성공” 결과도 다른 서비스로 라우팅해야 한다 — DLQ와 Destinations 중 정답은?",
    a: "Destinations — DLQ는 비동기 호출의 실패만 다룬다. Destinations는 성공/실패 각각에 대상을 지정할 수 있다.",
  },
  {
    section: "06",
    q: "DLQ와 Destinations가 보낼 수 있는 대상은 각각 몇 종인가?",
    a: "DLQ는 SQS·SNS 2종, Destinations는 SQS·SNS·Lambda·EventBridge 4종 — 전송 정보도 Destinations가 호출 컨텍스트·응답까지 더 풍부하다.",
  },

  // ── 07 권한 — 실행 역할 vs 리소스 기반 정책 (인라인 이관) ──────────────
  {
    section: "07",
    q: "Lambda가 DynamoDB 테이블을 읽을 권한은 어디에 부여하는가? 반대로 API Gateway가 Lambda를 호출할 권한은?",
    a: "나가는 권한 = Execution Role(IAM 역할). 들어오는 권한 = Lambda의 Resource-based Policy.",
  },

  // ── 08 환경 변수 ─────────────────────────────────────────────────────
  {
    section: "08",
    q: "환경 변수의 총 용량 한도는? DB 비밀번호를 환경 변수에 두려면 어떻게 하나?",
    a: "총 4KB. 비밀 값은 KMS로 암호화하거나 Secrets Manager / SSM Parameter Store를 참조한다.",
  },

  // ── 09 모니터링 & X-Ray 추적 ─────────────────────────────────────────
  {
    section: "09",
    q: "Lambda에서 X-Ray 추적을 켜는 설정과, 실행 역할에 필요한 권한은?",
    a: "구성에서 Active Tracing 활성화 — X-Ray 데몬은 Lambda가 대신 실행한다. 실행 역할에는 AWSXRayDaemonWriteAccess가 필요하다.",
  },
  {
    section: "09",
    q: "Kinesis 스트림 처리가 밀리고 있는지 확인하는 CloudWatch 지표는?",
    a: "IteratorAge — 값이 클수록 스트림 처리 지연이 쌓이고 있다는 뜻이다.",
  },
  {
    section: "09",
    q: "함수 로그가 CloudWatch Logs에 전혀 남지 않는다 — 1순위로 의심할 것은?",
    a: "실행 역할의 로그 쓰기 권한 부재 — AWSLambdaBasicExecutionRole(CloudWatch Logs 쓰기)이 있어야 자동 저장된다.",
  },

  // ── 10 Lambda@Edge & CloudFront Functions ────────────────────────────
  {
    section: "10",
    q: "“뷰어 단계에서 1ms 미만의 초경량 헤더 조작” — CloudFront Functions와 Lambda@Edge 중 정답은?",
    a: "CloudFront Functions — JavaScript 전용, Viewer Request/Response만. 오리진 단계 개입·네트워크/바디 접근이 필요하면 Lambda@Edge.",
  },
  {
    section: "10",
    q: "Lambda@Edge 함수는 어느 리전에 작성해야 하나?",
    a: "us-east-1 — 거기서 작성하면 CloudFront가 전 세계 엣지 로케이션으로 복제한다.",
  },

  // ── 11 VPC의 Lambda ──────────────────────────────────────────────────
  {
    section: "11",
    q: "VPC 연결 Lambda를 퍼블릭 서브넷에 배치하면 인터넷에 접근되나?",
    a: "안 된다 — Lambda는 퍼블릭 서브넷에서도 공인 IP를 갖지 못한다(EC2와 다른 점, 최고 빈출 함정). 인터넷이 필요하면 프라이빗 서브넷 + NAT Gateway/Instance.",
    yn: "아니오",
  },
  {
    section: "11",
    q: "함수에 VPC를 지정하면 Lambda가 서브넷에 만드는 리소스와, 실행 역할에 필요한 정책은?",
    a: "ENI를 생성한다. 실행 역할에는 AWSLambdaVPCAccessExecutionRole이 필요하다.",
  },
  {
    section: "11",
    q: "VPC 안의 Lambda가 NAT 없이 DynamoDB에 접근하려면?",
    a: "VPC 엔드포인트(DynamoDB는 Gateway Endpoint) — 참고로 CloudWatch Logs 전송은 NAT·엔드포인트 없이도 동작한다.",
  },

  // ── 12 함수 성능 (인라인 이관) ────────────────────────────────────────
  {
    section: "12",
    q: "함수 실행이 CPU 부족으로 느리다. CPU를 늘리는 방법은?",
    a: "메모리 크기를 올린다 — CPU는 메모리에 비례해 할당된다 (약 1,769MB에서 1 vCPU).",
  },
  {
    section: "12",
    q: "핸들러 밖에서 DB 커넥션을 초기화하라는 이유는?",
    a: "INIT 단계 코드는 콜드 스타트 시 1회만 실행되고 웜 호출에서 재사용되므로, 호출마다 커넥션을 새로 맺는 비용을 없앤다.",
  },
  {
    section: "12",
    q: "Lambda 최대 실행 시간은? 그보다 긴 작업은?",
    a: "900초(15분). 초과 작업은 Step Functions로 분할 오케스트레이션하거나 ECS/Fargate·Batch로.",
  },

  // ── 13 동시성 & 콜드 스타트 (인라인 이관) ─────────────────────────────
  {
    section: "13",
    q: "매일 오전 9시 트래픽 급증 시 콜드 스타트 지연을 없애려면?",
    a: "Provisioned Concurrency + Application Auto Scaling(스케줄 기반). Reserved는 한도 보장일 뿐 콜드 스타트를 없애지 못한다.",
  },
  {
    section: "13",
    q: "호출자가 429 TooManyRequestsException을 받았다. 원인은?",
    a: "스로틀링 — 동시성 한도(계정 1,000 또는 함수 Reserved 한도) 초과. 동기 호출이라 에러가 호출자에게 직접 전달된 것.",
  },

  // ── 14 레이어 & 스토리지 옵션 ─────────────────────────────────────────
  {
    section: "14",
    q: "레이어는 함수당 몇 개까지, 그리고 압축 해제 크기 한도는?",
    a: "함수당 최대 5개, 함수+레이어 압축 해제 합산 250MB — 레이어를 써도 이 합산 한도는 그대로다.",
  },
  {
    section: "14",
    q: "Lambda에 EFS를 마운트하기 위한 전제 조건 2가지는?",
    a: "① 함수가 같은 VPC 안에서 실행될 것 ② EFS Access Point를 통할 것(필수). 함수 인스턴스당 연결 1개라 동시성 폭증 시 EFS 연결 한도에 주의.",
  },

  // ── 15 배포 (인라인 이관) ─────────────────────────────────────────────
  {
    section: "15",
    q: "배포 패키지가 압축 해제 시 300MB라서 업로드가 거부된다. 해결책 2가지는?",
    a: "① 컨테이너 이미지로 배포(최대 10GB) ② 의존성을 EFS에 두고 마운트. (레이어를 써도 250MB 합산 한도는 동일)",
  },

  // ── 16 버전 & Alias (인라인 이관) ─────────────────────────────────────
  {
    section: "16",
    q: "신규 코드 버전을 전체 트래픽의 10%에만 무중단으로 노출하려면?",
    a: "버전 2개를 발행하고 별칭(Alias) 가중치 라우팅으로 90:10 분배. CodeDeploy로 자동화 + 알람 롤백 가능.",
  },

  // ── 17 CodeDeploy 트래픽 전환 ────────────────────────────────────────
  {
    section: "17",
    q: "Canary10Percent5Minutes와 Linear10PercentEvery3Minutes의 동작 차이는?",
    a: "Canary는 10%로 5분 시험한 뒤 한 번에 100% 전환, Linear는 3분마다 10%씩 점진 증가한다.",
  },
  {
    section: "17",
    q: "CodeDeploy 배포 중 문제를 감지해 자동 롤백시키는 장치는?",
    a: "CloudWatch Alarm — 울리면 자동 롤백된다. 배포 전후 검증은 Pre/Post Traffic Hook(Lambda 함수)으로.",
  },

  // ── 18 Lambda 함수 URL ───────────────────────────────────────────────
  {
    section: "18",
    q: "함수 URL을 특정 게시 버전(V2)에 설정할 수 있나?",
    a: "불가 — 함수 URL은 alias 또는 $LATEST에만 설정할 수 있다.",
    yn: "아니오",
  },
  {
    section: "18",
    q: "AuthType을 NONE으로 했는데도 함수 URL 접근이 거부된다 — 무엇을 확인하나?",
    a: "리소스 기반 정책 — NONE이라도 정책이 퍼블릭 허용을 명시해야 한다. AWS_IAM이면 동일 계정은 IAM 정책 또는 리소스 정책 중 하나로 충분.",
  },

  // ── 19 익스텐션 · 테스트 · 준실시간 변환 ──────────────────────────────
  {
    section: "19",
    q: "sam local invoke와 sam local start-api의 용도 구분은?",
    a: "invoke는 이벤트 파일로 함수를 1회 호출, start-api는 로컬에서 API Gateway를 에뮬레이션한다. 컨테이너 이미지는 RIE로 로컬 실행.",
  },
  {
    section: "19",
    q: "“준실시간(near real-time) 데이터 변환” 키워드의 정답 패턴은?",
    a: "Kinesis Data Firehose + Lambda 변환 — 함수는 레코드마다 recordId와 처리 결과(Ok/Dropped/ProcessingFailed), 변환된 data를 반환한다.",
  },

  // ── 20 한도 총정리 & 시나리오 → 정답 패턴 ─────────────────────────────
  {
    section: "20",
    q: "동기 호출과 비동기 호출의 페이로드 한도는 각각?",
    a: "동기 6MB(요청·응답 각각), 비동기 1MB — 큰 데이터는 S3에 두고 참조를 전달한다. (“비동기 256KB”는 SQS 한도와 혼동한 구식 수치)",
  },
  {
    section: "20",
    q: "“30분 걸리는 배치 작업을 Lambda로” — 판단과 대안은?",
    a: "부적합 — 최대 900초(15분) 한도 초과. Step Functions로 분할하거나 ECS/Fargate·Batch가 정답.",
  },
  {
    section: "20",
    q: "Lambda가 자기 자신을 직접·간접 호출하는 설계가 선택지에 있다 — 판단은?",
    a: "항상 오답 — 재귀 호출은 호출이 눈덩이처럼 불어나 비용 폭탄이 된다.",
  },
];
