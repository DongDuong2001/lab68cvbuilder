import type { ResumeData } from "@/db/schema";

/**
 * Strip HTML tags and decode a small set of common HTML entities from a
 * plain-text field so that user input cannot inject markup into stored data.
 */
function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, "") // remove all HTML tags
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#x27;/gi, "'")
    .replace(/&#x2F;/gi, "/");
}

function sanitizeText(value: string | null | undefined): string {
  if (!value) return value ?? "";
  return stripHtml(value);
}

/**
 * Return a deep copy of ResumeData with all plain-text user fields sanitized.
 * Structural fields (ids, dates, booleans, URLs) are left untouched; they have
 * their own validation paths.
 */
export function sanitizeResumeData(data: ResumeData): ResumeData {
  return {
    ...data,
    personalInfo: {
      ...data.personalInfo,
      fullName: sanitizeText(data.personalInfo.fullName),
      phone: sanitizeText(data.personalInfo.phone),
      location: sanitizeText(data.personalInfo.location),
      summary: sanitizeText(data.personalInfo.summary),
      bulletSymbol: sanitizeText(data.personalInfo.bulletSymbol ?? "").slice(0, 3),
      shareEmail: data.personalInfo.shareEmail !== false,
      sharePhone: data.personalInfo.sharePhone !== false,
      shareLocation: data.personalInfo.shareLocation !== false,
    },
    experience: data.experience.map((exp) => ({
      ...exp,
      position: sanitizeText(exp.position),
      company: sanitizeText(exp.company),
      location: sanitizeText(exp.location ?? ""),
      description: sanitizeText(exp.description),
      highlights: exp.highlights.map(sanitizeText),
    })),
    education: data.education.map((edu) => ({
      ...edu,
      institution: sanitizeText(edu.institution),
      degree: sanitizeText(edu.degree),
      field: sanitizeText(edu.field),
      location: sanitizeText(edu.location ?? ""),
      gpa: sanitizeText(edu.gpa ?? ""),
      coursework: (edu.coursework ?? []).map(sanitizeText),
      highlights: edu.highlights.map(sanitizeText),
    })),
    skills: data.skills.map((cat) => ({
      ...cat,
      category: sanitizeText(cat.category),
      items: cat.items.map(sanitizeText),
    })),
    projects: data.projects.map((proj) => ({
      ...proj,
      name: sanitizeText(proj.name),
      description: sanitizeText(proj.description ?? ""),
      highlights: proj.highlights.map(sanitizeText),
    })),
    certifications: data.certifications.map((cert) => ({
      ...cert,
      name: sanitizeText(cert.name),
      issuer: sanitizeText(cert.issuer),
    })),
    languages: data.languages.map((lang) => ({
      ...lang,
      language: sanitizeText(lang.language),
    })),
    competitions: (data.competitions || []).map((comp) => ({
      ...comp,
      name: sanitizeText(comp.name),
      role: sanitizeText(comp.role ?? ""),
      location: sanitizeText(comp.location ?? ""),
      description: sanitizeText(comp.description),
      highlights: comp.highlights.map(sanitizeText),
    })),
  };
}
