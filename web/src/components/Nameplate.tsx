"use client";

import { getDisplayName, type UserRow } from "@/lib/types";

interface NameplateProps {
  user: UserRow;
  isMe: boolean;
  driftClass?: string;
}

// Map nameplates use absolute pixel sizes so they're NOT affected by the
// global font-scale toggle (which scales rem-based UI text).
const SIZE_OTHERS = 12; // px
const SIZE_ME = 14;     // px

export default function Nameplate({ user, isMe, driftClass = "drift" }: NameplateProps) {
  const safeLotusCount = Math.max(0, Math.min(5, user.lotus_in_zone | 0));
  const lotuses = "🪷".repeat(safeLotusCount);
  const label = getDisplayName(user);

  return (
    <div
      className={`relative inline-flex flex-col items-center ${driftClass}`}
      style={{ padding: "12px 8px" }}
      title={label}
    >
      {/* Lotus row — horizontally centered above the name */}
      {safeLotusCount > 0 && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 leading-none whitespace-nowrap"
          style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))", fontSize: "10px" }}
        >
          {lotuses}
        </div>
      )}

      {/* Vertical name with outside stroke (no color box). Pixel-based size
          so global font scale doesn't affect map nameplates. */}
      <div
        className={`vertical-name select-none leading-tight ${
          isMe ? "name-stroke-me" : "name-stroke"
        }`}
        style={{ fontSize: `${isMe ? SIZE_ME : SIZE_OTHERS}px` }}
      >
        {label}
      </div>

      {/* Pointer arrow */}
      <div
        className={`mt-0.5 leading-none ${
          isMe ? "name-pointer-me" : "name-pointer"
        }`}
        style={{ fontSize: `${isMe ? 10 : 8}px` }}
      >
        ▼
      </div>
    </div>
  );
}
