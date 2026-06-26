"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const AUDIO_SRC = "/Background.mp3";

interface EnvelopeSectionProps {
  guestName?: string;
}

export function EnvelopeSection({
  guestName = "Aldy Akbarrizky",
}: EnvelopeSectionProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleOpen = () => {
    const audio = audioRef.current;
    if (audio) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
    setIsOpen(true);
  };

  // Scroll to top on load — before paint, no visible jump
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={AUDIO_SRC} loop preload="auto" />

      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 px-6"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[30px]" />

            <Image
              src="/Logo Afput HD.png"
              alt="Afdal & Putri"
              width={486}
              height={177}
              priority
              className="relative z-10 h-auto w-[120px] object-contain brightness-0 invert sm:w-[150px] md:w-[170px]"
            />

            <div className="relative z-10 flex h-[264px] w-full max-w-[392px] flex-col items-center justify-center gap-5 rounded-[16px] border border-white/50 px-6">
              <p className="text-center font-sans text-[14px] font-normal leading-[24px] text-white/80 sm:text-[16px] sm:leading-[28px]">
                Kepada Yth. Bapak/Ibu/Saudara/i
              </p>

              <h1 className="px-2 text-center font-serif text-[clamp(30px,8vw,48px)] font-normal italic leading-[1.05] text-white">
                {guestName}
              </h1>

              <button
                type="button"
                onClick={handleOpen}
                className="mt-2 inline-flex items-center gap-2.5 rounded-[14px] border border-white/75 px-[clamp(18px,4vw,29px)] py-[clamp(10px,2vw,15px)] font-sans text-[clamp(15px,2.8vw,21px)] font-normal leading-none text-white transition-colors hover:bg-white hover:text-neutral-950 md:rounded-[9px] md:px-6 md:py-3 md:text-[17px]"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                  className="h-[1em] w-[1em]"
                >
                  <rect
                    x="2"
                    y="4"
                    width="20"
                    height="16"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M2 7L12 14L22 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Buka Undangan
              </button>
            </div>

            <p className="relative z-10 mt-6 font-sans text-[14px] font-normal leading-[26px] tracking-normal text-white/90 md:text-[16px]">
              Made With <span className="px-1 text-[18px] leading-none">♥</span>{" "}
              <a
                href="https://solidtechno.id"
                target="_blank"
                rel="noreferrer"
                className="underline-offset-4 hover:underline"
              >
                SolidTechnoID
              </a>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <button
          type="button"
          aria-label={isPlaying ? "Hentikan musik" : "Putar musik"}
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-50 transition hover:scale-105 md:bottom-8 md:right-8"
        >
          <Image
            src={isPlaying ? "/MusicActive.svg" : "/MusicInactive.svg"}
            alt={isPlaying ? "Musik menyala" : "Musik mati"}
            width={48}
            height={48}
            priority
          />
        </button>
      )}
    </>
  );
}
