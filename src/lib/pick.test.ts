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
