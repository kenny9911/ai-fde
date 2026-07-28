import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

import { LocaleProvider } from "@/lib/i18n";
import { AppShell } from "@/components/app-shell";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "AI-FDE — AI Ontology Architect",
  description:
    "AI Ontology Architect, ontology consultant and AI analyst for ERP engagements. Turns decks, screens and transcripts into a defensible business understanding baseline.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LocaleProvider>
            <AppShell>{children}</AppShell>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
