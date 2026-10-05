# Royal Duties Prelude Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** เพิ่มบทนำเฉลิมพระเกียรติที่เปิดด้วยพระบรมฉายาลักษณ์และเล่าพระราชกรณียกิจด้านสุขภาพของพระบาทสมเด็จพระเจ้าอยู่หัวกับสมเด็จพระนางเจ้าฯ พระบรมราชินี ก่อนเข้าสู่บทเรียนโรคหลอดเลือดสมองเดิม

**Architecture:** `RoyalPrelude` เป็น Server Component ที่เรนเดอร์ข้อความและ inline media ครบตั้งแต่ HTML แรก ส่วน `RoyalGallery` เป็น Client Component ขนาดเล็กที่ progressive-enhance เฉพาะ desktop ด้วย `IntersectionObserver`; ถ้า JavaScript ใช้ไม่ได้ layout แบบ document flow ยังคงอ่านได้ครบ ภาพทุกภาพตัดจากบอร์ดต้นฉบับและส่งผ่าน `next/image` ด้วย intrinsic dimensions และ `sizes` ตามคู่มือ Next.js 16 ใน `node_modules/next/dist/docs/`.

**Tech Stack:** Next.js 16.3.8 App Router, React 19, TypeScript, CSS ธรรมดาแบบ mobile-first, `next/image`, Node test runner, Puppeteer screenshot tooling, ffmpeg สำหรับสร้าง WebP

**Spec:** `docs/superpowers/specs/2026-10-05-royal-prelude-design.md`

## Global Constraints

- ทำงานใน worktree `/private/tmp/next_befast-royal-duties-prologue` บน branch `feat/royal-duties-prologue`; ห้ามแก้ checkout หลักระหว่าง implementation.
- ใช้ `pnpm` เท่านั้น และใช้ Next.js 16.3.8 API ตามคู่มือใน `node_modules/next/dist/docs/`.
- ข้อความที่มองเห็นต้องตรงกับ `docs/บอร์ดนิทรรศการเฉลิมพระเกียรติWRB12_4x2m.png` ทุกคำ; ปรับได้เฉพาะการแบ่งย่อหน้าและ line break.
- ห้ามเพิ่มข้อเท็จจริงทางประวัติศาสตร์หรือทางการแพทย์ที่ไม่มีในบอร์ด และห้ามเปลี่ยนข้อความบท stroke เดิม.
- ออกแบบและตรวจตามลำดับ phone → tablet portrait → tablet landscape → short landscape → desktop.
- ไม่มี horizontal overflow ตั้งแต่ 320px; 360 × 640 ต้องเห็น hero ครบและข้อความทุกช่วงต้องอ่านได้โดยไม่ pin.
- ใช้ token เท่านั้น; token ใหม่ต้องมีค่า light/dark ทั้งใน `prefers-color-scheme` และ `[data-theme="dark"]`.
- ไม่ใช้ gradient, glassmorphism หรือ CSS drop shadow; สีแดงยังสงวนไว้สำหรับความเร่งด่วนในเนื้อหา stroke.
- ทุกภาพมี intrinsic dimensions และ `sizes`; hero ใช้ `preload`, ภาพอื่นใช้ lazy loading ค่าเริ่มต้นของ Next.js.
- `prefers-reduced-motion` ต้องไม่มี crossfade และ no-JavaScript fallback ต้องแสดง inline media กับข้อความครบ.
- คง `ScrollTrigger.config({ ignoreMobileResize: true })`, safe-area handling และพฤติกรรม ProgressBar เดิม.
- หลังแก้ `src/content/` ต้องรัน `pnpm content:review` และ `docs/medical-review.md` ต้องไม่เปลี่ยน.
- ห้าม push หรือ merge จนกว่าผู้ใช้สั่งในงานปัจจุบัน.

## Review Focus

- **จอ 360 × 640 และ 740 × 360:** พระบรมฉายาลักษณ์ หัวเรื่อง และเครื่องหมายแคมเปญต้องไม่ล้นหรือถูกตัด; Task 2 สร้าง mobile/landscape CSS และ Task 4 จับภาพทั้งสอง viewport.
- **JavaScript/observer ไม่ทำงาน:** inline media และข้อความทั้งสามช่วงต้องยังอยู่ใน document flow; Task 2 มี server-markup test และ Task 3 ซ่อน inline media เฉพาะเมื่อมี `.is-enhanced`.
- **Reduced motion:** sticky gallery เปลี่ยนทันทีโดยไม่มี transition; Task 3 ตรวจ CSS contract และ Task 4 จับภาพด้วย `--reduce`.
- **ข้อความไทยและปี พ.ศ.:** พระนาม ชื่อกิจกรรม เครื่องหมายคำพูด และปี `๒๕๕๘`/`๒๕๖๑` ต้องไม่ตกหล่น; Task 1 มี content assertions และ Task 5 เทียบกับบอร์ดทีละย่อหน้า.
- **Regression ของหน้าเดิม:** ProgressBar ต้องเริ่มที่บท 1 และภาพฉาก pin เดิมต้องไม่เปลี่ยน; Task 4 เปรียบเทียบ screenshot ของ `pin1`–`pin8`/`pin3`/`pin4` จาก baseline และ Task 5 รัน full suite.

---

## File Map

| File | Responsibility |
|---|---|
| `docs/บอร์ดนิทรรศการเฉลิมพระเกียรติWRB12_4x2m.png` | Source of truth สำหรับภาพและข้อความ |
| `public/royal/rama-x-portrait.webp` | Hero portrait crop ขนาด 900 × 1252 |
| `public/royal/rama-x-cycling.webp` | Cycling crop ขนาด 1600 × 1158 |
| `public/royal/queen-running.webp` | Running crop ขนาด 1600 × 1182 |
| `src/content/royal-prelude.ts` | Typed copy, asset metadata, alt text และ duty order |
| `src/components/royal-prelude/RoyalPrelude.tsx` | Server-rendered hero, introduction และ duty markup |
| `src/components/royal-prelude/RoyalGallery.tsx` | Desktop-only progressive enhancement และ sticky visual state |
| `src/lib/royal-gallery.ts` | Pure active-index selection สำหรับ observer ratios |
| `src/styles/royal-prelude.css` | Phone-first layout, tablet composition, desktop sticky gallery, short landscape และ reduced motion |
| `scripts/royal-page-smoke.mjs` | Browser assertions สำหรับ semantic order, visible copy และ no-JavaScript fallback |
| `scripts/royal-shot-targets.mjs` | Stable selectors สำหรับ screenshot ของ Royal Prelude |
| `scripts/shots.mjs` | Capture Royal Prelude targets และตรวจ page-wide horizontal overflow |
| `PRODUCT.md`, `DESIGN.md` | Product narrative, evidence, tokens และ named rules |

### Task 1: Lock source content and optimized image assets

**Files:**
- Create: `src/content/royal-prelude.ts`
- Modify: `src/content/content.test.ts`
- Add: `docs/บอร์ดนิทรรศการเฉลิมพระเกียรติWRB12_4x2m.png`
- Create: `public/royal/rama-x-portrait.webp`
- Create: `public/royal/rama-x-cycling.webp`
- Create: `public/royal/queen-running.webp`

**Interfaces:**
- Consumes: บอร์ด PNG ขนาด 11,339 × 5,670 และ `node:test` pattern ที่มีอยู่ใน `src/content/content.test.ts`.
- Produces: `ROYAL_ASSETS`, `ROYAL_PRELUDE`, `RoyalAssetId`, `RoyalDuty`, โดย `ROYAL_PRELUDE.duties` เรียง `role-model`, `queen-health`, `cycling-legacy`.

- [ ] **Step 1: Capture the pre-change visual baseline**

Run in one shell:

```bash
pnpm build
pnpm start -p 3100
```

Run in a second shell:

```bash
pnpm shots capture --url http://localhost:3100/ --out .shots/royal-before
```

Expected: ทุก viewport รายงาน `no overflow`; เก็บภาพ pin เดิมไว้เทียบหลัง implementation.

หยุด baseline server หลัง capture เพื่อไม่ให้ process เก่ายังคงเสิร์ฟ build ก่อนแก้ใน Task 4.

- [ ] **Step 2: Write failing content and asset-contract tests**

เพิ่ม import ของ `ROYAL_ASSETS` และ `ROYAL_PRELUDE` แล้วเพิ่ม tests เหล่านี้ใน `src/content/content.test.ts`:

```ts
test("royal prelude keeps the approved story order and source copy markers", () => {
  assert.equal(ROYAL_PRELUDE.hero.title, "แสงแห่งพระบารมี");
  assert.equal(ROYAL_PRELUDE.intro.title, "สู่สุขภาพดีของปวงชน");
  assert.deepEqual(ROYAL_PRELUDE.duties.map((d) => d.id), ["role-model", "queen-health", "cycling-legacy"]);
  const copy = ROYAL_PRELUDE.duties.flatMap((d) => d.paragraphs).join(" ");
  for (const phrase of ["การทรงจักรยาน", "อะเมซิ่ง ไทยแลนด์ มาราธอน แบงค็อก 2024", "Bike for Mom", "Bike for Dad", "Bike อุ่นไอรัก", "พ.ศ. ๒๕๕๘", "พ.ศ. ๒๕๖๑"]) {
    assert.ok(copy.includes(phrase), `missing source phrase: ${phrase}`);
  }
});

test("every royal prelude image links to an existing optimized asset", () => {
  assert.deepEqual(Object.keys(ROYAL_ASSETS), ["portrait", "cycling", "running"]);
  for (const asset of Object.values(ROYAL_ASSETS)) {
    assert.ok(asset.alt.length > 0);
    assert.ok(asset.width > 0 && asset.height > 0);
    assert.ok(existsSync(fileURLToPath(new URL(`../../public${asset.src}`, import.meta.url))), asset.src);
  }
});
```

- [ ] **Step 3: Run the content test and confirm red state**

Run: `pnpm test`

Expected: FAIL เพราะ `./royal-prelude.ts` และไฟล์ใน `public/royal/` ยังไม่มี.

- [ ] **Step 4: Generate the three WebP crops from the board**

```bash
mkdir -p public/royal
ffmpeg -hide_banner -loglevel error -y -i 'docs/บอร์ดนิทรรศการเฉลิมพระเกียรติWRB12_4x2m.png' -vf 'crop=2300:3200:1650:700,scale=900:-2' -frames:v 1 /private/tmp/rama-x-portrait.png
ffmpeg -hide_banner -loglevel error -y -i 'docs/บอร์ดนิทรรศการเฉลิมพระเกียรติWRB12_4x2m.png' -vf 'crop=2350:1700:6200:1050,scale=1600:-2' -frames:v 1 /private/tmp/rama-x-cycling.png
ffmpeg -hide_banner -loglevel error -y -i 'docs/บอร์ดนิทรรศการเฉลิมพระเกียรติWRB12_4x2m.png' -vf 'crop=2300:1700:8500:1050,scale=1600:-2' -frames:v 1 /private/tmp/queen-running.png
cwebp -quiet -q 82 /private/tmp/rama-x-portrait.png -o public/royal/rama-x-portrait.webp
cwebp -quiet -q 82 /private/tmp/rama-x-cycling.png -o public/royal/rama-x-cycling.webp
cwebp -quiet -q 82 /private/tmp/queen-running.png -o public/royal/queen-running.webp
sips -g pixelWidth -g pixelHeight public/royal/*.webp
```

Expected dimensions: portrait `900 × 1252`, cycling `1600 × 1158`, running `1600 × 1182`. Inspect all three crops before continuing; frame edges and every principal person must be intact.

- [ ] **Step 5: Implement the typed source content**

Create these types and exports in `src/content/royal-prelude.ts`:

```ts
export type RoyalAssetId = "portrait" | "cycling" | "running";
export type RoyalDuty = {
  id: "role-model" | "queen-health" | "cycling-legacy";
  title: string;
  paragraphs: readonly string[];
  images: readonly Exclude<RoyalAssetId, "portrait">[];
};
export const ROYAL_ASSETS: Record<RoyalAssetId, { src: string; alt: string; width: number; height: number }>;
export const ROYAL_PRELUDE: {
  hero: { title: string; image: RoyalAssetId };
  intro: { title: string; lead: string };
  duties: readonly RoyalDuty[];
};
```

ใช้ค่าภาพและ alt text ตาม spec และคัดข้อความที่มองเห็นจากบอร์ดตามนี้โดยไม่เรียบเรียงใหม่:

- Intro lead: `เฉลิมพระเกียรติ พระบาทสมเด็จพระเจ้าอยู่หัว และ สมเด็จพระนางเจ้าพระบรมราชินี ผู้ทรงเป็นแบบอย่างแห่งพลานามัย`
- Duty 1 title: `พระมหากษัตริย์และพระราชินี ผู้ทรงเป็นต้นแบบแห่งการออกกำลังกาย`
- Duty 1 paragraph: `พระบาทสมเด็จพระปรเมนทรรามาธิบดีศรีสินทรมหาวชิราลงกรณ พระวชิรเกล้าเจ้าอยู่หัวทรงเปี่ยมด้วยพระปรีชาชาญและพระราชจริยวัตรอันงดงามด้านการกีฬาและการออกกำลังกายมาตั้งแต่ยังทรงพระเยาว์ทรงเป็นแบบอย่างในการทรงกีฬาหลากหลายประเภท ทั้งการบิน การทหาร การวิ่ง และโดยเฉพาะอย่างยิ่ง “การทรงจักรยาน” ทรงปฏิบัติพระองค์เป็นแบบอย่างในการดูแลพระวรกาย ให้มีพลานามัยที่สมบูรณ์แข็งแรงอย่างสม่ำเสมอ ก่อให้เกิดแรงบันดาลใจอันยิ่งใหญ่แก่พสกนิกรทุกหมู่เหล่า`
- Duty 2 title: `สมเด็จพระนางเจ้าฯ พระบรมราชินี ทรงเป็นแบบอย่างอันประเสริฐแห่งการมีสุขภาวะที่สมบูรณ์`
- Duty 2 paragraph: `ทรงปฏิบัติพระองค์เป็นแบบอย่างในการออกกำลังกายอย่างสม่ำเสมอ เพื่อจุดประกายและส่งต่อแรงบันดาลใจให้พสกนิกรหันมารักการดูแลสุขภาพ ทรงเปี่ยมด้วยพระปรีชาสามารถด้านกีฬาหลากหลายประเภท ทั้งการวิ่ง จักรยาน เรือใบ และไอซ์ฮอกกี้ การเสด็จฯ ไปทรงร่วมกิจกรรมวิ่ง ‘อะเมซิ่ง ไทยแลนด์ มาราธอน แบงค็อก 2024’ นับเป็นแสงแห่งแรงบันดาลใจที่กระตุ้นเตือนให้ปวงชนชาวไทยตระหนักถึงคุณค่าของการออกกำลังกาย เพื่อสุขภาพกายและใจที่เข้มแข็งอย่างยั่งยืน`
- Duty 3 title: `รวมใจคนไทยสู่การสร้างเสริมสุขภาพ : มรดกพระราชทาน “Bike for Mom” และ “Bike for Dad”`
- Duty 3 paragraph 1: `เหตุการณ์ประวัติศาสตร์ที่จารึกไว้ในหัวใจคนไทย คือ การที่พระบาทสมเด็จพระเจ้าอยู่หัว (เมื่อครั้งทรงดำรงพระราชอิสริยยศ สมเด็จพระบรมโอรสาธิราช ฯ สยามมกุฎราชกุมาร) ทรงนำพสกนิกร ปั่นจักรยานในกิจกรรม “Bike for Mom ปั่นเพื่อแม่” (พ.ศ. ๒๕๕๘), “Bike for Dad ปั่นเพื่อพ่อ” (พ.ศ. ๒๕๕๘) และ “Bike อุ่นไอรัก” (พ.ศ. ๒๕๖๑)`
- Duty 3 paragraph 2: `ปรากฏการณ์ดังกล่าวไม่เพียงแต่แสดงออกถึงความกตัญญูกตเวทิตาและความจงรักภักดี หากแต่ยังเป็น “จุดเปลี่ยนสำคัญ” ที่จุดประกายกระแสการออกกำลังกายด้วยการปั่นจักรยานและการดูแลสุขภาพเชิงรุกทั่วประเทศ ทำให้สวนสาธารณะและเส้นทางปั่นจักรยานทั่วผืนแผ่นดินไทยคึกคักและตื่นตัวมาจนถึงปัจจุบัน`

กำหนด images เป็น `['cycling']`, `['running']`, และ `['cycling', 'running']` ตามลำดับ.

- [ ] **Step 6: Run tests and content review**

Run:

```bash
pnpm test
pnpm content:review
git diff --exit-code -- docs/medical-review.md
```

Expected: tests PASS; medical review ไม่มี diff.

- [ ] **Step 7: Commit the source, content and assets**

```bash
git add 'docs/บอร์ดนิทรรศการเฉลิมพระเกียรติWRB12_4x2m.png' public/royal src/content/royal-prelude.ts src/content/content.test.ts
git commit -m "feat: add royal prelude content and imagery"
```

### Task 2: Build the server-rendered hero and responsive document flow

**Files:**
- Create: `src/components/royal-prelude/RoyalPrelude.tsx`
- Create: `scripts/royal-page-smoke.mjs`
- Create: `src/styles/royal-prelude.css`
- Modify: `src/app/page.tsx:1-29`
- Modify: `src/app/layout.tsx:1-18`
- Modify: `src/components/opening/Opening.tsx:38-70`
- Modify: `src/styles/opening.css`
- Modify: `src/app/globals.css:1-45`
- Modify: `PRODUCT.md`
- Modify: `DESIGN.md`

**Interfaces:**
- Consumes: `ROYAL_ASSETS` and `ROYAL_PRELUDE` from Task 1.
- Produces: `RoyalPrelude(): React.ReactElement`, semantic `#royal-prelude`, `#royal-hero`, `#royal-duties`, and `[data-royal-duty]` hooks consumed by Tasks 3–4.

- [ ] **Step 1: Write a failing browser smoke test**

Create `scripts/royal-page-smoke.mjs` with Puppeteer and assert behavior from a running production server:

```js
const result = await page.evaluate(() => ({
  h1s: [...document.querySelectorAll("h1")].map((el) => el.textContent?.trim()),
  firstSection: document.querySelector("main, body")?.querySelector("section, header")?.id,
  duties: document.querySelectorAll("[data-royal-duty]").length,
  royalTop: document.querySelector("#royal-prelude")?.getBoundingClientRect().top,
  openingTop: document.querySelector(".opening")?.getBoundingClientRect().top,
}));
assert.deepEqual(result.h1s, ["แสงแห่งพระบารมี"]);
assert.equal(result.firstSection, "royal-prelude");
assert.equal(result.duties, 3);
assert.ok(result.royalTop < result.openingTop);
```

เปิด page ที่สองด้วย `page.setJavaScriptEnabled(false)` ก่อน `goto` แล้ว assert ว่า `[data-royal-duty]` มี 3 รายการและ `.royal-duty-media img` มีอย่างน้อย 4 ภาพ.

- [ ] **Step 2: Run the markup test and confirm red state**

Serve the pre-change build from Task 1, then run: `node scripts/royal-page-smoke.mjs http://localhost:3100/`

Expected: FAIL ด้วย assertion ว่าไม่มี `#royal-prelude`/h1 ใหม่ ไม่ใช่ syntax, Chrome หรือ connection error.

- [ ] **Step 3: Implement `RoyalPrelude` as a Server Component**

- ไม่ใส่ `"use client"`.
- ใช้ `Image` จาก `next/image` และค่ามิติจาก `ROYAL_ASSETS`.
- Hero portrait ใช้ `preload` และ `sizes="(max-width: 699px) 82vw, (max-width: 860px) 48vw, 38vw"`.
- Duty images ใช้ `sizes="(max-width: 699px) calc(100vw - 40px), (max-width: 860px) 46vw, 44vw"` และปล่อย lazy loading ค่าเริ่มต้น.
- เรนเดอร์ inline media ภายใน `[data-royal-duty="0"]` ถึง `"2"`; duty ที่สามมีภาพสองภาพ.
- วางโลโก้เดิม `/brand/wrb12-on-navy.webp` บนพื้น `var(--brand-navy)` เท่านั้น.

- [ ] **Step 4: Integrate page order and heading semantics**

- แทรก `<RoyalPrelude />` หลัง `<ProgressBar />` และก่อน `<Opening />`.
- เปลี่ยน `Opening` จาก `<h1>` เป็น `<h2>` โดยไม่เปลี่ยน children.
- เปลี่ยน selector `.opening h1` ทุก breakpoint เป็น `.opening h2` โดยค่าทั้งหมดเหมือนเดิม.
- import `@/styles/royal-prelude.css` ใน `layout.tsx` ก่อน `opening.css`.

- [ ] **Step 5: Implement mobile-first and tablet layout**

Base CSS ต้องรองรับ 320–699px; ใช้ `100vh` fallback ตามด้วย `100svh`, safe-area, `clamp()` สำหรับ portrait, line-height ตาม spec และไม่มี sticky. เรียง media query ที่ใช้เป็น short → tablet → short-phone → desktop → landscape โดย short-phone อยู่หลัง tabletและก่อน desktopตามกฎโปรเจกต์. Tablet `(min-width: 700px) and (min-height: 900px)` ใช้สองคอลัมน์ และ desktop/landscape ต้อง reset property ที่ tablet เปลี่ยนไว้ครบ.

เพิ่ม tokens ตาม spec ทั้งสามตำแหน่งใน `globals.css`:

```css
--royal-paper: #EEF3FB; --royal-ink: #173465; --royal-gold: #8A641D; --royal-blue: #1674B8;
/* dark */
--royal-paper: #101B34; --royal-ink: #EEF3FB; --royal-gold: #E8C878; --royal-blue: #65B7E8;
```

- [ ] **Step 6: Update design/product documentation**

- `PRODUCT.md`: เพิ่ม Royal Prelude ใน Product Purpose/Positioning และเพิ่มบอร์ด PNG ใน Evidence on Hand.
- `DESIGN.md`: เพิ่ม token light/dark, contrast `10.99:1`, `4.81:1`, `10.55:1`, กฎว่าทองใช้เฉพาะหัวเรื่อง/เส้น และกำหนด embedded frame relief ว่าไม่ใช่ CSS shadow.

- [ ] **Step 7: Run component and compile checks**

Run:

```bash
pnpm test
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

Restart `pnpm start -p 3100` from the new build and run `node scripts/royal-page-smoke.mjs http://localhost:3100/`. Expected: smoke assertions ผ่านทั้ง JavaScript-on และ JavaScript-off; compile commands ผ่าน.

- [ ] **Step 8: Commit the static Royal Prelude**

```bash
git add src/components/royal-prelude/RoyalPrelude.tsx scripts/royal-page-smoke.mjs src/styles/royal-prelude.css src/app/page.tsx src/app/layout.tsx src/components/opening/Opening.tsx src/styles/opening.css src/app/globals.css PRODUCT.md DESIGN.md
git commit -m "feat: add responsive royal prelude"
```

### Task 3: Add desktop sticky-gallery progressive enhancement

**Files:**
- Create: `src/lib/royal-gallery.ts`
- Create: `src/lib/royal-gallery.test.ts`
- Create: `src/components/royal-prelude/RoyalGallery.tsx`
- Modify: `src/components/royal-prelude/RoyalPrelude.tsx`
- Modify: `src/styles/royal-prelude.css`

**Interfaces:**
- Consumes: `[data-royal-duty]` articles and `ROYAL_ASSETS` from Tasks 1–2.
- Produces: `activeRoyalDuty(ratios: readonly number[], previous: number): number` and `RoyalGallery({ children }: { children: React.ReactNode })`.

- [ ] **Step 1: Write failing tests for active-index selection**

```ts
test("activeRoyalDuty keeps the previous item when no duty is visible", () => {
  assert.equal(activeRoyalDuty([0, 0, 0], 2), 2);
});

test("activeRoyalDuty selects the duty with the greatest intersection ratio", () => {
  assert.equal(activeRoyalDuty([0.2, 0.8, 0.5], 0), 1);
});

test("activeRoyalDuty resolves a tie without jumping forward", () => {
  assert.equal(activeRoyalDuty([0.6, 0.6, 0], 0), 0);
});
```

- [ ] **Step 2: Run the helper test and confirm red state**

Run: `pnpm test`

Expected: FAIL เพราะ `royal-gallery.ts` ยังไม่มี.

- [ ] **Step 3: Implement the pure helper**

Implement the exact signature from Interfaces. Ignore ratios `<= 0`; return `previous` when none are positive; otherwise return the first index with the maximum positive ratio.

- [ ] **Step 4: Implement `RoyalGallery`**

- ใส่ `"use client"` เฉพาะไฟล์นี้.
- เก็บ ratio ของสาม `[data-royal-duty]` ใน ref และใช้ `activeRoyalDuty` ใน observer callback.
- เปิด observer เฉพาะเมื่อ `matchMedia("(min-width: 861px) and (min-height: 501px)")` matches; cleanup observer และ media listener ทุกครั้ง.
- ตั้ง `.is-enhanced` หลัง mount และลบโดยธรรมชาติเมื่อ component unmount.
- sticky visual มีสาม states: cycling, running, pair; inactive images ใช้ `aria-hidden="true"` และ `alt=""` เพราะ inline media มี alt ที่มีความหมายอยู่แล้ว.

- [ ] **Step 5: Add progressive-enhancement CSS**

- ซ่อน inline `.royal-duty-media` เฉพาะใน desktop block และเฉพาะ descendant ของ `.royal-gallery.is-enhanced`.
- แสดง sticky visual เฉพาะ `.is-enhanced`; หากไม่มี class จะยังเห็น inline media ทั้งหมด.
- ใช้ `opacity` อย่างเดียวในการ crossfade.
- ประกาศ transition ภายใต้ `@media (prefers-reduced-motion: no-preference)` เท่านั้น.
- short landscape block ต้องปิด sticky visualและแสดง inline mediaกลับ.

- [ ] **Step 6: Run tests and compile checks**

Run:

```bash
pnpm test
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

Expected: helper tests และ full suite ผ่าน; build ไม่มี client/server boundary error.

- [ ] **Step 7: Commit the gallery enhancement**

```bash
git add src/lib/royal-gallery.ts src/lib/royal-gallery.test.ts src/components/royal-prelude/RoyalGallery.tsx src/components/royal-prelude/RoyalPrelude.tsx src/styles/royal-prelude.css
git commit -m "feat: enhance royal duties with sticky gallery"
```

### Task 4: Extend screenshot coverage and complete visual verification

**Files:**
- Create: `scripts/royal-shot-targets.mjs`
- Modify: `scripts/shots.mjs`
- Modify if defects are found: `src/styles/royal-prelude.css`, `src/components/royal-prelude/*.tsx`

**Interfaces:**
- Consumes: stable IDs/data attributes from Task 2 and gallery states from Task 3.
- Produces: `ROYAL_SHOT_TARGETS` with `royal-hero`, `royal-duties-0`, `royal-duties-1`, `royal-duties-2`; `shots.mjs capture` writes one viewport screenshot per target and fails on page-wide horizontal overflow.

- [ ] **Step 1: Record the failing screenshot behavior**

Run the current capture tool before modifying it:

```bash
pnpm shots capture --url http://localhost:3100/ --out .shots/royal-target-red --vp 360x640
test -f .shots/royal-target-red/360x640-royal-hero.png
```

- [ ] **Step 2: Confirm the red state**

Expected: `pnpm shots capture` succeeds for existing pins, then `test -f` exits non-zero because the Royal target file is not emitted.

- [ ] **Step 3: Implement Royal Prelude capture targets**

Define selectors `#royal-hero` and `[data-royal-duty="0"]` through `"2"` in `scripts/royal-shot-targets.mjs`. Import the list in `shots.mjs`; for each target scroll it to the top safe area, wait for settled images/fonts, capture `${viewport}-${target.id}.png`, and append errors when the selector is missing.

- [ ] **Step 4: Add page-wide horizontal-overflow detection**

After page load and after each Royal target scroll, compare `document.documentElement.scrollWidth` with `window.innerWidth`; add a problem when the difference exceeds 1px. Keep existing pinned-stage overflow checks unchanged.

- [ ] **Step 5: Run unit and compile checks**

Run `pnpm shots capture --url http://localhost:3100/ --out .shots/royal-target-green --vp 360x640`, then assert all four files exist with `test -f`. Also run `pnpm test`, `pnpm lint`, and `pnpm exec tsc --noEmit`.

Expected: capture and all four file checks pass; compile checks pass.

- [ ] **Step 6: Capture required light-mode viewports**

With `pnpm start -p 3100` serving the current build:

```bash
pnpm shots capture --url http://localhost:3100/ --out .shots/royal-after
```

Expected: 360×640, 390×844, 430×932, 744×1133, 768×1024, 820×1180, 1024×1366, 1024×768, 1180×820, 740×360, 932×430 และ 1280×800 รายงาน no overflow/no console errors.

- [ ] **Step 7: Capture dark and reduced-motion variants**

```bash
pnpm shots capture --url http://localhost:3100/ --out .shots/royal-dark --vp 360x640,768x1024,1024x768,1280x800 --scheme dark
pnpm shots capture --url http://localhost:3100/ --out .shots/royal-reduce --vp 360x640,740x360,1280x800 --reduce
```

Expected: no overflow/no console errors; reduced-motion gallery has no opacity transition.

- [ ] **Step 8: Compare old pinned scenes and inspect new screenshots**

```bash
pnpm shots compare .shots/royal-before .shots/royal-after --only pin1,pin2,pin3,pin4,pin5,pin6,pin7,pin8
```

Inspect every Royal screenshot visually, mobile first. Confirm full portrait/frame, Thai wrapping, no image crop, intended tablet composition, sticky desktop states, light/dark contrast and transition into Opening. Fix only defects in the Royal Prelude or heading-selector migration, then repeat the affected captures.

- [ ] **Step 9: Commit screenshot coverage and visual fixes**

```bash
git add scripts/royal-shot-targets.mjs scripts/shots.mjs src/styles/royal-prelude.css src/components/royal-prelude
git commit -m "test: cover royal prelude visuals"
```

### Task 5: Final content and regression audit

**Files:**
- Verify: all files changed in Tasks 1–4
- Modify only if audit finds a defect: the owning file from Tasks 1–4

**Interfaces:**
- Consumes: completed Royal Prelude, screenshot evidence and pre-change pin baseline.
- Produces: verified branch ready for user review; no push or merge.

- [ ] **Step 1: Compare visible copy against the board line by line**

Open the full-resolution PNG and compare hero, intro, three headings and four body paragraphs. Verify Thai punctuation, `ฯ`, curly quotes, English commas, `2024`, `๒๕๕๘`, and `๒๕๖๑`. Correct transcription errors in `src/content/royal-prelude.ts` and update the source-copy test if the board proves the test wrong.

- [ ] **Step 2: Verify semantic and progressive fallbacks in the browser**

Confirm exactly one `h1`; Opening is `h2`; ProgressBar remains hidden until chapter 1. Disable JavaScript once at 360×640 and 1280×800 and confirm all three inline media groups and all copy remain visible.

- [ ] **Step 3: Run the complete verification suite**

```bash
pnpm content:review
git diff --exit-code -- docs/medical-review.md
pnpm test
pnpm lint
pnpm exec tsc --noEmit
pnpm build
git diff --check
```

Expected: every command passes, 0 failed tests, no generated medical-review diff, no whitespace errors.

- [ ] **Step 4: Review the final diff and worktree state**

```bash
git diff --stat main...HEAD
git diff --name-status main...HEAD
git status --short --branch
```

Expected: only Royal Prelude assets/content/components/styles/docs/tests and the approved heading-selector migration are tracked; worktree is clean after the board source has been committed.

- [ ] **Step 5: Commit audit fixes only if needed**

If Step 1–3 required changes:

```bash
git add src/content/royal-prelude.ts src/components/royal-prelude src/lib/royal-gallery.ts src/styles/royal-prelude.css scripts/royal-page-smoke.mjs scripts/shots.mjs scripts/royal-shot-targets.mjs src/app/page.tsx src/app/layout.tsx src/components/opening/Opening.tsx src/styles/opening.css src/app/globals.css PRODUCT.md DESIGN.md
git diff --cached --name-only
git commit -m "fix: complete royal prelude verification"
```

If no changes were needed, do not create an empty commit.
