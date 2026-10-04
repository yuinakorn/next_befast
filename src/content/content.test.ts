import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { CHAPTER_1 } from "./chapter-1.ts";
import { CHAPTER_2, CHAPTER_2_REVIEWS, RISK_NOTES, SELF_CHECK } from "./chapter-2.ts";
import { CHAPTER_5, MYTHS, OUTCOMES } from "./chapter-5.ts";
import { CHAPTER_6, DISEASES } from "./chapter-6.ts";
import { CHAPTER_7, SHIELD_CHECKLIST } from "./chapter-7.ts";
import { CHAPTER_8 } from "./chapter-8.ts";
import { CLOSING } from "./closing.ts";

for (const [chapter, count] of [
  [CHAPTER_1, 7],
  [CHAPTER_2, 7],
  [CHAPTER_5, 6],
  [CHAPTER_6, 7],
  [CHAPTER_7, 6],
  [CHAPTER_8, 4],
] as const) {
  test(`chapter ${chapter.number} has ${count} steps starting at 0 in increasing order`, () => {
    assert.equal(chapter.steps.length, count);
    assert.equal(chapter.steps[0].at, 0);
    for (let i = 1; i < chapter.steps.length; i++) {
      assert.ok(chapter.steps[i].at > chapter.steps[i - 1].at, `step ${i + 1} must start after step ${i}`);
    }
    assert.ok(chapter.steps.at(-1)!.at < 1);
  });
}

test("self check has one option per chapter 2 risk step (steps 3–7), in RISK_KINDS order", () => {
  assert.equal(SELF_CHECK.options.length, CHAPTER_2.steps.length - 2);
  assert.deepEqual(
    SELF_CHECK.options.map((o) => o.id),
    ["bp", "lifestyle", "smoke", "stress", "drugs"],
  );
});

test("every self check option says where the fix is, and the drug line carries the 1165 hotline", () => {
  for (const o of SELF_CHECK.options) assert.ok(o.next.length > 0, o.id);
  assert.ok(SELF_CHECK.options.find((o) => o.id === "drugs")!.next.includes("1165"));
});

test("chapter 2 notes: PM2.5 and filler, each with a review row", () => {
  assert.deepEqual(RISK_NOTES.items.map((n) => n.label), ["ฝุ่น PM2.5", "ฟิลเลอร์"]);
  assert.equal(CHAPTER_2_REVIEWS.length, RISK_NOTES.items.length);
});

for (const [chapter, filename] of [
  [CHAPTER_1, "chapter-1-what-is-stroke.webp"],
  [CHAPTER_2, "chapter-2-closer-than-you-think.webp"],
] as const) {
  test(`chapter ${chapter.number} links to an existing illustration`, () => {
    assert.equal(chapter.image, `/illustrations/${filename}`);
    const illustration = fileURLToPath(new URL(`../../public/illustrations/${filename}`, import.meta.url));
    assert.ok(existsSync(illustration), `${filename} must exist in public/illustrations`);
  });
}

test("chapter 5 has 4 myth cards and outcomes that add up to 100 patients", () => {
  assert.equal(MYTHS.length, 4);
  assert.equal(OUTCOMES.reduce((sum, o) => sum + o.count, 0), 100);
});

test("chapter 6 disease steps follow DISEASES order", () => {
  DISEASES.forEach((d, i) => assert.equal(CHAPTER_6.steps[i + 2].title, d));
});

test("shield checklist has 4 diseases + 6 behaviours = one item per chapter 7 step plus 4", () => {
  assert.equal(SHIELD_CHECKLIST.items.length, DISEASES.length + CHAPTER_7.steps.length);
});

test("closing quiz answers point at an existing choice", () => {
  for (const q of CLOSING.quiz) assert.ok(q.answer >= 0 && q.answer < q.choices.length, q.question);
  assert.equal(CLOSING.quiz.length, 5);
});
