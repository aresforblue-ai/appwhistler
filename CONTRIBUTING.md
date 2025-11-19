# Contributing to AppWhistler

Thank you for your interest in contributing to AppWhistler! We're building a privacy-first app intelligence platform that fights disinformation through AI-powered fact-checking and blockchain verification.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Submitting Changes](#submitting-changes)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL database
- Git

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/appwhistler.git
   cd appwhistler
   ```

3. **Add the upstream repository** as a remote:
   ```bash
   git remote add upstream https://github.com/aresforblue-ai/appwhistler.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Set up environment variables**:
   - Copy `.env.example` to `.env` (if available)
   - Configure required variables:
     - `DB_*` - Database credentials
     - `JWT_SECRET` - Secret for JWT tokens
     - `HUGGINGFACE_API_KEY` - For AI fact-checking
     - Optional: `INFURA_PROJECT_ID` or `ALCHEMY_API_KEY` for blockchain features

6. **Set up the database**:
   ```bash
   psql -U postgres -d appwhistler -f database/schema.sql
   ```

7. **Run the development server**:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Working on a Feature

1. **Sync with upstream**:
   ```bash
   git checkout main
   git pull upstream main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** with frequent commits:
   ```bash
   git add .
   git commit -m "descriptive commit message"
   ```

4. **Keep your branch updated**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

## Coding Standards

### General Guidelines

- Write clean, readable, and maintainable code
- Follow existing code style and patterns
- Add comments for complex logic
- Keep functions small and focused
- Use meaningful variable and function names

### JavaScript/Node.js

- Use ES6+ features
- Use `const` by default, `let` when reassignment is needed
- Avoid `var`
- Use arrow functions for callbacks
- Use async/await over raw promises
- Destructure objects when appropriate

### GraphQL

- Use descriptive names for queries and mutations
- Always provide proper types
- Include pagination for list queries
- Use dataloaders to prevent N+1 queries

### Database

- Always use parameterized queries (`$1`, `$2`, etc.)
- Use UUIDs for primary keys
- Prefer server-side timestamps
- Serialize JSON with `JSON.stringify` before inserts

### Security

- Never commit secrets or API keys
- Always validate and sanitize user input
- Use `requireAuth(context)` for protected operations
- Follow the principle of least privilege

## Testing Guidelines

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration

# Run end-to-end tests
npm run test:e2e

# Run with coverage
npm run test -- --coverage
```

### Writing Tests

- Write tests for all new features
- Maintain at least 80% code coverage
- Use descriptive test names
- Follow the Arrange-Act-Assert pattern
- Mock external dependencies
- Test edge cases and error conditions

### Test Structure

```javascript
describe('Component/Function Name', () => {
  describe('method or functionality', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = someFunction(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

## Submitting Changes

### Pull Request Process

1. **Ensure your code passes all checks**:
   ```bash
   npm run test
   npm run lint
   ```

2. **Update documentation** if needed

3. **Create a Pull Request** with:
   - Clear title describing the change
   - Detailed description of what and why
   - Link to related issues
   - Screenshots for UI changes

4. **Address review feedback** promptly

5. **Ensure CI passes** before merging

### Pull Request Template

Your PR should include:

- **What**: Brief summary of changes
- **Why**: Motivation and context
- **How**: Implementation approach
- **Testing**: How changes were tested
- **Screenshots**: For visual changes
- **Checklist**:
  - [ ] Tests added/updated
  - [ ] Documentation updated
  - [ ] No breaking changes (or documented)
  - [ ] CI passes

### Commit Messages

Follow conventional commit format:

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tooling changes

**Examples:**
```
feat(api): add fact-check verification endpoint

Implements POST /api/v1/fact-check endpoint with AI verification
and blockchain storage integration.

Closes #123
```

## Reporting Bugs

### Before Submitting

- Check if the bug has already been reported
- Verify the bug exists in the latest version
- Collect relevant information

### Bug Report Template

When creating a bug report, include:

- **Description**: Clear description of the bug
- **Steps to Reproduce**:
  1. Step one
  2. Step two
  3. See error
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**:
  - OS: [e.g., Ubuntu 22.04]
  - Node version: [e.g., 18.17.0]
  - Browser: [e.g., Chrome 120]
- **Logs/Screenshots**: Any relevant output
- **Additional Context**: Other helpful information

## Suggesting Enhancements

### Enhancement Proposal Template

When suggesting enhancements, include:

- **Summary**: Brief description
- **Motivation**: Why this is needed
- **Detailed Description**: How it should work
- **Alternatives**: Other approaches considered
- **Additional Context**: Screenshots, mockups, examples

## Community

- **Issues**: [GitHub Issues](https://github.com/aresforblue-ai/appwhistler/issues)
- **Discussions**: [GitHub Discussions](https://github.com/aresforblue-ai/appwhistler/discussions)

## License

By contributing to AppWhistler, you agree that your contributions will be licensed under the Apache License 2.0.

## Questions?

Feel free to open an issue or discussion if you have questions about contributing!

---

Thank you for contributing to AppWhistler! Together we're building a more trustworthy app ecosystem. 🚀
