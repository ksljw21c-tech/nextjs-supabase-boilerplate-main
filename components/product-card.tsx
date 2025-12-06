/**
 * @file components/product-card.tsx
 * @description 상품 카드 컴포넌트
 *
 * Grid 레이아웃에서 사용할 상품 카드 컴포넌트
 * 모던한 글래스모피즘 효과와 호버 애니메이션을 적용했습니다.
 *
 * @dependencies
 * - @/types/product: Product 타입
 * - @/lib/utils: cn 함수
 * - lucide-react: 아이콘
 */

import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice, getStockStatus } from "@/types/product";
import { cn } from "@/lib/utils";
import { Package, PackageCheck, PackageX, ShoppingCart, Eye, Star } from "lucide-react";

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
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-red-500/90 text-white rounded-full shadow-lg backdrop-blur-sm">
        <PackageX className="w-3.5 h-3.5" />
        품절
      </span>
    );
  }

  if (status === "재고 부족") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-amber-500/90 text-white rounded-full shadow-lg backdrop-blur-sm">
        <Package className="w-3.5 h-3.5" />
        재고 부족
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-500/90 text-white rounded-full shadow-lg backdrop-blur-sm">
      <PackageCheck className="w-3.5 h-3.5" />
      재고 있음
    </span>
  );
}

/**
 * 카테고리 한글 변환 및 이모지
 */
function getCategoryInfo(category: string | null): { label: string; emoji: string } {
  const categoryMap: Record<string, { label: string; emoji: string }> = {
    electronics: { label: "전자제품", emoji: "📱" },
    clothing: { label: "의류", emoji: "👕" },
    books: { label: "도서", emoji: "📚" },
    food: { label: "식품", emoji: "🍎" },
    sports: { label: "스포츠", emoji: "⚽" },
    beauty: { label: "뷰티", emoji: "💄" },
    home: { label: "생활용품", emoji: "🏠" },
  };

  return category 
    ? categoryMap[category] || { label: category, emoji: "📦" }
    : { label: "기타", emoji: "📦" };
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const productUrl = `/products/${product.id}`;
  const categoryInfo = getCategoryInfo(product.category);
  const isOutOfStock = product.stock_quantity === 0;

  return (
    <Link
      href={productUrl}
      className={cn(
        "product-card group relative flex flex-col glass-card",
        isOutOfStock && "opacity-75",
        className
      )}
      aria-label={`${product.name} 상품 상세 보기, 가격 ${product.price.toLocaleString()}원, ${categoryInfo.label} 카테고리`}
    >
      {/* 이미지 영역 */}
      <div className="relative w-full aspect-square overflow-hidden rounded-t-2xl bg-gradient-to-br from-muted to-muted/50">
        {/* 플레이스홀더 이미지 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <Package className="w-20 h-20 text-muted-foreground/30" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-chart-2/20 rounded-full blur-xl" />
          </div>
        </div>

        {/* 호버 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* 호버 시 액션 버튼 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <button 
            className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-primary font-semibold px-4 py-2 rounded-full text-sm hover:bg-white transition-colors shadow-lg"
            onClick={(e) => e.preventDefault()}
          >
            <Eye className="w-4 h-4" />
            자세히
          </button>
          <button 
            className="flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => e.preventDefault()}
            disabled={isOutOfStock}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

        {/* 재고 상태 배지 (좌측 상단) */}
        <div className="absolute top-3 left-3">
          <StockBadge stockQuantity={product.stock_quantity} />
        </div>

        {/* 인기 상품 배지 (우측 상단) - 랜덤하게 표시 */}
        {product.stock_quantity > 50 && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold bg-gradient-to-r from-chart-5 to-chart-3 text-white rounded-full shadow-lg">
              <Star className="w-3 h-3 fill-current" />
              HOT
            </span>
          </div>
        )}
      </div>

      {/* 상품 정보 영역 */}
      <div className="flex flex-col gap-3 p-5">
        {/* 카테고리 */}
        {product.category && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground w-fit px-2 py-1 bg-muted rounded-full">
            <span>{categoryInfo.emoji}</span>
            {categoryInfo.label}
          </span>
        )}

        {/* 상품명 */}
        <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-snug">
          {product.name}
        </h3>

        {/* 설명 (선택적) */}
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* 가격 */}
        <div className="mt-auto pt-3 border-t border-border/50">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black text-gradient">
              {formatPrice(product.price)}
            </p>
            {!isOutOfStock && (
              <span className="text-xs text-muted-foreground">
                재고 {product.stock_quantity}개
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
