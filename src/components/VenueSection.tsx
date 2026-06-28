import Image from "next/image";

const mapsUrl = "https://maps.app.goo.gl/c1f1gSJj4YU5AWZG9";

const schedules = [
  {
    label: "Akad Nikah",
    time: "08.00 - 10.00 WIB",
  },
  {
    label: "Resepsi",
    time: "11.00 - 14.00 WIB",
  },
];

export function VenueSection() {
  return (
    <section
      id="venue"
      className="bg-white px-5 py-20 text-[#544341] md:px-8 md:py-28"
    >
      <div className="mx-auto grid max-w-[1290px] gap-12 md:grid-cols-[0.95fr_1fr] md:items-center md:gap-20">
        <div className="mx-auto w-full max-w-[565px] bg-white">
          <Image
            src="/Venue Main Image.webp"
            alt="Marsoeta Coffee & Eatery"
            width={1085}
            height={1450}
            sizes="(min-width: 768px) 45vw, 100vw"
            className="h-auto w-full"
          />
        </div>

        <div className="mx-auto w-full max-w-[580px] text-center md:mx-0 md:text-left">
          <p className="font-sans text-[14px] font-normal uppercase leading-[20px] tracking-[1.2px] text-[#877270]">
            Location
          </p>

          <h2 className="mt-9 font-serif text-[42px] font-semibold leading-none tracking-normal text-[#4A0E0E] sm:text-[54px] md:text-[64px]">
            Marsoeta Coffee
            <br />
            &amp; Eatery
          </h2>

          <div className="mx-auto mt-9 h-px w-[58px] bg-[#d7c5c0] md:mx-0" />

          <p className="mt-8 max-w-[560px] font-sans text-[16px] font-normal leading-[28px] tracking-normal text-[#544341]">
            Jl. Raya Soreang - Banjaran, Cangkuang, Kec. Cangkuang,
            <br className="hidden md:block" />
            Kabupaten Bandung, Jawa Barat 40238
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:gap-[30px]">
            {schedules.map((schedule) => (
              <div
                key={schedule.label}
                className="flex min-h-[156px] flex-col items-center justify-center bg-[#FBFBF9] px-6 py-8 text-center"
              >
                <p className="font-serif text-[18px] font-normal leading-[28px] tracking-normal text-[#4A0E0E]">
                  {schedule.label}
                </p>
                <p className="mt-4 font-sans text-[22px] font-semibold leading-[24px] tracking-normal text-[#1F1C0B]">
                  {schedule.time}
                </p>
              </div>
            ))}
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-3 rounded-[14px] bg-[#F4EFE8] px-[clamp(18px,4vw,29px)] py-[clamp(10px,2vw,15px)] font-sans text-[clamp(15px,2.8vw,21px)] font-normal leading-none tracking-normal text-[#4A0E0E] transition-colors hover:bg-[#FBFBF9] md:rounded-[9px] md:px-6 md:py-3 md:text-[17px]"
          >
            Lihat di Maps
            <svg
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
            >
              <path
                d="M5.25 13.75L13.75 5.25M8 5.25H13.75V11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
