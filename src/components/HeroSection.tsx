"use client";

import Image from "next/image";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Welcome", href: "#invitation" },
  { label: "Our Story", href: "#story" },
  { label: "Date", href: "#date" },
  { label: "Location", href: "#venue" },
  { label: "Memories", href: "#memories" },
  { label: "Gift", href: "#gift" },
];

export function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <section
      id="welcome"
      className="relative isolate h-[100svh] min-h-[700px] overflow-hidden bg-neutral-950 text-white"
    >
      <Image
        src="/Hero Background.webp"
        alt="Afdal dan Putri berdiri di tepi danau"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 z-0 object-cover object-center"
      />

      <div className="absolute inset-0 z-10 bg-black/20" />
      <div className="absolute inset-x-0 top-0 z-10 h-[28%] bg-linear-to-b from-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-10 h-[32%] bg-linear-to-t from-black/45 to-transparent" />

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col items-center justify-center gap-10 bg-neutral-950/95 px-8 transition-all duration-300 md:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          aria-label="Tutup navigasi"
          onClick={closeMenu}
          className="absolute right-6 top-7 flex h-10 w-10 items-center justify-center text-white"
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path
              d="M2 2L24 24M24 2L2 24"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <nav className="flex flex-col items-center gap-7 font-sans">
          {NAV_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={closeMenu}
              className="text-[22px] font-normal leading-none text-white transition-opacity hover:opacity-75"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <header className="absolute inset-x-0 top-0 z-50 px-6 pt-7 sm:px-10 md:px-12 md:pt-10">
        <nav className="mx-auto flex max-w-[1190px] items-center justify-between font-sans">
          <a href="#welcome" aria-label="Afdal Putri Wedding" className="block">
            <Image
              src="/Logo Afput HD.png"
              alt="Afput Wedding"
              width={170}
              height={72}
              priority
              className="h-auto w-[clamp(96px,20vw,146px)] md:w-[106px]"
            />
          </a>

          <div className="hidden items-center gap-8 md:flex lg:gap-9">
            {NAV_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[18px] font-normal leading-none text-white transition-opacity hover:opacity-75 lg:text-[19px]"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-[clamp(20px,5vw,34px)] md:gap-0">
            <a
              href="#rsvp"
              className="rounded-[14px] border border-white/75 px-[clamp(18px,4vw,29px)] py-[clamp(10px,2vw,15px)] text-[clamp(15px,2.8vw,21px)] font-normal leading-none text-white transition-colors hover:bg-white hover:text-neutral-950 md:rounded-[9px] md:px-6 md:py-3 md:text-[17px]"
            >
              Kehadiran
            </a>

            <button
              type="button"
              aria-label="Buka navigasi"
              onClick={() => setMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center text-white md:hidden"
            >
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                <path
                  d="M1 2H21M1 8H21M1 14H21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      <h1
        aria-label="Afdal Putri"
        className="absolute inset-x-0 top-[13.5%] z-20 flex flex-col items-center gap-0 px-8 font-display text-[clamp(7rem,27.5vw,12.5rem)] leading-[0.88] text-white md:top-[37.4%] md:flex-row md:justify-between md:pl-[12.6vw] md:pr-[15.1vw] md:text-[clamp(10rem,15.4vw,15.4rem)] md:leading-[0.78]"
      >
        <span className="-translate-x-[8.5vw] origin-left scale-x-90 md:translate-x-0 md:scale-x-100">
          AFDAL
        </span>
        <span className="translate-x-[12vw] md:translate-x-0">PUTRI</span>
      </h1>

      <Image
        src="/Love.svg"
        alt=""
        width={187}
        height={155}
        unoptimized
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[38%] z-30 w-[70vw] max-w-[520px] -translate-x-1/2 md:top-[29%] md:w-[15vw] md:min-w-[190px] md:max-w-[245px]"
      />

      <Image
        src="/Afdan dan Putri.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        quality={90}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-40 object-cover object-center"
      />

      <a
        href="#story"
        className="absolute inset-x-0 bottom-0 z-50 border-t border-white/45"
      >
        <div className="mx-auto flex h-[9.25svh] min-h-[76px] max-w-[1240px] items-center justify-between px-8 text-white sm:px-12 md:h-24 md:px-8">
          <svg
            width="28"
            height="38"
            viewBox="0 0 28 38"
            fill="none"
            className="h-[24px] w-[18px] shrink-0 text-white md:h-[28px] md:w-5"
            aria-hidden="true"
          >
            <path
              d="M14 1V35M2 24L14 36L26 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[clamp(0.95rem,3vw,1.3rem)] font-normal leading-none md:text-[18px]">
            Jelajahi Kisah Kami
          </span>
        </div>
      </a>
    </section>
  );
}
