/**
 * @file lib/supabase/queries/payments.ts
 * @description 결제 관련 Supabase 쿼리 함수
 *
 * Server Component 및 Server Action에서 사용할 결제 데이터 접근 함수들
 */

import { createClient } from "@/lib/supabase/server";
import { PaymentInfo, PaymentStatus, PaymentMethod } from "@/types/payment";
import { auth } from "@clerk/nextjs/server";

/**
 * 결제 정보 생성
 */
export async function createPayment(
  orderId: string,
  paymentKey: string,
  amount: number
): Promise<{ success: boolean; payment?: PaymentInfo; message?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, message: "User not authenticated." };
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("payments")
      .insert({
        order_id: orderId,
        clerk_id: userId,
        payment_key: paymentKey,
        amount,
        status: "ready",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating payment:", error);
      return { success: false, message: "Failed to create payment record." };
    }

    return { success: true, payment: data as PaymentInfo };
  } catch (error) {
    console.error("Failed to create payment:", error);
    return { success: false, message: "Internal server error." };
  }
}

/**
 * 결제 정보 조회 (결제 키로)
 */
export async function getPaymentByKey(
  paymentKey: string
): Promise<PaymentInfo | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("payment_key", paymentKey)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows found
        return null;
      }
      console.error("Error fetching payment:", error);
      return null;
    }

    return data as PaymentInfo;
  } catch (error) {
    console.error("Failed to get payment by key:", error);
    return null;
  }
}

/**
 * 결제 정보 조회 (주문 ID로)
 */
export async function getPaymentByOrderId(
  orderId: string
): Promise<PaymentInfo | null> {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("order_id", orderId)
      .eq("clerk_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching payment by order ID:", error);
      return null;
    }

    return data as PaymentInfo;
  } catch (error) {
    console.error("Failed to get payment by order ID:", error);
    return null;
  }
}

/**
 * 결제 상태 업데이트
 */
export async function updatePaymentStatus(
  paymentKey: string,
  status: PaymentStatus,
  additionalData?: {
    approvedAt?: string;
    canceledAt?: string;
    cancelReason?: string;
    cancelAmount?: number;
    paymentMethod?: PaymentMethod;
    lastTransactionKey?: string;
  }
): Promise<{ success: boolean; message?: string }> {
  try {
    const supabase = await createClient();

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (additionalData) {
      Object.assign(updateData, additionalData);
    }

    const { error } = await supabase
      .from("payments")
      .update(updateData)
      .eq("payment_key", paymentKey);

    if (error) {
      console.error("Error updating payment status:", error);
      return { success: false, message: "Failed to update payment status." };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to update payment status:", error);
    return { success: false, message: "Internal server error." };
  }
}

/**
 * 결제 취소
 */
export async function cancelPayment(
  paymentKey: string,
  cancelReason: string,
  cancelAmount?: number
): Promise<{ success: boolean; message?: string }> {
  return updatePaymentStatus(paymentKey, "canceled", {
    canceledAt: new Date().toISOString(),
    cancelReason,
    cancelAmount,
  });
}

/**
 * 사용자의 결제 내역 조회
 */
export async function getUserPayments(): Promise<PaymentInfo[]> {
  const { userId } = await auth();
  if (!userId) {
    return [];
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("clerk_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user payments:", error);
      return [];
    }

    return data as PaymentInfo[];
  } catch (error) {
    console.error("Failed to get user payments:", error);
    return [];
  }
}
