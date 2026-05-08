"use client";

import type { UserRow } from "@/lib/types";

interface NameplateProps {
  user: UserRow;
  isMe: boolean;
  driftClass?: string;
}

export default function Nameplate({ user, isMe, driftClass = "drift" }: NameplateProps) {
  const safeLotusCount = Math.max(0, Math.min(5, user.lotus_in_zone | 0));
  const lotuses = "🪷".repeat(safeLotusCount);

  return (
    <div
      className={`relative inline-flex flex-col items-center ${driftClass}`}
      style={{ padding: "12px 8px" }}
      title={user.name}
    >
      {/* Lotus row — horizontally centered above the name */}
      {safeLotusCount > 0 && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] leading-none whitespace-nowrap"
          style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))" }}
        >
          {lotuses}
        </div>
      )}

      {/* Vertical name with outside stroke (no color box) */}
      <div
        className={`vertical-name select-none leading-tight ${
          isMe ? "name-stroke-me text-sm" : "name-stroke text-xs"
        }`}
      >
        {user.name}
      </div>

      {/* Pointer arrow */}
      <div
        className={`mt-0.5 leading-none ${
          isMe ? "name-pointer-me text-[10px]" : "name-pointer text-[8px]"
        }`}
      >
        ▼
      </div>
    </div>
  );
}
