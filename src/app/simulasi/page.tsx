import type { Metadata } from "next";
import Simulation from "@/components/simulation";

export const metadata: Metadata = {
  title: "Simulasi",
  description: "Ubah konsentrasi, volume, dan suhu — lihat bagaimana kurva titrasi, kesetimbangan, dan laju reaksi merespons secara langsung.",
};

export default function SimulationPage() {
  return (
    <main className="relative mx-auto max-w-4xl px-5 pb-16 pt-6 sm:pt-8">
      <header className="max-w-xl">
        <p className="font-mono text-xs text-[var(--accent)]">3 mode · real-time</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
          Geser, lihat, pahami
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          Tiga simulasi: kurva titrasi, kesetimbangan H₂ + I₂ ⇌ 2HI,
          dan efek suhu pada laju reaksi. Semua dihitung real-time.
        </p>
      </header>

      <div className="mt-9">
        <Simulation />
      </div>
    </main>
  );
}
