import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";

const url = process.argv[2] ?? "http://localhost:3100/";
const executablePath =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const browser = await puppeteer.launch({ executablePath, headless: true });

try {
  const page = await browser.newPage();
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

  const noJsPage = await browser.newPage();
  await noJsPage.setJavaScriptEnabled(false);
  await noJsPage.goto(url, { waitUntil: "networkidle0" });
  const noJsResult = await noJsPage.evaluate(() => ({
    duties: document.querySelectorAll("[data-royal-duty]").length,
    images: document.querySelectorAll(".royal-duty-media img").length,
  }));

  assert.equal(noJsResult.duties, 3);
  assert.ok(noJsResult.images >= 4);
  console.log("royal prelude smoke: JavaScript-on and JavaScript-off assertions passed");
} finally {
  await browser.close();
}
