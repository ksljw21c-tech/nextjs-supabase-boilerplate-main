<div align="center">
  <br />

  <div>
    <img src="https://img.shields.io/badge/-Next.JS_15-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=black" alt="next.js" />
    <img src="https://img.shields.io/badge/-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="react" />
    <img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="typescript" />
    <img src="https://img.shields.io/badge/-Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="tailwind" />
    <img src="https://img.shields.io/badge/-Clerk-6C47FF?style=for-the-badge&logoColor=white&logo=clerk" alt="clerk" />
    <img src="https://img.shields.io/badge/-Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="supabase" />
    <img src="https://img.shields.io/badge/-Toss_Payments-0066FF?style=for-the-badge&logoColor=white" alt="toss payments" />
  </div>

  <h1 align="center">🛍️ 의류 쇼핑몰 MVP</h1>
  <h3 align="center">Next.js 15 + Clerk + Supabase + Toss Payments</h3>

  <p align="center">
    실동작 결제 기능이 포함된 프로덕션 레디 쇼핑몰 애플리케이션
  </p>
</div>

## 📋 목차

1. [소개](#소개)
2. [기술 스택](#기술-스택)
3. [주요 기능](#주요-기능)
4. [시작하기](#시작하기)
5. [추가 설정 및 팁](#추가-설정-및-팁)
6. [프로젝트 구조](#프로젝트-구조)

## 소개

Next.js 15, Clerk, Supabase를 활용한 모던 SaaS 애플리케이션 템플릿입니다.

**핵심 특징:**
- ✨ Next.js 15 + React 19 최신 기능 활용
- 🔐 Clerk와 Supabase 네이티브 통합 (2025년 권장 방식)
- 🎨 Tailwind CSS v4 + shadcn/ui
- 📱 완전한 반응형 디자인
- 🌐 한국어 지원 (Clerk 한국어 로컬라이제이션)

## 기술 스택

### 프레임워크 & 라이브러리

- **[Next.js 15](https://nextjs.org/)** - React 프레임워크 (App Router, Server Components)
- **[React 19](https://react.dev/)** - UI 라이브러리
- **[TypeScript](https://www.typescriptlang.org/)** - 타입 안정성

### 인증 & 데이터베이스

- **[Clerk](https://clerk.com/)** - 사용자 인증 및 관리
  - Google, 이메일 등 다양한 로그인 방식 지원
  - 한국어 UI 지원
  - Supabase와 네이티브 통합
- **[Supabase](https://supabase.com/)** - PostgreSQL 데이터베이스
  - 실시간 데이터 동기화
  - Row Level Security (RLS)
  - 파일 스토리지

### UI & 스타일링

- **[Tailwind CSS v4](https://tailwindcss.com/)** - 유틸리티 우선 CSS 프레임워크
- **[shadcn/ui](https://ui.shadcn.com/)** - 재사용 가능한 컴포넌트 라이브러리
- **[Radix UI](https://www.radix-ui.com/)** - 접근성 높은 헤드리스 컴포넌트
- **[lucide-react](https://lucide.dev/)** - 아이콘 라이브러리

### 폼 & 검증

- **[React Hook Form](https://react-hook-form.com/)** - 폼 상태 관리
- **[Zod](https://zod.dev/)** - 스키마 검증

## 주요 기능

### 🛍️ 상품 관리
- **상품 목록**: 카테고리별 필터링, 페이지네이션, 검색
- **상품 상세**: 이미지, 가격, 재고, 설명 표시
- **반응형 디자인**: 모바일/태블릿/데스크톱 최적화

### 🛒 장바구니 시스템
- **장바구니 담기**: 상품 상세 페이지에서 수량 선택
- **장바구니 관리**: 수량 변경, 상품 삭제
- **실시간 업데이트**: 장바구니 아이콘에 수량 표시
- **데이터 지속성**: Supabase에 안전하게 저장

### 💳 결제 시스템
- **Toss Payments 연동**: 실제 결제 기능 (테스트 모드)
- **결제 위젯**: 직관적인 결제 인터페이스
- **결제 상태 관리**: 성공/실패/취소 처리
- **주문 연동**: 결제 완료 시 주문 자동 생성

### 📦 주문 관리
- **주문 생성**: 배송 주소 및 메모 입력
- **주문 내역**: 마이페이지에서 주문 목록 조회
- **주문 상세**: 상품 목록, 배송 정보, 결제 상태 확인
- **주문 상태 추적**: 대기/확인/배송중/배송완료/취소

### 🔐 인증 시스템
- **Clerk 통합**: 안전한 사용자 인증
- **소셜 로그인**: Google, 이메일 등 다중 로그인 방식
- **자동 동기화**: Clerk 사용자를 Supabase에 자동 저장
- **한국어 지원**: 모든 UI 컴포넌트 한국어화

### 🗄️ 데이터베이스 통합
- **Clerk + Supabase 네이티브 통합**: 2025년 최신 방식
- **환경별 클라이언트 분리**:
  - Client Component용 (`useClerkSupabaseClient`)
  - Server Component용 (`createClerkSupabaseClient`)
  - 관리자 권한용 (`createServiceRoleClient`)
- **SQL 마이그레이션**: 체계적인 데이터베이스 관리

### 🎨 UI/UX
- **shadcn/ui 컴포넌트**: 모던하고 일관된 디자인
- **완전한 반응형**: 모든 디바이스에서 최적 경험
- **로딩 상태**: 스켈레톤 UI와 진행 표시기
- **에러 처리**: 사용자 친화적인 에러 메시지
- **접근성**: WCAG 준수, 키보드 네비게이션 지원

### 🏗️ 아키텍처
- **Server Actions 우선**: API Routes 대신 Server Actions 사용
- **타입 안전성**: TypeScript + Zod 스키마 검증
- **모듈화**: 관심사 분리와 재사용성
- **Next.js 15 최신 패턴**: App Router, Server Components 활용

## 시작하기

### 필수 요구사항

시스템에 다음이 설치되어 있어야 합니다:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en) (v18 이상)
- [pnpm](https://pnpm.io/) (권장 패키지 매니저)

```bash
# pnpm 설치
npm install -g pnpm
```

### 프로젝트 초기화

다음 단계를 순서대로 진행하세요:

#### 1. Supabase 프로젝트 생성

1. [Supabase Dashboard](https://supabase.com/dashboard)에 접속하여 로그인
2. **"New Project"** 클릭
3. Organization 선택 (없으면 새로 생성)
4. 프로젝트 정보 입력:
   - **Name**: 원하는 프로젝트 이름
   - **Database Password**: 안전한 비밀번호 생성 (기억할 필요 없음, Supabase가 관리)
   - **Region**: `Northeast Asia (Seoul)` 선택 (한국 서비스용)
   - **Pricing Plan**: Free 또는 Pro 선택
5. **"Create new project"** 클릭하고 프로젝트가 준비될 때까지 대기 (~2분)

#### 2. Clerk 프로젝트 생성

1. [Clerk Dashboard](https://dashboard.clerk.com/)에 접속하여 로그인
2. **"Create application"** 클릭
3. 애플리케이션 정보 입력:
   - **Application name**: 원하는 이름 (예: `SaaS Template`)
   - **Sign-in options**: Email, Google 등 원하는 인증 방식 선택
4. **"Create application"** 클릭
5. Quick Start 화면에서 **"Continue in Dashboard"** 클릭

#### 3. Clerk + Supabase 통합

> **중요**: 2025년 4월부터 Clerk의 네이티브 Supabase 통합을 사용합니다. JWT Template은 더 이상 필요하지 않습니다.

**3-1. Clerk Frontend API URL 확인**

1. Clerk Dashboard → **API Keys** 메뉴
2. **"Frontend API"** URL 복사 (예: `https://your-app-12.clerk.accounts.dev`)
   - 이 URL을 메모해두세요 (다음 단계에서 사용)

**3-2. Supabase에서 Clerk 인증 제공자 설정**

1. Supabase Dashboard로 돌아가기
2. 프로젝트 선택 → **Settings** → **Authentication** → **Providers**
3. 페이지 하단으로 스크롤하여 **"Third-Party Auth"** 섹션 찾기
4. **"Enable Custom Access Token"** 또는 **"Add Provider"** 클릭
5. 다음 정보 입력:

   - **Provider Name**: `Clerk` (또는 원하는 이름)
   - **JWT Issuer (Issuer URL)**:
     ```
     https://your-app-12.clerk.accounts.dev
     ```
     (`your-app-12` 부분을 실제 Clerk Frontend API URL로 교체)

   - **JWKS Endpoint (JWKS URI)**:
     ```
     https://your-app-12.clerk.accounts.dev/.well-known/jwks.json
     ```
     (동일하게 실제 URL로 교체)

6. **"Save"** 또는 **"Add Provider"** 클릭

**3-3. 통합 확인**

[Clerk 공식 통합 가이드](https://clerk.com/docs/guides/development/integrations/databases/supabase)에서 추가 정보를 확인할 수 있습니다.

#### 4. Supabase Storage 생성 및 설정

1. Supabase Dashboard → **Storage** 메뉴
2. **"New bucket"** 클릭
3. 버킷 정보 입력:
   - **Name**: `uploads` (`.env.example`과 동일하게)
   - **Public bucket**: 필요에 따라 선택
     - Public: 누구나 URL로 파일 접근 가능
     - Private: 인증된 사용자만 접근 (RLS 정책 필요)
4. **"Create bucket"** 클릭

#### 5. 데이터베이스 스키마 적용

1. Supabase Dashboard → **SQL Editor** 메뉴
2. **"New query"** 클릭
3. `supabase/migrations/schema.sql` 파일 내용을 복사하여 붙여넣기
4. **"Run"** 클릭하여 실행
5. 성공 메시지 확인 (`Success. No rows returned`)

**생성되는 테이블:**
- `users`: Clerk 사용자와 동기화되는 사용자 정보 테이블

#### 6. 환경 변수 설정

**6-1. 저장소 클론 및 의존성 설치**

```bash
git clone <your-repository-url>
cd saas-template
pnpm install
```

**6-2. .env 파일 생성**

```bash
cp .env.example .env
```

**6-3. Supabase 환경 변수 설정**

1. Supabase Dashboard → **Settings** → **API**
2. 다음 값들을 복사하여 `.env` 파일에 입력:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="<Project URL>"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon public key>"
   SUPABASE_SERVICE_ROLE_KEY="<service_role secret key>"
   NEXT_PUBLIC_STORAGE_BUCKET="uploads"
   ```

> **⚠️ 주의**: `service_role` 키는 모든 RLS를 우회하는 관리자 권한이므로 절대 공개하지 마세요!

**6-4. Clerk 환경 변수 설정**

1. Clerk Dashboard → **API Keys**
2. 다음 값들을 복사하여 `.env` 파일에 입력:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="<Publishable Key>"
   CLERK_SECRET_KEY="<Secret Key>"
   NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL="/"
   NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL="/"
   ```

#### 7. Cursor MCP 설정 (선택사항)

> Cursor AI를 사용하는 경우, Supabase MCP 서버를 설정하면 AI가 데이터베이스를 직접 조회하고 관리할 수 있습니다.

**7-1. Supabase Access Token 생성**

1. Supabase Dashboard → 우측 상단 프로필 아이콘 클릭
2. **Account Settings** → **Access Tokens**
3. **"Generate new token"** 클릭
4. Token name 입력 (예: `cursor-mcp`)
5. 생성된 토큰 복사 (다시 볼 수 없으므로 안전한 곳에 보관)

**7-2. .cursor/mcp.json 설정**

`.cursor/mcp.json` 파일을 열고 `your_supabase_access_token` 부분을 실제 토큰으로 교체:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      ]
    }
  }
}
```

**7-3. Cursor 재시작**

Cursor를 완전히 종료하고 다시 실행하여 MCP 서버 설정을 적용합니다.

#### 8. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

**테스트 페이지:**
- `/instruments`: Supabase 공식 문서 예제 (Next.js Quickstart)
- `/auth-test`: Clerk + Supabase 인증 통합 테스트
- `/storage-test`: Supabase Storage 업로드 테스트
- `/integration-test`: Clerk + Supabase 통합 종합 테스트 (작업 생성/조회/삭제)

### 개발 명령어

```bash
# 개발 서버 실행 (Turbopack)
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# 린팅
pnpm lint
```

## 배포

### Vercel CLI로 배포

이 프로젝트는 **실제 쇼핑몰 기능**이 포함된 프로덕션 레디 애플리케이션입니다.

#### 배포 전 필수 작업

**1. Supabase 데이터베이스 설정**
```bash
# Supabase Dashboard에서 SQL 실행
# 파일: supabase/migrations/db.sql
```

**2. 환경변수 설정**
```bash
# .env 파일에 실제 API 키들 설정
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
NEXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY=test_ck_...
TOSSPAYMENTS_SECRET_KEY=test_sk_...
```

#### Vercel 배포 실행

```bash
# 1. Vercel CLI 설치 (한 번만)
pnpm add -g vercel

# 2. Vercel 로그인
vercel login

# 3. 프로젝트 연결 (한 번만)
vercel link

# 4. 환경변수 설정
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env add CLERK_SECRET_KEY
# ... 다른 환경변수들도 추가

# 5. 프로덕션 배포
vercel --prod
```

#### 배포 후 확인사항

- ✅ 상품 목록 정상 표시
- ✅ Clerk 로그인 작동
- ✅ 장바구니 기능 작동
- ✅ Toss Payments 결제 위젯 로드
- ✅ 주문 생성 및 조회 가능

자세한 배포 가이드는 [`docs/VERCEL_DEPLOYMENT.md`](docs/VERCEL_DEPLOYMENT.md)를 참고하세요.

## 추가 설정 및 팁

### Clerk 한국어 설정

프로젝트에 이미 Clerk 한국어 로컬라이제이션이 적용되어 있습니다. `app/layout.tsx`의 `ClerkProvider`에서 `koKR` locale이 설정되어 있습니다.

**주요 특징:**
- ✅ 모든 Clerk 컴포넌트가 한국어로 표시
- ✅ 에러 메시지 한국어화
- ✅ Tailwind CSS 4 호환성 지원
- ✅ 커스텀 에러 메시지 추가 가능

자세한 내용은 [`docs/CLERK_LOCALIZATION.md`](docs/CLERK_LOCALIZATION.md)를 참고하세요.

### Supabase RLS (Row Level Security) 정책

프로젝트의 `users` 테이블에는 기본 RLS 정책이 설정되어 있습니다:

- **SELECT**: 사용자는 자신의 데이터만 조회 가능
- **INSERT**: 새 사용자 생성 가능
- **UPDATE**: 사용자는 자신의 데이터만 수정 가능

추가 테이블 생성 시 RLS 정책을 반드시 설정하세요:

```sql
-- 테이블 생성
CREATE TABLE your_table (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES users(clerk_id),
  -- 기타 컬럼들
);

-- RLS 활성화
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- SELECT 정책
CREATE POLICY "Users can view their own data"
  ON your_table FOR SELECT
  USING (auth.jwt()->>'sub' = user_id);

-- INSERT 정책
CREATE POLICY "Users can insert their own data"
  ON your_table FOR INSERT
  WITH CHECK (auth.jwt()->>'sub' = user_id);
```

### 추가 로그인 방식 설정

Clerk에서 추가 로그인 방식을 활성화하려면:

1. Clerk Dashboard → **User & Authentication** → **Social Connections**
2. 원하는 제공자 선택 (Google, GitHub, Discord 등)
3. OAuth 자격 증명 입력 (제공자 개발자 콘솔에서 생성)
4. **Enable** 클릭

## 프로젝트 구조

```
shopping-mall-mvp/
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes
│   │   ├── payments/           # Toss Payments 콜백
│   │   └── products/           # 상품 데이터 API
│   ├── auth-test/              # 인증 테스트 페이지
│   ├── cart/                   # 장바구니 페이지
│   ├── checkout/               # 결제 페이지
│   ├── my-orders/              # 마이페이지 (주문 내역)
│   ├── orders/[id]/            # 주문 상세 페이지
│   ├── products/[id]/          # 상품 상세 페이지
│   ├── layout.tsx              # Root Layout (Clerk + 에러 바운더리)
│   ├── page.tsx                # 홈페이지 (상품 목록)
│   └── globals.css             # Tailwind CSS 설정
│
├── components/                  # React 컴포넌트
│   ├── ui/                     # shadcn/ui 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   └── ...
│   ├── error-boundary.tsx      # 에러 바운더리
│   ├── loading.tsx             # 로딩 컴포넌트들
│   ├── navbar.tsx              # 네비게이션 바
│   ├── product-card.tsx        # 상품 카드
│   ├── product-grid.tsx        # 상품 그리드
│   ├── cart-sidebar.tsx        # 장바구니 사이드바
│   ├── checkout-client.tsx     # 결제 클라이언트
│   └── ...
│
├── lib/                        # 유틸리티 및 설정
│   ├── supabase/               # Supabase 클라이언트들
│   │   ├── clerk-client.ts     # Client Component용
│   │   ├── server.ts           # Server Component용
│   │   ├── service-role.ts     # 관리자용
│   │   └── client.ts           # 공개 데이터용
│   ├── schemas/                # Zod 스키마
│   │   ├── product.ts
│   │   ├── cart.ts
│   │   └── order.ts
│   └── utils.ts                # 공통 유틸리티
│
├── actions/                    # Server Actions
│   ├── cart.ts                 # 장바구니 액션
│   └── orders.ts               # 주문 액션
│
├── types/                      # TypeScript 타입 정의
│   ├── product.ts
│   ├── cart.ts
│   └── order.ts
│
├── supabase/                   # 데이터베이스
│   └── migrations/
│       └── db.sql             # 전체 스키마
│
├── docs/                       # 문서화
│   ├── TODO.md                # 작업 현황
│   ├── VERCEL_DEPLOYMENT.md   # 배포 가이드
│   └── PHASE5_MY_PAGE.md      # 마이페이지 구현 문서
│
├── middleware.ts               # Clerk 미들웨어
├── .env.example               # 환경변수 예시
└── README.md                  # 프로젝트 설명
```

### 주요 기능별 파일 설명

#### 🛍️ 상품 관련
- **`app/page.tsx`**: 상품 목록 페이지
- **`app/products/[id]/page.tsx`**: 상품 상세 페이지
- **`components/product-card.tsx`**: 상품 카드 컴포넌트
- **`lib/supabase/queries/products.ts`**: 상품 데이터 쿼리

#### 🛒 장바구니 관련
- **`app/cart/page.tsx`**: 장바구니 페이지
- **`components/cart-sidebar.tsx`**: 장바구니 사이드바
- **`actions/cart.ts`**: 장바구니 Server Actions
- **`lib/supabase/queries/cart.ts`**: 장바구니 데이터 쿼리

#### 💳 결제 관련
- **`app/checkout/page.tsx`**: 결제 페이지
- **`components/checkout-client.tsx`**: 결제 클라이언트
- **`components/payment-widget.tsx`**: Toss Payments 위젯
- **`app/api/payments/`**: 결제 콜백 API

#### 📦 주문 관련
- **`app/my-orders/page.tsx`**: 주문 내역 페이지
- **`app/orders/[id]/page.tsx`**: 주문 상세 페이지
- **`actions/orders.ts`**: 주문 Server Actions
- **`lib/supabase/queries/orders.ts`**: 주문 데이터 쿼리

#### 🔐 인증 관련
- **`middleware.ts`**: Clerk 인증 미들웨어
- **`app/layout.tsx`**: Clerk Provider 설정
- **`hooks/use-sync-user.ts`**: 사용자 동기화

#### 🏗️ 아키텍처 관련
- **`components/error-boundary.tsx`**: 에러 바운더리
- **`components/loading.tsx`**: 로딩 컴포넌트들
- **`lib/schemas/`**: Zod 스키마 검증
- **`lib/supabase/`**: 환경별 Supabase 클라이언트

## 🚀 시작하기

### 빠른 실행
```bash
# 1. 의존성 설치
pnpm install

# 2. 환경변수 설정
cp .env.example .env
# .env 파일에 실제 API 키들 입력

# 3. Supabase에서 SQL 실행
# supabase/migrations/db.sql 파일을 Supabase Dashboard에서 실행

# 4. 개발 서버 실행
pnpm dev
```

### 테스트 페이지
- **`/`**: 상품 목록 (홈페이지)
- **`/cart`**: 장바구니
- **`/checkout`**: 결제 페이지
- **`/my-orders`**: 주문 내역
- **`/products/[id]`**: 상품 상세
- **`/orders/[id]`**: 주문 상세

## 📋 구현된 기능 체크리스트

### ✅ Phase 1: 기본 인프라
- Clerk + Supabase 네이티브 통합
- 한국어 UI 지원
- 타입 안전성 보장

### ✅ Phase 2: 상품 기능
- 상품 목록 (필터링, 페이지네이션)
- 상품 상세 페이지
- 반응형 디자인

### ✅ Phase 3: 장바구니 & 주문
- 장바구니 담기/삭제/수량 변경
- 주문 생성 및 관리
- 데이터베이스 연동

### ✅ Phase 4: 결제 통합
- Toss Payments 위젯 연동
- 결제 성공/실패 처리
- 주문 상태 업데이트

### ✅ Phase 5: 마이페이지
- 주문 내역 목록 조회
- 주문 상세 보기

### ✅ Phase 6: 테스트 & 배포 준비
- E2E 플로우 검증
- 에러 처리 강화
- Vercel 배포 설정

### ✅ Phase 7: 마무리 작업
- 오류/로딩/빈 상태 UI 정비
- 타입 안전성 강화 (Zod 적용)
- README/PRD 반영
- 접근성/반응형/다크모드 지원

## 추가 리소스

- [Next.js 15 문서](https://nextjs.org/docs)
- [Clerk 문서](https://clerk.com/docs)
- [Supabase 문서](https://supabase.com/docs)
- [Toss Payments 개발자 센터](https://developers.tosspayments.com/)
- [shadcn/ui 문서](https://ui.shadcn.com/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod 문서](https://zod.dev/)

---

## 📞 문의 및 지원

이 프로젝트에 대한 질문이나 개선 제안이 있으시면 이슈를 생성해주세요.

**Happy Shopping! 🛍️✨**
