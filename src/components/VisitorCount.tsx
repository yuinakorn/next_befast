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
    <p className="visitor-count">
      ร่วมเรียนรู้แล้ว <span className="visitor-count-num">{formatCount(visitors)}</span> คน
    </p>
  );
}
