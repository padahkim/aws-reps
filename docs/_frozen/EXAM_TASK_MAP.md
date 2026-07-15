# EXAM_TASK_MAP — DVA-C02 시험 가이드 Task ↔ 커리큘럼 챕터 매핑

> **축2 부트스트랩 산출물** (RUBRIC §7-2). 작성: 2026-07-12, 축2 세션. 모드: 레거시.
> 챕터 id는 RUBRIC §2 커리큘럼 요약 기준 (`docs/CURRICULUM.md` 부재 시점).
>
> **근거 — AWS MCP가 반환한 공식 시험 가이드** (현행 개정판: Amazon Q Developer·AI 관련 스킬이 채점 도메인에 포함된 버전):
> - 개요: https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02.html
> - Domain 1: https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html
> - Domain 2: https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain2.html
> - Domain 3: https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain3.html
> - Domain 4: https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain4.html
>
> 시험 메타 (개요 페이지 확인값): 도메인 비중 32/26/24/18% · 총 65문항(채점 50 + 비채점 15) · 130분 · 합격 720/1000 (스케일 100–1000). 비채점 "Emerging topics"(AI 보조 개발 등)는 점수 미반영.

## Task 매핑표

| Task | 동사 | 기술 키워드 (가이드 Skill에서 추출) | 담당 챕터 |
|---|---|---|---|
| 1.1 AWS 호스팅 앱 코드 개발 | 개발·작성·생성 | 아키텍처 패턴(이벤트 기반/MSA/모놀리식/코레오그래피/오케스트레이션/팬아웃), 유상태 vs 무상태, 강결합 vs 느슨한 결합, 동기 vs 비동기, 내결함·복원력 코드(재시도·서킷 브레이커·오류 처리), API 생성·확장(요청/응답 변환, 검증 규칙, 상태 코드 오버라이드), 단위 테스트(SAM), 메시징 코드, SDK/API 호출, 스트리밍 데이터 처리, EventBridge 이벤트 기반 패턴, Amazon Q Developer 활용 | 0-1(SDK·백오프), 1-4(API), 2-1~2-5(메시징·이벤트·스트리밍) · **Q Developer: 갭** |
| 1.2 Lambda 코드 개발 | 개발·구성·처리 | VPC 내 프라이빗 리소스 접근, 환경 변수·파라미터(메모리/동시성/타임아웃/런타임/핸들러/레이어/익스텐션/트리거/데스티네이션), 이벤트 수명 주기·오류 처리(Destinations·DLQ), 테스트 코드, 서비스 통합, 성능 튜닝, 준실시간 데이터 변환 | 1-2 |
| 1.3 데이터 스토어 활용 | 사용·정의·직렬화 | 고카디널리티 파티션 키, 일관성 모델(강한/최종), Query vs Scan, DynamoDB 키·인덱싱, 직렬화/역직렬화, 데이터 수명 주기, 캐싱 서비스, 접근 패턴별 특수 스토어(OpenSearch) | 1-3, 1-1(S3 수명 주기), 5-4(캐싱) · **OpenSearch: 갭** |
| 2.1 인증·인가 구현 | 구현·보호 | 페더레이션(Cognito·IAM), 베어러 토큰, 프로그래매틱 액세스, 인증된 API 호출, IAM 역할 수임(AssumeRole), 주체 권한 정의, 앱 수준 세분화 인가, MSA 교차 서비스 인증 | 0-2, 3-1 |
| 2.2 암호화 구현 | 구현·암복호화 | 저장/전송 중 암호화, 인증서 관리(ACM·Private CA), 클라이언트 vs 서버 측 암호화, 암호화 키 사용(KMS), 개발용 인증서·SSH 키, 교차 계정 암호화, 키 로테이션 | 3-2, 3-3(ACM) |
| 2.3 민감 데이터 관리 | 관리·보호·마스킹 | 데이터 분류(PII/PHI), 환경 변수 암호화, 시크릿 관리 서비스, 데이터 새니타이즈, 앱 수준 마스킹, 멀티테넌트 데이터 접근 패턴 | 3-3, 1-2(환경 변수) · **멀티테넌트 패턴: 부분 갭** |
| 3.1 배포 아티팩트 준비 | 준비·패키징 | 의존성 관리(환경 변수/구성 파일/컨테이너 이미지), 파일·디렉터리 구조, 코드 리포지토리, 리소스 요구사항(메모리/코어), 환경별 구성(AppConfig) | 4-1, 4-5 · **AppConfig: 갭** |
| 3.2 개발 환경 테스트 | 테스트 | 배포 코드 테스트, 통합 테스트·모킹, 개발 엔드포인트(API Gateway 스테이지), SAM 템플릿 스테이징 배포, 이벤트 기반 앱 테스트 | 1-4(스테이지), 4-4(SAM), 2단계(이벤트 테스트 관점) |
| 3.3 배포 테스트 자동화 | 자동화·생성 | 테스트 이벤트(JSON 페이로드: Lambda/API GW/SAM), API 리소스 다중 환경 배포, 승인 버전 환경(Lambda 별칭·이미지 태그·Amplify 브랜치·Copilot 환경), IaC 템플릿(SAM/CFN), 서비스별 환경 구분, Q Developer 테스트 생성 | 4-3, 4-4, 1-2(별칭), 1-4 · **Amplify·Copilot·Q Developer: 갭** |
| 3.4 CI/CD 코드 배포 | 배포·롤백·구성 | Lambda 배포 패키징, API GW 스테이지·커스텀 도메인, IaC 템플릿 갱신, 배포 전략(블루/그린·카나리·롤링), 커밋 트리거 빌드/테스트/배포, 오케스트레이션 워크플로, 롤백, 라벨·브랜치 버전 관리, 스테이지 변수 동적 배포 | 4-5, 4-2(배포 전략), 4-3, 4-4, 1-4, 1-2 |
| 4.1 근본 원인 분석 | 분석·디버깅 | 코드 디버깅, 지표·로그·트레이스 해석, 로그 쿼리(Insights), 커스텀 지표(EMF), 대시보드·인사이트, 배포 실패 로그, 서비스 통합 이슈 디버깅 | 5-1, 5-2, 4-5(배포 로그) |
| 4.2 관측성 계측 | 계측·구현 | 로깅 vs 모니터링 vs 관측성, 로깅 전략, 커스텀 지표 방출 코드, 트레이싱 어노테이션, 알림(쿼터·배포 완료), 트레이싱 구현(X-Ray), 구조화 로깅, 헬스체크·레디니스 프로브 | 5-1, 5-2 · **헬스체크/프로브: 부분 갭(4-0·4-1에 명시 필요)** |
| 4.3 애플리케이션 최적화 | 최적화·프로파일링 | 동시성 정의, 성능 프로파일링, 최소 메모리·컴퓨팅 산정, 구독 필터 정책(SNS), 요청 헤더 기반 캐싱(CloudFront), 앱 수준 캐싱, 리소스 사용 최적화, 병목 분석 | 1-2(동시성·메모리), 2-2(SNS 필터), 5-4(ElastiCache·CloudFront), 5-1 |

## 역인덱스 (챕터 → 담당 Task)

| 챕터 | 관련 Task |
|---|---|
| 0-1 AWS 기초 | 1.1, 2.1(프로그래매틱 액세스) |
| 0-2 IAM | 2.1 |
| 1-1 S3 | 1.3(수명 주기), 2.2(암호화 사례) |
| 1-2 Lambda | 1.2, 2.3(환경 변수), 3.3(별칭), 3.4(패키징), 4.3(동시성·메모리) |
| 1-3 DynamoDB | 1.3 |
| 1-4 API Gateway | 1.1(API), 3.2·3.3·3.4(스테이지·도메인), 4.3(캐싱) |
| 2-1 SQS / 2-2 SNS / 2-3 EventBridge / 2-4 Kinesis / 2-5 Step Functions | 1.1(메시징·이벤트·스트리밍·오케스트레이션), 3.2(이벤트 테스트), 4.3(필터 정책) |
| 3-1 Cognito | 2.1 |
| 3-2 KMS | 2.2 |
| 3-3 Secrets Manager·Parameter Store·ACM | 2.2, 2.3 |
| 4-0 컴퓨팅 기초 | 4.2(헬스체크) 보조 |
| 4-1 컨테이너 | 3.1(이미지), 3.3(이미지 태그) |
| 4-2 Beanstalk | 3.4(배포 전략) |
| 4-3 CloudFormation / 4-4 SAM·CDK | 3.2, 3.3, 3.4 (IaC·테스트 이벤트) |
| 4-5 CI/CD | 3.1, 3.4, 4.1(배포 실패 로그) |
| 5-1 CloudWatch / 5-2 X-Ray / 5-3 CloudTrail | 4.1, 4.2 |
| 5-4 ElastiCache·CloudFront | 1.3(캐싱), 4.3 |

## 커리큘럼 갭 보고 (무매핑·부분 매핑 키워드)

시험 가이드에는 있으나 RUBRIC §2 커리큘럼에 담당 챕터가 없는 항목 — 콘텐츠 평가와 별개로 커리큘럼 보강 검토 대상:

1. **Amazon Q Developer** (Skill 1.1.11, 3.3.6 — 채점 도메인 내) — 커리큘럼 전무
2. **Amazon OpenSearch Service** (Skill 1.3.9, 접근 패턴별 특수 데이터 스토어) — 커리큘럼 전무
3. **AWS AppConfig** (Skill 3.1.5, 환경별 앱 구성) — 커리큘럼 전무
4. **AWS Amplify 브랜치 · AWS Copilot 환경** (Skill 3.3.3) — 커리큘럼 전무
5. 부분 갭 (기존 챕터에 흡수 가능하나 명시 필요): 멀티테넌트 데이터 접근 패턴(2.3.6), 앱 헬스체크·레디니스 프로브(4.2.8), AWS Private CA(2.2.2), 서킷 브레이커 등 복원력 패턴 심화(1.1.13)
6. 참고: 비채점 Emerging topics(AI 보조 개발·AI 보안·AI 테스트/CI/CD/트러블슈팅/최적화 보조)는 점수 미반영이므로 갭으로 취급하지 않음
