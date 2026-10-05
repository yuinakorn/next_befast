import { test } from "node:test";
import assert from "node:assert/strict";
import { keepWords } from "./keep-words.ts";

test("glues the letters of สโตรก with word joiners", () => {
  assert.equal(keepWords("เรียกว่าสโตรกเตือน"), "เรียกว่าส⁠โ⁠ต⁠ร⁠กเตือน");
});

test("leaves text without the word unchanged and is idempotent", () => {
  assert.equal(keepWords("ความดันโลหิตสูง"), "ความดันโลหิตสูง");
  assert.equal(keepWords(keepWords("สโตรก")), keepWords("สโตรก"));
});
