# GitHub Actions Workflows

This directory contains the CI/CD pipeline definitions for the `codezest-cache` library.

## Workflows

### 1. CI/CD Pipeline (`ci-cd.yml`)

This workflow handles the automated building, testing, and publishing of the package.

#### Triggers

- **Push to `main` or `develop`**: Runs the `build` job (Build & Test).
- **Pull Request to `main` or `develop`**: Runs the `build` job (Build & Test).
- **Push Tag (`v*`)**: Runs the `publish-github` job (Publish to GitHub Packages).

#### Jobs

1.  **Build & Test (`build`)**

    - **Runs on**: `ubuntu-latest`
    - **Steps**:
      - Checkout code.
      - Setup Node.js v20.
      - Install dependencies (`npm ci`).
      - Run Type Check (`tsc --noEmit`).
      - Build (`npm run build`).
      - Run Tests (`npm test`).

2.  **Publish (`publish-github`)**
    - **Runs on**: `ubuntu-latest`
    - **Depends on**: `build` (must pass first).
    - **Condition**: Only runs if the ref is a tag starting with `v` (e.g., `v1.0.0`).
    - **Permissions**: `packages: write`
    - **Steps**:
      - Checkout code.
      - Setup Node.js v20 with registry `npm.pkg.github.com`.
      - Install dependencies.
      - Build.
      - Publish to GitHub Packages using `GH_PAT` secret.

## Secrets Required

| Secret Name | Description                                        | Required For                            |
| ----------- | -------------------------------------------------- | --------------------------------------- |
| `GH_PAT`    | Personal Access Token with `write:packages` scope. | Publishing packages to GitHub Registry. |
