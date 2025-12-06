/**
 * @file lib/schemas/order.ts
 * @description 주문 관련 Zod 스키마
 *
 * 주문 데이터의 유효성 검증을 위한 Zod 스키마들
 */

import { z } from "zod";

// 배송 주소 스키마 (폼 검증용 - 유연한 검증)
export const ShippingAddressSchema = z.object({
  name: z.string().min(1, "이름은 필수입니다").max(50, "이름은 50자 이하여야 합니다"),
  phone: z.string().min(1, "전화번호는 필수입니다").regex(/^[0-9-]+$/, "올바른 전화번호 형식이 아닙니다"),
  postalCode: z.string().min(1, "우편번호는 필수입니다"),
  address: z.string().min(1, "주소는 필수입니다").max(200, "주소는 200자 이하여야 합니다"),
  detailAddress: z.string().max(100, "상세주소는 100자 이하여야 합니다").optional(),
});

// 주문 상태 enum
export const OrderStatusSchema = z.enum([
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled"
]);

// 주문 아이템 스키마
export const OrderItemSchema = z.object({
  id: z.string().uuid(),
  order_id: z.string().uuid(),
  product_id: z.string().uuid(),
  product_name: z.string().min(1, "상품명은 필수입니다"),
  quantity: z.number().min(1, "수량은 1 이상이어야 합니다"),
  price: z.number().min(0, "가격은 0 이상이어야 합니다"),
  created_at: z.string().datetime(),
});

// 주문 스키마
export const OrderSchema = z.object({
  id: z.string().uuid(),
  clerk_id: z.string().min(1, "사용자 ID는 필수입니다"),
  total_amount: z.number().min(0, "총 금액은 0 이상이어야 합니다"),
  status: OrderStatusSchema,
  shipping_address: ShippingAddressSchema.optional(),
  order_note: z.string().max(500, "주문 메모는 500자 이하여야 합니다").optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// 주문 + 아이템 정보 스키마
export const OrderWithItemsSchema = OrderSchema.extend({
  items: z.array(OrderItemSchema),
});

// 주문 생성 요청 스키마
export const CreateOrderRequestSchema = z.object({
  shippingAddress: ShippingAddressSchema,
  orderNote: z.string().max(500).optional(),
});

// 결제 스키마
export const PaymentSchema = z.object({
  paymentKey: z.string().min(1, "결제 키는 필수입니다"),
  orderId: z.string().uuid(),
  amount: z.number().min(1, "결제 금액은 1 이상이어야 합니다"),
  status: z.enum(["pending", "approved", "cancelled", "failed"]),
  method: z.string().optional(),
  approvedAt: z.string().datetime().optional(),
  cancelledAt: z.string().datetime().optional(),
  cancelReason: z.string().optional(),
});

// 결제 요청 스키마
export const PaymentRequestSchema = z.object({
  orderId: z.string().uuid(),
  amount: z.number().min(1),
});

// 주문 목록 쿼리 스키마
export const OrderQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(10),
  status: OrderStatusSchema.optional(),
  sortBy: z.enum(["created_at", "total_amount"]).default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// 주문 목록 응답 스키마
export const OrderListResponseSchema = z.object({
  orders: z.array(OrderWithItemsSchema),
  totalPages: z.number().min(0),
  page: z.number().min(1),
  totalCount: z.number().min(0),
});

// 타입 추론
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderWithItems = z.infer<typeof OrderWithItemsSchema>;
export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>;
export type Payment = z.infer<typeof PaymentSchema>;
export type PaymentRequest = z.infer<typeof PaymentRequestSchema>;
export type OrderQuery = z.infer<typeof OrderQuerySchema>;
export type OrderListResponse = z.infer<typeof OrderListResponseSchema>;
