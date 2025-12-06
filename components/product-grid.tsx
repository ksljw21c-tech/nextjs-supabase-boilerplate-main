/**
 * @file components/product-grid.tsx
 * @description 상품 목록 Grid 컴포넌트
 *
 * 반응형 Grid 레이아웃으로 상품 목록을 표시합니다.
 * 모바일 1열, 태블릿 2열, 데스크톱 3열로 구성됩니다.
 *
 * @dependencies
 * - @/types/product: Product 타입
 * - @/components/product-card: ProductCard 컴포넌트
 */

import { Suspense } from "react";
import type { Product } from "@/types/product";
import Link from "next/link";
import ProductCard from "@/components/product-card";

interface ProductGridProps {
  products: Product[];
  className?: string;
}

/**
 * 상품 Grid 컴포넌트
 *
 * @param products 표시할 상품 배열
 * @param className 추가 CSS 클래스
 */
export default function ProductGrid({
  products,
  className,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-12 max-w-md mx-auto">
          <div className="text-6xl mb-4">🛍️</div>
          <h3 className="text-lg font-semibold mb-2">상품이 없습니다</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            현재 표시할 상품이 없습니다. 다른 카테고리를 확인해보세요.
          </p>
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
            전체 상품 보기 →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className || ""}`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

/**
 * 로딩 상태를 포함한 ProductGrid
 * Suspense와 함께 사용합니다.
 */
export function ProductGridWithSuspense({
  products,
  className,
}: ProductGridProps) {
  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square animate-pulse"
            />
          ))}
        </div>
      }
    >
      <ProductGrid products={products} className={className} />
    </Suspense>
  );
}

