/**
 * @file app/api/payments/fail/route.ts
 * @description Toss Payments 결제 실패 콜백 처리
 *
 * 결제 실패 시 호출되는 API 라우트
 * 결제 상태를 실패로 업데이트합니다.
 */

import { NextRequest, NextResponse } from "next/server";
import { updatePaymentStatus } from "@/lib/supabase/queries/payments";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const paymentKey = searchParams.get("paymentKey");
    const errorCode = searchParams.get("code");
    const errorMessage = searchParams.get("message");

    console.log("Payment failed:", {
      paymentKey,
      errorCode,
      errorMessage,
      url: request.url,
    });

    if (paymentKey) {
      // 결제 상태를 취소로 업데이트
      const updateResult = await updatePaymentStatus(paymentKey, "canceled", {
        canceledAt: new Date().toISOString(),
        cancelReason: errorMessage || "결제 실패",
      });

      if (!updateResult.success) {
        console.error("Failed to update payment status on failure:", updateResult.message);
      }
    }

    // 결제 실패 페이지로 리다이렉트
    const failUrl = new URL("/checkout", request.url);
    failUrl.searchParams.set("status", "fail");
    if (errorCode) failUrl.searchParams.set("code", errorCode);
    if (errorMessage) failUrl.searchParams.set("message", errorMessage);

    return NextResponse.redirect(failUrl);

  } catch (error) {
    console.error("Payment fail callback error:", error);
    return NextResponse.redirect(new URL("/checkout?status=fail&error=server_error", request.url));
  }
}
