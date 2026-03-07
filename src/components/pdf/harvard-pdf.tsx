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



const s = StyleSheet.create({
  page: { backgroundColor: "#FFFFFF", fontFamily: "Helvetica", padding: 40, fontSize: 9 },
  header: { alignItems: "center", marginBottom: 24 },
  name: { fontSize: 26, fontWeight: 700, letterSpacing: -0.5, marginBottom: 8, color: "#000000" },
  contactRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", fontSize: 8, color: "#999999" },
  contactItem: { marginHorizontal: 6, marginBottom: 3 },
  separator: { width: 1, height: 8, backgroundColor: "#DDDDDD", marginHorizontal: 4 },
  divider: { width: 50, height: 0.5, backgroundColor: "#DDDDDD", marginTop: 12 },
  summary: { fontSize: 9, lineHeight: 1.5, color: "#666666", textAlign: "center", marginBottom: 20, maxWidth: 400 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: 3, color: "#AAAAAA", marginBottom: 12 },
  row: { flexDirection: "row", marginBottom: 14 },
  dateCol: { width: 120, textAlign: "right", paddingRight: 16 },
  dateText: { fontSize: 8, color: "#AAAAAA", lineHeight: 1.4 },
  contentCol: { flex: 1 },
  position: { fontSize: 10, fontWeight: 700, color: "#000000", marginBottom: 2 },
  company: { fontSize: 9, color: "#888888", marginBottom: 4 },
  desc: { fontSize: 8, lineHeight: 1.5, color: "#555555", marginBottom: 4 },
  bulletItem: { flexDirection: "row", marginBottom: 2 },
  bulletMark: { width: 10, fontSize: 8, color: "#CCCCCC" },
  bulletText: { flex: 1, fontSize: 8, lineHeight: 1.5, color: "#555555" },
  skillLabel: { fontSize: 8, color: "#AAAAAA", textAlign: "right", paddingRight: 16, width: 120 },
  skillValue: { fontSize: 8, color: "#555555", flex: 1 },
  eduDegree: { fontSize: 10, fontWeight: 700, color: "#000000" },
  eduDetail: { fontSize: 8, color: "#888888" },
  projName: { fontSize: 10, fontWeight: 700, color: "#000000", marginBottom: 2 },
  projTech: { fontSize: 7, color: "#BBBBBB", marginBottom: 3 },
});

interface PDFTemplateProps { data: ResumeData; fontFamily?: string; labels?: PdfLabels; dateLocale?: string }

export function HarvardPDF({ data, fontFamily, labels, dateLocale }: PDFTemplateProps) {
  const { personalInfo, experience, education, skills, projects, certifications, languages } = data;
  const l = labels ?? getPdfLabels("en");
  const dl = dateLocale ?? getDateLocale("en");

  const fmtDate = (d: string) => {
    if (!d) return "";
    return new Date(d + "-01").toLocaleDateString(dl, { month: "long", year: "numeric" });
  };
  const fmtRange = (st: string, en: string, c: boolean) => `${fmtDate(st)} – ${c ? l.present : fmtDate(en)}`;

  return (
    <Document>
      <Page size="A4" style={{ ...s.page, fontFamily: fontFamily || "Helvetica" }}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.name}>{personalInfo.fullName || l.yourName}</Text>
          <View style={s.contactRow}>
            {personalInfo.email && <Text style={s.contactItem}>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text style={s.contactItem}>{personalInfo.phone}</Text>}
            {personalInfo.location && <Text style={s.contactItem}>{personalInfo.location}</Text>}
          </View>
          <View style={s.contactRow}>
            {personalInfo.website && <Link src={ensureHref(personalInfo.website)} style={{ ...s.contactItem, color: "#999999", textDecoration: "none" }}>{l.portfolio}</Link>}
            {personalInfo.linkedin && <Link src={ensureHref(personalInfo.linkedin)} style={{ ...s.contactItem, color: "#999999", textDecoration: "none" }}>LinkedIn</Link>}
            {personalInfo.github && <Link src={ensureHref(personalInfo.github)} style={{ ...s.contactItem, color: "#999999", textDecoration: "none" }}>GitHub</Link>}
          </View>
          <View style={s.divider} />
        </View>

        {personalInfo.summary && (
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Text style={s.summary}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>{l.experience}</Text>
            {experience.map((exp) => (
              <View key={exp.id} style={s.row}>
                <View style={s.dateCol}>
                  <Text style={s.dateText}>{fmtRange(exp.startDate, exp.endDate || "", exp.current)}</Text>
                  {exp.location ? <Text style={{ ...s.dateText, marginTop: 2 }}>{exp.location}</Text> : null}
                </View>
                <View style={s.contentCol}>
                  <Text style={s.position}>{exp.position}</Text>
                  <Text style={s.company}>{exp.company}</Text>
                  {exp.description ? <Text style={s.desc}>{exp.description}</Text> : null}
                  {exp.highlights.map((h, i) => (
                    <View key={i} style={s.bulletItem}>
                      <Text style={s.bulletMark}>–</Text>
                      <Text style={s.bulletText}>{h}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>{l.education}</Text>
            {education.map((edu) => (
              <View key={edu.id} style={s.row}>
                <View style={s.dateCol}>
                  <Text style={s.dateText}>{fmtRange(edu.startDate, edu.endDate || "", edu.current)}</Text>
                </View>
                <View style={s.contentCol}>
                  <Text style={s.eduDegree}>{edu.degree} in {edu.field}</Text>
                  <Text style={s.eduDetail}>{edu.institution}</Text>
                  {edu.gpa ? <Text style={s.eduDetail}>{l.gpa}: {edu.gpa}</Text> : null}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>{l.skills}</Text>
            {skills.map((cat) => (
              <View key={cat.id} style={{ flexDirection: "row", marginBottom: 6 }}>
                <Text style={s.skillLabel}>{cat.category}</Text>
                <Text style={s.skillValue}>{cat.items.join(" · ")}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>{l.projects}</Text>
            {projects.map((p) => (
              <View key={p.id} style={s.row}>
                <View style={s.dateCol}>
                  {p.technologies.length > 0 && <Text style={s.dateText}>{p.technologies.join(", ")}</Text>}
                </View>
                <View style={s.contentCol}>
                  <Text style={s.projName}>{p.name}</Text>
                  {(p.url || p.githubUrl || p.websiteUrl) && (
                    <View style={{ flexDirection: "row", gap: 4, marginBottom: 2 }}>
                      {p.url && <Link src={p.url} style={{ fontSize: 7, color: "#999999" }}>{l.project}</Link>}
                      {p.url && (p.githubUrl || p.websiteUrl) && <Text style={{ fontSize: 7, color: "#cccccc" }}>|</Text>}
                      {p.githubUrl && <Link src={p.githubUrl} style={{ fontSize: 7, color: "#999999" }}>GitHub</Link>}
                      {p.githubUrl && p.websiteUrl && <Text style={{ fontSize: 7, color: "#cccccc" }}>|</Text>}
                      {p.websiteUrl && <Link src={p.websiteUrl} style={{ fontSize: 7, color: "#999999" }}>{l.website}</Link>}
                    </View>
                  )}
                  {p.description ? <Text style={s.desc}>{p.description}</Text> : null}
                  {p.highlights.map((h, i) => (
                    <View key={i} style={s.bulletItem}>
                      <Text style={s.bulletMark}>–</Text>
                      <Text style={s.bulletText}>{h}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>{l.certifications}</Text>
            {certifications.map((cert) => (
              <View key={cert.id} style={s.row}>
                <View style={s.dateCol}>
                  {cert.date ? <Text style={s.dateText}>{fmtDate(cert.date)}</Text> : null}
                </View>
                <View style={s.contentCol}>
                  <Text style={s.position}>{cert.name}</Text>
                  {cert.issuer ? <Text style={s.company}>{cert.issuer}</Text> : null}
                  {cert.url ? <Link src={ensureHref(cert.url)} style={{ fontSize: 7, color: "#999999", textDecoration: "none" }}>{l.viewCertificate}</Link> : null}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>{l.languages}</Text>
            {languages.map((lang) => (
              <View key={lang.id} style={{ flexDirection: "row", marginBottom: 6 }}>
                <Text style={s.skillLabel}>{lang.language}</Text>
                <Text style={s.skillValue}>{lang.proficiency.charAt(0).toUpperCase() + lang.proficiency.slice(1)}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
