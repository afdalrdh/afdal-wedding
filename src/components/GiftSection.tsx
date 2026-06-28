"use client";

import Image from "next/image";
import { useState } from "react";

interface BankAccount {
  bank: "mandiri" | "bri";
  bankName: string;
  number: string;
  holder: string;
}

const bankAccounts: BankAccount[] = [
  {
    bank: "mandiri",
    bankName: "BANK MANDIRI",
    number: "1300 0260 0977 2",
    holder: "PUTRI ANDIYANI",
  },
  {
    bank: "bri",
    bankName: "BANK BRI",
    number: "0675 0101 2631 509",
    holder: "AFDAL RAMDAN DAMAN HURI",
  },
];

function CopyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="8"
        y="8"
        width="11"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5 15H4.5C3.67 15 3 14.33 3 13.5V4.5C3 3.67 3.67 3 4.5 3H13.5C14.33 3 15 3.67 15 4.5V5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ContactlessIcon() {
  return (
    <svg width="34" height="46" viewBox="0 0 34 46" fill="none" aria-hidden>
      <path
        d="M5 12C11.5 17.8 11.5 28.2 5 34"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M13 7C22 16 22 30 13 39"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M21 2C33 14.5 33 31.5 21 44"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

function BankCard({
  account,
  copied,
  onCopy,
}: {
  account: BankAccount;
  copied: boolean;
  onCopy: () => void;
}) {
  const isMandiri = account.bank === "mandiri";

  return (
    <article
      className={`relative overflow-hidden rounded-[18px] border border-white/25 p-7 text-white shadow-[0_20px_45px_rgba(0,0,0,0.22)] md:p-8 lg:p-7 2xl:p-8 ${
        isMandiri
          ? "bg-linear-to-br from-[#24231F] to-[#424437]"
          : "bg-linear-to-br from-[#082C63] to-[#303846]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {isMandiri ? (
          <>
            <div className="flex flex-col">
              <Image
                src="/Mandiri.svg"
                alt="Logo Mandiri"
                width={74}
                height={22}
                aria-hidden="true"
                className="self-end"
              />
              <p className="mt-1 font-inter text-[24px] md:text-[32px] font-semibold leading-none tracking-normal text-white">
                BANK MANDIRI
              </p>
            </div>
            <span className="text-white/85">
              <ContactlessIcon />
            </span>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <Image
                src="/BRI.svg"
                alt="Logo BRI"
                width={36}
                height={36}
                aria-hidden="true"
              />
              <p className="font-inter text-[24px] md:text-[32px] font-semibold leading-none tracking-normal text-white">
                BANK BRI
              </p>
            </div>
            <span className="text-white/85">
              <ContactlessIcon />
            </span>
          </>
        )}
      </div>

      <div className="mt-8 flex items-center gap-3 md:mt-10 lg:mt-7 2xl:mt-10">
        <p className="font-inter text-[22px] font-semibold leading-none tracking-normal text-white md:text-[34px] lg:text-[30px] 2xl:text-[34px]">
          {account.number}
        </p>
        <button
          type="button"
          onClick={onCopy}
          aria-label={`Salin nomor rekening ${account.bankName}`}
          className="text-white/85 transition hover:text-white"
        >
          <CopyIcon />
        </button>
      </div>

      <div className="mt-3">
        <p className="font-inter text-[7.08px] font-medium uppercase leading-none text-white md:text-[9.08px]">
          Valid Thru
        </p>
        <p className="mt-1 font-inter text-[14.16px] font-medium leading-none text-white md:text-[18.16px]">
          07/26
        </p>
      </div>

      <div className="mt-4 flex items-end justify-between gap-4 lg:mt-3 2xl:mt-4">
        <p className="font-inter text-[14.04px] font-medium uppercase leading-none text-white md:text-[18px]">
          {account.holder}
        </p>
        <div className="flex -space-x-4">
          <span className="h-11 w-11 rounded-full bg-[#FF2424] md:h-12 md:w-12" />
          <span className="h-11 w-11 rounded-full bg-[#FF9A36] opacity-95 md:h-12 md:w-12" />
        </div>
      </div>

      {copied && (
        <p className="absolute bottom-4 right-6 rounded-full bg-white/16 px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-[1px] text-white">
          Disalin
        </p>
      )}
    </article>
  );
}

export function GiftSection() {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const copyAccountNumber = async (account: BankAccount) => {
    const plainNumber = account.number.replaceAll(" ", "");
    try {
      await navigator.clipboard.writeText(plainNumber);
      setCopiedAccount(account.number);
      window.setTimeout(() => setCopiedAccount(null), 1600);
    } catch {
      setCopiedAccount(null);
    }
  };

  return (
    <section
      id="gift"
      className="bg-white px-6 py-12 text-[#f7efe8] md:px-8 lg:flex lg:min-h-[100svh] lg:items-center lg:py-6"
    >
      <div className="mx-auto w-full max-w-[1160px]">
        <p className="font-sans text-[12px] font-normal uppercase leading-[16px] tracking-[1.2px] text-[#9C4143]">
          Wedding Gift
        </p>

        <h2 className="mt-4 max-w-[780px] font-serif text-[42px] font-semibold leading-none tracking-normal text-[#4A0E0E] md:text-[64px]">
          Berbagi Kebahagiaan
        </h2>

        <p className="mt-5 max-w-[890px] font-sans text-[16px] font-normal leading-[28px] text-[#544341]">
          Kehadiran Anda sudah menjadi kebahagiaan tersendiri bagi kami. Jika
          berkenan memberikan tanda kasih, kami menyediakan informasi berikut
          untuk memudahkan Anda.
        </p>

        <div className="mt-8 grid gap-7 lg:grid-cols-[0.92fr_1fr] lg:items-stretch lg:gap-9">
          <div className="grid gap-4">
            {bankAccounts.map((account) => (
              <BankCard
                key={account.number}
                account={account}
                copied={copiedAccount === account.number}
                onCopy={() => copyAccountNumber(account)}
              />
            ))}
          </div>

          <article className="overflow-hidden rounded-[18px] border border-white/25 bg-[#fff7ef] text-[#6d625f] shadow-[0_20px_45px_rgba(0,0,0,0.22)]">
            <div className="px-6 pt-6 md:px-8 md:pt-7 lg:px-8 lg:pt-6">
              <Image
                src="/Hadiah.webp"
                alt="Ilustrasi hadiah untuk pengiriman ke rumah"
                width={1402}
                height={1122}
                sizes="(min-width: 1536px) 540px, (min-width: 1024px) 420px, (min-width: 768px) 480px, calc(100vw - 96px)"
                className="mx-auto h-auto w-full max-w-[480px] lg:max-w-[420px] 2xl:max-w-[540px]"
              />
            </div>
            <div className="px-6 pb-8 pt-5 md:px-8 md:pb-8 lg:pb-7 lg:pt-3">
              <h3 className="font-serif text-[32px] font-semibold leading-none text-[#4A0E0E]">
                Kirim ke Rumah
              </h3>
              <p className="mt-4 font-sans text-[16px] font-normal leading-[26px] text-[#544341]">
                Apabila Anda berkenan memberikan tanda kasih, kami telah menyiapkan daftar hadiah yang dapat dipilih melalui tombol di bawah ini.
              </p>
              <a
                href="https://www.myregistry.com/giftlist/afput-wedding"
                target="_blank"
                rel="noreferrer"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#4A0E0E] px-6 py-4 font-sans text-[13px] font-bold uppercase tracking-[1.5px] text-white transition hover:bg-[#3A0B0B]"
              >
                Pilih Hadiah
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="8" width="18" height="4" rx="1"></rect>
                  <path d="M12 8v13"></path>
                  <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path>
                  <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"></path>
                </svg>
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
