# Contributing to AppWhistler

First off, thank you for considering contributing to AppWhistler! It's people like you that make AppWhistler a great tool for fighting disinformation.

## 🌟 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (code snippets, screenshots, etc.)
- **Describe the behavior you observed** and what you expected to see
- **Include your environment details** (OS, Node version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a step-by-step description** of the suggested enhancement
- **Explain why this enhancement would be useful** to most users
- **List any similar features** in other projects if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the coding style** of the project
3. **Add tests** if you're adding functionality
4. **Update documentation** as needed
5. **Ensure all tests pass** before submitting
6. **Write a clear commit message** describing your changes

## 🚀 Getting Started

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/YOUR-USERNAME/appwhistler.git
cd appwhistler

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Edit .env with your configuration

# Set up the database
psql -U postgres -d appwhistler -f database/schema.sql
npm run migrate

# Start development server
npm run dev
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests in watch mode
npm test -- --watch
```

## 📝 Code Style Guidelines

### JavaScript/Node.js

- Use **ES6+ features** (const/let, arrow functions, async/await)
- Use **2 spaces** for indentation
- Use **meaningful variable names** (no single letters except in loops)
- Add **JSDoc comments** for exported functions
- Keep functions **small and focused** (single responsibility)
- Prefer **async/await** over callbacks or raw promises

### Example:

```javascript
/**
 * Fetches and verifies a fact-check claim
 * @param {string} claim - The claim to verify
 * @param {string} category - Category of the claim
 * @returns {Promise<Object>} Verified fact-check result
 */
async function verifyFactCheck(claim, category) {
  // Implementation
}
```

### GraphQL

- Use **descriptive type names** and field names
- Add **descriptions** to types and fields
- Follow **schema-first design** principles
- Keep resolvers **thin** - business logic goes in separate modules

### Database

- Always use **parameterized queries** (never string interpolation)
- Add **indexes** for frequently queried columns
- Use **transactions** for multi-step operations
- Write **migration scripts** for schema changes

### React/Frontend

- Use **functional components** with hooks
- Follow **component composition** patterns
- Keep components **small and reusable**
- Use **PropTypes** or TypeScript for type checking
- Extract **custom hooks** for reusable logic

## 🔒 Security Guidelines

- **Never commit secrets** (.env files, API keys, private keys)
- **Validate all user input** on both client and server
- **Use parameterized SQL queries** to prevent injection
- **Sanitize HTML** before rendering user content
- **Report security vulnerabilities** privately (see SECURITY.md)

## 📋 Commit Message Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependencies

### Examples:

```
feat(fact-checker): add multi-language support

Implements language detection and translation for fact-checking
in Spanish, French, and German.

Closes #123
```

```
fix(api): resolve rate limiting bypass vulnerability

Adds user ID to rate limit key to prevent abuse across sessions.

Fixes #456
```

## 🧪 Testing Requirements

### Unit Tests

- Test **individual functions** in isolation
- Mock **external dependencies** (database, APIs)
- Aim for **80%+ code coverage**
- Test **edge cases** and error conditions

### Integration Tests

- Test **API endpoints** end-to-end
- Use **test database** (never production)
- Test **authentication** and authorization
- Verify **database transactions** work correctly

### E2E Tests

- Test **critical user flows** (signup, login, fact-checking)
- Test on **multiple browsers** if UI changes
- Keep tests **independent** and **idempotent**

## 🎯 Areas We Need Help With

### High Priority

- 🔐 Security auditing and penetration testing
- 🧪 Expanding test coverage (especially E2E)
- 📱 Mobile responsiveness improvements
- ♿ Accessibility (WCAG 2.1 AA compliance)
- 🌐 Internationalization (i18n) support

### Medium Priority

- 📊 Admin dashboard development
- 🔍 Search functionality enhancements
- 🤖 AI model improvements
- ⛓️ Smart contract optimizations
- 📈 Performance optimizations

### Good First Issues

Look for issues labeled `good-first-issue` - these are perfect for newcomers!

## 💬 Communication

- **GitHub Issues**: Bug reports, feature requests, discussions
- **Pull Requests**: Code reviews and feedback
- **Discussions**: General questions and community chat

## 📜 Code of Conduct

This project adheres to a Code of Conduct (see CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🎉 Recognition

Contributors will be:

- Listed in the project README (if desired)
- Credited in release notes for significant contributions
- Eligible for community badges and NFT rewards (post-launch)

## 📚 Additional Resources

- [Project Roadmap](LAUNCH_ROADMAP.md)
- [Security Policy](SECURITY.md)
- [API Documentation](docs/api/)
- [Architecture Overview](docs/)

## ❓ Questions?

Feel free to:

- Open a discussion on GitHub
- Check existing issues and discussions
- Review the documentation in the `docs/` folder

Thank you for contributing to the fight against disinformation! 🚀

---

**Remember**: Every contribution counts, no matter how small. Whether it's fixing a typo, reporting a bug, or implementing a feature - you're making a difference! ❤️
