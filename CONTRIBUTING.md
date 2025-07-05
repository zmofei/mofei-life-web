# Contributing to Mofei Life Web

**[中文版本 / Chinese Version](CONTRIBUTING_zh.md)**

Thank you for your interest in contributing to Mofei Life Web! This guide will help you get started with contributing to this project.

**Please note**: This is a personal blog project shared primarily for reference and learning purposes. While contributions are welcome, please understand that this project is tailored to the author's specific needs and backend services.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Style Guidelines](#style-guidelines)
- [Reporting Issues](#reporting-issues)

## 📜 Code of Conduct

This project follows standard open source community guidelines. Please be respectful, constructive, and inclusive in all interactions.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/mofei-life-web.git
   cd mofei-life-web
   ```

### Important Notes for Contributors

- **API Dependencies**: The project connects to the author's personal backend services. Some features may not work fully in your local environment.
- **Content**: Blog content and comments are managed through the author's API endpoints.
- **Focus Areas**: Most valuable contributions would be in UI/UX improvements, code optimization, bug fixes, and documentation enhancements.

## 🛠️ Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [lang]/            # Internationalization
│   └── actions/           # Server actions
├── components/            # React components
│   ├── Comments/          # Comment system
│   ├── Common/            # Shared components
│   ├── Home/              # Homepage components
│   └── ui/                # UI components
├── lib/                   # Utility functions
└── styles/               # Global styles
```

## 🔄 Making Changes

### Creating a Branch

Create a new branch for your feature or bug fix:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### Branch Naming Convention

- `feature/description` - for new features
- `fix/description` - for bug fixes
- `docs/description` - for documentation updates
- `style/description` - for styling changes
- `refactor/description` - for code refactoring

### Commit Messages

Write clear, descriptive commit messages:

```
feat: add WeChat QR code integration
fix: resolve mobile responsive issues
docs: update API documentation
style: improve comment section styling
refactor: optimize image loading performance
```

Use the conventional commit format:
- `feat:` - new features
- `fix:` - bug fixes
- `docs:` - documentation changes
- `style:` - formatting changes
- `refactor:` - code refactoring
- `test:` - adding tests
- `chore:` - maintenance tasks

## 📤 Submitting Changes

### Before Submitting

1. **Test your changes**: Ensure your code works as expected
2. **Run linting**: `npm run lint`
3. **Check for TypeScript errors**: `npm run build`
4. **Test in different browsers**: Chrome, Firefox, Safari, Edge
5. **Test mobile responsiveness**: Use browser dev tools

### Creating a Pull Request

1. Push your changes to your fork:
   ```bash
   git push origin your-branch-name
   ```

2. Create a pull request on GitHub with:
   - **Clear title**: Brief description of changes
   - **Detailed description**: What was changed and why
   - **Screenshots**: If UI changes were made
   - **Testing notes**: How to test the changes

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Style/UI improvement
- [ ] Refactoring

## Testing
- [ ] Tested locally
- [ ] Tested on mobile
- [ ] Tested in multiple browsers
- [ ] No TypeScript errors
- [ ] Linting passes

## Screenshots
(If applicable)

## Additional Notes
Any additional information or context
```

## 📝 Style Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new files
- **ESLint**: Follow the existing ESLint configuration
- **Prettier**: Code formatting is handled by Prettier
- **Imports**: Use absolute imports with `@/` prefix
- **Components**: Use functional components with hooks

### Component Guidelines

```typescript
// Good component structure
import React from 'react';
import { ComponentProps } from '@/types';

interface Props extends ComponentProps {
  title: string;
  isActive?: boolean;
}

export default function MyComponent({ title, isActive = false }: Props) {
  return (
    <div className="component-wrapper">
      <h1>{title}</h1>
    </div>
  );
}
```

### CSS/Styling

- **Tailwind CSS**: Use Tailwind classes for styling
- **Responsive Design**: Mobile-first approach
- **Dark Theme**: Ensure compatibility with dark theme
- **Accessibility**: Follow WCAG guidelines

### Naming Conventions

- **Files**: Use kebab-case for file names
- **Components**: Use PascalCase for component names
- **Variables**: Use camelCase for variables
- **Constants**: Use UPPER_SNAKE_CASE for constants

## 🐛 Reporting Issues

### Bug Reports

Include the following information:

1. **Description**: Clear description of the bug
2. **Steps to Reproduce**: Detailed steps to reproduce the issue
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: Browser, OS, device type
6. **Screenshots**: If applicable

### Feature Requests

1. **Problem**: What problem does this solve?
2. **Solution**: Proposed solution
3. **Alternatives**: Alternative solutions considered
4. **Context**: Additional context or screenshots

## 🏷️ Labels

We use the following labels:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `priority: high` - High priority issues
- `priority: medium` - Medium priority issues
- `priority: low` - Low priority issues

## 🤝 Community

- Be respectful and inclusive
- Help newcomers
- Share knowledge and best practices
- Provide constructive feedback

## 📞 Getting Help

If you need help or have questions:

1. Check existing issues and discussions
2. Create a new issue with the `question` label
3. Join community discussions

## 🙏 Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- Community acknowledgments

Thank you for contributing to Mofei Life Web! 🎉