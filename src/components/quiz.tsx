"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, BrainCircuit } from "lucide-react";
import type { QuizQuestion } from "@/lib/quizzes";

export default function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const answeredAll = Object.keys(picked).length === questions.length;
  const score = questions.reduce((acc, q, i) => acc + (picked[i] === q.answer ? 1 : 0), 0);

  if (!questions.length) return null;

  return (
    <section className="glass mt-4 p-5 sm:p-6" aria-label="Kuis">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <BrainCircuit size={17} strokeWidth={1.75} className="text-[var(--accent)]" />
          Cek pemahamanmu
        </h2>
        {answeredAll && (
          <button
            onClick={() => setPicked({})}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
            style={{ border: "1px solid var(--border)" }}
          >
            <RotateCcw size={11} strokeWidth={1.75} />
            Ulangi
          </button>
        )}
      </div>

      <ol className="mt-4 space-y-6">
        {questions.map((q, qi) => {
          const chosen = picked[qi];
          const answered = chosen !== undefined;
          return (
            <li key={qi}>
              <p className="text-sm font-medium">{qi + 1}. {q.q}</p>
              <div className="mt-2 grid gap-1.5">
                {q.options.map((opt, oi) => {
                  const isChosen = chosen === oi;
                  const isCorrect = oi === q.answer;
                  let cls = "text-sm rounded-xl px-3.5 py-2 text-left transition-all ";
                  if (!answered) cls += "glass-input cursor-pointer hover:border-[var(--accent)]/50";
                  else if (isCorrect) cls += "border border-[var(--accent)]/50 bg-[var(--accent)]/10 text-[var(--accent)] font-medium";
                  else if (isChosen) cls += "border border-red-500/40 bg-red-500/10 text-red-400";
                  else cls += "border border-transparent text-[var(--muted)] opacity-60";
                  return (
                    <button key={oi} disabled={answered} className={cls} onClick={() => setPicked((p) => ({ ...p, [qi]: oi }))}>
                      <span className="mr-2 font-mono text-xs opacity-70">{"ABCD"[oi]}.</span>{opt}
                    </button>
                  );
                })}
              </div>
              {answered && (
                <p className={`mt-2 flex gap-1.5 text-xs leading-relaxed ${chosen === q.answer ? "text-[var(--accent)]" : "text-[var(--muted)]"}`}>
                  {chosen === q.answer
                    ? <CheckCircle2 size={14} strokeWidth={1.75} className="mt-0.5 shrink-0" />
                    : <XCircle size={14} strokeWidth={1.75} className="mt-0.5 shrink-0" />}
                  {q.explain}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      {answeredAll && (
        <div className="mt-5 rounded-xl px-4 py-3 text-center" style={{ background: "var(--accent-soft)" }}>
          <p className="text-sm font-semibold text-[var(--accent)]">
            Skor kamu: {score}/{questions.length}
            {score === questions.length ? " — sempurna!" : score > 0 ? " — baca lagi bagian yang terlewat ya." : ""}
          </p>
        </div>
      )}
    </section>
  );
}
