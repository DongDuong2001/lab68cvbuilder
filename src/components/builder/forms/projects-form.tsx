"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resume-store";
import type { ResumeData } from "@/db/schema";

export function ProjectsForm() {
  const { data, setData } = useResumeStore();
  const { projects } = data;
  const [techInputValues, setTechInputValues] = useState<Record<string, string>>({});

  const addProject = () => {
    const newProject: ResumeData["projects"][0] = {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      url: "",
      technologies: [],
      highlights: [],
    };

    setData({
      ...data,
      projects: [...projects, newProject],
    });
  };

  const removeProject = (id: string) => {
    setData({
      ...data,
      projects: projects.filter((proj) => proj.id !== id),
    });
    // Clean up input state
    setTechInputValues((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const updateProject = (
    id: string,
    updates: Partial<ResumeData["projects"][0]>
  ) => {
    setData({
      ...data,
      projects: projects.map((proj) =>
        proj.id === id ? { ...proj, ...updates } : proj
      ),
    });
  };

  const addTechnology = (projectId: string, tech: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project || !tech.trim()) return;

    updateProject(projectId, {
      technologies: [...project.technologies, tech.trim()],
    });
  };

  const removeTechnology = (projectId: string, techIndex: number) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    updateProject(projectId, {
      technologies: project.technologies.filter((_, idx) => idx !== techIndex),
    });
  };

  const handleTechInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    projectId: string
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = techInputValues[projectId] || "";
      if (value.trim()) {
        addTechnology(projectId, value);
        setTechInputValues((prev) => ({ ...prev, [projectId]: "" }));
      }
    } else if (e.key === "Backspace" && !techInputValues[projectId]) {
      const project = projects.find((p) => p.id === projectId);
      if (project && project.technologies.length > 0) {
        removeTechnology(projectId, project.technologies.length - 1);
      }
    }
  };

  const updateHighlight = (projId: string, index: number, value: string) => {
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;

    const newHighlights = [...proj.highlights];
    newHighlights[index] = value;
    updateProject(projId, { highlights: newHighlights });
  };

  const addHighlight = (projId: string) => {
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;

    updateProject(projId, { highlights: [...proj.highlights, ""] });
  };

  const removeHighlight = (projId: string, index: number) => {
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;

    updateProject(projId, {
      highlights: proj.highlights.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <span className="label-mono block mb-4">SECTION_05 // PROJECTS</span>
        <h2 className="text-3xl font-black tracking-tight mb-2">Projects</h2>
        <p className="text-sm text-gray-600">
          Notable projects, open-source contributions, or side work
        </p>
      </div>

      <div className="space-y-8">
        {projects.map((project, index) => (
          <div key={project.id} className="border border-black p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="label-mono">
                PROJECT_{String(index + 1).padStart(2, "0")}
              </span>
              <button
                onClick={() => removeProject(project.id)}
                className="border border-red-600 text-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider hover:bg-red-600 hover:text-white transition-colors duration-150"
              >
                Remove
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label-mono block mb-2">PROJECT_NAME *</label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) =>
                    updateProject(project.id, { name: e.target.value })
                  }
                  placeholder="E-Commerce Platform"
                  className="w-full border border-gray-400 bg-transparent px-3 py-2 focus:border-black focus:bg-black focus:text-white transition-all duration-150"
                />
              </div>

              <div>
                <label className="label-mono block mb-2">URL</label>
                <input
                  type="url"
                  value={project.url || ""}
                  onChange={(e) =>
                    updateProject(project.id, { url: e.target.value })
                  }
                  placeholder="https://github.com/you/project"
                  className="w-full border border-gray-400 bg-transparent px-3 py-2 focus:border-black focus:bg-black focus:text-white transition-all duration-150"
                />
              </div>

              <div>
                <label className="label-mono block mb-2">DESCRIPTION *</label>
                <textarea
                  value={project.description}
                  onChange={(e) =>
                    updateProject(project.id, { description: e.target.value })
                  }
                  placeholder="A full-stack e-commerce platform built with modern technologies..."
                  rows={3}
                  className="w-full border border-gray-400 bg-transparent px-3 py-2 focus:border-black focus:bg-black focus:text-white transition-all duration-150 resize-none"
                />
              </div>

              <div>
                <label className="label-mono block mb-2">TECHNOLOGIES</label>
                <div className="border border-gray-400 bg-transparent focus-within:border-black transition-all duration-150">
                  <div className="flex flex-wrap gap-2 p-2">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 border border-black bg-black text-white px-2 py-1 text-sm"
                      >
                        {tech}
                        <button
                          onClick={() => removeTechnology(project.id, idx)}
                          className="ml-1 hover:text-red-400 transition-colors"
                          type="button"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={techInputValues[project.id] || ""}
                      onChange={(e) =>
                        setTechInputValues((prev) => ({
                          ...prev,
                          [project.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => handleTechInputKeyDown(e, project.id)}
                      placeholder="Type and press Enter or comma"
                      className="flex-1 min-w-[200px] bg-transparent px-1 py-1 outline-none"
                    />
                  </div>
                </div>
                <span className="label-mono text-gray-500 text-xs block mt-2">
                  Press ENTER or comma to add • Backspace to remove
                </span>
              </div>

              <div>
                <label className="label-mono block mb-2">KEY_FEATURES</label>
                <div className="space-y-2 mb-3">
                  {project.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={highlight}
                        onChange={(e) =>
                          updateHighlight(project.id, idx, e.target.value)
                        }
                        placeholder="Built scalable microservices architecture..."
                        className="flex-1 border border-gray-400 bg-transparent px-3 py-2 focus:border-black focus:bg-black focus:text-white transition-all duration-150"
                      />
                      <button
                        onClick={() => removeHighlight(project.id, idx)}
                        className="border border-gray-400 px-3 py-2 text-xs font-bold hover:border-red-600 hover:text-red-600 transition-colors duration-150"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addHighlight(project.id)}
                  className="border border-gray-400 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:border-black hover:bg-black hover:text-white transition-all duration-150"
                >
                  + Add Feature
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addProject}
          className="w-full border-2 border-dashed border-gray-400 px-6 py-4 text-sm font-bold uppercase tracking-wider hover:border-black hover:bg-black hover:text-white transition-all duration-150"
        >
          + Add Project
        </button>
      </div>
    </div>
  );
}
