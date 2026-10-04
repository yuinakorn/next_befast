<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

คู่มือสำหรับ AI coding agent (Claude Code, Codex, Cursor ฯลฯ) และนักพัฒนาที่ทำงานในโปรเจกต์นี้

## โปรเจกต์นี้คืออะไร

**"ทุกนาทีที่ช้า คือสมองที่สูญเสีย"** เป็นสื่อการสอนโรคหลอดเลือดสมอง (stroke) แบบ scrollytelling ภาษาไทย ครบทุกบทตามสคริปต์ใน `docs/stroke-scrollytelling-script.md` แล้ว: บทเปิด บทที่ 1–8 และบทปิด ผู้ใช้คือประชาชนทั่วไป ญาติผู้ป่วย ผู้สูงอายุ และนักเรียนนักศึกษา ส่วนใหญ่อ่านบนมือถือ

อ่านไฟล์เหล่านี้ก่อนเริ่มงาน:

| ไฟล์ | มีอะไร |
|---|---|
| [PRODUCT.md](PRODUCT.md) | ผู้ใช้ เป้าหมาย หลักการ แหล่งอ้างอิงทางการแพทย์ |
| [DESIGN.md](DESIGN.md) | design tokens (สี ตัวอักษร ระยะ มุมโค้ง) คอมโพเนนต์ และกฎการออกแบบ |
| `docs/` | ต้นฉบับเนื้อหา (.md / .html) ถ้าข้อความในหน้าไม่ตรงกับต้นฉบับ ให้ถามก่อนแก้ |

## สถานะปัจจุบันและแผน

- **ตอนนี้:** เว็บไซต์คือแอป Next.js ใน `src/` (GSAP ติดตั้งจาก npm) ส่วน `index.html` เป็นต้นฉบับไฟล์เดียวที่เก็บไว้อ้างอิง (CSS และ JS อยู่ในไฟล์ ใช้ GSAP 3.12.5 + ScrollTrigger จาก cdnjs และภาพประกอบ `.webp` ใน `assets/illustrations/`) ไม่ได้ใช้ในเว็บจริง
- **แผน:** ให้แพทย์ตรวจข้อความ ★ (`docs/medical-review.md`), ทำภาพหัวบทที่ 5–8 (`docs/illustration-prompts.md`) และงานใน `docs/superpowers/followups/`
- หน้าเว็บเป็น Next.js 16 (App Router, TypeScript, `src/`, ESLint, ไม่ใช้ Tailwind) มีบทเปิด บทที่ 1–8 บทปิด และ footer แบรนด์แคมเปญ Walk Run Bike 12
  - เนื้อหาบทเปิด บท 1–2 บท 5–8 และบทปิดอยู่ใน `src/content/` (ข้อความ ★ มีฟิลด์ `review`) บทที่ 3–4 ยังเขียนในคอมโพเนนต์
  - ตรรกะที่ทดสอบได้อยู่ใน `src/lib/` (มี `*.test.ts`) ฉากที่ pin ของบท 1–2 และ 5–8 ใช้ `StoryStage` + `usePinnedSteps` สถานะฉากควบคุมด้วย `data-step` บน `.pin`
  - `src/components/`: `opening/`, `chapter-1/` ถึง `chapter-8/`, `closing/`, `ui/` (`StoryStage`, `ChapterHead`, `ChapterVisual`, `ProgressBar`, `Shield`, `Phrases`), `CampaignFooter`
  - `src/hooks/`: `usePinnedSteps` (ฮุกคุมฉากที่ pin ของบท 1–2 และ 5–8)
  - `scripts/`: `shots.mjs` (ถ่ายภาพทุกฉากที่ pin + ตรวจเนื้อหาล้น), `review-report.ts` (สร้าง `docs/medical-review.md`)
  - CSS: `src/app/globals.css` (token และสไตล์ร่วม), `src/styles/opening.css`, `story.css`, `chapter-1.css` ถึง `chapter-8.css`, `closing.css`, `shield.css`
  - ภาพอยู่ใน `public/illustrations/` และ `public/brand/` ภาพหัวบทที่ 5–8 ยังไม่มี (ดู `docs/illustration-prompts.md`) ส่วน `index.html` และ `assets/` เก็บไว้เป็นต้นฉบับอ้างอิง
- package manager: **pnpm เท่านั้น** (ห้ามใช้ npm/yarn และห้าม commit `package-lock.json`) คำสั่ง:
  ```bash
  pnpm dev         # dev server (http://localhost:3000)
  pnpm build       # production build
  pnpm lint        # ESLint
  pnpm test        # unit tests (node --test)
  pnpm content:review  # สร้าง docs/medical-review.md ใหม่หลังแก้ src/content/
  pnpm shots capture --out .shots/x   # ถ่ายภาพทุกฉากที่ pin + ตรวจเนื้อหาล้น (ต้องเปิด pnpm start -p 3100 ก่อน)
  pnpm dlx serve . # ดู index.html ต้นแบบ
  ```

---

## กฎข้อ 1: Mobile & Tablet First (สำคัญที่สุด)

ผู้ใช้ส่วนใหญ่อ่านบนมือถือ รองลงมาคือแท็บเล็ต **ให้ออกแบบ เขียนโค้ด และทดสอบตามลำดับ มือถือ → แท็บเล็ต → desktop เสมอ** desktop เป็นแค่ส่วนเสริม ถ้าต้องเลือกระหว่างมือถือกับ desktop ให้เลือกมือถือ

### การเขียน CSS

- เขียนสไตล์พื้นฐานสำหรับจอ **360–430px** ก่อน แล้วค่อยเพิ่มสำหรับจอใหญ่ด้วย **`min-width`** เท่านั้น
- CSS ใน `index.html` ตอนนี้ยังเป็น desktop-first (`max-width: 860px` / `760px`) ถ้าแก้ส่วนไหนหรือย้ายไป Next.js ให้กลับเป็น mobile-first โดยผลลัพธ์บนจอต้องเหมือนเดิม
- breakpoint ที่ใช้ตอนนี้ (ดูรายละเอียดใน DESIGN.md › Layout):

  | ชื่อ | เงื่อนไข | อุปกรณ์ |
  |---|---|---|
  | phone | (ไม่มี query) | มือถือแนวตั้ง 360–699px |
  | short | `(max-width: 860px) and (max-height: 640px)` | มือถือจอเตี้ย: ซ่อนคำแนะนำ |
  | short-phone | `(max-width: 860px) and (max-height: 700px)` | มือถือแนวตั้งจอเตี้ย (360×640, 375×667): บีบบทเปิดให้อยู่ในจอแรก (ใน `opening.css` วางต่อจากบล็อก tablet และก่อน desktop) |
  | wide | `min-width: 761px` | ภาพประกอบเต็มกว้าง และคำบรรยายที่ทับบนภาพ 1669 |
  | tablet | `(min-width: 700px) and (min-height: 900px)` | แท็บเล็ตแนวตั้ง (iPad mini ขึ้นไป) |
  | desktop | `min-width: 861px` | แท็บเล็ตแนวนอน, laptop, desktop |
  | landscape | `(orientation: landscape) and (max-height: 500px)` | มือถือแนวนอน (ใส่ไว้ท้ายไฟล์ เพื่อให้ทับ desktop ได้) |

  ใส่ query ตามลำดับในตารางนี้ (phone → tablet → desktop → landscape) ถ้าบล็อก tablet แก้ property ไหน บล็อก desktop ต้องตั้งค่า property นั้นกลับด้วย ถ้าจะเพิ่ม breakpoint ใหม่ ให้ใช้ `min-width` หรือเงื่อนไขความสูงเท่านั้น และแก้ตารางนี้ใน commit เดียวกัน
- **แท็บเล็ตต้องมี layout ของตัวเอง** ห้ามแค่ยืด layout มือถือให้เต็มจอ iPad แนวตั้ง แต่ต้องใช้พื้นที่ให้คุ้ม เช่น ขยายนาฬิกาทรายหรือฉาก SVG วางการ์ดคู่กับภาพ แล้วตรวจทั้งแนวตั้งและแนวนอน
- ห้ามมี scroll แนวนอนที่ความกว้าง 320px ขึ้นไป

### ความสูงของจอ และฉากที่ pin

- ใช้ `svh` / `dvh` (มี `vh` ไว้เป็น fallback) **ห้ามใช้ `100vh` อย่างเดียว** เพราะแถบที่อยู่ของ browser บนมือถือจะบังเนื้อหา
- ฉากที่ pin (`.stage`) ต้องใส่เนื้อหาได้ครบในจอ **360×640** โดยไม่มีอะไรถูกตัด ขนาดภาพหลักให้คุมด้วยความสูง เช่น `clamp(150px, 27svh, 250px)`
- เผื่อ safe area เสมอ (`env(safe-area-inset-*)` และ `viewport-fit=cover` มีอยู่แล้ว ห้ามลบ)
- ScrollTrigger: คง `ScrollTrigger.config({ ignoreMobileResize: true })` ไว้ และ refresh หลังฟอนต์โหลดเสร็จ ถ้าความยาวการเลื่อน (`end`) หรือค่าอื่นต้องต่างกันระหว่างมือถือกับ desktop ให้ใช้ `gsap.matchMedia()` ห้ามเช็ค `window.innerWidth` เอง

### การสัมผัส

- พื้นที่แตะ **≥ 44×44px** (แนะนำ 48) และเว้นระยะห่างระหว่างปุ่ม ≥ 8px ถ้าปุ่มคำตอบในแบบฝึกแคบกว่า 44px บนจอ 360px ให้แบ่งเป็น 2 แถว
- **ห้ามใช้ hover เป็นทางเดียว** ให้ hover effect อยู่ใน `@media (hover: hover) and (pointer: fine)` และทุกอย่างต้องทำได้ด้วยการแตะ
- อะไรที่เกิดจากการเลื่อน ต้องมีทางทำด้วยการแตะด้วย (เช่น แตะตัวอักษร BEFAST)
- ช่องกรอกข้อมูล (ถ้ามีในอนาคต) ใช้ `font-size` ≥ 16px เพื่อไม่ให้ iOS ซูมเข้าเอง

### ประสิทธิภาพบนมือถือรุ่นกลาง

- คิดว่าผู้ใช้ใช้ Android รุ่นกลางและเน็ตมือถือ: LCP < 2.5s, CLS < 0.1, INP < 200ms
- ภาพทุกภาพต้องมี `width`/`height` (หรือ `aspect-ratio`) และใส่ `loading="lazy"` กับภาพที่ไม่อยู่ในจอแรก บน Next.js ใช้ `next/image` พร้อม `sizes` ที่ถูกต้อง เพื่อไม่ให้มือถือโหลดภาพ 1536px
- animation ของ CSS ใช้ `transform`/`opacity` ใส่ listener เลื่อนแบบ `{ passive: true }` และห้ามอ่านค่า layout ซ้ำๆ ใน scroll handler
- ฟอนต์โหลดเฉพาะน้ำหนักที่ใช้ (Anuphan 400–700, Chakra Petch 500–700) และรวม subset `thai`

### viewport ที่ต้องทดสอบทุกครั้งที่แก้ UI

ทดสอบตามลำดับนี้ ข้อที่ 1–5 ต้องผ่านก่อนจึงจะดู desktop

1. **360×640**: Android จอเล็ก (กรณีที่ยากที่สุด)
2. **390×844**: iPhone มาตรฐาน
3. **430×932**: มือถือจอใหญ่
4. **768×1024 และ 820×1180**: iPad แนวตั้ง
5. **1024×768 และ 1180×820**: iPad แนวนอน
6. **740×360**: มือถือแนวนอน (ฉากที่ pin ต้องยังใช้ได้)
7. **1280×800 ขึ้นไป**: desktop

ทดสอบทั้งโหมดสว่างและมืด และเปิด `prefers-reduced-motion: reduce` อย่างน้อยหนึ่งรอบ

---

## การออกแบบ

- **[DESIGN.md](DESIGN.md) เป็นตัวตัดสินเรื่องหน้าตา** ใช้ token จาก `:root` เสมอ (`var(--ink)`, `var(--red)` ฯลฯ) ห้าม hardcode สี
- token ใหม่ต้องมีค่าโหมดมืด และประกาศครบทั้ง 2 ที่ (`prefers-color-scheme` และ `[data-theme="dark"]`) ยกเว้น token พื้นที่แบรนด์ (`--brand-*`, `--on-brand-*`) ที่ใช้ค่าเดียวทั้งสองโหมด
- แบรนด์แคมเปญ Walk Run Bike 12: ใช้โลโก้ `public/brand/wrb12-on-navy.webp` บนพื้น `--brand-navy` เท่านั้น ห้ามใช้ `--brand-red` กับตัวหนังสือ
- สีแดงใช้กับเรื่องเร่งด่วนหรือสิ่งที่ต้องลงมือทำเท่านั้น สีชมพู เทา เขียว และฟ้ามีความหมายทางการแพทย์ตายตัว (ดู Named Rules ใน DESIGN.md)
- แบนเหมือนกระดาษ: ไม่มี drop shadow, glassmorphism หรือ gradient ตกแต่ง
- ถ้าเปลี่ยนดีไซน์จนกระทบระบบ (เช่น token ใหม่ คอมโพเนนต์ใหม่ หรือ breakpoint ใหม่) ให้แก้ DESIGN.md ใน commit เดียวกัน

## ตัวอักษรไทย

- `lang="th"` ต้องอยู่ที่ `<html>` เสมอ
- เนื้อหา line-height ≥ 1.55 (ค่าปกติ 1.65) หัวข้อ ≥ 1.22 เพราะสระบนและวรรณยุกต์ต้องการพื้นที่
- ห้ามใส่ letter-spacing บวกหรือใช้ `text-transform` กับข้อความไทย
- ข้อความไทยไม่มีช่องว่างระหว่างคำ ถ้าหัวข้อตัดบรรทัดผิดที่ ให้ใช้ `<br>` หรือ `<wbr>` ตรงจุดที่ควรตัด และตรวจบนจอ 360px ทุกครั้ง
- ถ้าจะแยกหรือสลับตัวอักษรไทย (เช่น เอฟเฟกต์อาการ S) ต้องแยกตาม grapheme ด้วย `Intl.Segmenter("th", { granularity: "grapheme" })` เพื่อไม่ให้สระและวรรณยุกต์หลุดจากพยัญชนะ
- ตัวเลขที่เป็นค่าวัดใช้ Chakra Petch + `tabular-nums` ประโยคไทยใช้ Anuphan

## เนื้อหาทางการแพทย์ (ห้ามพลาด)

- **ห้ามแก้ตัวเลขหรือคำแนะนำทางการแพทย์** (1.9 ล้านเซลล์ต่อนาที, 3.6 ปีต่อชั่วโมง, 4.5 ชม./270 นาที, 24 ชม., 1669) ถ้าไม่มีแหล่งอ้างอิงใหม่ที่ผู้ใช้ยืนยันแล้ว
- ข้อความใหม่ที่เป็นข้อเท็จจริงทางการแพทย์ต้องมีแหล่งอ้างอิง และต้องเพิ่มแหล่งนั้นใน footer
- ห้ามลบข้อความ "เนื้อหานี้เพื่อการเรียนรู้ ไม่ใช้แทนคำแนะนำของแพทย์" และเบอร์ 1669
- ใช้ภาษาง่าย ประโยคสั้น และอธิบายศัพท์แพทย์ทุกครั้ง
- ข้อความในบท 1–2 ที่มี ★ ในสคริปต์ต้องมี `review` ใน `src/content/` และต้องรัน `pnpm content:review` ทุกครั้งที่แก้ เพื่อให้ `docs/medical-review.md` ตรงกับหน้าเว็บ

## การเข้าถึง (Accessibility)

- ตั้งเป้า WCAG 2.2 AA ข้อความต้องมีคอนทราสต์ ≥ 4.5:1 ทั้งสองโหมด (ระวังสี `--go` กับตัวอักษรเล็กในโหมดสว่าง ดู DESIGN.md)
- ต้องเคารพ `prefers-reduced-motion` ทุกจุด เอฟเฟกต์ส่าย เบลอ และภาพซ้อนต้องปิดเมื่อตั้ง reduced motion และเนื้อหาต้องอ่านได้ครบแม้ GSAP โหลดไม่สำเร็จ
- ใช้คีย์บอร์ดได้ทุกอย่าง มี `:focus-visible` ที่มองเห็นชัด (ตอนนี้เป็นเส้น 3px สี `--red`)
- SVG ที่มีความหมายใส่ `role="img"` + `aria-label` ภาษาไทย ส่วน SVG ตกแต่งใส่ `aria-hidden="true"` ผลของแบบฝึกใช้ `aria-live="polite"`

---

## ย้ายไป Next.js

- **ก่อนใช้ API ของ Next.js ให้ดูเวอร์ชันใน `package.json`** และอ่านเอกสารของเวอร์ชันนั้น (เช่น `node_modules/next/dist/docs/` ถ้ามี) ห้ามเดาจากความจำ เพราะ API เปลี่ยนบ่อย
- ใช้ App Router ตั้ง `<html lang="th">` ใน `app/layout.tsx`
- ฟอนต์ใช้ `next/font/google` (Anuphan, Chakra Petch) พร้อม `subsets: ["thai", "latin"]` และส่งเข้าเป็น CSS variable ให้ token `--font` / `--num` ใช้ต่อ
- token ทั้งหมดย้ายไปไว้ใน `app/globals.css` เป็น CSS custom properties และ**ยังเป็นที่เก็บ token หลักที่เดียว** ถ้าใช้ Tailwind ให้ map token เข้า `@theme` แทนการสร้างชุดสีใหม่
- ให้เป็น Server Component เป็นหลัก ใส่ `"use client"` เฉพาะส่วนที่ต้องโต้ตอบ (ฉากบทที่ 3, ฉาก BEFAST, แบบฝึก, แถบความคืบหน้า)
- GSAP ติดตั้งจาก npm (`gsap`, `@gsap/react`) ใช้ `useGSAP()` เพื่อให้ cleanup ScrollTrigger อัตโนมัติ และใช้ `gsap.matchMedia()` สำหรับ breakpoint และ reduced motion
- ภาพย้ายไป `public/illustrations/` แล้วแสดงผ่าน `next/image`
- โครงสร้างที่แนะนำ (ปรับได้ตามที่ตกลงกัน):
  ```
  src/app/layout.tsx
  src/app/page.tsx
  src/app/globals.css
  src/components/chapter-3/   (Hourglass, Meters, TreatmentTimeline, ...)
  src/components/chapter-4/   (BefastLetters, SymptomScenes, SymptomCards, Quiz, ...)
  src/components/ui/          (ProgressBar, ChapterVisual, ...)
  public/illustrations/
  ```
- ย้ายทีละบท และเทียบผลกับ `index.html` ทุก viewport ในรายการทดสอบก่อนลบของเดิม

## Definition of Done (สำหรับงาน UI)

- [ ] ใช้ได้บน 360×640 โดยไม่มีอะไรล้น ตัด หรือซ้อนกัน
- [ ] แท็บเล็ตทั้งแนวตั้งและแนวนอนดูตั้งใจออกแบบ ไม่ใช่มือถือที่ถูกยืด
- [ ] พื้นที่แตะ ≥ 44px และไม่มีอะไรที่ทำได้ด้วย hover อย่างเดียว
- [ ] โหมดสว่างและมืดถูกต้อง คอนทราสต์ผ่าน AA
- [ ] reduced motion ใช้ได้ และเนื้อหาอ่านได้ครบเมื่อไม่มี JS animation
- [ ] ตัวเลขและข้อความทางการแพทย์ไม่ถูกเปลี่ยนโดยไม่มีแหล่งอ้างอิง
- [ ] ถ้าดีไซน์เปลี่ยนจนกระทบระบบ ได้แก้ DESIGN.md แล้ว
