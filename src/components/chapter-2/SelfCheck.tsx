"use client";

import { useState } from "react";
import { SELF_CHECK } from "@/content/chapter-2";

/** "Which applies to you?" — no score, nothing stored or sent; selections live in this component only. */
export function SelfCheck() {
  const [picked, setPicked] = useState<readonly string[]>([]);
  const toggle = (id: string) =>
    setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <section className="self-check" aria-labelledby="self-check-title">
      <h3 id="self-check-title">{SELF_CHECK.title}</h3>
      <p className="self-check-hint">{SELF_CHECK.hint}</p>
      <div className="self-check-options">
        {SELF_CHECK.options.map((o) => (
          <button key={o.id} type="button" aria-pressed={picked.includes(o.id)} onClick={() => toggle(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
      <p className="self-check-answer" aria-live="polite">{picked.length > 0 ? SELF_CHECK.answer : ""}</p>
    </section>
  );
}
