/**
 * @file types/product.ts
 * @description 상품 관련 TypeScript 타입 정의
 *
 * Supabase products 테이블과 일치하는 타입 정의
 */

/**
 * 상품 인터페이스
 * 
 * Supabase products 테이블의 스키마와 일치합니다.
 */
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * 상품 카테고리 타입
 * 
 * db.sql에 정의된 카테고리 목록
 */
export type ProductCategory =
  | "electronics"
  | "clothing"
  | "books"
  | "food"
  | "sports"
  | "beauty"
  | "home";

/**
 * 상품 조회 옵션
 */
export interface GetProductsOptions {
  category?: string | null;
  page?: number;
  limit?: number;
  sortBy?: "created_at" | "price" | "name";
  sortOrder?: "asc" | "desc";
}

/**
 * 상품 조회 결과
 */
export interface GetProductsResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 재고 상태 타입
 */
export type StockStatus = "품절" | "재고 부족" | "재고 있음";

/**
 * 재고 상태를 반환하는 헬퍼 함수
 */
export function getStockStatus(
  stockQuantity: number
): StockStatus {
  if (stockQuantity === 0) {
    return "품절";
  }
  if (stockQuantity < 10) {
    return "재고 부족";
  }
  return "재고 있음";
}

/**
 * 가격을 포맷팅하는 헬퍼 함수
 * 
 * @example
 * formatPrice(89000) // "89,000원"
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(price);
}

