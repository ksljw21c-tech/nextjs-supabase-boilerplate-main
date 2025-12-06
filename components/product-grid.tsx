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
import { ShoppingBag, ArrowRight } from "lucide-react";

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
        <div className="glass-card rounded-3xl p-12 max-w-lg mx-auto">
          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-chart-2/20 flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-primary" />
            </div>
            <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-chart-2 opacity-20 blur-xl" />
          </div>
          
          <h3 className="text-xl font-bold mb-3 text-gradient">
            상품이 없습니다
          </h3>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            현재 표시할 상품이 없습니다.
            <br />
            다른 카테고리를 확인해보세요.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            전체 상품 보기
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 ${className || ""}`}
    >
      {products.map((product, index) => (
        <div 
          key={product.id}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}

/**
 * 로딩 상태 스켈레톤 카드
 */
function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-gradient-to-br from-muted to-muted/50" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-20 bg-muted rounded-full" />
        <div className="h-6 w-3/4 bg-muted rounded-lg" />
        <div className="h-4 w-full bg-muted rounded-lg" />
        <div className="pt-3 border-t border-border/50">
          <div className="h-8 w-1/2 bg-muted rounded-lg" />
        </div>
      </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i}
              className="animate-in fade-in duration-500"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <SkeletonCard />
            </div>
          ))}
        </div>
      }
    >
      <ProductGrid products={products} className={className} />
    </Suspense>
  );
}
