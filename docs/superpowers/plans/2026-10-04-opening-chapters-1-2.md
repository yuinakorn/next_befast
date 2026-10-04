# Campaign Branding, Opening and Chapters 1–2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Co-brand the stroke scrollytelling page with Walk Run Bike 12, replace the old hero with the scripted opening (dot brain + live counter), and add chapters 1–2 before the existing chapters 3–4.

**Architecture:** Chapter copy lives in typed content modules (`src/content/`) that both the page and a doctor-review report script read. New pinned chapters share one `StoryStage` component driven by a `usePinnedSteps` hook (GSAP ScrollTrigger pin + scrub, one `.step` visible at a time, `data-step` on the pin for CSS scene states). Pure logic (step maths, counter, dot layout, brain-city geometry, random pick) sits in `src/lib/` with `node:test` unit tests; visuals are verified with a puppeteer screenshot/overflow script.

**Tech Stack:** Next.js 16.3 (App Router, TypeScript), React 19.2, GSAP 3.15 + ScrollTrigger + `@gsap/react`, plain CSS (no Tailwind), pnpm 11, Node 26 (native TypeScript type stripping, `node --test`), puppeteer-core + pixelmatch for visual checks.

**Spec:** `docs/superpowers/specs/2026-10-04-opening-chapters-1-2-design.md`

## Global Constraints

- Package manager is pnpm only; never create `package-lock.json`.
- Before using a Next.js API, check `node_modules/next/dist/docs/` (Next 16 differs from older versions; e.g. `next/image` uses `preload`/`loading`, not `priority`).
- CSS is mobile-first. Query order in every stylesheet: phone (no query) → tablet `(min-width: 700px) and (min-height: 900px)` → desktop `(min-width: 861px)` → landscape `(orientation: landscape) and (max-height: 500px)`. Anything the tablet block changes, the desktop block must set back.
- Every colour comes from a CSS custom property in `src/app/globals.css`. Content tokens need light and dark values; brand-plate tokens (`--brand-*`, `--on-brand-*`) are the same in both themes. Approved exceptions (owner decision, 2026-10-04): the literal colours written in this plan for `DotBrain.tsx` canvas (`LIT`, `LIT_HALO`, `OFF`), `.dot-brain-outline path` in `opening.css`, and `.tia-warn text { fill: #fff }` in `chapter-1.css`. No other literals.
- `brand-red` (#D72828) is used only inside the logo file, never for text.
- Fixed colour meanings: pink = living brain cells / lights on, ash = lost cells / lights off, red = urgency or action, go = time remaining / correct answer.
- Medical copy must match `docs/stroke-scrollytelling-script.md` word for word. Items marked ★ in the script carry a `review` note in the content module; ★ is never shown on the page.
- Touch targets ≥ 44×44px (aim for 48). No hover-only behaviour; hover styles go inside `@media (hover: hover) and (pointer: fine)`.
- Respect `prefers-reduced-motion`: no looping animation, scenes crossfade, content still readable.
- Pinned scenes must fit a 360×640 viewport with nothing clipped.
- Chapters 3–4 (`BrainClock`, `BefastStage`, `Quiz`) must not change visually.
- Commit after every task. End commit messages with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## File Map

| File | Responsibility |
|---|---|
| `scripts/shots.mjs` | Screenshot every pinned stage at 3 progress points per viewport, report overflow + console errors; compare two shot folders |
| `src/content/types.ts` | `Step`, `ChapterContent` types |
| `src/content/opening.ts`, `chapter-1.ts`, `chapter-2.ts` | All copy for the opening and chapters 1–2 (+ review notes) |
| `src/lib/steps.ts` | `activeStep`, `stepProgress` |
| `src/lib/live-counter.ts` | `cellsLost`, `formatCount` |
| `src/lib/dot-brain.ts` | Brain path, seeded PRNG, dot layout |
| `src/lib/brain-city.ts` | Chapter 1 map geometry: outline, districts, lights, roads |
| `src/lib/pick.ts` | `pickOther` random index |
| `scripts/review-report.ts` | Builds `docs/medical-review.md` from content modules |
| `src/hooks/usePinnedSteps.ts` | Pin + scrub + active step + `data-step` |
| `src/components/ui/StoryStage.tsx` | Shared pinned layout for chapters 1–2 |
| `src/components/ui/ChapterHead.tsx` | Chapter number/title/lead + leaf visual |
| `src/components/ui/ChapterVisual.tsx` | Leaf figure; placeholder when no image yet |
| `src/components/opening/*` | `Opening`, `DotBrain`, `LiveCounter` |
| `src/components/chapter-1/*` | `Chapter1`, `BrainCity`, `TypeToggle` |
| `src/components/chapter-2/*` | `Chapter2`, `RiskStage`, `RiskIcons`, `SelfCheck` |
| `src/components/CampaignFooter.tsx` | Sources + navy campaign band (replaces `SiteFooter`) |
| `src/styles/opening.css`, `story.css`, `chapter-1.css`, `chapter-2.css` | Styles per area |

---

### Task 1: Visual-check tooling, test runner and baseline

**Files:**
- Create: `scripts/shots.mjs`
- Modify: `package.json` (scripts, devDependencies), `tsconfig.json`, `.gitignore`

**Interfaces:**
- Produces: `pnpm test` (runs `src/**/*.test.ts` and `scripts/**/*.test.ts` with `node --test`), `pnpm shots capture --url <url> --out <dir> [--vp WxH,...] [--scheme light|dark] [--reduce]`, `pnpm shots compare <dirA> <dirB> [--only pin3,pin4]`. Shot file names: `<W>x<H>-top.png`, `<W>x<H>-<pinId>-<0.1|0.5|0.9>.png`. Baseline folder `.shots/baseline`.

- [ ] **Step 1: Install dev dependencies**

Run: `pnpm add -D puppeteer-core pngjs pixelmatch`
Expected: three packages added under `devDependencies`, no `package-lock.json` created.

- [ ] **Step 2: Add scripts and TypeScript import setting**

In `package.json` `"scripts"`, add after `"lint": "eslint"`:

```json
    "lint": "eslint",
    "test": "node --test \"src/**/*.test.ts\" \"scripts/**/*.test.ts\"",
    "content:review": "node scripts/review-report.ts",
    "shots": "node scripts/shots.mjs"
```

In `tsconfig.json` `compilerOptions`, add after `"noEmit": true,`:

```json
    "allowImportingTsExtensions": true,
```

(Node runs `.ts` files directly and needs explicit `.ts` extensions in relative imports used by tests and scripts; this flag lets `tsc` accept them.)

Append to `.gitignore`:

```
# visual check output
/.shots/
```

- [ ] **Step 3: Write `scripts/shots.mjs`**

```js
// Visual check for the scrollytelling page.
//   node scripts/shots.mjs capture --url http://localhost:3100/ --out .shots/after [--vp 360x640,1280x800] [--scheme dark] [--reduce]
//   node scripts/shots.mjs compare .shots/before .shots/after [--only pin3,pin4]
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";
import pngjs from "pngjs";
import pixelmatch from "pixelmatch";

const { PNG } = pngjs;
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const DEFAULT_VPS =
  "360x640,390x844,430x932,744x1133,768x1024,820x1180,1024x1366,1024x768,1180x820,740x360,932x430,1280x800";
const PROGRESS = [0.1, 0.5, 0.9];

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) {
      out._.push(a);
      continue;
    }
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) out[a.slice(2)] = true;
    else {
      out[a.slice(2)] = next;
      i++;
    }
  }
  return out;
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function capture(opts) {
  const url = opts.url ?? "http://localhost:3100/";
  const outDir = opts.out ?? ".shots/latest";
  const scheme = opts.scheme ?? "light";
  const vps = String(opts.vp ?? DEFAULT_VPS)
    .split(",")
    .map((s) => s.split("x").map(Number));
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
  let problems = 0;

  for (const [w, h] of vps) {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await page.setViewport({ width: w, height: h, isMobile: w < 1280, hasTouch: w < 1280 });
    await page.emulateMediaFeatures([
      { name: "prefers-color-scheme", value: scheme },
      { name: "prefers-reduced-motion", value: opts.reduce ? "reduce" : "no-preference" },
    ]);
    await page.goto(url, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    await wait(1200);

    const tag = `${w}x${h}`;
    await page.screenshot({ path: path.join(outDir, `${tag}-top.png`) });
    const pins = await page.evaluate(() => [...document.querySelectorAll(".pin[id]")].map((el) => el.id));
    const lines = [];

    for (const id of pins) {
      for (const p of PROGRESS) {
        await page.evaluate(
          (id, p) => {
            const el = document.getElementById(id);
            const spacer = el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el;
            const top = spacer.getBoundingClientRect().top + window.scrollY;
            window.scrollTo(0, Math.round(top + (spacer.offsetHeight - window.innerHeight) * p));
          },
          id,
          p,
        );
        await wait(1300);
        await page.screenshot({ path: path.join(outDir, `${tag}-${id}-${p}.png`) });
        const overflow = await page.evaluate((id) => {
          const stage = document.querySelector(`#${id} .stage`);
          if (!stage) return [];
          const box = stage.getBoundingClientRect();
          const items = [];
          const visit = (el) => {
            const cs = getComputedStyle(el);
            if (cs.display === "contents") {
              [...el.children].forEach(visit);
              return;
            }
            if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return;
            items.push(el);
          };
          [...stage.children].forEach(visit);
          stage.querySelectorAll(".step.on, .card.on").forEach((el) => items.push(el));
          return items
            .map((el) => ({ el, r: el.getBoundingClientRect() }))
            .filter(({ r }) => r.height > 0 && (r.top < box.top - 1 || r.bottom > box.bottom + 1))
            .map(({ el, r }) => {
              const name = typeof el.className === "string" ? el.className : el.className.baseVal;
              return `${name} [${Math.round(r.top - box.top)}..${Math.round(r.bottom - box.top)} / ${Math.round(box.height)}]`;
            });
        }, id);
        if (overflow.length) lines.push(`${id}@${p} OVERFLOW ${overflow.join("; ")}`);
      }
    }

    problems += lines.length + errors.length;
    const errText = errors.length ? ` | ERRORS ${errors.slice(0, 3).join(" | ")}` : "";
    console.log(`${tag}: ${lines.length ? lines.join(" | ") : "no overflow"}${errText}`);
    await page.close();
  }

  await browser.close();
  process.exitCode = problems ? 1 : 0;
}

function compare(dirA, dirB, opts) {
  const only = opts.only ? String(opts.only).split(",") : null;
  const files = fs
    .readdirSync(dirA)
    .filter((f) => f.endsWith(".png") && fs.existsSync(path.join(dirB, f)))
    .filter((f) => !only || only.some((o) => f.includes(`-${o}-`)));
  let worst = 0;
  for (const f of files) {
    const a = PNG.sync.read(fs.readFileSync(path.join(dirA, f)));
    const b = PNG.sync.read(fs.readFileSync(path.join(dirB, f)));
    if (a.width !== b.width || a.height !== b.height) {
      console.log(`${f}: size differs`);
      worst = 100;
      continue;
    }
    const n = pixelmatch(a.data, b.data, null, a.width, a.height, { threshold: 0.15 });
    const pct = (100 * n) / (a.width * a.height);
    worst = Math.max(worst, pct);
    console.log(`${f}: ${pct.toFixed(2)}%`);
  }
  console.log(`compared ${files.length} files, worst ${worst.toFixed(2)}%`);
}

const [cmd, ...rest] = process.argv.slice(2);
const opts = parseArgs(rest);
if (cmd === "capture") await capture(opts);
else if (cmd === "compare") compare(opts._[0], opts._[1], opts);
else {
  console.error("usage: shots.mjs capture|compare ...");
  process.exitCode = 2;
}
```

- [ ] **Step 4: Build, start the server and capture the chapter 3–4 baseline**

Run:
```bash
pkill -f "next start"; pkill -f next-server
pnpm build
mkdir -p .shots && (pnpm start -p 3100 > .shots/server.log 2>&1 &)
sleep 3
pnpm shots capture --out .shots/baseline --vp 360x640,390x844,1280x800 --reduce
```
Expected: three lines `360x640: no overflow`, `390x844: no overflow`, `1280x800: no overflow`; `.shots/baseline` contains `*-pin3-0.1.png` … `*-pin4-0.9.png`. (Reduced motion makes chapter 4 static so later comparisons are deterministic.)

- [ ] **Step 5: Check Node can run TypeScript directly**

Run: `node --version && node --input-type=module-typescript -e 'const x: number = 1; console.log("type stripping ok", x)'`
Expected: version ≥ v23.6 and `type stripping ok 1`. (`pnpm test` and `pnpm content:review` rely on this; the first test files arrive in Task 3.)

- [ ] **Step 6: Lint and commit**

Run: `pnpm lint`
Expected: no errors.

```bash
git add package.json pnpm-lock.yaml tsconfig.json .gitignore scripts/shots.mjs
git commit -m "chore: add visual check script and node test runner

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Brand tokens, logo asset and brand docs

**Files:**
- Create: `public/brand/wrb12-on-navy.webp`
- Modify: `src/app/globals.css`, `DESIGN.md`, `PRODUCT.md`, `AGENTS.md`

**Interfaces:**
- Produces: CSS vars `--brand-navy`, `--brand-red`, `--on-brand`, `--on-brand-muted`, `--on-brand-alert`; utility class `.sr-only`; logo at `/brand/wrb12-on-navy.webp` with intrinsic size recorded below as `LOGO_W × LOGO_H` (used by Tasks 4 and 8).

- [ ] **Step 1: Crop the logo from the navy-background master and export WebP**

```bash
mkdir -p public/brand .shots
sips -c 1042 1528 --cropOffset 560 314 docs/logo/WSRB12-BGBlue-Size1440x290.png --out .shots/logo-crop.png
cwebp -q 90 -resize 640 0 .shots/logo-crop.png -o public/brand/wrb12-on-navy.webp
sips -g pixelWidth -g pixelHeight public/brand/wrb12-on-navy.webp
```
Expected: width 640, height ≈ 436. Open `public/brand/wrb12-on-navy.webp` (Read tool / image viewer): the whole "WALK RUN BIKE 12 / FIGHTING STROKE" lock-up is visible with an even navy margin on all sides and nothing cut off. If any edge is clipped, widen the crop by 40px on that side and re-run. Write down the final pixel size as `LOGO_W × LOGO_H`.

- [ ] **Step 2: Add brand tokens and `.sr-only` to `src/app/globals.css`**

In the first `:root` block, after the line `--visual-bg: #DDEAF8;` add:

```css
  /* brand plate (Walk Run Bike 12): identical in light and dark themes, so no dark override */
  --brand-navy: #202D5D; --brand-red: #D72828;
  --on-brand: #FFFFFF; --on-brand-muted: #A8B3D4; --on-brand-alert: #FF5560;
```

After the rule `:focus-visible { … }` in the base section add:

```css
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
}
```

- [ ] **Step 3: Update `DESIGN.md`**

In the frontmatter `colors:` map, after `  cath-dark: "#5B91F2"` add:

```yaml
  brand-navy: "#202D5D"
  brand-red: "#D72828"
  on-brand: "#FFFFFF"
  on-brand-muted: "#A8B3D4"
  on-brand-alert: "#FF5560"
```

In `## Colors`, directly before the line `### Named Rules` add:

```markdown
### Brand (แคมเปญ Walk Run Bike ครั้งที่ 12 Fighting Stroke)
พื้นที่แบรนด์ใช้สีเดียวกันทั้งโหมดสว่างและมืด
- **Campaign Navy / กรมท่าแคมเปญ** (`brand-navy`): พื้นบทเปิด และแถบแคมเปญใน footer
- **Campaign Red / แดงแคมเปญ** (`brand-red`): อยู่ในไฟล์โลโก้เท่านั้น
- **บนพื้นกรมท่า:** ตัวหนังสือ `on-brand` (13.2:1), ป้ายกำกับ `on-brand-muted` (6.3:1), ตัวเลขตัวนับขนาด ≥ 24px `on-brand-alert` (4.2:1), จุดแสงสมอง `pink` (4.9:1)
```

After the paragraph that starts `**The Small Green Text Rule.**` add a new paragraph:

```markdown
**The Logo-Only Red Rule.** `brand-red` อยู่ในไฟล์โลโก้เท่านั้น ห้ามใช้กับตัวหนังสือหรือกราฟิก เพราะบน `brand-navy` ได้คอนทราสต์แค่ 2.65:1 ถ้าต้องการสีแดงบนพื้นกรมท่าให้ใช้ `on-brand-alert`
```

- [ ] **Step 4: Update `PRODUCT.md`**

Replace the line `ไม่มีโลโก้หรือแบรนด์องค์กรที่ต้องใช้ ให้ถือดีไซน์ใน \`index.html\` ปัจจุบันเป็นต้นแบบ (ดู DESIGN.md)` with:

```markdown
- หน้าเว็บนี้เป็นส่วนหนึ่งของแคมเปญ **Walk Run Bike ครั้งที่ 12 (Fighting Stroke)** "แสงนำใจไทยทั้งชาติ เดิน วิ่ง ปั่น ป้องกันอัมพาต ครั้งที่ 12 เฉลิมพระเกียรติ" ใช้แบรนด์แบบ co-brand เต็มตัว (บทเปิดบนพื้นกรมท่าแคมเปญ + แถบแคมเปญใน footer)
- เจ้าของโปรเจกต์อนุญาตให้ใช้โลโก้จาก `docs/logo/` (คำสั่งนี้แทนข้อความในสคริปต์ที่ว่า "ไม่ใช้รูปหรือโลโก้จากโปสเตอร์")
- นอกพื้นที่แบรนด์ ให้ถือดีไซน์ปัจจุบันเป็นต้นแบบ (ดู DESIGN.md)
```

In `## Evidence on Hand`, after the bullet that starts `- ภาพประกอบ:` add:

```markdown
- สคริปต์และสตอรีบอร์ดทุกบท: `docs/stroke-scrollytelling-script.md` (★ = เนื้อหาเสริมที่ต้องให้แพทย์ตรวจ, ภาคผนวก ก)
- โปสเตอร์ต้นฉบับ "A Life Without Stroke": `docs/69.08.17_ทุกนาทีที่ช้าคือสมองที่สูญเสีย.jpg` และ `docs/69.08.17_สโตรกป้องกันได้ถึง90%.png`
- โลโก้แคมเปญ: `docs/logo/` (ใช้งานจริงที่ `public/brand/wrb12-on-navy.webp`)
- แหล่งอ้างอิงในภาคผนวก ข ของสคริปต์ (INTERSTROKE 2016, GBD 2018) เขียนจากความจำ ห้ามใส่ใน footer จนกว่าจะตรวจสอบ
```

- [ ] **Step 5: Update `AGENTS.md`**

Replace the line `- token ใหม่ต้องมีค่าโหมดมืด และประกาศครบทั้ง 2 ที่ (\`prefers-color-scheme\` และ \`[data-theme="dark"]\`)` with:

```markdown
- token ใหม่ต้องมีค่าโหมดมืด และประกาศครบทั้ง 2 ที่ (`prefers-color-scheme` และ `[data-theme="dark"]`) ยกเว้น token พื้นที่แบรนด์ (`--brand-*`, `--on-brand-*`) ที่ใช้ค่าเดียวทั้งสองโหมด
- แบรนด์แคมเปญ Walk Run Bike 12: ใช้โลโก้ `public/brand/wrb12-on-navy.webp` บนพื้น `--brand-navy` เท่านั้น ห้ามใช้ `--brand-red` กับตัวหนังสือ
```

- [ ] **Step 6: Verify and commit**

Run: `pnpm lint && pnpm exec tsc --noEmit && pnpm build`
Expected: all pass (no visual change yet).

```bash
git add public/brand/wrb12-on-navy.webp src/app/globals.css DESIGN.md PRODUCT.md AGENTS.md
git commit -m "feat: add Walk Run Bike 12 brand tokens and logo asset

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Content modules, step maths and medical review report

**Files:**
- Create: `src/content/types.ts`, `src/content/opening.ts`, `src/content/chapter-1.ts`, `src/content/chapter-2.ts`, `src/content/content.test.ts`
- Create: `src/lib/steps.ts`, `src/lib/steps.test.ts`
- Create: `scripts/review-report.ts`, `scripts/review-report.test.ts`, `docs/medical-review.md` (generated)

**Interfaces:**
- Produces:
  - `type Step = { at: number; title: string; body?: string; review?: string }`
  - `type ChapterContent = { number: number; title: string; lead: string; leadReview?: string; image?: string; imageAlt: string; steps: Step[] }`
  - `OPENING` (fields `title: readonly [string, string]`, `lead`, `counterBefore`, `counterAfter`, `counterStatic`, `cue`, `campaign`, `logoAlt`, `brainLabel`)
  - `CHAPTER_1: ChapterContent`, `CHAPTER_2: ChapterContent`, `SELF_CHECK` (`title`, `hint`, `options: readonly { id: string; label: string }[]`, `answer`, `review`)
  - `activeStep(progress: number, starts: readonly number[]): number`
  - `stepProgress(progress: number, starts: readonly number[], index: number): number`
  - `reviewRows(chapters: readonly ChapterContent[]): ReviewRow[]`, `renderReport(rows: readonly ReviewRow[]): string`, `type ReviewRow = { where: string; text: string; check: string }`

- [ ] **Step 1: Write the failing step-maths test `src/lib/steps.test.ts`**

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { activeStep, stepProgress } from "./steps.ts";

const STARTS = [0, 0.14, 0.28, 0.42, 0.56, 0.7, 0.85];

test("activeStep stays on the first step until the second one starts", () => {
  assert.equal(activeStep(0, STARTS), 0);
  assert.equal(activeStep(0.139, STARTS), 0);
});

test("activeStep switches exactly at a step start", () => {
  assert.equal(activeStep(0.14, STARTS), 1);
  assert.equal(activeStep(0.7, STARTS), 5);
});

test("activeStep stays on the last step through the end", () => {
  assert.equal(activeStep(1, STARTS), 6);
});

test("stepProgress runs from 0 at the step start to 1 at the next start", () => {
  assert.equal(stepProgress(0.42, STARTS, 3), 0);
  assert.equal(stepProgress(0.56, STARTS, 3), 1);
  assert.ok(Math.abs(stepProgress(0.49, STARTS, 3) - 0.5) < 1e-9);
});

test("stepProgress for the last step runs to the end of the pin", () => {
  assert.equal(stepProgress(1, STARTS, 6), 1);
});

test("stepProgress is clamped outside its step", () => {
  assert.equal(stepProgress(0.1, STARTS, 3), 0);
  assert.equal(stepProgress(0.9, STARTS, 3), 1);
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `pnpm test`
Expected: FAIL — `Cannot find module '.../src/lib/steps.ts'`.

- [ ] **Step 3: Implement `src/lib/steps.ts`**

```ts
/** Index of the last step whose start (0–1 scroll progress) has been reached. */
export function activeStep(progress: number, starts: readonly number[]): number {
  let idx = 0;
  for (let i = 0; i < starts.length; i++) if (progress >= starts[i]) idx = i;
  return idx;
}

/** Progress (0–1) through step `index`. The last step runs until progress 1. */
export function stepProgress(progress: number, starts: readonly number[], index: number): number {
  const start = starts[index];
  const end = index + 1 < starts.length ? starts[index + 1] : 1;
  return Math.min(1, Math.max(0, (progress - start) / (end - start)));
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test`
Expected: PASS, 6 tests.

- [ ] **Step 5: Write the content types `src/content/types.ts`**

```ts
/** One scroll step inside a pinned chapter scene. */
export type Step = {
  /** Scroll progress (0–1) at which this step becomes active. */
  at: number;
  title: string;
  body?: string;
  /** What a doctor must verify before publishing (★ in the script). Never shown on the page. */
  review?: string;
};

export type ChapterContent = {
  number: number;
  title: string;
  lead: string;
  /** Set when the lead is newly drafted rather than taken from the script. */
  leadReview?: string;
  /** Chapter-head illustration under /public; omit until the image exists. */
  image?: string;
  imageAlt: string;
  steps: Step[];
};
```

- [ ] **Step 6: Write `src/content/opening.ts`**

```ts
/** Copy for the opening (script › บทเปิด). */
export const OPENING = {
  title: ["ทุกนาทีที่ช้า", "คือสมองที่สูญเสีย"],
  lead: "ถ้าคนที่คุณรักเริ่มพูดไม่ชัดขึ้นมาตอนนี้ คุณรู้ไหมว่าต้องทำอะไร และมีเวลาเหลือเท่าไหร่",
  counterBefore: "ตั้งแต่คุณเปิดหน้านี้ ผู้ป่วยสโตรกที่ยังไม่ได้รับการรักษาหนึ่งคน สูญเสียเซลล์สมองไปแล้ว",
  counterAfter: "เซลล์",
  /** Shown without JavaScript and read by screen readers instead of the ticking number. */
  counterStatic: "ผู้ป่วยสโตรกที่ยังไม่ได้รับการรักษาหนึ่งคน สูญเสียเซลล์สมองราว 31,667 เซลล์ทุกวินาที",
  cue: "เลื่อนลงเพื่อเริ่ม",
  campaign: "เดิน วิ่ง ปั่น ป้องกันอัมพาต ครั้งที่ 12",
  logoAlt: "Walk Run Bike ครั้งที่ 12 Fighting Stroke",
  brainLabel: "สมองที่ประกอบจากจุดแสง จุดแสงจะค่อยๆ ดับเมื่อเลื่อนลง",
} as const;
```

- [ ] **Step 7: Write `src/content/chapter-1.ts`**

```ts
import type { ChapterContent } from "./types";

/** Chapter 1 copy (script › บทที่ 1: สโตรกคืออะไร). */
export const CHAPTER_1: ChapterContent = {
  number: 1,
  title: "สโตรกคืออะไร",
  lead: "สมองทำงานได้ทุกวินาทีเพราะมีเลือดไหลไปเลี้ยงไม่หยุด บทนี้จะพาไปดูว่าเกิดอะไรขึ้นเมื่อเลือดไปไม่ถึง",
  leadReview: "คำโปรยร่างใหม่ ไม่มีในสคริปต์",
  imageAlt: "ภาพประกอบบทที่ 1 สมองเปรียบเหมือนเมืองที่มีหลอดเลือดเป็นถนน",
  steps: [
    {
      at: 0,
      title: "สมองหนักเพียงราว 2% ของน้ำหนักตัว แต่ใช้ออกซิเจนราว 20% ของทั้งร่างกาย",
      review: "สมองหนักราว 2% ของน้ำหนักตัว และใช้ออกซิเจนราว 20%",
    },
    {
      at: 0.14,
      title: "หลอดเลือดคือถนนส่งเสบียงเข้าเมือง",
      body: "เลือดนำออกซิเจนและอาหารไปเลี้ยงเซลล์สมองตลอดเวลา และสมองแทบไม่มีพลังงานสำรองไว้เลย",
      review: "สมองแทบไม่มีพลังงานสำรอง",
    },
    {
      at: 0.28,
      title: "สโตรก คือภาวะที่เลือดไปเลี้ยงสมองบางส่วนไม่ได้",
      body: "เซลล์สมองบริเวณนั้นจึงเริ่มตาย และหน้าที่ที่สมองส่วนนั้นควบคุมก็หายไปด้วย เช่น การพูด การขยับแขน",
    },
    {
      at: 0.42,
      title: "แบบที่ 1: ตีบหรือตัน พบบ่อยที่สุด ราว 8 ใน 10 ราย",
      body: "ลิ่มเลือดหรือคราบไขมันไปอุดหลอดเลือด เลือดจึงผ่านไปไม่ได้",
      review: "สัดส่วนสโตรกชนิดตีบหรือตันราว 8 ใน 10",
    },
    {
      at: 0.56,
      title: "แบบที่ 2: หลอดเลือดแตก ราว 2 ใน 10 ราย",
      body: "หลอดเลือดในสมองแตก เลือดรั่วออกมากดเนื้อสมอง มักเกี่ยวข้องกับความดันโลหิตสูง",
      review: "สัดส่วนสโตรกชนิดหลอดเลือดแตกราว 2 ใน 10 และความเกี่ยวข้องกับความดันโลหิตสูง",
    },
    {
      at: 0.7,
      title: "ทั้งสองแบบมีอาการคล้ายกันมาก แต่รักษาต่างกันโดยสิ้นเชิง",
      body: "แยกได้ด้วยการสแกนสมองที่โรงพยาบาลเท่านั้น จึงห้ามรักษาเองที่บ้าน",
      review: "การแยกชนิดด้วยการสแกนสมองเท่านั้น และคำเตือนห้ามรักษาเองที่บ้าน",
    },
    {
      at: 0.85,
      title: "อาการที่หายไปเอง ก็ยังต้องไปโรงพยาบาล",
      body: "บางครั้งอาการเกิดขึ้นแล้วหายภายในไม่กี่นาที เรียกว่าสโตรกเตือน (TIA) เป็นสัญญาณว่าอาจเกิดสโตรกจริงตามมา ต้องรีบพบแพทย์เช่นกัน",
      review: "นิยามและคำแนะนำเรื่องสโตรกเตือน (TIA)",
    },
  ],
};
```

- [ ] **Step 8: Write `src/content/chapter-2.ts`**

```ts
import type { ChapterContent } from "./types";

/** Chapter 2 copy (script › บทที่ 2: ใกล้ตัวกว่าที่คิด). Steps 3–7 follow RISK_KINDS order. */
export const CHAPTER_2: ChapterContent = {
  number: 2,
  title: "ใกล้ตัวกว่าที่คิด",
  lead: "สโตรกไม่ได้เป็นแค่โรคของผู้สูงอายุ และหลายอย่างในชีวิตประจำวันเพิ่มความเสี่ยงได้โดยไม่รู้ตัว",
  leadReview: "คำโปรยร่างใหม่ ไม่มีในสคริปต์",
  imageAlt: "ภาพประกอบบทที่ 2 คนหลายวัยในชีวิตประจำวันที่มีความเสี่ยงสโตรก",
  steps: [
    { at: 0, title: "ความเสี่ยงตลอดชีวิต 1 ใน 4" },
    { at: 0.14, title: "อายุน้อยก็เป็นได้!" },
    {
      at: 0.28,
      title: "พฤติกรรมการกิน: หวาน มัน เค็ม",
      body: "กินเป็นประจำจะนำไปสู่เบาหวาน ไขมันในเลือดสูง และความดันโลหิตสูง ซึ่งล้วนทำร้ายหลอดเลือด",
      review: "กลไกที่พฤติกรรมการกินหวาน มัน เค็ม ทำร้ายหลอดเลือด",
    },
    {
      at: 0.42,
      title: "ยาเสพติด: บุหรี่ กัญชา กระท่อม และอื่นๆ",
      body: "บุหรี่ทำลายผนังหลอดเลือดและทำให้เลือดจับตัวเป็นลิ่มง่ายขึ้น สารเสพติดบางชนิดทำให้ความดันพุ่งสูงหรือหลอดเลือดหดตัวฉับพลัน",
      review: "กลไกของบุหรี่และสารเสพติดต่อหลอดเลือด",
    },
    {
      at: 0.56,
      title: "มลพิษ: ฝุ่น PM2.5",
      body: "ฝุ่นละเอียดมากเข้าสู่กระแสเลือดได้ และกระตุ้นการอักเสบของหลอดเลือด",
      review: "กลไกของฝุ่น PM2.5 ต่อหลอดเลือด",
    },
    {
      at: 0.7,
      title: "ผลแทรกซ้อนจากการฉีดฟิลเลอร์",
      body: "หากสารถูกฉีดเข้าหลอดเลือดโดยไม่ตั้งใจ อาจไหลไปอุดหลอดเลือดที่ตาหรือสมองได้ ควรทำกับแพทย์ที่ได้รับอนุญาตเท่านั้น",
      review: "กลไกการอุดตันจากฟิลเลอร์ และคำแนะนำให้ทำกับแพทย์ที่ได้รับอนุญาต",
    },
    {
      at: 0.85,
      title: "ความเครียด นอนน้อย พักผ่อนไม่เพียงพอ",
      body: "ทำให้ความดันโลหิตสูงขึ้นและร่างกายฟื้นตัวได้ไม่ดี",
      review: "ผลของความเครียดและการนอนน้อยต่อความดันโลหิต",
    },
  ],
};

/** End-of-chapter self check (script › บทที่ 2 › ลูกเล่น). Option ids match RISK_KINDS. */
export const SELF_CHECK = {
  title: "ข้อไหนตรงกับคุณบ้าง",
  hint: "เลือกได้หลายข้อ ไม่มีคะแนน ไม่มีการตัดสิน",
  options: [
    { id: "food", label: "กินหวาน มัน เค็มเป็นประจำ" },
    { id: "drugs", label: "สูบบุหรี่หรือใช้สารเสพติด" },
    { id: "pm25", label: "อยู่ในที่ที่มีฝุ่น PM2.5 บ่อย" },
    { id: "filler", label: "ฉีดฟิลเลอร์ หรือกำลังคิดจะฉีด" },
    { id: "stress", label: "เครียด นอนน้อย พักผ่อนไม่พอ" },
  ],
  answer: "ทุกข้อแก้ไขได้ อ่านต่อในบทที่ 6 และ 7",
  review: "ป้ายตัวเลือกร่างใหม่จากหัวข้อปัจจัยเสี่ยง ไม่มีในสคริปต์",
} as const;
```

- [ ] **Step 9: Write the content shape test `src/content/content.test.ts`**

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { CHAPTER_1 } from "./chapter-1.ts";
import { CHAPTER_2, SELF_CHECK } from "./chapter-2.ts";

for (const chapter of [CHAPTER_1, CHAPTER_2]) {
  test(`chapter ${chapter.number} has 7 steps starting at 0 in increasing order`, () => {
    assert.equal(chapter.steps.length, 7);
    assert.equal(chapter.steps[0].at, 0);
    for (let i = 1; i < chapter.steps.length; i++) {
      assert.ok(chapter.steps[i].at > chapter.steps[i - 1].at, `step ${i + 1} must start after step ${i}`);
    }
    assert.ok(chapter.steps.at(-1)!.at < 1);
  });
}

test("self check has one option per chapter 2 risk step", () => {
  assert.equal(SELF_CHECK.options.length, CHAPTER_2.steps.length - 2);
});
```

- [ ] **Step 10: Write the failing review-report test `scripts/review-report.test.ts`**

```ts
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
```

- [ ] **Step 11: Run it to make sure it fails**

Run: `pnpm test`
Expected: FAIL — `Cannot find module '.../scripts/review-report.ts'`.

- [ ] **Step 12: Implement `scripts/review-report.ts`**

```ts
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
```

- [ ] **Step 13: Run tests, generate the report, typecheck**

Run:
```bash
pnpm test
pnpm content:review
pnpm exec tsc --noEmit && pnpm lint
```
Expected: all tests PASS (6 step + 3 content + 3 report = 12); `wrote docs/medical-review.md (14 rows)` (2 drafted leads + 6 chapter-1 steps + 5 chapter-2 steps + 1 self-check row); tsc and lint clean.

- [ ] **Step 14: Commit**

```bash
git add src/content src/lib/steps.ts src/lib/steps.test.ts scripts/review-report.ts scripts/review-report.test.ts docs/medical-review.md
git commit -m "feat: add chapter content modules and medical review report

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Opening (brand plate, dot brain, live counter)

**Files:**
- Create: `src/lib/live-counter.ts`, `src/lib/live-counter.test.ts`, `src/lib/dot-brain.ts`, `src/lib/dot-brain.test.ts`
- Create: `src/components/opening/DotBrain.tsx`, `src/components/opening/LiveCounter.tsx`, `src/components/opening/Opening.tsx`, `src/styles/opening.css`
- Modify: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- Delete: `src/components/Hero.tsx`

**Interfaces:**
- Consumes: `OPENING` (Task 3); CSS vars `--brand-navy`, `--on-brand*`, `.sr-only` (Task 2); logo `LOGO_W × LOGO_H` (Task 2).
- Produces: `CELLS_PER_SECOND`, `cellsLost(elapsedMs: number): number`, `formatCount(n: number): string`; `BRAIN_PATH: string`, `BRAIN_VIEWBOX: { width: 400; height: 300 }`, `mulberry32(seed: number): () => number`, `generateDots(count, seed, isInside): Dot[]`, `litCount(lit, total): number`, `type Dot = { x: number; y: number; r: number; order: number }`; component `DotBrain` with `ref: { setLit(lit: number): void }` (reused by a future closing chapter).

- [ ] **Step 1: Write the failing tests**

`src/lib/live-counter.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { cellsLost, formatCount } from "./live-counter.ts";

test("cellsLost is 0 at page load and never negative", () => {
  assert.equal(cellsLost(0), 0);
  assert.equal(cellsLost(-500), 0);
});

test("cellsLost after one second is 31,666 (1.9 million ÷ 60, rounded down)", () => {
  assert.equal(cellsLost(1000), 31666);
});

test("cellsLost after one minute is 1.9 million", () => {
  assert.equal(cellsLost(60_000), 1_900_000);
});

test("formatCount groups thousands with commas", () => {
  assert.equal(formatCount(1_900_000), "1,900,000");
});
```

`src/lib/dot-brain.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { generateDots, litCount, mulberry32 } from "./dot-brain.ts";

const insideCircle = (x: number, y: number) => (x - 200) ** 2 + (y - 150) ** 2 < 100 ** 2;

test("mulberry32 is deterministic and stays in [0, 1)", () => {
  const a = mulberry32(42), b = mulberry32(42);
  for (let i = 0; i < 100; i++) {
    const v = a();
    assert.equal(v, b());
    assert.ok(v >= 0 && v < 1);
  }
});

test("generateDots places exactly `count` dots, all inside the shape", () => {
  const dots = generateDots(300, 7, insideCircle);
  assert.equal(dots.length, 300);
  assert.ok(dots.every((d) => insideCircle(d.x, d.y)));
});

test("generateDots gives the same layout for the same seed and a different one for another seed", () => {
  assert.deepEqual(generateDots(50, 7, insideCircle), generateDots(50, 7, insideCircle));
  assert.notDeepEqual(generateDots(50, 7, insideCircle), generateDots(50, 8, insideCircle));
});

test("dot order is a permutation of 0..count-1", () => {
  const orders = generateDots(120, 3, insideCircle).map((d) => d.order).sort((a, b) => a - b);
  assert.deepEqual(orders, Array.from({ length: 120 }, (_, i) => i));
});

test("litCount clamps to 0–1 and rounds", () => {
  assert.equal(litCount(0.5, 10), 5);
  assert.equal(litCount(2, 10), 10);
  assert.equal(litCount(-1, 10), 0);
});
```

- [ ] **Step 2: Run them to make sure they fail**

Run: `pnpm test`
Expected: FAIL — cannot find `live-counter.ts` / `dot-brain.ts`.

- [ ] **Step 3: Implement `src/lib/live-counter.ts`**

```ts
/** Brain cells lost per second in an untreated stroke: 1.9 million per minute (Saver 2006). */
export const CELLS_PER_SECOND = 1_900_000 / 60;

/** Cells lost by one untreated patient during `elapsedMs` milliseconds. */
export function cellsLost(elapsedMs: number): number {
  return Math.floor((Math.max(0, elapsedMs) / 1000) * CELLS_PER_SECOND);
}

export function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}
```

- [ ] **Step 4: Implement `src/lib/dot-brain.ts`**

```ts
/** Side-view brain silhouette in a 400×300 box (frontal lobe left, cerebellum and brainstem bottom right). */
export const BRAIN_VIEWBOX = { width: 400, height: 300 } as const;
export const BRAIN_PATH =
  "M70,170 C55,120 85,62 150,48 C190,30 250,32 295,55 C340,72 362,112 352,150 C346,176 330,190 312,196 " +
  "C318,214 304,232 282,232 C266,246 236,246 222,232 L216,262 C214,272 200,274 196,264 L192,236 " +
  "C160,240 128,236 106,222 C82,210 74,192 70,170 Z";

export type Dot = { x: number; y: number; r: number; order: number };

/** Small deterministic PRNG so the dot layout is identical on every visit. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Places `count` dots inside the shape tested by `isInside` (BRAIN_VIEWBOX coordinates).
 * `order` is a random rank 0..count-1: a dot stays lit while order < litCount(lit, count).
 */
export function generateDots(count: number, seed: number, isInside: (x: number, y: number) => boolean): Dot[] {
  const rand = mulberry32(seed);
  const dots: Dot[] = [];
  for (let guard = 0; dots.length < count && guard < count * 50; guard++) {
    const x = rand() * BRAIN_VIEWBOX.width;
    const y = rand() * BRAIN_VIEWBOX.height;
    if (isInside(x, y)) dots.push({ x, y, r: 1.4 + rand() * 1.4, order: 0 });
  }
  const ranks = dots.map((_, i) => i);
  for (let i = ranks.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [ranks[i], ranks[j]] = [ranks[j], ranks[i]];
  }
  dots.forEach((d, i) => {
    d.order = ranks[i];
  });
  return dots;
}

/** Number of dots that stay lit for a 0–1 `lit` value. */
export function litCount(lit: number, total: number): number {
  return Math.round(Math.min(1, Math.max(0, lit)) * total);
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `pnpm test`
Expected: PASS (all earlier tests + 9 new).

- [ ] **Step 6: Write `src/components/opening/DotBrain.tsx`**

```tsx
"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import { BRAIN_PATH, BRAIN_VIEWBOX, generateDots, litCount, type Dot } from "@/lib/dot-brain";

export type DotBrainHandle = { setLit: (lit: number) => void };

type BrainState = { dots: Dot[]; lit: number; drawn: number };

const SEED = 1669;
// Fixed colours: this component only sits on the navy brand plate (same in both themes).
const LIT = "#EE7C86";
const LIT_HALO = "rgba(238, 124, 134, 0.22)";
const OFF = "rgba(167, 175, 192, 0.32)";

function paint(canvas: HTMLCanvasElement, s: BrainState, force: boolean) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const on = litCount(s.lit, s.dots.length);
  if (!force && on === s.drawn) return;
  s.drawn = on;

  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  }
  const scale = Math.min(w / BRAIN_VIEWBOX.width, h / BRAIN_VIEWBOX.height);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.translate((w - BRAIN_VIEWBOX.width * scale) / 2, (h - BRAIN_VIEWBOX.height * scale) / 2);
  ctx.scale(scale, scale);

  for (const d of s.dots) {
    const lit = d.order < on;
    if (lit) {
      ctx.fillStyle = LIT_HALO;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = lit ? LIT : OFF;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Brain drawn from points of light. `setLit(0–1)` dims dots in a fixed random order. */
export function DotBrain({ ref, label }: { ref?: Ref<DotBrainHandle>; label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef<BrainState>({ dots: [], lit: 1, drawn: -1 });

  useImperativeHandle(
    ref,
    () => ({
      setLit(lit: number) {
        state.current.lit = lit;
        if (canvasRef.current) paint(canvasRef.current, state.current, false);
      },
    }),
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const shape = new Path2D(BRAIN_PATH);
    const count = window.innerWidth < 768 ? 600 : 1000;
    // identity transform here, so isPointInPath works in BRAIN_VIEWBOX units
    state.current.dots = generateDots(count, SEED, (x, y) => ctx.isPointInPath(shape, x, y));
    paint(canvas, state.current, true);
    const ro = new ResizeObserver(() => paint(canvas, state.current, true));
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="dot-brain" role="img" aria-label={label}>
      <svg
        className="dot-brain-outline"
        viewBox={`0 0 ${BRAIN_VIEWBOX.width} ${BRAIN_VIEWBOX.height}`}
        aria-hidden="true"
      >
        <path d={BRAIN_PATH} />
      </svg>
      <canvas ref={canvasRef} className="dot-brain-canvas" aria-hidden="true" />
    </div>
  );
}
```

- [ ] **Step 7: Write `src/components/opening/LiveCounter.tsx`**

```tsx
"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { OPENING } from "@/content/opening";
import { cellsLost, formatCount } from "@/lib/live-counter";

const noopSubscribe = () => () => {};

/** "Cells lost since you opened this page". Server / no-JS render shows the per-second rate instead. */
export function LiveCounter() {
  // false on the server and during hydration, true once running in the browser
  const live = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = numRef.current;
    if (!live || !el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const every = reduce ? 1000 : 100; // at most 10 DOM writes per second
    let raf = 0;
    let last = -Infinity;
    const tick = (now: number) => {
      // rAF time shares performance.now()'s origin: milliseconds since the page started loading
      if (now - last >= every) {
        last = now;
        el.textContent = formatCount(cellsLost(now));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [live]);

  if (!live) return <p className="counter">{OPENING.counterStatic}</p>;
  return (
    <p className="counter">
      <span aria-hidden="true">{OPENING.counterBefore}</span>
      <span className="counter-num" ref={numRef} aria-hidden="true">0</span>
      <span aria-hidden="true">{OPENING.counterAfter}</span>
      <span className="sr-only">{OPENING.counterStatic}</span>
    </p>
  );
}
```

- [ ] **Step 8: Write `src/components/opening/Opening.tsx`** (replace `LOGO_W`/`LOGO_H` with the numbers from Task 2 Step 1)

```tsx
"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { OPENING } from "@/content/opening";
import { DotBrain, type DotBrainHandle } from "./DotBrain";
import { LiveCounter } from "./LiveCounter";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Share of dots still lit once the reader has scrolled past the opening. */
const MIN_LIT = 0.15;
const ECG =
  "M0,50 H280 L300,50 L314,14 L330,84 L344,30 L356,50 H520 L538,50 L552,8 L568,88 L582,24 L596,50 H760 L776,50 L786,36 L798,62 L808,50 H1000";

export function Opening() {
  const rootRef = useRef<HTMLElement>(null);
  const brainRef = useRef<DotBrainHandle>(null);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => brainRef.current?.setLit(1 - (1 - MIN_LIT) * self.progress),
      });
    },
    { scope: rootRef },
  );

  return (
    <header className="opening" ref={rootRef}>
      <div className="opening-inner">
        <div className="opening-brand">
          <Image
            src="/brand/wrb12-on-navy.webp"
            alt={OPENING.logoAlt}
            width={LOGO_W}
            height={LOGO_H}
            className="opening-logo"
            loading="eager"
          />
          <p className="opening-campaign">{OPENING.campaign}</p>
        </div>
        <div className="opening-art">
          <DotBrain ref={brainRef} label={OPENING.brainLabel} />
        </div>
        <div className="opening-copy">
          <h1>
            {OPENING.title[0]}
            <br />
            {OPENING.title[1]}
          </h1>
          <svg className="ecg" viewBox="0 0 1000 90" aria-hidden="true">
            <path pathLength={1} d={ECG} />
          </svg>
          <p className="opening-lead">{OPENING.lead}</p>
          <LiveCounter />
          <p className="cue">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4v15M5 12l7 7 7-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {OPENING.cue}
          </p>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 9: Write `src/styles/opening.css`**

```css
/* Opening: campaign brand plate (same colours in both themes). Mobile-first; tiers as DESIGN.md › Layout. */
.opening { background: var(--brand-navy); color: var(--on-brand); min-height: 100vh; min-height: 100svh; display: flex; }
.opening-inner {
  width: 100%; max-width: 1180px; margin: 0 auto;
  padding: calc(env(safe-area-inset-top, 0px) + clamp(20px, 4vh, 40px)) clamp(20px, 6vw, 80px) clamp(28px, 6vh, 56px);
  display: grid; grid-template-columns: minmax(0, 1fr); grid-template-areas: "brand" "art" "copy";
  gap: clamp(14px, 2.4vh, 24px); align-content: center;
}
.opening-brand { grid-area: brand; display: flex; align-items: center; gap: 14px; }
.opening-logo { width: clamp(96px, 28vw, 140px); height: auto; display: block; }
.opening-campaign { font-size: .85rem; line-height: 1.4; color: var(--on-brand-muted); max-width: 14em; }
.opening-art { grid-area: art; height: clamp(180px, 34svh, 320px); }
.opening-copy { grid-area: copy; display: flex; flex-direction: column; gap: clamp(10px, 2vh, 18px); }
.opening h1 { font-size: clamp(2.3rem, 9vw, 5.6rem); line-height: 1.22; letter-spacing: -.01em; color: var(--on-brand); }
.opening .ecg path { stroke: var(--on-brand-alert); }
.opening-lead { color: var(--on-brand-muted); font-size: 1.05em; max-width: 32em; }
.counter { color: var(--on-brand-muted); font-size: .95rem; line-height: 1.5; max-width: 30em; }
.counter-num {
  display: block; font-family: var(--num); font-weight: 700; font-size: clamp(2rem, 8vw, 3.4rem); line-height: 1.15;
  color: var(--on-brand-alert); font-variant-numeric: tabular-nums;
}
.opening .cue { color: var(--on-brand); }
.opening :focus-visible { outline-color: var(--on-brand); }

.dot-brain { position: relative; width: 100%; height: 100%; }
.dot-brain-outline, .dot-brain-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.dot-brain-outline path { fill: rgba(255, 255, 255, .04); stroke: rgba(255, 255, 255, .22); stroke-width: 2; vector-effect: non-scaling-stroke; }

@media (min-width: 700px) and (min-height: 900px) {
  .opening-art { height: clamp(300px, 36svh, 460px); }
  .opening-logo { width: 160px; }
}
@media (min-width: 861px) {
  .opening-inner {
    grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); grid-template-areas: "brand art" "copy art";
    column-gap: clamp(32px, 5vw, 80px); align-items: center;
  }
  .opening-art { height: min(64vh, 520px); }
  .opening-logo { width: 160px; }
}
@media (orientation: landscape) and (max-height: 500px) {
  .opening-inner {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); grid-template-areas: "brand art" "copy art";
    column-gap: 28px; align-items: center;
  }
  .opening-art { height: 70svh; }
  .opening-logo { width: 88px; }
  .opening h1 { font-size: clamp(1.8rem, 5vw, 2.6rem); }
  .counter-num { font-size: 1.7rem; }
}
```

- [ ] **Step 10: Wire it in and remove the old hero**

In `src/app/layout.tsx`, after `import "@/styles/chapter-4.css";` add `import "@/styles/opening.css";`.

Replace `src/app/page.tsx` with:

```tsx
import { NextChapter } from "@/components/NextChapter";
import { SiteFooter } from "@/components/SiteFooter";
import { Chapter3 } from "@/components/chapter-3/Chapter3";
import { Chapter4 } from "@/components/chapter-4/Chapter4";
import { Opening } from "@/components/opening/Opening";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function Home() {
  return (
    <>
      <ProgressBar />
      <Opening />
      <Chapter3 />
      <Chapter4 />
      <NextChapter />
      <SiteFooter />
    </>
  );
}
```

Delete `src/components/Hero.tsx`: `git rm src/components/Hero.tsx`.

In `src/app/globals.css`, delete the hero rules (keep `.ecg`, `@keyframes draw`, `.cue`, `.cue svg`):

```css
/* ---------- hero ---------- */
.hero {
  min-height: 94vh; min-height: 94svh; max-width: 1180px; margin: 0 auto; padding: 12vh clamp(20px, 6vw, 80px) 8vh;
  display: flex; flex-direction: column; justify-content: center; gap: clamp(18px, 3vh, 30px);
}
.hero-note { color: var(--ink-2); font-size: .95rem; }
.hero h1 { font-size: clamp(2.7rem, 9vw, 6.6rem); letter-spacing: -.01em; line-height: 1.22; }
```
and `.hero-lead { … }`. Rename the section comment to `/* ---------- shared: ECG line + scroll cue ---------- */`.

- [ ] **Step 11: Verify**

Run:
```bash
pnpm test && pnpm lint && pnpm exec tsc --noEmit
pkill -f "next start"; pkill -f next-server; pnpm build && (pnpm start -p 3100 > .shots/server.log 2>&1 &) ; sleep 3
pnpm shots capture --out .shots/t4 --vp 360x640,820x1180,740x360,1280x800
pnpm shots capture --out .shots/t4-dark --vp 390x844 --scheme dark
```
Expected: every line `no overflow`, no `ERRORS`. Open `.shots/t4/360x640-top.png`, `820x1180-top.png`, `740x360-top.png`, `1280x800-top.png`, `.shots/t4-dark/390x844-top.png` and check: navy plate fills the first screen; logo + campaign line at top; pink dot brain visible; title, red ECG, lead, counter number in light red, cue all readable; dark mode identical to light.

Check the counter ticks:
```bash
node --input-type=module -e '
import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const p = await b.newPage(); await p.goto("http://localhost:3100/", { waitUntil: "networkidle0" });
const read = () => p.$eval(".counter-num", (e) => e.textContent);
const a = await read(); await new Promise((r) => setTimeout(r, 1500)); const c = await read();
console.log(a, "->", c); await b.close();'
```
Expected: second number larger than the first by roughly 47,000 (1.5 s × 31,667).

- [ ] **Step 12: Commit**

```bash
git add src/lib/live-counter.ts src/lib/live-counter.test.ts src/lib/dot-brain.ts src/lib/dot-brain.test.ts src/components/opening src/styles/opening.css src/app/layout.tsx src/app/page.tsx src/app/globals.css
git commit -m "feat: replace hero with campaign-branded opening (dot brain + live counter)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Shared pinned story stage and chapter 1–2 shells

**Files:**
- Create: `src/hooks/usePinnedSteps.ts`, `src/components/ui/StoryStage.tsx`, `src/components/ui/ChapterHead.tsx`, `src/styles/story.css`, `src/components/chapter-1/Chapter1.tsx`, `src/components/chapter-2/Chapter2.tsx`
- Modify: `src/components/ui/ChapterVisual.tsx`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`

**Interfaces:**
- Consumes: `activeStep` (Task 3), `CHAPTER_1`, `CHAPTER_2`, `Step`, `ChapterContent` (Task 3).
- Produces:
  - `type PinnedScene = { render?: (progress: number, step: number) => void; onStep?: (step: number, prev: number) => void; cleanup?: () => void }`
  - `usePinnedSteps(pinRef, { starts, end, setup })` — pins, toggles `.step.on`, sets `data-step="<index>"` on the pin `<section>`.
  - `<StoryStage id steps scene? setup? stepExtra? end? />` — markup: `div > section.pin#<id> > div.stage.story-stage > (div.story-scene + div.steps > article.step*)`.
  - `<ChapterHead chapter titleId reverse? />`
  - `ChapterVisual` `src` now optional (placeholder when missing).
  - CSS classes `.story-svg` (scene `<svg>` sizing), `.chapter-visual--leaf`, `.chapter-visual--leaf-reverse`.

- [ ] **Step 1: Write `src/hooks/usePinnedSteps.ts`**

```ts
"use client";

import type { RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { activeStep } from "@/lib/steps";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type PinnedScene = {
  /** Every scroll update: overall progress (0–1) and the active step index. */
  render?: (progress: number, step: number) => void;
  /** When the active step changes; `prev` is -1 on the first call. */
  onStep?: (step: number, prev: number) => void;
  cleanup?: () => void;
};

type Options = {
  /** Progress (0–1) at which each `.step` becomes active, in DOM order. */
  starts: readonly number[];
  /** ScrollTrigger end, e.g. "+=600%". */
  end: string;
  setup: (pin: HTMLElement, reduce: boolean) => PinnedScene;
};

/**
 * Pins `pinRef` while the reader scrolls `end`, shows one `.step` at a time, writes the
 * active index to `data-step` on the pin (for CSS scene states) and forwards progress to
 * the chapter scene. Same mechanics as BrainClock (chapter 3).
 */
export function usePinnedSteps(pinRef: RefObject<HTMLElement | null>, { starts, end, setup }: Options) {
  useGSAP(
    () => {
      const pin = pinRef.current;
      if (!pin) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const steps = Array.from(pin.querySelectorAll<HTMLElement>(".step"));
      const scene = setup(pin, reduce);
      let cur = -1;

      const update = (p: number) => {
        const idx = activeStep(p, starts);
        if (idx !== cur) {
          steps.forEach((s, j) => s.classList.toggle("on", j === idx));
          pin.dataset.step = String(idx);
          scene.onStep?.(idx, cur);
          cur = idx;
        }
        scene.render?.(p, idx);
      };

      document.documentElement.classList.add("anim");
      ScrollTrigger.config({ ignoreMobileResize: true });
      const proxy = { p: 0 };
      gsap.to(proxy, {
        p: 1,
        ease: "none",
        scrollTrigger: { trigger: pin, start: "top top", end, pin: true, scrub: 0.6, anticipatePin: 1 },
        onUpdate: () => update(proxy.p),
      });
      update(0);
      return () => scene.cleanup?.();
    },
    { scope: pinRef },
  );
}
```

- [ ] **Step 2: Write `src/components/ui/StoryStage.tsx`**

```tsx
"use client";

import { useRef, type ReactNode } from "react";
import type { Step } from "@/content/types";
import { usePinnedSteps, type PinnedScene } from "@/hooks/usePinnedSteps";

type Props = {
  /** Pin id, e.g. "pin1". Also the hook for CSS scene states: #pin1[data-step="3"]. */
  id: string;
  steps: readonly Step[];
  scene?: ReactNode;
  setup?: (pin: HTMLElement, reduce: boolean) => PinnedScene;
  /** Extra content rendered inside step `index` (e.g. a toggle). */
  stepExtra?: (index: number) => ReactNode;
  end?: string;
};

const noScene = (): PinnedScene => ({});

/** Pinned chapter stage: scene on one side, one step of text at a time on the other. */
export function StoryStage({ id, steps, scene, setup = noScene, stepExtra, end = "+=600%" }: Props) {
  const pinRef = useRef<HTMLElement>(null);
  usePinnedSteps(pinRef, { starts: steps.map((s) => s.at), end, setup });

  return (
    // wrapper keeps ScrollTrigger's pin-spacer out of React-managed siblings
    <div>
      <section className="pin" id={id} ref={pinRef} data-step="0">
        <div className="stage story-stage">
          <div className="story-scene">{scene}</div>
          <div className="steps">
            {steps.map((s, i) => (
              <article key={s.at} className={i === 0 ? "step on" : "step"}>
                <h3>{s.title}</h3>
                {s.body && <p>{s.body}</p>}
                {stepExtra?.(i)}
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Make `src/components/ui/ChapterVisual.tsx` accept a missing image**

Replace the file with:

```tsx
import Image from "next/image";
import type { ReactNode } from "react";

type Props = {
  /** Omit until the illustration exists: a plain leaf-shaped plate is shown instead. */
  src?: string;
  alt: string;
  /** Modifier class, e.g. "chapter-visual--time". */
  variant: string;
  sizes: string;
  children?: ReactNode;
};

/** Leaf-shaped chapter illustration (3:2). Source images are 1536×1024. */
export function ChapterVisual({ src, alt, variant, sizes, children }: Props) {
  return (
    <figure className={`chapter-visual ${variant}`}>
      {src ? (
        <Image src={src} alt={alt} width={1536} height={1024} sizes={sizes} />
      ) : (
        <div className="chapter-visual-placeholder" aria-hidden="true" />
      )}
      {children}
    </figure>
  );
}
```

- [ ] **Step 4: Write `src/components/ui/ChapterHead.tsx`**

```tsx
import type { ChapterContent } from "@/content/types";
import { ChapterVisual } from "./ChapterVisual";

type Props = {
  chapter: ChapterContent;
  /** id of the <h2>, referenced by the chapter section's aria-labelledby. */
  titleId: string;
  /** Image on the left on desktop (alternates with the previous chapter). */
  reverse?: boolean;
};

export function ChapterHead({ chapter, titleId, reverse = false }: Props) {
  return (
    <header className={`ch-head ch-head--visual${reverse ? " ch-head--reverse" : ""}`}>
      <div className="ch-copy">
        <p className="ch-num">บทที่ {chapter.number}</p>
        <h2 id={titleId}>{chapter.title}</h2>
        <p className="lead">{chapter.lead}</p>
      </div>
      <ChapterVisual
        src={chapter.image}
        alt={chapter.imageAlt}
        variant={reverse ? "chapter-visual--leaf-reverse" : "chapter-visual--leaf"}
        sizes="(min-width: 861px) 64vw, 100vw"
      />
    </header>
  );
}
```

- [ ] **Step 5: Add leaf and placeholder styles to `src/app/globals.css`**

Change the existing phone rule

```css
.chapter-visual--time, .chapter-visual--signs { border-radius: 52px 16px 52px 16px; }
```

to

```css
.chapter-visual--time, .chapter-visual--signs,
.chapter-visual--leaf, .chapter-visual--leaf-reverse { border-radius: 52px 16px 52px 16px; }
.chapter-visual-placeholder { aspect-ratio: 3 / 2; background: var(--visual-bg); }
```

Inside the existing `@media (min-width: 861px) { … }` block in `globals.css`, after `.chapter-visual--signs { border-radius: 24px 88px 24px 88px; }` add:

```css
  .chapter-visual--leaf { border-radius: 88px 24px 88px 24px; }
  .chapter-visual--leaf-reverse { border-radius: 24px 88px 24px 88px; }
```

- [ ] **Step 6: Write `src/styles/story.css`**

```css
/* Pinned story stages (chapters 1–2): scene + one step of text. Reuses .steps/.step from chapter-3.css.
   Mobile-first; tiers as DESIGN.md › Layout. */
.story-stage {
  display: grid; grid-template-columns: minmax(0, 1fr);
  grid-template-rows: 1fr auto auto 1fr; grid-template-areas: "." "scene" "steps" ".";
  row-gap: 18px;
}
.story-scene { grid-area: scene; position: relative; display: flex; justify-content: center; align-items: center; min-height: 0; }
.story-svg { height: clamp(180px, 40svh, 320px); width: auto; max-width: 100%; display: block; overflow: visible; }
.story-stage .steps { grid-area: steps; }

@media (min-width: 700px) and (min-height: 900px) {
  .story-svg { height: clamp(320px, 44svh, 520px); }
  .story-stage .steps { justify-self: center; width: min(100%, 36em); }
}
@media (min-width: 861px) {
  .story-stage {
    grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); grid-template-rows: 1fr;
    grid-template-areas: "scene steps"; column-gap: clamp(24px, 5vw, 80px); align-items: center;
  }
  .story-svg { height: min(64vh, 520px); }
  .story-stage .steps { justify-self: auto; width: auto; }
}
@media (orientation: landscape) and (max-height: 500px) {
  .story-stage {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); grid-template-rows: 1fr;
    grid-template-areas: "scene steps"; column-gap: 28px; align-items: center;
  }
  .story-svg { height: clamp(140px, 62svh, 280px); }
  .story-stage .steps { justify-self: auto; width: auto; }
}
```

In `src/app/layout.tsx`, after `import "@/styles/opening.css";` add `import "@/styles/story.css";`.

- [ ] **Step 7: Write the chapter shells**

`src/components/chapter-1/Chapter1.tsx`:

```tsx
import { CHAPTER_1 } from "@/content/chapter-1";
import { ChapterHead } from "@/components/ui/ChapterHead";
import { StoryStage } from "@/components/ui/StoryStage";

export function Chapter1() {
  return (
    <section className="chapter" id="ch1" aria-labelledby="ch1-title">
      <ChapterHead chapter={CHAPTER_1} titleId="ch1-title" />
      <StoryStage id="pin1" steps={CHAPTER_1.steps} scene={<svg className="story-svg" viewBox="0 0 400 320" aria-hidden="true" />} />
    </section>
  );
}
```

`src/components/chapter-2/Chapter2.tsx`:

```tsx
import { CHAPTER_2 } from "@/content/chapter-2";
import { ChapterHead } from "@/components/ui/ChapterHead";
import { StoryStage } from "@/components/ui/StoryStage";

export function Chapter2() {
  return (
    <section className="chapter" id="ch2" aria-labelledby="ch2-title">
      <ChapterHead chapter={CHAPTER_2} titleId="ch2-title" reverse />
      <StoryStage id="pin2" steps={CHAPTER_2.steps} scene={<svg className="story-svg" viewBox="0 0 400 320" aria-hidden="true" />} />
    </section>
  );
}
```

In `src/app/page.tsx` add the imports

```tsx
import { Chapter1 } from "@/components/chapter-1/Chapter1";
import { Chapter2 } from "@/components/chapter-2/Chapter2";
```

and render `<Chapter1 />` and `<Chapter2 />` between `<Opening />` and `<Chapter3 />`.

Chapter 3's head uses `ch-head--visual` (image right). With chapters 1 (image right) and 2 (image left) before it, the alternation still works: 1 right, 2 left, 3 right, 4 left.

- [ ] **Step 8: Verify**

Run:
```bash
pnpm lint && pnpm exec tsc --noEmit
pkill -f "next start"; pkill -f next-server; pnpm build && (pnpm start -p 3100 > .shots/server.log 2>&1 &) ; sleep 3
pnpm shots capture --out .shots/t5
```
Expected: 12 lines, all `no overflow`, no `ERRORS`. Open `.shots/t5/360x640-pin1-0.1.png`, `-0.5.png`, `-0.9.png`: a different step title is visible in each (step 1, step 4, step 7) under an empty scene area. Open `.shots/t5/1280x800-pin2-0.5.png`: the text column is on the right.

Check the chapter heads (placeholder leaf plates):
```bash
node --input-type=module -e '
import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 800 });
await p.goto("http://localhost:3100/", { waitUntil: "networkidle0" });
for (const id of ["ch1", "ch2"]) {
  await p.evaluate((id) => document.getElementById(id).scrollIntoView(), id);
  await new Promise((r) => setTimeout(r, 600));
  await p.screenshot({ path: `.shots/t5/1280x800-${id}-head.png` });
}
await b.close();'
```
Expected: `ch1-head.png` shows "บทที่ 1 / สโตรกคืออะไร" with a pale-blue leaf plate on the right; `ch2-head.png` shows "บทที่ 2" with the plate on the left.

- [ ] **Step 9: Commit**

```bash
git add src/hooks src/components/ui src/components/chapter-1 src/components/chapter-2 src/styles/story.css src/app/globals.css src/app/layout.tsx src/app/page.tsx
git commit -m "feat: add pinned story stage and chapter 1-2 text shells

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Chapter 1 scene — brain city and clot/bleed toggle

**Files:**
- Create: `src/lib/brain-city.ts`, `src/lib/brain-city.test.ts`, `src/components/chapter-1/BrainCity.tsx`, `src/components/chapter-1/TypeToggle.tsx`, `src/styles/chapter-1.css`
- Modify: `src/components/chapter-1/Chapter1.tsx`, `src/app/layout.tsx`

**Interfaces:**
- Consumes: `BRAIN_PATH` (Task 4), `StoryStage`, `PinnedScene` (Task 5), `stepProgress` (Task 3), `CHAPTER_1` (Task 3).
- Produces: `type Point = readonly [number, number]`, `type DistrictId = "frontal" | "parietal" | "occipital" | "temporal"`, `type Road = { from: Point; c1: Point; c2: Point; to: Point }`, `BRAIN_OUTLINE`, `DISTRICTS`, `ROADS`, `pointInPolygon`, `cityLights(spacing?)`, `roadD(road)`, `pointOnRoad(road, t)`, `CLOT_T`, `CLOT_AT`, `QUEUE_AT`, `BLEED_AT`, `LABELS`.

Scene states (0-based `data-step` on `#pin1`): 0 all lights on + 2%/20% stats; 1 blood flows on roads, district labels shown; 2 frontal district dark, labels fade; 3 clot travels up the frontal road and sticks, cells queue behind it; 4 occipital road bursts, occipital district dark; 5 split view "ตัน | แตก" + scanner sweep + toggle; 6 parietal lights flicker (TIA) + red warning.

- [ ] **Step 1: Write the failing geometry test `src/lib/brain-city.test.ts`**

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { BRAIN_OUTLINE, DISTRICTS, ROADS, cityLights, pointInPolygon, pointOnRoad, roadD, type DistrictId } from "./brain-city.ts";

const SQUARE = [[0, 0], [10, 0], [10, 10], [0, 10]] as const;

test("pointInPolygon tells inside from outside", () => {
  assert.equal(pointInPolygon([5, 5], SQUARE), true);
  assert.equal(pointInPolygon([15, 5], SQUARE), false);
  assert.equal(pointInPolygon([-1, -1], SQUARE), false);
});

test("every light is inside the brain outline and its own district", () => {
  for (const l of cityLights()) {
    assert.ok(pointInPolygon([l.x, l.y], BRAIN_OUTLINE), `light ${l.x},${l.y} outside the brain`);
    assert.ok(pointInPolygon([l.x, l.y], DISTRICTS[l.district]), `light ${l.x},${l.y} outside ${l.district}`);
  }
});

test("every district has at least 6 lights", () => {
  const lights = cityLights();
  for (const id of Object.keys(DISTRICTS) as DistrictId[]) {
    assert.ok(lights.filter((l) => l.district === id).length >= 6, `${id} has too few lights`);
  }
});

test("pointOnRoad starts at `from` and ends at `to`", () => {
  assert.deepEqual(pointOnRoad(ROADS.frontal, 0), ROADS.frontal.from);
  assert.deepEqual(pointOnRoad(ROADS.frontal, 1), ROADS.frontal.to);
});

test("roadD writes an SVG cubic path", () => {
  assert.equal(roadD(ROADS.trunk), "M206,320 C206,296 208,268 210,244");
});

test("every branch road ends inside the brain outline", () => {
  // the trunk ends at the brainstem, below the outline polygon, so it is skipped
  for (const [id, r] of Object.entries(ROADS)) {
    if (id !== "trunk") assert.ok(pointInPolygon(r.to, BRAIN_OUTLINE), `${id} ends outside the brain`);
  }
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `pnpm test`
Expected: FAIL — cannot find `brain-city.ts`.

- [ ] **Step 3: Implement `src/lib/brain-city.ts`**

```ts
/** Chapter 1 "brain city" map in a 400×320 SVG box (same coordinates as BRAIN_PATH in dot-brain.ts). */
export type Point = readonly [number, number];
export type DistrictId = "frontal" | "parietal" | "occipital" | "temporal";
export type Road = { from: Point; c1: Point; c2: Point; to: Point };
export type Light = { x: number; y: number; district: DistrictId };

/** Polygon slightly inside BRAIN_PATH, used to keep window lights off the outline. */
export const BRAIN_OUTLINE: readonly Point[] = [
  [80, 168], [78, 128], [98, 88], [132, 60], [170, 44], [215, 38], [260, 42], [298, 60], [330, 82],
  [346, 116], [344, 152], [330, 180], [306, 196], [300, 214], [282, 226], [250, 234], [222, 226],
  [190, 230], [150, 230], [114, 216], [90, 196],
];

/** City districts (rough lobes). Earlier entries win where polygons overlap. */
export const DISTRICTS: Record<DistrictId, readonly Point[]> = {
  frontal: [[60, 40], [170, 30], [165, 120], [150, 240], [60, 240]],
  parietal: [[170, 30], [290, 30], [270, 115], [165, 120]],
  occipital: [[290, 30], [380, 40], [380, 200], [306, 196], [270, 115]],
  temporal: [[165, 120], [270, 115], [306, 196], [282, 232], [150, 240]],
};

/** Blood vessels as roads: a trunk up from the neck that branches into each district. */
export const ROADS = {
  trunk: { from: [206, 320], c1: [206, 296], c2: [208, 268], to: [210, 244] },
  frontal: { from: [210, 244], c1: [188, 218], c2: [150, 200], to: [112, 168] },
  parietal: { from: [210, 244], c1: [214, 196], c2: [220, 140], to: [226, 76] },
  temporal: { from: [210, 244], c1: [232, 232], c2: [252, 218], to: [268, 198] },
  occipital: { from: [210, 244], c1: [252, 220], c2: [300, 196], to: [332, 146] },
} satisfies Record<string, Road>;

export function pointInPolygon([x, y]: Point, poly: readonly Point[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Window lights on a staggered grid, kept where they fall inside the brain and a district. */
export function cityLights(spacing = 18): Light[] {
  const lights: Light[] = [];
  const ids = Object.keys(DISTRICTS) as DistrictId[];
  for (let row = 1; row * spacing < 320; row++) {
    const y = row * spacing;
    const offset = row % 2 ? spacing / 2 : 0;
    for (let x = spacing / 2 + offset; x < 400; x += spacing) {
      if (!pointInPolygon([x, y], BRAIN_OUTLINE)) continue;
      const district = ids.find((id) => pointInPolygon([x, y], DISTRICTS[id]));
      if (district) lights.push({ x, y, district });
    }
  }
  return lights;
}

export function roadD(r: Road): string {
  return `M${r.from.join(",")} C${r.c1.join(",")} ${r.c2.join(",")} ${r.to.join(",")}`;
}

/** Point at `t` (0–1) along a road's cubic Bézier. */
export function pointOnRoad(r: Road, t: number): Point {
  const u = 1 - t;
  const f = (i: 0 | 1) => u * u * u * r.from[i] + 3 * u * u * t * r.c1[i] + 3 * u * t * t * r.c2[i] + t * t * t * r.to[i];
  return [f(0), f(1)];
}

/** Where the clot sticks on the frontal road (step 4) and the blood cells backed up behind it. */
export const CLOT_T = 0.55;
export const CLOT_AT = pointOnRoad(ROADS.frontal, CLOT_T);
export const QUEUE_AT: readonly Point[] = [0.47, 0.4, 0.33].map((t) => pointOnRoad(ROADS.frontal, t));
/** Where the occipital road bursts (step 5). */
export const BLEED_AT = pointOnRoad(ROADS.occipital, 0.85);

/** Functions lost when the frontal district goes dark (step 3). */
export const LABELS = [
  { text: "การพูด", at: [104, 150] as Point },
  { text: "การขยับแขน", at: [132, 104] as Point },
] as const;
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test`
Expected: PASS. If "every district has at least 6 lights" fails for one district, move that district's polygon vertices by ≤ 10 units toward the brain centre (200,150) until it passes; do not lower the threshold.

- [ ] **Step 5: Write `src/components/chapter-1/TypeToggle.tsx`**

```tsx
"use client";

export type StrokeType = "clot" | "bleed";

type Props = {
  value: StrokeType | null;
  onChange: (value: StrokeType) => void;
  captions: Record<StrokeType, string>;
};

/** "ตัน / แตก" switch in chapter 1 step 6: highlights one half of the split scene. */
export function TypeToggle({ value, onChange, captions }: Props) {
  return (
    <div className="type-toggle">
      <div className="type-toggle-buttons" role="group" aria-label="ดูความต่างของสโตรกสองแบบ">
        <button type="button" aria-pressed={value === "clot"} onClick={() => onChange("clot")}>ตัน</button>
        <button type="button" aria-pressed={value === "bleed"} onClick={() => onChange("bleed")}>แตก</button>
      </div>
      <p className="type-toggle-caption" aria-live="polite">{value ? captions[value] : "แตะเพื่อดูทีละแบบ"}</p>
    </div>
  );
}
```

- [ ] **Step 6: Write `src/components/chapter-1/BrainCity.tsx`**

```tsx
"use client";

import { useState } from "react";
import { CHAPTER_1 } from "@/content/chapter-1";
import { StoryStage } from "@/components/ui/StoryStage";
import type { PinnedScene } from "@/hooks/usePinnedSteps";
import { BRAIN_PATH } from "@/lib/dot-brain";
import { BLEED_AT, CLOT_T, DISTRICTS, LABELS, QUEUE_AT, ROADS, cityLights, pointOnRoad, roadD, type DistrictId } from "@/lib/brain-city";
import { stepProgress } from "@/lib/steps";
import { TypeToggle, type StrokeType } from "./TypeToggle";

const STARTS = CHAPTER_1.steps.map((s) => s.at);
const LIGHTS = cityLights();
const DISTRICT_IDS = Object.keys(DISTRICTS) as DistrictId[];
const CLOT_STEP = 3, BLEED_STEP = 4, TOGGLE_STEP = 5;
const CAPTIONS: Record<StrokeType, string> = {
  clot: CHAPTER_1.steps[CLOT_STEP].body ?? "",
  bleed: CHAPTER_1.steps[BLEED_STEP].body ?? "",
};
const BLOB = "M0,-14 C9,-14 16,-6 15,3 C14,12 6,17 -3,16 C-12,15 -17,6 -15,-3 C-13,-11 -7,-14 0,-14 Z";
const fmt = (n: number) => n.toFixed(1);

function setup(pin: HTMLElement, reduce: boolean): PinnedScene {
  const clot = pin.querySelector<SVGCircleElement>(".clot")!;
  const bleed = pin.querySelector<SVGPathElement>(".bleed")!;
  const weight = pin.querySelector<HTMLElement>('[data-stat="weight"]')!;
  const oxygen = pin.querySelector<HTMLElement>('[data-stat="oxygen"]')!;
  return {
    render(p, step) {
      const s0 = reduce ? 1 : stepProgress(p, STARTS, 0);
      weight.textContent = `${Math.round(2 * s0)}%`;
      oxygen.textContent = `${Math.round(20 * s0)}%`;
      // clot drifts up the frontal road during the first 60% of its step, then sticks
      const travel = step === CLOT_STEP && !reduce ? Math.min(1, stepProgress(p, STARTS, CLOT_STEP) / 0.6) : 1;
      const [cx, cy] = pointOnRoad(ROADS.frontal, CLOT_T * travel);
      clot.setAttribute("transform", `translate(${fmt(cx)} ${fmt(cy)})`);
      const grow = step === BLEED_STEP && !reduce ? Math.min(1, stepProgress(p, STARTS, BLEED_STEP) / 0.5) : 1;
      bleed.setAttribute("transform", `translate(${fmt(BLEED_AT[0])} ${fmt(BLEED_AT[1])}) scale(${(0.2 + 0.8 * grow).toFixed(2)})`);
    },
  };
}

export function BrainCity() {
  const [focus, setFocus] = useState<StrokeType | null>(null);

  const scene = (
    <>
      <svg className="story-svg city" viewBox="0 0 400 320" aria-hidden="true" data-focus={focus ?? ""}>
        <defs>
          <clipPath id="cityClip"><path d={BRAIN_PATH} /></clipPath>
          <linearGradient id="scanGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" style={{ stopColor: "var(--cath)", stopOpacity: 0 }} />
            <stop offset=".5" style={{ stopColor: "var(--cath)", stopOpacity: 0.35 }} />
            <stop offset="1" style={{ stopColor: "var(--cath)", stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <path className="city-base" d={BRAIN_PATH} />
        <g clipPath="url(#cityClip)">
          {DISTRICT_IDS.map((id) => (
            <polygon key={id} className="district" data-d={id} points={DISTRICTS[id].map((pt) => pt.join(",")).join(" ")} />
          ))}
          {LIGHTS.map((l) => (
            <rect key={`${l.x},${l.y}`} className="light" data-d={l.district} x={l.x - 3} y={l.y - 3} width="6" height="6" rx="1.5" />
          ))}
        </g>
        {Object.entries(ROADS).map(([id, road]) => (
          <g key={id} className="road" data-road={id}>
            <path className="road-bed" d={roadD(road)} />
            <path className="road-flow" d={roadD(road)} />
          </g>
        ))}
        <g className="queue">
          {QUEUE_AT.map(([x, y]) => <circle key={x} cx={fmt(x)} cy={fmt(y)} r="4.5" />)}
        </g>
        <circle className="clot" r="7" transform={`translate(${ROADS.frontal.from.join(" ")})`} />
        <path className="bleed" d={BLOB} transform={`translate(${fmt(BLEED_AT[0])} ${fmt(BLEED_AT[1])})`} />
        <g className="city-labels">
          {LABELS.map((l) => <text key={l.text} className="city-label" x={l.at[0]} y={l.at[1]}>{l.text}</text>)}
        </g>
        <g className="split">
          <line className="split-line" x1="210" y1="14" x2="210" y2="306" />
          <text className="split-label" x="110" y="22" textAnchor="middle">ตัน</text>
          <text className="split-label" x="310" y="22" textAnchor="middle">แตก</text>
          <rect className="scan" x="50" y="30" width="28" height="250" />
        </g>
        <rect className="focus-mask" data-side="left" x="0" y="0" width="210" height="320" />
        <rect className="focus-mask" data-side="right" x="210" y="0" width="190" height="320" />
        <g className="tia-warn" transform="translate(262 4)">
          <path d="M14,0 L28,26 H0 Z" />
          <text x="14" y="23" textAnchor="middle">!</text>
        </g>
      </svg>
      <div className="city-stats" aria-hidden="true">
        <p><span className="city-stat-num" data-stat="weight">2%</span><span>ของน้ำหนักตัว</span></p>
        <p><span className="city-stat-num alarm" data-stat="oxygen">20%</span><span>ของออกซิเจนทั้งร่างกาย</span></p>
      </div>
    </>
  );

  return (
    <StoryStage
      id="pin1"
      steps={CHAPTER_1.steps}
      scene={scene}
      setup={setup}
      stepExtra={(i) => (i === TOGGLE_STEP ? <TypeToggle value={focus} onChange={setFocus} captions={CAPTIONS} /> : null)}
    />
  );
}
```

- [ ] **Step 7: Write `src/styles/chapter-1.css`**

```css
/* Chapter 1: brain city. Scene states follow data-step (0-based) on #pin1 and data-focus on .city. */
.city-base { fill: var(--surface); stroke: var(--ink); stroke-width: 3; stroke-linejoin: round; }
.district { fill: transparent; stroke: var(--line); stroke-width: 1.5; stroke-dasharray: 3 5; transition: fill .45s; }
.light { fill: var(--pink); transition: fill .45s, opacity .45s; }
.road-bed { fill: none; stroke: var(--line); stroke-width: 8; stroke-linecap: round; }
.road-flow { fill: none; stroke: var(--red); stroke-width: 3; stroke-linecap: round; stroke-dasharray: 2 12; opacity: 0; transition: opacity .45s; }
.clot { fill: var(--red); stroke: var(--ink); stroke-width: 2; opacity: 0; transition: opacity .3s; }
.queue circle { fill: var(--red); opacity: 0; transition: opacity .3s; }
.bleed { fill: var(--red); opacity: 0; transition: opacity .3s; }
.city-label {
  font-family: var(--font); font-weight: 600; font-size: 13px; fill: var(--ink); opacity: 0;
  paint-order: stroke; stroke: var(--surface); stroke-width: 4px; stroke-linejoin: round; transition: opacity .45s;
}
.split, .tia-warn, .focus-mask { opacity: 0; transition: opacity .45s; }
.split-line { stroke: var(--ink); stroke-width: 2; stroke-dasharray: 6 6; }
.split-label { font-family: var(--font); font-weight: 700; font-size: 16px; fill: var(--ink); }
.scan { fill: url(#scanGrad); }
.focus-mask { fill: var(--paper); pointer-events: none; }
.tia-warn path { fill: var(--red); }
.tia-warn text { font-family: var(--font); font-weight: 700; font-size: 18px; fill: #fff; }

.city-stats {
  position: absolute; left: 0; bottom: 0; display: flex; gap: 18px; opacity: 0; transition: opacity .45s;
  pointer-events: none;
}
.city-stats p { display: flex; flex-direction: column; font-size: .75rem; line-height: 1.3; color: var(--ink-2); }
.city-stat-num { font-family: var(--num); font-weight: 700; font-size: 1.6rem; line-height: 1.1; color: var(--ink); font-variant-numeric: tabular-nums; }
.city-stat-num.alarm { color: var(--red); }

/* step 0: stats */
#pin1[data-step="0"] .city-stats { opacity: 1; }
/* step 1+: blood flows on every road */
#pin1:not([data-step="0"]) .road-flow { opacity: 1; }
.anim #pin1 .road-flow { animation: city-flow 1.6s linear infinite; }
@keyframes city-flow { to { stroke-dashoffset: -28; } }
/* step 1: district functions named; step 2: they fade as the frontal district goes dark */
#pin1[data-step="1"] .city-label { opacity: 1; }
#pin1[data-step="2"] .city-label { opacity: .25; }
#pin1[data-step="2"] .light[data-d="frontal"], #pin1[data-step="3"] .light[data-d="frontal"],
#pin1[data-step="5"] .light[data-d="frontal"] { fill: var(--ash); }
#pin1[data-step="2"] .district[data-d="frontal"], #pin1[data-step="3"] .district[data-d="frontal"],
#pin1[data-step="5"] .district[data-d="frontal"] { fill: var(--line); }
/* step 3: clot stuck in the frontal road, flow stops past it */
#pin1[data-step="3"] .clot, #pin1[data-step="3"] .queue circle,
#pin1[data-step="5"] .clot, #pin1[data-step="5"] .queue circle { opacity: 1; }
#pin1[data-step="3"] .road[data-road="frontal"] .road-flow,
#pin1[data-step="5"] .road[data-road="frontal"] .road-flow { opacity: 0; }
/* step 4: occipital road bursts */
#pin1[data-step="4"] .bleed, #pin1[data-step="5"] .bleed { opacity: .85; }
#pin1[data-step="4"] .light[data-d="occipital"], #pin1[data-step="5"] .light[data-d="occipital"] { fill: var(--ash); }
#pin1[data-step="4"] .district[data-d="occipital"], #pin1[data-step="5"] .district[data-d="occipital"] { fill: var(--line); }
#pin1[data-step="4"] .road[data-road="occipital"] .road-flow,
#pin1[data-step="5"] .road[data-road="occipital"] .road-flow { opacity: 0; }
/* step 5: split view + scanner; toggle dims the other half */
#pin1[data-step="5"] .split { opacity: 1; }
.anim #pin1[data-step="5"] .scan { animation: city-scan 2.4s ease-in-out infinite alternate; }
@keyframes city-scan { to { transform: translateX(270px); } }
#pin1[data-step="5"] .city[data-focus="clot"] .focus-mask[data-side="right"],
#pin1[data-step="5"] .city[data-focus="bleed"] .focus-mask[data-side="left"] { opacity: .7; }
/* step 6: TIA — parietal lights flicker off and back on */
#pin1[data-step="6"] .tia-warn { opacity: 1; }
.anim #pin1[data-step="6"] .light[data-d="parietal"] { animation: tia-flicker 2.4s steps(1) infinite; }
@keyframes tia-flicker { 0%, 100% { fill: var(--pink); } 30%, 60% { fill: var(--ash); } }

.type-toggle { margin-top: 12px; }
.type-toggle-buttons { display: inline-flex; border: 2px solid var(--ink); border-radius: 12px; overflow: hidden; }
.type-toggle-buttons button {
  min-width: 72px; min-height: 48px; padding: 0 18px; border: 0; background: var(--surface);
  font-weight: 700; cursor: pointer; transition: background .2s, color .2s;
}
.type-toggle-buttons button + button { border-left: 2px solid var(--ink); }
.type-toggle-buttons button[aria-pressed="true"] { background: var(--ink); color: var(--paper); }
.type-toggle-caption { margin-top: 8px; font-size: .9rem; line-height: 1.5; color: var(--ink-2); min-height: 3em; }

@media (min-width: 861px) {
  .city-stat-num { font-size: 2.2rem; }
  .city-stats p { font-size: .85rem; }
}
@media (orientation: landscape) and (max-height: 500px) {
  .type-toggle-buttons button { min-height: 44px; }
  .type-toggle-caption { font-size: .78rem; min-height: 0; }
  .city-stat-num { font-size: 1.2rem; }
}
@media (prefers-reduced-motion: reduce) {
  .road-flow, .scan, .light { animation: none !important; }
  #pin1[data-step="6"] .light[data-d="parietal"] { fill: var(--ash); opacity: .6; }
}
```

In `src/app/layout.tsx`, after `import "@/styles/story.css";` add `import "@/styles/chapter-1.css";`.

- [ ] **Step 8: Use the scene in `Chapter1.tsx`**

Replace the `StoryStage` line and its import:

```tsx
import { CHAPTER_1 } from "@/content/chapter-1";
import { ChapterHead } from "@/components/ui/ChapterHead";
import { BrainCity } from "./BrainCity";

export function Chapter1() {
  return (
    <section className="chapter" id="ch1" aria-labelledby="ch1-title">
      <ChapterHead chapter={CHAPTER_1} titleId="ch1-title" />
      <BrainCity />
    </section>
  );
}
```

- [ ] **Step 9: Verify**

Run:
```bash
pnpm test && pnpm lint && pnpm exec tsc --noEmit
pkill -f "next start"; pkill -f next-server; pnpm build && (pnpm start -p 3100 > .shots/server.log 2>&1 &) ; sleep 3
pnpm shots capture --out .shots/t6
pnpm shots capture --out .shots/t6-reduce --vp 390x844 --reduce
```
Expected: all `no overflow`, no `ERRORS`. Inspect `.shots/t6/390x844-pin1-0.1.png` (all pink lights, 2%/20% stats), `-0.5.png` (step 4: clot on the frontal road with red dots behind it, frontal lights grey), `-0.9.png` (step 7: warning triangle, parietal lights). Inspect `.shots/t6/1280x800-pin1-0.5.png` (scene left, text right) and `.shots/t6/740x360-pin1-0.5.png` (side by side, nothing clipped).

Check the toggle (step 6 sits at progress 0.70–0.85):
```bash
node --input-type=module -e '
import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const p = await b.newPage(); await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await p.goto("http://localhost:3100/", { waitUntil: "networkidle0" });
await p.evaluate(() => { const s = document.getElementById("pin1").parentElement; window.scrollTo(0, s.getBoundingClientRect().top + scrollY + (s.offsetHeight - innerHeight) * 0.77); });
await new Promise((r) => setTimeout(r, 1500));
await p.evaluate(() => [...document.querySelectorAll(".type-toggle button")].find((x) => x.textContent === "แตก").click());
await new Promise((r) => setTimeout(r, 600));
console.log(await p.evaluate(() => ({ step: document.getElementById("pin1").dataset.step, focus: document.querySelector(".city").dataset.focus, pressed: [...document.querySelectorAll(".type-toggle button")].map((x) => x.getAttribute("aria-pressed")), caption: document.querySelector(".type-toggle-caption").textContent.slice(0, 20) })));
await p.screenshot({ path: ".shots/t6/toggle-bleed.png" }); await b.close();'
```
Expected: `{ step: '5', focus: 'bleed', pressed: [ 'false', 'true' ], caption: 'หลอดเลือดในสมองแตก …' }`; `toggle-bleed.png` shows the left half dimmed.

- [ ] **Step 10: Commit**

```bash
git add src/lib/brain-city.ts src/lib/brain-city.test.ts src/components/chapter-1 src/styles/chapter-1.css src/app/layout.tsx
git commit -m "feat: add chapter 1 brain-city scene with clot/bleed toggle

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Chapter 2 scene — risk icons, 1-in-4 people and self check

**Files:**
- Create: `src/lib/pick.ts`, `src/lib/pick.test.ts`, `src/components/chapter-2/RiskIcons.tsx`, `src/components/chapter-2/RiskStage.tsx`, `src/components/chapter-2/SelfCheck.tsx`, `src/styles/chapter-2.css`
- Modify: `src/components/chapter-2/Chapter2.tsx`, `src/app/layout.tsx`

**Interfaces:**
- Consumes: `StoryStage`, `PinnedScene` (Task 5), `stepProgress` (Task 3), `CHAPTER_2`, `SELF_CHECK` (Task 3).
- Produces: `pickOther(prev: number, n: number, rand?: () => number): number`; `type RiskKind = "food" | "drugs" | "pm25" | "filler" | "stress"`; `RISK_KINDS: readonly RiskKind[]` (order = chapter 2 steps 3–7 = `SELF_CHECK.options` ids); `<RiskIcon kind />`.

Scene states (`data-step` on `#pin2`): 0 four people, one random person red with a pulse line, "1 ใน 4"; 1 young silhouette, icons fly in one by one with scroll; 2–6 icon `RISK_KINDS[step - 2]` enlarged with a red ring, others faded.

- [ ] **Step 1: Write the failing test `src/lib/pick.test.ts`**

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { pickOther } from "./pick.ts";

test("pickOther covers the whole range when there is no previous pick", () => {
  assert.equal(pickOther(-1, 4, () => 0), 0);
  assert.equal(pickOther(-1, 4, () => 0.999), 3);
});

test("pickOther never returns the previous pick", () => {
  for (const r of [0, 0.2, 0.5, 0.7, 0.999]) assert.notEqual(pickOther(2, 4, () => r), 2);
});

test("pickOther skips over the previous pick", () => {
  assert.equal(pickOther(2, 4, () => 0), 0);
  assert.equal(pickOther(2, 4, () => 0.7), 3);
});

test("pickOther with a single option returns it", () => {
  assert.equal(pickOther(0, 1, () => 0.5), 0);
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `pnpm test`
Expected: FAIL — cannot find `pick.ts`.

- [ ] **Step 3: Implement `src/lib/pick.ts`**

```ts
/** Random index in [0, n) that differs from `prev` (any index when prev is -1). */
export function pickOther(prev: number, n: number, rand: () => number = Math.random): number {
  if (n <= 1) return 0;
  if (prev < 0 || prev >= n) return Math.floor(rand() * n);
  const i = Math.floor(rand() * (n - 1));
  return i >= prev ? i + 1 : i;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 5: Write `src/components/chapter-2/RiskIcons.tsx`**

```tsx
/** Risk-factor pictograms for chapter 2, drawn around (0,0) inside a 30-unit badge. */
export type RiskKind = "food" | "drugs" | "pm25" | "filler" | "stress";

/** Order matches chapter 2 steps 3–7 and SELF_CHECK option ids. */
export const RISK_KINDS: readonly RiskKind[] = ["food", "drugs", "pm25", "filler", "stress"];

export function RiskIcon({ kind }: { kind: RiskKind }) {
  switch (kind) {
    case "food": // burger: sweet, fatty, salty
      return (
        <g>
          <path className="ri-fill" d="M-18,-4 C-18,-16 18,-16 18,-4 Z" />
          <rect className="ri-accent" x="-19" y="-2" width="38" height="6" rx="3" />
          <rect className="ri-fill" x="-18" y="6" width="36" height="7" rx="3.5" />
        </g>
      );
    case "drugs": // cigarette with smoke
      return (
        <g>
          <rect className="ri-fill" x="-20" y="4" width="32" height="8" rx="2" />
          <rect className="ri-accent" x="12" y="4" width="8" height="8" rx="2" />
          <path className="ri-line" d="M16,0 C10,-6 22,-10 16,-18" />
          <path className="ri-line" d="M8,-2 C4,-8 12,-11 8,-17" />
        </g>
      );
    case "pm25": // factory and dust
      return (
        <g>
          <path className="ri-fill" d="M-20,16 V-2 L-10,4 V-2 L0,4 V-12 H8 V16 Z" />
          <circle className="ri-accent" cx="14" cy="-14" r="3" />
          <circle className="ri-accent" cx="20" cy="-5" r="2" />
          <circle className="ri-accent" cx="8" cy="-20" r="2" />
        </g>
      );
    case "filler": // syringe
      return (
        <g transform="rotate(-45)">
          <rect className="ri-fill" x="-14" y="-5" width="22" height="10" rx="2" />
          <rect className="ri-accent" x="-10" y="-3" width="10" height="6" />
          <path className="ri-line" d="M8,0 H20 M-14,-8 V8 M-20,0 H-14" />
        </g>
      );
    case "stress": // frowning face and moon
      return (
        <g>
          <circle className="ri-outline" cx="-4" cy="4" r="14" />
          <path className="ri-line" d="M-11,-1 l5,2 M3,-1 l-5,2 M-10,11 q6,-5 12,0" />
          <path className="ri-accent" d="M18,-20 a9,9 0 1 0 6,14 a7,7 0 1 1 -6,-14 Z" />
        </g>
      );
  }
}
```

- [ ] **Step 6: Write `src/components/chapter-2/RiskStage.tsx`**

```tsx
"use client";

import { gsap } from "gsap";
import { CHAPTER_2 } from "@/content/chapter-2";
import { StoryStage } from "@/components/ui/StoryStage";
import type { PinnedScene } from "@/hooks/usePinnedSteps";
import { pickOther } from "@/lib/pick";
import { stepProgress } from "@/lib/steps";
import { RISK_KINDS, RiskIcon, type RiskKind } from "./RiskIcons";

const STARTS = CHAPTER_2.steps.map((s) => s.at);
const PEOPLE_X = [80, 160, 240, 320];
const ICONS_STEP = 1;
const FIRST_RISK_STEP = 2;
const ICON_AT: Record<RiskKind, readonly [number, number]> = {
  food: [200, 52],
  drugs: [86, 110],
  pm25: [314, 110],
  filler: [96, 236],
  stress: [304, 236],
};
const pulseAt = (i: number) => `translate(${PEOPLE_X[i] - 26} 82)`;

function setup(pin: HTMLElement, reduce: boolean): PinnedScene {
  const people = Array.from(pin.querySelectorAll<SVGGElement>(".person"));
  const pulse = pin.querySelector<SVGPathElement>(".pulse")!;
  const icons = Array.from(pin.querySelectorAll<SVGGElement>(".risk-icon"));
  let chosen = -1;
  return {
    onStep(step) {
      if (step === 0) {
        // a different person each time the reader scrolls back here: "it could be anyone"
        chosen = pickOther(chosen, people.length);
        people.forEach((g, i) => g.classList.toggle("chosen", i === chosen));
        pulse.setAttribute("transform", pulseAt(chosen));
        if (!reduce) gsap.fromTo(pulse, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: "power2.out" });
      }
      icons.forEach((g, i) => g.classList.toggle("focus", step >= FIRST_RISK_STEP && i === step - FIRST_RISK_STEP));
    },
    render(p, step) {
      const t = step < ICONS_STEP ? 0 : step > ICONS_STEP || reduce ? 1 : stepProgress(p, STARTS, ICONS_STEP);
      icons.forEach((g, i) => g.classList.toggle("in", t > i / icons.length));
    },
  };
}

export function RiskStage() {
  const scene = (
    <svg className="story-svg risk" viewBox="0 0 400 320" aria-hidden="true">
      <g className="people">
        {PEOPLE_X.map((x, i) => (
          <g key={x} className={i === 0 ? "person chosen" : "person"} transform={`translate(${x} 150)`}>
            <circle cy="-46" r="16" />
            <path d="M-24,40 V0 C-24,-18 -14,-26 0,-26 C14,-26 24,-18 24,0 V40 Z" />
          </g>
        ))}
        <path className="pulse" pathLength={1} strokeDasharray="1" d="M0,0 H14 L20,-12 L28,14 L34,-6 L38,0 H52" transform={pulseAt(0)} />
        <text className="risk-big" x="200" y="282" textAnchor="middle">
          <tspan className="risk-big-num">1</tspan>
          <tspan dx="10">ใน</tspan>
          <tspan dx="10" className="risk-big-num alarm">4</tspan>
        </text>
      </g>
      <g className="youth" transform="translate(200 170)">
        <circle className="youth-fill" cy="-40" r="18" />
        <path className="youth-fill" d="M-26,40 V-4 C-26,-16 -16,-20 0,-20 C16,-20 26,-16 26,-4 V40 Z" />
        <rect className="youth-fill" x="-20" y="36" width="16" height="56" rx="8" />
        <rect className="youth-fill" x="4" y="36" width="16" height="56" rx="8" />
      </g>
      {RISK_KINDS.map((k) => (
        <g key={k} className="risk-icon" data-k={k} transform={`translate(${ICON_AT[k][0]} ${ICON_AT[k][1]})`}>
          <g className="risk-icon-inner">
            <circle className="ri-badge" r="30" />
            <RiskIcon kind={k} />
          </g>
        </g>
      ))}
    </svg>
  );

  return <StoryStage id="pin2" steps={CHAPTER_2.steps} scene={scene} setup={setup} />;
}
```

- [ ] **Step 7: Write `src/components/chapter-2/SelfCheck.tsx`**

```tsx
"use client";

import { useState } from "react";
import { SELF_CHECK } from "@/content/chapter-2";

/** "Which applies to you?" — no score, nothing stored or sent; selections live in this component only. */
export function SelfCheck() {
  const [picked, setPicked] = useState<readonly string[]>([]);
  const toggle = (id: string) =>
    setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <section className="self-check" aria-labelledby="self-check-title">
      <h3 id="self-check-title">{SELF_CHECK.title}</h3>
      <p className="self-check-hint">{SELF_CHECK.hint}</p>
      <div className="self-check-options">
        {SELF_CHECK.options.map((o) => (
          <button key={o.id} type="button" aria-pressed={picked.includes(o.id)} onClick={() => toggle(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
      <p className="self-check-answer" aria-live="polite">{picked.length > 0 ? SELF_CHECK.answer : ""}</p>
    </section>
  );
}
```

- [ ] **Step 8: Write `src/styles/chapter-2.css`**

```css
/* Chapter 2: risk stage + self check. Scene states follow data-step (0-based) on #pin2. */
.person circle, .person path { fill: var(--ash); transition: fill .4s; }
.person.chosen circle, .person.chosen path { fill: var(--red); }
.pulse { fill: none; stroke: var(--red); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
.risk-big { font-family: var(--font); font-weight: 700; font-size: 26px; fill: var(--ink); }
.risk-big-num { font-family: var(--num); font-size: 46px; }
.risk-big-num.alarm { fill: var(--red); }
.people, .youth, .risk-icon { transition: opacity .45s; }
.youth, .risk-icon { opacity: 0; }
.youth-fill { fill: var(--ink); }
#pin2:not([data-step="0"]) .people { opacity: 0; }
#pin2:not([data-step="0"]) .youth { opacity: 1; }
#pin2[data-step="1"] .risk-icon.in { opacity: 1; }
#pin2:not([data-step="0"]):not([data-step="1"]) .risk-icon { opacity: .3; }
#pin2:not([data-step="0"]):not([data-step="1"]) .risk-icon.focus { opacity: 1; }
.ri-badge { fill: var(--surface); stroke: var(--ink); stroke-width: 2.5; transition: stroke .4s; }
.risk-icon.focus .ri-badge { stroke: var(--red); stroke-width: 3.5; }
.risk-icon-inner { transform-box: fill-box; transform-origin: center; transition: transform .4s; }
.risk-icon.focus .risk-icon-inner { transform: scale(1.3); }
.ri-fill { fill: var(--ink-2); }
.ri-accent { fill: var(--red); }
.ri-line { fill: none; stroke: var(--ink-2); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.ri-outline { fill: var(--surface); stroke: var(--ink-2); stroke-width: 2.5; }

.self-check { max-width: 860px; margin: 0 auto; padding: 12vh clamp(20px, 6vw, 40px) 8vh; }
.self-check h3 { font-size: clamp(1.9rem, 4.6vw, 3rem); margin-bottom: .3em; }
.self-check-hint { color: var(--ink-2); margin-bottom: 1.2em; }
.self-check-options { display: flex; flex-wrap: wrap; gap: 10px; }
.self-check-options button {
  min-height: 48px; padding: 10px 18px; border-radius: 12px; border: 2px solid var(--ink); background: var(--surface);
  font-weight: 600; text-align: left; cursor: pointer; transition: background .2s, color .2s, border-color .2s;
}
.self-check-options button[aria-pressed="true"] { background: var(--ink); color: var(--paper); }
@media (hover: hover) and (pointer: fine) {
  .self-check-options button:hover { border-color: var(--red); }
}
.self-check-answer { margin-top: 18px; min-height: 1.65em; font-weight: 600; color: var(--ink); }

@media (prefers-reduced-motion: reduce) {
  .risk-icon-inner { transition: none; }
}
```

In `src/app/layout.tsx`, after `import "@/styles/chapter-1.css";` add `import "@/styles/chapter-2.css";`.

- [ ] **Step 9: Use the scene and self check in `Chapter2.tsx`**

```tsx
import { CHAPTER_2 } from "@/content/chapter-2";
import { ChapterHead } from "@/components/ui/ChapterHead";
import { RiskStage } from "./RiskStage";
import { SelfCheck } from "./SelfCheck";

export function Chapter2() {
  return (
    <section className="chapter" id="ch2" aria-labelledby="ch2-title">
      <ChapterHead chapter={CHAPTER_2} titleId="ch2-title" reverse />
      <RiskStage />
      <SelfCheck />
    </section>
  );
}
```

- [ ] **Step 10: Verify**

Run:
```bash
pnpm test && pnpm lint && pnpm exec tsc --noEmit
pkill -f "next start"; pkill -f next-server; pnpm build && (pnpm start -p 3100 > .shots/server.log 2>&1 &) ; sleep 3
pnpm shots capture --out .shots/t7
```
Expected: all `no overflow`, no `ERRORS`. Inspect `.shots/t7/390x844-pin2-0.1.png` (4 people, one red with pulse, "1 ใน 4"), `-0.5.png` (step 4: silhouette, cigarette icon enlarged with red ring, others faded), `-0.9.png` (step 7: stress icon focused).

Check the self check:
```bash
node --input-type=module -e '
import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const p = await b.newPage(); await p.goto("http://localhost:3100/", { waitUntil: "networkidle0" });
const answer = () => p.$eval(".self-check-answer", (e) => e.textContent);
const before = await answer();
await p.click(".self-check-options button");
const after = await answer();
await p.click(".self-check-options button");
console.log(JSON.stringify({ before, after, again: await answer() })); await b.close();'
```
Expected: `{"before":"","after":"ทุกข้อแก้ไขได้ อ่านต่อในบทที่ 6 และ 7","again":""}`.

- [ ] **Step 11: Commit**

```bash
git add src/lib/pick.ts src/lib/pick.test.ts src/components/chapter-2 src/styles/chapter-2.css src/app/layout.tsx
git commit -m "feat: add chapter 2 risk scene and self check

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Campaign footer, docs, illustration prompts and full verification

**Files:**
- Create: `src/components/CampaignFooter.tsx`, `docs/illustration-prompts.md`
- Modify: `src/app/page.tsx`, `src/app/globals.css`, `AGENTS.md`, `DESIGN.md`, `docs/medical-review.md` (regenerate)
- Delete: `src/components/SiteFooter.tsx`

**Interfaces:**
- Consumes: logo `LOGO_W × LOGO_H` (Task 2), `OPENING.logoAlt` (Task 3), `.site-footer` styles (existing).

- [ ] **Step 1: Write `src/components/CampaignFooter.tsx`** (replace `LOGO_W`/`LOGO_H` with the Task 2 numbers)

```tsx
import Image from "next/image";
import { OPENING } from "@/content/opening";

/** Sources and disclaimer, then the navy Walk Run Bike 12 band (as on the campaign posters). */
export function CampaignFooter() {
  return (
    <footer>
      <div className="site-footer">
        <p>
          <strong>แหล่งข้อมูล</strong> บทสัมภาษณ์ รศ.นพ.ยงชัย นิละนนท์ ประธานศูนย์โรคหลอดเลือดสมองศิริราช
          รายการบ่ายนี้มีคำตอบ ช่อง MCOT HD ออกอากาศ 14 สิงหาคม 2569 ตัวเลข “สมองแก่ลงราว 3.6 ปีต่อชั่วโมง”
          อ้างอิงงานวิจัย Saver JL (2006) Time is Brain—Quantified
        </p>
        <p>เนื้อหานี้เพื่อการเรียนรู้ ไม่ใช้แทนคำแนะนำของแพทย์ หากสงสัยว่ามีอาการ โทร 1669 ทันที</p>
      </div>
      <div className="campaign-band">
        <div className="campaign-band-inner">
          <Image src="/brand/wrb12-on-navy.webp" alt={OPENING.logoAlt} width={LOGO_W} height={LOGO_H} className="campaign-logo" />
          <p>
            แสงนำใจไทยทั้งชาติ
            <br />
            เดิน วิ่ง ปั่น ป้องกันอัมพาต
            <br />
            ครั้งที่ 12 เฉลิมพระเกียรติ
          </p>
        </div>
      </div>
    </footer>
  );
}
```

Delete the old footer: `git rm src/components/SiteFooter.tsx`. In `src/app/page.tsx` replace the `SiteFooter` import and element with `CampaignFooter` from `@/components/CampaignFooter`.

- [ ] **Step 2: Footer styles in `src/app/globals.css`**

In the `.site-footer { … }` rule change `padding: 5vh clamp(20px, 6vw, 40px) 10vh;` to `padding: 5vh clamp(20px, 6vw, 40px) 6vh;`. After the `.site-footer strong` rule add:

```css
.campaign-band {
  background: var(--brand-navy); color: var(--on-brand);
  padding: 32px clamp(20px, 6vw, 40px) calc(32px + env(safe-area-inset-bottom, 0px));
}
.campaign-band-inner { max-width: 860px; margin: 0 auto; display: flex; align-items: center; gap: 18px; }
.campaign-logo { width: 112px; height: auto; flex: none; display: block; }
.campaign-band p { font-size: .9rem; line-height: 1.5; color: var(--on-brand); }
```

- [ ] **Step 3: Write `docs/illustration-prompts.md`**

````markdown
# Prompt ภาพหัวบท

ภาพหัวบทบทที่ 3–4 (`public/illustrations/chapter-3-*.webp`, `chapter-4-*.webp`) เป็นภาพสีน้ำโทนฟ้าอ่อน ใช้ prompt ด้านล่างสร้างภาพของบทที่ 1–2 ให้เข้าชุดกัน

**ข้อกำหนดร่วม:** 1536×1024 (3:2), บันทึกเป็น `.webp` คุณภาพ ~85, ไม่มีตัวหนังสือ ตัวเลข หรือโลโก้ในภาพ, เว้นพื้นที่ว่างรอบขอบเพราะภาพถูกครอปเป็นทรงใบไม้ (มุมโค้ง 88px)

## บทที่ 1: สโตรกคืออะไร → `public/illustrations/chapter-1-what-is-stroke.webp`

```
Soft watercolor editorial illustration on pale blue-white paper (#F3F7FC) with layered light-blue
washes. A human brain seen from the side, painted as a calm night-time city map: districts with
tiny warm pink window lights, blood vessels drawn as red roads flowing up from the neck into each
district. One district on the left has gone dark grey, its lights out. Accent colours: deep navy
#13235A, alarm red #D3222D, soft pink #EE7C86, ash grey #A7AFC0. Calm, clinical, hopeful mood,
clean composition, generous empty space around the edges. No text, no letters, no numbers, no logos.
```

## บทที่ 2: ใกล้ตัวกว่าที่คิด → `public/illustrations/chapter-2-closer-than-you-think.webp`

```
Soft watercolor editorial illustration on pale blue-white paper (#F3F7FC) with layered light-blue
washes. A Thai city street in the early evening with people of different ages walking together:
a teenager, a young office worker, a middle-aged parent and an elderly person. One young adult is
subtly outlined in alarm red #D3222D. Faint everyday motifs float in the background: a fast-food
tray, a thin curl of cigarette smoke, light PM2.5 haze over buildings, a phone glowing late at night.
Accent colours: deep navy #13235A, alarm red #D3222D, soft pink #EE7C86. Warm but alert mood,
generous empty space around the edges. No text, no letters, no numbers, no logos.
```

## ใส่ภาพเข้าเว็บ

1. วางไฟล์ไว้ตาม path ด้านบน
2. เพิ่ม `image: "/illustrations/<ชื่อไฟล์>.webp"` ใน `CHAPTER_1` หรือ `CHAPTER_2` (`src/content/chapter-1.ts`, `chapter-2.ts`)
3. รัน `pnpm build` แล้วตรวจหัวบทบนจอ 360px และ 1280px
````

- [ ] **Step 4: Update `AGENTS.md`**

Replace the bullet list that starts with `- หน้าแรกย้ายมาเป็น Next.js 16 แล้ว` (and its 3 sub-bullets) with:

```markdown
- หน้าเว็บเป็น Next.js 16 (App Router, TypeScript, `src/`, ESLint, ไม่ใช้ Tailwind) มีบทเปิด บทที่ 1–4 และ footer แบรนด์แคมเปญ Walk Run Bike 12
  - เนื้อหาบทเปิดและบท 1–2 อยู่ใน `src/content/` (ข้อความ ★ มีฟิลด์ `review`) บทที่ 3–4 ยังเขียนในคอมโพเนนต์
  - ตรรกะที่ทดสอบได้อยู่ใน `src/lib/` (มี `*.test.ts`) ฉากที่ pin ของบท 1–2 ใช้ `StoryStage` + `usePinnedSteps` สถานะฉากควบคุมด้วย `data-step` บน `.pin`
  - `src/components/`: `opening/`, `chapter-1/` ถึง `chapter-4/`, `ui/` (`StoryStage`, `ChapterHead`, `ChapterVisual`, `ProgressBar`), `CampaignFooter`
  - CSS: `src/app/globals.css` (token และสไตล์ร่วม), `src/styles/opening.css`, `story.css`, `chapter-1.css` ถึง `chapter-4.css`
  - ภาพอยู่ใน `public/illustrations/` และ `public/brand/` ภาพหัวบทที่ 1–2 ยังไม่มี (ดู `docs/illustration-prompts.md`) ส่วน `index.html` และ `assets/` เก็บไว้เป็นต้นฉบับอ้างอิง
```

In the commands code block, after `pnpm lint        # ESLint` add:

```
  pnpm test        # unit tests (node --test)
  pnpm content:review  # สร้าง docs/medical-review.md ใหม่หลังแก้ src/content/
  pnpm shots capture --out .shots/x   # ถ่ายภาพทุกฉากที่ pin + ตรวจเนื้อหาล้น (ต้องเปิด pnpm start -p 3100 ก่อน)
```

In `## เนื้อหาทางการแพทย์ (ห้ามพลาด)` add a bullet:

```markdown
- ข้อความในบท 1–2 ที่มี ★ ในสคริปต์ต้องมี `review` ใน `src/content/` และต้องรัน `pnpm content:review` ทุกครั้งที่แก้ เพื่อให้ `docs/medical-review.md` ตรงกับหน้าเว็บ
```

- [ ] **Step 5: Update `DESIGN.md` › Components**

Before the line `## Do's and Don'ts` add:

```markdown
### Opening (Signature)
พื้น `brand-navy` สูงเต็มจอ มีโลโก้แคมเปญ สมองจุดแสง (canvas 600 จุดบนมือถือ, 1,000 จุดบน desktop, seed คงที่) ที่ดับลงทีละจุดเมื่อเลื่อนออกจากบท (เหลือ 15%) และตัวนับเซลล์สมองที่นับจากเวลาที่เปิดหน้า (31,667 เซลล์ต่อวินาที) เขียนลง DOM ไม่เกิน 10 ครั้งต่อวินาที

### Story Stage (บทที่ 1–2)
ฉาก pin ยาว 600% ของจอ มีข้อความ 7 ขั้น ใช้ `.steps`/`.step` แบบเดียวกับบทที่ 3 สถานะภาพควบคุมด้วย `data-step` (เริ่มที่ 0) บน `.pin` ภาพ SVG สูง `clamp(180px, 40svh, 320px)` บนมือถือ ถึง `min(64vh, 520px)` บน desktop

### Brain City (บทที่ 1)
สมองด้านข้างเป็นเมือง ไฟหน้าต่าง `pink` = เซลล์ที่ทำงาน, `ash` = ดับ, ถนนคือหลอดเลือดที่มีจุดเลือด `red` ไหล ลิ่มเลือดและเลือดที่รั่วใช้ `red` มีปุ่มสลับ "ตัน / แตก" (สูง 48px, `aria-pressed`)

### Risk Icons และ Self Check (บทที่ 2)
ไอคอนในวงกลม `surface` ขอบ `ink` เมื่อเป็นเรื่องที่กำลังพูดถึงจะขยาย 1.3 เท่าและขอบเป็น `red` แบบสำรวจท้ายบทเป็นปุ่มเลือกได้หลายข้อ (โค้ง 12px, สูงอย่างน้อย 48px) ไม่มีคะแนน และไม่เก็บข้อมูล

### Campaign Footer
แหล่งข้อมูลและคำเตือนบนพื้น `paper` แล้วตามด้วยแถบ `brand-navy` ที่มีโลโก้และข้อความแคมเปญ
```

- [ ] **Step 6: Regenerate the review report and run the full verification**

Run:
```bash
pnpm content:review
pnpm test && pnpm lint && pnpm exec tsc --noEmit
pkill -f "next start"; pkill -f next-server; pnpm build && (pnpm start -p 3100 > .shots/server.log 2>&1 &) ; sleep 3
pnpm shots capture --out .shots/final
pnpm shots capture --out .shots/final-dark --vp 390x844,1280x800 --scheme dark
pnpm shots capture --out .shots/final-reduce --vp 360x640,390x844,1280x800 --reduce
pnpm shots compare .shots/baseline .shots/final-reduce --only pin3,pin4
```
Expected:
- tests, lint, tsc pass; build succeeds
- every `capture` line says `no overflow` with no `ERRORS`
- `compare` prints `compared 18 files` and `worst` ≤ 0.50% (chapters 3–4 unchanged; small differences come only from image resampling)
- Inspect `.shots/final-dark/390x844-top.png` (opening identical to light), `.shots/final-dark/390x844-pin1-0.5.png` and `-pin2-0.5.png` (scenes readable on dark paper), and scroll check the footer:

```bash
node --input-type=module -e '
import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const p = await b.newPage(); await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await p.goto("http://localhost:3100/", { waitUntil: "networkidle0" });
await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
await new Promise((r) => setTimeout(r, 800));
await p.screenshot({ path: ".shots/final/390x844-footer.png" }); await b.close();'
```
`390x844-footer.png` shows the sources, then the navy band with logo and the three campaign lines.

If any check fails, fix it and re-run the whole step before committing.

- [ ] **Step 7: Commit**

```bash
git add src/components/CampaignFooter.tsx src/app/page.tsx src/app/globals.css docs/illustration-prompts.md docs/medical-review.md AGENTS.md DESIGN.md
git commit -m "feat: add campaign footer, illustration prompts and docs for chapters 1-2

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```
