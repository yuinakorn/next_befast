/** When both surveys open: 22:00 on 25 Oct 2569, Thai time. The QR codes stay blurred and unlinked until then. */
export const SURVEYS_OPEN_AT = Date.parse("2026-10-25T22:00:00+07:00");

/** setTimeout fires at once for delays past this (about 24.8 days), so longer waits are skipped. */
const MAX_TIMEOUT = 2 ** 31 - 1;

export function surveysOpen(now: number): boolean {
  return now >= SURVEYS_OPEN_AT;
}

/** Ms until the surveys open, or null if they are already open or too far off to wait for in one page visit. */
export function msUntilOpen(now: number): number | null {
  const ms = SURVEYS_OPEN_AT - now;
  return ms > 0 && ms <= MAX_TIMEOUT ? ms : null;
}
