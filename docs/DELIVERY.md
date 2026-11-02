# WEB-001 delivery record

Prepared 2 November 2026. Status: handover documents prepared with declared deviations and incomplete acceptance evidence; full SOW compliance is not claimed.

## Release and access

| Item | Value |
| --- | --- |
| Repository | https://github.com/mehulp1612/SOW_WEB_001 |
| Live site (both versions) | https://mehulp1612.github.io/SOW_WEB_001/ |
| Working version A SHA | `ee515ee21fbd3d9573c0bd3c2ddf23fb1385d9d7` |
| Version A Actions | https://github.com/mehulp1612/SOW_WEB_001/actions/runs/41400968715 |
| Earlier frontend-only SHA | `16716bd12d7b833dd463a8301f3edbd7b4fbe14c` |
| Earlier Actions | https://github.com/mehulp1612/SOW_WEB_001/actions/runs/41343278250 (successful attempt 2) |
| Version B SHA | `0056861cfdb13d382883fa2982e4833f257ef4cf` |
| Version B Actions | https://github.com/mehulp1612/SOW_WEB_001/actions/runs/41418918989 |
| Last A documentation release | `65dd97a54f3ef946ceb9f8a565574b11d456c86f` / https://github.com/mehulp1612/SOW_WEB_001/actions/runs/41414630541 |
| Supabase project | `vnaclyfhumeqqtwexlxs` |
| Windmill workspace / Flow | `mehul-pandey` / `f/web001/contact_intake` |
| Reported B inquiry | `d6734c6d-c98d-4d0f-876f-fd0b05127e34` |
| B inquiry timestamp (IST) | `2026-11-02 14:45:19.483297+05:30` |
| Confirmed A inquiry | `c9e4ff8b-b244-4d9f-b6b5-ebe2a1973ac9` |

Version B build and deploy jobs were independently confirmed successful through the GitHub API on 2 November. The earlier two releases listed above retain version A UI. On 2 November the developer reported a successful browser submission, verified its database row, and confirmed that retrying the same ID left exactly one row. Attach matching redacted Windmill and database evidence before submission.

The supplied partial bolt.diy export was completed locally with Codex assistance. Preserve this provenance; no reconstructed conversation is evidence of bolt.diy generation. Initial authentic bolt prompts/history have not been supplied for the handover.

## Package contents

- Frontend: `src/`, `index.html`, `vite.config.ts`, Tailwind configuration, `package.json`, `package-lock.json`.
- Automated release: `.github/workflows/deploy.yml`.
- Database: `supabase/migrations/202611020001_contact_intake.sql`; permission/duplicate checks: `supabase/tests/intake.sql`.
- Edge: `supabase/config.toml`, `supabase/functions/contact-submit/`.
- Windmill: `windmill/contact_intake.ts`, generated `windmill/contact_intake.flow.json`. Developer-supplied deployed export: `windmill/contact_intake.deployed.flow.json`, validated as JSON with one Bun storage step, protected resource binding and expected input mappings; no embedded credential values found. The export retains older resource validation than the local script; payload validation and storage/receipt logic match. Preserve the export as the deployed snapshot.
- Public environment template: `.env.example`. Privileged values belong only in protected provider settings.
- Reviewer index: [SUBMISSION_README.md](SUBMISSION_README.md); architecture: [ARCHITECTURE.md](ARCHITECTURE.md); provenance: [DEVELOPMENT_PROVENANCE.md](DEVELOPMENT_PROVENANCE.md).
- Setup, recreation, recovery and rotation: [BACKEND_SETUP.md](BACKEND_SETUP.md).
- Independent operator instructions: [OPERATOR_QUICKSTART.md](OPERATOR_QUICKSTART.md).
- Acceptance evidence: [TEST_LOG.md](TEST_LOG.md); recording sequence: [RECORDING_PLAN.md](RECORDING_PLAN.md).

## Version A flow-test recording

[Version A end-to-end flow-test video](https://drive.google.com/file/d/1-qXnZdY_rOOEfAjc8dGrMGPgH3DtP29b/view?usp=sharing), supplied by the developer as evidence of the version A flow test. Local filename: `version_A_flow_test.mp4`. This is separate from the version B development/deployment recording. Its content and link permissions have not been independently verified; match the visible browser, Windmill and database UUIDs when reviewing T3 evidence.

## Declared deviations and recording

The developer elected local VS Code/Codex completion instead of the mandatory bolt.diy generation workflow after reported provider connection failures. No exception approval was obtained. The exact root cause of the failures was not established. This does not satisfy the builder requirement or its portion of T6.

Recording: `Version_b_generation_and_test_flow.mp4`, reported by the developer to capture A-to-B development using VS Code/Codex. File metadata: 326.3333 seconds (5:26), 353,098,083 bytes. This exceeds the prescribed 2-3 minutes. Contents, continuity and absence of exposed secrets have not been independently reviewed. Do not claim that this recording satisfies the original sequence or duration requirement.

SHA-256: `AD2013D068C61107B8027BF2DC513208C9149C760F17A78D4482BC6991E6A3A4`.

Recording share link: https://drive.google.com/file/d/1xe9YGFqKa_iSpe3Ye401an2OPlmoLLWn/view?usp=sharing. The developer confirmed public access by opening the link in an incognito window. Retain the original file, which is excluded from Git.

## Final packaging checklist

1. Public video access is confirmed by the developer. Check the complete recording for private data and credentials. Report its actual workflow and duration.
2. Attach the matching successful Windmill run and Supabase row for the reported version B UUID above. The supplied timestamp is recorded as inquiry evidence, not as the final handover time. Add desktop/mobile and remaining failure/security evidence to TEST_LOG.md.
3. Deployed Flow export is supplied and validated at `windmill/contact_intake.deployed.flow.json`. Include it in the final commit alongside the generated definition. Resource values and secrets must be recreated using BACKEND_SETUP.md; they are not embedded in this export.
4. Supply individual platform access and run the operator quick start with a new operator. Record an observed result or an explicit uncompleted check.
5. Confirm account ownership and recipient access. Reported time/cost and the corrected handover/availability dates are recorded below. Send the covering email separately and retain the declared gaps.
6. Commit documentation and sanitized artifacts, push, and verify the resulting Actions run. Preserve the A/B release SHAs above as the change evidence. Send the repository and recording links through the requested submission channel.

## Ownership, access and operating cost

These are developer-owned pilot accounts. The repository owner is `mehulp1612`; the Windmill workspace is `mehul-pandey`. Confirm the Supabase organization owner, billing owner and operator invitations before handover. Use individual platform invitations; transfer secrets only through an approved private channel. A public repository does not grant database/workspace access.

| Service | Handover information to fill from the account |
| --- | --- |
| GitHub / Pages | Repository owner, operator access, actual plan and Actions/storage usage |
| Supabase | Organization owner, operator role, actual plan/usage and billing responsibility |
| Windmill | Workspace owner, operator role, actual plan/execution usage and billing responsibility |
| bolt.diy model provider | Provider/model actually used, actual spend, any remaining quota |

The developer reports zero project expenditure using free tiers and open-source tools. This records actual reported expenditure, not a guarantee of future free service or a claim that every hosted service is open source. Account billing and quota details have not been independently audited. No domain, email service or additional hosting is needed by the implementation.

Scheduled handover: **2 November 2026, 16:00 IST (+05:30)**. Minimum pilot availability end: **5 November 2026, 16:00 IST (+05:30)**. Developer: **Mehul Pandey**; recipient operator/access arrangements remain to be confirmed. Actual work time: **approximately 5 hours 40 minutes**, developer-reported (20 minutes below the six-hour ceiling). Total project expenditure: **zero**, developer-reported.

Keep Pages, Supabase and Windmill operational throughout that interval; ensure credentials remain valid and quotas are sufficient. Use the setup guide to recreate the system under recipient-owned accounts and rotate/revoke old credentials after verified transfer. SAFI decides acceptance.

Outage and recovery testing was reported as performed independently by the developer. Test timestamp, failure mechanism, retained request ID and recovery row-count evidence have not yet been supplied. This does not establish the separate T8 new-operator onboarding check.
