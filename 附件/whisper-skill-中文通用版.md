# 語音轉文字技能安裝包（OpenAI Whisper × Claude Code / Codex 通用）

> **給新手同學**：把這整份文件複製，貼給你的 Claude Code 或 GitHub Copilot，
> 說一句「請幫我照著這份文件完成安裝」，AI 就會自動幫你裝好。
> **不需要自己執行任何指令。**

---

## 這份文件會幫你做什麼

安裝完成後，你可以在**任何專案資料夾**裡對 AI 說：

> 「幫我把這個錄音檔轉成文字」

AI 會自動呼叫 OpenAI 的 **Whisper API** 進行語音辨識，將錄音轉成文字，存成 `.txt` 檔到你的專案裡。

- 每分鐘約 **NT$0.18**（$0.006 USD）
- 一段 10 分鐘會議錄音 ≈ NT$2
- 本包已內附 API Key，**你不需要自己申請 OpenAI 帳號**

**支援格式：** mp3、m4a、wav、mp4、webm（單檔最大 25MB）

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

> [!note]
> 若你已安裝過生圖技能（draw-skill），`.openai.env` 裡已有 Key，**直接跳過此任務**，兩個技能共用同一把 Key。

---

### 任務 4：建立語音轉文字技能資料夾

**Windows：**
```bash
mkdir "%USERPROFILE%\.claude\skills\whisper"
```

**macOS / Linux：**
```bash
mkdir -p ~/.claude/skills/whisper
```

若資料夾已存在，繼續下一步（不報錯）。

---

### 任務 5：寫入 SKILL.md（技能描述檔）

將以下內容完整寫入：

**Windows 路徑**：`C:\Users\<當前使用者名稱>\.claude\skills\whisper\SKILL.md`
**macOS/Linux 路徑**：`~/.claude/skills/whisper/SKILL.md`

````markdown
---
name: whisper
description: OpenAI Whisper 語音轉文字技能（全域可用）。當使用者要求「把錄音轉文字」、「幫我謄寫」、「錄音轉成逐字稿」、「把會議錄音整理成文字」、「轉文字」等任何需要語音辨識的情境時，請一定要使用此技能。此技能會呼叫本地腳本以 Whisper API 進行語音辨識，自動偵測語言（或指定中文），存檔至當前專案的 transcripts/ 目錄（若無則建於當下工作目錄）。
---

# 語音轉文字技能（OpenAI Whisper）

## 觸發情境
使用者說出：
- 「把這個錄音轉成文字」「幫我謄寫這段錄音」
- 「逐字稿」「語音轉文字」「STT」
- 「把會議錄音整理成文字」「幫我轉錄」
- 「把這個 mp3 / m4a / wav 轉成文字」

## 腳本位置
- Windows：`C:\Users\<使用者名稱>\.claude\skills\whisper\whisper.py`
- macOS/Linux：`~/.claude/skills/whisper/whisper.py`

## 使用方式
```bash
python "<SKILL路徑>/whisper.py" "錄音檔路徑" --lang zh
```

## 參數說明
| 參數 | 預設值 | 說明 |
|------|--------|------|
| file | 必填 | 錄音檔路徑（mp3、m4a、wav、mp4、webm） |
| --lang | auto | 語言代碼（zh=中文、en=英文、auto=自動偵測） |
| --format | text | 輸出格式：text / srt / vtt（含時間戳） |
| --name | transcript | 輸出檔名前綴 |
| --outdir | 自動判斷 | 指定輸出目錄 |

## 輸出規則
- 優先存到當前目錄的 `transcripts/`
- 若 transcripts/ 不存在，改存到 `./generated/`
- 檔名格式：`<name>_<YYYYMMDD_HHMMSS>.txt`（或 .srt / .vtt）

## 錯誤代碼速查
| 錯誤 | 原因 | 處理方式 |
|------|------|----------|
| 401 Invalid API key | Key 錯誤或未寫入 | 檢查 ~/.openai.env |
| 429 Rate limit / insufficient_quota | 額度用完 | 告知使用者聯絡課程講師 |
| File too large | 錄音超過 25MB | 告知使用者需要切割檔案 |
| ModuleNotFoundError: openai | 套件未安裝 | 執行 pip install openai |
````

---

### 任務 6：寫入 whisper.py（語音轉文字腳本）

將以下 Python 程式碼完整寫入：

**Windows 路徑**：`C:\Users\<當前使用者名稱>\.claude\skills\whisper\whisper.py`
**macOS/Linux 路徑**：`~/.claude/skills/whisper/whisper.py`

```python
"""
全域語音轉文字腳本（OpenAI Whisper API）
支援：mp3、m4a、wav、mp4、webm（單檔最大 25MB）

API Key 讀取順序：
  1. 環境變數 OPENAI_API_KEY
  2. 當前目錄 .env
  3. 使用者 home 的 .openai.env（全域備援）
"""

import os
import sys
import argparse
from pathlib import Path
from datetime import datetime

SUPPORTED_FORMATS = {".mp3", ".m4a", ".wav", ".mp4", ".webm", ".mpeg", ".mpga", ".ogg"}
MAX_FILE_SIZE_MB = 25


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
    transcripts_dir = Path.cwd() / "transcripts"
    return transcripts_dir if transcripts_dir.exists() else (Path.cwd() / "generated")


def validate_file(file_path: Path):
    if not file_path.exists():
        print(f"錯誤：找不到檔案：{file_path}", file=sys.stderr)
        sys.exit(1)
    suffix = file_path.suffix.lower()
    if suffix not in SUPPORTED_FORMATS:
        print(f"錯誤：不支援的格式 {suffix}，支援格式：{', '.join(SUPPORTED_FORMATS)}", file=sys.stderr)
        sys.exit(1)
    size_mb = file_path.stat().st_size / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        print(
            f"錯誤：檔案大小 {size_mb:.1f}MB 超過上限 {MAX_FILE_SIZE_MB}MB。\n"
            f"請將錄音切割成較短的片段後再轉換。",
            file=sys.stderr,
        )
        sys.exit(1)


def transcribe(file_path: Path, lang: str, fmt: str, name: str, outdir: Path):
    from openai import OpenAI

    if not os.getenv("OPENAI_API_KEY"):
        print("錯誤：找不到 OPENAI_API_KEY，請確認 ~/.openai.env 是否正確", file=sys.stderr)
        sys.exit(1)

    validate_file(file_path)
    outdir.mkdir(parents=True, exist_ok=True)

    client = OpenAI()
    lang_display = "自動偵測" if lang == "auto" else lang
    print(f"轉錄中（語言：{lang_display} / 格式：{fmt}）…", file=sys.stderr)

    kwargs = dict(
        model="whisper-1",
        file=open(file_path, "rb"),
        response_format=fmt,
    )
    if lang != "auto":
        kwargs["language"] = lang

    result = client.audio.transcriptions.create(**kwargs)

    ext = {"text": ".txt", "srt": ".srt", "vtt": ".vtt"}.get(fmt, ".txt")
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    out_path = outdir / f"{name}_{stamp}{ext}"

    text_content = result if isinstance(result, str) else result.text
    out_path.write_text(text_content, encoding="utf-8")

    print(f"  [OK] {out_path}", file=sys.stderr)
    print(f"\n轉錄結果已存至：{out_path}")
    return out_path


def main():
    load_env()
    p = argparse.ArgumentParser(description="OpenAI Whisper 語音轉文字腳本")
    p.add_argument("file", help="錄音檔路徑（mp3、m4a、wav、mp4、webm）")
    p.add_argument(
        "--lang",
        default="auto",
        help="語言代碼（zh=中文、en=英文、auto=自動偵測，預設 auto）",
    )
    p.add_argument(
        "--format",
        default="text",
        choices=["text", "srt", "vtt"],
        dest="fmt",
        help="輸出格式（text=純文字、srt/vtt=含時間戳，預設 text）",
    )
    p.add_argument("--name", default="transcript", help="輸出檔名前綴（預設 transcript）")
    p.add_argument("--outdir", default=None, help="輸出目錄（預設自動判斷）")
    args = p.parse_args()

    outdir = resolve_outdir(args.outdir)
    transcribe(Path(args.file), args.lang, args.fmt, args.name, outdir)


if __name__ == "__main__":
    main()
```

---

### 任務 7：確認安裝結果

逐一確認以下檔案存在：

**Windows：**
```bash
dir "%USERPROFILE%\.openai.env"
dir "%USERPROFILE%\.claude\skills\whisper\SKILL.md"
dir "%USERPROFILE%\.claude\skills\whisper\whisper.py"
```

**macOS/Linux：**
```bash
ls -la ~/.openai.env ~/.claude/skills/whisper/SKILL.md ~/.claude/skills/whisper/whisper.py
```

全部存在後，向使用者顯示以下完成訊息：

---

## ✅ 安裝完成！

**語音轉文字技能已就緒。以後在任何專案裡，對 AI 說：**

> 「幫我把這個錄音檔轉成文字」
> 「把剛才的會議錄音謄寫成逐字稿」
> 「轉成有時間戳記的字幕格式」

AI 會自動呼叫 Whisper API，轉錄結果存到你的專案的 `transcripts/` 或 `./generated/` 資料夾。

**費用說明：**
- 每分鐘約 NT$0.18（$0.006 USD）
- 10 分鐘會議錄音 ≈ NT$2
- API Key 由講師提供，有用量上限，請勿分享給他人

**若轉錄失敗，常見錯誤：**
| 錯誤訊息 | 解決方式 |
|----------|----------|
| 429 / insufficient_quota | 額度用完，聯絡講師 |
| 401 Invalid API key | 重新安裝，或請講師確認 key |
| File too large | 錄音超過 25MB，請切割後再試 |
| ModuleNotFoundError: openai | 執行 `pip install openai` |

---

## ════════════════════════════════════
## 🤖 AI 執行區結束
## ════════════════════════════════════

---

## 使用範例提示詞

安裝完成後，可以直接把以下提示詞複製貼給 Claude Code 或 Copilot 使用。

### Claude Code 版

```
請把這個錄音檔轉成文字：[把錄音檔拖進來]

轉完後：
1. 修正明顯的錯字或語音辨識錯誤
2. 幫我整理成條列式重點
```

```
請把這個會議錄音轉成逐字稿：[把錄音檔拖進來]
語言：中文

轉完後：
1. 修正語音辨識的錯字
2. 依照發言者分段（若能辨識）
3. 整理出三個主要結論
```

### Codex 版

```
請用 Whisper API 把這個錄音檔轉成文字：
- 檔案路徑：[你的錄音檔路徑]
- 語言：zh（中文）

轉完後整理成條列式重點，修正語音辨識的錯字。
```

```
請用 Whisper API 把以下錄音轉成含時間戳記的 SRT 字幕：
- 檔案路徑：[你的錄音檔路徑]
- 語言：zh
- 格式：srt

轉完後存成 subtitles.srt。
```

---

## 進階用法

### 錄音超過 25MB 怎麼辦？

Whisper API 單檔上限為 25MB。若你的錄音較長，請對 AI 說：

> 「這個錄音超過 25MB，請幫我切成每段 20 分鐘，再依序轉文字合併」

AI 會使用 `ffmpeg`（需另行安裝）協助切割後再轉錄。

> [!tip]
> 一般手機錄音的 m4a 格式，約每小時 50-80MB。一小時會議可切成三段分別轉錄。

### 輸出含時間戳記的字幕

若需要知道每句話是在幾分幾秒說的，可以要求輸出 SRT 格式：

> 「請把錄音轉成 SRT 字幕格式，我需要知道每句話的時間點」

### 直接摘要開會記錄

轉完文字後，可以繼續對 AI 說：

> 「根據這份逐字稿，幫我整理成會議記錄格式：
> 1. 出席人員（若有提到姓名）
> 2. 討論重點（條列）
> 3. 決議事項（條列）
> 4. 待辦事項與負責人」

---

## 給講師的備註

- **發放前**：用文字編輯器開啟此 md，將 `PASTE_YOUR_KEY_HERE` 替換為實際 API Key
- **Key 安全**：建議使用專用教學 key，並在 OpenAI 後台設定 Spending Limit（建議 $5/月，不自動儲值）
- **回收**：課程結束後至 platform.openai.com/api-keys 將該 key 刪除
- **與生圖技能共用 Key**：若學員已安裝 draw-skill，Whisper 直接共用同一把 Key，`.openai.env` 不需重複設定
- **學生系統**：Windows 10/11 為主，macOS 亦可用（路徑會自動切換）
- **費用控制**：Whisper 費率固定（$0.006/分鐘），比生圖便宜許多，通常不需要特別提醒節省用量

---

*整合文件版本：Claude + Codex 通用中文版*
