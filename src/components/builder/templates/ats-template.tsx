import type { ResumeData } from "@/db/schema";
import { ensureHref } from "@/lib/url-helpers";

interface TemplateProps {
  data: ResumeData;
}

export function CompactProTemplate({ data }: TemplateProps) {
  const { personalInfo, experience, education, skills, projects } = data;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "-01");
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const formatDateRange = (start: string, end: string, current: boolean) => {
    return `${formatDate(start)} - ${current ? "Present" : formatDate(end)}`;
  };

  return (
    <div className="p-8 bg-white text-black leading-tight">
      {/* Header - compact single line */}
      <header className="mb-4">
        <h1 className="text-2xl font-bold mb-1">
          {personalInfo.fullName || "YOUR NAME"}
        </h1>
        <div className="flex flex-wrap gap-x-2 text-[11px] text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.email && personalInfo.phone && <span>·</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.phone && personalInfo.location && <span>·</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.location && personalInfo.website && <span>·</span>}
          {personalInfo.website && <a href={ensureHref(personalInfo.website)} target="_blank" rel="noopener noreferrer" className="hover:underline">Portfolio</a>}
          {(personalInfo.website || personalInfo.location) && personalInfo.linkedin && <span>·</span>}
          {personalInfo.linkedin && <a href={ensureHref(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>}
          {personalInfo.linkedin && personalInfo.github && <span>·</span>}
          {personalInfo.github && <a href={ensureHref(personalInfo.github)} target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>}
        </div>
      </header>

      <hr className="border-gray-300 mb-3" />

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase mb-1">Summary</h2>
          <p className="text-[11px] leading-snug text-gray-700">{personalInfo.summary}</p>
        </section>
      )}

      {/* Skills - inline to save space */}
      {skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase mb-1">Technical Skills</h2>
          <div className="space-y-0.5">
            {skills.map((cat) => (
              <div key={cat.id} className="text-[11px]">
                <span className="font-bold">{cat.category}: </span>
                <span className="text-gray-700">{cat.items.join(", ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience - dense */}
      {experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase mb-2">Professional Experience</h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-[12px] font-bold">{exp.position}</span>
                    <span className="text-[11px] text-gray-600"> | {exp.company}</span>
                    {exp.location && <span className="text-[11px] text-gray-400"> | {exp.location}</span>}
                  </div>
                  <span className="text-[10px] text-gray-500 shrink-0 ml-2">
                    {formatDateRange(exp.startDate, exp.endDate || "", exp.current)}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-[11px] text-gray-700 mt-0.5">{exp.description}</p>
                )}
                {exp.highlights.length > 0 && (
                  <ul className="mt-0.5 space-y-0">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-gray-700 flex gap-1.5">
                        <span>•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education - inline */}
      {education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase mb-2">Education</h2>
          <div className="space-y-1.5">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <span className="text-[12px] font-bold">{edu.degree} in {edu.field}</span>
                  <span className="text-[11px] text-gray-600"> — {edu.institution}</span>
                  {edu.gpa && <span className="text-[11px] text-gray-400"> (GPA: {edu.gpa})</span>}
                </div>
                <span className="text-[10px] text-gray-500 shrink-0 ml-2">
                  {formatDateRange(edu.startDate, edu.endDate || "", edu.current)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects - compact */}
      {projects.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase mb-2">Projects</h2>
          <div className="space-y-2">
            {projects.map((project) => (
              <div key={project.id}>
                <div className="flex items-baseline gap-2">
                  <span className="text-[12px] font-bold">{project.name}</span>
                  {project.technologies.length > 0 && (
                    <span className="text-[10px] text-gray-400">[{project.technologies.join(", ")}]</span>
                  )}
                </div>
                {project.description && (
                  <p className="text-[11px] text-gray-700">{project.description}</p>
                )}
                {project.highlights.length > 0 && (
                  <ul className="space-y-0">
                    {project.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-gray-700 flex gap-1.5">
                        <span>•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
