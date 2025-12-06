/**
 * @file lib/supabase/queries/products.ts
 * @description 상품 데이터 조회 함수
 *
 * Server Component에서 사용할 상품 조회 함수들
 * Supabase products 테이블에서 데이터를 가져옵니다.
 *
 * @dependencies
 * - @supabase/supabase-js: 데이터베이스 접근
 * - lib/supabase/server: Server Component용 Supabase 클라이언트
 */

import { createClient } from "@/lib/supabase/server";
import type {
  Product,
  GetProductsOptions,
  GetProductsResult,
} from "@/types/product";

/**
 * 상품 목록 조회
 *
 * @param options 조회 옵션 (카테고리, 페이지, 정렬 등)
 * @returns 상품 목록 및 페이지네이션 정보
 *
 * @example
 * ```tsx
 * const { products, total, totalPages } = await getProducts({
 *   category: 'electronics',
 *   page: 1,
 *   limit: 12
 * });
 * ```
 */
export async function getProducts(
  options: GetProductsOptions = {}
): Promise<GetProductsResult> {
  const {
    category = null,
    page = 1,
    limit = 12,
    sortBy = "created_at",
    sortOrder = "desc",
  } = options;

  let supabase;
  try {
    supabase = await createClient();
  } catch (clientError) {
    console.error("Failed to create Supabase client:", clientError);
    return {
      products: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }

  // 기본 쿼리: 활성화된 상품만 조회
  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("is_active", true);

  // 카테고리 필터
  if (category) {
    query = query.eq("category", category);
  }

  // 정렬
  query = query.order(sortBy, { ascending: sortOrder === "asc" });

  // 페이지네이션
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    // 테이블이 존재하지 않는 정상적인 경우 - 조용하게 처리
    const errorMessage = error?.message || "";
    const errorCode = error?.code || "";

    if (errorMessage.includes("Could not find the table") ||
        errorMessage.includes("relation") ||
        errorMessage.includes("does not exist") ||
        errorCode === "PGRST116" ||
        errorCode === "PGRST205" ||
        errorCode === "42P01") {
      // 조용하게 빈 결과 반환 (데이터베이스 설정 전 상태)
      return {
        products: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }

    // 다른 실제 에러는 로그 출력
    console.error("Unexpected database error:", {
      message: errorMessage,
      code: errorCode,
      details: error?.details,
      hint: error?.hint,
    });

    // 다른 에러의 경우도 빈 배열 반환 (안정성 보장)
    return {
      products: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }

  const products = (data as Product[]) || [];
  const total = count || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    products,
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * 상품 카테고리 목록 조회
 *
 * @returns 고유한 카테고리 목록
 *
 * @example
 * ```tsx
 * const categories = await getProductCategories();
 * // ['electronics', 'clothing', 'books', ...]
 * ```
 */
export async function getProductCategories(): Promise<string[]> {
  let supabase;
  try {
    supabase = await createClient();
  } catch (clientError) {
    console.error("Failed to create Supabase client:", clientError);
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select("category")
    .eq("is_active", true)
    .not("category", "is", null);

  if (error) {
    // 테이블이 존재하지 않는 정상적인 경우 - 조용하게 처리
    const errorMessage = error?.message || "";
    const errorCode = error?.code || "";

    if (errorMessage.includes("Could not find the table") ||
        errorMessage.includes("relation") ||
        errorMessage.includes("does not exist") ||
        errorCode === "PGRST116" ||
        errorCode === "PGRST205" ||
        errorCode === "42P01") {
      // 조용하게 빈 배열 반환 (데이터베이스 설정 전 상태)
      return [];
    }

    // 다른 실제 에러는 로그 출력
    console.error("Unexpected database error fetching categories:", {
      message: errorMessage,
      code: errorCode,
      details: error?.details,
      hint: error?.hint,
    });

    // 다른 에러의 경우도 빈 배열 반환 (안정성 보장)
    return [];
  }

  // 고유한 카테고리만 추출
  const uniqueCategories = Array.from(
    new Set(data.map((item) => item.category).filter(Boolean))
  ) as string[];

  return uniqueCategories.sort();
}

/**
 * 단일 상품 조회
 *
 * @param productId 상품 ID
 * @returns 상품 정보 또는 null
 *
 * @example
 * ```tsx
 * const product = await getProductById('product-id');
 * ```
 */
export async function getProductById(
  productId: string
): Promise<Product | null> {
  let supabase;
  try {
    supabase = await createClient();
  } catch (clientError) {
    console.error("Failed to create Supabase client:", clientError);
    return null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .eq("is_active", true)
    .single();

  if (error) {
    // 테이블이 존재하지 않는 정상적인 경우 - 조용하게 처리
    const errorMessage = error?.message || "";
    const errorCode = error?.code || "";

    if (errorMessage.includes("Could not find the table") ||
        errorMessage.includes("does not exist") ||
        errorCode === "PGRST116" ||
        errorCode === "PGRST205" ||
        errorCode === "42P01") {
      // 조용하게 null 반환 (데이터베이스 설정 전 상태)
      return null;
    }

    // 상품을 찾을 수 없는 경우 (PGRST116)
    if (errorCode === "PGRST116") {
      return null;
    }

    // 다른 실제 에러는 로그 출력
    console.error("Unexpected database error fetching product by ID:", {
      message: errorMessage,
      code: errorCode,
      details: error?.details,
      hint: error?.hint,
    });

    // 다른 에러의 경우도 null 반환 (안정성 보장)
    return null;
  }

  return data as Product;
}

