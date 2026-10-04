import { test } from "node:test";
import assert from "node:assert/strict";
import { renderReport, reviewRows } from "./review-report.ts";
import { CHAPTER_1 } from "../src/content/chapter-1.ts";
import { CHAPTER_2 } from "../src/content/chapter-2.ts";
import type { ChapterContent } from "../src/content/types.ts";

const fixture: ChapterContent = {
  number: 9,
  title: "t",
  lead: "lead",
  leadReview: "draft lead",
  imageAlt: "alt",
  steps: [
    { at: 0, title: "A", body: "a body", review: "check A" },
    { at: 0.5, title: "B" },
  ],
};

test("reviewRows lists a drafted lead and only the steps that need review", () => {
  assert.deepEqual(reviewRows([fixture]), [
    { where: "บทที่ 9 คำโปรย", text: "lead", check: "draft lead" },
    { where: "บทที่ 9 ขั้น 1", text: "A a body", check: "check A" },
  ]);
});

test("renderReport escapes pipes so the markdown table stays intact", () => {
  const md = renderReport([{ where: "x", text: "a|b", check: "c" }]);
  assert.ok(md.includes("| x | a\\|b | c |  |"));
});

test("every ★ item from appendix ก for chapters 1–2 is in the report", () => {
  const rows = reviewRows([CHAPTER_1, CHAPTER_2]);
  for (const phrase of ["2%", "8 ใน 10", "2 ใน 10", "สแกนสมอง", "TIA", "PM2.5", "ฟิลเลอร์", "หวาน มัน เค็ม", "บุหรี่", "ความเครียด"]) {
    assert.ok(rows.some((r) => r.text.includes(phrase)), `missing review row for ${phrase}`);
  }
});
