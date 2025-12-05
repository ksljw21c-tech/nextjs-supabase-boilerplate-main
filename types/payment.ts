/**
 * @file types/payment.ts
 * @description Toss Payments 관련 TypeScript 타입 정의
 */

/**
 * 결제 상태
 */
export type PaymentStatus = "ready" | "in_progress" | "waiting_for_deposit" | "done" | "canceled" | "partial_canceled" | "expired" | "aborted";

/**
 * 결제 수단
 */
export type PaymentMethod = "카드" | "가상계좌" | "계좌이체" | "휴대폰" | "문화상품권" | "게임문화상품권";

/**
 * 결제 정보 인터페이스
 */
export interface PaymentInfo {
  paymentKey: string;
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  requestedAt: string;
  approvedAt?: string;
  lastTransactionKey?: string;
}

/**
 * 결제 위젯 설정
 */
export interface PaymentWidgetConfig {
  clientKey: string;
  customerKey: string;
  paymentMethods?: {
    card?: boolean;
    account?: boolean;
    transfer?: boolean;
    mobile?: boolean;
    giftcard?: boolean;
    bookgiftcard?: boolean;
  };
}

/**
 * 결제 요청 데이터
 */
export interface PaymentRequestData {
  amount: number;
  orderId: string;
  orderName: string;
  customerName?: string;
  customerEmail?: string;
  successUrl: string;
  failUrl: string;
}

/**
 * 결제 승인 응답
 */
export interface PaymentApprovalResponse {
  paymentKey: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  approvedAt: string;
  method: PaymentMethod;
}

/**
 * 결제 취소 요청
 */
export interface PaymentCancelRequest {
  cancelReason: string;
  cancelAmount?: number;
}

/**
 * 결제 취소 응답
 */
export interface PaymentCancelResponse {
  paymentKey: string;
  orderId: string;
  status: PaymentStatus;
  cancels: Array<{
    cancelReason: string;
    canceledAt: string;
    cancelAmount: number;
  }>;
}

/**
 * Toss Payments API 에러
 */
export interface TossPaymentsError {
  code: string;
  message: string;
  status?: number;
}
