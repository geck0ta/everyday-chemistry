import { describe, it, expect } from "vitest";
import { QUIZZES } from "@/lib/quizzes";

describe("kuis — kualitas soal", () => {
  const all = Object.entries(QUIZZES).flatMap(([id, qs]) => qs.map((q) => ({ id, ...q })));

  it("jawaban benar tidak selalu opsi terpanjang (anti-bias)", () => {
    // hitung berapa banyak soal di mana jawaban = opsi terpanjang
    const biased = all.filter((q) => {
      const lens = q.options.map((o) => o.length);
      return q.options[q.answer].length === Math.max(...lens);
    });
    // toleransi wajar: maksimal 30% dari total soal boleh kebetulan terpanjang
    expect(biased.length / all.length).toBeLessThan(0.3);
  });

  it("jawaban tidak menumpuk di satu posisi", () => {
    const counts = [0, 0, 0, 0];
    all.forEach((q) => counts[q.answer]++);
    const maxShare = Math.max(...counts) / all.length;
    expect(maxShare).toBeLessThan(0.5); // tidak boleh >50% di satu posisi
  });

  it("setiap soal punya tepat satu jawaban valid & 4 opsi", () => {
    all.forEach((q) => {
      expect(q.options.length).toBe(4);
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(4);
      expect(q.explain.length).toBeGreaterThan(10);
    });
  });
});
