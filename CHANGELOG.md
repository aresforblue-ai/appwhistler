# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive GitHub repository configuration
- LICENSE file (Apache 2.0)
- CONTRIBUTING.md with development guidelines
- CODE_OF_CONDUCT.md (Contributor Covenant)
- CODEOWNERS file for automated review assignments
- Enhanced SECURITY.md with detailed vulnerability reporting process
- GitHub issue templates (bug report, feature request, security report)
- Pull request template with comprehensive checklist
- CI/CD workflows (testing, linting, security scanning)
- CodeQL security scanning workflow
- Dependabot configuration for automated dependency updates
- Dependency review workflow for PRs

### Changed
- Updated SECURITY.md with comprehensive security guidelines

### Security
- Added automated security scanning via CodeQL
- Added npm audit in CI pipeline
- Configured Dependabot for dependency security updates

## [0.1.0] - 2025-11-19

### Added
- Initial release of AppWhistler
- React frontend with dark mode support
- Express + Apollo GraphQL backend
- PostgreSQL database integration
- HuggingFace AI fact-checking
- Ethereum blockchain verification (optional)
- WebSocket support for real-time updates
- JWT authentication
- Rate limiting and security headers
- Privacy-compliant data export/delete endpoints
- Ethical web scraper with robots.txt compliance
- Comprehensive test suite (unit, integration, e2e)

### Security
- Helmet.js for security headers
- bcrypt password hashing
- Account lockout protection
- Input validation and sanitization
- Parameterized SQL queries
- CORS configuration

[Unreleased]: https://github.com/aresforblue-ai/appwhistler/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/aresforblue-ai/appwhistler/releases/tag/v0.1.0
