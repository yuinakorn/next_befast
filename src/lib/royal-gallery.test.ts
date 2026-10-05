import assert from "node:assert/strict";
import test from "node:test";
import { activeRoyalDuty } from "./royal-gallery.ts";

test("activeRoyalDuty keeps the previous item when no duty is visible", () => {
  assert.equal(activeRoyalDuty([0, 0, 0], 2), 2);
});

test("activeRoyalDuty selects the duty with the greatest intersection ratio", () => {
  assert.equal(activeRoyalDuty([0.2, 0.8, 0.5], 0), 1);
});

test("activeRoyalDuty resolves a tie without jumping forward", () => {
  assert.equal(activeRoyalDuty([0.6, 0.6, 0], 0), 0);
});
