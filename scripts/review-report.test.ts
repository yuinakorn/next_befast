import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { CHAPTERS, allReviewRows, renderReport, reviewRows } from "./review-report.ts";
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
  const rows = allReviewRows().filter((r) => /^บทที่ [12] /.test(r.where));
  for (const phrase of [
    "2%", "8 ใน 10", "2 ใน 10", "สแกนสมอง", "TIA",
    "ความดันโลหิตสูง", "ไม่ขยับ", "บุหรี่ไฟฟ้า", "ยาบ้า", "ความเครียด", "PM2.5", "ฟิลเลอร์", "1165",
  ]) {
    assert.ok(rows.some((r) => r.text.includes(phrase)), `missing review row for ${phrase}`);
  }
});

test("every ★ step from appendix ก for chapters 5–8 is in the report", () => {
  const rows = reviewRows(CHAPTERS);
  for (const phrase of ["1669", "เวลาสุดท้าย", "นอนตะแคง", "ยาต้านการแข็งตัว", "90%", "เบาหวาน", "สายยาง", "คราบ", "สั่นพลิ้ว", "รอบเอว", "1600", "แอลกอฮอล์", "ผักครึ่งจาน", "150 นาที", "ค่าเป้าหมาย"]) {
    assert.ok(rows.some((r) => r.text.includes(phrase)), `missing review row for ${phrase}`);
  }
});

test("docs/medical-review.md is up to date: run `pnpm content:review` after editing src/content", () => {
  const committed = fs.readFileSync(new URL("../docs/medical-review.md", import.meta.url), "utf8");
  assert.equal(renderReport(allReviewRows()), committed);
});
