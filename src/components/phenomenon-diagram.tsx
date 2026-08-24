// Diagram SVG inline per kategori fenomena — animasi CSS halus, hormati reduced-motion.
import { getDiagram } from "@/components/diagrams-batch";

interface Props { id: string; className?: string }

/* Api menyala: bahan bakar + oksigen → nyala + panas */
function FireDiagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 120" className={className} role="img" aria-label="Bahan bakar dan oksigen bereaksi menghasilkan nyala api, panas, dan cahaya">
      {/* kayu */}
      <rect x="120" y="88" width="80" height="10" rx="3" fill="#8a5a33" transform="rotate(-6 160 93)" />
      <rect x="128" y="90" width="70" height="9" rx="3" fill="#a06a3d" transform="rotate(5 163 94)" />
      {/* nyala luar */}
      <path d="M160 22 q 26 24 18 46 q -6 16 -18 16 q -12 0 -18 -16 q -8 -22 18 -46" fill="#ff7a45" opacity="0.85">
        <animate attributeName="d"
          values="M160 22 q 26 24 18 46 q -6 16 -18 16 q -12 0 -18 -16 q -8 -22 18 -46;
                  M160 26 q 22 20 15 42 q -5 14 -15 14 q -10 0 -15 -14 q -7 -22 15 -42;
                  M160 22 q 26 24 18 46 q -6 16 -18 16 q -12 0 -18 -16 q -8 -22 18 -46"
          dur="1.6s" repeatCount="indefinite" />
      </path>
      {/* nyala dalam */}
      <path d="M160 44 q 14 14 10 28 q -4 10 -10 10 q -6 0 -10 -10 q -4 -14 10 -28" fill="#ffb454">
        <animate attributeName="d"
          values="M160 44 q 14 14 10 28 q -4 10 -10 10 q -6 0 -10 -10 q -4 -14 10 -28;
                  M160 47 q 12 12 8 25 q -3 8 -8 8 q -5 0 -8 -8 q -4 -13 8 -25;
                  M160 44 q 14 14 10 28 q -4 10 -10 10 q -6 0 -10 -10 q -4 -14 10 -28"
          dur="1.2s" repeatCount="indefinite" />
      </path>
      {/* O2 masuk */}
      {[0, 1].map((i) => (
        <circle key={i} cx={64 + i * 12} cy={72} r="4" fill="#6aa5ff">
          <animate attributeName="cx" values={`${64 + i * 12};${132 + i * 8}`} dur="1.8s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0" dur="1.8s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <text x="56" y="60" fontSize="8.5" fill="#6aa5ff" fontFamily="monospace">O₂</text>
      {/* produk keluar */}
      <text x="234" y="52" fontSize="8.5" fill="#9aa7bd" fontFamily="monospace">CO₂ ↑</text>
      {[0, 1].map((i) => (
        <path key={i} d={`M 232 ${66 + i * 13} q 6 -5 12 0 t 12 0`} fill="none" stroke="#ffb454" strokeWidth="1.6" strokeLinecap="round">
          <animate attributeName="opacity" values="0;0.9;0" dur={`${1.6 + i * 0.4}s`} begin={`${i * 0.6}s`} repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="translate" values="-8 0; 10 0" dur={`${1.6 + i * 0.4}s`} begin={`${i * 0.6}s`} repeatCount="indefinite" />
        </path>
      ))}
      <text x="160" y="116" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">
        bahan bakar + O₂ → CO₂ + H₂O + panas
      </text>
    </svg>
  );
}

const C = {
  fe: "#b87333", rust: "#c1553a", o2: "#6aa5ff", h2o: "#4aa8bd",
  oil: "#d9a441", water: "#4a90d9", acid: "#e05c7a", base: "#5b8def",
  green: "#34e0a1", leaf: "#3f9e63", sun: "#ffb454", fire: "#ff7a45",
  egg: "#f5e6c8", apple: "#c8d84a", silver: "#aab4c4", black: "#3a4150",
  copper: "#c97b4a", patina: "#4fae8a", soap: "#9d6fd6", bread: "#d9a441",
  flame: "#ffb454", dew: "#7cc4e8", rainbow: "#e05c7a", moon: "#c9d4e8",
};

export default function PhenomenonDiagram({ id, className }: Props) {
  // diagram spesifik dari batch dulu
  const batch = getDiagram(id);
  if (batch) return <div className={className}>{batch}</div>;

  switch (id) {
    case "api-menyala": return <FireDiagram className={className} />;
    case "besi-berkarat": return <RustDiagram className={className} />;
    case "minyak-air": return <OilWaterDiagram className={className} />;
    case "telur-dipanaskan": return <EggDiagram className={className} />;
    default: return <GenericDiagram id={id} className={className} />;
  }
}

/* Besi berkarat: atom O₂ mendekati permukaan besi → bintik karat membesar */
function RustDiagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 120" className={className} role="img" aria-label="Oksigen dan air bereaksi dengan permukaan besi membentuk karat">
      {/* permukaan besi */}
      <rect x="20" y="80" width="280" height="24" rx="3" fill={C.fe} opacity="0.85" />
      {/* lapisan karat tumbuh */}
      <rect x="20" y="72" width="280" height="8" rx="3" fill={C.rust} opacity="0.75">
        <animate attributeName="height" values="2;10;10" dur="6s" repeatCount="indefinite" />
        <animate attributeName="y" values="78;70;70" dur="6s" repeatCount="indefinite" />
      </rect>
      {/* molekul O2 jatuh */}
      {[60, 140, 220].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy="18" r="5" fill={C.o2}>
            <animate attributeName="cy" values="14;66" dur={`${2.2 + i * 0.7}s`} repeatCount="indefinite" begin={`${i * 0.8}s`} />
            <animate attributeName="opacity" values="1;1;0" dur={`${2.2 + i * 0.7}s`} repeatCount="indefinite" begin={`${i * 0.8}s`} />
          </circle>
          <circle cx={x + 11} cy="18" r="5" fill={C.o2}>
            <animate attributeName="cy" values="14;66" dur={`${2.2 + i * 0.7}s`} repeatCount="indefinite" begin={`${i * 0.8}s`} />
            <animate attributeName="opacity" values="1;1;0" dur={`${2.2 + i * 0.7}s`} repeatCount="indefinite" begin={`${i * 0.8}s`} />
          </circle>
        </g>
      ))}
      {/* tetes air */}
      <circle cx="100" cy="40" r="6" fill={C.h2o} opacity="0.8">
        <animate attributeName="cy" values="36;68" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.9;0" dur="3s" repeatCount="indefinite" />
      </circle>
      <text x="160" y="116" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">Fe + O₂ + H₂O → Fe₂O₃·nH₂O</text>
    </svg>
  );
}

/* Minyak & air: dua lapisan dengan molekul terpisah */
function OilWaterDiagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 120" className={className} role="img" aria-label="Molekul minyak nonpolar terpisah dari molekul air polar">
      {/* lapisan minyak */}
      <rect x="30" y="22" width="260" height="34" rx="6" fill={C.oil} opacity="0.25" />
      {/* lapisan air */}
      <rect x="30" y="58" width="260" height="40" rx="6" fill={C.water} opacity="0.25" />
      {/* garis batas */}
      <line x1="30" y1="57" x2="290" y2="57" stroke={C.oil} strokeWidth="1.5" strokeDasharray="4 3">
        <animate attributeName="stroke-dashoffset" values="0;14" dur="2s" repeatCount="indefinite" />
      </line>
      {/* molekul minyak (rantai) */}
      {[70, 130, 190, 250].map((x) => (
        <g key={x} stroke={C.oil} strokeWidth="2.5" strokeLinecap="round">
          <line x1={x} y1="32" x2={x} y2="46">
            <animateTransform attributeName="transform" type="translate" values="0 0; 3 -2; -3 0; 0 0" dur={`${2 + (x % 50) / 25}s`} repeatCount="indefinite" />
          </line>
          <line x1={x} y1="32" x2={x + 9} y2="27">
            <animateTransform attributeName="transform" type="translate" values="0 0; 3 -2; -3 0; 0 0" dur={`${2 + (x % 50) / 25}s`} repeatCount="indefinite" />
          </line>
        </g>
      ))}
      {/* molekul air (V-shape) */}
      {[70, 130, 190, 250].map((x, i) => (
        <g key={x} fill={C.water}>
          <circle cx={x} cy={74} r="4">
            <animateTransform attributeName="transform" type="translate" values={`0 0; ${i % 2 ? 4 : -4} 3; 0 0`} dur={`${1.6 + i * 0.4}s`} repeatCount="indefinite" />
          </circle>
          <circle cx={x - 6} cy={68} r="3" opacity="0.7">
            <animateTransform attributeName="transform" type="translate" values={`0 0; ${i % 2 ? 4 : -4} 3; 0 0`} dur={`${1.6 + i * 0.4}s`} repeatCount="indefinite" />
          </circle>
          <circle cx={x + 6} cy={68} r="3" opacity="0.7">
            <animateTransform attributeName="transform" type="translate" values={`0 0; ${i % 2 ? 4 : -4} 3; 0 0`} dur={`${1.6 + i * 0.4}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      <text x="62" y="16" fontSize="9" fill={C.oil} fontFamily="monospace">minyak (nonpolar)</text>
      <text x="196" y="16" fontSize="9" fill={C.water} fontFamily="monospace">air (polar)</text>
    </svg>
  );
}

/* Telur: protein terlipat → terurai → jala padat */
function EggDiagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 120" className={className} role="img" aria-label="Protein terlipat berubah menjadi untaian yang saling menaut">
      {[0, 1].map((row) => {
        const y = 28 + row * 52;
        const stage = ["Sebelum panas", "Setelah panas"][row];
        return (
          <g key={row}>
            <text x="26" y={y - 12} fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">{stage}</text>
            {row === 0
              ? // protein terlipat: gulungan
                [70, 150, 230].map((x, i) => (
                  <path key={x} d={`M ${x} ${y + 14} q 12 -16 24 0 q 12 16 24 0 q -12 -16 -24 0 q -12 16 -24 0`} fill="none"
                    stroke={C.egg} strokeWidth="2.5" strokeLinecap="round">
                    <animateTransform attributeName="transform" type="rotate" values={`0 ${x + 24} ${y}; 360 ${x + 24} ${y}`} dur={`${5 + i}s`} repeatCount="indefinite" />
                  </path>
                ))
              : // untaian menaut
                [70, 150, 230].map((x, i) => (
                  <path key={x} d={`M ${x - 20} ${y + 10} q 20 -18 40 0 t 40 0`} fill="none" stroke={C.egg}
                    strokeWidth="2.5" strokeLinecap="round" strokeDasharray="60" strokeDashoffset="60">
                    <animate attributeName="stroke-dashoffset" values="60;0" dur="1.5s" begin={`${i * 0.3}s`} fill="freeze" repeatCount="indefinite" />
                  </path>
                ))}
          </g>
        );
      })}
      {/* simbol panas: api kecil SVG beranimasi (bukan emoji) */}
      <g transform="translate(292,52)">
        {/* nyala luar */}
        <path d="M8 0 q 8 8 5 16 q -2 6 -8 6 q -6 0 -8 -6 q -3 -8 11 -16" fill="#ff7a45" opacity="0.9">
          <animate attributeName="d"
            values="M8 0 q 8 8 5 16 q -2 6 -8 6 q -6 0 -8 -6 q -3 -8 11 -16;
                    M8 2 q 7 7 4 14 q -2 5 -8 5 q -6 0 -8 -5 q -3 -7 12 -14;
                    M8 0 q 8 8 5 16 q -2 6 -8 6 q -6 0 -8 -6 q -3 -8 11 -16"
            dur="1.1s" repeatCount="indefinite" />
        </path>
        {/* nyala dalam */}
        <path d="M8 8 q 4 4 3 9 q -1 4 -3 4 q -2 0 -3 -4 q -1 -5 3 -9" fill="#ffb454">
          <animate attributeName="d"
            values="M8 8 q 4 4 3 9 q -1 4 -3 4 q -2 0 -3 -4 q -1 -5 3 -9;
                    M8 10 q 3 3 2 7 q -1 3 -2 3 q -1 0 -2 -3 q -1 -4 2 -7;
                    M8 8 q 4 4 3 9 q -1 4 -3 4 q -2 0 -3 -4 q -1 -5 3 -9"
            dur="0.9s" repeatCount="indefinite" />
        </path>
      </g>
      <text x="292" y="86" textAnchor="middle" fontSize="8" fill="#ff7a45" fontFamily="monospace">panas</text>
    </svg>
  );
}

/* Fallback generik: molekul bereaksi dalam lingkaran energi */
function GenericDiagram({ id, className }: { id: string; className?: string }) {
  const hue = [...id].reduce((a, ch) => a + ch.charCodeAt(0), 0) % 360;
  const color = `hsl(${hue} 55% 60%)`;
  return (
    <svg viewBox="0 0 320 120" className={className} role="img" aria-label="Ilustrasi reaksi kimia">
      <circle cx="90" cy="60" r="26" fill="none" stroke={color} strokeWidth="2" opacity="0.7">
        <animate attributeName="r" values="24;28;24" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="230" cy="60" r="26" fill="none" stroke={C.green} strokeWidth="2" opacity="0.7">
        <animate attributeName="r" values="28;24;28" dur="3s" repeatCount="indefinite" />
      </circle>
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <line key={deg} x1="160" y1="60" x2="160" y2="38" stroke="currentColor" strokeWidth="1.5" opacity="0.35"
          transform={`rotate(${deg} 160 60)`}>
          <animate attributeName="opacity" values="0.1;0.5;0.1" dur={`${2 + deg / 200}s`} repeatCount="indefinite" />
        </line>
      ))}
      <text x="160" y="108" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.5" fontFamily="monospace">{id}</text>
    </svg>
  );
}
