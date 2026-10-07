import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

test("ScrollCue gives readers a default instruction and a decorative down arrow", async () => {
  await assert.doesNotReject(async () => {
    const { ScrollCue } = await import("./ScrollCue.ts");
    const html = renderToStaticMarkup(createElement(ScrollCue));

    assert.match(html, />เลื่อนลงเพื่อดูต่อ</);
    assert.match(html, /class="scroll-cue-arrow"/);
    assert.match(html, /aria-hidden="true"/);
  });
});

test("ScrollCue can explain an additional interaction", async () => {
  await assert.doesNotReject(async () => {
    const { ScrollCue } = await import("./ScrollCue.ts");
    const html = renderToStaticMarkup(
      createElement(ScrollCue, null, "เลื่อนลง หรือแตะตัวอักษรด้านบน"),
    );

    assert.match(html, />เลื่อนลง หรือแตะตัวอักษรด้านบน</);
    assert.doesNotMatch(html, />เลื่อนลงเพื่อดูต่อ</);
  });
});
