/**
 * @file components/payment-widget.tsx
 * @description Toss Payments 결제 위젯 컴포넌트
 *
 * Toss Payments SDK를 사용하여 결제 UI를 제공하는 컴포넌트
 */

"use client";

import { useEffect, useRef, useState } from "react";
import {
  loadPaymentWidget,
  PaymentWidgetInstance,
} from "@tosspayments/payment-widget-sdk";
import { getTossPaymentsClientKey, generateCustomerKey } from "@/lib/utils/payment";
import { PaymentRequestData } from "@/types/payment";

interface PaymentWidgetProps {
  amount: number;
  orderId: string;
  orderName: string;
  customerName?: string;
  customerEmail?: string;
  onSuccess?: (paymentKey: string) => void;
  onFail?: (error: any) => void;
}

export default function PaymentWidget({
  amount,
  orderId,
  orderName,
  customerName,
  customerEmail,
  onSuccess,
  onFail,
}: PaymentWidgetProps) {
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializePaymentWidget = async () => {
      try {
        // 테스트 모드 클라이언트 키 사용
        const clientKey = getTossPaymentsClientKey();
        const customerKey = generateCustomerKey("test-user"); // 실제로는 사용자 ID 사용

        // 결제 위젯 로드
        const paymentWidget = await loadPaymentWidget(clientKey, customerKey);

        // 결제 방법 설정
        await paymentWidget.renderPaymentMethods("#payment-method", { value: amount });

        // 이용약관 동의 설정
        await paymentWidget.renderAgreement("#agreement");

        paymentWidgetRef.current = paymentWidget;
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to initialize payment widget:", err);
        setError("결제 위젯을 불러오는 중 오류가 발생했습니다.");
        setIsLoading(false);
      }
    };

    initializePaymentWidget();
  }, [amount]);

  const handlePaymentRequest = async () => {
    if (!paymentWidgetRef.current) {
      onFail?.(new Error("Payment widget not initialized"));
      return;
    }

    try {
      const paymentWidget = paymentWidgetRef.current;

      // 결제 요청
      await paymentWidget.requestPayment({
        orderId,
        orderName,
        successUrl: `${window.location.origin}/api/payments/success?orderId=${orderId}`,
        failUrl: `${window.location.origin}/checkout?status=fail`,
        customerEmail,
        customerName,
      });

      // 성공/실패 처리는 successUrl/failUrl의 콜백에서 처리됨
    } catch (err) {
      console.error("Payment request failed:", err);
      onFail?.(err);
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
        <p className="text-red-800 dark:text-red-200">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">결제 위젯을 불러오는 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 결제 금액 표시 */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-blue-800 dark:text-blue-200 font-medium">결제 금액</span>
          <span className="text-xl font-bold text-blue-900 dark:text-blue-100">
            {amount.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 결제 방법 선택 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">결제 방법</h3>
        <div id="payment-method" className="min-h-[200px]" />
      </div>

      {/* 이용약관 동의 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">약관 동의</h3>
        <div id="agreement" />
      </div>

      {/* 결제 버튼 */}
      <button
        onClick={handlePaymentRequest}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
      >
        {amount.toLocaleString()}원 결제하기
      </button>

      {/* 테스트 모드 안내 */}
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg">
        <div className="flex items-start space-x-2">
          <div className="text-yellow-600 dark:text-yellow-400 mt-0.5">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-sm">
            <p className="font-medium text-yellow-800 dark:text-yellow-200">
              테스트 모드 안내
            </p>
            <p className="text-yellow-700 dark:text-yellow-300 mt-1">
              현재 Toss Payments 테스트 모드로 운영 중입니다. 실제 결제가 이루어지지 않으며, 테스트용 카드 정보로 결제 테스트가 가능합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
