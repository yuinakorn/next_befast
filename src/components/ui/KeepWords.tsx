"use client";

import { useEffect } from "react";
import { KEEP_WORDS, keepWords } from "@/lib/keep-words";

function fix(node: Node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const v = node.nodeValue ?? "";
    if (KEEP_WORDS.some((w) => v.includes(w))) node.nodeValue = keepWords(v);
    return;
  }
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) fix(n);
}

/**
 * Keeps KEEP_WORDS (e.g. "สโตรก") from breaking across lines anywhere on the page, including text
 * rendered later (quiz feedback). Runs after hydration, so the server HTML stays plain; it only edits
 * text nodes in place, which React leaves alone until that text itself changes.
 */
export function KeepWords() {
  useEffect(() => {
    fix(document.body);
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        if (r.type === "characterData") fix(r.target);
        else r.addedNodes.forEach(fix);
      }
    });
    mo.observe(document.body, { subtree: true, childList: true, characterData: true });
    return () => mo.disconnect();
  }, []);
  return null;
}
