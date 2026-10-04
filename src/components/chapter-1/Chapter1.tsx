import { CHAPTER_1 } from "@/content/chapter-1";
import { ChapterHead } from "@/components/ui/ChapterHead";
import { BrainCity } from "./BrainCity";

export function Chapter1() {
  return (
    <section className="chapter" id="ch1" aria-labelledby="ch1-title">
      <ChapterHead chapter={CHAPTER_1} titleId="ch1-title" />
      <BrainCity />
    </section>
  );
}
