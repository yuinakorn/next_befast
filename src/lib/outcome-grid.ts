/** A [from, to] slice of the 0–1 fill progress during which one group's dots appear. */
export type FillWindow = readonly [from: number, to: number];

/**
 * How many dots of each group are shown at fill progress `t` (0–1). Groups fill one after
 * another, each over its own window, so a small group (5 of 100) still gets enough scroll
 * to be seen before the next one starts.
 */
export function revealedPerGroup(t: number, counts: readonly number[], windows: readonly FillWindow[]): number[] {
  return counts.map((count, g) => {
    const [from, to] = windows[g];
    const u = Math.min(1, Math.max(0, (t - from) / (to - from)));
    return Math.ceil(u * count);
  });
}

/** Colour group of the dot at row-major position `index`, given each group's size in order. */
export function groupOfDot(index: number, counts: readonly number[]): number {
  let end = 0;
  for (let g = 0; g < counts.length; g++) {
    end += counts[g];
    if (index < end) return g;
  }
  return counts.length - 1;
}
