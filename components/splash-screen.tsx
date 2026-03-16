"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SPLASH_KEY = "okchantier:splash-shown";

type Phase = "scrim" | "splash" | "fading" | "done";

export function SplashScreen({ children }: { children: React.ReactNode }) {
  // Start with dark scrim so the first paint is never a flash of white/skeleton
  const [phase, setPhase] = useState<Phase>("scrim");

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SPLASH_KEY)) {
        setPhase("done");
        return;
      }
      sessionStorage.setItem(SPLASH_KEY, "1");
      setPhase("splash");
      const fadeTimer = setTimeout(() => setPhase("fading"), 1200);
      const hideTimer = setTimeout(() => setPhase("done"), 1700);
      return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
    } catch {
      setPhase("done");
    }
  }, []);

  if (phase === "done") return <>{children}</>;

  return (
    <>
      <div
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--color-header)] transition-opacity duration-500 ${
          phase === "fading" ? "opacity-0" : "opacity-100"
        }`}
      >
        {(phase === "splash" || phase === "fading") && (
          <>
            <div className="animate-splash-logo">
              <Image
                src="/ok-securite.svg"
                alt="OK Sécurité"
                width={240}
                height={60}
                className="h-16 w-auto sm:h-20"
                priority
              />
            </div>
            <p className="mt-4 animate-splash-tagline text-sm font-medium text-white/70">
              Sécurité chantier
            </p>
          </>
        )}
      </div>
      {children}
    </>
  );
}
