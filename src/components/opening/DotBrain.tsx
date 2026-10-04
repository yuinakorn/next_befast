"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import { BRAIN_PATH, BRAIN_VIEWBOX, generateDots, litCount, type Dot } from "@/lib/dot-brain";

export type DotBrainHandle = { setLit: (lit: number) => void };

type BrainState = { dots: Dot[]; lit: number; drawn: number };

const SEED = 1669;
// Fixed colours: this component only sits on the navy brand plate (same in both themes).
const LIT = "#EE7C86";
const LIT_HALO = "rgba(238, 124, 134, 0.22)";
const OFF = "rgba(167, 175, 192, 0.32)";

function paint(canvas: HTMLCanvasElement, s: BrainState, force: boolean) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const on = litCount(s.lit, s.dots.length);
  if (!force && on === s.drawn) return;
  s.drawn = on;

  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  }
  const scale = Math.min(w / BRAIN_VIEWBOX.width, h / BRAIN_VIEWBOX.height);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.translate((w - BRAIN_VIEWBOX.width * scale) / 2, (h - BRAIN_VIEWBOX.height * scale) / 2);
  ctx.scale(scale, scale);

  for (const d of s.dots) {
    const lit = d.order < on;
    if (lit) {
      ctx.fillStyle = LIT_HALO;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = lit ? LIT : OFF;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Brain drawn from points of light. `setLit(0–1)` dims dots in a fixed random order.
 * Without a `label` the drawing is decorative and hidden from screen readers.
 */
export function DotBrain({ ref, label }: { ref?: Ref<DotBrainHandle>; label?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef<BrainState>({ dots: [], lit: 1, drawn: -1 });

  useImperativeHandle(
    ref,
    () => ({
      setLit(lit: number) {
        state.current.lit = lit;
        if (canvasRef.current) paint(canvasRef.current, state.current, false);
      },
    }),
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const shape = new Path2D(BRAIN_PATH);
    const count = window.innerWidth < 768 ? 600 : 1000;
    // isPointInPath(Path2D, x, y) applies the context's current transform, and a previous paint()
    // (StrictMode re-run, Fast Refresh) leaves dpr/translate/scale on it: reset so x, y are BRAIN_VIEWBOX units
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    state.current.dots = generateDots(count, SEED, (x, y) => ctx.isPointInPath(shape, x, y));
    paint(canvas, state.current, true);
    const ro = new ResizeObserver(() => paint(canvas, state.current, true));
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="dot-brain" {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}>
      <svg
        className="dot-brain-outline"
        viewBox={`0 0 ${BRAIN_VIEWBOX.width} ${BRAIN_VIEWBOX.height}`}
        aria-hidden="true"
      >
        <path d={BRAIN_PATH} />
      </svg>
      <canvas ref={canvasRef} className="dot-brain-canvas" aria-hidden="true" />
    </div>
  );
}
