-- Tasks 테이블 생성
-- Clerk + Supabase 통합 테스트용 테이블
-- RLS 정책으로 사용자가 자신의 작업만 접근할 수 있도록 설정

CREATE TABLE IF NOT EXISTS public.tasks (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    user_id TEXT NOT NULL DEFAULT auth.jwt()->>'sub',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 테이블 소유자 설정
ALTER TABLE public.tasks OWNER TO postgres;

-- Row Level Security (RLS) 비활성화 (개발 환경)
-- 프로덕션에서는 활성화하고 정책을 설정해야 합니다
ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.tasks TO anon;
GRANT ALL ON TABLE public.tasks TO authenticated;
GRANT ALL ON TABLE public.tasks TO service_role;

-- 프로덕션용 RLS 정책 (주석 처리됨 - 필요시 활성화)
/*
-- RLS 활성화
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- SELECT 정책: 사용자는 자신의 작업만 조회 가능
CREATE POLICY "User can view their own tasks"
ON public.tasks
FOR SELECT
TO authenticated
USING (
    ((select auth.jwt()->>'sub') = (user_id)::text)
);

-- INSERT 정책: 사용자는 자신의 작업만 생성 가능
CREATE POLICY "Users must insert their own tasks"
ON public.tasks
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
    ((select auth.jwt()->>'sub') = (user_id)::text)
);

-- UPDATE 정책: 사용자는 자신의 작업만 수정 가능
CREATE POLICY "Users can update their own tasks"
ON public.tasks
FOR UPDATE
TO authenticated
USING (
    ((select auth.jwt()->>'sub') = (user_id)::text)
)
WITH CHECK (
    ((select auth.jwt()->>'sub') = (user_id)::text)
);

-- DELETE 정책: 사용자는 자신의 작업만 삭제 가능
CREATE POLICY "Users can delete their own tasks"
ON public.tasks
FOR DELETE
TO authenticated
USING (
    ((select auth.jwt()->>'sub') = (user_id)::text)
);
*/

