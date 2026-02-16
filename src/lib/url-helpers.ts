/**
 * URL utilities for CV display.
 *
 * Normalises raw URLs into proper hrefs and clean display labels
 * so the CV shows "GitHub", "LinkedIn", "Portfolio" instead of
 * full addresses, while keeping the underlying link clickable.
 */

/** Ensure a URL string has a protocol prefix for linking */
export function ensureHref(url: string): string {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.includes("@")) return `mailto:${url}`;
  return `https://${url}`;
}

/** Clean display label for a website URL → "Portfolio" */
export function websiteLabel(_url: string): string {
  return "Portfolio";
}

/** Clean display label for LinkedIn → "LinkedIn" */
export function linkedinLabel(_url: string): string {
  return "LinkedIn";
}

/** Clean display label for GitHub → "GitHub" */
export function githubLabel(_url: string): string {
  return "GitHub";
}
