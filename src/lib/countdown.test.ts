import { test } from "node:test";
import assert from "node:assert/strict";
import { remainingMs, ringTarget, secondsLeft } from "./countdown.ts";

test("remainingMs counts down from the timestamp, however late the tick arrives", () => {
  assert.equal(remainingMs(1000, 1000, 30000), 30000);
  assert.equal(remainingMs(1000, 11000, 30000), 20000);
  // a throttled background tab wakes up 25 s later: the time is still right
  assert.equal(remainingMs(1000, 26000, 30000), 5000);
});

test("remainingMs never goes below 0 or above the total", () => {
  assert.equal(remainingMs(0, 99999, 30000), 0);
  assert.equal(remainingMs(500, 100, 30000), 30000);
});

test("secondsLeft shows 30 at the start and 0 only when time is up", () => {
  assert.equal(secondsLeft(30000), 30);
  assert.equal(secondsLeft(29999), 30);
  assert.equal(secondsLeft(29000), 29);
  assert.equal(secondsLeft(1), 1);
  assert.equal(secondsLeft(0), 0);
});

test("ringTarget is full when idle, one second ahead while running, and empty at the end", () => {
  assert.equal(ringTarget(false, 30, 30), 1);
  assert.equal(ringTarget(true, 30, 30), 29 / 30);
  assert.equal(ringTarget(true, 1, 30), 0);
  assert.equal(ringTarget(false, 0, 30), 0);
});
