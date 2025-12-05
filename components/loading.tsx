/**
 * @file components/loading.tsx
 * @description 로딩 컴포넌트
 *
 * 다양한 상황에서 사용할 수 있는 로딩 UI 컴포넌트들
 */

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <Loader2
      className={`animate-spin text-gray-500 ${sizeClasses[size]} ${className}`}
    />
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
