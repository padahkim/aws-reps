# 축2 리포트: aws-lambda-dva-guide

모드: 레거시 / 성분 태그: 설명 O · 예시 O(다이어그램·CLI 예제·JSON 페이로드 스니펫·비교표 다수, 실행 가능 코드는 없음) · 퀴즈 X · 해설 X / 매핑 챕터: 1-2 Lambda / **판정: 수정**

> 검증 방식 부기: 세션 MCP 클라이언트 단선으로 동일 AWS MCP 서버를 HTTP 직접 호출로 사용 (반환 URL 동일). 캐시: docs/VERIFIED_FACTS.md.
> 중복 부기: aws-lambda-dva-guide-2.jsx와 실질 중복 쌍 — 사용자 결정으로 둘 다 정식 평가 (하단 「중복 관찰」).
> 규모 부기: 3651줄·28섹션(01 서버리스 소개 ~ 28 모범 사례). 아래 표는 시험 정답에 영향을 주는 주장 위주로 발췌(전 주장 목록 아님).

## 사실 검증표

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| §16 함수 성능: "1,792MB에서 vCPU 1개 도달" | 수치(시험 포인트) | **수정 필요** | **1,769MB**에서 vCPU 1개 상당 (선형 비례) | https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html |
| §08 ESM: "SQS Standard는 분당 60개 인스턴스 추가, 최대 1,000 동시 배치" | 수치(시험 포인트) | **수정 필요** | 현행: **5개 동시 호출로 시작 → 분당 최대 300개 동시 호출 추가 → 최대 1,250 동시 호출**(Standard 모드). 60/min·1,000 상한은 구버전 규칙 | https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-scaling.html |
| §14 Edge: "Lambda@Edge 최대 실행 시간 5~10초, 코드 크기 1MB~50MB" | 수치(시험 포인트) | **수정 필요** | 현행: 실행 시간은 **viewer·origin 요청/응답 전부 최대 30초**(과거 viewer 5초 제한 통합됨), 코드 크기는 **viewer·origin 전부 50MB**(과거 viewer 1MB 제한 없어짐). 메모리는 viewer 128MB 고정/origin 최대 10,240MB(범위 아님) | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions-choosing.html |
| §14 Edge: CF Functions 스케일 "초당 수백만 요청"·서브밀리초·2MB·10KB | 수치 | 확인됨 | 동일 (Scale: up to millions RPS, duration: submillisecond, memory 2MB, code 10KB) | edge-functions-choosing.html |
| §14 Edge: Lambda@Edge 스케일 "초당 수천 요청" | 수치 | 확인 (근사) | 현행 공식 수치는 "리전당 초당 최대 10,000 요청" — "수천"은 과소 표현이나 오답은 아님, 부기 권고 | edge-functions-choosing.html |
| §14 Edge: "Lambda@Edge는 us-east-1에서만 작성, CloudFront가 엣지로 복제" | 동작(시험 포인트) | 확인됨 | 동일 | https://aws.amazon.com/blogs/gametech/how-to-deliver-custom-game-content-to-players-using-lambdaedge/ · https://docs.aws.amazon.com/amplify/latest/userguide/ssr-supported-features.html |
| §26 CodeGuru: "지원 언어는 Java, Python뿐" | 동작 | 확인됨 | Java/JVM 언어(Scala·Kotlin 포함) + Python 3.6+ | https://docs.aws.amazon.com/codeguru/latest/profiler-ug/what-is-codeguru-profiler.html |
| §02 개요: 무료 티어 월 100만 요청 + 40만 GB-초, 초과 시 $0.20/100만 건 | 수치 | 확인됨 | 동일 | https://docs.aws.amazon.com/whitepapers/latest/big-data-analytics-options/aws-lambda.html |
| §16/§27: 메모리 128MB~10,240MB(1MB 단위)·타임아웃 기본 3초/최대 900초·/tmp 512MB~10GB·환경 변수 4KB·레이어 5개/250MB·zip 50MB/해제 250MB/컨테이너 10GB | 수치(시험 포인트 다수) | 확인됨 | 전부 일치 | https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html |
| §19 동시성: "계정 기본 동시성 1,000, 상향 요청 가능" | 수치(시험 포인트) | 확인됨 | 동일(리전당 계정 기본 1,000) | https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html |
| §19: "동시성 초과 시 동기=429, 비동기=재시도 후 DLQ" | 동작(시험 포인트) | 확인됨 | 429 ThrottleError 확인, 비동기는 최대 6시간 큐 보관+지수 백오프 재시도 후 소진 시 DLQ/Destination | https://docs.aws.amazon.com/lambda/latest/dg/invocation-async-configuring.html |
| §05 비동기: "202 즉시 반환, 오류 시 총 3회 시도(1분 후 재시도, 2분 후 재시도)" | 수치+동작(시험 포인트, "암기 필수" 표기) | 확인됨 | 정확히 일치("두 번 더 시도, 1차 재시도 전 1분·2차 재시도 전 2분 대기") | https://docs.aws.amazon.com/lambda/latest/dg/invocation-async-error-handling.html |
| §08 ESM: "SQS 가시성 타임아웃 = 함수 타임아웃 × 6 권장" | 수치(시험 포인트) | 확인됨 | 동일("at least six times") | https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-configure.html |
| §08 ESM: "SQS DLQ는 큐 자체에 설정, Lambda 자체 DLQ 기능은 비동기 호출 전용" | 동작(시험 포인트, "핵심 함정" 표기) | 확인됨 (통념 수준, 구조상 타당) | ESM 실패 배치는 큐의 redrive policy 또는 Lambda Destinations의 discard-events 대상으로 처리 — Lambda 함수 자체의 async DLQ 설정과는 별개 메커니즘이라는 서술 방향은 부합. 명시적 1:1 문구는 스니펫 미확보 | — |
| §08 ESM: "Kinesis/DDB Streams 병렬화 최대 10 배치/샤드" | 수치 | 확인됨 | ParallelizationFactor로 샤드당 최대 10 배치 동시 처리(기본 1) | https://aws.amazon.com/blogs/compute/new-aws-lambda-scaling-controls-for-kinesis-and-dynamodb-event-sources/ |
| §08 ESM: "스트림 오류 시 기본은 배치 전체 재시도, 해당 샤드 처리 정지" | 동작(시험 포인트, "초빈출" 표기) | 확인됨 (통념 수준) | Kinesis/DDB Streams ESM은 순서 보장을 위해 실패 배치를 만료 전까지 재시도하며 해당 샤드가 블로킹되는 것이 공식적으로 알려진 동작 | — (VERIFIED_FACTS 기존 캐시: GSI 참고 아님, Streams 자체 문서 재확인 생략 — 축1 L 아님) |
| §11 권한: "리소스 기반 정책 OR 실행 역할 IAM — 둘 중 하나만 허용해도 호출 가능" | 동작(시험 포인트) | 확인됨 | 동일 계정 내 자격증명 기반+리소스 기반 정책의 합집합 평가(명시적 Deny 없을 때 한쪽 Allow면 허용) — IAM 캐시 기존 항목과 원리 동일 | https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html |
| §23 버전·별칭: "별칭은 별칭을 가리킬 수 없다" | 동작(시험 포인트, "그대로 암기" 표기) | 확인됨 (통념 수준) | 별칭은 버전만 가리키는 포인터라는 공식 개념과 부합 | — |
| §25 함수 URL: "PrivateLink(VPC 전용 접근) 미지원, 퍼블릭 인터넷만" | 동작(시험 포인트) | 확인 불가 | 함수 URL이 VPC 엔드포인트 연동을 지원한다는 공식 문서를 못 찾았으나, 명시적 미지원 문구도 미확보 — 미검증 표기 권고 | — |
| §25 함수 URL: "AWS_IAM, 동일 계정은 IAM 정책 OR 리소스 정책, 교차 계정은 AND 둘 다 필요" | 동작(시험 포인트) | 확인 불가 | 함수 URL 권한 문서에서 AuthType NONE/AWS_IAM 구조는 확인되나 "교차 계정 AND" 조건의 명시 스니펫 미확보 — 미검증 표기 권고 | https://docs.aws.amazon.com/lambda/latest/api/API_FunctionUrlConfig.html |
| §21 CFN: "S3 코드 업로드 후 버킷/키/버전 미변경 시 CloudFormation이 갱신 안 함 → S3ObjectVersion 갱신 필요" | 동작 | 확인됨 (통념 수준, CFN 일반 원리) | S3 기반 Lambda 코드 갱신은 S3Bucket/S3Key/S3ObjectVersion 변경으로 감지되는 것이 CloudFormation 표준 동작 | — |
| §15 VPC: "퍼블릭 서브넷에 있어도 퍼블릭 IP 없음, 인터넷 접근 불가 — 프라이빗 서브넷+NAT 필요" | 동작(시험 포인트, "초빈출 함정" 표기) | 확인됨 (통념 수준) | ENI 기반 VPC 연결의 표준 동작 원리와 부합 | — |

## Task 커버리지 (담당: Task 1.2 Lambda 코드 개발 전체 + 2.3 환경 변수·3.3 별칭·3.4 패키징·4.3 동시성·메모리)

- **커버**: VPC 접근(§15)·환경 변수(§12)·메모리/동시성/타임아웃/런타임/핸들러(§02,§16,§19)·레이어(§17)·트리거 3유형(§03,§05,§08)·Destinations(§10)·이벤트 수명주기·오류 처리(§05,§08,§10)·성능 튜닝(§16,§19)·버전·별칭(§23)·패키징(§20,§21,§22)·서비스 통합(ALB §04, EventBridge §06, S3 §07, CodeDeploy §24)
- **누락**: **Lambda 익스텐션(Extensions API)** — Task 1.2 키워드에 명시된 항목인데 파일 전체에 언급 없음(grep 결과 0건). **테스트 코드**(단위 테스트·SAM 로컬 테스트) — 컨테이너 이미지 절의 RIE(로컬 실행 도구) 언급이 유일하며 일반 함수 단위 테스트 관점은 없음. **준실시간 데이터 변환**(Kinesis Firehose 변환 등 Task 1.2 문구) — ESM 스트림 처리(§08)가 인접하지만 Firehose 변환 Lambda 패턴 자체는 다루지 않음. 보충 생성 목록 후보 3건.
- **표면 커버**: 없음 — 다룬 항목은 대부분 예시·함정 콜아웃 동반.

## 범위 이탈 (축1 L5 참조용)

- 없음. 28섹션 전부 Lambda(1-2) 범위 내 (Lambda@Edge·CodeGuru·EFS·CodeDeploy 연동도 Lambda 관점 서술로 범위 내).

## 출제 각도 부정합

- 없음. Task 동사("개발·구성·처리") 대비 함정 콜아웃(Note k="tip"|"warn"|"mem")·시나리오형 서술·"시험 빈출도" 배너 중심으로 정합 우수.

## 폐기 문항 (레거시 F4)

- 해당 없음 (퀴즈 성분 없음 → F4 N/A). Note 콜아웃 형태의 "암기 필수"·"초빈출 함정" 표기는 정답/오답 선택지 구조가 아니라 F4 대상 아님.

## 수정 지시 (실행 가능하게)

1. **1,769MB 정정** — §16 `함수 성능` KVGrid·본문: "1,792MB에서 vCPU 1개" → "**1,769MB**에서 vCPU 1개 상당". 근거: configuration-memory.html
2. **SQS ESM 스케일링 규칙 갱신** — §08 `esm` 스케일링 요약 표 SQS Standard 행: "분당 60개 인스턴스 추가, 최대 1,000 동시 배치" → "**5개 동시 호출로 시작 → 분당 최대 300개 동시 호출 추가 → 최대 1,250 동시 호출**(Standard 모드 기준)". 근거: services-sqs-scaling.html
3. **Lambda@Edge 실행 시간·코드 크기 갱신** — §14 `edge` 비교표: "5~10초" → "**최대 30초**(viewer·origin 요청/응답 공통, 과거 viewer 5초 제한은 폐지)", "1MB~50MB" → "**50MB**(viewer·origin 공통, 과거 viewer 1MB 제한은 폐지)". 메모리 행은 "128MB~10GB"보다 "viewer 128MB 고정 / origin 최대 10,240MB"로 재표현 권고(범위형 오해 방지). 근거: edge-functions-choosing.html
4. (경미) §14 "Lambda@Edge 초당 수천 요청" → "리전당 초당 최대 10,000 요청"으로 구체화 권고.
5. (보충 생성 목록) Lambda 익스텐션(Extensions API) 개념 블록 신설, 단위 테스트/SAM 로컬 테스트 절 보강, Firehose 준실시간 변환 Lambda 패턴 추가.
6. (미검증 표기 권고) §25 함수 URL의 PrivateLink 미지원 단정, 교차 계정 AuthType AND 조건 — URL 미확보 상태이므로 "미검증" 각주 부기 권고(오류로 단정하지 않음).

## 중복 관찰 (vs aws-lambda-dva-guide-2.jsx — 판정 미반영)

- 주제 집합은 대부분 겹침(개요·호출 3유형·동시성·버전/별칭/카나리·레이어·권한·VPC·모니터링) 이나 본 파일이 압도적으로 상세(28섹션 vs 7탭) — 본 파일에만 있는 고유 영역: Lambda@Edge/CloudFront Functions 비교(§14), EFS 파일 시스템 마운트(§18), CodeGuru Profiler(§26), CloudFormation 배포 함정(§21), 컨테이너 이미지·ECR·RIE(§22), 함수 URL 상세 AuthType(§25), ALB 통합 JSON 페이로드 구조(§04), S3 이벤트 알림 유실 시나리오(§07), EventBridge 스케줄 패턴(§06), 재귀 호출 금지 모범 사례(§28).
- 상대 파일 고유: 콜드 스타트 타임라인 시각화(SVG 비교)·호출 방식 인터랙티브 클릭 비교·동시성 슬라이더 인터랙션·가중치 별칭 슬라이더 인터랙션·"숫자 암기표" 단일 통합 표·"시나리오→정답 패턴" 요약 리스트 — 인터랙티브 UI 밀도가 높음.
- 공통 오류: 두 파일 모두 SQS ESM 스로틀링 계산(SQS는 확인됨, 스케일링 수치는 본 파일만 구체 주장 — 상대 파일은 해당 수치를 다루지 않음, 아래 상대 리포트 참고), Lambda@Edge 세부 비교표는 상대 파일에 없음(본 파일 단독 오류).
- 통합 결정은 인간 몫 — 본 파일이 상세도·범위에서 우세, 상대 파일은 인터랙션 학습 설계 관점에서 보완재 성격.

## 스키마 피드백 요약

새 구조 제안 없음(기존 SCHEMA_FEEDBACK_AXIS2.md의 빈출도 배너·콜아웃 4유형·비교 뷰 제안과 동일 패턴 반복 — 중복 기록 생략). 단, 본 파일의 `KVGrid`(핵심 수치 그리드)·`Tbl`(비교표) 컴포넌트가 examPoints의 수치 집중형 하위 구조로 재확인됨(기존 factCards 제안과 동일 계열).
