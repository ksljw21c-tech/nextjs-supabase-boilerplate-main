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
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 12;

    // 상품 데이터와 카테고리 데이터를 동시에 가져옴
    const [{ products, totalPages }, categories] = await Promise.all([
      getProducts({
        category: category || null,
        page,
        limit,
        sortBy: "created_at",
        sortOrder: "desc",
      }),
      getProductCategories()
    ]);

    return NextResponse.json({
      products,
      categories,
      totalPages,
      page,
      limit,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
