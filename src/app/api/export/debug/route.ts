export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getResume } from "@/actions/resume";
import { renderToStream } from "@react-pdf/renderer";
import { CreativePDF } from "@/components/pdf/creative-pdf";
import { ExecutivePDF } from "@/components/pdf/executive-pdf";
import { HarvardPDF } from "@/components/pdf/harvard-pdf";
import { AtsPDF } from "@/components/pdf/ats-pdf";
import type { TemplateId } from "@/lib/constants";
import { getFontById } from "@/lib/fonts";
import { registerPDFFont } from "@/lib/pdf-font-loader";
import React from "react";
import type { ResumeData } from "@/db/schema";

type PDFComponentType = React.ComponentType<{ data: ResumeData; fontFamily?: string }>;

const PDF_TEMPLATES: Record<TemplateId, PDFComponentType> = {
    "creative": CreativePDF,
    "executive": ExecutivePDF,
    "harvard": HarvardPDF,
    "ats": AtsPDF,
};

export async function GET(
    request: NextRequest,
) {
    try {
        const id = "f18ef1ef-109f-4089-b061-6ccf51135389";
        const resume = await getResume(id);
        if (!resume) {
            return NextResponse.json({ error: "Resume not found" }, { status: 404 });
        }

        const fontConfig = getFontById(resume.fontFamily ?? "inter");
        const fontRegistered = await registerPDFFont(
            fontConfig.name,
            fontConfig.googleFamily
        );

        const pdfFontFamily = fontRegistered ? fontConfig.name : "Archivo";

        const Component = PDF_TEMPLATES[resume.templateId as TemplateId] || HarvardPDF;
        const PDFElement = React.createElement(Component, {
            data: resume.data,
            fontFamily: pdfFontFamily,
        });

        const stream = await renderToStream(PDFElement as any);

        return new NextResponse(stream as unknown as ReadableStream, {
            headers: {
                "Content-Type": "application/pdf",
            },
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Debug failure", message: error.message, stack: error.stack },
            { status: 500 }
        );
    }
}
