"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { tasks } from "@/data/tasks";
import { type TaskCategory } from "@/types";
import { localCatLabel, localTitle, normalize } from "@/lib/locale-helpers";
import { setFavorites, getWorkerName, setWorkerName } from "@/lib/storage";
import { TaskIcon } from "@/components/task-icon";
import { useLocale } from "@/lib/i18n";
import { CheckCircle, Layers, WifiOff } from "lucide-react";

const categoryOrder: TaskCategory[] = [
  "gros-oeuvre",
  "structure",
  "enveloppe",
  "mecanique",
  "finition",
  "equipement",
  "situation",
];

const MIN_FAVORITES = 1;

interface OnboardingProps {
  initial?: string[];
  skipWelcome?: boolean;
  onDone: (ids: string[]) => void;
}

export function Onboarding({ initial = [], skipWelcome = false, onDone }: OnboardingProps) {
  const { locale, t } = useLocale();
  const [step, setStep] = useState<"welcome" | "pick">(skipWelcome ? "pick" : "welcome");
  const [name, setName] = useState(getWorkerName);
  const [selected, setSelected] = useState<Set<string>>(new Set(initial));
  const [search, setSearch] = useState("");
  const [exiting, setExiting] = useState(false);

  function handleStart() {
    if (name.trim()) setWorkerName(name.trim());
    setStep("pick");
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleConfirm() {
    if (selected.size < MIN_FAVORITES || exiting) return;
    const ids = Array.from(selected);
    setFavorites(ids);
    setExiting(true);
    setTimeout(() => onDone(ids), 350);
  }

  const filteredGrouped = useMemo(() => {
    const q = normalize(search);
    return categoryOrder.map((cat) => ({
      category: cat,
      label: localCatLabel(cat, locale),
      tasks: tasks.filter((task) => {
        if (task.category !== cat) return false;
        if (!q) return true;
        const searchable = [
          task.title,
          task.description,
          task.titleEn ?? "",
          task.descriptionEn ?? "",
          (task.keywords ?? []).join(" "),
        ].join(" ");
        return normalize(searchable).includes(q);
      }),
    })).filter((g) => g.tasks.length > 0);
  }, [search, locale]);

  const count = selected.size;
  const canConfirm = count >= MIN_FAVORITES;

  const features = [
    { icon: CheckCircle, titleKey: "onboarding.feature1Title", descKey: "onboarding.feature1Desc", color: "bg-green-100 text-green-700" },
    { icon: Layers, titleKey: "onboarding.feature2Title", descKey: "onboarding.feature2Desc", color: "bg-green-100 text-green-700" },
    { icon: WifiOff, titleKey: "onboarding.feature3Title", descKey: "onboarding.feature3Desc", color: "bg-green-100 text-green-700" },
  ];

  if (step === "welcome") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white text-gray-900">
        <div className="flex flex-1 flex-col items-center justify-center px-8 py-6 text-center">
          <div className="animate-scale-in">
            <Image
              src="/logo.svg"
              alt="OK Chantier"
              width={188}
              height={48}
              className="h-10 w-auto"
              priority
            />
          </div>

          <h1 className="mt-5 animate-slide-in-up font-heading text-xl font-bold text-black">
            {name.trim() ? `${t("onboarding.hello")} ${name.trim().split(" ")[0]}` : t("onboarding.hello")} !
          </h1>
          <p className="mt-1 max-w-sm animate-slide-in-up text-sm text-gray-500" style={{ animationDelay: "0.1s" }}>
            {t("onboarding.subtitle")}
          </p>

          <div className="mt-5 flex w-full max-w-sm flex-col gap-2">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.titleKey}
                  className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/50 px-3 py-2.5 text-left animate-slide-in-up"
                  style={{ animationDelay: `${0.15 + i * 0.1}s` }}
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${feat.color}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-heading text-sm font-bold text-gray-800">{t(feat.titleKey)}</p>
                    <p className="mt-0.5 text-xs leading-snug text-gray-500">{t(feat.descKey)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("onboarding.namePlaceholder")}
            className="mt-5 w-full max-w-xs rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-center text-base text-black outline-none placeholder:text-gray-400 focus:border-gray-400 focus:bg-white animate-slide-in-up"
            style={{ animationDelay: "0.45s" }}
          />

          <button
            onClick={handleStart}
            className="mt-4 w-full max-w-xs rounded-xl bg-[#118914] py-3 font-heading text-base font-bold tracking-wide text-white transition-colors hover:bg-[#0e7511] active:bg-[#0e7511] animate-slide-in-up"
            style={{ animationDelay: "0.55s" }}
          >
            {t("onboarding.start")}
          </button>

        </div>
        <div className="pb-4 flex flex-col items-center gap-1">
          <span className="text-xs text-gray-400">{t("nav.poweredBy")}</span>
          <Image
            src="/cnesst-logo.svg"
            alt="CNESST"
            width={100}
            height={38}
            className="h-[20px] w-auto"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 flex flex-col bg-white text-gray-900 ${exiting ? "animate-fade-out-up" : ""}`}>
      <div className="bg-[#118914] px-5 pb-4 pt-8 sm:px-8">
        <div className="mx-auto max-w-3xl">
          {!skipWelcome && (
            <button
              onClick={() => setStep("welcome")}
              className="mb-3 flex items-center gap-1 text-sm text-white/70 transition-colors hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              {t("nav.back")}
            </button>
          )}
          <h1 className="font-heading text-2xl font-bold text-white">
            {t("onboarding.pickTitle")}
          </h1>
          <p className="mt-1 text-sm text-white/70">
            {t("onboarding.pickSubtitle")}
          </p>

          <div className="relative mt-4">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("onboarding.searchPlaceholder")}
              className="w-full rounded-xl border border-white/25 bg-white/15 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/50 focus:border-white/40 focus:bg-white/20"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-32 pt-5 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-6">
            {filteredGrouped.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">{t("onboarding.noResults")}</p>
            ) : (
              filteredGrouped.map(({ category, label, tasks: catTasks }) => (
                <section key={category}>
                  <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                    {localCatLabel(category, locale)}
                  </h2>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {catTasks.map((task) => {
                      const isSelected = selected.has(task.id);
                      return (
                        <button
                          key={task.id}
                          onClick={() => toggle(task.id)}
                          className={`flex items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-colors ${
                            isSelected
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 bg-white hover:border-gray-300 active:bg-gray-50"
                          }`}
                        >
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                              isSelected ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            <TaskIcon taskId={task.id} className="h-4.5 w-4.5" />
                          </span>
                          <span className="min-w-0 text-sm font-semibold leading-tight text-gray-900">
                            {localTitle(task, locale)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white px-5 py-4 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="mb-2 text-center text-sm text-gray-500">
            {t("onboarding.taskCount").replace("{count}", String(count)).replace("{s}", count !== 1 ? "s" : "")}
          </p>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={`w-full rounded-xl py-3.5 font-heading text-sm font-bold tracking-wide transition-colors ${
              canConfirm
                ? "bg-[#118914] text-white hover:bg-[#0e7511] active:bg-[#0e7511]"
                : "cursor-not-allowed bg-gray-200 text-gray-400"
            }`}
          >
            {canConfirm ? t("onboarding.confirm") : t("onboarding.selectMin")}
          </button>
        </div>
      </div>
    </div>
  );
}
