import { describe, expect, it } from "vitest";
import { splitIngredients, identifyIngredients } from "@/lib/identify";
import { INGREDIENTS } from "@/lib/ingredients";

describe("splitIngredients", () => {
  it("memecah berdasarkan koma, titik koma, baris baru, dan bullet", () => {
    const out = splitIngredients("Aqua, Glycerin; Sodium Chloride\nNipagin • Parfum");
    expect(out).toEqual(["Aqua", "Glycerin", "Sodium Chloride", "Nipagin", "Parfum"]);
  });

  it("membersihkan noise OCR: bullet unicode, penomoran, spasi ganda, tanda kurung kosong", () => {
    const out = splitIngredients("• Aqua\n1. Natrium Benzoat\n–   Asam Sitrat (E330)");
    // tanda kurung berisi kode E ikut dibuang bersama isinya? tidak — kode E adalah info,
    // tapi untuk pencocokan kita buang saja di sini agar nama bersih
    expect(out).toContain("Aqua");
    expect(out).toContain("Natrium Benzoat");
    expect(out.every((s) => s.length > 0)).toBe(true);
    expect(out.join("|")).not.toMatch(/[•\u2022]/);
  });

  it("mengabaikan kata penghubung label seperti 'komposisi', 'bahan', 'ingredients'", () => {
    const out = splitIngredients("Komposisi: Aqua, Glycerin");
    expect(out).toEqual(["Aqua", "Glycerin"]);
  });

  it("tidak menghasilkan entri kosong untuk teks kosong", () => {
    expect(splitIngredients("")).toEqual([]);
    expect(splitIngredients("   ,,, ;;; \n\n ")).toEqual([]);
  });
});

describe("identifyIngredients", () => {
  it("mengenali nama persis (case-insensitive)", () => {
    const out = identifyIngredients("aqua, glycerin");
    expect(out[0].match?.id).toBe("aqua");
    expect(out[1].match?.id).toBe("gliserin");
    expect(out[0].confidence).toBe("yakin");
  });

  it("mengenali alias lokal: nipagin = methylparaben, baking soda = natrium bikarbonat", () => {
    const out = identifyIngredients("Nipagin, Baking Soda");
    const ids = out.map((r) => r.match?.id);
    expect(ids).toContain("methylparaben");
    expect(ids).toContain("natrium-bikarbonat");
  });

  it("tahan typo ringan lewat fuzzy match", () => {
    const out = identifyIngredients("Gliserine");
    expect(out[0].match?.id).toBe("gliserin");
    expect(out[0].confidence).toBe("kemungkinan");
  });

  it("menandai bahan tak dikenal sebagai tidak-dikenal tanpa melempar error", () => {
    const out = identifyIngredients("Aqua, Xyzabcqwerty");
    expect(out).toHaveLength(2);
    expect(out[0].match).toBeTruthy();
    expect(out[1].match).toBeUndefined();
    expect(out[1].confidence).toBe("tidak-dikenal");
  });

  it("menghasilkan raw text asli tiap entri", () => {
    const out = identifyIngredients("Asam Sitrat");
    expect(out[0].raw).toBe("Asam Sitrat");
  });

  it("database punya minimal 50 bahan dan semua id unik", () => {
    expect(INGREDIENTS.length).toBeGreaterThanOrEqual(50);
    const ids = new Set(INGREDIENTS.map((i) => i.id));
    expect(ids.size).toBe(INGREDIENTS.length);
  });

  it("setiap bahan punya nama utama, grup, peran, dan konteks produk", () => {
    for (const ing of INGREDIENTS) {
      expect(ing.names.length).toBeGreaterThan(0);
      expect(ing.group.length).toBeGreaterThan(0);
      expect(ing.role.length).toBeGreaterThan(0);
      expect(ing.foundIn.length).toBeGreaterThan(0);
    }
  });

  it("bahan dengan formula terhubung ke zat yang ada di database zat", async () => {
    const { SUBSTANCES } = await import("@/lib/substances");
    const formulas = new Set(SUBSTANCES.map((s) => s.formula));
    for (const ing of INGREDIENTS) {
      if (ing.formula) expect(formulas.has(ing.formula)).toBe(true);
    }
  });

  it("kombinasi label nyata: komposisi sampo", () => {
    const out = identifyIngredients(
      "Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Sodium Chloride, Citric Acid, Sodium Benzoate"
    );
    const known = out.filter((r) => r.match).map((r) => r.match!.id);
    expect(known).toEqual(
      expect.arrayContaining([
        "aqua",
        "sodium-laureth-sulfate",
        "cocamidopropyl-betaine",
        "natrium-klorida",
        "asam-sitrat",
        "natrium-benzoat",
      ])
    );
    expect(out.every((r) => r.match)).toBe(true);
  });
});
