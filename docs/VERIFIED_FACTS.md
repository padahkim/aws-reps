# VERIFIED_FACTS — 검증 사실 캐시 (축2)

> RUBRIC §7-2 초기화 (2026-07-12), 캘리브레이션 검증분 반영 (2026-07-13, 축2 세션). 용도: F2 검증 시 **캐시 우선 조회** — 적중 시 재검색 금지(토큰 절약).
> 규칙: "검증됨" 등재는 MCP가 반환한 근거 URL 필수. 학습 지식과 문서 충돌 시 문서 우선. 같은 문서 세션 내 재조회 금지.
> 참고: 2026-07-13 검증분은 세션 MCP 클라이언트 단선으로 동일 AWS MCP 서버를 HTTP로 직접 호출해 수행 (도구·서버·반환 URL 동일).

| 서비스 | 주장 | 확인된 값 | 근거 URL | 확인일 |
|---|---|---|---|---|
| DynamoDB | 항목(Item) 최대 크기 | 400KB (속성명+값 포함) | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/CheatSheet.html · bp-use-s3-too.html | 2026-07-13 |
| DynamoDB | 400KB 초과 데이터 처리 패턴 | S3 저장 + DynamoDB에 메타/포인터 (공식 베스트 프랙티스) | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-use-s3-too.html | 2026-07-13 |
| DynamoDB | LSI 개수 한도 | 테이블당 최대 5개 | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ServiceQuotas.html | 2026-07-13 |
| DynamoDB | GSI 개수 한도 | 테이블당 기본 쿼터 20개 | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ServiceQuotas.html | 2026-07-13 |
| DynamoDB | RCU 정의 | 4KB 이하 항목: 강한 일관성 초당 1회 = 1 RCU, 최종 일관성 초당 2회 = 1 RCU | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/provisioned-capacity-mode.html | 2026-07-13 |
| DynamoDB | WCU 정의 | 1KB 이하 항목 초당 1회 쓰기 = 1 WCU | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/provisioned-capacity-mode.html | 2026-07-13 |
| DynamoDB | 트랜잭션 쓰기 용량 | 1KB 이하 쓰기 1회에 2 WCU (읽기·쓰기 2배 규칙의 공식 근거) | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/read-write-operations.html | 2026-07-13 |
| DynamoDB | 트랜잭션 액션 수 | 트랜잭션당 100 액션 지원 | https://aws.amazon.com/dynamodb/features/ | 2026-07-13 |
| DynamoDB | BatchWriteItem 한도 | 최대 25개 Put/Delete, 16MB | https://docs.aws.amazon.com/botocore/latest/reference/services/dynamodb/client/batch_write_item.html | 2026-07-13 |
| DynamoDB | BatchGetItem 한도 | 최대 100개 항목, 16MB | https://docs.aws.amazon.com/cli/latest/reference/dynamodb/batch-get-item.html | 2026-07-13 |
| DynamoDB | Query 결과 크기 | 호출당 1MB 페이지 (LastEvaluatedKey → ExclusiveStartKey로 페이지네이션) | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.Pagination.html | 2026-07-13 |
| DynamoDB | 파티션 키 값당 처리량 상한 | 3,000 RCU / 1,000 WCU 초과 시 스로틀 가능 | https://aws.amazon.com/blogs/database/choosing-the-right-dynamodb-partition-key/ | 2026-07-13 |
| DynamoDB | ⚠️ "물리 파티션당 약 10GB" | **현행 개발자 안내서에서 명시 문구 미발견 (확인 불가)**. 확인된 인접 사실: LSI 보유 테이블의 아이템 컬렉션 최대 10GB | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/LSI.html | 2026-07-13 |
| DynamoDB | ⚠️ TTL 삭제 시점 | **"만료 후 48시간 이내" 아님 — 현행: "만료 후 며칠 이내(within a few days)"**, 쓰기 처리량 미소모(무료) | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html | 2026-07-13 |
| DynamoDB | ⚠️ 용량 모드 전환 규칙 | **"24시간 1회" 아님 — 현행: 프로비저닝→온디맨드 24h 롤링 윈도우당 최대 4회, 온디맨드→프로비저닝 언제든** | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Constraints.html · provisioned-capacity-mode.html | 2026-07-13 |
| DynamoDB | Streams 보관 기간 | 24시간 (이후 트리밍 대상) | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.html | 2026-07-13 |
| DynamoDB | Kinesis Data Streams for DynamoDB 보존 | 기본 24시간, 최대 365일 (Kinesis 쪽 규칙) | https://docs.aws.amazon.com/streams/latest/dev/kinesis-extended-retention.html | 2026-07-13 |
| DynamoDB | DAX 캐시 기본 TTL | 항목 캐시·쿼리 캐시 각 5분 | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.cluster-management.html | 2026-07-13 |
| DynamoDB | DAX 클러스터 노드 수 | 최대 10노드 (프라이머리 1 + 읽기 복제본 최대 9) | https://aws.amazon.com/blogs/database/a-walkthrough-of-the-amazon-dynamodb-accelerator-console-part-2/ · DAX.concepts.cluster.html | 2026-07-13 |
| DynamoDB | PITR 복구 범위 | 최근 35일 내 초 단위 임의 시점 (보존 기간 1~35일 설정 가능), 프로비저닝 용량 미사용 | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html (Resilience 절) | 2026-07-13 |
| DynamoDB | GSI 용량 부족 시 영향 | GSI 쓰기 용량 부족 → 본 테이블 쓰기도 스로틀 | https://docs.aws.amazon.com/whitepapers/latest/comparing-dynamodb-and-hbase-for-nosql/global-secondary-index-considerations.html | 2026-07-13 |
| DynamoDB | 세밀 접근 제어 | dynamodb:LeadingKeys로 파티션 키=사용자 ID 항목만 허용 가능 | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/specifying-conditions.html | 2026-07-13 |
| DynamoDB | 글로벌 테이블 전제 | 복제본 추가 전 DynamoDB Streams 활성화 필요 (MREC 복제는 Streams 기반, 복제본에 기본 활성·비활성 불가) | https://aws.amazon.com/dynamodb/faqs/ · V2globaltables_HowItWorks.html | 2026-07-13 |
| DynamoDB | 저장 복제 범위 | 리전 내 여러(multiple) AZ에 자동 복제 (문서상 "3개" 명시 아님) | https://docs.aws.amazon.com/whitepapers/latest/big-data-analytics-options/amazon-dynamodb.html | 2026-07-13 |
| Lambda | SnapStart 지원 런타임 | Java 11+, Python 3.12+, .NET 8+ (그 외 관리형 런타임·OS 전용·컨테이너 이미지 미지원) | https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html | 2026-07-13 |
| Lambda | 메모리-CPU 비례 | CPU는 메모리에 선형 비례 할당, 1,769MB = 1 vCPU 상당 (128MB~10,240MB) | https://docs.aws.amazon.com/help-panel/lambda/latest/console/configuration-memory.html | 2026-07-13 |
| Lambda | Reserved Concurrency 요금 | 추가 요금 없음 ("incurs no additional charges"), 상한+하한 겸용 (전용 예약 + 초과 확장 방지) | https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html | 2026-07-13 |
| Lambda | Provisioned Concurrency 요금 | 추가 요금 발생 ("incurs additional charges"), 사전 초기화 실행 환경 — 콜드 스타트 지연 감소 | https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html | 2026-07-13 |
| API Gateway | 스테이지 캐싱 대상 | 캐시 활성화 시 GET 메서드에 메서드 수준 캐시 적용 (전용 캐시 인스턴스 프로비저닝) | https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-caching.html · help-panel rest-cache | 2026-07-13 |
| IAM | 정책 평가 로직 | 기본 암묵적 거부, 명시적 Deny는 Allow보다 항상 우선 ("Deny statement trumps the Allow statement") | https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic_AccessPolicyLanguage_Interplay.html | 2026-07-13 |
| IAM/SigV4 | 서명 오류 HTTP 코드 | 서명 불일치는 **HTTP 403 SignatureDoesNotMatch** (401 아님) | https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv-troubleshooting.html | 2026-07-13 |
| STS | 임시 자격증명 발급 | AssumeRole / AssumeRoleWithWebIdentity / AssumeRoleWithSAML / GetFederationToken / GetSessionToken — Credentials(키 쌍+세션 토큰) 반환 | https://aws.amazon.com/blogs/developer/using-credentials-from-aws-security-token-service/ | 2026-07-13 |
| SDK | 기본 자격증명 공급자 체인 | 환경 변수 → 공유 자격증명 파일(~/.aws/credentials) → (웹 자격증명 등) → IAM 롤 순 탐색 | https://docs.aws.amazon.com/sdk-for-cpp/latest/api/aws-cpp-sdk-core/html/md_docs_2_credentials___providers.html | 2026-07-13 |
| EC2 | 스팟 인스턴스 할인 | 온디맨드 대비 최대 90% 할인 | https://docs.aws.amazon.com/whitepapers/latest/run-semiconductor-workflows-on-aws/cost-optimization.html | 2026-07-13 |
| EBS | 볼륨-인스턴스 연결 제약 | 같은 AZ의 EC2 인스턴스에만 연결 가능 | https://docs.aws.amazon.com/help-panel/ebs/latest/ebs_console/AttachVolume.html | 2026-07-13 |
| 글로벌 인프라 | 리전당 AZ 수 | 모든 리전은 최소 3개의 격리된 AZ로 구성 | https://aws.amazon.com/s3/faqs/ (What is an AWS Region) | 2026-07-13 |
| SNS | 메시지 보관 | 미보관 — 구독자 없으면 폐기, 푸시 기반 팬아웃 (vs SQS 최대 14일 보관) | https://aws.amazon.com/blogs/compute/choosing-between-messaging-services-for-serverless-applications/ | 2026-07-13 |
| Kinesis | 보존·재생 | 샤드 = 도착 순서 append-only 로그, 기본 24시간~최대 365일 보존, 보존 기간 내 임의 지점부터 재읽기 가능 | https://aws.amazon.com/blogs/big-data/retaining-data-streams-up-to-one-year-with-amazon-kinesis-data-streams/ | 2026-07-13 |
| SQS | 가시성 타임아웃 | 수신된 메시지는 삭제 전까지 큐에 남고, 가시성 타임아웃 동안 다른 소비자에게 숨김 → 만료 시 재노출 | https://docs.aws.amazon.com/sdk-for-cpp/v1/developer-guide/examples-sqs-visibility-timeout.html | 2026-07-13 |
| EventBridge | 라우팅 모델 | 이벤트 버스의 규칙이 이벤트 패턴(메타데이터·데이터 필터)으로 매칭해 타깃 호출 | https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is-how-it-works-concepts.html | 2026-07-13 |
