import type { ResumeData } from "@/db/schema";

/**
 * Empty resume data template — used when creating new resumes.
 */
export const EMPTY_RESUME_DATA: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
};

/**
 * Available templates
 */
export const TEMPLATES = [
  {
    id: "lab-protocol",
    name: "The Lab Protocol",
    description: "Minimalist. Sidebar-heavy. Monospace headers. Structured.",
    category: "creative",
  },
  {
    id: "the-executive",
    name: "The Executive",
    description: "Clean. Traditional top-down. High-contrast borders.",
    category: "professional",
  },
  {
    id: "mono-stack",
    name: "Mono Stack",
    description: "Two-column grid. Developer-focused. Tight spacing.",
    category: "creative",
  },
  {
    id: "clean-slate",
    name: "Clean Slate",
    description: "Airy. Generous whitespace. Subtle grey accents.",
    category: "professional",
  },
  {
    id: "bold-impact",
    name: "Bold Impact",
    description: "Large name. Color accent bar. Modern corporate.",
    category: "professional",
  },
  {
    id: "compact-pro",
    name: "Compact Pro",
    description: "Dense single-column. ATS-friendly. Maximum content.",
    category: "ats",
  },
] as const;

export type TemplateId = (typeof TEMPLATES)[number]["id"];
