# AI 學習地圖

互動式網頁活動，幫助學員在工作坊中漸進式學習 AI 工具。完成練習後蓮花綻放在名字旁，集滿就自動進入下一個課程區域。所有人 Realtime 同步看見彼此進度。

**線上展示**：[https://hallowjason.github.io/ai-learning-map/](https://hallowjason.github.io/ai-learning-map/)

## 技術棧

- **前端**：Next.js 16.2.5（App Router）+ TypeScript + Tailwind CSS 4
- **後端**：Supabase（PostgreSQL + Realtime + RLS）
- **託管**：GitHub Pages（靜態匯出）
- **CI/CD**：GitHub Actions（自動部署）
- **內容管理**：GitHub raw URL 即時抓取（無需重新構建）

## 快速開始

### 本地開發

```bash
cd web
npm run dev
```

打開 [http://localhost:3000](http://localhost:3000)，填入名字進入地圖。

### 部署

```bash
git push  # 自動觸發 GitHub Action，~90 秒後上線
```

### 更新課程內容

編輯 [`課程架構.md`](./課程架構.md)，commit 並 push：

```bash
git commit -m "update: 修正練習 5 內容" && git push
```

5 分鐘內網頁自動從 GitHub raw CDN 拉取最新版本，無需重新構建。

## 核心概念

- **4 個課程區域**：Lesson 1 上下 + Lesson 2 上下
- **蓮花綻放**：完成練習時在名字右上綻放 🪷，同區內計數
- **自動進級**：集滿該區全部蓮花 → 自動跳入下一區（蓮花計數歸零）
- **Realtime 同步**：100 人同時看見彼此實時進度

## 檔案結構

```
ai-learning-map/
├── 課程架構.md              — 課程內容唯一來源
├── 附件/                    — 教材附檔
├── assets/                  — 地圖素材（zone1-4 + panorama）
├── supabase/migrations/     — 數據庫 schema
├── SETUP.md                 — 詳細設定指引
├── .github/workflows/       — 自動部署配置
└── web/                     — Next.js 應用
    ├── public/assets/       — 靜態資源
    └── src/
        ├── app/             — 路由和頁面
        ├── components/      — 組件（地圖、蓮花、練習 modal 等）
        └── lib/             — 工具函數和類型定義
```

## 環境變數

需在 `web/.env.local`（永不提交）配置：

```
NEXT_PUBLIC_SUPABASE_URL=https://nytlxamxgxyryfcuulrp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_CONTENT_BASE_URL=https://raw.githubusercontent.com/hallowjason/ai-learning-map/main/
```

詳見 [`SETUP.md`](./SETUP.md)。

## 貢獻

1. 編輯 [`課程架構.md`](./課程架構.md) 更新課程內容
2. 改進 UI 組件（`web/src/components/`）
3. Submit pull request

## License

MIT

---

詳細的本地開發和 Supabase 設定請見 [`SETUP.md`](./SETUP.md)。
