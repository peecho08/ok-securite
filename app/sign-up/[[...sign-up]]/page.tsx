"use client";

import { SignUp } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth-shell";

export default function SignUpPage() {
  return (
    <AuthShell>
      <SignUp forceRedirectUrl="/app" />
    </AuthShell>
  );
}
