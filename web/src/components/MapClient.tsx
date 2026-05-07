"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Panorama from "./Panorama";
import PracticeSection from "./PracticeSection";
import { loadCourse } from "@/lib/content";
import { completePractice, subscribeAllUsers } from "@/lib/progress";
import { getPracticesForZone } from "@/lib/parseCourse";
import { ZONES, TOTAL_PRACTICES } from "@/lib/zones";
import type { Practice, UserRow, ZoneId } from "@/lib/types";

const STORAGE_KEY = "ai-learning-map.userName";

export default function MapClient() {
  const router = useRouter();
  const [myName, setMyName] = useState<string | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [course, setCourse] = useState<Practice[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCelebrate, setShowCelebrate] = useState<ZoneId | null>(null);
  const lastZoneRef = useRef<ZoneId | null>(null);

  // 1. Load user name from localStorage; redirect if absent
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      router.replace("/");
      return;
    }
    setMyName(saved);
  }, [router]);

  // 2. Subscribe to realtime users + load course content
  useEffect(() => {
    if (!myName) return;
    const unsub = subscribeAllUsers((rows) => setUsers(rows));
    loadCourse()
      .then(setCourse)
      .catch((e) => setError(`載入練習失敗：${e instanceof Error ? e.message : String(e)}`));
    return () => unsub();
  }, [myName]);

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

  if (!myName) return null;

  const zonePractices = course ? getPracticesForZone(course, myZone) : [];
  const totalDone = me?.completed_practices.length ?? 0;
  const allDone = totalDone >= TOTAL_PRACTICES;

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-10 bg-cream/85 backdrop-blur border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-xl font-bold text-ink">AI 學習地圖</span>
            <span className="hidden sm:inline text-xs text-ink/50">
              {totalDone} / {TOTAL_PRACTICES} 全部進度
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-ink/70">
              👋 <span className="font-medium text-ink">{myName}</span>
              <span className="ml-2 text-coral text-xs">
                Zone {myZone}・{ZONES[myZone - 1].subtitle}
              </span>
            </span>
            <button
              onClick={() => {
                window.localStorage.removeItem(STORAGE_KEY);
                router.push("/");
              }}
              className="text-xs text-ink/50 hover:text-ink"
            >
              登出
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {error && (
          <div className="mb-4 p-4 rounded-xl border-2 border-coral bg-coral/10 text-ink text-sm">
            {error}
          </div>
        )}

        <Panorama users={users} myName={myName} myZone={myZone} />

        {allDone ? (
          <section className="mt-10 p-8 rounded-2xl bg-mountain/15 border-2 border-mountain text-center">
            <h2 className="font-display text-3xl font-bold text-ink">🎉 恭喜登頂</h2>
            <p className="mt-2 text-ink/70">你已完成全部 {TOTAL_PRACTICES} 個練習。山頂的旗子是為你而插。</p>
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

      {showCelebrate !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-cream/95 px-10 py-8 rounded-3xl shadow-2xl border-4 border-coral text-center animate-bounce">
            <div className="text-6xl mb-2">🪷</div>
            <p className="font-display text-3xl font-bold text-ink">進入 Zone {showCelebrate}</p>
            <p className="text-ink/70 mt-1">{ZONES[showCelebrate - 1].subtitle}</p>
          </div>
        </div>
      )}
    </div>
  );
}
