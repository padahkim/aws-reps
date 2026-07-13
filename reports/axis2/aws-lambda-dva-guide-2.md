# 축2 리포트: aws-lambda-dva-guide-2

모드: 레거시 / 성분 태그: 설명 O · 예시 O(인터랙티브 슬라이더·클릭 비교·SVG 타임라인·시나리오→정답 패턴 리스트, 실행 가능 코드는 없음) · 퀴즈 X(시나리오→정답 리스트는 선택지·해설 구조 아님) · 해설 X / 매핑 챕터: 1-2 Lambda / **판정: 수정**

> 검증 방식 부기: 세션 MCP 클라이언트 단선으로 동일 AWS MCP 서버를 HTTP 직접 호출로 사용 (반환 URL 동일). 캐시: docs/VERIFIED_FACTS.md.
> 중복 부기: aws-lambda-dva-guide.jsx와 실질 중복 쌍 — 사용자 결정으로 둘 다 정식 평가 (하단 「중복 관찰」).
> 규모 부기: 1704줄·7탭(1.개요~7.시험 핵심 요약, "숫자 암기표" 통합 요약 포함).

## 사실 검증표

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| Tab2 콜드 스타트: "콜드 스타트 구간 최대 10초" | 수치 | **확인 불가** | 콜드 스타트 지연은 런타임·초기화 코드·패키지 크기에 따라 가변적 — 현행 공식 문서에서 "최대 10초"라는 상한 명시를 찾지 못함. 단정적 수치 삭제 또는 "런타임·초기화 코드에 따라 가변, 통상 수백ms~수 초" 재표현 권고 | — |
| Tab1/7: 타임아웃 기본 3초·최대 900초(15분) | 수치(시험 포인트) | 확인됨 | 동일 | https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html |
| Tab1/7: 메모리 128MB~10,240MB, CPU 비례, **1,769MB=1vCPU** | 수치(시험 포인트) | 확인됨 | 정확히 일치 (파일1의 "1,792MB" 오기와 달리 본 파일은 정확) | https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html |
| Tab1/7: /tmp 512MB~10GB | 수치 | 확인됨 | 동일 | gettingstarted-limits.html |
| Tab1/7: 환경 변수 총 4KB | 수치 | 확인됨 | 동일 | gettingstarted-limits.html |
| Tab1/7: 배포 패키지 zip 50MB / 해제 250MB / 컨테이너 10GB | 수치 | 확인됨 | 동일 | gettingstarted-limits.html |
| Tab1/4/7: 동시성 기본값 계정당 1,000(소프트 리밋), 리전 단위 | 수치(시험 포인트) | 확인됨 | 동일 | https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html |
| Tab3: 동기 호출 — 오류 시 재시도 없음, 호출자 책임 | 동작 | 확인됨 | 동기 호출은 Lambda가 재시도하지 않고 오류를 즉시 클라이언트에 반환 | — (파일1 §03과 원리 동일) |
| Tab3: 비동기 — 202 즉시 반환, 기본 재시도 2회(총 3회 시도) | 수치+동작(시험 포인트) | 확인됨 | 동일 | https://docs.aws.amazon.com/lambda/latest/dg/invocation-async-error-handling.html |
| Tab4: 동기 스로틀 = 429 TooManyRequestsException | 동작 | 확인됨 | 동일 | — |
| Tab4: 비동기 스로틀 — 최대 6시간 동안 자동 재시도 | 수치(시험 포인트) | 확인됨 | 동일("최대 age 6시간까지 큐 보관 후 지수 백오프 재시도") | https://docs.aws.amazon.com/lambda/latest/dg/invocation-async-configuring.html |
| Tab4: Reserved Concurrency 무료 / Provisioned Concurrency 유료 | 동작(시험 포인트) | 확인됨 | 기존 VERIFIED_FACTS 캐시와 일치 | https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html |
| Tab5: 레이어 최대 5개 / 함수+레이어 합산 250MB(해제) | 수치 | 확인됨 | 동일 | gettingstarted-limits.html |
| Tab5: 가중치 별칭 트래픽 분배는 **최대 2개 버전**까지 | 수치(시험 포인트) | 확인됨 | Lambda AliasRoutingConfiguration의 AdditionalVersionWeights는 "the second version"만 지정 가능 — 주 버전+추가 버전 1개, 총 2개로 제한 | https://docs.aws.amazon.com/aws-sdk-php/v3/api/api-lambda-2015-03-31.html (AliasRoutingConfiguration) |
| Tab5: "Provisioned Concurrency·가중치 트래픽은 $LATEST에 설정 불가, 게시된 버전/별칭에만 가능" | 동작(시험 포인트, "함정" 표기) | 확인됨 (통념 수준, 공식 개념과 부합) | 프로비저닝 동시성·별칭 라우팅은 버전 대상 설정으로 $LATEST(가변)에는 적용 불가하다는 것이 Lambda 버전/별칭 모델의 공식 원리 | — |
| Tab6: VPC 연결 시 ENI 생성, `AWSLambdaVPCAccessExecutionRole` 필요, 기본 인터넷 접근 소실 | 동작(시험 포인트) | 확인됨 | 파일1 §15와 원리 동일, 관리형 정책명도 정확 | — |
| Tab6: CloudWatch Logs는 `AWSLambdaBasicExecutionRole` 필요 | 동작 | 확인됨 | 동일 | — |
| Tab6: X-Ray 환경 변수 `_X_AMZN_TRACE_ID`, `AWS_XRAY_DAEMON_ADDRESS` | 동작 | 확인됨 (통념 수준) | X-Ray SDK/데몬 통합의 표준 환경 변수명과 부합 | — |
| Tab7: "Destinations가 DLQ보다 AWS 권장" | 동작 | 확인됨 (근사) | 공식 문서는 "DLQ의 대안(alternative)"으로 Destinations를 제시하며 성공/실패 모두 지원+풍부한 컨텍스트를 이점으로 설명 — "권장"이라는 단정보다는 "대안이자 이점이 많음" 정도가 정확한 뉘앙스, 결론은 부합 | https://docs.aws.amazon.com/lambda/latest/dg/invocation-async-retain-records.html |
| Tab3: ESM 큐 폴링 — SQS는 성공 메시지 삭제, Kinesis/DDB Streams는 샤드 순서 보장·성공까지 재시도 | 동작(시험 포인트) | 확인됨 (통념 수준) | 파일1 §08과 원리 동일 | — |

## Task 커버리지 (담당: Task 1.2 Lambda 코드 개발 전체 + 2.3 환경 변수·3.3 별칭·3.4 패키징·4.3 동시성·메모리)

- **커버**: 개요·요금(Tab1)·실행 환경 수명주기·콜드 스타트(Tab2)·호출 3유형(Tab3, ★표시)·동시성 Reserved/Provisioned(Tab4)·버전·별칭·카나리 배포(Tab5)·레이어(Tab5)·권한(실행 역할 vs 리소스 정책, Tab6)·VPC(Tab6)·모니터링(CloudWatch·X-Ray, Tab6)·환경 변수 암호화(Tab6)
- **누락**: **Lambda 익스텐션(Extensions API)** — 언급 없음(grep 0건). **테스트 코드** — 단위 테스트·SAM 로컬 테스트 관점 전무. **준실시간 데이터 변환**(Firehose 변환 Lambda) — 없음. **컨테이너 이미지 배포**(Task 3.1 인접, 파일1엔 있음) — 본 파일은 전혀 다루지 않음(패키지 크기 수치만 언급). **Lambda@Edge/CloudFront Functions** — 없음(파일1 고유 영역). 보충 생성 목록 후보로 누적.
- **표면 커버**: Kinesis/DynamoDB Streams ESM — 파일1 대비 배치·병렬화·오류 처리 세부(bisect, 병렬화 계수 등) 없이 "순서 보장·재시도"만 한 줄 언급 → 표면 커버로 표기.

## 범위 이탈 (축1 L5 참조용)

- 없음. 7탭 전부 1-2 Lambda 범위 내.

## 출제 각도 부정합

- 없음. "시험 핵심 요약" 탭·"시나리오→정답 패턴" 리스트·함정 힌트("$LATEST 함정" 등)로 Task 동사("구성·처리") 대비 적용형 학습 설계가 뚜렷.

## 폐기 문항 (레거시 F4)

- 해당 없음 (퀴즈 성분 없음 → F4 N/A). "시나리오→정답 패턴" 리스트는 선택지·해설이 없는 단방향 요약이라 F4 대상 구조가 아님(스키마 피드백에 별도 기록).

## 수정 지시 (실행 가능하게)

1. **콜드 스타트 "최대 10초" 재검토** — Tab2 SVG 주석: 구체적 상한 수치의 공식 근거를 찾지 못함. "런타임·초기화 코드·패키지 크기에 따라 가변(통상 수백ms~수 초)"로 완화하거나, 수치를 유지하려면 별도 출처(사례 통계 등) 명기 권고.
2. (경미) Tab7 "Destinations가 DLQ보다 AWS 권장" 문구를 "Destinations는 DLQ의 대안이며 성공/실패 모두 지원 + 풍부한 컨텍스트 제공(공식 문서상 이점으로 소개)"로 뉘앙스 조정 권고 — 결론(선호되는 방식)은 그대로 유지 가능.
3. (보충 생성 목록) Lambda 익스텐션(Extensions API)·단위 테스트/SAM 로컬 테스트·컨테이너 이미지 배포·Firehose 준실시간 변환 개념 블록 신설. Kinesis/DDB Streams ESM 오류 처리(병렬화 계수·bisect batch)는 표면 커버 → 세부 보강 필요.

## 중복 관찰 (vs aws-lambda-dva-guide.jsx — 판정 미반영)

- 주제 집합은 상대 파일(28섹션)의 부분집합에 가까움 — 개요·호출 3유형·동시성·버전/별칭/카나리·레이어·권한·VPC·모니터링은 겹치나, 상대 파일에만 있는 Lambda@Edge/CloudFront Functions·EFS·CodeGuru·CloudFormation·컨테이너 이미지·함수 URL·ALB 통합·S3 이벤트 알림·EventBridge 스케줄 패턴은 본 파일에 전혀 없음.
- 본 파일 고유: 콜드 스타트 INIT→INVOKE→SHUTDOWN 수명주기 SVG 타임라인 비교, 호출 방식 클릭형 인터랙티브 비교, 동시성 슬라이더(예약 동시성 200/1000 분배 실습), 가중치 별칭 슬라이더 인터랙션, "숫자 암기표" 단일 통합 요약 표, "시나리오→정답 패턴" 9개 리스트.
- 상대 파일 고유: 위 「Task 커버리지 누락」 항목과 동일(익스텐션 제외 전부 상대 파일이 커버).
- 공통 오류: 없음 — 본 파일이 검증한 수치(1,769MB, 레이어 5개/250MB, 타임아웃, 동시성 1,000, 비동기 재시도 2회/6시간)는 상대 파일과 값이 일치하고 둘 다 정확. 상대 파일 고유 오류(1,792MB 오기·SQS ESM 스케일링 구식·Lambda@Edge 실행시간/코드크기 구식)는 본 파일에 대응 주장 자체가 없어 해당 없음.
- 통합 결정은 인간 몫 — 본 파일은 인터랙션 학습 설계(슬라이더·클릭 비교)와 압축된 "시험 직전 요약" 성격이 강하고, 상대 파일은 범위·상세도에서 우세. 두 파일을 압축본/상세본 관계로 유지하는 편집 방향도 고려 가능.

## 스키마 피드백 요약

새 구조 제안: `tabs[]` 형태의 단일 페이지 내 다중 탭 네비게이션(파일1의 sidebar+scroll과 다른 패턴), "시나리오→정답 패턴" 요약 리스트(질문 없이 상황→권장 조치 1:1 매핑, 기존 SCHEMA_FEEDBACK_AXIS2.md의 `decisionTable[]{scenario, choice, why?}` 제안과 사실상 동일 구조 — 신규 기록 대신 기존 제안에 이 파일을 근거 사례로 추가 확인). 인터랙티브 슬라이더(동시성 분배·가중치 트래픽)는 기존 `comparisonViews[]` 제안과 별개로, Section에 `interactiveSlider[]{param, min, max, effect}` 필드 검토 가치 있음 — 개념(예약 동시성 vs 나머지 풀)을 조작하며 체득하는 구조는 v0에 대응 필드 없음.
