"use client";

import { useState } from "react";
import { GraduationCap, School, ChevronDown } from "lucide-react";

interface Item { title: string; body: string }

const FIRST_VISIBLE = 2; // langkah yang langsung terlihat sebelum di-expand

export default function LevelToggle({ basic, advanced }: {
  basic: { label: string; items: Item[] };
  advanced: { label: string; items: Item[] } | null;
}) {
  const [level, setLevel] = useState<"sma" | "kuliah">("sma");
  const [expanded, setExpanded] = useState(false);
  if (!advanced) {
    // tanpa konten lanjutan: tetap collapsible untuk penjelasan dasar
    return (
      <div>
        <ExplainList items={basic.items} expanded={expanded} setExpanded={setExpanded} color="var(--accent)" numbered showTitle={false} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-center">
        <div
          className="inline-flex rounded-full p-1"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", backdropFilter: "blur(var(--glass-blur))" }}
          role="tablist"
          aria-label="Level penjelasan"
        >
          {([["sma", "Dasar", School], ["kuliah", "Lanjutan", GraduationCap]] as const).map(([id, label, Icon]) => (
            <button
              key={id}
              role="tab"
              aria-selected={level === id}
              onClick={() => setLevel(id)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs transition-colors ${
                level === id ? "bg-[var(--accent)] font-medium text-white" : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              <Icon size={13} strokeWidth={1.75} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        {/* SMA */}
        {level === "sma" && (
          <ExplainList items={basic.items} expanded={expanded} setExpanded={setExpanded} color="var(--accent)" numbered showTitle={false} />
        )}
        {/* Kuliah — selalu tampil penuh (pemilih level = bentuk expand-nya) */}
        {level === "kuliah" && (
          <ol>
            {advanced.items.map((item, i) => (
              <li key={"a" + i} className="relative pb-6 pl-7 last:pb-0" style={{ borderLeft: "1px solid var(--border)" }}>
                <StepDot n={i + 1} color="#9d6fd6" />
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed">{item.body}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

/** Daftar langkah dengan collapse: 2 pertama tampak, sisanya butuh klik. */
function ExplainList({ items, expanded, setExpanded, color, numbered, showTitle }: {
  items: Item[];
  expanded: boolean;
  setExpanded: (v: boolean) => void;
  color: string;
  numbered: boolean;
  showTitle: boolean;
}) {
  const hasMore = items.length > FIRST_VISIBLE;
  const visible = expanded ? items : items.slice(0, FIRST_VISIBLE);

  return (
    <div>
      <ol>
        {visible.map((item, i) => (
          <li key={i} className="relative pb-5 pl-7 last:pb-0" style={{ borderLeft: "1px solid var(--border)" }}>
            <StepDot n={numbered ? i + 1 : 0} color={color} />
            {showTitle && item.title && <p className="text-sm font-semibold">{item.title}</p>}
            <p className={`text-sm leading-relaxed ${!expanded && i === FIRST_VISIBLE - 1 && hasMore ? "" : ""}`}>{item.body}</p>
          </li>
        ))}
        {!expanded && hasMore && (
          <li className="relative pb-0 pl-7" style={{ borderLeft: "1px solid var(--border)" }}>
            {/* indikator teks terpotong */}
            <span className="absolute -left-[8px] top-0 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[var(--bg)] font-mono text-[9px]"
              style={{ border: "1px dashed var(--border)", marginLeft: "-0.5px", color: "var(--muted)" }}>
              …
            </span>
            <p className="text-sm leading-relaxed text-[var(--muted)] line-clamp-2">{items[FIRST_VISIBLE]?.body}</p>
          </li>
        )}
      </ol>

      {hasMore && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium text-[var(--accent)] transition-all hover:gap-2.5"
          style={{ background: "var(--accent-soft)" }}
        >
          Baca penjelasan lengkap ({items.length - FIRST_VISIBLE} langkah lagi)
          <ChevronDown size={13} strokeWidth={2} />
        </button>
      )}
      {hasMore && expanded && (
        <button
          onClick={() => { setExpanded(false); }}
          className="mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs text-[var(--muted)] transition-colors hover:text-[var(--text)]"
          style={{ border: "1px solid var(--border)" }}
        >
          <ChevronDown size={12} strokeWidth={2} className="rotate-180" />
          Ringkas
        </button>
      )}
    </div>
  );
}

function StepDot({ n, color }: { n: number; color: string }) {
  return (
    <span
      className="absolute -left-[8px] top-0 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[var(--bg)] font-mono text-[9px]"
      style={{ border: "1px solid var(--border)", marginLeft: "-0.5px", color }}
    >
      {n || "…"}
    </span>
  );
}
