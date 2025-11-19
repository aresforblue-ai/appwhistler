# GitHub Repository Settings Guide

This document outlines the recommended GitHub repository settings for AppWhistler to ensure optimal security, collaboration, and automation.

## General Settings

### Repository Details

- **Description**: Open-source AI-powered app recommender that fights disinformation through fact-checking and verification
- **Website**: https://github.com/aresforblue-ai/appwhistler
- **Topics**: `truth-tech`, `fact-checking`, `ai`, `blockchain`, `open-source`, `privacy`, `graphql`, `react`, `nodejs`
- **Include in the homepage**: ✅ Checked
- **Releases**: ✅ Checked
- **Packages**: ✅ Checked
- **Environments**: ✅ Checked

### Features

- **Wikis**: ❌ Disabled (use GitHub Pages or docs/ directory instead)
- **Issues**: ✅ Enabled
- **Sponsorships**: ✅ Enabled (if applicable)
- **Preserve this repository**: ✅ Consider enabling for long-term projects
- **Discussions**: ✅ Enabled (for Q&A and community engagement)
- **Projects**: ✅ Enabled (for project management)

### Pull Requests

- **Allow merge commits**: ✅ Enabled
- **Allow squash merging**: ✅ Enabled (Default)
- **Allow rebase merging**: ✅ Enabled
- **Always suggest updating pull request branches**: ✅ Enabled
- **Allow auto-merge**: ✅ Enabled
- **Automatically delete head branches**: ✅ Enabled

## Branch Protection Rules

### Main Branch (`main`)

#### Protection Rules

**Require pull request reviews before merging**
- ✅ Enabled
- Required approving reviews: 1 (or 2 for critical projects)
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require review from Code Owners (when CODEOWNERS file exists)
- ❌ Restrict who can dismiss pull request reviews (optional)

**Require status checks to pass before merging**
- ✅ Enabled
- ✅ Require branches to be up to date before merging
- Required status checks:
  - `Lint Code`
  - `Unit Tests`
  - `Integration Tests`
  - `Security Audit`
  - `Build`
  - `CodeQL Analysis` (when configured)

**Require conversation resolution before merging**
- ✅ Enabled

**Require signed commits**
- ⚠️ Optional but recommended for enhanced security

**Require linear history**
- ❌ Disabled (allow merge commits)

**Require deployments to succeed before merging**
- ❌ Disabled (unless using deployment gates)

**Lock branch**
- ❌ Disabled (allow pushes)

**Do not allow bypassing the above settings**
- ✅ Enabled
- Exceptions: Repository administrators (optional)

**Restrict who can push to matching branches**
- ⚠️ Optional - restrict to specific teams/users
- Allow force pushes: ❌ Disabled
- Allow deletions: ❌ Disabled

### Develop Branch (`develop`)

Similar to `main` but with slightly relaxed rules:
- Required approving reviews: 1
- All other settings same as `main`

## Security Settings

### Security & Analysis

**Dependency graph**
- ✅ Enabled

**Dependabot alerts**
- ✅ Enabled
- ✅ Email notifications enabled

**Dependabot security updates**
- ✅ Enabled

**Code scanning**
- ✅ Enabled
- Default setup using CodeQL
- Query suite: Security and Quality

**Secret scanning**
- ✅ Enabled
- ✅ Push protection enabled (prevents accidental secret commits)

**Private vulnerability reporting**
- ✅ Enabled

### Repository security advisories

- ✅ Enabled for reporting vulnerabilities privately

## Access & Permissions

### Collaborators and teams

- **Base permissions**: Read (for public repo)
- **Admin access**: Repository owner only
- **Maintain access**: Trusted maintainers
- **Write access**: Active contributors
- **Triage access**: Community moderators
- **Read access**: Public (default)

### Moderation options

- **Interaction limits**: Set temporary limits when needed
- **Code review limits**: None (allow anyone to review)

### Repository visibility

- **Public**: ✅ (for open source)
- Consider sponsors-only features if using GitHub Sponsors

## Actions Settings

### General

**Actions permissions**
- ✅ Allow all actions and reusable workflows

**Artifact and log retention**
- 90 days (default)

**Fork pull request workflows from outside collaborators**
- ✅ Require approval for first-time contributors
- ✅ Require approval for all outside collaborators

**Workflow permissions**
- Read repository contents and packages permissions
- ✅ Allow GitHub Actions to create and approve pull requests (for Dependabot)

### Secrets and variables

Required repository secrets:
- None at this time (all public)

Optional secrets for enhanced features:
- `CODECOV_TOKEN` - For code coverage reporting
- `SENTRY_AUTH_TOKEN` - For error tracking
- `DEPLOY_TOKEN` - For automated deployments

## Webhook Settings

### Webhooks (Optional)

Consider adding webhooks for:
- Slack/Discord notifications
- External CI/CD systems
- Deployment triggers
- Security monitoring

## Integrations & Apps

### Recommended GitHub Apps

1. **Codecov** - Code coverage reporting
2. **Sentry** - Error tracking and monitoring
3. **Dependabot** - Already enabled via native GitHub
4. **All Contributors** - Recognize all contributors
5. **ImgBot** - Automatic image optimization
6. **Mergify** - Advanced merge queue management

## Environments

### Production

**Deployment branches**: `main` only

**Environment protection rules**:
- ✅ Required reviewers: 1-2 administrators
- ✅ Wait timer: 0 minutes (or add delay for safety)
- ⚠️ Deployment branches: Only `main`

**Environment secrets**:
- Production database credentials
- API keys for production services
- Blockchain private keys (if needed)

### Staging

**Deployment branches**: `develop`, `main`

**Environment protection rules**:
- ✅ Required reviewers: 1
- ❌ Wait timer: 0 minutes

### Development

**Deployment branches**: Any branch

**Environment protection rules**: None

## Pages Settings

If using GitHub Pages for documentation:

### Source

- Deploy from a branch: `gh-pages` or `main` `/docs` folder
- Or use GitHub Actions for more control

### Custom Domain

- Configure custom domain if available
- ✅ Enforce HTTPS

## Advanced Settings

### Manage access tokens

- Fine-grained access tokens recommended over classic PATs
- Set minimum permissions required

### Archives

- ✅ Include Git LFS objects in archives

### Pushes

- Limit maximum number of pushes: Not configured (unlimited)

### Repository metadata

- ✅ Social preview image: Add a custom image for better social media sharing

## Notification Settings

### Watch settings (for maintainers)

- All Activity
- Get notified about all conversations

### Custom routing

- Configure email routing for different types of notifications

## Recommended Badges for README

Add these badges to your README.md:

```markdown
[![CI](https://github.com/aresforblue-ai/appwhistler/workflows/CI/badge.svg)](https://github.com/aresforblue-ai/appwhistler/actions/workflows/ci.yml)
[![CodeQL](https://github.com/aresforblue-ai/appwhistler/workflows/CodeQL%20Security%20Scan/badge.svg)](https://github.com/aresforblue-ai/appwhistler/actions/workflows/codeql.yml)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](package.json)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
```

## Checklist for Repository Setup

- [x] Repository description and topics configured
- [x] LICENSE file added
- [x] README.md with badges and documentation
- [x] CONTRIBUTING.md guide
- [x] CODE_OF_CONDUCT.md
- [x] SECURITY.md policy
- [x] Issue templates (bug, feature, security)
- [x] Pull request template
- [x] CODEOWNERS file
- [x] GitHub Actions workflows (CI, CodeQL, Dependabot)
- [x] .env.example for configuration
- [x] .gitignore properly configured
- [x] Branch protection rules (apply manually in GitHub UI)
- [ ] Dependabot alerts enabled (enable in GitHub UI)
- [ ] Secret scanning enabled (enable in GitHub UI)
- [ ] Code scanning with CodeQL (enable in GitHub UI)
- [ ] Discussions enabled (enable in GitHub UI)
- [ ] Environment setup for deployments (configure in GitHub UI)

## Maintenance Tasks

### Weekly
- Review and merge Dependabot PRs
- Triage new issues
- Review open pull requests

### Monthly
- Review and update dependencies
- Check security advisories
- Update documentation as needed
- Review branch protection rules

### Quarterly
- Audit access permissions
- Review and update security policies
- Clean up stale branches
- Update roadmap and milestones

## Additional Resources

- [GitHub Repository Settings Documentation](https://docs.github.com/en/repositories)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [GitHub Actions Security](https://docs.github.com/en/actions/security-guides)
- [Dependabot Configuration](https://docs.github.com/en/code-security/dependabot)
- [CodeQL Documentation](https://codeql.github.com/docs/)

---

Last Updated: 2025-11-19  
Maintained by: @aresforblue-ai
