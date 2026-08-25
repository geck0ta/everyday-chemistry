// Everyday Chemistry — engine simulasi larutan penyangga (buffer).
// Berbasis persamaan Henderson–Hasselbalch:
//   pH = pKa + log10([basa garam]/[asam])

export interface BufferSystem {
  id: string;
  label: string;
  acidLabel: string;    // nama asam lemah
  baseLabel: string;    // nama basa konjugasinya (garam)
  pka: number;
  everyday: string;     // di mana kita menemukannya
}

export const BUFFER_SYSTEMS: BufferSystem[] = [
  {
    id: "asetat",
    label: "Asetat",
    acidLabel: "CH₃COOH (asam asetat)",
    baseLabel: "CH₃COONa (natrium asetat)",
    pka: 4.74,
    everyday: "Cuka + garamnya — pengawet makanan & larutan penyangga laboratorium.",
  },
  {
    id: "darah",
    label: "Bikarbonat Darah",
    acidLabel: "H₂CO₃ (asam karbonat)",
    baseLabel: "HCO₃⁻ (ion bikarbonat)",
    pka: 6.35,
    everyday: "Sistem penyangga darahmu! Menjaga pH 7,35–7,45 agar enzim tetap bekerja.",
  },
  {
    id: "fosfat",
    label: "Fosfat",
    acidLabel: "H₂PO₄⁻",
    baseLabel: "HPO₄²⁻",
    pka: 7.21,
    everyday: "Air kolam renang & cairan biologis di dalam sel.",
  },
  {
    id: "amonia",
    label: "Amonia/Amonium",
    acidLabel: "NH₄⁺ (amonium)",
    baseLabel: "NH₃ (amonia)",
    pka: 9.25,
    everyday: "Pembersih lantai beramonia — kenapa tidak sekeras soda api? Karena tersangga.",
  },
];

export interface BufferState {
  ph: number;
  ratio: number;      // [basa]/[asam]
  capacity: number;   // mol H⁺/OH⁻ per liter yang bisa dineetralkan
}

/** Kapasitas penyangga: rata-rata harmonik kedua komponen (per liter). */
export function bufferCapacity(params: { system: BufferSystem; acidConc: number; baseConc: number }): number {
  const { acidConc, baseConc } = params;
  if (acidConc <= 0 || baseConc <= 0) return 0;
  return (2 * acidConc * baseConc) / (acidConc + baseConc);
}

/** pH buffer via Henderson–Hasselbalch. */
export function bufferPh(params: { system: BufferSystem; acidConc: number; baseConc: number }): BufferState {
  const { system, acidConc, baseConc } = params;
  const ratio = baseConc / Math.max(acidConc, 1e-12);
  const ph = system.pka + Math.log10(ratio);
  return { ph, ratio, capacity: bufferCapacity({ system, acidConc, baseConc }) };
}

export interface AddResult {
  ok: boolean;
  ph?: number;
  /** pesan apa yang terjadi */
  note?: string;
}

/** Tambahkan mol ion H⁺ (asam kuat) ke dalam buffer. */
export function addAcidToBuffer(params: {
  system: BufferSystem;
  acidConc: number;
  baseConc: number;
  molH: number;
}): AddResult {
  const { system, acidConc, baseConc, molH } = params;
  if (molH > baseConc - 1e-9) {
    return { ok: false, note: `Kapasitas habis — butuh lebih dari ${baseConc.toFixed(3)} mol basa konjugasi untuk menahan asam sebanyak itu.` };
  }
  const newBase = baseConc - molH;
  const newAcid = acidConc + molH;
  return { ok: true, ...bufferPh({ system, acidConc: newAcid, baseConc: newBase }) };
}

/** Tambahkan mol ion OH⁻ (basakuat) ke dalam buffer. */
export function addBaseToBuffer(params: {
  system: BufferSystem;
  acidConc: number;
  baseConc: number;
  molOh: number;
}): AddResult {
  const { system, acidConc, baseConc, molOh } = params;
  if (molOh > acidConc - 1e-9) {
    return { ok: false, note: `Kapasitas habis — butuh lebih dari ${acidConc.toFixed(3)} mol asam lemah untuk menahan basa sebanyak itu.` };
  }
  const newAcid = acidConc - molOh;
  const newBase = baseConc + molOh;
  return { ok: true, ...bufferPh({ system, acidConc: newAcid, baseConc: newBase }) };
}

export interface BufferPoint {
  mol: number;       // kumulatif OH⁻ yang ditambahkan
  ph: number;
  phase: "penyangga" | "ekivalen" | "basa-berlebih";
}

/**
 * Kurva titrasi buffer terhadap basakuat:
 * datar di sekitar pKa → melompat di ekivalen → mendatar lagi di daerah basakuat.
 * Asumsi volume total 1 L dan konsentrasi NaOH tinggi (efek dilusi diabaikan).
 */
export function bufferCurve(params: {
  system: BufferSystem;
  acidConc: number;
  baseConc: number;
  maxMol: number;
  step?: number;
}): BufferPoint[] {
  const { system, acidConc, baseConc, maxMol } = params;
  const step = params.step ?? maxMol / 100;
  const pts: BufferPoint[] = [];
  const eqMol = acidConc;

  for (let mol = 0; mol <= maxMol + step / 2; mol += step) {
    let ph: number;
    let phase: BufferPoint["phase"];
    if (mol < eqMol - 1e-9) {
      // masih di dalam kapasitas: OH⁻ mengubah asam jadi basa
      const newAcid = acidConc - mol;
      const newBase = baseConc + mol;
      ph = bufferPh({ system, acidConc: newAcid, baseConc: newBase }).ph;
      phase = "penyangga";
    } else if (mol <= eqMol + 2 * step) {
      // titik ekivalen: semua asam sudah jadi basa
      const conc = (baseConc + eqMol) / 1;
      // pH ditentukan hidrolisis basa konjugasi: pOH = ½(pKw − pKa − log c)
      ph = 14 - 0.5 * (14 - system.pka - Math.log10(conc));
      phase = "ekivalen";
    } else {
      // basakuat berlebih
      const ohExcess = mol - eqMol;
      ph = 14 + Math.log10(Math.max(ohExcess / 1, 1e-14));
      phase = "basa-berlebih";
    }
    pts.push({
      mol: Math.round(mol * 10000) / 10000,
      ph: Math.round(ph * 100) / 100,
      phase,
    });
  }
  return pts;
}
