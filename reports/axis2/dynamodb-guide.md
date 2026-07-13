# 축2 리포트: dynamodb-guide

모드: 레거시 / 성분 태그: 설명 O · 예시 O · 퀴즈 X · 해설 X / 매핑 챕터: 1-3 / **판정: 수정**

> 검증 방식 부기: 세션 MCP 클라이언트 단선으로 동일 AWS MCP 서버를 HTTP 직접 호출로 사용 (반환 URL 동일). 캐시: docs/VERIFIED_FACTS.md.

## 사실 검증표

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| TTL: "만료 후 48시간 이내 삭제" (본문·도식 캡션·치트시트 3곳) | 수치 | **수정 필요** | 현행 문서: "만료 후 **며칠 이내**(within a few days)" — 48시간 문구는 구버전 | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html |
| 용량 모드: "두 모드는 24시간에 1회 전환" (콜아웃·치트시트 2곳) | 수치 | **수정 필요** | 현행: 프로비저닝→온디맨드 **24h 롤링 윈도우당 최대 4회**, 온디맨드→프로비저닝 **언제든** | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Constraints.html |
| "데이터는 3개 AZ에 자동 복제" | 동작 | 수정 필요 (경미) | 문서 표현: "여러(multiple) AZ에 자동 복제" — '3개' 명시 아님 | https://docs.aws.amazon.com/whitepapers/latest/big-data-analytics-options/amazon-dynamodb.html |
| "파티션당 저장 용량 약 10GB" (한도 표) | 수치 | **확인 불가** | 현행 개발자 안내서에 물리 파티션 10GB 명시 문구 미발견. 확인된 인접 사실: LSI 보유 테이블의 아이템 컬렉션 최대 10GB | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/LSI.html |
| 항목 최대 400KB | 수치 | 확인됨 | 400KB | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/CheatSheet.html |
| WCU = 1KB 이하 초당 1쓰기, 올림 | 수치 | 확인됨 | 동일 | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/provisioned-capacity-mode.html |
| RCU = 4KB 강한 일관성 초당 1회 / 최종 일관성 초당 2회 | 수치 | 확인됨 | 동일 | 위와 동일 URL |
| 트랜잭션 읽기·쓰기 용량 2배 | 수치 | 확인됨 | 1KB 쓰기 1회 = 2 WCU | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/read-write-operations.html |
| 트랜잭션 최대 100개 항목/4MB | 수치 | 확인됨(부분) | 100 액션 확인. 4MB는 스니펫 미확보(통상 문서값) — 미검증 표기 | https://aws.amazon.com/dynamodb/features/ |
| BatchWriteItem 25개/16MB, Update 아님 | 수치 | 확인됨 | 동일 | https://docs.aws.amazon.com/botocore/latest/reference/services/dynamodb/client/batch_write_item.html |
| BatchGetItem 100개/16MB | 수치 | 확인됨 | 동일 | https://docs.aws.amazon.com/cli/latest/reference/dynamodb/batch-get-item.html |
| Query/Scan 1회 1MB 페이지, LastEvaluatedKey | 수치 | 확인됨 | 동일 | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.Pagination.html |
| 파티션 키 값당 3,000 RCU/1,000 WCU 상한 | 수치 | 확인됨 | 동일 (partition key value 기준) | https://aws.amazon.com/blogs/database/choosing-the-right-dynamodb-partition-key/ |
| LSI 5개·생성 시에만·처리량 공유·강한 일관성 가능 | 수치+동작 | 확인됨 | 동일 | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ServiceQuotas.html · LSI.html |
| GSI 20개(기본)·언제든 추가·독립 처리량·최종 일관성만 | 수치+동작 | 확인됨 | 동일 | ServiceQuotas.html |
| GSI 쓰기 용량 부족 → 본 테이블 쓰기 스로틀 | 동작(시험 포인트) | 확인됨 | 동일 | https://docs.aws.amazon.com/whitepapers/latest/comparing-dynamodb-and-hbase-for-nosql/global-secondary-index-considerations.html |
| Streams 24시간 보관·view type 4종 | 수치 | 확인됨 | 동일 | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.html |
| Kinesis DDB 통합 최대 1년 보관 | 수치 | 확인됨 | 기본 24h, 최대 365일 | https://docs.aws.amazon.com/streams/latest/dev/kinesis-extended-retention.html |
| DAX 기본 TTL 5분·최대 10노드·μs 지연 | 수치 | 확인됨 | 항목/쿼리 캐시 각 5분, 프라이머리 1+복제본 9 | DAX.cluster-management.html · DAX.concepts.cluster.html |
| PITR 35일 | 수치 | 확인됨 | 최근 35일(보존 1~35일 설정 가능) | Introduction.html (Resilience 절) |
| TTL 삭제 WCU 무료·만료 항목 일시 조회됨 | 동작(시험 포인트) | 확인됨 | 동일 | TTL.html |
| dynamodb:LeadingKeys 세밀 접근 제어 | 동작(시험 포인트) | 확인됨 | 동일 | specifying-conditions.html |
| 글로벌 테이블은 Streams 필요 | 동작(시험 포인트) | 확인됨 | 확인 + 부기: 현행(MREC)은 복제본에 Streams **기본 활성·비활성 불가** | aws.amazon.com/dynamodb/faqs/ · V2globaltables_HowItWorks.html |
| 조건부 쓰기·낙관적 잠금·원자적 카운터·쓰기 샤딩 서술 | 동작 | 확인됨 (통념 수준 포함) | 패턴 서술 문서 부합 | specifying-conditions.html 외 |

## Task 커버리지 (담당: Task 1.3 — 데이터 스토어 활용)

- **커버**: 고카디널리티 파티션 키(1.3.1) / 일관성 모델(1.3.2) / Query vs Scan(1.3.3) / 키·인덱싱(1.3.4) / 데이터 수명 주기 TTL(1.3.7) / 캐싱 DAX(1.3.8) / OpenSearch 언급(1.3.9, Streams 색인) / CLI 페이지네이션(0-1 겹침이나 유용)
- **누락**: 직렬화/역직렬화(1.3.5) — 보충 생성 목록 후보
- **표면 커버**: 없음 (커버 항목은 예시·함정 포인트 동반)

## 범위 이탈 (축1 L5 참조용)

- 없음. 전 섹션이 1-3 챕터 범위 내.

## 출제 각도 부정합

- 없음. Task 동사("사용·정의") 대비 시나리오·함정·정답 근거 중심 서술로 정합 우수. 섹션마다 "시험 포인트" 콜아웃이 출제 각도를 직접 제시.

## 폐기 문항 (레거시 F4)

- 해당 없음 (퀴즈 성분 없음 → F4 N/A).

## 수정 지시 (실행 가능하게)

1. **TTL 3곳 수정** — `S_ttl` 본문 불릿·`DiaTTL` 캡션·치트시트 TTL 행: "만료 후 48시간 이내/48h 내" → "만료 후 며칠 이내(within a few days, 테이블 크기·활동에 따라 변동)". 근거: TTL.html
2. **용량 모드 전환 2곳 수정** — `S_throughput` 경고 콜아웃·치트시트 용량 모드 행: "24시간에 1회 전환" → "프로비저닝→온디맨드는 24시간 롤링 윈도우당 최대 4회, 온디맨드→프로비저닝은 언제든". 근거: Constraints.html
3. (경미) `S_overview` 고가용성 카드: "3개 AZ에 자동 복제" → "리전 내 여러 AZ에 자동 복제"
4. (권고) `S_keys` 한도 표의 "파티션당 저장 용량 약 10GB" 행: 삭제하거나 "LSI 보유 테이블의 아이템 컬렉션 최대 10GB (LSI.html)"로 재표현 — 현행 문서에 물리 파티션 10GB 명시 없음
5. (보충 생성 목록) 직렬화/역직렬화(1.3.5) 개념 블록 추가 필요

## 스키마 피드백 요약

빈출도 배너(1~5)·치트시트 표·콜아웃 4유형 → docs/SCHEMA_FEEDBACK_AXIS2.md에 제안 기록.
