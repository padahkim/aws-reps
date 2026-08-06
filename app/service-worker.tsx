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
  // 우리가 넘긴 그 순간에만 새로고침한다 — 다른 탭이 갱신했을 때 이 탭이 멋대로 튀지 않게.
  const reloading = useRef(false);

  useEffect(() => {
    // dev 에는 sw.js 가 없다 (out/ 빌드 산출물). 등록해 봐야 404 만 부른다.
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const onControllerChange = () => {
      if (reloading.current) window.location.reload();
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
    if (!waiting) return;
    reloading.current = true;
    waiting.postMessage({ type: "SKIP_WAITING" });
  }, [waiting]);

  if (!waiting || dismissed) return null;

  return (
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
  );
}
