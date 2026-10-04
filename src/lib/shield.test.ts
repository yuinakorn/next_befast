import { test } from "node:test";
import assert from "node:assert/strict";
import { SHIELD_DISEASE_COUNT, SHIELD_PIECE_COUNT, SHIELD_PIECES, isPieceLit } from "./shield.ts";

test("the shield has 10 pieces: 4 diseases first, then 6 behaviours", () => {
  assert.equal(SHIELD_PIECES.length, SHIELD_PIECE_COUNT);
  assert.equal(SHIELD_PIECES.filter((p) => p.kind === "disease").length, SHIELD_DISEASE_COUNT);
  assert.deepEqual(
    SHIELD_PIECES.map((p) => p.kind === "disease"),
    [true, true, true, true, false, false, false, false, false, false],
  );
});

test("every piece is a closed path", () => {
  for (const p of SHIELD_PIECES) assert.match(p.d, /^M[\d.,]+ H[\d.]+ V[\d.]+ H[\d.]+ Z$|^M[\d.,]+H[\d.]+V[\d.]+H[\d.]+Z$/);
});

test("a numeric lit value lights the first n pieces", () => {
  assert.equal(isPieceLit(0, 0), false);
  assert.equal(isPieceLit(0, 1), true);
  assert.equal(isPieceLit(3, 4), true);
  assert.equal(isPieceLit(4, 4), false);
});

test("a list lights exactly the listed pieces (chapter 7 checklist ticks in any order)", () => {
  assert.equal(isPieceLit(5, [5, 9]), true);
  assert.equal(isPieceLit(4, [5, 9]), false);
  assert.equal(isPieceLit(2, undefined), false);
});
