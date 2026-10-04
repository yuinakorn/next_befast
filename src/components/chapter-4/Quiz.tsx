"use client";

import Image from "next/image";
import { useState } from "react";
import { KEYS } from "./BefastStage";

const CASES = [
  {
    text: "คุณยายกำลังเล่าเรื่องตลาดเมื่อเช้า แล้วจู่ๆ ก็พูดไม่เป็นคำ ฟังไม่รู้เรื่อง",
    answer: "S",
    right: "นี่คือ S: Speech อาการพูดลำบากที่เกิดขึ้นทันที อย่ารอดูว่าจะหายเอง",
  },
  {
    text: "พี่ชายวัย 35 ตื่นนอนตอนเช้า แล้วพบว่ายกแขนขวาไม่ขึ้น ถือแก้วน้ำไม่อยู่",
    answer: "A",
    right: "นี่คือ A: Arm และเพราะเกิดตอนตื่นนอน ให้บอกแพทย์ว่าเห็นเขาปกติครั้งสุดท้ายเมื่อไหร่ เช่น ก่อนเข้านอน อายุน้อยก็เป็นสโตรกได้",
  },
  {
    text: "เพื่อนยิ้มให้กล้อง แต่มุมปากข้างซ้ายตกลง ทั้งที่เมื่อชั่วโมงก่อนยังยิ้มได้ปกติ",
    answer: "F",
    right: "นี่คือ F: Face หน้าเบี้ยวหรือยิ้มไม่เท่ากันที่เพิ่งเกิดขึ้น",
  },
];

const WRONG_T = "T สำคัญเสมอ แต่ก่อนอื่น ลองหาว่าอาการที่เห็นตรงกับสัญญาณไหน";
const WRONG = "ยังไม่ใช่ ลองดูอีกทีว่าอาการเกิดกับส่วนไหนของร่างกาย";

type CaseState = { wrong: string[]; solved: boolean };

export function Quiz() {
  const [state, setState] = useState<CaseState[]>(() => CASES.map(() => ({ wrong: [], solved: false })));
  const solvedCount = state.filter((s) => s.solved).length;
  const allSolved = solvedCount === CASES.length;

  function choose(ci: number, key: string) {
    setState((prev) =>
      prev.map((s, i) => {
        if (i !== ci || s.solved) return s;
        return key === CASES[ci].answer ? { ...s, solved: true } : { ...s, wrong: [...s.wrong, key] };
      }),
    );
  }

  return (
    <section className="quiz" aria-labelledby="quiz-title">
      <h3 id="quiz-title">ลองจับสัญญาณดู</h3>
      <p>อ่านแต่ละสถานการณ์ แล้วแตะตัวอักษรที่ตรงกับอาการที่สุด</p>
      <ol className="cases">
        {CASES.map((c, ci) => {
          const s = state[ci];
          const lastWrong = s.wrong[s.wrong.length - 1];
          return (
            <li key={ci} className={s.solved ? "case solved" : "case"}>
              <p className="case-text">{c.text}</p>
              <div className="choices" role="group" aria-label={`เลือกสัญญาณสำหรับสถานการณ์ที่ ${ci + 1}`}>
                {KEYS.map((k) => {
                  const isRight = s.solved && k === c.answer;
                  const isWrong = s.wrong.includes(k);
                  return (
                    <button
                      key={k}
                      type="button"
                      className={isRight ? "right" : isWrong ? "wrong" : undefined}
                      disabled={isWrong || (s.solved && !isRight)}
                      onClick={() => choose(ci, k)}
                    >
                      {k}
                    </button>
                  );
                })}
              </div>
              <p className="feedback" aria-live="polite">
                {s.solved ? (
                  <>
                    <strong>ถูกต้อง</strong> {c.right}
                  </>
                ) : lastWrong ? (
                  lastWrong === "T" ? WRONG_T : WRONG
                ) : null}
              </p>
            </li>
          );
        })}
      </ol>
      <p className="score" id="score">
        ตอบถูก {solvedCount} จาก {CASES.length}
      </p>
      <div className={allSolved ? "finale show" : "finale"} id="finale" hidden={!allSolved}>
        <figure className="action-visual">
          <Image
            src="/illustrations/chapter-4-call-1669.webp"
            alt="จำเวลาและโทร 1669"
            width={1536}
            height={1024}
            sizes="(min-width: 900px) 820px, 100vw"
          />
          <figcaption>
            <span className="action-label">เจอสัญญาณข้อเดียว ไม่ต้องรอ</span>
            <span className="big">1669</span>
            <p>จำเวลาที่เริ่มมีอาการ แล้วโทรทันที</p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
