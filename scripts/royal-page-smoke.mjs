import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";

const url = process.argv[2] ?? "http://localhost:3100/";
const executablePath =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const browser = await puppeteer.launch({ executablePath, headless: true });

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(url, { waitUntil: "networkidle0" });

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
  assert.ok(
    result.royalTop !== undefined &&
      result.openingTop !== undefined &&
      result.royalTop < result.openingTop,
  );

  await page.waitForSelector(".royal-gallery.is-enhanced");
  const enhancedLayout = await page.evaluate(() => ({
    inlineMedia: getComputedStyle(document.querySelector(".royal-duty-media")).display,
    stickyVisual: getComputedStyle(document.querySelector(".royal-gallery-visual")).display,
  }));
  assert.equal(enhancedLayout.inlineMedia, "none");
  assert.notEqual(enhancedLayout.stickyVisual, "none");

  await page.evaluate(() =>
    document.querySelector('[data-royal-duty="1"]')?.scrollIntoView({ block: "center" }),
  );
  await page.waitForFunction(() =>
    document.querySelector(".royal-gallery-state:nth-child(2)")?.classList.contains("is-active"),
  );

  const noJsPage = await browser.newPage();
  await noJsPage.setViewport({ width: 1280, height: 800 });
  await noJsPage.setJavaScriptEnabled(false);
  await noJsPage.goto(url, { waitUntil: "networkidle0" });
  const noJsResult = await noJsPage.evaluate(() => ({
    duties: document.querySelectorAll("[data-royal-duty]").length,
    images: document.querySelectorAll(".royal-duty-media img").length,
    inlineMedia: getComputedStyle(document.querySelector(".royal-duty-media")).display,
  }));

  assert.equal(noJsResult.duties, 3);
  assert.ok(noJsResult.images >= 4);
  assert.notEqual(noJsResult.inlineMedia, "none");

  const reducedPage = await browser.newPage();
  await reducedPage.setViewport({ width: 1280, height: 800 });
  await reducedPage.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await reducedPage.goto(url, { waitUntil: "networkidle0" });
  await reducedPage.waitForSelector(".royal-gallery.is-enhanced");
  const transitionDuration = await reducedPage.$eval(
    ".royal-gallery-state",
    (el) => getComputedStyle(el).transitionDuration,
  );
  assert.equal(transitionDuration, "0s");
  console.log("royal prelude smoke: JavaScript-on and JavaScript-off assertions passed");
} finally {
  await browser.close();
}
