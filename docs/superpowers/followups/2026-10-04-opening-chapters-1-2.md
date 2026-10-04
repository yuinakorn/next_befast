# งานค้างหลังทำบทเปิด + บทที่ 1–2

ที่มา: review รายงานย่อยของแต่ละงาน และ review ทั้ง branch `feat/opening-chapters-1-2` (แผน: `docs/superpowers/plans/2026-10-04-opening-chapters-1-2.md`) รายการเหล่านี้ไม่บล็อกการ merge

## ควรทำก่อนเผยแพร่จริง

- **ผู้ใช้ screen reader อ่านขั้นที่ไม่ active ของฉากที่ pin ไม่ได้ ยังเหลือเฉพาะบทที่ 3–4:** `.anim .step { visibility: hidden }` ใน `src/styles/chapter-3.css` ซ่อนขั้นที่ไม่ active ออกจาก accessibility tree บทที่ 1, 2, 5, 6, 7, 8 แก้แล้วใน `StoryStage` (รายการ `.sr-only` ของทุกขั้น ข้อความที่เห็นด้วยตาเป็น `aria-hidden` ส่วนตัวควบคุมอย่าง `TypeToggle` ไม่ซ้ำและไม่ถูกซ่อน) ส่วนบทที่ 3 (`BrainClock`) และ 4 (`BefastStage`) ยังต้องทำแบบเดียวกัน
- **ข้อความ ★ ยังไม่ผ่านแพทย์:** ตรวจตาม `docs/medical-review.md`
- **footer ยังไม่มีแหล่งอ้างอิงของข้อเท็จจริง ★ ใหม่** (รอบเอวไม่เกินครึ่งหนึ่งของส่วนสูง, ออกกำลังกาย 150 นาทีต่อสัปดาห์, สายด่วนเลิกบุหรี่ 1600, บุหรี่ไฟฟ้า) ให้เพิ่มหลังแพทย์ตรวจตาม `docs/medical-review.md`
- **ลำดับบทที่ 5 ไม่ตรงสคริปต์** (การ์ดความเชื่อผิดอยู่หลังตารางผลลัพธ์) เจ้าของต้องยืนยันว่าจะคงลำดับนี้หรือสลับตามสคริปต์
- **ภาพหัวบทที่ 1–2 ยังไม่มี:** สร้างตาม `docs/illustration-prompts.md`
- **วัดบนอุปกรณ์จริง:** iPhone ที่มีรอยบาก (safe-area แนวตั้งและแนวนอน), iPhone SE แนวนอน 667×375, Lighthouse mobile (CLS ของตัวนับ, ความลื่นของ canvas สมองจุดแสง)

## ปรับปรุงโค้ด

- animation แบบวนของบทที่ 5–8 (`.c5-clock-sweep`, `.c8-bp-heart`) ควรเริ่มเมื่อฉากอยู่ในจอเท่านั้น (ตอนนี้วนตั้งแต่โหลดหน้า)
- ล้างโค้ดซ้ำของบทที่ 5–8: ชุดตัวเลข `Numerals`, ปุ่มหลัก (primary button) และค่า `MIN_LIT` มีหลายสำเนา ให้ย้ายเป็นคอมโพเนนต์หรือค่าร่วมตัวเดียว
- `src/hooks/usePinnedSteps.ts`: เริ่มที่ `cur = -1` แล้วเรียก `onStep(0)` ตอนโหลด ทำให้เส้นชีพจรและการสุ่มคนสีแดงของบทที่ 2 เกิดก่อนผู้อ่านเลื่อนมาถึง แก้โดยเริ่มที่ `cur = 0` และเล่น effect ของขั้น 0 ตอน ScrollTrigger `onEnter`
- `src/components/opening/LiveCounter.tsx`: loop rAF ทำงานตลอด ให้หยุดเมื่อตัวนับออกนอกจอ (IntersectionObserver) และใช้ `setInterval` เมื่อ reduced motion
- ย้าย `.steps` / `.step` ที่ใช้ร่วมกันออกจาก `chapter-3.css` ไปไว้ใน `story.css` หรือ `globals.css` (ตรวจว่าบทที่ 3 ยังเหมือนเดิมทุก pixel)
- สีแถบสแกนในบทที่ 1 ใช้ `--cath` ซึ่งขัดกับ Fixed Meaning Rule (ฟ้า = สายสวน) ให้เปลี่ยนเป็น `--ink-2` หรือเพิ่ม token ใหม่
- `themeColor` ของจอแรกควรเป็นสีกรมท่าแคมเปญ
- `ChapterVisual` ตอนยังไม่มีภาพ: ใส่ `aria-hidden` ที่ `<figure>`
- บทที่ 1: จุดเลือดที่ต่อแถวโผล่ก่อนลิ่มเลือดมาถึง, ปุ่มสลับ "ตัน / แตก" กดยกเลิกไม่ได้, ใช้เลขขั้นแบบ hard-code (3/4/5), ถนนหลักทับป้าย stats บนจอแคบ
- บทที่ 2: เส้นชีพจรทับศีรษะคนสีแดง (เลื่อนขึ้นไปราว y=70), `gsap.fromTo` ของเส้นชีพจรควรใส่ `overwrite: "auto"`, ไอคอน "ลอยเข้ามา" เป็นแค่การเปลี่ยน opacity
- บทเปิด: ความสูงของภาพสมองใช้ค่าคงที่ 550px (`calc(100svh - 550px)`) ซึ่งผูกกับความยาวข้อความปัจจุบัน และที่ 800×600 ปุ่มชวนเลื่อนยังตกจอ

## ทดสอบและเครื่องมือ

- เพิ่ม test ว่าข้อความใน `src/content/` ตรงกับ `docs/stroke-scrollytelling-script.md` และ test ว่า `docs/medical-review.md` เป็นฉบับล่าสุด
- test ที่ยังอ่อน: `litCount` ยังไม่ทดสอบการปัดเศษ, การตรวจว่าไฟอยู่ในเขตของ brain-city เป็น tautology, `pickOther` ทดสอบน้อยกรณี
- `scripts/shots.mjs`:
  - `compare` ไม่ fail เมื่อไม่มีไฟล์ให้เทียบหรือเมื่อมีส่วนต่าง
  - `capture` รายงาน "no overflow" แม้ไม่เจอ `.pin`
  - `PROGRESS[0] = 0.1` ตรงกับเส้นแบ่งขั้นของ BrainClock พอดี ให้เปลี่ยนเป็นราว 0.12 แล้วถ่าย baseline ใหม่
- เพิ่ม `engines` (Node ≥ 22.18) ใน `package.json` เพราะ `pnpm test` และ `content:review` ต้องใช้ type stripping

## เอกสาร

- `DESIGN.md` ส่วน Dark Mode ยังชี้ token โหมดมืดไปที่ `index.html` (ของจริงอยู่ที่ `src/app/globals.css`)
- `AGENTS.md`: ข้อความเรื่องการย้ายไป Next.js (บรรทัดราว 59 และ 167) ล้าสมัย, code block โครงสร้างไฟล์แสดงแค่บทที่ 3–4, คอมเมนต์คำสั่งไม่ตรงคอลัมน์
- ตารางและรายการ breakpoint ควรเรียงตามลำดับจริงใน CSS (short-phone อยู่หลัง tablet และก่อน desktop)
