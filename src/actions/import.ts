"use server";

import { auth } from "@/auth";

type GitHubUser = {
  login: string;
  name: string | null;
  email: string | null;
  location: string | null;
  blog: string | null;
  html_url: string;
  bio: string | null;
};

type GitHubRepo = {
  name: string;
  html_url: string;
  homepage: string | null;
  description: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  fork: boolean;
};

type ImportSource = "github" | "linkedin" | "behance";
export type ImportConfidence = "confirmed" | "inferred";
export type ImportPersonalFieldKey =
  | "fullName"
  | "email"
  | "location"
  | "website"
  | "linkedin"
  | "github"
  | "summary";

export type ImportedProjectDraft = {
  name: string;
  description: string;
  url: string;
  githubUrl: string;
  websiteUrl: string;
  technologies: string[];
  highlights: string[];
};

export type ImportedSkillCategoryDraft = {
  category: string;
  items: string[];
};

export type ImportedExperienceDraft = {
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  highlights: string[];
};

export type ImportedCertificationDraft = {
  name: string;
  issuer: string;
  date: string;
  url?: string;
};

export type SocialImportResult = {
  source: ImportSource;
  username: string;
  personalInfo: {
    fullName?: string;
    email?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github: string;
    summary?: string;
  };
  projects: ImportedProjectDraft[];
  skills: ImportedSkillCategoryDraft[];
  experience: ImportedExperienceDraft[];
  certifications: ImportedCertificationDraft[];
  confidence: {
    personal: Partial<Record<ImportPersonalFieldKey, ImportConfidence>>;
    skills: ImportConfidence;
    projects: ImportConfidence;
    experience: ImportConfidence;
    certifications: ImportConfidence;
  };
};

async function getAuthUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

function parseGitHubUsername(input: string): string {
  const raw = input.trim();
  if (!raw) {
    throw new Error("GitHub username or profile URL is required");
  }

  const cleaned = raw.replace(/^@/, "");

  if (!cleaned.includes("/")) {
    if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37})$/.test(cleaned)) {
      throw new Error("Invalid GitHub username format");
    }
    return cleaned;
  }

  let parsed: URL;
  try {
    parsed = new URL(cleaned.startsWith("http") ? cleaned : `https://${cleaned}`);
  } catch {
    throw new Error("Invalid GitHub URL");
  }

  if (!parsed.hostname.toLowerCase().includes("github.com")) {
    throw new Error("Please provide a valid github.com profile URL");
  }

  const [username] = parsed.pathname.split("/").filter(Boolean);
  if (!username || !/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37})$/.test(username)) {
    throw new Error("Could not extract a valid GitHub username from URL");
  }

  return username;
}

function parseLinkedInHandle(input: string): string {
  const raw = input.trim();
  if (!raw) {
    throw new Error("LinkedIn username or profile URL is required");
  }

  const cleaned = raw.replace(/^@/, "");
  if (!cleaned.includes("/")) {
    if (!/^[a-zA-Z0-9-._]{3,100}$/.test(cleaned)) {
      throw new Error("Invalid LinkedIn handle format");
    }
    return cleaned;
  }

  let parsed: URL;
  try {
    parsed = new URL(cleaned.startsWith("http") ? cleaned : `https://${cleaned}`);
  } catch {
    throw new Error("Invalid LinkedIn URL");
  }

  if (!parsed.hostname.toLowerCase().includes("linkedin.com")) {
    throw new Error("Please provide a valid linkedin.com URL");
  }

  const [section, handle] = parsed.pathname.split("/").filter(Boolean);
  if (!section || !handle || section.toLowerCase() !== "in") {
    throw new Error("LinkedIn URL must look like linkedin.com/in/your-handle");
  }

  return handle;
}

function parseBehanceHandle(input: string): string {
  const raw = input.trim();
  if (!raw) {
    throw new Error("Behance username or profile URL is required");
  }

  const cleaned = raw.replace(/^@/, "");
  if (!cleaned.includes("/")) {
    if (!/^[a-zA-Z0-9-._]{2,100}$/.test(cleaned)) {
      throw new Error("Invalid Behance handle format");
    }
    return cleaned;
  }

  let parsed: URL;
  try {
    parsed = new URL(cleaned.startsWith("http") ? cleaned : `https://${cleaned}`);
  } catch {
    throw new Error("Invalid Behance URL");
  }

  if (!parsed.hostname.toLowerCase().includes("behance.net")) {
    throw new Error("Please provide a valid behance.net URL");
  }

  const [handle] = parsed.pathname.split("/").filter(Boolean);
  if (!handle) {
    throw new Error("Could not extract a Behance handle from URL");
  }

  return handle;
}

async function fetchGitHub<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "lab68cvbuilder-importer",
    },
    cache: "no-store",
  });

  if (res.status === 404) {
    throw new Error("GitHub user not found");
  }

  if (!res.ok) {
    throw new Error("GitHub API request failed. Please try again.");
  }

  return (await res.json()) as T;
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "lab68cvbuilder-importer",
      Accept: "text/html,application/xhtml+xml",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Unable to fetch public profile page");
  }

  return res.text();
}

function extractMetaContent(html: string, propertyOrName: string): string | undefined {
  const escaped = propertyOrName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`,
    "i"
  );
  const match = html.match(regex);
  return match?.[1]?.trim();
}

function humanizeHandle(handle: string): string {
  return handle
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function uniqueStrings(values: Array<string | null | undefined>): string[] {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const value of values) {
    const normalized = (value ?? "").trim();
    if (!normalized) continue;

    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    output.push(normalized);
  }

  return output;
}

export async function importFromGitHub(githubInput: string): Promise<SocialImportResult> {
  await getAuthUserId();

  const username = parseGitHubUsername(githubInput);

  const [user, repos] = await Promise.all([
    fetchGitHub<GitHubUser>(`/users/${username}`),
    fetchGitHub<GitHubRepo[]>(`/users/${username}/repos?sort=updated&per_page=12`),
  ]);

  const topRepos = repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 4);

  const projects: ImportedProjectDraft[] = topRepos.map((repo) => {
    const technologies = uniqueStrings([repo.language, ...(repo.topics ?? [])]).slice(0, 8);

    return {
      name: repo.name,
      description: repo.description?.trim() || "Open-source project from GitHub profile",
      url: repo.homepage?.trim() || repo.html_url,
      githubUrl: repo.html_url,
      websiteUrl: repo.homepage?.trim() || "",
      technologies,
      highlights: [
        repo.stargazers_count > 0
          ? `Earned ${repo.stargazers_count} GitHub stars`
          : "Published and maintained on GitHub",
      ],
    };
  });

  const languagePool = repos.map((repo) => repo.language);
  const topicPool = repos.flatMap((repo) => repo.topics ?? []);

  const skills: ImportedSkillCategoryDraft[] = [];

  const coreLanguages = uniqueStrings(languagePool).slice(0, 10);
  if (coreLanguages.length > 0) {
    skills.push({
      category: "Programming Languages",
      items: coreLanguages,
    });
  }

  const coreTopics = uniqueStrings(topicPool).slice(0, 12);
  if (coreTopics.length > 0) {
    skills.push({
      category: "Technologies",
      items: coreTopics,
    });
  }

  return {
    source: "github",
    username,
    personalInfo: {
      fullName: user.name || undefined,
      email: user.email || undefined,
      location: user.location || undefined,
      website: user.blog || undefined,
      linkedin: undefined,
      github: user.html_url,
      summary: user.bio || undefined,
    },
    projects,
    skills,
    experience: [],
    certifications: [],
    confidence: {
      personal: {
        fullName: user.name ? "confirmed" : "inferred",
        email: user.email ? "confirmed" : "inferred",
        location: user.location ? "confirmed" : "inferred",
        website: user.blog ? "confirmed" : "inferred",
        github: "confirmed",
        summary: user.bio ? "confirmed" : "inferred",
      },
      skills: "inferred",
      projects: "confirmed",
      experience: "inferred",
      certifications: "inferred",
    },
  };
}

export async function importFromLinkedIn(linkedinInput: string): Promise<SocialImportResult> {
  await getAuthUserId();

  const handle = parseLinkedInHandle(linkedinInput);
  const profileUrl = `https://www.linkedin.com/in/${handle}`;

  let fullName = humanizeHandle(handle);
  let summary: string | undefined;

  try {
    const html = await fetchHtml(profileUrl);
    const ogTitle = extractMetaContent(html, "og:title");
    const ogDescription = extractMetaContent(html, "og:description");

    if (ogTitle) {
      fullName = ogTitle.split("|")[0].trim() || fullName;
    }
    if (ogDescription) {
      summary = ogDescription;
    }
  } catch {
    // Public LinkedIn pages are often restricted; keep inferred fallback values.
  }

  return {
    source: "linkedin",
    username: handle,
    personalInfo: {
      fullName,
      email: undefined,
      location: undefined,
      website: undefined,
      linkedin: profileUrl,
      github: "",
      summary,
    },
    projects: [],
    skills: [],
    experience: [],
    certifications: [],
    confidence: {
      personal: {
        fullName: "inferred",
        linkedin: "confirmed",
        summary: summary ? "inferred" : undefined,
      },
      skills: "inferred",
      projects: "inferred",
      experience: "inferred",
      certifications: "inferred",
    },
  };
}

export async function importFromBehance(behanceInput: string): Promise<SocialImportResult> {
  await getAuthUserId();

  const handle = parseBehanceHandle(behanceInput);
  const profileUrl = `https://www.behance.net/${handle}`;

  let fullName = humanizeHandle(handle);
  let summary: string | undefined;
  const projects: ImportedProjectDraft[] = [];

  try {
    const html = await fetchHtml(profileUrl);
    const ogTitle = extractMetaContent(html, "og:title");
    const ogDescription = extractMetaContent(html, "og:description");

    if (ogTitle) {
      fullName = ogTitle.split("on Behance")[0].trim() || fullName;
    }
    if (ogDescription) {
      summary = ogDescription;
    }

    const galleryMatches = [...html.matchAll(/\/gallery\/(\d+)\/([A-Za-z0-9_%.-]+)/g)]
      .map((m) => ({
        id: m[1],
        slug: decodeURIComponent(m[2].replace(/-/g, " ")),
      }))
      .filter((item, index, arr) => arr.findIndex((a) => a.id === item.id) === index)
      .slice(0, 4);

    for (const item of galleryMatches) {
      projects.push({
        name: item.slug,
        description: "Creative portfolio project imported from Behance",
        url: `https://www.behance.net/gallery/${item.id}/${item.slug.replace(/\s+/g, "-")}`,
        githubUrl: "",
        websiteUrl: `https://www.behance.net/gallery/${item.id}/${item.slug.replace(/\s+/g, "-")}`,
        technologies: ["Design"],
        highlights: ["Published portfolio project on Behance"],
      });
    }
  } catch {
    // Keep minimal import if profile parsing is unavailable.
  }

  return {
    source: "behance",
    username: handle,
    personalInfo: {
      fullName,
      email: undefined,
      location: undefined,
      website: profileUrl,
      linkedin: undefined,
      github: "",
      summary,
    },
    projects,
    skills: [],
    experience: [],
    certifications: [],
    confidence: {
      personal: {
        fullName: "inferred",
        website: "confirmed",
        summary: summary ? "inferred" : "inferred",
      },
      skills: "inferred",
      projects: projects.length > 0 ? "inferred" : "inferred",
      experience: "inferred",
      certifications: "inferred",
    },
  };
}
