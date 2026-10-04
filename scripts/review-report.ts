// Builds docs/medical-review.md from the content modules: run `pnpm content:review`.
import fs from "node:fs";
import { pathToFileURL } from "node:url";
import type { ChapterContent } from "../src/content/types.ts";
import { CHAPTER_1 } from "../src/content/chapter-1.ts";
import { CHAPTER_2, SELF_CHECK } from "../src/content/chapter-2.ts";

export type ReviewRow = { where: string; text: string; check: string };

export function reviewRows(chapters: readonly ChapterContent[]): ReviewRow[] {
  const rows: ReviewRow[] = [];
  for (const c of chapters) {
    if (c.leadReview) rows.push({ where: `บทที่ ${c.number} คำโปรย`, text: c.lead, check: c.leadReview });
    c.steps.forEach((s, i) => {
      if (!s.review) return;
      rows.push({
        where: `บทที่ ${c.number} ขั้น ${i + 1}`,
        text: [s.title, s.body].filter(Boolean).join(" "),
        check: s.review,
      });
    });
  }
  return rows;
}

const cell = (s: string) => s.replaceAll("|", "\\|").replaceAll("\n", " ");

export function renderReport(rows: readonly ReviewRow[]): string {
  return [
    "# รายการตรวจทานทางการแพทย์",
    "",
    "สร้างด้วย `pnpm content:review` ห้ามแก้ไฟล์นี้ด้วยมือ ให้แก้ข้อความใน `src/content/` แล้วรันใหม่",
    "",
    "ข้อความเหล่านี้มาจากความรู้ทั่วไป (★ ในสคริปต์) หรือเป็นข้อความร่างใหม่ ต้องให้แพทย์หรือพยาบาลตรวจก่อนเผยแพร่",
    "",
    "| ตำแหน่ง | ข้อความบนหน้าเว็บ | สิ่งที่ต้องตรวจ | ผลตรวจ |",
    "|---|---|---|---|",
    ...rows.map((r) => `| ${cell(r.where)} | ${cell(r.text)} | ${cell(r.check)} |  |`),
    "",
  ].join("\n");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const rows = reviewRows([CHAPTER_1, CHAPTER_2]);
  rows.push({
    where: "บทที่ 2 แบบสำรวจ",
    text: SELF_CHECK.options.map((o) => o.label).join(", "),
    check: SELF_CHECK.review,
  });
  fs.writeFileSync(new URL("../docs/medical-review.md", import.meta.url), renderReport(rows));
  console.log(`wrote docs/medical-review.md (${rows.length} rows)`);
}
