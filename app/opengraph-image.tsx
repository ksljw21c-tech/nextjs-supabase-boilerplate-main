/**
 * @file app/opengraph-image.tsx
 * @description 동적 Open Graph 이미지 생성
 *
 * Next.js의 ImageResponse를 사용하여 동적으로 OG 이미지를 생성합니다.
 * 소셜 미디어 공유 시 표시되는 이미지입니다.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
 */

import { ImageResponse } from "next/og";

// 이미지 메타데이터
export const alt = "의류 쇼핑몰 - Next.js + Clerk + Supabase";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          backgroundImage:
            "linear-gradient(to bottom right, #0f172a, #1e293b)",
        }}
      >
        {/* 로고 아이콘 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              backgroundColor: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
            }}
          >
            🛍️
          </div>
        </div>

        {/* 타이틀 */}
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: "bold",
            color: "white",
            marginBottom: 16,
          }}
        >
          의류 쇼핑몰
        </div>

        {/* 서브타이틀 */}
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#94a3b8",
          }}
        >
          Next.js 15 + Clerk + Supabase + Toss Payments
        </div>

        {/* 하단 배지 */}
        <div
          style={{
            display: "flex",
            marginTop: 48,
            gap: 16,
          }}
        >
          {["React 19", "TypeScript", "Tailwind CSS"].map((tech) => (
            <div
              key={tech}
              style={{
                display: "flex",
                padding: "8px 16px",
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                borderRadius: 8,
                color: "#60a5fa",
                fontSize: 20,
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

