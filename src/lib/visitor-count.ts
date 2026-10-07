export type VisitStats = { visitors: number; visits: number | null };

/** One count from Umami stats: v2 returns `{ key: { value } }`, v3 returns `{ key: n }`. */
function readCount(stats: unknown, key: "visitors" | "visits"): number | null {
  const v = (stats as Record<string, unknown> | null)?.[key];
  const n = typeof v === "number" ? v : (v as { value?: unknown } | undefined)?.value;
  return typeof n === "number" && Number.isFinite(n) && n >= 0 ? n : null;
}

/** Visitors (people) and visits (sessions) from Umami stats; null without a visitor count. */
export function readStats(stats: unknown): VisitStats | null {
  const visitors = readCount(stats, "visitors");
  return visitors === null ? null : { visitors, visits: readCount(stats, "visits") };
}

/** Latin digits with thousands separators, e.g. 12,345. */
export function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}
