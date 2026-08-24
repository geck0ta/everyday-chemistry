"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { PHENOMENA, CATEGORIES, type Phenomenon } from "@/lib/phenomena";

const CAT_COLORS: Record<string, string> = {
  "Redoks": "#e8794a",
  "Asam–Basa": "#5b8def",
  "Biokimia": "#0d9373",
  "Larutan & Campuran": "#9d6fd6",
  "Termokimia": "#d99a3c",
  "Fisika-Kimia": "#4aa8bd",
};

function catColor(c: string) {
  return CAT_COLORS[c] ?? "#7c8aa0";
}

export default function Explorer() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | null>(null);

  const list = useMemo(() => {
    const q = query.toLowerCase().trim();
    return PHENOMENA.filter((p) => {
      if (cat && p.category !== cat) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.concepts.join(" ").toLowerCase().includes(q)
      );
    });
  }, [query, cat]);

  return (
    <section aria-label="Chemistry Explorer">
      {/* Pencarian + filter */}
      <div className="flex flex-col gap-3">
        <div className="glass-input flex items-center gap-2.5 rounded-xl px-4">
          <Search size={16} strokeWidth={1.75} className="shrink-0 text-[var(--muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari fenomena… mis. karat, pH, fermentasi"
            className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-[var(--muted)]/60"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Hapus pencarian" className="text-[var(--muted)] hover:text-[var(--text)]">
              <X size={14} strokeWidth={1.75} />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setCat(null)}
            className={`rounded-full px-3.5 py-1.5 text-xs transition-colors ${
              cat === null ? "bg-[var(--text)] font-medium text-[var(--bg)]" : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
            style={cat !== null ? { border: "1px solid var(--border)" } : undefined}
          >
            Semua · {PHENOMENA.length}
          </button>
          {CATEGORIES.map((c) => {
            const count = PHENOMENA.filter((p) => p.category === c).length;
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

      {/* Grid kartu — link ke halaman detail */}
      <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <Link
            key={p.id}
            href={`/explorer/${p.id}`}
            className="glass group p-5 text-left transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]/40"
          >
            <span
              className="rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest"
              style={{ background: catColor(p.category) + "14", color: catColor(p.category) }}
            >
              {p.category}
            </span>
            <h3 className="mt-2.5 font-medium leading-snug transition-colors group-hover:text-[var(--accent)]">
              {p.title.replace(/^Mengapa |^Bagaimana |^Apa |^Dari mana /, "")}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[var(--muted)]">{p.summary}</p>
          </Link>
        ))}
      </div>

      {list.length === 0 && (
        <p className="mt-8 text-center text-sm text-[var(--muted)]">
          Tidak ada fenomena yang cocok dengan “{query}”. Coba kata lain — misalnya “api”, “soda”, atau “roti”.
        </p>
      )}

    </section>
  );
}
