# 生圖技能安裝包（gpt-image-2 × Claude Code / Copilot 通用）

> **給新手同學**：把這整份文件複製，貼給你的 Claude Code 或 GitHub Copilot，
> 說一句「請幫我照著這份文件完成安裝」，AI 就會自動幫你裝好。
> **不需要自己執行任何指令。**

---

## 這份文件會幫你做什麼

安裝完成後，你可以在**任何專案資料夾**裡對 AI 說：

> 「畫一隻穿西裝的龍蝦」

AI 會自動呼叫 OpenAI 的 **gpt-image-2** 生圖，存成 PNG 檔到你的專案裡。

- 每張圖約 **NT$0.3**（low 品質）
- 本包已內附 API Key，**你不需要自己申請 OpenAI 帳號**

---

## ════════════════════════════════════
## 🤖 AI 自動執行區（以下由 AI 完成，學員請勿手動操作）
## ════════════════════════════════════

你是 Claude Code 或 GitHub Copilot。
請依序完成以下所有任務。每個任務完成後繼續下一個，不要停下來詢問。
如果遇到錯誤，先嘗試修復，無法修復再告知使用者。

---

### 任務 1：偵測作業系統與 Python 環境

執行以下指令，確認環境：

```bash
python --version
pip --version
```

- 若顯示 Python 3.10 以上版本 → 繼續任務 2
- 若顯示 Python 3.9 以下 → 告知使用者需要升級到 Python 3.10+，暫停等待
- 若找不到 python 指令 → 告知使用者前往 https://python.org 下載安裝 Python 3.12，安裝時勾選「Add to PATH」，完成後再重新執行

---

### 任務 2：安裝 openai 套件

**Windows 執行：**
```bash
pip install openai
```

**macOS / Linux 執行：**
```bash
pip install openai --break-system-packages
```

安裝完成後確認版本：
```bash
pip show openai
```

---

### 任務 3：將 API Key 寫入全域設定檔

這份文件已內附教學用 API Key。請將以下內容寫入指定路徑的檔案。

**Windows 路徑**：`C:\Users\<當前使用者名稱>\.openai.env`
（請用 `echo %USERNAME%` 取得當前使用者名稱，自行替換路徑）

**macOS / Linux 路徑**：`~/.openai.env`

**檔案內容（完整複製，一字不差）：**
```
OPENAI_API_KEY=PASTE_YOUR_KEY_HERE
```

**注意事項：**
- 若檔案已存在且已有其他 Key，詢問使用者是否覆蓋
- 若檔案不存在，直接建立
- Windows 上若無法直接寫入 home 目錄，改用 PowerShell：
  ```powershell
  "OPENAI_API_KEY=PASTE_YOUR_KEY_HERE" | Out-File -FilePath "$env:USERPROFILE\.openai.env" -Encoding utf8
  ```

---

### 任務 4：建立生圖技能資料夾

**Windows：**
```bash
mkdir "%USERPROFILE%\.claude\skills\draw"
```

**macOS / Linux：**
```bash
mkdir -p ~/.claude/skills/draw
```

若資料夾已存在，繼續下一步（不報錯）。

---

### 任務 5：寫入 SKILL.md（技能描述檔）

將以下內容完整寫入：

**Windows 路徑**：`C:\Users\<當前使用者名稱>\.claude\skills\draw\SKILL.md`
**macOS/Linux 路徑**：`~/.claude/skills/draw/SKILL.md`

````markdown
---
name: draw
description: OpenAI gpt-image-2 生圖技能（全域可用）。當使用者要求「畫一張」、「生一張圖」、「做一張圖」、「產生圖片」、「畫個封面」、「畫插圖」、「畫示意圖」、「畫分鏡」等任何需要 AI 生成圖像的情境時，請一定要使用此技能。此技能會呼叫本地腳本以 gpt-image-2 模型生圖，自動判斷 quality 等級（預設 low），存檔至當前專案的 slides/generated/ 目錄（若無則建於當下工作目錄）。
---

# 生圖技能（gpt-image-2）

## 觸發情境
使用者說出：
- 「畫一張 XX」「生一張圖」「做一張圖」
- 「畫個封面／插圖／示意圖／分鏡」
- 「產生圖片」「幫我生圖」
- 「改這張圖」「把背景換成 XX」

## 腳本位置
- Windows：`C:\Users\<使用者名稱>\.claude\skills\draw\draw.py`
- macOS/Linux：`~/.claude/skills/draw/draw.py`

## 使用方式
```bash
python "<SKILL路徑>/draw.py" "要畫的內容" --name 檔名前綴
```

## 參數說明
| 參數 | 預設值 | 說明 |
|------|--------|------|
| prompt | 必填 | 要畫什麼（中英文皆可） |
| --size | 1024x1024 | 方形；1536x1024 橫；1024x1536 直 |
| --quality | low | low≈NT$0.3；medium≈NT$1.3；high≈NT$5.5 |
| --n | 1 | 一次生幾張（1–8） |
| --name | image | 輸出檔名前綴 |
| --outdir | 自動判斷 | 指定輸出目錄 |
| --edit | 無 | 改圖模式，填來源圖片路徑 |
| --mask | 無 | 遮罩圖片（搭配 --edit） |

## Quality 選擇原則
**預設永遠用 low**，不要自作主張升級。
- low：99% 情境夠用（簡報、插圖、封面、demo）
- medium / high：只在使用者明確要求時才用

## 錯誤代碼速查
| 錯誤 | 原因 | 處理方式 |
|------|------|----------|
| 403 Organization must be verified | 未完成身份驗證 | 告知使用者前往 platform.openai.com/settings/organization/general |
| 401 Invalid API key | Key 錯誤或未寫入 | 檢查 ~/.openai.env |
| 429 Rate limit / insufficient_quota | 額度用完 | 告知使用者聯絡課程講師 |

## 輸出規則
- 優先存到當前目錄的 `slides/generated/`
- 若 slides/ 不存在，改存到 `./generated/`
- 檔名格式：`<name>_<YYYYMMDD_HHMMSS>.png`
````

---

### 任務 6：寫入 draw.py（生圖腳本）

將以下 Python 程式碼完整寫入：

**Windows 路徑**：`C:\Users\<當前使用者名稱>\.claude\skills\draw\draw.py`
**macOS/Linux 路徑**：`~/.claude/skills/draw/draw.py`

```python
"""
全域生圖腳本（OpenAI gpt-image-2）
支援：文生圖、全圖改圖、遮罩改圖

API Key 讀取順序：
  1. 環境變數 OPENAI_API_KEY
  2. 當前目錄 .env
  3. 使用者 home 的 .openai.env（全域備援）
"""

import os
import sys
import base64
import argparse
from pathlib import Path
from datetime import datetime

MODEL = "gpt-image-2"
DEFAULT_SIZE = "1024x1024"
DEFAULT_QUALITY = "low"
DEFAULT_N = 1


def load_env_from_file(path: Path):
    if not path.exists():
        return
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def load_env():
    load_env_from_file(Path.cwd() / ".env")
    load_env_from_file(Path.home() / ".openai.env")


def resolve_outdir(user_outdir):
    if user_outdir:
        return Path(user_outdir)
    slides_dir = Path.cwd() / "slides"
    return (slides_dir / "generated") if slides_dir.exists() else (Path.cwd() / "generated")


def _save_results(result, name, n, outdir):
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    saved = []
    for i, item in enumerate(result.data):
        suffix = f"_{i + 1}" if n > 1 else ""
        out_path = outdir / f"{name}_{stamp}{suffix}.png"
        out_path.write_bytes(base64.b64decode(item.b64_json))
        saved.append(out_path)
        print(f"  [OK] {out_path}")
    return saved


def draw(prompt, size, quality, n, name, outdir):
    from openai import OpenAI
    if not os.getenv("OPENAI_API_KEY"):
        print("錯誤：找不到 OPENAI_API_KEY，請確認 ~/.openai.env 是否正確", file=sys.stderr)
        sys.exit(1)
    outdir.mkdir(parents=True, exist_ok=True)
    client = OpenAI()
    print(f"生圖中（{MODEL} / {size} / {quality} / n={n}）…", file=sys.stderr)
    result = client.images.generate(model=MODEL, prompt=prompt, size=size, quality=quality, n=n)
    return _save_results(result, name, n, outdir)


def edit_image(prompt, image_path, mask_path, size, quality, n, name, outdir):
    from openai import OpenAI
    if not os.getenv("OPENAI_API_KEY"):
        print("錯誤：找不到 OPENAI_API_KEY", file=sys.stderr)
        sys.exit(1)
    if not image_path.exists():
        print(f"錯誤：來源圖片不存在：{image_path}", file=sys.stderr)
        sys.exit(1)
    outdir.mkdir(parents=True, exist_ok=True)
    client = OpenAI()
    mode = "遮罩改圖" if mask_path else "全圖改圖"
    print(f"改圖中（{mode} / {MODEL} / {quality}）…", file=sys.stderr)
    kwargs = dict(model=MODEL, image=open(image_path, "rb"),
                  prompt=prompt, size=size, quality=quality, n=n)
    if mask_path:
        if not mask_path.exists():
            print(f"錯誤：遮罩圖片不存在：{mask_path}", file=sys.stderr)
            sys.exit(1)
        kwargs["mask"] = open(mask_path, "rb")
    result = client.images.edit(**kwargs)
    return _save_results(result, name, n, outdir)


def main():
    load_env()
    p = argparse.ArgumentParser(description="gpt-image-2 生圖腳本")
    p.add_argument("prompt", nargs="+", help="生圖提示詞")
    p.add_argument("--edit", default=None, metavar="IMAGE", help="改圖模式：來源圖片路徑")
    p.add_argument("--mask", default=None, metavar="MASK", help="遮罩圖片路徑（搭配 --edit）")
    p.add_argument("--size", default=DEFAULT_SIZE, help="圖片尺寸（預設 1024x1024）")
    p.add_argument("--quality", default=DEFAULT_QUALITY,
                   choices=["low", "medium", "high", "auto"], help="品質（預設 low）")
    p.add_argument("--n", type=int, default=DEFAULT_N, help="生成張數（預設 1）")
    p.add_argument("--name", default="image", help="輸出檔名前綴（預設 image）")
    p.add_argument("--outdir", default=None, help="輸出目錄（預設自動判斷）")
    args = p.parse_args()

    prompt = " ".join(args.prompt)
    outdir = resolve_outdir(args.outdir)

    if args.edit:
        edit_image(prompt, Path(args.edit),
                   Path(args.mask) if args.mask else None,
                   args.size, args.quality, args.n, args.name, outdir)
    else:
        draw(prompt, args.size, args.quality, args.n, args.name, outdir)


if __name__ == "__main__":
    main()
```

---

### 任務 7：確認安裝結果

逐一確認以下檔案存在：

**Windows：**
```bash
dir "%USERPROFILE%\.openai.env"
dir "%USERPROFILE%\.claude\skills\draw\SKILL.md"
dir "%USERPROFILE%\.claude\skills\draw\draw.py"
```

**macOS/Linux：**
```bash
ls -la ~/.openai.env ~/.claude/skills/draw/SKILL.md ~/.claude/skills/draw/draw.py
```

全部存在後，向使用者顯示以下完成訊息：

---

## ✅ 安裝完成！

**生圖技能已就緒。以後在任何專案裡，對 AI 說：**

> 「畫一隻穿西裝的龍蝦」
> 「幫我畫一張科技感的簡報封面，橫向」
> 「生一張貓咪插圖，flat design 風格」

AI 會自動生圖，存到你的專案的 `slides/generated/` 或 `./generated/` 資料夾。

**費用說明：**
- 每張圖約 NT$0.3（low 品質）
- API Key 由講師提供，有用量上限，請勿分享給他人

**若生圖失敗，常見錯誤：**
| 錯誤訊息 | 解決方式 |
|----------|----------|
| 429 / insufficient_quota | 額度用完，聯絡講師 |
| 401 Invalid API key | 重新安裝，或請講師確認 key |
| 403 Organization must be verified | 聯絡講師（key 設定問題） |
| ModuleNotFoundError: openai | 執行 `pip install openai` |

---

## ════════════════════════════════════
## 🤖 AI 執行區結束
## ════════════════════════════════════

---

## 給講師的備註

- **發放前**：用文字編輯器開啟此 md，將 `PASTE_YOUR_KEY_HERE` 替換為實際 API Key
- **Key 安全**：建議使用專用教學 key，並在 OpenAI 後台設定 Spending Limit（建議 $5/月，不自動儲值）
- **回收**：課程結束後至 platform.openai.com/api-keys 將該 key 刪除
- **學生系統**：Windows 10/11 為主，macOS 亦可用（路徑會自動切換）

---
*整合文件版本：Claude + Copilot 通用中文版*
