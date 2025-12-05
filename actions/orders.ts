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
  createOrder as createOrderQuery,
  getOrderById as getOrderByIdQuery,
  getUserOrders as getUserOrdersQuery,
} from "@/lib/supabase/queries/orders";
import type { Order, OrderWithItems, CreateOrderInput } from "@/types/order";

/**
 * 주문 생성
 *
 * @param input - 주문 생성 입력 (배송 주소, 메모)
 * @returns 성공 여부, 주문 ID, 에러 메시지
 */
export async function createOrderAction(
  input: CreateOrderInput
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const { userId } = await auth();

    if (!userId) {
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

    const order = await createOrderQuery(userId, input);

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Error in createOrderAction:", error);
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

    const order = await getOrderByIdQuery(orderId);

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
export async function getUserOrdersAction(): Promise<Order[]> {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("로그인이 필요합니다.");
    }

    return await getUserOrdersQuery(userId);
  } catch (error) {
    console.error("Error in getUserOrdersAction:", error);
    return [];
  }
}

