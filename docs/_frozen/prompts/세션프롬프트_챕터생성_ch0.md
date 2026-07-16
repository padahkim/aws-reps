# 챕터 생성 프롬프트 v2 — 0단계 「기반 다지기」 (ch0-1 AWS 기초, ch0-2 IAM)

> **저장 위치**: `docs/prompts/챕터생성_ch0.md`
> **v2 변경점**: 출력 형식을 "마크다운/JSON"에서 **규약 v1 준수 jsx 챕터 모듈**로 교체. 실행 가드와 신규 파이프라인 통과 의무 추가. 개념 목록은 v1과 동일.
> **⚠️ 실행 가드**: 규약 v1 확정(BOARD 2-2) + RUBRIC 신규 모드 전환(BOARD 5-1) **이후에만 실행하라.** 생성물은 신규 모드 파이프라인(게이트→축2→축1)을 통과해야만 /content에 확정 진입한다.
> 새 세션, 플랜 모드로 아래 본문 투입.

---

## 프롬프트 본문 (아래부터 복사)

### 역할과 컨텍스트

너는 AWS Certified Developer – Associate(DVA-C02) 시험을 여러 번 분석한 전문 강사이자 기술 교육 콘텐츠 작성자다. 이 프로젝트는 DVA-C02 학습 웹앱이고, 지금 필요한 것은 **0단계 「기반 다지기」의 챕터 모듈 2개(ch0-1, ch0-2)** 다.

이 챕터의 역할은 두 가지다: ① 이후 챕터(S3, Lambda, DynamoDB, API Gateway, 보안, 배포, 트러블슈팅)를 배울 때 반복 설명 없이 이해할 수 있는 공통 기반을 까는 것 ② Security 도메인(26%)의 IAM 문제를 바로 풀 수 있는 수준까지 끌어올리는 것.

**대상 독자**: 프로그래밍 경험은 있지만 AWS 실무 경험이 얕은 개발자. 목표는 DVA-C02 합격.

**시작 전 정독**: `docs/CURRICULUM.md` §3(확정 규약 v1 — 출력 형식의 기준)과 §2의 0단계 범위, `docs/RUBRIC.md` §7-1 신규 모드 게이트와 §8 L1~L8(네 결과물이 통과해야 할 기준).

### 출력 형식 — 규약 v1 준수 jsx 챕터 모듈

- `/content`에 들어갈 **jsx 챕터 모듈 2개**: `ch0-1`(AWS 기초), `ch0-2`(IAM). 파일명·export 구조는 CURRICULUM §3의 확정 규약 v1을 그대로 따른다 (`meta`·`quiz` export + 본문 default export)
- 본문 표현은 규약 v1에 기록된 **낙점 표준 형식**을 따르고, 공용 컴포넌트가 지정되어 있으면 그것을 사용하라
- **모든 문항은 `quiz` export 배열에 구조화**한다(scenario / choices 4개 / answer / explanation). 본문 내 출제 위치에는 공용 `<Quiz>` 컴포넌트로 해당 문항 id를 배치한다. 섹션 미니 퀴즈는 `scope:"mini"`, 챕터 종합 퀴즈는 `scope:"final"`
- explanation은 반드시 "왜 정답인지 + 나머지 선택지 각각이 왜 오답인지(어떤 상황이면 정답이 됐을지)"를 모두 담는다 (RUBRIC L2 기준)

### 본문 구성 지침 (개념 블록마다)

각 개념 블록은 다음 흐름을 갖는다: **학습 목표(2~3개) → 핵심 개념 설명 → CLI/정책 JSON 예시(실행 결과 포함) → ⚠️ 시험 포인트(출제 각도·함정) → 미니 퀴즈 배치(2~3문항)**. 블록당 신규 개념 3~5개 이내(RUBRIC L4), 이후 챕터와의 연결 예고를 한 줄씩 넣어라(L6).

분량 가이드: ch0-1(파트 A)은 전체의 30%, ch0-2(파트 B, IAM)는 70%. IAM이 압도적으로 중요하다. **아래 「포함할 개념 목록」에 있는 것만 다뤄라** — DVA에 안 나오는 내용으로 분량을 늘리지 마라. 각 개념은 "시험에서 어떻게 물어보는지" 관점으로 설명한다.

---

## 파트 A (ch0-1): AWS 기초 — 포함할 개념 목록

### A-1. 글로벌 인프라
- 리전(Region): 선택 기준 4가지(규정 준수, 지연 시간, 서비스 가용성, 요금)
- 가용 영역(AZ): 리전당 여러 개, 물리적으로 격리, 고가용성의 기본 단위
- 엣지 로케이션: CloudFront/Global Accelerator가 사용, 리전보다 훨씬 많음
- **글로벌 서비스 vs 리전 서비스 구분** — IAM, Route 53, CloudFront는 글로벌 / EC2, Lambda, DynamoDB, S3(버킷은 리전 소속) 등 대부분은 리전 서비스. "IAM 사용자를 다른 리전에서 만들어야 한다"는 식의 함정 선택지가 나온다

### A-2. AWS에 접근하는 3가지 방법
- Management Console / CLI / SDK — 셋 다 결국 같은 REST API를 호출한다는 점을 강조
- 모든 API 호출은 **SigV4(Signature Version 4)** 로 서명된다: 서명은 HTTP 헤더 또는 쿼리 스트링(→ 나중에 S3 presigned URL의 원리)에 담긴다. 서명 계산 과정 암기는 불필요, "SigV4로 서명한다"는 사실과 어디에 담기는지만

### A-3. AWS CLI 필수
- `aws configure`와 두 파일: `~/.aws/credentials`(자격 증명), `~/.aws/config`(리전, 출력 형식)
- Named profile: `--profile` 옵션, `AWS_PROFILE` 환경 변수
- **자격 증명 우선순위(credential precedence)** — 시험 단골. 순서를 정확히: ① CLI 명령줄 옵션 ② 환경 변수(`AWS_ACCESS_KEY_ID` 등) ③ CLI 자격 증명 파일 ④ CLI 구성 파일 ⑤ 컨테이너 자격 증명(ECS) ⑥ 인스턴스 프로파일(EC2 메타데이터)
  - 함정 시나리오: "EC2에 인스턴스 프로파일을 붙였는데 환경 변수에 다른 키가 있다 → 환경 변수가 이긴다"
- `--dry-run` 옵션: 실제 실행 없이 권한만 검증 (EC2 계열에서 사용)
- 페이지네이션: `--max-items`, `--starting-token`, `NextToken`의 의미
- MFA와 CLI 사용: `aws sts get-session-token --serial-number ... --token-code ...`

### A-4. AWS SDK 필수
- 기본 자격 증명 공급자 체인: 환경 변수 → 시스템/자바 프로퍼티 → 자격 증명 파일 → 컨테이너 자격 증명 → 인스턴스 프로파일 순 자동 탐색. "코드에 키를 하드코딩하지 않아도 되는 이유"로 설명
- 리전 미지정 시 기본값은 `us-east-1`
- **Exponential Backoff(지수 백오프)**: ThrottlingException·5xx 시 재시도 간격을 2배씩 + Jitter. SDK 기본 내장 → "SDK를 쓰면 직접 구현 불필요, 직접 API 호출이면 직접 구현" 출제 포인트
- 재시도 대상 구분: 5xx·throttling → 재시도 O / 4xx(클라이언트 오류) → 재시도 무의미
- Rate limit 초과 대응: 지수 백오프 → 그래도 안 되면 Service Quotas 상향 요청

### A-5. ARN 구조
- `arn:partition:service:region:account-id:resource` 형식 분해, 리소스 부분의 3가지 변형
- IAM 정책 `Resource` 필드에서 와일드카드와 함께 쓰이는 예시 2~3개 (S3 버킷/객체, DynamoDB 테이블, Lambda 함수)
- 글로벌 서비스(IAM 등)는 ARN에서 region이 빈칸

### 파트 A에서 다루지 말 것
요금 모델 상세, Well-Architected Framework, Organizations/Control Tower, VPC 네트워킹(Lambda VPC 연결은 Lambda 챕터에서), 온프레미스 하이브리드.

---

## 파트 B (ch0-2): IAM — 포함할 개념 목록 (이 단계의 핵심)

### B-1. IAM 구성 요소
- 루트 사용자: 일상 사용 금지, MFA 필수, 루트만 가능한 작업 예시
- IAM 사용자(장기 자격 증명, 액세스 키 최대 2개) / 그룹(**그룹 중첩 불가, 그룹은 역할을 assume 불가** — 둘 다 함정) / 역할(임시 자격 증명)
- IAM은 글로벌 서비스 — 리전 선택 없음

### B-2. IAM 정책 JSON 완전 해부 — 정책 지문 해석 문제가 다수
- 최상위: `Version`("2012-10-17" — 날짜로 바꾸는 함정 있음), `Statement`
- Statement 내부: `Sid`, `Effect`, `Action`/`NotAction`, `Resource`/`NotResource`, `Condition`, `Principal`(리소스 기반 정책에만)
- 와일드카드: 버킷 ARN과 객체 ARN(`/*`)의 차이로 인한 AccessDenied 시나리오 반드시 포함
- 정책 변수: `${aws:username}` — "각 사용자에게 자기 폴더만 허용" 패턴(S3 홈 디렉터리 문제)
- 완성된 정책 예시 최소 3개: ① S3 특정 버킷 읽기 전용 ② DynamoDB 특정 테이블 CRUD ③ Condition 포함 정책

### B-3. 정책 유형 구분
- 자격 증명 기반 vs **리소스 기반**(S3 버킷 정책, SQS 큐 정책, SNS 토픽 정책, Lambda 리소스 정책 등) — "왜 Principal이 필요한지"로 구분법 설명
- AWS 관리형 vs 고객 관리형 vs 인라인(1:1, 재사용 불가)
- 권한 경계(Permissions boundary): "최대 권한의 울타리" 개념 + 경계 밖 권한은 정책에 있어도 무효
- 동일 계정 vs 교차 계정에서 리소스 기반 정책 평가 차이

### B-4. 정책 평가 로직 — 최중요
- 암묵적 거부 → 명시적 Allow → **명시적 Deny는 무엇으로도 못 이긴다**
- 여러 정책은 합집합 평가. "관리형에 Allow, 인라인에 Deny면?" → Deny 승리
- 권한 경계·SCP는 교집합으로 좁힌다는 개념(SCP 상세는 범위 밖)

### B-5. IAM 역할과 STS — DVA 전체를 관통
- 역할의 2요소: **신뢰 정책(누가 assume 가능한가, Principal 포함)** + **권한 정책(무엇을 할 수 있나)** — 혼동 문제 출제
- `sts:AssumeRole` 흐름: 호출 → 임시 자격 증명 3요소(AccessKeyId, SecretAccessKey, **SessionToken**) → API 호출
- 유효 기간: 기본 1시간, 15분~12시간, 역할 체이닝 시 최대 1시간
- STS API 4종 한 줄씩: `AssumeRole` / `AssumeRoleWithWebIdentity`(OIDC — 단 모바일·웹 앱은 Cognito 권장이라는 비교가 출제, 상세는 3단계) / `AssumeRoleWithSAML` / `GetSessionToken`(MFA)
- `sts:ExternalId`: 혼동된 대리인(confused deputy) 문제와 서드파티 크로스 계정 해법
- `aws sts decode-authorization-message`: 인코딩된 권한 오류 해독(트러블슈팅 출제)

### B-6. AWS 서비스에 역할 부여 패턴 — 이후 모든 챕터의 전제
- 대원칙: **"코드·설정에 액세스 키를 절대 넣지 않는다 → 역할을 쓴다"** — 정답 고르기의 제1원칙임을 명시
- EC2 → 인스턴스 프로파일: 메타데이터 서비스(`169.254.169.254`), IMDSv2 권장
- Lambda → 실행 역할 / ECS → 태스크 역할 vs 태스크 실행 역할이 다르다는 것 (상세는 각 챕터 예고)
- CodeBuild 등도 전부 서비스 역할로 동작한다는 큰 그림

### B-7. 자주 출제되는 Condition 키 (각각 정책 예시 한 줄과 함께)
`aws:SourceIp` / `aws:SecureTransport`(S3 HTTPS 강제 단골) / `aws:MultiFactorAuthPresent` / `aws:PrincipalOrgID` / `s3:x-amz-server-side-encryption`(KMS 챕터 예고)

### B-8. IAM 보안 도구와 모범 사례
- 최소 권한 원칙 — 선택지에 `"Action": "*"`가 보이면 오답인 이유
- 액세스 키 로테이션 절차(새 키 생성 → 교체 → 비활성화 → 삭제)
- Credentials Report(계정 전체) vs Access Advisor(사용자별) 구분 / IAM Policy Simulator
- AccessDenied 트러블슈팅 체크리스트: Allow 확인 → 명시적 Deny → 리소스 ARN 오타(버킷 vs 객체) → 권한 경계/SCP → 리소스 기반 정책

### 파트 B에서 다루지 말 것
IAM Identity Center 상세, Organizations/SCP 작성법, Directory Service, Cognito 상세(3단계), KMS 상세(3단계), SigV4 서명 알고리즘 세부.

---

## 퀴즈 요구사항

- 섹션 미니 퀴즈(scope:"mini")와 별도로, ch0-1 끝에 5문항·ch0-2 끝에 10문항의 **종합 퀴즈(scope:"final")** 를 작성. final 10문항 중 2개는 복수 선택
- DVA 실전 스타일: 2~4문장 시나리오 + 선택지 4개, "가장 안전한 방법은?", "운영 오버헤드가 가장 적은", "코드 수정 없이" 같은 실전 키워드 사용
- 오답은 매력적으로: 다른 상황이면 정답이 될 법한 선택지("액세스 키를 환경 변수에 저장한다" 등)
- 정책 JSON을 지문으로 주고 해석시키는 문항 최소 3개 포함 (ch0-2)

## 작성 톤과 진행 방식

- 한국어, AWS 용어는 영문 병기. 시험 무관한 역사·배경 이야기 금지
- 먼저 두 챕터의 개념 블록 목차와 meta·quiz 구조 계획을 제시하고 내 승인을 받은 뒤, ch0-1 → ch0-2 전반(B-1~B-4) → ch0-2 후반(B-5~B-8) → 종합 퀴즈 순으로 나눠 작성하라
- 각 모듈 완성 후 **RUBRIC 신규 모드 기준(게이트 G1~G4, L1~L8)으로 자가 점검**하고 미달 항목을 고쳐서 제출하라. 최종 확정은 신규 파이프라인(축2→축1) 통과 후다
