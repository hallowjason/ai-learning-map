"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ai-learning-map.fontScale";
const SCALES = [14, 16, 18, 20] as const;
const DEFAULT_SCALE = 16;

type ScalePx = (typeof SCALES)[number];

function isScale(n: number): n is ScalePx {
  return (SCALES as readonly number[]).includes(n);
}

/**
 * UI font-size scale control. Affects the document root font-size, which
 * in turn scales every rem-based size in the app. Map nameplates use
 * absolute pixel sizes so they're NOT affected.
 */
export default function FontScaleControl() {
  // Lazy initial — read localStorage on first render (client-only via window check).
  const [scale, setScale] = useState<ScalePx>(() => {
    if (typeof window === "undefined") return DEFAULT_SCALE;
    const stored = parseInt(window.localStorage.getItem(STORAGE_KEY) ?? "", 10);
    return isScale(stored) ? stored : DEFAULT_SCALE;
  });

  // Apply to <html> root font-size.
  useEffect(() => {
    document.documentElement.style.fontSize = `${scale}px`;
    window.localStorage.setItem(STORAGE_KEY, String(scale));
  }, [scale]);

  return (
    <div
      className="inline-flex items-center rounded-md border overflow-hidden"
      style={{ borderColor: "var(--color-border)" }}
      role="radiogroup"
      aria-label="字體大小"
    >
      {SCALES.map((s) => {
        const active = s === scale;
        return (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setScale(s)}
            className={`px-2 py-1 transition ${
              active
                ? "bg-ink text-cream"
                : "text-ink-soft hover:text-ink"
            }`}
            style={{ fontSize: `${s}px`, lineHeight: 1, minWidth: "1.6em" }}
            title={`${s}px`}
          >
            A
          </button>
        );
      })}
    </div>
  );
}
