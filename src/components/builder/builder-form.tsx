"use client";

import { useEffect, useRef, useState } from "react";
import { PersonalInfoForm } from "./forms/personal-info-form";
import { ExperienceForm } from "./forms/experience-form";
import { EducationForm } from "./forms/education-form";
import { SkillsForm } from "./forms/skills-form";
import { ProjectsForm } from "./forms/projects-form";
import { CertificationsForm } from "./forms/certifications-form";
import { LanguagesForm } from "./forms/languages-form";
import { ResumeScorePanel } from "./resume-score";
import { AISuggestionsPanel } from "./ai-suggestions";
import { VersionHistoryPanel } from "./version-history-panel";

const SECTIONS = [
  { id: "personal", label: "Personal Info", component: PersonalInfoForm },
  { id: "experience", label: "Experience", component: ExperienceForm },
  { id: "education", label: "Education", component: EducationForm },
  { id: "skills", label: "Skills", component: SkillsForm },
  { id: "projects", label: "Projects", component: ProjectsForm },
  { id: "certifications", label: "Certifications", component: CertificationsForm },
  { id: "languages", label: "Languages", component: LanguagesForm },
  { id: "versions", label: "Versions", component: VersionHistoryPanel },
  { id: "score", label: "Score", component: ResumeScorePanel },
  { id: "suggestions", label: "Tips", component: AISuggestionsPanel },
] as const;

export function BuilderForm() {
  const [activeSection, setActiveSection] = useState<string>("personal");
  const [sectionOrder, setSectionOrder] = useState<string[]>(() =>
    SECTIONS.map((s) => s.id)
  );
  const tabsContainerRef = useRef<HTMLDivElement | null>(null);

  const orderedSections = sectionOrder
    .map((id) => SECTIONS.find((s) => s.id === id))
    .filter((section): section is (typeof SECTIONS)[number] => Boolean(section));

  const activeIndex = orderedSections.findIndex((s) => s.id === activeSection);

  useEffect(() => {
    const applyHashSection = () => {
      const raw = window.location.hash.replace("#", "").trim();
      if (!raw) return;
      const exists = orderedSections.some((section) => section.id === raw);
      if (exists) {
        setActiveSection(raw);
      }
    };

    applyHashSection();
    window.addEventListener("hashchange", applyHashSection);
    return () => window.removeEventListener("hashchange", applyHashSection);
  }, [orderedSections]);

  useEffect(() => {
    if (!tabsContainerRef.current) return;
    const activeTab = tabsContainerRef.current.querySelector(
      `[data-section-id="${activeSection}"]`
    ) as HTMLElement | null;

    if (!activeTab) return;

    // Keep the selected section tab comfortably visible on narrow screens.
    activeTab.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeSection]);

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

  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex >= 0 && activeIndex < orderedSections.length - 1;

  const goToAdjacentSection = (direction: "prev" | "next") => {
    if (activeIndex < 0) return;
    const target = direction === "prev" ? activeIndex - 1 : activeIndex + 1;
    if (target < 0 || target >= orderedSections.length) return;
    setActiveSection(orderedSections[target].id);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Section tabs */}
      <div className="border-b border-gray-300 bg-white sticky top-0 z-10">
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="label-mono text-gray-500">SECTION NAVIGATION</p>
              <p className="text-xs text-gray-600 mt-1">
                Section {Math.max(activeIndex + 1, 1)} of {orderedSections.length}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => goToAdjacentSection("prev")}
                disabled={!hasPrev}
                className="border border-gray-400 px-3 py-2 text-[10px] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-150 disabled:opacity-30"
                title="Previous section"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => goToAdjacentSection("next")}
                disabled={!hasNext}
                className="border border-gray-400 px-3 py-2 text-[10px] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-150 disabled:opacity-30"
                title="Next section"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex-1 overflow-x-auto scrollbar-none" ref={tabsContainerRef}>
            <div className="flex min-w-max gap-2 snap-x snap-mandatory px-2">
              {orderedSections.map((section, index) => (
                <button
                  key={section.id}
                  data-section-id={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`snap-start px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-150 border ${
                    activeSection === section.id
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                  aria-current={activeSection === section.id ? "page" : undefined}
                >
                  <span className="mr-2 opacity-70">{String(index + 1).padStart(2, "0")}</span>
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

      <div className="sm:hidden grid grid-cols-2 gap-2 border-b border-gray-200 bg-white px-3 py-2">
        <button
          type="button"
          onClick={() => goToAdjacentSection("prev")}
          disabled={!hasPrev}
          className="border border-gray-400 px-3 py-2 text-[10px] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-150 disabled:opacity-30"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => goToAdjacentSection("next")}
          disabled={!hasNext}
          className="border border-gray-400 px-3 py-2 text-[10px] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-150 disabled:opacity-30"
        >
          Next
        </button>
      </div>

      {/* Form content */}
      <div className="flex-1 overflow-y-auto p-6">
        <ActiveComponent />
      </div>
    </div>
  );
}
