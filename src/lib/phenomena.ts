// Everyday Chemistry — database fenomena kimia sehari-hari

export type Category = "Redoks" | "Asam–Basa" | "Biokimia" | "Larutan & Campuran" | "Termokimia" | "Fisika-Kimia";

export interface Phenomenon {
  id: string;
  emoji: string;
  title: string;
  category: Category;
  question: string;
  summary: string;
  explanation: string[];
  reaction?: string;
  concepts: string[];
}

export const CATEGORIES: Category[] = ["Redoks", "Asam–Basa", "Biokimia", "Larutan & Campuran", "Termokimia"];

export const PHENOMENA: Phenomenon[] = [
  {
    id: "besi-berkarat",
    emoji: "⛓️",
    title: "Mengapa besi berkarat?",
    category: "Redoks",
    question: "Kenapa pagar besi yang lama terkenal hujan jadi merah-oranye dan rapuh?",
    summary:
      "Besi bereaksi dengan oksigen dan air membentuk besi(III) oksida terhidrat — itulah karat. Proses ini disebut korosi, reaksi redoks yang merusak logam secara bertahap.",
    explanation: [
      "Di hadapan air, besi melepas elektron (teroksidasi): Fe → Fe²⁺ + 2e⁻.",
      "Oksigen dari udara menerima elektron itu (tereduksi) dan bereaksi membentuk ion hidroksida.",
      "Fe²⁺ kemudian teroksidasi lanjut menjadi Fe³⁺, yang bergabung dengan oksigen dan air membentuk Fe₂O₃·nH₂O — padatan berpori berwarna cokelat kemerahan.",
      "Karena karat berpori dan tidak melekat kuat, lapisan di bawahnya terus terkorosi sehingga besi perlahan habis. Itulah kenapa cat atau galvanisasi (lapisan seng) penting sebagai pelindung.",
    ],
    reaction: "4Fe + 3O₂ + 2nH₂O → 2Fe₂O₃·nH₂O",
    concepts: ["Reaksi redoks", "Korosi", "Elektrokimia"],
  },
  {
    id: "minyak-air",
    emoji: "🥗",
    title: "Mengapa minyak dan air tidak bercampur?",
    category: "Larutan & Campuran",
    question: "Saus salad selalu terpisah dua lapis — kenapa ya?",
    summary:
      "Air adalah molekul polar, sedangkan minyak nonpolar. Prinsip 'yang serupa melarutkan yang serupa' membuat keduanya saling menolak dan membentuk lapisan terpisah.",
    explanation: [
      "Molekul air punya ujung bermuatan (polar) dan membentuk ikatan hidrogen yang kuat satu sama lain.",
      "Molekul minyak netral dan nonpolar — tidak bisa membentuk ikatan hidrogen dengan air.",
      "Mencampur keduanya memaksa molekul air meninggalkan jaringan ikatan hidrogennya yang stabil, dan ini tidak menguntungkan secara energi. Jadi minyak dikumpulkan sendiri — muncullah dua lapis.",
      "Emulgator seperti kuning telur (lesitin) punya kepala polar dan ekor nonpolar, sehingga menjembatani keduanya — itulah rahasia mayones yang stabil.",
    ],
    concepts: ["Polaritas", "Ikatan hidrogen", "Kelarutan", "Emulsi"],
  },
  {
    id: "telur-dipanaskan",
    emoji: "🍳",
    title: "Mengapa telur mengental saat digoreng?",
    category: "Biokimia",
    question: "Putih telur bening cair berubah jadi putih padat — apa yang terjadi?",
    summary:
      "Panas merusak struktur protein telur (denaturasi), lalu protein-protein itu saling menaut membentuk jaringan padat (koagulasi). Perubahan ini permanen dan tidak bisa dibalik.",
    explanation: [
      "Protein telur (ovalbumin dll.) awalnya terlipat rapi dan larut dalam air, ditopang oleh ikatan lemah antarmolekul.",
      "Suhu tinggi menggetarkan molekul sampai ikatan lemah itu patah — protein terurai menjadi untaian panjang. Inilah denaturasi.",
      "Untaian yang terurai bertemu satu sama lain dan membentuk ikatan baru, membangun jala-jala yang menahan air — telur memadat.",
      "Karena ikatan barunya berbeda dari semula, telur matang tidak bisa kembali cair. Denaturasi juga terjadi oleh asam — itulah cara kerja acar ikan dan ceviche yang 'memasak' ikan tanpa api.",
    ],
    concepts: ["Denaturasi protein", "Koagulasi", "Struktur molekul"],
  },
  {
    id: "apel-menghitam",
    emoji: "🍎",
    title: "Mengapa apel menghitam setelah dipotong?",
    category: "Biokimia",
    question: "Potongan apel dibiarkan sebentar kok jadi cokelat?",
    summary:
      "Enzim polifenol oksidase dalam apel bereaksi dengan oksigen udara menghasilkan pigmen melanin berwarna cokelat — reaksi pencoklatan enzimatik.",
    explanation: [
      "Saat buah dipotong, sel-sel rusak dan campur: enzim polifenol oksidase bertemu polifenol dan oksigen udara sekaligus.",
      "Reaksi oksidasi mengubah polifenol menjadi kuinon, yang lalu bergabung menjadi melanin — pigmen gelap yang juga ada pada kulit manusia.",
      "Peras jeruk nipis mencegahnya: asam menurunkan pH sehingga enzim melambat, dan vitamin C teroksidasi lebih dulu sebagai pengorbanan.",
      "Fenomena yang sama terjadi pada kentang, pisang, dan alpukat.",
    ],
    concepts: ["Enzim", "Oksidasi", "Antioksidan"],
  },
  {
    id: "api-menyala",
    emoji: "🔥",
    title: "Apa yang sebenarnya terjadi saat api menyala?",
    category: "Termokimia",
    question: "Kayu dingin kok bisa berubah jadi nyari dan abu?",
    summary:
      "Api adalah pembakaran cepat: reaksi bahan bakar dengan oksigen yang melepas energi sebagai panas dan cahaya. Ini reaksi eksotermik yang mempertahankan dirinya sendiri.",
    explanation: [
      "Selulosa dalam kayu terurai oleh panas menjadi gas mudah terbakar.",
      "Gas-gas itu bereaksi dengan oksigen membentuk CO₂ dan H₂O sambil melepas energi — jumlah energi ikatan produk lebih rendah daripada reaktan, sisanya keluar sebagai panas dan cahaya.",
      "Energi yang dilepas cukup untuk menghangatkan kayu berikutnya — reaksi jadi berantai (itulah kenapa api 'menjalar').",
      "Trik segitiga api: hapus salah satu dari bahan bakar, oksigen, atau panas — api padam. Air memadamkan api dengan menyerap panas (uap), bukan sekadar 'membasahi'.",
    ],
    reaction: "C₆H₁₀O₅ (selulosa) + 6O₂ → 6CO₂ + 5H₂O + energi",
    concepts: ["Reaksi eksotermik", "Pembakaran", "Energi aktivasi"],
  },
  {
    id: "fotosintesis",
    emoji: "🌿",
    title: "Bagaimana daun mengubah cahaya jadi makanan?",
    category: "Biokimia",
    question: "Pohon hanya butuh air, udara, dan sinar matahari untuk tumbuh besar?",
    summary:
      "Fotosintesis mengubah CO₂ dan H₂O menjadi glukosa menggunakan energi cahaya, dengan klorofil sebagai penangkap energi. Oksigen adalah 'limbah' yang menyelamatkan hidup kita.",
    explanation: [
      "Klorofil di kloroplas menangkap foton cahaya dan memicunya elektron berenergi tinggi.",
      "Energi itu digunakan untuk memecah air (fotolisis), melepas O₂ sebagai hasil sampingan.",
      "Dalam siklus Calvin, CO₂ dari udara direkonstruksi atom demi atom menjadi glukosa — sebuah gula penyimpan energi.",
      "Massa pohon raksasa sebagian besar datang dari udara! Atom karbon tubuhnya berasal dari CO₂, bukan dari tanah.",
    ],
    reaction: "6CO₂ + 6H₂O + cahaya → C₆H₁₂O₆ + 6O₂",
    concepts: ["Reaksi endotermik", "Energi cahaya", "Siklus karbon"],
  },
  {
    id: "pernapasan-sel",
    emoji: "🫁",
    title: "Ke mana energi nasi pergi setelah kita makan?",
    category: "Biokimia",
    question: "Kenapa badan hangat setelah makan dan kenapa kita mengeluarkan CO₂?",
    summary:
      "Respirasi seluler adalah kebalikan fotosintesis: glukosa dibakar perlahan dengan oksigen menjadi ATP — mata uang energi sel — plus CO₂ dan H₂O.",
    explanation: [
      "Karbohidrat dicerna menjadi glukosa dan masuk ke darah.",
      "Di mitokondria, glukosa dioksidasi bertahap (glikolisis → siklus Krebs → rantai transpor elektron), menyimpan energinya ke dalam ±30–32 ATP.",
      "Berbeda dari api, pembakaran biologis ini terjadi bertahap pada suhu 37°C — energi tidak terbuang sebagai nyala, tapi ditampung di ikatan fosfat ATP.",
      "CO₂ yang kamu hembuskan benar-benar berasal dari makanan yang kamu makan — berat badan yang turun sebagian besar keluar lewat napas!",
    ],
    reaction: "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ±30 ATP",
    concepts: ["Metabolisme", "ATP", "Oksidasi terkendali"],
  },
  {
    id: "garam-mencairkan-es",
    emoji: "🧊",
    title: "Mengapa garam melelehkan es di jalan?",
    category: "Larutan & Campuran",
    question: "Taburan garam di jalan beku bikin es mencair walau suhu masih di bawah nol?",
    summary:
      "Zat terlarut menurunkan titik beku air (depresi titik beku). Ion-ion NaCl mengganggu pembentukan kristal es, jadi air tetap cair meski di bawah 0°C.",
    explanation: [
      "Es terbentuk saat molekul air tersusun rapi menjadi kristal heksagonal.",
      "Ion Na⁺ dan Cl⁻ yang berkeliling menabrak permukaan kristal yang sedang tumbuh, mengacaukan penyusunan.",
      "Akibatnya air harus lebih dingin lagi untuk bisa membeku — titik bekunya turun. Larutan jenuh NaCl bisa tetap cair hingga −21°C.",
      "Prinsip yang sama dipakai pembuat es tradisional (es + garam = campuran super-dingin) dan alasan radiator mobil pakai coolant, bukan air murni.",
    ],
    concepts: ["Colligative properties", "Depresi titik beku", "Larutan"],
  },
  {
    id: "soda-berbusa",
    emoji: "🥤",
    title: "Dari mana gelembung soda berasal?",
    category: "Larutan & Campuran",
    question: "Kenapa soda mendesis saat dibuka dan makin cepat hilang gelebarnya kalau hangat?",
    summary:
      "Gelembung soda adalah CO₂ yang dipaksa larut dalam air di bawah tekanan tinggi. Saat tutup dibuka, tekanan turun dan gas buron — kelarutan gas memang turun saat suhu naik.",
    explanation: [
      "Pabrik melarutkan CO₂ ke dalam minuman di bawah tekanan beberapa atmosfer (hukum Henry: kelarutan gas ∝ tekanannya).",
      "Membuka botol = melepas tekanan → kelarutan CO₂ jatuh drastis → gas keluar dalam bentuk gelembung.",
      "Gelembungan biasanya lahir dari 'titik nukleasi' — goresan di gelas, serbuk halus, atau tepi es batu.",
      "Suhu naik membuat molekul gas makin lincah dan mudah lolos — soda yang hangat kehilangan keselederannya jauh lebih cepat.",
    ],
    concepts: ["Hukum Henry", "Kelarutan gas", "Tekanan"],
  },
  {
    id: "baking-soda-cuka",
    emoji: "🌋",
    title: "Kenapa baking soda + cuka meletup-letup?",
    category: "Asam–Basa",
    question: "Campuran dapur yang jadi gunung berapi mini di proyek sekolah — reaksinya apa?",
    summary:
      "Asam asetat (cuka) bereaksi dengan natrium bikarbonat menghasilkan CO₂ gas — tekanan gas itulah yang menciptakan letusan busa.",
    explanation: [
      "Bikarbonat (HCO₃⁻) adalah basa; asetat dari cuka adalah asam. Keduanya langsung bereaksi pertemuan pertama.",
      "Hasil reaksi: garam natrium asetat, air, dan CO₂ yang keluar sebagai ribuan gelembung busa.",
      "Semakin pekat cuka dan semakin banyak baking soda, semakin banyak CO₂ dihasilkan — sampai salah satu habis.",
      "Reaksi asam–basa yang sama dimanfaatkan kue: CO₂ dari baking soda membuat adonan mengembang.",
    ],
    reaction: "CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂↑",
    concepts: ["Reaksi asam–basa", "Netralisasi", "Produksi gas"],
  },
  {
    id: "sabun-mencuci",
    emoji: "🧼",
    title: "Bagaimana sabun mengangkat lemak?",
    category: "Larutan & Campuran",
    question: "Air saja tak bisa membersihkan piring berminyak — kenapa sabun bisa?",
    summary:
      "Molekul sabun punya dua wajah: kepala yang suka air (hidrofilik) dan ekor yang suka minyak (hidrofobik). Ia menjembatani keduanya sehingga lemak bisa dibilas air.",
    explanation: [
      "Lemak dan oli nonpolar — tidak mau berpisah dari piring hanya karena dibilang air.",
      "Ekor hidrofobik sabun menusuk ke dalam tetes lemak, sementara kepala hidrofilik menghadap keluar ke air.",
      "Tetes lemak jadi terbungkus kerabat air (misel) dan bisa terangkat serta terbawa aliran air.",
      "Sabun juga menurunkan tegangan permukaan air sehingga air lebih mudah merambat masuk celah kain dan pori-pori.",
    ],
    concepts: ["Surfaktan", "Misel", "Amfifilik"],
  },
  {
    id: "yoghurt",
    emoji: "🥛",
    title: "Bagaimana susu berubah jadi yoghurt?",
    category: "Biokimia",
    question: "Susu cair bagaimana bisa jadi semi-padat asam segar?",
    summary:
      "Bakteri Lactobacillus mengubah laktosa menjadi asam laktat. pH yang turun membuat protein susu (kasein) menggumpal — proses koagulasi oleh asam.",
    explanation: [
      "Bakteri starter mencerna laktosa (gula susu) melalui fermentasi, menghasilkan asam laktat.",
      "pH turun dari ~6,7 menuju ~4,5 — mendekati titik isoelektrik kasein.",
      "Pada pH itu muatan permukaan kasein lenyap; micel-nya tak saling tolak lagi dan menggumpal menjadi kurd — tekstur yoghurt yang kental.",
      "Asam juga mengawetkan: bakteri pembusuk tak betah di lingkungan asam. Fermentasi adalah teknologi pengawetan tertua dunia.",
    ],
    reaction: "C₁₂H₂₂O₁₁ (laktosa) + H₂O → 4 CH₃CHOHCOOH (asam laktat)",
    concepts: ["Fermentasi", "pH & protein", "Titik isoelektrik"],
  },
  {
    id: "minyak-tengik",
    emoji: "🍟",
    title: "Mengapa minyak goreng menjadi tengik?",
    category: "Redoks",
    question: "Minyak yang disimpan lama kok baunya berubah apek?",
    summary:
      "Lemak tak jenuh dalam minyak bereaksi dengan oksigen udara (auto-oksidasi) menghasilkan senyawa pendek bau tengik. Panas, cahaya, dan logam mempercepatnya.",
    explanation: [
      "Rantai asam lemak tak jenaht memiliki ikatan rangkap yang rentan diserang radikal bebas dari oksigen.",
      "Terbentuklah hidroperoksida yang tidak stabil, lalu pecah menjadi aldehida dan keton bervolatile — sumber bau tengik.",
      "Proses berantai radikal ini makin cepat di tempat terang, dekat kompor panas, atau dalam wadah logam.",
      "Antioksidan (vitamin E dalam minyak zaitun) menyita radikal dan memperlambat kerusakan — prinsip yang sama dengan antioksidan dalam tubuh kita.",
    ],
    concepts: ["Radikal bebas", "Auto-oksidasi", "Antioksidan"],
  },
  {
    id: "perak-menghitam",
    emoji: "🥈",
    title: "Mengapa perak menghitam?",
    category: "Redoks",
    question: "Gelang perak yang jarang dipakai kok jadi kehitaman?",
    summary:
      "Perak bereaksi dengan sulfur di udara (terutama dari polusi dan telur!) membentuk lapisan perak sulfida gelap — proses tarnishing.",
    explanation: [
      "Udara mengandung jejak gas H₂S dari polusi, vulkan, dan bahan organik membusuk.",
      "Ag bereaksi lambat dengan sulfur membentuk Ag₂S — lapisan hitam tipis di permukaan.",
      "Telur sangat kaya sulfur — itulah kenapa sendok perak cepat hitam dipakai makan telur.",
      "Ag₂S bisa dibalik tanpa digosok habis: taruh perak di atas foil aluminium dalam air soda — aluminium yang 'berkorban' teroksidasi dan mengembalikan peraknya.",
    ],
    reaction: "4Ag + 2H₂S + O₂ → 2Ag₂S + 2H₂O",
    concepts: ["Korosi", "Reaksi dengan sulfur", "Redoks terbalik"],
  },
  {
    id: "patung-perunggu-hijau",
    emoji: "🗿",
    title: "Mengapa patung perunggu berwarna hijau?",
    category: "Redoks",
    question: "Patung logam kuning-kemerahan kok bisa jadi hijau tua setelah puluhan tahun?",
    summary:
      "Tembaga bereaksi lambat dengan oksigen, CO₂, dan air hujan membentuk malachite — karbonat tembaga hijau. Lapisan ini disebut patina dan justru melindungi logam di dalamnya.",
    explanation: [
      "Langkah pertama: tembaga teroksidasi udara menjadi Cu₂O merah dan CuO hitam.",
      "CO₂ terlarut dalam hujan (asam karbonat lemah) bereaksi dengan tembaga oksida membentuk Cu₂(OH)₂CO₃ hijau.",
      "Di kota pesisir, klorida dari laut menghasilkan warna biru kehijauan atacamite — patina tiap kota punya 'warna khas'.",
      "Bedanya dengan karat besi: patina rapat dan menempel kuat, jadi melindungi logam di baliknya. Patung Liberty sudah 130+ tahun 'berkarat' namun tetap utuh.",
    ],
    reaction: "2Cu + H₂O + CO₂ + O₂ → Cu₂(OH)₂CO₃",
    concepts: ["Korosi pelindung", "Patina", "Reaksi dengan udara"],
  },
  {
    id: "bau-keringat",
    emoji: "👟",
    title: "Dari mana bau kaki berasal?",
    category: "Biokimia",
    question: "Keringat sebenarnya tak berbau — lalu bau apa yang kita cium di sepatu?",
    summary:
      "Bakteri di kulit mencerna keringat dan sel kulit mati, membuang asam lemak volatile seperti asam isovalerat — inilah bau khas keringat dan kaki.",
    explanation: [
      "Keringat dari kelenjar ekrin hampir tak berbau: garam, air, dan sedikit urea.",
      "Tapi kaki punya 250.000+ kelenjar keringat per pasang sepatu — lingkungan hangat-lembap ideal bagi bakteri Staphylococcus epidermidis dan Bacillus subtilis.",
      "Bakteri mencerna zat-zat di keringat dan membuang asam isovalerat dan propionat — senyawa bau tajam.",
      "Solusinya bukan cuma menghilangkan bakteri, tapi memutus kelembapan: kaus kaki katun dan sepatu kering mengubah habitat bakteri.",
    ],
    concepts: ["Metabolisme bakteri", "Asam karboksilat", "Senyawa volatile"],
  },
  {
    id: "pemutih-pakaian",
    emoji: "👕",
    title: "Bagaimana pemutih menghapus noda?",
    category: "Redoks",
    question: "Cairan pemutih kok bisa bikin noda kopi dan jus menghilang?",
    summary:
      "Pemutih mengandung hipoklorit — oksidator kuat yang merusak ikatan kromofor (bagian molekul penyerap cahaya) pada noda, sehingga noda jadi tak berwarna.",
    explanation: [
      "Warna berasal dari kromofor: gugus atom yang menyerap cahaya tampak dan memantulkan sisanya.",
      "NaClO (hipoklorit) mengoksidasi ikatan rangkap pada kromofor sampai strukturnya runtuh — molekul noda tetap ada tapi tak lagi berwarna.",
      "Itulah bedanya memutihkan vs membersihkan: noda tak 'hilang', ia jadi transparan.",
      "Karena sama-sama menyerang kromofor, pemutih juga memudarkan pewarna kain — hati-hati dengan pakaian berwarna. Dan jangan pernah dicampur cuka/asam: akan melepaskan gas klorin beracun.",
    ],
    concepts: ["Kromofor", "Oksidator kuat", "Kimia warna"],
  },
  {
    id: "kunang-kunang",
    emoji: "✨",
    title: "Bagaimana kunang-kunang menyala?",
    category: "Biokimia",
    question: "Hewan kecil ini menghasilkan cahaya tanpa panas — bagaimana caranya?",
    summary:
      "Luciferin bereaksi dengan oksigen dibantu enzim luciferase dan ATP, melepas energi sebagai cahaya hijau-kuning. Ini bioluminesensi — pembakaran yang hampir tanpa panas.",
    explanation: [
      "Kunang-kunang menyimpan luciferin, oksigen, ATP, dan enzim luciferase dalam organ lampunya.",
      "Saat otaknya mengirim sinyal, luciferase menggabungkan luciferin dengan oksigen — molekul jadi berenergi tinggi lalu melepas energinya sebagai foton.",
      "Efisiensinya fantastis: hampir 100% energi jadi cahaya (bandingkan bohlam pijar yang 90% energi terbuang jadi panas). Cahayanya 'dingin'.",
      "Setiap spesies punya pola kedip khas — bahasa cahaya untuk menarik pasangan dan mengecoh predator.",
    ],
    concepts: ["Bioluminesensi", "Enzim", "Konversi energi"],
  },
  {
    id: "kerak-ketel",
    emoji: "🫖",
    title: "Dari mana kerak putih di ketel berasal?",
    category: "Larutan & Campuran",
    question: "Ketel yang sering dipakai kok berkerak putih keras di dasarnya?",
    summary:
      "Air tanah mengandung kalsium bikarbonat terlarut. Dipanaskan, ia terurai menjadi kalsium karbonat yang tidak larut — mengendap sebagai kerak (scale).",
    explanation: [
      "Hujan yang meresap ke tanah menyerap CO₂ menjadi asam lemah yang melarutkan batu kapur — membawa Ca(HCO₃)₂ dalam air.",
      "Saat dipanaskan, bikarbonat terurai: kalsium karbonat (CaCO₃) tak larut dan mengendap di dasar ketel.",
      "Daerah dengan air 'keras' (banyak mineral) menghasilkan kerak jauh lebih cepat — itulah kenapa air keran di beberapa kota terasa licin di tangan.",
      "Cara membersihkannya elegan: tuangkan cuka. Asam asetat melarutkan CaCO₃ kembali menjadi garam yang larut — kerak berdesis dan hilang.",
    ],
    reaction: "Ca(HCO₃)₂ →(Δ) CaCO₃↓ + H₂O + CO₂↑ ; lalu CaCO₃ + 2CH₃COOH → Ca(CH₃COO)₂ + H₂O + CO₂↑",
    concepts: ["Kesadahan air", "Kelarutan vs suhu", "Netralisasi"],
  },
  {
    id: "roti-mengembang",
    emoji: "🍞",
    title: "Bagaimana roti bisa mengembang?",
    category: "Biokimia",
    question: "Adonan yang pipih kok bisa jadi empuk dan berongga setelah dipanggang?",
    summary:
      "Ragi (Saccharomyces cerevisiae) berfermentasi gula dalam adonan, mengeluarkan CO₂. Gelembung gas itu terjebak jaringan gluten — roti mengembang.",
    explanation: [
      "Ragi mencerna gula dalam tepung melalui fermentasi alkoholik: menghasilkan etanol dan CO₂.",
      "CO₂ terperangkap dalam jala gluten (protein tepung yang elastis) — adonan mengembang seperti balon berlapis-lapis.",
      "Di oven, panas mempercepat produksi gas ('oven spring'), lalu alkohol menguap dan gluten memadat — struktur roti terkunci.",
      "Rongga-rongga itulah yang membuat roti ringan. Tanpa ragi, kita dapat roti pipih keras seperti tortilla.",
    ],
    reaction: "C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂↑",
    concepts: ["Fermentasi", "Gluten", "Reaksi biologi di dapur"],
  },
  {
    id: "hortensia-warna",
    emoji: "🌸",
    title: "Mengapa bunga hortensia bisa biru atau merah muda?",
    category: "Asam–Basa",
    question: "Bunga yang sama di tanah berbeda bisa berubah warna — seperti indikator hidup?",
    summary:
      "Warna hortensia dikendalikan pH tanah: tanah asam membuat aluminium larut dan diserap bunga → biru. Tanah basa mengunci aluminium → merah muda. Indikator pH alami raksasa.",
    explanation: [
      "Pigmen bunga ini adalah delphinidin, anggota antosianin — kelompok pigmen yang warnanya sensitif terhadap pH (sama seperti indikator lakmus).",
      "Di tanah pH < 5,5, ion Al³⁺ larut dan terserap akar; kompleks Al-delphinidin tampak biru.",
      "Di tanah basa, aluminium terikat tak larut; pigmen berdiri sendiri dan tampak merah muda.",
      "Tukang kebun mengeksploitasi ini: tambahkan belerang (menjadi asam) untuk bunga biru, atau kapur (basa) untuk merah muda.",
    ],
    concepts: ["Indikator pH", "Antosianin", "Kelarutan logam"],
  },
  {
    id: "pelangi-genangan",
    emoji: "🌈",
    title: "Mengapa ada pelangi warna di genangan bensin?",
    category: "Fisika-Kimia",
    question: "Genangan oli di jalan berkilau pelangi — dari mana warnanya?",
    summary:
      "Film tipis oli di atas air memantulkan cahaya dari dua permukaan. Interferensi antar pantulan membuat panjang gelombang tertentu saling menguatkan — muncullah warna pelangi yang berubah dengan sudut pandang.",
    explanation: [
      "Sebagian cahaya memantul di permukaan atas film oli, sebagian menembus lalu memantul di batas oli–air.",
      "Kedua pantulan bertemu kembali di mata kita dengan selisih lintasan yang bergantung pada ketebalan film.",
      "Jika selisihnya cocok dengan panjang gelombang merah, merah menguat; jika cocok dengan biru, biru menguat — tiap ketebalan menghasilkan warna berbeda.",
      "Karena film oli tak pernah rata, warna bergerigi muncul seperti peta kontur. Fenomena yang sama membuat gelembung sabun berwarna-warni.",
    ],
    concepts: ["Interferensi film tipis", "Panjang gelombang", "Optika"],
  },
  {
    id: "embun-pagi",
    emoji: "💧",
    title: "Dari mana embun pagi berasal?",
    category: "Termokimia",
    question: "Tanpa hujan sekalipun, rumput basah di pagi hari — dari mana airnya?",
    summary:
      "Uap air di udara mengembun saat permukaan dingin. Titik embun adalah suhu saat udara jenuh — di bawahnya, uap tak tersembunyi lagi dan menjadi cairan.",
    explanation: [
      "Udara selalu membawa uap air; makin hangat udara, makin banyak uap yang bisa ia 'sembunyikan' (kapasitas uap naik eksponensial).",
      "Malam hari, rumput dan atap memancarkan panas ke langit dan mendingin lebih cepat dari udara.",
      "Saat permukaannya turun di bawah titik embun, molekul air di dekatnya kehabisan energi untuk tetap menjadi gas — mereka berkumpul jadi titik-titik embun.",
      "Kalau permukaannya di bawah 0°C, uap langsung menyublim jadi kristal es: embun es. Proses kondensasi yang sama mengisi gelas es manis di siang hari.",
    ],
    concepts: ["Titik embun", "Kondensasi", "Perubahan wujud"],
  },
];
