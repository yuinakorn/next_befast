import { test } from "node:test";
import assert from "node:assert/strict";
import { shareOrCopy, shareUrl, type ShareData } from "./share.ts";

const data: ShareData = { title: "t", text: "x", url: "https://example.test/" };
const abort = () => Object.assign(new Error("closed"), { name: "AbortError" });

test("uses the share sheet when there is one", async () => {
  let got: ShareData | undefined;
  const out = await shareOrCopy({ share: async (d) => void (got = d) }, data);
  assert.equal(out, "shared");
  assert.deepEqual(got, data);
});

test("copies the link when there is no share sheet", async () => {
  let copied = "";
  const out = await shareOrCopy({ clipboard: { writeText: async (s) => void (copied = s) } }, data);
  assert.equal(out, "copied");
  assert.equal(copied, data.url);
});

test("closing the share sheet is not an error and does not copy", async () => {
  let copied = false;
  const out = await shareOrCopy(
    { share: async () => Promise.reject(abort()), clipboard: { writeText: async () => void (copied = true) } },
    data,
  );
  assert.equal(out, "dismissed");
  assert.equal(copied, false);
});

test("falls back to copying when the share sheet fails for another reason", async () => {
  const out = await shareOrCopy(
    { share: async () => Promise.reject(new Error("NotAllowedError")), clipboard: { writeText: async () => {} } },
    data,
  );
  assert.equal(out, "copied");
});

test("skips a share sheet that says it cannot share this data", async () => {
  let shared = false;
  const out = await shareOrCopy(
    { share: async () => void (shared = true), canShare: () => false, clipboard: { writeText: async () => {} } },
    data,
  );
  assert.equal(shared, false);
  assert.equal(out, "copied");
});

test("fails quietly when the clipboard rejects or is missing", async () => {
  assert.equal(await shareOrCopy({ clipboard: { writeText: async () => Promise.reject(new Error("denied")) } }, data), "failed");
  assert.equal(await shareOrCopy({}, data), "failed");
});

test("shareUrl swaps the reader's campaign tags for utm_source=share", () => {
  assert.equal(shareUrl("https://x.th/"), "https://x.th/?utm_source=share");
  assert.equal(
    shareUrl("https://x.th/?utm_source=line&utm_campaign=wrb12&lang=th#ch4"),
    "https://x.th/?lang=th&utm_source=share",
  );
});
