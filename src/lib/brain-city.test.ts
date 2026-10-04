import { test } from "node:test";
import assert from "node:assert/strict";
import { BRAIN_OUTLINE, DISTRICTS, ROADS, cityLights, pointInPolygon, pointOnRoad, roadD, type DistrictId } from "./brain-city.ts";

const SQUARE = [[0, 0], [10, 0], [10, 10], [0, 10]] as const;

test("pointInPolygon tells inside from outside", () => {
  assert.equal(pointInPolygon([5, 5], SQUARE), true);
  assert.equal(pointInPolygon([15, 5], SQUARE), false);
  assert.equal(pointInPolygon([-1, -1], SQUARE), false);
});

test("every light is inside the brain outline and its own district", () => {
  for (const l of cityLights()) {
    assert.ok(pointInPolygon([l.x, l.y], BRAIN_OUTLINE), `light ${l.x},${l.y} outside the brain`);
    assert.ok(pointInPolygon([l.x, l.y], DISTRICTS[l.district]), `light ${l.x},${l.y} outside ${l.district}`);
  }
});

test("every district has at least 6 lights", () => {
  const lights = cityLights();
  for (const id of Object.keys(DISTRICTS) as DistrictId[]) {
    assert.ok(lights.filter((l) => l.district === id).length >= 6, `${id} has too few lights`);
  }
});

test("pointOnRoad starts at `from` and ends at `to`", () => {
  assert.deepEqual(pointOnRoad(ROADS.frontal, 0), ROADS.frontal.from);
  assert.deepEqual(pointOnRoad(ROADS.frontal, 1), ROADS.frontal.to);
});

test("roadD writes an SVG cubic path", () => {
  assert.equal(roadD(ROADS.trunk), "M200,360 C200,330 200,282 200,250");
});

test("every branch road ends inside the brain outline", () => {
  // the trunk ends at the brainstem, below the outline polygon, so it is skipped
  for (const [id, r] of Object.entries(ROADS)) {
    if (id !== "trunk") assert.ok(pointInPolygon(r.to, BRAIN_OUTLINE), `${id} ends outside the brain`);
  }
});
