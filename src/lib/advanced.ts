// Penjelasan tingkat lanjut (kuliah) per fenomena — melengkapi explanation dasar (SMA).
// Format: pasangan [judul, isi]. Kosong = belum tersedia → UI menyembunyikan toggle.

export const ADVANCED: Record<string, [string, string][]> = {
  "besi-berkarat": [
    ["Elektrokimia korosi", "Korosi adalah sel galvanik mikro. Anoda lokal: Fe → Fe²⁺ + 2e⁻ (E° = −0,44 V). Katoda lokal: O₂ + 2H₂O + 4e⁻ → 4OH⁻ (E° = +0,40 V) di permukaan basah. Potensial sel +0,84 V menggerakkan reaksi spontan. Karena itu besi yang bersentuhan dengan logam lebih mulia (tembaga) berkarat lebih cepat — dan sebaliknya, magnesium dipasang sebagai anoda pengorbanan pada kapal dan pemanas air."],
    ["Termodinamika & laju", "ΔG° reaksi karat sangat negatif (spontan), tetapi lajunya dibatasi difusi O₂ melalui lapisan karat berpori. Persamaan laju parabolik/linear bergantung kelembapan. Faktor kritis: aktivitas air, pH, dan konsentrasi klorida yang menembus lapisan pasif."],
  ],
  "minyak-air": [
    ["Energi bebas Gibbs", "Ketidaklarutan minyak bukan 'mustahil' secara energi, tetapi ΔG pencampuran > 0 karena entropi justru menurun: mencampur memaksa molekul air memutus ikatan hidrogen tanpa kompensasi interaksi baru yang menguntungkan. ΔH positif dominan atas TΔS."],
    ["Parameter HLB", "Efisiensi emulgator diukur dengan Hydrophilic-Lipophilic Balance (0–20). Lesitin HLB ≈ 9–10 cocok untuk emulsi minyak-dalam-air. Formulator kosmetik dan farmasi merancang emulsi lewat pemilihan HLB campuran surfaktan."],
  ],
  "telur-dipanaskan": [
    ["Struktur protein ovalbumin", "Ovalbumin (385 asam amino) distabilkan ikatan hidrogen, interaksi hidrofobik, dan jembatan disulfida. Denaturasi termal membuka struktur tersier-sekunder; residu hidrofobik yang tadinya tersembunyi terekspos dan saling agregasi via ikatan hidrofobik + disulfida interchange → gel jaringan tiga dimensi."],
    ["Kineta denaturasi", "Laju denaturasi mengikuti Arrhenius dengan Ea tinggi (~300 kJ/mol), sehingga perbedaan beberapa derajat sangat sensitif: pada 65°C ovalbumin setengah terdenaturasi dalam hitungan menit; pada 80°C dalam detik. Prinsip sous-vide memanfaatkan presisi ini."],
  ],
  fotosintesis: [
    ["Reaksi terang & siklus Calvin", "Fotosistem II (P680) dan I (P700) bekerja seri (skema Z): fotolisis air melepas elektron ke rantai transpor, memompa proton ke lumen tilakoid, dan ATP sintase menyusun ATP via kemiosmosis. Siklus Calvin (ruang stroma) memfiksasi CO₂ oleh enzim RuBisCO menjadi 3-PGA lalu G3P menggunakan NADPH+ATP."],
    ["Fotorespirasi", "RuBisCO tidak spesifik: ~25% reaksi mengoksidasi RuBP alih-alih karboksilasi, membuang energi. Adaptasi C4 (jagung) dan CAM (kaktus) berkembang untuk memusatkan CO₂/menghemat air — contoh evolusi mengompromi inefisiensi enzim kunci."],
  ],
  "pernapasan-sel": [
    ["Stokiometri ATP", "Glukosa → 2 ATP (glikolisis sitoplasma) + 2 ATP (siklus Krebs) + ±26–28 ATP (oksidatif fosforilasi). Rendemen teoretis 30–32 ATP; rendemen nyata ~29 karena kebocoran proton (uncoupling). Perbandingan P/O modern: 2,5 ATP/NADH dan 1,5 ATP/FADH₂."],
    ["Regulasi allosterik", "PFK-1 adalah titik kontrol glikolisis: dihambat ATP dan sitrat, diaktivasi AMP — sel menyetel laju pembakaran sesuai kebutuhan energi real-time, berbeda dari api yang tak terkendali."],
  ],
  "garam-mencairkan-es": [
    ["Persamaan depresi titik beku", "ΔTf = i · Kf · m. Untuk NaCl i ≈ 1,9 (bukan 2, karena ion pairing) dan Kf air = 1,86 °C·kg/mol. Larutan 1 molal NaCl menurunkan titik beku hingga ±3,5°C. Sifat koligatif bergantung jumlah partikel, bukan identitasnya — itulah kenapa gula juga bisa, hanya butuh dosis lebih banyak (i=1)."],
    ["Titik eutektik", "Sistem NaCl–H₂O punya eutektik pada −21,1°C (23,3% NaCl): komposisi di mana larutan dan es membeku bersamaan. CaCl₂·6H₂O turun hingga −51°C — makanya dipakai deicing dan cold pack."],
  ],
  "soda-berbusa": [
    ["Hukum Henry & konstanta", "c = kH · P dengan kH(CO₂) ≈ 3,3×10⁻² M/atm pada 25°C. Dalam botol bertekanan 2–4 atm, CO₂ terlarut puluhan kali lipat kondisi atmosfer. Saat tutup dibuka, tekanan parsial jatuh ke 0,0004 atm — kesetimbangan bergeser drastis keluar larutan."],
    ["Kimia karbonat", "CO₂ terlarut bereaksi berlapis: CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻ (pKa₁ ≈ 6,35). Soda bersifat asam lemah (pH ≈ 2,5–3,5 untuk cola) — rasa menyengat datang dari gabungan asam karbonat dan stimulasi trigeminal oleh gelembung."],
  ],
  "baking-soda-cuka": [
    ["Stokiometri gas", "CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂. Mol CO₂ = mol reaktan pembatas; pada 25°C, 1 atm, 1 gram NaHCO₃ (0,0119 mol) menghasilkan ±291 mL CO₂. Gunakan PV=nRT untuk menghitung letusan gunung soda ideal."],
    ["Termokimia dua arah", "Reaksi ini netralisasi lemah eksotermik secara entalpi netral, tetapi pelarutan NaHCO₃ endotermik (ΔHsoln = +16,7 kJ/mol) mendominasi — suhu campuran turun. Demonstrasi bagus bahwa 'bereaksi' ≠ 'menghasilkan panas'."],
  ],
  yoghurt: [
    ["Mikrobiologi fermentasi", "Lactobacillus delbrueckii subsp. bulgaricus (asidifikasi cepat) berkerja simbiosis dengan Streptococcus thermophilus (menghasilkan format yang merangsang Lactobacillus). Homolaktik: glukosa → 2 laktat via jalur Embden-Meyerhof, rendemen ~95%."],
    ["Kimia koloid kasein", "Misela kasein distabilkan κ-kasein 'bulu bercukur' dan kalsium fosfat. Asidifikasi melarutkan koloid kalsium fosfat dan mendeplet muatan κ-kasein sampai pH isoelektrik 4,6 — misela agregasi membentuk gel partikulat. Struktur gel menentukan tekstur set-stirred vs Greek-style."],
  ],
  "perak-menghitam": [
    ["Elektrokimia tarnishing", "Ag₂S sangat tak larut (Ksp ≈ 6×10⁻⁵¹) sehingga jejak sulfida pun cukup mengendapkan lapisan. Reaksi restorasi foil: Al → Al³⁺ + 3e⁻ (E° = −1,66 V) memindahkan sulfur kembali ke Ag⁺ + e⁻ → Ag (E° = +0,80 V); ΔE sel ≈ 2,46 V — sangat spontan."],
    ["Selektivitas anodik", "Aluminium 'berkorban' karena potensialnya jauh lebih negatif daripada perak — prinsip proteksi katodik yang sama dipakai pada anoda seng kapal laut dan pipa tanam."],
  ],
  "patung-perunggu-hijau": [
    ["Kimia patina", "Patina alami terdiri kuprit Cu₂O, tenorit CuO, brochantite Cu₄SO₄(OH)₆ (kota industri), dan atacamite Cu₂(OH)₃Cl (pesisir). Patina artifisial dipercepat dengan larutan ammonium klorida/kuprik — patung Liberty direstorasi dengan analisis elektrokimia lapisannya."],
    ["Pasivasi & diagram Pourbaix", "Diagram E-pH tembaga menunjukkan wilayah pasivitas (CuO/Cu₂OH stabil) antara wilayah korosi dan imunitas. Patina adalah pasivasi semestadari — lapisan barier yang meregenerasi sendiri bila tergores."],
  ],
  "bau-keringat": [
    ["Biokimia volatil", "Asam isovalerat (3-metilbutanoat) berasal dari katabolisme leusina oleh Staphylococcus epidermidis. Propionibakteria menghasilkan asam propionat (bau keju swiss). Ambang penciuman manusia untuk isovalerate ~0,001 ppm — salah satu senyawa paling tajam yang kita deteksi."],
    ["Ekologi kulit", "Mikrobioma ketiak didominasi Corynebacterium (bau kuat) vs Staphylococcus (bau lembut) — komposisi bakteri menjelaskan variasi bau antarperson lebih baik daripada jumlah keringat. Prebiotik deodorant menargetkan ekologi ini."],
  ],
  "pemutih-pakaian": [
    ["Kimia hipoklorit", "NaClO terhidrolisis: ClO⁻ + H₂O ⇌ HOCl + OH⁻. HOCl (asam hipoklorit) adalah oksidator aktif sekaligus biosid — efektif pH 5–8. Kromofor teroksidasi memutus sistem konjugasi π: bilangan ikatan rangkap yang menyatu turun, gap energinya naik melewati spektrum tampak → warna hilang."],
    ["Keamanan campuran", "Pemutih + asam: OCl⁻ + Cl⁻ + 2H⁺ → Cl₂(g) — gas klorin LC50 rendah, fatal di ruang tertutup. Pemutih + amonia → kloramin (NH₂Cl) juga toksik. Prinsip: oksidator kuat tidak boleh dicampur reduktor tanpa pengawasan."],
  ],
  "kunang-kunang": [
    ["Mekanisme luciferin", "Luciferin diadenilasi oleh luciferase (ATP → luciferyl-AMP), lalu dioksidasi menjadi dioxetanone yang terdekarbolilasi ke excited-state oxyluciferin. Emisi 560 nm (kuning-hijau). Efisiensi kuantum hampir 41% — fenomenal bagi reaksi kimia."],
    ["Aplikasi bioteknologi", "Gen luc (luciferase) jadi reporter gen standar: promotor yang diteliti digabung ke luc, cahaya = ekspresi gen, diukur luminometer tanpa membunuh sel. Firefly luciferase dipakai uji kebaruan obat anti-kanker dan deteksi ATP hidup/mati (ATP assay higienitas pabrik makanan)."],
  ],
  "kerak-ketel": [
    ["Kesadahan terukur", "Kesadahan total diekspresikan mg/L CaCO₃ ekuivalen: lunak <60, sedang 60–120, keras >180. Analisis EDTA kompleksometri menghitung Ca²⁺+Mg²⁺ via indikator Eriochrome Black T — praktikum kimia analitik klasik."],
    ["Termodinamika penguraian", "Ca(HCO₃)₂ → CaCO₃ + CO₂ + H₂O digerakkan pelepasan CO₂ saat dididihkan (kesetimbangan bergeser karena CO₂ keluar fase gas). Sebaliknya soda kertas (Na₂CO₃) 'melunakkan' air dengan presipitasi: Ca²⁺ + CO₃²⁻ → CaCO₃↓ — prinsip water softening industrial lime-soda process."],
  ],
  "roti-mengembang": [
    ["Biokimia ragi", "Saccharomyces cerevisiae fermentasi alkoholik: glukosa → 2 etanol + 2 CO₂ (neto +2 ATP via substrat-level). Regenerasi NAD⁺ memaksa reduksi asetaldehid — tanpa oksigen, ragi 'berutang' elektron ke etanol. Oven spring: ledakan laju fermentasi di 55–60°C sebelum ragi mati."],
    ["Reologi gluten", "Gliadin (viskos) + glutenin (elastik, ikatan disulfida) membentuk viscoelastic network. Pengulian mengembangkan jala (disulfide exchange); overmixing memutusnya. Air, garam, dan redoks (askorbik acid sebagai improver) memodulasi jala — ilmu material dalam dapur."],
  ],
  "hortensia-warna": [
    ["Kimia antosianin-Al", "Delphinidin-3-glukosida membentuk kompleks supramolekul metalloanthocyanin dengan Al³⁺ + flavonoid kofaktor (kopigmen) — pergeseran batrochromic ke biru. Stabilitas kompleks menjelaskan kenapa warna biru hortensia tidak pudar seperti antosianin bebas."],
    ["Biogeokimia aluminium", "Di pH tanah <5,5 Al³⁺ mobil (toksik bagi banyak tanaman!); hortensia toleran dan justru mengeksploitasi. Kapur pertanian mengpresipitasi Al(OH)₃ — prinsip manajemen pH tanah yang sama pentingnya di pertanian akidik tropika."],
  ],
  "pelangi-genangan": [
    ["Interferensi film tipis", "2nt cos θr = mλ (konstruktif) dengan n indeks bias oli ≈1,47. Cahaya pantulan permukaan atas (oli-udara, fasa flip jika n_naik) dan batas bawah (oli-air) berinterferensi. Pola kontur warna = peta topografi ketebalan dengan resolusi sub-mikrometer."],
    ["Aplikasi metrologi", "Prinsip identik dipakai newton's rings untuk menguji flatness lensa, coating anti-refleksi MgF₂ (λ/4 optical thickness), dan ellipsometry film semikonduktor nanometer-scale."],
  ],
  "embun-pagi": [
    ["Psikrometri", "Titik embun dihitung dari tekanan uap parsial via Magnus equation atau tabel psikrometrik. Indeks panas dan wet-bulb temperature — metrik kritis perubahan iklim — diturunkan dari relasi yang sama: uap air menentukan kemampuan tubuh mendinginkan diri."],
    ["Nukleasi embun", "Formasi tetesan butuh nukleasi heterogen pada permukaan (daun berbulu, debu). Sudut kontak dan energi permukaan menentukan apakah uap mengembun sebagai film atau tetesan — biomimetika permukaan superhydrophobic Namib beetle dirancang dari prinsip ini."],
  ],
};

void ADVANCED;
