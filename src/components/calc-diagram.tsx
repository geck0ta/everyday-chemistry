"use client";

import { useMemo } from "react";

/** Diagram animasi mini per mode kalkulator — muncul di atas langkah penyelesaian.
 *  Semua SVG 320x90, gaya konsisten dengan diagram explorer. */
export default function CalcDiagram({ mode, value }: { mode: string; value: number }) {
  const visual = useMemo(() => {
    switch (mode) {
      case "molar-mass": return <MolarMassVisual value={value} />;
      case "mol": return <MolVisual />;
      case "mass": return <MassVisual />;
      case "molarity": return <BeakerVisual />;
      case "dilution": return <DilutionVisual />;
      case "ph": return <PhVisual ph={value} />;
      case "heat": return <HeatVisual exo={true} q={value} />;
      case "dh": return <HeatVisual exo={false} q={value} />;
      case "gas": return <GasVisual v={value} />;
      case "limiting": return <LimitingVisual />;
      case "yield": return <YieldVisual pct={Math.max(0, Math.min(100, value))} />;
      case "balance": return null;
      default: return null;
    }
  }, [mode, value]);

  if (!visual) return null;
  return (
    <div className="mt-5 rounded-xl px-2 pt-3 pb-1" style={{ background: "color-mix(in srgb, var(--surface-solid) 55%, transparent)" }}>
      {visual}
    </div>
  );
}

/* Massa molar: atom-atom bergabung jadi molekul */
function MolarMassVisual({ value }: { value: number }) {
  void value;
  const atoms = [
    { x: 130, r: 11, c: "#6aa5ff" },
    { x: 160, r: 8, c: "#e05c7a" },
    { x: 190, r: 13, c: "#34e0a1" },
  ];
  return (
    <svg viewBox="0 0 320 90" className="w-full" role="img" aria-label="Atom-atom bergabung membentuk molekul">
      {atoms.map((a, i) => (
        <g key={i}>
          <circle cx={a.x} cy="38" r={a.r} fill={a.c} opacity="0.85">
            <animate attributeName="cx"
              values={`${a.x};${160 + (i - 1) * 18};${160 + (i - 1) * 18}`}
              dur="1.2s" begin={`${i * 0.15}s`} fill="freeze" />
            <animate attributeName="opacity" values="0.85;0.85;0.4" dur="1.2s" begin={`${i * 0.15}s`} fill="freeze" />
          </circle>
        </g>
      ))}
      {/* ikatan */}
      {[151, 169].map((x, i) => (
        <line key={i} x1={x} y1="38" x2={x + 9} y2="38" stroke="var(--accent)" strokeWidth="2">
          <animate attributeName="opacity" values="0;0;1" dur="0.5s" begin={`${0.9 + i * 0.1}s`} fill="freeze" />
        </line>
      ))}
      <text x="160" y="76" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">
        jumlah massa semua atom = massa molar
      </text>
    </svg>
  );
}

/* Mol: tumpukan unit molekul terhitung */
function MolVisual() {
  return (
    <svg viewBox="0 0 320 90" className="w-full" role="img" aria-label="Kotak-kotak mol tersusun seperti lusin besar">
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={110 + (i % 6) * 17} y={22 + Math.floor(i / 6) * 20}
          width="13" height="16" rx="3" fill="#6aa5ff" opacity="0.7">
          <animate attributeName="y" values={`${14 + Math.floor(i / 6) * 20};${22 + Math.floor(i / 6) * 20}`}
            dur="0.4s" begin={`${i * 0.06}s`} fill="freeze" />
          <animate attributeName="opacity" values="0;0.7" dur="0.3s" begin={`${i * 0.06}s`} fill="freeze" />
        </rect>
      ))}
      {/* kotak ke-13 menyala (avogadro) */}
      <rect x="217" y="42" width="13" height="16" rx="3" fill="var(--accent)">
        <animate attributeName="opacity" values="0;1" dur="0.4s" begin="0.9s" fill="freeze" />
      </rect>
      <text x="238" y="54" fontSize="9" fill="var(--accent)" fontFamily="monospace">×6.02×10²³</text>
      <text x="160" y="76" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">
        n = m / M — menghitung jumlah partikel
      </text>
    </svg>
  );
}

/* Massa zat: mol ditimbang */
function MassVisual() {
  return (
    <svg viewBox="0 0 320 90" className="w-full" role="img" aria-label="Neraca menimbang massa zat dari mol">
      {/* neraca */}
      <line x1="120" y1="40" x2="200" y2="40" stroke="var(--muted)" strokeWidth="2.5" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" values="-8 160 40;0 160 40" dur="0.8s" fill="freeze" />
      </line>
      <polygon points="160,40 154,52 166,52" fill="var(--muted)" />
      {/* piring kiri dengan mol */}
      <g>
        <path d="M100 56 h36 l-5 10 h-26 z" fill="var(--border)" />
        <circle cx="112" cy="50" r="5" fill="#6aa5ff"><animate attributeName="cy" values="30;50" dur="0.6s" fill="freeze" /></circle>
        <circle cx="124" cy="50" r="5" fill="#6aa5ff"><animate attributeName="cy" values="28;50" dur="0.7s" begin="0.1s" fill="freeze" /></circle>
      </g>
      {/* piring kanan dengan bobot */}
      <g>
        <path d="M184 56 h36 l-5 10 h-26 z" fill="var(--border)" />
        <rect x="193" y="46" width="18" height="10" rx="2" fill="#ffb454">
          <animate attributeName="y" values="32;46" dur="0.7s" begin="0.15s" fill="freeze" />
        </rect>
      </g>
      <text x="160" y="80" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">
        m = n × M — dari mol ke gram
      </text>
    </svg>
  );
}

/* Molaritas: gelas berisi larutan terisi */
function BeakerVisual() {
  return (
    <svg viewBox="0 0 320 90" className="w-full" role="img" aria-label="Gelas kimia terisi larutan dengan partikel terlarut">
      {/* gelas */}
      <path d="M130 14 L136 74 Q137 79 143 79 L177 79 Q183 79 184 74 L190 14"
        fill="none" stroke="var(--muted)" strokeWidth="2" />
      {/* cairan naik */}
      <path d="M134 40 L138 72 Q139 75.5 144 75.5 L176 75.5 Q181 75.5 182 72 L186 40 Z"
        fill="#5b8def" opacity="0.45">
        <animate attributeName="d"
          values="M135 68 L138.5 72 Q139.5 75.5 144 75.5 L176 75.5 Q180.5 75.5 181.5 72 L185 68 Z;
                  M134 40 L138 72 Q139 75.5 144 75.5 L176 75.5 Q181 75.5 182 72 L186 40 Z"
          dur="1s" fill="freeze" />
      </path>
      {/* partikel terlarut */}
      {[150, 162, 156, 168].map((x, i) => (
        <circle key={i} cx={x} cy={[62, 58, 66, 54][i]} r="2.5" fill="#5b8def">
          <animate attributeName="cy" values={`${[40, 44, 36, 48][i]};${[62, 58, 66, 54][i]}`} dur={`0.6s`} begin={`${i * 0.1}s`} fill="freeze" />
          <animateTransform attributeName="transform" type="translate"
            values={`0 0; ${i % 2 ? 2 : -2}, 0; 0 0`} dur={`${1.2 + i * 0.2}s`} repeatCount="indefinite" additive="sum" />
        </circle>
      ))}
      <text x="160" y="88" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">
        M = n / V — partikel dalam tiap liter
      </text>
    </svg>
  );
}

/* Pengenceran: warna muda karena volume bertambah */
function DilutionVisual() {
  return (
    <svg viewBox="0 0 320 90" className="w-full" role="img" aria-label="Larutan pekat menjadi encer setelah air ditambahkan">
      {/* gelas pekat */}
      <path d="M95 18 L101 70 Q102 74 107 74 L133 74 Q138 74 139 70 L145 18" fill="none" stroke="var(--muted)" strokeWidth="1.8" />
      <path d="M99 34 L103.5 67 Q104.5 70.5 109 70.5 L129 70.5 Q133.5 70.5 134.5 67 L141 34 Z" fill="#e05c7a" opacity="0.65" />
      <text x="120" y="86" textAnchor="middle" fontSize="8" fill="#e05c7a" fontFamily="monospace">pekat</text>

      {/* panah + tetes air */}
      {[165, 178].map((x, i) => (
        <path key={x} d={`M ${x} 30 q 3.5 6 0 10 q -3.5 -4 0 -10`} fill="#5b8def">
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 22" dur={`${0.9 + i * 0.25}s`} repeatCount="indefinite" begin={`${i * 0.35}s`} />
          <animate attributeName="opacity" values="1;0" dur={`${0.9 + i * 0.25}s`} repeatCount="indefinite" begin={`${i * 0.35}s`} />
        </path>
      ))}

      {/* gelas encer */}
      <path d="M215 18 L221 70 Q222 74 227 74 L253 74 Q258 74 259 70 L265 18" fill="none" stroke="var(--muted)" strokeWidth="1.8" />
      <path d="M219 24 L223.5 67 Q224.5 70.5 229 70.5 L249 70.5 Q253.5 70.5 254.5 67 L261 24 Z" fill="#f0a8b8" opacity="0.5" />
      <text x="240" y="86" textAnchor="middle" fontSize="8" fill="#f0a8b8" fontFamily="monospace">encer</text>

      <text x="160" y="98" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace" display="none">.</text>
    </svg>
  );
}

/* pH: skala warna dengan penunjuk */
function PhVisual({ ph }: { ph: number }) {
  const clamped = Math.max(0, Math.min(14, ph));
  const pos = (clamped / 14) * 280;
  return (
    <svg viewBox="0 0 320 90" className="w-full" role="img" aria-label="Penunjuk pH pada skala warna indikator universal">
      {/* strip gradasi */}
      <defs>
        <linearGradient id="phgrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c62828" />
          <stop offset="21%" stopColor="#e8935c" />
          <stop offset="50%" stopColor="#34e0a1" />
          <stop offset="78%" stopColor="#5b8def" />
          <stop offset="100%" stopColor="#7a5cd6" />
        </linearGradient>
      </defs>
      <rect x="20" y="34" width="280" height="16" rx="8" fill="url(#phgrad)" opacity="0.85" />
      {/* angka */}
      {[0, 7, 14].map((n, i) => (
        <text key={n} x={20 + i * 140} y="66" textAnchor="middle" fontSize="8.5" fill="var(--muted)" fontFamily="monospace">{n}</text>
      ))}
      {/* penunjuk segitiga */}
      <polygon points={`${pos - 7},26 ${pos + 7},26 ${pos},14` } fill="var(--accent)">
        <animate attributeName="points"
          from="153,26 167,26 160,14"
          to={`${pos - 7},26 ${pos + 7},26 ${pos},14`}
          dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.3 0 0.3 1" />
      </polygon>
      <text x="160" y="84" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">
        pH = −log [H⁺]
      </text>
    </svg>
  );
}

/* Kalor / ΔH: termometer & arah panas */
function HeatVisual({ exo, q }: { exo: boolean; q: number }) {
  void q;
  // eksotermik: panas keluar sistem; endotermik: masuk
  const arrowDir = exo ? 1 : -1;
  return (
    <svg viewBox="0 0 320 90" className="w-full" role="img" aria-label={exo ? "Panas keluar dari sistem" : "Panas masuk ke sistem"}>
      {/* kotak sistem */}
      <rect x="120" y="18" width="80" height="50" rx="10" fill="none" stroke="var(--muted)" strokeWidth="1.8" />
      <text x="160" y="47" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.7" fontFamily="monospace">sistem</text>

      {/* panah kalor */}
      {[0, 1].map((i) => {
        const x = exo ? 214 + i * 22 : 62 - i * 22;
        return (
          <g key={i}>
            <line x1={x} y1="43" x2={x + 16 * arrowDir} y2="43" stroke="#ff7a45" strokeWidth="2.5" strokeLinecap="round">
              <animate attributeName="stroke-dashoffset" values={exo ? "12;0" : "0;12"} dur="0.7s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;1;0.3" dur={`${0.8 + i * 0.2}s`} begin={`${i * 0.15}s`} repeatCount="indefinite" />
            </line>
            <polygon points={exo ? `${x + 16},${39} ${x + 24},${43} ${x + 16},${47}` : `${x},${39} ${x - 8},${43} ${x},${47}`}
              fill="#ff7a45">
              <animate attributeName="opacity" values="0.3;1;0.3" dur={`${0.8 + i * 0.2}s`} begin={`${i * 0.15}s`} repeatCount="indefinite" />
            </polygon>
          </g>
        );
      })}
      <text x="278" y="47" fontSize="9" fill="#ff7a45" fontFamily="monospace">{exo ? "kalor ↑" : ""}</text>
      <text x="18" y="47" fontSize="9" fill="#5b8def" fontFamily="monospace">{!exo ? "↓ kalor" : ""}</text>

      <text x="160" y="82" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">
        {exo ? "eksotermik — sistem melepas kalor" : "endotermik — sistem menyerap kalor"}
      </text>
    </svg>
  );
}

/* Gas ideal: silinder piston yang bergerak */
function GasVisual({ v }: { v: number }) {
  // normalisasi volume untuk tinggi piston (log agar tidak ekstrem)
  const norm = Math.max(0.15, Math.min(0.95, Math.log10(Math.max(v, 1e-4) / 1e-4) / 4));
  const gasH = 20 + norm * 44;
  return (
    <svg viewBox="0 0 320 90" className="w-full" role="img" aria-label="Silinder gas dengan piston yang bergerak sesuai volume">
      {/* silinder */}
      <line x1="130" y1="14" x2="130" y2="76" stroke="var(--muted)" strokeWidth="2" />
      <line x1="190" y1="14" x2="190" y2="76" stroke="var(--muted)" strokeWidth="2" />
      <line x1="130" y1="76" x2="190" y2="76" stroke="var(--muted)" strokeWidth="2" />
      {/* gas */}
      <rect x="131" y={76 - gasH} width="58" height={gasH} fill="#4aa8bd" opacity="0.3"
        style={{ transition: "all .4s ease" }} />
      {/* piston */}
      <rect x="128" y={76 - gasH - 7} width="64" height="7" rx="2" fill="var(--muted)"
        style={{ transition: "all .4s ease" }} />
      {/* partikel gas */}
      {Array.from({ length: 7 }).map((_, i) => (
        <circle key={i} cx={140 + (i % 3) * 16} cy={76 - gasH / 2 + ((i % 3) - 1) * 8}
          r="2.5" fill="#4aa8bd">
          <animateTransform attributeName="transform" type="translate"
            values={`0 0; ${(i % 2 ? 4 : -4)}, ${(i % 3 ? -3 : 3)}; 0 0`}
            dur={`${0.8 + i * 0.15}s`} repeatCount="indefinite" additive="sum" />
        </circle>
      ))}
      <text x="160" y="88" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">
        PV = nRT — tekanan piston menyeimbangkan gas
      </text>
    </svg>
  );
}

/* Pereaksi pembatas: dua reaktan, satu habis duluan */
function LimitingVisual() {
  return (
    <svg viewBox="0 0 320 90" className="w-full" role="img" aria-label="Satu reaktan habis lebih dulu membatasi produk">
      {/* reaktan A (habis) */}
      {[105, 125].map((x, i) => (
        <circle key={x} cx={x} cy="40" r="8" fill="#6aa5ff" opacity="0.85">
          <animate attributeName="opacity" values="0.85;0;0" dur="1.6s" begin={`${i * 0.3}s`} fill="freeze" />
          <animate attributeName="r" values="8;2;2" dur="1.6s" begin={`${i * 0.3}s`} fill="freeze" />
        </circle>
      ))}
      {/* reaktan B (sisa) */}
      {[195, 215].map((x, i) => (
        <circle key={x} cx={x} cy="40" r="8" fill="#ffb454" opacity="0.85">
          {i === 0 && <>
            <animate attributeName="opacity" values="0.85;0;0" dur="1.6s" fill="freeze" />
            <animate attributeName="r" values="8;2;2" dur="1.6s" fill="freeze" />
          </>}
          {i === 1 && <>
            <animate attributeName="opacity" values="0.85;0.85" dur="1.6s" fill="freeze" />
            <animate attributeName="cx" values="215;240;240" dur="1.6s" fill="freeze" />
          </>}
        </circle>
      ))}
      {/* produk */}
      {[155, 172].map((x, i) => (
        <rect key={x} x={x} y="33" width="13" height="13" rx="3" fill="#34e0a1" opacity="0">
          <animate attributeName="opacity" values="0;0;0.85" dur="1.6s" begin={`${0.8 + i * 0.2}s`} fill="freeze" />
          <animate attributeName="x" values={`${x};${x - 6};${x - 6}`} dur="1.6s" begin={`${0.8 + i * 0.2}s`} fill="freeze" />
        </rect>
      ))}
      <text x="115" y="62" textAnchor="middle" fontSize="8" fill="#6aa5ff" fontFamily="monospace">pembatas</text>
      <text x="228" y="62" textAnchor="middle" fontSize="8" fill="#ffb454" fontFamily="monospace">sisa</text>
      <text x="163" y="62" textAnchor="middle" fontSize="8" fill="#34e0a1" fontFamily="monospace">produk</text>
    </svg>
  );
}

/* Persen hasil: progress bar hasil aktual vs teoretis */
function YieldVisual({ pct }: { pct: number }) {
  return (
    <svg viewBox="0 0 320 90" className="w-full" role="img" aria-label="Perbandingan hasil teoretis dan aktual">
      {/* teoretis (outline) */}
      <rect x="60" y="20" width="200" height="16" rx="8" fill="none" stroke="var(--muted)" strokeWidth="1.5" />
      <text x="268" y="32" fontSize="9" fill="var(--muted)" fontFamily="monospace">teoretis</text>
      {/* aktual (filled) */}
      <rect x="60" y="46" width="200" height="16" rx="8" fill="none" stroke="var(--muted)" strokeWidth="1.5" />
      <rect x="60" y="46" width={(pct / 100) * 200} height="16" rx="8" fill="#34e0a1" opacity="0.8">
        <animate attributeName="width" from="0" to={(pct / 100) * 200} dur="1s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1" />
      </rect>
      <text x="268" y="58" fontSize="9" fill="#34e0a1" fontFamily="monospace">aktual</text>
      <text x="160" y="80" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">
        % hasil = aktual / teoretis × 100
      </text>
    </svg>
  );
}
