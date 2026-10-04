export function Hero() {
  return (
    <header className="hero">
      <p className="hero-note">ตัวอย่างบทที่ 3 และ 4 จากสื่อการสอนเรื่องโรคหลอดเลือดสมอง</p>
      <h1>
        ทุกนาทีที่ช้า
        <br />
        คือสมองที่สูญเสีย
      </h1>
      <svg className="ecg" viewBox="0 0 1000 90" aria-hidden="true">
        <path
          pathLength={1}
          d="M0,50 H280 L300,50 L314,14 L330,84 L344,30 L356,50 H520 L538,50 L552,8 L568,88 L582,24 L596,50 H760 L776,50 L786,36 L798,62 L808,50 H1000"
        />
      </svg>
      <p className="hero-lead">
        สองบทนี้จะพาคุณไปดูว่าเวลาทำอะไรกับสมองเมื่อเกิดสโตรก แล้วฝึกจับสัญญาณเตือนให้ทัน
        ภาพทั้งหมดจะเดินตามจังหวะการเลื่อนของคุณ
      </p>
      <p className="cue">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4v15M5 12l7 7 7-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        เลื่อนลงเพื่อเริ่ม
      </p>
    </header>
  );
}
