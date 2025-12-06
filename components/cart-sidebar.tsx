/**
 * @file components/cart-sidebar.tsx
 * @description 장바구니 사이드바 컴포넌트
 *
 * Navbar의 장바구니 아이콘 클릭 시 열리는 사이드바
 * 장바구니 아이템 목록과 요약을 표시합니다.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { getCartItemsAction } from "@/actions/cart";
import type { CartItemWithProduct } from "@/types/cart";
import CartItem from "@/components/cart-item";
import CartSummary from "@/components/cart-summary";

interface CartSidebarProps {
  children: React.ReactNode;
}

export default function CartSidebar({ children }: CartSidebarProps) {
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const loadCartItems = async () => {
    setIsLoading(true);
    try {
      const cartItems = await getCartItemsAction();
      setItems(cartItems);
    } catch (error) {
      console.error("Failed to load cart items:", error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCartItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>장바구니</SheetTitle>
          <SheetDescription>
            {itemCount > 0
              ? `총 ${itemCount}개의 상품이 담겨있습니다.`
              : "장바구니가 비어있습니다."}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              장바구니를 불러오는 중...
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                장바구니가 비어있습니다.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                상품을 장바구니에 담아보세요
              </p>
              <Link href="/">
                <Button onClick={() => setIsOpen(false)} className="w-full">
                  상품 둘러보기
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              <CartSummary items={items} />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

