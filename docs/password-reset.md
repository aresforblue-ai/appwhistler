# Password Reset & Account Lockout

## Password Reset Flow

1. User triggers `requestPasswordReset(email)` (GraphQL) or calls the equivalent UI action.
2. Backend stores a hashed token in `password_reset_requests`, valid for `PASSWORD_RESET_TOKEN_TTL_MIN` minutes (default 30) and emails/logs a reset link pointing to `PASSWORD_RESET_BASE_URL` with the raw token.
3. When the user submits the new password, the app calls `resetPassword(token, newPassword)`. On success, the backend invalidates the token, updates the password hash, and clears lockout counters.

### Environment Variables

- `PASSWORD_RESET_BASE_URL` (default `http://localhost:3000/reset-password`)
- `PASSWORD_RESET_TOKEN_TTL_MIN` (default `30` minutes)

## Account Lockout

- Configurable thresholds via `LOGIN_MAX_FAILED_ATTEMPTS` (default `5`) and `LOGIN_LOCKOUT_MINUTES` (default `15`).
- Failed logins increment `failed_login_attempts`; once the threshold is exceeded, `lockout_until` is set, and further login attempts return `ACCOUNT_LOCKED` until the window elapses.
- Successful logins or password resets clear the counters and lockout window.
