import { Fragment } from "react";

/**
 * Thai has no spaces between words, so a browser breaks a headline wherever its dictionary allows,
 * sometimes in the middle of a phrase. Where the copy separates phrases with spaces, this keeps each
 * phrase on one line (`.phrase`) so a line can only break at those spaces. The text itself is unchanged.
 */
export function Phrases({ text }: { text: string }) {
  return text.split(" ").map((phrase, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      <span className="phrase">{phrase}</span>
    </Fragment>
  ));
}
