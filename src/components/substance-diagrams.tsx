// Database Zat — diagram animasi per kategori + struktur Lewis molekul ikonik.
// Semua SVG 320x110, animasi halus, hormati reduced-motion (global CSS).

const C = {
  acid: "#e05c7a", base: "#5b8def", salt: "#d9c27a", oxide: "#c97b4a",
  organic: "#34e0a1", element: "#9aa7bd", gas: "#4aa8bd", solution: "#9d6fd6",
  h: "#6aa5ff", o: "#e05c7a", n: "#5b8def", c: "#4a4a58",
};

/* ===== Diagram per KATEGORI (8) ===== */

export function CategoryDiagram({ category }: { category: string }) {
  switch (category) {
    case "Asam": return <AcidDiagram />;
    case "Basa": return <BaseDiagram />;
    case "Garam": return <SaltCrystal />;
    case "Oksida": return <OxideForm />;
    case "Organik": return <CarbonChain />;
    case "Unsur": return <SingleAtom />;
    case "Gas": return <FreeGas />;
    case "Larutan": return <SolutionParticles />;
    default: return null;
  }
}

/* Asam: H⁺ lepas dari molekul */
function AcidDiagram() {
  return (
    <svg viewBox="0 0 320 110" className="w-full" role="img" aria-label="Ion hidrogen terlepas dari molekul asam">
      {/* molekul HA */}
      <circle cx="120" cy="50" r="14" fill={C.acid} opacity="0.85" />
      <text x="120" y="54" textAnchor="middle" fontSize="11" fill="#fff" fontFamily="monospace">A</text>
      {/* H menempel */}
      <g>
        <circle cx="145" cy="42" r="7" fill={C.h} />
        <text x="145" y="45.5" textAnchor="middle" fontSize="8" fill="#fff" fontFamily="monospace">H</text>
        {/* getar lepas */}
        <animateTransform attributeName="transform" type="translate"
          values="0 0; 55 -18; 55 -18" dur="2.4s" repeatCount="indefinite" keyTimes="0;0.45;1" />
        <animate attributeName="opacity" values="1;1;0.35" dur="2.4s" repeatCount="indefinite" />
      </g>
      {/* label muatan */}
      <text x="200" y="30" fontSize="10" fill={C.h} fontFamily="monospace" opacity="0">
        <animate attributeName="opacity" values="0;0;1" dur="2.4s" repeatCount="indefinite" />
        H⁺
      </text>
      {/* sisa elektron A⁻ */}
      <text x="96" y="82" fontSize="10" fill={C.acid} fontFamily="monospace" opacity="0">
        <animate attributeName="opacity" values="0;0;1" dur="2.4s" repeatCount="indefinite" />
        A⁻
      </text>
      {/* air sebagai pelarut */}
      {[60, 250, 270].map((x, i) => (
        <path key={x} d={`M ${x} ${88 + (i % 2) * 6} q 4 -6 0 -11 q -4 -5 0 -10`} fill="none"
          stroke={C.gas} strokeWidth="1.3" opacity="0.4">
          <animate attributeName="opacity" values="0.15;0.5;0.15" dur={`${1.6 + i * 0.4}s`} repeatCount="indefinite" />
        </path>
      ))}
      <text x="160" y="106" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">
        asam = donor H⁺ dalam air
      </text>
    </svg>
  );
}

/* Basa: OH⁻ menerima H⁺ */
function BaseDiagram() {
  return (
    <svg viewBox="0 0 320 110" className="w-full" role="img" aria-label="Ion hidroksida menerima ion hidrogen">
      {/* OH⁻ */}
      <g>
        <circle cx="105" cy="52" r="12" fill={C.o} opacity="0.85" />
        <text x="105" y="56" textAnchor="middle" fontSize="9" fill="#fff" fontFamily="monospace">O</text>
        <circle cx="124" cy="44" r="7" fill={C.h} />
        <text x="124" y="47.5" textAnchor="middle" fontSize="8" fill="#fff" fontFamily="monospace">H</text>
      </g>
      {/* H⁺ datang dari kanan */}
      <g>
        <circle cx="235" cy="40" r="7" fill={C.h} />
        <text x="235" y="43.5" textAnchor="middle" fontSize="8" fill="#fff" fontFamily="monospace">H</text>
        <text x="247" y="34" fontSize="8" fill={C.h} fontFamily="monospace">⁺</text>
        <animateTransform attributeName="transform" type="translate"
          values="0 0; -80 8; -80 8" dur="2.2s" repeatCount="indefinite" keyTimes="0;0.5;1" />
      </g>
      {/* hasil: H2O */}
      <text x="150" y="88" fontSize="11" fill={C.o} fontFamily="monospace" opacity="0">
        H₂O terbentuk
        <animate attributeName="opacity" values="0;0;1" dur="2.2s" repeatCount="indefinite" />
      </text>
      <text x="160" y="106" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">
        basa = akseptor H⁺ (netralisasi)
      </text>
    </svg>
  );
}

/* Garam: ion berkristal */
function SaltCrystal() {
  return (
    <svg viewBox="0 0 320 110" className="w-full" role="img" aria-label="Ion positif dan negatif tersusun menjadi kisi kristal">
      {Array.from({ length: 16 }).map((_, i) => {
        const col = i % 4, row = Math.floor(i / 4);
        const isNa = (col + row) % 2 === 0;
        const x = 118 + col * 26, y = 22 + row * 26;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="9" fill={isNa ? "#5b8def" : "#e05c7a"} opacity="0">
              <animate attributeName="opacity" from="0" to="0.9" dur="0.35s" begin={`${i * 0.07}s`} fill="freeze" />
              <animate attributeName="cx" from={x + (isNa ? -20 : 20)} to={x} dur="0.35s" begin={`${i * 0.07}s`} fill="freeze" />
            </circle>
            <text x={x} y={y + 3.5} textAnchor="middle" fontSize="9" fontWeight="bold"
              fill="#fff" opacity="0">
              {isNa ? "+" : "−"}
              <animate attributeName="opacity" from="0" to="1" dur="0.25s" begin={`${i * 0.07 + 0.15}s`} fill="freeze" />
            </text>
          </g>
        );
      })}
      <text x="160" y="106" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">
        kisi ion Na⁺ Cl⁻ — tarik-menarik elektrostatik
      </text>
    </svg>
  );
}

/* Oksida: O2 bergabung ke logam */
function OxideForm() {
  return (
    <svg viewBox="0 0 320 110" className="w-full" role="img" aria-label="Oksigen bergabung dengan logam membentuk oksida">
      {/* logam */}
      <rect x="40" y="62" width="90" height="22" rx="4" fill="#8a8f98" />
      <text x="85" y="77" textAnchor="middle" fontSize="9" fill="#fff" fontFamily="monospace">logam M</text>
      {/* O2 mendekat */}
      <g>
        <circle cx="230" cy="40" r="8" fill={C.o} opacity="0.85" />
        <circle cx="248" cy="40" r="8" fill={C.o} opacity="0.85" />
        <animateTransform attributeName="transform" type="translate"
          values="0 0; -130 26; -130 26" dur="2.6s" repeatCount="indefinite" keyTimes="0;0.55;1" />
      </g>
      {/* lapisan oksida tumbuh */}
      <rect x="40" y="54" width="90" height="8" rx="3" fill={C.oxide}>
        <animate attributeName="height" values="0;10" dur="1s" begin="1.5s" fill="freeze" />
        <animate attributeName="y" values="62;54" dur="1s" begin="1.5s" fill="freeze" />
      </rect>
      <text x="160" y="106" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">
        M + O₂ → oksida logam
      </text>
    </svg>
  );
}

/* Organik: rantai karbon tersusun */
function CarbonChain() {
  const nodes = [100, 140, 180, 220];
  return (
    <svg viewBox="0 0 320 110" className="w-full" role="img" aria-label="Rantai atom karbon tersusun satu per satu">
      {nodes.map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={i % 2 ? 42 : 54} r="10" fill={C.organic} opacity="0">
            <animate attributeName="opacity" from="0" to="0.9" dur="0.3s" begin={`${i * 0.25}s`} fill="freeze" />
            <animate attributeName="cy"
              from={(i % 2 ? 42 : 54) - 24} to={i % 2 ? 42 : 54}
              dur="0.35s" begin={`${i * 0.25}s`} fill="freeze" />
          </circle>
          <text x={x} y={(i % 2 ? 42 : 54) + 4} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0c1220" opacity="0">
            C
            <animate attributeName="opacity" from="0" to="1" dur="0.2s" begin={`${i * 0.25 + 0.15}s`} fill="freeze" />
          </text>
          {/* ikatan */}
          {i > 0 && (
            <line
              x1={nodes[i - 1] + 10} y1={(i - 1) % 2 ? 42 : 54}
              x2={x - 10} y2={i % 2 ? 42 : 54}
              stroke={C.organic} strokeWidth="2" strokeDasharray="20"
              opacity="0">
              <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.25s" begin={`${i * 0.25}s`} fill="freeze" />
              <animate attributeName="opacity" from="0" to="0.8" dur="0.25s" begin={`${i * 0.25}s`} fill="freeze" />
            </line>
          )}
        </g>
      ))}
      {/* H kecil di sekitar */}
      {[85, 115, 155, 195, 235].map((x, i) => (
        <circle key={x} cx={x} cy={(i % 2 ? 36 : 68) - (i % 3) * 4} r="4" fill={C.h} opacity="0">
          <animate attributeName="opacity" from="0" to="0.75" dur="0.3s" begin={`${0.9 + i * 0.08}s`} fill="freeze" />
        </circle>
      ))}
      <text x="160" y="106" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">
        kerangka karbon — basis semua senyawa organik
      </text>
    </svg>
  );
}

/* Unsur: atom inti + cincin elektron berputar */
function SingleAtom() {
  return (
    <svg viewBox="0 0 320 110" className="w-full" role="img" aria-label="Model atom dengan inti dan elektron berputar">
      <ellipse cx="160" cy="48" rx="70" ry="28" fill="none" stroke="var(--border)" strokeWidth="1.2">
        <animateTransform attributeName="transform" type="rotate" from="0 160 48" to="360 160 48"
          dur="6s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="160" cy="48" rx="44" ry="17" fill="none" stroke="var(--border)" strokeWidth="1.2"
        transform="rotate(60 160 48)">
        <animateTransform attributeName="transform" type="rotate" from="60 160 48" to="420 160 48"
          dur="4s" repeatCount="indefinite" />
      </ellipse>
      {/* inti */}
      <circle cx="160" cy="48" r="13" fill={C.element} />
      <text x="160" y="52.5" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0c1220">X</text>
      {/* elektron di orbit */}
      <circle r="4" fill={C.h}>
        <animateMotion dur="6s" repeatCount="indefinite"
          path="M 230 48 A 70 28 0 1 1 229.9 47.9" />
      </circle>
      <circle r="3.5" fill={C.acid}>
        <animateMotion dur="4s" repeatCount="indefinite"
          path="M 204 48 A 44 17 0 1 0 203.9 48.1" />
      </circle>
      <text x="160" y="106" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">
        inti + awan elektron
      </text>
    </svg>
  );
}

/* Gas: partikel bebas dalam kotak */
function FreeGas() {
  return (
    <svg viewBox="0 0 320 110" className="w-full" role="img" aria-label="Partikel gas bergerak bebas dalam wadah">
      <rect x="60" y="14" width="200" height="76" rx="10" fill="none" stroke="var(--border)" strokeWidth="1.5" />
      {Array.from({ length: 9 }).map((_, i) => (
        <circle key={i} cx={90 + (i % 3) * 65} cy={32 + Math.floor(i / 3) * 22} r="4.5" fill={C.gas} opacity="0.85">
          <animateTransform attributeName="transform" type="translate"
            values={`0 0; ${(i % 2 ? 22 : -18)}, ${i % 3 === 0 ? 14 : -16};
                     ${(i % 2 ? -14 : 16)}, ${i % 3 === 1 ? 10 : -8}; 0 0`}
            dur={`${1.6 + (i % 4) * 0.35}s`} repeatCount="indefinite" begin={`${i * 0.12}s`} />
        </circle>
      ))}
      <text x="160" y="106" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">
        partikel bebas — jarak antarpartikel jauh
      </text>
    </svg>
  );
}

/* Larutan: pelarut + terlarut tersebar */
function SolutionParticles() {
  return (
    <svg viewBox="0 0 320 110" className="w-full" role="img" aria-label="Partikel terlarut tersebar merata dalam pelarut">
      <rect x="60" y="14" width="200" height="76" rx="10" fill={C.solution} opacity="0.08"
        stroke={C.solution} strokeWidth="1.2" />
      {/* molekul pelarut (air, biru kecil) */}
      {Array.from({ length: 14 }).map((_, i) => (
        <circle key={"s" + i} cx={78 + (i % 7) * 27} cy={26 + Math.floor(i / 7) * 26} r="3" fill={C.gas} opacity="0.45">
          <animateTransform attributeName="transform" type="translate"
            values={`0 0; ${i % 2 ? 3 : -3}, ${i % 3 ? 2 : -2}; 0 0`}
            dur={`${1.4 + (i % 5) * 0.3}s`} repeatCount="indefinite" additive="sum" />
        </circle>
      ))}
      {/* ion terlarut (besar ungu/oranye) */}
      {[105, 165, 225].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={i % 2 ? 62 : 44} r="6" fill={i % 2 ? "#e05c7a" : "#ffb454"}>
            <animateTransform attributeName="transform" type="translate"
              values={`0 0; ${i % 2 ? -5 : 5}, ${i % 2 ? 3 : -3}; 0 0`}
              dur={`${1.8 + i * 0.4}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      <text x="160" y="106" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">
        terlarut tersebar merata dalam pelarut
      </text>
    </svg>
  );
}

/* ===== Struktur Lewis molekul ikonik ===== */

export function LewisStructure({ formula }: { formula: string }) {
  switch (formula) {
    case "H2O": return <LewisWater />;
    case "CO2": return <LewisCO2 />;
    case "CH4": return <LewisMethane />;
    case "NH3": return <LewisAmmonia />;
    case "O2": return <LewisDiatomic sym="O" color={C.o} bonds={2} />;
    case "N2": return <LewisDiatomic sym="N" color={C.n} bonds={3} />;
    default: return null;
  }
}

/* H2O: bentuk V, 104.5° */
function LewisWater() {
  return (
    <svg viewBox="0 0 320 110" className="w-full" role="img" aria-label="Struktur Lewis air: bentuk V dengan dua pasang elektron bebas">
      {/* O pusat */}
      <circle cx="160" cy="46" r="15" fill={C.o} />
      <text x="160" y="51" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#fff">O</text>
      {/* ikatan ke H */}
      <line x1="149" y1="57" x2="128" y2="74" stroke="currentColor" strokeWidth="2" opacity="0.7" />
      <line x1="171" y1="57" x2="192" y2="74" stroke="currentColor" strokeWidth="2" opacity="0.7" />
      <circle cx="123" cy="78" r="9" fill={C.h} /><text x="123" y="82" textAnchor="middle" fontSize="9" fill="#fff">H</text>
      <circle cx="197" cy="78" r="9" fill={C.h} /><text x="197" y="82" textAnchor="middle" fontSize="9" fill="#fff">H</text>
      {/* pasangan bebas (titik atas) */}
      <PairDots x={148} y={30} /><PairDots x={172} y={30} />
      <text x="160" y="106" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">
        bentuk V · 104,5° · 2 pasang bebas → polar
      </text>
    </svg>
  );
}

/* CO2: linear */
function LewisCO2() {
  return (
    <svg viewBox="0 0 320 110" className="w-full" role="img" aria-label="Struktur Lewis CO2 linear dengan ikatan rangkap dua">
      <line x1="122" y1="48" x2="198" y2="48" stroke="currentColor" strokeWidth="1.6" opacity="0.7" />
      <line x1="122" y1="56" x2="198" y2="56" stroke="currentColor" strokeWidth="1.6" opacity="0.7" />
      {/* ikatan rangkap kiri & kanan */}
      {[["122", "48"], ["122", "56"]].map(([, ], i) => null)}
      <circle cx="160" cy="52" r="14" fill={C.c} stroke="#888" strokeWidth="1" />
      <text x="160" y="56.5" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fff">C</text>
      <circle cx="98" cy="52" r="12" fill={C.o} />
      <text x="98" y="56.5" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fff">O</text>
      <circle cx="222" cy="52" r="12" fill={C.o} />
      <text x="222" y="56.5" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fff">O</text>
      {/* ikatan rangkap visual: garis ganda */}
      <DoubleBond x1={112} x2={146} y={49} />
      <DoubleBond x1={174} x2={208} y={49} />
      <PairDots x={86} y={30} /><PairDots x={234} y={30} />
      <text x="160" y="106" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">
        linear · 180° · 2 ikatan rangkap C=O
      </text>
    </svg>
  );
}

function DoubleBond({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return (
    <>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke="currentColor" strokeWidth="1.6" opacity="0.7" />
      <line x1={x1} y1={y + 7} x2={x2} y2={y + 7} stroke="currentColor" strokeWidth="1.6" opacity="0.7" />
    </>
  );
}

/* CH4: tetrahedral (proyeksi 2D) */
function LewisMethane() {
  const hs = [
    { x: 160, y: 16 }, { x: 108, y: 66 }, { x: 212, y: 66 }, { x: 160, y: 92 },
  ];
  return (
    <svg viewBox="0 0 320 110" className="w-full" role="img" aria-label="Struktur Lewis metana tetrahedral dengan empat ikatan C-H">
      {hs.map((p, i) => (
        <g key={i}>
          <line x1="160" y1="52" x2={p.x} y2={p.y + (i === 3 ? -8 : i === 0 ? 8 : 0)}
            stroke="currentColor" strokeWidth="1.8" opacity="0.7" />
          <circle cx={p.x} cy={p.y} r="9" fill={C.h} />
          <text x={p.x} y={p.y + 3.5} textAnchor="middle" fontSize="9" fill="#fff">H</text>
        </g>
      ))}
      <circle cx="160" cy="52" r="15" fill={C.c} stroke="#888" strokeWidth="1" />
      <text x="160" y="57" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#fff">C</text>
      <text x="160" y="106" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">
        tetrahedral · 109,5° · 4 ikatan tunggal
      </text>
    </svg>
  );
}

/* NH3: piramida dengan satu pasang bebas */
function LewisAmmonia() {
  return (
    <svg viewBox="0 0 320 110" className="w-full" role="img" aria-label="Struktur Lewis amonia piramida dengan satu pasang elektron bebas">
      {/* N pusat */}
      <circle cx="160" cy="48" r="15" fill={C.n} />
      <text x="160" y="53" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#fff">N</text>
      {/* pasangan bebas di atas */}
      <PairDots x={148} y={26} /><PairDots x={172} y={26} />
      {/* 3 H di bawah */}
      {[118, 160, 202].map((x, i) => (
        <g key={i}>
          <line x1="160" y1="58" x2={x} y2="80" stroke="currentColor" strokeWidth="1.8" opacity="0.7" />
          <circle cx={x} cy="84" r="9" fill={C.h} />
          <text x={x} y="87.5" textAnchor="middle" fontSize="9" fill="#fff">H</text>
        </g>
      ))}
      <text x="160" y="106" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">
        piramida · 107° · 1 pasang bebas → basa lemah
      </text>
    </svg>
  );
}

/* O2 / N2: diatomic multi-bond */
function LewisDiatomic({ sym, color, bonds }: { sym: string; color: string; bonds: 2 | 3 }) {
  return (
    <svg viewBox="0 0 320 110" className="w-full" role="img" aria-label={`Struktur Lewis ${sym}${sym} dengan ${bonds} ikatan`}>
      <circle cx="125" cy="50" r="14" fill={color} />
      <text x="125" y="55" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#fff">{sym}</text>
      <circle cx="195" cy="50" r="14" fill={color} />
      <text x="195" y="55" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#fff">{sym}</text>
      {/* ikatan berganda */}
      {Array.from({ length: bonds }).map((_, i) => (
        <line key={i} x1="139" y1={50 - ((bonds - 1) * 3.5) + i * 3.5}
          x2="181" y2={50 - ((bonds - 1) * 3.5) + i * 3.5}
          stroke="currentColor" strokeWidth="1.7" opacity="0.75" />
      ))}
      {/* pasangan bebas luar */}
      <PairDots x={104} y={30} /><PairDots x={216} y={30} />
      <text x="160" y="106" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">
        {sym}≡{sym === "N" ? "" : ""}{bonds === 3 ? "ikatan rangkap tiga — sangat stabil" : "ikatan rangkap dua"}
      </text>
    </svg>
  );
}

/* pasangan elektron bebas (dua titik) */
function PairDots({ x, y }: { x: number; y: number }) {
  void y;
  return (
    <g fill="currentColor" opacity="0.7">
      <circle cx={x - 4} cy={y} r="2.2" />
      <circle cx={x + 4} cy={y} r="2.2" />
    </g>
  );
}
