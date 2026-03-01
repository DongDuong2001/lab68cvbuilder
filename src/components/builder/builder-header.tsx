"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useResumeStore } from "@/store/resume-store";
import { TEMPLATES } from "@/lib/constants";
import { CV_FONTS } from "@/lib/fonts";
import { PdfPreviewModal } from "./pdf-preview-modal";

interface BuilderHeaderProps {
  resumeId: string;
  isMobilePreview: boolean;
  onToggleMobilePreview: () => void;
}

export function BuilderHeader({
  resumeId,
  isMobilePreview,
  onToggleMobilePreview,
}: BuilderHeaderProps) {
  const { title, setTitle, templateId, setTemplateId, fontFamily, setFontFamily, isSaving, lastSavedAt } =
    useResumeStore();

  const [isExporting, setIsExporting] = useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [previewFilename, setPreviewFilename] = useState("resume.pdf");

  const handlePreviewPdf = async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      const response = await fetch(`/api/export/${resumeId}`);
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
                {isSaving ? (
                  <span className="label-mono text-gray-500">SAVING...</span>
                ) : lastSavedAt ? (
                  <span className="label-mono text-green-600">
                    SAVED {lastSavedAt.toLocaleTimeString()}
                  </span>
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
            <div className="flex items-center gap-2">
              <span className="label-mono">TEMPLATE:</span>
              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                className="border border-black bg-transparent px-3 py-2 text-xs font-bold uppercase tracking-wider focus:bg-black focus:text-white transition-all duration-150"
              >
                {TEMPLATES.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Font selector */}
            <div className="flex items-center gap-2">
              <span className="label-mono">FONT:</span>
              <select
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
