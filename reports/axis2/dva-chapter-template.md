# 축2 리포트: dva-chapter-template

모드: 레거시 / 성분 태그: 설명 O(인출 카드) · 예시 X · 퀴즈 O · 해설 O / 매핑 챕터: 1-2·1-3·1-4 종합 / **판정: 수정** (사실 정확성은 전 항목 통과 — 수정 사유는 Task 커버리지 보강. 단독 챕터 기준 적용: 2026-07-13 캘리브레이션에서 인간 결정)

> 검증 방식 부기: 세션 MCP 클라이언트 단선으로 동일 AWS MCP 서버를 HTTP 직접 호출로 사용 (반환 URL 동일). 캐시: docs/VERIFIED_FACTS.md.

## 사실 검증표

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| 콜드 스타트 완화: Provisioned Concurrency 예열 (유료) | 동작(정답 근거) | 확인됨 | "pre-initialized execution environments... incurs additional charges" | https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html |
| Reserved Concurrency = 동시 실행 상한 예약·무료·다운스트림 보호 | 동작(정답 근거) | 확인됨 | "incurs no additional charges" + 부기: 현행 문서는 **상한+하한 겸용**으로 서술 (콘텐츠는 '상한'만 언급 — 경미, 오류 아님) | 위와 동일 URL |
| SnapStart: "Java/.NET은 SnapStart 활용" | 동작 | 확인됨 | 지원 런타임 Java 11+ / Python 3.12+ / .NET 8+ — 콘텐츠 나열은 부분집합으로 유효. 부기: Python도 현행 지원 | https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html |
| "메모리에 비례해 CPU 할당 → 메모리 올리면 초기화도 빨라짐" (c1 why + q2 오답 해설) | 동작(해설 근거) | 확인됨 | "CPU power linearly in proportion to memory. At 1,769 MB = one vCPU" | https://docs.aws.amazon.com/help-panel/lambda/latest/console/configuration-memory.html |
| DynamoDB 강한 일관성 = RCU 2배 소비, ConsistentRead=true, 기본은 최종 일관성 | 수치(정답 근거) | 확인됨 | 4KB: 강한 1회/RCU vs 최종 2회/RCU | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/provisioned-capacity-mode.html |
| API GW 프록시 통합(요청 전체 전달, 응답 형식 코드 책임) vs 비프록시(VTL 매핑) | 동작 | 확인됨 (통념 수준 — 표준 문서 서술 부합) | 동일 | (apigateway developerguide — 통합 유형) |
| DynamoDB Streams "항목 변경 순서 캡처" + Lambda 이벤트 소스 매핑 | 동작 | 확인됨 | "time-ordered sequence of item-level change" | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.html |
| q1 정답: SQS 버퍼 + 제한된 동시성 폴링 | 정답 | **이상 없음** | SQS가 스파이크 흡수, Reserved Concurrency가 소비 상한 — 다운스트림 보호 목적 부합 ("limiting concurrency to prevent overwhelming downstream resources, like database connections" — 문서가 정확히 이 용도 명시) | configuration-concurrency.html |
| q1 오답 해설: "API GW 캐싱은 읽기 응답에만 유효" | 동작(해설 근거) | 확인됨 | 스테이지 캐시는 GET 메서드 대상 | https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-caching.html |
| q2 정답: Provisioned Concurrency (콜드 스타트 SLA) | 정답 | **이상 없음** | "reducing cold start latencies... double-digit millisecond response times" | configuration-concurrency.html |
| m1 정답 SNS: 푸시 팬아웃·미보관 | 정답 | 이상 없음 | "SNS does not retain messages... discarded" + 푸시 전달 | https://aws.amazon.com/blogs/compute/choosing-between-messaging-services-for-serverless-applications/ |
| m2 정답 Kinesis: 샤드 순서 보장·보존 기간 내 재생·다중 소비자 | 정답 | 이상 없음 | 기본 24h~365일, "start reading at any point in the retention period" | https://aws.amazon.com/blogs/big-data/retaining-data-streams-up-to-one-year-with-amazon-kinesis-data-streams/ |
| m3 정답 SQS: 폴링·가시성 타임아웃·DLQ 재처리 | 정답 | 이상 없음 | 가시성 타임아웃 동작 문서 부합 | https://docs.aws.amazon.com/sdk-for-cpp/v1/developer-guide/examples-sqs-visibility-timeout.html |
| m4 정답 EventBridge: 규칙 패턴 매칭 라우팅+스케줄 | 정답 | 이상 없음 | 규칙→패턴→타깃 구조 확인 | https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is-how-it-works-concepts.html |

## Task 커버리지 (담당: 1-2·1-3·1-4 종합 — 단 역할이 "챕터 간이 테스트")

- **커버**: Lambda 동시성 2종·콜드 스타트·SnapStart(1.2.2, 1.2.6) / DDB 일관성 모델(1.3.2)·Streams / API GW 통합 유형(1.1.6) / 메시징 서비스 구분(1.1.8, 1.1.12)
- **누락(챕터 전체 기준)**: Lambda VPC·오류 처리·레이어·버전별칭 / DDB 키 설계·인덱스·용량·API / API GW 인증·스테이지·캐싱 상세 등 다수
- **판정 처리 (캘리브레이션 확정)**: 인간 결정(2026-07-13)에 따라 보조 역할 예외 없이 **단독 챕터 기준** 적용 → F1 누락이 수정 사유. 파일 헤더의 "간이 테스트" 주석은 참고로만 기록.

## 범위 이탈 (축1 L5 참조용)

- 없음. mixed(SQS/SNS/Kinesis/EventBridge)는 2단계 챕터 선행 노출이나, 교차학습 설계 의도로 명시되어 있음 — 이탈로 기록하지 않음 (축1 판단 참조).

## 출제 각도 부정합

- 없음 — 오히려 모범. 두 퀴즈 모두 제약 조건("아키텍처를 크게 바꾸지 않고", "가장 직접적인") 독해형이며, 오답 해설이 "어떤 상황이면 정답이 됐을지"를 포함 (축1 L2의 2점 앵커 충족 예시).

## 폐기 문항 (레거시 F4)

- **0건** — q1·q2 정답, 4지 해설 전부, mixed 4건 전부 사실 검증 통과.

## 수정 지시 (실행 가능하게)

1. **커버리지 보강 (수정 사유)** — 1-2·1-3·1-4 종합 챕터로서 최소한 다음 누락 키워드에 개념 카드 또는 퀴즈를 추가: Lambda 오류 처리(DLQ·Destinations)와 버전·별칭 / DynamoDB 키 설계·GSI vs LSI·Query vs Scan / API Gateway 인증 4종·스테이지. (현재 커버: 동시성 2종·콜드 스타트·일관성 모델·프록시 통합·Streams·메시징 구분)
2. (선택) c1 답변에 "Python 3.12+도 SnapStart 지원(현행)" 부기 — 시험 최신성
3. (선택) c4에 Reserved Concurrency가 현행 문서상 "상한+하한 겸용(전용 예약)"으로 서술됨을 반영

## 스키마 피드백 요약

선택지별 해설(options[].why), 인출 카드(concepts), 혼합복습(mixed), 역할→서비스 인출 도식(diagram) — 4건 모두 v0 미표현 구조 → docs/SCHEMA_FEEDBACK_AXIS2.md 기록. **이 파일이 스키마 v1 설계의 1급 참고 자료.**
