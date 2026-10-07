import { readVisitors } from "@/lib/visitor-count";

// Read Umami at request time; the count is cached in memory below.
export const dynamic = "force-dynamic";

const TTL_MS = 5 * 60 * 1000;
let cached: { visitors: number; at: number } | null = null;
let token: string | null = null;

async function login(base: string): Promise<string | null> {
  const res = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: process.env.UMAMI_USERNAME, password: process.env.UMAMI_PASSWORD }),
    cache: "no-store",
    signal: AbortSignal.timeout(3000),
  });
  if (!res.ok) return null;
  return ((await res.json()) as { token?: string }).token ?? null;
}

async function fetchVisitors(): Promise<number | null> {
  const base = process.env.UMAMI_URL;
  const id = process.env.UMAMI_WEBSITE_ID || process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  if (!base || !id || !process.env.UMAMI_PASSWORD) return null;

  for (let attempt = 0; attempt < 2; attempt++) {
    token ??= await login(base);
    if (!token) return null;
    const res = await fetch(`${base}/api/websites/${id}/stats?startAt=0&endAt=${Date.now()}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    if (res.status === 401) {
      token = null; // expired: log in once more
      continue;
    }
    return res.ok ? readVisitors(await res.json()) : null;
  }
  return null;
}

export async function GET() {
  if (!cached || Date.now() - cached.at > TTL_MS) {
    const visitors = await fetchVisitors().catch(() => null);
    if (visitors !== null) cached = { visitors, at: Date.now() };
  }
  return Response.json(
    { visitors: cached?.visitors ?? null },
    { headers: { "Cache-Control": "public, max-age=60" } },
  );
}
