import { test } from "node:test";
import assert from "node:assert/strict";
import {
  BP_READING, CAL_YEAR, CHECKUP, FAMILY_HEARTS, LIGHT_WINDOWS, MONTH_COUNT, SELF_HEART,
  bottlePose, bpAt, cellOf, circled, familyRoutes, lightPoint, lightProgress, lightRoute, monthAt, monthGrid, signProgress, signStrokes,
} from "./remember-scene.ts";

test("bpAt starts at 0, climbs and rests on the reading", () => {
  assert.deepEqual(bpAt(0, false), { sys: 0, dia: 0 });
  assert.deepEqual(bpAt(1, false), BP_READING);
  let prev = -1;
  for (let t = 0; t <= 1; t += 0.05) {
    const { sys, dia } = bpAt(t, false);
    assert.ok(sys >= prev, "systolic never goes down");
    assert.ok(dia <= sys, "diastolic stays under systolic");
    prev = sys;
  }
});

test("bpAt shows the reading at once when motion is reduced", () => {
  assert.deepEqual(bpAt(0, true), BP_READING);
});

test("monthAt walks January to December, in order, and never leaves the year", () => {
  assert.equal(monthAt(0, false), 0);
  assert.equal(monthAt(1, false), MONTH_COUNT - 1);
  let prev = 0;
  const seen = new Set<number>();
  for (let t = 0; t <= 1; t += 0.01) {
    const m = monthAt(t, false);
    assert.ok(m >= prev && m < MONTH_COUNT);
    seen.add(m);
    prev = m;
  }
  assert.equal(seen.size, MONTH_COUNT, "every month is shown");
});

test("monthAt jumps to the last page when motion is reduced", () => {
  assert.equal(monthAt(0, true), MONTH_COUNT - 1);
});

test("monthGrid lays out real months: Sunday-first, 6 rows of 7", () => {
  // 1 Jan 2026 is a Thursday; 1 Feb 2026 a Sunday; 1 Dec 2026 a Tuesday
  const jan = monthGrid(2026, 0);
  assert.equal(jan.length, 42);
  assert.deepEqual(jan.slice(0, 5), [null, null, null, null, 1]);
  assert.equal(jan.filter((d) => d !== null).length, 31);
  assert.equal(monthGrid(2026, 1)[0], 1);
  assert.equal(monthGrid(2026, 1).filter((d) => d !== null).length, 28);
  assert.deepEqual(monthGrid(2026, 11).slice(0, 3), [null, null, 1]);
  assert.equal(monthGrid(2024, 1).filter((d) => d !== null).length, 29, "leap year");
});

test("cellOf finds the circled check-up day in the final page", () => {
  const { row, col } = cellOf(CAL_YEAR, CHECKUP.month, CHECKUP.day);
  assert.equal(monthGrid(CAL_YEAR, CHECKUP.month)[row * 7 + col], CHECKUP.day);
});

test("the day is circled only after the pages stop, or at once when motion is reduced", () => {
  assert.equal(circled(0.3, false), false);
  assert.equal(circled(1, false), true);
  assert.equal(circled(0, true), true);
});

test("bottlePose lowers the bottle onto the shelf and levels it", () => {
  const start = bottlePose(0, false);
  const end = bottlePose(1, false);
  assert.ok(start.lift > 0 && start.tilt !== 0);
  assert.deepEqual(end, { lift: 0, tilt: 0 });
  assert.ok(bottlePose(0.25, false).lift < start.lift);
  assert.deepEqual(bottlePose(0, true), { lift: 0, tilt: 0 });
});

test("the sign is drawn after the bottle has arrived", () => {
  assert.equal(signProgress(0.5, false), 0);
  assert.equal(signProgress(1, false), 1);
  assert.equal(signProgress(0, true), 1);
});

test("the ring of the sign is drawn first and the slash finishes it", () => {
  assert.deepEqual(signStrokes(0), { ring: 0, slash: 0 });
  assert.deepEqual(signStrokes(1), { ring: 1, slash: 1 });
  const mid = signStrokes(0.55);
  assert.ok(Math.abs(mid.ring - 0.55 / 0.6) < 1e-9);
  assert.ok(Math.abs(mid.slash - 0.1) < 1e-9);
});

test("light windows are staggered, inside the step, and reach each person in order", () => {
  assert.equal(LIGHT_WINDOWS.length, FAMILY_HEARTS.length);
  LIGHT_WINDOWS.forEach(([from, to], i) => {
    assert.ok(from >= 0 && to <= 1 && from < to);
    if (i > 0) assert.ok(from > LIGHT_WINDOWS[i - 1][0] && to > LIGHT_WINDOWS[i - 1][1]);
  });
  assert.equal(lightProgress(0, 0, false), 0);
  assert.equal(lightProgress(1, 3, false), 1);
  assert.equal(lightProgress(0, 2, true), 1);
});

test("a light route starts at the heart that gives and ends exactly on the one that receives", () => {
  for (const route of familyRoutes()) {
    assert.deepEqual(lightPoint(route, 0), SELF_HEART);
  }
  familyRoutes().forEach((route, i) => assert.deepEqual(lightPoint(route, 1), FAMILY_HEARTS[i]));
});

test("lightRoute bows to one side; bend 0 is a straight line", () => {
  const a = { x: 0, y: 0 };
  const b = { x: 100, y: 0 };
  const bowed = lightRoute(a, b, 0.2);
  assert.ok(bowed[1].y !== 0 && bowed[2].y !== 0);
  const straight = lightRoute(a, b, 0);
  assert.equal(lightPoint(straight, 0.5).y, 0);
  assert.equal(lightPoint(straight, 0.5).x, 50);
});
