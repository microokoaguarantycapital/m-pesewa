# Security Policy

## Reporting a Vulnerability

We take the security of M-Pesewa very seriously. If you believe you have found a security vulnerability, please report it to us as described below.

**Please do NOT report security vulnerabilities through public GitHub issues, discussions, or pull requests.**

Instead, please report them via our secure channels:

### Primary Method: Security Email
- **Email**: security@mpesewa.com
- **Subject**: SECURITY VULNERABILITY - M-Pesewa PWA
- **PGP Key**: Available at https://m-pesewa.com/security/pgp-key.txt

### Secondary Method: Encrypted Form
- **Secure Form**: https://m-pesewa.com/security/report
- **Encryption**: End-to-end encrypted submission

### What to Include in Your Report
1. **Type of issue** (e.g., XSS, CSRF, SQL injection, authentication bypass)
2. **Full URL** where the vulnerability exists
3. **Step-by-step instructions** to reproduce the issue
4. **Proof of concept** (screenshots, videos, or code)
5. **Impact assessment** (what data could be accessed or modified)
6. **Suggested fix** (if any)
7. **Your contact information** (for follow-up questions)

## Security Response Process

1. **Acknowledgement**: We will acknowledge receipt of your report within 24 hours
2. **Investigation**: Our security team will investigate the issue within 3 business days
3. **Verification**: We will verify the vulnerability and assess its impact
4. **Fix Development**: We will develop a fix and test it thoroughly
5. **Deployment**: We will deploy the fix in our next security release
6. **Disclosure**: We will coordinate public disclosure with you

## Security Updates

Security updates are released as patch versions (e.g., 2.0.1, 2.0.2). We recommend:

- **Regular Updates**: Always use the latest version of M-Pesewa
- **Security Announcements**: Subscribe to security@mpesewa.com for announcements
- **Automated Updates**: Enable automatic updates in your deployment

## Supported Versions

| Version | Status          | Security Updates Until |
|---------|-----------------|------------------------|
| 2.x.x   | ✅ Active       | Current + 24 months    |
| 1.5.x   | ⚠️ Maintenance  | 2024-06-30            |
| 1.0.x   | ❌ Deprecated   | None                   |

## Security Features

### Platform Security
- **HTTPS Enforcement**: All traffic forced to HTTPS
- **Content Security Policy (CSP)**: Strict CSP headers
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **CORS Policy**: Strict CORS configuration
- **Rate Limiting**: API rate limiting and DDoS protection
- **Input Validation**: Server-side and client-side validation

### Authentication Security
- **Password Requirements**: 8-12 characters, mixed case, numbers, symbols
- **Account Lockout**: 5 failed attempts lock account for 15 minutes
- **Session Management**: Secure, HTTP-only cookies with SameSite
- **Multi-Factor Authentication**: Optional 2FA for lenders
- **Device Management**: View and manage active sessions

### Data Security
- **Encryption at Rest**: All sensitive data encrypted
- **Encryption in Transit**: TLS 1.2+ for all communications
- **Data Minimization**: Only collect necessary data
- **Regular Backups**: Encrypted backups stored securely
- **Data Deletion**: Complete user data deletion on request

### Financial Security
- **No Fund Handling**: Platform never handles user funds
- **Audit Trails**: Complete audit logs for all financial transactions
- **Reconciliation**: Daily ledger reconciliation checks
- **Fraud Detection**: Automated fraud detection system

## Security Testing

### Regular Security Audits
- **Quarterly External Audits**: By independent security firms
- **Monthly Internal Audits**: By our security team
- **Continuous Monitoring**: 24/7 security monitoring

### Vulnerability Scanning
- **Daily Automated Scans**: For OWASP Top 10 vulnerabilities
- **Weekly Dependency Scans**: For vulnerable dependencies
- **Monthly Penetration Tests**: By certified ethical hackers

### Code Security
- **Static Analysis**: All code scanned with SAST tools
- **Dynamic Analysis**: Runtime security analysis
- **Dependency Checking**: Regular updates of all dependencies

## Security Best Practices for Users

### For Lenders
1. **Use Strong Passwords**: Unique passwords for M-Pesewa
2. **Enable 2FA**: For additional security on lender accounts
3. **Monitor Activity**: Regularly check your lending activity
4. **Report Suspicious Activity**: Immediately report anything unusual
5. **Keep Software Updated**: Use updated browsers and devices

### For Borrowers
1. **Protect Personal Information**: Never share login credentials
2. **Verify Requests**: Confirm loan requests are legitimate
3. **Secure Devices**: Use password-protected devices
4. **Log Out**: Always log out from public computers
5. **Report Issues**: Report any security concerns immediately

### For Group Admins
1. **Verify Members**: Thoroughly verify new group members
2. **Monitor Group Activity**: Regularly review group activity
3. **Enforce Rules**: Enforce group lending rules consistently
4. **Report Defaulters**: Report defaulters to the platform promptly
5. **Educate Members**: Share security best practices with members

## Incident Response Plan

### Level 1: Low Severity
- **Examples**: Minor UI issues, information disclosure without sensitive data
- **Response Time**: 5 business days
- **Communication**: Internal only

### Level 2: Medium Severity
- **Examples**: Authentication bypass, data exposure of non-sensitive data
- **Response Time**: 3 business days
- **Communication**: Internal + affected users

### Level 3: High Severity
- **Examples**: Financial data exposure, account takeover, funds at risk
- **Response Time**: 24 hours
- **Communication**: Internal + affected users + regulatory bodies

### Level 4: Critical Severity
- **Examples**: Platform compromise, widespread data breach
- **Response Time**: Immediate
- **Communication**: Internal + all users + regulatory bodies + public disclosure

## Responsible Disclosure Policy

We follow responsible disclosure practices:

1. **No Public Disclosure**: Do not disclose vulnerabilities publicly before we fix them
2. **Reasonable Timeframe**: Allow us 90 days to fix issues before public disclosure
3. **Coordination**: Work with us to coordinate public disclosure
4. **No Legal Action**: We will not take legal action against security researchers acting in good faith

## Security Hall of Fame

We acknowledge security researchers who help us improve our security:

| Researcher | Vulnerability | Date | Bounty |
|------------|---------------|------|--------|
| Coming Soon | - | - | - |

## Security Bounty Program

We offer bounties for security vulnerabilities:

### Bounty Tiers
- **Critical**: $1,000 - $5,000
- **High**: $500 - $1,000
- **Medium**: $100 - $500
- **Low**: $25 - $100

### Eligibility Criteria
1. First reporter of the vulnerability
2. Clear, reproducible report with proof of concept
3. Vulnerability in M-Pesewa codebase (not third-party services)
4. Not previously known or reported
5. Compliance with responsible disclosure

### Exclusions
- Social engineering attacks
- Physical security issues
- Denial of service attacks
- Issues in third-party services we use
- Already known vulnerabilities

## Contact Information

### Security Team
- **Primary Contact**: security@mpesewa.com
- **Emergency Contact**: +254 700 SECURE (732873) - Kenya only
- **PGP Key**: https://m-pesewa.com/security/pgp-key.txt

### Technical Support
- **General Support**: support@mpesewa.com
- **Phone**: Country-specific numbers in footer

### Legal Department
- **Legal Inquiries**: legal@mpesewa.com
- **Data Protection Officer**: dpo@mpesewa.com

## Security Resources

- **Security Documentation**: https://m-pesewa.com/security/docs
- **Security Blog**: https://m-pesewa.com/blog/security
- **Security Advisories**: https://m-pesewa.com/security/advisories
- **Security Training**: https://m-pesewa.com/security/training

## Updates to This Policy

This security policy may be updated periodically. The latest version will always be available at:
https://github.com/m-pesewa/m-pesewa-pwa/security.md

**Last Updated**: January 24, 2024
**Version**: 2.0.0