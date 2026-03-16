"use client";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[var(--color-header)] px-6">
      {children}
    </div>
  );
}
