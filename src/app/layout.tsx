import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import NavbarWrapper from "@/components/NavbarWrapper";
import CookieBanner from "@/components/CookieBanner";
import SessionExpiredModal from "@/components/SessionExpiredModal";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MediAI - 병원 AI 마케팅 어시스턴트",
  description: "병원/의원을 위한 AI 마케팅 자동화 SaaS. 리뷰 답변, SNS 콘텐츠, FAQ를 AI로 10배 빠르게.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "MediAI - 병원 AI 마케팅 어시스턴트",
    description: "병원/의원을 위한 AI 마케팅 자동화 SaaS",
    siteName: "MediAI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <NavbarWrapper />
          {children}
          <SessionExpiredModal />
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
