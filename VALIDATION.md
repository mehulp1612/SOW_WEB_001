# Verification record — 2 November 2026 (Asia/Kolkata)

## Observed locally

- `npm.cmd test`: 53 tests passed across three files on 2 November. Covers frontend validation/retries, concurrent-click prevention and cancellation, public Edge validation, actual request byte limits, CORS/method/path restrictions, upstream failure/false-success handling, resource configuration errors and Windmill RPC response verification. Network responses were simulated.
- Production build: frontend and backend handler/Flow TypeScript checks and Vite build passed. Local TypeScript checks do not execute the Deno entrypoint.
- Generated Windmill Flow definition matches the inline script (`node scripts/export-windmill.mjs --check`). This does not prove cloud import or execution.
- Applied the migration successfully to an isolated PostgreSQL 17 container, with Supabase-style anon/authenticated/service_role roles.
- `supabase/tests/intake.sql` passed: RLS enabled; anonymous SELECT/INSERT/UPDATE/DELETE and RPC denied; authenticated SELECT/RPC denied; successful storage; duplicate returns existing ID without overwrite; invalid name rejected. Test writes rolled back.
- Four concurrent database transactions using the same request ID all returned explicit success. Final query found exactly one row.

The local PostgreSQL container had no network access or published ports. It is separate from the user's cloud database.

## User-reported

- Cloud SQL checks returned PASS; Windmill Flow ran successfully after its resource binding was configured.
- Actual browser submission returned success with UUID `c9e4ff8b-b244-4d9f-b6b5-ebe2a1973ac9`; developer verified the stored row and confirmed a same-ID retry left exactly one row.

## Independently checked public endpoints

- GitHub API reports successful build and deployment for [Actions run 41400968715](https://github.com/mehulp1612/SOW_WEB_001/actions/runs/41400968715), SHA `ee515ee21fbd3d9573c0bd3c2ddf23fb1385d9d7`.
- Public Edge preflight returned HTTP 204 for the GitHub Pages origin on 2 November.

## Still required

- Browser visual/accessibility review at desktop and mobile sizes.
- Verify scoped token permissions and save a real sanitized deployed Flow export.
- Attach matching Windmill result and private field comparison to the confirmed browser inquiry evidence.
- Live invalid-input, anonymous API denial, outage/recovery and secret-exposure evidence; attach proof of the reported duplicate result.
- Genuine version B change and deployment, independent operator verification, full T1–T8 evidence and handover.

See [docs/TEST_LOG.md](docs/TEST_LOG.md) for per-requirement status. Local test success does not establish SOW completion.
