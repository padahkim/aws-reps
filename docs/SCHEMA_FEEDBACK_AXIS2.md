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
