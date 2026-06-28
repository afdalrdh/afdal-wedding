"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const galleryItems = [
  { src: "/Galleries/Gallery_P1.webp", type: "portrait" },
  { src: "/Galleries/Gallery_P2.webp", type: "portrait" },
  { src: "/Galleries/Gallery_L1.webp", type: "landscape" },
  { src: "/Galleries/Gallery_P3.webp", type: "portrait" },
  { src: "/Galleries/Gallery_P4.webp", type: "portrait" },
  { src: "/Galleries/Gallery_P5.webp", type: "portrait" },
  { src: "/Galleries/Gallery_P6.webp", type: "portrait" },
  { src: "/Galleries/Gallery_L2.webp", type: "landscape" },
  { src: "/Galleries/Gallery_P7.webp", type: "portrait" },
  { src: "/Galleries/Gallery_P8.webp", type: "portrait" },
  { src: "/Galleries/Gallery_P9.webp", type: "portrait" },
  { src: "/Galleries/Gallery_P10.webp", type: "portrait" },
  { src: "/Galleries/Gallery_P11.webp", type: "portrait" },
  { src: "/Galleries/Gallery_P12.webp", type: "portrait" },
] as const;

export function GallerySection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedItem =
    selectedIndex === null ? null : galleryItems[selectedIndex];

  const closeGallery = () => setSelectedIndex(null);
  const showPrevious = () =>
    setSelectedIndex((currentIndex) =>
      currentIndex === null
        ? null
        : (currentIndex - 1 + galleryItems.length) % galleryItems.length,
    );
  const showNext = () =>
    setSelectedIndex((currentIndex) =>
      currentIndex === null ? null : (currentIndex + 1) % galleryItems.length,
    );

  useEffect(() => {
    if (selectedIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeGallery();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]);

  return (
    <section
      id="memories"
      className="bg-white pb-20 pt-12 text-center md:px-8 md:py-24"
    >
      <div className="mx-auto w-[354px] max-w-[calc(100vw-36px)] md:w-full md:max-w-[1000px]">
        <p className="font-sans text-[13px] font-normal uppercase leading-[20px] tracking-[1.8px] text-[#877270] md:text-[14px] md:tracking-[2px]">
          Our Memories
        </p>

        <h2 className="mx-auto mt-6 max-w-[340px] text-center font-serif text-[34px] font-semibold leading-[1.18] tracking-normal text-[#4A0E0E] md:max-w-none md:text-center md:text-[48px] md:leading-none">
          Kenangan yang kami abadikan.
        </h2>

        <div className="mx-auto mt-6 h-px w-12 bg-[#877270] md:mt-8" />

        <div className="mt-9 grid grid-cols-2 gap-[8.84px] md:mt-12 md:grid-cols-[repeat(4,241px)] md:gap-3">
          {galleryItems.map((item, index) => {
            const isLandscape = item.type === "landscape";

            return (
              <button
                key={item.src}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`Perbesar memori Afdal dan Putri ${index + 1}`}
                className={
                  isLandscape
                    ? "group relative col-span-2 h-[215.14px] w-full cursor-zoom-in overflow-hidden transition duration-500 ease-out hover:scale-[1.015] focus-visible:scale-[1.015] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:h-[292px]"
                    : "group relative h-[215.14px] w-full cursor-zoom-in overflow-hidden transition duration-500 ease-out hover:scale-[1.015] focus-visible:scale-[1.015] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:h-[292px]"
                }
              >
                <Image
                  src={item.src}
                  alt={`Memori Afdal dan Putri ${index + 1}`}
                  fill
                  sizes={
                    isLandscape
                      ? "(min-width: 768px) 494px, calc(100vw - 48px)"
                      : "(min-width: 768px) 241px, calc((100vw - 54px) / 2)"
                  }
                  className="object-cover transition duration-500 ease-out group-hover:scale-105"
                />
                <span className="pointer-events-none absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/20" />
              </button>
            );
          })}
        </div>
      </div>

      {selectedItem && selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Galeri foto Afdal dan Putri"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 px-4 py-8 backdrop-blur-sm"
          onClick={closeGallery}
        >
          <button
            type="button"
            aria-label="Tutup galeri"
            onClick={closeGallery}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Foto sebelumnya"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20 md:flex"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M15 5L8 12L15 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div
            className="relative h-[80svh] w-[min(92vw,1120px)]"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={selectedItem.src}
              alt={`Memori Afdal dan Putri ${selectedIndex + 1}`}
              fill
              sizes="92vw"
              className="object-contain"
            />
          </div>

          <button
            type="button"
            aria-label="Foto berikutnya"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20 md:flex"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M9 5L16 12L9 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-3 md:hidden">
            <button
              type="button"
              aria-label="Foto sebelumnya"
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M15 5L8 12L15 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Foto berikutnya"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M9 5L16 12L9 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
