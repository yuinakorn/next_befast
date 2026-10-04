"use client";

import { useEffect, useRef, useState } from "react";
import { SHARE } from "@/content/chapter-8";
import { shareOrCopy } from "@/lib/share";

/** How long "คัดลอกลิงก์แล้ว" stays on screen. */
const MESSAGE_MS = 4000;

/**
 * "ส่งต่อให้คนที่คุณรัก": opens the system share sheet when the browser has one, otherwise copies the
 * page link and says so (aria-live). Closing the sheet is silent. If neither sharing nor copying works,
 * the page link is shown as selectable text, with a line (aria-live) that says to copy it from there.
 * Nothing is tracked.
 */
export function ShareButton() {
  const [message, setMessage] = useState("");
  const [manualUrl, setManualUrl] = useState("");
  const timer = useRef<number | undefined>(undefined);
  const busy = useRef(false);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function onClick() {
    if (busy.current) return;
    busy.current = true;
    try {
      const url = location.href;
      const outcome = await shareOrCopy(navigator, { title: SHARE.title, text: SHARE.text, url });
      window.clearTimeout(timer.current);
      if (outcome === "copied") {
        setManualUrl("");
        setMessage(SHARE.copied);
        timer.current = window.setTimeout(() => setMessage(""), MESSAGE_MS);
      } else if (outcome === "shared") {
        setManualUrl("");
        setMessage("");
      } else if (outcome === "failed") {
        // stays on screen: the reader needs time to select and copy the link
        setManualUrl(url);
        setMessage(SHARE.copyFailed);
      }
    } finally {
      busy.current = false;
    }
  }

  return (
    <div className="chapter-extra c8-share">
      <button type="button" className="c8-share-btn" onClick={onClick}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="M8.6,10.6 L15.4,6.4 M8.6,13.4 L15.4,17.6" />
        </svg>
        <span>{SHARE.label}</span>
      </button>
      <p className="c8-share-msg" aria-live="polite">{message}</p>
      {manualUrl && <p className="c8-share-url">{manualUrl}</p>}
    </div>
  );
}
