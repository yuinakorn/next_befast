/** One scroll step inside a pinned chapter scene. */
export type Step = {
  /** Scroll progress (0–1) at which this step becomes active. */
  at: number;
  title: string;
  /** Break the title only at its spaces, never inside a phrase (for headlines the browser breaks badly). */
  keepPhrases?: boolean;
  body?: string;
  /** What a doctor must verify before publishing (★ in the script). Never shown on the page. */
  review?: string;
};

export type ChapterContent = {
  number: number;
  title: string;
  lead: string;
  /** Set when the lead is newly drafted rather than taken from the script. */
  leadReview?: string;
  /** Chapter-head illustration under /public; omit until the image exists. */
  image?: string;
  imageAlt: string;
  steps: Step[];
};

/** A review row for copy that is not a chapter step (cards, tools, quiz). Same columns as the report. */
export type ReviewNote = { where: string; text: string; check: string };
