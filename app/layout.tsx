import type { Metadata, Viewport } from "next";
import { Rubik, Work_Sans } from "next/font/google";
import "./globals.css";
import { PwaRegister } from "./pwa-register";
import { PasswordGate } from "@/components/password-gate";
import { OfflineIndicator } from "@/components/offline-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/lib/i18n";

const rubik = Rubik({
  subsets: ["latin", "latin-ext"],
  variable: "--font-rubik",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-work-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OK Chantier",
  description: "Checklist sécurité chantier — rapide et fiable",
  icons: { icon: "/ok.svg", apple: "/ok.svg" },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OK Chantier",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#118914",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${rubik.variable} ${workSans.variable}`} style={{ backgroundColor: "#118914" }}>
      <body className="bg-[var(--color-surface)] text-[#111] dark:bg-neutral-950 dark:text-neutral-100">
        <ThemeProvider>
          <I18nProvider>
          <OfflineIndicator />
          <div className="mx-auto min-h-dvh w-full max-w-3xl bg-white shadow-sm dark:bg-neutral-900 dark:shadow-none">
            <PasswordGate>{children}</PasswordGate>
          </div>
          <PwaRegister />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
