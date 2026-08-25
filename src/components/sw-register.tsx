"use client";

import { useEffect } from "react";

/**
 * Registrasi service worker untuk mode offline (PWA).
 * Hanya aktif di production — sw register pada dev justru mengganggu HMR.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    const onSwReady = () => {
      navigator.serviceWorker.register(
        `${(process.env.NEXT_PUBLIC_BASE_PATH as string) ?? ""}/sw.js`
      ).catch(() => {
        /* offline mode tidak kritis — diamkan saja */
      });
    };
    if (document.readyState === "complete") onSwReady();
    else window.addEventListener("load", onSwReady);
    return () => window.removeEventListener("load", onSwReady);
  }, []);

  return null;
}
