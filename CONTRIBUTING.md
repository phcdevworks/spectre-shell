# Contributing

Thanks for helping improve `@phcdevworks/spectre-shell`. This package owns app bootstrap orchestration, so changes should keep the public surface thin and predictable.

## Workflow

1. Install dependencies with `npm install`.
2. Make the smallest focused change that solves the problem.
3. Update README or changelog notes when public behavior changes.
4. Run `npm run check` before opening a pull request.

## Project Standards

- Keep config files in TypeScript when the tool supports it.
- Keep bootstrap behavior focused on root setup, route registration, and readiness.
- Leave route matching to `@phcdevworks/spectre-shell-router`.
- Leave reactive primitive semantics to `@phcdevworks/spectre-shell-signals`.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
npm run test
npm run check
```

## Pull Requests

Describe the bootstrap behavior changed, call out downstream package impact, and include the commands you ran. Populate all sections of the PR template.

## Code of Conduct

By participating in this project, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
