/**
 * @file lib/supabase/queries/orders.ts
 * @description 주문 데이터 조회 및 생성 함수
 *
 * Server Component에서 사용할 주문 관련 함수들
 * Supabase orders, order_items 테이블에서 데이터를 가져오고 생성합니다.
 *
 * @dependencies
 * - @supabase/supabase-js: 데이터베이스 접근
 * - lib/supabase/server: Server Component용 Supabase 클라이언트
 * - lib/supabase/queries/cart: 장바구니 관련 함수
 */

import { createClient } from "@/lib/supabase/server";
import { getCartItems, clearCart } from "./cart";
import { calculateOrderTotal, validateOrderTotal } from "@/lib/utils/order";
import { validateCartItem } from "@/lib/utils/cart";
import type {
  Order,
  OrderItem,
  OrderWithItems,
  CreateOrderInput,
  ShippingAddress,
} from "@/types/order";
import type { CartItemWithProduct } from "@/types/cart";

/**
 * 주문 생성
 *
 * 주문 생성 로직:
 * 1. 장바구니 아이템 조회 및 상품 정보 조회
 * 2. 재고 검증 (stock_quantity >= quantity)
 * 3. order_items 생성 (product_name, price 스냅샷 저장)
 * 4. orders 생성 (total_amount 계산 및 검증)
 * 5. 장바구니 비우기 (clearCart)
 * 6. 재고 차감 (products.stock_quantity 업데이트)
 *
 * @param clerkId - Clerk 사용자 ID
 * @param input - 주문 생성 입력 (배송 주소, 메모)
 * @returns 생성된 주문
 */
export async function createOrder(
  clerkId: string,
  input: CreateOrderInput
): Promise<Order> {
  const supabase = await createClient();

  // 1. 장바구니 아이템 조회
  const cartItems = await getCartItems(clerkId);

  if (cartItems.length === 0) {
    throw new Error("장바구니가 비어있습니다.");
  }

  // 2. 재고 검증 및 order_items 준비
  const orderItemsData: Omit<OrderItem, "id" | "order_id" | "created_at">[] =
    [];
  const stockUpdates: { productId: string; newQuantity: number }[] = [];

  for (const cartItem of cartItems) {
    // 재고 검증
    if (!validateCartItem(cartItem.product, cartItem.quantity)) {
      throw new Error(
        `상품 "${cartItem.product.name}"의 재고가 부족합니다. (재고: ${cartItem.product.stock_quantity}, 요청: ${cartItem.quantity})`
      );
    }

    // order_items 데이터 준비 (스냅샷 저장)
    orderItemsData.push({
      product_id: cartItem.product_id,
      product_name: cartItem.product.name,
      quantity: cartItem.quantity,
      price: cartItem.product.price,
    });

    // 재고 차감 정보 준비
    stockUpdates.push({
      productId: cartItem.product_id,
      newQuantity: cartItem.product.stock_quantity - cartItem.quantity,
    });
  }

  // 3. 주문 총액 계산
  const totalAmount = calculateOrderTotal(
    orderItemsData.map((item) => ({
      id: "",
      order_id: "",
      created_at: "",
      ...item,
    }))
  );

  // 4. orders 생성
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      clerk_id: clerkId,
      total_amount: totalAmount,
      status: "pending",
      shipping_address: input.shippingAddress as unknown as ShippingAddress,
      order_note: input.orderNote || null,
    })
    .select()
    .single();

  if (orderError) {
    console.error("Error creating order:", orderError);
    throw new Error(`Failed to create order: ${orderError.message}`);
  }

  // 5. order_items 생성
  const orderItemsToInsert = orderItemsData.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product_name,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: orderItemsError } = await supabase
    .from("order_items")
    .insert(orderItemsToInsert);

  if (orderItemsError) {
    console.error("Error creating order items:", orderItemsError);
    // 주문 삭제 (롤백)
    await supabase.from("orders").delete().eq("id", order.id);
    throw new Error(`Failed to create order items: ${orderItemsError.message}`);
  }

  // 6. 재고 차감
  for (const update of stockUpdates) {
    const { error: stockError } = await supabase
      .from("products")
      .update({ stock_quantity: update.newQuantity })
      .eq("id", update.productId);

    if (stockError) {
      console.error("Error updating stock:", stockError);
      // 주문 및 order_items 삭제 (롤백)
      await supabase.from("order_items").delete().eq("order_id", order.id);
      await supabase.from("orders").delete().eq("id", order.id);
      throw new Error(
        `Failed to update stock for product ${update.productId}: ${stockError.message}`
      );
    }
  }

  // 7. 장바구니 비우기
  await clearCart(clerkId);

  return order as Order;
}

/**
 * 주문 조회 (주문 아이템 포함)
 *
 * @param orderId - 주문 ID
 * @returns 주문 및 주문 아이템 목록
 */
export async function getOrderById(
  orderId: string
): Promise<OrderWithItems> {
  const supabase = await createClient();

  // 주문 조회
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (orderError) {
    console.error("Error fetching order:", orderError);
    throw new Error(`Failed to fetch order: ${orderError.message}`);
  }

  // 주문 아이템 조회
  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  if (itemsError) {
    console.error("Error fetching order items:", itemsError);
    throw new Error(`Failed to fetch order items: ${itemsError.message}`);
  }

  // 합계 검증
  const calculatedTotal = calculateOrderTotal(items as OrderItem[]);
  if (!validateOrderTotal(order.total_amount, items as OrderItem[])) {
    console.warn(
      `Order total mismatch: stored=${order.total_amount}, calculated=${calculatedTotal}`
    );
  }

  return {
    ...(order as Order),
    items: items as OrderItem[],
  };
}

/**
 * 사용자 주문 목록 조회
 *
 * @param clerkId - Clerk 사용자 ID
 * @returns 주문 목록
 */
export async function getUserOrders(clerkId: string): Promise<Order[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("clerk_id", clerkId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user orders:", error);
    throw new Error(`Failed to fetch user orders: ${error.message}`);
  }

  return (data || []) as Order[];
}

