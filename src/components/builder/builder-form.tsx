"use client";

import { useState } from "react";
import { PersonalInfoForm } from "./forms/personal-info-form";
import { ExperienceForm } from "./forms/experience-form";
import { EducationForm } from "./forms/education-form";
import { SkillsForm } from "./forms/skills-form";
import { ProjectsForm } from "./forms/projects-form";

const SECTIONS = [
  { id: "personal", label: "Personal Info", component: PersonalInfoForm },
  { id: "experience", label: "Experience", component: ExperienceForm },
  { id: "education", label: "Education", component: EducationForm },
  { id: "skills", label: "Skills", component: SkillsForm },
  { id: "projects", label: "Projects", component: ProjectsForm },
] as const;

export function BuilderForm() {
  const [activeSection, setActiveSection] = useState<string>("personal");

  const ActiveComponent =
    SECTIONS.find((s) => s.id === activeSection)?.component || PersonalInfoForm;

  return (
    <div className="h-full flex flex-col">
      {/* Section tabs */}
      <div className="border-b border-gray-300 bg-white sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {SECTIONS.map((section) => (
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

      {/* Form content */}
      <div className="flex-1 overflow-y-auto p-6">
        <ActiveComponent />
      </div>
    </div>
  );
}
