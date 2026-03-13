"use client";

import { useCallback, useEffect, useState } from "react";
import { useResumeStore } from "@/store/resume-store";
import { updateResume } from "@/actions/resume";
import { useDebounce } from "@/hooks/use-debounce";
import type { Resume } from "@/db/schema";
import { BuilderForm } from "./builder-form";
import { BuilderPreview } from "./builder-preview";
import { BuilderHeader } from "./builder-header";

interface BuilderClientProps {
  resume: Resume;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function BuilderClient({ resume }: BuilderClientProps) {
  const { setResume, data, title, templateId, fontFamily, isDirty, setIsSaving, markSaved } =
    useResumeStore();

  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [saveValidationError, setSaveValidationError] = useState<string | null>(null);

  // Initialize store with resume data
  useEffect(() => {
    setResume(resume.id, resume.title, resume.templateId, resume.fontFamily ?? "inter", resume.data);
  }, [resume, setResume]);

  // Auto-save function
  const saveResume = useCallback(async () => {
    if (!isDirty) return;

    // Block save if email is present but malformed — bad data integrity
    if (data.personalInfo.email && !EMAIL_REGEX.test(data.personalInfo.email)) {
      setSaveValidationError("Invalid email — fix before saving.");
      return;
    }
    setSaveValidationError(null);

    setIsSaving(true);
    try {
      await updateResume(resume.id, {
        title,
        templateId,
        fontFamily,
        data,
      });
      markSaved();
    } catch (error) {
      console.error("Failed to save resume:", error);
      setIsSaving(false);
    }
  }, [isDirty, resume.id, title, templateId, fontFamily, data, setIsSaving, markSaved]);

  // Keyboard shortcut: Ctrl+S to save immediately
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveResume();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saveResume]);

  // Debounced save (2 seconds after last change)
  const debouncedSave = useDebounce(saveResume, 2000);

  // Trigger auto-save when data changes
  useEffect(() => {
    if (isDirty) {
      debouncedSave();
    }
  }, [isDirty, debouncedSave]);

  return (
    <div className="h-dvh flex flex-col bg-white">
      {/* Header */}
      <BuilderHeader
        resumeId={resume.id}
        isMobilePreview={isMobilePreview}
        onToggleMobilePreview={() => setIsMobilePreview(!isMobilePreview)}
        saveValidationError={saveValidationError}
      />

      {/* Split View */}
      <div className="flex-1 flex overflow-clip">
        {/* Left Panel - Form */}
        <div
          className={`w-full lg:w-1/2 overflow-y-auto overscroll-y-contain border-r border-black ${isMobilePreview ? "hidden lg:block" : "block"
            }`}
        >
          <BuilderForm />
        </div>

        {/* Right Panel - Preview */}
        <div
          className={`w-full lg:w-1/2 overflow-y-auto overscroll-y-contain bg-gray-50 ${isMobilePreview ? "block" : "hidden lg:block"
            }`}
        >
          <BuilderPreview />
        </div>
      </div>
    </div>
  );
}
