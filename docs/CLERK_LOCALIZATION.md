# Clerk 한국어 로컬라이제이션 가이드

이 문서는 Clerk 컴포넌트를 한국어로 설정하는 방법을 설명합니다.

## 목차

1. [개요](#개요)
2. [설정 방법](#설정-방법)
3. [커스터마이징](#커스터마이징)
4. [지원되는 언어](#지원되는-언어)
5. [문제 해결](#문제-해결)

## 개요

Clerk는 `@clerk/localizations` 패키지를 통해 다양한 언어의 로컬라이제이션을 제공합니다. 이 프로젝트는 한국어(`koKR`) 로컬라이제이션을 사용합니다.

### 주요 특징

- ✅ Clerk 컴포넌트의 모든 텍스트가 한국어로 표시
- ✅ 에러 메시지 한국어화
- ✅ Tailwind CSS 4 호환성 지원
- ✅ 커스텀 메시지 추가 가능

## 설정 방법

### 1. 패키지 설치

`@clerk/localizations` 패키지가 이미 설치되어 있습니다:

```json
{
  "dependencies": {
    "@clerk/localizations": "^3.26.3"
  }
}
```

### 2. 로컬라이제이션 적용

`app/layout.tsx`에서 한국어 로컬라이제이션을 적용합니다:

```tsx
import { ClerkProvider } from '@clerk/nextjs';
import { koKR } from '@clerk/localizations';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      localization={koKR}
      appearance={{
        cssLayerName: 'clerk', // Tailwind CSS 4 호환성
      }}
    >
      <html lang="ko">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### 3. 현재 설정 확인

현재 프로젝트의 설정은 `app/layout.tsx`에서 확인할 수 있습니다:

```tsx
const clerkLocalization = {
  ...koKR,
  unstable__errors: {
    ...koKR.unstable__errors,
    // 커스텀 에러 메시지 추가 가능
  },
};
```

## 커스터마이징

### 커스텀 에러 메시지 추가

특정 에러 메시지를 커스터마이징할 수 있습니다:

```tsx
import { koKR } from '@clerk/localizations';

const customLocalization = {
  ...koKR,
  unstable__errors: {
    ...koKR.unstable__errors,
    not_allowed_access: 
      '접근이 허용되지 않습니다. 문의사항이 있으시면 이메일로 연락주세요.',
    form_identifier_not_found:
      '입력하신 이메일 또는 사용자명을 찾을 수 없습니다.',
  },
};

// ClerkProvider에 적용
<ClerkProvider localization={customLocalization}>
  ...
</ClerkProvider>
```

### 사용 가능한 에러 키

Clerk의 에러 메시지 키는 `@clerk/localizations` 패키지의 소스 코드를 참고하세요. 주요 에러 키:

- `not_allowed_access`: 접근이 허용되지 않음
- `form_identifier_not_found`: 사용자를 찾을 수 없음
- `form_password_pwned`: 비밀번호가 유출된 것으로 확인됨
- `form_password_length_too_short`: 비밀번호가 너무 짧음
- `form_username_invalid_length`: 사용자명 길이가 유효하지 않음

## 지원되는 언어

Clerk는 다음 언어를 지원합니다:

| 언어 | 키 | BCP 47 태그 |
|------|-----|-------------|
| 한국어 | `koKR` | `ko-KR` |
| 영어 (미국) | `enUS` | `en-US` |
| 영어 (영국) | `enGB` | `en-GB` |
| 일본어 | `jaJP` | `ja-JP` |
| 중국어 (간체) | `zhCN` | `zh-CN` |
| 중국어 (번체) | `zhTW` | `zh-TW` |
| 프랑스어 | `frFR` | `fr-FR` |
| 독일어 | `deDE` | `de-DE` |
| 스페인어 | `esES` | `es-ES` |
| 포르투갈어 (브라질) | `ptBR` | `pt-BR` |

전체 언어 목록은 [Clerk 공식 문서](https://clerk.com/docs/guides/customizing-clerk/localization)를 참고하세요.

## 적용 범위

### 적용되는 컴포넌트

다음 Clerk 컴포넌트들이 한국어로 표시됩니다:

- `<SignIn />`: 로그인 컴포넌트
- `<SignUp />`: 회원가입 컴포넌트
- `<UserButton />`: 사용자 버튼
- `<SignInButton />`: 로그인 버튼
- `<SignUpButton />`: 회원가입 버튼
- `<UserProfile />`: 사용자 프로필
- 에러 메시지 및 알림

### 적용되지 않는 부분

⚠️ **주의**: 로컬라이제이션은 Clerk 컴포넌트의 텍스트만 변경합니다.

- **Clerk Account Portal**: 호스팅된 계정 포털은 영어로 유지됩니다
- **커스텀 컴포넌트**: 직접 만든 컴포넌트는 별도로 번역해야 합니다

## 문제 해결

### 문제: 한국어가 적용되지 않음

**원인**: `ClerkProvider`에 `localization` prop이 전달되지 않음

**해결 방법**:
1. `app/layout.tsx`에서 `localization={koKR}` 확인
2. `@clerk/localizations` 패키지가 설치되어 있는지 확인
3. 개발 서버 재시작

### 문제: 일부 텍스트가 영어로 표시됨

**원인**: 
- Clerk Account Portal은 로컬라이제이션되지 않음 (정상 동작)
- 커스텀 컴포넌트는 별도 번역 필요

**해결 방법**:
- Clerk 컴포넌트 내부 텍스트는 자동으로 한국어로 표시됨
- 커스텀 컴포넌트는 직접 번역 필요

### 문제: 에러 메시지가 영어로 표시됨

**원인**: `unstable__errors` 객체가 제대로 설정되지 않음

**해결 방법**:
```tsx
const clerkLocalization = {
  ...koKR,
  unstable__errors: {
    ...koKR.unstable__errors, // 기본 한국어 에러 메시지 포함
    // 커스텀 메시지 추가
  },
};
```

## 예제

### 기본 사용

```tsx
import { ClerkProvider } from '@clerk/nextjs';
import { koKR } from '@clerk/localizations';

export default function Layout({ children }) {
  return (
    <ClerkProvider localization={koKR}>
      {children}
    </ClerkProvider>
  );
}
```

### 커스텀 에러 메시지 포함

```tsx
import { ClerkProvider } from '@clerk/nextjs';
import { koKR } from '@clerk/localizations';

const customLocalization = {
  ...koKR,
  unstable__errors: {
    ...koKR.unstable__errors,
    not_allowed_access: 
      '이 이메일 도메인은 접근이 허용되지 않습니다. ' +
      '접근을 원하시면 관리자에게 문의해주세요.',
  },
};

export default function Layout({ children }) {
  return (
    <ClerkProvider localization={customLocalization}>
      {children}
    </ClerkProvider>
  );
}
```

### Tailwind CSS 4 호환성

```tsx
<ClerkProvider
  localization={koKR}
  appearance={{
    cssLayerName: 'clerk', // Tailwind CSS 4 호환성
  }}
>
  {children}
</ClerkProvider>
```

## 참고 자료

- [Clerk 공식 문서: Localization](https://clerk.com/docs/guides/customizing-clerk/localization)
- [@clerk/localizations 패키지](https://www.npmjs.com/package/@clerk/localizations)

## 관련 파일

- `app/layout.tsx`: ClerkProvider 설정 및 한국어 로컬라이제이션 적용
- `package.json`: `@clerk/localizations` 패키지 의존성

## 주의사항

⚠️ **실험적 기능**: Clerk 로컬라이제이션은 현재 실험적(experimental) 기능입니다. 문제가 발생하면 [Clerk 지원팀](https://clerk.com/contact/support)에 문의하세요.

