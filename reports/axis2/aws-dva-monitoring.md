# 축2 리포트: aws-dva-monitoring

모드: 레거시 / 성분 태그: 설명 O · 예시 O(다이어그램·코드) · 퀴즈 X · 해설 X / 매핑 챕터: 5-1 CloudWatch · 5-2 X-Ray · 5-3 CloudTrail (+ 2-3 EventBridge 보너스 커버) / **판정: 수정**

> 고엄밀 배치. AWS MCP 서버 HTTP 직접 호출(mcp.sh, aws-mcp.us-east-1.api.aws)로 검증. 캐시: docs/VERIFIED_FACTS.md.

## 사실 검증표

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| EC2 지표 기본 5분 / 상세 모니터링 1분(유료) | 수치 | 확인됨 | 동일 | https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-metrics-basic-detailed.html |
| 지표당 디멘션 최대 30개 | 수치 | 확인됨 | 동일 | https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html · https://docs.aws.amazon.com/botocore/latest/reference/services/cloudwatch/client/put_metric_data.html |
| "상세 모니터링 지표 10개까지 프리티어 무료" | 수치 | **확인 불가** | 현행 문서에서 해당 문구·수치 미발견(과거 프리티어 페이지 정보로 추정, 최신 pricing 문서에 미기재) | (미확보) |
| PutMetricData 타임스탬프 허용 범위: 과거 2주 · 미래 2시간 | 수치 | 확인됨 | "as much as two weeks before the current date, and as much as 2 hours after" | https://docs.aws.amazon.com/botocore/latest/reference/services/cloudwatch/client/put_metric_data.html |
| 커스텀 지표 StorageResolution: "표준=1분(기본) / 고해상도=1·5·10·30초" | 수치 | **수정 필요** | StorageResolution 파라미터 자체는 **1 또는 60(초)만 유효값** — "표준=60(기본)·고해상도=1". 1/5/10/30초는 고해상도로 게시된 지표를 **조회(period)할 때** 쓸 수 있는 값이지 게시 시 선택하는 해상도 값이 아님. 개념이 섞여 있음 | https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html |
| 고해상도 지표 경보 주기: "10초 또는 30초만 가능" | 수치 | **수정 필요 (경미)** | 현행: **10초, 20초, 또는 30초** (20초 옵션 누락) | https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarm-evaluation.html |
| 경보 상태 3종: OK / INSUFFICIENT_DATA / ALARM | 동작(시험 포인트) | 확인됨 | 동일 | alarm-evaluation.html (위와 동일) |
| 메트릭 필터: 최대 3개 디멘션 | 수치 | 확인됨 | JSON/공백 구분 로그 이벤트 필터는 최대 3개 디멘션 지원 | https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntaxForMetricFilters.html |
| 메트릭 필터는 소급 적용되지 않음(생성 이후 로그만 집계) | 동작(시험 포인트) | 확인됨(간접) | 공식 FAQ: "로그 이벤트가 전송되는 대로(as they are sent) 모니터링" — 신규 유입 로그 기준 동작 서술과 일치, "소급 적용 안 됨"이라는 명시적 문장은 미확보 | https://aws.amazon.com/cloudwatch/faqs/ |
| 로그 그룹 보존: 없음(무제한) ~ 1일~10년 | 수치 | 확인됨 | 기본은 무기한(never expire), 옵션 범위 1일~10년 | https://docs.aws.amazon.com/eks/latest/best-practices/cost-opt-observability.html · https://docs.aws.amazon.com/solutions/latest/cloud-migration-factory-on-aws/security.html |
| EC2 메모리(RAM)는 기본 지표에 없음 → 에이전트로 커스텀 수집 필요 | 동작(시험 포인트) | 확인됨 | "memory metrics isn't one of the default metrics" — CloudWatch 에이전트 설치 필요 | https://aws.amazon.com/blogs/mt/setup-memory-metrics-for-amazon-ec2-instances-using-aws-systems-manager/ · https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/system-level-cloud-watch-configuration.html |
| X-Ray 데몬: UDP 2000 포트로 세그먼트 수신 | 동작(시험 포인트) | 확인됨 | 동일 | https://aws.amazon.com/blogs/devops/instrumenting-web-apps-using-aws-x-ray/ |
| X-Ray 기본 샘플링: 초당 1개(reservoir) + 나머지 5%(rate) | 수치 | 확인됨 | "records the first request each second, and five percent of any additional requests" | https://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html |
| 주석(Annotations)=인덱싱·검색 가능 / 메타데이터(Metadata)=인덱싱 불가 | 동작(시험 포인트) | 확인됨 | 동일 | xray-concepts.html (위와 동일) |
| AWSXRayDaemonWriteAccess = PutTraceSegments·PutTelemetryRecords·GetSamplingRules 등 | 동작 | 확인됨 | 정책 JSON에 PutTraceSegments·PutTelemetryRecords·GetSamplingRules·GetSamplingTargets·GetSamplingStatisticSummaries 포함 | https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AWSXRayDaemonWriteAccess.html |
| CloudTrail 기본 활성화, 콘솔 이벤트 히스토리 90일 | 동작+수치(시험 포인트) | 확인됨 | "CloudTrail is enabled by default... past 90 days of management events" | https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html |
| CloudTrail 관리 이벤트=기본 기록 / 데이터 이벤트·Insights=기본 미기록 | 동작(시험 포인트) | 확인됨 | "trails log all management events, and don't include data, CloudTrail Insights events" | https://docs.aws.amazon.com/help-panel/awscloudtrail/latest/console/create-trail-events.html |

## Task 커버리지 (담당: Task 4.1 근본원인분석, 4.2 관측성 계측 — 5-1·5-2·5-3)

- **커버**: 지표·네임스페이스·디멘션(4.1) / 커스텀 지표 방출(PutMetricData, 4.2) / 로그 쿼리(Logs Insights, 4.1) / 트레이싱 어노테이션(4.2) / 알림(경보→SNS, 4.2) / X-Ray 트레이싱 구현·계측(4.2) / 배포 실패 로그와 무관하나 CloudTrail 감사 전반
- **누락 (커버리지 갭 — 단독 챕터 기준 "수정" 사유)**:
  - **EMF(Embedded Metric Format)** — RUBRIC §2가 5-1 챕터 필수 요소로 명시(`5-1 CloudWatch(지표, 로그·Insights·필터, 알람, EMF)`)하고 Task 4.1 키워드에도 "커스텀 지표(EMF)"로 명시됨. 파일 전체에 EMF·embedded metric format 언급 **전무**(`grep` 확인). 구조화 로깅으로 커스텀 지표를 방출하는 현대적 패턴이라 시험·실무 모두에서 비중이 있음 — 커버리지 누락으로 판정.
  - **CloudWatch 대시보드 자체의 구성/위젯** — "대시보드를 만들 수 있다"는 1줄 언급만 있고(표면 커버), 위젯·공유·자동화(Dashboard body JSON, cross-account dashboard) 등 실습 요소는 다루지 않음. 강의가 "실습 제외"를 표방하므로 큰 결함은 아니나 Task 4.1 "대시보드·인사이트" 키워드 대비 다소 얕음(표면 커버로 기록).
- **표면 커버**: CloudWatch 대시보드(위 참조).

## 범위 이탈 (축1 L5 참조용)

- 없음. EventBridge(챕터 2-3) 섹션이 포함되어 있으나 이는 5-1~5-3 담당 범위를 벗어난 "보너스" 콘텐츠이지, 시험 무관 트리비아가 아니라 실제 커리큘럼 챕터(2-3)의 정규 주제 — 이탈이 아니라 잉여 커버로 기록. CloudTrail vs CloudWatch vs **Config** 3자 비교가 시험 포인트로 흔하지만, 이 파일의 SCompare 섹션은 CloudTrail·CloudWatch·X-Ray 3종만 비교하고 **Config는 언급 자체가 없음**. RUBRIC §2 커리큘럼에도 Config가 어느 챕터에도 명시적으로 배정되어 있지 않아(5-1~5-3 담당 범위 밖으로 판단) 이 파일의 결함으로 판정하지 않되, 커리큘럼 갭으로 보고할 가치가 있어 아래에 부기.

## 출제 각도 부정합

- 없음. Task 동사("분석·디버깅", "계측·구현") 대비 각 섹션 말미 Tip이 "안 보일 때 체크리스트", "키워드 매핑", "시나리오→정답" 형태로 시나리오 판단형 서술 위주. 특히 X-Ray 트러블슈팅 섹션(EC2/Lambda에서 트레이스 안 보일 때 체크리스트)은 Task 4.1 "근본 원인 분석" 동사와 정확히 정합.

## 폐기 문항 (레거시 F4)

- 해당 없음 (퀴즈 성분 없음 → F4 N/A).

## 수정 지시 (실행 가능하게)

1. **`SCustom` (사용자 지정 지표) StorageResolution 서술 수정** — "표준(Standard) = 1분(기본) / 고해상도(High Resolution) = 1·5·10·30초"를 "StorageResolution 파라미터는 **60(표준, 기본)** 또는 **1(고해상도)** 두 값만 가능. 고해상도로 게시하면 이후 **1·5·10·30초 또는 60의 배수** 단위로 조회 가능"으로 정정. 다이어그램 캡션의 "1/5/10/30초" 표기도 "게시 시 1초(고해상도) → 조회는 1·5·10·30초 등"으로 재표현. 근거: publishingMetrics.html
2. **`SAlarms` 고해상도 경보 주기 수정** — "고해상도 커스텀 지표는 10초 또는 30초 주기만 가능" → "10초·20초·30초 중 하나(2024년 이후 20초 옵션 추가)". 근거: alarm-evaluation.html
3. **(보충 생성 목록) EMF(Embedded Metric Format) 개념 블록 신설** — 5-1 챕터 필수 요소이자 Task 4.1 키워드. "구조화 로그에 특수 JSON 필드를 심으면 CloudWatch가 자동으로 커스텀 지표를 추출"하는 방식, Lambda Powertools/PutLogEvents 기반 사용 예, PutMetricData 대비 장점(API 호출 비용 없음·고빈도 방출에 유리) 포함해서 추가 필요.
4. **(경미·표기 정정)** `Lambda` 무료 티어 "상세 모니터링 지표 10개까지 무료" 문구는 근거 문서를 확보하지 못했으므로 삭제하거나 "일부 무료 한도가 있을 수 있음(정확한 수치는 최신 CloudWatch 프라이싱 페이지 확인)"으로 완화 권고.
5. **(커리큘럼 갭 보고, 이 파일 결함 아님)** SCompare 3종 비교에 AWS Config를 추가하면(4번째 카드: "구성이 어떻게 변했나") 시험 최빈출 3자 구분 문제에 완결성이 생김. RUBRIC §2에 Config가 챕터 배정이 없는 커리큘럼 자체의 공백이므로, 이 챕터에 흡수할지 인간이 결정 필요.

## 스키마 피드백 요약

빈출도 배지(1~4단계 막대 아이콘) · SVG 다이어그램 기반 아키텍처 시각화(Dgm/Box/Arw 컴포넌트) · "시험 포인트" Tip 콜아웃 · 시나리오→정답 빠른 매핑 표(SCompare) · 색상 언어 범례(지표=앰버·로그=하늘색·이벤트=핑크·트레이싱=보라·감사=청록) 구조가 스키마 v0에 없음 → docs/SCHEMA_FEEDBACK_AXIS2.md에 제안 추가 예정.
