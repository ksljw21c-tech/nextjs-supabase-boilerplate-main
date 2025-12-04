# Supabase + Next.js 설정 가이드

이 문서는 Supabase 공식 문서의 모범 사례를 기반으로 Next.js 프로젝트에 Supabase를 연결하는 방법을 설명합니다.

## 목차

1. [개요](#개요)
2. [환경 변수 설정](#환경-변수-설정)
3. [Supabase 클라이언트 사용](#supabase-클라이언트-사용)
4. [예제 페이지](#예제-페이지)
5. [참고 자료](#참고-자료)

## 개요

이 프로젝트는 Supabase 공식 문서의 Next.js Quickstart 패턴을 따르며, Clerk 인증과 통합되어 있습니다.

### 주요 특징

- ✅ Supabase 공식 문서 모범 사례 준수
- ✅ Server Component에서 `await createClient()` 패턴 사용
- ✅ Clerk와 Supabase 네이티브 통합
- ✅ TypeScript 완전 지원

## 환경 변수 설정

`.env` 또는 `.env.local` 파일에 다음 변수를 설정하세요:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### 환경 변수 확인 방법

1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인
2. 프로젝트 선택 → **Settings** → **API**
3. **Project URL**과 **anon public** 키 복사

## Supabase 클라이언트 사용

### Server Component에서 사용

Supabase 공식 문서 패턴을 따릅니다:

```tsx
import { createClient } from '@/lib/supabase/server';

export default async function MyPage() {
  // 공식 문서 패턴: await createClient()
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('table_name')
    .select('*');

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {data?.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### Server Action에서 사용

```ts
'use server';

import { createClient } from '@/lib/supabase/server';

export async function addItem(name: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('table_name')
    .insert({ name });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
```

### Client Component에서 사용

```tsx
'use client';

import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
import { useEffect, useState } from 'react';

export default function MyComponent() {
  const supabase = useClerkSupabaseClient();
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase
        .from('table_name')
        .select('*');
      if (data) setData(data);
    }
    loadData();
  }, [supabase]);

  return <div>...</div>;
}
```

## 예제 페이지

프로젝트에는 Supabase 공식 문서 예제를 기반으로 한 예제 페이지가 포함되어 있습니다:

### `/instruments` 페이지

Supabase 공식 문서의 Next.js Quickstart 예제를 구현한 페이지입니다.

**사용 방법:**

1. Supabase SQL Editor에서 다음 SQL 실행:

```sql
-- 테이블 생성
CREATE TABLE IF NOT EXISTS instruments (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL
);

-- 샘플 데이터 삽입
INSERT INTO instruments (name)
VALUES ('violin'), ('viola'), ('cello');

-- RLS 활성화
ALTER TABLE instruments ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책 생성
CREATE POLICY "public can read instruments"
ON public.instruments
FOR SELECT
TO anon
USING (true);
```

2. 브라우저에서 `/instruments` 접속

3. 데이터가 표시되는지 확인

### `/integration-test` 페이지

Clerk와 Supabase 통합을 테스트하는 페이지입니다.

- 작업 생성/조회/삭제 기능
- RLS 정책 테스트
- 에러 처리 확인

## 파일 구조

```
lib/
├── supabase/
│   ├── server.ts          # Server Component/Server Action용 (공식 문서 패턴)
│   ├── clerk-client.ts    # Client Component용
│   ├── service-role.ts    # 관리자 권한용 (RLS 우회)
│   └── client.ts          # 공개 데이터용 (인증 불필요)
└── supabase.ts            # 레거시 (사용 지양)

app/
├── instruments/           # Supabase 공식 문서 예제
│   └── page.tsx
└── integration-test/      # 통합 테스트 페이지
    └── page.tsx
```

## 주요 차이점: Clerk 통합

이 프로젝트는 Supabase 공식 문서와 달리 Clerk를 인증 제공자로 사용합니다:

### 공식 문서 방식 (Supabase Auth)
- `@supabase/ssr` 패키지 사용
- Cookie 기반 인증
- `supabase.auth` 사용

### 이 프로젝트 방식 (Clerk 통합)
- `@supabase/supabase-js` 직접 사용
- Clerk 토큰을 `accessToken` 옵션으로 전달
- `supabase.auth` 사용 불가 (third-party auth)

### 코드 비교

**공식 문서:**
```ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: { getAll, setAll }
  });
}
```

**이 프로젝트 (Clerk 통합):**
```ts
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

export async function createClient() {
  return createClient(url, key, {
    async accessToken() {
      return (await auth()).getToken();
    }
  });
}
```

## 문제 해결

### 문제: "No API key found" 에러

**원인**: 환경 변수가 설정되지 않음

**해결 방법**:
1. `.env.local` 파일 확인
2. `NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정 확인
3. 개발 서버 재시작

### 문제: "relation does not exist" 에러

**원인**: 테이블이 생성되지 않음

**해결 방법**:
1. Supabase Dashboard → SQL Editor로 이동
2. 테이블 생성 SQL 실행
3. RLS 정책 설정

### 문제: "permission denied" 에러

**원인**: RLS 정책이 올바르게 설정되지 않음

**해결 방법**:
1. RLS가 활성화되어 있는지 확인
2. 적절한 정책이 생성되어 있는지 확인
3. 개발 환경에서는 RLS를 비활성화할 수 있음 (프로덕션에서는 권장하지 않음)

## 참고 자료

- [Supabase Next.js Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Server-Side Auth](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Clerk + Supabase 통합 가이드](./CLERK_SUPABASE_INTEGRATION.md)

## 관련 파일

- `lib/supabase/server.ts`: Server Component용 클라이언트 (공식 문서 패턴)
- `lib/supabase/clerk-client.ts`: Client Component용 클라이언트
- `app/instruments/page.tsx`: Supabase 공식 문서 예제 페이지
- `app/integration-test/page.tsx`: 통합 테스트 페이지

