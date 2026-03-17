import type { ResumeData } from "@/db/schema";

export function getResumeBulletSymbol(data: ResumeData, fallback: string): string {
  const symbol = (data.personalInfo.bulletSymbol || "").trim();
  if (!symbol) return fallback;
  return symbol.slice(0, 3);
}
