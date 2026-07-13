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
| S3 | ⚠️ 객체 최대 크기 | **5TB 아님 — 현행 최대 50TB** (멀티파트 5MB~50TB 지원). 단일 PUT 최대 5GB·콘솔 단일 업로드 160GB | https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html · https://aws.amazon.com/s3/faqs/ | 2026-07-13 |
| S3 | 멀티파트 권장 경계 | 100MB 초과 객체는 멀티파트 권장 ("should consider") | https://aws.amazon.com/s3/faqs/ | 2026-07-13 |
| S3 | 버킷 이름 규칙 | 3~63자·소문자/숫자/마침표/하이픈만·시작과 끝은 문자/숫자·마침표 연속 불가·IP 형식 불가·예약 접두/접미사 존재 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html | 2026-07-13 |
| S3 | 버킷 이름 고유성 | 기본 글로벌 네임스페이스는 계정 불문 고유. ⚠️ 신기능: account regional namespace(계정·리전 스코프 이름) 등장 | https://aws.amazon.com/blogs/aws/introducing-account-regional-namespaces-for-amazon-s3-general-purpose-buckets/ · bucketnamingrules.html | 2026-07-13 |
| S3 | 폴더 개념 | 실제 계층 없음(flat structure) — key name prefix로 계층 유추, 콘솔이 폴더처럼 표시 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html | 2026-07-13 |
| S3 | 버전 관리 | 활성화 이전 객체 버전 ID = null / suspend해도 기존 버전 유지 / 한 번 활성화하면 unversioned 복귀 불가 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html | 2026-07-13 |
| S3 | 복제 전제 | 원본·대상 버킷 모두 버전 관리 활성화 + S3에 복제 권한(IAM 역할) 필요 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-requirements.html | 2026-07-13 |
| S3 | 복제 제외 | 체이닝 미복제(다른 규칙이 만든 복제본은 재복제 안 됨 → Batch Replication) / 버전 ID 지정 삭제 미복제 / 삭제 마커 복제는 옵션(신형 구성 기본 꺼짐) | https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-what-is-isnot-replicated.html | 2026-07-13 |
| S3 | 스토리지 클래스 내구성·가용성 | 전 클래스 내구성 11-nine / 가용성: Standard 99.99·IA/IT/GIR 99.9·One Zone-IA 99.5·GFR/GDA 99.99(복원 후) | https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html | 2026-07-13 |
| S3 | 최소 저장 기간·최소 과금 크기 | Standard-IA·One Zone-IA 30일 / GIR·GFR 90일 / GDA 180일. 최소 과금 128KB(IA·OZ-IA·GIR), IT는 128KB 미만 모니터링 제외 | storage-class-intro.html | 2026-07-13 |
| S3 | Glacier 복원 시간 | GFR: Expedited 1–5분(250MB 미만)·Standard 3–5h·Bulk 5–12h(무료) / GDA: Standard 12h 내·Bulk 48h 내·Expedited 미지원 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/restoring-objects-retrieval-options.html | 2026-07-13 |
| S3 | 기준 성능 | prefix당 초당 최소 3,500 PUT/COPY/POST/DELETE·5,500 GET/HEAD, prefix 수 제한 없음 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html | 2026-07-13 |
| S3 | Byte-Range Fetch | Range 헤더로 부분 GET·동시 연결로 집계 처리량 향상·재시도 시간 개선 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance-guidelines.html | 2026-07-13 |
| S3 | Transfer Acceleration | CloudFront 엣지 로케이션 경유 → AWS 백본으로 버킷 전송, PUT·GET 모두 s3-accelerate 엔드포인트 사용 | https://aws.amazon.com/s3/faqs/ · https://docs.aws.amazon.com/whitepapers/latest/s3-optimizing-performance-best-practices/using-amazon-s3-transfer-acceleration-to-accelerate-geographically-disparate-data-transfers.html | 2026-07-13 |
| S3 | 프리사인 URL 만료 | 콘솔 최대 12시간 / CLI `--expires-in` 기본 3600초·최대 604800초(7일) / IAM 사용자 SigV4 최대 7일 (자격 증명 유형별 상한 상이) | https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html · https://docs.aws.amazon.com/cli/latest/reference/s3/presign.html · https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html | 2026-07-13 |
| S3 | 프리사인 URL 권한 | 접근 성공하려면 해당 작업 권한을 가진 주체가 생성해야 함(생성자 권한 기반) | using-presigned-url.html | 2026-07-13 |
| S3 | 기본 암호화 | 2023-01-05부터 모든 신규 객체 업로드 SSE-S3 자동 적용(무료·성능 영향 없음). 기존 미암호화 버킷에도 기본 구성 적용, 기존 객체는 소급 안 됨 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingServerSideEncryption.html · https://docs.aws.amazon.com/AmazonS3/latest/userguide/default-encryption-faq.html | 2026-07-13 |
| S3 | SSE 헤더 값 | `x-amz-server-side-encryption`: AES256(SSE-S3) / aws:kms(SSE-KMS) / aws:kms:dsse(DSSE-KMS) — DSSE 값은 공식 정책 예시로 확인 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingDSSEncryption.html | 2026-07-13 |
| S3 | DSSE-KMS | AES-256 이중 계층·SSE-KMS 대비 고비용·S3 Bucket Key 미지원·2023-06 출시 | UsingDSSEncryption.html · https://aws.amazon.com/blogs/aws/new-amazon-s3-dual-layer-server-side-encryption-with-keys-stored-in-aws-key-management-service-dsse-kms/ | 2026-07-13 |
| S3 | SSE-C | HTTPS 필수(HTTP 요청 거부)·S3는 키 미저장(매 요청 키 전달)·콘솔 미지원. ⚠️ 2026-04부터 신규 버킷 기본 차단 — PutBucketEncryption(BlockedEncryptionTypes=NONE)로 명시 활성화 필요 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/ServerSideEncryptionCustomerKeys.html | 2026-07-13 |
| S3/KMS | SSE-KMS 쿼터 소모 | 업로드 시 GenerateDataKey·다운로드 시 Decrypt 호출이 계정의 KMS 대칭 쿼터 소모 → 스로틀 가능. ⚠️ "5,500~30,000/s" 범위는 현행 문서 미기재(리전·키 유형별 상이, 예시 10,000/s)·쿼터 조정 가능 | https://docs.aws.amazon.com/kms/latest/developerguide/requests-per-second.html | 2026-07-13 |
| S3 | S3 Bucket Key | SSE-KMS의 KMS 요청 비용 최대 99% 감소(버킷 수준 키) | https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-key.html | 2026-07-13 |
| S3 | HTTPS 강제 | 버킷 정책에서 aws:SecureTransport 조건으로 HTTP 거부 — 공식 예시 존재 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html | 2026-07-13 |
| S3 | ⚠️ "버킷 정책이 기본 암호화보다 먼저 평가" | **현행 문서에서 평가 순서 서술 미발견 (확인 불가)**. 확인된 인접 사실: 암호화 헤더 불일치 PUT을 버킷 정책 Deny로 강제하는 공식 패턴 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html | 2026-07-13 |
| S3 | CORS 처리 | preflight(OPTIONS) 수신 시 요청받은 버킷의 CORS 구성에서 첫 매칭 CORSRule 적용 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/testing-cors.html | 2026-07-13 |
| S3 | MFA Delete | 루트 사용자만 버전 영구 삭제·버전 관리 구성 변경 가능, CLI/API로만 설정(콘솔 불가), 버전 관리 전제 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingMFADelete.html · https://aws.amazon.com/blogs/security/securing-access-to-aws-using-mfa-part-3/ | 2026-07-13 |
| S3 | 액세스 로그 | 대상 버킷은 같은 리전·같은 계정 필수 / 소스 버킷 자신 지정 시 무한 루프(비권장) / Object Lock·Requester Pays 버킷 대상 불가 / 로깅 서비스 주체 logging.s3.amazonaws.com | https://docs.aws.amazon.com/AmazonS3/latest/userguide/enable-server-access-logging.html | 2026-07-13 |
| S3 | Analytics(클래스 분석) | Standard→Standard-IA 추천만 제공 / 콘솔 표시까지 24~48시간·매일 갱신 / 관찰 기간 30일+ / 필터 버킷당 최대 1,000개 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/analytics-storage-class.html | 2026-07-13 |
| S3 | 수명 주기 | AbortIncompleteMultipartUpload 액션으로 미완료 멀티파트 자동 정리(공식 베스트 프랙티스) | https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpu-abort-incomplete-mpu-lifecycle-config.html | 2026-07-13 |
| S3 | 이벤트 알림 | 대상 4종(SNS/SQS/Lambda/EventBridge)·SQS FIFO 직접 미지원(EventBridge 경유)·at-least-once·보통 수초, 간혹 1분+ | https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventNotifications.html | 2026-07-13 |
| S3 | 이벤트 대상 권한 | IAM 역할이 아니라 대상 리소스 정책(SNS 토픽/SQS 큐 정책)에 S3 허용 부착 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/grant-destinations-permissions-to-s3.html | 2026-07-13 |
| S3 | 이벤트 필터 | 객체 키 prefix/suffix 필터링 지원 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-how-to-filtering.html | 2026-07-13 |
| S3 | EventBridge 통합 | S3 이벤트 직접 수신·콘텐츠 필터링·18개 서비스 타깃·아카이브/재생 (2021-11 직접 통합) | https://aws.amazon.com/blogs/compute/icymi-serverless-q4-2021/ | 2026-07-13 |
| S3 | Block Public Access | 4개 설정 — AP/버킷/계정 단위 적용(조직 수준은 all-or-none) | https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html | 2026-07-13 |
| S3 | 객체 태그 | 객체당 최대 10개(키 유니크)·키 128자/값 256자 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/tagging-managing.html | 2026-07-13 |
| S3 | 사용자 정의 메타데이터 | x-amz-meta- 접두사 필수(REST)·업로드 후 수정 불가(복사로만 변경) | https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingMetadata.html | 2026-07-13 |
| S3 | ⚠️ 메타데이터 검색 | "태그/메타로 검색 불가·외부 인덱스 유일" 서술은 최신화 필요 — 신기능 S3 Metadata가 쿼리 가능한 Iceberg 메타데이터 테이블 제공(목록 API 자체의 태그/메타 필터는 여전히 없음) | https://docs.aws.amazon.com/AmazonS3/latest/userguide/metadata-tables-overview.html | 2026-07-13 |
| S3 | 웹사이트 엔드포인트 | 2형식: `bucket.s3-website-Region.amazonaws.com`(대시) / `bucket.s3-website.Region.amazonaws.com`(점). 공개하려면 콘텐츠 퍼블릭 읽기 필요 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteEndpoints.html | 2026-07-13 |
| S3 | 액세스 포인트 | Network origin(Internet/VPC) 보유·VPC origin은 지정 VPC 외 요청 거부(Gateway/Interface VPC 엔드포인트 사용) | https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-points-vpc.html | 2026-07-13 |
| S3 | Object Lambda | OLAP는 표준 액세스 포인트 1개에 연결·표준 GET/HEAD/LIST 출력을 Lambda로 변환해 반환 | https://aws.amazon.com/s3/features/object-lambda/ · https://aws.amazon.com/blogs/storage/modify-images-cached-in-amazon-cloudfront-using-amazon-s3-object-lambda/ | 2026-07-13 |
| IAM | 동일 계정 평가(합집합) | 동일 계정에서 자격 증명 기반+리소스 기반 정책 권한의 합집합 평가 — 어느 한쪽 Allow면 허용(명시적 Deny 없을 때) | https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html | 2026-07-13 |
| API Gateway | ⚠️ 통합 타임아웃 | **"최대 29초" 아님 — 현행: 기본 29초(50~29,000ms 설정), Regional·프라이빗 REST API는 서비스 쿼터 증가로 29초 초과 가능(계정 스로틀 감축 조건부, 2024-06~)**. 초과 시 504 | https://docs.aws.amazon.com/help-panel/apigateway/latest/console/rest-timeout.html · https://aws.amazon.com/blogs/compute/serverless-icymi-q2-2024/ | 2026-07-13 |
| API Gateway | 계정 스로틀 기본 한도 | 리전당 계정 10,000 RPS(HTTP/REST/WebSocket 합산) + 버스트 토큰 버킷 최대 5,000, 상향 가능. 일부 리전 기본 2,500/1,250, 버스트는 고객 조정 불가 | https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html | 2026-07-13 |
| API Gateway | 캐시 TTL·용량 | 기본 TTL 300초·최대 3,600초·TTL=0은 비활성 / 용량 0.5~237GB(0.5/1.6/6.1/13.5/28.4/58.2/118/237) / 캐시 가능 응답 최대 1MB / 시간당 과금·프리 티어 제외 | https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-caching.html · https://docs.aws.amazon.com/sdk-for-cpp/latest/api/aws-cpp-sdk-apigateway/html/_cache_cluster_size_8h_source.html | 2026-07-13 |
| API Gateway | 캐시 무효화 | 클라이언트 `Cache-Control: max-age=0` + IAM `execute-api:InvalidateCache` 필요. 정책/Require authorization 미강제 시 아무 클라이언트나 무효화 가능. 교차 계정 무효화 미지원 | api-gateway-caching.html | 2026-07-13 |
| API Gateway | Lambda 프록시 응답 형식 | {isBase64Encoded, statusCode, headers, multiValueHeaders, body} 강제. 함수가 오류/잘못된 형식 반환 시 502, Lambda API가 호출 거부 시 500 | https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html · https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway-errors.html | 2026-07-13 |
| API Gateway | ⚠️ 스테이지 변수 전달 경로 | **"Lambda context 객체" 아님 — 프록시 통합 이벤트(event)의 `stageVariables` 필드로 전달**, 비프록시는 매핑 템플릿 `$stageVariables` 참조 | set-up-lambda-proxy-integrations.html (Input format) | 2026-07-13 |
| API Gateway | 엔드포인트 유형 | Edge-Optimized가 REST API 기본값(CloudFront POP 경유), Regional=동일 리전(자체 CloudFront 결합 패턴), Private=인터페이스 VPC 엔드포인트(ENI) 전용 | https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html | 2026-07-13 |
| API Gateway | 커스텀 도메인 인증서 리전 | Edge-Optimized=us-east-1 ACM 필수, Regional=API와 같은 리전 ACM | https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-regional-api-custom-domain-migrate.html | 2026-07-13 |
| API Gateway | REST vs HTTP API 기능 차이 | HTTP API 미지원: 캐싱·요청 검증·바디 변환(VTL)·X-Ray·실행 로그·API 키/사용량 계획·리소스 정책·WAF·Edge/Private 엔드포인트·카나리·MOCK. **HTTP API도 IAM·Lambda Authorizer 지원**(+JWT 네이티브, REST는 JWT 네이티브 미지원). AWS 서비스 통합은 양쪽 지원 | https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html | 2026-07-13 |
| API Gateway | 게이트웨이 응답 코드 | ACCESS_DENIED·WAF_FILTERED·INVALID_API_KEY=403 / THROTTLED·QUOTA_EXCEEDED=429 / INTEGRATION_FAILURE·INTEGRATION_TIMEOUT=504 / UNAUTHORIZED=401 / REQUEST_TOO_LARGE=413(기본 메시지 10,485,760바이트=페이로드 10MB 한도) / BAD_REQUEST_PARAMETERS·BODY=400. 503은 응답 유형에 없음 | https://docs.aws.amazon.com/apigateway/latest/developerguide/supported-gateway-response-types.html | 2026-07-13 |
| API Gateway | ⚠️ 실행 로깅 레벨 | **"ERROR/DEBUG/INFO" 아님 — Off / Errors only / Errors and info** (+요청·응답 본문은 별도 Data tracing 토글, 민감 데이터 주의). 액세스 로그는 $context 변수·CLF/JSON/XML/CSV 커스텀 형식 | https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-logging.html | 2026-07-13 |
| API Gateway | 지표 정의 | Latency=클라이언트 요청 수신→응답 반환 전체(통합 지연+오버헤드 포함), IntegrationLatency=백엔드 전달→응답 수신. 지표: Count·4XXError·5XXError·CacheHitCount·CacheMissCount | https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.RestApiBase.html · https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/appinsights-metrics-api-gateway.html | 2026-07-13 |
| API Gateway | 카나리 배포 | percentTraffic 0.0~100.0 / stageVariableOverrides로 카나리 전용 스테이지 변수 / 로그·지표 별도 생성(실행 로그 그룹 …/Canary 접미) / Promote canary로 승격 | https://docs.aws.amazon.com/apigateway/latest/developerguide/canary-release.html · https://docs.aws.amazon.com/apigateway/latest/api/API_DeploymentCanarySettings.html | 2026-07-13 |
| API Gateway | 사용 계획·API 키 | 스로틀(rate·burst)+쿼터(period=DAY/WEEK/MONTH), API 키는 X-API-Key 헤더(HEADER 소스). 공식 경고: API 키를 인증/인가 수단으로 사용 금지 | https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html · https://docs.aws.amazon.com/apigateway/latest/api/API_QuotaSettings.html | 2026-07-13 |
| API Gateway | Lambda Authorizer | TOKEN(베어러 토큰)/REQUEST(헤더·쿼리·스테이지 변수·컨텍스트) 2유형, IAM 정책+principalId 반환, 결과 캐시 기본 TTL 300초·최대 3,600초(0=비활성) | https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html · https://docs.aws.amazon.com/sdk-for-ruby/v3/api/Aws/APIGateway/Types/CreateAuthorizerRequest.html | 2026-07-13 |
| API Gateway | 요청 검증 | 백엔드 호출 전 모델(JSON Schema)·필수 파라미터 검사, 불일치 시 400 Bad Request. OpenAPI 확장 x-amazon-apigateway-request-validators로 정의 가능 | https://docs.aws.amazon.com/whitepapers/latest/security-overview-amazon-api-gateway/security-design-principles.html · https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-swagger-extensions-request-validators.html | 2026-07-13 |
| API Gateway | CORS 프록시 통합 | Lambda/HTTP 프록시 통합은 통합 응답을 만들지 않으므로 **백엔드가 Access-Control-Allow-Origin/-Methods/-Headers 직접 반환** 책임. 콘솔 CORS 설정은 OPTIONS 메서드 생성 | https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html | 2026-07-13 |
| API Gateway | 리소스 정책 용례 | aws:SourceVpc/aws:SourceVpce 조건으로 VPC·VPC 엔드포인트 제한(Private API 필수 구성), 타 계정 VPC 엔드포인트 허용 가능(교차 계정) | https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-api-create.html | 2026-07-13 |
| API Gateway | 배포·롤백 | 배포 이력 저장 — 스테이지를 이전 배포로 롤백 가능. 변경은 스테이지 배포 전 미반영 | https://aws.amazon.com/api-gateway/faqs/ | 2026-07-13 |
| API Gateway | WebSocket @connections | POST=클라이언트로 전송·GET=연결 상태·DELETE=연결 종료, SigV4 서명 필수, IAM 액션 execute-api:ManageConnections | https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-how-to-call-websocket-api-connections.html · apigateway-websocket-control-access-iam.html | 2026-07-13 |
| API Gateway | WebSocket 라우트 | 사전 정의 $connect/$disconnect/$default 3종 + route selection expression(JSON 속성 평가, 예: $request.body.action), 비JSON·미매칭은 $default | https://docs.aws.amazon.com/apigateway/latest/developerguide/websocket-api-develop-routes.html | 2026-07-13 |
| API Gateway | MOCK 통합·SDK 생성 | MOCK=백엔드 없이 API Gateway가 직접 응답 생성(REST 전용) / SDK 생성 지원: Java·JavaScript·Android·iOS(ObjC/Swift)·Ruby | https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-mock-integration.html · how-to-generate-sdk.html | 2026-07-13 |
| Lambda | 계정 동시성 기본값 | 리전당 계정 기본 1,000(소프트 리밋), 함수별 예약 최대 900 | https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html · gettingstarted-limits.html | 2026-07-13 |
| Lambda | ⚠️ 동시성 스케일링 규칙(현행) | **"버스트 500~3000 후 분당 500" 구식 — 현행: 함수별로 10초마다 최대 1,000개 실행 환경(=10초마다 요청 10,000개) 추가 가능**, 리전·함수 단위 | https://docs.aws.amazon.com/lambda/latest/dg/scaling-behavior.html | 2026-07-13 |
| Lambda | 메모리 128MB~10,240MB, 1MB 단위 | 1,769MB=1vCPU(선형 비례) — ⚠️ "1,792MB" 아님, 정확히 1,769MB | https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html | 2026-07-13 |
| Lambda | 타임아웃 | 기본 3초, 최대 900초(15분) | https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html | 2026-07-13 |
| Lambda | /tmp 스토리지 | 512MB(기본)~10,240MB, 1MB 단위 | gettingstarted-limits.html | 2026-07-13 |
| Lambda | 환경 변수 총량 | 4KB(전체 합산) | gettingstarted-limits.html | 2026-07-13 |
| Lambda | 레이어 한도 | 함수당 최대 5개, 함수+레이어 압축해제 합산 250MB | gettingstarted-limits.html | 2026-07-13 |
| Lambda | 배포 패키지 크기 | zip 50MB(콘솔·API 업로드 공통) / 압축해제(레이어 포함) 250MB / 컨테이너 이미지 10GB | gettingstarted-limits.html | 2026-07-13 |
| Lambda | 리소스 기반 정책 크기 | 20KB | gettingstarted-limits.html | 2026-07-13 |
| Lambda | 호출 페이로드 크기 | 동기 요청·응답 각 6MB / 스트리밍 응답 200MB / 비동기 1MB | gettingstarted-limits.html | 2026-07-13 |
| Lambda | 비동기 재시도 정책 | 기본 2회 재시도(총 3회 시도), 1차 재시도 전 1분·2차 재시도 전 2분 대기. 스로틀·시스템 오류는 최대 6시간 큐 보관 후 지수 백오프 재시도 | https://docs.aws.amazon.com/lambda/latest/dg/invocation-async-error-handling.html · invocation-async-configuring.html | 2026-07-13 |
| Lambda | SQS 이벤트 소스 매핑 가시성 타임아웃 권장 | 함수 타임아웃의 최소 6배 | https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-configure.html | 2026-07-13 |
| Lambda | ⚠️ SQS Standard ESM 스케일링(현행) | **"분당 60개 인스턴스 추가·최대 1,000 동시" 구식 — 현행: 5개 동시 호출로 시작 → 분당 최대 300개 동시 호출 추가 → 최대 1,250 동시 호출**(Standard 모드 기준. Provisioned 모드는 분당 최대 1,000 동시성 추가로 별도) | https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-scaling.html | 2026-07-13 |
| Lambda | Kinesis/DynamoDB Streams 병렬화 계수 | ParallelizationFactor 설정으로 샤드당 최대 10 배치 동시 처리(기본값 1) | https://aws.amazon.com/blogs/compute/new-aws-lambda-scaling-controls-for-kinesis-and-dynamodb-event-sources/ | 2026-07-13 |
| Lambda | ⚠️ Lambda@Edge 실행 시간·코드 크기(현행) | **"5~10초/1MB~50MB" 구식 — 현행: 실행 시간은 viewer·origin 요청/응답 전부 "최대 30초"(과거 viewer 5초 제한이 통합됨), 코드 크기는 viewer·origin 전부 50MB(과거 viewer 1MB 제한 없어짐)**. 메모리는 viewer 128MB 고정 / origin 최대 10,240MB, CF Functions는 초당 수백만 요청·서브밀리초·2MB·10KB | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions-choosing.html | 2026-07-13 |
| Lambda | Lambda@Edge 작성 리전 | us-east-1(버지니아 북부)에서만 함수 작성, CloudFront가 엣지로 복제 | https://aws.amazon.com/blogs/gametech/how-to-deliver-custom-game-content-to-players-using-lambdaedge/ · https://docs.aws.amazon.com/amplify/latest/userguide/ssr-supported-features.html | 2026-07-13 |
| Lambda | CodeGuru Profiler 지원 언어 | Java/JVM 언어(Scala·Kotlin 등) + Python 3.6+ (그 외 런타임 미지원) | https://docs.aws.amazon.com/codeguru/latest/profiler-ug/what-is-codeguru-profiler.html | 2026-07-13 |
| Lambda | 무료 티어·요금 | 월 100만 요청 무료 + 40만 GB-초 무료, 초과 시 $0.20/100만 요청 | https://docs.aws.amazon.com/whitepapers/latest/big-data-analytics-options/aws-lambda.html | 2026-07-13 |
| Lambda | SnapStart 지원 런타임 (재확인) | Java 11+, Python 3.12+, .NET 8+ — nodejs24.x·ruby4.0 등 그 외 런타임·OS-only·컨테이너 이미지 미지원 | https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html | 2026-07-13 |
| IAM | Permission Boundary 적용 대상 | 사용자·역할(user or role)에만 설정 가능, 그룹 불가. 권한을 부여하지 않고 상한만 설정 | https://docs.aws.amazon.com/help-panel/IAM/latest/console/hp-policies-permissions-boundary.html | 2026-07-13 |
| IAM | iam:PassRole | API 호출이 아니라 IAM 액션 — 리소스가 서비스 역할로 생성/갱신될 때마다 검사됨. 서비스에 역할을 "전달"하는 사용자에게 필요 | https://aws.amazon.com/blogs/security/how-to-use-the-passrole-permission-with-iam-roles/ · https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_passrole.html | 2026-07-13 |
| KMS | 대칭 암호화 작업 요청 쿼터(리전별) | 5,500 / 10,000 / 50,000 req/s (리전에 따라, 조정 가능) | https://docs.aws.amazon.com/kms/latest/developerguide/requests-per-second.html | 2026-07-13 |
| KMS | RSA/ECC 비대칭 암호화 작업 요청 쿼터 | RSA 전체 공유 1,000 req/s, ECC·SM2 공유 1,000 req/s (조정 가능) | https://docs.aws.amazon.com/kms/latest/developerguide/requests-per-second.html | 2026-07-13 |
| KMS | 키 로테이션 — AWS 관리형 | 매년 자동 교체, 비활성화 불가 | https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html | 2026-07-13 |
| KMS | 키 로테이션 — 고객 관리형 | 자동 교체는 옵션(기본 365일, RotationPeriodInDays로 90~2,560일 커스텀 가능) + 온디맨드 로테이션(수명당 최대 10회) 병행 지원 | https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html · https://aws.amazon.com/kms/faqs/ | 2026-07-13 |
| KMS | 키 로테이션 — 가져온(Imported/EXTERNAL) 키 | 자동 스케줄 로테이션 불가하나 온디맨드 로테이션은 지원(신규 기능). 비대칭·HMAC·커스텀 키 스토어 키는 자동·온디맨드 모두 불가(수동 교체만) | https://aws.amazon.com/blogs/security/how-to-use-on-demand-rotation-for-aws-kms-imported-keys/ | 2026-07-13 |
| KMS | Encrypt/Decrypt API 데이터 크기 한도 | 4,096바이트(4KB) | https://docs.aws.amazon.com/cli/v1/reference/kms/encrypt.html | 2026-07-13 |
| KMS | ⚠️ FIPS 인증 레벨(현행) | **"Level 2" 구식 — 2023-05부터 FIPS 140-2 Level 3, 현재 FIPS 140-3 Level 3** (CloudHSM과 동일 레벨) | https://aws.amazon.com/blogs/security/aws-key-management-service-now-offers-fips-140-2-validated-cryptographic-modules-enabling-easier-adoption-of-the-service-for-regulated-workloads/ · https://aws.amazon.com/compliance/fips/ | 2026-07-13 |
| CloudHSM | FIPS 인증 레벨 | FIPS 140-2 Level 3 validated HSM | https://aws.amazon.com/cloudhsm/faqs/ | 2026-07-13 |
| EBS/EC2 | 암호화 스냅샷·AMI 교차 계정 공유 | 고객 관리형 키(CMK)로 암호화한 것만 공유 가능(AWS 관리형 키 불가) | https://aws.amazon.com/ebs/faqs/ | 2026-07-13 |
| SSM | Parameter Store 티어 한도 | Standard: 10,000개/4KB(무료) · Advanced: 100,000개/8KB(파라미터당 월 $0.05, 파라미터 정책·계정 간 공유 지원) | https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html | 2026-07-13 |
| Secrets Manager | KMS 암호화 | 필수(봉투 암호화, 시크릿 값 변경마다 새 데이터 키 요청) — SSM SecureString은 선택 | https://aws.amazon.com/secrets-manager/faqs/ · https://docs.aws.amazon.com/secretsmanager/latest/userguide/security-encryption.html | 2026-07-13 |
| RDS/Secrets Manager | ManageMasterUserPassword | true 설정 시 RDS/Aurora가 Secrets Manager 시크릿 자동 생성 및 로테이션까지 자체 관리 | https://docs.aws.amazon.com/secretsmanager/latest/userguide/cfn-example_RDSsecret.html | 2026-07-13 |
| CloudWatch Logs | KMS 키 연결 콘솔 제약 | "기존" 로그 그룹에는 콘솔로 KMS 키 연결 불가(CLI/API 필요) — associate-kms-key 사용, 반영까지 최대 5분 | https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html | 2026-07-13 |
| Cognito | User Pool ID/Access 토큰 기본 수명 | 기본 60분, 앱 클라이언트 설정으로 5분~1일 범위 지정 가능(Refresh 토큰 유효기간 초과 불가) | https://docs.aws.amazon.com/help-panel/cognito/latest/console/hp-token-expiration.html · https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cognito.UserPoolClientOptions.html | 2026-07-13 |
| Cognito | Refresh 토큰 기본 수명 | 기본 30일, 60분~10년 범위 설정 가능 | https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-the-refresh-token.html | 2026-07-13 |
| ALB | authenticate-cognito/oidc는 HTTPS 리스너 전용 | HTTP(비TLS) 리스너 미지원 | https://aws.amazon.com/blogs/networking-and-content-delivery/security-best-practices-when-using-alb-authentication/ | 2026-07-13 |
| ALB | OnUnauthenticatedRequest 3옵션 | authenticate(기본, IdP 리다이렉트) / deny(HTTP 401) / allow(그대로 통과) | https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_elasticloadbalancingv2.CfnListenerRule.AuthenticateCognitoConfigProperty.html | 2026-07-13 |
| Cognito | Hosted UI 커스텀 도메인 ACM 인증서 리전 | us-east-1(버지니아 북부) 필수 | https://aws.amazon.com/blogs/opensource/building-a-multi-tenant-kubeflow-environment-on-amazon-eks-using-amazon-cognito-and-adfs/ | 2026-07-13 |
| SQS | 메시지 보존 기간 | 기본 4일, 설정 범위 1분(60초)~14일(1,209,600초) | https://aws.amazon.com/sqs/faqs/ | 2026-07-13 |
| SQS | 메시지 최대 크기 | 262,144바이트(256KB), 초과 시 SQS Extended Client Library(Java)로 S3 오프로딩 | https://docs.aws.amazon.com/help-panel/AWSSimpleQueueService/latest/console/hp-createq-config-max-size.html | 2026-07-13 |
| SQS | 가시성 타임아웃 범위 | 기본 30초, 최소 0초, 최대 12시간 | https://docs.aws.amazon.com/powershell/v5/reference/items/Edit-SQSMessageVisibility.html | 2026-07-13 |
| SQS | 롱 폴링 최대 대기 시간 | 20초 | https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/best-practices-setting-up-long-polling.html | 2026-07-13 |
| SQS | FIFO 처리량 기본 한도 | 배치 없이 300 msg/s, 배치 시 3,000 msg/s(큐당). ⚠️ High Throughput Mode 활성화 시 배치 없이 최대 70,000 msg/s(2023-08 확대), 리전별 상한 상이 | https://aws.amazon.com/sqs/faqs/ | 2026-07-13 |
| SQS | Fair Queues(신규 기능) | 표준 큐에 MessageGroupId(테넌트 식별자)를 붙이면 특정 그룹의 폭주가 다른 그룹을 굶기지 않도록 공정 분배 — FIFO 큐 기능이 아니라 표준 큐 신규 기능, 소비자 코드 변경 불필요 | https://aws.amazon.com/blogs/compute/building-resilient-multi-tenant-systems-with-amazon-sqs-fair-queues/ | 2026-07-13 |
| SNS | 구독·토픽 한도 | 토픽당 구독 최대 1,250만(표준)·100(FIFO), 계정당 토픽 최대 100,000(표준)·1,000(FIFO) | https://docs.aws.amazon.com/general/latest/gr/sns.html | 2026-07-13 |
| Kinesis | 온디맨드 모드 기본 처리량·자동 확장 규칙 | 신규 스트림 기본 4MB/s·4,000 records/s(쓰기), 최근 30일 관측 피크 대비 최대 2배까지 자동 버스트, 15분 내 2배 초과 트래픽은 ProvisionedThroughputExceeded 발생 가능 | https://aws.amazon.com/kinesis/data-streams/faqs/ | 2026-07-13 |
| RDS | Storage Auto Scaling 트리거 조건 | 여유공간≤10% AND 5분 이상 지속 AND 마지막 수정(or 최적화 완료)로부터 6시간 경과 — 3조건 모두 충족 시 발동, 증분은 10GiB/10%/7시간내 예측증가분 중 최댓값 | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIOPS.Autoscaling.html | 2026-07-13 |
| RDS | Multi-AZ DB 인스턴스 vs DB 클러스터 | 스탠바이 1개=DB 인스턴스 배포(읽기 불가) / 스탠바이 2개=DB 클러스터 배포(readable standby, 3개 AZ) | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html | 2026-07-13 |
| Aurora | 성능 배수(현행) | MySQL·PostgreSQL 모두 "최대 6배(up to 6x)" — 구버전 "5배/3배" 문구는 폐기됨 | https://aws.amazon.com/rds/aurora/features/ · https://aws.amazon.com/rds/aurora/faqs/ | 2026-07-13 |
| Aurora | 스토리지 자동 확장 상한 | 10GiB 증분, 최대 128 TiB | https://aws.amazon.com/blogs/database/is-amazon-rds-for-postgresql-or-amazon-aurora-postgresql-a-better-choice-for-me/ | 2026-07-13 |
| Aurora | 읽기 복제본 지연 | 공식 가이드: "usually considerably less than 100ms" (100ms 미만 보장 수준), 마케팅상 "often single-digit ms" | https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Performance.html | 2026-07-13 |
| Aurora | 페일오버 시간 | 통상 30초 이내 | https://aws.amazon.com/blogs/database/reduce-downtime-with-amazon-aurora-mysql-database-restart-time-optimizations/ | 2026-07-13 |
| Aurora | Backtrack 지원 엔진 | Aurora MySQL 전용 (PostgreSQL 미지원) | https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Backups.html | 2026-07-13 |
| RDS Proxy | 페일오버 시간 단축 | 최대 66% | https://aws.amazon.com/rds/proxy/ | 2026-07-13 |
| RDS/Aurora | IAM DB 인증 토큰 유효 기간 | 15분 | https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/UsingWithRDS.IAMDBAuth.Connecting.html | 2026-07-13 |
| ElastiCache | Memcached 백업/복원 지원 범위 | 비-서버리스 Memcached는 백업/복원 미지원. ElastiCache Serverless for Memcached만 지원(Valkey·Redis OSS는 서버리스 아니어도 지원) | https://aws.amazon.com/elasticache/faqs/ | 2026-07-13 |
| MemoryDB | 처리량·확장 | 클러스터당 최대 1억 6천만(160 million) TPS, 최대 수백 TB, us(읽기)·ms(쓰기) 지연 | https://docs.aws.amazon.com/memorydb/latest/devguide/servicename-feature-overview.html | 2026-07-13 |
| VPC | 리전당 기본 VPC 개수 한도 | 5개 (조정 가능, up to 수백 개) | https://docs.aws.amazon.com/vpc/latest/userguide/amazon-vpc-limits.html | 2026-07-13 |
| VPC | 게이트웨이 엔드포인트 vs 인터페이스 엔드포인트 — 온프레미스 접근성 | 게이트웨이(S3/DynamoDB)는 VPC 내부 전용, 온프레미스·피어링 VPC에서 접근 불가. 인터페이스(PrivateLink)는 VPN·Direct Connect·피어링을 통해 온프레미스/타 VPC에서도 접근 가능 | https://aws.amazon.com/privatelink/faqs/ · https://aws.amazon.com/dynamodb/faqs/ | 2026-07-13 |
| VPC | VPC당 엔드포인트 생성 한도 | 최대 100개 | https://aws.amazon.com/privatelink/faqs/ | 2026-07-13 |
| VPC | 기본 VPC 개수(계정·리전당) | 리전당 1개(EC2-VPC 플랫폼 지원 시) | https://aws.amazon.com/vpc/faqs/ | 2026-07-13 |
| CloudWatch | EC2 기본/상세 모니터링 간격 | 기본 5분(무료) / 상세 모니터링 1분(유료) | https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-metrics-basic-detailed.html | 2026-07-13 |
| CloudWatch | 지표당 디멘션 한도 | 최대 30개 | https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html | 2026-07-13 |
| CloudWatch | PutMetricData 타임스탬프 허용 범위 | 과거 2주 · 미래 2시간 (범위 밖은 거부) | https://docs.aws.amazon.com/botocore/latest/reference/services/cloudwatch/client/put_metric_data.html | 2026-07-13 |
| CloudWatch | ⚠️ StorageResolution 파라미터 유효값 | **1(고해상도) 또는 60(표준, 기본)만 유효** — "1·5·10·30초"는 조회(period) 옵션이지 게시 값 아님 | https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html | 2026-07-13 |
| CloudWatch | ⚠️ 고해상도 지표 경보 주기 | **10초·20초·30초** ("10/30초만"은 구식) | https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarm-evaluation.html | 2026-07-13 |
| CloudWatch | 경보 상태 3종 | OK / ALARM / INSUFFICIENT_DATA | https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarm-evaluation.html | 2026-07-13 |
| CloudWatch Logs | 메트릭 필터 디멘션 한도 | JSON/공백 구분 필터 최대 3개 | https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntaxForMetricFilters.html | 2026-07-13 |
| CloudWatch Logs | 로그 그룹 보존 기본값·범위 | 기본 무기한(never expire), 옵션 1일~10년 | https://docs.aws.amazon.com/eks/latest/best-practices/cost-opt-observability.html · https://docs.aws.amazon.com/solutions/latest/cloud-migration-factory-on-aws/security.html | 2026-07-13 |
| CloudWatch | EC2 메모리 지표 기본 제공 여부 | 기본 지표에 없음 — CloudWatch 에이전트로 커스텀 수집 필요 | https://aws.amazon.com/blogs/mt/setup-memory-metrics-for-amazon-ec2-instances-using-aws-systems-manager/ | 2026-07-13 |
| X-Ray | 데몬 수신 포트 | UDP 2000 (설정 변경 가능) | https://aws.amazon.com/blogs/devops/instrumenting-web-apps-using-aws-x-ray/ | 2026-07-13 |
| X-Ray | 기본 샘플링 규칙 | 초당 첫 요청 1개 무조건 기록(reservoir) + 나머지 5%(rate) | https://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html | 2026-07-13 |
| X-Ray | 주석 vs 메타데이터 | 주석(Annotations)=인덱싱·검색·필터 가능 / 메타데이터(Metadata)=인덱싱 불가 | https://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html | 2026-07-13 |
| X-Ray | AWSXRayDaemonWriteAccess 관리형 정책 액션 | xray:PutTraceSegments·PutTelemetryRecords·GetSamplingRules·GetSamplingTargets·GetSamplingStatisticSummaries | https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AWSXRayDaemonWriteAccess.html | 2026-07-13 |
| CloudTrail | 기본 활성화·이벤트 히스토리 보존 | 계정 생성 시 자동 활성화, 콘솔 이벤트 히스토리 최근 90일(관리 이벤트) | https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html | 2026-07-13 |
| CloudTrail | 이벤트 유형별 기본 기록 여부 | 관리 이벤트=기본 기록 / 데이터 이벤트·Insights 이벤트=기본 미기록(수동 활성화 필요) | https://docs.aws.amazon.com/help-panel/awscloudtrail/latest/console/create-trail-events.html | 2026-07-13 |
