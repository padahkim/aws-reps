import type { ReactNode } from "react";
import { C } from "../ui";

/** 챕터 도식 SVG + 챕터 로컬 컴포넌트 (규약 v3) — sections/*.mdx 가 import 한다. 내용은 body.tsx 시절 그대로. */

export const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

/** JSON/정책 예시 블록 — 잉크 배경 카드 (전역 셀렉터 없이 인라인 스타일만). */
export function CodeBlock({ children }: { children: string }) {
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
export function WarnBox({ children }: { children: ReactNode }) {
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

export function OverviewSvg() {
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

export function PolicySvg() {
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

export function ReplicationSvg() {
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

export function EncryptionSvg() {
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
