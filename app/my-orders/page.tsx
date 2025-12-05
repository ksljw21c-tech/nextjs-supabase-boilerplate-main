/**
 * @file app/my-orders/page.tsx
 * @description 마이페이지 - 주문 내역
 *
 * 사용자의 주문 내역을 목록으로 표시하는 페이지
 */

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserOrdersAction } from "@/actions/orders";
import OrderList from "@/components/order-list";

export default async function MyOrdersPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const orders = await getUserOrdersAction();

  // 데이터베이스 테이블이 없는 경우 사용자에게 안내
  if (orders.length === 0) {
    console.log('마이페이지: 주문 데이터가 없거나 데이터베이스 테이블이 설정되지 않았을 수 있습니다.');
  }

  return (
    <main className="min-h-[calc(100vh-80px)] px-4 py-8 md:px-8 md:py-12">
      <div className="w-full max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">주문 내역</h1>
          <p className="text-gray-600 dark:text-gray-400">
            지금까지 주문한 상품들을 확인하세요
          </p>
        </div>

        <OrderList orders={orders} />
      </div>
    </main>
  );
}

