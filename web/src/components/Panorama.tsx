"use client";

import { useState } from "react";
import Image from "next/image";
import Nameplate from "./Nameplate";
import { ZONES, ZONE_PAIR_IMAGES } from "@/lib/zones";
import { assetPath } from "@/lib/assetPath";
import type { UserRow, ZoneId } from "@/lib/types";

interface PanoramaProps {
  users: UserRow[];
  myName: string | null;
  myZone: ZoneId;
}

const driftClasses = ["drift", "drift drift-slow", "drift drift-fast"];

const PAIRS: ('A' | 'B')[] = ['A', 'B'];

const PAIR_LABELS: Record<'A' | 'B', { lesson: string; subtitle: string }> = {
  A: { lesson: 'Lesson 1', subtitle: '建立信心 → 建立習慣' },
  B: { lesson: 'Lesson 2', subtitle: '擴展能力 → 個人化' },
};

/**
 * Layout model — 2-pair carousel.
 *
 * Viewport is 2:1 wide (matches the natural aspect of one paired image).
 * Track holds two pair-slides side by side; each slide fills the viewport
 * and shows ONE entire paired image (zones 1+2 or zones 3+4 visible together).
 * translateX(-currentPair * 50%) switches between the two pairs.
 *
 * Cluster overlays sit on each zone's half of the visible pair, so both zones
 * in a pair show their nameplate clusters simultaneously.
 */
export default function Panorama({ users, myName, myZone }: PanoramaProps) {
  // Clamp myZone defensively — `current_zone` from the DB is unbounded number.
  const clampedZone = Math.min(4, Math.max(1, myZone)) as ZoneId;
  // Pair index: zones 1,2 → 0 ; zones 3,4 → 1
  const myPair = clampedZone <= 2 ? 0 : 1;

  // currentPair is derived: follow myPair unless user has manually overridden.
  const [override, setOverride] = useState<number | null>(null);
  const [trackedZone, setTrackedZone] = useState<ZoneId>(clampedZone);
  if (clampedZone !== trackedZone) {
    setTrackedZone(clampedZone);
    setOverride(null);
  }
  const currentPair = override ?? myPair;

  const byZone: Record<ZoneId, UserRow[]> = { 1: [], 2: [], 3: [], 4: [] };
  for (const u of users) {
    const z = Math.min(4, Math.max(1, u.current_zone)) as ZoneId;
    byZone[z].push(u);
  }

  const goTo = (idx: number) =>
    setOverride(((idx % PAIRS.length) + PAIRS.length) % PAIRS.length);
  const goPrev = () => goTo(currentPair - 1);
  const goNext = () => goTo(currentPair + 1);
  const isFirst = currentPair === 0;
  const isLast = currentPair === PAIRS.length - 1;

  return (
    <div className="relative">
      {/* Viewport — 2:1 wide so the entire paired image fits naturally with no
          vertical crop. Width fills page; height auto = width / 2. */}
      <div
        className="relative w-full mx-auto overflow-hidden rounded-2xl border bg-cream"
        style={{
          aspectRatio: "2 / 1",
          borderColor: "var(--color-border)",
        }}
      >
        {/* Track — 200% wide, 2 pair-slides */}
        <div
          className="absolute inset-0 flex"
          style={{
            width: "200%",
            transform: `translateX(-${currentPair * 50}%)`,
            transition: "transform 700ms cubic-bezier(0.77, 0, 0.175, 1)",
          }}
        >
          {PAIRS.map((pair) => {
            const pairZones = ZONES.filter((z) => z.pair === pair);
            return (
              <div
                key={pair}
                className="relative h-full"
                style={{ width: "50%", flexShrink: 0 }}
              >
                {/* Paired image — fills the slide (= 1 viewport-width × 1 viewport-height
                    at 2:1 aspect, exactly matches image's natural ratio). */}
                <Image
                  src={assetPath(ZONE_PAIR_IMAGES[pair])}
                  alt={`Pair ${pair}`}
                  fill
                  sizes="100vw"
                  priority={pair === (myPair === 0 ? 'A' : 'B')}
                  className="object-cover select-none pointer-events-none"
                />

                {/* Zone overlays — both halves of the pair render simultaneously */}
                {pairZones.map((zone) => {
                  const zoneUsers = byZone[zone.id];
                  const isMyZone = zone.id === clampedZone;
                  const halfLeft = zone.half === 'left' ? 0 : 50;
                  return (
                    <div
                      key={zone.id}
                      className="absolute top-0 h-full"
                      style={{
                        left: `${halfLeft}%`,
                        width: "50%",
                      }}
                    >
                      {/* Active-zone indicator */}
                      {isMyZone && (
                        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[11px] font-medium bg-ink text-cream btn-inset">
                          你在這 — {zone.subtitle}
                        </div>
                      )}

                      {/* Nameplate cluster — coords normalized to this half (1:1 box) */}
                      <div
                        className="absolute flex flex-wrap items-end gap-x-1 gap-y-2 z-20"
                        style={{
                          left: `${zone.cluster.x * 100}%`,
                          top: `${zone.cluster.y * 100}%`,
                          width: `${zone.cluster.w * 100}%`,
                          minHeight: `${zone.cluster.h * 100}%`,
                          overflow: "visible",
                        }}
                      >
                        {zoneUsers.map((u, i) => (
                          <Nameplate
                            key={u.name}
                            user={u}
                            isMe={u.name === myName}
                            driftClass={driftClasses[i % driftClasses.length]}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Prev arrow */}
        <button
          type="button"
          onClick={goPrev}
          disabled={isFirst}
          aria-label="上一段"
          className={`absolute left-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full grid place-items-center transition
            ${isFirst
              ? "bg-cream/40 text-ink/30 cursor-not-allowed"
              : "bg-cream/90 text-ink hover:bg-cream btn-inset backdrop-blur"
            }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        {/* Next arrow */}
        <button
          type="button"
          onClick={goNext}
          disabled={isLast}
          aria-label="下一段"
          className={`absolute right-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full grid place-items-center transition
            ${isLast
              ? "bg-cream/40 text-ink/30 cursor-not-allowed"
              : "bg-cream/90 text-ink hover:bg-cream btn-inset backdrop-blur"
            }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {/* Bottom pair tabs (2) */}
      <div role="tablist" aria-label="段落切換" className="mt-4 grid grid-cols-2 gap-2">
        {PAIRS.map((pair, idx) => {
          const isActive = idx === currentPair;
          const isMyPair = idx === myPair;
          const label = PAIR_LABELS[pair];
          return (
            <button
              key={pair}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => goTo(idx)}
              className={`text-left px-5 py-3 rounded-xl border transition-all
                ${isActive
                  ? "bg-ink text-cream border-ink btn-inset"
                  : "bg-cream text-ink hover:border-ink/40"
                }`}
              style={!isActive ? { borderColor: "var(--color-border)" } : undefined}
            >
              <div
                className={`text-[10px] uppercase tracking-wider ${
                  isActive ? "text-cream/70" : "text-ink-soft"
                }`}
              >
                {label.lesson}
                {isMyPair && <span className="ml-1.5 text-coral">●</span>}
              </div>
              <div className="text-sm font-medium leading-tight mt-0.5">
                {label.subtitle}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
