# ThrumHub

A registry and CLI for discovering and managing OpenClaw heartbeat snippets.

## Repository Structure

```
.
├── packages/
│   ├── shared/   # Shared types (@thrumhub/shared)
│   ├── cli/      # CLI tool (thrum)
│   └── web/      # Next.js registry UI (thrumhub.com)
└── package.json  # npm workspaces root
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Setup

```bash
git clone <repo-url>
cd thrumhub
npm install
```

### Development

Build order matters — shared must build before cli or web.

```bash
# Build everything
npm run build:shared && npm run build:cli && npm run build:web

# Run the web app locally
npm run dev:web

# Build individual packages
npm run build:shared
npm run build:cli
npm run build:web
```

### Using the CLI locally

```bash
npm run build:shared && npm run build:cli
npm link --workspace=packages/cli
thrum --help
```

To switch between local and production APIs:

```bash
thrum config set apiUrl http://localhost:3000   # local dev
thrum config set apiUrl https://thrumhub.com    # prod
```

## Packages

### `packages/shared`

Shared TypeScript types used by both the CLI and web app. Published as `@thrumhub/shared`.

### `packages/cli`

The `thrum` CLI for managing heartbeat snippets. Published as `thrumhub`.

Commands:
- `thrum init` — Initialize HEARTBEAT.md with thrum-zone markers
- `thrum search <query>` — Search the registry (`-c` category, `-f` frequency)
- `thrum add <id>` — Install a snippet
- `thrum remove <id>` — Remove an installed snippet
- `thrum list` — List installed snippets
- `thrum doctor` — Validate setup
- `thrum config get|set` — Manage CLI configuration

### `packages/web`

Next.js 15 app serving the ThrumHub registry UI. Uses NextAuth (GitHub OAuth), Neon PostgreSQL, and Tailwind CSS.

## Publishing

Publish shared first, then the CLI. VS Code tasks are configured for this, or run manually:

```bash
# Publish shared (bumps patch version automatically)
cd packages/shared && npm version patch --no-git-tag-version && npm run build && npm publish --access public

# Publish CLI
cd packages/cli && npm version patch --no-git-tag-version && npm run build && npm publish
```
