import { describe, expect, it } from "vitest";
import { ELECTRODES, voltaCell, cellPotential } from "@/lib/volta-sim";

describe("ELECTRODES", () => {
  it("memuat logam umum dengan E° yang benar", () => {
    const zn = ELECTRODES.find((e) => e.symbol === "Zn")!;
    const cu = ELECTRODES.find((e) => e.symbol === "Cu")!;
    expect(zn.e0).toBeCloseTo(-0.76, 2);
    expect(cu.e0).toBeCloseTo(0.34, 2);
    for (const e of ELECTRODES) {
      expect(e.electrons).toBeGreaterThan(0);
      expect(e.halfReaction.length).toBeGreaterThan(0);
      expect(e.ion.length).toBeGreaterThan(0);
    }
  });
});

describe("cellPotential", () => {
  it("sel Daniell standar: Zn|Zn²⁺ ‖ Cu²⁺|Cu → E° = +1,10 V", () => {
    const e = cellPotential({ anode: "Zn", cathode: "Cu" });
    expect(e).toBeCloseTo(1.10, 2);
  });

  it("arah terbalik memberi E negatif", () => {
    const e = cellPotential({ anode: "Cu", cathode: "Zn" });
    expect(e).toBeCloseTo(-1.10, 2);
  });

  it("efek Nernst: [ion] tidak 1 M menggeser potensial", () => {
    const standard = cellPotential({ anode: "Zn", cathode: "Cu" });
    const shifted = cellPotential({ anode: "Zn", cathode: "Cu", concAnode: 0.01, concCathode: 0.01 });
    // Q = [Zn²⁺]/[Cu²⁺] = 1 → E tetap E° saat kedua konsentrasi digeser sama
    expect(shifted).toBeCloseTo(standard, 5);
    // tapi jika hanya katoda diencerkan, E turun
    const diluteCathode = cellPotential({ anode: "Zn", cathode: "Cu", concAnode: 1, concCathode: 0.01 });
    expect(diluteCathode).toBeLessThan(standard);
  });
});

describe("voltaCell", () => {
  it("sel spontan menghasilkan arus elektron dan reaksi setengah sel benar", () => {
    const cell = voltaCell({ anodeId: "Zn", cathodeId: "Cu", concAnode: 1, concCathode: 1 });
    expect(cell.spontan).toBe(true);
    expect(cell.eCell).toBeGreaterThan(0);
    expect(cell.anode.symbol).toBe("Zn");
    expect(cell.cathode.symbol).toBe("Cu");
    expect(cell.electronFlow).toBe(2); // Zn + Cu²⁺ → Zn²⁺ + Cu memakai 2 e⁻
    expect(cell.anode.halfReaction).toContain("→");
  });

  it("elektroda identik tidak menghasilkan tegangan", () => {
    const cell = voltaCell({ anodeId: "Ag", cathodeId: "Ag", concAnode: 1, concCathode: 1 });
    expect(cell.spontan).toBe(false);
    expect(cell.eCell).toBeCloseTo(0, 5);
  });
});
