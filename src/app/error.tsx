"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-7xl font-bold text-[var(--accent)] opacity-30">⚠</p>
      <h1 className="mt-4 text-2xl font-bold">Reaksi gagal berjalan</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--muted)]">
        Terjadi kesalahan di sisi kami. Coba muat ulang — kalau masih sama,
        kabari lewat halaman kontak.
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5"
        style={{ background: "var(--accent)", color: "#fff" }}
      >
        <RotateCcw size={14} strokeWidth={2} />
        Coba lagi
      </button>
    </main>
  );
}
