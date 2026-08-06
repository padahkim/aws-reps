"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 서비스 워커 등록 + 갱신 배너 (#234).
 *
 * 갱신을 자동으로 하지 않는 이유: 학습 중에 보던 페이지가 발밑에서 바뀌면 그 자체가 사고다.
 * 새 워커는 대기 상태로 두고, 사용자가 배너를 눌렀을 때만 넘긴다 —
 *   대기 워커 감지 → 배너 → SKIP_WAITING → controllerchange → 새로고침.
 *
 * 첫 설치(= controller 가 아직 없는 상태)에는 배너를 띄우지 않는다. 그건 "새 버전"이 아니라
 * 그냥 지금 보고 있는 버전이다.
 */
export function ServiceWorker() {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [dismissed, setDismissed] = useState(false);
  // 다른 탭이 먼저 갱신을 수락한 상태 (Codex P2, PR #238) — 이 탭의 대기 워커는 이미
  // 활성화돼 버려서 SKIP_WAITING 을 보내도 아무 일이 없다. 배너는 남기되 동작을 바꾼다.
  const [activatedElsewhere, setActivatedElsewhere] = useState(false);
  // 우리가 넘긴 그 순간에만 새로고침한다 — 다른 탭이 갱신했을 때 이 탭이 멋대로 튀지 않게.
  const reloading = useRef(false);
  // 이 탭이 이미 워커의 통제 아래 있었는가. 첫 방문에서는 false 로 시작한다.
  const controlled = useRef(false);

  useEffect(() => {
    // dev 에는 sw.js 가 없다 (public/ 은 빌드가 퍼 간다). 등록해 봐야 404 만 부른다.
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    controlled.current = !!navigator.serviceWorker.controller;

    const onControllerChange = () => {
      if (reloading.current) {
        window.location.reload();
        return;
      }
      // 첫 설치의 clients.claim() 도 여기로 온다 (Codex P2, PR #238 2라운드).
      // 통제하는 워커가 **없다가 생긴** 것은 갱신이 아니라 최초 장악이다 — 알릴 새 버전이 없다.
      if (!controlled.current) {
        controlled.current = true;
        return;
      }
      // 여기부터가 진짜 교체 = 다른 탭이 먼저 갱신을 수락했다. 이 탭은 아직 옛 화면이므로
      // 배너는 그대로 두고, 눌렀을 때 할 일만 "그냥 새로고침"으로 바꾼다.
      setActivatedElsewhere(true);
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    const markWaiting = (worker: ServiceWorker | null) => {
      if (!worker) return;
      // controller 가 없으면 첫 설치다 — 알릴 "새 버전"이 아니다.
      if (!navigator.serviceWorker.controller) return;
      setWaiting(worker);
      setDismissed(false);
    };

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        markWaiting(registration.waiting);
        registration.addEventListener("updatefound", () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.addEventListener("statechange", () => {
            if (installing.state === "installed") markWaiting(installing);
          });
        });
      })
      .catch((err) => {
        // 오프라인 기능이 없을 뿐 사이트는 그대로 동작한다 — 조용히 넘어간다.
        console.warn("[sw] 등록 실패", err);
      });

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  const activate = useCallback(() => {
    reloading.current = true;
    // 이미 남이 넘겼으면 보낼 곳이 없다 — 새 워커가 이미 통제 중이니 새로고침이면 충분하다.
    if (activatedElsewhere || !waiting) {
      window.location.reload();
      return;
    }
    waiting.postMessage({ type: "SKIP_WAITING" });
  }, [waiting, activatedElsewhere]);

  if ((!waiting && !activatedElsewhere) || dismissed) return null;

  return (
    <>
      {/* 고정 배너는 흐름에서 높이를 차지하지 않는다 — 본문 맨 아래(이전·다음 이동)를
          가리지 않도록 배너가 떠 있는 동안만 그만큼의 자리를 세워 둔다. */}
      <div className="sw-update-spacer" aria-hidden="true" />
      <div role="status" className="sw-update">
        <span>새 버전이 준비됐습니다.</span>
        <span className="sw-update-actions">
          <button type="button" onClick={activate}>
            지금 갱신
          </button>
          <button type="button" className="sw-update-later" onClick={() => setDismissed(true)}>
            나중에
          </button>
        </span>
      </div>
    </>
  );
}
