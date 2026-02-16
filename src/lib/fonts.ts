/**
 * CV Builder — Font Configuration
 *
 * Defines all available fonts for the CV builder.
 * Each font is available in preview (via Google Fonts CSS) and PDF export
 * (via dynamically-discovered gstatic TTF URLs).
 */

export const CV_FONTS = [
  {
    id: "archivo",
    name: "Archivo",
    googleFamily: "Archivo",
    category: "sans-serif" as const,
    description: "Sharp modern grotesque",
  },
  {
    id: "inter",
    name: "Inter",
    googleFamily: "Inter",
    category: "sans-serif" as const,
    description: "Clean UI typeface",
  },
  {
    id: "roboto",
    name: "Roboto",
    googleFamily: "Roboto",
    category: "sans-serif" as const,
    description: "Google signature font",
  },
  {
    id: "lato",
    name: "Lato",
    googleFamily: "Lato",
    category: "sans-serif" as const,
    description: "Warm humanist sans",
  },
  {
    id: "open-sans",
    name: "Open Sans",
    googleFamily: "Open Sans",
    category: "sans-serif" as const,
    description: "Neutral and friendly",
  },
  {
    id: "merriweather",
    name: "Merriweather",
    googleFamily: "Merriweather",
    category: "serif" as const,
    description: "Highly readable serif",
  },
  {
    id: "montserrat",
    name: "Montserrat",
    googleFamily: "Montserrat",
    category: "sans-serif" as const,
    description: "Urban geometric sans",
  },
  {
    id: "playfair-display",
    name: "Playfair Display",
    googleFamily: "Playfair Display",
    category: "serif" as const,
    description: "Elegant high contrast",
  },
  {
    id: "raleway",
    name: "Raleway",
    googleFamily: "Raleway",
    category: "sans-serif" as const,
    description: "Thin elegant sans",
  },
  {
    id: "source-sans-3",
    name: "Source Sans 3",
    googleFamily: "Source Sans 3",
    category: "sans-serif" as const,
    description: "Adobe workhorse font",
  },
] as const;

export type FontId = (typeof CV_FONTS)[number]["id"];

/**
 * Get Google Fonts CSS URL for browser preview
 */
export function getGoogleFontsCSSUrl(fontId: string): string {
  const font = CV_FONTS.find((f) => f.id === fontId);
  if (!font) return "";
  return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font.googleFamily)}:wght@400;700;900&display=swap`;
}

/**
 * Get CSS font-family value for browser preview
 */
export function getCSSFontFamily(fontId: string): string {
  const font = CV_FONTS.find((f) => f.id === fontId);
  if (!font) return "sans-serif";
  return `"${font.name}", ${font.category}`;
}

/**
 * Get font display name
 */
export function getFontById(fontId: string) {
  return CV_FONTS.find((f) => f.id === fontId) ?? CV_FONTS[0];
}
