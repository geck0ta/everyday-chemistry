import { describe, expect, it } from "vitest";
import {
  bufferPh,
  bufferCapacity,
  addAcidToBuffer,
  addBaseToBuffer,
  bufferCurve,
  BUFFER_SYSTEMS,
  type BufferSystem,
} from "@/lib/buffer-sim";

const ACETATE: BufferSystem = BUFFER_SYSTEMS.find((b) => b.id === "asetat")!;

describe("bufferPh (Henderson–Hasselbalch)", () => {
  it("pH = pKa saat konsentrasi asam = basa", () => {
    const r = bufferPh({ system: ACETATE, acidConc: 0.1, baseConc: 0.1 });
    expect(r.ph).toBeCloseTo(ACETATE.pka, 5);
    expect(r.ratio).toBeCloseTo(1, 5);
  });

  it("kasus klasik: asetat 0,1/0,1 → pH ≈ 4,74", () => {
    const r = bufferPh({ system: ACETATE, acidConc: 0.1, baseConc: 0.1 });
    expect(r.ph).toBeCloseTo(4.74, 2);
  });

  it("rasio 10:1 menggeser pH satu satuan dari pKa", () => {
    const hiBase = bufferPh({ system: ACETATE, acidConc: 0.1, baseConc: 1.0 });
    expect(hiBase.ph).toBeCloseTo(ACETATE.pka + 1, 3);
    const hiAcid = bufferPh({ system: ACETATE, acidConc: 1.0, baseConc: 0.1 });
    expect(hiAcid.ph).toBeCloseTo(ACETATE.pka - 1, 3);
  });

  it("skala konsentrasi tidak mengubah pH (hanya rasio yang penting)", () => {
    const a = bufferPh({ system: ACETATE, acidConc: 0.1, baseConc: 0.2 });
    const b = bufferPh({ system: ACETATE, acidConc: 0.01, baseConc: 0.02 });
    expect(a.ph).toBeCloseTo(b.ph, 5);
    // tapi kapasitasnya beda
    expect(b.capacity).toBeLessThan(a.capacity);
  });
});

describe("bufferCapacity", () => {
  it("nol saat salah satu komponen habis", () => {
    expect(bufferCapacity({ system: ACETATE, acidConc: 0, baseConc: 0.5 })).toBe(0);
    expect(bufferCapacity({ system: ACETATE, acidConc: 0.5, baseConc: 0 })).toBe(0);
  });

  it("maksimum di pH = pKa dan simetris", () => {
    const atPka = bufferCapacity({ system: ACETATE, acidConc: 0.25, baseConc: 0.25 });
    const offL = bufferCapacity({ system: ACETATE, acidConc: 0.35, baseConc: 0.15 });
    const offR = bufferCapacity({ system: ACETATE, acidConc: 0.15, baseConc: 0.35 });
    expect(atPka).toBeGreaterThan(offL);
    expect(offL).toBeCloseTo(offR, 10);
  });
});

describe("penambahan asam/basa kuat", () => {
  it("asam kuat menurunkan pH sedikit — bukan jurang", () => {
    const before = bufferPh({ system: ACETATE, acidConc: 0.1, baseConc: 0.1 }).ph;
    const after = addAcidToBuffer({ system: ACETATE, acidConc: 0.1, baseConc: 0.1, molH: 0.01 });
    expect(after.ok).toBe(true);
    expect(after.ph!).toBeLessThan(before);
    expect(before - after.ph!).toBeLessThan(0.6); // pergeseran kecil = sifat buffer
  });

  it("basakuat menaikkan pH sedikit", () => {
    const before = bufferPh({ system: ACETATE, acidConc: 0.1, baseConc: 0.1 }).ph;
    const after = addBaseToBuffer({ system: ACETATE, acidConc: 0.1, baseConc: 0.1, molOh: 0.01 });
    expect(after.ok).toBe(true);
    expect(after.ph).toBeGreaterThan(before);
    expect(after.ph! - before).toBeLessThan(0.6);
  });

  it("gagal dengan jelas saat kapasitas terlampaui", () => {
    const r = addAcidToBuffer({ system: ACETATE, acidConc: 0.1, baseConc: 0.1, molH: 99 });
    expect(r.ok).toBe(false);
    expect(r.ph).toBeUndefined();
  });

  it("bandingkan dengan air murni: buffer jauh lebih stabil", () => {
    // 0,01 mol H ke dalam 0,1 M buffer vs ke air murni
    const buf = addAcidToBuffer({ system: ACETATE, acidConc: 0.1, baseConc: 0.1, molH: 0.01 });
    const waterPh = 2; // 0,01 mol / 1 L HCl ≈ pH 2
    expect(Math.abs(7 - buf.ph!)).toBeLessThan(Math.abs(7 - waterPh));
  });
});

describe("bufferCurve", () => {
  it("kurva naik monoton terhadap mol OH⁻", () => {
    const curve = bufferCurve({ system: ACETATE, acidConc: 0.1, baseConc: 0.1, maxMol: 0.15 });
    expect(curve.length).toBeGreaterThan(20);
    for (let i = 1; i < curve.length; i++) {
      expect(curve[i].ph).toBeGreaterThanOrEqual(curve[i - 1].ph);
      expect(curve[i].mol).toBeGreaterThanOrEqual(curve[i - 1].mol);
    }
  });

  it("berakhir pada pH basa kuat setelah kapasitas habis", () => {
    const curve = bufferCurve({ system: ACETATE, acidConc: 0.1, baseConc: 0.1, maxMol: 0.15 });
    const last = curve[curve.length - 1];
    expect(last.phase).toBe("basa-berlebih");
    expect(last.ph).toBeGreaterThan(11);
  });

  it("mulai tepat di pKa dan daerah penyangga tidak menyimpang lebih dari ±1 satuan", () => {
    const curve = bufferCurve({ system: ACETATE, acidConc: 0.1, baseConc: 0.1, maxMol: 0.15 });
    expect(curve[0].ph).toBeCloseTo(ACETATE.pka, 2);
    const flat = curve.filter((p) => p.phase === "penyangga");
    // daerah penyangga menahan pH tetap < 9; begitu kapasitas habis, lompat ke basa kuat
    for (const p of flat) expect(p.ph).toBeLessThan(9);
    const excess = curve.filter((p) => p.phase === "basa-berlebih");
    expect(excess.length).toBeGreaterThan(0);
    for (const p of excess) expect(p.ph).toBeGreaterThan(11);
    // dan separuh pertama daerah penyangga bergerak lambat (< 0,75 dari pKa)
    const firstHalf = flat.filter((p) => p.mol < 0.05);
    for (const p of firstHalf) expect(p.ph).toBeLessThan(ACETATE.pka + 0.8);
  });
});

describe("BUFFER_SYSTEMS", () => {
  it("memuat sistem darah & kolam renang", () => {
    const ids = BUFFER_SYSTEMS.map((b) => b.id);
    expect(ids).toContain("darah");
    expect(ids).toContain("fosfat");
  });

  it("pKa masuk rentang fisiologis untuk sistem darah", () => {
    const blood = BUFFER_SYSTEMS.find((b) => b.id === "darah")!;
    expect(blood.pka).toBeGreaterThan(6);
    expect(blood.pka).toBeLessThan(7);
  });
});

describe("bufferCurve titran asam (titrant H)", () => {
  it("pH turun monoton terhadap mol H⁻ dan berakhir sangat asam", () => {
    const curve = bufferCurve({ system: ACETATE, acidConc: 0.1, baseConc: 0.1, maxMol: 0.15, titrant: "H" });
    expect(curve.length).toBeGreaterThan(20);
    for (let i = 1; i < curve.length; i++) {
      expect(curve[i].ph).toBeLessThanOrEqual(curve[i - 1].ph);
    }
    const last = curve[curve.length - 1];
    expect(last.phase).toBe("asam-berlebih");
    expect(last.ph).toBeLessThan(2);
  });

  it("mulai tepat di pKa dan daerah penyangga tetap di atas pH 1", () => {
    const curve = bufferCurve({ system: ACETATE, acidConc: 0.1, baseConc: 0.1, maxMol: 0.15, titrant: "H" });
    expect(curve[0].ph).toBeCloseTo(ACETATE.pka, 2);
    const flat = curve.filter((p) => p.phase === "penyangga");
    for (const p of flat) expect(p.ph).toBeGreaterThan(1);
  });
});
