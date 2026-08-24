"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

/** Ringkasan 1-2 kalimat + tombol "Baca penjelasan lengkap" yang expand bertahap.
 *  firstVisible = jumlah langkah yang langsung terlihat. */
export default function CollapsibleExplain({ steps, firstVisible = 2 }: {
  steps: string[];
  firstVisible?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = steps.length > firstVisible;
  const visible = expanded ? steps : steps.slice(0, firstVisible);

  return (
    <div>
      <ol>
        {visible.map((para, i) => (
          <li key={i} className="relative pb-5 pl-7 last:pb-0" style={{ borderLeft: "1px solid var(--border)" }}>
            <span
              className="absolute -left-[8px] top-0 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[var(--bg)] font-mono text-[9px]"
              style={{ border: "1px solid var(--border)", marginLeft: "-0.5px", color: "var(--accent)" }}
            >
              {i + 1}
            </span>
            <p className={`text-[15px] leading-relaxed transition-opacity ${!expanded && i === firstVisible - 1 && hasMore ? "[display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden opacity-80" : ""}`}>
              {para}
            </p>
          </li>
        ))}
      </ol>

      {hasMore && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-1 inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-medium text-[var(--accent)] transition-all hover:gap-2"
          style={{ background: "var(--accent-soft)" }}
        >
          Baca penjelasan lengkap ({steps.length - firstVisible} langkah lagi)
          <ChevronDown size={13} strokeWidth={2} />
        </button>
      )}
      {expanded && hasMore && (
        <button
          onClick={() => setExpanded(false)}
          className="mt-1 ml-2 inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs text-[var(--muted)] transition-colors hover:text-[var(--text)]"
        >
          <ChevronDown size={12} strokeWidth={2} className="rotate-180" />
          Ringkas
        </button>
      )}
    </div>
  );
}
