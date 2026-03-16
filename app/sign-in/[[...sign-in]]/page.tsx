"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/app";

  return (
    <AuthShell>
      <SignIn forceRedirectUrl={redirectUrl} />
    </AuthShell>
  );
}
