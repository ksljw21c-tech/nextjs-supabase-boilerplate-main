/**
 * @file app/orders/[id]/page.tsx
 * @description 주문 상세 페이지
 *
 * 주문 완료 후 주문 상세 정보를 표시하는 페이지
 */

import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getOrderById } from "@/lib/supabase/queries/orders";
import { formatPrice } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

function getStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "주문 대기",
    confirmed: "주문 확인",
    shipped: "배송 중",
    delivered: "배송 완료",
    cancelled: "주문 취소",
  };
  return statusMap[status] || status;
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" {
  if (status === "cancelled") return "destructive";
  if (status === "delivered") return "default";
  return "secondary";
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { id } = await params;

  try {
    const order = await getOrderById(id);

    // 본인의 주문만 조회 가능
    if (order.clerk_id !== userId) {
      notFound();
    }

    return (
      <main className="min-h-[calc(100vh-80px)] px-4 py-8 md:px-8 md:py-12">
        <div className="w-full max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/">
              <Button variant="outline" size="sm" className="mb-4">
                ← 홈으로 돌아가기
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">주문 완료</h1>
            <p className="text-gray-600 dark:text-gray-400">
              주문이 성공적으로 완료되었습니다
            </p>
          </div>

          <div className="space-y-6">
            {/* 주문 정보 */}
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">주문 정보</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    주문 번호: {order.id}
                  </p>
                </div>
                <Badge variant={getStatusVariant(order.status)}>
                  {getStatusLabel(order.status)}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">주문일:</span>{" "}
                  {new Date(order.created_at).toLocaleString("ko-KR")}
                </p>
                <p>
                  <span className="font-medium">총 결제 금액:</span>{" "}
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatPrice(order.total_amount)}
                  </span>
                </p>
              </div>
            </div>

            {/* 주문 상품 목록 */}
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">주문 상품</h2>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatPrice(item.price)} × {item.quantity}개
                      </p>
                    </div>
                    <p className="font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 배송 정보 */}
            {order.shipping_address && (
              <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">배송 정보</h2>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">받는 분:</span>{" "}
                    {order.shipping_address.name}
                  </p>
                  <p>
                    <span className="font-medium">전화번호:</span>{" "}
                    {order.shipping_address.phone}
                  </p>
                  <p>
                    <span className="font-medium">주소:</span> (
                    {order.shipping_address.postalCode}){" "}
                    {order.shipping_address.address}{" "}
                    {order.shipping_address.detailAddress}
                  </p>
                  {order.order_note && (
                    <p>
                      <span className="font-medium">배송 요청사항:</span>{" "}
                      {order.order_note}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  쇼핑 계속하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Failed to load order:", error);
    notFound();
  }
}

