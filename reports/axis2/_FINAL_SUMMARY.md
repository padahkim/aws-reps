# 축2 최종 종합 보고 — 사실·시험 정합성 검수 완료

> RUBRIC §7-5 완료 보고. 대상: 레거시 콘텐츠 27파일(원 22 + 사용자 추가 5). 평가 기간: 2026-07-12~2026-07-13. 모드: 레거시(전 파일).
> 방법: AWS MCP 서버(공식 문서 검색·읽기) 대조, URL 근거 없는 검증 무효 원칙 준수. 세션 MCP 클라이언트 단선 구간은 동일 서버 HTTP 직접 호출로 우회(도구·서버·반환 URL 동일).

## 1. 판정 분포

| 판정 | 파일 수 | 비율 |
|---|---|---|
| 통과 | 1 | 3.7% |
| 수정 | 26 | 96.3% |
| 재작성·제외 | 0 | 0% |

**해석**: "재작성·제외"가 0건이라는 것은 원본 콘텐츠의 기반 설계(구조·서술·시험 포인트 배치)가 전반적으로 견고했다는 뜻. 다만 "수정" 비율이 96%로 압도적인데, 그 내역을 뜯어보면 **사실 자체가 애초에 틀렸던 경우는 소수**이고 대다수는 **"제작 시점엔 맞았지만 이후 AWS가 사양을 바꾼" 시간차 오류**와 **단독 챕터 커버리지 기준 적용에 따른 누락**이다. 아래 §3·§4 참조.

유일한 "통과": `aws-dva-messaging.jsx`(SQS·SNS·Kinesis) — 사실 오류 0건, 담당 챕터 키워드 누락 0건.

## 2. 누락 Task 요약 (F1 커버리지 갭 — 보충 생성 목록 후보)

파일별 리포트에서 취합. 챕터 순.

| 챕터 | 누락 항목 | 근거 파일 |
|---|---|---|
| 0-1 AWS 기초 | 지수 백오프+Jitter, CLI 프로파일, CLI 페이지네이션(--page-size vs --max-items) | aws-dva-stage0 |
| 0-2 IAM | STS/AssumeRole 계열 API 전무, Condition 키 구체 예시 전무(한쪽 파일) | aws-dva-iam-guide-2 |
| 1-2 Lambda | VPC 프라이빗 리소스 접근(1.2 명시 키워드) 완전 누락 — 3개 파일 공통(lambda-dva-guide, lambda-dva-guide-2, lambda-dva-study) / Lambda Extensions, SAM 로컬 테스트, 준실시간 스트리밍 처리 | 3개 Lambda 파일 |
| 1-3 DynamoDB | 직렬화/역직렬화(1.3.5) | dynamodb-guide |
| 2-1·2-2·2-4 메시징 | KCL/KPL 용어 전무(한쪽 파일) | aws-messaging-visual-guide |
| 3-1 Cognito | User Pool 토큰 3종(ID/Access/Refresh) 개별 용도·수명 — 정의만 하고 실제 구분 안 다룸 | aws-cognito-guide |
| 3-2·3-3 보안 | ACM/Private CA 개념 블록 부재, 데이터 마스킹·멀티테넌트 패턴 없음 | aws-dva-security-guide-1 |
| 4-0 컴퓨팅 | 없음(오히려 "최소한" 규정 대비 상세) | — |
| 4-1 컨테이너 | 헬스체크·레디니스 프로브(EXAM_TASK_MAP이 4-0·4-1 "부분 갭"으로 명시한 항목) | aws-container-guide |
| **4-3·4-4 (SAM)** | **SAM 고유 콘텐츠(AWS::Serverless::* 리소스, sam build/package/deploy, 카나리 배포)가 두 파일 모두에 전무** — 커리큘럼 4-4가 "SAM+CDK 개요"로 명시하는데 실제로는 CDK 전용(aws-cdk-dva-guide)과 CloudFormation 전용(cloudformation-dva-guide)만 있고 SAM 자체 콘텐츠가 27파일 전체에 없음. **최우선 보충 생성 대상** | aws-cdk-dva-guide, cloudformation-dva-guide (교차 확인 완료, 갭 확정) |
| 4-3 CloudFormation | 드리프트 감지 전무, 중첩 스택 간접 언급뿐, 변경 세트 절차 표면 커버 | cloudformation-dva-guide |
| 4-2 Beanstalk | Enhanced Health Reporting 구분, 플랫폼 브랜치·버전·관리형 업데이트 | aws-elastic-beanstalk-guide |
| 5-1 CloudWatch | **EMF(Embedded Metric Format) 완전 누락** — RUBRIC §2가 5-1 필수 요소로 명시, Task 4.1 키워드에도 명시. 대시보드 위젯·자동화도 표면 커버 | aws-dva-monitoring |
| 5-4 RDS/ElastiCache | CloudFront(챕터 정의에 명시된 "CloudFront 요점")가 파일 전체에 전무 | aws-dva-rds-aurora-elasticache |

**커리큘럼 자체 공백** (EXAM_TASK_MAP 부트스트랩 단계에서 이미 보고, 이번 평가로 재확인): Amazon Q Developer(채점 도메인 포함), Amazon OpenSearch Service, AWS AppConfig, AWS Amplify·Copilot(Copilot은 게다가 2026-06-12부로 End-of-Support 확인됨 — 신규 채택 자체가 부적절).

## 3. 반복된 사실 오류 패턴 — "제작 후 AWS가 사양을 바꿈"

27파일 평가 전체에서 **18건 이상**의 이 패턴이 확인됨. 전부 시험 포인트·정답 근거·비교표 자리에 위치해 있어, 그대로 학습하면 시험에서 손해를 보는 항목들. 발견 순.

| 서비스 | 콘텐츠의 서술 | 현행 사실 | 파급도 |
|---|---|---|---|
| S3 | 객체 최대 5TB | **최대 50TB** | 높음 — 2개 파일, 시험 포인트 콜아웃 |
| DynamoDB | TTL 삭제 "48시간 이내" | "며칠 이내(within a few days)" | 중간 |
| DynamoDB | 용량 모드 전환 "24h 1회" | 프로비저닝→온디맨드 24h당 최대 4회, 역방향 언제든 | 중간 |
| IAM/SigV4 | 서명 오류 = HTTP 401 | **HTTP 403** SignatureDoesNotMatch | 중간 |
| API Gateway | 통합 타임아웃 "최대 29초"(절대) | 기본 29초, 리전·프라이빗 REST는 쿼터 증가로 초과 가능(2024-06) | 낮음 |
| API Gateway | 로그 레벨 "ERROR/INFO/DEBUG" | Off/Errors only/Errors and info (**DEBUG 없음**) | 낮음 — 2개 파일 공통 |
| Lambda | 메모리-CPU 환산 "1,792MB=1vCPU" | **1,769MB**=1vCPU | 낮음(오타성) |
| Lambda | SQS ESM 스케일링 "분당 60개·최대 1,000" | 5개 시작→분당 최대 300개 추가→최대 1,250 | 중간 |
| Lambda | Lambda@Edge "5~10초/1MB~50MB" | 통합 최대 30초/50MB(구세대 viewer 제한 통합됨) | 낮음 |
| Lambda | 비동기 페이로드 "256KB"(SQS 한도와 혼동) | **1MB** | 중간 — 퀴즈 정답 근처 |
| KMS | FIPS 인증 "Level 2" | **Level 3**(2023-05부터, CloudHSM과 동급) | **높음** — "KMS vs CloudHSM" 시험 구분 근거 자체가 반대로 서술됨 |
| KMS | 대칭 쿼터 "5,500/10,000/30,000" | **5,500/10,000/50,000** | 낮음 |
| RDS/Aurora | Multi-AZ 스탠바이 "접근 불가"(예외 없이 단정) | 2-스탠바이(DB 클러스터) 구성은 readable standby | 중간 |
| Aurora | 성능 "MySQL 5배·PostgreSQL 3배" | **양쪽 다 최대 6배**로 통일 | 중간 |
| VPC | "VPN·DX로는 엔드포인트 접근 불가"(일반화) | 게이트웨이 엔드포인트만 불가, 인터페이스(PrivateLink)는 가능 | 중간 |
| CloudWatch | StorageResolution "1·5·10·30초 게시 가능" | 게시값은 1 또는 60뿐(1·5·10·30은 조회 period) — **개념 혼동** | 중간 |
| CloudWatch | 고해상도 경보 주기 "10·30초만" | 10·20·30초(20초 옵션 누락) | 낮음 |
| EBS | gp3 볼륨 "최대 16,000 IOPS" | **최대 80,000 IOPS** — 뒤따르는 "32,000 넘으면 io1/io2로" 판단 로직 자체가 붕괴 | 높음 |
| EFS | Elastic 처리량 "읽기 3GB/s·쓰기 1GB/s" | 현행 20~60GiBps/1~5GiBps로 대폭 상향 | 낮음 |
| ELB | NLB "프리 티어 미포함" | 프리 티어 존재(750h+15LCU) | 낮음 |
| **CodeCommit** | **"2024-07-25부로 신규 고객 제공 중단"** | **2025-11-24부로 GA 복귀(재개방)** | **높음** — 2개 파일이 독립적으로 동일하게 틀림, RUBRIC이 사전 경고한 최우선 검증 항목 그대로 적중 |
| CodeDeploy | appspec 훅 순서에 DownloadBundle 누락 | 공식 7단계 중 하나 빠짐 | 낮음 |
| ECS | IAM 역할 담당 서술이 **파일 내부에서 자기모순**(앞부분: EC2 Instance Profile이 ECR pull·로그 담당 / 뒷부분: 정확히 Task Execution Role로 서술) | Task Execution Role이 정답(EC2·Fargate 공통) | 높음 — 시험 포인트 콜아웃 내부에 있음 |
| AWS Copilot | 현재도 권장 도구로 서술 | **2026-06-12 End-of-Support**(평가일 이전에 이미 경과) | 중간 — 최신성 |
| Beanstalk | "배포 정책 6종" | 공식 5종 + Blue/Green은 별도 전략(정책 아님) — 콘텐츠 자체 내부에서도 모순 | 중간 |
| CDK | bootstrap 산출물 "S3 버킷+IAM 역할" | 실제로 **ECR 리포지토리** 포함 + IAM 역할 5종 | 낮음 |

**패턴에서 읽을 수 있는 것**: 콘텐츠 제작 시점이 비슷한 시기(생성 주석에 opus 4.8 / fable 5 등 표기)라 사양 변경의 "동시대 스냅샷" 성격이 강함. 특히 **KMS FIPS 레벨**과 **EBS gp3 IOPS**, **CodeCommit 단종 철회**, **ECS IAM 역할 자기모순** 4건은 그 자체로 시험 정답 로직을 뒤집을 수 있는 **높음** 등급 오류로, 우선 수정 대상.

## 4. 스키마 피드백 요약

`docs/SCHEMA_FEEDBACK_AXIS2.md`에 **44건** 누적. 반복 재현되어 스키마 v1 후보로 우선순위가 높은 패턴:

- **`examFrequency`(빈출도 1~5)**: 최소 8개 파일이 독자적으로 유사 구조 자체 구현 — 가장 강한 재현성
- **결정표(decisionTable / scenario→answer 매핑)**: 4개 이상 파일에서 재현, DVA 문제 형식(시나리오→서비스 선택)과 1:1 대응
- **선택지별 해설(`choiceExplanations`)**: dva-chapter-template — 오답 조건화(축1 L2 앵커)에 직결
- **인출 카드(`retrievalCards`)·자유 서술형 퀴즈(`type: recall`)**: dva-chapter-template, lambda-dva-study — 4지선다 강제 시 정보 손실
- **비교표(`comparisonTable`)**: security-guide-1 등 다수 — "두 서비스 중 고르기" 문제 대비
- **인터랙티브 시뮬레이터/데모**: 슬라이더(동시성·가중치), 클릭형 다이어그램, 롤링/배치 데모 — 정적 md로 표현 불가능한 학습 장치 다수(인간 판단 필요, 렌더러 복잡도 트레이드오프)

## 5. 폐기 문항 (F4)

퀴즈 성분이 있는 파일은 **2개뿐**(dva-chapter-template, lambda-dva-study — 나머지 25개는 F4 N/A). **폐기 문항 0건** — 두 파일의 퀴즈(각 2문항·10문항, 합계 12문항) 전부 정답·해설의 사실 검증을 통과. 레거시 콘텐츠의 퀴즈 성분 자체가 희소하다는 것이 축1로 넘어갈 때 가장 큰 실질적 이슈(N/A 처리 다수 예상).

## 6. 검증 통계 총계

- **VERIFIED_FACTS 캐시**: 231행 (전부 AWS 공식 문서 URL 근거)
- **SCHEMA_FEEDBACK 제안**: 44건
- **평가 파일**: 27/27 (원 22 + beanstalk·cloudformation·cdk·container·monitoring 5건 추가 임포트, 전부 md5 대조 후 무수정 임포트)
- **중복 쌍 처리**: 사용자 결정(2026-07-13)에 따라 6개 중복 쌍(S3·API GW·Lambda·IAM·메시징·CI/CD) 전부 개별 정식 평가, 컬 0건
- **VPC 특수 케이스**: 매핑 챕터 없음(F1 N/A), F2만으로 판정 — 시험 가이드가 VPC 네트워크 설계를 out-of-scope로 명시하나 사용자 결정으로 평가는 유지

## 7. 다음 단계 (인간 결정 사항)

1. **스키마 v1 확정** — §4의 재현성 높은 제안(examFrequency, decisionTable, choiceExplanations 등) 검토 후 확정
2. **축1(학습 설계) 세션 가동** — 이 리포트들을 입력으로 챕터 배치 워크트리(`.claude/worktrees/session-prompt-file-932b42`)에서 진행
3. **§3 "높음" 등급 4건 우선 수정** — KMS FIPS 레벨, EBS gp3 IOPS, CodeCommit 단종 철회, ECS IAM 자기모순
4. **SAM 콘텐츠 신규 생성** — 4-3·4-4 커리큘럼 갭, 현재 27파일 어디에도 없음
5. **develop 브랜치 머지** — RUBRIC §6(수정됨, main→develop)에 따라 eval/axis2를 develop에 병합

## 커밋 이력 (eval/axis2)
```
578afe2 콘텐츠 22파일 임포트
e989b87 EXAM_TASK_MAP·VERIFIED_FACTS 부트스트랩
d86c39c 캘리브레이션 검증 사실
33c6789 캘리브레이션 리포트 3건
e911b94 beanstalk·cloudformation 임포트
4301f99 배치1 S3 쌍
ac03257 RUBRIC §6 정정(main→develop, 소유자 지시)
661b127 배치2 API GW 쌍
519cc0f/12ba871 진행 스냅샷
54f2816 cdk·container·monitoring 임포트
7c4279d 배치3 Lambda 쌍
402478d 배치4 IAM 쌍
e4e1ce5 wave1(배치5·6·9·13: 보안·메시징·RDS+VPC·모니터링)
19145e3 wave2(배치7·8·10·12: CI/CD·EC2+ELB·lambda연습·컨테이너+CDK)
f7e8687 배치11 beanstalk+cloudformation
```
