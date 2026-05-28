  # Supabase Auth 설정 가이드

회원가입 개편 적용 후 **Supabase 대시보드에서 직접** 해주셔야 할 작업입니다.

---

## 1. 마이그레이션 적용

```bash
# Supabase CLI 사용 시
supabase db push

# 또는 Supabase 대시보드 → SQL Editor 에 아래 파일 내용 복붙 후 실행
# supabase/migrations/20260503000000_signup_overhaul.sql
```

확인:
- Database → Triggers 에서 `on_auth_user_created` 가 `auth.users` 테이블에 보이면 OK
- Database → Functions 에서 `handle_new_user` 가 보이면 OK

---

## 2. Auth 설정

**Authentication → Sign In / Providers → Email**

- **Enable Email provider**: ON
- **Confirm email**: **ON** (가입 시 이메일 인증 메일 발송)
- **Secure email change**: ON
- **Enable email signups**: ON

**Authentication → Sign In / Providers → Google**

- 기존대로 ON 유지

**Authentication → Sign In / Providers → Kakao**

- 기존대로 ON 유지

---

## 3. URL 설정

**Authentication → URL Configuration**

- **Site URL**:
  - 로컬 개발: `http://localhost:3000`
  - 프로덕션: `https://kostock-production.up.railway.app`

- **Redirect URLs** (둘 다 추가):
  ```
  http://localhost:3000/auth/callback
  https://kostock-production.up.railway.app/auth/callback
  ```

---

## 4. 이메일 템플릿 (선택, 권장)

**Authentication → Email Templates → Confirm signup**

기본 템플릿도 동작하지만, 한국어로 바꾸면 사용자 경험이 좋습니다.

### Subject
```
[KOSTOCK Pro] 이메일 인증을 완료해주세요
```

### Body (HTML)
```html
<h2>KOSTOCK Pro 가입을 환영합니다 🎉</h2>
<p>아래 버튼을 클릭하면 가입이 완료되고, <strong>7일 무료 체험</strong>이 시작됩니다.</p>
<p>
  <a href="{{ .ConfirmationURL }}"
     style="display:inline-block;padding:12px 24px;background:#0f172a;color:#fff;
            border-radius:12px;font-weight:bold;text-decoration:none;">
    이메일 인증하기
  </a>
</p>
<p style="color:#64748b;font-size:13px;">
  본인이 가입을 신청하지 않았다면 이 메일을 무시하시면 됩니다.<br>
  링크는 24시간 후 만료됩니다.
</p>
```

### Reset Password 템플릿

**Authentication → Email Templates → Reset Password**

#### Subject
```
[KOSTOCK Pro] 비밀번호 재설정 안내
```

#### Body (HTML)
```html
<h2>비밀번호 재설정 요청</h2>
<p>
  <strong>{{ .Email }}</strong> 계정의 비밀번호 재설정을 요청하셨습니다.<br>
  아래 버튼을 클릭하여 새 비밀번호를 설정해주세요.
</p>
<p>
  <a href="{{ .ConfirmationURL }}"
     style="display:inline-block;padding:12px 24px;background:#0f172a;color:#fff;
            border-radius:12px;font-weight:bold;text-decoration:none;">
    비밀번호 재설정하기
  </a>
</p>
<p style="color:#64748b;font-size:13px;">
  링크는 1시간 후 만료됩니다.<br><br>
  <strong style="color:#dc2626;">본인이 요청하지 않았다면</strong> 이 메일을 무시하셔도 됩니다.<br>
  계정 보안이 걱정되신다면 즉시 로그인하여 비밀번호를 변경해주세요.
</p>
<hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
<p style="color:#94a3b8;font-size:12px;">
  이 메일은 발신 전용입니다. 문의는
  <a href="https://kostock-production.up.railway.app/contact" style="color:#4f46e5;">고객센터</a>를 이용해주세요.
</p>
```

### Change Email 템플릿 (선택)

**Authentication → Email Templates → Change Email Address**

사용자가 마이페이지에서 이메일 변경 시 새 이메일로 인증 메일이 갑니다.

#### Subject
```
[KOSTOCK Pro] 이메일 주소 변경 확인
```

#### Body (HTML)
```html
<h2>이메일 변경 확인</h2>
<p>
  KOSTOCK Pro 계정의 이메일을 <strong>{{ .NewEmail }}</strong>로 변경하시려고 합니다.<br>
  아래 버튼을 클릭하여 변경을 완료해주세요.
</p>
<p>
  <a href="{{ .ConfirmationURL }}"
     style="display:inline-block;padding:12px 24px;background:#0f172a;color:#fff;
            border-radius:12px;font-weight:bold;text-decoration:none;">
    이메일 변경 확인
  </a>
</p>
<p style="color:#64748b;font-size:13px;">
  본인이 요청하지 않았다면 이 메일을 무시하시면 됩니다.<br>
  링크는 24시간 후 만료됩니다.
</p>
```

---

## 5. Rate Limit (어뷰징 방어)

**Authentication → Rate Limits**

권장 값:
- **Email signup**: 시간당 30회 (기본값보다 약간 보수적)
- **Email signin**: 분당 10회
- **Password recovery**: 시간당 5회

---

## 6. 테스트 체크리스트

- [ ] 이메일 가입: `/signup` 폼 작성 → 메일 수신 → 링크 클릭 → 홈으로 이동 + Pro 기능 활성
- [ ] 이메일 가입 후 `profiles` 테이블에 행이 자동 생성되었는지, `subscription_status='trial'`, `trial_ends_at` 이 +7일로 들어갔는지 확인
- [ ] 같은 이메일로 재가입 시도 → "이미 가입된 이메일입니다" 에러
- [ ] 이메일 로그인: `/login` → 정상 로그인
- [ ] 잘못된 비밀번호로 로그인 → 한글 에러 메시지
- [ ] 비밀번호 찾기: `/forgot-password` → 메일 → 재설정
- [ ] Google 가입(신규): 프로필 자동 생성 → `/onboarding` (이름은 prefill, 생년월일만 입력) → 홈
- [ ] Google 로그인(기존): 곧바로 홈
- [ ] Kakao 가입/로그인: 동일 동작

---

## 트러블슈팅

**가입 후 메일이 안 옴**
- Supabase 무료 플랜은 시간당 4통 제한 + 신뢰도 낮은 발신 도메인 사용 → 스팸으로 분류될 수 있음
- 운영 단계에서는 Custom SMTP 설정 권장 (Resend, SendGrid, AWS SES 등)
- `Authentication → Email Settings → Enable Custom SMTP`

**`handle_new_user` 트리거 실행 실패로 가입 자체가 막힘**
- `auth.users` INSERT 가 트리거 실패로 롤백될 수 있음
- 증상: 가입 시도 시 500 에러
- 체크: Database → Logs 에서 트리거 에러 메시지 확인
- 보통 RLS 또는 컬럼 NOT NULL 제약 위반이 원인

**OAuth 콜백 redirect_uri 불일치**
- "redirect_uri_mismatch" 에러 → 위 3번 Redirect URLs 에 정확한 URL 넣었는지 확인 (끝에 `/` 유무 주의)
