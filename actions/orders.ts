/**
 * @file actions/orders.ts
 * @description 주문 관련 Server Actions
 *
 * 클라이언트에서 호출할 수 있는 주문 관련 Server Actions
 * 인증 확인 및 에러 처리를 포함합니다.
 */

"use server";

import { auth } from "@clerk/nextjs/server";
import {
  createOrder,
  getOrderById,
  getUserOrders,
} from "@/lib/supabase/queries/orders";
import { CreateOrderRequestSchema } from "@/lib/schemas/order";
import type { OrderWithItems } from "@/types/order";

/**
 * 주문 생성
 *
 * @param input - 주문 생성 입력 (배송 주소, 메모)
 * @returns 성공 여부, 주문 ID, 에러 메시지
 */
export async function createOrderAction(
  input: {
    shippingAddress: {
      name: string;
      phone: string;
      postalCode: string;
      address: string;
      detailAddress?: string;
    };
    orderNote?: string | null;
  }
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  console.log("createOrderAction called with input:", input);

  try {
    // Zod 스키마로 입력 검증
    const validationResult = CreateOrderRequestSchema.safeParse(input);

    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors
        .map(err => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      console.log("Validation failed:", errorMessages);
      return { success: false, error: `입력값 오류: ${errorMessages}` };
    }

    const validatedData = validationResult.data;

    console.log("Getting user authentication...");
    const { userId } = await auth();
    console.log("User ID:", userId);

    if (!userId) {
      console.log("User not authenticated");
      return { success: false, error: "로그인이 필요합니다." };
    }

    // CreateOrderInput 형식으로 변환
    // Zod 검증을 통과했으므로 필수 필드가 존재함을 보장
    const createOrderInput = {
      shippingAddress: {
        name: validatedData.shippingAddress.name,
        phone: validatedData.shippingAddress.phone,
        postalCode: validatedData.shippingAddress.postalCode,
        address: validatedData.shippingAddress.address,
        detailAddress: validatedData.shippingAddress.detailAddress || "",
      },
      orderNote: validatedData.orderNote || null,
    };

    console.log("Calling createOrder with userId:", userId);
    const order = await createOrder(userId, createOrderInput);
    console.log("Order created successfully:", order.id);

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Error in createOrderAction:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "주문을 생성하는 중 오류가 발생했습니다.",
    };
  }
}

/**
 * 주문 조회
 *
 * @param orderId - 주문 ID
 * @returns 주문 및 주문 아이템 목록
 */
export async function getOrderByIdAction(
  orderId: string
): Promise<OrderWithItems | null> {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("로그인이 필요합니다.");
    }

    const order = await getOrderById(orderId);

    // 본인의 주문만 조회 가능
    if (order.clerk_id !== userId) {
      throw new Error("주문을 조회할 권한이 없습니다.");
    }

    return order;
  } catch (error) {
    console.error("Error in getOrderByIdAction:", error);
    return null;
  }
}

/**
 * 사용자 주문 목록 조회
 *
 * @returns 주문 목록
 */
export async function getUserOrdersAction(): Promise<OrderWithItems[]> {
  console.log("🚀 getUserOrdersAction: ===== STARTING =====");

  try {
    console.log("getUserOrdersAction: Checking authentication...");

    const { userId } = await auth();
    console.log("getUserOrdersAction: Auth result - userId:", userId ? `${userId.substring(0, 8)}...` : "null");

    if (!userId) {
      console.log("getUserOrdersAction: User not authenticated, returning empty array");
      return [];
    }

    console.log("getUserOrdersAction: Fetching orders for user...");

    try {
      const orders = await getUserOrders(userId);
      console.log("getUserOrdersAction: ✅ Successfully fetched orders count:", orders.length);
      console.log("getUserOrdersAction: ===== SUCCESS =====");
      return orders;
    } catch (dbError) {
      console.error("getUserOrdersAction: ❌ Database error occurred:", dbError);
      console.error("getUserOrdersAction: Error type:", typeof dbError);
      console.error("getUserOrdersAction: Error details:", dbError instanceof Error ? dbError.message : String(dbError));

      // 데이터베이스 에러인 경우 빈 배열 반환
      if (dbError instanceof Error) {
        const errorMessage = dbError.message;
        if (
          errorMessage.includes("relation") ||
          errorMessage.includes("does not exist") ||
          errorMessage.includes("schema cache") ||
          errorMessage.includes("Could not find the table") ||
          errorMessage.includes("orders")
        ) {
          console.log("getUserOrdersAction: 🔧 Database table issue detected, returning empty array");
          console.log("getUserOrdersAction: 💡 SOLUTION: Run SQL from supabase/migrations/db.sql in Supabase Dashboard");
          console.log("getUserOrdersAction: ===== HANDLED ERROR =====");
          return [];
        }
      }

      // 다른 데이터베이스 에러도 빈 배열로 처리
      console.log("getUserOrdersAction: 🔧 Unknown database error, returning empty array to prevent app crash");
      console.log("getUserOrdersAction: ===== HANDLED ERROR =====");
      return [];
    }
  } catch (error) {
    // 모든 예외 상황을 하나의 catch 블록에서 처리
    console.error("getUserOrdersAction: ❌ Unexpected error:", error);
    console.error("getUserOrdersAction: Error stack:", error instanceof Error ? error.stack : "No stack");

    // 인증 에러인지 확인
    if (error instanceof Error && error.message.includes("auth")) {
      console.log("getUserOrdersAction: 🔧 Auth error detected, returning empty array");
    } else {
      console.log("getUserOrdersAction: 🔧 General error, returning empty array to prevent app crash");
    }

    console.log("getUserOrdersAction: ===== HANDLED ERROR =====");
    return [];
  }
}

