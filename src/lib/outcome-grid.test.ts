import { test } from "node:test";
import assert from "node:assert/strict";
import { groupOfDot, revealedPerGroup } from "./outcome-grid.ts";

const COUNTS = [5, 25, 70];
const WINDOWS = [[0, 0.2], [0.2, 0.5], [0.5, 0.9]] as const;

test("revealedPerGroup shows nothing at the start", () => {
  assert.deepEqual(revealedPerGroup(0, COUNTS, WINDOWS), [0, 0, 0]);
});

test("revealedPerGroup fills one group before starting the next", () => {
  assert.deepEqual(revealedPerGroup(0.2, COUNTS, WINDOWS), [5, 0, 0]);
  assert.deepEqual(revealedPerGroup(0.5, COUNTS, WINDOWS), [5, 25, 0]);
  const mid = revealedPerGroup(0.35, COUNTS, WINDOWS);
  assert.equal(mid[0], 5);
  assert.ok(mid[1] > 0 && mid[1] < 25);
  assert.equal(mid[2], 0);
});

test("revealedPerGroup shows all 100 dots once the windows are done and stays there", () => {
  for (const t of [0.9, 0.95, 1]) {
    assert.deepEqual(revealedPerGroup(t, COUNTS, WINDOWS), [5, 25, 70]);
  }
});

test("groupOfDot maps row-major positions to groups: 5 died, 25 recovered, 70 disabled", () => {
  assert.equal(groupOfDot(0, COUNTS), 0);
  assert.equal(groupOfDot(4, COUNTS), 0);
  assert.equal(groupOfDot(5, COUNTS), 1);
  assert.equal(groupOfDot(29, COUNTS), 1);
  assert.equal(groupOfDot(30, COUNTS), 2);
  assert.equal(groupOfDot(99, COUNTS), 2);
});
