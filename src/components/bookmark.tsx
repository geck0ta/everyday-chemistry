"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { PHENOMENA } from "@/lib/phenomena";

const KEY = "ec-bookmarks";
const load = (): string[] => {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
};

export function useBookmarks() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => setIds(load()), []);
  const toggle = (id: string) => {
    const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
    setIds(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  };
  return { ids, toggle };
}

/** Tombol bookmark di halaman detail */
export function BookmarkButton({ id }: { id: string }) {
  const { ids, toggle } = useBookmarks();
  const saved = ids.includes(id);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <button
      onClick={() => toggle(id)}
      aria-pressed={saved}
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs transition-colors ${
        mounted && saved ? "text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--text)]"
      }`}
      style={{ border: "1px solid var(--border)" }}
    >
      {mounted && saved
        ? <><BookmarkCheck size={13} strokeWidth={1.75} /> Tersimpan</>
        : <><Bookmark size={13} strokeWidth={1.75} /> Simpan</>}
    </button>
  );
}

/** Panel daftar fenomena tersimpan (ditampilkan di halaman explorer) */
export default function Bookmarked() {
  const { ids, toggle } = useBookmarks();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || ids.length === 0) return null;

  const items = ids.map((id) => PHENOMENA.find((p) => p.id === id)).filter(Boolean);

  return (
    <div className="glass mt-5 p-5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold">
          <BookmarkCheck size={15} strokeWidth={1.75} className="text-[var(--accent)]" />
          Tersimpan ({items.length})
        </h2>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((p) => p && (
          <span key={p.id} className="inline-flex items-center overflow-hidden rounded-full text-xs" style={{ border: "1px solid var(--border)" }}>
            <Link href={`/explorer/${p.id}`} className="px-3 py-1.5 transition-colors hover:text-[var(--accent)]">
              {p.title.replace(/^(Mengapa|Bagaimana|Apa|Dari mana) /, "")}
            </Link>
            <button onClick={() => toggle(p.id)} aria-label={`Hapus ${p.title}`} className="px-2 py-1.5 text-[var(--muted)] hover:text-red-400">✕</button>
          </span>
        ))}
      </div>
    </div>
  );
}
