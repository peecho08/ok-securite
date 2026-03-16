import type { Metadata, Viewport } from "next";
import { Rubik, Work_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/lib/i18n";
import { ClerkProviderWithLocale } from "@/components/clerk-provider-with-locale";
import { Analytics } from "@vercel/analytics/next";

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
  title: "OK Sécurité",
  description: "Listes de vérification sécurité — rapide et fiable",
  icons: { icon: "/ok-securite.svg", apple: "/ok-securite.svg" },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OK Sécurité",
  },
  metadataBase: new URL("https://ok-chantier.com"),
  openGraph: {
    title: "OK Sécurité",
    description: "Listes de vérification sécurité — rapide et fiable",
    url: "https://ok-chantier.com",
    siteName: "OK Sécurité",
    images: [{ url: "/ok-yellow-white.svg", width: 512, height: 512 }],
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "OK Sécurité",
    description: "Listes de vérification sécurité — rapide et fiable",
    images: ["/ok-yellow-white.svg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${rubik.variable} ${workSans.variable}`}>
      <body className="bg-[var(--color-surface)] text-[#111] dark:bg-neutral-950 dark:text-neutral-100">
        <ThemeProvider>
          <I18nProvider>
            <ClerkProviderWithLocale>{children}</ClerkProviderWithLocale>
          </I18nProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
