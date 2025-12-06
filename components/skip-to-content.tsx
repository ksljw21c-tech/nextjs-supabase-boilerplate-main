/**
 * @file components/skip-to-content.tsx
 * @description 스킵 투 콘텐츠 컴포넌트
 *
 * 키보드 사용자를 위한 접근성 기능
 * Tab 키를 누르면 나타나며 메인 콘텐츠로 바로 이동할 수 있습니다.
 */

"use client";

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 
                 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground 
                 focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
    >
      메인 콘텐츠로 건너뛰기
    </a>
  );
}

