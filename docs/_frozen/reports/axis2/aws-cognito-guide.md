# 축2 리포트: aws-cognito-guide

모드: 레거시 / 성분 태그: 설명 O · 예시 O(단계별 인터랙티브 SVG 플로우) · 퀴즈 X · 해설 X / 매핑 챕터: 3-1 Cognito / **판정: 수정**

> 고엄밀 배치. AWS MCP를 스크래치패드 mcp.sh로 직접 호출해 검증.

## 사실 검증표

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| User Pool 토큰 3종(ID·Access·Refresh)을 이름만 언급, 각각의 **용도·수명 구분 서술 없음** (전 섹션에서 "JWT(ID·Access·Refresh)"로만 뭉뚱그림) | 커버리지(F1) | **누락** — 담당 Task 2.1의 핵심 키워드("User Pool 토큰 3종 vs Identity Pool")를 정의만 하고 실제 구분(용도·수명)을 다루지 않음 | ID 토큰=사용자 신원 클레임(로그인 세션 유지), Access 토큰=리소스/API 접근 권한(스코프 포함), Refresh 토큰=재로그인 없이 ID·Access 재발급. 수명: Access/ID 기본 60분(5분~1일 설정 가능, refresh 토큰 유효기간을 초과 불가), Refresh 기본 30일(60분~10년 설정 가능) | https://docs.aws.amazon.com/help-panel/cognito/latest/console/hp-token-expiration.html · https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-the-refresh-token.html · https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cognito.UserPoolClientOptions.html |
| ALB `OnUnauthenticatedRequest` 3옵션: authenticate(기본, IdP 리다이렉트) / deny(HTTP 401 반환) / allow(그대로 통과) | 동작(시험 포인트) | 확인됨 | 동일 (deny=401, authenticate가 기본값) | https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_elasticloadbalancingv2.CfnListenerRule.AuthenticateCognitoConfigProperty.html |
| ALB 인증 규칙은 **HTTPS 리스너에서만** 설정 가능 | 동작(시험 포인트) | 확인됨 | "authenticate-cognito and authenticate-oidc action types are supported only with HTTPS listeners" | https://aws.amazon.com/blogs/networking-and-content-delivery/security-best-practices-when-using-alb-authentication/ |
| Hosted UI 커스텀 도메인의 ACM 인증서는 반드시 **us-east-1(버지니아 북부)** | 수치/위치(시험 포인트) | 확인됨 | "Certificates must be created in the US-EAST-1 Region, otherwise they will not be visible for Amazon Cognito" | https://aws.amazon.com/blogs/opensource/building-a-multi-tenant-kubeflow-environment-on-amazon-eks-using-amazon-cognito-and-adfs/ |
| Identity Pool: 로그인 소스(CUP·소셜·SAML·OIDC·개발자 인증), 미인증(게스트) 접근, IAM 역할 기반 STS 임시 자격 증명 교환 | 동작 | 확인됨(일반 통념 — Cognito Identity Pool 공식 아키텍처와 부합, 이번 패스에서 문서 스니펫 직접 재조회는 생략. 시험 정답 영향 크므로 다음 배치에서 원문 URL 확보 권고) | — | — |
| Policy Variables: `${cognito-identity.amazonaws.com:sub}`로 S3 `s3:prefix`/DynamoDB `dynamodb:LeadingKeys` 파티셔닝 | 동작(시험 포인트) | 확인됨(일반 통념 — DynamoDB LeadingKeys는 VERIFIED_FACTS에 기 등재된 인접 사실과 일치) | dynamodb:LeadingKeys로 파티션 키=사용자 ID 항목만 허용 가능 (기 등재) | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/specifying-conditions.html (VERIFIED_FACTS 기존 등재) |
| Lambda 트리거 8종(Pre Sign-up, Post Confirmation, Pre/Post Authentication, Pre Token Generation, User Migration, Custom Message, Custom Auth Flow) | 동작 | 확인됨(일반 통념 — 명칭·시점 서술이 Cognito Lambda 트리거 공식 목록과 부합. 이번 패스에서 전수 대조는 생략, 시급성 낮음) | — | — |
| 적응형 인증(Risk Score Low/Medium/High → MFA 요구/차단), CloudWatch Logs 연동 | 동작 | 확인됨(일반 통념 — Cognito Advanced Security Features 공식 동작과 부합) | — | — |
| Cognito = 외부 앱 사용자(수백만), IAM = 내부 신뢰 사용자 — 구분 원칙 | 개념 | 확인됨(정의 수준 — 별도 URL 검증 불필요한 서비스 포지셔닝 서술) | — | — |

## Task 커버리지 (담당: Task 2.1 — 인증·인가 구현)

- **커버**: 페더레이션(Cognito·SAML·OIDC·소셜), IAM 역할 수임(CIP→STS), 앱 수준 세분화 인가(Policy Variable), MSA 교차 서비스 인증(API Gateway/ALB 통합)
- **누락(핵심)**: **User Pool 토큰 3종의 개별 용도·수명 구분** — EXAM_TASK_MAP이 명시적으로 지목한 3-1 챕터 핵심 항목("User Pool 토큰 3종 vs Identity Pool")인데, 본문은 토큰을 항상 "ID·Access·Refresh" 3개를 한 묶음으로만 나열하고 각 토큰의 역할 차이(ID=신원 클레임, Access=API 권한, Refresh=재발급)나 수명 차이를 한 번도 개별 설명하지 않음. JWT 구조(Header/Payload/Signature) 섹션도 "sub UUID" 조회 예시뿐, 토큰 종류별 페이로드 차이는 없음
- **표면 커버**: 베어러 토큰 개념(2.1 Task 키워드) — API Gateway Cognito Authorizer가 "JWT 검증"으로만 언급되고, 베어러 토큰으로서 Authorization 헤더에 어떻게 실리는지 구체 서술 없음

## 범위 이탈 (축1 L5 참조용)

- 없음. 전 탭이 3-1 Cognito 범위 내(ALB 인증 오프로드도 Cognito 통합 맥락이라 범위 이탈 아님).

## 출제 각도 부정합

- 없음. Task 동사("구현·보호") 대비 "hundreds of users", "mobile", "authenticate with SAML" 등 키워드 매칭형 시험 팁과 CUP/CIP 역할 구분 반복 강조가 출제 각도와 정합.

## 폐기 문항 (레거시 F4)

- 해당 없음 (퀴즈 성분 없음 → F4 N/A).

## 수정 지시 (실행 가능하게)

1. **(최우선, 보충 생성) 토큰 3종 개별 블록 신설**: "② 사용자 풀 CUP" 또는 "④ JWT 토큰 구조" 섹션에 표 추가 — `| 토큰 | 용도 | 기본 수명 | 설정 가능 범위 |` 형식으로 ID(신원 클레임, API Gateway/ALB에 신원 증명), Access(리소스 접근 권한/스코프, API 호출 인가), Refresh(재로그인 없이 재발급) 구분. 수치: Access/ID 기본 60분(5분~1일), Refresh 기본 30일(60분~10년, refresh가 access/id 유효기간의 상한). 근거: hp-token-expiration.html, amazon-cognito-user-pools-using-the-refresh-token.html
2. **(경미) API Gateway 통합 서술 보강**: "Cognito Authorizer로 JWT 검증"에 "Access 토큰을 Authorization 헤더 베어러 토큰으로 전달"이라는 한 문장 추가해 Task 2.1 "베어러 토큰" 키워드 명시적 커버.
3. **(권고, 다음 패스 검증 필요)** Identity Pool 로그인 소스·게스트 접근·Lambda 트리거 8종 목록은 이번 패스에서 "일반 통념" 수준으로만 확인됨 — 다음 축2 반복 시 공식 문서 URL로 승격 검증 권장(현재 오류 의심 정황은 없음).

## 스키마 피드백 요약

- `StepPlayer` 인터랙티브 단계 재생 컴포넌트(버튼으로 플로우 단계 진행) → docs/SCHEMA_FEEDBACK_AXIS2.md에 제안 기록. 학습 설계(축1) 관점에서도 절차형 개념(로그인 흐름, 자격 증명 교환)의 단계 분해에 유용해 보임.
- CUP vs CIP 비교표(역할·산출물·게스트 등 7행) — 위 security-guide-1 리포트와 동일하게 "두 서비스 비교표" 스키마 필드 제안과 통합.
