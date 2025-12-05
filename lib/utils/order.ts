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

