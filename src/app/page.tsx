import { NextChapter } from "@/components/NextChapter";
import { SiteFooter } from "@/components/SiteFooter";
import { Chapter1 } from "@/components/chapter-1/Chapter1";
import { Chapter2 } from "@/components/chapter-2/Chapter2";
import { Chapter3 } from "@/components/chapter-3/Chapter3";
import { Chapter4 } from "@/components/chapter-4/Chapter4";
import { Opening } from "@/components/opening/Opening";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function Home() {
  return (
    <>
      <ProgressBar />
      <Opening />
      <Chapter1 />
      <Chapter2 />
      <Chapter3 />
      <Chapter4 />
      <NextChapter />
      <SiteFooter />
    </>
  );
}
