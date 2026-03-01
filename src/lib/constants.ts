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
    id: "harvard",
    name: "Harvard Style",
    description: "Modern tech style. Elegant and academic.",
    category: "professional",
  },
  {
    id: "creative",
    name: "Creative / Portfolio",
    description: "Visually distinct. Stand out with style.",
    category: "creative",
  },
  {
    id: "ats",
    name: "ATS-Optimized",
    description: "Plain text focus. Maximum parsing compatibility.",
    category: "ats",
  },
  {
    id: "executive",
    name: "Executive / Leadership",
    description: "Clean top-down structure. Boardroom ready.",
    category: "professional",
  },
] as const;

export type TemplateId = (typeof TEMPLATES)[number]["id"];
