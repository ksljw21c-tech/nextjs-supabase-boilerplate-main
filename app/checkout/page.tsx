/**
 * @file app/checkout/page.tsx
 * @description 주문 생성 페이지
 *
 * 장바구니 아이템을 확인하고 배송 정보를 입력하여 주문을 생성하는 페이지
 */

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getCartItems } from "@/lib/supabase/queries/cart";
import OrderForm from "@/components/order-form";
import OrderSummary from "@/components/order-summary";
import { createOrderAction } from "@/actions/orders";
import CheckoutClient from "@/components/checkout-client";

export default async function CheckoutPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const cartItems = await getCartItems(userId);

  if (cartItems.length === 0) {
    redirect("/cart");
  }

  return (
    <main className="min-h-[calc(100vh-80px)] px-4 py-8 md:px-8 md:py-12">
      <div className="w-full max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">주문하기</h1>
          <p className="text-gray-600 dark:text-gray-400">
            배송 정보를 입력하고 주문을 완료하세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 주문 폼 */}
          <div>
            <CheckoutClient cartItems={cartItems} />
          </div>

          {/* 주문 요약 */}
          <div className="lg:sticky lg:top-4 lg:h-fit">
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
              <OrderSummary items={cartItems} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

