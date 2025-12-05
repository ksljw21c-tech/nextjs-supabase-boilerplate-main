# Phase 3: 장바구니 & 주문 기능 구현 완료

## 구현 완료 날짜
2025년 1월

## 구현된 기능

### 1. 장바구니 기능
- ✅ 장바구니에 상품 추가
- ✅ 장바구니 아이템 수량 변경
- ✅ 장바구니에서 아이템 삭제
- ✅ 장바구니 아이템 조회 (상품 정보 포함)
- ✅ Navbar에 장바구니 아이콘 및 개수 배지 표시
- ✅ 장바구니 사이드바 (Sheet 컴포넌트 사용)
- ✅ 장바구니 페이지 (`/cart`)

### 2. 주문 기능
- ✅ 주문 생성 (배송 주소, 메모 입력)
- ✅ 주문 상세 조회
- ✅ 주문 완료 페이지 (`/orders/[id]`)
- ✅ 재고 검증 (장바구니 추가 시, 주문 생성 시)
- ✅ 주문 총액 검증 (order_items 합계와 total_amount 일치 확인)
- ✅ 재고 차감 (주문 생성 시)
- ✅ 장바구니 자동 비우기 (주문 생성 후)

## 파일 구조

### 타입 정의
- `types/cart.ts` - 장바구니 관련 타입
- `types/order.ts` - 주문 관련 타입

### 유틸리티 함수
- `lib/utils/cart.ts` - 장바구니 총액/개수 계산, 재고 검증
- `lib/utils/order.ts` - 주문 총액 계산 및 검증

### 데이터베이스 쿼리
- `lib/supabase/queries/cart.ts` - 장바구니 CRUD 함수
- `lib/supabase/queries/orders.ts` - 주문 생성 및 조회 함수

### Server Actions
- `actions/cart.ts` - 장바구니 관련 Server Actions
- `actions/orders.ts` - 주문 관련 Server Actions

### UI 컴포넌트
- `components/cart-icon.tsx` - Navbar 장바구니 아이콘
- `components/cart-sidebar.tsx` - 장바구니 사이드바
- `components/cart-item.tsx` - 장바구니 아이템 카드
- `components/cart-summary.tsx` - 장바구니 요약
- `components/add-to-cart-button.tsx` - 장바구니 담기 버튼
- `components/order-form.tsx` - 주문 정보 입력 폼
- `components/order-summary.tsx` - 주문 요약
- `components/checkout-client.tsx` - 주문 생성 클라이언트 컴포넌트

### 페이지
- `app/cart/page.tsx` - 장바구니 페이지
- `app/checkout/page.tsx` - 주문 생성 페이지
- `app/orders/[id]/page.tsx` - 주문 상세 페이지

## 주요 구현 사항

### 인증 처리
- 모든 장바구니/주문 기능은 로그인 필수
- `auth()`를 사용하여 Clerk 사용자 ID 획득
- 미로그인 시 `/sign-in`으로 리다이렉트

### 재고 관리
- 장바구니 추가 시 재고 확인
- 주문 생성 시 재고 재확인 (동시성 문제 방지)
- 주문 생성 후 재고 자동 차감
- 재고 부족 시 명확한 에러 메시지

### 주문 생성 프로세스
1. 장바구니 아이템 조회
2. 재고 검증
3. order_items 생성 (상품 정보 스냅샷 저장)
4. orders 생성 (total_amount 계산)
5. 재고 차감
6. 장바구니 비우기
7. 에러 발생 시 롤백 (주문 및 order_items 삭제)

### 합계 검증
- 주문 생성 시 `total_amount` = `order_items` 합계 검증
- 불일치 시 경고 로그 출력

## 사용 방법

### 장바구니에 상품 추가
1. 상품 상세 페이지에서 "장바구니에 담기" 버튼 클릭
2. Navbar의 장바구니 아이콘 클릭하여 사이드바에서 확인

### 주문 생성
1. 장바구니 페이지 (`/cart`)에서 주문할 상품 확인
2. "주문하기" 버튼 클릭
3. 배송 정보 입력 (이름, 전화번호, 우편번호, 주소, 상세주소)
4. 주문 메모 입력 (선택사항)
5. "주문하기" 버튼 클릭
6. 주문 완료 페이지로 이동

## 데이터베이스 스키마

### cart_items 테이블
- `id`: UUID (Primary Key)
- `clerk_id`: TEXT (Clerk 사용자 ID)
- `product_id`: UUID (상품 ID, Foreign Key)
- `quantity`: INTEGER (수량)
- `created_at`, `updated_at`: TIMESTAMP
- UNIQUE(clerk_id, product_id) - 동일 상품 중복 방지

### orders 테이블
- `id`: UUID (Primary Key)
- `clerk_id`: TEXT (Clerk 사용자 ID)
- `total_amount`: DECIMAL(10,2) (주문 총액)
- `status`: TEXT (주문 상태: pending, confirmed, shipped, delivered, cancelled)
- `shipping_address`: JSONB (배송 주소)
- `order_note`: TEXT (주문 메모)
- `created_at`, `updated_at`: TIMESTAMP

### order_items 테이블
- `id`: UUID (Primary Key)
- `order_id`: UUID (주문 ID, Foreign Key)
- `product_id`: UUID (상품 ID, Foreign Key)
- `product_name`: TEXT (상품명 스냅샷)
- `quantity`: INTEGER (수량)
- `price`: DECIMAL(10,2) (가격 스냅샷)
- `created_at`: TIMESTAMP

## 주의사항

### 개발 환경
- RLS 비활성화 상태 (개발 환경)
- 프로덕션 배포 전 RLS 정책 설정 필요

### 트랜잭션 처리
- Supabase는 자동 트랜잭션 미지원
- 주문 생성 시 순차 실행 및 에러 발생 시 수동 롤백
- 또는 PostgreSQL 함수로 트랜잭션 처리 고려

### 재고 동시성
- 주문 생성 시 재고 재확인으로 동시성 문제 완화
- 더 정밀한 제어가 필요한 경우 PostgreSQL 트랜잭션 또는 락 사용 고려

## 다음 단계

Phase 4: 결제 통합 (Toss Payments 테스트 모드) 준비 완료

