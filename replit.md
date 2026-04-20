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
- Endpoints: `/api/specials`, `/api/specials/current`, `/api/gallery`, `/api/settings`, `/api/menu`
- Menu CRUD: GET /api/menu, POST/PUT/DELETE /api/menu/categories/:id, POST/PUT/DELETE /api/menu/items/:id

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec (NOTE: After running, manually set `lib/api-zod/src/index.ts` to only export from `./generated/api` to avoid duplicate export errors)
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Database Schema

- **specials** — daily and weekly restaurant specials (id, title, description, price, imageUrl, category, isActive, featuredDate, createdAt)
- **gallery** — photo gallery images (id, imageUrl, caption, category, sortOrder, createdAt)
- **site_settings** — key/value store for site-wide settings (hours, announcement, story text)
- **menu_categories** — menu section headers (id, name, subtitle, icon, color, sortOrder)
- **menu_items** — individual menu items linked to a category (id, categoryId, name, description, price, note, sortOrder)

## Admin Portal (`/admin`)

Four tabs:
1. **Specials** — add/edit/delete daily specials with image upload and QR code display
2. **Menu** — full CRUD for all menu categories and items (add/edit/delete, color picker, emoji icon)
3. **Gallery** — upload new photos and delete existing ones
4. **Site Info** — edit business hours, announcement banner (on/off, title, body), and the Our Story paragraph

## Notes

- Menu page loads from DB via `/api/menu`; first load auto-seeds the full menu from hardcoded defaults
- Settings use a key/value pattern via `/api/settings` with `ensureDefaults()` seeding on first GET
- `lib/api-zod/src/index.ts` should only export from `./generated/api` (not types barrel) to avoid TS2308 ambiguity errors
- Menu hooks (`use-menu.ts`) and settings hooks (`use-settings.ts`) use direct fetch (not codegen) for simplicity

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
