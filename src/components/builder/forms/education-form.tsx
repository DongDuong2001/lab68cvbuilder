"use client";

import { useResumeStore } from "@/store/resume-store";
import type { ResumeData } from "@/db/schema";

export function EducationForm() {
  const { data, setData } = useResumeStore();
  const { education } = data;

  const addEducation = () => {
    const newEducation: ResumeData["education"][0] = {
      id: crypto.randomUUID(),
      institution: "",
      degree: "",
      field: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      gpa: "",
      highlights: [],
    };

    setData({
      ...data,
      education: [...education, newEducation],
    });
  };

  const removeEducation = (id: string) => {
    setData({
      ...data,
      education: education.filter((edu) => edu.id !== id),
    });
  };

  const updateEducation = (
    id: string,
    updates: Partial<ResumeData["education"][0]>
  ) => {
    setData({
      ...data,
      education: education.map((edu) =>
        edu.id === id ? { ...edu, ...updates } : edu
      ),
    });
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <span className="label-mono block mb-4">SECTION_03 // EDUCATION</span>
        <h2 className="text-3xl font-black tracking-tight mb-2">Education</h2>
        <p className="text-sm text-gray-600">Academic background and degrees</p>
      </div>

      <div className="space-y-8">
        {education.map((edu, index) => (
          <div key={edu.id} className="border border-black p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="label-mono">
                ENTRY_{String(index + 1).padStart(2, "0")}
              </span>
              <button
                onClick={() => removeEducation(edu.id)}
                className="border border-red-600 text-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider hover:bg-red-600 hover:text-white transition-colors duration-150"
              >
                Remove
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label-mono block mb-2">INSTITUTION *</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) =>
                    updateEducation(edu.id, { institution: e.target.value })
                  }
                  placeholder="University of California"
                  className="w-full border border-gray-400 bg-transparent px-3 py-2 focus:border-black focus:bg-black focus:text-white transition-all duration-150"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-mono block mb-2">DEGREE *</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(edu.id, { degree: e.target.value })
                    }
                    placeholder="Bachelor of Science"
                    className="w-full border border-gray-400 bg-transparent px-3 py-2 focus:border-black focus:bg-black focus:text-white transition-all duration-150"
                  />
                </div>
                <div>
                  <label className="label-mono block mb-2">FIELD *</label>
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) =>
                      updateEducation(edu.id, { field: e.target.value })
                    }
                    placeholder="Computer Science"
                    className="w-full border border-gray-400 bg-transparent px-3 py-2 focus:border-black focus:bg-black focus:text-white transition-all duration-150"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="label-mono block mb-2">LOCATION</label>
                  <input
                    type="text"
                    value={edu.location || ""}
                    onChange={(e) =>
                      updateEducation(edu.id, { location: e.target.value })
                    }
                    placeholder="Berkeley, CA"
                    className="w-full border border-gray-400 bg-transparent px-3 py-2 focus:border-black focus:bg-black focus:text-white transition-all duration-150"
                  />
                </div>
                <div>
                  <label className="label-mono block mb-2">GPA</label>
                  <input
                    type="text"
                    value={edu.gpa || ""}
                    onChange={(e) =>
                      updateEducation(edu.id, { gpa: e.target.value })
                    }
                    placeholder="3.8"
                    className="w-full border border-gray-400 bg-transparent px-3 py-2 focus:border-black focus:bg-black focus:text-white transition-all duration-150"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-mono block mb-2">START_DATE *</label>
                  <input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) =>
                      updateEducation(edu.id, { startDate: e.target.value })
                    }
                    className="w-full border border-gray-400 bg-transparent px-3 py-2 focus:border-black focus:bg-black focus:text-white transition-all duration-150"
                  />
                </div>
                <div>
                  <label className="label-mono block mb-2">END_DATE</label>
                  <input
                    type="month"
                    value={edu.endDate || ""}
                    onChange={(e) =>
                      updateEducation(edu.id, { endDate: e.target.value })
                    }
                    disabled={edu.current}
                    className="w-full border border-gray-400 bg-transparent px-3 py-2 focus:border-black focus:bg-black focus:text-white transition-all duration-150 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`current-edu-${edu.id}`}
                  checked={edu.current}
                  onChange={(e) =>
                    updateEducation(edu.id, {
                      current: e.target.checked,
                      endDate: e.target.checked ? "" : edu.endDate,
                    })
                  }
                  className="w-4 h-4"
                />
                <label
                  htmlFor={`current-edu-${edu.id}`}
                  className="text-sm font-medium"
                >
                  Currently enrolled
                </label>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addEducation}
          className="w-full border-2 border-dashed border-gray-400 px-6 py-4 text-sm font-bold uppercase tracking-wider hover:border-black hover:bg-black hover:text-white transition-all duration-150"
        >
          + Add Education
        </button>
      </div>
    </div>
  );
}
