---
name: Orval/OpenAPI codegen quirks in this repo
description: Gotchas when editing lib/api-spec/openapi.yaml and regenerating clients
---

Contract-first flow: edit `lib/api-spec/openapi.yaml`, then run `pnpm --filter @workspace/api-spec run codegen` (it also runs `typecheck:libs`). Generated outputs: `lib/api-client-react/src/generated/` (React Query hooks) and `lib/api-zod/src/generated/` (Zod schemas for server validation).

**Quirks / how to apply:**
- Name request-body schemas with entity names (e.g. `EventInput`), NOT `<OperationId>Body` — the latter collides with orval's own generated body type names.
- Generated query hooks (e.g. `useGetStats`) type the options' `query` as a full `UseQueryOptions` that *requires* `queryKey`. When passing `enabled`/`retry`, also pass `queryKey: getGet<Op>QueryKey(params)` (the key helper is exported alongside the hook).
- A request body component named `Foo` generates a TS type `Foo`; the matching Zod schema is exported as `<OperationId>Body` (e.g. POST trackEvent → `TrackEventBody`). Query params → `<OperationId>QueryParams`.
