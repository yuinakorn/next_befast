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
    openingH2s: [...document.querySelectorAll(".opening h2")].map((el) => el.textContent?.trim()),
    firstSection: document.querySelector("main, body")?.querySelector("section, header")?.id,
    duties: document.querySelectorAll("[data-royal-duty]").length,
    progressAway: document.querySelector(".progress")?.classList.contains("is-away"),
    royalTop: document.querySelector("#royal-prelude")?.getBoundingClientRect().top,
    openingTop: document.querySelector(".opening")?.getBoundingClientRect().top,
  }));

  assert.deepEqual(result.h1s, ["แสงแห่งพระบารมี"]);
  assert.deepEqual(result.openingH2s, ["ทุกนาทีที่ช้าคือสมองที่สูญเสีย"]);
  assert.equal(result.firstSection, "royal-prelude");
  assert.equal(result.duties, 3);
  assert.equal(result.progressAway, true);
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

  await page.evaluate(() => {
    const pin = document.querySelector("#pin4");
    const spacer = pin?.parentElement?.classList.contains("pin-spacer") ? pin.parentElement : pin;
    if (!spacer) return;
    const top = spacer.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, Math.round(top + (spacer.offsetHeight - window.innerHeight) * 0.1));
  });
  await new Promise((resolve) => setTimeout(resolve, 500));
  const firstBefastLetter = await page.$eval("#pin4 .letters button.on", (el) => el.textContent);
  assert.equal(firstBefastLetter, "B");

  for (const viewport of [
    { width: 360, height: 640 },
    { width: 1280, height: 800 },
  ]) {
    const noJsPage = await browser.newPage();
    await noJsPage.setViewport(viewport);
    await noJsPage.setJavaScriptEnabled(false);
    await noJsPage.goto(url, { waitUntil: "networkidle0" });
    const noJsResult = await noJsPage.evaluate(() => ({
      duties: document.querySelectorAll("[data-royal-duty]").length,
      images: document.querySelectorAll(".royal-duty-media img").length,
      inlineMedia: getComputedStyle(document.querySelector(".royal-duty-media")).display,
      copy: document.querySelector("#royal-duties")?.textContent,
    }));

    assert.equal(noJsResult.duties, 3);
    assert.ok(noJsResult.images >= 4);
    assert.notEqual(noJsResult.inlineMedia, "none");
    for (const phrase of ["การทรงจักรยาน", "อะเมซิ่ง ไทยแลนด์ มาราธอน แบงค็อก 2024", "Bike for Dad"]) {
      assert.ok(noJsResult.copy?.includes(phrase));
    }
  }

  const observerFallbackPage = await browser.newPage();
  await observerFallbackPage.setViewport({ width: 1280, height: 800 });
  await observerFallbackPage.evaluateOnNewDocument(() => {
    Object.defineProperty(window, "IntersectionObserver", {
      configurable: true,
      value: undefined,
    });
  });
  await observerFallbackPage.goto(url, { waitUntil: "networkidle0" });
  const observerFallback = await observerFallbackPage.evaluate(() => ({
    duties: document.querySelectorAll("[data-royal-duty]").length,
    enhanced: document.querySelector(".royal-gallery")?.classList.contains("is-enhanced"),
    inlineMedia: getComputedStyle(document.querySelector(".royal-duty-media")).display,
  }));
  assert.equal(observerFallback.duties, 3);
  assert.equal(observerFallback.enhanced, false);
  assert.notEqual(observerFallback.inlineMedia, "none");

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
