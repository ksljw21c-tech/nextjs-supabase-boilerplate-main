/**
 * @file components/cart-icon.tsx
 * @description 장바구니 아이콘 컴포넌트
 *
 * Navbar에 표시할 장바구니 아이콘
 * 장바구니 아이템 개수를 배지로 표시합니다.
 */

"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCartItemsAction } from "@/actions/cart";
import CartSidebar from "@/components/cart-sidebar";

export default function CartIcon() {
  const [itemCount, setItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadCartCount = async () => {
    try {
      const items = await getCartItemsAction();
      const count = items.reduce((sum, item) => sum + item.quantity, 0);
      setItemCount(count);
    } catch (error) {
      console.error("Failed to load cart count:", error);
      setItemCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCartCount();

    // 주기적으로 장바구니 개수 갱신 (5초마다)
    const interval = setInterval(loadCartCount, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <CartSidebar>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        aria-label={`장바구니 ${itemCount > 0 ? `, ${itemCount}개의 상품` : ', 비어있음'}`}
      >
        <ShoppingCart className="h-5 w-5" />
        {!isLoading && itemCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {itemCount > 99 ? "99+" : itemCount}
          </Badge>
        )}
      </Button>
    </CartSidebar>
  );
}

