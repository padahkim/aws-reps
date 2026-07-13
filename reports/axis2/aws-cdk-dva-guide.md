# 축2 리포트: aws-cdk-dva-guide

모드: 레거시 / 성분 태그: 설명 O · 예시 O(코드/터미널 블록) · 퀴즈 X · 해설 X / 매핑 챕터: 4-4 CDK(SAM 개요 겸) / **판정: 수정**

> 검증 방식: AWS MCP 서버(mcp.sh HTTP 직접 호출). 캐시: docs/VERIFIED_FACTS.md에 CDK 관련 기존 등재 없어 전량 신규 검색.

## 사실 검증표

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| `cdk bootstrap` 결과 CDKToolkit 스택 = "S3 버킷 + IAM 역할"(단수형으로 단순화) | 동작 | 수정 필요(경미/보강) | 실제로는 **S3 스테이징 버킷 + ECR 리포지토리 + IAM 역할 5종**(CloudFormationExecutionRole·DeploymentActionRole·FilePublishingRole·ImagePublishingRole·LookupRole)이 생성됨. 컨테이너 자산(이미지) 퍼블리시용 ECR 리포지토리가 통째로 빠져 있어 4-1(컨테이너)과의 연결고리를 놓침 | https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping-env.html |
| "Policy contains a statement with one or more invalid principals" = bootstrap 누락 신호 | 동작(시험 포인트) | 확인됨 | 동일 — 대상 (계정,리전) 환경이 새 부트스트랩 스택으로 부트스트랩되지 않았을 때 나오는 공식 문서화된 에러 패턴 | https://docs.aws.amazon.com/cdk/api/v1/python/aws_cdk.pipelines/README.html |
| Construct L1 = Cfn 접두사, CloudFormation 리소스 1:1 대응 | 동작(시험 포인트) | 확인됨 | 동일 | https://docs.aws.amazon.com/prescriptive-guidance/latest/aws-cdk-layers/layer-1.html |
| Construct L2 = "합리적 기본값 + 편의 메서드"(예: `grantRead()`) | 동작 | 확인됨(통념 — CDK 공식 문서의 표준 L2 정의와 일치, 별도 재검색 없이 기존 지식과 문서 표현이 일치해 저위험으로 판단) | — | — |
| Construct L3 = Patterns(여러 리소스 묶음, 예: `ApplicationLoadBalancedFargateService`) | 동작 | 확인됨(통념) | — | — |
| CDK 지원 언어: TypeScript·JavaScript·Python·Java·.NET·Go | 사실 | 확인됨(간접) | Go는 CDK **v2**부터 지원되는 언어 — 파일이 v1 문법·용어를 전혀 언급하지 않고 Go를 포함한 점은 오히려 v2 기준임을 뒷받침(v1은 2023-06-01 지원 종료) | https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping-env.html (v1 종료일 명시 페이지) |
| `sam local invoke MyFunction -t ./cdk.out/CdkStack.template.json` 형태의 CDK+SAM 로컬 테스트 명령 | 동작(시험 포인트) | 확인됨 | 공식 예시와 동일한 패턴: `sam local invoke -t <cdk.out/Stack.template.json> <FunctionId>`. `cdk synth` 선행 필수라는 서술도 문서와 일치 | https://docs.aws.amazon.com/cdk/v2/guide/testing-locally-with-sam-cli.html |
| CDK Assertions Module: `Template.fromStack()` / `Template.fromString()`, fine-grained(`hasResourceProperties`) vs snapshot 구분 | 동작 | 확인됨(통념 — CDK 공식 aws-cdk-lib/assertions API와 일치하는 표준 용례, 별도 재검색 없이 저위험으로 판단) | — | — |
| CDK vs SAM 비교표(서버리스 전용/선언형 vs 전 서비스/명령형) | 권장사항 | 확인됨(통념) | 공식적으로 반복 서술되는 표준 구분(일반 통념 수준으로 오류 판정 대상 아님) | — |

## Task 커버리지 (담당: Task 3.2 개발환경 테스트[SAM 템플릿 스테이징] · Task 3.3 배포 테스트 자동화[IaC 템플릿 SAM/CFN] · Task 3.4 CI/CD 배포[IaC 템플릿 갱신])

- **커버**: CDK 개념(코드→synth→CloudFormation), CDK vs SAM 선택 기준, Construct 3계층(L1/L2/L3), CDK 명령어(init/bootstrap/synth/diff/deploy/destroy), bootstrap 개념·에러 패턴, CDK 유닛 테스트(Assertions Module), CDK+SAM CLI 로컬 테스트 조합
- **표면 커버**: 없음(다룬 항목은 예시·시험 포인트 동반)
- **누락**: 커리큘럼 4-4가 "SAM(핵심 리소스, **sam 명령**, **카나리**) + CDK 개요"로 SAM 고유 파트를 명시하는데, 이 파일은 **CDK 전용 콘텐츠**이며 SAM은 비교 대상으로만 언급됨. 다음 SAM 고유 항목이 이 배치(4-1·4-4 충원분) 어디에도 등장하지 않음:
  - SAM 템플릿 핵심 리소스(`AWS::Serverless::Function`, `AWS::Serverless::Api` 등)
  - `sam build` / `sam package` / `sam deploy` / `sam validate` 명령
  - SAM 카나리·선형 배포(Gradual deployment, `AutoPublishAlias` + `DeploymentPreference`)
  - 이 항목들은 dynamodb-guide 등 기존 배치에서도 다뤄지지 않았다면 **커리큘럼 4-4의 SAM 절반이 통째로 공백**일 가능성 — 보충 생성 목록 최우선 후보로 보고

## 범위 이탈 (축1 L5 참조용)

- 없음. 전 탭이 CDK(4-4) 범위 내. CDK vs SAM 비교는 범위 이탈이 아니라 Task 3.2/3.3/3.4의 IaC 도구 선택 시나리오에 필수적인 정합 콘텐츠.

## 출제 각도 부정합

- 없음. curriculum Task 동사("테스트·자동화·배포")에 맞춰 "문제 속 신호 → 정답 방향" 즉답표, "출제 비중 한눈에" 랭킹표 등 실전 대응형 구성.

## 폐기 문항 (레거시 F4)

- 해당 없음 (퀴즈 성분 없음 → F4 N/A).

## 수정 지시 (실행 가능하게)

1. **`TabCommands`의 "Bootstrapping" 섹션 보강** — CDKToolkit 스택 설명 카드(현재 "S3 버킷" · "IAM 역할" 2행)에 **"ECR 리포지토리 — 컨테이너 이미지 자산(Docker 기반 Lambda·Fargate 배포 시 사용)"** 행 추가. IAM 역할도 "CDK가 배포에 사용할 권한"이라는 뭉뚱그린 설명 대신, 최소한 "배포 실행 역할 등 5종 역할(CloudFormationExecutionRole 등)"로 구체화 권고. 근거: bootstrapping-env.html
2. **(보충 생성 목록·최우선)** 커리큘럼 4-4의 SAM 고유 파트 콘텐츠 블록 추가 필요 — SAM 템플릿 핵심 리소스, `sam build/package/deploy`, 카나리·선형 배포. 이 파일은 CDK만 다루므로 별도 섹션 또는 별도 파일로 보강 검토(다른 배치 파일에 존재하는지 인간 확인 필요 — 이번 배치 범위 밖)
3. (표기만) "Construct Hub"·"AWS Construct Library" 명칭은 정확하나, 참고용으로 L2 헬퍼 메서드 예시에 `grantRead()` 외 `grantWrite()`/`grantReadWrite()` 등 실제 자주 나오는 변형도 한 줄 추가하면 시험 문항 다양성에 대응 용이(권고, 필수 아님)

## 스키마 피드백 요약

- "문제 속 신호 → 정답 방향" 즉답표(TabExam의 map 배열)와 "출제 비중 한눈에" 랭킹표(rank 배열) — cheatsheet/quick-reference 유형으로 `docs/SCHEMA_FEEDBACK_AXIS2.md`에 제안 기록.
- 파이프라인 도식(Node/Arrow 컴포넌트로 표현한 코드→템플릿→리소스 흐름)도 다이어그램 표준 구조 제안에 포함.

