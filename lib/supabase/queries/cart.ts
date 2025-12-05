/**
 * @file lib/supabase/queries/cart.ts
 * @description 장바구니 데이터 조회 및 수정 함수
 *
 * Server Component에서 사용할 장바구니 관련 함수들
 * Supabase cart_items 테이블에서 데이터를 가져오고 수정합니다.
 *
 * @dependencies
 * - @supabase/supabase-js: 데이터베이스 접근
 * - lib/supabase/server: Server Component용 Supabase 클라이언트
 */

import { createClient } from "@/lib/supabase/server";
import type { CartItem, CartItemWithProduct } from "@/types/cart";

/**
 * 장바구니 아이템 조회 (상품 정보 포함)
 *
 * @param clerkId - Clerk 사용자 ID
 * @returns 상품 정보가 포함된 장바구니 아이템 배열
 */
export async function getCartItems(
  clerkId: string
): Promise<CartItemWithProduct[]> {
  try {
    const supabase = await createClient();

    // cart_items와 products를 조인하여 조회
    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        *,
        product:products(*)
      `
      )
      .eq("clerk_id", clerkId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching cart items:", error);
      throw new Error(`Failed to fetch cart items: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    // 타입 변환: product를 Product 타입으로 변환
    return data.map((item: any) => ({
      id: item.id,
      clerk_id: item.clerk_id,
      product_id: item.product_id,
      quantity: item.quantity,
      created_at: item.created_at,
      updated_at: item.updated_at,
      product: item.product,
    })) as CartItemWithProduct[];
  } catch (error) {
    console.error("Error in getCartItems:", error);
    return [];
  }
}

/**
 * 장바구니에 상품 추가
 *
 * @param clerkId - Clerk 사용자 ID
 * @param productId - 상품 ID
 * @param quantity - 수량
 * @returns 생성된 장바구니 아이템
 */
export async function addToCart(
  clerkId: string,
  productId: string,
  quantity: number
): Promise<CartItem> {
  const supabase = await createClient();

  // 기존 장바구니 아이템 확인
  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("*")
    .eq("clerk_id", clerkId)
    .eq("product_id", productId)
    .single();

  if (existingItem) {
    // 이미 존재하는 경우 수량 업데이트
    const newQuantity = existingItem.quantity + quantity;
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity: newQuantity })
      .eq("id", existingItem.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating cart item:", error);
      throw new Error(`Failed to update cart item: ${error.message}`);
    }

    return data as CartItem;
  } else {
    // 새로 추가
    const { data, error } = await supabase
      .from("cart_items")
      .insert({
        clerk_id: clerkId,
        product_id: productId,
        quantity,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding to cart:", error);
      throw new Error(`Failed to add to cart: ${error.message}`);
    }

    return data as CartItem;
  }
}

/**
 * 장바구니 아이템 수량 변경
 *
 * @param cartItemId - 장바구니 아이템 ID
 * @param quantity - 새로운 수량
 * @returns 업데이트된 장바구니 아이템
 */
export async function updateCartItem(
  cartItemId: string,
  quantity: number
): Promise<CartItem> {
  const supabase = await createClient();

  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const { data, error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", cartItemId)
    .select()
    .single();

  if (error) {
    console.error("Error updating cart item:", error);
    throw new Error(`Failed to update cart item: ${error.message}`);
  }

  return data as CartItem;
}

/**
 * 장바구니에서 아이템 삭제
 *
 * @param cartItemId - 장바구니 아이템 ID
 */
export async function removeFromCart(cartItemId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartItemId);

  if (error) {
    console.error("Error removing from cart:", error);
    throw new Error(`Failed to remove from cart: ${error.message}`);
  }
}

/**
 * 장바구니 비우기
 *
 * @param clerkId - Clerk 사용자 ID
 */
export async function clearCart(clerkId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("clerk_id", clerkId);

  if (error) {
    console.error("Error clearing cart:", error);
    throw new Error(`Failed to clear cart: ${error.message}`);
  }
}

