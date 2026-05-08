"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PracticeModal from "@/components/PracticeModal";
import { loadCourse } from "@/lib/content";
import { ZONES, TOTAL_PRACTICES } from "@/lib/zones";
import type { Practice, ZoneId } from "@/lib/types";

/**
 * Admin / preview view.
 *
 * No name login, no Supabase users subscribe, no DB writes — just renders all
 * practice cards across the 4 zones so the workshop facilitator can browse the
 * full curriculum freely. Reuses PracticeModal in `previewOnly` mode (no
 * "complete" button).
 */
export default function AdminPage() {
  const [course, setCourse] = useState<Practice[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    loadCourse()
      .then(setCourse)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  const open = course?.find((p) => p.id === openId) ?? null;

  return (
    <div className="min-h-screen bg-cream">
      <header
        className="sticky top-0 z-10 bg-cream/85 backdrop-blur border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-coral font-medium">
              管理者檢視
            </p>
            <h1 className="font-display text-xl font-semibold text-ink tracking-tight">
              全部練習・{TOTAL_PRACTICES} 張卡片
            </h1>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <Link
              href="/map/?stress=100"
              className="px-3 py-1.5 rounded-md border text-ink hover:border-ink/40 transition"
              style={{ borderColor: "var(--color-border)" }}
            >
              壓力測試地圖 →
            </Link>
            <Link href="/" className="text-ink-soft hover:text-ink">
              返回登入
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div
            className="mb-6 p-4 rounded-xl border bg-coral/10 text-ink text-sm"
            style={{ borderColor: "var(--color-coral)" }}
          >
            載入練習失敗：{error}
          </div>
        )}

        {!course && !error && (
          <p className="text-center text-ink-soft py-16">載入中…</p>
        )}

        {course &&
          ZONES.map((zone) => {
            const zonePractices = zone.practiceIds
              .map((id) => course.find((p) => p.id === id))
              .filter((p): p is Practice => Boolean(p));
            return (
              <ZoneSection
                key={zone.id}
                zoneId={zone.id}
                zoneTitle={zone.title}
                zoneSubtitle={zone.subtitle}
                practices={zonePractices}
                onOpen={setOpenId}
              />
            );
          })}
      </main>

      {open && (
        <PracticeModal
          practice={open}
          done={false}
          previewOnly
          onClose={() => setOpenId(null)}
          onComplete={() => {}}
        />
      )}
    </div>
  );
}

function ZoneSection({
  zoneId,
  zoneTitle,
  zoneSubtitle,
  practices,
  onOpen,
}: {
  zoneId: ZoneId;
  zoneTitle: string;
  zoneSubtitle: string;
  practices: Practice[];
  onOpen: (id: string) => void;
}) {
  return (
    <section className="mb-10 last:mb-0">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-xs uppercase tracking-wider text-coral font-medium">
          Zone {zoneId}
        </span>
        <h2 className="font-display text-xl font-semibold text-ink tracking-tight">
          {zoneTitle}・{zoneSubtitle}
        </h2>
        <span className="text-xs text-ink-soft">{practices.length} 張</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {practices.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onOpen(p.id)}
            className="text-left p-5 rounded-xl border bg-cream transition-all hover:-translate-y-0.5 hover:border-ink/40"
            style={{ borderColor: "var(--color-border)" }}
          >
            <span className="text-xs uppercase tracking-wider text-coral font-medium">
              練習 {p.id}
            </span>
            <h3 className="font-display text-lg font-semibold text-ink leading-tight mt-1 mb-1 tracking-tight">
              {p.title}
            </h3>
            <p className="text-sm text-ink-soft">點擊查看完整步驟</p>
          </button>
        ))}
      </div>
    </section>
  );
}
