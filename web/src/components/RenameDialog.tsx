"use client";

import { useEffect, useRef, useState } from "react";

interface RenameDialogProps {
  open: boolean;
  /** Canonical (unchangeable) name shown for context */
  canonicalName: string;
  /** Current display_name override (or null if using canonical) */
  currentDisplayName: string | null;
  onClose: () => void;
  onSave: (newDisplayName: string | null) => Promise<void>;
}

export default function RenameDialog({
  open,
  canonicalName,
  currentDisplayName,
  onClose,
  onSave,
}: RenameDialogProps) {
  const [value, setValue] = useState(currentDisplayName ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackedOpen, setTrackedOpen] = useState(open);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset form when the dialog (re)opens
  if (open !== trackedOpen) {
    setTrackedOpen(open);
    if (open) {
      setValue(currentDisplayName ?? "");
      setError(null);
    }
  }

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function handleSave() {
    setError(null);
    const trimmed = value.trim();
    if (trimmed.length > 20) {
      setError("最多 20 個字");
      return;
    }
    setSaving(true);
    try {
      await onSave(trimmed.length === 0 ? null : trimmed);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "更新失敗");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-cream rounded-2xl max-w-sm w-full p-6 border"
        onClick={(e) => e.stopPropagation()}
        style={{
          borderColor: "var(--color-border)",
          boxShadow: "rgba(0,0,0,0.18) 0 16px 48px",
        }}
      >
        <p className="text-[10px] uppercase tracking-wider text-coral font-medium">
          修改顯示名稱
        </p>
        <h2 className="font-display text-2xl font-semibold text-ink tracking-tight mb-4">
          要怎麼顯示你？
        </h2>
        <p className="text-sm text-ink-soft mb-2">
          原始登入名：<span className="font-medium text-ink">{canonicalName}</span>
        </p>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void handleSave();
          }}
          placeholder={canonicalName}
          maxLength={20}
          className="w-full px-3 py-2.5 rounded-md border bg-cream text-ink text-base focus:outline-none mb-1"
          style={{ borderColor: "var(--color-border)" }}
        />
        <p className="text-xs text-ink-soft mb-3">
          留空 → 顯示原始名「{canonicalName}」。最多 20 個字。
        </p>

        {error && (
          <p className="text-xs text-coral mb-3">{error}</p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border text-ink text-sm hover:border-ink/40 transition"
            style={{ borderColor: "var(--color-border)" }}
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-md bg-ink text-cream text-sm btn-inset hover:opacity-90 active:opacity-80 disabled:opacity-50"
          >
            {saving ? "儲存中…" : "儲存"}
          </button>
        </div>
      </div>
    </div>
  );
}
