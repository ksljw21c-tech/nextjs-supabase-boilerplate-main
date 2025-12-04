/**
 * @file integration-test/page.tsx
 * @description Clerk + Supabase 통합 테스트 페이지
 *
 * 이 페이지는 Clerk와 Supabase 통합이 올바르게 작동하는지 테스트합니다.
 *
 * 주요 기능:
 * 1. Client Component에서 Supabase 클라이언트 사용 테스트
 * 2. Server Component에서 Supabase 클라이언트 사용 테스트
 * 3. RLS 정책이 올바르게 작동하는지 확인
 *
 * @dependencies
 * - @clerk/nextjs: 인증 상태 확인
 * - @supabase/supabase-js: 데이터베이스 접근
 */

"use client";

import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { useUser, useSession } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function IntegrationTestPage() {
  const { user, isLoaded: userLoaded } = useUser();
  const { session, isLoaded: sessionLoaded } = useSession();
  const supabase = useClerkSupabaseClient();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTaskName, setNewTaskName] = useState("");

  useEffect(() => {
    if (!userLoaded || !sessionLoaded || !user) {
      setLoading(false);
      return;
    }

    async function loadTasks() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("tasks")
          .select("*")
          .order("created_at", { ascending: false });

        if (fetchError) {
          setError(fetchError.message);
          return;
        }

        if (data) {
          setTasks(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, [user, userLoaded, sessionLoaded, supabase]);

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();

    if (!newTaskName.trim()) return;

    try {
      setError(null);

      const { data, error: insertError } = await supabase
        .from("tasks")
        .insert({ name: newTaskName.trim() })
        .select()
        .single();

      if (insertError) {
        setError(insertError.message);
        return;
      }

      if (data) {
        setTasks([data, ...tasks]);
        setNewTaskName("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  async function handleDeleteTask(taskId: number) {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (deleteError) {
        setError(deleteError.message);
        return;
      }

      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  if (!userLoaded || !sessionLoaded) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">통합 테스트</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">통합 테스트</h1>
        <p className="text-red-500">로그인이 필요합니다.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Clerk + Supabase 통합 테스트</h1>

      {/* 사용자 정보 */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">사용자 정보</h2>
        <p>
          <strong>User ID:</strong> {user.id}
        </p>
        <p>
          <strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}
        </p>
        <p>
          <strong>Name:</strong> {user.fullName || "N/A"}
        </p>
        <p>
          <strong>Session:</strong> {session ? "Active" : "Inactive"}
        </p>
      </div>

      {/* 에러 표시 */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* 새 작업 추가 폼 */}
      <form onSubmit={handleCreateTask} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="새 작업 이름 입력"
            className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            추가
          </button>
        </div>
      </form>

      {/* 작업 목록 */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">작업 목록</h2>

        {loading ? (
          <p>Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">작업이 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{task.name}</p>
                  <p className="text-sm text-gray-500">
                    User ID: {task.user_id}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(task.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 테스트 안내 */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <h3 className="font-semibold mb-2">테스트 방법:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>다른 계정으로 로그인하여 작업을 추가해보세요</li>
          <li>각 사용자는 자신의 작업만 볼 수 있어야 합니다 (RLS 정책)</li>
          <li>다른 사용자의 작업을 삭제하려고 하면 에러가 발생해야 합니다</li>
        </ol>
      </div>
    </div>
  );
}

