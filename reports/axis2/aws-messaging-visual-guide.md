# 축2 리포트: aws-messaging-visual-guide

모드: 레거시 / 성분 태그: 설명 O(13개 FIG 다이어그램 + 코드 스니펫 CLI/JSON) · 예시 O(비교표·CLI 예제) · 퀴즈 X · 해설 X / 매핑 챕터: 2-1 SQS · 2-2 SNS · 2-4 Kinesis / **판정: 수정** (F2 사실 정확성은 전 항목 통과 — 수정 사유는 F1 Task 커버리지 누락 1건: KCL/KPL 전무. 단독 챕터 기준: 2026-07-13 캘리브레이션 확정에 따라 커버리지 누락 자체가 수정 사유)

> 검증 방식: 이 배치 전용 mcp.sh(HTTP 직접 호출)로 AWS 공식 문서·FAQ 검색. 대부분의 사실 주장이 aws-dva-messaging.jsx와 동일 실체(SQS/SNS/Kinesis 표준 수치)라 캐시 및 상대 파일 검증 결과를 교차 적용, 신규 주장만 별도 검증.

## 사실 검증표

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| SQS 표준 큐 메시지 보존: 기본 4일, 60초~14일 | 수치 | 확인됨 | "1 minute to 14 days... default is 4 days" | https://aws.amazon.com/sqs/faqs/ |
| SQS 메시지 최대 256KB, 롱 폴링 최대 20초 | 수치 | 확인됨 | 262,144바이트 / 20초 | https://docs.aws.amazon.com/help-panel/AWSSimpleQueueService/latest/console/hp-createq-config-max-size.html · best-practices-setting-up-long-polling.html |
| 가시성 타임아웃 기본 30초, 최소 0초, 최대 12시간(META pills + Stat 카드 명시) | 수치 | 확인됨 — **정확도 우수**: 이 파일은 상대 파일과 달리 0초~12시간 범위를 명시적으로 카드에 기재 | "default... 30 seconds. The minimum is 0 seconds. The maximum is 12 hours" | https://docs.aws.amazon.com/powershell/v5/reference/items/Edit-SQSMessageVisibility.html |
| 지연 큐 최대 15분(900초), 기본 0초, FIFO는 큐 단위 지연만 지원(메시지별 DelaySeconds 미지원) | 수치/동작 | 확인됨(통념 수준 — 표준 SQS 지연 큐 문서 서술과 일치) | 최대 900초 | (표준 문서 서술, F2 절차상 수치 핵심 확인 후 동작 서술은 부차 판정) |
| FIFO 처리량 300 msg/s(배치 시 3,000 msg/s) | 수치 | 확인됨 — **기본값 한정** | "up to 3,000... with batching or up to 300... without batching" (기본). ⚠️ High Throughput Mode 활성화 시 배치 없이 최대 70,000 msg/s(2023-08 확대) 미언급 | https://aws.amazon.com/sqs/faqs/ |
| FIFO 중복 제거 창 5분, SHA-256 콘텐츠 기반 또는 MessageDeduplicationId | 수치/동작 | 확인됨 | 표준 FIFO 문서 서술과 일치 | (표준 서술) |
| SNS 구독 최대 1,250만/토픽, 토픽 최대 10만/계정 | 수치 | 확인됨 | "Subscriptions: Standard 12,500,000 per topic / Topics: Standard 100,000 per account" | https://docs.aws.amazon.com/general/latest/gr/sns.html |
| SNS는 메시지를 저장하지 않음(팬아웃 시 SQS와 결합 필요) | 동작 | 확인됨(캐시 재사용) | SNS 미보관·구독자 없으면 폐기 | 캐시: https://aws.amazon.com/blogs/compute/choosing-between-messaging-services-for-serverless-applications/ |
| Kinesis 샤드 쓰기 1MB/s·1,000건/s, 읽기 2MB/s(공유)/향상된 팬아웃 컨슈머당 2MB/s, 레코드 최대 1MB | 수치 | 확인됨 | 표준 샤드 용량 정의와 일치 | https://docs.aws.amazon.com/whitepapers/latest/cost-modeling-data-lakes/cost-optimization-in-analytics-services.html |
| Kinesis 보존 기본 24시간(최대 365일), 불변·재생 가능 | 수치/동작 | 확인됨(캐시 재사용) | 기본 24h~최대 365일 | 캐시: https://aws.amazon.com/blogs/big-data/retaining-data-streams-up-to-one-year-with-amazon-kinesis-data-streams/ |
| Firehose는 준실시간·버퍼(크기/시간) 기준 flush·미저장(리플레이 불가) | 동작 | 확인됨(통념 수준) | 표준 Firehose 서술과 일치 | (표준 서술) |
| Managed Flink 소스는 Data Streams·MSK이며 Firehose는 소스 아님 | 동작(함정 포인트) | 확인됨(통념 수준) | 소스 목록에 Firehose 미포함 | (표준 서술) |
| ProvisionedThroughputExceeded는 샤드당 처리 한도 초과 시 발생, 대응은 샤드 추가·온디맨드 전환 | 동작 | 확인됨 | 표준 오류 정의와 일치 | (표준 서술) |

## Task 커버리지 (담당: 2-1 SQS · 2-2 SNS · 2-4 Kinesis)

- **커버**: SQS 표준/FIFO, 액세스 정책(+CLI 정책 JSON 예시), 가시성 타임아웃(+범위 수치까지 명시), 롱 폴링, DLQ+Redrive, 지연 큐, 배치 API+확장 클라이언트, MessageGroupId / SNS 팬아웃, 필터 정책, 구독자 유형 / Kinesis 샤드·파티션 키·용량·Firehose·Flink·SQS/SNS/Kinesis 비교표
- **누락(F1, 수정 사유)**: **KCL(Kinesis Client Library)·KPL(Kinesis Producer Library) 용어가 본문·다이어그램 어디에도 등장하지 않음.** 커리큘럼 §2 "2-4 Kinesis(샤드, **KCL/KPL**, Firehose...)"가 명시적으로 요구하는 키워드이며, EXAM_TASK_MAP Task 1.1의 "SDK/API 호출" 항목과도 직결. 생산자·컨슈머 노드는 "SDK", "생산자", "소비자"로만 라벨링되어 SDK 종류를 특정하지 않음(D_Kinesis, s231 섹션 확인).
- **표면 커버 없음**: 그 외 항목은 원리+수치+CLI 예제+시험 포인트 콜아웃까지 포함해 심도 있음.

## 범위 이탈 (축1 L5 참조용)

없음.

## 출제 각도 부정합

없음 — 각 섹션 "⚑ 시험 포인트"·"⚠ 함정 주의" 콜아웃이 시나리오 지문 신호→서비스 매핑 형태로 일관.

## 폐기 문항 (레거시 F4)

N/A — 퀴즈 성분 없음.

## 수정 지시 (실행 가능하게)

1. **[수정 사유] KCL/KPL 보강** — Kinesis Data Streams 섹션(s231, "샤드와 순서" 또는 "용량·보존" 항목 인근)에 프로듀서 도구로 `AWS SDK, KPL(Kinesis Producer Library), Kinesis Agent`, 컨슈머 도구로 `KCL(Kinesis Client Library) 또는 SDK 직접 구현, 관리형(Lambda/Firehose/Flink)` 한 줄씩 추가. D_Kinesis 다이어그램의 생산자/소비자 노드 서브라벨에도 "SDK, KPL" / "KCL, SDK"를 반영(aws-dva-messaging.jsx의 동일 대목이 참고 가능한 표현).
2. (선택) FIFO 처리량 관련 Stat 카드·Warn 콜아웃(s226)에 "High Throughput Mode 활성화 시 배치 없이 최대 70,000 msg/s까지 확장 가능(2023-08 확대)" 한 줄 추가.
3. (선택) SNS 섹션(s228)에 SNS 자체의 리소스 기반 "액세스 정책"(교차 계정 게시 허용) 한 줄 보강 — 현재는 SQS 정책 맥락에서만 SNS가 언급됨.

## 중복 관찰

상대 파일(aws-dva-messaging.jsx) 대비:
- **고유**: CLI 명령어(`aws sqs receive-message`, `aws sqs send-message`)와 JSON 리소스 정책 예시 코드박스 — 상대 파일에는 코드 스니펫이 전혀 없음(다이어그램·텍스트만).
- **고유**: 가시성 타임아웃 범위(0초~12시간)를 Stat 카드로 명시적 수치화 — 상대 파일은 "기본 30초"만 언급하고 최대/최소값 텍스트 서술 없음(이 파일이 이 항목에서 더 정확·완전).
- **결여**: KPL/KCL 명칭 전무(위 F1 누락) — 상대 파일은 명시.
- **결여**: SNS 전용 리소스 기반 액세스 정책 별도 서술 없음 — 상대 파일은 별도 섹션으로 존재.
- **겹침**: SQS 표준/FIFO, DLQ, 롱 폴링, SNS 팬아웃, Kinesis 3사 비교표 등 핵심 사실 관계는 거의 동일(수치 전부 상호 정합, 상충 없음).
