"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const YOUTUBE_EMBED_URL = "https://www.youtube-nocookie.com/embed/IUpgqxPePvg";
const YOUTUBE_AUTOPLAY_PARAMS = "autoplay=1&rel=0&modestbranding=1&mute=1&playsinline=1";

const quranText =
  "Di antara tanda-tanda (kebesaran)-Nya ialah bahwa Dia menciptakan pasangan-pasangan untukmu dari (jenis) dirimu sendiri agar kamu merasa tenteram kepadanya. Dia menjadikan di antaramu rasa cinta dan kasih sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir. (Q.S Ar-Rum ayat 21)";

const profiles = [
  {
    name: "Putri Andiyani A.Md.Si",
    description: "Putri pertama dari Bapak Dicky Mulyadi dan Ibu Aan Samsinar",
    handle: "putriandiy",
    image: "/Putri.webp",
    imageAlt: "Putri Andiyani",
    position: "center 100%",
  },
  {
    name: "Afdal Ramdan Daman Huri S.Tr.Kom",
    description: "Putra pertama dari Bapak Amrizal dan Ibu Nelda Warni",
    handle: "afdalrdh",
    image: "/Afdal.webp",
    imageAlt: "Afdal Ramdan Daman Huri",
    position: "center 100%",
  },
];

function InstagramIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" />
    </svg>
  );
}

export function InvitationSection() {
  const videoRef = useRef<HTMLDivElement>(null);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement || videoOpen) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        setVideoOpen(true);
        observer.disconnect();
      },
      {
        threshold: 0.35,
      },
    );

    observer.observe(videoElement);

    return () => observer.disconnect();
  }, [videoOpen]);

  return (
    <section
      id="invitation"
      className="bg-white px-4 py-14 text-center font-sans text-[#5b4d49] sm:py-8 md:px-8 md:py-24"
    >
      <div className="mx-auto max-w-[1200px]">
        <Image
          src="/Bismillah.png"
          alt="Bismillahirrahmanirrahim"
          width={1578}
          height={345}
          className="mx-auto h-auto w-[220px] object-contain sm:w-[260px] md:w-[300px]"
          priority
        />

        <h2 className="mx-auto mt-7 max-w-[320px] px-2 font-serif text-[21px] font-normal italic leading-[1.2] text-[#4a0e0e] sm:max-w-[580px] sm:text-[29px] sm:leading-[1.18] md:mt-8 md:max-w-[860px] md:text-[34px]">
          <span className="block whitespace-nowrap sm:inline sm:whitespace-normal">
            &quot;Kami mengundang Anda
          </span>{" "}
          <span className="block whitespace-nowrap sm:inline sm:whitespace-normal">
            untuk menjadi bagian
          </span>{" "}
          <span className="block whitespace-nowrap sm:inline sm:whitespace-normal">
            dari hari bahagia kami&quot;
          </span>
        </h2>

        <div className="mx-auto mt-8 h-px w-9 bg-[#ead8d4] md:mt-10" />

        <div
          ref={videoRef}
          className="mx-auto mt-14 max-w-[520px] sm:mt-10 md:mt-16 md:max-w-[1040px]"
        >
          <div className="relative aspect-video w-full overflow-hidden bg-[#15110f]">
            {videoOpen ? (
              <iframe
                title="Video Afdal dan Putri"
                src={`${YOUTUBE_EMBED_URL}?${YOUTUBE_AUTOPLAY_PARAMS}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <button
                type="button"
                aria-label="Putar video"
                onClick={() => setVideoOpen(true)}
                className="group absolute inset-0 cursor-pointer"
              >
                <Image
                  src="/Thumbnail Video.webp"
                  alt="Thumbnail video"
                  fill
                  sizes="(min-width: 768px) 520px, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-white transition-transform group-hover:scale-105 md:h-20 md:w-20">
                  <svg viewBox="0 0 80 80" fill="none" aria-hidden>
                    <path d="M56 40L30 56V24L56 40Z" fill="currentColor" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-[320px] text-[14px] font-normal leading-[1.62] text-[#6a615e] sm:mt-8 sm:max-w-[540px] sm:text-[12px] md:mt-9 md:max-w-[860px] md:text-[16px] md:leading-[1.82]">
          {quranText}
        </p>

        <div className="mx-auto mt-8 h-px w-9 bg-[#ead8d4] sm:mt-5 md:mt-24" />

        <p className="mt-7 text-[11px] font-normal uppercase tracking-[0.3em] text-[#9d918d] sm:mt-6 md:mt-10">
          Groom &amp; Bride
        </p>

        <div className="mx-auto mt-8 grid max-w-[340px] gap-7 sm:mt-6 sm:max-w-[520px] sm:grid-cols-2 sm:gap-7 md:mt-9 md:max-w-[1140px] md:gap-14">
          {profiles.map((profile) => (
            <article
              key={profile.handle}
              className="mx-auto grid w-full max-w-[500px] grid-cols-[112px_1fr] gap-4 rounded-[16px] bg-white p-3 text-left shadow-[0_18px_50px_rgba(58,35,28,0.06)] sm:grid-cols-[84px_1fr] sm:gap-3 sm:p-2 md:grid-cols-[150px_1fr] md:gap-5 md:p-4"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[12px]">
                <Image
                  src={profile.image}
                  alt={profile.imageAlt}
                  fill
                  sizes="300px"
                  className="scale-200 object-cover"
                  style={{ objectPosition: profile.position }}
                />
              </div>

              <div className="flex min-w-0 flex-col justify-center">
                <h3 className="font-serif text-[15px] font-bold leading-[1.12] text-[#4a0e0e] sm:text-[15px] md:text-[22px]">
                  {profile.name}
                </h3>
                <p className="mt-2 text-[10.8px] leading-[1.5] text-[#756b67] sm:text-[10px] md:mt-3 md:text-[14px] md:leading-[1.65]">
                  {profile.description}
                </p>
                <a
                  href={`https://instagram.com/${profile.handle}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-md bg-[#ede9e3] px-2.5 py-1 text-[11px] font-semibold leading-none text-[#332724] sm:text-[10px] md:mt-3 md:text-[13px]"
                >
                  <InstagramIcon />
                  {profile.handle}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
