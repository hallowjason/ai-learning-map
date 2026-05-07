"use client";

import type { UserRow } from "@/lib/types";

interface NameplateProps {
  user: UserRow;
  isMe: boolean;
  driftClass?: string;
}

export default function Nameplate({ user, isMe, driftClass = "drift" }: NameplateProps) {
  const lotuses = "🪷".repeat(user.lotus_in_zone);

  return (
    <div className={`relative inline-flex flex-col items-center ${driftClass}`}>
      {/* Lotus row sits above the nameplate */}
      {user.lotus_in_zone > 0 && (
        <div
          className="absolute -top-5 right-0 text-xs leading-none whitespace-nowrap"
          style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.15))" }}
        >
          {lotuses}
        </div>
      )}

      {/* Vertical name */}
      <div
        className={`vertical-name px-1.5 py-2 rounded-md border-2 text-sm leading-tight tracking-widest select-none
          ${isMe
            ? "border-coral bg-coral/15 text-ink shadow-md font-bold scale-110 ring-2 ring-coral/40"
            : "border-ink/40 bg-cream/95 text-ink/85"
          }
        `}
        style={{ minHeight: "60px" }}
        title={user.name}
      >
        {user.name}
      </div>

      {/* Tiny pointer arrow under the plate */}
      <div
        className={`mt-0.5 text-[10px] leading-none ${isMe ? "text-coral" : "text-ink/40"}`}
      >
        ▼
      </div>
    </div>
  );
}
