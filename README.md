# Sample Home Services — Demo

WEB-001 submission: React, TypeScript, Vite, Tailwind CSS, and a locally maintained shadcn/ui Button. Version B includes the Weekend Appointments callout and Request a Callback button. No services are offered.

- [Live website](https://mehulp1612.github.io/SOW_WEB_001/)
- [Version A end-to-end flow-test recording](https://drive.google.com/file/d/1-qXnZdY_rOOEfAjc8dGrMGPgH3DtP29b/view?usp=sharing)
- [Version B development and deployment recording](https://drive.google.com/file/d/1xe9YGFqKa_iSpe3Ye401an2OPlmoLLWn/view?usp=sharing) (5 minutes 26 seconds)
- [Version A Actions](https://github.com/mehulp1612/SOW_WEB_001/actions/runs/41400968715) / [Version B Actions](https://github.com/mehulp1612/SOW_WEB_001/actions/runs/41418918989)

This public repository is the submission and handover location; no ZIP attachment is required. Scheduled handover is **2 November 2026 at 16:00 IST**, with pilot availability through at least **5 November 2026 at 16:00 IST**. Reported effort: approximately **5 hours 40 minutes**. Reported project expenditure: **zero**.

## Documentation guide

| Document | What it contains |
| --- | --- |
| [Reviewer guide](docs/SUBMISSION_README.md) | Suggested review order, artifact index, access prerequisites and outstanding evidence |
| [Delivery record](docs/DELIVERY.md) | Exact A/B commit SHAs, Actions links, inquiry IDs, recording details, ownership, costs and availability |
| [Architecture](docs/ARCHITECTURE.md) | Browser-to-Edge-to-Windmill-to-database flow, component responsibilities, trust boundaries and retry behavior |
| [Backend setup and recovery](docs/BACKEND_SETUP.md) | Supabase schema and RLS, Windmill resource/Flow setup, Edge deployment, environment configuration, recreation, recovery and credential rotation |
| [Operator quick start](docs/OPERATOR_QUICKSTART.md) | Eight steps for a newly authorized operator to submit and verify an inquiry within 30 minutes |
| [Acceptance test log](docs/TEST_LOG.md) | T1-T8 results, developer-reported outcomes, evidence gaps and unconfirmed checks |
| [Validation record](VALIDATION.md) | Local tests/build, SQL checks, public deployment verification and deployed Flow comparison |
| [Development provenance](docs/DEVELOPMENT_PROVENANCE.md) | Partial bolt.diy starting point, switch to VS Code/Codex, prescribed change instruction and declared deviations |
| [Recording details](docs/RECORDING_PLAN.md) | Actual recording metadata, sharing and review checks, and duration/workflow deviations |

## Implementation artifacts

| Location | Contents |
| --- | --- |
| [src/](src/) | React page, contact form, validation, styles and frontend tests |
| [.github/workflows/deploy.yml](.github/workflows/deploy.yml) | Locked install, tests, build and GitHub Pages deployment |
| [vite.config.ts](vite.config.ts), [package-lock.json](package-lock.json) | Vite base-path/test configuration and pinned dependency resolution |
| [supabase/migrations/](supabase/migrations/), [supabase/tests/](supabase/tests/) | Contact table, RLS/privileges, duplicate-safe RPC and SQL verification |
| [supabase/functions/contact-submit/](supabase/functions/contact-submit/), [supabase/config.toml](supabase/config.toml) | Public validated Edge endpoint and function configuration |
| [windmill/contact_intake.ts](windmill/contact_intake.ts), [generated Flow](windmill/contact_intake.flow.json) | Maintained storage worker and portable generated definition |
| [Deployed Flow export](windmill/contact_intake.deployed.flow.json) | Developer-supplied snapshot of the deployed Windmill Flow |
| [.env.example](.env.example) | Public frontend endpoint template; no privileged credentials |

## Current milestone

Both version A and version B have successful GitHub Actions deployments. The developer reports verified browser storage, same-ID deduplication and independent outage/recovery testing. Full acceptance evidence and the separate new-operator exercise remain incomplete; see [the test log](docs/TEST_LOG.md).

**Declared tool change:** the initial partial bolt.diy export was completed and modified locally using **VS Code and Codex**, following repeated reported AI-provider connection failures. This departs from the mandatory bolt.diy generation workflow; no exception approval was obtained. The recording also exceeds the prescribed 2-3 minutes. Full SOW compliance is not claimed.

Includes required content, responsive form, validation, honeypot, UUID-based retries, explicit response verification, automated tests, and a GitHub Pages workflow. Backend source includes a Supabase migration/RLS checks, a public Edge Function, and a portable Windmill Flow definition. Remaining live failure/security checks, independent operator verification remain outstanding. The developer-supplied deployed Flow export is included; see VALIDATION.md for its comparison with the local source.

## Connect the backend

Follow [the Supabase and Windmill setup guide](docs/BACKEND_SETUP.md). It lists each dashboard step and the exact credential locations. Share only project/workspace URLs when requesting help; enter keys directly into their protected settings.

Apply `supabase/migrations/202611020001_contact_intake.sql` once, verify with `supabase/tests/intake.sql`, configure the Windmill resource and import the Flow, then deploy `contact-submit`. Finally set the public endpoint as the GitHub Actions variable and rebuild the frontend. The Flow JSON is generated from `windmill/contact_intake.ts`; run `npm run windmill:export` after changing that script. Capture a real sanitized deployed Flow export after cloud verification.

## Local development

Use Node 22.16.0 (see .nvmrc). The package lockfile is committed; local installs and CI use `npm ci`.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5174. This avoids bolt.diy's port 5173. Copy .env.example to .env.local and set VITE_CONTACT_SUBMIT_URL once the actual Edge Function exists. Restart Vite after configuration changes. Without an endpoint, the form reports a configuration error and never pretends to store data.

```sh
npm test
npm run build
npm run preview
```

## Submission contract

Browser POSTs `{request_id, name, email, message, website:""}` to public HTTPS `/functions/v1/contact-submit`. No browser API key or database client is used. Only a successful HTTP response containing `{request_id:<matching UUID>, status:"received"}` confirms storage. The backend must return this only after Windmill confirms durable storage.

Failures retain the attempted payload and UUID in memory. Inputs are read-only for retries, preventing a changed inquiry under the same ID. Retry on the same page; reloading loses in-memory state. After confirmation, “Send another inquiry” starts a new ID. The UI does not claim failed/timed-out requests were never stored.

The backend must independently validate fields, cap request size, enforce RLS and scoped authentication, and insert duplicate-safely. Frontend checks are not a security boundary.

## GitHub Pages

1. Create the assignment repository and push main after a verified build and committed lockfile.
2. Set Settings > Pages > Source to GitHub Actions.
3. Set repository Actions variable VITE_CONTACT_SUBMIT_URL to the actual public endpoint.
4. Actions runs npm ci, tests, and the typechecked build, then uploads dist and deploys it.
5. Vite derives `/<repo>/` from GITHUB_REPOSITORY in Actions. Locally it uses `/`; VITE_BASE_PATH provides a local override.
6. Record the actual successful Actions URL, full SHA, and public URL. No remote or cloud resources are configured automatically.

Set backend CORS to `https://<owner>.github.io`, without the repository path. Keep privileged credentials in server-side secrets/resources, never VITE_* variables.

## Remaining work

- Capture matching browser, Windmill and database evidence for the confirmed inquiry.
- Complete live invalid-input and anonymous-access checks; attach evidence of reported outage/recovery testing and audit for privileged secret exposure.
- Attach live version B form evidence. Version B Actions succeeded; VS Code/Codex was used instead of bolt.diy, as declared in the delivery record.
- Complete [T1–T8 evidence](docs/TEST_LOG.md) and recording review. Validate the [operator guide](docs/OPERATOR_QUICKSTART.md) with a new authorized operator. Costs and the 72-hour availability dates are recorded in the delivery document.

Automated tests simulate HTTP responses; they are not proof of live-provider behavior. SQL tests were also run on an isolated local PostgreSQL instance. See VALIDATION.md for current verification status.

## Attribution

Button adapts the MIT-licensed shadcn/ui Radix implementation pattern. The room illustration is original CSS, with lucide-react icons. No external image or font services are needed.
