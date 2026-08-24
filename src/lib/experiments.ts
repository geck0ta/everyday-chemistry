// Everyday Chemistry — engine eksperimen virtual
// Tiga eksperimen: campuran pH, elektrolisis air, reaksi logam + asam.

/** ===== 1. Campur larutan asam & basa ===== */
export interface MixPhResult {
  ph: number;
  excess: "acid" | "base" | "neutral";
}

export function mixPh(params: { hMol: number; ohMol: number; totalVol: number }): MixPhResult {
  const { hMol, ohMol, totalVol } = params;
  if (totalVol <= 0) return { ph: 7, excess: "neutral" };

  const diff = hMol - ohMol; // positif = asam sisa
  let ph: number;
  let excess: MixPhResult["excess"];

  if (Math.abs(diff) < 1e-10) {
    ph = 7;
    excess = "neutral";
  } else if (diff > 0) {
    ph = -Math.log10(diff / totalVol);
    excess = "acid";
  } else {
    const oh = -diff / totalVol;
    ph = 14 + Math.log10(oh);
    excess = "base";
  }
  return { ph: Math.round(ph * 100) / 100, excess };
}

/** ===== 2. Elektrolisis air ===== */
// 2H2O → 2H2 + O2 ; muat Q = I·t ; mol e⁻ = Q/F
// H2: 2e⁻ per mol ; O2: 4e⁻ per mol → rasio H2:O2 = 2:1
const FARADAY = 96485;

export function electrolysisGas(params: { minutes: number; currentAmpere: number }): {
  chargeCoulomb: number;
  electronMol: number;
  h2Mol: number;
  o2Mol: number;
} {
  const charge = params.currentAmpere * params.minutes * 60;
  const electronMol = charge / FARADAY;
  return {
    chargeCoulomb: Math.round(charge * 10) / 10,
    electronMol,
    h2Mol: electronMol / 2,
    o2Mol: electronMol / 4,
  };
}

/** ===== 3. Reaksi logam + asam ===== */
// Mg + 2HCl → MgCl₂ + H₂ ; Zn serupa ; Fe lambat ; Cu tak bereaksi (di bawah H)
export interface MetalResult {
  reacts: boolean;
  ratePerSec: number;   // mol H₂ per detik pada kondisi tsb
  limitingFactor: "metal" | "acid";
  maxH2Mol: number;
}

const METAL_REACTIVITY: Record<string, { factor: number; molRatioAcid: number }> = {
  Mg: { factor: 5.0, molRatioAcid: 2 },
  Zn: { factor: 2.0, molRatioAcid: 2 },
  Fe: { factor: 0.6, molRatioAcid: 2 },
  Cu: { factor: 0,   molRatioAcid: 0 },
};

const R_GAS_EXP = 8000; // konstanta Arrhenius disederhanakan untuk laju relatif

export function metalAcidReaction(
  metal: string,
  metalMol: number,
  tempC: number,
  acidMol: number = Infinity,
): MetalResult {
  const spec = METAL_REACTIVITY[metal];
  if (!spec || spec.factor === 0) {
    return { reacts: false, ratePerSec: 0, limitingFactor: "metal", maxH2Mol: 0 };
  }

  // pereaksi pembatas: butuh acidMolRatio × metalMol asam
  const neededAcid = spec.molRatioAcid * metalMol;
  const limitingFactor: MetalResult["limitingFactor"] =
    acidMol === Infinity || acidMol >= neededAcid ? "metal" : "acid";

  // mol H2 maksimal: setengah dari mol asam yang bereaksi (2 HCl → 1 H2)
  const maxH2 = limitingFactor === "metal" ? metalMol : acidMol / 2;

  // laju relatif: faktor logam × Arrhenius sederhana (Q10 ≈ 2×/10°C)
  const tempFactor = Math.pow(2, (tempC - 25) / 10);
  const ratePerSec = spec.factor * tempFactor * 1e-4;

  return { reacts: true, ratePerSec, limitingFactor, maxH2Mol: maxH2 };
}
