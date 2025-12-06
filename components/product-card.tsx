/**
 * @file components/product-card.tsx
 * @description 상품 카드 컴포넌트
 *
 * Grid 레이아웃에서 사용할 상품 카드 컴포넌트
 * 이미지(플레이스홀더), 이름, 가격, 카테고리, 재고 상태를 표시합니다.
 *
 * @dependencies
 * - @/types/product: Product 타입
 * - @/lib/utils: cn 함수
 * - next/image: 이미지 최적화
 * - lucide-react: 아이콘
 */

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";
import { formatPrice, getStockStatus } from "@/types/product";
import { cn } from "@/lib/utils";
import { Package, PackageCheck, PackageX } from "lucide-react";

interface ProductCardProps {
  product: Product;
  className?: string;
}

/**
 * 재고 상태에 따른 아이콘과 텍스트 반환
 */
function StockBadge({ stockQuantity }: { stockQuantity: number }) {
  const status = getStockStatus(stockQuantity);

  if (status === "품절") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded">
        <PackageX className="w-3 h-3" />
        품절
      </span>
    );
  }

  if (status === "재고 부족") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded">
        <Package className="w-3 h-3" />
        재고 부족
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded">
      <PackageCheck className="w-3 h-3" />
      재고 있음
    </span>
  );
}

/**
 * 카테고리 한글 변환
 */
function getCategoryLabel(category: string | null): string {
  const categoryMap: Record<string, string> = {
    electronics: "전자제품",
    clothing: "의류",
    books: "도서",
    food: "식품",
    sports: "스포츠",
    beauty: "뷰티",
    home: "생활용품",
  };

  return category ? categoryMap[category] || category : "기타";
}

export default function ProductCard({ product, className }: ProductCardProps) {
  // 상품 상세 페이지 링크 (Phase 2 후반에 구현 예정)
  const productUrl = `/products/${product.id}`;

  return (
    <Link
      href={productUrl}
      className={cn(
        "group relative flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
        className
      )}
      aria-label={`${product.name} 상품 상세 보기, 가격 ${product.price.toLocaleString()}원, ${getCategoryLabel(product.category)} 카테고리`}
    >
      {/* 이미지 영역 */}
      <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <img
          src="/placeholder-product.jpg"
          alt={`${product.name} 상품 이미지`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* 플레이스홀더 이미지 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Package className="w-16 h-16 text-gray-400 dark:text-gray-500" />
        </div>
        {/* 추후 상품 이미지 URL이 있으면 아래 주석 해제 */}
        {/* {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-400 dark:text-gray-500" />
          </div>
        )} */}

        {/* 재고 상태 배지 (우측 상단) */}
        <div className="absolute top-2 right-2">
          <StockBadge stockQuantity={product.stock_quantity} />
        </div>
      </div>

      {/* 상품 정보 영역 */}
      <div className="flex flex-col gap-2 p-4">
        {/* 카테고리 */}
        {product.category && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {getCategoryLabel(product.category)}
          </span>
        )}

        {/* 상품명 */}
        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* 설명 (선택적) */}
        {product.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* 가격 */}
        <div className="mt-auto pt-2">
          <p className="text-xl font-bold text-primary">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}

