// Everyday Chemistry — database zat & molekul umum
// Massa molar TIDAK disimpan manual — dihitung engine chemistry.ts agar selalu akurat.

export interface Substance {
  formula: string;
  name: string;
  category: Category;
  state: "padat" | "cair" | "gas";
  appearance: string;
  properties: string[];   // sifat penting singkat
  uses: string;           // kegunaan sehari-hari
  danger?: string;        // keamanan, jika ada
  everyday?: string;      // di mana ditemukan sehari-hari
}

export type Category =
  | "Asam" | "Basa" | "Garam" | "Oksida"
  | "Organik" | "Unsur" | "Gas" | "Larutan";

export const CATEGORIES: Category[] = [
  "Asam", "Basa", "Garam", "Oksida", "Organik", "Unsur", "Gas", "Larutan",
];

export const CAT_META: Record<Category, { color: string }> = {
  // warna dipilih agar lolos WCAG AA pada teks kecil di atas bg terang & gelap
  Asam: { color: "#d14d6b" },       // merah — kontras 4.6:1 di light
  Basa: { color: "#3d76d9" },
  Garam: { color: "#a07d1f" },
  Oksida: { color: "#b05f2e" },
  Organik: { color: "#0c7a58" },
  Unsur: { color: "#5b6b80" },
  Gas: { color: "#2a7f95" },
  Larutan: { color: "#7d4fc0" },
};

export const SUBSTANCES: Substance[] = [
  // ===== ASAM =====
  {
    formula: "HCl", name: "Asam klorida", category: "Asam", state: "cair",
    appearance: "Cairan tak berwarna, uap menyengat",
    properties: ["Asam kuat", "Korosif", "Mudah larut air"],
    uses: "Pembersih kerak, pengolah makanan (gelatin), produksi PVC",
    danger: "Korosif — jangan sentuh kulit langsung",
    everyday: "Air baterai, pembersih toilet",
  },
  {
    formula: "H2SO4", name: "Asam sulfat", category: "Asam", state: "cair",
    appearance: "Cairan kental tak berwarna",
    properties: ["Asam kuat sangat korosif", "Sangat hidrofilik (mendehidrasi)", "Pelepas panas saat dicampur air"],
    uses: "Aki mobil, pupuk fosfat, pengolahan logam",
    danger: "Sangat berbahaya — selalu tambahkan asam KE air, bukan sebaliknya",
    everyday: "Aki kendaraan, drain cleaner",
  },
  {
    formula: "HNO3", name: "Asam nitrat", category: "Asam", state: "cair",
    appearance: "Cairan kekuningan, uap merah cokelat saat lama",
    properties: ["Asam kuat", "Oksidator kuat", "Menodai kulit jadi kuning"],
    uses: "Pupuk, bahan peledak, pengujian logam mulia",
    danger: "Oksidator kuat — mudah terbakar bila campur organik",
    everyday: "Industri pupuk, laboratorium",
  },
  {
    formula: "CH3COOH", name: "Asam asetat (cuka)", category: "Asam", state: "cair",
    appearance: "Cairan bening berbau tajam khas cuka",
    properties: ["Asam lemah", "Aman untuk makanan", "Antiseptik ringan"],
    uses: "Bumbu masak, pengawet alami, pembersih kerak",
    everyday: "Cuka dapur (5–8%), cuka apel",
  },
  {
    formula: "H2CO3", name: "Asam karbonat", category: "Asam", state: "cair",
    appearance: "Hanya ada dalam larutan — tidak stabil murni",
    properties: ["Asam sangat lemah", "Terbentuk dari CO₂ + H₂O", "Pemecah batu kapur"],
    uses: "Rasa 'menyengat' minuman bersoda, pelarut batuan alami",
    everyday: "Soda, air mineral berkarbonasi, air hujan",
  },
  {
    formula: "C6H8O6", name: "Asam askorbat (Vitamin C)", category: "Asam", state: "padat",
    appearance: "Bubuk putih kekuningan",
    properties: ["Antioksidan kuat", "Asam lemah", "Larut air"],
    uses: "Suplemen imunitas, pengawet makanan, sintesis kolagen",
    everyday: "Jeruk, guava, suplemen vitamin C",
  },

  // ===== BASA =====
  {
    formula: "NaOH", name: "Natrium hidroksida (soda api)", category: "Basa", state: "padat",
    appearance: "Pellets/kepingan putih, licin saat tersentuh larutan",
    properties: ["Basa kuat ekstrem", "Korosif", "Menyerap air & CO₂ udara"],
    uses: "Pembuatan sabun, pembersih saluran air, industri kertas",
    danger: "Korosif parah — menyebabkan luka kimia",
    everyday: "Sabun cuci, pembersih saluran pembuangan",
  },
  {
    formula: "KOH", name: "Kalium hidroksida", category: "Basa", state: "padat",
    appearance: "Pellets putihan",
    properties: ["Basa kuat", "Higroskopis", "Serupa NaOH"],
    uses: "Sabun cair lunak, elektrolit baterai alkali",
    danger: "Korosif seperti soda api",
    everyday: "Baterai alkaline, sabun cair",
  },
  {
    formula: "NH3", name: "Amonia", category: "Basa", state: "gas",
    appearance: "Gas tak berwarna berbau tajam menusuk",
    properties: ["Basa lemah", "Sangat larut air", "Bau khas urin/pupuk"],
    uses: "Pupuk nitrogen, pembersih kaca, pendingin",
    danger: "Uap mengiritasi mata & paru — jangan campur pemutih!",
    everyday: "Pembersih kaca, pupuk urea",
  },
  {
    formula: "Ca(OH)2", name: "Kalsium hidroksida (kapur tohor)", category: "Basa", state: "padat",
    appearance: "Bubuk putih",
    properties: ["Basa kuat sedang", "Sedikit larut air", "Mengikat CO₂"],
    uses: "Air kapur barus, bangunan, netralisasi tanah asam",
    everyday: "Air kapur, semennya dinding, kapur sirih",
  },
  {
    formula: "Mg(OH)2", name: "Magnesium hidroksida (susu magnesia)", category: "Basa", state: "padat",
    appearance: "Suspensi putih susu",
    properties: ["Basa lemah aman", "Antasida", "Laksatif ringan"],
    uses: "Obat maag, penetralkan keasaman lambung",
    everyday: "Obat maag suspensi putih",
  },

  // ===== GARAM =====
  {
    formula: "NaCl", name: "Natrium klorida (garam dapur)", category: "Garam", state: "padat",
    appearance: "Kristal kubus putih/bening",
    properties: ["Garam neutral", "Larut air", "Elektrolit esensial"],
    uses: "Bumbu, pengawet, deicing jalanan, infus fisiologis",
    everyday: "Meja makan, keju, ikan asin",
  },
  {
    formula: "NaHCO3", name: "Natrium bikarbonat (baking soda)", category: "Garam", state: "padat",
    appearance: "Bubuk putih halus",
    properties: ["Amfoter (asam & basa lemah)", "Menghasilkan CO₂ saat dipanaskan/asam", "Deodorizer alami"],
    uses: "Pengembang kue, deodorizer kulkas, pasta gigi",
    everyday: "Baking soda, obat maag tablet effervescent",
  },
  {
    formula: "CaCO3", name: "Kalsium karbonat", category: "Garam", state: "padat",
    appearance: "Padatan putih — mineral paling umum di kerak bumi",
    properties: ["Tidak larut air", "Larut dalam asam (berdesis)", "Komponen kapur batu"],
    uses: "Suplemen kalsium, kapur tulis, antasida, bahan bangunan",
    everyday: "Kapur tulis, marmer, kerang telur, obat kalsium",
  },
  {
    formula: "CaSO4", name: "Kalsium sulfat (gipsum)", category: "Garam", state: "padat",
    appearance: "Mineral putih keabuan",
    properties: ["Sedikit larut air", "Mengeras saat direhidrasi", "Tahan api"],
    uses: "Plaster dinding, kapur gipsum, cetakan",
    everyday: "Dinding rumah, kapur gipsum guru",
  },
  {
    formula: "AgNO3", name: "Perak nitrat", category: "Garam", state: "padat",
    appearance: "Kristal bening, menghitam saat kena cahaya",
    properties: ["Precipitating agent", "Antiseptik", "Fotosensitif"],
    uses: "Uji halida, fotografi klasik, obat luka",
    danger: "Menodai kulit hitam permanen beberapa hari",
    everyday: "Fotografi analog lama, tes lab sekolah",
  },
  {
    formula: "CuSO4", name: "Tembaga sulfat", category: "Garam", state: "padat",
    appearance: "Kristal biru royal ikonik",
    properties: ["Fungisida", "Electroplating", "Beracun bagi akuatik"],
    uses: "Pembasmi jamur pertanian, pelapisan tembaga, uji air",
    danger: "Toksik bagi ikan & organisme air",
    everyday: "Pupuk/fungisida taman, praktikum elektrolisis",
  },

  // ===== OKSIDA =====
  {
    formula: "H2O", name: "Air", category: "Oksida", state: "cair",
    appearance: "Cairan bening — pelarut universal",
    properties: ["Pelarut paling serbaguna", "Kalor jenis tertinggi", "Memua saat membeku (unik!)"],
    uses: "Media hidup, pelarut, pendingin, reagen",
    everyday: "Semua di sekitar kita — 60% tubuh manusia",
  },
  {
    formula: "CO2", name: "Karbondioksida", category: "Oksida", state: "gas",
    appearance: "Gas tak berwarna, lebih berat dari udara",
    properties: ["Asam dalam air", "Sublim pada −78°C (dry ice)", "GRK utama"],
    uses: "Minuman bersoda, dry ice, pemadam api, fotosintesis",
    everyday: "Soda, dry ice panggung, napas yang dihembuskan",
  },
  {
    formula: "CO", name: "Karbon monoksida", category: "Oksida", state: "gas",
    appearance: "Gas tak berwarna TANPA bau — mematikan diam-diam",
    properties: ["Mengikat hemoglobin 200× lebih kuat dari O₂", "Hasil pembakaran tak sempurna", "Sangat toksik"],
    uses: "Reduksi bijih besi, sintesis kimia industri",
    danger: "Beracun fatal — penyebab keracunan gas silent killer",
    everyday: "Knalpot kendaraan, asap rokok",
  },
  {
    formula: "Fe2O3", name: "Besi(III) oksida (karat)", category: "Oksida", state: "padat",
    appearance: "Padatan pori cokelat kemerahan",
    properties: ["Produk korosi", "Pigmen merah", "Tidak melindungi logam dasar"],
    uses: "Pigmen cat merah, poles logam, bijih besi",
    everyday: "Pagar tua berkarat, pigmen cat merah bata",
  },
  {
    formula: "SiO2", name: "Silika dioksida (pasir)", category: "Oksida", state: "padat",
    appearance: "Kristal bening/pasir putih",
    properties: ["Sangat keras", "Titik lebur tinggi (~1700°C)", "Inert secara kimia"],
    uses: "Kaca, semen, chip elektronik (silikon), desikan",
    everyday: "Jendela kaca, pasir pantai, chip HP",
  },

  // ===== ORGANIK =====
  {
    formula: "CH4", name: "Metana", category: "Organik", state: "gas",
    appearance: "Gas tak berwarna, mudah terbakar biru",
    properties: ["Hidrokarbon terkecil", "GRK 25× lebih kuat dari CO₂", "Mudah meledak"],
    uses: "Bahan bakar gas kota, biogas, bahan kimia",
    danger: "Mudah terbakar & meledak dalam ruang tertutup",
    everyday: "Gas LPG (campuran), biogas kotoran",
  },
  {
    formula: "C2H5OH", name: "Etanol (alkohol)", category: "Organik", state: "cair",
    appearance: "Cairan bening berbau khas alkohol",
    properties: ["Disinfektan", "Pelarut", "Mudah terbakar"],
    uses: "Antiseptik, bahan bakar bioetanol, pelarut parfum",
    danger: "Mudah terbakar — jauhkan dari api",
    everyday: "Hand sanitizer, minuman beralkohol, E5 fuel",
  },
  {
    formula: "C12H22O11", name: "Sukrosa (gula pasir)", category: "Organik", state: "padat",
    appearance: "Kristal putih manis",
    properties: ["Karbohidrat disakarida", "Sangat larut air", "Karamel saat dipanaskan"],
    uses: "Pemanis, pengawet (selai), fermentasi",
    everyday: "Gula meja, kue, selai",
  },
  {
    formula: "C6H12O6", name: "Glukosa (gula darah)", category: "Organik", state: "padat",
    appearance: "Bubuk putih manis",
    properties: ["Monosakarida", "Sumber energi sel langsung", "Reducing sugar"],
    uses: "Infus energi, respirasi seluler, fotosintesis produk",
    everyday: "Infus dokter, gula darah tubuh kita, madu",
  },
  {
    formula: "CH3COCH3", name: "Aseton", category: "Organik", state: "cair",
    appearance: "Cairan bening berbau tajam manis",
    properties: ["Pelarut kuat", "Sangat mudah menguap", "Mudah terbakar"],
    uses: "Pembersih kutek, pelarut cat, industri plastik",
    danger: "Mudah terbakar & iritasi pernapasan",
    everyday: "Aceton pembersih kutek",
  },
  {
    formula: "C8H10N4O2", name: "Kafein", category: "Organik", state: "padat",
    appearance: "Bubuk putih pahit",
    properties: ["Stimulan sistem saraf", "Alkaloid", "Diuretik ringan"],
    uses: "Minuman energik, obat flu, penelitian farmasi",
    everyday: "Kopi, teh, cokelat, energy drink",
  },

  // ===== UNSUR =====
  {
    formula: "Fe", name: "Besi", category: "Unsur", state: "padat",
    appearance: "Logam abu-abu keperakan, magnetik",
    properties: ["Logam transisi", "Magnetik", "Rentan korosi"],
    uses: "Konstruksi baja, hemoglobin darah, magnet",
    everyday: "Baja bangunan, panci, darah kita",
  },
  {
    formula: "Cu", name: "Tembaga", category: "Unsur", state: "padat",
    appearance: "Logam kemerahan mengkilap, menghijau saat tua",
    properties: ["Konduktor listrik nomor dua (setelah Ag)", "Antimikroba alami", "Ductile"],
    uses: "Kabel listrik, pipa air, atap patung",
    everyday: "Kabel listrik, uang koin lama, panci tembaga",
  },
  {
    formula: "Ag", name: "Perak", category: "Unsur", state: "padat",
    appearance: "Logam putih mengkilap paling konduktif",
    properties: ["Konduktor listrik & panas terbaik", "Antimikroba", "Tarnish oleh sulfur"],
    uses: "Perhiasan, kontak listrik presisi, antibakteri",
    everyday: "Cincin perak, sendok antik, kain antibakteri",
  },
  {
    formula: "Au", name: "Emas", category: "Unsur", state: "padat",
    appearance: "Logam kuning berkilau — tak pernah ternoda",
    properties: ["Inert (tak bereaksi)", "Sangat ductile & malleable", "Konduktor baik"],
    uses: "Perhiasan, kontak elektronik premium, cadangan nilai",
    everyday: "Cincin emas, konektor kartu SIM",
  },
  {
    formula: "Al", name: "Aluminium", category: "Unsur", state: "padat",
    appearance: "Logam abu terang ringan",
    properties: ["Ringan namun kuat", "Lapisan oksida melindungi", "Recyclable tanpa henti"],
    uses: "Foil dapur, rangka pesawat, kaleng minuman",
    everyday: "Foil bungkus nasi, kaleng soda, frame HP",
  },
  {
    formula: "Zn", name: "Seng", category: "Unsur", state: "padat",
    appearance: "Logam kebiruan-perakan",
    properties: ["Anoda pengorbanan (proteksi katodik)", "Esensial imunitas", "Galvanisasi"],
    uses: "Galvanisasi besi, baterai, suplemen Zn",
    everyday: "Atap seng, baterai ABC, suplemen zinc",
  },

  // ===== GAS =====
  {
    formula: "O2", name: "Oksigen", category: "Gas", state: "gas",
    appearance: "Gas tak berwarna — penyelamat hidup",
    properties: ["Oksidator", "21% atmosfer", "Sangat reaktif dengan logam"],
    uses: "Pernapasan medis, las oxy-fuel, roket propellant",
    everyday: "Tabung oksigen RS, selam scuba",
  },
  {
    formula: "N2", name: "Nitrogen", category: "Gas", state: "gas",
    appearance: "Gas inert tak berwarna — 78% atmosfer",
    properties: ["Sangat stabil (ikatan rangkap N≡N)", "Inert", "Cair pada −196°C"],
    uses: "Nitrogen cair kriogenik, pengawet makanan (kemasan), pupuk",
    everyday: "Keripik yang 'mengembang' kemasannya, nitrogen ice cream",
  },
  {
    formula: "H2", name: "Hidrogen", category: "Gas", state: "gas",
    appearance: "Gas teringan di alam semesta",
    properties: ["Energi per kg tertinggi", "Mudah terbakar", "Bahan bintang!"],
    uses: "Fuel cell masa depan, hydrogenasi lemak, roket",
    danger: "Sangat mudah terbakar — ledakan Hindenburg 1937",
    everyday: "Balon berisi gas ringan, riset fuel cell",
  },
  {
    formula: "He", name: "Helium", category: "Gas", state: "gas",
    appearance: "Gas mulia super-ringan",
    properties: ["Gas mulia (inert total)", "Titik didih terendah (−269°C)", "Mengubah suara jadi cempreng"],
    uses: "Balon, MRI cooling, campuran napas selam",
    everyday: "Balon ulang tahun melayang",
  },
  {
    formula: "Cl2", name: "Gas klorin", category: "Gas", state: "gas",
    appearance: "Gas kuning-hijau berbau menyengat",
    properties: ["Oksidator kuat", "Disinfektan", "Sangat toksik (senjata WWI)"],
    uses: "Sterilisasi air PDAM, bleaching, PVC",
    danger: "Toksis — jangan pernah campur pemutih + asam",
    everyday: "Air keran yang 'berbau' kolam renang",
  },

  // ===== LARUTAN =====
  {
    formula: "NaClO", name: "Natrium hipoklorit (pemutih)", category: "Larutan", state: "cair",
    appearance: "Cairan kuning pucat berbau khas kolam",
    properties: ["Oksidator kuat", "Disinfektan spektrum luas", "Instabil terang/panas"],
    uses: "Pemutih pakaian, sterilisasi air, pembersih",
    danger: "Iritasi kuat — JANGAN dicampur asam (hasil Cl₂)",
    everyday: "Bayclin/pemutih pakaian, kaporit kolam",
  },
  {
    formula: "H2O2", name: "Hidrogen peroksida", category: "Larutan", state: "cair",
    appearance: "Cairan bening mirip air",
    properties: ["Oksidator lemah (3%) sampai kuat (>30%)", "Dekomposisi jadi air + O₂", "Antiseptik busa putih"],
    uses: "Antiseptik luka, bleaching rambut, sterilisasi lensa",
    danger: "Konsentrasi tinggi korosif",
    everyday: "Obat kumur luka (busa putihnya = O₂ hasil reaksi enzim kulit)",
  },
];
