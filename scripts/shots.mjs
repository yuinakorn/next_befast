// Visual check for the scrollytelling page.
//   node scripts/shots.mjs capture --url http://localhost:3100/ --out .shots/after [--vp 360x640,1280x800] [--scheme dark] [--reduce]
//   node scripts/shots.mjs compare .shots/before .shots/after [--only pin3,pin4]
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";
import pngjs from "pngjs";
import pixelmatch from "pixelmatch";
import { ROYAL_SHOT_TARGETS } from "./royal-shot-targets.mjs";

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

async function horizontalOverflow(page) {
  return page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }));
}

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

    const initialWidth = await horizontalOverflow(page);
    if (initialWidth.width - initialWidth.viewport > 1) {
      lines.push(`PAGE OVERFLOW ${initialWidth.width}px > ${initialWidth.viewport}px`);
    }

    for (const target of ROYAL_SHOT_TARGETS) {
      const found = await page.evaluate((selector) => {
        const el = document.querySelector(selector);
        if (!el) return false;
        const top = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo(0, Math.max(0, Math.round(top - 12)));
        return true;
      }, target.selector);

      if (!found) {
        errors.push(`missing Royal screenshot target: ${target.selector}`);
        continue;
      }

      await page.evaluate(() => document.fonts.ready);
      await page.waitForNetworkIdle({ idleTime: 200, timeout: 5000 });
      await wait(500);
      await page.screenshot({ path: path.join(outDir, `${tag}-${target.id}.png`) });

      const width = await horizontalOverflow(page);
      if (width.width - width.viewport > 1) {
        lines.push(`${target.id} PAGE OVERFLOW ${width.width}px > ${width.viewport}px`);
      }
    }

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
