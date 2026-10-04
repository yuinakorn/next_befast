import { CHAPTER_7 } from "@/content/chapter-7";
import { ChapterHead } from "@/components/ui/ChapterHead";
import { ShieldStage } from "./ShieldStage";
import { ShieldChecklist } from "./ShieldChecklist";

export function Chapter7() {
  return (
    <section className="chapter" id="ch7" aria-labelledby="ch7-title">
      <ChapterHead chapter={CHAPTER_7} titleId="ch7-title" />
      <ShieldStage />
      <ShieldChecklist />
    </section>
  );
}
