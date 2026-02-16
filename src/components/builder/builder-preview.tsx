"use client";

import { useEffect } from "react";
import { useResumeStore } from "@/store/resume-store";
import { LabProtocolTemplate } from "./templates/lab-protocol-template";
import { ExecutiveTemplate } from "./templates/executive-template";
import { MonoStackTemplate } from "./templates/mono-stack-template";
import { CleanSlateTemplate } from "./templates/clean-slate-template";
import { BoldImpactTemplate } from "./templates/bold-impact-template";
import { CompactProTemplate } from "./templates/compact-pro-template";
import type { ResumeData } from "@/db/schema";
import type { TemplateId } from "@/lib/constants";
import { ComponentType } from "react";
import { getGoogleFontsCSSUrl, getCSSFontFamily } from "@/lib/fonts";

const TEMPLATE_COMPONENTS: Record<TemplateId, ComponentType<{ data: ResumeData }>> = {
  "lab-protocol": LabProtocolTemplate,
  "the-executive": ExecutiveTemplate,
  "mono-stack": MonoStackTemplate,
  "clean-slate": CleanSlateTemplate,
  "bold-impact": BoldImpactTemplate,
  "compact-pro": CompactProTemplate,
};

export function BuilderPreview() {
  const { templateId, fontFamily, data } = useResumeStore();
  const Template = TEMPLATE_COMPONENTS[templateId as TemplateId] || LabProtocolTemplate;

  // Dynamically load the selected Google Font
  useEffect(() => {
    const linkId = `gfont-${fontFamily}`;
    if (document.getElementById(linkId)) return; // already loaded

    const cssUrl = getGoogleFontsCSSUrl(fontFamily);
    if (!cssUrl) return;

    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = cssUrl;
    document.head.appendChild(link);
  }, [fontFamily]);

  const cssFontFamily = getCSSFontFamily(fontFamily);

  return (
    <div className="min-h-full p-8">
      <div className="mb-6">
        <span className="label-mono block mb-2">LIVE_PREVIEW</span>
        <p className="text-xs text-gray-600">
          This is how your resume will appear when exported
        </p>
      </div>

      {/* Resume preview container — font applied here cascades to template */}
      <div
        className="bg-white shadow-2xl mx-auto"
        style={{ width: "8.5in", minHeight: "11in", fontFamily: cssFontFamily }}
      >
        <Template data={data} />
      </div>
    </div>
  );
}
