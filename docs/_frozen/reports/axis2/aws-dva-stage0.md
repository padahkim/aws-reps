# 축2 리포트: aws-dva-stage0

모드: 레거시 / 성분 태그: 설명 O · 예시 O · 퀴즈 X · 해설 X / 매핑 챕터: 0-1 (+0-2 기초 일부 겹침) / **판정: 수정**

> 검증 방식 부기: 세션 MCP 클라이언트 단선으로 동일 AWS MCP 서버를 HTTP 직접 호출로 사용 (반환 URL 동일). 캐시: docs/VERIFIED_FACTS.md.

## 사실 검증표

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| "403 = 인가(정책) 실패, **401/서명 오류 = 자격증명 문제**" (03 EXAM POINT) | 동작(시험 포인트) | **수정 필요** | 서명 불일치는 **HTTP 403 SignatureDoesNotMatch**로 반환 — 401 아님. 403은 인가 실패(AccessDenied)와 서명/자격증명 문제 양쪽에서 발생하며 **에러 코드로 구분**해야 함 | https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv-troubleshooting.html |
| 리전당 AZ "보통 3개 이상" | 수치 | 확인됨 | 모든 리전은 **최소 3개**의 격리된 AZ | https://aws.amazon.com/s3/faqs/ (What is an AWS Region) |
| AZ 간 초고속 저지연 전용망 연결 | 동작 | 확인됨 | "low-latency, high-throughput, highly redundant networking" | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/disaster-recovery-resiliency.html |
| EBS는 같은 AZ의 EC2에만 연결 | 동작(시험 포인트) | 확인됨 | 동일 | https://docs.aws.amazon.com/help-panel/ebs/latest/ebs_console/AttachVolume.html |
| 글로벌(IAM·Route 53·CloudFront) vs 리전(S3·DynamoDB·Lambda) vs AZ(EC2·EBS·서브넷) 분류 | 동작 | 확인됨 (통념 수준 — 개별 서비스 문서 부합) | 동일 | (IAM 글로벌: reference_policies_evaluation-logic 문서 체계 등) |
| 명시적 Deny 최우선, 기본 암묵적 거부 | 동작(시험 포인트) | 확인됨 | "Deny statement trumps the Allow statement" | https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic_AccessPolicyLanguage_Interplay.html |
| 롤 = 임시 자격증명(STS 발급, 자동 만료·갱신), "코드에는 키 대신 롤" | 동작(시험 포인트) | 확인됨 | STS 5종 오퍼레이션이 임시 자격증명 반환 | https://aws.amazon.com/blogs/developer/using-credentials-from-aws-service-token-service 대신: https://aws.amazon.com/blogs/developer/using-credentials-from-aws-security-token-service/ |
| 임시 자격증명 = 키 쌍 + 세션 토큰 | 동작 | 확인됨 | GetSessionToken 등이 Credentials(AccessKeyId·SecretAccessKey·SessionToken) 반환 | 위 STS 블로그 |
| SDK 자격증명 탐색 순서: 코드 명시 → 환경변수 → 설정 파일 → IAM 롤 | 동작(시험 포인트) | 확인됨 | 체인: 환경변수 → ~/.aws/credentials → (웹 자격증명) → 롤. "코드 명시 최우선"은 SDK 공통 원칙. SDK별 세부 단계 차이 존재 — 시험 수준 서술로 적절 | https://docs.aws.amazon.com/sdk-for-cpp/latest/api/aws-cpp-sdk-core/html/md_docs_2_credentials___providers.html |
| 모든 요청은 SigV4로 서명 | 동작 | 확인됨 | 동일 | reference_sigv-troubleshooting.html |
| 스팟 최대 90% 할인 (중단 가능 워크로드용) | 수치 | 확인됨 | "up to a 90% discount compared to On-Demand prices" | https://docs.aws.amazon.com/whitepapers/latest/run-semiconductor-workflows-on-aws/cost-optimization.html |
| 종량제 3축(컴퓨팅·스토리지·아웃바운드), 인바운드 대부분 무료 | 권장/통념 | 일반 통념 표기 | 방향 부합 — 요금 세부는 서비스별 상이 | (요금 문서 다수 — 개별 검증 생략) |
| Lambda 과금 = 요청 수 × 실행 시간, 안 쓰면 0원 | 동작 | 확인됨 (통념 수준) | GB-초 + 요청 수 과금 | (Lambda pricing — F2 ③권장 수준) |
| 공동 책임 모델 서술 | 동작 | 확인됨 (통념 수준) | 방향 부합 | — |

## Task 커버리지 (담당: 0-1 — Task 1.1 SDK·CLI / 2.1 프로그래매틱 액세스 기반)

- **커버**: SDK 기본 자격증명 체인 / SigV4 / 리전·AZ·엣지 / 글로벌 vs 리전 서비스 / 관리형 vs 직접 운영 판단 감각
- **누락** (보충 생성 목록 후보): **지수 백오프+Jitter** (0-1 명시 항목, Task 1.1.5 복원력과 직결) / **CLI 프로파일** / **CLI 페이지네이션** (--page-size vs --max-items — dynamodb-guide가 일부 커버하나 0-1 소속)
- **표면 커버**: ARN 구조 — 정책 예시 속에 등장만 하고 구조(파티션·서비스·리전·계정·리소스) 해설 없음

## 범위 이탈 (축1 L5 참조용)

- 02 섹션(IAM 기초)이 0-2 챕터와 겹침 — 단 0단계 "공통 문법" 취지의 의도된 예고편 수준. 이탈률 경미(~25%가 IAM). 0-2 본 챕터 존재(aws-dva-iam-guide-2, iam_guide) 감안 시 중복 조정은 축1/변환 단계 판단 사항.

## 출제 각도 부정합

- 없음. 각 섹션 EXAM POINT 박스가 "정답 패턴"(롤 우선, 최소 권한, 관리형 우선)을 직접 제시 — Task 동사와 정합.

## 폐기 문항 (레거시 F4)

- 해당 없음 (퀴즈 구조 없음 — 말미 체크리스트는 자기평가 문장).

## 수정 지시 (실행 가능하게)

1. **03 섹션 EXAM POINT 4번째 불릿 수정**: "403 에러 = 인증은 됐지만 인가(정책) 실패, 401/서명 오류 = 자격증명 문제" → "**403 AccessDenied** = 인가(정책) 실패, **403 SignatureDoesNotMatch** = 서명/자격증명 문제 — 상태 코드가 아니라 **에러 코드**로 구분하라". 근거: reference_sigv-troubleshooting.html
2. (보충 생성 목록) 0-1 누락 3건 추가 필요: 지수 백오프+Jitter, CLI 프로파일, CLI 페이지네이션 / ARN 구조를 표면→본문 해설로 승격

## 스키마 피드백 요약

자기평가 체크리스트(+빈출도 별점) 유형 → docs/SCHEMA_FEEDBACK_AXIS2.md에 제안 기록.
