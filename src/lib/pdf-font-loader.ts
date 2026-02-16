/**
 * PDF Font Loader — Server-side only
 *
 * Dynamically discovers Google Fonts TTF file URLs from the Google Fonts CSS API
 * and registers them with @react-pdf/renderer for PDF generation.
 *
 * - Uses the Google Fonts v1 CSS API with an IE user-agent to get TTF format URLs
 * - Caches font registrations in memory (per server lifecycle)
 * - Falls back gracefully if font discovery fails
 */

import { Font } from "@react-pdf/renderer";

const registeredFonts = new Set<string>();

// IE 11 user agent — forces Google Fonts to serve TrueType (.ttf) format
const TTF_USER_AGENT =
  "Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko";

/**
 * Register a Google Font for use in @react-pdf/renderer.
 * Safe to call multiple times — only fetches on the first call per font.
 *
 * @param fontName  The family name to register (used in StyleSheet fontFamily)
 * @param googleFamily  The Google Fonts family name (e.g., "Open Sans")
 * @returns true if the font was registered (or already was), false on failure
 */
export async function registerPDFFont(
  fontName: string,
  googleFamily: string
): Promise<boolean> {
  if (registeredFonts.has(fontName)) return true;

  try {
    const weights = [400, 700, 900];
    const weightParam = weights.join(",");
    const apiUrl = `https://fonts.googleapis.com/css?family=${encodeURIComponent(googleFamily)}:${weightParam}`;

    const response = await fetch(apiUrl, {
      headers: { "User-Agent": TTF_USER_AGENT },
    });

    if (!response.ok) {
      console.warn(
        `[pdf-font-loader] Google Fonts API returned ${response.status} for "${googleFamily}"`
      );
      return false;
    }

    const css = await response.text();

    // Parse @font-face blocks from the CSS response
    const fontFaceBlocks = css.split("@font-face").slice(1);
    const fonts: Array<{ src: string; fontWeight: number }> = [];

    for (const block of fontFaceBlocks) {
      const weightMatch = block.match(/font-weight:\s*(\d+)/);
      const urlMatch = block.match(
        /url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/
      );

      if (weightMatch && urlMatch) {
        fonts.push({
          src: urlMatch[1],
          fontWeight: parseInt(weightMatch[1]),
        });
      }
    }

    if (fonts.length === 0) {
      console.warn(
        `[pdf-font-loader] No font file URLs found for "${googleFamily}"`
      );
      return false;
    }

    Font.register({ family: fontName, fonts });
    registeredFonts.add(fontName);
    return true;
  } catch (error) {
    console.warn(`[pdf-font-loader] Failed to register "${fontName}":`, error);
    return false;
  }
}
