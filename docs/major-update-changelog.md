# Major Update Changelog

## Release Scope

This major update expands the app from a resume editor into a broader job-application workflow with versioning, importing, and UX improvements.

## Added

### Job Application Workflow

- Added data model support for:
- jobs
- applications
- resume versions
- cover letters
- usage events

- Added server actions for:
- job CRUD
- application CRUD
- usage event tracking
- resume tailoring
- cover letter generation

- Added Applications tracker page with:
- create job form
- create application form
- pipeline status updates
- delete application action

- Added dashboard navigation link to Applications.

### Resume Versioning

- Added manual and autosave snapshot capability.
- Added Version History tab in builder.
- Added restore snapshot action.
- Added snapshot label editing.
- Added source filters (all, autosave, manual, AI).
- Added side-by-side field diff preview.
- Added inline visual text diff for long-form fields.

### Import Enhancements

- Added Forg import source support.
- Added Forg profile URL and handle parsing support, including:
- forg.to/products/{product-id}
- forg.to/@username
- @username
- URL-encoded handles such as %40username

- Added Forg product ranking strategy for profile imports using:
- candidate frequency
- owner-context hinting
- recent update-page recency boosts
- product-page verification fallback

- Added picker UX for multiple strong Forg product candidates.
- Added dedicated Forg action module to reduce hot-reload instability.

### Homepage Updates

- Added achievements section highlighting:
- #1 Product of the Day on Unikorn
- #1 Product of the Week on Forg

- Corrected System Specs borderlines for more consistent section framing.

## Improved

### Builder UX

- Moved Check Grammar next to Export PDF for better action proximity.
- Replaced grammar alert popups with inline status feedback.
- Added auto-dismiss for grammar feedback messages.
- Made builder action header sticky on small screens for easier access.

### Hydration Stability

- Converted layout Header translation loading to server-side translation retrieval for stable SSR markup and reduced hydration mismatch risk.

### Save Reliability

- Made resume autosnapshot logic best-effort.
- Resume save now continues even if resume_versions query/insert fails, preventing user-blocking save errors.

## Internationalization

- Added EN and VI strings for:
- Forg import placeholders and errors
- Forg multi-candidate picker labels and hints
- Homepage achievements section

## Database and Migration Notes

- Generated baseline Drizzle migration assets.
- Applied schema sync to existing database using drizzle push.
- Normalized migration history in database so future drizzle migrate runs are aligned.

## Validation Performed

- Typecheck/build: passed via next build.
- Drizzle schema sync: applied successfully.
- Drizzle migrate post-normalization: exits successfully.
