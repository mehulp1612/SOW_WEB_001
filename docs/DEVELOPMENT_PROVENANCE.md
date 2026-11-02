# Development provenance and declared deviations

The starting frontend was a partial bolt.diy export. Following reported AI-provider connection failures, the developer completed the implementation locally with Codex and elected to create version B using VS Code/Codex. Rate limiting was suspected, but the root cause was not established. No exception approval was obtained.

The SOW's prescribed change instruction was:

> Add a Weekend Appointments callout above the contact form and change the submit button to Request a Callback; keep the form operational.

This quotation records the assignment instruction, not evidence that it was submitted to bolt.diy. Original bolt prompts/conversation exports and an exact transcript of the later local prompt have not been supplied in this package. The actual local workflow is represented by the developer's recording and Git history; no reconstructed builder transcript is included.

Version B commit: `0056861cfdb13d382883fa2982e4833f257ef4cf`. The repository records the callout, CTA update and associated form test selector changes. Both A and B have successful GitHub Actions release runs listed in [DELIVERY.md](DELIVERY.md).

The recording is 5 minutes 26 seconds, exceeding the requested 2-3 minutes. Its link and checksum are recorded in DELIVERY.md. The developer confirmed public viewing in an incognito window. Contents and continuity have not been independently reviewed for this documentation.

The mandatory bolt.diy generation requirement and its recording sequence are not met; T6 is not marked fully passed. Other evidence gaps remain listed individually in [TEST_LOG.md](TEST_LOG.md). Reported work time is approximately 5 hours 40 minutes and reported project expenditure is zero. These are developer-reported values, not independently audited measurements.
