# Phase 7: 공통 작업 & 문서화

이 문서는 Phase 7에서 구현된 공통 작업 및 문서화 내용을 정리합니다.

## 구현 완료된 작업

### 1. 오류/로딩/비어있는 상태 UI 정비

#### 새로 추가된 컴포넌트

**`components/empty-state.tsx`**
- `EmptyState`: 범용 비어있는 상태 컴포넌트
- `EmptyProducts`: 상품이 없을 때 표시
- `EmptySearchResults`: 검색 결과가 없을 때 표시
- `EmptyCart`: 장바구니가 비어있을 때 표시
- `EmptyOrders`: 주문 내역이 없을 때 표시
- `EmptyCategoryProducts`: 카테고리별 상품이 없을 때 표시
- `LoadError`: 데이터 로드 실패 시 표시

**`components/loading.tsx` 개선**
- `LoadingSpinner`: 접근성 라벨 추가 (`aria-label`, `sr-only`)
- `TableSkeleton`: 테이블 로딩 스켈레톤 추가
- `OrderCardSkeleton`: 주문 카드 스켈레톤 추가
- `OrderListSkeleton`: 주문 목록 스켈레톤 추가
- `InlineLoading`: 인라인 로딩 표시 (버튼 내부 등)
- `OverlayLoading`: 전체 화면 오버레이 로딩

#### 적용된 페이지
- `components/products-section.tsx`: EmptyProducts, EmptyCategoryProducts, LoadError 사용
- `app/cart/page.tsx`: EmptyCart 사용
- `components/order-list.tsx`: EmptyOrders 사용

### 2. 타입 안전성 강화 (Zod + react-hook-form 적용)

#### Zod 스키마 파일
- `lib/schemas/product.ts`: 상품 관련 스키마
- `lib/schemas/cart.ts`: 장바구니 관련 스키마
- `lib/schemas/order.ts`: 주문 관련 스키마

#### Server Actions 검증 적용
- `actions/cart.ts`: `AddToCartRequestSchema`, `UpdateCartItemRequestSchema` 검증
- `actions/orders.ts`: `CreateOrderRequestSchema` 검증

#### 폼 컴포넌트
- `components/order-form.tsx`: react-hook-form + Zod 사용

### 3. README/PRD 반영, 운영 가이드 업데이트

#### 업데이트된 문서
- `README.md`: 전체 기능 체크리스트, 프로젝트 구조, 배포 가이드
- `docs/TODO.md`: 모든 Phase 완료 상태로 업데이트

### 4. 접근성/반응형/다크모드 점검

#### 다크모드 지원

**`components/theme-toggle.tsx`**
- 라이트/다크/시스템 테마 선택 가능
- `localStorage`에 설정 저장
- 시스템 테마 변경 자동 감지

**`app/globals.css`**
- CSS 변수 기반 다크모드 설정
- `oklch` 색상 시스템 사용

#### 접근성 개선

**`components/skip-to-content.tsx`**
- 키보드 사용자를 위한 "메인 콘텐츠로 건너뛰기" 링크
- Tab 키로 포커스 시 표시됨

**ARIA 속성 적용**
- `role="status"`: 로딩 및 상태 표시 컴포넌트
- `aria-label`: 의미 있는 라벨 제공
- `sr-only`: 스크린리더 전용 텍스트

#### 반응형 디자인

**`components/Navbar.tsx`**
- 모바일에서 "주문내역" 버튼 숨김 (`hidden sm:block`)
- 간격 조정 (`gap-2 md:gap-4`)

**`components/loading.tsx`**
- 반응형 그리드 레이아웃 (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`)

## 파일 구조

```
components/
├── empty-state.tsx          # 비어있는 상태 UI 컴포넌트
├── loading.tsx              # 로딩 컴포넌트 (개선됨)
├── error-boundary.tsx       # 에러 바운더리
├── theme-toggle.tsx         # 테마 토글 (NEW)
├── skip-to-content.tsx      # 접근성 스킵 링크 (NEW)
└── ...

lib/schemas/
├── product.ts               # 상품 Zod 스키마
├── cart.ts                  # 장바구니 Zod 스키마
└── order.ts                 # 주문 Zod 스키마

actions/
├── cart.ts                  # 장바구니 Server Actions (Zod 검증)
└── orders.ts                # 주문 Server Actions (Zod 검증)
```

## 사용 예시

### 비어있는 상태 사용

```tsx
import { EmptyProducts, EmptyCart, LoadError } from "@/components/empty-state";

// 상품이 없을 때
<EmptyProducts onRetry={() => window.location.reload()} />

// 장바구니가 비어있을 때
<EmptyCart />

// 에러 발생 시
<LoadError message="데이터를 불러오는데 실패했습니다." onRetry={handleRetry} />
```

### 테마 토글 사용

```tsx
import { ThemeToggle } from "@/components/theme-toggle";

// 네비게이션 바에 추가
<ThemeToggle />
```

### Zod 스키마 검증

```tsx
import { CreateOrderRequestSchema } from "@/lib/schemas/order";

// Server Action에서 검증
const validationResult = CreateOrderRequestSchema.safeParse(input);
if (!validationResult.success) {
  return { success: false, error: validationResult.error.message };
}
```

## 완료 상태

| 작업 | 상태 |
|------|------|
| 오류/로딩/비어있는 상태 UI 정비 | ✅ 완료 |
| 타입 안전성 강화 (Zod + react-hook-form) | ✅ 완료 |
| README/PRD 반영, 운영 가이드 업데이트 | ✅ 완료 |
| 접근성/반응형/다크모드 점검 | ✅ 완료 |

