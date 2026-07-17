import type { ChapterMeta, Question } from "../../schema";

/**
 * 원본: content/aws-lambda-dva-guide.jsx(28섹션·최상세본)를 뼈대로,
 * content/aws-lambda-dva-guide-2.jsx(7탭 — 숫자 암기표·시나리오→정답 패턴·콜드스타트 타임라인)와
 * content/lambda-dva-study.jsx(문답 퀴즈 10문항·QUOTAS 표)를 병합 (reports/axis2 3개 리포트의
 * 「중복 관찰」: guide가 범위·상세 우세, guide-2/study는 요약·인출연습 보완재).
 * 사실 수정: reports/axis2/aws-lambda-dva-guide.md · -2.md · lambda-dva-study.md 지시 전부 반영
 * (1,769MB, SQS ESM 스케일링 현행화, Lambda@Edge 30초/50MB, 콜드스타트 수치 완화,
 * Destinations 뉘앙스, 비동기 페이로드 1MB, SnapStart 런타임 병기, 함수 URL 미검증 각주).
 * 커버리지 공백 보충(리포트 "보충 생성 목록"): Lambda 익스텐션·SAM 로컬 테스트·Firehose 변환.
 * 퀴즈: lambda-dva-study의 자유 서술형 문답 10문항을 규약 v1 mc 형식으로 변환 생성.
 */
export const chapterMeta: ChapterMeta = {
  id: "ch1-2",
  phase: "1단계 · 서버리스 핵심",
  title: "Lambda",
  domain: "Development",
  examWeight: 5,
  prerequisites: ["ch0-1", "ch0-2", "ch1-1"],
};

export const quiz: Question[] = [
  {
    id: "q1",
    scope: "final",
    concept: ["비동기 호출", "재시도", "DLQ"],
    scenario:
      "S3 이벤트로 트리거된 Lambda 함수가 오류로 실패했다. Lambda의 기본 재시도 동작과, 최종 실패 이벤트를 놓치지 않는 방법은?",
    choices: [
      "재시도 없음 — 호출자(S3)가 재전송해야 한다",
      "2회 자동 재시도(총 3회 시도) 후, DLQ 또는 실패 Destination으로 보낸다",
      "최대 6회 재시도 후 이벤트를 폐기한다",
      "성공할 때까지 무한 재시도한다",
    ],
    answer: [1],
    explanation:
      "S3 이벤트는 비동기 호출이다. 실패 시 1분 뒤, 다시 2분 뒤 — 총 3회 시도하고, 그래도 실패하면 DLQ(SQS/SNS) 또는 Destinations(onFailure)로 이벤트를 보존한다.",
    choiceExplanations: [
      "재시도 없음은 '동기 호출'의 동작이다. S3 이벤트는 비동기라 Lambda가 자동 재시도한다.",
      "정답. 비동기 재시도 정책(총 3회: 최초 + 1분 후 + 2분 후)과 실패 보관 수단.",
      "6회가 아니라 2회 재시도다. 6시간은 '스로틀·시스템 오류 시 큐 보관 최대 시간'과 혼동한 수치.",
      "무한 재시도는 Kinesis/DynamoDB Streams ESM의 기본 동작(만료 전까지)에 가깝다 — 비동기 호출과 다르다.",
    ],
  },
  {
    id: "q2",
    scope: "final",
    concept: ["이벤트 소스 매핑", "SQS"],
    scenario: "SQS 큐의 메시지를 Lambda로 처리하려 한다. 어떤 호출 모델이 사용되고, 누가 누구를 호출하는가?",
    choices: [
      "SQS가 Lambda를 비동기(push)로 호출한다",
      "Lambda 서비스의 이벤트 소스 매핑(폴러)이 큐를 폴링해 배치를 만들고 함수를 동기 호출한다",
      "SNS를 중간에 두어야만 Lambda로 전달할 수 있다",
      "EventBridge 규칙이 큐를 대신 읽어 함수를 호출한다",
    ],
    answer: [1],
    explanation:
      "SQS·Kinesis·DynamoDB Streams는 이벤트 소스 매핑(ESM) 대상이다. Lambda 서비스 내부 폴러가 롱 폴링으로 배치(1~10건)를 구성해 함수를 '동기'로 호출한다.",
    choiceExplanations: [
      "S3·SNS·EventBridge가 푸시(비동기) 계열이고, SQS는 폴링(ESM) 계열이다 — 이 구분이 최다 빈출.",
      "정답. ESM = Lambda가 폴링, 함수는 동기 호출.",
      "SQS는 ESM으로 직접 연결된다. SNS 경유는 팬아웃 패턴일 뿐 필수가 아니다.",
      "EventBridge는 SQS 폴링 주체가 아니다.",
    ],
  },
  {
    id: "q3",
    scope: "final",
    concept: ["Provisioned Concurrency", "콜드 스타트"],
    scenario: "매일 오전 9시 트래픽 급증 때마다 콜드 스타트로 첫 요청들이 느리다. 지연을 없애는 올바른 구성은?",
    choices: [
      "Reserved Concurrency를 상향한다",
      "Provisioned Concurrency를 버전/별칭에 설정하고 Application Auto Scaling 스케줄로 관리한다",
      "함수 메모리를 늘려 초기화를 빠르게 한다",
      "타임아웃을 900초로 늘린다",
    ],
    answer: [1],
    explanation:
      "Provisioned Concurrency는 호출 전에 실행 환경을 미리 초기화해 콜드 스타트를 제거한다. 예측 가능한 피크에는 Application Auto Scaling의 스케줄 기반 조정을 결합한다. $LATEST가 아닌 게시된 버전/별칭에만 설정할 수 있다.",
    choiceExplanations: [
      "Reserved는 동시성 '한도 예약(격리)'일 뿐 인스턴스를 미리 데워두지 않는다 — 콜드 스타트를 없애지 못한다.",
      "정답. 예약 피크 대비 콜드 스타트 제거의 교과서 구성.",
      "메모리 증설은 초기화를 다소 빠르게 할 수 있지만 콜드 스타트 자체를 제거하지 못한다.",
      "타임아웃은 실행 시간 한도일 뿐 시작 지연과 무관하다.",
    ],
  },
  {
    id: "q4",
    scope: "final",
    concept: ["동시성", "스로틀링"],
    scenario: "동기 호출 클라이언트가 429 TooManyRequestsException을 받기 시작했다. 원인은?",
    choices: [
      "함수 타임아웃 초과",
      "메모리 부족으로 인한 OOM",
      "동시성 한도(계정 기본 1,000 또는 함수 Reserved 한도) 초과로 인한 스로틀링",
      "요청 페이로드 6MB 초과",
    ],
    answer: [2],
    explanation:
      "429는 스로틀 — 동시 실행이 한도를 넘었다는 뜻이다. 동기 호출은 오류가 호출자에게 직접 반환되므로 재시도(지수 백오프)는 클라이언트 책임이다. 비동기 호출이라면 최대 6시간 큐에 보관하며 자동 재시도한다.",
    choiceExplanations: [
      "타임아웃은 Task timed out 오류로 나타난다.",
      "메모리 초과는 런타임 오류이지 429가 아니다.",
      "정답. 429 = ThrottleError. 한 함수의 폭주가 계정 풀을 고갈시키면 다른 함수까지 스로틀된다(Reserved로 격리).",
      "페이로드 초과는 413 계열(RequestEntityTooLarge) 오류다.",
    ],
  },
  {
    id: "q5",
    scope: "final",
    concept: ["권한 모델", "실행 역할", "리소스 기반 정책"],
    scenario: "Lambda가 DynamoDB 테이블을 읽을 권한과, API Gateway가 이 Lambda를 호출할 권한은 각각 어디에 부여하는가?",
    choices: [
      "둘 다 실행 역할(Execution Role)",
      "둘 다 Lambda의 리소스 기반 정책",
      "DynamoDB 읽기 = 실행 역할, API Gateway 호출 = 리소스 기반 정책",
      "DynamoDB 읽기 = 리소스 기반 정책, API Gateway 호출 = 실행 역할",
    ],
    answer: [2],
    explanation:
      "나가는 권한(함수 → 다른 서비스)은 실행 역할, 들어오는 권한(다른 서비스 → 함수 호출)은 리소스 기반 정책이다. 단, ESM(폴링)은 Lambda가 소스를 읽어오므로 실행 역할에 권한이 필요하다.",
    choiceExplanations: [
      "API Gateway가 함수를 '호출'하는 것은 들어오는 방향 — 리소스 기반 정책이다.",
      "DynamoDB를 '읽는' 것은 나가는 방향 — 실행 역할이다.",
      "정답. 방향으로 구분: 나가면 실행 역할, 들어오면 리소스 정책.",
      "방향이 반대로 뒤집혔다.",
    ],
  },
  {
    id: "q6",
    scope: "final",
    concept: ["버전·별칭", "카나리 배포"],
    scenario: "신규 코드 버전을 전체 트래픽의 10%에만 무중단으로 노출하고, 문제가 생기면 자동 롤백하고 싶다. 올바른 구성은?",
    choices: [
      "$LATEST에 가중치를 설정해 10%만 새 코드로 라우팅한다",
      "버전 2개를 게시하고 별칭 가중치 라우팅으로 90:10 분배, CodeDeploy + CloudWatch 알람 롤백으로 자동화한다",
      "함수 URL을 두 개 만들어 클라이언트가 나눠 호출하게 한다",
      "Reserved Concurrency를 10%만 새 버전에 할당한다",
    ],
    answer: [1],
    explanation:
      "별칭(Alias)은 버전을 가리키는 가변 포인터로, 최대 2개 버전 사이 가중치 라우팅을 지원한다. CodeDeploy(Canary/Linear)가 전환을 자동화하고 알람 발생 시 롤백한다.",
    choiceExplanations: [
      "가중치 라우팅·Provisioned Concurrency는 게시된 버전/별칭 대상 — 가변인 $LATEST에는 설정할 수 없다(단골 함정).",
      "정답. 별칭 가중치(버전 2개까지) + CodeDeploy 자동화가 교과서 패턴.",
      "클라이언트 측 분기는 무중단·자동 롤백 요건을 충족하지 못한다.",
      "Reserved Concurrency는 동시성 한도 제어이지 트래픽 분배 기능이 아니다.",
    ],
  },
  {
    id: "q7",
    scope: "final",
    concept: ["함수 성능", "메모리·vCPU"],
    scenario: "CPU 바운드 작업이 느리다. Lambda에서 CPU 성능을 높이는 방법은?",
    choices: [
      "vCPU 개수를 직접 설정한다",
      "메모리 크기를 올린다 — CPU는 메모리에 비례해 할당된다",
      "타임아웃을 늘린다",
      "레이어를 추가해 런타임을 최적화한다",
    ],
    answer: [1],
    explanation:
      "Lambda에는 CPU 설정이 없고 메모리(128MB~10,240MB, 1MB 단위)에 비례해 vCPU가 할당된다. 약 1,769MB에서 1 vCPU 상당에 도달하며, 그 이상은 멀티스레딩 코드여야 활용된다.",
    choiceExplanations: [
      "vCPU 직접 설정은 존재하지 않는다 — 이 선지가 바로 함정.",
      "정답. 'CPU가 필요하면 메모리를 올려라'가 정답 패턴 (1,769MB ≈ 1 vCPU).",
      "타임아웃은 실행 시간 한도일 뿐 속도를 높이지 않는다.",
      "레이어는 종속성 패키징 수단이지 성능 옵션이 아니다.",
    ],
  },
  {
    id: "q8",
    scope: "final",
    concept: ["배포 패키지", "컨테이너 이미지", "EFS"],
    scenario: "배포 패키지가 압축 해제 시 300MB라 업로드가 거부된다. 해결책 두 가지를 고르라.",
    choices: [
      "컨테이너 이미지로 배포한다 (최대 10GB)",
      "레이어로 분리하면 250MB 한도를 우회할 수 있다",
      "의존성을 EFS에 두고 VPC 구성 후 마운트한다",
      "zip을 S3에 올리면 크기 한도가 사라진다",
    ],
    answer: [0, 2],
    explanation:
      "압축 해제 250MB 한도를 넘는 큰 종속성은 ① 컨테이너 이미지(최대 10GB, ECR 저장) ② EFS 마운트(VPC 필요)로 해결한다. 레이어는 함수+레이어 합산 250MB에 포함되므로 한도 우회가 안 된다.",
    choiceExplanations: [
      "정답 1. 컨테이너 이미지는 10GB까지 허용된다 (Lambda Runtime API 구현 필수).",
      "레이어도 압축 해제 250MB '합산' 한도에 포함된다 — 우회 불가(함정).",
      "정답 2. EFS 마운트는 VPC 구성 + EFS Access Point가 전제.",
      "S3 경유는 'zip 업로드 50MB' 제한의 우회일 뿐, 압축 해제 250MB 한도는 그대로다.",
    ],
  },
  {
    id: "q9",
    scope: "final",
    concept: ["실행 컨텍스트", "콜드 스타트"],
    scenario: "DB 커넥션 초기화를 핸들러 밖(전역)에서 하라는 모범 사례의 이유는?",
    choices: [
      "핸들러 밖 코드는 더 높은 권한으로 실행되기 때문",
      "INIT 단계에서 1회만 실행되고, 웜 호출에서 실행 컨텍스트가 재사용되기 때문",
      "핸들러 안에서는 네트워크 연결이 금지되기 때문",
      "전역 코드는 타임아웃 계산에서 제외되기 때문",
    ],
    answer: [1],
    explanation:
      "실행 컨텍스트는 일정 시간 유지되어 다음 호출에서 재사용된다. 핸들러 밖 초기화(DB 연결, SDK 클라이언트)는 콜드 스타트 시 1회 실행되고 웜 호출에서 재사용되어 호출당 연결 비용이 사라진다.",
    choiceExplanations: [
      "권한은 실행 역할로 동일하다 — 위치와 무관.",
      "정답. 실행 컨텍스트 재사용이 핵심 개념.",
      "핸들러 안에서도 네트워크는 자유롭다. 문제는 비용(지연)이다.",
      "INIT도 시간을 소모한다 — 제외 특례가 이유가 아니다.",
    ],
  },
  {
    id: "q10",
    scope: "final",
    concept: ["한도", "타임아웃"],
    scenario: "Lambda의 최대 실행 시간은 얼마이며, 그보다 오래 걸리는 배치 작업은 어떻게 처리하는가?",
    choices: [
      "300초 — 초과 시 메모리를 늘려 단축한다",
      "900초(15분) — 초과 작업은 Step Functions로 분할하거나 ECS/Fargate·Batch로 옮긴다",
      "3,600초(1시간) — 초과 작업은 EC2로만 가능하다",
      "제한 없음 — 과금만 늘어난다",
    ],
    answer: [1],
    explanation:
      "타임아웃은 기본 3초, 최대 900초(15분)다. 15분을 넘는 작업에는 Lambda가 부적합하며 Step Functions 분할 오케스트레이션 또는 ECS/Fargate·Batch가 정답 방향이다.",
    choiceExplanations: [
      "300초는 구식 한도다. 현행 최대는 900초.",
      "정답. 900초 + 초과 시 대체 서비스 매핑.",
      "1시간 한도는 존재하지 않는다.",
      "타임아웃 한도는 명확히 존재한다(900초).",
    ],
  },
];
