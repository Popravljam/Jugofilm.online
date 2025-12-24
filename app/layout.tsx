import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleAdsense from "@/components/GoogleAdsense";
import CookieConsent from "@/components/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jugofilm.online - Ex-Yu filmska baza",
  description: "Istražite filmove, glumce i saradnje iz cijele bivše Jugoslavije. Kompletna baza ex-Yu kinematografije.",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
  const adsenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

  return (
    <html lang="sr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {gaId && <GoogleAnalytics measurementId={gaId} />}
        {adsenseId && <GoogleAdsense publisherId={adsenseId} />}
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
