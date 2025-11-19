# Security Policy

## Supported Versions

AppWhistler is currently in active development (v0.1.x). Security updates are provided for the latest version only.

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Reporting a Vulnerability

We take the security of AppWhistler seriously. If you believe you have found a security vulnerability, please report it to us responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **GitHub Security Advisories** (Preferred)
   - Navigate to the repository's Security tab
   - Click "Report a vulnerability"
   - Fill out the advisory form with details

2. **Email**
   - Send an email to: security@appwhistler.com (or the maintainer's email)
   - Use a clear subject line: "Security Vulnerability in AppWhistler"

### What to Include

Please include as much of the following information as possible:

- Type of vulnerability (e.g., SQL injection, XSS, authentication bypass)
- Full paths of affected source files
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability
- Any potential mitigations you've identified

### Response Timeline

- **Initial Response**: Within 48 hours of report submission
- **Status Update**: Within 7 days with assessment of the vulnerability
- **Fix Timeline**: Varies based on severity
  - **Critical**: Within 7 days
  - **High**: Within 14 days
  - **Medium**: Within 30 days
  - **Low**: Within 60 days

### Disclosure Policy

- We will acknowledge your report within 48 hours
- We will provide regular updates on our progress
- Once a fix is deployed, we will publicly disclose the vulnerability (with your permission)
- We appreciate your patience while we work on a fix

### Bug Bounty

Currently, we do not offer a paid bug bounty program. However, we will:

- Publicly acknowledge security researchers who responsibly disclose vulnerabilities
- Maintain a Security Hall of Fame in our documentation
- Consider contributions for future bounty programs

## Security Best Practices for Contributors

### General Guidelines

1. **Never commit secrets**: API keys, passwords, or tokens should never be committed
2. **Input validation**: Always validate and sanitize user input
3. **SQL injection prevention**: Use parameterized queries (`$1`, `$2`, etc.)
4. **Authentication**: Use `requireAuth(context)` for protected operations
5. **HTTPS only**: All production traffic must use HTTPS
6. **Rate limiting**: Implement rate limits on all public endpoints
7. **CORS configuration**: Properly configure CORS via `ALLOWED_ORIGINS`

### Dependency Security

- Run `npm audit` regularly to check for vulnerable dependencies
- Keep dependencies up to date
- Review security advisories for critical packages
- Use `npm audit fix` cautiously to avoid breaking changes

### Code Security Tools

We use the following tools to maintain security:

- **ESLint**: Static code analysis
- **npm audit**: Dependency vulnerability scanning
- **CodeQL**: Automated security scanning (when configured)
- **SQL Audit Script**: `npm run audit:sql` - Prevents unsafe SQL interpolation

### Security Features

AppWhistler implements several security features:

- **JWT Authentication**: 7-day token expiry
- **Account Lockout**: Protection against brute force (5 attempts / 15 minutes)
- **Helmet.js**: Security headers
- **Rate Limiting**: Express rate limiter on all endpoints
- **Content Sanitization**: HTML sanitization on user input
- **CORS Protection**: Configurable allowed origins
- **Password Hashing**: bcrypt with appropriate salt rounds

### Security Checklist for PRs

Before submitting a PR, ensure:

- [ ] No hardcoded secrets or credentials
- [ ] Input validation on all user-provided data
- [ ] Parameterized SQL queries (no string interpolation)
- [ ] Proper authentication and authorization checks
- [ ] Error messages don't leak sensitive information
- [ ] Dependencies are up to date
- [ ] `npm audit` shows no high/critical vulnerabilities
- [ ] Security tests are included where applicable

## Known Security Considerations

### Current Architecture

1. **Database Access**: Uses PostgreSQL with parameterized queries
2. **GraphQL**: Apollo Server with authentication middleware
3. **REST API**: Express with helmet, CORS, and rate limiting
4. **AI Integration**: HuggingFace API (external service)
5. **Blockchain**: Optional Ethereum integration (Infura/Alchemy)

### Environment Variables

Critical environment variables that must be secured:

- `JWT_SECRET`: Used for token signing
- `DB_PASSWORD`: Database credentials
- `HUGGINGFACE_API_KEY`: AI service authentication
- `INFURA_PROJECT_ID` / `ALCHEMY_API_KEY`: Blockchain RPC access
- `PRIVATE_KEY`: Ethereum wallet key (if used)

**Never commit these to version control!**

## Additional Resources

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [GraphQL Security](https://graphql.org/learn/authorization/)

## Questions?

If you have questions about security that don't involve reporting a vulnerability, please open a GitHub Discussion or contact the maintainers.

---

Thank you for helping keep AppWhistler and its users safe!
