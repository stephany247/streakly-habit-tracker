import type { Metadata, Viewport } from "next";
import { DM_Sans, Bebas_Neue } from "next/font/google";
import "./globals.css";
import ServiceWorkerProvider from "@/components/shared/ServiceWorkerProvider";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "Streakly",
    template: "%s | Streakly",
  },
  description:
    "A clean and modern habit tracker that helps you build consistency, track daily progress, and maintain streaks.",
  manifest: "/manifest.json",
  applicationName: "Streakly",
  keywords: [
    "habit tracker",
    "productivity",
    "streak tracker",
    "daily habits",
    "goals",
    "routine",
    "PWA",
  ],
  authors: [
    {
      name: "StephanieOguocha",
    },
  ],
  creator: "Stephanie Oguocha",
  openGraph: {
    title: "Streakly",
    description: "Track habits, build consistency, and keep your streak alive.",
    siteName: "Streakly",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Streakly",
    description: "Track habits, build consistency, and keep your streak alive.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f97316",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ServiceWorkerProvider />
        {children}
      </body>
    </html>
  );
}
