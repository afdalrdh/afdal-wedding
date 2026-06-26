"use client";

import { CopyTextButton } from "./CopyTextButton";

export function CopyLinkButton({ value }: { value: string }) {
  return (
    <CopyTextButton
      value={value}
      label="Copy Link"
      copiedLabel="Link Tersalin"
      title="Salin link"
    />
  );
}
