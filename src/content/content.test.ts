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
