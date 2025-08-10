# 🤝 Contributing to InfinityFire

Thank you for your interest in contributing to InfinityFire! This document provides guidelines and information for contributors.

## 🚀 Quick Start

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch
4. **Make** your changes
5. **Test** thoroughly
6. **Commit** with clear messages
7. **Push** to your fork
8. **Submit** a pull request

## 📋 Prerequisites

- Node.js 16+ and npm
- PostgreSQL database
- AWS S3 bucket (for testing)
- Git

## 🔧 Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/infinityfire.git
cd infinityfire

# Install dependencies
npm install
cd client && npm install && cd ..

# Copy environment template
cp env.example .env

# Edit .env with your credentials
nano .env

# Setup database
npm run db:setup

# Start development
npm run dev
# In another terminal: cd client && npm start
```

## 🌿 Branch Naming Convention

- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/urgent-fix` - Critical fixes
- `docs/documentation-update` - Documentation changes
- `refactor/component-name` - Code refactoring

## 📝 Commit Message Format

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting changes
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance tasks

**Examples:**
```
feat(auth): add password reset functionality
fix(files): resolve S3 download URL generation issue
docs(readme): update deployment instructions
```

## 🧪 Testing

### Backend Testing
```bash
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

### Manual Testing
- Test authentication flows
- Verify file browsing functionality
- Check responsive design on different devices
- Test admin panel features

## 🔍 Code Quality

### Backend Standards
- Use ES6+ features
- Follow Express.js best practices
- Implement proper error handling
- Add input validation
- Use async/await for database operations

### Frontend Standards
- Use functional components with hooks
- Follow React best practices
- Maintain consistent styling with Tailwind
- Ensure accessibility standards
- Add proper loading states

### General Standards
- Write clear, descriptive variable names
- Add JSDoc comments for complex functions
- Keep functions small and focused
- Use meaningful commit messages
- Update documentation when needed

## 📚 Documentation

When adding new features:
- Update README.md if needed
- Add inline code comments
- Update API documentation
- Include usage examples

## 🚨 Pull Request Process

1. **Ensure** your branch is up to date with main
2. **Test** your changes thoroughly
3. **Update** documentation if needed
4. **Submit** PR with clear description
5. **Respond** to review comments promptly
6. **Squash** commits if requested

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other

## Testing
- [ ] Backend tests pass
- [ ] Frontend tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing

## Screenshots
Add screenshots if UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

## 🐛 Bug Reports

When reporting bugs:
1. Use the bug report template
2. Provide clear reproduction steps
3. Include environment details
4. Add screenshots if applicable
5. Describe expected vs actual behavior

## 💡 Feature Requests

When requesting features:
1. Use the feature request template
2. Explain the problem being solved
3. Describe your proposed solution
4. Consider alternatives
5. Provide use case examples

## 📞 Getting Help

- **Issues**: Use GitHub issues for bugs and questions
- **Discussions**: Use GitHub discussions for general topics
- **Documentation**: Check README.md and SETUP.md first

## 🏷️ Labels

We use labels to organize issues and PRs:
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to docs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority: high` - Urgent issues

## 🎯 Good First Issues

New contributors can start with:
- Documentation improvements
- UI/UX enhancements
- Test coverage improvements
- Bug fixes with clear reproduction steps

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to InfinityFire! 🚀** 