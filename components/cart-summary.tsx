/**
 * @file components/cart-summary.tsx
 * @description 장바구니 요약 컴포넌트
 *
 * 장바구니 총액, 총 개수를 표시하고 주문하기 버튼을 제공합니다.
 */

"use client";

import Link from "next/link";
import type { CartItemWithProduct } from "@/types/cart";
import { calculateCartTotal, calculateCartItemCount } from "@/lib/utils/cart";
import { formatPrice } from "@/types/product";
import { Button } from "@/components/ui/button";

interface CartSummaryProps {
  items: CartItemWithProduct[];
}

export default function CartSummary({ items }: CartSummaryProps) {
  const total = calculateCartTotal(items);
  const itemCount = calculateCartItemCount(items);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="border-t pt-6 space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">총 상품 개수</span>
          <span className="font-medium">{itemCount}개</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>총 결제 금액</span>
          <span className="text-green-600 dark:text-green-400">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      <Link href="/checkout" className="block">
        <Button className="w-full" size="lg">
          주문하기
        </Button>
      </Link>

      <Link href="/" className="block">
        <Button variant="outline" className="w-full">
          쇼핑 계속하기
        </Button>
      </Link>
    </div>
  );
}

