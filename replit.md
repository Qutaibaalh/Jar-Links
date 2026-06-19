# Ajar Links

A single-page "link in bio" hub for Ajar (joinajar.com) that collects all of the brand's important links — website, sign-up, pricing, WhatsApp, and socials — in one tappable, on-brand page.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- API contract (source of truth): `lib/api-spec/openapi.yaml` → run codegen to regenerate hooks/schemas
- Generated client hooks: `lib/api-client-react/src/generated/` (e.g. `useGetStats`, `trackEvent`)
- Generated Zod schemas (server validation): `lib/api-zod/src/generated/`
- DB schema: `lib/db/src/schema/` (`analytics-events.ts` for analytics)
- API routes: `artifacts/api-server/src/routes/` (`events.ts`, `stats.ts`)
- Public link page + analytics wiring: `artifacts/links/src/App.tsx`
- Client tracking helper: `artifacts/links/src/lib/analytics.ts`
- Analytics dashboard: `artifacts/links/src/pages/dashboard.tsx` (route `/stats`)

## Architecture decisions

- Analytics events (`visit`, `click`) are written to `analytics_events`. `referrerDomain` is derived server-side from the full referrer; `userAgent` is captured server-side from the request, not trusted from the client.
- Tracking is fire-and-forget on the client (errors swallowed) so it never blocks a link click or page render.
- The `/stats` dashboard is gated by `ANALYTICS_ADMIN_PASSCODE` (env secret), checked server-side; there is no user auth system.
- Visitor uniqueness is approximated by a client-generated UUID stored in `localStorage`.

## Product

- Public "link in bio" page for Ajar with the brand's key links and socials.
- Automatic analytics: every page visit and link click is recorded.
- Private passcode-protected dashboard at `/stats` showing profile visits, unique visitors, total clicks, per-link clicks + CTR, traffic sources (referrer domain), and UTM campaigns, filterable by 7d / 30d / all time.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The public home page (`/`) design must stay visually identical when adding features (Linktree-style: `#1668FF` buttons, `#033D7A` avatar, `#E9EDF0` background).
- After editing `lib/api-spec/openapi.yaml`, always run `pnpm --filter @workspace/api-spec run codegen` before typechecking server/client.
- Generated request-body component names must NOT be `<OperationId>Body` — use entity names (e.g. `EventInput`) in the OpenAPI spec.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
