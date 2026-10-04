/** Index of the last step whose start (0–1 scroll progress) has been reached. */
export function activeStep(progress: number, starts: readonly number[]): number {
  let idx = 0;
  for (let i = 0; i < starts.length; i++) if (progress >= starts[i]) idx = i;
  return idx;
}

/** Progress (0–1) through step `index`. The last step runs until progress 1. */
export function stepProgress(progress: number, starts: readonly number[], index: number): number {
  const start = starts[index];
  const end = index + 1 < starts.length ? starts[index + 1] : 1;
  return Math.min(1, Math.max(0, (progress - start) / (end - start)));
}

/** One-based, zero-padded progress label for a finite story sequence. */
export function formatStepCounter(index: number, total: number): string {
  const width = Math.max(2, String(total).length);
  return `${String(index + 1).padStart(width, "0")} / ${String(total).padStart(width, "0")}`;
}
