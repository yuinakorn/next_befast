import { test } from "node:test";
import assert from "node:assert/strict";
import { CLOSING } from "../content/closing.ts";
import { choiceStatus, choose, firstTryCount, freshQuiz, solvedCount } from "./closing-quiz.ts";

test("a wrong choice is remembered, the question stays open", () => {
  const s = choose(freshQuiz(1)[0], 0, 1);
  assert.deepEqual(s, { wrong: [0], solved: false });
});

test("the right choice solves the question after any number of wrong ones", () => {
  let s = freshQuiz(1)[0];
  s = choose(s, 2, 1);
  s = choose(s, 0, 1);
  s = choose(s, 1, 1);
  assert.equal(s.solved, true);
  assert.deepEqual(s.wrong, [2, 0]);
});

test("a choice already known to be wrong is not recorded twice", () => {
  const once = choose(freshQuiz(1)[0], 0, 1);
  assert.equal(choose(once, 0, 1), once);
});

test("a solved question ignores further choices", () => {
  const solved = choose(freshQuiz(1)[0], 1, 1);
  assert.equal(choose(solved, 0, 1), solved);
});

test("solvedCount counts solved questions", () => {
  const states = freshQuiz(5);
  assert.equal(solvedCount(states), 0);
  states[0] = choose(states[0], 1, 1);
  states[3] = choose(states[3], 2, 2);
  assert.equal(solvedCount(states), 2);
});

test("choiceStatus marks open, wrong, right and the rest of a solved question as off", () => {
  const open = freshQuiz(1)[0];
  assert.equal(choiceStatus(open, 0, 1), "open");
  const tried = choose(open, 0, 1);
  assert.equal(choiceStatus(tried, 0, 1), "wrong");
  assert.equal(choiceStatus(tried, 2, 1), "open");
  const solved = choose(tried, 1, 1);
  assert.equal(choiceStatus(solved, 1, 1), "right");
  assert.equal(choiceStatus(solved, 0, 1), "off");
  assert.equal(choiceStatus(solved, 2, 1), "off");
});

test("every closing question can be solved by choosing its answer", () => {
  for (const q of CLOSING.quiz) {
    assert.equal(choose(freshQuiz(1)[0], q.answer, q.answer).solved, true, q.question);
  }
});

test("firstTryCount counts only questions solved without a wrong choice", () => {
  const states = [
    { wrong: [], solved: true },
    { wrong: [1], solved: true },
    { wrong: [], solved: false },
    { wrong: [2], solved: false },
  ];
  assert.equal(firstTryCount(states), 1);
});
