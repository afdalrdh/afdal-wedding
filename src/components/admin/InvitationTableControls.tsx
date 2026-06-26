"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { InvitationStatusFilter } from "@/lib/wedding-types";

export function InvitationTableControls({
  initialSearch,
  initialStatus,
  initialPageSize,
}: {
  initialSearch: string;
  initialStatus: InvitationStatusFilter;
  initialPageSize: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paramsSnapshot = searchParams.toString();
  const [search, setSearch] = useState(initialSearch);
  const isFirstRender = useRef(true);

  const currentParams = useMemo(
    () => new URLSearchParams(paramsSnapshot),
    [paramsSnapshot],
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timeout = window.setTimeout(() => {
      const next = new URLSearchParams(currentParams);
      const value = search.trim();

      if (value) {
        next.set("q", value);
      } else {
        next.delete("q");
      }

      next.set("page", "1");
      router.replace(`${pathname}?${next.toString()}`);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [currentParams, pathname, router, search]);

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(currentParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set("page", "1");
    router.replace(`${pathname}?${next.toString()}`);
  };

  return (
    <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_180px_140px]">
      <label className="relative block">
        <span className="sr-only">Cari invitation</span>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8079]"
          aria-hidden
        />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari nama, slug, custom message"
          className="h-10 w-full rounded-[8px] border border-[#D9D4CD] bg-white pl-9 pr-3 text-[13px] font-semibold outline-none transition placeholder:text-[#B8B1AB] focus:border-[#8D4327] focus:ring-2 focus:ring-[#E8C8C7]"
        />
      </label>

      <label>
        <span className="sr-only">Status invitation</span>
        <select
          defaultValue={initialStatus}
          onChange={(event) => update("status", event.target.value)}
          className="h-10 w-full rounded-[8px] border border-[#D9D4CD] bg-white px-3 text-[13px] font-bold text-[#3F3A37] outline-none transition focus:border-[#8D4327] focus:ring-2 focus:ring-[#E8C8C7]"
        >
          <option value="all">Semua status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Nonaktif</option>
        </select>
      </label>

      <label>
        <span className="sr-only">Jumlah data per halaman</span>
        <select
          defaultValue={String(initialPageSize)}
          onChange={(event) => update("pageSize", event.target.value)}
          className="h-10 w-full rounded-[8px] border border-[#D9D4CD] bg-white px-3 text-[13px] font-bold text-[#3F3A37] outline-none transition focus:border-[#8D4327] focus:ring-2 focus:ring-[#E8C8C7]"
        >
          <option value="10">10 / page</option>
          <option value="25">25 / page</option>
          <option value="50">50 / page</option>
          <option value="100">100 / page</option>
        </select>
      </label>
    </div>
  );
}
