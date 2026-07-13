# 축2 리포트: lambda-dva-study

모드: 레거시 / 성분 태그: 설명 O(도식+시뮬레이터) · 예시 X(코드 스니펫 없음, 시나리오형 텍스트만) · 퀴즈 O(문답형 10문항 — 파일명 기준 "9문항" 지시와 실제 배열 길이 불일치, 아래 참고) · 해설 X(정답 텍스트만 제공, 오답 조건화 없음 — 자유 서술형 자가채점 구조라 객관식 해설 개념 자체가 적용 안 됨) / 매핑 챕터: 1-2 Lambda / **판정: 수정**

> 검증 방식: AWS MCP(HTTP 직접 호출, scratchpad mcp.sh) — `lambda/latest/dg/gettingstarted-limits.html`을 직접 재조회해 VERIFIED_FACTS 캐시와 대조(캐시 우선 조회 후 상충 가능성 있는 항목만 원문 재확인). 나머지는 캐시 적중.

## 참고 — 퀴즈 문항 수 불일치
지시문은 "퀴즈 9문항"으로 명시했으나 실제 `QUIZ` 배열(1447~1488행)은 **10문항**이다. 파일을 다시 확인해도 10개 객체가 맞다(S3 비동기 재시도 / SQS ESM / 예약 트래픽 콜드스타트 / 429 스로틀 / 권한 방향 / 카나리 가중치 / CPU-메모리 / 배포 패키지 크기 / INIT 위치 / 최대 실행시간). 아래 F4 검증은 실제 10문항 전부를 대상으로 했다.

## 사실 검증표

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| QUOTAS 표: "페이로드 — 동기 6 MB / **비동기 256 KB**" | 수치 | **수정 필요** | 현행 공식 문서: 동기(req/resp 각) 6MB · 스트리밍 응답 200MB · **비동기 1 MB** · 요청 라인+헤더 합계 1MB. "256KB"는 SQS 메시지 크기 한도(별개 서비스)와의 혼동으로 추정 | https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html (Invocation payload 행, 직접 재조회로 확인) |
| QUOTAS 표: 메모리 128MB~10,240MB, CPU는 메모리에 비례, 1,769MB≈1vCPU | 수치 | 확인됨 | "At 1,769 MB, a function has the equivalent of one vCPU" | https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html |
| QUOTAS 표: 타임아웃 기본 3초·최대 900초 | 수치 | 확인됨 | "Function timeout: 900 seconds (15 minutes)" (기본 3초는 콘솔 기본값, 문서 동일 계열 확인) | 위와 동일 |
| QUOTAS 표: /tmp 512MB~10,240MB | 수치 | 확인됨 | "Between 512 MB and 10,240 MB" | 위와 동일 |
| QUOTAS 표: 배포 패키지 50MB zip/250MB 압축해제/컨테이너 10GB | 수치 | 확인됨 | 동일 문구 | 위와 동일 |
| QUOTAS 표: 환경 변수 총 4KB | 수치 | 확인됨 | "4 KB, for all environment variables... in aggregate" | 위와 동일 |
| QUOTAS 표: 동시성 계정당 1,000(기본, 상향 가능) | 수치 | 확인됨 | "Concurrent executions: Default 1,000 / Can be increased up to: Tens of thousands" | 위와 동일 |
| QUOTAS 표: 레이어 함수당 최대 5개 | 수치 | 확인됨 | "Function layers: 5 layers" | 위와 동일 |
| Q1(퀴즈): S3 실패 시 비동기 2회 재시도(총 3회), DLQ/Destinations(onFailure) | 정답 | 확인됨(캐시) | 동일 | VERIFIED_FACTS 캐시(Lambda·비동기 재시도 정책) |
| Q2(퀴즈): SQS→Lambda는 ESM 폴링, 폴러가 배치를 만들어 함수를 "동기" 호출 | 정답 | 확인됨 | ESM은 폴러가 함수를 동기(RequestResponse) 호출 — 표준 문서 서술과 부합 | https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-configure.html (캐시 근거 URL과 동일 계열) |
| Q3(퀴즈): 예약 급증 트래픽엔 Provisioned Concurrency + Application Auto Scaling(스케줄) | 정답 | 확인됨 | "Application Auto Scaling allows you to configure automatic scaling for... Provisioned Concurrency for Lambda... at a specific date and time" | https://aws.amazon.com/blogs/compute/scheduling-aws-lambda-provisioned-concurrency-for-recurring-peak-usage/ |
| Q4(퀴즈): 429 TooManyRequestsException = 동시성 한도 초과 스로틀 | 정답 | 확인됨(캐시) | 동일 | VERIFIED_FACTS 캐시 |
| Q5(퀴즈): 나가는 권한=Execution Role(IAM), 들어오는 권한=Resource-based Policy | 정답 | 확인됨 | 표준 Lambda 권한 모델 서술과 부합 | (IAM·Lambda 표준 문서 — 개념 자체는 캐시의 IAM 관련 행들과 일관) |
| Q6(퀴즈): 별칭 가중치 라우팅으로 90:10 분배, CodeDeploy 자동화+알람 롤백 | 정답 | 확인됨 | 표준 Lambda 별칭/CodeDeploy 배포 구성과 부합 | (버전/별칭 표준 문서) |
| Q7(퀴즈): CPU 부족 시 메모리 증설(1,769MB≈1vCPU) | 정답 | 확인됨 | 위 QUOTAS 검증과 동일 근거 | https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html |
| Q8(퀴즈): 압축해제 300MB 초과 시 ① 컨테이너 이미지(10GB) ② EFS 마운트, 레이어도 250MB 합산 동일 | 정답 | 확인됨 | 위 배포 패키지/레이어 한도와 일치 | 위와 동일 |
| Q9(퀴즈): 핸들러 밖 초기화 = INIT 1회, 웜 재사용 | 정답 | 확인됨 | 콜드/웜 스타트 표준 개념과 부합 | (실행 라이프사이클 표준 문서) |
| Q10(퀴즈): 최대 실행시간 900초, 초과 시 Step Functions/ECS·Fargate·Batch | 정답 | 확인됨 | 타임아웃 한도와 일치, 대체 서비스 서술은 통념 수준(합리적) | https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html |
| 비동기 스로틀: "최대 6시간 자동 재시도 후 DLQ" | 동작 | 확인됨(캐시) | "스로틀·시스템 오류는 최대 6시간 큐 보관 후 지수 백오프 재시도" | VERIFIED_FACTS 캐시 |
| ExamTip: "Java의 SnapStart" (콜드 스타트 완화 수단) | 동작 | 확인됨이나 **구버전 지식 패턴 경계 해당** | 진술 자체(Java 지원)는 틀리지 않으나 현행 지원 런타임은 Java 11+/Python 3.12+/.NET 8+로 더 넓음 — 부분집합 서술이라 오류는 아님, 최신성 보강 권장 | https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html |
| Provisioned Concurrency는 버전·별칭에만 설정($LATEST 불가) | 동작 | 확인됨(통념 수준) | 콘솔 설정 흐름·공식 블로그 예시 모두 버전/별칭 대상, $LATEST 사용 사례 없음 | https://aws.amazon.com/blogs/compute/creating-low-latency-high-volume-apis-with-provisioned-concurrency/ |
| 별칭 가중치 라우팅은 정확히 2개 버전까지, 별칭이 별칭을 가리킬 수 없음 | 동작 | 확인됨(통념 수준 — 표준 Lambda 별칭 문서와 부합, 별도 재조회 불요) | 동일 | (버전/별칭 표준 문서) |

## Task 커버리지 (담당 챕터: 1-2 Lambda, 단독)

- **커버**: 실행 라이프사이클/콜드·웜 스타트(1.2 이벤트 수명 주기), 호출 3유형과 에러 처리(Destinations·DLQ), 동시성(Reserved/Provisioned — 4.3 성능 튜닝), 버전·별칭(3.3), 권한 모델(실행 역할/리소스 기반 정책), 핵심 설정 한도(메모리/타임아웃/tmp/배포패키지/환경변수/레이어/페이로드)
- **누락**:
  - **VPC 내 프라이빗 리소스 접근 — 완전 누락**. EXAM_TASK_MAP 1.2 키워드에 명시된 항목인데 파일 전체에 VPC 관련 언급이 전혀 없음(ENI, 서브넷, NAT, 콜드 스타트 영향 등)
  - **런타임 선택·핸들러 구조 상세** — "handler(event, context)"만 1줄 언급, 런타임 종류·핸들러 시그니처·컨텍스트 객체 필드는 미다룸
  - **Lambda 익스텐션(Extensions)** — 전무
  - **테스트 코드(SAM 로컬 테스트, 단위 테스트)** — 전무
  - **준실시간 데이터 변환/스트리밍 처리** — 전무 (Kinesis/DynamoDB Streams는 도식에서 트리거 예시로만 스치고 처리 패턴은 없음)
  - **DLQ 설정 방법 자체(SQS/SNS 큐 구성)** — 개념은 있으나 실무 설정 관점 부재
- **표면 커버**: EFS 마운트(1줄 언급, "의존성을 EFS에 마운트"만 — 설정 방법·용도 없음)

## 범위 이탈 (축1 L5 참조용)

- 없음. 전 챕터가 1-2 Lambda 범위 내.

## 출제 각도 부정합

- 없음. 퀴즈 10문항 전부 "시나리오 제시 → 원인/해결책 도출" 형태로 정의 직문이 아니며, EXAM_TASK_MAP의 "구현 판단" 성격과 부합. ExamTip들도 시나리오 키워드→정답 매핑 형태로 일관됨.

## 폐기 문항 (레거시 F4)

- **0건** — 퀴즈 10문항(파일 지시상 "9문항"이나 실제 10문항, 위 참고 섹션) 전부 F2 절차 검증 통과. 정답·해설 텍스트에 사실 오류 없음.

## 수정 지시 (실행 가능하게)

1. **[사실 오류, 수정 필수]** QUOTAS 표(1370행) "페이로드: 동기 6 MB / 비동기 256 KB" → **"동기 6 MB(요청·응답 각각) / 비동기 1 MB"**로 정정. 스트리밍 응답 200MB도 함께 병기하면 최신성 보강.
2. **[커버리지 보강, 수정 사유]** 단독 챕터 기준 적용 — Lambda VPC 통합(ENI/서브넷/콜드 스타트 영향) 개념 카드 또는 도식 최소 1개 추가. 이 챕터가 "1-2 Lambda" 단일 담당이므로 EXAM_TASK_MAP 1.2 키워드 중 VPC 항목 완전 누락은 표면 커버가 아니라 완전 공백으로 처리.
3. (선택) ExamTip의 "Java의 SnapStart" 문구에 "Python 3.12+, .NET 8+도 현행 지원"을 병기해 최신 시험 반영도를 높일 것 (오류 아님, 개선 권장).
4. (선택) Lambda 익스텐션·테스트 코드(SAM)·준실시간 스트리밍 처리는 이 챕터에서 다루지 않는다면 다른 챕터(예: 4-4 SAM, 2-4 Kinesis)로 명시적으로 위임 표기하거나, 간단한 카드로 최소 커버.

## 스키마 피드백 요약

이 파일은 자유 서술형(fill-in) 자가채점 퀴즈 UI(`ChQuiz` — 정답 텍스트 노출 후 "맞혔다/틀렸다" 자가 채점, 누적 점수·재시도 버튼)와 파라미터 조작형 시뮬레이터(콜드/웜 스타트 단계 애니메이션, 동시성 슬라이더, 카나리 가중치 슬라이더) 구조를 사용한다. 스키마 v0의 `Question{ scenario, choices[4], answer[], explanation }`은 4지선다를 전제하므로 이런 **자유 서술형 문답 + 자가채점** 형태를 표현하지 못한다. `docs/SCHEMA_FEEDBACK_AXIS2.md`에 별도 제안 필요(스키마 직접 수정 안 함, 이 리포트에서만 기록).

