"use client";

import type { ReactNode } from "react";
import {
  C,
  Checklist,
  Code,
  ExamLi,
  ExamPoint,
  Fig,
  Note,
  P,
  Sec,
  SubTitle,
  Table,
} from "../ui";

const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

/** JSON/정책 예시 블록 — 잉크 배경 카드 (전역 셀렉터 없이 인라인 스타일만). */
function CodeBlock({ children }: { children: string }) {
  return (
    <pre
      style={{
        fontFamily: MONO,
        fontSize: "0.8rem",
        lineHeight: 1.7,
        background: C.ink,
        color: "#D5E0EC",
        borderRadius: 11,
        padding: "1rem 1.15rem",
        overflowX: "auto",
        margin: "1rem 0",
      }}
    >
      {children}
    </pre>
  );
}

/** 주의(함정) 콜아웃 — 레드 왼쪽 보더. */
function WarnBox({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: C.redSoft,
        color: C.ink,
        borderLeft: `5px solid ${C.red}`,
        borderRadius: "0 12px 12px 0",
        padding: "0.85rem 1.15rem",
        margin: "1.25rem 0",
        fontSize: "0.93rem",
      }}
    >
      <b style={{ color: C.red }}>⚠ 함정 </b>
      {children}
    </div>
  );
}

export default function Ch11Body() {
  return (
    <>
      <P>
        S3는 &ldquo;무한 확장&rdquo;으로 불리는 객체 스토리지이자 AWS 전반의 기반입니다 — 백업·재해
        복구·아카이브·데이터 레이크·정적 웹사이트·소프트웨어 배포가 전부 S3 위에서 돌아갑니다.
        DVA-C02에서는 <b>버킷/객체 모델, 보안(정책·암호화), 스토리지 클래스와 수명 주기, 이벤트
        알림, 성능 최적화</b>가 반복 출제됩니다. 이 챕터는 개념 이해 중심이며 실습은 포함하지
        않습니다.
      </P>

      <OverviewSection />
      <PolicySection />
      <WebsiteSection />
      <VersioningSection />
      <ReplicationSection />
      <StorageClassSection />
      <LifecycleSection />
      <EventsSection />
      <PerformanceSection />
      <TagsSection />
      <EncryptionSection />
      <DefaultEncryptionSection />
      <CorsSection />
      <MfaDeleteSection />
      <AccessLogsSection />
      <PresignedSection />
      <AccessPointSection />
      <ObjectLambdaSection />

      <Checklist
        title="체크리스트 — 이 문장이 술술 나오면 통과"
        items={[
          {
            text: "객체 최대 50TB(멀티파트 5MB~50TB), 단일 PUT 최대 5GB — 5GB 초과는 멀티파트 필수, 100MB 이상 권장",
            freq: "★★★",
          },
          {
            text: "접근 허용 = (IAM 정책 ∪ 버킷 정책의 Allow) AND 명시적 Deny 없음. 퍼블릭 공개는 Block Public Access 해제까지 필요",
            freq: "★★★",
          },
          {
            text: "내구성은 전 클래스 11-nine 동일 — 차이는 가용성·검색 시간·최소 저장 기간(30/90/180일)·비용",
            freq: "★★★",
          },
          {
            text: "SSE-KMS는 CloudTrail 감사 + KMS 쿼터 소모(해결책 S3 Bucket Key), SSE-C는 HTTPS 필수·S3가 키를 저장하지 않음",
            freq: "★★★",
          },
          {
            text: "복제는 양쪽 버전 관리 필수, 활성화 이후 새 객체만(기존은 Batch Replication), 체이닝 불가",
            freq: "★★☆",
          },
          {
            text: "이벤트 알림 권한은 IAM 역할이 아니라 대상(SNS/SQS/Lambda)의 리소스 정책",
            freq: "★★☆",
          },
          {
            text: "prefix당 초당 3,500 PUT/COPY/POST/DELETE · 5,500 GET/HEAD, prefix 수 무제한",
            freq: "★★★",
          },
          {
            text: "Presigned URL은 생성자 권한 상속 — 기본 3600초, 콘솔 최대 12시간, CLI 최대 7일",
            freq: "★★★",
          },
        ]}
      />
    </>
  );
}

/* ── 01 S3 개요 ────────────────────────────────────────────────────── */

function OverviewSvg() {
  return (
    <svg viewBox="0 0 700 240" style={{ width: "100%", height: "auto" }} role="img">
      <rect x="15" y="15" width="330" height="210" rx="14" fill={C.tealSoft} stroke={C.teal} strokeWidth="1.5" />
      <text x="32" y="44" fontSize="13" fontWeight="800" fill={C.teal}>
        버킷 my-app-bucket
      </text>
      <text x="32" y="62" fontSize="10.5" fill={C.inkSoft}>
        이름은 전역 고유 · 버킷은 리전 단위 생성
      </text>
      {["images/logo.png", "images/2026/a.jpg", "data/report.csv"].map((k, i) => (
        <g key={k}>
          <rect x="32" y={76 + i * 40} width="296" height="30" rx="7" fill={C.card} stroke={C.line} />
          <text x="44" y={95 + i * 40} fontSize="11" fontFamily="monospace" fontWeight="600" fill={C.ink}>
            {k}
          </text>
        </g>
      ))}
      <rect x="375" y="30" width="310" height="180" rx="12" fill={C.card} stroke={C.line} strokeWidth="1.5" />
      <text x="392" y="56" fontSize="12.5" fontWeight="800" fill={C.ink}>
        객체(Object) = Key + Value
      </text>
      <text x="392" y="82" fontSize="10.5" fontFamily="monospace" fill={C.blue}>
        s3://my-app-bucket/images/logo.png
      </text>
      <text x="392" y="104" fontSize="10.5" fill={C.inkSoft}>
        Key = prefix(images/) + 객체 이름(logo.png)
      </text>
      <text x="392" y="122" fontSize="10.5" fill={C.inkSoft}>
        실제 폴더는 없음 — &ldquo;/&rdquo;로 계층처럼 보일 뿐
      </text>
      <text x="392" y="148" fontSize="10.5" fill={C.ink}>
        Value(본문) 최대{" "}
        <tspan fontWeight="800" fill={C.red}>
          50TB
        </tspan>{" "}
        · 단일 PUT 5GB
      </text>
      <text x="392" y="166" fontSize="10.5" fill={C.inkSoft}>
        + 메타데이터 · 태그(최대 10개) · 버전 ID
      </text>
      <text x="392" y="194" fontSize="10.5" fontWeight="700" fill={C.red}>
        5GB 초과 업로드 = 멀티파트 필수
      </text>
    </svg>
  );
}

function OverviewSection() {
  return (
    <Sec
      num="01"
      title="S3 개요 — 버킷·객체·Key"
      sub="키/prefix 구조, 크기 한도, 버킷 네이밍"
      freq="mid"
      freqLabel="빈출 ★★☆ · 기초지만 함정 선지의 재료"
    >
      <P>
        데이터는 <b>버킷</b>(최상위 컨테이너)에 <b>객체</b>(파일)로 저장됩니다. 버킷 이름은 모든
        계정을 통틀어 <b>전역적으로 고유</b>해야 하고, 버킷 자체는 특정 <b>리전</b>에
        생성됩니다 — S3가 글로벌 서비스처럼 보이지만 실제로는 리전 서비스입니다.
      </P>

      <Fig caption="버킷 안에 객체가 Key로 저장된다. 폴더는 실재하지 않으며 Key의 prefix일 뿐이다.">
        <OverviewSvg />
      </Fig>

      <SubTitle>핵심 수치와 규칙</SubTitle>
      <Table
        head={["항목", "값", "기억할 것"]}
        rows={[
          [
            "객체 최대 크기",
            <>
              <b>50TB</b> (멀티파트 5MB~50TB)
            </>,
            "과거 자료의 5TB는 구식 수치 — 현행 50TB",
          ],
          [
            "단일 PUT",
            <>
              최대 <b>5GB</b>
            </>,
            <>
              5GB 초과 시 <b>멀티파트 업로드 필수</b>, 100MB 이상부터 권장
            </>,
          ],
          [
            "버킷 이름",
            "3~63자 · 소문자/숫자/하이픈/마침표(.)",
            "대문자·언더스코어 불가, IP 형식 불가, 시작·끝 모두 문자/숫자",
          ],
          [
            "객체 태그",
            "최대 10개",
            "보안·수명 주기·비용 배분에 활용",
          ],
        ]}
      />

      <P>
        <b>객체 Key = 전체 경로</b>입니다. <Code>s3://bucket/folder1/file.txt</Code>에서 Key는{" "}
        <Code>folder1/file.txt</Code> 전체이고 <Code>folder1/</Code>이 prefix입니다.
        &ldquo;디렉터리&rdquo;는 실제로 없고 UI가 prefix를 폴더처럼 보여줄 뿐입니다.
      </P>
      <Note>
        부기: 2026년부터 계정·리전 스코프로 이름을 허용하는 account regional namespace가
        신설됐지만, 시험 기준은 여전히 기본 글로벌 네임스페이스(전역 고유)입니다.
      </Note>

      <ExamPoint>
        <ExamLi>
          &ldquo;대용량 객체를 한 번의 PUT으로&rdquo; 함정 → <b>단일 PUT은 5GB까지</b>, 초과는
          멀티파트 필수 (객체 자체는 50TB까지).
        </ExamLi>
        <ExamLi>
          Key vs prefix 구분, 버킷 이름 전역 고유성, &ldquo;폴더는 prefix일 뿐&rdquo;이 기초
          단골 선지.
        </ExamLi>
      </ExamPoint>
    </Sec>
  );
}

/* ── 02 보안 · 버킷 정책 ───────────────────────────────────────────── */

function PolicySvg() {
  return (
    <svg viewBox="0 0 700 230" style={{ width: "100%", height: "auto" }} role="img">
      <rect x="20" y="30" width="150" height="56" rx="10" fill={C.blueSoft} stroke={C.blue} strokeWidth="1.5" />
      <text x="95" y="54" textAnchor="middle" fontSize="12" fontWeight="700" fill={C.ink}>
        IAM 사용자/역할
      </text>
      <text x="95" y="72" textAnchor="middle" fontSize="10" fill={C.inkSoft}>
        IAM 정책 (자격증명 기반)
      </text>
      <rect x="20" y="130" width="150" height="56" rx="10" fill={C.amberSoft} stroke={C.amber} strokeWidth="1.5" />
      <text x="95" y="154" textAnchor="middle" fontSize="12" fontWeight="700" fill={C.ink}>
        외부/교차 계정
      </text>
      <text x="95" y="172" textAnchor="middle" fontSize="10" fill={C.inkSoft}>
        버킷 정책 (리소스 기반)
      </text>
      <rect x="280" y="78" width="170" height="64" rx="10" fill={C.card} stroke={C.ink} strokeWidth="1.5" />
      <text x="365" y="103" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.ink}>
        접근 평가
      </text>
      <text x="365" y="122" textAnchor="middle" fontSize="10" fill={C.red} fontWeight="700">
        명시적 Deny 최우선
      </text>
      <rect x="530" y="78" width="150" height="64" rx="10" fill={C.tealSoft} stroke={C.teal} strokeWidth="1.5" />
      <text x="605" y="103" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.teal}>
        S3 버킷
      </text>
      <text x="605" y="122" textAnchor="middle" fontSize="10" fill={C.inkSoft}>
        허용 or 거부
      </text>
      <line x1="170" y1="58" x2="280" y2="98" stroke={C.blue} strokeWidth="1.6" />
      <line x1="170" y1="158" x2="280" y2="122" stroke={C.amber} strokeWidth="1.6" />
      <line x1="450" y1="110" x2="530" y2="110" stroke={C.teal} strokeWidth="1.6" />
      <text x="490" y="100" textAnchor="middle" fontSize="9.5" fill={C.teal} fontWeight="700">
        Allow ∪ &amp; ¬Deny
      </text>
      <text x="20" y="215" fontSize="11" fontWeight="600" fill={C.ink}>
        퍼블릭 공개 = 버킷 정책 Allow + Block Public Access 해제, 둘 다 필요
      </text>
    </svg>
  );
}

function PolicySection() {
  return (
    <Sec
      num="02"
      title="S3 보안 · 버킷 정책"
      sub="정책 평가 로직과 크로스 계정이 핵심"
      freq="hi"
      freqLabel="최빈출 ★★★ · 거의 매 시험"
    >
      <P>
        S3 접근 제어는 <b>사용자 기반(IAM 정책)</b>과 <b>리소스 기반(버킷 정책, ACL)</b>으로
        나뉩니다. ACL은 현재 기본 비활성화가 권장되며, 시험의 중심은 <b>버킷 정책</b>입니다.
      </P>

      <Fig caption="같은 계정에서는 IAM 정책과 버킷 정책의 Allow가 합집합으로 평가되고, 명시적 Deny가 하나라도 있으면 무조건 거부된다.">
        <PolicySvg />
      </Fig>

      <P>
        접근 허용 조건: <b>(IAM 허용 OR 버킷 정책 허용) AND 명시적 Deny 없음</b>. 버킷 정책은
        JSON이며 IAM 정책과 달리 <Code>Principal</Code> 필드(누가)를 가집니다 — 주요 용도는 ①
        퍼블릭 공개 ② 업로드 암호화 강제 ③ <b>교차 계정(Cross-Account) 접근 허용</b>.
      </P>
      <CodeBlock>{`{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicRead",
    "Effect": "Allow",
    "Principal": "*",
    "Action": ["s3:GetObject"],
    "Resource": ["arn:aws:s3:::my-bucket/*"]
  }]
}`}</CodeBlock>

      <SubTitle>Block Public Access (BPA)</SubTitle>
      <P>
        정책과 무관하게 퍼블릭 공개를 차단하는 안전장치로, <b>4개 설정</b>을 버킷·액세스
        포인트·<b>계정 수준</b>에 적용할 수 있습니다. 켜져 있으면 버킷 정책으로 퍼블릭을 허용해도
        절대 공개되지 않습니다.
      </P>
      <Note>
        EC2에서 S3에 접근할 때는 액세스 키를 코드에 넣지 말고 <b>IAM 역할(인스턴스
        프로파일)</b>을 사용합니다 — 표준 보안 관행.
      </Note>

      <ExamPoint>
        <ExamLi>
          &ldquo;버킷 정책을 열었는데도 접근 불가&rdquo; → <b>Block Public Access 확인</b>.
        </ExamLi>
        <ExamLi>
          &ldquo;다른 계정 IAM 사용자에게 접근 허용&rdquo; → <b>버킷 정책</b>(Principal 지정).
        </ExamLi>
        <ExamLi>
          &ldquo;회사 데이터가 절대 공개되면 안 된다&rdquo; → <b>계정 수준 BPA 4개 설정 모두
          켜기</b>.
        </ExamLi>
      </ExamPoint>
    </Sec>
  );
}

/* ── 03 정적 웹사이트 ─────────────────────────────────────────────── */

function WebsiteSection() {
  return (
    <Sec
      num="03"
      title="S3 정적 웹사이트"
      sub="엔드포인트 형식과 403 트러블슈팅"
      freq="lo"
      freqLabel="보통 ★☆☆ · 403 시나리오 위주"
    >
      <P>
        S3는 정적 콘텐츠(HTML/CSS/JS/이미지)를 서버 없이 웹사이트로 호스팅합니다. 인덱스
        문서·에러 문서를 지정하며, 엔드포인트는 리전에 따라 두 형식이 있습니다:
      </P>
      <P>
        <Code>bucket.s3-website-리전.amazonaws.com</Code> (대시) 또는{" "}
        <Code>bucket.s3-website.리전.amazonaws.com</Code> (점).
      </P>
      <ExamPoint>
        <ExamLi>
          <b>403 Forbidden</b> → ① 계정/버킷의 <b>Block Public Access 해제</b> ② 버킷 정책으로{" "}
          <Code>s3:GetObject</Code>를 <Code>&quot;*&quot;</Code>에 허용 — 콘텐츠 전체가 퍼블릭
          읽기 가능해야 서비스된다.
        </ExamLi>
        <ExamLi>정적 웹사이트 + CORS 조합 문제(13절)도 자주 나온다.</ExamLi>
      </ExamPoint>
    </Sec>
  );
}

/* ── 04 버전 관리 ─────────────────────────────────────────────────── */

function VersioningSection() {
  return (
    <Sec
      num="04"
      title="S3 버전 관리"
      sub="Delete Marker 동작과 null 버전"
      freq="mid"
      freqLabel="빈출 ★★☆ · 복구 시나리오 단골"
    >
      <P>
        <b>버킷 수준</b>에서 활성화하며, 같은 Key로 덮어쓸 때마다 새 버전이 쌓입니다. 의도치 않은
        삭제·덮어쓰기로부터 보호하고 이전 상태로 롤백할 수 있어 사실상 모든 버킷에 권장됩니다.
      </P>
      <Table
        head={["동작", "결과"]}
        rows={[
          [
            "활성화 이전 객체",
            <>
              버전 ID가 <Code>null</Code>
            </>,
          ],
          [
            "삭제",
            <>
              실제 삭제가 아니라 <b>삭제 마커(Delete Marker)</b> 추가 — 삭제 마커를 지우면 객체가
              &ldquo;복원&rdquo;된다
            </>,
          ],
          [
            "특정 버전 ID 지정 삭제",
            <>
              <b>영구 삭제</b>
            </>,
          ],
          [
            "중단(Suspend)",
            <>
              기존 버전은 그대로 유지, 이후 업로드만 null 버전 — 한번 활성화하면 unversioned로
              되돌릴 수 없고 suspend만 가능
            </>,
          ],
        ]}
      />
      <ExamPoint>
        <ExamLi>
          &ldquo;실수로 삭제한 파일 복구&rdquo; → 버전 관리 + <b>삭제 마커 제거</b>.
        </ExamLi>
        <ExamLi>
          버전 관리는 <b>MFA Delete·복제(Replication)의 전제 조건</b> — 연계 출제된다.
        </ExamLi>
      </ExamPoint>
    </Sec>
  );
}

/* ── 05 복제 ──────────────────────────────────────────────────────── */

function ReplicationSvg() {
  return (
    <svg viewBox="0 0 700 190" style={{ width: "100%", height: "auto" }} role="img">
      <rect x="30" y="45" width="200" height="72" rx="12" fill={C.tealSoft} stroke={C.teal} strokeWidth="1.5" />
      <text x="130" y="76" textAnchor="middle" fontSize="12.5" fontWeight="800" fill={C.teal}>
        원본 버킷
      </text>
      <text x="130" y="96" textAnchor="middle" fontSize="10" fill={C.inkSoft}>
        ap-northeast-2 · 버전 관리 ON
      </text>
      <rect x="470" y="45" width="200" height="72" rx="12" fill={C.tealSoft} stroke={C.teal} strokeWidth="1.5" />
      <text x="570" y="76" textAnchor="middle" fontSize="12.5" fontWeight="800" fill={C.teal}>
        대상 버킷
      </text>
      <text x="570" y="96" textAnchor="middle" fontSize="10" fill={C.inkSoft}>
        us-east-1 · 버전 관리 ON
      </text>
      <line x1="230" y1="81" x2="470" y2="81" stroke={C.amber} strokeWidth="2" />
      <text x="350" y="70" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.amberText}>
        비동기 복제 (IAM 역할 필요 · 다른 계정도 가능)
      </text>
      <text x="30" y="150" fontSize="11" fill={C.ink}>
        CRR(교차 리전): 규정 준수 · 지연 단축 · 계정 간 — SRR(동일 리전): 로그 집계 · 운영↔테스트
      </text>
      <text x="30" y="174" fontSize="11" fontWeight="700" fill={C.red}>
        활성화 이후 새 객체만 복제 (기존 객체 = S3 Batch Replication) · 체이닝 불가(1→2→3 ✗)
      </text>
    </svg>
  );
}

function ReplicationSection() {
  return (
    <Sec
      num="05"
      title="S3 복제 (CRR / SRR)"
      sub="버전 관리 전제 · 기존 객체 미복제 · 체이닝 불가"
      freq="mid"
      freqLabel="빈출 ★★☆ · 3대 함정이 그대로 선지"
    >
      <P>
        버킷 간 객체를 <b>비동기</b>로 자동 복사합니다. 교차 리전(CRR)과 동일 리전(SRR)이 있고,
        다른 AWS 계정 간에도 가능합니다. 필수 조건은 <b>원본·대상 버킷 모두 버전 관리 활성화</b> +
        S3에 부여하는 <b>IAM 역할</b>입니다.
      </P>
      <Fig caption="CRR/SRR 복제 — 양쪽 버전 관리 필수, 복제는 비동기.">
        <ReplicationSvg />
      </Fig>
      <WarnBox>
        복제의 3대 함정: ① 활성화 <b>이후 새 객체만</b> 복제 — 기존 객체·복제 실패분은{" "}
        <b>S3 Batch Replication</b> ② <b>체이닝 불가</b> — 1→2, 2→3을 설정해도 1의 객체가 3으로
        자동 전파되지 않음 ③ <b>삭제 마커 복제는 옵션</b>이고, <b>버전 ID를 지정한 영구 삭제는
        복제되지 않음</b>(악의적 삭제 전파 방지).
      </WarnBox>
      <ExamPoint>
        <ExamLi>&ldquo;버전 관리 필수&rdquo;, &ldquo;기존 객체는 Batch Replication&rdquo;, &ldquo;체이닝 불가&rdquo; — 복제 문제의 핵심 선지 3종.</ExamLi>
      </ExamPoint>
    </Sec>
  );
}

/* ── 06 스토리지 클래스 ───────────────────────────────────────────── */

function StorageClassSection() {
  return (
    <Sec
      num="06"
      title="S3 스토리지 클래스"
      sub="용도·검색 속도·최소 저장 기간"
      freq="hi"
      freqLabel="최빈출 ★★★ · 시나리오 매칭"
    >
      <P>
        <b>내구성(Durability)은 모든 클래스에서 11-nine(99.999999999%)으로 동일</b>합니다. 차이는
        가용성·검색 시간·최소 저장 기간·비용입니다. 객체 생성 시 선택하거나 수명 주기 규칙으로
        전환합니다.
      </P>
      <Table
        head={["클래스", "가용성", "최소 기간", "특징 · 사용 예"]}
        rows={[
          ["Standard", "99.99%", "—", "즉시 접근, 검색 비용 없음 — 빅데이터, 콘텐츠 배포"],
          [
            "Standard-IA",
            "99.9%",
            "30일",
            "저렴한 저장 + 검색 비용 — 백업, 재해 복구",
          ],
          [
            "One Zone-IA",
            "99.5%",
            "30일",
            <>
              <b>단일 AZ</b> — AZ 파괴 시 유실. 재생성 가능한 사본·2차 백업용
            </>,
          ],
          [
            "Intelligent-Tiering",
            "99.9%",
            "—",
            "접근 패턴 따라 자동 계층 이동, 검색 비용 없음, 소액 모니터링 비용(128KB 미만은 미모니터링)",
          ],
          [
            "Glacier Instant Retrieval",
            "99.9%",
            "90일",
            "밀리초 검색 — 분기 1회 접근 데이터",
          ],
          [
            "Glacier Flexible Retrieval",
            "99.99%*",
            "90일",
            <>
              신속 1~5분 / 표준 3~5시간 / 대량 5~12시간(<b>무료</b>)
            </>,
          ],
          [
            "Glacier Deep Archive",
            "99.99%*",
            "180일",
            <>
              표준 12시간 / 대량 48시간 — <b>최저가</b>, 신속 검색 미지원
            </>,
          ],
        ]}
      />
      <Note>
        * 복원 후 기준. 가용성 수치보다 &ldquo;검색 시간·최소 보관 기간·단일 AZ 여부&rdquo;가 시험
        포인트입니다.
      </Note>
      <ExamPoint>
        <ExamLi>&ldquo;복원 없이 즉시 접근 + 아카이브 가격&rdquo; → Glacier Instant Retrieval.</ExamLi>
        <ExamLi>&ldquo;손실돼도 재생성 가능한 데이터의 저비용 보관&rdquo; → One Zone-IA.</ExamLi>
        <ExamLi>&ldquo;접근 패턴 불명 + 운영 부담 최소화&rdquo; → Intelligent-Tiering.</ExamLi>
        <ExamLi>&ldquo;7년 규정 보관, 거의 안 봄&rdquo; → Glacier Deep Archive. 검색 시간·최소 기간(30/90/180일) 암기.</ExamLi>
      </ExamPoint>
    </Sec>
  );
}

/* ── 07 수명 주기 ─────────────────────────────────────────────────── */

function LifecycleSection() {
  return (
    <Sec
      num="07"
      title="수명 주기 규칙 + S3 Analytics"
      sub="Transition/Expiration 구분과 Analytics 적용 범위"
      freq="mid"
      freqLabel="빈출 ★★☆ · 비용 절감 시나리오"
    >
      <P>
        객체를 자동으로 다른 클래스로 <b>전환(Transition)</b>하거나 <b>만료(Expiration,
        삭제)</b>시키는 규칙입니다. prefix(<Code>s3://bucket/mp3/*</Code>)나 객체 태그로 적용
        범위를 좁힐 수 있습니다.
      </P>
      <Table
        head={["액션", "예시"]}
        rows={[
          ["Transition", "생성 60일 후 Standard-IA로, 6개월 후 Glacier로 이동"],
          [
            "Expiration",
            <>
              365일 후 액세스 로그 삭제 · <b>이전 버전 삭제</b> · <b>미완료 멀티파트 업로드
              정리</b>(AbortIncompleteMultipartUpload) · 오래된 삭제 마커 제거
            </>,
          ],
        ]}
      />
      <P>
        대표 설계 시나리오 — &ldquo;삭제 후 30일 내 즉시 복구 + 이후 1년까지 48시간 내
        복구&rdquo;: 버전 관리 활성화 + <b>이전 버전</b>을 30일 후 Standard-IA로, 이후 Glacier
        Deep Archive로 전환.
      </P>
      <P>
        <b>S3 Analytics(스토리지 클래스 분석)</b>: <b>Standard → Standard-IA 전환 추천만</b>{" "}
        제공합니다(One Zone-IA·Glacier 미지원). 리포트(CSV)는 활성화 24~48시간 후부터 매일
        갱신 — 수명 주기 규칙 수립의 근거로 활용합니다.
      </P>
      <ExamPoint>
        <ExamLi>&ldquo;미완료 멀티파트 업로드로 저장 비용이 샌다&rdquo; → 수명 주기 규칙으로 자동 정리.</ExamLi>
        <ExamLi>S3 Analytics는 Glacier 전환을 추천하지 못한다 — Standard↔Standard-IA만.</ExamLi>
        <ExamLi>버전 관리 + 수명 주기를 조합한 복구 설계 문제가 자주 나온다.</ExamLi>
      </ExamPoint>
    </Sec>
  );
}

/* ── 08 이벤트 알림 ───────────────────────────────────────────────── */

function EventsSection() {
  return (
    <Sec
      num="08"
      title="S3 이벤트 알림"
      sub="대상의 리소스 정책과 EventBridge 통합"
      freq="mid"
      freqLabel="빈출 ★★☆ · 권한 방식이 함정"
    >
      <P>
        <Code>s3:ObjectCreated:*</Code>, <Code>s3:ObjectRemoved:*</Code>, 복원·복제 이벤트 등을{" "}
        <b>SNS·SQS·Lambda</b>로 전달합니다. 대표 사례: 이미지 업로드 → Lambda로 썸네일 자동 생성.
        객체 이름 필터링(prefix/suffix, 예: <Code>*.jpg</Code>)이 가능하며, 전달은 보통 수초 내지만
        1분 이상 걸릴 수도 있습니다.
      </P>
      <P>
        <b>권한 방식이 시험 포인트</b>: S3가 대상에 게시하려면 IAM 역할이 아니라 <b>대상 측
        리소스(액세스) 정책</b>(SNS/SQS Access Policy, Lambda Resource Policy)에서 S3를 허용해야
        합니다.
      </P>
      <P>
        <b>Amazon EventBridge 통합</b>: 모든 S3 이벤트가 자동 전달되며 ① 메타데이터·객체
        크기·이름 기반 <b>고급 JSON 필터링</b> ② <b>18개 이상 서비스</b>(Step Functions, Kinesis
        등)로 전달 ③ 아카이브·재생(Replay) 지원.
      </P>
      <Note>SQS FIFO 큐는 S3 이벤트 알림의 직접 대상이 될 수 없다 — EventBridge를 경유한다.</Note>
      <ExamPoint>
        <ExamLi>&ldquo;업로드 시 자동 처리&rdquo; → S3 이벤트 + Lambda.</ExamLi>
        <ExamLi>&ldquo;알림이 안 온다&rdquo; → 대상의 리소스 정책 확인 (IAM 역할 아님).</ExamLi>
        <ExamLi>&ldquo;Step Functions/Kinesis로 전달, 이벤트 재생 필요&rdquo; → EventBridge.</ExamLi>
      </ExamPoint>
    </Sec>
  );
}

/* ── 09 퍼포먼스 ──────────────────────────────────────────────────── */

function PerformanceSection() {
  return (
    <Sec
      num="09"
      title="S3 퍼포먼스"
      sub="기준 성능 수치와 3가지 최적화 기법"
      freq="hi"
      freqLabel="최빈출 ★★★ · 수치 암기 필수"
    >
      <P>
        기준 성능: <b>prefix당 초당 3,500 PUT/COPY/POST/DELETE · 5,500 GET/HEAD</b>. prefix 수는
        무제한이므로 여러 prefix에 분산하면 그만큼 확장됩니다.
      </P>
      <Table
        head={["기법", "동작", "사용 시점"]}
        rows={[
          [
            "멀티파트 업로드",
            "파일을 파트로 쪼개 병렬 업로드",
            <>
              <b>100MB 이상 권장, 5GB 초과 필수</b>
            </>,
          ],
          [
            "Transfer Acceleration",
            "가까운 엣지 로케이션 경유 → AWS 백본으로 고속 전송",
            "지리적으로 먼 리전과의 업로드·다운로드 모두. 멀티파트와 병행 가능",
          ],
          [
            "Byte-Range Fetch",
            "특정 바이트 범위를 병렬 GET",
            "다운로드 가속 + 실패 범위만 재시도(복원력↑) + 파일 앞부분(헤더)만 부분 조회",
          ],
        ]}
      />
      <ExamPoint>
        <ExamLi>&ldquo;멀리 떨어진 사용자의 업로드가 느리다&rdquo; → Transfer Acceleration (+멀티파트).</ExamLi>
        <ExamLi>&ldquo;대용량 다운로드 병렬화/부분 조회&rdquo; → Byte-Range Fetch.</ExamLi>
        <ExamLi>3,500 / 5,500 수치를 그대로 묻는 문제가 있다 — 암기.</ExamLi>
      </ExamPoint>
    </Sec>
  );
}

/* ── 10 태그 & 메타데이터 ─────────────────────────────────────────── */

function TagsSection() {
  return (
    <Sec
      num="10"
      title="객체 태그 & 메타데이터"
      sub="직접 검색 불가 — 외부 인덱스 패턴"
      freq="lo"
      freqLabel="가끔 ★☆☆ · 함정 선지로 등장"
    >
      <P>
        <b>사용자 정의 메타데이터</b>는 반드시 <Code>x-amz-meta-</Code> 접두사의 key-value로
        지정하며 객체와 함께 저장·반환됩니다(업로드 후 수정 불가 — 복사로만 변경).{" "}
        <b>객체 태그</b>는 객체당 최대 10개로 세분화된 권한 제어·분석·수명 주기 필터에 씁니다.
      </P>
      <WarnBox>
        <b>메타데이터·태그로 객체를 직접 검색/필터링할 수 없다!</b> 태그·메타데이터로 객체를
        찾아야 한다면 DynamoDB 같은 외부 DB에 인덱스를 구축하는 것이 정석 패턴.
      </WarnBox>
      <Note>
        부기: 최근 쿼리 가능한 메타데이터 테이블을 제공하는 S3 Metadata 기능이 추가됐지만, 시험
        기준 정답 패턴은 여전히 &ldquo;외부 인덱스(DynamoDB)&rdquo;입니다.
      </Note>
      <ExamPoint>
        <ExamLi>&ldquo;태그로 객체를 검색하려면?&rdquo; → 불가능, DynamoDB 인덱스 구축 — 이 함정이 그대로 출제된다.</ExamLi>
      </ExamPoint>
    </Sec>
  );
}

/* ── 11 암호화 ────────────────────────────────────────────────────── */

function EncryptionSvg() {
  return (
    <svg viewBox="0 0 700 150" style={{ width: "100%", height: "auto" }} role="img">
      <rect x="15" y="25" width="160" height="70" rx="10" fill={C.tealSoft} stroke={C.teal} strokeWidth="1.5" />
      <text x="95" y="52" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.teal}>
        SSE-S3 (기본값)
      </text>
      <text x="95" y="72" textAnchor="middle" fontSize="9.5" fill={C.inkSoft}>
        S3 관리 키 · AES-256
      </text>
      <rect x="190" y="25" width="160" height="70" rx="10" fill={C.amberSoft} stroke={C.amber} strokeWidth="1.5" />
      <text x="270" y="52" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.amberText}>
        SSE-KMS
      </text>
      <text x="270" y="72" textAnchor="middle" fontSize="9.5" fill={C.inkSoft}>
        KMS 키 · CloudTrail 감사
      </text>
      <rect x="365" y="25" width="160" height="70" rx="10" fill={C.redSoft} stroke={C.red} strokeWidth="1.5" />
      <text x="445" y="52" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.red}>
        SSE-C
      </text>
      <text x="445" y="72" textAnchor="middle" fontSize="9.5" fill={C.inkSoft}>
        고객 제공 키 · HTTPS 필수
      </text>
      <rect x="540" y="25" width="145" height="70" rx="10" fill={C.blueSoft} stroke={C.blue} strokeWidth="1.5" />
      <text x="612" y="52" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.blue}>
        DSSE-KMS
      </text>
      <text x="612" y="72" textAnchor="middle" fontSize="9.5" fill={C.inkSoft}>
        KMS 이중 암호화 (2023)
      </text>
      <text x="15" y="130" fontSize="10.5" fontFamily="monospace" fill={C.inkSoft}>
        x-amz-server-side-encryption: AES256 | aws:kms | aws:kms:dsse
      </text>
    </svg>
  );
}

function EncryptionSection() {
  return (
    <Sec
      num="11"
      title="S3 암호화"
      sub="SSE 4종 + 클라이언트 측 — 키 소유와 암호화 위치로 구분"
      freq="hi"
      freqLabel="최빈출 ★★★ · S3 최다 출제 주제"
    >
      <P>
        <b>누가 키를 소유하고, 어디서 암호화가 일어나는지</b>로 구분하면 헷갈리지 않습니다.
      </P>
      <Fig caption="서버 측 암호화 4종. 헤더 값 3종(AES256 / aws:kms / aws:kms:dsse) 구분이 출제된다.">
        <EncryptionSvg />
      </Fig>
      <Table
        head={["방식", "키 관리", "헤더", "핵심 포인트"]}
        rows={[
          [
            "SSE-S3",
            "AWS(S3) 소유·관리",
            <Code>AES256</Code>,
            <>
              AES-256, 신규 버킷·객체 <b>기본값</b>
            </>,
          ],
          [
            "SSE-KMS",
            "KMS 키 (직접 관리 가능)",
            <Code>aws:kms</Code>,
            <>
              키 사용 제어 + <b>CloudTrail 감사</b>. 업/다운로드 시 KMS API 호출 → 쿼터 스로틀링
              주의
            </>,
          ],
          [
            "DSSE-KMS",
            "KMS 키",
            <Code>aws:kms:dsse</Code>,
            <>
              KMS 기반 <b>이중(2겹) 암호화</b> — 2023년 추가, S3 Bucket Key 미지원
            </>,
          ],
          [
            "SSE-C",
            "고객이 외부에서 관리",
            "매 요청 헤더로 키 전달",
            <>
              <b>HTTPS 필수</b>, S3는 키를 저장하지 않음 — 다운로드 시에도 같은 키 제공 필요
            </>,
          ],
          [
            "클라이언트 측",
            "고객 (S3 밖)",
            "—",
            "업로드 전 암호화·다운로드 후 복호화 전 과정을 고객이 수행",
          ],
        ]}
      />

      <SubTitle>SSE-KMS의 함정 — KMS 쿼터</SubTitle>
      <P>
        객체를 쓰고 읽을 때마다 KMS의 <Code>GenerateDataKey</Code>·<Code>Decrypt</Code>가 호출되어{" "}
        <b>KMS 요청 쿼터</b>(리전·키 유형별로 상이, 조정 가능)를 소모합니다 — 대량 업/다운로드 시
        ThrottlingException 가능. 해결책: <b>S3 Bucket Key</b>(버킷 수준 키 재사용으로 KMS 호출
        최대 99% 감소) 또는 Service Quotas 한도 상향.
      </P>

      <SubTitle>전송 중 암호화 (SSL/TLS)</SubTitle>
      <P>
        HTTP·HTTPS 엔드포인트가 모두 있지만 HTTPS가 권장이며 <b>SSE-C는 HTTPS만 가능</b>합니다.
        HTTPS를 강제하려면 버킷 정책에서 <Code>aws:SecureTransport = false</Code>인 요청을{" "}
        <b>Deny</b>합니다 — 공식 버킷 정책 예시 패턴.
      </P>
      <Note>
        부기: 2026-04부터 신규 버킷은 SSE-C가 기본 차단된다(PutBucketEncryption으로 명시 활성화
        필요).
      </Note>

      <ExamPoint>
        <ExamLi>&ldquo;감사 추적 + 키 제어&rdquo; → SSE-KMS.</ExamLi>
        <ExamLi>&ldquo;키를 AWS에 저장 금지, 외부에서 완전 관리&rdquo; → SSE-C 또는 클라이언트 측.</ExamLi>
        <ExamLi>&ldquo;대량 업로드 시 KMS 스로틀링&rdquo; → S3 Bucket Key 또는 쿼터 상향.</ExamLi>
        <ExamLi>&ldquo;전송 중 암호화 강제&rdquo; → aws:SecureTransport=false Deny. 헤더 값 3종 구분.</ExamLi>
      </ExamPoint>
    </Sec>
  );
}

/* ── 12 기본 암호화 ───────────────────────────────────────────────── */

function DefaultEncryptionSection() {
  return (
    <Sec
      num="12"
      title="S3 기본 암호화"
      sub="자동 SSE-S3와 암호화 강제 패턴"
      freq="lo"
      freqLabel="보통 ★☆☆ · 강제 패턴이 포인트"
    >
      <P>
        2023년 1월부터 <b>모든 새 객체는 자동으로 SSE-S3 암호화</b>됩니다(기존 객체 소급 없음).
        버킷 기본값을 SSE-KMS 등으로 바꿀 수 있으며, 헤더 없이 업로드하면 기본 설정이 적용됩니다.
      </P>
      <P>
        특정 방식을 <b>강제</b>하려면 버킷 정책에서 <Code>x-amz-server-side-encryption</Code> 헤더가
        없거나 다른 값인 PUT을 <b>명시적으로 Deny</b>합니다 — SSE-KMS·DSSE 강제의 공식 정책 예시
        패턴입니다.
      </P>
      <ExamPoint>
        <ExamLi>
          &ldquo;업로드를 특정 암호화 방식으로만 받으려면&rdquo; → 버킷 정책의 암호화 헤더 불일치
          PUT Deny 패턴.
        </ExamLi>
      </ExamPoint>
    </Sec>
  );
}

/* ── 13 CORS ─────────────────────────────────────────────────────── */

function CorsSection() {
  return (
    <Sec
      num="13"
      title="S3 CORS"
      sub="preflight와 설정 위치(요청받는 쪽)"
      freq="mid"
      freqLabel="빈출 ★★☆ · DVA 단골"
    >
      <P>
        CORS는 <b>브라우저의 보안 메커니즘</b>으로, 웹페이지의 오리진과 다른 오리진의 자원 요청을
        통제합니다. <b>오리진 = scheme(프로토콜) + host(도메인) + port</b> — 하나라도 다르면 교차
        오리진입니다.
      </P>
      <P>
        브라우저는 먼저 <b>preflight(OPTIONS) 요청</b>에 <Code>Origin</Code> 헤더를 담아 보내고,
        S3가 <Code>Access-Control-Allow-Origin</Code>/<Code>-Methods</Code>로 허용해야 실제 요청을
        보냅니다. 허용 대상은 특정 오리진 하나 또는 <Code>*</Code>이며, CORS 구성은 JSON으로 버킷에
        등록합니다.
      </P>
      <ExamPoint>
        <ExamLi>
          <b>&ldquo;요청을 받는 쪽 버킷에 CORS를 설정한다&rdquo;</b>가 정답 포인트 — 웹사이트 버킷
          A가 버킷 B의 이미지를 fetch하면 CORS는 B에.
        </ExamLi>
      </ExamPoint>
    </Sec>
  );
}

/* ── 14 MFA Delete ───────────────────────────────────────────────── */

function MfaDeleteSection() {
  return (
    <Sec
      num="14"
      title="S3 MFA Delete"
      sub="버전 관리 전제 · 루트 전용 · 콘솔 불가"
      freq="lo"
      freqLabel="보통 ★☆☆ · 조건 3종 세트"
    >
      <P>
        파괴적 작업에 MFA 코드를 요구해 실수·악의적 삭제를 막습니다.
      </P>
      <Table
        head={["구분", "내용"]}
        rows={[
          ["MFA 필요", "객체 버전 영구 삭제 · 버전 관리 중단(Suspend)"],
          ["MFA 불필요", "버전 관리 활성화 · 삭제 마커 추가(일반 삭제) · 버전 목록 조회"],
          [
            "전제·설정",
            <>
              버전 관리 활성화 버킷 · <b>루트 계정만</b> 활성/비활성 가능 · 콘솔이 아닌{" "}
              <b>CLI/SDK/API로만</b> 설정
            </>,
          ],
        ]}
      />
      <ExamPoint>
        <ExamLi>&ldquo;MFA Delete를 활성화하려면?&rdquo; → 루트 사용자 + CLI/API + 버전 관리 ON. 콘솔 설정 불가 함정 주의.</ExamLi>
      </ExamPoint>
    </Sec>
  );
}

/* ── 15 액세스 로그 ───────────────────────────────────────────────── */

function AccessLogsSection() {
  return (
    <Sec
      num="15"
      title="S3 액세스 로그"
      sub="같은 리전·같은 계정 + 무한 루프 금지"
      freq="lo"
      freqLabel="가끔 ★☆☆ · 무한 루프 함정"
    >
      <P>
        감사 목적으로 버킷에 대한 <b>모든 요청(허용·거부 불문)</b>을 다른 S3 버킷에 기록합니다.
        Athena 등으로 분석할 수 있으며, 로깅 대상 버킷과 로깅 버킷은 <b>같은 리전·같은 계정</b>
        이어야 합니다.
      </P>
      <WarnBox>
        로깅 버킷을 모니터링 대상 버킷과 동일하게 설정 금지 — 로그가 로그를 낳는 <b>무한 루프</b>로
        스토리지 요금이 폭증한다. 반드시 별도 버킷 사용.
      </WarnBox>
    </Sec>
  );
}

/* ── 16 Presigned URL ────────────────────────────────────────────── */

function PresignedSection() {
  return (
    <Sec
      num="16"
      title="미리 서명된 URL (Presigned URL)"
      sub="생성자 권한 상속 · 만료 시간"
      freq="hi"
      freqLabel="최빈출 ★★★ · 임시 접근의 정답"
    >
      <P>
        버킷을 프라이빗으로 유지하면서 특정 객체에 임시 접근(GET=다운로드, PUT=업로드)을 부여하는
        서명 링크입니다. URL을 받은 사람은 <b>URL을 생성한 주체의 권한을 상속</b>합니다 — IAM
        사용자를 새로 만들 필요가 없다는 것이 핵심 이점.
      </P>
      <Table
        head={["생성 경로", "만료"]}
        rows={[
          ["SDK / CLI 기본값", "3600초 (1시간)"],
          ["콘솔", "최대 12시간"],
          [
            "CLI --expires-in",
            <>
              최대 <b>604,800초 = 7일(168시간)</b>
            </>,
          ],
        ]}
      />
      <P>
        사용 예: 프리미엄 동영상을 로그인 사용자에게만 제공 · 계속 바뀌는 사용자 목록에 URL을
        동적으로 생성 · 특정 위치로의 임시 업로드 허용.
      </P>
      <ExamPoint>
        <ExamLi>&ldquo;버킷은 비공개 유지 + 특정 사용자에게 임시 다운로드/업로드 허용&rdquo; → Presigned URL. 매우 자주 출제.</ExamLi>
      </ExamPoint>
    </Sec>
  );
}

/* ── 17 액세스 포인트 ─────────────────────────────────────────────── */

function AccessPointSection() {
  return (
    <Sec
      num="17"
      title="S3 액세스 포인트"
      sub="용도별 정책 분리 + VPC Origin"
      freq="lo"
      freqLabel="보통 ★☆☆ · 대규모 접근 관리"
    >
      <P>
        버킷 하나에 팀·용도별 접근 규칙이 늘어나 버킷 정책이 비대해질 때, <b>액세스 포인트별
        정책</b>으로 관리를 분리·단순화합니다. 각 액세스 포인트는 자체 <b>DNS 이름</b>과{" "}
        <b>정책</b>(버킷 정책과 유사)을 가집니다 — 예: <Code>/finance</Code> 읽기·쓰기 AP,{" "}
        <Code>/analytics</Code> 전체 읽기 전용 AP.
      </P>
      <P>
        Origin 유형: 인터넷 또는 <b>VPC</b>. VPC Origin이면 <b>VPC 엔드포인트</b>(Gateway 또는
        Interface)를 만들어야만 접근 가능하고, 엔드포인트 정책에서 대상 버킷·AP 접근을 허용해야
        합니다.
      </P>
    </Sec>
  );
}

/* ── 18 Object Lambda ────────────────────────────────────────────── */

function ObjectLambdaSection() {
  return (
    <Sec
      num="18"
      title="S3 Object Lambda"
      sub="반환 직전 변환 — 원본은 하나만"
      freq="lo"
      freqLabel="보통 ★☆☆ · 구성 순서 문제"
    >
      <P>
        객체를 호출자에게 반환하기 <b>직전에 Lambda로 변환</b>합니다. 변환본을 위한 별도 버킷
        복제가 필요 없습니다. 구성 순서:{" "}
        <b>S3 버킷 → (지원) 액세스 포인트 → Object Lambda 액세스 포인트 → Lambda → 애플리케이션</b>.
      </P>
      <P>
        사용 예: 분석 환경용 <b>PII 마스킹/삭제</b> · XML→JSON 등 <b>포맷 변환</b> · 요청자별{" "}
        <b>이미지 리사이즈·워터마크</b> · 다른 소스 정보를 합치는 <b>데이터 보강</b>. GET 외에
        HEAD·LIST 요청 변환도 지원합니다.
      </P>
      <ExamPoint>
        <ExamLi>&ldquo;원본 하나만 두고 애플리케이션마다 다른 형태로 제공&rdquo; → Object Lambda가 정답 키워드.</ExamLi>
      </ExamPoint>
    </Sec>
  );
}
