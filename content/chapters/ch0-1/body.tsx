"use client";

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
 * 규약 v3 shim — 본문은 intro/outro/sections/*.mdx, 여기는 Sec 래핑(meta 스프레드)과
 * 인트로(첫 섹션 상단)·아웃트로(마지막 섹션 하단) 배치만 담당한다.
 */
export default function Ch01Body({ section }: { section: number }) {
  const S = SECTIONS[section];
  if (!S) throw new Error(`ch0-1: 섹션 인덱스 ${section} 범위 밖 (0..${SECTIONS.length - 1})`);
  // 챕터 인트로는 문구 재작성 중 — intro.mdx 복원 시 첫 섹션 상단 배치도 되살린다 (규약 v3).
  return (
    <>
      <Sec {...sections[section]}>
        <S />
      </Sec>
      {section === SECTIONS.length - 1 && <Outro />}
    </>
  );
}
