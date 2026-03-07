"use client";

import { useEffect, useState } from "react";
import { useResumeStore } from "@/store/resume-store";
import { CreativeTemplate } from "./templates/creative-template";
import { ExecutiveTemplate } from "./templates/executive-template";
import { HarvardTemplate } from "./templates/harvard-template";
import { AtsTemplate } from "./templates/ats-template";
import type { ResumeData } from "@/db/schema";
import type { TemplateId } from "@/lib/constants";
import { ComponentType } from "react";
import { getGoogleFontsCSSUrl, getCSSFontFamily } from "@/lib/fonts";
import { type PdfLabels, getPdfLabels, getDateLocale } from "@/lib/pdf-labels";

const TEMPLATE_COMPONENTS: Record<TemplateId, ComponentType<{ data: ResumeData; labels?: PdfLabels; dateLocale?: string }>> = {
  "creative": CreativeTemplate,
  "executive": ExecutiveTemplate,
  "harvard": HarvardTemplate,
  "ats": AtsTemplate,
};

export function BuilderPreview() {
  const { templateId, fontFamily, data, pdfLocale } = useResumeStore();
  const Template = TEMPLATE_COMPONENTS[templateId as TemplateId] || HarvardTemplate;
  const [darkBg, setDarkBg] = useState(false);

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
    <div className={`min-h-full p-8 transition-colors duration-300 ${darkBg ? "bg-gray-900" : ""}`}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className={`label-mono block mb-2 ${darkBg ? "text-gray-400" : ""}`}>LIVE_PREVIEW</span>
          <p className={`text-xs ${darkBg ? "text-gray-500" : "text-gray-600"}`}>
            This is how your resume will appear when exported
          </p>
        </div>
        <button
          onClick={() => setDarkBg(!darkBg)}
          className={`border px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors duration-150 ${
            darkBg
              ? "border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white"
              : "border-gray-400 text-gray-500 hover:bg-black hover:text-white"
          }`}
        >
          {darkBg ? "☀ Light" : "● Dark"}
        </button>
      </div>

      {/* Resume preview container — font applied here cascades to template */}
      <div
        className="bg-white shadow-2xl mx-auto"
        style={{ width: "8.5in", minHeight: "11in", fontFamily: cssFontFamily }}
      >
        <Template data={data} labels={getPdfLabels(pdfLocale)} dateLocale={getDateLocale(pdfLocale)} />
      </div>
    </div>
  );
}
