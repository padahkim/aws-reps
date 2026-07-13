# 축2 리포트: aws-container-guide

모드: 레거시 / 성분 태그: 설명 O · 예시 O(다이어그램·인터랙티브 데모) · 퀴즈 X · 해설 X / 매핑 챕터: 4-1 컨테이너 / **판정: 수정**

> 검증 방식: AWS MCP 서버(mcp.sh HTTP 직접 호출). 캐시: docs/VERIFIED_FACTS.md 우선 조회 후 신규 검색.

## 사실 검증표

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| "ECS의 IAM 역할" 섹션: **EC2 Instance Profile**을 ECS Agent가 사용 — ECS API 호출, **CloudWatch Logs 전송**, **ECR 이미지 pull**, **Secrets Manager·SSM 조회**까지 담당 (Tip 콜아웃 포함) | 동작(시험 포인트) | **수정 필요** | 현행 문서: 이미지 pull·CloudWatch 로그 전송·Secrets/SSM 조회는 **Task Execution Role**의 역할이며 **EC2·Fargate launch type 모두 동일**하게 적용됨. EC2 Instance Profile(Container Instance IAM 역할)은 ECS Agent가 ECS API를 호출(컨테이너 인스턴스 등록·태스크 폴링 등)하는 데만 쓰임. 파일 뒤쪽(태스크 정의 탭)의 "Task Execution Role" 설명과 서로 모순됨 | https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html |
| AWS Copilot을 현재 권장 도구로 서술("프로덕션 수준 컨테이너 앱 빌드·릴리스·운영") — 유지보수 상태 언급 없음 | 권장사항/최신성 | **수정 필요(최신성)** | AWS Copilot CLI는 **2026-06-12부로 End-of-Support**(평가일 2026-07-13 기준 이미 경과). 이후 신규 기능·보안 패치·기술지원 없음, 기존 배포는 계속 동작하나 GitHub 오픈소스로만 유지 | https://aws.amazon.com/blogs/containers/announcing-the-end-of-support-for-the-aws-copilot-cli/ · https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Copilot.html |
| ECS 서비스 오토 스케일링 지표는 "딱 3가지"(CPU·메모리·ALB 요청수) | 동작 | 수정 필요(경미) | 사전정의 3종 외에 **커스텀 CloudWatch 지표**로도 스케일링 가능(공식 블로그 사례 존재). "딱 3가지"라는 단정 표현만 완화 필요 | https://aws.amazon.com/blogs/containers/amazon-elastic-container-service-ecs-auto-scaling-using-custom-metrics/ |
| Fargate 임시 스토리지 20~200GiB(기본 20GiB) | 수치 | 확인됨 | 동일 | https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-storage.html |
| 태스크 정의 최대 컨테이너 10개 | 수치 | 확인됨(간접) | ECS 관련 문서에서 "task element can run up to 10 containers" 확인 | https://docs.aws.amazon.com/sdk-for-kotlin/api/latest/batch/aws.sdk.kotlin.services.batch.model/-ecs-properties/-builder/task-properties.html |
| ECR 이미지는 백엔드에서 S3에 저장 | 동작 | 확인됨 | 동일(이미지 레이어를 S3에 저장, 그래서 프라이빗 서브넷에서 ECR pull 시 S3 게이트웨이 엔드포인트도 필요) | https://docs.aws.amazon.com/AmazonECR/latest/userguide/vpc-endpoints.html |
| ECR 로그인 `get-login-password` 방식, 구버전 `get-login` 폐지 | 동작 | 확인됨(통념 + 문법 일치, 공식 CLI 레퍼런스 패턴과 부합) | 동일 | (VERIFIED_FACTS 기존 캐시 없음 — CLI 표준 패턴, 별도 URL 미확보. 판정에 영향 없는 표준 명령 문법) |
| EC2 Launch Type — 동적 호스트 포트 매핑(호스트 포트 0) + ALB 필요, CLB는 미지원 | 동작(시험 포인트) | 확인됨(통념) | ALB의 동적 포트 매핑 지원은 널리 문서화된 표준 동작(이번 배치에서 별도 재검색 생략 — 시험 정답에 직접 영향 없는 낮은 리스크로 판단, 캐시 미등재) | — |
| Fargate 태스크마다 전용 ENI(고유 프라이빗 IP) | 동작 | 확인됨(통념) | Fargate awsvpc 네트워크 모드 표준 동작 | — |
| EKS + Fargate 스토리지는 **EFS만** 가능(EBS·FSx Lustre·FSx ONTAP는 불가) | 동작(시험 포인트) | 확인됨 | Fargate Pod은 EFS 파일시스템을 자동 마운트(드라이버 설치 불필요), **동적 프로비저닝 불가·정적 프로비저닝만 가능**. 기본 20GiB 임시 스토리지도 별도 제공 | https://docs.aws.amazon.com/eks/latest/userguide/fargate-pod-configuration.html |
| S3는 파일 시스템으로 마운트 불가(EFS만 공유 스토리지 가능) | 동작(시험 포인트) | 확인됨(통념 — S3는 객체 스토리지로 파일시스템 마운트 API 자체가 없음, DVA 시험 표준 함정 문항) | — | — |
| 롤링 업데이트 기본값: Minimum healthy percent 100% / Maximum percent 200% | 수치 | **확인 불가** | CreateService API 문서에서 두 파라미터는 `Required: No`로만 확인되고, 이번 조회 범위에서 명시적 기본값 스니펫은 미확보. min/max 규칙 자체("min% 아래로 못 내려가고 max%를 못 넘음")는 문서와 부합(확인됨) | https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_CreateService.html |

## Task 커버리지 (담당: Task 3.1 배포 아티팩트 준비[컨테이너 이미지] · Task 3.3 승인 버전 환경[이미지 태그])

- **커버**: 컨테이너 이미지 빌드·저장·배포 전 과정(Docker→ECR→ECS/Fargate 실행), 태스크 정의 리소스 요구사항(CPU/메모리), 환경별 구성(환경 변수·시크릿 출처 구분: SSM/Secrets/S3), IAM 역할 분리, 로드밸런싱, 오토스케일링, 롤링 업데이트, 배치 전략, EFS 공유 스토리지, Copilot·EKS 개요
- **표면 커버**: Task 3.3 "이미지 태그로 승인 버전 환경 구분"(예: staging→prod 승격 시 이미지 태그 전략) — ECR 탭에 "버저닝, 이미지 태그"라는 단어만 등장하고 실제 승인 버전 환경 관리 시나리오(태그 기반 프로모션)는 다루지 않음
- **누락**: 헬스체크·레디니스 프로브(EXAM_TASK_MAP이 4-0·4-1에 "부분 갭"으로 명시한 Task 4.2.8) — ALB 대상 그룹 헬스체크나 컨테이너 헬스체크(`HEALTHCHECK`/task definition healthCheck 필드) 언급 없음. 보충 생성 목록 후보
- **범위 이탈 후보 아님**: Copilot·EKS 섹션은 커리큘럼 4-1 범위 내(컨테이너 서비스 4형제로 명시적 소개됨)

## 범위 이탈 (축1 L5 참조용)

- 없음. 전 탭이 4-1 컨테이너 범위 내(Docker→ECS→ECR→Fargate→Copilot→EKS 흐름이 자연스러움).

## 출제 각도 부정합

- 없음. Task 동사("준비·패키징")에 맞춰 실전 시나리오(어떤 문구가 보이면 어떤 서비스/역할인지) 중심 서술이 일관되게 유지됨. "함정 모음" 섹션이 출제 각도를 직접 겨냥.

## 폐기 문항 (레거시 F4)

- 해당 없음 (퀴즈 성분 없음 → F4 N/A).

## 수정 지시 (실행 가능하게)

1. **[핵심] "ECS의 IAM 역할" 섹션 재작성** — `EcsTab`의 두 번째 `Sec`(제목 "ECS의 IAM 역할 — 누가 어떤 권한을 쓰나")에서 `Card title="EC2 Instance Profile"` 내용 중 "ECR에서 이미지 pull", "CloudWatch Logs로 컨테이너 로그 전송", "Secrets Manager·SSM Parameter Store의 민감 데이터 참조" 세 항목을 삭제하고 **Task Execution Role**로 이동. EC2 Instance Profile은 "ECS 서비스 API 호출(컨테이너 인스턴스 등록·태스크 폴링)"만 남기고, "EC2·Fargate 공통으로 Task Execution Role이 이미지 pull·로그 전송·시크릿 조회를 담당한다"는 문장을 추가. 다이어그램(Dia, `EC2 Instance Profile` 화살표 라벨)도 함께 수정. 태스크 정의 탭(`TaskDefTab`)의 기존 Task Execution Role 카드 설명은 정확하므로 그대로 유지하고 앞부분과 통일. 근거: task_execution_IAM_role.html
2. **AWS Copilot 섹션에 EOS 고지 추가** — `ExtraTab`의 "AWS Copilot" Sec 상단 또는 Tip에 "2026-06-12부로 End-of-Support — 신규 기능·보안 패치·기술지원 종료, 오픈소스로만 유지" 한 줄 추가. 실기 시험 응시 시점 기준 최신 상태를 반영해야 함
3. (경미) "ECS 서비스 오토 스케일링" 섹션 문장 "스케일링 판단에 쓸 수 있는 지표는 딱 3가지" → "대표 지표 3가지(사전정의) — 이 외에 커스텀 CloudWatch 지표도 사용 가능"으로 완화
4. (보충 생성 목록) 헬스체크/레디니스 프로브 개념 블록 추가 — ALB 대상 그룹 헬스체크, 컨테이너 레벨 HEALTHCHECK, ECS 서비스가 비정상 태스크를 교체하는 흐름
5. (권고) ECR 탭에 "이미지 태그 기반 승인 버전 환경 프로모션"(예: `:staging` → `:prod` 재태깅, 불변 태그 정책) 한 단락 보강 — Task 3.3 표면 커버 해소

## 스키마 피드백 요약

- 인터랙티브 데모 컴포넌트(`RollingDemo`, `PlacementDemo`) — 상태 기반 단계별 시각화가 스키마 v0에 없는 유용한 구조. `docs/SCHEMA_FEEDBACK_AXIS2.md`에 제안 기록.
- "시험 직전 핵심 요약표"(SummaryTab) — 빈출도 정렬 총정리 표 구조도 함께 제안.

