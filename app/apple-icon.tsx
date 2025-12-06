/**
 * @file app/apple-icon.tsx
 * @description Apple Touch Icon 생성
 *
 * iOS 홈 화면에 앱을 추가할 때 표시되는 아이콘입니다.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons
 */

import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          borderRadius: 36,
        }}
      >
        <div
          style={{
            fontSize: 100,
          }}
        >
          🛍️
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

