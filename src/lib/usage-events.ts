export const USAGE_EVENTS = {
  BUILDER_OPENED: "builder_opened",
  BUILDER_AUTOSAVE_SUCCEEDED: "builder_autosave_succeeded",
  BUILDER_ONBOARDING_COMPLETED: "builder_onboarding_completed",
  IMPORT_STARTED: "import_started",
  IMPORT_PREVIEW_READY: "import_preview_ready",
  IMPORT_APPLIED: "import_applied",
  EXPORT_STARTED: "export_started",
  EXPORT_SUCCEEDED: "export_succeeded",
  GUEST_MIGRATION_STARTED: "guest_migration_started",
  GUEST_MIGRATION_SUCCEEDED: "guest_migration_succeeded",
  GUEST_MIGRATION_FAILED: "guest_migration_failed",
} as const;

export type UsageEventName = (typeof USAGE_EVENTS)[keyof typeof USAGE_EVENTS];

