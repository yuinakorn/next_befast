import { test } from "node:test";
import assert from "node:assert/strict";
import { generateDots, litCount, mulberry32, relit } from "./dot-brain.ts";

const insideCircle = (x: number, y: number) => (x - 200) ** 2 + (y - 150) ** 2 < 100 ** 2;

test("mulberry32 is deterministic and stays in [0, 1)", () => {
  const a = mulberry32(42), b = mulberry32(42);
  for (let i = 0; i < 100; i++) {
    const v = a();
    assert.equal(v, b());
    assert.ok(v >= 0 && v < 1);
  }
});

test("generateDots places exactly `count` dots, all inside the shape", () => {
  const dots = generateDots(300, 7, insideCircle);
  assert.equal(dots.length, 300);
  assert.ok(dots.every((d) => insideCircle(d.x, d.y)));
});

test("generateDots gives the same layout for the same seed and a different one for another seed", () => {
  assert.deepEqual(generateDots(50, 7, insideCircle), generateDots(50, 7, insideCircle));
  assert.notDeepEqual(generateDots(50, 7, insideCircle), generateDots(50, 8, insideCircle));
});

test("dot order is a permutation of 0..count-1", () => {
  const orders = generateDots(120, 3, insideCircle).map((d) => d.order).sort((a, b) => a - b);
  assert.deepEqual(orders, Array.from({ length: 120 }, (_, i) => i));
});

test("litCount clamps to 0–1 and rounds", () => {
  assert.equal(litCount(0.5, 10), 5);
  assert.equal(litCount(2, 10), 10);
  assert.equal(litCount(-1, 10), 0);
});

test("relit climbs from the minimum to all dots and clamps", () => {
  assert.equal(relit(0, 0.15), 0.15);
  assert.equal(relit(1, 0.15), 1);
  assert.ok(Math.abs(relit(0.5, 0.2) - 0.6) < 1e-9);
  assert.equal(relit(-1, 0.15), 0.15);
  assert.equal(relit(2, 0.15), 1);
});
