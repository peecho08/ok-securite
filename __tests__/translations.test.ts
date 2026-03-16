import { describe, it, expect } from "vitest";
import { translations } from "@/lib/translations";

describe("translations", () => {
  const frKeys = Object.keys(translations.fr);
  const enKeys = Object.keys(translations.en);

  it("has both fr and en locales", () => {
    expect(translations).toHaveProperty("fr");
    expect(translations).toHaveProperty("en");
  });

  it("fr and en have the same keys", () => {
    const missingInEn = frKeys.filter((k) => !enKeys.includes(k));
    const missingInFr = enKeys.filter((k) => !frKeys.includes(k));

    expect(missingInEn).toEqual([]);
    expect(missingInFr).toEqual([]);
  });

  it("no empty string values in fr", () => {
    for (const [key, value] of Object.entries(translations.fr)) {
      if (typeof value === "string") {
        expect(value.length, `fr.${key} is empty`).toBeGreaterThan(0);
      }
    }
  });

  it("no empty string values in en", () => {
    for (const [key, value] of Object.entries(translations.en)) {
      if (typeof value === "string") {
        expect(value.length, `en.${key} is empty`).toBeGreaterThan(0);
      }
    }
  });

  it("does not contain scan-related keys", () => {
    const scanKeys = frKeys.filter((k) => k.startsWith("task.scan"));
    expect(scanKeys).toEqual([]);
  });
});
