// Everyday Chemistry — engine simulasi sel volta (elektrokimia).
// E°sel = E°katoda − E°anoda; efek konsentrasi via persamaan Nernst
//   E = E° − (0,0592 / n) · log10 Q

export interface Electrode {
  symbol: string;
  name: string;
  e0: number;          // potensial reduksi standar (V)
  electrons: number;   // n pada reaksi setengah sel
  ion: string;         // bentuk ionnya
  halfReaction: string;
  color: string;       // warna pelat logam
  solutionColor: string; // warna larutan ionnya
}

export const ELECTRODES: Electrode[] = [
  {
    symbol: "Zn", name: "Seng", e0: -0.76, electrons: 2, ion: "Zn²⁺",
    halfReaction: "Zn → Zn²⁺ + 2e⁻",
    color: "#8a93a6", solutionColor: "#b8c4d8",
  },
  {
    symbol: "Cu", name: "Tembaga", e0: 0.34, electrons: 2, ion: "Cu²⁺",
    halfReaction: "Cu²⁺ + 2e⁻ → Cu",
    color: "#c87f4a", solutionColor: "#5ba8d4",
  },
  {
    symbol: "Fe", name: "Besi", e0: -0.44, electrons: 2, ion: "Fe²⁺",
    halfReaction: "Fe → Fe²⁺ + 2e⁻",
    color: "#9aa0a8", solutionColor: "#d4e08a",
  },
  {
    symbol: "Mg", name: "Magnesium", e0: -2.37, electrons: 2, ion: "Mg²⁺",
    halfReaction: "Mg → Mg²⁺ + 2e⁻",
    color: "#c9cdd4", solutionColor: "#d8dde4",
  },
  {
    symbol: "Al", name: "Aluminium", e0: -1.66, electrons: 3, ion: "Al³⁺",
    halfReaction: "Al → Al³⁺ + 3e⁻",
    color: "#b9bec7", solutionColor: "#ccd4de",
  },
  {
    symbol: "Ag", name: "Perak", e0: 0.80, electrons: 1, ion: "Ag⁺",
    halfReaction: "Ag⁺ + e⁻ → Ag",
    color: "#d9dde3", solutionColor: "#aebac9",
  },
];

export function electrodeBySymbol(symbol: string): Electrode | undefined {
  return ELECTRODES.find((e) => e.symbol === symbol);
}

/** E°sel = E°katoda − E°anoda, lalu koreksi Nernst jika [ion] ≠ 1 M. */
export function cellPotential(params: {
  anode: string;
  cathode: string;
  concAnode?: number;
  concCathode?: number;
}): number {
  const anode = electrodeBySymbol(params.anode);
  const cathode = electrodeBySymbol(params.cathode);
  if (!anode || !cathode) return NaN;

  const e0 = cathode.e0 - anode.e0;
  const concA = params.concAnode ?? 1;
  const concC = params.concCathode ?? 1;

  // reaksi total: n·(katoda) + anode → ... ; Q = [ion anoda]^nA / [ion katoda]^nC
  // disederhanakan untuk pasangan sejenis (keduanya M^n+ → log Q = log[A] − log[C])
  const q = concA / concC;
  const n = lcm(anode.electrons, cathode.electrons);
  return e0 - (0.0592 / n) * Math.log10(Math.max(q, 1e-12));
}

function lcm(a: number, b: number): number {
  const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
  return (a * b) / gcd(a, b);
}

export interface VoltaCellResult {
  anode: Electrode & { x?: number };
  cathode: Electrode & { x?: number };
  eCell: number;
  spontan: boolean;
  /** jumlah elektron yang lewat per reaksi sel */
  electronFlow: number;
}

/** Susun sel lengkap: pastikan anoda adalah elektroda yang lebih mudah teroksidasi. */
export function voltaCell(params: {
  anodeId: string;
  cathodeId: string;
  concAnode: number;
  concCathode: number;
}): VoltaCellResult {
  const anode = electrodeBySymbol(params.anodeId)!;
  const cathode = electrodeBySymbol(params.cathodeId)!;

  // Jika pilihan pengguna membuat reaksi tidak spontan, tetap hitung apa adanya —
  // UI yang menyarankan menukar posisi.
  const eCell = cellPotential({
    anode: anode.symbol,
    cathode: cathode.symbol,
    concAnode: params.concAnode,
    concCathode: params.concCathode,
  });

  return {
    anode,
    cathode,
    eCell,
    spontan: eCell > 0.001,
    electronFlow: Math.min(anode.electrons, cathode.electrons),
  };
}
