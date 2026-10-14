import { test } from "node:test";
import assert from "node:assert/strict";
import {
  HERO,
  POSTER_STEP,
  befastBuild,
  itemState,
  numberRuns,
  posterPose,
  ringBuild,
  shieldBuild,
  trayPose,
  wrapLines,
} from "./recap-scene.ts";

const pose = ({ x, y, scale }: { x: number; y: number; scale: number }) => ({ x, y, scale });

test("the first picture starts in the middle, building from nothing", () => {
  const s = itemState(0, 0, 0, false);
  assert.deepEqual(pose(s), HERO);
  assert.equal(s.shown, true);
  assert.equal(s.build, 0);
  assert.equal(itemState(0, 0, 0.9, false).build, 1);
});

test("later pictures wait hidden in their tray slot", () => {
  for (const i of [1, 2]) {
    const s = itemState(i, 0, 0.5, false);
    assert.equal(s.shown, false);
    assert.deepEqual(pose(s), trayPose(i));
  }
});

test("on its step a picture grows out of the tray while the previous one goes back", () => {
  const halfway = itemState(1, 1, 0.11, false);
  assert.ok(halfway.y < trayPose(1).y && halfway.y > HERO.y);
  assert.ok(halfway.scale > trayPose(1).scale && halfway.scale < HERO.scale);
  assert.deepEqual(pose(itemState(1, 1, 0.3, false)), HERO);
  assert.deepEqual(pose(itemState(0, 1, 0.3, false)), trayPose(0));
  assert.equal(itemState(1, 1, 0.1, false).build, 0, "no building while it travels");
});

test("pictures explained two steps ago rest in the tray, fully drawn", () => {
  const s = itemState(0, 2, 0, false);
  assert.deepEqual(pose(s), trayPose(0));
  assert.equal(s.build, 1);
});

test("on the last step all three end on the board", () => {
  for (const i of [0, 1, 2]) {
    const s = itemState(i, POSTER_STEP, 1, false);
    assert.deepEqual(pose(s), posterPose(i));
    assert.equal(s.shown, true);
    assert.equal(s.build, 1);
  }
  // the third picture travels from the middle, the others from the tray
  assert.deepEqual(pose(itemState(2, POSTER_STEP, 0, false)), HERO);
  assert.deepEqual(pose(itemState(0, POSTER_STEP, 0, false)), trayPose(0));
});

test("reduced motion: every picture jumps straight to where it rests, fully drawn", () => {
  assert.deepEqual(pose(itemState(1, 1, 0, true)), HERO);
  assert.equal(itemState(1, 1, 0, true).build, 1);
  assert.deepEqual(pose(itemState(0, 1, 0, true)), trayPose(0));
  assert.deepEqual(pose(itemState(2, POSTER_STEP, 0, true)), posterPose(2));
});

test("BEFAST picture builds in order and ends complete", () => {
  assert.deepEqual(befastBuild(0), { tiles: 0, hit: false, arrow: 0, clock: false, call: false });
  const mid = befastBuild(0.2);
  assert.ok(mid.tiles > 0 && mid.tiles < 6);
  assert.equal(mid.hit, false);
  assert.deepEqual(befastBuild(1), { tiles: 6, hit: true, arrow: 1, clock: true, call: true });
});

test("ring counts up to 270 minutes and the shield to 90% with all 10 pieces", () => {
  assert.deepEqual(ringBuild(0), { arc: 0, minutes: 0 });
  assert.deepEqual(ringBuild(1), { arc: 1, minutes: 270 });
  assert.deepEqual(shieldBuild(0), { pieces: 0, percent: 0 });
  assert.deepEqual(shieldBuild(1), { pieces: 10, percent: 90 });
  const mid = shieldBuild(0.45);
  assert.equal(mid.pieces, 5);
  assert.equal(mid.percent, 45);
});

test("numberRuns splits numbers (with . and %) from the words around them", () => {
  assert.deepEqual(numberRuns("ภายใน 4.5 ชั่วโมง"), [
    { text: "ภายใน ", num: false },
    { text: "4.5", num: true },
    { text: " ชั่วโมง", num: false },
  ]);
  assert.deepEqual(numberRuns("ถึง 90%"), [
    { text: "ถึง ", num: false },
    { text: "90%", num: true },
  ]);
  assert.equal(numberRuns("1669").length, 1);
});

const byChar = (s: string) => s.length * 10;

test("wrapLines breaks at the spaces between phrases first", () => {
  assert.deepEqual(wrapLines("เห็นอาการ จำเวลา โทร", 100, byChar), ["เห็นอาการ", "จำเวลา โทร"]);
  assert.deepEqual(wrapLines("สั้น", 100, byChar), ["สั้น"]);
});

test("wrapLines breaks a phrase that is too long on its own between words, keeping all text", () => {
  const text = "ยาละลายลิ่มเลือดให้ได้ภายในสี่ชั่วโมงครึ่ง";
  const lines = wrapLines(text, 120, byChar);
  assert.ok(lines.length > 1);
  assert.equal(lines.join(""), text);
  for (const l of lines) assert.ok(byChar(l) <= 120 || !/\s/.test(l), l);
});
