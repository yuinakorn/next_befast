"use client";

import { useEffect, useRef, useState } from "react";
import { SHARE } from "@/content/chapter-8";
import { shareOrCopy } from "@/lib/share";

/** How long "คัดลอกลิงก์แล้ว" stays on screen. */
const MESSAGE_MS = 4000;

/**
 * "ส่งต่อให้คนที่คุณรัก": opens the system share sheet when the browser has one, otherwise copies the
 * page link and says so (aria-live). Closing the sheet or a refused copy is silent. Nothing is tracked.
 */
export function ShareButton() {
  const [message, setMessage] = useState("");
  const timer = useRef<number | undefined>(undefined);
  const busy = useRef(false);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function onClick() {
    if (busy.current) return;
    busy.current = true;
    try {
      const outcome = await shareOrCopy(navigator, { title: SHARE.title, text: SHARE.text, url: location.href });
      if (outcome === "copied") {
        setMessage(SHARE.copied);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setMessage(""), MESSAGE_MS);
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
    </div>
  );
}
