/**
 * The recap as a 1080×1350 PNG the reader can keep or send on (RecapSave). Drawn straight onto a
 * canvas with the page's own fonts, so it needs a browser; the layout maths it shares with the
 * scene (wrapLines, numberRuns, the build figures) is tested in recap-scene.test.ts.
 * Always on the campaign navy plate, whatever the page theme: the image travels on its own.
 */
import { BEFAST, PREVENTABLE, WINDOW_MINUTES, numberRuns, wrapLines } from "./recap-scene.ts";
import { SHIELD_OUTLINE, SHIELD_PIECES } from "./shield.ts";

export const POSTER_W = 1080;
export const POSTER_H = 1350;

export type PosterCopy = {
  title: readonly string[];
  /** One sentence per row, next to its picture. */
  lines: readonly string[];
  minutes: string;
  disclaimer: string;
  site: string;
};

/** Colours and font stacks, read from the page's CSS custom properties (see readPosterTheme). */
export type PosterTheme = {
  navy: string;
  text: string;
  muted: string;
  alert: string;
  go: string;
  shield: string;
  font: string;
  num: string;
};

export function readPosterTheme(el: Element = document.body): PosterTheme {
  const css = getComputedStyle(el);
  const v = (name: string) => css.getPropertyValue(name).trim();
  return {
    navy: v("--brand-navy"),
    text: v("--on-brand"),
    muted: v("--on-brand-muted"),
    alert: v("--on-brand-alert"),
    go: v("--on-brand-go"),
    shield: v("--on-brand-shield"),
    font: v("--font"),
    num: v("--num"),
  };
}

type Ctx = CanvasRenderingContext2D;

const PAD = 72;
const ROW_TOP = 430;
const ROW_H = 260;
const ART_X = PAD + 110; // centre of the 220-wide picture column
const TEXT_X = 330;
const TEXT_W = POSTER_W - TEXT_X - PAD;
/** Pictures are drawn in the scene's own units (a 120×150 box around 0, 0), scaled up. */
const ART_SCALE = 1.5;

const fontOf = (t: PosterTheme, weight: number, size: number, num: boolean) => `${weight} ${size}px ${num ? t.num : t.font}`;

/** Width of `text` with its numbers in the numeral font. */
function measureMixed(ctx: Ctx, t: PosterTheme, text: string, weight: number, size: number): number {
  let w = 0;
  for (const run of numberRuns(text)) {
    ctx.font = fontOf(t, weight, size, run.num);
    w += ctx.measureText(run.text).width;
  }
  return w;
}

function drawMixed(ctx: Ctx, t: PosterTheme, text: string, x: number, y: number, weight: number, size: number) {
  ctx.textAlign = "left";
  for (const run of numberRuns(text)) {
    ctx.font = fontOf(t, weight, size, run.num);
    ctx.fillText(run.text, x, y);
    x += ctx.measureText(run.text).width;
  }
}

function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

/** Picture 1, finished: the six letters, an arrow, the clock and 1669 (same layout as the scene). */
function drawBefast(ctx: Ctx, t: PosterTheme) {
  ctx.lineWidth = 2.5;
  ctx.textAlign = "center";
  BEFAST.forEach((letter, k) => {
    const x = -40 + 40 * (k % 3), y = -56 + 40 * Math.floor(k / 3);
    roundRect(ctx, x - 16, y - 16, 32, 32, 7);
    ctx.strokeStyle = t.text;
    ctx.stroke();
    ctx.fillStyle = t.text;
    ctx.font = fontOf(t, 700, 20, true);
    ctx.fillText(letter, x, y + 7);
  });
  ctx.strokeStyle = t.muted;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(0, 10); ctx.lineTo(0, 30);
  ctx.moveTo(-6, 24); ctx.lineTo(0, 31); ctx.lineTo(6, 24);
  ctx.stroke();
  // clock: remember the time
  ctx.strokeStyle = t.text;
  ctx.beginPath();
  ctx.arc(-38, 52, 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-38, 52); ctx.lineTo(-38, 43);
  ctx.moveTo(-38, 52); ctx.lineTo(-32, 55);
  ctx.stroke();
  // 1669: the one thing to do, in the plate's alert red
  ctx.strokeStyle = t.alert;
  ctx.lineWidth = 3;
  roundRect(ctx, -18, 37, 76, 30, 15);
  ctx.stroke();
  ctx.fillStyle = t.alert;
  ctx.font = fontOf(t, 700, 19, true);
  ctx.fillText("1669", 20, 59);
}

/** Picture 2, finished: the whole 270-minute window as a ring, ticks every 30 minutes. */
function drawRing(ctx: Ctx, t: PosterTheme, minutes: string) {
  ctx.lineWidth = 12;
  ctx.strokeStyle = t.go;
  ctx.beginPath();
  ctx.arc(0, 0, 50, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.strokeStyle = t.muted;
  ctx.lineCap = "round";
  for (let k = 0; k < WINDOW_MINUTES / 30; k++) {
    const a = (k / (WINDOW_MINUTES / 30)) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * 34, Math.sin(a) * 34);
    ctx.lineTo(Math.cos(a) * 39, Math.sin(a) * 39);
    ctx.stroke();
  }
  ctx.textAlign = "center";
  ctx.fillStyle = t.text;
  ctx.font = fontOf(t, 700, 30, true);
  ctx.fillText(String(WINDOW_MINUTES), 0, 6);
  ctx.fillStyle = t.muted;
  ctx.font = fontOf(t, 500, 13, false);
  ctx.fillText(minutes, 0, 24);
}

/** Picture 3, finished: all 10 shield pieces lit, and 90%. */
function drawShield(ctx: Ctx, t: PosterTheme) {
  ctx.save();
  ctx.translate(-50, -78);
  ctx.scale(0.5, 0.5);
  const outline = new Path2D(SHIELD_OUTLINE);
  ctx.save();
  ctx.clip(outline);
  ctx.fillStyle = t.shield;
  for (const piece of SHIELD_PIECES) ctx.fill(new Path2D(piece.d));
  ctx.restore();
  ctx.lineWidth = 6;
  ctx.lineJoin = "round";
  ctx.strokeStyle = t.text;
  ctx.stroke(outline);
  ctx.restore();
  ctx.textAlign = "center";
  ctx.fillStyle = t.text;
  ctx.font = fontOf(t, 700, 26, true);
  ctx.fillText(`${PREVENTABLE}%`, 0, 72);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`image ${src}`));
    img.src = src;
  });
}

/** Waits for every font and weight the poster uses (they may not all be on screen yet). */
async function loadFonts(t: PosterTheme) {
  await Promise.all([
    document.fonts.load(fontOf(t, 700, 64, false), "ทุกนาที"),
    document.fonts.load(fontOf(t, 600, 40, false), "ทุกนาที"),
    document.fonts.load(fontOf(t, 500, 28, false), "ทุกนาที"),
    document.fonts.load(fontOf(t, 700, 40, true), "1669"),
    document.fonts.load(fontOf(t, 600, 40, true), "1669"),
  ]);
}

export async function renderRecapPoster(copy: PosterCopy, t: PosterTheme, logoSrc: string): Promise<Blob> {
  const [logo] = await Promise.all([loadImage(logoSrc), loadFonts(t)]);
  const canvas = document.createElement("canvas");
  canvas.width = POSTER_W;
  canvas.height = POSTER_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no 2d context");

  ctx.fillStyle = t.navy;
  ctx.fillRect(0, 0, POSTER_W, POSTER_H);

  const logoH = 120;
  ctx.drawImage(logo, PAD, 56, (logo.naturalWidth / logo.naturalHeight) * logoH, logoH);

  ctx.fillStyle = t.text;
  ctx.textBaseline = "alphabetic";
  copy.title.forEach((line, i) => drawMixed(ctx, t, line, PAD, 276 + i * 84, 700, 64));

  const pictures = [drawBefast, (c: Ctx, th: PosterTheme) => drawRing(c, th, copy.minutes), drawShield];
  copy.lines.forEach((sentence, i) => {
    const top = ROW_TOP + i * ROW_H;
    ctx.strokeStyle = t.muted;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(PAD, top);
    ctx.lineTo(POSTER_W - PAD, top);
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.save();
    ctx.translate(ART_X, top + ROW_H / 2);
    ctx.scale(ART_SCALE, ART_SCALE);
    pictures[i](ctx, t);
    ctx.restore();

    const size = 40, lead = 62;
    const lines = wrapLines(sentence, TEXT_W, (s) => measureMixed(ctx, t, s, 600, size));
    const y0 = top + ROW_H / 2 - ((lines.length - 1) * lead) / 2 + size * 0.36;
    ctx.fillStyle = t.text;
    lines.forEach((line, k) => drawMixed(ctx, t, line, TEXT_X, y0 + k * lead, 600, size));
  });

  ctx.fillStyle = t.muted;
  ctx.font = fontOf(t, 500, 28, false);
  ctx.textAlign = "left";
  ctx.fillText(copy.disclaimer, PAD, POSTER_H - 96);
  ctx.fillText(copy.site, PAD, POSTER_H - 52);

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("toBlob"))), "image/png"),
  );
}
