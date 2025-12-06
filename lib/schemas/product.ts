/**
 * @file lib/schemas/product.ts
 * @description 상품 관련 Zod 스키마
 *
 * 상품 데이터의 유효성 검증을 위한 Zod 스키마들
 */

import { z } from "zod";

// 상품 상태 enum
export const ProductStatusSchema = z.enum(["active", "inactive"]);

// 상품 카테고리 enum
export const ProductCategorySchema = z.enum([
  "electronics",
  "clothing",
  "books",
  "food",
  "sports",
  "beauty",
  "home"
]);

// 기본 상품 스키마
export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "상품명은 필수입니다").max(100, "상품명은 100자 이하여야 합니다"),
  description: z.string().optional(),
  price: z.number().min(0, "가격은 0 이상이어야 합니다"),
  category: z.string().optional(),
  stock_quantity: z.number().min(0, "재고 수량은 0 이상이어야 합니다"),
  is_active: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// 상품 생성 스키마 (ID와 타임스탬프 필드 제외)
export const CreateProductSchema = ProductSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// 상품 업데이트 스키마 (일부 필드만 선택)
export const UpdateProductSchema = ProductSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// 상품 검색/필터링 파라미터 스키마
export const ProductQuerySchema = z.object({
  category: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(12),
  sortBy: z.enum(["created_at", "price", "name"]).default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().optional(),
});

// 상품 목록 응답 스키마
export const ProductListResponseSchema = z.object({
  products: z.array(ProductSchema),
  categories: z.array(z.string()),
  totalPages: z.number().min(0),
  page: z.number().min(1),
  limit: z.number().min(1),
});

// 카테고리 목록 응답 스키마
export const CategoryListResponseSchema = z.array(z.string());

// 타입 추론
export type Product = z.infer<typeof ProductSchema>;
export type CreateProduct = z.infer<typeof CreateProductSchema>;
export type UpdateProduct = z.infer<typeof UpdateProductSchema>;
export type ProductQuery = z.infer<typeof ProductQuerySchema>;
export type ProductListResponse = z.infer<typeof ProductListResponseSchema>;
