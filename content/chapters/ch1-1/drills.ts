/**
 * 생성물 — 손편집 금지. `node scripts/import-drills.mts s3` 재실행으로 갱신.
 * 원본: aws-cloud-drills data/questions/s3.json (15문항)
 */
import type { Question } from "../../schema";

export const quiz: Question[] = [
  // source: s3-presigned-url-creator-permissions
  {
    "id": "q1",
    "slug": "s3-presigned-url-creator-permissions",
    "scope": "final",
    "concept": [
      "presigned-url",
      "access-control"
    ],
    "scenario": "한 개발자가 AWS 자격 증명이 없는 외부 사용자에게 비공개 버킷의 특정 객체를 잠시 다운로드하게 하려고 사전 서명 URL(presigned URL)을 발급했다. 이 URL이 외부 사용자에게 부여하는 접근 권한의 범위를 가장 정확하게 설명한 것은?",
    "choices": [
      "URL을 받은 사람의 IAM 사용자 권한이 적용되며, 권한이 없으면 접근이 거부된다.",
      "버킷 정책에 Principal로 외부 사용자를 추가해야만 URL이 동작한다.",
      "URL을 발급한 주체(IAM 보안 주체)의 권한으로 동작하며, 발급자가 해당 객체에 대한 권한이 없으면 URL도 동작하지 않는다.",
      "사전 서명 URL은 발급 즉시 버킷을 퍼블릭으로 만들어 누구나 모든 객체에 접근할 수 있게 한다."
    ],
    "answer": [
      2
    ],
    "explanation": "사전 서명 URL은 발급자가 자신의 보안 자격 증명으로 URL에 서명한 것이다. 따라서 URL을 사용하는 쪽은 별도의 AWS 자격 증명이 필요 없지만, 가능한 작업은 전적으로 URL을 만든 IAM 보안 주체가 해당 작업(예: GetObject)에 대해 갖는 권한에 의해 제한된다. 발급자에게 그 객체를 읽을 권한이 없으면 URL을 받아도 접근은 거부된다.\n\n시험에서는 '자격 증명 없는 외부 사용자에게 임시 접근'이라는 표현이 나오면 사전 서명 URL을 떠올려야 한다. 핵심 함정은 '누구의 권한이 적용되는가'다 — 받는 사람이 아니라 발급자의 권한이 적용되고, 버킷 정책을 수정하지 않고도 시간 제한 접근을 줄 수 있다는 점이 출제 포인트다.",
    "choiceExplanations": [
      "사전 서명 URL의 목적은 받는 사람이 AWS 자격 증명을 갖지 않아도 되게 하는 것이다. 적용되는 권한은 받는 사람이 아니라 발급자의 것이다.",
      "사전 서명 URL은 버킷 정책을 건드리지 않고 임시 접근을 부여하는 메커니즘이다. Principal 추가는 정반대 방향의 영구적 정책 변경이다.",
      "정답. 사전 서명 URL은 그것을 발급한 보안 주체의 권한을 그대로 위임하며, 발급자에게 권한이 없으면 URL도 무효입니다.",
      "URL은 지정된 단일 객체·작업·만료 시간에만 유효한 좁은 위임이지, 버킷 전체를 퍼블릭으로 바꾸지 않는다."
    ],
    "title": "사전 서명 URL이 실제로 허용하는 권한의 범위",
    "difficulty": "easy",
    "references": [
      {
        "title": "Download and upload objects with presigned URLs",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html"
      }
    ]
  },
  // source: s3-sse-kms-audit-trail-choice
  {
    "id": "q2",
    "slug": "s3-sse-kms-audit-trail-choice",
    "scope": "final",
    "concept": [
      "encryption",
      "sse-kms",
      "kms",
      "audit"
    ],
    "scenario": "규정 준수 팀이 한 버킷에 대해 두 가지를 요구한다 — 객체를 저장 시 암호화할 것, 그리고 어떤 키가 언제 누구에 의해 사용됐는지 감사 추적(audit trail)을 남길 것. 키 사용 권한도 IAM/키 정책으로 세밀하게 통제하고 싶다. 가장 적절한 서버측 암호화 방식은?",
    "choices": [
      "SSE-S3 (Amazon S3 관리형 키) — S3가 키를 전적으로 관리한다.",
      "SSE-KMS (AWS KMS 키) — 키 정책과 CloudTrail로 키 사용을 통제·감사한다.",
      "클라이언트 측 암호화로 전환하고 키는 애플리케이션이 직접 보관한다.",
      "버킷에 암호화를 설정하지 않고 HTTPS 전송 암호화만 적용한다."
    ],
    "answer": [
      1
    ],
    "explanation": "모든 S3 버킷은 기본적으로 SSE-S3로 암호화되지만, SSE-S3는 키를 S3가 전적으로 관리하므로 키 사용에 대한 별도의 권한 정책이나 CloudTrail 감사 로그를 제공하지 않는다. SSE-KMS는 KMS 키를 사용하므로 키 정책·IAM으로 누가 키를 쓸 수 있는지 통제하고, KMS API 호출이 CloudTrail에 기록되어 키 사용 감사가 가능하다.\n\n시험의 분기 키워드는 '키 사용 감사', '키 권한 통제', '규정 준수'다. 이 조건이 등장하면 SSE-S3가 아니라 SSE-KMS가 답이 된다. 단, SSE-KMS는 KMS 요청 쿼터의 영향을 받으므로 대량 요청 시 S3 버킷 키로 비용·요청을 줄이는 후속 고려가 따라온다.",
    "choiceExplanations": [
      "SSE-S3는 키 관리를 S3에 위임하므로 키 사용에 대한 권한 통제나 CloudTrail 감사 추적을 제공하지 않는다 — 감사 요구를 충족하지 못한다.",
      "정답. 키 사용에 대한 세밀한 권한 통제와 감사 추적이 요구되면 답은 SSE-KMS입니다.",
      "클라이언트 측 암호화는 키를 직접 보관하는 운영 부담이 크고, 질문이 요구한 것은 서버측 암호화에서의 키 사용 감사다.",
      "HTTPS는 전송 중(in-transit) 암호화일 뿐 저장 시(at-rest) 암호화가 아니다. 저장 암호화 요구를 충족하지 못한다."
    ],
    "title": "암호화 키 사용 감사가 요구될 때의 SSE 선택",
    "difficulty": "medium",
    "references": [
      {
        "title": "Specifying server-side encryption with AWS KMS (SSE-KMS)",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/specifying-kms-encryption.html"
      }
    ]
  },
  // source: s3-cross-account-bucket-policy-vs-iam
  {
    "id": "q3",
    "slug": "s3-cross-account-bucket-policy-vs-iam",
    "scope": "final",
    "concept": [
      "bucket-policy",
      "cross-account",
      "iam",
      "acl"
    ],
    "scenario": "A 계정이 소유한 버킷의 객체를, B 계정(다른 AWS 계정)의 애플리케이션이 읽을 수 있게 해야 한다. ACL은 비활성화되어 있고(Object Ownership = Bucket owner enforced) 두 계정 모두 표준 IAM을 사용한다. A 계정 측에서 접근을 부여하는 가장 적절한 방법은?",
    "choices": [
      "B 계정에서 A의 버킷을 가리키는 IAM 정책만 만들면 A의 동의 없이 접근이 열린다.",
      "A 계정에서 버킷의 ACL에 B 계정을 grantee로 추가한다.",
      "A 계정에서 객체에 퍼블릭 읽기 권한을 부여해 B가 인터넷으로 접근하게 한다.",
      "A 계정에서 B 계정(또는 B의 역할)을 Principal로 지정한 버킷 정책(리소스 기반 정책)을 작성한다."
    ],
    "answer": [
      3
    ],
    "explanation": "S3 리소스는 기본적으로 비공개이고, 다른 계정에 접근을 주려면 리소스를 소유한 A 계정이 명시적으로 허용해야 한다. 버킷 정책은 리소스 기반 정책이라 Principal에 다른 계정/역할을 지정할 수 있으므로 교차 계정 접근의 표준 수단이다. 일반적으로 A의 버킷 정책 허용 + B 측 IAM 정책 허용이 함께 갖춰져야 실제 호출이 성공한다.\n\n시험 함정은 '한쪽 정책만으로 교차 계정이 열린다'는 오해다. B의 IAM 정책만으로는 A가 동의하지 않은 리소스에 접근할 수 없다. 또한 ACL이 비활성화된(Bucket owner enforced) 환경에서는 ACL 기반 부여 자체가 불가능하므로, 정책 기반 접근이 유일한 경로다.",
    "choiceExplanations": [
      "B의 IAM 정책만으로는 A 소유 리소스에 접근할 수 없다 — 리소스 소유자 A의 버킷 정책 허용이 반드시 함께 있어야 한다.",
      "Object Ownership이 Bucket owner enforced이면 ACL이 비활성화되어 grantee 추가 자체가 동작하지 않는다. AWS는 ACL 대신 정책 사용을 권장한다.",
      "퍼블릭 공개는 특정 계정에만 주려는 요구를 과도하게 넘어서며, 최소 권한 원칙과 Block Public Access 권장에 어긋난다.",
      "정답. 교차 계정 접근은 리소스 소유자(A)가 버킷 정책에 상대 계정을 Principal로 명시해 부여하는 것이 표준입니다."
    ],
    "title": "다른 계정에 버킷 접근을 줄 때의 정책 선택",
    "difficulty": "medium",
    "references": [
      {
        "title": "Access control in Amazon S3",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-management.html"
      }
    ]
  },
  // source: s3-bucket-keys-reduce-kms-cost
  {
    "id": "q4",
    "slug": "s3-bucket-keys-reduce-kms-cost",
    "scope": "final",
    "concept": [
      "bucket-key",
      "sse-kms",
      "kms",
      "cost-optimization"
    ],
    "scenario": "SSE-KMS로 암호화된 버킷에 초당 수천 건의 객체가 읽고 쓰이면서 KMS 요청 비용과 KMS 요청 스로틀링이 문제가 되고 있다. 암호화 방식은 SSE-KMS로 유지하면서 KMS 호출 비용을 크게 줄이는 가장 적절한 방법은?",
    "choices": [
      "버킷에 S3 버킷 키(S3 Bucket Keys)를 활성화해 KMS로 가는 요청 수를 줄인다.",
      "암호화를 SSE-S3로 강등해 KMS를 아예 쓰지 않게 한다.",
      "객체마다 서로 다른 KMS 고객 관리형 키를 사용해 부하를 분산한다.",
      "모든 객체를 한 번에 GET하도록 애플리케이션 캐시 계층을 제거한다."
    ],
    "answer": [
      0
    ],
    "explanation": "S3 버킷 키를 활성화하면 S3가 버킷 수준의 단기 키를 받아 여러 객체의 데이터 키를 생성한다. 그 결과 객체마다 KMS를 호출하던 트래픽이 크게 줄어 SSE-KMS 비용을 최대 99%까지 절감하고 KMS 요청 스로틀링 위험도 낮아진다. 암호화 방식 자체는 SSE-KMS 그대로다.\n\n출제 포인트는 'SSE-KMS는 유지하되 비용/요청을 줄여라'다. 이때 답은 버킷 키다. 버킷 키는 기본적으로 새 객체에만 적용되며, 기존 객체에 적용하려면 CopyObject가 필요하고 DSSE-KMS에는 지원되지 않는다는 단서도 함께 기억한다.",
    "choiceExplanations": [
      "정답. S3 버킷 키는 버킷 수준 키로 데이터 키를 만들어 S3→KMS 요청을 크게 줄여 SSE-KMS 비용을 절감합니다.",
      "SSE-S3로 강등하면 KMS 비용은 사라지지만 SSE-KMS가 주는 키 권한 통제·감사를 잃는다. 질문은 'SSE-KMS를 유지하면서' 비용을 줄이라고 했다.",
      "키를 더 많이 쓰면 관리만 복잡해질 뿐 객체별 KMS 호출 횟수는 줄지 않아 비용 문제가 그대로다.",
      "캐시를 제거하면 오히려 원본 객체 접근(과 그에 따른 KMS 호출)이 늘어 비용이 악화된다."
    ],
    "title": "SSE-KMS 요청 비용이 급증할 때의 최적화",
    "difficulty": "medium",
    "references": [
      {
        "title": "Reducing the cost of SSE-KMS with Amazon S3 Bucket Keys",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-key.html"
      }
    ]
  },
  // source: s3-event-notification-sqs-fifo-eventbridge
  {
    "id": "q5",
    "slug": "s3-event-notification-sqs-fifo-eventbridge",
    "scope": "final",
    "concept": [
      "event-notifications",
      "eventbridge",
      "sqs-fifo"
    ],
    "scenario": "객체 업로드 이벤트를 순서가 보장되는 처리 파이프라인으로 보내려고 SQS FIFO 큐를 대상으로 정했다. 그런데 S3 이벤트 알림에서 FIFO 큐를 직접 대상으로 지정할 수 없었다. 요구를 충족하는 가장 적절한 구성은?",
    "choices": [
      "FIFO 큐를 표준 큐로 바꾼 뒤 S3 이벤트 알림 대상으로 직접 지정한다.",
      "S3 버킷 정책에 SQS FIFO 큐 ARN을 추가하면 알림이 자동으로 전달된다.",
      "버킷에서 Amazon EventBridge를 활성화하고, EventBridge 규칙의 대상으로 SQS FIFO 큐를 지정한다.",
      "Lambda를 거치지 않고 S3가 FIFO 큐로 직접 보내도록 알림 구성에서 FIFO 옵션을 켠다."
    ],
    "answer": [
      2
    ],
    "explanation": "S3 이벤트 알림이 직접 보낼 수 있는 대상은 SNS(표준)·SQS(표준)·Lambda·EventBridge 네 가지이며, SQS FIFO와 SNS FIFO는 직접 대상으로 지원되지 않는다. AWS가 안내하는 우회책은 버킷에서 EventBridge를 활성화하고, EventBridge 규칙에서 SQS FIFO 큐를 대상으로 라우팅하는 것이다.\n\n출제 포인트는 'S3 알림 대상 목록에 FIFO가 없다'는 제약과 그 해결책(EventBridge 경유)이다. EventBridge를 켜면 버킷은 연결만 활성화되고, 이벤트 필터링·대상 라우팅은 EventBridge 규칙 쪽에서 처리된다는 동작 차이도 함께 알아두면 좋다. 또한 EventBridge 규칙이 FIFO 큐를 대상으로 둘 때는 메시지 그룹을 지정하는 MessageGroupId가 필요하다는 점도 함께 기억해 두면 좋다.",
    "choiceExplanations": [
      "표준 큐로 바꾸면 직접 지정은 되지만 '순서 보장(FIFO)'이라는 핵심 요구를 버리게 된다.",
      "S3 이벤트 알림 전달은 버킷 정책이 아니라 알림 구성과 대상 권한으로 이뤄지며, 버킷 정책에 큐 ARN을 적는다고 FIFO 제약이 풀리지 않는다.",
      "정답. S3 이벤트 알림은 FIFO 큐를 직접 대상으로 두지 못하므로, EventBridge를 켜고 그 규칙 대상으로 FIFO 큐를 지정합니다.",
      "S3 이벤트 알림 구성에는 FIFO 큐 직접 전송 옵션 자체가 없다. 그래서 EventBridge 경유가 필요한 것이다."
    ],
    "title": "S3 이벤트를 SQS FIFO 큐로 보내는 방법",
    "difficulty": "hard",
    "references": [
      {
        "title": "Event notification types and destinations",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-how-to-event-types-and-destinations.html"
      }
    ]
  },
  // source: s3-static-website-public-access-setup
  {
    "id": "q6",
    "slug": "s3-static-website-public-access-setup",
    "scope": "final",
    "concept": [
      "static-website-hosting",
      "block-public-access",
      "bucket-policy"
    ],
    "scenario": "한 개발자가 S3 정적 웹사이트 호스팅으로 마케팅 페이지를 인터넷에 공개하려 한다. 정적 호스팅 기능은 켰지만 방문자가 403을 받는다. 페이지를 정상 공개하기 위해 함께 필요한 조치는? (2개를 고르세요)",
    "choices": [
      "객체 접근을 사전 서명 URL로만 제공하도록 코드를 변경한다.",
      "버킷의 Block Public Access 설정을 공개에 맞게 조정(해제)한다.",
      "버킷을 EventBridge 대상으로 등록한다.",
      "익명 GetObject를 허용하는 버킷 정책(또는 적절한 공개 읽기 정책)을 추가한다."
    ],
    "answer": [
      1,
      3
    ],
    "explanation": "정적 웹사이트 호스팅을 켜고 인덱스 문서를 지정해도 객체 자체가 비공개이면 방문자는 403을 받는다. 공개 사이트로 만들려면 두 조각이 필요하다 — Block Public Access를 공개에 맞게 조정(해제)하고, 익명 사용자의 s3:GetObject를 허용하는 버킷 정책을 두는 것이다. 둘 중 하나라도 빠지면 접근이 거부된다.\n\n출제 포인트는 '정적 호스팅 ON'만으로는 공개가 완성되지 않는다는 점이다. Block Public Access는 정책보다 우선해 공개를 차단하므로, 의도적 공개 시에는 BPA 조정과 공개 정책이 짝을 이뤄야 한다. (실무에서는 버킷을 비공개로 두고 CloudFront + OAC로 배포하는 패턴이 더 권장되지만, 이 문항은 S3 직접 공개 구성을 묻는다.)",
    "choiceExplanations": [
      "사전 서명 URL은 시간 제한 개별 접근용이라 누구나 보는 공개 웹사이트의 정적 자산 제공 방식으로 맞지 않는다.",
      "정답. 정적 웹사이트 공개는 Block Public Access를 공개에 맞게 풀고, 익명 읽기를 허용하는 버킷 정책을 함께 두어야 동작합니다.",
      "EventBridge 등록은 이벤트 알림 라우팅과 관련된 설정으로, 정적 페이지 공개와 무관하다.",
      "정답. 정적 웹사이트 공개는 Block Public Access를 공개에 맞게 풀고, 익명 읽기를 허용하는 버킷 정책을 함께 두어야 동작합니다."
    ],
    "title": "정적 웹사이트를 공개하기 위한 필수 구성",
    "difficulty": "medium",
    "references": [
      {
        "title": "Enabling website hosting",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/EnableWebsiteHosting.html"
      },
      {
        "title": "Blocking public access to your Amazon S3 storage",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html"
      }
    ]
  },
  // source: s3-presigned-put-browser-upload
  {
    "id": "q7",
    "slug": "s3-presigned-put-browser-upload",
    "scope": "final",
    "concept": [
      "presigned-url",
      "upload",
      "put"
    ],
    "scenario": "모바일 앱 사용자가 자신의 사진을 비공개 버킷에 직접 올리도록 하고 싶다. 사용자에게 AWS 자격 증명을 주지 않고, 백엔드를 거쳐 파일 바이트를 중계하지도 않는 것이 목표다. 가장 적절한 방법은?",
    "choices": [
      "백엔드가 PUT용 사전 서명 URL을 발급하고, 클라이언트는 그 URL로 객체를 직접 PUT 업로드한다.",
      "버킷을 퍼블릭 쓰기 가능으로 설정해 누구나 PutObject 할 수 있게 한다.",
      "앱에 IAM 사용자 액세스 키를 내장해 클라이언트가 직접 SDK로 업로드하게 한다.",
      "모든 업로드 파일을 백엔드 서버가 수신해 S3로 다시 전송한다."
    ],
    "answer": [
      0
    ],
    "explanation": "사전 서명 URL은 GET뿐 아니라 PUT(업로드)에도 쓸 수 있다. 백엔드가 권한을 가진 보안 주체로 PUT용 사전 서명 URL을 만들어 클라이언트에 건네면, 클라이언트는 AWS 자격 증명 없이 그 URL로 객체를 직접 업로드할 수 있다. 파일 바이트가 백엔드를 거치지 않아 서버 부하와 대역폭도 절약된다.\n\n출제 포인트는 '자격 증명 없이 + 백엔드 중계 없이 업로드'다. 이 조합은 PUT 사전 서명 URL의 전형적 용례다. 같은 키가 이미 있으면 덮어쓰기되고 업로드된 객체의 소유자는 버킷 소유자가 된다는 동작도 알아두면 좋다.",
    "choiceExplanations": [
      "정답. PUT용 사전 서명 URL을 발급하면 자격 증명 없이도 클라이언트가 객체를 백엔드 중계 없이 직접 업로드할 수 있습니다.",
      "퍼블릭 쓰기는 누구나 임의 객체를 올리거나 덮어쓸 수 있는 심각한 보안 위험이며 Block Public Access 권장에 정면으로 어긋난다.",
      "클라이언트에 액세스 키를 내장하면 디컴파일·트래픽 분석으로 키가 유출된다 — 자격 증명을 주지 않는다는 요구를 정면으로 위반한다.",
      "백엔드가 파일을 받아 다시 전송하면 '백엔드 중계를 하지 않는다'는 요구를 어기고 서버 대역폭·부하도 늘어난다."
    ],
    "title": "브라우저에서 직접 객체를 업로드하게 하기",
    "difficulty": "medium",
    "references": [
      {
        "title": "Uploading objects with presigned URLs",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html"
      }
    ]
  },
  // source: s3-read-after-write-strong-consistency
  {
    "id": "q8",
    "slug": "s3-read-after-write-strong-consistency",
    "scope": "final",
    "concept": [
      "consistency",
      "read-after-write"
    ],
    "scenario": "한 애플리케이션이 S3에 새 객체를 PUT으로 쓴 직후, 같은 키를 GET으로 읽어 후속 처리를 한다. 방금 쓴 데이터가 그대로 읽힌다는 보장을 받을 수 있는가?",
    "choices": [
      "보장되지 않는다. 새 객체는 전 리전에 전파될 때까지 읽히지 않을 수 있다.",
      "보장된다. S3는 모든 리전에서 객체 PUT/DELETE에 대해 강한 read-after-write 일관성을 제공한다.",
      "버전 관리를 켠 버킷에서만 보장되고, 끈 버킷에서는 보장되지 않는다.",
      "DynamoDB로 인덱스를 따로 만들어 일관성을 직접 구현해야만 보장된다."
    ],
    "answer": [
      1
    ],
    "explanation": "Amazon S3는 모든 AWS 리전에서 객체 PUT 및 DELETE 요청에 대해 강한 read-after-write 일관성을 제공한다. 새 객체 생성은 물론 기존 객체 덮어쓰기와 삭제에도 적용되며, 성공한 PUT 응답 이후 시작된 GET·LIST는 방금 쓴 데이터를 반환한다. 즉 별도 구현 없이 쓰고 바로 읽어도 최신 데이터가 보장된다.\n\n이 동작은 과거의 '최종 일관성(eventual consistency)' 인식을 바로잡는 단골 출제 포인트다. 다만 강한 일관성은 객체 데이터에 대한 것이고, 버킷 구성 변경(예: 버전 관리 활성화 직후)은 여전히 최종 일관성 모델을 따른다는 단서는 구분해서 기억해야 한다.",
    "choiceExplanations": [
      "리전 간 전파 지연은 강한 일관성 이전의 오해다. 단일 객체 PUT 후 같은 리전에서의 후속 읽기는 즉시 최신 데이터를 본다.",
      "정답. S3는 모든 리전에서 객체의 PUT/DELETE에 대해 강한 read-after-write 일관성을 기본 제공합니다.",
      "강한 read-after-write 일관성은 버전 관리 여부와 무관하게 기본 제공된다.",
      "외부 인덱스를 만들 필요가 없다. S3 자체가 객체 쓰기에 강한 일관성을 보장한다."
    ],
    "title": "객체를 쓰고 곧바로 읽을 때의 일관성",
    "difficulty": "easy",
    "references": [
      {
        "title": "What is Amazon S3? (Amazon S3 data consistency model)",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html"
      }
    ]
  },
  // source: s3-versioning-mfa-delete-protection
  {
    "id": "q9",
    "slug": "s3-versioning-mfa-delete-protection",
    "scope": "final",
    "concept": [
      "versioning",
      "mfa-delete",
      "data-protection"
    ],
    "scenario": "감사용으로 보관하는 버킷에서, 운영 실수나 자격 증명 탈취로 객체 버전이 영구 삭제되는 것을 막아야 한다. 버전 관리는 이미 켜져 있다. 영구 삭제에 추가 인증 장벽을 두는 가장 적절한 조치는?",
    "choices": [
      "버킷 정책에서 s3:DeleteObject를 모두 거부해 어떤 삭제도 불가능하게 한다.",
      "객체를 매일 다른 버킷으로 복제해 두면 원본이 삭제돼도 무방하다.",
      "수명 주기 규칙으로 오래된 버전을 자동 만료시킨다.",
      "버킷에 MFA delete를 활성화해 버전의 영구 삭제와 버전 관리 상태 변경에 MFA를 요구한다."
    ],
    "answer": [
      3
    ],
    "explanation": "버전 관리는 덮어쓰기·삭제 시 이전 버전을 보존하지만, 권한 있는 주체는 특정 버전을 영구 삭제할 수 있다. MFA delete를 활성화하면 객체 버전의 영구 삭제와 버킷의 버전 관리 상태 변경에 보안 자격 증명 외에 MFA 기기 코드까지 요구되어, 자격 증명만 탈취된 상황에서도 영구 삭제를 막는 추가 장벽이 된다.\n\n출제 포인트는 '영구 삭제에 추가 인증'이라는 조건과 MFA delete의 제약이다. MFA delete는 버킷 소유자(루트)만 활성화할 수 있고 콘솔이 아니라 CLI/API로만 구성하며, 수명 주기 구성과 함께 쓸 수 없다는 단서가 자주 출제된다.",
    "choiceExplanations": [
      "모든 삭제를 거부하면 정상적인 운영 삭제까지 막혀 과도하고, 정책은 자격 증명 탈취 시 변경될 수 있어 MFA 같은 추가 인증 장벽과는 성격이 다르다.",
      "복제는 사본을 늘릴 뿐 원본 버전의 영구 삭제 자체를 막지 못한다. 삭제 작업에 인증 장벽을 더하는 것이 요구사항이다.",
      "수명 주기 만료는 오히려 오래된 버전을 자동으로 지우는 기능이라 보존·보호 목적과 정반대다.",
      "정답. MFA delete를 켜면 버전의 영구 삭제와 버전 관리 상태 변경에 MFA 인증이 추가로 요구됩니다."
    ],
    "title": "실수·악의적 영구 삭제로부터 객체 보호하기",
    "difficulty": "medium",
    "references": [
      {
        "title": "Configuring MFA delete",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/MultiFactorAuthenticationDelete.html"
      }
    ]
  },
  // source: s3-lifecycle-transition-cold-storage
  {
    "id": "q10",
    "slug": "s3-lifecycle-transition-cold-storage",
    "scope": "final",
    "concept": [
      "lifecycle",
      "storage-class",
      "cost-optimization"
    ],
    "scenario": "애플리케이션 로그를 S3 Standard에 저장한다. 로그는 처음 30일은 자주 조회되지만 그 뒤로는 거의 보지 않고, 1년이 지나면 삭제해도 된다. 운영 개입 없이 비용을 최적화하는 가장 적절한 방법은?",
    "choices": [
      "매월 스크립트를 돌려 오래된 객체를 수동으로 더 싼 클래스로 복사한다.",
      "버킷 전체의 기본 스토리지 클래스를 Glacier Deep Archive로 한 번에 바꾼다.",
      "수명 주기(Lifecycle) 규칙으로 30일 후 더 저렴한 클래스로 전환하고 365일 후 만료(삭제)시킨다.",
      "CloudFront 캐싱을 붙여 오래된 로그의 저장 비용을 줄인다."
    ],
    "answer": [
      2
    ],
    "explanation": "S3 수명 주기 구성은 두 종류의 액션을 제공한다 — 일정 기간 후 더 저렴한 스토리지 클래스로 옮기는 전환(transition)과, 일정 기간 후 객체를 자동 삭제하는 만료(expiration)다. '30일 후 전환, 365일 후 만료' 규칙을 한 번 설정하면 기존·신규 객체 모두에 자동 적용되어 운영 개입이 필요 없다.\n\n출제 포인트는 '시간이 지나며 접근이 줄고 결국 삭제'라는 수명 패턴이 수명 주기 규칙과 정확히 대응한다는 점이다. 함정은 모든 객체를 즉시 아카이브 클래스로 옮기는 선택지 — 초기 30일의 잦은 조회에는 검색 비용·지연이 큰 아카이브 클래스가 부적절하다.",
    "choiceExplanations": [
      "수동 스크립트는 '운영 개입 없이'라는 요구를 어기고, 수명 주기 규칙이 똑같은 일을 관리형으로 자동 처리한다.",
      "초기 30일은 자주 조회되는데 Deep Archive는 검색에 시간·비용이 커 부적절하다. 단계별 전환이 맞다.",
      "정답. 수명 주기 규칙의 전환·만료 액션이 운영 개입 없이 접근 패턴에 맞춰 비용을 자동 최적화합니다.",
      "CloudFront는 전송·캐싱 비용을 줄이는 것이지 S3 객체의 저장 클래스나 저장 비용을 자동으로 낮추지 않는다."
    ],
    "title": "접근 빈도가 줄어드는 로그의 비용 최적화",
    "difficulty": "easy",
    "references": [
      {
        "title": "Managing the lifecycle of objects",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html"
      }
    ]
  },
  // source: s3-multipart-upload-large-file-resilience
  {
    "id": "q11",
    "slug": "s3-multipart-upload-large-file-resilience",
    "scope": "final",
    "concept": [
      "multipart-upload",
      "large-objects",
      "performance"
    ],
    "scenario": "4GB짜리 영상 파일을 모바일 네트워크가 불안정한 환경에서 S3에 업로드해야 한다. 단일 PUT으로 올리면 중간에 끊겨 처음부터 다시 올리는 일이 잦다. 처리량을 높이고 실패 시 재시도 비용을 줄이는 가장 적절한 방법은?",
    "choices": [
      "객체를 절반 크기로 압축한 뒤 단일 PUT으로 한 번에 올린다.",
      "멀티파트 업로드(multipart upload)로 파일을 여러 파트로 나눠 병렬 업로드하고, 실패한 파트만 재시도한다.",
      "버킷의 스토리지 클래스를 S3 Express One Zone으로 바꾸면 대용량 업로드가 자동 분할된다.",
      "사전 서명 URL을 여러 개 발급해 같은 파일을 동시에 여러 번 PUT한다."
    ],
    "answer": [
      1
    ],
    "explanation": "멀티파트 업로드는 하나의 객체를 여러 개의 독립적인 파트로 나눠 병렬·임의 순서로 올린다. 파트가 실패하면 그 파트만 다시 올리면 되므로 전체 재업로드를 피할 수 있고, 병렬 전송으로 처리량도 높아진다. AWS는 100MB 이상 객체에 멀티파트 업로드를 권장한다.\n\n출제 포인트는 '대용량 + 불안정한 네트워크 + 재시도 비용'이라는 키워드 묶음이다. 이 조합에서는 멀티파트 업로드가 정답이다. 완료되지 않은 멀티파트 업로드 파트는 저장 비용을 발생시키므로, 수명 주기 규칙으로 미완료 업로드를 정리하는 후속 관리도 함께 알아두면 좋다.",
    "choiceExplanations": [
      "압축해도 여전히 단일 PUT이라 중간에 끊기면 처음부터 다시 올려야 한다 — 근본 문제(재시도 비용)가 해결되지 않는다.",
      "정답. 멀티파트 업로드는 객체를 독립적인 파트로 나눠 병렬·재시도 가능하게 하여 대용량·불안정 네트워크 업로드에 적합합니다.",
      "스토리지 클래스 변경은 저장 위치·성능 특성을 바꿀 뿐, 업로드를 자동으로 분할하거나 파트 재시도를 제공하지 않는다.",
      "같은 파일을 여러 번 PUT하면 서로 덮어쓸 뿐 분할 전송·부분 재시도 효과가 없다. 분할은 멀티파트 업로드의 역할이다."
    ],
    "title": "대용량 파일을 불안정한 네트워크에서 업로드하기",
    "difficulty": "medium",
    "references": [
      {
        "title": "Uploading and copying objects using multipart upload in Amazon S3",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html"
      }
    ]
  },
  // source: s3-cors-browser-preflight-blocked
  {
    "id": "q12",
    "slug": "s3-cors-browser-preflight-blocked",
    "scope": "final",
    "concept": [
      "cors",
      "cross-origin",
      "troubleshooting"
    ],
    "scenario": "https://app.example.com 에서 로드된 자바스크립트가 fetch로 다른 도메인의 S3 버킷 객체를 읽으려 하자 브라우저가 요청을 차단하고 콘솔에 'CORS' 오류가 표시된다. 권한(IAM/버킷 정책)은 충분하다. 가장 적절한 해결책은?",
    "choices": [
      "버킷에 CORS 구성을 추가해 app.example.com 출처와 허용 메서드를 명시한다.",
      "버킷 정책에 Allow GetObject를 추가하면 브라우저의 CORS 차단이 풀린다.",
      "객체를 사전 서명 URL로 제공하면 CORS 검사가 사라진다.",
      "버킷의 Block Public Access를 모두 해제한다."
    ],
    "answer": [
      0
    ],
    "explanation": "CORS는 한 도메인에서 로드된 웹 애플리케이션이 다른 도메인의 S3 리소스에 접근하도록 허용하는 메커니즘이다. 브라우저가 보내는 프리플라이트 요청에 대해 S3는 버킷의 CORS 구성에서 요청의 출처·HTTP 메서드·헤더가 매칭되는 규칙을 평가한다. 따라서 app.example.com을 AllowedOrigins에, 사용하는 메서드를 AllowedMethods에 넣어야 차단이 풀린다.\n\n출제 포인트는 'CORS 오류는 권한 문제가 아니라 출처 허용 구성의 문제'라는 구분이다. IAM·버킷 정책이 충분해도 CORS 구성이 없으면 브라우저가 응답을 막는다. CORS는 권한을 대체하지 않으며, 기존 ACL·정책은 그대로 함께 적용된다는 점도 기억한다.",
    "choiceExplanations": [
      "정답. 교차 출처 브라우저 요청은 버킷의 CORS 구성에서 출처·메서드·헤더를 허용해야 통과합니다.",
      "버킷 정책은 권한을 다루지 브라우저의 교차 출처 정책을 제어하지 않는다. CORS 차단은 별도의 CORS 구성으로 풀어야 한다.",
      "사전 서명 URL도 다른 도메인에서 브라우저로 호출하면 동일하게 CORS 규칙의 적용을 받는다 — 검사가 사라지지 않는다.",
      "Block Public Access 해제는 공개 여부를 다룰 뿐 교차 출처 요청 허용과 무관하며, 권한이 충분하다는 전제와도 어긋난다."
    ],
    "title": "다른 도메인의 웹앱이 S3를 호출할 때의 차단",
    "difficulty": "medium",
    "references": [
      {
        "title": "Using cross-origin resource sharing (CORS)",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html"
      }
    ]
  },
  // source: s3-block-public-access-overrides-policy
  {
    "id": "q13",
    "slug": "s3-block-public-access-overrides-policy",
    "scope": "final",
    "concept": [
      "block-public-access",
      "bucket-policy",
      "troubleshooting"
    ],
    "scenario": "한 개발자가 버킷에 익명 GetObject를 허용하는 버킷 정책을 추가했는데도 객체가 여전히 퍼블릭으로 열리지 않는다. 정책 문법은 올바르다. 가장 가능성 높은 원인과 해결 방향은?",
    "choices": [
      "버킷이 잘못된 리전에 있어서다. 같은 리전으로 버킷을 옮긴다.",
      "객체에 SSE-KMS가 걸려 있어서다. 암호화를 해제한다.",
      "버전 관리가 꺼져 있어서다. 버전 관리를 켜면 공개된다.",
      "Block Public Access가 켜져 있어 퍼블릭 정책을 무시·차단한다. 의도적 공개라면 해당 BPA 설정을 조정해야 한다."
    ],
    "answer": [
      3
    ],
    "explanation": "Block Public Access(BPA)는 버킷·계정·조직 수준의 설정으로, 퍼블릭 접근을 부여하는 정책·ACL을 무시하거나 차단한다. 새 버킷은 기본적으로 BPA가 켜져 있어 익명 GetObject 정책을 추가해도 공개되지 않는다. S3는 여러 수준의 BPA 설정 중 가장 제한적인 조합을 항상 적용한다.\n\n출제 포인트는 'BPA가 정책보다 우선한다'는 평가 순서다. 문법이 맞는 공개 정책인데도 안 열리면 BPA를 의심해야 한다. 단, AWS는 BPA 유지를 권장하므로 공개가 정말 필요한 경우에만 해당 설정을 조정하고, 그 외에는 CloudFront + OAC 같은 비공개 배포를 택하는 것이 모범이다.",
    "choiceExplanations": [
      "버킷 리전은 공개 여부와 무관하다. 퍼블릭 정책이 무시되는 전형적 원인은 Block Public Access다.",
      "SSE-KMS는 저장 암호화일 뿐 퍼블릭 접근 허용 여부와 직접 관련이 없다. 암호화 해제로 공개가 되지 않는다.",
      "버전 관리는 객체 버전 보존 기능이지 공개 접근과 무관하다. 켜도 공개되지 않는다.",
      "정답. Block Public Access는 퍼블릭을 부여하는 정책보다 우선해 접근을 차단하므로, 의도적 공개 시 BPA 설정을 먼저 조정해야 합니다."
    ],
    "title": "공개 버킷 정책을 넣어도 접근이 안 되는 이유",
    "difficulty": "hard",
    "references": [
      {
        "title": "Blocking public access to your Amazon S3 storage",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html"
      }
    ]
  },
  // source: s3-presigned-url-role-credential-expiry
  {
    "id": "q14",
    "slug": "s3-presigned-url-role-credential-expiry",
    "scope": "final",
    "concept": [
      "presigned-url",
      "expiration",
      "temporary-credentials"
    ],
    "scenario": "EC2 인스턴스 프로파일(IAM 역할)의 임시 자격 증명을 사용하는 백엔드가, 만료를 7일로 지정해 사전 서명 URL을 발급했다. 그런데 URL이 7일을 채우지 못하고 몇 시간 만에 만료된다. 가장 정확한 설명은?",
    "choices": [
      "S3 버그다. 지원 티켓을 열어 7일 만료를 강제로 적용받아야 한다.",
      "사전 서명 URL의 최대 만료는 항상 1시간이라 7일 지정이 무시된 것이다.",
      "임시(역할/STS) 자격 증명으로 만든 URL은 그 자격 증명이 만료되면 함께 만료된다 — 지정한 7일보다 짧을 수 있다.",
      "URL이 짧게 만료되는 것은 버킷에 버전 관리가 꺼져 있기 때문이다."
    ],
    "answer": [
      2
    ],
    "explanation": "사전 서명 URL의 유효 기간은 그것을 만든 자격 증명의 유형에 묶인다. IAM 사용자의 장기 키(SigV4)로 만들면 최대 7일까지 가능하지만, IAM 역할·STS 같은 임시 자격 증명으로 만들면 그 자격 증명이 만료·취소되는 순간 URL도 만료된다 — 더 긴 만료 시간을 지정했더라도 마찬가지다. EC2 인스턴스의 역할 자격 증명은 보통 수 시간 단위로 갱신되므로 7일을 채우지 못한다.\n\n출제 포인트는 '발급에 쓴 자격 증명 종류가 실제 만료를 좌우한다'는 점이다. 정말 최대 7일이 필요하면 IAM 사용자 장기 키로 서명해야 한다. 다만 키 노출 위험 때문에 실무에서는 더 짧은 만료와 임시 자격 증명을 선호한다는 트레이드오프도 함께 이해한다.",
    "choiceExplanations": [
      "이것은 버그가 아니라 임시 자격 증명의 정상 동작이다. 자격 증명이 만료되면 그것으로 서명한 URL도 만료된다.",
      "CLI/SDK로는 최대 7일까지 지정할 수 있다(콘솔은 최대 12시간). '항상 1시간'은 사실이 아니다.",
      "정답. 사전 서명 URL은 그것을 만든 자격 증명이 만료되면 함께 만료되므로, 임시 역할 자격 증명으로 만들면 지정한 7일보다 짧게 끝납니다.",
      "버전 관리 여부는 사전 서명 URL의 만료와 아무 관련이 없다. 만료는 서명에 사용한 자격 증명에 묶인다."
    ],
    "title": "역할 자격 증명으로 만든 사전 서명 URL의 만료",
    "difficulty": "hard",
    "references": [
      {
        "title": "Download and upload objects with presigned URLs",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html"
      }
    ]
  },
  // source: s3-enforce-encryption-on-upload
  {
    "id": "q15",
    "slug": "s3-enforce-encryption-on-upload",
    "scope": "final",
    "concept": [
      "encryption",
      "sse-kms",
      "default-encryption",
      "bucket-policy"
    ],
    "scenario": "보안 정책상 한 버킷에는 SSE-KMS로 암호화된 객체만 저장되어야 하고, 그 외 방식으로는 업로드 자체가 거부돼야 한다. 이를 강제하기 위한 적절한 조치는? (2개를 고르세요)",
    "choices": [
      "버킷의 기본 암호화(default encryption)를 SSE-KMS로 설정해 암호화를 지정하지 않은 PUT도 SSE-KMS로 저장되게 한다.",
      "버킷에 Block Public Access를 켜면 SSE-KMS가 강제된다.",
      "버킷 정책으로 SSE-KMS가 아닌 PutObject 요청을 Deny해, 잘못된 암호화 헤더의 업로드를 거부한다.",
      "버킷에 CORS 구성을 추가해 암호화되지 않은 업로드를 차단한다."
    ],
    "answer": [
      0,
      2
    ],
    "explanation": "기본 암호화를 SSE-KMS로 설정하면 PUT 요청이 암호화를 지정하지 않아도 객체가 SSE-KMS로 저장된다. 여기에 더해, 잘못된 암호화 방식(예: SSE-S3나 비암호화 지정)으로 들어오는 PutObject를 버킷 정책의 Deny 조건으로 막으면, 의도와 다른 암호화로 올라오는 객체를 업로드 단계에서 거부할 수 있다. 둘을 함께 쓰면 '저장은 SSE-KMS, 그 외는 거부'가 완성된다.\n\n출제 포인트는 '강제(enforce)'라는 키워드다. 기본 암호화만으로는 클라이언트가 다른 암호화 헤더를 명시했을 때를 막지 못하므로, 정책 Deny가 실제 강제 장치가 된다. 기본 암호화 변경은 기존 객체를 소급해 다시 암호화하지 않는다는 점(필요 시 S3 Batch Operations)도 함께 기억한다.",
    "choiceExplanations": [
      "정답. 기본 암호화를 SSE-KMS로 두어 헤더 미지정 PUT을 안전하게 처리하고, 버킷 정책으로 비-SSE-KMS PUT을 Deny해 강제합니다.",
      "Block Public Access는 퍼블릭 접근 차단 기능이지 객체의 암호화 방식을 강제하지 않는다 — 암호화 정책과 무관하다.",
      "정답. 기본 암호화를 SSE-KMS로 두어 헤더 미지정 PUT을 안전하게 처리하고, 버킷 정책으로 비-SSE-KMS PUT을 Deny해 강제합니다.",
      "CORS는 브라우저의 교차 출처 요청을 다루는 설정으로, 객체 암호화 방식 강제와 전혀 관련이 없다."
    ],
    "title": "특정 암호화 없이 올라온 객체를 거부하기",
    "difficulty": "hard",
    "references": [
      {
        "title": "Specifying server-side encryption with AWS KMS (SSE-KMS)",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/specifying-kms-encryption.html"
      }
    ]
  },
];
