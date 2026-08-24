// Balancing persamaan kimia — solver nullspace pecahan eksak
import { parseFormula, ATOMIC_MASSES } from "@/lib/chemistry";

export interface BalanceResult {
  ok: boolean;
  coeffs?: number[];
  species?: string[];
  formatted?: string;
  error?: string;
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const lcm = (a: number, b: number): number => Math.abs(a * b) / (gcd(a, b) || 1);

type Frac = { p: number; q: number };

function frac(p: number, q: number): Frac {
  if (q < 0) { p = -p; q = -q; }
  const g = gcd(Math.abs(p), q) || 1;
  return { p: p / g, q: q / g };
}
const fSub = (a: Frac, b: Frac) => frac(a.p * b.q - b.p * a.q, a.q * b.q);
const fMul = (a: Frac, b: Frac) => frac(a.p * b.p, a.q * b.q);
const fDiv = (a: Frac, b: Frac) => frac(a.p * b.q, a.q * b.p);
const isZero = (f: Frac) => f.p === 0;

function nullspaceVector(A: Frac[][], rows: number, n: number): number[] | null {
  const M = A.map((r) => [...r]);
  const pivotOfCol: Record<number, number> = {};
  let r = 0;
  for (let c = 0; c < n && r < rows; c++) {
    let piv = -1;
    for (let rr = r; rr < rows; rr++) if (!isZero(M[rr][c])) { piv = rr; break; }
    if (piv === -1) continue;
    [M[r], M[piv]] = [M[piv], M[r]];
    const pv = M[r][c];
    for (let cc = 0; cc < n; cc++) M[r][cc] = fDiv(M[r][cc], pv);
    pivotOfCol[c] = r;
    for (let rr2 = 0; rr2 < rows; rr2++) {
      if (rr2 === r || isZero(M[rr2][c])) continue;
      const factor = M[rr2][c];
      for (let cc = 0; cc < n; cc++) {
        M[rr2][cc] = fSub(M[rr2][cc], fMul(factor, M[r][cc]));
      }
    }
    r++;
  }

  const pivotCols = Object.keys(pivotOfCol).map(Number).sort((a, b) => a - b);
  const freeCols = Array.from({ length: n }, (_, i) => i).filter((col) => !pivotCols.includes(col));
  if (freeCols.length !== 1) return null;
  const free = freeCols[0];

  const x: number[] = Array(n).fill(0);
  x[free] = 1;
  for (const pc of pivotCols) {
    const rowIdx = pivotOfCol[pc];
    const val = M[rowIdx][free];
    if (!isZero(val)) x[pc] = -val.p / val.q;
  }
  return x;
}

export function balanceEquation(input: string): BalanceResult {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, error: "Masukkan persamaan reaksi. Contoh: CH4 + O2 -> CO2 + H2O" };
  const norm = trimmed.replace(/→|=>|=/g, "->").replace(/\s/g, "");
  const parts = norm.split("->");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { ok: false, error: "Format harus memakai -> antara reaktan dan produk. Contoh: H2 + O2 -> H2O" };
  }
  const left = parts[0].split("+");
  const right = parts[1].split("+");
  const species = [...left, ...right];
  const n = species.length;

  const parsed = species.map(parseFormula);
  for (let i = 0; i < n; i++) {
    if (!parsed[i]) return { ok: false, error: `Rumus "${species[i]}" tidak dapat dibaca.` };
  }
  const elements = [...new Set(parsed.flatMap((p) => Object.keys(p!)))];
  for (const el of elements) {
    if (!(el in ATOMIC_MASSES)) return { ok: false, error: `Unsur tidak dikenal: ${el}` };
  }

  const A: Frac[][] = elements.map((el) =>
    parsed.map((p, j) => frac((j < left.length ? 1 : -1) * (p![el] ?? 0), 1))
  );

  const x = nullspaceVector(A, elements.length, n);
  if (!x) return { ok: false, error: "Persamaan tidak dapat diseimbangkan — pastikan unsur di kedua sisi sama." };

  const coeffs = scaleToInteger(x);
  if (!coeffs) return { ok: false, error: "Persamaan tidak menghasilkan koefisien valid." };

  // verifikasi
  for (const el of elements) {
    const lhs = coeffs.slice(0, left.length).reduce((acc, c, j) => acc + c * (parsed[j]![el] ?? 0), 0);
    const rhs = coeffs.slice(left.length).reduce((acc, c, j) => acc + c * (parsed[left.length + j]![el] ?? 0), 0);
    if (lhs !== rhs) return { ok: false, error: "Verifikasi internal gagal." };
  }

  return { ok: true, coeffs, species, formatted: formatEquation(species, coeffs, left.length) };
}

function scaleToInteger(x: number[]): number[] {
  let mult = 1;
  for (const v of x) {
    if (Math.abs(v) < 1e-10) continue;
    for (let d = 1; d <= 10000; d++) {
      if (Math.abs(v * d - Math.round(v * d)) < 1e-6) { mult = lcm(mult, d); break; }
    }
  }
  const ints = x.map((v) => Math.round(v * mult));
  const g = ints.reduce((acc, v) => gcd(acc, Math.abs(v)), 0) || 1;
  const scaled = ints.map((v) => v / g);
  return scaled.every((v) => v >= 0) ? scaled : scaled.map((v) => -v);
}

const SUBS = "₀₁₂₃₄₅₆₇₈₉";
export const subDigits = (s: string) => s.replace(/\d/g, (d) => SUBS[+d]);

function formatEquation(species: string[], coeffs: number[], splitAt: number): string {
  const side = (from: number, to: number) =>
    species.slice(from, to)
      .map((s, i) => `${coeffs[from + i] === 1 ? "" : coeffs[from + i]}${subDigits(s)}`)
      .join(" + ");
  return `${side(0, splitAt)} → ${side(splitAt, species.length)}`;
}
