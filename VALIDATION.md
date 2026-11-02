# Verification record — 2 November 2026 (Asia/Kolkata)

## Observed locally

- `npm test`: 48 tests passed across three files. Covers frontend validation/retries, concurrent-click prevention and cancellation, public Edge validation, actual request byte limits, CORS/method/path restrictions, upstream failure/false-success handling, and Windmill RPC response verification. Network responses were simulated.
- `npm run build`: frontend and backend handler/Flow TypeScript checks passed; Vite production build succeeded. The Deno-specific entrypoint has not been executed in Supabase yet.
- Generated Windmill Flow definition matches the inline script (`node scripts/export-windmill.mjs --check`). This does not prove cloud import or execution.
- Applied the migration successfully to an isolated PostgreSQL 17 container, with Supabase-style anon/authenticated/service_role roles.
- `supabase/tests/intake.sql` passed: RLS enabled; anonymous SELECT/INSERT/UPDATE/DELETE and RPC denied; authenticated SELECT/RPC denied; successful storage; duplicate returns existing ID without overwrite; invalid name rejected. Test writes rolled back.
- Four concurrent database transactions using the same request ID all returned explicit success. Final query found exactly one row.

The local PostgreSQL container had no network access or published ports. It is separate from the user's cloud database.

## User-reported

- GitHub Pages deployment succeeded. This session has not independently inspected the deployed site or captured its Actions run URL.

## Still required

- Browser visual/accessibility review at desktop and mobile sizes.
- Apply migration and run permission tests in actual Supabase; deploy Edge Function.
- Configure protected Windmill resource and scoped token; import/deploy/verify Flow; save a real sanitized export.
- Human browser inquiry through the full live chain with matching request ID/fields.
- Live invalid-input, anonymous API denial, duplicate, outage/recovery, and secret-exposure evidence.
- Genuine version B change and deployment, independent operator verification, full T1–T8 evidence and handover.

Local test success is not evidence that live services are configured or that the SOW is complete.
