"use client";

import { useEffect, useRef, useState } from "react";
import { CLOSING, RECAP } from "@/content/closing";
import { readPosterTheme, renderRecapPoster } from "@/lib/recap-poster";
import { shareUrl } from "@/lib/share";
import { track } from "@/lib/track";

const LOGO = "/brand/wrb12-on-navy.webp";
/** How long "บันทึกภาพแล้ว" stays on screen. */
const MESSAGE_MS = 5000;

/** shared: the share sheet took it. downloaded: saved as a file. dismissed: sheet closed. failed: no image. */
type Outcome = "shared" | "downloaded" | "dismissed" | "failed";

const isAbort = (e: unknown) => typeof e === "object" && e !== null && (e as { name?: unknown }).name === "AbortError";

function makePoster(): Promise<Blob> {
  return renderRecapPoster(
    {
      title: RECAP.imageTitle,
      lines: CLOSING.summary,
      minutes: RECAP.minutes,
      disclaimer: RECAP.disclaimer,
      site: location.host,
    },
    readPosterTheme(),
    LOGO,
  );
}

function download(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = RECAP.fileName;
  document.body.append(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/**
 * "บันทึกภาพสรุป": the recap board as a 1080×1350 PNG. On a touch device with a share sheet that takes
 * files (LINE, Messenger, Photos), the sheet opens; otherwise the image downloads. The image is drawn
 * as soon as the button scrolls near the screen, so the tap can open the share sheet at once (iOS
 * only allows it straight after a tap). The outcome is sent to Umami, nothing else.
 */
export function RecapSave() {
  const ref = useRef<HTMLButtonElement>(null);
  const pending = useRef<Promise<Blob> | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const prepare = () => {
    pending.current ??= makePoster().catch((e: unknown) => {
      pending.current = null; // try again on the next tap
      throw e;
    });
    return pending.current;
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        prepare().catch(() => {});
      },
      { rootMargin: "50% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer.current);
    };
  }, []);

  async function onClick() {
    if (busy) return;
    setBusy(true);
    setMessage("");
    let outcome: Outcome = "failed";
    try {
      const blob = await prepare();
      const file = new File([blob], RECAP.fileName, { type: "image/png" });
      const data = { files: [file], title: RECAP.imageTitle.join(" "), text: `${RECAP.shareText} ${shareUrl(location.href)}` };
      const touch = window.matchMedia("(pointer: coarse)").matches;
      if (touch && navigator.canShare?.(data)) {
        try {
          await navigator.share(data);
          outcome = "shared";
        } catch (e) {
          if (isAbort(e)) outcome = "dismissed";
          else {
            download(blob);
            outcome = "downloaded";
          }
        }
      } else {
        download(blob);
        outcome = "downloaded";
      }
    } catch {
      outcome = "failed";
    } finally {
      setBusy(false);
    }
    track("recap-image", { outcome });
    window.clearTimeout(timer.current);
    if (outcome === "downloaded") {
      setMessage(RECAP.saved);
      timer.current = window.setTimeout(() => setMessage(""), MESSAGE_MS);
    } else if (outcome === "failed") setMessage(RECAP.failed);
  }

  return (
    <div className="recap-save">
      <button type="button" ref={ref} className="recap-save-btn" onClick={onClick} aria-busy={busy}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12,3 V15 M7,10 L12,15 L17,10" />
          <path d="M4,15 V19 C4,20 5,21 6,21 H18 C19,21 20,20 20,19 V15" />
        </svg>
        <span>{busy ? RECAP.saving : RECAP.save}</span>
      </button>
      <p className="recap-save-msg" aria-live="polite">{message}</p>
    </div>
  );
}
