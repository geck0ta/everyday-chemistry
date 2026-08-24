// Data referensi cepat untuk pengerjaan soal kimia.

export interface Constant {
  symbol: string;
  name: string;
  value: string;
  note?: string;
}

export const CONSTANTS: Constant[] = [
  { symbol: "Nᴀ", name: "Bilangan Avogadro", value: "6,022 × 10²³ /mol", note: "partikel per mol" },
  { symbol: "R", name: "Konstanta gas universal", value: "8,314 J/(mol·K)", note: "= 0,082 L·atm/(mol·K)" },
  { symbol: "F", name: "Konstanta Faraday", value: "96.485 C/mol", note: "muatan per mol elektron" },
  { symbol: "Kw", name: "Ionisasi air (25°C)", value: "1,0 × 10⁻¹⁴", note: "[H⁺][OH⁻] → pH+pOH = 14" },
  { symbol: "Vm", name: "Volume molar gas STP", value: "22,4 L/mol", note: "0°C, 1 atm" },
  { symbol: "c", name: "Kalor jenis air", value: "4,18 J/(g·°C)", note: "atau 1 kal/(g·°C)" },
  { symbol: "g", name: "Percepatan gravitasi", value: "9,8 m/s²", note: "≈ 10 m/s² untuk soal" },
];

export const REACTIVITY_SERIES = [
  { sym: "K", name: "Kalium", note: "paling reaktif" },
  { sym: "Na", name: "Natrium", note: "" },
  { sym: "Ca", name: "Kalsium", note: "" },
  { sym: "Mg", name: "Magnesium", note: "" },
  { sym: "Al", name: "Aluminium", note: "" },
  { sym: "Zn", name: "Seng", note: "" },
  { sym: "Fe", name: "Besi", note: "" },
  { sym: "Sn", name: "Timah", note: "" },
  { sym: "Pb", name: "Timbal", note: "" },
  { sym: "H", name: "Hidrogen", note: "batas reaksi dgn asam" },
  { sym: "Cu", name: "Tembaga", note: "tak bereaksi dgn HCl" },
  { sym: "Ag", name: "Perak", note: "" },
  { sym: "Au", name: "Emas", note: "paling inert" },
];

export const PH_SCALE = [
  { range: "0–2", label: "Asam kuat", example: "HCl, H₂SO₄" },
  { range: "3–6", label: "Asam lemah", example: "cuka, jeruk" },
  { range: "7", label: "Netral", example: "air murni" },
  { range: "8–10", label: "Basa lemah", example: "baking soda" },
  { range: "11–14", label: "Basa kuat", example: "NaOH, KOH" },
];

export const SOLUBILITY_RULES = [
  "Semua garam NO₃⁻ (nitrat) larut",
  "Semua garam Na⁺, K⁺, NH₄⁺ larut",
  "Sebagian besar Cl⁻ larut (kecuali Ag⁺, Pb²⁺)",
  "Sebagian besar SO₄²⁻ larut (kecuali Ba²⁺, Pb²⁺)",
  "CO₃²⁻ dan PO₄³⁻ umumnya TIDAK larut (kecuali grup 1, NH₄⁺)",
  "OH⁻ TIDAK larut (kecuali grup 1, Ba²⁺)",
];
