import Image from "next/image";
import type { StaticImageData } from "next/image";
import alcoholArt from "../../../public/illustrations/chapter-7-habit-alcohol.webp";
import calmArt from "../../../public/illustrations/chapter-7-habit-calm.webp";
import moveArt from "../../../public/illustrations/chapter-7-habit-move.webp";
import smokeArt from "../../../public/illustrations/chapter-7-habit-smoke.webp";
import vegArt from "../../../public/illustrations/chapter-7-habit-veg.webp";
import weightArt from "../../../public/illustrations/chapter-7-habit-weight.webp";
import type { HabitKind } from "./HabitIcons";

const HABIT_ART: Record<HabitKind, StaticImageData> = {
  move: moveArt,
  veg: vegArt,
  weight: weightArt,
  calm: calmArt,
  smoke: smokeArt,
  alcohol: alcoholArt,
};

export function HabitIllustration({ kind }: { kind: HabitKind }) {
  return (
    <div className="c7-step-visual" aria-hidden="true">
      <Image
        src={HABIT_ART[kind]}
        alt=""
        sizes="(min-width: 861px) 300px, (min-width: 700px) 280px, 210px"
      />
    </div>
  );
}
