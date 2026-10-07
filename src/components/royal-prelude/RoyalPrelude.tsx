import Image from "next/image";
import { ROYAL_ASSETS, ROYAL_PRELUDE } from "@/content/royal-prelude";
import { RoyalGallery } from "./RoyalGallery";

export function RoyalPrelude() {
  const portrait = ROYAL_ASSETS[ROYAL_PRELUDE.hero.image];

  return (
    <section id="royal-prelude" className="royal-prelude" aria-labelledby="royal-prelude-title">
      <header id="royal-hero" className="royal-hero">
        <div className="royal-hero-inner">
          <div className="royal-hero-copy">
            <div className="royal-brand-mark">
              <Image
                src="/brand/wrb12-on-navy.webp"
                alt="เดิน วิ่ง ปั่น ป้องกันอัมพาต ครั้งที่ 12"
                width={640}
                height={441}
                className="royal-brand-logo"
                preload
              />
            </div>
            <p className="royal-kicker">เฉลิมพระเกียรติ</p>
            <h1 id="royal-prelude-title">{ROYAL_PRELUDE.hero.title}</h1>
            <p className="royal-hero-lead">{ROYAL_PRELUDE.intro.lead}</p>
          </div>

          <figure className="royal-portrait">
            <Image
              src={portrait.src}
              alt={portrait.alt}
              width={portrait.width}
              height={portrait.height}
              sizes="(max-width: 699px) 82vw, (max-width: 860px) 48vw, 38vw"
              preload
            />
          </figure>
        </div>

        <a className="royal-scroll-cue" href="#royal-intro">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 4v15M5 12l7 7 7-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>เลื่อนลงเพื่อเริ่ม</span>
        </a>
      </header>

      <div id="royal-intro" className="royal-intro">
        <p className="royal-section-label">พระราชกรณียกิจด้านสุขภาพและกีฬา</p>
        <h2>{ROYAL_PRELUDE.intro.title}</h2>
        <span className="royal-rule" aria-hidden="true" />
      </div>

      <RoyalGallery>
        {ROYAL_PRELUDE.duties.map((duty, dutyIndex) => (
          <article
            className="royal-duty"
            data-royal-duty={dutyIndex}
            key={duty.id}
            aria-labelledby={`royal-duty-title-${dutyIndex}`}
          >
            <div className="royal-duty-copy">
              <p className="royal-duty-number" aria-hidden="true">
                {String(dutyIndex + 1).padStart(2, "0")}
              </p>
              <h3 id={`royal-duty-title-${dutyIndex}`}>{duty.title}</h3>
              {duty.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className={`royal-duty-media royal-duty-media--${duty.images.length}`}>
              {duty.images.map((imageId, imageIndex) => {
                const image = ROYAL_ASSETS[imageId];
                return (
                  <figure key={`${imageId}-${imageIndex}`}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      sizes="(max-width: 699px) calc(100vw - 40px), (max-width: 860px) 46vw, 44vw"
                    />
                  </figure>
                );
              })}
            </div>
          </article>
        ))}
      </RoyalGallery>
    </section>
  );
}
