import type { ChapterMeta, Question } from "../../schema";

/**
 * 원본: content/aws-dva-s3-guide.jsx(18섹션) + content/aws-s3-dva-guide.jsx(18모듈) 통합.
 * 두 파일은 주제 집합이 1:1 대응하는 실질 중복 쌍(reports/axis2 두 리포트의 「중복 관찰」) —
 * 컴팩트한 전자를 본문 뼈대로, 후자 고유 성분(정책 JSON·S3 Bucket Key·기본 암호화 시점·
 * presigned 기본 3600초·BPA 4설정·freqNote)을 병합했다.
 * 사실 수정: reports/axis2/aws-dva-s3-guide.md · aws-s3-dva-guide.md 수정 지시 전부 반영
 * (50TB, KMS 쿼터 재표현, 평가 순서 재표현, 버킷 네이밍 마침표, MFA CLI/API, 로그 같은 계정,
 * aws:SecureTransport 패턴, S3 Metadata·SSE-C 2026-04 각주).
 * 퀴즈: 원본에 퀴즈 성분 없음 — 리포트 "보충 생성 목록"에 따라 변환 단계에서 신규 생성.
 */
export const chapterMeta: ChapterMeta = {
  id: "ch1-1",
  phase: "1단계 · 서버리스 핵심",
  title: "S3",
  domain: "Development",
  examWeight: 5,
  prerequisites: ["ch0-1", "ch0-2"],
};

export const quiz: Question[] = [
  {
    id: "q1",
    scope: "final",
    concept: ["객체 모델", "멀티파트 업로드"],
    scenario:
      "온프레미스 백업 시스템이 8GB짜리 파일 하나를 단일 PUT 요청으로 S3에 업로드하다 실패했다. 원인과 올바른 해법은?",
    choices: [
      "객체 최대 크기 5GB를 초과했으므로 파일을 여러 객체로 쪼개 저장할 수밖에 없다",
      "단일 PUT은 최대 5GB까지만 허용되므로 멀티파트 업로드를 사용한다",
      "버킷 기본 암호화가 꺼져 있으면 대용량 업로드가 차단되므로 SSE-S3를 활성화한다",
      "Transfer Acceleration을 활성화해야 5GB 이상 업로드가 가능해진다",
    ],
    answer: [1],
    explanation:
      "객체 자체는 최대 50TB(멀티파트 5MB~50TB)까지 저장할 수 있지만, 단일 PUT 요청은 5GB가 한도다. 5GB 초과 파일은 멀티파트 업로드가 필수이며, 100MB 이상부터 권장된다.",
    choiceExplanations: [
      "객체 최대 크기는 5GB가 아니라 50TB다. 5GB는 '단일 PUT 요청'의 한도이므로 쪼갤 필요 없이 멀티파트 업로드로 한 객체를 올리면 된다.",
      "정답. 단일 PUT 5GB 한도 초과 → 멀티파트 업로드 필수(100MB 이상 권장).",
      "암호화 설정은 업로드 크기 제한과 무관하다.",
      "Transfer Acceleration은 전송 경로를 가속할 뿐 PUT 크기 한도를 늘리지 않는다.",
    ],
  },
  {
    id: "q2",
    scope: "final",
    concept: ["스토리지 클래스"],
    scenario:
      "원본 이미지에서 언제든 다시 생성할 수 있는 썸네일을 최소 비용으로 보관하려 한다. 단, 요청이 오면 즉시(밀리초) 읽을 수 있어야 한다. 어떤 스토리지 클래스가 적합한가?",
    choices: ["S3 Standard", "S3 Standard-IA", "S3 One Zone-IA", "S3 Glacier Deep Archive"],
    answer: [2],
    explanation:
      "One Zone-IA는 단일 AZ에만 저장해 Standard-IA보다 저렴하고 조회는 즉시 가능하다. AZ 파괴 시 데이터가 유실되지만 '재생성 가능한 데이터'라는 조건이 이 리스크를 수용한다.",
    choiceExplanations: [
      "즉시 접근은 되지만 자주 안 읽는 재생성 가능 데이터에는 과한 비용이다.",
      "요건은 충족하지만 One Zone-IA보다 비싸다. 재생성 가능 데이터라면 다중 AZ 내구성에 돈을 더 낼 이유가 없다.",
      "정답. 재생성 가능 + 즉시 접근 + 최저 비용 = One Zone-IA의 교과서적 사용처.",
      "Deep Archive는 복원에 12~48시간이 걸려 '즉시 읽기' 요건을 충족하지 못한다.",
    ],
  },
  {
    id: "q3",
    scope: "final",
    concept: ["암호화", "SSE-KMS"],
    scenario:
      "규제 감사팀이 'S3 객체 암호화 키가 언제, 누구에 의해 사용됐는지 추적할 수 있어야 한다'고 요구한다. 어떤 암호화 방식을 선택해야 하는가?",
    choices: ["SSE-S3", "SSE-KMS", "SSE-C", "클라이언트 측 암호화"],
    answer: [1],
    explanation:
      "SSE-KMS는 KMS 키로 암호화하며 모든 키 사용이 CloudTrail에 기록되므로 감사 추적 요건의 정답이다. 헤더 값은 aws:kms.",
    choiceExplanations: [
      "SSE-S3는 AWS가 키를 전적으로 관리해 키 사용 내역을 고객이 감사할 수 없다.",
      "정답. KMS 키 사용 이력이 CloudTrail로 남는다 — '감사'가 나오면 SSE-KMS.",
      "SSE-C는 고객이 키를 외부 관리할 뿐 AWS 측 키 사용 감사 로그를 제공하지 않는다.",
      "클라이언트 측 암호화도 AWS 감사 로그와 무관하게 고객이 전부 책임지는 방식이다.",
    ],
  },
  {
    id: "q4",
    scope: "final",
    concept: ["SSE-KMS", "S3 Bucket Key"],
    scenario:
      "SSE-KMS로 암호화된 버킷에 초당 수천 건의 객체를 업로드하자 KMS ThrottlingException이 발생하기 시작했다. 비용 효율적인 해결책은?",
    choices: [
      "암호화를 SSE-S3로 바꿔 KMS 호출을 없앤다",
      "S3 Bucket Key를 활성화해 KMS 호출 횟수를 줄인다",
      "객체를 더 많은 prefix에 분산한다",
      "멀티파트 업로드로 전환한다",
    ],
    answer: [1],
    explanation:
      "업로드마다 GenerateDataKey, 다운로드마다 Decrypt가 호출되어 KMS 요청 쿼터(리전·키 유형별 상이, 조정 가능)를 소모한다. S3 Bucket Key는 버킷 수준 키를 재사용해 KMS 호출을 최대 99%까지 줄인다. Service Quotas 상향도 대안이다.",
    choiceExplanations: [
      "스로틀은 사라지지만 SSE-KMS를 쓰는 이유(키 제어·감사)를 포기하게 된다 — 요건 위반.",
      "정답. 버킷 수준 데이터 키 재사용으로 KMS 호출을 대폭(최대 99%) 감소.",
      "prefix 분산은 S3 자체 처리량(3,500/5,500) 확장 기법이지 KMS 쿼터와 무관하다.",
      "멀티파트는 업로드 병렬화 기법일 뿐 KMS 호출 횟수를 줄이지 않는다.",
    ],
  },
  {
    id: "q5",
    scope: "final",
    concept: ["Presigned URL"],
    scenario:
      "프라이빗 버킷의 프리미엄 동영상을 로그인한 사용자에게만 1시간 동안 유효한 다운로드 링크로 제공하려 한다. IAM 사용자를 새로 만들지 않는 방법은?",
    choices: [
      "버킷 정책으로 해당 객체만 퍼블릭 읽기를 허용한다",
      "동영상 객체에 퍼블릭 태그를 붙인다",
      "애플리케이션 서버가 Presigned URL을 생성해 전달한다",
      "CloudFront 배포를 만들어 오리진 접근을 연다",
    ],
    answer: [2],
    explanation:
      "Presigned URL은 생성 주체의 권한을 상속한 서명 링크로, 버킷을 프라이빗으로 유지한 채 특정 객체에 임시 GET/PUT을 허용한다. 만료는 SDK/CLI 기본 3600초, 콘솔 최대 12시간, CLI --expires-in 최대 7일.",
    choiceExplanations: [
      "퍼블릭 허용은 로그인 여부와 무관하게 모두에게 열리고 시간 제한도 없다.",
      "태그는 접근 제어 조건으로 쓸 수는 있어도 '임시 링크' 요건을 충족하지 못한다.",
      "정답. 요청 시점에 서명된 임시 URL을 만들어 주는 것이 교과서 패턴이다.",
      "CloudFront 단독으로는 '1시간 한정 + 특정 사용자' 요건을 충족하지 못한다(서명 URL을 쓰면 결국 같은 원리).",
    ],
  },
  {
    id: "q6",
    scope: "final",
    concept: ["복제", "Batch Replication"],
    scenario:
      "버킷에 CRR 복제 규칙을 설정했는데, 규칙 생성 이전부터 있던 객체들이 대상 버킷에 나타나지 않는다. 어떻게 해야 하는가?",
    choices: [
      "복제 규칙을 삭제하고 다시 만들면 전체 객체가 복제된다",
      "S3 Batch Replication으로 기존 객체를 복제한다",
      "대상 버킷의 버전 관리를 끄면 복제가 소급 적용된다",
      "복제는 원래 최대 24시간 지연되므로 기다린다",
    ],
    answer: [1],
    explanation:
      "복제 규칙은 활성화 이후의 새 객체만 복제한다. 기존 객체와 과거 복제 실패분은 S3 Batch Replication으로 복제한다.",
    choiceExplanations: [
      "규칙을 다시 만들어도 '활성화 이후 새 객체만'이라는 동작은 같다.",
      "정답. 기존 객체·복제 실패분 전용 기능이 S3 Batch Replication이다.",
      "복제는 원본·대상 모두 버전 관리 활성화가 전제 조건이다 — 끄면 복제 자체가 깨진다.",
      "지연이 아니라 대상 범위의 문제다. 기존 객체는 얼마를 기다려도 복제되지 않는다.",
    ],
  },
  {
    id: "q7",
    scope: "final",
    concept: ["CORS"],
    scenario:
      "버킷 A로 호스팅한 정적 웹사이트가 버킷 B의 이미지를 fetch로 불러오는데 브라우저 콘솔에 CORS 오류가 찍힌다. 어디에 무엇을 설정해야 하는가?",
    choices: [
      "버킷 A에 CORS 규칙을 추가한다",
      "버킷 B에 CORS 규칙을 추가하고 Allow-Origin에 A의 오리진을 넣는다",
      "버킷 A의 정적 웹사이트 호스팅 설정에서 크로스 오리진을 허용한다",
      "버킷 B를 퍼블릭으로 전환하면 CORS 오류가 사라진다",
    ],
    answer: [1],
    explanation:
      "CORS 설정은 '요청을 받는 쪽' 버킷에 한다. preflight(OPTIONS + Origin 헤더)에 대해 B가 Access-Control-Allow-Origin/-Methods로 응답해야 브라우저가 실제 요청을 보낸다.",
    choiceExplanations: [
      "요청을 보내는 쪽(A)이 아니라 받는 쪽(B)에 설정한다 — 시험 단골 함정.",
      "정답. 대상 버킷 B의 CORS 규칙 + Allow-Origin이 핵심.",
      "웹사이트 호스팅 설정에는 그런 옵션이 없다. CORS는 버킷의 CORS 구성(JSON)으로 등록한다.",
      "퍼블릭 여부와 CORS는 별개다. 퍼블릭이어도 CORS 헤더가 없으면 브라우저가 응답을 차단한다.",
    ],
  },
  {
    id: "q8",
    scope: "final",
    concept: ["이벤트 알림"],
    scenario:
      "S3 버킷의 ObjectCreated 이벤트를 SQS 큐로 보내도록 설정했는데 메시지가 도착하지 않는다. 가장 먼저 확인할 것은?",
    choices: [
      "S3에 SQS 접근용 IAM 역할을 연결했는지",
      "SQS 큐의 액세스(리소스) 정책이 S3의 전송을 허용하는지",
      "버킷과 큐가 같은 AZ에 있는지",
      "이벤트 알림에 Lambda를 먼저 연결했는지",
    ],
    answer: [1],
    explanation:
      "S3가 SNS/SQS/Lambda 대상에 게시하려면 IAM 역할이 아니라 '대상 측 리소스 정책'에서 S3를 허용해야 한다. 이 권한 방식 구분이 시험 포인트다.",
    choiceExplanations: [
      "이벤트 알림은 IAM 역할 방식이 아니다 — 대상의 리소스 정책으로 허용한다.",
      "정답. SQS 액세스 정책에 S3(버킷 ARN 조건)의 SendMessage 허용이 필요하다.",
      "S3 버킷과 SQS는 AZ 개념으로 묶이는 서비스가 아니다(리전 서비스).",
      "대상 3종(SNS/SQS/Lambda)은 각각 독립적으로 설정한다 — Lambda 선행 조건 같은 것은 없다.",
    ],
  },
];
