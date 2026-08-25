import { describe, expect, it } from "vitest";
import { ELEMENTS, CATEGORY_META, elementBySymbol, phaseAtRoom } from "@/lib/elements";
import { SUBSTANCES } from "@/lib/substances";

describe("ELEMENTS", () => {
  it("memuat tepat 118 unsur dengan nomor atom unik 1–118", () => {
    expect(ELEMENTS).toHaveLength(118);
    const nums = new Set(ELEMENTS.map((e) => e.number));
    expect(nums.size).toBe(118);
    for (let n = 1; n <= 118; n++) expect(nums.has(n)).toBe(true);
  });

  it("simbol & nama unik dan tidak kosong", () => {
    const syms = new Set(ELEMENTS.map((e) => e.symbol));
    expect(syms.size).toBe(118);
    for (const e of ELEMENTS) {
      expect(e.symbol.length).toBeGreaterThan(0);
      expect(e.name.length).toBeGreaterThan(0);
      expect(e.mass).toBeGreaterThan(0);
    }
  });

  it("posisi grid valid dan tidak ada dua unsur di sel yang sama", () => {
    const seen = new Set<string>();
    for (const e of ELEMENTS) {
      expect(e.x).toBeGreaterThanOrEqual(1);
      expect(e.x).toBeLessThanOrEqual(18);
      expect(e.y).toBeGreaterThanOrEqual(1);
      expect(e.y).toBeLessThanOrEqual(10);
      const key = `${e.x},${e.y}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  it("unsur kunci berada di posisi standar", () => {
    expect(elementBySymbol("H")?.x).toBe(1);
    expect(elementBySymbol("H")?.y).toBe(1);
    expect(elementBySymbol("He")?.x).toBe(18);
    expect(elementBySymbol("Au")?.x).toBe(11);
    expect(elementBySymbol("Au")?.y).toBe(6);
    expect(elementBySymbol("La")?.y).toBe(9); // baris lantanida
    expect(elementBySymbol("Ac")?.y).toBe(10); // baris aktinida
  });

  it("setiap kategori punya warna & label", () => {
    for (const e of ELEMENTS) {
      expect(CATEGORY_META[e.category]).toBeTruthy();
      expect(CATEGORY_META[e.category].label.length).toBeGreaterThan(0);
      expect(CATEGORY_META[e.category].color).toMatch(/^#/);
    }
  });

  it("fase suhu ruang masuk akal", () => {
    expect(phaseAtRoom(elementBySymbol("H")!)).toBe("gas");
    expect(phaseAtRoom(elementBySymbol("Br")!)).toBe("cair");
    expect(phaseAtRoom(elementBySymbol("Hg")!)).toBe("cair");
    expect(phaseAtRoom(elementBySymbol("Fe")!)).toBe("padat");
    for (const e of ELEMENTS) {
      expect(["padat", "cair", "gas"]).toContain(phaseAtRoom(e));
    }
  });
});
