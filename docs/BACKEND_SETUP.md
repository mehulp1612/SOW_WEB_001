# Configure Supabase and Windmill

The frontend is published at https://mehulp1612.github.io/SOW_WEB_001/. This guide connects real storage to version A. Keep the Contact Us button and version A UI until real storage has been verified and recorded.

## Your environment

- Supabase project: `vnaclyfhumeqqtwexlxs`
- Supabase API URL: `https://vnaclyfhumeqqtwexlxs.supabase.co`
- Supabase dashboard: https://supabase.com/dashboard/project/vnaclyfhumeqqtwexlxs
- Windmill workspace: `mehul-pandey`
- Windmill dashboard: https://app.windmill.dev/?workspace=mehul-pandey
- Planned public Edge endpoint: `https://vnaclyfhumeqqtwexlxs.supabase.co/functions/v1/contact-submit` (requires deployment).
- Expected Flow webhook, if saved at `f/web001/contact_intake`: `https://app.windmill.dev/api/w/mehul-pandey/jobs/run_wait_result/f/f/web001/contact_intake`. Confirm the actual synchronous URL in Windmill before setting the secret.

These identifiers are public configuration. Their presence here does not establish that the database objects, resource, Flow, or Edge Function have been created.

## What to share with the development assistant

Share only these non-secret values:

1. Supabase project URL: `https://<project-ref>.supabase.co` (project reference is also useful).
2. Windmill workspace URL: the address shown after opening your workspace at https://app.windmill.dev/.
3. Once the Flow is deployed, its synchronous webhook URL **without any token/query string**.
4. Confirmation that each setup step passed, or error text with secrets and form fields removed.

Do not share passwords, API keys, access tokens, cookies, or authorization headers. Enter those directly into the designated dashboard fields.

## 1. Create the Supabase project and apply the migration

1. Open https://supabase.com/dashboard and create a project in your own organization. Choose a region and save the database password in your password manager.
2. From the project's Connect dialog or API settings, record the project URL. The dashboard URL containing `/project/<ref>` is not the API URL.
3. Open SQL Editor. Paste and run the entire file `supabase/migrations/202611020001_contact_intake.sql` once. It creates the table and restricted storage RPC in one transaction. Do not re-run the creation migration after it succeeds.
4. Run `supabase/tests/intake.sql` in a new SQL Editor query. It tests permissions and duplicates inside a rollback transaction. Expected output starts with PASS. This is a database test, not a substitute for the required human browser submission.
5. Verify that Table Editor shows contact_submissions with RLS enabled and no anonymous access policies.
6. In project API Keys, create/copy a server-side secret key (`sb_secret_...`). Keep it ready for the Windmill protected resource. A legacy service_role JWT also works, but prefer a current secret key. Do not use a publishable/anon key for the storage worker.

The database password is not used by this implementation. The worker calls Supabase's HTTPS Data API with the server-side key.

## 2. Configure Windmill resources and Flow

1. Open https://app.windmill.dev/ and create/select your developer-owned workspace.
2. Create a folder `f/web001` if needed. Keep its access restricted to authorized operators and the Flow execution identity.
3. Create a secret variable such as `f/web001/supabase_secret_key`. Paste the Supabase server-side key into its secret value field.
4. Create a resource type named `contact_supabase`, with this schema:

```json
{
  "type": "object",
  "properties": {
    "url": { "type": "string" },
    "secret_key": { "type": "string", "format": "password" }
  },
  "required": ["url", "secret_key"]
}
```

5. Create resource `f/web001/supabase` of that type. Set `url` to your Supabase project URL. For `secret_key`, select the secret variable above (the resource export should contain `$var:f/web001/supabase_secret_key`, not the actual secret). Ensure the Flow runner can resolve this resource and variable.
6. Import `windmill/contact_intake.flow.json` as a Flow at `f/web001/contact_intake`. This is a generated portable definition, not a claimed export from your workspace. Import/runtime verification is still required.
7. If your Windmill interface cannot import this format, create ONE Flow manually: add an inline TypeScript/Bun step and paste `windmill/contact_intake.ts`. Define string Flow inputs `request_id`, `name`, `email`, `message`, `website`; set website to an empty string. Map each to `flow_input.<name>`. Bind the step's `db` input to resource `f/web001/supabase` with the resource picker. Do not expose `db` or credentials as public Flow inputs.
8. Deploy the Flow. It should have one storage step, no schedules, no unauthenticated HTTP routes, and no extra success wrapper. Its final result must be `{ "stored": true, "request_id": "<matching UUID>" }`.

If the `db` input appears as a static object with empty fields, switch the entire `db` input to expression mode using its ƒ button and enter `resource("f/web001/supabase")`. Do not put this expression inside the `url` field. The portable definition now uses this same binding.
9. In the Flow's Triggers/Webhooks section choose the synchronous Result/Sync endpoint. Copy the POST URL, not an async job-start URL. Typical format: `https://app.windmill.dev/api/w/<workspace>/jobs/run_wait_result/f/f/web001/contact_intake`. Use the exact URL displayed. The Edge handler also supports the version-pinned `/fv/<version>` form.
10. Create a webhook-specific/scoped token permitted to run only this Flow, with sufficient validity for the pilot and handover. Enter the token directly into Supabase Edge secrets in the next section. Do not use a broad workspace/admin token or a URL containing `?token=`.

Windmill job inputs contain form fields for authorized verification. Do not share unredacted job inputs/logs. The script itself logs neither fields nor credentials and returns only the request ID. Keep workspace access restricted and use harmless demo data.

## 3. Configure and deploy the Edge Function

In Supabase > Edge Functions > Secrets, add:

| Secret name       | Value                                                          |
| ----------------- | -------------------------------------------------------------- |
| ALLOWED_ORIGIN    | `https://mehulp1612.github.io`                                 |
| WINDMILL_FLOW_URL | The synchronous Flow webhook URL, without a token/query string |
| WINDMILL_TOKEN    | The scoped Flow token, pasted directly into the secret field   |

The origin has no repository path and no trailing slash. CORS is a browser policy, not authentication: the endpoint is intentionally public and validates all callers.

Deploy `contact-submit` from `supabase/functions/contact-submit/`:

- Dashboard route: create the function via editor; include both `index.ts` and `handler.ts` with their exact names in the same directory. Paste the matching source files. Disable JWT verification for this public function. Deploy.
- CLI route, if already installed: `supabase login`, `supabase link --project-ref <project-ref>`, then `supabase functions deploy contact-submit`. The committed config sets verify_jwt=false. If necessary use `--no-verify-jwt` explicitly. Set secret values through the dashboard, not shell history.

Record the endpoint:

```text
https://<project-ref>.supabase.co/functions/v1/contact-submit
```

The Edge Function does not need a database credential. It calls Windmill with a Bearer token and waits up to 15 seconds. The storage step has a 10-second database timeout; the browser waits 20 seconds. Timeouts do not prove a row was not stored, so always retry using the same request ID.

## 4. Connect the website and verify version A

1. In GitHub repository Settings > Secrets and variables > Actions > Variables, set `VITE_CONTACT_SUBMIT_URL` to the public endpoint above. This is a non-secret variable.
2. Run the Pages workflow again using Actions > Check, build, and deploy Pages > Run workflow. A Vite environment change requires a rebuild; merely retrying only an old deployment job will reuse the old bundle.
3. Open https://mehulp1612.github.io/SOW_WEB_001/ and refresh. Have a human enter harmless demo details and submit.
4. Confirm the page shows a reference ID only after storage succeeds. Find that same ID and fields in Supabase Table Editor and Windmill's successful run. Save dated, redacted evidence and the actual commit SHA/Actions URL.
5. Run invalid-input checks against the endpoint as well as the UI; confirm zero inserted rows. Use the SQL test for permission assertions, and additionally use the project's publishable key against the table/RPC API to prove public API read/write denial. Never use the secret key for an anonymous-access test.
6. Test outages: temporarily replace WINDMILL_TOKEN with an invalid value, submit a new inquiry, and confirm a truthful failure. Restore the token and press Retry inquiry on the same browser page. Confirm one row for the retained ID. Do not reload or edit the retained payload during the retry.
7. Repeat the same UUID request and confirm row count stays one. Record outcomes; do not mark any unobserved T1–T8 item passed.

After the deployed Flow works, export it from Windmill with inline code and save a sanitized copy as `windmill/contact_intake.deployed.flow.json` for handover. Confirm exports contain resource/variable references, never token values. Keep the generated definition too; regenerate it with `npm run windmill:export` when its script changes.

## Credential transfer and recovery

- Record project/workspace ownership and invite the authorized operator through each platform. Transfer access securely, not through Git.
- To rotate the Supabase key, create the replacement, update the Windmill secret variable, verify a harmless browser inquiry, then revoke the old key.
- To rotate the Windmill token, create a new Flow-scoped token, replace WINDMILL_TOKEN in Edge secrets, verify, then revoke the old token.
- To rebuild elsewhere: apply the migration in a new Supabase project, recreate the resource/secret and Flow, deploy Edge source and secrets, change the public frontend URL variable and rebuild through Actions. If the Pages owner changes, also update ALLOWED_ORIGIN.
- No automatic retry creates a fresh ID. Recover transient failures by restoring the dependency and retrying the original inquiry.

## Official references

- Supabase API keys: https://supabase.com/docs/guides/getting-started/api-keys
- Supabase function configuration: https://supabase.com/docs/guides/functions/function-configuration
- Windmill webhooks: https://www.windmill.dev/docs/core_concepts/webhooks
- Windmill resources: https://www.windmill.dev/docs/core_concepts/resources_and_types
