# WEB-001 operator quick start

Target: a newly authorized operator verifies a browser inquiry within 30 minutes without developer assistance. Prerequisites: individual access to Supabase project `vnaclyfhumeqqtwexlxs` and Windmill workspace `mehul-pandey`; no secret values are needed in this guide. Use harmless demo data only.

1. Record your start time. Open https://mehulp1612.github.io/SOW_WEB_001/ and confirm the demo notice. For final version B, confirm **Weekend Appointments** and **Request a Callback**.
2. Enter a demo name (2–80 characters), an email you control and a harmless message (10–1000 characters). Submit once.
3. Wait for confirmed receipt and copy the displayed request UUID. If an error occurs, retain the page and ID; do not claim success or repeatedly create new inquiries.
4. Open https://app.windmill.dev/?workspace=mehul-pandey and find the matching `f/web001/contact_intake` run under Runs. Confirm it succeeded and returned `stored: true` with that UUID. Check the input fields privately against your inquiry.
5. Open https://supabase.com/dashboard/project/vnaclyfhumeqqtwexlxs and select Table Editor → public → contact_submissions. Filter request_id by the UUID.
6. Confirm exactly one matching row and the expected name, email and message. Record the UUID, Windmill run link, finish time and elapsed minutes. Share only redacted evidence.
7. If verification fails, inspect the matching Edge/Flow run without exposing credentials. A missing row or unconfirmed result is a failed check. For authorized recovery use [BACKEND_SETUP.md](BACKEND_SETUP.md); after restoration use **Retry inquiry** on the original page to preserve the ID.
8. Record PASS only if the entire check completed independently within 30 minutes with matching browser, Flow and database evidence. Send the result through the agreed handover channel.

Release SHAs and Actions links: [DELIVERY.md](DELIVERY.md). No emails are sent and no actual home services are offered.
