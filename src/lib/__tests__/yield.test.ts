import { describe, it, expect } from "vitest";
import { reactionYield } from "@/lib/stoichiometry";

describe("reactionYield", () => {
  // konvensi: reactionYield(hasilAktual, hasilTeoretis)
  it("menghitung persen hasil: aktual 8 dari teoretis 10 → 80%", () => {
    const r = reactionYield(8, 10);
    expect(r.ok).toBe(true);
    expect(r.percent).toBeCloseTo(80);
  });

  it("teoretis 0 ditolak", () => {
    expect(reactionYield(5, 0).ok).toBe(false);
  });

  it("aktual > teoretis ditolak (>100%)", () => {
    expect(reactionYield(12, 10).ok).toBe(false);
  });
});
