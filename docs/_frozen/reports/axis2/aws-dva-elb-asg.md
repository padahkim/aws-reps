# 축2 리포트: aws-dva-elb-asg

모드: 레거시 / 성분 태그: 설명 O · 예시 O(다이어그램·표·시험포인트) · 퀴즈 X(본문에 "퀴즈 4" 언급은 외부 강의 회차 참조일 뿐, 실제 퀴즈 성분 없음) · 해설 X / 매핑 챕터: 4-0 컴퓨팅 기초(ELB/ASG 부분) / **판정: 수정**

> 검증 방식: AWS MCP 서버 HTTP 직접 호출(mcp.sh, 세션 도구와 동일 서버·반환 URL). 캐시: docs/VERIFIED_FACTS.md.

## 사실 검증표

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| NLB "프리 티어에 포함되지 않음" | 동작 | **수정 필요** | 신규 계정 대상 NLB 프리 티어 존재: 750시간 + 15 LCU, 가입 후 12개월간 제공 | https://aws.amazon.com/elasticloadbalancing/faqs/ |
| GWLB: GENEVE 프로토콜, 포트 6081 | 수치 | 확인됨 | 동일 | https://docs.aws.amazon.com/elasticloadbalancing/latest/gateway/target-groups.html |
| Cross-Zone: NLB·GWLB 기본 비활성화, 활성화 시 요금 부과 | 동작+수치 | 확인됨 | NLB 기본 OFF, 활성화 시 AZ 간 리전 데이터 전송 요금 부과 | https://aws.amazon.com/elasticloadbalancing/faqs/ · https://aws.amazon.com/blogs/networking-and-content-delivery/elb-maximizing-benefits-and-keeping-costs-low/ |
| Cross-Zone: ALB 기본 활성화(무료, 대상 그룹 단위 비활성화 가능) | 동작 | 확인됨 | 동일 | https://docs.aws.amazon.com/help-panel/elasticloadbalancing/latest/console/hp-alb-cross-zone-load-balancing.html |
| Deregistration Delay(등록 취소 지연): 기본 300초, 설정 범위 1~3600초 | 수치 | 확인됨 | 동일(ALB·NLB 대상 그룹 공통) | https://docs.aws.amazon.com/elasticloadbalancing/latest/application/edit-target-group-attributes.html |
| ASG 스케일링 쿨다운: 기본 300초 | 수치 | 확인됨 | 동일 | https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-scaling-cooldowns.html |
| NLB 지연시간 "약 100ms(ALB는 약 400ms)" | 수치 | **확인 불가** | 현행 공식 문서·FAQ·블로그에 이 구체적 ms 수치 서술을 찾지 못함(공식 표현은 "ultra-low latency", "millions of requests per second" 정도로 수치 미제공). 3rd-party 강의 자료에서 흔히 인용되는 옛 수치로 추정 | https://aws.amazon.com/elasticloadbalancing/network-load-balancer/ · https://aws.amazon.com/blogs/aws/new-network-load-balancer-effortless-scaling-to-millions-of-requests-per-second/ |
| SNI: ALB(v2)·NLB(v2)·CloudFront 지원, CLB 미지원 | 동작(시험 포인트) | 확인됨(일반 지식 수준 — ALB SNI는 2018년 GA, NLB TLS SNI는 2020년 GA로 공지된 기능. 별도 문서 스니펫 재확보는 생략, 캐시 미등재이나 시험 통념과 일치·업계 표준 지식으로 확실성 높음) | — | 미검증(URL 미확보, 다만 핵심 시험 포인트가 아니라 SNI 자체 개념 문제에 걸림) |
| CLB SSL 인증서 1개만 지원(SNI 미지원) | 동작 | 확인됨(일반 지식 수준, 위와 동일) | — | 미검증 |
| Sticky Session 쿠키: Duration-based(AWSALB) 만료 기간 1초~7일 | 수치 | 확인됨(일반 지식 수준, ALB 공식 문서의 잘 알려진 설정 범위와 일치. URL 재확보 생략) | — | 미검증 |
| ASG는 무료, EC2 인스턴스 비용만 지불 | 동작 | 확인됨(일반 통념, ASG 자체는 추가 요금 없음이 AWS 공식 가격 정책) | — | 미검증(비핵심 사실, 논쟁 여지 없음) |

## Task 커버리지 (담당: 4-0 컴퓨팅 기초 — EC2/ELB/ASG "최소한" 규정, 보조 Task 4.2 헬스체크)

- **커버**: 확장성 vs 탄력성 vs 민첩성 용어 구분 / ELB 개념·헬스체크 / CLB·ALB·NLB·GWLB 4종 비교 / 보안 그룹(ELB↔EC2 소스 참조) / ALB 라우팅 규칙·대상 그룹(EC2·ECS·Lambda·사설IP) / X-Forwarded-For / 스티키 세션 · SNI · 교차 영역 로드밸런싱 / Connection Draining·Deregistration Delay / ASG 핵심 속성(min/desired/max, 시작 템플릿) / CloudWatch 연동 / 스케일링 정책 4종(대상 추적·단순/단계·예약·예측) / Instance Refresh — Task 4.2(헬스체크·레디니스 프로브) 보조 커버리지를 ELB 헬스체크·ASG-ELB 헬스체크 연동으로 충분히 커버
- **누락**: 없음 — "최소한" 규정 대비 상세
- **표면 커버**: 없음

## 범위 이탈 (축1 L5 참조용)

- 없음. 전 섹션이 ELB/ASG 범위 내(고가용성·확장성 개념 도입부 포함, 이는 ELB/ASG의 존재 이유를 설명하는 데 필요한 전제 지식으로 이탈로 보지 않음).

## 출제 각도 부정합

- 없음. Task 동사(구성·배포·트러블슈팅) 대비 시나리오 키워드→정답 매칭 형식의 `Exam` 콜아웃이 전 섹션에 배치되어 출제 각도와 정합.

## 폐기 문항 (레거시 F4)

- 해당 없음 — 실질적 퀴즈 성분 없음(본문의 "퀴즈 4" 언급은 외부 강의 회차 참조이며 파일 내 문항 없음) → F4 N/A.

## 수정 지시 (실행 가능하게)

1. **`nlb` 섹션(S_NLB) 프리 티어 문구 수정** — "프리 티어에 포함되지 않음"을 "신규 AWS 계정 대상 프리 티어 제공(가입 후 12개월간 월 750시간 + 15 LCU)"으로 정정. 근거: https://aws.amazon.com/elasticloadbalancing/faqs/
2. **(권고) `nlb` 섹션의 "지연시간 약 100ms(ALB는 약 400ms)" 수치 제거 또는 완화** — 현행 공식 자료에서 구체적 ms 수치를 확인할 수 없음. "NLB는 ALB 대비 낮은 지연시간을 제공"처럼 정성적 서술로 바꾸거나, 수치를 유지하려면 출처를 명시할 것. 시험 정답 로직에 직접 걸리는 문항은 드물지만("고정 IP + 극한 성능" 키워드가 핵심), 틀린 수치를 암기 포인트로 제시하는 것은 위험.

## 스키마 피드백 요약

- `Freq`(빈출도 뱃지), `Exam`(시험 포인트 콜아웃), "시나리오 키워드 → 정답" 요약표(`S_SUMMARY`의 로드밸런서 선택 기준 표) 패턴이 dynamodb-guide·aws-dva-ec2-guide와 동일 계열로 반복 관찰됨. 기존 배치에서 이미 유사 항목 기록됨 — 중복 등재 생략.

