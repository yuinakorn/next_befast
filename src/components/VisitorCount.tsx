"use client";

import { useEffect, useState } from "react";
import { formatCount } from "@/lib/visitor-count";

/** Visitor total from Umami (via /api/visitors). Renders nothing until a count arrives. */
export function VisitorCount() {
  const [visitors, setVisitors] = useState<number | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/visitors", { signal: ctrl.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { visitors?: number | null } | null) => {
        if (typeof data?.visitors === "number" && data.visitors > 0) setVisitors(data.visitors);
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  if (visitors === null) return null;
  return (
    <div className="visitor-count" role="status" aria-live="polite">
      <span className="visitor-count-icon" aria-hidden="true">
        <svg viewBox="0 0 32 32">
          <circle cx="16" cy="10" r="4" />
          <circle cx="7" cy="13" r="3" />
          <circle cx="25" cy="13" r="3" />
          <path d="M9 25c0-5 3-8 7-8s7 3 7 8" />
          <path d="M2.5 25c0-4 2-6.5 5-6.5 1.2 0 2.3.4 3.1 1.2M29.5 25c0-4-2-6.5-5-6.5-1.2 0-2.3.4-3.1 1.2" />
        </svg>
      </span>
      <span className="visitor-count-copy">
        <span className="visitor-count-label">ร่วมเรียนรู้เรื่องสโตรกแล้ว</span>
        <span className="visitor-count-total">
          <strong className="visitor-count-num">{formatCount(visitors)}</strong>
          <span className="visitor-count-unit">คน</span>
        </span>
      </span>
    </div>
  );
}
