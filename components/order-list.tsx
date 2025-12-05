/**
 * @file components/order-list.tsx
 * @description 주문 목록 컴포넌트
 *
 * 사용자의 주문 내역을 목록으로 표시하는 컴포넌트
 */

import Link from "next/link";
import { formatPrice } from "@/types/product";
import { formatOrderStatus } from "@/lib/utils/order";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrderWithItems } from "@/types/order";

interface OrderListProps {
  orders: OrderWithItems[];
}

function getStatusVariant(status: OrderWithItems["status"]): "default" | "secondary" | "destructive" {
  switch (status) {
    case "cancelled":
      return "destructive";
    case "delivered":
      return "default";
    default:
      return "secondary";
  }
}

export default function OrderList({ orders }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-12 max-w-md mx-auto">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-semibold mb-2">주문 내역이 없습니다</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            아직 주문한 상품이 없거나 데이터베이스가 설정되지 않았습니다.
          </p>
          <div className="text-sm text-gray-500 mb-6 space-y-2">
            <p className="font-semibold text-red-600 dark:text-red-400">🚨 데이터베이스 설정 필요:</p>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-left">
              <p className="mb-2">1. 메모장에서 열린 <code className="bg-gray-200 px-1 rounded">db.sql</code> 파일 전체 복사</p>
              <p className="mb-2">2. Supabase Dashboard 열기:</p>
              <p className="mb-2 font-mono text-xs break-all">https://supabase.com/dashboard/project/xziygeoviztifdjioain</p>
              <p className="mb-2">3. SQL Editor → New Query → 붙여넣기 → Run</p>
              <p className="text-green-600 dark:text-green-400 font-semibold">4. "Success" 나오면 새로고침!</p>
            </div>
          </div>
          <Link href="/">
            <Button>상품 둘러보기</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  주문번호: {order.id.slice(0, 8)}...
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {new Date(order.created_at).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <Badge variant={getStatusVariant(order.status)}>
                {formatOrderStatus(order.status)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* 주문 상품 요약 */}
            <div className="space-y-2">
              <h4 className="font-medium">주문 상품</h4>
              <div className="space-y-1">
                {order.items && order.items.length > 0 ? (
                  order.items.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {item.product_name} × {item.quantity}
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">상품 정보 없음</p>
                )}

                {order.items && order.items.length > 2 && (
                  <p className="text-sm text-gray-500">
                    외 {order.items.length - 2}개 상품
                  </p>
                )}
              </div>
            </div>

            {/* 배송 정보 요약 */}
            {order.shipping_address && (
              <div className="space-y-2">
                <h4 className="font-medium">배송지</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.shipping_address.name} • {order.shipping_address.phone}
                  <br />
                  ({order.shipping_address.postalCode}) {order.shipping_address.address}
                </p>
              </div>
            )}

            {/* 주문 총액 */}
            <div className="flex justify-between items-center pt-4 border-t">
              <span className="font-medium">총 결제 금액</span>
              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                {formatPrice(order.total_amount)}
              </span>
            </div>

            {/* 상세 보기 버튼 */}
            <div className="flex justify-end pt-2">
              <Link href={`/orders/${order.id}`}>
                <Button variant="outline" size="sm">
                  상세 보기
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

