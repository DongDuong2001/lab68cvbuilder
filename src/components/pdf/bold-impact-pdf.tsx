import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Link,
} from "@react-pdf/renderer";
import type { ResumeData } from "@/db/schema";
import { ensureHref } from "@/lib/url-helpers";

Font.register({
  family: "Archivo",
  fonts: [
    { src: "https://fonts.gstatic.com/s/archivo/v19/k3kQo8UDI-1M0wlSV9XAw6lQkqWY8Q82sJaRE-NWIDdgffTTNDJp8B1oJ0vyVQ.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/archivo/v19/k3kQo8UDI-1M0wlSV9XAw6lQkqWY8Q82sJaRE-NWIDdgffTTNXts8B1oJ0vyVQ.ttf", fontWeight: 700 },
    { src: "https://fonts.gstatic.com/s/archivo/v19/k3kQo8UDI-1M0wlSV9XAw6lQkqWY8Q82sJaRE-NWIDdgffTTNUds8B1oJ0vyVQ.ttf", fontWeight: 900 },
  ],
});

const s = StyleSheet.create({
  page: { backgroundColor: "#FFFFFF", fontFamily: "Archivo", fontSize: 9 },
  headerBg: { backgroundColor: "#000000", paddingHorizontal: 36, paddingTop: 36, paddingBottom: 28 },
  name: { fontSize: 30, fontWeight: 900, letterSpacing: -1, color: "#FFFFFF", marginBottom: 6 },
  summaryText: { fontSize: 9, color: "#CCCCCC", lineHeight: 1.5, maxWidth: 380, marginTop: 8 },
  accentBar: { height: 5, backgroundColor: "#333333" },
  contactStrip: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 36, paddingVertical: 8, backgroundColor: "#F5F5F5", borderBottomWidth: 0.5, borderBottomColor: "#DDDDDD" },
  contactItem: { fontSize: 8, color: "#666666", marginRight: 16 },
  content: { padding: 36 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10, flexDirection: "row", alignItems: "center" },
  sectionLine: { width: 24, height: 1.5, backgroundColor: "#000000", marginRight: 8 },
  sectionLabel: { fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 2 },
  expItem: { marginBottom: 14, paddingLeft: 14, borderLeftWidth: 1.5, borderLeftColor: "#EEEEEE" },
  expRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  expPosition: { fontSize: 11, fontWeight: 700 },
  expDate: { fontSize: 8, color: "#999999" },
  expCompany: { fontSize: 9, color: "#666666", marginBottom: 4 },
  expDesc: { fontSize: 8, lineHeight: 1.5, color: "#555555", marginBottom: 4 },
  bulletItem: { flexDirection: "row", marginBottom: 2 },
  bulletMark: { width: 10, fontSize: 9, color: "#000000", fontWeight: 700 },
  bulletText: { flex: 1, fontSize: 8, lineHeight: 1.5, color: "#555555" },
  twoCols: { flexDirection: "row", gap: 24 },
  halfCol: { flex: 1 },
  skillCat: { marginBottom: 8 },
  skillCatName: { fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 },
  skillTag: { fontSize: 8, color: "#666666", lineHeight: 1.4 },
  eduDegree: { fontSize: 10, fontWeight: 700, marginBottom: 2 },
  eduDetail: { fontSize: 8, color: "#666666", marginBottom: 1 },
  projBox: { marginBottom: 10, padding: 10, borderWidth: 0.5, borderColor: "#EEEEEE" },
  projName: { fontSize: 10, fontWeight: 700, marginBottom: 2 },
  projTech: { fontSize: 7, color: "#AAAAAA", marginBottom: 4 },
  projDesc: { fontSize: 8, lineHeight: 1.4, color: "#555555" },
});

interface PDFTemplateProps { data: ResumeData; fontFamily?: string }

export function BoldImpactPDF({ data, fontFamily }: PDFTemplateProps) {
  const { personalInfo, experience, education, skills, projects } = data;

  const fmtDate = (d: string) => {
    if (!d) return "";
    return new Date(d + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };
  const fmtRange = (st: string, en: string, c: boolean) => `${fmtDate(st)} – ${c ? "Present" : fmtDate(en)}`;

  return (
    <Document>
      <Page size="A4" style={{ ...s.page, fontFamily: fontFamily || "Archivo" }}>
        {/* Dark Header */}
        <View style={s.headerBg}>
          <Text style={s.name}>{personalInfo.fullName || "YOUR NAME"}</Text>
          {personalInfo.summary && <Text style={s.summaryText}>{personalInfo.summary}</Text>}
        </View>
        <View style={s.accentBar} />

        {/* Contact strip */}
        <View style={s.contactStrip}>
          {personalInfo.email && <Text style={s.contactItem}>{personalInfo.email}</Text>}
          {personalInfo.phone && <Text style={s.contactItem}>{personalInfo.phone}</Text>}
          {personalInfo.location && <Text style={s.contactItem}>{personalInfo.location}</Text>}
          {personalInfo.website && <Link src={ensureHref(personalInfo.website)} style={{ ...s.contactItem, color: "#666666", textDecoration: "none" }}>Portfolio</Link>}
          {personalInfo.linkedin && <Link src={ensureHref(personalInfo.linkedin)} style={{ ...s.contactItem, color: "#666666", textDecoration: "none" }}>LinkedIn</Link>}
          {personalInfo.github && <Link src={ensureHref(personalInfo.github)} style={{ ...s.contactItem, color: "#666666", textDecoration: "none" }}>GitHub</Link>}
        </View>

        {/* Content */}
        <View style={s.content}>
          {/* Experience */}
          {experience.length > 0 && (
            <View style={s.section}>
              <View style={s.sectionTitle}>
                <View style={s.sectionLine} />
                <Text style={s.sectionLabel}>Experience</Text>
              </View>
              {experience.map((exp) => (
                <View key={exp.id} style={s.expItem}>
                  <View style={s.expRow}>
                    <Text style={s.expPosition}>{exp.position}</Text>
                    <Text style={s.expDate}>{fmtRange(exp.startDate, exp.endDate || "", exp.current)}</Text>
                  </View>
                  <Text style={s.expCompany}>{exp.company}{exp.location ? ` — ${exp.location}` : ""}</Text>
                  {exp.description ? <Text style={s.expDesc}>{exp.description}</Text> : null}
                  {exp.highlights.map((h, i) => (
                    <View key={i} style={s.bulletItem}>
                      <Text style={s.bulletMark}>›</Text>
                      <Text style={s.bulletText}>{h}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Skills + Education side by side */}
          <View style={s.twoCols}>
            {skills.length > 0 && (
              <View style={s.halfCol}>
                <View style={{ ...s.sectionTitle, marginBottom: 10 }}>
                  <View style={s.sectionLine} />
                  <Text style={s.sectionLabel}>Skills</Text>
                </View>
                {skills.map((cat) => (
                  <View key={cat.id} style={s.skillCat}>
                    <Text style={s.skillCatName}>{cat.category}</Text>
                    <Text style={s.skillTag}>{cat.items.join(" · ")}</Text>
                  </View>
                ))}
              </View>
            )}

            {education.length > 0 && (
              <View style={s.halfCol}>
                <View style={{ ...s.sectionTitle, marginBottom: 10 }}>
                  <View style={s.sectionLine} />
                  <Text style={s.sectionLabel}>Education</Text>
                </View>
                {education.map((edu) => (
                  <View key={edu.id} style={{ marginBottom: 10 }}>
                    <Text style={s.eduDegree}>{edu.degree} in {edu.field}</Text>
                    <Text style={s.eduDetail}>{edu.institution}</Text>
                    <Text style={s.eduDetail}>{fmtRange(edu.startDate, edu.endDate || "", edu.current)}</Text>
                    {edu.gpa ? <Text style={s.eduDetail}>GPA: {edu.gpa}</Text> : null}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Projects */}
          {projects.length > 0 && (
            <View style={{ ...s.section, marginTop: 16 }}>
              <View style={s.sectionTitle}>
                <View style={s.sectionLine} />
                <Text style={s.sectionLabel}>Projects</Text>
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {projects.map((p) => (
                  <View key={p.id} style={{ ...s.projBox, width: "48%" }}>
                    <Text style={s.projName}>{p.name}</Text>
                    {p.technologies.length > 0 && <Text style={s.projTech}>{p.technologies.join(" · ")}</Text>}
                    {p.description ? <Text style={s.projDesc}>{p.description}</Text> : null}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
