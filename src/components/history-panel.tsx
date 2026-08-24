"use client";

import { useEffect, useState } from "react";
import { History, Trash2, X } from "lucide-react";
import Formula from "@/components/formula";

export interface HistoryItem {
  mode: string;
  input: string;
  summary: string;
  at: number;
}

const KEY = "ec-calc-history";
const MAX = 12;

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export default function HistoryPanel({ items, onClear }: { items: HistoryItem[]; onClear: () => void }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || items.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="glass mt-3 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
      >
        <History size={13} strokeWidth={1.75} />
        Riwayat ({items.length})
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 w-full max-w-md rounded-2xl p-4 sm:w-[26rem]"
          style={{ background: "var(--surface-solid)", border: "1px solid var(--border)", boxShadow: "0 12px 40px rgba(0,0,0,.18)" }}>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              <History size={13} strokeWidth={1.75} /> Riwayat perhitungan
            </span>
            <div className="flex items-center gap-1">
              <button onClick={onClear} aria-label="Hapus semua" className="rounded-full p-1.5 text-[var(--muted)] hover:text-red-400">
                <Trash2 size={13} strokeWidth={1.75} />
              </button>
              <button onClick={() => setOpen(false)} aria-label="Tutup" className="rounded-full p-1.5 text-[var(--muted)] hover:text-[var(--text)]">
                <X size={13} strokeWidth={1.75} />
              </button>
            </div>
          </div>
          <ul className="mt-2 max-h-72 overflow-y-auto">
            {items.map((h, i) => (
              <li key={h.at + "" + i} className="border-b py-2 last:border-b-0" style={{ borderColor: "var(--border)" }}>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]/70">{h.mode}</p>
                <p className="truncate text-xs text-[var(--muted)]"><Formula text={h.input} /></p>
                <p className="mt-0.5 font-mono text-sm font-medium text-[var(--accent)]"><Formula text={h.summary} /></p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
