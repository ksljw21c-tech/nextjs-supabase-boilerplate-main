/**
 * @file components/products-section.tsx
 * @description 상품 목록 섹션 컴포넌트
 *
 * 상품 데이터를 가져와서 표시하는 Client Component
 */

"use client";

import { useEffect, useState } from "react";
import ProductGrid from "@/components/product-grid";
import CategoryFilter from "@/components/category-filter";
import Pagination from "@/components/pagination";
import { ProductGridSkeleton } from "@/components/loading";
import { EmptyProducts, EmptyCategoryProducts, LoadError } from "@/components/empty-state";

interface ProductsSectionProps {
  category?: string;
  page: number;
}

export default function ProductsSection({ category, page }: ProductsSectionProps) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (category) params.set("category", category);
        params.set("page", page.toString());

        const response = await fetch(`/api/products?${params}`);
        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error Response:", {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
            url: `/api/products?${params}`
          });
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        setProducts(data.products || []);
        setCategories(data.categories || []);
        setTotalPages(data.totalPages || 0);
        setError(null);
      } catch (error) {
        console.error("Failed to load products:", error);
        setProducts([]);
        setCategories([]);
        setTotalPages(0);

        // 네트워크 에러인지 데이터베이스 에러인지 구분
        if (error instanceof TypeError && error.message.includes("fetch")) {
          setError("네트워크 연결을 확인해주세요.");
        } else if (error instanceof Error && error.message.includes("500")) {
          setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } else {
          setError("상품 데이터를 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [category, page]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          ))}
        </div>
        <ProductGridSkeleton />
      </div>
    );
  }

  // 데이터 다시 불러오기 함수
  const handleRetry = () => {
    window.location.reload();
  };

  if (error) {
    return (
      <div className="border dark:border-gray-700 rounded-lg bg-red-50 dark:bg-red-900/20">
        <LoadError message={error} onRetry={handleRetry} />
      </div>
    );
  }

  if (products.length === 0) {
    // 카테고리 필터가 적용된 경우
    if (category) {
      return (
        <div className="border dark:border-gray-700 rounded-lg">
          <EmptyCategoryProducts
            category={category}
            onViewAll={() => {
              window.location.href = "/";
            }}
          />
        </div>
      );
    }
    // 전체 상품이 없는 경우
    return (
      <div className="border dark:border-gray-700 rounded-lg">
        <EmptyProducts onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <CategoryFilter categories={categories} currentCategory={category || null} />
      </div>

      <ProductGrid products={products} />

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination currentPage={page} totalPages={totalPages} />
        </div>
      )}
    </>
  );
}
