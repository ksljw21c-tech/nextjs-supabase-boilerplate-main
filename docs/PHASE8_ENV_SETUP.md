# Phase 8: 환경/리포지토리 기초 세팅

이 문서는 환경 및 리포지토리 기초 세팅 내용을 정리합니다.

## 구현 완료된 작업

### 1. `.gitignore` / `.cursorignore` 정비

#### `.gitignore` 업데이트
- 의존성 파일 (node_modules, pnpm-lock.yaml)
- Next.js 빌드 파일 (.next/, out/)
- 환경변수 파일 (.env*)
- IDE 설정 파일 (.vscode/, .idea/)
- OS 파일 (.DS_Store, Thumbs.db)
- 디버그 로그 파일
- Vercel, Clerk, Supabase 관련 파일
- Playwright 테스트 결과

#### `.cursorignore` 업데이트
- Cursor AI가 무시할 파일/폴더 정의
- 빌드 결과물, 의존성, 생성된 파일 등

### 2. `eslint.config.mjs` / 포맷터 설정

#### ESLint 설정 (Flat Config)
- Next.js 권장 설정 적용
- TypeScript 규칙 (any 사용 경고, 미사용 변수 경고)
- React 규칙 (hooks 의존성 경고)
- 접근성 규칙 (alt-text, anchor 경고)
- 콘솔 사용 경고 (warn, error만 허용)

#### Prettier 설정
- `.prettierrc`: 코드 스타일 설정
- `.prettierignore`: 포맷팅 제외 파일

### 3. 아이콘/OG 이미지/파비콘 추가

#### 기존 파일 (public/)
- `favicon.ico` (app/)
- `logo.png`
- `og-image.png`
- `icons/` (PWA 아이콘들: 192, 256, 384, 512)

#### 새로 추가된 파일
- `app/opengraph-image.tsx`: 동적 OG 이미지 생성
- `app/apple-icon.tsx`: Apple Touch Icon 생성

### 4. SEO 관련 파일

#### `app/robots.ts`
검색 엔진 크롤러 접근 제어:
- 허용: 홈페이지, 상품 페이지
- 차단: API, 테스트 페이지, 개인 정보 페이지

#### `app/sitemap.ts`
사이트맵 생성:
- 정적 페이지 자동 등록
- 동적 상품 페이지 추가 가능 (TODO)

#### `app/manifest.ts`
PWA 매니페스트:
- 앱 이름, 설명, 색상
- 아이콘 정의
- 화면 방향, 카테고리 설정

### 5. 메타데이터 개선

#### `app/layout.tsx` 메타데이터 업데이트
- 타이틀 템플릿
- 설명, 키워드
- Open Graph 설정
- Twitter Card 설정
- robots 설정
- 아이콘 설정

## 파일 구조

```
project/
├── .gitignore              # Git 무시 파일 (업데이트됨)
├── .cursorignore           # Cursor AI 무시 파일 (업데이트됨)
├── .prettierrc             # Prettier 설정
├── .prettierignore         # Prettier 무시 파일 (NEW)
├── eslint.config.mjs       # ESLint 설정 (업데이트됨)
│
├── app/
│   ├── favicon.ico         # 파비콘
│   ├── opengraph-image.tsx # 동적 OG 이미지 (NEW)
│   ├── apple-icon.tsx      # Apple Touch Icon (NEW)
│   ├── robots.ts           # robots.txt 생성 (NEW)
│   ├── sitemap.ts          # sitemap.xml 생성 (NEW)
│   ├── manifest.ts         # PWA manifest 생성 (NEW)
│   └── layout.tsx          # 메타데이터 개선
│
└── public/
    ├── logo.png
    ├── og-image.png
    └── icons/
        ├── icon-192x192.png
        ├── icon-256x256.png
        ├── icon-384x384.png
        └── icon-512x512.png
```

## 생성되는 SEO 파일

빌드 후 자동 생성되는 파일:
- `/robots.txt` - 검색 엔진 크롤러 규칙
- `/sitemap.xml` - 사이트맵
- `/manifest.webmanifest` - PWA 매니페스트
- `/opengraph-image` - Open Graph 이미지
- `/apple-icon` - Apple Touch Icon

## 사용 방법

### 환경변수 설정

`.env` 파일에 다음 변수 추가:

```bash
# 프로덕션 URL (SEO에 사용)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 동적 상품 사이트맵 활성화

`app/sitemap.ts`에서 주석 해제:

```typescript
// 데이터베이스에서 상품 목록 조회
const products = await getProducts();
const productPages = products.map((product) => ({
  url: `${baseUrl}/products/${product.id}`,
  lastModified: new Date(product.updated_at),
  changeFrequency: "weekly" as const,
  priority: 0.8,
}));

return [...staticPages, ...productPages];
```

## 완료 상태

| 작업 | 상태 |
|------|------|
| .gitignore / .cursorignore 정비 | ✅ 완료 |
| eslint.config.mjs / 포맷터 설정 확정 | ✅ 완료 |
| 아이콘/OG 이미지/파비콘 추가 | ✅ 완료 |
| SEO 관련 파일 | ✅ 완료 |

