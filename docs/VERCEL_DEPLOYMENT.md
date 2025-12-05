# Vercel 배포 가이드

## 개요

이 프로젝트는 Vercel을 통해 배포되며, Next.js 15, Clerk 인증, Supabase 데이터베이스를 사용합니다.

## 사전 준비사항

### 1. Vercel 계정
- [Vercel](https://vercel.com)에서 계정을 생성하거나 로그인하세요.

### 2. GitHub 연결
- Vercel Dashboard에서 GitHub 계정을 연결하세요.

### 3. 프로젝트 연결
- Vercel에서 새 프로젝트를 생성하고 이 GitHub 레포지토리를 연결하세요.

## 환경변수 설정

Vercel Dashboard에서 다음 환경변수를 설정해야 합니다:

### 필수 환경변수

#### Clerk 인증 (Production 환경)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/
```

#### Supabase 데이터베이스 (Production 환경)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_STORAGE_BUCKET=uploads
```

#### Toss Payments (Production 환경)
```
NEXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY=test_ck_...
TOSSPAYMENTS_SECRET_KEY=test_sk_...
```

#### 앱 설정
```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 환경변수 설정 방법

1. **Vercel Dashboard** 접속
2. **프로젝트 선택** → **Settings** 탭
3. **Environment Variables** 섹션
4. **Add** 버튼 클릭하여 각 환경변수 추가

### 환경별 설정

- **Production**: 실제 서비스에 사용할 값들
- **Preview**: 스테이징이나 테스트용 (필요시)
- **Development**: 로컬 개발용 (필요시)

## 배포 설정

### 1. 빌드 설정
Vercel에서 자동으로 감지되며, `vercel.json` 설정이 적용됩니다:

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["icn1"]
}
```

### 2. Node.js 버전
- **Node.js 18.x 이상**을 사용하세요.
- Vercel Dashboard에서 Node.js 버전을 확인하세요.

### 3. 패키지 매니저
- **pnpm**을 사용하므로 `installCommand`가 `pnpm install`로 설정되어 있습니다.

## 데이터베이스 마이그레이션

### Supabase 설정

배포 전 Supabase에서 다음 작업을 완료하세요:

1. **Supabase 프로젝트 생성**
   - [Supabase Dashboard](https://supabase.com/dashboard)에서 새 프로젝트 생성

2. **SQL 실행**
   - Supabase Dashboard → SQL Editor
   - `supabase/migrations/db.sql` 파일의 전체 내용을 복사해서 실행

3. **환경변수 복사**
   - Supabase Dashboard → Settings → API
   - Project URL과 API Keys를 복사해서 Vercel 환경변수에 설정

## Clerk 설정

### 프로덕션 앱 생성

1. **Clerk Dashboard** 접속
2. **새 애플리케이션 생성** (Production용)
3. **도메인 설정**: Vercel에서 할당받은 도메인 추가
4. **환경변수 복사**: Production keys를 Vercel에 설정

### 리다이렉트 URL 설정

Clerk Dashboard에서 다음 URL들을 추가하세요:
- **Sign-in URL**: `https://your-app.vercel.app/sign-in`
- **Sign-up URL**: `https://your-app.vercel.app/sign-up`
- **Home URL**: `https://your-app.vercel.app`
- **Authorized redirect URLs**: Vercel 도메인

## Toss Payments 설정

### 테스트 모드에서 프로덕션으로 전환

1. **Toss Payments 가맹점 센터** 접속
2. **테스트 키**를 **실제 키**로 교체
3. **웹훅 URL 설정**: `https://your-app.vercel.app/api/payments/webhook`
4. **환경변수 업데이트**: Vercel에서 실제 키로 변경

## 배포 실행

### 자동 배포
- GitHub에 push하면 자동으로 배포됩니다.
- **main 브랜치**는 Production 환경으로 배포됩니다.

### 수동 배포
```bash
# Vercel CLI 설치 (아직 안 했다면)
npm install -g vercel

# 프로젝트 연결
vercel link

# 배포
vercel --prod
```

## 배포 후 확인사항

### 1. 기본 기능 테스트
- [ ] 홈페이지 접속 및 상품 표시
- [ ] Clerk 로그인/로그아웃
- [ ] 상품 상세 페이지
- [ ] 장바구니 기능
- [ ] 결제 플로우 (테스트 결제)

### 2. 환경변수 확인
- [ ] Clerk 인증 작동
- [ ] Supabase 연결 정상
- [ ] Toss Payments 위젯 로드

### 3. 데이터베이스 확인
- [ ] 상품 데이터 표시
- [ ] 장바구니 데이터 저장/조회
- [ ] 주문 데이터 생성/조회

### 4. 외부 서비스 확인
- [ ] Clerk 웹훅 작동
- [ ] Supabase 실시간 구독 (필요시)
- [ ] Toss Payments 콜백 처리

## 문제 해결

### 빌드 실패
```
# 빌드 로그 확인
vercel logs

# 캐시 클리어 후 재배포
vercel --prod --force
```

### 환경변수 문제
- Vercel Dashboard에서 환경변수 재확인
- 환경변수 이름에 오타 없는지 확인
- `NEXT_PUBLIC_` 접두사 확인

### 데이터베이스 연결 실패
- Supabase URL과 키 재확인
- Row Level Security 설정 확인
- 네트워크 제한 확인

### Clerk 인증 실패
- 프로덕션 키 사용 확인
- 도메인 설정 확인
- 리다이렉트 URL 설정 확인

## 모니터링

### Vercel Analytics
- Vercel Dashboard → 프로젝트 → Analytics 탭
- 실시간 트래픽 및 에러 모니터링

### 에러 추적
- Vercel Functions 로그 확인
- 브라우저 콘솔 에러 확인
- Supabase 로그 확인

## 성능 최적화

### 1. 이미지 최적화
- Next.js Image 컴포넌트 사용
- WebP 포맷 사용
- 적절한 사이즈 설정

### 2. 번들 크기 최적화
```bash
# 번들 분석
pnpm build --analyze
```

### 3. 캐싱 전략
- API Routes에 적절한 캐시 헤더 설정
- Static Assets 캐싱

## 보안 체크리스트

- [ ] 환경변수에 민감한 정보 노출되지 않음
- [ ] HTTPS 강제 적용
- [ ] CSP (Content Security Policy) 설정
- [ ] Clerk JWT 토큰 검증
- [ ] Supabase RLS 정책 적용
- [ ] XSS 방지 (적절한 sanitization)
- [ ] CSRF 방지 (필요시)

## 롤백 계획

문제가 발생하면:
1. **이전 배포로 롤백**: Vercel Dashboard에서 이전 버전 선택
2. **핫픽스 배포**: 긴급 수정 후 재배포
3. **기능 플래그**: 문제가 되는 기능을 임시 비활성화

---

## 🚀 배포 완료!

모든 설정이 완료되면 사용자는 Vercel에서 호스팅되는 완전한 기능을 갖춘 쇼핑몰을 사용할 수 있습니다!