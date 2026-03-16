import Link from "next/link";
import { tasks } from "@/data/tasks";
import { checklists } from "@/data/checklists";
import { checklistItemsEn, phaseTitlesEn } from "@/data/checklists-en";
import {
  categoryLabels,
  categoryLabelsEn,
  type TaskCategory,
  type ChecklistItem,
  type PhaseGroup,
} from "@/types";
import {
  getTaskPath,
  getCategoryPath,
  getChecklistsBasePath,
  getTasksForCategory,
  getAllCategories,
} from "@/lib/checklist-slugs";
import { APP_URL } from "@/lib/urls";
import type { Locale } from "@/lib/i18n";
import type { Task } from "@/types";
import { TaskIcon } from "@/components/task-icon";
import { mergePhases } from "@/lib/locale-helpers";

// ── Locale helpers (server-side, no hooks) ─────────────

function l(locale: Locale, fr: string, en: string) {
  return locale === "en" ? en : fr;
}

function catLabel(cat: TaskCategory, locale: Locale) {
  return locale === "en" ? categoryLabelsEn[cat] : categoryLabels[cat];
}

function tTitle(task: Task, locale: Locale) {
  return locale === "en" && task.titleEn ? task.titleEn : task.title;
}

function tDesc(task: Task, locale: Locale) {
  return locale === "en" && task.descriptionEn
    ? task.descriptionEn
    : task.description;
}

function phTitle(title: string, locale: Locale) {
  return locale === "en" ? (phaseTitlesEn[title] ?? title) : title;
}

function iLabel(item: ChecklistItem, locale: Locale) {
  if (locale === "en") return checklistItemsEn[item.id]?.label ?? item.label;
  return item.label;
}

function iInfo(item: ChecklistItem, locale: Locale) {
  if (locale === "en") return checklistItemsEn[item.id]?.info ?? item.info;
  return item.info;
}

// ── Breadcrumbs ────────────────────────────────────────

function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 text-sm text-gray-500 dark:text-neutral-400"
    >
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && (
              <span aria-hidden="true" className="mx-1">
                /
              </span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-gray-700 dark:hover:text-neutral-200"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-gray-800 dark:text-neutral-100">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ── CTA Section ────────────────────────────────────────

function CTASection({ locale }: { locale: Locale }) {
  return (
    <section className="mt-16 rounded-2xl bg-[var(--color-header)] px-6 py-12 text-center sm:px-12">
      <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
        {l(
          locale,
          "Utilisez ces listes sur le terrain",
          "Use these checklists on-site",
        )}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-white/70">
        {l(
          locale,
          "Complétez vos inspections, prenez des photos et générez des rapports PDF — directement depuis votre téléphone.",
          "Complete inspections, take photos and generate PDF reports — right from your phone.",
        )}
      </p>
      <a
        href={APP_URL}
        className="mt-8 inline-block rounded-xl bg-[var(--color-primary)] px-8 py-4 font-heading text-base font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
      >
        {l(locale, "Essayer gratuitement", "Try for free")}
      </a>
    </section>
  );
}

// ── Task Card ──────────────────────────────────────────

function TaskCard({ task, locale }: { task: Task; locale: Locale }) {
  const raw = checklists[task.id];
  const phases = raw ? mergePhases(raw.phases) : null;
  const itemCount =
    phases?.reduce((sum, p) => sum + p.items.length, 0) ?? 0;

  return (
    <Link
      href={getTaskPath(task.id, locale)}
      className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-[var(--color-primary)]/30"
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 group-hover:bg-[var(--color-primary)]/10 group-hover:text-[var(--color-primary)] dark:bg-neutral-700 dark:text-neutral-300">
        <TaskIcon taskId={task.id} className="h-5 w-5" />
      </div>
      <h3 className="font-heading text-base font-bold transition-colors group-hover:text-[var(--color-primary)]">
        {tTitle(task, locale)}
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-neutral-400">
        {tDesc(task, locale)}
      </p>
      {itemCount > 0 && (
        <p className="mt-3 text-xs font-medium text-[var(--color-primary)]">
          {itemCount} {l(locale, "vérifications", "checks")}
        </p>
      )}
    </Link>
  );
}

// ── Phase Section ──────────────────────────────────────

function PhaseSection({
  phase,
  locale,
}: {
  phase: PhaseGroup;
  locale: Locale;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-neutral-700">
        <h3 className="font-heading text-base font-bold">
          {phTitle(phase.title, locale)}
        </h3>
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-neutral-700 dark:text-neutral-300">
          {phase.items.length}{" "}
          {l(
            locale,
            phase.items.length === 1 ? "point" : "points",
            phase.items.length === 1 ? "item" : "items",
          )}
        </span>
      </div>
      <ul className="divide-y divide-gray-50 dark:divide-neutral-700/50">
        {phase.items.map((item) => {
          const info = iInfo(item, locale);
          return (
            <li key={item.id} className="flex gap-3 px-5 py-3">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border border-gray-300 text-[10px] text-gray-400 dark:border-neutral-600 dark:text-neutral-500">
                ✓
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm leading-relaxed ${item.critical ? "font-semibold text-red-700 dark:text-red-400" : "text-gray-700 dark:text-neutral-300"}`}
                >
                  {iLabel(item, locale)}
                  {item.critical && (
                    <span className="ml-2 inline-flex items-center rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      {l(locale, "Critique", "Critical")}
                    </span>
                  )}
                </p>
                {info && (
                  <p className="mt-1 text-xs italic text-gray-500 dark:text-neutral-400">
                    ℹ️ {info}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ── Checklist Preview with fade-out ────────────────────

function ChecklistPreview({
  phases,
  locale,
  totalItems,
}: {
  phases: PhaseGroup[];
  locale: Locale;
  totalItems: number;
}) {
  const previewPhase = phases[0];
  const remainingPhases = phases.slice(1);
  const hiddenItemCount =
    totalItems - (previewPhase?.items.length ?? 0);

  return (
    <div>
      {/* First phase shown fully */}
      {previewPhase && (
        <PhaseSection phase={previewPhase} locale={locale} />
      )}

      {/* Remaining phases fade out */}
      {remainingPhases.length > 0 && (
        <div className="relative mt-6">
          <div className="space-y-6 [mask-image:linear-gradient(to_bottom,black_0%,black_20%,transparent_90%)]">
            {remainingPhases.map((phase) => (
              <PhaseSection
                key={phase.phase}
                phase={phase}
                locale={locale}
              />
            ))}
          </div>

          {/* CTA overlay at the bottom of the fade */}
          <div className="relative z-10 -mt-8 flex flex-col items-center pb-2 pt-10">
            <p className="mb-2 text-center text-sm font-medium text-gray-500 dark:text-neutral-400">
              {l(
                locale,
                `+ ${hiddenItemCount} autres vérifications`,
                `+ ${hiddenItemCount} more checks`,
              )}
            </p>
            <a
              href={APP_URL}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-8 py-3.5 font-heading text-base font-bold text-white shadow-lg shadow-[var(--color-primary)]/20 transition-all hover:bg-[var(--color-primary-dark)] hover:shadow-xl hover:shadow-[var(--color-primary)]/30"
            >
              {l(
                locale,
                "Voir la liste complète — gratuit",
                "See full checklist — free",
              )}
            </a>
            <p className="mt-2 text-xs text-gray-400 dark:text-neutral-500">
              {l(
                locale,
                "Aucune carte de crédit requise",
                "No credit card required",
              )}
            </p>
          </div>
        </div>
      )}

      {/* Fallback CTA if only one phase */}
      {remainingPhases.length === 0 && (
        <div className="mt-8 flex flex-col items-center">
          <a
            href={APP_URL}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-8 py-3.5 font-heading text-base font-bold text-white shadow-lg shadow-[var(--color-primary)]/20 transition-all hover:bg-[var(--color-primary-dark)] hover:shadow-xl hover:shadow-[var(--color-primary)]/30"
          >
            {l(
              locale,
              "Utiliser cette liste sur le terrain",
              "Use this checklist on-site",
            )}
          </a>
          <p className="mt-2 text-xs text-gray-400 dark:text-neutral-500">
            {l(
              locale,
              "Gratuit — aucune carte de crédit requise",
              "Free — no credit card required",
            )}
          </p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// INDEX PAGE
// ═══════════════════════════════════════════════════════

export function ChecklistIndex({ locale }: { locale: Locale }) {
  const categories = getAllCategories();

  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 pt-28 sm:px-8 sm:pb-28 sm:pt-32">
      <Breadcrumbs
        items={[
          { label: l(locale, "Accueil", "Home"), href: "/" },
          {
            label: l(
              locale,
              "Listes de vérification",
              "Safety checklists",
            ),
          },
        ]}
      />

      <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        {l(
          locale,
          "Listes de vérification CNESST",
          "CNESST Safety Checklists",
        )}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-gray-600 dark:text-neutral-400">
        {l(
          locale,
          "Plus de 50 listes de vérification conformes aux normes CNESST pour la sécurité en construction au Québec. Chaque liste couvre les vérifications avant, pendant et après les travaux.",
          "Over 50 safety checklists aligned with CNESST standards for construction safety in Québec. Each checklist covers before, during and after work verifications.",
        )}
      </p>

      {categories.map((cat) => {
        const catTasks = getTasksForCategory(cat);
        return (
          <section key={cat} className="mt-14">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold sm:text-2xl">
                <Link
                  href={getCategoryPath(cat, locale)}
                  className="transition-colors hover:text-[var(--color-primary)]"
                >
                  {catLabel(cat, locale)}
                </Link>
              </h2>
              <span className="text-sm text-gray-400 dark:text-neutral-500">
                {catTasks.length} {l(locale, "listes", "checklists")}
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {catTasks.map((task) => (
                <TaskCard key={task.id} task={task} locale={locale} />
              ))}
            </div>
          </section>
        );
      })}

      <CTASection locale={locale} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// CATEGORY PAGE
// ═══════════════════════════════════════════════════════

export function CategoryLanding({
  category,
  locale,
}: {
  category: TaskCategory;
  locale: Locale;
}) {
  const catTasks = getTasksForCategory(category);
  const label = catLabel(category, locale);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 pt-28 sm:px-8 sm:pb-28 sm:pt-32">
      <Breadcrumbs
        items={[
          { label: l(locale, "Accueil", "Home"), href: "/" },
          {
            label: l(
              locale,
              "Listes de vérification",
              "Safety checklists",
            ),
            href: getChecklistsBasePath(locale),
          },
          { label: label },
        ]}
      />

      <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        {label}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-gray-600 dark:text-neutral-400">
        {l(
          locale,
          `${catTasks.length} listes de vérification CNESST pour les travaux de ${label.toLowerCase()} en construction au Québec.`,
          `${catTasks.length} CNESST safety checklists for ${label.toLowerCase()} in construction in Québec.`,
        )}
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {catTasks.map((task) => (
          <TaskCard key={task.id} task={task} locale={locale} />
        ))}
      </div>

      <CTASection locale={locale} />

      <div className="mt-14">
        <h2 className="mb-4 font-heading text-lg font-bold">
          {l(locale, "Autres catégories", "Other categories")}
        </h2>
        <div className="flex flex-wrap gap-2">
          {getAllCategories()
            .filter((c) => c !== category)
            .map((cat) => (
              <Link
                key={cat}
                href={getCategoryPath(cat, locale)}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)] dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-[var(--color-primary)]/30"
              >
                {catLabel(cat, locale)}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// TASK PAGE
// ═══════════════════════════════════════════════════════

export function TaskLanding({
  task,
  locale,
}: {
  task: Task;
  locale: Locale;
}) {
  const raw = checklists[task.id];
  const phases = raw ? mergePhases(raw.phases) : null;
  const totalItems = phases?.reduce((sum, p) => sum + p.items.length, 0) ?? 0;
  const relatedTasks = getTasksForCategory(
    task.category as TaskCategory,
  ).filter((t) => t.id !== task.id);
  const title = tTitle(task, locale);
  const desc = tDesc(task, locale);
  const catLbl = catLabel(task.category as TaskCategory, locale);

  return (
    <div className="mx-auto max-w-4xl px-5 pb-20 pt-28 sm:px-8 sm:pb-28 sm:pt-32">
      <Breadcrumbs
        items={[
          { label: l(locale, "Accueil", "Home"), href: "/" },
          {
            label: l(
              locale,
              "Listes de vérification",
              "Safety checklists",
            ),
            href: getChecklistsBasePath(locale),
          },
          { label: catLbl, href: getCategoryPath(task.category, locale) },
          { label: title },
        ]}
      />

      <div className="mb-10">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
          <TaskIcon taskId={task.id} className="h-7 w-7" />
        </div>
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          {l(locale, "Liste de vérification — ", "Safety checklist — ")}
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-gray-600 dark:text-neutral-400">
          {desc}.{" "}
          {l(
            locale,
            "Conforme aux normes du Code de sécurité pour les travaux de construction (CSTC) et de la CNESST.",
            "Compliant with Québec's Construction Safety Code (CSTC) and CNESST standards.",
          )}
        </p>
      </div>

      {phases ? (
        <ChecklistPreview
          phases={phases}
          locale={locale}
          totalItems={totalItems}
        />
      ) : (
        <p className="italic text-gray-500">
          {l(
            locale,
            "Liste de vérification en cours de rédaction.",
            "Checklist coming soon.",
          )}
        </p>
      )}

      {relatedTasks.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-6 font-heading text-xl font-bold">
            {l(
              locale,
              `Autres listes — ${catLbl}`,
              `More checklists — ${catLbl}`,
            )}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedTasks.slice(0, 6).map((rt) => (
              <TaskCard key={rt.id} task={rt} locale={locale} />
            ))}
          </div>
          {relatedTasks.length > 6 && (
            <div className="mt-4 text-center">
              <Link
                href={getCategoryPath(task.category, locale)}
                className="text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                {l(
                  locale,
                  `Voir les ${relatedTasks.length + 1} listes`,
                  `See all ${relatedTasks.length + 1} checklists`,
                )}{" "}
                →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// JSON-LD
// ═══════════════════════════════════════════════════════

export function TaskJsonLd({
  task,
  locale,
}: {
  task: Task;
  locale: Locale;
}) {
  const raw = checklists[task.id];
  if (!raw) return null;

  const phases = mergePhases(raw.phases);
  const title = tTitle(task, locale);
  const desc = tDesc(task, locale);

  const data = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `${l(locale, "Liste de vérification", "Safety checklist")} — ${title}`,
    description: desc,
    step: phases.map((phase) => ({
      "@type": "HowToSection",
      name: phTitle(phase.title, locale),
      itemListElement: phase.items.map((item, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        text: iLabel(item, locale),
      })),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function CategoryJsonLd({
  category,
  locale,
}: {
  category: TaskCategory;
  locale: Locale;
}) {
  const catTasks = getTasksForCategory(category);
  const label = catLabel(category, locale);

  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: label,
    description: l(
      locale,
      `Listes de vérification CNESST — ${label}`,
      `CNESST safety checklists — ${label}`,
    ),
    numberOfItems: catTasks.length,
    itemListElement: catTasks.map((task, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: tTitle(task, locale),
      url: `https://ok-securite.com${getTaskPath(task.id, locale)}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
