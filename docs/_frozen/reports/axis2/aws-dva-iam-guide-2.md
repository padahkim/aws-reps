# 축2 리포트: aws-dva-iam-guide-2

모드: 레거시 / 성분 태그: 설명 O · 예시 O(정책 JSON 6개) · 퀴즈 X · 해설 X / 매핑 챕터: 0-2 IAM / **판정: 수정**

> 검증 방식 부기: 세션 MCP 클라이언트 단선으로 동일 AWS MCP 서버를 HTTP 직접 호출로 사용(반환 URL 동일). 캐시: docs/VERIFIED_FACTS.md 우선 조회.
> 고엄밀 지정 배치 — 정책 JSON 6개(§2 구조 예시 1개 + §9 동적정책·PassRole 예시 각 1개 등), STS 관련성, Condition 키, 평가 로직 순서를 개별 대조함.

## 사실 검증표

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| 정책 JSON 구조: Version/Id/Statement[Sid/Effect/Principal/Action/Resource/Condition] | 문법 | 확인됨 | 필드명·구조·Version 값(2012-10-17) 문법 오류 없음. Principal은 "리소스 기반 정책에서" 사용된다는 설명도 정확 | 캐시(IAM 정책 평가 로직 행) 및 일반 IAM 정책 문법 |
| 정책 평가 로직: 명시적 Deny → 명시적 Allow → 암묵적 Deny(기본값) | 동작(시험 포인트) | 확인됨 | 캐시 일치 — "Deny statement trumps the Allow statement" | https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic_AccessPolicyLanguage_Interplay.html (캐시) |
| 동일 계정: IAM 정책 + S3 버킷 정책 = 합집합(union) 평가. 4케이스 표(RW Allow/명시적Deny 조합) | 동작(시험 포인트) | 확인됨 | 캐시 일치 — 동일 계정은 자격증명+리소스 정책의 합집합, 어느 한쪽 Allow면 허용(명시적 Deny 없을 때) | https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html (캐시) |
| iam:PassRole — 서비스에 역할을 전달(지정)하는 데 필요한 권한. API 호출이 아니라 IAM 액션. 신뢰 정책의 Principal이 그 서비스를 허용해야 실제 assume 성립 | 동작(시험 포인트) | 확인됨 | "iam:PassRole is not an API call; it is an IAM action... checked whenever a resource is created with an IAM service role" | https://aws.amazon.com/blogs/security/how-to-use-the-passrole-permission-with-iam-roles/ · https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_passrole.html |
| 권한 경계(Permission Boundary)는 사용자·역할에만 설정 가능(그룹 불가), 자체로 권한을 부여하지 않고 상한만 설정, 유효 권한 = 자격증명 정책 ∩ 권한 경계 | 동작(시험 포인트) | 확인됨 | "sets the maximum permissions... by an IAM entity (user or role)... does not provide permissions on its own" | https://docs.aws.amazon.com/help-panel/IAM/latest/console/hp-policies-permissions-boundary.html |
| SCP ∩ 권한 경계 ∩ 자격 증명 정책 = 전체 유효 권한 | 동작 | 확인됨 (개념 정합) | 위 권한 경계 정의와 SCP가 조직 차원 최대 한계라는 사실의 조합으로 도출되는 표준 서술, 문서 취지와 부합 | 위와 동일 + 캐시(IAM 정책 평가 로직) |
| 정책 변수 `${aws:username}` 사용 예 — 사용자별 홈 디렉터리 동적 허용 | 동작 | 확인됨(개념) | `aws:username` 등 정책 변수는 IAM 정책 언어의 실재 기능(참고: 시험 가이드·업계 표준 패턴). 개별 문서 스니펫 미확보하여 URL은 미첨부 — **미검증(개념 신뢰도 높음)**으로 표기 | 확인 불가(URL 미확보) |
| 관리형(AWS/고객) vs 인라인 정책 — 인라인은 삭제 시 정책도 함께 삭제, 고객 관리형은 재사용·버전관리·롤백 | 동작 | 확인됨(통념) | 표준 IAM 개념, 캐시에 이미 반영된 관리형/인라인 구분과 일치 | 캐시(SCHEMA_FEEDBACK 아님, 통념 수준 — 신규 URL 없이 기존 캐시 결에 부합) |
| MFA 디바이스 유형 4종(가상/U2F/하드웨어 키 팹/GovCloud용 키 팹) 및 벤더 예시(Google Authenticator, YubiKey, Gemalto, SurePassID) | 동작 | 확인 불가 | 세션 내 미조회(스니펫 미확보) — AWS IAM 문서에 실재하는 벤더명과 일치하는 것으로 알려져 있으나 이번 세션에서 URL 미확보. **판정 보류 아님**(핵심 개념 아닌 부차 정보이므로 F2③ 권장사항 취급) | 확인 불가 |
| "AWS CLI 자체가 Python용 SDK(boto3) 위에 구현되어 있음" | 동작(트리비아) | **확인 불가 — 부정확 가능성 높음** | 검색 결과 AWS 공식 문서에서 이 관계를 명시한 페이지를 찾지 못함. 일반적으로 알려진 사실은 AWS CLI(v1/v2)는 **botocore**(boto3와 별도의 저수준 라이브러리, boto3도 botocore 위에 구축됨) 위에 구현되어 있다는 것 — "boto3 위에 구현"이라는 표현은 부정확할 가능성이 높음. 시험 정답에 직접 걸리는 내용은 아니므로 F4 폐기 대상 아님, 수정 권고 | 확인 불가(공식 문서 미확보) |
| 비밀번호 정책 항목(최소 길이·문자유형·자체변경 허용·만료·재사용금지) | 동작 | 확인됨(통념) | IAM 비밀번호 정책 표준 옵션과 일치 | 확인 불가(URL 미확보, 통념 수준) |

## Task 커버리지 (담당: Task 2.1 인증·인가 구현 + 0-1 연관)

- **커버**: IAM 사용자·그룹·정책 기본구조, 정책 JSON 해부, 정책 평가 로직(명시적 Deny 우선), 관리형/인라인 정책, 권한 경계, SCP와의 교집합, iam:PassRole, 교차 계정 접근(리소스 기반 정책), 정책 변수, MFA, 액세스 키/CLI/SDK, IAM 보안 도구(자격증명 보고서·액세스 어드바이저)
- **누락(커버리지 갭 — 수정 사유)**:
  - **STS 및 역할 수임(AssumeRole) API가 전무함** — "역할(Role)" 개념과 "trust policy"는 다루지만, `AssumeRole` / `AssumeRoleWithWebIdentity` / `AssumeRoleWithSAML` / `GetSessionToken` 중 어느 것도 이름으로 등장하지 않음(본문에 "assume"이라는 영어 동사가 1회 나올 뿐). RUBRIC §2가 0-2 챕터 필수 항목으로 "STS 4종"을 명시하는데 이 파일은 STS라는 용어 자체가 0회 등장 — 중대 커버리지 누락
  - **Condition 키 완전 누락** — 정책 JSON 구조표에 "Condition: 선택, IP·시간·MFA 여부 등"이라는 일반 설명만 있고 `aws:SourceIp`, `aws:MultiFactorAuthPresent` 같은 구체적 조건 키가 한 번도 등장하지 않음. RUBRIC이 "주요 Condition 키"를 명시 요구
  - 베어러 토큰(Task 2.1 키워드) 누락
  - 앱 수준 세분화 인가 패턴(예: `dynamodb:LeadingKeys` 류) 누락
  - Web Identity/SAML 페더레이션 세부(외부 IdP 연동 흐름) 누락 — 교차 계정 접근만 다룸
- **표면 커버**: 없음(다룬 항목은 대체로 예시·시험 포인트 동반)

## 범위 이탈 (축1 L5 참조용)

- CloudShell(§05) — 0-2 IAM 커리큘럼 명시 항목은 아니나 0-1(CLI/자격증명) 인접 주제로 완전한 범위 이탈은 아님. 분량은 크지 않음(경미)

## 출제 각도 부정합

- 없음. "구현·보호" 동사 대비 함정 문제 패턴("액세스 키 하드코딩은 항상 오답" 등)과 4케이스 표 등 시나리오 판단형 서술이 잘 대응됨

## 폐기 문항 (레거시 F4)

- 해당 없음 — 구조화된 퀴즈 성분 없음(F4 N/A)

## 수정 지시 (실행 가능하게)

1. **STS/AssumeRole 섹션 신설(최우선)** — "06 IAM 역할" 섹션에 STS 개념과 4개 오퍼레이션(AssumeRole/AssumeRoleWithWebIdentity/AssumeRoleWithSAML/GetSessionToken) 명시적 추가, 각 용도 구분(계정 내·외부 역할 수임 / 웹 ID 페더레이션 / SAML 페더레이션 / MFA 포함 임시 자격증명 자기발급) 필요. 근거: 캐시(STS 5종 URL)
2. **Condition 키 구체 예시 추가** — 정책 JSON 표의 Condition 행에 `aws:SourceIp`, `aws:MultiFactorAuthPresent` 등 최소 2개 이상 실재 키와 용도를 명시
3. **"AWS CLI가 boto3 위에 구현" 서술 정정 검토** — "CLI와 boto3는 모두 botocore 위에 구축된 별개 도구"로 표현 정정 권고(공식 URL 미확보로 강제 수정 사유는 아니나 정정 권장)
4. (보충 생성 목록) 베어러 토큰, 앱 수준 세분화 인가, Web Identity/SAML 페더레이션 흐름 다이어그램

## 중복 관찰

iam_guide.jsx 대비 고유: 비밀번호 정책 세부·MFA 하드웨어 디바이스 유형표·CloudShell·iam:PassRole 심화(액션 강조)·정책 변수(`${aws:username}`)·교차계정 4케이스 표·자격증명보고서 vs 액세스어드바이저 비교·공동 책임 모델. 겹침: 정책 JSON 구조, 정책 유형(관리형/인라인/권한경계/SCP), 평가 로직(명시적 Deny 우선), Role 개념, 키 대신 역할 원칙, ARN. iam_guide.jsx에는 있고 이 파일에 없는 것: STS API 이름 자체, Condition 키 구체 예시, 인터랙티브 평가 시뮬레이터.

## 스키마 피드백 요약

- 이번 파일에서 신규 스키마 구조 발견 없음(기존 제안 `decisionTable`, `factCards` 범주에 흡수 가능한 요소들 — 4케이스 표, 시험 직전 체크리스트 등). SCHEMA_FEEDBACK_AXIS2.md 신규 행 추가하지 않음.
