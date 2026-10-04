import { test } from "node:test";
import assert from "node:assert/strict";
import { countUp, cubicPoint, piecesLit, roughRing, windowProgress } from "./prevent-scene.ts";

test("windowProgress clamps to 0–1", () => {
  assert.equal(windowProgress(-1, 0.2, 0.8), 0);
  assert.ok(Math.abs(windowProgress(0.5, 0.2, 0.8) - 0.5) < 1e-9);
  assert.equal(windowProgress(2, 0.2, 0.8), 1);
});

test("countUp starts at 0, reaches the target at the end of its window and stays", () => {
  assert.equal(countUp(0, 90, 0, 0.8), 0);
  assert.equal(countUp(0.4, 90, 0, 0.8), 45);
  assert.equal(countUp(0.8, 90, 0, 0.8), 90);
  assert.equal(countUp(1, 90, 0, 0.8), 90);
});

test("countUp never decreases as progress grows", () => {
  let prev = -1;
  for (let i = 0; i <= 100; i++) {
    const n = countUp(i / 100, 90, 0, 0.8);
    assert.ok(n >= prev);
    prev = n;
  }
});

test("piecesLit lights none before the window, then one by one, and all at the end", () => {
  assert.equal(piecesLit(0, 4, 0.1, 0.8), 0);
  assert.equal(piecesLit(0.1, 4, 0.1, 0.8), 0);
  assert.equal(piecesLit(0.2, 4, 0.1, 0.8), 1);
  assert.equal(piecesLit(0.5, 4, 0.1, 0.8), 3);
  assert.equal(piecesLit(0.8, 4, 0.1, 0.8), 4);
  assert.equal(piecesLit(1, 4, 0.1, 0.8), 4);
});

test("cubicPoint hits both end points", () => {
  const p0 = { x: 0, y: 0 };
  const p3 = { x: 10, y: 20 };
  assert.deepEqual(cubicPoint(p0, { x: 5, y: 0 }, { x: 5, y: 20 }, p3, 0), p0);
  assert.deepEqual(cubicPoint(p0, { x: 5, y: 0 }, { x: 5, y: 20 }, p3, 1), p3);
});

test("cubicPoint of a straight line is its midpoint at t = 0.5", () => {
  const m = cubicPoint({ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 20, y: 0 }, { x: 30, y: 0 }, 0.5);
  assert.equal(m.x, 15);
  assert.equal(m.y, 0);
});

test("roughRing is a closed polygon whose radii stay within base ± amp", () => {
  const d = roughRing(44, 5, 40);
  assert.ok(d.startsWith("M") && d.endsWith("Z"));
  const pts = d.slice(1, -2).split(" L").map((p) => p.split(",").map(Number));
  assert.equal(pts.length, 40);
  for (const [x, y] of pts) {
    const r = Math.hypot(x, y);
    assert.ok(r >= 44 - 5 - 0.2 && r <= 44 + 5 + 0.2, `radius ${r}`);
  }
  assert.equal(roughRing(44, 5, 40), d);
});
