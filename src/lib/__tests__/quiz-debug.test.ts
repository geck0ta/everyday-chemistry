import { describe, it, expect } from "vitest";
import { QUIZZES } from "@/lib/quizzes";

const all = Object.entries(QUIZZES).flatMap(([id, qs]) => qs.map((q) => ({ id, ...q })));
const biased = all.filter((q) => {
  const lens = q.options.map((o) => o.length);
  return q.options[q.answer].length === Math.max(...lens);
});
console.log("soal dgn jawaban terpanjang:", biased.map((b) => `${b.id}: "${b.options[b.answer].slice(0, 40)}" vs max ${Math.max(...b.options.map(o => o.length))} / jawaban ${b.options[b.answer].length}`).join("\n"));
it("debug", () => expect(true).toBe(true));
