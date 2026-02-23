"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { setWorkerOrgId, setRoleChoiceDone, setActiveRole } from "@/lib/storage";
import { useLocale } from "@/lib/i18n";

export default function JoinPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLocale();
  const token = (params?.token as string) || "";

  useEffect(() => {
    if (!token) {
      router.replace("/");
      return;
    }
    setWorkerOrgId(token);
    setRoleChoiceDone();
    setActiveRole("worker");
    router.replace("/");
  }, [token, router]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-white px-5 dark:bg-neutral-900">
      <p className="text-sm text-gray-500">{t("joinTeam.joining")}</p>
    </div>
  );
}
