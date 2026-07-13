# CURRICULUM.md — DVA 학습 웹앱 도면 (스펙 v3.2)

> **지위**: 리포 기준 문서. 실행하는 프롬프트가 아니라 앱·콘텐츠·평가 세션이 **참조하는 도면**이다. 수정 권한은 인간에게만 있다.
> **관련 문서**: `docs/RUBRIC.md`(평가 기준·프로토콜 — 형식 무관 설계라 v3에서도 무수정), `PLAYBOOK.md`(작업 순서·현재 위치 관제)
> **v3 변경점**: 콘텐츠 형식 결정 반영 — **jsx 하이브리드 (인간 확정, 2026-07-13)**. "JSON 데이터 스키마"를 "챕터 모듈 규약(component contract)"으로, "변환"을 "표준화"로 재정의.
> **v3.1 변경점**: 기술 스택 확정 — **Next.js (App Router) + TypeScript** [인간, 2026-07-13]. §1·§3·§4에 Next.js 함의 반영.
> **v3.2 변경점**: **모의고사 모드 완전 제거 [인간, 2026-07-13]** — 후순위가 아니라 기능 자체를 삭제. 하이브리드 결정의 근거는 퀴즈 채점·오답 노트·진도로 유지되며, 규약의 `scope:"final"`은 챕터 종합 퀴즈용으로 존속.

---

## 1. 프로젝트 개요와 설계 원칙

**무엇을 만드는가**: AWS Certified Developer – Associate(DVA-C02) 시험 대비 학습 웹앱.
- 기술 스택 **[인간 확정, 2026-07-13]**: **Next.js (App Router) + TypeScript**
- 배포 대상: [Vercel 권장 / 자체 호스팅 — 앱 트랙 착수 시 확정]

### 확정된 콘텐츠 아키텍처 — jsx 하이브리드

**결정 기록 [인간, 2026-07-13]**: 콘텐츠의 영구 형식은 **jsx 챕터 모듈**이다. 단, 하이브리드로 간다 — **본문(설명·예시·인터랙티브 표현)은 jsx 자유 표현, 챕터 메타데이터와 퀴즈 문항은 구조화된 export**로 내보낸다.
- 채택 근거: 이미 만들어진 jsx 콘텐츠의 표현력·형식 다양성을 유지하면서, 챕터를 가로지르는 기능(퀴즈 채점·오답 노트·도메인별 진도)에 필요한 기계 가독 문항 데이터를 확보하는 유일한 구성
- 보류된 대안: "순수 자유형(전부 jsx)"은 오답 노트·진도 등 문항을 기계가 읽어야 하는 기능이 구현 불가능해져 보류. "순수 데이터(JSON)"는 jsx 표현력을 포기해야 해 보류
- 이 결정을 뒤집으려면 인간이 이 절을 직접 수정한다

**분리 원칙의 재정의**: "앱 코드와 콘텐츠의 분리"는 유지되지만 경계가 바뀐다 — 콘텐츠는 `/content`의 챕터 jsx 모듈(각자 표현을 가짐), 앱은 그 모듈을 **규약(§3)에 따라 로드하는 셸**(네비게이션, 진도, 공용 Quiz 컴포넌트)이다. 앱은 챕터 본문의 내부 표현을 알 필요가 없고, 규약의 export만 소비한다.

### AS-IS — 현재 상태 (과도기, 오류 아님)
`/content`의 jsx들은 **규약 없이 자유 생성된 상태**다(형식도 제각각). 다음 경로로 확정 아키텍처에 도달한다:

```
[진행 중] 평가 (RUBRIC 레거시 모드 — 형식 무관이므로 jsx 그대로 평가)
          + 형식 태깅: 파일별 표현 형식을 리포트에 기록, 형식별 점수 분포 산출
   → [인간] 우수 형식 낙점 + 규약 v1 확정 (증거: 형식별 점수 분포 + SCHEMA_FEEDBACK 2종)
   → 표준화: 생존 jsx에 meta·quiz export 부여, 퀴즈를 공용 컴포넌트 데이터로 이전,
             본문을 낙점 형식 기준으로 정돈 (내용 수정 금지, 원본은 legacy 보존)
   → 앱 셸이 규약대로 모듈을 로드
```

**금지**: 규약 v1 확정 전에 v0 규약을 기준으로 앱의 로더·퀴즈 엔진을 구현하는 것. v1 확정 시 재작업이 된다 — **규약이 전체 일정의 병목이다** (PLAYBOOK §2).

## 2. 커리큘럼 구조 (챕터 트리 — 학습 순서 = 제작 순서)

시험 도메인 비중: Domain 1 개발(32%) / Domain 2 보안(26%) / Domain 3 배포(24%) / Domain 4 트러블슈팅·최적화(18%)

### 0단계 · 기반 다지기 — 모든 챕터의 전제조건
- **Ch 0-1. AWS 기초**: 리전/AZ/엣지 로케이션, 글로벌 vs 리전 서비스, CLI(자격 증명 우선순위, 프로파일, 페이지네이션), SDK(기본 자격 증명 공급자 체인, 지수 백오프+Jitter), SigV4 서명, ARN 구조
- **Ch 0-2. IAM**: 사용자/그룹/역할, 정책 JSON 해부(Effect/Action/Resource/Condition/Principal), 정책 유형(자격 증명 기반 vs 리소스 기반, 관리형 vs 인라인, 권한 경계), 평가 로직(명시적 Deny 최우선), 역할과 STS(AssumeRole / AssumeRoleWithWebIdentity / AssumeRoleWithSAML / GetSessionToken), 서비스에 역할 부여 패턴(인스턴스 프로파일, 실행 역할), 주요 Condition 키, IAM 보안 도구

### 1단계 · 서버리스 핵심 — Domain 1(32%)의 심장
- **Ch 1-1. S3**: 버킷/객체 모델, 스토리지 클래스, 버전 관리, 버킷 정책, 암호화(SSE-S3/SSE-KMS/SSE-C), presigned URL, 정적 웹 호스팅 + CORS, 이벤트 알림, 멀티파트 업로드, Transfer Acceleration, 수명 주기 정책
- **Ch 1-2. Lambda**: 실행 모델과 수명 주기(콜드 스타트), 실행 역할, 호출 유형(동기/비동기/이벤트 소스 매핑), 동시성(예약/프로비저닝), 버전과 별칭(가중치 트래픽), 레이어, 환경 변수(+KMS 암호화), VPC 연결, 서비스 한도(타임아웃 15분, 패키지 크기), 오류 처리·재시도·DLQ·대상(Destinations)
- **Ch 1-3. DynamoDB**: 파티션 키/정렬 키 설계, RCU/WCU 계산, 온디맨드 vs 프로비저닝, GSI vs LSI, 강한/최종 일관성, Query vs Scan(+병렬 스캔), 페이지네이션, 조건부 쓰기와 낙관적 잠금, 트랜잭션, TTL, Streams(+Lambda 트리거), DAX, ProvisionedThroughputExceededException과 백오프
- **Ch 1-4. API Gateway**: REST API vs HTTP API, 통합 유형(Lambda 프록시/비프록시, HTTP, AWS 서비스, Mock), 매핑 템플릿, 스테이지/배포/스테이지 변수(+Lambda 별칭 연동), 인증 방식 비교(IAM / Cognito Authorizer / Lambda Authorizer / API 키), 캐싱, 스로틀링과 사용량 계획, CORS, WebSocket API 개요

### 2단계 · 이벤트 기반 통합 — Domain 1 나머지 (2024.12 업데이트로 비중 상승)
- **Ch 2-1. SQS**: 표준 vs FIFO(순서/중복 제거/그룹 ID), 가시성 타임아웃, 롱 폴링, DLQ와 redrive, 지연 큐, 메시지 크기 한도, Lambda 이벤트 소스 매핑(배치)
- **Ch 2-2. SNS**: 팬아웃 패턴(SNS→다중 SQS), 구독 필터 정책, 메시지 속성
- **Ch 2-3. EventBridge**: 이벤트 버스(기본/커스텀/파트너), 규칙과 이벤트 패턴, 스케줄, SNS/SQS와의 선택 기준
- **Ch 2-4. Kinesis**: Data Streams(샤드, 파티션 키, 핫 샤드, KCL/KPL, 리샤딩), Firehose, SQS vs SNS vs Kinesis 비교표
- **Ch 2-5. Step Functions**: 상태 유형(Task/Choice/Parallel/Map/Wait), Standard vs Express, 오류 처리(Retry/Catch), 콜백 토큰 패턴

### 3단계 · 보안 심화 — Domain 2(26%)
- **Ch 3-1. Cognito**: User Pool(인증, ID/Access/Refresh 토큰, 호스티드 UI, Lambda 트리거) vs Identity Pool(임시 AWS 자격 증명, 미인증 자격 증명), 두 풀의 조합 아키텍처, STS·IAM과의 관계
- **Ch 3-2. KMS**: 키 유형(대칭/비대칭, AWS 관리형/고객 관리형), 봉투 암호화와 GenerateDataKey, 4KB 직접 암호화 한도, 키 정책, 리전 간 처리, API 스로틀링 대응
- **Ch 3-3. 시크릿과 암호화 패턴**: Secrets Manager vs SSM Parameter Store 비교(자동 로테이션, 비용, 계층), ACM 인증서, 전송 중/저장 시 암호화 총정리, 클라이언트 측 암호화

### 4단계 · 배포 — Domain 3(24%)
- **Ch 4-0. 컴퓨팅 기초(짧게)**: EC2/ELB/ASG 최소 개념 — 배포 대상 이해용. 심화 금지
- **Ch 4-1. 컨테이너**: ECR(인증, 푸시/풀 권한), ECS(태스크 정의, 태스크 역할 vs 태스크 실행 역할, Fargate vs EC2 시작 유형, ALB 연동), Copilot/App Runner 개요
- **Ch 4-2. Elastic Beanstalk**: 배포 정책 비교(All at once / Rolling / Rolling with additional batch / Immutable / Traffic splitting) + Blue-Green(CNAME 스왑), .ebextensions, 환경 구성
- **Ch 4-3. CloudFormation**: 템플릿 구조(Parameters/Mappings/Conditions/Resources/Outputs), 내장 함수(Ref, GetAtt, Sub, ImportValue, FindInMap 등), 스택/중첩 스택/변경 세트/드리프트, DeletionPolicy, 크로스 스택 참조
- **Ch 4-4. SAM(+CDK 개요)**: Transform, 핵심 리소스(AWS::Serverless::Function/Api/SimpleTable), sam build/package/deploy, sam local, SAM+CodeDeploy 카나리/선형 배포, CDK와의 비교
- **Ch 4-5. CI/CD**: CodePipeline(스테이지, 아티팩트, 수동 승인), CodeBuild(buildspec.yml 구조, 환경 변수, 로컬 빌드), CodeDeploy(appspec 구조, 배포 구성, 수명 주기 훅, EC2/Lambda/ECS별 차이), CodeArtifact, CodeGuru 개요

### 5단계 · 트러블슈팅·최적화 — Domain 4(18%)
- **Ch 5-1. CloudWatch**: 지표(기본 vs 사용자 지정, 고해상도, 디멘션), 로그(통합 에이전트, Logs Insights, 메트릭 필터, 구독 필터), 알람(+복합 알람), EMF(임베디드 메트릭 형식)
- **Ch 5-2. X-Ray**: 세그먼트/서브세그먼트, 어노테이션 vs 메타데이터(검색 가능 여부), 샘플링 규칙, X-Ray 데몬, Lambda/ECS/Beanstalk별 계측 방법
- **Ch 5-3. CloudTrail**: 관리 이벤트 vs 데이터 이벤트, CloudWatch vs CloudTrail vs Config 구분(단골 문제)
- **Ch 5-4. 캐싱과 최적화**: ElastiCache(Redis vs Memcached, Lazy loading vs Write-through, 세션 스토어 패턴), CloudFront 개발자 관점 요점, RDS/Aurora 최소 개념(읽기 전용 복제본, RDS Proxy)

## 3. 챕터 모듈 규약 (component contract) — 현재 v0 (가설)

각 챕터는 `/content`의 jsx 모듈이며 다음을 내보낸다:

```jsx
// /content/ch1-2-lambda.jsx — 규약 v0 (가설)

// ① 메타데이터 — 앱의 네비게이션·진도·커버리지가 소비
export const meta = {
  id: "ch1-2", phase: 1, title: "Lambda",
  domain: "Domain 1 · Development", examWeight: "32%",
  prerequisites: ["ch0-1", "ch0-2"],
};

// ② 퀴즈 — 구조화 문항. 공용 <Quiz>가 렌더하고, 오답 노트·진도가 소비
export const quiz = [
  { id: "q1", scope: "mini",  concept: "동시성",
    scenario: "...", choices: ["...","...","...","..."],
    answer: [2], explanation: "정답 근거 + 오답별 이유" },
  { id: "q9", scope: "final", concept: "IAM 연계", scenario: "...", /* ... */ },
];

// ③ 본문 — 표현 자유 (레이아웃·인터랙션은 챕터가 결정)
//    단, 문항 출제는 quiz 데이터를 공용 컴포넌트로 배치: <Quiz ids={["q1"]} />
export default function Chapter() { /* ... */ }
```

**지위**: v0는 **가설**이다. 레거시 평가의 산출물 — 형식별 점수 분포(표현 형식 태깅)와 `SCHEMA_FEEDBACK_AXIS2/AXIS1`(규약·형식 낙점의 입력으로 해석한다) — 을 인간이 검토해 **우수 형식 낙점과 함께 v1을 확정**한다. 레거시 모드에서 v0 규약은 판정 기준이 아니다(RUBRIC §3의 순환참조 방지 논리 그대로). **v1 확정 시 인간이 이 절을 교체하고 기록한다:**
- 규약 v1 확정일: (미확정) / 확정된 표준 형식 팔레트(형식 1~3개 + 챕터 성격별 적용 기준): (미확정) / v0 대비 변경 요약: (미확정)
- **v1은 종착역이 아니다**: 신규 모드에서 규약이 수용하지 못하는 정당한 교육적 필요가 발견되면 RUBRIC §7-1의 개정 경로를 통해 `docs/CONTRACT_CHANGE_REQUESTS.md`에 축적되고, 인간이 주기적으로 v-next 반영을 결정한다 — 챕터마다 최적 교수법이 다를 수 있다는 전제를 규약 버전 루프로 수용한다

Question 필드 구조(scenario/choices/answer/explanation)는 구 스키마의 Question을 계승한다 — 축1의 L2(해설 완전성)·L7(난이도 분포)이 이 구조를 그대로 평가한다.

**Next.js 관련 주의 2가지**: ① 규약의 `meta` export는 Next.js 라우트 파일(page/layout)의 예약 `metadata` 규약과 무관하다 — 챕터 모듈은 `/content`에 있고 라우트 파일이 아니므로 충돌 없음. 다만 혼동 방지를 위해 이름을 `chapterMeta`로 바꿀지는 규약 v1에서 결정한다. ② 인터랙티브 본문(퀴즈·아코디언 등)은 클라이언트 컴포넌트여야 하므로, `"use client"` 선언 위치(각 챕터 모듈 상단 vs 로더 래퍼 한 곳)도 규약 v1에서 확정한다.

## 4. 앱 기능 요구사항 (MVP) — 하이브리드 기준: 앱은 규약의 export만 소비하는 셸이다

1. **커리큘럼 트리 네비게이션**: 전 챕터의 `meta`를 수집해 단계(0~5) 그룹핑, 도메인·비중 배지, 선행 챕터 표시
2. **챕터 로더**: `app/chapters/[id]` 라우트에서 규약대로 챕터 모듈을 동적 import(`next/dynamic`)해 본문 컴포넌트를 렌더. 본문 내부 표현은 챕터의 자유 — 앱은 프레임(네비·진도 바)과 공용 컴포넌트만 제공
3. **공용 퀴즈 엔진 (`<Quiz>`)**: `quiz` 데이터 기반 단일/복수 선택, 즉시 채점과 해설, 결과를 오답 노트에 기록(틀린 문항 재출제)
4. **진도 추적**: `meta` + 퀴즈 결과로 섹션/챕터 완료·점수·도메인별 커버리지. 저장은 localStorage(클라이언트) 우선 [필요해지면 Route Handler + DB로 확장]

## 5. 로드맵 — 순서와 의존성 근거 (세부 체크박스는 PLAYBOOK이 관리)

**릴리즈 전략 [인간, 2026-07-13]**: 전 챕터 완성 후 일괄 공개가 아니라 **릴리즈 단위 순차 공개**로 간다. **릴리즈 1 = ch0-1, ch0-2, 1-1(S3), 1-2(Lambda)** (Lambda가 S3 트리거를 전제하므로 이 묶음이 최소 단위). 제작자 본인의 도그푸딩 — 직접 학습하며 앱을 쓰는 것 — 이 학습 루프 가설(오답 재출제·숙달 판정·형식 효과)의 최초 실증 데이터가 된다. 아래 3~5단계는 릴리즈 1 범위에 먼저 적용되고, 이후 릴리즈마다 생성→평가→공개 루프가 반복된다.

1. **평가** (진행 중): 축2 → 축1, jsx 그대로 형식 무관 평가 + **형식 태깅**(파일별 표현 형식 기록, 완료 보고에 형식별 점수 분포)
2. **형식 낙점 + 규약 v1 확정**: 규약 제안 세션이 평가 산출물을 종합한 `docs/CONTRACT_PROPOSAL.md`(형식 후보·피드백 처리표·v1 초안·결정 포인트)를 작성하고, [인간]이 결정 포인트를 선택해 확정 → §3 갱신
3. **표준화 (릴리즈 1 범위 우선)**: 생존 jsx에 `meta`·`quiz` export 부여, 문항을 공용 컴포넌트 데이터로 이전, 본문을 팔레트 형식 기준으로 정돈. **내용 수정 금지**(내용 수정은 평가 리포트의 수정 지시를 따르는 별도 커밋). 원본은 `legacy/content-jsx/` 또는 브랜치 보존. 결손 성분은 축1 리포트의 보충 생성 목록대로 별도 생성
4. **앱**: 핸드오프(PLAYBOOK §5 델타 반영) → 앱 코드 진단 → 셸 구현(로더 → 네비+진도 → 공용 Quiz) → 표준화된 /content 실데이터 검증
5. **신규 모드 전환** → 챕터 생성 프롬프트를 "규약 v1 준수 jsx 모듈 생성"으로 갱신 → 릴리즈 1 잔여분 생성(신규 파이프라인 통과 필수) → **릴리즈 1 공개 → 도그푸딩 피드백 → 다음 릴리즈 챕터 생성**의 반복. 게이트 탈락 사유가 '규약 협소'라면 RUBRIC §7-1의 개정 경로로 흐른다

## 6. 작업 규칙

- 규약(§3)과 이 문서의 수정 권한은 인간에게만 있다. 변경이 필요하면 제안하고 승인받아라
- 콘텐츠 평가·검증 기준은 `docs/RUBRIC.md`다(형식 무관 설계 — 하이브리드와 충돌 없음, 무수정). 신규 콘텐츠는 신규 모드 파이프라인을 통과한 후에만 /content에 들어갈 수 있다
- 단계·마일스톤마다 실행 가능한 상태로 커밋한다. 한 번에 전부 만들지 않는다
- 아키텍처 작업 착수 전 전체 계획을 제시하고 승인을 받은 뒤 구현한다
