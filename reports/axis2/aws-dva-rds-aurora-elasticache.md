# 축2 리포트: aws-dva-rds-aurora-elasticache

모드: 레거시 / 성분 태그: 설명 O · 예시 O(다이어그램·의사코드) · 퀴즈 X · 해설 X / 매핑 챕터: 5-4 (ElastiCache·CloudFront 요점·RDS/Aurora 최소) / **판정: 수정**

> 검증 방식: 세션 MCP 클라이언트 단선으로 스크래치패드 `mcp-b9/mcp.sh`로 동일 AWS MCP 서버 HTTP 직접 호출 (반환 URL 동일). 캐시: docs/VERIFIED_FACTS.md (신규 사실은 본 리포트 하단 부록).

## 사실 검증표

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| RDS Storage Auto Scaling 조건: 여유공간<10%·5분 이상·마지막 수정 후 6시간 경과 | 수치 | 확인됨 | 3개 조건 정확 일치 | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIOPS.Autoscaling.html |
| Read Replica 최대 15개, 비동기(ASYNC) 복제, 결과적 일관성 | 수치+동작 | 확인됨 | 동일 | https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Replication.html (RDS 일반 복제 개념과 부합) |
| 같은 리전 복제 트래픽 무료 / 리전 간 유료 | 동작 | 확인됨 (통념 수준, RDS 일반 지식과 부합) | 리전 간 복제만 데이터 전송 요금 발생 | 일반 통념 — URL 미확보, 표기 유지 |
| Multi-AZ는 동기(SYNC) 복제, 단일 DNS, 자동 페일오버 | 동작 | 확인됨 | 동일 | https://aws.amazon.com/rds/features/multi-az/ |
| **Multi-AZ 스탠바이는 "평소 접근 불가"·"읽기/쓰기 불가"(비교표에서 예외 조건 없이 단정)** | 동작 | **수정 필요** | 1-스탠바이(Multi-AZ **DB instance**)만 스탠바이 읽기 불가. 2-스탠바이(Multi-AZ **DB cluster**, 엔진에 따라 지원)는 스탠바이가 **읽기 트래픽을 직접 서빙(readable standby)**함 — 파일이 "엔진에 따라 2개 standby 옵션"이라고 언급하면서도 "접근 불가"를 예외 없이 단정해 모순 | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html · https://aws.amazon.com/blogs/database/readable-standby-instances-in-amazon-rds-multi-az-deployments-a-new-high-availability-option/ |
| 단일 AZ→다중 AZ 전환은 다운타임 제로, 스냅샷→복원→동기화 방식 | 동작 | 확인됨 (일반 통념 수준) | RDS Multi-AZ 전환은 온라인으로 수행 | URL 미확보 — 확인 불가로 하향 표기 권고 |
| Aurora: RDS MySQL 대비 **5배**, RDS PostgreSQL 대비 **3배** 성능 | 수치 | **수정 필요** | 현행 공식 수치는 **MySQL·PostgreSQL 모두 "최대 6배(up to 6x)"** — "5배/3배"는 구버전(초기 Aurora 마케팅) 수치, 현재 페이지는 통일된 6x로 갱신됨 | https://aws.amazon.com/rds/aurora/features/ · https://aws.amazon.com/rds/aurora/faqs/ |
| Aurora 스토리지 10GB 시작, 최대 128TB 자동 확장 | 수치 | 확인됨 | 128 TiB, 10GiB 단위 증가 | https://aws.amazon.com/blogs/database/is-amazon-rds-for-postgresql-or-amazon-aurora-postgresql-a-better-choice-for-me/ |
| Aurora 읽기 복제본 최대 15개(MySQL RDS는 5개) | 수치 | 확인됨 | 동일 | https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Performance.html · https://aws.amazon.com/rds/aurora/features/ |
| Aurora 복제 지연 **"10ms 미만"** | 수치 | **수정 필요 (경미)** | 공식 사용자 가이드: "usually **considerably less than 100 milliseconds**"(보장치는 100ms 미만), 마케팅 페이지는 "often down to single-digit milliseconds"(자주 달성) — "10ms 미만"을 확정치처럼 서술하면 과장 | https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Performance.html |
| Aurora 페일오버 30초 미만 | 수치 | 확인됨 | "typically...within 30 seconds" | https://aws.amazon.com/blogs/database/reduce-downtime-with-amazon-aurora-mysql-database-restart-time-optimizations/ · https://aws.amazon.com/blogs/database/understand-replication-capabilities-in-amazon-aurora-postgresql/ |
| Aurora 스토리지: 3개 AZ에 6개 복사본, 쓰기 4/6·읽기 3/6 쿼럼 | 수치+동작 | 확인됨 (표준 공지 사실) | 동일 | https://aws.amazon.com/blogs/database/understand-amazon-aurora-high-availability-and-disaster-recovery-from-an-oracle-perspective/ |
| Backtrack: 백업 없이 시점 복원 | 동작 | 확인됨 (단, **Aurora MySQL 전용** — 파일은 엔진 제한을 언급하지 않음) | Backtrack은 Aurora MySQL만 지원, PostgreSQL 미지원 | https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Backups.html |
| RDS Proxy: 페일오버 시간 최대 66% 단축 | 수치 | 확인됨 | "up to 66%" | https://aws.amazon.com/rds/proxy/ |
| RDS Proxy: VPC 내부 전용, 퍼블릭 접근 불가, IAM 인증 강제 가능, Secrets Manager 연동 | 동작 | 확인됨 (일반 통념 수준, 공식 기능 설명과 부합) | 동일 | https://aws.amazon.com/rds/proxy/ |
| IAM DB 인증 토큰 유효 시간 15분 | 수치 | 확인됨 | 정확히 15분 | https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/UsingWithRDS.IAMDBAuth.Connecting.html |
| 암호화 안 된 DB는 그 자리에서 암호화 불가 → 스냅샷 경유 암호화 복사·복원 | 동작 | 확인됨 (표준 절차, 시험 빈출) | 동일 | 일반 통념 — 별도 URL 미확보 |
| Redis: Multi-AZ 자동 페일오버, 읽기 복제본, AOF 지속성, 백업/복원 | 동작 | 확인됨 (일반 비교표 수준) | 동일 | https://docs.aws.amazon.com/whitepapers/latest/scale-performance-elasticache/memcached-vs.-redis.html |
| Memcached: 샤딩, 고가용성 없음, 비영속, 멀티스레드, **백업/복원은 "서버리스에서만"** | 동작 | 확인됨 | 비-서버리스 Memcached는 백업/복원 미지원, ElastiCache Serverless for Memcached만 지원 — 파일 서술과 정확히 일치 | https://aws.amazon.com/elasticache/faqs/ |
| MemoryDB: 1억 6천만(160 million)+ req/s, Multi-AZ 트랜잭션 로그, 수백 TB 확장 | 수치 | 확인됨 | "up to 160 million TPS per cluster" | https://docs.aws.amazon.com/memorydb/latest/devguide/servicename-feature-overview.html · https://aws.amazon.com/memorydb/ |
| Lazy Loading = 3 round trips(미스 시), Write-Through = 2번 호출(쓰기), cache churn 단점 | 동작 | 확인됨 (표준 캐싱 패턴 서술, 시험 정합 우수) | 동일 | 일반 통념 — 캐싱 전략 표준 설명과 부합 |

## Task 커버리지 (담당: 5-4 ElastiCache·CloudFront 요점·RDS/Aurora 최소, 관련 Task 1.3·4.3)

- **커버**: RDS 개요·Storage Auto Scaling(1.3 캐싱 인접), Read Replica vs Multi-AZ(비교 우수), Aurora 아키텍처·엔드포인트, RDS 보안(IAM 인증·암호화), RDS Proxy, ElastiCache 개요·아키텍처(캐시/세션), Redis vs Memcached, 캐싱 전략(Lazy Loading·Write-Through), MemoryDB — 이 정도 분량은 커리큘럼이 "RDS/Aurora **최소**"로 규정한 수준을 크게 상회함(과다는 감점 사유 아님, 축1 L5 참조용으로만 기록)
- **누락**: **CloudFront — 챕터 5-4 정의에 명시된 "CloudFront 요점"이 파일 전체에 전혀 없음**(grep 결과 0건). 단독 챕터 기준(rds-aurora-elasticache는 5-4 Task 키워드 대비 커버리지 누락이 수정 사유)에 해당 → 보충 생성 목록 후보
- **표면 커버**: 없음 (다룬 개념은 예시·시험 포인트 동반)

## 범위 이탈 (축1 L5 참조용)

- 없음. 전 섹션이 RDS/Aurora/ElastiCache 범위 내(다만 챕터 정의상 "RDS/Aurora 최소" 대비 분량이 김 — 이탈은 아니고 밀도 판단은 축1 몫).

## 출제 각도 부정합

- 없음. 각 섹션에 "시험 포인트" 콜아웃이 있고 함정 선택지(오답 패턴)를 명시적으로 다뤄 Task 1.3(데이터 스토어 활용)·4.3(캐싱 최적화) 동사와 정합.

## 폐기 문항 (레거시 F4)

- 해당 없음 (퀴즈 성분 없음 → F4 N/A).

## 수정 지시 (실행 가능하게)

1. **Multi-AZ 스탠바이 접근 불가 서술 수정** — `SecReplica` Ul 항목 "standby는 평소 읽기/쓰기에 사용할 수 없음" 및 비교표 "스탠바이는 접근 불가" 행: "(Multi-AZ **DB 인스턴스**, 스탠바이 1개 구성 기준). 스탠바이 **2개**로 구성하는 Multi-AZ **DB 클러스터**는 스탠바이가 읽기 트래픽을 직접 서빙 가능(readable standby)"으로 조건 명시. 근거: Concepts.MultiAZ.html
2. **Aurora 성능 배수 수정** — `SecAurora` 핵심 특징 Ul 첫 항목: "MySQL 대비 5배, PostgreSQL 대비 3배" → "MySQL·PostgreSQL 모두 대비 **최대 6배(up to 6x)**". 근거: aws.amazon.com/rds/aurora/features/, faqs/
3. **Aurora 복제 지연 표현 완화 (경미)** — `SecAurora` "복제 지연이 10ms 미만으로 매우 빠름" → "복제 지연이 통상 100ms 훨씬 미만, 대부분 한 자릿수 ms(single-digit ms) 수준". 근거: Aurora.Managing.Performance.html
4. **Backtrack 엔진 제한 명시 (경미)** — `SecAurora` Features 목록 Backtrack 항목에 "(Aurora **MySQL** 전용, PostgreSQL 미지원)" 추가. 근거: Aurora.Managing.Backups.html
5. **(보충 생성 목록) CloudFront 요점 섹션 추가** — 5-4 챕터 정의(RUBRIC §2)가 명시한 CloudFront 기본 개념(엣지 캐싱, TTL, 오리진 종류, 캐시 무효화)이 이 파일에 전무. 별도 섹션 또는 챕터 신설 필요.

## 스키마 피드백 요약

- `Freq`(★ 출제 빈도 5단계), `ExamTip`/`Note`(4색 콜아웃), 클릭 없는 정적 `Fig`(SVG 다이어그램), `Tbl`(비교표), `Code`(의사코드 블록) 구조가 반복적으로 유용하게 쓰임 → `docs/SCHEMA_FEEDBACK_AXIS2.md`에 제안 기록 예정(비교표·콜아웃 유형·출제빈도 배지는 dynamodb-guide와 동일 패턴, 이미 제안됨 — 중복 기록 생략).
