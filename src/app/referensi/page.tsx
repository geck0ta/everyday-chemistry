import type { Metadata } from "next";
import {
  CONSTANTS, REACTIVITY_SERIES, PH_SCALE, SOLUBILITY_RULES,
} from "@/lib/reference-data";

export const metadata: Metadata = {
  title: "Referensi Cepat",
  description: "Konstanta kimia, deret reaktivitas logam, skala pH, dan aturan kelarutan — buka saat mengerjakan soal.",
};

export default function ReferencePage() {
  return (
    <main className="relative mx-auto max-w-3xl px-5 pb-16 pt-6 sm:pt-8">
      <header>
        <h1 className="text-2xl font-bold leading-tight sm:text-3xl">Referensi cepat</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Angka dan tabel yang paling sering dibutuhkan saat mengerjakan soal.
        </p>
      </header>

      {/* Konstanta */}
      <section className="mt-8" aria-label="Konstanta penting">
        <h2 className="mb-3 text-base font-semibold">Konstanta</h2>
        <div className="glass overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {CONSTANTS.map((c, i) => (
                <tr key={c.symbol} className={i % 2 ? "bg-[var(--border)]/20" : ""}>
                  <td className="px-4 py-2.5 font-mono font-semibold text-[var(--accent)]">{c.symbol}</td>
                  <td className="px-2 py-2.5">{c.name}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-xs">{c.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Deret reaktivitas */}
      <section className="mt-8" aria-label="Deret reaktivitas logam">
        <h2 className="mb-3 text-base font-semibold">Deret reaktivitas logam</h2>
        <div className="glass flex flex-wrap gap-1.5 p-4">
          {REACTIVITY_SERIES.map((m) => (
            <span
              key={m.sym}
              title={m.note || m.name}
              className={`rounded-lg px-2.5 py-1.5 font-mono text-xs font-semibold ${
                m.sym === "H"
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--border)]/40"
              }`}
            >
              {m.sym}
            </span>
          ))}
          <p className="w-full pt-1 text-xs text-[var(--muted)]">
            Kiri = paling reaktif. Logam di atas H merebut H dari asam; di bawah H (Cu, Ag, Au) tidak.
          </p>
        </div>
      </section>

      {/* Skala pH */}
      <section className="mt-8" aria-label="Skala pH">
        <h2 className="mb-3 text-base font-semibold">Skala pH</h2>
        <div className="glass overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[var(--muted)]">
                <th className="px-4 py-2 font-medium">pH</th>
                <th className="px-2 py-2 font-medium">Sifat</th>
                <th className="px-4 py-2 font-medium">Contoh</th>
              </tr>
            </thead>
            <tbody>
              {PH_SCALE.map((row, i) => (
                <tr key={row.range} className={i % 2 ? "bg-[var(--border)]/20" : ""}>
                  <td className="px-4 py-2.5 font-mono font-semibold text-[var(--accent)]">{row.range}</td>
                  <td className="px-2 py-2.5">{row.label}</td>
                  <td className="px-4 py-2.5 text-xs text-[var(--muted)]">{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Kelarutan */}
      <section className="mt-8" aria-label="Aturan kelarutan garam">
        <h2 className="mb-3 text-base font-semibold">Aturan kelarutan garam</h2>
        <ul className="glass space-y-2 p-4">
          {SOLUBILITY_RULES.map((rule) => (
            <li key={rule} className="flex gap-2.5 text-sm leading-relaxed">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
              {rule}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
