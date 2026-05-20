# Deploying This Little Piggy (Vercel)

## Required environment variables (Vercel project settings)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Neon/Postgres connection string (menu, settings, gallery, specials) |
| `CLOUDINARY_CLOUD_NAME` | Gallery and specials image uploads |
| `CLOUDINARY_API_KEY` | Gallery and specials image uploads |
| `CLOUDINARY_API_SECRET` | Gallery and specials image uploads |

Do **not** set these in production:

| Variable | Why |
|----------|-----|
| `VITE_USE_API_SHIMS=true` | Disables real API; admin saves fail or only use browser storage |

Optional (Replit object storage only — not used on Vercel):

- `PUBLIC_OBJECT_SEARCH_PATHS`
- `PRIVATE_OBJECT_DIR`

## Build

Vercel runs:

1. `pnpm -C artifacts/api-server build` — bundles Express to `api/handler.mjs`
2. `node scripts/verify-vercel-build.mjs` — fails fast if the API bundle is missing
3. `pnpm -C artifacts/restaurant-site build` — static SPA

The serverless entry is **`api/[...path].js`** (committed). Do not add a `functions` entry for `api/index.mjs` — Vercel does not treat `.mjs` as a function source file.

## After deploy

1. Open `/menu` — full menu should load (static fallback if API is down).
2. Open `/admin` — yellow/red banner at top should be gone when API is healthy.
3. Test: edit menu item, save hours, create daily special, upload gallery photo.
4. Confirm changes appear on the public site.

Until `DATABASE_URL` is configured, the menu still displays from static data, but **admin saves return errors**. Gallery uploads need Cloudinary env vars.

## Hours default

**Thursday–Sunday: 11am – 8pm** (stored in `hours_weekday`).
