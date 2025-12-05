/**
 * @file components/cart-item.tsx
 * @description 장바구니 아이템 컴포넌트
 *
 * 장바구니에 담긴 개별 상품을 표시하고 수량 조절 및 삭제 기능을 제공합니다.
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CartItemWithProduct } from "@/types/cart";
import { formatPrice } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
  updateCartItemAction,
  removeFromCartAction,
} from "@/actions/cart";
import { useRouter } from "next/navigation";

interface CartItemProps {
  item: CartItemWithProduct;
}

export default function CartItem({ item }: CartItemProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.product.stock_quantity) {
      alert(`재고가 부족합니다. (재고: ${item.product.stock_quantity}개)`);
      return;
    }

    setIsUpdating(true);
    setQuantity(newQuantity); // Optimistic update

    const result = await updateCartItemAction(item.id, newQuantity);

    if (!result.success) {
      // 실패 시 원래 수량으로 복구
      setQuantity(item.quantity);
      alert(result.error || "수량 변경에 실패했습니다.");
    } else {
      router.refresh();
    }

    setIsUpdating(false);
  };

  const handleRemove = async () => {
    if (!confirm("장바구니에서 삭제하시겠습니까?")) {
      return;
    }

    setIsRemoving(true);

    const result = await removeFromCartAction(item.id);

    if (!result.success) {
      alert(result.error || "삭제에 실패했습니다.");
    } else {
      router.refresh();
    }

    setIsRemoving(false);
  };

  const itemTotal = item.product.price * quantity;

  return (
    <div className="flex gap-4 p-4 border rounded-lg">
      {/* 상품 이미지 */}
      <Link href={`/products/${item.product.id}`} className="flex-shrink-0">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="text-2xl mb-1">📦</div>
            <p className="text-xs">이미지</p>
          </div>
        </div>
      </Link>

      {/* 상품 정보 */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.product.id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:underline">
            {item.product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {formatPrice(item.product.price)} / 개
        </p>

        {/* 수량 조절 */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border rounded">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={isUpdating || quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={
                isUpdating ||
                quantity >= item.product.stock_quantity
              }
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900"
            onClick={handleRemove}
            disabled={isRemoving}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 총액 */}
      <div className="flex-shrink-0 text-right">
        <p className="font-bold text-lg">
          {formatPrice(itemTotal)}
        </p>
        {quantity > 1 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ({formatPrice(item.product.price)} × {quantity})
          </p>
        )}
      </div>
    </div>
  );
}

