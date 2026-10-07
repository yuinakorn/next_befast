import { test } from "node:test";
import assert from "node:assert/strict";
import { SURVEYS_OPEN_AT, msUntilOpen, surveysOpen } from "./survey.ts";

test("surveys open at 22:00 Thai time on 25 Oct 2569 (15:00 UTC)", () => {
  assert.equal(SURVEYS_OPEN_AT, Date.UTC(2026, 9, 25, 15, 0, 0));
  assert.equal(surveysOpen(SURVEYS_OPEN_AT - 1), false);
  assert.equal(surveysOpen(SURVEYS_OPEN_AT), true);
});

test("msUntilOpen waits only while the opening is ahead and within one timer", () => {
  assert.equal(msUntilOpen(SURVEYS_OPEN_AT - 5000), 5000);
  assert.equal(msUntilOpen(SURVEYS_OPEN_AT), null);
  assert.equal(msUntilOpen(SURVEYS_OPEN_AT - 30 * 86400000), null);
});
