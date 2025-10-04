# Contributing to FocusFix

Thank you for your interest in contributing to FocusFix! We welcome contributions from the accessibility community and appreciate your help in making the web more accessible.

## 🎯 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🚀 How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

- Clear description of the issue
- Steps to reproduce the behavior
- Expected vs actual behavior
- Browser and extension version
- Screenshots if applicable

### Suggesting Features

Feature suggestions are welcome! Please:

- Check if the feature already exists in our [roadmap](ROADMAP.md)
- Provide clear use cases and benefits
- Consider accessibility implications
- Be open to discussion and iteration

### Code Contributions

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/focusfix-extension.git
   cd focusfix-extension
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow our [coding standards](#coding-standards)
   - Add tests for new functionality
   - Update documentation as needed

4. **Test Your Changes**
   ```bash
   npm run validate
   npm test
   ```

5. **Commit Your Changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```

6. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Coding Standards

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or modifying tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add color contrast enhancement
fix: resolve focus trap in modal dialogs
docs: update installation instructions
test: add unit tests for tabindex repair
```

### Code Style

- Use ESLint and Prettier configurations
- Follow accessibility best practices
- Write clear, self-documenting code
- Add comments for complex logic
- Maintain consistent naming conventions

### Testing Requirements

- Write unit tests for new functions
- Include integration tests for DOM manipulation
- Test across multiple browsers when possible
- Maintain minimum 90% test coverage

## 🏗️ Development Setup

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Firefox Developer Edition for testing

### Installation

```bash
# Install dependencies
npm install

# Run development validation
npm run validate

# Start development
npm run dev:firefox
```

### Project Structure

```
focusfix-extension/
├── background/     # Background scripts
├── content/        # Content scripts
├── popup/          # Extension popup
├── options/        # Settings page
├── utils/          # Shared utilities
├── tests/          # Test suites
├── docs/           # Documentation
└── icons/          # Extension icons
```

## 🧪 Testing Guidelines

### Running Tests

```bash
# Full test suite
npm test

# Linting
npm run lint

# Format check
npm run format:check
```

### Writing Tests

- Test files should end with `.test.js`
- Use descriptive test names
- Mock DOM elements and browser APIs
- Test edge cases and error conditions

## 📚 Documentation

When contributing:

- Update relevant documentation files
- Add JSDoc comments for new functions
- Update CHANGELOG.md for notable changes
- Consider updating README.md if needed

## 🎯 Accessibility Guidelines

Since this is an accessibility extension:

- Follow WCAG 2.1 AA guidelines
- Test with keyboard navigation only
- Verify screen reader compatibility
- Consider users with various disabilities
- Avoid assumptions about user capabilities

## 🤝 Community

- Be respectful and inclusive
- Help others learn and grow
- Share knowledge and experience
- Follow our Code of Conduct

## 🏆 Recognition

Contributors will be:

- Listed in CHANGELOG.md for significant contributions
- Mentioned in release notes
- Invited to be maintainers based on sustained contributions

## 📞 Getting Help

- Open an issue for questions
- Join our discussions for broader topics
- Email [contributors@focusfix.tools](mailto:contributors@focusfix.tools)

Thank you for helping make the web more accessible! 🎉