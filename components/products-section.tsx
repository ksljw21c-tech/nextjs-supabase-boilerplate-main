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
import { ProductGridSkeleton, LoadingCard } from "@/components/loading";

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
          throw new Error("Failed to fetch products");
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

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-8 max-w-md mx-auto">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-4">
            데이터를 불러올 수 없습니다
          </h3>
          <p className="text-red-700 dark:text-red-300 mb-6">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-8 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-4">
            상품 데이터가 준비되지 않았습니다
          </h3>
          <p className="text-yellow-700 dark:text-yellow-300 mb-6">
            Supabase 데이터베이스에 상품 테이블을 생성하고 샘플 데이터를 추가해야 합니다.
          </p>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>SQL 실행 가이드:</strong> docs/ADMIN_PRODUCT_MANAGEMENT.md 파일을 참고하세요.
          </p>
        </div>
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
