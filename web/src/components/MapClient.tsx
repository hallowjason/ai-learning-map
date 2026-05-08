"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Panorama from "./Panorama";
import PracticeSection from "./PracticeSection";
import RosterPanel from "./RosterPanel";
import RenameDialog from "./RenameDialog";
import FontScaleControl from "./FontScaleControl";
import { loadCourse } from "@/lib/content";
import { completePractice, setDisplayName, subscribeAllUsers } from "@/lib/progress";
import { getPracticesForZone } from "@/lib/parseCourse";
import { generateStressUsers } from "@/lib/stress";
import { ZONES, TOTAL_PRACTICES } from "@/lib/zones";
import { getDisplayName, type Practice, type UserRow, type ZoneId } from "@/lib/types";

const STORAGE_KEY = "ai-learning-map.userName";

export default function MapClient() {
  const router = useRouter();
  const [myName, setMyName] = useState<string | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [course, setCourse] = useState<Practice[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCelebrate, setShowCelebrate] = useState<ZoneId | null>(null);
  const [rosterOpen, setRosterOpen] = useState(false);
  const [rosterZone, setRosterZone] = useState<ZoneId | null>(null);
  const [renameOpen, setRenameOpen] = useState(false);
  const lastZoneRef = useRef<ZoneId | null>(null);

  // Read `?stress=N` once at mount for dev-only fake-user mode. The lazy
  // initialiser runs after hydration; SSR returns 0 and React reconciles.
  const [stressCount] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const params = new URLSearchParams(window.location.search);
    const n = parseInt(params.get("stress") ?? "0", 10);
    return Number.isFinite(n) && n > 0 ? Math.min(200, n) : 0;
  });

  // 1. Load user name from localStorage; redirect if absent
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      router.replace("/");
      return;
    }
    setMyName(saved);
  }, [router]);

  // 2. Subscribe to realtime users + load course content. In stress mode we
  // synthesise users locally and skip the realtime subscribe.
  useEffect(() => {
    if (!myName) return;
    loadCourse()
      .then(setCourse)
      .catch((e) => setError(`載入練習失敗：${e instanceof Error ? e.message : String(e)}`));

    if (stressCount > 0) {
      setUsers(generateStressUsers(stressCount, myName));
      return;
    }
    const unsub = subscribeAllUsers((rows) => setUsers(rows));
    return () => unsub();
  }, [myName, stressCount]);

  const me = users.find((u) => u.name === myName) ?? null;
  const myZone: ZoneId = (me?.current_zone ?? 1) as ZoneId;

  // 3. Detect zone transition for celebration
  useEffect(() => {
    if (!me) return;
    if (lastZoneRef.current === null) {
      lastZoneRef.current = myZone;
      return;
    }
    if (myZone > lastZoneRef.current) {
      setShowCelebrate(myZone);
      const t = setTimeout(() => setShowCelebrate(null), 3500);
      return () => clearTimeout(t);
    }
    lastZoneRef.current = myZone;
  }, [myZone, me]);

  async function handleComplete(practiceId: string) {
    if (!myName) return;
    await completePractice(myName, practiceId);
  }

  function openRoster(zoneId?: ZoneId) {
    setRosterZone(zoneId ?? null);
    setRosterOpen(true);
  }

  async function handleRename(newDisplayName: string | null) {
    if (!myName) return;
    if (stressCount > 0) {
      // Stress mode: update synthetic users locally without hitting DB.
      setUsers((prev) =>
        prev.map((u) => (u.name === myName ? { ...u, display_name: newDisplayName } : u))
      );
      return;
    }
    await setDisplayName(myName, newDisplayName);
  }

  if (!myName) return null;

  const zonePractices = course ? getPracticesForZone(course, myZone) : [];
  const totalDone = me?.completed_practices.length ?? 0;
  const allDone = totalDone >= TOTAL_PRACTICES;
  const myLabel = me ? getDisplayName(me) : myName;
  const progressPct = Math.round((totalDone / TOTAL_PRACTICES) * 100);

  return (
    <div className="min-h-screen bg-cream">
      <header
        className="sticky top-0 z-10 bg-cream/85 backdrop-blur border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-4 min-w-0">
            <span className="font-display text-xl font-semibold text-ink tracking-tight whitespace-nowrap">
              AI 學習地圖
            </span>
            {/* Progress bar */}
            <div
              className="hidden sm:flex items-center gap-2"
              role="progressbar"
              aria-valuenow={totalDone}
              aria-valuemin={0}
              aria-valuemax={TOTAL_PRACTICES}
              aria-label="全部進度"
            >
              <div
                className="w-32 h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: "rgba(28, 28, 28, 0.08)" }}
              >
                <div
                  className="h-full transition-[width] duration-500"
                  style={{
                    width: `${progressPct}%`,
                    background:
                      "linear-gradient(90deg, var(--color-coral) 0%, var(--color-ink) 100%)",
                  }}
                />
              </div>
              <span className="text-xs text-ink-soft whitespace-nowrap tabular-nums">
                {totalDone} / {TOTAL_PRACTICES}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <FontScaleControl />
            <button
              type="button"
              onClick={() => setRenameOpen(true)}
              className="text-sm text-ink-soft hover:text-ink flex items-center gap-1.5"
              title="修改顯示名稱"
            >
              <span aria-hidden>👋</span>
              <span className="font-medium text-ink">{myLabel}</span>
              <span aria-hidden className="text-ink-soft text-xs">✎</span>
            </button>
            <span className="text-coral text-xs whitespace-nowrap">
              Zone {myZone}・{ZONES[myZone - 1].subtitle}
            </span>
            <button
              onClick={() => {
                window.localStorage.removeItem(STORAGE_KEY);
                router.push("/");
              }}
              className="text-xs text-ink-soft hover:text-ink"
            >
              登出
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {error && (
          <div
            className="mb-4 p-4 rounded-xl border bg-coral/10 text-ink text-sm"
            style={{ borderColor: "var(--color-coral)" }}
          >
            {error}
          </div>
        )}

        <Panorama
          users={users}
          myName={myName}
          myZone={myZone}
          onOpenRoster={openRoster}
        />

        {allDone ? (
          <section
            className="mt-10 p-8 rounded-2xl bg-cream border text-center"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h2 className="font-display text-3xl font-semibold text-ink tracking-tight">🎉 恭喜登頂</h2>
            <p className="mt-2 text-ink-soft">你已完成全部 {TOTAL_PRACTICES} 個練習。山頂的旗子是為你而插。</p>
          </section>
        ) : course ? (
          <PracticeSection
            zoneId={myZone}
            practices={zonePractices}
            completed={me?.completed_practices ?? []}
            onComplete={handleComplete}
          />
        ) : (
          <p className="mt-8 text-center text-ink/50">載入練習中…</p>
        )}
      </main>

      {/* Floating roster trigger (always visible) */}
      <button
        type="button"
        onClick={() => openRoster()}
        className="fixed bottom-5 right-5 z-30 px-4 py-2.5 rounded-full bg-ink text-cream text-sm font-medium btn-inset hover:opacity-90 active:opacity-80 transition flex items-center gap-2"
        aria-label="開啟夥伴名單"
      >
        <span aria-hidden>👥</span>
        <span>{users.length}</span>
        <span className="hidden sm:inline">夥伴</span>
      </button>

      <RosterPanel
        users={users}
        myName={myName}
        open={rosterOpen}
        initialZone={rosterZone}
        onClose={() => setRosterOpen(false)}
      />

      <RenameDialog
        open={renameOpen}
        canonicalName={myName}
        currentDisplayName={me?.display_name ?? null}
        onClose={() => setRenameOpen(false)}
        onSave={handleRename}
      />

      {/* Stress-mode banner */}
      {stressCount > 0 && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-40 px-3 py-1.5 rounded-full text-[11px] font-medium bg-coral/95 text-cream btn-inset">
          🧪 壓力測試模式 — {stressCount} 假帳號（不寫入 DB）
        </div>
      )}

      {showCelebrate !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div
            className="bg-cream px-10 py-8 rounded-3xl border-2 text-center animate-bounce"
            style={{
              borderColor: "var(--color-coral)",
              boxShadow: "rgba(0,0,0,0.1) 0 4px 12px, rgba(0,0,0,0.08) 0 24px 48px",
            }}
          >
            <div className="text-6xl mb-2">🪷</div>
            <p className="font-display text-3xl font-semibold text-ink tracking-tight">進入 Zone {showCelebrate}</p>
            <p className="text-ink-soft mt-1">{ZONES[showCelebrate - 1].subtitle}</p>
          </div>
        </div>
      )}
    </div>
  );
}
