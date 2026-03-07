import type { ResumeData } from "@/db/schema";
import { ensureHref } from "@/lib/url-helpers";
import { type PdfLabels, getPdfLabels, getDateLocale } from "@/lib/pdf-labels";

interface TemplateProps {
  data: ResumeData;
  labels?: PdfLabels;
  dateLocale?: string;
}

export function ExecutiveTemplate({ data, labels, dateLocale }: TemplateProps) {
  const l = labels ?? getPdfLabels("en");
  const dl = dateLocale ?? getDateLocale("en");
  const { personalInfo, experience, education, skills, projects, certifications, languages } = data;

  const formatDate = (dateStr: string, current: boolean) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "-01");
    const formatted = date.toLocaleDateString(dl, {
      month: "short",
      year: "numeric",
    });
    return current ? `${formatted} - ${l.present}` : formatted;
  };

  const formatDateRange = (start: string, end: string, current: boolean) => {
    const startFormatted = formatDate(start, false);
    const endFormatted = current ? l.present : formatDate(end, false);
    return `${startFormatted} – ${endFormatted}`;
  };

  return (
    <div className="p-12 bg-white text-black">
      {/* Header */}
      <header className="mb-10 pb-6 border-b-2 border-black">
        <h1 className="text-5xl font-black tracking-tight mb-3 leading-none">
          {personalInfo.fullName || l.yourName}
        </h1>

        {/* Contact info in a row */}
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && (
            <a href={ensureHref(personalInfo.website)} target="_blank" rel="noopener noreferrer" className="hover:underline">{l.portfolio}</a>
          )}
          {personalInfo.linkedin && (
            <a href={ensureHref(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
          )}
          {personalInfo.github && (
            <a href={ensureHref(personalInfo.github)} target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
          )}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-8">
          <h2 className="text-sm font-black uppercase tracking-widest mb-3 border-b border-black pb-1">
            {l.professionalSummary}
          </h2>
          <p className="text-sm leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-black uppercase tracking-widest mb-4 border-b border-black pb-1">
            {l.professionalExperience}
          </h2>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <div>
                    <h3 className="text-lg font-bold leading-tight">{exp.position}</h3>
                    <div className="text-base font-medium">{exp.company}</div>
                  </div>
                  <div className="text-xs font-mono text-right">
                    {formatDateRange(exp.startDate, exp.endDate || "", exp.current)}
                  </div>
                </div>
                {exp.location && (
                  <div className="text-xs text-gray-600 mb-2">{exp.location}</div>
                )}
                {exp.description && (
                  <p className="text-sm leading-relaxed mb-2">{exp.description}</p>
                )}
                {exp.highlights.length > 0 && (
                  <ul className="space-y-1.5 text-sm">
                    {exp.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex">
                        <span className="mr-3 font-bold">•</span>
                        <span className="flex-1">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-black uppercase tracking-widest mb-4 border-b border-black pb-1">
            {l.education}
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-base font-bold leading-tight">
                      {edu.degree} in {edu.field}
                    </h3>
                    <div className="text-sm">{edu.institution}</div>
                    {edu.location && (
                      <div className="text-xs text-gray-600">{edu.location}</div>
                    )}
                  </div>
                  <div className="text-xs font-mono text-right">
                    {formatDateRange(edu.startDate, edu.endDate || "", edu.current)}
                    {edu.gpa && <div className="mt-1">{l.gpa}: {edu.gpa}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-black uppercase tracking-widest mb-4 border-b border-black pb-1">
            {l.technicalSkills}
          </h2>
          <div className="space-y-2">
            {skills.map((category) => (
              <div key={category.id} className="flex text-sm gap-2">
                <span className="font-bold min-w-[120px] shrink-0">{category.category}:</span>
                <span>{category.items.join(", ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section>
          <h2 className="text-sm font-black uppercase tracking-widest mb-4 border-b border-black pb-1">
            {l.notableProjects}
          </h2>
          <div className="space-y-5">
            {projects.map((project) => (
              <div key={project.id}>
                <h3 className="text-base font-bold leading-tight mb-1">
                  {project.name}
                </h3>
                {(project.url || project.githubUrl || project.websiteUrl) && (
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                    {project.url && (
                      <a href={ensureHref(project.url)} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-black">{l.project}</a>
                    )}
                    {project.url && (project.githubUrl || project.websiteUrl) && <span className="text-gray-400">|</span>}
                    {project.githubUrl && (
                      <a href={ensureHref(project.githubUrl)} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-black">GitHub</a>
                    )}
                    {project.githubUrl && project.websiteUrl && <span className="text-gray-400">|</span>}
                    {project.websiteUrl && (
                      <a href={ensureHref(project.websiteUrl)} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-black">{l.website}</a>
                    )}
                  </div>
                )}
                {project.description && (
                  <p className="text-sm leading-relaxed mb-2">{project.description}</p>
                )}
                {project.technologies.length > 0 && (
                  <div className="text-xs font-mono text-gray-600 mb-2">
                    {l.technologies}: {project.technologies.join(", ")}
                  </div>
                )}
                {project.highlights.length > 0 && (
                  <ul className="space-y-1 text-sm">
                    {project.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex">
                        <span className="mr-3 font-bold">•</span>
                        <span className="flex-1">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-black uppercase tracking-widest mb-4 border-b border-black pb-1">
            {l.certifications}
          </h2>
          <div className="space-y-4">
            {certifications.map((cert) => (
              <div key={cert.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-base font-bold leading-tight">{cert.name}</h3>
                    {cert.issuer && <div className="text-sm">{cert.issuer}</div>}
                  </div>
                  {cert.date && (
                    <div className="text-xs font-mono text-right">
                      {formatDate(cert.date, false)}
                    </div>
                  )}
                </div>
                {cert.url && (
                  <a href={ensureHref(cert.url)} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-600 hover:underline hover:text-black">
                    {l.viewCertificate}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section>
          <h2 className="text-sm font-black uppercase tracking-widest mb-4 border-b border-black pb-1">
            {l.languages}
          </h2>
          <div className="space-y-2">
            {languages.map((lang) => (
              <div key={lang.id} className="flex text-sm gap-2">
                <span className="font-bold min-w-30 shrink-0">{lang.language}:</span>
                <span className="capitalize">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
