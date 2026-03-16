import { describe, it, expect } from "vitest";
import {
  completeChecklistSchema,
  createSiteSchema,
  updateSiteSchema,
} from "@/lib/schemas";

describe("completeChecklistSchema", () => {
  it("accepts valid input", () => {
    const input = {
      taskId: "travaux-hauteur",
      taskTitle: "Travaux en hauteur",
      checkedCount: 10,
      totalCount: 12,
    };
    const result = completeChecklistSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("accepts full input with optional fields", () => {
    const input = {
      taskId: "travaux-hauteur",
      taskTitle: "Travaux en hauteur",
      taskIcon: "🏗️",
      workerName: "Jean Dupont",
      siteName: "Chantier A",
      siteId: "site-123",
      checkedCount: 10,
      totalCount: 12,
      location: "Montréal",
    };
    const result = completeChecklistSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("rejects empty taskId", () => {
    const input = {
      taskId: "",
      taskTitle: "Test",
      checkedCount: 5,
      totalCount: 10,
    };
    const result = completeChecklistSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("rejects negative checkedCount", () => {
    const input = {
      taskId: "test",
      taskTitle: "Test",
      checkedCount: -1,
      totalCount: 10,
    };
    const result = completeChecklistSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("rejects totalCount of 0", () => {
    const input = {
      taskId: "test",
      taskTitle: "Test",
      checkedCount: 0,
      totalCount: 0,
    };
    const result = completeChecklistSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("rejects non-integer checkedCount", () => {
    const input = {
      taskId: "test",
      taskTitle: "Test",
      checkedCount: 5.5,
      totalCount: 10,
    };
    const result = completeChecklistSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("rejects missing required fields", () => {
    const result = completeChecklistSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects extra SQL injection in string fields", () => {
    const input = {
      taskId: "test'; DROP TABLE history;--",
      taskTitle: "Test",
      checkedCount: 5,
      totalCount: 10,
    };
    const result = completeChecklistSchema.safeParse(input);
    expect(result.success).toBe(true);
  });
});

describe("createSiteSchema", () => {
  it("accepts valid site with name only", () => {
    const result = createSiteSchema.safeParse({ name: "Chantier Nord" });
    expect(result.success).toBe(true);
  });

  it("accepts full site input", () => {
    const result = createSiteSchema.safeParse({
      name: "Chantier Nord",
      address: "123 Rue Principale, Montréal",
      lat: 45.5017,
      lng: -73.5673,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = createSiteSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects name over 200 chars", () => {
    const result = createSiteSchema.safeParse({ name: "a".repeat(201) });
    expect(result.success).toBe(false);
  });

  it("rejects invalid latitude", () => {
    const result = createSiteSchema.safeParse({ name: "Test", lat: 100 });
    expect(result.success).toBe(false);
  });

  it("rejects invalid longitude", () => {
    const result = createSiteSchema.safeParse({ name: "Test", lng: 200 });
    expect(result.success).toBe(false);
  });

  it("accepts null lat/lng", () => {
    const result = createSiteSchema.safeParse({
      name: "Test",
      lat: null,
      lng: null,
    });
    expect(result.success).toBe(true);
  });
});

describe("updateSiteSchema", () => {
  const validId = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

  it("accepts valid update with id only", () => {
    const result = updateSiteSchema.safeParse({ id: validId });
    expect(result.success).toBe(true);
  });

  it("accepts full update", () => {
    const result = updateSiteSchema.safeParse({
      id: validId,
      name: "Nouveau nom",
      address: "456 Rue",
      lat: 45.0,
      lng: -73.0,
      active: false,
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-UUID id", () => {
    const result = updateSiteSchema.safeParse({
      id: "not-a-uuid",
      name: "Test",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing id", () => {
    const result = updateSiteSchema.safeParse({ name: "Test" });
    expect(result.success).toBe(false);
  });

  it("rejects arbitrary extra fields", () => {
    const input = {
      id: validId,
      name: "Test",
      org_id: "hijacked-org",
      created_by: "hijacked-user",
    };
    const result = updateSiteSchema.safeParse(input);
    if (result.success) {
      expect(result.data).not.toHaveProperty("org_id");
      expect(result.data).not.toHaveProperty("created_by");
    }
  });
});
