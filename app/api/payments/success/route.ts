/**
 * @file app/api/payments/success/route.ts
 * @description Toss Payments 결제 성공 콜백 처리
 *
 * 결제 성공 시 호출되는 API 라우트
 * 결제 승인을 처리하고 주문 상태를 업데이트합니다.
 */

import { NextRequest, NextResponse } from "next/server";
import { createPayment, updatePaymentStatus, getPaymentByOrderId } from "@/lib/supabase/queries/payments";
import { updateOrderStatus } from "@/lib/supabase/queries/orders";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get("orderId");
    const paymentKey = searchParams.get("paymentKey");
    const amount = searchParams.get("amount");

    if (!orderId || !paymentKey || !amount) {
      console.error("Missing required parameters:", { orderId, paymentKey, amount });
      return NextResponse.redirect(new URL("/checkout?status=fail&error=missing_params", request.url));
    }

    const paymentAmount = parseInt(amount, 10);
    if (isNaN(paymentAmount)) {
      console.error("Invalid amount:", amount);
      return NextResponse.redirect(new URL("/checkout?status=fail&error=invalid_amount", request.url));
    }

    // 결제 정보 생성 또는 업데이트
    const existingPayment = await getPaymentByOrderId(orderId);
    if (!existingPayment) {
      // 결제 정보가 없으면 생성
      const paymentResult = await createPayment(orderId, paymentKey, paymentAmount);
      if (!paymentResult.success) {
        console.error("Failed to create payment record:", paymentResult.message);
        return NextResponse.redirect(new URL("/checkout?status=fail&error=payment_create_failed", request.url));
      }
    }

    // 결제 상태를 완료로 업데이트
    const updateResult = await updatePaymentStatus(paymentKey, "done", {
      approvedAt: new Date().toISOString(),
      paymentMethod: "카드", // 실제로는 Toss API에서 받아와야 함
    });

    if (!updateResult.success) {
      console.error("Failed to update payment status:", updateResult.message);
      return NextResponse.redirect(new URL("/checkout?status=fail&error=status_update_failed", request.url));
    }

    // 주문 상태를 확인됨으로 업데이트
    const orderUpdateResult = await updateOrderStatus(orderId, "confirmed");
    if (!orderUpdateResult.success) {
      console.error("Failed to update order status:", orderUpdateResult.message);
      // 결제 상태 업데이트는 성공했으므로 주문 페이지로 이동
    }

    // 결제 성공 페이지로 리다이렉트
    return NextResponse.redirect(new URL(`/orders/${orderId}?status=success`, request.url));

  } catch (error) {
    console.error("Payment success callback error:", error);
    return NextResponse.redirect(new URL("/checkout?status=fail&error=server_error", request.url));
  }
}
