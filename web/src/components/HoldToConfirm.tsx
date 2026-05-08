"use client";

import { useEffect, useRef, useState } from "react";

interface HoldToConfirmProps {
  /** Called once when the user has held the button for `durationMs` */
  onConfirm: () => void | Promise<void>;
  /** Hold duration in ms */
  durationMs?: number;
  /** Idle label */
  label?: string;
  /** Label while user is actively holding */
  holdingLabel?: string;
  /** Label after confirm fires (final state, button disabled) */
  doneLabel?: string;
  className?: string;
}

/**
 * Press-and-hold confirmation button. Fills with coral as the user holds it.
 * Releasing before `durationMs` cancels the action and resets the fill.
 */
export default function HoldToConfirm({
  onConfirm,
  durationMs = 3000,
  label = "按住 3 秒確認完成",
  holdingLabel = "繼續按住…",
  doneLabel = "已記錄 🪷",
  className = "",
}: HoldToConfirmProps) {
  const [progress, setProgress] = useState(0); // 0..1
  const [holding, setHolding] = useState(false);
  const [done, setDone] = useState(false);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  function tick() {
    if (startRef.current == null) return;
    const elapsed = performance.now() - startRef.current;
    const p = Math.min(1, elapsed / durationMs);
    setProgress(p);
    if (p >= 1) {
      finish();
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  function finish() {
    if (done) return;
    setDone(true);
    setHolding(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    void onConfirm();
  }

  function start(e: React.PointerEvent<HTMLButtonElement>) {
    if (done) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setHolding(true);
    startRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
  }

  function cancel() {
    if (done) return;
    setHolding(false);
    startRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setProgress(0);
  }

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const pct = Math.round(progress * 100);
  const display = done ? doneLabel : holding ? `${holdingLabel} ${pct}%` : label;

  return (
    <button
      type="button"
      disabled={done}
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      className={`relative overflow-hidden px-5 py-3 rounded-md text-cream font-medium select-none transition disabled:cursor-default ${className}`}
      style={{
        backgroundColor: done ? "var(--color-coral)" : "var(--color-ink)",
        boxShadow: done
          ? "rgba(231,139,122,0.4) 0 0 0 4px"
          : "rgba(0,0,0,0.05) 0 1px 2px 0",
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "none",
      }}
    >
      {/* Coral fill that grows with progress */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 transition-[width]"
        style={{
          width: `${progress * 100}%`,
          backgroundColor: "var(--color-coral)",
          transitionDuration: holding ? "0ms" : "200ms",
        }}
      />
      <span className="relative z-10">{display}</span>
    </button>
  );
}
