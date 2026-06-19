---
name: Analytics dashboard passcode transport
description: Why the /stats passcode is sent as a query param and what risk remains
---

The Ajar `/stats` analytics dashboard is gated by `ANALYTICS_ADMIN_PASSCODE` (env secret), validated server-side in `artifacts/api-server/src/routes/stats.ts`. The passcode is sent from the client as a URL query param (`GET /api/stats?passcode=...`).

**Why:** It is an XHR fetch (not page navigation), so the passcode never appears in the browser address bar or history, and pino strips query strings from request logs. This was an acceptable tradeoff to keep the generated client simple.

**Open risk / how to apply:** Some reverse proxies/CDNs log full URLs including query strings, which could leak the passcode into infra logs. If hardening, move the passcode to an HTTP header (OpenAPI header param → codegen → server reads header → client sends header). Tracked as a follow-up.
