"use client";

import { useMemo, useState } from "react";
import { FlaskConical, Zap, Atom, Play, RotateCcw, Droplet } from "lucide-react";

/* ============ Eksperimen 1: Lab Indikator pH ============ */
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

  const color = phToColor(result.ph);

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <div className="space-y-5">
        <h3 className="text-sm font-semibold">Campur larutan</h3>
        <div>
          <div className="mb-1.5 flex justify-between">
            <label className="text-xs text-[var(--muted)]">HCl 0,1 M</label>
            <span className="font-mono text-xs font-semibold text-[var(--accent)]">{acidMl} mL</span>
          </div>
          <input type="range" min={0} max={30} value={acidMl} onChange={(e) => setAcidMl(+e.target.value)}
            className="w-full accent-[#e05c7a]" />
        </div>
        <div>
          <div className="mb-1.5 flex justify-between">
            <label className="text-xs text-[var(--muted)]">NaOH 0,1 M</label>
            <span className="font-mono text-xs font-semibold text-[var(--accent)]">{baseMl} mL</span>
          </div>
          <input type="range" min={0} max={30} value={baseMl} onChange={(e) => setBaseMl(+e.target.value)}
            className="w-full accent-[#5b8def]" />
        </div>
        <button
          onClick={() => { setAcidMl(10); setBaseMl(0); }}
          className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs text-[var(--muted)] transition-colors hover:text-[var(--text)]"
          style={{ border: "1px solid var(--border)" }}
        >
          <RotateCcw size={12} strokeWidth={1.75} /> Reset
        </button>
      </div>

      <div>
        {/* gelas besar */}
        <svg viewBox="0 0 320 160" className="w-full" role="img" aria-label="Gelas kimia berisi campuran dengan warna sesuai pH">
          {/* gelas */}
          <path d="M100 20 L108 138 Q109 144 116 144 L204 144 Q211 144 212 138 L220 20"
            fill="none" stroke="var(--muted)" strokeWidth="2" />
          {/* tanda ukur */}
          {[50, 80, 110].map((y) => (
            <line key={y} x1="104" y1={y} x2="114" y2={y} stroke="var(--muted)" strokeWidth="1" opacity="0.5" />
          ))}
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

        {/* skala pH */}
        <PhScale currentPh={result.ph} />

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

function phToColor(ph: number): string {
  // gradasi indikator universal
  if (ph <= 2) return "#c62828";
  if (ph <= 4) return "#e05c3a";
  if (ph <= 6) return "#e8935c";
  if (ph <= 7.5) return "#34e0a1";
  if (ph <= 9) return "#5bc8d6";
  if (ph <= 11) return "#5b8def";
  return "#7a5cd6";
}

function PhScale({ currentPh }: { currentPh: number }) {
  return (
    <div className="mt-2">
      <div className="flex overflow-hidden rounded-lg">
        {Array.from({ length: 15 }, (_, i) => (
          <div key={i} className="flex-1 py-1.5 text-center font-mono text-[8px] transition-all"
            style={{
              background: phToColor(i),
              opacity: Math.abs(currentPh - i) < 0.5 ? 1 : 0.35,
              transform: Math.abs(currentPh - i) < 0.5 ? "scaleY(1.25)" : undefined,
              color: i <= 3 || i >= 11 ? "#fff" : "#000",
            }}>
            {i}
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between px-1 text-[9px] text-[var(--muted)]">
        <span>asam</span><span>netral</span><span>basa</span>
      </div>
    </div>
  );
}

/* ============ Eksperimen 2: Elektrolisis Air ============ */
function ElectrolysisLab() {
  const [minutes, setMinutes] = useState(5);
  const [current, setCurrent] = useState(2);
  const [running, setRunning] = useState(false);

  const FARADAY = 96485;
  const charge = current * minutes * 60;
  const eMol = charge / FARADAY;
  const h2Mol = eMol / 2;
  const o2Mol = eMol / 4;
  // volume gas di kondisi ruang ~24 L/mol → rasio tabung 2:1
  const h2H = Math.min((h2Mol * 24) * 18, 90);
  const o2H = h2H / 2;

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <div className="space-y-5">
        <h3 className="text-sm font-semibold">Elektrolisis air</h3>
        <div>
          <div className="mb-1.5 flex justify-between">
            <label className="text-xs text-[var(--muted)]">Waktu</label>
            <span className="font-mono text-xs font-semibold text-[var(--accent)]">{minutes} menit</span>
          </div>
          <input type="range" min={1} max={20} value={minutes} onChange={(e) => setMinutes(+e.target.value)}
            className="w-full cursor-pointer accent-[var(--accent)]" />
        </div>
        <div>
          <div className="mb-1.5 flex justify-between">
            <label className="text-xs text-[var(--muted)]">Arus</label>
            <span className="font-mono text-xs font-semibold text-[var(--accent)]">{current} A</span>
          </div>
          <input type="range" min={1} max={5} value={current} onChange={(e) => setCurrent(+e.target.value)}
            className="w-full cursor-pointer accent-[var(--accent)]" />
        </div>
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
        {!running && (
          <p className="mt-2 text-center text-[11px] text-[var(--muted)]">
            Tekan "Nyalakan arus" lalu geser waktu & arus untuk mengisi tabung.
          </p>
        )}
      </div>
    </div>
  );
}

/* ============ Eksperimen 3: Logam + Asam ============ */
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
  const [elapsed, setElapsed] = useState(0); // detik simulasi

  const spec = METALS.find((m) => m.id === metal)!;
  const FACTORS: Record<string, number> = { Mg: 5, Zn: 2, Fe: 0.6, Cu: 0 };
  const factor = FACTORS[metal] ?? 0;
  const tempFactor = Math.pow(2, (temp - 25) / 10);
  const rate = factor * tempFactor * 0.02; // % per detik visual

  const progress = Math.min(running ? elapsed * rate : 0, 100);
  const bubblesPerSec = Math.round(rate * 3);

  // tick timer
  useMemo(() => {
    if (!running || !spec.reacts || progress >= 100) return;
    const iv = setInterval(() => setElapsed((e) => e + 0.1), 100);
    return () => clearInterval(iv);
  }, [running, spec.reacts, progress]);

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <div className="space-y-5">
        <h3 className="text-sm font-semibold">Pilih logam & suhu</h3>
        {/* pilihan logam */}
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
        <div>
          <div className="mb-1.5 flex justify-between">
            <label className="text-xs text-[var(--muted)]">Suhu asam</label>
            <span className="font-mono text-xs font-semibold text-[var(--accent)]">{temp}°C</span>
          </div>
          <input type="range" min={10} max={80} value={temp} onChange={(e) => setTemp(+e.target.value)}
            className="w-full cursor-pointer accent-[var(--accent)]" />
        </div>
        <button
          onClick={() => { setRunning(true); setElapsed(0); }}
          disabled={!spec.reacts}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all disabled:opacity-40"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          <Play size={13} strokeWidth={2} fill="#fff" /> Masukkan ke asam
        </button>
      </div>

      <div>
        <svg viewBox="0 0 320 180" className="w-full" role="img" aria-label="Tabung reaksi berisi logam dalam asam, gelembung hidrogen muncul sesuai reaktivitas">
          {/* tabung */}
          <path d="M120 15 L126 155 Q127 162 134 162 L186 162 Q193 162 194 155 L200 15"
            fill="none" stroke="var(--muted)" strokeWidth="2" />
          {/* asam */}
          <path d="M125 65 L129 152 Q130 158 135 158 L185 158 Q190 158 191 152 L195 65 Z"
            fill={C_ACID} opacity="0.3" />
          {/* lempeng logam */}
          <rect x="145" y={spec.reacts && running ? 120 - Math.min(progress * 0.4, 30) : 120}
            width="30" height="24" rx="3" fill={spec.color}
            style={{ transition: "all .3s", opacity: progress >= 100 ? 0.15 : 1 }} />
          {/* gelembung H2 — jumlah & kecepatan sesuai laju */}
          {running && spec.reacts && Array.from({ length: Math.min(bubblesPerSec + 2, 10) }).map((_, i) => (
            <circle key={i} cx={140 + ((i * 13) % 40)} cy="140" r={1.5 + (i % 3)}
              fill="#bfe3ff">
              <animate attributeName="cy" values={`140;${55 - i * 3}`} dur={`${Math.max(1.6 - rate * 8, 0.4) + i * 0.15}s`} repeatCount="indefinite" begin={`${i * 0.15}s`} />
              <animate attributeName="opacity" values="0;1;0" dur={`${Math.max(1.6 - rate * 8, 0.4) + i * 0.15}s`} repeatCount="indefinite" begin={`${i * 0.15}s`} />
            </circle>
          ))}
          {/* pesan Cu */}
          {!spec.reacts && (
            <text x="160" y="105" textAnchor="middle" fontSize="10" fill="var(--muted)" fontFamily="monospace">
              Cu tak bereaksi dengan HCl encer
            </text>
          )}
          {/* progress bar */}
          <rect x="120" y="172" width="80" height="4" rx="2" fill="var(--border)" />
          <rect x="120" y="172" width={(progress / 100) * 80} height="4" rx="2" fill="var(--accent)" />
          <text x="160" y="16" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">
            {metal} + HCl → H₂ ↑ {running ? `${progress.toFixed(0)}%` : ""}
          </text>
        </svg>

        <p className="mt-3 rounded-xl px-4 py-2.5 text-xs leading-relaxed" style={{ background: "var(--accent-soft)" }}>
          {!spec.reacts
            ? "Tembaga berada di bawah hidrogen dalam deret voltam — tidak bisa merebut Cl dari HCl."
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

const C_ACID = "#bfe3ff";

type ExpMode = "ph" | "electrolysis" | "metal";

const EXP_MODES: { id: ExpMode; label: string; icon: typeof FlaskConical }[] = [
  { id: "ph", label: "Indikator pH", icon: Droplet },
  { id: "electrolysis", label: "Elektrolisis Air", icon: Zap },
  { id: "metal", label: "Logam + Asam", icon: Atom },
];

export default function VirtualLab() {
  const [mode, setMode] = useState<ExpMode>("ph");

  return (
    <section aria-label="Eksperimen virtual">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {EXP_MODES.map((m) => {
          const Icon = m.icon;
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex items-center gap-2.5 rounded-2xl px-4 py-3 text-left transition-all ${
                active ? "" : "glass hover:border-[var(--accent)]/40"
              }`}
              style={active ? { background: "var(--accent-soft)", border: "1px solid var(--accent)", backdropFilter: "blur(var(--glass-blur))" } : undefined}
            >
              <Icon size={17} strokeWidth={1.75} className={active ? "shrink-0 text-[var(--accent)]" : "shrink-0 text-[var(--muted)]"} />
              <span className={`text-sm ${active ? "font-semibold text-[var(--accent)]" : ""}`}>{m.label}</span>
            </button>
          );
        })}
      </div>

      <div className="glass mt-4 p-5 sm:p-6">
        {mode === "ph" && <PhMixLab />}
        {mode === "electrolysis" && <ElectrolysisLab />}
        {mode === "metal" && <MetalAcidLab />}
      </div>
    </section>
  );
}
