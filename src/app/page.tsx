import { CampaignFooter } from "@/components/CampaignFooter";
import { Chapter1 } from "@/components/chapter-1/Chapter1";
import { Chapter2 } from "@/components/chapter-2/Chapter2";
import { Chapter3 } from "@/components/chapter-3/Chapter3";
import { Chapter4 } from "@/components/chapter-4/Chapter4";
import { Chapter5 } from "@/components/chapter-5/Chapter5";
import { Chapter6 } from "@/components/chapter-6/Chapter6";
import { Chapter7 } from "@/components/chapter-7/Chapter7";
import { Chapter8 } from "@/components/chapter-8/Chapter8";
import { Closing } from "@/components/closing/Closing";
import { Opening } from "@/components/opening/Opening";
import { RoyalPrelude } from "@/components/royal-prelude/RoyalPrelude";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function Home() {
  return (
    <>
      <ProgressBar />
      <RoyalPrelude />
      <Opening />
      <Chapter1 />
      <Chapter2 />
      <Chapter3 />
      <Chapter4 />
      <Chapter5 />
      <Chapter6 />
      <Chapter7 />
      <Chapter8 />
      <Closing />
      <CampaignFooter />
    </>
  );
}
