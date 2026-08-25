import type { Metadata } from "next";
import VirtualLab from "@/components/virtual-lab";

export const metadata: Metadata = {
  title: "Lab Virtual",
  description: "Lakukan eksperimen kimia dengan aman: campur indikator pH, elektrolisis air, dan reaksi logam dengan asam.",
};

export default function LabPage() {
  return (
    <main className="relative mx-auto max-w-4xl px-5 pb-16 pt-6 sm:pt-8">
      <header className="max-w-xl">
        <p className="font-mono text-xs text-[var(--accent)]">3 praktikum · aman diulang</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
          Eksperimen tanpa tumpah
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          Tiga praktikum: netralisasi asam-basa, elektrolisis air (rasio H₂:O₂ selalu 2:1),
          dan reaksi logam dengan asam. Salah tak masalah — ulangi sebanyak mau.
        </p>
      </header>

      <div className="mt-9">
        <VirtualLab />
      </div>
    </main>
  );
}
