"use client";

import type { ReactNode } from "react";
import { Sec } from "../ui";
import { sections } from "./meta";
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
 * 규약 v3 shim — 본문은 outro/sections/*.mdx, 여기는 Sec 래핑(meta 스프레드)과
 * 아웃트로(마지막 섹션 하단)·섹션 꼬리 슬롯 배치만 담당한다.
 * 인트로는 v3.2(#174)부터 목차 페이지 몫이라 여기서 다루지 않는다.
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
      <Sec {...sections[section]}>
        {beforeBody}
        <S />
      </Sec>
      {afterSection}
      {section === SECTIONS.length - 1 && <Outro />}
    </>
  );
}
