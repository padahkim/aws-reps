# 축2 리포트: aws-dva-cicd

모드: 레거시 / 성분 태그: 설명 O · 예시 O · 퀴즈 X · 해설 X / 매핑 챕터: 4-5 CI/CD / **판정: 수정**

> 검증 방식: AWS MCP 서버(HTTP 직접 호출)로 서비스 단위 배치 검증. aws-cicd-guide.jsx와 같은 배치에서 동일 서비스군을 검증해 캐시 재사용.

## 사실 검증표

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| `codecommit` 섹션 카드 "⚠ 중요: CodeCommit 서비스 종료(Discontinuation)" — "2024년 7월 25일부터 신규 고객은 CodeCommit을 사용할 수 없습니다", "실무/실습에서는 GitHub를 소스 공급자로 사용" 권고 | 동작(시험 관점 서술) | **수정 필요 (핵심)** | **2025-11-24부로 CodeCommit이 신규 고객에게 다시 전면 개방(GA 복귀)**. 2024-07 De-emphasis 발표는 공식 철회됨 | https://aws.amazon.com/blogs/devops/aws-codecommit-returns-to-general-availability/ |
| `summary` 섹션 "30초 요약 카드" 마지막 줄: "CodeCommit: 2024-07-25부터 신규 사용 불가 → GitHub 권장" | 동작 | **수정 필요** | 위와 동일 | 위와 동일 |
| CI vs Continuous Delivery vs Continuous Deployment 구분(수동 승인 유무) | 동작(시험 포인트) | 확인됨 (통념 수준, 업계 표준 정의와 일치) | 동일 | 표준 정의 — 별도 AWS 문서 URL 불필요한 일반 개념으로 판단, RUBRIC F2③ "권장사항/통념" 처리 |
| CodePipeline: Source(CodeCommit·ECR·S3·Bitbucket·GitHub) / Build(CodeBuild·Jenkins 등) / Test / Deploy(CodeDeploy·EB·CFN·ECS·S3) / Invoke(Lambda·Step Functions), 아티팩트 S3 경유, 상태 변화 EventBridge, 수동 승인 IAM 권한(`codepipeline:GetPipeline*` + `codepipeline:PutApprovalResult`) | 수치+동작(시험 포인트) | 확인됨 (부분) | `PutApprovalResult`는 공식 문서에서 승인/거부 액션에 필요한 핵심 권한으로 확인. `GetPipeline*`은 콘솔에서 파이프라인 상태를 보기 위한 보조 권한으로 통상 함께 부여되나, 이번 검색에서 "필수" 근거 스니펫은 확보하지 못함 — **부분 확인, GetPipeline* 부분은 미검증** | https://docs.aws.amazon.com/codepipeline/latest/userguide/security_iam_id-based-policy-examples.html |
| CodeBuild: buildspec.yml 소스 루트, phases install→pre_build→build→post_build, env(plaintext/parameter-store/secrets-manager), artifacts(S3, KMS 암호화), cache(S3), VPC 구성 시 프라이빗 리소스 접근, 로컬 빌드 = CodeBuild Agent | 수치+동작 | 확인됨 (경미한 단서) | phases 순서 정확. **buildspec.yml 위치는 기본값이 루트이나 `buildspecOverride`로 대체 가능** — "반드시 루트"라는 절대 표현은 과단순화 | https://docs.aws.amazon.com/sdk-for-kotlin/api/latest/codebuild/aws.sdk.kotlin.services.codebuild.model/-start-build-request/-builder/buildspec-override.html |
| CodeDeploy: 배포 대상 4종(EC2/온프레미스/Lambda/ECS), CloudWatch 알람 기반 자동 롤백, appspec.yml, EC2는 Agent 필수+S3 읽기 권한, In-place vs Blue/Green(ELB 필수), 배포 설정 AllAtOnce/HalfAtATime/OneAtATime/Custom | 수치+동작 | 확인됨 | 구조 일치 | https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations.html |
| appspec.yml 라이프사이클 훅 순서(EC2 In-place): ApplicationStop → DownloadBundle → BeforeInstall → Install → AfterInstall → ApplicationStart → ValidateService, ELB 사용 시 앞에 BeforeBlockTraffic→BlockTraffic→AfterBlockTraffic, 뒤에 BeforeAllowTraffic→AllowTraffic→AfterAllowTraffic 추가 | 수치(시험 포인트) | 확인됨 | **7단계 기본 순서 및 훅 이름 정확. DownloadBundle·Install은 스크립트 불가(에이전트 전용)라는 점도 정확히 반영**(별도 명시). ELB 훅의 정확한 삽입 위치(앞/뒤 구분)는 공식 다이어그램(이미지)이라 텍스트로 최종 확인은 못했으나 훅 가용성 표와 정합 | https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file-structure-hooks.html |
| CodeDeploy 롤백은 "새로운 배포"로 재배포(이전 버전 복원이 아님) | 동작(시험 포인트) | 확인됨 (통념 수준, 이번 배치 URL 미확보) | AWS CodeDeploy 공식 개념과 일치하는 것으로 알려짐 | **미검증(시간 제약)** |
| Lambda 플랫폼: Alias 트래픽 시프팅, Linear/Canary/AllAtOnce, PreTraffic/PostTraffic 훅 | 수치+동작 | 확인됨 | 배포 구성 명명 체계(LambdaLinear10PercentEvery3Minutes 등) 확인 | https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_codedeploy.LambdaDeploymentConfig.html |
| ECS 플랫폼: 새 태스크 정의 필요, **Blue/Green 배포만 지원**, 로드 밸런서 필수, 트래픽 전환 Linear/Canary/AllAtOnce(ECSLinear10PercentEvery3Minutes 등), CodeDeploy가 이미지를 빌드하지 않음 | 수치+동작(시험 포인트) | 확인됨 | ECS Blue/Green 전용 CodeDeploy 훅 구조(BeforeInstall/AfterInstall/AfterAllowTestTraffic/BeforeAllowTraffic/AfterAllowTraffic)까지 공식 문서에서 별도 확인 — 단 이 5개 ECS 전용 훅 이름은 본문에 없음(커버리지 갭) | https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file-structure-hooks.html |
| CodeArtifact: Domain(중복 제거·KMS 키 공유), Upstream Repository 최대 10개, EventBridge 통합, Resource Policy(교차 계정 전부/전무) | 수치+동작 | 확인됨 | 업스트림 최대 10개 정확 | https://docs.aws.amazon.com/codeartifact/latest/ug/repos-upstream.html |
| CodeGuru: Reviewer(정적 분석, Java/Python, GitHub·Bitbucket·CodeCommit 연동) vs Profiler(런타임, 프로덕션 저오버헤드), 에이전트 파라미터 5종 | 동작+수치 | 확인됨 (Reviewer 언어·연동 부분) | 정확 일치. Profiler 에이전트 파라미터명은 미검증(시간 제약, 빈출도 "낮음") | https://docs.aws.amazon.com/codeguru/latest/reviewer-ug/welcome.html |

## Task 커버리지 (담당: Task 3.1·3.4, 보조 3.2·3.3·4.1)

- **커버**: CI/Delivery/Deployment 구분(3.4 배포 개념), CodePipeline 오케스트레이션·아티팩트·EventBridge·서비스 롤(3.4), CodeBuild buildspec·비밀값·VPC·캐시(3.1 패키징, 3.3 테스트 자동화), CodeDeploy 전 플랫폼(EC2/온프레미스/Lambda/ECS)의 배포 전략·훅·롤백(3.4 배포 전략이 매우 상세), CodeArtifact 의존성 관리(3.1)
- **누락**:
  - **IaC 템플릿(SAM/CFN) 갱신과 CI/CD 결합**(3.1·3.4 키워드) — CodePipeline Deploy 스테이지에 CloudFormation을 후보로만 언급, 실제 스택 갱신 흐름 없음
  - **API Gateway 스테이지 변수 동적 배포**(3.4 키워드) — 범위 밖
  - **Amplify 브랜치·Copilot 환경**(EXAM_TASK_MAP §갭 3 — 커리큘럼 전무이므로 이 파일 책임은 아니나 3.3 Task 키워드로 명시되어 있어 언급 시도조차 없는 점은 표면 갭으로 기록)
  - **ECS 전용 CodeDeploy 훅 이름**(BeforeInstall/AfterInstall/AfterAllowTestTraffic/BeforeAllowTraffic/AfterAllowTraffic) — ECS Blue/Green이 EC2용 훅과 다른 훅 셋을 쓴다는 사실 자체가 본문에 없음. "appspec 훅"을 EC2 전용으로만 소개해 ECS 절에서 훅 언급 누락
- **표면 커버**: 없음 — 전 섹션이 예시(다이어그램·코드)와 시험 포인트 콜아웃 동반

## 범위 이탈 (축1 L5 참조용)

- 없음. 전 섹션이 4-5 챕터 범위 내(CodeGuru 포함, RUBRIC §2 소관).

## 출제 각도 부정합

- 없음. "3.4 배포·롤백·구성" 동사에 맞춰 배포 전략별 시나리오형 ExamTip이 구체적("10% 트래픽으로 5분 검증 후 전체 전환" 등)이라 정합 우수.

## 폐기 문항 (레거시 F4)

- 해당 없음 (퀴즈 성분 없음 → F4 N/A).

## 수정 지시 (실행 가능하게)

1. **[최우선] `codecommit` 섹션의 "⚠ 중요: CodeCommit 서비스 종료(Discontinuation)" 카드 전면 수정** — "2024년 7월 25일부터 신규 고객은 CodeCommit을 사용할 수 없습니다"는 현재 사실과 다름. 2025-11-24부로 CodeCommit이 신규 고객에게 재개방됨(GA 복귀). 카드 제목·본문을 "CodeCommit 히스토리 — De-emphasis(2024-07) → GA 복귀(2025-11)"로 교체하고 현재는 신규 리포지토리 생성이 가능함을 명시. 마지막 줄 "GitHub를 소스 공급자로 사용" 권고도 "AWS 관리형 저장소가 필요하면 CodeCommit도 다시 유효한 선택지"로 조정. 근거: aws.amazon.com/blogs/devops/aws-codecommit-returns-to-general-availability/
2. `summary` 섹션 "30초 요약 카드" 마지막 줄 "CodeCommit: 2024-07-25부터 신규 사용 불가 → GitHub 권장" → "CodeCommit: 2025-11 GA 복귀, 신규 생성 가능(2024-07 한때 중단 발표 있었음)"으로 수정
3. `ecs` 관련 Card("ECS 플랫폼")에 ECS 전용 CodeDeploy 훅 이름(BeforeInstall/AfterInstall/AfterAllowTestTraffic/BeforeAllowTraffic/AfterAllowTraffic) 추가 — EC2용 appspec 훅(ApplicationStop~ValidateService)과 다른 훅 셋임을 명시해 혼동 방지
4. (경미) `codebuild` Card "buildspec.yml 핵심" 항목에 "기본은 루트, `buildspecOverride`로 대체 경로 지정 가능" 단서 추가
5. (보충 생성 목록) IaC 템플릿 갱신과 CI/CD 결합 개념 블록 추가 필요

## 중복 관찰

상대 파일(aws-cicd-guide.jsx) 대비: 이 파일은 **appspec 훅에 DownloadBundle 포함 + ELB Block/AllowTraffic 훅까지 구체적으로 서술**하고, **CodePipeline 수동 승인의 구체 IAM 액션명**과 **롤백은 "새 배포" 라는 함정 포인트**를 명시하는 등 CodeDeploy 상세도가 더 높음. 반면 상대 파일에만 있는 CodeGuru 에이전트 파라미터 상세 표는 이 파일에도 동일하게 존재(중복). CodeCommit 단종 서술은 **두 파일 모두 동일하게 틀렸음**(같은 구버전 지식 패턴, RUBRIC이 사전 경고한 최우선 검증 대상 그대로 적중).

## 스키마 피드백 요약

`sections` 배열의 `lecture`(강의 회차 문자열) 필드, `freq`(high/mid/low 3단), Card/ExamTip/Diagram 조합 구조 → `docs/SCHEMA_FEEDBACK_AXIS2.md`에 제안 기록.

