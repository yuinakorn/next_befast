"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SAY, SymptomScenes } from "./SymptomScenes";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const KEYS = ["B", "E", "F", "A", "S", "T"] as const;
type Key = (typeof KEYS)[number];

const LETTER_LABELS: Record<Key, string> = {
  B: "B: Balance เดินเซ",
  E: "E: Eyes ตามัว",
  F: "F: Face หน้าเบี้ยว",
  A: "A: Arm แขนขาอ่อนแรง",
  S: "S: Speech พูดไม่ชัด",
  T: "T: Time จำเวลา",
};

const CARDS: { k: Key; en: string; title: string; body: string; check: string }[] = [
  {
    k: "B", en: "Balance", title: "เดินเซ เสียการทรงตัว",
    body: "จู่ๆ ก็เวียนศีรษะ เดินเซ หรือทรงตัวไม่อยู่ ทั้งที่เมื่อครู่ยังปกติดี",
    check: "สังเกตว่าเซหรือล้มไปข้างหนึ่ง ต้องเกาะสิ่งรอบตัว ทั้งที่ไม่เคยเป็นมาก่อน",
  },
  {
    k: "E", en: "Eyes", title: "ตามัว เห็นภาพซ้อน",
    body: "มองไม่ชัดขึ้นมาทันที เห็นภาพซ้อน หรือมองไม่เห็นบางส่วน อาจเป็นตาข้างเดียวหรือทั้งสองข้าง",
    check: "ตอนนี้หน้าจอของคุณอาจดูเบลอและซ้อนกัน นี่คือสิ่งที่ผู้ป่วยบางคนเห็นจริงๆ",
  },
  {
    k: "F", en: "Face", title: "หน้าเบี้ยว ยิ้มไม่เท่ากัน",
    body: "ใบหน้าสองซีกไม่เท่ากัน มุมปากข้างหนึ่งตก หรือหนังตาข้างหนึ่งตก",
    check: "ให้ยิ้มหรือยิงฟัน แล้วดูว่ามุมปากสองข้างสูงเท่ากันไหม",
  },
  {
    k: "A", en: "Arm", title: "แขนขาอ่อนแรง ยกไม่ขึ้น",
    body: "แขนหรือขาข้างหนึ่งอ่อนแรง ชา หรือยกไม่ขึ้นทันที มักเป็นซีกเดียวของร่างกาย",
    check: "ให้ยกแขนทั้งสองข้างค้างไว้ 10 วินาที ถ้าข้างหนึ่งค่อยๆ ตก ให้สงสัยไว้ก่อน",
  },
  {
    k: "S", en: "Speech", title: "พูดไม่ชัด พูดลำบาก",
    body: "พูดไม่ชัด พูดไม่เป็นคำ นึกคำไม่ออก หรือฟังคนอื่นไม่เข้าใจ",
    check: "ให้พูดประโยคง่ายๆ ตาม เช่น “วันนี้อากาศดี” ถ้าพูดผิดหรือพูดไม่ออก ให้รีบไปโรงพยาบาล",
  },
  {
    k: "T", en: "Time", title: "จำเวลา รีบไปโรงพยาบาล",
    body: "จดเวลาที่เริ่มมีอาการ ถ้าตื่นนอนมาแล้วมีอาการ ให้นับจากเวลาสุดท้ายที่ยังเห็นว่าปกติ แพทย์ใช้เวลานี้ตัดสินใจว่ารักษาแบบไหนได้",
    check: "โทร 1669 ทันที เจอแค่ข้อเดียวก็ไม่ต้องรอ",
  },
];

const SPEECH_HEAD = CARDS[4].title;

const FACE0 = { mouth: "M110,196 Q160,238 210,196", y: 196, eyeRy: 13, eyeCy: 142, brow: "M178,118 Q197,108 216,120" };
const FACE1 = { mouth: "M110,196 Q166,232 210,222", y: 222, eyeRy: 7, eyeCy: 146, brow: "M178,123 Q197,118 216,130" };
const ARM_ORIGIN = "196 166";
const CLOCK_ORIGIN = "122 150";

// Thai-safe scramble: shuffle graphemes so vowels/tone marks stay on their consonant
const segmenter = typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter("th", { granularity: "grapheme" }) : null;
function shuffled(s: string) {
  const g = segmenter ? Array.from(segmenter.segment(s), (x) => x.segment) : Array.from(s);
  let out = s;
  for (let tries = 0; out === s && tries < 8; tries++) {
    const a = g.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    out = a.join("");
  }
  return out;
}

export function BefastStage() {
  const pinRef = useRef<HTMLElement>(null);
  const [sayText, setSayText] = useState(SAY);
  const [sayHead, setSayHead] = useState(SPEECH_HEAD);

  useGSAP(
    () => {
      const pin = pinRef.current!;
      const $ = <T extends Element = SVGElement>(sel: string) => pin.querySelector<T>(sel)!;
      const stage = $<HTMLElement>("#stage4");
      const letters = Array.from(pin.querySelectorAll<HTMLButtonElement>(".letters button"));
      const scenes = Array.from(pin.querySelectorAll<SVGGElement>(".scene"));
      const cards = Array.from(pin.querySelectorAll<HTMLElement>(".card"));
      const mouth = $("#mouth"), mouthGuide = $("#mouthGuide"), cornerR = $("#cornerR"), eyeR = $("#eyeR"), browR = $("#browR");
      const armR = $("#armR"), hands = [$("#secH"), $("#minH"), $("#hourH")];
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      let cur = -1;
      let loops: gsap.core.Animation[] = [];
      let timers: number[] = [];

      function setFace(f: typeof FACE0) {
        mouth.setAttribute("d", f.mouth);
        mouthGuide.setAttribute("y2", String(f.y));
        cornerR.setAttribute("cy", String(f.y));
        eyeR.setAttribute("ry", String(f.eyeRy));
        eyeR.setAttribute("cy", String(f.eyeCy));
        browR.setAttribute("d", f.brow);
      }

      function stopLoops() {
        loops.forEach((l) => l.kill());
        loops = [];
        timers.forEach((t) => clearInterval(t));
        timers = [];
        setFace(FACE0);
        setSayText(SAY);
        setSayHead(SPEECH_HEAD);
        gsap.set(armR, { rotation: 30, svgOrigin: ARM_ORIGIN });
        gsap.set(hands, { rotation: 0, svgOrigin: CLOCK_ORIGIN });
      }

      function startLoops(key: Key) {
        if (key === "F") {
          if (reduce) return setFace(FACE1);
          const tl = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 1.3, delay: 0.5, defaults: { duration: 1.3, ease: "power2.inOut" } });
          tl.to(mouth, { attr: { d: FACE1.mouth } }, 0)
            .to(mouthGuide, { attr: { y2: FACE1.y } }, 0)
            .to(cornerR, { attr: { cy: FACE1.y } }, 0)
            .to(eyeR, { attr: { ry: FACE1.eyeRy, cy: FACE1.eyeCy } }, 0)
            .to(browR, { attr: { d: FACE1.brow } }, 0);
          loops.push(tl);
        }
        if (key === "A") {
          if (reduce) return void gsap.set(armR, { rotation: 112, svgOrigin: ARM_ORIGIN });
          const ta = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
          ta.to(armR, { rotation: 132, svgOrigin: ARM_ORIGIN, duration: 2.8, ease: "power1.in", delay: 1.1 })
            .to(armR, { rotation: 30, svgOrigin: ARM_ORIGIN, duration: 0.7, ease: "power2.out", delay: 1.4 });
          loops.push(ta);
        }
        if (key === "S") {
          setSayText(shuffled(SAY));
          if (reduce) return;
          timers.push(window.setInterval(() => setSayText(shuffled(SAY)), 650));
          let n = 0;
          const hTimer = window.setInterval(() => {
            n++;
            if (n > 9) {
              setSayHead(SPEECH_HEAD);
              clearInterval(hTimer);
              return;
            }
            setSayHead(shuffled(SPEECH_HEAD));
          }, 95);
          timers.push(hTimer);
        }
        if (key === "T") {
          if (reduce) return void gsap.set(hands[1], { rotation: 60, svgOrigin: CLOCK_ORIGIN });
          const spin = (el: Element, duration: number) =>
            gsap.to(el, { rotation: 360, svgOrigin: CLOCK_ORIGIN, duration, ease: "none", repeat: -1 });
          loops.push(spin(hands[0], 6), spin(hands[1], 72), spin(hands[2], 864));
        }
      }

      function setLetter(i: number) {
        if (i === cur) return;
        cur = i;
        const key = KEYS[i];
        stage.dataset.fx = reduce ? "" : key;
        letters.forEach((b, j) => {
          b.classList.toggle("on", j === i);
          b.classList.toggle("done", j < i);
          if (j === i) b.setAttribute("aria-current", "step");
          else b.removeAttribute("aria-current");
        });
        scenes.forEach((s) => s.classList.toggle("on", s.dataset.k === key));
        cards.forEach((c) => c.classList.toggle("on", c.dataset.k === key));
        stopLoops();
        startLoops(key);
      }

      document.documentElement.classList.add("anim");
      ScrollTrigger.config({ ignoreMobileResize: true });
      const st = ScrollTrigger.create({
        trigger: pin,
        start: "top top",
        end: "+=560%",
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => setLetter(Math.min(KEYS.length - 1, Math.floor(self.progress * KEYS.length))),
      });
      setLetter(0);

      // tapping a letter scrolls to the middle of that letter's slice of the pin
      const onLetter = (e: Event) => {
        const i = Number((e.currentTarget as HTMLElement).dataset.i);
        const y = st.start + ((i + 0.5) / KEYS.length) * (st.end - st.start);
        window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
      };
      letters.forEach((b) => b.addEventListener("click", onLetter));

      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => {
        letters.forEach((b) => b.removeEventListener("click", onLetter));
        loops.forEach((l) => l.kill());
        timers.forEach((t) => clearInterval(t));
      };
    },
    { scope: pinRef },
  );

  return (
    // wrapper keeps ScrollTrigger's pin-spacer out of React-managed siblings
    <div>
      <section className="pin" id="pin4" ref={pinRef}>
        <div className="stage stage4" id="stage4" data-fx="">
          <nav className="letters" aria-label="สัญญาณเตือน BEFAST">
            {KEYS.map((k, i) => (
              <button key={k} type="button" data-i={i} aria-label={LETTER_LABELS[k]}>
                {k}
              </button>
            ))}
          </nav>

          <div className="scene-wrap fx-target">
            <SymptomScenes sayText={sayText} />
          </div>

          <div className="cards fx-target">
            {CARDS.map((c) => (
              <article key={c.k} className="card" data-k={c.k}>
                <p className="card-en">{c.en}</p>
                <h3>{c.k === "S" ? sayHead : c.title}</h3>
                <p>{c.body}</p>
                <p className="check">{c.check}</p>
              </article>
            ))}
          </div>
          <p className="hint">เลื่อนต่อเพื่อดูสัญญาณถัดไป หรือแตะตัวอักษรด้านบน</p>
        </div>
      </section>
    </div>
  );
}
