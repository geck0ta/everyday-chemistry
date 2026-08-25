"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import {
  CATEGORY_META,
  ELEMENTS,
  elementBySymbol,
  phaseAtRoom,
  type ChemicalElement,
  type ElementCategory,
} from "@/lib/elements";

// Unsur yang punya padanan zat di Database Zat → taut silang
const SYMBOL_TO_DB: Record<string, string> = {
  H: "H2", O: "O2", N: "N2", He: "He", Cl: "Cl2",
  Fe: "Fe", Cu: "Cu", Ag: "Ag", Au: "Au", Al: "Al", Zn: "Zn",
};

function kToC(k?: number): string {
  if (k === undefined) return "—";
  return `${Math.round(k - 273.15)}°C`;
}

function ElementCell({
  el,
  dimmed,
  onSelect,
  selected,
}: {
  el: ChemicalElement;
  dimmed: boolean;
  onSelect: (el: ChemicalElement) => void;
  selected: boolean;
}) {
  const color = CATEGORY_META[el.category].color;
  return (
    <button
      onClick={() => onSelect(el)}
      title={`${el.name} (${el.symbol})`}
      aria-label={`Unsur ${el.name}, nomor atom ${el.number}`}
      className="relative flex aspect-square flex-col items-center justify-center rounded-md p-0.5 transition-transform hover:z-10 hover:scale-110 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-1"
      style={{
        gridColumn: el.x,
        gridRow: el.y,
        background: dimmed ? "transparent" : `color-mix(in srgb, ${color} 16%, var(--surface))`,
        border: `1px solid ${dimmed ? "transparent" : `color-mix(in srgb, ${color} 45%, transparent)`}`,
        opacity: dimmed ? 0.18 : 1,
        cursor: "pointer",
        outlineColor: color,
      }}
    >
      <span className="absolute left-1 top-0.5 font-mono text-[8px] leading-none opacity-60">{el.number}</span>
      <span
        className={`font-mono font-bold leading-none ${selected ? "text-base" : "text-[clamp(9px,1.7vw,15px)]"}`}
        style={{ color }}
      >
        {el.symbol}
      </span>
      <span className="mt-0.5 hidden max-w-full truncate px-0.5 text-[8px] leading-none opacity-70 min-[420px]:block">
        {el.name}
      </span>
    </button>
  );
}

function DetailPanel({ el, onClose }: { el: ChemicalElement; onClose: () => void }) {
  const meta = CATEGORY_META[el.category];
  const color = meta.color;
  const phase = phaseAtRoom(el);
  const dbFormula = SYMBOL_TO_DB[el.symbol];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detail unsur ${el.name}`}
    >
      <div
        className="modal-in glass max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl p-5 pb-10 sm:max-h-[85vh] sm:rounded-2xl sm:p-8"
        style={{ background: "var(--surface-solid)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--border)] sm:hidden" aria-hidden />
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-xl"
              style={{ background: `color-mix(in srgb, ${color} 14%, transparent)`, border: `1px solid ${color}55` }}
            >
              <span className="font-mono text-3xl font-bold" style={{ color }}>{el.symbol}</span>
              <span className="mt-0.5 font-mono text-[10px] opacity-60">{el.number}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold leading-tight">{el.name}</h2>
              <span
                className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider"
                style={{ background: `${color}1a`, color }}
              >
                {meta.label}
              </span>
              <p className="mt-1.5 font-mono text-xs text-[var(--muted)]">Massa atom: {el.mass} u</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-full p-1.5 text-[var(--muted)] transition-colors hover:text-[var(--text)]"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl p-2.5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <dt className="text-[10px] uppercase tracking-wide text-[var(--muted)]">Fase (25°C)</dt>
            <dd className="mt-1 text-sm font-medium capitalize">{phase}</dd>
          </div>
          <div className="rounded-xl p-2.5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <dt className="text-[10px] uppercase tracking-wide text-[var(--muted)]">Titik leleh</dt>
            <dd className="mt-1 text-sm font-medium">{kToC(el.meltK)}</dd>
          </div>
          <div className="rounded-xl p-2.5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <dt className="text-[10px] uppercase tracking-wide text-[var(--muted)]">Titik didih</dt>
            <dd className="mt-1 text-sm font-medium">{kToC(el.boilK)}</dd>
          </div>
        </dl>

        {el.fact && (
          <p className="mt-4 rounded-xl p-3.5 text-sm leading-relaxed"
             style={{ background: `color-mix(in srgb, ${color} 8%, transparent)` }}>
            {el.fact}
          </p>
        )}

        {dbFormula && (
          <Link
            href={`/database?cari=${encodeURIComponent(dbFormula)}`}
            className="mt-4 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ background: `color-mix(in srgb, var(--accent) 12%, transparent)`, color: "var(--accent)" }}
          >
            Lihat di Database Zat →
          </Link>
        )}
      </div>
    </div>
  );
}

export default function PeriodicTable() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<ElementCategory | null>(null);
  const [selected, setSelected] = useState<ChemicalElement | null>(null);

  // Pencarian: nomor/simbol/nama — hasil terbaik ditandai, lainnya diredupkan
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const set = new Set<number>();
    for (const e of ELEMENTS) {
      if (
        e.name.toLowerCase().includes(q) ||
        e.symbol.toLowerCase() === q ||
        String(e.number) === q
      ) {
        set.add(e.number);
      }
    }
    return set;
  }, [query]);

  const isDimmed = (e: ChemicalElement) => {
    if (matches && !matches.has(e.number)) return true;
    if (activeCat && e.category !== activeCat) return true;
    return false;
  };

  const categories = Object.keys(CATEGORY_META) as ElementCategory[];

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="glass-input flex flex-1 items-center gap-2 rounded-full px-4 py-2">
          <Search size={15} strokeWidth={1.75} className="shrink-0 text-[var(--muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari unsur — nama, simbol, atau nomor atom…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
            aria-label="Cari unsur"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Hapus pencarian">
              <X size={14} strokeWidth={1.75} className="text-[var(--muted)]" />
            </button>
          )}
        </label>
        {matches && (
          <span className="rounded-full px-3 py-1.5 text-xs text-[var(--muted)]" style={{ border: "1px solid var(--border)" }}>
            {matches.size} cocok
          </span>
        )}
      </div>

      {/* Tabel */}
      <div className="glass overflow-x-auto rounded-2xl p-3 sm:p-4">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: "repeat(18, minmax(20px, 1fr))",
            gridTemplateRows: "repeat(10, auto)",
            minWidth: 360,
          }}
          role="grid"
          aria-label="Tabel periodik unsur"
        >
          {/* Placeholder lantanida/aktinida di periode 6-7 */}
          {[57, 89].map((startNum, i) => (
            <div
              key={startNum}
              className="flex aspect-square items-center justify-center rounded-md text-[9px] font-medium opacity-50"
              style={{ gridColumn: 3, gridRow: 6 + i, background: "var(--surface)", border: "1px dashed var(--border)" }}
              aria-hidden
            >
              {57 + i * 32}-{71 + i * 32}
            </div>
          ))}
          {ELEMENTS.map((el) => (
            <ElementCell
              key={el.number}
              el={el}
              dimmed={isDimmed(el)}
              selected={selected?.number === el.number}
              onSelect={setSelected}
            />
          ))}
        </div>

        {/* Legend / filter */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveCat(null)}
            className="rounded-full px-2.5 py-1 text-[11px] transition-colors"
            style={
              activeCat === null
                ? { background: "var(--accent)", color: "white" }
                : { border: "1px solid var(--border)", color: "var(--muted)" }
            }
          >
            Semua
          </button>
          {categories.map((cat) => {
            const c = CATEGORY_META[cat].color;
            return (
              <button
                key={cat}
                onClick={() => setActiveCat(activeCat === cat ? null : cat)}
                className="rounded-full px-2.5 py-1 text-[11px] transition-opacity"
                style={{
                  background: activeCat === cat ? c : `color-mix(in srgb, ${c} 12%, transparent)`,
                  color: activeCat === cat ? "white" : c,
                  border: activeCat === cat ? "none" : `1px solid color-mix(in srgb, ${c} 35%, transparent)`,
                  opacity: activeCat && activeCat !== cat ? 0.45 : 1,
                }}
              >
                {CATEGORY_META[cat].label}
              </button>
            );
          })}
        </div>
      </div>

      {selected && <DetailPanel el={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
