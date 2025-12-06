/**
 * @file lib/schemas/cart.ts
 * @description 장바구니 관련 Zod 스키마
 *
 * 장바구니 데이터의 유효성 검증을 위한 Zod 스키마들
 */

import { z } from "zod";

// 장바구니 아이템 스키마
export const CartItemSchema = z.object({
  id: z.string().uuid(),
  clerk_id: z.string().min(1, "사용자 ID는 필수입니다"),
  product_id: z.string().uuid(),
  quantity: z.number().min(1, "수량은 1 이상이어야 합니다").max(99, "수량은 99 이하여야 합니다"),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// 장바구니 아이템 + 상품 정보 스키마
export const CartItemWithProductSchema = CartItemSchema.extend({
  product: z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    price: z.number().min(0),
    category: z.string().optional(),
    stock_quantity: z.number().min(0),
    is_active: z.boolean(),
  }),
});

// 장바구니 추가 요청 스키마
export const AddToCartRequestSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().min(1).max(99).default(1),
});

// 장바구니 수량 업데이트 요청 스키마
export const UpdateCartItemRequestSchema = z.object({
  quantity: z.number().min(1).max(99),
});

// 장바구니 응답 스키마
export const CartResponseSchema = z.object({
  success: z.boolean(),
  item: CartItemWithProductSchema.optional(),
  error: z.string().optional(),
});

// 장바구니 목록 응답 스키마
export const CartListResponseSchema = z.array(CartItemWithProductSchema);

// 장바구니 통계 스키마
export const CartStatsSchema = z.object({
  totalItems: z.number().min(0),
  totalAmount: z.number().min(0),
  totalQuantity: z.number().min(0),
});

// 타입 추론
export type CartItem = z.infer<typeof CartItemSchema>;
export type CartItemWithProduct = z.infer<typeof CartItemWithProductSchema>;
export type AddToCartRequest = z.infer<typeof AddToCartRequestSchema>;
export type UpdateCartItemRequest = z.infer<typeof UpdateCartItemRequestSchema>;
export type CartResponse = z.infer<typeof CartResponseSchema>;
export type CartStats = z.infer<typeof CartStatsSchema>;
