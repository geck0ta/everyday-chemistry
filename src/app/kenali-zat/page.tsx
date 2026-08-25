import type { Metadata } from "next";
import IngredientScanner from "@/components/ingredient-scanner";

export const metadata: Metadata = {
  title: "Kenali Zat",
  description:
    "Paste komposisi atau foto label produk — kenali tiap bahan kimia, fungsinya, dan catatan keamanannya.",
};

export default function KenaliZatPage() {
  return (
    <main className="relative mx-auto max-w-4xl px-5 pb-16 pt-6 sm:pt-8">
      <header className="max-w-xl">
        <p className="font-mono text-xs text-[var(--accent)]">ketik · paste · foto label</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
          Kenali bahan di balik label
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          Pernah baca komposisi sampo dan bertanya-tanya apa itu Sodium Laureth Sulfate?
          Tempel daftar komposisinya di sini — atau foto langsung labelnya. Tiap bahan
          dijelaskan fungsinya dalam bahasa manusia.
        </p>
      </header>

      <div className="mt-8">
        <IngredientScanner />
      </div>

      <footer className="mt-10 rounded-xl p-4 text-xs leading-relaxed text-[var(--muted)]"
              style={{ border: "1px dashed var(--border)" }}>
        Catatan: knowledge base mencakup ±60 bahan yang paling sering muncul di produk
        Indonesia (kosmetik, makanan, pembersih). Bahan di luar daftarnya ditandai
        &ldquo;tidak dikenali&rdquo; — bukan berarti berbahaya, hanya belum ada di basis data kami.
        Foto diproses sepenuhnya di perangkatmu, tidak pernah diunggah.
      </footer>
    </main>
  );
}
