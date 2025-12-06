/**
 * @file components/loading.tsx
 * @description 로딩 컴포넌트
 *
 * 다양한 상황에서 사용할 수 있는 로딩 UI 컴포넌트들
 * 접근성과 다크모드를 고려하여 설계됨
 */

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  /** 스크린리더를 위한 접근성 라벨 */
  label?: string;
}

export function LoadingSpinner({
  size = "md",
  className = "",
  label = "로딩 중",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <div role="status" aria-label={label}>
      <Loader2
        className={`animate-spin text-gray-500 dark:text-gray-400 ${sizeClasses[size]} ${className}`}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

interface LoadingPageProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingPage({
  message = "로딩 중...",
  fullScreen = false
}: LoadingPageProps) {
  const containerClass = fullScreen
    ? "min-h-screen flex items-center justify-center"
    : "min-h-[200px] flex items-center justify-center";

  return (
    <div className={containerClass}>
      <div className="text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
}

interface LoadingCardProps {
  message?: string;
  className?: string;
}

export function LoadingCard({
  message = "데이터를 불러오는 중...",
  className = ""
}: LoadingCardProps) {
  return (
    <div className={`p-8 text-center border rounded-lg bg-gray-50 dark:bg-gray-900 ${className}`}>
      <LoadingSpinner size="md" className="mb-3" />
      <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
}

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className = "" }: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
  );
}

// 상품 카드 스켈레톤
export function ProductCardSkeleton() {
  return (
    <div className="border rounded-lg p-4">
      <LoadingSkeleton className="w-full h-48 mb-4" />
      <LoadingSkeleton className="w-3/4 h-4 mb-2" />
      <LoadingSkeleton className="w-1/2 h-4 mb-4" />
      <LoadingSkeleton className="w-full h-8" />
    </div>
  );
}

// 상품 그리드 스켈레톤
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
      role="status"
      aria-label="상품 목록 로딩 중"
    >
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
      <span className="sr-only">상품 목록을 불러오는 중입니다</span>
    </div>
  );
}

// 테이블 스켈레톤
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full" role="status" aria-label="테이블 로딩 중">
      {/* 헤더 */}
      <div className="flex gap-4 pb-4 border-b dark:border-gray-700">
        {Array.from({ length: cols }, (_, i) => (
          <LoadingSkeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* 행들 */}
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-4 border-b dark:border-gray-700">
          {Array.from({ length: cols }, (_, colIndex) => (
            <LoadingSkeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
      <span className="sr-only">데이터를 불러오는 중입니다</span>
    </div>
  );
}

// 주문 카드 스켈레톤
export function OrderCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 dark:border-gray-700" role="status" aria-label="주문 정보 로딩 중">
      <div className="flex justify-between items-start mb-4">
        <div>
          <LoadingSkeleton className="w-32 h-4 mb-2" />
          <LoadingSkeleton className="w-24 h-3" />
        </div>
        <LoadingSkeleton className="w-20 h-6 rounded-full" />
      </div>
      <div className="space-y-2">
        <LoadingSkeleton className="w-full h-4" />
        <LoadingSkeleton className="w-3/4 h-4" />
      </div>
      <div className="mt-4 pt-4 border-t dark:border-gray-700 flex justify-between">
        <LoadingSkeleton className="w-24 h-4" />
        <LoadingSkeleton className="w-20 h-4" />
      </div>
    </div>
  );
}

// 주문 목록 스켈레톤
export function OrderListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4" role="status" aria-label="주문 목록 로딩 중">
      {Array.from({ length: count }, (_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
      <span className="sr-only">주문 목록을 불러오는 중입니다</span>
    </div>
  );
}

// 인라인 로딩 (버튼 내부 등)
export function InlineLoading({ text = "처리 중..." }: { text?: string }) {
  return (
    <span className="inline-flex items-center gap-2" role="status">
      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
      <span>{text}</span>
    </span>
  );
}

// 오버레이 로딩 (전체 화면 덮기)
export function OverlayLoading({ message = "로딩 중..." }: { message?: string }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50"
      role="status"
      aria-label={message}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <LoadingSpinner size="xl" className="mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-300 text-center">{message}</p>
      </div>
    </div>
  );
}
