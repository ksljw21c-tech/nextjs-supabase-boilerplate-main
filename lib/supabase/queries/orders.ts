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
  console.log("createOrder: Starting order creation for user:", clerkId);
  console.log("createOrder: Input:", input);

  const supabase = await createClient();
  console.log("createOrder: Supabase client created");

  // 1. 장바구니 아이템 조회
  console.log("createOrder: Fetching cart items for user:", clerkId);
  const cartItems = await getCartItems(clerkId);
  console.log("createOrder: Cart items found:", cartItems.length);

  if (cartItems.length === 0) {
    console.log("createOrder: Cart is empty");
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
export async function getUserOrders(clerkId: string): Promise<OrderWithItems[]> {
  const supabase = await createClient();

  try {
    console.log("getUserOrders: Starting for clerkId:", clerkId);

    // orders 테이블 존재 여부 확인
    console.log("getUserOrders: Checking if orders table exists");

    const { error: testError } = await supabase
      .from("orders")
      .select("count", { count: "exact", head: true })
      .limit(1);

    if (testError && testError.message.includes("Could not find the table")) {
      console.log("getUserOrders: Orders table does not exist!");
      console.log("getUserOrders: CRITICAL ERROR - Database tables not found!");
      console.log("getUserOrders: SOLUTION: Run SQL from supabase/migrations/db.sql in Supabase Dashboard");
      console.log("getUserOrders: URL: https://supabase.com/dashboard/project/xziygeoviztifdjioain");
      console.log("getUserOrders: 1. Go to SQL Editor");
      console.log("getUserOrders: 2. New Query");
      console.log("getUserOrders: 3. Copy and paste the entire content from db.sql");
      console.log("getUserOrders: 4. Click Run");

      // 빈 배열 반환하여 앱이 계속 작동하도록 함
      return [];
    }

    // orders 테이블 조회
    console.log("getUserOrders: Fetching orders for clerkId:", clerkId);
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("clerk_id", clerkId)
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error("Error fetching orders:", ordersError);
      throw new Error(`Failed to fetch orders: ${ordersError.message}`);
    }

    if (!ordersData || ordersData.length === 0) {
      console.log("getUserOrders: No orders found");
      return [];
    }

    console.log("getUserOrders: Found orders count:", ordersData.length);

    // 각 order에 대해 order_items를 조회
    const ordersWithItems: OrderWithItems[] = await Promise.all(
      ordersData.map(async (order: any) => {
        try {
          const { data: itemsData, error: itemsError } = await supabase
            .from("order_items")
            .select("id, order_id, product_id, product_name, quantity, price, created_at")
            .eq("order_id", order.id);

          if (itemsError) {
            console.error("Error fetching items for order:", order.id, itemsError);
            // items 조회 실패 시 빈 배열로 처리
            return {
              id: order.id,
              clerk_id: order.clerk_id,
              total_amount: order.total_amount,
              status: order.status,
              shipping_address: order.shipping_address,
              order_note: order.order_note,
              created_at: order.created_at,
              updated_at: order.updated_at,
              items: [],
            };
          }

          return {
            id: order.id,
            clerk_id: order.clerk_id,
            total_amount: order.total_amount,
            status: order.status,
            shipping_address: order.shipping_address,
            order_note: order.order_note,
            created_at: order.created_at,
            updated_at: order.updated_at,
            items: itemsData || [],
          };
        } catch (itemError) {
          console.error("Error processing order items for order:", order.id, itemError);
          return {
            id: order.id,
            clerk_id: order.clerk_id,
            total_amount: order.total_amount,
            status: order.status,
            shipping_address: order.shipping_address,
            order_note: order.order_note,
            created_at: order.created_at,
            updated_at: order.updated_at,
            items: [],
          };
        }
      })
    );

    console.log("getUserOrders: Successfully processed orders with items");
    return ordersWithItems;
  } catch (error) {
    console.error("Error in getUserOrders:", error);
    throw error;
  }
}

/**
 * 주문 상태를 업데이트합니다.
 * @param orderId 주문 ID
 * @param status 새로운 주문 상태
 * @returns 성공 여부
 */
export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<{ success: boolean; message?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq("id", orderId);

    if (error) {
      console.error("Error updating order status:", error);
      return { success: false, message: "Failed to update order status." };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, message: "Internal server error." };
  }
}

