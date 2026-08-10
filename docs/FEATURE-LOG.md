# Feature Log

Running list of features/fixes worked on, for release tracking. Newest first within each section. Date = last commit date on the branch.

## Next Release

| Date | Feature | Branch | Repos affected | Merged to sandbox |
|---|---|---|---|---|
| 2026-08-08 | Supply-duration estimate (supply-until hint from qty/repeats/dose/frequency) | `feature/supply-duration-algo` | erx-service, web-ui | yes|
| 2026-07-25 | WAF — Terraform: add api + cognito WAF in prod after deleting manual WAF | `main` | tf-misc-infrastructure | yes |
| 2026-07-29 | WAF — pin NoUserAgent_HEADER to Count (blocked partner server-to-server token calls) | `feature/misc-tweaks` | tf-misc-infrastructure | yes |

## Backlog

| Date | Feature | Branch | Repos affected |
|---|---|---|---|
| 2026-08-10 | In-app feature announcements (markdown posts published to S3/CloudFront via script — no redeploy; corner-card popup + bell feed in web-ui) | `feature/announcements` | web-ui, tf-misc-infrastructure |
| 2026-08-09 | WA conformance (PAR-1072): print min repeat interval next to repeats on paper prescription PDF; precheck skip-reason metrics with state/schedule context; Grafana precheck-outcomes panel | `feature/wa-conformance` | web-ui, erx-service, tf-misc-infrastructure |
| 2026-08-06 | eScript Pending badge click-through: popover explaining why a prescriber is pending (grouped by who can act: user EULA acceptance, admin profile/HPI-I fixes, automatic MIMS provisioning); users list now returns derived `onboarding` so the profile gate is evaluable | `feature/escript-pending-details` | web-ui, user-service |
| 2026-08-05 | Stay on prescription page after queuing a script (confirmation dialog + form reset instead of redirect to patient profile) | `feature/queue-script-stay-on-page` | web-ui |
| 2026-07-31 | Host-only SSO cookies + legacy .parchment.health migration (fixes cookie-bloat 403/431) | `bug/sso-cookie-bloat` | web-ui |
| 2026-07-30 | User analytics module (event pipeline, funnels, struggle/stuck signals, heatmaps) | `feature/user-analytics` | analytics-service, web-ui, tf-misc-infrastructure |
| 2026-07-30 | External IHI precheck endpoint for partners (live HI dry-run of create) | `feature/patient-ihi-precheck` | patient-service, tf-misc-infrastructure |
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
| 2026-08-08 | eScript Pending badge click-through: popover explaining why a prescriber is pending (grouped by who can act: user EULA acceptance, admin profile/HPI-I fixes, automatic MIMS provisioning); users list now returns derived `onboarding` so the profile gate is evaluable | `feature/escript-pending-details` | web-ui, user-service | 
| 2026-08-08  | Lowercase email at all sign-up entry points (case-sensitive Cognito pool created duplicate users) | `feature/email-case-insensitive-signup` | user-service, auth-service, web-ui 
| 2026-08-08 | HPI-I conflict on provider create: surface + log, and supersede stale records of disabled/deleted holders (fixes silent onboarding loop for duplicate accounts) | `feature/hpii-conflict-feedback` | user-service, web-ui | 
| 2026-08-08  | Endpoint hardening — email, auth, user, kms-cognito, web-ui | `bug/misc-bugs` | kms-cognito, email-service, auth-service, user-service, web-ui | 
| 2026-08-08 | Register partner org ops script | `feature/register-partner-org-ops-script` | partner-service | 
| 2026-08-08  | Fix deep-link redirect after login timeout (preserve authRedirect cookie) | `fix/login-redirect-continuity` | web-ui | 
| 2026-08-08  | Consolidated tier selection + FLAT multi-org quantity merge (fixes duplicate-price sync failure); setup script takes mandatory --product-id; fix canceled-sub paywall bypass (subscriptions.list status:all) | `feature/consolidated-tier-selection` | stripe-service, web-ui | 


| Date | Feature | Branch | Repos affected |
|---|---|---|---|
| 2026-07-27 | Raise prescription quantity cap from 199 to 999 | `bug/quantity-max-999` | web-ui |
| 2026-07-26 | Access-audit pipeline (CWL → Firehose Parquet archive + Athena + deny responder) — deployed to production | `main` | tf-misc-infrastructure |


