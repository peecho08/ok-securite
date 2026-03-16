"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SPLASH_KEY = "okchantier:splash-shown";

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SPLASH_KEY)) return;
      setVisible(true);
      sessionStorage.setItem(SPLASH_KEY, "1");
      const fadeTimer = setTimeout(() => setFading(true), 1200);
      const hideTimer = setTimeout(() => setVisible(false), 1700);
      return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
    } catch {
      /* sessionStorage unavailable */
    }
  }, []);

  if (!visible) return <>{children}</>;

  return (
    <>
      <div
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--color-header)] transition-opacity duration-500 ${
          fading ? "opacity-0" : "opacity-100"
        }`}
      >
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
      </div>
      {children}
    </>
  );
}
