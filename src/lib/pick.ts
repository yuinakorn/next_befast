/** Random index in [0, n) that differs from `prev` (any index when prev is -1). */
export function pickOther(prev: number, n: number, rand: () => number = Math.random): number {
  if (n <= 1) return 0;
  if (prev < 0 || prev >= n) return Math.floor(rand() * n);
  const i = Math.floor(rand() * (n - 1));
  return i >= prev ? i + 1 : i;
}
