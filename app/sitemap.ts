/**
 * @file app/sitemap.ts
 * @description sitemap.xml 생성
 *
 * 검색 엔진이 사이트를 크롤링할 때 사용하는 sitemap.xml을 동적으로 생성합니다.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000";

  // 정적 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  // TODO: 동적 상품 페이지들 추가 (데이터베이스에서 상품 목록 조회)
  // const products = await getProducts();
  // const productPages = products.map((product) => ({
  //   url: `${baseUrl}/products/${product.id}`,
  //   lastModified: new Date(product.updated_at),
  //   changeFrequency: "weekly" as const,
  //   priority: 0.8,
  // }));

  return [...staticPages];
}

