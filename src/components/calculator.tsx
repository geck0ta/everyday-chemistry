"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Scale, Atom, Weight, Beaker, Droplets, Activity,
  GitCompareArrows, FlaskConical, Percent,
  Flame, ThermometerSun, Wind,
} from "lucide-react";
import {
  molarMass, molFromMass, massFromMol,
  molarity, dilution, phFromConcentration,
  type CalcResult, type Step,
} from "@/lib/chemistry";
import Formula from "@/components/formula";
import HistoryPanel, { loadHistory, type HistoryItem } from "@/components/history-panel";
import CalcDiagram from "@/components/calc-diagram";
import {
  balanceEquation, limitingReagent, reactionYield,
  sensibleHeat, heatOfReaction, gasIdeal,
} from "@/lib/stoichiometry";

type Mode =
  | "molar-mass" | "mol" | "mass" | "molarity" | "dilution" | "ph"
  | "balance" | "limiting" | "yield" | "heat" | "dh" | "gas";

const MODES: { id: Mode; label: string; formula: string; icon: typeof Scale }[] = [
  { id: "molar-mass", label: "Massa Molar", formula: "M", icon: Scale },
  { id: "mol", label: "Jumlah Mol", formula: "n = m/M", icon: Atom },
  { id: "mass", label: "Massa Zat", formula: "m = n·M", icon: Weight },
  { id: "molarity", label: "Molaritas", formula: "M = n/V", icon: Beaker },
  { id: "dilution", label: "Pengenceran", formula: "M₁V₁=M₂V₂", icon: Droplets },
  { id: "ph", label: "pH Larutan", formula: "pH = −log[H⁺]", icon: Activity },
  { id: "balance", label: "Setara Persamaan", formula: "balancing", icon: GitCompareArrows },
  { id: "limiting", label: "Pereaksi Pembatas", formula: "stoikiometri", icon: FlaskConical },
  { id: "yield", label: "Persen Hasil", formula: "% hasil", icon: Percent },
  { id: "heat", label: "Kalor Q", formula: "Q = m·c·ΔT", icon: Flame },
  { id: "dh", label: "ΔH Reaksi", formula: "ΔH = Q/n", icon: ThermometerSun },
  { id: "gas", label: "Gas Ideal", formula: "PV = nRT", icon: Wind },
];

const inputCls =
  "w-full rounded-xl glass-input px-3.5 py-2.5 text-sm outline-none border-none transition-colors placeholder:text-[var(--muted)]/60";
const labelCls = "block text-xs font-medium text-[var(--muted)] mb-1.5";

function Field(props: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; suffix?: string }) {
  return (
    <div>
      <label className={labelCls}>{props.label}</label>
      <div className="relative">
        <input
          className={inputCls}
          value={props.value}
          placeholder={props.placeholder}
          onChange={(e) => props.onChange(e.target.value)}
          inputMode="decimal"
        />
        {props.suffix && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]">{props.suffix}</span>
        )}
      </div>
    </div>
  );
}

function Steps({ result }: { result: CalcResult }) {
  if (!result.ok) {
    return (
      <p className="mt-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400">
        {result.error}
      </p>
    );
  }
  return (
    <div className="mt-6">
      <div className="rounded-xl px-4 py-3.5" style={{ background: "var(--accent-soft)" }}>
        <p className="text-base font-semibold text-[var(--accent)]">{result.summary}</p>
      </div>
      <ol className="mt-5 space-y-0">
        {result.steps.map((s, i) => (
          <li key={i} className="relative pb-4 pl-7 last:pb-0" style={{ borderLeft: "1px solid var(--border)" }}>
            <span className="absolute -left-[8px] top-0 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[var(--surface-solid)] font-mono text-[9px] text-[var(--muted)]"
              style={{ border: "1px solid var(--border)", marginLeft: "-0.5px" }}>
              {i + 1}
            </span>
            <p className="text-sm font-medium">{s.title}</p>
            {s.formula && (
              <p className="mt-1 font-mono text-sm text-[var(--accent)]"><Formula text={s.formula} /></p>
            )}
            {s.substitution && (
              <p className="mt-0.5 font-mono text-xs text-[var(--muted)]"><Formula text={s.substitution} /></p>
            )}
            {s.result && (
              <p className="mt-1 font-mono text-sm font-semibold">{s.result}</p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Calculator() {
  const [mode, setMode] = useState<Mode>("molar-mass");
  const [formula, setFormula] = useState("");
  const [mass, setMass] = useState("");
  // cross-link dari explorer: /?formula=Fe2O3
  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search).get("formula");
    if (q) setFormula(q);
  }, []);
  const [n, setN] = useState("");
  const [vol, setVol] = useState("");
  const [M1, setM1] = useState("");
  const [V1, setV1] = useState("");
  const [M2, setM2] = useState("");
  const [conc, setConc] = useState("");
  const [kind, setKind] = useState<"h" | "oh">("h");
  // mode baru
  const [equation, setEquation] = useState("");
  // pereaksi pembatas: daftar "rumus, mol"
  const [reactants, setReactants] = useState<string[]>(["", ""]);   // "CH4, 4"
  const [productCoeff, setProductCoeff] = useState("");             // koefisien & rumus produk: "H2O, 2" → pakai mol target
  // yield
  const [actualY, setActualY] = useState("");
  const [theoY, setTheoY] = useState("");
  // termokimia
  const [heatMass, setHeatMass] = useState("");
  const [heatC, setHeatC] = useState("4.18");
  const [heatDT, setHeatDT] = useState("");
  const [dhQ, setDhQ] = useState("");
  const [dhN, setDhN] = useState("");
  const [dhExo, setDhExo] = useState(true);
  // gas ideal
  const [gP, setGP] = useState("");
  const [gV, setGV] = useState("");
  const [gN, setGN] = useState("");
  const [gT, setGT] = useState("");

  const num = (v: string) => parseFloat(v.replace(",", "."));
  const fmtNum = (n: number) => parseFloat(n.toPrecision(6)).toString();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  useEffect(() => setHistory(loadHistory()), []);
  const clearHistory = () => {
    localStorage.removeItem("ec-calc-history");
    setHistory([]);
  };
  // catat hasil valid ke riwayat — didelegasikan ke efek di bawah (setelah result terdefinisi)
  function modeLabel(m: Mode): string {
    return MODES.find((x) => x.id === m)?.label ?? m;
  }
  function inputSummary(m: Mode): string {
    switch (m) {
      case "molar-mass": case "mol": case "mass": case "molarity": return formula;
      case "dilution": return `${M1} M, ${V1} L → ${M2} M`;
      case "ph": return `[${kind === "h" ? "H" : "OH"}⁺] = ${conc} M`.replace("H⁺]", "H⁺]");
      case "balance": return equation;
      case "limiting": return reactants.filter(Boolean).join(" + ") + ` → ${productCoeff}`;
      case "yield": return `${actualY}/${theoY}`;
      case "heat": return `m=${heatMass} g, ΔT=${heatDT}°C`;
      case "dh": return `Q=${dhQ} J, n=${dhN}`;
      case "gas": return [gP && `P=${gP}`, gV && `V=${gV}`, gN && `n=${gN}`, gT && `T=${gT}`].filter(Boolean).join(", ");
      default: return "";
    }
  }

  // nilai numerik utama untuk diagram animasi per mode — didefinisikan setelah result (lihat bawah)
  const result = useMemo<CalcResult | null>(() => {
    try {
      switch (mode) {
        case "molar-mass":
          if (!formula) return null;
          return molarMass(formula);
        case "mol": {
          if (!formula || !mass || isNaN(num(mass))) return null;
          const mm = molarMass(formula);
          if (!mm.ok || !mm.value) return mm;
          return molFromMass(num(mass), mm.value);
        }
        case "mass": {
          if (!formula || !n || isNaN(num(n))) return null;
          const mm = molarMass(formula);
          if (!mm.ok || !mm.value) return mm;
          return massFromMol(num(n), mm.value);
        }
        case "molarity": {
          if (!formula || !mass || !vol || isNaN(num(mass)) || isNaN(num(vol))) return null;
          const mm = molarMass(formula);
          if (!mm.ok || !mm.value) return mm;
          const moles = molFromMass(num(mass), mm.value);
          if (!moles.ok || !moles.value) return moles;
          const m = molarity(moles.value, num(vol));
          return m.ok ? { ...m, steps: [...mm.steps.slice(-1), ...moles.steps, ...m.steps] } : m;
        }
        case "dilution": {
          if ([M1, V1, M2].some((v) => !v || isNaN(num(v)))) return null;
          return dilution(num(M1), num(V1), num(M2));
        }
        case "ph": {
          if (!conc || isNaN(num(conc))) return null;
          return phFromConcentration(num(conc), kind);
        }
        case "balance": {
          if (!equation.trim()) return null;
          const r = balanceEquation(equation);
          if (!r.ok) return { ok: false, steps: [], error: r.error };
          return {
            ok: true,
            summary: r.formatted,
            steps: [
              { title: "Persamaan yang dimasukkan", result: equation.trim() },
              { title: "Koefisien reaksi", result: r.coeffs!.join(" : ") },
              { title: "Persamaan setara", formula: r.formatted },
            ],
          };
        }
        case "limiting": {
          // input reaktan "H2, 4" per baris; produk "2 H2O" (koefisien + rumus)
          const parsed = reactants
            .map((r) => r.split(/[,;]/).map((s) => s.trim()))
            .filter((p) => p[0] && p[1] !== undefined && !isNaN(num(p[1])));
          if (parsed.length < 2 || !productCoeff.trim()) return null;
          const pc = productCoeff.trim().match(/^(\d*)\s*(.+)$/);
          if (!pc) return { ok: false, steps: [], error: "Format produk: koefisien lalu rumus, mis. 2 H2O" };
          const pCoeff = pc[1] ? parseInt(pc[1]) : 1;
          const mols = parsed.map((p) => num(p[1]));
          const coeffs = parsed.map((_, i) => 1); // placeholder → diganti di bawah via balancing
          // coba balancing otomatis dari rumus untuk dapat koefisien
          const eqStr = parsed.map((p, i) => (i ? "+ " : "") + p[0]).join(" ") + " -> " + (pc[1] ? pc[1] + " " : "") + pc[2].replace(/\s/g, "");
          const bal = balanceEquation(eqStr);
          let reactCoeffs: number[], prodCoeff: number;
          if (bal.ok) {
            reactCoeffs = bal.coeffs!.slice(0, parsed.length);
            prodCoeff = bal.coeffs![parsed.length];
          } else {
            return { ok: false, steps: [], error: `Tidak bisa menyeimbangkan reaksi otomatis (${bal.error}). Pastikan reaktan & produk membentuk reaksi valid.` };
          }
          void coeffs;
          const r = limitingReagent(mols, reactCoeffs, [prodCoeff], 0);
          if (!r.ok) return { ok: false, steps: [], error: r.error };
          const names = parsed.map((p) => p[0]);
          return {
            ok: true,
            summary: `Produk: ${fmtNum(r.productMol!)} mol ${pc[2]}`,
            steps: [
              { title: "Persamaan setara", formula: bal.formatted },
              ...(r.steps ?? []).map((s) => ({
                ...s,
                title: s.title.replace(/pereaksi ke-(\d+)/g, (_, d) => `pereaksi ke-${d} (${names[+d - 1] ?? "?"})`),
                result: s.result?.replace(/pereaksi ke-(\d+)/g, (_, d) => `pereaksi ke-${d} (${names[+d - 1] ?? "?"})`),
              })),
            ],
          };
        }
        case "yield": {
          if ([actualY, theoY].some((v) => !v || isNaN(num(v)))) return null;
          const r = reactionYield(num(actualY), num(theoY));
          if (!r.ok) return { ok: false, steps: [], error: r.error };
          void r;
          const percent = (num(actualY) / num(theoY)) * 100;
          return {
            ok: true,
            summary: `Persen hasil = ${fmtNum(percent)}%`,
            steps: [
              { title: "Rumus persen hasil", formula: "% hasil = (hasil aktual / hasil teoretis) × 100%" },
              { title: "Substitusi", substitution: `(${actualY} / ${theoY}) × 100%` },
              { title: "Hasil", result: `${fmtNum(percent)}%` },
            ],
          };
        }
        case "heat": {
          if ([heatMass, heatDT].some((v) => !v || isNaN(num(v))) || !heatC || isNaN(num(heatC))) return null;
          const r = sensibleHeat(num(heatMass), num(heatC), num(heatDT));
          if (!r.ok) return { ok: false, steps: [], error: r.error };
          return { ok: true, summary: `Q = ${fmtNum(r.qKj!)} kJ`, steps: r.steps ?? [] };
        }
        case "dh": {
          if ([dhQ, dhN].some((v) => !v || isNaN(num(v)))) return null;
          const r = heatOfReaction(num(dhQ), num(dhN), dhExo);
          if (!r.ok) return { ok: false, steps: [], error: r.error };
          return { ok: true, summary: `ΔH = ${fmtNum(r.deltaHKjPerMol!)} kJ/mol`, steps: r.steps ?? [] };
        }
        case "gas": {
          const vals = { P: gP !== "" ? num(gP) : undefined, V: gV !== "" ? num(gV) : undefined, n: gN !== "" ? num(gN) : undefined, T: gT !== "" ? num(gT) : undefined };
          if (Object.values(vals).every((v) => v === undefined)) return null;
          const r = gasIdeal(vals);
          if (!r.ok) return { ok: false, steps: [], error: r.error };
          return { ok: true, summary: `${r.solvedFor} = ${fmtNum(r.value!)}`, steps: r.steps ?? [] };
        }
      }
    } catch {
      return { ok: false, steps: [], error: "Terjadi kesalahan perhitungan. Periksa kembali input." };
    }
   }, [mode, formula, mass, n, vol, M1, V1, M2, conc, kind, equation, reactants, productCoeff, actualY, theoY, heatMass, heatC, heatDT, dhQ, dhN, dhExo, gP, gV, gN, gT]); // eslint-disable-line react-hooks/exhaustive-deps

  // nilai numerik utama untuk diagram animasi per mode
  const diagramValue: number = useMemo(() => {
    if (!result?.ok) return 0;
    switch (mode) {
      case "ph": return result.value ?? 7;
      case "yield": {
        const a = num(actualY), t = num(theoY);
        return t > 0 ? (a / t) * 100 : 0;
      }
      case "gas": {
        const match = result.summary?.match(/= ([-\d.eE+]+)/);
        return match ? parseFloat(match[1]) : 0;
      }
      case "dh": {
        const match = result.summary?.match(/(-?[\d.]+) kJ/);
        return match ? parseFloat(match[1]) : 0;
      }
      case "heat":
        return isNaN(num(heatDT)) ? 1 : Math.sign(num(heatDT)) || 1;
      default:
        return result.value ?? 0;
    }
  }, [result, mode, actualY, theoY, heatDT]); // eslint-disable-line react-hooks/exhaustive-deps

  // catat hasil valid ke riwayat (dedup berurutan, maksimal 12)
  const recordedKey = result?.ok ? result.summary : null;
  useEffect(() => {
    if (!recordedKey) return;
    setHistory((prev) => {
      if (prev[0]?.summary === recordedKey && prev[0]?.mode === modeLabel(mode)) return prev;
      const item: HistoryItem = {
        mode: modeLabel(mode),
        input: inputSummary(mode),
        summary: recordedKey,
        at: Date.now(),
      };
      const next = [item, ...prev.filter((p) => p.summary !== item.summary)].slice(0, 12);
      try { localStorage.setItem("ec-calc-history", JSON.stringify(next)); } catch {}
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordedKey]);

  return (
    <section aria-label="Kalkulator kimia">
      {/* pemilih mode */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {MODES.map((m) => {
          const Icon = m.icon;
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex items-center gap-2.5 rounded-2xl px-3.5 py-3 text-left transition-all ${
                active ? "" : "glass hover:border-[var(--accent)]/40"
              }`}
              style={active ? { background: "var(--accent-soft)", border: "1px solid var(--accent)", backdropFilter: "blur(var(--glass-blur))" } : undefined}
            >
              <Icon size={17} strokeWidth={1.75} className={active ? "text-[var(--accent)] shrink-0" : "text-[var(--muted)] shrink-0"} />
              <span className="min-w-0">
                <span className={`block truncate text-sm ${active ? "font-semibold text-[var(--accent)]" : ""}`}>{m.label}</span>
                <span className="block truncate font-mono text-[10px] text-[var(--muted)]">{m.formula}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* form */}
      <div className="glass mt-4 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(mode === "molar-mass" || mode === "mol" || mode === "mass" || mode === "molarity") && (
            <Field label="Rumus kimia" value={formula} onChange={setFormula} placeholder="mis. H2SO4 atau Ca(OH)2" />
          )}
          {(mode === "mol" || mode === "molarity") && (
            <Field label="Massa zat" value={mass} onChange={setMass} placeholder="mis. 9.8" suffix="gram" />
          )}
          {mode === "mass" && (
            <Field label="Jumlah mol" value={n} onChange={setN} placeholder="mis. 0.25" suffix="mol" />
          )}
          {mode === "molarity" && (
            <Field label="Volume larutan" value={vol} onChange={setVol} placeholder="mis. 0.5" suffix="liter" />
          )}
          {mode === "dilution" && (
            <>
              <Field label="M₁ — konsentrasi awal" value={M1} onChange={setM1} placeholder="mis. 2" suffix="M" />
              <Field label="V₁ — volume awal" value={V1} onChange={setV1} placeholder="mis. 0.1" suffix="L" />
              <Field label="M₂ — konsentrasi target" value={M2} onChange={setM2} placeholder="mis. 0.5" suffix="M" />
            </>
          )}
          {mode === "ph" && (
            <>
              <div>
                <label className={labelCls}>Yang diketahui</label>
                <select className={`${inputCls} appearance-none`} value={kind} onChange={(e) => setKind(e.target.value as "h" | "oh")}>
                  <option value="h">[H⁺] ion hidrogen</option>
                  <option value="oh">[OH⁻] ion hidroksida</option>
                </select>
              </div>
              <Field
                label={kind === "h" ? "Konsentrasi [H⁺]" : "Konsentrasi [OH⁻]"}
                value={conc}
                onChange={setConc}
                placeholder="mis. 0.01"
                suffix="M"
              />
            </>
          )}
          {mode === "balance" && (
            <div className="sm:col-span-2 lg:col-span-3">
              <Field label="Persamaan reaksi (belum setara)" value={equation} onChange={setEquation} placeholder="mis. CH4 + O2 -> CO2 + H2O" />
            </div>
          )}
          {mode === "limiting" && (
            <>
              <div className="sm:col-span-1">
                <label className={labelCls}>Reaktan 1 — rumus, mol</label>
                <input className={inputCls} value={reactants[0]} placeholder="CH4, 4"
                  onChange={(e) => setReactants((r) => [e.target.value, r[1]])} />
              </div>
              <div className="sm:col-span-1">
                <label className={labelCls}>Reaktan 2 — rumus, mol</label>
                <input className={inputCls} value={reactants[1]} placeholder="O2, 3"
                  onChange={(e) => setReactants((r) => [r[0], e.target.value])} />
              </div>
              <Field label="Produk — koefisien & rumus" value={productCoeff} onChange={setProductCoeff} placeholder="2 H2O" />
            </>
          )}
          {mode === "yield" && (
            <>
              <Field label="Hasil aktual" value={actualY} onChange={setActualY} placeholder="mis. 8" suffix="gram/mol" />
              <Field label="Hasil teoretis" value={theoY} onChange={setTheoY} placeholder="mis. 10" suffix="gram/mol" />
            </>
          )}
          {mode === "heat" && (
            <>
              <Field label="Massa zat" value={heatMass} onChange={setHeatMass} placeholder="mis. 2000" suffix="gram" />
              <Field label="Kalor jenis (c)" value={heatC} onChange={setHeatC} placeholder="4.18" suffix="J/g·°C" />
              <Field label="Perubahan suhu ΔT" value={heatDT} onChange={setHeatDT} placeholder="mis. 75" suffix="°C" />
            </>
          )}
          {mode === "dh" && (
            <>
              <Field label="Kalor reaksi (Q)" value={dhQ} onChange={setDhQ} placeholder="mis. 627000" suffix="joule" />
              <Field label="Mol zat yang bereaksi" value={dhN} onChange={setDhN} placeholder="mis. 10" suffix="mol" />
              <div>
                <label className={labelCls}>Jenis reaksi</label>
                <select className={`${inputCls} appearance-none`} value={dhExo ? "exo" : "endo"}
                  onChange={(e) => setDhExo(e.target.value === "exo")}>
                  <option value="exo">Eksotermik (melepas kalor)</option>
                  <option value="endo">Endotermik (menyerap kalor)</option>
                </select>
              </div>
            </>
          )}
          {mode === "gas" && (
            <>
              <Field label="Tekanan P (kosongkan jika dicari)" value={gP} onChange={setGP} placeholder="mis. 101325" suffix="Pa" />
              <Field label="Volume V (kosongkan jika dicari)" value={gV} onChange={setGV} placeholder="mis. 0.0224" suffix="m³" />
              <Field label="Jumlah mol n" value={gN} onChange={setGN} placeholder="mis. 1" suffix="mol" />
              <Field label="Suhu T" value={gT} onChange={setGT} placeholder="mis. 273.15" suffix="K" />
            </>
          )}
        </div>

        {result ? (
          <>
            <CalcDiagram mode={mode} value={diagramValue} />
            <div aria-live="polite" aria-atomic="true">
              <Steps result={result} />
            </div>
          </>
        ) : (
          <p className="mt-5 text-sm text-[var(--muted)]">
            Ketik untuk mulai menghitung.
          </p>
        )}
      </div>

      <HistoryPanel items={history} onClear={clearHistory} />
    </section>
  );
}
