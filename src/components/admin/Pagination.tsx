import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationMeta } from "@/lib/wedding-types";

function pageList(current: number, total: number) {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  return Array.from(pages)
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);
}

export function Pagination({
  meta,
  pathname,
  params,
}: {
  meta: PaginationMeta;
  pathname: string;
  params: Record<string, string>;
}) {
  const pages = pageList(meta.page, meta.pageCount);
  const hrefFor = (page: number) => {
    const query = new URLSearchParams(params);
    query.set("page", String(page));
    return `${pathname}?${query.toString()}`;
  };

  if (meta.pageCount <= 1) {
    return null;
  }

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 pt-4 text-[13px] font-bold text-[#5F5750]">
      <p>
        Halaman {meta.page} dari {meta.pageCount}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={hrefFor(Math.max(1, meta.page - 1))}
          aria-disabled={meta.page === 1}
          className={`inline-flex h-9 items-center gap-1 rounded-[8px] border px-3 ${
            meta.page === 1
              ? "pointer-events-none border-[#E6DED6] bg-[#F3F0EC] text-[#A59D96]"
              : "border-[#D8D5D0] bg-white hover:border-[#B68D59] hover:text-[#8D4327]"
          }`}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Prev
        </Link>

        {pages.map((page, index) => {
          const previous = pages[index - 1];
          const needsGap = previous && page - previous > 1;

          return (
            <span key={page} className="inline-flex items-center gap-2">
              {needsGap && <span className="text-[#9B918A]">...</span>}
              <Link
                href={hrefFor(page)}
                aria-current={page === meta.page ? "page" : undefined}
                className={`inline-flex h-9 min-w-9 items-center justify-center rounded-[8px] border px-3 ${
                  page === meta.page
                    ? "border-[#4A0E0E] bg-[#4A0E0E] text-white"
                    : "border-[#D8D5D0] bg-white hover:border-[#B68D59] hover:text-[#8D4327]"
                }`}
              >
                {page}
              </Link>
            </span>
          );
        })}

        <Link
          href={hrefFor(Math.min(meta.pageCount, meta.page + 1))}
          aria-disabled={meta.page === meta.pageCount}
          className={`inline-flex h-9 items-center gap-1 rounded-[8px] border px-3 ${
            meta.page === meta.pageCount
              ? "pointer-events-none border-[#E6DED6] bg-[#F3F0EC] text-[#A59D96]"
              : "border-[#D8D5D0] bg-white hover:border-[#B68D59] hover:text-[#8D4327]"
          }`}
        >
          Next
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </nav>
  );
}
