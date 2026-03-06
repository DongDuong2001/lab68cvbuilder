import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin", "vietnamese"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "lab68dev CV Builder",
  description: "Raw. Structured. Build your resume at lab68dev.",
  icons: {
    icon: [
      { url: "/design-mode/favicon.ico", sizes: "any" },
      { url: "/design-mode/lab68dev_logo.png", type: "image/png" },
    ],
    apple: [
      { url: "/design-mode/lab68dev_logo.png", type: "image/png" },
    ],
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
      </body>
    </html>
  );
}
