import type { SelfQuizEntry } from "../../schema";

/**
 * ch3-1 섹션 셀프 퀴즈 (#272) — 인출 카드 아래 자기채점 덱.
 * 문항 지침(#98): 짧은 시나리오·사실 큐 + 스스로 맞았는지 판정 가능한 1~2문장 정답.
 * 소재의 1차 원천은 각 섹션의 EXAM POINT 이고, 카드(./session.ts)와 주제가 겹쳐도 되지만
 * 문장 재탕은 금지 — 카드는 구조·인과를 서술로, 셀프 퀴즈는 판정형 핵심 사실을 맡는다.
 *
 * 물음은 전부 본문이 가르친 것만 묻는다 (CLAUDE.md Audience) — "이 패턴이 시험에 어떤
 * 함정으로 나오는가" 류는 학습자가 답할 재료를 받은 적이 없으므로 넣지 않았다.
 * 시험 각도가 필요한 곳은 답(a) 쪽에 얹었다.
 */
export const selfQuiz: SelfQuizEntry[] = [
  // ── 01 Cognito 개요 — 두 개의 풀 ─────────────────────────────────────
  {
    slug: "sq-cognito-two-pools-output",
    section: "01",
    q: "어떤 서비스가 “로그인에 성공하니 토큰이 나왔다”고 한다 — User Pool인가 Identity Pool인가?",
    a: "User Pool이다. 산출물이 JWT 토큰이면 User Pool, 임시 AWS 자격 증명이면 Identity Pool로 가른다.",
  },
  {
    slug: "sq-cognito-external-users",
    section: "01",
    q: "Cognito가 신원을 부여하는 대상은 AWS 콘솔·CLI에 접근하는 IAM 주체인가, 애플리케이션 사용자인가?",
    a: "애플리케이션 사용자다 — 사내외 앱에 로그인하는 사람이며, IAM 사용자·역할로 AWS 계정 안에 등록할 필요가 없다.",
  },

  // ── 02 IAM과 Cognito의 구분 ──────────────────────────────────────────
  {
    slug: "sq-cognito-vs-iam-app-users",
    section: "02",
    q: "앱 고객 10만 명에게 IAM 사용자를 하나씩 만들어 주는 설계 — 성립하나?",
    a: "성립하지 않는다. IAM 사용자는 계정당 5,000명 한도이고, 애초에 IAM은 내가 신뢰하는 내부 주체용이다. 외부 앱 사용자는 Cognito 몫이다.",
    yn: "아니오",
  },
  {
    slug: "sq-cognito-keyword-signals",
    section: "02",
    q: "지문에 “mobile”, “hundreds of users”, “앱 로그인”이 보인다 — 어느 서비스를 가리키는 신호인가?",
    a: "Cognito다 — 수백~수백만 명 규모의 앱 사용자를 다루는 쪽이다. 반대로 “AWS 콘솔/CLI 접근”·“개발자에게 AWS 리소스 권한 부여”는 IAM(또는 IAM Identity Center) 쪽 신호이고, 둘은 같은 문제의 정답·오답으로 짝지어 나온다 (사내 직원이어도 앱 로그인이 목적이면 앱 인증 도구의 몫이다).",
  },

  // ── 03 User Pool = 인증 ──────────────────────────────────────────────
  {
    slug: "sq-cup-federation-belongs-to-cup",
    section: "03",
    q: "구글 계정으로 로그인시키려면 Identity Pool이 반드시 있어야 하나?",
    a: "아니다 — 연합 로그인은 User Pool 자체 기능이다. 로그인만 시키면 User Pool 하나로 끝이고, 그 사용자가 AWS 리소스를 직접 만져야 할 때 비로소 Identity Pool이 필요하다.",
    yn: "아니오",
  },
  {
    slug: "sq-cup-is-user-database",
    section: "03",
    q: "User Pool을 “서버리스 ○○○ + 로그인 기능”으로 한 줄 정의하면 빈칸은?",
    a: "사용자 데이터베이스다 — 사용자 저장, 비밀번호 재설정, 이메일·전화 확인, MFA가 내장돼 있다.",
  },
  {
    slug: "sq-cup-app-client-token-lifetime",
    section: "03",
    q: "ID·Access·Refresh 토큰의 수명은 User Pool 전체에 한 번 정하나, 앱 클라이언트마다 정하나?",
    a: "앱 클라이언트마다 정한다. 허용 인증 흐름과 Hosted UI용 Grant·scope·콜백 URL도 앱 클라이언트 단위 설정이다.",
  },
  {
    slug: "sq-cup-public-client-no-secret",
    section: "03",
    q: "브라우저·모바일 앱용 앱 클라이언트에 client secret을 넣어 두는 구성 — 맞나?",
    a: "맞지 않다 — 사용자 기기의 코드는 누구나 열어 볼 수 있어 secret을 숨길 수 없다. secret 없는 public client로 두고 Hosted UI 로그인은 PKCE로 보호한다. secret을 둔 confidential client는 secret을 안전하게 보관할 수 있는 서버용이다.",
    yn: "아니오",
  },

  // ── 04 CUP 로그인 흐름 ───────────────────────────────────────────────
  {
    slug: "sq-cup-flow-token-issuer",
    section: "04",
    q: "사용자가 구글 계정으로 로그인했다 — 앱이 최종적으로 손에 쥐는 토큰은 누가 발급한 것인가?",
    a: "User Pool이다. 연합 로그인이어도 앱이 받는 토큰은 언제나 User Pool이 발급하므로, 앱 코드는 로그인 경로를 몰라도 된다.",
  },
  {
    slug: "sq-cup-flow-mfa-timing",
    section: "04",
    q: "MFA는 토큰이 발급된 뒤에 일어나나?",
    a: "아니다 — 자격 증명 검증 단계(②)의 챌린지로 일어나고 완료되어야 토큰이 나온다 (이메일·전화 확인은 로그인 검증이 아니라 가입 직후 절차다).",
    yn: "아니오",
  },
  {
    slug: "sq-cup-srp-no-password",
    section: "04",
    q: "SRP 로그인(USER_SRP_AUTH)에서 앱은 비밀번호 원문을 User Pool에 보내나?",
    a: "보내지 않는다 — “비밀번호를 안다”는 증명값만 보내고 User Pool이 그 증명을 검증한다. 원문이 오지 않으므로 유출된 자격 증명 검사와 User Migration에는 쓸 수 없다.",
    yn: "아니오",
  },
  {
    slug: "sq-cup-admin-password-auth",
    section: "04",
    q: "USER_PASSWORD_AUTH와 ADMIN_USER_PASSWORD_AUTH는 둘 다 비밀번호를 그대로 보낸다 — 둘을 가르는 기준은?",
    a: "쓰는 API와 인가 방식이다. USER_PASSWORD_AUTH는 공개 API InitiateAuth라 IAM 자격 증명 없이 앱이든 백엔드든 부를 수 있고, ADMIN_USER_PASSWORD_AUTH는 관리자 API AdminInitiateAuth라 AWS 자격 증명(IAM)으로 서명·인가해야 해서 백엔드에서만 쓴다. “백엔드가 부르느냐”로는 가를 수 없다 — 백엔드도 InitiateAuth를 부를 수 있다.",
  },

  // ── 05 토큰 3종 ──────────────────────────────────────────────────────
  {
    slug: "sq-token-three-roles",
    section: "05",
    q: "ID·Access·Refresh 토큰의 용도를 각각 한 마디로?",
    a: "ID는 신원(사용자가 누구인지 담는 클레임), Access는 권한(OAuth 스코프로 API 호출을 인가), Refresh는 재발급(앞의 두 토큰을 다시 받는 용도)이다.",
  },
  {
    slug: "sq-token-default-lifetimes",
    section: "05",
    q: "ID·Access 토큰과 Refresh 토큰의 기본 수명은 각각 얼마인가?",
    a: "ID·Access는 60분(5분~1일로 조정), Refresh는 30일(60분~10년으로 조정)이다. 이 두 기본값이 그대로 선택지로 나온다.",
  },
  {
    slug: "sq-token-refresh-is-upper-bound",
    section: "05",
    q: "Refresh 토큰을 60분으로 줄이고 Access 토큰을 1일로 늘린 설정 — 유효한가?",
    a: "유효하지 않다. ID·Access의 유효기간은 Refresh의 유효기간을 넘을 수 없다 — 재발급 수단이 먼저 죽는 조합이기 때문이다.",
    yn: "아니오",
  },
  {
    slug: "sq-token-reduce-relogin",
    section: "05",
    q: "사용자를 자주 다시 로그인시키지 않으려면 어느 토큰의 유효기간을 늘려야 하나?",
    a: "Refresh 토큰이다. 재로그인 주기를 정하는 것은 Refresh이고, Access를 늘리는 것은 보안만 나빠질 뿐 재로그인 주기와 무관하다.",
  },

  // ── 06 JWT 구조 ──────────────────────────────────────────────────────
  {
    slug: "sq-jwt-three-parts",
    section: "06",
    q: "JWT의 세 조각과 각각이 담는 것은?",
    a: "Header(서명 알고리즘·키 ID), Payload(사용자 정보 = 클레임), Signature(위·변조 검증용 서명)다. 디코딩 문제가 묻는 것은 가운데 Payload다.",
  },
  {
    slug: "sq-jwt-payload-is-not-encrypted",
    section: "06",
    q: "Payload에 내부용 비밀 값을 넣어도 서명이 지켜 주니 안전한가?",
    a: "안전하지 않다 — Payload는 base64 디코딩만 하면 그대로 보인다. 서명이 막는 것은 내용이 새는 것이 아니라 내용이 바뀌는 것이다.",
    yn: "아니오",
  },
  {
    slug: "sq-jwt-sub-claim",
    section: "06",
    q: "Payload의 sub는 무엇이고, 왜 이메일 대신 이 값을 키로 쓰나?",
    a: "그 사용자의 불변 고유 UUID다. 이메일·전화번호·preferred_username 같은 속성은 바뀔 수 있지만 sub는 바뀌지 않아서 “이 데이터는 누구 것인가”의 키로 쓴다. username도 계정 생성 뒤 바꿀 수 없지만, 삭제된 사용자의 username은 새 사용자가 다시 쓸 수 있어서 식별의 정본은 sub다.",
  },
  {
    slug: "sq-jwt-jwks-kid",
    section: "06",
    q: "Lambda에서 User Pool 토큰의 서명을 직접 검증하려면 어떤 키를 어디서 골라 쓰나?",
    a: "User Pool의 JWKS(…/<userPoolId>/.well-known/jwks.json)에서 토큰 Header의 kid와 같은 공개 키를 골라 쓴다. 서명을 확인한 뒤 iss·token_use·exp도 확인한다.",
  },

  // ── 07 API Gateway 통합 ──────────────────────────────────────────────
  {
    slug: "sq-apigw-bearer-header",
    section: "07",
    q: "앱은 토큰을 요청의 어디에 실어 보내나?",
    a: "Authorization 헤더에 싣는다 — 값은 JWT 문자열이고, 흔히 Bearer 접두사를 붙인 형식으로도 쓴다. 쿼리 문자열이나 바디가 아니다.",
  },
  {
    slug: "sq-apigw-scope-needs-access-token",
    section: "07",
    q: "메서드·경로별로 OAuth 스코프를 검사해 가르려면 어느 토큰을 보내야 하나?",
    a: "Access 토큰이다. 스코프는 Access 토큰에만 있고, ID 토큰은 유효성만 확인된 뒤 내용이 백엔드로 전달된다.",
  },
  {
    slug: "sq-apigw-authorizer-by-api-type",
    section: "07",
    q: "REST API와 HTTP API에서 토큰 검증을 맡는 내장 권한 부여자의 이름은 각각?",
    a: "REST API는 Cognito 사용자 풀 권한 부여자, HTTP API는 JWT 권한 부여자다. 그룹·속성별 분기처럼 복잡한 판단은 Lambda 권한 부여자로 짠다.",
  },

  // ── 08 Hosted UI ─────────────────────────────────────────────────────
  {
    slug: "sq-hostedui-acm-us-east-1",
    section: "08",
    q: "앱이 서울 리전에 있다 — Hosted UI 커스텀 도메인용 ACM 인증서는 어느 리전에 만드나?",
    a: "us-east-1(버지니아 북부)이다. 다른 리전에 만든 인증서는 Cognito 설정 화면에 아예 목록으로 뜨지 않는다. 인증서가 Cognito가 만든 CloudFront 배포에 붙기 때문이라, CloudFront와 같은 규칙이다.",
  },
  {
    slug: "sq-hostedui-what-it-is",
    section: "08",
    q: "“로그인 화면을 개발하지 않고 붙이고 싶다”의 답은?",
    a: "Hosted UI다 — Cognito가 로그인·가입·비밀번호 재설정 페이지를 대신 호스팅하고, 앱은 그 주소로 리다이렉트만 한다.",
  },
  {
    slug: "sq-hostedui-implicit-no-refresh",
    section: "08",
    q: "Hosted UI에서 Implicit Grant로 로그인했다 — Refresh 토큰도 받나?",
    a: "받지 못한다 — Implicit Grant는 openid 요청 시 ID·Access 토큰만 콜백에 바로 붙여 준다. Refresh까지 받으려면 Authorization Code Grant로 code를 교환한다.",
    yn: "아니오",
  },
  {
    slug: "sq-hostedui-openid-id-token",
    section: "08",
    q: "Authorization Code Grant에서 openid 스코프를 빼고 요청해도 ID 토큰이 나오나?",
    a: "나오지 않는다 — ID 토큰은 openid 스코프를 요청했을 때만 발급된다. Implicit Grant도 마찬가지다.",
    yn: "아니오",
  },

  // ── 09 Lambda 트리거 ─────────────────────────────────────────────────
  {
    slug: "sq-trigger-pre-token-generation",
    section: "09",
    q: "발급되는 토큰에 커스텀 클레임을 넣으려면 어느 트리거인가?",
    a: "Pre Token Generation이다 — 토큰을 발급하기 직전에 클레임을 더하거나 고친다.",
  },
  {
    slug: "sq-trigger-user-migration",
    section: "09",
    q: "기존 서비스의 비밀번호 해시를 옮기지 않고 사용자를 Cognito로 점진 이관하려면?",
    a: "User Migration 트리거다 — USER_PASSWORD_AUTH 계열로 그 사용자가 처음 로그인할 때 입력한 비밀번호를 옛 DB에서 검증하고 User Pool에 만든다.",
  },
  {
    slug: "sq-trigger-pre-post-naming",
    section: "09",
    q: "트리거 이름의 Pre와 Post는 각각 무엇을 뜻하나?",
    a: "Pre는 그 일이 일어나기 전, Post는 끝난 뒤다 — 이름이 곧 실행 시점이라 시점↔트리거 매칭이 그대로 성립한다.",
  },
  {
    slug: "sq-trigger-custom-auth-three",
    section: "09",
    q: "CAPTCHA 같은 Custom Auth Flow를 구성하는 실제 Lambda 트리거 세 개는?",
    a: "Define Auth Challenge(다음 단계 결정) → Create Auth Challenge(질문 생성) → Verify Auth Challenge Response(답 검증)다. Custom Auth Flow 자체는 선택 가능한 단일 트리거 이름이 아니다.",
  },

  // ── 10 적응형 인증 ───────────────────────────────────────────────────
  {
    slug: "sq-adaptive-risk-levels",
    section: "10",
    q: "위험 수준별로 관리자가 고를 수 있는 대응 네 가지는 무엇이고, 감사 전용 모드는 무엇을 하나?",
    a: "허용 · 선택적 MFA · 필수 MFA · 차단이다. 감사 전용(audit-only)은 점수만 기록하고 아무것도 막지 않는다. 낮음은 허용, 중간은 MFA, 높음은 차단처럼 값이 높을수록 세게 잡는 게 흔한 설정이다.",
  },
  {
    slug: "sq-adaptive-signals",
    section: "10",
    q: "적응형 인증이 위험을 판단할 때 보는 신호를 두 가지만 든다면?",
    a: "새 디바이스, 평소와 다른 위치(IP), 비정상적인 로그인 패턴 중 둘. 유출된 자격 증명 차단도 여기 묶인다.",
  },

  // ── 11 Identity Pool = 인가 ──────────────────────────────────────────
  {
    slug: "sq-cip-no-user-database",
    section: "11",
    q: "Identity Pool도 사용자를 저장하나?",
    a: "저장하지 않는다 — 외부 IdP의 공급자 증명(토큰·assertion)을 받아 임시 AWS 자격 증명으로 교환할 뿐이다. 사용자 DB를 갖는 쪽은 User Pool이다.",
    yn: "아니오",
  },
  {
    slug: "sq-cip-guest-access",
    section: "11",
    q: "로그인하지 않은 게스트에게 제한된 AWS 접근을 주려면 어느 풀인가?",
    a: "Identity Pool이다 — 미인증(게스트) 접근은 Identity Pool만 지원하고, 게스트 전용 IAM 역할을 따로 지정한다.",
  },
  {
    slug: "sq-cip-trust-policy-principal",
    section: "11",
    q: "Cognito가 데려온 사용자가 IAM 역할을 맡을 수 있게 하려면, 역할의 신뢰 정책 Principal에 무엇을 적나?",
    a: "Principal.Federated에 cognito-identity.amazonaws.com을 적는다 — ch0-2 §04에서 본 Principal 필드의 쓰임 그대로이고, 실제 발급은 STS가 한다. 단 Condition에 어느 Identity Pool인지(aud)를 함께 적지 않으면 저장되지 않고, 인증 사용자용 역할과 게스트용 역할은 amr 조건(authenticated/unauthenticated)으로 가른다.",
  },
  {
    slug: "sq-cip-who-calls-s3",
    section: "11",
    q: "Identity Pool로 받은 자격 증명으로 S3를 부를 때, S3에 요청을 보내는 쪽은 앱인가 Identity Pool인가?",
    a: "앱이다 — Identity Pool에게서 돌려받은 임시 자격 증명으로 앱이 요청에 서명해 직접 호출한다. Identity Pool과 STS는 자격 증명을 만들어 줄 뿐 S3 요청을 중계하지 않는다.",
  },
  {
    slug: "sq-cip-assume-role-web-identity",
    section: "11",
    q: "enhanced 흐름에서 Identity Pool이 앱 대신 호출하는 STS API의 이름은?",
    a: "AssumeRoleWithWebIdentity다 — ch0-2 §07에서 웹/모바일 로그인 사용자용으로 배운 그 API다. basic(classic) 흐름을 켜면 앱이 이 API를 직접 부르지만, 모바일 앱에는 Cognito를 쓰는 것이 AWS 권장이다.",
  },
  {
    slug: "sq-cip-group-role",
    section: "11",
    q: "User Pool의 ‘편집자’ 그룹 사용자에게만 더 넓은 AWS 권한을 주려면 무엇을 설정하나?",
    a: "편집자 그룹에 IAM 역할을 붙이고, Identity Pool의 역할 선택을 ‘토큰에서 역할 선택(Choose role from token)’으로 둔다. ID 토큰에 실린 그룹의 역할로 역할이 골라진다 — 그 역할의 신뢰 정책도 Identity Pool을 믿어야 한다.",
  },

  // ── 12 정책 변수 ─────────────────────────────────────────────────────
  {
    slug: "sq-policyvar-condition-keys",
    section: "12",
    q: "사용자별 격리에 쓰는 조건 키는 S3와 DynamoDB에서 각각 무엇인가?",
    a: "S3는 s3:prefix, DynamoDB는 dynamodb:LeadingKeys(= 파티션 키)다. 두 키 이름이 그대로 선택지에 나온다.",
  },
  {
    slug: "sq-policyvar-one-policy-many-users",
    section: "12",
    q: "정책 문서 하나로 백만 명을 각자의 데이터에만 묶는 것이 어떻게 가능한가?",
    a: "정책 변수 ${cognito-identity.amazonaws.com:sub}가 실행 시점에 그 사용자의 고유 ID로 치환되기 때문이다 — 문서는 하나인데 해석이 사용자마다 달라진다.",
  },

  // ── 13 ALB 인증 오프로드 ─────────────────────────────────────────────
  {
    slug: "sq-alb-https-listener-only",
    section: "13",
    q: "HTTP 리스너에 authenticate-cognito 규칙을 걸었더니 설정되지 않는다 — 원인은?",
    a: "인증 규칙은 HTTPS 리스너에서만 설정할 수 있다. 자격 증명이 평문으로 오갈 수 없기 때문이다.",
  },
  {
    slug: "sq-alb-onunauthenticated-options",
    section: "13",
    q: "OnUnauthenticatedRequest의 세 값과 기본값, 그리고 deny의 응답 코드는?",
    a: "authenticate(기본값 — IdP 로그인으로 리다이렉트) · deny(거부, HTTP 401) · allow(그대로 통과)다.",
  },
  {
    slug: "sq-alb-offload-purpose",
    section: "13",
    q: "“애플리케이션 코드를 고치지 않고 사용자 인증을 추가하라”의 답은?",
    a: "ALB의 authenticate-cognito 또는 authenticate-oidc 액션이다 — ALB가 인증을 대신 수행해 백엔드에는 인증 코드가 없다.",
  },
  {
    slug: "sq-alb-private-egress",
    section: "13",
    q: "내부 ALB에 인증 설정을 모두 넣었는데 로그인 코드 교환이 실패한다 — 네트워크에서 확인할 것은?",
    a: "ALB가 IdP의 Token·User Info 엔드포인트로 IPv4 아웃바운드 통신할 수 있는지 확인한다. 보안 그룹·NACL이 허용해야 하고, 퍼블릭 IPv4 출구가 없으면 NAT Gateway 경로가 필요하다.",
  },

  // ── 14 조합과 총정리 ─────────────────────────────────────────────────
  {
    slug: "sq-combined-always-both",
    section: "14",
    q: "백엔드 API만 보호하면 되는 앱도 User Pool과 Identity Pool을 둘 다 써야 하나?",
    a: "아니다 — API Gateway 조합이면 User Pool 하나로 끝이다. 사용자가 S3 등 AWS 리소스를 직접 만져야 할 때 비로소 Identity Pool이 붙는다.",
    yn: "아니오",
  },
  {
    slug: "sq-combined-one-line",
    section: "14",
    q: "두 풀을 각각 한 줄 질문으로 표현하면?",
    a: "User Pool은 “너 누구야?”(인증), Identity Pool은 “뭘 할 수 있어?”(인가)다.",
  },
];
