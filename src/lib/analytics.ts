/**
 * Umami website and tracked hostname. Production values are the defaults; local dev points at its own
 * Umami (docker-compose.dev.yml) through NEXT_PUBLIC_* in .env.local, so the two never share data.
 * The id is public anyway: it appears in the page HTML.
 */
export const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || "985a5d0d-924d-4336-a446-3e2156f8ebec";

/** Only this hostname is tracked, so other hosts (previews, the bare server port) never count. */
export const UMAMI_DOMAIN = process.env.NEXT_PUBLIC_UMAMI_DOMAIN || "walkrunbike12.chiangmaihealth.go.th";
