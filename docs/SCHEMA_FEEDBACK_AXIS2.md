# SCHEMA_FEEDBACK_AXIS2 — 스키마 v0 개선 제안 (축2 관점)

> RUBRIC §7-4. **제안만 기록 — 스키마 확정은 인간이 한다.** 판정과 분리된 문서.

| 발견 파일 | 구조 | 제안 | 근거 |
|---|---|---|---|
| dva-chapter-template.jsx | `quizzes[].options[].why` — 선택지마다 "왜 틀렸는지/왜 정답인지" 해설 | Question 스키마의 단일 `explanation`을 `explanation` + `choiceExplanations[4]`(선택지별)로 분리 | 오답의 조건화가 서비스 선택 판단력을 만듦(축1 L2 앵커와 직결). v0 단일 필드로는 이 구조 표현 불가 |
| dva-chapter-template.jsx | `concepts[]{q, a, why}` — 인출 카드(질문 먼저, 탭하면 정답+정교화 질문) | Section에 `retrievalCards[]{q, a, why}` 유형 추가 검토 | 인출연습·정교화를 스키마 수준에서 강제 가능. body(md)에 평문으로 넣으면 앱이 인터랙션 렌더링 불가 |
| dva-chapter-template.jsx | `mixed[]{scenario, service, why, contrast}` — 혼합복습(교차학습) 카드 | Chapter에 `mixedReview[]` 필드 또는 finalQuiz에 `sourceChapter` 속성 추가 | 축1 L8(누적 복습) 앵커를 스키마가 지원하려면 "이전 챕터 문항 혼입" 구조 필요 |
| dva-chapter-template.jsx | `diagram{nodes[]{role, name}, edges[]}` — 역할→서비스명 인출형 도식 | Section에 구조화된 `diagram` 필드(노드/엣지) 검토 — md 이미지로는 인터랙션 소실 | 이중부호화 학습 원리. 단 앱 렌더러 복잡도 증가 — 인간 판단 필요 |
| dynamodb-guide.jsx | `FreqBanner(level 1~5, note)` — 섹션별 출제 빈도 배너 | Section에 `examFrequency(1~5)` 필드 추가 | 22파일 중 다수가 빈출도 표기를 자체 구현 — 공통 수요. 단 빈도값의 근거(추정치)는 검증 불가 표기 필요 |
| dynamodb-guide.jsx | 시험 요약 치트시트 표 (주제→반드시 기억할 것) | Chapter에 `cheatSheet[]{topic, fact}` 필드 검토 | 여러 파일이 말미 치트시트 패턴 반복(aws-cicd-guide, aws-dva-elb-asg 등). examPoints의 챕터 수준 집계본 |
| dynamodb-guide.jsx | Callout 4유형 (시험 포인트/핵심 정리/주의/참고) | `examPoints[]`를 `callouts[]{type, text}`로 일반화 검토 | v0의 examPoints는 유형 구분이 없어 "함정 주의" vs "핵심 정리"를 구분 못함 |
| aws-dva-stage0.html | 체크리스트 (자기평가 문장 + 빈출도 별점) | Chapter에 `selfCheck[]{statement, freq}` 검토 — finalQuiz와 별개 유형 | "이 문장이 술술 나오면 통과" — 문항이 아닌 서술형 자기평가. v0에 대응 필드 없음 |
| aws-s3-dva-guide.jsx | `Fact` 카드 그리드 — 제목+아이콘+짧은 스펙 본문(수치·한도류를 본문에서 분리) | Section에 `factCards[]{title, body}` 필드 검토 (또는 examPoints의 구조화 확장) | 수치/한도 주장이 카드 단위로 고립되어 축2 검증 단위와 1:1 대응 — 검증·갱신(예: 5TB→50TB) 시 수정 지점이 명확해짐. body(md)에 산문으로 녹으면 이 이점 소실 |
| aws-s3-dva-guide.jsx | `freqNote` — 빈출도 수치 옆에 "무엇이/왜 출제되는지" 한 줄 (예: "권한 상속과 만료 시간, 업로드/다운로드 용도가 빈출") | `examFrequency`(기존 제안)에 `freqNote` 동반 필드 추가 검토 | 빈도 숫자만으로는 근거 불명(검증 불가 추정치)인데, 사유 한 줄이 있으면 학습 우선순위 안내가 실질화되고 축2가 사유의 사실성만 점검하면 됨 |
| aws-dva-s3-guide.jsx | 그룹→외부 퀴즈 범위 매핑(`GROUP_QUIZ` "여기까지가 퀴즈 N 범위" 배너) | Chapter/Section에 퀴즈 범위 경계 참조 필드(`quizScopeRef`) 검토 | 콘텐츠와 퀴즈가 분리 생성될 때 "어느 섹션까지가 어느 퀴즈 범위인지"를 표현할 수단이 v0에 없음 — 인출 연습 시점 설계(축1 L1)와도 연결 |
| aws-dva-api-gateway.jsx | 모드 토글 비교 뷰 — 상호배타 옵션(프록시/비프록시, 인증 3방식)을 버튼 전환 + 옵션별 다이어그램 교체로 병렬 비교 | Section에 `comparisonViews[]{option, body, diagram?}` 유형 검토 | DVA 출제 핵심이 "옵션 간 선택"이라 비교 단위가 곧 학습 단위. body(md) 평문화 시 옵션 대응 구조·전환 인터랙션 소실 — 축2 관점에서도 옵션별 주장을 1:1 검증 가능 |
| aws_api_gateway_dva.jsx | 결정 표 — "상황 → 선택" 2열 표(인증 선택 기준: 상황별 IAM/Resource Policy/Cognito/Lambda Authorizer) | Section 또는 Chapter에 `decisionTable[]{scenario, choice, why?}` 검토 | 시나리오→서비스 선택이 DVA 문제 형식과 1:1 대응 — examPoints(산문)보다 구조화된 판단 훈련 단위이고, 축2가 행 단위로 정오 검증 가능 |
| aws_api_gateway_dva.jsx | 번호 매김 절차 스텝(사용 계획 설정 순서 ①~④ 스텝 UI) | Section에 `procedure[]{step}` (순서 있는 절차) 필드 검토 | "올바른 설정 순서" 유형 문제가 실존(사용 계획·배포 등) — 순서 자체가 검증 대상 사실인데 v0 body(md)에서는 순서 구조가 산문에 묻힘 |
| aws-lambda-dva-guide-2.jsx | "시나리오 → 정답 패턴" 9개 리스트(질문·선택지 없이 상황→권장 조치 1:1 매핑) | 기존 제안(`decisionTable[]{scenario, choice, why?}`, aws_api_gateway_dva.jsx 근거)과 동일 구조 — 신규 필드 대신 이 파일을 두 번째 근거 사례로 추가 확인. 채택 시 우선순위 상승 신호 | 두 파일이 독립적으로 같은 구조를 자체 구현 — 스키마 v1 후보로서 재현성 있는 수요 |
| aws-lambda-dva-guide-2.jsx | 인터랙티브 슬라이더(예약 동시성 분배, 가중치 별칭 트래픽 — 드래그로 파라미터 조작 시 효과 실시간 반영) | Section에 `interactiveSlider[]{param, min, max, effect}` 필드 신규 검토 | 개념(예약 동시성이 나머지 풀에서 차감됨 등)을 수동 조작하며 체득하는 구조 — 기존 `comparisonViews`(옵션 전환)와 달리 연속값 파라미터 조작이라 별도 필드 필요. v0에 대응 없음, 앱 렌더러 복잡도 증가하므로 인간 판단 필요 |
| aws-dva-security-guide-1.jsx | "시험 직전 10초 요약" 표 (키워드→정답 방향 2열) | 챕터 v1 스키마에 `examSummary: {keyword, answer}[]` 같은 압축 복습용 필드 도입 검토 — 축1 관점에서도 인출 연습 트리거로 유용 | 파일 말미 "⚡ 시험 직전 10초 요약" 섹션 |
| aws-dva-security-guide-1.jsx | 서비스 비교표(KMS vs CloudHSM, SSM vs Secrets Manager)가 본문 곳곳에 자유 배치 | `Section.comparisonTable` 명시적 필드로 승격 검토 — "두 서비스 중 고르기" 유형 문제 대비 콘텐츠임을 스키마 수준에서 표시 가능 | 섹션07, 섹션10 |
| aws-cognito-guide.jsx | `StepPlayer` 인터랙티브 단계 재생(버튼 클릭으로 플로우 단계 진행, SVG 하이라이트) | 절차형 개념(로그인 흐름·자격 증명 교환)을 위한 `Section.flowSteps[]` 필드 도입 검토 | CupFlow/AlbFlow/CipFlow + StepPlayer 컴포넌트 전반 |
| aws-cognito-guide.jsx | 탭 기반 네비게이션(강의 섹션 번호 394~401을 탭으로 구성) | Chapter/Section 계층과 별개로 "원본 강의 번호" 같은 출처 메타 필드 검토(변환 시 챕터 매핑 추적용) | TABS 상수, 헤더의 "SECTION 394–401" 표기 |
| aws-dva-messaging.jsx | `SECTIONS[].note` + `Freq`(1~5 별점 시험 빈출도) | Section에 `examFrequency`(1~5)와 `oneLinerSummary` 필드 검토 — 축1 L5·L7 판단 시 저자 의도(빈출도 추정치)를 구조적으로 참조 가능 | 전 섹션 일관 적용, v0 Section 스키마엔 없음 |
| aws-dva-messaging.jsx | `Cmp`(비교표: SQS vs SNS vs Kinesis, Data Streams vs Firehose, 프로비저닝 vs 온디맨드) | 서비스 선택형 문제 대비 "결정표(decision table)" 구조를 Section과 별개 최상위 성분으로 인정 검토 | §15 SecCompare 등 3개 비교표, 기존 decisionTable 제안과 동일 계열 |
| aws-messaging-visual-guide.jsx | `Code`(제목 있는 코드박스: CLI 명령·JSON 정책) | Section에 `codeExamples[]`(title, lang, snippet) 필드 검토 — 축1 L3(구체 예시 결합) 앵커의 "실전 지문과 닮은 예시 형태" 요건과 직결 | 8개 섹션에서 반복 사용된 일관 구조 |
| aws-messaging-visual-guide.jsx | `META.pills[]`(홈 화면 "시험 전 30초 핵심 숫자" 요약 배열) | Chapter 최상위에 `keyNumbers[]`(짧은 수치 요약 문자열 배열) 필드 검토 | 13개 pill이 챕터 전체 수치를 압축 요약, 축1 L1·복습 설계 참조 가치 |
| aws-vpc-guide.jsx | 클릭형 인터랙티브 SVG 다이어그램(노드 클릭 → 상세 설명 패널) | Section.examples 하위에 "interactive_diagram" 서브타입 또는 컴포넌트 참조 필드 신설 검토 | 5개 다이어그램이 모두 이 패턴 사용, 정적 md로는 클릭 인터랙션 표현 불가 |
| aws-vpc-guide.jsx | "🎯 시험 단서 → 정답 빠른 매칭" 2열 표 | ExamTip 콜아웃 유형에 "단서-매칭표" 서브타입 추가 검토 | dynamodb-guide의 산문형 ExamTip과 달리 표 형태로 다수의 단서-정답 쌍을 압축 제시 |
| aws-dva-monitoring.jsx | 빈출도 배지(Freq, 1~4단계 막대 아이콘 + 라벨) | Section/Question에 `examFrequency`(1~4 or enum) 필드 검토 — 기존 examFrequency 제안과 동일 계열, 재현 사례 추가 | 전 섹션 SecHead에 f={1~4} prop으로 일관 적용 |
| aws-dva-monitoring.jsx | "시험 포인트" Tip 콜아웃(제목 가변) | Section에 `examTips[]`(string[] 또는 md) 필드 검토 — miniQuiz 없이도 시험 포인트를 명시적으로 태깅 가능 | 거의 모든 섹션 말미에 반복 등장 |
| aws-dva-monitoring.jsx | 시나리오→정답 빠른 매핑 표(SCompare: 시험 시나리오\|정답\|비고) | 챕터 마무리용 `scenarioMap[]{scenario, answer, note}` 구조 검토 — 다지선다 없이도 시험형 인출 연습에 가까운 형태 | SCompare 섹션 전용, 다른 파일들과 유사 표 다수 관찰(누적 재현) |
| aws-cicd-guide.jsx | `SECTIONS` 배열의 `freq:{lvl,txt,special}` 빈출빈도 메타 + 좌측 네비게이션 도트 시각화 | Section 스키마에 `examFrequency: {level: 0-5, label, special: bool}` 선택 필드 제안 — 여러 CI/CD 계열 파일에서 반복 등장하는 패턴 | 본문 SECTIONS 상수 |
| aws-cicd-guide.jsx | `Frame`/`FBox`/`Flow` 조합으로 만드는 "단계 파이프라인" 다이어그램(화살표 연결) | Section.examples에 `diagram: {type:"flow", steps:[{icon,title,sub}]}` 같은 구조화 필드 제안 — 자유 마크다운보다 렌더링 일관성 확보 가능 | Intro/Commit/GitHub/Pipeline/Build 등 다수 함수 |
| aws-dva-cicd.jsx | `sections[].lecture`(강의 회차 텍스트, 예: "360–361강") | Section에 `sourceRef`(선택, 원 강의/출처 식별자) 필드 제안 — 콘텐츠 추적성에 유용하나 v0엔 없음 | sections 배열 정의부 |
| aws-dva-cicd.jsx | `ExamTip` 컴포넌트(시나리오형 정답 매칭 예시 다수 포함, 퀴즈는 아님) | Section에 `examPoints[]`는 v0에 이미 있으나, 이 파일처럼 "구체 시나리오 문장 + 정답 서비스"를 짧게 페어링하는 하위 구조(`{scenario, answer}`) 명시 제안 | ExamTip 사용 전체 |
| lambda-dva-study.jsx | 자유 서술형 자가채점 퀴즈(`ChQuiz`: 정답 노출 후 스스로 맞음/틀림 표기, 누적 점수) | `Question` 스키마에 `type: "recall" \| "mcq"` 필드 추가하고 recall 타입은 `choices` 생략 허용 — 인출연습(자유 회상) 문항을 4지선다로 강제 변환하면 정보 손실 | RUBRIC §8 L1 앵커("방금 읽은 문장 되묻기" vs "적용해야 풀림")가 자유 서술형에서 더 잘 구현됨 |
| lambda-dva-study.jsx | 파라미터 조작형 시뮬레이터(콜드/웜 스타트 애니메이션, 동시성 슬라이더, 카나리 가중치 슬라이더) | Section에 `interactive: { type, params }` 같은 필드로 "능동 조작 컴포넌트 존재" 여부를 스키마 레벨에 기록 검토 | dva-chapter-template 리포트에서도 유사 제안(diagram) 존재 — 이 파일은 애니메이션·슬라이더까지 포함해 더 강한 사례 |
| aws-container-guide.jsx | 상태 기반 인터랙티브 단계별 데모(`RollingDemo`, `PlacementDemo`) | 스키마에 "interactiveDemo" 같은 예시 하위 유형 신설 검토 — 정적 예시보다 인출 연습 전이 효과가 클 수 있음 | RollingDemo(롤링 업데이트 min/max 시뮬레이션), PlacementDemo(배치 전략별 분포 시뮬레이션) |
| aws-container-guide.jsx | 빈출도 정렬 "시험 직전 총정리표"(SummaryTab) | 챕터 말미 요약표를 스키마 필드로 표준화 검토(cheatsheet 유형, 기존 제안과 동일 계열) | SummaryTab 15행 표 |
| aws-cdk-dva-guide.jsx | "문제 속 신호 → 정답 방향" 즉답표(TabExam) | 스키마에 시나리오 키워드-정답 매핑 전용 필드(quickAnswerMap 유형) 신설 검토 | TabExam의 `map` 배열(9행, 신호→정답 페어) |
| aws-cdk-dva-guide.jsx | "출제 비중 한눈에" 랭킹표(TabExam) | 빈출도순 총정리표를 표준 cheatsheet 필드로 검토(기존 제안과 동일 계열) | TabExam의 `rank` 배열(7행) |
| aws-elastic-beanstalk-guide.jsx | `Simulator` — 배포 정책을 모드 전환 버튼으로 고른 뒤, 각 모드마다 다단계 시퀀스(인스턴스 상태·용량 게이지·트래픽 분할 바)를 이전/다음/자동재생으로 넘기는 인터랙션 | 기존 `interactiveDemo`/`interactive:{type,params}` 제안과 동일 범주이나 "하나의 개념을 N개 변형(모드)으로 전환 + 변형마다 독립된 다단계 시퀀스 재생"은 이 배치가 첫 근거 사례 — 별도 하위유형(`interactiveDemo.variants[]`)으로 세분화 검토 | MODES 배열(6개 모드 × 3~6스텝) |
| cloudformation-dva-guide.jsx | `.file`/`.file-row` — 템플릿을 파일 트리처럼 보여주며 각 섹션에 필수/선택 배지와 1줄 설명을 붙이는 "구조 해부(anatomy)" 컴포넌트 | Section에 `structureAnatomy[]{field, desc, required}` 필드 신설 검토 — decisionTable·comparisonViews와 다른 "스키마/구조 자체를 가르치는" 유형 | template.yaml 파일 트리 패널(강의 202) |
| cloudformation-dva-guide.jsx | `ul.check` 진행률 카운터가 있는 최종 체크리스트(`{doneCount}/{CHECKS.length}`) | 기존 `selfCheck[]{statement, freq}` 제안(aws-dva-stage0)과 동일 계열이나 빈출도 없이 순수 완료 추적형 — 근거 사례로 추가 | 파일 말미 FINAL 섹션 |
