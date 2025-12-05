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
import type { Order, OrderWithItems, CreateOrderInput } from "@/types/order";

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
      detailAddress: string;
    };
    orderNote?: string | null;
  }
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  console.log("createOrderAction called with input:", input);

  try {
    console.log("Getting user authentication...");
    const { userId } = await auth();
    console.log("User ID:", userId);

    if (!userId) {
      console.log("User not authenticated");
      return { success: false, error: "로그인이 필요합니다." };
    }

    // 필수 필드 검증
    if (!input.shippingAddress.name) {
      return { success: false, error: "이름을 입력해주세요." };
    }
    if (!input.shippingAddress.phone) {
      return { success: false, error: "전화번호를 입력해주세요." };
    }
    if (!input.shippingAddress.postalCode) {
      return { success: false, error: "우편번호를 입력해주세요." };
    }
    if (!input.shippingAddress.address) {
      return { success: false, error: "주소를 입력해주세요." };
    }
    if (!input.shippingAddress.detailAddress) {
      return { success: false, error: "상세주소를 입력해주세요." };
    }

    // CreateOrderInput 형식으로 변환
    const createOrderInput = {
      shippingAddress: {
        name: input.shippingAddress.name,
        phone: input.shippingAddress.phone,
        postalCode: input.shippingAddress.postalCode,
        address: input.shippingAddress.address,
        detailAddress: input.shippingAddress.detailAddress,
      },
      orderNote: input.orderNote,
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
  try {
    console.log("getUserOrdersAction: Starting...");

    const { userId } = await auth();
    console.log("getUserOrdersAction: Auth result - userId:", userId ? "present" : "null");

    if (!userId) {
      console.log("getUserOrdersAction: User not authenticated, returning empty array");
      return [];
    }

    console.log("getUserOrdersAction: Fetching orders for user:", userId);

    // 데이터베이스 연결 상태 확인을 위한 간단한 쿼리
    try {
      const orders = await getUserOrders(userId);
      console.log("getUserOrdersAction: Successfully fetched orders count:", orders.length);
      return orders;
    } catch (dbError) {
      console.error("getUserOrdersAction: Database error:", dbError);
      console.error("getUserOrdersAction: Database error details:", dbError instanceof Error ? dbError.message : dbError);

      // 데이터베이스 에러인 경우 빈 배열 반환
      if (dbError instanceof Error && (
        dbError.message.includes("relation") ||
        dbError.message.includes("does not exist") ||
        dbError.message.includes("schema cache") ||
        dbError.message.includes("Could not find the table")
      )) {
        console.log("getUserOrdersAction: Database table issue detected, returning empty array");
        console.log("getUserOrdersAction: Please run the database migration SQL in Supabase Dashboard");
        return [];
      }

      throw dbError; // 다른 에러는 다시 던짐
    }
  } catch (error) {
    console.error("getUserOrdersAction: Unexpected error:", error);
    console.error("getUserOrdersAction: Error stack:", error instanceof Error ? error.stack : "No stack");

    // 어떤 에러든 빈 배열을 반환하여 앱이 계속 작동하도록 함
    return [];
  }
}

