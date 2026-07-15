# 축2 리포트: sam_guide

모드: 레거시(고엄밀 지정) / 성분 태그: 설명 O · 예시 O(코드 블록/다이어그램/인터랙티브 시뮬레이터 2종) · 퀴즈 X · 해설 X / 매핑 챕터: 4-4 SAM(단독, 신규 임포트) / **판정: 수정**

> 검증 방식: AWS MCP 서버(mcp.sh HTTP 직접 호출), SAM 공식 개발자 가이드 원문 대조. 캐시: VERIFIED_FACTS의 CodeDeploy Lambda 배포 구성 이름 체계 항목(기존 등재) 참조, 이번 배치에서 SAM `DeploymentPreference.Type` 표기(접두사 없는 `Canary10Percent10Minutes` 형식)를 공식 예제로 별도 재확인 — CodeDeploy 원시 이름(`CodeDeployDefault.Lambda...`)과 SAM 템플릿 내 이름 체계가 다르다는 점 확인.

## 사실 검증표

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| `Transform: AWS::Serverless-2016-10-31` 헤더가 있어야 SAM 템플릿으로 인식됨 | 동작(시험 포인트) | 확인됨 | 동일 | https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html (Transform 요구사항) |
| SAM 리소스 6종: `AWS::Serverless::Function` / `Api` / `HttpApi` / `SimpleTable` / `StateMachine` / `LayerVersion` | 사실 | 확인됨 | 6종 전부 실존 리소스 타입 | https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-specification-generated-resources-function.html (Function 기준 교차 확인) |
| `AWS::Serverless::Function` 지정 시 항상 `AWS::Lambda::Function` 생성, `Role` 미지정 시 `AWS::IAM::Role` 생성, `Api` 이벤트 지정 시(RestApiId 미지정) `AWS::ApiGateway::RestApi` 생성 | 동작(시그니처 다이어그램 근거) | 확인됨 | 동일 | https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-specification-generated-resources-function.html |
| SamTransform 다이어그램의 생성 리소스 목록에 `Logs::LogGroup` 포함 | 동작 | 수정 필요(경미) | 공식 "생성 리소스" 문서에 `AWS::Logs::LogGroup`이 함수 기본 시나리오로 명시되지 않음 — Lambda는 첫 호출 시 로그 그룹을 런타임에 자동 생성하며, SAM이 CloudFormation 리소스로 명시 생성하는 것은 아님(단, 최신 `LoggingConfig` 고급 옵션 사용 시는 별개) | https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-specification-generated-resources-function.html |
| SAM CLI 명령 지도: `sam init` / `sam validate` / `sam build` / `sam local invoke·start-api` / `sam deploy` / `sam sync --watch` | 동작 | 확인됨 | 전부 실존 명령, 설명도 정확 | https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/using-sam-cli-configure.html (sync·config 문맥) |
| `sam local` 하위 명령: `invoke` / `start-api` / `start-lambda` / `generate-event` | 동작 | 확인됨 | 전부 실존 명령 | https://aws.amazon.com/blogs/compute/speeding-up-incremental-changes-with-aws-sam-accelerate-and-nested-stacks/ (sam build/deploy 문맥과 함께 SAM CLI 명령 체계 확인) |
| `sam package`가 코드/아티팩트를 S3에 업로드하고 CodeUri를 S3 경로로 치환, `sam deploy` 하나로 package까지 통합 수행 가능 | 동작 | 확인됨(통념 — 공식 CLI 레퍼런스의 표준 설명과 일치, 별도 재검색 없이 저위험 판단) | — | — |
| `capabilities`: `CAPABILITY_IAM` / `CAPABILITY_NAMED_IAM` / `CAPABILITY_AUTO_EXPAND` | 동작(시험 포인트) | 확인됨 | 3개 값 모두 유효(공식 CLI 레퍼런스 + CDK `CfnCapabilities` enum 교차 확인). `CAPABILITY_AUTO_EXPAND`는 Transform/매크로 실행 승인용이라는 설명도 정확 | https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-deploy.html · https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.CfnCapabilities.html |
| `AutoPublishAlias` + `DeploymentPreference`(`Type`/`Alarms`/`Hooks.PreTraffic`/`Hooks.PostTraffic`) 구성, CodeDeploy가 실제 트래픽 전환 수행 | 동작(시험 포인트, 최상위 빈출 표기) | 확인됨 | 공식 예제 템플릿과 완전 일치(`AutoPublishAlias: live`, `DeploymentPreference.Type/Alarms/Hooks`) | https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/automating-updates-to-serverless-apps.html |
| DeploymentPreference `Type` 명명: `Canary10Percent5Minutes`, `Linear10PercentEvery1Minute`, `AllAtOnce` (접두사 없는 SAM 전용 표기) | 동작(시험 포인트) | 확인됨 | 공식 문서 예제가 정확히 이 표기 체계(`Canary10Percent10Minutes` 등, `CodeDeployDefault.` 접두사 없음)를 사용 — Canary=2단계(소량 후 대기 후 전량), Linear=균등 증분, AllAtOnce=즉시 전량이라는 정의도 일치. (VERIFIED_FACTS 기존 캐시의 `CodeDeployDefault.Lambda...` 표기는 CodeDeploy 원시 배포 구성 이름이며 SAM 템플릿 표기와는 접두사만 다른 별개 네임스페이스임을 확인) | https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/automating-updates-to-serverless-apps.html |
| 정책 템플릿 6종: `DynamoDBCrudPolicy` / `DynamoDBReadPolicy` / `S3ReadPolicy` / `S3CrudPolicy` / `SQSPollerPolicy` / `SNSPublishMessagePolicy` / `LambdaInvokePolicy` | 사실 | 확인됨 | 전부 공식 정책 템플릿 목록에 실존 | https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-policy-template-list.html |
| 정책 템플릿 = "이름 + 대상 리소스만 지정하면 최소권한 IAM 정책 자동 생성" | 동작 | 확인됨 | 동일 | https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-policy-templates.html |
| SAM Connectors — "A가 B에 쓴다"는 의도 선언으로 IAM 권한 자동 변환 | 사실(보너스 콜아웃) | 확인됨(통념) | 공식 블로그 설명과 일치(소스·대상 리소스 연결 + read/write 권한 선언) | https://aws.amazon.com/blogs/compute/simplifying-serverless-permissions-with-aws-sam-connectors/ |
| `AWS::Serverless::SimpleTable` = 단일 파티션 키 간단 테이블, 복잡한 인덱스는 `AWS::DynamoDB::Table` 직접 사용 | 동작 | 확인됨(통념) | 공식 리소스 정의와 일치 | — |
| 다중 환경: 하나의 `template.yaml` + `Parameters` + `samconfig.toml`의 환경별 블록 + `sam deploy --config-env prod` | 동작(시험 포인트) | 확인됨 | 공식 CLI 설정 가이드와 정확히 일치(`--config-env` 옵션, YAML/TOML 환경 블록) | https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/using-sam-cli-configure.html |
| `samconfig.toml`은 `sam deploy --guided` 최초 실행 시 자동 생성 | 동작 | 미검증(콘텐츠에 이 서술 자체가 없음 — 아래 F1 참조) | `sam deploy --guided`가 최초 배포 시 대화형으로 값을 물어 `samconfig.toml`을 생성한다는 것이 공식 표준 흐름 | https://aws.amazon.com/blogs/compute/optimizing-serverless-development-with-samconfig/ |

## Task 커버리지 (담당: Task 3.2 개발 환경 테스트[SAM 템플릿 스테이징 배포] · Task 3.3 배포 테스트 자동화[IaC 템플릿 SAM/CFN, 테스트 이벤트] · Task 3.4 CI/CD 배포[배포 전략 카나리/선형])

- **커버(온전)**: SAM 정체성(CloudFormation 확장)·Transform 헤더·리소스 6종·CLI 명령 전 계열(init/validate/build/local 4종/deploy/sync/package)·프로젝트 구조·배포 파이프라인(build→package→deploy)·capabilities 3종·API Gateway 암묵/명시 생성·DynamoDB SimpleTable+Streams 트리거·정책 템플릿 6종+Connectors·**CodeDeploy 카나리/선형/즉시 3종 트래픽 전환(AutoPublishAlias·DeploymentPreference·Alarms·Hooks 전 구성 요소, 인터랙티브 시뮬레이터 동반)**·다중 환경(Parameters+config-env)
- **SAM 갭 해소도 (RUBRIC이 지목한 최우선 커버리지 갭 대비 판정): 온전**. `_FINAL_SUMMARY.md` §2가 "27파일 전체에 SAM 고유 콘텐츠 전무"로 지목한 항목 — `AWS::Serverless::*` 리소스, `sam` CLI 명령, 카나리/선형 배포 — 이 파일이 전부 다루며, 특히 Task 3.4의 핵심인 카나리/선형 배포는 최상위 빈출(◆◆◆) 표기로 전용 섹션·전용 시뮬레이터·전용 치트시트 행까지 배정되어 가장 두텁게 다뤄짐. 이 파일 하나로 4-4 SAM 챕터의 갭이 사실상 해소됨
- **표면 커버**: 없음(다룬 항목은 예시·다이어그램·시험 포인트 콜아웃 동반)
- **누락**:
  1. `sam deploy --guided` — 대화형 최초 배포 흐름·`samconfig.toml` 자동 생성 트리거가 전혀 언급되지 않음. RUBRIC이 사전 경고한 "구버전 지식 패턴" 점검 대상이었으나, 이 파일의 문제는 구식 서술이 아니라 **완전 누락**(오류는 없음). Task 3.2 "SAM 템플릿 스테이징 배포"의 실전 흐름과 직결되는 키워드
  2. SAM Accelerate 자체 명칭 — `sam sync --watch`는 다루지만 "SAM Accelerate"라는 기능명은 등장하지 않음(경미, 명령어는 정확히 커버)
  3. Step Functions 통합(`AWS::Serverless::StateMachine`)은 리소스 목록에만 등장하고 전용 섹션·예시 없음(표는 있으나 실습 없음 — 다만 커리큘럼상 2-5 Step Functions 챕터가 별도 담당이므로 중대 누락은 아님)
  4. `Globals` 섹션(함수 공통 설정)은 코드 예시에 등장하나 별도 설명 섹션 없이 스쳐 지나감

## 범위 이탈 (축1 L5 참조용)

- "도커 기초"·"서버리스 & Lambda 복습" 두 섹션은 커리큘럼 4-4 범위 밖이지만, 각각 `sam local`(도커 필요)과 SAM 등장 배경(서버리스 앱의 리소스 묶음 → 장황함 → SAM)의 **선수 개념으로 명시적으로 스코프됨**(freq 배지 "선수 개념"/"복습", 빈출도 최저 ◆◇◇로 자체 표기). 정의 나열이 아니라 후속 섹션의 필요성을 설명하는 도입부이므로 범위 이탈로 보지 않음
- 그 외 전 섹션이 SAM(4-4) 범위 내

## 출제 각도 부정합

- 없음. 커리큘럼 Task 동사("테스트·자동화·배포")에 맞춰 명령 지도·배포 파이프라인 다이어그램·트래픽 전환 인터랙티브 시뮬레이터·"자주 틀리는 함정" 체크리스트 등 실전 대응형 구성. 특히 Task 3.4(배포 전략) 대비 카나리/선형 시뮬레이터는 정적 서술보다 강한 정합

## 폐기 문항 (레거시 F4)

- 해당 없음. 파일 전체에 퀴즈/정답/해설 성분 없음(치트시트 표와 "함정 체크" 목록만 존재, 채점 가능한 문항 없음) → F4 N/A

## 수정 지시 (실행 가능하게)

1. **`SamTransform` 컴포넌트(라인 454~615)의 CloudFormation 생성 리소스 목록에서 `Logs::LogGroup` 제거 또는 각주 처리** — 공식 "AWS::Serverless::Function 지정 시 생성되는 CloudFormation 리소스" 문서 기준으로 함수 기본 시나리오에 로그 그룹 명시 생성이 없음(Lambda 런타임이 첫 호출 시 자동 생성). 근거: sam-specification-generated-resources-function.html
2. **(보충 권고, 필수 아님) `deploy` 섹션(라인 1885~1992)에 `sam deploy --guided` 한 줄 추가** — 최초 배포 시 대화형으로 스택명·리전·capabilities를 묻고 `samconfig.toml`을 생성하는 표준 흐름을 언급하면 Task 3.2("SAM 템플릿 스테이징 배포")와의 정합이 더 강해짐. 근거: optimizing-serverless-development-with-samconfig 블로그, using-sam-cli-configure.html
3. (표기만) "SAM Accelerate"라는 기능명을 `sam sync --watch` 설명에 병기하면 시험 지문에서 이름으로 물었을 때도 대응 가능(권고)

## 스키마 피드백 요약

- `TrafficShift` 컴포넌트(라인 620~ 다수) — 모드(Canary/Linear/AllAtOnce) 선택 버튼 + 단계별 진행 애니메이션(BeforeAllowTraffic 훅 → 트래픽 전환 → AfterAllowTraffic 훅 → 완료, 오류 시 롤백 분기) — `docs/SCHEMA_FEEDBACK_AXIS2.md`에 인터랙티브 시뮬레이터 유형으로 신규 제안 기록(다른 파일의 "슬라이더/클릭형 다이어그램" 제안과 동일 범주, 이 파일은 "상태 기계형 단계 시뮬레이터"라는 구체 변형)
- `SamTransform` 익스팬더(짧은 SAM 템플릿 → 클릭 시 다수의 CloudFormation 리소스가 순차 페이드인) — "축약 문법 → 실제 리소스 전개"를 보여주는 패턴으로, CDK 리포트가 이미 제안한 다이어그램 표준 구조 제안과 함께 참고할 가치 있음(신규 제안하지 않음, 기존 제안과 병합 권고)
