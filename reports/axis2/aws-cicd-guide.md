# 축2 리포트: aws-cicd-guide

모드: 레거시 / 성분 태그: 설명 O · 예시 O · 퀴즈 X · 해설 X / 매핑 챕터: 4-5 CI/CD / **판정: 수정**

> 검증 방식: AWS MCP 서버(HTTP 직접 호출, `aws___search_documentation` / `aws___read_documentation`)로 서비스 단위 배치 검증. VERIFIED_FACTS.md에 4-5 CI/CD 관련 기존 캐시 없어 신규 검증.

## 사실 검증표

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| (`eol` 섹션) "2024년 7월 25일부로 CodeCommit은 신규 고객에게 더 이상 제공되지 않습니다" — 단종을 기정사실로 서술, "AWS 권장"이 외부 Git이라는 프레이밍 전체 | 동작(시험 관점 서술) | **수정 필요 (핵심)** | **2025-11-24부로 CodeCommit이 신규 고객에게 다시 전면 개방(GA 복귀)**. 2024-07 De-emphasis 발표는 2025-11-24 공식 철회됨 | https://aws.amazon.com/blogs/devops/aws-codecommit-returns-to-general-availability/ |
| `intro` 섹션 맵카드: "CodeCommit — 소스 저장소 (Git) · 단종 예정" | 동작 | **수정 필요** | 위와 동일 — "단종 예정" 문구 삭제 필요 | 위와 동일 |
| CodeCommit 접근: SSH Key / HTTPS(Credential Helper), 계정 비밀번호 로그인 불가, IAM Policy 인가, KMS 저장 시 암호화, HTTPS/SSH 전송 시 암호화, 교차 계정 IAM Role+STS | 동작 | 확인됨 (AWS 학습 지식 부합, 구조 자체는 CodeCommit GA 이후에도 변화 없음) | 동일 | 별도 URL 미확보 — 서비스 자체의 인증 메커니즘은 이번 배치의 우선 검증 대상이 아니어서 스니펫 미확보. **미검증(구조 표기)** |
| GitHub 연동: CodeConnections(구 CodeStar Connections)로 OAuth 연결, Webhook 자동 트리거 | 동작 | 확인됨 (통념 수준, URL 미확보) | 동일 | **미검증** — 이번 배치 시간 제약으로 스니펫 확보 못함 |
| CodePipeline: 아티팩트는 S3 저장·전달, 상태 변화 → EventBridge, 액션 실패 → IAM Service Role 확인 | 동작(시험 포인트) | 확인됨 | 구조 일치 | https://docs.aws.amazon.com/codepipeline/latest/userguide/security_iam_id-based-policy-examples.html (승인 관련) — 아티팩트/EventBridge 부분은 축2 이전 배치(RUBRIC 부기) 및 일반 지식으로 통념 처리 |
| CodeBuild: buildspec.yml은 소스 루트에 위치, phases install→pre_build→build→post_build 순, env는 plaintext/SSM Parameter Store/Secrets Manager, VPC 구성 가능, 로그는 CloudWatch/S3 | 수치+동작 | 확인됨 (경미한 단서 있음) | phases 순서 확인. **단, `buildspec.yml`은 프로젝트 설정 또는 `buildspecOverride`로 대체 경로/인라인/S3 지정 가능** — "반드시 루트"는 기본값 기준 설명으로는 맞으나 절대 규칙처럼 서술한 부분은 과단순화 | https://docs.aws.amazon.com/sdk-for-kotlin/api/latest/codebuild/aws.sdk.kotlin.services.codebuild.model/-start-build-request/-builder/buildspec-override.html |
| CodeDeploy: EC2/온프레미스는 Agent 필수, Lambda/ECS는 Agent 불필요, appspec.yml로 정의, In-place vs Blue/Green, EC2 배포 설정 OneAtATime/HalfAtATime/AllAtOnce/Custom, Lambda 트래픽 전환 Linear/Canary/AllAtOnce, **ECS는 Blue/Green만 지원** | 수치+동작(시험 포인트) | 확인됨 | 동일. ECS Blue/Green 전용 및 Lambda 트래픽 전환 3종 명칭 체계 일치 | https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations.html · https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_codedeploy.LambdaDeploymentConfig.html |
| appspec.yml 수명 주기 훅: ApplicationStop→BeforeInstall→(Install)→AfterInstall→ApplicationStart→ValidateService | 수치 | 확인됨 (부분) | 공식 순서는 ApplicationStop → **DownloadBundle** → BeforeInstall → Install → AfterInstall → ApplicationStart → ValidateService. **DownloadBundle 훅이 본문 다이어그램에서 누락** — DownloadBundle과 Install은 스크립트 불가(에이전트 전용)라는 점도 본문에 없음 | https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file-structure-hooks.html |
| CodeArtifact: 패키지 매니저 지원(Maven/Gradle/npm/yarn/pip/twine/NuGet), Upstream Repository + External Connection, EventBridge 연동, Resource Policy 교차 계정 | 동작 | 확인됨 | 업스트림 리포지토리 최대 10개까지 연결 가능(본문엔 개수 명시 없음 — 표면 정보만) | https://docs.aws.amazon.com/codeartifact/latest/ug/repos-upstream.html |
| CodeGuru: Reviewer(정적 분석, Java/Python, GitHub·Bitbucket·CodeCommit 연동) vs Profiler(런타임 성능, 프로덕션 저오버헤드) | 동작 | 확인됨 | 언어·연동 대상 정확히 일치 | https://docs.aws.amazon.com/codeguru/latest/reviewer-ug/welcome.html |
| CodeGuru Profiler 에이전트 설정: MaxStackDepth, MemoryUsageLimitPercent, MinimumTimeForReportingInMilliseconds, ReportingIntervalInMilliseconds, SamplingIntervalInMilliseconds | 수치 | 확인됨 (통념 수준, 이번 배치에서 URL 재확보 안 함 — 파라미터명 자체는 CodeGuru Profiler Java/Python 에이전트 공식 옵션과 일치하는 것으로 알려짐) | 동일 | **미검증(시간 제약)** — 우선순위 낮음(빈출도 "낮음") |

## Task 커버리지 (담당: Task 3.1·3.4, 보조 3.2·3.3·4.1)

- **커버**: CI/CD 개념(3.4 자동화), CodeCommit/GitHub 소스(3.1 리포지토리), CodePipeline 오케스트레이션·롤백 관점 일부(3.4), CodeBuild buildspec(3.1 패키징, 3.3 자동화), CodeDeploy 배포 전략·appspec(3.4 배포 전략), Lambda 별칭 트래픽 전환(3.4 스테이지 변수·라벨 버전 관리 근접)
- **누락**:
  - **3.4 "IaC 템플릿 갱신"과 CI/CD 파이프라인의 결합**(CFN/SAM과 CodePipeline·CodeDeploy 연동) — 이 파일은 CFN 배포를 CodePipeline Deploy 스테이지 후보로만 1줄 언급, 실제 IaC 갱신 흐름 다루지 않음
  - **3.3 "IaC 템플릿(SAM/CFN) 기반 다중 환경 배포"** — 갭
  - **롤백(Rollback) 메커니즘 상세** — CodeDeploy 자동 롤백(CloudWatch 알람 기반)만 한 줄, "라벨·브랜치 버전 관리" 키워드(3.4) 다루지 않음
  - **API Gateway 스테이지 변수 동적 배포**(3.4 키워드) — 이 챕터 범위에 없음(1-4 챕터 소관일 수 있으나 3.4 Task가 CI/CD 챕터에 배정되어 있어 교차 언급 필요)
- **표면 커버**: GitHub 연동 섹션은 CodeConnections·Webhook 개념만 소개, 실습/함정 없음(표면 수준이나 분량 자체가 짧아 감점 근거는 약함)

## 범위 이탈 (축1 L5 참조용)

- 없음. CodeGuru(에이전트 설정 포함)까지는 4-5 챕터 범위로 커리큘럼(RUBRIC §2) "CI/CD" 소관 서비스 목록에 포함되어 이탈 아님.

## 출제 각도 부정합

- 없음. Task 3.4 동사("배포·롤백·구성")에 맞춰 각 섹션 끝 "시험 포인트" 콜아웃이 시나리오 판단형 함정을 직접 제시.

## 폐기 문항 (레거시 F4)

- 해당 없음 (퀴즈 성분 없음 → F4 N/A).

## 수정 지시 (실행 가능하게)

1. **[최우선] `eol` 섹션 전면 재작성** — "CodeCommit 신규 제공 중단(2024-07-25)"이라는 제목·콜아웃·본문 전체가 현재 사실과 불일치. 2025-11-24부로 CodeCommit이 신규 고객에게 재개방(GA 복귀)됨. 다음 중 택1: (a) 섹션을 "CodeCommit De-emphasis와 재개(2024→2025)" 같은 히스토리 설명으로 재작성하고 현재는 신규 생성 가능함을 명시, (b) 섹션 자체를 삭제하고 `Commit` 섹션에 "2024년 한때 신규 중단 발표가 있었으나 2025-11-24 철회, 현재 신규 생성 가능"이라는 각주만 남김. 근거: aws.amazon.com/blogs/devops/aws-codecommit-returns-to-general-availability/
2. `intro` 섹션의 CodeCommit 맵카드 설명 "단종 예정" 문구 삭제 → "관리형 Git 저장소 (신규 생성 가능)"로 교체
3. `Deploy` 섹션 훅 다이어그램(`hooks` 배열)에 **DownloadBundle** 훅 추가 — 현재 ApplicationStop 다음 바로 BeforeInstall로 넘어가 공식 순서(ApplicationStop→DownloadBundle→BeforeInstall→Install→AfterInstall→ApplicationStart→ValidateService)와 다름. DownloadBundle·Install은 에이전트 전용(스크립트 불가)이라는 점도 콜아웃에 추가 권장
4. (경미) `Build` 섹션 "buildspec.yml은 소스 루트에 있어야 합니다" 뒤에 "(또는 빌드 시작 시 `buildspecOverride`로 대체 경로/인라인 지정 가능)" 단서 추가 — 절대 규칙처럼 읽히는 표현 완화
5. (보충 생성 목록) IaC 템플릿(SAM/CFN) 갱신과 CI/CD 파이프라인 결합, 롤백 상세, 브랜치/라벨 버전 관리 — Task 3.4 커버리지 보강 필요

## 중복 관찰

상대 파일(aws-dva-cicd.jsx) 대비: 이 파일은 **CodeArtifact·CodeGuru(+에이전트 파라미터)까지 포함하는 더 넓은 범위**를 다루고 시각적 파이프라인 네비게이션 구조가 특징. 반면 appspec 훅 순서에 DownloadBundle이 빠져 있고 ELB 관련 Block/AllowTraffic 훅을 아예 다루지 않는 점(aws-dva-cicd는 다룸)이 상대 대비 약점. CodeCommit 단종 서술은 **두 파일 모두 동일하게 틀렸음**(같은 구버전 지식 패턴).

## 스키마 피드백 요약

빈출빈도 배너(bar 5단), Freq 컴포넌트, 좌측 세로 네비게이션 + 진행률 헤더, Frame/FBox/Flow 다이어그램 조합 → `docs/SCHEMA_FEEDBACK_AXIS2.md`에 제안 기록.

