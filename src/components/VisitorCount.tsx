"use client";

import { useEffect, useState } from "react";
import { formatCount, type VisitStats } from "@/lib/visitor-count";

/**
 * Visitors (people) and visits (sessions) from Umami, via /api/visitors. Renders nothing until a
 * visitor count arrives; visits shows only when it is a sensible number (at least the visitors).
 * Each half stays on one line, so on narrow screens the line breaks at the dot.
 */
export function VisitorCount() {
  const [stats, setStats] = useState<VisitStats | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/visitors", { signal: ctrl.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { visitors?: number | null; visits?: number | null } | null) => {
        if (typeof data?.visitors !== "number" || data.visitors <= 0) return;
        const visits = typeof data.visits === "number" && data.visits >= data.visitors ? data.visits : null;
        setStats({ visitors: data.visitors, visits });
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  if (stats === null) return null;
  return (
    <p className="visitor-count">
      <span className="visitor-count-part">
        ร่วมเรียนรู้แล้ว <span className="visitor-count-num">{formatCount(stats.visitors)}</span> คน
      </span>
      {stats.visits !== null && (
        <>
          <span className="visitor-count-sep" aria-hidden="true"> · </span>
          <span className="visitor-count-part">
            เข้าชม <span className="visitor-count-num">{formatCount(stats.visits)}</span> ครั้ง
          </span>
        </>
      )}
    </p>
  );
}
