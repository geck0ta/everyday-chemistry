import type { Metadata } from "next";
import Simulation from "@/components/simulation";

export const metadata: Metadata = {
  title: "Simulasi & Lab",
  description: "5 simulasi interaktif (titrasi, buffer, sel volta, kesetimbangan, laju) + 3 lab virtual (indikator pH, elektrolisis, logam+asam). Ubah parameter, lihat perubahan real-time.",
};

export default function SimulationPage() {
  return (
    <main className="relative mx-auto max-w-4xl px-5 pb-16 pt-6 sm:pt-8">
      <header className="max-w-xl">
        <p className="font-mono text-xs text-[var(--accent)]">8 mode · real-time</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
          Simulasi & Lab Virtual
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          Lima simulasi (titrasi, penyangga, sel volta, kesetimbangan, laju reaksi)
          dan tiga lab virtual (indikator pH, elektrolisis air, logam+asam).
          Semua dihitung dan dianimasikan real-time.
        </p>
      </header>

      <div className="mt-9">
        <Simulation />
      </div>
    </main>
  );
}
