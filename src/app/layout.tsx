import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EV Transition Assistant",
  description:
    "Make informed decisions about switching to electric vehicles with personalized cost analysis, environmental impact assessments, and AI-powered recommendations.",
  keywords: [
    "electric vehicles",
    "EV transition",
    "cost analysis",
    "environmental impact",
    "vehicle comparison",
    "EV calculator",
    "charging infrastructure",
  ],
  authors: [{ name: "EV Transition Assistant Team" }],
  openGraph: {
    title: "EV Transition Assistant",
    description:
      "Smart EV transition planning with AI-powered analysis and recommendations",
    type: "website",
    siteName: "EV Transition Assistant",
  },
  twitter: {
    card: "summary_large_image",
    title: "EV Transition Assistant",
    description:
      "Smart EV transition planning with AI-powered analysis and recommendations",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
