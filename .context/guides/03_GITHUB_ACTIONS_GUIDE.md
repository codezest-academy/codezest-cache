# GitHub Actions & Package Publishing Guide

This guide explains the CI/CD pipeline used in `codezest-db` and how to replicate it for `codezest-cache` and other services.

## 1. Workflow Overview

The pipeline is defined in `.github/workflows/ci-cd.yml` and consists of two main jobs:

1.  **Build & Test**: Runs on every push to `main` and `develop`.
    - Installs dependencies (`npm ci`).
    - Generates Prisma Client (if applicable).
    - Runs type checks (`npm run typecheck`).
    - Builds the package (`npm run build`).
2.  **Publish**: Runs **only** when a tag starting with `v` (e.g., `v1.0.0`) is pushed.
    - Publishes the package to **GitHub Packages** registry.

## 2. Configuration Requirements

To enable this workflow for `codezest-cache` (or any new repo), ensure the following files are configured correctly.

### 2.1 `package.json`

Ensure the `publishConfig` points to the GitHub registry.

```json
{
  "name": "@codezest-academy/codezest-cache",
  "version": "1.0.0",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com/"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/codezest-academy/codezest-cache.git"
  }
}
```

### 2.2 `.npmrc`

This file tells local npm to look at GitHub for `@codezest-academy` packages.

```ini
@codezest-academy:registry=https://npm.pkg.github.com/
```

### 2.3 Secrets (`GH_PAT`)

The workflow uses a secret named `GH_PAT` (Personal Access Token) to authenticate with the registry.

- **Why not `GITHUB_TOKEN`?** The default token often lacks permissions to read/write packages across different repositories in an organization context, or to trigger downstream workflows.
- **Setup**:
  1.  Go to Repository Settings -> Secrets and variables -> Actions.
  2.  Add `GH_PAT` with a token that has `write:packages` and `read:packages` scopes.

## 3. The Workflow File (`.github/workflows/ci-cd.yml`)

Copy this file to `codezest-cache/.github/workflows/ci-cd.yml`.

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
    tags:
      - "v*" # Trigger on version tags
  pull_request:
    branches: [main, develop]

jobs:
  # ------------------------------------------------------------------
  # BUILD & TEST
  # ------------------------------------------------------------------
  build:
    name: Build & Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      # Only for services using Prisma
      # - name: Generate Prisma
      #   run: npx prisma generate

      - name: Type check
        run: npm run typecheck

      - name: Build
        run: npm run build

  # ------------------------------------------------------------------
  # PUBLISH (Tags Only)
  # ------------------------------------------------------------------
  publish-github:
    name: Publish to GitHub Packages
    runs-on: ubuntu-latest
    needs: build
    if: startsWith(github.ref, 'refs/tags/v')
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          registry-url: "https://npm.pkg.github.com"
          scope: "@codezest-academy"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Publish
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GH_PAT }}
```

## 4. How to Publish a New Version

1.  **Update Version**: Bump the version in `package.json` (e.g., `1.0.0` -> `1.0.1`).
2.  **Commit**: `git commit -am "chore: bump version to 1.0.1"`
3.  **Tag**: `git tag v1.0.1`
4.  **Push**: `git push origin main --tags`

The GitHub Action will detect the tag `v1.0.1` and automatically run the `publish-github` job.
