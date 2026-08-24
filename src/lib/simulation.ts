// Everyday Chemistry — engine simulasi: titrasi, kesetimbangan, laju reaksi

export interface TitrationPoint { v: number; ph: number }

/** Kurva titrasi asam kuat (HCl) dengan basa kuat (NaOH).
 *  Menghitung pH per penambahan 0,5 mL basa hingga 2× volume ekivalen. */
export function titrationCurve(params: {
  acidConc: number; // M
  acidVol: number;  // mL
  baseConc: number; // M
}): TitrationPoint[] {
  const { acidConc, acidVol, baseConc } = params;
  const eqVol = (acidConc * acidVol) / baseConc;
  const maxV = eqVol * 2;
  const totalAcidMol = acidConc * (acidVol / 1000);

  const pts: TitrationPoint[] = [];
  for (let v = 0; v <= maxV + 0.001; v += 0.5) {
    const volL = v / 1000;
    const totalVol = (acidVol + v) / 1000;
    let ph: number;

    if (v === 0) {
      ph = -Math.log10(acidConc);
    } else if (v < eqVol - 0.25) {
      // asam berlebih
      const molBase = baseConc * volL;
      const hConc = (totalAcidMol - molBase) / totalVol;
      ph = -Math.log10(Math.max(hConc, 1e-14));
    } else if (v <= eqVol + 0.25) {
      // sekitar ekivalen → netral (asam kuat + basa kuat)
      ph = 7;
    } else {
      // basa berlebih
      const oh = (baseConc * (v - eqVol) / 1000) / totalVol;
      ph = 14 + Math.log10(Math.max(oh, 1e-14));
    }
    pts.push({ v: Math.round(v * 10) / 10, ph: Math.round(ph * 100) / 100 });
  }
  return pts;
}

/** Kesetimbangan umum: aA + bB ⇌ cC...
 *  Konvensi stoich: POSITIF = produk, NEGATIF = reaktan.
 *  initial[i] adalah konsentrasi awal; diselesaikan dengan bisection atas
 *  derajat kemajuan x, karena Q(x) monoton naik terhadap x. */
export function equilibriumConcentrations(params: {
  kc: number;
  initial: number[];
  stoich: number[];   // positif = produk, negatif = reaktan
  maxIter?: number;
}): { ok: boolean; final: number[]; extent: number } {
  const { kc, initial, stoich } = params;

  const concAt = (x: number, i: number): number =>
    Math.max(initial[i] + stoich[i] * x, 1e-12);

  // Q(x): produk / reaktan, masing-masing pangkat |koefisien|
  const Q = (x: number): number => {
    let num = 1, den = 1;
    stoich.forEach((coef, i) => {
      const c = concAt(x, i);
      if (coef > 0) num *= Math.pow(c, coef);
      else den *= Math.pow(c, -coef);
    });
    return num / den;
  };

  // batas atas x: konsentrasi reaktan tak boleh negatif
  let xMax = Infinity;
  stoich.forEach((coef, i) => {
    if (coef < 0 && initial[i] > 0) xMax = Math.min(xMax, initial[i] / -coef);
  });
  if (!isFinite(xMax)) return { ok: false, final: [...initial], extent: 0 };

  // bisection — Q(x) monoton naik: Q < Kc berarti perlu x lebih besar
  let lo = 0, hi = xMax;
  let extent = hi / 2;
  const maxIter = params.maxIter ?? 200;
  for (let it = 0; it < maxIter; it++) {
    extent = (lo + hi) / 2;
    const q = Q(extent);
    if (Math.abs(q - kc) / kc < 1e-9) break;
    if (q < kc) lo = extent;
    else hi = extent;
  }

  const final = initial.map((c, i) => concAt(extent, i));
  return { ok: true, final, extent };
}

/** Laju reaksi Arrhenius sederhana orde-satu terhadap konsentrasi.
 *  k = A·exp(−Ea/RT), rate = k·c */
const R_GAS = 8.314;
const A_FACTOR = 1e12;

export function reactionRate(tempC: number, eaKjMol: number, conc: number = 1): number {
  if (conc <= 0) return 0;
  const T = tempC + 273.15;
  const k = A_FACTOR * Math.exp((-eaKjMol * 1000) / (R_GAS * T));
  return k * conc;
}
