/**
 * @file app/page.tsx
 * @description 홈페이지 - 상품 목록 Grid 레이아웃
 *
 * 홈페이지에 상품 목록을 Grid 레이아웃으로 표시합니다.
 * 카테고리 필터링과 페이지네이션을 지원합니다.
 */

import { Suspense } from "react";
import { getProducts, getProductCategories } from "@/lib/supabase/queries/products";
import ProductsSection from "@/components/products-section";

interface HomeProps {
  searchParams: Promise<{
    category?: string;
    page?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const category = params.category;
  const page = parseInt(params.page || "1", 10);

  return (
    <main className="min-h-[calc(100vh-80px)] px-4 py-8 md:px-8 md:py-12">
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            상품 목록
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            최신 상품을 확인해보세요
          </p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <ProductsSection category={category} page={page} />
        </Suspense>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-semibold mb-2">디버그 정보</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              카테고리: {category || "없음"}, 페이지: {page}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              이 메시지는 개발 환경에서만 표시됩니다.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}