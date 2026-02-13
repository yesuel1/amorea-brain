import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Noto_Sans_KR, Outfit, Cormorant_Garamond, Raleway } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { AuthCodeHandler } from "@/components/auth/AuthCodeHandler";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-outfit",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-raleway",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1A1A2E" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A2E" },
  ],
};

export const metadata: Metadata = {
  title: "AMOREA Brain Care - 뇌 습관, 미리 만들어야 늦지 않습니다",
  description: "매일 10분, 재미있는 게임으로 뇌를 깨우고 좋은 습관으로 젊은 뇌를 유지하세요. 50~60대를 위한 프리미엄 뇌 건강 플랫폼.",
  keywords: ["뇌건강", "뇌나이", "뇌운동", "기억력", "치매예방", "바이탈뷰티", "프리시니어"],
  openGraph: {
    title: "AMOREA Brain Care - 뇌 습관, 미리 만들어야 늦지 않습니다",
    description: "매일 10분, 재미있는 게임으로 뇌를 깨우고 좋은 습관으로 젊은 뇌를 유지하세요.",
    url: "https://amorea.kr/brain",
    siteName: "AMOREA Brain Care",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AMOREA Brain Care",
    description: "매일 10분, 재미있는 게임으로 뇌를 깨우고 좋은 습관으로 젊은 뇌를 유지하세요.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${notoSansKr.variable} ${outfit.variable} ${cormorant.variable} ${raleway.variable} font-sans antialiased bg-vb-bg text-vb-black`}
      >
        <Suspense fallback={null}>
          <AuthCodeHandler />
        </Suspense>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
