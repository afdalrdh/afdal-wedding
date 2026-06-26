"use client";

import { Check, Copy, MessageCircle } from "lucide-react";
import { useState } from "react";

export function CopyTextButton({
  value,
  label,
  copiedLabel = "Tersalin",
  title,
  variant = "copy",
}: {
  value: string;
  label: string;
  copiedLabel?: string;
  title: string;
  variant?: "copy" | "message";
}) {
  const [copied, setCopied] = useState(false);
  const Icon = variant === "message" ? MessageCircle : Copy;

  const copy = async () => {
    if (!navigator.clipboard) return;

    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={title}
      className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-[#D8D5D0] bg-white px-3 text-[13px] font-semibold text-[#3F3A37] transition hover:border-[#B68D59] hover:text-[#8D4327]"
    >
      {copied ? (
        <Check className="h-4 w-4" aria-hidden />
      ) : (
        <Icon className="h-4 w-4" aria-hidden />
      )}
      {copied ? copiedLabel : label}
    </button>
  );
}
