-- ==========================================
-- Toss Payments 결제 테이블 추가
-- ==========================================

-- 결제 정보 테이블 생성
CREATE TABLE IF NOT EXISTS public.payments (
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

    -- 동일 주문에 대해 하나의 결제만 허용
    UNIQUE(order_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_clerk_id ON payments(clerk_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_key ON payments(payment_key);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- updated_at 자동 갱신 트리거
CREATE TRIGGER set_updated_at_payments
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS 비활성화 (개발 환경용)
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.payments TO anon, authenticated, service_role;

-- 샘플 데이터 (개발용 - 실제 서비스에서는 필요 없음)
-- 실제 결제 데이터는 Toss Payments API를 통해 생성됨
