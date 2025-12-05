/**
 * @file components/category-filter.tsx
 * @description 카테고리 필터 컴포넌트
 *
 * 상품 카테고리를 필터링하는 버튼 그룹 컴포넌트
 * URL 쿼리 파라미터로 필터 상태를 관리합니다.
 *
 * @dependencies
 * - next/navigation: useRouter, useSearchParams
 * - @/components/ui/button: Button 컴포넌트
 * - @/lib/utils: cn 함수
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  currentCategory?: string | null;
  className?: string;
}

/**
 * 카테고리 한글 변환
 */
function getCategoryLabel(category: string): string {
  const categoryMap: Record<string, string> = {
    electronics: "전자제품",
    clothing: "의류",
    books: "도서",
    food: "식품",
    sports: "스포츠",
    beauty: "뷰티",
    home: "생활용품",
  };

  return categoryMap[category] || category;
}

/**
 * 카테고리 필터 컴포넌트
 *
 * @param categories 사용 가능한 카테고리 목록
 * @param currentCategory 현재 선택된 카테고리
 * @param className 추가 CSS 클래스
 */
export default function CategoryFilter({
  categories,
  currentCategory,
  className,
}: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    // 페이지는 1로 리셋
    params.delete("page");

    router.push(`/?${params.toString()}`);
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {/* 전체 버튼 */}
      <Button
        variant={!currentCategory ? "default" : "outline"}
        size="sm"
        onClick={() => handleCategoryChange(null)}
        className="rounded-full"
      >
        전체
      </Button>

      {/* 카테고리 버튼들 */}
      {categories.map((category) => (
        <Button
          key={category}
          variant={currentCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryChange(category)}
          className="rounded-full"
        >
          {getCategoryLabel(category)}
        </Button>
      ))}
    </div>
  );
}

