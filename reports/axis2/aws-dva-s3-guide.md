# 축2 리포트: aws-dva-s3-guide

모드: 레거시 / 성분 태그: 설명 O · 예시 O(SVG 도식 17개·시나리오·정책/헤더 값 — CLI/JSON 실코드 없음) · 퀴즈 X · 해설 X / 매핑 챕터: 1-1 S3 / **판정: 수정**

> 검증 방식 부기: 세션 MCP 클라이언트 단선으로 동일 AWS MCP 서버를 HTTP 직접 호출로 사용 (반환 URL 동일). 캐시: docs/VERIFIED_FACTS.md.
> 중복 부기: aws-s3-dva-guide.jsx와 실질 중복 쌍 — 사용자 결정으로 둘 다 정식 평가 (하단 「중복 관찰」).

## 사실 검증표

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| "객체 최대 크기 5TB" (도식 캡션·`overview` KP·시험 포인트 3곳) | 수치 | **수정 필요** | 현행 최대 **50TB** (멀티파트 5MB~50TB 지원). 단일 PUT 5GB·콘솔 단일 업로드 160GB는 그대로 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html |
| 단일 PUT 최대 5GB → 5GB 초과 멀티파트 필수 | 수치 | 확인됨 | 동일 | upload-objects.html |
| 멀티파트 100MB 이상 권장 | 수치 | 확인됨 | "larger than 100 MB → consider multipart" | https://aws.amazon.com/s3/faqs/ |
| 버킷 이름 3~63자·대문자/언더스코어 불가·소문자/숫자 시작·IP 형식 불가 | 수치 | 확인됨 | 동일 + 부기: 끝도 문자/숫자여야 하며 마침표(.)는 허용 문자 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html |
| 버킷 이름 전역 고유·버킷은 리전 단위 | 동작 | 확인됨 | 기본(글로벌 네임스페이스) 기준 동일. 부기: 2026 account regional namespace 신설(계정·리전 스코프 이름 허용) | bucketnamingrules.html · https://aws.amazon.com/blogs/aws/introducing-account-regional-namespaces-for-amazon-s3-general-purpose-buckets/ |
| 폴더는 실재하지 않음·Key=prefix+이름(전체 경로) | 동작(시험 포인트) | 확인됨 | "flat structure … infer hierarchy using key name prefixes" | https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html |
| 객체 태그 최대 10개 | 수치 | 확인됨 | "up to 10 tags with an object" | https://docs.aws.amazon.com/AmazonS3/latest/userguide/tagging-managing.html |
| 접근 판정 = (IAM 허용 ∪ 버킷 정책 허용) AND 명시적 Deny 없음 | 동작(시험 포인트) | 확인됨 | 동일 계정에서 두 정책의 합집합 평가 / Deny 최우선(캐시) | https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html |
| Block Public Access 켜져 있으면 정책 무관 공개 차단·계정 수준 가능 | 동작 | 확인됨 | 4개 설정, AP/버킷/계정 단위 적용 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html |
| 정적 웹사이트 엔드포인트 대시/점 2형식 | 동작 | 확인됨 | `s3-website-Region` / `s3-website.Region` 두 형식 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteEndpoints.html |
| 웹사이트 403 → 퍼블릭 읽기 허용 필요 | 동작(시험 포인트) | 확인됨 | "must make all your content publicly readable" | WebsiteEndpoints.html |
| 버전 관리: 이전 객체 버전 null·삭제 마커·Suspend 시 기존 버전 유지 | 동작(시험 포인트) | 확인됨 | 동일 + 부기: 활성화 후 unversioned 복귀 불가 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html |
| 복제: 원본·대상 모두 버전 관리 필수 + IAM 역할 | 동작(시험 포인트) | 확인됨 | 동일 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-requirements.html |
| 복제: 새 객체만·기존/실패분은 S3 Batch Replication | 동작 | 확인됨 | 복제본·기존 객체는 Batch Replication("Replicating existing objects") | https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-what-is-isnot-replicated.html |
| 삭제 마커 복제는 옵션·버전 ID 지정 영구 삭제는 미복제 | 동작(시험 포인트) | 확인됨 | 동일("protects data from malicious deletions") | replication-what-is-isnot-replicated.html |
| 복제 체이닝 불가 (1→2→3 자동 전파 없음) | 동작(시험 포인트) | 확인됨 | 동일 (A→B 복제본은 B→C 규칙으로 미복제) | replication-what-is-isnot-replicated.html |
| 내구성 11-nine 전 클래스 동일 | 수치 | 확인됨 | 전 클래스 99.999999999% | https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html |
| 가용성 Standard 99.99 / IA 99.9 / One Zone-IA 99.5 / GIR 99.9 / GFR·GDA 99.99(복원 후) / IT 99.9 | 수치 | 확인됨 | 표 수치·"(after you restore objects)" 각주까지 문서와 일치 | storage-class-intro.html |
| 최소 저장 기간 IA 30일·GIR/GFR 90일·GDA 180일 | 수치 | 확인됨 | 동일 (One Zone-IA도 30일) | storage-class-intro.html |
| GFR 신속 1~5분/표준 3~5h/대량 5~12h · GDA 표준 12h/대량 48h | 수치 | 확인됨 | 동일 + 부기: GFR 대량은 무료, GDA는 신속 미지원 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/restoring-objects-retrieval-options.html |
| One Zone-IA 단일 AZ·AZ 파괴 시 유실 | 동작(시험 포인트) | 확인됨 | "Not resilient to the loss of the AZ" | storage-class-intro.html |
| Intelligent-Tiering 자동 계층·검색 비용 없음·모니터링 소액 과금 | 동작 | 확인됨 | 동일 (128KB 미만 미모니터링) | storage-class-intro.html |
| 수명 주기 전환+만료·prefix/태그 필터·이전 버전 삭제 | 동작 | 확인됨 | 동일 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-configuration-examples.html |
| 미완료 멀티파트 업로드 수명 주기 정리 | 동작(시험 포인트) | 확인됨 | AbortIncompleteMultipartUpload 액션 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpu-abort-incomplete-mpu-lifecycle-config.html |
| S3 Analytics: Standard→Standard-IA 추천만(OZ-IA·Glacier 미지원)·24~48시간 후·매일 갱신 | 수치+동작 | 확인됨 | "only … Standard to Standard IA" · "in 24 to 48 hours" · "updated daily" | https://docs.aws.amazon.com/AmazonS3/latest/userguide/analytics-storage-class.html |
| 이벤트 대상: SNS·SQS·Lambda + EventBridge | 동작 | 확인됨 | 4대상 명시. 부기: SQS FIFO는 직접 대상 불가(EventBridge 경유) | https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventNotifications.html |
| 대상에 게시하려면 대상의 리소스(액세스) 정책 필요 (IAM 역할 아님) | 동작(시험 포인트) | 확인됨 | SNS/SQS는 대상에 정책 부착 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/grant-destinations-permissions-to-s3.html |
| 이벤트 전달 보통 수초·간혹 1분+ | 동작 | 확인됨 | "delivered in seconds but can sometimes take a minute or longer" (at least once) | EventNotifications.html |
| 객체 이름(prefix/suffix, *.jpg) 필터링 | 동작 | 확인됨 | 동일 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-how-to-filtering.html |
| EventBridge: 고급 필터·18개 이상 서비스·아카이브/재생 | 수치+동작 | 확인됨 | "content filtering … 18 service targets … archive and replay" | https://aws.amazon.com/blogs/compute/icymi-serverless-q4-2021/ |
| 기준 성능 prefix당 3,500 PUT/COPY/POST/DELETE·5,500 GET/HEAD·prefix 무제한 | 수치(시험 포인트) | 확인됨 | "at least 3,500 … or 5,500 … per partitioned prefix. There are no limits …" | https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html |
| Transfer Acceleration: 엣지 로케이션 경유→AWS 백본·업/다운로드 모두 | 동작 | 확인됨 | CloudFront 엣지·"point your PUT and GET requests to the s3-accelerate endpoint". 부기: "멀티파트와 병행 가능"은 스니펫 미확보(통념 수준, 오류 아님) | https://docs.aws.amazon.com/whitepapers/latest/s3-optimizing-performance-best-practices/using-amazon-s3-transfer-acceleration-to-accelerate-geographically-disparate-data-transfers.html · https://aws.amazon.com/s3/faqs/ |
| Byte-Range Fetch: 병렬 GET·재시도 개선·부분 조회 | 동작 | 확인됨 | Range 헤더·동시 연결·"improve retry times" | https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance-guidelines.html |
| 사용자 정의 메타데이터 x-amz-meta- 접두사 | 동작 | 확인됨 | 동일 + 부기: 업로드 후 수정 불가(복사로만) | https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingMetadata.html |
| 태그/메타데이터로 객체 검색 불가 → DynamoDB 인덱스 구축 | 동작(시험 포인트) | 확인됨(통념 부합) | S3 목록 API에 태그/메타 필터 없음(반증 없음)·외부 인덱스는 통용 패턴. **부기: 현행 문서에 S3 Metadata(쿼리 가능한 Iceberg 메타데이터 테이블) 신기능 존재 — "불가" 단정 서술은 최신화 권장** | https://docs.aws.amazon.com/AmazonS3/latest/userguide/metadata-tables-overview.html |
| SSE-S3 기본값·AES-256·헤더 `AES256` | 동작+수치(시험 포인트) | 확인됨 | 2023-01-05부터 모든 신규 업로드 자동 SSE-S3 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingServerSideEncryption.html |
| SSE-KMS: 헤더 `aws:kms`·CloudTrail 감사·KMS API 호출로 스로틀링 가능 | 동작(시험 포인트) | 확인됨 | 업로드 GenerateDataKey·다운로드 Decrypt가 KMS 쿼터 소모 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html · https://docs.aws.amazon.com/kms/latest/developerguide/requests-per-second.html |
| "KMS 초당 한도 리전별 5,500~30,000" | 수치 | **확인 불가** | 현행 KMS 문서는 "리전·키 유형별 상이"로만 기술(예시 10,000/s), 5,500~30,000 범위 명시 없음. 쿼터 조정 가능("All … adjustable")은 확인 → 재표현 권고 | requests-per-second.html |
| DSSE-KMS: 헤더 `aws:kms:dsse`·KMS 이중 암호화·2023 추가 | 동작+수치 | 확인됨 | 정책 예시에 `"s3:x-amz-server-side-encryption": "aws:kms:dsse"` 명시·AES-256 2겹·2023-06 출시. 부기: S3 Bucket Key 미지원 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingDSSEncryption.html · https://aws.amazon.com/blogs/aws/new-amazon-s3-dual-layer-server-side-encryption-with-keys-stored-in-aws-key-management-service-dsse-kms/ |
| SSE-C: HTTPS 필수·매 요청 키 전달·S3 키 미저장·다운로드 시 같은 키 | 동작(시험 포인트) | 확인됨 | "must use HTTPS … rejects any requests made over HTTP" · "S3 never stores the encryption key". **부기: 2026-04부터 신규 버킷 SSE-C 기본 차단(PutBucketEncryption로 명시 활성화 필요) — 각주 추가 권장** | https://docs.aws.amazon.com/AmazonS3/latest/userguide/ServerSideEncryptionCustomerKeys.html |
| HTTPS 강제: aws:SecureTransport=false Deny | 동작(시험 포인트) | 확인됨 | 공식 버킷 정책 예시 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html |
| "버킷 정책의 암호화 강제는 기본 암호화보다 먼저 평가" (2곳: encryption·default-enc) | 동작(시험 포인트) | **확인 불가** | 현행 문서에서 평가 순서 서술 미발견. 강제 패턴 자체(헤더 불일치 PUT Deny)는 공식 예시로 확인 → "순서" 단정 대신 패턴 서술로 재표현 권고 | UsingKMSEncryption.html · UsingDSSEncryption.html |
| CORS: preflight OPTIONS + Origin → Allow-Origin/-Methods 응답·요청받는 버킷에 설정 | 동작(시험 포인트) | 확인됨 | "S3 evaluates the CORS configuration for the bucket"(요청 수신 버킷 기준). 오리진=scheme+host+port는 웹 표준(통념) | https://docs.aws.amazon.com/AmazonS3/latest/userguide/testing-cors.html |
| Presigned URL: 생성자 권한 상속·콘솔 최대 12h·CLI/SDK 최대 168h(7일) | 수치+동작(시험 포인트) | 확인됨 | 콘솔 12h / CLI `--expires-in` 최대 604800초 / IAM 사용자 SigV4 최대 7일·"URL must be created by someone who has permission" | https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html · https://docs.aws.amazon.com/cli/latest/reference/s3/presign.html · https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html |
| MFA Delete: 영구 삭제·버전 관리 중단에 MFA·루트만·CLI/SDK/API로만(콘솔 불가)·버전 관리 전제 | 동작(시험 포인트) | 확인됨 | "only the root user can permanently delete … or change the versioning configuration" · "only works for CLI or API, not console" | https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingMFADelete.html · https://aws.amazon.com/blogs/security/securing-access-to-aws-using-mfa-part-3/ |
| 액세스 로그: 같은 리전 필수·자기 자신 로깅 금지(무한 루프) | 동작(시험 포인트) | 확인됨 | "must be in the same AWS Region **and AWS account**"(같은 계정 요건은 파일 미기재 — 보강 권장) · "infinite loop of logs" | https://docs.aws.amazon.com/AmazonS3/latest/userguide/enable-server-access-logging.html |
| 액세스 포인트: 고유 DNS·자체 정책·Internet/VPC origin·VPC는 VPC 엔드포인트 경유 | 동작 | 확인됨 | Network origin 설정·VPC origin은 지정 VPC 외 거부, Gateway/Interface 엔드포인트 사용 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-points-vpc.html · https://docs.aws.amazon.com/help-panel/AmazonS3/latest/console/hp-view-access-point-properties-page.html |
| Object Lambda: 지원 AP+OLAP+Lambda 구성·조회 시점 변환 | 동작(시험 포인트) | 확인됨 | OLAP는 표준 AP 1개에 연결·GET 출력 변환. 부기: GET 외 HEAD·LIST도 지원 | https://aws.amazon.com/s3/features/object-lambda/ · https://aws.amazon.com/blogs/storage/modify-images-cached-in-amazon-cloudfront-using-amazon-s3-object-lambda/ |
| EC2→S3는 액세스 키 대신 IAM 역할(인스턴스 프로파일) | 권장 | 일반 통념 | 표준 보안 관행 (개별 URL 미첨부, 오류 아님) | — |
| 출제 빈도 배지(●2~5) | 메타 | 검증 불가(추정치) | 파일 스스로 "기출 경향·커뮤니티 기반 추정치" 명기 — 문제 없음 | — |

## Task 커버리지 (담당: 1-1 S3 — Task 1.3 데이터 수명 주기 / Task 2.2 암호화 사례)

- **커버**: 스토리지 클래스 / 버킷 정책 / 암호화 SSE-S3·KMS·DSSE·C·클라이언트 측(2.2) / 전송 중 암호화 강제(aws:SecureTransport) / presigned URL / 정적 호스팅+CORS / 이벤트 알림(+EventBridge) / 멀티파트 / 수명 주기(1.3) — RUBRIC §2 1-1 키워드 전부. 추가로 성능(3,500/5,500)·복제(CRR/SRR)·버전 관리·MFA Delete·액세스 로그·액세스 포인트·Object Lambda·태그/메타데이터까지 1-1 범위 내 심화.
- **누락**: 없음.
- **표면 커버**: 없음 (전 항목이 시나리오·함정 콜아웃 동반).

## 범위 이탈 (축1 L5 참조용)

- 없음. 17개 섹션 전부 1-1 S3 범위.

## 출제 각도 부정합

- 없음. Task 동사("사용·정의·구현") 대비 "상황→정답 서비스/설정" 패턴의 시험 포인트 콜아웃이 섹션마다 배치 — 정합 우수.

## 폐기 문항 (레거시 F4)

- 해당 없음 (퀴즈 성분 없음 → F4 N/A). 사이드바의 "퀴즈 8/10/11" 표기는 외부 퀴즈 범위 안내일 뿐 문항 아님.

## 수정 지시 (실행 가능하게)

1. **5TB → 50TB (3곳)** — `OverviewDiagram` 캡션 텍스트("최대 5TB"), `overview` 섹션 KP("객체 최대 크기 5TB"), 같은 섹션 Exam 콜아웃("5TB/5GB/멀티파트 수치") → "객체 최대 **50TB**(멀티파트 5MB~50TB), 단일 PUT 최대 5GB — 5GB 초과 시 멀티파트 필수"로 갱신. 근거: upload-objects.html
2. **KMS 한도 수치 재표현 (2곳)** — `EncryptionDiagram` 하단 텍스트·`encryption` 섹션 표/Exam의 "리전별 5,500~30,000" → "리전·키 유형별로 다른 KMS 요청 쿼터(조정 가능)"로 완화하고, 해결책에 "S3 Bucket Key(KMS 호출 최대 99% 감소)" 추가. 근거: requests-per-second.html · bucket-key.html
3. **평가 순서 문구 재표현 (2곳)** — `encryption` KP·`default-enc` KP의 "버킷 정책은 기본 암호화보다 먼저 평가" → "특정 방식 강제는 버킷 정책에서 암호화 헤더 불일치 PUT을 Deny하는 공식 패턴으로 구현"으로 재표현(순서 단정 제거). 근거: UsingDSSEncryption.html 정책 예시
4. (경미·부기) `security` 섹션 버킷 이름 KP에 "끝 문자도 문자/숫자, 마침표 허용" 보완. `logs` 섹션에 "같은 계정" 요건 추가. `tags` 섹션에 S3 Metadata 신기능 각주, `encryption`에 SSE-C 2026-04 기본 차단 각주 — 판정 무관 최신화.
5. (보충 생성 목록) 퀴즈·해설 성분 부재 — 변환 단계 보충 생성 대상.

## 중복 관찰 (vs aws-s3-dva-guide.jsx — 판정 미반영)

- 주제 집합 사실상 동일: 개요/버전/웹사이트/정책/암호화/기본 암호화/CORS/프리사인/MFA/로그/클래스/수명 주기/복제/이벤트/성능/태그·메타/AP/Object Lambda (17 vs 18 단원, 1:1 대응).
- 본 파일 고유: 전송 중 암호화 강제(aws:SecureTransport)·KMS 쿼터 언급·S3 Analytics 24~48h/매일 갱신·이벤트 전달 지연·TA 업/다운 명시·수명 주기 복구 설계 시나리오·가용성 표(복원 후 각주 포함).
- 상대 파일 고유: 버킷 정책 JSON 실코드·S3 Bucket Key 해결책·기본 암호화 2023-01 시점·프리사인 SDK 기본 3600초·BPA "4개 설정"·freqNote(빈출 사유 한 줄).
- 수치·시험 포인트는 거의 동일(공통 오류 5TB 포함) — 동일 원전 기반 재구성으로 추정. 통합 결정은 인간 몫.

## 스키마 피드백 요약

그룹→외부 퀴즈 범위 매핑(GROUP_QUIZ) 구조 → docs/SCHEMA_FEEDBACK_AXIS2.md에 제안 기록. 빈출도 배지·콜아웃 3유형은 기존 제안(dynamodb-guide 행)과 동일 패턴이라 중복 기록 생략.
