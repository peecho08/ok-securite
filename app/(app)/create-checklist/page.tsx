"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { getCustomTasks, getCustomChecklist, saveCustomTask, deleteCustomTask } from "@/lib/storage";
import type { Task, Checklist, ChecklistItem } from "@/types";
import { ArrowLeft, AlertTriangle, Plus, Trash2, GripVertical } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface ItemDraft {
  key: string;
  label: string;
  critical: boolean;
}

function newKey() {
  return Math.random().toString(36).slice(2, 10);
}

function emptyItem(): ItemDraft {
  return { key: newKey(), label: "", critical: false };
}

export default function CreateChecklistPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { t } = useLocale();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [beforeItems, setBeforeItems] = useState<ItemDraft[]>([emptyItem()]);
  const [afterItems, setAfterItems] = useState<ItemDraft[]>([emptyItem()]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!editId) { setLoaded(true); return; }
    const task = getCustomTasks().find((t) => t.id === editId);
    const cl = getCustomChecklist(editId);
    if (task && cl) {
      setTitle(task.title);
      setDescription(task.description || "");
      const avant = cl.phases.find((p) => p.phase === "avant");
      const fin = cl.phases.find((p) => p.phase === "fin");
      if (avant && avant.items.length > 0) {
        setBeforeItems(avant.items.map((item) => ({ key: item.id, label: item.label, critical: !!item.critical })));
      }
      if (fin && fin.items.length > 0) {
        setAfterItems(fin.items.map((item) => ({ key: item.id, label: item.label, critical: !!item.critical })));
      }
    }
    setLoaded(true);
  }, [editId]);

  const updateItem = useCallback((
    setter: React.Dispatch<React.SetStateAction<ItemDraft[]>>,
    key: string,
    patch: Partial<ItemDraft>,
  ) => {
    setter((prev) => prev.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  }, []);

  const removeItem = useCallback((
    setter: React.Dispatch<React.SetStateAction<ItemDraft[]>>,
    key: string,
  ) => {
    setter((prev) => {
      const next = prev.filter((item) => item.key !== key);
      return next.length === 0 ? [emptyItem()] : next;
    });
  }, []);

  const addItem = useCallback((setter: React.Dispatch<React.SetStateAction<ItemDraft[]>>) => {
    setter((prev) => [...prev, emptyItem()]);
  }, []);

  function handleSave() {
    setError("");
    const trimmedTitle = title.trim();
    if (!trimmedTitle) { setError(t("customCl.needTitle")); return; }

    const validBefore = beforeItems.filter((i) => i.label.trim());
    const validAfter = afterItems.filter((i) => i.label.trim());
    if (validBefore.length === 0 && validAfter.length === 0) {
      setError(t("customCl.needItems"));
      return;
    }

    const taskId = editId || `custom-${Date.now()}`;

    const toChecklistItems = (items: ItemDraft[], prefix: string): ChecklistItem[] =>
      items.map((item, i) => ({
        id: item.key.startsWith("custom-") || item.key.length === 8 ? item.key : `${prefix}-${i}`,
        label: item.label.trim(),
        ...(item.critical ? { critical: true } : {}),
      }));

    const task: Task = {
      id: taskId,
      title: trimmedTitle,
      icon: "ClipboardPen",
      description: description.trim(),
      category: "custom",
      custom: true,
    };

    const checklist: Checklist = {
      taskId,
      phases: [
        ...(validBefore.length > 0
          ? [{ phase: "avant" as const, title: "Avant les travaux", items: toChecklistItems(validBefore, `${taskId}-a`) }]
          : []),
        ...(validAfter.length > 0
          ? [{ phase: "fin" as const, title: "Fin des travaux", items: toChecklistItems(validAfter, `${taskId}-f`) }]
          : []),
      ],
    };

    saveCustomTask(task, checklist);
    if (!editId) {
      trackEvent("custom_checklist_created", {
        item_count: validBefore.length + validAfter.length,
      });
    }
    router.push("/");
  }

  function handleDelete() {
    if (!editId) return;
    if (!confirm(t("customCl.deleteConfirm"))) return;
    deleteCustomTask(editId);
    router.push("/");
  }

  if (!loaded) return null;

  return (
    <div className="mx-auto min-h-dvh w-full max-w-3xl bg-white dark:bg-neutral-900">
      <header className="sticky top-0 z-30 flex items-center gap-3 bg-white/95 px-5 py-4 backdrop-blur dark:bg-neutral-900/95 sm:px-8">
        <Link
          href="/my-checklists"
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 active:bg-gray-200 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-heading text-lg font-bold">
          {editId ? t("customCl.editTitle") : t("customCl.createTitle")}
        </h1>
      </header>

      <main className="px-5 py-5 sm:px-8">
        {/* Title */}
        <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-neutral-200">
          {t("customCl.title")}
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("customCl.titlePlaceholder")}
          className="mb-4 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none placeholder:text-gray-400 focus:border-gray-400 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:placeholder:text-neutral-500 dark:focus:border-neutral-500 dark:focus:bg-neutral-700"
          autoFocus
        />

        {/* Description */}
        <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-neutral-200">
          {t("customCl.description")}
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("customCl.descriptionPlaceholder")}
          className="mb-4 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none placeholder:text-gray-400 focus:border-gray-400 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:placeholder:text-neutral-500 dark:focus:border-neutral-500 dark:focus:bg-neutral-700"
        />

        {/* Before items */}
        <ItemSection
          label={t("customCl.beforeItems")}
          items={beforeItems}
          onUpdate={(key, patch) => updateItem(setBeforeItems, key, patch)}
          onRemove={(key) => removeItem(setBeforeItems, key)}
          onAdd={() => addItem(setBeforeItems)}
          t={t}
        />

        {/* After items */}
        <ItemSection
          label={t("customCl.afterItems")}
          items={afterItems}
          onUpdate={(key, patch) => updateItem(setAfterItems, key, patch)}
          onRemove={(key) => removeItem(setAfterItems, key)}
          onAdd={() => addItem(setAfterItems)}
          t={t}
        />

        {/* Error */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Save */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full rounded-xl bg-[var(--color-primary)] py-4 font-heading text-base font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)] active:bg-[var(--color-primary-dark)]"
        >
          {t("customCl.save")}
        </button>

        {/* Delete (edit mode only) */}
        {editId && (
          <button
            type="button"
            onClick={handleDelete}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-3.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            <Trash2 className="h-4 w-4" />
            {t("customCl.delete")}
          </button>
        )}
      </main>
    </div>
  );
}

function ItemSection({
  label,
  items,
  onUpdate,
  onRemove,
  onAdd,
  t,
}: {
  label: string;
  items: ItemDraft[];
  onUpdate: (key: string, patch: Partial<ItemDraft>) => void;
  onRemove: (key: string) => void;
  onAdd: () => void;
  t: (key: string) => string;
}) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
        {label}
      </h2>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-start gap-2 rounded-xl border border-gray-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <GripVertical className="mt-2.5 h-4 w-4 shrink-0 text-gray-300 dark:text-neutral-600" />
            <div className="min-w-0 flex-1">
              <input
                type="text"
                value={item.label}
                onChange={(e) => onUpdate(item.key, { label: e.target.value })}
                placeholder={t("customCl.itemPlaceholder")}
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-neutral-500"
              />
              <button
                type="button"
                onClick={() => onUpdate(item.key, { critical: !item.critical })}
                className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold transition-colors ${
                  item.critical
                    ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                    : "bg-gray-100 text-gray-400 dark:bg-neutral-700 dark:text-neutral-500"
                }`}
              >
                <AlertTriangle className="h-3 w-3" />
                {t("customCl.critical")}
              </button>
            </div>
            <button
              type="button"
              onClick={() => onRemove(item.key)}
              className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-neutral-500 dark:hover:bg-red-950 dark:hover:text-red-400"
              aria-label={t("site.remove")}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-600 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-600"
      >
        <Plus className="h-4 w-4" />
        {t("customCl.addItem")}
      </button>
    </section>
  );
}
