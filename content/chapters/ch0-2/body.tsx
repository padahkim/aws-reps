"use client";

import type { ReactNode } from "react";
import { Sec } from "../ui";
import { sections } from "./meta";
import Intro from "./intro.mdx";
import Outro from "./outro.mdx";
import S01 from "./sections/01.mdx";
import S02 from "./sections/02.mdx";
import S03 from "./sections/03.mdx";
import S04 from "./sections/04.mdx";
import S05 from "./sections/05.mdx";
import S06 from "./sections/06.mdx";
import S07 from "./sections/07.mdx";
import S08 from "./sections/08.mdx";
import S09 from "./sections/09.mdx";
import S10 from "./sections/10.mdx";

/** 섹션 mdx 목록 — 순서 = meta.sections (불일치는 아래 assert가 빌드 프리렌더에서 잡는다). */
const SECTIONS = [S01, S02, S03, S04, S05, S06, S07, S08, S09, S10];

if (SECTIONS.length !== sections.length) {
  throw new Error(`ch0-2: 본문 섹션 ${SECTIONS.length}개 ≠ meta.sections ${sections.length}개`);
}

/**
 * 규약 v3 shim — 본문은 intro/outro/sections/*.mdx, 여기는 Sec 래핑(meta 스프레드)과
 * 인트로(첫 섹션 상단)·아웃트로(마지막 섹션 하단)·섹션 꼬리 슬롯 배치만 담당한다.
 * afterSection(인출 개념 카드)은 본문과 아웃트로 사이 — 이 챕터는 아직 session 데이터가 없어
 * 실제로는 비어 있지만, 슬롯은 규약이라 모든 body 가 같은 자리에 둔다.
 * beforeBody(미리 보는 질문)는 <Sec> 의 첫 자식 — 섹션 헤더 바로 아래, 본문 앞이다 (v3.1 #161).
 */
export default function Ch02Body({
  section,
  afterSection,
  beforeBody,
}: {
  section: number;
  afterSection?: ReactNode;
  beforeBody?: ReactNode;
}) {
  const S = SECTIONS[section];
  if (!S) throw new Error(`ch0-2: 섹션 인덱스 ${section} 범위 밖 (0..${SECTIONS.length - 1})`);
  return (
    <>
      {section === 0 && <Intro />}
      <Sec {...sections[section]}>
        {beforeBody}
        <S />
      </Sec>
      {afterSection}
      {section === SECTIONS.length - 1 && <Outro />}
    </>
  );
}
