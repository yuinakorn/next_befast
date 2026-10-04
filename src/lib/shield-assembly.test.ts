import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DOCKED_SCALE,
  HABIT_COUNT,
  HABIT_SLOTS,
  MOVE_WINDOW,
  START_SCALE,
  checklistStatus,
  ease,
  iconPose,
  litPieces,
  slotInScene,
  startInScene,
  toggleIndex,
} from "./shield-assembly.ts";
import { SHIELD_DISEASE_COUNT, SHIELD_PIECE_COUNT } from "./shield.ts";

test("6 behaviours follow the 4 diseases and fill the shield", () => {
  assert.equal(HABIT_COUNT, 6);
  assert.equal(HABIT_SLOTS.length, HABIT_COUNT);
  assert.equal(SHIELD_DISEASE_COUNT + HABIT_COUNT, SHIELD_PIECE_COUNT);
});

test("every slot is inside the shield box and the slots are distinct", () => {
  for (const s of HABIT_SLOTS) assert.ok(s.x > 0 && s.x < 200 && s.y > 0 && s.y < 240);
  assert.equal(new Set(HABIT_SLOTS.map((s) => `${s.x},${s.y}`)).size, HABIT_COUNT);
});

test("icons wait left of the shield for even habits and right of it for odd ones", () => {
  assert.ok(startInScene(0).x < slotInScene(0).x);
  assert.ok(startInScene(1).x > slotInScene(1).x);
  assert.equal(startInScene(2).x, startInScene(0).x);
});

test("ease runs 0 → 1 and never goes backwards", () => {
  assert.equal(ease(0), 0);
  assert.equal(ease(1), 1);
  let prev = -1;
  for (let i = 0; i <= 50; i++) {
    const e = ease(i / 50);
    assert.ok(e >= prev);
    prev = e;
  }
});

test("the icon of the active step waits, travels and docks over its window", () => {
  const before = iconPose(2, 2, MOVE_WINDOW[0] / 2, false);
  assert.equal(before.shown, true);
  assert.equal(before.docked, false);
  assert.equal(before.scale, START_SCALE);
  assert.deepEqual({ x: before.x, y: before.y }, startInScene(2));

  const mid = iconPose(2, 2, (MOVE_WINDOW[0] + MOVE_WINDOW[1]) / 2, false);
  assert.equal(mid.docked, false);
  assert.ok(mid.x > startInScene(2).x && mid.x < slotInScene(2).x);

  const after = iconPose(2, 2, MOVE_WINDOW[1], false);
  assert.equal(after.docked, true);
  assert.equal(after.scale, DOCKED_SCALE);
  assert.deepEqual({ x: after.x, y: after.y }, slotInScene(2));
});

test("earlier icons sit in their slots, later ones are hidden", () => {
  const done = iconPose(0, 3, 0, false);
  assert.equal(done.docked, true);
  assert.deepEqual({ x: done.x, y: done.y }, slotInScene(0));
  assert.equal(iconPose(4, 3, 1, false).shown, false);
});

test("reduced motion: the icon is in its slot as soon as its step starts, nothing travels", () => {
  const p = iconPose(1, 1, 0, true);
  assert.equal(p.docked, true);
  assert.deepEqual({ x: p.x, y: p.y }, slotInScene(1));
  assert.equal(iconPose(2, 1, 0, true).shown, false);
});

test("litPieces starts at the 4 diseases and lights one habit piece per step", () => {
  assert.equal(litPieces(0, 0, false), 4);
  assert.equal(litPieces(0, MOVE_WINDOW[1] - 0.01, false), 4);
  assert.equal(litPieces(0, MOVE_WINDOW[1], false), 5);
  assert.equal(litPieces(1, 0, false), 5);
  assert.equal(litPieces(3, 1, false), 8);
});

test("litPieces reaches all 10 on the last step and not before", () => {
  assert.equal(litPieces(5, 0, false), 9);
  assert.equal(litPieces(5, 1, false), SHIELD_PIECE_COUNT);
  assert.equal(litPieces(99, 1, false), SHIELD_PIECE_COUNT);
});

test("litPieces with reduced motion lights the step's piece immediately", () => {
  assert.equal(litPieces(0, 0, true), 5);
  assert.equal(litPieces(5, 0, true), SHIELD_PIECE_COUNT);
});

test("litPieces never decreases as the reader scrolls on", () => {
  let prev = 0;
  for (let step = 0; step < HABIT_COUNT; step++) {
    for (let i = 0; i <= 20; i++) {
      const n = litPieces(step, i / 20, false);
      assert.ok(n >= prev);
      prev = n;
    }
  }
});

test("toggleIndex adds a missing index and removes a present one, keeping the list sorted", () => {
  assert.deepEqual(toggleIndex([], 4), [4]);
  assert.deepEqual(toggleIndex([4, 9], 6), [4, 6, 9]);
  assert.deepEqual(toggleIndex([4, 6, 9], 6), [4, 9]);
  const input = [1, 3];
  toggleIndex(input, 2);
  assert.deepEqual(input, [1, 3]);
});

test("checklistStatus: encouragement for every count below the total (0 included), finish at the total", () => {
  assert.equal(checklistStatus(0, 10), "encourage");
  assert.equal(checklistStatus(1, 10), "encourage");
  assert.equal(checklistStatus(9, 10), "encourage");
  assert.equal(checklistStatus(10, 10), "complete");
});
