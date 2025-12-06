/**
 * @file components/add-to-cart-button.tsx
 * @description 장바구니 담기 버튼 컴포넌트
 *
 * 상품 상세 페이지에서 사용하는 장바구니 담기 버튼
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { addToCartAction } from "@/actions/cart";
import type { Product } from "@/types/product";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const stockStatus = product.stock_quantity === 0 ? "품절" : product.stock_quantity < 10 ? "재고 부족" : "재고 있음";

  const handleAddToCart = async () => {
    if (stockStatus === "품절") {
      alert("품절된 상품입니다.");
      return;
    }

    setIsAdding(true);

    try {
      const result = await addToCartAction(product.id, 1);

      if (result.success) {
        alert("장바구니에 추가되었습니다.");
        router.refresh(); // 장바구니 아이콘 업데이트를 위해 새로고침
      } else {
        alert(result.error || "장바구니에 추가하는 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Add to cart error:", error);

      // 네트워크 에러나 Server Action 에러 처리
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          alert("네트워크 연결을 확인해주세요.");
        } else {
          alert(`오류: ${error.message}`);
        }
      } else {
        alert("장바구니에 추가하는 중 오류가 발생했습니다.");
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <LoadingButton
      className="flex-1"
      disabled={stockStatus === "품절"}
      size="lg"
      loading={isAdding}
      loadingText="추가 중..."
      onClick={handleAddToCart}
    >
      {stockStatus === "품절" ? "품절" : "장바구니에 담기"}
    </LoadingButton>
  );
}
