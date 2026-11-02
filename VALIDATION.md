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
- Verify scoped token permissions in Windmill; the supplied deployed export does not prove account-level token scope.
- Attach matching Windmill result and private field comparison to the confirmed browser inquiry evidence.
- Live invalid-input, anonymous API denial, outage/recovery and secret-exposure evidence; attach proof of the reported duplicate result.
- Live version B inquiry evidence, independent operator verification, full T1–T8 evidence and handover.

See [docs/TEST_LOG.md](docs/TEST_LOG.md) for per-requirement status. Local test success does not establish SOW completion.

## Version B release update

On 2 November, GitHub API confirmed successful build and deploy jobs for SHA `0056861cfdb13d382883fa2982e4833f257ef4cf`, Actions https://github.com/mehulp1612/SOW_WEB_001/actions/runs/41418918989. The source contains the Weekend Appointments callout and Request a Callback CTA. No additional live form success is inferred from CI. The developer reports recording VS Code/Codex implementation; the original bolt.diy requirement remains unmet. Video metadata confirms 5:26 duration, exceeding the requested 2-3 minutes.

Version B inquiry supplied by developer: `d6734c6d-c98d-4d0f-876f-fd0b05127e34`, at `2026-11-02 14:45:19.483297+05:30` (IST), equivalent to `2026-11-02 09:15:19.483297+00:00`. Matching provider evidence remains to be attached.

## Deployed Flow export review

The developer supplied `windmill/contact_intake.deployed.flow.json`. JSON parses successfully; it contains one inline Bun `store` step, protected `resource("f/web001/supabase")` binding and the five expected payload inputs mapped to `flow_input`. Inspection found no embedded credential values; credential-pattern scan found no matches. Payload validation and RPC/storage/receipt code match the local script. The deployed script uses older resource validation, while the local script adds missing/malformed URL and unresolved-secret diagnostics. The actual export is preserved unchanged; this inspection is not a new live execution or a token-scope audit.

The developer confirmed that the supplied Google Drive video opens publicly in an incognito window.

Developer update: outage/recovery testing was reported as performed independently; detailed test evidence is still pending. The separate new-operator onboarding exercise is not confirmed. Reported work time is approximately 5 hours 40 minutes with zero project expenditure. Corrected scheduled handover is 2 November 2026 at 16:00 IST, with minimum availability through 5 November 2026 at 16:00 IST.
