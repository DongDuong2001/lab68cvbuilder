"use client";

import { useEffect, useState } from "react";
import { useResumeStore } from "@/store/resume-store";
import { EMPTY_RESUME_DATA } from "@/lib/constants";
import { BuilderForm } from "./builder-form";
import { BuilderPreview } from "./builder-preview";
import { BuilderHeader } from "./builder-header";

export const GUEST_STORAGE_KEY = "lab68_guest_resume";

export function GuestBuilderClient() {
  const { setResume, data, title, templateId, fontFamily, isDirty } =
    useResumeStore();
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  // Initialize store from localStorage or empty data
  useEffect(() => {
    const stored = localStorage.getItem(GUEST_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setResume(
          "guest",
          parsed.title || "My Resume",
          parsed.templateId || "harvard",
          parsed.fontFamily || "inter",
          parsed.data || EMPTY_RESUME_DATA
        );
        return;
      } catch {
        // fall through to empty data
      }
    }
    setResume("guest", "My Resume", "harvard", "inter", EMPTY_RESUME_DATA);
  }, [setResume]);

  // Persist to localStorage whenever the store changes
  useEffect(() => {
    if (!isDirty) return;
    localStorage.setItem(
      GUEST_STORAGE_KEY,
      JSON.stringify({ title, templateId, fontFamily, data })
    );
  }, [isDirty, title, templateId, fontFamily, data]);

  return (
    <div className="h-screen flex flex-col bg-white">
      <BuilderHeader
        resumeId="guest"
        isMobilePreview={isMobilePreview}
        onToggleMobilePreview={() => setIsMobilePreview(!isMobilePreview)}
        isGuest
      />

      <div className="flex-1 flex overflow-hidden">
        <div
          className={`w-full lg:w-1/2 overflow-y-auto border-r border-black ${
            isMobilePreview ? "hidden lg:block" : "block"
          }`}
        >
          <BuilderForm />
        </div>

        <div
          className={`w-full lg:w-1/2 overflow-y-auto bg-gray-50 ${
            isMobilePreview ? "block" : "hidden lg:block"
          }`}
        >
          <BuilderPreview />
        </div>
      </div>
    </div>
  );
}
