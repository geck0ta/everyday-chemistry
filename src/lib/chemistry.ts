// Everyday Chemistry — calculation engine
// Setiap fungsi mengembalikan hasil + langkah penyelesaian bertahap.

export interface Step {
  title: string;
  formula?: string;
  substitution?: string;
  result?: string;
}

export interface CalcResult {
  ok: boolean;
  value?: number;
  unit?: string;
  summary?: string;
  steps: Step[];
  error?: string;
}

const fmt = (n: number, digits = 4): string => {
  if (!isFinite(n)) return "∞";
  if (n !== 0 && (Math.abs(n) >= 1e5 || Math.abs(n) < 1e-3)) {
    return n.toExponential(3).replace("e", " × 10^").replace("^+", "^");
  }
  return parseFloat(n.toPrecision(6)).toString();
};

// ---------- Massa molar ----------
export const ATOMIC_MASSES: Record<string, number> = {
  H: 1.008, He: 4.0026, Li: 6.94, Be: 9.0122, B: 10.81, C: 12.011,
  N: 14.007, O: 15.999, F: 18.998, Ne: 20.18, Na: 22.99, Mg: 24.305,
  Al: 26.982, Si: 28.085, P: 30.974, S: 32.06, Cl: 35.45, Ar: 39.948,
  K: 39.098, Ca: 40.078, Ti: 47.867, Cr: 51.996, Mn: 54.938,
  Fe: 55.845, Ni: 58.693, Cu: 63.546, Zn: 65.38, Br: 79.904,
  Ag: 107.87, I: 126.9, Ba: 137.33, Pt: 195.08, Au: 196.97,
  Hg: 200.59, Pb: 207.2,
};

/** Parse formula sederhana, mis. H2SO4, Ca(OH)2, CuSO4·5H2O */
export function parseFormula(formula: string): Record<string, number> | null {
  const f = formula.replace(/\s/g, "").replace(/·|\*/g, ".");
  const segments = f.split(".");
  const total: Record<string, number> = {};

  for (const [i, seg] of segments.entries()) {
    const multiplier = i === 0 ? 1 : parseFloat(segments[i - 1] === "" ? "" : "");
    void multiplier;
    // koefisien titik: "5H2O" setelah titik
    const m = seg.match(/^(\d*)(.*)$/);
    if (!m || !m[2]) return null;
    const segMult = m[1] ? parseInt(m[1]) : 1;
    const counts = parseSegment(m[2]);
    if (!counts) return null;
    for (const [el, n] of Object.entries(counts)) {
      total[el] = (total[el] ?? 0) + n * segMult;
    }
  }
  return Object.keys(total).length ? total : null;
}

function parseSegment(seg: string): Record<string, number> | null {
  let counts: Record<string, number> = {};
  const tokens = seg.match(/([A-Z][a-z]?)(\d*)|\(([^()]*)\)(\d*)/g);
  if (!tokens) return null;
  for (const t of tokens) {
    const group = t.match(/^\(([^()]*)\)(\d*)$/);
    if (group) {
      const inner = parseSegment(group[1]);
      if (!inner) return null;
      const mult = group[2] ? parseInt(group[2]) : 1;
      for (const [el, n] of Object.entries(inner)) {
        counts[el] = (counts[el] ?? 0) + n * mult;
      }
    } else {
      const el = t.match(/^([A-Z][a-z]?)/);
      if (!el) return null;
      const numMatch = t.match(/^([A-Z][a-z]?)(\d*)$/);
      const n = numMatch && numMatch[2] ? parseInt(numMatch[2]) : 1;
      counts[el[1]] = (counts[el[1]] ?? 0) + n;
    }
  }
  return counts;
}

export function molarMass(formula: string): CalcResult {
  const trimmed = formula.trim();
  if (!trimmed) return { ok: false, steps: [], error: "Masukkan rumus kimia terlebih dahulu." };
  const counts = parseFormula(trimmed);
  if (!counts) return { ok: false, steps: [], error: `Rumus "${trimmed}" tidak dapat dibaca. Contoh yang valid: H2O, Ca(OH)2, CuSO4·5H2O` };

  const unknown = Object.keys(counts).filter((el) => !(el in ATOMIC_MASSES));
  if (unknown.length) return { ok: false, steps: [], error: `Unsur tidak dikenal: ${unknown.join(", ")}` };

  let total = 0;
  const parts: string[] = [];
  const steps: Step[] = [
    { title: "Tuliskan komposisi unsur", result: Object.entries(counts).map(([el, n]) => `${el}×${n}`).join(", ") },
  ];

  for (const [el, n] of Object.entries(counts)) {
    const mass = ATOMIC_MASSES[el] * n;
    total += mass;
    parts.push(`${n}(${ATOMIC_MASSES[el]})`);
    steps.push({
      title: `${el}: ${n} × ${ATOMIC_MASSES[el]} g/mol`,
      result: `${fmt(mass)} g/mol`,
    });
  }

  steps.push({
    title: "Jumlahkan semua",
    formula: parts.join(" + "),
    result: `M = ${fmt(total)} g/mol`,
  });

  return { ok: true, value: total, unit: "g/mol", summary: `Massa molar ${trimmed} = ${fmt(total)} g/mol`, steps };
}

// ---------- Mol ----------
export function molFromMass(mass: number, molarMassVal: number): CalcResult {
  const steps: Step[] = [
    { title: "Rumus jumlah mol", formula: "n = m / M" },
    { title: "Substitusi nilai", substitution: `n = ${fmt(mass)} g / ${fmt(molarMassVal)} g/mol`, },
    { title: "Hasil", formula: `n = ${fmt(mass / molarMassVal)} mol`, result: `n = ${fmt(mass / molarMassVal)} mol` },
  ];
  return { ok: true, value: mass / molarMassVal, unit: "mol", summary: `n = ${fmt(mass / molarMassVal)} mol`, steps };
}

export function massFromMol(n: number, molarMassVal: number): CalcResult {
  const m = n * molarMassVal;
  return {
    ok: true, value: m, unit: "g",
    summary: `m = ${fmt(m)} g`,
    steps: [
      { title: "Rumus massa", formula: "m = n × M" },
      { title: "Substitusi nilai", substitution: `m = ${fmt(n)} mol × ${fmt(molarMassVal)} g/mol` },
      { title: "Hasil", result: `m = ${fmt(m)} g` },
    ],
  };
}

// ---------- Molaritas ----------
export function molarity(mol: number, volumeL: number): CalcResult {
  if (volumeL <= 0) return { ok: false, steps: [], error: "Volume harus lebih besar dari 0." };
  const M = mol / volumeL;
  return {
    ok: true, value: M, unit: "M",
    summary: `M = ${fmt(M)} mol/L`,
    steps: [
      { title: "Rumus molaritas", formula: "M = n / V" },
      { title: "Substitusi nilai", substitution: `M = ${fmt(mol)} mol / ${fmt(volumeL)} L` },
      { title: "Hasil", result: `M = ${fmt(M)} M` },
    ],
  };
}

// ---------- Pengenceran ----------
export function dilution(M1: number, V1: number, M2: number): CalcResult {
  if (M2 <= 0 || M2 > M1) return { ok: false, steps: [], error: "M₂ harus > 0 dan ≤ M₁ (pengenceran tidak menaikkan konsentrasi)." };
  const V2 = (M1 * V1) / M2;
  return {
    ok: true, value: V2, unit: "L",
    summary: `V₂ = ${fmt(V2)} L (tambahkan air hingga volume total ${fmt(V2)} L)`,
    steps: [
      { title: "Rumus pengenceran", formula: "M₁V₁ = M₂V₂" },
      { title: "Substitusi nilai", substitution: `${fmt(M1)} × ${fmt(V1)} = ${fmt(M2)} × V₂` },
      { title: "Selesaikan untuk V₂", substitution: `V₂ = (${fmt(M1)} × ${fmt(V1)}) / ${fmt(M2)}` },
      { title: "Hasil", result: `V₂ = ${fmt(V2)} L` },
    ],
  };
}

// ---------- pH ----------
export function phFromConcentration(conc: number, kind: "h" | "oh"): CalcResult {
  if (conc <= 0 || conc > 1) return { ok: false, steps: [], error: "Konsentrasi harus di antara 0 dan 1 M." };
  let h = conc;
  let pOH: number | undefined;
  const steps: Step[] = [];
  if (kind === "oh") {
    pOH = -Math.log10(conc);
    h = Math.pow(10, -(14 - pOH));
    steps.push({ title: "[OH⁻] diketahui", substitution: `[OH⁻] = ${fmt(conc)} M` });
    steps.push({ title: "Hitung pOH", formula: "pOH = −log [OH⁻]", result: `pOH = ${fmt(pOH)}` });
    steps.push({ title: "Konversi ke pH", formula: "pH = 14 − pOH", result: `pH = ${fmt(14 - pOH)}` });
  } else {
    steps.push({ title: "[H⁺] diketahui", substitution: `[H⁺] = ${fmt(conc)} M` });
    steps.push({ title: "Hitung pH", formula: "pH = −log [H⁺]", result: `pH = ${fmt(-Math.log10(h))}` });
  }
  const pH = kind === "oh" ? 14 - pOH! : -Math.log10(h);
  const nature = pH < 7 ? "Asam" : pH > 7 ? "Basa" : "Netral";
  return {
    ok: true, value: pH, unit: "",
    summary: `pH = ${fmt(pH)} → larutan bersifat ${nature}`,
    steps,
  };
}
