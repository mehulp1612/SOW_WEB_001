# Sample Home Services — Demo

Version A frontend for WEB-001: React, TypeScript, Vite, Tailwind CSS, and a locally maintained shadcn/ui Button. No services are offered.

## Current milestone

The supplied partial bolt.diy export was completed locally with Codex assistance. Version A is deployed; the developer has verified a browser submission and same-ID deduplication in Supabase. The SOW is not yet complete. See [the delivery record](docs/DELIVERY.md) for release identifiers and outstanding evidence.

Includes required content, responsive form, validation, honeypot, UUID-based retries, explicit response verification, automated tests, and a GitHub Pages workflow. Backend source includes a Supabase migration/RLS checks, a public Edge Function, and a portable Windmill Flow definition. Version B, remaining live failure/security checks, deployed export and independent operator verification remain outstanding.

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
- Complete live invalid-input, anonymous-access and outage/recovery checks; audit for privileged secret exposure.
- Genuine version B change and second automated deployment to the same URL.
- Complete [T1–T8 evidence](docs/TEST_LOG.md), recording, deployed export, costs and 72-hour availability dates. Validate the [operator guide](docs/OPERATOR_QUICKSTART.md) with a new authorized operator.

Automated tests simulate HTTP responses; they are not proof of live-provider behavior. SQL tests were also run on an isolated local PostgreSQL instance. See VALIDATION.md for current verification status.

## Attribution

Button adapts the MIT-licensed shadcn/ui Radix implementation pattern. The room illustration is original CSS, with lucide-react icons. No external image or font services are needed.
