import { CHAPTER_5 } from "@/content/chapter-5";
import { ChapterHead } from "@/components/ui/ChapterHead";
import { ActionStage } from "./ActionStage";
import { MythCards } from "./MythCards";

export function Chapter5() {
  return (
    <section className="chapter" id="ch5" aria-labelledby="ch5-title">
      <ChapterHead chapter={CHAPTER_5} titleId="ch5-title" />
      <ActionStage />
      <MythCards />
    </section>
  );
}
