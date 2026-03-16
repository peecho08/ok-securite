import { describe, it, expect } from "vitest";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

describe("escapeHtml", () => {
  it("escapes angle brackets", () => {
    expect(escapeHtml("<script>alert('xss')</script>")).toBe(
      "&lt;script&gt;alert('xss')&lt;/script&gt;"
    );
  });

  it("escapes ampersands", () => {
    expect(escapeHtml("A & B")).toBe("A &amp; B");
  });

  it("escapes double quotes", () => {
    expect(escapeHtml('He said "hello"')).toBe("He said &quot;hello&quot;");
  });

  it("leaves safe strings unchanged", () => {
    expect(escapeHtml("Jean Dupont")).toBe("Jean Dupont");
  });

  it("handles empty string", () => {
    expect(escapeHtml("")).toBe("");
  });

  it("handles accented characters", () => {
    expect(escapeHtml("Sécurité & Prévention")).toBe(
      "Sécurité &amp; Prévention"
    );
  });
});
