## Cursor Cloud specific instructions

### Overview

This is "This Little Piggy" — a pnpm monorepo for a restaurant website with an Express 5 API server and a React (Vite) frontend. See `README.md` for deployment details.

### Required services

| Service | How to start |
|---------|-------------|
| **PostgreSQL 16** | `pg_ctl -D /tmp/pgdata -l /tmp/pgdata/logfile start` (see below for first-time setup) |
| **API server** (Express, port 3001) | `cd /workspace && DATABASE_URL=postgresql://ubuntu@localhost:5432/piggy PORT=3001 NODE_ENV=development node --enable-source-maps ./artifacts/api-server/dist/index.mjs` |
| **Vite dev server** (port 3000) | `PORT=3000 VITE_API_ORIGIN=http://localhost:3001 pnpm --filter @workspace/restaurant-site run dev` |

### First-time PostgreSQL setup

```sh
export PATH="/usr/lib/postgresql/16/bin:$PATH"
sudo mkdir -p /var/run/postgresql && sudo chown ubuntu:ubuntu /var/run/postgresql
initdb -D /tmp/pgdata --auth=trust --encoding=UTF-8 --locale=C
pg_ctl -D /tmp/pgdata -l /tmp/pgdata/logfile start
createdb piggy
DATABASE_URL=postgresql://ubuntu@localhost:5432/piggy pnpm --filter @workspace/db run push
```

### Key caveats

- **API build has a known issue**: `pnpm --filter @workspace/api-server run build` produces the dev entry point (`dist/index.mjs`) successfully but fails on the Vercel entry point (`vercel.ts`) due to `esbuild-plugin-pino` adding multiple outputs when `outfile` is used. For local dev, run the build and ignore the exit code, then start with `node --enable-source-maps ./artifacts/api-server/dist/index.mjs`.
- **Typecheck**: `pnpm run typecheck` has pre-existing TS errors in `restaurant-site` (type `unknown` in `menu.tsx` and `specials.tsx`). The lib-level typecheck (`pnpm run typecheck:libs`) passes.
- **Tests**: The API server test suite requires `ts-node` which is not listed in `devDependencies`. Jest will fail to parse `jest.config.ts` without it. There is only one test file (`tests/objectStorage.download.spec.ts`).
- **Vite proxy**: The Vite dev server proxies `/api` requests to `VITE_API_ORIGIN`. Set this to `http://localhost:3001` when running the API on port 3001.
- **Menu auto-seed**: The `/api/menu` endpoint auto-seeds default menu data on first request.
- **pnpm lockfile**: `pnpm install --frozen-lockfile` may fail with a config mismatch. Use `pnpm install --no-frozen-lockfile` (matching the Vercel install command in README).
- **PostgreSQL PATH**: Add `/usr/lib/postgresql/16/bin` to PATH for `psql`, `pg_ctl`, `initdb`, etc.
