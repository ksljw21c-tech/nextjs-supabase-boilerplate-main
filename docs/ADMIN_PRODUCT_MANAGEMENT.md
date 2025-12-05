# 어드민 상품 관리 가이드

이 문서는 Supabase 대시보드를 사용하여 상품을 등록, 수정, 삭제하는 방법을 안내합니다.

## 목차

1. [Supabase 대시보드 접속](#supabase-대시보드-접속)
2. [Table Editor를 통한 상품 관리](#table-editor를-통한-상품-관리)
3. [SQL Editor를 통한 상품 관리](#sql-editor를-통한-상품-관리)
4. [주의사항 및 베스트 프랙티스](#주의사항-및-베스트-프랙티스)

---

## Supabase 대시보드 접속

1. [Supabase Dashboard](https://supabase.com/dashboard)에 접속합니다.
2. 프로젝트를 선택합니다.
3. 좌측 메뉴에서 **Table Editor** 또는 **SQL Editor**를 선택합니다.

---

## Table Editor를 통한 상품 관리

### 상품 추가 (INSERT)

1. 좌측 메뉴에서 **Table Editor**를 클릭합니다.
2. `products` 테이블을 선택합니다.
3. 상단의 **Insert** 버튼을 클릭합니다.
4. 다음 필드를 입력합니다:

   | 필드 | 타입 | 필수 | 설명 |
   |------|------|------|------|
   | `name` | TEXT | ✅ | 상품명 |
   | `description` | TEXT | ❌ | 상품 설명 |
   | `price` | DECIMAL(10,2) | ✅ | 가격 (0 이상) |
   | `category` | TEXT | ❌ | 카테고리 (electronics, clothing, books, food, sports, beauty, home) |
   | `stock_quantity` | INTEGER | ❌ | 재고 수량 (기본값: 0) |
   | `is_active` | BOOLEAN | ❌ | 판매 활성화 여부 (기본값: true) |

5. **Save** 버튼을 클릭하여 저장합니다.

**예시:**

```
name: "무선 블루투스 이어폰"
description: "고음질 노이즈 캔슬링 기능, 30시간 재생"
price: 89000
category: "electronics"
stock_quantity: 150
is_active: true
```

### 상품 수정 (UPDATE)

1. `products` 테이블에서 수정할 상품의 행을 클릭합니다.
2. 수정할 필드를 변경합니다.
3. **Save** 버튼을 클릭하여 저장합니다.

**참고:** `id`, `created_at`, `updated_at` 필드는 자동으로 관리되므로 수정하지 마세요.

### 상품 삭제 (DELETE 또는 비활성화)

#### 방법 1: 비활성화 (권장)

상품을 완전히 삭제하는 대신 `is_active`를 `false`로 설정하여 비활성화합니다.

1. 해당 상품 행을 클릭합니다.
2. `is_active` 필드를 `false`로 변경합니다.
3. **Save** 버튼을 클릭합니다.

이 방법의 장점:
- 데이터가 보존되어 나중에 복구 가능
- 주문 내역과의 연관성 유지
- 실수로 삭제한 경우 복구 가능

#### 방법 2: 완전 삭제

1. 해당 상품 행을 클릭합니다.
2. 상단의 **Delete** 버튼을 클릭합니다.
3. 확인 대화상자에서 **Confirm**을 클릭합니다.

**⚠️ 주의:** 완전 삭제는 되돌릴 수 없습니다. 주문 내역과의 연관성도 깨질 수 있습니다.

---

## SQL Editor를 통한 상품 관리

SQL Editor를 사용하면 더 복잡한 작업을 수행할 수 있습니다.

### 상품 추가 (INSERT)

```sql
-- 단일 상품 추가
INSERT INTO products (name, description, price, category, stock_quantity, is_active)
VALUES (
  '무선 블루투스 이어폰',
  '고음질 노이즈 캔슬링 기능, 30시간 재생',
  89000,
  'electronics',
  150,
  true
);

-- 여러 상품 한 번에 추가
INSERT INTO products (name, description, price, category, stock_quantity) VALUES
  ('스마트워치 프로', '건강 모니터링 및 운동 추적 기능', 320000, 'electronics', 80),
  ('휴대용 보조배터리 20000mAh', '고속 충전 지원, 3개 포트', 45000, 'electronics', 200);
```

### 상품 수정 (UPDATE)

```sql
-- 특정 상품의 가격 수정
UPDATE products
SET price = 85000, updated_at = now()
WHERE id = '상품-UUID';

-- 카테고리별 가격 할인 (예: 전자제품 10% 할인)
UPDATE products
SET price = price * 0.9, updated_at = now()
WHERE category = 'electronics';

-- 재고 수량 업데이트
UPDATE products
SET stock_quantity = 200, updated_at = now()
WHERE id = '상품-UUID';
```

### 상품 비활성화 (SOFT DELETE)

```sql
-- 특정 상품 비활성화
UPDATE products
SET is_active = false, updated_at = now()
WHERE id = '상품-UUID';

-- 재고가 없는 모든 상품 비활성화
UPDATE products
SET is_active = false, updated_at = now()
WHERE stock_quantity = 0;
```

### 상품 삭제 (HARD DELETE)

```sql
-- 특정 상품 완전 삭제
DELETE FROM products
WHERE id = '상품-UUID';

-- 비활성화된 상품 모두 삭제 (주의!)
DELETE FROM products
WHERE is_active = false;
```

### 상품 조회 (SELECT)

```sql
-- 모든 활성화된 상품 조회
SELECT * FROM products
WHERE is_active = true
ORDER BY created_at DESC;

-- 특정 카테고리의 상품 조회
SELECT * FROM products
WHERE category = 'electronics' AND is_active = true;

-- 재고가 부족한 상품 조회 (10개 미만)
SELECT * FROM products
WHERE stock_quantity < 10 AND is_active = true;

-- 가격 범위로 상품 조회
SELECT * FROM products
WHERE price BETWEEN 10000 AND 100000
  AND is_active = true
ORDER BY price ASC;
```

---

## 주의사항 및 베스트 프랙티스

### 1. 데이터 무결성

- **필수 필드 확인**: `name`, `price`는 반드시 입력해야 합니다.
- **가격 검증**: `price`는 0 이상이어야 합니다 (CHECK 제약조건).
- **재고 검증**: `stock_quantity`는 0 이상이어야 합니다.

### 2. 카테고리 관리

현재 지원되는 카테고리:
- `electronics` (전자제품)
- `clothing` (의류)
- `books` (도서)
- `food` (식품)
- `sports` (스포츠)
- `beauty` (뷰티)
- `home` (생활용품)

새로운 카테고리를 추가할 때는 애플리케이션 코드의 카테고리 맵핑도 업데이트해야 합니다.

### 3. 삭제 vs 비활성화

- **비활성화 권장**: `is_active = false`로 설정하여 데이터를 보존합니다.
- **완전 삭제는 신중하게**: 주문 내역과의 연관성이 깨질 수 있습니다.

### 4. 대량 작업

대량의 상품을 추가하거나 수정할 때는:
1. SQL Editor를 사용하여 배치 작업 수행
2. 트랜잭션을 사용하여 원자성 보장
3. 작업 전 백업 확인

**예시: 대량 업데이트**

```sql
BEGIN;

-- 여러 상품의 재고 수량 업데이트
UPDATE products
SET stock_quantity = stock_quantity + 50, updated_at = now()
WHERE category = 'electronics' AND is_active = true;

-- 문제가 없으면 커밋
COMMIT;

-- 문제가 있으면 롤백
-- ROLLBACK;
```

### 5. 성능 최적화

- **인덱스 활용**: `category`, `is_active` 필드에 인덱스가 생성되어 있습니다.
- **필터링**: `is_active = true` 조건을 항상 포함하여 활성화된 상품만 조회합니다.

### 6. 데이터 백업

중요한 작업 전에는:
1. Supabase Dashboard → Database → Backups에서 백업 확인
2. 또는 SQL Editor에서 데이터를 CSV로 내보내기

---

## 문제 해결

### 상품이 목록에 표시되지 않을 때

1. `is_active`가 `true`인지 확인
2. `stock_quantity`가 0 이상인지 확인
3. 브라우저 캐시를 지우고 새로고침

### 가격이 올바르게 표시되지 않을 때

1. `price` 필드가 DECIMAL(10,2) 형식인지 확인
2. 소수점 이하 자릿수가 2자리를 넘지 않는지 확인

### 카테고리가 표시되지 않을 때

1. 카테고리 값이 지원되는 목록에 있는지 확인
2. 애플리케이션 코드의 카테고리 맵핑 확인

---

## 추가 리소스

- [Supabase Table Editor 문서](https://supabase.com/docs/guides/database/tables)
- [Supabase SQL Editor 문서](https://supabase.com/docs/guides/database/overview#sql-editor)
- [PostgreSQL 데이터 타입](https://www.postgresql.org/docs/current/datatype.html)

---

## 문의

상품 관리와 관련된 문제가 발생하면 프로젝트 관리자에게 문의하세요.

