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
  page: { backgroundColor: "#FFFFFF", fontFamily: "Helvetica", fontSize: 8, padding: 28 },
  /* Header — single dense row */
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 2 },
  name: { fontSize: 16, fontWeight: 900, letterSpacing: -0.5 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  contactText: { fontSize: 7, color: "#666666" },
  divider: { height: 0.5, backgroundColor: "#000000", marginVertical: 6 },
  /* Summary — compact */
  summary: { fontSize: 8, lineHeight: 1.4, color: "#555555", marginBottom: 6 },
  /* Two-column layout */
  columns: { flexDirection: "row", gap: 20 },
  mainCol: { flex: 3 },
  sideCol: { flex: 1, borderLeftWidth: 0.5, borderLeftColor: "#DDDDDD", paddingLeft: 14 },
  /* Section */
  sectionTitle: { fontSize: 8, fontWeight: 900, textTransform: "uppercase", letterSpacing: 2, marginBottom: 5, borderBottomWidth: 0.5, borderBottomColor: "#DDDDDD", paddingBottom: 3 },
  /* Experience */
  expItem: { marginBottom: 7 },
  expTopRow: { flexDirection: "row", justifyContent: "space-between" },
  expPosition: { fontSize: 9, fontWeight: 700 },
  expDate: { fontSize: 7, color: "#999999" },
  expCompany: { fontSize: 7, color: "#888888", marginBottom: 2 },
  expDesc: { fontSize: 7.5, lineHeight: 1.4, color: "#555555", marginBottom: 2 },
  bulletRow: { flexDirection: "row", marginBottom: 1 },
  bulletDot: { width: 6, fontSize: 7, color: "#000000" },
  bulletText: { flex: 1, fontSize: 7.5, lineHeight: 1.3, color: "#555555" },
  /* Projects */
  projItem: { marginBottom: 6 },
  projName: { fontSize: 8, fontWeight: 700, marginBottom: 1 },
  projTech: { fontSize: 6.5, color: "#AAAAAA", marginBottom: 2 },
  projDesc: { fontSize: 7.5, lineHeight: 1.3, color: "#555555" },
  /* Side sections */
  skillCat: { marginBottom: 5 },
  skillCatName: { fontSize: 7, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
  skillItems: { fontSize: 7, color: "#666666", lineHeight: 1.3 },
  eduItem: { marginBottom: 5 },
  eduDegree: { fontSize: 8, fontWeight: 700, marginBottom: 1 },
  eduSchool: { fontSize: 7, color: "#666666", marginBottom: 1 },
  eduDate: { fontSize: 6.5, color: "#999999" },
  sectionGap: { marginTop: 10 },
});

interface PDFTemplateProps { data: ResumeData; fontFamily?: string; labels?: PdfLabels; dateLocale?: string }

export function AtsPDF({ data, fontFamily, labels, dateLocale }: PDFTemplateProps) {
  const { personalInfo, experience, education, skills, projects, certifications, languages } = data;
  const completeEducation = education.filter(
    (edu) => edu.institution.trim() && edu.degree.trim() && edu.field.trim() && edu.startDate.trim()
  );
  const l = labels ?? getPdfLabels("en");
  const dl = dateLocale ?? getDateLocale("en");

  const fmtDate = (d: string) => {
    if (!d) return "";
    return new Date(d + "-01").toLocaleDateString(dl, { month: "short", year: "numeric" });
  };
  const fmtRange = (st: string, en: string, c: boolean) => `${fmtDate(st)} – ${c ? l.present : fmtDate(en)}`;

  return (
    <Document>
      <Page size="A4" style={{ ...s.page, fontFamily: fontFamily || "Helvetica" }}>
        {/* Header row */}
        <View style={s.headerRow}>
          <Text style={s.name}>{personalInfo.fullName || l.yourName}</Text>
          <View style={s.contactRow}>
            {personalInfo.email && <Text style={s.contactText}>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text style={s.contactText}>{personalInfo.phone}</Text>}
            {personalInfo.location && <Text style={s.contactText}>{personalInfo.location}</Text>}
            {personalInfo.website && <Link src={ensureHref(personalInfo.website)} style={{ ...s.contactText, color: "#666666", textDecoration: "none" }}>{l.portfolio}</Link>}
            {personalInfo.linkedin && <Link src={ensureHref(personalInfo.linkedin)} style={{ ...s.contactText, color: "#666666", textDecoration: "none" }}>LinkedIn</Link>}
            {personalInfo.github && <Link src={ensureHref(personalInfo.github)} style={{ ...s.contactText, color: "#666666", textDecoration: "none" }}>GitHub</Link>}
          </View>
        </View>
        <View style={s.divider} />

        {/* Summary */}
        {personalInfo.summary && <Text style={s.summary}>{personalInfo.summary}</Text>}

        {/* Two columns */}
        <View style={s.columns}>
          {/* Main column */}
          <View style={s.mainCol}>
            {/* Experience */}
            {experience.length > 0 && (
              <View>
                <Text style={s.sectionTitle}>{l.experience}</Text>
                {experience.map((exp) => (
                  <View key={exp.id} style={s.expItem}>
                    <View style={s.expTopRow}>
                      <Text style={s.expPosition}>{exp.position}</Text>
                      <Text style={s.expDate}>{fmtRange(exp.startDate, exp.endDate || "", exp.current)}</Text>
                    </View>
                    <Text style={s.expCompany}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</Text>
                    {exp.description ? <Text style={s.expDesc}>{exp.description}</Text> : null}
                    {exp.highlights.map((h, i) => (
                      <View key={i} style={s.bulletRow}>
                        <Text style={s.bulletDot}>•</Text>
                        <Text style={s.bulletText}>{h}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <View style={s.sectionGap}>
                <Text style={s.sectionTitle}>{l.projects}</Text>
                {projects.map((p) => (
                  <View key={p.id} style={s.projItem}>
                    <Text style={s.projName}>{p.name}</Text>
                    {(p.url || p.githubUrl || p.websiteUrl) && (
                      <View style={{ flexDirection: "row", gap: 4, marginBottom: 2 }}>
                        {p.url && <Link src={p.url} style={{ fontSize: 7, color: "#666666" }}>{l.project}</Link>}
                        {p.url && (p.githubUrl || p.websiteUrl) && <Text style={{ fontSize: 7, color: "#999999" }}>|</Text>}
                        {p.githubUrl && <Link src={p.githubUrl} style={{ fontSize: 7, color: "#666666" }}>GitHub</Link>}
                        {p.githubUrl && p.websiteUrl && <Text style={{ fontSize: 7, color: "#999999" }}>|</Text>}
                        {p.websiteUrl && <Link src={p.websiteUrl} style={{ fontSize: 7, color: "#666666" }}>{l.website}</Link>}
                      </View>
                    )}
                    {p.technologies.length > 0 && <Text style={s.projTech}>{p.technologies.join(" · ")}</Text>}
                    {p.description ? <Text style={s.projDesc}>{p.description}</Text> : null}
                    {p.highlights.map((h, i) => (
                      <View key={i} style={s.bulletRow}>
                        <Text style={s.bulletDot}>•</Text>
                        <Text style={s.bulletText}>{h}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <View style={s.sectionGap}>
                <Text style={s.sectionTitle}>{l.certifications}</Text>
                {certifications.map((cert) => (
                  <View key={cert.id} style={s.projItem}>
                    <View style={s.expTopRow}>
                      <Text style={s.expPosition}>{cert.name}</Text>
                      {cert.date ? <Text style={s.expDate}>{fmtDate(cert.date)}</Text> : null}
                    </View>
                    {cert.issuer ? <Text style={s.expCompany}>{cert.issuer}</Text> : null}
                    {cert.url ? <Link src={ensureHref(cert.url)} style={{ fontSize: 7, color: "#666666", textDecoration: "none" }}>{l.viewCertificate}</Link> : null}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Sidebar */}
          <View style={s.sideCol}>
            {/* Skills */}
            {skills.length > 0 && (
              <View>
                <Text style={s.sectionTitle}>{l.skills}</Text>
                {skills.map((cat) => (
                  <View key={cat.id} style={s.skillCat}>
                    <Text style={s.skillCatName}>{cat.category}</Text>
                    <Text style={s.skillItems}>{cat.items.join(", ")}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Education */}
            {completeEducation.length > 0 && (
              <View style={s.sectionGap}>
                <Text style={s.sectionTitle}>{l.education}</Text>
                {completeEducation.map((edu) => (
                  <View key={edu.id} style={s.eduItem}>
                    <Text style={s.eduDegree}>{edu.degree}</Text>
                    <Text style={s.eduSchool}>{edu.field} — {edu.institution}</Text>
                    <Text style={s.eduDate}>{fmtRange(edu.startDate, edu.endDate || "", edu.current)}</Text>
                    {edu.gpa ? <Text style={s.eduDate}>{l.gpa}: {edu.gpa}</Text> : null}
                    {(edu.coursework ?? []).length > 0 ? (
                      <Text style={s.eduDate}>Relevant Coursework: {(edu.coursework ?? []).join(", ")}</Text>
                    ) : null}
                  </View>
                ))}
              </View>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <View style={s.sectionGap}>
                <Text style={s.sectionTitle}>{l.languages}</Text>
                {languages.map((lang) => (
                  <View key={lang.id} style={s.skillCat}>
                    <Text style={s.skillCatName}>{lang.language}</Text>
                    <Text style={s.skillItems}>{lang.proficiency.charAt(0).toUpperCase() + lang.proficiency.slice(1)}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}
