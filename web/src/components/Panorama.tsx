"use client";

import Image from "next/image";
import Nameplate from "./Nameplate";
import { ZONES } from "@/lib/zones";
import { assetPath } from "@/lib/assetPath";
import type { UserRow, ZoneId } from "@/lib/types";

interface PanoramaProps {
  users: UserRow[];
  myName: string | null;
  myZone: ZoneId;
}

const driftClasses = ["drift", "drift drift-slow", "drift drift-fast"];

export default function Panorama({ users, myName, myZone }: PanoramaProps) {
  // Group users by zone
  const byZone: Record<ZoneId, UserRow[]> = { 1: [], 2: [], 3: [], 4: [] };
  for (const u of users) {
    const z = (Math.min(4, Math.max(1, u.current_zone)) as ZoneId);
    byZone[z].push(u);
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-lg bg-cream"
         style={{ aspectRatio: "3520 / 1024" }}>
      <Image
        src={assetPath("/assets/panorama.png")}
        alt="AI 學習地圖全景"
        fill
        sizes="100vw"
        priority
        className="object-cover select-none pointer-events-none"
      />

      {/* Zone overlays — one per zone, with nameplate cluster + highlight if it's mine */}
      {ZONES.map((zone) => {
        const zoneUsers = byZone[zone.id];
        const isMyZone = zone.id === myZone;
        return (
          <div
            key={zone.id}
            className={`absolute transition-all`}
            style={{
              left: `${(zone.id - 1) * 25}%`,
              top: 0,
              width: "25%",
              height: "100%",
              outline: isMyZone ? "3px solid rgba(231, 139, 122, 0.55)" : "none",
              outlineOffset: "-6px",
              borderRadius: "16px",
            }}
          >
            {/* Zone label */}
            <div className="absolute top-2 left-3 px-2 py-1 rounded-md bg-cream/85 backdrop-blur text-[11px] font-medium text-ink/70 shadow-sm">
              {zone.title}・{zone.subtitle}
              {isMyZone && <span className="ml-1 text-coral">（你在這）</span>}
            </div>

            {/* Nameplate cluster — flex wrap inside the zone's腹地 box */}
            <div
              className="absolute flex flex-wrap items-end gap-x-2 gap-y-3 overflow-hidden"
              style={{
                left: `${zone.cluster.x * 100}%`,
                top: `${zone.cluster.y * 100}%`,
                width: `${zone.cluster.w * 100}%`,
                height: `${zone.cluster.h * 100}%`,
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
}
