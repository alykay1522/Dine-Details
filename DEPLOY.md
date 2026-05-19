# Deploying This Little Piggy (Vercel)

## Required environment variables (Vercel project settings)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Neon/Postgres connection string (menu, settings, gallery, specials) |
| `CLOUDINARY_CLOUD_NAME` | Gallery image uploads |
| `CLOUDINARY_API_KEY` | Gallery image uploads |
| `CLOUDINARY_API_SECRET` | Gallery image uploads |

Optional (Replit object storage only — not used on Vercel):

- `PUBLIC_OBJECT_SEARCH_PATHS`
- `PRIVATE_OBJECT_DIR`

## Build

Vercel runs:

1. `pnpm -C artifacts/api-server build` — bundles Express API to `api/index.mjs`
2. `pnpm -C artifacts/restaurant-site build` — static SPA

Do **not** set `VITE_USE_API_SHIMS=true` in production.

## After deploy

1. Open `/menu` — full menu should load (static fallback if API is down).
2. Open `/admin` — edit menu, hours, gallery; changes persist when `DATABASE_URL` is set.
3. Gallery uploads require Cloudinary env vars.

## Hours default

**Thursday–Sunday: 11am – 8pm** (stored in `hours_weekday`).
