import { test } from "node:test";
import assert from "node:assert/strict";
import { formatCount, readVisitors } from "./visitor-count.ts";

test("readVisitors reads both Umami response shapes", () => {
  assert.equal(readVisitors({ visitors: { value: 42, prev: 0 } }), 42);
  assert.equal(readVisitors({ visitors: 7 }), 7);
});

test("readVisitors rejects anything that is not a count", () => {
  assert.equal(readVisitors(null), null);
  assert.equal(readVisitors({}), null);
  assert.equal(readVisitors({ visitors: "12" }), null);
  assert.equal(readVisitors({ visitors: -1 }), null);
});

test("formatCount groups thousands with latin digits", () => {
  assert.equal(formatCount(1234567), "1,234,567");
  assert.equal(formatCount(0), "0");
});
