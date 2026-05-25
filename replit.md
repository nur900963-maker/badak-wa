# VINCENT BADAK Dashboard v1.4

Internal tools dashboard for vincentnotdev (@pakvncnt). Dark-themed mobile-first web app with role-based access, WhatsApp request UI, tools gallery, and user management.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — JWT signing secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + TailwindCSS + shadcn/ui (artifact: `vincent-badak`, preview: `/`)
- API: Express 5 (artifact: `api-server`, preview: `/api`)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Auth: JWT + httpOnly cookie (bcryptjs passwords)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/db/src/schema/` — DB tables: users, wa_requests, news, sessions
- `artifacts/api-server/src/routes/` — auth, users, stats, wa, news
- `artifacts/api-server/src/lib/auth.ts` — JWT middleware + helpers
- `artifacts/vincent-badak/src/` — React frontend
- `artifacts/vincent-badak/src/pages/` — login, home, whatsapp, tools, anime, admin/users
- `artifacts/vincent-badak/src/components/layout/AppLayout.tsx` — bottom nav + sidebar

## Architecture decisions

- JWT stored as httpOnly cookie, also returned in response body for flexibility
- WA request progress updates via DB polling (60s server-side tick), client polls every 5s via React Query
- Sessions table tracks last-seen for online user count (5-minute window)
- Role hierarchy enforced in backend: admin creates any role, reseller creates member only
- Duration validation backend-side: admin allows 7/15/30/60/90/lifetime, reseller allows 7/15/30

## Product

- Login page with VINCENT BADAK branding
- Home: dashboard stats (online users, members, active requests), news carousel, account info
- WhatsApp tab: fake WA request UI with 25-min progress simulation (queued→connecting→sending→processing→done)
- Tools tab: grid of simulated tools (modals with fake progress steps — UI only, no real actions)
- Anime tab: Baldwin character photo gallery (masonry grid)
- Sidebar: VINCENTNOTDEV header, menu (Tentang Apps, My Account, Database User, Logout)
- Admin/Users page: create, delete, extend users with role-based permission enforcement

## User preferences

- No emojis in UI — use lucide-react icons instead
- Mobile-first layout (max-width ~430px centered)
- Dark theme only (no light mode toggle)
- All actions inline (modal/drawer/toast) — no page reloads
- Default admin: username `admin`, password `47146`

## Gotchas

- After changing `lib/api-spec/openapi.yaml`, always run `pnpm --filter @workspace/api-spec run codegen` before frontend changes
- After adding new DB schema files, run `pnpm run typecheck:libs` to rebuild lib declarations before typechecking api-server
- Attached assets are at `attached_assets/` — referenced via `@assets/` alias in Vite
- WA request tick runs every 60s server-side; progress updates aren't instant

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Baldwin hero image: `attached_assets/IMG_20260525_143129_774_1779741902700.jpg` → import via `@assets/...`
