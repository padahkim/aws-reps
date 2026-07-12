// fable5 high
import React, { useState } from "react";

/* ─────────────────────────  DESIGN TOKENS  ───────────────────────── */
const C = {
  bg: "#10151D",
  panel: "#1A2230",
  panelSoft: "#202A3B",
  line: "#2E3B50",
  text: "#E9EDF3",
  sub: "#9AA7BA",
  orange: "#FF9900", // AWS accent
  blue: "#5CA8FF", // DB / network
  teal: "#3FD0C9", // cache
  green: "#6BCB77", // ok / sync
  red: "#FF6B6B", // failure / warning
  purple: "#B98BFF", // aurora
  yellow: "#FFD166",
};

const mono = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";

/* ─────────────────────────  SMALL UI PARTS  ───────────────────────── */
const Freq = ({ n, label }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
    <span style={{ letterSpacing: 2, color: C.orange, fontSize: 13 }}>
      {"★".repeat(n)}
      <span style={{ color: "#3A4a63" }}>{"★".repeat(5 - n)}</span>
    </span>
    {label && <span style={{ fontSize: 12, color: C.sub }}>{label}</span>}
  </span>
);

const Pill = ({ children, color = C.orange }) => (
  <span
    style={{
      fontSize: 11,
      fontFamily: mono,
      color,
      border: `1px solid ${color}55`,
      background: `${color}14`,
      borderRadius: 99,
      padding: "2px 10px",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </span>
);

const H2 = ({ children }) => (
  <h2
    style={{
      fontSize: 17,
      fontWeight: 700,
      color: C.text,
      margin: "34px 0 12px",
      paddingBottom: 8,
      borderBottom: `1px solid ${C.line}`,
    }}
  >
    {children}
  </h2>
);

const P = ({ children, style }) => (
  <p
    style={{
      fontSize: 14.5,
      lineHeight: 1.85,
      color: "#C6CFDC",
      margin: "10px 0",
      ...style,
    }}
  >
    {children}
  </p>
);

const B = ({ children, color = C.text }) => (
  <strong style={{ color, fontWeight: 700 }}>{children}</strong>
);

const Ul = ({ items }) => (
  <ul style={{ margin: "8px 0", paddingLeft: 20 }}>
    {items.map((it, i) => (
      <li
        key={i}
        style={{
          fontSize: 14.5,
          lineHeight: 1.8,
          color: "#C6CFDC",
          margin: "7px 0",
        }}
      >
        {it}
      </li>
    ))}
  </ul>
);

const ExamTip = ({ title = "시험 포인트", children }) => (
  <div
    style={{
      border: `1px solid ${C.orange}55`,
      background: `${C.orange}0E`,
      borderRadius: 10,
      padding: "14px 16px",
      margin: "16px 0",
    }}
  >
    <div
      style={{
        fontFamily: mono,
        fontSize: 12,
        color: C.orange,
        marginBottom: 6,
      }}
    >
      ▲ {title}
    </div>
    <div style={{ fontSize: 14, lineHeight: 1.8, color: "#E4D9C3" }}>
      {children}
    </div>
  </div>
);

const Note = ({ children, color = C.teal, icon = "ℹ" }) => (
  <div
    style={{
      borderLeft: `3px solid ${color}`,
      background: `${color}10`,
      borderRadius: "0 8px 8px 0",
      padding: "10px 14px",
      margin: "14px 0",
      fontSize: 14,
      lineHeight: 1.8,
      color: "#C6CFDC",
    }}
  >
    <span style={{ color, marginRight: 6 }}>{icon}</span>
    {children}
  </div>
);

const Tbl = ({ head, rows, widths }) => (
  <div
    style={{
      overflowX: "auto",
      margin: "14px 0",
      border: `1px solid ${C.line}`,
      borderRadius: 10,
    }}
  >
    <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 480 }}>
      <thead>
        <tr>
          {head.map((h, i) => (
            <th
              key={i}
              style={{
                textAlign: "left",
                fontSize: 12.5,
                fontFamily: mono,
                color: C.orange,
                background: C.panelSoft,
                padding: "10px 12px",
                borderBottom: `1px solid ${C.line}`,
                width: widths ? widths[i] : undefined,
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} style={{ background: i % 2 ? "#1D2534" : "transparent" }}>
            {r.map((c, j) => (
              <td
                key={j}
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.7,
                  color: "#C6CFDC",
                  padding: "10px 12px",
                  borderBottom:
                    i === rows.length - 1 ? "none" : `1px solid ${C.line}66`,
                  verticalAlign: "top",
                }}
              >
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Code = ({ children }) => (
  <pre
    style={{
      fontFamily: mono,
      fontSize: 12.5,
      lineHeight: 1.75,
      color: "#D7E3F4",
      background: "#0C1118",
      border: `1px solid ${C.line}`,
      borderRadius: 10,
      padding: "14px 16px",
      overflowX: "auto",
      margin: "12px 0",
      whiteSpace: "pre",
    }}
  >
    {children}
  </pre>
);

const Fig = ({ title, children, height = 320, viewBox = "0 0 760 320" }) => (
  <figure style={{ margin: "18px 0" }}>
    <div
      style={{
        background: "#0C1118",
        border: `1px solid ${C.line}`,
        borderRadius: 12,
        padding: "14px 10px 6px",
      }}
    >
      <svg
        viewBox={viewBox}
        width="100%"
        style={{ display: "block", height: "auto" }}
        role="img"
        aria-label={title}
      >
        {children}
      </svg>
    </div>
    <figcaption
      style={{
        fontFamily: mono,
        fontSize: 11.5,
        color: C.sub,
        marginTop: 8,
        textAlign: "center",
      }}
    >
      ◇ {title}
    </figcaption>
  </figure>
);

/* SVG helpers */
const Box = ({ x, y, w, h, label, sub, color = C.blue, fill, dashed }) => (
  <g>
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={8}
      fill={fill || `${color}18`}
      stroke={color}
      strokeWidth={1.4}
      strokeDasharray={dashed ? "5 4" : "none"}
    />
    <text
      x={x + w / 2}
      y={y + h / 2 + (sub ? -4 : 4)}
      textAnchor="middle"
      fontSize="13"
      fontWeight="700"
      fill={C.text}
      fontFamily="sans-serif"
    >
      {label}
    </text>
    {sub && (
      <text
        x={x + w / 2}
        y={y + h / 2 + 13}
        textAnchor="middle"
        fontSize="10.5"
        fill={C.sub}
        fontFamily={mono}
      >
        {sub}
      </text>
    )}
  </g>
);

const Arrow = ({
  x1,
  y1,
  x2,
  y2,
  color = C.sub,
  dashed,
  label,
  labelDy = -7,
  width = 1.6,
}) => {
  const mx = (x1 + x2) / 2,
    my = (y1 + y2) / 2;
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const ax = x2 - 9 * Math.cos(ang),
    ay = y2 - 9 * Math.sin(ang);
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={ax}
        y2={ay}
        stroke={color}
        strokeWidth={width}
        strokeDasharray={dashed ? "6 5" : "none"}
      />
      <polygon
        points={`${x2},${y2} ${x2 - 10 * Math.cos(ang - 0.42)},${y2 - 10 * Math.sin(ang - 0.42)} ${x2 - 10 * Math.cos(ang + 0.42)},${y2 - 10 * Math.sin(ang + 0.42)}`}
        fill={color}
      />
      {label && (
        <text
          x={mx}
          y={my + labelDy}
          textAnchor="middle"
          fontSize="11"
          fill={color}
          fontFamily={mono}
        >
          {label}
        </text>
      )}
    </g>
  );
};

const AZ = ({ x, y, w, h, name }) => (
  <g>
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={10}
      fill="none"
      stroke="#3A4a63"
      strokeWidth={1.2}
      strokeDasharray="7 5"
    />
    <text x={x + 12} y={y + 20} fontSize="11" fill={C.sub} fontFamily={mono}>
      {name}
    </text>
  </g>
);

/* ─────────────────────────  SECTION: RDS 개요  ───────────────────────── */
const SecRDS = () => (
  <div>
    <P>
      <B color={C.orange}>Amazon RDS</B>(Relational Database Service)는 AWS가
      관리해 주는 <B>관계형 데이터베이스 서비스</B>입니다. SQL을 쿼리 언어로
      사용하는 데이터베이스를 클라우드에서 직접 서버를 운영하지 않고 생성·운영할
      수 있게 해 줍니다.
    </P>

    <H2>지원 데이터베이스 엔진</H2>
    <div
      style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "10px 0" }}
    >
      {[
        "PostgreSQL",
        "MySQL",
        "MariaDB",
        "Oracle",
        "Microsoft SQL Server",
        "IBM DB2",
        "Aurora (AWS 자체 엔진)",
      ].map((e) => (
        <Pill key={e} color={e.includes("Aurora") ? C.purple : C.blue}>
          {e}
        </Pill>
      ))}
    </div>

    <H2>RDS가 "관리형(Managed)"이라는 것의 의미</H2>
    <P>
      EC2에 데이터베이스를 직접 설치하는 것과 비교해, RDS는 다음을 AWS가 대신 해
      줍니다.
    </P>
    <Ul
      items={[
        <>
          <B>자동 프로비저닝</B>과 OS 패치
        </>,
        <>
          <B>지속적인 백업</B>과 특정 시점 복원(Point in Time Restore)
        </>,
        <>모니터링 대시보드 제공</>,
        <>
          <B>읽기 전용 복제본(Read Replica)</B>으로 읽기 성능 향상
        </>,
        <>
          <B>다중 AZ(Multi-AZ)</B> 구성으로 재해 복구(DR)
        </>,
        <>유지 보수 기간(Maintenance Window)을 통한 업그레이드</>,
        <>수직 확장(인스턴스 크기)·수평 확장(복제본) 지원</>,
        <>스토리지는 EBS 기반</>,
      ]}
    />
    <Note color={C.red} icon="✕">
      단, RDS 인스턴스에는 <B color={C.red}>SSH 접속이 불가능</B>합니다. (예외:
      RDS Custom) — 시험에 자주 나오는 함정입니다.
    </Note>

    <H2>RDS 스토리지 자동 확장 (Storage Auto Scaling)</H2>
    <P>
      RDS가 스토리지 부족을 감지하면 <B>자동으로, 중단 없이</B> 스토리지를 늘려
      줍니다. 수동으로 확장할 필요가 없으며,{" "}
      <B color={C.orange}>최대 스토리지 임계값(Maximum Storage Threshold)</B>만
      설정하면 됩니다.
    </P>
    <Fig
      title="RDS Storage Auto Scaling — 자동 확장이 일어나는 조건"
      viewBox="0 0 760 250"
    >
      <Box x={40} y={90} w={150} h={70} label="애플리케이션" color={C.green} />
      <Arrow
        x1={190}
        y1={125}
        x2={290}
        y2={125}
        color={C.sub}
        label="쓰기 증가"
      />
      <Box
        x={290}
        y={80}
        w={180}
        h={90}
        label="RDS 인스턴스"
        sub="EBS 스토리지"
        color={C.blue}
      />
      <Arrow
        x1={470}
        y1={125}
        x2={560}
        y2={125}
        color={C.orange}
        label="조건 충족 시"
      />
      <Box
        x={560}
        y={80}
        w={160}
        h={90}
        label="스토리지 자동 확장"
        sub="Max Threshold까지"
        color={C.orange}
      />
      <text x={70} y={215} fontSize="12" fill={C.yellow} fontFamily={mono}>
        확장 조건(3가지 모두):
      </text>
      <text x={70} y={236} fontSize="11.5" fill={C.sub} fontFamily={mono}>
        ① 여유 공간 &lt; 할당량의 10% ② 부족 상태가 5분 이상 지속 ③ 마지막 수정
        후 6시간 경과
      </text>
    </Fig>
    <Ul
      items={[
        <>
          워크로드를 <B>예측할 수 없는</B> 애플리케이션에 유용
        </>,
        <>
          모든 RDS 엔진에서 지원 (MariaDB, MySQL, PostgreSQL, SQL Server,
          Oracle)
        </>,
      ]}
    />
    <ExamTip>
      "DB 스토리지가 가득 차는 것을 <B color={C.orange}>운영 오버헤드 없이</B>{" "}
      방지하려면?" → <B color={C.orange}>Storage Auto Scaling</B>이 정답인
      문제가 출제됩니다.
    </ExamTip>
  </div>
);

/* ─────────────────────────  SECTION: 읽기 전용 복제본 & Multi-AZ  ───────────────────────── */
const SecReplica = () => (
  <div>
    <P>
      DVA 시험에서 <B color={C.orange}>가장 자주 출제되는 RDS 주제</B>입니다.
      핵심은 <B>읽기 전용 복제본 = 확장성(비동기)</B>,{" "}
      <B>Multi-AZ = 고가용성(동기)</B>이라는 구분입니다.
    </P>

    <H2>읽기 전용 복제본 (Read Replicas)</H2>
    <Ul
      items={[
        <>
          <B>최대 15개</B>의 복제본 생성 가능
        </>,
        <>
          같은 AZ 내, AZ 간(Cross-AZ), 리전 간(Cross-Region) 어디든 생성 가능
        </>,
        <>
          복제는 <B color={C.yellow}>비동기(ASYNC)</B> → 읽기가{" "}
          <B>결과적 일관성(eventually consistent)</B>을 가짐 (복제 지연 시 예전
          데이터를 읽을 수 있음)
        </>,
        <>
          복제본을 <B>독립된 데이터베이스로 승격(promote)</B> 가능 — 승격 후에는
          복제 관계에서 벗어남
        </>,
        <>
          복제본을 사용하려면 애플리케이션의{" "}
          <B>연결 문자열(connection string)을 직접 수정</B>해야 함
        </>,
        <>
          복제본은 <B color={C.red}>SELECT(읽기)만 가능</B> —
          INSERT/UPDATE/DELETE 불가
        </>,
      ]}
    />

    <Fig
      title="Read Replica 대표 사용 사례 — 분석/리포팅 워크로드 분리"
      viewBox="0 0 760 300"
    >
      <Box
        x={40}
        y={40}
        w={170}
        h={64}
        label="프로덕션 앱"
        sub="read + write"
        color={C.green}
      />
      <Box
        x={40}
        y={190}
        w={170}
        h={64}
        label="분석 / 리포팅"
        sub="read only"
        color={C.yellow}
      />
      <Box
        x={300}
        y={40}
        w={190}
        h={64}
        label="RDS 메인 DB"
        sub="쓰기 + 읽기"
        color={C.blue}
      />
      <Box
        x={300}
        y={190}
        w={190}
        h={64}
        label="읽기 전용 복제본"
        sub="SELECT 전용"
        color={C.teal}
      />
      <Arrow x1={210} y1={72} x2={300} y2={72} color={C.green} label="R/W" />
      <Arrow x1={210} y1={222} x2={300} y2={222} color={C.yellow} label="R" />
      <Arrow
        x1={395}
        y1={104}
        x2={395}
        y2={190}
        color={C.purple}
        dashed
        label="ASYNC 복제"
        labelDy={-4}
      />
      <text x={530} y={70} fontSize="12" fill={C.sub} fontFamily="sans-serif">
        메인 DB의 성능에 영향 없이
      </text>
      <text x={530} y={90} fontSize="12" fill={C.sub} fontFamily="sans-serif">
        분석 쿼리를 복제본에서 실행
      </text>
      <text x={530} y={225} fontSize="12" fill={C.sub} fontFamily="sans-serif">
        복제 지연이 있을 수 있음
      </text>
      <text x={530} y={245} fontSize="12" fill={C.sub} fontFamily="sans-serif">
        (eventually consistent)
      </text>
    </Fig>

    <H2>읽기 전용 복제본의 네트워크 비용</H2>
    <P>
      AWS에서는 보통 AZ 간 데이터 이동에 비용이 발생하지만, RDS 읽기 전용
      복제본에는 예외가 있습니다.
    </P>
    <Fig
      title="복제 트래픽 비용 — 같은 리전은 무료, 리전 간은 유료"
      viewBox="0 0 760 270"
    >
      <rect
        x={30}
        y={30}
        width={330}
        height={210}
        rx={12}
        fill="none"
        stroke={C.green}
        strokeWidth={1.3}
      />
      <text x={46} y={54} fontSize="12" fill={C.green} fontFamily={mono}>
        us-east-1 (같은 리전)
      </text>
      <Box
        x={60}
        y={80}
        w={120}
        h={56}
        label="메인 DB"
        sub="AZ-a"
        color={C.blue}
      />
      <Box
        x={210}
        y={160}
        w={120}
        h={56}
        label="복제본"
        sub="AZ-b"
        color={C.teal}
      />
      <Arrow
        x1={180}
        y1={120}
        x2={230}
        y2={160}
        color={C.green}
        label="무료 $0"
      />
      <rect
        x={430}
        y={30}
        width={300}
        height={210}
        rx={12}
        fill="none"
        stroke={C.red}
        strokeWidth={1.3}
      />
      <text x={446} y={54} fontSize="12" fill={C.red} fontFamily={mono}>
        eu-west-1 (다른 리전)
      </text>
      <Box
        x={520}
        y={110}
        w={130}
        h={56}
        label="복제본"
        sub="Cross-Region"
        color={C.teal}
      />
      <Arrow
        x1={360}
        y1={110}
        x2={520}
        y2={135}
        color={C.red}
        dashed
        label="복제 비용 $$$"
      />
    </Fig>
    <ExamTip>
      <B color={C.orange}>같은 리전</B> 내 복제(다른 AZ 포함) 트래픽은{" "}
      <B color={C.orange}>무료</B>,{" "}
      <B color={C.orange}>리전 간(Cross-Region)</B> 복제는{" "}
      <B color={C.orange}>유료</B>. 비용 최적화 문제로 출제됩니다.
    </ExamTip>

    <H2>다중 AZ (Multi-AZ) — 재해 복구용</H2>
    <Ul
      items={[
        <>
          복제가 <B color={C.green}>동기(SYNC)</B>로 이루어짐 — 쓰기가
          대기(standby) 인스턴스에도 반영되어야 커밋 완료
        </>,
        <>
          <B>하나의 DNS 이름</B>을 사용 → 장애 시 <B>자동 페일오버</B> (앱 수정
          불필요)
        </>,
        <>
          AZ 전체 장애, 네트워크 장애, 인스턴스/스토리지 장애에 대비해{" "}
          <B>가용성 향상</B>
        </>,
        <>수동 개입이 필요 없음</>,
        <>
          <B color={C.red}>스케일링 용도가 아님</B> — standby는 평소 읽기/쓰기에
          사용할 수 없음
        </>,
        <>읽기 전용 복제본도 Multi-AZ로 구성 가능 (DR 목적)</>,
      ]}
    />

    <Fig title="Multi-AZ — 동기 복제와 자동 페일오버" viewBox="0 0 760 320">
      <Box x={300} y={20} w={180} h={52} label="애플리케이션" color={C.green} />
      <Box
        x={310}
        y={100}
        w={160}
        h={40}
        label="하나의 DNS 이름"
        sub="자동 페일오버"
        color={C.yellow}
      />
      <Arrow x1={390} y1={72} x2={390} y2={100} color={C.sub} />
      <AZ x={60} y={170} w={290} h={120} name="AZ-A" />
      <AZ x={420} y={170} w={290} h={120} name="AZ-B" />
      <Box
        x={110}
        y={200}
        w={190}
        h={64}
        label="마스터 DB"
        sub="읽기 / 쓰기"
        color={C.blue}
      />
      <Box
        x={470}
        y={200}
        w={190}
        h={64}
        label="스탠바이 DB"
        sub="평소 접근 불가"
        color={C.sub}
        dashed
      />
      <Arrow x1={370} y1={122} x2={230} y2={200} color={C.blue} />
      <Arrow
        x1={300}
        y1={232}
        x2={470}
        y2={232}
        color={C.green}
        label="SYNC 복제"
      />
      <Arrow
        x1={430}
        y1={122}
        x2={545}
        y2={200}
        color={C.red}
        dashed
        label="장애 시 승격"
      />
    </Fig>

    <H2>단일 AZ → 다중 AZ 전환</H2>
    <Ul
      items={[
        <>
          <B color={C.green}>다운타임 제로(0)</B> 작업 — DB를 중지할 필요 없음
        </>,
        <>콘솔에서 "수정(modify)" 버튼만 클릭하면 됨</>,
        <>
          내부 동작: ① 메인 DB의 <B>스냅샷 생성</B> → ② 스냅샷을 새 AZ의
          스탠바이 DB로 <B>복원</B> → ③ 두 DB 간 <B>동기화 수립</B>
        </>,
      ]}
    />

    <H2>비교 요약 (시험 최빈출)</H2>
    <Tbl
      head={["구분", "읽기 전용 복제본", "Multi-AZ"]}
      rows={[
        ["목적", "읽기 확장(스케일링)", "고가용성 / 재해 복구"],
        ["복제 방식", "비동기 (ASYNC) — 결과적 일관성", "동기 (SYNC)"],
        ["개수", "최대 15개", "스탠바이 1개 (엔진에 따라 2개 standby 옵션)"],
        ["읽기 가능 여부", "가능 (SELECT 전용)", "스탠바이는 접근 불가"],
        [
          "연결",
          "각 복제본의 엔드포인트로 앱이 직접 연결",
          "하나의 DNS, 자동 페일오버",
        ],
        ["범위", "동일 AZ / 교차 AZ / 교차 리전", "동일 리전 내 다른 AZ"],
      ]}
    />
    <ExamTip>
      "읽기 부하를 분산하려면?" → <B color={C.orange}>Read Replica</B> / "장애
      시에도 서비스가 유지되어야 한다면?" → <B color={C.orange}>Multi-AZ</B>. 두
      개념을 바꿔 낸 오답 선택지가 반드시 나옵니다. 또한{" "}
      <B color={C.orange}>ASYNC vs SYNC</B> 구분 자체를 묻는 문제도 출제됩니다.
    </ExamTip>
  </div>
);

/* ─────────────────────────  SECTION: Aurora  ───────────────────────── */
const SecAurora = () => (
  <div>
    <P>
      <B color={C.purple}>Amazon Aurora</B>는 AWS가 클라우드에 최적화해 만든{" "}
      <B>독점(proprietary) 데이터베이스 엔진</B>입니다. 오픈소스는 아니지만{" "}
      <B>MySQL과 PostgreSQL 드라이버와 호환</B>되므로, 기존 앱을 코드 변경 없이
      연결할 수 있습니다.
    </P>

    <H2>핵심 특징</H2>
    <Ul
      items={[
        <>
          RDS의 MySQL 대비 <B color={C.purple}>5배</B>, PostgreSQL 대비{" "}
          <B color={C.purple}>3배</B> 성능
        </>,
        <>
          스토리지가 <B>10GB에서 시작해 최대 128TB까지 자동 증가</B> — 용량 계획
          불필요
        </>,
        <>
          읽기 전용 복제본 <B>최대 15개</B> (MySQL은 5개), 복제 지연이{" "}
          <B>10ms 미만</B>으로 매우 빠름
        </>,
        <>
          페일오버가 <B>즉각적(30초 미만)</B> — 기본적으로 고가용성(HA) 내장
        </>,
        <>
          비용은 RDS 대비 약 <B>20% 더 비쌈</B>, 그러나 더 효율적
        </>,
      ]}
    />

    <H2>Aurora 고가용성 아키텍처</H2>
    <P>
      Aurora의 가장 중요한 시험 포인트는 스토리지 계층입니다. 데이터를{" "}
      <B color={C.purple}>3개의 AZ에 걸쳐 6개의 복사본</B>으로 저장합니다.
    </P>
    <Fig
      title="Aurora 스토리지 — 3개 AZ에 6개 복사본 (쓰기 4/6, 읽기 3/6)"
      viewBox="0 0 760 360"
    >
      <AZ x={30} y={130} w={220} h={190} name="AZ 1" />
      <AZ x={270} y={130} w={220} h={190} name="AZ 2" />
      <AZ x={510} y={130} w={220} h={190} name="AZ 3" />
      <Box
        x={290}
        y={20}
        w={180}
        h={56}
        label="Aurora DB 클러스터"
        sub="공유 스토리지 볼륨"
        color={C.purple}
      />
      {[
        [70, 170],
        [70, 245],
        [310, 170],
        [310, 245],
        [550, 170],
        [550, 245],
      ].map(([x, y], i) => (
        <Box
          key={i}
          x={x}
          y={y}
          w={140}
          h={52}
          label={`복사본 ${i + 1}`}
          sub="10GB 세그먼트"
          color={C.teal}
        />
      ))}
      <Arrow x1={340} y1={76} x2={150} y2={170} color={C.purple} dashed />
      <Arrow x1={380} y1={76} x2={380} y2={170} color={C.purple} dashed />
      <Arrow x1={420} y1={76} x2={610} y2={170} color={C.purple} dashed />
      <text
        x={380}
        y={348}
        textAnchor="middle"
        fontSize="12"
        fill={C.yellow}
        fontFamily={mono}
      >
        쓰기: 6개 중 4개 성공 필요 · 읽기: 6개 중 3개 필요 · P2P 자가
        복구(self-healing)
      </text>
    </Fig>
    <Ul
      items={[
        <>
          <B>쓰기</B>에는 6개 중 <B color={C.yellow}>4개</B>의 복사본만 필요 →
          AZ 하나가 죽어도 쓰기 가능
        </>,
        <>
          <B>읽기</B>에는 6개 중 <B color={C.yellow}>3개</B>만 필요
        </>,
        <>
          피어 투 피어(P2P) 복제를 통한 <B>자가 복구(self-healing)</B> — 일부
          데이터 손상 시 자동 복구
        </>,
        <>
          스토리지가 <B>수백 개의 볼륨에 스트라이핑</B>되어 있음
        </>,
      ]}
    />

    <H2>Aurora 클러스터와 엔드포인트</H2>
    <P>
      마스터(writer)는 하나만 존재하며, 마스터 장애 시 <B>30초 이내</B>에 복제본
      중 하나가 승격됩니다. 클라이언트 입장에서는 두 개의 엔드포인트만 기억하면
      됩니다.
    </P>
    <Fig
      title="Aurora 클러스터 — Writer / Reader 엔드포인트와 복제본 오토 스케일링"
      viewBox="0 0 760 400"
    >
      <Box x={290} y={16} w={180} h={50} label="클라이언트" color={C.green} />
      <Box
        x={90}
        y={110}
        w={220}
        h={44}
        label="Writer Endpoint"
        sub="항상 마스터를 가리킴"
        color={C.orange}
      />
      <Box
        x={450}
        y={110}
        w={220}
        h={44}
        label="Reader Endpoint"
        sub="읽기 연결 로드밸런싱"
        color={C.teal}
      />
      <Arrow x1={340} y1={66} x2={210} y2={110} color={C.orange} label="쓰기" />
      <Arrow x1={420} y1={66} x2={550} y2={110} color={C.teal} label="읽기" />
      <Box
        x={120}
        y={210}
        w={160}
        h={60}
        label="마스터"
        sub="Writer (1개)"
        color={C.orange}
      />
      <Box
        x={370}
        y={210}
        w={130}
        h={60}
        label="복제본 1"
        sub="Reader"
        color={C.teal}
      />
      <Box
        x={520}
        y={210}
        w={130}
        h={60}
        label="복제본 2"
        sub="Reader"
        color={C.teal}
      />
      <Box
        x={595}
        y={290}
        w={130}
        h={60}
        label="복제본 N"
        sub="Auto Scaling"
        color={C.teal}
        dashed
      />
      <Arrow x1={200} y1={154} x2={200} y2={210} color={C.orange} />
      <Arrow x1={520} y1={154} x2={440} y2={210} color={C.teal} />
      <Arrow x1={580} y1={154} x2={585} y2={210} color={C.teal} />
      <Arrow x1={620} y1={154} x2={662} y2={290} color={C.teal} dashed />
      <rect
        x={60}
        y={300}
        width={430}
        height={78}
        rx={10}
        fill={`${C.purple}12`}
        stroke={C.purple}
        strokeWidth={1.2}
      />
      <text
        x={80}
        y={328}
        fontSize="12.5"
        fill={C.purple}
        fontFamily="sans-serif"
        fontWeight="700"
      >
        공유 스토리지 볼륨 (10GB → 128TB 자동 확장)
      </text>
      <text x={80} y={352} fontSize="11.5" fill={C.sub} fontFamily={mono}>
        복제 · 자가 복구 · 오토 익스팬딩
      </text>
      <Arrow x1={200} y1={270} x2={230} y2={300} color={C.sub} />
      <Arrow x1={435} y1={270} x2={400} y2={300} color={C.sub} />
    </Fig>
    <Ul
      items={[
        <>
          <B color={C.orange}>Writer Endpoint</B>: 항상 현재 마스터를 가리키는
          DNS 이름 — 페일오버가 나도 클라이언트는 같은 주소로 연결
        </>,
        <>
          <B color={C.teal}>Reader Endpoint</B>: 모든 읽기 전용 복제본으로{" "}
          <B>연결 수준의 로드 밸런싱</B>을 수행하는 DNS 이름
        </>,
        <>
          복제본에 <B>오토 스케일링</B>을 설정해 읽기 부하에 따라 자동으로 개수
          조절 가능
        </>,
        <>리전 간(Cross-Region) 복제도 지원</>,
      ]}
    />

    <H2>Aurora가 제공하는 기능 (Features)</H2>
    <Ul
      items={[
        <>자동 페일오버 (Automatic fail-over)</>,
        <>백업 및 복구 (Backup and Recovery)</>,
        <>격리 및 보안 (Isolation and Security)</>,
        <>산업 규정 준수 (Industry Compliance)</>,
        <>버튼 클릭 한 번으로 확장 (Push-button Scaling)</>,
        <>
          <B>다운타임 없는</B> 자동 패치 (Automated Patching with Zero Downtime)
        </>,
        <>고급 모니터링 (Advanced Monitoring)</>,
        <>정기 유지 보수 (Routine Maintenance)</>,
        <>
          <B color={C.purple}>Backtrack</B>: 백업 없이도 원하는 시점으로
          데이터를 되돌리는 기능
        </>,
      ]}
    />
    <ExamTip>
      자주 나오는 포인트: ①{" "}
      <B color={C.orange}>6개 복사본 / 3개 AZ / 쓰기 4, 읽기 3</B> ②{" "}
      <B color={C.orange}>Reader Endpoint = 읽기 로드밸런싱</B> ③ 복제본{" "}
      <B color={C.orange}>최대 15개</B> ④ <B color={C.orange}>Backtrack</B>은
      백업 복원이 아니라 "되감기"라는 점.
    </ExamTip>
  </div>
);

/* ─────────────────────────  SECTION: 보안  ───────────────────────── */
const SecSecurity = () => (
  <div>
    <P>
      RDS와 Aurora에 공통으로 적용되는 보안 항목입니다. 짧지만{" "}
      <B color={C.orange}>IAM 인증과 암호화</B>는 출제 빈도가 높습니다.
    </P>

    <H2>저장 데이터 암호화 (At-Rest Encryption)</H2>
    <Ul
      items={[
        <>
          <B>AWS KMS</B> 키로 마스터와 복제본 모두 암호화 가능 —{" "}
          <B>DB를 처음 실행(launch)할 때</B> 정의해야 함
        </>,
        <>
          <B color={C.red}>
            마스터가 암호화되지 않았다면 읽기 전용 복제본도 암호화할 수 없음
          </B>
        </>,
      ]}
    />
    <Fig
      title="암호화되지 않은 DB를 암호화하는 절차 — 스냅샷 경유"
      viewBox="0 0 760 190"
    >
      <Box x={30} y={60} w={170} h={70} label="암호화 안 된 DB" color={C.red} />
      <Arrow x1={200} y1={95} x2={290} y2={95} color={C.sub} label="① 스냅샷" />
      <Box
        x={290}
        y={60}
        w={170}
        h={70}
        label="DB 스냅샷"
        sub="암호화 옵션으로 복사"
        color={C.yellow}
      />
      <Arrow x1={460} y1={95} x2={550} y2={95} color={C.sub} label="② 복원" />
      <Box
        x={550}
        y={60}
        w={180}
        h={70}
        label="암호화된 새 DB"
        sub="KMS"
        color={C.green}
      />
    </Fig>

    <H2>전송 중 암호화 (In-Flight Encryption)</H2>
    <Ul
      items={[
        <>
          모든 RDS/Aurora는 기본적으로 <B>TLS-ready</B>
        </>,
        <>
          클라이언트 측에서 <B>AWS TLS 루트 인증서</B>를 사용해 연결
        </>,
      ]}
    />

    <H2>IAM 인증 (IAM Authentication)</H2>
    <Ul
      items={[
        <>
          사용자 이름/비밀번호 대신 <B color={C.orange}>IAM 역할(Role)</B>로
          DB에 연결 가능 (MySQL, PostgreSQL 등)
        </>,
        <>
          15분 동안 유효한 <B>인증 토큰</B>을 발급받아 접속 — 비밀번호를 코드에
          저장할 필요가 없음
        </>,
        <>
          네트워크는 <B>보안 그룹(Security Group)</B>으로 통제
        </>,
      ]}
    />
    <Fig
      title="IAM 인증 흐름 — EC2가 IAM Role로 RDS에 접속"
      viewBox="0 0 760 210"
    >
      <Box
        x={40}
        y={70}
        w={160}
        h={70}
        label="EC2 / Lambda"
        sub="IAM Role 부착"
        color={C.green}
      />
      <Box
        x={310}
        y={70}
        w={170}
        h={70}
        label="RDS API"
        sub="토큰 발급"
        color={C.yellow}
      />
      <Box
        x={580}
        y={70}
        w={150}
        h={70}
        label="RDS DB"
        sub="MySQL / PG"
        color={C.blue}
      />
      <Arrow
        x1={200}
        y1={90}
        x2={310}
        y2={90}
        color={C.sub}
        label="① 토큰 요청"
      />
      <Arrow
        x1={310}
        y1={120}
        x2={200}
        y2={120}
        color={C.yellow}
        label="② 15분 토큰"
      />
      <Arrow
        x1={200}
        y1={165}
        x2={580}
        y2={130}
        color={C.green}
        label="③ 토큰 + TLS로 접속"
      />
    </Fig>

    <H2>기타</H2>
    <Ul
      items={[
        <>
          SSH 접속 불가 (<B>RDS Custom</B> 제외)
        </>,
        <>
          <B>감사 로그(Audit Logs)</B> 활성화 가능 — 장기 보관하려면{" "}
          <B color={C.orange}>CloudWatch Logs</B>로 전송
        </>,
      ]}
    />
    <ExamTip>
      "비밀번호 없이 안전하게 DB 연결" → <B color={C.orange}>IAM DB 인증</B>.
      "이미 운영 중인 비암호화 DB를 암호화" →{" "}
      <B color={C.orange}>스냅샷 → 암호화 복사 → 복원</B> (그 자리에서 켤 수
      없음).
    </ExamTip>
  </div>
);

/* ─────────────────────────  SECTION: RDS Proxy  ───────────────────────── */
const SecProxy = () => (
  <div>
    <P>
      <B color={C.orange}>RDS Proxy</B>는 완전 관리형 데이터베이스 프록시로,
      애플리케이션이 DB 연결을 <B>풀링(pooling)하고 공유</B>하게 해 줍니다.
      DVA에서는 특히 <B>Lambda와의 조합</B>으로 출제됩니다.
    </P>

    <H2>핵심 특징</H2>
    <Ul
      items={[
        <>
          연결을 풀링·공유해 DB 리소스(CPU, RAM) 부담과{" "}
          <B>열린 연결 수를 최소화</B>
        </>,
        <>
          완전 서버리스, 오토 스케일링, <B>다중 AZ로 고가용성</B>
        </>,
        <>
          장애 시 <B color={C.orange}>페일오버 시간을 최대 66% 단축</B> —
          프록시가 연결을 잡고 새 인스턴스로 넘겨줌
        </>,
        <>지원: MySQL, PostgreSQL, MariaDB, SQL Server, Aurora</>,
        <>
          대부분의 경우 <B>애플리케이션 코드 변경 불필요</B> (연결 엔드포인트만
          프록시로 변경)
        </>,
        <>
          <B color={C.orange}>IAM 인증을 강제(enforce)</B> 할 수 있고, 자격
          증명은 <B>Secrets Manager</B>에 저장
        </>,
        <>
          <B color={C.red}>절대 퍼블릭 접근 불가</B> — 반드시 VPC 내부에서만
          접근
        </>,
      ]}
    />

    <Fig
      title="RDS Proxy — 수많은 Lambda 연결을 풀링해 DB를 보호"
      viewBox="0 0 760 330"
    >
      {[30, 105, 180].map((y, i) => (
        <Box
          key={i}
          x={40}
          y={y}
          w={140}
          h={52}
          label={`Lambda ${i + 1}`}
          sub="동시 실행"
          color={C.green}
        />
      ))}
      <Box
        x={40}
        y={255}
        w={140}
        h={52}
        label="Lambda N…"
        sub="수천 개 폭증"
        color={C.green}
        dashed
      />
      <Box
        x={300}
        y={120}
        w={190}
        h={90}
        label="RDS Proxy"
        sub="연결 풀링 · Multi-AZ"
        color={C.orange}
      />
      <Box
        x={580}
        y={120}
        w={150}
        h={90}
        label="RDS / Aurora"
        sub="적은 수의 연결"
        color={C.blue}
      />
      {[56, 131, 206, 281].map((y, i) => (
        <Arrow
          key={i}
          x1={180}
          y1={y}
          x2={300}
          y2={150 + i * 8}
          color={C.green}
          width={1.2}
        />
      ))}
      <Arrow
        x1={490}
        y1={165}
        x2={580}
        y2={165}
        color={C.orange}
        label="풀링된 연결"
      />
      <text
        x={385}
        y={310}
        textAnchor="middle"
        fontSize="12"
        fill={C.sub}
        fontFamily={mono}
      >
        VPC 내부 전용 · IAM 인증 강제 · Secrets Manager 연동 · 페일오버 66% 단축
      </text>
    </Fig>

    <H2>왜 Lambda에 특히 중요한가?</H2>
    <P>
      Lambda 함수는 순식간에 수백~수천 개가 생성·소멸되며 각각 DB 연결을 열려고
      합니다. RDS Proxy 없이는 DB가{" "}
      <B color={C.red}>연결 폭주로 타임아웃·과부하</B>에 빠질 수 있습니다.
      프록시가 중간에서 연결을 모아 재사용하므로 DB에는 적은 수의 안정적인
      연결만 유지됩니다.
    </P>
    <ExamTip>
      키워드 매칭: "Lambda가 RDS 연결을 고갈시킨다 / TooManyConnections" →{" "}
      <B color={C.orange}>RDS Proxy</B>. "프록시에 퍼블릭 IP로 접속" →{" "}
      <B color={C.orange}>불가능(오답)</B>. "DB 자격 증명 관리" →{" "}
      <B color={C.orange}>Secrets Manager</B>와 함께 사용.
    </ExamTip>
  </div>
);

/* ─────────────────────────  SECTION: ElastiCache  ───────────────────────── */
const SecCache = () => (
  <div>
    <P>
      <B color={C.teal}>Amazon ElastiCache</B>는 관리형 <B>Redis / Memcached</B>{" "}
      서비스입니다. RDS가 관계형 DB를 관리해 주듯, ElastiCache는{" "}
      <B>인메모리(in-memory) 캐시</B>를 관리해 줍니다. 매우 높은 성능과 낮은
      지연 시간이 특징입니다.
    </P>
    <Ul
      items={[
        <>
          읽기 집약적 워크로드에서 <B>DB의 부하를 줄여줌</B> (자주 조회되는
          데이터를 캐시에 보관)
        </>,
        <>
          애플리케이션의 상태를 캐시에 저장해 <B>앱을 무상태(stateless)로</B>{" "}
          만들 수 있음
        </>,
        <>AWS가 OS 유지 보수·패치·설정·모니터링·장애 복구·백업을 담당</>,
        <>
          <B color={C.red}>
            단, ElastiCache를 도입하려면 애플리케이션 코드를 크게 변경해야 함
          </B>{" "}
          — "코드 변경 없이"라는 선택지는 오답
        </>,
      ]}
    />

    <H2>아키텍처 ①: DB 캐시 (Cache-Aside)</H2>
    <Fig title="DB 캐시 아키텍처 — 캐시 히트/미스 흐름" viewBox="0 0 760 330">
      <Box x={40} y={120} w={160} h={80} label="애플리케이션" color={C.green} />
      <Box
        x={330}
        y={40}
        w={180}
        h={70}
        label="ElastiCache"
        sub="Redis / Memcached"
        color={C.teal}
      />
      <Box
        x={330}
        y={210}
        w={180}
        h={70}
        label="RDS"
        sub="원본 데이터"
        color={C.blue}
      />
      <Arrow
        x1={200}
        y1={140}
        x2={330}
        y2={85}
        color={C.teal}
        label="① 캐시 먼저 조회"
      />
      <Arrow
        x1={330}
        y1={105}
        x2={205}
        y2={155}
        color={C.green}
        label="② HIT → 즉시 반환"
        labelDy={14}
      />
      <Arrow
        x1={200}
        y1={185}
        x2={330}
        y2={235}
        color={C.blue}
        label="③ MISS → DB 조회"
        labelDy={16}
      />
      <Arrow
        x1={425}
        y1={210}
        x2={425}
        y2={110}
        color={C.yellow}
        dashed
        label="④ 캐시에 저장"
        labelDy={-4}
      />
      <text x={585} y={150} fontSize="12" fill={C.sub} fontFamily="sans-serif">
        다음 요청부터는
      </text>
      <text x={585} y={170} fontSize="12" fill={C.sub} fontFamily="sans-serif">
        캐시에서 바로 응답
      </text>
      <text
        x={380}
        y={315}
        textAnchor="middle"
        fontSize="12"
        fill={C.yellow}
        fontFamily={mono}
      >
        ※ 캐시 무효화(invalidation) 전략이 반드시 필요
      </text>
    </Fig>

    <H2>아키텍처 ②: 세션 저장소 (User Session Store)</H2>
    <Fig
      title="세션 저장소 — 어떤 인스턴스로 가도 로그인 유지 (무상태 앱)"
      viewBox="0 0 760 300"
    >
      <Box
        x={40}
        y={110}
        w={130}
        h={64}
        label="사용자"
        sub="로그인 1회"
        color={C.yellow}
      />
      {[30, 118, 206].map((y, i) => (
        <Box
          key={i}
          x={300}
          y={y}
          w={160}
          h={60}
          label={`앱 인스턴스 ${i + 1}`}
          color={C.green}
        />
      ))}
      <Box
        x={580}
        y={110}
        w={150}
        h={76}
        label="ElastiCache"
        sub="세션 데이터"
        color={C.teal}
      />
      <Arrow x1={170} y1={125} x2={300} y2={60} color={C.sub} />
      <Arrow x1={170} y1={142} x2={300} y2={148} color={C.sub} />
      <Arrow
        x1={170}
        y1={160}
        x2={300}
        y2={236}
        color={C.sub}
        label="어느 인스턴스든"
        labelDy={18}
      />
      <Arrow x1={460} y1={60} x2={580} y2={125} color={C.teal} />
      <Arrow
        x1={460}
        y1={148}
        x2={580}
        y2={148}
        color={C.teal}
        label="세션 쓰기/조회"
      />
      <Arrow x1={460} y1={236} x2={580} y2={170} color={C.teal} />
    </Fig>
    <P>
      사용자가 한 번 로그인하면 세션을 ElastiCache에 기록합니다. 이후 요청이{" "}
      <B>다른 인스턴스</B>로 가더라도 캐시에서 세션을 찾을 수 있으므로
      재로그인이 필요 없고, 애플리케이션은{" "}
      <B color={C.teal}>무상태(stateless)</B>가 됩니다.
    </P>

    <H2>Redis vs Memcached (시험 단골 비교)</H2>
    <Tbl
      head={["Redis", "Memcached"]}
      rows={[
        [
          <>
            <B color={C.green}>Multi-AZ</B> + 자동 페일오버 지원
          </>,
          <>
            멀티 노드 <B>샤딩(파티셔닝)</B>으로 데이터 분할
          </>,
        ],
        [
          <>
            <B>읽기 전용 복제본</B>으로 읽기 확장 및 고가용성
          </>,
          <>
            <B color={C.red}>고가용성(복제) 없음</B>
          </>,
        ],
        [
          <>
            <B>데이터 내구성</B>: AOF 지속성 지원
          </>,
          <>
            <B color={C.red}>비영속적(non-persistent)</B> — 데이터 유실 가능
          </>,
        ],
        [
          <>
            <B>백업 & 복원</B> 기능
          </>,
          <>백업 & 복원 (서버리스에서만)</>,
        ],
        [
          <>
            <B color={C.yellow}>Sets, Sorted Sets</B> 등 자료구조 지원
          </>,
          <>
            <B>멀티 스레드</B> 아키텍처
          </>,
        ],
      ]}
    />
    <ExamTip>
      암기 팁 — <B color={C.orange}>Redis = 고가용성·내구성·복제·Sorted Set</B>{" "}
      (기능 풍부),{" "}
      <B color={C.orange}>Memcached = 단순·샤딩·멀티스레드·비영속</B> (순수
      캐시). "게임 리더보드(실시간 순위표)" 키워드가 나오면 무조건{" "}
      <B color={C.orange}>Redis Sorted Sets</B>입니다.
    </ExamTip>
  </div>
);

/* ─────────────────────────  SECTION: 캐싱 전략  ───────────────────────── */
const SecStrategy = () => (
  <div>
    <P>
      DVA 시험에서 <B color={C.orange}>가장 빈출되는 캐싱 주제</B>입니다. Lazy
      Loading과 Write-Through의 동작·장단점을 정확히 구분해야 합니다.
    </P>

    <H2>캐싱 도입 전 고려사항</H2>
    <Ul
      items={[
        <>
          <B>데이터를 캐시해도 안전한가?</B> — 캐시는 결과적 일관성이므로 오래된
          데이터가 보여도 괜찮은 경우에만
        </>,
        <>
          <B>캐싱이 효과적인 데이터인가?</B> — <B color={C.green}>효과적</B>:
          변화가 느리고 자주 조회되는 소수의 키 / <B color={C.red}>비효과적</B>:
          빠르게 변하고 키 공간 전체가 골고루 조회되는 데이터
        </>,
        <>
          <B>데이터 구조가 캐싱에 적합한가?</B> — key-value 형태, 또는
          집계(aggregation) 결과
        </>,
      ]}
    />

    <H2>전략 ①: Lazy Loading (= Cache-Aside, Lazy Population)</H2>
    <P>
      읽기 시점에만 캐시를 채우는 방식입니다. 가장 기본적이고 널리 쓰입니다.
    </P>
    <Fig
      title="Lazy Loading — 캐시 미스 시 3번의 왕복(round trip) 발생"
      viewBox="0 0 760 330"
    >
      <Box x={40} y={120} w={150} h={80} label="애플리케이션" color={C.green} />
      <Box x={330} y={40} w={180} h={70} label="캐시" color={C.teal} />
      <Box x={330} y={215} w={180} h={70} label="RDS" color={C.blue} />
      <Arrow
        x1={190}
        y1={140}
        x2={330}
        y2={80}
        color={C.teal}
        label="① 캐시 조회 (MISS)"
      />
      <Arrow
        x1={190}
        y1={165}
        x2={330}
        y2={245}
        color={C.blue}
        label="② DB에서 읽기"
        labelDy={18}
      />
      <Arrow x1={330} y1={265} x2={195} y2={195} color={C.blue} dashed />
      <Arrow
        x1={190}
        y1={128}
        x2={335}
        y2={55}
        color={C.yellow}
        dashed
        label="③ 캐시에 쓰기"
        labelDy={-10}
      />
      <text x={570} y={140} fontSize="12" fill={C.sub} fontFamily="sans-serif">
        HIT이면 ①에서 끝,
      </text>
      <text x={570} y={160} fontSize="12" fill={C.sub} fontFamily="sans-serif">
        MISS면 ①→②→③
      </text>
      <text x={570} y={180} fontSize="12" fill={C.red} fontFamily="sans-serif">
        = 3 round trips
      </text>
    </Fig>
    <Tbl
      head={["장점 (Pros)", "단점 (Cons)"]}
      rows={[
        [
          <>요청된 데이터만 캐시됨 → 캐시가 불필요한 데이터로 채워지지 않음</>,
          <>
            캐시 미스 시 <B color={C.red}>3번의 왕복</B> → 눈에 띄는 지연 발생
            가능
          </>,
        ],
        [
          <>캐시 노드 장애가 치명적이지 않음 (지연만 증가)</>,
          <>
            DB가 갱신돼도 캐시는 그대로 →{" "}
            <B color={C.red}>오래된(stale) 데이터</B> 가능
          </>,
        ],
      ]}
    />
    <Code>{`# Lazy Loading 의사코드 (파이썬)
def get_user(user_id):
    record = cache.get(user_id)          # ① 캐시 먼저
    if record is None:                    # MISS
        record = db.query("SELECT * FROM users WHERE id = ?", user_id)  # ② DB
        cache.set(user_id, record)        # ③ 캐시에 저장
    return record`}</Code>

    <H2>전략 ②: Write-Through</H2>
    <P>
      DB에 <B>쓸 때마다</B> 캐시도 함께 갱신하는 방식입니다.
    </P>
    <Fig
      title="Write-Through — DB 쓰기 시 캐시도 함께 갱신"
      viewBox="0 0 760 330"
    >
      <Box x={40} y={120} w={150} h={80} label="애플리케이션" color={C.green} />
      <Box
        x={330}
        y={40}
        w={180}
        h={70}
        label="캐시"
        sub="항상 최신"
        color={C.teal}
      />
      <Box x={330} y={215} w={180} h={70} label="RDS" color={C.blue} />
      <Arrow
        x1={190}
        y1={170}
        x2={330}
        y2={245}
        color={C.blue}
        label="① DB에 쓰기"
        labelDy={18}
      />
      <Arrow
        x1={190}
        y1={135}
        x2={330}
        y2={72}
        color={C.yellow}
        label="② 캐시에도 쓰기"
      />
      <Arrow
        x1={330}
        y1={95}
        x2={195}
        y2={150}
        color={C.teal}
        dashed
        label="읽기는 항상 HIT"
        labelDy={16}
      />
      <text x={570} y={150} fontSize="12" fill={C.sub} fontFamily="sans-serif">
        읽기 시 stale 데이터 없음,
      </text>
      <text x={570} y={170} fontSize="12" fill={C.sub} fontFamily="sans-serif">
        쓰기만 2번의 호출
      </text>
    </Fig>
    <Tbl
      head={["장점 (Pros)", "단점 (Cons)"]}
      rows={[
        [
          <>
            캐시 데이터가 <B color={C.green}>절대 오래되지 않음</B>, 읽기가 빠름
          </>,
          <>
            데이터를 DB에 쓰기 전까지는 캐시에 없음 (miss) →{" "}
            <B>Lazy Loading과 조합</B>해서 보완
          </>,
        ],
        [
          <>쓰기 페널티(호출 2번)는 사용자가 읽기 지연보다 잘 수용함</>,
          <>
            <B color={C.red}>캐시 이탈(cache churn)</B> — 한 번도 읽히지 않을
            데이터까지 캐시에 저장됨
          </>,
        ],
      ]}
    />
    <Code>{`# Write-Through 의사코드 (파이썬)
def save_user(user_id, values):
    record = db.query("UPDATE users ... WHERE id = ?", user_id, values)  # ① DB
    cache.set(user_id, record)                                            # ② 캐시
    return record`}</Code>

    <H2>캐시 제거(Eviction)와 TTL</H2>
    <Ul
      items={[
        <>
          <B>명시적 삭제</B> — 애플리케이션이 직접 항목 삭제
        </>,
        <>
          <B>메모리 가득 참</B> — 최근에 사용되지 않은 항목부터 제거 (
          <B color={C.yellow}>LRU</B>)
        </>,
        <>
          <B>TTL(Time-To-Live)</B> — 항목마다 생존 시간 설정 (수 초 ~ 수 일)
        </>,
      ]}
    />
    <P>
      TTL은 리더보드, 댓글, 활동 스트림처럼{" "}
      <B>어느 정도의 최신성만 필요한 데이터</B>에 적합합니다. 제거(eviction)가
      너무 자주 발생한다면 캐시를 <B>스케일 업/아웃</B>해야 한다는 신호입니다.
    </P>

    <H2>정리 — 어떤 전략을 쓸까?</H2>
    <Ul
      items={[
        <>
          <B>Lazy Loading</B>은 구현이 쉽고 많은 상황에서 잘 동작 →{" "}
          <B color={C.green}>기본 선택</B>
        </>,
        <>
          <B>Write-Through</B>는 보통 Lazy Loading 위에 얹는 <B>최적화</B>이며,
          함께 사용
        </>,
        <>
          TTL 설정은 대부분 좋은 생각 — 단, Write-Through를 쓰는 경우는 예외일
          수 있음
        </>,
        <>
          <B>말이 되는 데이터만 캐시</B>할 것 (사용자 프로필, 블로그 글 등)
        </>,
      ]}
    />
    <Note color={C.purple} icon="❝">
      "컴퓨터 과학에서 어려운 것은 딱 두 가지다:{" "}
      <B color={C.purple}>캐시 무효화</B>와 이름 짓기." — 캐싱은 강력하지만
      무효화 전략이 항상 함께 고민되어야 합니다.
    </Note>
    <ExamTip>
      문제 유형: "캐시 미스 시 지연이 크다" →{" "}
      <B color={C.orange}>Lazy Loading의 단점</B>. "캐시가 절대 stale하면 안
      된다" → <B color={C.orange}>Write-Through</B>. "안 읽히는 데이터로 캐시가
      낭비된다(cache churn)" → <B color={C.orange}>Write-Through의 단점</B>.
      "일정 시간 후 자동 삭제" → <B color={C.orange}>TTL</B>.
    </ExamTip>
  </div>
);

/* ─────────────────────────  SECTION: MemoryDB  ───────────────────────── */
const SecMemoryDB = () => (
  <div>
    <P>
      <B color={C.teal}>Amazon MemoryDB for Redis</B>는{" "}
      <B>Redis와 호환되는, 내구성 있는(durable) 인메모리 데이터베이스</B>입니다.
      ElastiCache Redis가 "캐시"라면, MemoryDB는 Redis API를 가진{" "}
      <B>진짜 데이터베이스</B>입니다.
    </P>
    <Ul
      items={[
        <>
          <B>초고성능</B> — 초당 1억 6천만(160 million) 건 이상의 요청 처리
        </>,
        <>
          <B color={C.green}>다중 AZ 트랜잭션 로그</B>로 데이터 내구성 확보
        </>,
        <>
          수십 GB에서 <B>수백 TB</B>까지 원활하게 확장
        </>,
        <>사용 사례: 웹/모바일 앱, 온라인 게임, 미디어 스트리밍</>,
      ]}
    />
    <Fig
      title="ElastiCache Redis(캐시) vs MemoryDB(내구성 있는 DB)"
      viewBox="0 0 760 280"
    >
      <rect
        x={30}
        y={30}
        width={330}
        height={220}
        rx={12}
        fill="none"
        stroke={C.teal}
        strokeWidth={1.2}
      />
      <text
        x={50}
        y={58}
        fontSize="13"
        fill={C.teal}
        fontFamily={mono}
        fontWeight="700"
      >
        ElastiCache Redis
      </text>
      <text x={50} y={82} fontSize="12" fill={C.sub} fontFamily="sans-serif">
        역할: 캐시 (DB 앞단)
      </text>
      <Box x={60} y={100} w={120} h={54} label="캐시" color={C.teal} />
      <Box
        x={220}
        y={100}
        w={120}
        h={54}
        label="RDS"
        sub="원본은 여기"
        color={C.blue}
      />
      <Arrow x1={180} y1={127} x2={220} y2={127} color={C.sub} />
      <text x={50} y={205} fontSize="11.5" fill={C.sub} fontFamily={mono}>
        데이터 유실 허용 (원본 DB 존재)
      </text>
      <rect
        x={400}
        y={30}
        width={330}
        height={220}
        rx={12}
        fill="none"
        stroke={C.green}
        strokeWidth={1.2}
      />
      <text
        x={420}
        y={58}
        fontSize="13"
        fill={C.green}
        fontFamily={mono}
        fontWeight="700"
      >
        MemoryDB for Redis
      </text>
      <text x={420} y={82} fontSize="12" fill={C.sub} fontFamily="sans-serif">
        역할: 그 자체가 주(primary) DB
      </text>
      <Box
        x={430}
        y={100}
        w={270}
        h={54}
        label="MemoryDB"
        sub="인메모리 + Multi-AZ 트랜잭션 로그"
        color={C.green}
      />
      <text x={420} y={185} fontSize="11.5" fill={C.sub} fontFamily={mono}>
        별도의 원본 DB 불필요 · 내구성 보장
      </text>
      <text x={420} y={207} fontSize="11.5" fill={C.sub} fontFamily={mono}>
        1억 6천만+ req/s · 수백 TB 확장
      </text>
    </Fig>
    <ExamTip>
      출제 빈도는 낮지만, "Redis 호환 + <B color={C.orange}>내구성(durable)</B>{" "}
      + 초고속 데이터베이스"라는 키워드 조합이 보이면 MemoryDB를 고르면 됩니다.
      ElastiCache와의 차이(캐시 vs 내구성 있는 DB)만 기억하세요.
    </ExamTip>
  </div>
);

/* ─────────────────────────  SECTION: 시험 요약  ───────────────────────── */
const SecSummary = () => (
  <div>
    <P>
      전체 섹션의 <B color={C.orange}>출제 빈도</B>와 반드시 기억할 한 줄
      요약입니다. DVA-C02에서 이 챕터(RDS + Aurora + ElastiCache)는{" "}
      <B>전체적으로 출제 비중이 높은 영역</B>이며, 특히 캐싱 전략과 Read
      Replica/Multi-AZ 구분은 거의 매 시험 등장한다고 알려져 있습니다.
    </P>
    <Tbl
      head={["주제", "출제 빈도", "한 줄 핵심"]}
      widths={["28%", "22%", "50%"]}
      rows={[
        [
          "RDS 개요",
          <Freq n={3} />,
          "관리형 SQL DB, SSH 불가, Storage Auto Scaling",
        ],
        [
          "Read Replica vs Multi-AZ",
          <Freq n={5} />,
          "복제본=ASYNC·읽기 확장 / Multi-AZ=SYNC·자동 페일오버",
        ],
        [
          "Aurora",
          <Freq n={4} />,
          "3 AZ 6 복사본, Writer/Reader 엔드포인트, 복제본 15개",
        ],
        [
          "RDS & Aurora 보안",
          <Freq n={4} />,
          "IAM 인증(15분 토큰), KMS 암호화는 스냅샷 경유",
        ],
        [
          "RDS Proxy",
          <Freq n={4} />,
          "Lambda 연결 풀링, 페일오버 66%↓, VPC 전용",
        ],
        [
          "ElastiCache",
          <Freq n={4} />,
          "Redis(HA·내구성·Sorted Set) vs Memcached(샤딩·멀티스레드)",
        ],
        [
          "캐싱 전략",
          <Freq n={5} />,
          "Lazy Loading(3왕복·stale) vs Write-Through(no stale·churn)",
        ],
        ["MemoryDB", <Freq n={1} />, "Redis 호환 + 내구성 있는 초고속 DB"],
      ]}
    />

    <H2>헷갈리기 쉬운 포인트 최종 점검</H2>
    <Ul
      items={[
        <>
          Read Replica는 <B>ASYNC</B>, Multi-AZ는 <B>SYNC</B> — 반대로 낸 오답이
          항상 있음
        </>,
        <>
          같은 리전 복제 트래픽 <B>무료</B>, 리전 간 <B>유료</B>
        </>,
        <>
          Aurora 쓰기 쿼럼 <B>4/6</B>, 읽기 쿼럼 <B>3/6</B>
        </>,
        <>
          암호화되지 않은 DB는 그 자리에서 암호화 불가 →{" "}
          <B>스냅샷 → 암호화 복사 → 복원</B>
        </>,
        <>
          RDS Proxy는 <B>퍼블릭 접근 불가</B>, 항상 VPC 내부
        </>,
        <>
          ElastiCache 도입 = <B>코드 변경 필요</B> (RDS Proxy는 대부분 불필요)
        </>,
        <>
          게임 리더보드 = <B>Redis Sorted Sets</B>
        </>,
        <>
          Lazy Loading 미스 = <B>3 round trips</B>, Write-Through 단점 ={" "}
          <B>cache churn</B>
        </>,
      ]}
    />
  </div>
);

/* ─────────────────────────  NAV DATA  ───────────────────────── */
const SECTIONS = [
  { id: "rds", no: "78", title: "Amazon RDS 개요", freq: 3, comp: SecRDS },
  {
    id: "replica",
    no: "79",
    title: "읽기 전용 복제본 & Multi-AZ",
    freq: 5,
    comp: SecReplica,
  },
  { id: "aurora", no: "81", title: "Aurora", freq: 4, comp: SecAurora },
  {
    id: "security",
    no: "83",
    title: "RDS & Aurora 보안",
    freq: 4,
    comp: SecSecurity,
  },
  { id: "proxy", no: "84", title: "RDS 프록시", freq: 4, comp: SecProxy },
  { id: "cache", no: "85", title: "ElastiCache", freq: 4, comp: SecCache },
  {
    id: "strategy",
    no: "87",
    title: "ElastiCache 캐싱 전략",
    freq: 5,
    comp: SecStrategy,
  },
  {
    id: "memorydb",
    no: "88",
    title: "MemoryDB for Redis",
    freq: 1,
    comp: SecMemoryDB,
  },
  {
    id: "summary",
    no: "★",
    title: "시험 요약 & 최종 점검",
    freq: 5,
    comp: SecSummary,
  },
];

/* ─────────────────────────  APP  ───────────────────────── */
export default function App() {
  const [active, setActive] = useState("rds");
  const sec = SECTIONS.find((s) => s.id === active);
  const Comp = sec.comp;
  const idx = SECTIONS.findIndex((s) => s.id === active);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: `1px solid ${C.line}`,
          padding: "20px 24px 16px",
          background: `linear-gradient(180deg, #161D28 0%, ${C.bg} 100%)`,
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: 11,
            color: C.orange,
            letterSpacing: 2,
          }}
        >
          AWS CERTIFIED DEVELOPER – ASSOCIATE (DVA-C02)
        </div>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 800,
            margin: "8px 0 4px",
            lineHeight: 1.35,
          }}
        >
          RDS · Aurora · ElastiCache{" "}
          <span style={{ color: C.sub, fontWeight: 500 }}>완전 정리</span>
        </h1>
        <div style={{ fontSize: 12.5, color: C.sub }}>
          강의 78–88 (실습 제외) · 도식 중심 개념 정리 ·{" "}
          <span style={{ color: C.orange }}>★</span> = 출제 빈도
        </div>
      </header>

      <div
        style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start" }}
      >
        {/* Nav */}
        <nav
          style={{
            flex: "0 0 250px",
            minWidth: 220,
            maxWidth: "100%",
            padding: "16px 12px",
            position: "sticky",
            top: 0,
            flexGrow: 1,
          }}
        >
          {SECTIONS.map((s) => {
            const on = s.id === active;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  background: on ? `${C.orange}18` : "transparent",
                  border: `1px solid ${on ? C.orange : "transparent"}`,
                  borderRadius: 10,
                  padding: "10px 12px",
                  marginBottom: 6,
                  cursor: "pointer",
                  color: on ? C.text : C.sub,
                  transition: "background 0.15s",
                }}
              >
                <div
                  style={{ display: "flex", gap: 10, alignItems: "baseline" }}
                >
                  <span
                    style={{
                      fontFamily: mono,
                      fontSize: 11,
                      color: on ? C.orange : "#5A6A85",
                      minWidth: 20,
                    }}
                  >
                    {s.no}
                  </span>
                  <span
                    style={{
                      fontSize: 13.5,
                      fontWeight: on ? 700 : 500,
                      lineHeight: 1.4,
                    }}
                  >
                    {s.title}
                  </span>
                </div>
                <div style={{ marginLeft: 30, marginTop: 3 }}>
                  <Freq n={s.freq} />
                </div>
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <main
          style={{
            flex: "1 1 460px",
            minWidth: 0,
            padding: "20px 24px 60px",
            maxWidth: 860,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 4,
            }}
          >
            <span style={{ fontFamily: mono, fontSize: 12, color: C.orange }}>
              SECTION {sec.no}
            </span>
            <Freq n={sec.freq} label="출제 빈도" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: "4px 0 6px" }}>
            {sec.title}
          </h1>
          <Comp />

          {/* Prev / Next */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 40,
              gap: 12,
            }}
          >
            {idx > 0 ? (
              <button
                onClick={() => setActive(SECTIONS[idx - 1].id)}
                style={navBtnStyle}
              >
                ← {SECTIONS[idx - 1].title}
              </button>
            ) : (
              <span />
            )}
            {idx < SECTIONS.length - 1 ? (
              <button
                onClick={() => setActive(SECTIONS[idx + 1].id)}
                style={{
                  ...navBtnStyle,
                  borderColor: C.orange,
                  color: C.orange,
                }}
              >
                {SECTIONS[idx + 1].title} →
              </button>
            ) : (
              <span />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

const navBtnStyle = {
  background: "transparent",
  border: `1px solid ${C.line}`,
  color: "#C6CFDC",
  borderRadius: 10,
  padding: "10px 16px",
  fontSize: 13,
  cursor: "pointer",
  maxWidth: "48%",
  textAlign: "left",
  lineHeight: 1.5,
};
