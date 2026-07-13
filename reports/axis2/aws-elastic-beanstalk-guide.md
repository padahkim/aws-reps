# 축2 리포트: aws-elastic-beanstalk-guide

모드: 레거시 / 성분 태그: 설명 O · 예시 O(코드/CLI/절차 다이어그램 + 인터랙티브 배포 시뮬레이터) · 퀴즈 X · 해설 X / 매핑 챕터: 4-2 Beanstalk / **판정: 수정**

> 검증 방식: AWS MCP 서버(mcp.sh HTTP 직접 호출)로 서비스 단위 배치 검증. VERIFIED_FACTS.md에 Beanstalk 기존 캐시 없어 전량 신규 검색.

## 사실 검증표

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| "배포 정책 6종"(전 섹션 탭명·FREQ 표·본문 제목에서 일관 사용, All at once/Rolling/Rolling+batch/Immutable/Traffic splitting/Blue-Green을 동렬로 카운트) | 동작(시험 포인트, RUBRIC 캘리브레이션 대조 항목) | **수정 필요** | AWS 공식 "deployment policies"는 **5종**(All at once·Rolling·Rolling with additional batch·Immutable·Traffic splitting)뿐이며, Blue/Green은 Beanstalk 내장 배포 정책이 아니라 **별도 환경 + Swap URLs로 구현하는 배포 전략**. RUBRIC §2도 "5종+블루그린"으로 명시. 콘텐츠 자체가 Blue/Green 카드 안에서는 "Elastic Beanstalk의 내장 기능이 아닌, 별도 환경을 활용한 배포 전략"이라고 정확히 서술하면서도, 상위 표기(탭·FREQ·섹션 소제목 "업데이트 배포 정책 6종")에서는 계속 6종으로 통칭해 내적 모순 발생 — 시험에서 "Beanstalk이 지원하는 배포 정책은 몇 가지인가"류 문항에 오답 유도 가능 | https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.rolling-version-deploy.html · https://aws.amazon.com/elasticbeanstalk/details/ |
| 애플리케이션 버전 수명 주기: "Elastic Beanstalk은 애플리케이션 버전을 최대 1,000개까지 저장"(암묵적으로 애플리케이션 1개 기준처럼 서술) | 수치 | **수정 필요(경미)** | 1,000개 쿼터는 **리전 내 계정의 모든 애플리케이션을 합산한 쿼터**다(단일 애플리케이션 전용 한도 아님). 여러 애플리케이션을 운영하면 앱마다 더 낮은 수명 주기 쿼터를 설정해야 리전 한도에 도달하지 않는다는 공식 가이드 존재 | https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/applications-lifecycle.html |
| 수명 주기 정책 안전장치: "현재 사용 중인 버전은 정책이 절대 삭제하지 않음" | 동작 | 확인됨 | 동일. 추가로 문서는 "정책 트리거 10주 이내에 종료된 환경에 배포됐던 버전"도 삭제하지 않는다고 명시(본문엔 이 예외 미포함 — 표면 정보) | https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/applications-lifecycle.html |
| .ebextensions 4가지 요구사항: 소스 루트의 `.ebextensions/` 디렉터리, YAML/JSON, `.config` 확장자, `option_settings`로 기본값 변경 | 동작(시험 포인트) | 확인됨 | 동일 | https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/ebextensions.html |
| Traffic Splitting: 임시 ASG에 동일 용량으로 v2 배포 → 소량 트래픽(예 10%)으로 카나리 테스트 → 실패 시 자동 롤백 | 동작(시험 포인트) | 확인됨 | 공식 설명과 동일한 메커니즘(카나리 테스트, 별도 임시 ASG 생성, 헬스 통과 시 트래픽 전량 전환·구인스턴스 종료) | https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.rolling-version-deploy.html |
| Immutable: 실패 시 "임시 ASG만 종료하면 즉시 롤백" | 동작(시험 포인트) | 확인됨 | 공식 문서: "immutable environment update가 실패하면 롤백 과정은 ASG 하나만 종료하면 된다"(rolling 방식은 추가 롤링 업데이트가 필요해 대조됨) | https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/environmentmgmt-updates-immutable.html |
| LB 유형 변경(ALB↔NLB)은 복제(Clone) 불가 — 새 환경 생성 + CNAME 스왑 필요 | 동작 | 확인됨(통념 — 로드 밸런서 "유형"은 환경 생성 후 변경 불가, 복제는 유형까지 복사하는 공식 동작과 일치. 이번 배치 시간 제약으로 별도 URL 스니펫 재확보 안 함) | 동일 | **미검증(구조 표기)** — 기존 배치(CDK 등)에서도 저위험 통념으로 처리한 선례 준용 |
| RDS 분리 절차 6단계(스냅샷 → 삭제 방지 → 새 환경 → CNAME 스왑 → 이전 환경 종료 → CFN 스택 수동 삭제) | 동작(시험 포인트) | 확인됨(통념 — VERIFIED_FACTS에 이미 CDK/CFN 배치에서 검증된 "DeletionPolicy·CFN 스택 잔존" 패턴과 정합) | 동일 | **미검증** — 이번 배치에서 재검색하지 않음(캐시성 통념, 시간 제약) |

## Task 커버리지 (담당: Task 3.4 CI/CD 코드 배포[배포 전략 블루/그린·카나리·롤링] · 보조 Task 4.2 관측성[헬스체크·레디니스 프로브])

- **커버**: EB 개요·구성요소(Application/Version/Environment), 웹 티어 vs 워커 티어(SQS+cron.yaml), 단일 인스턴스 vs HA 아키텍처, 배포 정책 6종(내용상 5+블루그린, 명칭 정정 필요 — 인터랙티브 시뮬레이터가 시그니처), EB CLI 명령어·배포 흐름(zip→S3→인스턴스 전개), 애플리케이션 버전 수명 주기 정책, .ebextensions·CFN 관계, 환경 복제·LB 마이그레이션·RDS 분리(운영 절차)
- **누락**:
  - **헬스 체크·Enhanced Health Reporting** — RUBRIC이 이 챕터에서 명시적으로 대조를 요구한 항목이자 EXAM_TASK_MAP의 Task 4.2("앱 헬스체크·레디니스 프로브")가 4-0·4-1과 함께 4-2에도 걸쳐 있는 주제인데, 이 파일은 `eb health` 명령어 이름만 표로 나열할 뿐 **기본(Basic) vs 향상된(Enhanced) 헬스 모니터링의 구분, 헬스 상태 5단계(Ok/Info/Warning/Degraded/Severe), 헬스 체크가 배포 정책(특히 Immutable·Traffic splitting의 "헬스 체크 통과" 판정 기준)과 어떻게 연결되는지**를 전혀 설명하지 않음 — 시뮬레이터 안에서 "헬스 체크 통과"라는 문구를 여러 차례 사용하면서도 정작 그 헬스 체크가 무엇인지 본문에 없는 구조적 공백
  - **플랫폼 브랜치·버전(Platform branches/versions)** — RUBRIC이 명시적으로 대조를 요구. 지원 플랫폼 13종을 칩으로 나열하고 "커스텀 플랫폼 작성 가능"이라고만 언급, 플랫폼 브랜치(예: Amazon Linux 2 vs Amazon Linux 2023)·플랫폼 버전 업그레이드·관리형 플랫폼 업데이트(Managed Platform Updates) 개념 전무
- **표면 커버**: 없음(다룬 항목은 예시·시나리오 동반)

## 범위 이탈 (축1 L5 참조용)

- 없음. 전 섹션이 4-2 Beanstalk 범위 내(EB CLI·.ebextensions·CFN 관계·마이그레이션 모두 EB 소관).

## 출제 각도 부정합

- 없음. "지문 속 표현 → 정답" 즉답표, "정답 고르는 공식"(다운타임 허용?→All at once 등 조건 분기) 등 Task 3.4 동사("배포·롤백·구성")에 정확히 맞춘 시나리오 판단형 구성.

## 폐기 문항 (레거시 F4)

- 해당 없음(퀴즈 성분 없음 → F4 N/A).

## 수정 지시 (실행 가능하게)

1. **"배포 정책 6종" 표기 정정(최우선)** — 헤더 탭명("업데이트 배포 정책 6종"), `FREQ` 표 항목("배포 정책 6종 — 요구조건 매칭"), `SecDeploy` 소제목을 "배포 정책 5종 + Blue/Green 전략"으로 수정. `COMPARE` 배열·시뮬레이터 `MODES` 배열 자체(6개 카드)는 학습상 유용하므로 유지하되, Blue/Green 카드에 "☆ 나머지 5종과 달리 EB 내장 배포 정책이 아님"이라는 구분 배지 추가 권고. 근거: using-features.rolling-version-deploy.html
2. **버전 1,000개 한도 문구 보정** — "Elastic Beanstalk은 애플리케이션 버전을 최대 1,000개까지 저장" → "**리전 내 계정 전체 애플리케이션을 합산해** 최대 1,000개(앱을 여러 개 운영하면 앱별 수명 주기 정책의 개수 기준을 그만큼 낮게 잡아야 함)"로 수정. 근거: applications-lifecycle.html
3. **(보충 생성 목록)** 헬스 체크 섹션 신규 필요 — Basic vs Enhanced Health Reporting, 헬스 상태 5단계, 배포 정책(특히 Immutable·Traffic splitting)의 헬스 체크 판정 기준과의 연결. `SecCli`(191) 또는 별도 탭으로 추가 검토.
4. **(보충 생성 목록)** 플랫폼 브랜치·버전·관리형 플랫폼 업데이트 개념 1개 문단 추가 — `SecOverview`의 "지원 플랫폼" 패널 하단에 짧게 보강 가능.

## 스키마 피드백 요약

- 배포 정책별 스텝별 인스턴스 상태(v1/v2/교체중/기동중/종료) + 용량 게이지 + 트래픽 분할 바를 스텝 재생(이전/다음/자동재생)으로 보여주는 `Simulator` 컴포넌트 — 기존 제안된 `interactiveDemo`/`interactive: {type, params}` 계열과 동일 범주지만, "동일 개념을 6개 변형(모드)으로 전환하며 각 변형마다 다단계 시퀀스를 재생"하는 조합은 이 배치가 처음이라 `docs/SCHEMA_FEEDBACK_AXIS2.md`에 별도 근거로 추가.
- "지문 속 이 표현이 보이면 → 이 정답" 카드형 키워드 매칭 그리드(`KEYWORDS`)는 기존 `decisionTable[]{scenario, choice, why?}` 제안과 동일 계열 — 신규 필드 제안 없이 근거 사례로만 추가.
