import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-7xl font-bold text-[var(--accent)] opacity-30">404</p>
      <h1 className="mt-4 text-2xl font-bold">Halaman tidak ditemukan</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--muted)]">
        Seperti gas mulia, halaman ini tidak bereaksi dengan alamat mana pun.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/"
          className="rounded-xl px-4 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          Ke Kalkulator
        </Link>
        <Link
          href="/explorer"
          className="rounded-xl px-4 py-2.5 text-sm text-[var(--muted)] transition-colors hover:text-[var(--text)]"
          style={{ border: "1px solid var(--border)" }}
        >
          Jelajahi Fenomena
        </Link>
      </div>
    </main>
  );
}
