/**
 * @deprecated 이 파일은 레거시입니다.
 * 
 * 새로운 코드에서는 다음을 사용하세요:
 * - Server Component/Server Action: `import { createClient } from '@/lib/supabase/server'`
 * - Client Component: `import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client'`
 * 
 * 이 파일은 하위 호환성을 위해 유지되지만, 사용을 권장하지 않습니다.
 */

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

/**
 * @deprecated `createClient()` from '@/lib/supabase/server'를 사용하세요.
 */
export const createSupabaseClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      async accessToken() {
        return (await auth()).getToken();
      },
    }
  );
};
