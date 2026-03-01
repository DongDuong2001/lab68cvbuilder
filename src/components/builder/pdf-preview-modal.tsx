"use client";

import { useEffect, useRef } from "react";

interface PdfPreviewModalProps {
    pdfUrl: string;
    filename: string;
    onClose: () => void;
}

export function PdfPreviewModal({ pdfUrl, filename, onClose }: PdfPreviewModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const handleDownload = () => {
        const a = document.createElement("a");
        a.href = pdfUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) onClose();
    };

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
        >
            {/* Modal container */}
            <div
                className="relative flex flex-col bg-white border border-black"
                style={{ width: "min(900px, 95vw)", height: "min(90vh, 95vh)" }}
            >
                {/* Header bar */}
                <div className="flex items-center justify-between border-b border-black px-4 py-3 bg-white shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="label-mono text-xs">PDF_PREVIEW</span>
                        <span className="text-xs text-gray-500 truncate max-w-[200px]">{filename}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDownload}
                            className="border border-black bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors duration-150"
                        >
                            ↓ Download
                        </button>
                        <button
                            onClick={onClose}
                            className="border border-black px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-150"
                        >
                            ✕ Close
                        </button>
                    </div>
                </div>

                {/* PDF iframe */}
                <div className="flex-1 bg-gray-100 overflow-hidden">
                    <iframe
                        src={pdfUrl}
                        title="PDF Preview"
                        className="w-full h-full border-0"
                    />
                </div>
            </div>
        </div>
    );
}
