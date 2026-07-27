"use client";

import type { ReactNode } from "react";
import { Sec } from "../ui";
import { sections } from "./meta";
import Intro from "./intro.mdx";
import Outro from "./outro.mdx";
import S00 from "./sections/00.mdx";
import S01 from "./sections/01.mdx";
import S02 from "./sections/02.mdx";
import S03 from "./sections/03.mdx";

/** 섹션 mdx 목록 — 순서 = meta.sections (불일치는 아래 assert가 빌드 프리렌더에서 잡는다). */
const SECTIONS = [S00, S01, S02, S03];

if (SECTIONS.length !== sections.length) {
  throw new Error(`ch0-1: 본문 섹션 ${SECTIONS.length}개 ≠ meta.sections ${sections.length}개`);
}

/**
 * 인트로를 띄울 섹션 인덱스. 규약 기본값은 0(첫 섹션 상단)이지만, 이 챕터의 00은
 * "왜 AI 시대에 AWS인가"라는 동기 부여 서문이라 본문 흐름 밖에 있다 — 인트로의
 * "자, 그럼 시작해 볼까요?"가 실제 내용(01 리전/AZ)으로 바로 이어지도록 01에 붙인다.
 */
const INTRO_AT = 1;

/**
 * 규약 v3 shim — 본문은 intro/outro/sections/*.mdx, 여기는 Sec 래핑(meta 스프레드)과
 * 인트로·아웃트로(마지막 섹션 하단)·섹션 꼬리 슬롯 배치만 담당한다.
 * afterSection(인출 개념 카드)은 본문과 아웃트로 사이 — 섹션 단위 인출이 챕터 마무리보다 먼저다.
 * beforeBody(미리 보는 질문)는 <Sec> 의 첫 자식 — 섹션 헤더 바로 아래, 본문 앞이다 (v3.1 #161).
 */
export default function Ch01Body({
  section,
  afterSection,
  beforeBody,
}: {
  section: number;
  afterSection?: ReactNode;
  beforeBody?: ReactNode;
}) {
  const S = SECTIONS[section];
  if (!S) throw new Error(`ch0-1: 섹션 인덱스 ${section} 범위 밖 (0..${SECTIONS.length - 1})`);
  return (
    <>
      {section === INTRO_AT && <Intro />}
      <Sec {...sections[section]}>
        {beforeBody}
        <S />
      </Sec>
      {afterSection}
      {section === SECTIONS.length - 1 && <Outro />}
    </>
  );
}
