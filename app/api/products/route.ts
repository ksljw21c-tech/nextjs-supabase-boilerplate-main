/**
 * @file app/api/products/route.ts
 * @description 상품 데이터 API
 *
 * 상품 목록과 카테고리를 가져오는 API 엔드포인트
 */

import { NextRequest, NextResponse } from "next/server";
import { getProducts, getProductCategories } from "@/lib/supabase/queries/products";

export async function GET(request: NextRequest) {
  try {
    console.log("API /api/products called");
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 12;

    console.log("API params:", { category, page, limit });

    console.log("API: Calling getProducts and getProductCategories");

    // 상품 데이터와 카테고리 데이터를 동시에 가져옴
    const [{ products: rawProducts, totalPages }, categories] = await Promise.all([
      getProducts({
        category: category || null,
        page,
        limit,
        sortBy: "created_at",
        sortOrder: "desc",
      }),
      getProductCategories()
    ]);

    console.log("API: Successfully fetched data", {
      productsCount: rawProducts.length,
      categoriesCount: categories.length,
      totalPages
    });

    // 상품 데이터 변환 및 필터링
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validProducts = rawProducts.filter((product: any) => {
      // 기본 필수 필드 검증
      if (!product.id || !product.name || typeof product.price !== "number") {
        console.warn("Invalid product filtered out:", product.id);
        return false;
      }
      return true;
    });

    // 유효하지 않은 상품이 있었다면 로그 기록
    if (validProducts.length !== rawProducts.length) {
      console.warn(`Filtered out ${rawProducts.length - validProducts.length} invalid products`);
    }

    // 응답 데이터 구성
    const responseData = {
      products: validProducts,
      categories,
      totalPages,
      page,
      limit,
    };

    console.log("API: Returning response", {
      productsCount: responseData.products.length,
      categoriesCount: responseData.categories.length,
      totalPages: responseData.totalPages
    });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("API Error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error
    });
    return NextResponse.json(
      {
        error: "Failed to fetch products",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
