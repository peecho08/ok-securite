"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { setWorkerOrgId, setRoleChoiceDone, setActiveRole } from "@/lib/storage";
import { useLocale } from "@/lib/i18n";

export default function JoinPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLocale();
  const token = (params?.token as string) || "";
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      router.replace("/app");
      return;
    }

    async function joinTeam() {
      try {
        const res = await fetch("/api/teams/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          const data = await res.json();
          if (data.error === "team_full") {
            setError(t("upgrade.teamFull"));
          } else {
            setError(data.error || t("joinTeam.invalidLink"));
          }
          return;
        }

        const { org } = await res.json();
        setWorkerOrgId(org.id);
        setRoleChoiceDone();
        setActiveRole("worker");
        await fetch("/api/profile/role", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: "worker" }),
        });
        document.cookie = "pending_join=; path=/; max-age=0";
        window.location.href = "/app";
      } catch {
        setError(t("joinTeam.invalidLink"));
      }
    }

    joinTeam();
  }, [token, router, t]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-white px-5 dark:bg-neutral-900">
      {error ? (
        <div className="text-center">
          <p className="text-sm font-medium text-red-500">{error}</p>
          <button
            onClick={() => router.replace("/app")}
            className="mt-4 rounded-lg bg-[var(--color-primary)] px-5 py-2 text-sm font-bold text-white"
          >
            {t("nav.back")}
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-500">{t("joinTeam.joining")}</p>
      )}
    </div>
  );
}
