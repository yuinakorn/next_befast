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
