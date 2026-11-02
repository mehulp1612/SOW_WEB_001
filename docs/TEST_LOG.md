# WEB-001 acceptance evidence log

Date: 2 November 2026, Asia/Kolkata. PENDING means not fully demonstrated; it must become a dated PASS or FAIL before final submission. Local automated checks do not establish live-provider behavior. Store evidence privately or redact names, email addresses, messages, tokens and browser account details.

| Test | Current result | Evidence and remaining observation |
| --- | --- | --- |
| T1: Version A content/mobile/form | PENDING | Developer reports working live form. Still capture required content at desktop and phone widths, operability and visible errors. |
| T2: Actions release A | PASS (current A pipeline); initial-attempt caveat | Public Actions run [41400968715](https://github.com/mehulp1612/SOW_WEB_001/actions/runs/41400968715), SHA `ee515ee21fbd3d9573c0bd3c2ddf23fb1385d9d7`, push/main, successful locked install, test, build and deploy independently checked through GitHub API. Initial scaffold run [41343278250](https://github.com/mehulp1612/SOW_WEB_001/actions/runs/41343278250) required attempt 2 after Pages was enabled; do not claim the first attempt passed. |
| T3: Human inquiry through complete chain | PENDING evidence completion | Developer confirms browser API success and stored UUID `c9e4ff8b-b244-4d9f-b6b5-ebe2a1973ac9`. Add matching successful Windmill run/result and private field comparison, plus redacted browser/row proof. |
| T4: Invalid data rejected, zero rows | PENDING live checks | Local automated validation tests exist. Observe blank, malformed and oversized cases in UI/direct public endpoint and verify zero rows for attempted IDs. |
| T5: Anonymous deny and no secrets | PENDING live audit | Developer reports cloud SQL permission tests PASS; local SQL role tests also passed. Still capture anonymous Data API read/write denial using the publishable/anon key, and inspect tracked source/history, built bundle and browser requests for privileged credentials. Never publish request authorization headers. |
| T6: Genuine bolt version B, same URL/form | PENDING | UI is still version A. Capture actual bolt prompt/output, B SHA/Actions, callout/CTA at same URL and new browser inquiry with matching Flow/row. |
| T7: Deduplication and outage recovery | PENDING recovery portion | Developer confirms retry of `c9e4ff8b-b244-4d9f-b6b5-ebe2a1973ac9` left one row. Still demonstrate dependency outage, truthful browser error, restoration and same-ID retry resulting in exactly one row. |
| T8: Independent operator within 30 min | PENDING | Supply access and quick start to a new operator; record start/end, elapsed time, matching inquiry and confirmation of no assistance. |

## Evidence to collect

For each check record timestamp/timezone, tester, release SHA, attempted UUID(s), observed outcome and sanitized screenshot/video/run link. An expected outcome is not an observed result. Use unique IDs for invalid-input cases and query their absence; do not infer zero inserts from UI errors alone.

For T7, schedule a short controlled test on this demo. An authorized owner temporarily sets an invalid Windmill token in Edge secrets, submits a new inquiry, observes failure, restores the valid token, then retries on the same page without changing input or ID. Keep the real token in a password manager, never screenshots or Git. Query the retained ID and confirm exactly one row after recovery. This tests upstream authorization failure/recovery; label the failure mechanism accurately.

## Additional observed checks

- Public Edge OPTIONS preflight returned HTTP 204 for origin `https://mehulp1612.github.io` on 2 November 2026.
- Local PostgreSQL migration/role tests and four concurrent same-ID inserts succeeded; one final row remained. These were isolated local tests, not cloud evidence.
- See [../VALIDATION.md](../VALIDATION.md) for local build/test details.
