## This Little Piggy deployment

Production must run the Vite site and the Express API together. The admin portal
at `/admin` saves menu, settings, specials, and gallery changes through `/api/*`;
if `/api/*` is rewritten to `index.html`, the public menu can disappear and admin
saves will never reach Postgres.

### Vercel

Keep these project settings:

- Install command: `pnpm install --no-frozen-lockfile`
- Build command: `pnpm --filter @workspace/api-server run build && pnpm --filter @workspace/restaurant-site run build`
- Output directory: `artifacts/restaurant-site/dist/public`

Required environment variables:

- `DATABASE_URL`: Postgres connection string used by menu/settings/gallery/specials.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: needed for gallery image uploads.

Before or after the first deploy, create/update the database tables:

```sh
DATABASE_URL="postgres://..." pnpm --filter @workspace/db run push
```

Then redeploy Vercel. After deploy, verify these URLs return JSON, not the HTML
app shell:

```sh
curl https://thislittlepiggyservesfood.com/api/menu
curl https://thislittlepiggyservesfood.com/api/settings
curl https://thislittlepiggyservesfood.com/api/gallery
```

The menu API seeds the menu on first request and also corrects any old appetizer
items that were still priced at `$6` to `$8`.
