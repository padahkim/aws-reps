/**
 * 생성물 — 손편집 금지. `node scripts/import-drills.mts aws-basics` 재실행으로 갱신.
 * 원본: aws-cloud-drills data/questions/aws-basics.json (11문항)
 */
import type { Question } from "../../schema";

export const quiz: Question[] = [
  // source: aws-basics-region-selection-criteria
  {
    "id": "q1",
    "scope": "final",
    "concept": [
      "region",
      "data-residency",
      "latency"
    ],
    "scenario": "한 회사가 서울 사용자를 대상으로 하는 신규 서비스를 배포하려 한다. 개인정보를 국내에만 저장해야 한다는 규제도 적용된다. 이 상황에서 AWS 리전을 선택할 때 고려해야 할 기준으로 가장 거리가 먼 것은?",
    "choices": [
      "사용자와의 물리적 거리 — 지연시간에 직접 영향을 준다.",
      "데이터 주권 규제 — 데이터를 특정 국가 안에 두어야 하는 법적 요건.",
      "리전에 배포된 가용영역(AZ)의 개수 — 모든 리전이 3개 이상을 보장하므로 리전 선택 기준이 될 수 없다.",
      "필요한 서비스가 해당 리전에서 지원되는지 여부."
    ],
    "answer": [
      2
    ],
    "explanation": "리전 선택 기준은 크게 지연시간(사용자와의 거리), 규제·데이터 주권, 서비스 지원 여부, 가격 네 가지로 정리된다. 반면 AZ 개수는 AWS가 모든 리전에 대해 최소 3개를 보장하는 설계 원칙이라 리전 간 차이를 만드는 선택 기준이 되지 못한다.\n\n시험에서는 '지연시간을 줄여야 한다'는 조건이 나오면 사용자와 가까운 리전을 고르라는 신호로 읽어야 하고, '규제상 국내 보관'이 나오면 데이터 주권을 리전 선택의 결정적 근거로 봐야 한다.",
    "choiceExplanations": [
      "물리적 거리는 왕복 시간(RTT)에 직접 영향을 주는 실제 리전 선택 기준이다.",
      "데이터 주권·규제 준수는 리전을 결정하는 법적 요건으로 시험에서도 핵심 판단 근거로 등장한다.",
      "정답. 모든 AWS 리전은 최소 3개의 가용영역을 갖도록 설계되어 있어, AZ 개수는 리전 간 차별화 기준이 아닙니다.",
      "신규 서비스는 리전마다 출시 시점이 달라 특정 리전에서만 지원되기도 하므로 실제 선택 기준이 맞다."
    ],
    "title": "리전을 고를 때 실제로 따지는 기준",
    "difficulty": "easy",
    "references": [
      {
        "title": "Regions and Zones",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html"
      }
    ]
  },
  // source: aws-basics-multi-az-high-availability
  {
    "id": "q2",
    "scope": "final",
    "concept": [
      "availability-zone",
      "high-availability"
    ],
    "scenario": "한 애플리케이션이 단일 가용영역(AZ)의 EC2 인스턴스 1대에서만 실행되고 있다. 해당 AZ에 정전이 발생해도 서비스 중단 없이 계속 운영되도록 개선하려면 어떤 조치가 가장 적절한가?",
    "choices": [
      "같은 AZ 안에 인스턴스를 추가로 띄워 부하를 분산한다.",
      "서로 다른 AZ에 인스턴스를 나눠 배포해 하나의 AZ 장애가 전체 서비스를 멈추지 않게 한다.",
      "인스턴스 타입을 더 큰 사양으로 변경해 처리 성능을 높인다.",
      "리전을 지연시간이 더 낮은 곳으로 이전한다."
    ],
    "answer": [
      1
    ],
    "explanation": "가용영역(AZ)은 같은 리전 안에서도 물리적으로 분리되어 전력·냉각·네트워크를 독립적으로 갖는다. 그래서 한 AZ가 정전이나 재해로 죽어도 다른 AZ는 영향을 받지 않는다 — 이 특성을 활용해 여러 AZ에 인스턴스를 분산 배포하는 것이 고가용성(HA)의 물리적 토대다.\n\n같은 AZ 안에서만 인스턴스를 늘리면 처리량은 늘어나지만 그 AZ 자체가 죽는 장애에는 여전히 취약하다. '고가용성이 필요하다'는 조건이 붙으면 항상 Multi-AZ 배포를 정답 방향으로 봐야 한다.",
    "choiceExplanations": [
      "같은 AZ 안에서의 확장은 부하 분산에는 도움이 되지만, AZ 전체 장애에는 여전히 함께 멈춘다.",
      "정답. AZ는 리전 내에서 전력·냉각·네트워크가 서로 독립된 물리적 단위이므로, 여러 AZ에 나눠 배포해야 한 AZ의 장애가 다른 AZ에 영향을 주지 않습니다.",
      "인스턴스 사양을 키우는 것은 처리 성능 문제이지, AZ 단위 장애에 대한 가용성 문제를 해결하지 못한다.",
      "리전 이전은 지연시간 문제의 해법이지 특정 AZ의 장애 대응과는 무관하다."
    ],
    "title": "AZ 하나가 죽어도 서비스가 살아있으려면",
    "difficulty": "easy",
    "references": [
      {
        "title": "Regions and Zones",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html"
      }
    ]
  },
  // source: aws-basics-service-scope-global-regional-az
  {
    "id": "q3",
    "scope": "final",
    "concept": [
      "global-service",
      "region",
      "iam"
    ],
    "scenario": "다음 중 리전을 선택해도 계정 전체에 적용되는 '글로벌 서비스'로 분류되는 것은?",
    "choices": [
      "Amazon S3 버킷 — 리전 단위로 존재한다.",
      "IAM — 사용자·역할·정책이 리전에 관계없이 계정 전체에 적용된다.",
      "EC2 인스턴스 — 특정 가용영역(AZ) 하나에 놓인다.",
      "EBS 볼륨 — 같은 AZ의 EC2에만 연결할 수 있다."
    ],
    "answer": [
      1
    ],
    "explanation": "AWS 리소스는 범위에 따라 세 층위로 나뉜다 — IAM·Route 53·CloudFront 같은 글로벌 서비스는 리전을 골라도 전체 계정에 적용되고, S3·DynamoDB·Lambda 같은 리전 서비스는 대부분 리전 단위로 존재하며, EC2 인스턴스·EBS 볼륨·서브넷 같은 AZ 단위 리소스는 특정 AZ 하나에 놓인다.\n\n새 서비스를 배울 때마다 '이 리소스는 어느 범위에 사는가'를 확인하는 습관이 필요하다 — 장애가 났을 때 함께 죽는 단위와 시험 함정 선지의 상당수가 이 범위 구분에서 나온다.",
    "choiceExplanations": [
      "S3 버킷은 리전 단위 리소스다 — 특정 리전에 생성되고 그 리전 안에만 존재한다.",
      "정답. IAM은 Route 53·CloudFront와 함께 리전 구분 없이 계정 전체에 적용되는 글로벌 서비스입니다.",
      "EC2 인스턴스는 AZ 단위 리소스로, 특정 가용영역 하나에 배치된다.",
      "EBS 볼륨도 AZ 단위 리소스라 같은 AZ의 EC2 인스턴스에만 연결할 수 있다."
    ],
    "title": "이 리소스는 어느 범위에 사는가",
    "difficulty": "medium",
    "references": [
      {
        "title": "Regions and Zones",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html"
      }
    ]
  },
  // source: aws-basics-ebs-same-az-attach
  {
    "id": "q4",
    "scope": "final",
    "concept": [
      "ebs",
      "availability-zone",
      "troubleshooting"
    ],
    "scenario": "한 엔지니어가 ap-northeast-2a의 EBS 볼륨을 ap-northeast-2c에 있는 EC2 인스턴스에 연결(attach)하려 했으나 실패했다. 가장 가능성이 높은 원인은?",
    "choices": [
      "EBS 볼륨과 EC2 인스턴스는 같은 가용영역(AZ)에 있어야만 연결할 수 있기 때문이다.",
      "볼륨 크기가 인스턴스가 지원하는 최대 용량을 초과했기 때문이다.",
      "IAM 정책이 EBS 연결 권한을 명시적으로 거부했기 때문이다.",
      "EBS 볼륨은 리전 서비스라서 같은 리전이면 어떤 AZ의 인스턴스와도 연결 가능해야 하는데 일시적 오류가 난 것이다."
    ],
    "answer": [
      0
    ],
    "explanation": "EBS 볼륨은 특정 가용영역(AZ)에 생성되는 AZ 단위 리소스이며, 그 볼륨과 물리적으로 같은 AZ에 있는 EC2 인스턴스에만 연결할 수 있다. 다른 AZ로 옮기려면 스냅샷을 만들어 대상 AZ에서 새 볼륨으로 복원해야 한다.\n\n이 제약은 '리소스가 어느 범위에 사는가'라는 감각이 함정 문제로 재활용되는 대표 사례다 — 리전 서비스로 착각하기 쉬운 EBS가 실제로는 AZ 단위라는 점이 트러블슈팅형 문항의 단서로 자주 등장한다.",
    "choiceExplanations": [
      "정답. EBS 볼륨은 AZ 단위 리소스라서 같은 가용영역에 있는 EC2 인스턴스에만 연결할 수 있습니다.",
      "용량 초과는 연결 실패의 흔한 원인이 아니며, 문제 상황(다른 AZ 간 연결 시도)과 직접 관련이 없다.",
      "IAM 권한 거부라면 AccessDenied 형태의 오류가 나지, AZ가 다른 조합 자체가 애초에 연결 시도의 대상이 될 수 없다.",
      "EBS는 리전 서비스가 아니라 AZ 단위 리소스다 — 다른 AZ 간 연결이 실패하는 것은 일시적 오류가 아니라 설계상 제약이다."
    ],
    "title": "EBS 볼륨을 다른 AZ의 인스턴스에 붙이려다 실패했다면",
    "difficulty": "medium",
    "references": [
      {
        "title": "Amazon EBS volumes",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volumes.html"
      }
    ]
  },
  // source: aws-basics-console-cli-sdk-same-api-sigv4
  {
    "id": "q5",
    "scope": "final",
    "concept": [
      "api",
      "sigv4",
      "iam"
    ],
    "scenario": "한 개발자가 콘솔에서 손으로 하던 반복 작업을 CLI 스크립트로 자동화하려 한다. 이 자동화가 콘솔에서와 동일한 권한 검사를 받으며 동작하는 근본적인 이유로 가장 정확한 것은?",
    "choices": [
      "콘솔과 CLI가 서로 다른 백엔드 시스템을 사용하지만 IAM 정책을 이중으로 동기화하기 때문이다.",
      "콘솔·CLI·SDK 모두 결국 같은 HTTPS API 엔드포인트로 SigV4 서명된 요청을 보내고, 그 요청을 동일한 IAM 인가 로직이 검사하기 때문이다.",
      "CLI 자동화는 IAM 검사를 우회하도록 설계되어 있어 별도 인증이 필요 없기 때문이다.",
      "콘솔에서 만든 세션 쿠키를 CLI가 그대로 재사용하기 때문이다."
    ],
    "answer": [
      1
    ],
    "explanation": "AWS를 다루는 세 가지 도구(웹 콘솔, CLI, SDK)는 겉모습만 다를 뿐 최종적으로는 전부 동일한 API 엔드포인트로 서명된 HTTPS 요청을 보낸다. 요청마다 자격 증명으로 SigV4 서명이 붙고, IAM이 이를 검사해 인가 여부를 결정한다.\n\n이 구조 때문에 '콘솔에서 손으로 하던 일을 스크립트로 자동화'할 수 있고, 권한 설정도 콘솔·CLI·SDK 어디서든 동일하게 적용된다 — 채널이 다르다고 별도의 인가 경로가 생기지 않는다는 점이 핵심이다.",
    "choiceExplanations": [
      "콘솔·CLI·SDK는 애초에 같은 API로 수렴하므로 '이중 동기화'라는 별도 메커니즘 자체가 존재하지 않는다.",
      "정답. 콘솔·CLI·SDK는 전부 같은 API로 수렴하며, 요청마다 SigV4로 서명되고 IAM이 동일한 인가 로직으로 검사합니다.",
      "CLI 요청도 다른 채널과 동일하게 서명·인가 검사를 받는다 — 우회 경로는 없다.",
      "CLI는 액세스 키 또는 임시 자격 증명으로 SigV4 서명을 만들 뿐, 콘솔 세션 쿠키를 재사용하지 않는다."
    ],
    "title": "콘솔에서 되는 건 코드에서도 된다 — 이유",
    "difficulty": "easy",
    "references": [
      {
        "title": "AWS Signature Version 4 for API requests",
        "url": "https://docs.aws.amazon.com/general/latest/gr/signing_aws_api_requests.html"
      }
    ]
  },
  // source: aws-basics-most-secure-app-credentials-iam-role
  {
    "id": "q6",
    "scope": "final",
    "concept": [
      "iam-role",
      "credentials",
      "ec2"
    ],
    "scenario": "EC2 인스턴스에서 실행되는 애플리케이션이 S3 버킷에 접근해야 한다. 자격 증명을 애플리케이션에 제공하는 가장 안전한 방법은?",
    "choices": [
      "액세스 키 한 쌍을 발급해 인스턴스의 설정 파일에 저장해 둔다.",
      "액세스 키를 애플리케이션 코드에 하드코딩해 배포한다.",
      "필요한 권한을 가진 IAM 역할을 인스턴스에 연결해, 애플리케이션이 자동 발급되는 임시 자격 증명을 쓰게 한다.",
      "루트 계정의 액세스 키를 발급해 모든 인스턴스에 공유한다."
    ],
    "answer": [
      2
    ],
    "explanation": "IAM 역할을 EC2 인스턴스에 연결하면 애플리케이션은 영구 액세스 키를 전혀 몰라도 동작한다 — 인스턴스 메타데이터를 통해 만료 시간이 있는 임시 자격 증명이 자동으로 발급·갱신되기 때문이다. 이것이 시험이 요구하는 '가장 안전한 방법'의 정답 패턴이다.\n\n액세스 키는 영구 자격 증명이라 유출되면 만료되지 않는 열쇠를 넘겨준 것과 같다. 설정 파일 저장이든 코드 하드코딩이든 결국 영구 키가 어딘가에 존재하게 되므로, '가장 안전한 방법'을 묻는 문제에서는 항상 오답이다.",
    "choiceExplanations": [
      "설정 파일에 둔 액세스 키도 여전히 영구 자격 증명이라 유출 위험이 남고, 인스턴스마다 배포·갱신을 수동으로 관리해야 한다.",
      "코드에 액세스 키를 하드코딩하는 것은 가장 위험한 방식이다 — 코드 저장소나 배포 산출물이 유출되면 그대로 노출된다.",
      "정답. IAM 역할을 인스턴스에 연결하면 만료되는 임시 자격 증명이 자동 발급·갱신되어, 유출될 영구 키 자체가 존재하지 않습니다.",
      "루트 계정 자격 증명은 계정 전체에 대한 최고 권한을 가지므로 애플리케이션에 절대 사용해서는 안 된다."
    ],
    "title": "EC2 위 애플리케이션에 자격 증명을 가장 안전하게 주는 법",
    "difficulty": "medium",
    "references": [
      {
        "title": "Use an IAM role to grant permissions to applications running on Amazon EC2 instances",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html"
      }
    ]
  },
  // source: aws-basics-credential-provider-chain-order
  {
    "id": "q7",
    "scope": "final",
    "concept": [
      "credentials",
      "sdk"
    ],
    "scenario": "같은 애플리케이션 코드를 로컬 개발 환경(설정 파일 사용)과 EC2 인스턴스(IAM 역할 부착) 양쪽에서 실행한다. 코드를 전혀 수정하지 않아도 SDK가 각 환경에 맞는 자격 증명을 자동으로 찾아내는 이유를 가장 정확히 설명한 것은?",
    "choices": [
      "SDK가 코드 실행 위치를 감지해 그 환경 전용 자격 증명 API를 별도로 호출하기 때문이다.",
      "SDK가 정해진 탐색 순서(코드 파라미터 → 환경변수 → 설정 파일 → 부착된 IAM 역할)를 따라가며 처음 발견한 유효한 자격 증명을 사용하기 때문이다.",
      "모든 환경에서 동일한 액세스 키가 환경변수로 자동 배포되기 때문이다.",
      "IAM 역할은 로컬 환경에서도 항상 우선적으로 적용되기 때문이다."
    ],
    "answer": [
      1
    ],
    "explanation": "SDK와 CLI는 정해진 순서로 여러 위치를 차례로 뒤져 자격 증명을 찾는다 — 이 탐색 순서가 Credential Provider Chain이다: ① 코드에 명시된 파라미터 → ② 환경변수 → ③ 설정 파일(`~/.aws/credentials`) → ④ 붙어 있는 IAM 역할(EC2 인스턴스 프로파일, Lambda 실행 역할 등).\n\n순서에는 논리가 있다 — 구체적으로 지정된 것이 기본값을 이긴다. 그래서 로컬에서는 설정 파일 단계에서, EC2에서는 역할 단계에서 자격 증명이 발견되며, 같은 코드가 두 환경 모두에서 수정 없이 동작하는 이유가 된다.",
    "choiceExplanations": [
      "SDK는 환경별 전용 API를 따로 호출하는 것이 아니라, 하나의 정해진 순서를 순차적으로 탐색할 뿐이다.",
      "정답. SDK는 코드 파라미터→환경변수→설정 파일→부착된 IAM 역할 순으로 자격 증명을 탐색하는 Credential Provider Chain을 따릅니다.",
      "액세스 키가 환경변수로 자동 배포되는 메커니즘은 없다 — 환경변수는 사람이나 배포 도구가 직접 설정해야 한다.",
      "체인에서 IAM 역할은 가장 마지막(기본값) 단계다 — 로컬 환경에는 애초에 부착된 역할이 없으므로 그 단계까지 가지 않고 설정 파일에서 이미 발견된다."
    ],
    "title": "SDK가 자격 증명을 찾는 순서",
    "difficulty": "hard",
    "references": [
      {
        "title": "AWS SDKs and Tools standardized credential providers",
        "url": "https://docs.aws.amazon.com/sdkref/latest/guide/standardized-credentials.html"
      }
    ]
  },
  // source: aws-basics-403-access-denied-vs-signature-mismatch
  {
    "id": "q8",
    "scope": "final",
    "concept": [
      "troubleshooting",
      "iam",
      "sigv4"
    ],
    "scenario": "API 호출이 두 번 모두 403 상태 코드로 실패했다. 첫 번째는 에러 코드가 AccessDenied, 두 번째는 SignatureDoesNotMatch였다. 두 에러의 원인을 올바르게 구분한 것은?",
    "choices": [
      "둘 다 같은 원인(권한 부족)이므로 IAM 정책만 수정하면 두 문제 모두 해결된다.",
      "AccessDenied는 인가(정책) 실패이고, SignatureDoesNotMatch는 요청 서명·자격 증명 문제다 — 상태 코드가 아니라 에러 코드로 원인을 구분해야 한다.",
      "AccessDenied는 네트워크 문제이고, SignatureDoesNotMatch는 IAM 정책 문제다.",
      "두 에러 모두 상태 코드 403이므로 원인 구분 없이 재시도만 하면 해결된다."
    ],
    "answer": [
      1
    ],
    "explanation": "HTTP 상태 코드 403은 '거부됐다'는 사실만 알려줄 뿐 원인을 말해주지 않는다. 실제 원인은 응답에 포함된 에러 코드로 구분해야 한다 — AccessDenied는 요청은 정상적으로 인증됐지만 IAM 정책이 해당 작업을 허용하지 않는 인가 실패이고, SignatureDoesNotMatch는 요청 서명 계산이 맞지 않아 애초에 누구의 요청인지 검증조차 되지 않은 서명·자격 증명 문제다.\n\n트러블슈팅형 문항은 이렇게 '같은 상태 코드, 다른 에러 코드' 조합을 자주 출제한다 — 상태 코드만 보고 결론 내리지 말고 에러 코드까지 확인해야 정확한 원인 진단과 조치(정책 수정 vs 자격 증명·서명 로직 점검)로 이어진다.",
    "choiceExplanations": [
      "IAM 정책 수정은 AccessDenied에는 맞는 조치이지만, SignatureDoesNotMatch는 서명·자격 증명 문제라 정책을 고쳐도 해결되지 않는다.",
      "정답. 같은 403 상태 코드라도 에러 코드로 원인이 갈립니다 — AccessDenied는 인가 실패, SignatureDoesNotMatch는 서명·자격 증명 문제입니다.",
      "AccessDenied는 네트워크 문제가 아니라 인가 실패이며, SignatureDoesNotMatch도 IAM 정책이 아니라 서명 계산·자격 증명 문제다 — 원인이 서로 뒤바뀌었다.",
      "두 에러 모두 요청 자체의 문제(정책 또는 서명)이므로 재시도만으로는 해결되지 않는다 — 원인을 진단해 조치해야 한다."
    ],
    "title": "403 에러 두 가지, 원인은 다르다",
    "difficulty": "hard",
    "references": [
      {
        "title": "Troubleshoot access denied error messages",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/troubleshoot_access-denied.html"
      },
      {
        "title": "AWS Signature Version 4 for API requests",
        "url": "https://docs.aws.amazon.com/general/latest/gr/signing_aws_api_requests.html"
      }
    ]
  },
  // source: aws-basics-minimal-operational-overhead-managed-serverless
  {
    "id": "q9",
    "scope": "final",
    "concept": [
      "pricing",
      "managed-service",
      "serverless"
    ],
    "scenario": "문제 조건에 \"minimal operational overhead\"(최소한의 운영 부담)라는 문구가 포함되어 있다. 이런 조건이 나올 때 정답 방향으로 가중치를 둬야 하는 선택지 유형은?",
    "choices": [
      "서버를 직접 프로비저닝하고 패치·백업을 손수 관리하는 EC2 기반 구성.",
      "관리형 서비스 또는 서버리스 서비스 — 서버 프로비저닝·패치·장애 조치를 AWS가 대신 처리하는 구성.",
      "온프레미스 데이터센터를 추가로 구축해 직접 운영하는 구성.",
      "가장 저렴한 인스턴스 타입을 선택해 비용만 최소화하는 구성."
    ],
    "answer": [
      1
    ],
    "explanation": "관리형 서비스는 서버 프로비저닝·패치·백업·장애 조치 같은 운영 잡일을 AWS가 대신 처리해 준다. 이 스펙트럼의 끝에 있는 서버리스는 차량 관리(서버 관리)를 전혀 몰라도 되는 택시에 비유된다 — 오른쪽으로 갈수록 제어권을 내주는 대신 운영 부담이 사라진다.\n\nDVA는 개발자 시험이라 'minimal operational overhead', 'least management effort' 같은 문구가 보이면 관리형·서버리스 쪽 선택지에 가중치를 두는 것이 압도적으로 정답 확률이 높다.",
    "choiceExplanations": [
      "EC2 직접 운영은 정반대 방향이다 — 서버 관리 부담이 전부 고객 몫이라 '운영 부담 최소화' 조건과 어긋난다.",
      "정답. \"운영 부담 최소화\" 조건은 관리형/서버리스 서비스를 정답으로 가리키는 신호입니다 — AWS가 운영 잡일을 대신 해주기 때문입니다.",
      "온프레미스 구축은 운영 부담을 오히려 크게 늘리는 방향이며, 클라우드로 옮기는 이유 자체와 반대된다.",
      "비용 최소화와 운영 부담 최소화는 서로 다른 기준이다 — 저렴한 인스턴스를 골라도 서버 관리 부담은 그대로 남는다."
    ],
    "title": "\"운영 오버헤드 최소화\" 문구가 나오면",
    "difficulty": "easy",
    "references": [
      {
        "title": "How AWS Pricing Works",
        "url": "https://docs.aws.amazon.com/whitepapers/latest/how-aws-pricing-works/how-aws-pricing-works.html"
      }
    ]
  },
  // source: aws-basics-spot-instance-interruption-tolerant-workload
  {
    "id": "q10",
    "scope": "final",
    "concept": [
      "pricing",
      "ec2",
      "spot-instance"
    ],
    "scenario": "야간에만 실행되는 배치 데이터 처리 작업이 있다. 작업이 중간에 중단돼도 나중에 이어서 다시 실행하면 되고, 비용을 최대한 절감하고 싶다. 어떤 EC2 구매 옵션이 가장 적합한가?",
    "choices": [
      "온디맨드 — 사용한 만큼 표준 요금을 내는 기본 옵션.",
      "예약 인스턴스 또는 Savings Plans — 1~3년 약정으로 할인받는 옵션.",
      "스팟 인스턴스 — 유휴 용량을 최대 90% 할인된 가격에 쓰되, AWS가 용량을 회수하면 중단될 수 있는 옵션.",
      "전용 호스트 — 물리 서버 전체를 단독으로 점유하는 옵션."
    ],
    "answer": [
      2
    ],
    "explanation": "스팟 인스턴스는 AWS의 유휴(사용되지 않는) EC2 용량을 온디맨드 대비 최대 90% 할인된 가격에 제공한다. 대신 AWS가 그 용량을 다시 필요로 하면 2분 전 중단 통지 후 인스턴스를 회수할 수 있다. 그래서 배치 작업·데이터 분석·백그라운드 처리처럼 중단되어도 다시 이어서 돌리면 되는 워크로드에 적합하다.\n\n반대로 항상 떠 있어야 하는 서비스(예: 상시 운영 웹 서버)에는 스팟이 부적합하다 — 시험은 '중단을 감수할 수 있다' + '비용 최소화'라는 조합이 나오면 스팟을 정답으로 유도한다.",
    "choiceExplanations": [
      "온디맨드는 유연하지만 할인이 없다 — 비용 최소화가 최우선 조건일 때는 정답이 아니다.",
      "예약·Savings Plans는 장기 약정 할인 상품으로, 상시 실행되는 워크로드에 적합하다 — 야간 한정 배치 작업의 요구사항과 맞지 않는다.",
      "정답. 중단을 허용할 수 있고 비용 절감이 최우선이라면, 최대 90% 할인되지만 언제든 회수될 수 있는 스팟 인스턴스가 정답입니다.",
      "전용 호스트는 물리 서버 단위 격리·라이선스 요구사항을 위한 옵션이며, 비용 절감이나 중단 허용 워크로드와는 목적이 다르다."
    ],
    "title": "가장 저렴하지만 언제든 뺏길 수 있는 인스턴스",
    "difficulty": "medium",
    "references": [
      {
        "title": "Spot Instances",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html"
      }
    ]
  },
  // source: aws-basics-shared-responsibility-model
  {
    "id": "q11",
    "scope": "final",
    "concept": [
      "shared-responsibility",
      "security"
    ],
    "scenario": "한 팀이 S3 버킷을 실수로 퍼블릭하게 설정해 데이터가 유출됐다. \"AWS 클라우드를 쓰고 있으니 보안 사고의 책임은 AWS에 있다\"는 주장에 대해 공동 책임 모델(Shared Responsibility Model) 관점에서 가장 정확한 반박은?",
    "choices": [
      "AWS는 하드웨어·시설 등 \"클라우드 자체의\" 보안을 책임지고, 고객은 데이터·접근 권한·설정 등 \"클라우드 안의\" 보안을 책임진다 — 버킷 공개 설정은 고객 책임 영역이다.",
      "관리형 서비스를 쓰는 이상 보안 설정을 포함한 모든 책임은 AWS에 있다.",
      "책임 소재는 사고 발생 후 AWS 지원팀과의 협의로 매번 새로 정해진다.",
      "온프레미스와 달리 클라우드에서는 고객이 보안에 대해 아무 책임도 지지 않는다."
    ],
    "answer": [
      0
    ],
    "explanation": "공동 책임 모델은 AWS와 고객이 보안 책임을 나눠 갖는 구조다. AWS는 호스트 운영체제·가상화 계층부터 시설의 물리적 보안까지 \"클라우드 자체의\" 보안을 책임지고, 고객은 게스트 운영체제 패치, 애플리케이션 소프트웨어, 보안 그룹·IAM 설정 같은 \"클라우드 안의\" 보안을 책임진다.\n\nS3 버킷을 퍼블릭으로 설정하거나 권한을 헐겁게 준 것은 고객이 관리하는 설정 영역의 실수이므로 고객 책임이다. 관리형 서비스를 쓸수록 AWS 쪽 책임 범위가 넓어지긴 하지만, 데이터 자체와 접근 제어 설정은 서비스 형태와 관계없이 항상 고객 몫으로 남는다.",
    "choiceExplanations": [
      "정답. AWS는 \"클라우드 자체의\" 보안(하드웨어·시설)을, 고객은 \"클라우드 안의\" 보안(데이터·IAM 설정·앱)을 책임지는 것이 공동 책임 모델의 핵심입니다.",
      "관리형 서비스도 AWS 책임 범위가 넓어질 뿐 전부를 대신하지 않는다 — 데이터·접근 권한 설정은 여전히 고객 책임이다.",
      "책임 분담은 사고 후 협의가 아니라 서비스 유형별로 미리 정해진 모델을 따른다.",
      "고객이 책임을 전혀 지지 않는다는 것은 공동 책임 모델의 정반대 설명이다 — 클라우드에서도 데이터·설정에 대한 고객 책임은 사라지지 않는다."
    ],
    "title": "\"AWS를 쓰니 보안은 알아서 되겠지\"의 함정",
    "difficulty": "easy",
    "references": [
      {
        "title": "Shared responsibility model",
        "url": "https://docs.aws.amazon.com/whitepapers/latest/aws-risk-and-compliance/shared-responsibility-model.html"
      }
    ]
  },
];
