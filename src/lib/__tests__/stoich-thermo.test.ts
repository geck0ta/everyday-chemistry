import { describe, it, expect } from "vitest";
import {
  limitingReagent, reactionYield, sensibleHeat, heatOfReaction, gasIdeal,
} from "@/lib/stoichiometry";

describe("limitingReagent", () => {
  // 2H2 + O2 -> 2H2O ; 4 mol H2, 3 mol O2 → H2 pembatas (butuh 2 mol O2, ada 3)
  it("menemukan pereaksi pembatas dan mol produk", () => {
    const r = limitingReagent([4, 3], [2, 1], [2], 0); // coeffs produk terpisah, target produk pertama
    expect(r.ok).toBe(true);
    expect(r.limitingIndex).toBe(0);
    expect(r.productMol).toBeCloseTo(4);
    expect(r.leftover).toEqual([{ index: 1, mol: 1 }]);
  });

  it("menolak input negatif", () => {
    expect(limitingReagent([-1, 3], [2, 1], [2], 0).ok).toBe(false);
  });
});

describe("reactionYield", () => {
  it("menghitung persen hasil: aktual 8 dari teoretis 10 → 80%", () => {
    const r = reactionYield(8, 10);
    expect(r.ok).toBe(true);
    expect(r.percent).toBeCloseTo(80);
  });

  it("teoretis 0 ditolak", () => {
    expect(reactionYield(5, 0).ok).toBe(false);
  });
});

describe("sensibleHeat Q = m·c·ΔT", () => {
  it("memanaskan air 2 kg dari 25 ke 100 °C (c=4.18)", () => {
    const r = sensibleHeat(2000, 4.18, 75);
    expect(r.ok).toBe(true);
    expect(r.qJoule).toBeCloseTo(2000 * 4.18 * 75, 0);
    expect(r.qKj).toBeCloseTo(627, 1);
  });
});

describe("heatOfReaction", () => {
  it("eksotermik: ΔH negatif per mol", () => {
    const r = heatOfReaction(627_000, 10, true);
    expect(r.ok).toBe(true);
    expect(r.deltaH).toBeCloseTo(-62_700);
    expect(r.deltaHKjPerMol).toBeCloseTo(-62.7);
  });
});

describe("gasIdeal PV=nRT", () => {
  it("hitung V dari P,n,T", () => {
    const r = gasIdeal({ P: 101_325, n: 1, T: 273.15 });
    expect(r.ok).toBe(true);
    expect(r.solvedFor).toBe("V");
    expect(r.value).toBeGreaterThan(0.02);
    expect(r.value).toBeLessThan(0.03); // ≈ 0.0224 m³
  });

  it("menolak jika yang diberikan bukan tepat tiga", () => {
    expect(gasIdeal({ n: 1 }).ok).toBe(false);
    expect(gasIdeal({ P: 1, V: 2, n: 3, T: 4 }).ok).toBe(false);
  });
});
