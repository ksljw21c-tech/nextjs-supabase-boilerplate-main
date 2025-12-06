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
import { EmptyOrders } from "@/components/empty-state";
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
      <div className="border dark:border-gray-700 rounded-lg">
        <EmptyOrders />
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

