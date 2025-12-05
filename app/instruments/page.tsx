/**
 * @file instruments/page.tsx
 * @description Supabase 공식 문서 예제: Instruments 페이지
 *
 * 이 페이지는 Supabase 공식 문서의 Next.js Quickstart 예제를 기반으로 합니다.
 * Clerk와 Supabase 통합을 사용하여 데이터를 조회합니다.
 *
 * @see https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 *
 * @dependencies
 * - @supabase/supabase-js: 데이터베이스 접근
 * - @clerk/nextjs: 인증 상태 확인
 */

import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

async function InstrumentsData() {
  // Supabase 공식 문서 패턴: await createClient()
  const supabase = await createClient();
  const { data: instruments, error } = await supabase
    .from("instruments")
    .select()
    .order("id", { ascending: true });

  if (error) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded">
        <p className="font-semibold">Error:</p>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!instruments || instruments.length === 0) {
    return (
      <div className="p-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 text-yellow-700 dark:text-yellow-200 rounded">
        <p>No instruments found. Please create the table and insert data first.</p>
        <p className="mt-2 text-sm">
          Run this SQL in your Supabase SQL Editor:
        </p>
        <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-x-auto">
          {`-- Create the table
CREATE TABLE IF NOT EXISTS instruments (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL
);

-- Insert sample data
INSERT INTO instruments (name)
VALUES ('violin'), ('viola'), ('cello');

-- Enable RLS
ALTER TABLE instruments ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "public can read instruments"
ON public.instruments
FOR SELECT
TO anon
USING (true);`}
        </pre>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Instruments</h2>
      <ul className="space-y-2">
        {instruments.map((instrument: any) => (
          <li
            key={instrument.id}
            className="p-4 bg-white dark:bg-gray-800 border rounded-lg"
          >
            <p className="font-medium">{instrument.name}</p>
            <p className="text-sm text-gray-500">ID: {instrument.id}</p>
          </li>
        ))}
      </ul>
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <p className="text-sm">
          <strong>Note:</strong> This page follows the Supabase official documentation
          pattern. Data is fetched server-side using{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
            await createClient()
          </code>
          .
        </p>
      </div>
    </div>
  );
}

export default async function Instruments() {
  // 인증 확인 (선택사항 - 필요시 주석 해제)
  // const { userId } = await auth();
  // if (!userId) {
  //   redirect('/sign-in');
  // }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">
        Supabase Quickstart Example
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        This page demonstrates the Supabase official Next.js quickstart pattern
        integrated with Clerk authentication.
      </p>

      <Suspense fallback={<div>Loading instruments...</div>}>
        <InstrumentsData />
      </Suspense>
    </div>
  );
}

