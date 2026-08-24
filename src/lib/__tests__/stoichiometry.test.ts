import { describe, it, expect } from "vitest";
import { balanceEquation } from "@/lib/stoichiometry";

describe("balanceEquation", () => {
  it("menyeimbangkan pembakaran metana", () => {
    const r = balanceEquation("CH4 + O2 -> CO2 + H2O");
    expect(r.ok).toBe(true);
    expect(r.coeffs).toEqual([1, 2, 1, 2]);
    expect(r.formatted).toBe("CH₄ + 2O₂ → CO₂ + 2H₂O");
  });

  it("menyeimbangkan reaksi yang sudah seimbang tanpa mengubahnya", () => {
    const r = balanceEquation("H2 + Cl2 -> HCl");
    expect(r.ok).toBe(true);
    expect(r.coeffs).toEqual([1, 1, 2]);
  });

  it("menangani koefisien besar: pembakaran oktana", () => {
    const r = balanceEquation("C8H18 + O2 -> CO2 + H2O");
    expect(r.ok).toBe(true);
    expect(r.coeffs).toEqual([2, 25, 16, 18]);
  });

  it("menolak persamaan tak seimbang secara unsur", () => {
    const r = balanceEquation("Fe + O2 -> Au");
    expect(r.ok).toBe(false);
  });

  it("menolak format rusak", () => {
    expect(balanceEquation("tanpa panah").ok).toBe(false);
    expect(balanceEquation("").ok).toBe(false);
  });
});
