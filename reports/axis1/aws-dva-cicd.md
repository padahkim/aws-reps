# 축1 리포트: aws-dva-cicd

**모드**: 레거시 / **평가 범위**: 부분 평가 (N/A: L1·L2·L7·L8 — 퀴즈 성분 없음) / **판정: 통과** (유효 총점 7/8 = 87.5%)

> 축2 판정: 수정(CodeCommit 단종 서술이 시간차 오류 — 2025-11 GA 복귀로 "2024-07-25 신규 사용 불가"는 현재 사실과 불일치, 「핵심」 등급). **두 축 종합 = 수정** (축1 통과여도 축2 「수정」이 종합 판정을 지배 — RUBRIC §5).
> 성분 태그(축2): 설명 O · 예시 O(SVG/HTML 다이어그램 11개 · **실 buildspec.yml YAML 코드** · 시나리오형 ExamTip · 비교표) · 퀴즈 X · 해설 X / 매핑: 4-5 CI/CD.
> 중복 부기: aws-cicd-guide.jsx와 실질 중복 쌍(둘 다 4-5, A3 단일 챕터). 통합 결정은 인간 몫 — 축1 점수엔 미반영. 축2 「중복 관찰」에 따르면 본 파일이 appspec 훅(DownloadBundle·ELB Block/AllowTraffic 훅)·수동승인 IAM 액션명·"롤백=새 배포" 함정 서술에서 상대 파일보다 상세.

## 채점표

| 항목 | 점수 | 근거(구체 위치 인용) |
|---|:--:|---|
| L1 인출 밀도 | **N/A** | 채점형 문항 없음. `ExamTip`("시험 포인트", L90–100 컴포넌트)·"세 가지 개념 구분 (시험 단골)"(L720)·"트러블슈팅 (시험 단골)"(L873) 콜아웃은 서술형 상황→정답으로 학습자 응답을 요구하지 않음(문항 아님, N/A 유지). 파이프라인형 내비(`setActive`, L1425–1444)는 섹션 이동 UI일 뿐 능동 인출 장치 아님. `summary` "빈출도 맵" 게이지(L1290–1346)는 자가복습 시각화이나 채점형 아님. → L1 N/A. |
| L2 해설 완전성 | **N/A** | 해설 성분 없음(오답별 조건화 부재). N/A 규칙 적용. |
| L3 구체 예시 결합 | **2** | 개념 서술 직후 코드·도식·시나리오가 인접 배치. **[결정적] `codebuild`**: 개념 카드(L908–925) → `CodeBuildArchDiagram`(L926) → `BuildspecDiagram`(L927)에 **실제 buildspec.yml YAML 전문**(L313–337: `version 0.2`/`env`/`parameter-store`/`phases install→post_build`/`artifacts`/`cache`) → "buildspec.yml 핵심" 카드(L928). 개념 직후 실코드 = 앵커 2 상단 조건 직접 충족. **`codedeploy`**: EC2 개념 카드(L1010–1022) 직후 `DeployTypeDiagram`(L1023)·`DeployConfigDiagram`(L1024)·`HooksDiagram`(L1025, appspec 7훅 순서+각 훅 역할). **`lambda-ecs`**: Lambda 카드(L1063) 직후 `LambdaTrafficDiagram` SVG(L525–609, Linear/Canary/AllAtOnce 트래픽 곡선)+배포구성명 `Pill`. ExamTip이 상황→정답 실전 지문형("10% 트래픽으로 5분 검증 후 전체 전환"→Canary 10Percent5Minutes, L1104–1109; "DB 비밀번호 안전하게"→parameter-store, L971–976). 실코드+도식+시나리오가 모두 개념 직후 인접 → 앵커 2. |
| L4 인지부하 | **2** | 9개 섹션이 **서비스 1개 = 섹션 1개**로 원자화(intro/CodeCommit/CodePipeline/CodeBuild/CodeDeploy/Lambda·ECS/CodeArtifact/CodeGuru/summary), 신규 용어를 첫 등장 시 도식·표·`Pill`로 정의. `HooksDiagram`(L474–523)은 7개 훅 각각에 1줄 역할 정의 병기(정의 없는 나열 아님). `BuildspecDiagram` phases를 코드+설명 쌍(L271–341)으로 소개. `CodeGuru` Reviewer/Profiler를 4행 비교표(L1194–1239)로, Profiler 파라미터 5종을 각 정의 병기(L1240–1273). `FreqBadge`(L30–47)로 섹션별 우선순위 관리. 가장 밀도 높은 `codedeploy` 블록(DeployType+Config+Hooks 연속)도 정의 없는 8개↑ 용어 폭탄 없이 라벨드 다이어그램으로 부하 분산 → 앵커 2. (경미 관찰: ELB 훅 6종명 L510–520은 `Pill`에 개별정의 없이 나열되나 "앞에/뒤에 추가"로 집단 맥락화, 보조 노트 수준.) |
| L5 시험무관 분량 | **2** | 축2 「범위 이탈」: "**없음. 전 섹션이 4-5 챕터 범위 내(CodeGuru 포함, RUBRIC §2 소관).**" → 이탈 0 = 2. |
| L6 선행 지식 연결 | **1** | 명시적 "N-N장/특정 선행 개념" 역참조 부재. `intro` "왜 CI/CD인가?" 카드가 "지금까지는 콘솔·CLI·Elastic Beanstalk 등으로 수동 배포를 했습니다"(L707–710)로 선행 학습을 **모호하게 '지금까지'로만** 참조(챕터 번호 없음). `codecommit` "교차 계정 접근 → IAM Role + STS AssumeRole"(L786–788)은 IAM/STS 배경 언급 수준(선행 챕터 지목 없음). `lambda-ecs` "SAM 프레임워크와 기본 통합"(L1070), `codebuild` "VPC 안의 RDS·ElastiCache·EC2 접근"(L964–968)도 서비스 이름 배경 언급. 헤더 "SECTION 21 / 360–377강"(L1409–1414)은 당 챕터 자기참조. "0-N장의 X가 여기 Y로 적용" 식 명시 통합 없음 → 앵커 1(코퍼스 9파일 연속 동일 감점). |
| L7 난이도 분포 | **N/A** | 퀴즈 없음. N/A 규칙 적용. |
| L8 누적 복습 | **N/A** | 단일 챕터(4-5) 담당(A3) + 퀴즈 없음(N/A 규칙). 적용. |
| **유효 총점** | **7/8** | 87.5% → **통과** (단, 두 축 종합 = 수정) |

## 수정 지시

축1 설계 점수는 통과 — 필수 설계 수정 없음. 아래는 L6 상향(1→2) 및 축2 사실 수정과의 연계 입력용(축1 감점 사유 아님).

1. **L6 강화(선택, 1→2)** — `intro` "왜 CI/CD인가?" 카드(L707–710) "지금까지는 콘솔·CLI·Elastic Beanstalk 등으로 수동 배포를 했습니다"를 "**Elastic Beanstalk 챕터에서 다룬 수동 배포**를 여기 CodeDeploy/CodePipeline 자동화로 대체" 식 선행 챕터 명시 지목으로 교체. `codecommit` 교차계정 콜아웃(L786–788)에 "**IAM 신뢰 정책·STS AssumeRole 챕터**의 역할 위임이 여기 교차계정 Git 접근에 적용" 한 줄. `codebuild` VPC 항목(L964–968)에 VPC/서브넷/SG 선행 챕터 지목. `lambda-ecs` SAM 통합(L1070)에 Lambda 버전·별칭 선행 챕터 지목.
2. **(축2 소관, 위임 — 사실 오류)** **[최우선]** CodeCommit 단종 서술이 **이 파일에도 존재하며 「핵심」 오류**로 확정됨. ①`codecommit` "⚠ 중요: CodeCommit 서비스 종료" 카드(L791–809, "2024년 7월 25일부터 신규 고객은 CodeCommit을 사용할 수 없습니다") ②`summary` 30초 요약 마지막 줄(L1382–1384, "2024-07-25부터 신규 사용 불가 → GitHub 권장") ③`StackDiagram` 각주(L187–190, "CodeCommit은 신규 고객 사용 불가")·`cols` 라벨 `CodeCommit*`(L153). 축2가 2025-11-24 GA 복귀로 확인 → 세 지점 모두 축2 리포트 수정지시 1·2 준수. **축1은 배치·설계만 평가하므로 값 수정은 축2 완료 시 반영**(설계상으로는 CodeCommit 섹션 freq="low"·비중 축소 서술 자체는 타당, 수치만 갱신 필요).
3. **(축2 소관, 위임 — 커버리지)** ECS 전용 CodeDeploy 훅명(BeforeInstall/AfterInstall/AfterAllowTestTraffic/BeforeAllowTraffic/AfterAllowTraffic)이 `lambda-ecs` ECS 카드(L1083–1103)에 없음 — EC2용 appspec 훅과 다른 훅 셋임을 명시(축2 수정지시 3). buildspec 위치 "반드시 루트"(L931–932)에 `buildspecOverride` 단서(축2 수정지시 4).

## 보충 생성 목록 (결손 성분)

- **[퀴즈·해설 전면 결손]** L1·L2·L7·L8 N/A의 근본 원인. 파일 내 ExamTip·결정표가 이미 문항 소재로 완성돼 있어 전환 난이도 낮음:
  - `intro` ExamTip(L744–749) "Delivery vs Deployment 차이(수동 승인 유무)" → 정의 변별 + 단계(Code/Build/Deploy/Provision)↔AWS 서비스 매칭 문항.
  - `codepipeline` ExamTip 3-combo(L892–896) "아티팩트=S3 / 상태변화=EventBridge / 권한=서비스 롤" → 트러블슈팅 시나리오 문항("파이프라인이 동작 못 함"→서비스 롤 권한).
  - `codebuild` ExamTip(L971–976) "DB 비밀번호→parameter-store/secrets-manager / VPC 통합테스트→VPC 구성 / 로컬 재현→CodeBuild Agent" 3지문 → 각각 상황→정답 선택 문항.
  - `codedeploy` ExamTip(L1045–1051) "훅 순서(ValidateService 마지막) / DownloadBundle·Install 스크립트 불가 / Blue/Green ELB 필수 / 롤백=새 배포" → `HooksDiagram`(L474–523)을 지문으로 한 순서 배열·함정 변별 문항.
  - `lambda-ecs` ExamTip(L1104–1109) → 배포구성명(`LambdaCanary10Percent5Minutes`/`ECSLinear10PercentEvery3Minutes`) 해석 문항.
  - `codeartifact` ExamTip(L1170–1175) "프록시 캐시 / EventBridge 재실행 / 계정공유=전부or전무" → 3지문 문항.
  - `codeguru` Reviewer vs Profiler 비교표(L1194–1239)+ExamTip(L1274–1278) → "정적=Reviewer/런타임=Profiler" 변별 + SamplingInterval↓=정밀↑ 문항.
  각 문항에 **오답별 조건화 해설** 동반 생성(L2 결손 보완). `summary` 빈출도 맵(L1290–1346)은 문항 우선순위 가중치로 활용.
- **[커버리지 갭, 축2 위임]** IaC 템플릿(SAM/CFN) 갱신과 CI/CD 결합 개념 블록(축2 「누락」·수정지시 5) 신규 생성 후 "CodePipeline Deploy 스테이지에서 CloudFormation 스택 갱신" 문항 추가. ECS 전용 훅 셋 블록 추가 후 EC2 훅과의 변별 문항.

## 반복 약점 메모

- **L6 명시 지목 부재** — 코퍼스 9개 파일 연속 L6=1. 본 파일은 Elastic Beanstalk 수동배포·IAM/STS AssumeRole·VPC·Lambda 별칭 등 선행 통합 소재가 매우 풍부(CI/CD가 배포 대상 서비스를 전부 재소환하는 챕터 특성)한데도 챕터 번호 지목이 전무. 생성 프롬프트에 "각 섹션 최소 1개 선행 챕터 개념을 'N-N장의 X → 여기 Y' 형태로 명시 링크" 체크리스트 강제 필요.
- **퀴즈·해설 부재의 구조적 반복** — 레거시 설명형 전형. 다만 본 파일은 서비스별 ExamTip이 모두 상황→정답 다지문 구조(codebuild 3지문·codedeploy 5지문)라 콜아웃→문항 자동 변환 자산이 코퍼스 상위. 생성 파이프라인에서 우선 태깅 권장.
- **시간차 사실 오류의 설계-사실 분리** — CodeCommit 단종 서술은 설계상 위치(freq=low·비중감소)는 정당하나 수치가 낡음. 축1이 설계만 보는 원칙이 여기서 명확히 작동: 배치는 유지, 값만 축2가 갱신. 생성 프롬프트에 "서비스 상태(GA/단종/deprecation) 서술은 날짜 하드코딩 대신 '최신 확인 필요' 플래그" 권장.

## 스키마 피드백 요약

- 신규 항목 없음. `FREQ` 3단 빈출도 배지(L6–47)·`ExamTip` 콜아웃·비교표·라벨드 SVG/HTML 다이어그램은 기존 SCHEMA_FEEDBACK 제안과 동일 패턴. 축2가 기록한 `lecture`(강의 회차)·`freq` 3단·Card/ExamTip/Diagram 조합은 `docs/SCHEMA_FEEDBACK_AXIS2.md` 등재분과 동일 — 축1 관점에서 **buildspec.yml 실코드+도식 병치(코드-도식 쌍) 뷰**가 L3 만점을 가장 견고히 뒷받침하는 구조로, 콜아웃 위주 파일 대비 재현 우선 패턴으로 1건 관찰 추가.
