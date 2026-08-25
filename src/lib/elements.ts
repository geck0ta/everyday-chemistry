// Everyday Chemistry — data tabel periodik lengkap 118 unsur.
// Posisi grid: x = golongan (1–18), y = periode (1–7);
// lantanida/aktinida dipindah ke baris 9 & 10 (konvensi tampilan umum).

export type ElementCategory =
  | "nonmetal" | "gas mulia" | "alkali" | "alkali tanah"
  | "metaloid" | "halogen" | "logam transisi" | "logam pasca-transisi"
  | "lantanida" | "aktinida";

export const CATEGORY_META: Record<ElementCategory, { label: string; color: string }> = {
  // warna dipilih agar lolos WCAG AA di light & dark (selaras CAT_META substances.ts)
  nonmetal: { label: "Nonmetal", color: "#0c7a58" },
  "gas mulia": { label: "Gas Mulia", color: "#2a7f95" },
  alkali: { label: "Logam Alkali", color: "#d14d6b" },
  "alkali tanah": { label: "Alkali Tanah", color: "#a07d1f" },
  metaloid: { label: "Metaloid", color: "#7d4fc0" },
  halogen: { label: "Halogen", color: "#3d76d9" },
  "logam transisi": { label: "Logam Transisi", color: "#5b6b80" },
  "logam pasca-transisi": { label: "Logam Pasca-Transisi", color: "#b05f2e" },
  lantanida: { label: "Lantanida", color: "#8a6d3b" },
  aktinida: { label: "Aktinida", color: "#c2554f" },
};

export interface ChemicalElement {
  number: number;
  symbol: string;
  name: string;      // nama Indonesia
  mass: number;      // massa atom relatif
  category: ElementCategory;
  x: number;         // kolom 1–18
  y: number;         // baris 1–10 (9=lantanida, 10=aktinida)
  meltK?: number;    // titik leleh (K)
  boilK?: number;    // titik didih (K)
  fact?: string;     // fakta sehari-hari untuk unsur penting
}

const E = (
  number: number, symbol: string, name: string, mass: number,
  category: ElementCategory, x: number, y: number,
  extra: Partial<ChemicalElement> = {}
): ChemicalElement => ({ number, symbol, name, mass, category, x, y, ...extra });

export const ELEMENTS: ChemicalElement[] = [
  // ===== Periode 1 =====
  E(1, "H", "Hidrogen", 1.008, "nonmetal", 1, 1, {
    boilK: 20.3,
    fact: "90% dari semua atom di alam semesta. Matahari 'terbakar' dengan meleburkan hidrogen.",
  }),
  E(2, "He", "Helium", 4.0026, "gas mulia", 18, 1, {
    boilK: 4.2,
    fact: "Satu-satunya unsur yang ditemukan lebih dulu di Matahari daripada di Bumi (1868). Balon & suara lucu.",
  }),
  // ===== Periode 2 =====
  E(3, "Li", "Litium", 6.94, "alkali", 1, 2, {
    meltK: 453.7, boilK: 1603,
    fact: "Jantung dari baterai HP dan mobil listrikmu.",
  }),
  E(4, "Be", "Berilium", 9.0122, "alkali tanah", 2, 2, { meltK: 1560, boilK: 2742 }),
  E(5, "B", "Boron", 10.81, "metaloid", 13, 2, {
    meltK: 2349, boilK: 4200,
    fact: "Boraks (pengawet yang dilarang di makanan) adalah senyawanya.",
  }),
  E(6, "C", "Karbon", 12.011, "nonmetal", 14, 2, {
    meltK: 3823,
    fact: "Tulang punggung kehidupan. Grafit pensil, intan, dan seluruh tubuhmu — semuanya karbon.",
  }),
  E(7, "N", "Nitrogen", 14.007, "nonmetal", 15, 2, {
    meltK: 63.2, boilK: 77.4,
    fact: "78% udara yang kamu hirup. Nitrogen cair bikin es krim instan.",
  }),
  E(8, "O", "Oksigen", 15.999, "nonmetal", 16, 2, {
    meltK: 54.4, boilK: 90.2,
    fact: "Penyebab utama besi berkarat — dan penyelamat nyawa di tiap tarikan napas.",
  }),
  E(9, "F", "Fluor", 18.998, "halogen", 17, 2, {
    meltK: 53.5, boilK: 85,
    fact: "Unsur paling reaktif. Dalam pasta gigi sebagai natrium fluorida pencegah lubang gigi.",
  }),
  E(10, "Ne", "Neon", 20.180, "gas mulia", 18, 2, {
    meltK: 24.6, boilK: 27.1,
    fact: "Menyala merah-oranye di tabung lampu neon.",
  }),
  // ===== Periode 3 =====
  E(11, "Na", "Natrium", 22.990, "alkali", 1, 3, {
    meltK: 370.9, boilK: 1156,
    fact: "Meledak kena air, tapi bersama klorin jadi garam dapur yang menenangkan.",
  }),
  E(12, "Mg", "Magnesium", 24.305, "alkali tanah", 2, 3, {
    meltK: 923, boilK: 1363,
    fact: "Inti molekul klorofil — semua tanaman hijau hidup berkat magnesium.",
  }),
  E(13, "Al", "Aluminium", 26.982, "logam pasca-transisi", 13, 3, {
    meltK: 933.5, boilK: 2792,
    fact: "Logam paling melimpah di kerak Bumi. Kaleng minuman & bungkus makananmu.",
  }),
  E(14, "Si", "Silikon", 28.085, "metaloid", 14, 3, {
    meltK: 1687, boilK: 3538,
    fact: "Otak dari setiap chip komputer. Pasir pantai = silikon dioksida.",
  }),
  E(15, "P", "Fosforus", 30.974, "nonmetal", 15, 3, {
    meltK: 317.3, boilK: 553.7,
    fact: "Nyala api korek berasal dari fosforus; juga penting untuk tulang & DNA.",
  }),
  E(16, "S", "Sulfur", 32.06, "nonmetal", 16, 3, {
    meltK: 388.4, boilK: 717.8,
    fact: "Pencipta bau telur busuk dan gunung berapi. Bahan utama asam sulfat aki.",
  }),
  E(17, "Cl", "Klorin", 35.45, "halogen", 17, 3, {
    meltK: 171.6, boilK: 239.1,
    fact: "Pemutih & penghuni kolam renang. Gasnya beracun, garamnya wajib di meja makan.",
  }),
  E(18, "Ar", "Argon", 39.948, "gas mulia", 18, 3, {
    meltK: 83.8, boilK: 87.3,
    fact: "1% udara. Mengisi bohlam agar filamen tidak terbakar.",
  }),
  // ===== Periode 4 =====
  E(19, "K", "Kalium", 39.098, "alkali", 1, 4, {
    meltK: 336.7, boilK: 1032,
    fact: "Pisang mengandung kalium — mineral penting untuk denyut jantung.",
  }),
  E(20, "Ca", "Kalsium", 40.078, "alkali tanah", 2, 4, {
    meltK: 1115, boilK: 1757,
    fact: "Pembangun tulang dan gigimu; kapur tulis adalah karbonatnya.",
  }),
  E(21, "Sc", "Skandium", 44.956, "logam transisi", 3, 4, { meltK: 1814, boilK: 3109 }),
  E(22, "Ti", "Titanium", 47.867, "logam transisi", 4, 4, {
    meltK: 1941, boilK: 3560,
    fact: "Sekecil dan sekokoh baja, tapi tak berkarat — dipakai implan tulang & rangka pesawat.",
  }),
  E(23, "V", "Vanadium", 50.942, "logam transisi", 5, 4, { meltK: 2183, boilK: 3680 }),
  E(24, "Cr", "Kromium", 51.996, "logam transisi", 6, 4, {
    meltK: 2180, boilK: 2944,
    fact: "Kilau pada bumper motor & gagang pintu 'chrome' adalah lapisan kromium.",
  }),
  E(25, "Mn", "Mangan", 54.938, "logam transisi", 7, 4, { meltK: 1519, boilK: 2334 }),
  E(26, "Fe", "Besi", 55.845, "logam transisi", 8, 4, {
    meltK: 1811, boilK: 3134,
    fact: "Logam paling banyak dipakai manusia. Darahmu merah karena zat besinya.",
  }),
  E(27, "Co", "Kobalt", 58.933, "logam transisi", 9, 4, {
    meltK: 1768, boilK: 3200,
    fact: "Katoda baterai HP dan bir klasik pada keramik.",
  }),
  E(28, "Ni", "Nikel", 58.693, "logam transisi", 10, 4, {
    meltK: 1728, boilK: 3186,
    fact: "Uang logam & anti-karat pada sendok stainless steel.",
  }),
  E(29, "Cu", "Tembaga", 63.546, "logam transisi", 11, 4, {
    meltK: 1357.8, boilK: 2835,
    fact: "Pembawa listrik di seluruh kabel rumahmu. Kabel tembaga dicuri mahal harganya!",
  }),
  E(30, "Zn", "Seng", 65.38, "logam transisi", 12, 4, {
    meltK: 692.7, boilK: 1180,
    fact: "Pelapis galvanis anti-karat + nutrisi untuk luka cepat sembuh.",
  }),
  E(31, "Ga", "Galium", 69.723, "logam pasca-transisi", 13, 4, {
    meltK: 302.9, boilK: 2673,
    fact: "Mencair di tangan — titik lelehnya cuma 30°C.",
  }),
  E(32, "Ge", "Germanium", 72.630, "metaloid", 14, 4, { meltK: 1211.4, boilK: 3106 }),
  E(33, "As", "Arsenik", 74.922, "metaloid", 15, 4, {
    meltK: 1090,
    fact: "Racun favorit cerita detektif lama.",
  }),
  E(34, "Se", "Selenium", 78.971, "nonmetal", 16, 4, { meltK: 494, boilK: 958 }),
  E(35, "Br", "Bromin", 79.904, "halogen", 17, 4, {
    meltK: 265.8, boilK: 332,
    fact: "Salah satu dari hanya dua unsur cair pada suhu ruang (satu lagi raksa).",
  }),
  E(36, "Kr", "Kripton", 83.798, "gas mulia", 18, 4, { meltK: 115.8, boilK: 119.9 }),
  // ===== Periode 5 =====
  E(37, "Rb", "Rubidium", 85.468, "alkali", 1, 5, { meltK: 312.5, boilK: 961 }),
  E(38, "Sr", "Strontium", 87.62, "alkali tanah", 2, 5, { meltK: 1050, boilK: 1655 }),
  E(39, "Y", "Itrium", 88.906, "logam transisi", 3, 5, { meltK: 1799, boilK: 3609 }),
  E(40, "Zr", "Zirkonium", 91.224, "logam transisi", 4, 5, { meltK: 2128, boilK: 4682 }),
  E(41, "Nb", "Niobium", 92.906, "logam transisi", 5, 5, { meltK: 2750, boilK: 5017 }),
  E(42, "Mo", "Molibdenum", 95.95, "logam transisi", 6, 5, { meltK: 2896, boilK: 4912 }),
  E(43, "Tc", "Teknetium", 98, "logam transisi", 7, 5, {
    fact: "Unsur pertama buatan manusia; dipakai pelacak radioaktif di rumah sakit.",
  }),
  E(44, "Ru", "Rutenium", 101.07, "logam transisi", 8, 5, { meltK: 2607, boilK: 4423 }),
  E(45, "Rh", "Rodium", 102.91, "logam transisi", 9, 5, {
    meltK: 2237, boilK: 3968,
    fact: "Unsur termahal di konverter katalitik knalpot mobil.",
  }),
  E(46, "Pd", "Paladium", 106.42, "logam transisi", 10, 5, { meltK: 1828.1, boilK: 3236 }),
  E(47, "Ag", "Perak", 107.87, "logam transisi", 11, 5, {
    meltK: 1234.9, boilK: 2435,
    fact: "Konduktor listrik terbaik dari semua logam. Cincin & perhiasan perakmu.",
  }),
  E(48, "Cd", "Kadmium", 112.41, "logam transisi", 12, 5, { meltK: 594.2, boilK: 1040 }),
  E(49, "In", "Indium", 114.82, "logam pasca-transisi", 13, 5, {
    meltK: 429.7, boilK: 2345,
    fact: "Lapisan sentuh layar HP (ITO) — setiap gesekan jarimu menyentuh indium.",
  }),
  E(50, "Sn", "Timah", 118.71, "logam pasca-transisi", 14, 5, {
    meltK: 505.1, boilK: 2875,
    fact: "Kaleng sarden & solder elektronika. Indonesia salah satu produsen timah terbesar dunia.",
  }),
  E(51, "Sb", "Antimon", 121.76, "metaloid", 15, 5, { meltK: 903.8, boilK: 1860 }),
  E(52, "Te", "Telurium", 127.60, "metaloid", 16, 5, { meltK: 722.7, boilK: 1261 }),
  E(53, "I", "Iodin", 126.90, "halogen", 17, 5, {
    meltK: 386.8, boilK: 457.4,
    fact: "Garam beryodium mencegah gondok. Antiseptik kuning di luka.",
  }),
  E(54, "Xe", "Xenon", 131.29, "gas mulia", 18, 5, { meltK: 161.4, boilK: 165.1 }),
  // ===== Periode 6 =====
  E(55, "Cs", "Sesium", 132.91, "alkali", 1, 6, {
    meltK: 301.7, boilK: 944,
    fact: "Jam atom sesium mendefinisikan 'detik' — dasar waktu di GPS-mu.",
  }),
  E(56, "Ba", "Barium", 137.33, "alkali tanah", 2, 6, { meltK: 1000, boilK: 2170 }),
  E(57, "La", "Lantanum", 138.91, "lantanida", 3, 9, { meltK: 1193, boilK: 3737 }),
  E(58, "Ce", "Serium", 140.12, "lantanida", 4, 9, { meltK: 1068, boilK: 3716 }),
  E(59, "Pr", "Praseodimium", 140.91, "lantanida", 5, 9, { meltK: 1208, boilK: 3793 }),
  E(60, "Nd", "Neodimium", 144.24, "lantanida", 6, 9, {
    meltK: 1297, boilK: 3347,
    fact: "Magnet terkuat yang pernah dibuat — ada di speaker & motor getar HP-mu.",
  }),
  E(61, "Pm", "Prometium", 145, "lantanida", 7, 9),
  E(62, "Sm", "Samarium", 150.36, "lantanida", 8, 9, { meltK: 1345, boilK: 2067 }),
  E(63, "Eu", "Europium", 151.96, "lantanida", 9, 9, {
    meltK: 1099, boilK: 1802,
    fact: "Fosfor merah pada layar TV & lampu hemat energi.",
  }),
  E(64, "Gd", "Gadolinium", 157.25, "lantanida", 10, 9, { meltK: 1585, boilK: 3546 }),
  E(65, "Tb", "Terbium", 158.93, "lantanida", 11, 9, { meltK: 1629, boilK: 3503 }),
  E(66, "Dy", "Disprosium", 162.50, "lantanida", 12, 9, { meltK: 1680, boilK: 2840 }),
  E(67, "Ho", "Holmium", 164.93, "lantanida", 13, 9, { meltK: 1734, boilK: 2993 }),
  E(68, "Er", "Erbium", 167.26, "lantanida", 14, 9, { meltK: 1802, boilK: 3141 }),
  E(69, "Tm", "Tulium", 168.93, "lantanida", 15, 9, { meltK: 1818, boilK: 2223 }),
  E(70, "Yb", "Iterbium", 173.05, "lantanida", 16, 9, { meltK: 1097, boilK: 1469 }),
  E(71, "Lu", "Lutesium", 174.97, "lantanida", 17, 9, { meltK: 1925, boilK: 3675 }),
  E(72, "Hf", "Hafnium", 178.49, "logam transisi", 4, 6, { meltK: 2506, boilK: 4876 }),
  E(73, "Ta", "Tantalum", 180.95, "logam transisi", 5, 6, {
    meltK: 3290, boilK: 5731,
    fact: "Kondensator mini di setiap HP — makanya HP bisa sekecil itu.",
  }),
  E(74, "W", "Wolfram", 183.84, "logam transisi", 6, 6, {
    meltK: 3695, boilK: 5828,
    fact: "Titik leleh tertinggi dari semua logam — filamen bohlam lama.",
  }),
  E(75, "Re", "Rhenium", 186.21, "logam transisi", 7, 6, { meltK: 3459, boilK: 5869 }),
  E(76, "Os", "Osmium", 190.23, "logam transisi", 8, 6, {
    meltK: 3306, boilK: 5285,
    fact: "Unsur padat (densitas) tertinggi — segelas osmium seberat ~22 kg.",
  }),
  E(77, "Ir", "Iridium", 192.22, "logam transisi", 9, 6, { meltK: 2719, boilK: 4701 }),
  E(78, "Pt", "Platina", 195.08, "logam transisi", 10, 6, {
    meltK: 2041.4, boilK: 4098,
    fact: "Lebih langka dari emas. Katalis di knalpot & perhiasan premium.",
  }),
  E(79, "Au", "Emas", 196.97, "logam transisi", 11, 6, {
    meltK: 1337.3, boilK: 3129,
    fact: "Tidak pernah berkarat — itulah kenapa emas antik tetap mengkilap setelah ribuan tahun.",
  }),
  E(80, "Hg", "Raksa", 200.59, "logam transisi", 12, 6, {
    meltK: 234.3, boilK: 629.9,
    fact: "Satu-satunya logam cair pada suhu ruang. Termometer lama & bola di jam raksa.",
  }),
  E(81, "Tl", "Talium", 204.38, "logam pasca-transisi", 13, 6, { meltK: 577, boilK: 1746 }),
  E(82, "Pb", "Timbal", 207.2, "logam pasca-transisi", 14, 6, {
    meltK: 600.6, boilK: 2022,
    fact: "Aki mobilmu. Beracun bagi otak — makanya bensin sudah bebas timbal.",
  }),
  E(83, "Bi", "Bismut", 208.98, "logam pasca-transisi", 15, 6, {
    meltK: 544.7, boilK: 1837,
    fact: "Kristalnya berwarna pelangi — sering dijual sebagai batu dekoratif.",
  }),
  E(84, "Po", "Polonium", 209, "logam pasca-transisi", 16, 6, {
    fact: "Sangat radioaktif; 1 gram memancarkan panas hingga 500°C.",
  }),
  E(85, "At", "Astatin", 210, "halogen", 17, 6, {
    fact: "Unsur alami paling langka di Bumi — totalnya kurang dari 30 gram di seluruh kerak Bumi.",
  }),
  E(86, "Rn", "Radon", 222, "gas mulia", 18, 6, {
    fact: "Gas radioaktif yang meresap dari tanah ke ruang bawah tanah.",
  }),
  // ===== Periode 7 =====
  E(87, "Fr", "Fransium", 223, "alkali", 1, 7, {
    fact: "Sekadar terbentuk lalu lenyap dalam hitungan menit — tidak pernah terkumpul terlihat.",
  }),
  E(88, "Ra", "Radium", 226, "alkali tanah", 2, 7, {
    fact: "Dulu dicampur cat luminescent jam tangan — sampai pekerjanya sakit parah.",
  }),
  E(89, "Ac", "Aktinium", 227, "aktinida", 3, 10),
  E(90, "Th", "Torium", 232.04, "aktinida", 4, 10, { meltK: 2115, boilK: 5061 }),
  E(91, "Pa", "Protaktinium", 231.04, "aktinida", 5, 10),
  E(92, "U", "Uranium", 238.03, "aktinida", 6, 10, {
    meltK: 1405.3, boilK: 4404,
    fact: "Bahan bakar pembangkit listrik nuklir — satu pil uranium = beberapa ton batu bara.",
  }),
  E(93, "Np", "Neptunium", 237, "aktinida", 7, 10),
  E(94, "Pu", "Plutonium", 244, "aktinida", 8, 10, {
    fact: "Menjadi daya baterai wahana antariksa Voyager selama 45+ tahun.",
  }),
  E(95, "Am", "Amerisium", 243, "aktinida", 9, 10, {
    fact: "Ada di rumahmu! Detektor asap memakainya sebagai sumber radiasi mini.",
  }),
  E(96, "Cm", "Curium", 247, "aktinida", 10, 10),
  E(97, "Bk", "Berkelium", 247, "aktinida", 11, 10),
  E(98, "Cf", "Kalifornium", 251, "aktinida", 12, 10),
  E(99, "Es", "Einsteinium", 252, "aktinida", 13, 10),
  E(100, "Fm", "Fermium", 257, "aktinida", 14, 10),
  E(101, "Md", "Mendeleevium", 258, "aktinida", 15, 10),
  E(102, "No", "Nobelium", 259, "aktinida", 16, 10),
  E(103, "Lr", "Lorensium", 266, "aktinida", 17, 10),
  E(104, "Rf", "Ruterfordium", 267, "logam transisi", 4, 7),
  E(105, "Db", "Dubnium", 268, "logam transisi", 5, 7),
  E(106, "Sg", "Seaborgium", 269, "logam transisi", 6, 7),
  E(107, "Bh", "Bohrium", 270, "logam transisi", 7, 7),
  E(108, "Hs", "Hasium", 269, "logam transisi", 8, 7),
  E(109, "Mt", "Meitnerium", 278, "logam transisi", 9, 7),
  E(110, "Ds", "Darmstadtium", 281, "logam transisi", 10, 7),
  E(111, "Rg", "Roentgenium", 282, "logam transisi", 11, 7),
  E(112, "Cn", "Kopernisium", 285, "logam transisi", 12, 7),
  E(113, "Nh", "Nihonium", 286, "logam pasca-transisi", 13, 7),
  E(114, "Fl", "Flerovium", 289, "logam pasca-transisi", 14, 7),
  E(115, "Mc", "Moscovium", 290, "logam pasca-transisi", 15, 7),
  E(116, "Lv", "Livermorium", 293, "logam pasca-transisi", 16, 7),
  E(117, "Ts", "Tenesin", 294, "halogen", 17, 7),
  E(118, "Og", "Oganesson", 294, "gas mulia", 18, 7),
];

/** Unsur berdasarkan simbol. */
export function elementBySymbol(symbol: string): ChemicalElement | undefined {
  return ELEMENTS.find((e) => e.symbol === symbol.trim());
}

/**
 * Fase unsur pada suhu ruang (~298 K):
 * gas jika titik didih < 298, cair jika titik leleh < 298 ≤ didih, sisanya padat.
 */
export function phaseAtRoom(e: ChemicalElement): "padat" | "cair" | "gas" {
  if (e.boilK !== undefined && e.boilK < 298) return "gas";
  if (e.meltK !== undefined && e.meltK < 298) return "cair";
  return "padat";
}
