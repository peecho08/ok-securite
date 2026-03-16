"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from "@clerk/localizations";
import { useLocale } from "@/lib/i18n";

const clerkAppearance = {
  variables: {
    colorPrimary: "#22c55e",
    colorText: "white",
    colorTextOnPrimaryBackground: "#1E2324",
    colorTextSecondary: "rgba(255,255,255,0.7)",
    colorBackground: "#1E2324",
    colorInputBackground: "rgba(255,255,255,0.12)",
    colorInputText: "white",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-work-sans), system-ui, sans-serif",
  },
  elements: {
    card: "shadow-none bg-transparent",
    headerTitle: "font-heading text-white",
    headerSubtitle: "text-white/70",
    socialButtonsBlockButton: "!bg-white !text-neutral-800 font-bold hover:!bg-neutral-100 !border-0 !rounded-xl !py-3 !min-h-[44px]",
    socialButtonsBlockButtonText: "font-heading text-sm font-bold !text-neutral-800",
    socialButtonsIconButton: "!bg-white !border-0 hover:!bg-neutral-100 !rounded-xl !min-h-[44px] !min-w-[44px]",
    formButtonPrimary: "!bg-[#22c55e] !text-[#1E2324] font-heading !font-bold hover:!bg-[#16a34a] !rounded-xl !py-3.5 !text-sm !min-h-[46px]",
    formFieldInput: "!bg-white/12 !border-white/25 !text-white placeholder:!text-white/50 !rounded-xl !py-3 !min-h-[44px] !text-sm",
    formFieldLabel: "!text-white/90 text-sm font-medium",
    dividerLine: "!bg-white/20",
    dividerText: "!text-white/50",
    footerActionLink: "!text-[#22c55e] hover:!text-[#4ade80]",
    footerActionText: "!text-white/60",
    identityPreviewEditButton: "!text-[#22c55e]",
    identityPreviewText: "!text-white",
    formFieldAction: "!text-[#22c55e]",
    otpCodeFieldInput: "!bg-white/12 !border-white/25 !text-white",
    alert: "!bg-red-500/20 !text-red-200 !border-red-500/30",
    formHeaderTitle: "!text-white",
    formHeaderSubtitle: "!text-white/70",
  },
} as const;

export function ClerkProviderWithLocale({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();

  return (
    <ClerkProvider
      key={locale}
      localization={locale === "fr" ? frFR : undefined}
      appearance={clerkAppearance}
    >
      {children}
    </ClerkProvider>
  );
}
