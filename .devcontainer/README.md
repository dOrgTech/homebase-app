# GitHub Codespaces Configuration

This directory contains the configuration for GitHub Codespaces and prebuilds.

## Configuration Overview

The `devcontainer.json` file configures:

- **Base Image**: Node.js 22 (matching `.nvmrc`)
- **Package Manager**: Yarn 1.22.22
- **Prebuild Command**: `yarn install` (runs via `onCreateCommand`)
- **VS Code Extensions**:
  - ESLint for linting
  - Prettier for code formatting
  - Playwright for E2E testing

## Enabling Prebuilds

To enable prebuilds for this repository (requires admin access):

1. Go to the repository settings on GitHub
2. Navigate to **Codespaces** → **Prebuilds**
3. Click **Set up prebuild**
4. Configure the prebuild:
   - **Configuration**: Select `.devcontainer/devcontainer.json`
   - **Region**: Choose your preferred regions
   - **Trigger**: Select branches (e.g., `main`, `develop`)
   - **Schedule**: Choose how often to rebuild (e.g., on push, scheduled)
5. Click **Create**

For more information, see the [GitHub documentation on configuring prebuilds](https://docs.github.com/en/codespaces/prebuilding-your-codespaces/configuring-prebuilds).

## Benefits

With prebuilds enabled:
- Faster Codespace startup times
- Dependencies (`node_modules`) are pre-installed
- Consistent development environment across all team members
