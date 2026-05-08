"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signInByName } from "@/lib/progress";
import { assetPath } from "@/lib/assetPath";

const STORAGE_KEY = "ai-learning-map.userName";

export default function Landing() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) router.replace("/map");
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = name.trim();
    if (!trimmed) {
      setError("請輸入你的名字");
      return;
    }
    setSubmitting(true);
    try {
      await signInByName(trimmed);
      window.localStorage.setItem(STORAGE_KEY, trimmed);
      router.push("/map");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "未知錯誤";
      setError(`無法登入：${msg}`);
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-cream">
      <div className="grid w-full max-w-5xl gap-10 md:grid-cols-2 items-center">
        <div className="relative aspect-square w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={assetPath("/assets/zone1.png")}
            alt="起點村莊"
            fill
            sizes="(max-width: 768px) 90vw, 40vw"
            priority
            className="object-cover"
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-coral font-medium tracking-wider text-sm uppercase">AI Learning Map</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-ink leading-tight">
              你的 AI 學習旅程<br/>
              從村莊出發
            </h1>
            <p className="text-ink/70 leading-relaxed">
              填上你的名字，加入這趟從基礎到進階的 AI 練習旅程。
              每完成一階段練習，蓮花會綻放在你的名字旁，集滿就能上山。
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm text-ink/70 mb-1 block">你的名字</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：王小明"
                maxLength={20}
                className="w-full px-4 py-3 rounded-xl border-2 border-ink/15 bg-white text-ink text-lg focus:border-forest focus:outline-none transition-colors"
                autoFocus
              />
            </label>
            {error && <p className="text-coral text-sm">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 rounded-xl bg-ink text-cream text-lg font-medium hover:bg-forest transition-colors disabled:opacity-50"
            >
              {submitting ? "進入中…" : "進入地圖 →"}
            </button>
          </form>

          <p className="text-xs text-ink/50">
            名字會公開顯示在地圖上，讓夥伴看見你的位置。
          </p>
        </div>
      </div>
    </div>
  );
}
