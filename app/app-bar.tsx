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
  const { depth, markClimb, takeHashSteps } = useInAppDepth(pathname);

  const isHome = pathname === "/";

  const back = useCallback(() => {
    // 앱 안에서 밟아 온 자리가 있으면 진짜 뒤로 — 스크롤 위치 복원은 이 경로에만 있다
    // (App Router 가 back/forward 에 한해 복원한다). 계층 상위로 "이동"하면 늘 맨 위로 간다.
    if (depth > 0) {
      // 같은 화면에 해시 칸이 쌓여 있으면 한 번에 건너뛴다. 그 칸으로 돌아가 봐야 화면은
      // 그대로라, 한 칸씩 물리면 "눌렀는데 아무 일도 안 일어난다"가 된다 (PR #254 Codex P2).
      const hashSteps = takeHashSteps();
      if (hashSteps > 0) window.history.go(-(hashSteps + 1));
      else router.back();
      return;
    }
    // 앱 내 히스토리가 없다 = 딥링크·새로고침·설치 후 첫 실행. 계층 상위로 올려 보내는데,
    // **push 가 아니라 replace 다**. push 면 그 한 걸음이 히스토리에 쌓여, 올라간 자리에서
    // 다시 뒤로를 누를 때 방금 떠난 아래 화면으로 되돌아간다 — 섹션↔목차를 오가며 홈에는
    // 영영 닿지 못하는 핑퐁이 된다. replace 는 "원래 여기서 왔어야 할 자리"로 갈아끼우는
    // 것이라 계속 누르면 목차 → 홈으로 계층을 타고 올라간다.
    markClimb();
    router.replace(parentOf(pathname));
  }, [depth, markClimb, pathname, router, takeHashSteps]);

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
 * 시작값은 `entryDepth()` 가 정한다 — 0 이 아닐 수 있다. 아래 주석 참조.
 *
 * **앞으로 가기는 뒤로로 잘못 센다** (브라우저 탭에서 앞으로 버튼을 눌렀을 때). 구분하려면
 * 밟아 온 경로 전체를 들고 대조해야 하는데, 이 앱의 주 무대인 설치형 PWA 에는 앞으로 버튼이
 * 아예 없고, 틀렸을 때의 결과도 "뒤로가 계층 상위로 간다"는 안전한 쪽이라 세지 않는다.
 */
function useInAppDepth(pathname: string) {
  const [depth, setDepth] = useState(entryDepth);
  // 마지막으로 센 경로. null 이면 아직 첫 렌더 — 그 자리는 이동이 아니라 진입 지점이다.
  const seen = useRef<string | null>(null);
  const wentBack = useRef(false);
  const climbed = useRef(false);
  // 지금 경로에서 해시만 바꿔 **쌓인** 히스토리 칸들 (아래 onHash 참조)
  const hashTrail = useRef<string[]>([]);
  // 그 바닥 칸이 원래 들고 있던 해시. 0 이 아닐 수 있다 — 용어 팝오버의 `/glossary#id` 는
  // 전체 새로고침으로 들어오므로 `#id` 자체가 바닥이고 그 아래엔 챕터가 있다. 이 값을 안 들면
  // 바닥으로 되돌아온 것을 "새 칸이 쌓였다"로 세어, 뒤로가 있지도 않은 칸까지 건너뛴다
  // (PR #254 Codex 라운드 3).
  const baseHash = useRef<string>("");

  // 계층 상위로 갈아끼우는 중임을 알린다 (위 `back` 의 replace). 경로는 바뀌지만 히스토리에
  // 쌓인 건 없으므로 깊이도 그대로여야 한다 — 여기서 세면 replace 를 push 로 오인하게 된다.
  const markClimb = useCallback(() => {
    climbed.current = true;
  }, []);

  // 건너뛸 해시 칸 수를 넘기고 비운다. 넘긴 직후 `history.go` 가 여러 칸을 한 번에 지나가므로
  // 세던 값은 그 자리에서 무효다 (착지한 경로에서 아래 pathname 효과가 한 번 더 비운다).
  const takeHashSteps = useCallback(() => {
    const n = hashTrail.current.length;
    hashTrail.current = [];
    return n;
  }, []);

  useEffect(() => {
    const onPop = () => {
      // 경로가 그대로면 해시만 오간 것이다 (용어집의 `/glossary#용어id` 앵커).
      // 그건 화면 이동이 아니므로 깊이를 건드리지 않는다 — 칸 수는 onHash 가 센다.
      if (window.location.pathname !== seen.current) wentBack.current = true;
    };
    // 해시 칸 세기. 용어집의 용어 제목은 자기 앵커라(`<a href="#id">`, glossary-view.tsx)
    // 탭할 때마다 히스토리 칸이 하나 쌓이는데, 되돌아가 봐야 같은 화면이라 뒤로가 먹지 않은
    // 것처럼 보인다. 그래서 세 뒀다가 `back` 이 한 번에 건너뛴다.
    // 뒤로/앞으로가 만든 해시 변화와 새 칸을 시각이 아니라 **밟아 온 해시 대조**로 가른다:
    // 새 해시가 한 칸 아래의 것이면 되돌아온 것이고, 아니면 새로 쌓인 것이다. 한 칸 아래가
    // 없으면 그 아래는 바닥이므로 `baseHash` 와 견준다. 같은 앵커를 오가는 드문 순서에서는
    // 덜 세는데, 그때의 결과는 "뒤로를 한 번 더 눌러야 한다" 뿐이다.
    const onHash = () => {
      const h = window.location.hash;
      const tr = hashTrail.current;
      if (tr.length > 0 && (tr[tr.length - 2] ?? baseHash.current) === h) tr.pop();
      else tr.push(h);
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  useEffect(() => {
    if (seen.current === null) {
      seen.current = pathname;
      // 이 문서로 들어온 자리의 해시가 이 경로의 바닥이다 (`/glossary#id` 직행이 그렇다)
      baseHash.current = window.location.hash;
      return;
    }
    if (seen.current === pathname) return;
    seen.current = pathname;
    // 화면이 바뀌었으면 앞 화면에 쌓였던 해시 칸은 더 셀 것이 없다 — 새 화면의 바닥을 다시 잡는다
    hashTrail.current = [];
    baseHash.current = window.location.hash;
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

  // 돌아갈 칸이 있는 자리에 설 때마다 그 주소를 적어 둔다. 새로고침이 이 훅을 리마운트해도
  // (`entryDepth` 가 referrer 를 못 믿는 그 경우) 여기서 남긴 표식이 사실을 이어 준다.
  useEffect(() => {
    if (depth > 0) markInApp(window.location.href);
  }, [depth, pathname]);

  return { depth, markClimb, takeHashSteps };
}

/**
 * 이 문서로 들어온 자리의 깊이. 보통은 0 이다 — 주소 직접 입력·딥링크·설치형 PWA 의 첫 실행이
 * 그렇고, 그 상태에서 `back()` 은 앱 밖으로 나가므로 계층 상위로 올려 보내야 한다.
 *
 * **1 이 되는 경우가 하나 있다: 앱 안의 다른 문서에서 전체 새로고침으로 넘어온 것.** 본문 용어
 * 팝오버의 `용어집에서 자세히 →`(`content/chapters/interactive.tsx`)가 그 경로다 — 거기는
 * `:target` 하이라이트(#192)를 켜려고 **일부러** next/link 를 안 쓰고 일반 `<a>` 로 문서를
 * 새로 띄운다. 그러면 이 훅도 리마운트돼서 "앱 내 히스토리 없음"으로 보이는데, 실제 히스토리
 * 직전 칸은 읽고 있던 챕터다. 여기서 0 을 주면 뒤로가 그 챕터 대신 홈으로 가 **읽던 자리를
 * 잃는다** — 이 에픽(#246)이 없애려던 바로 그 사고다 (PR #254 Codex P1).
 *
 * referrer 가 이 판정에 맞는 단서다: 리마운트로 잃은 것이 "직전 문서가 우리 것인가"이고
 * 그걸 브라우저가 여기 남긴다. 다만 referrer 만으로는 모자란다 — **새 탭**(Cmd·Ctrl 클릭,
 * 컨텍스트 메뉴 "새 탭에서 열기")은 같은 출처 referrer 를 들고 오면서도 그 탭의 히스토리에는
 * 앞 칸이 없다. 그 상태에서 1 을 주면 뒤로가 `back()` 을 불러 **아무 일도 일어나지 않는
 * 죽은 버튼**이 된다 (PR #254 Codex 라운드 2).
 *
 * 그래서 둘을 함께 본다. `history.length > 1` 은 그 자체로는 앱 내 히스토리의 증거가 못 되지만
 * (같은 탭에서 열었던 남의 사이트도 세므로 — 이 훅이 애초에 직접 세는 이유다) **"앞 칸이 아예
 * 없다"를 걸러내는 데는 정확하다**. 두 조건이 함께 참일 때만: 앞 칸이 있고, 그 앞 칸은 우리 것.
 *
 * **새로고침은 referrer 로 판정할 수 없다** (실측: Chrome 은 `location.reload()` 뒤 referrer 를
 * 이 페이지 자신의 URL 로 바꾼다). 그래서 referrer 는 `navigate` 일 때만 보고, 대신 **이 탭이
 * 앱 안을 거쳐 이 주소에 닿았다는 사실을 우리가 적어 둔다** (`markInApp`). 그 표식이 새로고침을
 * 건너뛰는 다리다 — 없으면 갱신 배너 한 번에 읽던 자리를 잃고(라운드 4), 표식만 믿으면 외부
 * 딥링크 새로고침이 앱 밖으로 나간다(라운드 3). 둘 다 막으려면 둘이 다 있어야 한다.
 *
 * depth 는 화면에 그려지지 않으므로 서버 렌더(0)와 값이 갈려도 하이드레이션은 어긋나지 않는다.
 */
function entryDepth(): number {
  if (typeof window === "undefined") return 0;
  // 새 탭에는 돌아갈 칸이 없다 — 갓 연 탭의 세션 히스토리는 이 문서 하나뿐이다.
  // 이 관문이 아래 표식보다 **먼저** 와야 한다: sessionStorage 는 target=_blank 로 열린 탭에
  // 복사되므로, 표식만 보면 Cmd 클릭 새 탭에서 거짓 양성이 날 수 있다.
  if (window.history.length <= 1) return 0;
  // 이 탭에서 앱 안을 거쳐 닿았다고 적어 둔 주소면, 새로고침을 건너서도 그 사실이 남는다
  if (wasInApp(window.location.href)) return 1;
  if (!document.referrer) return 0;
  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  if (nav && nav.type !== "navigate") return 0;
  try {
    return new URL(document.referrer).origin === window.location.origin ? 1 : 0;
  } catch {
    return 0;
  }
}

/**
 * "이 탭에서 앱 안을 거쳐 이 주소에 닿았다" 표식. 저장소로 sessionStorage 를 쓰는 이유는
 * **탭 단위**라서다 — 새로고침을 넘어 살아남되 다른 탭·다음 실행으로는 새지 않는다.
 *
 * **주소별로 적는 것이 요점이다.** 통짜 플래그였다면 target=_blank 복사본이 그대로 참이 되지만,
 * 주소별이면 새 탭이 여는 주소는 원래 탭이 방문한 적 없는 주소라 표식이 없다 (게다가 그 경우는
 * 위 `history.length` 관문에서 이미 걸린다 — 관문 두 개가 동시에 뚫려야 오판이 난다).
 */
const IN_APP_KEY = "dva.appbar.inapp.v1:";

function markInApp(href: string) {
  try {
    sessionStorage.setItem(IN_APP_KEY + href, "1");
  } catch {
    // 사파리 프라이빗 모드 등 저장이 막힌 환경 — 표식이 없으면 계층 폴백이라 안전하다
  }
}

function wasInApp(href: string) {
  try {
    return sessionStorage.getItem(IN_APP_KEY + href) === "1";
  } catch {
    return false;
  }
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
