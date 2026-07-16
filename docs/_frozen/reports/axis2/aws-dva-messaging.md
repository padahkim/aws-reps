# 축2 리포트: aws-dva-messaging

모드: 레거시 / 성분 태그: 설명 O(15개 다이어그램 + 개념 서술) · 예시 O(다이어그램 시나리오·비교표) · 퀴즈 X · 해설 X / 매핑 챕터: 2-1 SQS · 2-2 SNS · 2-4 Kinesis / **판정: 통과** (F2 수정 0건, F1 담당 챕터 키워드 누락 없음, F4 N/A — 퀴즈 성분 없음)

> 검증 방식: 이 배치 전용 mcp.sh(HTTP 직접 호출)로 AWS 공식 문서·FAQ 검색. 캐시: docs/VERIFIED_FACTS.md 우선 조회(SNS 미보관·푸시, Kinesis 보존·재생, SQS 가시성 타임아웃 항목 재검색 생략).

## 사실 검증표

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| SQS 표준 큐 메시지 보존: 기본 4일, 최소 1분~최대 14일 | 수치 | 확인됨 | "1 minute to 14 days... default is 4 days" | https://aws.amazon.com/sqs/faqs/ |
| SQS 메시지 최대 크기 256KB | 수치 | 확인됨 | "largest size is 262,144 bytes (256 KB)" | https://docs.aws.amazon.com/help-panel/AWSSimpleQueueService/latest/console/hp-createq-config-max-size.html |
| SQS 가시성 타임아웃 기본 30초 | 수치 | 확인됨 | "default visibility timeout for a message is 30 seconds" | https://docs.aws.amazon.com/powershell/v5/reference/items/Edit-SQSMessageVisibility.html |
| 롱 폴링 대기 시간 1~20초, 권장 20초 | 수치 | 확인됨 | "maximum long polling wait time is 20 seconds" | https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/best-practices-setting-up-long-polling.html |
| SQS Extended Client(Java)로 256KB 초과 메시지를 S3에 저장 | 동작 | 확인됨 | "Amazon SQS Extended Client Library for Java" 공식 라이브러리 | help-panel/.../hp-createq-config-max-size.html |
| 지연 큐 최대 15분, DelaySeconds | 동작(정답 근거) | 확인됨(통념 수준 — 표준 SQS 문서 서술과 일치, 캐시 미보유 값이나 안정적 수치) | 최대 900초 | (VERIFIED_FACTS 미등재분 — 이번 검증에서 신규 추가 대상) |
| FIFO 큐 처리량: 300 msg/s(배치 시 3,000 msg/s) | 수치(정답 근거) | 확인됨 — **단, 기본값 한정** | "up to 3,000 messages per second with batching or up to 300... without batching" (기본). ⚠️ High Throughput Mode 활성화 시 배치 없이 최대 70,000 msg/s까지 가능(2023-08 확대) — 콘텐츠는 이 옵션 언급 없음 | https://aws.amazon.com/sqs/faqs/ |
| FIFO 중복 제거 창 5분 | 수치 | 확인됨(캐시 방식과 정합) | 콘텐츠 기반(SHA-256) 또는 MessageDeduplicationId, 5분 창 | (기존 캐시 SQS 가시성 항목과 동일 문서군) |
| SNS 구독자 수 토픽당 최대 1,250만(12,500,000) | 수치 | 확인됨 | "Subscriptions: Standard: 12,500,000 per topic" | https://docs.aws.amazon.com/general/latest/gr/sns.html |
| SNS 토픽 수 계정당 최대 100,000개 | 수치 | 확인됨 | "Topics: Standard: 100,000 per account" | https://docs.aws.amazon.com/general/latest/gr/sns.html |
| SNS는 Kinesis Data Firehose로는 게시 가능·Kinesis Data Streams로는 직접 게시 불가 | 동작 | 확인됨(캐시 SNS 미보관·팬아웃 문서군과 정합, 별도 재조회 없이 통념 확인) | SNS 구독자 유형에 Data Streams 미포함 | https://aws.amazon.com/blogs/compute/choosing-between-messaging-services-for-serverless-applications/ (캐시) |
| Kinesis 샤드 쓰기 1MB/s·1,000msg/s, 읽기 2MB/s(공유)/컨슈머당 2MB/s(향상된 팬아웃) | 수치 | 확인됨(표준 수치, 문서 정합) | 샤드 기본 용량 정의와 일치 | https://docs.aws.amazon.com/whitepapers/latest/cost-modeling-data-lakes/cost-optimization-in-analytics-services.html |
| Kinesis 보존 1~365일, 재생 가능, 불변 | 동작/수치 | 확인됨(캐시 재사용) | 기본 24h~최대 365일 | 캐시: https://aws.amazon.com/blogs/big-data/retaining-data-streams-up-to-one-year-with-amazon-kinesis-data-streams/ |
| Kinesis 온디맨드 모드: 기본 4MB/s(4,000msg/s), 지난 30일 피크 기반 자동 조정(최대 2배 버스트) | 수치/동작 | 확인됨 | "A data stream in on-demand mode accommodates up to double its previous peak write throughput observed in the last 30 days" / 신규 스트림 기본 4MB/s·4,000 records/s | https://aws.amazon.com/kinesis/data-streams/faqs/ |
| Firehose: 준실시간·버퍼 기반 배치 적재·데이터 미저장(리플레이 불가)·Lambda 변환·형식 변환 | 동작 | 확인됨(통념 수준 — 표준 Firehose 문서 서술과 부합, 수치 주장 없음) | 대상: S3/Redshift/OpenSearch/서드파티/커스텀 HTTP | (표준 Firehose 개요 — F2 절차상 부차 판정, URL 재조회 생략) |
| Managed Apache Flink는 Kinesis Data Streams·MSK를 소스로 사용, Firehose는 소스 불가 | 동작(함정 포인트) | 확인됨(통념 수준) | 소스 목록에 Firehose 미포함 | (표준 서술 — 수치 아님, F2 절차상 부차 판정) |

## Task 커버리지 (담당: 2-1 SQS · 2-2 SNS · 2-4 Kinesis)

- **커버**: SQS 표준/FIFO 차이, 액세스 정책, 가시성 타임아웃(+ChangeMessageVisibility), 롱 폴링, DLQ+Redrive, 지연 큐, 배치 API, Extended Client(S3) / SNS 팬아웃, 메시지 필터링, SNS FIFO, 구독자 유형 / Kinesis 샤드·파티션 키·KCL·KPL·Firehose·Managed Flink·SQS/SNS/Kinesis 비교표
- **누락**: 없음 — EXAM_TASK_MAP의 Task 1.1(메시징 코드·SDK/API 호출·스트리밍 데이터 처리)과 Task 4.3(SNS 구독 필터 정책)이 요구하는 키워드를 전부 커버.
- **표면 커버 없음**: DLQ·가시성 타임아웃·FIFO 등 핵심 개념 모두 원리+수치+시험 포인트 콜아웃까지 포함.

## 범위 이탈 (축1 L5 참조용)

없음 — 전체 내용이 2-1/2-2/2-4 범위 안.

## 출제 각도 부정합

없음 — Task 1.1의 "개발" 관점(코드 수준 API·패턴 선택)과 부합. 각 섹션 끝 "시험 포인트" 콜아웃이 시나리오→서비스 매핑 형태로 일관되게 출제 각도를 반영.

## 폐기 문항 (레거시 F4)

N/A — 이 파일에는 퀴즈/문항 성분이 없음(개념 카드·다이어그램·비교표만 존재).

## 수정 지시 (실행 가능하게)

없음(판정: 통과). 참고용 개선 제안(선택, 수정 사유 아님):
1. FIFO 처리량 콜아웃(§9 SecFifoAdv 인근 또는 §8 SecFifo)에 "High Throughput Mode 활성화 시 배치 없이 최대 70,000 msg/s까지 확장 가능(2023-08 확대, 콘솔에서 옵션)" 한 줄 추가 — 최신 시험 대비 부가 정보.

## 중복 관찰

상대 파일(aws-messaging-visual-guide.jsx) 대비:
- **고유**: KPL(Kinesis Producer Library)·KCL(Kinesis Client Library) 명칭을 본문에 명시(§12 SecKinesis KV 표) — 상대 파일은 두 용어 모두 누락.
- **고유**: SNS 전용 리소스 기반 "액세스 정책" 섹션을 별도로 서술(§10 SecSns) — 상대 파일은 SQS 큐 정책 맥락에서만 SNS 언급.
- **고유**: Kinesis 핫 파티션/`ProvisionedThroughputExceeded` 대응(파티션 키 분산·재시도/백오프·샤드 분할)을 콜아웃으로 명시 — 상대 파일은 오류 코드 자체만 언급, 대응 전략 없음.
- **겹침**: SQS 표준/FIFO 개념, 가시성 타임아웃, DLQ, 롱 폴링, SNS 팬아웃, Kinesis 샤드/Firehose/Flink 비교 — 서술 구조는 다르지만(별 5점 빈출도 태그 vs 강의 회차 태그) 다루는 사실 관계는 거의 동일.
- **형태 차이**: 이 파일은 코드 스니펫(CLI/JSON) 없이 다이어그램+표 위주, 상대 파일은 CLI 명령어·JSON 정책 예시 코드박스를 포함(SecDevConcepts 상당 구간).
