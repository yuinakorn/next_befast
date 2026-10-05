import { test } from "node:test";
import assert from "node:assert/strict";
import { chapterProgress } from "./chapter-progress.ts";

const BOUNDS = [100, 300, 400, 800];

test("before the first chapter nothing is current or filled", () => {
  assert.deepEqual(chapterProgress(50, BOUNDS), { current: -1, fills: [0, 0, 0] });
});

test("inside a chapter, earlier ones are full and the current one fills partway", () => {
  assert.deepEqual(chapterProgress(350, BOUNDS), { current: 1, fills: [1, 0.5, 0] });
});

test("past the last chapter every segment is full and the last stays current", () => {
  assert.deepEqual(chapterProgress(900, BOUNDS), { current: 2, fills: [1, 1, 1] });
});
