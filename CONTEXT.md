# Session Context — 2026-05-09（夜間追加）

## 2026-05-09 夜間 session 摘要

主軸：**課程內容改版 v2（11→9 練習）+ 卡片渲染體驗強化**

### Commits（新到舊）
```
236f726 fix: inline copy-bar styles for CDN/cache resilience
c157568 fix(parser): cut practice body at horizontal rule (---)
2942038 feat: render Obsidian images + always-visible copy button
ba5a4a6 feat: course content v2 — 9 practices (was 11)
```

### 1. 課程內容 v2（ba5a4a6）

**改動**：用戶在 main 直接編輯 `課程架構.md` — 重新編號 + 移除 Google Calendar 練習 + 移除 4b
- 舊 11 張：`0,1,2,3,4a,5,6,7,8,9,4b`
- 新 9 張：`0,1,2,3,4,5,6,7,8`（連續編號）

**zones.ts 同步**：
| Zone | 舊 | 新 |
|---|---|---|
| 1 建立信心 | 0,1,2 | 0,1,2 |
| 2 建立習慣 | 3,4a | 3,4 |
| 3 擴展能力 | 7,5,6 | 5,6 |
| 4 個人化 | 8,9,4b | 7,8 |

進度條/總卡片數會自動跟著 `TOTAL_PRACTICES = ZONES.reduce(...)` 更新，不用手動改。

### 2. Obsidian 語法 → 標準 markdown（2942038）

`web/src/lib/content.ts` 加 `transformObsidianSyntax(md, baseUrl)`：
- `![[xxx.png]]` → `![xxx.png](<NEXT_PUBLIC_CONTENT_BASE_URL>/附件/xxx.png)`（從 GitHub raw 直接服務，免複製到 public/）
- `[[xxx]]` → `**「xxx」**`（粗體提示，附件由講師現場發 — 不公開）

新 PNG 加入 repo（`附件/*.png`，內容為 UI 截圖、無 secrets）。`.markdown-body img` CSS 加圓角 + 邊框 + 陰影。

### 3. 複製按鈕大改（2942038 + 236f726）

**舊**：右上角 hover 才出現的小按鈕（手機看不到）
**新**：黑色 header bar 永遠在程式碼框上方，左邊「提示詞 — 複製到 Codex / Claude 對話框」標籤，右邊「📋 複製 / ✓ 已複製」按鈕

`web/src/components/PracticeModal.tsx` 的 `CopyablePre` 組件改寫，**bar 跟按鈕的關鍵 layout（flex / 深色背景 / 按鈕邊框）用 inline style**（236f726 加上）— CDN edge cache 不同步或瀏覽器擴充注入 CSS 都不影響渲染。CSS class 也保留，雙保險。

### 4. Parser bug fix（c157568）

**Bug**：每個練習的 body 只在「下一個練習行」結束 → 最後一個練習會吃掉後面的 `---` 跟下一節 `## Lesson 2 下半` 標題，跑進卡片裡。

**修法**：`web/src/lib/parseCourse.ts` 新增 `isBoundary()` — body 走到 horizontal rule (`---`) 就提前截斷。下一節標題在 HR 之後，順帶排除。練習內部 `####` 子標題仍保留（未來擴充用）。

### 5. 課程架構 md 排版修正

ordered list 在 `1.打開` 沒空格時 markdown parser 不會渲染成數字列表 → 用戶（或某個 hook）已自動補上空格 `1. 打開`。

## ⚠️ 安全事件（已處置但需後續行動）

`附件/draw-skill-中文通用版.md` 跟 `附件/whisper-skill-中文通用版.md` 內含**真實 OpenAI API key**（`sk-proj-MLirvg3...`）— 用戶刻意內嵌、教學用。

**已處置**：
- GitHub Push Protection 擋下首次 push
- 我把 `附件/` 修改 unstage、用乾淨的 commit push（key 沒進 GitHub）
- 兩份 .md 仍在本機 working tree，**未被追蹤異動**（已存在於初始 commit `18c7e81` 之前的版本則無 key）

**用戶決定**：教學現場走群組分發附件、不放 GitHub。

**待做**：課程結束後到 https://platform.openai.com/api-keys revoke 這把 key（即使有 usage limit，外洩風險仍高）。下次開課重生新 key。

## 本次 session 用到的新工具

- **Claude Preview MCP**（`mcp__Claude_Preview__*`）— 跑本地 dev server + 直接 query DOM 驗證 CSS computed style，比 puppeteer + playwright 快很多
  - launch.json 在 `.claude/launch.json`（worktree root）
  - 主用法：`preview_start` → `preview_eval` 跑 IIFE 抓 `getComputedStyle()` → `preview_screenshot` 視覺確認

## 線上資源（更新）

- **網站**：https://hallowjason.github.io/ai-learning-map/
- **管理者頁**：https://hallowjason.github.io/ai-learning-map/admin/（顯示 9 張卡片）
- **Repo**：https://github.com/hallowjason/ai-learning-map

## 下次繼續的指令

```bash
cd /Users/gooo/Desktop/.claude/projects/ai-learning-map
# 對 Claude Code 說：「繼續上次的工作」
```

---

# Session Context — 2026-05-09

## 專案路徑
/Users/gooo/Desktop/.claude/projects/ai-learning-map (branch: main)

## 線上資源
- **網站**：https://hallowjason.github.io/ai-learning-map/
- **管理者頁**：https://hallowjason.github.io/ai-learning-map/admin/（無需登入、純預覽全部練習）
- **壓力測試**：在任何頁面加 `?stress=100`（最大 200，純前端、不寫 DB）
- **Repo**：https://github.com/hallowjason/ai-learning-map
- **DB**：Supabase project `nytlxamxgxyryfcuulrp`

## 本次 Session 摘要（2026-05-08 ~ 05-09）

主軸：**從「能跑」進化到「工作坊現場可用」**。視覺、體驗、無障礙、容量、管理者工具五個方向全面升級。

### 本 session 的 commits（新到舊）
```
f77e8d6 feat: editable display name + font scale + progress bar + hold-to-confirm
2edd53a feat: admin/preview page at /admin for facilitator review
7bac332 fix: load creamfont via next/font/local for static-export basePath
5ff58eb feat: per-zone visible cap + roster panel + stress-test mode
5244bd8 feat: paired-image carousel + Lovable theme + creamfont nameplates
```

### 重大改動

#### 1. 視覺系統大改（5244bd8）
- **配色**：套用 Lovable design system — cream `#f7f4ed` / charcoal `#1c1c1c` / `#eceae4` borders / inset shadow on dark buttons / 大標 `letter-spacing: -0.02em ~ -0.04em` 收緊
- **字體**：本地 creamfont-3.3，Noto Sans TC 作為 CJK fallback
- **地圖**：從「4 張 1:1 獨立 zone 圖橫排」改成「2 張 paired wide 圖（zone12.png / zone34.png 各 1536×768，2:1）」的 carousel
  - 每張 paired 圖內 zone 1↔2 / 3↔4 完全無縫（同一張圖）
  - 唯一切換點是 pair A↔B（zone 2↔3）
  - 視窗 2:1 widescreen，比之前 1:1 square 飽滿很多
- **名牌**：黑字 + 白色 outside stroke（`-webkit-text-stroke: 3px #fff` + `paint-order: stroke fill`），自己 = 4px stroke + 珊瑚紅 drop-shadow

#### 2. 容量設計（5ff58eb）
工作坊預期 ~100 人。每個 zone cluster 區域有上限，導入：
- **Cluster cap = 18**：自己永遠在第一順位、超過顯示「+N 位夥伴」chip → 點開 RosterPanel 篩到該 zone
- **RosterPanel**：右下角浮動 `👥 N 夥伴` 按鈕；點開抽屜（右側 360px）含搜尋框 + zone filter chips + 按 zone 分組名單；自己以珊瑚紅淺色高亮
- **壓力測試 `?stress=N`**：URL param 注入 N 個假學員（zone 分布 40/25/20/15），banner 提示，純前端、不寫 DB

#### 3. Font basePath fix（7bac332）
- 手寫 `@font-face { src: url("/fonts/...") }` 在 static export 不會加 basePath prefix → 上線 404
- 改用 `next/font/local` — Next.js 自動處理 hash + basePath，font 移到 `web/src/app/fonts/creamfont.otf`
- globals.css 的 `--font-sans` 改用 `var(--font-cream)`

#### 4. 管理者頁（2edd53a）
- 路徑 `/admin/`：列出全部 11 張練習卡（zone 分組）、不需登入、不訂閱 Supabase users
- 點開 PracticeModal 帶 `previewOnly` prop → 沒有「我完成了」按鈕
- header 連結到「壓力測試地圖」+「返回登入」

#### 5. 無障礙與防呆（f77e8d6 + migration 002）
- **可改顯示名稱**：DB 加 `display_name` 欄位（migration 002，**今天已執行**），canonical `name` PK 不變；header ✎ → RenameDialog
- **字體大小切換**：A⁻ / A / A⁺ / A⁺⁺ → 14/16/18/20px，存 localStorage；地圖名牌絕對 px 不受影響
- **進度 bar**：取代「2 / 11 全部進度」文字，珊瑚→ink 漸層條 + tabular-nums 比例
- **長按完成**：HoldToConfirm 元件（pointer-capture + RAF coral 漸層動畫），按「我完成了」→ 切換到 3 秒長按閘 → 完成才寫 DB

## 重要檔案索引（本次新增/動較多）
```
web/src/app/
├── admin/page.tsx                 # 管理者全部練習預覽（無登入）
├── fonts/creamfont.otf            # 本地字體（next/font/local 載入）
└── layout.tsx                     # 加 cream localFont + variable

web/src/components/
├── Panorama.tsx                   # 2-pair carousel（pair/half model）
├── Nameplate.tsx                  # 黑字白框 + clamp lotus + display_name
├── RosterPanel.tsx                # 浮動夥伴名單 + 搜尋 + zone filter
├── RenameDialog.tsx               # 改顯示名字
├── FontScaleControl.tsx           # 字體大小切換器
├── HoldToConfirm.tsx              # 長按 3 秒確認
├── PracticeModal.tsx              # 加 previewOnly + HoldToConfirm 整合
└── MapClient.tsx                  # 整合 stress mode / roster / rename / font scale

web/src/lib/
├── stress.ts                      # 假學員產生器（含 display_name: null）
├── zones.ts                       # pair 'A'/'B' + half 'left'/'right' + cluster 座標
├── types.ts                       # ZONE_PAIR_IMAGES + Zone (pair/half) + display_name
└── progress.ts                    # 加 setDisplayName() / getDisplayName()

web/public/assets/
├── zone12.png  (1536×768, 2:1)    # paired Lesson 1（村莊 → 森林）
└── zone34.png  (1536×768, 2:1)    # paired Lesson 2（溪谷 → 山頂）

supabase/migrations/
├── 001_init.sql                   # 已執行
└── 002_display_name.sql           # 已執行（2026-05-09）
```

## Supabase Schema 現況（含 002）
```sql
create table users (
  name TEXT primary key,
  display_name TEXT,                        -- ✨ 002 新增
  current_zone INT default 1,
  lotus_in_zone INT default 0,
  completed_practices TEXT[] default '{}',
  created_at TIMESTAMPTZ default now(),
  last_active TIMESTAMPTZ default now()
);
create index users_display_name_idx
  on users (lower(coalesce(display_name, name)));
-- RLS 全開、Realtime 已啟用
```

## 環境變數（GitHub Secrets 已設定）
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_CONTENT_BASE_URL` = `https://raw.githubusercontent.com/hallowjason/ai-learning-map/main`

## 關鍵技術陷阱（踩過的雷）

1. **next.js basePath 不會自動套用到 CSS `url()`** — 一律用 `next/font/local` / `next/image` 配 `assetPath()` helper
2. **Tailwind 4 + Turbopack HMR 卡 CSS** — 改 `@theme` token 後 dev server 不會更新 CSS chunk，要 `pkill next dev && rm -rf .next && npm run dev` 強制重啟
3. **多層 text-shadow 在中文字會疊成糊狀** — 一定要用 `-webkit-text-stroke` + `paint-order: stroke fill`，不能用 shadow 模擬
4. **viewport `aspectRatio: 1/1` + `maxHeight: vh` 會被 height 拉扁** — 用 `maxWidth: min(100%, Nvh)` 或 `aspectRatio: 2/1` 配自然 width 才正確
5. **assets 雙位置**：project root `/assets/` 是 `/draw` 輸出位置（草稿），實際靜態資源在 `web/public/assets/`，每次生圖要 cp 過去
6. **React 19 `react-hooks/set-state-in-effect`** — 在 effect 裡 setState 會被 lint 警告；prop 同步用 derive-during-render（兩個 useState + render-phase if）

## 下次可做（low priority）

- mobile RWD 名牌位置微調（手機上 cluster 容易被切）
- 想加更多卡片 / 改卡片 zone 歸屬 → 改 `課程架構.md` + 同步 `web/src/lib/zones.ts` 的 `ZONE_PRACTICES`
- 投影模式（隱藏 header、cluster 放大、自動輪播 pair A↔B）— 投在大螢幕用
- 多語言（i18n）— 目前繁中寫死

## 改 `課程架構.md` 並發布的指令

對 Claude Code 說：「**檢查課程架構.md 並發布**」 → 我會跑 parser 驗證 + build + push。

**必須維持的格式**：
- `## 練習 <id>：<title>` — `## 練習 ` 前綴 + 半形空白 + id + 全形冒號 + title
- id 不要動（會跟 `zones.ts` 對不上），常見：`0/1/2/3/4a/4b/5/6/7/8/9`
- 內容部分自由（任意 markdown）

新增/刪除卡片需同步改 `web/src/lib/zones.ts` 的 `ZONE_PRACTICES`，**告訴我** id 和要塞到哪個 zone，我會幫你動。

## 下次繼續的指令
```
cd /Users/gooo/Desktop/.claude/projects/ai-learning-map
# 對 Claude Code 說：「繼續上次的工作」
```
