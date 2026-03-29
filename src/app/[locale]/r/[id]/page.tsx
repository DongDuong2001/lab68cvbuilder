import { notFound } from "next/navigation";
import { getPublicResume } from "@/actions/resume";
import { getPublicResumeData } from "@/lib/public-resume";
import { HarvardTemplate } from "@/components/builder/templates/harvard-template";
import { CreativeTemplate } from "@/components/builder/templates/creative-template";
import { AtsTemplate } from "@/components/builder/templates/ats-template";
import { ExecutiveTemplate } from "@/components/builder/templates/executive-template";
import { MinimalTemplate } from "@/components/builder/templates/minimal-template";
import { ModernTemplate } from "@/components/builder/templates/modern-template";
import { getPdfLabels, getDateLocale } from "@/lib/pdf-labels";

interface PublicResumePageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

const TEMPLATE_MAP = {
  harvard: HarvardTemplate,
  creative: CreativeTemplate,
  ats: AtsTemplate,
  executive: ExecutiveTemplate,
  minimal: MinimalTemplate,
  modern: ModernTemplate,
} as const;

export default async function PublicResumePage({ params }: PublicResumePageProps) {
  const { locale, id } = await params;
  const resume = await getPublicResume(id);

  if (!resume) {
    notFound();
  }

  const Template =
    TEMPLATE_MAP[resume.templateId as keyof typeof TEMPLATE_MAP] ?? HarvardTemplate;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="mx-auto max-w-225 border border-black bg-white shadow-2xl">
        <Template
          data={getPublicResumeData(resume.data)}
          labels={getPdfLabels(locale)}
          dateLocale={getDateLocale(locale)}
        />
      </div>
    </div>
  );
}
