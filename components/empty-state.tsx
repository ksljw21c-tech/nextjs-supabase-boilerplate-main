/**
 * @file components/empty-state.tsx
 * @description 비어있는 상태 UI 컴포넌트
 *
 * 데이터가 없거나 검색 결과가 없을 때 표시하는 컴포넌트들
 */

import { Button } from "@/components/ui/button";
import { Package, Search, ShoppingCart, FileText, RefreshCw } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

/**
 * 기본 비어있는 상태 컴포넌트
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
      role="status"
      aria-label={title}
    >
      {icon && (
        <div className="mb-4 text-gray-400 dark:text-gray-500" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
          {description}
        </p>
      )}
      {action && (
        action.href ? (
          <Button asChild>
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ) : (
          <Button onClick={action.onClick}>{action.label}</Button>
        )
      )}
    </div>
  );
}

/**
 * 상품이 없을 때 표시하는 컴포넌트
 */
export function EmptyProducts({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon={<Package className="w-16 h-16" />}
      title="상품이 없습니다"
      description="아직 등록된 상품이 없습니다. 나중에 다시 확인해주세요."
      action={onRetry ? { label: "새로고침", onClick: onRetry } : undefined}
    />
  );
}

/**
 * 검색 결과가 없을 때 표시하는 컴포넌트
 */
export function EmptySearchResults({
  searchTerm,
  onClear,
}: {
  searchTerm?: string;
  onClear?: () => void;
}) {
  return (
    <EmptyState
      icon={<Search className="w-16 h-16" />}
      title="검색 결과가 없습니다"
      description={
        searchTerm
          ? `"${searchTerm}"에 대한 검색 결과가 없습니다. 다른 검색어를 시도해보세요.`
          : "검색 결과가 없습니다. 다른 검색어를 시도해보세요."
      }
      action={onClear ? { label: "검색 초기화", onClick: onClear } : undefined}
    />
  );
}

/**
 * 장바구니가 비어있을 때 표시하는 컴포넌트
 */
export function EmptyCart() {
  return (
    <EmptyState
      icon={<ShoppingCart className="w-16 h-16" />}
      title="장바구니가 비어있습니다"
      description="아직 장바구니에 담긴 상품이 없습니다. 쇼핑을 시작해보세요!"
      action={{ label: "쇼핑 시작하기", href: "/" }}
    />
  );
}

/**
 * 주문 내역이 없을 때 표시하는 컴포넌트
 */
export function EmptyOrders() {
  return (
    <EmptyState
      icon={<FileText className="w-16 h-16" />}
      title="주문 내역이 없습니다"
      description="아직 주문한 상품이 없습니다. 마음에 드는 상품을 주문해보세요!"
      action={{ label: "쇼핑하러 가기", href: "/" }}
    />
  );
}

/**
 * 카테고리별 상품이 없을 때 표시하는 컴포넌트
 */
export function EmptyCategoryProducts({
  category,
  onViewAll,
}: {
  category: string;
  onViewAll?: () => void;
}) {
  return (
    <EmptyState
      icon={<Package className="w-16 h-16" />}
      title={`${category} 카테고리에 상품이 없습니다`}
      description="해당 카테고리에 상품이 없습니다. 다른 카테고리를 확인해보세요."
      action={onViewAll ? { label: "전체 상품 보기", onClick: onViewAll } : { label: "전체 상품 보기", href: "/" }}
    />
  );
}

/**
 * 데이터 로드 실패 시 표시하는 컴포넌트
 */
export function LoadError({
  message = "데이터를 불러오는데 실패했습니다.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      icon={<RefreshCw className="w-16 h-16" />}
      title="오류가 발생했습니다"
      description={message}
      action={onRetry ? { label: "다시 시도", onClick: onRetry } : undefined}
    />
  );
}

