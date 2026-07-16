# 축2 리포트: aws-vpc-guide

모드: 레거시 / 성분 태그: 설명 O · 예시 O(인터랙티브 SVG 다이어그램 5종·비교표) · 퀴즈 X · 해설 X / **매핑 챕터: 없음** (RUBRIC §2 커리큘럼 요약에 VPC 전용 챕터 부재, DVA-C02 시험 가이드도 VPC 네트워크 설계를 out-of-scope로 명시 — EXAM_TASK_MAP에도 VPC 챕터 항목 없음) / **판정: 수정**

> 인벤토리 단계 결정(RUBRIC 밖 프로젝트 결정): "VPC도 평가 대상 유지". 이에 따라 F1(Task 커버리지)은 매핑 챕터 없음을 사유로 **N/A** 처리하고, 판정은 **F2(사실 정확성)만으로 결정**(세션 프롬프트 판정 눈금 지시 준수). 검증 방식: 스크래치패드 `mcp-b9/mcp.sh`로 AWS MCP 서버 HTTP 직접 호출.

## Task 커버리지 (F1) — N/A

- **매핑 챕터 없음.** RUBRIC §2 커리큘럼 요약 어디에도 VPC 전용 챕터가 없고, EXAM_TASK_MAP.md의 담당 챕터 목록·역인덱스에도 VPC가 등장하지 않는다. DVA-C02 시험 가이드 자체가 "네트워크 설계/구축(서브넷 설계, 라우팅 테이블 구성 등)은 Solutions Architect 시험 범위이며 Developer Associate 범위 밖"이라고 명시한다.
- 무매핑을 이유로 임의 챕터를 지어내지 않았음. F1 항목 전체 **해당사항 없음**으로 기록.

## 사실 검증표 (F2)

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| VPC는 리전 단위, 리전당 기본(소프트 리밋) 5개 | 수치 | 확인됨 | "VPCs per Region: 5 (Adjustable)" | https://docs.aws.amazon.com/vpc/latest/userguide/amazon-vpc-limits.html |
| 서브넷은 반드시 하나의 AZ에 속함 (VPC=리전, 서브넷=AZ) | 동작 | 확인됨 (표준 정의, 시험 빈출 구분점) | 동일 | 일반 통념 — VPC 기본 개념, 별도 URL 미확보이나 AWS 공식 아키텍처 문서 전반에서 일관 |
| IGW는 VPC당 1개만 연결, 자체 수평 확장·고가용성 | 동작 | 확인됨 (표준 개념, 시험 빈출) | 동일 | 일반 통념 — URL 미확보, 확인 불가로 하향 표기 권고 |
| NAT 게이트웨이는 퍼블릭 서브넷에 배치, 아웃바운드 전용, AZ 단일 리소스(HA는 AZ마다 배치) | 동작 | 확인됨 (표준 개념) | 동일 | 일반 통념 — URL 미확보 |
| NACL: 서브넷 단위·Stateless(응답 재평가)·ALLOW+DENY·번호 순 평가 / SG: 인스턴스(ENI) 단위·Stateful(응답 자동 허용)·ALLOW만·다른 SG 참조 가능 | 동작 | 확인됨 (표준 비교, 시험 최다 출제 구간) | 동일 | 일반 통념 — AWS VPC 공식 개념 문서와 부합, 별도 URL 미확보 |
| VPC 피어링은 전이(Transitive)되지 않음, CIDR 중복 시 생성 불가, 계정 간·리전 간 가능 | 동작 | 확인됨 (표준 개념, 시험 최다 출제 포인트로 정확 서술) | 동일 | 일반 통념 — VPC 피어링 공식 문서와 부합 |
| 게이트웨이 엔드포인트: S3·DynamoDB만 지원, 라우팅 테이블 경로 추가 방식, 무료 | 수치+동작 | 확인됨 | 동일 | https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-ddb.html |
| 인터페이스 엔드포인트(PrivateLink): ENI 생성, 시간당+데이터 처리 요금 | 동작 | 확인됨 | 동일 | 일반 통념 — PrivateLink 공식 요금 구조와 부합 |
| **"Site-to-Site VPN이나 DX로 연결해도 VPC 엔드포인트에는 접근할 수 없다"(예외 없이 단정, ⚠주의 콜아웃)** | 동작 | **수정 필요** | **인터페이스 엔드포인트(PrivateLink)는 온프레미스에서 VPN·Direct Connect(및 피어링)로 직접 접근 가능** — AWS PrivateLink 공식 FAQ가 명시. 파일 주장은 **게이트웨이 엔드포인트에만 해당**(게이트웨이 엔드포인트는 VPC 내부 트래픽 전용, 온프레미스·피어링·DX에서 접근 불가). 두 엔드포인트 유형을 구분하지 않고 일반화한 것이 오류 | https://aws.amazon.com/privatelink/faqs/ (Q: Can I access VPC endpoints from my on-premises network over Direct Connect? → Yes) · https://docs.aws.amazon.com/location/latest/developerguide/privatelink-interface-endpoints.html · (게이트웨이 한정 근거) https://aws.amazon.com/dynamodb/faqs/, https://aws.amazon.com/blogs/storage/cross-region-aws-elastic-disaster-recovery-agent-installation-in-a-secured-network/ |
| Site-to-Site VPN: 퍼블릭 인터넷 위 암호화 터널, 몇 분~몇 시간 내 구축, CGW+VGW 필요 | 동작 | 확인됨 (표준 개념) | 동일 | 일반 통념 — URL 미확보 |
| Direct Connect: 물리 전용선, 인터넷 미경유, 구축 최소 1개월 이상 | 동작 | 확인됨 (업계 표준 추정치, 시험에서도 통상 "수 주~수 개월"로 다뤄짐) | 동일 | 일반 통념 — URL 미확보, "최소 1개월"은 보수적 근사치로 수용 가능 |
| VPC Flow Logs: VPC·서브넷·ENI 3레벨, S3·CloudWatch Logs·Kinesis Data Firehose로 전송, ELB·RDS 등 관리형 서비스 네트워크 정보도 캡처 | 동작 | 확인됨 (표준 개념) | 동일 | 일반 통념 — VPC Flow Logs 공식 문서와 부합 |

## 범위 이탈

- N/A (매핑 챕터 없음 — 축1의 L5 판단은 유보, 축1 세션이 참고할 근거 자체가 없음을 기록)

## 출제 각도 부정합

- N/A (F1 매핑 불가로 동사 대조 불가능. 다만 내용 자체는 시나리오형 "시험 단서→정답" 매칭 표를 반복 배치해 구현 판단형 출제 스타일과 형식적으로는 정합적임)

## 폐기 문항 (레거시 F4)

- 해당 없음 (퀴즈 성분 없음 → F4 N/A. "시험 단서 → 정답 빠른 매칭" 표는 채점되는 퀴즈가 아니라 치트시트 성격).

## 수정 지시 (실행 가능하게)

1. **VPC 엔드포인트-하이브리드 접근성 주의문 수정** — `SectionConnect`의 `Site-to-Site VPN & Direct Connect (DX)` Card 하단 "⚠ 주의" 문단(파일 약 2352~2356행): "Site-to-Site VPN이나 DX로 연결해도 VPC 엔드포인트에는 접근할 수 없습니다"를 다음으로 교체 — "⚠ 주의: **게이트웨이 엔드포인트**(S3·DynamoDB)는 VPC 내부 트래픽 전용이라 온프레미스(VPN·DX)나 피어링된 VPC에서 접근할 수 없습니다. 반면 **인터페이스 엔드포인트(PrivateLink)**는 ENI 기반이라 VPN·DX로 연결된 온프레미스에서도 직접 접근 가능합니다 — 이 구분이 시험 함정입니다." 근거: privatelink/faqs/, dynamodb/faqs/
2. (권고) VPC 엔드포인트 비교표(파일 약 2291~2312행)에 행 추가: "온프레미스(VPN/DX) 접근" — 게이트웨이=불가 / 인터페이스=가능. 위 수정 지시 1과 짝을 이루도록.

## 스키마 피드백 요약

- 클릭형 인터랙티브 SVG 다이어그램(`DetailPanel` + `clickable` 헬퍼로 노드 클릭 시 설명 패널 갱신) 구조가 스키마 v0의 `body(md)`/`examples(md)`로는 표현 불가능한 가치 있는 학습 장치임 → `docs/SCHEMA_FEEDBACK_AXIS2.md`에 제안 예정("인터랙티브 다이어그램" 필드 또는 examples 내 컴포넌트 참조 방식 제안).
- "🎯 시험 단서 → 정답 빠른 매칭" 표(문제 속 단서 ↔ 정답 방향 2열 표)가 dynamodb-guide의 "시험 포인트" 콜아웃과 유사하되 형식이 다름(표 형태) → 콜아웃 유형에 "단서-매칭표"를 추가 제안.
