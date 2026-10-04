/** Share the page: the system share sheet when there is one, otherwise copy the link. No tracking. */

export type ShareData = { title: string; text: string; url: string };

/** The slice of `navigator` that sharing needs (so it can be tested without a browser). */
export type ShareNavigator = {
  share?: (data: ShareData) => Promise<void>;
  canShare?: (data: ShareData) => boolean;
  clipboard?: { writeText: (text: string) => Promise<void> };
};

/**
 * shared: the share sheet took it. copied: the link is on the clipboard.
 * dismissed: the reader closed the share sheet (nothing to say). failed: neither worked (stay silent).
 */
export type ShareOutcome = "shared" | "copied" | "dismissed" | "failed";

const isAbort = (e: unknown) => typeof e === "object" && e !== null && (e as { name?: unknown }).name === "AbortError";

async function copy(nav: ShareNavigator, url: string): Promise<ShareOutcome> {
  if (!nav.clipboard?.writeText) return "failed";
  try {
    await nav.clipboard.writeText(url);
    return "copied";
  } catch {
    return "failed";
  }
}

export async function shareOrCopy(nav: ShareNavigator, data: ShareData): Promise<ShareOutcome> {
  if (typeof nav.share === "function" && (typeof nav.canShare !== "function" || nav.canShare(data))) {
    try {
      await nav.share(data);
      return "shared";
    } catch (e) {
      if (isAbort(e)) return "dismissed";
      // the share sheet failed for another reason: the link can still be copied
    }
  }
  return copy(nav, data.url);
}
