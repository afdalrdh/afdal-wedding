"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

const chapters = [
  {
    label: "chapter one (2020)",
    title: "Bagaimana Kami Bertemu",
    body: "Berawal dari organisasi BEM Polban, kami sering berkoordinasi dan bertukar cerita hingga rasa nyaman tumbuh di tengah masa pandemi. Tanpa kami sadari, percakapan sederhana itu menjadi awal dari perjalanan yang jauh lebih panjang.",
    gradient: "from-[#ecdcc0] to-[#a08060]",
    images: ["/Stories/Chapter1.webp"],
  },
  {
    label: "chapter two (2021 - 2023)",
    title: "Bertumbuh Bersama",
    body: "Kuliah, tugas, organisasi, dan banyak cerita menjadi bagian dari perjalanan kami. Di masa ini kami menikmati kebersamaan sambil belajar memahami, mendukung, dan bertumbuh menjadi pribadi yang lebih dewasa.",
    gradient: "from-[#d8d0e4] to-[#908098]",
    images: ["/Stories/Chapter2.webp"],
  },
  {
    label: "chapter three (2023 - 2026)",
    title: "Menjelajah Dunia Bersama",
    body: "Memasuki dunia kerja, kami menemukan kebahagiaan dalam perjalanan-perjalanan sederhana ke berbagai tempat dan alam yang indah. Dari setiap perjalanan, kami belajar untuk saling memahami, menguatkan, dan menikmati setiap proses kehidupan bersama.",
    gradient: "from-[#d4e8d4] to-[#88a880]",
    images: [
      "/Stories/Chapter3_a.webp",
      "/Stories/Chapter3_b.webp",
      "/Stories/Chapter3_c.webp",
      "/Stories/Chapter3_d.webp",
    ],
  },
  {
    label: "chapter four (18 April 2026)",
    title: "Lamaran",
    body: "Dengan restu Allah SWT dan kedua keluarga, kami memutuskan membawa hubungan ini ke jenjang yang lebih serius. Hari itu menjadi awal pertemuan dua keluarga yang dipersatukan oleh niat baik dan harapan yang sama.",
    gradient: "from-[#d4e8d4] to-[#88a880]",
    images: ["/Stories/Chapter4.webp"],
  },
  {
    label: "last chapter",
    title: "Hari Bahagia",
    body: "Dengan penuh rasa syukur, kami memutuskan untuk mengikat janji suci pernikahan dan memulai babak baru kehidupan bersama. Semoga langkah ini menjadi awal dari perjalanan panjang yang penuh cinta, keberkahan, dan kebahagiaan.",
    gradient: "from-[#d4e8d4] to-[#88a880]",
    images: ["/Stories/Chapter5_Fix.webp"],
  },
];

function ChapterIndicators({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="flex gap-2">
      {chapters.map((_, index) => (
        <div
          key={index}
          className={`h-px transition-all duration-500 ${
            index === activeIndex ? "w-12 bg-[#9A2F2F]" : "w-5 bg-[#ead8d4]"
          }`}
        />
      ))}
    </div>
  );
}

function StoryImages({
  chapter,
  sizes,
}: {
  chapter: (typeof chapters)[number];
  sizes: string;
}) {
  const isGrid = chapter.images.length > 1;

  return (
    <div
      className={
        isGrid
          ? "grid h-full w-full grid-cols-2 grid-rows-2 gap-2 md:gap-3"
          : "h-full w-full"
      }
    >
      {chapter.images.map((src, index) => (
        <div key={src} className="relative h-full w-full overflow-hidden">
          <Image
            src={src}
            alt={`${chapter.title} ${index + 1}`}
            fill
            sizes={sizes}
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export function StorySection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Chapter 1: already visible at start, hold 0→0.19, quick out 0.19→0.20, stay 0 until end
  const ch1Opacity = useTransform(
    scrollYProgress,
    [0, 0.19, 0.2, 1],
    [1, 1, 0, 0],
  );
  const ch1Y = useTransform(
    scrollYProgress,
    [0, 0.19, 0.2, 1],
    [0, 0, -40, -40],
  );

  // Chapter 2: quick in 0.19→0.20, hold 0.20→0.39, quick out 0.39→0.40
  const ch2Opacity = useTransform(
    scrollYProgress,
    [0, 0.19, 0.2, 0.39, 0.4, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const ch2Y = useTransform(
    scrollYProgress,
    [0, 0.19, 0.2, 0.39, 0.4, 1],
    [40, 40, 0, 0, -40, -40],
  );

  // Chapter 3: quick in 0.39→0.40, hold 0.40→0.59, quick out 0.59→0.60
  const ch3Opacity = useTransform(
    scrollYProgress,
    [0, 0.39, 0.4, 0.59, 0.6, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const ch3Y = useTransform(
    scrollYProgress,
    [0, 0.39, 0.4, 0.59, 0.6, 1],
    [40, 40, 0, 0, -40, -40],
  );

  // Chapter 4: quick in 0.59→0.60, hold 0.60→0.79, quick out 0.79→0.80
  const ch4Opacity = useTransform(
    scrollYProgress,
    [0, 0.59, 0.6, 0.79, 0.8, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const ch4Y = useTransform(
    scrollYProgress,
    [0, 0.59, 0.6, 0.79, 0.8, 1],
    [40, 40, 0, 0, -40, -40],
  );

  // Chapter 5: quick in 0.79→0.80, hold 0.80→1, stay visible
  const ch5Opacity = useTransform(
    scrollYProgress,
    [0, 0.79, 0.8, 1],
    [0, 0, 1, 1],
  );
  const ch5Y = useTransform(scrollYProgress, [0, 0.79, 0.8, 1], [40, 40, 0, 0]);

  const opacities = [
    ch1Opacity,
    ch2Opacity,
    ch3Opacity,
    ch4Opacity,
    ch5Opacity,
  ];
  const yValues = [ch1Y, ch2Y, ch3Y, ch4Y, ch5Y];

  // Image opacity per chapter
  const img1Opacity = useTransform(
    scrollYProgress,
    [0, 0.19, 0.2, 1],
    [1, 1, 0, 0],
  );
  const img2Opacity = useTransform(
    scrollYProgress,
    [0, 0.19, 0.2, 0.39, 0.4, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const img3Opacity = useTransform(
    scrollYProgress,
    [0, 0.39, 0.4, 0.59, 0.6, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const img4Opacity = useTransform(
    scrollYProgress,
    [0, 0.59, 0.6, 0.79, 0.8, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const img5Opacity = useTransform(
    scrollYProgress,
    [0, 0.79, 0.8, 1],
    [0, 0, 1, 1],
  );
  const imgOpacities = [
    img1Opacity,
    img2Opacity,
    img3Opacity,
    img4Opacity,
    img5Opacity,
  ];

  return (
    <section
      id="story"
      ref={containerRef}
      className="relative h-[600vh] bg-[#fbfaf7] md:h-[400vh]"
    >
      <div className="story-sticky sticky top-0 flex h-[100svh] items-start overflow-hidden px-0 py-0 md:h-screen md:items-center md:px-16 md:py-16">
        <div className="story-shell w-full">
          <div className="story-grid relative h-[100svh] md:grid md:h-auto md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-10 lg:grid-cols-[minmax(0,540px)_minmax(0,582px)] lg:justify-center lg:gap-[92px] xl:gap-[110px]">
            {/* Text column */}
            <div className="story-text-column relative z-10 h-[calc(100svh-100vw)] overflow-hidden md:h-[65vh]">
              {chapters.map((chapter, i) => (
                <motion.div
                  key={chapter.title}
                  style={{ opacity: opacities[i], y: yValues[i] }}
                  className="absolute inset-0 flex flex-col justify-center px-6 py-4 md:justify-center md:px-0 md:py-0"
                >
                  <p className="story-label mb-2 font-sans text-[10px] font-normal uppercase leading-[14px] tracking-[2px] text-[#a18f8b] md:mb-5 md:text-[15px] md:leading-[22px] md:tracking-[2.5px]">
                    {chapter.label}
                  </p>
                  <h3 className="story-title mb-3 font-serif text-[30px] font-semibold leading-[1] tracking-normal text-[#4A0E0E] max-[360px]:text-[27px] md:mb-9 md:text-[56px] md:leading-[1.1] lg:text-[72px]">
                    {chapter.title}
                  </h3>
                  <p className="story-body max-w-[540px] font-sans text-[12px] font-normal leading-[18px] text-[#6f625f] max-[360px]:text-[11px] max-[360px]:leading-[16px] md:text-[18px] md:leading-[32px] lg:text-[21px] lg:leading-[36px]">
                    {chapter.body}
                  </p>
                  {/* Chapter indicators */}
                  <div className="hidden md:mt-24 md:block">
                    <ChapterIndicators activeIndex={i} />
                  </div>
                </motion.div>
              ))}

              <div
                className="pointer-events-none absolute bottom-5 left-6 z-20 md:hidden"
                aria-hidden="true"
              >
                <div className="relative h-px w-[148px]">
                  {chapters.map((chapter, i) => (
                    <motion.div
                      key={chapter.title}
                      style={{ opacity: opacities[i] }}
                      className="absolute inset-0"
                    >
                      <ChapterIndicators activeIndex={i} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Image stage — mobile only */}
            <div className="story-mobile-image-stage absolute bottom-0 left-0 aspect-square w-screen overflow-hidden bg-[#fbfaf7] md:hidden">
              {chapters.map((chapter, i) => (
                <motion.div
                  key={chapter.title}
                  initial={{ opacity: 0 }}
                  style={{
                    opacity: imgOpacities[i],
                    zIndex: chapters.length - i,
                  }}
                  className="absolute inset-0"
                >
                  <StoryImages chapter={chapter} sizes="100vw" />
                </motion.div>
              ))}
            </div>

            {/* Image column — desktop only */}
            <div className="story-image-stage relative hidden justify-self-center overflow-hidden bg-[#fbfaf7] md:block">
              {chapters.map((chapter, i) => {
                return (
                  <motion.div
                    key={chapter.title}
                    initial={{ opacity: 0 }}
                    style={{
                      opacity: imgOpacities[i],
                      zIndex: chapters.length - i,
                    }}
                    className="absolute inset-0"
                  >
                    <StoryImages
                      chapter={chapter}
                      sizes="(min-width: 2000px) 720px, (min-width: 1024px) 582px, 50vw"
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
