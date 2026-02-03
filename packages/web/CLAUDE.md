# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **web package** of Thrumhub, a Next.js application that serves as a registry/discovery UI for OpenClaw heartbeat snippets. It's part of an npm workspaces monorepo at the root (`thrumhub/`), alongside `packages/cli` (CLI tool) and `packages/shared` (shared types).

## Commands

```bash
# Development server
npm run dev                              # from this package
npm run dev:web                          # from monorepo root

# Build
npm run build                            # build this package
npm run build --workspaces               # build all packages (from root)

# Build order matters: shared must build before web or cli
npm run build:shared && npm run build:web  # from root
```

There are no test or lint scripts configured.

## Architecture

### Tech Stack
- Next.js 15 with React 19, App Router
- NextAuth 4 (GitHub OAuth)
- Neon serverless PostgreSQL (`@neondatabase/serverless`)
- Tailwind CSS 4

### Key Directories
- `src/app/` — App Router pages and API routes
- `src/app/api/snippets/` — REST API for snippet CRUD (GET/POST on collection, GET/PUT/DELETE on `[id]`)
- `src/app/api/snippets/[id]/raw/` — Raw snippet content endpoint (used by CLI)
- `src/lib/auth.ts` — NextAuth config with GitHub provider; session includes DB user ID
- `src/lib/db.ts` — Neon database connection pool
- `src/lib/queries.ts` — All SQL queries (full-text search via `tsvector`, category/frequency filtering)

### API Pattern
API routes return discriminated unions: `ApiResult<T> = ApiResponse<T> | ApiError`. The CLI fetches snippets from these endpoints.

### Database
Tables: `users`, `snippets`, `snippet_variables`. Snippets have `frequency` (hourly/daily/weekly/monthly/on-demand) and `category` (utilities/social/finance/productivity/monitoring/other). Variables use `placeholder` and `prompt_text` fields for CLI substitution.

### Shared Types
Import from `@thrumhub/shared` — defines `Snippet`, `SnippetVariable`, `ApiResponse`, `ApiError`, and related interfaces.

### Path Alias
`@/*` maps to `./src/*` (configured in tsconfig.json).
