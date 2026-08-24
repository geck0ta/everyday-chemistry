export default function Loading() {
  return (
    <main className="relative mx-auto max-w-4xl animate-pulse px-5 pt-6 sm:pt-8" aria-busy="true" aria-label="Memuat halaman">
      {/* hero skeleton */}
      <div className="h-3 w-28 rounded bg-[var(--border)]" />
      <div className="mt-4 h-9 w-2/3 rounded-lg bg-[var(--border)]" />
      <div className="mt-3 h-3.5 w-full max-w-md rounded bg-[var(--border)]" />

      {/* kartu utama */}
      <div className="glass mt-10 p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[58px] rounded-2xl bg-[var(--border)]" />
          ))}
        </div>
        <div className="mt-5 space-y-3">
          <div className="h-11 w-full rounded-xl bg-[var(--border)]" />
          <div className="h-11 w-full rounded-xl bg-[var(--border)] opacity-70" />
        </div>
      </div>

      <span className="sr-only">Memuat…</span>
    </main>
  );
}
