/**
 * @file app/cart/page.tsx
 * @description 장바구니 페이지
 *
 * 사용자의 장바구니 아이템을 표시하고 관리하는 페이지
 */

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getCartItems } from "@/lib/supabase/queries/cart";
import CartItem from "@/components/cart-item";
import CartSummary from "@/components/cart-summary";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CartPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const cartItems = await getCartItems(userId);

  return (
    <main className="min-h-[calc(100vh-80px)] px-4 py-8 md:px-8 md:py-12">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">장바구니</h1>
          <p className="text-gray-600 dark:text-gray-400">
            담은 상품을 확인하고 주문하세요
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-xl font-semibold mb-2">장바구니가 비어있습니다</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                상품을 장바구니에 담아보세요
              </p>
              <Link href="/">
                <Button>상품 둘러보기</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 장바구니 아이템 목록 */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* 장바구니 요약 */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-4">주문 요약</h2>
                  <CartSummary items={cartItems} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

