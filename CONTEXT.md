# Session Context — 2026-05-08

## 專案路徑
`/Users/gooo/Desktop/.claude/projects/ai-learning-map` (branch: main)
線上：**https://hallowjason.github.io/ai-learning-map/**

## 上次完成

**核心架構**：Next.js 16.2.5 (App Router) + Tailwind 4 + Supabase + GitHub Pages 靜態匯出
**功能完整度**：90%（登入、4 zone、蓮花計數、Realtime、自動部署都通），剩 UI bug 一個

**已完成**
- `/draw` 產出 5 張地圖素材（zone1-4 + panorama），用 outpainting + feather blend 接縫
- Supabase schema：`public.users`（name PK + current_zone + lotus_in_zone + completed_practices[]）+ RLS open + Realtime
- Course md → 11 張練習卡解析器（測試 11/11 通過）
- UI：登入填名 → /map 全景 + 浮動姓名牌 + 練習 modal + zone 跳級慶祝
- GitHub Action：push 自動 build static export → deploy GitHub Pages
- Secrets 已 set（`NEXT_PUBLIC_SUPABASE_URL` / `_ANON_KEY` / `_CONTENT_BASE_URL`）

**檔案結構**
```
ai-learning-map/
├── 課程架構.md              — 內容唯一來源（push 即更新）
├── 附件/                    — 教材原始資料
├── assets/                  — zone1-4.png + panorama.png + drafts/
├── supabase/migrations/001_init.sql
├── SETUP.md
├── .github/workflows/deploy.yml
└── web/                     — Next.js app
    ├── .env.local           — keys（不 commit）
    ├── public/assets/       — 5 張圖
    └── src/
        ├── app/             layout / page (登入) / map/page
        ├── components/      MapClient / Panorama / Nameplate / PracticeSection / PracticeModal
        └── lib/             supabase / types / zones / parseCourse / content / progress
```

## 待辦 / 未完成

1. **🐛 UI bug — 全景圖在 prod 沒顯示**（見此 session 截圖）
   - 4 zone 框 + 標籤都對，但底圖（panorama.png）沒出現
   - 直接 curl `${URL}/assets/panorama.png` 200 正常
   - 推測：`Panorama.tsx` 的 `<Image src="/assets/panorama.png">` 在 static export + basePath + unoptimized 沒自動加 prefix
   - **已派子 agent 排查中**（見子 agent 報告）
2. **README.md** — 已派另一個子 agent 寫
3. 可選優化（沒急）：
   - 100 人在線時腹地名牌 layout 擠不擠（目前 flex-wrap）
   - zone 切換 slide 動畫（目前只有 popup 慶祝）
   - mobile / 小螢幕沒測

## 重要決策與限制

**部署選擇歷程（重要）**
- ❌ Vercel：使用者 OAuth 帳號被誤刪，無法重註冊
- ❌ Zeabur：免費 shared cluster 已棄用，需自付費 server
- ✅ **GitHub Pages**：靜態匯出 + gh CLI（hallowjason 已 auth）+ 零成本
- 使用者偏好：**之後新專案優先用 Vercel CLI**（已寫進 memory），但本專案保持 GitHub Pages

**架構關鍵**
- 內容流：md push → GitHub raw URL fetch（5 分鐘 CDN cache）→ 即時更新，不用 rebuild
- 認證：純 localStorage 存 name（無密碼），RLS 開放（活動現場場控就好）
- 圖片：`unoptimized: true`（GitHub Pages 沒 Image Optimization API）
- basePath：`process.env.NEXT_PUBLIC_BASE_PATH`，CI 用 `actions/configure-pages` 自動取

**Supabase**
- Project ID：`nytlxamxgxyryfcuulrp`（xzj071@gmail.com 帳號）
- service_role key 留在 `web/.env.local` 備用，目前未使用
- Schema 已套用，RLS open（讀/寫/更新都允許 anon）

**已知限制**
- GitHub Pages 純靜態，所有 dynamic 都 client-side（Realtime 是純 WS 從 browser 直連 Supabase OK）
- panorama.png 6MB 首次載入慢；可優化方向：用 4 張 zone 圖各自顯示，或壓縮 panorama

## 下次繼續

```bash
cd /Users/gooo/Desktop/.claude/projects/ai-learning-map

# 本地開發
cd web && npm run dev

# 部署（直接 push）
git add -A && git commit -m "..." && git push

# 看部署狀態
gh run list --repo hallowjason/ai-learning-map --limit 3
```

**最先處理**：UI bug 修完（看子 agent 報告，通常一兩行 code 修好）→ 重測 prod。
