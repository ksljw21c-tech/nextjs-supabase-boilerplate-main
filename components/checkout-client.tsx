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

    console.log("CheckoutClient: Starting order creation", data);

    try {
      console.log("CheckoutClient: Calling createOrderAction");
      const result = await createOrderAction(data);
      console.log("CheckoutClient: createOrderAction result:", result);

      if (result.success && result.orderId) {
        // 주문 성공 시 주문 완료 페이지로 이동
        console.log("CheckoutClient: Order created successfully, redirecting to:", `/orders/${result.orderId}`);
        router.push(`/orders/${result.orderId}`);
      } else {
        console.error("CheckoutClient: Order creation failed:", result.error);
        alert(result.error || "주문 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("CheckoutClient: Order creation error:", error);
      console.error("CheckoutClient: Error type:", typeof error);
      console.error("CheckoutClient: Error instanceof Error:", error instanceof Error);
      if (error instanceof Error) {
        console.error("CheckoutClient: Error message:", error.message);
        console.error("CheckoutClient: Error stack:", error.stack);

        // 네트워크 에러인지 확인
        if (error.message.includes('fetch')) {
          console.error("CheckoutClient: This appears to be a network/fetch error");
        }
      }

      // 사용자에게 더 자세한 에러 정보 표시
      const errorMessage = error instanceof Error
        ? `주문 생성 중 오류가 발생했습니다: ${error.message}`
        : "주문 생성 중 네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.";
      alert(errorMessage);
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

