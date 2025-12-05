/**
 * @file actions/payments.ts
 * @description 결제 관련 Server Actions
 *
 * Toss Payments API를 호출하여 결제를 처리하는 Server Actions
 */

"use server";

import { revalidatePath } from "next/cache";
import { getTossPaymentsSecretKey } from "@/lib/utils/payment";
import { createPayment, updatePaymentStatus, getPaymentByOrderId } from "@/lib/supabase/queries/payments";
import { updateOrderStatus } from "@/lib/supabase/queries/orders";
import type { PaymentApprovalResponse, PaymentCancelResponse, TossPaymentsError } from "@/types/payment";

/**
 * Toss Payments API로 결제 승인 요청
 */
async function approvePayment(
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<PaymentApprovalResponse> {
  const secretKey = getTossPaymentsSecretKey();

  const response = await fetch(`https://api.tosspayments.com/v1/payments/confirm`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      paymentKey,
      orderId,
      amount,
    }),
  });

  if (!response.ok) {
    const errorData: TossPaymentsError = await response.json();
    throw new Error(`Payment approval failed: ${errorData.message}`);
  }

  const data: PaymentApprovalResponse = await response.json();
  return data;
}

/**
 * Toss Payments API로 결제 취소 요청
 */
async function cancelPaymentAPI(
  paymentKey: string,
  cancelReason: string
): Promise<PaymentCancelResponse> {
  const secretKey = getTossPaymentsSecretKey();

  const response = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cancelReason,
    }),
  });

  if (!response.ok) {
    const errorData: TossPaymentsError = await response.json();
    throw new Error(`Payment cancellation failed: ${errorData.message}`);
  }

  const data: PaymentCancelResponse = await response.json();
  return data;
}

/**
 * 결제 승인 및 상태 업데이트
 */
export async function approvePaymentAction(
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<{ success: boolean; message?: string }> {
  try {
    // Toss Payments API로 결제 승인
    const approvalResponse = await approvePayment(paymentKey, orderId, amount);

    // 데이터베이스에 결제 정보 저장/업데이트
    const existingPayment = await getPaymentByOrderId(orderId);
    if (!existingPayment) {
      const paymentResult = await createPayment(orderId, paymentKey, amount);
      if (!paymentResult.success) {
        throw new Error(paymentResult.message || "Failed to create payment record");
      }
    }

    // 결제 상태 업데이트
    const updateResult = await updatePaymentStatus(paymentKey, "done", {
      approvedAt: approvalResponse.approvedAt,
      paymentMethod: approvalResponse.method,
      lastTransactionKey: approvalResponse.paymentKey,
    });

    if (!updateResult.success) {
      throw new Error(updateResult.message || "Failed to update payment status");
    }

    // 주문 상태 업데이트
    const orderUpdateResult = await updateOrderStatus(orderId, "confirmed");
    if (!orderUpdateResult.success) {
      console.warn("Failed to update order status:", orderUpdateResult.message);
    }

    revalidatePath(`/orders/${orderId}`);
    return { success: true };

  } catch (error) {
    console.error("Payment approval failed:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "결제 승인에 실패했습니다."
    };
  }
}

/**
 * 결제 취소
 */
export async function cancelPaymentAction(
  paymentKey: string,
  cancelReason: string
): Promise<{ success: boolean; message?: string }> {
  try {
    // Toss Payments API로 결제 취소
    const cancelResponse = await cancelPaymentAPI(paymentKey, cancelReason);

    // 데이터베이스 결제 상태 업데이트
    const updateResult = await updatePaymentStatus(paymentKey, "canceled", {
      canceledAt: new Date().toISOString(),
      cancelReason,
      cancelAmount: cancelResponse.cancels[0]?.cancelAmount,
    });

    if (!updateResult.success) {
      throw new Error(updateResult.message || "Failed to update payment status");
    }

    // 주문 상태 업데이트 (취소)
    // paymentKey로 orderId를 찾아야 함
    const payment = await getPaymentByOrderId(cancelResponse.orderId);
    if (payment) {
      const orderUpdateResult = await updateOrderStatus(cancelResponse.orderId, "cancelled");
      if (!orderUpdateResult.success) {
        console.warn("Failed to update order status:", orderUpdateResult.message);
      }
    }

    return { success: true };

  } catch (error) {
    console.error("Payment cancellation failed:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "결제 취소에 실패했습니다."
    };
  }
}
