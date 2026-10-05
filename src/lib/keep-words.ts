/**
 * Thai loanwords the browser's line-break dictionary doesn't know, so it may split them across lines
 * (e.g. "ส|โตรก"). Add a word here to keep it whole.
 */
export const KEEP_WORDS: readonly string[] = ["สโตรก"];

/** U+2060 WORD JOINER: invisible, forbids a line break on either side, ignored by screen readers. */
const WJ = "⁠";

const joined = KEEP_WORDS.map((w) => [w, Array.from(w).join(WJ)] as const);

/** Returns `text` with a word joiner between the letters of every KEEP_WORDS word (idempotent). */
export function keepWords(text: string): string {
  let out = text;
  for (const [word, glued] of joined) if (out.includes(word)) out = out.split(word).join(glued);
  return out;
}
