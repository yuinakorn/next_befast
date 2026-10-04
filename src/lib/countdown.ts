/** Countdown maths for the pulse check. Time comes from timestamps, never from counting ticks. */

/** Milliseconds left, given when it started and the current time (same clock for both). */
export function remainingMs(startedAt: number, now: number, totalMs: number): number {
  return Math.max(0, totalMs - Math.max(0, now - startedAt));
}

/** Whole seconds to display: 30 until a full second has passed, 0 only when time is up. */
export function secondsLeft(remaining: number): number {
  return Math.ceil(remaining / 1000);
}

/**
 * Fraction (0–1) of the ring to keep drawn. While running it aims one second ahead of the
 * displayed number, so a 1s linear transition lands on the next value exactly as the number changes.
 */
export function ringTarget(running: boolean, left: number, total: number): number {
  return running ? Math.max(0, left - 1) / total : left / total;
}
