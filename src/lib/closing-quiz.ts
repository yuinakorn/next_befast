/** State of the closing review quiz. It lives in the component only; only anonymous results are sent to Umami. */

export type QuestionState = {
  /** Choices tried and wrong, in order. */
  wrong: readonly number[];
  solved: boolean;
};

export const freshQuiz = (count: number): QuestionState[] => Array.from({ length: count }, () => ({ wrong: [], solved: false }));

/**
 * Choosing in a question: the right choice solves it, a wrong one is remembered (once).
 * A solved question ignores further choices, and so does a choice already known to be wrong.
 */
export function choose(state: QuestionState, choice: number, answer: number): QuestionState {
  if (state.solved || state.wrong.includes(choice)) return state;
  return choice === answer ? { ...state, solved: true } : { ...state, wrong: [...state.wrong, choice] };
}

/** Questions solved without a wrong choice first. */
export const firstTryCount = (states: readonly QuestionState[]): number =>
  states.filter((s) => s.solved && s.wrong.length === 0).length;

export const solvedCount = (states: readonly QuestionState[]): number => states.filter((s) => s.solved).length;

export type ChoiceStatus = "open" | "right" | "wrong" | "off";

/** How one choice looks: right once solved, wrong once tried, off (not pressable) for the rest of a solved question. */
export function choiceStatus(state: QuestionState, choice: number, answer: number): ChoiceStatus {
  if (state.solved) return choice === answer ? "right" : "off";
  return state.wrong.includes(choice) ? "wrong" : "open";
}
