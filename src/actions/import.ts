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

type ImportSource = "github" | "linkedin" | "behance" | "forg";
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

type ForgTarget =
  | { kind: "product"; id: string }
  | { kind: "profile"; handle: string; profileUrl: string };

type ForgProductCandidate = {
  id: string;
  occurrences: number;
  firstIndex: number;
  engagementHint: number;
  ownerHint: number;
};

export type ForgProductOption = {
  id: string;
  title: string;
  score: number;
};

const FORG_PRODUCT_ID_BLOCKLIST = new Set([
  "logo",
  "products",
  "explore",
  "search",
  "launchpad",
  "inbox",
  "updates",
  "profile",
  "home",
]);

function candidateBaseScore(candidate: ForgProductCandidate): number {
  return (
    candidate.occurrences * 1000 +
    Math.min(candidate.engagementHint, 5000) +
    candidate.ownerHint +
    Math.max(0, 100000 - candidate.firstIndex) / 1000
  );
}

function isValidForgProductId(value: string): boolean {
  return /^[a-zA-Z0-9-]{2,120}$/.test(value);
}

function extractForgProductIds(html: string): string[] {
  const ids = [...html.matchAll(/\/products\/([a-zA-Z0-9-]{2,120})/gi)]
    .map((m) => m[1]?.toLowerCase())
    .filter((id): id is string => Boolean(id) && !FORG_PRODUCT_ID_BLOCKLIST.has(id));

  return [...new Set(ids)];
}

function extractForgUpdatePaths(html: string): string[] {
  const updates = [...html.matchAll(/\/updates\/([a-zA-Z0-9]{8,120})/gi)]
    .map((m) => m[1])
    .filter((id): id is string => Boolean(id));

  return [...new Set(updates)].map((id) => `/updates/${id}`);
}

function rankForgProductCandidates(html: string, handle?: string): ForgProductCandidate[] {
  const matches = [...html.matchAll(/\/products\/([a-zA-Z0-9-]{2,120})/gi)];
  if (matches.length === 0) return [];

  const candidates = new Map<string, ForgProductCandidate>();
  const normalizedHandle = handle?.toLowerCase();

  for (const match of matches) {
    const id = match[1];
    if (!id) continue;

    const normalized = id.toLowerCase();
    if (FORG_PRODUCT_ID_BLOCKLIST.has(normalized)) continue;

    const index = match.index ?? 0;

    const windowStart = Math.max(0, index - 220);
    const windowEnd = Math.min(html.length, index + 220);
    const windowText = html.slice(windowStart, windowEnd);
    const windowTextLower = windowText.toLowerCase();

    // Approximate engagement by summing nearby short numeric counters.
    const numbers = [...windowText.matchAll(/\b(\d{1,5})\b/g)]
      .map((n) => Number(n[1]))
      .filter((n) => Number.isFinite(n) && n >= 0 && n <= 100000)
      .slice(0, 8);
    const engagementHint = numbers.reduce((sum, n) => sum + n, 0);
    const ownerHint =
      normalizedHandle && windowTextLower.includes(`@${normalizedHandle}`) ? 4000 : 0;

    const existing = candidates.get(normalized);
    if (existing) {
      existing.occurrences += 1;
      existing.firstIndex = Math.min(existing.firstIndex, index);
      existing.engagementHint += engagementHint;
      existing.ownerHint += ownerHint;
      continue;
    }

    candidates.set(normalized, {
      id,
      occurrences: 1,
      firstIndex: index,
      engagementHint,
      ownerHint,
    });
  }

  return [...candidates.values()].sort((a, b) => {
    const scoreA = candidateBaseScore(a);
    const scoreB = candidateBaseScore(b);

    if (scoreA !== scoreB) return scoreB - scoreA;
    return a.firstIndex - b.firstIndex;
  });
}

async function rerankForgProductCandidatesWithRecency(
  html: string,
  handle: string
): Promise<ForgProductCandidate[]> {
  const ranked = rankForgProductCandidates(html, handle);
  if (ranked.length === 0) return [];

  // Recency-aware fallback: inspect recent update pages and heavily boost linked products.
  const updatePaths = extractForgUpdatePaths(html).slice(0, 4);
  const updateBoostById = new Map<string, number>();
  if (updatePaths.length > 0) {
    const updatePages = await Promise.all(
      updatePaths.map(async (path, idx) => {
        try {
          const page = await fetchHtml(`https://forg.to${path}`);
          return { page, idx };
        } catch {
          return { page: "", idx };
        }
      })
    );

    for (const { page, idx } of updatePages) {
      if (!page) continue;
      const ids = extractForgProductIds(page);
      const recencyBoost = 4000 - idx * 700;
      for (const id of ids) {
        updateBoostById.set(id, (updateBoostById.get(id) ?? 0) + Math.max(1200, recencyBoost));
      }
    }
  }

  return [...ranked].sort((a, b) => {
    const scoreA = candidateBaseScore(a) + (updateBoostById.get(a.id.toLowerCase()) ?? 0);
    const scoreB = candidateBaseScore(b) + (updateBoostById.get(b.id.toLowerCase()) ?? 0);

    if (scoreA !== scoreB) return scoreB - scoreA;
    return a.firstIndex - b.firstIndex;
  });
}

async function buildForgOption(candidate: ForgProductCandidate): Promise<ForgProductOption> {
  const fallbackTitle = candidate.id
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  try {
    const productHtml = await fetchHtml(`https://forg.to/products/${candidate.id}`);
    const ogTitle = extractMetaContent(productHtml, "og:title");
    const cleanedTitle = (ogTitle ?? "").replace(/\s*\|\s*forg.*$/i, "").trim();
    return {
      id: candidate.id,
      title: cleanedTitle || fallbackTitle,
      score: Math.round(candidateBaseScore(candidate)),
    };
  } catch {
    return {
      id: candidate.id,
      title: fallbackTitle,
      score: Math.round(candidateBaseScore(candidate)),
    };
  }
}

async function resolveForgProductIdFromProfile(html: string, handle: string): Promise<string | null> {
  const reranked = await rerankForgProductCandidatesWithRecency(html, handle);
  const ranked = reranked;
  if (ranked.length === 0) return null;

  const normalizedHandle = handle.toLowerCase();

  const finalTopCandidates = reranked.slice(0, 3);

  for (const candidate of finalTopCandidates) {
    try {
      const productHtml = await fetchHtml(`https://forg.to/products/${candidate.id}`);
      if (productHtml.toLowerCase().includes(`@${normalizedHandle}`)) {
        return candidate.id;
      }
    } catch {
      // Skip failed candidate verification and continue ranking fallback.
    }
  }

  return reranked[0]?.id ?? null;
}

export async function getForgProductOptions(forgInput: string): Promise<{
  target: "profile" | "product";
  username: string;
  options: ForgProductOption[];
}> {
  await getAuthUserId();

  const target = parseForgTarget(forgInput);

  if (target.kind === "product") {
    return {
      target: "product",
      username: target.id,
      options: [
        {
          id: target.id,
          title: target.id.replace(/-/g, " "),
          score: 1000,
        },
      ],
    };
  }

  const profileHtml = await fetchHtml(target.profileUrl);
  const ranked = await rerankForgProductCandidatesWithRecency(profileHtml, target.handle);
  const top = ranked.slice(0, 5);
  const options = await Promise.all(top.map((candidate) => buildForgOption(candidate)));

  return {
    target: "profile",
    username: `@${target.handle}`,
    options,
  };
}

function parseForgTarget(input: string): ForgTarget {
  const raw = input.trim();
  if (!raw) {
    throw new Error("forg.to ID or URL is required");
  }

  if (/^@[a-zA-Z0-9_.-]{2,120}$/.test(raw)) {
    const handle = raw.slice(1);
    return {
      kind: "profile",
      handle,
      profileUrl: `https://forg.to/@${handle}`,
    };
  }

  if (!raw.includes("/")) {
    if (!/^[a-zA-Z0-9-]{2,120}$/.test(raw)) {
      throw new Error("Invalid forg.to ID format");
    }
    return { kind: "product", id: raw };
  }

  let parsed: URL;
  try {
    parsed = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
  } catch {
    throw new Error("Invalid forg.to URL");
  }

  if (!parsed.hostname.toLowerCase().includes("forg.to")) {
    throw new Error("Please provide a valid forg.to URL");
  }

  const parts = parsed.pathname.split("/").filter(Boolean);
  const decodedParts = parts.map((part) => {
    try {
      return decodeURIComponent(part);
    } catch {
      return part;
    }
  });

  if (decodedParts.length >= 2 && decodedParts[0].toLowerCase() === "products") {
    const id = decodedParts[1];
    if (!id || !/^[a-zA-Z0-9-]{2,120}$/.test(id)) {
      throw new Error("Could not extract a valid forg.to product ID");
    }
    return { kind: "product", id };
  }

  if (decodedParts.length >= 1 && decodedParts[0].startsWith("@")) {
    const handle = decodedParts[0].slice(1);
    if (!handle || !/^[a-zA-Z0-9_.-]{2,120}$/.test(handle)) {
      throw new Error("Could not extract a valid forg.to profile handle");
    }
    return {
      kind: "profile",
      handle,
      profileUrl: `https://forg.to/@${handle}`,
    };
  }

  const id = decodedParts[decodedParts.length - 1];

  if (!id || !/^[a-zA-Z0-9-]{2,120}$/.test(id)) {
    throw new Error("Could not extract a valid forg.to product ID");
  }

  return { kind: "product", id };
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

export async function importFromForg(
  forgInput: string,
  preferredProductId?: string
): Promise<SocialImportResult> {
  await getAuthUserId();

  const target = parseForgTarget(forgInput);

  let id = target.kind === "product" ? target.id : "";

  if (preferredProductId) {
    const normalizedPreferred = preferredProductId.trim();
    if (!isValidForgProductId(normalizedPreferred)) {
      throw new Error("Invalid selected forg.to product ID");
    }
    id = normalizedPreferred;
  } else if (target.kind === "profile") {
    const profileHtml = await fetchHtml(target.profileUrl);
    const resolved = await resolveForgProductIdFromProfile(profileHtml, target.handle);
    if (!resolved) {
      throw new Error(
        "Could not find a product on this forg.to profile. Try a direct product URL like forg.to/products/your-id"
      );
    }
    id = resolved;
  }

  const productUrl = `https://forg.to/products/${id}`;

  let title = id.replace(/-/g, " ");
  let summary = "";
  let website = productUrl;
  let githubUrl = "";

  try {
    const html = await fetchHtml(productUrl);
    const ogTitle = extractMetaContent(html, "og:title");
    const ogDescription = extractMetaContent(html, "og:description");
    const ogUrl = extractMetaContent(html, "og:url");

    if (ogTitle) title = ogTitle;
    if (ogDescription) summary = ogDescription;
    if (ogUrl) website = ogUrl;

    const githubMatch = html.match(/https?:\/\/(?:www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+/i);
    githubUrl = githubMatch?.[0] ?? "";
  } catch {
    // Keep inferred fallback values when the page cannot be parsed.
  }

  const cleanedTitle = title.replace(/\s*\|\s*forg.*$/i, "").trim();
  const displayName = cleanedTitle || id;

  return {
    source: "forg",
    username: target.kind === "profile" ? `@${target.handle}` : id,
    personalInfo: {
      fullName: undefined,
      email: undefined,
      location: undefined,
      website,
      linkedin: undefined,
      github: githubUrl,
      summary: summary || `Built and launched ${displayName} on forg.to`,
    },
    projects: [
      {
        name: displayName,
        description: summary || "Product imported from forg.to profile",
        url: website,
        githubUrl,
        websiteUrl: website,
        technologies: ["Product", "Web"],
        highlights: [
          `Published on forg.to as ${id}`,
        ],
      },
    ],
    skills: [
      {
        category: "Product",
        items: ["Product Development", "Launch", "Portfolio"],
      },
    ],
    experience: [],
    certifications: [],
    confidence: {
      personal: {
        website: "confirmed",
        github: githubUrl ? "inferred" : "inferred",
        summary: summary ? "inferred" : "inferred",
      },
      skills: "inferred",
      projects: "inferred",
      experience: "inferred",
      certifications: "inferred",
    },
  };
}
