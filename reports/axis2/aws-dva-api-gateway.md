# 축2 리포트: aws-dva-api-gateway

모드: 레거시 / 성분 태그: 설명 O · 예시 O(SVG 다이어그램 10개·시나리오·비교표·문제 풀이 공식 — CLI/JSON 실코드 없음) · 퀴즈 X · 해설 X / 매핑 챕터: 1-4 API Gateway / **판정: 수정**

> 검증 방식 부기: 세션 MCP 클라이언트 단선으로 동일 AWS MCP 서버를 HTTP 직접 호출로 사용 (반환 URL 동일). 캐시: docs/VERIFIED_FACTS.md.
> 중복 부기: aws_api_gateway_dva.jsx와 실질 중복 쌍 — 사용자 결정으로 둘 다 정식 평가 (하단 「중복 관찰」).

## 사실 검증표

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| "API Gateway의 **최대** 통합 타임아웃 29초, 초과 시 504" (`monitoring` 29초 규칙 콜아웃) | 수치(시험 포인트) | **수정 필요** | 현행: **기본 29초**(50~29,000ms 조정 가능)이며 **Regional·프라이빗 REST API는 서비스 쿼터 증가 요청으로 29초 초과 가능**(계정 스로틀 쿼터 감축 요구될 수 있음, 2024-06 변경). "최대 29초" 단정은 구버전. 504 자체는 확인 | https://docs.aws.amazon.com/help-panel/apigateway/latest/console/rest-timeout.html · https://aws.amazon.com/blogs/compute/serverless-icymi-q2-2024/ |
| 스테이지 변수는 "Lambda의 **context 객체**로 전달됨" (`stages`) | 동작(최빈출 섹션) | **수정 필요** | 프록시 통합에서 전체 요청이 **event**로 매핑되며 스테이지 변수는 **event의 `stageVariables` 필드**로 전달 (비프록시는 매핑 템플릿 `$stageVariables` 참조). context 객체 아님 | https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html |
| REST vs HTTP 표 인증 행: HTTP API "OIDC·OAuth 2.0·JWT 내장" / REST "IAM·Cognito·Lambda Authorizer" (상호배타 함의) | 동작(시험 포인트) | **수정 필요** | 현행 비교표: **HTTP API도 IAM 인증·Lambda Authorizer 지원**(+JWT). REST는 JWT 네이티브 미지원(Lambda Authorizer로 검증), Cognito는 양쪽 지원. 리소스 정책만 REST 전용 | https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html |
| CloudWatch Logs "로그 레벨 ERROR / **DEBUG** / INFO" (`monitoring`) | 동작 | **수정 필요** | 실행 로깅 레벨은 **Off / Errors only / Errors and info** (DEBUG 없음). 요청·응답 본문은 별도 **Data tracing** 토글(민감 데이터 로깅 주의, prod 비권장) | https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-logging.html |
| REST vs HTTP 표 통합 행: HTTP API "프록시 통합만(Lambda 프록시, HTTP 프록시, Private)" | 동작 | 수정 필요 (경미) | 현행: HTTP API도 **AWS 서비스 통합**(SQS·Step Functions 등 first-party) 지원, Cloud Map 프라이빗 통합은 HTTP 전용, MOCK·응답 스트리밍은 REST 전용. "매핑 템플릿(비프록시 커스텀)=REST 전용"은 확인 | http-api-vs-rest.html (Integrations 표) |
| 엔드포인트 3유형: Edge-Optimized(기본)=CloudFront 엣지 경유·API는 한 리전 / Regional=자체 CloudFront 결합 가능 / Private=인터페이스 VPC 엔드포인트(ENI)+리소스 정책 | 동작(시험 포인트) | 확인됨 | Edge가 REST API 기본값, CloudFront POP 경유. Regional+자체 CloudFront 패턴 문서 명시. Private은 ENI 경유 전용 | https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html |
| 커스텀 도메인 인증서: Edge는 **us-east-1** ACM 필수, Regional은 API와 같은 리전 (함정 콜아웃) | 동작(시험 포인트) | 확인됨 | 동일 | https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-regional-api-custom-domain-migrate.html · apigateway-regional-api-custom-domain-create.html |
| 변경은 배포(Deploy) 전까지 미반영 / 스테이지 URL `https://[api-id].execute-api.[region].amazonaws.com/[stage]` / 배포 이력으로 롤백 가능 | 동작(시험 포인트) | 확인됨 | 배포 이력 저장·이전 배포로 롤백 공식 확인. URL 형식 일치 | https://aws.amazon.com/api-gateway/faqs/ ("roll back a stage to a previous deployment") |
| 스테이지 "이름·개수 자유" | 수치 | 확인 불가 | 스테이지 개수 무제한의 명시 근거 미확보(계정·API 쿼터 존재) — "개수 자유" 단정 회피 권고, 판정 무관 | — |
| 스테이지 변수 사용처: Lambda ARN·HTTP 엔드포인트·매핑 템플릿 파라미터, `${stageVariables.변수명}` 문법, 스테이지 변수+Lambda alias 패턴 | 동작(시험 포인트) | 확인됨 | 환경 변수처럼 스테이지별 백엔드 전환 공식 패턴 | https://aws.amazon.com/blogs/compute/using-api-gateway-stage-variables-to-manage-lambda-functions/ · https://aws.amazon.com/blogs/architecture/things-to-consider-when-you-build-rest-apis-with-amazon-api-gateway/ |
| Canary: 트래픽 비율 자유(95/5) / 지표·로그 별도 수집 / 스테이지 변수 오버라이드 / Promote로 100% 승격 | 동작 | 확인됨 | percentTraffic 0.0~100.0, stageVariableOverrides, 카나리 전용 로그 그룹(…/Canary)·지표 별도 생성, Promote canary 콘솔 액션 | https://docs.aws.amazon.com/apigateway/latest/developerguide/canary-release.html · https://docs.aws.amazon.com/apigateway/latest/api/API_DeploymentCanarySettings.html · promote-canary-deployment.html |
| 통합 4유형: MOCK(백엔드 없이 응답)/HTTP·AWS(비프록시, 매핑 가능)/AWS_PROXY(매핑 불가)/HTTP_PROXY(매핑 불가) | 동작(시험 포인트) | 확인됨 | MOCK=백엔드 없이 API GW가 직접 응답. 매핑 템플릿(요청/응답 재구성)은 비프록시 전용 — 프록시는 passthrough | https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-mock-integration.html · set-up-lambda-proxy-integrations.html · models-mappings.html |
| AWS_PROXY: 요청 전체가 이벤트로 전달, 응답 형식(statusCode/headers/body)은 Lambda 책임 | 동작(시험 포인트) | 확인됨 | 출력 형식 {isBase64Encoded, statusCode, headers, multiValueHeaders, body} 강제 | set-up-lambda-proxy-integrations.html |
| HTTP_PROXY에서 "HTTP 헤더 추가 가능 (예: 백엔드용 API 키)" | 동작 | 확인 불가 | HTTP **API**의 HTTP_PROXY 파라미터 매핑(헤더 추가)은 문서화됨. REST API의 HTTP_PROXY에 대한 동일 서술은 스니펫 미확보 — 미검증 표기 | https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-parameter-mapping.html (HTTP API 기준) |
| 매핑 템플릿: VTL·쿼리/헤더/바디 수정·이름 변경·필터링, JSON↔XML(SOAP) 변환 | 동작(시험 포인트) | 확인됨 | VTL(Velocity Template Language) 변환 공식 | https://docs.aws.amazon.com/apigateway/latest/developerguide/models-mappings.html · https://aws.amazon.com/blogs/machine-learning/creating-a-machine-learning-powered-rest-api-with-amazon-api-gateway-mapping-templates-and-amazon-sagemaker/ |
| "Content-Type은 application/json 또는 application/xml로 **설정해야 함**" | 동작 | 확인 불가 | Content-Type별 템플릿 지정 자체는 부합하나 두 값 한정("해야 함")의 명시 근거 미확보 — 완화 재표현 권고, 판정 무관 | — |
| OpenAPI 3.0 가져오기/내보내기, x-amazon-apigateway-* 확장, SDK 자동 생성 | 동작 | 확인됨 | OpenAPI 3 import(라우트·통합·모델 생성)·export 확인, 확장 태그 실재, SDK 생성 지원(Java/JS/Android/iOS/Ruby) | https://aws.amazon.com/api-gateway/faqs/ · https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-swagger-extensions-authorizer.html · how-to-generate-sdk.html |
| 요청 검증: 백엔드 호출 전 검사, 실패 시 400, 필수 쿼리/헤더+바디 모델(JSON Schema), x-amazon-apigateway-request-validators | 동작(시험 포인트) | 확인됨 | 모델 불일치 시 "400 Bad Request" 반환(BAD_REQUEST_PARAMETERS/BODY=400), 검증기 확장 실재 | https://docs.aws.amazon.com/whitepapers/latest/security-overview-amazon-api-gateway/security-design-principles.html · api-gateway-swagger-extensions-request-validators.html · supported-gateway-response-types.html |
| 캐시: 기본 TTL 300초(0~3600초, 0=끔) / 스테이지 단위 정의·메서드 오버라이드 / 0.5GB~237GB / 암호화 옵션 | 수치(시험 포인트) | 확인됨 | 전부 일치. 부기: 캐시 대상 기본 GET만(캐시), 캐시 가능 응답 최대 1MB, 시간당 과금·프리 티어 제외("prod 권장"의 근거) | https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-caching.html · https://docs.aws.amazon.com/sdk-for-cpp/latest/api/aws-cpp-sdk-apigateway/html/_cache_cluster_size_8h_source.html (0.5/1.6/6.1/13.5/28.4/58.2/118/237) |
| 캐시 무효화: 콘솔 전체 플러시 / 클라이언트 `Cache-Control: max-age=0` + `execute-api:InvalidateCache` IAM 권한 / "Require authorization" 미체크 시 아무나 무효화 가능 | 동작(시험 포인트) | 확인됨 | 문구 그대로 문서 부합 ("any client can invalidate the API cache"). 부기: 교차 계정 무효화 미지원, 미승인 요청 처리 3옵션(403/경고 헤더/무시) | api-gateway-caching.html |
| 사용 계획: 스로틀(rate·burst)+쿼터(일/주/월) / API 키 `x-api-key` 헤더 / 키 단위 적용 / 쿼터 초과 429 | 수치+동작(시험 포인트) | 확인됨 | 쿼터 period DAY/WEEK/MONTH, X-API-Key 헤더(HEADER 소스), QUOTA_EXCEEDED=429. 부기: 공식 경고 "API 키를 인증/인가 수단으로 쓰지 말 것" | https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html · https://docs.aws.amazon.com/apigateway/latest/api/API_QuotaSettings.html · https://docs.aws.amazon.com/sdk-for-ruby/v2/api/Aws/APIGateway/Types/RestApi.html |
| 설정 순서: 키 필수+배포 → 키 생성 → 사용 계획 생성 → 스테이지·키 연결 | 동작(시험 포인트) | 확인됨 | 구성 요소·의존 관계(연결은 생성 후) 문서 부합 | api-gateway-api-usage-plans.html · https://docs.aws.amazon.com/help-panel/apigateway/latest/console/usage-plan-create.html |
| 계정 단위 소프트 리밋 10,000 req/s, 전체 API 공유, 초과 시 429 | 수치(시험 포인트) | 확인됨 | 리전당 계정 10,000 RPS(HTTP/REST/WebSocket 합산), 버스트 토큰 버킷 최대 5,000, 상향 가능. THROTTLED=429. 부기: 일부 리전 기본 2,500/1,250 | https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html · supported-gateway-response-types.html |
| 지표: Count/CacheHitCount/CacheMissCount/4XXError/5XXError, IntegrationLatency=백엔드 구간, Latency=전체(통합 지연+오버헤드) | 수치+동작(시험 포인트) | 확인됨 | 지표명·정의 문서 일치 ("Latency includes the integration latency and other API Gateway overhead") | https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/appinsights-metrics-api-gateway.html · https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.RestApiBase.html |
| 실행 로그 요청/응답 본문 포함·민감 데이터 주의 / Access Logs 형식 커스터마이징(JSON 등) / X-Ray 추적 | 동작 | 확인됨 | 실행 로그에 페이로드 포함 가능(Data tracing)·민감 데이터 경고 공식. 액세스 로그 $context 변수·CLF/JSON/XML/CSV. X-Ray는 REST 지원 | set-up-logging.html · http-api-vs-rest.html |
| 오류 코드 표: 400 검증 실패 / 403 권한·WAF / 429 쿼터·스로틀 / 502 Lambda 프록시 형식 오류 / 504 Integration Failure·Timeout | 수치+동작(시험 포인트) | 확인됨 | ACCESS_DENIED·WAF_FILTERED=403, THROTTLED·QUOTA_EXCEEDED=429, INTEGRATION_FAILURE·INTEGRATION_TIMEOUT=504, BAD_REQUEST_*=400. 502: Lambda가 오류/잘못된 형식 반환 시 | supported-gateway-response-types.html · https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway-errors.html |
| 오류 코드 표: "503 Service Unavailable — 백엔드 다운" | 동작 | 확인 불가 | 게이트웨이 응답 유형 표에 503 없음 — 일반 HTTP 의미 수준 서술(문서 근거 미확보), 오류 단정 아님 | supported-gateway-response-types.html (부재 확인) |
| CORS: OPTIONS 프리플라이트 + Allow-Origin/Methods/Headers 3종 / 콘솔 Enable CORS / **프록시 통합은 Lambda가 CORS 헤더 직접 반환** | 동작(시험 포인트) | 확인됨 | "your backend is responsible for returning the Access-Control-Allow-* headers, because a proxy integration doesn't return an integration response" — 파일 핵심 콜아웃과 정확히 일치 | https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html |
| 인증: IAM=SigV4·무료·리소스 정책 결합 교차 계정 / Cognito UP=인증만·인가는 백엔드·커스텀 코드 없음 / Lambda Authorizer=토큰·요청 파라미터 기반·IAM 정책 반환·정책 캐시 | 동작(시험 포인트) | 확인됨 | Cognito 오서라이저가 토큰 검증(COGNITO_USER_POOLS). Lambda Authorizer TOKEN/REQUEST 2유형·정책+principal 반환·결과 캐시(기본 TTL 300초). "IAM 무료"는 통념 수준(과금 항목 아님). 부기: Cognito도 OAuth 스코프 인가 옵션 존재 | https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html · api-gateway-lambda-authorizer-input.html · apigateway-enable-cognito-user-pool.html · https://docs.aws.amazon.com/sdk-for-ruby/v3/api/Aws/APIGateway/Types/CreateAuthorizerRequest.html (TTL 기본 300) |
| 리소스 정책: 특정 IP 대역·VPC 엔드포인트만 허용(Private API)·교차 계정 접근 | 동작(시험 포인트) | 확인됨 | aws:SourceVpc/aws:SourceVpce 조건, 타 계정 VPC 엔드포인트 허용 가능 | https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-api-create.html |
| HTTP API: 리소스 정책 없음·사용 계획/API 키 없음·캐싱/요청 검증/X-Ray 없음·CORS 내장·저비용 | 동작(시험 포인트) | 확인됨 | 비교표 전 항목 일치 (리소스 정책 No·API 키 No·캐싱 No·요청 검증 No·X-Ray No·WAF No·Edge/Private 엔드포인트 No) | http-api-vs-rest.html |
| WebSocket: 양방향·Stateful·`wss://[api-id].execute-api.[region].amazonaws.com/[stage]`·connectionId 유지 | 동작 | 확인됨 | @connections 콜백 URL 형식·connectionId 식별 문서 부합 | https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-how-to-call-websocket-api-connections.html |
| 서버→클라이언트: `@connections/{connectionId}`에 POST(전송)/GET(상태)/DELETE(종료), IAM SigV4 서명 필요 | 동작(시험 포인트) | 확인됨 | "must sign them with Signature Version 4" + 3개 동사 용도 일치. 부기: 필요한 IAM 액션은 execute-api:ManageConnections | apigateway-how-to-call-websocket-api-connections.html · apigateway-websocket-control-access-iam.html |
| 라우트: $connect·$disconnect·$default 3종 + route selection expression($request.body.action), 미매칭 시 $default | 동작(시험 포인트) | 확인됨 | 사전 정의 라우트 3종·JSON 속성 평가·비매칭/비JSON→$default | https://docs.aws.amazon.com/apigateway/latest/developerguide/websocket-api-develop-routes.html · https://docs.aws.amazon.com/help-panel/apigateway/latest/console/websocket-route-key.html |
| 아키텍처: CloudFront 경로 라우팅(/→S3, /api→API GW)=단일 도메인·CORS 회피 | 동작 | 확인됨 (통념 수준) | 표준 아키텍처 패턴 — 개별 URL 불요, CORS 필요 조건(교차 오리진) 서술은 how-to-cors.html과 정합 | — |
| 빈출도 게이지(1~3) | 메타 | 검증 불가(추정치) | 출처 표기 없는 추정 지표 — 명시 권장(중복 파일은 명시함), 판정 무관 | — |

## Task 커버리지 (담당: 1-4 — Task 1.1 / 3.2 / 3.3 / 3.4 / 4.3)

- **커버**: REST vs HTTP API / 통합 유형 4종 / 매핑 템플릿(요청·응답 변환, Task 1.1) / 요청 검증 규칙(Task 1.1) / 스테이지·스테이지 변수(Task 3.2·3.3) / 커스텀 도메인+ACM(Task 3.4) / 카나리(Task 3.4) / 스테이지 변수 동적 배포(Task 3.4) / 인증 4종(IAM·Cognito UP·Lambda Authorizer + API 키는 사용 계획 섹션) / 캐싱(Task 4.3) / 스로틀링·사용량 계획 / CORS / WebSocket 개요 — RUBRIC §2 1-4 키워드 전부.
- **누락**: **상태 코드 오버라이드**(Task 1.1 "API 생성·확장 — 상태 코드 오버라이드") — 통합 응답 매핑·GatewayResponse 커스터마이징으로 백엔드 상태 코드를 바꾸는 각도가 없음. 보충 생성 목록 후보.
- **표면 커버**: 없음.

## 범위 이탈 (축1 L5 참조용)

- 없음. 13개 섹션 전부 1-4 범위 (아키텍처 섹션의 CloudFront·S3 결합도 API 노출 패턴 문맥).

## 출제 각도 부정합

- 없음. Task 동사("개발·생성·확장, 배포, 최적화") 대비 시나리오·함정("배포 안 함", 인증서 리전, 캐시 무효화 보안)·"문제 풀이 공식" 중심 — 정합 우수.

## 폐기 문항 (레거시 F4)

- 해당 없음 (퀴즈 성분 없음 → F4 N/A).

## 수정 지시 (실행 가능하게)

1. **29초 규칙 갱신** — `SecMonitoring` "29초 규칙" 콜아웃: "최대 통합 타임아웃은 29초" → "통합 타임아웃 **기본 29초**(50~29,000ms 설정). **Regional·프라이빗 REST API는 쿼터 증가 요청으로 29초 초과 가능**(계정 스로틀 감축 조건부, 2024-06~) — Edge는 여전히 29초 상한. 초과 시 504". 근거: rest-timeout.html.
2. **스테이지 변수 전달 경로 수정** — `SecStages` 불릿 "Lambda의 context 객체로 전달됨" → "프록시 통합에서는 이벤트(event)의 `stageVariables` 필드로 전달, 비프록시는 매핑 템플릿에서 `$stageVariables`로 참조". 근거: set-up-lambda-proxy-integrations.html.
3. **REST vs HTTP 표 인증 행 갱신** — `SecRestVsHttp`: HTTP API 칸에 "IAM·Lambda Authorizer **지원**(+JWT/OIDC 내장)" 추가, REST 칸에 "JWT 네이티브 미지원(Lambda Authorizer로 대체)" 부기. 리소스 정책·사용 계획 행은 유지(정확). 근거: http-api-vs-rest.html.
4. **로그 레벨 수정** — `SecMonitoring` CloudWatch Logs 불릿: "ERROR / DEBUG / INFO" → "**Off / Errors only / Errors and info** + 요청·응답 본문은 별도 Data tracing 토글(민감 데이터 주의)". 근거: set-up-logging.html.
5. (경미) `SecRestVsHttp` 통합 행: "프록시 통합만" → "Lambda 프록시·HTTP 프록시·프라이빗 통합 + **AWS 서비스 통합**(SQS·Step Functions 등). 비프록시 커스텀(VTL 매핑)·MOCK은 REST 전용".
6. (경미·부기) `SecIntegration` "Content-Type은 application/json 또는 application/xml로 설정해야 함" → "Content-Type별로 템플릿 지정(대표: application/json, application/xml)"로 완화. `SecMonitoring` 오류 표 503 행에 "일반 HTTP 의미(문서상 게이트웨이 응답 유형 아님)" 각주. HTTP_PROXY 헤더 추가는 "HTTP API 파라미터 매핑 기준" 각주.
7. (보충 생성 목록) 상태 코드 오버라이드(통합 응답 매핑·GatewayResponses) 개념 블록 + 페이로드 한도 10MB(REQUEST_TOO_LARGE 413, 기본 메시지 "content length exceeded 10485760 bytes") 항목 + 퀴즈·해설 성분 부재.

## 중복 관찰 (vs aws_api_gateway_dva.jsx — 판정 미반영)

- 주제 집합 사실상 동일: 개요·엔드포인트/스테이지/카나리/통합·매핑/OpenAPI/캐싱/사용 계획/모니터링/CORS/인증/REST vs HTTP/WebSocket/아키텍처 (13 vs 14 단원, 상대는 인트로 학습 지도 추가).
- 본 파일 고유: 오류 코드 표(400~504 전체)·29초 규칙 명시·계정 스로틀 공유 경고·캐시 "Require authorization" 함정·인증서 리전(us-east-1) 함정 콜아웃·CloudFront 단일 도메인(S3+API, CORS 회피) 아키텍처·강의 번호(339~359) 매핑.
- 상대 파일 고유: Lambda 프록시 응답 형식 JSON 명시·IntegrationLatency vs Latency 시각화·설정 순서 스텝 UI·"상황→선택" 결정표·버스트 5,000 수치·마이크로서비스 레퍼런스 아키텍처.
- 공통 오류 동일(로그 레벨 DEBUG, REST vs HTTP 인증 행 구식) — 동일 원전(강의) 기반 재구성으로 추정. 통합 결정은 인간 몫.

## 스키마 피드백 요약

모드 토글 비교 뷰(프록시/비프록시, 인증 3방식 버튼 전환+다이어그램 교체) → docs/SCHEMA_FEEDBACK_AXIS2.md에 제안 기록. 빈출도 게이지·콜아웃 3유형은 기존 제안과 동일 패턴이라 중복 기록 생략.
