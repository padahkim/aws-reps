# 축2 평가 진행 현황 (일시 중단 스냅샷)

> 작성: 2026-07-13. 축2(사실·시험 정합성) 평가 세션. 모드: **레거시**.
> 이 문서는 평가 재개용 인수인계 노트다. RUBRIC §7 프로토콜을 따른다.

## 한 줄 요약

레거시 콘텐츠 **24파일** 중 **7파일 평가 완료**(전부 "수정" 판정), **17파일 대기**. 사용자 요청으로 일시 중단.

## 완료 (7/24) — 커밋됨

| 배치 | 파일 | 판정 | 커밋 |
|---|---|---|---|
| 0 (캘리브레이션) | dynamodb-guide | 수정 | 33c6789 |
| 0 | aws-dva-stage0 | 수정 | 33c6789 |
| 0 | dva-chapter-template | 수정 | 33c6789 |
| 1 | aws-dva-s3-guide | 수정 | 4301f99 |
| 1 | aws-s3-dva-guide | 수정 | 4301f99 |
| 2 | aws-dva-api-gateway | 수정 | 661b127 |
| 2 | aws_api_gateway_dva | 수정 | 661b127 |

리포트 위치: `reports/axis2/{id}.md`. 검증 캐시: `docs/VERIFIED_FACTS.md`(96행). 스키마 제안: `docs/SCHEMA_FEEDBACK_AXIS2.md`(14건).

## 대기 큐 (17파일) — 미평가

권장 배치 순서(주제 묶음, 3~5파일 단위로 조정 가능):

| 배치 | 파일 | 매핑 챕터 |
|---|---|---|
| 3 (중단됨) | aws-lambda-dva-guide (3651줄), aws-lambda-dva-guide-2 (1704줄) | 1-2 Lambda (중복 쌍) |
| 4 | aws-dva-iam-guide-2, iam_guide | 0-2 IAM (중복 쌍) |
| 5 | aws-dva-security-guide-1, aws-cognito-guide | 3-1·3-2·3-3 보안 |
| 6 | aws-dva-messaging, aws-messaging-visual-guide | 2-1·2-2·2-4 메시징 (중복 쌍) |
| 7 | aws-cicd-guide, aws-dva-cicd | 4-5 CI/CD (중복 쌍) |
| 8 | aws-dva-ec2-guide, aws-dva-elb-asg | 4-0 컴퓨팅 |
| 9 | aws-dva-rds-aurora-elasticache, aws-vpc-guide | 5-4 / VPC(경계·사용자 결정으로 평가 유지) |
| 10 | lambda-dva-study | 1-2 Lambda 연습(문답형) |
| 11 (신규) | aws-elastic-beanstalk-guide, cloudformation-dva-guide | 4-2 / 4-3 (공백 챕터 충원분) |

중복 쌍(같은 주제 2파일): Lambda·IAM·API GW(완료)·메시징·CI/CD·S3(완료). 사용자 결정 = **둘 다 정식 평가**. 각 리포트에 `## 중복 관찰` 섹션으로 상대 대비 고유/겹침 단원 기록(통합 결정은 인간 몫, 판정 미반영).

## 반복 패턴 (누적 발견) — "만들 당시엔 맞았으나 이후 AWS가 규칙 변경"

전부 시험 포인트 자리에 박혀 있어 그대로 외우면 실점. 재작성 시 우선 반영:
1. S3 객체 최대 크기: 5TB → **50TB** (배치 1, 2파일)
2. DynamoDB TTL 삭제 시점: "48시간 내" → **"며칠 내(a few days)"** (배치 0)
3. DynamoDB 용량 모드 전환: "24h 1회" → **프로비저닝→온디맨드 24h당 4회, 역방향 언제든** (배치 0)
4. SigV4 서명 오류 HTTP 코드: 401 → **403** (배치 0)
5. API GW 통합 타임아웃: "최대 29초" → **기본 29초, 리전·프라이빗 REST는 쿼터 증가로 초과 가능**(2024-06) (배치 2)
6. API GW 스테이지 변수 전달: "context 객체" → **event.stageVariables** (순수 동작 오류, 배치 2)
7. API GW 로그 레벨: "ERROR/INFO/DEBUG" → **Off / Errors only / Errors and info** (배치 2, 2파일 공통)

추가 최신화 필요(캐시에 ⚠️ 표기): SSE-C 2026-04부터 신규 버킷 기본 차단, S3 Metadata 신기능으로 "메타데이터 검색 불가" 서술 낡음.

## 커버리지 갭 (누적) — 보충 생성 목록 후보

- Task 1.1 "상태 코드 오버라이드": API GW 2파일 모두 누락
- DynamoDB 직렬화/역직렬화(1.3.5), 0단계 지수 백오프+Jitter·CLI 프로파일·페이지네이션
- 커리큘럼 자체 공백(EXAM_TASK_MAP 갭 보고): Q Developer, OpenSearch, AppConfig, Amplify·Copilot

## 재개 방법 (다음 세션/시점)

1. 워크트리 진입: 이 세션 아니면 `EnterWorktree(path=/Users/padahkim/pdk/projects/dva-eval-axis2)` 또는 해당 폴더에서 새 Claude 실행. 브랜치 `eval/axis2` 확인.
2. AWS 문서 검색 도구: **세션 MCP 클라이언트가 단선되면** 스크래치패드의 `mcp.sh`로 HTTP 직접 호출 (init → search/readdoc). 새 세션이면 MCP가 `.mcp.json`에서 정상 로드될 수 있으니 먼저 `aws___search_documentation` 도구 존재 확인.
3. 배치별로 서브에이전트 투입(파일 2~3개) → 리포트+VERIFIED_FACTS+SCHEMA_FEEDBACK 작성 → 배치마다 커밋. 프롬프트 템플릿은 배치 1~3 서브에이전트 프롬프트 참조(판정 눈금·철칙·중복 관찰·쓰기 경계 동일).
4. **판정 눈금(캘리브레이션 확정, 재해석 금지)**: 레거시 모드=형식/스키마 판정 반영 금지 / 단독 챕터 기준(커버리지 누락=수정 사유) / 시험 정답 영향 사실 오류만 수정 사유, 표현 미세조정은 부기만 / 퀴즈 정답 오류는 문항만 폐기 목록.
5. 17파일 완료 후 §7 최종 보고: 판정 분포·누락 Task 요약·반복 사실 오류 패턴·스키마 피드백 건수 종합 + 최종 커밋.

## 쓰기 경계 (엄수)
허용: `reports/axis2/**`, `docs/EXAM_TASK_MAP.md`, `docs/VERIFIED_FACTS.md`, `docs/SCHEMA_FEEDBACK_AXIS2.md`
금지: content/** 수정, RUBRIC.md·CURRICULUM.md 수정, reports/axis1/** 접근, gh CLI, git push, 파괴적 git.

## 참고: RUBRIC §6 수정됨
커밋 ac03257 — 머지 대상 "main → develop"으로 정정(소유자 지시). 축1 워크트리 RUBRIC 사본은 미반영(머지 실행 주체가 인간이라 실무 영향 없음).
