/**
 * @file lib/utils/cart.ts
 * @description 장바구니 관련 유틸리티 함수
 */

import type { CartItemWithProduct } from "@/types/cart";
import type { Product } from "@/types/product";

/**
 * 장바구니 총액 계산
 *
 * @param cartItems - 상품 정보가 포함된 장바구니 아이템 배열
 * @returns 총액 (number)
 */
export function calculateCartTotal(
  cartItems: CartItemWithProduct[]
): number {
  return cartItems.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);
}

/**
 * 장바구니 총 아이템 개수 계산
 *
 * @param cartItems - 상품 정보가 포함된 장바구니 아이템 배열
 * @returns 총 개수 (number)
 */
export function calculateCartItemCount(
  cartItems: CartItemWithProduct[]
): number {
  return cartItems.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
}

/**
 * 재고 검증
 *
 * @param product - 상품 정보
 * @param quantity - 요청 수량
 * @returns 재고가 충분한지 여부
 */
export function validateCartItem(
  product: Product,
  quantity: number
): boolean {
  if (!product.is_active) {
    return false;
  }
  if (product.stock_quantity < quantity) {
    return false;
  }
  return true;
}

