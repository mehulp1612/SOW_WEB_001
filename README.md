# Sample Home Services — Demo

Version A frontend for WEB-001: React, TypeScript, Vite, Tailwind CSS, and a locally maintained shadcn/ui Button. No services are offered.

## Current milestone

The supplied partial bolt.diy export was completed locally with Codex assistance. This is a frontend milestone, not a completed SOW or live release A. No generated conversation or deployment evidence is claimed.

Includes required content, responsive form, validation, honeypot, UUID-based retries, explicit response verification, automated tests, and a GitHub Pages workflow. Supabase SQL/RLS, the Edge Function, Windmill Flow, live storage, deployment records, and independent operator verification remain outstanding.

## Local development

Use Node 22.16.0 (see .nvmrc). On the first setup, run `npm install` to create package-lock.json if it has not yet been generated. Commit that lockfile before pushing; subsequent installs and CI use `npm ci`.

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

- Supabase migration/RLS, Edge Function, authenticated synchronous Windmill Flow.
- Real browser storage verification, invalid-input and anonymous-access tests, outage/recovery and duplicate checks.
- Genuine version B change and second automated deployment to the same URL.
- Dated T1–T8 evidence, recording, operator guide, portable exports, costs, rotation/recovery instructions, and 72-hour availability.

Automated tests simulate HTTP responses; they are not proof of live-provider behavior. Initial dependency installation was blocked by the development session's network restrictions. See VALIDATION.md for current verification status.

## Attribution

Button adapts the MIT-licensed shadcn/ui Radix implementation pattern. The room illustration is original CSS, with lucide-react icons. No external image or font services are needed.
