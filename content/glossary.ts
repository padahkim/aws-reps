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
 *   • 전수의 유지: 누락이 발견되면 그 자리에서 추가한다 (#192~#194 구현·검수가 발견 지점).
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
    short: "계정 생성 시 만들어지는 최상위 사용자 — 일상 작업에는 쓰지 않고 MFA를 걸어 잠가 두는 것이 원칙이다.",
    detail:
      "계정 안에서는 모든 권한을 갖지만, Organizations 멤버 계정이라면 조직이 건 SCP가 루트 사용자도 제한한다.",
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
    term: "권한 경계",
    full: "Permissions Boundary",
    short: "자격 증명 기반 정책이 부여할 수 있는 권한의 최대 한도를 정하는 안전장치 정책 — 단 같은 계정의 리소스 기반 정책이 유저·역할 세션 ARN을 직접 지정해 허용한 접근에는 예외가 있다.",
    chapterId: "ch0-2",
  },
  {
    id: "pass-role",
    term: "iam:PassRole",
    short: "역할을 다른 서비스에 \"건네주는\" 행위에 붙는 IAM 권한 — EC2·Lambda 등에 역할을 지정하려면 지정하는 주체가 이 권한을 가져야 한다.",
    detail:
      "PassRole이라는 API가 따로 있는 게 아니라, 역할을 지정하는 다른 호출(ec2:RunInstances 등)에 얹혀 IAM이 함께 검사하는 액션이다. 아무 역할이나 붙여 관리자로 올라서는 권한 상승 경로를 막는 장치로, DVA 초빈출이다.",
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
    short: "클레임(정보 조각)을 담는 컴팩트 토큰 형식 — OIDC IdP의 ID 토큰이 보통 서명된 JWT로 발급되어 페더레이션의 재료가 된다.",
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
    short: "AWS API 요청 서명 방식 — 요청마다 서명을 만들어 요청자의 진위와 내용 위·변조를 검증하고, 타임스탬프로 오래된 요청의 재사용을 제한한다.",
    chapterId: "ch0-1",
  },
  {
    id: "credential-provider-chain",
    term: "Credential Provider Chain",
    short: "SDK·CLI가 자격 증명을 찾는 탐색 순서 — 환경 변수·프로파일·역할 같은 소스를 차례로 훑어 처음 찾은 것을 쓰되, 정확한 순서는 SDK·도구마다 다르다.",
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
    short: "계정의 API 호출을 기록하는 감사 로그 서비스(\"누가 언제 무엇을 했나\") — 관리 이벤트는 기본 기록되고, S3 객체 접근 같은 데이터 이벤트는 따로 켜야 남는다.",
    detail:
      "콘솔의 이벤트 히스토리는 최근 90일치 관리 이벤트만 보여 준다. 더 오래 보관하거나 분석하려면 트레일을 만들어 S3 버킷(필요하면 CloudWatch Logs까지)으로 계속 내보내거나, CloudTrail Lake의 이벤트 데이터 스토어에 적재해 거기서 바로 질의한다.\n\nS3 객체 읽기·쓰기나 Lambda 호출 같은 데이터 이벤트는 양이 많아 기본적으로 꺼져 있고 켜면 추가 과금된다 — 사고 뒤에 \"누가 이 객체를 지웠나\"가 안 남아 있는 흔한 원인이다.\n\n쓰임이 CloudWatch와 갈린다: 누가 어떤 API를 불렀나(감사)는 CloudTrail, 얼마나 느리고 얼마나 실패했나(운영 지표)는 CloudWatch다.",
  },
  {
    id: "access-analyzer",
    term: "Access Analyzer",
    full: "IAM Access Analyzer",
    short: "외부에 열려 있는 리소스 접근을 찾아내 알려 주는 IAM 분석 도구다.",
  },
  {
    id: "credential-report",
    term: "Credential Report",
    short: "계정 전체 유저의 자격 증명 상태(비밀번호·액세스 키 사용 시점 등)를 한 번에 내려받는 IAM 감사 보고서다.",
    chapterId: "ch0-2",
  },
  {
    id: "access-advisor",
    term: "Access Advisor",
    short: "유저·역할이 어떤 서비스에 실제로 접근했는지 보여 주는 IAM 도구 — 안 쓰는 권한을 걷어내는 근거가 된다.",
    chapterId: "ch0-2",
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
    detail:
      "값은 KMS 키로 암호화해 저장하고, 교체용 Lambda를 붙여 비밀번호를 주기적으로 자동 교체한다 — RDS처럼 교체 함수가 준비된 대상도 있다.\n\n대신 시크릿마다 월정액과 API 호출 요금이 붙는다. 그래서 시험의 판단 기준은 자동 교체가 필요한지다 — 필요하면 Secrets Manager, 단순 저장이면 Parameter Store 표준 계층(무료)이 정답이다.\n\n호출할 때마다 새로 조회하면 지연과 요금이 함께 늘기 때문에 받아 온 값을 캐시해 재사용하되, 만료 시간을 두거나 AWS가 주는 캐싱 라이브러리·Lambda 익스텐션을 쓴다 — 만료 없는 캐시는 시크릿이 교체된 뒤에도 옛 비밀번호를 계속 써서 인증 실패를 만든다.",
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
    short: "VPC를 더 잘게 나눈 네트워크 구역 — 라우트 테이블에 인터넷 게이트웨이로 가는 경로가 있으면 퍼블릭, 없으면 프라이빗이다.",
  },
  {
    id: "security-group",
    term: "보안 그룹",
    full: "Security Group",
    short: "리소스의 네트워크 인터페이스(ENI) 단위 가상 방화벽 — EC2만이 아니라 Lambda·RDS 등 VPC 리소스에 붙어 허용할 인바운드/아웃바운드 트래픽을 정한다.",
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
      "AWS 서비스 접근용 VPC 엔드포인트는 Gateway(S3·DynamoDB 전용, 무료)와 Interface(대부분의 서비스, ENI 기반 유료)로 나뉜다 — 별도로 네트워크 어플라이언스용 Gateway Load Balancer 엔드포인트도 있다. 시험에서는 \"프라이빗 서브넷에서 인터넷 없이 S3 접근\" 시나리오로 나온다.",
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
    detail:
      "오리진(S3 버킷·ALB·아무 HTTP 서버)을 뒤에 두고 엣지에서 응답을 캐시한다. S3를 오리진으로 둘 때는 버킷을 비공개로 잠그고 OAC(구 OAI)로 CloudFront에만 읽기를 허용하는 것이 정석이다.\n\n무엇을 캐시 키로 삼고 얼마나 보관할지는 캐시 정책이 정하고, 배포 직후 옛 콘텐츠를 밀어내야 하면 무효화(invalidation)를 건다.\n\n유료·비공개 콘텐츠는 CloudFront 서명된 URL(파일 하나)이나 서명된 쿠키(여러 파일)로 막는다 — 이름이 닮은 S3 presigned URL과 헷갈리기 쉬운데, 엣지 캐시 앞단에서 막는 쪽이 CloudFront다. 배포에 내 도메인을 붙일 때 쓰는 뷰어 쪽 인증서는 us-east-1의 ACM이어야 한다 — 오리진과의 HTTPS는 별개라, 예컨대 ALB 오리진은 그 ALB가 있는 리전의 인증서를 쓴다.",
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
    short: "서버 관리 없이 코드를 이벤트 단위로 실행하는 서버리스 컴퓨팅 서비스 — 요청 수와 컴퓨팅 시간으로 과금된다.",
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
    detail:
      "실행 환경 수명 주기의 INIT 단계에서 일어난다 — 런타임을 띄우고 배포 패키지를 내려받아 핸들러 바깥의 초기화 코드까지 돌리는 시간이다. 뒤이은 호출이 그 데워진 환경에 도착하면 이 비용을 다시 내지 않는다 — 다만 재사용은 보장이 아니다. 동시 호출이 늘어 환경이 더 필요해지거나, 오래 놀아 환경이 회수되거나, 함수 설정을 바꾸면 새 환경이 떠서 다시 겪는다.\n\n줄이는 수단은 셋이다. 프로비저닝된 동시성으로 환경을 미리 초기화해 두거나, 배포 패키지·의존성을 줄여 로드를 짧게 하거나, SDK 클라이언트·DB 연결을 핸들러 밖에서 한 번만 만들어 재사용하는 것이다.\n\n마지막 항목은 콜드 스타트만이 아니라 웜 호출의 지연도 함께 줄이기 때문에 시험에서 특히 자주 정답이 된다.",
    chapterId: "ch1-2",
  },
  {
    id: "concurrency",
    term: "동시성",
    full: "Concurrency",
    short: "같은 순간 실행 중인 Lambda 실행 환경의 수 — Reserved(상한 예약)와 Provisioned(미리 데워 두기)로 제어한다.",
    detail:
      "계정·리전당 기본 한도는 1,000이고 필요하면 증설을 요청한다. 대략 초당 요청 수 × 평균 실행 시간(초)이 동시성이라, 100ms짜리 함수를 초당 100번 부르면 동시성은 10 남짓이다.\n\n예약된 동시성은 특정 함수 몫을 떼어 두는 것이다 — 그 함수는 항상 그만큼 쓸 수 있지만 동시에 그것이 상한이 되고, 떼어 낸 만큼 다른 함수가 쓸 몫은 줄어든다. 0으로 두면 함수를 사실상 정지시키는 데도 쓴다.\n\n프로비저닝된 동시성은 성격이 다르다 — 미리 초기화해 둔 환경을 유지해 콜드 스타트를 없애는 유료 기능이다. 한도를 넘어선 동기 호출은 429로 스로틀된다.",
    chapterId: "ch1-2",
  },
  {
    id: "throttling",
    term: "스로틀링",
    full: "Throttling",
    short: "요청이 한도를 넘을 때 AWS가 요청을 거절하는 것 — Lambda 동기 호출에서는 429 오류로 나타나며, 백오프 재시도로 대응한다.",
    detail:
      "서비스마다 신호가 다르다 — Lambda 동기 호출과 API Gateway는 429, DynamoDB는 프로비저닝 용량 초과면 ProvisionedThroughputExceededException(온디맨드에서는 ThrottlingException), S3는 503 Slow Down, KMS는 ThrottlingException으로 알린다.\n\n대응의 정답 패턴은 지수 백오프에 지터(무작위 지연)를 더한 재시도다. 지터가 없으면 밀린 요청들이 같은 순간에 다시 몰려들어 스로틀이 반복되기 때문이며, AWS SDK에는 이 재시도가 기본으로 들어 있다.\n\n재시도로도 못 버티면 원인을 고친다 — 한도 증설 요청, DynamoDB 용량 모드·파티션 키 재설계, Lambda 동시성 조정이 그 자리에 온다.",
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
    detail:
      "내 함수가 아니라 Lambda 서비스가 소스를 폴링해 레코드를 모아 함수에 넘긴다 — SQS·Kinesis·DynamoDB Streams·MSK가 대표적이고, 자체 관리 Kafka·Amazon MQ·DocumentDB 변경 스트림도 같은 방식으로 붙는다. 배치 크기와 배치 윈도로 몇 개씩, 얼마나 기다렸다 넘길지 정한다.\n\nSQS에서는 배치 처리가 실패하면 메시지가 큐로 돌아가 가시성 제한 시간이 지난 뒤 다시 배달되고, 반복 실패는 큐에 걸어 둔 DLQ가 받아 낸다.\n\n스트림(Kinesis·DynamoDB Streams)은 샤드 안의 순서를 지켜야 해서 실패한 레코드 하나가 뒤를 통째로 막을 수 있다. 그래서 부분 배치 응답(실패한 레코드만 보고)·재시도 횟수·레코드 최대 수명·실패 대상 설정으로 막힘을 푼다.",
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
    short: "처리에 계속 실패한 메시지·이벤트를 따로 보내 두는 실패 목적지 — Lambda 비동기 호출에서는 SQS 큐뿐 아니라 SNS 토픽도 지정할 수 있다.",
    detail:
      "층이 셋이라 헷갈리기 쉽다. Lambda 비동기 호출의 DLQ는 자동 재시도(기본 2회)까지 실패한 이벤트를 SQS 큐나 SNS 토픽으로 보낸다 — 본문은 원래 이벤트이고 오류 쪽은 RequestID·ErrorCode·ErrorMessage가 메시지 속성으로 붙는 정도라, 함수의 응답까지 담은 구조화된 호출 기록은 없다.\n\n같은 자리를 대체하는 최신 수단이 Destinations다. 실패만이 아니라 성공도 보낼 수 있고 호출 응답·오류 정보까지 함께 실어 주므로, 새로 만든다면 이쪽이 권장 경로다.\n\nSQS 큐 자체의 DLQ는 층이 다르다 — 큐에 건 리드라이브 정책의 maxReceiveCount만큼 소비에 실패한 메시지를 다른 큐로 옮기는 것으로, Lambda 설정이 아니라 큐 설정이다.",
    chapterId: "ch1-2",
  },
  {
    id: "destinations",
    term: "Destinations",
    full: "Lambda Destinations",
    short: "비동기 호출·ESM 처리의 성공/실패 결과를 SQS·SNS·EventBridge·Lambda로 라우팅하는 기능 — 실패만 받는 DLQ와 달리 성공도 보낼 수 있다.",
    chapterId: "ch1-2",
  },
  {
    id: "layers",
    term: "레이어",
    full: "Lambda Layers",
    short: "여러 함수가 공유하는 종속성·라이브러리 묶음 — 배포 패키지에서 공통 부분을 분리해 재사용한다.",
    chapterId: "ch1-2",
  },
  {
    id: "extensions",
    term: "익스텐션",
    full: "Lambda Extensions",
    short: "함수 실행 환경에 나란히 붙어 모니터링·시크릿 조회 같은 부가 작업을 담당하는 보조 프로세스다.",
    chapterId: "ch1-2",
  },
  {
    id: "lambda-at-edge",
    term: "Lambda@Edge",
    short: "CloudFront 배포에 연결해 전 세계 엣지로 복제되는 Lambda — us-east-1에서 만들고 번호 버전을 발행해 연결해야 한다($LATEST·별칭 불가).",
    chapterId: "ch1-2",
  },
  {
    id: "cloudfront-functions",
    term: "CloudFront Functions",
    short: "CloudFront 엣지에서 도는 초경량 JavaScript 함수 — 헤더 조작 같은 밀리초급 처리 전용이고, 더 무거운 일은 Lambda@Edge 몫이다.",
    chapterId: "ch1-2",
  },
  {
    id: "function-url",
    term: "함수 URL",
    full: "Lambda Function URL",
    short: "Lambda 함수에 직접 붙는 전용 HTTPS 엔드포인트 — API Gateway 없이 함수를 바로 호출하게 해 준다.",
    chapterId: "ch1-2",
  },
  {
    id: "api-gateway",
    term: "API Gateway",
    full: "Amazon API Gateway",
    short: "백엔드 앞에 세우는 관리형 API 관문 — HTTP 요청을 받아 Lambda 등으로 라우팅하고 인증·스로틀링을 대신 처리한다.",
    detail:
      "API 유형은 REST·HTTP·WebSocket 셋이고(WebSocket은 양방향 실시간 통신용), 시험에서 자주 갈리는 건 앞의 둘이다. HTTP API는 더 싸고 빠르지만 기능이 적고, API 키·사용량 계획·응답 캐싱·요청 검증 같은 장치는 REST API 쪽이다 — 시험은 \"이 기능이 필요하다\"로 둘을 가른다.\n\n인증은 REST API에서 IAM(SigV4)·Cognito User Pool·직접 만든 Lambda 권한 부여자 중에 고르고, HTTP API는 OIDC·OAuth 2.0 토큰을 검사하는 JWT 권한 부여자를 내장으로 갖는다. Lambda 프록시 통합을 쓰면 요청 전체가 event 객체로 넘어오고, 응답은 statusCode·headers·body 형식을 지켜야 한다.\n\n배포 단위는 스테이지(dev·prod)다 — 변경은 스테이지에 배포해야 반영되고, 캐싱·스로틀 한도도 스테이지 단위로 건다. 스테이지 변수를 쓰면 같은 API가 스테이지마다 다른 Lambda 별칭을 가리키게 할 수 있다.",
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
    detail:
      "컨테이너 실행 명세는 태스크 정의에 적는다(이미지·CPU/메모리·포트·환경 변수). 이걸 실행한 한 벌이 태스크이고, 태스크 개수를 유지하고 로드 밸런서에 연결해 주는 것이 서비스다.\n\n역할이 두 개라는 점이 시험 단골이다 — 태스크 역할은 컨테이너 안의 내 코드가 AWS API를 부를 때 쓰는 권한이고, 태스크 실행 역할은 ECS가 ECR에서 이미지를 받아오고 로그를 CloudWatch로 보낼 때 쓰는 권한이다. 앱이 S3에 못 쓰면 태스크 역할, 이미지를 못 받아오면 실행 역할을 본다.\n\n실행 인프라는 EC2 시작 유형(내가 띄운 인스턴스 위)과 Fargate(서버리스) 중에 고른다.",
  },
  {
    id: "ecr",
    term: "ECR",
    full: "Amazon Elastic Container Registry",
    short: "컨테이너 이미지를 저장하는 AWS의 레지스트리 — Docker Hub의 AWS판이다.",
    detail:
      "프라이빗 리포지토리는 push·pull 전에 인증이 필요하다 — aws ecr get-login-password로 받은 토큰(12시간 유효)을 docker login에 넘기는 것이 표준 절차다(익명으로 받아 갈 수 있는 ECR Public 리포지토리는 예외다).\n\n이미지가 쌓이면 저장 비용이 늘어나므로 수명 주기 정책으로 오래된·태그 없는 이미지를 자동 정리하고, 이미지 스캔으로 알려진 취약점을 확인한다.\n\nLambda 컨테이너 이미지도 여기서 가져오는데, 함수와 같은 리전의 리포지토리여야 한다.",
  },
  {
    id: "fargate",
    term: "Fargate",
    full: "AWS Fargate",
    short: "서버(EC2) 관리 없이 컨테이너를 실행하는 서버리스 컨테이너 엔진 — ECS·EKS 위에서 쓴다.",
    detail:
      "태스크마다 vCPU·메모리 조합만 고르면 되고 인스턴스를 띄우거나 패치할 일이 없다. 반대로 EC2 시작 유형은 컨테이너를 올릴 인스턴스를 직접 준비하고 남는 용량도 직접 관리한다.\n\n과금 단위도 다르다 — Fargate는 태스크가 요청한 vCPU·메모리를 태스크가 돈 시간만큼 내고, EC2 시작 유형은 태스크가 몇 개든 인스턴스 요금을 낸다. 띄엄띄엄 도는 워크로드는 Fargate가, 인스턴스를 빽빽이 채워 쓸 수 있으면 EC2 쪽이 유리한 편이다.\n\n대신 호스트에 직접 손대야 하는 일부 기능은 EC2 시작 유형에서만 된다.",
  },
  {
    id: "alb",
    term: "ALB",
    full: "Application Load Balancer",
    short: "HTTP(S) 계층에서 트래픽을 나눠 주는 로드 밸런서 — Lambda를 대상(타겟)으로 직접 연결할 수도 있다.",
    chapterId: "ch1-2",
  },
  {
    id: "sam",
    term: "SAM",
    full: "AWS Serverless Application Model",
    short: "서버리스 앱 전용 IaC 프레임워크 — CloudFormation을 서버리스용으로 줄인 문법과 로컬 테스트 CLI를 제공한다.",
    detail:
      "템플릿 맨 위의 Transform 선언이 SAM 문법을 CloudFormation으로 펼친다 — 배포되는 실체는 결국 CloudFormation 스택이다. AWS::Serverless::Function 한 덩어리가 함수·실행 역할·트리거를 한꺼번에 만들어 준다 — 로그 그룹은 여기 없다(Lambda가 첫 호출 때 런타임에 만든다).\n\nsam build로 의존성을 묶고 sam deploy로 배포하며, sam local invoke·sam local start-api는 도커로 함수를 로컬에서 돌려 본다.\n\n함수에 AutoPublishAlias와 DeploymentPreference를 적으면 CodeDeploy가 붙어 별칭 트래픽을 카나리·선형으로 옮긴다 — SAM이 무중단 배포를 다루는 지점이다.",
    chapterId: "ch1-2",
  },
  {
    id: "cloudformation",
    term: "CloudFormation",
    full: "AWS CloudFormation",
    short: "인프라를 코드(템플릿)로 정의해 생성·갱신하는 IaC 서비스다.",
    detail:
      "템플릿은 Parameters(입력)·Mappings(조회 표)·Conditions(조건)·Resources(만들 리소스)·Outputs(내보낼 값)으로 구성되고, 실제로 필수인 건 Resources뿐이다. 리소스끼리 값을 주고받을 때는 !Ref(주로 이름·ID)와 !GetAtt(그 밖의 속성)를 쓴다.\n\n스택을 고칠 때는 변경 세트를 만들어 무엇이 바뀌고 무엇이 통째로 교체되는지 먼저 보는 것이 안전한 경로다. 업데이트가 실패하면 이전 상태로 롤백되고, 스택 밖에서 손으로 바꾼 부분은 드리프트 감지로 찾는다.",
  },
  {
    id: "codedeploy",
    term: "CodeDeploy",
    full: "AWS CodeDeploy",
    short: "배포 자동화 서비스 — Lambda에서는 별칭의 트래픽 전환(카나리·선형)을 자동화한다.",
    detail:
      "Lambda에서는 별칭이 가리키는 트래픽을 새 버전으로 옮기는 일을 맡는다. 전환 속도는 배포 구성이 정한다 — SAM 템플릿에서는 Canary10Percent5Minutes(10%를 5분 지켜본 뒤 전량)·Linear10PercentEvery1Minute(1분마다 10%씩)·AllAtOnce처럼 접두사 없이 적고, CodeDeploy 자체의 배포 구성 이름은 CodeDeployDefault.LambdaCanary10Percent5Minutes 식으로 접두사가 붙은 별개 네임스페이스다.\n\n절차는 AppSpec 파일이 정의한다. Lambda 배포에는 BeforeAllowTraffic(전환 전)·AfterAllowTraffic(전환 후) 훅을 걸어 검증 함수를 돌릴 수 있고, 훅이 실패하거나 연결해 둔 CloudWatch 경보가 울리면 배포가 실패·중지되는데, 이전 버전으로 되돌아가는 건 배포 그룹에 자동 롤백(AutoRollbackConfiguration의 DEPLOYMENT_FAILURE·DEPLOYMENT_STOP_ON_ALARM 같은 트리거)을 켜 두었을 때다.\n\nEC2를 대상으로 하면 인플레이스와 블루/그린으로 갈리고 훅 이름도 BeforeInstall·ApplicationStart·ValidateService 등으로 달라진다.",
    chapterId: "ch1-2",
  },
  {
    id: "codepipeline",
    term: "CodePipeline",
    full: "AWS CodePipeline",
    short: "빌드→테스트→배포 흐름을 잇는 CI/CD 파이프라인 서비스다.",
    detail:
      "파이프라인은 스테이지(소스→빌드→배포…)로 나뉘고, 각 스테이지가 만든 결과물은 아티팩트로 S3 버킷을 거쳐 다음 스테이지에 전달된다 — 스테이지 사이의 연결 고리가 이 아티팩트다.\n\n빌드는 보통 CodeBuild가 맡고, 무엇을 어떻게 빌드할지는 기본 위치인 소스 루트의 buildspec.yml에 단계별 명령으로 적는다(프로젝트 설정이나 빌드별 재정의로 다른 경로·인라인·S3에서 가져올 수도 있다). 배포 단계는 CodeDeploy·CloudFormation·ECS 등으로 이어진다.\n\n스테이지가 실패하면 파이프라인은 거기서 멈추고 다음으로 넘어가지 않는다. 사람의 확인을 끼우고 싶으면 수동 승인 액션을 넣는다.",
  },
  {
    id: "eventbridge",
    term: "EventBridge",
    full: "Amazon EventBridge",
    short: "이벤트 버스 서비스 — 서비스 이벤트나 스케줄 규칙(서버리스 크론)으로 Lambda 등을 트리거한다.",
    detail:
      "규칙에 이벤트 패턴을 적어 두면 조건에 맞는 이벤트만 대상(Lambda·SQS·Step Functions 등)으로 보낸다. SNS와 갈리는 지점은 이벤트 버스라는 모델이다 — S3 객체 생성 같은 이벤트는 SNS로도 곧장 보낼 수 있지만, 여러 소스의 이벤트를 한 버스에 모아 내용으로 걸러 대상마다 다르게 보내고, 보관(아카이브)했다가 다시 흘리는(리플레이) 것은 EventBridge 쪽이다.\n\n규칙은 스케줄로도 쓴다 — cron·rate 식을 걸면 서버 없는 크론이 되어 정해진 시각에 Lambda를 깨운다.\n\n같은 \"알림\"이라도 역할이 갈린다: 정해진 구독자에게 그대로 밀어 주는 건 SNS, 이벤트 내용을 보고 어디로 보낼지 고르는 라우팅이면 EventBridge다(예전 이름은 CloudWatch Events).",
    chapterId: "ch1-2",
  },
  {
    id: "x-ray",
    term: "X-Ray",
    full: "AWS X-Ray",
    short: "분산 추적 서비스 — 요청이 여러 서비스를 거쳐 가는 경로와 병목 구간을 시각화한다.",
    detail:
      "요청 하나가 지나간 자취를 세그먼트(서비스 단위)와 서브세그먼트(그 안의 호출 단위)로 기록해 서비스 맵과 지연 분포를 그려 준다 — 어디서 느려졌는지를 찾는 도구다.\n\n추적에 값을 붙일 때 어노테이션은 색인되어 필터 검색에 쓸 수 있고, 메타데이터는 남기만 할 뿐 검색되지 않는다. 트래픽이 많으면 샘플링 규칙(기본은 초당 1건에 나머지의 5%)으로 비용을 조절한다.\n\n켜는 방법은 환경마다 다르다 — Lambda는 활성 추적을 켜고 실행 역할에 X-Ray 쓰기 권한을 주면 되고, EC2·ECS에서는 X-Ray 데몬을 함께 띄워 SDK가 보낸 세그먼트를 중계하게 한다.",
    chapterId: "ch1-2",
  },
  {
    id: "cloudwatch",
    term: "CloudWatch",
    full: "Amazon CloudWatch",
    short: "AWS의 모니터링 서비스 — 지표(메트릭)·로그(CloudWatch Logs)·경보를 한곳에 모은다.",
    detail:
      "셋을 구분해서 본다. 지표는 숫자 시계열이고(네임스페이스·차원으로 구분, 표준 1분·고해상도 1초 단위), 로그는 로그 그룹과 스트림에 쌓이는 텍스트이며, 경보는 지표가 임계값을 넘을 때 OK·ALARM·INSUFFICIENT_DATA로 상태를 바꾸며 SNS 알림 등을 발동시킨다.\n\n앱 고유의 값(주문 수 등)은 PutMetricData로 사용자 지정 지표를 올리거나, 로그에 EMF 형식으로 심어 지표로 자동 추출되게 한다.\n\nLambda 로그가 안 보이는 흔한 원인은 실행 역할에 로그 기록 권한이 없는 것이다. 쌓인 로그를 뒤질 때는 Logs Insights로 질의한다.",
    chapterId: "ch1-2",
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
    short: "S3에서 객체를 담는 최상위 컨테이너 — 이름은 AWS 파티션 안의 모든 계정·리전을 통틀어 유일해야 한다(일반 계정 기준 사실상 전 세계).",
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
    id: "intelligent-tiering",
    term: "Intelligent-Tiering",
    full: "S3 Intelligent-Tiering",
    short: "접근 패턴을 예측할 수 없을 때 고르는 S3 스토리지 클래스 — 접근 빈도에 따라 객체를 자동으로 싼 계층으로 옮겨 준다.",
    chapterId: "ch1-1",
  },
  {
    id: "transfer-acceleration",
    term: "Transfer Acceleration",
    full: "S3 Transfer Acceleration",
    short: "멀리 떨어진 사용자의 업로드·다운로드를 엣지 로케이션 경유로 가속하는 S3 기능이다.",
    chapterId: "ch1-1",
  },
  {
    id: "bucket-key",
    term: "S3 Bucket Key",
    short: "SSE-KMS에서 버킷 수준 키를 재사용해 KMS 호출을 최대 99% 줄이는 설정 — 대량 업로드 시 KMS 스로틀링의 해법이다.",
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
    short: "장기 보관(아카이브)용 초저가 스토리지 클래스군 — Instant Retrieval은 즉시 조회되고, Flexible Retrieval·Deep Archive는 꺼내는 데 시간이 걸린다.",
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
    short: "서명을 미리 담은 임시 URL — AWS 자격 증명이 없는 사람도 그 객체에 접근하게 해 주며, 유효 기간은 URL에 적은 기한과 서명에 쓴 자격 증명의 수명 중 짧은 쪽이다.",
    detail:
      "URL은 만든 사람의 권한을 그대로 빌려준다 — 서명한 주체가 못 하는 일은 그 URL로도 못 하고, 반대로 버킷이 비공개여도 URL을 받은 사람은 그 객체에 접근한다.\n\n다운로드(GET)뿐 아니라 업로드(PUT)용으로도 만들 수 있어서, 브라우저가 서버를 거치지 않고 S3에 직접 올리게 하는 시나리오의 표준 답이 된다.\n\n기한은 서명 방식(SigV4) 상한이 7일이지만, 역할로 받은 임시 자격 증명으로 서명했다면 그 세션이 만료되는 순간 URL도 함께 죽는다.",
    chapterId: "ch1-1",
  },
  {
    id: "cors",
    term: "CORS",
    full: "Cross-Origin Resource Sharing",
    short: "다른 출처(도메인)에서 온 브라우저 요청을 허용하는 규칙 — S3 버킷 등에 설정한다.",
    chapterId: "ch1-1",
  },
  {
    id: "access-point",
    term: "액세스 포인트",
    full: "S3 Access Points",
    short: "한 버킷에 용도별 진입점을 여러 개 만들어 각자 정책을 붙이는 기능 — 거대해진 버킷 정책 하나를 쪼개 준다.",
    chapterId: "ch1-1",
  },
  {
    id: "s3-analytics",
    term: "S3 Analytics",
    short: "객체 접근 패턴을 분석해 Standard→Standard-IA 전환 시점을 추천해 주는 분석 도구다.",
    chapterId: "ch1-1",
  },
  {
    id: "s3-event-notification",
    term: "S3 이벤트 알림",
    full: "S3 Event Notifications",
    short: "객체 생성·삭제 같은 버킷 이벤트를 SQS·SNS·Lambda·EventBridge로 쏘아 주는 기능이다.",
    chapterId: "ch1-1",
  },
  {
    id: "s3-access-log",
    term: "S3 액세스 로그",
    full: "S3 Server Access Logging",
    short: "버킷에 온 요청을 다른 버킷에 로그로 남기는 기능 — 로그 버킷을 자기 자신으로 지정하면 무한 루프가 된다.",
    chapterId: "ch1-1",
  },
  {
    id: "mfa-delete",
    term: "MFA Delete",
    short: "S3 객체 버전의 영구 삭제·버전 관리 중단에 MFA 인증을 요구하는 보호 설정 — 버전 관리가 전제이고 루트 사용자만 켤 수 있다.",
    chapterId: "ch1-1",
  },
  {
    id: "object-lambda",
    term: "Object Lambda",
    full: "S3 Object Lambda",
    short: "S3 객체를 꺼내는 순간 Lambda로 가공해 돌려주는 기능 — 원본은 하나만 두고 응답만 바꾼다.",
    detail:
      "2025-11부터 기존 사용 고객·일부 파트너 전용으로 전환돼 신규 사용은 막혔지만, 시험 선지에는 여전히 등장한다 — 개념은 익혀 둔다.",
    chapterId: "ch1-1",
  },
  {
    id: "efs",
    term: "EFS",
    full: "Amazon Elastic File System",
    short: "여러 인스턴스·Lambda가 동시에 마운트해 쓰는 공유 파일 시스템(NFS)이다.",
    chapterId: "ch1-2",
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
    detail:
      "테이블마다 파티션 키(항목을 나눠 담는 기준)를 정하고, 필요하면 정렬 키를 더해 두 값의 조합으로 항목 하나를 짚는다. 이 키로 찾는 Query는 싸고 빠르지만 키 없이 전체를 훑는 Scan은 느리고 비싸다 — 시험은 대개 Scan을 오답 쪽에 둔다.\n\n키가 아닌 속성으로 찾아야 하면 인덱스를 만든다. GSI는 키 구성이 자유로워 파티션 키를 다르게 잡을 수 있고 언제든 추가할 수 있지만 읽기가 최종 일관성뿐이고, LSI는 파티션 키가 같고 정렬 키만 다르며 테이블을 만들 때만 붙일 수 있다.\n\n용량은 온디맨드(쓴 만큼)와 프로비저닝(RCU·WCU를 미리 잡고 Auto Scaling) 중 고른다. 프로비저닝 용량을 넘기면 ProvisionedThroughputExceededException이, 온디맨드에서 한도나 핫 키에 걸리면 ThrottlingException이 난다. 항목 변경을 이벤트로 흘려 Lambda를 깨우려면 DynamoDB Streams를 켠다.",
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
    detail:
      "캐시를 채우는 방식이 시험의 축이다. Lazy loading(캐시에 없을 때만 DB에서 읽어 채움)은 실제로 쓰는 데이터만 캐시되지만 첫 요청이 느리고 값이 오래될 수 있다. Write-through(쓸 때 캐시도 같이 갱신)는 늘 최신이지만 읽히지 않을 데이터까지 쌓인다 — 보통 TTL을 함께 걸어 절충한다.\n\n엔진은 Redis 계열과 Memcached 중에 고른다. 복제·자동 페일오버·영속성·정렬 자료구조가 필요하면 Redis 계열(현재는 Redis OSS와 그 호환 오픈소스인 Valkey 중에 고르고, AWS는 Valkey를 권한다), 단순 키-값 캐시를 여러 노드에 나눠 담으면 충분하면 Memcached다. 세션 저장소와 읽기 부하가 큰 DB 앞단이 대표 시나리오다.",
  },

  // ── 메시징·통합 ───────────────────────────────────────────────────────
  {
    id: "sqs",
    term: "SQS",
    full: "Amazon Simple Queue Service",
    short: "완전관리형 메시지 큐 — 생산자와 소비자를 분리(디커플링)해 비동기 처리를 만든다.",
    detail:
      "표준 큐는 처리량이 사실상 무제한이지만 순서를 보장하지 않고 같은 메시지가 두 번 올 수 있다 — 소비자를 멱등하게(같은 메시지를 여러 번 처리해도 결과가 같게) 만드는 것이 전제다. 순서와 중복 제거가 필요하면 이름이 .fifo로 끝나는 FIFO 큐를 쓰되 처리량이 기본 초당 300건(배치 시 3,000건)으로 제한된다.\n\n소비자가 메시지를 받으면 가시성 제한 시간(기본 30초, 최대 12시간) 동안 다른 소비자에게 숨겨진다. 이 시간 안에 삭제하지 못하면 메시지가 되살아나 중복 처리가 되므로, 처리가 오래 걸리면 값을 늘리거나 처리 중에 연장한다.\n\n메시지는 기본 4일(최대 14일) 보관되고 크기는 최대 256KB다. 빈 응답에 돈을 쓰지 않으려면 롱 폴링(최대 20초 대기)을 켠다.",
  },
  {
    id: "sns",
    term: "SNS",
    full: "Amazon Simple Notification Service",
    short: "게시/구독(pub/sub) 알림 서비스 — 한 메시지를 여러 구독자에게 동시에 밀어 보낸다.",
    detail:
      "대표 패턴은 팬아웃이다 — 토픽 하나에 SQS 큐 여러 개를 구독시켜 같은 메시지를 여러 처리 계통에 동시에 흘린다. 구독자는 SQS·Lambda·HTTP(S)·이메일·SMS 등이 될 수 있다.\n\n구독마다 필터 정책을 걸면 메시지 속성이 맞는 것만 받아, 소비자 쪽에서 걸러 버리는 낭비를 없앤다. 순서·중복 제거가 필요하면 FIFO 토픽을 쓰는데, 이때 구독자는 SQS 큐로 제한된다 — 표준 큐도 구독할 수 있지만 순서와 중복 제거를 끝까지 지키려면 SQS FIFO 큐를 붙여야 한다.\n\n푸시(SNS)와 폴링(SQS)의 차이가 시험 선지의 갈림길이다 — 여러 곳에 즉시 알리는 건 SNS, 처리 속도를 소비자에게 맡기고 쌓아 두는 건 SQS다.",
  },
  {
    id: "kinesis",
    term: "Kinesis",
    full: "Amazon Kinesis",
    short: "실시간 스트리밍 데이터 서비스 — 스트림 처리는 Kinesis Data Streams가 담당하고, 적재를 맡던 Firehose는 현재 Amazon Data Firehose로 이름이 바뀌어 분리됐다.",
    detail:
      "스트림은 샤드로 나뉘고 처리량이 샤드 수에 비례한다 — 샤드당 쓰기 초당 1MB·1,000레코드, 읽기 초당 2MB다. 레코드의 파티션 키가 어느 샤드로 갈지를 정하므로 키가 한쪽으로 쏠리면 그 샤드만 뜨거워진다.\n\n소비자가 여럿이면 기본 모드에서는 샤드의 읽기 대역을 나눠 쓰고, 향상된 팬아웃을 켜면 소비자마다 초당 2MB를 따로 받는다. 데이터는 기본 24시간(최대 365일) 남아 있어 같은 구간을 여러 번 다시 읽을 수 있다.\n\n이 \"읽어도 사라지지 않는다\"가 SQS와의 분기점이다 — 작업을 하나씩 꺼내 처리하고 지우면 SQS, 같은 스트림을 여러 계통이 각자 읽고 재처리까지 해야 하면 Kinesis다.",
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
    detail:
      "워크플로는 ASL이라는 JSON 문법으로 쓴다. 상태 유형은 Task(작업 실행)·Choice(분기)·Parallel(병렬)·Map(반복)·Wait(대기) 등이고, 상태마다 Retry(재시도)와 Catch(오류 분기)를 선언할 수 있다 — 재시도·분기 로직을 Lambda 코드에서 걷어내는 것이 이 서비스의 값이다.\n\n종류는 둘이다. Standard는 최대 1년까지 돌고 실행 이력이 남으며 워크플로가 정확히 한 번 실행된다(선언해 둔 Retry로 다시 도는 것은 별개다). Express는 최대 5분이지만 훨씬 싸서 고빈도 처리에 쓰는데, 비동기로 시작하면 같은 작업이 두 번 실행될 수 있고 동기로 시작하면 반대로 재시도가 없어 한 번을 넘지 않는다.",
  },
  {
    id: "cognito",
    term: "Cognito",
    full: "Amazon Cognito",
    short: "앱 사용자의 인증·회원 관리 서비스 — 소셜 로그인과 AWS 자격 증명 교환(페더레이션)을 대신해 준다.",
    detail:
      "두 축을 가르는 것이 핵심이다. User Pool은 사용자 디렉터리로 회원가입·로그인·MFA·소셜 로그인을 대신 처리하고, 성공하면 JWT(ID 토큰·액세스 토큰)를 발급한다 — 내 앱의 로그인이다.\n\nIdentity Pool(페더레이티드 자격 증명)은 그 토큰이나 구글 같은 외부 IdP 토큰을 받아 AWS 임시 자격 증명으로 바꿔 준다 — 앱이 S3·DynamoDB를 직접 호출해야 할 때 쓴다.\n\n그래서 \"사용자를 로그인시켜라\"는 User Pool, \"로그인한 사용자가 AWS 리소스에 직접 접근하게 하라\"는 Identity Pool이 답이다.",
  },

  // ── 시험·과금 ─────────────────────────────────────────────────────────
  {
    id: "arn",
    term: "ARN",
    full: "Amazon Resource Name",
    short: "AWS 리소스의 전역 고유 주소 — arn:<파티션>:<서비스>:<리전>:<계정>:<리소스> 형식이며, 일반 계정의 파티션은 aws다(예: arn:aws:…).",
    detail:
      "정책의 Resource 칸에 들어가는 것이 이 주소다. 서비스에 따라 리전·계정 칸이 비기도 한다 — S3 버킷은 이름이 전역 유일이라 arn:aws:s3:::my-bucket처럼 두 칸이 비고, IAM 리소스는 리전 칸이 빈다.\n\n와일드카드(*)로 범위를 넓히는데, 버킷 자체와 그 안의 객체가 다른 ARN이라는 점이 시험 함정이다 — 객체 작업(GetObject)은 arn:aws:s3:::my-bucket/*, 버킷 작업(ListBucket)은 arn:aws:s3:::my-bucket이라, 목록 조회와 다운로드를 둘 다 허용하려면 두 ARN을 함께 적어야 한다.",
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
    short: "일정 한도까지 무료로 쓰는 요금 구간 — 신규 가입 혜택(크레딧·기간 한정 무료 플랜)과 상시 무료 한도는 별개 범주다.",
  },
  {
    id: "apn",
    term: "APN",
    full: "AWS Partner Network",
    short: "AWS 공식 파트너사 프로그램 — 본문에서는 파트너 문맥으로만 스치듯 등장한다.",
  },
];
