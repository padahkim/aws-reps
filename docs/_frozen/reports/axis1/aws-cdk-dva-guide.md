# 축1 리포트: aws-cdk-dva-guide

**모드**: 레거시 / **평가 범위**: 부분 평가 (N/A: L1·L2·L7·L8 — 퀴즈 성분 없음) / **판정: 통과** (유효 총점 7/8 = 87.5%)

> 축2 판정: 수정(CDKToolkit 부트스트랩 스택 설명이 "S3+IAM"으로 단순화 — 실제 ECR 리포지토리+IAM 역할 5종 누락, 경미/보강). **두 축 종합 = 수정**.
> 성분 태그(축2): 설명 O · 예시 O(코드/터미널 블록) · 퀴즈 X · 해설 X / 매핑: 4-4 CDK(SAM 개요 겸).

## 채점표

| 항목 | 점수 | 근거(구체 위치 인용) |
|---|:--:|---|
| L1 인출 밀도 | N/A | 퀴즈 없음 |
| L2 해설 완전성 | N/A | 해설 없음 |
| L3 구체 예시 결합 | 2 | 개념 직후 인접 예시가 전편에 걸쳐 일관됨. `TabOverview` 파이프라인(L250-279): ① 코드 Node 안에 `Term title="lib/my-stack.ts"`로 실제 TS(`new s3.Bucket(...)`)를, ② 템플릿 Node 안에 `cdk.out/MyStack.template.json` CFN YAML을 인라인 배치 — 합성 전후를 나란히 보여줌. `TabConstructs` `LayerRow`(L436-456)는 각 추상화 레벨 설명 옆에 식별 코드 chip(`bucket.grantRead(role)`·`CfnTable`)을 붙임. `TabCommands`(L594-604)는 `Policy contains a statement with one or more invalid principals` 에러 문구를 **보기 그대로** 노출. `TabTesting`(L656-668) Jest+assertions 블록에 `hasResourceProperties`·`resourceCountIs` 실코드. `TabExam` 즉답표(L693-703)는 "문제 속 신호→정답 방향"으로 실전 지문 형태 그 자체. |
| L4 인지부하 | 2 | 탭 5개·`Section` 단위로 원자화, 신규 용어를 첫 등장 시 표·chip·콜아웃으로 정의. Construct L1/L2/L3를 `LayerRow` 3행(설명+코드+`✎ tip`)으로 분해(L436-456), CDK vs SAM은 2열 비교 카드(L292-321)로 대비. 최다 밀집 블록인 `TabTesting`(fromStack/fromString/fine-grained/snapshot/hasResourceProperties/resourceCountIs ≈6~7 용어)도 `Node`·색 카드로 각각 정의·구획(L622-668) — 8개↑ 미정의 블록 없음. |
| L5 시험무관 분량 | 2 | 축2 범위이탈: "없음. 전 탭이 CDK(4-4) 범위 내. CDK vs SAM 비교는 범위 이탈이 아니라 Task 3.2/3.3/3.4의 IaC 도구 선택 시나리오에 필수적인 정합 콘텐츠." |
| L6 선행 지식 연결 | 1 | 명시적 "N-N장/특정 선행 개념" 역참조 부재. `TabOverview` ExamTip(L281-284)의 "특히 **Lambda 함수**나 **ECS/EKS의 Docker 컨테이너**와 함께 쓰기 좋다"는 서비스 이름 배경 언급 수준. CloudFormation을 전편에서 합성 타깃으로 계속 참조하나 "앞서 배운 CloudFormation 스택 개념" 식 챕터 지목 없음. 헤더·푸터의 강의번호(389·391·392·393)는 이 파일 **자체 챕터** 내부 링크라 L6 대상 아님(선행 챕터 통합이어야 함). → 코퍼스 9개 연속 L6=1. |
| L7 난이도 분포 | N/A | 퀴즈 없음 |
| L8 누적 복습 | N/A | 퀴즈 없음 (A3: 단일 챕터 담당) |
| **유효 총점** | **7/8** | 87.5% → **통과** (단 축2 수정 → 두 축 종합 수정) |

## 수정 지시

1. **L6 위반 보강(핵심 감점) — `TabOverview` ExamTip(L281-284)**: "Lambda 함수나 ECS/EKS의 Docker 컨테이너와 함께 쓰기 좋다" 뒤에 선행 챕터 명시 지목 추가. 예: "— 컨테이너 자산 배포는 **4-1장(컨테이너/ECR)** 에서 다룬 이미지 리포지토리로 연결된다." 축2가 지목한 부트스트랩 ECR 누락(아래 3항)과 같은 지점을 4-1과 명시 링크하면 L6=2 근거가 됨.
2. **L6 보강 — CloudFormation 역참조**: `TabOverview` 파이프라인(L259-267)·공통점 카드(L323-327)에서 "둘 다 결국 CloudFormation으로 변환"을 서술할 때 "**앞서 배운 CloudFormation 스택/템플릿**"처럼 선행 챕터를 명시 지목(예: "3-x CloudFormation 장의 스택 개념 그대로"). 현재는 서비스명만 반복돼 L6=1 처리됨.
3. **(축2 소관 반영 — 사실 보강, 축1은 위임 표기)** `TabCommands` CDKToolkit 스택 카드(L547-559)는 "S3 버킷"·"IAM 역할" 2행뿐 — 축2 지시대로 **"ECR 리포지토리 — 컨테이너 이미지 자산 퍼블리시"** 행 추가, IAM 역할은 "5종(CloudFormationExecutionRole 등)"으로 구체화. (축1 채점엔 미반영, 두 축 종합 수정 사유.)

## 보충 생성 목록 (결손 성분)

**퀴즈·해설 전면 결손이 이 파일 최우선 결손(L1·L2·L7·L8 N/A 원인).** 본문에 이미 문항화하기 좋은 콜아웃/결정표가 다수 있으므로 이를 문항 소재로 직접 전환 권고:

- **CDK vs SAM 선택 시나리오** (소재: `TabExam` map 즉답표 L694-695, CDK vs SAM 카드 L292-321) → 시그널 키워드 4지선다("익숙한 프로그래밍 언어로 인프라 정의" → CDK) + 해설(공통점: 둘 다 CloudFormation 변환).
- **bootstrap 목적·시점·에러** (소재: L524-604, 특히 invalid principals 콜아웃 L597-603) → "이 에러 문구가 뜨면?" 문항 + 해설(환경=계정×리전마다 1회, CDKToolkit 스택).
- **Construct L1/L2/L3 식별** (소재: `LayerRow` tip L436-456) → "클래스명이 Cfn으로 시작 → 몇 레벨?" / "grantRead() 등장 → ?" 문항.
- **CDK+SAM 로컬 테스트 순서** (소재: 조합 카드 L329-343, 즉답표 L700) → 순서 배열/빈칸("cdk synth 후 ___") 문항.
- **assertions fine-grained vs snapshot / fromStack vs fromString** (소재: ExamTip L671-675) → 대응 매칭 문항.
- **위임(축2 소관 커버리지 갭)**: 커리큘럼 4-4의 **SAM 고유 파트**(`AWS::Serverless::Function`·`sam build/package/deploy`·카나리/선형 배포 `AutoPublishAlias`+`DeploymentPreference`)는 이 파일에 부재. 축2가 "SAM 절반 통째 공백" 최우선 보충 후보로 지목했고 별도 `sam_guide` 담당 — **축1 채점 대상 아님, 커버리지는 축2/별도 파일로 위임**.

## 반복 약점 메모

- **L6 명시 역참조 부재**가 코퍼스 9개 연속 공통 감점(전부 1). 이 파일도 CloudFormation·Lambda·컨테이너를 반복 언급하면서도 "N-N장" 지목이 한 건도 없음. 생성 프롬프트에 "선행 챕터 개념을 재사용할 때는 서비스명 언급에 그치지 말고 챕터 번호+개념을 명시 지목하라"는 지시 강화 필요.
- 자체 강의번호(389/391/392/393) 크로스링크가 있어 표면상 연결돼 보이나 **동일 파일 내부 링크**라 L6 무효 — 코퍼스 공통 착시 패턴.

## 스키마 피드백 요약

- **cheatsheet/즉답표 구조**: `TabExam`의 map(신호→정답) + rank(출제 비중) 배열은 v0 스키마에 없던 "빈출도 랭킹 + 시나리오 즉답" 이중 구조. 축2도 `SCHEMA_FEEDBACK_AXIS2.md` 제안 기록함 — 축1 관점에서도 인출 문항 자동 생성용 소스로 유효(quiz seed 스키마 필드 제안).
- **빈출도 태그**(`Freq` n=1~3): 개념·명령·문항마다 부착돼 난이도/우선순위 신호 제공 — 향후 L7(난이도 분포) 채점 파일에서 활용 가능한 메타데이터.
