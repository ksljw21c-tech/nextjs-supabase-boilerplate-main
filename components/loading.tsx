/**
 * @file components/loading.tsx
 * @description 로딩 컴포넌트
 *
 * 모던하고 생동감 있는 로딩 UI 컴포넌트들
 * 글래스모피즘과 그라데이션 효과를 적용
 */

import { Loader2, ShoppingBag } from "lucide-react";

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
    <div role="status" aria-label={label} className="flex justify-center">
      <Loader2
        className={`animate-spin text-primary ${sizeClasses[size]} ${className}`}
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
    : "min-h-[300px] flex items-center justify-center";

  return (
    <div className={containerClass}>
      <div className="text-center">
        {/* 애니메이션 로딩 아이콘 */}
        <div className="relative mb-6">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 via-chart-2/20 to-chart-5/20 flex items-center justify-center animate-pulse">
            <ShoppingBag className="w-10 h-10 text-primary animate-bounce" />
          </div>
          <div className="absolute inset-0 w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-chart-2 opacity-20 blur-xl animate-pulse" />
        </div>
        
        {/* 로딩 바 */}
        <div className="w-48 h-1.5 mx-auto mb-4 bg-muted rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-primary via-chart-2 to-primary bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded-full" />
        </div>
        
        <p className="text-muted-foreground font-medium">{message}</p>
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
    <div className={`glass-card rounded-2xl p-8 text-center ${className}`}>
      <LoadingSpinner size="lg" className="mb-4 mx-auto" />
      <p className="text-sm text-muted-foreground font-medium">{message}</p>
    </div>
  );
}

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className = "" }: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite] rounded-lg ${className}`} />
  );
}

// 상품 카드 스켈레톤
export function ProductCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="aspect-square bg-gradient-to-br from-muted via-muted/70 to-muted/50 animate-pulse" />
      <div className="p-5 space-y-3">
        <LoadingSkeleton className="w-20 h-5 rounded-full" />
        <LoadingSkeleton className="w-3/4 h-6" />
        <LoadingSkeleton className="w-full h-4" />
        <div className="pt-3 border-t border-border/50">
          <LoadingSkeleton className="w-1/2 h-8" />
        </div>
      </div>
    </div>
  );
}

// 상품 그리드 스켈레톤
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
      role="status"
      aria-label="상품 목록 로딩 중"
    >
      {Array.from({ length: count }, (_, i) => (
        <div 
          key={i}
          className="animate-in fade-in duration-500"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <ProductCardSkeleton />
        </div>
      ))}
      <span className="sr-only">상품 목록을 불러오는 중입니다</span>
    </div>
  );
}

// 테이블 스켈레톤
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full glass-card rounded-xl p-4" role="status" aria-label="테이블 로딩 중">
      {/* 헤더 */}
      <div className="flex gap-4 pb-4 border-b border-border/50">
        {Array.from({ length: cols }, (_, i) => (
          <LoadingSkeleton key={i} className="h-5 flex-1" />
        ))}
      </div>
      {/* 행들 */}
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-4 border-b border-border/30 last:border-0">
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
    <div className="glass-card rounded-2xl p-5" role="status" aria-label="주문 정보 로딩 중">
      <div className="flex justify-between items-start mb-4">
        <div>
          <LoadingSkeleton className="w-32 h-5 mb-2" />
          <LoadingSkeleton className="w-24 h-4" />
        </div>
        <LoadingSkeleton className="w-20 h-7 rounded-full" />
      </div>
      <div className="space-y-2">
        <LoadingSkeleton className="w-full h-4" />
        <LoadingSkeleton className="w-3/4 h-4" />
      </div>
      <div className="mt-4 pt-4 border-t border-border/50 flex justify-between">
        <LoadingSkeleton className="w-24 h-5" />
        <LoadingSkeleton className="w-28 h-6" />
      </div>
    </div>
  );
}

// 주문 목록 스켈레톤
export function OrderListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4" role="status" aria-label="주문 목록 로딩 중">
      {Array.from({ length: count }, (_, i) => (
        <div 
          key={i}
          className="animate-in fade-in duration-500"
          style={{ animationDelay: `${i * 150}ms` }}
        >
          <OrderCardSkeleton />
        </div>
      ))}
      <span className="sr-only">주문 목록을 불러오는 중입니다</span>
    </div>
  );
}

// 인라인 로딩 (버튼 내부 등)
export function InlineLoading({ text = "처리 중..." }: { text?: string }) {
  return (
    <span className="inline-flex items-center gap-2" role="status">
      <Loader2 className="w-4 h-4 animate-spin text-current" aria-hidden="true" />
      <span>{text}</span>
    </span>
  );
}

// 오버레이 로딩 (전체 화면 덮기)
export function OverlayLoading({ message = "로딩 중..." }: { message?: string }) {
  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
      role="status"
      aria-label={message}
    >
      <div className="glass-card rounded-3xl p-8 shadow-glow max-w-sm mx-4">
        <div className="relative mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-chart-2/20 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-primary animate-bounce" />
          </div>
          <div className="absolute inset-0 w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-chart-2 opacity-20 blur-xl animate-pulse" />
        </div>
        <div className="w-32 h-1 mx-auto mb-4 bg-muted rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-primary via-chart-2 to-primary bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded-full" />
        </div>
        <p className="text-muted-foreground text-center font-medium">{message}</p>
      </div>
    </div>
  );
}
