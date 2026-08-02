/**
 * 전역 용어집 — AWS 고유 용어·약어의 단일 진실 (#56 에픽 → #57 spike 결정 1).
 * 타입 계약은 content/schema.ts 의 GlossaryTerm. 앱은 lib/content.ts 경유로만 소비한다.
 *
 * 수록 기준 (#57 결정 3): 기존 챕터 본문에 등장하는 AWS 고유 서비스명·약어·개념어 전수.
 *   • 본문에 이미 설명이 있는 용어(리전·STS 등)도 수록한다 — 용어집은 사전이고, 뒤 챕터에서
 *     다시 만난 독자가 앵커로 복습하는 용도다.
 *   • 개발자 상식 용어(JSON·HTTP·URL·CSV·FIFO·HTTP 동사, API·CLI·SDK 포함)는 제외 —
 *     독자 페르소나(CLAUDE.md: 개발자다)상 설명이 필요 없다.
 * 수록 대상 목록의 출처: #57 전수 조사 코멘트 (4챕터 52개 섹션 스캔).
 *
 * 작성 규칙:
 *   • short 는 1문장 — 팝오버(#193)에 그대로 뜬다. AWS 백지 독자 기준으로 쓴다.
 *   • detail 은 /glossary 페이지 전용 — short 에 얹을 것이 있을 때만. 없으면 생략.
 *   • chapterId 는 그 용어를 본문에서 자세히 다루는 챕터 — 전담 챕터가 아직 없으면 생략.
 *   • 배열 순서는 계약이 아니다 — 표시 순서·그룹핑은 /glossary 페이지(#192)가 정한다.
 *     아래 그룹 주석은 저작 편의용일 뿐이다.
 */
import type { GlossaryTerm } from "./schema.ts";

export const glossary: GlossaryTerm[] = [
  // ── 계정·자격 증명·IAM ────────────────────────────────────────────────
  {
    id: "aws",
    term: "AWS",
    full: "Amazon Web Services",
    short: "아마존의 클라우드 컴퓨팅 플랫폼 — 서버·스토리지·데이터베이스 같은 인프라를 API로 빌려 쓰는 서비스 묶음이다.",
  },
  {
    id: "iam",
    term: "IAM",
    full: "AWS Identity and Access Management",
    short: "AWS에서 \"누가 무엇을 할 수 있는지\"를 관리하는 권한 서비스다.",
    detail:
      "인증(누구인지 확인)과 인가(무엇을 허용할지)를 담당한다. 유저·그룹·역할이라는 주체에 정책(JSON 문서)을 붙여 권한을 부여하며, AWS의 거의 모든 보안 문제가 여기서 시작된다.",
    chapterId: "ch0-2",
  },
  {
    id: "policy",
    term: "정책",
    full: "Policy",
    short: "허용/거부할 행동을 적은 JSON 문서 — IAM 권한 부여의 기본 단위다.",
    detail:
      "Effect(Allow/Deny)·Action(어떤 API 호출)·Resource(어떤 대상)·Condition(어떤 조건에서만)으로 구성된다. 누구에게 붙이느냐에 따라 자격 증명 기반 정책과 리소스 기반 정책으로 나뉜다.",
    chapterId: "ch0-2",
  },
  {
    id: "role",
    term: "역할",
    full: "Role",
    short: "사람 계정이 아니라 필요할 때 \"맡는\" 권한 묶음 — 서비스나 다른 계정이 임시로 쓰는 IAM 자격이다.",
    detail:
      "장기 비밀번호·키가 없고, 맡는(AssumeRole) 순간 임시 자격 증명이 발급된다. 누가 맡을 수 있는지는 역할에 붙은 신뢰 정책이 정한다. Lambda 실행 역할, EC2 인스턴스 프로파일이 대표 사용처다.",
    chapterId: "ch0-2",
  },
  {
    id: "credentials",
    term: "자격 증명",
    full: "Credentials",
    short: "AWS에 \"나\"임을 증명하는 열쇠 — 액세스 키, 임시 토큰 등이 여기 해당한다.",
    chapterId: "ch0-1",
  },
  {
    id: "temporary-credentials",
    term: "임시 자격 증명",
    full: "Temporary Credentials",
    short: "유효 기간이 있는 자격 증명 — STS가 발급하며, 만료되면 저절로 무효가 되어 유출 피해가 제한된다.",
    chapterId: "ch0-1",
  },
  {
    id: "sts",
    term: "STS",
    full: "AWS Security Token Service",
    short: "임시 자격 증명(방문증)을 발급하는 서비스 — AssumeRole 호출이 대표적이다.",
    chapterId: "ch0-2",
  },
  {
    id: "access-key",
    term: "액세스 키",
    full: "Access Key",
    short: "프로그램(CLI·SDK)이 AWS에 접근할 때 쓰는 장기 자격 증명 — Access Key ID와 Secret Access Key 한 쌍이다.",
    detail:
      "장기 자격 증명이라 유출 시 만료 없이 계속 쓰인다 — 코드·리포에 넣지 않는 것이 철칙이고, 시험 정답 기준으로는 가능한 한 역할(임시 자격 증명)로 대체한다.",
    chapterId: "ch0-2",
  },
  {
    id: "mfa",
    term: "MFA",
    full: "Multi-Factor Authentication",
    short: "다요소 인증 — 비밀번호(아는 것)에 인증 기기(가진 것)를 더해 로그인을 이중으로 보호한다.",
    chapterId: "ch0-2",
  },
  {
    id: "root-user",
    term: "루트 사용자",
    full: "Root User",
    short: "계정 생성 시 만들어지는 모든 권한의 최상위 사용자 — 일상 작업에는 쓰지 않고 MFA를 걸어 잠가 두는 것이 원칙이다.",
    chapterId: "ch0-2",
  },
  {
    id: "principal",
    term: "Principal",
    short: "정책에서 \"누가\"에 해당하는 주체 — 유저·역할·AWS 서비스 등 요청을 보내는 쪽을 가리킨다.",
    chapterId: "ch0-2",
  },
  {
    id: "trust-policy",
    term: "신뢰 정책",
    full: "Trust Policy",
    short: "역할에 붙어 \"누가 이 역할을 맡을 수 있는지\"를 정하는 정책이다.",
    chapterId: "ch0-2",
  },
  {
    id: "assume-role",
    term: "AssumeRole",
    short: "역할을 \"맡는\" STS API — 성공하면 그 역할 권한의 임시 자격 증명을 받는다.",
    detail:
      "외부 인증과 조합한 변형이 있다 — AssumeRoleWithSAML은 회사 IdP 토큰으로, AssumeRoleWithWebIdentity는 구글 같은 웹 IdP 토큰으로 같은 일을 한다.",
    chapterId: "ch0-2",
  },
  {
    id: "execution-role",
    term: "실행 역할",
    full: "Execution Role",
    short: "Lambda 함수가 다른 AWS 서비스를 부를 때 쓰는 IAM 역할 — 함수의 권한은 코드가 아니라 이 역할이 정한다.",
    chapterId: "ch1-2",
  },
  {
    id: "identity-based-policy",
    term: "자격 증명 기반 정책",
    full: "Identity-based Policy",
    short: "유저·그룹·역할 쪽에 붙이는 정책 — \"이 주체가 무엇을 할 수 있나\"를 정한다.",
    chapterId: "ch0-2",
  },
  {
    id: "resource-based-policy",
    term: "리소스 기반 정책",
    full: "Resource-based Policy",
    short: "S3 버킷처럼 리소스 쪽에 직접 붙이는 정책 — \"이 리소스에 누가 접근할 수 있나\"를 정하며, 그래서 Principal 필드를 가진다.",
    chapterId: "ch0-2",
  },
  {
    id: "permission-boundary",
    term: "Permission Boundary",
    full: "권한 경계",
    short: "주체가 가질 수 있는 권한의 최대 한도를 정하는 안전장치 정책 — 이 경계를 넘는 권한은 붙여도 무효다.",
    chapterId: "ch0-2",
  },
  {
    id: "least-privilege",
    term: "최소 권한",
    full: "Least Privilege",
    short: "꼭 필요한 권한만 부여하는 보안 원칙 — IAM 설계와 시험 정답의 기본 전제다.",
    chapterId: "ch0-2",
  },
  {
    id: "scp",
    term: "SCP",
    full: "Service Control Policy",
    short: "AWS Organizations에서 조직 단위로 거는 최대 권한 한도 — 계정 안의 어떤 IAM 정책도 이 한도를 넘을 수 없다.",
    chapterId: "ch0-2",
  },
  {
    id: "cross-account",
    term: "교차 계정",
    full: "Cross-Account",
    short: "서로 다른 AWS 계정 사이의 접근 — 역할 맡기(AssumeRole)나 리소스 기반 정책으로 허용한다.",
    chapterId: "ch0-2",
  },
  {
    id: "federation",
    term: "페더레이션",
    full: "Federation",
    short: "회사 IdP·구글 같은 외부 인증을 AWS 접근으로 바꾸는 방식 — 외부 토큰을 STS 임시 자격 증명으로 교환한다.",
    chapterId: "ch0-2",
  },
  {
    id: "idp",
    term: "IdP",
    full: "Identity Provider",
    short: "사용자 인증을 담당하는 외부 주체(회사 디렉터리·Google 등) — 페더레이션에서 \"누구인지\"를 보증한다.",
  },
  {
    id: "sso",
    term: "SSO",
    full: "Single Sign-On",
    short: "한 번의 로그인으로 여러 시스템에 들어가는 방식 — AWS에서는 IAM Identity Center(구 AWS SSO)가 담당한다.",
  },
  {
    id: "oidc",
    term: "OIDC",
    full: "OpenID Connect",
    short: "웹 표준 인증 프로토콜 — 구글 로그인 같은 웹 IdP 페더레이션(AssumeRoleWithWebIdentity)에 쓰인다.",
  },
  {
    id: "saml",
    term: "SAML",
    full: "Security Assertion Markup Language",
    short: "기업용 표준 인증 프로토콜 — 회사 IdP 페더레이션(AssumeRoleWithSAML)에 쓰인다.",
  },
  {
    id: "jwt",
    term: "JWT",
    full: "JSON Web Token",
    short: "서명된 JSON 형식의 신원 토큰 — 웹 IdP가 발급하며 OIDC 페더레이션의 재료가 된다.",
  },
  {
    id: "u2f",
    term: "U2F",
    full: "Universal 2nd Factor",
    short: "물리 보안 키 표준 — MFA 기기 유형 중 하나다.",
  },
  {
    id: "sigv4",
    term: "SigV4",
    full: "AWS Signature Version 4",
    short: "AWS API 요청 서명 방식 — 자격 증명으로 요청마다 서명을 만들어 위·변조와 재사용을 막는다.",
    chapterId: "ch0-1",
  },
  {
    id: "credential-provider-chain",
    term: "Credential Provider Chain",
    short: "SDK·CLI가 자격 증명을 찾는 정해진 탐색 순서 — 환경 변수 → 프로파일 → 역할 순으로 훑어 처음 찾은 것을 쓴다.",
    chapterId: "ch0-1",
  },
  {
    id: "instance-profile",
    term: "인스턴스 프로파일",
    full: "Instance Profile",
    short: "EC2 인스턴스에 IAM 역할을 붙이는 연결 고리 — 인스턴스 안의 앱이 키 없이 임시 자격 증명을 받게 한다.",
  },
  {
    id: "organizations",
    term: "Organizations",
    full: "AWS Organizations",
    short: "여러 AWS 계정을 묶어 관리하는 서비스 — 조직 전체에 SCP 같은 통제를 걸 수 있다.",
  },
  {
    id: "cloudtrail",
    term: "CloudTrail",
    full: "AWS CloudTrail",
    short: "계정에서 일어난 API 호출을 기록하는 감사 로그 서비스 — \"누가 언제 무엇을 했나\"를 남긴다.",
  },
  {
    id: "access-analyzer",
    term: "Access Analyzer",
    full: "IAM Access Analyzer",
    short: "외부에 열려 있는 리소스 접근을 찾아내 알려 주는 IAM 분석 도구다.",
  },
  {
    id: "cloudshell",
    term: "CloudShell",
    full: "AWS CloudShell",
    short: "콘솔 안에서 바로 여는 무료 브라우저 터미널 — 로그인된 자격 증명으로 CLI를 쓸 수 있다.",
    chapterId: "ch0-2",
  },
  {
    id: "kms",
    term: "KMS",
    full: "AWS Key Management Service",
    short: "암호화 키를 만들고 관리하는 서비스 — S3 등 다른 서비스의 암호화가 이 키를 빌려 쓴다.",
    detail:
      "키 자체를 꺼낼 수는 없고 \"이 키로 암·복호화해 달라\"는 API만 열려 있다. S3의 SSE-KMS가 대표 사용처로, 키 사용 이력이 CloudTrail에 남는 것이 SSE-S3와의 차별점이다.",
  },
  {
    id: "secrets-manager",
    term: "Secrets Manager",
    full: "AWS Secrets Manager",
    short: "DB 비밀번호 같은 시크릿을 저장하고 자동 교체(rotation)까지 해 주는 관리 서비스다.",
  },
  {
    id: "ssm",
    term: "SSM",
    full: "AWS Systems Manager",
    short: "운영 도구 모음 서비스 — 시험에서는 설정값·시크릿을 계층 이름으로 저장하는 Parameter Store로 주로 등장한다.",
    detail:
      "Parameter Store는 무료(표준 계층)로 설정·시크릿을 저장한다. 자동 교체가 필요하면 Secrets Manager, 단순 저장이면 Parameter Store — 이 구분이 시험 단골이다.",
  },

  // ── 인프라·글로벌 ─────────────────────────────────────────────────────
  {
    id: "region",
    term: "리전",
    full: "Region",
    short: "AWS 데이터센터가 모여 있는 지리적 거점(서울·버지니아 등) — 대부분의 리소스는 특정 리전 안에 만들어진다.",
    chapterId: "ch0-1",
  },
  {
    id: "az",
    term: "AZ",
    full: "Availability Zone",
    short: "가용영역 — 리전 안의 독립된 데이터센터 그룹으로, 하나가 장애 나도 다른 AZ가 살아 있도록 격리돼 있다.",
    chapterId: "ch0-1",
  },
  {
    id: "edge-location",
    term: "엣지 로케이션",
    full: "Edge Location",
    short: "사용자 가까이에 둔 소형 캐시 거점 — CloudFront가 콘텐츠를 미리 진열해 두는 \"편의점 진열대\"다.",
    chapterId: "ch0-1",
  },
  {
    id: "ha",
    term: "HA",
    full: "High Availability",
    short: "고가용성 — 일부가 장애 나도 서비스가 계속되도록 여러 AZ 등에 중복 구성하는 성질이다.",
    chapterId: "ch0-1",
  },
  {
    id: "vpc",
    term: "VPC",
    full: "Amazon Virtual Private Cloud",
    short: "AWS 안에 만드는 나만의 사설 네트워크 — EC2·Lambda 같은 리소스의 통신 범위를 격리한다.",
  },
  {
    id: "subnet",
    term: "서브넷",
    full: "Subnet",
    short: "VPC를 더 잘게 나눈 네트워크 구역 — 인터넷에 열린 퍼블릭과 닫힌 프라이빗으로 나눈다.",
  },
  {
    id: "security-group",
    term: "보안 그룹",
    full: "Security Group",
    short: "인스턴스 단위의 가상 방화벽 — 허용할 인바운드/아웃바운드 트래픽을 정한다.",
  },
  {
    id: "nat",
    term: "NAT",
    full: "Network Address Translation",
    short: "사설 IP를 공인 IP로 바꿔 주는 장치 — 프라이빗 서브넷이 인터넷에 \"나가기만\" 해야 할 때 NAT 게이트웨이를 쓴다.",
  },
  {
    id: "cidr",
    term: "CIDR",
    full: "Classless Inter-Domain Routing",
    short: "IP 주소 범위 표기법(예: 10.0.0.0/16) — VPC·서브넷의 주소 범위를 이 형식으로 정한다.",
  },
  {
    id: "endpoint",
    term: "엔드포인트",
    full: "Endpoint",
    short: "서비스에 요청을 보내는 접속 주소 — VPC 엔드포인트는 인터넷을 거치지 않고 AWS 서비스에 붙는 전용 통로다.",
    detail:
      "VPC 엔드포인트는 두 유형이다 — Gateway(S3·DynamoDB 전용, 무료)와 Interface(대부분의 서비스, ENI 기반 유료). 시험에서는 \"프라이빗 서브넷에서 인터넷 없이 S3 접근\" 시나리오로 나온다.",
  },
  {
    id: "route53",
    term: "Route 53",
    full: "Amazon Route 53",
    short: "AWS의 DNS 서비스 — 도메인 이름을 IP나 AWS 리소스로 연결한다.",
  },
  {
    id: "cloudfront",
    term: "CloudFront",
    full: "Amazon CloudFront",
    short: "AWS의 CDN(콘텐츠 전송 네트워크) — 전 세계 엣지 로케이션에 콘텐츠를 캐시해 사용자 가까운 곳에서 빠르게 전달한다.",
  },

  // ── 컴퓨팅·서버리스 ───────────────────────────────────────────────────
  {
    id: "ec2",
    term: "EC2",
    full: "Amazon Elastic Compute Cloud",
    short: "AWS의 가상 서버 서비스 — 인스턴스를 빌려 OS부터 직접 운영한다.",
  },
  {
    id: "instance",
    term: "인스턴스",
    full: "Instance",
    short: "실행 중인 가상 서버 한 대 — EC2가 빌려주는 컴퓨팅의 단위다.",
  },
  {
    id: "ami",
    term: "AMI",
    full: "Amazon Machine Image",
    short: "EC2 인스턴스를 찍어내는 템플릿 — OS와 소프트웨어가 설치된 상태의 이미지다.",
  },
  {
    id: "lambda",
    term: "Lambda",
    full: "AWS Lambda",
    short: "서버 관리 없이 코드를 이벤트 단위로 실행하는 서버리스 컴퓨팅 서비스 — 실행된 시간만큼만 과금된다.",
    chapterId: "ch1-2",
  },
  {
    id: "serverless",
    term: "서버리스",
    full: "Serverless",
    short: "서버를 직접 관리·프로비저닝하지 않는 방식 — 서버가 없는 게 아니라 서버 걱정이 없는 것이다.",
    chapterId: "ch1-2",
  },
  {
    id: "managed",
    term: "관리형",
    full: "Managed",
    short: "AWS가 운영(패치·백업·확장)을 대신해 주는 서비스 형태 — 자가용(직접 운영)↔렌터카↔택시(서버리스) 스펙트럼으로 구분한다.",
    chapterId: "ch0-1",
  },
  {
    id: "cold-start",
    term: "콜드 스타트",
    full: "Cold Start",
    short: "Lambda가 새 실행 환경을 띄울 때 생기는 첫 요청 지연 — 코드 로드와 초기화에 걸리는 시간이다.",
    chapterId: "ch1-2",
  },
  {
    id: "concurrency",
    term: "동시성",
    full: "Concurrency",
    short: "같은 순간 실행 중인 Lambda 실행 환경의 수 — Reserved(상한 예약)와 Provisioned(미리 데워 두기)로 제어한다.",
    chapterId: "ch1-2",
  },
  {
    id: "throttling",
    term: "스로틀링",
    full: "Throttling",
    short: "요청이 한도를 넘을 때 AWS가 요청을 거절하는 것 — 429 오류로 나타나며 백오프 재시도로 대응한다.",
    chapterId: "ch1-2",
  },
  {
    id: "alias",
    term: "별칭",
    full: "Alias",
    short: "Lambda 버전을 가리키는 이동 가능한 포인터 — prod 별칭을 v1에서 v2로 옮기는 식으로 배포 전환에 쓴다.",
    chapterId: "ch1-2",
  },
  {
    id: "latest",
    term: "$LATEST",
    short: "Lambda의 최신 미발행 코드를 가리키는 특수 버전 — 번호가 붙은 버전과 달리 내용이 계속 바뀐다.",
    chapterId: "ch1-2",
  },
  {
    id: "esm",
    term: "ESM",
    full: "Event Source Mapping",
    short: "이벤트 소스 매핑 — SQS·Kinesis 같은 소스에서 Lambda가 직접 폴링해 레코드를 가져오게 하는 연결 설정이다.",
    chapterId: "ch1-2",
  },
  {
    id: "polling",
    term: "폴링",
    full: "Polling",
    short: "소비자가 주기적으로 \"새 것 있나요?\" 하고 물어서 가져가는 방식 — 이벤트를 밀어 주는 푸시의 반대다.",
    chapterId: "ch1-2",
  },
  {
    id: "dlq",
    term: "DLQ",
    full: "Dead Letter Queue",
    short: "처리에 계속 실패한 메시지를 따로 모아 두는 큐 — 실패 원인 분석과 재처리를 위한 격리 공간이다.",
    chapterId: "ch1-2",
  },
  {
    id: "lambda-at-edge",
    term: "Lambda@Edge",
    short: "CloudFront 엣지에서 실행되는 Lambda — us-east-1 리전에 작성하면 전 세계 엣지로 복제된다.",
    chapterId: "ch1-2",
  },
  {
    id: "rie",
    term: "RIE",
    full: "Runtime Interface Emulator",
    short: "Lambda 컨테이너 이미지를 로컬에서 실행해 볼 수 있게 해 주는 에뮬레이터다.",
    chapterId: "ch1-2",
  },
  {
    id: "lifecycle",
    term: "수명 주기",
    full: "Lifecycle",
    short: "시간·상태에 따른 자동 규칙이나 생애 단계 — S3와 Lambda에서 각각 다른 뜻으로 쓰인다.",
    detail:
      "S3 수명 주기는 \"30일 지나면 IA로 전환, 1년 지나면 삭제\"처럼 객체를 자동 전환(Transition)·만료(Expiration)시키는 규칙이다.\n\nLambda 실행 환경 수명 주기는 INIT(초기화) → INVOKE(호출 처리) → SHUTDOWN(종료)의 생애 단계를 말한다.",
  },

  // ── 컨테이너·배포·개발 도구 ───────────────────────────────────────────
  {
    id: "ecs",
    term: "ECS",
    full: "Amazon Elastic Container Service",
    short: "AWS의 컨테이너 오케스트레이션 서비스 — 컨테이너의 배포·운영을 관리한다.",
  },
  {
    id: "ecr",
    term: "ECR",
    full: "Amazon Elastic Container Registry",
    short: "컨테이너 이미지를 저장하는 AWS의 레지스트리 — Docker Hub의 AWS판이다.",
  },
  {
    id: "fargate",
    term: "Fargate",
    full: "AWS Fargate",
    short: "서버(EC2) 관리 없이 컨테이너를 실행하는 서버리스 컨테이너 엔진 — ECS·EKS 위에서 쓴다.",
  },
  {
    id: "sam",
    term: "SAM",
    full: "AWS Serverless Application Model",
    short: "서버리스 앱 전용 IaC 프레임워크 — CloudFormation을 서버리스용으로 줄인 문법과 로컬 테스트 CLI를 제공한다.",
    chapterId: "ch1-2",
  },
  {
    id: "cloudformation",
    term: "CloudFormation",
    full: "AWS CloudFormation",
    short: "인프라를 코드(템플릿)로 정의해 생성·갱신하는 IaC 서비스다.",
  },
  {
    id: "codedeploy",
    term: "CodeDeploy",
    full: "AWS CodeDeploy",
    short: "배포 자동화 서비스 — Lambda에서는 별칭의 트래픽 전환(카나리·선형)을 자동화한다.",
  },
  {
    id: "codepipeline",
    term: "CodePipeline",
    full: "AWS CodePipeline",
    short: "빌드→테스트→배포 흐름을 잇는 CI/CD 파이프라인 서비스다.",
  },
  {
    id: "eventbridge",
    term: "EventBridge",
    full: "Amazon EventBridge",
    short: "이벤트 버스 서비스 — 서비스 이벤트나 스케줄 규칙(서버리스 크론)으로 Lambda 등을 트리거한다.",
    chapterId: "ch1-2",
  },
  {
    id: "x-ray",
    term: "X-Ray",
    full: "AWS X-Ray",
    short: "분산 추적 서비스 — 요청이 여러 서비스를 거쳐 가는 경로와 병목 구간을 시각화한다.",
    chapterId: "ch1-2",
  },
  {
    id: "cloudwatch",
    term: "CloudWatch",
    full: "Amazon CloudWatch",
    short: "AWS의 모니터링 서비스 — 지표(메트릭)·로그(CloudWatch Logs)·경보를 한곳에 모은다.",
  },

  // ── 스토리지·데이터 ───────────────────────────────────────────────────
  {
    id: "s3",
    term: "S3",
    full: "Amazon Simple Storage Service",
    short: "파일(객체)을 사실상 무제한으로 저장하는 객체 스토리지 서비스다.",
    chapterId: "ch1-1",
  },
  {
    id: "bucket",
    term: "버킷",
    full: "Bucket",
    short: "S3에서 객체를 담는 최상위 컨테이너 — 이름은 전 세계에서 유일해야 한다.",
    chapterId: "ch1-1",
  },
  {
    id: "versioning",
    term: "버전 관리",
    full: "Versioning",
    short: "같은 키의 객체를 덮어써도 이전 버전을 보관하는 S3 기능 — 실수 삭제·덮어쓰기 복구의 기본기다.",
    chapterId: "ch1-1",
  },
  {
    id: "storage-class",
    term: "스토리지 클래스",
    full: "Storage Class",
    short: "접근 빈도와 비용에 따라 고르는 S3 저장 등급 — Standard부터 Glacier까지 요금과 꺼내는 시간이 다르다.",
    chapterId: "ch1-1",
  },
  {
    id: "ia",
    term: "IA",
    full: "Infrequent Access",
    short: "가끔 접근하는 객체용 S3 저장 등급 접미사 — Standard-IA·One Zone-IA의 그 IA다.",
    chapterId: "ch1-1",
  },
  {
    id: "glacier",
    term: "Glacier",
    full: "Amazon S3 Glacier",
    short: "장기 보관(아카이브)용 초저가 스토리지 클래스 — 저장은 싸지만 꺼내는 데 시간이 걸린다.",
    chapterId: "ch1-1",
  },
  {
    id: "sse",
    term: "SSE",
    full: "Server-Side Encryption",
    short: "S3 서버 측 암호화 — 저장되는 시점에 AWS가 암호화하며, 키 관리 방식에 따라 SSE-S3·SSE-KMS·SSE-C·DSSE-KMS로 나뉜다.",
    chapterId: "ch1-1",
  },
  {
    id: "bpa",
    term: "BPA",
    full: "Block Public Access",
    short: "S3의 공개 접근을 계정·버킷 단위로 원천 차단하는 안전장치 설정이다.",
    chapterId: "ch1-1",
  },
  {
    id: "crr",
    term: "CRR",
    full: "Cross-Region Replication",
    short: "다른 리전의 버킷으로 객체를 자동 복제하는 S3 기능 — 재해 복구나 지연 단축이 목적이다.",
    chapterId: "ch1-1",
  },
  {
    id: "srr",
    term: "SRR",
    full: "Same-Region Replication",
    short: "같은 리전 안 다른 버킷으로 객체를 자동 복제하는 S3 기능 — 로그 집계·환경 분리가 목적이다.",
    chapterId: "ch1-1",
  },
  {
    id: "presigned-url",
    term: "Presigned URL",
    short: "서명을 미리 담은 임시 URL — AWS 자격 증명이 없는 사람도 기한 안에는 그 객체에 접근할 수 있게 해 준다.",
    chapterId: "ch1-1",
  },
  {
    id: "cors",
    term: "CORS",
    full: "Cross-Origin Resource Sharing",
    short: "다른 출처(도메인)에서 온 브라우저 요청을 허용하는 규칙 — S3 버킷 등에 설정한다.",
  },
  {
    id: "efs",
    term: "EFS",
    full: "Amazon Elastic File System",
    short: "여러 인스턴스·Lambda가 동시에 마운트해 쓰는 공유 파일 시스템(NFS)이다.",
  },
  {
    id: "ebs",
    term: "EBS",
    full: "Amazon Elastic Block Store",
    short: "EC2 인스턴스에 붙이는 가상 디스크(블록 스토리지)다.",
  },
  {
    id: "dynamodb",
    term: "DynamoDB",
    full: "Amazon DynamoDB",
    short: "AWS의 완전관리형 NoSQL 키-값 데이터베이스 — 서버리스 조합의 단골 저장소다.",
  },
  {
    id: "rds",
    term: "RDS",
    full: "Amazon Relational Database Service",
    short: "관계형 DB(MySQL·PostgreSQL 등)를 관리형으로 빌려 쓰는 서비스다.",
  },
  {
    id: "elasticache",
    term: "ElastiCache",
    full: "Amazon ElastiCache",
    short: "Redis·Memcached를 관리형으로 제공하는 인메모리 캐시 서비스다.",
  },

  // ── 메시징·통합 ───────────────────────────────────────────────────────
  {
    id: "sqs",
    term: "SQS",
    full: "Amazon Simple Queue Service",
    short: "완전관리형 메시지 큐 — 생산자와 소비자를 분리(디커플링)해 비동기 처리를 만든다.",
  },
  {
    id: "sns",
    term: "SNS",
    full: "Amazon Simple Notification Service",
    short: "게시/구독(pub/sub) 알림 서비스 — 한 메시지를 여러 구독자에게 동시에 밀어 보낸다.",
  },
  {
    id: "kinesis",
    term: "Kinesis",
    full: "Amazon Kinesis",
    short: "실시간 스트리밍 데이터 서비스 — 스트림 처리는 Data Streams, 적재는 Firehose가 담당한다.",
  },
  {
    id: "msk",
    term: "MSK",
    full: "Amazon Managed Streaming for Apache Kafka",
    short: "Apache Kafka를 관리형으로 제공하는 스트리밍 서비스다.",
  },
  {
    id: "step-functions",
    term: "Step Functions",
    full: "AWS Step Functions",
    short: "여러 Lambda·서비스 호출을 상태 머신(워크플로)으로 잇는 오케스트레이션 서비스다.",
  },
  {
    id: "cognito",
    term: "Cognito",
    full: "Amazon Cognito",
    short: "앱 사용자의 인증·회원 관리 서비스 — 소셜 로그인과 AWS 자격 증명 교환(페더레이션)을 대신해 준다.",
  },

  // ── 시험·과금 ─────────────────────────────────────────────────────────
  {
    id: "arn",
    term: "ARN",
    full: "Amazon Resource Name",
    short: "AWS 리소스의 전역 고유 주소 — arn:aws:서비스:리전:계정:리소스 형식이다.",
    chapterId: "ch0-2",
  },
  {
    id: "dva",
    term: "DVA",
    full: "AWS Certified Developer - Associate",
    short: "이 사이트가 준비하는 시험 — 개발자 관점의 AWS 어소시에이트 자격시험이다(코드 DVA-C02).",
    chapterId: "ch0-1",
  },
  {
    id: "saa",
    term: "SAA",
    full: "AWS Certified Solutions Architect - Associate",
    short: "아키텍트 관점의 AWS 어소시에이트 자격시험 — DVA와 비교 대상으로 자주 언급된다.",
    chapterId: "ch0-1",
  },
  {
    id: "on-demand",
    term: "온디맨드",
    full: "On-Demand",
    short: "약정 없이 쓴 만큼만 내는 기본 요금제 — AWS 종량제 과금의 표준 방식이다.",
  },
  {
    id: "free-tier",
    term: "프리 티어",
    full: "Free Tier",
    short: "신규 가입·상시 무료 사용량 — 일정 한도까지는 무료로 쓸 수 있는 요금 구간이다.",
  },
  {
    id: "apn",
    term: "APN",
    full: "AWS Partner Network",
    short: "AWS 공식 파트너사 프로그램 — 본문에서는 파트너 문맥으로만 스치듯 등장한다.",
  },
];
