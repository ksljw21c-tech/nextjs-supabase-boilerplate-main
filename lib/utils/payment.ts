/**
 * @file lib/utils/payment.ts
 * @description Toss Payments 관련 유틸리티 함수
 */

import { PaymentStatus, PaymentMethod } from "@/types/payment";

/**
 * 결제 상태를 한국어로 변환
 */
export function formatPaymentStatus(status: PaymentStatus): string {
  const statusMap: Record<PaymentStatus, string> = {
    ready: "결제 준비",
    in_progress: "결제 진행 중",
    waiting_for_deposit: "입금 대기",
    done: "결제 완료",
    canceled: "결제 취소",
    partial_canceled: "부분 취소",
    expired: "결제 만료",
    aborted: "결제 중단",
  };

  return statusMap[status] || status;
}

/**
 * 결제 수단을 한국어로 변환
 */
export function formatPaymentMethod(method: PaymentMethod): string {
  return method;
}

/**
 * 주문 ID 생성 (고유한 값 필요)
 */
export function generateOrderId(prefix: string = "order"): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * 결제 금액 포맷팅
 */
export function formatPaymentAmount(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
}

/**
 * 결제 성공 URL 생성
 */
export function getPaymentSuccessUrl(orderId: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/orders/${orderId}?status=success`;
}

/**
 * 결제 실패 URL 생성
 */
export function getPaymentFailUrl(): string {
  return `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout?status=fail`;
}

/**
 * Toss Payments 클라이언트 키 가져오기
 */
export function getTossPaymentsClientKey(): string {
  const clientKey = process.env.NEXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY;
  if (!clientKey) {
    throw new Error("Toss Payments 클라이언트 키가 설정되지 않았습니다.");
  }
  return clientKey;
}

/**
 * Toss Payments 시크릿 키 가져오기
 */
export function getTossPaymentsSecretKey(): string {
  const secretKey = process.env.TOSSPAYMENTS_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Toss Payments 시크릿 키가 설정되지 않았습니다.");
  }
  return secretKey;
}

/**
 * 결제 위젯을 위한 고객 키 생성
 * 실제 서비스에서는 사용자 ID 기반으로 생성해야 함
 */
export function generateCustomerKey(userId: string): string {
  return `customer_${userId}`;
}
