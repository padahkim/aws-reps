# 축2 리포트: iam_guide

모드: 레거시 / 성분 태그: 설명 O · 예시 O(정책 JSON 1개 + 인터랙티브 평가 시뮬레이터) · 퀴즈 X · 해설 X / 매핑 챕터: 0-2 IAM / **판정: 수정**

> 검증 방식 부기: 세션 MCP 클라이언트 단선으로 동일 AWS MCP 서버를 HTTP 직접 호출로 사용(반환 URL 동일). 캐시: docs/VERIFIED_FACTS.md 우선 조회.
> 고엄밀 지정 배치 — 정책 JSON 예시 1개(§03), 인터랙티브 평가 엔진의 순서 로직, STS 오퍼레이션명, Condition 키 개별 대조.

## 사실 검증표

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| 정책 JSON 구조: Version/Statement[Sid/Effect/Action/Resource/Condition{IpAddress:{aws:SourceIp}}] | 문법 | 확인됨 | 필드명·구조·Version 값(2012-10-17) 문법 오류 없음. `IpAddress` 연산자와 `aws:SourceIp` 키 조합도 실재하는 표준 패턴 | 캐시(IAM 정책 평가 로직 행) |
| 인터랙티브 평가 시뮬레이터 순서: 명시적 Deny → SCP → Permission Boundary → 명시적 Allow → 암묵적 Deny | 동작(시험 포인트) | 확인됨 | RUBRIC이 요구하는 순서와 정확히 일치(Deny 최우선, SCP·PB가 Allow보다 먼저 게이트) | 캐시(IAM 정책 평가 로직) + https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic_AccessPolicyLanguage_Interplay.html |
| §05 텍스트 요약: "명시적 Deny > 명시적 Allow > 암묵적 Deny(기본값)" | 동작 | 확인됨(단순화로 인정) | 시뮬레이터의 5단계 로직을 3단계로 압축한 것으로, SCP·PB를 생략했으나 이는 "핵심 한 줄" 표기로 명시되어 있고 바로 위 인터랙티브 컴포넌트에서 전체 순서를 정확히 보여줌 — 오류 아님 | 위와 동일 |
| Condition 키 예시: `aws:SourceIp`, `aws:MultiFactorAuthPresent` | 동작(시험 포인트) | 확인됨(개념) | 둘 다 IAM 정책 언어에 실재하는 전역 조건 키이며 용도(IP 제한, MFA 여부)도 정확 — 개별 페이지 스니펫은 세션 내 미확보로 URL 미첨부 | 확인 불가(URL 미확보, 개념 신뢰도 높음) |
| 권한 경계(Permission Boundary)는 IAM 엔티티의 권한 상한선, 권한을 부여하지 않음 | 동작 | 확인됨 | "sets the maximum permissions... does not provide permissions on its own" | https://docs.aws.amazon.com/help-panel/IAM/latest/console/hp-policies-permissions-boundary.html |
| 유효 권한 = SCP ∩ Permission Boundary ∩ Identity Policy(교집합) | 동작 | 확인됨(개념) | 표준 IAM 유효 권한 모델과 부합 | 위와 동일 + 캐시 |
| STS 주요 API: AssumeRole(동일/타계정), AssumeRoleWithWebIdentity(웹 ID), AssumeRoleWithSAML(SAML). "반환값엔 항상 SessionToken 포함, 만료시간 있음" | 동작(시험 포인트) | **부분 확인 — 목록 불완전** | 3개는 각각 정확히 설명됨(확인됨). 단 STS는 5개 오퍼레이션(AssumeRole/AssumeRoleWithWebIdentity/AssumeRoleWithSAML/GetFederationToken/GetSessionToken)이 있고 RUBRIC은 최소 4종(GetSessionToken 포함)을 0-2 필수로 명시 — **GetSessionToken 누락은 목록 불완전(커버리지 문제)이지 개별 서술 오류 아님** | 캐시(STS 5종 URL: https://aws.amazon.com/blogs/developer/using-credentials-from-aws-security-token-service/) |
| ARN 형식 `arn:aws:service:region:account-id:resource`, S3는 region/account 비움 | 동작 | 확인됨(통념) | 표준 ARN 구조와 부합, S3 ARN이 region/account 세그먼트를 생략하는 것도 실무·문서상 사실 | 확인 불가(URL 미확보, 통념 수준이나 오류 없음) |
| SigV4/서명 오류 관련 언급 | - | 해당 없음 | 이 파일은 서명 오류·HTTP 코드를 다루지 않음(검증 대상 주장 없음) | - |
| Credential Report / Access Analyzer / IAM Policy Simulator 3종 소개 | 동작 | 확인됨(통념) | 세 도구 모두 실재 AWS IAM 기능이며 설명도 표준적(계정 전체 자격증명 감사 / 외부 공유 탐지 / 정책 사전 테스트) | 확인 불가(URL 미확보, 통념 수준) |
| 그룹은 그룹을 포함할 수 없음(중첩 그룹 불가) | 동작 | 확인됨(통념) | IAM 표준 제약과 일치 | 확인 불가(URL 미확보, 통념 수준) |

## Task 커버리지 (담당: Task 2.1 인증·인가 구현 + 0-1 연관)

- **커버**: IAM 개요·구성요소(User/Group/Role/Policy), 인증 vs 인가 구분, 정책 JSON 해부, 정책 유형(Identity/Resource-based/Permission Boundary/SCP/Session Policy), 정책 평가 로직(인터랙티브, 순서 정확), Role & STS 개념, Trust Policy/Permission Policy 구분, Condition 키 실사례 2개, 자격 증명 3종(콘솔·프로그래밍·임시), 보안 모범사례, IAM 점검 도구
- **누락(커버리지 갭 — 수정 사유)**:
  - **STS 4종 중 GetSessionToken 누락** — RUBRIC이 0-2 필수로 명시. AssumeRole 계열 3개만 나열되어 "MFA 보유 사용자의 자기 임시자격증명 발급"이라는 별도 유스케이스가 빠짐
  - 베어러 토큰(Task 2.1 키워드) 누락
  - 앱 수준 세분화 인가 패턴(예: 파티션 키 기반 사용자별 접근 제어) 누락 — Session Policy·정책 변수 등 관련 개념은 없음
  - MSA 교차 서비스 인증(마이크로서비스 간 인증) 관점은 다루지 않음(교차 "계정" AssumeRole만 다룸, 서비스 간 인증 패턴은 별도)
- **표면 커버**: 없음(다룬 항목은 다이어그램·인터랙티브 예시·시험 함정 노트 동반)

## 범위 이탈 (축1 L5 참조용)

- 없음. 전 섹션이 0-2 IAM 범위 내(§08 "DVA 시험 핵심"도 챕터 요약 성격)

## 출제 각도 부정합

- 없음. "구현·보호" 동사 대비 정책 평가 시뮬레이터(직접 조작), 시험 함정 노트("관리자 정책이 붙어도 막히는 이유"), 오해 콜아웃 등 판단형 학습 장치가 풍부

## 폐기 문항 (레거시 F4)

- 해당 없음 — 구조화된 퀴즈 성분 없음(F4 N/A)

## 수정 지시 (실행 가능하게)

1. **§06 "STS 주요 API" 콜아웃에 GetSessionToken 추가** — "GetSessionToken(IAM 사용자 본인이 MFA를 포함해 임시 자격증명을 직접 발급받을 때 사용, 역할 수임이 아님)" 한 문장 추가. 근거: 캐시(STS 5종 URL)
2. (보충 생성 목록) 베어러 토큰 개념, 앱 수준 세분화 인가 패턴(1~2문장 + 조건 키 예시 확장), MSA 교차 서비스 인증

## 중복 관찰

aws-dva-iam-guide-2.jsx 대비 고유: STS/AssumeRole 계열 API 3종 이름과 시퀀스 다이어그램, Condition 키 구체 예시(aws:SourceIp/aws:MultiFactorAuthPresent), 정책 평가 로직 인터랙티브 토글 시뮬레이터(Deny→SCP→PB→Allow 5단계 전부 표현). 겹침: 정책 JSON 구조, 정책 유형(Identity/Resource/Boundary/SCP), Role 개념, ARN 형식, 최소 권한 원칙, 자격 증명 보안 도구. 이 파일에는 없고 상대 파일에만 있는 것: iam:PassRole 심화, 비밀번호 정책 세부, MFA 하드웨어 디바이스 유형, 정책 변수(${aws:username}), 교차계정 4케이스 표.

## 스키마 피드백 요약

- 이번 파일에서 신규 스키마 구조 발견 없음. 인터랙티브 평가 시뮬레이터(토글로 조건 변경 → 실시간 판정)는 기존 제안 `interactiveSlider`(aws-lambda-dva-guide-2.jsx 근거)와 유사하나 연속값이 아닌 boolean 토글 조합이라 별도 유형 — 새 필드 제안 대신 향후 인간 검토 시 참고용으로만 언급(신규 행 추가하지 않음, 근거 사례 1건뿐이라 재현성 판단 보류).
