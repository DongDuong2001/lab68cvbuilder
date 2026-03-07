/**
 * Localized section headings and common labels for PDF / preview templates.
 * Each template picks the labels it needs (e.g., Executive uses `professionalExperience`
 * while ATS uses `experience`).
 */

export interface PdfLabels {
  // Section headings — basic
  experience: string;
  education: string;
  skills: string;
  projects: string;
  certifications: string;
  languages: string;
  summary: string;
  contact: string;
  links: string;
  profile: string;
  // Section headings — expanded (executive template)
  professionalSummary: string;
  professionalExperience: string;
  technicalSkills: string;
  notableProjects: string;
  // Creative sidebar label
  technical: string;
  // Misc
  present: string;
  gpa: string;
  portfolio: string;
  viewCertificate: string;
  technologies: string;
  yourName: string;
  project: string;
  website: string;
}

export const PDF_LOCALES = [
  { code: "en", label: "English" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "zh", label: "中文" },
] as const;

export type PdfLocaleCode = (typeof PDF_LOCALES)[number]["code"];

const LABELS: Record<PdfLocaleCode, PdfLabels> = {
  en: {
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    certifications: "Certifications",
    languages: "Languages",
    summary: "Summary",
    contact: "Contact",
    links: "Links",
    profile: "Profile",
    professionalSummary: "Professional Summary",
    professionalExperience: "Professional Experience",
    technicalSkills: "Technical Skills",
    notableProjects: "Notable Projects",
    technical: "Technical",
    present: "Present",
    gpa: "GPA",
    portfolio: "Portfolio",
    viewCertificate: "View Certificate",
    technologies: "Technologies",
    yourName: "YOUR NAME",
    project: "Project",
    website: "Website",
  },
  vi: {
    experience: "Kinh nghiệm",
    education: "Học vấn",
    skills: "Kỹ năng",
    projects: "Dự án",
    certifications: "Chứng chỉ",
    languages: "Ngôn ngữ",
    summary: "Tóm tắt",
    contact: "Liên hệ",
    links: "Liên kết",
    profile: "Hồ sơ",
    professionalSummary: "Tóm tắt chuyên môn",
    professionalExperience: "Kinh nghiệm chuyên môn",
    technicalSkills: "Kỹ năng kỹ thuật",
    notableProjects: "Dự án nổi bật",
    technical: "Kỹ thuật",
    present: "Hiện tại",
    gpa: "GPA",
    portfolio: "Portfolio",
    viewCertificate: "Xem chứng chỉ",
    technologies: "Công nghệ",
    yourName: "HỌ VÀ TÊN",
    project: "Dự án",
    website: "Website",
  },
  fr: {
    experience: "Expérience",
    education: "Formation",
    skills: "Compétences",
    projects: "Projets",
    certifications: "Certifications",
    languages: "Langues",
    summary: "Résumé",
    contact: "Contact",
    links: "Liens",
    profile: "Profil",
    professionalSummary: "Résumé professionnel",
    professionalExperience: "Expérience professionnelle",
    technicalSkills: "Compétences techniques",
    notableProjects: "Projets notables",
    technical: "Technique",
    present: "Présent",
    gpa: "Moyenne",
    portfolio: "Portfolio",
    viewCertificate: "Voir le certificat",
    technologies: "Technologies",
    yourName: "VOTRE NOM",
    project: "Projet",
    website: "Site web",
  },
  de: {
    experience: "Erfahrung",
    education: "Bildung",
    skills: "Fähigkeiten",
    projects: "Projekte",
    certifications: "Zertifizierungen",
    languages: "Sprachen",
    summary: "Zusammenfassung",
    contact: "Kontakt",
    links: "Links",
    profile: "Profil",
    professionalSummary: "Berufliches Profil",
    professionalExperience: "Berufserfahrung",
    technicalSkills: "Technische Fähigkeiten",
    notableProjects: "Ausgewählte Projekte",
    technical: "Technik",
    present: "Heute",
    gpa: "Notenschnitt",
    portfolio: "Portfolio",
    viewCertificate: "Zertifikat ansehen",
    technologies: "Technologien",
    yourName: "IHR NAME",
    project: "Projekt",
    website: "Webseite",
  },
  es: {
    experience: "Experiencia",
    education: "Educación",
    skills: "Habilidades",
    projects: "Proyectos",
    certifications: "Certificaciones",
    languages: "Idiomas",
    summary: "Resumen",
    contact: "Contacto",
    links: "Enlaces",
    profile: "Perfil",
    professionalSummary: "Resumen profesional",
    professionalExperience: "Experiencia profesional",
    technicalSkills: "Habilidades técnicas",
    notableProjects: "Proyectos destacados",
    technical: "Técnico",
    present: "Presente",
    gpa: "Promedio",
    portfolio: "Portafolio",
    viewCertificate: "Ver certificado",
    technologies: "Tecnologías",
    yourName: "TU NOMBRE",
    project: "Proyecto",
    website: "Sitio web",
  },
  pt: {
    experience: "Experiência",
    education: "Educação",
    skills: "Habilidades",
    projects: "Projetos",
    certifications: "Certificações",
    languages: "Idiomas",
    summary: "Resumo",
    contact: "Contato",
    links: "Links",
    profile: "Perfil",
    professionalSummary: "Resumo profissional",
    professionalExperience: "Experiência profissional",
    technicalSkills: "Habilidades técnicas",
    notableProjects: "Projetos notáveis",
    technical: "Técnico",
    present: "Presente",
    gpa: "Média",
    portfolio: "Portfólio",
    viewCertificate: "Ver certificado",
    technologies: "Tecnologias",
    yourName: "SEU NOME",
    project: "Projeto",
    website: "Website",
  },
  ja: {
    experience: "職歴",
    education: "学歴",
    skills: "スキル",
    projects: "プロジェクト",
    certifications: "資格",
    languages: "言語",
    summary: "概要",
    contact: "連絡先",
    links: "リンク",
    profile: "プロフィール",
    professionalSummary: "職務概要",
    professionalExperience: "職務経歴",
    technicalSkills: "技術スキル",
    notableProjects: "主なプロジェクト",
    technical: "技術",
    present: "現在",
    gpa: "GPA",
    portfolio: "ポートフォリオ",
    viewCertificate: "証明書を見る",
    technologies: "技術",
    yourName: "氏名",
    project: "プロジェクト",
    website: "ウェブサイト",
  },
  ko: {
    experience: "경력",
    education: "학력",
    skills: "기술",
    projects: "프로젝트",
    certifications: "자격증",
    languages: "언어",
    summary: "요약",
    contact: "연락처",
    links: "링크",
    profile: "프로필",
    professionalSummary: "직무 요약",
    professionalExperience: "경력 사항",
    technicalSkills: "기술 역량",
    notableProjects: "주요 프로젝트",
    technical: "기술",
    present: "현재",
    gpa: "학점",
    portfolio: "포트폴리오",
    viewCertificate: "자격증 보기",
    technologies: "기술 스택",
    yourName: "이름",
    project: "프로젝트",
    website: "웹사이트",
  },
  zh: {
    experience: "工作经历",
    education: "教育背景",
    skills: "技能",
    projects: "项目",
    certifications: "证书",
    languages: "语言",
    summary: "摘要",
    contact: "联系方式",
    links: "链接",
    profile: "简介",
    professionalSummary: "职业简介",
    professionalExperience: "工作经验",
    technicalSkills: "专业技能",
    notableProjects: "重点项目",
    technical: "技术",
    present: "至今",
    gpa: "GPA",
    portfolio: "作品集",
    viewCertificate: "查看证书",
    technologies: "技术栈",
    yourName: "姓名",
    project: "项目",
    website: "网站",
  },
};

/** Get the date locale string for toLocaleDateString */
const DATE_LOCALES: Record<PdfLocaleCode, string> = {
  en: "en-US",
  vi: "vi-VN",
  fr: "fr-FR",
  de: "de-DE",
  es: "es-ES",
  pt: "pt-BR",
  ja: "ja-JP",
  ko: "ko-KR",
  zh: "zh-CN",
};

export function getPdfLabels(locale: string): PdfLabels {
  return LABELS[locale as PdfLocaleCode] ?? LABELS.en;
}

export function getDateLocale(locale: string): string {
  return DATE_LOCALES[locale as PdfLocaleCode] ?? "en-US";
}
