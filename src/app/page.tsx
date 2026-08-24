import { ArrowRight } from "lucide-react";
import Calculator from "@/components/calculator";
import {
  Calculator as CalcIcon, FlaskConical, TrendingUp, Database, TestTube,
} from "lucide-react";

const MODULES = [
  { icon: CalcIcon, title: "Kalkulator", desc: "12 mode hitung: mol sampai gas ideal. Langkahnya ditampilkan.", href: "/", active: true },
  { icon: FlaskConical, title: "Explorer", desc: "23 fenomena sehari-hari dan kimia di baliknya.", href: "/explorer", active: true },
  { icon: TrendingUp, title: "Simulasi", desc: "Geser variabel, lihat kurva titrasi & laju reaksi merespons.", href: "/simulasi", active: true },
  { icon: Database, title: "Zat", desc: "45 zat: massa molar, sifat, dan bahayanya.", href: "/database", active: true },
  { icon: TestTube, title: "Lab Virtual", desc: "Titrasi manual, elektrolisis air, logam + asam.", href: "/lab", active: true },
];

export default function Home() {
  return (
    <main className="relative mx-auto max-w-4xl px-5 pb-16 pt-6 sm:pt-8">
      {/* Hero */}
      <header className="max-w-xl">
        <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          Hitung. Pahami.{" "}
          <span className="text-[var(--accent)]">Buktikan.</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          Kalkulator kimia yang menunjukkan cara kerjanya langkah demi langkah —
          bukan cuma angka jadi. Ada 23 fenomena sehari-hari untuk latihan membaca soal,
          simulasi untuk uji coba, dan lab virtual tanpa risiko tumpah.
        </p>

        {/* animasi molekul air bergerak */}
        <svg viewBox="0 0 480 70" className="mt-5 w-full max-w-md" role="img"
          aria-label="Molekul air dan gas bergerak melintas" aria-hidden>
          {/* molekul H2O: O besar + 2 H kecil, bentuk V */}
          {[0, 1].map((m) => (
            <g key={m}>
              <circle cx="0" cy="0" r="9" fill="#e05c7a" opacity="0.85" />
              <circle cx="-12" cy="-8" r="5" fill="#6aa5ff" />
              <circle cx="12" cy="-8" r="5" fill="#6aa5ff" />
              <animateTransform attributeName="transform" type="translate"
                from="-40 40" to={m ? "520 30" : "520 52"}
                dur={`${9 + m * 3}s`} begin={`${m * -4}s`} repeatCount="indefinite" />
            </g>
          ))}
          {/* molekul CO2 linear */}
          <g opacity="0.7">
            <circle cx="0" cy="0" r="6" fill="#4a4a58" />
            <circle cx="-13" cy="0" r="7" fill="#e05c7a" />
            <circle cx="13" cy="0" r="7" fill="#e05c7a" />
            <animateTransform attributeName="transform" type="translate"
              from="-60 18" to="540 14" dur="12s" begin="-7s" repeatCount="indefinite" />
          </g>
          {/* gelembung kecil naik */}
          {[[90, "#bfe3ff"], [210, "#bfe3ff"], [330, "#ffb454"]].map(([x, c], i) => (
            <circle key={i} cx={x as number} cy="66" r="2" fill={c as string} opacity="0.6">
              <animate attributeName="cy" values="68;8" dur={`${3 + i}s`} repeatCount="indefinite" begin={`${i * 1.1}s`} />
              <animate attributeName="opacity" values="0;0.7;0" dur={`${3 + i}s`} repeatCount="indefinite" begin={`${i * 1.1}s`} />
            </circle>
          ))}
        </svg>
      </header>

      {/* Kalkulator */}
      <section className="mt-10" id="calc">
        <h2 className="mb-3.5 text-base font-semibold">Kalkulator</h2>
        <Calculator />
      </section>

      {/* Modul lain */}
      <section className="mt-14">
        <h2 className="mb-3.5 text-base font-semibold">Modul lain</h2>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((mod) => {
            const Icon = mod.icon;
            const inner = (
              <>
                <div className="flex items-center justify-between">
                  <Icon size={19} strokeWidth={1.5} className={mod.active ? "text-[var(--accent)]" : "text-[var(--muted)]"} />
                  {mod.active ? null : (
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--muted)]/70">segera</span>
                  )}
                </div>
                <h3 className="mt-3 flex items-center gap-1 font-medium">
                  <span className={mod.active ? "" : "text-[var(--muted)]"}>{mod.title}</span>
                  {mod.active && <ArrowRight size={13} strokeWidth={1.75} className="text-[var(--muted)]" />}
                </h3>
                <p className={`mt-1 text-xs leading-relaxed ${mod.active ? "text-[var(--muted)]" : "text-[var(--muted)]/70"}`}>
                  {mod.desc}
                </p>
              </>
            );
            return mod.active ? (
              <a key={mod.title} href={mod.href} className="glass block p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]/40">
                {inner}
              </a>
            ) : (
              <div key={mod.title} className="glass block p-5 opacity-55">{inner}</div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
