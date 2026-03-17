"use client";

import { useEffect, useState } from "react";
import { useResumeStore } from "@/store/resume-store";
import { EMPTY_RESUME_DATA, GUEST_STORAGE_KEY } from "@/lib/constants";
import { BuilderForm } from "./builder-form";
import { BuilderPreview } from "./builder-preview";
import { BuilderHeader } from "./builder-header";

export function GuestBuilderClient() {
  const { setResume, data, title, templateId, fontFamily, isDirty } =
    useResumeStore();
  const [isStoreReady, setIsStoreReady] = useState(false);

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
        setIsStoreReady(true);
        return;
      } catch {
        // fall through to empty data
      }
    }
    setResume("guest", "My Resume", "harvard", "inter", EMPTY_RESUME_DATA);
    setIsStoreReady(true);
  }, [setResume]);

  // Persist to localStorage whenever the store changes
  useEffect(() => {
    if (!isStoreReady) return;
    if (!isDirty) return;
    localStorage.setItem(
      GUEST_STORAGE_KEY,
      JSON.stringify({ title, templateId, fontFamily, data })
    );
  }, [isStoreReady, isDirty, title, templateId, fontFamily, data]);

  if (!isStoreReady) {
    return <div className="h-dvh bg-white" />;
  }

  return (
    <div className="h-dvh flex flex-col bg-white overflow-hidden">
      <BuilderHeader
        resumeId="guest"
        isGuest
      />

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        <div className="w-full lg:w-1/2 flex-1 lg:flex-none overflow-y-auto overscroll-y-contain border-b lg:border-b-0 lg:border-r border-black relative z-10 bg-white">
          <BuilderForm />
        </div>

        <div className="w-full lg:w-1/2 h-[45vh] lg:h-auto overflow-y-auto overscroll-y-contain bg-gray-50 shrink-0">
          <BuilderPreview />
        </div>
      </div>
    </div>
  );
}
