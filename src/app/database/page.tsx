import type { Metadata } from "next";
import SubstanceDatabase from "@/components/substance-db";

export const metadata: Metadata = {
  title: "Database Zat",
  description: "45+ zat & molekul umum: massa molar, sifat, kegunaan, dan di mana menemukannya sehari-hari.",
};

export default function DatabasePage() {
  return (
    <main className="relative mx-auto max-w-4xl px-5 pb-16 pt-6 sm:pt-8">
      <header className="max-w-xl">
        <p className="font-mono text-xs text-[var(--accent)]">45 zat · 8 kategori</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
          45 zat yang kamu temui tiap hari
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          Massa molar dihitung langsung oleh engine kalkulator — bukan angka tempelan.
          Ada sifat, kegunaan, dan peringatan bahayanya.
        </p>
      </header>

      <div className="mt-9">
        <SubstanceDatabase />
      </div>
    </main>
  );
}
