import { test } from "node:test";
import assert from "node:assert/strict";
import { formatCount, readStats } from "./visitor-count.ts";

test("readStats reads both Umami response shapes", () => {
  assert.deepEqual(readStats({ visitors: { value: 42, prev: 0 }, visits: { value: 50, prev: 0 } }), { visitors: 42, visits: 50 });
  assert.deepEqual(readStats({ pageviews: 9, visitors: 3, visits: 5 }), { visitors: 3, visits: 5 });
});

test("readStats keeps visitors when visits is missing", () => {
  assert.deepEqual(readStats({ visitors: 7 }), { visitors: 7, visits: null });
});

test("readStats rejects anything without a visitor count", () => {
  assert.equal(readStats(null), null);
  assert.equal(readStats({}), null);
  assert.equal(readStats({ visitors: "12", visits: 3 }), null);
  assert.equal(readStats({ visitors: -1 }), null);
});

test("formatCount groups thousands with latin digits", () => {
  assert.equal(formatCount(1234567), "1,234,567");
  assert.equal(formatCount(0), "0");
});
