/**
 * @file components/checkout-client.tsx
 * @description 주문 생성 클라이언트 컴포넌트
 *
 * 주문 폼과 주문 생성 로직을 처리하는 Client Component
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OrderForm from "@/components/order-form";
import { createOrderAction } from "@/actions/orders";
import type { CartItemWithProduct } from "@/types/cart";

interface CheckoutClientProps {
  cartItems: CartItemWithProduct[];
}

export default function CheckoutClient({ cartItems }: CheckoutClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: {
    shippingAddress: {
      name: string;
      phone: string;
      postalCode: string;
      address: string;
      detailAddress: string;
    };
    orderNote?: string | null;
  }) => {
    setIsSubmitting(true);

    try {
      const result = await createOrderAction(data);

      if (result.success && result.orderId) {
        // 주문 성공 시 주문 완료 페이지로 이동
        router.push(`/orders/${result.orderId}`);
      } else {
        alert(result.error || "주문 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      alert("주문 생성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
      <OrderForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}

