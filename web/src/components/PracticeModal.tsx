"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import HoldToConfirm from "./HoldToConfirm";
import type { Practice } from "@/lib/types";

interface PracticeModalProps {
  practice: Practice;
  done: boolean;
  /** Preview-only mode (e.g. admin view) — hides the "complete" footer entirely. */
  previewOnly?: boolean;
  onClose: () => void;
  onComplete: () => Promise<void> | void;
}

export default function PracticeModal({
  practice,
  done,
  previewOnly = false,
  onClose,
  onComplete,
}: PracticeModalProps) {
  // Two-step completion: idle → confirming (with hold-to-confirm gate) → done.
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (confirming) setConfirming(false);
        else onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, confirming]);

  async function handleHoldConfirmed() {
    if (done || submitting) return;
    setSubmitting(true);
    try {
      await onComplete();
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-cream rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col border"
        onClick={(e) => e.stopPropagation()}
        style={{
          borderColor: "var(--color-border)",
          boxShadow: "rgba(0,0,0,0.18) 0 16px 48px",
        }}
      >
        <div
          className="flex items-start justify-between px-7 py-5 border-b"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div>
            <p className="text-xs uppercase tracking-wider text-coral font-medium">練習 {practice.id}</p>
            <h2 className="font-display text-2xl font-semibold text-ink mt-1 tracking-tight">{practice.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-ink-soft hover:text-ink text-2xl leading-none p-1"
            aria-label="關閉"
          >
            ×
          </button>
        </div>

        <div className="markdown-body overflow-y-auto px-7 py-6 flex-1 text-ink">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              pre: (props) => <CopyablePre {...props} />,
              a: (props) => <a {...props} target="_blank" rel="noopener noreferrer" />,
            }}
          >
            {practice.content}
          </ReactMarkdown>
        </div>

        {!previewOnly && (
        <div
          className="px-7 py-4 border-t bg-cream"
          style={{ borderColor: "var(--color-border)" }}
        >
          {done ? (
            <div className="flex items-center justify-between">
              <p className="text-sm text-ink-soft">✓ 你已完成這個練習</p>
              <span
                className="px-4 py-2 rounded-md text-base bg-cream text-ink-soft border"
                style={{ borderColor: "var(--color-border)" }}
              >
                已完成 🪷
              </span>
            </div>
          ) : confirming ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-ink">
                確定要標記「<span className="font-semibold">{practice.title}</span>」為完成嗎？按住下方按鈕 3 秒確認。
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="px-4 py-2 rounded-md border text-ink text-sm hover:border-ink/40 transition"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  取消
                </button>
                <HoldToConfirm
                  onConfirm={handleHoldConfirmed}
                  durationMs={3000}
                  label="按住 3 秒確認完成 🪷"
                  holdingLabel="繼續按住…"
                  doneLabel="記錄中…"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-ink-soft">
                完成後點下方按鈕，蓮花會綻放在你的名字旁
              </p>
              <button
                type="button"
                onClick={() => setConfirming(true)}
                disabled={submitting}
                className="px-4 py-2 rounded-md font-normal text-base transition bg-ink text-cream hover:opacity-90 active:opacity-80 btn-inset disabled:opacity-50"
              >
                我完成了 🪷
              </button>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}

function CopyablePre({ children, ...rest }: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);
  const text = extractText(children);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard not available */
    }
  }

  return (
    <div className="relative group">
      <pre {...rest}>{children}</pre>
      <button
        onClick={copy}
        className="absolute top-2 right-2 px-2.5 py-1 rounded-md text-xs bg-cream/15 hover:bg-cream/25 text-cream transition-opacity opacity-0 group-hover:opacity-100"
        type="button"
      >
        {copied ? "已複製" : "複製"}
      </button>
    </div>
  );
}

function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    const props = (node as { props?: { children?: React.ReactNode } }).props;
    return extractText(props?.children);
  }
  return "";
}
