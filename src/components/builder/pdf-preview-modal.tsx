"use client";

import { useEffect, useRef, useState } from "react";

interface PdfPreviewModalProps {
    pdfUrl: string;
    filename: string;
    onClose: () => void;
}

export function PdfPreviewModal({ pdfUrl, filename, onClose }: PdfPreviewModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const [zoom, setZoom] = useState(100);

    const zoomIn = () => setZoom((z) => Math.min(z + 25, 200));
    const zoomOut = () => setZoom((z) => Math.max(z - 25, 50));
    const zoomReset = () => setZoom(100);

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
                        <span className="text-xs text-gray-500 truncate max-w-50">{filename}</span>
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

                {/* Zoom controls */}
                <div className="flex items-center justify-center gap-2 border-b border-gray-200 px-4 py-2 bg-gray-50 shrink-0">
                    <button
                        onClick={zoomOut}
                        disabled={zoom <= 50}
                        className="border border-gray-400 px-3 py-1 text-xs font-bold hover:bg-black hover:text-white transition-colors duration-150 disabled:opacity-30"
                    >
                        −
                    </button>
                    <button
                        onClick={zoomReset}
                        className="border border-gray-400 px-3 py-1 text-xs font-mono tabular-nums hover:bg-black hover:text-white transition-colors duration-150 min-w-16 text-center"
                    >
                        {zoom}%
                    </button>
                    <button
                        onClick={zoomIn}
                        disabled={zoom >= 200}
                        className="border border-gray-400 px-3 py-1 text-xs font-bold hover:bg-black hover:text-white transition-colors duration-150 disabled:opacity-30"
                    >
                        +
                    </button>
                </div>

                {/* PDF iframe */}
                <div className="flex-1 bg-gray-100 overflow-auto">
                    <div
                        style={{
                            transform: `scale(${zoom / 100})`,
                            transformOrigin: "top center",
                            width: `${10000 / zoom}%`,
                            height: `${10000 / zoom}%`,
                        }}
                    >
                        <iframe
                            src={pdfUrl}
                            title="PDF Preview"
                            className="w-full h-full border-0"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
