"use client";

import { useMemo, useState } from "react";
import { FlaskConical, Atom, Thermometer, Shield, Zap } from "lucide-react";
import {
  titrationCurve, equilibriumConcentrations, reactionRate,
  type TitrationPoint,
} from "@/lib/simulation";
import {
  BUFFER_SYSTEMS, bufferPh, addAcidToBuffer, addBaseToBuffer, bufferCurve,
  type BufferSystem,
} from "@/lib/buffer-sim";
import { ELECTRODES, voltaCell, type Electrode } from "@/lib/volta-sim";

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

type SimMode = "titration" | "buffer" | "volta" | "equilibrium" | "rate";

const MODES: { id: SimMode; label: string; icon: typeof FlaskConical }[] = [
  { id: "titration", label: "Titrasi Asam–Basa", icon: FlaskConical },
  { id: "buffer", label: "Larutan Penyangga", icon: Shield },
  { id: "volta", label: "Sel Volta", icon: Zap },
  { id: "equilibrium", label: "Kesetimbangan", icon: Atom },
  { id: "rate", label: "Laju Reaksi & Suhu", icon: Thermometer },
];

/* warna indikator universal berdasarkan pH */
function phColor(ph: number): string {
  if (ph < 3) return "#e05c7a";       // merah — asam kuat
  if (ph < 6) return "#e8935c";       // oranye
  if (ph <= 8) return "#34e0a1";      // hijau — netral
  if (ph < 11) return "#5b8def";      // biru
  return "#9d6fd6";                   // ungu — basa kuat
}

export default function Simulation() {
  const [mode, setMode] = useState<SimMode>("titration");

  const [acidConc, setAcidConc] = useState(0.1);
  const [acidVol, setAcidVol] = useState(25);
  const [baseConc, setBaseConc] = useState(0.1);
  const [addedVol, setAddedVol] = useState(0); // volume basa yang sudah diteteskan

  const [kcLog, setKcLog] = useState(2);   // log10 Kc
  const [initA, setInitA] = useState(1);
  const [initB, setInitB] = useState(1);
  const [initC, setInitC] = useState(0);

  const [temp, setTemp] = useState(25);
  const [ea, setEa] = useState(50);

  // buffer
  const [bufSystem, setBufSystem] = useState<BufferSystem>(BUFFER_SYSTEMS[0]);
  const [bufAcid, setBufAcid] = useState(0.1);
  const [bufBase, setBufBase] = useState(0.1);
  const [added, setAdded] = useState<"asam" | "basa">("basa");
  const [mol, setMol] = useState(0.01);

  // sel volta
  const [anodeId, setAnodeId] = useState("Zn");
  const [cathodeId, setCathodeId] = useState("Cu");
  const [concA, setConcA] = useState(1);
  const [concC, setConcC] = useState(1);

  /* perhitungan */
  const titration = useMemo(() => {
    const curve = titrationCurve({ acidConc, acidVol, baseConc });
    const eqVol = (acidConc * acidVol) / baseConc;
    // pH saat ini pada addedVol
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
    const curve = bufferCurve({ system: bufSystem, acidConc: bufAcid, baseConc: bufBase, maxMol: Math.max(bufAcid * 1.5, 0.05) });
    return { initial, result, curve };
  }, [bufSystem, bufAcid, bufBase, added, mol]);

  const volta = useMemo(
    () => voltaCell({ anodeId, cathodeId, concAnode: concA, concCathode: concC }),
    [anodeId, cathodeId, concA, concC]
  );

  // animKey: memicu redraw kurva saat parameter berubah
  const animKey = `${acidConc}-${acidVol}-${baseConc}`;

  return (
    <section aria-label="Simulasi interaktif">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {MODES.map((m) => {
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

      <div className="glass mt-4 grid gap-6 p-5 sm:p-6 lg:grid-cols-[240px_1fr]">
        {/* kontrol */}
        <div className="space-y-5">
          {mode === "titration" && (
            <>
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
            </>
          )}
          {mode === "buffer" && (
            <>
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
              <p className="text-[11px] leading-relaxed text-[var(--muted)]">{bufSystem.everyday}</p>
            </>
          )}
          {mode === "volta" && (
            <>
              <h3 className="text-sm font-semibold">Sel volta</h3>
              <ElectrodeSelect label="Elektroda negatif (anoda)" value={anodeId} onChange={(v) => {
                setAnodeId(v);
                if (v === cathodeId) setCathodeId(v === "Zn" ? "Cu" : "Zn");
              }} exclude={cathodeId} />
              <ElectrodeSelect label="Elektroda positif (katoda)" value={cathodeId} onChange={(v) => {
                setCathodeId(v);
                if (v === anodeId) setAnodeId(v === "Zn" ? "Cu" : "Zn");
              }} exclude={anodeId} />
              <Slider label="[ion] anoda" value={concA} min={0.01} max={2} step={0.01} unit="M" onChange={setConcA} />
              <Slider label="[ion] katoda" value={concC} min={0.01} max={2} step={0.01} unit="M" onChange={setConcC} />
              <p className="rounded-xl px-3.5 py-2.5 text-xs leading-relaxed" style={{ background: "var(--accent-soft)" }}>
                E°sel = <b>{volta.eCell > 0 ? "+" : ""}{volta.eCell.toFixed(2)} V</b>
                {volta.eCell > 0
                  ? ` — reaksi spontan, elektron mengalir dari ${volta.anode.symbol} ke ${volta.cathode.symbol}.`
                  : " — arah reaksi terbalik; tukar posisi elektrodanya."}
              </p>
            </>
          )}
          {mode === "equilibrium" && (
            <>
              <h3 className="text-sm font-semibold">H₂ + I₂ ⇌ 2HI</h3>
              <Slider label="log Kc" value={kcLog} min={-1} max={3} step={1} onChange={setKcLog} />
              <Slider label="[H₂] awal" value={initA} min={0} max={2} step={0.1} unit="M" onChange={setInitA} />
              <Slider label="[I₂] awal" value={initB} min={0} max={2} step={0.1} unit="M" onChange={setInitB} />
              <Slider label="[HI] awal" value={initC} min={0} max={2} step={0.1} unit="M" onChange={setInitC} />
              <p className="rounded-xl px-3.5 py-2.5 text-xs leading-relaxed" style={{ background: "var(--accent-soft)" }}>
                Setimbang → H₂: {equilibrium.final[0].toFixed(2)} · I₂: {equilibrium.final[1].toFixed(2)} · HI: {equilibrium.final[2].toFixed(2)} M
              </p>
            </>
          )}
          {mode === "rate" && (
            <>
              <h3 className="text-sm font-semibold">Faktor laju</h3>
              <Slider label="Suhu" value={temp} min={0} max={80} step={1} unit="°C" onChange={setTemp} />
              <Slider label="Energi aktivasi" value={ea} min={20} max={90} step={5} unit="kJ/mol" onChange={setEa} />
              <p className="rounded-xl px-3.5 py-2.5 text-xs leading-relaxed" style={{ background: "var(--accent-soft)" }}>
                Laju relatif: <b>{rateData.atTemp.toExponential(1)}</b>. Naikkan suhu → partikel makin agresif!
              </p>
            </>
          )}
        </div>

        {/* visual */}
        <div className="min-w-0 rounded-xl p-3 sm:p-4" style={{ background: "color-mix(in srgb, var(--surface-solid) 55%, transparent)" }}>
          {mode === "titration" && (
            <TitrationVisual
              curve={titration.curve}
              eqVol={titration.eqVol}
              addedVol={addedVol}
              currentPh={titration.currentPh}
              animKey={animKey}
            />
          )}
          {mode === "buffer" && (
            <BufferVisual system={bufSystem} curve={buffer.curve} currentPh={buffer.result.ph ?? buffer.initial.ph} mol={mol} added={added} />
          )}
          {mode === "volta" && (
            <VoltaVisual
              anode={volta.anode}
              cathode={volta.cathode}
              eCell={volta.eCell}
              electronFlow={volta.electronFlow}
              spontan={volta.spontan}
            />
          )}
          {mode === "equilibrium" && (
            <EquilibriumVisual final={equilibrium.final} kc={Math.pow(10, kcLog)} animKey={`${kcLog}-${initA}-${initB}-${initC}`} />
          )}
          {mode === "rate" && (
            <RateVisual temp={temp} ea={ea} rates={rateData.rates} atTemp={rateData.atTemp} />
          )}
        </div>
      </div>
    </section>
  );
}

/* ================= TITRASI ================= */
function TitrationVisual({ curve, eqVol, addedVol, currentPh, animKey }: {
  curve: TitrationPoint[];
  eqVol: number;
  addedVol: number;
  currentPh: number;
  animKey: string;
}) {
  const liquidColor = phColor(currentPh);
  const nearEq = Math.abs(addedVol - eqVol) < 0.75;

  return (
    <div>
      {/* buret + labu */}
      <svg viewBox="0 0 320 130" className="w-full" role="img" aria-label="Buret meneteskan basa ke dalam larutan asam yang warnanya berubah sesuai pH">
        {/* buret */}
        <rect x="60" y="6" width="10" height="72" rx="2" fill="none" stroke="var(--muted)" strokeWidth="1.5" />
        <path d="M65 78 L65 92" stroke="var(--muted)" strokeWidth="2" />
        {/* cairan basa dalam buret */}
        <rect x="61.5" y="8" width="7" height={Math.max(68 - addedVol * 0.9, 4)} rx="1.5" fill="#5b8def" opacity="0.55" />
        {/* tetesan aktif */}
        {addedVol > 0 && addedVol < eqVol * 2 && (
          <circle cx="65" cy="96" r="2.5" fill="#5b8def">
            <animate attributeName="cy" values="94;112" dur="0.7s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;0" dur="0.7s" repeatCount="indefinite" />
          </circle>
        )}
        {/* labu erlenmeyer */}
        <path d="M140 52 L148 100 Q149 106 156 106 L204 106 Q211 106 212 100 L220 52 Z" fill="none" stroke="var(--muted)" strokeWidth="1.8" />
        {/* larutan — warna mengikuti pH */}
        <path d="M146 74 L152 100 Q153.5 103 157 103 L203 103 Q206.5 103 208 100 L214 74 Z" fill={liquidColor} opacity="0.45">
          <animate attributeName="opacity" values="0.4;0.55;0.4" dur="2.5s" repeatCount="indefinite" />
        </path>
        {/* gelembung reaksi saat dekat ekivalen */}
        {nearEq && [160, 175, 190].map((x, i) => (
          <circle key={x} cx={x} cy="98" r="2" fill={liquidColor}>
            <animate attributeName="cy" values="98;80" dur={`${0.8 + i * 0.2}s`} repeatCount="indefinite" begin={`${i * 0.25}s`} />
            <animate attributeName="opacity" values="0;0.9;0" dur={`${0.8 + i * 0.2}s`} repeatCount="indefinite" begin={`${i * 0.25}s`} />
          </circle>
        ))}
        {/* label pH besar */}
        <text x="255" y="66" fontSize="22" fontWeight="bold" fill={liquidColor} fontFamily="monospace">
          {currentPh.toFixed(1)}
        </text>
        <text x="255" y="82" fontSize="9" fill="var(--muted)">pH</text>
        {/* progress bar penambahan */}
        <rect x="140" y="118" width="80" height="4" rx="2" fill="var(--border)" />
        <rect x="140" y="118" width={(addedVol / (eqVol * 2)) * 80} height="4" rx="2" fill={liquidColor} />
        <circle cx={140 + (eqVol / (eqVol * 2)) * 80} cy="120" r="3" fill="#e05c7a" />
      </svg>

      {/* kurva */}
      <LineChart
        data={curve.map((p) => ({ x: p.v, y: p.ph }))}
        xLabel="Volume NaOH (mL)"
        yLabel="pH"
        marker={{ x: eqVol }}
        markerLabel="ekivalen"
        keyAnim={animKey}
      />
      {/* titik saat ini di kurva */}
      <p className="mt-1 text-center text-[11px] text-[var(--muted)]">
        Titik merah = posisi titrasi sekarang ({addedVol} mL)
      </p>
      <svg viewBox="0 0 560 30" className="-mt-1 w-full">
        {(() => {
          const W = 560, PAD = 44;
          const xMax = curve[curve.length - 1].v;
          const cx = PAD + (addedVol / xMax) * (W - PAD - 12);
          return <circle cx={cx} cy="14" r="6" fill="#e05c7a" stroke="white" strokeWidth="1.5">
            <animate attributeName="r" values="5;7;5" dur="1.5s" repeatCount="indefinite" />
          </circle>;
        })()}
      </svg>
    </div>
  );
}

/* ================= KESETIMBANGAN ================= */
function EquilibriumVisual({ final, kc, animKey }: { final: number[]; kc: number; animKey: string }) {
  const total = Math.max(final.reduce((a, b) => a + b, 0), 0.001);
  const nH2 = Math.round((final[0] / total) * 12);
  const nI2 = Math.round((final[1] / total) * 12);
  const nHI = Math.round((final[2] / total) * 16);

  return (
    <div>
      {/* visual molekul dua arah */}
      <svg viewBox="0 0 320 150" className="w-full" role="img" aria-label="Molekul reaktan dan produk dengan jumlah sesuai konsentrasi setimbang">
        {/* zona reaktan */}
        <rect x="16" y="18" width="128" height="86" rx="10" fill="#5b8def" opacity="0.08" />
        <text x="80" y="32" textAnchor="middle" fontSize="9" fill="#5b8def" fontFamily="monospace">reaktan</text>
        {/* zona produk */}
        <rect x="176" y="18" width="128" height="86" rx="10" fill="#34e0a1" opacity="0.08" />
        <text x="240" y="32" textAnchor="middle" fontSize="9" fill="#34e0a1" fontFamily="monospace">produk</text>
        {/* panah dua arah */}
        <path d="M150 58 L170 58" stroke="var(--muted)" strokeWidth="1.5" markerEnd="url(#arrR)" />
        <path d="M170 70 L150 70" stroke="var(--muted)" strokeWidth="1.5" markerEnd="url(#arrL)" />
        <defs>
          <marker id="arrR" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="var(--muted)" /></marker>
          <marker id="arrL" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><polygon points="6 0, 0 3, 6 6" fill="var(--muted)" /></marker>
        </defs>
        {/* molekul H2 (dua lingkaran biru) */}
        {Array.from({ length: nH2 }).map((_, i) => (
          <g key={"h" + i}>
            <circle cx={38 + (i % 4) * 28} cy={48 + Math.floor(i / 4) * 24} r="4" fill="#5b8def" />
            <circle cx={46 + (i % 4) * 28} cy={48 + Math.floor(i / 4) * 24} r="4" fill="#5b8def" />
            <animateTransform attributeName="transform" type="translate"
              values={`0 0; ${i % 2 ? 3 : -3}, ${i % 3 ? -2 : 2}; 0 0`}
              dur={`${2 + (i % 5) * 0.4}s`} repeatCount="indefinite" additive="sum" />
          </g>
        ))}
        {/* molekul I2 (ungu lebih besar) */}
        {Array.from({ length: nI2 }).map((_, i) => (
          <g key={"i" + i}>
            <circle cx={42 + (i % 4) * 28} cy={50 + Math.floor(i / 4) * 24} r="6" fill="#9d6fd6" opacity="0.85" />
            <animateTransform attributeName="transform" type="translate"
              values={`0 0; ${i % 2 ? -3 : 3}, ${i % 3 ? 2 : -2}; 0 0`}
              dur={`${1.8 + (i % 4) * 0.5}s`} repeatCount="indefinite" additive="sum" />
          </g>
        ))}
        {/* molekul HI (hijau, campuran) */}
        {Array.from({ length: nHI }).map((_, i) => (
          <g key={"hi" + i}>
            <circle cx={196 + (i % 5) * 24} cy={50 + Math.floor(i / 5) * 26} r="4" fill="#5b8def" />
            <circle cx={204 + (i % 5) * 24} cy={50 + Math.floor(i / 5) * 26} r="5.5" fill="#9d6fd6" opacity="0.85" />
            <animateTransform attributeName="transform" type="translate"
              values={`0 0; ${i % 2 ? 4 : -4}, ${i % 3 ? 3 : -3}; 0 0`}
              dur={`${1.5 + (i % 6) * 0.35}s`} repeatCount="indefinite" additive="sum" />
          </g>
        ))}
        <CaptionEq kc={kc} />
      </svg>

      {/* bar komposisi */}
      <div className="mt-3 grid grid-cols-3 gap-3">
        {([["[H₂]", final[0]], ["[I₂]", final[1]], ["[HI]", final[2]]] as const).map(([label, val]) => (
          <div key={label} className="rounded-xl px-3 py-2.5 text-center" style={{ background: "var(--accent-soft)" }}>
            <p className="font-mono text-sm font-bold text-[var(--accent)] transition-all">{val.toFixed(2)}</p>
            <p className="font-mono text-[10px] text-[var(--muted)]">{label}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-[11px] text-[var(--muted)]">
        Jumlah molekul di atas proporsional terhadap konsentrasi setimbang.
      </p>
    </div>
  );
}

function CaptionEq({ kc }: { kc: number }) {
  return (
    <text x="160" y="122" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="monospace">
      Kc = {kc >= 1000 ? "10³+" : kc.toFixed(0)} — geser log Kc & lihat molokul pindah zona
    </text>
  );
}

/* ================= LAJU REAKSI ================= */
function RateVisual({ temp, ea, rates, atTemp }: {
  temp: number; ea: number;
  rates: { t: number; rate: number }[];
  atTemp: number;
}) {
  // kecepatan partikel proporsional akar suhu (energi kinetik ~ T)
  const speed = 0.4 + (temp / 80) * 2.4;
  const nActive = Math.min(Math.round(4 + (temp / 80) * 14), 18);
  const heatColor = `hsl(${Math.max(0, 200 - temp * 2.5)}, 70%, 55%)`;

  return (
    <div>
      <svg viewBox="0 0 320 150" className="w-full" role="img" aria-label="Partikel bereaksi — makin panas makin cepat dan sering bertumbukan">
        {/* kontainer */}
        <rect x="16" y="12" width="288" height="104" rx="12" fill="none" stroke={heatColor} strokeWidth="1.8" opacity="0.6" />
        {/* termometer mini */}
        <rect x="290" y="20" width="6" height="80" rx="3" fill="var(--border)" />
        <rect x="290" y={100 - (temp / 80) * 76} width="6" height={(temp / 80) * 76} rx="3" fill={heatColor} />
        <circle cx="293" cy="102" r="5" fill={heatColor} />
        {/* partikel */}
        {Array.from({ length: 18 }).map((_, i) => {
          const active = i < nActive;
          const baseDur = active ? (2.6 - (temp / 80) * 1.9) : 99;
          const x0 = 36 + ((i * 37) % 250);
          const y0 = 28 + ((i * 23) % 76);
          return (
            <g key={i}>
              <circle cx={x0} cy={y0} r={active ? 4.5 : 3.5}
                fill={active ? heatColor : "var(--muted)"}
                opacity={active ? 0.85 : 0.3}>
                {active && (
                  <animate attributeName="r" values="4;5;4" dur={`${0.6 + (i % 4) * 0.15}s`} repeatCount="indefinite" />
                )}
              </circle>
              {active && (
                <animateTransform attributeName="transform" type="translate"
                  values={`0 0; ${(i % 2 ? 1 : -1) * (14 + (i % 5) * 6)}, ${(i % 3 ? -1 : 1) * (10 + (i % 4) * 5)};
                           ${(i % 2 ? -1 : 1) * (8 + (i % 3) * 5)}, ${(i % 2 ? 1 : -1) * (12 + (i % 5) * 4)}; 0 0`}
                  dur={`${Math.max(baseDur, 0.55)}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.08}s`} />
              )}
            </g>
          );
        })}
        {/* label energi */}
        <text x="160" y="132" textAnchor="middle" fontSize="9" fill={heatColor} fontFamily="monospace">
          {temp}°C · Ea {ea} kJ/mol · laju {atTemp.toExponential(1)}
        </text>
      </svg>

      {/* bar chart suhu */}
      <div className="mt-3 space-y-1.5">
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
        <p className="pt-1 text-center text-[10px] text-[var(--muted)]">skala logaritmik — perhatikan loncatan di ujung kanan!</p>
      </div>
    </div>
  );
}

/* ================= LARUTAN PENYANGGA ================= */
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
  // posisi titik sekarang pada kurva
  let cx = sx(0), cy = sy(curve[0].ph);
  for (const p of curve) if (p.mol <= mol) { cx = sx(p.mol); cy = sy(p.ph); }

  return (
    <div>
      {/* gelas kimia dengan larutan berubah warna */}
      <svg viewBox="0 0 320 110" className="w-full" role="img" aria-label={`Gelas kimia larutan penyangga ${system.label}, pH ${currentPh.toFixed(2)}`}>
        <path d="M100 20 L104 96 Q105 102 112 102 L208 102 Q215 102 216 96 L220 20 Z"
          fill="none" stroke="var(--muted)" strokeWidth="1.8" />
        <rect x={106} y={40} width={108} height={58} rx={4} fill={color} opacity="0.45">
          <animate attributeName="opacity" values="0.38;0.52;0.38" dur="2.6s" repeatCount="indefinite" />
        </rect>
        {/* tetesan asam/basa yang jatuh */}
        {mol > 0 && (
          <circle cx={added === "asam" ? 130 : 190} cy="30" r="2.5" fill={added === "asam" ? "#e05c7a" : "#5b8def"}>
            <animate attributeName="cy" values="28;44" dur="0.7s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;0" dur="0.7s" repeatCount="indefinite" />
          </circle>
        )}
        {/* perisai kecil = simbol penyangga */}
        <g transform="translate(252,30)" opacity="0.75">
          <path d="M0 -10 L9 -6 V3 Q0 12 -0 12 Q-0 12 -9 3 V-6 Z" fill="none" stroke={color} strokeWidth="1.5" />
          <text x="14" y="4" fontSize="9" fill="var(--muted)">pH tahan!</text>
        </g>
        <text x="160" y="34" textAnchor="middle" fontSize="13" fontWeight="bold" fill={color} fontFamily="monospace">
          {currentPh.toFixed(2)}
        </text>
      </svg>

      {/* kurva */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Kurva titrasi penyangga terhadap basa kuat">
        {[0, 3, 7, 11, 14].map((t) => (
          <g key={t}>
            <line x1={PAD} y1={sy(t)} x2={W - 12} y2={sy(t)} stroke="var(--border)" strokeWidth="0.7" />
            <text x={PAD - 6} y={sy(t) + 3} textAnchor="end" fontSize="9" fill="var(--muted)" fontFamily="monospace">{t}</text>
          </g>
        ))}
        <line x1={PAD} y1={sy(system.pka)} x2={W - 12} y2={sy(system.pka)} stroke="#34e0a1" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.55" />
        <text x={W - 16} y={sy(system.pka) - 5} textAnchor="end" fontSize="8.5" fill="#34e0a1" fontFamily="monospace">pKa {system.pka}</text>
        <line x1={PAD} y1={H - PAD} x2={W - 12} y2={H - PAD} stroke="var(--muted)" strokeWidth="1" />
        <line x1={PAD} y1="14" x2={PAD} y2={H - PAD} stroke="var(--muted)" strokeWidth="1" />
        <text x={(W + PAD) / 2} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--muted)">mol OH⁻ ditambahkan</text>
        <text x="12" y={(H - PAD + 20) / 2} fontSize="10" fill="var(--muted)" transform={`rotate(-90 12 ${(H - PAD + 20) / 2})`} textAnchor="middle">pH</text>
        <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2.6" strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 6px color-mix(in srgb, var(--accent) 35%, transparent))" }} />
        <circle cx={cx} cy={cy} r="6" fill="#e05c7a" stroke="white" strokeWidth="1.5">
          <animate attributeName="r" values="5;7;5" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </svg>
      <p className="mt-1 text-center text-[11px] text-[var(--muted)]">
        Daerah datar di pKa = zona kerja penyangga · titik merah = kondisi sekarang
      </p>
    </div>
  );
}

/* ================= SEL VOLTA ================= */
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
  return (
    <div>
      <svg viewBox="0 0 320 210" className="w-full" role="img"
        aria-label={`Sel volta ${anode.symbol}-${cathode.symbol}, E sel ${eCell.toFixed(2)} volt`}>
        {/* kawat + voltmeter */}
        <path d={`M70 ${wireY} H140 M180 ${wireY} H250`} stroke="var(--muted)" strokeWidth="1.6" />
        <rect x="140" y={wireY - 12} width="40" height="24" rx="5" fill="none" stroke={spontan ? "#34e0a1" : "var(--muted)"} strokeWidth="1.6" />
        <text x="160" y={wireY + 4} textAnchor="middle" fontSize="10" fontWeight="bold"
          fill={spontan ? "#34e0a1" : "var(--muted)"} fontFamily="monospace">
          {Math.abs(eCell).toFixed(2)}V
        </text>
        {/* elektron mengalir anoda → katoda (kiri ke kanan jika anoda di kiri) */}
        {spontan && [0, 1, 2].map((i) => {
          const fromX = 70, toX = 140;
          const rev = anode.name > cathode.name; // urutan tampilan stabil untuk arah aliran elektron
          const x1 = rev ? 180 : fromX, x2 = rev ? 250 : toX;
          return (
            <circle key={i} r="3" fill="#e05c7a">
              <animate attributeName="cx" values={`${x1};${x2}`} dur="1.4s" begin={`${i * 0.45}s`} repeatCount="indefinite" />
              <animate attributeName="cy" values={`${wireY};${wireY}`} dur="1.4s" begin={`${i * 0.45}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;1;0" dur="1.4s" begin={`${i * 0.45}s`} repeatCount="indefinite" />
            </circle>
          );
        })}
        {/* gelas kiri (anoda) */}
        <path d="M40 60 L44 170 Q45 176 52 176 L108 176 Q115 176 116 170 L120 60 Z" fill="none" stroke="var(--muted)" strokeWidth="1.6" />
        <rect x={47} y={90} width={66} height={82} rx={3} fill={anode.solutionColor} opacity="0.4" />
        {/* pelat anoda */}
        <rect x={72} y={48} width={16} height={112} rx={2} fill={anode.color} opacity="0.85" />
        <text x={80} y={200} textAnchor="middle" fontSize="11" fontWeight="bold" fill={anode.color} fontFamily="monospace">{anode.symbol}</text>
        <text x={80} y={36} textAnchor="middle" fontSize="8.5" fill="var(--muted)">anoda (−)</text>
        {/* jembatan garam */}
        <path d="M118 92 Q160 74 202 92" fill="none" stroke="var(--muted)" strokeWidth="7" strokeLinecap="round" opacity="0.55" />
        <path d="M118 92 Q160 74 202 92" fill="none" stroke="var(--surface-solid)" strokeWidth="3.5" strokeLinecap="round" />
        <text x="160" y="66" textAnchor="middle" fontSize="8.5" fill="var(--muted)">jembatan garam</text>
        {/* gelas kanan (katoda) */}
        <path d="M200 60 L204 170 Q205 176 212 176 L268 176 Q275 176 276 170 L280 60 Z" fill="none" stroke="var(--muted)" strokeWidth="1.6" />
        <rect x={207} y={90} width={66} height={82} rx={3} fill={cathode.solutionColor} opacity="0.4" />
        <rect x={232} y={48} width={16} height={112} rx={2} fill={cathode.color} opacity="0.85" />
        <text x={240} y={200} textAnchor="middle" fontSize="11" fontWeight="bold" fill={cathode.color} fontFamily="monospace">{cathode.symbol}</text>
        <text x={240} y={36} textAnchor="middle" fontSize="8.5" fill="var(--muted)">katoda (+)</text>
        {/* gelembung di anoda saat spontan */}
        {spontan && [64, 80, 96].map((x, i) => (
          <circle key={x} cx={x} cy="150" r="1.8" fill={anode.solutionColor}>
            <animate attributeName="cy" values="152;128" dur={`${1 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.3}s`} />
            <animate attributeName="opacity" values="0;0.9;0" dur={`${1 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.3}s`} />
          </circle>
        ))}
        {/* notasi sel */}
        <text x="160" y="196" textAnchor="middle" fontSize="9" fill="var(--muted)" fontFamily="monospace" opacity="0.85">
          {anode.symbol} | {anode.ion} ‖ {cathode.ion} | {cathode.symbol}
        </text>
        {/* reaksi setengah sel */}
        <text x={80} y={186} textAnchor="middle" fontSize="7.5" fill="currentColor" opacity="0.6" fontFamily="monospace">{anode.halfReaction}</text>
        <text x={240} y={186} textAnchor="middle" fontSize="7.5" fill="currentColor" opacity="0.6" fontFamily="monospace">{cathode.halfReaction}</text>
      </svg>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <div className="rounded-xl px-3 py-2.5" style={{ background: `${anode.color}14`, border: `1px solid ${anode.color}33` }}>
          <p className="font-mono text-[10px]" style={{ color: anode.color }}>{anode.name} — oksidasi</p>
          <p className="mt-1 font-mono text-[10.5px] leading-relaxed">{anode.halfReaction}</p>
        </div>
        <div className="rounded-xl px-3 py-2.5" style={{ background: `${cathode.color}14`, border: `1px solid ${cathode.color}33` }}>
          <p className="font-mono text-[10px]" style={{ color: cathode.color }}>{cathode.name} — reduksi</p>
          <p className="mt-1 font-mono text-[10.5px] leading-relaxed">{cathode.halfReaction}</p>
        </div>
      </div>
      <p className="mt-2 text-center text-[11px] text-[var(--muted)]">
        {electronFlow > 0
          ? `${electronFlow.toFixed(2)} elektron lewat per reaksi — ubah konsentrasi ion dan lihat tegangannya (Nernst).`
          : "Reaksi tidak spontan pada susunan ini."}
      </p>
    </div>
  );
}
