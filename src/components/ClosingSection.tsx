import Image from "next/image";

export function ClosingSection() {
  return (
    <footer className="relative isolate flex min-h-[100svh] overflow-hidden bg-black text-center text-white">
      <Image
        src="/Footer.webp"
        alt="Afdal dan Putri berjalan di antara pepohonan tepi danau"
        fill
        sizes="100vw"
        className="absolute inset-0 z-0 object-cover object-[50%_center]"
      />
      <div className="absolute inset-0 z-10 bg-black/58" />
      <div className="absolute inset-0 z-10 bg-linear-to-b from-black/20 via-transparent to-black/25" />

      <div className="relative z-20 flex min-h-[100svh] w-full flex-col items-center justify-center px-5 pb-28 pt-20 md:px-16 md:pb-28 md:pt-24">
        <p className="font-sans text-[14px] font-normal uppercase leading-[20px] tracking-[3px] text-white/75 md:text-[15px] md:tracking-[3.4px]">
          See You On Our Big Day
        </p>

        <p className="mt-9 max-w-[350px] font-serif text-[23px] font-normal italic leading-[1.42] tracking-normal text-white md:mt-10 md:max-w-[1220px] md:text-[42px] md:leading-[1.32] lg:text-[44px]">
          Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila
          Bapak/Ibu/Saudara/i, berkenan hadir dan memberikan do&apos;a restu
          kepada kami
        </p>

        <div className="mt-10 h-20 w-px bg-white/85 md:mt-12" />

        <p className="mt-10 font-display text-[58px] font-normal uppercase leading-none tracking-normal text-white md:mt-12 md:text-[72px] lg:text-[76px]">
          Afdal &amp; Putri
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-30 flex h-[70px] items-center justify-center border-t border-white/35 px-6 md:h-[72px]">
        <p className="font-sans text-[18px] font-normal leading-[26px] tracking-normal text-white md:text-[19px]">
          Made With <span className="px-2 text-[22px] leading-none">♥</span>
          <a
            href="https://solidtechno.com"
            target="_blank"
            rel="noreferrer"
            className="underline-offset-4 hover:underline md:no-underline md:hover:underline"
          >
            SolidTechnoID
          </a>
        </p>
      </div>
    </footer>
  );
}
