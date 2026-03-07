import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import type { ResumeData } from "@/db/schema";
import { ensureHref } from "@/lib/url-helpers";
import { type PdfLabels, getPdfLabels, getDateLocale } from "@/lib/pdf-labels";



const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    padding: 40,
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 3,
    borderBottomColor: "#000000",
    paddingBottom: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 900,
    marginBottom: 12,
    letterSpacing: -1,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 9,
  },
  contactItem: {
    marginRight: 15,
    marginBottom: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 6,
    marginBottom: 12,
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.6,
  },
  experienceItem: {
    marginBottom: 18,
  },
  expHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  expPosition: {
    fontSize: 12,
    fontWeight: 700,
  },
  expCompany: {
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 3,
  },
  expDate: {
    fontSize: 9,
    opacity: 0.7,
  },
  expLocation: {
    fontSize: 9,
    opacity: 0.7,
    marginBottom: 6,
  },
  expDescription: {
    fontSize: 9,
    lineHeight: 1.5,
    marginBottom: 6,
  },
  bulletList: {
    marginLeft: 12,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bullet: {
    width: 12,
    fontSize: 9,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.5,
  },
  educationItem: {
    marginBottom: 14,
  },
  educationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  educationDegree: {
    fontSize: 11,
    fontWeight: 700,
  },
  educationDetails: {
    fontSize: 9,
    marginBottom: 2,
  },
  skillGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillCategory: {
    width: "50%",
    marginBottom: 10,
    paddingRight: 10,
  },
  skillCategoryName: {
    fontSize: 9,
    fontWeight: 700,
    marginBottom: 3,
  },
  skillItems: {
    fontSize: 9,
    lineHeight: 1.4,
  },
  projectItem: {
    marginBottom: 16,
  },
  projectName: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 3,
  },
  projectTech: {
    fontSize: 8,
    opacity: 0.6,
    marginBottom: 6,
  },
  projectDescription: {
    fontSize: 9,
    lineHeight: 1.5,
    marginBottom: 6,
  },
});

interface PDFTemplateProps {
  data: ResumeData;
  fontFamily?: string;
  labels?: PdfLabels;
  dateLocale?: string;
}

export function ExecutivePDF({ data, fontFamily, labels, dateLocale }: PDFTemplateProps) {
  const { personalInfo, experience, education, skills, projects, certifications, languages } = data;
  const completeEducation = education.filter(
    (edu) => edu.institution.trim() && edu.degree.trim() && edu.field.trim() && edu.startDate.trim()
  );
  const l = labels ?? getPdfLabels("en");
  const dl = dateLocale ?? getDateLocale("en");

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
    return `${formatDate(start, false)} - ${current ? l.present : formatDate(end, false)}`;
  };

  return (
    <Document>
      <Page size="A4" style={{ ...styles.page, fontFamily: fontFamily || "Helvetica" }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName || l.yourName}</Text>
          <View style={styles.contactRow}>
            {personalInfo.email && (
              <Text style={styles.contactItem}>{personalInfo.email}</Text>
            )}
            {personalInfo.phone && (
              <Text style={styles.contactItem}>{personalInfo.phone}</Text>
            )}
            {personalInfo.location && (
              <Text style={styles.contactItem}>{personalInfo.location}</Text>
            )}
            {personalInfo.website && (
              <Link src={ensureHref(personalInfo.website)} style={{ ...styles.contactItem, color: "#000000", textDecoration: "none" }}>
                {l.portfolio}
              </Link>
            )}
            {personalInfo.linkedin && (
              <Link src={ensureHref(personalInfo.linkedin)} style={{ ...styles.contactItem, color: "#000000", textDecoration: "none" }}>
                LinkedIn
              </Link>
            )}
            {personalInfo.github && (
              <Link src={ensureHref(personalInfo.github)} style={{ ...styles.contactItem, color: "#000000", textDecoration: "none" }}>
                GitHub
              </Link>
            )}
          </View>
        </View>

        {/* Summary */}
        {personalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{l.professionalSummary}</Text>
            <Text style={styles.summary}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{l.professionalExperience}</Text>
            {experience.map((exp) => (
              <View key={exp.id} style={styles.experienceItem}>
                <View style={styles.expHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.expPosition}>{exp.position}</Text>
                    <Text style={styles.expCompany}>{exp.company}</Text>
                  </View>
                  <Text style={styles.expDate}>
                    {formatDateRange(exp.startDate, exp.endDate || "", exp.current)}
                  </Text>
                </View>
                {exp.location && <Text style={styles.expLocation}>{exp.location}</Text>}
                {exp.description && (
                  <Text style={styles.expDescription}>{exp.description}</Text>
                )}
                {exp.highlights.length > 0 && (
                  <View style={styles.bulletList}>
                    {exp.highlights.map((highlight, idx) => (
                      <View key={idx} style={styles.bulletItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>{highlight}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {completeEducation.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{l.education}</Text>
            {completeEducation.map((edu) => (
              <View key={edu.id} style={styles.educationItem}>
                <View style={styles.educationHeader}>
                  <Text style={styles.educationDegree}>
                    {edu.degree} in {edu.field}
                  </Text>
                  <Text style={styles.expDate}>
                    {formatDateRange(edu.startDate, edu.endDate || "", edu.current)}
                  </Text>
                </View>
                <Text style={styles.educationDetails}>{edu.institution}</Text>
                {edu.location && (
                  <Text style={styles.educationDetails}>{edu.location}</Text>
                )}
                {edu.gpa && (
                  <Text style={styles.educationDetails}>{l.gpa}: {edu.gpa}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{l.technicalSkills}</Text>
            <View style={styles.skillGrid}>
              {skills.map((category) => (
                <View key={category.id} style={styles.skillCategory}>
                  <Text style={styles.skillCategoryName}>{category.category}:</Text>
                  <Text style={styles.skillItems}>{category.items.join(", ")}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{l.projects}</Text>
            {projects.map((project) => (
              <View key={project.id} style={styles.projectItem}>
                <Text style={styles.projectName}>{project.name}</Text>
                {(project.url || project.githubUrl || project.websiteUrl) && (
                  <View style={{ flexDirection: "row", gap: 4, marginBottom: 3 }}>
                    {project.url && <Link src={project.url} style={{ fontSize: 8, color: "#666666" }}>{l.project}</Link>}
                    {project.url && (project.githubUrl || project.websiteUrl) && <Text style={{ fontSize: 8, color: "#999999" }}>|</Text>}
                    {project.githubUrl && <Link src={project.githubUrl} style={{ fontSize: 8, color: "#666666" }}>GitHub</Link>}
                    {project.githubUrl && project.websiteUrl && <Text style={{ fontSize: 8, color: "#999999" }}>|</Text>}
                    {project.websiteUrl && <Link src={project.websiteUrl} style={{ fontSize: 8, color: "#666666" }}>{l.website}</Link>}
                  </View>
                )}
                {project.technologies.length > 0 && (
                  <Text style={styles.projectTech}>
                    {project.technologies.join(" • ")}
                  </Text>
                )}
                {project.description && (
                  <Text style={styles.projectDescription}>{project.description}</Text>
                )}
                {project.highlights.length > 0 && (
                  <View style={styles.bulletList}>
                    {project.highlights.map((highlight, idx) => (
                      <View key={idx} style={styles.bulletItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>{highlight}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{l.certifications}</Text>
            {certifications.map((cert) => (
              <View key={cert.id} style={styles.educationItem}>
                <View style={styles.educationHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.educationDegree}>{cert.name}</Text>
                    {cert.issuer ? <Text style={styles.educationDetails}>{cert.issuer}</Text> : null}
                    {cert.url ? <Link src={ensureHref(cert.url)} style={{ fontSize: 8, color: "#666666", textDecoration: "none" }}>{l.viewCertificate}</Link> : null}
                  </View>
                  {cert.date ? <Text style={styles.expDate}>{formatDate(cert.date, false)}</Text> : null}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{l.languages}</Text>
            <View style={styles.skillGrid}>
              {languages.map((lang) => (
                <View key={lang.id} style={styles.skillCategory}>
                  <Text style={styles.skillCategoryName}>{lang.language}</Text>
                  <Text style={styles.skillItems}>{lang.proficiency.charAt(0).toUpperCase() + lang.proficiency.slice(1)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
