# Contributing to Spectre Shell

Thanks for helping improve Spectre Shell! This package is a thin, framework-agnostic app shell for the Spectre platform that combines routing, styling, and application bootstrapping.

## Development Philosophy

This app shell follows a **thin shell** approach:

### 1. Application Bootstrap

**Purpose**: Minimal glue between routing, styling, and initialization

**Exports**: Simple `bootstrapApp()` function and type definitions

**Rules**:

- Keep the API surface tiny—just bootstrapping functionality
- Bundle only essential dependencies (router + UI)
- No magic or hidden configuration
- All source files must be TypeScript with strict types

**Status**: v0.0.1 initial template release with router and UI integration

### 2. Dependency Integration

**Purpose**: Wire up router and UI framework seamlessly

**Ships**:

- `@phcdevworks/spectre-shell-router` for navigation
- `@phcdevworks/spectre-ui` for styling
- `@phcdevworks/spectre-tokens` for design tokens

**Rules**:

- Each dependency is independent and replaceable
- No tight coupling between components
- Clear separation of concerns
- Use TypeScript for type safety

**Status**: Basic integration ready for use

### 3. Build Configuration

**Purpose**: Compile TypeScript to JavaScript with proper types

**Key mechanism**:

- TypeScript compiler generates declarations
- Vitest for testing with jsdom
- ES modules only (no CommonJS)

**Rules**:

- All source code must compile cleanly
- Follow TypeScript strict mode
- Export types alongside runtime code

**Status**: Basic build pipeline ready

### Golden Rule (Non-Negotiable)

**The shell should be boring, transparent, and easy to delete.**

Spectre Shell ships compiled JavaScript + type declarations from `dist/`.

- If it's configuration → belongs in `tsconfig.json`
- If it's source code → belongs in `src/`
- If it's bootstrap logic → belongs in `src/bootstrap.ts`

## Development Setup

1. Clone the repository:

```bash
git clone https://github.com/phcdevworks/spectre-shell.git
cd spectre-shell
```

2. Install dependencies:

```bash
npm install
```

3. Build the package (compiles TypeScript):

```bash
npm run build
# or for testing with watch mode:
npm run test
```

## Project Structure

```
spectre-shell/
├── src/
│   ├── bootstrap.ts      # App bootstrap logic
│   ├── styles.ts         # Style imports
│   └── index.ts          # Entry point
├── dist/                 # Built assets (generated)
├── tsconfig.json         # TypeScript configuration
└── package.json
```

**Responsibilities**:

- **App developers**: Use the shell to bootstrap applications
- **Shell maintainers**: Update bootstrap logic and dependencies
- **Config maintainers**: Update TypeScript configs
- **Build engineers**: Update build pipeline when structure changes

## Contribution Guidelines

### Shell Development

1. **Keep it thin** – This shell intentionally has a minimal API surface
2. **Type everything** – Use TypeScript strict mode, avoid `any`
3. **Document dependencies** – Shell only bootstraps, doesn't implement features
4. **Test your changes** – Run `npm run build` before committing

### Source File Development

- Use TypeScript for type safety
- Follow modern ES module patterns
- Add comments for complex logic
- Export types alongside runtime code
- Keep bootstrap logic simple and transparent

### Configuration Changes

- Follow TypeScript best practices
- Keep configuration minimal
- Document changes in commit messages
- Test that build still works

### Code Quality

- Use modern TypeScript + ES modules
- Run `npm run build` before committing
- Run `npm test` to ensure all tests pass
- Keep the API surface minimal
- Add comments for complex logic

### Documentation

- Update README.md when adding features
- Include code examples for new features
- Document breaking changes in commit messages
- Keep inline comments clear and concise

## Pull Request Process

1. **Branch from `main`**
2. **Make your changes** and test locally (`npm run build`)
3. **Run build** to ensure compilation works (`npm run build`)
4. **Update documentation** (README.md, comments) to reflect changes
5. **Open a PR** describing:
   - The motivation for the change
   - What was changed
   - Testing notes
6. **Respond to feedback** and make requested changes

## Known Gaps (Not Done Yet)

- Plugin system for extensibility
- Additional lifecycle hooks
- Error boundary integration
- State management integration examples
- Server-side rendering support
- Progressive web app features

## Questions or Issues?

Please open an issue or discussion on GitHub if you're unsure about the best approach for a change. Coordinating early avoids conflicts with:

- Shell design philosophy (thin by design)
- Dependency management
- TypeScript type safety

## Code of Conduct

This project adheres to the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
