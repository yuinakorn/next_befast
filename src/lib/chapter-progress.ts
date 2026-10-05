export type ChapterProgress = {
  /** Index of the chapter being read (0 = chapter 1), or -1 before chapter 1 starts. */
  current: number;
  /** Fill of each chapter segment, 0–1. */
  fills: number[];
};

/**
 * Where the reader is among the chapters. `bounds` holds each chapter's top followed by the top of
 * whatever comes after the last chapter (n chapters, n + 1 values, ascending page offsets).
 * Past the last bound every segment is full and `current` stays on the last chapter.
 */
export function chapterProgress(y: number, bounds: readonly number[]): ChapterProgress {
  const n = bounds.length - 1;
  const fills: number[] = [];
  let current = -1;
  for (let i = 0; i < n; i++) {
    const start = bounds[i];
    const end = bounds[i + 1];
    if (y >= start) current = i;
    fills.push(end > start ? Math.min(1, Math.max(0, (y - start) / (end - start))) : y >= start ? 1 : 0);
  }
  return { current, fills };
}
