import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

/**
 * Clerk + Supabase 네이티브 통합 클라이언트 (Server Component/Server Action용)
 *
 * Supabase 공식 문서 모범 사례를 따르며, Clerk와 통합된 버전입니다.
 * 
 * 2025년 4월부터 권장되는 방식:
 * - JWT 템플릿 불필요
 * - Clerk를 Supabase의 third-party auth provider로 설정
 * - Clerk 토큰을 Supabase가 자동 검증
 * - auth().getToken()으로 현재 세션 토큰 사용
 *
 * @see https://clerk.com/docs/guides/development/integrations/databases/supabase
 * @see https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 *
 * @example
 * ```tsx
 * // Server Component (Supabase 공식 문서 패턴)
 * import { createClient } from '@/lib/supabase/server';
 *
 * export default async function MyPage() {
 *   const supabase = await createClient();
 *   const { data } = await supabase.from('tasks').select('*');
 *   return <div>{data?.map(task => <p key={task.id}>{task.name}</p>)}</div>;
 * }
 * ```
 *
 * @example
 * ```ts
 * // Server Action
 * 'use server';
 *
 * import { createClient } from '@/lib/supabase/server';
 *
 * export async function addTask(name: string) {
 *   const supabase = await createClient();
 *   const { data, error } = await supabase
 *     .from('tasks')
 *     .insert({ name });
 *   return { data, error };
 * }
 * ```
 */
export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    async accessToken() {
      // Clerk 세션 토큰을 Supabase에 전달
      // Supabase가 이 토큰을 검증하고 auth.jwt()->>'sub'로 접근 가능
      return (await auth()).getToken();
    },
  });
}

/**
 * @deprecated 이 함수는 레거시입니다. `createClient()`를 사용하세요.
 * 
 * 호환성을 위해 유지되지만, 새로운 코드에서는 `createClient()`를 사용하는 것을 권장합니다.
 */
export function createClerkSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    async accessToken() {
      return (await auth()).getToken();
    },
  });
}
