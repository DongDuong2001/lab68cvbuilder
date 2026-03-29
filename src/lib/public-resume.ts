import type { ResumeData } from "@/db/schema";

export function getPublicResumeData(data: ResumeData): ResumeData {
  const shareEmail = data.personalInfo.shareEmail !== false;
  const sharePhone = data.personalInfo.sharePhone !== false;
  const shareLocation = data.personalInfo.shareLocation !== false;

  return {
    ...data,
    personalInfo: {
      ...data.personalInfo,
      email: shareEmail ? data.personalInfo.email : "",
      phone: sharePhone ? data.personalInfo.phone : "",
      location: shareLocation ? data.personalInfo.location : "",
    },
  };
}
