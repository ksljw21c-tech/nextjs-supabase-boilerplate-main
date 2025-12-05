/**
 * @file types/cart.ts
 * @description 장바구니 관련 TypeScript 타입 정의
 *
 * Supabase cart_items 테이블과 일치하는 타입 정의
 */

import type { Product } from "./product";

/**
 * 장바구니 아이템 인터페이스
 *
 * Supabase cart_items 테이블의 스키마와 일치합니다.
 */
export interface CartItem {
  id: string;
  clerk_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

/**
 * 상품 정보가 포함된 장바구니 아이템
 */
export interface CartItemWithProduct extends CartItem {
  product: Product;
}

/**
 * 장바구니 추가 입력 타입
 */
export interface AddToCartInput {
  productId: string;
  quantity: number;
}

/**
 * 장바구니 아이템 수정 입력 타입
 */
export interface UpdateCartItemInput {
  cartItemId: string;
  quantity: number;
}

