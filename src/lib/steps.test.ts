import { test } from "node:test";
import assert from "node:assert/strict";
import { activeStep, stepProgress } from "./steps.ts";

const STARTS = [0, 0.14, 0.28, 0.42, 0.56, 0.7, 0.85];

test("activeStep stays on the first step until the second one starts", () => {
  assert.equal(activeStep(0, STARTS), 0);
  assert.equal(activeStep(0.139, STARTS), 0);
});

test("activeStep switches exactly at a step start", () => {
  assert.equal(activeStep(0.14, STARTS), 1);
  assert.equal(activeStep(0.7, STARTS), 5);
});

test("activeStep stays on the last step through the end", () => {
  assert.equal(activeStep(1, STARTS), 6);
});

test("stepProgress runs from 0 at the step start to 1 at the next start", () => {
  assert.equal(stepProgress(0.42, STARTS, 3), 0);
  assert.equal(stepProgress(0.56, STARTS, 3), 1);
  assert.ok(Math.abs(stepProgress(0.49, STARTS, 3) - 0.5) < 1e-9);
});

test("stepProgress for the last step runs to the end of the pin", () => {
  assert.equal(stepProgress(1, STARTS, 6), 1);
});

test("stepProgress is clamped outside its step", () => {
  assert.equal(stepProgress(0.1, STARTS, 3), 0);
  assert.equal(stepProgress(0.9, STARTS, 3), 1);
});
