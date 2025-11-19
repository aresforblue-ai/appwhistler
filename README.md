# 🔍 AppWhistler — Truth-First App Recommender

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE.txt)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> Open-source AI-powered app recommender that fights disinformation through fact-checking and verification.

## 🎯 Mission

Empower users with unbiased, verified app choices and evolve into a blockchain-secured truth ecosystem against fake news, images, and claims.

## 🚀 Vision

Expanding to **NewsTruth**, **FinanceTruth**, **HealthTruth**, and beyond.  
50% of any future proceeds auto-donated via smart contracts to truth DAOs.

## ✨ Features

- 🤖 **AI-Powered Analysis** - HuggingFace integration for intelligent fact-checking
- ⛓️ **Blockchain Verification** - Ethereum-based proof of fact-checks
- 🔒 **Privacy First** - GDPR/CCPA compliant with data export and deletion
- 🎨 **Modern UI** - React 18 + Vite + Tailwind with dark mode
- 📊 **GraphQL API** - Efficient data fetching with Apollo Server
- 🔄 **Real-time Updates** - WebSocket support for live fact-checks

## 📋 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 14
- npm >= 9.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/aresforblue-ai/appwhistler.git
cd appwhistler

# Install dependencies
npm install

# Set up environment variables (see .env.example)
cp .env.example .env
# Edit .env with your configuration

# Set up database
psql -U postgres -d appwhistler -f database/schema.sql

# Run migrations
npm run migrate

# Start development server
npm run dev
```

## 🛠️ Development

```bash
# Start backend only
npm run server

# Start frontend only
npm run client

# Run scraper
npm run scrape

# Run tests
npm test                  # All tests with coverage
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests
npm run test:e2e         # End-to-end tests

# Deploy smart contract
npm run deploy:contract
```

Made with ❤️ in Beaumont, Texas by Tyler Hughes (@AppWhistler) — November 2025

## Frontend Overview

- React 18 + Vite + Tailwind UI with discover/fact-check/profile tabs, live dark mode, and fact-check scaffolding.
- Run `npm run dev` for the full stack or `npm run client` to focus on the Vite app (see `src/frontend/README.md` for the full playbook).
- API calls point to `http://localhost:5000` by default and respect `VITE_API_URL` overrides so the UI stays in sync with the backend env.

## Testing & Quality

- Unit tests live under `tests/unit` and run with `npm run test:unit` (80% global coverage gate).
- Integration tests exercise GraphQL resolvers against an in-memory Postgres via `npm run test:integration`.
- Playwright powers browser checks (`npm run test:e2e`), intercepting backend requests for deterministic runs.
- Lightweight load scenarios reside in `tests/load` (run locally with `npm run test:load`).
- Generate fresh API docs any time the schema or routes change: `npm run docs:graphql` and `npm run docs:rest`.

## Privacy & Compliance Highlights

- `POST /api/v1/privacy/export` — authenticated users can download a JSON export of their account, reviews, fact-checks, bounties, and recent activity logs.
- `POST /api/v1/privacy/delete` — anonymizes the requesting account, clears linked content, and logs the request for auditing.
- `GET /api/v1/privacy/policy` — serves the latest markdown privacy policy located at `docs/privacy-policy.md`.
- `npm run audit:sql` — static analysis script that blocks unsafe SQL string interpolation.
- GraphQL password reset helpers: `requestPasswordReset(email)` + `resetPassword(token, newPassword)` with configurable TTL (`PASSWORD_RESET_TOKEN_TTL_MIN`) and base URL (`PASSWORD_RESET_BASE_URL`).
- Account lockout protection defaults: 5 attempts / 15 minutes, override via `LOGIN_MAX_FAILED_ATTEMPTS` & `LOGIN_LOCKOUT_MINUTES`.
