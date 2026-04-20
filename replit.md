# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite, Tailwind CSS, shadcn/ui, Framer Motion, Wouter

## Artifacts

### Restaurant Website (`artifacts/restaurant-site`)
- Preview path: `/`
- Pages: Home, Menu, Specials, Gallery, Contact, Admin
- No online ordering — informational restaurant site
- QR code on Admin page links to `/menu`

### API Server (`artifacts/api-server`)
- Preview path: `/api`
- Endpoints: `/api/specials`, `/api/specials/current`, `/api/gallery`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec (NOTE: After running, manually set `lib/api-zod/src/index.ts` to only export from `./generated/api` to avoid duplicate export errors)
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Database Schema

- **specials** — daily and weekly restaurant specials (id, title, description, price, imageUrl, category, isActive, featuredDate, createdAt)
- **gallery** — photo gallery images (id, imageUrl, caption, category, sortOrder, createdAt)

## Notes

- Prices stored as plain numbers (e.g., "34"), frontend adds `$` prefix
- Admin page at `/admin` for managing specials
- `lib/api-zod/src/index.ts` should only export from `./generated/api` (not types barrel) to avoid TS2308 ambiguity errors

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
