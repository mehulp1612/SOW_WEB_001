# WEB-001 reviewer guide

Prepared for handover on 2 November 2026 at 16:00 IST (+05:30). Pilot availability commitment runs through at least 5 November 2026 at 16:00 IST. This package documents a working implementation with declared deviations and incomplete acceptance evidence; it does not claim full SOW compliance.

## Start here

1. Open the [live demonstration](https://mehulp1612.github.io/SOW_WEB_001/).
2. View the [version A flow-test recording](https://drive.google.com/file/d/1-qXnZdY_rOOEfAjc8dGrMGPgH3DtP29b/view?usp=sharing) and the [version B development and deployment recording](https://drive.google.com/file/d/1xe9YGFqKa_iSpe3Ye401an2OPlmoLLWn/view?usp=sharing).
3. Read [DELIVERY.md](DELIVERY.md) for release SHAs, Actions links, inquiry references, costs and availability.
4. Read [TEST_LOG.md](TEST_LOG.md) and [DEVELOPMENT_PROVENANCE.md](DEVELOPMENT_PROVENANCE.md) for observed checks, reported results and limitations.
5. With supplied provider access, follow the eight-step [OPERATOR_QUICKSTART.md](OPERATOR_QUICKSTART.md).

## Document and artifact index

| File | Purpose |
| --- | --- |
| DELIVERY.md | Release manifest and operational handover |
| ARCHITECTURE.md | Request chain, trust boundaries and rebuild map |
| BACKEND_SETUP.md | Account configuration, database, Flow, Edge, recovery and credential rotation |
| OPERATOR_QUICKSTART.md | Independent operator verification within 30 minutes |
| TEST_LOG.md | T1-T8 status and outstanding evidence |
| DEVELOPMENT_PROVENANCE.md | Actual development approach and declared deviations |
| ../VALIDATION.md | Local and public verification records |
| ../windmill/contact_intake.deployed.flow.json | Developer-supplied deployed Flow snapshot |
| ../supabase/migrations/ and ../supabase/tests/ | Schema, RLS and SQL verification |
| ../supabase/functions/contact-submit/ | Edge Function source |
| ../.github/workflows/deploy.yml | Automated release workflow |
| ../package-lock.json and ../.env.example | Reproducible dependencies and public environment template |

The public repository is the submission: https://github.com/mehulp1612/SOW_WEB_001. Its [main README](../README.md) is the primary documentation index. Source, Git history, handover documents and the supplied deployed Flow export are available there. No archive is supplied. Dependencies, build output and private environment values are excluded; video is shared through the link above.

## Access and outstanding evidence

Website, source repository and recording are publicly shared. Database and Windmill inspection require individual authorized account invitations, which have not yet been confirmed. Credentials are not included in the package or email. The operator exercise is not confirmed complete.

The developer reported browser storage, deduplication and outage/recovery testing. Detailed matching provider evidence and recovery trace remain to be attached. Desktop/mobile evidence, live invalid-input/anonymous API checks and the complete secret-exposure audit remain unverified in the supplied evidence. The original bolt.diy workflow was replaced by VS Code/Codex, and the recording exceeds the requested duration. Review TEST_LOG.md rather than treating passing automated tests as full live acceptance.
