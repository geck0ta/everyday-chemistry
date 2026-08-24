import type { Metadata } from "next";
import Explorer from "@/components/explorer";
import Bookmarked from "@/components/bookmark";

export const metadata: Metadata = {
  title: "Explorer",
  description: "Jelajahi 23 fenomena kimia dalam kehidupan sehari-hari, dari besi berkarat sampai kunang-kunang.",
};

export default function ExplorerPage() {
  return (
    <main className="relative mx-auto max-w-4xl px-5 pb-16 pt-6 sm:pt-8">
      <header className="max-w-xl">
        <p className="font-mono text-xs text-[var(--accent)]">23 fenomena · kuis · bookmark</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
          Explorer
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          Dari besi berkarat sampai gelembung soda — tiap fenomena dijelaskan
          4 langkah, ada kuis untuk cek pemahaman.
        </p>
      </header>

      <Bookmarked />

      <div className="mt-9">
        <Explorer />
      </div>
    </main>
  );
}
