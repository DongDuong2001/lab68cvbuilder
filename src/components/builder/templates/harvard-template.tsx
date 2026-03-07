import type { ResumeData } from "@/db/schema";
import { ensureHref } from "@/lib/url-helpers";
import { type PdfLabels, getPdfLabels, getDateLocale } from "@/lib/pdf-labels";

interface TemplateProps {
  data: ResumeData;
  labels?: PdfLabels;
  dateLocale?: string;
}

export function HarvardTemplate({ data, labels, dateLocale }: TemplateProps) {
  const l = labels ?? getPdfLabels("en");
  const dl = dateLocale ?? getDateLocale("en");
  const { personalInfo, experience, education, skills, projects, certifications, languages } = data;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "-01");
    return date.toLocaleDateString(dl, { month: "long", year: "numeric" });
  };

  const formatDateRange = (start: string, end: string, current: boolean) => {
    return `${formatDate(start)} – ${current ? l.present : formatDate(end)}`;
  };

  return (
    <div className="p-12 bg-white text-gray-800">
      {/* Header - centered, airy */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-black mb-3">
          {personalInfo.fullName || l.yourName}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm text-gray-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.email && personalInfo.phone && <span className="text-gray-300">|</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.phone && personalInfo.location && <span className="text-gray-300">|</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-gray-400 mt-1">
          {personalInfo.website && <a href={ensureHref(personalInfo.website)} target="_blank" rel="noopener noreferrer" className="hover:underline">{l.portfolio}</a>}
          {personalInfo.linkedin && <a href={ensureHref(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>}
          {personalInfo.github && <a href={ensureHref(personalInfo.github)} target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>}
        </div>
        <div className="w-20 h-px bg-gray-200 mx-auto mt-6" />
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-10 max-w-2xl mx-auto text-center">
          <p className="text-sm leading-relaxed text-gray-600">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400 mb-6">
            {l.experience}
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
            {l.education}
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
                  {edu.gpa && <div className="text-xs text-gray-400 mt-1">{l.gpa}: {edu.gpa}</div>}
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
            {l.skills}
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
            {l.projects}
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
                  {(project.url || project.githubUrl || project.websiteUrl) && (
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-1">
                      {project.url && (
                        <a href={ensureHref(project.url)} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-black">{l.project}</a>
                      )}
                      {project.url && (project.githubUrl || project.websiteUrl) && <span>|</span>}
                      {project.githubUrl && (
                        <a href={ensureHref(project.githubUrl)} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-black">GitHub</a>
                      )}
                      {project.githubUrl && project.websiteUrl && <span>|</span>}
                      {project.websiteUrl && (
                        <a href={ensureHref(project.websiteUrl)} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-black">{l.website}</a>
                      )}
                    </div>
                  )}
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

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400 mb-6">
            {l.certifications}
          </h2>
          <div className="space-y-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="grid grid-cols-[160px_1fr] gap-6">
                <div className="text-right">
                  {cert.date && (
                    <div className="text-xs text-gray-400">{formatDate(cert.date)}</div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-black">{cert.name}</h3>
                  {cert.issuer && <div className="text-sm text-gray-500">{cert.issuer}</div>}
                  {cert.url && (
                    <a href={ensureHref(cert.url)} target="_blank" rel="noopener noreferrer" className="text-[10px] text-gray-400 hover:underline hover:text-black">
                      {l.viewCertificate}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400 mb-6">
            {l.languages}
          </h2>
          <div className="space-y-3">
            {languages.map((lang) => (
              <div key={lang.id} className="grid grid-cols-[160px_1fr] gap-6">
                <div className="text-right text-xs text-gray-400 font-medium">{lang.language}</div>
                <div className="text-xs text-gray-600 capitalize">{lang.proficiency}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
