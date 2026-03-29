import type { ResumeData } from "@/db/schema";

export type AtsRecommendation = {
  coveragePercent: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function collectResumeText(data: ResumeData): string {
  const chunks: string[] = [];
  chunks.push(data.personalInfo.summary ?? "");
  chunks.push(...data.experience.map((e) => `${e.position} ${e.company} ${e.description} ${e.highlights.join(" ")}`));
  chunks.push(...data.skills.flatMap((s) => [s.category, ...s.items]));
  chunks.push(...data.projects.map((p) => `${p.name} ${p.description} ${p.technologies.join(" ")} ${p.highlights.join(" ")}`));
  return normalize(chunks.join(" "));
}

export function getAtsRecommendations(
  resumeData: ResumeData | null | undefined,
  extractedKeywords: string[] | null | undefined
): AtsRecommendation {
  const keywords = (extractedKeywords ?? []).map(normalize).filter(Boolean);
  if (!resumeData || keywords.length === 0) {
    return {
      coveragePercent: 0,
      matchedKeywords: [],
      missingKeywords: [],
      recommendations: ["Attach a resume and job description to receive ATS guidance."],
    };
  }

  const text = collectResumeText(resumeData);
  const matched = keywords.filter((keyword) => text.includes(keyword));
  const missing = keywords.filter((keyword) => !text.includes(keyword));
  const coveragePercent = Math.round((matched.length / keywords.length) * 100);

  const recommendations: string[] = [];
  if (missing.length > 0) {
    recommendations.push(
      `Add missing role terms: ${missing.slice(0, 6).join(", ")}${missing.length > 6 ? "..." : ""}.`
    );
  }
  if ((resumeData.personalInfo.summary ?? "").trim().length < 50) {
    recommendations.push("Expand your professional summary to include role-specific keywords.");
  }
  if (resumeData.experience.every((e) => e.highlights.length === 0)) {
    recommendations.push("Add measurable bullet highlights in experience sections.");
  }
  if (recommendations.length === 0) {
    recommendations.push("Strong keyword coverage. Keep refining quantified impact statements.");
  }

  return {
    coveragePercent,
    matchedKeywords: matched,
    missingKeywords: missing,
    recommendations,
  };
}
