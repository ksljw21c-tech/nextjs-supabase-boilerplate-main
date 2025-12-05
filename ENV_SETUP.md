# 환경변수 설정 가이드

이 프로젝트를 실행하기 위해 필요한 환경변수들을 설정하는 방법을 안내합니다.

## 1. 환경변수 파일 생성

```bash
# .env.example을 복사해서 .env 파일 생성
cp .env.example .env
```

`.env.example` 파일이 없는 경우 아래 내용을 참고해서 `.env` 파일을 직접 생성하세요.

## 2. 필수 환경변수들

### Clerk Authentication (인증)
```bash
# Clerk Dashboard에서 발급받은 키들
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/
```

### Supabase Database (데이터베이스)
```bash
# Supabase Dashboard에서 발급받은 값들
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_STORAGE_BUCKET=uploads
```

### Toss Payments (결제)
```bash
# Toss Payments 가맹점 센터에서 발급받은 키들
NEXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY=test_ck_your_client_key
TOSSPAYMENTS_SECRET_KEY=test_sk_your_secret_key
```

### 애플리케이션 설정
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. 서비스별 설정 방법

### Clerk 설정
1. [Clerk Dashboard](https://dashboard.clerk.com) 접속
2. 새 애플리케이션 생성 또는 기존 앱 선택
3. **API Keys** 섹션에서 키 복사
4. `.env` 파일에 설정

### Supabase 설정
1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **Settings** → **API** → **Project URL** 및 **API Keys** 복사
4. `.env` 파일에 설정
5. **SQL Editor**에서 `supabase/migrations/db.sql` 실행

### Toss Payments 설정
1. [Toss Payments 가맹점 센터](https://developers.tosspayments.com) 접속
2. **개발자** → **API 키 관리** → 테스트 키 복사
3. `.env` 파일에 설정

## 4. Vercel 배포 시 환경변수 설정

Vercel Dashboard에서 다음 단계를 따라 환경변수를 설정하세요:

1. **프로젝트 선택** → **Settings** → **Environment Variables**
2. **Add** 버튼으로 각 환경변수 추가
3. **Environment** 설정:
   - **Production**: 실제 서비스용
   - **Preview**: 테스트용
   - **Development**: 로컬 개발용

### 주의사항
- `NEXT_PUBLIC_` 접두사가 있는 변수만 브라우저에 노출됩니다
- 민감한 키들은 서버에서만 사용되도록 하세요
- 실제 키 값들은 절대 Git에 커밋하지 마세요

## 5. 환경별 설정 파일

### 로컬 개발 (.env.local)
```bash
# 로컬 개발용 설정 (Git에 커밋되지 않음)
cp .env .env.local
# .env.local 파일을 열어서 실제 값들로 수정
```

### Vercel 프로덕션
Vercel Dashboard에서 직접 설정하거나 `vercel env` 명령어 사용:

```bash
# Vercel CLI로 환경변수 설정
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env add CLERK_SECRET_KEY
# ... 다른 변수들도 동일하게
```

## 6. 확인 방법

환경변수가 제대로 설정되었는지 확인하려면:

```bash
# 개발 서버 실행
pnpm dev

# 브라우저에서 http://localhost:3000 접속
# 에러 없이 페이지가 로드되면 성공
```

## 7. 문제 해결

### Clerk 관련 에러
```
Error: Missing publishableKey
```
→ `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` 확인

### Supabase 연결 에러
```
Error: Invalid API key
```
→ `NEXT_PUBLIC_SUPABASE_ANON_KEY` 확인

### 데이터베이스 테이블 없음 에러
```
Could not find the table 'public.orders'
```
→ Supabase SQL Editor에서 `supabase/migrations/db.sql` 실행

### 결제 관련 에러
```
Invalid client key
```
→ `NEXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY` 확인

## 8. 보안 주의사항

- ✅ `.env` 파일은 `.gitignore`에 포함되어야 합니다
- ✅ 실제 키 값들은 Git에 커밋하지 마세요
- ✅ 프로덕션에서는 테스트 키가 아닌 실제 키를 사용하세요
- ✅ 서비스 롤 키는 서버에서만 사용하세요
