"use client";

import { useEffect } from "react";
import { REACH_SECTIONS, reachEvent, track } from "@/lib/track";

/** Reports each chapter once per visit, when its top crosses the middle of the screen. */
export function ReachTracker() {
  useEffect(() => {
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || seen.has(e.target.id)) continue;
          seen.add(e.target.id);
          io.unobserve(e.target);
          track(reachEvent(e.target.id));
        }
      },
      { rootMargin: "0px 0px -50% 0px" },
    );
    for (const id of REACH_SECTIONS) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);
  return null;
}
