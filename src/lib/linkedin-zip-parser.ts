/**
 * Client-side parser for LinkedIn Data Export ZIP files.
 *
 * Users can download their LinkedIn data at:
 *   LinkedIn → Settings → Data Privacy → Get a copy of your data
 *
 * The ZIP contains CSV files: Profile.csv, Positions.csv,
 * Certifications.csv, Skills.csv, Projects.csv, Education.csv, etc.
 *
 * No API key or external service required — the user exports their own data.
 */

import JSZip from "jszip";
import type { SocialImportResult } from "@/actions/import";

// ── CSV Helpers ────────────────────────────────────────────────

/** Split a single CSV line into fields, respecting double-quoted strings. */
function splitCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      // Escaped quote inside a quoted field
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

/** Parse CSV text into an array of row objects keyed by header name. */
function parseCSV(text: string): Record<string, string>[] {
  // Handle BOM and normalize line endings (CRLF → LF)
  const cleaned = text.replace(/^\uFEFF/, "").replace(/\r/g, "").trim();
  const lines = cleaned.split("\n");
  if (lines.length < 2) return [];

  const headers = splitCSVLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const values = splitCSVLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = (values[idx] ?? "").trim();
    });
    rows.push(row);
  }

  return rows;
}

// ── Date Helpers ───────────────────────────────────────────────

const MONTH_MAP: Record<string, string> = {
  jan: "01", feb: "02", mar: "03", apr: "04",
  may: "05", jun: "06", jul: "07", aug: "08",
  sep: "09", oct: "10", nov: "11", dec: "12",
};

/**
 * Convert a LinkedIn date string like "Jun 2020" or "2020" to YYYY-MM.
 * Returns empty string for "Present", empty input, or unrecognized format.
 */
function parseLinkedInDate(raw?: string): string {
  const s = (raw ?? "").trim();
  if (!s || s.toLowerCase() === "present") return "";

  const parts = s.split(/\s+/);
  if (parts.length === 2) {
    const monthKey = parts[0].toLowerCase().slice(0, 3);
    const month = MONTH_MAP[monthKey];
    const year = parts[1];
    if (month && /^\d{4}$/.test(year)) return `${year}-${month}`;
  }
  // Year-only fallback
  if (/^\d{4}$/.test(s)) return `${s}-01`;
  return "";
}

// ── ZIP Entry Lookup ───────────────────────────────────────────

/**
 * Find and read a CSV file from a JSZip instance by any of the provided
 * candidate names (case-insensitive match against the zip entry name).
 */
async function readZipCSV(
  zip: JSZip,
  candidateNames: string[]
): Promise<Record<string, string>[]> {
  for (const name of candidateNames) {
    const lower = name.toLowerCase();
    const entry = Object.values(zip.files).find(
      (f) => !f.dir && f.name.toLowerCase().endsWith(lower)
    );
    if (entry) {
      const text = await entry.async("text");
      return parseCSV(text);
    }
  }
  return [];
}

// ── Main Export ────────────────────────────────────────────────

/**
 * Parse a LinkedIn Data Export ZIP file and return a `SocialImportResult`
 * that can be passed directly to the import preview modal.
 *
 * Throws if the file cannot be opened as a valid ZIP.
 */
export async function parseLinkedInZip(file: File): Promise<SocialImportResult> {
  const zip = await JSZip.loadAsync(file);

  // Read all relevant CSV files in parallel
  const [profileRows, positionRows, certRows, skillRows, projectRows] =
    await Promise.all([
      readZipCSV(zip, ["Profile.csv"]),
      readZipCSV(zip, ["Positions.csv"]),
      readZipCSV(zip, ["Certifications.csv"]),
      readZipCSV(zip, ["Skills.csv"]),
      readZipCSV(zip, ["Projects.csv", "Accomplishments.csv"]),
    ]);

  // ── Personal info ──────────────────────────────────────────
  const profile = profileRows[0] ?? {};
  const firstName = profile["First Name"] ?? "";
  const lastName = profile["Last Name"] ?? "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim() || undefined;
  const headline = profile["Headline"] ?? "";
  const summary = (profile["Summary"] || headline).trim() || undefined;
  const location = (profile["Geo Location"] ?? "").trim() || undefined;

  // Use name-derived slug as the "username" for display purposes
  const username = fullName
    ? fullName.toLowerCase().replace(/\s+/g, "-")
    : "linkedin-export";

  // ── Work experience ────────────────────────────────────────
  const experience: SocialImportResult["experience"] = positionRows
    .filter((r) => r["Company Name"] || r["Title"])
    .slice(0, 8)
    .map((r) => {
      const startDate = parseLinkedInDate(r["Started On"]);
      const endDateRaw = (r["Finished On"] ?? "").trim();
      const endDate = parseLinkedInDate(endDateRaw);
      const current =
        !endDate ||
        endDateRaw.toLowerCase() === "present" ||
        endDateRaw === "";

      return {
        company: r["Company Name"] || "Company",
        position: r["Title"] || "Role",
        location: r["Location"] || "",
        startDate,
        endDate: current ? "" : endDate,
        current,
        description: r["Description"] || "",
        highlights: [],
      };
    });

  // ── Certifications ─────────────────────────────────────────
  const certifications: SocialImportResult["certifications"] = certRows
    .filter((r) => r["Name"])
    .slice(0, 8)
    .map((r) => ({
      name: r["Name"],
      issuer: r["Authority"] || "LinkedIn",
      date:
        parseLinkedInDate(r["Started On"]) ||
        parseLinkedInDate(r["Finished On"]) ||
        "",
      url: r["Url"] || "",
    }));

  // ── Skills ─────────────────────────────────────────────────
  const skillItems = skillRows
    .map((r) => r["Name"])
    .filter(Boolean)
    .slice(0, 20);
  const skills: SocialImportResult["skills"] =
    skillItems.length > 0
      ? [{ category: "LinkedIn Skills", items: skillItems }]
      : [];

  // ── Projects ───────────────────────────────────────────────
  const projects: SocialImportResult["projects"] = projectRows
    .filter((r) => r["Title"])
    .slice(0, 6)
    .map((r) => ({
      name: r["Title"],
      description: r["Description"] || "",
      url: r["Url"] || "",
      githubUrl: "",
      websiteUrl: r["Url"] || "",
      technologies: [],
      highlights: [],
    }));

  // ── Confidence ─────────────────────────────────────────────
  // Everything from the user's own export file is "confirmed"
  return {
    source: "linkedin",
    username,
    personalInfo: {
      fullName,
      email: undefined, // LinkedIn exports do not include email in Profile.csv
      location,
      website: undefined,
      linkedin: undefined,
      github: "",
      summary,
    },
    experience,
    certifications,
    skills,
    projects,
    confidence: {
      personal: {
        fullName: fullName ? "confirmed" : "inferred",
        location: location ? "confirmed" : "inferred",
        summary: summary ? "confirmed" : "inferred",
      },
      skills: skillItems.length > 0 ? "confirmed" : "inferred",
      projects: projects.length > 0 ? "confirmed" : "inferred",
      experience: experience.length > 0 ? "confirmed" : "inferred",
      certifications: certifications.length > 0 ? "confirmed" : "inferred",
    },
  };
}
