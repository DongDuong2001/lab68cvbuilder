import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  Image,
} from "@react-pdf/renderer";
import type { ResumeData } from "@/db/schema";
import { ensureHref } from "@/lib/url-helpers";
import { type PdfLabels, getPdfLabels, getDateLocale } from "@/lib/pdf-labels";



const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
  },
  sidebar: {
    width: "30%",
    backgroundColor: "#000000",
    color: "#FFFFFF",
    padding: 30,
  },
  mainContent: {
    width: "70%",
    padding: 30,
  },
  name: {
    fontSize: 20,
    fontWeight: 900,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFF",
    width: 40,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 8,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 8,
    opacity: 0.6,
  },
  contactText: {
    fontSize: 9,
    marginBottom: 6,
    lineHeight: 1.4,
  },
  skillCategory: {
    marginBottom: 10,
  },
  skillCategoryName: {
    fontSize: 9,
    fontWeight: 700,
    marginBottom: 3,
  },
  skillItems: {
    fontSize: 8,
    lineHeight: 1.5,
    opacity: 0.9,
  },
  educationItem: {
    marginBottom: 12,
  },
  educationDegree: {
    fontSize: 9,
    fontWeight: 700,
    marginBottom: 2,
  },
  educationDetails: {
    fontSize: 8,
    opacity: 0.7,
    marginBottom: 2,
  },
  mainSectionTitle: {
    fontSize: 8,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 4,
    marginBottom: 12,
  },
  experienceItem: {
    marginBottom: 20,
  },
  expHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  expPosition: {
    fontSize: 12,
    fontWeight: 700,
  },
  expCompany: {
    fontSize: 10,
    marginBottom: 2,
  },
  expDate: {
    fontSize: 8,
    opacity: 0.6,
  },
  expLocation: {
    fontSize: 8,
    opacity: 0.6,
    marginBottom: 6,
  },
  expDescription: {
    fontSize: 9,
    lineHeight: 1.5,
    marginBottom: 6,
  },
  bulletList: {
    marginLeft: 10,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bullet: {
    width: 10,
    fontSize: 9,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.5,
  },
});

interface PDFTemplateProps {
  data: ResumeData;
  fontFamily?: string;
  labels?: PdfLabels;
  dateLocale?: string;
}

export function CreativePDF({ data, fontFamily, labels, dateLocale }: PDFTemplateProps) {
  const { personalInfo, experience, education, skills, projects, certifications, languages } = data;
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
        {/* Sidebar */}
        <View style={styles.sidebar}>
          {/* Avatar */}
          {personalInfo.avatarUrl && (
            <View style={{ alignItems: "center", marginBottom: 15 }}>
              {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt prop */}
              <Image
                src={personalInfo.avatarUrl}
                style={{ width: 80, height: 80, borderRadius: 40, objectFit: "cover" }}
              />
            </View>
          )}

          <View>
            <Text style={styles.name}>{personalInfo.fullName || l.yourName}</Text>
            <View style={styles.divider} />
          </View>

          {/* Contact */}
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.sectionTitle}>{l.contact.toUpperCase()}</Text>
            {personalInfo.email && <Text style={styles.contactText}>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text style={styles.contactText}>{personalInfo.phone}</Text>}
            {personalInfo.location && <Text style={styles.contactText}>{personalInfo.location}</Text>}
          </View>

          {/* Links */}
          {(personalInfo.website || personalInfo.linkedin || personalInfo.github) && (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.sectionTitle}>{l.links.toUpperCase()}</Text>
              {personalInfo.website && (
                <Link src={ensureHref(personalInfo.website)} style={{ ...styles.contactText, color: "#FFFFFF", textDecoration: "none" }}>
                  WEB// {l.portfolio}
                </Link>
              )}
              {personalInfo.linkedin && (
                <Link src={ensureHref(personalInfo.linkedin)} style={{ ...styles.contactText, color: "#FFFFFF", textDecoration: "none" }}>
                  IN// LinkedIn
                </Link>
              )}
              {personalInfo.github && (
                <Link src={ensureHref(personalInfo.github)} style={{ ...styles.contactText, color: "#FFFFFF", textDecoration: "none" }}>
                  GH// GitHub
                </Link>
              )}
            </View>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.sectionTitle}>{l.technical.toUpperCase()}</Text>
              {skills.map((category) => (
                <View key={category.id} style={styles.skillCategory}>
                  <Text style={styles.skillCategoryName}>{category.category}</Text>
                  <Text style={styles.skillItems}>{category.items.join(" • ")}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {education.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>{l.education.toUpperCase()}</Text>
              {education.map((edu) => (
                <View key={edu.id} style={styles.educationItem}>
                  <Text style={styles.educationDegree}>{edu.degree}</Text>
                  <Text style={styles.educationDetails}>{edu.field}</Text>
                  <Text style={styles.educationDetails}>{edu.institution}</Text>
                  <Text style={styles.educationDetails}>
                    {formatDateRange(edu.startDate, edu.endDate || "", edu.current)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={styles.sectionTitle}>{l.languages.toUpperCase()}</Text>
              {languages.map((lang) => (
                <View key={lang.id} style={{ marginBottom: 6 }}>
                  <Text style={styles.skillCategoryName}>{lang.language}</Text>
                  <Text style={{ fontSize: 8, opacity: 0.7 }}>{lang.proficiency.charAt(0).toUpperCase() + lang.proficiency.slice(1)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Summary */}
          {personalInfo.summary && (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.mainSectionTitle}>{l.profile.toUpperCase()}</Text>
              <Text style={styles.expDescription}>{personalInfo.summary}</Text>
            </View>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.mainSectionTitle}>{l.experience.toUpperCase()}</Text>
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
                          <Text style={styles.bullet}>▪</Text>
                          <Text style={styles.bulletText}>{highlight}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <View>
              <Text style={styles.mainSectionTitle}>{l.projects.toUpperCase()}</Text>
              {projects.map((project) => (
                <View key={project.id} style={styles.experienceItem}>
                  <Text style={styles.expPosition}>{project.name}</Text>
                  {(project.url || project.githubUrl || project.websiteUrl) && (
                    <View style={{ flexDirection: "row", gap: 4, marginBottom: 3 }}>
                      {project.url && <Link src={project.url} style={{ fontSize: 8, color: "#666666" }}>{l.project}</Link>}
                      {project.url && (project.githubUrl || project.websiteUrl) && <Text style={{ fontSize: 8, color: "#999999" }}>|</Text>}
                      {project.githubUrl && <Link src={project.githubUrl} style={{ fontSize: 8, color: "#666666" }}>GitHub</Link>}
                      {project.githubUrl && project.websiteUrl && <Text style={{ fontSize: 8, color: "#999999" }}>|</Text>}
                      {project.websiteUrl && <Link src={project.websiteUrl} style={{ fontSize: 8, color: "#666666" }}>{l.website}</Link>}
                    </View>
                  )}
                  {project.description && (
                    <Text style={styles.expDescription}>{project.description}</Text>
                  )}
                  {project.technologies.length > 0 && (
                    <Text style={{ ...styles.expDate, marginBottom: 6 }}>
                      {project.technologies.join(" • ")}
                    </Text>
                  )}
                  {project.highlights.length > 0 && (
                    <View style={styles.bulletList}>
                      {project.highlights.map((highlight, idx) => (
                        <View key={idx} style={styles.bulletItem}>
                          <Text style={styles.bullet}>▪</Text>
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
            <View style={{ marginTop: 20 }}>
              <Text style={styles.mainSectionTitle}>{l.certifications.toUpperCase()}</Text>
              {certifications.map((cert) => (
                <View key={cert.id} style={{ marginBottom: 12 }}>
                  <View style={styles.expHeader}>
                    <Text style={{ fontSize: 10, fontWeight: 700 }}>{cert.name}</Text>
                    {cert.date ? <Text style={styles.expDate}>{formatDate(cert.date, false)}</Text> : null}
                  </View>
                  {cert.issuer ? <Text style={styles.expCompany}>{cert.issuer}</Text> : null}
                  {cert.url ? <Link src={ensureHref(cert.url)} style={{ fontSize: 8, color: "#666666", textDecoration: "none" }}>{l.viewCertificate}</Link> : null}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
