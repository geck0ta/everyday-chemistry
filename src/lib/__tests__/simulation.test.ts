import { describe, it, expect } from "vitest";
import { titrationCurve, equilibriumConcentrations, reactionRate } from "@/lib/simulation";

describe("titrationCurve", () => {
  // 25 mL HCl 0.1 M dititrasi NaOH 0.1 M → titik ekivalen di 25 mL
  const params = { acidConc: 0.1, acidVol: 25, baseConc: 0.1, strong: true };

  it("pH awal larutan HCl 0.1 M ≈ 1", () => {
    const pts = titrationCurve(params);
    expect(pts[0].ph).toBeCloseTo(1, 1);
  });

  it("titik ekivalen terjadi di sekitar 25 mL dengan lomatan pH tajam", () => {
    const pts = titrationCurve(params);
    const eq = pts.find((p) => p.v >= 25);
    // sebelum ekivalen pH asam, sesudahnya basa
    const before = pts.filter((p) => p.v === 24.5)[0];
    const after = pts.filter((p) => p.v === 25.5)[0];
    expect(before.ph).toBeLessThan(4);
    expect(after!.ph).toBeGreaterThan(10);
    void eq;
  });

  it("kelebihan basa banyak → pH mendekati pH NaOH 0.1M ≈ 13", () => {
    const pts = titrationCurve(params);
    expect(pts[pts.length - 1].ph).toBeGreaterThan(12);
  });
});

describe("equilibriumConcentrations", () => {
  // H2 + I2 ⇌ 2HI, Kc = 50; awal [H2]=[I2]=1
  // konvensi: positif = produk, negatif = reaktan → stoich [-1,-1,2]
  it("menghitung konsentrasi setimbang yang memenuhi Kc", () => {
    const r = equilibriumConcentrations({ kc: 50, initial: [1, 1, 0], stoich: [-1, -1, 2] });
    const [h2, i2, hi] = r.final;
    expect((hi * hi) / (h2 * i2)).toBeCloseTo(50, 0);
  });

  it("Kc besar → reaksi hampir sempurna ke produk", () => {
    const r = equilibriumConcentrations({ kc: 1e6, initial: [1, 1, 0], stoich: [-1, -1, 2] });
    expect(r.final[2]).toBeGreaterThan(1.9);
  });
});

describe("reactionRate (Arrhenius sederhana)", () => {
  it("suhu naik 10°C ≈ laju naik ~2x (Q10)", () => {
    const low = reactionRate(20, 50);   // Ea 50 kJ/mol
    const high = reactionRate(30, 50);
    expect(high / low).toBeGreaterThan(1.5);
    expect(high / low).toBeLessThan(3.5);
  });

  it("laju nol saat konsentrasi nol", () => {
    expect(reactionRate(25, 50, 0)).toBe(0);
  });
});
