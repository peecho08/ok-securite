"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/app";

  return (
    <AuthShell>
      <SignUp forceRedirectUrl={redirectUrl} />
    </AuthShell>
  );
}
