"use client";

import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";
import { useMemo } from "react";

/**
 * Clerk + Supabase 네이티브 통합 클라이언트 (Client Component용)
 *
 * 2025년 4월부터 권장되는 방식:
 * - JWT 템플릿 불필요
 * - Clerk를 Supabase의 third-party auth provider로 설정
 * - useSession().getToken()으로 현재 세션 토큰 사용
 * - React Hook으로 제공되어 Client Component에서 사용
 *
 * @see https://clerk.com/docs/guides/development/integrations/databases/supabase
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
 * import { useEffect, useState } from 'react';
 *
 * export default function MyComponent() {
 *   const supabase = useClerkSupabaseClient();
 *   const [tasks, setTasks] = useState([]);
 *
 *   useEffect(() => {
 *     async function loadTasks() {
 *       const { data } = await supabase.from('tasks').select('*');
 *       if (data) setTasks(data);
 *     }
 *     loadTasks();
 *   }, [supabase]);
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function useClerkSupabaseClient() {
  const { session } = useSession();

  const supabase = useMemo(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    return createClient(supabaseUrl, supabaseKey, {
      async accessToken() {
        // Clerk 세션 토큰을 Supabase에 전달
        // Supabase가 이 토큰을 검증하고 auth.jwt()->>'sub'로 접근 가능
        return (await session?.getToken()) ?? null;
      },
    });
  }, [session]);

  return supabase;
}
