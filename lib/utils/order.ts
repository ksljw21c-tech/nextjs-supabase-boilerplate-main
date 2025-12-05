/**
 * @file lib/utils/order.ts
 * @description 주문 관련 유틸리티 함수
 */

import type { OrderItem } from "@/types/order";

/**
 * 주문 총액 계산
 *
 * @param orderItems - 주문 아이템 배열
 * @returns 총액 (number)
 */
export function calculateOrderTotal(orderItems: OrderItem[]): number {
  return orderItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}

/**
 * 주문 총액 검증
 *
 * @param orderTotal - 주문 총액
 * @param items - 주문 아이템 배열
 * @returns 총액이 일치하는지 여부
 */
export function validateOrderTotal(
  orderTotal: number,
  items: OrderItem[]
): boolean {
  const calculatedTotal = calculateOrderTotal(items);
  // 소수점 오차 허용 (±0.01)
  return Math.abs(orderTotal - calculatedTotal) < 0.01;
}

/**
 * 주문 상태를 한국어로 변환
 *
 * @param status - 주문 상태
 * @returns 한국어 상태명
 */
export function formatOrderStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "주문 대기",
    confirmed: "주문 확인",
    shipped: "배송 중",
    delivered: "배송 완료",
    cancelled: "주문 취소",
  };
  return statusMap[status] || status;
}

