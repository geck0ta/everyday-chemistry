"use client";

import { useMemo, useState } from "react";
import { FlaskConical, Atom, Thermometer, Shield, Zap, Droplet, TestTube } from "lucide-react";
import {
  titrationCurve, equilibriumConcentrations, reactionRate,
  type TitrationPoint,
} from "@/lib/simulation";
import {
  BUFFER_SYSTEMS, bufferPh, addAcidToBuffer, addBaseToBuffer, bufferCurve,
  type BufferSystem,
} from "@/lib/buffer-sim";
import { ELECTRODES, voltaCell, type Electrode } from "@/lib/volta-sim";
import ErrorBoundary from "@/components/error-boundary";

/* ---------- Grafik SVG dengan animasi menggambar ---------- */
function LineChart({ data, xLabel, yLabel, marker, markerLabel, color = "var(--accent)", keyAnim }: {
  data: { x: number; y: number }[];
  xLabel: string;
  yLabel: string;
  marker?: { x: number };
  markerLabel?: string;
  color?: string;
  keyAnim: string; // memicu ulang animasi gambar saat parameter berubah
}) {
  const W = 560, H = 300, PAD = 44;
  const xs = data.map((d) => d.x), ys = data.map((d) => d.y);
  const xMin = Math.min(...xs), xMax = Math.max(...xs);
  const yMin = Math.min(...ys, 0), yMax = Math.max(...ys);

  const sx = (x: number) => PAD + ((x - xMin) / (xMax - xMin)) * (W - PAD - 12);
  const sy = (y: number) => H - PAD - ((y - yMin) / (yMax - yMin || 1)) * (H - PAD - 16);

  const path = data.map((d, i) => `${i ? "L" : "M"} ${sx(d.x)} ${sy(d.y)}`).join(" ");
  const yTicks = Array.from({ length: 6 }, (_, i) => yMin + ((yMax - yMin) / 5) * i);
  const pathLen = 1200;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Grafik ${yLabel} terhadap ${xLabel}`}>
      {yTicks.map((t, i) => (
        <g key={i}>
          <line x1={PAD} y1={sy(t)} x2={W - 12} y2={sy(t)} stroke="var(--border)" strokeWidth="0.7" />
          <text x={PAD - 6} y={sy(t) + 3} textAnchor="end" fontSize="9" fill="var(--muted)" fontFamily="monospace">
            {t.toFixed(Math.abs(yMax - yMin) < 10 ? 1 : 0)}
          </text>
        </g>
      ))}
      <line x1={PAD} y1={H - PAD} x2={W - 12} y2={H - PAD} stroke="var(--muted)" strokeWidth="1" />
      <line x1={PAD} y1="14" x2={PAD} y2={H - PAD} stroke="var(--muted)" strokeWidth="1" />
      <text x={(W + PAD) / 2} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--muted)">{xLabel}</text>
      <text x="12" y={(H - PAD + 20) / 2} fontSize="10" fill="var(--muted)" transform={`rotate(-90 12 ${(H - PAD + 20) / 2})`} textAnchor="middle">{yLabel}</text>

      {/* garis netral pH 7 */}
      <line x1={PAD} y1={sy(7)} x2={W - 12} y2={sy(7)} stroke="#9d6fd6" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.5" />

      {/* marker titik ekivalen */}
      {marker && (
        <g opacity="0">
          <line x1={sx(marker.x)} y1="14" x2={sx(marker.x)} y2={H - PAD} stroke="#e05c7a" strokeWidth="1.2" strokeDasharray="4 3" />
          {markerLabel && (
            <text x={sx(marker.x) + 5} y="26" fontSize="9.5" fill="#e05c7a" fontFamily="monospace">{markerLabel}</text>
          )}
          <animate attributeName="opacity" values="0;0;1" dur="1.6s" key={keyAnim} fill="freeze" />
        </g>
      )}

      {/* kurva — animasi menggambar dari kiri */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeDasharray={pathLen}
        style={{ filter: `drop-shadow(0 0 6px color-mix(in srgb, ${color} 40%, transparent))` }}
      >
        <animate attributeName="stroke-dashoffset" from={pathLen} to="0" dur="1.4s" key={keyAnim} fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1" />
      </path>

      {[xMin, (xMin + xMax) / 2, xMax].map((t, i) => (
        <text key={i} x={sx(t)} y={H - PAD + 14} textAnchor="middle" fontSize="9" fill="var(--muted)" fontFamily="monospace">
          {Math.round(t * 10) / 10}
        </text>
      ))}
    </svg>
  );
}

/* ---------- Slider ---------- */
function Slider({ label, value, min, max, step, unit, onChange }: {
  label: string; value: number; min: number; max: number; step: number; unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label className="text-xs font-medium text-[var(--muted)]">{label}</label>
        <span className="font-mono text-xs font-semibold text-[var(--accent)]">
          {value}{unit ? ` ${unit}` : ""}
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-6 w-full cursor-pointer accent-[var(--accent)] max-md:h-8"
        aria-label={`${label}: ${value}${unit ? " " + unit : ""}`}
      />
    </div>
  );
}

type SimMode = "titration" | "buffer" | "volta" | "equilibrium" | "rate" | "ph-lab" | "electrolysis-lab" | "metal-lab";

const MODES: { id: SimMode; label: string; icon: typeof FlaskConical; group: "sim" | "lab" }[] = [
  { id: "titration", label: "Titrasi Asam–Basa", icon: FlaskConical, group: "sim" },
  { id: "buffer", label: "Larutan Penyangga", icon: Shield, group: "sim" },
  { id: "volta", label: "Sel Volta", icon: Zap, group: "sim" },
  { id: "equilibrium", label: "Kesetimbangan", icon: Atom, group: "sim" },
  { id: "rate", label: "Laju Reaksi & Suhu", icon: Thermometer, group: "sim" },
  { id: "ph-lab", label: "Indikator pH", icon: Droplet, group: "lab" },
  { id: "electrolysis-lab", label: "Elektrolisis Air", icon: Zap, group: "lab" },
  { id: "metal-lab", label: "Logam + Asam", icon: TestTube, group: "lab" },
];

/* warna indikator universal berdasarkan pH */
function phColor(ph: number): string {
  if (ph < 3) return "#e05c7a";       // merah — asam kuat
  if (ph < 6) return "#e8935c";       // oranye
  if (ph <= 8) return "#34e0a1";      // hijau — netral
  if (ph < 11) return "#5b8def";      // biru
  return "#9d6fd6";                   // ungu — basa kuat
}

/** Labu titrasi dengan larutan berubah warna sesuai pH */
function TitrationFlask({ currentPh, addedVol, maxVol }: {
  currentPh: number;
  addedVol: number;
  maxVol: number;
}) {
  const color = phColor(currentPh);
  const fillPct = Math.min((addedVol / maxVol) * 100, 85);
  
  return (
    <div className="mb-4 flex justify-center">
      <svg viewBox="0 0 160 200" className="h-40 w-auto">
        {/* labu kontur */}
        <path
          d="M 50 20 L 55 60 L 45 80 Q 40 100 40 120 Q 40 160 80 170 Q 120 160 120 120 Q 120 100 115 80 L 105 60 L 110 20 Z"
          fill="none"
          stroke="var(--muted)"
          strokeWidth="1.5"
        />
        {/* cairan dalam labu dengan hue pH */}
        <path
          d="M 50 60 L 45 80 Q 40 100 40 120 Q 40 160 80 170 Q 120 160 120 120 Q 120 100 115 80 L 105 60 Z"
          fill={color}
          opacity="0.5"
          style={{ transition: "fill 0.5s ease, opacity 0.5s ease" }}
        />
        {/* garis pengisi larutan */}
        <line
          x1="45"
          y1={70 + (85 - fillPct) * 1.05}
          x2="115"
          y2={70 + (85 - fillPct) * 1.05}
          stroke={color}
          strokeWidth="1.5"
          opacity="0.7"
          style={{ transition: "y1 0.3s, y2 0.3s, stroke 0.5s ease" }}
        />
        {/* label pH */}
        <text
          x="80"
          y="140"
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fill={color}
          fontFamily="monospace"
          style={{ transition: "fill 0.5s ease" }}
        >
          {currentPh.toFixed(1)}
        </text>
      </svg>
    </div>
  );
}

/* ============ LAB 1: Indikator pH ============ */
function PhMixLab() {
  const [acidMl, setAcidMl] = useState(10);
  const [baseMl, setBaseMl] = useState(0);
  const CONC = 0.1;

  const result = useMemo(() => {
    const hMol = (acidMl / 1000) * CONC;
    const ohMol = (baseMl / 1000) * CONC;
    const totalVol = (acidMl + baseMl) / 1000;
    if (totalVol === 0) return { ph: 7, excess: "neutral" as const };

    const diff = hMol - ohMol;
    let ph: number, excess: "acid" | "base" | "neutral";
    if (Math.abs(diff) < 1e-12) { ph = 7; excess = "neutral"; }
    else if (diff > 0) { ph = -Math.log10(diff / totalVol); excess = "acid"; }
    else { ph = 14 + Math.log10(-diff / totalVol); excess = "base"; }
    return { ph: Math.max(0, Math.min(14, Math.round(ph * 100) / 100)), excess };
  }, [acidMl, baseMl]);

  const color = phColor(result.ph);

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <div className="space-y-5">
        <h3 className="text-sm font-semibold">Campur larutan</h3>
        <Slider label="HCl 0,1 M" value={acidMl} min={0} max={30} step={1} unit="mL" onChange={setAcidMl} />
        <Slider label="NaOH 0,1 M" value={baseMl} min={0} max={30} step={1} unit="mL" onChange={setBaseMl} />
      </div>

      <div>
        {/* gelas besar */}
        <svg viewBox="0 0 320 160" className="w-full" role="img" aria-label="Gelas kimia berisi campuran dengan warna sesuai pH">
          {/* gelas */}
          <path d="M100 20 L108 138 Q109 144 116 144 L204 144 Q211 144 212 138 L220 20"
            fill="none" stroke="var(--muted)" strokeWidth="2" />
          {/* cairan — ketinggian proporsional total volume */}
          {(() => {
            const h = 20 + ((acidMl + baseMl) / 60) * 90;
            return (
              <path
                d={`M ${104 - (20 - h) * 0.08} ${144 - h} L ${108 - (20 - h) * 0.05} 136 Q 109 140 116 140 L 204 140 Q 211 140 212 136 L ${216 + (20 - h) * 0.05} ${144 - h} Z`}
                fill={color}
                opacity="0.55"
                style={{ transition: "all .4s ease" }}
              />
            );
          })()}
          {/* gelembung saat reaksi */}
          {Math.min(acidMl, baseMl) > 2 && acidMl !== baseMl && [150, 170, 190].map((x, i) => (
            <circle key={x} cx={x} cy="130" r="2.5" fill={color}>
              <animate attributeName="cy" values={`130;${144 - 20 - ((acidMl + baseMl) / 60) * 90}`} dur={`${1 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.3}s`} />
              <animate attributeName="opacity" values="0;0.9;0" dur={`${1 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.3}s`} />
            </circle>
          ))}
          {/* pH meter */}
          <text x="262" y="70" fontSize="26" fontWeight="bold" fill={color} fontFamily="monospace">
            {result.ph.toFixed(1)}
          </text>
          <text x="262" y="86" fontSize="9" fill="var(--muted)">pH</text>
        </svg>

        <p className="mt-3 rounded-xl px-4 py-2.5 text-xs leading-relaxed" style={{ background: "var(--accent-soft)" }}>
          {result.excess === "neutral"
            ? "Netral! Mol H⁺ = mol OH⁻ — netralisasi sempurna."
            : result.excess === "acid"
              ? `Asam berlebih ${(Math.abs(acidMl - baseMl)).toFixed(0)} mL — sisa H⁺ menentukan pH.`
              : `Basa berlebih ${(Math.abs(acidMl - baseMl)).toFixed(0)} mL — sisa OH⁻ menaikkan pH.`}
        </p>
      </div>
    </div>
  );
}

/* ============ LAB 2: Elektrolisis Air ============ */
function ElectrolysisLab() {
  const [minutes, setMinutes] = useState(5);
  const [current, setCurrent] = useState(2);
  const [running, setRunning] = useState(false);

  const FARADAY = 96485;
  const charge = current * minutes * 60;
  const eMol = charge / FARADAY;
  const h2Mol = eMol / 2;
  const o2Mol = eMol / 4;
  const h2H = Math.min((h2Mol * 24) * 18, 90);
  const o2H = h2H / 2;

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <div className="space-y-5">
        <h3 className="text-sm font-semibold">Elektrolisis air</h3>
        <Slider label="Waktu" value={minutes} min={1} max={20} step={1} unit="menit" onChange={setMinutes} />
        <Slider label="Arus" value={current} min={1} max={5} step={1} unit="A" onChange={setCurrent} />
        <button
          onClick={() => setRunning(!running)}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
          style={{ background: running ? "var(--accent-soft)" : "var(--accent)", color: running ? "var(--accent)" : "#fff" }}
        >
          <Zap size={14} strokeWidth={1.75} fill={running ? "var(--accent)" : "#fff"} />
          {running ? "Matikan arus" : "Nyalakan arus"}
        </button>
        <div className="rounded-xl px-3.5 py-2.5 text-xs leading-relaxed" style={{ background: "var(--accent-soft)" }}>
          Muat listrik: <b>{charge.toFixed(0)} C</b> = {eMol.toFixed(4)} mol e⁻<br />
          H₂: {h2Mol.toFixed(4)} mol · O₂: {o2Mol.toFixed(4)} mol
        </div>
      </div>

      <div>
        <svg viewBox="0 0 320 180" className="w-full" role="img" aria-label="Sel elektrolisis dengan dua tabung gas, H2 dua kali O2">
          {/* wadah air */}
          <rect x="40" y="40" width="240" height="120" rx="10" fill="#4aa8bd" opacity="0.12" stroke="var(--muted)" strokeWidth="1.2" />
          {/* dua tabung uji terbalik */}
          <rect x="95" y={130 - h2H} width="46" height={h2H} rx="6" fill="#5b8def" opacity="0.45"
            style={{ transition: "all .5s ease" }} />
          <rect x="179" y={130 - o2H} width="46" height={o2H} rx="6" fill="#34e0a1" opacity="0.45"
            style={{ transition: "all .5s ease" }} />
          {/* elektroda */}
          <rect x="112" y="118" width="10" height="38" rx="2" fill="var(--muted)" />
          <rect x="198" y="118" width="10" height="38" rx="2" fill="var(--muted)" />
          {/* kabel & baterai */}
          <path d="M117 118 Q117 22 160 22 M203 118 Q203 22 160 22" fill="none" stroke="var(--muted)" strokeWidth="1.5" />
          <rect x="146" y="14" width="28" height="16" rx="3" fill={running ? "#ffb454" : "var(--border)"}
            style={{ transition: "background .3s" }} />
          <text x="160" y="25" textAnchor="middle" fontSize="9" fontWeight="bold"
            fill={running ? "#000" : "var(--muted)"}>{current}A</text>
          {/* gelembung saat running */}
          {running && [112, 122, 197, 205].map((x, i) => (
            <circle key={x} cx={x + (i % 2) * 4} cy="115" r="2" fill="#bfe3ff">
              <animate attributeName="cy" values="115;40" dur={`${0.8 + (i % 3) * 0.25}s`} repeatCount="indefinite" begin={`${i * 0.2}s`} />
              <animate attributeName="opacity" values="0;1;0" dur={`${0.8 + (i % 3) * 0.25}s`} repeatCount="indefinite" begin={`${i * 0.2}s`} />
            </circle>
          ))}
          {/* label gas */}
          <text x="118" y={124 - h2H - 6} textAnchor="middle" fontSize="10" fill="#5b8def" fontFamily="monospace">H₂</text>
          <text x="202" y={124 - o2H - 6} textAnchor="middle" fontSize="10" fill="#34e0a1" fontFamily="monospace">O₂</text>
          {/* label rasio */}
          <text x="160" y="168" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">
            H₂ : O₂ selalu 2 : 1 (hukum Faraday)
          </text>
        </svg>
      </div>
    </div>
  );
}

/* ============ LAB 3: Logam + Asam ============ */
const METALS = [
  { id: "Mg", name: "Magnesium", color: "#d4d4d8", reacts: true },
  { id: "Zn", name: "Seng", color: "#a8b2bd", reacts: true },
  { id: "Fe", name: "Besi", color: "#8a8f98", reacts: true },
  { id: "Cu", name: "Tembaga", color: "#c97b4a", reacts: false },
] as const;

function MetalAcidLab() {
  const [metal, setMetal] = useState<(typeof METALS)[number]["id"]>("Mg");
  const [temp, setTemp] = useState(25);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const spec = METALS.find((m) => m.id === metal)!;
  const FACTORS: Record<string, number> = { Mg: 5, Zn: 2, Fe: 0.6, Cu: 0 };
  const factor = FACTORS[metal] ?? 0;
  const tempFactor = Math.pow(2, (temp - 25) / 10);
  const rate = factor * tempFactor * 0.02;

  const progress = Math.min(running ? elapsed * rate : 0, 100);
  const bubblesPerSec = Math.round(rate * 3);

  useMemo(() => {
    if (!running || !spec.reacts || progress >= 100) return;
    const iv = setInterval(() => setElapsed((e) => e + 0.1), 100);
    return () => clearInterval(iv);
  }, [running, spec.reacts, progress]);

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <div className="space-y-5">
        <h3 className="text-sm font-semibold">Pilih logam & suhu</h3>
        <div className="grid grid-cols-2 gap-2">
          {METALS.map((m) => (
            <button key={m.id}
              onClick={() => { setMetal(m.id); setRunning(false); setElapsed(0); }}
              className={`rounded-xl px-3 py-2.5 text-left text-xs transition-all ${
                metal === m.id ? "" : "glass hover:border-[var(--accent)]/40"
              }`}
              style={metal === m.id
                ? { background: "var(--accent-soft)", border: "1px solid var(--accent)" }
                : undefined}>
              <span className="block w-full h-2 rounded-full mb-1.5" style={{ background: m.color }} />
              <span className={metal === m.id ? "font-semibold text-[var(--accent)]" : ""}>{m.name}</span>
            </button>
          ))}
        </div>
        <Slider label="Suhu asam" value={temp} min={10} max={80} step={5} unit="°C" onChange={setTemp} />
        <button
          onClick={() => { setRunning(true); setElapsed(0); }}
          disabled={!spec.reacts}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all disabled:opacity-40"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          <TestTube size={13} strokeWidth={2} /> Masukkan ke asam
        </button>
      </div>

      <div>
        <svg viewBox="0 0 320 180" className="w-full" role="img" aria-label="Tabung reaksi berisi logam dalam asam">
          <path d="M120 15 L126 155 Q127 162 134 162 L186 162 Q193 162 194 155 L200 15"
            fill="none" stroke="var(--muted)" strokeWidth="2" />
          <path d="M125 65 L129 152 Q130 158 135 158 L185 158 Q190 158 191 152 L195 65 Z"
            fill="#bfe3ff" opacity="0.3" />
          <rect x="145" y={spec.reacts && running ? 120 - Math.min(progress * 0.4, 30) : 120}
            width="30" height="24" rx="3" fill={spec.color}
            style={{ transition: "all .3s", opacity: progress >= 100 ? 0.15 : 1 }} />
          {running && spec.reacts && Array.from({ length: Math.min(bubblesPerSec + 2, 10) }).map((_, i) => (
            <circle key={i} cx={140 + ((i * 13) % 40)} cy="140" r={1.5 + (i % 3)}
              fill="#bfe3ff">
              <animate attributeName="cy" values={`140;${55 - i * 3}`} dur={`${Math.max(1.6 - rate * 8, 0.4) + i * 0.15}s`} repeatCount="indefinite" begin={`${i * 0.15}s`} />
              <animate attributeName="opacity" values="0;1;0" dur={`${Math.max(1.6 - rate * 8, 0.4) + i * 0.15}s`} repeatCount="indefinite" begin={`${i * 0.15}s`} />
            </circle>
          ))}
          {!spec.reacts && (
            <text x="160" y="105" textAnchor="middle" fontSize="10" fill="var(--muted)" fontFamily="monospace">
              Cu tak bereaksi dengan HCl encer
            </text>
          )}
          <rect x="120" y="172" width="80" height="4" rx="2" fill="var(--border)" />
          <rect x="120" y="172" width={(progress / 100) * 80} height="4" rx="2" fill="var(--accent)" />
          <text x="160" y="16" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">
            {metal} + HCl → H₂ ↑ {running ? `${progress.toFixed(0)}%` : ""}
          </text>
        </svg>

        <p className="mt-3 rounded-xl px-4 py-2.5 text-xs leading-relaxed" style={{ background: "var(--accent-soft)" }}>
          {!spec.reacts
            ? "Tembaga berada di bawah hidrogen dalam deret volta — tidak bisa merebut Cl dari HCl."
            : progress >= 100
              ? "Reaksi selesai — logam habis bereaksi!"
              : running
                ? `Laju relatif ${rate.toFixed(2)}%/s — perhatikan naiknya suhu mempercepat gelembung!`
                : "Pilih logam, atur suhu, lalu masukkan ke asam."}
        </p>
      </div>
    </div>
  );
}

export default function Simulation() {
  const [mode, setMode] = useState<SimMode>("titration");

  const [acidConc, setAcidConc] = useState(0.1);
  const [acidVol, setAcidVol] = useState(25);
  const [baseConc, setBaseConc] = useState(0.1);
  const [addedVol, setAddedVol] = useState(0);

  const [kcLog, setKcLog] = useState(2);
  const [initA, setInitA] = useState(1);
  const [initB, setInitB] = useState(1);
  const [initC, setInitC] = useState(0);

  const [temp, setTemp] = useState(25);
  const [ea, setEa] = useState(50);

  const [bufSystem, setBufSystem] = useState<BufferSystem>(BUFFER_SYSTEMS[0]);
  const [bufAcid, setBufAcid] = useState(0.1);
  const [bufBase, setBufBase] = useState(0.1);
  const [added, setAdded] = useState<"asam" | "basa">("basa");
  const [mol, setMol] = useState(0.01);

  const [anodeId, setAnodeId] = useState("Zn");
  const [cathodeId, setCathodeId] = useState("Cu");
  const [concA, setConcA] = useState(1);
  const [concC, setConcC] = useState(1);

  /* perhitungan */
  const titration = useMemo(() => {
    const curve = titrationCurve({ acidConc, acidVol, baseConc });
    const eqVol = (acidConc * acidVol) / baseConc;
    let currentPh = curve[0].ph;
    for (const p of curve) if (p.v <= addedVol) currentPh = p.ph;
    return { curve, eqVol, currentPh };
  }, [acidConc, acidVol, baseConc, addedVol]);

  const equilibrium = useMemo(
    () => equilibriumConcentrations({
      kc: Math.pow(10, kcLog), initial: [initA, initB, initC], stoich: [-1, -1, 2],
    }),
    [kcLog, initA, initB, initC]
  );

  const rateData = useMemo(() => {
    const temps = Array.from({ length: 17 }, (_, i) => i * 5);
    const rates = temps.map((t) => ({ t, rate: reactionRate(t, ea) }));
    const atTemp = reactionRate(temp, ea);
    return { temps, rates, atTemp };
  }, [temp, ea]);

  const buffer = useMemo(() => {
    const initial = bufferPh({ system: bufSystem, acidConc: bufAcid, baseConc: bufBase });
    const result = added === "asam"
      ? addAcidToBuffer({ system: bufSystem, acidConc: bufAcid, baseConc: bufBase, molH: mol })
      : addBaseToBuffer({ system: bufSystem, acidConc: bufAcid, baseConc: bufBase, molOh: mol });
    const curve = bufferCurve({
      system: bufSystem, acidConc: bufAcid, baseConc: bufBase,
      maxMol: Math.max(bufAcid * 1.5, 0.05),
      titrant: added === "asam" ? "H" : "OH",
    });
    return { initial, result, curve };
  }, [bufSystem, bufAcid, bufBase, added, mol]);

  const volta = useMemo(
    () => voltaCell({ anodeId, cathodeId, concAnode: concA, concCathode: concC }),
    [anodeId, cathodeId, concA, concC]
  );

  const animKey = `${acidConc}-${acidVol}-${baseConc}`;

  const simModes = MODES.filter(m => m.group === "sim");
  const labModes = MODES.filter(m => m.group === "lab");

  return (
    <ErrorBoundary label="Simulasi">
    <section aria-label="Simulasi & Lab interaktif">
      {/* Header grup */}
      <div className="mb-3 flex gap-2">
        <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
          5 Simulasi
        </span>
        <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "#34e0a114", color: "#34e0a1" }}>
          3 Lab Virtual
        </span>
      </div>

      {/* Tab Simulasi */}
      <div className="mb-2">
        <p className="mb-2 text-xs font-medium text-[var(--muted)]">Simulasi</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {simModes.map((m) => {
            const Icon = m.icon;
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left transition-all ${
                  active ? "" : "glass hover:border-[var(--accent)]/40"
                }`}
                style={active ? { background: "var(--accent-soft)", border: "1px solid var(--accent)" } : undefined}
              >
                <Icon size={16} strokeWidth={1.75} className={active ? "shrink-0 text-[var(--accent)]" : "shrink-0 text-[var(--muted)]"} />
                <span className={`text-xs ${active ? "font-semibold text-[var(--accent)]" : ""}`}>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Lab */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-medium text-[var(--muted)]">Lab Virtual</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {labModes.map((m) => {
            const Icon = m.icon;
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left transition-all ${
                  active ? "" : "glass hover:border-[var(--accent)]/40"
                }`}
                style={active ? { background: "#34e0a114", border: "1px solid #34e0a1" } : undefined}
              >
                <Icon size={16} strokeWidth={1.75} className={active ? "shrink-0" : "shrink-0 text-[var(--muted)]"} style={active ? { color: "#34e0a1" } : undefined} />
                <span className={`text-xs ${active ? "font-semibold" : ""}`} style={active ? { color: "#34e0a1" } : undefined}>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="glass grid gap-6 p-5 sm:p-6 lg:grid-cols-[240px_1fr]">
        {/* Kontrol & visualisasi berdasarkan mode */}
        {mode === "ph-lab" && <PhMixLab />}
        {mode === "electrolysis-lab" && <ElectrolysisLab />}
        {mode === "metal-lab" && <MetalAcidLab />}

        {/* Simulasi modes (unchanged dari kode asli, hanya dipindahkan ke sini) */}
        {mode === "titration" && (
          <>
            <div className="space-y-5">
              <h3 className="text-sm font-semibold">Parameter larutan</h3>
              <Slider label="Konsentrasi asam" value={acidConc} min={0.01} max={0.5} step={0.01} unit="M" onChange={(v) => { setAcidConc(v); setAddedVol(0); }} />
              <Slider label="Volume asam" value={acidVol} min={10} max={50} step={1} unit="mL" onChange={(v) => { setAcidVol(v); setAddedVol(0); }} />
              <Slider label="Konsentrasi basa" value={baseConc} min={0.01} max={0.5} step={0.01} unit="M" onChange={(v) => { setBaseConc(v); setAddedVol(0); }} />
              <Slider
                label="Basa ditambahkan"
                value={addedVol}
                min={0}
                max={Math.round(titration.eqVol * 2)}
                step={0.5}
                unit="mL"
                onChange={setAddedVol}
              />
              <p className="rounded-xl px-3.5 py-2.5 text-xs leading-relaxed" style={{ background: "var(--accent-soft)" }}>
                pH saat ini: <b>{titration.currentPh.toFixed(2)}</b> — ekivalen di {titration.eqVol.toFixed(1)} mL.
                {Math.abs(addedVol - titration.eqVol) < 0.75 && " — kamu tepat di titik ekivalen!"}
              </p>
            </div>
            <div>
              <TitrationFlask currentPh={titration.currentPh} addedVol={addedVol} maxVol={titration.eqVol * 2} />
              <LineChart
                data={titration.curve.map((p: TitrationPoint) => ({ x: p.v, y: p.ph }))}
                xLabel="Volume basa (mL)"
                yLabel="pH"
                marker={{ x: titration.eqVol }}
                markerLabel="ekivalen"
                keyAnim={animKey}
              />
            </div>
          </>
        )}

        {mode === "buffer" && (
          <>
            <div className="space-y-5">
              <h3 className="text-sm font-semibold">Larutan penyangga</h3>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">Sistem penyangga</label>
                <select
                  value={bufSystem.id}
                  onChange={(e) => setBufSystem(BUFFER_SYSTEMS.find((b) => b.id === e.target.value)!)}
                  className="glass-input w-full rounded-xl px-3 py-2 text-sm outline-none"
                  aria-label="Sistem penyangga"
                >
                  {BUFFER_SYSTEMS.map((b) => (
                    <option key={b.id} value={b.id}>{b.label} (pKa {b.pka})</option>
                  ))}
                </select>
              </div>
              <Slider label={`[${bufSystem.acidLabel.split(" ")[0]}] asam`} value={bufAcid} min={0.02} max={0.5} step={0.01} unit="M" onChange={setBufAcid} />
              <Slider label={`[${bufSystem.baseLabel.split(" ")[0]}] basa`} value={bufBase} min={0.02} max={0.5} step={0.01} unit="M" onChange={setBufBase} />
              <div className="flex gap-2">
                <button
                  onClick={() => setAdded("asam")}
                  className={`flex-1 rounded-full px-3 py-1.5 text-xs transition-colors ${added === "asam" ? "font-semibold" : ""}`}
                  style={added === "asam"
                    ? { background: "#d14d6b", color: "white" }
                    : { border: "1px solid var(--border)", color: "var(--muted)" }}
                >
                  + HCl (asam)
                </button>
                <button
                  onClick={() => setAdded("basa")}
                  className={`flex-1 rounded-full px-3 py-1.5 text-xs transition-colors ${added === "basa" ? "font-semibold" : ""}`}
                  style={added === "basa"
                    ? { background: "#3d76d9", color: "white" }
                    : { border: "1px solid var(--border)", color: "var(--muted)" }}
                >
                  + NaOH (basa)
                </button>
              </div>
              <Slider label={added === "asam" ? "mol H⁺ ditambahkan" : "mol OH⁻ ditambahkan"} value={mol} min={0} max={Math.max(bufAcid, bufBase) * 1.5} step={0.005} unit="mol" onChange={setMol} />
              <p className="rounded-xl px-3.5 py-2.5 text-xs leading-relaxed" style={{ background: "var(--accent-soft)" }}>
                {buffer.result.ok ? (
                  <>pH awal <b>{buffer.initial.ph.toFixed(2)}</b> → sekarang <b>{buffer.result.ph!.toFixed(2)}</b>.
                    {" "}Pergeseran cuma <b>{Math.abs(buffer.result.ph! - buffer.initial.ph).toFixed(2)}</b> — itulah kerja penyangga!</>
                ) : (
                  <><b>Kapasitas habis!</b> {buffer.result.note}</>
                )}
              </p>
            </div>
            <BufferVisual system={bufSystem} curve={buffer.curve} currentPh={buffer.result.ph ?? buffer.initial.ph} mol={mol} added={added} />
          </>
        )}

        {mode === "volta" && (
          <>
            <div className="space-y-5">
              <h3 className="text-sm font-semibold">Elektroda</h3>
              <ElectrodeSelect label="Anoda (−) oksidasi" value={anodeId} onChange={setAnodeId} exclude={cathodeId} />
              <ElectrodeSelect label="Katoda (+) reduksi" value={cathodeId} onChange={setCathodeId} exclude={anodeId} />
              <Slider label="Konsentrasi ion anoda" value={concA} min={0.01} max={2} step={0.05} unit="M" onChange={setConcA} />
              <Slider label="Konsentrasi ion katoda" value={concC} min={0.01} max={2} step={0.05} unit="M" onChange={setConcC} />
              <p className="rounded-xl px-3.5 py-2.5 text-xs leading-relaxed" style={{ background: "var(--accent-soft)" }}>
                E sel = <b>{volta.eCell.toFixed(3)} V</b> — {volta.spontan ? "spontan!" : "tidak spontan"}<br />
                {volta.electronFlow} elektron per reaksi
              </p>
            </div>
            <VoltaVisual
              anode={ELECTRODES.find((e) => e.symbol === anodeId)!}
              cathode={ELECTRODES.find((e) => e.symbol === cathodeId)!}
              eCell={volta.eCell}
              electronFlow={volta.electronFlow}
              spontan={volta.spontan}
            />
          </>
        )}

        {mode === "equilibrium" && (
          <>
            <div className="space-y-5">
              <h3 className="text-sm font-semibold">Reaksi H₂ + I₂ ⇌ 2HI</h3>
              <Slider label="log₁₀ Kc" value={kcLog} min={-2} max={4} step={0.2} onChange={setKcLog} />
              <Slider label="[H₂]₀" value={initA} min={0} max={2} step={0.1} unit="M" onChange={setInitA} />
              <Slider label="[I₂]₀" value={initB} min={0} max={2} step={0.1} unit="M" onChange={setInitB} />
              <Slider label="[HI]₀" value={initC} min={0} max={2} step={0.1} unit="M" onChange={setInitC} />
              <p className="rounded-xl px-3.5 py-2.5 text-xs leading-relaxed" style={{ background: "var(--accent-soft)" }}>
                Kc = <b>{Math.pow(10, kcLog).toFixed(2)}</b><br />
                Ekuilibrium: [H₂]={equilibrium.final[0].toFixed(3)}, [I₂]={equilibrium.final[1].toFixed(3)}, [HI]={equilibrium.final[2].toFixed(3)} M
              </p>
            </div>
            <EquilibriumVisual equilibrium={equilibrium} />
          </>
        )}

        {mode === "rate" && (
          <>
            <div className="space-y-5">
              <h3 className="text-sm font-semibold">Efek suhu pada laju</h3>
              <Slider label="Suhu" value={temp} min={0} max={80} step={5} unit="°C" onChange={setTemp} />
              <Slider label="Energi aktivasi Ea" value={ea} min={20} max={120} step={5} unit="kJ/mol" onChange={setEa} />
              <p className="rounded-xl px-3.5 py-2.5 text-xs leading-relaxed" style={{ background: "var(--accent-soft)" }}>
                Laju relatif pada {temp}°C: <b>{rateData.atTemp.toFixed(2)}</b><br />
                Ea = {ea} kJ/mol — semakin tinggi Ea, semakin curam kurva!
              </p>
            </div>
            <RateVisual rates={rateData.rates} temp={temp} />
          </>
        )}
      </div>
    </section>
    </ErrorBoundary>
  );
}

/* ================= VISUALISASI (dari kode asli, unchanged) ================= */
function BufferVisual({ system, curve, currentPh, mol, added }: {
  system: BufferSystem;
  curve: { mol: number; ph: number; phase: string }[];
  currentPh: number;
  mol: number;
  added: "asam" | "basa";
}) {
  const color = phColor(currentPh);
  const W = 560, H = 300, PAD = 44;
  const xMax = Math.max(curve[curve.length - 1].mol, 0.01);
  const yMin = Math.min(...curve.map((p) => p.ph), 0);
  const yMax = Math.max(...curve.map((p) => p.ph));
  const sx = (x: number) => PAD + (x / xMax) * (W - PAD - 12);
  const sy = (y: number) => H - PAD - ((y - yMin) / (yMax - yMin || 1)) * (H - PAD - 16);
  const path = curve.map((p, i) => `${i ? "L" : "M"} ${sx(p.mol)} ${sy(p.ph)}`).join(" ");
  let cx = sx(0), cy = sy(curve[0].ph);
  for (const p of curve) if (p.mol <= mol) { cx = sx(p.mol); cy = sy(p.ph); }

  return (
    <div>
      <svg viewBox="0 0 320 110" className="w-full" role="img" aria-label={`Gelas kimia larutan penyangga ${system.label}, pH ${currentPh.toFixed(2)}`}>
        <path d="M100 20 L104 96 Q105 102 112 102 L208 102 Q215 102 216 96 L220 20 Z"
          fill="none" stroke="var(--muted)" strokeWidth="1.8" />
        <rect x={106} y={40} width={108} height={58} rx={4} fill={color} opacity="0.45">
          <animate attributeName="opacity" values="0.38;0.52;0.38" dur="2.6s" repeatCount="indefinite" />
        </rect>
        {mol > 0 && (
          <circle cx={added === "asam" ? 130 : 190} cy="30" r="2.5" fill={added === "asam" ? "#e05c7a" : "#5b8def"}>
            <animate attributeName="cy" values="28;44" dur="0.7s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;0" dur="0.7s" repeatCount="indefinite" />
          </circle>
        )}
        <g transform="translate(252,30)" opacity="0.75">
          <path d="M0 -10 L9 -6 V3 Q0 12 -0 12 Q-0 12 -9 3 V-6 Z" fill="none" stroke={color} strokeWidth="1.5" />
          <text x="14" y="4" fontSize="9" fill="var(--muted)">pH tahan!</text>
        </g>
        <text x="160" y="34" textAnchor="middle" fontSize="13" fontWeight="bold" fill={color} fontFamily="monospace">
          {currentPh.toFixed(2)}
        </text>
      </svg>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Kurva titrasi penyangga">
        {[0, 3, 7, 11, 14].map((t) => (
          <g key={t}>
            <line x1={PAD} y1={sy(t)} x2={W - 12} y2={sy(t)} stroke="var(--border)" strokeWidth="0.7" />
            <text x={PAD - 6} y={sy(t) + 3} textAnchor="end" fontSize="9" fill="var(--muted)" fontFamily="monospace">{t}</text>
          </g>
        ))}
        <line x1={PAD} y1={sy(system.pka)} x2={W - 12} y2={sy(system.pka)} stroke="#34e0a1" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.55" />
        <line x1={PAD} y1={H - PAD} x2={W - 12} y2={H - PAD} stroke="var(--muted)" strokeWidth="1" />
        <line x1={PAD} y1="14" x2={PAD} y2={H - PAD} stroke="var(--muted)" strokeWidth="1" />
        <text x={(W + PAD) / 2} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--muted)">
          {added === "asam" ? "mol H⁺ ditambahkan" : "mol OH⁻ ditambahkan"}
        </text>
        <text x="12" y={(H - PAD + 20) / 2} fontSize="10" fill="var(--muted)" transform={`rotate(-90 12 ${(H - PAD + 20) / 2})`} textAnchor="middle">pH</text>
        <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="6" fill="#e05c7a" stroke="white" strokeWidth="1.5">
          <animate attributeName="r" values="5;7;5" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

function ElectrodeSelect({ label, value, onChange, exclude }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  exclude: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="glass-input w-full rounded-xl px-3 py-2 text-sm outline-none"
      >
        {ELECTRODES.filter((e) => e.symbol !== exclude).map((e) => (
          <option key={e.symbol} value={e.symbol}>{e.name}</option>
        ))}
      </select>
    </div>
  );
}

function VoltaVisual({ anode, cathode, eCell, electronFlow, spontan }: {
  anode: Electrode;
  cathode: Electrode;
  eCell: number;
  electronFlow: number;
  spontan: boolean;
}) {
  const wireY = 22;
  const [showRate, setShowRate] = useState(false);
  
  return (
    <div>
      <svg viewBox="0 0 320 210" className="w-full" role="img"
        aria-label={`Sel volta ${anode.symbol}-${cathode.symbol}, E sel ${eCell.toFixed(2)} volt`}
        onMouseEnter={() => setShowRate(true)}
        onMouseLeave={() => setShowRate(false)}
        onTouchStart={() => setShowRate(true)}>
        <defs>
          {/* Gradient anode(biru)→cathode(merah) */}
          <linearGradient id="wire-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5b8def" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#34e0a1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#e05c7a" stopOpacity="0.6" />
          </linearGradient>
          {/* Glow untuk elektron */}
          <filter id="electron-glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Wire dengan gradient saat spontan */}
        <path d={`M70 ${wireY} H140 M180 ${wireY} H250`} 
          stroke={spontan ? "url(#wire-gradient)" : "var(--muted)"} 
          strokeWidth={spontan ? "2.4" : "1.6"} />
        
        {/* Voltmeter */}
        <rect x="140" y={wireY - 12} width="40" height="24" rx="5" fill="none" 
          stroke={spontan ? "#34e0a1" : "var(--muted)"} strokeWidth="1.6" />
        <text x="160" y={wireY + 4} textAnchor="middle" fontSize="10" fontWeight="bold"
          fill={spontan ? "#34e0a1" : "var(--muted)"} fontFamily="monospace">
          {Math.abs(eCell).toFixed(2)}V
        </text>
        
        {/* Elektron dengan glow */}
        {spontan && [0, 1, 2].map((i) => (
          <circle key={i} r="3.5" fill="#e05c7a" filter="url(#electron-glow)">
            <animate attributeName="cx" values="70;140" dur="1.4s" begin={`${i * 0.45}s`} repeatCount="indefinite" />
            <animate attributeName="cy" values={`${wireY};${wireY}`} dur="1.4s" begin={`${i * 0.45}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;1;0" dur="1.4s" begin={`${i * 0.45}s`} repeatCount="indefinite" />
          </circle>
        ))}
        
        {/* Tooltip rate elektron */}
        {showRate && spontan && (
          <g>
            <rect x="145" y="48" width="90" height="22" rx="4" fill="rgba(0,0,0,0.85)" stroke="#34e0a1" strokeWidth="0.8" />
            <text x="190" y="62" textAnchor="middle" fontSize="9" fill="#34e0a1" fontFamily="monospace">
              {electronFlow.toFixed(2)} e⁻/reaksi
            </text>
          </g>
        )}
        
        {/* Gelas anode */}
        <path d="M40 60 L44 170 Q45 176 52 176 L108 176 Q115 176 116 170 L120 60 Z" fill="none" stroke="var(--muted)" strokeWidth="1.6" />
        <rect x={47} y={90} width={66} height={82} rx={3} fill={anode.solutionColor} opacity="0.4" />
        <rect x={72} y={48} width={16} height={112} rx={2} fill={anode.color} opacity="0.85" />
        <text x={80} y={200} textAnchor="middle" fontSize="11" fontWeight="bold" fill={anode.color} fontFamily="monospace">{anode.symbol}</text>
        
        {/* Jembatan garam */}
        <path d="M118 92 Q160 74 202 92" fill="none" stroke="var(--muted)" strokeWidth="7" strokeLinecap="round" opacity="0.55" />
        
        {/* Gelas cathode */}
        <path d="M200 60 L204 170 Q205 176 212 176 L268 176 Q275 176 276 170 L280 60 Z" fill="none" stroke="var(--muted)" strokeWidth="1.6" />
        <rect x={207} y={90} width={66} height={82} rx={3} fill={cathode.solutionColor} opacity="0.4" />
        <rect x={232} y={48} width={16} height={112} rx={2} fill={cathode.color} opacity="0.85" />
        <text x={240} y={200} textAnchor="middle" fontSize="11" fontWeight="bold" fill={cathode.color} fontFamily="monospace">{cathode.symbol}</text>
      </svg>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <div className="rounded-xl px-3 py-2.5" style={{ background: `${anode.color}14`, border: `1px solid ${anode.color}33` }}>
          <p className="font-mono text-[10px]" style={{ color: anode.color }}>{anode.name} — oksidasi</p>
        </div>
        <div className="rounded-xl px-3 py-2.5" style={{ background: `${cathode.color}14`, border: `1px solid ${cathode.color}33` }}>
          <p className="font-mono text-[10px]" style={{ color: cathode.color }}>{cathode.name} — reduksi</p>
        </div>
      </div>
    </div>
  );
}

function EquilibriumVisual({ equilibrium }: { equilibrium: any }) {
  return (
    <div className="rounded-xl px-4 py-3" style={{ background: "var(--accent-soft)" }}>
      <p className="text-xs">Konsentrasi ekuilibrium:</p>
      <div className="mt-2 grid grid-cols-3 gap-2 font-mono text-xs">
        <div>[H₂] = {equilibrium.final[0].toFixed(3)} M</div>
        <div>[I₂] = {equilibrium.final[1].toFixed(3)} M</div>
        <div>[HI] = {equilibrium.final[2].toFixed(3)} M</div>
      </div>
    </div>
  );
}

function RateVisual({ rates, temp }: { rates: { t: number; rate: number }[]; temp: number }) {
  return (
    <div className="space-y-2">
      {rates.filter((_, i) => i % 2 === 0).map((r) => {
        const isNear = Math.abs(r.t - temp) < 5;
        const pct = r.rate > 0 ? (Math.log10(r.rate) / Math.log10(rates[rates.length - 1].rate)) * 100 : 0;
        return (
          <div key={r.t} className="flex items-center gap-2">
            <span className={`w-10 shrink-0 text-right font-mono text-[10px] ${isNear ? "font-bold text-[var(--accent)]" : "text-[var(--muted)]"}`}>{r.t}°</span>
            <div className="h-4 flex-1 overflow-hidden rounded-md" style={{ background: "var(--border)" }}>
              <div className="h-full rounded-md transition-all duration-300"
                style={{
                  width: `${Math.max(pct, 1.5)}%`,
                  background: isNear ? "var(--accent)" : `color-mix(in srgb, var(--accent) ${20 + (r.t / 80) * 40}%, transparent)`,
                }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
