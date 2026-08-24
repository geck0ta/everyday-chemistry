import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Lightbulb, FlaskConical, Calculator } from "lucide-react";
import { PHENOMENA } from "@/lib/phenomena";
import { EXTRAS } from "@/lib/extras";
import PhenomenonDiagram from "@/components/phenomenon-diagram";
import Quiz from "@/components/quiz";
import { QUIZZES } from "@/lib/quizzes";
import { BookmarkButton } from "@/components/bookmark";
import LevelToggle from "@/components/level-toggle";
import { ADVANCED } from "@/lib/advanced";

export function generateStaticParams() {
  return PHENOMENA.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = PHENOMENA.find((x) => x.id === id);
  if (!p) return {};
  return {
    title: `${p.title.replace(/^(Mengapa|Bagaimana|Apa|Dari mana) /, "")} — Explorer`,
    description: p.summary,
    alternates: { canonical: `/explorer/${p.id}` },
    openGraph: {
      title: p.title,
      description: p.summary,
      type: "article",
    },
  };
}

const CAT_COLORS: Record<string, string> = {
  "Redoks": "#e8794a",
  "Asam–Basa": "#5b8def",
  "Biokimia": "#0d9373",
  "Larutan & Campuran": "#9d6fd6",
  "Termokimia": "#d99a3c",
  "Fisika-Kimia": "#4aa8bd",
};
const catColor = (c: string) => CAT_COLORS[c] ?? "#7c8aa0";

export default async function PhenomenonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idx = PHENOMENA.findIndex((x) => x.id === id);
  if (idx === -1) notFound();
  const p = PHENOMENA[idx];
  const extra = EXTRAS[id];
  const prev = PHENOMENA[(idx - 1 + PHENOMENA.length) % PHENOMENA.length];
  const next = PHENOMENA[(idx + 1) % PHENOMENA.length];
  const related = (extra?.relatedIds ?? [])
    .map((rid) => PHENOMENA.find((x) => x.id === rid))
    .filter(Boolean);

  return (
    <main className="relative mx-auto max-w-2xl px-5 pb-16 pt-10">
      {/* breadcrumb */}
      <Link
        href="/explorer"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
      >
        <ArrowLeft size={14} strokeWidth={1.75} />
        Semua fenomena
      </Link>

      <article>
        {/* header */}
        <header className="mt-5">
          <span
            className="rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest"
            style={{ background: catColor(p.category) + "1a", color: catColor(p.category) }}
          >
            {p.category}
          </span>
          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{p.title}</h1>
          <div className="mt-4">
            <BookmarkButton id={p.id} />
          </div>
          <p className="mt-3 flex gap-2.5 rounded-xl px-4 py-3 text-sm italic text-[var(--muted)]" style={{ background: "var(--accent-soft)" }}>
            “{p.question}”
          </p>
        </header>

        {/* diagram */}
        <div className="glass mt-5 p-4 text-[var(--text)]">
          <PhenomenonDiagram id={p.id} className="w-full" />
        </div>

        {/* penjelasan — dengan level SMA/Kuliah */}
        <section className="mt-8" aria-label="Penjelasan">
          <LevelToggle
            basic={{ label: "Dasar", items: p.explanation.map((body) => ({ title: "", body })) }}
            advanced={ADVANCED[id]?.length ? {
              label: "Lanjutan",
              items: ADVANCED[id].map(([title, body]) => ({ title, body })),
            } : null}
          />
        </section>

        {/* reaksi */}
        {p.reaction && (
          <div className="mt-7 overflow-x-auto rounded-xl px-4 py-3.5" style={{ background: "var(--accent-soft)" }}>
            <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">Persamaan reaksi</p>
            <p className="font-mono text-sm whitespace-nowrap text-[var(--accent)]">{p.reaction}</p>
          </div>
        )}

        {/* fakta menarik */}
        {extra && (
          <section className="glass mt-8 p-5 sm:p-6" aria-label="Fakta menarik">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <Lightbulb size={17} strokeWidth={1.75} className="text-[var(--accent)]" />
              Tahukah kamu?
            </h2>
            <ul className="mt-3 space-y-2.5">
              {extra.funFacts.map((f, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-[var(--muted)]">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                  {f}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* coba sendiri */}
        {extra && (
          <section className="glass mt-4 p-5 sm:p-6" aria-label="Coba sendiri">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <FlaskConical size={17} strokeWidth={1.75} className="text-[var(--accent)]" />
              Coba sendiri di rumah
            </h2>
            <p className="mt-3 text-sm leading-relaxed">{extra.tryIt}</p>
          </section>
        )}

        {/* hitung zat terkait — cross-link kalkulator */}
        {extra && extra.relatedFormulas.length > 0 && (
          <section className="glass mt-4 p-5 sm:p-6" aria-label="Hitung zat terkait">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <Calculator size={17} strokeWidth={1.75} className="text-[var(--accent)]" />
              Hitung di kalkulator
            </h2>
            <p className="mt-2 text-xs text-[var(--muted)]">
              Massa molar zat-zat yang terlibat dalam fenomena ini:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {extra.relatedFormulas.map(({ formula, label }) => (
                <Link
                  key={formula}
                  href={`/?formula=${encodeURIComponent(formula)}#calc`}
                  className="rounded-xl glass-input px-3.5 py-2 text-sm transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]/50"
                >
                  <span className="font-mono font-semibold text-[var(--accent)]">{formula}</span>
                  <span className="ml-2 text-xs text-[var(--muted)]">{label}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* kuis */}
        {QUIZZES[id]?.length ? <Quiz questions={QUIZZES[id]} /> : null}

        {/* konsep */}
        <div className="mt-7 flex flex-wrap gap-2">
          {p.concepts.map((c) => (
            <span key={c} className="rounded-full px-3 py-1 text-xs text-[var(--muted)]" style={{ border: "1px solid var(--border)" }}>
              {c}
            </span>
          ))}
        </div>

        {/* terkait */}
        {related.length > 0 && (
          <section className="mt-10" aria-label="Fenomena terkait">
            <h2 className="mb-3 text-base font-semibold">Fenomena terkait</h2>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {related.map((r) => r && (
                <Link key={r.id} href={`/explorer/${r.id}`} className="glass group p-4 transition-all hover:border-[var(--accent)]/40">
                  <span
                    className="font-mono text-[9px] uppercase tracking-widest"
                    style={{ color: catColor(r.category) }}
                  >
                    {r.category}
                  </span>
                  <h3 className="mt-1 flex items-center gap-1 text-sm font-medium transition-colors group-hover:text-[var(--accent)]">
                    {r.title}
                    <ArrowRight size={12} strokeWidth={1.75} className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* prev / next */}
      <nav className="mt-12 flex items-center justify-between gap-3 border-t pt-5" style={{ borderColor: "var(--border)" }} aria-label="Navigasi fenomena">
        <Link href={`/explorer/${prev.id}`} className="group flex min-w-0 items-center gap-1.5 text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]">
          <ArrowLeft size={14} strokeWidth={1.75} className="shrink-0" />
          <span className="truncate">{prev.title.replace(/^(Mengapa|Bagaimana|Apa|Dari mana) |^…\?$/, "")}</span>
        </Link>
        <Link href={`/explorer/${next.id}`} className="group flex min-w-0 items-center justify-end gap-1.5 text-right text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]">
          <span className="truncate">{next.title}</span>
          <ArrowRight size={14} strokeWidth={1.75} className="shrink-0" />
        </Link>
      </nav>
    </main>
  );
}
