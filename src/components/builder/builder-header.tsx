"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { useResumeStore } from "@/store/resume-store";
import { CV_FONTS } from "@/lib/fonts";
import { PDF_LOCALES } from "@/lib/pdf-labels";
import { TEMPLATES } from "@/lib/constants";
import { PdfPreviewModal } from "./pdf-preview-modal";
import { TemplatePicker } from "./template-picker";

interface BuilderHeaderProps {
  resumeId: string;
  isMobilePreview: boolean;
  onToggleMobilePreview: () => void;
  saveValidationError?: string | null;
}

export function BuilderHeader({
  resumeId,
  isMobilePreview,
  onToggleMobilePreview,
  saveValidationError,
}: BuilderHeaderProps) {
  const { title, setTitle, templateId, setTemplateId, fontFamily, setFontFamily, pdfLocale, setPdfLocale, isSaving, isDirty, lastSavedAt, data } =
    useResumeStore();

  const [isExporting, setIsExporting] = useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [previewFilename, setPreviewFilename] = useState("resume.pdf");
  const [exportError, setExportError] = useState<string | null>(null);

  // Auto-clear export error once the user fixes the underlying issue
  useEffect(() => {
    if (!exportError) return;
    const validTemplateIds: readonly string[] = TEMPLATES.map((t) => t.id);
    if (
      validTemplateIds.includes(templateId) &&
      data.personalInfo.fullName.trim() &&
      data.personalInfo.email.trim()
    ) {
      setExportError(null);
    }
  }, [exportError, templateId, data.personalInfo.fullName, data.personalInfo.email]);

  const handlePreviewPdf = async () => {
    // Prevent concurrent exports and re-generation while modal is open
    if (isExporting || previewPdfUrl) return;

    const validTemplateIds: readonly string[] = TEMPLATES.map((t) => t.id);
    if (!validTemplateIds.includes(templateId)) {
      setExportError("Please select a template before exporting.");
      return;
    }
    if (!data.personalInfo.fullName.trim()) {
      setExportError("Full Name is required before exporting.");
      return;
    }
    if (!data.personalInfo.email.trim()) {
      setExportError("Email is required before exporting.");
      return;
    }
    setExportError(null);

    setIsExporting(true);

    try {
      const response = await fetch(`/api/export/${resumeId}?locale=${pdfLocale}`);
      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Extract filename from Content-Disposition if available
      const disposition = response.headers.get("Content-Disposition");
      let filename = `${title || "resume"}.pdf`;
      if (disposition && disposition.indexOf("filename=") !== -1) {
        const matches = /filename="([^"]+)"/.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1];
        }
      }

      setPreviewFilename(filename);
      setPreviewPdfUrl(url);
    } catch (error) {
      console.error("Failed to generate PDF preview:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleClosePreview = () => {
    if (previewPdfUrl) {
      window.URL.revokeObjectURL(previewPdfUrl);
    }
    setPreviewPdfUrl(null);
  };

  return (
    <>
      <header className="border-b border-black bg-white">
        <div className="p-4">
          {/* Top row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="border border-black px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-150"
              >
                ← Back
              </Link>
              <span className="label-mono">BUILDER_MODE</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Save status */}
              <div className="hidden md:flex items-center gap-2">
                {saveValidationError ? (
                  <>
                    <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
                    <span className="label-mono text-red-500 text-[10px]">{saveValidationError}</span>
                  </>
                ) : isSaving ? (
                  <>
                    <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                    <span className="label-mono text-yellow-600">SAVING...</span>
                  </>
                ) : isDirty ? (
                  <>
                    <span className="inline-block w-2 h-2 rounded-full bg-orange-400" />
                    <span className="label-mono text-orange-500">UNSAVED</span>
                  </>
                ) : lastSavedAt ? (
                  <>
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                    <span className="label-mono text-green-600">
                      SAVED {lastSavedAt.toLocaleTimeString()}
                    </span>
                  </>
                ) : null}
              </div>

              {/* Mobile preview toggle */}
              <button
                onClick={onToggleMobilePreview}
                className="lg:hidden border border-black px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-150"
              >
                {isMobilePreview ? "Edit" : "Preview"}
              </button>

              {/* Export button */}
              <div className="flex flex-col items-end gap-1">
                <button
                  onClick={handlePreviewPdf}
                  disabled={isExporting}
                  className={`border border-black px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-150 ${isExporting
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white hover:bg-white hover:text-black"
                    }`}
                >
                  {isExporting ? "GENERATING..." : "EXPORT PDF"}
                </button>
                {exportError && (
                  <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider max-w-48 text-right">
                    {exportError}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Title input */}
            <div className="flex-1">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Resume Title"
                className="w-full border border-gray-300 bg-transparent px-3 py-2 text-lg font-bold focus:border-black focus:bg-black focus:text-white transition-all duration-150"
              />
            </div>

            {/* Template selector */}
            <TemplatePicker value={templateId} onChange={setTemplateId} />

            {/* Font selector */}
            <div className="flex items-center gap-2">
              <span className="label-mono">FONT:</span>
              <select
                title="Font family"
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="border border-black bg-transparent px-3 py-2 text-xs font-bold tracking-wider focus:bg-black focus:text-white transition-all duration-150"
              >
                {CV_FONTS.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            {/* PDF Language selector */}
            <div className="flex items-center gap-2">
              <span className="label-mono">LANG:</span>
              <select
                title="PDF language"
                value={pdfLocale}
                onChange={(e) => setPdfLocale(e.target.value)}
                className="border border-black bg-transparent px-3 py-2 text-xs font-bold tracking-wider focus:bg-black focus:text-white transition-all duration-150"
              >
                {PDF_LOCALES.map((loc) => (
                  <option key={loc.code} value={loc.code}>
                    {loc.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* PDF Preview Modal */}
      {previewPdfUrl && (
        <PdfPreviewModal
          pdfUrl={previewPdfUrl}
          filename={previewFilename}
          onClose={handleClosePreview}
        />
      )}
    </>
  );
}
