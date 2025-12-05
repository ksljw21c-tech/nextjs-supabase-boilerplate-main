/**
 * @file app/products/[id]/not-found.tsx
 * @description 상품 상세 페이지 404 에러 처리
 *
 * 존재하지 않는 상품 ID로 접근할 때 표시되는 페이지입니다.
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <main className="min-h-[calc(100vh-80px)] px-4 py-8 md:px-8 md:py-12">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="space-y-6">
          <div className="text-6xl">🔍</div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold">상품을 찾을 수 없습니다</h1>
            <p className="text-gray-600 dark:text-gray-400">
              요청하신 상품이 존재하지 않거나 삭제되었을 수 있습니다.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full">
                상품 목록으로 돌아가기
              </Button>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              문제가 지속되면 관리자에게 문의해주세요.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}