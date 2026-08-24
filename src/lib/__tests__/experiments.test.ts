import { describe, it, expect } from "vitest";
import {
  mixPh, electrolysisGas, metalAcidReaction,
} from "@/lib/experiments";

describe("mixPh — mencampur larutan asam/basa", () => {
  it("asam kuat + basa kuat seimbang → netral pH 7", () => {
    // 10 mL HCl 0.1 (1 mmol) + 10 mL NaOH 0.1 (1 mmol) → netral
    const r = mixPh({ hMol: 0.001, ohMol: 0.001, totalVol: 0.02 });
    expect(r.ph).toBeCloseTo(7, 0);
  });

  it("asam berlebih → pH < 7", () => {
    const r = mixPh({ hMol: 0.002, ohMol: 0.001, totalVol: 0.03 });
    expect(r.ph).toBeLessThan(7);
  });

  it("basaberlebih → pH > 7", () => {
    const r = mixPh({ hMol: 0.001, ohMol: 0.003, totalVol: 0.04 });
    expect(r.ph).toBeGreaterThan(7);
  });
});

describe("electrolysisGas — elektrolisis air", () => {
  it("rasio gas H2 : O2 = 2 : 1 (hukum faraday)", () => {
    const r = electrolysisGas({ minutes: 5, currentAmpere: 2 });
    expect(r.h2Mol / r.o2Mol).toBeCloseTo(2, 1);
  });

  it("waktu & arus lebih besar → gas lebih banyak", () => {
    const a = electrolysisGas({ minutes: 5, currentAmpere: 2 });
    const b = electrolysisGas({ minutes: 10, currentAmpere: 4 });
    expect(b.h2Mol).toBeGreaterThan(a.h2Mol);
  });
});

describe("metalAcidReaction — logam + asam", () => {
  // Mg + 2HCl → MgCl2 + H2 ; Mg paling reaktif
  it("magnesium menghasilkan H2 lebih cepat dari besi", () => {
    const mg = metalAcidReaction("Mg", 0.01, 25);
    const fe = metalAcidReaction("Fe", 0.01, 25);
    expect(mg.ratePerSec).toBeGreaterThan(fe.ratePerSec);
  });

  it("tembaga tidak bereaksi dengan HCl encer", () => {
    const cu = metalAcidReaction("Cu", 0.01, 25);
    expect(cu.reacts).toBe(false);
    expect(cu.ratePerSec).toBe(0);
  });

  it("suhu naik → laju naik", () => {
    const cold = metalAcidReaction("Zn", 0.01, 20);
    const hot = metalAcidReaction("Zn", 0.01, 60);
    expect(hot.ratePerSec).toBeGreaterThan(cold.ratePerSec);
  });

  it("mol H2 maksimal dibatasi pereaksi pembatas", () => {
    // 0.01 mol Zn butuh 0.02 mol HCl; kalau HCl cuma 0.005 mol → terbatas HCl
    const r = metalAcidReaction("Zn", 0.01, 25, 0.005);
    expect(r.limitingFactor).toBe("acid");
    expect(r.maxH2Mol).toBeCloseTo(0.0025); // setengah dari mol asam
  });
});
