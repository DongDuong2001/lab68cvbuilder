import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Analytics } from '@vercel/analytics/next';

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin", "vietnamese"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cvbuilder.lab68.dev';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "lab68dev CV Builder — Build Your Resume",
    template: "%s | lab68dev CV Builder",
  },
  description:
    "Raw. Structured. ATS-optimized brutalist resumes engineered for developers and designers. Export pixel-perfect PDFs for free.",
  keywords: [
    "CV builder", "resume builder", "ATS resume", "free resume",
    "PDF resume", "developer resume", "brutalist design", "lab68dev",
  ],
  authors: [{ name: "lab68dev" }],
  creator: "lab68dev",
  openGraph: {
    type: "website",
    siteName: "lab68dev CV Builder",
    title: "lab68dev CV Builder — Build Your Resume",
    description:
      "Raw. Structured. ATS-optimized brutalist resumes engineered for developers and designers.",
    locale: "en_US",
    alternateLocale: ["vi_VN"],
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "lab68dev CV Builder — Build Your Resume",
    description:
      "Raw. Structured. ATS-optimized brutalist resumes engineered for developers and designers.",
    creator: "@lab68dev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      vi: "/vi",
    },
  },
  icons: {
    icon: [
      { url: "/design-mode/favicon.ico", sizes: "any" },
      { url: "/design-mode/lab68dev_logo.png", type: "image/png" },
    ],
    apple: [{ url: "/design-mode/lab68dev_logo.png", type: "image/png" }],
    shortcut: "/design-mode/favicon.ico",
  },
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${ibmPlexSans.variable} antialiased font-sans`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
