"use client";

import { Bold, Braces, Code2, Italic, Link2, Strikethrough } from "lucide-react";
import { useRef } from "react";

function ToolbarButton({
  label,
  title,
  disabled,
  onClick,
  children,
}: {
  label: string;
  title: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-[#D8D5D0] bg-white px-3 text-[12px] font-bold text-[#3F3A37] transition hover:border-[#B68D59] hover:text-[#8D4327] disabled:cursor-not-allowed disabled:bg-[#F0EEEA] disabled:text-[#A79D95]"
    >
      {children}
      {label}
    </button>
  );
}

export function WhatsappMessageEditor({
  id,
  name,
  defaultValue,
  disabled,
}: {
  id: string;
  name: string;
  defaultValue: string;
  disabled: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const mutateSelection = (before: string, after = before) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.slice(start, end) || "teks";
    const next = `${textarea.value.slice(0, start)}${before}${selected}${after}${textarea.value.slice(end)}`;

    textarea.value = next;
    const nextStart = start + before.length;
    textarea.focus();
    textarea.setSelectionRange(nextStart, nextStart + selected.length);
  };

  const insertText = (value: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    textarea.value = `${textarea.value.slice(0, start)}${value}${textarea.value.slice(end)}`;
    textarea.focus();
    textarea.setSelectionRange(start + value.length, start + value.length);
  };

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        <ToolbarButton
          label="Bold"
          title="Format tebal WhatsApp"
          disabled={disabled}
          onClick={() => mutateSelection("*")}
        >
          <Bold className="h-4 w-4" aria-hidden />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          title="Format miring WhatsApp"
          disabled={disabled}
          onClick={() => mutateSelection("_")}
        >
          <Italic className="h-4 w-4" aria-hidden />
        </ToolbarButton>
        <ToolbarButton
          label="Coret"
          title="Format coret WhatsApp"
          disabled={disabled}
          onClick={() => mutateSelection("~")}
        >
          <Strikethrough className="h-4 w-4" aria-hidden />
        </ToolbarButton>
        <ToolbarButton
          label="Mono"
          title="Format monospace WhatsApp"
          disabled={disabled}
          onClick={() => mutateSelection("```")}
        >
          <Code2 className="h-4 w-4" aria-hidden />
        </ToolbarButton>
        <ToolbarButton
          label="Nama"
          title="Sisipkan placeholder nama undangan"
          disabled={disabled}
          onClick={() => insertText("{{nama}}")}
        >
          <Braces className="h-4 w-4" aria-hidden />
        </ToolbarButton>
        <ToolbarButton
          label="Link"
          title="Sisipkan placeholder link undangan"
          disabled={disabled}
          onClick={() => insertText("{{link}}")}
        >
          <Link2 className="h-4 w-4" aria-hidden />
        </ToolbarButton>
      </div>

      <textarea
        id={id}
        ref={textareaRef}
        name={name}
        required
        rows={10}
        defaultValue={defaultValue}
        disabled={disabled}
        className="min-h-[240px] resize-y rounded-[8px] border border-[#D9D4CD] bg-[#FBFAF8] px-3 py-3 text-[14px] font-semibold leading-[23px] outline-none transition focus:border-[#8D4327] focus:ring-2 focus:ring-[#E8C8C7] disabled:cursor-not-allowed disabled:bg-[#F0EEEA]"
      />
    </div>
  );
}
