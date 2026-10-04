/** Brain cells lost per second in an untreated stroke: 1.9 million per minute (Saver 2006). */
export const CELLS_PER_SECOND = 1_900_000 / 60;

/** Cells lost by one untreated patient during `elapsedMs` milliseconds. */
export function cellsLost(elapsedMs: number): number {
  return Math.floor((Math.max(0, elapsedMs) / 1000) * CELLS_PER_SECOND);
}

export function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}
