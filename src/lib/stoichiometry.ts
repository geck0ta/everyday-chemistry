// Everyday Chemistry — termokimia & gas ideal
// (balancing ada di balancer.ts; pereaksi pembatas di limiting.ts)
import type { Step } from "@/lib/chemistry";

export { balanceEquation } from "./balancer";
export { limitingReagent, reactionYield } from "./limiting";
export type { LimitingResult } from "./limiting";

const fmt = (n: number) => parseFloat(n.toPrecision(6)).toString();

// ---------- Termokimia ----------

export function sensibleHeat(
  massG: number, cJPerGK: number, deltaT: number
): { ok: boolean; qJoule?: number; qKj?: number; steps?: Step[]; error?: string } {
  if (!(massG > 0) || deltaT === 0 || isNaN(massG) || isNaN(deltaT)) {
    return { ok: false, error: "Massa harus > 0 dan ΔT ≠ 0." };
  }
  const q = massG * cJPerGK * deltaT;
  return {
    ok: true, qJoule: q, qKj: q / 1000,
    steps: [
      { title: "Rumus kalor", formula: "Q = m × c × ΔT" },
      { title: "Substitusi", substitution: `Q = ${fmt(massG)} g × ${cJPerGK} J/(g·°C) × ${fmt(deltaT)} °C` },
      { title: "Hasil", result: `${deltaT > 0 ? "Kalor diserap" : "Kalor dilepas"} = ${fmt(Math.abs(q))} J = ${fmt(q / 1000)} kJ` },
    ],
  };
}

export function heatOfReaction(
  qJoule: number, nMol: number, exothermicDirection: boolean
): { ok: boolean; deltaH?: number; deltaHKjPerMol?: number; steps?: Step[]; error?: string } {
  if (!(nMol > 0) || isNaN(qJoule)) return { ok: false, error: "mol reaksi harus > 0." };
  const sign = exothermicDirection ? -1 : 1;
  const deltaH = (sign * qJoule) / nMol;
  return {
    ok: true, deltaH, deltaHKjPerMol: deltaH / 1000,
    steps: [
      { title: "Rumus ΔH reaksi per mol", formula: exothermicDirection ? "ΔH = −Q / n" : "ΔH = +Q / n" },
      { title: "Substitusi", substitution: `ΔH = ${exothermicDirection ? "−" : ""}${fmt(qJoule)} J / ${fmt(nMol)} mol` },
      { title: "Hasil", result: `${fmt(deltaH)} J/mol = ${fmt(deltaH / 1000)} kJ/mol (${exothermicDirection ? "eksotermik" : "endotermik"})` },
    ],
  };
}

// ---------- Gas ideal ----------

const R = 8.314; // J/(mol·K)

export function gasIdeal(input: {
  P?: number; V?: number; n?: number; T?: number;
}): { ok: boolean; value?: number; solvedFor?: string; steps?: Step[]; error?: string } {
  const { P, V, n, T } = input;
  const defined = [P, V, n, T].filter((v) => v !== undefined).length;
  if (defined !== 3) return { ok: false, error: "Isi tepat tiga nilai (P, V, n, T) — satu akan dihitung. P dalam Pa, V dalam m³." };

  let solvedFor: string, value: number, formula: string, subst: string, unit: string;

  if (P === undefined) {
    solvedFor = "P"; value = (n! * R * T!) / V!;
    formula = "P = nRT / V"; unit = " Pa";
    subst = `P = (${n} × 8,314 × ${T}) / ${V}`;
  } else if (V === undefined) {
    solvedFor = "V"; value = (n! * R * T!) / P!;
    formula = "V = nRT / P"; unit = " m³";
    subst = `V = (${n} × 8,314 × ${T}) / ${P}`;
  } else if (n === undefined) {
    solvedFor = "n"; value = (P * V) / (R * T!);
    formula = "n = PV / RT"; unit = " mol";
    subst = `n = (${P} × ${V}) / (8,314 × ${T})`;
  } else {
    solvedFor = "T"; value = (P * V) / (n * R);
    formula = "T = PV / nR"; unit = " K";
    subst = `T = (${P} × ${V}) / (${n} × 8,314)`;
  }

  if (!isFinite(value)) return { ok: false, error: "Hasil tidak terhingga — periksa nilai input." };

  return {
    ok: true, value, solvedFor,
    steps: [
      { title: "Persamaan gas ideal", formula: "PV = nRT   (R = 8,314 J/(mol·K))" },
      { title: `Selesaikan untuk ${solvedFor}`, formula },
      { title: "Substitusi", substitution: subst },
      { title: "Hasil", result: `${solvedFor} = ${fmt(value)}${unit}` },
    ],
  };
}
