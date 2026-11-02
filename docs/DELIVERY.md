# WEB-001 delivery record

Prepared 2 November 2026. Status: preparation in progress; not ready for final submission.

## Release and access

| Item | Value |
| --- | --- |
| Repository | https://github.com/mehulp1612/SOW_WEB_001 |
| Live site (both versions) | https://mehulp1612.github.io/SOW_WEB_001/ |
| Working version A SHA | `ee515ee21fbd3d9573c0bd3c2ddf23fb1385d9d7` |
| Version A Actions | https://github.com/mehulp1612/SOW_WEB_001/actions/runs/41400968715 |
| Earlier frontend-only SHA | `16716bd12d7b833dd463a8301f3edbd7b4fbe14c` |
| Earlier Actions | https://github.com/mehulp1612/SOW_WEB_001/actions/runs/41343278250 (successful attempt 2) |
| Version B SHA / Actions | PENDING |
| Supabase project | `vnaclyfhumeqqtwexlxs` |
| Windmill workspace / Flow | `mehul-pandey` / `f/web001/contact_intake` |
| Confirmed A inquiry | `c9e4ff8b-b244-4d9f-b6b5-ebe2a1973ac9` |

The two existing successful runs are both version A, not the required A/B pair. On 2 November the developer reported a successful browser submission, verified its database row, and confirmed that retrying the same ID left exactly one row. Attach matching redacted Windmill and database evidence before submission.

The supplied partial bolt.diy export was completed locally with Codex assistance. Preserve this provenance; no reconstructed conversation is evidence of bolt.diy generation. Initial authentic bolt prompts/history have not been supplied for the handover.

## Package contents

- Frontend: `src/`, `index.html`, `vite.config.ts`, Tailwind configuration, `package.json`, `package-lock.json`.
- Automated release: `.github/workflows/deploy.yml`.
- Database: `supabase/migrations/202611020001_contact_intake.sql`; permission/duplicate checks: `supabase/tests/intake.sql`.
- Edge: `supabase/config.toml`, `supabase/functions/contact-submit/`.
- Windmill: `windmill/contact_intake.ts`, generated `windmill/contact_intake.flow.json`. A sanitized export of the actual deployed Flow is still required at `windmill/contact_intake.deployed.flow.json`.
- Public environment template: `.env.example`. Privileged values belong only in protected provider settings.
- Setup, recreation, recovery and rotation: [BACKEND_SETUP.md](BACKEND_SETUP.md).
- Independent operator instructions: [OPERATOR_QUICKSTART.md](OPERATOR_QUICKSTART.md).
- Acceptance evidence: [TEST_LOG.md](TEST_LOG.md); recording sequence: [RECORDING_PLAN.md](RECORDING_PLAN.md).

## Remaining release sequence

1. Preserve version A evidence: public desktop/mobile views, human submission, matching Windmill result and row. Complete invalid-input, anonymous API denial and controlled outage/recovery checks in the test log.
2. Prepare the recording and genuine bolt.diy version B change. Give bolt this exact required instruction: **Add a Weekend Appointments callout above the contact form and change the submit button to Request a Callback; keep the form operational.** Save the actual prompt/output, review the diff, run `npm test` and `npm run build`, commit and push to main. Record the resulting SHA and successful Actions URL.
3. Verify B at the same URL and submit a new human inquiry. Save its matching request ID and provider evidence.
4. Export the deployed Windmill Flow, inspect for embedded credentials, and add the sanitized export. Confirm resource references and scoped-token permissions.
5. Give an authorized new operator access, run the quick start without assistance, and record elapsed time and evidence. Complete every T1–T8 result before declaring completion.
6. Fill in ownership, actual costs, handover time and availability end below. Deliver repository access, evidence links and recording through the agreed submission channel.

## Ownership, access and operating cost

These are developer-owned pilot accounts. The repository owner is `mehulp1612`; the Windmill workspace is `mehul-pandey`. Confirm the Supabase organization owner, billing owner and operator invitations before handover. Use individual platform invitations; transfer secrets only through an approved private channel. A public repository does not grant database/workspace access.

| Service | Handover information to fill from the account |
| --- | --- |
| GitHub / Pages | Repository owner, operator access, actual plan and Actions/storage usage |
| Supabase | Organization owner, operator role, actual plan/usage and billing responsibility |
| Windmill | Workspace owner, operator role, actual plan/execution usage and billing responsibility |
| bolt.diy model provider | Provider/model actually used, actual spend, any remaining quota |

No cost or free-tier availability is asserted by this document. Check each account's billing/usage page and record actual values; do not include payment details or secrets. No domain, email service or additional hosting is needed by the implementation.

Handover timestamp/timezone: **PENDING**. Pilot availability end (at least 72 hours later): **PENDING**. Responsible operator/contact: **PENDING**. Actual work time against the six-hour SOW ceiling: **PENDING developer record**.

Keep Pages, Supabase and Windmill operational throughout that interval; ensure credentials remain valid and quotas are sufficient. Use the setup guide to recreate the system under recipient-owned accounts and rotate/revoke old credentials after verified transfer. SAFI decides acceptance.
