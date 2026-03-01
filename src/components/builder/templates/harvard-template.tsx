import type { ResumeData } from "@/db/schema";
import { ensureHref } from "@/lib/url-helpers";

interface TemplateProps {
  data: ResumeData;
}

export function CleanSlateTemplate({ data }: TemplateProps) {
  const { personalInfo, experience, education, skills, projects } = data;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "-01");
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const formatDateRange = (start: string, end: string, current: boolean) => {
    return `${formatDate(start)} – ${current ? "Present" : formatDate(end)}`;
  };

  return (
    <div className="p-12 bg-white text-gray-800">
      {/* Header - centered, airy */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-black mb-3">
          {personalInfo.fullName || "YOUR NAME"}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm text-gray-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.email && personalInfo.phone && <span className="text-gray-300">|</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.phone && personalInfo.location && <span className="text-gray-300">|</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-gray-400 mt-1">
          {personalInfo.website && <a href={ensureHref(personalInfo.website)} target="_blank" rel="noopener noreferrer" className="hover:underline">Portfolio</a>}
          {personalInfo.linkedin && <a href={ensureHref(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>}
          {personalInfo.github && <a href={ensureHref(personalInfo.github)} target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>}
        </div>
        <div className="w-20 h-px bg-gray-200 mx-auto mt-6" />
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-10 max-w-2xl mx-auto text-center">
          <p className="text-sm leading-relaxed text-gray-600 italic">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400 mb-6">
            Experience
          </h2>
          <div className="space-y-8">
            {experience.map((exp) => (
              <div key={exp.id} className="grid grid-cols-[160px_1fr] gap-6">
                <div className="text-right">
                  <div className="text-xs text-gray-400 leading-relaxed">
                    {formatDateRange(exp.startDate, exp.endDate || "", exp.current)}
                  </div>
                  {exp.location && (
                    <div className="text-xs text-gray-300 mt-1">{exp.location}</div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-black leading-tight">{exp.position}</h3>
                  <div className="text-sm text-gray-500 mb-2">{exp.company}</div>
                  {exp.description && (
                    <p className="text-xs leading-relaxed text-gray-600 mb-2">{exp.description}</p>
                  )}
                  {exp.highlights.length > 0 && (
                    <ul className="space-y-1">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="text-xs text-gray-600 pl-4 relative before:content-['–'] before:absolute before:left-0 before:text-gray-300">
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400 mb-6">
            Education
          </h2>
          <div className="space-y-6">
            {education.map((edu) => (
              <div key={edu.id} className="grid grid-cols-[160px_1fr] gap-6">
                <div className="text-right">
                  <div className="text-xs text-gray-400">
                    {formatDateRange(edu.startDate, edu.endDate || "", edu.current)}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-black">{edu.degree} in {edu.field}</h3>
                  <div className="text-sm text-gray-500">{edu.institution}</div>
                  {edu.gpa && <div className="text-xs text-gray-400 mt-1">GPA: {edu.gpa}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400 mb-6">
            Skills
          </h2>
          <div className="space-y-3">
            {skills.map((cat) => (
              <div key={cat.id} className="grid grid-cols-[160px_1fr] gap-6">
                <div className="text-right text-xs text-gray-400 font-medium">{cat.category}</div>
                <div className="text-xs text-gray-600">{cat.items.join(" · ")}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400 mb-6">
            Projects
          </h2>
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.id} className="grid grid-cols-[160px_1fr] gap-6">
                <div className="text-right">
                  {project.technologies.length > 0 && (
                    <div className="text-[10px] text-gray-400">{project.technologies.join(", ")}</div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-black">{project.name}</h3>
                  {project.description && (
                    <p className="text-xs text-gray-600 leading-relaxed mb-1">{project.description}</p>
                  )}
                  {project.highlights.length > 0 && (
                    <ul className="space-y-1">
                      {project.highlights.map((h, i) => (
                        <li key={i} className="text-xs text-gray-600 pl-4 relative before:content-['–'] before:absolute before:left-0 before:text-gray-300">
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
