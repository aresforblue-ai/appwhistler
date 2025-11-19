# AppWhistler — Truth-First App Recommender

[![CI](https://github.com/aresforblue-ai/appwhistler/workflows/CI/badge.svg)](https://github.com/aresforblue-ai/appwhistler/actions/workflows/ci.yml)
[![CodeQL](https://github.com/aresforblue-ai/appwhistler/workflows/CodeQL%20Security%20Scan/badge.svg)](https://github.com/aresforblue-ai/appwhistler/actions/workflows/codeql.yml)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](package.json)

Open-source AI-powered app recommender that fights disinformation through fact-checking and verification.

**Mission**  
Empower users with unbiased, verified app choices and evolve into a blockchain-secured truth ecosystem against fake news, images, and claims.

**Future**  
Expanding to NewsTruth, FinanceTruth, HealthTruth, and beyond.  
50% of any future proceeds auto-donated via smart contracts to truth DAOs.

Made with ❤️ in Beaumont, Texas by Tyler Hughes (@AppWhistler) — November 2025

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Testing & Quality](#testing--quality)
- [Privacy & Compliance](#privacy--compliance)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

## Features

✨ **AI-Powered Fact-Checking** - HuggingFace integration for intelligent verification  
🔒 **Blockchain Verification** - Optional Ethereum-based proof of authenticity  
⚡ **Real-Time Updates** - WebSocket support for live fact-check broadcasts  
🎨 **Modern UI** - React 18 + Tailwind with dark mode support  
🔐 **Privacy-First** - GDPR-compliant data export and deletion  
🛡️ **Security Hardened** - JWT auth, rate limiting, SQL injection protection  
📊 **GraphQL API** - Flexible querying with Apollo Server  
🤖 **Ethical Scraping** - Respects robots.txt and rate limits

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone https://github.com/aresforblue-ai/appwhistler.git
cd appwhistler

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env  # Edit with your configuration

# Initialize database
psql -U postgres -d appwhistler -f database/schema.sql

# Run development server (backend + frontend)
npm run dev
```

### Available Scripts

```bash
npm run dev         # Run both backend and frontend
npm run server      # Run backend only
npm run client      # Run frontend only
npm run test        # Run all tests with coverage
npm run test:unit   # Run unit tests
npm run test:integration  # Run integration tests
npm run test:e2e    # Run end-to-end tests
npm run scrape      # Run ethical web scraper
npm run audit:sql   # Check for SQL injection vulnerabilities
```

## Architecture

AppWhistler follows a modern full-stack architecture:

```
React Frontend (Vite + Tailwind)
        ↓
Apollo GraphQL + REST API (Express)
        ↓
Business Logic Layer
   ↙    ↓    ↘
PostgreSQL  HuggingFace AI  Ethereum (optional)
```

### Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- Apollo Client
- Socket.io Client

**Backend:**
- Node.js + Express
- Apollo Server (GraphQL)
- PostgreSQL with pg driver
- Socket.io for real-time updates

**AI & Blockchain:**
- HuggingFace Inference API
- Ethers.js (Infura/Alchemy)
- Puppeteer for scraping

**Security:**
- Helmet.js
- JWT authentication
- bcrypt password hashing
- express-rate-limit
- SQL injection protection

### Frontend Overview

- React 18 + Vite + Tailwind UI with discover/fact-check/profile tabs, live dark mode, and fact-check scaffolding.
- Run `npm run dev` for the full stack or `npm run client` to focus on the Vite app (see `src/frontend/README.md` for the full playbook).
- API calls point to `http://localhost:5000` by default and respect `VITE_API_URL` overrides so the UI stays in sync with the backend env.

## Testing & Quality

We maintain high code quality standards with comprehensive testing:

- **Unit Tests** - `tests/unit` directory, 80% coverage gate
- **Integration Tests** - GraphQL resolvers with in-memory PostgreSQL
- **E2E Tests** - Playwright browser automation
- **Load Tests** - Artillery performance scenarios
- **Security Audits** - SQL injection prevention, npm audit

```bash
npm run test           # All tests with coverage
npm run test:unit      # Unit tests only
npm run test:integration  # Integration tests
npm run test:e2e       # End-to-end browser tests
npm run test:load      # Load/performance tests
```

### Continuous Integration

All pull requests are automatically tested via GitHub Actions:
- ✅ Unit and integration tests
- 🔍 ESLint code quality checks
- 🔒 Security vulnerability scanning
- 🏗️ Build verification
- 📊 Code coverage reporting

## Privacy & Compliance

AppWhistler is built with privacy as a core principle:

### User Privacy Features

- **Data Export** - `POST /api/v1/privacy/export` - Download all your data in JSON format
- **Data Deletion** - `POST /api/v1/privacy/delete` - Request account anonymization
- **Privacy Policy** - `GET /api/v1/privacy/policy` - View current privacy policy
- **Minimal Data Collection** - Only essential information stored
- **Encryption** - Passwords hashed with bcrypt, sensitive data encrypted

### Security Features

- **JWT Authentication** - Secure 7-day token expiry
- **Rate Limiting** - Protection against abuse and DDoS
- **Account Lockout** - 5 failed attempts / 15 minutes
- **SQL Injection Prevention** - Parameterized queries only
- **XSS Protection** - Input sanitization with sanitize-html
- **Security Headers** - Helmet.js configuration
- **CORS** - Configurable allowed origins

```bash
npm run audit:sql  # Scan for SQL injection vulnerabilities
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with tests
4. Commit using conventional commits (`git commit -m 'feat: add amazing feature'`)
5. Push to your branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## Security

Security is paramount. Please review our [Security Policy](SECURITY.md) for:

- Reporting vulnerabilities
- Security best practices
- Supported versions
- Response timelines

**Do not report security vulnerabilities via public issues.** Use GitHub Security Advisories or email security@appwhistler.com.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](docs/)
- 💬 [GitHub Discussions](https://github.com/aresforblue-ai/appwhistler/discussions)
- 🐛 [Issue Tracker](https://github.com/aresforblue-ai/appwhistler/issues)
- 📧 Contact: Tyler Hughes

## Acknowledgments

Built with passion in Beaumont, Texas 🤠  
Powered by open source and the truth-tech community 🌟

---

**Star ⭐ this repo if you find it useful!**
