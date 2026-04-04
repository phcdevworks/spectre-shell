# Spectre Shell Agent Guide

This repository is maintained by PHCDevworks and is the application shell of
the Spectre suite.

## Mission

Coordinate thin shell startup for Spectre apps. This package bootstraps
downstream applications by loading shared styles, running route registration,
and handing startup off to the external router.

## Core Rules

1. Keep the shell focused on orchestration, not visual definition.
2. Preserve `bootstrapApp()` as the primary shared startup contract.
3. Coordinate routing setup without taking ownership of router internals.
4. Keep the package framework-agnostic and limited to vanilla TypeScript
   runtime concerns.
5. Do not move token meaning, styling primitives, or app-specific business
   logic into this package.
6. Prefer sensible defaults for shell startup while keeping boundaries explicit.
7. Keep exported contracts small, typed, and stable for downstream apps.

## Working Boundaries

- Design values and semantic meaning belong in
  `@phcdevworks/spectre-tokens`.
- Primitive styling contracts and reusable CSS implementation belong in
  `@phcdevworks/spectre-ui`.
- Router internals such as path matching, navigation behavior, and lifecycle
  sequencing belong in `@phcdevworks/spectre-shell-router` when routing is
  externalized there.
- Shell responsibilities belong here: bootstrap flow, root mounting, shared
  style initialization, route registration, and router startup coordination.
- App-specific state, feature logic, and domain behavior belong in downstream
  applications.

## Validation Flow

1. Update shell orchestration code, package docs, or package metadata as needed.
2. Confirm the README and agent guidance still describe the same ownership
   boundaries.
3. Run `npm run check`.
