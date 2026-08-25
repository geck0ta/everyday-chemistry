"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { Camera, ClipboardPaste, Loader2, Plus, ScanText, Search, TriangleAlert, X } from "lucide-react";
import { identifyIngredients, linkedSubstance } from "@/lib/identify";
import type { MatchResult } from "@/lib/identify";
import Formula from "@/components/formula";

const CONF_META = {
  yakin: { label: "dikenali", color: "var(--accent)" },
  kemungkinan: { label: "kemungkinan", color: "#a07d1f" },
  "tidak-dikenal": { label: "tidak dikenali", color: "var(--muted)" },
} as const;

const CONTOH =
  "Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Sodium Chloride, Citric Acid, Nipagin, Parfum";

function ResultCard({ r }: { r: MatchResult }) {
  const meta = CONF_META[r.confidence];
  const substance = r.match ? linkedSubstance(r.match) : undefined;

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{r.raw}</p>
          {r.match && (
            <p className="mt-0.5 truncate font-mono text-[11px] text-[var(--muted)]">
              {r.match.names[1] ?? r.match.names[0]}
            </p>
          )}
        </div>
        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider"
          style={{ background: `color-mix(in srgb, ${meta.color} 12%, transparent)`, color: meta.color }}
        >
          {meta.label}
        </span>
      </div>

      {r.match ? (
        <>
          <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted)]">{r.match.role}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span
              className="rounded-full px-2 py-0.5 font-mono text-[10px]"
              style={{ background: "var(--surface-solid)", border: "1px solid var(--border)" }}
            >
              {r.match.group}
            </span>
            {r.match.formula && (
              <span
                className="rounded-full px-2 py-0.5 font-mono text-[10px]"
                style={{ background: "var(--surface-solid)", border: "1px solid var(--border)" }}
              >
                <Formula text={r.match.formula} />
              </span>
            )}
            {substance && (
              <Link
                href={`/database?cari=${encodeURIComponent(substance.name)}`}
                className="rounded-full px-2 py-0.5 text-[10px] underline decoration-dotted"
                style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)", color: "var(--accent)" }}
              >
                ada di Database Zat →
              </Link>
            )}
          </div>
          {r.match.safety && (
            <p className="mt-2.5 flex items-start gap-1.5 rounded-lg p-2 text-xs leading-relaxed"
               style={{ background: "color-mix(in srgb, #d14d6b 8%, transparent)", color: "#d14d6b" }}>
              <TriangleAlert size={13} strokeWidth={1.75} className="mt-0.5 shrink-0" />
              {r.match.safety}
            </p>
          )}
        </>
      ) : (
        <>
          <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
            Belum ada di knowledge base kami (baru ±65 bahan umum). Coba ketik ulang
            bahan ini kalau hasil OCR kurang tepat.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const raw = encodeURIComponent(r.raw);
              const subject = encodeURIComponent(`Permintaan tambahan bahan: ${r.raw}`);
              window.location.href = `mailto:hello@example.com?subject=${subject}&body=Saya menemukan bahan ini pada label produk:%0A%0A${raw}%0A%0ASilakan tambahkan ke knowledge base Everyday Chemistry.`;
            }}
            className="mt-2.5"
          >
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
              style={{ border: "1px solid var(--border)" }}
            >
              <Plus size={13} strokeWidth={1.75} />
              Minta tambah bahan ini
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default function IngredientScanner() {
  const [text, setText] = useState("");
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [ocrState, setOcrState] = useState<"idle" | "loading" | "error">("idle");
  const [ocrMsg, setOcrMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const runIdentify = useCallback((input: string) => {
    const clean = input.replace(/\s+/g, " ").trim();
    if (!clean) return;
    setResults(identifyIngredients(clean));
  }, []);

  const handleOcrFile = useCallback(async (file: File) => {
    setOcrState("loading");
    setOcrMsg("Menyiapkan mesin baca teks…");
    try {
      // dynamic import agar tesseract.js tidak membebani bundle halaman lain;
      // worker & core dari CDN agar tidak rusak oleh proses bundling Next.js
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng", 1, {
        workerPath: "https://cdn.jsdelivr.net/npm/tesseract.js@7/dist/worker.min.js",
        corePath: "https://cdn.jsdelivr.net/npm/tesseract.js-core@7",
        langPath: "https://tessdata.projectnaptha.com/4.0.0",
      });
      setOcrMsg("Membaca teks dari gambar…");
      const { data } = await worker.recognize(file);
      await worker.terminate();
      const out = data.text.trim();
      if (!out) {
        setOcrState("error");
        setOcrMsg("Tidak ada teks terbaca. Coba foto lebih dekat dengan pencahayaan cukup.");
        return;
      }
      setText(out.replace(/\n+/g, ", "));
      setResults(identifyIngredients(out));
      setOcrState("idle");
      setOcrMsg("");
    } catch {
      setOcrState("error");
      setOcrMsg("OCR gagal dimuat (butuh koneksi internet pertama kali). Ketik/paste komposisinya saja dulu.");
    }
  }, []);

  const unknownCount = results?.filter((r) => !r.match).length ?? 0;

  return (
    <div className="space-y-6">
      {/* Input area */}
      <div className="glass rounded-2xl p-4 sm:p-5">
        <label htmlFor="komposisi" className="text-sm font-medium">
          Komposisi produk
        </label>
        <textarea
          id="komposisi"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setResults(null);
          }}
          placeholder="Paste atau ketik daftar komposisi dari label… mis. Aqua, Glycerin, Nipagin, Parfum"
          rows={4}
          className="glass-input mt-2 w-full resize-y rounded-xl p-3 text-sm leading-relaxed outline-none"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            onClick={() => runIdentify(text)}
            disabled={!text.trim()}
            className="flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-40"
          >
            <Search size={15} strokeWidth={1.75} />
            Kenali bahan
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={ocrState === "loading"}
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-colors"
            style={{ border: "1px solid var(--border)" }}
          >
            {ocrState === "loading" ? (
              <Loader2 size={15} strokeWidth={1.75} className="animate-spin" />
            ) : (
              <Camera size={15} strokeWidth={1.75} />
            )}
            Baca dari foto label
          </button>
          <button
            onClick={() => {
              setText(CONTOH);
              setResults(null);
            }}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs text-[var(--muted)] transition-colors hover:text-[var(--text)]"
          >
            <ClipboardPaste size={13} strokeWidth={1.75} />
            Contoh komposisi sampo
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleOcrFile(f);
              e.target.value = "";
            }}
          />
        </div>

        {ocrState === "loading" && (
          <p className="mt-3 flex items-center gap-2 text-xs text-[var(--muted)]">
            <Loader2 size={13} strokeWidth={1.75} className="animate-spin" />
            {ocrMsg}
          </p>
        )}
        {ocrState === "error" && (
          <p className="mt-3 flex items-center gap-2 text-xs" style={{ color: "#d14d6b" }}>
            <TriangleAlert size={13} strokeWidth={1.75} />
            {ocrMsg}
          </p>
        )}
      </div>

      {/* Results */}
      {results && (
        <section aria-label="Hasil identifikasi">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-medium">
              <ScanText size={16} strokeWidth={1.75} />
              {results.length} bahan · {results.length - unknownCount} dikenali
            </h2>
            <button
              onClick={() => {
                setResults(null);
                setText("");
                setOcrState("idle");
                setOcrMsg("");
              }}
              className="flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--text)]"
            >
              <X size={13} strokeWidth={1.75} />
              Bersihkan
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {results.map((r, i) => (
              <ResultCard key={`${r.raw}-${i}`} r={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
