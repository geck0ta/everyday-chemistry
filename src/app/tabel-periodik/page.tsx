import type { Metadata } from "next";
import PeriodicTable from "@/components/periodic-table";

export const metadata: Metadata = {
  title: "Tabel Periodik",
  description:
    "Tabel periodik interaktif 118 unsur — klik unsur untuk fase, titik leleh/didih, dan fakta sehari-harinya.",
};

export default function TabelPeriodikPage() {
  return (
    <main className="relative mx-auto max-w-5xl px-5 pb-16 pt-6 sm:pt-8">
      <header className="max-w-xl">
        <p className="font-mono text-xs text-[var(--accent)]">118 unsur · 10 kategori</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
          Tabel periodik yang hidup
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          Cari unsur, filter per kategori, atau langsung klik selnya. Tiap unsur punya
          data fisik dan fakta sehari-hari — dari litium di HP-mu sampai wolfram di bohlam.
        </p>
      </header>

      <div className="mt-8">
        <PeriodicTable />
      </div>
    </main>
  );
}
