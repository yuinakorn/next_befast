import type { ChapterContent } from "@/content/types";
import { ChapterVisual } from "./ChapterVisual";

type Props = {
  chapter: ChapterContent;
  /** id of the <h2>, referenced by the chapter section's aria-labelledby. */
  titleId: string;
  /** Image on the left on desktop (alternates with the previous chapter). */
  reverse?: boolean;
};

export function ChapterHead({ chapter, titleId, reverse = false }: Props) {
  return (
    <header className={`ch-head ch-head--visual${reverse ? " ch-head--reverse" : ""}`}>
      <div className="ch-copy">
        <p className="ch-num">บทที่ {chapter.number}</p>
        <h2 id={titleId}>{chapter.title}</h2>
        <p className="lead">{chapter.lead}</p>
      </div>
      <ChapterVisual
        src={chapter.image}
        alt={chapter.imageAlt}
        variant={reverse ? "chapter-visual--leaf-reverse" : "chapter-visual--leaf"}
        sizes="(min-width: 861px) 64vw, 100vw"
      />
    </header>
  );
}
