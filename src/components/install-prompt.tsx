"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "ec-install-dismissed";

/** Kartu kecil "Install aplikasi" — hanya muncul jika browser mendukung PWA install. */
export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Sudah terpasang sebagai app (display-mode standalone)? Jangan tawarkan lagi.
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      // tampilkan dengan sedikit delay agar tidak mengganggu kunjungan pertama
      setTimeout(() => setVisible(true), 2500);
    };
    const onInstalled = () => {
      setInstalled(true);
      setVisible(false);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!visible || !deferred || installed) return null;

  return (
    <div
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-sm items-center gap-3 rounded-2xl p-3.5 shadow-lg sm:left-auto sm:right-6 sm:mx-0"
      style={{ background: "var(--surface-solid)", border: "1px solid var(--border)", backdropFilter: "blur(var(--glass-blur))" }}
      role="dialog"
      aria-label="Pasang aplikasi Everyday Chemistry"
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)" }}
        aria-hidden
      >
        <Download size={18} strokeWidth={1.75} className="text-[var(--accent)]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">Pasang aplikasi</p>
        <p className="truncate text-xs text-[var(--muted)]">Bisa dibuka tanpa internet</p>
      </div>
      <button
        onClick={async () => {
          await deferred.prompt();
          const choice = await deferred.userChoice;
          if (choice.outcome === "accepted") setVisible(false);
        }}
        className="shrink-0 rounded-full bg-[var(--accent)] px-3.5 py-1.5 text-xs font-semibold text-white"
      >
        Pasang
      </button>
      <button
        aria-label="Tutup"
        onClick={() => {
          localStorage.setItem(DISMISS_KEY, "1");
          setVisible(false);
        }}
        className="shrink-0 text-[var(--muted)] transition-colors hover:text-[var(--text)]"
      >
        <X size={15} strokeWidth={1.75} />
      </button>
    </div>
  );
}
