/** Anonymous Umami events (no cookies, nothing that identifies the reader). */

type Umami = { track: (event: string, data?: Record<string, string | number | boolean>) => void };

/** Sections whose arrival is reported as `reach-<id>`, in reading order. */
export const REACH_SECTIONS = ["ch1", "ch2", "ch3", "ch4", "ch5", "ch6", "ch7", "ch8", "closing"] as const;

export const reachEvent = (id: string) => `reach-${id}`;

/** Sends an event once the tracker has loaded; drops it quietly if it never does (blocked, offline, dev). */
export function track(event: string, data?: Record<string, string | number | boolean>, tries = 10): void {
  if (typeof window === "undefined") return;
  const umami = (window as unknown as { umami?: Umami }).umami;
  if (umami) umami.track(event, data);
  else if (tries > 0) window.setTimeout(() => track(event, data, tries - 1), 1000);
}
