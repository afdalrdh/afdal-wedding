import type { Metadata } from "next";
import {
  Bebas_Neue,
  Inter,
  Montserrat,
  Source_Serif_4,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif-pro",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wedding.afdalrdh.com"),
  title: "Wedding Afdal & Putri",
  description:
    "Undangan pernikahan Afdal dan Putri. Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.",
  keywords: [
    "Wedding Afdal & Putri",
    "Wedding Afdal",
    "Afdal Putri Wedding",
    "Pernikahan Afdal dan Putri",
    "Undangan Pernikahan Afdal dan Putri",
    "Afdal dan Putri",
  ],
  authors: [{ name: "Afdal & Putri" }],
  openGraph: {
    title: "Wedding Afdal & Putri",
    description:
      "Undangan pernikahan Afdal dan Putri. Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.",
    type: "website",
    locale: "id_ID",
    url: "https://wedding.afdalrdh.com/",
    siteName: "Wedding Afdal & Putri",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding Afdal & Putri",
    description:
      "Undangan pernikahan Afdal dan Putri. Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${montserrat.variable} ${bebasNeue.variable} ${sourceSerif.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
