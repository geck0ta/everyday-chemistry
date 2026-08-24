// Diagram SVG animasi — batch 2 (asam-basa, termokimia, redoks, biokimia)
// Layout disiplin: viewBox 320x120, label di posisi tetap yang aman, teks tidak menabrak elemen.
import type { ReactNode } from "react";

const C = {
  cuka: "#d9c27a", soda: "#e8e8ea", co2: "#9aa7bd", bubble: "#bfe3ff",
  fire: "#ff7a45", heat: "#ffb454", cold: "#7cc4e8",
  apple: "#c8d84a", brown: "#8a5a33",
  silver: "#aab4c4", dark: "#3a4150", h2s: "#b08cd9",
  copper: "#c97b4a", patina: "#4fae8a",
  oil: "#d9a441", rancid: "#8a5a33",
  leaf: "#3f9e63", sun: "#ffb454", o2: "#6aa5ff",
  bread: "#d9a441", yeast: "#e8d5a0", dough: "#f0deb0",
  milk: "#fdf6ec", yogurt: "#f5ead6", acidDrop: "#e05c7a",
  sweat: "#7cc4e8", bacteria: "#9d6fd6",
  bleach: "#7fd4ff", stain: "#7a4a2a", cloth: "#f5f0e8",
  soap: "#9d6fd6",
  flower: "#e07ab8", flowerBlue: "#7a8ce0", soil: "#8a6a4a",
  rainbow1: "#e05c7a", rainbow2: "#ffb454", rainbow3: "#34e0a1", rainbow4: "#5b8def",
  breath: "#4aa8bd", atp: "#ffd166", cell: "#88c9a8",
  dew: "#7cc4e8", night: "#2a3245",
};

// Label bawah standar — satu baris, center, y=116
function Caption({ text, color }: { text: string; color?: string }) {
  return (
    <text x="160" y="116" textAnchor="middle" fontSize="9"
      fill={color ?? "currentColor"} opacity="0.55" fontFamily="monospace">{text}</text>
  );
}

export function getDiagram(id: string): ReactNode | null {
  switch (id) {
    case "baking-soda-cuka": return <BakingSoda />;
    case "embun-pagi": return <Dew />;
    case "minyak-tengik": return <RancidOil />;
    case "apel-menghitam": return <AppleBrowning />;
    case "perak-menghitam": return <SilverTarnish />;
    case "patung-perunggu-hijau": return <CopperPatina />;
    case "garam-mencairkan-es": return <SaltIce />;
    case "soda-berbusa": return <SodaBubbles />;
    case "kerak-ketel": return <KettleScale />;
    case "sabun-mencuci": return <SoapMicelle />;
    case "fotosintesis": return <Photosynthesis />;
    case "roti-mengembang": return <BreadRise />;
    case "yoghurt": return <Yogurt />;
    case "bau-keringat": return <SweatBacteria />;
    case "kunang-kunang": return <Firefly />;
    case "pemutih-pakaian": return <Bleach />;
    case "hortensia-warna": return <Hydrangea />;
    case "pelangi-genangan": return <OilRainbow />;
    case "pernapasan-sel": return <CellRespiration />;
    default: return null;
  }
}

/* Baking soda + cuka */
function BakingSoda() {
  return (
    <svg viewBox="0 0 320 120" className="w-full" role="img" aria-label="Gelembung karbondioksida naik dari reaksi baking soda dan cuka">
      <path d="M110 30 L118 105 Q120 112 128 112 L192 112 Q200 112 202 105 L210 30" fill="none" stroke={C.cuka} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M115 55 L121 104 Q122.5 108 128 108 L192 108 Q197.5 108 199 104 L205 55 Z" fill={C.cuka} opacity="0.35" />
      <ellipse cx="160" cy="103" rx="14" ry="4" fill={C.soda} opacity="0.9">
        <animate attributeName="rx" values="14;10;14" dur="3s" repeatCount="indefinite" />
      </ellipse>
      {[135, 150, 165, 180, 158, 143].map((x, i) => (
        <circle key={i} cx={x} cy="100" r={2 + (i % 3)} fill={C.bubble}>
          <animate attributeName="cy" values="100;42" dur={`${1.2 + i * 0.25}s`} repeatCount="indefinite" begin={`${i * 0.35}s`} />
          <animate attributeName="opacity" values="0;1;1;0" dur={`${1.2 + i * 0.25}s`} repeatCount="indefinite" begin={`${i * 0.35}s`} />
        </circle>
      ))}
      <text x="66" y="50" fontSize="9" fill={C.cuka} fontFamily="monospace">cuka</text>
      <text x="216" y="100" fontSize="9" fill={C.soda} fontFamily="monospace">NaHCO₃</text>
      <text x="222" y="38" fontSize="9" fill={C.co2} fontFamily="monospace">CO₂ ↑</text>
      <Caption text="netralisasi asam-basa menghasilkan gas CO₂" />
    </svg>
  );
}

/* Embun pagi */
function Dew() {
  return (
    <svg viewBox="0 0 320 120" className="w-full" role="img" aria-label="Uap air mengembun menjadi titik embun di permukaan dingin">
      <rect x="20" y="14" width="280" height="92" rx="10" fill={C.night} opacity="0.35" />
      <circle cx="262" cy="36" r="12" fill="#e8edf7" opacity="0.85" />
      {/* rumput */}
      {[40, 65, 95, 125, 155, 185, 215].map((x, i) => (
        <path key={x} d={`M ${x} 106 q 3 -12 ${i % 2 ? 5 : -5} -18`} fill="none" stroke={C.leaf} strokeWidth="1.5" opacity="0.7" />
      ))}
      {/* uap turun */}
      {[50, 90, 130, 170, 210].map((x, i) => (
        <circle key={x} cx={x} cy={40 + (i % 2) * 12} r="2.5" fill={C.dew}>
          <animate attributeName="cy" values={`${36 + (i % 2) * 12};80`} dur={`${2 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
          <animate attributeName="opacity" values="0.4;0.4;0" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
        </circle>
      ))}
      {/* embun di ujung rumput */}
      {[42, 67, 97, 127, 157, 187, 217].map((x, i) => (
        <circle key={"d" + x} cx={x + (i % 2 ? 5 : -5)} cy={89} r="2" fill={C.dew}>
          <animate attributeName="opacity" values="0.4;1;0.4" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <Caption text="uap air → embun di permukaan dingin" color={C.dew} />
    </svg>
  );
}

/* Minyak tengik */
function RancidOil() {
  return (
    <svg viewBox="0 0 320 120" className="w-full" role="img" aria-label="Oksigen menyerang rantai lemak menghasilkan senyawa bau">
      {/* botol minyak */}
      <rect x="36" y="38" width="72" height="62" rx="8" fill={C.oil} opacity="0.3" stroke={C.oil} strokeWidth="1.5" />
      <rect x="60" y="26" width="24" height="13" rx="3" fill={C.oil} opacity="0.6" />
      <text x="72" y="114" textAnchor="middle" fontSize="8" fill={C.oil} fontFamily="monospace">minyak</text>
      {/* rantai lemak */}
      <polyline points="150,58 165,50 180,58 195,50 210,58" fill="none" stroke={C.rancid} strokeWidth="2.5" strokeLinecap="round" />
      <text x="178" y="76" textAnchor="middle" fontSize="8" fill={C.rancid} fontFamily="monospace">lemak tak jenuh</text>
      {/* O2 menyerang */}
      {[0, 1].map((i) => (
        <circle key={i} cx="228" cy={46 + i * 10} r="4" fill="#6aa5ff">
          <animate attributeName="cx" values="232;212" dur="2s" begin={`${i * 0.9}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0" dur="2s" begin={`${i * 0.9}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <text x="238" y="52" fontSize="8" fill="#6aa5ff" fontFamily="monospace">O₂</text>
      {/* senyawa bau menguap */}
      {[258, 276, 294].map((x, i) => (
        <path key={x} d={`M ${x} 46 q 4 -7 0 -13 q -4 -6 0 -11`} fill="none" stroke={C.rancid} strokeWidth="1.6" strokeLinecap="round">
          <animate attributeName="opacity" values="0;1;0" dur={`${1.8 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
          <animateTransform attributeName="transform" type="translate" values="0 8;0 -4" dur={`${1.8 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
        </path>
      ))}
      <text x="276" y="16" textAnchor="middle" fontSize="8" fill={C.rancid} fontFamily="monospace">bau tengik</text>
    </svg>
  );
}

/* Apel menghitam — DUA SETENGAH APEL SIMETRIS dari satu path yang dicerminkan */
function AppleBrowning() {
  // setengah apel identik dipakai dua kali via transform scale(-1,1)
  const halfApple = "M 0 -22 C -14 -22 -20 -10 -20 0 C -20 14 -10 22 0 22 L 0 -22";
  return (
    <svg viewBox="0 0 320 120" className="w-full" role="img" aria-label="Setengah apel segar dan setengah apel teroksidasi, keduanya simetris">
      {/* ===== APEL KIRI (segar) ===== */}
      <g transform="translate(78,56)">
        {/* setengah kiri */}
        <path d={halfApple} fill={C.apple} />
        {/* setengah kanan (mirror) */}
        <path d={halfApple} fill={C.apple} transform="scale(-1,1)" />
        {/* tangkai */}
        <rect x="-1.5" y="-28" width="3" height="8" rx="1.5" fill={C.brown} />
        {/* potongan datar di tengah (garis pemisah) */}
        <line x1="0" y1="-22" x2="0" y2="22" stroke={C.cloth} strokeWidth="1.5" opacity="0.7" />
      </g>
      <text x="78" y="98" textAnchor="middle" fontSize="8.5" fill={C.apple} fontFamily="monospace">baru dipotong</text>

      {/* ===== PANAH TENGAH ===== */}
      <g opacity="0.45">
        <line x1="132" y1="56" x2="176" y2="56" stroke="currentColor" strokeWidth="1.5" />
        <polygon points="176,51 186,56 176,61" fill="currentColor" />
      </g>
      {/* molekul O2 di atas panah */}
      {[140, 160].map((x, i) => (
        <circle key={x} cx={x} cy="38" r="3.5" fill="#6aa5ff">
          <animate attributeName="cy" values="34;48" dur="1.8s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0" dur="1.8s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <text x="159" y="28" textAnchor="middle" fontSize="8.5" fill="currentColor" opacity="0.55" fontFamily="monospace">+ O₂</text>

      {/* ===== APEL KANAN (teroksidasi) — posisi & ukuran sama persis ===== */}
      <g transform="translate(242,56)">
        <path d={halfApple} fill={C.brown}>
          <animate attributeName="fill" values={`${C.apple};${C.brown}`} dur="5s" repeatCount="indefinite" />
        </path>
        <path d={halfApple} fill={C.brown} transform="scale(-1,1)">
          <animate attributeName="fill" values={`${C.apple};${C.brown}`} dur="5s" repeatCount="indefinite" />
        </path>
        <rect x="-1.5" y="-28" width="3" height="8" rx="1.5" fill={C.brown} />
        <line x1="0" y1="-22" x2="0" y2="22" stroke={C.cloth} strokeWidth="1.5" opacity="0.7" />
      </g>
      <text x="242" y="98" textAnchor="middle" fontSize="8.5" fill={C.brown} fontFamily="monospace">teroksidasi</text>

      <Caption text="polifenol + O₂ → melanin cokelat" />
    </svg>
  );
}

/* Perak menghitam */
function SilverTarnish() {
  return (
    <svg viewBox="0 0 320 120" className="w-full" role="img" aria-label="Gas sulfur bereaksi dengan permukaan perak membentuk lapisan hitam">
      <ellipse cx="105" cy="62" rx="52" ry="30" fill="none" stroke={C.silver} strokeWidth="7" />
      <ellipse cx="105" cy="62" rx="52" ry="30" fill="none" stroke={C.dark} strokeWidth="7" strokeDasharray="200" strokeDashoffset="200" transform="rotate(-45 105 62)">
        <animate attributeName="stroke-dashoffset" values="200;0" dur="5s" repeatCount="indefinite" />
      </ellipse>
      {[0, 1, 2].map((i) => (
        <circle key={i} cx="230" cy={32 + i * 9} r="4" fill={C.h2s}>
          <animate attributeName="cx" values="235;164" dur={`${2.4 + i * 0.4}s`} begin={`${i * 0.7}s`} repeatCount="indefinite" />
          <animate attributeName="cy" values={`${34 + i * 9};${56 + i * 4}`} dur={`${2.4 + i * 0.4}s`} begin={`${i * 0.7}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;1;0" dur={`${2.4 + i * 0.4}s`} begin={`${i * 0.7}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <text x="240" y="28" fontSize="9" fill={C.h2s} fontFamily="monospace">H₂S</text>
      <Caption text="Ag + H₂S + O₂ → Ag₂S hitam" color={C.silver} />
    </svg>
  );
}

/* Patina tembaga */
function CopperPatina() {
  return (
    <svg viewBox="0 0 320 120" className="w-full" role="img" aria-label="Permukaan tembaga berubah dari oranye ke hijau patina">
      {/* hujan di atas */}
      {[120, 145, 170, 195, 220, 245, 270].map((x, i) => (
        <line key={x} x1={x} y1="16" x2={x} y2="22" stroke={C.dew} strokeWidth="1.8" strokeLinecap="round">
          <animate attributeName="y1" values="14;70" dur={`${1.3 + i * 0.2}s`} repeatCount="indefinite" begin={`${i * 0.3}s`} />
          <animate attributeName="y2" values="21;77" dur={`${1.3 + i * 0.2}s`} repeatCount="indefinite" begin={`${i * 0.3}s`} />
          <animate attributeName="opacity" values="0.8;0" dur={`${1.3 + i * 0.2}s`} repeatCount="indefinite" begin={`${i * 0.3}s`} />
        </line>
      ))}
      {/* patung tembaga */}
      <rect x="64" y="42" width="13" height="52" fill={C.copper}>
        <animate attributeName="fill" values={`${C.copper};${C.patina}`} dur="6s" repeatCount="indefinite" />
      </rect>
      <circle cx="70.5" cy="32" r="10" fill={C.copper}>
        <animate attributeName="fill" values={`${C.copper};${C.patina}`} dur="6s" repeatCount="indefinite" />
      </circle>
      <rect x="50" y="94" width="41" height="7" rx="2" fill={C.copper} opacity="0.8">
        <animate attributeName="fill" values={`${C.copper};${C.patina}`} dur="6s" repeatCount="indefinite" />
      </rect>
      {/* label */}
      <text x="70" y="116" textAnchor="middle" fontSize="8" fill={C.patina} fontFamily="monospace">Cu → patina</text>
      <text x="200" y="60" fontSize="9" fill={C.patina} fontFamily="monospace">hijau melindungi</text>
      <text x="200" y="74" fontSize="8" fill="currentColor" opacity="0.5" fontFamily="monospace">logam di baliknya</text>
    </svg>
  );
}

/* Garam melelehkan es */
function SaltIce() {
  return (
    <svg viewBox="0 0 320 120" className="w-full" role="img" aria-label="Ion garam mengganggu kristal es sehingga mencair">
      {/* es utuh kiri */}
      <g>
        {[0, 1, 2].map((r) => [0, 1, 2].map((cI) => (
          <circle key={`${r}${cI}`} cx={58 + cI * 18} cy={36 + r * 18} r="7" fill={C.cold} opacity="0.65" />
        )))}
        <text x="76" y="102" textAnchor="middle" fontSize="8" fill={C.cold} fontFamily="monospace">es murni</text>
      </g>
      {/* ion jatuh ke kanan */}
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={196 + i * 8} cy="18" r="3.5" fill={i % 2 ? "#e05c7a" : "#ffb454"}>
          <animate attributeName="cy" values="16;62" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" begin={`${i * 0.3}s`} />
        </circle>
      ))}
      <text x="212" y="12" fontSize="8" fill="#e05c7a" fontFamily="monospace">Na⁺</text>
      <text x="238" y="12" fontSize="8" fill="#ffb454" fontFamily="monospace">Cl⁻</text>
      {/* es kanan berantakan */}
      <g>
        {[0, 1, 2].map((r) => [0, 1, 2].map((cI) => (
          <circle key={`m${r}${cI}`} cx={218 + cI * 18} cy={36 + r * 18} r="7" fill={C.cold}>
            <animateTransform attributeName="transform" type="translate"
              values={`0 0; ${(cI - 1) * 6}, ${r * 5}; ${(1 - cI) * 5}, ${-r * 4}; 0 0`}
              dur={`${2 + (r + cI) * 0.4}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.65;0.25;0.65" dur={`${2 + (r + cI) * 0.4}s`} repeatCount="indefinite" />
          </circle>
        )))}
        <text x="254" y="102" textAnchor="middle" fontSize="8" fill={C.cold} fontFamily="monospace">kristal runtuh → cair</text>
      </g>
    </svg>
  );
}

/* Soda berbusa */
function SodaBubbles() {
  return (
    <svg viewBox="0 0 320 120" className="w-full" role="img" aria-label="Tekanan turun dan karbondioksida keluar sebagai gelembung">
      <rect x="118" y="40" width="84" height="70" rx="10" fill={C.bubble} opacity="0.15" stroke={C.co2} strokeWidth="2" />
      <rect x="136" y="22" width="48" height="18" rx="4" fill="none" stroke={C.co2} strokeWidth="2" />
      {/* tutup terbang */}
      <rect x="200" y="10" width="30" height="10" rx="3" fill={C.co2} opacity="0.7" transform="rotate(20 215 15)">
        <animate attributeName="y" values="10;-16" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0" dur="2.5s" repeatCount="indefinite" />
      </rect>
      {[133, 146, 159, 172, 185, 152].map((x, i) => (
        <circle key={x} cx={x} cy="102" r={2.5 + (i % 3) * 1.2} fill={C.bubble}>
          <animate attributeName="cy" values="102;34" dur={`${1 + i * 0.18}s`} repeatCount="indefinite" begin={`${i * 0.2}s`} />
          <animate attributeName="opacity" values="0;1;1;0" dur={`${1 + i * 0.18}s`} repeatCount="indefinite" begin={`${i * 0.2}s`} />
        </circle>
      ))}
      <text x="160" y="14" textAnchor="middle" fontSize="9" fill={C.co2} fontFamily="monospace">tekanan ↓ → CO₂ keluar!</text>
    </svg>
  );
}

/* Kerak ketel */
function KettleScale() {
  return (
    <svg viewBox="0 0 320 120" className="w-full" role="img" aria-label="Kalsium karbonat mengendap sebagai kerak di dasar ketel">
      <path d="M90 28 L100 93 Q101 100 110 100 L210 100 Q219 100 220 93 L230 28 Z" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.7" />
      <path d="M96 46 L104 92 Q105 97 111 97 L209 97 Q215 97 216 92 L224 46 Z" fill={C.bubble} opacity="0.2" />
      <rect x="104" y="91" width="112" height="6" rx="3" fill="#f0ece4">
        <animate attributeName="height" values="2;7;2" dur="5s" repeatCount="indefinite" />
        <animate attributeName="y" values="95;90;95" dur="5s" repeatCount="indefinite" />
      </rect>
      {[125, 145, 165, 185, 200].map((x, i) => (
        <circle key={x} cx={x} cy="90" r="2.5" fill={C.bubble}>
          <animate attributeName="cy" values="90;52" dur={`${0.9 + i * 0.15}s`} repeatCount="indefinite" begin={`${i * 0.2}s`} />
          <animate attributeName="opacity" values="0;0.9;0" dur={`${0.9 + i * 0.15}s`} repeatCount="indefinite" begin={`${i * 0.2}s`} />
        </circle>
      ))}
      <Caption text="Ca(HCO₃)₂ → CaCO₃ ↓ kerak" />
    </svg>
  );
}

/* Sabun: tetes lemak dibungkus sabun → pecah jadi misel kecil → terbawa air */
function SoapMicelle() {
  return (
    <svg viewBox="0 0 320 120" className="w-full" role="img" aria-label="Molekul sabun membungkus lemak menjadi misel kecil yang terbawa air">
      {/* ===== TAHAP 1 (kiri): tetes lemak besar + sabun mengepung ===== */}
      <text x="62" y="24" textAnchor="middle" fontSize="8.5" fill={C.soap} fontFamily="monospace">1 · mendekat</text>
      <circle cx="70" cy="60" r="18" fill={C.oil} opacity="0.55">
        <animate attributeName="r" values="18;16.5;18" dur="2s" repeatCount="indefinite" />
      </circle>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = 70 + Math.cos(angle) * 28;
        const y = 60 + Math.sin(angle) * 28;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="3.2" fill={C.soap}>
              <animateTransform attributeName="transform" type="rotate"
                values={`0 70 60;360 70 60`} dur="10s" repeatCount="indefinite" />
            </circle>
            <line x1={x} y1={y} x2={x - Math.cos(angle) * 7} y2={y - Math.sin(angle) * 7}
              stroke={C.soap} strokeWidth="1.3" opacity="0.65"
              transform={`rotate(0)`}>
              <animateTransform attributeName="transform" type="rotate"
                values={`0 70 60;360 70 60`} dur="10s" repeatCount="indefinite" />
            </line>
          </g>
        );
      })}
      {/* panah proses */}
      <polygon points="116,58 128,58 128,53 138,61 128,69 128,64 116,64" fill="currentColor" opacity="0.35" />

      {/* ===== TAHAP 2 (tengah): misel terbentuk ===== */}
      <text x="176" y="24" textAnchor="middle" fontSize="8.5" fill={C.soap} fontFamily="monospace">2 · terbungkus</text>
      <circle cx="178" cy="60" r="11" fill={C.oil} opacity="0.6">
        <animate attributeName="r" values="11;9.5;11" dur="2.5s" repeatCount="indefinite" />
      </circle>
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        const x = 178 + Math.cos(angle) * 19;
        const y = 60 + Math.sin(angle) * 19;
        return (
          <circle key={i} cx={x} cy={y} r="3" fill={C.soap}>
            <animateTransform attributeName="transform" type="rotate"
              values={`0 178 60;360 178 60`} dur="8s" repeatCount="indefinite" />
          </circle>
        );
      })}
      {/* panah bilas + air */}
      <polygon points="224,58 236,58 236,53 246,61 236,69 236,64 224,64" fill="currentColor" opacity="0.35" />
      <text x="235" y="50" textAnchor="middle" fontSize="8" fill={C.bubble} fontFamily="monospace">+ air</text>

      {/* ===== TAHAP 3 (kanan): misel kecil hanyut ===== */}
      <text x="290" y="24" textAnchor="middle" fontSize="8.5" fill={C.soap} fontFamily="monospace">3 · hanyut</text>
      {[266, 292, 310].map((x, i) => (
        <animateTransform
          key={`flow${i}`}
          attributeName="transform" type="translate"
          values="0 0; 4 0; 0 0" dur={`${1.8 + i * 0.3}s`} repeatCount="indefinite"
          additive="sum"
        />
      ))}
      {[266, 292, 308].map((x, i) => {
        const cy = [48, 68, 56][i];
        const r = [7, 5, 4][i];
        return (
          <g key={x}>
            <circle cx={x} cy={cy} r={r} fill={C.oil} opacity="0.55">
              <animate attributeName="cy" values={`${cy};${cy + [-4, 4, -3][i]};${cy}`} dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
            </circle>
            <circle cx={x} cy={cy} r={r + 2.5} fill="none" stroke={C.soap} strokeWidth="1.3" strokeDasharray="3 2">
              <animateTransform attributeName="transform" type="rotate"
                values={`0 ${x} ${cy};360 ${x} ${cy}`} dur={`${5 + i}s`} repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}
      {/* garis arus air */}
      {[0, 1].map((i) => (
        <path key={i} d={`M 256 ${84 + i * 10} q 10 -4 20 0 t 20 0 t 18 0`} fill="none" stroke={C.bubble} strokeWidth="1.3" opacity="0.5">
          <animate attributeName="stroke-dashoffset" values="12;0" dur="0.9s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
        </path>
      ))}

      <Caption text="lemak dipecah jadi misel — mudah dibilas" color={C.soap} />
    </svg>
  );
}

/* Fotosintesis */
function Photosynthesis() {
  return (
    <svg viewBox="0 0 320 120" className="w-full" role="img" aria-label="Cahaya matahari menyinari daun yang melepas oksigen">
      {/* matahari */}
      <circle cx="52" cy="38" r="13" fill={C.sun}>
        <animate attributeName="opacity" values="0.75;1;0.75" dur="3s" repeatCount="indefinite" />
      </circle>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line key={deg} x1="52" y1="19" x2="52" y2="13" stroke={C.sun} strokeWidth="2" strokeLinecap="round"
          transform={`rotate(${deg} 52 38)`}>
          <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
        </line>
      ))}
      {/* sinar */}
      {[0, 1, 2].map((i) => (
        <line key={i} x1="72" y1={40 + i * 9} x2="128" y2={54 + i * 5} stroke={C.sun} strokeWidth="1.5" opacity="0.5" strokeDasharray="6 4">
          <animate attributeName="stroke-dashoffset" values="10;0" dur="0.8s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
        </line>
      ))}
      {/* daun */}
      <path d="M148 62 q 30 -30 60 0 q -30 30 -60 0" fill={C.leaf} opacity="0.85" />
      <line x1="148" y1="62" x2="208" y2="62" stroke="#2d6b45" strokeWidth="2" />
      {/* O2 keluar */}
      {[0, 1].map((i) => (
        <circle key={i} cx={222 + i * 18} cy="56" r="4" fill={C.o2}>
          <animate attributeName="cy" values="56;28" dur={`${1.8 + i * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.7}s`} />
          <animate attributeName="opacity" values="1;0" dur={`${1.8 + i * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.7}s`} />
        </circle>
      ))}
      <text x="240" y="24" fontSize="9" fill={C.o2} fontFamily="monospace">O₂ ↑</text>
      <Caption text="CO₂ + H₂O + cahaya → glukosa" color={C.leaf} />
    </svg>
  );
}

/* Roti mengembang */
function BreadRise() {
  return (
    <svg viewBox="0 0 320 120" className="w-full" role="img" aria-label="Adonan mengembang karena gelembung karbondioksida dari ragi">
      {/* adonan awal */}
      <ellipse cx="72" cy="82" rx="36" ry="15" fill={C.dough} />
      <text x="72" y="110" textAnchor="middle" fontSize="8" fill={C.yeast} fontFamily="monospace">baru dicampur</text>
      {/* panah */}
      <polygon points="126,80 140,80 140,75 150,83 140,91 140,86 126,86" fill="currentColor" opacity="0.35" />
      {/* adonan mengembang */}
      <ellipse cx="228" cy="74" rx="52" ry="25" fill={C.dough}>
        <animate attributeName="ry" values="25;29;25" dur="4s" repeatCount="indefinite" />
        <animate attributeName="cy" values="76;71;76" dur="4s" repeatCount="indefinite" />
      </ellipse>
      {[208, 226, 244, 260].map((x, i) => (
        <circle key={x} cx={x} cy="76" r={3 + i * 0.4} fill={C.yeast} opacity="0.85">
          <animate attributeName="cy" values="80;68;80" dur={`${2.5 + i * 0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <text x="228" y="110" textAnchor="middle" fontSize="8" fill={C.bread} fontFamily="monospace">ragi → CO₂ mengembangkan adonan</text>
    </svg>
  );
}

/* Yoghurt */
function Yogurt() {
  return (
    <svg viewBox="0 0 320 120" className="w-full" role="img" aria-label="Asam laktat membuat protein susu menggumpal menjadi yoghurt">
      {/* gelas susu */}
      <rect x="46" y="32" width="58" height="64" rx="8" fill={C.milk} opacity="0.9" stroke="currentColor" strokeWidth="1" />
      <text x="75" y="108" textAnchor="middle" fontSize="8" fill="#b8a888" fontFamily="monospace">susu</text>
      {/* bakteri menuju kanan */}
      {[128, 143, 158].map((x, i) => (
        <ellipse key={x} cx={x} cy={50 + i * 12} rx="7" ry="3.5" fill={C.bacteria} opacity="0.85">
          <animate attributeName="cx" values={`${x};${x + 24}`} dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
        </ellipse>
      ))}
      <text x="145" y="36" textAnchor="middle" fontSize="8" fill={C.bacteria} fontFamily="monospace">Lactobacillus</text>
      {/* gelas yoghurt */}
      <rect x="218" y="32" width="58" height="64" rx="8" fill={C.yogurt} stroke="currentColor" strokeWidth="1" />
      {[234, 250, 264].map((x, i) => (
        <circle key={x} cx={x} cy={52 + (i % 2) * 20} r="5.5" fill={C.milk} opacity="0.7">
          <animate attributeName="cy" values={`${49 + (i % 2) * 20};${55 + (i % 2) * 20};${49 + (i % 2) * 20}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <text x="247" y="108" textAnchor="middle" fontSize="8" fill="#b8a07a" fontFamily="monospace">menggumpal</text>
    </svg>
  );
}

/* Bau kaki */
function SweatBacteria() {
  return (
    <svg viewBox="0 0 320 120" className="w-full" role="img" aria-label="Bakteri mencerna keringat dan mengeluarkan asam berbau">
      {/* telapak kaki */}
      <ellipse cx="80" cy="62" rx="42" ry="23" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="1.5" />
      <text x="80" y="100" textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.5" fontFamily="monospace">keringat (tak berbau)</text>
      {/* tetes keringat */}
      {[68, 90, 110].map((x, i) => (
        <circle key={x} cx={x} cy="50" r="3" fill={C.sweat}>
          <animate attributeName="cy" values="46;70" dur={`${1.6 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.4}s`} />
          <animate attributeName="opacity" values="0.9;0" dur={`${1.6 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.4}s`} />
        </circle>
      ))}
      {/* bakteri */}
      {[155, 182, 209].map((x, i) => (
        <ellipse key={x} cx={x} cy="58" rx="8" ry="4.5" fill={C.bacteria} opacity="0.85">
          <animate attributeName="rx" values="8;6.5;8" dur={`${1 + i * 0.2}s`} repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="translate" values={`0 0; ${i % 2 ? 4 : -4} ${i % 2 ? -3 : 3}; 0 0`} dur={`${1.8 + i * 0.3}s`} repeatCount="indefinite" />
        </ellipse>
      ))}
      {/* garis bau */}
      {[245, 265, 285].map((x, i) => (
        <path key={x} d={`M ${x} 52 q 4 -8 0 -14 q -4 -6 0 -12`} fill="none" stroke={C.rainbow1} strokeWidth="1.8" strokeLinecap="round">
          <animate attributeName="opacity" values="0;1;0" dur={`${1.8 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
          <animateTransform attributeName="transform" type="translate" values="0 8;0 -5" dur={`${1.8 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
        </path>
      ))}
      <text x="265" y="22" textAnchor="middle" fontSize="8" fill={C.rainbow1} fontFamily="monospace">bau asam</text>
    </svg>
  );
}

/* Kunang-kunang — glow di tengah area, caption di y=116 tidak bertabrakan */
function Firefly() {
  return (
    <svg viewBox="0 0 320 120" className="w-full" role="img" aria-label="Kunang-kunang memancarkan cahaya melalui reaksi luciferin">
      <rect x="16" y="12" width="288" height="80" rx="10" fill={C.night} opacity="0.4" />
      {[85, 165, 245].map((x, i) => {
        const y = 38 + (i === 1 ? -8 : i * 12);
        return (
          <g key={x}>
            {/* glow */}
            <circle cx={x} cy={y} r="16" fill={C.sun} opacity="0">
              <animate attributeName="opacity" values="0;0.45;0" dur={`${2.2 + i * 0.6}s`} begin={`${i * 0.8}s`} repeatCount="indefinite" />
              <animate attributeName="r" values="9;17;9" dur={`${2.2 + i * 0.6}s`} begin={`${i * 0.8}s`} repeatCount="indefinite" />
            </circle>
            {/* badan */}
            <ellipse cx={x} cy={y} rx="5.5" ry="3.5" fill={C.bread} />
            <circle cx={x + 5.5} cy={y - 1} r="2.8" fill={C.dark} />
            {/* lampu */}
            <circle cx={x - 3.5} cy={y + 1} r="3" fill={C.sun}>
              <animate attributeName="opacity" values="0.15;1;0.15" dur={`${2.2 + i * 0.6}s`} begin={`${i * 0.8}s`} repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}
      {/* reaksi di dalam strip gelap, bukan di atasnya */}
      <text x="160" y="87" textAnchor="middle" fontSize="8" fill={C.sun} opacity="0.85" fontFamily="monospace">
        luciferin + O₂ —luciferase→ cahaya
      </text>
      <Caption text="bioluminesensi: nyaris tanpa panas" />
    </svg>
  );
}

/* Pemutih */
function Bleach() {
  return (
    <svg viewBox="0 0 320 120" className="w-full" role="img" aria-label="Pemutih merusak kromofor noda hingga warnanya hilang">
      {/* kain bernoda */}
      <rect x="36" y="36" width="76" height="52" rx="6" fill={C.cloth} stroke="currentColor" strokeWidth="1" opacity="0.85" />
      <circle cx="74" cy="62" r="13" fill={C.stain} opacity="0.85" />
      <text x="74" y="104" textAnchor="middle" fontSize="8" fill={C.stain} fontFamily="monospace">bernoda</text>
      {/* tetes NaClO */}
      <text x="160" y="24" textAnchor="middle" fontSize="8" fill={C.bleach} fontFamily="monospace">NaClO</text>
      {[156, 168].map((x, i) => (
        <path key={x} d={`M ${x} 30 q 4 7 0 12 q -4 -5 0 -12`} fill={C.bleach}>
          <animateTransform attributeName="transform" type="translate" values={`0 0; 0 ${26 + i * 8}`} dur={`${0.9 + i * 0.3}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0" dur={`${0.9 + i * 0.3}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" />
        </path>
      ))}
      {/* kain bersih */}
      <rect x="204" y="36" width="76" height="52" rx="6" fill={C.cloth} stroke="currentColor" strokeWidth="1" opacity="0.85" />
      <circle cx="242" cy="62" r="13" fill={C.stain}>
        <animate attributeName="opacity" values="0.85;0;0.85" dur="4s" repeatCount="indefinite" />
      </circle>
      <text x="242" y="104" textAnchor="middle" fontSize="8" fill="#b8b09a" fontFamily="monospace">putih kembali</text>
      <Caption text="kromofor teroksidasi → warna hilang" color={C.bleach} />
    </svg>
  );
}

/* Hortensia */
function Hydrangea() {
  return (
    <svg viewBox="0 0 320 120" className="w-full" role="img" aria-label="Warna bunga ditentukan pH tanah: asam biru, basa merah muda">
      {/* kiri: asam → biru */}
      <rect x="28" y="92" width="118" height="14" rx="4" fill={C.soil} opacity="0.85" />
      <text x="87" y="103" textAnchor="middle" fontSize="7.5" fill="#fff" opacity="0.85" fontFamily="monospace">tanah asam · Al³⁺ bebas</text>
      {[62, 84, 106].map((x, i) => (
        <circle key={x} cx={x} cy={58 - (i === 1 ? 8 : 0)} r="8" fill={C.flowerBlue} opacity="0.9" />
      ))}
      <line x1="84" y1="90" x2="84" y2="64" stroke={C.leaf} strokeWidth="2" />
      {/* kanan: basa → pink */}
      <rect x="174" y="92" width="118" height="14" rx="4" fill={C.soil} opacity="0.85" />
      <text x="233" y="103" textAnchor="middle" fontSize="7.5" fill="#fff" opacity="0.85" fontFamily="monospace">tanah basa · kapur</text>
      {[208, 230, 252].map((x, i) => (
        <circle key={x} cx={x} cy={58 - (i === 1 ? 8 : 0)} r="8" fill={C.flower} opacity="0.9" />
      ))}
      <line x1="230" y1="90" x2="230" y2="64" stroke={C.leaf} strokeWidth="2" />
      {/* label pH di tengah */}
      <text x="160" y="30" textAnchor="middle" fontSize="8.5" fill={C.flowerBlue} fontFamily="monospace">pH rendah → biru</text>
      <text x="160" y="44" textAnchor="middle" fontSize="8.5" fill={C.flower} fontFamily="monospace">pH tinggi → merah muda</text>
    </svg>
  );
}

/* Pelangi genangan */
function OilRainbow() {
  return (
    <svg viewBox="0 0 320 120" className="w-full" role="img" aria-label="Film tipis oli menghasilkan pita warna interferensi">
      <rect x="20" y="18" width="280" height="86" rx="10" fill="#141b2b" />
      {[C.rainbow1, C.rainbow2, C.rainbow3, C.rainbow4, "#9d6fd6"].map((color, i) => (
        <path
          key={i}
          d={`M 20 ${32 + i * 13} q 70 ${i % 2 ? -9 : 9} 140 0 t 140 0`}
          fill="none"
          stroke={color}
          strokeWidth="7"
          opacity="0.7"
        >
          <animate attributeName="opacity" values="0.45;0.85;0.45" dur={`${2.5 + i * 0.4}s`} repeatCount="indefinite" />
          <animate attributeName="stroke-width" values="5;9;5" dur={`${3 + i * 0.3}s`} repeatCount="indefinite" />
        </path>
      ))}
      <text x="160" y="116" textAnchor="middle" fontSize="8.5" fill="#e8edf7" opacity="0.55" fontFamily="monospace">
        interferensi film tipis oli di atas air
      </text>
    </svg>
  );
}

/* Pernapasan sel */
function CellRespiration() {
  return (
    <svg viewBox="0 0 320 120" className="w-full" role="img" aria-label="Sel mengoksidasi glukosa menghasilkan energi ATP">
      <ellipse cx="160" cy="58" rx="88" ry="40" fill={C.cell} opacity="0.2" stroke={C.cell} strokeWidth="2" />
      <ellipse cx="160" cy="58" rx="32" ry="15" fill={C.atp} opacity="0.35" stroke={C.atp} strokeWidth="1.5" />
      {[147, 157, 167, 177].map((x, i) => (
        <path key={x} d={`M ${x} 51 q 3 7 0 14`} fill="none" stroke={C.atp} strokeWidth="1.2">
          <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
        </path>
      ))}
      {/* input kiri */}
      <text x="34" y="42" fontSize="9" fill={C.rainbow3} fontFamily="monospace">glukosa</text>
      <line x1="80" y1="39" x2="122" y2="48" stroke={C.rainbow3} strokeWidth="1.5" strokeDasharray="4 3">
        <animate attributeName="stroke-dashoffset" values="7;0" dur="0.7s" repeatCount="indefinite" />
      </line>
      <text x="42" y="82" fontSize="9" fill={C.o2} fontFamily="monospace">O₂</text>
      <line x1="62" y1="79" x2="124" y2="68" stroke={C.o2} strokeWidth="1.5" strokeDasharray="4 3">
        <animate attributeName="stroke-dashoffset" values="7;0" dur="0.7s" begin="0.2s" repeatCount="indefinite" />
      </line>
      {/* ATP keluar kanan */}
      {[0, 1, 2].map((i) => (
        <text key={i} x="256" y={46 + i * 14} fontSize="10" fill={C.atp} fontFamily="monospace" fontWeight="bold">
          <animate attributeName="x" values="252;296" dur={`${1.8 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
          <animate attributeName="opacity" values="0;1;0" dur={`${1.8 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
          ATP
        </text>
      ))}
      <Caption text="C₆H₁₂O₆ + 6O₂ → energi (ATP)" color={C.atp} />
    </svg>
  );
}
