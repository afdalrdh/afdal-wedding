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
    images: ["/Stories/Chapter1.png"],
  },
  {
    label: "chapter two (2021 - 2023)",
    title: "Bertumbuh Bersama",
    body: "Kuliah, tugas, organisasi, dan banyak cerita menjadi bagian dari perjalanan kami. Di masa ini kami menikmati kebersamaan sambil belajar memahami, mendukung, dan bertumbuh menjadi pribadi yang lebih dewasa.",
    gradient: "from-[#d8d0e4] to-[#908098]",
    images: ["/Stories/Chapter2.png"],
  },
  {
    label: "chapter three (2023 - 2026)",
    title: "Menjelajah Dunia Bersama",
    body: "Memasuki dunia kerja, kami menemukan kebahagiaan dalam perjalanan-perjalanan sederhana ke berbagai tempat dan alam yang indah. Dari setiap perjalanan, kami belajar untuk saling memahami, menguatkan, dan menikmati setiap proses kehidupan bersama.",
    gradient: "from-[#d4e8d4] to-[#88a880]",
    images: [
      "/Stories/Chapter3_a.png",
      "/Stories/Chapter3_b.png",
      "/Stories/Chapter3_c.png",
      "/Stories/Chapter3_d.png",
    ],
  },
  {
    label: "chapter four (18 April 2026)",
    title: "Lamaran",
    body: "Dengan restu Allah SWT dan kedua keluarga, kami memutuskan membawa hubungan ini ke jenjang yang lebih serius. Hari itu menjadi awal pertemuan dua keluarga yang dipersatukan oleh niat baik dan harapan yang sama.",
    gradient: "from-[#d4e8d4] to-[#88a880]",
    images: ["/Stories/Chapter4.png"],
  },
  {
    label: "last chapter",
    title: "Hari Bahagia",
    body: "Dengan penuh rasa syukur, kami memutuskan untuk mengikat janji suci pernikahan dan memulai babak baru kehidupan bersama. Semoga langkah ini menjadi awal dari perjalanan panjang yang penuh cinta, keberkahan, dan kebahagiaan.",
    gradient: "from-[#d4e8d4] to-[#88a880]",
    images: ["/Stories/Chapter5_Fix.png"],
  },
];

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
      className="relative h-[300vh] bg-[#fbfaf7]"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden px-6 py-16 md:px-16">
        <div className="w-full">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
            {/* Text column */}
            <div className="relative h-[calc(100svh-8rem)] md:h-[65vh]">
              {chapters.map((chapter, i) => (
                <motion.div
                  key={chapter.title}
                  style={{ opacity: opacities[i], y: yValues[i] }}
                  className="absolute inset-0 flex flex-col justify-center"
                >
                  <p className="mb-3 font-sans text-[14px] font-normal uppercase leading-[20px] tracking-[1.2px] text-neutral-400">
                    {chapter.label}
                  </p>
                  <h3 className="mb-5 font-serif text-[32px] font-semibold leading-none tracking-normal text-[#4A0E0E] md:text-[40px]">
                    {chapter.title}
                  </h3>
                  <p className="max-w-[540px] font-sans text-[14px] font-normal leading-[24px] text-neutral-600 md:text-[16px] md:leading-[28px]">
                    {chapter.body}
                  </p>
                  <div
                    className={`mt-6 md:hidden ${
                      chapter.images.length > 1
                        ? "grid grid-cols-2 gap-2"
                        : "mx-auto w-full max-w-[320px]"
                    }`}
                  >
                    {chapter.images.map((src, idx) => (
                      <div
                        key={src}
                        className={`relative overflow-hidden bg-[#fbfaf7] ${
                          chapter.images.length > 1
                            ? "aspect-[4/5]"
                            : "h-[min(30svh,250px)]"
                        }`}
                      >
                        <Image
                          src={src}
                          alt={`${chapter.title} ${idx + 1}`}
                          fill
                          sizes="100vw"
                          className={
                            chapter.images.length > 1
                              ? "object-cover"
                              : "object-contain"
                          }
                        />
                      </div>
                    ))}
                  </div>
                  {/* Chapter indicators */}
                  <div className="mt-7 flex gap-2 md:mt-10">
                    {chapters.map((_, j) => (
                      <div
                        key={j}
                        className={`h-px transition-all duration-500 ${
                          j === i ? "w-10 bg-neutral-950" : "w-4 bg-neutral-300"
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Image column — desktop only */}
            <div className="relative hidden h-[75vh] overflow-hidden bg-[#fbfaf7] md:block">
              {chapters.map((chapter, i) => {
                const isGrid = chapter.images.length > 1;
                return (
                  <motion.div
                    key={chapter.title}
                    initial={{ opacity: 0 }}
                    style={{
                      opacity: imgOpacities[i],
                      zIndex: chapters.length - i,
                    }}
                    className={`absolute inset-0 ${
                      isGrid ? "grid grid-cols-2 grid-rows-2 gap-3" : ""
                    }`}
                  >
                    {chapter.images.map((src, idx) => (
                      <div
                        key={idx}
                        className={`relative overflow-hidden ${
                          isGrid ? "" : "h-full w-full"
                        }`}
                      >
                        <Image
                          src={src}
                          alt={`${chapter.title} ${idx + 1}`}
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          className={isGrid ? "object-cover" : "object-contain"}
                        />
                      </div>
                    ))}
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
