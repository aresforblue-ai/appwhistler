# Security Policy

## 🛡️ Supported Versions

AppWhistler is currently in pre-launch development (v0.1.0). Security updates are being actively applied to the current version.

| Version | Supported          | Status      |
| ------- | ------------------ | ----------- |
| 0.1.x   | :white_check_mark: | Development |
| < 0.1   | :x:                | Deprecated  |

Once we reach v1.0.0 (public launch), we will provide security updates for:
- The latest major version
- The previous major version for critical vulnerabilities only

## 🚨 Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

### How to Report

We take security seriously. If you discover a security vulnerability, please report it privately:

1. **Email**: Send details to security@appwhistler.com (or create a private security advisory on GitHub)
2. **GitHub Security Advisory**: Use the "Security" tab → "Report a vulnerability" on our repository
3. **Include**:
   - Type of vulnerability
   - Step-by-step reproduction instructions
   - Potential impact assessment
   - Suggested fix (if you have one)

### What to Expect

- **Initial Response**: Within 48 hours of your report
- **Status Update**: We'll provide updates every 5-7 days on our progress
- **Resolution Timeline**: We aim to patch critical vulnerabilities within 7 days
- **Credit**: You'll be credited in our security acknowledgments (unless you prefer to remain anonymous)

### Vulnerability Assessment

We will evaluate reported vulnerabilities using the following criteria:

**Critical**: Immediate attention required
- Remote code execution
- SQL injection allowing data breach
- Authentication bypass
- Exposure of secrets/credentials

**High**: Fixed within 7 days
- XSS attacks with significant impact
- CSRF vulnerabilities
- Privilege escalation
- Data exposure vulnerabilities

**Medium**: Fixed within 30 days
- Limited XSS attacks
- Information disclosure (non-sensitive)
- Rate limiting bypass

**Low**: Fixed in next scheduled release
- Minor information disclosure
- Edge case vulnerabilities
- Low-impact issues

### Out of Scope

The following are typically not considered security vulnerabilities:
- Bugs that cannot be exploited for security impact
- Denial of Service (DoS) requiring excessive resources
- Social engineering attacks
- Physical attacks
- Vulnerabilities in third-party dependencies (report to them directly)
- Already known and documented issues

## 🔒 Security Best Practices

### For Contributors

When contributing to AppWhistler:

1. **Never commit secrets**: No API keys, passwords, or private keys in code
2. **Use parameterized queries**: Prevent SQL injection (see `docs/sql-audit.md`)
3. **Validate input**: Sanitize all user input on both client and server
4. **Follow secure coding guidelines**: See `CONTRIBUTING.md` for details
5. **Run security checks**: Use `npm audit` and our SQL audit script

### For Users

When deploying AppWhistler:

1. **Use strong secrets**: Generate long, random JWT secrets and API keys
2. **Enable HTTPS**: Never run production without SSL/TLS
3. **Keep dependencies updated**: Regularly run `npm audit fix`
4. **Secure your database**: Use strong passwords and restrict network access
5. **Monitor logs**: Watch for suspicious activity
6. **Rate limiting**: Configure appropriate rate limits for your use case
7. **Backup data**: Regular automated backups with encryption

## 🔐 Security Features

AppWhistler includes several security features out of the box:

- **Authentication**: JWT tokens with configurable expiration
- **Password Security**: Bcrypt hashing with salt rounds
- **Rate Limiting**: Global and per-user limits to prevent abuse
- **SQL Injection Protection**: Parameterized queries throughout
- **XSS Prevention**: Input sanitization with sanitize-html
- **CSRF Protection**: Token-based protection for state-changing operations
- **Security Headers**: Helmet.js configuration for common attacks
- **Account Lockout**: Failed login attempt protection
- **Audit Logging**: Privacy and security event logging
- **Input Validation**: Schema validation for all user inputs

## 📋 Security Checklist for Production

Before deploying to production:

- [ ] All `.env` secrets are strong and unique
- [ ] Database uses strong password and restricted network access
- [ ] SSL/TLS certificates configured and auto-renewing
- [ ] Rate limiting configured appropriately
- [ ] Sentry or similar error monitoring enabled
- [ ] Regular backup system in place
- [ ] Security headers reviewed and customized
- [ ] Dependencies audited (`npm audit`)
- [ ] SQL queries audited (`npm run audit:sql`)
- [ ] Penetration testing completed
- [ ] Incident response plan documented
- [ ] Team trained on security best practices

## 🏆 Security Acknowledgments

We gratefully acknowledge security researchers who help keep AppWhistler safe:

- *Your name could be here!* - Report a valid security vulnerability and get credited

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [GraphQL Security](https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html)
- [SQL Injection Prevention](docs/sql-audit.md)

## 🔄 Policy Updates

This security policy may be updated periodically. Check back regularly for the latest guidance.

**Last Updated**: November 19, 2025  
**Next Review**: Quarterly or after any security incident
