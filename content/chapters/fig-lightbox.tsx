"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * 도식 풀스크린 라이트박스 (#201) — Fig 프레임을 탭/클릭하면 그 도식(SVG)을 전체 화면으로
 * 열고 핀치줌·팬(터치), 휠·더블탭/더블클릭 줌(데스크탑)으로 살펴본다. #193 Term 팝오버와
 * 같은 노선의 자체 구현(의존성 0) — 본문 도식은 전부 viewBox 있는 인라인 SVG라 벡터 그대로
 * 키워도 선명하고, 제스처는 Pointer Events 하나로 터치·마우스를 같이 받는다.
 *
 * 오버레이에 children 을 React 로 한 번 더 렌더하지 않고 **대상 SVG 를 DOM 클론 → id 전면
 * 재작성(lb- 접두) → 직렬화**해 넣는다. 같은 id 가 문서에 두 번 생기면 url(#…) 참조가 문서
 * 첫 번째(본문 쪽)로 풀리는데, FigSwitch 처럼 본문 쪽이 display:none 인 경우 마커 해석이
 * 엔진마다 갈린다 — ui.tsx FigSwitch 의 "변형별 별도 id" 규칙과 같은 문제의식이고, 클론을
 * 자기완결로 만들면 중복 자체가 없다. 대상이 정적 도식뿐이라(#201 범위) 클론으로 이벤트
 * 핸들러가 떨어져 나가도 잃는 것이 없다.
 *
 * tokens: ui.tsx 의 C/MONO 값을 Fig 가 넘겨준다 — 여기서 ui 를 import 하면 ui(Fig가 이
 * 파일을 씀) ↔ 이 파일 간 모듈 순환이 생겨 값 주입으로 피했다. 값의 원천은 ui 하나다(#156).
 */

const MAX_SCALE = 8; // 맞춤(1) 기준 최대 배율 — 텍스트 많은 도식도 이 이상은 픽셀 탐험이다

export type FigZoomTokens = {
  card: string;
  line: string;
  ink: string;
  inkSoft: string;
  mono: string;
};

type Lightbox = { html: string; vbw: number; vbh: number };
/** 오버레이가 덮을 실제 화면 영역 (#267) — layout viewport 가 아니라 visual viewport 기준 */
type VisualRect = { top: number; left: number; width: number; height: number };

export function FigZoom({
  tokens,
  caption,
  children,
}: {
  tokens: FigZoomTokens;
  caption?: ReactNode;
  children: ReactNode;
}) {
  const areaRef = useRef<HTMLDivElement>(null); // 본문 쪽 도식 래퍼 = 탭 트리거
  const frameRef = useRef<HTMLDivElement>(null); // 오버레이의 변환 안 걸린 기준 좌표계
  const stageRef = useRef<HTMLDivElement>(null); // 변환 대상 (클론 SVG 컨테이너)
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [lb, setLb] = useState<Lightbox | null>(null);
  // 푸터(캡션+힌트) 실측 높이 — 긴 캡션이 여러 줄로 감기면 고정 예약(4.25rem)을 넘어
  // 도식 하단과 겹친다 (#229 R2). 열 때·리사이즈 때 재고 프레임 하단을 그만큼 비운다.
  const [footerH, setFooterH] = useState(0);
  // 확대 중인가 — 푸터 힌트가 "지금 실제로 되는 조작"만 말하게 하는 유일한 리렌더 트리거
  // (#268). 배율의 진실은 아래 view ref 이고 여기 있는 건 불리언 하나라, 맞춤↔확대 경계를
  // 넘는 순간에만 리렌더가 난다.
  const [zoomed, setZoomed] = useState(false);
  // 오버레이가 덮을 영역 (#267) — iOS Safari 는 주소창이 펼쳐진 동안 layout viewport 가
  // visual viewport 보다 크고 위로 올라가 있다. position:fixed + inset:0 은 그 큰 쪽에
  // 붙으므로 오버레이 위아래가 브라우저 크롬 밑으로 들어가고, 닫기 버튼 상단이 주소창에
  // 물렸다. visualViewport 를 따라가 보이는 영역에만 오버레이를 세운다.
  const [vv, setVv] = useState<VisualRect | null>(null);

  // 제스처 상태는 리렌더 없이 ref + 직접 스타일로 다룬다 — pointermove 는 60~120Hz 로 온다
  const view = useRef({ s: 1, tx: 0, ty: 0 }); // stage transform: translate(tx,ty) scale(s), origin 0 0
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinched = useRef(false); // 이번 제스처에 두 손가락이 개입했으면 탭으로 치지 않는다
  const downAt = useRef({ x: 0, y: 0, moved: false });
  const lastTap = useRef({ t: 0, x: 0, y: 0 });
  const fitAt = useRef(0); // 탭으로 맞춤 배율에 복귀한 시각 — 뒤이은 탭이 닫기로 번지지 않게 (#268)

  const apply = () => {
    const el = stageRef.current;
    if (!el) return;
    const { s, tx, ty } = view.current;
    el.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
    // 같은 값이면 React 가 리렌더를 건너뛴다 — pointermove 마다 불러도 비용이 없다
    setZoomed(s > 1.001);
  };

  const reset = () => {
    view.current = { s: 1, tx: 0, ty: 0 };
    apply();
  };

  /** (clientX, clientY)를 고정점으로 배율을 factor 배 조정한다. 1 미만으로는 안 내려간다(맞춤이 바닥). */
  const zoomAt = (clientX: number, clientY: number, factor: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;
    const v = view.current;
    const s2 = Math.min(MAX_SCALE, Math.max(1, v.s * factor));
    const f = s2 / v.s;
    v.tx = px - (px - v.tx) * f;
    v.ty = py - (py - v.ty) * f;
    v.s = s2;
    if (s2 === 1) {
      v.tx = 0; // 맞춤 배율로 돌아오면 중앙 정렬로 스냅 — 팬 잔여로 어긋난 채 남지 않게
      v.ty = 0;
    }
    apply();
  };

  const open = () => {
    const root = areaRef.current;
    if (!root) return;
    // FigSwitch 도식은 가로형(.fig-wide)을 연다 (#201 결정 — 전체 화면 + 줌이면 가로형이
    // 정보량 우위). 모바일에서 .fig-wide 는 display:none 이지만 DOM 에는 있어 클론된다.
    const svg = root.querySelector<SVGSVGElement>(".fig-wide svg") ?? root.querySelector("svg");
    if (!svg) return; // Fig 에 SVG 가 없는 비정상 사용 — 조용히 무시 (규약상 도식 = 인라인 SVG)
    const vb = svg.viewBox.baseVal;
    const vbw = (vb && vb.width) || svg.clientWidth || 1;
    const vbh = (vb && vb.height) || svg.clientHeight || 1;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    // 본문용 크기 지정(FlowSvg 의 minWidth 등)을 걷어내고 프레임 채움 + meet 맞춤에 맡긴다
    clone.removeAttribute("width");
    clone.removeAttribute("height");
    clone.style.width = "100%";
    clone.style.height = "100%";
    clone.style.minWidth = "0";
    clone.style.display = "block";
    // id 전면 재작성 — 따옴표·괄호가 경계라 접두 id(arr ↔ arr-v 등)끼리 오염되지 않는다.
    // xlink:href="#…" 도 href="#…" 문자열을 품으므로 같은 치환에 걸린다.
    const ids = Array.from(clone.querySelectorAll("[id]"), (el) => el.id).filter(Boolean);
    let html = clone.outerHTML;
    for (const id of ids) {
      html = html
        .replaceAll(`id="${id}"`, `id="lb-${id}"`)
        .replaceAll(`url(#${id})`, `url(#lb-${id})`)
        .replaceAll(`href="#${id}"`, `href="#lb-${id}"`);
    }
    view.current = { s: 1, tx: 0, ty: 0 };
    pointers.current.clear();
    pinched.current = false;
    setZoomed(false); // apply() 는 stage 가 생기기 전이라 안 불린다 — 직전 세션의 값을 물려받지 않게
    fitAt.current = 0;
    setLb({ html, vbw, vbh });
  };

  const close = () => {
    setLb(null);
    areaRef.current?.focus(); // Term 과 같은 규칙 — 닫힘이 초점을 유실시키지 않는다
  };

  /**
   * 탭 지점이 도식 밖(캔버스 여백)인가 — "바깥 탭 닫기"의 판정. SVG 는 프레임을 꽉 채우므로
   * e.target 으로는 여백을 못 가른다(레터박스도 svg 요소다). viewBox 의 meet 배치 사각형에
   * stage 변환(translate→scale, origin 0 0)을 얹어 실제 그림 영역을 계산한다.
   */
  const isOutsideContent = (clientX: number, clientY: number) => {
    const frame = frameRef.current;
    if (!frame || !lb) return false;
    const r = frame.getBoundingClientRect(); // 변환은 stage 에만 걸려 frame 좌표는 안정
    const fit = Math.min(r.width / lb.vbw, r.height / lb.vbh);
    const w = lb.vbw * fit;
    const h = lb.vbh * fit;
    const v = view.current;
    const x0 = v.tx + ((r.width - w) / 2) * v.s;
    const y0 = v.ty + ((r.height - h) / 2) * v.s;
    const px = clientX - r.left;
    const py = clientY - r.top;
    const pad = 12; // 도식 가장자리 오차 여유 — 경계 스치는 탭으로 닫히지 않게
    return px < x0 - pad || px > x0 + w * v.s + pad || py < y0 - pad || py > y0 + h * v.s + pad;
  };

  // 푸터 측정은 페인트 전에 — 측정 전 프레임(bottom 임시값)이 화면에 뜨지 않게 한다.
  // zoomed 도 의존성이다: 힌트 문구가 바뀌면 좁은 화면에서 줄 수가 달라진다 (#268)
  // vv?.width 도 의존성이다: 오버레이 폭은 visual viewport 를 따라가므로(아래 #267 효과),
  // 페이지가 이미 핀치 확대된 채 열리거나 window resize 없이 visual viewport 만 좁아지면
  // 캡션이 새로 감긴다. 그때 다시 재지 않으면 footerH 가 작게 남아 도식이 캡션을 덮는다.
  useLayoutEffect(() => {
    if (!lb) {
      setFooterH(0);
      return;
    }
    const measure = () => setFooterH(footerRef.current?.offsetHeight ?? 0);
    measure();
    window.addEventListener("resize", measure); // 회전 시 캡션 줄 수가 달라진다
    return () => window.removeEventListener("resize", measure);
  }, [lb, zoomed, vv?.width]);

  // 오버레이를 visual viewport 에 맞춘다 (#267). position:fixed 는 layout viewport 기준인데,
  // iOS Safari 는 주소창이 펼쳐진 동안 그 둘이 어긋나 오버레이가 브라우저 크롬 밑으로 밀린다
  // (제보: 닫기 버튼 위쪽 ~14px 이 주소창 뒤). 툴바 접힘·펼침과 키보드 개폐가 모두
  // visualViewport 의 resize·scroll 로 오므로 그때마다 다시 맞춘다. 미지원 브라우저는
  // vv 가 null 로 남아 예전 그대로(전체 화면) 동작한다 — 그쪽에는 어긋남 자체가 없다.
  useLayoutEffect(() => {
    const target = typeof window === "undefined" ? null : window.visualViewport;
    if (!lb || !target) {
      setVv(null);
      return;
    }
    const track = () =>
      setVv({
        top: target.offsetTop,
        left: target.offsetLeft,
        width: target.width,
        height: target.height,
      });
    track();
    target.addEventListener("resize", track);
    target.addEventListener("scroll", track);
    return () => {
      target.removeEventListener("resize", track);
      target.removeEventListener("scroll", track);
    };
  }, [lb]);

  // 열림 동안: 초점 이동·배경 스크롤 잠금·ESC·휠 줌·리사이즈(회전) 시 맞춤 복귀
  useEffect(() => {
    if (!lb) return;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // 터치 쪽은 오버레이 touch-action:none 이 맡는다
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key === "Tab") {
        // 단일 포커스 트랩 — 오버레이의 포커스 가능 요소는 닫기 버튼 하나라, Tab/Shift+Tab이
        // 배경 콘텐츠로 새지 않게 버튼에 고정한다 (aria-modal 은 의미론일 뿐 강제하지 않는다)
        e.preventDefault();
        closeRef.current?.focus();
        return;
      }
      // 키보드 줌·팬 (#229 R2) — 포인터 없이도 확대·이동이 가능해야 라이트박스가 성립한다.
      // 줌은 프레임 중심 기준, 화살표는 누른 방향으로 시야가 이동한다 (= 콘텐츠는 반대로).
      const rect = frameRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 1.25);
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 0.8);
      } else if (e.key === "0") {
        e.preventDefault();
        reset();
      } else if (e.key.startsWith("Arrow")) {
        e.preventDefault();
        const v = view.current;
        if (v.s > 1.001) {
          const step = 60;
          if (e.key === "ArrowLeft") v.tx += step;
          else if (e.key === "ArrowRight") v.tx -= step;
          else if (e.key === "ArrowUp") v.ty += step;
          else if (e.key === "ArrowDown") v.ty -= step;
          apply();
        }
      }
    };
    const onResize = () => reset(); // 맞춤 배치가 뷰포트 함수라 회전 시 변환 잔여가 어긋난다 — 맞춤으로 복귀
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // deltaMode 환산: 1(라인)≈16px, 2(페이지)≈뷰포트 높이 — 페이지 단위를 픽셀로 취급하면
      // delta 1이 배율 0.9985 가 되어 줌이 죽은 것처럼 보인다
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * unit * 0.0015));
    };
    const ov = overlayRef.current;
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    // React 의 onWheel 은 패시브라 preventDefault(페이지 줌·스크롤 차단)가 안 먹는다 — 네이티브로 단다
    ov?.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      ov?.removeEventListener("wheel", onWheel);
    };
    // close·reset·zoomAt 은 ref 만 만져 재구독이 필요 없다 — 의존성은 열림/닫힘 전환뿐
  }, [lb]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // 우클릭·휠클릭은 제스처가 아니다 — 컨텍스트 메뉴 중 탭 판정으로 닫히는 것 방지 (터치·펜 접촉은 0)
    if ((e.target as Element).closest("button")) return; // 닫기 버튼은 자체 click 에 맡긴다
    try {
      overlayRef.current?.setPointerCapture(e.pointerId);
    } catch {
      // 이미 소멸한(또는 합성) 포인터면 캡처가 InvalidPointerId 로 던진다 — 캡처는
      // 오버레이 밖 이탈 대비 최적화일 뿐이라, 실패해도 제스처 추적은 그대로 진행한다
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      pinched.current = false;
      downAt.current = { x: e.clientX, y: e.clientY, moved: false };
    } else {
      pinched.current = true;
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const p = pointers.current.get(e.pointerId);
    if (!p) return;
    const v = view.current;
    if (pointers.current.size === 1) {
      if (Math.abs(e.clientX - downAt.current.x) + Math.abs(e.clientY - downAt.current.y) > 8) {
        downAt.current.moved = true;
      }
      if (v.s > 1.001) {
        // 팬은 확대 중에만 — 맞춤 상태에서 그림을 끌어 흘리는 조작은 길 잃기만 만든다
        v.tx += e.clientX - p.x;
        v.ty += e.clientY - p.y;
        apply();
      }
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    } else if (pointers.current.size === 2) {
      const other = Array.from(pointers.current.entries()).find(([id]) => id !== e.pointerId)?.[1];
      if (!other) return;
      const d0 = Math.hypot(p.x - other.x, p.y - other.y);
      const m0 = { x: (p.x + other.x) / 2, y: (p.y + other.y) / 2 };
      const d1 = Math.hypot(e.clientX - other.x, e.clientY - other.y);
      const m1 = { x: (e.clientX + other.x) / 2, y: (e.clientY + other.y) / 2 };
      v.tx += m1.x - m0.x; // 중점 이동 = 두 손가락 팬 (핀치 중 팬은 배율과 무관하게 허용)
      v.ty += m1.y - m0.y;
      if (d0 > 0) zoomAt(m1.x, m1.y, d1 / d0); // 간격 변화 = 중점 고정 줌 (apply 포함)
      else apply();
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }
  };

  const onPointerEnd = (e: React.PointerEvent) => {
    if (!pointers.current.delete(e.pointerId)) return;
    if (e.type === "pointercancel") return;
    if (pinched.current || downAt.current.moved || pointers.current.size > 0) return;
    // 여기 도달 = 이동 없는 싱글 탭.
    if (view.current.s > 1.001) {
      // 확대 중 (#268): 도식 사각형이 배율만큼 같이 커져 프레임을 덮는 배율부터는 "도식 밖"이
      // 남지 않는다 — 바깥 탭 닫기가 원리적으로 성립하지 않는 구간이다. 그래서 확대 중의 단일
      // 탭은 1단계 이탈로 쓴다: 맞춤 배율로 돌아가고, 닫기는 그다음 탭 몫이다. 폰에는 ESC 가
      // 없으니 이 경로가 없으면 남는 건 닫기 버튼 하나뿐이다.
      reset();
      // 이어지는 탭이 더블탭(=재확대)으로 읽히지 않게 탭 이력을 끊는다. 예전 "더블탭 = 맞춤
      // 복귀"는 첫 탭이 이미 맞춤으로 돌리므로 결과가 같다.
      lastTap.current = { t: 0, x: 0, y: 0 };
      fitAt.current = e.timeStamp;
      return;
    }
    // 맞춤 복귀 직후의 연타(= 예전 더블탭 습관)는 **없던 탭**으로 친다 — 확대를 풀려던 손이
    // 오버레이째 닫아 버리는 사고를 막는다. 의도적인 두 번째 탭은 이 창을 넘겨서 온다.
    // 이력(lastTap)에도 남기지 않는 것이 핵심이다: 남기면 쿨다운이 풀린 뒤의 첫 탭이 이
    // 무시된 탭과 짝지어 더블탭(= 재확대)으로 읽혀, 나가려던 탭이 도로 확대로 되돌아온다.
    if (e.timeStamp - fitAt.current < 350) return;
    const lt = lastTap.current;
    if (e.timeStamp - lt.t < 350 && Math.hypot(e.clientX - lt.x, e.clientY - lt.y) < 28) {
      lastTap.current = { t: 0, x: 0, y: 0 };
      zoomAt(e.clientX, e.clientY, 2.5); // 맞춤 상태의 더블탭 = 확대 (반대 방향은 위에서 처리)
      return;
    }
    lastTap.current = { t: e.timeStamp, x: e.clientX, y: e.clientY };
    if (isOutsideContent(e.clientX, e.clientY)) close();
  };

  return (
    <>
      <div
        ref={areaRef}
        role="button"
        tabIndex={0}
        aria-label="도식 크게 보기"
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault(); // Space 의 페이지 스크롤 차단
            open();
          }
        }}
        style={{ position: "relative", cursor: "zoom-in" }}
      >
        {children}
        {/* 어포던스 — 우상단 돋보기 배지. 탭 대상은 프레임 전체고 배지는 표시만 한다 */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            display: "inline-flex",
            padding: 5,
            borderRadius: 8,
            background: tokens.card,
            border: `1px solid ${tokens.line}`,
            color: tokens.inkSoft,
            lineHeight: 0,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          >
            <circle cx="10.5" cy="10.5" r="6.8" />
            <path d="M15.6 15.6 21 21 M10.5 7.6 v5.8 M7.6 10.5 h5.8" />
          </svg>
        </span>
      </div>
      {lb &&
        createPortal(
          <div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="도식 확대 보기"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            style={{
              position: "fixed",
              // vv 가 있으면 보이는 화면에만 세운다 (#267). 없으면(미지원) 예전대로 전체 화면.
              top: vv ? vv.top : 0,
              left: vv ? vv.left : 0,
              width: vv ? vv.width : "100%",
              height: vv ? vv.height : "100%",
              zIndex: 100, // Term 팝오버(10)·기존 z-index 위 — 전면 모달
              background: tokens.card, // 도식은 흰 카드 전제로 그려졌다 — 다크 테마에서도 흰 캔버스 고정
              touchAction: "none", // 네이티브 스크롤·더블탭 줌을 끊고 Pointer Events 로만 다룬다
              overscrollBehavior: "contain",
              userSelect: "none",
              WebkitUserSelect: "none",
              cursor: "grab",
            }}
          >
            {/* frame = 닫기 버튼·캡션을 피한 안전 영역. 변환은 그 안 stage 에만 건다.
                하단은 푸터 실측 높이(useLayoutEffect)로 비운다 — 측정 전 한 프레임은 페인트되지 않는다 */}
            <div
              ref={frameRef}
              style={{
                position: "absolute",
                top: "calc(3.25rem + env(safe-area-inset-top, 0px))",
                left: "max(0.75rem, env(safe-area-inset-left, 0px))",
                right: "max(0.75rem, env(safe-area-inset-right, 0px))",
                bottom: footerH + 8,
              }}
            >
              {/* __html 은 이 문서가 방금 렌더한 자사 SVG(리포 커밋 콘텐츠)의 직렬화 + 리터럴
                  id 치환 결과다 — 외부 입력이 끼어드는 경로가 없어 새니타이저 대상이 아니다 */}
              <div
                ref={stageRef}
                style={{ position: "absolute", inset: 0, transformOrigin: "0 0" }}
                dangerouslySetInnerHTML={{ __html: lb.html }}
              />
            </div>
            <button
              ref={closeRef}
              type="button"
              aria-label="닫기"
              onClick={close}
              style={{
                position: "absolute",
                // env() 는 지금 전부 0 이다(viewport-fit=cover 미사용 — globals.css .app-bar
                // 주석). 나중에 cover 로 바꿔도 버튼이 노치에 물리지 않게 미리 걸어 둔다.
                top: "calc(10px + env(safe-area-inset-top, 0px))",
                right: "calc(10px + env(safe-area-inset-right, 0px))",
                width: 40,
                height: 40,
                borderRadius: 10,
                border: `1px solid ${tokens.line}`,
                background: tokens.card,
                color: tokens.ink,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 0,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              >
                <path d="M5 5 19 19 M19 5 5 19" />
              </svg>
            </button>
            <div
              ref={footerRef}
              style={{
                position: "absolute",
                left: "50%",
                bottom: 0,
                transform: "translateX(-50%)",
                width: "min(44rem, 100%)",
                padding: "0.5rem 1rem calc(0.9rem + env(safe-area-inset-bottom, 0px))",
                textAlign: "center",
                pointerEvents: "none", // 캡션 위에서도 제스처·바깥 탭이 오버레이로 통한다
                color: tokens.inkSoft,
              }}
            >
              {caption ? <div style={{ fontSize: "0.8rem" }}>{caption}</div> : null}
              <div style={{ fontFamily: tokens.mono, fontSize: "0.66rem", marginTop: 4, opacity: 0.75 }}>
                {/* 배율에 따라 문구를 바꾼다 (#268) — 확대 중에는 "빈 곳"이 남지 않는
                    구간이 있어 바깥 탭 닫기가 성립하지 않는다. 안 되는 조작을 안내하지 않는다. */}
                {zoomed
                  ? "끌기·화살표 = 이동 · 탭·0 = 맞춤으로 · ✕·ESC = 닫기"
                  : "핀치·휠·더블탭·+/− = 확대 · 빈 곳 탭·ESC = 닫기"}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
