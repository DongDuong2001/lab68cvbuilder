# Major Update Execution Plan (Phase 1 -> Phase 3)

## Goal
Transform the product from a resume editor into a full job-application workflow platform.

## Delivery Strategy
Ship in thin vertical slices so each phase is deployable on its own.

## Phase 1: Core Workflow

### Scope
- Job descriptions storage with extracted keyword set.
- Application tracker (wishlist -> applied -> interview -> offer -> rejected).
- Link applications to resumes.
- Basic JD-driven resume tailoring action that creates a new resume copy.

### Implemented in this iteration
- Added DB entities: `jobs`, `applications`, `resume_versions`, `cover_letters`, `usage_events`.
- Added server actions:
  - `src/actions/job.ts`
  - `src/actions/application.ts`
  - `src/actions/tailor.ts`
  - `src/actions/usage-event.ts`
- Added a new tracker page:
  - `src/app/[locale]/applications/page.tsx`
- Added dashboard navigation entry to applications.

### Remaining
- Pipeline filters/search (company, role, status).
- Duplicate detection for same company+role.
- Better keyword extraction quality (AI extractor fallback).

## Phase 2: Quality + Trust

### Scope
- Resume version history with restore.
- Stronger ATS checks (keyword coverage, impact metrics, action verbs).
- Cover letter generation tied to selected application.

### Implemented in this iteration
- Added `resume_versions` and `cover_letters` tables.
- Added server actions:
  - `src/actions/resume-version.ts`
  - `src/actions/cover-letter.ts`
- Added automatic pre-save snapshot creation in `updateResume` (throttled to 15 minutes).

### Remaining
- UI for browsing/restoring resume versions.
- Cover letter editor/export UI.
- ATS scoring v2 panel and recommendations.

## Phase 3: Growth + Sharing

### Scope
- Public share links with privacy controls.
- Import v2 and conflict-resolution UX.
- New templates for key personas.
- Product analytics instrumentation.

### Implemented in this iteration
- Added `usage_events` table and action foundation.

### Remaining
- Public resume page and tokenized share links.
- Privacy toggles for phone/email/location.
- Import conflict resolver UI.
- New templates and conversion experiments.

## Next Technical Steps
1. Run migrations and verify schema rollout.
2. Add version-history panel inside builder.
3. Add "Tailor to job" action button in builder and applications page.
4. Add cover-letter generation and editing UI in application details.
5. Add Phase 3 sharing module and privacy settings.

## Operational Notes
- Use feature flags for each major module (`applicationTracker`, `tailorResume`, `coverLetter`, `publicShare`).
- Add event tracking for conversion funnels before broad launch.
- Keep backward compatibility for existing resumes and dashboard cards.
