"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { msUntilOpen, surveysOpen } from "@/lib/survey";

type Props = {
  /** link class from the section stylesheet, e.g. `closing-survey-link` */
  className: string;
  href: string;
  label: string;
  src: string;
  alt: string;
};

/** Re-renders once when the surveys open during this visit. */
function subscribeOpening(onChange: () => void) {
  const ms = msUntilOpen(Date.now());
  if (ms === null) return () => {};
  const t = window.setTimeout(onChange, ms);
  return () => window.clearTimeout(t);
}

/** Survey QR code with an "open link" button, or a blurred placeholder before the survey opens. */
export function SurveyQr({ className, href, label, src, alt }: Props) {
  // the static HTML is locked; on the client it opens once SURVEYS_OPEN_AT has passed
  const open = useSyncExternalStore(subscribeOpening, () => surveysOpen(Date.now()), () => false);

  if (!open) {
    return (
      <div className={className}>
        <div className="survey-qr-lock">
          <Image src={src} alt="" aria-hidden="true" width={1148} height={1148} sizes="(max-width: 699px) 68vw, 280px" />
          <p className="survey-qr-note">เริ่มประเมินได้ตั้งแต่ <span className="nowrap">26 ตุลาคม 2569</span></p>
        </div>
      </div>
    );
  }

  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
      <Image src={src} alt={alt} width={1148} height={1148} sizes="(max-width: 699px) 68vw, 280px" />
      <span>
        เปิดลิงก์กิจกรรม
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M14 5h5v5M19 5l-8 8M19 13v6H5V5h6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </a>
  );
}
