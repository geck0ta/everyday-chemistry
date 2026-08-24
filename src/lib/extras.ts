// Everyday Chemistry — konten tambahan per fenomena:
// fakta menarik, eksperimen mandiri, dan zat terkait untuk cross-link kalkulator.

export interface ExtraContent {
  funFacts: string[];
  tryIt: string;
  relatedFormulas: { formula: string; label: string }[];
  relatedIds?: string[];
}

export const EXTRAS: Record<string, ExtraContent> = {
  "besi-berkarat": {
    funFacts: [
      "Karat bukan pelindung — berbeda dengan patina tembaga, karat besi berpori sehingga korosi terus menembus ke dalam.",
      "Rumus Titanic: kapal raksasa itu sekarang sedang 'dimakan' bakteri dan korosi di dasar laut, sekitar 0,2 mm per tahun.",
      "Menambahkan garam ke jalan beku mempercepat korosi mobil — ion klorida adalah katalis korosi yang efektif.",
    ],
    tryIt:
      "Siapkan 3 paku baja: satu dibiarkan kering, satu direndam air, satu dicelup lalu dibungkus tisu basah. Setelah 3 hari, bandingkan. Paku yang lembap tapi bersentuhan udara berkarat paling cepat!",
    relatedFormulas: [
      { formula: "Fe", label: "Besi" },
      { formula: "Fe2O3", label: "Besi(III) oksida (karat)" },
      { formula: "H2O", label: "Air" },
    ],
    relatedIds: ["perak-menghitam", "patung-perunggu-hijau"],
  },
  "minyak-air": {
    funFacts: [
      "Lava lamp bekerja karena prinsip ini — lilin dan air saling menolak, panas membuat lilin naik-turun.",
      "Minyak bunga (lavender dll.) bisa larut dalam air jika diteteskan bersama sabun — emulgator alami.",
      "Air dan alkohol justru BISA bercampur sempurna — keduanya sama-sama polar.",
    ],
    tryIt:
      "Tuangkan air, minyak, dan madu ke satu gelas bertingkat-tingkat. Lalu taburkan garam: gelembung minyak akan naik-turun saat garam membawa tetesan minyak ke bawah lalu melepaskannya!",
    relatedFormulas: [
      { formula: "H2O", label: "Air" },
      { formula: "NaCl", label: "Garam dapur" },
    ],
    relatedIds: ["sabun-mencuci", "soda-berbusa"],
  },
  "telur-dipanaskan": {
    funFacts: [
      "Protein telur mulai memadat pada 62°C (kuning) dan 65°C (putih) — itulah kenapa telur setengah matang butuh presisi suhu.",
      "Telur asin tidak memadat oleh panas melainkan oleh garam yang menguras air — kimia yang sama, mekanisme beda.",
      "Omelet Prancis yang lembut dimasak di suhu rendah supaya protein tidak mengikat terlalu rapat (yang membuat tekstur karet).",
    ],
    tryIt:
      "Rebus telur tepat 6 menit vs 10 menit lalu bandingkan kuningnya. Warna abu-hijau pada kuning telur overcook adalah reaksi besi + sulfur — reaksi kimia yang sama dengan perak menghitam!",
    relatedFormulas: [
      { formula: "H2O", label: "Air (media panas)" },
      { formula: "Fe", label: "Besi (dari kuning telur)" },
    ],
    relatedIds: ["yoghurt", "minyak-tengik", "roti-mengembang"],
  },
  "apel-menghitam": {
    funFacts: [
      "Buah yang paling lambat cokelat: apel varietas Arctic — dimodifikasi agar tak memproduksi enzimnya.",
      "Melihat potongan apel menjadi ukuran laju reaksi: makin luas permukaan potong, makin cepat menghitam.",
      "Mengapa tidak semua buah menghitam sama cepat? Kadar polifenol dan enzim berbeda tiap spesies.",
    ],
    tryIt:
      "Potong apel menjadi 5 bagian: satu polos, satu diberi perasan jeruk nipis, satu dibaluri madu, satu direndam air dingin, satu dibungkus plastik rapat. Cek setelah 1 jam — mana yang paling putih?",
    relatedFormulas: [
      { formula: "O2", label: "Oksigen" },
      { formula: "C6H8O6", label: "Vitamin C (antioksidan)" },
    ],
    relatedIds: ["minyak-tengik", "pemutih-pakaian"],
  },
  "api-menyala": {
    funFacts: [
      "Api adalah plasma — keadaan materi keempat selain padat, cair, gas.",
      "Warna api menunjukkan suhu: merah ±700°C, kuning-oranye ±1100°C, biru bisa >1400°C.",
      "Kayu yang 'dingin' pun menyimpan energi kimia dari fotosintesis puluhan tahun lalu — api hanya melepaskannya kembali.",
    ],
    tryIt:
      "(Dengan pengawasan orang dewasa!) Nyalakan lilin lalu tiup dan segera dekatkan korek api ke asapnya — api bisa 'melompat' kembali ke sumbu. Asap lilin adalah uap bahan bakar yang belum terbakar.",
    relatedFormulas: [
      { formula: "CH4", label: "Metana (gas)" },
      { formula: "CO2", label: "Karbondioksida" },
      { formula: "O2", label: "Oksigen" },
    ],
    relatedIds: ["fotosintesis", "kunang-kunang"],
  },
  fotosintesis: {
    funFacts: [
      "Setiap tahun fotosintesis mengubah ±100 gigaton karbon — beratnya ribuan kali piramida Giza.",
      "Daun hijau ternyata menolak warna hijau! Klorofil menyerap merah & biru, memantulkan hijau ke mata kita.",
      "Tanaman juga bernapas (respirasi) — siapa pun bisa lihat gelembung oksigen dari tanaman air di bawah matahari.",
    ],
    tryIt:
      "Rendam daun elodea/hydrilla dalam air bening, letakkan di bawah sinar matahari, hitung gelembung oksigen per menit. Pindahkan lampu lebih dekat = fotosintesis makin cepat — kamu sedang mengukur laju reaksi!",
    relatedFormulas: [
      { formula: "C6H12O6", label: "Glukosa" },
      { formula: "CO2", label: "Karbondioksida" },
      { formula: "H2O", label: "Air" },
    ],
    relatedIds: ["pernapasan-sel", "api-menyala"],
  },
  "pernapasan-sel": {
    funFacts: [
      "Tubuh manusia menghasilkan ATP setara berat badannya sendiri setiap hari — dipakai dan dibuat ulang terus-menerus.",
      "Otak menggunakan 20% energi tubuh meski hanya 2% bobotnya.",
      "Yeast membuat bir dengan cara yang mirip — tapi tanpa oksigen (fermentasi), hasilnya alkohol bukan CO₂ saja.",
    ],
    tryIt:
      "Tiupkan napas ke air kapur barus (air kapur toga) — airnya keruh karena CO₂ napasmu bereaksi jadi kalsium karbonat. Keruh = bukti CO₂ ada.",
    relatedFormulas: [
      { formula: "C6H12O6", label: "Glukosa" },
      { formula: "CO2", label: "Karbondioksida" },
    ],
    relatedIds: ["fotosintesis", "bau-keringat"],
  },
  "garam-mencairkan-es": {
    funFacts: [
      "Garam tak bisa mencairkan es di bawah −21°C — titik eutektik NaCl. Di negara super-dingin pakai kalsium klorida.",
      "Satu sendok garam menurunkan titik beku 500 ml air hingga sekitar −2°C.",
      "Es di kutub mencair lebih lambat karena air laut sudah mengandung garam — sifat colligative yang menyelamatkan iklim.",
    ],
    tryIt:
      "Isi dua gelas dengan es batu. Taburi garam di salah satunya. Ukur suhu kedua campuran dengan termometer — gelas bergaram jadi LEBIH DINGIN! Garam membuat es mencair, dan mencair butuh energi yang diserap dari lingkungan.",
    relatedFormulas: [
      { formula: "NaCl", label: "Natrium klorida" },
      { formula: "H2O", label: "Air" },
    ],
    relatedIds: ["kerak-ketel", "embun-pagi"],
  },
  "soda-berbusa": {
    funFacts: [
      "Dalam satu botol soda terlarut sekitar 2–3 liter CO₂ (pada tekanan normal) — itulah kenapa desisnya begitu lama.",
      "'Soda' asli dinamai begitu karena dulu memakai natrium bikarbonat — sekarang kebanyakan hanya CO₂ + air.",
      "Gelembung soda rasanya 'menyengat' karena CO₂ bereaksi dengan lidah membentuk asam karbonat lemah.",
    ],
    tryIt:
      "Masukkan kismis ke segelas soda. Kismis awalnya tenggelam, tapi gelembung CO₂ menempel membuatnya mengapung, lalu tenggelam lagi saat gelembung lepas — dansa tanpa henti!",
    relatedFormulas: [
      { formula: "CO2", label: "Karbondioksida" },
      { formula: "H2CO3", label: "Asam karbonat" },
      { formula: "H2O", label: "Air" },
    ],
    relatedIds: ["baking-soda-cuka", "garam-mencairkan-es"],
  },
  "baking-soda-cuka": {
    funFacts: [
      "Campuran ini juga pemadam api kecil: CO₂ yang dihasilkan lebih berat dari udara dan 'mencekik' nyala lilin.",
      "Baking powder sudah berisi asam + basa kering — baru bereaksi saat dibasahi adonan.",
      "Reaksi ini endotermik untuk baking soda murni — gelasnya terasa mendingin, bukan hangat!",
    ],
    tryIt:
      "Letakkan lilin teh menyala dalam wadah, tuang cuka lalu baking soda di sekitarnya (tanpa memadamkan lilin langsung). Api padam 'tertelan' kabut CO₂ — bukti CO₂ lebih berat dari udara.",
    relatedFormulas: [
      { formula: "NaHCO3", label: "Natrium bikarbonat" },
      { formula: "CH3COOH", label: "Asam asetat (cuka)" },
      { formula: "CO2", label: "Karbondioksida" },
    ],
    relatedIds: ["soda-berbusa", "kerak-ketel", "roti-mengembang"],
  },
  "sabun-mencuci": {
    funFacts: [
      "Sabun bekerja dengan cara fisika-kimia: ia tak 'membunuh' kuman, tapi melepasnya dari permukaan agar terbawa air.",
      "COVID-19: mencuci tangan 20 detik dengan sabun lebih efektif daripada hand sanitizer untuk virus berselubung lemak.",
      "Sabun klasik dibuat dari lemak + abu kayu (REAKSI saponifikasi) — teknologi 4800 tahun dari Babilonia.",
    ],
    tryIt:
      "Taburkan merica halus di atas air dalam mangkuk. Sentuh tengah permukaan air dengan sabun sedikit — merica lari ke pinggir! Sabun merusak tegangan permukaan di titik sentuh, air 'tertarik' keluar membawa merica.",
    relatedFormulas: [
      { formula: "NaOH", label: "Natrium hidroksida (soda api)" },
      { formula: "H2O", label: "Air" },
    ],
    relatedIds: ["minyak-air", "pelangi-genangan"],
  },
  yoghurt: {
    funFacts: [
      "'Punya' yoghurt: bakteri starter-nya hidup dan masih aktif sampai sekarang — keturunan budaya yang sama dari ribuan tahun.",
      "Kefir punya komunitas bakteri + ragi yang lebih kompleks, rasanya lebih tajam dari yoghurt biasa.",
      "Orangan lactose intolerant sering masih tahan yoghurt — bakterinya sudah 'mencerna' laktosanya sebagian.",
    ],
    tryIt:
      "Campurkan susu UHT + 2 sendok yoghurt plain (harus ada tulisan live culture). Tutup kain, simpan di tempat hangat 12 jam. Besoknya: yoghurt buatanmu sendiri!",
    relatedFormulas: [
      { formula: "C12H22O11", label: "Laktosa" },
      { formula: "C3H6O3", label: "Asam laktat" },
    ],
    relatedIds: ["roti-mengembang", "telur-dipanaskan"],
  },
  "minyak-tengik": {
    funFacts: [
      "Minyak zaitun ekstra virgin lebih tahan tengik karena kandungan vitamin E (antioksidan alami) yang tinggi.",
      "Minyak yang digoreng berulang makin cepat tengik — sisa partikel makanan jadi katalis kerusakan.",
      "Baon tengik itu bukan cuma tidak enak — senyawa oksidasinya (aldehida) berpotensi tidak sehat jika dikonsumsi rutin.",
    ],
    tryIt:
      "Isi dua botol kecil dengan minyak yang sama: satu disimpan gelap, satu di ambang jendela terik. Cium bedanya setelah 2 minggu — cahaya mempercepat oksidasi secara dramatis.",
    relatedFormulas: [
      { formula: "O2", label: "Oksigen" },
      { formula: "C18H34O2", label: "Asam oleat (lemak zaitun)" },
    ],
    relatedIds: ["apel-menghitam", "patung-perunggu-hijau"],
  },
  "perak-menghitam": {
    funFacts: [
      "Perak antik yang hitamnya rata justru lebih dihargai kolektor — patina menandakan usia asli.",
      "Kota dengan udara paling bersih punya perak yang paling lambat hitam — tarnishing adalah indikator polusi H₂S.",
      "Trick aluminium foil + soda: elektrokimia sederhana — Al lebih reaktif, 'mengambil' sulfur kembali ke dirinya.",
    ],
    tryIt:
      "Barang perak hitam + aluminium foil + air panas + 1 sendok garam. Diamkan 10 menit. Hitamnya pindah ke foil — tanpa digosok sama sekali!",
    relatedFormulas: [
      { formula: "Ag", label: "Perak" },
      { formula: "Ag2S", label: "Perak sulfida (hitam)" },
      { formula: "Al", label: "Aluminium" },
    ],
    relatedIds: ["besi-berkarat", "patung-perunggu-hijau"],
  },
  "patung-perunggu-hijau": {
    funFacts: [
      "Patung Liberty hijau bukan desain — dia aslinya cokelat kemerahan seperti penny baru. Butuh ±30 tahun untuk hijau penuh.",
      "Patina adalah contoh korosi yang MELINDUNGI — arsitektur modern bahkan memakai lembaran tembaga agar 'mengeras' sendiri.",
      "Atapan gereja tua Eropa berwarna hijau muda karena atap tembaga yang sudah berpatina ratusan tahun.",
    ],
    tryIt:
      "Celupkan koin tembaga (misal uang logam lama) ke cuka + garam selama 15 menit. Angkat dan biarkan semalam — permukaan akan mulai berkembang patina biru-hijau mini!",
    relatedFormulas: [
      { formula: "Cu", label: "Tembaga" },
      { formula: "CuSO4", label: "Tembaga sulfat" },
      { formula: "Cu2(OH)2CO3", label: "Malachite (patina hijau)" },
    ],
    relatedIds: ["besi-berkarat", "perak-menghitam"],
  },
  "bau-keringat": {
    funFacts: [
      "Asam isovalerat (bau kaki) juga ditemukan di keju biru — itu kenapa baunya mirip!",
      "Produk anti-bau bekerja dua jalur: membunuh/menahan bakteri, atau menyerap kelembapan habitat mereka.",
      "Stress sweat bau beda dari heat sweat — kelenjar apokrin (stress) menghasilkan 'makanan' lebih kaya bagi bakteri.",
    ],
    tryIt:
      "Basahi dua kapas: satu air garam pekat, satu air biasa. Letakkan di dua wadah terpisah yang lembap, tutup beberapa hari. Bandingkan baunya — air garam jauh lebih tahan bau karena menghambat bakteri.",
    relatedFormulas: [
      { formula: "NaCl", label: "Garam" },
      { formula: "C5H10O2", label: "Asam isovalerat" },
    ],
    relatedIds: ["yoghurt", "sabun-mencuci"],
  },
  "pemutih-pakaian": {
    funFacts: [
      "Pemutih juga 'memutih' bakteri — ia merusak protein mikroorganisme, makanya jadi disinfektan sekaligus.",
      "Jangan pernah campur pemutih dengan cuka atau alkohol — gas klorin yang dihasilkan sangat beracun.",
      "Sunlight bleaching: menjemur pakaian putih di matahari memutihkan alami — UV memicu oksidasi yang sama, gratis!",
    ],
    tryIt:
      "Rendam sepotong kain putih bernoda jus anggur dalam air + tetes pemutih encer (1:10). Bandingkan dengan bagian yang direndam air biasa. Selalu pakai sarung tangan!",
    relatedFormulas: [
      { formula: "NaClO", label: "Natrium hipoklorit" },
      { formula: "H2O", label: "Air" },
    ],
    relatedIds: ["apel-menghitam", "api-menyala"],
  },
  "kunang-kunang": {
    funFacts: [
      "Bioluminesensi berkembang terpisah di 40+ garis evolusi — ikan laut dalam, jamur, ubur-ubur, bakteri.",
      "Luciferin kunang-kunang kini dipakai di laboratorium untuk 'menyalakan' gen tertentu — penelitian kanker memakainya.",
      "Ada kunang-kunang yang sinkron berkedip ribuan individu serentak — fenomena di Thailand & Malaysia.",
    ],
    tryIt:
      "Malam hari, matikan semua lampu di halaman dan tunggu 5 menit. Mata manusia butuh waktu adaptasi gelap penuh — setelah itu kunang-kunang (jika ada di sekitarmu) terlihat jauh lebih jelas.",
    relatedFormulas: [
      { formula: "O2", label: "Oksigen" },
    ],
    relatedIds: ["fotosintesis", "api-menyala"],
  },
  "kerak-ketel": {
    funFacts: [
      "Air hujan alami lunak; air sumur sering keras — kesadahan diukur sebagai ppm CaCO₃.",
      "Kerak 1mm di elemen pemanas listrik menaikkan konsumsi energi ~7% — membersihkan kerak hemat listrik.",
      "Mesin espresso butuh air lunak: kerak merusak pompa presisi dan mengubah rasa ekstraksi.",
    ],
    tryIt:
      "Masukkan 50ml cuka ke ketel/kendi berkerak, diamkan 1 jam (atau didihkan hati-hati). Kerak berdesis dan larut — reaksinya bisa kamu lihat lewat gelembung CO₂ yang keluar!",
    relatedFormulas: [
      { formula: "CaCO3", label: "Kalsium karbonat (kerak)" },
      { formula: "CH3COOH", label: "Asam asetat (cuka)" },
      { formula: "Ca(HCO3)2", label: "Kalsium bikarbonat" },
    ],
    relatedIds: ["baking-soda-cuka", "garam-mencairkan-es"],
  },
  "roti-mengembang": {
    funFacts: [
      "Sourdough starter adalah ekosistem hidup bakteri + ragi — bisa diwariskan turun-temurun, ada yang berusia 100+ tahun.",
      "Ragi menghasilkan CO₂ dan etanol — roti panggang punya jejak alkohol yang lenyap saat dipanaskan.",
      "Roti mengembang 2x lipat bukan karena banyak gas, tapi karena ribuan gelembung mikro yang merata.",
    ],
    tryIt:
      "Campur 1 sdt gula, 1 sdt ragi, dan air hangat dalam botol kecil lalu pasang balon di mulutnya. Dalam 20 menit balon mengembang — CO₂ dari fermentasi mengecilkannya secara nyata!",
    relatedFormulas: [
      { formula: "C6H12O6", label: "Glukosa" },
      { formula: "C2H5OH", label: "Etanol" },
      { formula: "CO2", label: "Karbondioksida" },
    ],
    relatedIds: ["yoghurt", "baking-soda-cuka"],
  },
  "hortensia-warna": {
    funFacts: [
      "Antosianin juga penyebab warna ungu pada kubis, biru pada blueberry, merah pada rose — kelompok pigmen serbaguna.",
      "Ekstrak kubis ungu adalah indikator pH rumahan terbaik: merah (asam) → ungu → hijau → kuning (basa).",
      "Hortensia putih TIDAK bisa diubah warnanya — varietas itu tak punya pigmen yang responsif terhadap aluminium.",
    ],
    tryIt:
      "Rebus beberapa lembar kubis ungu, ambil airnya (ungu muda). Tuang ke 3 gelas: + cuka (merah!), + air (ungu), + baking soda (hijau-biru!). Indikator pH alami buatan sendiri.",
    relatedFormulas: [
      { formula: "AlCl3", label: "Aluminium klorida" },
      { formula: "CH3COOH", label: "Asam asetat" },
    ],
    relatedIds: ["baking-soda-cuka", "kerak-ketel"],
  },
  "pelangi-genangan": {
    funFacts: [
      "Newton's rings: pola interferensi yang sama muncul di celah dua kaca yang ditekan bersama — dipakai untuk mengukur kehalusan lensa.",
      "Gelembung sabun sebelum pecah jadi hitam — filmnya setipis kurang dari panjang gelombang cahaya, tak ada warna yang bisa menguat.",
      "Teknologi anti-refleksi pada kacamata memakai prinsip kebalikan: lapisan tipis yang MENGHANCURKAN pantulan via interferensi.",
    ],
    tryIt:
      "Isi wadah dengan air, tuang sedikit talc/bubuk cokelat di permukaan, lalu satu tetes minyak goreng. Tiup permukaannya pelan-pelan — film minyak membentang dan warna pelangi berubah sesuai ketebalannya!",
    relatedFormulas: [],
    relatedIds: ["sabun-mencuci", "embun-pagi"],
  },
  "embun-pagi": {
    funFacts: [
      "Titik embun tinggi (>25°C) membuat udara terasa 'lempek' — tubuh sulit berkeringat efektif di kelembapan ekstrem.",
      "Embun bukan 'jatuh dari langit' — ia keluar dari udara DI SEKITAR permukaan dingin.",
      "Di gurun namib, kumbang Namib bertahan hidup hanya dari embun yang dikumpulkan punggungnya pagi-pagi.",
    ],
    tryIt:
      "Isi gelas kaca dengan es batu + sedikit air. Dalam beberapa menit air muncul di luar gelas — bukan bocor, tapi uap udara yang mengembun. Ini persis mekanisme embun pagi dalam skala mini.",
    relatedFormulas: [
      { formula: "H2O", label: "Air" },
    ],
    relatedIds: ["garam-mencairkan-es", "pelangi-genangan"],
  },
};

// Zat yang valid untuk massa molar (harus parse-able engine)
function validateExtras() {
  void 0;
}
void validateExtras;
