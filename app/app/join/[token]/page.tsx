"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { setWorkerOrgId, setRoleChoiceDone, setActiveRole, setTeamName, setTeamTasks } from "@/lib/storage";
import { useLocale } from "@/lib/i18n";

export default function JoinPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLocale();
  const token = (params?.token as string) || "";
  const [error, setError] = useState("");
  const [orgName, setOrgName] = useState("");

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
        setOrgName(org.name);
        setWorkerOrgId(org.id);
        setTeamName(org.name);
        setTeamTasks(org.teamTasks || []);
        setRoleChoiceDone();
        setActiveRole("worker");
        await fetch("/api/profile/role", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: "worker" }),
        });
        document.cookie = "pending_join=; path=/; max-age=0";
        await new Promise((r) => setTimeout(r, 1200));
        window.location.href = "/app";
      } catch {
        setError(t("joinTeam.invalidLink"));
      }
    }

    joinTeam();
  }, [token, router, t]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-white px-8 dark:bg-neutral-900">
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
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#22c55e]/10">
            <Users className="h-10 w-10 text-[#22c55e]" strokeWidth={1.5} />
          </div>
          <p className="mt-6 font-heading text-xl font-bold text-gray-900 dark:text-neutral-100">
            {orgName
              ? `${t("joinTeam.joiningNamed")} ${orgName}`
              : t("joinTeam.joining")}
          </p>
          <div className="mt-4 h-1 w-16 animate-pulse rounded-full bg-[#22c55e]/30" />
        </div>
      )}
    </div>
  );
}
