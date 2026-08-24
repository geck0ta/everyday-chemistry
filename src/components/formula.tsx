"use client";

import { useMemo } from "react";

/** Render formula kimia dengan subskrip HTML: input "H2SO4" → H<sub>2</sub>SO<sub>4</sub>.
 *  Mendukung tanda muat: Fe2+ / SO4^2- / Na+ dan titik hidrat CuSO4·5H2O */
export default function Formula({ text, className }: { text: string; className?: string }) {
  const parts = useMemo(() => parse(text), [text]);
  return <span className={className}>{parts}</span>;
}

function parse(text: string): React.ReactNode[] {
  // pecah angka: setelah huruf/`)` = subskrip; setelah ^ = superskrip (muatan)
  const nodes: React.ReactNode[] = [];
  let buf = "";
  let mode: "normal" | "sub" | "sup" = "normal";
  let key = 0;

  const flush = () => {
    if (!buf) return;
    if (mode === "sub") nodes.push(<sub key={key++} className="text-[0.72em]">{buf}</sub>);
    else if (mode === "sup") nodes.push(<sup key={key++} className="text-[0.7em]">{buf}</sup>);
    else nodes.push(buf);
    buf = "";
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "^") { flush(); mode = "sup"; continue; }
    if (/[0-9]/.test(ch)) {
      // digit adalah subskrip jika karakter sebelumnya huruf atau ')'
      const prev = text[i - 1];
      if (mode !== "sup" && prev && /[A-Za-z\)]/.test(prev)) {
        flush();
        mode = "sub";
        buf += ch;
        continue;
      }
      buf += ch;
      continue;
    }
    if (buf && mode !== "normal") {
      // digit berakhir / karakter non-digit saat sub/sup → tutup
      flush();
      mode = "normal";
    }
    buf += ch;
  }
  flush();
  return nodes;
}
