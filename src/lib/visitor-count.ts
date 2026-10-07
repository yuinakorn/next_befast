/** Umami v2 returns `{ visitors: { value } }`, v3 returns `{ visitors: n }`. */
export function readVisitors(stats: unknown): number | null {
  const v = (stats as { visitors?: unknown } | null)?.visitors;
  const n = typeof v === "number" ? v : (v as { value?: unknown } | undefined)?.value;
  return typeof n === "number" && Number.isFinite(n) && n >= 0 ? n : null;
}

/** Latin digits with thousands separators, e.g. 12,345. */
export function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}
