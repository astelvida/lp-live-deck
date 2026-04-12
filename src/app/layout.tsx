import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-sans",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Signals Over Stories — A fund thesis, rendered in real time",
    template: "%s · Signals Over Stories",
  },
  description:
    "Live LP-grade fund pitch. Pipeline counts, SSI score distribution, signal velocity and thesis validation — pulled directly from the operating system of a European early-stage AI fund.",
  openGraph: {
    title: "A fund thesis, rendered in real time",
    description:
      "Not a pitch deck. The output of a pitch-generating system. Live pipeline, live signals, live theses — updating as they happen.",
    type: "website",
    url: siteUrl,
    siteName: "Signals Over Stories",
  },
  twitter: {
    card: "summary_large_image",
    title: "A fund thesis, rendered in real time",
    description:
      "Live pipeline, live signals, live theses — pulled from Notion and rendered in real time.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrumentSans.variable} ${jetbrains.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
