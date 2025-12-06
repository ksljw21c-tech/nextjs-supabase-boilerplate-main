/**
 * @file eslint.config.mjs
 * @description ESLint 설정 파일
 *
 * Next.js 15 + TypeScript 프로젝트를 위한 ESLint 설정
 * Flat Config 형식 사용 (ESLint 9.x)
 */

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Next.js 권장 설정
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 커스텀 규칙
  {
    rules: {
      // TypeScript
      "@typescript-eslint/no-explicit-any": "warn", // any 사용 경고
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // React
      "react/no-unescaped-entities": "off", // JSX에서 ' 사용 허용
      "react-hooks/exhaustive-deps": "warn",

      // Import
      "import/order": "off", // 자동 정렬은 Prettier에 맡김

      // 접근성
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-is-valid": "warn",

      // 일반
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "warn",
    },
  },

  // 특정 파일/폴더 무시
  {
    ignores: [
      "node_modules/",
      ".next/",
      "out/",
      "build/",
      "public/",
      "*.config.js",
      "*.config.mjs",
    ],
  },
];

export default eslintConfig;
