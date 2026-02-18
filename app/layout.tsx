import type { Metadata, Viewport } from "next";
import { Rubik, Work_Sans } from "next/font/google";
import "./globals.css";
import { PwaRegister } from "./pwa-register";

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
  icons: { icon: "/logo.svg", apple: "/logo.svg" },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "OK Chantier",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${rubik.variable} ${workSans.variable}`}>
      <body>
        <div className="mx-auto min-h-dvh w-full max-w-3xl bg-white shadow-sm">
          {children}
        </div>
        <PwaRegister />
      </body>
    </html>
  );
}
