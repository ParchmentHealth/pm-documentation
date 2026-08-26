# Feature Log

Running list of features/fixes worked on, for release tracking. Newest first within each section. Date = last commit date on the branch.

## Next Release

| Date | Feature | Branch | Repos affected |
|---|---|---|---|
| 2026-07-25 | WAF — Terraform: add api + cognito WAF in prod after deleting manual WAF | `main` | tf-misc-infrastructure |
| 2026-07-25 | Endpoint hardening — email, auth, user, kms-cognito, web-ui | `bug/misc-bugs` | email-service, auth-service, user-service, web-ui |
| 2026-07-24 | Register partner org ops script | `feature/register-partner-org-ops-script` | partner-service |
| 2026-07-13 | Supply-duration estimate (supply-until hint from qty/repeats/dose/frequency) | `feature/supply-duration-algo` | erx-service, web-ui |

## Backlog

| Date | Feature | Branch | Repos affected |
|---|---|---|---|
| 2026-08-26 | AHPRA number format validation + canonical normalization at all provider write paths (shared common helper; closes unvalidated create/update-provider + schema-less prescriber form; pre-eRx check turns generic E91037 into a specific 400) + eRx adapter XML escaping of all Service Provider registration fields | `feature/ahpra-validation` | common, user-service, erx-service, erxadapter-service, web-ui |
| 2026-07-27 | Raise prescription quantity cap from 199 to 999 | `bug/quantity-max-999` | web-ui |
| 2026-07-24 | Consolidated tier selection | `feature/consolidated-tier-selection` | stripe-service, web-ui |
| 2026-07-20 | MIMS CDS drug interactions | `feature/mims-drug-interactions` | partner-service, web-ui |
| 2026-07-18 | Activation nudge system (D+2/7/14 state-aware nudges to org owner) | `feature/activation-nudges` | user-service |
| 2026-07-14 | Prescription V3 | `feature/prescription-v3` | web-ui |
| 2026-07-14 | Test framework + CI (Vitest / Storybook / Playwright, tiered GH Actions gating) | `feature/test-framework-ci` | web-ui |
| 2026-07-13 | MIMS flat file | `feature/mims-flat-file` | partner-service, tf-misc-infrastructure |
| 2026-07-10 | IHI validation lookup | `feature/ihi-validation-lookup` | web-ui |
| 2026-07-08 | HI Service search by email + mobile | `feature/HI-email-phone` | patient-service |

## Released

| Date | Feature | Branch | Repos affected |
|---|---|---|---|
| 2026-07-26 | Access-audit pipeline (CWL → Firehose Parquet archive + Athena + deny responder) — deployed to production | `main` | tf-misc-infrastructure |
