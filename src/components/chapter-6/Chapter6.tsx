import { CHAPTER_6 } from "@/content/chapter-6";
import { ChapterHead } from "@/components/ui/ChapterHead";
import { PreventStage } from "./PreventStage";
import { PulseCheck } from "./PulseCheck";

export function Chapter6() {
  return (
    <section className="chapter" id="ch6" aria-labelledby="ch6-title">
      <ChapterHead chapter={CHAPTER_6} titleId="ch6-title" reverse />
      <PreventStage />
      <PulseCheck />
    </section>
  );
}
