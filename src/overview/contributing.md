---
title: Contributing
description: How to contribute to Nox
---

TODO

## Ways to Contribute

### Code Contributions

- Fix bugs and issues
- Implement new features
- Improve performance
- Add tests and examples

### Documentation

- Write guides and tutorials
- Improve API documentation
- Fix typos and clarifications
- Translate documentation

### Community

- Answer questions on Discord
- Help other developers
- Share your projects
- Provide feedback

## Getting Started

### 1. Set Up Development Environment

#### Prerequisites

- Node.js v18 or higher
- Git
- Text editor (VS Code recommended)

#### Clone the Repository

```bash
# Fork the repository first on GitHub
git clone https://github.com/YOUR_USERNAME/nox.git
cd nox

# Add upstream remote
git remote add upstream https://github.com/iExec-Nox/nox.git
```

#### Install Dependencies

```bash
npm install
```

#### Run Tests

```bash
npm test
```

### 2. Development Workflow

#### Create a Branch

```bash
git checkout -b feature/your-feature-name
```

#### Make Changes

- Write clear, maintainable code
- Follow existing code style
- Add tests for new features
- Update documentation

#### Test Your Changes

```bash
# Run all tests
npm test

# Run linter
npm run lint

# Check types
npm run type-check
```

#### Commit Your Changes

Follow our commit message conventions:

```bash
git commit -m "feat: add new encryption method"
git commit -m "fix: resolve ACL permission issue"
git commit -m "docs: update SDK documentation"
```

### 3. Submit a Pull Request

#### Push Your Branch

```bash
git push origin feature/your-feature-name
```

#### Create Pull Request

1. Go to GitHub repository
2. Click "New Pull Request"
3. Fill out the PR template
4. Link related issues
5. Request review

## Contribution Guidelines

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Auto-format code
npm run format

# Check for issues
npm run lint
```

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Test updates
- `refactor:` Code refactoring
- `chore:` Maintenance tasks

Examples:

```
feat: add batch encryption support
fix: resolve memory leak in KMS client
docs: update ACL method examples
```

### Testing

All code contributions should include tests:

```typescript
describe('encryptInput', () => {
  it('should encrypt data successfully', async () => {
    const result = await encryptInput('secret data');
    expect(result).toBeDefined();
  });
});
```

### Documentation

Update documentation for any API changes:

```typescript
/**
 * Encrypts input data for confidential computation
 * @param data - The data to encrypt
 * @param options - Encryption options
 * @returns Encrypted data payload
 */
export async function encryptInput(
  data: string,
  options?: EncryptOptions
): Promise<EncryptedPayload> {
  // Implementation
}
```

## Code Review Process

### What to Expect

1. **Automated Checks**: CI/CD runs tests and linters
2. **Maintainer Review**: Core team reviews your code
3. **Feedback**: You may be asked to make changes
4. **Approval**: Once approved, your PR will be merged

### Review Criteria

- **Functionality**: Does it work as intended?
- **Code Quality**: Is it maintainable and well-structured?
- **Tests**: Are there adequate tests?
- **Documentation**: Is it properly documented?
- **Security**: Are there any security concerns?

## Community Guidelines

### Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please read and follow our [Code of Conduct](https://github.com/iExec-Nox/nox/blob/main/CODE_OF_CONDUCT.md).

### Communication

- Be respectful and professional
- Provide constructive feedback
- Help others learn and grow
- Celebrate contributions

### Getting Help

- **Discord**: Ask questions in developer channels
- **GitHub Discussions**: For longer-form discussions
- **Office Hours**: Monthly community calls

## Recognition

We value all contributions! Contributors will be:

- Listed in our [Contributors page](https://github.com/iExec-Nox/nox/graphs/contributors)
- Mentioned in release notes
- Eligible for contributor rewards

## License

By contributing to Nox, you agree that your contributions will be licensed under the project's license.

---

Thank you for contributing to Nox! Together, we're building the future of confidential computing. 🚀
