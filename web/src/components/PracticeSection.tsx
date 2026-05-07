"use client";

import { useState } from "react";
import PracticeModal from "./PracticeModal";
import type { Practice, ZoneId } from "@/lib/types";
import { ZONES } from "@/lib/zones";

interface PracticeSectionProps {
  zoneId: ZoneId;
  practices: Practice[];
  completed: string[];
  onComplete: (practiceId: string) => Promise<void>;
}

export default function PracticeSection({
  zoneId,
  practices,
  completed,
  onComplete,
}: PracticeSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const zone = ZONES[zoneId - 1];
  const open = practices.find((p) => p.id === openId) ?? null;
  const doneCount = practices.filter((p) => completed.includes(p.id)).length;

  return (
    <section className="mt-8">
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-coral font-semibold">
            你的當前任務
          </p>
          <h2 className="font-display text-2xl font-bold text-ink">
            {zone.title}・{zone.subtitle}
          </h2>
        </div>
        <p className="text-sm text-ink/60">
          {doneCount} / {practices.length} 完成
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {practices.map((p) => {
          const done = completed.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => setOpenId(p.id)}
              className={`text-left p-5 rounded-2xl border-2 transition-all hover:shadow-md hover:-translate-y-0.5
                ${done
                  ? "border-fresh bg-fresh/15"
                  : "border-ink/15 bg-white hover:border-coral"
                }
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-coral font-semibold">
                  練習 {p.id}
                </span>
                {done && <span className="text-lg" aria-label="已完成">🪷</span>}
              </div>
              <h3 className="font-display text-lg font-bold text-ink leading-tight mb-1">
                {p.title}
              </h3>
              <p className="text-sm text-ink/60">
                {done ? "已完成 — 點擊回顧步驟" : "點擊查看完整步驟"}
              </p>
            </button>
          );
        })}
      </div>

      {open && (
        <PracticeModal
          practice={open}
          done={completed.includes(open.id)}
          onClose={() => setOpenId(null)}
          onComplete={() => onComplete(open.id)}
        />
      )}
    </section>
  );
}
