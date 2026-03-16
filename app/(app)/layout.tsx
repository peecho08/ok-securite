import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PwaRegister } from "./pwa-register";
import { OfflineIndicator } from "@/components/offline-indicator";
import { SplashScreen } from "@/components/splash-screen";
import { ChooseRole } from "@/components/choose-role";
import { getProfileServer } from "@/lib/db-server";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const profile = await getProfileServer(userId);
  const needsRoleSelection = !profile || profile.role === null;

  return (
    <>
      <OfflineIndicator />
      <SplashScreen>
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: "48rem",
            zIndex: 1,
            height: "env(safe-area-inset-top, 0px)",
            backgroundColor: "var(--color-header)",
            pointerEvents: "none" as const,
          }}
        />
        <div className="relative z-[2] mx-auto min-h-dvh w-full max-w-3xl bg-white shadow-sm dark:bg-neutral-900 dark:shadow-none">
          {needsRoleSelection ? <ChooseRole /> : children}
        </div>
      </SplashScreen>
      <PwaRegister />
    </>
  );
}
