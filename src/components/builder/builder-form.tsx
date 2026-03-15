"use client";

import { useState } from "react";
import { PersonalInfoForm } from "./forms/personal-info-form";
import { ExperienceForm } from "./forms/experience-form";
import { EducationForm } from "./forms/education-form";
import { SkillsForm } from "./forms/skills-form";
import { ProjectsForm } from "./forms/projects-form";
import { CertificationsForm } from "./forms/certifications-form";
import { LanguagesForm } from "./forms/languages-form";
import { ResumeScorePanel } from "./resume-score";
import { AISuggestionsPanel } from "./ai-suggestions";

const SECTIONS = [
  { id: "personal", label: "Personal Info", component: PersonalInfoForm },
  { id: "experience", label: "Experience", component: ExperienceForm },
  { id: "education", label: "Education", component: EducationForm },
  { id: "skills", label: "Skills", component: SkillsForm },
  { id: "projects", label: "Projects", component: ProjectsForm },
  { id: "certifications", label: "Certifications", component: CertificationsForm },
  { id: "languages", label: "Languages", component: LanguagesForm },
  { id: "score", label: "Score", component: ResumeScorePanel },
  { id: "suggestions", label: "Tips", component: AISuggestionsPanel },
] as const;

export function BuilderForm() {
  const [activeSection, setActiveSection] = useState<string>("personal");
  const [sectionOrder, setSectionOrder] = useState<string[]>(() =>
    SECTIONS.map((s) => s.id)
  );

  const orderedSections = sectionOrder
    .map((id) => SECTIONS.find((s) => s.id === id))
    .filter((section): section is (typeof SECTIONS)[number] => Boolean(section));

  const activeIndex = orderedSections.findIndex((s) => s.id === activeSection);

  const moveActiveSection = (direction: "left" | "right") => {
    if (activeIndex < 0) return;
    const target = direction === "left" ? activeIndex - 1 : activeIndex + 1;
    if (target < 0 || target >= orderedSections.length) return;

    setSectionOrder((prev) => {
      const next = [...prev];
      [next[activeIndex], next[target]] = [next[target], next[activeIndex]];
      return next;
    });
  };

  const ActiveComponent =
    orderedSections.find((s) => s.id === activeSection)?.component || PersonalInfoForm;

  return (
    <div className="h-full flex flex-col">
      {/* Section tabs */}
      <div className="border-b border-gray-300 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2 px-2">
          <div className="flex-1 overflow-x-auto">
            <div className="flex min-w-max">
              {orderedSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`px-6 py-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-150 ${
                    activeSection === section.id
                      ? "bg-black text-white border-b-2 border-black"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          <div className="shrink-0 hidden md:flex items-center gap-1">
            <button
              type="button"
              onClick={() => moveActiveSection("left")}
              disabled={activeIndex <= 0}
              className="border border-gray-400 px-2 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-150 disabled:opacity-30"
              title="Move section left"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => moveActiveSection("right")}
              disabled={activeIndex < 0 || activeIndex >= orderedSections.length - 1}
              className="border border-gray-400 px-2 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-150 disabled:opacity-30"
              title="Move section right"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Form content */}
      <div className="flex-1 overflow-y-auto p-6">
        <ActiveComponent />
      </div>
    </div>
  );
}
