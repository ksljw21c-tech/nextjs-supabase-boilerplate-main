# Clerk + Supabase 통합 가이드

이 문서는 Clerk와 Supabase를 네이티브 통합하는 방법을 설명합니다. 2025년 4월 이후 권장되는 방식입니다.

## 목차

1. [개요](#개요)
2. [설정 단계](#설정-단계)
3. [코드 구현](#코드-구현)
4. [RLS 정책 설정](#rls-정책-설정)
5. [사용 예제](#사용-예제)
6. [문제 해결](#문제-해결)

## 개요

### 통합 방식

Clerk와 Supabase의 네이티브 통합은 다음과 같은 방식으로 작동합니다:

1. **Clerk가 사용자 인증 처리**: 로그인, 회원가입, 세션 관리
2. **Supabase가 Clerk 토큰 검증**: Clerk를 third-party auth provider로 설정
3. **RLS 정책으로 데이터 보호**: `auth.jwt()->>'sub'`로 Clerk user ID 확인

### 장점

- ✅ JWT 템플릿 불필요 (2025년 4월 이후 deprecated)
- ✅ Supabase JWT secret key를 Clerk와 공유할 필요 없음
- ✅ 각 요청마다 새 토큰을 가져올 필요 없음
- ✅ 더 간단하고 안전한 통합

## 설정 단계

### 1. Clerk Dashboard에서 Supabase 통합 활성화

1. [Clerk Dashboard](https://dashboard.clerk.com/)에 로그인
2. **Setup** → **Integrations** → **Supabase** 이동
3. **Activate Supabase integration** 클릭
4. **Clerk domain** 복사 (예: `your-app-12.clerk.accounts.dev`)
   - 이 도메인은 다음 단계에서 사용합니다

### 2. Supabase Dashboard에서 Clerk 인증 제공자 설정

1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인
2. 프로젝트 선택 → **Settings** → **Authentication** → **Providers**
3. 페이지 하단의 **Third-Party Auth** 섹션으로 스크롤
4. **Add provider** 클릭
5. **Clerk** 선택
6. 1단계에서 복사한 **Clerk domain** 붙여넣기
7. **Save** 클릭

### 3. 환경 변수 확인

`.env` 파일에 다음 변수들이 설정되어 있는지 확인:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

## 코드 구현

프로젝트에는 이미 통합이 구현되어 있습니다:

### Client Component용

```typescript
// lib/supabase/clerk-client.ts
import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';

export default function MyComponent() {
  const supabase = useClerkSupabaseClient();
  // ...
}
```

### Server Component용

```typescript
// lib/supabase/server.ts
import { createClerkSupabaseClient } from '@/lib/supabase/server';

export default async function MyPage() {
  const supabase = createClerkSupabaseClient();
  // ...
}
```

## RLS 정책 설정

### 기본 원칙

RLS 정책에서 Clerk user ID를 확인하려면 `auth.jwt()->>'sub'`를 사용합니다:

```sql
-- 예시: 사용자가 자신의 데이터만 조회
CREATE POLICY "Users can view their own tasks"
ON "public"."tasks"
FOR SELECT
TO authenticated
USING (
  ((select auth.jwt()->>'sub') = (user_id)::text)
);
```

### 예제: Tasks 테이블

```sql
-- 1. 테이블 생성
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  user_id TEXT NOT NULL DEFAULT auth.jwt()->>'sub',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. RLS 활성화
ALTER TABLE "tasks" ENABLE ROW LEVEL SECURITY;

-- 3. SELECT 정책 (조회)
CREATE POLICY "User can view their own tasks"
ON "public"."tasks"
FOR SELECT
TO authenticated
USING (
  ((select auth.jwt()->>'sub') = (user_id)::text)
);

-- 4. INSERT 정책 (생성)
CREATE POLICY "Users must insert their own tasks"
ON "public"."tasks"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
  ((select auth.jwt()->>'sub') = (user_id)::text)
);

-- 5. UPDATE 정책 (수정)
CREATE POLICY "Users can update their own tasks"
ON "public"."tasks"
FOR UPDATE
TO authenticated
USING (
  ((select auth.jwt()->>'sub') = (user_id)::text)
)
WITH CHECK (
  ((select auth.jwt()->>'sub') = (user_id)::text)
);

-- 6. DELETE 정책 (삭제)
CREATE POLICY "Users can delete their own tasks"
ON "public"."tasks"
FOR DELETE
TO authenticated
USING (
  ((select auth.jwt()->>'sub') = (user_id)::text)
);
```

### 개발 환경에서 RLS 비활성화

개발 중에는 RLS를 비활성화할 수 있습니다:

```sql
ALTER TABLE "tasks" DISABLE ROW LEVEL SECURITY;
```

⚠️ **주의**: 프로덕션에서는 반드시 RLS를 활성화하고 적절한 정책을 설정하세요.

## 사용 예제

### Client Component 예제

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
import { useUser } from '@clerk/nextjs';

export default function TasksPage() {
  const supabase = useClerkSupabaseClient();
  const { user } = useUser();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function loadTasks() {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setTasks(data);
      }
      setLoading(false);
    }

    loadTasks();
  }, [user, supabase]);

  async function createTask(name: string) {
    const { data, error } = await supabase
      .from('tasks')
      .insert({ name });

    if (!error && data) {
      setTasks([...tasks, ...data]);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>My Tasks</h1>
      {tasks.map(task => (
        <div key={task.id}>{task.name}</div>
      ))}
    </div>
  );
}
```

### Server Component 예제

```tsx
import { createClerkSupabaseClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function TasksPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const supabase = createClerkSupabaseClient();
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>My Tasks</h1>
      {tasks?.map(task => (
        <div key={task.id}>{task.name}</div>
      ))}
    </div>
  );
}
```

### Server Action 예제

```ts
'use server';

import { createClerkSupabaseClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';

export async function addTask(name: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const supabase = createClerkSupabaseClient();

  const { data, error } = await supabase
    .from('tasks')
    .insert({ name });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
```

## 문제 해결

### 문제: "Unauthorized" 또는 "Invalid token" 에러

**원인**: Clerk와 Supabase 통합이 제대로 설정되지 않음

**해결 방법**:
1. Clerk Dashboard에서 Supabase 통합이 활성화되어 있는지 확인
2. Supabase Dashboard에서 Clerk domain이 올바르게 설정되어 있는지 확인
3. 환경 변수가 올바르게 설정되어 있는지 확인

### 문제: RLS 정책이 작동하지 않음

**원인**: RLS 정책이 올바르게 설정되지 않았거나, `user_id` 컬럼이 없음

**해결 방법**:
1. 테이블에 `user_id` 컬럼이 있는지 확인
2. RLS가 활성화되어 있는지 확인: `SELECT * FROM pg_tables WHERE tablename = 'your_table';`
3. 정책이 올바르게 생성되어 있는지 확인: `SELECT * FROM pg_policies WHERE tablename = 'your_table';`

### 문제: Client Component에서 토큰을 가져올 수 없음

**원인**: `useSession()`이 로드되기 전에 클라이언트를 생성하려고 함

**해결 방법**:
- `useSession()`의 `isLoaded` 상태를 확인하고, 로드된 후에만 클라이언트 사용

```tsx
const { session, isLoaded } = useSession();

if (!isLoaded) {
  return <div>Loading...</div>;
}
```

## 참고 자료

- [Clerk 공식 문서: Supabase 통합](https://clerk.com/docs/guides/development/integrations/databases/supabase)
- [Supabase 공식 문서: Third-Party Auth](https://supabase.com/docs/guides/auth/third-party/overview)
- [Supabase 공식 문서: Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 테스트 페이지

프로젝트에는 통합 테스트 페이지가 포함되어 있습니다:

- **`/integration-test`**: Clerk + Supabase 통합 종합 테스트
  - Client Component에서 Supabase 클라이언트 사용
  - 작업 생성/조회/삭제 기능
  - RLS 정책 테스트
  - 에러 처리 확인

테스트 방법:
1. 개발 서버 실행: `pnpm dev`
2. 브라우저에서 `/integration-test` 접속
3. 로그인 후 작업을 생성하고 조회해보세요
4. 다른 계정으로 로그인하여 RLS 정책이 올바르게 작동하는지 확인

## 관련 파일

- `lib/supabase/clerk-client.ts`: Client Component용 클라이언트
- `lib/supabase/server.ts`: Server Component/Server Action용 클라이언트
- `lib/supabase/service-role.ts`: 관리자 권한 클라이언트 (RLS 우회)
- `lib/supabase/client.ts`: 공개 데이터용 클라이언트 (인증 불필요)
- `app/integration-test/page.tsx`: 통합 테스트 페이지
- `supabase/migrations/20250101000000_create_tasks_table.sql`: 테스트용 tasks 테이블

