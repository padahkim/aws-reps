# 축2 리포트: aws_api_gateway_dva

모드: 레거시 / 성분 태그: 설명 O · 예시 O(CSS 다이어그램·비교표·설정 순서 스텝·결정표·Lambda 프록시 응답 형식 조각 — CLI/정책 JSON 실코드 없음) · 퀴즈 X · 해설 X / 매핑 챕터: 1-4 API Gateway / **판정: 수정**

> 검증 방식 부기: 세션 MCP 클라이언트 단선으로 동일 AWS MCP 서버를 HTTP 직접 호출로 사용 (반환 URL 동일). 캐시: docs/VERIFIED_FACTS.md.
> 중복 부기: aws-dva-api-gateway.jsx와 실질 중복 쌍 — 사용자 결정으로 둘 다 정식 평가 (하단 「중복 관찰」).

## 사실 검증표

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| CloudWatch Logs "로그 레벨 ERROR/INFO/**DEBUG**" (`Monitoring` 카드) | 동작 | **수정 필요** | 실행 로깅 레벨은 **Off / Errors only / Errors and info** (DEBUG 없음). 요청·응답 본문 로깅은 별도 **Data tracing** 토글(민감 데이터 주의) | https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-logging.html |
| REST vs HTTP 표 인증 행: HTTP API "JWT·OIDC/OAuth2·Cognito·Lambda" (IAM 부재) | 동작(시험 포인트) | 수정 필요 (경미) | 현행 비교표: **HTTP API도 IAM 인증 지원** — HTTP 칸에 IAM 추가 필요. 나머지(Lambda Authorizer·JWT·Cognito(JWT 경유)) 및 REST 칸은 정확 | https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html |
| 통합 대상 3종(Lambda/HTTP 엔드포인트/AWS 서비스: Kinesis·SQS·SNS·DynamoDB·StepFn) | 동작 | 확인됨 | REST API 통합 대상 문서 부합 (HTTP 엔드포인트·AWS 서비스·Lambda) | https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html (Integrations) · api-gateway-api-endpoint-types.html |
| 엔드포인트 3유형: Edge-Optimized(기본, CloudFront 경유)/Regional(자체 CloudFront 결합 가능)/Private(ENI 인터페이스 VPC 엔드포인트+Resource Policy) | 동작(시험 포인트) | 확인됨 | Edge가 REST API 기본값·CloudFront POP 경유, Regional+자체 CloudFront 패턴, Private=ENI 전용 | https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html |
| 커스텀 도메인: Edge는 us-east-1 인증서, Regional은 해당 리전 인증서 / Route 53 매핑 | 동작(시험 포인트) | 확인됨 | 동일 | https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-regional-api-custom-domain-migrate.html · apigateway-regional-api-custom-domain-create.html |
| WAF 연동(REST API에서 지원) | 동작 | 확인됨 | 비교표: WAF — REST Yes / HTTP No | http-api-vs-rest.html |
| 변경은 배포 전 미반영 / Stage 고유 URL `https://api-id.execute-api.region.amazonaws.com/prod` / 배포 이력 롤백 | 동작(시험 포인트) | 확인됨 | 배포 이력 저장·롤백 공식 확인, URL 형식 일치 | https://aws.amazon.com/api-gateway/faqs/ |
| "원하는 만큼 Stage 생성 가능" | 수치 | 확인 불가 | 무제한 명시 근거 미확보(쿼터 존재) — 단정 회피 권고, 판정 무관 | — |
| Stage 변수: Lambda ARN·HTTP 엔드포인트·매핑 템플릿 파라미터 / **이벤트의 `stageVariables`로 함수 안에서 접근** / alias 매핑 패턴 | 동작(최빈출 패턴) | 확인됨 | 프록시 통합 이벤트에 `stageVariables` 필드 존재 — 중복 파일(context 객체 주장)과 달리 **이 파일이 정확** | https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html · https://aws.amazon.com/blogs/compute/using-api-gateway-stage-variables-to-manage-lambda-functions/ |
| Canary: 트래픽 %(5~10%) 지정 / 지표·로그 분리 / Stage 변수 override / promote 시 100% 전환 | 동작 | 확인됨 | percentTraffic 0.0~100.0, stageVariableOverrides, 카나리 전용 로그 그룹(…/Canary)·지표 별도, Promote canary | https://docs.aws.amazon.com/apigateway/latest/developerguide/canary-release.html · https://docs.aws.amazon.com/apigateway/latest/api/API_DeploymentCanarySettings.html |
| 통합 4종: MOCK(백엔드 없이 직접 응답)/HTTP·AWS 비프록시(매핑 템플릿)/AWS_PROXY(가공 없음)/HTTP_PROXY(패스스루) | 동작(시험 포인트) | 확인됨 | MOCK=백엔드 없이 응답 생성, 매핑 템플릿=비프록시 전용 | https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-mock-integration.html · set-up-lambda-proxy-integrations.html |
| Lambda Proxy 응답 형식 `{statusCode, headers, body(문자열), isBase64Encoded}` 미준수 시 **502 Bad Gateway** | 동작(시험 포인트) | 확인됨 | 출력 형식 {isBase64Encoded, statusCode, headers, multiValueHeaders, body} + "오류 또는 잘못된 형식 반환 시 502" | set-up-lambda-proxy-integrations.html · https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway-errors.html |
| 매핑 템플릿: VTL·파라미터 이름 변경·body 수정·헤더 추가·JSON↔XML(SOAP) / Content-Type별 템플릿(application/json, application/xml) | 동작(시험 포인트) | 확인됨 | VTL 변환 공식. Content-Type별 지정은 예시 나열이라 문제 없음 | https://docs.aws.amazon.com/apigateway/latest/developerguide/models-mappings.html · https://aws.amazon.com/blogs/machine-learning/creating-a-machine-learning-powered-rest-api-with-amazon-api-gateway-mapping-templates-and-amazon-sagemaker/ |
| OpenAPI 3.0 import(메서드·통합·모델 일괄 생성)/export/SDK 생성 | 동작 | 확인됨 | OpenAPI 3 import·export 확인, SDK 생성(Java/JS/Android/iOS/Ruby) | https://aws.amazon.com/api-gateway/faqs/ · https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-generate-sdk.html |
| 요청 검증: 백엔드 호출 전 검사·실패 시 400 즉시 거절 / 필수 파라미터·body 모델(JSON Schema) / OpenAPI 확장으로 정의 | 동작(시험 포인트) | 확인됨 | 모델 불일치 400 Bad Request, x-amazon-apigateway-request-validators 확장 실재 | https://docs.aws.amazon.com/whitepapers/latest/security-overview-amazon-api-gateway/security-design-principles.html · api-gateway-swagger-extensions-request-validators.html |
| 캐시: 기본 TTL 300초·범위 0~3600초·TTL=0이면 캐시 안 함 / Stage 수준+메서드별 override / 용량 0.5GB~237GB·암호화 옵션·비용 커서 주로 prod | 수치(시험 포인트) | 확인됨 | 전부 일치. 부기: 기본 캐시 대상은 GET 메서드(캐시), 캐시 가능 응답 최대 1MB, 시간당 과금·프리 티어 제외 | https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-caching.html · https://docs.aws.amazon.com/sdk-for-cpp/latest/api/aws-cpp-sdk-apigateway/html/_cache_cluster_size_8h_source.html |
| 캐시 무효화: 콘솔/CLI 전체 flush / `Cache-Control: max-age=0` + IAM `InvalidateCache` 권한 / 미강제 시 아무 클라이언트나 무효화 가능 | 동작(시험 포인트) | 확인됨 | execute-api:InvalidateCache 정책·"Require authorization" 미설정 시 임의 무효화 문서 그대로 | api-gateway-caching.html |
| 사용 계획: throttle(rate·burst)+quota(일/주/월 총량) / API 키는 `x-api-key` 헤더 / 키·Stage를 계획에 연결 | 수치+동작(시험 포인트) | 확인됨 | 쿼터 period DAY/WEEK/MONTH, X-API-Key 헤더(HEADER 소스). 부기: 공식 경고 "API 키를 인증/인가 수단으로 사용 금지" | https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html · https://docs.aws.amazon.com/apigateway/latest/api/API_QuotaSettings.html · https://docs.aws.amazon.com/sdk-for-ruby/v2/api/Aws/APIGateway/Types/RestApi.html |
| 설정 순서(스텝): ①메서드에 키 필수 ②사용 계획 생성(throttle·quota) ③계획에 Stage·API 키 연결 ④x-api-key로 호출 | 동작(시험 포인트) | 확인됨 | 현행 도움말 흐름("먼저 플랜 생성 → 키·스테이지 연결")과 부합. 부기: ①에 "스테이지 배포" 명시(키 요구는 배포 후 유효), 키 생성/가져오기 단계 별도 표기 권장 — 순서 문제 대비 | https://docs.aws.amazon.com/help-panel/apigateway/latest/console/usage-plan-create.html · api-gateway-api-usage-plans.html |
| 계정 수준 기본 한도(soft) 약 10,000 rps·버스트 5,000·리전별·상향 요청 가능 / Stage·메서드·키별 세분화 / 초과 시 429 | 수치(시험 포인트) | 확인됨 | 리전당 계정 10,000 RPS(전 API 유형 합산)·토큰 버킷 최대 5,000·상향 가능(Yes). THROTTLED=429. 부기: 일부 리전 기본 2,500/1,250, 버스트는 고객 조정 불가 항목 | https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html · supported-gateway-response-types.html |
| IntegrationLatency=백엔드로 넘긴 뒤 응답 받기까지 / Latency=클라이언트 요청 수신→응답 반환 전체(= IntegrationLatency+게이트웨이 오버헤드) / Latency ⊃ IntegrationLatency 비교 진단 | 동작(시험 포인트) | 확인됨 | 정의 문서와 문구 수준까지 일치 | https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.RestApiBase.html · https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/appinsights-metrics-api-gateway.html |
| 주요 지표: Count, 4XXError, 5XXError, Latency, IntegrationLatency, CacheHitCount, CacheMissCount / X-Ray로 전 구간 추적(API GW+Lambda) | 수치+동작 | 확인됨 | 지표명 일치, X-Ray는 REST 지원 | appinsights-metrics-api-gateway.html · http-api-vs-rest.html |
| CORS: 다른 Origin 호출 시 필수 / OPTIONS preflight / 응답 헤더 3종(Allow-Origin/Methods/Headers) / 콘솔 일괄 설정 | 동작(시험 포인트) | 확인됨 | 3개 헤더·콘솔 설정 시 OPTIONS 메서드 생성 문서 부합. 부기(중요): **프록시 통합은 백엔드가 CORS 헤더 직접 반환** — 이 함정이 파일에 없음(수정 지시 4) | https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html · help-panel rest-cors |
| 인증 4방식: IAM(SigV4, 내부)/Resource Policy(교차 계정·IP·VPC)/Cognito UP(토큰 자동 검증·코드 불필요·인증만, 인가는 백엔드)/Lambda Authorizer(Token·Request 2유형, IAM 정책+principalId 반환, 결과 캐시 기본 TTL) | 동작(시험 포인트) | 확인됨 | COGNITO_USER_POOLS 오서라이저 토큰 검증, Lambda Authorizer TOKEN/REQUEST·정책+principal 반환·캐시 기본 300초(최대 3600). 리소스 정책 aws:SourceVpc/Vpce·교차 계정 확인. 부기: Cognito도 OAuth 스코프 인가 옵션 존재(통념 수준 단순화) | https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html · api-gateway-lambda-authorizer-input.html · apigateway-enable-cognito-user-pool.html · apigateway-private-api-create.html · https://docs.aws.amazon.com/sdk-for-ruby/v3/api/Aws/APIGateway/Types/CreateAuthorizerRequest.html |
| REST vs HTTP 표: 사용 계획·API 키/캐싱/요청 검증·매핑 템플릿/WAF/Private 엔드포인트 — HTTP 미지원, HTTP는 저렴·저지연·CORS 내장 | 동작(시험 포인트) | 확인됨 | 비교표 전 행 일치 (API 키 No·캐싱 No·요청 검증 No·바디 변환 No·WAF No·Private/Edge 엔드포인트 No) | http-api-vs-rest.html |
| WebSocket: 양방향·서버 먼저 push·`wss://` / $connect·$disconnect 특수 라우트·커스텀 라우트($request.body.action)·$default(미매칭) | 동작(시험 포인트) | 확인됨 | 사전 정의 라우트 3종·route selection expression·비매칭→$default | https://docs.aws.amazon.com/apigateway/latest/developerguide/websocket-api-develop-routes.html · https://docs.aws.amazon.com/help-panel/apigateway/latest/console/websocket-route-key.html |
| @connections 콜백: connectionId 저장(예: DynamoDB) / POST=전송·GET=상태 조회·DELETE=강제 종료 / IAM 권한 `execute-api:ManageConnections` 필요 | 동작(시험 포인트) | 확인됨 | 3개 동사 용도·SigV4 서명 필수·ManageConnections 액션 명시 | https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-how-to-call-websocket-api-connections.html · apigateway-websocket-control-access-iam.html |
| 아키텍처: 단일 진입점→마이크로서비스 라우팅, Cognito/WAF/캐시/X-Ray 조립 | 동작 | 확인됨 (통념 수준) | 표준 레퍼런스 패턴 — 개별 검증 대상 수치 없음 | — |
| 빈출 표시는 "공식 수치 아닌 추정 지표" 명시 | 메타 | 문제 없음 | 파일 스스로 한계 명시 — 모범적 | — |

## Task 커버리지 (담당: 1-4 — Task 1.1 / 3.2 / 3.3 / 3.4 / 4.3)

- **커버**: REST vs HTTP API / 통합 유형 4종 / 매핑 템플릿(Task 1.1 요청·응답 변환) / 요청 검증(Task 1.1) / 스테이지·스테이지 변수(Task 3.2·3.3) / 커스텀 도메인+ACM(Task 3.4) / 카나리(Task 3.4) / 인증 4종(+API 키는 사용 계획 섹션) / 캐싱(Task 4.3) / 스로틀링·사용량 계획 / CORS / WebSocket 개요 — RUBRIC §2 1-4 키워드 전부.
- **누락**: **상태 코드 오버라이드**(Task 1.1) — 통합 응답에서 상태 코드를 바꾸는 각도 부재. 보충 생성 목록 후보.
- **표면 커버**: 없음. (부기: 오류 코드는 502·429만 다룸 — 504/통합 타임아웃 29초가 아예 없음. Task 키워드는 아니므로 판정 미반영, 보충 생성 목록으로.)

## 범위 이탈 (축1 L5 참조용)

- 없음. 14개 섹션 전부 1-4 범위.

## 출제 각도 부정합

- 없음. Task 동사 대비 "상황→선택" 결정표·함정 콜아웃·트레이드오프 비교 중심 — 정합 우수.

## 폐기 문항 (레거시 F4)

- 해당 없음 (퀴즈 성분 없음 → F4 N/A).

## 수정 지시 (실행 가능하게)

1. **로그 레벨 수정** — `Monitoring` "CloudWatch Logs" 카드: "로그 레벨 ERROR/INFO/DEBUG" → "**Off / Errors only / Errors and info** + 요청·응답 본문은 별도 Data tracing 토글(민감 데이터 주의)". 근거: set-up-logging.html.
2. **REST vs HTTP 표 인증 행 보완** — `RestVsHttp` HTTP API 칸 "JWT · OIDC/OAuth2 · Cognito · Lambda" → "**IAM** · JWT(OIDC/OAuth2, Cognito 겸용) · Lambda Authorizer" 로 IAM 추가. 근거: http-api-vs-rest.html.
3. (보강·판정 무관) `Monitoring` 또는 `Integration`에 **통합 타임아웃 기본 29초→초과 시 504** 블록 추가(Regional/프라이빗 REST는 쿼터 증가로 29초 초과 가능, 2024-06~). 현재 이 파일은 504·29초를 전혀 다루지 않아 중복 파일 대비 결손. 근거: rest-timeout.html.
4. (보강·판정 무관) `Cors` 섹션에 프록시 통합 함정 추가: "Lambda/HTTP **프록시 통합은 게이트웨이가 통합 응답을 만들지 않으므로 백엔드가 Access-Control-Allow-* 헤더를 직접 반환**해야 함". 근거: how-to-cors.html.
5. (경미·부기) `Stages` "원하는 만큼 Stage 생성 가능" → "여러 Stage 생성 가능(dev/test/prod 등)"으로 완화. `Usage` 설정 순서 ①에 "스테이지 배포" 명시 + 키 생성 단계 분리(문서 절차와 정렬).
6. (보충 생성 목록) 상태 코드 오버라이드(Task 1.1) 개념 블록 / 오류 코드 표(400·403·429·502·503·504) / 페이로드 10MB 한도 / 퀴즈·해설 성분 부재.

## 중복 관찰 (vs aws-dva-api-gateway.jsx — 판정 미반영)

- 주제 집합 사실상 동일: 14개 단원이 상대 13개 단원과 1:1 대응(+인트로 학습 지도).
- 본 파일 고유: 인트로 주제별 우선순위 표·Lambda 프록시 응답 형식 JSON 명시(502 연결)·IntegrationLatency vs Latency 막대 시각화·사용 계획 설정 순서 스텝 UI·인증 "상황→선택" 결정표·버스트 5,000 수치·빈출도 추정치 면책 명시·마이크로서비스 레퍼런스 아키텍처.
- 상대 파일 고유: 오류 코드 표(503·504 포함)·29초 규칙·캐시 "Require authorization" 함정·인증서 us-east-1 함정 콜아웃·CloudFront 단일 도메인(S3+API) 아키텍처·강의 번호 매핑.
- 공통 오류 동일(로그 레벨 DEBUG, REST vs HTTP 인증 행의 IAM 취급) — 동일 원전 기반 재구성 추정. 본 파일은 스테이지 변수 전달 경로(event)를 정확히 기술한 반면 상대는 오기(context) — 통합 시 본 파일 서술 채택 권장. 통합 결정은 인간 몫.

## 스키마 피드백 요약

"상황→선택" 결정표·번호 매김 설정 순서 스텝 → docs/SCHEMA_FEEDBACK_AXIS2.md에 제안 기록. 빈출도 배지(면책 문구 포함)·콜아웃 3유형·카드 그리드는 기존 제안과 동일 패턴이라 중복 기록 생략.
