import { Hero } from "@/components/Hero";
import { NextChapter } from "@/components/NextChapter";
import { SiteFooter } from "@/components/SiteFooter";
import { Chapter3 } from "@/components/chapter-3/Chapter3";
import { Chapter4 } from "@/components/chapter-4/Chapter4";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function Home() {
  return (
    <>
      <ProgressBar />
      <Hero />
      <Chapter3 />
      <Chapter4 />
      <NextChapter />
      <SiteFooter />
    </>
  );
}
