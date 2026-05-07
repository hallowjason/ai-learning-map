# AI 學習地圖 — 設定指引

## 1. Supabase Schema（一次性，~ 1 分鐘）

1. 開 [Supabase Dashboard](https://supabase.com/dashboard/project/nytlxamxgxyryfcuulrp/sql/new)
2. 開啟 [supabase/migrations/001_init.sql](./supabase/migrations/001_init.sql)
3. 複製整份 SQL 內容 → 貼進 Dashboard 的 SQL Editor
4. 點 **Run** （右下角）
5. 看到「Success. No rows returned」即完成

> **驗證**：到 Table Editor 應看到 `public.users` 表。Realtime 設定在 Database → Replication → 確認 `users` 已加入 publication。

## 2. 本地開發

```bash
cd web
npm run dev
```

開 [http://localhost:3000](http://localhost:3000)。

- 第一個頁面：填名字 → 進入地圖
- 地圖頁顯示 4 個 zone 全景，當前 zone 框起來
- 點底下的練習卡 → 跳出 modal → 看完按「我完成了 🪷」
- 完成同 zone 全部練習 → 自動進下一 zone

## 3. 內容更新（部署後）

地圖網頁是從 GitHub raw URL 抓 [課程架構.md](./課程架構.md)。
你只要改 md → push → 5 分鐘內網頁自動更新（CDN cache）。

要立刻看到變更：在 Vercel 後台手動 purge cache，或調整 [content.ts](./web/src/lib/content.ts) 裡的 `next: { revalidate: 300 }` 改短秒數。

## 4. 環境變數對照

`web/.env.local`（**永遠不 commit**）：

```
NEXT_PUBLIC_SUPABASE_URL=https://nytlxamxgxyryfcuulrp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...      ← 目前 v1 不用，留著備用
NEXT_PUBLIC_CONTENT_BASE_URL=      ← 部署到 Vercel 時填 GitHub raw URL
```

部署到 Vercel 時把這幾個變數複製貼到 Vercel Project Settings → Environment Variables。
