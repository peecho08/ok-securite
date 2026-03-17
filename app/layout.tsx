import type { Metadata, Viewport } from "next";
import { Rubik, Work_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/lib/i18n";
import { ClerkProviderWithLocale } from "@/components/clerk-provider-with-locale";
import { Analytics } from "@vercel/analytics/next";
import { CookieConsent } from "@/components/cookie-consent";
import { PostHogProvider } from "@/components/posthog-provider";
import { OrganizationJsonLd, SoftwareApplicationJsonLd } from "@/components/json-ld";
import { Toaster } from "sonner";

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
  icons: {
    icon: "/ok-fav-icon.svg",
    apple: "/icon-192.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OK Sécurité",
  },
  metadataBase: new URL("https://ok-securite.com"),
  openGraph: {
    title: "OK Sécurité",
    description: "Listes de vérification sécurité — rapide et fiable",
    url: "https://ok-securite.com",
    siteName: "OK Sécurité",
    locale: "fr_CA",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "OK Sécurité" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OK Sécurité",
    description: "Listes de vérification sécurité — rapide et fiable",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { headers } = await import("next/headers");
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const lang = pathname.startsWith("/en") ? "en" : "fr";

  return (
    <html lang={lang} className={`${rubik.variable} ${workSans.variable}`}>
      <head>
        <OrganizationJsonLd />
        <SoftwareApplicationJsonLd />
      </head>
      <body className="bg-[var(--color-surface)] text-[#111] dark:bg-neutral-950 dark:text-neutral-100">
        <ThemeProvider>
          <I18nProvider>
            <ClerkProviderWithLocale>
              <PostHogProvider>{children}</PostHogProvider>
            </ClerkProviderWithLocale>
            <CookieConsent />
            <Toaster
              position="top-center"
              toastOptions={{
                className: "!rounded-xl !font-[var(--font-rubik)] !text-sm",
              }}
            />
          </I18nProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
