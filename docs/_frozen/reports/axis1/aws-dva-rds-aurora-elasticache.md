# 축1 리포트: aws-dva-rds-aurora-elasticache

**모드**: 레거시 / **평가 범위**: 부분 평가 (N/A: L1·L2·L7·L8 — 퀴즈 성분 없음) / **판정: 통과** (유효 총점 7/8 = 87.5%)

> 축2 판정: 수정(CloudFront 요점 전무 + Aurora 성능 배수·Multi-AZ readable standby·복제 지연·Backtrack 엔진 제한 등 수치/동작 수정 다수). **두 축 종합 = 수정**.
> 성분 태그(축2): 설명 O · 예시 O(다이어그램·의사코드) · 퀴즈 X · 해설 X / 매핑: 5-4 (ElastiCache·CloudFront 요점·RDS/Aurora 최소).

## 채점표

| 항목 | 점수 | 근거(구체 위치 인용) |
|---|:--:|---|
| L1 인출 밀도 | N/A | 퀴즈 없음 (전 인터랙션은 `setActive` 네비게이션, `Fig`는 정적 SVG `role="img"`, `ExamTip`은 서술형 콜아웃 — 학습자 응답 요구 없음) |
| L2 해설 완전성 | N/A | 해설 없음 |
| L3 구체 예시 결합 | 2 | 개념 직후 예시 인접이 전 섹션 일관. `SecStrategy` "전략 ①: Lazy Loading" 개념 → 즉시 `Fig`("캐시 미스 시 3번의 왕복") → 바로 `Code`(파이썬 의사코드 `get_user`, L1657~1663) 3연접. `SecReplica`의 Read Replica Ul → 즉시 "분석/리포팅 워크로드 분리" `Fig`(L534~), Multi-AZ Ul → "동기 복제·자동 페일오버" `Fig`(L710~). 시나리오형 도식(세션 저장소·캐시 히트/미스)이 실전 지문과 닮음 → 코퍼스 앵커상 실코드+도식 인접이면 2 |
| L4 인지부하 | 2 | 섹션이 개념 단위로 원자화(H2별 1개념), 신규 용어 첫 등장 시 인라인 정의·표로 소개. "결과적 일관성(eventually consistent)"·"promote(승격)"·"연결 문자열(connection string)" 인라인 정의(L513~528), "Lazy Loading (= Cache-Aside, Lazy Population)"(L1589)·"Backtrack: 백업 없이도…되돌리는 기능"(L1040~1042) 첫 등장 정의. 비교표(`Tbl`: Read Replica vs Multi-AZ L778, Redis vs Memcached L1509, Pros/Cons)로 부하 관리. 8개↑ 미정의 블록 없음 |
| L5 시험무관 분량 | 2 | 축2 범위이탈: "없음. 전 섹션이 RDS/Aurora/ElastiCache 범위 내(다만 챕터 정의상 'RDS/Aurora 최소' 대비 분량이 김 — 이탈은 아니고 밀도 판단은 축1 몫)." → 이탈 없음이므로 2 |
| L6 선행 지식 연결 | 1 | 명시적 "N-N장/특정 선행 개념" 역참조 부재. Lambda(`SecProxy` "DVA에서는 특히 Lambda와의 조합으로 출제" L1216, "왜 Lambda에 특히 중요한가?" L1324)·KMS·Secrets Manager·CloudWatch Logs·Security Group은 **서비스 이름 배경 언급** 수준(선행 챕터 통합 아님). 동일 파일 내 RDS↔ElastiCache 교차 언급은 동일 챕터 내부 링크 → L6 아님. 코퍼스 공통 감점(1) |
| L7 난이도 분포 | N/A | 퀴즈 없음 |
| L8 누적 복습 | N/A | 퀴즈 없음 (A3: 단일 챕터 5-4 담당) |
| **유효 총점** | **7/8** | 87.5% → **통과** (단, 축2=수정이므로 두 축 종합 = 수정) |

## 수정 지시

- **L6 위반(유일 감점): 명시 선행 지목 부재.** 다음 3지점에 실제 선행 챕터·개념 역참조를 삽입해 2로 승격:
  1. `SecProxy` 서두(L1216, "DVA에서는 특히 Lambda와의 조합으로 출제됩니다") → "앞서 **Lambda 챕터에서 배운 동시 실행(concurrency) 모델**에서, 함수 인스턴스가 폭증하며 각자 DB 연결을 여는 문제를 여기 RDS Proxy가 해결한다"처럼 **선행 챕터 명시 지목** 추가.
  2. `SecProxy` Ul "IAM 인증을 강제…Secrets Manager에 저장"(L1239~1241) → "**보안 챕터의 Secrets Manager 회전(rotation)**과 동일 자격 증명을 재사용" 식으로 선행 개념 연결.
  3. `SecSecurity` "IAM 인증" 서두(L1116~) → "**IAM 챕터에서 다룬 역할(Role)·AssumeRole 신뢰 관계**가 여기 DB 접속 토큰 발급에 그대로 적용" 식으로 선행 챕터 지목.
- L3·L4·L5는 이미 만점(2). 별도 설계 수정 불필요 — 축2 소관의 사실 수정(Aurora 6배·readable standby·복제 지연·Backtrack MySQL 전용·CloudFront)만 반영하면 됨.

## 보충 생성 목록 (결손 성분)

퀴즈·해설이 **전면 결손**(성분 태그 퀴즈 X·해설 X)이 핵심 보충 대상. 파일 내 `ExamTip` "상황→정답" 콜아웃과 "헷갈리기 쉬운 포인트 최종 점검"(L1964~)이 문항 소재로 최적 — 이를 채점형으로 전환:

- **Read Replica vs Multi-AZ**(`SecReplica` 비교표 L778 + ExamTip L793): "읽기 부하 분산" vs "장애 시 서비스 유지"를 뒤바꾼 오답 선택지형 MCQ 2문항. 해설에 ASYNC/SYNC·결과적 일관성 근거 명시.
- **캐싱 전략**(`SecStrategy` ExamTip L1791): "캐시 미스 지연 큼→Lazy Loading 단점 / 절대 stale 불가→Write-Through / cache churn→Write-Through 단점 / 자동 삭제→TTL" 4지선다 매칭 문항. 의사코드(L1657·L1739)를 지문으로 제시하는 코드 해석형 1문항.
- **Aurora 쿼럼**(`SecAurora` ExamTip L1045): "쓰기 4/6, 읽기 3/6, 3 AZ 6 복사본" 수치 확인 자유서술 자가채점 문항(A1 앵커 적용 시 L2 N/A).
- **RDS 보안/암호화**(`SecSecurity` ExamTip L1201): "비암호화 DB를 암호화 → 스냅샷→암호화 복사→복원" 절차 순서 배열형 문항.
- **RDS Proxy**(`SecProxy` ExamTip L1332): "TooManyConnections→RDS Proxy / 퍼블릭 IP 접속→불가(오답)" 함정 선택지 MCQ.
- **[축2 위임] 커버리지 갭**: **CloudFront 요점**(엣지 캐싱·TTL·오리진 종류·캐시 무효화)이 파일 전체에 전무(축2 grep 0건) → 축2 수정 지시 5번 소관. 축1은 해당 섹션 신설 후 문항 생성 대상으로만 표기.

## 반복 약점 메모

- **L6 명시 지목 부재가 코퍼스 9연속 패턴**(본 파일 포함 L6=1). 서비스 이름(Lambda·KMS·Secrets Manager) 배경 언급은 풍부하나 "N-N장/선행 개념" 명시 역참조가 0. 생성 프롬프트에 "각 서비스 상호작용 지점마다 선행 챕터 번호+개념을 1회 이상 명시 지목" 강제 규칙 추가 권장.
- 반대로 **L3·L4는 안정적으로 2** — 개념 직후 SVG 도식+의사코드 인접, H2 원자화+`Tbl`/`Note`/`Pill` 부하 관리가 반복적으로 만점 구조. 이 패턴은 생성 템플릿의 강점으로 유지.

## 스키마 피드백 요약

- 신규 없음. `Freq`(★ 출제빈도 5단계)·`ExamTip`/`Note`(콜아웃)·`Fig`(정적 SVG)·`Tbl`(비교표)·`Code`(의사코드) 구조는 앞선 파일(dynamodb-guide·messaging 등)에서 이미 제안된 패턴과 동일. `SecSummary`의 "주제×출제빈도×한 줄 핵심" 요약표(L1921~)는 누적 복습 스캐폴드로 유용하나 채점형 아님 — v0 표현 범위 내.
