# Changelog

All notable changes to AppWhistler will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

- Multi-language support for fact-checking
- Image and video verification
- Mobile native apps (iOS/Android)
- Browser extension for real-time fact-checking
- Enhanced AI models (Grok API integration)

## [0.1.0] - 2025-11-19

### Added - Core Features

#### Backend & API
- GraphQL API with Apollo Server for efficient data fetching
- REST API endpoints for trending apps and privacy operations
- PostgreSQL database with comprehensive schema
- JWT-based authentication with 7-day tokens
- Real-time WebSocket support via Socket.io for live fact-check updates
- Database connection pooling with health monitoring
- Rate limiting (global and per-user)
- Input sanitization and XSS protection
- Helmet.js security headers
- CORS configuration with environment-based origins

#### AI & Fact-Checking
- HuggingFace API integration for AI-powered analysis
- Google Fact Check API integration for external verification
- Sentiment analysis with emotional trigger detection
- Multi-source fact-check aggregation
- Caching layer for fact-check results
- Truth rating system (0-100 scale)

#### Blockchain Integration
- Ethereum smart contracts for fact-check verification
- Support for multiple networks (Goerli, Sepolia, Mainnet)
- Infura and Alchemy RPC provider support
- On-chain proof storage for immutable fact-checks
- Transaction history tracking
- Gas optimization strategies

#### Data Privacy & Compliance
- GDPR/CCPA compliance features
- User data export endpoint (JSON format)
- Account deletion with anonymization
- Privacy policy endpoint
- Password reset flow with email tokens
- Account lockout protection (5 attempts / 15 minutes)
- Audit logging for privacy operations

#### File Management
- IPFS integration via Pinata for decentralized storage
- Image upload and optimization with Sharp
- Avatar and app icon uploads
- Automatic image compression and thumbnail generation
- Support for PNG, JPEG, GIF formats

#### Frontend (React + Vite)
- Modern React 18 application with Vite bundler
- Tailwind CSS for responsive design
- Dark mode support with localStorage persistence
- Three main views: Discover, Fact-Check, Profile
- Onboarding flow with 7-step interactive tutorial
- Error boundaries with Sentry integration
- Loading states (skeletons, spinners, overlays)
- Toast notification system
- Profile customization (bio, avatar, social links)
- Responsive design (mobile, tablet, desktop)
- Accessibility improvements (ARIA labels, keyboard navigation)

#### Developer Experience
- Comprehensive test suite (Unit, Integration, E2E)
- Jest for unit and integration testing
- Playwright for end-to-end testing
- Artillery for load testing
- 80%+ test coverage target
- ESLint and Prettier for code quality
- Nodemon for hot reloading in development
- Database migration system (node-pg-migrate)
- GraphQL and REST API documentation generation
- SQL injection audit script

#### Scraping & Data Collection
- Ethical web scraper with Puppeteer
- robots.txt compliance
- Per-domain rate limiting
- Custom User-Agent (AppWhistlerBot)
- Headless browser automation
- Google Play Store app data collection

#### Performance Optimizations
- Redis caching for frequent queries
- Database indexing on key columns
- GraphQL query complexity limits
- Background job queue (BullMQ with in-memory fallback)
- CDN support for static assets (CloudFlare/CloudFront)
- Image lazy loading and optimization

#### Monitoring & Observability
- Sentry integration for error tracking
- Health check endpoints (/health, /health/db, /health/db-pool)
- Database connection pool metrics
- Request/response logging
- Performance monitoring

### Security

- Parameterized SQL queries throughout
- Password hashing with bcrypt
- JWT token validation and expiration
- Rate limiting to prevent abuse
- Input sanitization against XSS
- Security headers via Helmet.js
- Account lockout after failed login attempts
- Secure password reset flow
- Environment variable validation on startup

### Documentation

- Comprehensive README with setup instructions
- API documentation for GraphQL and REST endpoints
- Database schema documentation
- Email service setup guide
- CDN configuration guide
- File upload implementation guide
- Performance optimization documentation
- Testing strategy documentation
- Security best practices guide
- SQL audit guidelines
- Privacy policy template

### Infrastructure

- Node.js 18+ requirement
- PostgreSQL 14+ database
- Docker-ready configuration
- Environment-based configuration (.env)
- Support for multiple environments (dev, test, production)

---

## Version History Guidelines

### Categories

- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements

### Version Numbering

- **MAJOR** (x.0.0): Breaking changes, major redesigns
- **MINOR** (0.x.0): New features, backwards-compatible
- **PATCH** (0.0.x): Bug fixes, minor improvements

---

## Future Roadmap

See [LAUNCH_ROADMAP.md](LAUNCH_ROADMAP.md) for detailed future plans including:

- NewsTruth, FinanceTruth, HealthTruth expansions
- DAO treasury and smart contract donations
- NFT achievement badges
- Enhanced moderation tools
- Public API for researchers
- Partnerships with fact-checking organizations

---

[Unreleased]: https://github.com/aresforblue-ai/appwhistler/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/aresforblue-ai/appwhistler/releases/tag/v0.1.0
