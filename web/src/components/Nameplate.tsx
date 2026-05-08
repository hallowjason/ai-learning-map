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
      style={{ padding: "18px 14px" }}
      title={user.name}
    >
      {/* Lotus row — horizontally centered above the name */}
      {safeLotusCount > 0 && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 text-xs leading-none whitespace-nowrap"
          style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))" }}
        >
          {lotuses}
        </div>
      )}

      {/* Vertical name with outside stroke (no color box) */}
      <div
        className={`vertical-name select-none leading-tight ${
          isMe ? "name-stroke-me text-base" : "name-stroke text-sm"
        }`}
      >
        {user.name}
      </div>

      {/* Pointer arrow */}
      <div
        className={`mt-1 leading-none ${
          isMe ? "name-pointer-me text-[12px] text-white" : "name-pointer text-[10px] text-white"
        }`}
      >
        ▼
      </div>
    </div>
  );
}
