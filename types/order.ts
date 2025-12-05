/**
 * @file types/order.ts
 * @description 주문 관련 TypeScript 타입 정의
 *
 * Supabase orders, order_items 테이블과 일치하는 타입 정의
 */

/**
 * 주문 상태 타입
 */
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

/**
 * 배송 주소 인터페이스
 *
 * orders 테이블의 shipping_address JSONB 필드 구조
 */
export interface ShippingAddress {
  name: string;
  phone: string;
  postalCode: string;
  address: string;
  detailAddress: string;
}

/**
 * 주문 인터페이스
 *
 * Supabase orders 테이블의 스키마와 일치합니다.
 */
export interface Order {
  id: string;
  clerk_id: string;
  total_amount: number;
  status: OrderStatus;
  shipping_address: ShippingAddress | null;
  order_note: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 주문 상세 아이템 인터페이스
 *
 * Supabase order_items 테이블의 스키마와 일치합니다.
 */
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  created_at: string;
}

/**
 * 주문 상세 정보 (주문 + 주문 아이템 목록)
 */
export interface OrderWithItems extends Order {
  items: OrderItem[];
}

/**
 * 주문 생성 입력 타입
 */
export interface CreateOrderInput {
  shippingAddress: ShippingAddress;
  orderNote?: string | null;
}

