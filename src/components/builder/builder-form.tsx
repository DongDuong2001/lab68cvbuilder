"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useResumeStore } from "@/store/resume-store";
import { PersonalInfoForm } from "./forms/personal-info-form";
import { ExperienceForm } from "./forms/experience-form";
import { EducationForm } from "./forms/education-form";
import { SkillsForm } from "./forms/skills-form";
import { ProjectsForm } from "./forms/projects-form";
import { CertificationsForm } from "./forms/certifications-form";
import { CompetitionsForm } from "./forms/competitions-form";
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
  { id: "competitions", label: "Competitions", component: CompetitionsForm },
  { id: "languages", label: "Languages", component: LanguagesForm },
  { id: "versions", label: "Versions", component: VersionHistoryPanel },
  { id: "score", label: "Score", component: ResumeScorePanel },
  { id: "suggestions", label: "Tips", component: AISuggestionsPanel },
] as const;

export function BuilderForm() {
  const searchParams = useSearchParams();
  const activeSection = useResumeStore((state) => state.activeSection);
  const setActiveSection = useResumeStore((state) => state.setActiveSection);
  const hiddenSections = useResumeStore((state) => state.hiddenSections);
  const toggleSectionVisibility = useResumeStore((state) => state.toggleSectionVisibility);
  const [sectionOrder, setSectionOrder] = useState<string[]>(() =>
    SECTIONS.map((s) => s.id)
  );
  const tabsContainerRef = useRef<HTMLDivElement | null>(null);
  const [showSectionManager, setShowSectionManager] = useState(false);
  const sectionManagerRef = useRef<HTMLDivElement | null>(null);

  // Close section manager when clicking outside
  useEffect(() => {
    if (!showSectionManager) return;
    const handleClick = (e: MouseEvent) => {
      if (sectionManagerRef.current && !sectionManagerRef.current.contains(e.target as Node)) {
        setShowSectionManager(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showSectionManager]);

  // Sections that the user has *not* hidden
  const visibleSectionIds = sectionOrder.filter((id) => !hiddenSections.includes(id));
  const visibleSections = visibleSectionIds
    .map((id) => SECTIONS.find((s) => s.id === id))
    .filter((section): section is (typeof SECTIONS)[number] => Boolean(section));

  // If the active section gets hidden, jump to the first visible section
  useEffect(() => {
    if (hiddenSections.includes(activeSection) && visibleSections.length > 0) {
      setActiveSection(visibleSections[0].id);
    }
  }, [hiddenSections, activeSection, visibleSections, setActiveSection]);

  const activeIndex = visibleSections.findIndex((s) => s.id === activeSection);

  useEffect(() => {
    if (searchParams.get("entry") === "import") {
      setActiveSection("personal");
    }

    const applyHashSection = () => {
      const raw = window.location.hash.replace("#", "").trim();
      if (!raw) return;
      const exists = visibleSections.some((section) => section.id === raw);
      if (exists) {
        setActiveSection(raw);
      }
    };

    applyHashSection();
    window.addEventListener("hashchange", applyHashSection);
    return () => window.removeEventListener("hashchange", applyHashSection);
  }, [searchParams, visibleSections, setActiveSection]);

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

  // ── Move section with visual feedback ────────────────────
  const [recentlyMovedId, setRecentlyMovedId] = useState<string | null>(null);
  const [moveFeedback, setMoveFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!recentlyMovedId) return;
    const timer = window.setTimeout(() => setRecentlyMovedId(null), 800);
    return () => window.clearTimeout(timer);
  }, [recentlyMovedId]);

  useEffect(() => {
    if (!moveFeedback) return;
    const timer = window.setTimeout(() => setMoveFeedback(null), 2000);
    return () => window.clearTimeout(timer);
  }, [moveFeedback]);

  const moveActiveSection = (direction: "left" | "right") => {
    if (activeIndex < 0) return;
    const target = direction === "left" ? activeIndex - 1 : activeIndex + 1;
    if (target < 0 || target >= visibleSections.length) return;

    const movedSection = visibleSections[activeIndex];

    setSectionOrder((prev) => {
      const next = [...prev];
      const prevIdx = next.indexOf(visibleSections[activeIndex].id);
      const targetIdx = next.indexOf(visibleSections[target].id);
      [next[prevIdx], next[targetIdx]] = [next[targetIdx], next[prevIdx]];
      return next;
    });

    // Trigger visual feedback
    setRecentlyMovedId(movedSection.id);
    const newPosition = target + 1;
    const arrow = direction === "left" ? "←" : "→";
    setMoveFeedback(`${arrow} Moved "${movedSection.label}" to position ${newPosition}`);
  };

  const ActiveComponent =
    visibleSections.find((s) => s.id === activeSection)?.component || PersonalInfoForm;

  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex >= 0 && activeIndex < visibleSections.length - 1;

  const goToAdjacentSection = (direction: "prev" | "next") => {
    if (activeIndex < 0) return;
    const target = direction === "prev" ? activeIndex - 1 : activeIndex + 1;
    if (target < 0 || target >= visibleSections.length) return;
    setActiveSection(visibleSections[target].id);
  };

  const hiddenCount = hiddenSections.length;
  const activeSectionLabel = visibleSections[activeIndex]?.label ?? "Section";

  return (
    <div className="h-full flex flex-col">
      {/* Section tabs */}
      <div className="border-b border-gray-300 bg-white sticky top-0 z-10">
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="label-mono text-gray-500">SECTION NAVIGATION</p>
              <p className="text-xs text-gray-600 mt-1">
                Section {Math.max(activeIndex + 1, 1)} of {visibleSections.length}
                {hiddenCount > 0 && <span className="text-gray-400"> · {hiddenCount} hidden</span>}
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

        <div className="flex items-center gap-2 px-0 sm:px-2 py-2">
          <div className="flex-1 overflow-x-auto scrollbar-none" ref={tabsContainerRef}>
            <div className="flex min-w-max gap-2 snap-x snap-mandatory px-4 sm:px-2">
              {visibleSections.map((section, index) => {
                const isJustMoved = recentlyMovedId === section.id;
                return (
                  <button
                    key={section.id}
                    data-section-id={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`snap-start px-3 py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 border ${
                      isJustMoved
                        ? "bg-yellow-400 text-black border-yellow-500 ring-2 ring-yellow-300 scale-105"
                        : activeSection === section.id
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                    aria-current={activeSection === section.id ? "page" : undefined}
                  >
                    <span className="mr-1.5 opacity-70">{String(index + 1).padStart(2, "0")}</span>
                    {section.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reorder controls — clearly labeled with the active section name */}
          <div className="shrink-0 hidden md:flex items-center gap-1">
            <button
              type="button"
              onClick={() => moveActiveSection("left")}
              disabled={activeIndex <= 0}
              className="border border-gray-400 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-150 disabled:opacity-30 flex items-center gap-1"
              title={`Move "${activeSectionLabel}" to the left`}
            >
              <span>←</span>
              <span>Move</span>
            </button>
            <span className="text-[9px] font-bold uppercase tracking-wider bg-gray-100 border border-gray-300 text-gray-700 px-2 py-1 max-w-28 truncate" title={activeSectionLabel}>
              {activeSectionLabel}
            </span>
            <button
              type="button"
              onClick={() => moveActiveSection("right")}
              disabled={activeIndex < 0 || activeIndex >= visibleSections.length - 1}
              className="border border-gray-400 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-150 disabled:opacity-30 flex items-center gap-1"
              title={`Move "${activeSectionLabel}" to the right`}
            >
              <span>Move</span>
              <span>→</span>
            </button>
          </div>

          {/* Manage Sections toggle */}
          <div className="relative shrink-0" ref={sectionManagerRef}>
            <button
              type="button"
              onClick={() => setShowSectionManager(!showSectionManager)}
              className={`border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors duration-150 ${
                showSectionManager
                  ? "bg-black text-white border-black"
                  : "border-gray-400 text-gray-600 hover:bg-black hover:text-white"
              }`}
              title="Show or hide sections"
            >
              ⚙ Sections{hiddenCount > 0 ? ` (${hiddenCount} hidden)` : ""}
            </button>

            {showSectionManager && (
              <div className="absolute right-0 top-full mt-2 z-50 border border-black bg-white shadow-lg w-56">
                <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
                  <p className="label-mono text-gray-500 text-[10px]">TOGGLE SECTIONS</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Click to show/hide</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {SECTIONS.map((section) => {
                    const isHidden = hiddenSections.includes(section.id);
                    const isPersonal = section.id === "personal";
                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => !isPersonal && toggleSectionVisibility(section.id)}
                        disabled={isPersonal}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-medium transition-colors duration-100 ${
                          isPersonal
                            ? "text-gray-400 cursor-not-allowed bg-gray-50"
                            : isHidden
                            ? "text-gray-400 hover:bg-gray-100"
                            : "text-black hover:bg-gray-100"
                        }`}
                      >
                        <span className={`inline-block w-4 h-4 border text-center text-[10px] leading-4 font-bold ${
                          isHidden ? "border-gray-300" : "border-black bg-black text-white"
                        }`}>
                          {isHidden ? "" : "✓"}
                        </span>
                        <span className={isHidden ? "line-through" : ""}>{section.label}</span>
                        {isPersonal && <span className="ml-auto text-[9px] text-gray-400 uppercase">Required</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Move feedback toast — appears inside the nav area */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            moveFeedback ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex items-center gap-2 px-4 py-1.5 bg-yellow-50 border-t border-yellow-200">
            <span className="inline-block w-2 h-2 rounded-full bg-yellow-400" />
            <span className="text-[11px] font-semibold text-yellow-800">{moveFeedback}</span>
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
