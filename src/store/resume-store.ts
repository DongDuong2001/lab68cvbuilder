import { create } from "zustand";
import type { ResumeData } from "@/db/schema";
import { EMPTY_RESUME_DATA } from "@/lib/constants";

interface ResumeState {
  // ── State ─────────────────────────────────────────────
  resumeId: string | null;
  title: string;
  templateId: string;
  fontFamily: string;
  data: ResumeData;
  isDirty: boolean;
  isSaving: boolean;
  lastSavedAt: Date | null;

  // ── Actions ───────────────────────────────────────────
  setResume: (id: string, title: string, templateId: string, fontFamily: string, data: ResumeData) => void;
  setTitle: (title: string) => void;
  setTemplateId: (templateId: string) => void;
  setFontFamily: (fontFamily: string) => void;
  setData: (data: ResumeData) => void;
  updatePersonalInfo: (info: Partial<ResumeData["personalInfo"]>) => void;
  setIsSaving: (saving: boolean) => void;
  markSaved: () => void;
  reset: () => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  // ── Initial State ─────────────────────────────────────
  resumeId: null,
  title: "Untitled Resume",
  templateId: "lab-protocol",
  fontFamily: "inter",
  data: EMPTY_RESUME_DATA,
  isDirty: false,
  isSaving: false,
  lastSavedAt: null,

  // ── Actions ───────────────────────────────────────────
  setResume: (id, title, templateId, fontFamily, data) =>
    set({
      resumeId: id,
      title,
      templateId,
      fontFamily,
      data,
      isDirty: false,
    }),

  setTitle: (title) =>
    set({ title, isDirty: true }),

  setTemplateId: (templateId) =>
    set({ templateId, isDirty: true }),

  setFontFamily: (fontFamily) =>
    set({ fontFamily, isDirty: true }),

  setData: (data) =>
    set({ data, isDirty: true }),

  updatePersonalInfo: (info) =>
    set((state) => ({
      data: {
        ...state.data,
        personalInfo: { ...state.data.personalInfo, ...info },
      },
      isDirty: true,
    })),

  setIsSaving: (isSaving) =>
    set({ isSaving }),

  markSaved: () =>
    set({
      isDirty: false,
      isSaving: false,
      lastSavedAt: new Date(),
    }),

  reset: () =>
    set({
      resumeId: null,
      title: "Untitled Resume",
      templateId: "lab-protocol",
      fontFamily: "inter",
      data: EMPTY_RESUME_DATA,
      isDirty: false,
      isSaving: false,
      lastSavedAt: null,
    }),
}));
