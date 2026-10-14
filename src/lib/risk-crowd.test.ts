import { test } from "node:test";
import assert from "node:assert/strict";
import { CROWD, PEOPLE_X, PEOPLE_Y, PERSON_SLOT, crowdOpacity, crowdZoom, personPose, redSlots, slotAt } from "./risk-crowd.ts";

test("ten of the forty are red, one of them the chosen person, whoever is chosen", () => {
  for (let chosen = 0; chosen < 4; chosen++) {
    const reds = redSlots(chosen);
    assert.equal(new Set(reds).size, 10);
    assert.equal(reds.length * 4, CROWD);
    assert.ok(reds.includes(PERSON_SLOT[chosen]));
    for (let other = 0; other < 4; other++) if (other !== chosen) assert.ok(!reds.includes(PERSON_SLOT[other]));
  }
});

test("the four start where they stand and end in their crowd slots", () => {
  PEOPLE_X.forEach((x, i) => {
    assert.deepEqual(personPose(i, 0), { x, y: PEOPLE_Y, scale: 1 });
    const end = personPose(i, 1);
    const slot = slotAt(PERSON_SLOT[i]);
    assert.ok(Math.abs(end.x - slot.x) < 1e-9 && Math.abs(end.y - slot.y) < 1e-9);
  });
});

test("the crowd stays inside the 400-wide scene, above the 1 ใน 4 line", () => {
  for (let s = 0; s < CROWD; s++) {
    const { x, y } = slotAt(s);
    assert.ok(x - 12 >= 0 && x + 12 <= 400, `x ${x}`);
    assert.ok(y + 20 < 250, `y ${y}`);
  }
});

test("zoom: none before its window, all after; reduced motion jumps at the middle", () => {
  assert.equal(crowdZoom(0.2, false), 0);
  assert.equal(crowdZoom(0.9, false), 1);
  assert.equal(crowdZoom(0.55, true), 0);
  assert.equal(crowdZoom(0.65, true), 1);
});

test("every crowd member is fully shown once the zoom ends, none before it starts", () => {
  for (let s = 0; s < CROWD; s++) {
    assert.equal(crowdOpacity(s, 0), 0);
    assert.equal(crowdOpacity(s, 1), 1);
  }
});
