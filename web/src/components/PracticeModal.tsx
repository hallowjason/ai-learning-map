"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Practice } from "@/lib/types";

interface PracticeModalProps {
  practice: Practice;
  done: boolean;
  onClose: () => void;
  onComplete: () => Promise<void> | void;
}

export default function PracticeModal({ practice, done, onClose, onComplete }: PracticeModalProps) {
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleComplete() {
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
        className="relative bg-cream rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-7 py-5 border-b border-ink/10">
          <div>
            <p className="text-xs uppercase tracking-wider text-coral font-semibold">練習 {practice.id}</p>
            <h2 className="font-display text-2xl font-bold text-ink mt-1">{practice.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-ink/50 hover:text-ink text-2xl leading-none p-1"
            aria-label="關閉"
          >
            ×
          </button>
        </div>

        <div className="markdown-body overflow-y-auto px-7 py-6 flex-1 text-ink/90">
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

        <div className="px-7 py-4 border-t border-ink/10 flex items-center justify-between bg-cream/80">
          <p className="text-sm text-ink/60">
            {done ? "✓ 你已完成這個練習" : "完成後點下方按鈕，蓮花會綻放在你的名字旁"}
          </p>
          <button
            onClick={handleComplete}
            disabled={done || submitting}
            className={`px-5 py-2.5 rounded-xl font-medium transition-colors
              ${done
                ? "bg-fresh/40 text-ink/60 cursor-default"
                : "bg-ink text-cream hover:bg-forest"
              }
              disabled:opacity-50
            `}
          >
            {done ? "已完成 🪷" : submitting ? "記錄中…" : "我完成了 🪷"}
          </button>
        </div>
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
