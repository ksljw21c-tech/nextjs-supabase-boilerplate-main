/**
 * @file app/products/[id]/page.tsx
 * @description 상품 상세 페이지
 *
 * 개별 상품의 상세 정보를 표시합니다.
 * 상품명, 가격, 카테고리, 재고 상태, 설명 등을 보여줍니다.
 */

import { notFound } from "next/navigation";
import { getProductById } from "@/lib/supabase/queries/products";
import { formatPrice, getStockStatus } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  try {
    const product = await getProductById(id);

    if (!product) {
      notFound();
    }

    const stockStatus = getStockStatus(product.stock_quantity);

    return (
      <main className="min-h-[calc(100vh-80px)] px-4 py-8 md:px-8 md:py-12">
        <div className="w-full max-w-4xl mx-auto">
          {/* 뒤로가기 버튼 */}
          <div className="mb-6">
            <Link href="/">
              <Button variant="outline" size="sm">
                ← 상품 목록으로 돌아가기
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 상품 이미지 */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-2">📦</div>
                  <p className="text-sm">상품 이미지</p>
                </div>
              </div>
            </div>

            {/* 상품 정보 */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                {product.category && (
                  <Badge variant="secondary" className="mb-4">
                    {product.category}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {formatPrice(product.price)}
                  </span>
                  <Badge
                    variant={
                      stockStatus === "품절"
                        ? "destructive"
                        : stockStatus === "재고 부족"
                        ? "secondary"
                        : "default"
                    }
                  >
                    {stockStatus}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  재고: {product.stock_quantity}개
                </p>
              </div>

              {product.description && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">상품 설명</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="space-y-4 pt-6 border-t">
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    disabled={stockStatus === "품절"}
                    size="lg"
                  >
                    {stockStatus === "품절" ? "품절" : "장바구니에 담기"}
                  </Button>
                  <Button variant="outline" size="lg">
                    찜하기
                  </Button>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  * 장바구니 및 찜하기 기능은 추후 구현 예정입니다.
                </p>
              </div>

              {/* 추가 정보 */}
              <div className="space-y-2 pt-6 border-t">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  상품 정보
                </h3>
                <div className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                  <p>상품 ID: {product.id}</p>
                  <p>
                    등록일: {new Date(product.created_at).toLocaleDateString("ko-KR")}
                  </p>
                  {product.updated_at !== product.created_at && (
                    <p>
                      수정일: {new Date(product.updated_at).toLocaleDateString("ko-KR")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Failed to load product:", error);
    notFound();
  }
}