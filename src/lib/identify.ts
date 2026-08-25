// Everyday Chemistry — parser & pencocokan daftar komposisi produk.
// Tahan noise OCR dan typo ringan (fuzzy matching berbasis Levenshtein).

import { INGREDIENTS, type Ingredient } from "@/lib/ingredients";
import { SUBSTANCES } from "@/lib/substances";

export interface MatchResult {
  /** Teks asli sebelum dibersihkan */
  raw: string;
  match?: Ingredient;
  confidence: "yakin" | "kemungkinan" | "tidak-dikenal";
}

const LABEL_WORDS = new Set([
  "komposisi", "composition", "ingredients", "bahan", "contains", "contains:",
  "kandungan", "other", "other:", "ingredients:", "komposisi:",
]);

/** Pecah teks komposisi menjadi daftar nama bahan yang bersih. */
export function splitIngredients(text: string): string[] {
  return text
    // normalisasi bullet unicode & penomoran ke koma
    .replace(/[\u2022\u2023\u25E6\u2043\u2219·]/g, ",")
    .replace(/^\s*(\d+|[a-zA-Z])[.)]\s+/gm, ",")
    .replace(/[\u2013\u2014]/g, ",")
    // pecah pada pemisah umum
    .split(/[,;\n]+/)
    .map((part) =>
      part
        .trim()
        // buang label seperti "Komposisi:" di awal entri pertama
        .replace(/^[\s*+]+/, "")
        .split(/\s+/)
        .filter((w) => LABEL_WORDS.has(w.toLowerCase().replace(/:$/, "")) ? false : true)
        .join(" ")
        .trim()
    )
    .filter((s) => s.length > 0);
}

/** Jarak edit Levenshtein sederhana. */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (m === 0 || n === 0) return Math.max(m, n);
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const curr = [i];
    for (let j = 1; j <= n; j++) {
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    prev = curr;
  }
  return prev[n];
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Indeks nama → bahan, dibangun sekali saat modul dimuat.
const nameIndex = new Map<string, Ingredient>();
for (const ing of INGREDIENTS) {
  for (const name of ing.names) nameIndex.set(normalize(name), ing);
}

/** Cari bahan untuk satu nama; fuzzy jika tidak cocok persis. */
export function findIngredient(name: string): { ingredient?: Ingredient; confidence: MatchResult["confidence"] } {
  const norm = normalize(name);
  if (!norm) return { confidence: "tidak-dikenal" };

  const exact = nameIndex.get(norm);
  if (exact) return { ingredient: exact, confidence: "yakin" };

  // Fuzzy: terima 1–2 typo tergantung panjang kata.
  let best: Ingredient | undefined;
  let bestDist = Infinity;
  for (const [key, ing] of nameIndex) {
    const dist = levenshtein(norm, key);
    if (dist < bestDist || (dist === bestDist && best === undefined)) {
      bestDist = dist;
      best = ing;
    }
    if (bestDist === 0) break;
  }
  const tolerance = norm.length >= 12 ? 2 : norm.length >= 7 ? 1 : norm.length >= 4 ? 1 : 0;
  if (best && bestDist <= tolerance) return { ingredient: best, confidence: "kemungkinan" };
  return { confidence: "tidak-dikenal" };
}

/** Identifikasi seluruh daftar komposisi sekaligus. */
export function identifyIngredients(text: string): MatchResult[] {
  return splitIngredients(text).map((raw) => {
    const { ingredient, confidence } = findIngredient(raw);
    return {
      raw,
      match: ingredient,
      confidence,
    } satisfies MatchResult;
  });
}

/** Bahan knowledge-base yang punya pasangan zat di database zat. */
export function linkedSubstance(ing: Ingredient) {
  if (!ing.formula) return undefined;
  return SUBSTANCES.find((s) => s.formula === ing.formula);
}
