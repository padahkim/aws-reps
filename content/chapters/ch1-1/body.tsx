"use client";

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
import S11 from "./sections/11.mdx";
import S12 from "./sections/12.mdx";
import S13 from "./sections/13.mdx";
import S14 from "./sections/14.mdx";
import S15 from "./sections/15.mdx";
import S16 from "./sections/16.mdx";
import S17 from "./sections/17.mdx";
import S18 from "./sections/18.mdx";

/** 섹션 mdx 목록 — 순서 = meta.sections (불일치는 아래 assert가 빌드 프리렌더에서 잡는다). */
const SECTIONS = [
  S01,
  S02,
  S03,
  S04,
  S05,
  S06,
  S07,
  S08,
  S09,
  S10,
  S11,
  S12,
  S13,
  S14,
  S15,
  S16,
  S17,
  S18,
];

if (SECTIONS.length !== sections.length) {
  throw new Error(`ch1-1: 본문 섹션 ${SECTIONS.length}개 ≠ meta.sections ${sections.length}개`);
}

/**
 * 규약 v3 shim — 본문은 intro/outro/sections/*.mdx, 여기는 Sec 래핑(meta 스프레드)과
 * 인트로(첫 섹션 상단)·아웃트로(마지막 섹션 하단) 배치만 담당한다.
 */
export default function Ch11Body({ section }: { section: number }) {
  const S = SECTIONS[section];
  if (!S) throw new Error(`ch1-1: 섹션 인덱스 ${section} 범위 밖 (0..${SECTIONS.length - 1})`);
  return (
    <>
      {section === 0 && <Intro />}
      <Sec {...sections[section]}>
        <S />
      </Sec>
      {section === SECTIONS.length - 1 && <Outro />}
    </>
  );
}
