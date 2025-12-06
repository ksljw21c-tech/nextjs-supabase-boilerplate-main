/**
 * @file app/manifest.ts
 * @description Web App Manifest 생성
 *
 * PWA(Progressive Web App) 설정을 위한 manifest.json을 동적으로 생성합니다.
 * 홈 화면에 앱 추가, 스플래시 화면 등을 설정합니다.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest
 */

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "의류 쇼핑몰",
    short_name: "쇼핑몰",
    description:
      "Next.js 15, Clerk, Supabase, Toss Payments를 활용한 모던 쇼핑몰",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#3b82f6",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["shopping", "fashion", "lifestyle"],
    lang: "ko",
    dir: "ltr",
    prefer_related_applications: false,
  };
}

