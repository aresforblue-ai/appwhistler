# Email Service Setup Guide

AppWhistler uses **SendGrid** for transactional email delivery (password resets, welcome emails, notifications).

## Features

The email service supports:

- **Password Reset Emails** - Secure password reset links with 60-minute expiration
- **Welcome Emails** - Onboarding emails for new user registrations
- **Account Lockout Notifications** - Security alerts when account is locked
- **Fact-Check Notifications** - Updates on followed fact-checks
- **Generic Notifications** - Flexible notification system

All emails include:
- Responsive HTML templates with inline CSS
- Plain-text fallback versions
- Professional branding with gradient headers
- Actionable CTAs (Call-to-Action buttons)
- Footer with privacy policy and unsubscribe links

## Setup Instructions

### 1. Create a SendGrid Account

1. Go to [SendGrid](https://sendgrid.com/)
2. Sign up for a free account (100 emails/day free tier)
3. Verify your email address
4. Complete sender authentication (required for production)

### 2. Generate API Key

1. Navigate to **Settings → API Keys**
2. Click **Create API Key**
3. Name it `AppWhistler Production` or `AppWhistler Dev`
4. Select **Full Access** or **Restricted Access** with Mail Send permissions
5. Copy the generated API key (you won't be able to see it again!)

### 3. Configure Environment Variables

Add the following to your `.env` file:

```bash
# Email Service (SendGrid)
SENDGRID_API_KEY=SG.your_actual_sendgrid_api_key_here
FROM_EMAIL=noreply@appwhistler.org
FROM_NAME=AppWhistler
PASSWORD_RESET_BASE_URL=http://localhost:3000/reset-password
APP_URL=http://localhost:3000
```

**Configuration Details:**

- `SENDGRID_API_KEY` - Your SendGrid API key (starts with `SG.`)
- `FROM_EMAIL` - Email address that appears in the "From" field
- `FROM_NAME` - Display name for the sender
- `PASSWORD_RESET_BASE_URL` - Frontend URL for password reset page
- `APP_URL` - Base URL of your application

### 4. Domain Authentication (Production Only)

For production deployment, authenticate your domain to avoid emails going to spam:

1. Go to **Settings → Sender Authentication → Authenticate Your Domain**
2. Follow SendGrid's DNS configuration wizard
3. Add the required DNS records to your domain (CNAME records)
4. Wait for verification (can take up to 48 hours)

**Note:** Without domain authentication, emails may be marked as spam.

### 5. Verify Sender Email (Development)

For development/testing without a custom domain:

1. Go to **Settings → Sender Authentication → Single Sender Verification**
2. Add your email address (e.g., `noreply@appwhistler.org`)
3. SendGrid will send a verification email
4. Click the verification link

## Development Mode

If `SENDGRID_API_KEY` is not set or equals `your_sendgrid_api_key`, the email service runs in **development mode**:

- Emails are **not actually sent**
- Email content is logged to the console
- Useful for local development and testing

Example console output in dev mode:

```
📧 [DEV MODE] Email would be sent to: user@example.com
Subject: Reset Your AppWhistler Password
Text Content:
Hi testuser,

We received a request to reset your password for AppWhistler.

Reset your password by clicking this link:
http://localhost:3000/reset-password?token=abc123...
```

## Email Templates

### Password Reset Email

**Triggered by:** `requestPasswordReset` mutation

**Contains:**
- Personalized greeting with username
- Reset password button (CTA)
- Plain-text reset link
- 60-minute expiration notice
- Security disclaimer

### Welcome Email

**Triggered by:** `register` mutation (sent asynchronously)

**Contains:**
- Welcome message with username
- Truth Score display
- Feature highlights (fact-checking, reviews, bounties, leaderboard)
- "Explore Your Dashboard" CTA
- Getting started guide link

### Account Lockout Email

**Triggered by:** 5 failed login attempts

**Contains:**
- Lockout notification
- Unlock time and duration
- Security warning
- "Reset Password Now" CTA (red alert style)

### Fact-Check Notification

**Triggered by:** Updates to followed fact-checks (future feature)

**Contains:**
- Claim text
- Verdict (TRUE/FALSE/MISLEADING/UNVERIFIED) with color-coded badge
- Confidence score
- "View Fact-Check Details" CTA

## Testing Email Delivery

### 1. Test Password Reset Flow

```bash
# Start the server
npm run server

# In another terminal, test the password reset mutation
curl -X POST http://localhost:5000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { requestPasswordReset(email: \"test@example.com\") }"
  }'
```

**Expected behavior:**
- In **dev mode**: Email content logged to console
- In **production mode**: Email delivered to inbox

### 2. Test User Registration (Welcome Email)

```bash
curl -X POST http://localhost:5000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { register(input: { username: \"testuser\", email: \"test@example.com\", password: \"SecurePass123!\" }) { token user { username } } }"
  }'
```

### 3. Test Account Lockout Email

1. Attempt to log in with wrong password 5 times
2. On the 5th failed attempt, lockout email should be sent

## Monitoring & Debugging

### Check SendGrid Logs

1. Go to SendGrid Dashboard → **Activity**
2. View delivery status, opens, clicks, bounces, spam reports

### Common Issues

**Problem:** Emails not delivered

**Solutions:**
- Check API key is correct and has "Mail Send" permission
- Verify sender email is authenticated
- Check spam folder
- Review SendGrid activity logs for errors

**Problem:** Emails go to spam

**Solutions:**
- Authenticate your domain (see step 4 above)
- Use a real domain email (not Gmail, Yahoo, etc.)
- Avoid spam trigger words in subject/content
- Enable DKIM/SPF/DMARC records

**Problem:** "Unauthorized" error

**Solutions:**
- Regenerate SendGrid API key
- Ensure API key starts with `SG.`
- Check API key has correct permissions

## Rate Limits

SendGrid Free Tier:
- **100 emails/day**
- Suitable for development and small-scale testing

Paid Plans:
- Essentials: $19.95/month (50,000 emails)
- Pro: $89.95/month (100,000 emails)

## Alternative Email Providers

The email service can be adapted to use other providers:

### Postmark

```javascript
const postmark = require('postmark');
const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

await client.sendEmail({
  From: FROM_EMAIL,
  To: recipient,
  Subject: subject,
  HtmlBody: htmlContent,
  TextBody: textContent
});
```

### AWS SES

```javascript
const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'us-east-1' });

await ses.sendEmail({
  Source: FROM_EMAIL,
  Destination: { ToAddresses: [recipient] },
  Message: {
    Subject: { Data: subject },
    Body: {
      Html: { Data: htmlContent },
      Text: { Data: textContent }
    }
  }
}).promise();
```

### Resend

```javascript
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: FROM_EMAIL,
  to: recipient,
  subject: subject,
  html: htmlContent
});
```

## Security Best Practices

1. **Never commit API keys** - Use `.env` and `.gitignore`
2. **Use restricted API keys** - Only grant "Mail Send" permission
3. **Rotate keys regularly** - Every 3-6 months
4. **Monitor for abuse** - Check SendGrid activity logs
5. **Rate limit requests** - Prevent email bombing attacks
6. **Validate email addresses** - Use email validation before sending
7. **Implement unsubscribe** - Add unsubscribe links to marketing emails

## Production Checklist

Before going live:

- [ ] Domain authenticated with SendGrid
- [ ] Sender email verified
- [ ] API key is production key (not dev/test)
- [ ] `FROM_EMAIL` uses your domain (e.g., `noreply@yourdomain.com`)
- [ ] `APP_URL` points to production URL (e.g., `https://appwhistler.org`)
- [ ] `PASSWORD_RESET_BASE_URL` points to production frontend
- [ ] Tested all email flows (registration, password reset, lockout)
- [ ] Reviewed emails in spam checker (e.g., Mail Tester)
- [ ] Set up email monitoring/alerts in SendGrid
- [ ] Configured unsubscribe handling (if applicable)

## Support

For SendGrid issues:
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [SendGrid Support](https://support.sendgrid.com/)

For AppWhistler email issues:
- Check server logs for error messages
- Review `src/backend/utils/email.js` implementation
- Open an issue on GitHub
