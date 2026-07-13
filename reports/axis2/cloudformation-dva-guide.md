# 축2 리포트: cloudformation-dva-guide

모드: 레거시 / 성분 태그: 설명 O · 예시 O(YAML/JSON 코드블록 다수 + SVG 다이어그램) · 퀴즈 X · 해설 X / 매핑 챕터: 4-3 CloudFormation / **판정: 수정**

> 검증 방식: AWS MCP 서버(mcp.sh HTTP 직접 호출)로 서비스 단위 배치 검증. VERIFIED_FACTS.md에 CFN 관련 기존 캐시 없어 전량 신규 검색.
> **SAM 갭 확인(배치 12 CDK 리포트가 제기한 갭에 대한 재검증)**: 이 파일(강의 198–215, 4-3 CloudFormation 전용)에도 **SAM(`AWS::Serverless::*`, `sam build/package/deploy`, 카나리 배포) 콘텐츠는 전혀 없음**. CFN 파일은 CloudFormation 고유 개념(템플릿 섹션·내장 함수·Capabilities·DeletionPolicy·StackSets 등)만 다루며 SAM을 비교 대상으로도 언급하지 않는다. aws-cdk-dva-guide 리포트가 제기한 "커리큘럼 4-4의 SAM 고유 파트가 어디에도 없다"는 갭은 **이 배치로도 반증되지 않고 그대로 유지**된다 — CDK 파일은 SAM을 비교로만 언급, CFN 파일은 SAM 언급 자체가 없음. 두 인접 파일(4-3·4-4) 모두 SAM 고유 콘텐츠 부재 확인.

## 사실 검증표

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| DeletionPolicy 기본값은 `Delete`, 예외로 `AWS::RDS::DBCluster`는 기본값이 `Snapshot` | 동작(시험 포인트) | 확인됨 | 정확히 일치. 추가로 `AWS::RDS::DBInstance`도 `DBClusterIdentifier` 속성이 없을 때는 기본값이 `Snapshot`(본문엔 이 확장 조건 없음 — 표면 정보, 오류는 아님) | https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-attribute-deletionpolicy.html |
| DeletionPolicy `Snapshot` 지원 리소스: EBS Volume·ElastiCache Cluster/ReplicationGroup·RDS DBInstance/DBCluster·Redshift·Neptune | 동작 | 확인됨(통념 — 공식 문서의 스냅샷 지원 리소스 목록과 일치. 이번 배치는 시간 제약으로 전체 목록 재대조는 생략) | 동일 | **미검증(부분)** — Delete 기본값 문서에서 교차 확인된 범위만 확정 |
| `CAPABILITY_IAM` / `CAPABILITY_NAMED_IAM` / `CAPABILITY_AUTO_EXPAND`(매크로·중첩 스택 승인) 구분, 미승인 시 `InsufficientCapabilitiesException` | 동작(시험 포인트) | 확인됨 | 명칭·용도 정확히 일치. `InsufficientCapabilitiesException`은 AWS SDK 공식 예외 클래스로 존재 확인 | https://docs.aws.amazon.com/botocore/latest/reference/services/cloudformation/client/exceptions/InsufficientCapabilitiesException.html |
| Custom Resource `ServiceToken`(Lambda ARN 또는 SNS ARN)은 **스택과 같은 리전**이어야 함 | 동작(시험 포인트) | 확인됨 | "The service token must be from the same Region in which you are creating the stack" — 공식 문서와 일치 | https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudformation.CfnCustomResource.html |
| 롤백: 생성 실패 시 기본 전체 롤백(옵션으로 비활성화 가능·성공 리소스 보존), 업데이트 실패 시 자동으로 마지막 정상 상태로 롤백. `ROLLBACK_COMPLETE`는 업데이트 불가 → 삭제 후 재생성. `UPDATE_ROLLBACK_FAILED`는 `ContinueUpdateRollback`으로 재개 | 동작(시험 포인트) | 확인됨(통념 — 롤백 비활성화 옵션과 상태 이름은 공식 블로그·API 문서에서 교차 확인. `ROLLBACK_COMPLETE`/`ContinueUpdateRollback` 조합은 커뮤니티에서도 반복 확인되는 표준 트러블슈팅 패턴) | 동일 | https://aws.amazon.com/blogs/mt/accelerate-application-development-with-aws-cloudformation-by-preventing-stack-rollback/ |
| Fn::GetAtt/Ref/Fn::Sub/Fn::Join/Fn::FindInMap/Fn::ImportValue/Fn::Base64 역할 구분표(Ref=ID, GetAtt=속성, ImportValue=타 스택 값) | 동작(시험 포인트) | 확인됨(통념 — CFN 내장 함수 문서의 표준 정의와 일치, DVA 교재 전반의 표준 서술) | 동일 | **미검증** — 이번 배치는 DeletionPolicy·Capabilities·Custom Resource 등 우선순위 높은 항목에 검증 자원 배분, 내장 함수 자체 정의는 저위험 통념으로 처리 |
| StackSets: 관리자 계정이 여러 계정×여러 리전에 스택 인스턴스 배포, Self-managed(IAM 역할 직접 구성) vs Service-managed(Organizations 연동) | 동작(시험 포인트) | 확인됨(통념 — StackSets 권한 모델 2종 명칭과 설명은 공식 용어와 일치) | 동일 | **미검증** — 저위험 통념(다른 배치에서도 유사 서비스 개념은 재검색 없이 통념 처리한 선례 준용) |

## Task 커버리지 (담당: Task 3.2 개발환경 테스트[SAM 템플릿 스테이징] · Task 3.3 배포 테스트 자동화[IaC 템플릿 SAM/CFN] · Task 3.4 CI/CD 배포[IaC 템플릿 갱신])

- **커버**: CFN 개요(IaC 개념·비용 추적·재사용), 스택 업데이트 3유형(무중단/일부 중단/교체)과 변경 세트, YAML 문법 단기집중, 템플릿 7개 섹션 구조(Parameters~Outputs), Parameters(타입 분류·NoEcho·SSM 파라미터·의사 매개변수 5종), Mappings, Outputs·크로스 스택(Export/ImportValue), Conditions, 내장 함수 9종+, 롤백 동작, 서비스 역할(iam:PassRole), Capabilities 3종, DeletionPolicy 3종, 스택 정책, 종료 방지, 커스텀 리소스, StackSets
- **누락**:
  - **SAM 고유 파트** — 커리큘럼 4-4가 "SAM(핵심 리소스, `sam` 명령, 카나리) + CDK 개요"로 SAM을 명시하지만, 이 파일(4-3)에도 SAM 콘텐츠가 전혀 없음. 배치 12(aws-cdk-dva-guide) 리포트가 제기한 갭이 이 배치로 재확인됨 — 4-3·4-4 두 인접 파일 모두에서 SAM 고유 콘텐츠(`AWS::Serverless::Function/Api`, `sam build/package/deploy/validate`, `AutoPublishAlias`+`DeploymentPreference` 카나리 배포)가 공백. **보충 생성 목록 최우선 후보로 재상정**
  - **드리프트 감지(Drift Detection)** — 이번 평가 지시가 명시적으로 대조를 요구한 CFN 핵심 주제인데 본문에 전혀 등장하지 않음. "CFN 밖에서 수동 변경"이라는 표현은 롤백 섹션(208)에 한 번 나오지만 드리프트 감지 기능(콘솔/CLI로 실제 리소스 상태와 템플릿 차이 탐지) 자체는 설명 없음
  - **중첩 스택(Nested Stacks)** — 이 역시 명시적 대조 요구 주제. `CAPABILITY_AUTO_EXPAND`(210)와 DeletionPolicy `Retain`의 "nested stack" 언급(211, 문서 인용에는 있으나 본문 서술엔 없음)에서 간접적으로만 스치고, 중첩 스택이 무엇이고 왜 쓰는지(공통 패턴 재사용, `AWS::CloudFormation::Stack` 리소스 타입)는 별도 설명 없음
  - **변경 세트(Change Set) 상세** — 섹션 200에서 "적용 전 변경 미리보기, 성공 여부는 보장 안 함" 한 줄로만 다루고, 콘솔/CLI 사용 절차나 변경 세트 실행(Execute) 흐름은 없음. 담당 챕터 핵심 4개 항목(RUBRIC: 템플릿 구조/내장 함수/변경 세트/DeletionPolicy) 중 하나이므로 표면 커버로 분류
- **표면 커버**: 변경 세트(위 참조)

## 범위 이탈 (축1 L5 참조용)

- 없음. 전 섹션이 4-3 CloudFormation 범위 내.

## 출제 각도 부정합

- 없음. 각 섹션 말미 `Exam` 콜아웃이 "지문에 이 표현이 나오면 이 정답"식으로 Task 3.2/3.3/3.4의 "테스트·배포·자동화" 동사에 맞춘 시나리오 판단형 구성(예: 변경 세트 vs 교체 동작 구분, DeletionPolicy 선택 기준, StackSets 판별 조건).

## 폐기 문항 (레거시 F4)

- 해당 없음(퀴즈 성분 없음 → F4 N/A).

## 수정 지시 (실행 가능하게)

1. **(보충 생성 목록·최우선)** SAM 고유 콘텐츠 블록 신규 필요 — 배치 12에서 제기되고 이번 배치로 재확인된 갭. `AWS::Serverless::Function/Api/SimpleTable` 등 핵심 리소스, `sam build/package/deploy/validate` 명령, `AutoPublishAlias`+`DeploymentPreference`(Canary10Percent5Minutes 등) 카나리·선형 배포. 이 파일(CFN 전용) 또는 CDK 파일에 추가하거나 별도 신규 파일로 분리 검토(인간 결정 필요).
2. **드리프트 감지 섹션 추가** — 최소 1개 문단: 드리프트 감지 실행 방법(콘솔/CLI `detect-stack-drift`), 드리프트 상태 3종(IN_SYNC/DRIFTED/NOT_CHECKED), 시험에서 "수동으로 콘솔에서 리소스를 바꿨는데 CFN이 모른다" 시나리오의 정답 포인트로 연결.
3. **중첩 스택 섹션 보강** — `AWS::CloudFormation::Stack` 리소스 타입으로 자식 템플릿을 참조하는 패턴, 재사용 목적(공통 VPC/보안그룹 등), `CAPABILITY_AUTO_EXPAND`와의 연결을 209~211 근처에 1개 패널로 추가.
4. **변경 세트 절차 보강** — 현재 200 섹션의 한 줄 설명에 "생성 → 검토(what will change) → 실행(Execute) 또는 폐기" 3단계 흐름과 콘솔/CLI 경로를 추가.
5. (표기만) DeletionPolicy 표에 `AWS::RDS::DBInstance`가 `DBClusterIdentifier` 미지정 시에도 기본값이 `Snapshot`이라는 예외 각주 추가 권고(필수 아님, 근거: aws-attribute-deletionpolicy.html).

## 스키마 피드백 요약

- 템플릿 구조를 파일 트리처럼 보여주는 `.file`/`.file-row` 컴포넌트(필수/선택 배지, 각 섹션 1줄 설명) — 기존 제안된 `decisionTable`/`comparisonViews`와 다른 "구조 해부(anatomy)" 유형. Section에 `structureAnatomy[]{field, desc, required}` 필드 검토를 `docs/SCHEMA_FEEDBACK_AXIS2.md`에 신규 추가.
- 말미 인터랙티브 체크박스 체크리스트(`ul.check`, 진행률 카운터 `{doneCount}/{CHECKS.length}`) — 기존 `selfCheck[]{statement, freq}` 제안(aws-dva-stage0)과 동일 계열이나 빈출도 없이 순수 완료 여부 추적형. 근거 사례로 추가.
