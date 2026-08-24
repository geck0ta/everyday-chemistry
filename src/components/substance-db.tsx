"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, Calculator, AlertTriangle, MapPin, Sparkles } from "lucide-react";
import { SUBSTANCES, CATEGORIES, CAT_META, type Substance } from "@/lib/substances";
import { molarMass } from "@/lib/chemistry";
import Formula from "@/components/formula";
import { CategoryDiagram, LewisStructure } from "@/components/substance-diagrams";

const stateIcon: Record<Substance["state"], string> = {
  padat: "padat", cair: "cair", gas: "gas",
};

function SubstanceDetail({ s, onClose }: { s: Substance; onClose: () => void }) {
  const mm = molarMass(s.formula);
  const meta = CAT_META[s.category];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detail ${s.name}`}
    >
      <div
        className="modal-in glass max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl p-5 pb-10 sm:max-h-[85vh] sm:rounded-2xl sm:p-8"
        style={{ background: "var(--surface-solid)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* handle sheet (mobile) */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--border)] sm:hidden" aria-hidden />
        {/* header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <span
              className="rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest"
              style={{ background: meta.color + "1a", color: meta.color }}
            >
              {s.category} · {s.state}
            </span>
            <h2 className="mt-3 text-2xl font-bold leading-snug">
              <Formula text={s.formula} />
              <span className="ml-2 text-lg font-medium text-[var(--muted)]">{s.name}</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="shrink-0 rounded-full p-2 text-[var(--muted)] transition-colors hover:text-[var(--text)]"
            style={{ border: "1px solid var(--border)" }}
          >
            <X size={15} strokeWidth={1.75} />
          </button>
        </div>

        {/* massa molar + link kalkulator */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="rounded-xl px-4 py-3" style={{ background: "var(--accent-soft)" }}>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">Massa molar</p>
            <p className="font-mono text-xl font-bold text-[var(--accent)]">
              {mm.ok ? mm.value!.toFixed(2) : "?"} <span className="text-sm font-normal">g/mol</span>
            </p>
          </div>
          <Link
            href={`/?formula=${encodeURIComponent(s.formula)}#calc`}
            className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all hover:-translate-y-0.5"
            style={{ border: "1px solid var(--accent)", color: "var(--accent)" }}
          >
            <Calculator size={13} strokeWidth={1.75} />
            Hitung di kalkulator
          </Link>
        </div>

        {/* breakdown unsur */}
        {mm.ok && (
          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--muted)]">
            <Sparkles size={12} strokeWidth={1.75} className="text-[var(--accent)]" />
            {Object.entries(
              // parse ulang komposisi via molarMass steps
              (mm.steps[0]?.result ?? "").split(", ").reduce<Record<string, string>>((acc, part) => {
                const [el, n] = part.split("×");
                if (el && n) acc[el] = n;
                return acc;
              }, {})
            ).map(([el, n]) => (
              <span key={el} className="rounded-md px-1.5 py-0.5" style={{ background: "var(--accent-soft)" }}>
                {el}<sub>{n}</sub>
              </span>
            ))}
          </p>
        )}

        {/* diagram animasi kategori */}
        <div className="glass mt-5 p-4 text-[var(--text)]">
          <CategoryDiagram category={s.category} />
        </div>

        {/* struktur Lewis (molekul ikonik saja) */}
        {["H2O", "CO2", "CH4", "NH3", "O2", "N2"].includes(s.formula) && (
          <div className="glass mt-3 p-4 text-[var(--text)]">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">Struktur Lewis</p>
            <LewisStructure formula={s.formula} />
          </div>
        )}

        {/* penampilan */}
        <p className="mt-5 rounded-xl px-4 py-3 text-sm italic text-[var(--muted)]" style={{ background: "color-mix(in srgb, var(--surface-solid) 55%, transparent)", border: "1px solid var(--border)" }}>
          {s.appearance}
        </p>

        {/* sifat */}
        <section className="mt-6" aria-label="Sifat">
          <h3 className="text-base font-semibold">Sifat penting</h3>
          <ul className="mt-2.5 space-y-2">
            {s.properties.map((p) => (
              <li key={p} className="flex gap-2.5 text-sm leading-relaxed">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full" style={{ background: meta.color }} />
                {p}
              </li>
            ))}
          </ul>
        </section>

        {/* kegunaan */}
        <section className="glass mt-5 p-4 sm:p-5" aria-label="Kegunaan">
          <h3 className="text-sm font-semibold">Kegunaan</h3>
          <p className="mt-1.5 text-sm leading-relaxed">{s.uses}</p>
        </section>

        {/* sehari-hari */}
        {s.everyday && (
          <p className="mt-4 flex gap-2.5 rounded-xl px-4 py-3 text-sm leading-relaxed text-[var(--muted)]" style={{ background: "var(--accent-soft)" }}>
            <MapPin size={14} strokeWidth={1.75} className="mt-0.5 shrink-0 text-[var(--accent)]" />
            <span><b className="text-[var(--text)]">Di sekitarmu:</b> {s.everyday}</span>
          </p>
        )}

        {/* bahaya */}
        {s.danger && (
          <p className="mt-3 flex gap-2.5 rounded-xl border px-4 py-3 text-sm leading-relaxed text-red-400"
            style={{ borderColor: "rgba(239,68,68,.25)", background: "rgba(239,68,68,.08)" }}>
            <AlertTriangle size={14} strokeWidth={1.75} className="mt-0.5 shrink-0" />
            <span>{s.danger}</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default function SubstanceDatabase() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [open, setOpen] = useState<Substance | null>(null);

  const list = useMemo(() => {
    const q = query.toLowerCase().trim();
    return SUBSTANCES.filter((s) => {
      if (cat && s.category !== cat) return false;
      if (!q) return true;
      return (
        s.formula.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.uses.toLowerCase().includes(q)
      );
    });
  }, [query, cat]);

  const catColor = (c: string) => CAT_META[c as keyof typeof CAT_META]?.color ?? "#7c8aa0";

  return (
    <section aria-label="Database zat">
      {/* pencarian */}
      <div className="flex flex-col gap-3">
        <div className="glass-input flex items-center gap-2.5 rounded-xl px-4">
          <Search size={16} strokeWidth={1.75} className="shrink-0 text-[var(--muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari zat… mis. garam, H2SO4, kafein"
            className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-[var(--muted)]/60"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Hapus" className="text-[var(--muted)] hover:text-[var(--text)]">
              <X size={14} strokeWidth={1.75} />
            </button>
          )}
        </div>
        {/* filter */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setCat(null)}
            className={`rounded-full px-3.5 py-1.5 text-xs transition-colors ${
              cat === null ? "bg-[var(--text)] font-medium text-[var(--bg)]" : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
            style={cat !== null ? { border: "1px solid var(--border)" } : undefined}
          >
            Semua · {SUBSTANCES.length}
          </button>
          {CATEGORIES.map((c) => {
            const count = SUBSTANCES.filter((s) => s.category === c).length;
            if (!count) return null;
            const active = cat === c;
            return (
              <button
                key={c}
                onClick={() => setCat(active ? null : c)}
                className="rounded-full px-3.5 py-1.5 text-xs transition-all"
                style={{
                  background: active ? catColor(c) + "1f" : "transparent",
                  border: `1px solid ${active ? catColor(c) + "66" : "var(--border)"}`,
                  color: active ? catColor(c) : "var(--muted)",
                }}
              >
                {c} · {count}
              </button>
            );
          })}
        </div>
      </div>

      {/* grid kartu — stagger fade-in */}
      <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s, idx) => {
          const mm = molarMass(s.formula);
          return (
            <button
              key={s.formula + s.name}
              onClick={() => setOpen(s)}
              className="glass card-in group p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]/40"
              style={{ animationDelay: `${Math.min(idx * 30, 600)}ms` }}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className="rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest"
                  style={{ background: catColor(s.category) + "14", color: catColor(s.category) }}
                >
                  {s.category}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--muted)]/70">{stateIcon[s.state]}</span>
              </div>
              <h3 className="mt-2.5 font-semibold leading-snug transition-colors group-hover:text-[var(--accent)]">
                <Formula text={s.formula} />
              </h3>
              <p className="mt-0.5 truncate text-xs text-[var(--muted)]">{s.name}</p>
              <p className="mt-2 font-mono text-xs font-medium transition-all group-hover:[text-shadow:0_0_12px_currentColor]" style={{ color: catColor(s.category) }}>
                M = {mm.ok ? mm.value!.toFixed(2) : "??"} g/mol
              </p>
            </button>
          );
        })}
      </div>

      {list.length === 0 && (
        <p className="mt-8 text-center text-sm text-[var(--muted)]">
          Tidak ada zat yang cocok dengan “{query}”. Coba kata lain — misalnya “asam”, “gas”, atau nama zat.
        </p>
      )}

      {open && <SubstanceDetail s={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
