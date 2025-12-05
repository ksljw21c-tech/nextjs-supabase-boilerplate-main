/**
 * @file components/order-summary.tsx
 * @description 주문 요약 컴포넌트
 *
 * 주문 상품 목록, 배송 정보, 최종 결제 금액을 표시합니다.
 */

import type { CartItemWithProduct } from "@/types/cart";
import type { ShippingAddress } from "@/types/order";
import { calculateCartTotal } from "@/lib/utils/cart";
import { formatPrice } from "@/types/product";

interface OrderSummaryProps {
  items: CartItemWithProduct[];
  shippingAddress?: ShippingAddress;
  orderNote?: string | null;
}

export default function OrderSummary({
  items,
  shippingAddress,
  orderNote,
}: OrderSummaryProps) {
  const total = calculateCartTotal(items);

  return (
    <div className="space-y-6">
      {/* 주문 상품 목록 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">주문 상품</h3>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-start p-3 border rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatPrice(item.product.price)} × {item.quantity}개
                </p>
              </div>
              <p className="font-semibold">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 배송 정보 */}
      {shippingAddress && (
        <div>
          <h3 className="text-lg font-semibold mb-4">배송 정보</h3>
          <div className="p-4 border rounded-lg space-y-2 text-sm">
            <p>
              <span className="font-medium">받는 분:</span> {shippingAddress.name}
            </p>
            <p>
              <span className="font-medium">전화번호:</span> {shippingAddress.phone}
            </p>
            <p>
              <span className="font-medium">주소:</span> ({shippingAddress.postalCode}){" "}
              {shippingAddress.address} {shippingAddress.detailAddress}
            </p>
            {orderNote && (
              <p>
                <span className="font-medium">배송 요청사항:</span> {orderNote}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 결제 금액 */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center text-lg font-bold">
          <span>최종 결제 금액</span>
          <span className="text-green-600 dark:text-green-400">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </div>
  );
}

