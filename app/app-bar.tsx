"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 전역 앱바 (#247 — 부모 에픽 #246): 모든 화면에 **뒤로 + 홈**.
 *
 * 왜 있어야 하나. 이 앱은 홈 화면에 설치해 쓰는 PWA 다 (`app/manifest.ts` 의
 * `display: "standalone"`). 설치본에는 주소창도 브라우저 뒤로 버튼도 없고, iOS 는 가장자리
 * 스와이프 뒤로도 잘 듣지 않는다. 그런데 앱 쪽에도 돌아갈 장치가 없었다 — `app/layout.tsx` 가
 * `<main>` 만 감쌌기 때문이다. 그래서 챕터 상호 참조(`ChLink`)를 한 번 타면 읽던 자리가
 * 사라지고, `/review` 는 아예 나갈 길이 없는 막다른 길이었다.
 * `app/review-link.tsx` 주석이 "내비가 생기면"이라고 적어 둔 그 내비가 이것이다.
 *
 * **범위는 되돌아오기 하나다** (#247 범위 제외). 진도·검색·설정은 여기 얹지 않는다.
 *
 * 자리: 상단 sticky. 하단 고정을 쓰지 않은 이유는 두 가지다 — ① 갱신 배너(`.sw-update`)가
 * 이미 화면 아래 고정이라 자리를 다툰다, ② sticky 는 흐름에서 제 높이를 차지하므로 그 배너가
 * 겪었던 "고정 요소가 본문을 가려 spacer 를 세운다" 문제(#238)가 처음부터 생기지 않는다.
 * 실기기에서 엄지 도달성이 문제로 드러나면 하단으로 옮기고 #247 에 결정을 남긴다.
 */
export function AppBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { depth, markClimb } = useInAppDepth(pathname);

  const isHome = pathname === "/";

  const back = useCallback(() => {
    // 앱 안에서 밟아 온 자리가 있으면 진짜 뒤로 — 스크롤 위치 복원은 이 경로에만 있다
    // (App Router 가 back/forward 에 한해 복원한다). 계층 상위로 "이동"하면 늘 맨 위로 간다.
    if (depth > 0) {
      router.back();
      return;
    }
    // 앱 내 히스토리가 없다 = 딥링크·새로고침·설치 후 첫 실행. 계층 상위로 올려 보내는데,
    // **push 가 아니라 replace 다**. push 면 그 한 걸음이 히스토리에 쌓여, 올라간 자리에서
    // 다시 뒤로를 누를 때 방금 떠난 아래 화면으로 되돌아간다 — 섹션↔목차를 오가며 홈에는
    // 영영 닿지 못하는 핑퐁이 된다. replace 는 "원래 여기서 왔어야 할 자리"로 갈아끼우는
    // 것이라 계속 누르면 목차 → 홈으로 계층을 타고 올라간다.
    markClimb();
    router.replace(parentOf(pathname));
  }, [depth, markClimb, pathname, router]);

  // 원본 검수 도구(/_source)는 dev·preview 전용 화면이고 앱의 라우트 체계 밖이라 제외한다.
  // 생성된 라우트가 app/%5Fsource/ 라 이 레이아웃에 딸려 들어오는 것뿐이다
  // (scripts/gen-source-routes.mjs 머리말 참조).
  if (pathname.startsWith("/_source")) return null;

  return (
    <nav className="app-bar" aria-label="전역 내비게이션">
      {/* 배경·아래선은 화면 폭을 다 쓰고, 항목은 본문과 같은 48rem 컬럼에 세운다 —
          안 그러면 넓은 화면에서 뒤로·홈만 뷰포트 양끝으로 날아가 본문과 어긋난다 */}
      <div className="app-bar-inner">
        {isHome ? (
          // 홈에서는 돌아갈 앱 내 화면이 없다. 자리는 비우되 **접지는 않는다** —
          // 바 높이가 라우트마다 달라지면 홈↔챕터 이동마다 본문이 위아래로 튄다.
          <span />
        ) : (
          <button type="button" className="app-bar-btn" onClick={back}>
            <Chevron />
            뒤로
          </button>
        )}

        {isHome ? (
          <span className="app-bar-brand">DVA 학습</span>
        ) : (
          <Link className="app-bar-btn" href="/">
            <House />홈
          </Link>
        )}
      </div>
    </nav>
  );
}

/**
 * 계층 상위 — 앱 내 히스토리가 없을 때(딥링크·새로고침·설치 후 첫 실행) 뒤로가 보낼 곳.
 *
 *   /chapters/{id}/{sec}  →  /chapters/{id}   그 챕터의 목차
 *   /chapters/{id}        →  /               홈(= 챕터 목록)
 *   /glossary             →  /
 *   /review               →  /
 *
 * 섹션 페이지만 예외이고 나머지는 전부 홈이다 — 이 앱의 계층이 2단이라 그렇다.
 * 라우트가 늘면 여기에 줄을 추가한다 (라우트 정본은 app/ 디렉터리 구조다).
 */
function parentOf(pathname: string): string {
  const sec = /^\/chapters\/([^/]+)\/[^/]+\/?$/.exec(pathname);
  return sec ? `/chapters/${sec[1]}` : "/";
}

/**
 * 앱 안에서 몇 걸음 들어와 있는가 — `router.back()` 을 눌러도 되는지의 판단 근거.
 *
 * 브라우저는 이걸 알려주지 않는다. `history.length` 는 **이 탭에서 열었던 다른 사이트까지**
 * 세므로 검색 결과에서 막 들어온 첫 화면에서도 2 이상이고, 그 값으로 back() 을 부르면 앱을
 * 벗어난다. 그래서 직접 센다: 클라이언트 이동마다 +1, 뒤로 갈 때마다 -1.
 *
 * 0 에서 시작하는 것이 정확히 "이 문서로 들어온 자리"다 — 새로고침·딥링크·설치형 PWA 의 첫
 * 실행이 모두 여기다. 그 상태에서 back() 은 앱 밖(또는 아무 데도 아닌 곳)으로 가므로 쓰지 않는다.
 *
 * **앞으로 가기는 뒤로로 잘못 센다** (브라우저 탭에서 앞으로 버튼을 눌렀을 때). 구분하려면
 * 밟아 온 경로 전체를 들고 대조해야 하는데, 이 앱의 주 무대인 설치형 PWA 에는 앞으로 버튼이
 * 아예 없고, 틀렸을 때의 결과도 "뒤로가 계층 상위로 간다"는 안전한 쪽이라 세지 않는다.
 */
function useInAppDepth(pathname: string) {
  const [depth, setDepth] = useState(0);
  // 마지막으로 센 경로. null 이면 아직 첫 렌더 — 그 자리는 이동이 아니라 진입 지점이다.
  const seen = useRef<string | null>(null);
  const wentBack = useRef(false);
  const climbed = useRef(false);

  // 계층 상위로 갈아끼우는 중임을 알린다 (위 `back` 의 replace). 경로는 바뀌지만 히스토리에
  // 쌓인 건 없으므로 깊이도 그대로여야 한다 — 여기서 세면 replace 를 push 로 오인하게 된다.
  const markClimb = useCallback(() => {
    climbed.current = true;
  }, []);

  useEffect(() => {
    const onPop = () => {
      // 경로가 그대로면 해시만 오간 것이다 (용어집의 `/glossary#용어id` 앵커).
      // 그건 화면 이동이 아니므로 깊이를 건드리지 않는다.
      if (window.location.pathname !== seen.current) wentBack.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (seen.current === null) {
      seen.current = pathname;
      return;
    }
    if (seen.current === pathname) return;
    seen.current = pathname;
    if (climbed.current) {
      climbed.current = false;
      wentBack.current = false;
    } else if (wentBack.current) {
      wentBack.current = false;
      setDepth((d) => Math.max(0, d - 1));
    } else {
      setDepth((d) => d + 1);
    }
  }, [pathname]);

  return { depth, markClimb };
}

/* 글리프는 인라인 SVG 다 — 이모지·문자 글리프는 기기마다 크기와 세로 정렬이 제각각이고,
   lucide-react 를 부르면 이 한 줄짜리 바 때문에 아이콘 런타임이 전 페이지에 실린다.
   currentColor 라 다크 테마 대응은 글자색을 따라간다. */
function Chevron() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 5 8 12l7 7" />
    </svg>
  );
}

function House() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />
    </svg>
  );
}
