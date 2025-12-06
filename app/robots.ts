/**
 * @file app/robots.ts
 * @description robots.txt 생성
 *
 * 검색 엔진 크롤러의 접근을 제어하는 robots.txt 파일을 동적으로 생성합니다.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth-test",
          "/integration-test",
          "/storage-test",
          "/checkout",
          "/cart",
          "/my-orders",
          "/orders/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

