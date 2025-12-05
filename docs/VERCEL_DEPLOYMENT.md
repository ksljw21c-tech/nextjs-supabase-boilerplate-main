# Vercel CLI 배포 가이드

이 문서는 Vercel CLI를 사용하여 Next.js 프로젝트를 배포하는 방법을 설명합니다.

## 목차

1. [사전 준비](#사전-준비)
2. [Vercel CLI 설치](#vercel-cli-설치)
3. [배포 전 체크리스트](#배포-전-체크리스트)
4. [배포 단계](#배포-단계)
5. [환경 변수 설정](#환경-변수-설정)
6. [배포 확인](#배포-확인)
7. [문제 해결](#문제-해결)

## 사전 준비

### 1. Vercel 계정 생성

1. [Vercel](https://vercel.com)에 접속하여 계정 생성
2. GitHub, GitLab, 또는 Bitbucket 계정으로 로그인 권장

### 2. 프로젝트 준비

배포 전에 다음을 확인하세요:

- ✅ 코드가 Git 저장소에 커밋되어 있는지 확인
- ✅ `.env` 파일이 `.gitignore`에 포함되어 있는지 확인 (보안)
- ✅ 빌드가 성공하는지 확인: `pnpm build`

## Vercel CLI 설치

### 전역 설치 (권장)

```bash
pnpm add -g vercel
```

또는 npm 사용:

```bash
npm install -g vercel
```

### 설치 확인

```bash
vercel --version
```

## 배포 전 체크리스트

배포하기 전에 다음 항목들을 확인하세요:

### ✅ 코드 준비

- [ ] 모든 변경사항이 커밋되어 있음
- [ ] `.env` 파일이 Git에 포함되지 않음 (`.gitignore` 확인)
- [ ] 로컬에서 빌드가 성공함: `pnpm build`

### ✅ 환경 변수 준비

다음 환경 변수들을 Vercel 대시보드에 설정할 준비를 하세요:

**Clerk 환경 변수:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`

**Supabase 환경 변수:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STORAGE_BUCKET`

### ✅ Clerk 프로덕션 설정

1. [Clerk Dashboard](https://dashboard.clerk.com/)에 로그인
2. 프로덕션 애플리케이션 선택 또는 생성
3. **Settings** → **Domains**에서 프로덕션 도메인 추가
4. Vercel 배포 후 실제 도메인을 Clerk에 등록

### ✅ Supabase 프로덕션 설정

1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인
2. 프로덕션 프로젝트 사용 또는 새로 생성
3. RLS 정책이 프로덕션에 맞게 설정되어 있는지 확인

## 배포 단계

### 1단계: Vercel 로그인

터미널에서 다음 명령어를 실행하세요:

```bash
vercel login
```

브라우저가 열리면 Vercel 계정으로 로그인하세요.

### 2단계: 프로젝트 연결

프로젝트 루트 디렉토리에서 다음 명령어를 실행하세요:

```bash
vercel
```

처음 배포하는 경우 다음 질문들이 나타납니다:

1. **Set up and deploy?** → `Y` 입력
2. **Which scope?** → 계정 선택
3. **Link to existing project?** → `N` 입력 (새 프로젝트)
4. **What's your project's name?** → 프로젝트 이름 입력 (또는 Enter로 기본값 사용)
5. **In which directory is your code located?** → `./` 입력 (현재 디렉토리)

### 3단계: 환경 변수 설정

배포 후 Vercel 대시보드에서 환경 변수를 설정하거나, CLI로 설정할 수 있습니다.

**CLI로 환경 변수 설정:**

```bash
# Clerk 환경 변수
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
vercel env add CLERK_SECRET_KEY production
vercel env add NEXT_PUBLIC_CLERK_SIGN_IN_URL production
vercel env add NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL production
vercel env add NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL production

# Supabase 환경 변수
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add NEXT_PUBLIC_STORAGE_BUCKET production
```

각 명령어 실행 시 값을 입력하라는 프롬프트가 나타납니다.

**또는 Vercel 대시보드에서 설정:**

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 선택
3. **Settings** → **Environment Variables**
4. 각 환경 변수 추가:
   - **Key**: 환경 변수 이름
   - **Value**: 값
   - **Environment**: Production, Preview, Development 선택

### 4단계: 프로덕션 배포

환경 변수 설정 후 프로덕션 배포:

```bash
vercel --prod
```

또는 간단히:

```bash
vercel -p
```

## 환경 변수 설정

### 필수 환경 변수 목록

다음 환경 변수들을 모두 설정해야 합니다:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_STORAGE_BUCKET=uploads
```

### 환경별 설정

Vercel에서는 다음 환경별로 환경 변수를 설정할 수 있습니다:

- **Production**: 프로덕션 배포에 사용
- **Preview**: Pull Request 미리보기에 사용
- **Development**: 로컬 개발에 사용 (`vercel dev`)

### 환경 변수 확인

설정한 환경 변수를 확인하려면:

```bash
vercel env ls
```

## 배포 확인

### 배포 상태 확인

```bash
vercel ls
```

### 배포 로그 확인

```bash
vercel logs [deployment-url]
```

### 브라우저에서 확인

배포가 완료되면 Vercel이 배포 URL을 제공합니다:

```
✅ Production: https://your-project.vercel.app
```

브라우저에서 해당 URL을 열어 확인하세요.

## 문제 해결

### 문제: 빌드 실패

**원인**: 환경 변수 누락 또는 빌드 오류

**해결 방법**:
1. 로컬에서 빌드 테스트: `pnpm build`
2. 환경 변수가 모두 설정되어 있는지 확인
3. 빌드 로그 확인: `vercel logs`

### 문제: 환경 변수가 적용되지 않음

**원인**: 환경 변수 설정 후 재배포하지 않음

**해결 방법**:
```bash
# 환경 변수 설정 후 재배포
vercel --prod
```

### 문제: Clerk 인증 오류

**원인**: Clerk 도메인 설정 누락

**해결 방법**:
1. Clerk Dashboard → **Settings** → **Domains**
2. Vercel 배포 URL 추가 (예: `your-project.vercel.app`)
3. 또는 커스텀 도메인 추가

### 문제: Supabase 연결 오류

**원인**: 환경 변수 오류 또는 RLS 정책 문제

**해결 방법**:
1. Supabase 환경 변수가 올바르게 설정되었는지 확인
2. Supabase Dashboard에서 연결 상태 확인
3. RLS 정책이 올바르게 설정되었는지 확인

## 추가 명령어

### 프로젝트 정보 확인

```bash
vercel inspect
```

### 배포 취소

```bash
vercel rollback
```

### 로컬에서 Vercel 환경 시뮬레이션

```bash
vercel dev
```

이 명령어는 로컬에서 Vercel 환경을 시뮬레이션하여 테스트할 수 있습니다.

### 프로젝트 삭제

```bash
vercel remove [project-name]
```

## 자동 배포 설정

### GitHub 연동 (권장)

1. Vercel Dashboard → 프로젝트 → **Settings** → **Git**
2. GitHub 저장소 연결
3. 자동 배포 활성화:
   - **Production**: `main` 또는 `master` 브랜치에 푸시 시
   - **Preview**: 다른 브랜치에 푸시 시

이제 Git에 푸시하면 자동으로 배포됩니다!

## 참고 자료

- [Vercel 공식 문서](https://vercel.com/docs)
- [Vercel CLI 문서](https://vercel.com/docs/cli)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)

## 관련 파일

- `vercel.json`: Vercel 설정 파일
- `.vercelignore`: Vercel 배포 시 제외할 파일 목록
- `package.json`: 빌드 스크립트 설정

