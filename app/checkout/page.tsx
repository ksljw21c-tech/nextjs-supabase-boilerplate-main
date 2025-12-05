/**
 * @file app/checkout/page.tsx
 * @description 주문 생성 및 결제 페이지
 *
 * 장바구니 아이템을 확인하고 배송 정보를 입력한 후 결제를 진행하는 페이지
 */

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getCartItems } from "@/lib/supabase/queries/cart";
import OrderForm from "@/components/order-form";
import OrderSummary from "@/components/order-summary";
import PaymentWidget from "@/components/payment-widget";
import { createOrderAction } from "@/actions/orders";
import { generateOrderId, getPaymentSuccessUrl, getPaymentFailUrl } from "@/lib/utils/payment";
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

  // 주문 총액 계산
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.quantity * (item.product?.price || 0),
    0
  );

  // 주문 ID 생성
  const orderId = generateOrderId("order");

  return (
    <main className="min-h-[calc(100vh-80px)] px-4 py-8 md:px-8 md:py-12">
      <div className="w-full max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">주문 및 결제</h1>
          <p className="text-gray-600 dark:text-gray-400">
            배송 정보를 입력하고 결제를 완료하세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 배송 정보 입력 */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">배송 정보</h2>
              <CheckoutClient cartItems={cartItems} />
            </div>
          </div>

          {/* 결제 위젯 */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">결제 정보</h2>
              <PaymentWidget
                amount={totalAmount}
                orderId={orderId}
                orderName={`${cartItems.length}개 상품`}
                customerName="테스트 사용자" // 실제로는 사용자 정보에서 가져와야 함
                customerEmail="test@example.com" // 실제로는 사용자 정보에서 가져와야 함
              />
            </div>
          </div>

          {/* 주문 요약 */}
          <div className="lg:col-span-1 lg:sticky lg:top-4 lg:h-fit">
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">주문 요약</h2>
              <OrderSummary items={cartItems} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

