# Major Update Test Cases

## Usage Notes

Run these in staging or local with a real database and authenticated user. Validate EN and VI locales for all text-sensitive flows.

## Test Matrix

| ID | Area | Preconditions | Steps | Expected |
| --- | --- | --- | --- | --- |
| TC-01 | Application Tracker | Logged in user | Open dashboard, click Applications, wait for page load | Applications page opens without errors |
| TC-02 | Application Tracker | Logged in user | Create a job with title, company, and JD text | Job record is created and selectable |
| TC-03 | Application Tracker | At least one job exists | Create application with selected job and optional resume | Application appears in pipeline |
| TC-04 | Application Tracker | At least one application exists | Change status and save | Status updates and persists |
| TC-05 | Application Tracker | At least one application exists | Delete an application | Entry is removed from pipeline |
| TC-06 | Resume Save Reliability | Existing resume | Edit resume content and trigger save | Save succeeds even if autosnapshot fails |
| TC-07 | Version History | Existing resume | Open Versions tab and click Save Snapshot | Manual snapshot appears in list |
| TC-08 | Version History | At least one snapshot exists | Modify resume then restore prior snapshot | Resume content reverts to selected version |
| TC-09 | Version History | At least one snapshot exists | Edit snapshot label using Label action | Label is updated and shown |
| TC-10 | Version History | Multiple snapshot sources | Switch filters All, Auto, Manual, AI | Snapshot list respects source filter |
| TC-11 | Version Diff | At least two resume states | Open Diff for selected snapshot | Side-by-side fields render with change highlighting |
| TC-12 | Version Diff | Long text changed | Compare summary or description fields | Inline text diff shows added and removed content |
| TC-13 | Forg Import | Logged in user | Import using direct Forg product URL | Preview opens with Forg draft data |
| TC-14 | Forg Import | Logged in user | Import using forg.to/@username, @username, and encoded %40username URL | Profile target resolves without parsing error |
| TC-15 | Forg Picker | Forg profile with multiple products | Trigger import, choose one candidate, click Use Selected | Selected product is used in preview |
| TC-16 | Builder Header UX | Builder page open | Observe header actions desktop and mobile | Check Grammar and Export PDF are adjacent |
| TC-17 | Builder Header UX | Mobile viewport | Scroll down builder page | Header stays sticky and actions remain accessible |
| TC-18 | Homepage UI | Homepage open | Inspect achievements block and system-spec cards | #1 achievements appear and borders are consistent |
| TC-19 | SSR Hydration | Dev and prod runs | Open homepage and check console | No header hydration mismatch warning |
| TC-20 | DB Migration | Normalized migration history | Run db:migrate and inspect output | Baseline migration is not replayed |

## Execution Checklist

- Capture screenshot evidence for TC-15, TC-17, and TC-18.
- Record failing steps with exact input payload for TC-13 and TC-14.
- Re-run TC-06 through TC-12 after any schema or save-flow change.
