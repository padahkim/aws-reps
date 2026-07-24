# 축2 리포트: aws-s3-dva-guide

모드: 레거시 / 성분 태그: 설명 O · 예시 O(SVG 도식·버킷 정책 JSON 코드블록·시나리오) · 퀴즈 X · 해설 X / 매핑 챕터: 1-1 S3 / **판정: 수정**

> 검증 방식 부기: 세션 MCP 클라이언트 단선으로 동일 AWS MCP 서버를 HTTP 직접 호출로 사용 (반환 URL 동일). 캐시: docs/VERIFIED_FACTS.md.
> 중복 부기: aws-dva-s3-guide.jsx와 실질 중복 쌍 — 사용자 결정으로 둘 다 정식 평가 (하단 「중복 관찰」). 공통 주장의 상세 근거는 두 리포트에 동일 URL로 기재.

## 사실 검증표

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| "객체 최대 5TB" (`D_Overview` 도식·S3-01 Fact 카드·Exam 콜아웃 "5TB 객체를 한 번에 PUT" 함정 문구) | 수치 | **수정 필요** | 현행 최대 **50TB** (멀티파트 5MB~50TB). 단일 PUT 5GB는 그대로 — 함정 문구의 초점("단일 PUT 5GB 초과 불가")은 유지하되 수치 갱신 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html |
| 단일 PUT 최대 5GB → 5GB 초과 멀티파트 필수 | 수치 | 확인됨 | 동일 | upload-objects.html |
| 멀티파트 100MB 이상 권장 (S3-15) | 수치 | 확인됨 | 동일 | https://aws.amazon.com/s3/faqs/ |
| 버킷 네이밍 "3~63자 · 소문자/숫자/하이픈만 · 대문자·언더스코어 불가 · IP 형식 불가 · 소문자/숫자로 시작" (S3-01 Fact) | 수치 | 확인됨(경미 부정확) | 3~63자·대문자/언더스코어 불가·IP 불가·시작 문자 규칙은 일치. 단 **마침표(.)도 허용 문자**이므로 "소문자/숫자/하이픈만"은 보완 필요(끝 문자 규칙도 미기재) — 시험 정답에 영향 낮아 부기 처리 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html |
| 버킷 이름 전역 고유(모든 계정 통틀어)·리전에 종속 | 동작 | 확인됨 | 기본(글로벌 네임스페이스) 기준 동일. 부기: 2026 account regional namespace 신설 | bucketnamingrules.html · https://aws.amazon.com/blogs/aws/introducing-account-regional-namespaces-for-amazon-s3-general-purpose-buckets/ |
| 실제 폴더 없음·Key=prefix+object name | 동작(시험 포인트) | 확인됨 | flat structure·key name prefix | https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html |
| 버전 관리: 활성화 이전 객체 버전 ID null·Delete Marker·특정 버전 ID 삭제=영구 삭제·suspend 시 기존 버전 유지 (S3-02) | 동작(시험 포인트) | 확인됨 | 동일 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html |
| 버전 관리는 MFA Delete·복제의 전제 조건 | 동작(시험 포인트) | 확인됨 | 동일 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingMFADelete.html · https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-requirements.html |
| 웹사이트 URL 대시/점 2형식 (S3-03 Fact) | 동작 | 확인됨 | 동일 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteEndpoints.html |
| 403 → BPA 해제 + 버킷 정책 s3:GetObject를 "*"에 허용 (S3-03) | 동작(시험 포인트) | 확인됨 | "must make all your content publicly readable" + BPA 4설정 | WebsiteEndpoints.html · https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html |
| 허용 판정 = IAM ∪ 리소스 정책(합집합)·명시적 Deny 최우선 (S3-04) | 동작(시험 포인트) | 확인됨 | 동일 계정 union 평가 / Deny 우선(캐시) | https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html |
| 버킷 정책에 Principal 필드 존재(IAM 정책과의 차이)·크로스 계정/공개/암호화 강제 용도 | 동작 | 확인됨 | 리소스 기반 정책은 principal 지정 | https://aws.amazon.com/blogs/security/iam-policy-types-how-and-when-to-use-them/ |
| Block Public Access "계정 수준 4개 설정 모두 켜기" (S3-04 팁) | 수치+동작 | 확인됨 | "provides four settings … buckets, or entire AWS accounts" | access-control-block-public-access.html |
| SSE-S3: AWS 소유·관리 키(AES-256)·헤더 `AES256`·현재 기본값 (S3-05) | 동작+수치(시험 포인트) | 확인됨 | 동일 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingServerSideEncryption.html |
| SSE-KMS: CloudTrail 감사·헤더 `aws:kms`·GenerateDataKey/Decrypt 호출 → KMS 스로틀(ThrottlingException) (S3-05 경고) | 동작(시험 포인트) | 확인됨 | "S3 makes a GenerateDataKey (uploads) or Decrypt (downloads) request" — 쿼터 소모·스로틀 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html · https://docs.aws.amazon.com/kms/latest/developerguide/requests-per-second.html |
| 해결책 = S3 Bucket Key(KMS 호출 대폭 감소) 또는 한도 증설 | 동작 | 확인됨 | Bucket Key로 KMS 요청 비용 최대 99% 감소·KMS 쿼터는 조정 가능 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-key.html · requests-per-second.html |
| SSE-C: 고객 제공 키·S3 키 미저장·반드시 HTTPS·매 요청 헤더 전달 (S3-05) | 동작(시험 포인트) | 확인됨 | "must use HTTPS … rejects any requests made over HTTP" · "S3 never stores the encryption key". **부기: 2026-04부터 신규 버킷 SSE-C 기본 차단(PutBucketEncryption로 명시 활성화) — 각주 추가 권장** | https://docs.aws.amazon.com/AmazonS3/latest/userguide/ServerSideEncryptionCustomerKeys.html |
| Client-Side: 업로드 전 암호화·클라이언트 복호화 | 동작 | 확인됨 | 동일(개념 서술 문서 부합) | https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingEncryption.html |
| DSSE-KMS = KMS 이중 계층 암호화(2023) (S3-05 Exam) | 동작+수치 | 확인됨 | AES-256 2겹·2023-06 출시·헤더 `aws:kms:dsse`. 부기: S3 Bucket Key 미지원 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingDSSEncryption.html · https://aws.amazon.com/blogs/aws/new-amazon-s3-dual-layer-server-side-encryption-with-keys-stored-in-aws-key-management-service-dsse-kms/ |
| "2023년 1월부터 모든 새 객체 자동 SSE-S3" (S3-06) | 수치+동작 | 확인됨 | 2023-01-05부터 신규 업로드 자동 암호화(기존 미암호화 버킷 포함, 기존 객체 소급 없음) | UsingServerSideEncryption.html · https://docs.aws.amazon.com/AmazonS3/latest/userguide/default-encryption-faq.html |
| 버킷 정책으로 암호화 헤더 없는 PUT Deny → 강제 가능 (S3-06 Fact) | 동작(시험 포인트) | 확인됨 | 공식 정책 예시(SSE-KMS·DSSE) | UsingKMSEncryption.html · UsingDSSEncryption.html |
| "버킷 정책이 기본 암호화보다 먼저 평가" (S3-06 Exam 콜아웃) | 동작(시험 포인트) | **확인 불가** | 현행 문서에서 평가 순서 서술 미발견 — 강제 패턴 서술로 재표현 권고 | UsingKMSEncryption.html · UsingDSSEncryption.html |
| CORS: Origin=scheme+host+port·preflight(OPTIONS+Origin)·대상 버킷 B에 CORS 규칙+Allow-Origin (S3-07) | 동작(시험 포인트) | 확인됨 | preflight 시 "S3 evaluates the CORS configuration for the bucket"(요청 수신 버킷). 오리진 정의는 웹 표준(통념) | https://docs.aws.amazon.com/AmazonS3/latest/userguide/testing-cors.html |
| Presigned: 생성 주체 권한 상속·GET/PUT 모두 (S3-08) | 동작(시험 포인트) | 확인됨 | "must be created by someone who has permission to perform the operation" | https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html |
| 만료: SDK 기본 3600초·콘솔 최대 12시간·CLI --expires-in 최대 7일(168h) (S3-08 Fact·도식) | 수치 | 확인됨 | CLI 기본 3600초·최대 604800초 / 콘솔 12h / IAM 사용자 SigV4 최대 7일 | https://docs.aws.amazon.com/cli/latest/reference/s3/presign.html · https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html · using-presigned-url.html |
| MFA Delete: 버전 관리 전제·영구 삭제/중지에 MFA·루트만·"CLI로만 설정" (S3-09) | 동작(시험 포인트) | 확인됨(경미 부정확) | 루트·버전 관리·콘솔 불가는 일치. 단 문서상 **CLI 또는 API**로 가능 — "CLI로만"은 API 누락(정답 포인트 '콘솔 불가'는 유지되므로 부기) | https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingMFADelete.html · https://aws.amazon.com/blogs/security/securing-access-to-aws-using-mfa-part-3/ |
| 액세스 로그: 모든 요청(승인·거부) 별도 버킷 기록·Athena 분석·자기 자신 저장 금지(무한 루프) (S3-10) | 동작(시험 포인트) | 확인됨 | "infinite loop of logs". **부기: 대상 버킷은 같은 리전·같은 계정 필수 — 파일에 미기재(짝 파일은 리전 요건 기재), 보강 권장** | https://docs.aws.amazon.com/AmazonS3/latest/userguide/enable-server-access-logging.html |
| 내구성 전 클래스 11-nine 동일·가용성/검색 속도/비용 상이 (S3-11) | 수치 | 확인됨 | 동일 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html |
| 도식 수치: Standard 99.99/IA 99.9(30일)/OZ-IA 99.5(30일)/IT 99.9/GIR 99.9(90일)/GFR 99.99(90일)/GDA 99.99(180일) | 수치 | 확인됨 | 표 수치 전부 문서 일치 (GFR·GDA 가용성은 복원 후 기준 — 도식에 각주 없음, 경미 부기) | storage-class-intro.html |
| One Zone-IA 단일 AZ·AZ 손실 시 데이터 손실·재생성 가능 데이터용 | 동작(시험 포인트) | 확인됨 | 동일 | storage-class-intro.html |
| IT: 자동 계층 이동·소액 모니터링 비용·검색 비용 없음 | 동작 | 확인됨 | 동일 | storage-class-intro.html |
| GFR Expedited 1–5분/Standard 3–5h/Bulk 5–12h·**무료**, GDA Standard 12h/Bulk 48h (S3-11·도식 "1분~12시간") | 수치 | 확인됨 | 동일 — "Bulk retrievals are free"(GFR)까지 문서 일치 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/restoring-objects-retrieval-options.html |
| 수명 주기: Transition/Expiration·prefix/태그 필터·오래된 버전·미완료 멀티파트 정리 (S3-12) | 동작(시험 포인트) | 확인됨 | AbortIncompleteMultipartUpload 액션 포함 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpu-abort-incomplete-mpu-lifecycle-config.html · https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-configuration-examples.html |
| S3 Analytics: Standard↔Standard-IA 전환 추천(CSV)·Glacier 미지원 (S3-12 Fact·Exam) | 동작(시험 포인트) | 확인됨 | "only provides recommendations for Standard to Standard IA" · 일별 내보내기(CSV) | https://docs.aws.amazon.com/AmazonS3/latest/userguide/analytics-storage-class.html |
| 복제: 비동기·CRR/SRR·양쪽 버전 관리 ON+IAM 권한·계정 간 가능 (S3-13) | 동작(시험 포인트) | 확인됨 | 동일 | replication-requirements.html |
| 복제 3대 함정: 설정 이후 객체만(기존은 Batch Replication)·체이닝 불가·삭제 마커 복제 옵션·버전 ID 삭제 미복제 | 동작(시험 포인트) | 확인됨 | 전부 문서 일치 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-what-is-isnot-replicated.html |
| 이벤트: 종류(ObjectCreated/Removed/Restore/Replication)·대상 3종 SNS/SQS/Lambda + EventBridge (S3-14) | 동작 | 확인됨 | 4대상 명시. 부기: SQS FIFO 직접 대상 불가 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventNotifications.html |
| 권한: IAM Role 아닌 각 대상의 리소스 정책 (S3-14 Fact·Exam) | 동작(시험 포인트) | 확인됨 | 대상 SNS/SQS에 정책 부착 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/grant-destinations-permissions-to-s3.html |
| EventBridge: 모든 이벤트 → 18개+ 대상·고급 JSON 필터·아카이브/재전송 | 수치+동작 | 확인됨 | "content filtering … 18 service targets … archive and replay" | https://aws.amazon.com/blogs/compute/icymi-serverless-q4-2021/ |
| 기본 성능 3,500 PUT/COPY/POST/DELETE·5,500 GET/HEAD per prefix·prefix 무제한 (S3-15) | 수치(시험 포인트) | 확인됨 | 동일 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html |
| Transfer Acceleration: 엣지 로케이션 경유 → AWS 백본·멀티파트 병행 (S3-15) | 동작 | 확인됨 | CloudFront 엣지·PUT/GET 모두 accelerate 엔드포인트. "멀티파트 병행"은 스니펫 미확보(통념, 오류 아님) | https://aws.amazon.com/blogs/networking-and-content-delivery/using-aws-edge-to-optimize-object-uploads-to-amazon-s3/ · https://aws.amazon.com/s3/faqs/ |
| Byte-Range Fetch: 특정 바이트 범위 병렬 → 다운로드 가속·부분 검색 | 동작 | 확인됨 | 동일 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance-guidelines.html |
| 메타데이터 x-amz-meta- 접두사·객체와 함께 반환 (S3-16) | 동작 | 확인됨 | 동일 + 부기: 업로드 후 수정 불가(복사로만) | https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingMetadata.html |
| "메타데이터·태그로 직접 검색 불가 → DynamoDB 인덱스가 정석" (S3-16 Exam) | 동작(시험 포인트) | 확인됨(통념 부합) | 목록 API에 태그/메타 필터 없음(반증 없음)·외부 인덱스는 통용 패턴. **부기: S3 Metadata(쿼리 가능한 Iceberg 테이블) 신기능 — "불가" 단정은 최신화 권장** | https://docs.aws.amazon.com/AmazonS3/latest/userguide/metadata-tables-overview.html |
| 액세스 포인트: 고유 DNS+자체 정책·VPC Origin은 VPC 내부만(VPC Endpoint 필요) (S3-17) | 동작 | 확인됨 | Network origin·VPC origin은 지정 VPC 외 거부·Gateway/Interface 엔드포인트 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-points-vpc.html · https://docs.aws.amazon.com/help-panel/AmazonS3/latest/console/hp-view-access-point-properties-page.html |
| Object Lambda: 구성 순서 버킷→(지원)AP→OLAP→Lambda→앱·반환 직전 변환 (S3-18) | 동작(시험 포인트) | 확인됨 | OLAP는 표준 AP 1개에 연결·GET 출력 변환(HEAD/LIST도 지원) | https://aws.amazon.com/s3/features/object-lambda/ · https://aws.amazon.com/blogs/storage/modify-images-cached-in-amazon-cloudfront-using-amazon-s3-object-lambda/ |
| 빈출도 미터(1~5)+freqNote | 메타 | 검증 불가(추정치) | 파일 스스로 "출제 경향 기반 상대 지표" 명기 — 문제 없음 | — |

## Task 커버리지 (담당: 1-1 S3 — Task 1.3 데이터 수명 주기 / Task 2.2 암호화 사례)

- **커버**: 스토리지 클래스 / 버킷 정책(JSON 실코드 포함) / 암호화 SSE-S3·KMS·DSSE·C·클라이언트 측(2.2) / presigned URL / 정적 호스팅+CORS / 이벤트 알림(+EventBridge) / 멀티파트 / 수명 주기(1.3) — RUBRIC §2 1-1 키워드 전부. 추가로 성능·복제·버전 관리·MFA Delete·액세스 로그·AP·Object Lambda·태그/메타데이터.
- **누락**: 없음 (1-1 필수 키워드 기준).
- **표면 커버**: 없음.
- **보강 권장 (누락 아님·부기)**: 전송 중 암호화 강제(aws:SecureTransport Deny 패턴) 부재 — Task 2.2 "저장/전송 중 암호화" 관점의 S3 단골 패턴으로 짝 파일에는 있음.

## 범위 이탈 (축1 L5 참조용)

- 없음. 18개 모듈 전부 1-1 S3 범위.

## 출제 각도 부정합

- 없음. "상황→정답"형 시험 포인트/주의 콜아웃과 freqNote(무엇이 출제되는지 한 줄)가 모듈마다 배치 — Task 동사("사용·구현") 정합 우수.

## 폐기 문항 (레거시 F4)

- 해당 없음 (퀴즈 성분 없음 → F4 N/A).

## 수정 지시 (실행 가능하게)

1. **5TB → 50TB (3곳)** — `D_Overview` 도식 텍스트("Value(본문) 최대 5TB"), S3-01 Fact 카드 "크기 한도"("객체 최대 5TB"), S3-01 Exam 콜아웃("'5TB 객체를 한 번에 PUT' 같은 함정") → "객체 최대 **50TB**(멀티파트 5MB~50TB), 단일 PUT 최대 5GB — 초과 시 멀티파트 필수"로 갱신 (함정 문구는 "단일 PUT은 5GB까지" 초점으로 유지). 근거: upload-objects.html
2. **평가 순서 문구 재표현 (1곳)** — S3-06 Exam 콜아웃 "버킷 정책이 기본 암호화보다 먼저 평가되므로" → "특정 방식 강제는 버킷 정책에서 암호화 헤더 불일치 PUT을 명시적으로 Deny하는 공식 패턴으로 구현"으로 재표현. 근거: UsingDSSEncryption.html 정책 예시
3. (경미) S3-01 버킷 네이밍 Fact — "소문자/숫자/하이픈만" → "소문자/숫자/하이픈/마침표(.)" + "시작·끝 모두 문자/숫자". 근거: bucketnamingrules.html
4. (경미) S3-09 설정 권한 Fact — "CLI로만 설정 가능" → "CLI/API로만(콘솔 불가)". 근거: UsingMFADelete.html
5. (보강 권장) S3-10에 "대상 버킷은 같은 리전·같은 계정" 요건 추가. S3-04 또는 S3-05에 전송 중 암호화 강제(aws:SecureTransport=false Deny) 블록 추가. 근거: enable-server-access-logging.html · example-bucket-policies.html
6. (부기·선택) S3-16에 S3 Metadata 신기능 각주, S3-05에 SSE-C 2026-04 신규 버킷 기본 차단 각주 — 판정 무관 최신화.
7. (보충 생성 목록) 퀴즈·해설 성분 부재 — 변환 단계 보충 생성 대상.

## 중복 관찰 (vs aws-dva-s3-guide.jsx — 판정 미반영)

- 주제 집합 사실상 동일: 18개 모듈이 상대 파일 17개 섹션과 1:1 대응(개요/버전/웹사이트/정책/암호화/기본 암호화/CORS/프리사인/MFA/로그/클래스/수명 주기/복제/이벤트/성능/태그·메타/AP/Object Lambda).
- 본 파일 고유: 버킷 정책 JSON 실코드·S3 Bucket Key 해결책·기본 암호화 2023-01 시점 명시·프리사인 SDK 기본 3600초·BPA "4개 설정"·GFR Bulk 무료·Object Lambda 데이터 보강 사례·freqNote.
- 상대 파일 고유: 전송 중 암호화 강제(aws:SecureTransport)·KMS 쿼터 수치·S3 Analytics 24~48h/매일 갱신·이벤트 전달 지연·수명 주기 복구 설계 시나리오.
- 수치·시험 포인트 거의 동일(공통 오류 5TB 포함) — 동일 원전 기반 재구성으로 추정. 통합 결정은 인간 몫.

## 스키마 피드백 요약

Fact 카드(구조화 스펙 그리드)·freqNote(빈출 사유 한 줄) 구조 → docs/SCHEMA_FEEDBACK_AXIS2.md에 제안 기록.
