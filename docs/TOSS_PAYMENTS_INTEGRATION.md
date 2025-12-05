# Toss Payments 결제 통합 가이드

## 개요

이 프로젝트는 Toss Payments의 결제 위젯 SDK를 사용하여 안전하고 사용자 친화적인 결제 경험을 제공합니다. 테스트 모드로 구현되어 있어 실제 결제가 발생하지 않습니다.

## 구현된 기능

### ✅ 결제위젯 연동 및 클라이언트 플로우 구축
- Toss Payments SDK 통합
- 결제 위젯 컴포넌트 구현
- 결제 방법 선택 (카드, 가상계좌, 계좌이체 등)
- 이용약관 동의 UI

### ✅ 결제 성공/실패 콜백 처리
- 결제 성공 콜백 API (`/api/payments/success`)
- 결제 실패 콜백 API (`/api/payments/fail`)
- 데이터베이스 결제 상태 업데이트

### ✅ 결제 완료 후 주문 상태 업데이트
- 결제 성공 시 주문 상태를 "confirmed"로 변경
- 결제 실패 시 결제 상태를 "canceled"로 변경
- 실시간 상태 동기화

## 파일 구조

### 타입 정의
- `types/payment.ts` - 결제 관련 TypeScript 타입

### 유틸리티 함수
- `lib/utils/payment.ts` - 결제 관련 유틸리티 함수

### 데이터베이스
- `supabase/migrations/20250102000000_add_payments_table.sql` - 결제 테이블 생성
- `lib/supabase/queries/payments.ts` - 결제 데이터베이스 쿼리 함수

### Server Actions
- `actions/payments.ts` - Toss Payments API 호출 함수

### UI 컴포넌트
- `components/payment-widget.tsx` - 결제 위젯 컴포넌트

### API 라우트
- `app/api/payments/success/route.ts` - 결제 성공 콜백
- `app/api/payments/fail/route.ts` - 결제 실패 콜백

### 페이지
- `app/checkout/page.tsx` - 결제 페이지 (업데이트됨)

## 데이터베이스 스키마

### payments 테이블

```sql
CREATE TABLE public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    clerk_id TEXT NOT NULL,
    payment_key TEXT UNIQUE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    status TEXT NOT NULL DEFAULT 'ready'
        CHECK (status IN ('ready', 'in_progress', 'waiting_for_deposit', 'done', 'canceled', 'partial_canceled', 'expired', 'aborted')),
    payment_method TEXT,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    cancel_reason TEXT,
    cancel_amount DECIMAL(10,2),
    last_transaction_key TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,

    UNIQUE(order_id)
);
```

## 환경 변수 설정

### 테스트 모드 (권장)

```env
# Toss Payments (Test Mode)
NEXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY=tosspayments_test_gck_docs_Ovk5rk1EwkEbPqw8g6G33m66
TOSSPAYMENTS_SECRET_KEY=tosspayments_test_sk_zXLkKEypNnjOJJm7BL4lzmw27QRB
```

### 프로덕션 모드

프로덕션에서는 Toss Payments 관리자 콘솔에서 발급받은 실제 키를 사용하세요:

```env
NEXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY=your_production_client_key
TOSSPAYMENTS_SECRET_KEY=your_production_secret_key
```

## 결제 플로우

### 1. 결제 준비
1. 사용자가 장바구니에서 "주문하기" 버튼 클릭
2. `app/checkout/page.tsx`에서 주문 ID 생성 및 결제 위젯 렌더링
3. `components/payment-widget.tsx`에서 Toss Payments 위젯 로드

### 2. 결제 진행
1. 사용자가 결제 방법 선택 및 정보 입력
2. Toss Payments SDK에서 결제 요청
3. Toss Payments에서 결제 처리

### 3. 결제 완료
1. 성공 시: `/api/payments/success` 콜백 호출
2. 실패 시: `/api/payments/fail` 콜백 호출

### 4. 상태 업데이트
1. 결제 정보 데이터베이스에 저장
2. 주문 상태를 "confirmed" 또는 "canceled"로 업데이트
3. 사용자에게 결과 페이지 표시

## 테스트 방법

### 테스트 카드 정보

Toss Payments 테스트 모드에서 사용할 수 있는 테스트 카드:

- **카드 번호**: `4333-1234-5678-9012`
- **유효기간**: `12/25`
- **CVC**: `123`
- **카드 비밀번호**: `12`

### 테스트 절차

1. **환경 변수 설정**:
   ```bash
   cp .env.example .env
   # .env 파일에 테스트 키가 설정되어 있는지 확인
   ```

2. **데이터베이스 설정**:
   ```sql
   -- Supabase SQL Editor에서 실행
   -- payments 테이블 생성
   ```

3. **결제 테스트**:
   - 상품을 장바구니에 담기
   - `/checkout` 페이지로 이동
   - 테스트 카드 정보로 결제 진행
   - 결제 성공/실패 시나리오 확인

## API 엔드포인트

### POST 결제 승인 (내부용)
- **엔드포인트**: Toss Payments API
- **용도**: 결제 승인 요청
- **매개변수**: `paymentKey`, `orderId`, `amount`

### GET /api/payments/success
- **용도**: 결제 성공 콜백 처리
- **쿼리 파라미터**: `orderId`, `paymentKey`, `amount`
- **동작**: 결제 정보 저장 및 주문 상태 업데이트

### GET /api/payments/fail
- **용도**: 결제 실패 콜백 처리
- **쿼리 파라미터**: `paymentKey`, `code`, `message`
- **동작**: 결제 상태를 취소로 업데이트

## 에러 처리

### 클라이언트 사이드 에러
- 결제 위젯 로드 실패
- 결제 요청 실패
- 네트워크 오류

### 서버 사이드 에러
- 결제 승인 실패
- 데이터베이스 업데이트 실패
- 주문 상태 업데이트 실패

## 보안 고려사항

### 테스트 모드
- 실제 결제가 발생하지 않음
- 테스트 키만 사용 가능
- 프로덕션 키로는 작동하지 않음

### 프로덕션 모드
- 실제 결제 발생
- 프로덕션 키만 사용 가능
- HTTPS 필수
- 결제 키 안전하게 관리

## 결제 상태 관리

### 결제 상태 종류
- `ready`: 결제 준비
- `in_progress`: 결제 진행 중
- `waiting_for_deposit`: 입금 대기
- `done`: 결제 완료
- `canceled`: 결제 취소
- `partial_canceled`: 부분 취소
- `expired`: 결제 만료
- `aborted`: 결제 중단

### 주문 상태 연동
- 결제 성공 (`done`) → 주문 상태 `confirmed`
- 결제 취소 (`canceled`) → 주문 상태 `cancelled`

## 다음 단계

### Phase 5: 결제 완료 페이지 개선
- 결제 완료/실패 페이지 디자인 개선
- 결제 영수증 표시
- 주문 상세 정보 표시

### Phase 6: 결제 취소 기능
- 사용자 결제 취소 요청
- 부분 취소 지원
- 환불 처리

### Phase 7: 결제 내역 관리
- 결제 내역 조회 페이지
- 결제 취소/환불 신청
- 결제 영수증 다운로드

## 참고 자료

- [Toss Payments 개발자 문서](https://docs.tosspayments.com/)
- [Toss Payments 결제 위젯 SDK](https://docs.tosspayments.com/reference/widget-sdk)
- [Toss Payments API 레퍼런스](https://docs.tosspayments.com/reference)
