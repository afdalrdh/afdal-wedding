"use client";

import { useEffect } from "react";

export function AdminAlert({
  type,
  message,
}: {
  type: "error" | "success" | "warning";
  message: string | null;
}) {
  useEffect(() => {
    if (!message || type === "warning") return;
    window.alert(message);

    const url = new URL(window.location.href);
    url.searchParams.delete(type);
    window.history.replaceState(
      null,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }, [message, type]);

  return null;
}
