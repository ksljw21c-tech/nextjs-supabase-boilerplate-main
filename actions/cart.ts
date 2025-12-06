/**
 * @file actions/cart.ts
 * @description 장바구니 관련 Server Actions
 *
 * 클라이언트에서 호출할 수 있는 장바구니 관련 Server Actions
 * 인증 확인 및 에러 처리를 포함합니다.
 */

"use server";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import {
  getCartItems,
  addToCart,
  updateCartItem,
  removeFromCart,
} from "@/lib/supabase/queries/cart";
import { AddToCartRequestSchema, UpdateCartItemRequestSchema } from "@/lib/schemas/cart";
import type { CartItemWithProduct } from "@/types/cart";

/**
 * 장바구니 아이템 조회
 *
 * @returns 장바구니 아이템 배열
 */
export async function getCartItemsAction(): Promise<CartItemWithProduct[]> {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("로그인이 필요합니다.");
    }

    return await getCartItems(userId);
  } catch (error) {
    console.error("Error in getCartItemsAction:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("장바구니를 불러오는 중 오류가 발생했습니다.");
  }
}

/**
 * 장바구니에 상품 추가
 *
 * @param productId - 상품 ID
 * @param quantity - 수량 (기본값: 1)
 * @returns 성공 여부 및 에러 메시지
 */
export async function addToCartAction(
  productId: string,
  quantity: number = 1
): Promise<{ success: boolean; error?: string }> {
  try {
    // Zod 스키마로 입력 검증
    const validationResult = AddToCartRequestSchema.safeParse({
      product_id: productId,
      quantity,
    });

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors
        .map(err => err.message)
        .join(", ");
      return { success: false, error: `입력값 오류: ${errorMessage}` };
    }

    const validatedData = validationResult.data;

    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "로그인이 필요합니다." };
    }

    await addToCart(userId, validatedData.product_id, validatedData.quantity);

    return { success: true };
  } catch (error) {
    console.error("Error in addToCartAction:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "장바구니에 추가하는 중 오류가 발생했습니다.",
    };
  }
}

/**
 * 장바구니 아이템 수량 변경
 *
 * @param cartItemId - 장바구니 아이템 ID
 * @param quantity - 새로운 수량
 * @returns 성공 여부 및 에러 메시지
 */
export async function updateCartItemAction(
  cartItemId: string,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // cartItemId 검증
    if (!cartItemId || typeof cartItemId !== 'string') {
      return { success: false, error: "유효하지 않은 장바구니 아이템 ID입니다." };
    }

    // Zod 스키마로 수량 검증
    const quantityValidation = UpdateCartItemRequestSchema.safeParse({ quantity });
    if (!quantityValidation.success) {
      const errorMessage = quantityValidation.error.errors
        .map(err => err.message)
        .join(", ");
      return { success: false, error: `수량 오류: ${errorMessage}` };
    }

    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "로그인이 필요합니다." };
    }

    await updateCartItem(cartItemId, quantity);

    return { success: true };
  } catch (error) {
    console.error("Error in updateCartItemAction:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "장바구니 아이템을 업데이트하는 중 오류가 발생했습니다.",
    };
  }
}

/**
 * 장바구니에서 아이템 삭제
 *
 * @param cartItemId - 장바구니 아이템 ID
 * @returns 성공 여부 및 에러 메시지
 */
export async function removeFromCartAction(
  cartItemId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 입력 검증
    if (!cartItemId || typeof cartItemId !== 'string') {
      return { success: false, error: "유효하지 않은 장바구니 아이템 ID입니다." };
    }

    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "로그인이 필요합니다." };
    }

    await removeFromCart(cartItemId);

    return { success: true };
  } catch (error) {
    console.error("Error in removeFromCartAction:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "장바구니에서 삭제하는 중 오류가 발생했습니다.",
    };
  }
}

