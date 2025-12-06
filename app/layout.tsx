import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "@/components/Navbar";
import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { SkipToContent } from "@/components/skip-to-content";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SaaS 템플릿",
  description: "Next.js + Clerk + Supabase 보일러플레이트",
};

/**
 * Clerk 한국어 로컬라이제이션 설정
 * 
 * 공식 문서 모범 사례를 따릅니다:
 * - 기본 한국어 로컬라이제이션 (koKR) 사용
 * - 커스텀 에러 메시지 한국어화 (선택사항)
 * - Tailwind CSS 4 호환성을 위한 cssLayerName 설정
 * 
 * @see https://clerk.com/docs/guides/customizing-clerk/localization
 */
const clerkLocalization = {
  ...koKR,
  // 커스텀 에러 메시지 한국어화 (선택사항)
  unstable__errors: {
    ...koKR.unstable__errors,
    // 필요시 특정 에러 메시지를 커스터마이징할 수 있습니다
    // 예: not_allowed_access: "접근이 허용되지 않습니다. 문의사항이 있으시면 이메일로 연락주세요.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={clerkLocalization}
      appearance={{
        // Tailwind CSS 4 호환성을 위한 설정
        cssLayerName: "clerk",
      }}
    >
      <html lang="ko">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SyncUserProvider>
            <ErrorBoundary>
              <SkipToContent />
              <Navbar />
              <div id="main-content">
                {children}
              </div>
            </ErrorBoundary>
          </SyncUserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
