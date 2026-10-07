import { createElement, type ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export function ScrollCue({ children = "เลื่อนลงเพื่อดูต่อ" }: Props) {
  return createElement(
    "p",
    { className: "scroll-cue" },
    createElement("span", null, children),
    createElement(
      "svg",
      {
        className: "scroll-cue-arrow",
        viewBox: "0 0 24 24",
        width: 24,
        height: 24,
        "aria-hidden": true,
      },
      createElement("path", {
        d: "M6 9l6 6 6-6",
        fill: "none",
        stroke: "currentColor",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2.5,
      }),
    ),
  );
}
