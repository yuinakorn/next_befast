"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STEPS = [
  {
    at: 0,
    title: "นาฬิกาเริ่มเดิน ทันทีที่มีอาการ",
    body: "เมื่อลิ่มเลือดอุดหลอดเลือดสมอง เซลล์สมองตรงนั้นจะขาดออกซิเจนและเริ่มตายตั้งแต่นาทีแรก เลื่อนลงช้าๆ เพื่อเดินเวลา",
  },
  {
    at: 0.1,
    title: "ทุก 1 นาที เซลล์สมองตาย 1.9 ล้านเซลล์",
    body: "ทรายชมพูที่ร่วงลงไปแล้วกลายเป็นสีเทา คือเซลล์สมองที่ไม่มีวันกลับมา",
  },
  {
    at: 0.32,
    title: "ทุก 1 ชั่วโมง สมองแก่ลงราว 3.6 ปี",
    body: "งานวิจัยคำนวณว่า สโตรกที่ไม่ได้รักษา 1 ชั่วโมง ทำให้สมองสูญเสียเซลล์เท่ากับการแก่ตัวตามธรรมชาติราว 3.6 ปี",
  },
  {
    at: 0.52,
    title: "หน้าต่างแห่งโอกาส 270 นาที",
    body: "ยาละลายลิ่มเลือดต้องให้ภายใน 4.5 ชั่วโมง และก่อนให้ยา แพทย์ต้องสแกนสมองก่อนว่าตีบตันหรือแตก ยิ่งถึงโรงพยาบาลเร็ว ยิ่งมีเวลาพอ",
  },
  {
    at: 0.72,
    title: "ยังมีอีกทาง ถึง 24 ชั่วโมง",
    body: "ผู้ป่วยบางรายที่หลอดเลือดใหญ่อุดตัน แพทย์อาจใส่สายสวนเข้าไปดึงลิ่มเลือดออกได้ถึง 24 ชั่วโมง แต่ต้องเป็นผู้ป่วยที่เหมาะสม และสมองก็ยังเสียไปทุกนาทีเหมือนเดิม",
  },
  {
    at: 0.87,
    title: "ลองเลื่อนย้อนขึ้นไปดูสิ",
    body: "ทรายจะไหลกลับขึ้นไปเหมือนเดิม แต่ในชีวิตจริง เราย้อนเวลาไม่ได้ เห็นอาการเมื่อไหร่ จำเวลา แล้วรีบไปโรงพยาบาลทันที",
  },
];

/* scroll progress (0–1) at which the clock starts/stops and the timeline zooms out to 24 h */
const T0 = 0.08, T1 = 0.7, Z0 = 0.72, Z1 = 0.8;
/** Thrombolysis window in minutes (4.5 h). */
const WINDOW = 270;
const CELLS_PER_MIN = 1.9e6;
const BRAIN_YEARS_PER_HOUR = 3.6;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function BrainClock() {
  const pinRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const pin = pinRef.current!;
      const $ = <T extends Element = HTMLElement>(sel: string) => pin.querySelector<T>(sel)!;
      const steps = Array.from(pin.querySelectorAll<HTMLElement>(".step"));
      const sandTop = $<SVGRectElement>("#sandTop"), sandTopTex = $<SVGRectElement>("#sandTopTex");
      const sandBot = $<SVGPathElement>("#sandBot"), sandBotTex = $<SVGPathElement>("#sandBotTex");
      const stream = $<SVGLineElement>("#stream"), hg = $<SVGSVGElement>("#hg");
      const mCells = $("#mCells"), mClock = $("#mClock"), mAge = $("#mAge");
      const tlDrug = $("#tlDrug"), tlPassed = $("#tlPassed"), tlCath = $("#tlCath");
      const tlCathRow = $("#tlCathRow"), tlCursor = $("#tlCursor"), tlLeft = $("#tlLeft");
      const ax45 = $("#ax45"), ax24 = $("#ax24");
      let curStep = 0;

      function render(p: number) {
        let idx = 0;
        steps.forEach((s, i) => { if (p >= STEPS[i].at) idx = i; });
        if (idx !== curStep) {
          steps.forEach((s, j) => s.classList.toggle("on", j === idx));
          curStep = idx;
        }
        const t = clamp((p - T0) / (T1 - T0), 0, 1);
        const m = t * WINDOW;

        const ty = 58 + (184 - 58) * Math.pow(t, 2.1);
        const topH = Math.max(0, 186 - ty).toFixed(2);
        for (const r of [sandTop, sandTopTex]) { r.setAttribute("y", ty.toFixed(2)); r.setAttribute("height", topH); }
        const fill = Math.pow(t, 0.75), base = 338 - 92 * fill, h = 8 + 52 * fill;
        const d = `M30,${base.toFixed(2)} Q120,${(base - h).toFixed(2)} 210,${base.toFixed(2)} L210,344 L30,344 Z`;
        sandBot.setAttribute("d", d); sandBotTex.setAttribute("d", d);
        stream.setAttribute("opacity", t > 0.001 && t < 0.999 ? "1" : "0");
        stream.setAttribute("y2", Math.max(186, base - h / 2).toFixed(2));
        stream.style.strokeDashoffset = (-p * 2600).toFixed(1);
        hg.classList.toggle("closed", t >= 0.999);

        const hh = Math.floor(m / 60), mm = Math.floor(m % 60);
        mClock.textContent = `${hh}:${mm < 10 ? "0" : ""}${mm}`;
        mCells.textContent = Math.round(m * CELLS_PER_MIN).toLocaleString("en-US");
        mAge.textContent = ((m / 60) * BRAIN_YEARS_PER_HOUR).toFixed(1);

        const z = clamp((p - Z0) / (Z1 - Z0), 0, 1);
        const drugW = 100 - (100 - 18.75) * z; // 4.5 h shrinks to 4.5/24 of the axis
        tlDrug.style.width = `${drugW}%`;
        tlPassed.style.width = `${t * 100}%`;
        tlCursor.style.left = `${t * drugW}%`;
        tlCath.style.transform = `scaleX(${z})`;
        tlCathRow.style.opacity = String(z);
        ax24.style.opacity = String(z);
        ax45.style.left = `${drugW}%`;
        const left = WINDOW - Math.floor(m);
        if (left <= 0) {
          tlLeft.textContent = "หมดเวลาให้ยา";
          tlLeft.classList.add("out");
        } else {
          tlLeft.textContent = `เหลือ ${Math.floor(left / 60)} ชม. ${left % 60} นาที`;
          tlLeft.classList.remove("out");
        }
      }

      document.documentElement.classList.add("anim");
      ScrollTrigger.config({ ignoreMobileResize: true });
      const proxy = { p: 0 };
      gsap.to(proxy, {
        p: 1,
        ease: "none",
        scrollTrigger: { trigger: pin, start: "top top", end: "+=520%", pin: true, scrub: 0.6, anticipatePin: 1 },
        onUpdate: () => render(proxy.p),
      });
      render(0);
    },
    { scope: pinRef },
  );

  return (
    // wrapper keeps ScrollTrigger's pin-spacer out of React-managed siblings
    <div>
      <section className="pin" id="pin3" ref={pinRef}>
        <div className="stage stage3" id="stage3">
          <div className="hg-wrap">
            <Hourglass />
            <p className="legend">
              <span><i />เซลล์สมองที่ยังทำงาน</span>
              <span><i className="dead" />เซลล์ที่สูญเสียไป</span>
            </p>
          </div>

          <div className="time-panel">
            <div className="steps">
              {STEPS.map((s, i) => (
                <article key={s.at} className={i === 0 ? "step on" : "step"} data-at={s.at}>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </article>
              ))}
            </div>

            <div className="meters" aria-live="off">
              <div className="meter cells">
                <span className="m-label">เซลล์สมองที่สูญเสียไป</span>
                <span className="m-val" id="mCells">0</span>
              </div>
              <div className="meter">
                <span className="m-label">เวลาตั้งแต่เริ่มมีอาการ</span>
                <span className="m-val" id="mClock">0:00</span>
                <span className="m-unit">ชม.</span>
              </div>
              <div className="meter">
                <span className="m-label">สมองแก่ลงเทียบเท่า</span>
                <span className="m-val" id="mAge">0.0</span>
                <span className="m-unit">ปี</span>
              </div>
            </div>

            <div className="tl">
              <div className="tl-row">
                <span className="tl-name">ยาละลายลิ่มเลือด</span>
                <span className="tl-left" id="tlLeft">เหลือ 4 ชม. 30 นาที</span>
              </div>
              <div className="tl-body">
                <div className="tl-track">
                  <div className="tl-drug" id="tlDrug"><div className="tl-passed" id="tlPassed" /></div>
                </div>
                <div className="tl-cathrow" id="tlCathRow">
                  <div className="tl-row"><span className="tl-name">ใส่สายสวนดึงลิ่มเลือด ในผู้ป่วยที่เหมาะสม</span></div>
                  <div className="tl-track"><div className="tl-cath" id="tlCath" /></div>
                </div>
                <div className="tl-cursor" id="tlCursor" />
              </div>
              <div className="tl-axis" aria-hidden="true">
                <span id="ax0">0</span>
                <span id="ax45">4.5 ชม.</span>
                <span id="ax24">24 ชม.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Hourglass() {
  const glass =
    "M40,28 C40,104 110,150 113,180 C110,210 40,256 40,332 L200,332 C200,256 130,210 127,180 C130,150 200,104 200,28 Z";
  return (
    <svg
      id="hg"
      viewBox="0 0 240 360"
      role="img"
      aria-label="นาฬิกาทราย ทรายสีชมพูคือเซลล์สมองที่ยังทำงาน ร่วงลงไปกลายเป็นสีเทาเมื่อเวลาผ่านไป"
    >
      <defs>
        <clipPath id="clipTop"><path d="M42,30 C42,104 111,150 114,180 L126,180 C129,150 198,104 198,30 Z" /></clipPath>
        <clipPath id="clipBot"><path d="M114,180 C111,210 42,256 42,330 L198,330 C198,256 129,210 126,180 Z" /></clipPath>
        <pattern id="pGyri" width="36" height="22" patternUnits="userSpaceOnUse">
          <path d="M0 11 C5 2 13 2 18 11 S31 20 36 11" fill="none" stroke="#fff" strokeOpacity=".42" strokeWidth="2.2" strokeLinecap="round" />
        </pattern>
        <pattern id="pAsh" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="3" r="1.2" fill="#000" fillOpacity=".14" />
          <circle cx="7" cy="8" r="1" fill="#000" fillOpacity=".1" />
        </pattern>
        <linearGradient id="gStream" gradientUnits="userSpaceOnUse" x1="0" y1="180" x2="0" y2="320">
          <stop offset="0" style={{ stopColor: "var(--pink-deep)" }} />
          <stop offset="1" style={{ stopColor: "var(--ash-deep)" }} />
        </linearGradient>
      </defs>
      <path className="hg-glass" d={glass} />
      <g clipPath="url(#clipTop)">
        <rect id="sandTop" x="30" y="58" width="180" height="126" style={{ fill: "var(--pink)" }} />
        <rect id="sandTopTex" x="30" y="58" width="180" height="126" fill="url(#pGyri)" />
      </g>
      <g clipPath="url(#clipBot)">
        <path id="sandBot" d="M30,336 Q120,328 210,336 L210,342 L30,342 Z" style={{ fill: "var(--ash)" }} />
        <path id="sandBotTex" d="M30,336 Q120,328 210,336 L210,342 L30,342 Z" fill="url(#pAsh)" />
      </g>
      <line id="stream" x1="120" y1="176" x2="120" y2="330" stroke="url(#gStream)" strokeWidth="3.4" strokeLinecap="round" strokeDasharray="3 7" opacity="0" />
      <path className="hg-outline" d={glass} />
      <path className="hg-shine" d="M55,46 C57,94 90,130 103,158" />
      <path className="hg-shine" d="M55,314 C57,270 84,234 100,214" />
      <rect className="hg-post" x="25" y="28" width="7" height="304" rx="3" />
      <rect className="hg-post" x="208" y="28" width="7" height="304" rx="3" />
      <rect className="hg-cap" x="18" y="12" width="204" height="18" rx="7" />
      <rect className="hg-cap" x="18" y="330" width="204" height="18" rx="7" />
    </svg>
  );
}
