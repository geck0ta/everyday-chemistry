// Pereaksi pembatas & yield
import type { Step } from "@/lib/chemistry";

export interface LimitingResult {
  ok: boolean;
  limitingIndex?: number;
  productMol?: number;
  leftover?: { index: number; mol: number }[];
  steps?: Step[];
  error?: string;
}

const fmt = (n: number) => parseFloat(n.toPrecision(6)).toString();

/** limitingReagent: mols & coeffs untuk REAKTAN saja;
 *  productCoeffs = koefisien produk; productIdx = indeks produk target (0-based). */
export function limitingReagent(
  mols: number[], coeffs: number[], productCoeffs: number | number[], productIdx = 0
): LimitingResult {
  if (mols.some((m) => m < 0) || mols.length !== coeffs.length || mols.length === 0) {
    return { ok: false, error: "Input tidak valid." };
  }
  const pCoeffs = typeof productCoeffs === "number" ? [productCoeffs] : productCoeffs;
  if (!pCoeffs[productIdx]) return { ok: false, error: "Koefisien produk tidak valid." };

  const ratio = mols.map((m, i) => m / coeffs[i]);
  const limitingIndex = ratio.indexOf(Math.min(...ratio));
  const extent = ratio[limitingIndex];

  const productMol = extent * pCoeffs[productIdx];
  const leftover = mols
    .map((m, i) => ({ index: i, mol: m - extent * coeffs[i] }))
    .filter((x) => x.mol > 1e-9);

  const steps: Step[] = [
    { title: "Hitung rasio mol ÷ koefisien", result: mols.map((m, i) => `${fmt(m)}/${coeffs[i]}=${fmt(ratio[i])}`).join(", ") },
    { title: "Rasio terkecil → pereaksi pembatas", result: `pereaksi ke-${limitingIndex + 1}` },
    { title: "Mol produk", formula: `n produk = ${fmt(extent)} × ${pCoeffs[productIdx]}`, result: `${fmt(productMol)} mol` },
    ...(leftover.length ? [{
      title: "Sisa pereaksi berlebih",
      result: leftover.map((l) => `pereaksi ke-${l.index + 1}: ${fmt(l.mol)} mol`).join(", "),
    }] : []),
  ];

  return { ok: true, limitingIndex, productMol, leftover, steps };
}

export function reactionYield(actual: number, theoretical: number): { ok: boolean; percent?: number; error?: string } {
  if (theoretical <= 0 || actual < 0) return { ok: false, error: "Hasil teoretis harus > 0 dan aktual ≥ 0." };
  const percent = (actual / theoretical) * 100;
  if (percent > 100.001) return { ok: false, error: "Hasil aktual tidak bisa melebihi teoretis." };
  return {
    ok: true, percent,
    ...( {
      steps: [
        { title: "Rumus persen hasil", formula: "% hasil = (hasil aktual / hasil teoretis) × 100%" },
        { title: "Substitusi", substitution: `(${fmt(actual)} / ${fmt(theoretical)}) × 100%` },
        { title: "Hasil", result: `${fmt(percent)}%` },
      ] as Step[],
    }),
  } as { ok: boolean; percent?: number; error?: string };
}
